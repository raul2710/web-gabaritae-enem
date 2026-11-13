import path from "node:path";
import type { NextConfig } from "next";

const javaApiUrl = process.env.JAVA_API_URL ?? "http://localhost:8080/api/v1";

const nextConfig: NextConfig = {
  turbopack: {
    root: path.resolve(__dirname),
  },
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },
  // Proxy interno: o browser chama /api/backend/* e o Next repassa para a API Java.
  async rewrites() {
    return [
      {
        source: "/api/backend/:path*",
        destination: `${javaApiUrl}/:path*`,
      },
    ];
  },
};

export default nextConfig;
