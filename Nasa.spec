# -*- mode: python ; coding: utf-8 -*-
"""
ALTAR-NASA: Flame in Freefall — Güvenli Tek Dosya (One-File) PyInstaller Yapılandırması.
- .env veya API anahtarları ASLA pakete dahil edilmez.
- Masaüstüne tek başına kopyalandığında (_internal klasörü gerektirmeden) %100 bağımsız çalışır.
- Gereksiz ağır kütüphaneler (torch, PyQt, scipy, cv2 vb.) dışlanarak hızlı açılış sağlanır.
"""

from pathlib import Path

project_root = Path(SPECPATH)
icon_file = project_root / "web" / "static" / "nasa_flame.ico"

added_datas = [
    (str(project_root / "web" / "templates"), "web/templates"),
    (str(project_root / "web" / "static"), "web/static"),
    (str(project_root / "GEMINI.md"), "."),
]

hidden_imports = [
    "flask",
    "werkzeug",
    "jinja2",
    "requests",
    "bs4",
    "numpy",
    "PIL",
    "PIL.Image",
    "pymupdf",
    "fitz",
    "dotenv",
    "core",
    "core.config_manager",
    "core.directives",
    "core.physics_engine",
    "core.data_vision_processor",
    "core.nasa_datasets",
    "core.nasa_live_fetcher",
    "core.ranking_engine",
    "core.ai_engine",
]

excluded_heavy_modules = [
    "torch",
    "torchvision",
    "torchaudio",
    "scipy",
    "scikit-learn",
    "sklearn",
    "pandas",
    "matplotlib",
    "PyQt5",
    "PyQt6",
    "pyqtgraph",
    "cv2",
    "selenium",
    "chromadb",
    "onnxruntime",
    "whisper",
    "moviepy",
    "pygame",
    "scapy",
    "pydivert",
]

a = Analysis(
    ["main_nasa.py"],
    pathex=[str(project_root)],
    binaries=[],
    datas=added_datas,
    hiddenimports=hidden_imports,
    hookspath=[],
    hooksconfig={},
    runtime_hooks=[],
    excludes=excluded_heavy_modules,
    noarchive=False,
    optimize=1,
)

pyz = PYZ(a.pure)

exe = EXE(
    pyz,
    a.scripts,
    a.binaries,
    a.datas,
    [],
    name="Nasa",
    debug=False,
    bootloader_ignore_signals=False,
    strip=False,
    upx=True,
    upx_exclude=[],
    runtime_tmpdir=None,
    console=False,
    disable_windowed_traceback=False,
    argv_emulation=False,
    target_arch=None,
    codesign_identity=None,
    entitlements_file=None,
    uac_admin=False,
    icon=str(icon_file) if icon_file.is_file() else None,
)
