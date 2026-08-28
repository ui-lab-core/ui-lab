#!/usr/bin/env node

import { emitKeypressEvents } from "node:readline";
import { spawn } from "node:child_process";
import { stdin as input, stdout as output } from "node:process";
import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const colors = process.stdout.isTTY
  ? { cyan: "\u001b[36m", dim: "\u001b[2m", green: "\u001b[32m", red: "\u001b[31m", reset: "\u001b[0m", bold: "\u001b[1m" }
  : Object.fromEntries(["cyan", "dim", "green", "red", "reset", "bold"].map((key) => [key, ""]));
const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function usage() {
  console.log("Usage: node scripts/actions.mjs --package <path> [action...]");
}

function runCommand(packageRoot, name) {
  return new Promise((resolve, reject) => {
    const child = spawn("pnpm", [name], { cwd: packageRoot, stdio: "inherit" });
    child.on("error", reject);
    child.on("exit", (code, signal) => {
      if (code === 0) resolve();
      else reject(new Error(`${name} ${signal ? `(${signal})` : `exited with code ${code}`}`));
    });
  });
}

async function getProjects(defaultRoot) {
  const packageDirectory = path.join(projectRoot, "packages");
  const entries = await readdir(packageDirectory, { withFileTypes: true });
  const roots = await Promise.all(entries.filter((entry) => entry.isDirectory()).map(async (entry) => {
    const root = path.join(packageDirectory, entry.name);
    try {
      const manifest = JSON.parse(await readFile(path.join(root, "package.json"), "utf8"));
      return { root, manifest };
    } catch {
      return null;
    }
  }));
  const projects = roots.filter(Boolean);
  if (!projects.some((project) => project.root === defaultRoot)) {
    projects.unshift({ root: defaultRoot, manifest: JSON.parse(await readFile(path.join(defaultRoot, "package.json"), "utf8")) });
  }
  return projects;
}

function taskNames(manifest) {
  return Object.keys(manifest.scripts ?? {}).filter((name) => name !== "actions" && name !== "registry");
}

async function chooseAction(defaultRoot) {
  const projects = await getProjects(defaultRoot);
  let projectIndex = Math.max(0, projects.findIndex((project) => project.root === defaultRoot));
  let actionIndex = 0;
  let active = true;

  const render = () => {
    const project = projects[projectIndex];
    const tasks = taskNames(project.manifest);
    actionIndex = Math.min(actionIndex, Math.max(0, tasks.length - 1));
    output.write("\u001Bc");
    output.write(`\n${colors.cyan}${colors.bold}Actions${colors.reset}\n\n`);
    output.write(projects.map((item, index) => index === projectIndex
      ? `${colors.cyan}${colors.bold}[ ${item.manifest.name ?? path.basename(item.root)} ]${colors.reset}`
      : `${colors.dim}  ${item.manifest.name ?? path.basename(item.root)}  ${colors.reset}`).join(" "));
    output.write("\n\n");
    tasks.forEach((name, index) => output.write(index === actionIndex
      ? `${colors.cyan}›${colors.reset} ${colors.bold}${name}${colors.reset}\n`
      : `  ${name}\n`));
    output.write(`\n${colors.dim}j/k navigate · Tab/Shift+Tab switch project · Enter run · q quit${colors.reset}`);
  };

  return new Promise((resolve) => {
    emitKeypressEvents(input);
    input.setRawMode(true);
    input.resume();
    const onKeypress = async (_, key) => {
      if (!active) return;
      const tasks = taskNames(projects[projectIndex].manifest);
      if (key.name === "q" || (key.ctrl && key.name === "c")) {
        active = false;
        input.setRawMode(false);
        input.off("keypress", onKeypress);
        resolve();
      } else if (key.name === "tab") {
        projectIndex = (projectIndex + (key.shift ? -1 : 1) + projects.length) % projects.length;
        actionIndex = 0;
        render();
      } else if (key.name === "j" || key.name === "down") {
        actionIndex = (actionIndex + 1) % tasks.length;
        render();
      } else if (key.name === "k" || key.name === "up") {
        actionIndex = (actionIndex - 1 + tasks.length) % tasks.length;
        render();
      } else if (key.name === "return" && tasks[actionIndex]) {
        input.setRawMode(false);
        output.write("\u001Bc");
        try {
          console.log(`\n${colors.cyan}◆${colors.reset} ${tasks[actionIndex]}`);
          await runCommand(projects[projectIndex].root, tasks[actionIndex]);
          console.log(`\n${colors.green}✓ Done${colors.reset}`);
        } catch (error) {
          console.error(`\n${colors.red}✗ Stopped${colors.reset}: ${error.message}`);
        }
        input.setRawMode(true);
        render();
      }
    };
    input.on("keypress", onKeypress);
    render();
  });
}

export async function runActions({ packageRoot, args = process.argv.slice(2) } = {}) {
  let target = packageRoot;
  const targetIndex = args.indexOf("--package");
  if (targetIndex !== -1) {
    target = path.resolve(args[targetIndex + 1] ?? "");
    args = args.filter((_, index) => index !== targetIndex && index !== targetIndex + 1);
  }
  if (!target) {
    usage();
    process.exitCode = 1;
    return;
  }

  const manifest = JSON.parse(await readFile(path.join(target, "package.json"), "utf8"));
  const tasks = taskNames(manifest);
  const title = manifest.name ?? path.basename(target);
  const help = () => {
    console.log(`\n${colors.cyan}${colors.bold}${title}${colors.reset}${colors.dim} · actions${colors.reset}\n`);
    usage();
    console.log("\nActions");
    for (const name of tasks) console.log(`  ${name}`);
    console.log("\n  rebuild  Run selected actions, then build");
  };

  if (args.includes("help") || args.includes("--help") || args.includes("-h")) return help();

  let names = args[0] === "rebuild" ? [...args.slice(1), "build"] : args;
  if (names.length === 0) {
    if (input.isTTY) return chooseAction(target);
    return;
  }
  if (names.length === 0) return;

  try {
    for (const name of names) {
      if (!tasks.includes(name)) throw new Error(`Unknown action "${name}". Run with help for options.`);
      console.log(`\n${colors.cyan}◆${colors.reset} ${name}`);
      await runCommand(target, name);
    }
    console.log(`\n${colors.green}✓ Done${colors.reset}`);
  } catch (error) {
    console.error(`\n${colors.red}✗ Stopped${colors.reset}: ${error.message}`);
    process.exitCode = 1;
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) runActions();
