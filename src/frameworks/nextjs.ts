import type { FrameworkConfig } from "./registry.js";

export const nextjsConfig: FrameworkConfig = {
  name: "Next.js",
  key: "nextjs",
  category: "frontend",
  repo: "vercel/next.js",
  branch: "canary",
  contentPath: "docs",
  fileExtensions: [".mdx"],
  startComment: "<!-- NEXTJS-AGENTS-MD-START -->",
  endComment: "<!-- NEXTJS-AGENTS-MD-END -->",
  warningMessage:
    "STOP. What you remember about Next.js is WRONG for this project. Always search docs and read before any task.",
};
