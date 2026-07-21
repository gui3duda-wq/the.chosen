import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  // External packages to avoid bundling issues in serverless/standalone
  serverExternalPackages: ["@prisma/client", "sharp"],
  // Exclude heavy files from the standalone output
  outputFileTracingExcludes: {
    "*": ["./node_modules/.cache", "./.next/cache", "./public/uploads/**"],
  },
};

export default nextConfig;
