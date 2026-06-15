import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";

// ⚠️ Replace with your exact GitHub repo name (the part after the slash in github.com/<you>/<repo>).
const repo = "aihrms";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
  },
  async rewrites() {
    const usersApi     = process.env.USERS_API_URL     ?? "http://localhost:5001/user-service";
    const candidateApi = process.env.CANDIDATE_API_URL ?? "http://localhost:5002/candidate-service";
    const companyApi   = process.env.COMPANY_API_URL   ?? "http://localhost:5003/company-service";
    return [
      { source: "/api/users/:path*",     destination: `${usersApi}/:path*`     },
      { source: "/api/candidate/:path*", destination: `${candidateApi}/:path*` },
      { source: "/api/company/:path*",   destination: `${companyApi}/:path*`   },
    ];
  },
};

export default nextConfig;
