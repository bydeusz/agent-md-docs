import type { FrameworkConfig } from "./registry.js";

export const nestjsConfig: FrameworkConfig = {
  name: "NestJS",
  key: "nestjs",
  category: "backend",
  repo: "nestjs/docs.nestjs.com",
  branch: "master",
  contentPath: "content",
  fileExtensions: [".md"],
  startComment: "<!-- NESTJS-AGENTS-MD-START -->",
  endComment: "<!-- NESTJS-AGENTS-MD-END -->",
  warningMessage:
    "STOP. What you remember about NestJS is WRONG for this project. Always search docs and read before any task.",
};
