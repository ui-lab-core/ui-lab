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
    "Usage: ui-lab <init|add|status|login> [options]\ninit: [--config <id>] [--non-interactive] [--framework <next|vite>] [--stylesheet <path>] [--theme <onyx|none>] [--typography|--no-typography] [--font <work-sans|inter|geist|karla|dm-sans|manrope>] [--color-mode <system|light|dark>] [--next-layout <path|none>] [--vite-html <path|none>] [--theme-stylesheet <path>] [--dry-run]\nA shareable --config ID supplies initialization settings offline. Explicit CLI flags override encoded values.\nadd: ui-lab add <artifact-id> [--target <path>] [--dry-run]",
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
    const framework = option("--framework");
    if (framework && framework !== "next" && framework !== "vite")
      throw new Error("--framework must be next or vite.");
    const theme = option("--theme");
    if (theme && theme !== "onyx" && theme !== "none")
      throw new Error("--theme must be onyx or none.");
    const font = option("--font");
    if (font && !["work-sans", "inter", "geist", "karla", "dm-sans", "manrope"].includes(font))
      throw new Error("--font must be work-sans, inter, geist, karla, dm-sans, or manrope.");
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
      framework: framework as "next" | "vite" | undefined,
      nextLayout: option("--next-layout"),
      viteHtml: option("--vite-html"),
      themeTarget: option("--theme-stylesheet"),
      dryRun,
      nonInteractive:
        has("--config") || has("--non-interactive") || !process.stdin.isTTY || !process.stdout.isTTY,
      config: option("--config"),
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
  const message = error instanceof Error ? error.message : String(error);
  console.error(message);
  if (/\b(?:ETARGET|notarget|No matching version found)\b/i.test(message)) {
    console.error(
      "A requested package version is unavailable. Update or reinstall the UI Lab CLI using https://www.ui-lab.app/docs/installation, then rerun init. The project may be only partially configured.",
    );
  }
  process.exitCode = 1;
});
