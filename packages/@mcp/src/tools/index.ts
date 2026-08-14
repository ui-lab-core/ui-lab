import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { getComponentTool } from './components.js';
import { searchGuidesTool } from './guides.js';
import { searchWorkshopTool } from './workshop.js';

export const tools: Tool[] = [
  getComponentTool,
  searchGuidesTool,
  searchWorkshopTool,
];
