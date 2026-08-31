import { ErrorCode, McpError } from "@modelcontextprotocol/sdk/types.js";
import type { ToolResponse } from "../response.js";
import { handleGetComponent, type GetComponentInput } from "./components.js";
import { handleSearchGuides, type SearchGuidesInput } from "./guides.js";
import { handleSearchWorkshop, type SearchWorkshopInput } from "./workshop.js";

export async function handleTool(
  toolName: string,
  toolInput: Record<string, unknown>,
): Promise<ToolResponse> {
  switch (toolName) {
    case "get_component":
      return handleGetComponent(toolInput as GetComponentInput);
    case "search_guides":
      return handleSearchGuides(toolInput as SearchGuidesInput);
    case "search_workshop":
      return handleSearchWorkshop(toolInput as SearchWorkshopInput);
    default:
      throw new McpError(
        ErrorCode.MethodNotFound,
        `Unknown tool: ${toolName}. This server exposes get_component, search_guides, and search_workshop.`,
      );
  }
}
