#!/usr/bin/env node
/**
 * Smoke test de bout en bout contre le serveur de dev.
 *
 *   ADMIN_PASSWORD=... node scripts/smoke-test.mjs [BASE_URL]
 *
 * Couvre : page publique, connexion (bon/mauvais mot de passe), protection
 * des routes, CRUD projets, messages, maintenance, quiz, déconnexion.
 * Sortie non nulle si un échec.
 */
const BASE = process.argv[2] ?? "http://localhost:3000";
const PASSWORD = process.env.ADMIN_PASSWORD;
if (!PASSWORD) {
  console.error("ADMIN_PASSWORD manquant : ADMIN_PASSWORD=... node scripts/smoke-test.mjs");
  process.exit(2);
}

let failures = 0;
const results = [];
function check(name, cond, extra = "") {
  results.push({ name, ok: !!cond, extra });
  if (!cond) failures++;
  console.log(`${cond ? "✓" : "✗"} ${name}${extra ? ` — ${extra}` : ""}`);
}

let cookie = "";
async function req(path, { method = "GET", body, withAuth = true } = {}) {
  const headers = {};
  if (body !== undefined) headers["Content-Type"] = "application/json";
  if (withAuth && cookie) headers["Cookie"] = cookie;
  const res = await fetch(BASE + path, {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
    redirect: "manual",
  });
  const setCookie = res.headers.get("set-cookie");
  if (setCookie && setCookie.includes("nd_admin_session=")) {
    const pair = setCookie.split(";")[0];
    if (pair.includes("=;") || pair.endsWith("=")) cookie = ""; // déconnexion
    else cookie = pair;
  }
  let json = null;
  try {
    json = await res.json();
  } catch {
    /* pas de JSON */
  }
  return { res, json };
}

async function main() {
  /* ── 1. Page publique ── */
  const home = await fetch(BASE + "/");
  const homeHtml = await home.text();
  check("Page publique 200", home.status === 200);
  check("Page publique affiche les projets", /WeGroup|IMMOBILIER/i.test(homeHtml));

  /* ── 2. Routes admin déplacées ── */
  const oldRoute = await fetch(BASE + "/admin", { redirect: "manual" });
  check("/admin n'existe plus (404)", oldRoute.status === 404, `reçu ${oldRoute.status}`);
  const newRoute = await fetch(BASE + "/nousdev", { redirect: "manual" });
  check("/nousdev redirige vers login (non connecté)", newRoute.status >= 300 && newRoute.status < 400);

  /* ── 3. API protégée sans session ── */
  for (const p of ["/api/admin/projects", "/api/admin/messages", "/api/admin/quiz", "/api/admin/settings"]) {
    const { res } = await req(p, { withAuth: false });
    check(`401 sans session : ${p}`, res.status === 401, `reçu ${res.status}`);
  }

  /* ── 4. Connexion ── */
  const bad = await req("/api/admin/login", { method: "POST", body: { password: "faux" }, withAuth: false });
  check("Mauvais mot de passe → 401", bad.res.status === 401, `reçu ${bad.res.status}`);
  const good = await req("/api/admin/login", { method: "POST", body: { password: PASSWORD }, withAuth: false });
  check("Bon mot de passe → 200 + cookie", good.res.status === 200 && cookie.includes("nd_admin_session="));
  check("Cookie httpOnly", (good.res.headers.get("set-cookie") ?? "").toLowerCase().includes("httponly"));

  /* ── 5. CRUD projets ── */
  const id = "t" + Math.floor(Math.random() * 900 + 100);
  const projet = {
    id,
    title: "Projet smoke",
    year: "2026",
    kicker: "Smoke test",
    tags: ["Test"],
    desc: "Créé par le smoke test, à supprimer.",
    detail: { objective: "", blocks: [], facts: [] },
    from: "#111111",
    to: "#222222",
  };
  const create = await req("/api/admin/projects", { method: "POST", body: projet });
  check("Création projet → 201", create.res.status === 201, `reçu ${create.res.status}`);

  const dup = await req("/api/admin/projects", { method: "POST", body: projet });
  check("Doublon id → 409", dup.res.status === 409, `reçu ${dup.res.status}`);

  const invalid = await req("/api/admin/projects", { method: "POST", body: { id: "" } });
  check("Projet invalide → 400", invalid.res.status === 400, `reçu ${invalid.res.status}`);

  const list = await req("/api/admin/projects");
  const found = list.json?.projects?.find((p) => p.id === id);
  check("Projet créé visible dans la liste", !!found);

  const wrongId = await req(`/api/admin/projects/${id}`, {
    method: "PUT",
    body: { ...projet, title: "X", id: "autre" },
  });
  check("PUT id différent → 400", wrongId.res.status === 400, `reçu ${wrongId.res.status}`);

  const update = await req(`/api/admin/projects/${id}`, {
    method: "PUT",
    body: { ...projet, title: "Projet smoke modifié" },
  });
  check("Mise à jour projet → 200", update.res.status === 200, `reçu ${update.res.status}`);
  const after = await req("/api/admin/projects");
  check("Mise à jour visible", after.json?.projects?.find((p) => p.id === id)?.title === "Projet smoke modifié");

  const orderIds = (after.json?.projects ?? []).map((p) => p.id);
  const reordered = [...orderIds].reverse();
  const reorder = await req(`/api/admin/projects/${orderIds[0]}`, {
    method: "PATCH",
    body: { order: reordered },
  });
  check("Réordonnancement → 200", reorder.res.status === 200, `reçu ${reorder.res.status}`);
  const reorderedList = await req("/api/admin/projects");
  check("Nouvel ordre appliqué", (reorderedList.json?.projects ?? []).map((p) => p.id).join(",") === reordered.join(","));

  const badOrder = await req(`/api/admin/projects/${orderIds[0]}`, {
    method: "PATCH",
    body: { order: ["inconnu"] },
  });
  check("Ordre invalide → 400", badOrder.res.status === 400, `reçu ${badOrder.res.status}`);

  // Remettre l'ordre d'origine pour ne pas perturber le site.
  await req(`/api/admin/projects/${orderIds[0]}`, { method: "PATCH", body: { order: orderIds } });

  const del = await req(`/api/admin/projects/${id}`, { method: "DELETE" });
  check("Suppression projet → 200", del.res.status === 200, `reçu ${del.res.status}`);
  const gone = await req("/api/admin/projects");
  check("Projet supprimé de la liste", !gone.json?.projects?.some((p) => p.id === id));

  const del404 = await req(`/api/admin/projects/${id}`, { method: "DELETE" });
  check("Suppression id inexistant → 404", del404.res.status === 404, `reçu ${del404.res.status}`);

  /* ── 6. Messages ── */
  const form = new URLSearchParams({
    nom: "Smoke Test",
    email: "smoke@test.com",
    tel: "+22990000002",
    projet: "Test",
    budget: "0",
    delai: "0",
    message: "Message créé par le smoke test.",
  });
  const contact = await fetch(BASE + "/", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded", Cookie: "" },
    body: form,
    redirect: "manual",
  }).catch(() => null);
  // Le formulaire est une server action : on vérifie surtout l'API admin.
  const msgs = await req("/api/admin/messages");
  check("Liste messages → 200", msgs.res.status === 200 && Array.isArray(msgs.json?.messages ?? msgs.json));

  const msgList = msgs.json?.messages ?? msgs.json ?? [];
  if (msgList.length > 0) {
    const m = msgList[0];
    const patched = await req(`/api/admin/messages/${m.id}`, { method: "PATCH", body: { isRead: !m.isRead } });
    check("Marquer lu/non-lu → 200", patched.res.status === 200, `reçu ${patched.res.status}`);
    const back = await req(`/api/admin/messages/${m.id}`, { method: "PATCH", body: { isRead: m.isRead } });
    check("Retour état initial → 200", back.res.status === 200);
  }
  const badMsg = await req("/api/admin/messages/abc", { method: "PATCH", body: { isRead: true } });
  check("Id message invalide → 400", badMsg.res.status === 400, `reçu ${badMsg.res.status}`);

  /* ── 7. Maintenance ── */
  const on = await req("/api/admin/settings", { method: "PATCH", body: { maintenance: true } });
  check("Activation maintenance → 200", on.res.status === 200 && on.json?.maintenance === true);
  const publicDuring = await fetch(BASE + "/");
  const publicHtml = await publicDuring.text();
  check("Public voit la maintenance", /maintenance/i.test(publicHtml) && !/WeGroup/i.test(publicHtml));
  const adminDuring = await fetch(BASE + "/", { headers: { Cookie: cookie } });
  check("Admin connecté voit le vrai site", /WeGroup/i.test(await adminDuring.text()));

  const off = await req("/api/admin/settings", { method: "PATCH", body: { maintenance: false } });
  check("Désactivation maintenance → 200", off.res.status === 200 && off.json?.maintenance === false);
  const publicAfter = await fetch(BASE + "/");
  check("Public retrouve le site", /WeGroup/i.test(await publicAfter.text()));

  const badSettings = await req("/api/admin/settings", { method: "PATCH", body: { maintenance: "oui" } });
  check("Corps réglages invalide → 400", badSettings.res.status === 400, `reçu ${badSettings.res.status}`);

  /* ── 8. Quiz admin ── */
  const quiz = await req("/api/admin/quiz");
  check("Liste quiz → 200", quiz.res.status === 200 && Array.isArray(quiz.json?.results));

  /* ── 9. Déconnexion ── */
  const out = await req("/api/admin/logout", { method: "POST" });
  check("Déconnexion → 200 + cookie vidée", out.res.status === 200 && cookie === "");
  const afterOut = await req("/api/admin/projects");
  check("401 après déconnexion", afterOut.res.status === 401, `reçu ${afterOut.res.status}`);

  /* ── Bilan ── */
  console.log(`\n${results.length - failures}/${results.length} vérifications réussies.`);
  if (contact && contact.status >= 400) {
    console.log(`(info) formulaire contact via fetch brut : ${contact.status} — la server action gère le flux réel.`);
  }
  process.exit(failures === 0 ? 0 : 1);
}

main().catch((err) => {
  console.error("Erreur fatale du smoke test :", err);
  process.exit(1);
});
