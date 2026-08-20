import { chmod, mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import type { EntitlementClient } from "./types.js";
export interface CredentialStore {
  save(service: string, token: string): Promise<void>;
  read(service: string): Promise<string | undefined>;
}
/** Provider adapters should use an OS credential store. This owner-only file is the documented fallback. */
export function createSecureFallbackCredentialStore(
  file = join(
    process.env.XDG_CONFIG_HOME ?? join(process.env.HOME ?? ".", ".config"),
    "ui-lab",
    "credentials.json",
  ),
): CredentialStore {
  return {
    async save(service, token) {
      await mkdir(dirname(file), { recursive: true, mode: 0o700 });
      let values: Record<string, string> = {};
      try {
        values = JSON.parse(await readFile(file, "utf8"));
      } catch {}
      values[service] = token;
      await writeFile(file, JSON.stringify(values), { mode: 0o600 });
      await chmod(file, 0o600);
    },
    async read(service) {
      try {
        return (
          JSON.parse(await readFile(file, "utf8")) as Record<string, string>
        )[service];
      } catch {
        return undefined;
      }
    },
  };
}
export async function loginWithDeviceFlow(): Promise<void> {
  throw new Error(
    "Premium authentication is not configured. Set up an entitlement provider with a device-flow endpoint before using ui-lab login.",
  );
}
export function unconfiguredEntitlementClient(): EntitlementClient {
  return {
    async getArtifact() {
      throw new Error(
        "Premium delivery is not configured. Configure an entitlement service before adding premium artifacts.",
      );
    },
  };
}
