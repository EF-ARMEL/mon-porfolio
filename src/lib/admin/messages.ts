import { initDb, db } from "@/lib/db";

/**
 * Boîte de réception des messages de contact.
 * Chaque message est inséré ici ET envoyé par e-mail (voir actions/contact.ts).
 */

export type Message = {
  id: number;
  nom: string;
  email: string;
  tel: string;
  projet: string;
  budget: string;
  delai: string;
  message: string;
  isRead: boolean;
  createdAt: string;
};

type Row = Record<string, unknown>;

function toMessage(row: Row): Message {
  return {
    id: Number(row.id),
    nom: String(row.nom),
    email: String(row.email),
    tel: String(row.tel),
    projet: String(row.projet),
    budget: String(row.budget),
    delai: String(row.delai),
    message: String(row.message),
    isRead: Number(row.is_read) === 1,
    createdAt: String(row.created_at),
  };
}

export type NewMessage = Omit<Message, "id" | "isRead" | "createdAt">;

/** Enregistre un message reçu via le formulaire de contact. */
export async function saveMessage(data: NewMessage): Promise<void> {
  await initDb();
  await db().execute({
    sql: `INSERT INTO messages (nom, email, tel, projet, budget, delai, message)
          VALUES (?, ?, ?, ?, ?, ?, ?)`,
    args: [data.nom, data.email, data.tel, data.projet, data.budget, data.delai, data.message],
  });
}

/** Liste des messages, du plus récent au plus ancien. */
export async function listMessages(): Promise<Message[]> {
  await initDb();
  const rs = await db().execute("SELECT * FROM messages ORDER BY created_at DESC, id DESC");
  return rs.rows.map(toMessage);
}

/** Marque un message comme lu (ou non lu). */
export async function setMessageRead(id: number, isRead: boolean): Promise<void> {
  await initDb();
  await db().execute({ sql: "UPDATE messages SET is_read = ? WHERE id = ?", args: [isRead ? 1 : 0, id] });
}

/** Supprime un message. */
export async function deleteMessage(id: number): Promise<void> {
  await initDb();
  await db().execute({ sql: "DELETE FROM messages WHERE id = ?", args: [id] });
}

/** Nombre de messages non lus (badge). */
export async function countUnread(): Promise<number> {
  await initDb();
  const rs = await db().execute("SELECT COUNT(*) AS n FROM messages WHERE is_read = 0");
  return Number(rs.rows[0]?.n ?? 0);
}
