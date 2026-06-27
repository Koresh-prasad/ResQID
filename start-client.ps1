Set-Location -LiteralPath (Join-Path $PSScriptRoot "client")
& "C:\Users\Subham Pradhan\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe" "node_modules/vite/bin/vite.js" "--host" "0.0.0.0" "--port" "5173" *> "..\client.log"
