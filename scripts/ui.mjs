#!/usr/bin/env node

import { spawn } from "node:child_process";
import { stdin, stdout } from "node:process";
import { chooseAction, getProjects } from "./actions.mjs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const build = (directory, label) => ({ directory, label, args: ["run", "build"] });
const theme = build("packages/themes/onyx", "Build Onyx theme");
const components = build("packages/@ui", "Build components");
const docs = { directory: ".", label: "Generate styling documentation", args: ["run", "docs:styles"] };
const registry = build("packages/registry", "Generate and build registry");
// The MCP build script rebuilds the registry itself. Compile here only after
// the explicit registry stage, keeping the dependency order visible and unique.
const mcp = { directory: "packages/@mcp", label: "Compile MCP server", args: ["exec", "tsc"] };
const cli = build("packages/@cli", "Build CLI");

// Add workflows here; interactive and direct invocation use the same stages.
const actions = [
  { id: "all", label: "Rebuild development stack", description: "Theme, components, documentation, registry, MCP and CLI.", steps: [theme, components, docs, registry, mcp, cli] },
  { id: "components", label: "Rebuild components", description: "Component package only; documentation and MCP are unchanged.", steps: [components] },
  { id: "theme", label: "Rebuild theme", description: "Onyx theme package only.", steps: [theme] },
  { id: "docs", label: "Refresh documentation and MCP data", description: "Generate styling docs, rebuild registry and compile MCP; does not rebuild components.", steps: [docs, registry, mcp] },
  { id: "mcp", label: "Rebuild MCP", description: "Rebuild registry and compile MCP server.", steps: [registry, mcp] },
  { id: "cli", label: "Rebuild CLI", description: "Rebuild registry and CLI.", steps: [registry, cli] },
];

function runStep(step) {
  return new Promise((resolve, reject) => {
    const child = spawn("pnpm", step.args, { cwd: path.join(root, step.directory), stdio: "inherit" });
    child.once("error", reject);
    child.once("exit", (code, signal) => {
      if (code === 0) resolve();
      else reject(new Error(`${step.label}: ${signal ? `stopped by ${signal}` : `exited with code ${code}`}`));
    });
  });
}

async function runAction(action) {
  console.log(`\n${action.label}`);
  const started = Date.now();
  for (const [index, step] of action.steps.entries()) {
    console.log(`\n[${index + 1}/${action.steps.length}] ${step.label}`);
    try {
      await runStep(step);
    } catch (error) {
      console.error(`\nFailed: ${error.message}\nRemaining stages were not run.`);
      if (action.steps.includes(registry) || action.steps.includes(mcp)) {
        console.error("Documentation/MCP refresh is incomplete.");
      }
      return false;
    }
  }
  console.log(`\nCompleted in ${((Date.now() - started) / 1000).toFixed(1)}s.`);
  if (action.steps.includes(mcp)) {
    console.log("MCP files rebuilt. Restart/reconnect your MCP client to load them; running servers are not refreshed automatically.");
  }
  return true;
}

function printActions() {
  for (const [index, action] of actions.entries()) {
    console.log(`  ${index + 1}. ${action.label} (${action.id})\n     ${action.description}`);
  }
}

async function main() {
  const args = process.argv.slice(2);
  if (args.length) {
    if (args.length === 1 && ["help", "--help", "-h"].includes(args[0])) {
      console.log("Usage: pnpm actions [action]\n");
      printActions();
      return;
    }
    const action = args.length === 1 && actions.find((item) => item.id === args[0]);
    if (!action) throw new Error("Unknown action. Run pnpm actions --help for available actions.");
    if (!await runAction(action)) process.exitCode = 1;
    return;
  }
  if (!stdin.isTTY || !stdout.isTTY) {
    console.log("Use pnpm actions <action> outside an interactive terminal.\n");
    printActions();
    return;
  }

  const workflows = {
    root,
    manifest: {
      name: "Development",
      scripts: Object.fromEntries(actions.map((action) => [action.label, action.id])),
    },
    afterRun: "MCP rebuilds require client reconnect",
    async run(label) {
      if (!await runAction(actions.find((action) => action.label === label))) {
        throw new Error(`${label} failed; remaining stages were not run.`);
      }
    },
  };
  await chooseAction(root, {
    projects: [workflows, ...await getProjects(path.join(root, "packages/@ui"))],
  });
}

main().catch((error) => {
  if (error.code !== "ERR_USE_AFTER_CLOSE") {
    console.error(error.message);
    process.exitCode = 1;
  }
});
