import { encodeInitConfig, type UiLabInitConfig } from "ui-lab-registry/init-config";

export async function createInitCommand(config: UiLabInitConfig): Promise<string> {
  return `npx ui-lab-cli init --config ${await encodeInitConfig(config)}`;
}
