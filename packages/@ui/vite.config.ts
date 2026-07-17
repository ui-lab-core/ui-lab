import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';
import path from 'path';
import fs from 'fs';
import { createPostcssPlugins } from './postcss.config.mts';

const componentsDir = path.resolve(__dirname, 'src/components');
const componentEntries = Object.fromEntries(
  fs
    .readdirSync(componentsDir, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => {
      const indexTs = path.join(componentsDir, dirent.name, 'index.ts');
      const indexTsx = path.join(componentsDir, dirent.name, 'index.tsx');
      const entry = fs.existsSync(indexTs) ? indexTs : fs.existsSync(indexTsx) ? indexTsx : null;
      return entry ? [dirent.name.toLowerCase(), entry] : null;
    })
    .filter((pair): pair is [string, string] => pair !== null)
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
    name: 'ui-lab-inject-css-imports',
    apply: 'build',
    enforce: 'post',
    renderChunk(code, chunk) {
      const { importedCss } = (chunk as CssChunk).viteMetadata ?? {};
      const styles = [...(importedCss ?? [])].sort();
      if (styles.length === 0) return null;

      const directory = path.posix.dirname(chunk.fileName);
      const imports = styles.map((fileName) => {
        const relative = path.posix.relative(directory, fileName);
        const specifier = relative.startsWith('.') ? relative : `./${relative}`;
        return `import ${JSON.stringify(specifier)};`;
      });

      return {
        code: `${imports.join('\n')}\n${code}`,
        map: null,
      };
    },
  };
}

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
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
    dts({
      insertTypesEntry: true,
      exclude: ['**/*.test.ts', '**/*.test.tsx', 'src/tests/**', '**/tests/**'],
    }),
  ],
  build: {
    sourcemap: false,
    emptyOutDir: true,
    cssCodeSplit: true,
    lib: {
      entry: {
        'ui-lab-ui': path.resolve(__dirname, 'src/index.ts'),
        'providers': path.resolve(__dirname, 'src/providers/index.ts'),
        'theme-script': path.resolve(__dirname, 'src/providers/themeScript.ts'),
        'theme-server': path.resolve(__dirname, 'src/theme-server.ts'),
        'scroll-script': path.resolve(__dirname, 'src/scroll-script.ts'),
        'scripts': path.resolve(__dirname, 'src/scripts.ts'),
        ...componentEntries,
      },
      formats: ['es'],
    },
    rollupOptions: {
      external: [
        'react', 'react/jsx-runtime', 'react/jsx-dev-runtime', 'react-dom', 'react-dom/client',
        'shiki', /^shiki\/.*/,
        'react-aria', 'react-stately',
        'gsap', /^gsap\/.*/, '@gsap/react',
        /^@react-aria\/.*/,
        /^@react-stately\/.*/,
        /^@react-types\/.*/,
      ],
      output: {
        hoistTransitiveImports: false,
        entryFileNames: '[name].es.js',
        chunkFileNames: 'chunks/[name]-[hash].js',
        // Component/provider entries are client components; the pure script entries are not.
        banner: (chunk) => {
          if (!chunk.isEntry) return '';
          const serverSafe = new Set(['theme-script', 'theme-server', 'scroll-script', 'scripts']);
          return serverSafe.has(chunk.name) ? '' : '"use client";';
        },
      },
    },
  },
});
