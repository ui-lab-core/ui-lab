import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";
import type { Metadata } from "next";
import ClientPage from "./client";

export const metadata: Metadata = {
  title: "Config | UI Lab",
  description: "Configure your UI Lab theme",
};

function readTypographyCss(): string {
  const require = createRequire(import.meta.url);
  try {
    return readFileSync(
      require.resolve("ui-lab-components/typography.css"),
      "utf8",
    );
  } catch {
    return readFileSync(
      path.join(
        process.cwd(),
        "../../packages/@ui/src/typography.css",
      ),
      "utf8",
    );
  }
}

export default function Page() {
  return <ClientPage baseTypographyCss={readTypographyCss()} />;
}
