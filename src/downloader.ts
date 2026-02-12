import fs from "node:fs/promises";
import path from "node:path";
import type { FrameworkConfig } from "./frameworks/registry.js";

interface GitHubContentEntry {
  name: string;
  path: string;
  type: "file" | "dir";
  download_url: string | null;
}

const RATE_LIMIT_DELAY_MS = 100;

function getHeaders(): Record<string, string> {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github.v3+json",
    "User-Agent": "agent-md-docs-cli",
  };
  const token = process.env.GITHUB_TOKEN;
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
}

async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchDirectoryContents(
  repo: string,
  dirPath: string,
  branch: string,
): Promise<GitHubContentEntry[]> {
  const url = `https://api.github.com/repos/${repo}/contents/${dirPath}?ref=${branch}`;
  const response = await fetch(url, { headers: getHeaders() });

  if (!response.ok) {
    throw new Error(
      `GitHub API error: ${response.status} ${response.statusText} for ${url}`,
    );
  }

  return (await response.json()) as GitHubContentEntry[];
}

async function downloadFile(downloadUrl: string): Promise<string> {
  const response = await fetch(downloadUrl, { headers: getHeaders() });

  if (!response.ok) {
    throw new Error(
      `Failed to download file: ${response.status} ${response.statusText} for ${downloadUrl}`,
    );
  }

  return await response.text();
}

async function downloadRecursive(
  config: FrameworkConfig,
  dirPath: string,
  outputBase: string,
  relativePath: string,
): Promise<number> {
  const entries = await fetchDirectoryContents(
    config.repo,
    dirPath,
    config.branch,
  );
  let fileCount = 0;

  for (const entry of entries) {
    await sleep(RATE_LIMIT_DELAY_MS);

    if (entry.type === "file" && entry.name.endsWith(".md")) {
      const filePath = path.join(outputBase, relativePath, entry.name);
      await fs.mkdir(path.dirname(filePath), { recursive: true });

      const content = await downloadFile(entry.download_url!);
      await fs.writeFile(filePath, content, "utf-8");

      fileCount++;
      console.log(`  Downloaded: ${path.join(relativePath, entry.name)}`);
    } else if (entry.type === "dir") {
      const subRelPath = path.join(relativePath, entry.name);
      const subDirPath = `${dirPath}/${entry.name}`;

      fileCount += await downloadRecursive(
        config,
        subDirPath,
        outputBase,
        subRelPath,
      );
    }
  }

  return fileCount;
}

export async function downloadDocs(
  config: FrameworkConfig,
  outputDir: string,
): Promise<number> {
  const outputBase = path.join(outputDir, ".docs", config.key);

  // Clean existing docs for this framework
  try {
    await fs.rm(outputBase, { recursive: true, force: true });
  } catch {
    // Directory may not exist, that's fine
  }

  await fs.mkdir(outputBase, { recursive: true });

  console.log(`\nDownloading ${config.name} documentation...`);
  console.log(`  Source: https://github.com/${config.repo}/tree/${config.branch}/${config.contentPath}`);
  console.log(`  Destination: ${outputBase}\n`);

  const fileCount = await downloadRecursive(
    config,
    config.contentPath,
    outputBase,
    "",
  );

  console.log(`\n  Done! Downloaded ${fileCount} files for ${config.name}.\n`);
  return fileCount;
}
