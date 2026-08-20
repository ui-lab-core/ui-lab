import type { InitPlan } from "./plan.js";
export function printInitPlan(plan: InitPlan): void {
  for (const pkg of plan.packages) console.log(`[dry-run] install ${pkg}`);
  for (const write of plan.writes)
    console.log(`[dry-run] ${write.kind} ${write.path}`);
}
