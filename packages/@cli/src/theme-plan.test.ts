import assert from "node:assert/strict";
import test from "node:test";
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { applyInitPlan as applyThemeWrites } from "./init/apply-plan.js";
import { buildInitPlan as buildThemePlan } from "./init/build-plan.js";
import { integrateNextLayout } from "./next/layout.js";

const layout = `import type { Metadata } from "next";

export const metadata: Metadata = { title: "Example" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body>{children}</body></html>;
}
`;

function fixture(
  source = '@import "tailwindcss";\nbody { color: red; }\n',
  location = "app",
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
  if (location !== "non-next") writeFileSync(join(app, "layout.tsx"), layout);
  return root;
}

test("plans a complete Next App Router installation", () => {
  const root = fixture();
  try {
    const plan = buildThemePlan({
      root,
      stylesheet: "app/globals.css",
      typography: true,
      colorMode: "system",
      layout: "app/layout.tsx",
    });
    assert.deepEqual(plan.packages, [
      "ui-lab-components",
      "ui-lab-theme-onyx",
      "tailwindcss@4.2.4",
      "@fontsource-variable/work-sans",
      "@fontsource-variable/jetbrains-mono",
    ]);
    assert.ok(
      plan.writes.some(
        (write) => write.path === "app/theme.css" && write.kind === "create",
      ),
    );
    assert.ok(
      plan.writes.some(
        (write) =>
          write.path === "app/typography.css" && write.kind === "create",
      ),
    );
    assert.ok(
      plan.writes.some(
        (write) => write.path === "app/layout.tsx" && write.kind === "layout",
      ),
    );
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test("supports src/app layouts and does not plan layout work for non-Next setup", () => {
  const root = fixture(undefined, "src");
  const nonNext = fixture(undefined, "non-next");
  try {
    assert.ok(
      buildThemePlan({
        root,
        stylesheet: "src/app/globals.css",
        typography: false,
        colorMode: "light",
        layout: "src/app/layout.tsx",
      }).writes.some((write) => write.kind === "layout"),
    );
    assert.equal(
      buildThemePlan({
        root: nonNext,
        stylesheet: "app/globals.css",
        typography: false,
        colorMode: "dark",
      }).writes.some((write) => write.kind === "layout"),
      false,
    );
  } finally {
    rmSync(root, { recursive: true, force: true });
    rmSync(nonNext, { recursive: true, force: true });
  }
});

test("planning and dry-run inputs write nothing, then repeated plans are idempotent", () => {
  const root = fixture();
  try {
    const first = buildThemePlan({
      root,
      stylesheet: "app/globals.css",
      typography: true,
      colorMode: "system",
      layout: "app/layout.tsx",
    });
    assert.equal(existsSync(join(root, "app/theme.css")), false);
    applyThemeWrites(root, first.writes);
    const second = buildThemePlan({
      root,
      stylesheet: "app/globals.css",
      typography: true,
      colorMode: "system",
      layout: "app/layout.tsx",
    });
    assert.equal(second.writes.length, 0, JSON.stringify(second.writes.map((write) => write.path)));
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test("preserves user CSS and supports typography on and off", () => {
  const root = fixture("body { color: red; }\n");
  try {
    const withoutTypography = buildThemePlan({
      root,
      stylesheet: "app/globals.css",
      typography: false,
      colorMode: "system",
    });
    const global =
      withoutTypography.writes.find((write) => write.path === "app/globals.css")
        ?.content ?? "";
    assert.match(global, /body \{ color: red; \}/);
    assert.doesNotMatch(global, /typography\.css/);
    assert.ok(
      buildThemePlan({
        root,
        stylesheet: "app/globals.css",
        typography: true,
        colorMode: "system",
      }).writes.some((write) => write.path === "app/typography.css"),
    );
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test("applies shared configuration output, optional font, typography, and toggle", () => {
  const root = fixture();
  try {
    const plan = buildThemePlan({
      root, stylesheet:"app/globals.css", typography:false, colorMode:"dark",
      customFont:false, themeToggle:true, themeCss:":root { --accent-400: red; }",
      typographyCss:"@layer theme { :root { --text-body-size: 1rem; } }",
      layoutConfig:{radius:1.2,borderWidth:2,spacingScale:.8},
      typographyConfig:{headerScale:.6,headerMinFontSizePx:11,bodyScale:.8,bodyMinFontSizePx:14,monoFontSizeScale:1.1,monoFontWeightScale:1.2,monoLetterSpacingScale:2,monoLineHeight:1.8,monoMinFontSizePx:12},
    });
    assert.deepEqual(plan.packages, ["ui-lab-components","ui-lab-theme-onyx","tailwindcss@4.2.4"]);
    assert.equal(plan.writes.some((write) => write.path.endsWith("fonts.css")), false);
    assert.equal(plan.writes.some((write) => write.path.endsWith("typography.css")), false);
    assert.match(plan.writes.find((write) => write.path.endsWith("theme.css"))?.content ?? "", /accent-400: red/);
    assert.ok(plan.writes.some((write) => write.path === "components/theme-toggle.tsx"));
    const global = plan.writes.find((write) => write.path === "app/globals.css")?.content ?? "";
    assert.match(global, /--radius-sm: 0\.600rem/);
    assert.doesNotMatch(global, /fonts\.css/);
  } finally { rmSync(root, { recursive:true, force:true }); }
});

test("safely transforms supported layouts and refuses unsupported layouts", () => {
  const transformed = integrateNextLayout(layout);
  assert.match(transformed, /import \{ cookies \} from "next\/headers";/);
  assert.match(transformed, /export default async function RootLayout/);
  assert.match(transformed, /data-theme=\{rootTheme\.dataTheme\}/);
  assert.throws(
    () =>
      integrateNextLayout(
        "export default function RootLayout() { return null; }",
      ),
    /Apply this snippet manually/,
  );
});
