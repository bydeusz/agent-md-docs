#!/usr/bin/env node

import path from "node:path";
import { promptUser } from "./prompts.js";
import { downloadDocs } from "./downloader.js";
import { generateIndex } from "./index-generator.js";
import { writeIndex } from "./writer.js";

async function main(): Promise<void> {
  console.log("\n  agent-md-docs");
  console.log("  Download framework docs & generate an index for your AI agent.\n");

  // 1. Prompt user for choices
  const { targetFile, frameworks } = await promptUser();

  // The output directory is the current working directory
  const outputDir = process.cwd();
  const targetFilePath = path.join(outputDir, targetFile);

  // 2. For each selected framework: download, index, write
  for (const config of frameworks) {
    // Download documentation from GitHub
    await downloadDocs(config, outputDir);

    // Generate minified index
    const indexBlock = await generateIndex(config, outputDir);

    // Write index to the target file
    await writeIndex(targetFilePath, config, indexBlock);
  }

  console.log("\nAll done! Your documentation and index are ready.");
}

main().catch((error: Error) => {
  console.error("\nError:", error.message);
  process.exit(1);
});
