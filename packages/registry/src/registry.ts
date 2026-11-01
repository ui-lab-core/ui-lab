import type { ComponentRegistry } from "./types.js";
import { generatedComponentMetadata } from "./.generated/component-metadata.js";

// JSON is canonical authoring input; generation emits portable JavaScript data.
export const componentRegistry: ComponentRegistry = Object.fromEntries(
  generatedComponentMetadata.map((component) => [component.id, component]),
);

export const componentMetadata = generatedComponentMetadata.map((component) => ({
  id: component.id,
  name: component.name,
  description: component.description,
  category: component.category,
  tags: component.tags ?? [],
}));
