import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Dashboard admin et API : rien à indexer.
      disallow: ["/nousdev", "/api/"],
    },
    sitemap: `${siteUrl()}/sitemap.xml`,
  };
}
