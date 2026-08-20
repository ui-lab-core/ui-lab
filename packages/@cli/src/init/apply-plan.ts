import { mkdirSync, renameSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import type { PlannedWrite } from "./plan.js";

export function applyInitPlan(root: string, writes: PlannedWrite[]): void {
  const pending = writes.map((write) => {
    const file = join(root, write.path);
    mkdirSync(dirname(file), { recursive: true });
    const temporary = `${file}.${process.pid}.tmp`;
    writeFileSync(temporary, write.content, "utf8");
    return { file, temporary };
  });
  for (const item of pending) renameSync(item.temporary, item.file);
}
