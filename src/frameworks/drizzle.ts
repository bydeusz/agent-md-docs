import type { FrameworkConfig } from "./registry.js";

export const drizzleConfig: FrameworkConfig = {
  name: "Drizzle ORM",
  key: "drizzle",
  category: "orm",
  repo: "drizzle-team/drizzle-orm-docs",
  branch: "main",
  contentPath: "src/content/docs",
  fileExtensions: [".mdx"],
  startComment: "<!-- DRIZZLE-AGENTS-MD-START -->",
  endComment: "<!-- DRIZZLE-AGENTS-MD-END -->",
  warningMessage:
    "STOP. What you remember about Drizzle ORM is WRONG for this project. Always search docs and read before any task.",
};
