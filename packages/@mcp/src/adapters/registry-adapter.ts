/**
 * Registry Adapter (Simplified)
 * Provides simplified access to component metadata for the 4 core tools
 *
 * This adapter provides:
 * - getComponentById: Get full component metadata + design guidance
 * - search: Search for components by query
 * - getAllComponentIds: List all available components (for backward compatibility)
 */

import {
  getComponentById as getComponentByIdFromRegistry,
  searchComponents,
  getAllComponentIds as getAllComponentIdsFromRegistry,
  generatedAPI,
  generatedStyles,
  getProviderById as getProviderByIdFromRegistry,
} from 'ui-lab-registry';

import type { ComponentMetadata } from 'ui-lab-registry';

function enrichComponentApi(id: string, api: ComponentMetadata['api']) {
  if (!api) return api;

  const styleableParts =
    generatedStyles[id as keyof typeof generatedStyles]?.styleableParts?.map((part) => part.name) ?? [];
  const hasStylesProp = api.props.some((prop) => prop.name === 'styles');

  const props = api.props
    .filter((prop) => !(hasStylesProp && prop.name !== 'className' && /.+ClassName$/.test(prop.name)))
    .map((prop) => {
      if (prop.name !== 'styles' || styleableParts.length === 0) {
        return prop;
      }

      const slotsDescription = `Available slots: ${styleableParts.map((part) => `"${part}"`).join(', ')}.`;
      const description = prop.description?.includes('Available slots:')
        ? prop.description
        : prop.description
          ? `${prop.description} ${slotsDescription}`
          : slotsDescription;

      return {
        ...prop,
        description,
      };
    });

  return {
    ...api,
    props,
    styleableParts,
  };
}

/**
 * Get a single component by ID with enriched metadata
 */
function getComponentById(id: string): ComponentMetadata | null {
  try {
    const component = getComponentByIdFromRegistry(id);
    if (!component) return null;

    // Merge API data — generatedAPI uses lowercase keys derived from @ui folder names,
    // which may differ from the registry ID (e.g. registry "confirm" → generatedAPI "confirmation")
    const generatedAPIAliases: Record<string, string> = { confirm: 'confirmation' };
    const generatedAPIKey = generatedAPIAliases[id] ?? id;
    const api = generatedAPI[generatedAPIKey as keyof typeof generatedAPI];
    if (api) {
      component.api = enrichComponentApi(generatedAPIKey, api);
    }

    return component;
  } catch {
    return null;
  }
}

/**
 * Search for components by query
 */
function searchRegistry(
  query: string,
  limit: number = 20
): ComponentMetadata[] {
  try {
    return searchComponents(query).slice(0, limit);
  } catch {
    return [];
  }
}

/**
 * Get all available component IDs
 */
function getAllComponentIds(): string[] {
  try {
    return getAllComponentIdsFromRegistry();
  } catch {
    return [];
  }
}

/**
 * Get a provider by ID
 */
function getProviderById(id: string): any {
  try {
    return getProviderByIdFromRegistry(id);
  } catch {
    return null;
  }
}

/**
 * Simple singleton exports for compatibility
 */
export const registryAdapter = {
  getComponentById,
  search: (query: string, _category?: any, limit?: number) =>
    searchRegistry(query, limit || 20),
  getAllComponentIds,
  getProviderById,
};
