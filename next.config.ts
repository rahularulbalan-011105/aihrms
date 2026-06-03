import type { NextConfig } from "next";

/**
 * GitHub Pages deployment config.
 *
 * `output: "export"` makes `next build` write a fully static site into ./out
 * (HTML + CSS + JS only). That's the only thing GitHub Pages can host —
 * GH Pages has no Node.js runtime, so the default server build won't work.
 *
 * ─── If deploying to a USER/ORG page (https://<user>.github.io/) ───
 *     Set REPO_NAME = "" below.
 *
 * ─── If deploying to a PROJECT page (https://<user>.github.io/<repo>/) ───
 *     Set REPO_NAME to your repo name — e.g. "hrms_ai".
 */
const REPO_NAME = "hrms_ai"; // <-- change to "" for a user/org page

const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },     // GH Pages can't run Next's image optimizer
  trailingSlash: true,               // /about/ instead of /about (GH Pages prefers this)

  // Only applied when REPO_NAME is non-empty (project-page deploy)
  ...(REPO_NAME && {
    basePath: `/${REPO_NAME}`,
    assetPrefix: `/${REPO_NAME}/`,
  }),
};

export default nextConfig;
