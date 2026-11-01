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

  const { apiEnrichment } = await import(pathToFileURL(enrichmentPath).href);
  if (!apiEnrichment || typeof apiEnrichment !== "object") {
    throw new Error(`${enrichmentPath} must export apiEnrichment.`);
  }
  return apiEnrichment;
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
              { ...component, props: authored ? mergeProps(component.props, authored) : [...component.props] },
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

  const documentProps = (props: PropDefinition[], documentation: Record<string, Partial<PropDefinition>>, scope: string) => {
    for (const name of Object.keys(documentation)) {
      if (!props.some((prop) => prop.name === name)) throw new Error(`${scope}: documentation references unknown prop ${name}`);
    }
    return props.map((prop) => {
      const doc = documentation[prop.name];
      if (!doc) return prop;
      // Whitelist prose fields even when JavaScript callers bypass types.
      return { ...prop,
        inherited: false,
        description: doc.description ?? prop.description,
        defaultValue: doc.defaultValue ?? prop.defaultValue,
        category: doc.category ?? prop.category,
      };
    });
  };
  enriched.props = documentProps(enriched.props, enrichment.documentation?.props ?? {}, "root");
  for (const [name, documentation] of Object.entries(enrichment.documentation?.parts ?? {})) {
    const part = enriched.subComponents?.[name];
    if (!part) throw new Error(`Documentation references unknown part ${name}`);
    part.props = documentProps(part.props, documentation, name);
  }

  return enrichment.refine ? enrichment.refine(enriched) : enriched;
}
