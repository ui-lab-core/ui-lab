import { existsSync, readFileSync } from "node:fs";
import { join, relative, resolve, isAbsolute } from "node:path";
import { detectProject, packageVersion } from "./project.js";
export function status(): Record<string, unknown> {
  const project = detectProject();
  const stylesheetExists = !!project.stylesheet && existsSync(join(project.root, project.stylesheet));
  const content = project.stylesheet && stylesheetExists
    ? readFileSync(join(project.root, project.stylesheet), "utf8")
    : "";
  const linkedPackages = Object.entries({ ...project.packageJson.dependencies, ...project.packageJson.devDependencies })
    .filter(([name, spec]) => name.startsWith("ui-lab-") && typeof spec === "string" && /^(link|file):/.test(spec) && !spec.endsWith(".tgz"))
    .flatMap(([name, spec]) => {
      const directory = resolve(project.root, String(spec).replace(/^(link|file):/, ""));
      const location = relative(project.root, directory);
      return location === ".." || location.startsWith(`..${process.platform === "win32" ? "\\" : "/"}`) || isAbsolute(location)
        ? [{ name, path: directory }] : [];
    });
  return {
    root: project.root,
    framework: project.framework,
    packageManager: project.packageManager,
    ...(linkedPackages.length ? { linkedPackages, integrationNotes: project.framework === "next"
      ? ["UI Lab packages are linked outside the application root. Configure turbopack.root and outputFileTracingRoot to include the application and linked sources."]
      : ["UI Lab packages are linked outside the application root. Resolve React and ReactDOM from the host application; Vite consumers can use resolve.dedupe."] } : {}),
    packages: {
      "ui-lab-components": packageVersion(project, "ui-lab-components"),
      "ui-lab-theme-onyx": packageVersion(project, "ui-lab-theme-onyx"),
    },
    stylesheet: project.stylesheet
      ? {
          path: project.stylesheet,
          exists: stylesheetExists,
          configured: content.includes("ui-lab-components/styles.css"),
          theme: content.includes("ui-lab-theme-onyx/styles.css")
            ? "onyx"
            : "app-owned",
        }
      : null,
  };
}
