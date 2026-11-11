@echo off
chcp 65001 >nul
cd /d "%~dp0"
title ALTAR-NASA v5.1 (Flame in Freefall) EXE Derleyici

set "PY="
if exist ".venv\Scripts\python.exe" set "PY=.venv\Scripts\python.exe"
if exist "..\.venv\Scripts\python.exe" set "PY=..\.venv\Scripts\python.exe"
if exist "E:\Yazılım\Python\.venv\Scripts\python.exe" set "PY=E:\Yazılım\Python\.venv\Scripts\python.exe"
if "%PY%"=="" set "PY=py"

echo ==============================================================
echo   ALTAR-NASA v5.1: Flame in Freefall — Tek Dosya EXE Derleyici
echo   Kullanilan Python: %PY%
echo ==============================================================
echo.
echo [1/4] Masaustu ikonu uretiliyor...
"%PY%" nasa_icon.py
echo.
echo [2/4] Sunucusuz statik web paketi guncelleniyor...
"%PY%" build_serverless_web.py
echo.
echo [3/4] Oz-dogrulama testleri (Self-Test) calistiriliyor...
"%PY%" main_nasa.py --self-test
if errorlevel 1 (
    echo [HATA] Test basarisiz oldu, derleme durduruldu!
    pause
    exit /b 1
)
echo.
echo [4/4] PyInstaller ile tek dosya Nasa_4.exe derleniyor...
"%PY%" -m PyInstaller --noconfirm --clean Nasa_4.spec
echo.
if exist "dist\Nasa_4.exe" (
    echo [BASARILI] dist\Nasa_4.exe basariyla olusturuldu!
) else (
    echo [HATA] EXE olusturulamadi!
)
pause
