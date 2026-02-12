import fs from "node:fs/promises";
import path from "node:path";
import type { FrameworkConfig } from "./frameworks/registry.js";

/**
 * Writes or updates the index block in the target file (AGENTS.md or CLAUDE.md).
 *
 * - If the file does not exist, it is created with the index block.
 * - If the file exists and contains the framework's markers, the block is replaced.
 * - If the file exists but has no markers for this framework, the block is appended.
 */
export async function writeIndex(
  targetFilePath: string,
  config: FrameworkConfig,
  indexBlock: string,
): Promise<void> {
  let existingContent = "";
  let fileExists = false;

  try {
    existingContent = await fs.readFile(targetFilePath, "utf-8");
    fileExists = true;
  } catch {
    // File doesn't exist yet
  }

  let newContent: string;

  if (!fileExists) {
    // Create new file with a header and the index block
    const fileName = path.basename(targetFilePath);
    newContent = `# ${fileName}\n\n${indexBlock}\n`;
  } else {
    const startIdx = existingContent.indexOf(config.startComment);
    const endIdx = existingContent.indexOf(config.endComment);

    if (startIdx !== -1 && endIdx !== -1) {
      // Replace existing block (including both markers)
      const before = existingContent.substring(0, startIdx);
      const after = existingContent.substring(
        endIdx + config.endComment.length,
      );
      newContent = `${before}${indexBlock}${after}`;
    } else {
      // Append the block to the end of the file
      const separator = existingContent.endsWith("\n") ? "\n" : "\n\n";
      newContent = `${existingContent}${separator}${indexBlock}\n`;
    }
  }

  await fs.mkdir(path.dirname(targetFilePath), { recursive: true });
  await fs.writeFile(targetFilePath, newContent, "utf-8");

  console.log(`Updated: ${targetFilePath}`);
}
