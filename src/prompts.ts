import { select, checkbox } from "@inquirer/prompts";
import { frameworkRegistry } from "./frameworks/registry.js";
import type { FrameworkConfig } from "./frameworks/registry.js";

export type TargetFile = "AGENTS.md" | "CLAUDE.md";

export interface UserChoices {
  targetFile: TargetFile;
  frameworks: FrameworkConfig[];
}

export async function promptUser(): Promise<UserChoices> {
  const targetFile = await select<TargetFile>({
    message: "Which file do you want to create/update?",
    choices: [
      { name: "AGENTS.md", value: "AGENTS.md" },
      { name: "CLAUDE.md", value: "CLAUDE.md" },
    ],
  });

  const selectedKeys = await checkbox({
    message: "Which documentation would you like to download?",
    choices: frameworkRegistry.map((fw) => ({
      name: fw.name,
      value: fw.key,
      checked: true,
    })),
    required: true,
  });

  const frameworks = selectedKeys
    .map((key) => frameworkRegistry.find((fw) => fw.key === key))
    .filter((fw): fw is FrameworkConfig => fw !== undefined);

  return { targetFile, frameworks };
}
