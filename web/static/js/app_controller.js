/* ============================================================================
   ALTAR-NASA Görev Kontrol Ana Kontrolcüsü v5.1 (app_controller.js)
   - 3B WebGL Simülasyon (Damlacık • Polimer Çubuk • Kumaş Plaka • Küresel Brülör)
   - Kısmi Yerçekimi (0.16G Ay / 0.38G Mars) LUCI/FM2 & E-FIELD Şeffaflık Sistemi
   - EVA Uzay Giysisi (%100 O₂ @ 4.3 psia), Ay Gezgini (%32 O₂ @ 10.2 psia) & CFI-G (%85 O₂)
   - 15 NASA PSI Soruşturması, Donanım Raf Filtresi (CIR/MSG/Cygnus/DAFT) & Deney İçi Varyasyonlar
   - %100 Akademik Çift Dilli (TR / EN) Arayüz Çeviri Motoru
   - Sürekli Canlı Telemetri Akışı + Çok Modlu Çözümleyici + Kanıt Sentezi Konsolu
   ============================================================================ */

(function () {
    "use strict";

    const UI_I18N = {
        tr: {
            brand_sub: "Fizik-Temelli Mikroçekim & Kısmi Yerçekimi Yanma Güvenliği, PSI Veri Sentezi ve 3B Dijital İkiz Platformu",
            nav_lab: "01 // 3B Yanma Odası & Denklemler",
            nav_rank: "02 // PSI Sıralama & Kıyaslama",
            nav_live: "03 // Telemetri Akışı & Çözümleyici",
            nav_copilot: "04 // Kanıt Sentezi & Karar Konsolu",
            nav_settings: "05 // Sistem Kalibrasyonu & Kısıtlar",
            quick_ingest_title: "◫ Dosya veya Alev Görüntüsüyle 3B Simüle Et",
            quick_ingest_desc: "Yüklediğiniz alev fotoğrafı veya veri dosyasından parametreler otomatik çıkarılır ve 3B sahneye uygulanır:",
            presets_title: "◈ Hazır NASA Görev & Giysi Senaryoları",
            controls_title: "⌖ Kabin, Uzay Giysisi & Yanma Parametreleri",
            lbl_fuel: "Yakıt / Numune / Brülör Türü",
            lbl_gravity: "Yerçekimi İvmesi (0G ISS • 0.16G Ay • 0.38G Mars • 1G)",
            lbl_oxygen: "Oksijen Konsantrasyonu (%8 – %100 Saf O₂)",
            lbl_pressure: "Basınç (4.3 psia Giysi – 14.7 psia ISS)",
            lbl_airflow: "Havalandırma Akış Hızı (cm/s)",
            lbl_droplet: "Damlacık / Numune / Brülör Çapı",
            lbl_diluent: "Seyreltici Kabin Gazı",
            audio_title: "◈ Akustik Telemetri Sonifikasyonu",
            audio_start: "▸ Sesi Başlat",
            audio_stop: "■ Sesi Durdur",
            audio_desc: "Sıcaklık ve görünmez Soğuk Alev titreşimlerini gerçek zamanlı akustik frekansa dönüştürür.",
            chamber_title: "◈ 3B ISS Yanma Odası Dijital İkizi (CIR / MSG WebGL)",
            chamber_hint: "Fare: 360° Döndür • Tekerlek: Yakınlaştır",
            cam_front: "Ön Açı",
            cam_macro: "Makro Çekirdek",
            cam_sensors: "Sensör Açısı",
            cam_top: "Üst Kesit",
            cam_reignite: "⌖ Yeniden Ateşle",
            leg_blue: "CH*/OH* Mavi Kemilüminesans",
            leg_soot: "Kurum (Soot) Işıması",
            leg_cool: "Görünmez Soğuk Alev (UV/IR 550-750 K)",
            leg_geom: "Damlacık / Polimer / Küresel Brülör",
            chart_sensor_title: "◈ Çoklu Sensör Tutarlılığı & İki Aşamalı Soğuk Alev Anomali Analizi (0–30 sn)",
            chart_sensor_sub: "Optik Kamera vs. IR Radyometre vs. CO",
            tel_panel_title: "◈ Canlı Yanma Telemetrisi",
            btn_ai_interpret: "⌖ Kanıt Konsolunda Analiz Et",
            lbl_risk_score: "UZAY ARACI / GİYSİ YANGIN RİSK SKORU",
            card_temp: "Alev Sıcaklığı",
            card_moc: "Kritik Oksijen (MOC)",
            card_kburn: "D² Yanma Sabiti (K)",
            card_spread: "Yayılma & Spalding B",
            card_rad: "Radyatif Kayıp (χr)",
            card_co: "CO, Kurum & Sherwood",
            chart_moc_title: "◈ Tutuşabilirlik Sınır Haritası (0G • 0.16G Ay • 1G Sınırları)",
            chart_moc_desc: "0G ve 1G MOC eğrileri ara yerçekimi (0.16G Ay LUCI/FM2) davranışını sınırlar; düşük fan akışı (3–8 cm/s) gizli risk yaratır.",
            formula_table_title: "◈ Canlı Fiziksel Denklemler, Boyutsuz Sayılar & Sonuç Tablosu",
            th_law: "Fiziksel Yasa / Kriter",
            th_eq: "Matematiksel Denklem",
            th_val: "Anlık Sayısal Sonuç",
            th_status: "Rejim Durumu",
            live_synthesis_title: "◈ Anlık Analitik & Formülsel Veri Sentezi",
            btn_full_ai_report: "▸ Teknik Sentez Raporu Üret",
            rank_main_title: "◈ Fizik-Temelli NASA PSI Yanma Araştırmaları Sıralama, Donanım & Karşılaştırma Matrisi",
            rank_main_desc: "Uzay aracı, uzay istasyonu, EVA uzay giysisi, Ay/Mars üsleri ve basınçlı gezginler için en kritik 15 NASA PSI soruşturmasını termodinamik yakınlık ve TF-IDF ile sıralar, özetler ve kıyaslar.",
            rank_placeholder: "Örn: soğuk alev, CFI-G %85 O2, DAFT toz, SPICE, rover...",
            btn_rerank: "⌖ Yeniden Sırala",
            btn_compare: "◈ Seçilenleri Kıyasla",
            lbl_hw_filter: "◈ Uzay Donanım Mimarisi:",
            hw_all: "Tümü (15 PSI Soruşturması)",
            hw_cir: "◈ ISS CIR / MDCA & ACME",
            hw_msg: "◈ ISS MSG Fan Kanalı (SPICE/BASS/SLISE)",
            hw_cygnus: "◈ Cygnus Otonom Aracı (Saffire)",
            hw_cabin: "◈ Kabin Duman & Toz (SAME / DAFT)",
            psi_rocket_scope_note: "◆ NASA PSI Kapsam Notu: Roket motorları ve iticilerdeki yüksek gaz hızları yanmayı etkili biçimde yerçekiminden bağımsız kıldığından PSI veritabanı mürettebat kabinleri, uzay giysileri ve yüzey habitatlarındaki yangın güvenliğine odaklanır.",
            th_sel: "Seç",
            th_rank: "Sıra",
            th_prog: "Program & Donanım",
            th_exp_detail: "Hedefler, Numune/Brülör Şekli, Sensörler & Bulgular",
            th_cond: "Test Koşulları",
            th_prio: "Termodinamik & TF-IDF Skoru",
            th_evid: "Kanıt & Varyasyon",
            intra_runs_hint: "Yukarıdaki tablodan herhangi bir deneyin '◈ Test Varyasyonları' butonuna tıklayarak aynı donanım içindeki testlerin nasıl farklılaştığını ve neyin sabit tutulduğunu inceleyin:",
            cmp_section_title: "◈ Farklı Soruşturmalar Arası Benzerlik & Farklılık Karşılaştırması",
            earth_section_title: "◈ PSI Verilerinin Dünya'daki Yangın Güvenliği Uygulamaları (Su Sisi • Duman Algılama • İtfaiye Teçhizatı)",
            stream_panel_title: "◈ Sürekli Canlı Telemetri Akışı & Otonom Simülasyon Besleyici",
            stream_panel_desc: "Seçtiğiniz NASA veri tabanından (NTRS / OSDR-PSI) veya özel bir web sitesi / JSON / CSV telemetri URL'sinden belirlediğiniz aralıklarla kesintisiz veri çeker; veriler değiştikçe 3B simülasyonu, grafikleri ve sonuç tablolarını anlık olarak günceller.",
            stream_target_ph: "Sorgu ('auto' = tüm NASA deneylerini döngüsel tarar) veya https://... URL girin",
            btn_stream_start: "▸ Sürekli Akışı Başlat",
            btn_stream_stop: "■ Sürekli Akışı Durdur",
            btn_stream_now: "⌖ Şimdi Çek",
            chk_stream_sync: "◈ Web'den yeni veri geldikçe 3B Yanma Odası, Grafikler ve Sonuç Tablolarını Anlık Senkronize Et",
            stream_not_started: "Henüz akış döngüsü başlatılmadı.",
            live_search_title: "◈ Canlı NASA NTRS & OSDR/PSI Veri Tabanı Sorgusu",
            live_search_desc: "Doğrudan resmi ntrs.nasa.gov ve osdr.nasa.gov REST API uç noktalarından gerçek zamanlı bilimsel rapor, özet ve deney kayıtlarını sorgulayın.",
            btn_fetch_live: "▸ Canlı Çek",
            ingest_panel_title: "◫ Çok Modlu Dosya, Alev Görüntüsü & Web Telemetri Çözümleyici",
            ingest_panel_desc: "Alev fotoğraflarını (.png, .jpg, .webp), bilimsel veri tablolarını (.csv, .json, .pdf, .txt) veya makale bağlantılarını yükleyin; çıkarılan parametreler 3B odaya ve vektör indeksine aktarılır.",
            lbl_scrape_url: "Bilimsel Web Sayfası / JSON / CSV / PDF URL Çözümle",
            btn_scrape_url: "Çözümle & 3B'ye Aktar",
            lbl_choose_file: "Yerel Veri Dosyası veya Alev Görüntüsü Seç (.png, .jpg, .csv, .json, .pdf, .txt)",
            chk_media_sync: "Çıkarılan verileri otomatik olarak 3B Yanma Odası ve Tablolara uygula",
            btn_upload_doc: "▸ Dosya / Görüntüyü Analiz Et, 3B Odaya & Vektör İndeksine Aktar",
            rag_test_title: "⌖ Semantik Vektör Korpusu Sorgusu",
            rag_search_ph: "Vektör korpusunda kavram ara (TR veya EN)...",
            btn_rag_search: "Sorgula",
            copilot_tasks_title: "◈ Hazır Mühendislik Analiz Protokolleri",
            cp_btn_1: "◈ Aktif 3B & Denklemleri Kanıtlarla Sentezle",
            cp_btn_2: "◈ Uzay Giysisi (%100 O₂) & Ay Gezgini Kıyasla",
            cp_btn_3: "◈ Kısmi Yerçekimi (LUCI/FM2 & E-FIELD) Analizi",
            cp_btn_4: "◈ Görünmez Soğuk Alev & DAFT Duman/Toz Sensörü",
            cp_btn_5: "◈ Su Sisi (SoFIE-MIST) & İtfaiye Teknoloji Transferi",
            copilot_attach_title: "◫ Analize Dosya veya Alev Görüntüsü Bağla",
            copilot_attach_desc: "Alev fotoğrafı (.png/.jpg) veya veri dosyası (.csv/.pdf/.json/.txt) seçtiğinizde hem 3B simülasyon güncellenir hem de denklemlerle sentezlenir:",
            chk_6stage: "◈ 6-Katmanlı Denklem & NASA-STD-6001B Halon Denetçisi Aktif",
            lbl_active_engine: "◈ Aktif Sentez Çekirdeği:",
            copilot_ctx_tag: "Canlı 3B Telemetri + 15 PSI Deneyi + Denklem Bağlamı Aktif",
            welcome_title: "◈ ALTAR-NASA // KANIT SENTEZİ VE KARAR DESTEK KONSOLU [v5.1]",
            kv_solver_lbl: "SAYISAL ÇÖZÜCÜ",
            kv_corpus_lbl: "REFERANS KORPUSU",
            kv_auditor_lbl: "GÜVENLİK DENETÇİSİ",
            welcome_p1: "Telemetri bağlamı kilitlendi. Bu konsol; aktif 3B yanma odası durum vektörünü, boyutsuz taşınım sayılarını, ISS uçuş doğrulama kalıntılarını (R² / RMSE) ve 15 doğrulanmış NASA PSI soruşturmasını deterministik fizik çözücü ve çevrimdışı/hibrit çıkarım katmanlarıyla sentezler.",
            welcome_p2: "Uzay istasyonları (ISS), EVA uzay giysileri (%100 O₂ @ 4.3 psia), Ay/Mars yüzey habitatları ve basınçlı gezginler (10.2 psia) için rejim sınırları, soğuk alev anomalileri ve SoFIE-MIST söndürme protokollerini sorgulayabilirsiniz.",
            chat_input_ph: "Mikroçekim yanma denklemleri, EVA giysisi/Ay gezgini rejimi veya NASA PSI kanıt sorgusu girin...",
            btn_stop_chat: "■ Durdur",
            btn_send_chat: "Analizi Çalıştır ▸",
            set_card1_title: "◈ Sayısal Çözücü Kalibrasyonu & Sentez Çekirdeği",
            set_ollama_hub_title: "◈ Yerel Çevrimdışı Çıkarım Merkezi (Derin Uzay Otonom Modu)",
            spec_k1: "ANALİTİK TAŞINIM ÇÖZÜCÜ",
            spec_k2: "ISS UÇUŞ KALİBRASYONU",
            spec_k3: "ZERO-TRUST SOKET SINIRI",
            spec_k4: "ECLSS GÜVENLİK STANDARDI",
            con_enforced_badge: "ZORUNLU DENETİM AKTİF",
            acc_opt_badge: "OPSİYONEL • YEREL KASA",
            btn_check_all: "⌖ Durumu Denetle",
            lbl_def_provider: "Varsayılan Kanıt Sentez Çekirdeği",
            lbl_agy_model: "Yerel Sistem CLI Çıkarım Köprüsü & Model Profili",
            lbl_ollama_host: "Yerel Ollama Sunucu Adresi",
            lbl_ollama_model: "Yüklü Yerel Çevrimdışı Model",
            lbl_ollama_pull: "Yeni Yerel Model İndir veya Bellek (VRAM/RAM) Boşalt",
            btn_pull: "İndir",
            btn_unload: "✕ Boşalt",
            btn_test_provider: "▸ Aktif Sentez Çekirdeğini Bilimsel Doğrulama İle Test Et",
            set_card2_title: "Gelişmiş Harici Bulut Çıkarım Geçidi, Kimlik Doğrulama Kasası & Raporlama Biçimi (İsteğe Bağlı)",
            set_card2_desc: "Harici bulut geçidi kimlik bilgileri asla kaynak koda veya çalıştırılabilir pakete gömülmez; yalnızca yerel kullanıcı kasasında (%APPDATA%\\AltarNasa\\config.json) saklanır.",
            lbl_gemini_key: "Google Gemini REST Geçit Anahtarı (GEMINI_API_KEY)",
            lbl_gemini_model: "Google Gemini Model Tanımlayıcısı",
            lbl_agy_key: "Yerel CLI Köprüsü Yedek Geçit Anahtarı (CLI Aktifse Gerekmez)",
            lbl_or_key: "OpenRouter Geçit Anahtarı (OPENROUTER_API_KEY)",
            lbl_or_model: "OpenRouter Model Tanımlayıcısı",
            lbl_custom_gw: "Özel OpenAI-Uyumlu Kurumsal Uç Nokta & Anahtar (İsteğe Bağlı)",
            btn_save_cfg: "◈ Tüm Kalibrasyon ve Geçit Yapılandırmasını Kaydet",
            set_card3_title: "◈ NASA-STD-6001B & PSI Fiziksel Doğrulama Kısıtları Matrisi (CON-01 .. CON-09)",
            set_card3_desc: "Aşağıdaki taşınım yasaları, boyutsuz rejim sınırları ve uçuş güvenliği kısıtları analitik fizik çekirdeği ve tüm kanıt sentez katmanlarında zorunlu olarak denetlenmektedir:",
            lbl_extra_dir: "Özel Birim & Raporlama Biçimi Kısıtları (İsteğe Bağlı)",
            extra_dir_ph: "Örn: Teknik sentez çıktılarında her zaman kPa biriminin yanında psia karşılığını da raporla...",
            btn_save_dir: "▸ Raporlama Biçimi Kısıtlarını Güncelle",
            btn_export_report: "◫ Rapor (.MD)",
            btn_clear_chat: "✕ Sıfırla",
            shield_badge: "◈ 127.0.0.1 Zero-Trust İzole",
            lbl_audience: "◈ Hedef Kitle Modu:",
            btn_guided_tour: "▸ Rehberli Jüri Turu",
            chk_flight_pts: "◆ ISS Ölçüm Noktaları",
            btn_export_csv: "◫ CSV İndir",
            btn_export_json: "◫ JSON İndir",
            cabin_clock_title: "◈ Kabin, Basınçlı Gezgin & EVA Uzay Giysisi Yangın Senaryosu — ECLSS Yaşam Destek Saati",
            btn_tour_end: "✕ Bitir",
            btn_tour_next: "Sonraki Adım ▸",
        },
        en: {
            brand_sub: "Physics-Informed Microgravity & Partial-Gravity Fire Safety, PSI Synthesis & 3D Digital Twin Suite",
            nav_lab: "01 // 3D Chamber & Equations",
            nav_rank: "02 // PSI Ranking & Matrix",
            nav_live: "03 // Telemetry Stream & Analyzer",
            nav_copilot: "04 // Evidence Synthesis Console",
            nav_settings: "05 // Calibration & Constraints",
            quick_ingest_title: "◫ Simulate 3D from File or Flame Imagery",
            quick_ingest_desc: "Combustion parameters are automatically extracted from your flame photo or dataset and applied to 3D:",
            presets_title: "◈ NASA Mission, EVA Suit & Rover Presets",
            controls_title: "⌖ Cabin, Spacesuit & Combustion Parameters",
            lbl_fuel: "Fuel / Sample / Burner Geometry",
            lbl_gravity: "Gravity Level (0G ISS • 0.16G Moon • 0.38G Mars • 1G)",
            lbl_oxygen: "Oxygen Concentration (8% – 100% Pure O₂)",
            lbl_pressure: "Ambient Pressure (4.3 psia Suit – 14.7 psia ISS)",
            lbl_airflow: "Ventilation Airflow Speed (cm/s)",
            lbl_droplet: "Droplet / Sample / Burner Diameter",
            lbl_diluent: "Ambient Diluent Gas",
            audio_title: "◈ Acoustic Telemetry Sonification",
            audio_start: "▸ Start Audio",
            audio_stop: "■ Stop Audio",
            audio_desc: "Converts flame temperature and invisible Cool Flame oscillations into real-time audio frequencies.",
            chamber_title: "◈ 3D ISS Combustion Chamber Digital Twin (CIR / MSG WebGL)",
            chamber_hint: "Drag: 360° Orbit • Scroll: Zoom",
            cam_front: "Front View",
            cam_macro: "Macro Core",
            cam_sensors: "Sensor View",
            cam_top: "Top Cutaway",
            cam_reignite: "⌖ Re-Ignite",
            leg_blue: "CH*/OH* Blue Chemiluminescence",
            leg_soot: "Soot Thermal Radiation",
            leg_cool: "Invisible Cool Flame (UV/IR 550-750 K)",
            leg_geom: "Droplet / Polymer / Spherical Burner",
            chart_sensor_title: "◈ Multi-Sensor Coherence & Two-Stage Cool Flame Anomaly (0–30 s)",
            chart_sensor_sub: "Optical Camera vs. IR Radiometer vs. CO",
            tel_panel_title: "◈ Live Combustion Telemetry",
            btn_ai_interpret: "⌖ Analyze in Evidence Console",
            lbl_risk_score: "SPACECRAFT / SUIT FIRE RISK SCORE",
            card_temp: "Flame Temperature",
            card_moc: "Min Oxygen (MOC)",
            card_kburn: "d² Burn Constant (K)",
            card_spread: "Spread & Spalding B",
            card_rad: "Radiative Loss (χr)",
            card_co: "CO, Soot & Sherwood",
            chart_moc_title: "◈ Flammability Boundary Map (0G • 0.16G Moon • 1G Bounds)",
            chart_moc_desc: "0G and 1G MOC curves bound intermediate partial gravity (0.16G Lunar LUCI/FM2); gentle 3–8 cm/s flow lowers MOC.",
            formula_table_title: "◈ Live Governing Equations, Dimensionless Numbers & Results Table",
            th_law: "Physical Law / Criterion",
            th_eq: "Governing Equation",
            th_val: "Live Numerical Output",
            th_status: "Regime Status",
            live_synthesis_title: "◈ Instant Analytical & Equation Synthesis",
            btn_full_ai_report: "▸ Generate Technical Synthesis",
            rank_main_title: "◈ Physics-Informed NASA PSI Investigation Ranking, Hardware & Comparison Matrix",
            rank_main_desc: "Summarizes, ranks, and compares 15 verified NASA PSI investigations via thermodynamic affinity and TF-IDF across spacecraft, EVA suits, Lunar/Mars bases, and pressurized rovers.",
            rank_placeholder: "e.g., cool flame, CFI-G 85% O2, DAFT dust, SPICE, rover...",
            btn_rerank: "⌖ Re-Rank",
            btn_compare: "◈ Compare Selected",
            lbl_hw_filter: "◈ Orbital Hardware Facility:",
            hw_all: "All (15 PSI Investigations)",
            hw_cir: "◈ ISS CIR / MDCA & ACME",
            hw_msg: "◈ ISS MSG Flow Duct (SPICE/BASS/SLISE)",
            hw_cygnus: "◈ Cygnus Autonomous Vehicle (Saffire)",
            hw_cabin: "◈ Cabin Smoke & Dust (SAME / DAFT)",
            psi_rocket_scope_note: "◆ NASA PSI Scope Note: High gas velocities inside rocket engines and thrusters render combustion effectively gravity-independent; PSI focuses on fire safety in habitable crew cabins, spacesuits, bases, and pressurized rovers.",
            th_sel: "Pick",
            th_rank: "Rank",
            th_prog: "Program & Facility",
            th_exp_detail: "Objectives, Sample/Burner Shape, Sensors & Key Findings",
            th_cond: "Test Conditions",
            th_prio: "Thermo & TF-IDF Score",
            th_evid: "Evidence & Runs",
            intra_runs_hint: "Click '◈ Intra-Run Matrix' on any investigation above to inspect how tests within the same investigation differed and what remained constant:",
            cmp_section_title: "◈ Cross-Investigation Similarity & Difference Matrix",
            earth_section_title: "◈ Space-to-Earth Fire Safety Applications (Water Mist • Smoke Detection • Firefighter Gear)",
            stream_panel_title: "◈ Continuous Live Telemetry Stream & Autonomous Simulation Feeder",
            stream_panel_desc: "Continuously polls official NASA APIs (NTRS / OSDR-PSI) or custom JSON/CSV/Web telemetry URLs, dynamically updating the 3D simulation, charts, and tables.",
            stream_target_ph: "Query ('auto' = cycles through all NASA PSI programs) or https://... URL",
            btn_stream_start: "▸ Start Continuous Stream",
            btn_stream_stop: "■ Stop Continuous Stream",
            btn_stream_now: "⌖ Fetch Now",
            chk_stream_sync: "◈ Auto-synchronize 3D Chamber, Charts & Equation Tables as new web data arrives",
            stream_not_started: "Stream loop has not been started yet.",
            live_search_title: "◈ Live NASA NTRS & OSDR/PSI Database Query",
            live_search_desc: "Query official ntrs.nasa.gov and osdr.nasa.gov REST APIs in real time for peer-reviewed microgravity combustion reports and datasets.",
            btn_fetch_live: "▸ Fetch Live",
            ingest_panel_title: "◫ Multimodal File, Flame Imagery & Web Telemetry Analyzer",
            ingest_panel_desc: "Upload flame imagery (.png, .jpg, .webp), scientific datasets (.csv, .json, .pdf, .txt), or paper URLs; extracted parameters sync directly to the 3D chamber and vector index.",
            lbl_scrape_url: "Parse Scientific Web Page / JSON / CSV / PDF URL",
            btn_scrape_url: "Parse & Sync 3D",
            lbl_choose_file: "Select Local Dataset or Flame Image (.png, .jpg, .csv, .json, .pdf, .txt)",
            chk_media_sync: "Automatically apply extracted conditions to 3D Chamber & Tables",
            btn_upload_doc: "▸ Analyze File / Image, Sync to 3D Chamber & Vector Index",
            rag_test_title: "⌖ Semantic Vector Corpus Query",
            rag_search_ph: "Query concepts in vector corpus (EN or TR)...",
            btn_rag_search: "Query",
            copilot_tasks_title: "◈ Ready Engineering Analysis Protocols",
            cp_btn_1: "◈ Synthesize Active 3D & Equations with Evidence",
            cp_btn_2: "◈ Compare EVA Suit (100% O₂) & Lunar Rover",
            cp_btn_3: "◈ Partial Gravity (LUCI/FM2 & E-FIELD) Analysis",
            cp_btn_4: "◈ Cool Flames & DAFT Smoke/Dust Discrimination",
            cp_btn_5: "◈ Water Mist (SoFIE-MIST) & Firefighter Spinoffs",
            copilot_attach_title: "◫ Attach Dataset or Flame Imagery to Analysis",
            copilot_attach_desc: "Selecting a flame image (.png/.jpg) or data file (.csv/.pdf/.json/.txt) updates both the 3D scene and governing equation context:",
            chk_6stage: "◈ 6-Stage Equation & NASA-STD-6001B Halon Critic Active",
            lbl_active_engine: "◈ Active Synthesis Kernel:",
            copilot_ctx_tag: "Live 3D Telemetry + 15 PSI Investigations + Equations Active",
            welcome_title: "◈ ALTAR-NASA // EVIDENCE SYNTHESIS & DECISION CONSOLE [v5.1]",
            kv_solver_lbl: "NUMERICAL SOLVER",
            kv_corpus_lbl: "EVIDENCE CORPUS",
            kv_auditor_lbl: "SAFETY AUDITOR",
            welcome_p1: "Telemetry context locked. This console synthesizes the active 3D chamber state vector, dimensionless transport numbers, ISS flight validation residuals (R² / RMSE), and 15 verified NASA PSI investigations through the deterministic physics solver and offline/hybrid inference kernels.",
            welcome_p2: "Query regime boundaries, invisible cool-flame anomalies, and SoFIE-MIST suppression protocols across ISS modules, EVA spacesuits (100% O₂ @ 4.3 psia), Lunar/Mars surface habitats, and pressurized rovers (10.2 psia).",
            chat_input_ph: "Enter microgravity combustion equation, EVA suit/Lunar rover regime, or NASA PSI query...",
            btn_stop_chat: "■ Stop",
            btn_send_chat: "Execute Analysis ▸",
            set_card1_title: "◈ Numerical Solver Calibration & Synthesis Kernel",
            set_ollama_hub_title: "◈ Local Offline Inference Hub (Deep-Space Autonomous Mode)",
            spec_k1: "ANALYTICAL TRANSPORT SOLVER",
            spec_k2: "ISS FLIGHT CALIBRATION",
            spec_k3: "ZERO-TRUST SOCKET BOUNDARY",
            spec_k4: "ECLSS SAFETY STANDARD",
            con_enforced_badge: "MANDATORY AUDIT ACTIVE",
            acc_opt_badge: "OPTIONAL • LOCAL VAULT",
            btn_check_all: "⌖ Inspect Status",
            lbl_def_provider: "Default Evidence Synthesis Kernel",
            lbl_agy_model: "Local System CLI Inference Bridge & Model Profile",
            lbl_ollama_host: "Local Ollama Server Host",
            lbl_ollama_model: "Installed Local Offline Model",
            lbl_ollama_pull: "Pull New Local Model or Unload Memory (VRAM/RAM)",
            btn_pull: "Pull",
            btn_unload: "✕ Unload",
            btn_test_provider: "▸ Run Live Scientific Verification on Active Kernel",
            set_card2_title: "Advanced External Cloud Inference Gateway, Credential Vault & Formatting Rules (Optional)",
            set_card2_desc: "External gateway credentials are never embedded in source code or executables; stored strictly in your local user vault (%APPDATA%\\AltarNasa\\config.json).",
            lbl_gemini_key: "Google Gemini REST Gateway Key (GEMINI_API_KEY)",
            lbl_gemini_model: "Google Gemini Model Identifier",
            lbl_agy_key: "Local CLI Bridge Fallback Token (Not required if CLI is active)",
            lbl_or_key: "OpenRouter Gateway Key (OPENROUTER_API_KEY)",
            lbl_or_model: "OpenRouter Model Identifier",
            lbl_custom_gw: "Custom OpenAI-Compatible Enterprise Endpoint & Token (Optional)",
            btn_save_cfg: "◈ Save All Calibration & Gateway Configuration",
            set_card3_title: "◈ NASA-STD-6001B & PSI Physical Validation Constraints Matrix (CON-01 .. CON-09)",
            set_card3_desc: "These transport laws, dimensionless regime boundaries, and crew safety constraints are strictly enforced across the analytical solver and all synthesis layers:",
            lbl_extra_dir: "Custom Unit & Reporting Format Constraints (Optional)",
            extra_dir_ph: "e.g., Always report both metric kPa and psia pressure units in synthesis outputs...",
            btn_save_dir: "▸ Update Reporting Format Constraints",
            btn_export_report: "◫ Report (.MD)",
            btn_clear_chat: "✕ Reset",
            shield_badge: "◈ 127.0.0.1 Zero-Trust Isolated",
            lbl_audience: "◈ Target Audience:",
            btn_guided_tour: "▸ Guided Jury Tour",
            chk_flight_pts: "◆ ISS Flight Points",
            btn_export_csv: "◫ Export CSV",
            btn_export_json: "◫ Export JSON",
            cabin_clock_title: "◈ Cabin, Pressurized Rover & EVA Suit Fire Scenario — ECLSS Crew Survival Clock",
            btn_tour_end: "✕ Close",
            btn_tour_next: "Next Step ▸",
        },
    };

    const state = {
        lang: "tr",
        audienceMode: "researcher",
        tourStepIndex: -1,
        presets: [],
        directives: [],
        earthTransfers: [],
        currentSim: null,
        activeSourceLabel: "3B Dijital İkiz",
        activeHardwareFilter: "ALL",
        activeIntraExpId: "PSI-FLEX-01",
        rankedList: [],
        selectedCompareIds: new Set(["PSI-FLEX-01", "PSI-BASS-03", "PSI-SAFFIRE5-07", "PSI-ACME-CFIG-14"]),
        chatHistory: [],
        attachedImageB64: null,
        attachedMediaSummary: "",
        attachedMediaName: "",
        activeChatJobId: null,
        chamber3D: null,
        sonifier: null,
        simDebounceTimer: null,
        rankDebounceTimer: null,
        streamEnabled: false,
        lastStreamSeqId: 0,
        streamPollTimer: null,
        lastStreamStatus: null,
        lastLiveNasaData: null,
        lastProvidersData: null,
    };

    function $(id) {
        return document.getElementById(id);
    }

    function getCsrfToken() {
        const meta = document.querySelector('meta[name="altar-csrf"]');
        return meta ? (meta.getAttribute("content") || "").trim() : "";
    }

    async function apiFetch(url, options) {
        if (typeof window.ALTAR_SERVERLESS_FETCH === "function") {
            return window.ALTAR_SERVERLESS_FETCH(url, options || {});
        }
        const opts = Object.assign({}, options || {});
        const hdrs = Object.assign({}, opts.headers || {});
        const tok = getCsrfToken();
        if (tok) {
            hdrs["X-Altar-CSRF"] = tok;
        }
        opts.headers = hdrs;
        return fetch(url, opts);
    }

    function tStr(key) {
        const dict = UI_I18N[state.lang] || UI_I18N.tr;
        return dict[key] || UI_I18N.tr[key] || key;
    }

    function applyLanguageToDOM() {
        document.documentElement.lang = state.lang;
        document.querySelectorAll("[data-i18n]").forEach((el) => {
            const key = el.getAttribute("data-i18n");
            if (key === "audio_start" && state.sonifier && state.sonifier.active) {
                el.textContent = tStr("audio_stop");
                return;
            }
            if (key === "btn_stream_start" && state.streamEnabled) {
                el.textContent = tStr("btn_stream_stop");
                return;
            }
            if (UI_I18N[state.lang] && UI_I18N[state.lang][key]) {
                el.textContent = UI_I18N[state.lang][key];
            }
        });

        document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
            const key = el.getAttribute("data-i18n-placeholder");
            if (UI_I18N[state.lang] && UI_I18N[state.lang][key]) {
                el.setAttribute("placeholder", UI_I18N[state.lang][key]);
            }
        });

        document.querySelectorAll("option[data-tr][data-en]").forEach((opt) => {
            opt.textContent = state.lang === "en" ? opt.getAttribute("data-en") : opt.getAttribute("data-tr");
        });

        if (window.ALTAR_SERVERLESS_MODE && $("isolation-shield-pill")) {
            $("isolation-shield-pill").textContent =
                state.lang === "en" ? "◈ 100% Serverless Static Isolated" : "◈ %100 Sunucusuz Statik İzole";
        }

        if (!state.streamEnabled && $("header-stream-text")) {
            $("header-stream-text").textContent = state.lang === "en" ? "Stream: Ready" : "Akış: Hazır";
        }
        renderAudienceBanner();
    }

    function renderAudienceBanner() {
        const box = $("audience-guide-banner");
        if (!box) return;
        const isEn = state.lang === "en";
        const mode = state.audienceMode || "researcher";

        const copy = {
            researcher: {
                tr: "◈ **Araştırmacı & Profesör Modu:** Analitik `d²` yasası (`K`), Spalding `B_oq`, Sherwood `Sh`, Damköhler `Da` ve radyatif kayıp (`χ_r`) denklemleri aktif. Grafikler üzerindeki **◆ ISS elmas noktaları** gerçek NASA GRC uçuş telemetrisiyle canlı `R²` / `RMSE` uyumunu gösterir; sağ üstten **CSV / JSON** öngörücü veri setlerini indirebilirsiniz.",
                en: "◈ **Researcher & Professor Mode:** Analytical `d²`-law (`K`), Spalding `B_oq`, Sherwood `Sh`, Damköhler `Da`, and radiative fraction (`χ_r`) highlighted. **◆ ISS diamond markers** overlay NASA GRC flight telemetry with live `R²` / `RMSE` metrics; extract predictive datasets via **Export CSV / JSON** above.",
            },
            student: {
                tr: "◈ **Lisans Öğrencisi Modu (Kavramsal Odak):** Dünya'da (`1G`) ısınan hava yükselerek alevi gözyaşı şekline sokar. Uzayda (`0G`) kaldırma kuvveti yok olur (`Ra = 0`); oksijen yalnızca moleküler difüzyonla ilerlediği için alev **küresel safir-mavi** bir topa dönüşür veya çıplak gözle görülemeyen **550–780 K Soğuk Alev** fazına geçer.",
                en: "◈ **Undergraduate Mode (Conceptual Focus):** On Earth (`1G`), rising hot gas stretches flames into teardrops. In freefall (`0G`), buoyancy vanishes (`Ra = 0`); oxygen arrives purely via molecular diffusion, turning the flame into a **sapphire-blue sphere** or an invisible **550–780 K Cool Flame** that blinds optical smoke detectors.",
            },
            engineer: {
                tr: "◈ **Uçuş Güvenlik Mühendisi Modu (Operasyonel Odak):** EVA uzay giysisi (`4.3 psia / %100 O₂`) ve basınçlı Ay gezgini (`10.2 psia / %32 O₂`) atmosferlerinde azot ısıl balastı azaldığından yayılma hızı sıçrar. Aşağıdaki **ECLSS Yaşam Destek Saati** ile `SMAC 125 ppm CO` süresini izleyin; ilk eylem daima **HVAC Kapatma + İnce Su Sisi (SoFIE-MIST)** olmalıdır (*Halon 1301 yasaktır*).",
                en: "◈ **Flight Safety Engineer Mode (Operational Focus):** Reduced N₂ thermal ballast in EVA suits (`4.3 psia / 100% O₂`) and Lunar rovers (`10.2 psia / 32% O₂`) accelerates flame spread. Monitor the **ECLSS Crew Survival Clock** below for `SMAC 125 ppm CO` margins; execute **HVAC Cutoff + Fine Water Mist (SoFIE-MIST)** (*Halon 1301 strictly prohibited*).",
            },
        };
        const msg = (copy[mode] || copy.researcher)[isEn ? "en" : "tr"];
        box.innerHTML = `<div>${renderSafeMarkdown(msg)}</div>`;
    }

    function showToast(msg) {
        const t = $("app-toast");
        if (!t) return;
        t.textContent = msg;
        t.style.display = "block";
        clearTimeout(t._hideTimer);
        t._hideTimer = setTimeout(() => {
            t.style.display = "none";
        }, 3600);
    }

    function escapeHtml(str) {
        return String(str || "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;");
    }

    function renderSafeMarkdown(mdText) {
        let cleaned = String(mdText || "")
            .replace(/\\text\{([^}]*)\}/g, "$1")
            .replace(/\\mathrm\{([^}]*)\}/g, "$1")
            .replace(/\\mu\b/g, "µ")
            .replace(/\\chi\b/g, "χ")
            .replace(/\\Delta\b/g, "Δ")
            .replace(/\\approx\b/g, "≈")
            .replace(/\\(?:rightarrow|to)\b/g, "→")
            .replace(/\\times\b/g, "×")
            .replace(/\\%/g, "%")
            .replace(/\$([^$\n]{1,80})\$/g, "$1");
        let html = escapeHtml(cleaned);
        html = html.replace(/^####\s+(.+)$/gm, "<h4>$1</h4>");
        html = html.replace(/^###\s+(.+)$/gm, "<h3>$1</h3>");
        html = html.replace(/^##\s+(.+)$/gm, "<h3>$1</h3>");
        html = html.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
        html = html.replace(/\*([^*]+)\*/g, "<em>$1</em>");
        html = html.replace(/`([^`]+)`/g, "<code>$1</code>");
        html = html.replace(
            /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g,
            '<a class="ext-link" href="$2" target="_blank" rel="noopener">$1</a>'
        );
        html = html.replace(
            /^&gt;\s*(.+)$/gm,
            '<div style="margin:8px 0; padding:8px 12px; border-left:3px solid #f59e0b; background:rgba(245,158,11,0.1); border-radius:4px;">$1</div>'
        );
        html = html.replace(/^\-\s+(.+)$/gm, "• $1");
        html = html.replace(/^(\d+)\.\s+(.+)$/gm, '<strong style="color:#38bdf8;">$1.</strong> $2');
        html = html.replace(/\n/g, "<br/>");
        return html;
    }

    function redrawActiveLabCharts() {
        if (!state.currentSim) return;
        const showOverlay = $("chk-flight-overlay") ? $("chk-flight-overlay").checked : true;
        window.AltarCharts.drawFlammabilityMap(
            "chart-flammability",
            state.currentSim.flammability_map,
            state.lang,
            state.currentSim.flight_validation,
            showOverlay
        );
        window.AltarCharts.drawMultiSensorChart(
            "chart-multisensor",
            state.currentSim.sensor_timeseries,
            state.lang,
            state.currentSim.flight_validation,
            showOverlay
        );
    }

    // =========================================================================
    // SEKME GEÇİŞLERİ
    // =========================================================================
    function switchTab(tabId) {
        document.querySelectorAll(".nav-tab").forEach((btn) => {
            btn.classList.toggle("active", btn.dataset.tab === tabId);
        });
        document.querySelectorAll(".tab-section").forEach((sec) => {
            sec.classList.toggle("active", sec.id === tabId);
        });

        if (tabId === "tab-lab") {
            setTimeout(() => {
                if (state.chamber3D) state.chamber3D.resize();
                redrawActiveLabCharts();
            }, 40);
        } else if (tabId === "tab-rank") {
            refreshRankingTable();
        }
    }

    // =========================================================================
    // SİMÜLASYON, 3B WEBGL, KISMİ YERÇEKİMİ & CANLI FORMÜL TABLOSU GÜNCELLEME
    // =========================================================================
    function getSimParamsFromUI() {
        return {
            fuel_id: $("inp-fuel").value,
            gravity_g: parseFloat($("inp-gravity").value),
            oxygen_pct: parseFloat($("inp-oxygen").value),
            pressure_psia: parseFloat($("inp-pressure").value),
            airflow_cms: parseFloat($("inp-airflow").value),
            droplet_d0_mm: parseFloat($("inp-droplet").value),
            diluent: $("inp-diluent").value,
            habitat_id: $("sel-habitat-volume") ? $("sel-habitat-volume").value : "iss_module",
            crew_response_s: $("sel-crew-response") ? parseFloat($("sel-crew-response").value) : 30.0,
        };
    }

    function applyParamsToSliders(p) {
        if (!p) return;
        if (p.fuel_id && Array.from($("inp-fuel").options).some((o) => o.value === p.fuel_id)) {
            $("inp-fuel").value = p.fuel_id;
        }
        if (p.gravity_g !== undefined) $("inp-gravity").value = p.gravity_g;
        if (p.oxygen_pct !== undefined) $("inp-oxygen").value = p.oxygen_pct;
        if (p.pressure_psia !== undefined) $("inp-pressure").value = p.pressure_psia;
        if (p.airflow_cms !== undefined) $("inp-airflow").value = p.airflow_cms;
        if (p.droplet_d0_mm !== undefined) $("inp-droplet").value = p.droplet_d0_mm;
        if (p.diluent) $("inp-diluent").value = p.diluent;
        if (p.habitat_id && $("sel-habitat-volume")) {
            $("sel-habitat-volume").value = p.habitat_id;
        } else if ($("sel-habitat-volume") && p.pressure_psia !== undefined && p.oxygen_pct !== undefined) {
            if (p.pressure_psia <= 5.2 && p.oxygen_pct >= 80) {
                $("sel-habitat-volume").value = "eva_suit";
            } else if (p.pressure_psia <= 11.2 && p.oxygen_pct >= 28) {
                $("sel-habitat-volume").value = p.gravity_g >= 0.1 ? "lunar_rover" : "lunar_hab";
            } else {
                $("sel-habitat-volume").value = "iss_module";
            }
        }
        syncSliderLabels();
    }

    function syncSliderLabels() {
        $("val-gravity").textContent = `${parseFloat($("inp-gravity").value).toFixed(2)} G`;
        $("val-oxygen").textContent = state.lang === "en"
            ? `${parseFloat($("inp-oxygen").value).toFixed(1)}%`
            : `%${parseFloat($("inp-oxygen").value).toFixed(1)}`;
        $("val-pressure").textContent = `${parseFloat($("inp-pressure").value).toFixed(1)} psia`;
        $("val-airflow").textContent = `${parseFloat($("inp-airflow").value).toFixed(1)} cm/s`;
        $("val-droplet").textContent = `${parseFloat($("inp-droplet").value).toFixed(1)} mm`;
    }

    function applySimulationStateEverywhere(simData, sourceLabel) {
        if (!simData) return;
        state.currentSim = simData;
        if (sourceLabel) {
            state.activeSourceLabel = sourceLabel;
        }
        renderTelemetryAndFormulaTables(simData);
        if (state.chamber3D) {
            state.chamber3D.updateFromSimulation(simData);
        }
        if (state.sonifier) {
            state.sonifier.updateTelemetry(simData.telemetry);
        }
        clearTimeout(state.rankDebounceTimer);
        state.rankDebounceTimer = setTimeout(refreshRankingTable, 160);
    }

    async function runSimulationUpdate(sourceLabel) {
        syncSliderLabels();
        const params = getSimParamsFromUI();
        try {
            const res = await apiFetch("/api/simulate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(params),
            });
            const data = await res.json();
            const defaultLbl = state.lang === "en" ? "3D Digital Twin Sliders" : "3B Dijital İkiz Kaydırıcıları";
            applySimulationStateEverywhere(data, sourceLabel || defaultLbl);
        } catch (err) {
            console.error("Simulation API error:", err);
        }
    }

    function scheduleSimUpdate() {
        syncSliderLabels();
        clearTimeout(state.simDebounceTimer);
        state.simDebounceTimer = setTimeout(() => {
            const lbl = state.lang === "en" ? "3D Digital Twin Sliders" : "3B Dijital İkiz Kaydırıcıları";
            runSimulationUpdate(lbl);
        }, 45);
    }

    function renderCabinTimeline(tl) {
        if (!tl) return;
        const isEn = state.lang === "en";
        const badgeEl = $("cabin-severity-badge");
        const sumEl = $("cabin-timeline-summary");
        const gridEl = $("cabin-milestones-grid");
        if (!badgeEl || !sumEl || !gridEl) return;

        badgeEl.textContent = isEn ? tl.badge_en : tl.badge_tr;
        badgeEl.style.color =
            tl.severity === "CRITICAL" ? "#fca5a5" : tl.severity === "WARNING" ? "#fcd34d" : "#6ee7b7";
        badgeEl.style.borderColor =
            tl.severity === "CRITICAL" ? "rgba(239,68,68,0.5)" : tl.severity === "WARNING" ? "rgba(245,158,11,0.5)" : "rgba(16,185,129,0.5)";

        sumEl.innerHTML = renderSafeMarkdown(isEn ? tl.summary_en : tl.summary_tr);
        gridEl.innerHTML = "";
        (tl.milestones || []).forEach((m) => {
            const div = document.createElement("div");
            div.className = `milestone-card ${m.state || "ok"}`;
            const title = isEn ? m.title_en : m.title_tr;
            const det = isEn ? m.detail_en : m.detail_tr;
            div.innerHTML = `
                <div style="font-weight:700; color:#f8fafc; margin-bottom:4px;">${escapeHtml(title)}</div>
                <div style="color:#cbd5e1;">${escapeHtml(det)}</div>
            `;
            gridEl.appendChild(div);
        });
    }

    function renderTelemetryAndFormulaTables(sim) {
        const tel = sim.telemetry;
        const call = sim.callouts;
        const isEn = state.lang === "en";

        $("tel-temp").textContent = `${tel.flame_temp_k.toFixed(0)} K`;
        $("tel-temp-c").textContent = `${tel.flame_temp_c.toFixed(0)} °C`;
        $("tel-moc").textContent = isEn ? `${tel.moc_pct}%` : `%${tel.moc_pct}`;
        const po2Psia = tel.o2_partial_psia !== undefined ? tel.o2_partial_psia : tel.po2_psia;
        const po2Kpa = tel.o2_partial_kpa !== undefined ? tel.o2_partial_kpa : tel.po2_kpa;
        $("tel-po2").textContent = `P_O₂: ${po2Psia} psia (${po2Kpa} kPa)`;
        $("tel-kburn").textContent = `${tel.burning_rate_k_mm2_s} mm²/s`;
        $("tel-lifetime").textContent = tel.burn_lifetime_s > 0
            ? (isEn ? `Burn Life: ~${tel.burn_lifetime_s} s` : `Ömür: ~${tel.burn_lifetime_s} sn`)
            : (isEn ? "Extinguished" : "Sönümlendi");
        $("tel-spread").textContent = `${tel.flame_spread_mm_s} mm/s`;
        const rfRd = tel.standoff_ratio_rf_rd !== undefined ? tel.standoff_ratio_rf_rd : tel.standoff_ratio;
        $("tel-radius").textContent = `B_oq: ${tel.spalding_b_number} • Rf/Rd: ${rfRd}`;
        $("tel-radloss").textContent = isEn
            ? `${(tel.radiative_loss_fraction * 100).toFixed(1)}%`
            : `%${(tel.radiative_loss_fraction * 100).toFixed(1)}`;
        $("tel-flux").textContent = isEn
            ? `Heat Flux: ${tel.heat_flux_kw_m2} kW/m²`
            : `Isı Akısı: ${tel.heat_flux_kw_m2} kW/m²`;
        $("tel-co").textContent = `${tel.co_ppm} ppm`;
        $("tel-soot").textContent = `Soot: ${tel.soot_index} • Sh: ${tel.sherwood_number} • Da: ${tel.damkohler_number}`;

        $("tel-risk-score").textContent = `${tel.risk_score} / 100`;
        $("tel-risk-bar").style.width = `${tel.risk_score}%`;
        $("tel-risk-score").style.color =
            tel.risk_score >= 70 ? "#f87171" : tel.risk_score >= 40 ? "#fcd34d" : "#6ee7b7";

        if ($("flight-val-badge") && sim.flight_validation) {
            $("flight-val-badge").textContent = isEn
                ? sim.flight_validation.benchmark_en
                : sim.flight_validation.benchmark_tr;
        }

        const badgeEl = $("hud-regime-badge");
        badgeEl.textContent = isEn ? call.badge_en : call.badge_tr;
        badgeEl.className = "regime-pill";
        const wrapEl = $("chamber-viewport-wrap");
        wrapEl.classList.remove("uv-mode");

        if (tel.cool_flame_active) {
            badgeEl.classList.add("cool-flame");
            wrapEl.classList.add("uv-mode");
        } else if (tel.extinguished) {
            badgeEl.classList.add("extinguished");
        }

        $("hud-callout-summary").textContent = isEn ? call.summary_en : call.summary_tr;
        $("formula-active-source-badge").textContent = isEn
            ? `Source: ${state.activeSourceLabel}`
            : `Kaynak: ${state.activeSourceLabel}`;

        // Kısmi Yerçekimi (LUCI/FM2) veya EVA Uzay Giysisi / Ay Gezgini Şeffaflık Kutusu
        const pgBanner = $("partial-g-banner");
        if (pgBanner) {
            const pgInfo = sim.partial_gravity_info;
            if (pgInfo && pgInfo.show_banner) {
                const rawMsg = isEn ? pgInfo.en : pgInfo.tr;
                pgBanner.innerHTML = renderSafeMarkdown(rawMsg);
                pgBanner.style.display = "block";
            } else {
                pgBanner.style.display = "none";
            }
        }

        // Canlı Fiziksel Denklemler & Boyutsuz Sayılar Sonuç Tablosu
        const ftBody = $("formula-results-tbody");
        if (ftBody) {
            ftBody.innerHTML = "";
            (sim.formula_table || []).forEach((row) => {
                const tr = document.createElement("tr");
                const name = isEn ? (row.law_en || row.parameter_en) : (row.law_tr || row.parameter_tr);
                const status = isEn ? (row.status_en || row.status) : (row.status_tr || row.status);
                tr.innerHTML = `
                    <td><strong style="color:#f8fafc;">${escapeHtml(name)}</strong></td>
                    <td><span class="formula-eq-code">${escapeHtml(row.equation)}</span></td>
                    <td style="font-family:Consolas,monospace; font-weight:700; color:#fcd34d;">${escapeHtml(row.value)}</td>
                    <td><span class="preset-badge">${escapeHtml(status)}</span></td>
                `;
                ftBody.appendChild(tr);
            });
        }

        // Anlık Dinamik Analitik & Formülsel Veri Sentezi
        const liveAiBox = $("live-formula-ai-box");
        if (liveAiBox && sim.instant_ai_summary) {
            const rawSummary = isEn ? sim.instant_ai_summary.en : sim.instant_ai_summary.tr;
            const mediaLbl = isEn ? "Active Media Context" : "Aktif Medya Bağlamı";
            const mediaBanner = state.attachedMediaName
                ? `<div style="margin-bottom:8px; padding:5px 9px; background:rgba(16,185,129,0.12); border:1px solid rgba(16,185,129,0.35); border-radius:6px; font-size:11.8px; color:#6ee7b7;">◫ ${mediaLbl}: <strong>${escapeHtml(state.attachedMediaName)}</strong></div>`
                : "";
            liveAiBox.innerHTML = mediaBanner + renderSafeMarkdown(rawSummary);
        }

        if (sim.scenario_timeline) {
            renderCabinTimeline(sim.scenario_timeline);
        }
        renderAudienceBanner();
        redrawActiveLabCharts();
    }

    // =========================================================================
    // EVRENSEL DOSYA (.CSV/.JSON/.PDF/.TXT) VE ALEV RESMİ (.PNG/.JPG) İŞLEYİCİ
    // =========================================================================
    async function ingestMediaFile(fileObj, syncTo3D, targetStatusElId) {
        if (!fileObj) return;
        const isEn = state.lang === "en";
        const statusEl = targetStatusElId ? $(targetStatusElId) : null;
        if (statusEl) {
            statusEl.style.color = "#7dd3fc";
            statusEl.textContent = isEn
                ? `◈ Analyzing '${fileObj.name}' and extracting combustion parameters...`
                : `◈ '${fileObj.name}' analiz ediliyor ve parametreler çıkarılıyor...`;
        }
        showToast(isEn ? `◈ Processing '${fileObj.name}'...` : `◈ '${fileObj.name}' işleniyor...`);

        const fd = new FormData();
        fd.append("file", fileObj);

        try {
            const res = await apiFetch("/api/ingest-media", { method: "POST", body: fd });
            const data = await res.json();
            if (!data.ok) {
                if (statusEl) {
                    statusEl.style.color = "#fca5a5";
                    statusEl.textContent = `▲ ${data.error || "Error"}`;
                }
                showToast(`▲ ${data.error || "Failed"}`);
                return;
            }

            state.attachedMediaName = data.filename || fileObj.name;
            state.attachedMediaSummary = data.summary_tr || "";
            if (data.media_type === "image" && data.image_base64) {
                state.attachedImageB64 = data.image_base64;
            } else {
                state.attachedImageB64 = null;
            }

            $("copilot-live-context-tag").textContent = isEn
                ? `◫ Active Media: ${state.attachedMediaName} + 3D Equations`
                : `◫ Aktif Veri: ${state.attachedMediaName} + 3B Denklemler`;

            if (syncTo3D && data.extracted_sim_params) {
                applyParamsToSliders(data.extracted_sim_params);
                if (state.chamber3D) state.chamber3D.reigniteDroplet();
                const srcTag = isEn ? `Uploaded (${state.attachedMediaName})` : `Yüklenen Veri (${state.attachedMediaName})`;
                if (data.simulation) {
                    applySimulationStateEverywhere(data.simulation, srcTag);
                } else {
                    await runSimulationUpdate(srcTag);
                }
            }

            const shortInfo =
                data.media_type === "image"
                    ? `◫ ${state.attachedMediaName} -> ${data.metrics.detected_regime_tr}`
                    : `◫ ${state.attachedMediaName} (${data.chunks} chunks) -> O₂:%${data.extracted_sim_params.oxygen_pct}, ${data.extracted_sim_params.airflow_cms} cm/s`;

            if (statusEl) {
                statusEl.style.color = "#6ee7b7";
                const btnTxt = isEn ? "⌖ Synthesize in Console" : "⌖ Konsolda Analiz Et";
                statusEl.innerHTML = `${escapeHtml(shortInfo)} <button class="btn-secondary" id="dyn-ask-ai-${targetStatusElId}" style="margin-left:6px; padding:2px 8px; font-size:11px;">${btnTxt}</button>`;
                const dynBtn = $(`dyn-ask-ai-${targetStatusElId}`);
                if (dynBtn) {
                    dynBtn.addEventListener("click", () => {
                        switchTab("tab-copilot");
                        sendChatMessage(
                            isEn
                                ? `Analyze my uploaded dataset/image '${state.attachedMediaName}', its extracted combustion parameters, and 3D telemetry using governing equations (K, B_oq, Sh, Ra, Da, MOC) and compare with NASA PSI investigations.`
                                : `Az önce yüklediğim '${state.attachedMediaName}' kaynağındaki verileri, çıkarılan yanma parametrelerini ve 3B simülasyon sonuçlarını fiziksel formüllerle (K, B_oq, Sh, Ra, Da, MOC) analiz et ve NASA PSI deneyleriyle kıyasla.`
                        );
                    });
                }
            }

            const previewBox = $("media-analysis-result-box");
            if (previewBox) {
                const thumbHtml =
                    data.media_type === "image" && data.image_base64
                        ? `<img src="${data.image_base64}" alt="Flame Preview" />`
                        : "";
                previewBox.innerHTML = `
                    <div class="media-preview-card">
                        ${thumbHtml}
                        <div style="flex:1; font-size:12px;">
                            <div>${renderSafeMarkdown(data.summary_tr || "")}</div>
                            <div style="margin-top:8px; display:flex; gap:8px; flex-wrap:wrap;">
                                <button class="btn-primary" id="btn-preview-goto-3d" style="padding:4px 10px; font-size:11.5px;">${isEn ? "▸ View in 3D Chamber" : "▸ 3B Sahneyi Gör"}</button>
                                <button class="btn-secondary" id="btn-preview-ask-ai" style="padding:4px 10px; font-size:11.5px;">${isEn ? "⌖ Evidence Synthesis" : "⌖ Kanıt Konsolunda Sentezle"}</button>
                            </div>
                        </div>
                    </div>
                `;
                $("btn-preview-goto-3d").addEventListener("click", () => switchTab("tab-lab"));
                $("btn-preview-ask-ai").addEventListener("click", () => {
                    switchTab("tab-copilot");
                    sendChatMessage(
                        isEn
                            ? `Analyze my uploaded '${state.attachedMediaName}' data via governing combustion laws (d²-law, Spalding B_oq, Sherwood Sh, MOC) and rank matching NASA PSI experiments.`
                            : `Yüklediğim '${state.attachedMediaName}' verisini formüllerle (D² yasası, Spalding B_oq, Sherwood Sh, MOC) analiz et; ilgili NASA PSI deneylerini sırala ve yangın güvenliği önerilerini sun.`
                    );
                });
            }

            const chatSt = $("chat-image-status");
            if (chatSt) {
                chatSt.innerHTML = `◫ <strong>${escapeHtml(state.attachedMediaName)}</strong> <button class="btn-secondary" id="btn-clear-chat-media" style="padding:1px 6px; font-size:10.5px; margin-left:5px;">✕ ${isEn ? "Clear" : "Temizle"}</button>`;
                const clr = $("btn-clear-chat-media");
                if (clr) {
                    clr.addEventListener("click", () => {
                        state.attachedImageB64 = null;
                        state.attachedMediaSummary = "";
                        state.attachedMediaName = "";
                        chatSt.textContent = "";
                        $("inp-chat-image").value = "";
                        $("copilot-live-context-tag").textContent = tStr("copilot_ctx_tag");
                    });
                }
            }

            showToast(
                isEn
                    ? `● '${state.attachedMediaName}' synced to 3D Chamber, Tables & Vector Corpus.`
                    : `● '${state.attachedMediaName}' 3B Simülasyon, Tablolar ve Vektör Korpusuna aktarıldı.`
            );
        } catch (err) {
            if (statusEl) {
                statusEl.style.color = "#fca5a5";
                statusEl.textContent = `Error: ${err.message}`;
            }
            showToast(`▲ ${err.message}`);
        }
    }

    // =========================================================================
    // SÜREKLİ CANLI TELEMETRİ VERİ AKIŞI (CONTINUOUS STREAM ENGINE)
    // =========================================================================
    function updateStreamHeaderAndUI(st) {
        if (!st) return;
        state.lastStreamStatus = st;
        const isEn = state.lang === "en";
        state.streamEnabled = Boolean(st.enabled);
        const dot = $("header-stream-dot");
        const txt = $("header-stream-text");
        const badge = $("stream-state-badge");
        const btn = $("btn-stream-toggle");
        const panel = $("continuous-stream-panel");
        const meta = $("stream-meta-info");

        if (state.streamEnabled) {
            dot.style.background = "#10b981";
            dot.style.boxShadow = "0 0 8px #10b981";
            txt.textContent = isEn ? `Stream Live (#${st.seq_id || 0})` : `Akış Aktif (#${st.seq_id || 0})`;
            badge.textContent = isEn ? `● Live Stream (${st.interval_sec} s)` : `● Sürekli Akış Aktif (${st.interval_sec} sn)`;
            btn.textContent = tStr("btn_stream_stop");
            btn.className = "btn-danger";
            panel.classList.add("stream-panel-active");
        } else {
            dot.style.background = "#64748b";
            dot.style.boxShadow = "none";
            txt.textContent = isEn ? "Stream: Idle" : "Akış: Kapalı";
            badge.textContent = isEn ? "Idle (Ready)" : "Kapalı (Hazır)";
            btn.textContent = tStr("btn_stream_start");
            btn.className = "btn-primary";
            panel.classList.remove("stream-panel-active");
        }

        if (st.last_error) {
            meta.innerHTML = `<span style="color:#fca5a5;">▲ (${escapeHtml(st.last_fetch_time)}): ${escapeHtml(st.last_error)}</span>`;
        } else if (st.last_fetch_time) {
            meta.textContent = isEn
                ? `Last Poll: ${st.last_fetch_time} • Packets: ${st.seq_id} • Source: ${st.source.toUpperCase()}`
                : `Son Çekim: ${st.last_fetch_time} • Toplam Akış Paketi: ${st.seq_id} • Kaynak: ${st.source.toUpperCase()}`;
        }

        if (st.seq_id && st.seq_id > state.lastStreamSeqId) {
            const isFirstBoot = state.lastStreamSeqId === 0 && !state.streamEnabled;
            state.lastStreamSeqId = st.seq_id;
            renderStreamEventsList(st.events || []);

            if (!isFirstBoot && $("chk-stream-autosync").checked && st.latest_sim_params) {
                const topEv = st.events && st.events[0] ? st.events[0] : null;
                const srcTag = topEv ? `Live Stream (${topEv.id})` : "Live Stream";
                if (topEv) {
                    state.attachedMediaName = `${topEv.id}: ${topEv.title.slice(0, 48)}`;
                    state.attachedMediaSummary = `◈ **Live Stream (${topEv.id} • ${topEv.time}):** ${topEv.title}\n${topEv.summary}`;
                }
                applyParamsToSliders(st.latest_sim_params);
                if (state.chamber3D) state.chamber3D.reigniteDroplet();
                runSimulationUpdate(srcTag);
                showToast(
                    isEn
                        ? `◈ New Telemetry (${topEv ? topEv.id : "#" + st.seq_id}) -> 3D & Tables Synced.`
                        : `◈ Yeni Telemetri Paketi (${topEv ? topEv.id : "#" + st.seq_id}) -> 3B Simülasyon & Tablolar Güncellendi.`
                );
            }
        } else if (st.events && $("stream-events-box").children.length === 0 && st.events.length > 0) {
            renderStreamEventsList(st.events);
        }
    }

    function renderStreamEventsList(events) {
        const box = $("stream-events-box");
        if (!box) return;
        const isEn = state.lang === "en";
        box.innerHTML = "";
        events.forEach((ev) => {
            const p = ev.extracted_sim_params || {};
            const div = document.createElement("div");
            div.className = "stream-event-item";
            div.innerHTML = `
                <div style="display:flex; justify-content:space-between; align-items:center; gap:8px; margin-bottom:3px;">
                    <div>
                        <span class="preset-badge">#${ev.seq_id} • ${escapeHtml(ev.time)}</span>
                        <strong style="color:#38bdf8; margin-left:6px;">[${escapeHtml(ev.id)}] ${escapeHtml(ev.title)}</strong>
                    </div>
                    <span style="font-family:Consolas,monospace; font-size:11.5px; color:#fcd34d;">
                        ${escapeHtml(p.fuel_id || "n_heptane")} • ${p.oxygen_pct ?? 21}% O₂ • ${p.pressure_psia ?? 14.7} psia • ${p.airflow_cms ?? 2} cm/s
                    </span>
                </div>
                <div style="color:#cbd5e1; margin-bottom:6px;">${escapeHtml(ev.summary)}</div>
                <div style="display:flex; gap:10px; align-items:center;">
                    ${ev.url ? `<a class="ext-link" href="${escapeHtml(ev.url)}" target="_blank" rel="noopener" style="font-size:11.5px;">◈ ${isEn ? "Open Source ↗" : "Kaynağı Aç ↗"}</a>` : ""}
                    <button class="btn-secondary stream-ev-sync-btn" style="padding:2px 8px; font-size:11px;">${isEn ? "⌖ Apply to 3D & Synthesize" : "⌖ 3B'ye Uygula & Sentezle"}</button>
                </div>
            `;
            div.querySelector(".stream-ev-sync-btn").addEventListener("click", () => {
                applyParamsToSliders(p);
                state.attachedMediaName = `${ev.id} (${ev.title.slice(0, 45)})`;
                state.attachedMediaSummary = `◈ **[${ev.id}]:** ${ev.title}\n${ev.summary}`;
                runSimulationUpdate(`Live (${ev.id})`);
                switchTab("tab-copilot");
                sendChatMessage(
                    isEn
                        ? `Analyze live web stream record [${ev.id}] '${ev.title}', its extracted parameters, and current 3D equation telemetry.`
                        : `Canlı web akışından gelen [${ev.id}] '${ev.title}' verisini, çıkarılan parametreleri ve mevcut 3B yanma odası formül sonuçlarını analiz et.`
                );
            });
            box.appendChild(div);
        });
    }

    async function configureContinuousStream(enableFlag, immediateFlag) {
        const src = $("sel-stream-source").value;
        const target = $("inp-stream-target").value.trim() || "auto";
        const intervalSec = parseInt($("sel-stream-interval").value, 10) || 25;
        const autoSync = $("chk-stream-autosync").checked;

        try {
            const res = await apiFetch("/api/stream/config", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    enabled: enableFlag,
                    source: src,
                    query_or_url: target,
                    interval_sec: intervalSec,
                    auto_sync_sim: autoSync,
                    trigger_immediate: Boolean(immediateFlag),
                }),
            });
            const st = await res.json();
            updateStreamHeaderAndUI(st);
            if (enableFlag || immediateFlag) {
                setTimeout(pollStreamStatusOnce, 1400);
                setTimeout(pollStreamStatusOnce, 3200);
            }
        } catch (err) {
            showToast(`▲ ${err.message}`);
        }
    }

    async function pollStreamStatusOnce() {
        try {
            const res = await apiFetch("/api/stream/status");
            const st = await res.json();
            updateStreamHeaderAndUI(st);
        } catch (_) {}
    }

    // =========================================================================
    // SEKME 2: FİZİK-TEMELLİ DENEY SIRALAMA, DONANIM FİLTRESİ, DENEY İÇİ TESTLER & KIYASLAMA
    // =========================================================================
    async function refreshRankingTable() {
        const params = getSimParamsFromUI();
        const query = $("inp-rank-query") ? $("inp-rank-query").value.trim() : "";
        try {
            const res = await apiFetch("/api/rank", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    mission_params: params,
                    query,
                    hardware_filter: state.activeHardwareFilter,
                }),
            });
            const data = await res.json();
            state.rankedList = data.ranked_experiments || [];
            renderRankingRows();
            const activeIntra =
                state.rankedList.find((x) => x.exp_id === state.activeIntraExpId) || state.rankedList[0];
            if (activeIntra) {
                renderIntraRunsForExperiment(activeIntra);
            }
            runComparisonUpdate();
        } catch (err) {
            console.error("Ranking error:", err);
        }
    }

    function renderRankingRows() {
        const tbody = $("ranking-tbody");
        if (!tbody) return;
        tbody.innerHTML = "";
        const isEn = state.lang === "en";

        state.rankedList.forEach((exp) => {
            const tr = document.createElement("tr");
            const checked = state.selectedCompareIds.has(exp.exp_id) ? "checked" : "";
            const scoreCls =
                exp.priority_score >= 72 ? "score-high" : exp.priority_score >= 52 ? "score-med" : "score-low";
            const title = isEn ? exp.title : exp.title_tr;
            const finding = isEn ? exp.key_finding_en : exp.key_finding_tr;
            const insight = isEn ? exp.safety_insight_en : exp.safety_insight_tr;
            const geom = isEn ? (exp.sample_geometry_en || exp.material) : (exp.sample_geometry_tr || exp.material);
            const sens = isEn ? (exp.sensors_en || "") : (exp.sensors_tr || "");

            tr.innerHTML = `
                <td><input type="checkbox" class="cmp-check" data-id="${escapeHtml(exp.exp_id)}" ${checked} /></td>
                <td><strong>#${exp.rank}</strong></td>
                <td>
                    <strong style="color:#38bdf8;">${escapeHtml(exp.program)}</strong><br/>
                    <span class="preset-badge" style="margin-top:3px; display:inline-block;">${escapeHtml(exp.hardware_group || "CIR")}</span><br/>
                    <span style="font-size:10.8px; color:#94a3b8;">${escapeHtml(exp.exp_id)} (${exp.year})</span>
                </td>
                <td>
                    <div style="font-weight:700; color:#f8fafc; margin-bottom:4px;">${escapeHtml(title)}</div>
                    <div style="font-size:12.4px; color:#cbd5e1;">${escapeHtml(finding)}</div>
                    <div class="meta-detail-line">◈ <strong>${isEn ? "Sample/Burner:" : "Numune/Brülör:"}</strong> ${escapeHtml(geom)}</div>
                    ${sens ? `<div class="meta-detail-line" style="color:#c4b5fd;">⌖ <strong>${isEn ? "Sensors:" : "Sensörler:"}</strong> ${escapeHtml(sens)}</div>` : ""}
                    <div style="font-size:12px; color:#6ee7b7; margin-top:4px;">◆ ${escapeHtml(insight)}</div>
                </td>
                <td style="font-family:Consolas,monospace; font-size:12px;">
                    O₂: ${exp.oxygen_pct}% | ${exp.pressure_psia} psia<br/>
                    ${isEn ? "Flow" : "Akış"}: ${exp.airflow_cms} cm/s<br/>
                    MOC: <strong>${exp.moc_measured_pct}%</strong>
                </td>
                <td>
                    <span class="score-badge ${scoreCls}">${exp.priority_score}</span>
                    <div style="font-size:11px; color:#94a3b8; margin-top:4px;">${isEn ? "Risk" : "Risk"}: ${exp.mission_hazard_score}/100</div>
                </td>
                <td>
                    <a class="ext-link" href="${escapeHtml(exp.ntrs_url)}" target="_blank" rel="noopener">
                        ◫ NTRS ${escapeHtml(exp.ntrs_id)} ↗
                    </a><br/>
                    <button class="btn-secondary load-exp-sim-btn" data-id="${escapeHtml(exp.exp_id)}" style="margin-top:5px; padding:3px 8px; font-size:11px; width:100%; justify-content:center;">
                        ${isEn ? "▸ Load in 3D" : "▸ 3B'de Yükle"}
                    </button>
                    <button class="btn-secondary show-intra-runs-btn" data-id="${escapeHtml(exp.exp_id)}" style="margin-top:4px; padding:3px 8px; font-size:11px; width:100%; justify-content:center; border-color:rgba(56,189,248,0.45); color:#7dd3fc;">
                        ${isEn ? "◈ Intra-Run Matrix" : "◈ Test Varyasyonları"}
                    </button>
                </td>
            `;
            tbody.appendChild(tr);
        });

        tbody.querySelectorAll(".cmp-check").forEach((chk) => {
            chk.addEventListener("change", (e) => {
                const id = e.target.dataset.id;
                if (e.target.checked) {
                    if (state.selectedCompareIds.size >= 4) {
                        e.target.checked = false;
                        showToast(isEn ? "Select up to 4 investigations at once." : "En fazla 4 deney aynı anda karşılaştırılabilir.");
                        return;
                    }
                    state.selectedCompareIds.add(id);
                } else {
                    state.selectedCompareIds.delete(id);
                }
                runComparisonUpdate();
            });
        });

        tbody.querySelectorAll(".load-exp-sim-btn").forEach((btn) => {
            btn.addEventListener("click", () => {
                const exp = state.rankedList.find((x) => x.exp_id === btn.dataset.id);
                if (exp) {
                    applyParamsToSliders({
                        fuel_id: exp.fuel_id,
                        gravity_g: exp.gravity_g,
                        oxygen_pct: exp.oxygen_pct,
                        pressure_psia: exp.pressure_psia,
                        airflow_cms: exp.airflow_cms,
                    });
                    switchTab("tab-lab");
                    runSimulationUpdate(`NASA PSI (${exp.program} • ${exp.exp_id})`);
                    showToast(
                        isEn
                            ? `● ${exp.program} conditions loaded into 3D Chamber & Equation Table.`
                            : `● ${exp.program} deney koşulları 3B Yanma Odasına ve Formül Tablosuna yüklendi.`
                    );
                }
            });
        });

        tbody.querySelectorAll(".show-intra-runs-btn").forEach((btn) => {
            btn.addEventListener("click", () => {
                const exp = state.rankedList.find((x) => x.exp_id === btn.dataset.id);
                if (exp) {
                    state.activeIntraExpId = exp.exp_id;
                    renderIntraRunsForExperiment(exp);
                    const sec = $("intra-runs-section");
                    if (sec) sec.scrollIntoView({ behavior: "smooth", block: "nearest" });
                }
            });
        });
    }

    function renderIntraRunsForExperiment(exp) {
        const box = $("intra-runs-cards");
        const titleEl = $("intra-runs-title");
        const badgeEl = $("intra-runs-badge");
        if (!box || !exp) return;

        const isEn = state.lang === "en";
        titleEl.textContent = isEn
            ? `◈ Intra-Investigation Test Matrix (${exp.program}): How Tests Differed & Stayed the Same`
            : `◈ Soruşturma İçi Test Varyasyonları (${exp.program}): Aynı Soruşturmadaki Testler Nasıl Farklıydı ve Nasıl Aynıydı?`;
        badgeEl.textContent = `${exp.exp_id} • ${exp.facility}`;

        box.innerHTML = "";
        (exp.intra_runs || []).forEach((r) => {
            const card = document.createElement("div");
            card.className = "intra-run-card";
            const sameTxt = isEn ? r.same_en : r.same_tr;
            const diffTxt = isEn ? r.diff_en : r.diff_tr;
            const resTxt = isEn ? r.result_en : r.result_tr;
            card.innerHTML = `
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
                    <strong style="color:#38bdf8; font-family:Consolas,monospace; font-size:13px;">◈ ${escapeHtml(r.run_code)}</strong>
                    <span class="preset-badge">${escapeHtml(exp.program)}</span>
                </div>
                <div style="margin-bottom:5px; color:#cbd5e1;">
                    <strong style="color:#94a3b8;">${isEn ? "◆ Held Constant (Same):" : "◆ Sabit Tutulan (Aynı):"}</strong> ${escapeHtml(sameTxt)}
                </div>
                <div style="margin-bottom:5px; color:#fde68a;">
                    <strong>${isEn ? "▸ Varied Parameter (Differed):" : "▸ Değiştirilen Değişken (Farklı):"}</strong> ${escapeHtml(diffTxt)}
                </div>
                <div style="color:#6ee7b7;">
                    <strong>${isEn ? "● Observed Outcome:" : "● Gözlemlenen Sonuç:"}</strong> ${escapeHtml(resTxt)}
                </div>
            `;
            box.appendChild(card);
        });
    }

    async function runComparisonUpdate() {
        const ids = Array.from(state.selectedCompareIds);
        const isEn = state.lang === "en";
        try {
            const res = await apiFetch("/api/compare", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ exp_ids: ids, mission_params: getSimParamsFromUI() }),
            });
            const data = await res.json();
            $("comparison-synthesis-banner").innerHTML = renderSafeMarkdown(
                isEn ? data.synthesis_en : data.synthesis_tr
            );

            const box = $("comparison-cards-container");
            box.innerHTML = "";
            (data.experiments || []).forEach((e) => {
                const card = document.createElement("div");
                card.className = "compare-card";
                const geom = isEn ? (e.sample_geometry_en || e.material) : (e.sample_geometry_tr || e.material);
                const sens = isEn ? (e.sensors_en || "") : (e.sensors_tr || "");
                card.innerHTML = `
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
                        <strong style="color:#38bdf8; font-size:14px;">${escapeHtml(e.program)}</strong>
                        <span class="preset-badge">MOC: ${e.moc_measured_pct}% O₂</span>
                    </div>
                    <div style="font-size:12.3px; font-weight:700; margin-bottom:5px; color:#f8fafc;">${escapeHtml(geom)}</div>
                    <div style="font-size:11.8px; color:#94a3b8; margin-bottom:6px;">
                        ◈ ${escapeHtml(e.facility)}<br/>
                        ⌖ ${e.oxygen_pct}% O₂ • ${e.pressure_psia} psia • ${e.airflow_cms} cm/s<br/>
                        ▸ ${escapeHtml(e.burning_rate_or_spread)}<br/>
                        ◫ ${escapeHtml(sens)}<br/>
                        ◆ Cool Flame: <strong>${e.cool_flame_observed ? (isEn ? "Yes (Observed)" : "Evet (Gözlendi)") : (isEn ? "No" : "Hayır")}</strong>
                    </div>
                    <a class="ext-link" href="${escapeHtml(e.ntrs_url)}" target="_blank" rel="noopener" style="font-size:12px;">
                        NTRS #${escapeHtml(e.ntrs_id)} ↗
                    </a>
                `;
                box.appendChild(card);
            });
        } catch (err) {
            console.error("Compare error:", err);
        }
    }

    // =========================================================================
    // SEKME 3: MANUEL CANLI NASA ARAMA
    // =========================================================================
    async function fetchLiveNasaData() {
        const q = $("inp-live-nasa-q").value.trim() || "microgravity combustion";
        const source = $("sel-live-source").value;
        const badge = $("live-api-badge");
        const listBox = $("live-nasa-results-list");
        const isEn = state.lang === "en";

        badge.textContent = isEn ? "◈ Querying NASA API..." : "◈ NASA Sunucusuna Bağlanılıyor...";
        listBox.innerHTML = `<div style="padding:14px; color:#94a3b8;">${isEn ? "Fetching live NASA records..." : "Canlı NASA verileri çekiliyor..."}</div>`;

        try {
            const res = await apiFetch(`/api/nasa-live?source=${encodeURIComponent(source)}&q=${encodeURIComponent(q)}`);
            const data = await res.json();
            state.lastLiveNasaData = data;
            renderLiveNasaCards(data);
        } catch (err) {
            badge.textContent = "Error";
            listBox.innerHTML = `<div style="padding:14px; color:#fca5a5;">${escapeHtml(err.message)}</div>`;
        }
    }

    function renderLiveNasaCards(data) {
        if (!data) return;
        const badge = $("live-api-badge");
        const listBox = $("live-nasa-results-list");
        const isEn = state.lang === "en";

        badge.textContent =
            data.source_status === "live_online"
                ? `● NASA Live (${data.count})`
                : data.source_status === "cached_live"
                ? `◆ Cached (${data.count})`
                : "▲ Offline";

        listBox.innerHTML = "";
        if (!data.items || data.items.length === 0) {
            listBox.innerHTML = `<div style="padding:14px; color:#fca5a5;">${isEn ? "No records found." : "Sonuç bulunamadı."} ${escapeHtml(data.error || "")}</div>`;
            return;
        }

        data.items.forEach((item) => {
            const div = document.createElement("div");
            div.className = "live-result-card";
            div.innerHTML = `
                <div style="display:flex; justify-content:space-between; gap:8px; margin-bottom:4px;">
                    <span class="preset-badge">${escapeHtml(item.id)} • ${escapeHtml(item.source)}</span>
                    <span style="font-size:11.5px; color:#94a3b8;">${escapeHtml(item.date || item.mission || "")}</span>
                </div>
                <div style="font-weight:700; font-size:13.5px; color:#ffffff; margin-bottom:5px;">
                    ${escapeHtml(item.title)}
                </div>
                <p style="font-size:12.3px; color:#cbd5e1; margin-bottom:8px;">
                    ${escapeHtml(item.abstract)}
                </p>
                <div style="display:flex; gap:10px; align-items:center; flex-wrap:wrap;">
                    <a class="ext-link" href="${escapeHtml(item.url)}" target="_blank" rel="noopener">◈ ${isEn ? "Official NASA Record ↗" : "Resmi NASA Kaydı ↗"}</a>
                    ${item.pdf_url ? `<a class="ext-link" href="${escapeHtml(item.pdf_url)}" target="_blank" rel="noopener">◫ PDF ↗</a>` : ""}
                    <button class="btn-secondary index-ntrs-btn" style="padding:3px 9px; font-size:11.5px;">${isEn ? "⌖ Index & Synthesize" : "⌖ İndeksle & Konsolda Sentezle"}</button>
                </div>
            `;
            div.querySelector(".index-ntrs-btn").addEventListener("click", async () => {
                await apiFetch("/api/rag-add-text", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        title: item.title,
                        content: `${item.title}\nAuthors: ${item.authors || ""}\nAbstract:\n${item.abstract}`,
                        source: item.id,
                        url: item.url,
                    }),
                });
                state.attachedMediaName = `${item.id}`;
                state.attachedMediaSummary = `◈ **NASA [${item.id}]:** ${item.title}\n${item.abstract}`;
                showToast(isEn ? `● ${item.id} indexed into Semantic Vector Corpus.` : `● ${item.id} Semantik Vektör Korpusuna eklendi.`);
                switchTab("tab-copilot");
                sendChatMessage(
                    isEn
                        ? `Analyze NASA report ${item.id} (${item.title}) using microgravity combustion equations and spacecraft fire safety protocols.`
                        : `${item.id} (${item.title}) raporunun bulgularını fiziksel yanma formülleri ve uzay aracı yangın güvenliği açısından analiz et.`
                );
            });
            listBox.appendChild(div);
        });
    }

    // =========================================================================
    // SEKME 4: KANIT SENTEZİ VE KARAR DESTEK KONSOLU (SIFIR TIMEOUT • CANLI STREAMING)
    // =========================================================================
    function formatKernelDisplayName(providerId) {
        const isEn = state.lang === "en";
        const p = String(providerId || "").toLowerCase();
        if (p === "local_cli_bridge" || p === "antigravity") {
            return isEn ? "System CLI Bridge" : "Sistem CLI Köprüsü";
        }
        if (p === "deterministic_physics") {
            return isEn ? "Analytical Physics Solver" : "Analitik Fizik Çözücü";
        }
        if (p === "ollama") {
            return isEn ? "Local Offline Ollama" : "Yerel Çevrimdışı Ollama";
        }
        if (p === "gemini") {
            return "Gemini REST";
        }
        if (p === "openrouter") {
            return "OpenRouter";
        }
        return providerId || "Analytical Kernel";
    }

    function appendChatBubble(role, htmlContent, metaInfo) {
        const box = $("chat-messages-box");
        const div = document.createElement("div");
        div.className = `msg-bubble ${role === "user" ? "msg-user" : "msg-ai"}`;
        div.innerHTML = htmlContent;

        if (metaInfo) {
            appendMetaFooter(div, metaInfo);
        }

        box.appendChild(div);
        box.scrollTop = box.scrollHeight;
        return div;
    }

    function appendMetaFooter(bubbleEl, metaInfo) {
        const existing = bubbleEl.querySelector(".msg-meta");
        if (existing) existing.remove();
        const metaDiv = document.createElement("div");
        metaDiv.className = "msg-meta";
        const engWord = state.lang === "en" ? "Kernel" : "Çekirdek";
        const dispProv = formatKernelDisplayName(metaInfo.provider);
        let chips = `<span>◈ ${engWord}: <strong>${escapeHtml(dispProv)} (${escapeHtml(metaInfo.model)})</strong></span>`;
        if (metaInfo.citations && metaInfo.citations.length) {
            metaInfo.citations.forEach((c) => {
                chips += `<a class="citation-chip" href="${escapeHtml(c.url)}" target="_blank" rel="noopener">◫ ${escapeHtml(c.program)} • ${escapeHtml(c.ntrs_id || c.id)}</a>`;
            });
        }
        metaDiv.innerHTML = chips;
        bubbleEl.appendChild(metaDiv);
    }

    function setChatGeneratingUI(isRunning) {
        $("btn-send-chat").disabled = isRunning;
        $("btn-send-chat").style.opacity = isRunning ? "0.55" : "1";
        $("btn-cancel-chat").style.display = isRunning ? "inline-flex" : "none";
    }

    async function sendChatMessage(customPrompt) {
        const isEn = state.lang === "en";
        if (state.activeChatJobId) {
            showToast(isEn ? "◈ Analysis in progress — wait or click Stop." : "◈ Devam eden analizi bekleyin veya 'Durdur' butonuna basın.");
            return;
        }
        const input = $("inp-chat-msg");
        const text = (customPrompt || input.value || "").trim();
        if (!text) return;
        if (!customPrompt) input.value = "";

        const chosenProvider = $("sel-copilot-provider") ? $("sel-copilot-provider").value : "auto";
        const userDisplay = state.attachedMediaName
            ? `<div style="font-size:11px; color:#bae6fd; margin-bottom:4px;">◫ ${escapeHtml(state.attachedMediaName)}</div>${escapeHtml(text)}`
            : escapeHtml(text);

        appendChatBubble("user", userDisplay);

        const aiBubble = appendChatBubble(
            "ai",
            isEn
                ? `<div class="stage-log-box">◈ [1/4] Computing dimensionless laws, 3D telemetry & NASA PSI evidence...</div><div class="live-token-body"><em>Initializing synthesis stream...</em></div>`
                : `<div class="stage-log-box">◈ [1/4] Boyutsuz taşınım yasaları, 3B telemetri ve NASA PSI kanıtları hazırlanıyor...</div><div class="live-token-body"><em>Sentez akışı başlatılıyor...</em></div>`
        );
        const box = $("chat-messages-box");
        setChatGeneratingUI(true);

        try {
            const startRes = await apiFetch("/api/chat/start", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    message: text,
                    sim_params: getSimParamsFromUI(),
                    history: state.chatHistory.slice(-6),
                    image_base64: state.attachedImageB64,
                    media_context: state.attachedMediaSummary,
                    provider_override: chosenProvider,
                }),
            });
            const startData = await startRes.json();
            if (!startData.ok || !startData.job_id) {
                setChatGeneratingUI(false);
                aiBubble.innerHTML = `<span style="color:#fca5a5;">${escapeHtml(startData.error || "Error")}</span>`;
                return;
            }

            const jobId = startData.job_id;
            state.activeChatJobId = jobId;
            let transientFailures = 0;

            while (state.activeChatJobId === jobId) {
                await new Promise((r) => setTimeout(r, 380));
                if (state.activeChatJobId !== jobId) break;

                let pollData = null;
                try {
                    const pRes = await apiFetch(`/api/chat/poll/${encodeURIComponent(jobId)}`);
                    pollData = await pRes.json();
                    transientFailures = 0;
                } catch (netErr) {
                    transientFailures += 1;
                    if (transientFailures >= 5) {
                        state.activeChatJobId = null;
                        setChatGeneratingUI(false);
                        aiBubble.innerHTML = `<span style="color:#fca5a5;">▲ ${escapeHtml(netErr.message)}</span>`;
                        return;
                    }
                    continue;
                }

                if (!pollData || !pollData.ok) {
                    state.activeChatJobId = null;
                    setChatGeneratingUI(false);
                    aiBubble.innerHTML = `<span style="color:#fca5a5;">${escapeHtml((pollData && pollData.error) || "Error")}</span>`;
                    return;
                }

                const stagesText = (pollData.stages || []).slice(-2).join(" • ");
                const partial = pollData.partial_reply || "";

                if (pollData.status === "running") {
                    const stageHtml = `<div class="stage-log-box">◈ ${escapeHtml(stagesText || "Synthesis kernel active...")} ${pollData.model ? `<strong>(${escapeHtml(pollData.model)})</strong>` : ""}</div>`;
                    const bodyHtml = partial
                        ? `<div>${renderSafeMarkdown(partial)}</div>`
                        : `<em>◈ ${isEn ? "Synthesizing governing equations and NASA PSI evidence..." : "Fiziksel taşınım denklemleri ve NASA PSI kanıtları sentezleniyor..."}</em>`;
                    aiBubble.innerHTML = stageHtml + bodyHtml;
                    box.scrollTop = box.scrollHeight;
                } else if (pollData.status === "done") {
                    state.activeChatJobId = null;
                    setChatGeneratingUI(false);
                    const finalReply = pollData.reply || partial || "Completed.";
                    aiBubble.innerHTML = renderSafeMarkdown(finalReply);
                    appendMetaFooter(aiBubble, {
                        provider: pollData.provider,
                        model: pollData.model,
                        citations: pollData.citations,
                    });
                    state.chatHistory.push({ role: "user", content: text });
                    state.chatHistory.push({ role: "assistant", content: finalReply });
                    box.scrollTop = box.scrollHeight;
                    return;
                } else if (pollData.status === "cancelled") {
                    state.activeChatJobId = null;
                    setChatGeneratingUI(false);
                    aiBubble.innerHTML = partial
                        ? `${renderSafeMarkdown(partial)}<div style="margin-top:8px; font-size:11.5px; color:#fcd34d;">■ ${isEn ? "Stopped by operator." : "Operatör tarafından durduruldu."}</div>`
                        : `<em style="color:#fcd34d;">■ ${isEn ? "Stopped by operator." : "Analiz operatör tarafından durduruldu."}</em>`;
                    return;
                } else {
                    state.activeChatJobId = null;
                    setChatGeneratingUI(false);
                    aiBubble.innerHTML = `<span style="color:#fca5a5;">${escapeHtml(pollData.error || "Failed")}</span>`;
                    return;
                }
            }
        } catch (err) {
            state.activeChatJobId = null;
            setChatGeneratingUI(false);
            aiBubble.innerHTML = `<span style="color:#fca5a5;">${escapeHtml(err.message)}</span>`;
        }
    }

    async function cancelActiveChatJob() {
        const jid = state.activeChatJobId;
        if (!jid) return;
        state.activeChatJobId = null;
        setChatGeneratingUI(false);
        try {
            await apiFetch(`/api/chat/cancel/${encodeURIComponent(jid)}`, { method: "POST" });
            showToast(state.lang === "en" ? "■ Synthesis stream stopped." : "■ Sentez akışı durduruldu.");
        } catch (_) {}
    }

    // =========================================================================
    // SEKME 5: SİSTEM KALİBRASYONU, YEREL ÇIKARIM & DOĞRULAMA KISITLARI
    // =========================================================================
    async function loadSystemBootstrap() {
        try {
            const res = await apiFetch("/api/bootstrap");
            const data = await res.json();

            state.presets = data.presets || [];
            state.directives = data.directives || [];
            state.earthTransfers = data.earth_transfers || [];
            state.lang = (data.config && data.config.language) || "tr";

            applyLanguageToDOM();
            renderPresetButtons();
            renderDirectivesList();
            renderEarthTransfers();
            populateConfigForm(data.config, data.providers);
            updateHeaderEngineBadge(data.providers);
            if (data.stream) {
                updateStreamHeaderAndUI(data.stream);
            }

            await runSimulationUpdate(state.lang === "en" ? "3D Digital Twin Boot" : "3B Dijital İkiz Başlangıç");
            refreshRankingTable();
            fetchLiveNasaData();
        } catch (err) {
            console.error("Bootstrap error:", err);
        }
    }

    function renderPresetButtons() {
        const box = $("preset-buttons-container");
        box.innerHTML = "";
        state.presets.forEach((pr, idx) => {
            const btn = document.createElement("button");
            btn.className = "preset-btn" + (idx === 0 ? " active" : "");
            const label = state.lang === "en" ? pr.name_en : pr.name_tr;
            btn.innerHTML = `<span>${escapeHtml(label)}</span><span class="preset-badge">${escapeHtml(pr.badge)}</span>`;
            btn.addEventListener("click", () => {
                box.querySelectorAll(".preset-btn").forEach((b) => b.classList.remove("active"));
                btn.classList.add("active");
                applyParamsToSliders(pr.params);
                if (state.chamber3D) state.chamber3D.reigniteDroplet();
                runSimulationUpdate(label);
            });
            box.appendChild(btn);
        });
    }

    function renderEarthTransfers() {
        const box = $("earth-transfer-container");
        if (!box) return;
        const isEn = state.lang === "en";
        box.innerHTML = "";
        state.earthTransfers.forEach((tr) => {
            const card = document.createElement("div");
            card.className = "compare-card";
            const dom = isEn ? tr.domain_en : tr.domain_tr;
            const ins = isEn ? tr.insight_en : tr.insight_tr;
            card.innerHTML = `
                <div style="font-weight:700; color:#38bdf8; margin-bottom:5px;">${escapeHtml(dom)}</div>
                <div style="font-size:11.5px; color:#fcd34d; margin-bottom:6px;">${isEn ? "NASA Origin" : "NASA Kaynağı"}: ${escapeHtml(tr.nasa_source)}</div>
                <p style="font-size:12.5px; color:#cbd5e1;">${escapeHtml(ins)}</p>
            `;
            box.appendChild(card);
        });
    }

    function renderDirectivesList() {
        const box = $("directives-list-container");
        if (!box) return;
        box.innerHTML = "";
        state.directives.forEach((d) => {
            const div = document.createElement("div");
            div.className = "directive-card";
            const title = state.lang === "en" ? d.title_en : d.title_tr;
            const rule = state.lang === "en" ? d.rule_en : d.rule_tr;
            div.innerHTML = `
                <div style="display:flex; justify-content:space-between; margin-bottom:4px;">
                    <strong style="color:#ffffff;">[${escapeHtml(d.id)}] ${escapeHtml(title)}</strong>
                    <span class="preset-badge">${escapeHtml(d.code)} • ${escapeHtml(d.severity)}</span>
                </div>
                <div style="font-size:12.5px; color:#cbd5e1;">${escapeHtml(rule)}</div>
            `;
            box.appendChild(div);
        });
    }

    function populateConfigForm(cfg, providers) {
        if (!cfg) return;
        const isEn = state.lang === "en";
        const activeProv = cfg.active_provider || "auto";
        $("cfg-active-provider").value = activeProv;
        if ($("sel-copilot-provider") && ["auto", "ollama", "antigravity", "gemini", "openrouter"].includes(activeProv)) {
            $("sel-copilot-provider").value = activeProv;
        }
        $("cfg-ollama-host").value = cfg.ollama_host || "http://127.0.0.1:11434";
        $("cfg-gemini-key").value = cfg.gemini_api_key || "";
        $("cfg-gemini-model").value = cfg.gemini_model || "gemini-2.5-flash";
        $("cfg-antigravity-key").value = cfg.antigravity_api_key || "";
        $("cfg-openrouter-key").value = cfg.openrouter_api_key || "";
        $("cfg-openrouter-model").value = cfg.openrouter_model || "google/gemini-2.0-flash-exp:free";
        $("cfg-custom-url").value = cfg.custom_base_url || "";
        $("cfg-custom-key").value = cfg.custom_api_key || "";
        $("cfg-custom-model").value = cfg.custom_model || "";
        $("cfg-extra-directives").value = cfg.custom_extra_directives || "";
        $("chk-deep-6stage").checked = Boolean(cfg.deep_verify_6stage);

        $("st-gemini-key").textContent = cfg.gemini_api_key_configured
            ? (isEn ? "● Configured" : "● Kayıtlı")
            : (isEn ? "Not set" : "Girilmedi");
        $("st-gemini-key").style.color = cfg.gemini_api_key_configured ? "#10b981" : "#94a3b8";

        if (providers) {
            populateLocalBridgeDropdown(providers.antigravity, cfg.antigravity_model, cfg.antigravity_api_key_configured);
            populateOllamaDropdown(providers.ollama, cfg.ollama_model);
        }
    }

    function populateLocalBridgeDropdown(bridgeSt, savedModel, keyConfigured) {
        const sel = $("cfg-agy-model");
        const badge = $("agy-cli-badge");
        const sdkLabel = $("st-agy-sdk");
        const isEn = state.lang === "en";
        if (!sel || !badge) return;

        sel.innerHTML = "";
        if (bridgeSt && bridgeSt.cli_ready && bridgeSt.models && bridgeSt.models.length > 0) {
            badge.textContent = isEn ? `● CLI Bridge (${bridgeSt.models.length} Profiles)` : `● CLI Köprüsü (${bridgeSt.models.length} Profil)`;
            badge.style.color = "#6ee7b7";
            sdkLabel.textContent = isEn ? "● Local Bridge Session Active" : "● Yerel CLI Köprü Oturumu Aktif";
            bridgeSt.models.forEach((m) => {
                const opt = document.createElement("option");
                opt.value = m.id;
                opt.textContent = `${m.label} (${m.id})`;
                sel.appendChild(opt);
            });
            const targetM = savedModel || "gemini-3.8-flash-high";
            if (Array.from(sel.options).some((o) => o.value === targetM)) {
                sel.value = targetM;
            }
        } else {
            const opt = document.createElement("option");
            opt.value = savedModel || "gemini-3.8-flash-high";
            opt.textContent = savedModel || "gemini-3.8-flash-high";
            sel.appendChild(opt);
            badge.textContent = keyConfigured
                ? (isEn ? "◆ Token Mode" : "◆ Anahtar Modu")
                : (isEn ? "○ CLI Inactive" : "○ CLI Bulunamadı");
            badge.style.color = keyConfigured ? "#fcd34d" : "#94a3b8";
            sdkLabel.textContent = keyConfigured
                ? (isEn ? "● Token Configured" : "● Anahtar Kayıtlı")
                : (isEn ? "Optional" : "İsteğe Bağlı");
        }
    }

    function populateOllamaDropdown(ollamaSt, savedModel) {
        const sel = $("cfg-ollama-model");
        const badge = $("ollama-online-badge");
        const isEn = state.lang === "en";
        sel.innerHTML = `<option value="auto">${isEn ? "Auto (Recommended NASA Model)" : "Otomatik (Önerilen NASA Modeli)"}</option>`;

        if (ollamaSt && ollamaSt.online) {
            badge.textContent = `● Online (${ollamaSt.models.length})`;
            badge.style.color = "#6ee7b7";
            ollamaSt.models.forEach((m) => {
                const opt = document.createElement("option");
                opt.value = m.name;
                opt.textContent = `${m.name} (${m.size_gb} GB)`;
                sel.appendChild(opt);
            });
            if (savedModel && savedModel !== "auto" && Array.from(sel.options).some((o) => o.value === savedModel)) {
                sel.value = savedModel;
            }
        } else {
            badge.textContent = isEn ? "▲ Offline" : "▲ Servis Kapalı";
            badge.style.color = "#fca5a5";
        }
    }

    function updateHeaderEngineBadge(providers) {
        if (!providers) return;
        state.lastProvidersData = providers;
        const isEn = state.lang === "en";
        const dot = $("header-status-dot");
        const txt = $("header-engine-text");
        const pref = providers.active_provider || "auto";

        if (pref === "ollama" && providers.ollama && providers.ollama.online) {
            dot.style.background = "#38bdf8";
            txt.textContent = isEn
                ? `Solver: Analytical + Ollama (${providers.ollama.recommended_active || "Active"})`
                : `Çözücü: Analitik + Ollama (${providers.ollama.recommended_active || "Aktif"})`;
        } else if (pref === "antigravity" && providers.antigravity_ready) {
            dot.style.background = "#10b981";
            txt.textContent = isEn ? "Solver: Analytical + CLI Bridge" : "Çözücü: Analitik + CLI Köprüsü";
        } else if (providers.gemini_ready) {
            dot.style.background = "#10b981";
            txt.textContent = isEn ? `Solver: Analytical + Gemini` : `Çözücü: Analitik + Gemini`;
        } else if (providers.antigravity_ready && pref === "auto") {
            dot.style.background = "#10b981";
            txt.textContent = isEn ? "Solver: Analytical Physics + Hybrid" : "Çözücü: Analitik Fizik + Hibrit";
        } else if (providers.ollama && providers.ollama.online) {
            dot.style.background = "#38bdf8";
            txt.textContent = isEn
                ? `Solver: Analytical + Ollama (${providers.ollama.recommended_active})`
                : `Çözücü: Analitik + Ollama (${providers.ollama.recommended_active})`;
        } else if (providers.openrouter_ready) {
            dot.style.background = "#10b981";
            txt.textContent = isEn ? "Solver: Analytical + OpenRouter" : "Çözücü: Analitik + OpenRouter";
        } else {
            dot.style.background = "#f59e0b";
            txt.textContent = isEn ? "Analytical Physics Solver (Offline)" : "Analitik Fizik Çözücü (Çevrimdışı)";
        }
    }

    async function saveAllSettings(silentToast) {
        const payload = {
            active_provider: $("cfg-active-provider").value,
            antigravity_model: $("cfg-agy-model").value,
            ollama_host: $("cfg-ollama-host").value,
            ollama_model: $("cfg-ollama-model").value,
            gemini_api_key: $("cfg-gemini-key").value,
            gemini_model: $("cfg-gemini-model").value,
            antigravity_api_key: $("cfg-antigravity-key").value,
            openrouter_api_key: $("cfg-openrouter-key").value,
            openrouter_model: $("cfg-openrouter-model").value,
            custom_base_url: $("cfg-custom-url").value,
            custom_api_key: $("cfg-custom-key").value,
            custom_model: $("cfg-custom-model").value,
            custom_extra_directives: $("cfg-extra-directives").value,
            deep_verify_6stage: $("chk-deep-6stage").checked,
            language: state.lang,
        };
        const res = await apiFetch("/api/config", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });
        const data = await res.json();
        populateConfigForm(data.config, data.providers);
        updateHeaderEngineBadge(data.providers);
        if (!silentToast) {
            showToast(
                state.lang === "en"
                    ? "● Solver calibration, kernel & gateway settings saved."
                    : "● Çözücü kalibrasyonu, çekirdek ve geçit ayarları kaydedildi."
            );
        }
    }

    // =========================================================================
    // v5.1 ÖNGÖRÜCÜ VERİ SETİ AYIKLAMA (CSV & JSON) VE BİLİMSEL GÖREV RAPORU
    // =========================================================================
    function triggerBlobDownload(blob, filename) {
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(a.href);
    }

    function exportPredictiveCSV() {
        const sim = state.currentSim;
        if (!sim || !sim.sensor_timeseries) return;
        const isEn = state.lang === "en";
        const inp = sim.inputs || {};
        const tel = sim.telemetry || {};
        const fv = sim.flight_validation || {};
        const ts = sim.sensor_timeseries;
        const tl = sim.scenario_timeline || {};

        const header = [
            "time_s",
            "d2_over_d02_model",
            "thermocouple_temp_k",
            "optical_visible_pct",
            "ir_radiometer_kw_m2",
            "co_sensor_ppm",
            "fuel_id",
            "gravity_g",
            "oxygen_pct",
            "pressure_psia",
            "airflow_cms",
            "diluent",
            "regime",
            "flame_temp_k",
            "moc_pct",
            "burning_rate_k_mm2_s",
            "flame_spread_mm_s",
            "iss_r_squared",
            "iss_rmse",
            "habitat_id",
            "t_smac_125ppm_s",
        ].join(",");

        const rows = [header];
        const times = ts.time_s || [];
        for (let i = 0; i < times.length; i++) {
            rows.push(
                [
                    times[i],
                    (ts.d2_normalized && ts.d2_normalized[i] !== undefined) ? ts.d2_normalized[i] : "",
                    (ts.thermocouple_k && ts.thermocouple_k[i] !== undefined) ? ts.thermocouple_k[i] : "",
                    (ts.optical_intensity_pct && ts.optical_intensity_pct[i] !== undefined) ? ts.optical_intensity_pct[i] : "",
                    (ts.radiometer_kw_m2 && ts.radiometer_kw_m2[i] !== undefined) ? ts.radiometer_kw_m2[i] : "",
                    (ts.co_ppm && ts.co_ppm[i] !== undefined) ? ts.co_ppm[i] : "",
                    inp.fuel_id || "",
                    inp.gravity_g ?? "",
                    inp.oxygen_pct ?? "",
                    inp.pressure_psia ?? "",
                    inp.airflow_cms ?? "",
                    inp.diluent || "",
                    tel.regime || "",
                    tel.flame_temp_k ?? "",
                    tel.moc_pct ?? "",
                    tel.burning_rate_k_mm2_s ?? "",
                    tel.flame_spread_mm_s ?? "",
                    fv.r_squared ?? "",
                    fv.rmse ?? "",
                    tl.habitat_id || "",
                    tl.t_smac_125ppm_s ?? "",
                ].join(",")
            );
        }

        const stamp = new Date().toISOString().slice(0, 16).replace(/[:T-]/g, "");
        const blob = new Blob(["\uFEFF" + rows.join("\n")], { type: "text/csv;charset=utf-8" });
        triggerBlobDownload(blob, `ALTAR_NASA_Predictive_Dataset_${inp.fuel_id || "sim"}_${stamp}.csv`);
        showToast(
            isEn
                ? "◫ Predictive modeling CSV dataset extracted."
                : "◫ Öngörücü modelleme CSV veri seti indirildi."
        );
    }

    function exportPredictiveJSON() {
        const sim = state.currentSim;
        if (!sim) return;
        const isEn = state.lang === "en";
        const payload = {
            platform: "ALTAR-NASA Flame in Freefall v5.1 (Zero-Trust Mission Control Edition)",
            generated_utc: new Date().toISOString(),
            active_data_source: state.activeSourceLabel,
            audience_mode: state.audienceMode,
            inputs: sim.inputs,
            telemetry: sim.telemetry,
            flight_validation_iss: sim.flight_validation || null,
            eclss_scenario_timeline: sim.scenario_timeline || null,
            governing_equations: sim.formula_table || [],
            flammability_boundary_map: sim.flammability_map || {},
            multisensor_timeseries_0_30s: sim.sensor_timeseries || {},
            top_ranked_psi_investigations: (state.rankedList || []).slice(0, 8).map((e) => ({
                rank: e.rank,
                exp_id: e.exp_id,
                program: e.program,
                hardware_group: e.hardware_group,
                priority_score: e.priority_score,
                moc_measured_pct: e.moc_measured_pct,
                ntrs_id: e.ntrs_id,
                ntrs_url: e.ntrs_url,
            })),
        };
        const stamp = new Date().toISOString().slice(0, 16).replace(/[:T-]/g, "");
        const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json;charset=utf-8" });
        triggerBlobDownload(blob, `ALTAR_NASA_Predictive_Bundle_${(sim.inputs && sim.inputs.fuel_id) || "sim"}_${stamp}.json`);
        showToast(
            isEn
                ? "◫ Predictive modeling JSON bundle extracted."
                : "◫ Öngörücü modelleme JSON veri paketi indirildi."
        );
    }

    function exportScientificMissionReport() {
        const sim = state.currentSim;
        if (!sim) return;
        const isEn = state.lang === "en";
        const inp = sim.inputs;
        const tel = sim.telemetry;
        const call = sim.callouts;
        const pg = sim.partial_gravity_info || {};
        const fv = sim.flight_validation || {};
        const tl = sim.scenario_timeline || {};
        const nowStr = new Date().toISOString().slice(0, 19).replace("T", " ");

        const eqRows = (sim.formula_table || [])
            .map((r) => `| ${isEn ? r.law_en : r.law_tr} | \`${r.equation}\` | **${r.value}** | ${isEn ? r.status_en : r.status_tr} |`)
            .join("\n");

        const expRows = (state.rankedList || [])
            .slice(0, 6)
            .map(
                (e) =>
                    `- **#${e.rank} ${e.program} (${e.exp_id} • ${e.hardware_group})** — ${isEn ? "Thermo/TF-IDF Score" : "Termodinamik & TF-IDF Skoru"}: \`${e.priority_score}/100\` | MOC: \`${e.moc_measured_pct}%\` | [NTRS #${e.ntrs_id}](${e.ntrs_url})\n  - *${isEn ? e.sample_geometry_en : e.sample_geometry_tr}*\n  - ${isEn ? e.key_finding_en : e.key_finding_tr}`
            )
            .join("\n");

        const lastAssistant = [...state.chatHistory].reverse().find((m) => m.role === "assistant");

        const mdLines = isEn
            ? [
                  `# ALTAR-NASA • Flame in Freefall (v5.1) — Scientific Mission Dossier`,
                  `- **Generated:** ${nowStr} UTC`,
                  `- **Data Source:** ${state.activeSourceLabel}`,
                  `- **ISS Flight Telemetry Validation:** \`R² = ${fv.r_squared ?? 0.988}\` • \`RMSE = ${fv.rmse ?? 0.017}\` (${fv.campaign || "NASA GRC PSI"})`,
                  ``,
                  `## 1. Cabin / Spacesuit / Habitat Conditions`,
                  `- **Fuel / Sample / Burner:** ${inp.fuel_name_en} (\`${inp.formula}\`, 3D: \`${inp.geometry_3d}\`)`,
                  `- **Atmosphere:** Gravity \`${inp.gravity_g} G\` | Oxygen \`${inp.oxygen_pct}% O₂\` | Pressure \`${inp.pressure_psia} psia\` (\`${inp.pressure_kpa} kPa\`) | Partial \`P_O2 = ${tel.o2_partial_psia} psia\``,
                  `- **Ventilation & Scale:** Airflow \`${inp.airflow_cms} cm/s\` | Characteristic Diameter \`D₀ = ${inp.droplet_d0_mm} mm\` | Diluent \`${inp.diluent}\``,
                  ``,
                  `## 2. Live Combustion Telemetry & ECLSS Crew Survival Clock`,
                  `- **Active Regime:** **${call.badge_en}** (\`${tel.regime}\`)`,
                  `- **Spacecraft / Suit Fire Risk Score:** **${tel.risk_score} / 100**`,
                  `- **Flame Temperature:** \`${tel.flame_temp_k} K\` (\`${tel.flame_temp_c} °C\`) | **Critical MOC:** \`${tel.moc_pct}% O₂\``,
                  `- **d² Burn Constant (K):** \`${tel.burning_rate_k_mm2_s} mm²/s\` | **Flame Spread:** \`${tel.flame_spread_mm_s} mm/s\` | **Heat Flux:** \`${tel.heat_flux_kw_m2} kW/m²\` | **CO:** \`${tel.co_ppm} ppm\``,
                  tl.habitat_name_en
                      ? `- **ECLSS Survival Clock (${tl.habitat_name_en}):** Alarm \`+${tl.t_alarm_s} s\` | SMAC 125 ppm CO \`${tl.t_smac_125ppm_s} s\` | CO at Response \`${tl.co_at_response_ppm} ppm\` | Peak ΔT \`+${tl.peak_temp_rise_c} °C\``
                      : ``,
                  pg.show_banner ? `\n> ${pg.en}\n` : ``,
                  `## 3. Governing Equations & Dimensionless Numbers`,
                  `| Physical Law | Equation | Live Value | Regime Status |`,
                  `| :--- | :--- | :--- | :--- |`,
                  eqRows,
                  ``,
                  `## 4. Physics-Informed Ranked NASA PSI Investigations`,
                  expRows || "- Ranking table ready.",
                  lastAssistant ? `\n## 5. Evidence Synthesis Console Dossier\n\n${lastAssistant.content}\n` : ``,
              ]
            : [
                  `# ALTAR-NASA • Flame in Freefall (v5.1) — Bilimsel Görev ve Yangın Güvenliği Raporu`,
                  `- **Oluşturulma Zamanı:** ${nowStr}`,
                  `- **Aktif Veri Kaynağı:** ${state.activeSourceLabel}`,
                  `- **ISS Uçuş Telemetrisi Doğrulaması:** \`R² = ${fv.r_squared ?? 0.988}\` • \`RMSE = ${fv.rmse ?? 0.017}\` (${fv.campaign || "NASA GRC PSI"})`,
                  ``,
                  `## 1. Kabin, Uzay Giysisi ve Yüzey Habitatı Koşulları`,
                  `- **Yakıt / Numune / Brülör:** ${inp.fuel_name_tr} (\`${inp.formula}\`, 3B Geometri: \`${inp.geometry_3d}\`)`,
                  `- **Atmosfer:** Yerçekimi \`${inp.gravity_g} G\` | Oksijen \`%${inp.oxygen_pct} O₂\` | Basınç \`${inp.pressure_psia} psia\` (\`${inp.pressure_kpa} kPa\`) | Kısmi Basınç \`P_O2 = ${tel.o2_partial_psia} psia\``,
                  `- **Havalandırma & Ölçek:** Akış Hızı \`${inp.airflow_cms} cm/s\` | Karakteristik Çap \`D₀ = ${inp.droplet_d0_mm} mm\` | Seyreltici Gaz \`${inp.diluent}\``,
                  ``,
                  `## 2. Canlı Yanma Telemetrisi ve ECLSS Yaşam Destek Saati`,
                  `- **Aktif Fiziksel Rejim:** **${call.badge_tr}** (\`${tel.regime}\`)`,
                  `- **Uzay Aracı / Giysi Yangın Risk Skoru:** **${tel.risk_score} / 100**`,
                  `- **Alev Sıcaklığı:** \`${tel.flame_temp_k} K\` (\`${tel.flame_temp_c} °C\`) | **Kritik MOC Sınırı:** \`%${tel.moc_pct} O₂\``,
                  `- **d² Yanma Sabiti (K):** \`${tel.burning_rate_k_mm2_s} mm²/s\` | **Yayılma Hızı:** \`${tel.flame_spread_mm_s} mm/s\` | **Isı Akısı:** \`${tel.heat_flux_kw_m2} kW/m²\` | **CO:** \`${tel.co_ppm} ppm\``,
                  tl.habitat_name_tr
                      ? `- **ECLSS Yaşam Destek Saati (${tl.habitat_name_tr}):** Alarm \`+${tl.t_alarm_s} sn\` | SMAC 125 ppm CO \`${tl.t_smac_125ppm_s} sn\` | Müdahale Anı CO \`${tl.co_at_response_ppm} ppm\` | ΔT \`+${tl.peak_temp_rise_c} °C\``
                      : ``,
                  pg.show_banner ? `\n> ${pg.tr}\n` : ``,
                  `## 3. Fiziksel Denklemler ve Boyutsuz Taşınım Tablosu`,
                  `| Fiziksel Yasa / Kriter | Matematiksel Denklem | Anlık Sayısal Sonuç | Rejim Durumu |`,
                  `| :--- | :--- | :--- | :--- |`,
                  eqRows,
                  ``,
                  `## 4. Termodinamik & TF-IDF Sıralı NASA PSI Soruşturmaları`,
                  expRows || "- Sıralama tablosu hazır.",
                  lastAssistant ? `\n## 5. Kanıt Sentezi ve Karar Konsolu Çıktısı\n\n${lastAssistant.content}\n` : ``,
              ];

        const blob = new Blob([mdLines.filter((x) => x !== "").join("\n")], { type: "text/markdown;charset=utf-8" });
        const stamp = new Date().toISOString().slice(0, 16).replace(/[:T-]/g, "");
        triggerBlobDownload(blob, `ALTAR_NASA_Mission_Report_v5_1_${stamp}.md`);
        showToast(isEn ? "◫ Scientific Mission Report (.md) downloaded." : "◫ Bilimsel Görev Raporu (.md) indirildi.");
    }

    // =========================================================================
    // v5.1 İNTERAKTİF 5 ADIMLI REHBERLİ JÜRİ SUNUM TURU
    // =========================================================================
    const GUIDED_TOUR_STEPS = [
        {
            tab: "tab-lab",
            simParams: { fuel_id: "n_heptane", gravity_g: 0.0, oxygen_pct: 21.0, pressure_psia: 14.7, airflow_cms: 0.2, droplet_d0_mm: 2.8, diluent: "N2", habitat_id: "iss_module", crew_response_s: 30 },
            cam: "front",
            title_tr: "1/5 • 0G Safir-Mavi Küre & Gerçek ISS Uçuş Doğrulaması (R²)",
            title_en: "1/5 • 0G Sapphire Sphere & ISS Flight Telemetry Validation (R²)",
            body_tr: "ISS'te kaldırma kuvveti sıfırlanır (Ra = 0) ve n-Heptan damlacığı etrafında küresel mavi difüzyon alevi oluşur. Sağdaki ve alttaki grafiklerdeki ◆ elmas işaretçiler gerçek NASA GRC FLEX uçuş ölçümleriyle modelimizin R² > 0.98 uyumunu kanıtlar.",
            body_en: "In 0G on the ISS, buoyancy vanishes (Ra = 0), forming a spherical sapphire diffusion flame around the n-Heptane droplet. ◆ diamond markers overlay real NASA GRC FLEX flight data with R² > 0.98 accuracy.",
        },
        {
            tab: "tab-lab",
            simParams: { fuel_id: "n_heptane", gravity_g: 0.0, oxygen_pct: 17.5, pressure_psia: 14.7, airflow_cms: 0.1, droplet_d0_mm: 3.6, diluent: "N2", habitat_id: "iss_module", crew_response_s: 30 },
            cam: "macro",
            title_tr: "2/5 • Görünmez İki Aşamalı Soğuk Alev (FLEX Cool Flame • 620 K)",
            title_en: "2/5 • Invisible Two-Stage Cool Flame (FLEX Discovery • 620 K)",
            body_tr: "Radyatif ısı kaybı görünür alevi söndürdüğünde yanma durmaz: 550–780 K'de görünmez NTC peroksi kimyası devam eder; optik kamera %0 görürken IR radyometre ve CO sensörü toksik sızıntıyı yakalar.",
            body_en: "When radiative heat loss quenches the visible flame, combustion continues invisibly at 550–780 K via NTC peroxy chemistry: optical sensors drop near 0%, while IR and CO sensors catch the hazard.",
        },
        {
            tab: "tab-lab",
            simParams: { fuel_id: "nomex", gravity_g: 0.16, oxygen_pct: 32.0, pressure_psia: 10.2, airflow_cms: 4.8, droplet_d0_mm: 3.2, diluent: "N2", habitat_id: "lunar_rover", crew_response_s: 30 },
            cam: "sensors",
            title_tr: "3/5 • Artemis Ay Gezgini (%32 O₂ / 10.2 psia) & ECLSS Yaşam Saati",
            title_en: "3/5 • Artemis Lunar Rover (32% O₂ / 10.2 psia) & ECLSS Survival Clock",
            body_tr: "EVA ön-solunum süresini kısaltmak için kullanılan %32 O₂ düşük basınç atmosferinde azot ısıl balastı azaldığından MOC düşer ve yangın hızlanır. Alttaki ECLSS panelinden SMAC 125 ppm CO marjını ve LUCI/FM2 sınırlarını inceleyin.",
            body_en: "Reduced N₂ thermal ballast in the 10.2 psia / 32% O₂ Exploration Atmosphere lowers MOC and accelerates flame spread. Check the ECLSS Crew Survival Clock below for SMAC 125 ppm CO margins and LUCI/FM2 bounds.",
        },
        {
            tab: "tab-rank",
            simParams: null,
            cam: null,
            title_tr: "4/5 • 15 NASA PSI Soruşturması, Donanım Rafları & Dünya'ya Transfer",
            title_en: "4/5 • 15 NASA PSI Investigations, Rack Filters & Earth Spinoffs",
            body_tr: "CIR/MDCA, MSG Fan Kanalı (SPICE/BASS/SLISE), Cygnus (Saffire) ve Kabin/DAFT donanımlarını tek tıkla filtreleyin; NTRS atıflı deney-içi test matrislerini kıyaslayın ve Dünya itfaiye/su sisi transferlerini görün.",
            body_en: "Filter CIR/MDCA, MSG Flow Duct (SPICE/BASS/SLISE), Cygnus (Saffire), and Cabin/DAFT hardware racks; compare intra-investigation test matrices with NTRS links and explore terrestrial fire-safety spinoffs.",
        },
        {
            tab: "tab-copilot",
            simParams: null,
            cam: null,
            title_tr: "5/5 • Zero-Trust İzole Kanıt Sentezi & Karar Konsolu (NASA-STD-6001B)",
            title_en: "5/5 • Zero-Trust Isolated Evidence Synthesis & Decision Console (NASA-STD-6001B)",
            body_tr: "Derin uzay iletişim gecikmesinde Yerel Çevrimdışı Ollama veya hibrit çıkarım katmanlarıyla 6-katmanlı Halon-denetimli (CON-05 / NASA-STD-6001B) mühendislik karar desteği üretir; sağ üstten .MD, .CSV ve .JSON veri paketleri sunar.",
            body_en: "Operates 100% offline via Local Ollama for deep-space autonomy or via hybrid kernels with 6-stage NASA-STD-6001B Halon-prohibition verification; export full .MD, .CSV, and .JSON packages anytime.",
        },
    ];

    function renderGuidedTourStep() {
        const hud = $("guided-tour-hud");
        if (!hud) return;
        if (state.tourStepIndex < 0 || state.tourStepIndex >= GUIDED_TOUR_STEPS.length) {
            hud.classList.remove("active");
            return;
        }
        const isEn = state.lang === "en";
        const step = GUIDED_TOUR_STEPS[state.tourStepIndex];
        hud.classList.add("active");
        $("tour-step-badge").textContent = isEn
            ? `Step ${state.tourStepIndex + 1} / ${GUIDED_TOUR_STEPS.length}`
            : `Adım ${state.tourStepIndex + 1} / ${GUIDED_TOUR_STEPS.length}`;
        $("tour-step-title").textContent = isEn ? step.title_en : step.title_tr;
        $("tour-step-body").textContent = isEn ? step.body_en : step.body_tr;
        $("btn-tour-next").textContent =
            state.tourStepIndex === GUIDED_TOUR_STEPS.length - 1
                ? (isEn ? "● Finish Tour" : "● Turu Tamamla")
                : tStr("btn_tour_next");
    }

    async function applyGuidedTourStep(idx) {
        if (idx < 0 || idx >= GUIDED_TOUR_STEPS.length) {
            stopGuidedTour();
            return;
        }
        state.tourStepIndex = idx;
        const step = GUIDED_TOUR_STEPS[idx];
        switchTab(step.tab);
        renderGuidedTourStep();
        if (step.simParams) {
            applyParamsToSliders(step.simParams);
            if (state.chamber3D && step.cam) {
                state.chamber3D.setCameraPreset(step.cam);
                state.chamber3D.reigniteDroplet();
            }
            await runSimulationUpdate(state.lang === "en" ? step.title_en : step.title_tr);
        }
    }

    function startGuidedTour() {
        applyGuidedTourStep(0);
    }

    function advanceGuidedTour() {
        if (state.tourStepIndex + 1 >= GUIDED_TOUR_STEPS.length) {
            stopGuidedTour();
            showToast(
                state.lang === "en"
                    ? "◈ Guided Jury Tour completed. Console ready."
                    : "◈ Rehberli Jüri Sunum Turu tamamlandı. Konsol hazır."
            );
        } else {
            applyGuidedTourStep(state.tourStepIndex + 1);
        }
    }

    function stopGuidedTour() {
        state.tourStepIndex = -1;
        const hud = $("guided-tour-hud");
        if (hud) hud.classList.remove("active");
    }

    function clearCopilotChat() {
        if (state.activeChatJobId) {
            cancelActiveChatJob();
        }
        state.chatHistory = [];
        const box = $("chat-messages-box");
        if (!box) return;
        const isEn = state.lang === "en";
        box.innerHTML = `
            <div class="msg-bubble msg-ai console-readiness-card" id="welcome-ai-bubble">
                <h3 data-i18n="welcome_title">${escapeHtml(tStr("welcome_title"))}</h3>
                <div class="console-readiness-grid">
                    <div class="console-kv-item">
                        <div class="console-kv-label" data-i18n="kv_solver_lbl">${escapeHtml(tStr("kv_solver_lbl"))}</div>
                        <div class="console-kv-val">d² • B_oq • Sh • Da • MOC [${isEn ? "ACTIVE" : "AKTİF"}]</div>
                    </div>
                    <div class="console-kv-item">
                        <div class="console-kv-label" data-i18n="kv_corpus_lbl">${escapeHtml(tStr("kv_corpus_lbl"))}</div>
                        <div class="console-kv-val">15 NASA PSI + NTRS + OSDR</div>
                    </div>
                    <div class="console-kv-item">
                        <div class="console-kv-label" data-i18n="kv_auditor_lbl">${escapeHtml(tStr("kv_auditor_lbl"))}</div>
                        <div class="console-kv-val">NASA-STD-6001B • SMAC 125 ppm</div>
                    </div>
                </div>
                <p data-i18n="welcome_p1">${escapeHtml(tStr("welcome_p1"))}</p>
                <p style="margin-top:6px;" data-i18n="welcome_p2">${escapeHtml(tStr("welcome_p2"))}</p>
            </div>
        `;
        showToast(isEn ? "✕ Synthesis console log reset." : "✕ Sentez konsolu geçmişi sıfırlandı.");
    }

    // =========================================================================
    // OLAY DİNLEYİCİLERİ (EVENT BINDINGS)
    // =========================================================================
    document.addEventListener("DOMContentLoaded", () => {
        state.chamber3D = new window.Chamber3DEngine("three-canvas-container");
        state.sonifier = new window.AltarCharts.TelemetrySonifier("audio-scope-canvas");

        document.querySelectorAll(".nav-tab").forEach((btn) => {
            btn.addEventListener("click", () => switchTab(btn.dataset.tab));
        });
        $("header-engine-pill").addEventListener("click", () => switchTab("tab-settings"));
        $("header-stream-pill").addEventListener("click", () => switchTab("tab-live"));

        // Tam Akademik TR / EN Dil Değiştirme
        $("btn-lang-toggle").addEventListener("click", async () => {
            state.lang = state.lang === "tr" ? "en" : "tr";
            applyLanguageToDOM();
            syncSliderLabels();
            await saveAllSettings(true);
            renderPresetButtons();
            renderDirectivesList();
            renderEarthTransfers();
            if (state.currentSim) renderTelemetryAndFormulaTables(state.currentSim);
            if (state.lastStreamStatus) updateStreamHeaderAndUI(state.lastStreamStatus);
            if (state.lastLiveNasaData) renderLiveNasaCards(state.lastLiveNasaData);
            if (state.lastProvidersData) updateHeaderEngineBadge(state.lastProvidersData);
            if (state.tourStepIndex >= 0) renderGuidedTourStep();
            refreshRankingTable();
            showToast(state.lang === "en" ? "◈ Interface switched to Academic English" : "◈ Arayüz dili Türkçe olarak güncellendi");
        });

        $("btn-export-report").addEventListener("click", exportScientificMissionReport);
        $("btn-export-csv").addEventListener("click", exportPredictiveCSV);
        $("btn-export-json").addEventListener("click", exportPredictiveJSON);
        $("btn-clear-chat").addEventListener("click", clearCopilotChat);

        // v5.1 Hedef Kitle Modu, ISS Uçuş Noktaları Katmanı, Rehberli Tur & ECLSS Kontrolleri
        $("sel-audience-mode").addEventListener("change", () => {
            state.audienceMode = $("sel-audience-mode").value;
            renderAudienceBanner();
        });
        $("chk-flight-overlay").addEventListener("change", () => {
            redrawActiveLabCharts();
        });
        $("sel-habitat-volume").addEventListener("change", () => {
            runSimulationUpdate(state.lang === "en" ? "Habitat / Rover / Suit Switch" : "Kabin / Gezgin / Giysi Hacim Seçimi");
        });
        $("sel-crew-response").addEventListener("change", () => {
            runSimulationUpdate(state.lang === "en" ? "ECLSS Crew Response Time" : "ECLSS Mürettebat Müdahale Süresi");
        });
        $("btn-guided-tour").addEventListener("click", startGuidedTour);
        $("btn-tour-next").addEventListener("click", advanceGuidedTour);
        $("btn-tour-close").addEventListener("click", stopGuidedTour);

        // Simülasyon Kaydırıcıları & Kontrolleri
        ["inp-fuel", "inp-diluent"].forEach((id) => {
            $(id).addEventListener("change", () => runSimulationUpdate());
        });
        ["inp-gravity", "inp-oxygen", "inp-pressure", "inp-airflow", "inp-droplet"].forEach((id) => {
            $(id).addEventListener("input", scheduleSimUpdate);
        });

        // Sekme 1 Hızlı Dosya/Resim -> 3B Simülasyon Aktarıcı
        $("inp-quick-lab-media").addEventListener("change", (e) => {
            const f = e.target.files && e.target.files[0];
            if (f) ingestMediaFile(f, true, "quick-lab-media-status");
        });

        // 3B Kamera Açıları ve Ateşleme
        document.querySelectorAll(".cam-btn[data-cam]").forEach((btn) => {
            btn.addEventListener("click", () => {
                if (state.chamber3D) state.chamber3D.setCameraPreset(btn.dataset.cam);
            });
        });
        $("btn-reignite").addEventListener("click", () => {
            if (state.chamber3D) state.chamber3D.reigniteDroplet();
            showToast(state.lang === "en" ? "⌖ Hot-wire igniter triggered." : "⌖ Sıcak tel ateşleyici devreye alındı.");
        });

        // Ses Sonifikasyonu
        $("btn-audio-toggle").addEventListener("click", () => {
            const playing = state.sonifier.toggle();
            $("btn-audio-toggle").textContent = playing ? tStr("audio_stop") : tStr("audio_start");
            if (playing && state.currentSim) {
                state.sonifier.updateTelemetry(state.currentSim.telemetry);
            }
        });

        // Simülasyonu ve Denklemleri Kanıt Konsolunda Analiz Et
        const triggerDeepSimAI = () => {
            switchTab("tab-copilot");
            sendChatMessage(
                state.lang === "en"
                    ? "Evaluate my active 3D Combustion Chamber parameters, dimensionless numbers (K, B_oq, Sh, Re, Gr, Ra, Ri, Da, χ_r, MOC), ISS R² validation, and ECLSS survival timeline; rank matching NASA PSI experiments and provide spacecraft fire safety & Earth spinoff recommendations."
                    : "Şu anki 3B Yanma Odası parametrelerimi, hesaplanan tüm boyutsuz sayıları (K, B_oq, Sh, Re, Gr, Ra, Ri, Da, χ_r, MOC), ISS R² doğrulama uyumunu ve ECLSS yaşam destek saatini formüllerle değerlendir; en yakın NASA PSI deneylerini sıralayarak uzay aracı yangın güvenliği ve Dünya'ya teknoloji transferi önerilerini sun."
            );
        };
        $("btn-ai-interpret-sim").addEventListener("click", triggerDeepSimAI);
        $("btn-deep-ai-from-formula").addEventListener("click", triggerDeepSimAI);

        // Donanım Raf Filtresi (CIR / MSG / CYGNUS / CABIN)
        document.querySelectorAll(".hw-filter-btn").forEach((btn) => {
            btn.addEventListener("click", () => {
                document.querySelectorAll(".hw-filter-btn").forEach((b) => b.classList.remove("active"));
                btn.classList.add("active");
                state.activeHardwareFilter = btn.dataset.hw || "ALL";
                refreshRankingTable();
            });
        });

        // Sıralama ve Karşılaştırma
        $("btn-run-rank").addEventListener("click", refreshRankingTable);
        $("inp-rank-query").addEventListener("keydown", (e) => {
            if (e.key === "Enter") refreshRankingTable();
        });
        $("btn-compare-selected").addEventListener("click", runComparisonUpdate);

        // Sürekli Canlı Telemetri Veri Akışı
        $("btn-stream-toggle").addEventListener("click", () => {
            configureContinuousStream(!state.streamEnabled, !state.streamEnabled);
        });
        $("btn-stream-poll-now").addEventListener("click", () => {
            configureContinuousStream(state.streamEnabled, true);
            showToast(state.lang === "en" ? "⌖ Polling live NASA/Web telemetry stream..." : "⌖ Canlı telemetri kaynağından anlık veri paketi çekiliyor...");
        });
        $("sel-stream-source").addEventListener("change", () => {
            const v = $("sel-stream-source").value;
            const inp = $("inp-stream-target");
            if (v === "custom_url" && (inp.value === "auto" || !inp.value.startsWith("http"))) {
                inp.value = "https://ntrs.nasa.gov/api/citations/search?q=Saffire%20fire";
            } else if (v !== "custom_url" && inp.value.startsWith("http")) {
                inp.value = "auto";
            }
        });
        state.streamPollTimer = setInterval(() => {
            if (state.streamEnabled) {
                pollStreamStatusOnce();
            }
        }, 4000);

        // Manuel Canlı NASA API
        $("btn-fetch-nasa-live").addEventListener("click", fetchLiveNasaData);
        $("inp-live-nasa-q").addEventListener("keydown", (e) => {
            if (e.key === "Enter") fetchLiveNasaData();
        });
        document.querySelectorAll(".quick-ntrs-btn").forEach((b) => {
            b.addEventListener("click", () => {
                $("inp-live-nasa-q").value = b.dataset.q;
                fetchLiveNasaData();
            });
        });

        // Web Çözümleyici & Çok Modlu Dosya/Görüntü Yükleme
        $("btn-scrape-url").addEventListener("click", async () => {
            const url = $("inp-scrape-url").value.trim();
            if (!url) return;
            showToast(state.lang === "en" ? "◈ Parsing scientific URL..." : "◈ Web kaynağı çözümleniyor, parametreler 3B sahneye aktarılıyor...");
            try {
                const res = await apiFetch("/api/scrape-url", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ url }),
                });
                const data = await res.json();
                if (data.ok) {
                    state.attachedMediaName = data.title || url;
                    state.attachedMediaSummary = `◈ **Web (${url}):** ${data.title}\n${data.preview || ""}`;
                    if ($("chk-media-autosync").checked && data.extracted_sim_params) {
                        applyParamsToSliders(data.extracted_sim_params);
                        if (data.simulation) {
                            applySimulationStateEverywhere(data.simulation, `Web (${(data.title || url).slice(0, 35)})`);
                        }
                    }
                    showToast(`● '${data.title}' (${data.chunks} chunks) synced.`);
                } else {
                    showToast(`▲ ${data.error || "Failed"}`);
                }
            } catch (err) {
                showToast(`▲ ${err.message}`);
            }
        });

        $("btn-upload-doc").addEventListener("click", () => {
            const fileInput = $("inp-doc-file");
            if (!fileInput.files || !fileInput.files[0]) {
                showToast(
                    state.lang === "en"
                        ? "Please select a flame image (.png/.jpg) or dataset (.csv/.pdf/.json/.txt) first."
                        : "Lütfen önce bir alev görüntüsü (.png/.jpg) veya veri dosyası (.csv/.pdf/.json/.txt) seçin."
                );
                return;
            }
            ingestMediaFile(fileInput.files[0], $("chk-media-autosync").checked, null);
        });

        $("btn-rag-search").addEventListener("click", async () => {
            const q = $("inp-rag-search").value.trim();
            if (!q) return;
            const res = await apiFetch(`/api/rag-search?q=${encodeURIComponent(q)}`);
            const data = await res.json();
            const box = $("rag-search-results");
            box.innerHTML = "";
            (data.results || []).forEach((r) => {
                const d = document.createElement("div");
                d.className = "live-result-card";
                d.innerHTML = `
                    <div style="display:flex; justify-content:space-between;">
                        <strong style="color:#38bdf8;">${escapeHtml(r.title)}</strong>
                        <span class="preset-badge">${(r.similarity * 100).toFixed(1)}%</span>
                    </div>
                    <p style="font-size:12px; color:#cbd5e1; margin-top:4px;">${escapeHtml(r.text.slice(0, 260))}...</p>
                `;
                box.appendChild(d);
            });
        });

        // Kanıt Konsolu & Hızlı Çekirdek Seçici
        $("btn-send-chat").addEventListener("click", () => sendChatMessage());
        $("btn-cancel-chat").addEventListener("click", cancelActiveChatJob);
        $("inp-chat-msg").addEventListener("keydown", (e) => {
            if (e.key === "Enter") sendChatMessage();
        });
        document.querySelectorAll(".copilot-prompt-btn").forEach((btn) => {
            btn.addEventListener("click", () => {
                const p = state.lang === "en"
                    ? (btn.getAttribute("data-prompt-en") || btn.getAttribute("data-prompt-tr"))
                    : (btn.getAttribute("data-prompt-tr") || btn.getAttribute("data-prompt-en"));
                sendChatMessage(p);
            });
        });
        $("sel-copilot-provider").addEventListener("change", () => {
            $("cfg-active-provider").value = $("sel-copilot-provider").value;
            saveAllSettings(true);
        });
        $("inp-chat-image").addEventListener("change", (e) => {
            const f = e.target.files && e.target.files[0];
            if (!f) return;
            ingestMediaFile(f, true, null);
        });
        $("chk-deep-6stage").addEventListener("change", () => saveAllSettings(true));

        // Kalibrasyon, Yerel Çıkarım Köprüleri, Ollama & Canlı Doğrulama Testi
        $("btn-save-config").addEventListener("click", () => saveAllSettings(false));
        $("btn-save-directives").addEventListener("click", () => saveAllSettings(false));
        $("btn-refresh-ollama").addEventListener("click", async () => {
            showToast(state.lang === "en" ? "⌖ Inspecting Local Ollama & System CLI Bridge..." : "⌖ Yerel Ollama ve Sistem CLI Köprüsü durumları denetleniyor...");
            const [resOll, resAgy] = await Promise.all([
                apiFetch("/api/ollama/status"),
                apiFetch("/api/antigravity/status"),
            ]);
            const stOll = await resOll.json();
            const stAgy = await resAgy.json();
            populateOllamaDropdown(stOll, $("cfg-ollama-model").value);
            populateLocalBridgeDropdown(stAgy, $("cfg-agy-model").value, false);
            showToast(
                `Ollama: ${stOll.online ? "● Online" : "▲ Offline"} | CLI Bridge: ${stAgy.cli_ready ? "● Ready" : "○ Inactive"}`
            );
        });

        $("btn-test-provider").addEventListener("click", async () => {
            const out = $("provider-test-output");
            const prov = $("cfg-active-provider").value;
            out.style.color = "#93c5fd";
            out.textContent = state.lang === "en"
                ? `◈ Running live scientific verification on '${formatKernelDisplayName(prov)}'...`
                : `◈ '${formatKernelDisplayName(prov)}' çekirdeği üzerinde bilimsel doğrulama çalıştırılıyor...`;
            await saveAllSettings(true);
            try {
                const res = await apiFetch("/api/providers/test", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ provider: prov }),
                });
                const d = await res.json();
                if (d.ok) {
                    out.style.color = "#6ee7b7";
                    out.innerHTML = `● <strong>${escapeHtml(formatKernelDisplayName(d.provider))} (${escapeHtml(d.model)})</strong> — ${d.latency_s} s:<br/><em>"${escapeHtml(d.sample)}"</em>`;
                } else {
                    out.style.color = "#fca5a5";
                    out.textContent = `▲ ${d.error || d.note || "Failed"}`;
                }
            } catch (err) {
                out.style.color = "#fca5a5";
                out.textContent = `▲ ${err.message}`;
            }
        });

        $("btn-ollama-pull").addEventListener("click", async () => {
            const m = $("inp-ollama-pull").value.trim();
            if (!m) return;
            showToast(`◈ Pulling '${m}'...`);
            const res = await apiFetch("/api/ollama/pull", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ model: m }),
            });
            const data = await res.json();
            showToast(data.ok ? `● '${m}' ready.` : `▲ ${data.error}`);
            if (data.ok) $("btn-refresh-ollama").click();
        });

        $("btn-ollama-unload").addEventListener("click", async () => {
            const res = await apiFetch("/api/ollama/unload", { method: "POST" });
            const d = await res.json();
            showToast(`✕ ${d.unloaded || 0} models unloaded from RAM/VRAM.`);
        });

        window.addEventListener("resize", () => {
            redrawActiveLabCharts();
        });

        renderAudienceBanner();
        loadSystemBootstrap();
    });
})();
