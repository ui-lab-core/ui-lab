import fs from "fs";
import path from "path";
import { SkillFilesUI, type SkillFileData } from "./skill-files-ui";

const SKILLS_DIR = path.join(
  process.cwd(),
  "src/features/docs/skills/ui-lab"
);

function readSkillFile(relativePath: string): string {
  try {
    return fs.readFileSync(path.join(SKILLS_DIR, relativePath), "utf8").trim();
  } catch {
    return `[File not found: ${relativePath}]`;
  }
}

const FILE_METADATA: {
  path: string;
  role: string;
  loadedBy: string[];
}[] = [
  {
    path: "SKILL.md",
    role: "Entry point — reads intent and routes to a sub-agent",
    loadedBy: ["audit", "ideate", "overhaul"],
  },
  {
    path: "workflows/audit.md",
    role: "Audit instructions — pillars, registry validation, output contract",
    loadedBy: ["audit"],
  },
  {
    path: "workflows/ideate.md",
    role: "Ideate instructions — domain reasoning, element inventory, brief format",
    loadedBy: ["ideate"],
  },
  {
    path: "workflows/overhaul.md",
    role: "Overhaul instructions — scope, plan-confirm-execute phases, migration report",
    loadedBy: ["overhaul"],
  },
  {
    path: "references/core-pillars.md",
    role: "Pillar definitions — what each of the 6 pillars measures and flags",
    loadedBy: ["audit"],
  },
  {
    path: "references/design-system.md",
    role: "Token rules — neutral palette, semantic tokens, component mapping, anti-patterns",
    loadedBy: ["audit"],
  },
  {
    path: "references/slop-patterns.md",
    role: "Slop pattern catalog — canonical AI filler and structural clichés",
    loadedBy: ["audit"],
  },
];

export function SkillFiles() {
  const files: SkillFileData[] = FILE_METADATA.map(
    ({ path: filePath, role, loadedBy }) => {
      const content = readSkillFile(filePath);
      return {
        path: filePath,
        lines: content.split("\n").length,
        content,
        role,
        loadedBy,
      };
    }
  );

  return <SkillFilesUI files={files} />;
}
