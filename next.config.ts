import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Standalone build → schlankes Runtime-Image für k8s
  output: "standalone",
  reactStrictMode: true,
  poweredByHeader: false,
};

export default nextConfig;
