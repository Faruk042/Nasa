@echo off
setlocal
cd /d "%~dp0"
title ALTAR-NASA v5.1 - Otomatik Kurulum ve Baslatici

if exist "%~dp0Nasa_4.exe" (
    start "" "%~dp0Nasa_4.exe"
    exit /b 0
)

where powershell.exe >nul 2>nul
if errorlevel 1 (
    if exist "%~dp0web_serverless\index.html" (
        start "" "%~dp0web_serverless\index.html"
        exit /b 0
    )
    echo [HATA] Windows PowerShell bulunamadi.
    pause
    exit /b 1
)

powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0scripts\bootstrap_nasa.ps1" -Action RunApp %*
set "EXIT_CODE=%ERRORLEVEL%"
if not "%EXIT_CODE%"=="0" (
    echo.
    pause
)
exit /b %EXIT_CODE%
