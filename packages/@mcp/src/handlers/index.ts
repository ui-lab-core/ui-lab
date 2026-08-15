import { handleGetComponent } from "./components.js";
import { handleSearchGuides } from "./guides.js";
import { handleSearchWorkshop } from "./workshop.js";

export async function handleTool(
  toolName: string,
  toolInput: Record<string, unknown>,
): Promise<unknown> {
  switch (toolName) {
    case "get_component":
      return handleGetComponent(toolInput as never);
    case "search_guides":
      return handleSearchGuides(toolInput as never);
    case "search_workshop":
      return handleSearchWorkshop(toolInput as never);
    default:
      throw new Error(`Unknown tool: ${toolName}`);
  }
}
