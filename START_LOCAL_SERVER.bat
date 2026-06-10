REM Author: NoNameGames - Lou
@echo off
cd /d "%~dp0"
start "" "http://localhost:8000/developer-login.html"
where py >nul 2>nul
if %errorlevel%==0 (
  py -3 -m http.server 8000
) else (
  python -m http.server 8000
)
pause
