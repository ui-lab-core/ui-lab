import { registryAdapter } from '../adapters/registry-adapter.js';
import { formatDesignGuidelines } from '../context/design-guidelines.js';

export async function handleSearchComponents(input: { query: string }): Promise<any> {
  const results = registryAdapter.search(input.query, undefined, 10);
  return {
    success: true,
    components: results,
    count: results.length,
    message:
      results.length === 0
        ? `No components found for query "${input.query}". Try broader search terms.`
        : `Found ${results.length} component(s) matching "${input.query}"`,
  };
}

export async function handleGetComponent(input: {
  id: string;
  detail?: 'api' | 'examples' | 'full';
}): Promise<any> {
  const component = registryAdapter.getComponentById(input.id);
  if (!component) {
    throw new Error(`Component not found: ${input.id}`);
  }

  const detail = input.detail ?? 'full';

  if (detail === 'api') {
    return {
      success: true,
      component: {
        id: component.id,
        name: component.name,
        api: component.api
          ? { props: component.api.props, subComponents: component.api.subComponents }
          : undefined,
      },
    };
  }

  if (detail === 'examples') {
    return {
      success: true,
      component: {
        id: component.id,
        name: component.name,
        description: component.description,
        api: component.api ? { examples: component.api.examples } : undefined,
      },
    };
  }

  return {
    success: true,
    component,
    designGuidelines: formatDesignGuidelines(),
  };
}
