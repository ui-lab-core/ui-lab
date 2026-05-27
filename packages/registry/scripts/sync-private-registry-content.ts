import { access, cp, mkdir, readdir, readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const registryRoot = path.resolve(__dirname, '..');
const privateContentRoot = path.resolve(
  registryRoot,
  '../../../private/packages/library/content/registry'
);
const publicContentRoot = path.resolve(registryRoot, 'src');

const CONTENT_DIRECTORIES = ['elements', 'patterns', 'sections'] as const;

async function assertDirectoryExists(directory: string) {
  try {
    await access(directory);
  } catch {
    throw new Error(
      `Private registry content directory not found: ${directory}\n` +
        'Expected private/packages/library/content/registry to contain elements, patterns, and sections.'
    );
  }
}

async function stripPrivateVariationExports(directory: string) {
  const entries = await readdir(directory, { withFileTypes: true });

  for (const entry of entries) {
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      await stripPrivateVariationExports(entryPath);
      continue;
    }

    if (entry.name !== 'index.tsx' && entry.name !== 'index.ts') {
      continue;
    }

    const content = await readFile(entryPath, 'utf8');
    const nextContent = content.replace(
      /^export (?:type )?\{[^\n]*\} from '\.\/variations\/index\.js';\n/gm,
      ''
    ).replace(
      /^export \{\n(?:  .*\n)*?\} from '\.\/[^']+\/index\.js';\n/gm,
      (match) =>
        /(?:Basic|Nested|DEMO_MAP|variationComponentMap|Variations)/.test(match)
          ? ''
          : match
    );

    if (nextContent !== content) {
      await writeFile(entryPath, nextContent);
    }
  }
}

async function syncDirectory(directoryName: (typeof CONTENT_DIRECTORIES)[number]) {
  const source = path.join(privateContentRoot, directoryName);
  const destination = path.join(publicContentRoot, directoryName);

  await assertDirectoryExists(source);
  await rm(destination, { recursive: true, force: true });
  await mkdir(destination, { recursive: true });
  await cp(source, destination, {
    recursive: true,
    filter: (sourcePath) =>
      directoryName === 'patterns' || path.basename(sourcePath) !== 'variations',
  });

  if (directoryName !== 'patterns') {
    await stripPrivateVariationExports(destination);
  }

  console.log(`Synced ${directoryName} registry metadata from private library content.`);
}

async function main() {
  for (const directoryName of CONTENT_DIRECTORIES) {
    await syncDirectory(directoryName);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
