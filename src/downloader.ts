import fs from "node:fs/promises";
import path from "node:path";
import type { FrameworkConfig } from "./frameworks/registry.js";

interface GitHubTreeEntry {
  path: string;
  mode: string;
  type: "blob" | "tree";
  sha: string;
  size?: number;
  url: string;
}

interface GitHubTreeResponse {
  sha: string;
  url: string;
  tree: GitHubTreeEntry[];
  truncated: boolean;
}

const CONCURRENT_DOWNLOADS = 10;

function formatRateLimitInfo(response: Response): string {
  const remaining = response.headers.get("x-ratelimit-remaining");
  const limit = response.headers.get("x-ratelimit-limit");
  const resetTimestamp = response.headers.get("x-ratelimit-reset");

  if (!remaining || !limit) return "";

  let resetInfo = "";
  if (resetTimestamp) {
    const resetDate = new Date(parseInt(resetTimestamp) * 1000);
    const minutes = Math.ceil(
      (resetDate.getTime() - Date.now()) / 1000 / 60,
    );
    resetInfo = ` (resets in ${minutes} min)`;
  }

  return `  Rate limit: ${remaining}/${limit} remaining${resetInfo}`;
}

/**
 * Fetch the entire file tree for a repo/branch in a single API call.
 * This uses the Git Trees API with ?recursive=1, which returns all files
 * in one request instead of one request per directory.
 */
async function fetchFullTree(
  repo: string,
  branch: string,
): Promise<GitHubTreeEntry[]> {
  const url = `https://api.github.com/repos/${repo}/git/trees/${branch}?recursive=1`;
  const response = await fetch(url);

  if (!response.ok) {
    if (response.status === 403 || response.status === 429) {
      const rateLimitInfo = formatRateLimitInfo(response);
      throw new Error(
        `GitHub API rate limit exceeded for ${repo}.${rateLimitInfo ? "\n" + rateLimitInfo : ""}`,
      );
    }
    throw new Error(
      `GitHub API error: ${response.status} ${response.statusText} for ${url}`,
    );
  }

  const rateLimitInfo = formatRateLimitInfo(response);
  if (rateLimitInfo) {
    console.log(rateLimitInfo);
  }

  const data = (await response.json()) as GitHubTreeResponse;

  if (data.truncated) {
    console.warn(
      "  Warning: The repository tree was truncated. Some files may be missing.",
    );
  }

  return data.tree;
}

/**
 * Download a file via raw.githubusercontent.com.
 */
async function downloadRawFile(
  repo: string,
  branch: string,
  filePath: string,
): Promise<string> {
  const url = `https://raw.githubusercontent.com/${repo}/${branch}/${filePath}`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(
      `Failed to download file: ${response.status} ${response.statusText} for ${url}`,
    );
  }

  return await response.text();
}

/**
 * Download files in batches to avoid overwhelming the network.
 */
async function downloadInBatches(
  files: { repoPath: string; localPath: string; displayPath: string }[],
  repo: string,
  branch: string,
  batchSize: number,
): Promise<number> {
  let downloaded = 0;

  for (let i = 0; i < files.length; i += batchSize) {
    const batch = files.slice(i, i + batchSize);

    await Promise.all(
      batch.map(async (file) => {
        const content = await downloadRawFile(repo, branch, file.repoPath);
        await fs.mkdir(path.dirname(file.localPath), { recursive: true });
        await fs.writeFile(file.localPath, content, "utf-8");
        downloaded++;
        console.log(`  Downloaded: ${file.displayPath}`);
      }),
    );
  }

  return downloaded;
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
  console.log(
    `  Source: https://github.com/${config.repo}/tree/${config.branch}/${config.contentPath}`,
  );
  console.log(`  Destination: ${outputBase}\n`);

  // 1. Fetch the full tree in a single API call
  console.log("  Fetching file tree...");
  const tree = await fetchFullTree(config.repo, config.branch);

  // 2. Filter to only docs files under contentPath with matching extensions
  const contentPrefix = config.contentPath + "/";
  const docFiles = tree.filter((entry) => {
    if (entry.type !== "blob") return false;
    if (!entry.path.startsWith(contentPrefix)) return false;
    return config.fileExtensions.some((ext) => entry.path.endsWith(ext));
  });

  console.log(`  Found ${docFiles.length} documentation files.\n`);

  // 3. Build the download list
  const filesToDownload = docFiles.map((entry) => {
    const relativePath = entry.path.substring(contentPrefix.length);
    return {
      repoPath: entry.path,
      localPath: path.join(outputBase, relativePath),
      displayPath: relativePath,
    };
  });

  // 4. Download all files in parallel batches via raw.githubusercontent.com
  const fileCount = await downloadInBatches(
    filesToDownload,
    config.repo,
    config.branch,
    CONCURRENT_DOWNLOADS,
  );

  console.log(`\n  Done! Downloaded ${fileCount} files for ${config.name}.\n`);
  return fileCount;
}
