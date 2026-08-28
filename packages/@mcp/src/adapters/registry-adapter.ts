import {
  generatedAPI,
  generatedStyles,
  getComponentById as getRegistryComponent,
  searchComponents,
} from "ui-lab-registry";
import type { ComponentMetadata } from "ui-lab-registry";

function enrichComponentApi(id: string, api: ComponentMetadata["api"]) {
  if (!api) return api;

  const styleableParts =
    generatedStyles[id as keyof typeof generatedStyles]?.styleableParts?.map((part) => part.name) ??
    [];
  const hasStylesProp = api.props.some((prop) => prop.name === "styles");
  const variants =
    generatedStyles[id as keyof typeof generatedStyles]?.variants ?? [];

  const props = api.props
    .filter(
      (prop) => !(hasStylesProp && prop.name !== "className" && /.+ClassName$/.test(prop.name)),
    )
    .map((prop) => {
      if (prop.name === "variant" && variants.length > 0) {
        return {
          ...prop,
          enumValues: variants,
          description: `${prop.description ?? "Selects the visual treatment."} Available variants in the active theme: ${variants.map((variant) => `"${variant}"`).join(", ")}.`,
        };
      }
      if (prop.name !== "styles" || styleableParts.length === 0) return prop;

      const slots = `Available slots: ${styleableParts.map((part) => `"${part}"`).join(", ")}.`;
      return {
        ...prop,
        description: prop.description
          ? prop.description.includes("Available slots:")
            ? prop.description
            : `${prop.description} ${slots}`
          : slots,
      };
    });

  return { ...api, props, styleableParts };
}

function getComponent(id: string): ComponentMetadata | null {
  try {
    const component = getRegistryComponent(id);
    if (!component) return null;

    const apiAliases: Record<string, string> = { confirm: "confirmation" };
    const apiId = apiAliases[id] ?? id;
    const generated = generatedAPI[apiId as keyof typeof generatedAPI];

    return {
      ...component,
      api: generated ? enrichComponentApi(apiId, generated) : component.api,
    };
  } catch {
    return null;
  }
}

function search(query: string, limit = 5): ComponentMetadata[] {
  try {
    return searchComponents(query).slice(0, limit);
  } catch {
    return [];
  }
}

export const registryAdapter = { getComponent, search };
