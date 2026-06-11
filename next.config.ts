import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";

// ⚠️ Replace with your exact GitHub repo name (the part after the slash in github.com/<you>/<repo>).
const repo = "YOUR_REPO_NAME";

const nextConfig: NextConfig = {
  // Pages = static-only. `output: "export"` is read only by `next build`; `next dev` ignores it.
  output: "export",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  // basePath/assetPrefix only kick in for the production build. In dev they stay "" so URLs are unchanged.
  basePath:    isProd ? `/${repo}` : "",
  assetPrefix: isProd ? `/${repo}` : "",
  experimental: {
    turbo: {
      root: "/workspaces/hiremind_web",
    },
  },
  // Rewrites are silently ignored by `next build` when `output: "export"` is set, but still run under `next dev`.
  async rewrites() {
    const usersApi     = process.env.USERS_API_URL     ?? "http://localhost:5001/user-service";
    const candidateApi = process.env.CANDIDATE_API_URL ?? "http://localhost:5002/candidate-service";
    return [
      { source: "/api/users/:path*",     destination: `${usersApi}/:path*`     },
      { source: "/api/candidate/:path*", destination: `${candidateApi}/:path*` },
    ];
  },
};

export default nextConfig;
