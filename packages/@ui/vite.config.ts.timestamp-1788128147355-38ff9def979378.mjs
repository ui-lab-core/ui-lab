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
      if (parts.length !== 2 || parts.some((part) => !identifier.test(part))) {
        throw atRule.error("@variant requires a component and variant CSS identifier");
      }
      if (!atRule.nodes) throw atRule.error("@variant requires a declaration block");
      return { component: parts[0], variant: parts[1] };
    }
    function variantSelector2(component, variant) {
      return `.${component}[data-variant="${variant}"]`;
    }
    function variantPlugin2() {
      return {
        postcssPlugin: "ui-lab-variant",
        Once(root) {
          root.walkAtRules("variant", (atRule) => {
            const { component, variant } = parseVariant2(atRule);
            const rule = atRule.clone({
              type: "rule",
              name: void 0,
              params: void 0,
              selector: variantSelector2(component, variant)
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vLi4vcG9zdGNzcy9zbG90LmNqcyIsICIuLi8uLi9wb3N0Y3NzL3ZhcmlhbnQuY2pzIiwgInZpdGUuY29uZmlnLnRzIiwgInBvc3Rjc3MuY29uZmlnLm10cyIsICIuLi8uLi9wb3N0Y3NzL3Nsb3QubWpzIiwgIi4uLy4uL3Bvc3Rjc3MvdmFyaWFudC5tanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvaG9tZS9reXphL1Byb2plY3RzL3VpLWxhYi9hcHAvcG9zdGNzc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL2hvbWUva3l6YS9Qcm9qZWN0cy91aS1sYWIvYXBwL3Bvc3Rjc3Mvc2xvdC5janNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL2hvbWUva3l6YS9Qcm9qZWN0cy91aS1sYWIvYXBwL3Bvc3Rjc3Mvc2xvdC5janNcIjtjb25zdCBpZGVudGlmaWVyID0gL15bYS16XVthLXowLTktXSokL2k7XG5cbmZ1bmN0aW9uIHByb3BlcnR5TmFtZShzbG90LCBwcm9wZXJ0eSkge1xuICByZXR1cm4gYC0tc2xvdC0ke3Nsb3R9LSR7cHJvcGVydHl9YDtcbn1cblxuZnVuY3Rpb24gc3BsaXRBcmd1bWVudHModmFsdWUpIHtcbiAgY29uc3QgYXJndW1lbnRzXyA9IFtdO1xuICBsZXQgc3RhcnQgPSAwO1xuICBsZXQgZGVwdGggPSAwO1xuXG4gIGZvciAobGV0IGluZGV4ID0gMDsgaW5kZXggPCB2YWx1ZS5sZW5ndGg7IGluZGV4ICs9IDEpIHtcbiAgICBjb25zdCBjaGFyYWN0ZXIgPSB2YWx1ZVtpbmRleF07XG4gICAgaWYgKGNoYXJhY3RlciA9PT0gXCIoXCIpIGRlcHRoICs9IDE7XG4gICAgaWYgKGNoYXJhY3RlciA9PT0gXCIpXCIpIGRlcHRoIC09IDE7XG4gICAgaWYgKGNoYXJhY3RlciA9PT0gXCIsXCIgJiYgZGVwdGggPT09IDApIHtcbiAgICAgIGFyZ3VtZW50c18ucHVzaCh2YWx1ZS5zbGljZShzdGFydCwgaW5kZXgpLnRyaW0oKSk7XG4gICAgICBzdGFydCA9IGluZGV4ICsgMTtcbiAgICB9XG4gIH1cblxuICBhcmd1bWVudHNfLnB1c2godmFsdWUuc2xpY2Uoc3RhcnQpLnRyaW0oKSk7XG4gIHJldHVybiBhcmd1bWVudHNfO1xufVxuXG5mdW5jdGlvbiBleHBhbmRTbG90RnVuY3Rpb25zKHZhbHVlKSB7XG4gIGxldCByZXN1bHQgPSBcIlwiO1xuICBsZXQgY3Vyc29yID0gMDtcblxuICB3aGlsZSAoY3Vyc29yIDwgdmFsdWUubGVuZ3RoKSB7XG4gICAgY29uc3QgbWF0Y2ggPSAvKF58W15hLXpBLVowLTlfLV0pc2xvdFxcKC8uZXhlYyh2YWx1ZS5zbGljZShjdXJzb3IpKTtcbiAgICBpZiAoIW1hdGNoKSByZXR1cm4gcmVzdWx0ICsgdmFsdWUuc2xpY2UoY3Vyc29yKTtcblxuICAgIGNvbnN0IHByZWZpeExlbmd0aCA9IG1hdGNoWzFdLmxlbmd0aDtcbiAgICBjb25zdCBmdW5jdGlvblN0YXJ0ID0gY3Vyc29yICsgbWF0Y2guaW5kZXggKyBwcmVmaXhMZW5ndGg7XG4gICAgY29uc3QgYXJndW1lbnRzU3RhcnQgPSBmdW5jdGlvblN0YXJ0ICsgXCJzbG90KFwiLmxlbmd0aDtcbiAgICBsZXQgZGVwdGggPSAxO1xuICAgIGxldCBlbmQgPSBhcmd1bWVudHNTdGFydDtcblxuICAgIHdoaWxlIChlbmQgPCB2YWx1ZS5sZW5ndGggJiYgZGVwdGggPiAwKSB7XG4gICAgICBpZiAodmFsdWVbZW5kXSA9PT0gXCIoXCIpIGRlcHRoICs9IDE7XG4gICAgICBpZiAodmFsdWVbZW5kXSA9PT0gXCIpXCIpIGRlcHRoIC09IDE7XG4gICAgICBlbmQgKz0gMTtcbiAgICB9XG5cbiAgICBpZiAoZGVwdGggIT09IDApIHRocm93IG5ldyBFcnJvcihcIlVuY2xvc2VkIHNsb3QoKSBmdW5jdGlvblwiKTtcblxuICAgIGNvbnN0IGFyZ3VtZW50c18gPSBzcGxpdEFyZ3VtZW50cyh2YWx1ZS5zbGljZShhcmd1bWVudHNTdGFydCwgZW5kIC0gMSkpO1xuICAgIGlmIChhcmd1bWVudHNfLmxlbmd0aCA8IDIgfHwgYXJndW1lbnRzXy5sZW5ndGggPiAzIHx8IGFyZ3VtZW50c18uc29tZSgoaXRlbSkgPT4gIWl0ZW0pKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJzbG90KCkgcmVxdWlyZXMgYSBzbG90LCBwcm9wZXJ0eSwgYW5kIG9wdGlvbmFsIGZhbGxiYWNrXCIpO1xuICAgIH1cblxuICAgIGNvbnN0IFtzbG90LCBwcm9wZXJ0eSwgZmFsbGJhY2tdID0gYXJndW1lbnRzXztcbiAgICBpZiAoIWlkZW50aWZpZXIudGVzdChzbG90KSB8fCAhaWRlbnRpZmllci50ZXN0KHByb3BlcnR5KSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFwic2xvdCgpIHNsb3QgYW5kIHByb3BlcnR5IG5hbWVzIG11c3QgYmUgQ1NTIGlkZW50aWZpZXJzXCIpO1xuICAgIH1cblxuICAgIGNvbnN0IGV4cGFuZGVkRmFsbGJhY2sgPSBmYWxsYmFjayA9PT0gdW5kZWZpbmVkID8gdW5kZWZpbmVkIDogZXhwYW5kU2xvdEZ1bmN0aW9ucyhmYWxsYmFjayk7XG4gICAgY29uc3QgcmVwbGFjZW1lbnQgPSBgdmFyKCR7cHJvcGVydHlOYW1lKHNsb3QsIHByb3BlcnR5KX0ke1xuICAgICAgZXhwYW5kZWRGYWxsYmFjayA9PT0gdW5kZWZpbmVkID8gXCJcIiA6IGAsICR7ZXhwYW5kZWRGYWxsYmFja31gXG4gICAgfSlgO1xuXG4gICAgcmVzdWx0ICs9IHZhbHVlLnNsaWNlKGN1cnNvciwgZnVuY3Rpb25TdGFydCkgKyByZXBsYWNlbWVudDtcbiAgICBjdXJzb3IgPSBlbmQ7XG4gIH1cblxuICByZXR1cm4gcmVzdWx0O1xufVxuXG5mdW5jdGlvbiBzbG90UGx1Z2luKCkge1xuICByZXR1cm4ge1xuICAgIHBvc3Rjc3NQbHVnaW46IFwidWktbGFiLXNsb3RcIixcbiAgICBPbmNlKHJvb3QpIHtcbiAgICAgIHJvb3Qud2Fsa0F0UnVsZXMoXCJzbG90XCIsIChhdFJ1bGUpID0+IHtcbiAgICAgICAgY29uc3Qgc2xvdCA9IGF0UnVsZS5wYXJhbXMudHJpbSgpO1xuICAgICAgICBpZiAoIWlkZW50aWZpZXIudGVzdChzbG90KSkgdGhyb3cgYXRSdWxlLmVycm9yKFwiQHNsb3QgcmVxdWlyZXMgb25lIENTUyBpZGVudGlmaWVyXCIpO1xuICAgICAgICBpZiAoIWF0UnVsZS5ub2RlcykgdGhyb3cgYXRSdWxlLmVycm9yKFwiQHNsb3QgcmVxdWlyZXMgYSBkZWNsYXJhdGlvbiBibG9ja1wiKTtcblxuICAgICAgICBjb25zdCB0cmFuc2Zvcm1Ob2RlcyA9IChub2RlcykgPT4ge1xuICAgICAgICAgIGZvciAoY29uc3Qgbm9kZSBvZiBub2Rlcykge1xuICAgICAgICAgICAgaWYgKG5vZGUudHlwZSA9PT0gXCJjb21tZW50XCIpIGNvbnRpbnVlO1xuICAgICAgICAgICAgaWYgKG5vZGUudHlwZSA9PT0gXCJhdHJ1bGVcIiAmJiBub2RlLm5hbWUgPT09IFwic3VwcG9ydHNcIiAmJiBub2RlLm5vZGVzKSB7XG4gICAgICAgICAgICAgIHRyYW5zZm9ybU5vZGVzKG5vZGUubm9kZXMpO1xuICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChub2RlLnR5cGUgIT09IFwiZGVjbFwiIHx8ICFub2RlLnByb3Auc3RhcnRzV2l0aChcIi0tXCIpKSB7XG4gICAgICAgICAgICAgIHRocm93IGF0UnVsZS5lcnJvcihcIkBzbG90IGJsb2NrcyBtYXkgY29udGFpbiBvbmx5IGN1c3RvbSBwcm9wZXJ0eSBkZWNsYXJhdGlvbnNcIik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCBwcm9wZXJ0eSA9IG5vZGUucHJvcC5zbGljZSgyKTtcbiAgICAgICAgICAgIGlmICghaWRlbnRpZmllci50ZXN0KHByb3BlcnR5KSkgdGhyb3cgbm9kZS5lcnJvcihcIkludmFsaWQgQHNsb3QgcHJvcGVydHkgbmFtZVwiKTtcbiAgICAgICAgICAgIG5vZGUucHJvcCA9IHByb3BlcnR5TmFtZShzbG90LCBwcm9wZXJ0eSk7XG4gICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIHRyYW5zZm9ybU5vZGVzKGF0UnVsZS5ub2Rlcyk7XG4gICAgICAgIGF0UnVsZS5yZXBsYWNlV2l0aCguLi5hdFJ1bGUubm9kZXMpO1xuICAgICAgfSk7XG5cbiAgICAgIHJvb3Qud2Fsa0RlY2xzKChkZWNsYXJhdGlvbikgPT4ge1xuICAgICAgICBpZiAoIWRlY2xhcmF0aW9uLnZhbHVlLmluY2x1ZGVzKFwic2xvdChcIikpIHJldHVybjtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBkZWNsYXJhdGlvbi52YWx1ZSA9IGV4cGFuZFNsb3RGdW5jdGlvbnMoZGVjbGFyYXRpb24udmFsdWUpO1xuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgIHRocm93IGRlY2xhcmF0aW9uLmVycm9yKGVycm9yIGluc3RhbmNlb2YgRXJyb3IgPyBlcnJvci5tZXNzYWdlIDogU3RyaW5nKGVycm9yKSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0sXG4gIH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gc2xvdFBsdWdpbjtcbm1vZHVsZS5leHBvcnRzLmV4cGFuZFNsb3RGdW5jdGlvbnMgPSBleHBhbmRTbG90RnVuY3Rpb25zO1xuIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvaG9tZS9reXphL1Byb2plY3RzL3VpLWxhYi9hcHAvcG9zdGNzc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL2hvbWUva3l6YS9Qcm9qZWN0cy91aS1sYWIvYXBwL3Bvc3Rjc3MvdmFyaWFudC5janNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL2hvbWUva3l6YS9Qcm9qZWN0cy91aS1sYWIvYXBwL3Bvc3Rjc3MvdmFyaWFudC5janNcIjtjb25zdCBpZGVudGlmaWVyID0gL15bYS16XVthLXowLTktXSokL2k7XG5cbmZ1bmN0aW9uIHBhcnNlVmFyaWFudChhdFJ1bGUpIHtcbiAgY29uc3QgcGFydHMgPSBhdFJ1bGUucGFyYW1zLnRyaW0oKS5zcGxpdCgvXFxzKy8pLmZpbHRlcihCb29sZWFuKTtcbiAgaWYgKHBhcnRzLmxlbmd0aCAhPT0gMiB8fCBwYXJ0cy5zb21lKChwYXJ0KSA9PiAhaWRlbnRpZmllci50ZXN0KHBhcnQpKSkge1xuICAgIHRocm93IGF0UnVsZS5lcnJvcihcIkB2YXJpYW50IHJlcXVpcmVzIGEgY29tcG9uZW50IGFuZCB2YXJpYW50IENTUyBpZGVudGlmaWVyXCIpO1xuICB9XG4gIGlmICghYXRSdWxlLm5vZGVzKSB0aHJvdyBhdFJ1bGUuZXJyb3IoXCJAdmFyaWFudCByZXF1aXJlcyBhIGRlY2xhcmF0aW9uIGJsb2NrXCIpO1xuICByZXR1cm4geyBjb21wb25lbnQ6IHBhcnRzWzBdLCB2YXJpYW50OiBwYXJ0c1sxXSB9O1xufVxuXG5mdW5jdGlvbiB2YXJpYW50U2VsZWN0b3IoY29tcG9uZW50LCB2YXJpYW50KSB7XG4gIHJldHVybiBgLiR7Y29tcG9uZW50fVtkYXRhLXZhcmlhbnQ9XCIke3ZhcmlhbnR9XCJdYDtcbn1cblxuZnVuY3Rpb24gdmFyaWFudFBsdWdpbigpIHtcbiAgcmV0dXJuIHtcbiAgICBwb3N0Y3NzUGx1Z2luOiBcInVpLWxhYi12YXJpYW50XCIsXG4gICAgT25jZShyb290KSB7XG4gICAgICByb290LndhbGtBdFJ1bGVzKFwidmFyaWFudFwiLCAoYXRSdWxlKSA9PiB7XG4gICAgICAgIGNvbnN0IHsgY29tcG9uZW50LCB2YXJpYW50IH0gPSBwYXJzZVZhcmlhbnQoYXRSdWxlKTtcbiAgICAgICAgY29uc3QgcnVsZSA9IGF0UnVsZS5jbG9uZSh7XG4gICAgICAgICAgdHlwZTogXCJydWxlXCIsXG4gICAgICAgICAgbmFtZTogdW5kZWZpbmVkLFxuICAgICAgICAgIHBhcmFtczogdW5kZWZpbmVkLFxuICAgICAgICAgIHNlbGVjdG9yOiB2YXJpYW50U2VsZWN0b3IoY29tcG9uZW50LCB2YXJpYW50KSxcbiAgICAgICAgfSk7XG4gICAgICAgIGF0UnVsZS5yZXBsYWNlV2l0aChydWxlKTtcbiAgICAgIH0pO1xuICAgIH0sXG4gIH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gdmFyaWFudFBsdWdpbjtcbm1vZHVsZS5leHBvcnRzLnBhcnNlVmFyaWFudCA9IHBhcnNlVmFyaWFudDtcbm1vZHVsZS5leHBvcnRzLnZhcmlhbnRTZWxlY3RvciA9IHZhcmlhbnRTZWxlY3RvcjtcbiIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiL2hvbWUva3l6YS9Qcm9qZWN0cy91aS1sYWIvYXBwL3BhY2thZ2VzL0B1aVwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL2hvbWUva3l6YS9Qcm9qZWN0cy91aS1sYWIvYXBwL3BhY2thZ2VzL0B1aS92aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vaG9tZS9reXphL1Byb2plY3RzL3VpLWxhYi9hcHAvcGFja2FnZXMvQHVpL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnLCB0eXBlIFBsdWdpbiB9IGZyb20gXCJ2aXRlXCI7XG5pbXBvcnQgcmVhY3QgZnJvbSBcIkB2aXRlanMvcGx1Z2luLXJlYWN0XCI7XG5pbXBvcnQgZHRzIGZyb20gXCJ2aXRlLXBsdWdpbi1kdHNcIjtcbmltcG9ydCBwYXRoIGZyb20gXCJwYXRoXCI7XG5pbXBvcnQgZnMgZnJvbSBcImZzXCI7XG5pbXBvcnQgeyBjcmVhdGVQb3N0Y3NzUGx1Z2lucyB9IGZyb20gXCIuL3Bvc3Rjc3MuY29uZmlnLm10c1wiO1xuXG5jb25zdCBjb21wb25lbnRzRGlyID0gcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgXCJzcmMvY29tcG9uZW50c1wiKTtcbmNvbnN0IGNvbXBvbmVudEVudHJpZXMgPSBPYmplY3QuZnJvbUVudHJpZXMoXG4gIGZzXG4gICAgLnJlYWRkaXJTeW5jKGNvbXBvbmVudHNEaXIsIHsgd2l0aEZpbGVUeXBlczogdHJ1ZSB9KVxuICAgIC5maWx0ZXIoKGRpcmVudCkgPT4gZGlyZW50LmlzRGlyZWN0b3J5KCkpXG4gICAgLm1hcCgoZGlyZW50KSA9PiB7XG4gICAgICBjb25zdCBpbmRleFRzID0gcGF0aC5qb2luKGNvbXBvbmVudHNEaXIsIGRpcmVudC5uYW1lLCBcImluZGV4LnRzXCIpO1xuICAgICAgY29uc3QgaW5kZXhUc3ggPSBwYXRoLmpvaW4oY29tcG9uZW50c0RpciwgZGlyZW50Lm5hbWUsIFwiaW5kZXgudHN4XCIpO1xuICAgICAgY29uc3QgZW50cnkgPSBmcy5leGlzdHNTeW5jKGluZGV4VHMpID8gaW5kZXhUcyA6IGZzLmV4aXN0c1N5bmMoaW5kZXhUc3gpID8gaW5kZXhUc3ggOiBudWxsO1xuICAgICAgcmV0dXJuIGVudHJ5ID8gW2RpcmVudC5uYW1lLnRvTG93ZXJDYXNlKCksIGVudHJ5XSA6IG51bGw7XG4gICAgfSlcbiAgICAuZmlsdGVyKChwYWlyKTogcGFpciBpcyBbc3RyaW5nLCBzdHJpbmddID0+IHBhaXIgIT09IG51bGwpLFxuKTtcblxudHlwZSBDc3NDaHVuayA9IHtcbiAgZmlsZU5hbWU6IHN0cmluZztcbiAgdml0ZU1ldGFkYXRhPzoge1xuICAgIGltcG9ydGVkQ3NzPzogU2V0PHN0cmluZz47XG4gIH07XG59O1xuXG4vKipcbiAqIFZpdGUgZXh0cmFjdHMgbGlicmFyeSBDU1MgYnV0IGRvZXMgbm90IHJldGFpbiBhIHN0YXRpYyBpbXBvcnQgaW4gdGhlIGVtaXR0ZWRcbiAqIEphdmFTY3JpcHQuIFJlc3RvcmUgdGhhdCBhc3NvY2lhdGlvbiBzbyBjb25zdW1lcnMgYXV0b21hdGljYWxseSByZWNlaXZlIHRoZVxuICogQ1NTIGZvciBldmVyeSBjb21wb25lbnQgY2h1bmsgdGhlaXIgYnVuZGxlciBrZWVwcy5cbiAqL1xuZnVuY3Rpb24gaW5qZWN0Q3NzSW1wb3J0cygpOiBQbHVnaW4ge1xuICByZXR1cm4ge1xuICAgIG5hbWU6IFwidWktbGFiLWluamVjdC1jc3MtaW1wb3J0c1wiLFxuICAgIGFwcGx5OiBcImJ1aWxkXCIsXG4gICAgZW5mb3JjZTogXCJwb3N0XCIsXG4gICAgcmVuZGVyQ2h1bmsoY29kZSwgY2h1bmspIHtcbiAgICAgIGNvbnN0IHsgaW1wb3J0ZWRDc3MgfSA9IChjaHVuayBhcyBDc3NDaHVuaykudml0ZU1ldGFkYXRhID8/IHt9O1xuICAgICAgY29uc3Qgc3R5bGVzID0gWy4uLihpbXBvcnRlZENzcyA/PyBbXSldLnNvcnQoKTtcbiAgICAgIGlmIChzdHlsZXMubGVuZ3RoID09PSAwKSByZXR1cm4gbnVsbDtcblxuICAgICAgY29uc3QgZGlyZWN0b3J5ID0gcGF0aC5wb3NpeC5kaXJuYW1lKGNodW5rLmZpbGVOYW1lKTtcbiAgICAgIGNvbnN0IGltcG9ydHMgPSBzdHlsZXMubWFwKChmaWxlTmFtZSkgPT4ge1xuICAgICAgICBjb25zdCByZWxhdGl2ZSA9IHBhdGgucG9zaXgucmVsYXRpdmUoZGlyZWN0b3J5LCBmaWxlTmFtZSk7XG4gICAgICAgIGNvbnN0IHNwZWNpZmllciA9IHJlbGF0aXZlLnN0YXJ0c1dpdGgoXCIuXCIpID8gcmVsYXRpdmUgOiBgLi8ke3JlbGF0aXZlfWA7XG4gICAgICAgIHJldHVybiBgaW1wb3J0ICR7SlNPTi5zdHJpbmdpZnkoc3BlY2lmaWVyKX07YDtcbiAgICAgIH0pO1xuXG4gICAgICBjb25zdCBkaXJlY3RpdmUgPSAnXCJ1c2UgY2xpZW50XCI7JztcbiAgICAgIGNvbnN0IGhhc0NsaWVudERpcmVjdGl2ZSA9IGNvZGUuc3RhcnRzV2l0aChkaXJlY3RpdmUpO1xuXG4gICAgICByZXR1cm4ge1xuICAgICAgICAvLyBLZWVwIHRoZSBjbGllbnQgZGlyZWN0aXZlIGZpcnN0LiBBIGRpcmVjdGl2ZSBhZnRlciBhbiBpbXBvcnQgaXMgYW5cbiAgICAgICAgLy8gb3JkaW5hcnkgc3RyaW5nIGxpdGVyYWwsIHdoaWNoIG1ha2VzIE5leHQgcmVuZGVyIGNsaWVudCBwcmltaXRpdmVzXG4gICAgICAgIC8vIHRocm91Z2ggaXRzIHNlcnZlciBwYXRoIGR1cmluZyBTU1IuXG4gICAgICAgIGNvZGU6IGhhc0NsaWVudERpcmVjdGl2ZVxuICAgICAgICAgID8gYCR7ZGlyZWN0aXZlfVxcbiR7aW1wb3J0cy5qb2luKFwiXFxuXCIpfVxcbiR7Y29kZS5zbGljZShkaXJlY3RpdmUubGVuZ3RoKX1gXG4gICAgICAgICAgOiBgJHtpbXBvcnRzLmpvaW4oXCJcXG5cIil9XFxuJHtjb2RlfWAsXG4gICAgICAgIG1hcDogbnVsbCxcbiAgICAgIH07XG4gICAgfSxcbiAgfTtcbn1cblxuZnVuY3Rpb24gY2xlYW5TdGFsZUJ1aWxkQXNzZXRzKCk6IFBsdWdpbiB7XG4gIGxldCBwcmV2aW91c0Fzc2V0cyA9IG5ldyBTZXQ8c3RyaW5nPigpO1xuICBjb25zdCBwcmVzZXJ2ZWRBc3NldHMgPSBuZXcgU2V0KFtcInN0eWxlcy5jc3NcIiwgXCJ0eXBvZ3JhcGh5LmNzc1wiLCBcInBvc3Rjc3MtdWktbGFiLm1qc1wiXSk7XG5cbiAgcmV0dXJuIHtcbiAgICBuYW1lOiBcInVpLWxhYi1jbGVhbi1zdGFsZS1idWlsZC1hc3NldHNcIixcbiAgICBhcHBseTogXCJidWlsZFwiLFxuICAgIGJ1aWxkU3RhcnQoKSB7XG4gICAgICBjb25zdCBkaXN0ID0gcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgXCJkaXN0XCIpO1xuICAgICAgaWYgKCFmcy5leGlzdHNTeW5jKGRpc3QpKSByZXR1cm47XG5cbiAgICAgIHByZXZpb3VzQXNzZXRzID0gbmV3IFNldChcbiAgICAgICAgZnNcbiAgICAgICAgICAucmVhZGRpclN5bmMoZGlzdCwgeyByZWN1cnNpdmU6IHRydWUsIHdpdGhGaWxlVHlwZXM6IHRydWUgfSlcbiAgICAgICAgICAuZmlsdGVyKChlbnRyeSkgPT4gZW50cnkuaXNGaWxlKCkpXG4gICAgICAgICAgLm1hcCgoZW50cnkpID0+IHBhdGgucmVsYXRpdmUoZGlzdCwgcGF0aC5qb2luKGVudHJ5LnBhcmVudFBhdGgsIGVudHJ5Lm5hbWUpKSlcbiAgICAgICAgICAuZmlsdGVyKChmaWxlKSA9PiBmaWxlLmVuZHNXaXRoKFwiLmpzXCIpIHx8IGZpbGUuZW5kc1dpdGgoXCIuY3NzXCIpKSxcbiAgICAgICk7XG4gICAgfSxcbiAgICB3cml0ZUJ1bmRsZShfb3B0aW9ucywgYnVuZGxlKSB7XG4gICAgICBjb25zdCBkaXN0ID0gcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgXCJkaXN0XCIpO1xuICAgICAgY29uc3QgY3VycmVudEFzc2V0cyA9IG5ldyBTZXQoT2JqZWN0LmtleXMoYnVuZGxlKSk7XG5cbiAgICAgIGZvciAoY29uc3QgZmlsZSBvZiBwcmV2aW91c0Fzc2V0cykge1xuICAgICAgICBpZiAocHJlc2VydmVkQXNzZXRzLmhhcyhmaWxlKSB8fCBjdXJyZW50QXNzZXRzLmhhcyhmaWxlKSkgY29udGludWU7XG4gICAgICAgIGZzLnJtU3luYyhwYXRoLmpvaW4oZGlzdCwgZmlsZSksIHsgZm9yY2U6IHRydWUgfSk7XG4gICAgICB9XG4gICAgfSxcbiAgfTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcbiAgcmVzb2x2ZToge1xuICAgIGFsaWFzOiB7XG4gICAgICBcIkBcIjogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgXCIuL3NyY1wiKSxcbiAgICB9LFxuICB9LFxuICBjc3M6IHtcbiAgICBwb3N0Y3NzOiB7XG4gICAgICBwbHVnaW5zOiBjcmVhdGVQb3N0Y3NzUGx1Z2lucygpLFxuICAgIH0sXG4gIH0sXG4gIHBsdWdpbnM6IFtcbiAgICByZWFjdCgpLFxuICAgIGluamVjdENzc0ltcG9ydHMoKSxcbiAgICBjbGVhblN0YWxlQnVpbGRBc3NldHMoKSxcbiAgICBkdHMoe1xuICAgICAgaW5zZXJ0VHlwZXNFbnRyeTogdHJ1ZSxcbiAgICAgIGV4Y2x1ZGU6IFtcIioqLyoudGVzdC50c1wiLCBcIioqLyoudGVzdC50c3hcIiwgXCJzcmMvdGVzdHMvKipcIiwgXCIqKi90ZXN0cy8qKlwiXSxcbiAgICB9KSxcbiAgXSxcbiAgYnVpbGQ6IHtcbiAgICBzb3VyY2VtYXA6IGZhbHNlLFxuICAgIC8vIEtlZXAgdGhlIHB1Ymxpc2hlZCBhZ2dyZWdhdGUgc3R5bGVzaGVldCByZXNvbHZhYmxlIHdoaWxlIGEgcmVidWlsZCBpcyBpblxuICAgIC8vIHByb2dyZXNzLiBTdGFsZSBWaXRlIGFzc2V0cyBhcmUgcmVtb3ZlZCBhZnRlciB0aGUgcmVwbGFjZW1lbnQgb3V0cHV0IGhhc1xuICAgIC8vIGJlZW4gd3JpdHRlbi5cbiAgICBlbXB0eU91dERpcjogZmFsc2UsXG4gICAgY3NzQ29kZVNwbGl0OiB0cnVlLFxuICAgIGxpYjoge1xuICAgICAgZW50cnk6IHtcbiAgICAgICAgXCJ1aS1sYWItdWlcIjogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgXCJzcmMvaW5kZXgudHNcIiksXG4gICAgICAgIHByb3ZpZGVyczogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgXCJzcmMvcHJvdmlkZXJzL2luZGV4LnRzXCIpLFxuICAgICAgICBcInRoZW1lLXNjcmlwdFwiOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCBcInNyYy9wcm92aWRlcnMvdGhlbWVTY3JpcHQudHNcIiksXG4gICAgICAgIFwidGhlbWUtc2VydmVyXCI6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsIFwic3JjL3RoZW1lLXNlcnZlci50c1wiKSxcbiAgICAgICAgXCJ0aGVtZS1jb250cmFjdFwiOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCBcInNyYy90aGVtZS1jb250cmFjdC50c1wiKSxcbiAgICAgICAgc2NyaXB0czogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgXCJzcmMvc2NyaXB0cy50c1wiKSxcbiAgICAgICAgLi4uY29tcG9uZW50RW50cmllcyxcbiAgICAgIH0sXG4gICAgICBmb3JtYXRzOiBbXCJlc1wiXSxcbiAgICB9LFxuICAgIHJvbGx1cE9wdGlvbnM6IHtcbiAgICAgIGV4dGVybmFsOiBbXG4gICAgICAgIFwicmVhY3RcIixcbiAgICAgICAgXCJyZWFjdC9qc3gtcnVudGltZVwiLFxuICAgICAgICBcInJlYWN0L2pzeC1kZXYtcnVudGltZVwiLFxuICAgICAgICBcInJlYWN0LWRvbVwiLFxuICAgICAgICBcInJlYWN0LWRvbS9jbGllbnRcIixcbiAgICAgICAgXCJzaGlraVwiLFxuICAgICAgICAvXnNoaWtpXFwvLiovLFxuICAgICAgICBcInJlYWN0LWFyaWFcIixcbiAgICAgICAgXCJyZWFjdC1zdGF0ZWx5XCIsXG4gICAgICAgIFwiZ3NhcFwiLFxuICAgICAgICAvXmdzYXBcXC8uKi8sXG4gICAgICAgIFwiQGdzYXAvcmVhY3RcIixcbiAgICAgICAgL15AcmVhY3QtYXJpYVxcLy4qLyxcbiAgICAgICAgL15AcmVhY3Qtc3RhdGVseVxcLy4qLyxcbiAgICAgICAgL15AcmVhY3QtdHlwZXNcXC8uKi8sXG4gICAgICBdLFxuICAgICAgb3V0cHV0OiB7XG4gICAgICAgIGhvaXN0VHJhbnNpdGl2ZUltcG9ydHM6IGZhbHNlLFxuICAgICAgICBlbnRyeUZpbGVOYW1lczogXCJbbmFtZV0uZXMuanNcIixcbiAgICAgICAgY2h1bmtGaWxlTmFtZXM6IFwiY2h1bmtzL1tuYW1lXS1baGFzaF0uanNcIixcbiAgICAgICAgLy8gQ29tcG9uZW50L3Byb3ZpZGVyIGVudHJpZXMgYXJlIGNsaWVudCBjb21wb25lbnRzOyB0aGUgcHVyZSBzY3JpcHQgZW50cmllcyBhcmUgbm90LlxuICAgICAgICBiYW5uZXI6IChjaHVuaykgPT4ge1xuICAgICAgICAgIGlmICghY2h1bmsuaXNFbnRyeSkgcmV0dXJuIFwiXCI7XG4gICAgICAgICAgY29uc3Qgc2VydmVyU2FmZSA9IG5ldyBTZXQoW1widGhlbWUtc2NyaXB0XCIsIFwidGhlbWUtc2VydmVyXCIsIFwidGhlbWUtY29udHJhY3RcIiwgXCJzY3JpcHRzXCJdKTtcbiAgICAgICAgICByZXR1cm4gc2VydmVyU2FmZS5oYXMoY2h1bmsubmFtZSkgPyBcIlwiIDogJ1widXNlIGNsaWVudFwiOyc7XG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0sXG4gIH0sXG59KTtcbiIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiL2hvbWUva3l6YS9Qcm9qZWN0cy91aS1sYWIvYXBwL3BhY2thZ2VzL0B1aVwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL2hvbWUva3l6YS9Qcm9qZWN0cy91aS1sYWIvYXBwL3BhY2thZ2VzL0B1aS9wb3N0Y3NzLmNvbmZpZy5tdHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL2hvbWUva3l6YS9Qcm9qZWN0cy91aS1sYWIvYXBwL3BhY2thZ2VzL0B1aS9wb3N0Y3NzLmNvbmZpZy5tdHNcIjtpbXBvcnQgdGFpbHdpbmRjc3MgZnJvbSBcIkB0YWlsd2luZGNzcy9wb3N0Y3NzXCI7XG5pbXBvcnQgc2xvdFBsdWdpbiBmcm9tIFwiLi4vLi4vcG9zdGNzcy9zbG90Lm1qc1wiO1xuaW1wb3J0IHZhcmlhbnRQbHVnaW4gZnJvbSBcIi4uLy4uL3Bvc3Rjc3MvdmFyaWFudC5tanNcIjtcblxuY29uc3QgTUlYX0ZVTkNUSU9OID0gXCJtaXgoXCI7XG5jb25zdCBNSVhfRlVOQ1RJT05fUEFUVEVSTiA9IC8oXnxbXkEtWmEtejAtOV8tXSltaXhcXCgvZztcblxuZnVuY3Rpb24gZXhwYW5kTWl4RnVuY3Rpb25zKHZhbHVlOiBzdHJpbmcpOiBzdHJpbmcge1xuICByZXR1cm4gdmFsdWUucmVwbGFjZShNSVhfRlVOQ1RJT05fUEFUVEVSTiwgXCIkMWNvbG9yLW1peChpbiBzcmdiLCBcIik7XG59XG5cbmZ1bmN0aW9uIG1peEZ1bmN0aW9uKCkge1xuICByZXR1cm4ge1xuICAgIHBvc3Rjc3NQbHVnaW46IFwidWktbGFiLW1peC1mdW5jdGlvblwiLFxuICAgIERlY2xhcmF0aW9uKGRlY2w6IHsgdmFsdWU6IHN0cmluZyB9KSB7XG4gICAgICBpZiAoIWRlY2wudmFsdWUuaW5jbHVkZXMoTUlYX0ZVTkNUSU9OKSkgcmV0dXJuO1xuICAgICAgZGVjbC52YWx1ZSA9IGV4cGFuZE1peEZ1bmN0aW9ucyhkZWNsLnZhbHVlKTtcbiAgICB9LFxuICAgIEF0UnVsZShhdFJ1bGU6IHsgcGFyYW1zOiBzdHJpbmcgfSkge1xuICAgICAgaWYgKCFhdFJ1bGUucGFyYW1zLmluY2x1ZGVzKE1JWF9GVU5DVElPTikpIHJldHVybjtcbiAgICAgIGF0UnVsZS5wYXJhbXMgPSBleHBhbmRNaXhGdW5jdGlvbnMoYXRSdWxlLnBhcmFtcyk7XG4gICAgfSxcbiAgfTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGRlbW90ZVRhaWx3aW5kVXRpbGl0eUxheWVyKCkge1xuICByZXR1cm4ge1xuICAgIHBvc3Rjc3NQbHVnaW46IFwidWktbGFiLWRlbW90ZS10YWlsd2luZC11dGlsaXR5LWxheWVyXCIsXG4gICAgQXRSdWxlKGF0UnVsZTogeyBuYW1lOiBzdHJpbmc7IHBhcmFtczogc3RyaW5nOyBub2Rlcz86IHVua25vd25bXSB9KSB7XG4gICAgICAvLyBLZWVwIGxpYnJhcnktZ2VuZXJhdGVkIHV0aWxpdHkgc2VsZWN0b3JzIGJlbG93IGNvbnN1bWVyIGFwcCB1dGlsaXRpZXMgc29cbiAgICAgIC8vIGBAaW1wb3J0IFwidWktbGFiLWNvbXBvbmVudHMvc3R5bGVzLmNzc1wiYCBiZWhhdmVzIHRoZSBzYW1lIGFzIGEgSlMgQ1NTIGltcG9ydC5cbiAgICAgIGlmIChhdFJ1bGUubmFtZSAhPT0gXCJsYXllclwiKSByZXR1cm47XG4gICAgICBpZiAoYXRSdWxlLnBhcmFtcy50cmltKCkgIT09IFwidXRpbGl0aWVzXCIpIHJldHVybjtcbiAgICAgIGlmICghQXJyYXkuaXNBcnJheShhdFJ1bGUubm9kZXMpIHx8IGF0UnVsZS5ub2Rlcy5sZW5ndGggPT09IDApIHJldHVybjtcblxuICAgICAgYXRSdWxlLnBhcmFtcyA9IFwiY29tcG9uZW50c1wiO1xuICAgIH0sXG4gIH07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVQb3N0Y3NzUGx1Z2lucygpIHtcbiAgcmV0dXJuIFt2YXJpYW50UGx1Z2luKCksIHNsb3RQbHVnaW4oKSwgbWl4RnVuY3Rpb24oKSwgdGFpbHdpbmRjc3MoKSwgZGVtb3RlVGFpbHdpbmRVdGlsaXR5TGF5ZXIoKV07XG59XG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgcGx1Z2luczogY3JlYXRlUG9zdGNzc1BsdWdpbnMoKSxcbn07XG4iLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIi9ob21lL2t5emEvUHJvamVjdHMvdWktbGFiL2FwcC9wb3N0Y3NzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvaG9tZS9reXphL1Byb2plY3RzL3VpLWxhYi9hcHAvcG9zdGNzcy9zbG90Lm1qc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vaG9tZS9reXphL1Byb2plY3RzL3VpLWxhYi9hcHAvcG9zdGNzcy9zbG90Lm1qc1wiO2ltcG9ydCBzbG90UGx1Z2luIGZyb20gXCIuL3Nsb3QuY2pzXCI7XG5cbmV4cG9ydCBjb25zdCB7IGV4cGFuZFNsb3RGdW5jdGlvbnMgfSA9IHNsb3RQbHVnaW47XG5leHBvcnQgZGVmYXVsdCBzbG90UGx1Z2luO1xuIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvaG9tZS9reXphL1Byb2plY3RzL3VpLWxhYi9hcHAvcG9zdGNzc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL2hvbWUva3l6YS9Qcm9qZWN0cy91aS1sYWIvYXBwL3Bvc3Rjc3MvdmFyaWFudC5tanNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL2hvbWUva3l6YS9Qcm9qZWN0cy91aS1sYWIvYXBwL3Bvc3Rjc3MvdmFyaWFudC5tanNcIjtpbXBvcnQgdmFyaWFudFBsdWdpbiBmcm9tIFwiLi92YXJpYW50LmNqc1wiO1xuXG5leHBvcnQgY29uc3QgeyBwYXJzZVZhcmlhbnQsIHZhcmlhbnRTZWxlY3RvciB9ID0gdmFyaWFudFBsdWdpbjtcbmV4cG9ydCBkZWZhdWx0IHZhcmlhbnRQbHVnaW47XG4iXSwKICAibWFwcGluZ3MiOiAiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTtBQUFBO0FBQXdSLFFBQU0sYUFBYTtBQUUzUyxhQUFTLGFBQWEsTUFBTSxVQUFVO0FBQ3BDLGFBQU8sVUFBVSxJQUFJLElBQUksUUFBUTtBQUFBLElBQ25DO0FBRUEsYUFBUyxlQUFlLE9BQU87QUFDN0IsWUFBTSxhQUFhLENBQUM7QUFDcEIsVUFBSSxRQUFRO0FBQ1osVUFBSSxRQUFRO0FBRVosZUFBUyxRQUFRLEdBQUcsUUFBUSxNQUFNLFFBQVEsU0FBUyxHQUFHO0FBQ3BELGNBQU0sWUFBWSxNQUFNLEtBQUs7QUFDN0IsWUFBSSxjQUFjLElBQUssVUFBUztBQUNoQyxZQUFJLGNBQWMsSUFBSyxVQUFTO0FBQ2hDLFlBQUksY0FBYyxPQUFPLFVBQVUsR0FBRztBQUNwQyxxQkFBVyxLQUFLLE1BQU0sTUFBTSxPQUFPLEtBQUssRUFBRSxLQUFLLENBQUM7QUFDaEQsa0JBQVEsUUFBUTtBQUFBLFFBQ2xCO0FBQUEsTUFDRjtBQUVBLGlCQUFXLEtBQUssTUFBTSxNQUFNLEtBQUssRUFBRSxLQUFLLENBQUM7QUFDekMsYUFBTztBQUFBLElBQ1Q7QUFFQSxhQUFTQSxxQkFBb0IsT0FBTztBQUNsQyxVQUFJLFNBQVM7QUFDYixVQUFJLFNBQVM7QUFFYixhQUFPLFNBQVMsTUFBTSxRQUFRO0FBQzVCLGNBQU0s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QjtBQUFBLFFBQ2pFLFNBQVMsS0FBSyxRQUFRLGtDQUFXLGdCQUFnQjtBQUFBLFFBQ2pELEdBQUc7QUFBQSxNQUNMO0FBQUEsTUFDQSxTQUFTLENBQUMsSUFBSTtBQUFBLElBQ2hCO0FBQUEsSUFDQSxlQUFlO0FBQUEsTUFDYixVQUFVO0FBQUEsUUFDUjtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsTUFDRjtBQUFBLE1BQ0EsUUFBUTtBQUFBLFFBQ04sd0JBQXdCO0FBQUEsUUFDeEIsZ0JBQWdCO0FBQUEsUUFDaEIsZ0JBQWdCO0FBQUE7QUFBQSxRQUVoQixRQUFRLENBQUMsVUFBVTtBQUNqQixjQUFJLENBQUMsTUFBTSxRQUFTLFFBQU87QUFDM0IsZ0JBQU0sYUFBYSxvQkFBSSxJQUFJLENBQUMsZ0JBQWdCLGdCQUFnQixrQkFBa0IsU0FBUyxDQUFDO0FBQ3hGLGlCQUFPLFdBQVcsSUFBSSxNQUFNLElBQUksSUFBSSxLQUFLO0FBQUEsUUFDM0M7QUFBQSxNQUNGO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFDRixDQUFDOyIsCiAgIm5hbWVzIjogWyJleHBhbmRTbG90RnVuY3Rpb25zIiwgInNsb3RQbHVnaW4iLCAicGFyc2VWYXJpYW50IiwgInZhcmlhbnRTZWxlY3RvciIsICJ2YXJpYW50UGx1Z2luIiwgInNsb3RQbHVnaW4iLCAidmFyaWFudFBsdWdpbiJdCn0K
