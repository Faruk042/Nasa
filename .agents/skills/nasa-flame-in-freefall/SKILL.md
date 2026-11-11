---
name: nasa-flame-in-freefall
description: >-
  Guides development, scientific verification, live NASA NTRS/PSI API testing,
  3D WebGL combustion visualization updates, and PyInstaller Nasa.exe packaging
  for the ALTAR-NASA Flame in Freefall platform. Activate when modifying physics,
  AI providers (Ollama, Gemini, Antigravity SDK, OpenRouter), web UI, or building Nasa.exe.
---

# NASA Flame in Freefall — Geliştirme ve Paketleme Becerisi

Bu beceri, **ALTAR-NASA (Flame in Freefall)** projesinde geliştirme, doğrulama ve `.exe` derleme işlemlerini hatasız yürütmek için kullanılır.

## Doğrulama Adımları

1. **Çekirdek Modül ve Fizik Testi:**
   Tüm Python modüllerinin sözdizimi ve birim doğrulamasını çalıştırın:
   ```powershell
   & "E:\Yazılım\Python\.venv\Scripts\python.exe" -c "import core.physics_engine, core.nasa_datasets, core.ranking_engine, core.ai_engine; print('CORE OK')"
   ```

2. **Flask Uç Noktaları Testi (`test_client`):**
   Canlı sunucu açmadan tüm REST API uç noktalarını doğrulayın:
   ```powershell
   & "E:\Yazılım\Python\.venv\Scripts\python.exe" main_nasa.py --self-test
   ```

3. **Güvenli `Nasa.exe` Derlemesi:**
   - `Nasa.spec` içinde `.env` dosyasının **yer almadığından** emin olun.
   - Derlemeyi çalıştırın ve çıktıyı masaüstüne kopyalayın:
   ```powershell
   & "E:\Yazılım\Python\.venv\Scripts\python.exe" -m PyInstaller --noconfirm --clean Nasa.spec
   ```
