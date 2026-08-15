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

async function createServer(): Promise<McpServer> {
  const mcp = new McpServer({ name: "ui-lab", version: "0.4.3" }, { capabilities: { tools: {} } });

  mcp.server.setRequestHandler(ListToolsRequestSchema, async () => ({ tools }));

  mcp.server.setRequestHandler(
    CallToolRequestSchema,
    async (request: { params: { name: string; arguments?: Record<string, unknown> } }) => {
      const { name, arguments: args = {} } = request.params;

      try {
        const result = await handleTool(name, args);
        return {
          content: [{ type: "text", text: YAML.stringify(result) }],
        };
      } catch (error) {
        const message = error instanceof Error ? error.message : "Unknown error";
        throw new McpError(ErrorCode.InternalError, message);
      }
    },
  );

  return mcp;
}

export async function startServer(): Promise<void> {
  const server = await createServer();
  await server.connect(new StdioServerTransport());

  console.error("[UI Lab MCP] Server started successfully");
  console.error("[UI Lab MCP] Listening for connections...");
}
