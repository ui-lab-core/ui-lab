import { spawn } from "node:child_process";
import { existsSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { basename, join, resolve } from "node:path";
import { createInterface } from "node:readline/promises";
import { stdin, stdout } from "node:process";
import { applyInitPlan } from "./apply-plan.js";
import type { PlannedWrite } from "./plan.js";
import type { PackageManager } from "../types.js";
import { createPackageManager } from "../package-manager.js";
import { detectPackageManager, detectProject, type ProjectInfo } from "../project.js";
import { integrateViteConfig } from "../vite/config.js";

export type FrameworkChoice = "next" | "vite";

const IGNORED_EMPTY_ENTRIES = new Set([
  ".git",
  ".gitignore",
  ".npmrc",
  ".next",
  "node_modules",
  "package-lock.json",
  "pnpm-lock.yaml",
  "yarn.lock",
  "bun.lock",
  "bun.lockb",
]);

const GLOBALS = `:root {
  color-scheme: light dark;
}

* {
  box-sizing: border-box;
}

html,
body {
  margin: 0;
  min-height: 100%;
}
`;

const LAYOUT = `import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "UI Lab",
  description: "Created with UI Lab",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
`;

const PAGE = `import { Badge } from "ui-lab-components/badge";
import { Button } from "ui-lab-components/button";
import { Card, CardHeader, CardBody, CardFooter } from "ui-lab-components/card";

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background-950 px-6 py-16 text-foreground-100">
      <Card className="w-full max-w-xl">
        <CardHeader>
          <div className="flex items-center justify-between gap-4">
            <Badge variant="success" pill>
              Setup complete
            </Badge>
            <span className="text-sm text-foreground-400">UI Lab + Next.js</span>
          </div>
          <h1 className="mb-0 mt-6 text-4xl font-semibold tracking-tight">
            Your UI Lab app is ready.
          </h1>
        </CardHeader>
        <CardBody>
          <p className="m-0 text-lg leading-8 text-foreground-300">
            If this card, badge, and button are styled, the component library,
            Onyx theme, Tailwind CSS, and App Router stylesheet are all connected.
          </p>
          <div className="mt-6 grid grid-cols-3 gap-3" aria-label="Theme color preview">
            <div className="h-12 rounded-base bg-accent-500" />
            <div className="h-12 rounded-base bg-info-500" />
            <div className="h-12 rounded-base bg-success-500" />
          </div>
        </CardBody>
        <CardFooter>
          <Button href="https://ui-lab.app" target="_blank" variant="primary" size="large">
            Explore the documentation
          </Button>
        </CardFooter>
      </Card>
    </main>
  );
}
`;

const TSCONFIG = `{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }]
  },
  "include": ["next-env.d.ts", ".next/types/**/*.ts", "**/*.ts", "**/*.tsx"],
  "exclude": ["node_modules"]
}
`;

const NEXT_ENV = `/// <reference types="next" />
/// <reference types="next/image-types/global" />

// This file is generated for Next.js TypeScript support.
`;

const POSTCSS_CONFIG = `export default {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};
`;

const POSTCSS_CONFIG_FILES = [
  "postcss.config.mjs",
  "postcss.config.js",
  "postcss.config.cjs",
  "postcss.config.json",
];

const VITE_INDEX_HTML = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>UI Lab</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
`;

const VITE_MAIN = `import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
`;

const VITE_APP = `import { Badge } from "ui-lab-components/badge";
import { Button } from "ui-lab-components/button";
import { Card, CardHeader, CardBody, CardFooter } from "ui-lab-components/card";

export default function App() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background-950 px-6 py-16 text-foreground-100">
      <Card className="w-full max-w-xl">
        <CardHeader>
          <div className="flex items-center justify-between gap-4">
            <Badge variant="success" pill>
              Setup complete
            </Badge>
            <span className="text-sm text-foreground-400">UI Lab + Vite</span>
          </div>
          <h1 className="mb-0 mt-6 text-4xl font-semibold tracking-tight">
            Your UI Lab app is ready.
          </h1>
        </CardHeader>
        <CardBody>
          <p className="m-0 text-lg leading-8 text-foreground-300">
            If this card, badge, and button are styled, the component library,
            Onyx theme, Tailwind CSS, and Vite entry stylesheet are all connected.
          </p>
          <div className="mt-6 grid grid-cols-3 gap-3" aria-label="Theme color preview">
            <div className="h-12 rounded-base bg-accent-500" />
            <div className="h-12 rounded-base bg-info-500" />
            <div className="h-12 rounded-base bg-success-500" />
          </div>
        </CardBody>
        <CardFooter>
          <Button href="https://ui-lab.app" target="_blank" variant="primary" size="large">
            Explore the documentation
          </Button>
        </CardFooter>
      </Card>
    </main>
  );
}
`;

const VITE_ENTRY_CSS = "";

const VITE_CONFIG = `import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
});
`;

const VITE_TSCONFIG = `{
  "compilerOptions": {
    "target": "ES2022",
    "useDefineForClassFields": true,
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true
  },
  "include": ["src"]
}
`;

const VITE_CONFIG_FILES = [
  "vite.config.ts",
  "vite.config.mts",
  "vite.config.js",
  "vite.config.mjs",
];

function meaningfulEntries(root: string): string[] {
  return readdirSync(root).filter(
    (entry) => !IGNORED_EMPTY_ENTRIES.has(entry) && entry !== "package.json",
  );
}

function isBarePackageJson(root: string): boolean {
  const file = join(root, "package.json");
  if (!existsSync(file)) return true;
  const pkg = JSON.parse(readFileSync(file, "utf8")) as Record<string, unknown>;
  const keys = Object.keys(pkg).filter((key) => !["name", "version", "private"].includes(key));
  return keys.length === 0;
}

function isEffectivelyEmpty(root: string): boolean {
  return meaningfulEntries(root).length === 0 && isBarePackageJson(root);
}

async function run(command: string, args: string[], cwd: string): Promise<void> {
  await new Promise<void>((resolvePromise, reject) => {
    const child = spawn(command, args, {
      cwd,
      stdio: "inherit",
      shell: process.platform === "win32",
    });
    child.once("error", (error) => reject(new Error(`Could not run ${command}: ${error.message}`)));
    child.once("exit", (code) =>
      code === 0
        ? resolvePromise()
        : reject(new Error(`${command} exited with ${code ?? "an error"}.`)),
    );
  });
}

function createNextArgs(packageManager: ProjectInfo["packageManager"]): [string, string[]] {
  const common = [
    "create-next-app@latest",
    ".",
    "--typescript",
    "--eslint",
    "--tailwind",
    "--app",
    "--no-src-dir",
    "--import-alias",
    "@/*",
    "--yes",
  ];
  if (packageManager === "npm") return ["npx", [...common, "--use-npm"]];
  if (packageManager === "pnpm") return ["pnpm", ["dlx", ...common, "--use-pnpm"]];
  if (packageManager === "yarn") return ["yarn", ["dlx", ...common, "--use-yarn"]];
  return ["bunx", [...common, "--use-bun"]];
}

function createViteArgs(packageManager: ProjectInfo["packageManager"]): [string, string[]] {
  const common = ["create-vite@latest", ".", "--template", "react-ts"];
  if (packageManager === "npm") return ["npx", ["--yes", ...common]];
  if (packageManager === "pnpm") return ["pnpm", ["dlx", ...common]];
  if (packageManager === "yarn") return ["yarn", ["dlx", ...common]];
  return ["bunx", ["--yes", ...common]];
}

function nextDirectory(root: string): "app" | "src/app" {
  return existsSync(join(root, "src", "app")) ? "src/app" : "app";
}

function hasPageRoute(root: string): boolean {
  return ["pages/index", "src/pages/index"].some((page) =>
    ["js", "jsx", "ts", "tsx"].some((extension) => existsSync(join(root, `${page}.${extension}`))),
  );
}

function routeFile(root: string, base: string): string | undefined {
  return ["tsx", "ts", "jsx", "js"]
    .map((extension) => `${base}.${extension}`)
    .find((file) => existsSync(join(root, file)));
}

function isCreateNextAppPage(content: string): boolean {
  return (
    content.includes("Get started by editing") ||
    content.includes("To get started, edit") ||
    (content.includes("Deploy Now") && content.includes("next/image"))
  );
}

async function completeNextProject(root: string, dryRun: boolean): Promise<boolean> {
  const packageFile = join(root, "package.json");
  const packageExisted = existsSync(packageFile);
  const packageJson = packageExisted
    ? (JSON.parse(readFileSync(packageFile, "utf8")) as Record<string, any>)
    : { name: basename(root), version: "0.1.0", private: true };
  const dependencies = { ...packageJson.dependencies, ...packageJson.devDependencies };
  const runtime = ["next", "react", "react-dom"].filter((name) => !dependencies[name]);
  const development = [
    "typescript",
    "@types/node",
    "@types/react",
    "@types/react-dom",
    "@tailwindcss/postcss",
  ].filter((name) => !dependencies[name]);
  const managerName = detectPackageManager(root);
  const manager = createPackageManager(managerName);
  const app = nextDirectory(root);
  const hasAppRouter = existsSync(join(root, "app")) || existsSync(join(root, "src", "app"));
  const createAppRouter = hasAppRouter || !hasPageRoute(root);
  const layout = routeFile(root, `${app}/layout`);
  const page = routeFile(root, `${app}/page`);
  const starterPage =
    createAppRouter && page && isCreateNextAppPage(readFileSync(join(root, page), "utf8"))
      ? page
      : undefined;
  const hasPostcssConfig = POSTCSS_CONFIG_FILES.some((file) => existsSync(join(root, file)));
  const writes = [
    createAppRouter &&
      !existsSync(join(root, app, "globals.css")) && {
        path: `${app}/globals.css`,
        content: GLOBALS,
        kind: "create" as const,
      },
    createAppRouter &&
      !layout && { path: `${app}/layout.tsx`, content: LAYOUT, kind: "create" as const },
    createAppRouter && !page && { path: `${app}/page.tsx`, content: PAGE, kind: "create" as const },
    starterPage && { path: starterPage, content: PAGE, kind: "update" as const },
    !createAppRouter &&
      !existsSync(join(root, "styles", "globals.css")) && {
        path: "styles/globals.css",
        content: GLOBALS,
        kind: "create" as const,
      },
    !existsSync(join(root, "tsconfig.json")) && {
      path: "tsconfig.json",
      content: TSCONFIG,
      kind: "create" as const,
    },
    !existsSync(join(root, "next-env.d.ts")) && {
      path: "next-env.d.ts",
      content: NEXT_ENV,
      kind: "create" as const,
    },
    !hasPostcssConfig && {
      path: "postcss.config.mjs",
      content: POSTCSS_CONFIG,
      kind: "create" as const,
    },
  ].filter((write): write is Exclude<typeof write, false | "" | undefined> => Boolean(write));

  const scripts = {
    ...packageJson.scripts,
    dev: packageJson.scripts?.dev ?? "next dev",
    build: packageJson.scripts?.build ?? "next build",
    start: packageJson.scripts?.start ?? "next start",
    lint: packageJson.scripts?.lint ?? "eslint",
  };
  const scriptsChanged = JSON.stringify(packageJson.scripts) !== JSON.stringify(scripts);
  packageJson.private ??= true;
  packageJson.scripts = scripts;
  const packageContent = `${JSON.stringify(packageJson, null, 2)}\n`;
  const setupNeeded =
    runtime.length > 0 || development.length > 0 || writes.length > 0 || scriptsChanged;

  if (dryRun) {
    if (runtime.length) console.log(`[dry-run] ${managerName} add ${runtime.join(" ")}`);
    if (development.length)
      console.log(`[dry-run] ${managerName} add --save-dev ${development.join(" ")}`);
    if (scriptsChanged) console.log("[dry-run] update package.json scripts");
    for (const write of writes) console.log(`[dry-run] create ${write.path}`);
    return setupNeeded;
  }
  if (!packageExisted) writeFileSync(packageFile, packageContent, "utf8");
  if (runtime.length)
    await manager.add(
      root,
      runtime.map((name) => `${name}@latest`),
      false,
    );
  if (development.length)
    await manager.add(
      root,
      development.map((name) => `${name}@latest`),
      false,
      true,
    );
  const installedPackage = JSON.parse(readFileSync(packageFile, "utf8")) as Record<string, any>;
  installedPackage.private ??= true;
  installedPackage.scripts = packageJson.scripts;
  applyInitPlan(root, [
    ...(scriptsChanged
      ? [
          {
            path: "package.json",
            content: `${JSON.stringify(installedPackage, null, 2)}\n`,
            kind: "update" as const,
          },
        ]
      : []),
    ...writes,
  ]);
  console.log(
    `Project dependencies installed: ${[...runtime, ...development].join(", ") || "none"}.`,
  );
  const created = [
    ...(!packageExisted ? ["package.json"] : []),
    ...writes.filter((write) => write.kind === "create").map((write) => write.path),
  ];
  const modified = [
    ...(scriptsChanged && packageExisted ? ["package.json"] : []),
    ...writes.filter((write) => write.kind === "update").map((write) => write.path),
  ];
  console.log(`Project files created: ${created.join(", ") || "none"}.`);
  console.log(`Project files modified: ${modified.join(", ") || "none"}.`);
  return setupNeeded;
}

function isCreateViteApp(content: string): boolean {
  return (
    content.includes("Vite + React") ||
    content.includes("setCount") ||
    content.includes("/vite.svg")
  );
}

function isCreateViteEntryCss(content: string): boolean {
  return content.includes("#646cff") || content.includes("place-items: center");
}

export async function completeViteProject(
  root: string,
  dryRun: boolean,
  suppliedManager?: PackageManager,
): Promise<boolean> {
  const packageFile = join(root, "package.json");
  const packageExisted = existsSync(packageFile);
  const packageJson = packageExisted
    ? (JSON.parse(readFileSync(packageFile, "utf8")) as Record<string, any>)
    : { name: basename(root), version: "0.0.0", private: true };
  const dependencies = { ...packageJson.dependencies, ...packageJson.devDependencies };
  const runtime = ["react", "react-dom"].filter((name) => !dependencies[name]);
  const development = [
    "vite",
    "@vitejs/plugin-react",
    "@tailwindcss/vite@4.2.4",
    "typescript",
    "@types/react",
    "@types/react-dom",
  ].filter((spec) => !dependencies[spec.split("@").slice(0, -1).join("@") || spec]);
  const managerName = detectPackageManager(root);
  const manager = suppliedManager ?? createPackageManager(managerName);

  const mainFile = routeFile(root, "src/main");
  const appFile = routeFile(root, "src/App");
  const configFile = VITE_CONFIG_FILES.find((file) => existsSync(join(root, file)));
  const entryCssExists = existsSync(join(root, "src/index.css"));
  const starterApp =
    appFile && isCreateViteApp(readFileSync(join(root, appFile), "utf8")) ? appFile : undefined;
  const resetEntryCss =
    entryCssExists && isCreateViteEntryCss(readFileSync(join(root, "src/index.css"), "utf8"));

  // create-vite does not wire up Tailwind, so the plugin is injected into the
  // generated config (or a fresh config is written when none exists).
  let configWrite: PlannedWrite | undefined;
  if (!configFile) {
    configWrite = { path: "vite.config.ts", content: VITE_CONFIG, kind: "create" };
  } else {
    const current = readFileSync(join(root, configFile), "utf8");
    const updated = integrateViteConfig(current);
    if (updated !== current) configWrite = { path: configFile, content: updated, kind: "update" };
  }

  const writes = [
    !existsSync(join(root, "index.html")) && {
      path: "index.html",
      content: VITE_INDEX_HTML,
      kind: "create" as const,
    },
    !mainFile && { path: "src/main.tsx", content: VITE_MAIN, kind: "create" as const },
    !appFile && { path: "src/App.tsx", content: VITE_APP, kind: "create" as const },
    starterApp && { path: starterApp, content: VITE_APP, kind: "update" as const },
    !entryCssExists && { path: "src/index.css", content: VITE_ENTRY_CSS, kind: "create" as const },
    resetEntryCss && { path: "src/index.css", content: VITE_ENTRY_CSS, kind: "update" as const },
    !existsSync(join(root, "tsconfig.json")) && {
      path: "tsconfig.json",
      content: VITE_TSCONFIG,
      kind: "create" as const,
    },
    configWrite,
  ].filter((write): write is Exclude<typeof write, false | "" | undefined> => Boolean(write));

  const scripts = {
    ...packageJson.scripts,
    dev: packageJson.scripts?.dev ?? "vite",
    build: packageJson.scripts?.build ?? "tsc && vite build",
    preview: packageJson.scripts?.preview ?? "vite preview",
  };
  const scriptsChanged = JSON.stringify(packageJson.scripts) !== JSON.stringify(scripts);
  packageJson.private ??= true;
  packageJson.scripts = scripts;
  const setupNeeded =
    runtime.length > 0 || development.length > 0 || writes.length > 0 || scriptsChanged;

  if (dryRun) {
    if (runtime.length) console.log(`[dry-run] ${managerName} add ${runtime.join(" ")}`);
    if (development.length)
      console.log(`[dry-run] ${managerName} add --save-dev ${development.join(" ")}`);
    if (scriptsChanged) console.log("[dry-run] update package.json scripts");
    for (const write of writes) console.log(`[dry-run] ${write.kind} ${write.path}`);
    return setupNeeded;
  }
  if (!packageExisted)
    writeFileSync(packageFile, `${JSON.stringify(packageJson, null, 2)}\n`, "utf8");
  if (runtime.length)
    await manager.add(
      root,
      runtime.map((name) => `${name}@latest`),
      false,
    );
  if (development.length)
    await manager.add(
      root,
      development.map((name) => (name.includes("@", 1) ? name : `${name}@latest`)),
      false,
      true,
    );
  const installedPackage = JSON.parse(readFileSync(packageFile, "utf8")) as Record<string, any>;
  installedPackage.private ??= true;
  installedPackage.scripts = packageJson.scripts;
  applyInitPlan(root, [
    ...(scriptsChanged
      ? [
          {
            path: "package.json",
            content: `${JSON.stringify(installedPackage, null, 2)}\n`,
            kind: "update" as const,
          },
        ]
      : []),
    ...writes,
  ]);
  console.log(
    `Project dependencies installed: ${[...runtime, ...development].join(", ") || "none"}.`,
  );
  const created = [
    ...(!packageExisted ? ["package.json"] : []),
    ...writes.filter((write) => write.kind === "create").map((write) => write.path),
  ];
  const modified = [
    ...(scriptsChanged && packageExisted ? ["package.json"] : []),
    ...writes.filter((write) => write.kind !== "create").map((write) => write.path),
  ];
  console.log(`Project files created: ${created.join(", ") || "none"}.`);
  console.log(`Project files modified: ${modified.join(", ") || "none"}.`);
  return setupNeeded;
}

async function promptFramework(): Promise<FrameworkChoice> {
  if (!stdin.isTTY || !stdout.isTTY) return "next";
  const prompt = createInterface({ input: stdin, output: stdout });
  try {
    const answer = (await prompt.question("Framework (next or vite) [next]: "))
      .trim()
      .toLowerCase();
    if (answer === "vite") return "vite";
    if (answer === "" || answer === "next") return "next";
    throw new Error("Framework must be next or vite.");
  } finally {
    prompt.close();
  }
}

function hasViteFiles(root: string): boolean {
  return (
    existsSync(join(root, "index.html")) ||
    VITE_CONFIG_FILES.some((file) => existsSync(join(root, file)))
  );
}

export async function prepareProject(
  start: string,
  dryRun: boolean,
  framework?: FrameworkChoice,
  nonInteractive?: boolean,
): Promise<ProjectInfo | undefined> {
  const target = resolve(start);
  if (isEffectivelyEmpty(target) && !existsSync(join(target, "package.json"))) {
    const manager = detectPackageManager(target);
    const chosen = framework ?? (nonInteractive ? "next" : await promptFramework());
    if (chosen === "vite") {
      const [command, args] = createViteArgs(manager);
      if (dryRun) {
        console.log(`[dry-run] ${command} ${args.join(" ")}`);
        await completeViteProject(target, true);
        return undefined;
      }
      await run(command, args, target);
      await completeViteProject(target, false);
      return detectProject(target);
    }
    const [command, args] = createNextArgs(manager);
    if (dryRun) {
      console.log(`[dry-run] ${command} ${args.join(" ")}`);
      return undefined;
    }
    await run(command, args, target);
    return detectProject(target);
  }

  const hasLocalPackage = existsSync(join(target, "package.json"));
  const hasLocalNextProject =
    existsSync(join(target, "app")) ||
    existsSync(join(target, "src", "app")) ||
    existsSync(join(target, "pages")) ||
    existsSync(join(target, "src", "pages"));
  if (!hasLocalPackage && framework === "vite" && hasViteFiles(target)) {
    await completeViteProject(target, dryRun);
    return dryRun ? undefined : detectProject(target);
  }
  if (!hasLocalPackage && hasLocalNextProject) {
    await completeNextProject(target, dryRun);
    return dryRun ? undefined : detectProject(target);
  }

  let project = detectProject(target);
  if (
    project.framework === "vite" ||
    (project.framework === "unknown" &&
      framework === "vite" &&
      (isEffectivelyEmpty(project.root) || hasViteFiles(project.root)))
  ) {
    const changed = await completeViteProject(project.root, dryRun);
    if (dryRun && changed) return undefined;
    project = detectProject(project.root);
  }
  const hasNextFiles =
    existsSync(join(project.root, "app")) || existsSync(join(project.root, "src", "app"));
  if (
    project.framework === "unknown" &&
    framework !== "vite" &&
    (framework === "next" || isEffectivelyEmpty(project.root) || hasNextFiles)
  ) {
    await completeNextProject(project.root, dryRun);
    if (dryRun) return undefined;
    project = detectProject(project.root);
  }
  if (project.framework === "next") {
    const changed = await completeNextProject(project.root, dryRun);
    if (dryRun && changed) return undefined;
    project = detectProject(project.root);
  }
  return project;
}
