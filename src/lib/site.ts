/**
 * URL publique du site, utilisée pour les métadonnées (OpenGraph), robots.txt et sitemap.xml.
 * Ordre : NEXT_PUBLIC_SITE_URL (domaine personnalisé) → domaine de production
 * Vercel (variable injectée automatiquement) → localhost en dev.
 */
export function siteUrl(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  return "http://localhost:3000";
}

export const SITE_NAME = "Nousdev";
export const SITE_TITLE = "Nousdev — Développeur web et mobile";
export const SITE_DESCRIPTION =
  "Développeur web et mobile passionné : je transforme vos idées en solutions digitales performantes, rapides et simples à utiliser.";
