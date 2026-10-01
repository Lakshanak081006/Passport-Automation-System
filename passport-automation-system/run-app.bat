@echo off
title Passport Automation System Launcher
echo ========================================================
echo         Passport Automation System Launcher
echo ========================================================
echo.
echo [1/2] Starting Backend (Spring Boot)...
start "Passport Backend (Port 8080)" cmd /k "cd /d "%~dp0backend" && gradlew.bat bootRun"

echo [2/2] Starting Frontend (React + Vite)...
start "Passport Frontend (Port 5173)" cmd /k "cd /d "%~dp0frontend" && npm run dev"

echo.
echo ========================================================
echo Application launcher triggered successfully!
echo Backend API:  http://localhost:8080
echo Frontend Web: http://localhost:5173
echo ========================================================
echo.
echo (Keep the opened command windows running while using the app)
pause
