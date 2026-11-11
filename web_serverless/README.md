# 🛡️ ALTAR-NASA • Flame in Freefall (v5.0) — Sunucusuz Statik Web Paketi (`web_serverless/`)

> **🌐 Canlı GitHub Pages Adresi:** **[https://faruk042.github.io/Nasa/](https://faruk042.github.io/Nasa/)**  
> **📦 Ana Proje Deposu (Tam Sürüm):** **[https://github.com/Faruk042/Nasa](https://github.com/Faruk042/Nasa)**

Bu dizin, **ALTAR-NASA: Flame in Freefall (v5.0)** platformunun **%100 Sunucusuz ve Tam İzole Statik Web Sürümüdür** ([`../build_serverless_web.py`](../build_serverless_web.py) tarafından üretilmiştir).

## 🔒 Siber Güvenlik ve İzolasyon Mimarisi
* **Sıfır Arka Plan Sunucusu & Sıfır Açık Port:** Çalışan hiçbir Python, Node.js veya veritabanı sunucusu yoktur; geliştirici bilgisayarıyla hiçbir ağ bağlantısı kurmaz.
* **Sıfır Gömülü Sır:** İçerisinde hiçbir `.env` veya API anahtarı bulunmaz.
* **Sıkı `Content-Security-Policy (CSP)`:** [`index.html`](./index.html) yalnızca kendi statik varlıklarını (`'self'`) ve resmi NASA açık bilim API uçlarını (`https://ntrs.nasa.gov`, `https://osdr.nasa.gov`) kabul eder.
* **%100 İstemci-İçi Bilimsel Çekirdek ([`js/serverless_kernel.js`](./js/serverless_kernel.js)):**
  - **3B WebGL ISS Yanma Odası Dijital İkizi** (`Three.js`)
  - **Analitik Boyutsuz Denklemler** (`d²` yasası `K`, Spalding `B_oq`, Sherwood `Sh`, `Re`, `Gr`, `Ra`, `Ri`, Damköhler `Da`, `χ_r`, `MOC`)
  - **◆ Gerçek ISS Uçuş Telemetrisi Doğrulaması** (`R²` & `RMSE`)
  - **⏱️ ECLSS Mürettebat Yaşam Destek Saati** (`125 ppm CO SMAC`, `ISS Modülü`, `Ay Üssü`, `Basınçlı Ay Gezgini`, `EVA Uzay Giysisi`)
  - **📊 15 NASA PSI Soruşturması Sıralama & Kıyaslama Matrisi**
  - **🖼️ Tarayıcı-İçi `<canvas>` Alev Görseli & Veri Çözümleyici** (yüklenen dosyalar tarayıcı dışına çıkmaz)
  - **🧠 4 Bölümlü NTRS Atıflı SI Copilot** (`NASA-STD-6001B` Halon yasağı ve `SoFIE-MIST` su sisi uyumlu)

## 📄 Lisans
[Apache License 2.0](../LICENSE) — Copyright © 2026 Faruk Emir Bilgin.
