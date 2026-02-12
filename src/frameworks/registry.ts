export interface FrameworkConfig {
  /** Display name shown in prompts */
  name: string;
  /** Folder name used in .docs/{key}/ */
  key: string;
  /** GitHub owner/repo */
  repo: string;
  /** Branch to fetch from */
  branch: string;
  /** Path within the repo where docs live */
  contentPath: string;
  /** HTML comment start marker for the index block */
  startComment: string;
  /** HTML comment end marker for the index block */
  endComment: string;
  /** Warning message inserted in the index */
  warningMessage: string;
}

import { nestjsConfig } from "./nestjs.js";

export const frameworkRegistry: FrameworkConfig[] = [nestjsConfig];

export function getFrameworkByKey(key: string): FrameworkConfig | undefined {
  return frameworkRegistry.find((f) => f.key === key);
}
