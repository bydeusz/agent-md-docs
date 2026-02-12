import fs from "node:fs/promises";
import path from "node:path";
import type { TargetFile } from "./prompts.js";
import { getFrameworkByKey } from "./frameworks/registry.js";
import type { FrameworkConfig } from "./frameworks/registry.js";

const MANIFEST_FILENAME = "manifest.json";

export interface ManifestEntry {
  key: string;
  name: string;
  installedAt: string;
  updatedAt: string;
}

export interface Manifest {
  targetFile: TargetFile;
  frameworks: ManifestEntry[];
}

function getManifestPath(outputDir: string): string {
  return path.join(outputDir, ".docs", MANIFEST_FILENAME);
}

/**
 * Read the manifest file. Returns null if it doesn't exist.
 */
export async function readManifest(
  outputDir: string,
): Promise<Manifest | null> {
  try {
    const content = await fs.readFile(getManifestPath(outputDir), "utf-8");
    return JSON.parse(content) as Manifest;
  } catch {
    return null;
  }
}

/**
 * Write the manifest file. Creates the .docs directory if needed.
 */
export async function writeManifest(
  outputDir: string,
  manifest: Manifest,
): Promise<void> {
  const manifestPath = getManifestPath(outputDir);
  await fs.mkdir(path.dirname(manifestPath), { recursive: true });
  await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2), "utf-8");
  console.log(`\n  Manifest saved to ${manifestPath}`);
}

/**
 * Build a manifest from the current run's choices.
 * Merges with existing manifest entries to preserve installedAt dates.
 */
export function buildManifest(
  targetFile: TargetFile,
  frameworks: FrameworkConfig[],
  existingManifest: Manifest | null,
): Manifest {
  const now = new Date().toISOString();

  const entries: ManifestEntry[] = frameworks.map((fw) => {
    const existing = existingManifest?.frameworks.find(
      (e) => e.key === fw.key,
    );
    return {
      key: fw.key,
      name: fw.name,
      installedAt: existing?.installedAt ?? now,
      updatedAt: now,
    };
  });

  return { targetFile, frameworks: entries };
}

/**
 * Resolve framework configs from manifest entries.
 * Returns only frameworks that are still in the registry.
 */
export function resolveFrameworksFromManifest(
  manifest: Manifest,
): FrameworkConfig[] {
  const configs: FrameworkConfig[] = [];

  for (const entry of manifest.frameworks) {
    const config = getFrameworkByKey(entry.key);
    if (config) {
      configs.push(config);
    } else {
      console.warn(
        `  Warning: Framework "${entry.name}" (${entry.key}) is no longer in the registry. Skipping.`,
      );
    }
  }

  return configs;
}
