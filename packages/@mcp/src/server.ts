import YAML from "yaml";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ErrorCode,
  ListToolsRequestSchema,
  McpError,
} from "@modelcontextprotocol/sdk/types.js";
import { handleTool } from "./handlers/index.js";
import { tools } from "./tools/index.js";
import { packageVersion } from "./version.js";

const INSTRUCTIONS = [
  "UI Lab is a React component library. Use these tools instead of guessing component APIs or inventing markup.",
  "",
  "Recommended order:",
  '1. `search_guides { query: "foundation", detail: "full" }` once per design or review task, for the composition, token, responsive, and accessibility rules.',
  "2. `get_component {}` to list component ids, then `get_component { query: \"component:<id>\", detail: \"api\" }` for the props you are about to write.",
  "3. `search_workshop` only to answer how an item is installed or whether its source is copyable.",
  "",
  "Import components from their own subpath, `ui-lab-components/<componentId>`, not from the `ui-lab-components` barrel. Every component response carries the exact statement to write in its `import` field; copy it rather than composing one.",
  "",
  "Workshop references are category-aware: `pattern:<id>`, `element:<packageId>/<id>`, `section:<id>`, and `starter:<id>`. Component, example, artifact, and guide refs remain compatible. Pass emitted refs back verbatim.",
  'Every response is one envelope with a `status` of "exact", "matches", "list", or "not_found", plus a `nextSteps` list of concrete follow-up calls. A miss is a normal result, not an error, so read `suggestions` rather than retrying blind.',
].join("\n");

async function createServer(): Promise<McpServer> {
  const mcp = new McpServer(
    { name: "ui-lab", version: packageVersion() },
    { capabilities: { tools: {} }, instructions: INSTRUCTIONS },
  );

  mcp.server.setRequestHandler(ListToolsRequestSchema, async () => ({ tools }));

  mcp.server.setRequestHandler(
    CallToolRequestSchema,
    async (request: { params: { name: string; arguments?: Record<string, unknown> } }) => {
      const { name, arguments: args = {} } = request.params;

      try {
        const result = await handleTool(name, args);
        return {
          // YAML for clients that only read text; structuredContent for clients
          // that can parse. Both carry the same envelope.
          content: [{ type: "text", text: YAML.stringify(result) }],
          structuredContent: result as unknown as Record<string, unknown>,
        };
      } catch (error) {
        // A "no match" is returned as a result, never thrown, so anything that
        // reaches here is a genuine server failure.
        if (error instanceof McpError) throw error;
        const message = error instanceof Error ? error.message : "Unknown error";
        throw new McpError(ErrorCode.InternalError, `${name} failed: ${message}`);
      }
    },
  );

  return mcp;
}

export async function startServer(): Promise<void> {
  const server = await createServer();
  await server.connect(new StdioServerTransport());

  console.error(`[UI Lab MCP] v${packageVersion()} started (command: ui-lab-mcp)`);
}
