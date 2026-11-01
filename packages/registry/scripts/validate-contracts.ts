import type { ComponentAPI, ComponentRegistry } from "../src/types";

/** Coverage is incremental; a declared contract must never be partially published. */
export function validateContracts(registry: ComponentRegistry, apis: Record<string, ComponentAPI>): void {
  const errors: string[] = [];
  for (const component of Object.values(registry)) {
    const contract = component.contract;
    if (!contract) {
      if (["select", "group", "input", "textarea", "list", "expand", "scroll"].includes(component.id))
        errors.push(`${component.id}: missing required component contract`);
      continue;
    }
    if (contract.version !== 1) errors.push(`${component.id}: unsupported contract version`);
    for (const field of ["element", "nativeProps", "state", "accessibility"] as const) {
      if (!contract[field]?.trim()) errors.push(`${component.id}: missing contract.${field}`);
    }
    const api = apis[component.id];
    if (!api) errors.push(`${component.id}: contract has no extracted API`);
    for (const [name, part] of Object.entries(contract.parts ?? {})) {
      const qualified = `${component.source.exportName}.${name}`;
      if (!api?.subComponents?.[qualified] && !api?.subComponents?.[`${component.source.exportName}${name}`])
        errors.push(`${component.id}: contract references unknown part ${name}`);
      if (!part.element?.trim() || !part.nativeProps?.trim())
        errors.push(`${component.id}.${name}: element and nativeProps are required`);
    }
    const ids = new Set<string>();
    for (const example of component.examples ?? []) {
      if (!example.id || !example.code.trim() || !example.description.trim())
        errors.push(`${component.id}: contract examples require id, description, and code`);
      if (example.id && ids.has(example.id)) errors.push(`${component.id}: duplicate example ${example.id}`);
      if (example.id) ids.add(example.id);
    }
    if (!component.examples?.length) errors.push(`${component.id}: contract requires a public usage example`);
  }
  if (errors.length) throw new Error(`Invalid component contracts:\n${errors.join("\n")}`);
}
