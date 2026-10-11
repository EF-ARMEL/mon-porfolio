import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  outputFileTracingIncludes: { "/api/quiz/reward": ["./private/ettien-franck-armel-nousdev.pdf"] },
};

export default nextConfig;
