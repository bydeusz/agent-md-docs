import type { FrameworkConfig } from "./registry.js";

export const tanstackQueryConfig: FrameworkConfig = {
  name: "TanStack Query",
  key: "tanstack-query",
  category: "tanstack",
  repo: "TanStack/query",
  branch: "main",
  contentPath: "docs",
  fileExtensions: [".md"],
  startComment: "<!-- TANSTACK-QUERY-AGENTS-MD-START -->",
  endComment: "<!-- TANSTACK-QUERY-AGENTS-MD-END -->",
};
