# ALTAR-NASA • Flame in Freefall (v5.1) — Sunucusuz Statik Web Paketi

Bu klasör (`web_serverless/`), GitHub Pages üzerinde arka plan sunucusu gerektirmeden doğrudan tarayıcıda çalışan statik web sürümünü içerir.

## Çalışma Özellikleri
1. **Sunucusuz Tarayıcı Modu:** Çalışan herhangi bir arka plan sunucusu gerektirmez; 3B WebGL yanma odası, faza özgü `d²` / `de Ris` / `Burke-Schumann` yasaları, ISS `0G` referans kalibrasyonu (`R²` / `RMSE`), `NASA JSC-20584` Yaşam Destek Saati, 15 NASA PSI deney sıralaması, alev fotoğrafı/dosya analizi ve Mühendislik Analizi doğrudan ziyaretçinin tarayıcısında çalışır.
2. **Yerel Veri Güvenliği:** Kaynak kodun içinde gömülü API anahtarı bulunmaz; yüklediğiniz alev fotoğrafları veya veri tabloları harici bir sunucuya gönderilmeden tarayıcı belleğinde işlenir.

## GitHub Pages Üzerinde Yayınlama
1. Yalnızca bu `web_serverless/` klasörünün içindeki dosyaları (`index.html`, `css/`, `js/`, `nasa_flame.ico`, `.nojekyll`) `gh-pages` dalının kök dizinine kopyalayın.
2. GitHub depo ayarlarından **Settings -> Pages -> Deploy from a branch (`gh-pages` / `/root`)** seçeneğini kaydedin.
3. Canlı web adresi: `https://faruk042.github.io/Nasa/`
