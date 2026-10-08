import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  outputFileTracingIncludes: { "/api/quiz/reward": ["./private/guide-vibe-coding-2026.pdf"] },
};

export default nextConfig;
