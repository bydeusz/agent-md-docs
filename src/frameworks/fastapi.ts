import type { FrameworkConfig } from "./registry.js";

export const fastapiConfig: FrameworkConfig = {
  name: "FastAPI",
  key: "fastapi",
  category: "backend",
  repo: "fastapi/fastapi",
  branch: "master",
  contentPath: "docs/en/docs",
  fileExtensions: [".md"],
  startComment: "<!-- FASTAPI-AGENTS-MD-START -->",
  endComment: "<!-- FASTAPI-AGENTS-MD-END -->",
  warningMessage:
    "STOP. What you remember about FastAPI is WRONG for this project. Always search docs and read before any task.",
};
