@echo off
cd /d "%~dp0"
"C:\Users\Subham Pradhan\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe" server\src\server.js > server.log 2> server.err
