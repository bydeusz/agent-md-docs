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
  warningMessage:
    "STOP. What you remember about Vue is WRONG for this project. Always search docs and read before any task.",
};
