@echo off
chcp 65001 >nul
cd /d "%~dp0"
title ALTAR-NASA (Flame in Freefall) EXE Derleyici

set "PY="
if exist ".venv\Scripts\python.exe" set "PY=.venv\Scripts\python.exe"
if exist "..\.venv\Scripts\python.exe" set "PY=..\.venv\Scripts\python.exe"
if exist "E:\Yazılım\Python\.venv\Scripts\python.exe" set "PY=E:\Yazılım\Python\.venv\Scripts\python.exe"
if "%PY%"=="" set "PY=py"

echo ==============================================================
echo   ALTAR-NASA: Flame in Freefall — Tek Dosya EXE Derleyici
echo   Kullanilan Python: %PY%
echo ==============================================================
echo.
echo [1/3] Masaustu ikonu uretiliyor...
"%PY%" nasa_icon.py
echo.
echo [2/3] Oz-dogrulama testleri (Self-Test) calistiriliyor...
"%PY%" main_nasa.py --self-test
if errorlevel 1 (
    echo [HATA] Test basarisiz oldu, derleme durduruldu!
    pause
    exit /b 1
)
echo.
echo [3/3] PyInstaller ile tek dosya Nasa.exe derleniyor...
"%PY%" -m PyInstaller --noconfirm --clean Nasa.spec
echo.
if exist "dist\Nasa.exe" (
    echo [BASARILI] dist\Nasa.exe basariyla olusturuldu!
) else (
    echo [HATA] EXE olusturulamadi!
)
pause
