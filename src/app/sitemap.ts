import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";

/** Site d'une seule page publique : la page d'accueil (les projets s'ouvrent en surimpression). */
export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: siteUrl(), changeFrequency: "monthly", priority: 1 }];
}
