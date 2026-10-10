/**
 * Tests de la couche base : messages, projets (CRUD + seed), réglages, quiz.
 * La base est un fichier temporaire défini dans tests/setup.ts.
 */
import { beforeAll, describe, expect, it } from "vitest";
import { initDb, isMaintenance, setSetting } from "@/lib/db";
import { saveMessage, listMessages, setMessageRead, deleteMessage, countUnread } from "@/lib/admin/messages";
import {
  seedProjectsIfEmpty,
  listProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
} from "@/lib/admin/projects";
import { logQuizResult, listQuizResults } from "@/lib/admin/quiz";
import type { DetailProject } from "@/components/projects/ProjectDetail";

beforeAll(async () => {
  await initDb();
});

const msg = {
  nom: "Jean Test",
  email: "jean@test.com",
  tel: "+22990000000",
  projet: "Site vitrine",
  budget: "100k",
  delai: "1 mois",
  message: "Bonjour, ceci est un message de test.",
};

describe("messages", () => {
  it("sauvegarde, liste, marque lu, supprime", async () => {
    await saveMessage(msg);
    const all = await listMessages();
    const found = all.find((m) => m.email === "jean@test.com");
    expect(found).toBeDefined();
    expect(found?.nom).toBe("Jean Test");
    expect(found?.isRead).toBe(false);

    await setMessageRead(found!.id, true);
    const after = (await listMessages()).find((m) => m.id === found!.id);
    expect(after?.isRead).toBe(true);

    await setMessageRead(found!.id, false);
    const unread = await countUnread();
    expect(unread).toBeGreaterThanOrEqual(1);

    await deleteMessage(found!.id);
    expect((await listMessages()).find((m) => m.id === found!.id)).toBeUndefined();
  });
});

describe("projets", () => {
  it("seed au moins 3 projets, idempotent", async () => {
    await seedProjectsIfEmpty();
    const first = await listProjects();
    expect(first.length).toBeGreaterThanOrEqual(3);

    await seedProjectsIfEmpty(); // second appel : ne doit rien ajouter
    expect((await listProjects()).length).toBe(first.length);
  });

  it("CRUD complet", async () => {
    const p: DetailProject = {
      id: "99",
      title: "Projet jetable",
      year: "2026",
      kicker: "Test",
      tags: ["Test"],
      desc: "À supprimer.",
      detail: { objective: "", blocks: [], facts: [] },
      from: "#000000",
      to: "#ffffff",
    };

    await createProject(p, 99);
    const created = await getProject("99");
    expect(created?.title).toBe("Projet jetable");
    expect(created?.sortOrder).toBe(99);

    await updateProject("99", { ...p, title: "Renommé" }, 50);
    const updated = await getProject("99");
    expect(updated?.title).toBe("Renommé");
    expect(updated?.sortOrder).toBe(50);

    await deleteProject("99");
    expect(await getProject("99")).toBeNull();
  });

  it("l'ordre de tri est respecté", async () => {
    await seedProjectsIfEmpty();
    const all = await listProjects();
    const orders = all.map((p) => p.sortOrder);
    expect([...orders].sort((a, b) => a - b)).toEqual(orders);
  });
});

describe("réglages (maintenance)", () => {
  it("défaut : hors maintenance", async () => {
    // Le smoke test HTTP bascule le flag ; ici on vérifie les deux états.
    await setSetting("maintenance", "0");
    expect(await isMaintenance()).toBe(false);
  });

  it("bascule on/off", async () => {
    await setSetting("maintenance", "1");
    expect(await isMaintenance()).toBe(true);
    await setSetting("maintenance", "0");
    expect(await isMaintenance()).toBe(false);
  });
});

describe("quiz", () => {
  it("enregistre et liste les réussites", async () => {
    await logQuizResult({ email: "quiz@test.com", answer: "franck", score: 5, track: "dev" });
    const all = await listQuizResults();
    const found = all.find((r) => r.email === "quiz@test.com");
    expect(found).toBeDefined();
    expect(found?.score).toBe(5);
    expect(found?.track).toBe("dev");
    expect(found?.createdAt).toBeTruthy();
  });
});
