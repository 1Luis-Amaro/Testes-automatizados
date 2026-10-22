import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // Ignora o ESLint apenas durante o build de produção
  },
};

export default nextConfig;