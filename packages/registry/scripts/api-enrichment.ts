import * as path from "path";
import * as fs from "fs";
import { fileURLToPath, pathToFileURL } from "url";
import type { ComponentAPI, ComponentAPIEnrichment, PropDefinition } from "../src/types";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const REGISTRY_COMPONENTS_DIR = path.resolve(__dirname, "../src/components");

/**
 * Loads the hand-authored API documentation that lives beside the component's
 * other registry data, following the same convention as `documentation.ts`.
 */
export async function loadComponentEnrichment(
  componentDirName: string,
): Promise<ComponentAPIEnrichment | undefined> {
  const enrichmentPath = path.join(REGISTRY_COMPONENTS_DIR, componentDirName, "api.ts");
  if (!fs.existsSync(enrichmentPath)) return undefined;

  try {
    return (await import(pathToFileURL(enrichmentPath).href)).apiEnrichment;
  } catch (e) {
    console.warn(`Failed to load API enrichment for ${componentDirName}:`, e);
    return undefined;
  }
}

/** Hand-authored props replace extracted props of the same name and keep their order. */
function mergeProps(extracted: PropDefinition[], authored: PropDefinition[]): PropDefinition[] {
  const authoredNames = new Set(authored.map((prop) => prop.name));
  return [...extracted.filter((prop) => !authoredNames.has(prop.name)), ...authored];
}

export function applyEnrichment(
  api: ComponentAPI,
  enrichment: ComponentAPIEnrichment,
): ComponentAPI {
  const subComponents = api.subComponents
    ? Object.fromEntries(
        Object.entries(api.subComponents)
          .filter(([name]) => enrichment.subComponents?.include?.(name) ?? true)
          .map(([name, component]) => {
            const authored = enrichment.subComponents?.props?.[name];
            return [
              name,
              authored ? { ...component, props: mergeProps(component.props, authored) } : component,
            ];
          }),
      )
    : undefined;

  const enriched: ComponentAPI = {
    ...api,
    props: enrichment.props ? mergeProps(api.props, enrichment.props) : api.props,
    subComponents,
    propGroups: enrichment.propGroups ?? api.propGroups,
    stateAttributes: enrichment.stateAttributes ?? api.stateAttributes,
    customTypes: enrichment.customTypes ?? api.customTypes,
  };

  return enrichment.refine ? enrichment.refine(enriched) : enriched;
}
