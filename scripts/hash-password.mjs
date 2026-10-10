#!/usr/bin/env node
/**
 * Génère le hachage scrypt d'un mot de passe admin.
 *
 *   node scripts/hash-password.mjs "mon-mot-de-passe"
 *
 * Colle le résultat dans ADMIN_PASSWORD_HASH (.env.local puis Vercel).
 * Le mot de passe n'est jamais stocké en clair nulle part.
 */
import { scryptSync } from "node:crypto";

const password = process.argv[2];
if (!password) {
  console.error('Usage : node scripts/hash-password.mjs "mon-mot-de-passe"');
  process.exit(1);
}

// Même dérivation de sel que src/lib/admin/auth.ts (32 premiers caractères du secret de session).
// En pratique le sel dépend d'ADMIN_SESSION_SECRET : génère le hachage APRÈS avoir défini ce secret.
const saltSource = process.env.ADMIN_SESSION_SECRET;
if (!saltSource || saltSource.length < 32) {
  console.error(
    "ADMIN_SESSION_SECRET doit être défini (32 caractères minimum) AVANT de générer le hachage.\n" +
      'Exemple : node -e "console.log(require(\'crypto\').randomBytes(32).toString(\'hex\'))"'
  );
  process.exit(1);
}

const salt = Buffer.from(saltSource.slice(0, 32));
const hash = scryptSync(password, salt, 64);
console.log(`scrypt:${hash.toString("hex")}`);
