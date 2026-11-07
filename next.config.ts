import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    agentFeedback: true,
    // Admin image uploads (up to 15 MB) pass through the proxy's auth check.
    proxyClientMaxBodySize: "16mb",
    // Content saves from the admin dashboard.
    serverActions: {
      bodySizeLimit: "2mb",
    },
  },
  cacheComponents: true,
  partialPrefetching: true,
  reactCompiler: true,
  images: {
    // Only optimise the site's own images: bundled assets, public/images and admin uploads.
    localPatterns: [
      { pathname: "/_next/static/media/**", search: "" },
      { pathname: "/images/**", search: "" },
      { pathname: "/uploads/**", search: "" },
    ],
  },
};

export default nextConfig;
