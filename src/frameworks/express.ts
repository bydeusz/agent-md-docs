import type { FrameworkConfig } from "./registry.js";

export const expressConfig: FrameworkConfig = {
  name: "Express",
  key: "express",
  category: "backend",
  repo: "expressjs/expressjs.com",
  branch: "gh-pages",
  contentPath: "en",
  fileExtensions: [".md"],
  startComment: "<!-- EXPRESS-AGENTS-MD-START -->",
  endComment: "<!-- EXPRESS-AGENTS-MD-END -->",
  warningMessage:
    "STOP. What you remember about Express is WRONG for this project. Always search docs and read before any task.",
};
