import { select, checkbox, Separator } from "@inquirer/prompts";
import {
  frameworkRegistry,
  getFrameworksByCategory,
} from "./frameworks/registry.js";
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

  const frontendFrameworks = getFrameworksByCategory("frontend");
  const backendFrameworks = getFrameworksByCategory("backend");

  const choices: Array<
    { name: string; value: string; checked: boolean } | Separator
  > = [];

  if (frontendFrameworks.length > 0) {
    choices.push(new Separator("-- Frontend --"));
    for (const fw of frontendFrameworks) {
      choices.push({ name: fw.name, value: fw.key, checked: true });
    }
  }

  if (backendFrameworks.length > 0) {
    choices.push(new Separator("-- Backend --"));
    for (const fw of backendFrameworks) {
      choices.push({ name: fw.name, value: fw.key, checked: true });
    }
  }

  const selectedKeys = await checkbox({
    message: "Which documentation would you like to download?",
    choices,
    required: true,
  });

  const frameworks = selectedKeys
    .map((key) => frameworkRegistry.find((fw) => fw.key === key))
    .filter((fw): fw is FrameworkConfig => fw !== undefined);

  return { targetFile, frameworks };
}
