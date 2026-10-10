import { createClient, type Client } from "@libsql/client";
import { mkdirSync } from "node:fs";
import path from "node:path";

/**
 * Base de données via libSQL.
 *
 * - En développement : fichier local `file:./data/portfolio.db` (aucun serveur requis).
 * - En production (Vercel, disque en lecture seule) : base Turso via
 *   TURSO_DATABASE_URL + TURSO_AUTH_TOKEN. Même driver, même SQL.
 *
 * Le client est mis en cache sur globalThis pour survivre au HMR en dev.
 */

const globalForDb = globalThis as unknown as { __db?: Client; __dbInit?: Promise<void> };

function createDb(): Client {
  const url = process.env.TURSO_DATABASE_URL;
  if (url) {
    const authToken = process.env.TURSO_AUTH_TOKEN;
    if (!authToken) {
      throw new Error("TURSO_AUTH_TOKEN manquant : requis avec TURSO_DATABASE_URL.");
    }
    return createClient({ url, authToken });
  }
  // Dev : fichier local. Le dossier data/ est dans .gitignore.
  // libSQL ne crée pas le dossier parent : on le crée avant d'ouvrir le fichier.
  const file = path.join(process.cwd(), "data", "portfolio.db");
  mkdirSync(path.dirname(file), { recursive: true });
  return createClient({ url: `file:${file}` });
}

export function db(): Client {
  if (!globalForDb.__db) globalForDb.__db = createDb();
  return globalForDb.__db;
}

/** Crée les tables si elles n'exexistent pas. Idempotent. */
export async function initDb(): Promise<void> {
  if (globalForDb.__dbInit) return globalForDb.__dbInit;
  globalForDb.__dbInit = (async () => {
    const client = db();
    await client.batch(
      [
        `CREATE TABLE IF NOT EXISTS projects (
           id         TEXT PRIMARY KEY,
           sort_order INTEGER NOT NULL DEFAULT 0,
           data       TEXT NOT NULL,
           updated_at TEXT NOT NULL DEFAULT (datetime('now'))
         )`,
        `CREATE TABLE IF NOT EXISTS messages (
           id         INTEGER PRIMARY KEY AUTOINCREMENT,
           nom        TEXT NOT NULL,
           email      TEXT NOT NULL,
           tel        TEXT NOT NULL,
           projet     TEXT NOT NULL,
           budget     TEXT NOT NULL,
           delai      TEXT NOT NULL,
           message    TEXT NOT NULL,
           is_read    INTEGER NOT NULL DEFAULT 0,
           created_at TEXT NOT NULL DEFAULT (datetime('now'))
         )`,
        `CREATE TABLE IF NOT EXISTS settings (
           key   TEXT PRIMARY KEY,
           value TEXT NOT NULL
         )`,
        `CREATE TABLE IF NOT EXISTS quiz_results (
           id         INTEGER PRIMARY KEY AUTOINCREMENT,
           email      TEXT,
           answer     TEXT,
           score      INTEGER,
           track      TEXT,
           created_at TEXT NOT NULL DEFAULT (datetime('now'))
         )`,
        // Index pour les listes triées par date.
        `CREATE INDEX IF NOT EXISTS idx_messages_created ON messages(created_at DESC)`,
        `CREATE INDEX IF NOT EXISTS idx_quiz_created ON quiz_results(created_at DESC)`,
      ],
      "write"
    );
  })();
  globalForDb.__dbInit.catch(() => {
    // Permettre un nouvel essai si l'init a échoué (ex. DB injoignable au démarrage).
    globalForDb.__dbInit = undefined;
  });
  return globalForDb.__dbInit;
}

/** Lecture d'un réglage clé/valeur (null si absent). */
export async function getSetting(key: string): Promise<string | null> {
  await initDb();
  const rs = await db().execute({ sql: "SELECT value FROM settings WHERE key = ?", args: [key] });
  const v = rs.rows[0]?.value;
  return typeof v === "string" ? v : null;
}

/** Écriture (upsert) d'un réglage. */
export async function setSetting(key: string, value: string): Promise<void> {
  await initDb();
  await db().execute({
    sql: `INSERT INTO settings (key, value) VALUES (?, ?)
          ON CONFLICT(key) DO UPDATE SET value = excluded.value`,
    args: [key, value],
  });
}

/** Vrai si le site est en maintenance (défaut : faux). */
export async function isMaintenance(): Promise<boolean> {
  const v = await getSetting("maintenance");
  return v === "1";
}
