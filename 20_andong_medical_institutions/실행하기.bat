@echo off
setlocal

cd /d "%~dp0"

if not exist "node_modules" (
  echo [1/3] Installing dependencies...
  call npm install
)

echo [2/3] Starting server...
start "ANDONG_MEDICAL_SERVER" cmd /k "cd /d %~dp0 && npm start"

echo [3/3] Opening browser...
set "SERVER_URL=http://localhost:3000"
set "OPENED=0"
for /l %%i in (1,1,15) do (
  powershell -NoProfile -Command "try { $r = Invoke-WebRequest -Uri '%SERVER_URL%' -UseBasicParsing -TimeoutSec 2; if ($r.StatusCode -ge 200) { exit 0 } else { exit 1 } } catch { exit 1 }" >nul 2>&1
  if not errorlevel 1 (
    explorer "%SERVER_URL%"
    set "OPENED=1"
    goto :AFTER_WAIT
  )
  timeout /t 1 /nobreak >nul
)

:AFTER_WAIT
if "%OPENED%"=="0" (
  echo Server check timed out. Opening browser anyway...
  explorer "%SERVER_URL%"
)

echo Done. You can close this window.
endlocal
