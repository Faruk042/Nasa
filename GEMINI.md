# ALTAR-NASA: Flame in Freefall v4.0 — Workspace Rules, Governing Equations & Directives

Bu çalışma alanı (**ALTAR-NASA: Flame in Freefall v4.0 Global Finalist Edition**), **2026 NASA International Space Apps Challenge — "Flame in Freefall: SI-Powered Fire Safety Insights from Microgravity Combustion Data"** kategorisi için geliştirilmiş web paneli odaklı, 3 boyutlu WebGL simülasyonlu, sürekli canlı web veri akışlı, çok modlu dosya/resim işleyicili ve hibrit yapay zeka (**Yerel Ollama + Google Antigravity Uygulaması (`agy` CLI / SDK) + Google Gemini API + OpenRouter**) destekli bilimsel karar destek platformudur.

## 1. Kapsam ve Odak Kuralları (Relevance Guardrails)
- Projeye yalnızca **mikroçekim ve kısmi yerçekimi yanma fiziği, uzay aracı / uzay istasyonu / EVA uzay giysisi / Ay ve Mars üsleri / basınçlı gezgin (rover) yangın güvenliği, duman/toz algılama, NASA PSI / OSDR / NTRS veri analizi ve yapay zeka karar destek** modülleri eklenebilir.
- Yüksek hızlı roket motorları ve iticilerdeki yanma (yerçekiminden bağımsız yüksek hızlı akış) NASA PSI kabin yangın güvenliği kapsamı dışındadır ve bu ayrım kullanıcıya açıkça belirtilir.
- Uygulama hiçbir koşulda Windows Yönetici (UAC Admin) yetkisi istememelidir (`uac_admin=False`).

## 2. Zorunlu Fiziksel Denklemler ve NASA PSI Kriterleri
1. **D² Damlacık Yanma Yasası ve Spalding Kütle Aktarım Sayısı ($B_{oq}$):**
   $$D^2(t) = D_0^2 - K t, \quad K = \frac{8 \lambda_g}{\rho_l c_p} \ln(1 + B_{oq}) \cdot \frac{Sh}{2} \cdot (1 - \chi_r)$$
   $$B_{oq} = \frac{Y_{O_2,\infty} \Delta H_c / \nu_s + c_p (T_\infty - T_b)}{L_v}, \quad \frac{R_f}{R_d} = \frac{\ln(1 + B_{oq})}{\ln(1 + Y_{O_2,\infty} / \nu_s)}$$
2. **Mikroçekim Boyutsuz Taşınım Sayıları ($Re, Sh, Gr, Ra, Ri, Da$):**
   - Mikroçekimde ($g \to 0$) Grashof ($Gr = g\beta\Delta T L^3/\nu^2 \to 0$), Rayleigh ($Ra = Gr \cdot Pr \to 0$) ve Richardson ($Ri = Gr/Re^2 \to 0$) sıfırlanır.
   - Kütle aktarımı Sherwood sayısı $Sh = 2 + 0.6 Re^{1/2} Sc^{1/3}$ ile yönetilir; sönümlenme/üfleme sınırı Damköhler sayısı $Da = \tau_{\text{flow}} / \tau_{\text{chem}}$ ile izlenir.
3. **Uzay Giysisi ($4.3\text{ psia} / \%100\text{ O}_2$), Ay Gezgini ($\le 10.2\text{ psia} / \ge \%30\text{ O}_2$) ve ACME CFI-G ($\%85\text{ O}_2$):**
   - $P_{O_2} = X_{O_2} \cdot P_{\text{kabin}}$ izlenmelidir. İnsanlı uzay araçlarında **Halon 1301 önerilmesi KESİNLİKLE YASAKTIR**; HVAC kapatma, İnce Su Sisi ($25\text{–}40\text{ }\mu\text{m}$ PFE / SoFIE-MIST), $CO_2$ ve depresürizasyon önerilmelidir.
4. **Kısmi Yerçekimi Şeffaflığı (`LUCI` & `FM2` + `ACME E-FIELD`):** NASA PSI'da henüz doğrudan Ay ($0.16\text{G}$) / Mars ($0.38\text{G}$) yanma verisi bulunmadığı (`LUCI` ve `FM2` beklendiği), $0\text{G}$ ve $1\text{G}$ sonuçlarının ara yerçekimini sınırladığı ve `ACME E-FIELD` iyon rüzgarının kısmi yerçekimini taklit ettiği şeffafça gösterilir.
5. **15 Doğrulanmış NASA PSI Soruşturması & Donanım Mimarisi:** `CIR/MDCA` (`FLEX`, `FLEX-2`, `CFI`), `CIR ACME` (`ACME E-FIELD`, `ACME-BRE`, `ACME CFI-G`), `CIR SoFIE` (`SoFIE GEL/MIST`), `MSG SPICE Akış Kanalı` (`SPICE`, `SLISE`, `BASS`, `BASS-II`), `Cygnus` (`Saffire-I`, `Saffire-IV`, `Saffire-V`) ve `Kabin Aerosol` (`SAME / DAFT & DAFT-2`).

## 3. Güvenlik ve Mühendislik Kuralları
- **Sırların Korunması:** `.env` dosyası veya API anahtarları asla kaynak koda gömülmemeli ve `.spec` içerisindeki `datas` listesine eklenmemelidir. Kullanıcı anahtarları çalışma zamanında `%APPDATA%\AltarNasa\config.json` altında saklanır.
- **Taşınabilir Dosya Yolları:** Kod tabanında sabit sürücü/kullanıcı yolları kullanmak yasaktır; tüm yollar `pathlib.Path`, `shutil.which`, `sys._MEIPASS` ve ortam değişkenleriyle dinamik çözülmelidir.
- **SSL Doğrulaması:** `verify=False` kullanmak yasaktır; Python 3.13 uyumlu `SystemSSLAdapter` üzerinden işletim sistemi kök sertifika deposu kullanılmalıdır.
