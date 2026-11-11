# AGENTS.md — ALTAR-NASA v4.0 (Global Finalist Edition) Mimari ve Ajan Orkestrasyon Kılavuzu

## Mimari Katmanlar
1. **`main_nasa.py`**: Çok iş parçacıklı Flask Web Sunucusunu başlatır, uygun portu bulur, tarayıcı/uygulama penceresini (`--app` modu) açar ve tarayıcı oturumlarını koparmayan görev çubuğu korumalı masaüstü kontrol panelini yönetir.
2. **`core/config_manager.py`**: API anahtarlarını (`GEMINI_API_KEY`, `OPENROUTER_API_KEY`, `ANTIGRAVITY_API_KEY`), aktif model tercihlerini (`antigravity_model`, `ollama_model`) ve Python 3.13 uyumlu güvenli SSL oturumlarını (`SystemSSLAdapter`) yönetir.
3. **`core/directives.py`**: NASA *"Flame in Freefall"* bilimsel sistem direktiflerini (`DIR-01`..`DIR-09`), EVA Uzay Giysisi (`4.3 psia / %100 O₂`), Ay Üssü & Basınçlı Gezgin (`10.2 psia / ≥%30 O₂`), Kısmi Yerçekimi (`LUCI / FM2` & `ACME E-FIELD`) şeffaflık kurallarını, termodinamik/taşınım denklemlerini ($d^2$ yasası, Spalding $B_{oq}$, Sherwood $Sh$, Rayleigh $Ra$, Richardson $Ri$, Damköhler $Da$), Halon 1301 yasağını ve roket itki kapsam istisnasını barındırır.
4. **`core/physics_engine.py`**: `%5–%100 O₂` ve `3.5–20.0 psia` genişletilmiş atmosfer aralığında tüm boyutsuz sayıları, kısmi oksijen basıncını ($P_{O_2}$), `0.16G Ay MOC` (`LUCI/FM2`) sınır eğrisini, `ACME CFI-G` (`%85 O₂` küresel gözenekli brülör) ve **Soğuk Alev (Cool Flame)** geçiş fiziğini, dinamik iki dilli (`TR/EN`) 6 satırlı `formula_table` sonuç tablosunu ve anlık bilimsel formül sentezini (`instant_ai_summary`) hesaplar.
5. **`core/data_vision_processor.py`**: Yüklenen alev fotoğraflarını (`.png/.jpg/.webp` — $H/W$ küresellik, mavi $CH^*$ kemilüminesans vs. sarı kurum indeksi) ve veri dosyalarını (`.csv/.json/.pdf/.txt` — `%5–%100 O₂`, $D^2$ eğimi $K$ regresyonu ve parametre çıkarımı) doğrudan 3B simülasyona ve AI bağlamına dönüştürür.
6. **`core/nasa_datasets.py` & `core/nasa_live_fetcher.py`**: 15 doğrulanmış NASA PSI soruşturması (**FLEX, FLEX-2, CFI, BASS, BASS-II, SPICE, SLISE, Saffire I/IV/V, SoFIE, ACME E-FIELD, ACME-BRE, ACME CFI-G, DAFT & DAFT-2 / SAME**), soruşturma-içi test matrisi (`intra_runs`), 8 görev ön ayarı, 5 Uzaydan-Dünyaya teknoloji transferi, canlı **NASA NTRS / OSDR-PSI REST API** istemcisi ve **`ContinuousWebStreamManager`** akış motorunu içerir.
7. **`core/ranking_engine.py`**: Donanım rafı filtreli (`ALL / CIR / MSG / CYGNUS / CABIN`) yanıcılık risk skorunu ($0\text{–}100$) hesaplar, NumPy TF-IDF + Kosinüs Benzerliği ile iki dilli semantik arama/sıralama yapar ve soruşturmaları yan yana kıyaslar.
8. **`core/ai_engine.py`**: Yerel **Ollama** (canlı `stream=True` token akışı), **Google Antigravity Uygulaması (`agy` CLI + Python SDK + API)**, **Google Gemini API** ve **OpenRouter / Özel API** motorlarını sıfır zaman aşımlı asenkron görev yöneticisi (`start_chat_job` / `get_chat_job`) altında birleştirir.
9. **`web/`**: **Three.js WebGL** tabanlı 4 yakıt geometrili (damlacık, katı çubuk, kumaş levha, gözenekli küresel brülör) 3B ISS CIR Yanma Odası, `%100` çift dilli (`TR / EN`) arayüz sözlüğü, Soruşturma-İçi Test Matrisi, Dinamik Fiziksel Formül Tablosu ve **Web Audio API** Akustik Sonifikasyon panelini içerir.

## Derleme ve Test Komutları
- **Geliştirme Modunda Çalıştırma:** `python main_nasa.py`
- **Otomatik Öz-Test:** `python main_nasa.py --self-test`
- **Web Sunucu Modu (Headless):** `python main_nasa.py --headless --port 8765`
- **Masaüstü EXE Derleme:** `pyinstaller --noconfirm --clean Nasa_2.spec`
