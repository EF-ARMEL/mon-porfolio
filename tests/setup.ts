/**
 * Environnement de test isolé :
 * - secrets de test (jamais ceux de .env.local)
 * - base SQLite dans un fichier temporaire (ne touche jamais à data/portfolio.db)
 */
import { scryptSync } from "node:crypto";
import { tmpdir } from "node:os";
import path from "node:path";

// Base de test : fichier temporaire unique par exécution.
const testDb = path.join(tmpdir(), `portfolio-test-${process.pid}-${Date.now()}.db`);
process.env.TURSO_DATABASE_URL = `file:${testDb}`;
process.env.TURSO_AUTH_TOKEN = "test-token-insecure";

// Secrets de test (dérivés déterministes pour que les assertions puissent recalculer).
process.env.ADMIN_SESSION_SECRET = "test-session-secret-0123456789abcdef0123456789abcdef";
process.env.QUIZ_SECRET = "test-quiz-secret-0123456789abcdef0123456789abcdef";
process.env.QUIZ_IDOL_ANSWERS = "Franck, Nousdev";
process.env.SMTP_HOST = ""; // pas d'envoi d'e-mail réel dans les tests

// Mot de passe de test : "Test1234" (haché avec le même sel que src/lib/admin/auth.ts).
export const TEST_PASSWORD = "Test1234";
const salt = Buffer.from(process.env.ADMIN_SESSION_SECRET.slice(0, 32));
process.env.ADMIN_PASSWORD_HASH = `scrypt:${scryptSync(TEST_PASSWORD, salt, 64).toString("hex")}`;
