import { scaleNameMap } from "./constants";

export function getScaleName(ratio: number): string {
  const rounded = Math.round(ratio * 1000) / 1000;
  const entries = Object.entries(scaleNameMap).map(
    ([value, name]) => [Number(value), name] as const,
  );
  const closest = entries.reduce((prev, curr) =>
    Math.abs(curr[0] - rounded) < Math.abs(prev[0] - rounded) ? curr : prev,
  );

  return closest[1];
}
