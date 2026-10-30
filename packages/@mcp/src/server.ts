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
 * MCP delivers this through initialize.instructions. Some clients prepend it
 * to every tool description instead of delivering it once, so keep it compact
 * and leave ordering, selectors, and ref kinds in the relevant tool schemas.
 */
export const INSTRUCTIONS = [
  "UI Lab: use documented React APIs. Copy returned subpath imports; never the ui-lab-components barrel. Pass refs back verbatim; explicit refs never search.",
  "Responses: indented key/value; tab-separated tables with header and blank-line end. '-' = absent; false flags omitted; zero counts retained; fenced source verbatim. Status: exact/matches/list/not_found; misses are results, not errors.",
].join("\n");

export async function createServer(): Promise<McpServer> {
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
