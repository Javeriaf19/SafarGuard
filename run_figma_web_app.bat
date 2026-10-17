@echo off
title SafarGuard - Figma React Web App
echo ========================================================
echo   SafarGuard (Hacktoberfest Hack Day Lahore 2026)
echo   Launching Figma React Web App on http://localhost:5173
echo ========================================================
cd /d "%~dp0figma_export"

echo Opening http://localhost:5173 in your default browser...
start http://localhost:5173

echo Starting Vite Preview server...
call "C:\Program Files\nodejs\npm.cmd" run preview -- --port 5173
pause
