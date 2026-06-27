@echo off
cd /d "%~dp0client"
"C:\Users\Subham Pradhan\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe" node_modules\vite\bin\vite.js --host 127.0.0.1 --port 5173 > ..\client.log 2> ..\client.err
