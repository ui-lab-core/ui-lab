import type { ComponentMetadata } from "ui-lab-registry";
import { registryAdapter } from "../adapters/registry-adapter.js";

type ComponentDetail = "summary" | "api" | "usage" | "examples" | "full";

function componentSummary(component: ComponentMetadata) {
  return {
    id: component.id,
    name: component.name,
    description: component.description,
    category: component.category,
    tags: component.tags,
    importPath: component.source.packagePath,
    exportName: component.source.exportName,
  };
}

function componentExamples(componentId: string) {
  const component = registryAdapter.getComponent(componentId);
  return (component?.examples ?? []).map((example, index) => ({
    ref: `${componentId}/${example.id ?? index + 1}`,
    name: example.name ?? example.title ?? `Example ${index + 1}`,
    description: example.description,
  }));
}

function getExample(reference: string) {
  const [componentId, exampleId, ...rest] = reference.split("/");
  if (!componentId || !exampleId || rest.length > 0) return null;

  const component = registryAdapter.getComponent(componentId);
  const example = component?.examples?.find(
    (candidate, index) => (candidate.id ?? String(index + 1)) === exampleId,
  );
  if (!example) return null;

  return {
    ref: `${componentId}/${example.id ?? exampleId}`,
    component: componentId,
    name: example.name ?? example.title,
    description: example.description,
    code: example.code,
  };
}

function componentImport(component: ComponentMetadata) {
  const { packageName, exportName } = component.source;
  return {
    packageName,
    importPath: packageName,
    exportName,
    statement: `import { ${exportName} } from '${packageName}';`,
  };
}

// Compound components are exported as a namespace (Select.Content), but the
// registry keys their subComponents by the flat runtime export name
// (SelectContent). Surface the namespaced accessor agents actually write in JSX.
function componentApi(component: ComponentMetadata) {
  const api = component.api;
  if (!api?.subComponents) return api;

  const { exportName } = component.source;
  const subComponents = Object.fromEntries(
    Object.entries(api.subComponents).map(([key, value]) => {
      const accessor =
        key.startsWith(exportName) && key.length > exportName.length
          ? `${exportName}.${key.slice(exportName.length)}`
          : key;
      return [accessor, value];
    }),
  );

  return { ...api, subComponents };
}

export async function handleGetComponent(input: { query: string; detail?: ComponentDetail }) {
  const query = input.query.trim();
  if (!query) throw new Error("Component query must not be empty.");

  const example = getExample(query);
  if (example) return { example };

  const component = registryAdapter.getComponent(query.toLowerCase());
  if (!component) {
    const matches = registryAdapter.search(query, 5).map(componentSummary);
    if (matches.length === 0) {
      throw new Error(`No UI Lab component matches "${query}".`);
    }
    return { query, matches };
  }

  const detail = input.detail ?? "summary";
  if (detail === "summary") return { component: componentSummary(component) };

  if (detail === "api") {
    return {
      component: {
        ...componentSummary(component),
        import: componentImport(component),
        api: componentApi(component),
      },
    };
  }

  if (detail === "usage") {
    return {
      component: {
        ...componentSummary(component),
        relatedComponents: component.relatedComponents,
        usage: component.usage,
      },
    };
  }

  const examples = componentExamples(component.id);
  if (detail === "examples") {
    return { component: componentSummary(component), examples };
  }

  return {
    component: {
      ...componentSummary(component),
      import: componentImport(component),
      relatedComponents: component.relatedComponents,
      accessibility: component.accessibility,
      reactAriaUrl: component.reactAriaUrl,
      api: componentApi(component),
      usage: component.usage,
      examples,
      experimental: component.experimental,
    },
  };
}
