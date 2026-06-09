import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
  },
  experimental: {
    turbo: {
      root: "/workspaces/hiremind_web",
    },
  },
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
