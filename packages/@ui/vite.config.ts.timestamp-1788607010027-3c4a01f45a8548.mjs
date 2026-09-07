var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// ../../postcss/slot.cjs
var require_slot = __commonJS({
  "../../postcss/slot.cjs"(exports, module) {
    var identifier = /^[a-z][a-z0-9-]*$/i;
    function propertyName(slot, property) {
      return `--slot-${slot}-${property}`;
    }
    function splitArguments(value) {
      const arguments_ = [];
      let start = 0;
      let depth = 0;
      for (let index = 0; index < value.length; index += 1) {
        const character = value[index];
        if (character === "(") depth += 1;
        if (character === ")") depth -= 1;
        if (character === "," && depth === 0) {
          arguments_.push(value.slice(start, index).trim());
          start = index + 1;
        }
      }
      arguments_.push(value.slice(start).trim());
      return arguments_;
    }
    function expandSlotFunctions2(value) {
      let result = "";
      let cursor = 0;
      while (cursor < value.length) {
        const match = /(^|[^a-zA-Z0-9_-])slot\(/.exec(value.slice(cursor));
        if (!match) return result + value.slice(cursor);
        const prefixLength = match[1].length;
        const functionStart = cursor + match.index + prefixLength;
        const argumentsStart = functionStart + "slot(".length;
        let depth = 1;
        let end = argumentsStart;
        while (end < value.length && depth > 0) {
          if (value[end] === "(") depth += 1;
          if (value[end] === ")") depth -= 1;
          end += 1;
        }
        if (depth !== 0) throw new Error("Unclosed slot() function");
        const arguments_ = splitArguments(value.slice(argumentsStart, end - 1));
        if (arguments_.length < 2 || arguments_.length > 3 || arguments_.some((item) => !item)) {
          throw new Error("slot() requires a slot, property, and optional fallback");
        }
        const [slot, property, fallback] = arguments_;
        if (!identifier.test(slot) || !identifier.test(property)) {
          throw new Error("slot() slot and property names must be CSS identifiers");
        }
        const expandedFallback = fallback === void 0 ? void 0 : expandSlotFunctions2(fallback);
        const replacement = `var(${propertyName(slot, property)}${expandedFallback === void 0 ? "" : `, ${expandedFallback}`})`;
        result += value.slice(cursor, functionStart) + replacement;
        cursor = end;
      }
      return result;
    }
    function slotPlugin2() {
      return {
        postcssPlugin: "ui-lab-slot",
        Once(root) {
          root.walkAtRules("slot", (atRule) => {
            const slot = atRule.params.trim();
            if (!identifier.test(slot)) throw atRule.error("@slot requires one CSS identifier");
            if (!atRule.nodes) throw atRule.error("@slot requires a declaration block");
            const transformNodes = (nodes) => {
              for (const node of nodes) {
                if (node.type === "comment") continue;
                if (node.type === "atrule" && node.name === "supports" && node.nodes) {
                  transformNodes(node.nodes);
                  continue;
                }
                if (node.type !== "decl" || !node.prop.startsWith("--")) {
                  throw atRule.error("@slot blocks may contain only custom property declarations");
                }
                const property = node.prop.slice(2);
                if (!identifier.test(property)) throw node.error("Invalid @slot property name");
                node.prop = propertyName(slot, property);
              }
            };
            transformNodes(atRule.nodes);
            atRule.replaceWith(...atRule.nodes);
          });
          root.walkDecls((declaration) => {
            if (!declaration.value.includes("slot(")) return;
            try {
              declaration.value = expandSlotFunctions2(declaration.value);
            } catch (error) {
              throw declaration.error(error instanceof Error ? error.message : String(error));
            }
          });
        }
      };
    }
    module.exports = slotPlugin2;
    module.exports.expandSlotFunctions = expandSlotFunctions2;
  }
});

// ../../postcss/variant.cjs
var require_variant = __commonJS({
  "../../postcss/variant.cjs"(exports, module) {
    var identifier = /^[a-z][a-z0-9-]*$/i;
    function parseVariant2(atRule) {
      const parts = atRule.params.trim().split(/\s+/).filter(Boolean);
      if (parts.length !== 2 && parts.length !== 3 || parts.some((part) => !identifier.test(part)) || parts.length === 3 && parts[2] !== "default") {
        throw atRule.error(
          "@variant requires a component and variant CSS identifier, optionally followed by default"
        );
      }
      if (!atRule.nodes) throw atRule.error("@variant requires a declaration block");
      return { component: parts[0], variant: parts[1], isDefault: parts[2] === "default" };
    }
    function variantSelector2(component, variant, isDefault = false) {
      const explicit = `.${component}[data-variant="${variant}"]`;
      return isDefault ? `${explicit},
.${component}:not([data-variant])` : explicit;
    }
    function variantPlugin2() {
      return {
        postcssPlugin: "ui-lab-variant",
        Once(root) {
          const defaults = /* @__PURE__ */ new Map();
          root.walkAtRules("variant", (atRule) => {
            const { component, variant, isDefault } = parseVariant2(atRule);
            if (!isDefault) return;
            const existing = defaults.get(component);
            if (existing && existing !== variant) {
              throw atRule.error(`@variant defines more than one default for ${component}`);
            }
            defaults.set(component, variant);
          });
          root.walkAtRules("variant", (atRule) => {
            const { component, variant } = parseVariant2(atRule);
            const rule = atRule.clone({
              type: "rule",
              name: void 0,
              params: void 0,
              selector: variantSelector2(component, variant, defaults.get(component) === variant)
            });
            atRule.replaceWith(rule);
          });
        }
      };
    }
    module.exports = variantPlugin2;
    module.exports.parseVariant = parseVariant2;
    module.exports.variantSelector = variantSelector2;
  }
});

// vite.config.ts
import { defineConfig } from "file:///home/kyza/Projects/ui-lab/app/node_modules/.pnpm/vite@5.4.21_@types+node@20.19.27_lightningcss@1.30.2/node_modules/vite/dist/node/index.js";
import react from "file:///home/kyza/Projects/ui-lab/app/node_modules/.pnpm/@vitejs+plugin-react@4.7.0_vite@5.4.21_@types+node@20.19.27_lightningcss@1.30.2_/node_modules/@vitejs/plugin-react/dist/index.js";
import dts from "file:///home/kyza/Projects/ui-lab/app/node_modules/.pnpm/vite-plugin-dts@3.9.1_@types+node@20.19.27_rollup@4.54.0_typescript@5.9.3_vite@5.4.21_@_cd114b7b027dd3b1e087cd4a5bda2810/node_modules/vite-plugin-dts/dist/index.mjs";
import path from "path";
import fs from "fs";

// postcss.config.mts
import tailwindcss from "file:///home/kyza/Projects/ui-lab/app/node_modules/.pnpm/@tailwindcss+postcss@4.1.18/node_modules/@tailwindcss/postcss/dist/index.mjs";

// ../../postcss/slot.mjs
var import_slot = __toESM(require_slot(), 1);
var { expandSlotFunctions } = import_slot.default;
var slot_default = import_slot.default;

// ../../postcss/variant.mjs
var import_variant = __toESM(require_variant(), 1);
var { parseVariant, variantSelector } = import_variant.default;
var variant_default = import_variant.default;

// postcss.config.mts
var MIX_FUNCTION = "mix(";
var MIX_FUNCTION_PATTERN = /(^|[^A-Za-z0-9_-])mix\(/g;
function expandMixFunctions(value) {
  return value.replace(MIX_FUNCTION_PATTERN, "$1color-mix(in srgb, ");
}
function mixFunction() {
  return {
    postcssPlugin: "ui-lab-mix-function",
    Declaration(decl) {
      if (!decl.value.includes(MIX_FUNCTION)) return;
      decl.value = expandMixFunctions(decl.value);
    },
    AtRule(atRule) {
      if (!atRule.params.includes(MIX_FUNCTION)) return;
      atRule.params = expandMixFunctions(atRule.params);
    }
  };
}
function demoteTailwindUtilityLayer() {
  return {
    postcssPlugin: "ui-lab-demote-tailwind-utility-layer",
    AtRule(atRule) {
      if (atRule.name !== "layer") return;
      if (atRule.params.trim() !== "utilities") return;
      if (!Array.isArray(atRule.nodes) || atRule.nodes.length === 0) return;
      atRule.params = "components";
    }
  };
}
function createPostcssPlugins() {
  return [variant_default(), slot_default(), mixFunction(), tailwindcss(), demoteTailwindUtilityLayer()];
}
var postcss_config_default = {
  plugins: createPostcssPlugins()
};

// vite.config.ts
var __vite_injected_original_dirname = "/home/kyza/Projects/ui-lab/app/packages/@ui";
var componentsDir = path.resolve(__vite_injected_original_dirname, "src/components");
var componentEntries = Object.fromEntries(
  fs.readdirSync(componentsDir, { withFileTypes: true }).filter((dirent) => dirent.isDirectory()).map((dirent) => {
    const indexTs = path.join(componentsDir, dirent.name, "index.ts");
    const indexTsx = path.join(componentsDir, dirent.name, "index.tsx");
    const entry = fs.existsSync(indexTs) ? indexTs : fs.existsSync(indexTsx) ? indexTsx : null;
    return entry ? [dirent.name.toLowerCase(), entry] : null;
  }).filter((pair) => pair !== null)
);
function injectCssImports() {
  return {
    name: "ui-lab-inject-css-imports",
    apply: "build",
    enforce: "post",
    renderChunk(code, chunk) {
      const { importedCss } = chunk.viteMetadata ?? {};
      const styles = [...importedCss ?? []].sort();
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
        code: hasClientDirective ? `${directive}
${imports.join("\n")}
${code.slice(directive.length)}` : `${imports.join("\n")}
${code}`,
        map: null
      };
    }
  };
}
function cleanStaleBuildAssets() {
  let previousAssets = /* @__PURE__ */ new Set();
  const preservedAssets = /* @__PURE__ */ new Set(["styles.css", "typography.css", "postcss-ui-lab.mjs"]);
  return {
    name: "ui-lab-clean-stale-build-assets",
    apply: "build",
    buildStart() {
      const dist = path.resolve(__vite_injected_original_dirname, "dist");
      if (!fs.existsSync(dist)) return;
      previousAssets = new Set(
        fs.readdirSync(dist, { recursive: true, withFileTypes: true }).filter((entry) => entry.isFile()).map((entry) => path.relative(dist, path.join(entry.parentPath, entry.name))).filter((file) => file.endsWith(".js") || file.endsWith(".css"))
      );
    },
    writeBundle(_options, bundle) {
      const dist = path.resolve(__vite_injected_original_dirname, "dist");
      const currentAssets = new Set(Object.keys(bundle));
      for (const file of previousAssets) {
        if (preservedAssets.has(file) || currentAssets.has(file)) continue;
        fs.rmSync(path.join(dist, file), { force: true });
      }
    }
  };
}
var vite_config_default = defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__vite_injected_original_dirname, "./src")
    }
  },
  css: {
    postcss: {
      plugins: createPostcssPlugins()
    }
  },
  plugins: [
    react(),
    injectCssImports(),
    cleanStaleBuildAssets(),
    dts({
      insertTypesEntry: true,
      exclude: ["**/*.test.ts", "**/*.test.tsx", "src/tests/**", "**/tests/**"]
    })
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
        "ui-lab-ui": path.resolve(__vite_injected_original_dirname, "src/index.ts"),
        providers: path.resolve(__vite_injected_original_dirname, "src/providers/index.ts"),
        "theme-script": path.resolve(__vite_injected_original_dirname, "src/providers/themeScript.ts"),
        "theme-server": path.resolve(__vite_injected_original_dirname, "src/theme-server.ts"),
        "theme-contract": path.resolve(__vite_injected_original_dirname, "src/theme-contract.ts"),
        scripts: path.resolve(__vite_injected_original_dirname, "src/scripts.ts"),
        ...componentEntries
      },
      formats: ["es"]
    },
    rollupOptions: {
      external: [
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
        /^@react-types\/.*/
      ],
      output: {
        hoistTransitiveImports: false,
        entryFileNames: "[name].es.js",
        chunkFileNames: "chunks/[name]-[hash].js",
        // Component/provider entries are client components; the pure script entries are not.
        banner: (chunk) => {
          if (!chunk.isEntry) return "";
          const serverSafe = /* @__PURE__ */ new Set(["theme-script", "theme-server", "theme-contract", "scripts"]);
          return serverSafe.has(chunk.name) ? "" : '"use client";';
        }
      }
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vLi4vcG9zdGNzcy9zbG90LmNqcyIsICIuLi8uLi9wb3N0Y3NzL3ZhcmlhbnQuY2pzIiwgInZpdGUuY29uZmlnLnRzIiwgInBvc3Rjc3MuY29uZmlnLm10cyIsICIuLi8uLi9wb3N0Y3NzL3Nsb3QubWpzIiwgIi4uLy4uL3Bvc3Rjc3MvdmFyaWFudC5tanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvaG9tZS9reXphL1Byb2plY3RzL3VpLWxhYi9hcHAvcG9zdGNzc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL2hvbWUva3l6YS9Qcm9qZWN0cy91aS1sYWIvYXBwL3Bvc3Rjc3Mvc2xvdC5janNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL2hvbWUva3l6YS9Qcm9qZWN0cy91aS1sYWIvYXBwL3Bvc3Rjc3Mvc2xvdC5janNcIjtjb25zdCBpZGVudGlmaWVyID0gL15bYS16XVthLXowLTktXSokL2k7XG5cbmZ1bmN0aW9uIHByb3BlcnR5TmFtZShzbG90LCBwcm9wZXJ0eSkge1xuICByZXR1cm4gYC0tc2xvdC0ke3Nsb3R9LSR7cHJvcGVydHl9YDtcbn1cblxuZnVuY3Rpb24gc3BsaXRBcmd1bWVudHModmFsdWUpIHtcbiAgY29uc3QgYXJndW1lbnRzXyA9IFtdO1xuICBsZXQgc3RhcnQgPSAwO1xuICBsZXQgZGVwdGggPSAwO1xuXG4gIGZvciAobGV0IGluZGV4ID0gMDsgaW5kZXggPCB2YWx1ZS5sZW5ndGg7IGluZGV4ICs9IDEpIHtcbiAgICBjb25zdCBjaGFyYWN0ZXIgPSB2YWx1ZVtpbmRleF07XG4gICAgaWYgKGNoYXJhY3RlciA9PT0gXCIoXCIpIGRlcHRoICs9IDE7XG4gICAgaWYgKGNoYXJhY3RlciA9PT0gXCIpXCIpIGRlcHRoIC09IDE7XG4gICAgaWYgKGNoYXJhY3RlciA9PT0gXCIsXCIgJiYgZGVwdGggPT09IDApIHtcbiAgICAgIGFyZ3VtZW50c18ucHVzaCh2YWx1ZS5zbGljZShzdGFydCwgaW5kZXgpLnRyaW0oKSk7XG4gICAgICBzdGFydCA9IGluZGV4ICsgMTtcbiAgICB9XG4gIH1cblxuICBhcmd1bWVudHNfLnB1c2godmFsdWUuc2xpY2Uoc3RhcnQpLnRyaW0oKSk7XG4gIHJldHVybiBhcmd1bWVudHNfO1xufVxuXG5mdW5jdGlvbiBleHBhbmRTbG90RnVuY3Rpb25zKHZhbHVlKSB7XG4gIGxldCByZXN1bHQgPSBcIlwiO1xuICBsZXQgY3Vyc29yID0gMDtcblxuICB3aGlsZSAoY3Vyc29yIDwgdmFsdWUubGVuZ3RoKSB7XG4gICAgY29uc3QgbWF0Y2ggPSAvKF58W15hLXpBLVowLTlfLV0pc2xvdFxcKC8uZXhlYyh2YWx1ZS5zbGljZShjdXJzb3IpKTtcbiAgICBpZiAoIW1hdGNoKSByZXR1cm4gcmVzdWx0ICsgdmFsdWUuc2xpY2UoY3Vyc29yKTtcblxuICAgIGNvbnN0IHByZWZpeExlbmd0aCA9IG1hdGNoWzFdLmxlbmd0aDtcbiAgICBjb25zdCBmdW5jdGlvblN0YXJ0ID0gY3Vyc29yICsgbWF0Y2guaW5kZXggKyBwcmVmaXhMZW5ndGg7XG4gICAgY29uc3QgYXJndW1lbnRzU3RhcnQgPSBmdW5jdGlvblN0YXJ0ICsgXCJzbG90KFwiLmxlbmd0aDtcbiAgICBsZXQgZGVwdGggPSAxO1xuICAgIGxldCBlbmQgPSBhcmd1bWVudHNTdGFydDtcblxuICAgIHdoaWxlIChlbmQgPCB2YWx1ZS5sZW5ndGggJiYgZGVwdGggPiAwKSB7XG4gICAgICBpZiAodmFsdWVbZW5kXSA9PT0gXCIoXCIpIGRlcHRoICs9IDE7XG4gICAgICBpZiAodmFsdWVbZW5kXSA9PT0gXCIpXCIpIGRlcHRoIC09IDE7XG4gICAgICBlbmQgKz0gMTtcbiAgICB9XG5cbiAgICBpZiAoZGVwdGggIT09IDApIHRocm93IG5ldyBFcnJvcihcIlVuY2xvc2VkIHNsb3QoKSBmdW5jdGlvblwiKTtcblxuICAgIGNvbnN0IGFyZ3VtZW50c18gPSBzcGxpdEFyZ3VtZW50cyh2YWx1ZS5zbGljZShhcmd1bWVudHNTdGFydCwgZW5kIC0gMSkpO1xuICAgIGlmIChhcmd1bWVudHNfLmxlbmd0aCA8IDIgfHwgYXJndW1lbnRzXy5sZW5ndGggPiAzIHx8IGFyZ3VtZW50c18uc29tZSgoaXRlbSkgPT4gIWl0ZW0pKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJzbG90KCkgcmVxdWlyZXMgYSBzbG90LCBwcm9wZXJ0eSwgYW5kIG9wdGlvbmFsIGZhbGxiYWNrXCIpO1xuICAgIH1cblxuICAgIGNvbnN0IFtzbG90LCBwcm9wZXJ0eSwgZmFsbGJhY2tdID0gYXJndW1lbnRzXztcbiAgICBpZiAoIWlkZW50aWZpZXIudGVzdChzbG90KSB8fCAhaWRlbnRpZmllci50ZXN0KHByb3BlcnR5KSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFwic2xvdCgpIHNsb3QgYW5kIHByb3BlcnR5IG5hbWVzIG11c3QgYmUgQ1NTIGlkZW50aWZpZXJzXCIpO1xuICAgIH1cblxuICAgIGNvbnN0IGV4cGFuZGVkRmFsbGJhY2sgPSBmYWxsYmFjayA9PT0gdW5kZWZpbmVkID8gdW5kZWZpbmVkIDogZXhwYW5kU2xvdEZ1bmN0aW9ucyhmYWxsYmFjayk7XG4gICAgY29uc3QgcmVwbGFjZW1lbnQgPSBgdmFyKCR7cHJvcGVydHlOYW1lKHNsb3QsIHByb3BlcnR5KX0ke1xuICAgICAgZXhwYW5kZWRGYWxsYmFjayA9PT0gdW5kZWZpbmVkID8gXCJcIiA6IGAsICR7ZXhwYW5kZWRGYWxsYmFja31gXG4gICAgfSlgO1xuXG4gICAgcmVzdWx0ICs9IHZhbHVlLnNsaWNlKGN1cnNvciwgZnVuY3Rpb25TdGFydCkgKyByZXBsYWNlbWVudDtcbiAgICBjdXJzb3IgPSBlbmQ7XG4gIH1cblxuICByZXR1cm4gcmVzdWx0O1xufVxuXG5mdW5jdGlvbiBzbG90UGx1Z2luKCkge1xuICByZXR1cm4ge1xuICAgIHBvc3Rjc3NQbHVnaW46IFwidWktbGFiLXNsb3RcIixcbiAgICBPbmNlKHJvb3QpIHtcbiAgICAgIHJvb3Qud2Fsa0F0UnVsZXMoXCJzbG90XCIsIChhdFJ1bGUpID0+IHtcbiAgICAgICAgY29uc3Qgc2xvdCA9IGF0UnVsZS5wYXJhbXMudHJpbSgpO1xuICAgICAgICBpZiAoIWlkZW50aWZpZXIudGVzdChzbG90KSkgdGhyb3cgYXRSdWxlLmVycm9yKFwiQHNsb3QgcmVxdWlyZXMgb25lIENTUyBpZGVudGlmaWVyXCIpO1xuICAgICAgICBpZiAoIWF0UnVsZS5ub2RlcykgdGhyb3cgYXRSdWxlLmVycm9yKFwiQHNsb3QgcmVxdWlyZXMgYSBkZWNsYXJhdGlvbiBibG9ja1wiKTtcblxuICAgICAgICBjb25zdCB0cmFuc2Zvcm1Ob2RlcyA9IChub2RlcykgPT4ge1xuICAgICAgICAgIGZvciAoY29uc3Qgbm9kZSBvZiBub2Rlcykge1xuICAgICAgICAgICAgaWYgKG5vZGUudHlwZSA9PT0gXCJjb21tZW50XCIpIGNvbnRpbnVlO1xuICAgICAgICAgICAgaWYgKG5vZGUudHlwZSA9PT0gXCJhdHJ1bGVcIiAmJiBub2RlLm5hbWUgPT09IFwic3VwcG9ydHNcIiAmJiBub2RlLm5vZGVzKSB7XG4gICAgICAgICAgICAgIHRyYW5zZm9ybU5vZGVzKG5vZGUubm9kZXMpO1xuICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChub2RlLnR5cGUgIT09IFwiZGVjbFwiIHx8ICFub2RlLnByb3Auc3RhcnRzV2l0aChcIi0tXCIpKSB7XG4gICAgICAgICAgICAgIHRocm93IGF0UnVsZS5lcnJvcihcIkBzbG90IGJsb2NrcyBtYXkgY29udGFpbiBvbmx5IGN1c3RvbSBwcm9wZXJ0eSBkZWNsYXJhdGlvbnNcIik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCBwcm9wZXJ0eSA9IG5vZGUucHJvcC5zbGljZSgyKTtcbiAgICAgICAgICAgIGlmICghaWRlbnRpZmllci50ZXN0KHByb3BlcnR5KSkgdGhyb3cgbm9kZS5lcnJvcihcIkludmFsaWQgQHNsb3QgcHJvcGVydHkgbmFtZVwiKTtcbiAgICAgICAgICAgIG5vZGUucHJvcCA9IHByb3BlcnR5TmFtZShzbG90LCBwcm9wZXJ0eSk7XG4gICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIHRyYW5zZm9ybU5vZGVzKGF0UnVsZS5ub2Rlcyk7XG4gICAgICAgIGF0UnVsZS5yZXBsYWNlV2l0aCguLi5hdFJ1bGUubm9kZXMpO1xuICAgICAgfSk7XG5cbiAgICAgIHJvb3Qud2Fsa0RlY2xzKChkZWNsYXJhdGlvbikgPT4ge1xuICAgICAgICBpZiAoIWRlY2xhcmF0aW9uLnZhbHVlLmluY2x1ZGVzKFwic2xvdChcIikpIHJldHVybjtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBkZWNsYXJhdGlvbi52YWx1ZSA9IGV4cGFuZFNsb3RGdW5jdGlvbnMoZGVjbGFyYXRpb24udmFsdWUpO1xuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgIHRocm93IGRlY2xhcmF0aW9uLmVycm9yKGVycm9yIGluc3RhbmNlb2YgRXJyb3IgPyBlcnJvci5tZXNzYWdlIDogU3RyaW5nKGVycm9yKSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0sXG4gIH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gc2xvdFBsdWdpbjtcbm1vZHVsZS5leHBvcnRzLmV4cGFuZFNsb3RGdW5jdGlvbnMgPSBleHBhbmRTbG90RnVuY3Rpb25zO1xuIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvaG9tZS9reXphL1Byb2plY3RzL3VpLWxhYi9hcHAvcG9zdGNzc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL2hvbWUva3l6YS9Qcm9qZWN0cy91aS1sYWIvYXBwL3Bvc3Rjc3MvdmFyaWFudC5janNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL2hvbWUva3l6YS9Qcm9qZWN0cy91aS1sYWIvYXBwL3Bvc3Rjc3MvdmFyaWFudC5janNcIjtjb25zdCBpZGVudGlmaWVyID0gL15bYS16XVthLXowLTktXSokL2k7XG5cbmZ1bmN0aW9uIHBhcnNlVmFyaWFudChhdFJ1bGUpIHtcbiAgY29uc3QgcGFydHMgPSBhdFJ1bGUucGFyYW1zLnRyaW0oKS5zcGxpdCgvXFxzKy8pLmZpbHRlcihCb29sZWFuKTtcbiAgaWYgKFxuICAgIChwYXJ0cy5sZW5ndGggIT09IDIgJiYgcGFydHMubGVuZ3RoICE9PSAzKSB8fFxuICAgIHBhcnRzLnNvbWUoKHBhcnQpID0+ICFpZGVudGlmaWVyLnRlc3QocGFydCkpIHx8XG4gICAgKHBhcnRzLmxlbmd0aCA9PT0gMyAmJiBwYXJ0c1syXSAhPT0gXCJkZWZhdWx0XCIpXG4gICkge1xuICAgIHRocm93IGF0UnVsZS5lcnJvcihcbiAgICAgIFwiQHZhcmlhbnQgcmVxdWlyZXMgYSBjb21wb25lbnQgYW5kIHZhcmlhbnQgQ1NTIGlkZW50aWZpZXIsIG9wdGlvbmFsbHkgZm9sbG93ZWQgYnkgZGVmYXVsdFwiLFxuICAgICk7XG4gIH1cbiAgaWYgKCFhdFJ1bGUubm9kZXMpIHRocm93IGF0UnVsZS5lcnJvcihcIkB2YXJpYW50IHJlcXVpcmVzIGEgZGVjbGFyYXRpb24gYmxvY2tcIik7XG4gIHJldHVybiB7IGNvbXBvbmVudDogcGFydHNbMF0sIHZhcmlhbnQ6IHBhcnRzWzFdLCBpc0RlZmF1bHQ6IHBhcnRzWzJdID09PSBcImRlZmF1bHRcIiB9O1xufVxuXG5mdW5jdGlvbiB2YXJpYW50U2VsZWN0b3IoY29tcG9uZW50LCB2YXJpYW50LCBpc0RlZmF1bHQgPSBmYWxzZSkge1xuICBjb25zdCBleHBsaWNpdCA9IGAuJHtjb21wb25lbnR9W2RhdGEtdmFyaWFudD1cIiR7dmFyaWFudH1cIl1gO1xuICByZXR1cm4gaXNEZWZhdWx0ID8gYCR7ZXhwbGljaXR9LFxcbi4ke2NvbXBvbmVudH06bm90KFtkYXRhLXZhcmlhbnRdKWAgOiBleHBsaWNpdDtcbn1cblxuZnVuY3Rpb24gdmFyaWFudFBsdWdpbigpIHtcbiAgcmV0dXJuIHtcbiAgICBwb3N0Y3NzUGx1Z2luOiBcInVpLWxhYi12YXJpYW50XCIsXG4gICAgT25jZShyb290KSB7XG4gICAgICBjb25zdCBkZWZhdWx0cyA9IG5ldyBNYXAoKTtcblxuICAgICAgcm9vdC53YWxrQXRSdWxlcyhcInZhcmlhbnRcIiwgKGF0UnVsZSkgPT4ge1xuICAgICAgICBjb25zdCB7IGNvbXBvbmVudCwgdmFyaWFudCwgaXNEZWZhdWx0IH0gPSBwYXJzZVZhcmlhbnQoYXRSdWxlKTtcbiAgICAgICAgaWYgKCFpc0RlZmF1bHQpIHJldHVybjtcblxuICAgICAgICBjb25zdCBleGlzdGluZyA9IGRlZmF1bHRzLmdldChjb21wb25lbnQpO1xuICAgICAgICBpZiAoZXhpc3RpbmcgJiYgZXhpc3RpbmcgIT09IHZhcmlhbnQpIHtcbiAgICAgICAgICB0aHJvdyBhdFJ1bGUuZXJyb3IoYEB2YXJpYW50IGRlZmluZXMgbW9yZSB0aGFuIG9uZSBkZWZhdWx0IGZvciAke2NvbXBvbmVudH1gKTtcbiAgICAgICAgfVxuICAgICAgICBkZWZhdWx0cy5zZXQoY29tcG9uZW50LCB2YXJpYW50KTtcbiAgICAgIH0pO1xuXG4gICAgICByb290LndhbGtBdFJ1bGVzKFwidmFyaWFudFwiLCAoYXRSdWxlKSA9PiB7XG4gICAgICAgIGNvbnN0IHsgY29tcG9uZW50LCB2YXJpYW50IH0gPSBwYXJzZVZhcmlhbnQoYXRSdWxlKTtcbiAgICAgICAgY29uc3QgcnVsZSA9IGF0UnVsZS5jbG9uZSh7XG4gICAgICAgICAgdHlwZTogXCJydWxlXCIsXG4gICAgICAgICAgbmFtZTogdW5kZWZpbmVkLFxuICAgICAgICAgIHBhcmFtczogdW5kZWZpbmVkLFxuICAgICAgICAgIHNlbGVjdG9yOiB2YXJpYW50U2VsZWN0b3IoY29tcG9uZW50LCB2YXJpYW50LCBkZWZhdWx0cy5nZXQoY29tcG9uZW50KSA9PT0gdmFyaWFudCksXG4gICAgICAgIH0pO1xuICAgICAgICBhdFJ1bGUucmVwbGFjZVdpdGgocnVsZSk7XG4gICAgICB9KTtcbiAgICB9LFxuICB9O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHZhcmlhbnRQbHVnaW47XG5tb2R1bGUuZXhwb3J0cy5wYXJzZVZhcmlhbnQgPSBwYXJzZVZhcmlhbnQ7XG5tb2R1bGUuZXhwb3J0cy52YXJpYW50U2VsZWN0b3IgPSB2YXJpYW50U2VsZWN0b3I7XG4iLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIi9ob21lL2t5emEvUHJvamVjdHMvdWktbGFiL2FwcC9wYWNrYWdlcy9AdWlcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9ob21lL2t5emEvUHJvamVjdHMvdWktbGFiL2FwcC9wYWNrYWdlcy9AdWkvdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL2hvbWUva3l6YS9Qcm9qZWN0cy91aS1sYWIvYXBwL3BhY2thZ2VzL0B1aS92aXRlLmNvbmZpZy50c1wiO2ltcG9ydCB7IGRlZmluZUNvbmZpZywgdHlwZSBQbHVnaW4gfSBmcm9tIFwidml0ZVwiO1xuaW1wb3J0IHJlYWN0IGZyb20gXCJAdml0ZWpzL3BsdWdpbi1yZWFjdFwiO1xuaW1wb3J0IGR0cyBmcm9tIFwidml0ZS1wbHVnaW4tZHRzXCI7XG5pbXBvcnQgcGF0aCBmcm9tIFwicGF0aFwiO1xuaW1wb3J0IGZzIGZyb20gXCJmc1wiO1xuaW1wb3J0IHsgY3JlYXRlUG9zdGNzc1BsdWdpbnMgfSBmcm9tIFwiLi9wb3N0Y3NzLmNvbmZpZy5tdHNcIjtcblxuY29uc3QgY29tcG9uZW50c0RpciA9IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsIFwic3JjL2NvbXBvbmVudHNcIik7XG5jb25zdCBjb21wb25lbnRFbnRyaWVzID0gT2JqZWN0LmZyb21FbnRyaWVzKFxuICBmc1xuICAgIC5yZWFkZGlyU3luYyhjb21wb25lbnRzRGlyLCB7IHdpdGhGaWxlVHlwZXM6IHRydWUgfSlcbiAgICAuZmlsdGVyKChkaXJlbnQpID0+IGRpcmVudC5pc0RpcmVjdG9yeSgpKVxuICAgIC5tYXAoKGRpcmVudCkgPT4ge1xuICAgICAgY29uc3QgaW5kZXhUcyA9IHBhdGguam9pbihjb21wb25lbnRzRGlyLCBkaXJlbnQubmFtZSwgXCJpbmRleC50c1wiKTtcbiAgICAgIGNvbnN0IGluZGV4VHN4ID0gcGF0aC5qb2luKGNvbXBvbmVudHNEaXIsIGRpcmVudC5uYW1lLCBcImluZGV4LnRzeFwiKTtcbiAgICAgIGNvbnN0IGVudHJ5ID0gZnMuZXhpc3RzU3luYyhpbmRleFRzKSA/IGluZGV4VHMgOiBmcy5leGlzdHNTeW5jKGluZGV4VHN4KSA/IGluZGV4VHN4IDogbnVsbDtcbiAgICAgIHJldHVybiBlbnRyeSA/IFtkaXJlbnQubmFtZS50b0xvd2VyQ2FzZSgpLCBlbnRyeV0gOiBudWxsO1xuICAgIH0pXG4gICAgLmZpbHRlcigocGFpcik6IHBhaXIgaXMgW3N0cmluZywgc3RyaW5nXSA9PiBwYWlyICE9PSBudWxsKSxcbik7XG5cbnR5cGUgQ3NzQ2h1bmsgPSB7XG4gIGZpbGVOYW1lOiBzdHJpbmc7XG4gIHZpdGVNZXRhZGF0YT86IHtcbiAgICBpbXBvcnRlZENzcz86IFNldDxzdHJpbmc+O1xuICB9O1xufTtcblxuLyoqXG4gKiBWaXRlIGV4dHJhY3RzIGxpYnJhcnkgQ1NTIGJ1dCBkb2VzIG5vdCByZXRhaW4gYSBzdGF0aWMgaW1wb3J0IGluIHRoZSBlbWl0dGVkXG4gKiBKYXZhU2NyaXB0LiBSZXN0b3JlIHRoYXQgYXNzb2NpYXRpb24gc28gY29uc3VtZXJzIGF1dG9tYXRpY2FsbHkgcmVjZWl2ZSB0aGVcbiAqIENTUyBmb3IgZXZlcnkgY29tcG9uZW50IGNodW5rIHRoZWlyIGJ1bmRsZXIga2VlcHMuXG4gKi9cbmZ1bmN0aW9uIGluamVjdENzc0ltcG9ydHMoKTogUGx1Z2luIHtcbiAgcmV0dXJuIHtcbiAgICBuYW1lOiBcInVpLWxhYi1pbmplY3QtY3NzLWltcG9ydHNcIixcbiAgICBhcHBseTogXCJidWlsZFwiLFxuICAgIGVuZm9yY2U6IFwicG9zdFwiLFxuICAgIHJlbmRlckNodW5rKGNvZGUsIGNodW5rKSB7XG4gICAgICBjb25zdCB7IGltcG9ydGVkQ3NzIH0gPSAoY2h1bmsgYXMgQ3NzQ2h1bmspLnZpdGVNZXRhZGF0YSA/PyB7fTtcbiAgICAgIGNvbnN0IHN0eWxlcyA9IFsuLi4oaW1wb3J0ZWRDc3MgPz8gW10pXS5zb3J0KCk7XG4gICAgICBpZiAoc3R5bGVzLmxlbmd0aCA9PT0gMCkgcmV0dXJuIG51bGw7XG5cbiAgICAgIGNvbnN0IGRpcmVjdG9yeSA9IHBhdGgucG9zaXguZGlybmFtZShjaHVuay5maWxlTmFtZSk7XG4gICAgICBjb25zdCBpbXBvcnRzID0gc3R5bGVzLm1hcCgoZmlsZU5hbWUpID0+IHtcbiAgICAgICAgY29uc3QgcmVsYXRpdmUgPSBwYXRoLnBvc2l4LnJlbGF0aXZlKGRpcmVjdG9yeSwgZmlsZU5hbWUpO1xuICAgICAgICBjb25zdCBzcGVjaWZpZXIgPSByZWxhdGl2ZS5zdGFydHNXaXRoKFwiLlwiKSA/IHJlbGF0aXZlIDogYC4vJHtyZWxhdGl2ZX1gO1xuICAgICAgICByZXR1cm4gYGltcG9ydCAke0pTT04uc3RyaW5naWZ5KHNwZWNpZmllcil9O2A7XG4gICAgICB9KTtcblxuICAgICAgY29uc3QgZGlyZWN0aXZlID0gJ1widXNlIGNsaWVudFwiOyc7XG4gICAgICBjb25zdCBoYXNDbGllbnREaXJlY3RpdmUgPSBjb2RlLnN0YXJ0c1dpdGgoZGlyZWN0aXZlKTtcblxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgLy8gS2VlcCB0aGUgY2xpZW50IGRpcmVjdGl2ZSBmaXJzdC4gQSBkaXJlY3RpdmUgYWZ0ZXIgYW4gaW1wb3J0IGlzIGFuXG4gICAgICAgIC8vIG9yZGluYXJ5IHN0cmluZyBsaXRlcmFsLCB3aGljaCBtYWtlcyBOZXh0IHJlbmRlciBjbGllbnQgcHJpbWl0aXZlc1xuICAgICAgICAvLyB0aHJvdWdoIGl0cyBzZXJ2ZXIgcGF0aCBkdXJpbmcgU1NSLlxuICAgICAgICBjb2RlOiBoYXNDbGllbnREaXJlY3RpdmVcbiAgICAgICAgICA/IGAke2RpcmVjdGl2ZX1cXG4ke2ltcG9ydHMuam9pbihcIlxcblwiKX1cXG4ke2NvZGUuc2xpY2UoZGlyZWN0aXZlLmxlbmd0aCl9YFxuICAgICAgICAgIDogYCR7aW1wb3J0cy5qb2luKFwiXFxuXCIpfVxcbiR7Y29kZX1gLFxuICAgICAgICBtYXA6IG51bGwsXG4gICAgICB9O1xuICAgIH0sXG4gIH07XG59XG5cbmZ1bmN0aW9uIGNsZWFuU3RhbGVCdWlsZEFzc2V0cygpOiBQbHVnaW4ge1xuICBsZXQgcHJldmlvdXNBc3NldHMgPSBuZXcgU2V0PHN0cmluZz4oKTtcbiAgY29uc3QgcHJlc2VydmVkQXNzZXRzID0gbmV3IFNldChbXCJzdHlsZXMuY3NzXCIsIFwidHlwb2dyYXBoeS5jc3NcIiwgXCJwb3N0Y3NzLXVpLWxhYi5tanNcIl0pO1xuXG4gIHJldHVybiB7XG4gICAgbmFtZTogXCJ1aS1sYWItY2xlYW4tc3RhbGUtYnVpbGQtYXNzZXRzXCIsXG4gICAgYXBwbHk6IFwiYnVpbGRcIixcbiAgICBidWlsZFN0YXJ0KCkge1xuICAgICAgY29uc3QgZGlzdCA9IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsIFwiZGlzdFwiKTtcbiAgICAgIGlmICghZnMuZXhpc3RzU3luYyhkaXN0KSkgcmV0dXJuO1xuXG4gICAgICBwcmV2aW91c0Fzc2V0cyA9IG5ldyBTZXQoXG4gICAgICAgIGZzXG4gICAgICAgICAgLnJlYWRkaXJTeW5jKGRpc3QsIHsgcmVjdXJzaXZlOiB0cnVlLCB3aXRoRmlsZVR5cGVzOiB0cnVlIH0pXG4gICAgICAgICAgLmZpbHRlcigoZW50cnkpID0+IGVudHJ5LmlzRmlsZSgpKVxuICAgICAgICAgIC5tYXAoKGVudHJ5KSA9PiBwYXRoLnJlbGF0aXZlKGRpc3QsIHBhdGguam9pbihlbnRyeS5wYXJlbnRQYXRoLCBlbnRyeS5uYW1lKSkpXG4gICAgICAgICAgLmZpbHRlcigoZmlsZSkgPT4gZmlsZS5lbmRzV2l0aChcIi5qc1wiKSB8fCBmaWxlLmVuZHNXaXRoKFwiLmNzc1wiKSksXG4gICAgICApO1xuICAgIH0sXG4gICAgd3JpdGVCdW5kbGUoX29wdGlvbnMsIGJ1bmRsZSkge1xuICAgICAgY29uc3QgZGlzdCA9IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsIFwiZGlzdFwiKTtcbiAgICAgIGNvbnN0IGN1cnJlbnRBc3NldHMgPSBuZXcgU2V0KE9iamVjdC5rZXlzKGJ1bmRsZSkpO1xuXG4gICAgICBmb3IgKGNvbnN0IGZpbGUgb2YgcHJldmlvdXNBc3NldHMpIHtcbiAgICAgICAgaWYgKHByZXNlcnZlZEFzc2V0cy5oYXMoZmlsZSkgfHwgY3VycmVudEFzc2V0cy5oYXMoZmlsZSkpIGNvbnRpbnVlO1xuICAgICAgICBmcy5ybVN5bmMocGF0aC5qb2luKGRpc3QsIGZpbGUpLCB7IGZvcmNlOiB0cnVlIH0pO1xuICAgICAgfVxuICAgIH0sXG4gIH07XG59XG5cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XG4gIHJlc29sdmU6IHtcbiAgICBhbGlhczoge1xuICAgICAgXCJAXCI6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsIFwiLi9zcmNcIiksXG4gICAgfSxcbiAgfSxcbiAgY3NzOiB7XG4gICAgcG9zdGNzczoge1xuICAgICAgcGx1Z2luczogY3JlYXRlUG9zdGNzc1BsdWdpbnMoKSxcbiAgICB9LFxuICB9LFxuICBwbHVnaW5zOiBbXG4gICAgcmVhY3QoKSxcbiAgICBpbmplY3RDc3NJbXBvcnRzKCksXG4gICAgY2xlYW5TdGFsZUJ1aWxkQXNzZXRzKCksXG4gICAgZHRzKHtcbiAgICAgIGluc2VydFR5cGVzRW50cnk6IHRydWUsXG4gICAgICBleGNsdWRlOiBbXCIqKi8qLnRlc3QudHNcIiwgXCIqKi8qLnRlc3QudHN4XCIsIFwic3JjL3Rlc3RzLyoqXCIsIFwiKiovdGVzdHMvKipcIl0sXG4gICAgfSksXG4gIF0sXG4gIGJ1aWxkOiB7XG4gICAgc291cmNlbWFwOiBmYWxzZSxcbiAgICAvLyBLZWVwIHRoZSBwdWJsaXNoZWQgYWdncmVnYXRlIHN0eWxlc2hlZXQgcmVzb2x2YWJsZSB3aGlsZSBhIHJlYnVpbGQgaXMgaW5cbiAgICAvLyBwcm9ncmVzcy4gU3RhbGUgVml0ZSBhc3NldHMgYXJlIHJlbW92ZWQgYWZ0ZXIgdGhlIHJlcGxhY2VtZW50IG91dHB1dCBoYXNcbiAgICAvLyBiZWVuIHdyaXR0ZW4uXG4gICAgZW1wdHlPdXREaXI6IGZhbHNlLFxuICAgIGNzc0NvZGVTcGxpdDogdHJ1ZSxcbiAgICBsaWI6IHtcbiAgICAgIGVudHJ5OiB7XG4gICAgICAgIFwidWktbGFiLXVpXCI6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsIFwic3JjL2luZGV4LnRzXCIpLFxuICAgICAgICBwcm92aWRlcnM6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsIFwic3JjL3Byb3ZpZGVycy9pbmRleC50c1wiKSxcbiAgICAgICAgXCJ0aGVtZS1zY3JpcHRcIjogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgXCJzcmMvcHJvdmlkZXJzL3RoZW1lU2NyaXB0LnRzXCIpLFxuICAgICAgICBcInRoZW1lLXNlcnZlclwiOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCBcInNyYy90aGVtZS1zZXJ2ZXIudHNcIiksXG4gICAgICAgIFwidGhlbWUtY29udHJhY3RcIjogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgXCJzcmMvdGhlbWUtY29udHJhY3QudHNcIiksXG4gICAgICAgIHNjcmlwdHM6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsIFwic3JjL3NjcmlwdHMudHNcIiksXG4gICAgICAgIC4uLmNvbXBvbmVudEVudHJpZXMsXG4gICAgICB9LFxuICAgICAgZm9ybWF0czogW1wiZXNcIl0sXG4gICAgfSxcbiAgICByb2xsdXBPcHRpb25zOiB7XG4gICAgICBleHRlcm5hbDogW1xuICAgICAgICBcInJlYWN0XCIsXG4gICAgICAgIFwicmVhY3QvanN4LXJ1bnRpbWVcIixcbiAgICAgICAgXCJyZWFjdC9qc3gtZGV2LXJ1bnRpbWVcIixcbiAgICAgICAgXCJyZWFjdC1kb21cIixcbiAgICAgICAgXCJyZWFjdC1kb20vY2xpZW50XCIsXG4gICAgICAgIFwic2hpa2lcIixcbiAgICAgICAgL15zaGlraVxcLy4qLyxcbiAgICAgICAgXCJyZWFjdC1hcmlhXCIsXG4gICAgICAgIFwicmVhY3Qtc3RhdGVseVwiLFxuICAgICAgICBcImdzYXBcIixcbiAgICAgICAgL15nc2FwXFwvLiovLFxuICAgICAgICBcIkBnc2FwL3JlYWN0XCIsXG4gICAgICAgIC9eQHJlYWN0LWFyaWFcXC8uKi8sXG4gICAgICAgIC9eQHJlYWN0LXN0YXRlbHlcXC8uKi8sXG4gICAgICAgIC9eQHJlYWN0LXR5cGVzXFwvLiovLFxuICAgICAgXSxcbiAgICAgIG91dHB1dDoge1xuICAgICAgICBob2lzdFRyYW5zaXRpdmVJbXBvcnRzOiBmYWxzZSxcbiAgICAgICAgZW50cnlGaWxlTmFtZXM6IFwiW25hbWVdLmVzLmpzXCIsXG4gICAgICAgIGNodW5rRmlsZU5hbWVzOiBcImNodW5rcy9bbmFtZV0tW2hhc2hdLmpzXCIsXG4gICAgICAgIC8vIENvbXBvbmVudC9wcm92aWRlciBlbnRyaWVzIGFyZSBjbGllbnQgY29tcG9uZW50czsgdGhlIHB1cmUgc2NyaXB0IGVudHJpZXMgYXJlIG5vdC5cbiAgICAgICAgYmFubmVyOiAoY2h1bmspID0+IHtcbiAgICAgICAgICBpZiAoIWNodW5rLmlzRW50cnkpIHJldHVybiBcIlwiO1xuICAgICAgICAgIGNvbnN0IHNlcnZlclNhZmUgPSBuZXcgU2V0KFtcInRoZW1lLXNjcmlwdFwiLCBcInRoZW1lLXNlcnZlclwiLCBcInRoZW1lLWNvbnRyYWN0XCIsIFwic2NyaXB0c1wiXSk7XG4gICAgICAgICAgcmV0dXJuIHNlcnZlclNhZmUuaGFzKGNodW5rLm5hbWUpID8gXCJcIiA6ICdcInVzZSBjbGllbnRcIjsnO1xuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9LFxuICB9LFxufSk7XG4iLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIi9ob21lL2t5emEvUHJvamVjdHMvdWktbGFiL2FwcC9wYWNrYWdlcy9AdWlcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9ob21lL2t5emEvUHJvamVjdHMvdWktbGFiL2FwcC9wYWNrYWdlcy9AdWkvcG9zdGNzcy5jb25maWcubXRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9ob21lL2t5emEvUHJvamVjdHMvdWktbGFiL2FwcC9wYWNrYWdlcy9AdWkvcG9zdGNzcy5jb25maWcubXRzXCI7aW1wb3J0IHRhaWx3aW5kY3NzIGZyb20gXCJAdGFpbHdpbmRjc3MvcG9zdGNzc1wiO1xuaW1wb3J0IHNsb3RQbHVnaW4gZnJvbSBcIi4uLy4uL3Bvc3Rjc3Mvc2xvdC5tanNcIjtcbmltcG9ydCB2YXJpYW50UGx1Z2luIGZyb20gXCIuLi8uLi9wb3N0Y3NzL3ZhcmlhbnQubWpzXCI7XG5cbmNvbnN0IE1JWF9GVU5DVElPTiA9IFwibWl4KFwiO1xuY29uc3QgTUlYX0ZVTkNUSU9OX1BBVFRFUk4gPSAvKF58W15BLVphLXowLTlfLV0pbWl4XFwoL2c7XG5cbmZ1bmN0aW9uIGV4cGFuZE1peEZ1bmN0aW9ucyh2YWx1ZTogc3RyaW5nKTogc3RyaW5nIHtcbiAgcmV0dXJuIHZhbHVlLnJlcGxhY2UoTUlYX0ZVTkNUSU9OX1BBVFRFUk4sIFwiJDFjb2xvci1taXgoaW4gc3JnYiwgXCIpO1xufVxuXG5mdW5jdGlvbiBtaXhGdW5jdGlvbigpIHtcbiAgcmV0dXJuIHtcbiAgICBwb3N0Y3NzUGx1Z2luOiBcInVpLWxhYi1taXgtZnVuY3Rpb25cIixcbiAgICBEZWNsYXJhdGlvbihkZWNsOiB7IHZhbHVlOiBzdHJpbmcgfSkge1xuICAgICAgaWYgKCFkZWNsLnZhbHVlLmluY2x1ZGVzKE1JWF9GVU5DVElPTikpIHJldHVybjtcbiAgICAgIGRlY2wudmFsdWUgPSBleHBhbmRNaXhGdW5jdGlvbnMoZGVjbC52YWx1ZSk7XG4gICAgfSxcbiAgICBBdFJ1bGUoYXRSdWxlOiB7IHBhcmFtczogc3RyaW5nIH0pIHtcbiAgICAgIGlmICghYXRSdWxlLnBhcmFtcy5pbmNsdWRlcyhNSVhfRlVOQ1RJT04pKSByZXR1cm47XG4gICAgICBhdFJ1bGUucGFyYW1zID0gZXhwYW5kTWl4RnVuY3Rpb25zKGF0UnVsZS5wYXJhbXMpO1xuICAgIH0sXG4gIH07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBkZW1vdGVUYWlsd2luZFV0aWxpdHlMYXllcigpIHtcbiAgcmV0dXJuIHtcbiAgICBwb3N0Y3NzUGx1Z2luOiBcInVpLWxhYi1kZW1vdGUtdGFpbHdpbmQtdXRpbGl0eS1sYXllclwiLFxuICAgIEF0UnVsZShhdFJ1bGU6IHsgbmFtZTogc3RyaW5nOyBwYXJhbXM6IHN0cmluZzsgbm9kZXM/OiB1bmtub3duW10gfSkge1xuICAgICAgLy8gS2VlcCBsaWJyYXJ5LWdlbmVyYXRlZCB1dGlsaXR5IHNlbGVjdG9ycyBiZWxvdyBjb25zdW1lciBhcHAgdXRpbGl0aWVzIHNvXG4gICAgICAvLyBgQGltcG9ydCBcInVpLWxhYi1jb21wb25lbnRzL3N0eWxlcy5jc3NcImAgYmVoYXZlcyB0aGUgc2FtZSBhcyBhIEpTIENTUyBpbXBvcnQuXG4gICAgICBpZiAoYXRSdWxlLm5hbWUgIT09IFwibGF5ZXJcIikgcmV0dXJuO1xuICAgICAgaWYgKGF0UnVsZS5wYXJhbXMudHJpbSgpICE9PSBcInV0aWxpdGllc1wiKSByZXR1cm47XG4gICAgICBpZiAoIUFycmF5LmlzQXJyYXkoYXRSdWxlLm5vZGVzKSB8fCBhdFJ1bGUubm9kZXMubGVuZ3RoID09PSAwKSByZXR1cm47XG5cbiAgICAgIGF0UnVsZS5wYXJhbXMgPSBcImNvbXBvbmVudHNcIjtcbiAgICB9LFxuICB9O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlUG9zdGNzc1BsdWdpbnMoKSB7XG4gIHJldHVybiBbdmFyaWFudFBsdWdpbigpLCBzbG90UGx1Z2luKCksIG1peEZ1bmN0aW9uKCksIHRhaWx3aW5kY3NzKCksIGRlbW90ZVRhaWx3aW5kVXRpbGl0eUxheWVyKCldO1xufVxuXG5leHBvcnQgZGVmYXVsdCB7XG4gIHBsdWdpbnM6IGNyZWF0ZVBvc3Rjc3NQbHVnaW5zKCksXG59O1xuIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvaG9tZS9reXphL1Byb2plY3RzL3VpLWxhYi9hcHAvcG9zdGNzc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL2hvbWUva3l6YS9Qcm9qZWN0cy91aS1sYWIvYXBwL3Bvc3Rjc3Mvc2xvdC5tanNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL2hvbWUva3l6YS9Qcm9qZWN0cy91aS1sYWIvYXBwL3Bvc3Rjc3Mvc2xvdC5tanNcIjtpbXBvcnQgc2xvdFBsdWdpbiBmcm9tIFwiLi9zbG90LmNqc1wiO1xuXG5leHBvcnQgY29uc3QgeyBleHBhbmRTbG90RnVuY3Rpb25zIH0gPSBzbG90UGx1Z2luO1xuZXhwb3J0IGRlZmF1bHQgc2xvdFBsdWdpbjtcbiIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiL2hvbWUva3l6YS9Qcm9qZWN0cy91aS1sYWIvYXBwL3Bvc3Rjc3NcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9ob21lL2t5emEvUHJvamVjdHMvdWktbGFiL2FwcC9wb3N0Y3NzL3ZhcmlhbnQubWpzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9ob21lL2t5emEvUHJvamVjdHMvdWktbGFiL2FwcC9wb3N0Y3NzL3ZhcmlhbnQubWpzXCI7aW1wb3J0IHZhcmlhbnRQbHVnaW4gZnJvbSBcIi4vdmFyaWFudC5janNcIjtcblxuZXhwb3J0IGNvbnN0IHsgcGFyc2VWYXJpYW50LCB2YXJpYW50U2VsZWN0b3IgfSA9IHZhcmlhbnRQbHVnaW47XG5leHBvcnQgZGVmYXVsdCB2YXJpYW50UGx1Z2luO1xuIl0sCiAgIm1hcHBpbmdzIjogIjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7QUFBQTtBQUF3UixRQUFNLGFBQWE7QUFFM1MsYUFBUyxhQUFhLE1BQU0sVUFBVTtBQUNwQyxhQUFPLFVBQVUsSUFBSSxJQUFJLFFBQVE7QUFBQSxJQUNuQztBQUVBLGFBQVMsZUFBZSxPQUFPO0FBQzdCLFlBQU0sYUFBYSxDQUFDO0FBQ3BCLFVBQUksUUFBUTtBQUNaLFVBQUksUUFBUTtBQUVaLGVBQVMsUUFBUSxHQUFHLFFBQVEsTUFBTSxRQUFRLFNBQVMsR0FBRztBQUNwRCxjQUFNLFlBQVksTUFBTSxLQUFLO0FBQzdCLFlBQUksY0FBYyxJQUFLLFVBQVM7QUFDaEMsWUFBSSxjQUFjLElBQUssVUFBUztBQUNoQyxZQUFJLGNBQWMsT0FBTyxVQUFVLEdBQUc7QUFDcEMscUJBQVcsS0FBSyxNQUFNLE1BQU0sT0FBTyxLQUFLLEVBQUUsS0FBSyxDQUFDO0FBQ2hELGtCQUFRLFFBQVE7QUFBQSxRQUNsQjtBQUFBLE1BQ0Y7QUFFQSxpQkFBVyxLQUFLLE1BQU0sTUFBTSxLQUFLLEVBQUUsS0FBSyxDQUFDO0FBQ3pDLGFBQU87QUFBQSxJQUNUO0FBRUEsYUFBU0EscUJBQW9CLE9BQU87QUFDbEMsVUFBSSxTQUFTO0FBQ2IsVUFBSSxTQUFTO0FBRWIsYUFBTyxTQUFTLE1BQU0sUUFBUTtBQUM1QixjQUFNLFFBQVEsMkJBQTJCLEtBQUssTUFBTSxNQUFNLE1BQU0sQ0FBQztBQUNqRSxZQUFJLENBQUMsTUFBTyxRQUFPLFNBQVMsTUFBTSxNQUFNLE1BQU07QUFFOUMsY0FBTSxlQUFlLE1BQU0sQ0FBQyxFQUFFO0FB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
