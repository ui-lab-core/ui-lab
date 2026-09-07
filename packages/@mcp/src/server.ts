import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ErrorCode,
  ListToolsRequestSchema,
  McpError,
} from "@modelcontextprotocol/sdk/types.js";
import { encode } from "./encode.js";
import { handleTool } from "./handlers/index.js";
import { tools } from "./tools/index.js";
import { packageVersion } from "./version.js";

/**
 * Everything shared across tools lives here, once. Tool descriptions and this
 * block are re-sent on every request in a session, so a rule repeated in three
 * descriptions and again in every response body was being paid for repeatedly;
 * a rule stated here is paid for once.
 */
const INSTRUCTIONS = [
  "UI Lab is a React component library. Use these tools instead of guessing component APIs or inventing markup.",
  "",
  'Order: `search_guides { query: "foundation", detail: "full" }` once per design or review task; `get_component {}` to list ids, then `get_component { query: "component:<id>", detail: "api" }` for the props you are about to write; `search_workshop` only for install and source questions.',
  "",
  "Import a component from its own subpath — `import { Button } from 'ui-lab-components/button'` — never from the `ui-lab-components` barrel, which resolves but pulls the whole library into the module graph. Every component response carries the exact statement in `import`; copy it rather than composing one.",
  "",
  "Refs: `component:<id>` | `example:<componentId>/<exampleId>` | `pattern:<id>` | `element:<packageId>/<id>` | `section:<id>` | `starter:<id>` | `artifact:<id>` | `guide:<id>`. Every response emits the ref of everything it returns; pass one back verbatim to fetch that item exactly.",
  "",
  'Responses are indented `key: value` text. `status` is "exact", "matches", "list", or "not_found"; a miss is a normal result carrying `suggestions` and `nextSteps`, not an error. A `key:` line followed by tab-separated lines is a table: the first of those lines names the columns, one row follows per item, and a blank line ends it. `-` marks an absent cell, a boolean field appears only when it is true, and fenced blocks hold source verbatim.',
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
        // One body, not two. Declaring an output schema obliges the server to
        // send `structuredContent` alongside this text, and a client that reads
        // both pays for the same envelope twice.
        return { content: [{ type: "text", text: encode(result) }] };
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
