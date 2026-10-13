"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { QuizResult } from "@/lib/admin/quiz";

/* ───────────────────────── Quiz ───────────────────────── */

export function QuizTab({ initial }: { initial: QuizResult[] }) {
  const [results] = useState(initial);

  if (results.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-white/15 px-6 py-16 text-center text-white/40">
        Aucune réussite au quiz pour l&apos;instant.
      </div>
    );
  }

  return (
    <>
      <p className="mb-4 text-sm text-white/50">
        {results.length} personne(s) ont réussi la question secrète.
      </p>
      <ul className="flex flex-col gap-2">
        {results.map((r) => (
          <li
            key={r.id}
            className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/[0.02] px-5 py-4"
          >
            <span className="min-w-0">
              {r.email ? (
                <a href={`mailto:${r.email}`} className="block truncate font-bold text-[#FF6A00] hover:underline">
                  {r.email}
                </a>
              ) : (
                <b className="block text-white/50">Anonyme</b>
              )}
              {r.answer && (
                <span className="mt-1 block truncate text-xs text-white/40">
                  Réponse : « {r.answer} »
                </span>
              )}
            </span>
            <span className="shrink-0 text-xs text-white/30">{r.createdAt}</span>
          </li>
        ))}
      </ul>
    </>
  );
}

/* ───────────────────────── Réglages ───────────────────────── */

export function SettingsTab({ initial }: { initial: boolean }) {
  const router = useRouter();
  const [maintenance, setMaintenance] = useState(initial);
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState(false);

  const toggle = async () => {
    const next = !maintenance;
    setBusy(true);
    setSaved(false);
    setError(false);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ maintenance: next }),
      });
      const data = (await res.json().catch(() => null)) as { ok?: boolean } | null;
      if (!res.ok || !data?.ok) {
        // L'API a refusé (session expirée, corps invalide…) : on revient à l'état réel.
        setMaintenance(!next);
        setError(true);
        return;
      }
      setMaintenance(next);
      setSaved(true);
      router.refresh();
    } catch {
      setMaintenance(!next);
      setError(true);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="max-w-xl">
      <h2 className="font-[family-name:var(--font-archivo)] text-xl uppercase">Réglages du site</h2>

      <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.02] p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <b className="block">Mode maintenance</b>
            <p className="mt-1 text-sm text-white/50">
              Active-le pour afficher une page « site en maintenance » aux visiteurs. Toi, connecté, garde
              l&apos;accès normal au site et à l&apos;admin.
            </p>
          </div>

          <button
            role="switch"
            aria-checked={maintenance}
            aria-label="Mode maintenance"
            onClick={toggle}
            disabled={busy}
            className={`relative h-8 w-14 shrink-0 cursor-pointer rounded-full transition-colors disabled:opacity-50 ${
              maintenance ? "bg-[#FF6A00]" : "bg-white/15"
            }`}
          >
            <span
              className={`absolute top-1 h-6 w-6 rounded-full bg-white transition-transform ${
                maintenance ? "translate-x-7" : "translate-x-1"
              }`}
            />
          </button>
        </div>

        <p
          className={`mt-4 text-xs font-bold uppercase tracking-wider ${
            maintenance ? "text-[#FF6A00]" : "text-emerald-400"
          }`}
        >
          {maintenance ? "⚠ Site en maintenance" : "✓ Site en ligne"}
        </p>
        {saved && <p className="mt-2 text-xs text-white/40">Réglage enregistré.</p>}
        {error && (
          <p role="alert" className="mt-2 text-xs font-bold text-[#ff6b6b]">
            Enregistrement impossible. Réessaie (ou reconnecte-toi).
          </p>
        )}
      </div>

      <PasswordCard />
    </div>
  );
}

/* ───────────────────────── Mot de passe ───────────────────────── */

const PWD_ERRORS: Record<string, string> = {
  invalid_current: "Mot de passe actuel incorrect.",
  same_password: "Le nouveau mot de passe doit être différent de l'actuel.",
  invalid_body: "Vérifie les champs : 8 caractères minimum.",
  rate_limited: "Trop de tentatives. Réessaie dans quelques minutes.",
  unauthorized: "Session expirée — reconnecte-toi.",
};

function PasswordCard() {
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (busy) return;
    setMsg(null);
    if (next.length < 8) {
      setMsg({ ok: false, text: "Le nouveau mot de passe doit faire 8 caractères minimum." });
      return;
    }
    if (next !== confirm) {
      setMsg({ ok: false, text: "Les deux nouveaux mots de passe ne correspondent pas." });
      return;
    }
    setBusy(true);
    try {
      const res = await fetch("/api/admin/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ current, next }),
      });
      const data = (await res.json().catch(() => null)) as { ok?: boolean; error?: string } | null;
      if (res.ok && data?.ok) {
        setMsg({ ok: true, text: "Mot de passe modifié — utilise-le dès ta prochaine connexion." });
        setCurrent("");
        setNext("");
        setConfirm("");
      } else {
        setMsg({ ok: false, text: PWD_ERRORS[data?.error ?? ""] ?? "Changement impossible. Réessaie." });
      }
    } catch {
      setMsg({ ok: false, text: "Impossible de joindre le serveur." });
    } finally {
      setBusy(false);
    }
  };

  const input =
    "mt-2 h-11 w-full rounded-xl border border-white/10 bg-white/[0.04] px-3 text-sm text-white outline-none transition focus:border-[#FF6A00]";
  const label = "block text-[11px] font-bold uppercase tracking-[0.15em] text-white/50";

  return (
    <form onSubmit={submit} className="mt-4 rounded-2xl border border-white/10 bg-white/[0.02] p-5">
      <b className="block">Changer le mot de passe</b>
      <p className="mt-1 text-sm text-white/50">
        Appliqué à ta prochaine connexion. Les sessions déjà ouvertes restent valables jusqu&apos;à leur
        expiration.
      </p>

      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <label className={label}>
          Actuel
          <input
            type="password"
            autoComplete="current-password"
            value={current}
            onChange={(e) => setCurrent(e.target.value)}
            className={input}
          />
        </label>
        <label className={label}>
          Nouveau
          <input
            type={show ? "text" : "password"}
            autoComplete="new-password"
            value={next}
            onChange={(e) => setNext(e.target.value)}
            className={input}
          />
        </label>
        <label className={label}>
          Confirmer
          <input
            type={show ? "text" : "password"}
            autoComplete="new-password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            className={input}
          />
        </label>
      </div>

      <div className="mt-4 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => setShow((v) => !v)}
          className="cursor-pointer text-xs font-bold uppercase tracking-wider text-white/50 transition hover:text-white"
        >
          {show ? "Masquer les champs" : "Afficher les champs"}
        </button>
        <button
          type="submit"
          disabled={busy || !current || !next}
          className="cursor-pointer rounded-full bg-[#FF6A00] px-5 py-2 text-xs font-bold uppercase tracking-wider text-black transition disabled:cursor-not-allowed disabled:opacity-50"
        >
          {busy ? "Enregistrement…" : "Modifier"}
        </button>
      </div>

      {msg && (
        <p
          role={msg.ok ? "status" : "alert"}
          className={`mt-3 text-xs font-bold ${msg.ok ? "text-emerald-400" : "text-[#ff6b6b]"}`}
        >
          {msg.text}
        </p>
      )}
    </form>
  );
}
