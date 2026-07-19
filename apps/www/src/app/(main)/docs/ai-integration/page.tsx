import Link from "next/link";
import type { Metadata } from "next";

import { DocumentationHeader } from "@/features/docs/components/documentation-header";
import { generateMetadata as buildMetadata } from "@/shared/lib/metadata";

export const metadata: Metadata = buildMetadata({
  pathname: "/docs/ai-integration",
  title: "AI integration",
  description: "Use the UI Lab MCP server to give AI tools current component and design-system context.",
});

export default function AIIntegrationPage() {
  return (
    <main className="mx-auto w-full max-w-3xl px-6 py-16 text-foreground-100">
      <DocumentationHeader
        title="AI integration"
        description="Give AI tools current UI Lab APIs and design guidance through the MCP server."
      />

      <section className="mb-16">
        <h2 className="mb-4 text-2xl font-bold text-foreground-50">Use the MCP server</h2>
        <p className="mb-4 text-foreground-300">
          UI Lab does not ship a general-purpose CLI or an LLMs.txt file. Connect the
          <code> ui-lab-mcp </code> server instead, so an AI client can query the current
          component APIs, examples, design tokens, patterns, and sections.
        </p>
        <pre className="overflow-x-auto rounded border border-background-700 bg-background-900 p-4 text-sm text-foreground-300"><code>{`{
  "mcpServers": {
    "ui-lab": {
      "command": "npx",
      "args": ["ui-lab-mcp"]
    }
  }
}`}</code></pre>
        <p className="mt-4 text-foreground-300">
          See the <Link className="underline" href="/docs/agents-mcps-installation">MCP installation guide</Link> for
          Claude Desktop, Cursor, local installation, and source-development setup.
        </p>
      </section>

      <section className="mb-16">
        <h2 className="mb-4 text-2xl font-bold text-foreground-50">Generate accurate code</h2>
        <p className="text-foreground-300">
          Ask the agent to look up a component before it writes code. The server can return its
          public API and examples, avoiding invented props or obsolete compound-component names.
        </p>
        <pre className="mt-4 overflow-x-auto rounded border border-background-700 bg-background-900 p-4 text-sm text-foreground-300"><code>{`Find the UI Lab Card API, then build a sign-up form using Card.Header,
Card.Body, Card.Footer, Input, and Button. Use the current token guidance.`}</code></pre>
      </section>

      <section>
        <h2 className="mb-4 text-2xl font-bold text-foreground-50">Keep the app setup current</h2>
        <p className="text-foreground-300">
          Install <code>ui-lab-components</code>, own the token layer in your application, and
          import <code>ui-lab-components/styles.css</code> after that token layer. The
          installation guide explains the required stylesheet order.
        </p>
        <p className="mt-4 text-foreground-300">
          <Link className="underline" href="/docs/installation">Read the installation guide</Link>
          {" · "}
          <Link className="underline" href="/docs/agents-mcps-workflows">Explore MCP workflows</Link>
        </p>
      </section>
    </main>
  );
}
