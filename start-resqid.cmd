@echo off
cd /d "%~dp0"
start "ResQID API - keep this window open" powershell.exe -NoProfile -ExecutionPolicy Bypass -NoExit -File "%~dp0start-api.ps1"
start "ResQID Website - keep this window open" powershell.exe -NoProfile -ExecutionPolicy Bypass -NoExit -File "%~dp0start-client.ps1"
echo ResQID is starting.
echo Local:   http://127.0.0.1:5173
echo Network: http://172.18.55.222:5173
pause
