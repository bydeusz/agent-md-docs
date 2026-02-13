import type { FrameworkConfig } from "./registry.js";

export const viteConfig: FrameworkConfig = {
  name: "Vite",
  key: "vite",
  category: "bundler",
  repo: "vitejs/vite",
  branch: "main",
  contentPath: "docs",
  fileExtensions: [".md"],
  startComment: "<!-- VITE-AGENTS-MD-START -->",
  endComment: "<!-- VITE-AGENTS-MD-END -->",
};
