export type FrameworkCategory = "frontend" | "backend";

export interface FrameworkConfig {
  /** Display name shown in prompts */
  name: string;
  /** Folder name used in .docs/{key}/ */
  key: string;
  /** Category for grouping in prompts */
  category: FrameworkCategory;
  /** GitHub owner/repo */
  repo: string;
  /** Branch to fetch from */
  branch: string;
  /** Path within the repo where docs live */
  contentPath: string;
  /** File extensions on the local filesystem (e.g. [".md"] or [".mdx"]) */
  fileExtensions: string[];
  /** Optional: convert source extensions to target extensions during download.
   *  Keys are the source extensions in the repo, values are the target extensions saved locally.
   *  Example: { ".txt": ".md" } downloads .txt files but saves them as .md */
  convertExtensions?: Record<string, string>;
  /** HTML comment start marker for the index block */
  startComment: string;
  /** HTML comment end marker for the index block */
  endComment: string;
  /** Warning message inserted in the index */
  warningMessage: string;
}

import { reactConfig } from "./react.js";
import { nextjsConfig } from "./nextjs.js";
import { nestjsConfig } from "./nestjs.js";
import { djangoConfig } from "./django.js";
import { fastapiConfig } from "./fastapi.js";
import { drfConfig } from "./drf.js";
import { expressConfig } from "./express.js";

export const frameworkRegistry: FrameworkConfig[] = [
  reactConfig,
  nextjsConfig,
  nestjsConfig,
  djangoConfig,
  fastapiConfig,
  drfConfig,
  expressConfig,
];

export function getFrameworkByKey(key: string): FrameworkConfig | undefined {
  return frameworkRegistry.find((f) => f.key === key);
}

export function getFrameworksByCategory(
  category: FrameworkCategory,
): FrameworkConfig[] {
  return frameworkRegistry.filter((f) => f.category === category);
}
