import type { FrameworkConfig } from "./registry.js";

export const prismaConfig: FrameworkConfig = {
  name: "Prisma",
  key: "prisma",
  category: "orm",
  repo: "prisma/docs",
  branch: "main",
  contentPath: "apps/docs/content",
  fileExtensions: [".mdx"],
  startComment: "<!-- PRISMA-AGENTS-MD-START -->",
  endComment: "<!-- PRISMA-AGENTS-MD-END -->",
  warningMessage:
    "STOP. What you remember about Prisma is WRONG for this project. Always search docs and read before any task.",
};
