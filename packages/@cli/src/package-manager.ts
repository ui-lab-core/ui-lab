import { spawn } from "node:child_process";
import type { PackageManager, PackageManagerName } from "./types.js";
const INSTALL_TIMEOUT_MS = 120_000;
export function createPackageManager(name: PackageManagerName): PackageManager {
  return {
    name,
    async add(cwd, packages, dryRun, development = false) {
      const args =
        name === "npm"
          ? [
              "install",
              "--no-audit",
              "--no-fund",
              "--prefer-offline",
              "--fetch-retries=1",
              "--fetch-retry-mintimeout=1000",
              "--fetch-retry-maxtimeout=5000",
              ...(development ? ["--save-dev"] : []),
              ...packages,
            ]
          : ["add", ...(development ? ["--save-dev"] : []), ...packages];
      if (dryRun)
        return void console.log(`[dry-run] ${name} ${args.join(" ")}`);
      const command = `${name} ${args.join(" ")}`;
      console.log(`Installing packages with ${command}...`);
      await new Promise<void>((resolve, reject) => {
        let settled = false;
        const child = spawn(name, args, {
          cwd,
          stdio: "inherit",
          shell: process.platform === "win32",
        });
        const timeout = setTimeout(() => {
          if (settled) return;
          settled = true;
          child.kill();
          reject(
            new Error(
              `${command} did not finish within ${INSTALL_TIMEOUT_MS / 1000} seconds. Run it directly to inspect package manager output, then rerun ui-lab init.`,
            ),
          );
        }, INSTALL_TIMEOUT_MS);
        child.once("error", (error) => {
          if (settled) return;
          settled = true;
          clearTimeout(timeout);
          reject(new Error(`Could not run ${name}: ${error.message}`));
        });
        child.once("exit", (code) => {
          if (settled) return;
          settled = true;
          clearTimeout(timeout);
          code === 0
            ? resolve()
            : reject(
                new Error(
                  `${command} exited with ${code ?? "an error"}. Resolve the package-manager error shown above, run ${command} from ${cwd}, then rerun ui-lab init; completed file changes are safe to keep.`,
                ),
              );
        });
      });
      console.log(`Installed packages with ${command}.`);
    },
  };
}
