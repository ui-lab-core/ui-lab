import assert from "node:assert/strict";
import test from "node:test";
import path from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";
import { componentRegistry } from "../src/registry.js";
import { generatedAPI, generatedComponentImports } from "../src/.generated/data.js";
import { validateContracts } from "./validate-contracts.js";
import { applyEnrichment } from "./api-enrichment.js";
import { loadComponentMetadata } from "./metadata-source.js";

test("required public contracts and exported imports match generated APIs", () => {
  validateContracts(componentRegistry, generatedAPI);
  assert.deepEqual(componentRegistry, loadComponentMetadata(), "Rebuild the registry after changing metadata");
  for (const component of Object.values(componentRegistry)) {
    assert.ok(generatedComponentImports[component.id]?.statement.includes(component.source.exportName));
  }
  assert.match(generatedComponentImports.toast.statement, /Toaster/);
});

test("descriptive enrichment rejects invented props and cannot replace signatures", () => {
  const api = { props: [{ name: "value", type: "string", required: true }] };
  assert.throws(() => applyEnrichment(api, { documentation: { props: { missing: { description: "Invented" } } } }), /unknown prop/);
  const result = applyEnrichment(api, { documentation: { props: { value: {
    description: "Documented", ...({ type: "number", required: false } as object),
  } } } });
  assert.equal(result.props[0].type, "string");
  assert.equal(result.props[0].required, true);
  assert.equal(api.props[0].type, "string");
  const compound = { props: [], subComponents: { "Example.Trigger": { props: [{ name: "children", type: "ReactNode", required: false }] } } };
  applyEnrichment(compound, { documentation: { parts: { "Example.Trigger": { children: { description: "Trigger label" } } } } });
  assert.equal("description" in compound.subComponents["Example.Trigger"].props[0], false);
});

test("basic public examples type-check against actual component source", () => {
  const registryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
  const uiSource = path.resolve(registryRoot, "../@ui/src");
  const examples = new Map<string, string>();
  const paths: Record<string, string[]> = { "@/*": [path.join(uiSource, "*")] };
  for (const component of Object.values(componentRegistry)) {
    const directory = component.id === "textarea" ? "Textarea" : component.id[0].toUpperCase() + component.id.slice(1);
    if (!["card", "skeleton"].includes(component.id))
      paths[`ui-lab-components/${component.id}`] = [path.join(uiSource, "components", directory, "index.ts")];
    for (const example of component.examples ?? []) {
      examples.set(path.join(registryRoot, "__examples__", `${component.id}-${example.id}.tsx`), example.code);
    }
  }
  examples.set(path.join(registryRoot, "__examples__", "server-imports.tsx"),
    'import { Card as BarrelCard } from "ui-lab-components"; import { Card } from "ui-lab-components/card"; import { Skeleton } from "ui-lab-components/skeleton"; export const Example = <BarrelCard><Card.Header>Header</Card.Header><Card.Body><Skeleton><Skeleton.Text /></Skeleton></Card.Body><Card.Footer>Footer</Card.Footer></BarrelCard>;');
  const options: ts.CompilerOptions = { target: ts.ScriptTarget.ES2020, module: ts.ModuleKind.ESNext,
    moduleResolution: ts.ModuleResolutionKind.Bundler, jsx: ts.JsxEmit.ReactJSX, strict: true,
    skipLibCheck: true, noEmit: true, esModuleInterop: true, paths, customConditions: ["react-server"] };
  const host = ts.createCompilerHost(options);
  const originalGetSourceFile = host.getSourceFile.bind(host);
  host.getSourceFile = (filename, languageVersion, onError, shouldCreateNewSourceFile) => examples.has(filename)
    ? ts.createSourceFile(filename, examples.get(filename)!, languageVersion, true, ts.ScriptKind.TSX)
    : originalGetSourceFile(filename, languageVersion, onError, shouldCreateNewSourceFile);
  const program = ts.createProgram([...examples.keys()], options, host);
  const errors = ts.getPreEmitDiagnostics(program).filter((diagnostic) => diagnostic.file && examples.has(diagnostic.file.fileName));
  assert.equal(errors.length, 0, ts.formatDiagnosticsWithColorAndContext(errors, {
    getCurrentDirectory: () => registryRoot, getCanonicalFileName: (name) => name, getNewLine: () => "\n",
  }));
});
