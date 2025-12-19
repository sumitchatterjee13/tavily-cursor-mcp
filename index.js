#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

// Tavily API client
class TavilyClient {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.baseUrl = "https://api.tavily.com";
  }

  async search(params) {
    const response = await fetch(`${this.baseUrl}/search`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        api_key: this.apiKey,
        ...params,
      }),
    });

    if (!response.ok) {
      throw new Error(`Tavily API error: ${response.statusText}`);
    }

    return await response.json();
  }

  async extract(params) {
    const response = await fetch(`${this.baseUrl}/extract`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        api_key: this.apiKey,
        ...params,
      }),
    });

    if (!response.ok) {
      throw new Error(`Tavily API error: ${response.statusText}`);
    }

    return await response.json();
  }
}

const TAVILY_API_KEY = process.env.TAVILY_API_KEY;
if (!TAVILY_API_KEY) {
  console.error("Error: TAVILY_API_KEY environment variable is required");
  process.exit(1);
}

const tavilyClient = new TavilyClient(TAVILY_API_KEY);

// Create MCP server
const server = new Server(
  {
    name: "tavily-cursor-mcp",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Tool definitions with underscores
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "tavily_search",
        description:
          "Search the web using Tavily API. Returns relevant search results with URLs, content snippets, and metadata.",
        inputSchema: {
          type: "object",
          properties: {
            query: {
              type: "string",
              description: "The search query",
            },
            search_depth: {
              type: "string",
              enum: ["basic", "advanced"],
              description: "Search depth - 'basic' for faster results, 'advanced' for more thorough search",
              default: "basic",
            },
            topic: {
              type: "string",
              enum: ["general", "news"],
              description: "Search topic type",
              default: "general",
            },
            days: {
              type: "number",
              description: "Number of days back to search (for news topic)",
              default: 3,
            },
            max_results: {
              type: "number",
              description: "Maximum number of results to return",
              default: 5,
              minimum: 1,
              maximum: 20,
            },
            include_images: {
              type: "boolean",
              description: "Include images in results",
              default: false,
            },
            include_answer: {
              type: "boolean",
              description: "Include AI-generated answer",
              default: false,
            },
            include_raw_content: {
              type: "boolean",
              description: "Include raw HTML content",
              default: false,
            },
          },
          required: ["query"],
        },
      },
      {
        name: "tavily_extract",
        description:
          "Extract clean content from one or more URLs. Returns the main content from web pages, removing ads and navigation.",
        inputSchema: {
          type: "object",
          properties: {
            urls: {
              type: "array",
              items: {
                type: "string",
              },
              description: "Array of URLs to extract content from",
            },
          },
          required: ["urls"],
        },
      },
      {
        name: "tavily_search_qna",
        description:
          "Get a direct answer to a question using Tavily's Q&A optimized search. Returns a concise answer to specific questions.",
        inputSchema: {
          type: "object",
          properties: {
            query: {
              type: "string",
              description: "The question to answer",
            },
            search_depth: {
              type: "string",
              enum: ["basic", "advanced"],
              description: "Search depth",
              default: "basic",
            },
          },
          required: ["query"],
        },
      },
      {
        name: "tavily_search_context",
        description:
          "Generate context for RAG applications. Returns search results optimized for context generation.",
        inputSchema: {
          type: "object",
          properties: {
            query: {
              type: "string",
              description: "The search query",
            },
            search_depth: {
              type: "string",
              enum: ["basic", "advanced"],
              description: "Search depth",
              default: "basic",
            },
            max_results: {
              type: "number",
              description: "Maximum number of results",
              default: 5,
            },
          },
          required: ["query"],
        },
      },
    ],
  };
});

// Tool execution
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case "tavily_search": {
        const result = await tavilyClient.search({
          query: args.query,
          search_depth: args.search_depth || "basic",
          topic: args.topic || "general",
          days: args.days || 3,
          max_results: args.max_results || 5,
          include_images: args.include_images || false,
          include_answer: args.include_answer || false,
          include_raw_content: args.include_raw_content || false,
        });

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case "tavily_extract": {
        const result = await tavilyClient.extract({
          urls: args.urls,
        });

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case "tavily_search_qna": {
        const result = await tavilyClient.search({
          query: args.query,
          search_depth: args.search_depth || "basic",
          include_answer: true,
        });

        return {
          content: [
            {
              type: "text",
              text: result.answer || JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case "tavily_search_context": {
        const result = await tavilyClient.search({
          query: args.query,
          search_depth: args.search_depth || "basic",
          max_results: args.max_results || 5,
          include_raw_content: true,
        });

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error) {
    return {
      content: [
        {
          type: "text",
          text: `Error: ${error.message}`,
        },
      ],
      isError: true,
    };
  }
});

// Start server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Tavily Cursor MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
