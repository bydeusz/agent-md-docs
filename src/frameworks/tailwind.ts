import type { FrameworkConfig } from "./registry.js";

export const tailwindConfig: FrameworkConfig = {
  name: "Tailwind CSS",
  key: "tailwind",
  category: "styling",
  repo: "tailwindlabs/tailwindcss.com",
  branch: "main",
  contentPath: "src/docs",
  fileExtensions: [".mdx"],
  startComment: "<!-- TAILWIND-AGENTS-MD-START -->",
  endComment: "<!-- TAILWIND-AGENTS-MD-END -->",
};
