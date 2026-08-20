#!/usr/bin/env node

/**
 * UI Lab MCP Server
 * Entry point for the MCP server
 */

import { startServer } from "./server.js";

/**
 * Start the server and handle errors
 */
startServer().catch((error) => {
  console.error("[UI Lab MCP] Fatal error:", error);
  console.error("[UI Lab MCP] The MCP command is ui-lab-mcp; ui-lab is owned by @ui-lab/cli.");
  process.exit(1);
});
