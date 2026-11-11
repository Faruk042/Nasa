# ◈ ALTAR-NASA • Flame in Freefall (v5.1) — Seçenek 1: %100 İzole Sunucusuz Statik Web Paketi

Bu klasör (`web_serverless/`), **Seçenek 1 (Sunucusuz Statik Web Paketi / Serverless Static Web Bundle)** mimarisiyle üretilmiştir.

## ◈ Siber Güvenlik ve İzolasyon Garantileri
1. **Sıfır Arka Plan Sunucusu & Sıfır Açık Port:** Bu pakette çalışan hiçbir Python, Node.js veya veritabanı sunucusu yoktur; dış dünyadan bilgisayarınıza herhangi bir ağ portu açılmaz.
2. **Sıfır Gömülü API Anahtarı / Sır:** Kodların içinde hiçbir `.env`, parola veya API anahtarı bulunmaz.
3. **Sıkı Content-Security-Policy (CSP):** `index.html` içerisindeki CSP başlığı `object-src 'none'`, `base-uri 'self'` ve yalnızca resmi NASA açık bilim uçlarına (`https://ntrs.nasa.gov`, `https://osdr.nasa.gov`) salt-okunur erişime izin verir.
4. **%100 Tarayıcı-İçi Hesaplama:** 3B WebGL yanma odası, `d²` yasası, ISS uçuş doğrulaması (`R²` / `RMSE`), ECLSS yaşam saati, 15 PSI deney sıralaması, dosya/görsel piksel analizi ve Kanıt Sentezi Konsolu tamamen ziyaretçinin kendi tarayıcı RAM'inde izole çalışır.

## ▸ GitHub Pages veya Cloudflare Pages'e Ücretsiz Yükleme (2 Dakika)
1. GitHub'da yeni ve boş bir depo (repository) oluşturun (ör. `Nasa`).
2. **Yalnızca bu `web_serverless/` klasörünün içindeki dosyaları** (`index.html`, `css/`, `js/`, `nasa_flame.ico`) deponun kök dizinine yükleyin.
3. GitHub depo ayarlarından **Settings -> Pages -> Deploy from a branch (`gh-pages` / `/root`)** seçeneğini kaydedin.
4. Yarışma başvuru formuna oluşan `https://faruk042.github.io/Nasa/` bağlantısını ekleyin.
