import { NextResponse } from "next/server";
import { isAuthenticated } from "./auth";

/** Réponse 401 standard pour les routes admin non authentifiées. */
export const unauthorized = () =>
  NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });

/**
 * Vérifie la session admin. Retourne `null` si l'utilisateur est authentifié,
 * sinon une `NextResponse` 401 à retourner telle quelle.
 *
 * Usage dans une route :
 *   const guard = await requireAdmin();
 *   if (guard) return guard;
 */
export async function requireAdmin(): Promise<NextResponse | null> {
  return (await isAuthenticated()) ? null : unauthorized();
}
