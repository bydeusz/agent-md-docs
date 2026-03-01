import type { FrameworkConfig } from "./registry.js";

export const bunConfig: FrameworkConfig = {
  name: "Bun",
  key: "bun",
  category: "runtime",
  repo: "oven-sh/bun",
  branch: "main",
  contentPath: "docs",
  fileExtensions: [".mdx"],
  startComment: "<!-- BUN-AGENTS-MD-START -->",
  endComment: "<!-- BUN-AGENTS-MD-END -->",
};
