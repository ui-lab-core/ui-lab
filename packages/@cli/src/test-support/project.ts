import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

export const defaultLayout = `import type { Metadata } from "next";

export const metadata: Metadata = { title: "Example" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body>{children}</body></html>;
}
`;
export function createProjectFixture(
  source = '@import "tailwindcss";\nbody { color: red; }\n',
  location: "app" | "src" | "non-next" = "app",
): string {
  const root = mkdtempSync(join(tmpdir(), "ui-lab-theme-"));
  writeFileSync(
    join(root, "package.json"),
    JSON.stringify({
      dependencies: location === "non-next" ? { react: "1" } : { next: "1" },
    }),
  );
  const app = location === "src" ? join(root, "src/app") : join(root, "app");
  mkdirSync(app, { recursive: true });
  writeFileSync(join(app, "globals.css"), source);
  if (location !== "non-next")
    writeFileSync(join(app, "layout.tsx"), defaultLayout);
  return root;
}
export function removeProjectFixture(root: string): void {
  rmSync(root, { recursive: true, force: true });
}
