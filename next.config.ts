import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Keep mongoose out of the bundle (server-only package)
  serverExternalPackages: ["mongoose"],
  // Allow blog cover image uploads up to ~5MB from the admin panel
  experimental: {
    serverActions: { bodySizeLimit: "6mb" },
  },
  turbopack: {
    root: __dirname,
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
