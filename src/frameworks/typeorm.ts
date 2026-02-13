import type { FrameworkConfig } from "./registry.js";

export const typeormConfig: FrameworkConfig = {
  name: "TypeORM",
  key: "typeorm",
  category: "orm",
  repo: "typeorm/typeorm",
  branch: "master",
  contentPath: "docs/docs",
  fileExtensions: [".md"],
  startComment: "<!-- TYPEORM-AGENTS-MD-START -->",
  endComment: "<!-- TYPEORM-AGENTS-MD-END -->",
  warningMessage:
    "STOP. What you remember about TypeORM is WRONG for this project. Always search docs and read before any task.",
};
