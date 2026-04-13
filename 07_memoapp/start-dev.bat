@echo off
cd /d "%~dp0"
echo Starting dev server... http://localhost:3000
echo Press Ctrl+C to stop.
echo.
npm start
if errorlevel 1 pause
