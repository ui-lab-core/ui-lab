"use client";

import { Group, Expand } from "ui-lab-components";

export interface SkillFileData {
  path: string;
  lines: number;
  content: string;
  role: string;
  loadedBy: string[];
}

export function SkillFilesUI({ files }: { files: SkillFileData[] }) {
  return (
    <Group
      orientation="vertical"
      spacing="none"
      className="w-full overflow-hidden [--background-border:var(--background-700)]"
    >
      {files.map((file) => (
        <Group.Expand key={file.path}>
          <Expand.Trigger className="w-full">
            <div className="flex items-center w-full px-4 py-3 gap-3 min-w-0">
              <code className="text-xs text-foreground-200 flex-1 min-w-0 truncate font-mono">
                {file.path}
              </code>
              <span className="text-xs text-foreground-400 shrink-0 tabular-nums">
                {file.lines} lines
              </span>
              <Expand.Icon className="shrink-0" />
            </div>
          </Expand.Trigger>
          <Expand.Divider />
          <Expand.Content>
            <div className="overflow-x-auto max-h-[32rem] overflow-y-auto">
              <pre className="p-4 text-xs font-mono text-foreground-300 leading-relaxed whitespace-pre bg-background-950">
                {file.content}
              </pre>
            </div>
          </Expand.Content>
        </Group.Expand>
      ))}
    </Group>
  );
}
