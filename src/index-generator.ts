import fs from "node:fs/promises";
import path from "node:path";
import type { FrameworkConfig } from "./frameworks/registry.js";

interface DirEntry {
  /** Relative path from the framework docs root (e.g., "" for root, "cli", "techniques") */
  relativePath: string;
  /** Sorted list of .md filenames in this directory */
  files: string[];
}

async function scanDirectory(
  dirPath: string,
  relativePath: string,
  fileExtensions: string[],
): Promise<DirEntry[]> {
  const entries: DirEntry[] = [];
  const files: string[] = [];
  const subdirs: string[] = [];

  const items = await fs.readdir(dirPath, { withFileTypes: true });

  for (const item of items) {
    const hasMatchingExtension = fileExtensions.some((ext) =>
      item.name.endsWith(ext),
    );
    if (item.isFile() && hasMatchingExtension) {
      files.push(item.name);
    } else if (item.isDirectory()) {
      subdirs.push(item.name);
    }
  }

  // Sort files alphabetically
  files.sort();

  if (files.length > 0) {
    entries.push({ relativePath, files });
  }

  // Recurse into subdirectories (sorted)
  subdirs.sort();
  for (const subdir of subdirs) {
    const subPath = path.join(dirPath, subdir);
    const subRelative = relativePath ? `${relativePath}/${subdir}` : subdir;
    const subEntries = await scanDirectory(subPath, subRelative, fileExtensions);
    entries.push(...subEntries);
  }

  return entries;
}

export async function generateIndex(
  config: FrameworkConfig,
  outputDir: string,
): Promise<string> {
  const docsRoot = path.join(outputDir, ".docs", config.key);

  // Use forward slashes for the root path (cross-platform in .md files)
  const docsRootRelative = `./.docs/${config.key}`;

  const dirEntries = await scanDirectory(docsRoot, "", config.fileExtensions);

  // Build the minified index segments
  const segments: string[] = [];

  // Header
  segments.push(`[${config.name} Docs Index]`);

  // Root path
  segments.push(`root: ${docsRootRelative}`);

  // Warning message
  segments.push(config.warningMessage);

  // Retrieval-led reasoning instruction
  segments.push(
    `IMPORTANT: Prefer retrieval-led reasoning over pre-training-led reasoning for any ${config.name} tasks.`,
  );

  // Reinstall hint
  segments.push(`If docs missing, run: npx @bydeusz/agent-md-docs`);

  // Directory entries
  for (const entry of dirEntries) {
    const dirLabel = entry.relativePath || "root";
    const filesList = entry.files.join(",");
    segments.push(`${dirLabel}:{${filesList}}`);
  }

  // Wrap with comment markers, all on a single minified line
  const indexLine = `${config.startComment}${segments.join("|")}${config.endComment}`;

  return indexLine;
}
