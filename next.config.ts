import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      // Matches the 25 MB upload limit enforced in uploadDocument().
      bodySizeLimit: "25mb",
    },
  },
};

export default nextConfig;
