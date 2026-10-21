import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Standalone build → schlankes Runtime-Image für k8s
  output: "standalone",
  reactStrictMode: true,
  poweredByHeader: false,
  // Fruehere Varianten -> Startseite
  async redirects() {
    return ["1", "2", "3"].map((v) => ({ source: `/:locale(en|de|ar)/${v}`, destination: "/:locale", permanent: true }));
  },
};

export default nextConfig;
