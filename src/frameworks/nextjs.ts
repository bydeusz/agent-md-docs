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
};
