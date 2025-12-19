@echo off
echo Installing Tavily Cursor MCP Server...
echo.

REM Install dependencies
call npm install

REM Get current directory
set CURRENT_DIR=%cd%

echo.
echo Installation complete!
echo.
echo Add this to your Cursor mcp.json:
echo.
echo {
echo   "mcpServers": {
echo     "tavily_cursor": {
echo       "command": "node",
echo       "args": ["%CURRENT_DIR%\\index.js"],
echo       "env": {
echo         "TAVILY_API_KEY": "your-tavily-api-key-here"
echo       }
echo     }
echo   }
echo }
echo.
echo Don't forget to replace "your-tavily-api-key-here" with your actual Tavily API key!
echo.
pause
