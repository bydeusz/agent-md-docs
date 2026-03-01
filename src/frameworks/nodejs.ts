import type { FrameworkConfig } from "./registry.js";

export const nodejsConfig: FrameworkConfig = {
  name: "Node.js",
  key: "nodejs",
  category: "runtime",
  repo: "nodejs/node",
  branch: "main",
  contentPath: "doc/api",
  fileExtensions: [".md"],
  startComment: "<!-- NODEJS-AGENTS-MD-START -->",
  endComment: "<!-- NODEJS-AGENTS-MD-END -->",
};
