import { registryAdapter } from '../adapters/registry-adapter.js';
import { formatDesignGuidelines } from '../context/design-guidelines.js';
import { getElementEntry } from '@ui-lab-core/library/server';

function getExample(reference: string) {
  const [componentId, exampleId, ...rest] = reference.split('/');
  if (!componentId || !exampleId || rest.length > 0) return null;

  const example = getElementEntry('components', exampleId)
    // Older published registry snapshots omit the numeric filename prefix.
    ?? getElementEntry('components', exampleId.replace(/^\d+-/, ''));
  if (
    !example ||
    example.groupPath[0] !== componentId ||
    !example.previewEligible ||
    example.visibility !== 'public' ||
    example.access !== 'free'
  ) {
    return null;
  }

  return { componentId, example };
}

export async function handleSearchComponents(input: { query: string }): Promise<any> {
  const results = registryAdapter.search(input.query, undefined, 10);

  const clientOnlyPatterns = [
    'button', 'input', 'select', 'checkbox', 'toggle', 'dialog', 'modal', 'popover',
    'dropdown', 'menu', 'tabs', 'accordion', 'slider', 'tooltip', 'form', 'date-picker',
    'time-picker', 'color-picker', 'file-input', 'search', 'pagination', 'textarea',
    'radio', 'combobox', 'switch', 'rating', 'tag', 'autocomplete'
  ];

  return {
    success: true,
    components: results.map((c: any) => {
      const source = c.source || {
        packageName: 'ui-lab-components',
        exportName: c.id.charAt(0).toUpperCase() + c.id.slice(1).replace(/-./g, (x: string) => x[1].toUpperCase()),
        packagePath: 'ui-lab-components',
      };
      const isClientComponent = clientOnlyPatterns.some(p => c.id.toLowerCase().includes(p));

      return {
        id: c.id,
        name: c.name,
        description: c.description,
        packageName: source.packageName,
        importPath: source.packagePath,
        exportName: source.exportName,
        isClientComponent,
      };
    }),
    count: results.length,
    message:
      results.length === 0
        ? `No components found for query "${input.query}". Try broader search terms.`
        : `Found ${results.length} component(s). Use get_component(id) for full API or get_component_source(id) for import details.`,
  };
}

export async function handleGetComponent(input: {
  id: string;
  detail?: 'api' | 'examples' | 'usage' | 'full';
}): Promise<any> {
  const exampleMatch = getExample(input.id);
  if (exampleMatch) {
    const { componentId, example } = exampleMatch;
    return {
      success: true,
      reference: input.id,
      component: {
        id: componentId,
        name: registryAdapter.getComponentById(componentId)?.name ?? componentId,
      },
      example: {
        id: input.id,
        name: example.displayName,
        description: example.description,
        code: example.code,
        files: example.files,
      },
    };
  }

  const component = registryAdapter.getComponentById(input.id);
  if (!component) {
    throw new Error(`Component or example not found: ${input.id}`);
  }

  const detail = input.detail ?? 'full';

  if (detail === 'api') {
    const source = component.source || {
      packageName: 'ui-lab-components',
      exportName: component.id.charAt(0).toUpperCase() + component.id.slice(1).replace(/-./g, (x: string) => x[1].toUpperCase()),
      packagePath: 'ui-lab-components',
    };
    return {
      success: true,
      component: {
        id: component.id,
        name: component.name,
        importPath: source.packagePath,
        importStatement: `import { ${source.exportName} } from '${source.packagePath}';`,
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

  if (detail === 'usage') {
    return {
      success: true,
      component: {
        id: component.id,
        name: component.name,
        description: component.description,
        usage: component.usage,
      },
    };
  }

  const source = component.source || {
    packageName: 'ui-lab-components',
    exportName: component.id.charAt(0).toUpperCase() + component.id.slice(1).replace(/-./g, (x: string) => x[1].toUpperCase()),
    packagePath: 'ui-lab-components',
  };

  return {
    success: true,
    component: {
      ...component,
      importPath: source.packagePath,
      importStatement: `import { ${source.exportName} } from '${source.packagePath}';`,
    },
    designGuidelines: formatDesignGuidelines(),
  };
}
