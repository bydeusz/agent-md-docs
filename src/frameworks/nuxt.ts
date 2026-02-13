import type { FrameworkConfig } from "./registry.js";

export const nuxtConfig: FrameworkConfig = {
  name: "Nuxt",
  key: "nuxt",
  category: "frontend",
  repo: "nuxt/nuxt",
  branch: "main",
  contentPath: "docs",
  fileExtensions: [".md"],
  startComment: "<!-- NUXT-AGENTS-MD-START -->",
  endComment: "<!-- NUXT-AGENTS-MD-END -->",
};
