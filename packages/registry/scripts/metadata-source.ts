import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import type { ComponentRegistry, ComponentMetadata } from "../src/types.js";

/** JSON is authoring input, not a runtime module (Node import rules vary by version). */
export function loadComponentMetadata(): ComponentRegistry {
  const directory = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../src/components");
  const registry: ComponentRegistry = {};
  for (const entry of readdirSync(directory, { withFileTypes: true }).filter((entry) => entry.isDirectory()).sort((a, b) => a.name.localeCompare(b.name))) {
    const component = JSON.parse(readFileSync(path.join(directory, entry.name, "metadata.json"), "utf8")) as ComponentMetadata;
    if (!component.id || registry[component.id]) throw new Error(`Missing or duplicate component id in ${entry.name}`);
    registry[component.id] = component;
  }
  return registry;
}
