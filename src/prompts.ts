import { select, checkbox } from "@inquirer/prompts";
import { getFrameworksByCategory } from "./frameworks/registry.js";
import type { FrameworkConfig } from "./frameworks/registry.js";

export type TargetFile = "AGENTS.md" | "CLAUDE.md";

export interface UserChoices {
  targetFile: TargetFile;
  frameworks: FrameworkConfig[];
}

async function promptCategory(
  label: string,
  frameworks: FrameworkConfig[],
): Promise<FrameworkConfig[]> {
  const selectedKeys = await checkbox({
    message: `${label} frameworks:`,
    choices: frameworks.map((fw) => ({
      name: fw.name,
      value: fw.key,
      checked: false,
    })),
  });

  return frameworks.filter((fw) => selectedKeys.includes(fw.key));
}

export async function promptUser(): Promise<UserChoices> {
  // Step 1: Choose AI tool — this determines the target file
  const tool = await select<"copilot" | "cursor" | "claude">({
    message: "Which AI tool are you using?",
    choices: [
      { name: "GitHub Copilot", value: "copilot" },
      { name: "Cursor", value: "cursor" },
      { name: "Claude Code", value: "claude" },
    ],
  });

  const targetFile: TargetFile = tool === "claude" ? "CLAUDE.md" : "AGENTS.md";

  const selected: FrameworkConfig[] = [];

  // Step 2: Frontend
  const frontendFrameworks = getFrameworksByCategory("frontend");
  if (frontendFrameworks.length > 0) {
    const picked = await promptCategory("Frontend", frontendFrameworks);
    selected.push(...picked);
  }

  // Step 3: Backend
  const backendFrameworks = getFrameworksByCategory("backend");
  if (backendFrameworks.length > 0) {
    const picked = await promptCategory("Backend", backendFrameworks);
    selected.push(...picked);
  }

  // Step 4: Bundlers
  const bundlerFrameworks = getFrameworksByCategory("bundler");
  if (bundlerFrameworks.length > 0) {
    const picked = await promptCategory("Bundler", bundlerFrameworks);
    selected.push(...picked);
  }

  // Step 5: ORMs
  const ormFrameworks = getFrameworksByCategory("orm");
  if (ormFrameworks.length > 0) {
    const picked = await promptCategory("ORM", ormFrameworks);
    selected.push(...picked);
  }

  if (selected.length === 0) {
    throw new Error("No frameworks selected. At least one is required.");
  }

  return { targetFile, frameworks: selected };
}
