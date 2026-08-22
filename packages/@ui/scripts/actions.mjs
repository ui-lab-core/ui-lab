#!/usr/bin/env node

import { createInterface } from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import path from "node:path";

const packageRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const colors = process.stdout.isTTY
  ? { cyan: "\u001b[36m", dim: "\u001b[2m", green: "\u001b[32m", red: "\u001b[31m", reset: "\u001b[0m", bold: "\u001b[1m" }
  : Object.fromEntries(["cyan", "dim", "green", "red", "reset", "bold"].map((key) => [key, ""]));

const tasks = {
  build: { label: "Build package", command: "build" },
  "type-check": { label: "Type-check package", command: "type-check" },
  test: { label: "Run package tests", command: "test:run" },
  coverage: { label: "Run tests with coverage", command: "test:coverage" },
  clean: { label: "Clean build output", command: "clean" },
};

function printHeader() {
  console.log(`\n${colors.cyan}${colors.bold} UI LAB COMPONENTS ${colors.reset}${colors.dim}· package CLI${colors.reset}\n`);
}

function printHelp() {
  printHeader();
  console.log(`${colors.bold}Usage${colors.reset}`);
  console.log("  pnpm ui <task...>");
  console.log("  pnpm ui rebuild [task...]");
  console.log("  pnpm ui");
  console.log(`\n${colors.bold}Tasks${colors.reset}`);
  for (const [name, task] of Object.entries(tasks)) console.log(`  ${name.padEnd(10)} ${task.label}`);
  console.log("\n  rebuild    Run selected tasks, then rebuild the package");
  console.log("  help       Show this help");
}

function runCommand(name) {
  return new Promise((resolve, reject) => {
    const child = spawn("pnpm", [name], { cwd: packageRoot, stdio: "inherit" });
    child.on("error", reject);
    child.on("exit", (code, signal) => {
      if (code === 0) resolve();
      else reject(new Error(`${name} ${signal ? `(${signal})` : `exited with code ${code}`}`));
    });
  });
}

async function runTasks(names) {
  for (const name of names) {
    if (!tasks[name]) throw new Error(`Unknown task "${name}". Run "pnpm ui help" for options.`);
    console.log(`\n${colors.cyan}◆${colors.reset} ${tasks[name].label}`);
    await runCommand(tasks[name].command);
  }
}

async function chooseTasks() {
  const rl = createInterface({ input, output });
  console.log(`${colors.bold}Quick actions${colors.reset}`);
  console.log("  1  Build package");
  console.log("  2  Type-check package");
  console.log("  3  Run tests");
  console.log("  4  Run tests with coverage");
  console.log("  5  Type-check and build");
  const answer = (await rl.question("\nChoose an action [1-5, q]: ")).trim().toLowerCase();
  rl.close();
  return { "1": ["build"], "2": ["type-check"], "3": ["test"], "4": ["coverage"], "5": ["type-check", "build"] }[answer] ?? [];
}

async function main() {
  const args = process.argv.slice(2);
  if (args.includes("help") || args.includes("--help") || args.includes("-h")) return printHelp();

  let names = args;
  if (args[0] === "rebuild") names = args.slice(1).concat("build");
  if (names.length === 0) names = await chooseTasks();
  if (names.length === 0) return;

  printHeader();
  try {
    await runTasks(names);
    console.log(`\n${colors.green}✓ Done${colors.reset}`);
  } catch (error) {
    console.error(`\n${colors.red}✗ Stopped${colors.reset}: ${error.message}`);
    process.exitCode = 1;
  }
}

main();
