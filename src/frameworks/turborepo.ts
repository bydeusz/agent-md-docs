import type { FrameworkConfig } from "./registry.js";

export const turborepoConfig: FrameworkConfig = {
  name: "Turborepo",
  key: "turborepo",
  category: "bundler",
  repo: "vercel/turborepo",
  branch: "main",
  contentPath: "apps/docs/content/docs",
  fileExtensions: [".mdx"],
  startComment: "<!-- TURBOREPO-AGENTS-MD-START -->",
  endComment: "<!-- TURBOREPO-AGENTS-MD-END -->",
};
