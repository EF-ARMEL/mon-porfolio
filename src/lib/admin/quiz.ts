import { initDb, db } from "@/lib/db";

/**
 * Journal des réussites au quiz (question secrète).
 * Chaque récompense envoyée est tracée ici pour le dashboard admin.
 */

export type QuizResult = {
  id: number;
  email: string | null;
  answer: string | null;
  score: number | null;
  track: string | null;
  createdAt: string;
};

export type NewQuizResult = {
  email?: string | null;
  answer?: string | null;
  score?: number | null;
  track?: string | null;
};

/** Enregistre une réussite (question secrète résolue / récompense réclamée). */
export async function logQuizResult(data: NewQuizResult): Promise<void> {
  await initDb();
  await db().execute({
    sql: `INSERT INTO quiz_results (email, answer, score, track) VALUES (?, ?, ?, ?)`,
    args: [data.email ?? null, data.answer ?? null, data.score ?? null, data.track ?? null],
  });
}

/** Liste des réussites, de la plus récente à la plus ancienne. */
export async function listQuizResults(): Promise<QuizResult[]> {
  await initDb();
  const rs = await db().execute("SELECT * FROM quiz_results ORDER BY created_at DESC, id DESC");
  return rs.rows.map((row) => ({
    id: Number(row.id),
    email: row.email == null ? null : String(row.email),
    answer: row.answer == null ? null : String(row.answer),
    score: row.score == null ? null : Number(row.score),
    track: row.track == null ? null : String(row.track),
    createdAt: String(row.created_at),
  }));
}
