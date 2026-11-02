import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import dts from "vite-plugin-dts";
import path from "path";
import fs from "fs";
import { createPostcssPlugins } from "./postcss.config.mts";

const componentsDir = path.resolve(__dirname, "src/components");
const componentEntries = Object.fromEntries(
  fs
    .readdirSync(componentsDir, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => {
      const indexTs = path.join(componentsDir, dirent.name, "index.ts");
      const indexTsx = path.join(componentsDir, dirent.name, "index.tsx");
      const entry = fs.existsSync(indexTs) ? indexTs : fs.existsSync(indexTsx) ? indexTsx : null;
      return entry ? [dirent.name.toLowerCase(), entry] : null;
    })
    .filter((pair): pair is [string, string] => pair !== null),
);

type CssChunk = {
  fileName: string;
  viteMetadata?: {
    importedCss?: Set<string>;
  };
};

/**
 * Vite extracts library CSS but does not retain a static import in the emitted
 * JavaScript. Restore that association so consumers automatically receive the
 * CSS for every component chunk their bundler keeps.
 */
function injectCssImports(): Plugin {
  return {
    name: "ui-lab-inject-css-imports",
    apply: "build",
    enforce: "post",
    renderChunk(code, chunk) {
      const { importedCss } = (chunk as CssChunk).viteMetadata ?? {};
      const styles = [...(importedCss ?? [])].sort();
      if (styles.length === 0) return null;

      const directory = path.posix.dirname(chunk.fileName);
      const imports = styles.map((fileName) => {
        const relative = path.posix.relative(directory, fileName);
        const specifier = relative.startsWith(".") ? relative : `./${relative}`;
        return `import ${JSON.stringify(specifier)};`;
      });

      const directive = '"use client";';
      const hasClientDirective = code.startsWith(directive);

      return {
        // Keep the client directive first. A directive after an import is an
        // ordinary string literal, which makes Next render client primitives
        // through its server path during SSR.
        code: hasClientDirective
          ? `${directive}\n${imports.join("\n")}\n${code.slice(directive.length)}`
          : `${imports.join("\n")}\n${code}`,
        map: null,
      };
    },
  };
}

function cleanStaleBuildAssets(): Plugin {
  let previousAssets = new Set<string>();
  const preservedAssets = new Set(["styles.css", "typography.css", "postcss-ui-lab.mjs"]);

  return {
    name: "ui-lab-clean-stale-build-assets",
    apply: "build",
    buildStart() {
      const dist = path.resolve(__dirname, "dist");
      if (!fs.existsSync(dist)) return;

      previousAssets = new Set(
        fs
          .readdirSync(dist, { recursive: true, withFileTypes: true })
          .filter((entry) => entry.isFile())
          .map((entry) => path.relative(dist, path.join(entry.parentPath, entry.name)))
          .filter((file) => file.endsWith(".js") || file.endsWith(".css")),
      );
    },
    writeBundle(_options, bundle) {
      const dist = path.resolve(__dirname, "dist");
      const currentAssets = new Set(Object.keys(bundle));

      for (const file of previousAssets) {
        if (preservedAssets.has(file) || currentAssets.has(file)) continue;
        fs.rmSync(path.join(dist, file), { force: true });
      }
    },
  };
}

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  css: {
    postcss: {
      plugins: createPostcssPlugins(),
    },
  },
  plugins: [
    react(),
    injectCssImports(),
    cleanStaleBuildAssets(),
    dts({
      insertTypesEntry: true,
      exclude: ["**/*.test.ts", "**/*.test.tsx", "src/tests/**", "**/tests/**"],
    }),
  ],
  build: {
    sourcemap: false,
    // Keep the published aggregate stylesheet resolvable while a rebuild is in
    // progress. Stale Vite assets are removed after the replacement output has
    // been written.
    emptyOutDir: false,
    cssCodeSplit: true,
    lib: {
      entry: {
        "ui-lab-ui": path.resolve(__dirname, "src/index.ts"),
        "icon-provider": path.resolve(__dirname, "src/components/Icon/provider.ts"),
        "icon-route": path.resolve(__dirname, "src/components/Icon/route.ts"),
        providers: path.resolve(__dirname, "src/theme/index.ts"),
        "theme-script": path.resolve(__dirname, "src/theme/script.ts"),
        "theme-server": path.resolve(__dirname, "src/theme-server.ts"),
        "theme-contract": path.resolve(__dirname, "src/theme-contract.ts"),
        scripts: path.resolve(__dirname, "src/scripts.ts"),
        ...componentEntries,
      },
      formats: ["es"],
    },
    rollupOptions: {
      external: [
        /^node:/,
        "react",
        "react/jsx-runtime",
        "react/jsx-dev-runtime",
        "react-dom",
        "react-dom/client",
        "shiki",
        /^shiki\/.*/,
        "react-aria",
        "react-stately",
        "gsap",
        /^gsap\/.*/,
        "@gsap/react",
        /^@react-aria\/.*/,
        /^@react-stately\/.*/,
        /^@react-types\/.*/,
      ],
      output: {
        hoistTransitiveImports: false,
        entryFileNames: "[name].es.js",
        chunkFileNames: "chunks/[name]-[hash].js",
        // Component/provider entries are client components; the pure script entries are not.
        banner: (chunk) => {
          if (!chunk.isEntry) return "";
          const serverSafe = new Set([
            "theme-script",
            "theme-server",
            "theme-contract",
            "scripts",
            "icon-route",
          ]);
          return serverSafe.has(chunk.name) ? "" : '"use client";';
        },
      },
    },
  },
});
