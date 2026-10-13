import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  outputFileTracingIncludes: { "/api/quiz/reward": ["./private/ettien-franck-armel-nousdev.pdf"] },
  /* Pas de pastille « N » (dev indicator) pendant le développement :
     les erreurs de compilation/runtime restent affichées normalement. */
  devIndicators: false,
};

export default nextConfig;
