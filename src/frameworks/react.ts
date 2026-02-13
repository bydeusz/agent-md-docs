import type { FrameworkConfig } from "./registry.js";

export const reactConfig: FrameworkConfig = {
  name: "React",
  key: "react",
  category: "frontend",
  repo: "reactjs/react.dev",
  branch: "main",
  contentPath: "src/content",
  fileExtensions: [".md"],
  startComment: "<!-- REACT-AGENTS-MD-START -->",
  endComment: "<!-- REACT-AGENTS-MD-END -->",
};
