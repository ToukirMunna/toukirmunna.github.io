@echo off
cd /d "%~dp0"

:: 1. Free up port 8000 if an existing server is running
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :8000 ^| findstr LISTENING') do (
    taskkill /F /PID %%a >nul 2>&1
)

:: 2. Start Python server headless in background (no console window)
start "" pythonw server.py

:: 3. Brief pause
ping 127.0.0.1 -n 2 >nul

:: 4. Open Google Chrome directly (or default browser fallback)
if exist "C:\Program Files\Google\Chrome\Application\chrome.exe" (
    start "" "C:\Program Files\Google\Chrome\Application\chrome.exe" http://localhost:8000
) else if exist "C:\Program Files (x86)\Google\Chrome\Application\chrome.exe" (
    start "" "C:\Program Files (x86)\Google\Chrome\Application\chrome.exe" http://localhost:8000
) else (
    start http://localhost:8000
)

:: 5. Dismiss CMD window immediately
exit
