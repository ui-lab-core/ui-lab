import {
  componentRegistry,
  generatedAPI,
  generatedStyles,
  getComponentById as getRegistryComponent,
} from "ui-lab-registry";
import type { ComponentMetadata } from "ui-lab-registry";
import { rank, relaxedRank, type Field } from "../search.js";

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

/**
 * A missing component and a broken registry are different outcomes: only the
 * first one is null. Swallowing load failures into "no match" makes an agent
 * hand-roll a component that already exists.
 */
function getComponent(id: string): ComponentMetadata | null {
  const component = getRegistryComponent(id);
  if (!component) return null;

  const apiAliases: Record<string, string> = { confirm: "confirmation" };
  const apiId = apiAliases[id] ?? id;
  const generated = generatedAPI[apiId as keyof typeof generatedAPI];

  return {
    ...component,
    api: generated ? enrichComponentApi(apiId, generated) : component.api,
  };
}

function all(): ComponentMetadata[] {
  return Object.values(componentRegistry);
}

function fields(component: ComponentMetadata): Field[] {
  return [
    { value: component.id, weight: 50, exactWeight: 120 },
    { value: component.name, weight: 40, exactWeight: 100 },
    { value: component.tags ?? [], weight: 15, exactWeight: 30 },
    { value: component.category, weight: 20 },
    { value: component.description, weight: 10 },
    { value: component.usage?.summary ?? "", weight: 8 },
    { value: component.usage?.whenToUse ?? [], weight: 8 },
  ];
}

function search(query: string, limit = 5): ComponentMetadata[] {
  return rank(all(), fields, query, limit);
}

function suggest(query: string, limit = 5): ComponentMetadata[] {
  return relaxedRank(all(), fields, query, limit);
}

export const registryAdapter = { getComponent, all, search, suggest };
