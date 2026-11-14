@echo off
setlocal
cd /d "%~dp0"
title ALTAR-NASA v5.1 - Otomatik Kurulum ve EXE Derleyici

where powershell.exe >nul 2>nul
if errorlevel 1 (
    echo [HATA] Windows PowerShell bulunamadi.
    pause
    exit /b 1
)

powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0scripts\bootstrap_nasa.ps1" -Action BuildExe %*
set "EXIT_CODE=%ERRORLEVEL%"
echo.
pause
exit /b %EXIT_CODE%
