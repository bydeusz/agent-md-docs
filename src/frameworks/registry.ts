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
  /** File extensions to download (e.g. [".md"] or [".mdx"]) */
  fileExtensions: string[];
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

export const frameworkRegistry: FrameworkConfig[] = [
  reactConfig,
  nextjsConfig,
  nestjsConfig,
];

export function getFrameworkByKey(key: string): FrameworkConfig | undefined {
  return frameworkRegistry.find((f) => f.key === key);
}

export function getFrameworksByCategory(
  category: FrameworkCategory,
): FrameworkConfig[] {
  return frameworkRegistry.filter((f) => f.category === category);
}
