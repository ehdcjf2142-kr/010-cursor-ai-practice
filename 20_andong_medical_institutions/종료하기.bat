@echo off
setlocal

echo Stopping Andong medical server...

taskkill /FI "WINDOWTITLE eq ANDONG_MEDICAL_SERVER*" /T /F >nul 2>&1

for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":3000" ^| findstr "LISTENING"') do (
  taskkill /PID %%a /F >nul 2>&1
)

echo Done. Port 3000 listeners were terminated if present.
endlocal
