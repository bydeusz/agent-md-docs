import type { FrameworkConfig } from "./registry.js";

export const djangoConfig: FrameworkConfig = {
  name: "Django",
  key: "django",
  category: "backend",
  repo: "django/django",
  branch: "main",
  contentPath: "docs",
  fileExtensions: [".md"],
  convertExtensions: { ".txt": ".md" },
  startComment: "<!-- DJANGO-AGENTS-MD-START -->",
  endComment: "<!-- DJANGO-AGENTS-MD-END -->",
  warningMessage:
    "STOP. What you remember about Django is WRONG for this project. Always search docs and read before any task.",
};
