import { relativeProjectPath } from "../project.js";
import type { ProjectInfo } from "../project.js";

export function resolveStylesheet(
  project: ProjectInfo,
  stylesheet: string,
): string {
  return relativeProjectPath(project.root, stylesheet);
}
export function resolveThemeTarget(
  project: ProjectInfo,
  target?: string,
): string | undefined {
  return target ? relativeProjectPath(project.root, target) : undefined;
}
export function resolveLayout(
  project: ProjectInfo,
  layout?: string,
): string | undefined {
  return project.framework === "next" && layout
    ? relativeProjectPath(project.root, layout)
    : undefined;
}
