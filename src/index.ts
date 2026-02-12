#!/usr/bin/env node

import fs from "node:fs/promises";
import path from "node:path";
import { promptUser } from "./prompts.js";
import { downloadDocs } from "./downloader.js";
import { generateIndex } from "./index-generator.js";
import { writeIndex, cleanIndexBlocks } from "./writer.js";
import {
  readManifest,
  writeManifest,
  buildManifest,
  resolveFrameworksFromManifest,
} from "./manifest.js";
import type { FrameworkConfig } from "./frameworks/registry.js";
import type { TargetFile } from "./prompts.js";

/**
 * Clear the entire .docs folder, then recreate it.
 */
async function clearDocsFolder(outputDir: string): Promise<void> {
  const docsPath = path.join(outputDir, ".docs");
  try {
    await fs.rm(docsPath, { recursive: true, force: true });
  } catch {
    // Directory may not exist, that's fine
  }
  await fs.mkdir(docsPath, { recursive: true });
  console.log("  Cleared .docs folder.\n");
}

/**
 * Download, index, and write for a list of frameworks.
 */
async function processFrameworks(
  frameworks: FrameworkConfig[],
  targetFile: TargetFile,
  outputDir: string,
): Promise<void> {
  const targetFilePath = path.join(outputDir, targetFile);

  for (const config of frameworks) {
    await downloadDocs(config, outputDir);
    const indexBlock = await generateIndex(config, outputDir);
    await writeIndex(targetFilePath, config, indexBlock);
  }
}

async function main(): Promise<void> {
  const isUpgrade = process.argv.includes("--upgrade");
  const outputDir = process.cwd();

  console.log("\n  agent-md-docs");
  console.log(
    "  Download framework docs & generate an index for your AI agent.\n",
  );

  if (isUpgrade) {
    // --upgrade: read manifest and re-download all installed frameworks
    const manifest = await readManifest(outputDir);

    if (!manifest || manifest.frameworks.length === 0) {
      console.error(
        "  No installed docs found. Run without --upgrade first to install docs.\n",
      );
      process.exit(1);
    }

    const frameworks = resolveFrameworksFromManifest(manifest);

    if (frameworks.length === 0) {
      console.error(
        "  None of the previously installed frameworks are available in the registry.\n",
      );
      process.exit(1);
    }

    console.log(`  Upgrading ${frameworks.length} framework(s): ${frameworks.map((f) => f.name).join(", ")}`);
    console.log(`  Target file: ${manifest.targetFile}\n`);

    // Clean index blocks from target file and clear .docs folder
    await cleanIndexBlocks(path.join(outputDir, manifest.targetFile));
    await clearDocsFolder(outputDir);
    await processFrameworks(frameworks, manifest.targetFile, outputDir);

    // Update manifest with new timestamps
    const updatedManifest = buildManifest(
      manifest.targetFile,
      frameworks,
      manifest,
    );
    await writeManifest(outputDir, updatedManifest);
  } else {
    // Interactive: prompt user, clear .docs, download fresh
    const { targetFile, frameworks } = await promptUser();

    // Clean index blocks from target file and clear .docs folder
    await cleanIndexBlocks(path.join(outputDir, targetFile));
    await clearDocsFolder(outputDir);
    await processFrameworks(frameworks, targetFile, outputDir);

    // Save manifest for future --upgrade runs
    const existingManifest = await readManifest(outputDir);
    const manifest = buildManifest(targetFile, frameworks, existingManifest);
    await writeManifest(outputDir, manifest);
  }

  console.log("\nAll done! Your documentation and index are ready.");
}

main().catch((error: Error) => {
  console.error("\nError:", error.message);
  process.exit(1);
});
