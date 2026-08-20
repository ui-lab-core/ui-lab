import { createHash } from "node:crypto";

export function integrity(content: string): string {
  return `sha256-${createHash("sha256").update(content).digest("base64")}`;
}
