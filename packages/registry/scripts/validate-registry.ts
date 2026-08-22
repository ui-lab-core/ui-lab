import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";
import { categories } from "../src/categories.js";
import { componentOrder } from "../src/component-order.js";
import type { ComponentCategory } from "../src/types.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const REGISTRY_SRC_PATH = path.resolve(__dirname, "../src");
const OLD_REGISTRY_PATH = path.resolve(REGISTRY_SRC_PATH, "registry.ts");
const GENERATED_REGISTRY_PATH = path.resolve(REGISTRY_SRC_PATH, "registry.ts");
const COMPONENTS_PATH = path.resolve(REGISTRY_SRC_PATH, "components");

interface ComponentMetadata {
  id: string;
  category: string;
}

interface ValidationResult {
  success: boolean;
  errors: string[];
  warnings: string[];
  stats: {
    newComponentCount: number;
  };
}

function validateComponentStructure(componentPath: string): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  const metadataPath = path.join(componentPath, "metadata.json");
  if (!fs.existsSync(metadataPath)) {
    errors.push(`Missing metadata.json`);
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

function validateComponentCategories(componentDirs: fs.Dirent[], result: ValidationResult): void {
  const metadataById = new Map<string, ComponentMetadata>();
  const orderedCategoriesById = new Map<string, ComponentCategory[]>();
  const validCategories = new Set<string>(Object.keys(categories));

  for (const componentDir of componentDirs) {
    const metadataPath = path.join(COMPONENTS_PATH, componentDir.name, "metadata.json");
    if (!fs.existsSync(metadataPath)) continue;

    try {
      const metadata = JSON.parse(fs.readFileSync(metadataPath, "utf-8")) as ComponentMetadata;

      if (!metadata.id || !metadata.category) {
        result.errors.push(`${componentDir.name}: metadata must include id and category`);
        continue;
      }

      if (metadataById.has(metadata.id)) {
        result.errors.push(`${componentDir.name}: duplicate component id "${metadata.id}"`);
        continue;
      }

      metadataById.set(metadata.id, metadata);

      if (!validCategories.has(metadata.category)) {
        result.errors.push(
          `${componentDir.name}: unknown metadata category "${metadata.category}"`,
        );
      }
    } catch (error) {
      result.errors.push(
        `${componentDir.name}: invalid metadata.json: ${
          error instanceof Error ? error.message : String(error)
        }`,
      );
    }
  }

  for (const [category, componentIds] of Object.entries(componentOrder) as Array<
    [ComponentCategory, string[]]
  >) {
    for (const componentId of componentIds) {
      const orderedCategories = orderedCategoriesById.get(componentId) ?? [];
      orderedCategories.push(category);
      orderedCategoriesById.set(componentId, orderedCategories);
    }
  }

  for (const [componentId, metadata] of metadataById) {
    const orderedCategories = orderedCategoriesById.get(componentId) ?? [];

    if (orderedCategories.length === 0) {
      result.errors.push(
        `${componentId}: metadata category "${metadata.category}" has no componentOrder entry`,
      );
    } else if (orderedCategories.length > 1) {
      result.errors.push(
        `${componentId}: appears in multiple componentOrder categories: ${orderedCategories.join(", ")}`,
      );
    } else if (orderedCategories[0] !== metadata.category) {
      result.errors.push(
        `${componentId}: metadata category "${metadata.category}" does not match componentOrder category "${orderedCategories[0]}"`,
      );
    }
  }

  for (const [componentId, orderedCategories] of orderedCategoriesById) {
    if (!metadataById.has(componentId)) {
      result.errors.push(
        `${componentId}: componentOrder entry in "${orderedCategories.join(", ")}" has no component metadata`,
      );
    }
  }
}

async function validateRegistry(): Promise<ValidationResult> {
  console.log("🔍 Validating registry migration...\n");

  const result: ValidationResult = {
    success: true,
    errors: [],
    warnings: [],
    stats: {
      newComponentCount: 0,
    },
  };

  try {
    // Check if components directory exists and has content
    if (!fs.existsSync(COMPONENTS_PATH)) {
      result.errors.push("Components directory does not exist");
      return result;
    }

    const componentDirs = fs
      .readdirSync(COMPONENTS_PATH, { withFileTypes: true })
      .filter((d) => d.isDirectory());

    result.stats.newComponentCount = componentDirs.length;

    validateComponentCategories(componentDirs, result);

    // Validate each component folder
    for (const componentDir of componentDirs) {
      const componentPath = path.join(COMPONENTS_PATH, componentDir.name);
      const validation = validateComponentStructure(componentPath);

      if (!validation.valid) {
        validation.errors.forEach((error) => {
          result.warnings.push(`${componentDir.name}: ${error}`);
        });
      }

    }

    // Validation checks
    if (result.stats.newComponentCount === 0) {
      result.errors.push("No components found in components directory");
    }

    result.success = result.errors.length === 0;

    return result;
  } catch (error) {
    result.success = false;
    result.errors.push(
      `Validation error: ${error instanceof Error ? error.message : String(error)}`,
    );
    return result;
  }
}

async function printValidationResults(result: ValidationResult) {
  console.log("📊 Validation Results\n");

  if (result.errors.length > 0) {
    console.log("❌ Errors:");
    result.errors.forEach((error) => console.log(`   • ${error}`));
    console.log();
  }

  if (result.warnings.length > 0) {
    console.log("⚠️  Warnings:");
    result.warnings.forEach((warning) => console.log(`   • ${warning}`));
    console.log();
  }

  console.log("📈 Statistics:");
  console.log(`   Components: ${result.stats.newComponentCount}`);
  console.log();

  if (result.success) {
    console.log("✅ Validation passed!");
  } else {
    console.log("❌ Validation failed!");
    process.exit(1);
  }
}

(async () => {
  const result = await validateRegistry();
  printValidationResults(result);
})();
