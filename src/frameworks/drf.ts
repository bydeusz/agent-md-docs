import type { FrameworkConfig } from "./registry.js";

export const drfConfig: FrameworkConfig = {
  name: "Django REST Framework",
  key: "drf",
  category: "backend",
  repo: "encode/django-rest-framework",
  branch: "main",
  contentPath: "docs",
  fileExtensions: [".md"],
  startComment: "<!-- DRF-AGENTS-MD-START -->",
  endComment: "<!-- DRF-AGENTS-MD-END -->",
};
