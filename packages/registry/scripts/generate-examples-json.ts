import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const REGISTRY_SRC_PATH = path.resolve(__dirname, '../src');
const COMPONENTS_PATH = path.resolve(REGISTRY_SRC_PATH, 'components');
const PRIVATE_COMPONENTS_PATH =
  process.env.UI_LAB_PRIVATE_COMPONENT_EXAMPLES_ROOT ??
  path.resolve(__dirname, '../../../../private/packages/library/src/components');

interface ExampleMetadata {
  title: string;
  description: string;
  code: string;
}

interface ExamplesJson {
  [key: string]: ExampleMetadata;
}

function extractMetadataFromTsx(content: string): { title: string; description: string } | null {
  const metadataMatch = content.match(/export\s+const\s+metadata\s*=\s*({[\s\S]*?})\s*;?/);
  if (!metadataMatch) return null;

  try {
    // Create a safe context to evaluate the metadata object
    const metadataStr = metadataMatch[1];
    // Parse the object literal
    const title = metadataStr.match(/title\s*:\s*['"`]([^'"`]+)['"`]/)?.[1] || '';
    const description = metadataStr.match(/description\s*:\s*['"`]([^'"`]+)['"`]/)?.[1] || '';
    return { title, description };
  } catch {
    return null;
  }
}

function stripMetadata(content: string): string {
  // Remove the metadata export and return only the component
  return content
    .replace(/export\s+const\s+metadata\s*=\s*{[\s\S]*?}\s*;?\n\n?/, '')
    .trim();
}

function normalizeUiLabImports(content: string): string {
  const pattern = /import\s+\{([^}]+)\}\s+from\s+['"]ui-lab-components\/[^'"]+['"];?\n?/g;
  const imports: string[] = [];
  let firstIndex = -1;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(content)) !== null) {
    if (firstIndex === -1) firstIndex = match.index;
    imports.push(...match[1].split(',').map((name) => name.trim()).filter(Boolean));
  }

  if (firstIndex === -1) return content;

  const withoutSubpathImports = content.replace(pattern, '');
  const uniqueImports = Array.from(new Set(imports));
  const rootImport = `import { ${uniqueImports.join(', ')} } from 'ui-lab-components';\n`;

  return `${withoutSubpathImports.slice(0, firstIndex)}${rootImport}${withoutSubpathImports.slice(firstIndex)}`;
}

function getPrivateComponentId(componentPath: string): string | null {
  const metadataPath = path.join(componentPath, 'metadata.json');
  if (!fs.existsSync(metadataPath)) return null;

  const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8')) as { id?: unknown };
  return typeof metadata.id === 'string' ? metadata.id : null;
}

function generateExamplesJson(componentPath: string): boolean {
  const componentId = getPrivateComponentId(componentPath);
  const privateExamplesDir = componentId
    ? path.join(PRIVATE_COMPONENTS_PATH, componentId)
    : null;
  const publicExamplesDir = path.join(componentPath, 'examples');
  const examplesDir =
    privateExamplesDir && fs.existsSync(privateExamplesDir)
      ? privateExamplesDir
      : publicExamplesDir;

  if (!fs.existsSync(examplesDir)) {
    return false;
  }

  const files = fs
    .readdirSync(examplesDir)
    .filter(f => f.endsWith('.tsx'))
    .sort();

  if (files.length === 0) {
    return false;
  }

  const examples: ExamplesJson = {};

  for (const file of files) {
    const filePath = path.join(examplesDir, file);
    const content = fs.readFileSync(filePath, 'utf-8');

    const metadata = extractMetadataFromTsx(content);
    if (!metadata) {
      console.warn(`⚠️  Could not extract metadata from ${file}`);
      continue;
    }

    const code = normalizeUiLabImports(stripMetadata(content));
    const key = file.replace('.tsx', '');

    examples[key] = {
      title: metadata.title,
      description: metadata.description,
      code
    };
  }

  // Write examples.json
  const outputPath = path.join(componentPath, 'examples.json');
  fs.writeFileSync(outputPath, JSON.stringify(examples, null, 2) + '\n');

  return true;
}

async function generateAllExamplesJson() {
  console.log('📝 Generating examples.json files...\n');

  if (!fs.existsSync(COMPONENTS_PATH)) {
    console.error('❌ Components directory not found:', COMPONENTS_PATH);
    process.exit(1);
  }

  try {
    const components = fs
      .readdirSync(COMPONENTS_PATH, { withFileTypes: true })
      .filter(d => d.isDirectory())
      .map(d => d.name);

    let generatedCount = 0;
    let skippedCount = 0;

    for (const component of components) {
      const componentPath = path.join(COMPONENTS_PATH, component);
      const generated = generateExamplesJson(componentPath);

      if (generated) {
        console.log(`✅ ${component}`);
        generatedCount++;
      } else {
        console.log(`⏭️  ${component} - no examples`);
        skippedCount++;
      }
    }

    console.log(`\n✨ Done!`);
    console.log(`   ✅ ${generatedCount} components with examples.json`);
    console.log(`   ⏭️  ${skippedCount} components skipped`);
  } catch (error) {
    console.error('❌ Error generating examples:', error);
    process.exit(1);
  }
}

generateAllExamplesJson();
