# Tavily Cursor MCP Server

A custom Tavily MCP server with **underscore-named tools** for Cursor compatibility.

## Why This Exists

The official Tavily MCP server uses hyphenated tool names (`tavily-search`, `tavily-extract`) which Cursor's CallMcpTool interface doesn't properly recognize. This custom server uses underscore naming (`tavily_search`, `tavily_extract`) to work seamlessly with Cursor.

## Features

- ✅ **tavily_search** - Web search with Tavily API
- ✅ **tavily_extract** - Extract clean content from URLs
- ✅ **tavily_search_qna** - Direct question answering
- ✅ **tavily_search_context** - Generate context for RAG applications

## Installation

### Option 1: Local Installation (Recommended)

1. **Clone or download this directory to your local machine**

2. **Install dependencies:**
   ```bash
   cd tavily-cursor-mcp
   npm install
   ```

3. **Make the script executable (Mac/Linux):**
   ```bash
   chmod +x index.js
   ```

4. **Add to your Cursor `mcp.json`:**
   ```json
   {
     "mcpServers": {
       "tavily_cursor": {
         "command": "node",
         "args": ["/absolute/path/to/tavily-cursor-mcp/index.js"],
         "env": {
           "TAVILY_API_KEY": "your-tavily-api-key-here"
         }
       }
     }
   }
   ```

   **Important:** Replace `/absolute/path/to/tavily-cursor-mcp/` with the actual full path to this directory.

### Option 2: NPM Global Installation

1. **Install globally:**
   ```bash
   cd tavily-cursor-mcp
   npm install -g .
   ```

2. **Add to your Cursor `mcp.json`:**
   ```json
   {
     "mcpServers": {
       "tavily_cursor": {
         "command": "tavily-cursor-mcp",
         "env": {
           "TAVILY_API_KEY": "your-tavily-api-key-here"
         }
       }
     }
   }
   ```

## Configuration

### Cursor MCP Configuration Location

- **Windows:** `%APPDATA%\Cursor\User\globalStorage\mcp.json`
- **Mac:** `~/.cursor/mcp.json` or workspace `.cursor/mcp.json`
- **Linux:** `~/.cursor/mcp.json` or workspace `.cursor/mcp.json`

### Get Your Tavily API Key

1. Go to https://tavily.com
2. Sign up or log in
3. Get your API key from the dashboard
4. Replace `your-tavily-api-key-here` in the config with your actual key

## Usage in Cursor

After installation and configuration, restart Cursor completely. Then use in Agent mode:

```
Use tavily_search to find the latest AI developments
```

```
Use tavily_extract to get the content from https://example.com
```

```
Use tavily_search_qna to answer: What is the capital of France?
```

## Available Tools

### tavily_search

Search the web using Tavily API.

**Parameters:**
- `query` (required): Search query
- `search_depth`: "basic" or "advanced" (default: "basic")
- `topic`: "general" or "news" (default: "general")
- `days`: Number of days back for news search (default: 3)
- `max_results`: Max results to return (default: 5, max: 20)
- `include_images`: Include images (default: false)
- `include_answer`: Include AI-generated answer (default: false)
- `include_raw_content`: Include raw HTML (default: false)

### tavily_extract

Extract clean content from URLs.

**Parameters:**
- `urls` (required): Array of URLs to extract from

### tavily_search_qna

Get direct answers to questions.

**Parameters:**
- `query` (required): The question to answer
- `search_depth`: "basic" or "advanced" (default: "basic")

### tavily_search_context

Generate context for RAG applications.

**Parameters:**
- `query` (required): Search query
- `search_depth`: "basic" or "advanced" (default: "basic")
- `max_results`: Max results (default: 5)

## Troubleshooting

### Tools not showing up in Cursor

1. Make sure you've **completely quit and restarted Cursor** (not just closed the window)
2. Verify the path in `mcp.json` is correct and absolute
3. Check that Node.js is installed: `node --version` (should be >= 18.0.0)
4. Verify your Tavily API key is correct

### "TAVILY_API_KEY environment variable is required" error

Make sure your API key is set in the `env` section of your `mcp.json` configuration.

### Tools discovered but not usable

This was the original problem! This server fixes it by using underscores instead of hyphens in tool names.

## Testing

You can test the server directly:

```bash
TAVILY_API_KEY=your-key-here node index.js
```

Then use the MCP Inspector or send MCP protocol messages via stdin.

## License

MIT
