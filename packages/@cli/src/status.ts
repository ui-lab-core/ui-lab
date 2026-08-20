import { readFileSync } from "node:fs";
import { join } from "node:path";
import { detectProject, packageVersion } from "./project.js";
export function status(): Record<string, unknown> {
  const project = detectProject();
  const content = project.stylesheet
    ? readFileSync(join(project.root, project.stylesheet), "utf8")
    : "";
  return {
    root: project.root,
    framework: project.framework,
    packageManager: project.packageManager,
    packages: {
      "ui-lab-components": packageVersion(project, "ui-lab-components"),
      "ui-lab-theme-onyx": packageVersion(project, "ui-lab-theme-onyx"),
    },
    stylesheet: project.stylesheet
      ? {
          path: project.stylesheet,
          configured: content.includes("ui-lab-components/styles.css"),
          theme: content.includes("ui-lab-theme-onyx/styles.css")
            ? "onyx"
            : "app-owned",
        }
      : null,
  };
}
