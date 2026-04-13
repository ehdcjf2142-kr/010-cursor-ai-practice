@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo 메모 앱 개발 서버를 시작합니다...
echo 브라우저에서 http://localhost:3000 이 열립니다.
echo 종료하려면 이 창에서 Ctrl+C 를 누르세요.
echo.
npm start
if errorlevel 1 pause
