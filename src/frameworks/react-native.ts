import type { FrameworkConfig } from "./registry.js";

export const reactNativeConfig: FrameworkConfig = {
  name: "React Native",
  key: "react-native",
  category: "mobile",
  repo: "facebook/react-native-website",
  branch: "main",
  contentPath: "docs",
  fileExtensions: [".md"],
  startComment: "<!-- REACT-NATIVE-AGENTS-MD-START -->",
  endComment: "<!-- REACT-NATIVE-AGENTS-MD-END -->",
};
