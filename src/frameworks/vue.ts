import type { FrameworkConfig } from "./registry.js";

export const vueConfig: FrameworkConfig = {
  name: "Vue",
  key: "vue",
  category: "frontend",
  repo: "vuejs/docs",
  branch: "main",
  contentPath: "src",
  fileExtensions: [".md"],
  startComment: "<!-- VUE-AGENTS-MD-START -->",
  endComment: "<!-- VUE-AGENTS-MD-END -->",
};
