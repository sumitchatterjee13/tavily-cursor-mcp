# Tavily Cursor MCP Server - Complete Setup Guide

## What This Solves

The official Tavily MCP server uses tool names with hyphens (`tavily-search`), but Cursor's CallMcpTool interface expects underscores (`tavily_search`). This custom server fixes that incompatibility.

## Quick Start (5 minutes)

### Step 1: Extract the Files

Download and extract the `tavily-cursor-mcp` folder to a location on your computer.

**Recommended locations:**
- **Windows:** `C:\Users\YourName\mcp-servers\tavily-cursor-mcp`
- **Mac/Linux:** `~/mcp-servers/tavily-cursor-mcp`

### Step 2: Run Setup Script

**Windows:**
```cmd
cd path\to\tavily-cursor-mcp
setup.bat
```

**Mac/Linux:**
```bash
cd path/to/tavily-cursor-mcp
chmod +x setup.sh
./setup.sh
```

The setup script will:
1. Install dependencies (`npm install`)
2. Show you the exact configuration to add to Cursor

### Step 3: Add to Cursor Configuration

1. **Open Cursor Settings:**
   - Go to `Settings > Tools & Integrations > MCP Servers`
   - Click `+ Add New MCP Server`

2. **Add the configuration:**

   **Windows example:**
   ```json
   {
     "mcpServers": {
       "tavily_cursor": {
         "command": "node",
         "args": ["C:\\Users\\YourName\\mcp-servers\\tavily-cursor-mcp\\index.js"],
         "env": {
           "TAVILY_API_KEY": "your-tavily-api-key-here"
         }
       }
     }
   }
   ```

   **Mac/Linux example:**
   ```json
   {
     "mcpServers": {
       "tavily_cursor": {
         "command": "node",
         "args": ["/Users/yourname/mcp-servers/tavily-cursor-mcp/index.js"],
         "env": {
           "TAVILY_API_KEY": "your-tavily-api-key-here"
         }
       }
     }
   }
   ```

   **⚠️ Important:** Use the **full absolute path** to your `index.js` file!

### Step 4: Restart Cursor

**Completely quit Cursor** (not just close the window) and restart it.

### Step 5: Test It!

Open Cursor in **Agent mode** and try:

```
Use tavily_search to find the latest developments in AI
```

You should see the tool being called successfully!

## Available Tools (All with underscores!)

### 1. tavily_search
Search the web with Tavily API.

**Example prompts:**
- `Use tavily_search to find recent news about OpenAI`
- `Search for Python best practices using tavily_search`
- `Use tavily_search with advanced depth to research quantum computing`

### 2. tavily_extract
Extract clean content from URLs (like tavily-extract but works in Cursor!)

**Example prompts:**
- `Use tavily_extract to get content from https://example.com/article`
- `Extract the main content from these URLs using tavily_extract: [url1, url2]`

### 3. tavily_search_qna
Get direct answers to questions.

**Example prompts:**
- `Use tavily_search_qna to answer: What is the Eiffel Tower's height?`
- `Get a direct answer using tavily_search_qna: Who won the 2024 Nobel Prize?`

### 4. tavily_search_context
Generate context for RAG applications.

**Example prompts:**
- `Use tavily_search_context to gather information about machine learning`
- `Generate context for RAG using tavily_search_context about climate change`

## Troubleshooting

### ❌ Tools not appearing in Cursor

**Solution:**
1. Verify Node.js is installed: `node --version` (need v18+)
2. Check the path in `mcp.json` is absolute and correct
3. Completely quit Cursor (Command+Q on Mac, close all windows on Windows)
4. Restart Cursor
5. Check if the server shows as enabled in `Settings > MCP Servers`

### ❌ "TAVILY_API_KEY environment variable is required"

**Solution:**
- Make sure your API key is in the `env` section of your config
- Verify there are no extra spaces or quotes around the API key

### ❌ "Module not found" or "Cannot find package"

**Solution:**
```bash
cd tavily-cursor-mcp
npm install
```

### ❌ Path issues on Windows

**Solution:**
- Use double backslashes: `C:\\Users\\...` 
- Or use forward slashes: `C:/Users/...`
- Make sure the path has NO spaces in folder names

### ❌ Tools discovered but agent says "tool not found"

This was the **original problem** this server fixes! Make sure:
1. You're using THIS custom server (not the official tavily-mcp)
2. The tools show with underscores in Cursor settings
3. You're in Agent mode when testing

## Verifying Installation

### Check 1: Server Configuration
In Cursor Settings > MCP Servers, you should see:
- Server name: `tavily_cursor`
- Status: Green/enabled
- Tools showing: `tavily_search`, `tavily_extract`, etc. (with underscores!)

### Check 2: Tools List
In Agent mode, ask: `What tools do you have access to?`

You should see:
- `tavily_search`
- `tavily_extract`
- `tavily_search_qna`
- `tavily_search_context`

### Check 3: Actual Usage
Try: `Use tavily_search to find the latest news about AI`

The agent should successfully call the tool and return results!

## Comparison with Official Server

| Feature | Official tavily-mcp | This Custom Server |
|---------|-------------------|-------------------|
| Tool Names | `tavily-search` (hyphens) | `tavily_search` (underscores) |
| Cursor Compatibility | ❌ Broken | ✅ Works! |
| Claude Desktop | ✅ Works | ✅ Works |
| Features | All 4 tools | All 4 tools |
| Installation | NPM package | Local directory |

## Need Help?

1. **Check the logs:**
   - The server prints errors to Cursor's console
   - Look for startup messages

2. **Test the server directly:**
   ```bash
   cd tavily-cursor-mcp
   TAVILY_API_KEY=your-key node index.js
   ```
   Should print: "Tavily Cursor MCP Server running on stdio"

3. **Verify dependencies:**
   ```bash
   cd tavily-cursor-mcp
   npm list
   ```
   Should show `@modelcontextprotocol/sdk` installed

## Updating Your Configuration

If you already have other MCP servers, merge them:

```json
{
  "mcpServers": {
    "tavily_cursor": {
      "command": "node",
      "args": ["/absolute/path/to/tavily-cursor-mcp/index.js"],
      "env": {
        "TAVILY_API_KEY": "your-key-here"
      }
    },
    "brave-search": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-brave-search"],
      "env": {
        "BRAVE_API_KEY": "your-brave-key"
      }
    }
    // ... other servers
  }
}
```

## Success! 🎉

Once everything is working, you'll have access to all Tavily's powerful tools:
- **Web search** with customizable depth and filters
- **URL extraction** for clean content
- **Direct Q&A** for quick answers
- **Context generation** for RAG applications

All with proper Cursor compatibility using underscore-named tools!
