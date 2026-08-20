#!/usr/bin/env node
import { loginWithDeviceFlow } from "./auth.js";
import { initialize } from "./init.js";
import { status } from "./status.js";
function option(name: string): string | undefined {
  const index = process.argv.indexOf(name);
  return index >= 0 ? process.argv[index + 1] : undefined;
}
function has(name: string): boolean {
  return process.argv.includes(name);
}
function logo(): void {
  console.log(`⠀⠀⢀⣠⣴⣾⣷⣦⣄⡀⠀⠀
⣴⣾⡿⠟⠋⠁⠉⠛⠿⣿⣷⣦
⣿⣿⠀⠀⠀⠀⠀⠀⠀⠀⣿⣿
⣿⣿⠀⠀⠀⠀⠀⠀⠀⠀⣿⣿
⠻⢿⣿⣶⣤⣀⣀⠀⠀⠻⡿⠟
⠀⠀⠈⠙⠻⢿⡿⠇⠀⠀⠀⠀
`);
}
function help(): void {
  console.log(
    "Usage: ui-lab <init|add|status|login> [options]\ninit: [--non-interactive] [--stylesheet <path>] [--theme <onyx|none>] [--typography|--no-typography] [--font <work-sans|inter|manrope>] [--color-mode <system|light|dark>] [--next-layout <path|none>] [--theme-stylesheet <path>] [--dry-run]\nFor agents and automation, use: ui-lab init --non-interactive\nNon-interactive init detects or completes the Next.js project and defaults to the Onyx theme, Work Sans variable font, typography, system color mode, and detected App Router layout. Explicit options override those defaults.\nadd: ui-lab add <artifact-id> [--target <path>] [--dry-run]",
  );
}
async function main() {
  const [command, id] = process.argv.slice(2);
  const dryRun = has("--dry-run");
  logo();
  if (!command || command === "--help" || command === "-h") return help();
  if (command === "init") {
    if (has("--help") || has("-h")) return help();
    if (has("--typography") && has("--no-typography"))
      throw new Error("Choose either --typography or --no-typography.");
    const theme = option("--theme");
    if (theme && theme !== "onyx" && theme !== "none")
      throw new Error("--theme must be onyx or none.");
    const font = option("--font");
    if (font && font !== "work-sans" && font !== "inter" && font !== "manrope")
      throw new Error("--font must be work-sans, inter, or manrope.");
    const colorMode = option("--color-mode");
    if (
      colorMode &&
      colorMode !== "system" &&
      colorMode !== "light" &&
      colorMode !== "dark"
    )
      throw new Error("--color-mode must be system, light, or dark.");
    return initialize({
      stylesheet: option("--stylesheet"),
      theme: theme as "onyx" | "none" | undefined,
      typography: has("--typography")
        ? true
        : has("--no-typography")
          ? false
          : undefined,
      colorMode: colorMode as "system" | "light" | "dark" | undefined,
      font: font as "work-sans" | "inter" | "manrope" | undefined,
      nextLayout: option("--next-layout"),
      themeTarget: option("--theme-stylesheet"),
      dryRun,
      nonInteractive:
        has("--non-interactive") || !process.stdin.isTTY || !process.stdout.isTTY,
    });
  }
  if (command === "add") {
    if (!id) throw new Error("Usage: ui-lab add <artifact-id>");
    const { addArtifact } = await import("./install.js");
    return addArtifact({ id, target: option("--target"), dryRun });
  }
  if (command === "status")
    return console.log(JSON.stringify(status(), null, 2));
  if (command === "login") return loginWithDeviceFlow();
  throw new Error(`Unknown command: ${command}`);
}
main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
