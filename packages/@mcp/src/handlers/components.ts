import { getElementEntry, listElements } from "@ui-lab-core/library/server";
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
  return listElements("components")
    .filter(
      (entry) =>
        entry.groupPath[0] === componentId &&
        entry.previewEligible &&
        entry.visibility === "public" &&
        entry.access === "free",
    )
    .map((entry) => ({
      ref: `${componentId}/${entry.id}`,
      name: entry.displayName,
      description: entry.description,
    }));
}

function getExample(reference: string) {
  const [componentId, exampleId, ...rest] = reference.split("/");
  if (!componentId || !exampleId || rest.length > 0) return null;

  const example =
    getElementEntry("components", exampleId) ??
    getElementEntry("components", exampleId.replace(/^\d+-/, ""));

  if (
    !example ||
    example.groupPath[0] !== componentId ||
    !example.previewEligible ||
    example.visibility !== "public" ||
    example.access !== "free"
  ) {
    return null;
  }

  return {
    ref: `${componentId}/${example.id}`,
    component: componentId,
    name: example.displayName,
    description: example.description,
    code: example.code,
    files: example.files,
  };
}

function componentImport(component: ComponentMetadata) {
  return {
    packageName: component.source.packageName,
    importPath: component.source.packagePath,
    exportName: component.source.exportName,
    statement: `import { ${component.source.exportName} } from '${component.source.packagePath}';`,
  };
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
        api: component.api,
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
      api: component.api,
      usage: component.usage,
      examples,
      experimental: component.experimental,
    },
  };
}
