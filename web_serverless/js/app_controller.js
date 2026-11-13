/* ============================================================================
   ALTAR-NASA Görev Kontrol Ana Kontrolcüsü v5.1 (app_controller.js)
   - 3B WebGL Yanma Odası (Damlacık • Polimer Çubuk • Kumaş Plaka • Küresel Brülör)
   - Kısmi Yerçekimi (0.16G Ay / 0.38G Mars) LUCI/FM2 ve E-FIELD Şeffaflık Sistemi
   - EVA Uzay Giysisi (%100 O₂ @ 4.3 psia), Ay Gezgini (%32 O₂ @ 10.2 psia) ve CFI-G (%85 O₂)
   - 15 NASA PSI Deneyi, Donanım Filtresi (CIR/MSG/Cygnus/DAFT) ve Test Varyasyonları
   - Çift Dilli (TR / EN) Sade Mühendislik Arayüzü
   ============================================================================ */

(function () {
    "use strict";

    const UI_I18N = {
        tr: {
            brand_sub: "Mikro Yerçekimi Yanma Analizi ve Yangın Güvenliği Platformu",
            nav_lab: "Yanma Odası",
            nav_rank: "NASA Deneyleri",
            nav_live: "Veri ve Görüntü",
            nav_copilot: "Mühendislik Analizi",
            nav_settings: "Doğrulama ve Ayarlar",
            quick_ingest_title: "Hızlı Veri Yükle",
            quick_ingest_desc: "Yüklediğiniz alev fotoğrafı veya veri dosyasından parametreler otomatik çıkarılır ve 3B sahneye uygulanır:",
            presets_title: "Hazır Senaryolar",
            controls_title: "Yanma Ayarları",
            lbl_fuel: "Yakıt Türü",
            lbl_gravity: "Yerçekimi İvmesi",
            lbl_oxygen: "Oksijen Oranı",
            lbl_pressure: "Ortam Basıncı",
            lbl_airflow: "Hava Akış Hızı",
            lbl_droplet: "Numune Çapı",
            lbl_diluent: "Seyreltici Gaz",
            audio_title: "Alev Seslendirme",
            audio_start: "Sesi Aç",
            audio_stop: "Sesi Kapat",
            audio_desc: "Sıcaklık ve görünmez Soğuk Alev titreşimlerini gerçek zamanlı ses frekansına dönüştürür.",
            chamber_title: "3B Yanma Odası",
            chamber_hint: "Sürükle: Döndür • Tekerlek: Yakınlaştır",
            cam_front: "Ön Açı",
            cam_macro: "Yakın Çekirdek",
            cam_sensors: "Sensör Açısı",
            cam_top: "Üst Kesit",
            cam_reignite: "Yeniden Ateşle",
            leg_blue: "Mavi Alev",
            leg_soot: "Kurum Işıması",
            leg_cool: "Soğuk Alev",
            leg_geom: "Yakıt Numunesi",
            chart_sensor_title: "Sensör Zaman Grafiği",
            chart_sensor_sub: "Optik • IR • CO",
            tel_panel_title: "Anlık Ölçümler",
            btn_ai_interpret: "Detaylı Analiz",
            lbl_risk_score: "YANGIN RİSK SKORU",
            card_temp: "Alev Sıcaklığı",
            card_moc: "Kritik Oksijen",
            card_kburn: "Yanma Sabiti",
            card_spread: "Yayılma Hızı",
            card_rad: "Isıl Kayıp",
            card_co: "Karbonmonoksit",
            chart_moc_title: "Tutuşma Sınır Haritası",
            chart_moc_desc: "0G ve 1G MOC eğrileri ara yerçekimi (0.16G Ay LUCI/FM2) davranışını sınırlar; düşük fan akışı (3–8 cm/s) gizli risk yaratır.",
            formula_table_title: "Fiziksel Denklemler",
            th_law: "Fiziksel Yasa",
            th_eq: "Denklem",
            th_val: "Sayısal Sonuç",
            th_status: "Durum",
            live_synthesis_title: "Anlık Değerlendirme",
            btn_full_ai_report: "Tam Rapor",
            cabin_clock_title: "Yaşam Destek Saati",
            rank_main_title: "Deney Sıralaması",
            rank_main_desc: "Uzay istasyonu, uzay giysisi, Ay/Mars üsleri ve basınçlı gezginler için en kritik 15 NASA PSI deneyini fiziksel yakınlık ile sıralar ve karşılaştırır.",
            rank_placeholder: "Örn: soğuk alev, CFI-G, DAFT toz, SPICE, gezgin...",
            btn_rerank: "Sırala",
            btn_compare: "Seçilenleri Kıyasla",
            lbl_hw_filter: "Donanım Filtresi:",
            hw_all: "Tüm Deneyler",
            hw_cir: "ISS CIR / ACME",
            hw_msg: "MSG Fan Kanalı",
            hw_cygnus: "Cygnus Aracı",
            hw_cabin: "Duman ve Toz",
            psi_rocket_scope_note: "NASA PSI Kapsam Notu: Roket motorları ve iticilerdeki yüksek gaz hızları yanmayı yerçekiminden bağımsız kıldığından PSI veritabanı mürettebat kabinleri, uzay giysileri ve yüzey habitatlarındaki yangın güvenliğine odaklanır.",
            th_sel: "Seç",
            th_rank: "Sıra",
            th_prog: "Program",
            th_exp_detail: "Deney Özeti ve Bulgular",
            th_cond: "Test Koşulları",
            th_prio: "Uyum Skoru",
            th_evid: "İşlemler",
            intra_runs_hint: "Yukarıdaki tablodan herhangi bir deneyin \"Test Varyasyonları\" düğmesine tıklayarak aynı donanım içindeki testlerin nasıl farklılaştığını inceleyin:",
            cmp_section_title: "Deney Karşılaştırması",
            earth_section_title: "Dünya Uygulamaları",
            stream_panel_title: "Canlı NASA Akışı",
            stream_panel_desc: "Seçtiğiniz NASA veri tabanından (NTRS / OSDR-PSI) veya özel bir JSON / CSV bağlantısından belirlediğiniz aralıklarla veri çeker ve simülasyonu günceller.",
            stream_target_ph: "Sorgu ('auto' = tüm NASA deneylerini tarar) veya https://... adresi girin",
            btn_stream_start: "Akışı Başlat",
            btn_stream_stop: "Akışı Durdur",
            btn_stream_now: "Şimdi Çek",
            chk_stream_sync: "Yeni verileri 3B Yanma Odasına otomatik uygula",
            stream_not_started: "Henüz akış başlatılmadı.",
            live_search_title: "NASA Arşiv Sorgusu",
            live_search_desc: "Doğrudan resmi ntrs.nasa.gov ve osdr.nasa.gov servislerinden gerçek zamanlı bilimsel rapor ve deney kayıtlarını sorgulayın.",
            btn_fetch_live: "Arşivde Ara",
            ingest_panel_title: "Dosya ve Fotoğraf Analizi",
            ingest_panel_desc: "Alev fotoğraflarını (.png, .jpg) veya veri tablolarını (.csv, .json, .pdf, .txt) yükleyin; çıkarılan parametreler 3B odaya aktarılır.",
            lbl_scrape_url: "Web Bağlantısı Çözümle",
            btn_scrape_url: "3B'ye Aktar",
            lbl_choose_file: "Veri Dosyası veya Fotoğraf Seç",
            chk_media_sync: "Çıkarılan verileri otomatik olarak 3B Yanma Odasına uygula",
            btn_upload_doc: "Dosyayı Analiz Et",
            rag_test_title: "Metin Arama",
            rag_search_ph: "Deney kayıtlarında kavram ara...",
            btn_rag_search: "Ara",
            copilot_tasks_title: "Hazır Sorular",
            cp_btn_1: "Aktif Odayı Değerlendir",
            cp_btn_2: "Giysi ve Gezgin Kıyasla",
            cp_btn_3: "Kısmi Yerçekimi Analizi",
            cp_btn_4: "Soğuk Alev ve Sensörler",
            cp_btn_5: "Su Sisi ve İtfaiye",
            copilot_attach_title: "Dosya Ekle",
            copilot_attach_desc: "Alev fotoğrafı (.png/.jpg) veya veri dosyası (.csv/.pdf/.json/.txt) seçtiğinizde hem 3B simülasyon güncellenir hem de denklemlerle değerlendirilir:",
            chk_6stage: "NASA-STD-6001B Güvenlik Denetimi Aktif",
            lbl_active_engine: "Hesaplama Modu:",
            copilot_ctx_tag: "3B Yanma Odası ve 15 PSI Deneyi Bağlı",
            welcome_title: "Mühendislik Analizi ve Karar Desteği",
            kv_solver_lbl: "SAYISAL ÇÖZÜCÜ",
            kv_solver_val: "d² • B_oq • Sh • Da • MOC",
            kv_corpus_lbl: "VERİ KAYNAKLARI",
            kv_auditor_lbl: "GÜVENLİK STANDARDI",
            welcome_p1: "Bu modül; aktif 3B yanma odası durumunu, boyutsuz taşınım sayılarını, ISS uçuş doğrulama sonuçlarını (R² / RMSE) ve 15 doğrulanmış NASA PSI deneyini analitik çözücü üzerinden değerlendirir.",
            welcome_p2: "Uzay istasyonları (ISS), EVA uzay giysileri (%100 O₂ @ 4.3 psia), Ay/Mars yüzey üsleri ve basınçlı gezginler (10.2 psia) için tutuşma sınırlarını, soğuk alev davranışını ve su sisi protokollerini sorgulayabilirsiniz.",
            chat_input_ph: "Yanma denklemleri, uzay giysisi/gezgin atmosferi veya NASA PSI deney sorusu yazın...",
            btn_stop_chat: "Durdur",
            btn_send_chat: "Analiz Et",
            set_card1_title: "Çözücü Durumu",
            set_ollama_hub_title: "Yerel Model Ayarları",
            spec_k1: "TAŞINIM ÇÖZÜCÜ",
            spec_k2: "ISS DOĞRULAMASI",
            spec_k3: "ÇALIŞMA MODU",
            spec_v3: "Çevrimdışı / Yerel",
            spec_k4: "GÜVENLİK STANDARDI",
            con_enforced_badge: "AKTİF DENETİM",
            acc_opt_badge: "İSTEĞE BAĞLI",
            btn_check_all: "Durumu Yenile",
            lbl_def_provider: "Varsayılan Hesaplama Modu",
            lbl_agy_model: "Yerel Sistem Köprüsü",
            lbl_ollama_host: "Yerel Servis Adresi",
            lbl_ollama_model: "Yüklü Yerel Model",
            lbl_ollama_pull: "Model İndir veya Bellek Temizle",
            btn_pull: "İndir",
            btn_unload: "Temizle",
            btn_test_provider: "Çözücüyü Test Et",
            set_card2_title: "Gelişmiş Bağlantılar",
            set_card2_desc: "Bağlantı anahtarları kaynak koda gömülmez; yalnızca yerel kullanıcı yapılandırma dosyasında saklanır.",
            lbl_gemini_key: "Google Gemini Anahtarı",
            lbl_gemini_model: "Google Gemini Modeli",
            lbl_agy_key: "Yerel Köprü Anahtarı (İsteğe Bağlı)",
            lbl_or_key: "OpenRouter Anahtarı",
            lbl_or_model: "OpenRouter Modeli",
            lbl_custom_gw: "Özel Uç Nokta Bağlantısı",
            btn_save_cfg: "Ayarları Kaydet",
            set_card3_title: "Fiziksel Kurallar",
            set_card3_desc: "Aşağıdaki taşınım yasaları, boyutsuz rejim sınırları ve NASA-STD-6001B uçuş güvenliği kuralları tüm hesaplama adımlarında zorunlu olarak denetlenmektedir:",
            lbl_extra_dir: "Raporlama Notları",
            extra_dir_ph: "Örn: Teknik çıktılarda her zaman kPa biriminin yanında psia karşılığını da belirt...",
            btn_save_dir: "Notları Güncelle",
            btn_export_report: "Rapor İndir",
            btn_clear_chat: "Sıfırla",
            shield_badge: "Çevrimdışı Mod",
            lbl_audience: "Görünüm:",
            btn_guided_tour: "Rehberli Tur",
            chk_flight_pts: "ISS Ölçümleri",
            btn_export_csv: "CSV İndir",
            btn_export_json: "JSON İndir",
            btn_tour_end: "Bitir",
            btn_tour_next: "Sonraki Adım",
        },
        en: {
            brand_sub: "Microgravity Combustion Analysis & Fire Safety Platform",
            nav_lab: "Combustion Chamber",
            nav_rank: "NASA Experiments",
            nav_live: "Data & Imagery",
            nav_copilot: "Engineering Analysis",
            nav_settings: "Validation & Settings",
            quick_ingest_title: "Quick File Load",
            quick_ingest_desc: "Combustion parameters are automatically extracted from your flame photo or dataset and applied to 3D:",
            presets_title: "Mission Presets",
            controls_title: "Chamber Controls",
            lbl_fuel: "Fuel Type",
            lbl_gravity: "Gravity Level",
            lbl_oxygen: "Oxygen Level",
            lbl_pressure: "Ambient Pressure",
            lbl_airflow: "Airflow Speed",
            lbl_droplet: "Sample Diameter",
            lbl_diluent: "Diluent Gas",
            audio_title: "Flame Audio",
            audio_start: "Play Audio",
            audio_stop: "Mute Audio",
            audio_desc: "Converts flame temperature and invisible Cool Flame oscillations into real-time audio frequencies.",
            chamber_title: "3D Combustion Chamber",
            chamber_hint: "Drag: Orbit • Scroll: Zoom",
            cam_front: "Front View",
            cam_macro: "Core View",
            cam_sensors: "Sensor View",
            cam_top: "Top Cutaway",
            cam_reignite: "Re-Ignite",
            leg_blue: "Blue Flame",
            leg_soot: "Soot Glow",
            leg_cool: "Cool Flame",
            leg_geom: "Fuel Sample",
            chart_sensor_title: "Sensor Time Chart",
            chart_sensor_sub: "Optical • IR • CO",
            tel_panel_title: "Live Measurements",
            btn_ai_interpret: "Detailed Analysis",
            lbl_risk_score: "FIRE RISK SCORE",
            card_temp: "Flame Temperature",
            card_moc: "Critical Oxygen",
            card_kburn: "Burn Constant",
            card_spread: "Spread Rate",
            card_rad: "Radiative Loss",
            card_co: "Carbon Monoxide",
            chart_moc_title: "Flammability Map",
            chart_moc_desc: "0G and 1G MOC curves bound intermediate partial gravity (0.16G Lunar LUCI/FM2); gentle 3–8 cm/s airflow lowers MOC.",
            formula_table_title: "Governing Equations",
            th_law: "Physical Law",
            th_eq: "Equation",
            th_val: "Live Value",
            th_status: "Status",
            live_synthesis_title: "Instant Summary",
            btn_full_ai_report: "Full Report",
            cabin_clock_title: "Life Support Clock",
            rank_main_title: "Experiment Ranking",
            rank_main_desc: "Ranks and compares 15 verified NASA PSI experiments by physical similarity across stations, EVA suits, Lunar/Mars bases, and pressurized rovers.",
            rank_placeholder: "e.g., cool flame, CFI-G, DAFT dust, SPICE, rover...",
            btn_rerank: "Sort",
            btn_compare: "Compare Selected",
            lbl_hw_filter: "Hardware Filter:",
            hw_all: "All Experiments",
            hw_cir: "ISS CIR / ACME",
            hw_msg: "MSG Flow Duct",
            hw_cygnus: "Cygnus Vehicle",
            hw_cabin: "Smoke & Dust",
            psi_rocket_scope_note: "NASA PSI Scope Note: High gas velocities inside rocket engines and thrusters render combustion effectively gravity-independent; PSI focuses on fire safety in crew cabins, spacesuits, and surface habitats.",
            th_sel: "Pick",
            th_rank: "Rank",
            th_prog: "Program",
            th_exp_detail: "Summary & Findings",
            th_cond: "Test Conditions",
            th_prio: "Match Score",
            th_evid: "Actions",
            intra_runs_hint: "Click \"Test Variations\" on any experiment above to see how runs inside the same facility differed and stayed constant:",
            cmp_section_title: "Experiment Comparison",
            earth_section_title: "Earth Applications",
            stream_panel_title: "Live NASA Stream",
            stream_panel_desc: "Polls official NASA databases (NTRS / OSDR-PSI) or custom JSON / CSV links at your chosen interval and updates the simulation.",
            stream_target_ph: "Query ('auto' = cycles through all NASA experiments) or https://... URL",
            btn_stream_start: "Start Stream",
            btn_stream_stop: "Stop Stream",
            btn_stream_now: "Fetch Now",
            chk_stream_sync: "Automatically apply incoming data to 3D Chamber",
            stream_not_started: "Stream has not started yet.",
            live_search_title: "NASA Archive Search",
            live_search_desc: "Search official ntrs.nasa.gov and osdr.nasa.gov services in real time for scientific reports and experiment records.",
            btn_fetch_live: "Search Archive",
            ingest_panel_title: "File & Flame Analysis",
            ingest_panel_desc: "Upload flame photos (.png, .jpg) or data files (.csv, .json, .pdf, .txt); extracted parameters sync directly to the 3D chamber.",
            lbl_scrape_url: "Parse Web Link",
            btn_scrape_url: "Sync to 3D",
            lbl_choose_file: "Choose Data File or Photo",
            chk_media_sync: "Automatically apply extracted parameters to 3D Chamber",
            btn_upload_doc: "Analyze File",
            rag_test_title: "Text Search",
            rag_search_ph: "Search concepts in experiment records...",
            btn_rag_search: "Search",
            copilot_tasks_title: "Quick Questions",
            cp_btn_1: "Evaluate Active Chamber",
            cp_btn_2: "Compare Suit & Rover",
            cp_btn_3: "Partial Gravity Analysis",
            cp_btn_4: "Cool Flame & Sensors",
            cp_btn_5: "Water Mist & Spinoffs",
            copilot_attach_title: "Attach File",
            copilot_attach_desc: "Selecting a flame photo (.png/.jpg) or data file (.csv/.pdf/.json/.txt) updates both the 3D simulation and governing equation analysis:",
            chk_6stage: "NASA-STD-6001B Safety Check Active",
            lbl_active_engine: "Analysis Mode:",
            copilot_ctx_tag: "3D Chamber & 15 PSI Experiments Linked",
            welcome_title: "Engineering Analysis & Decision Support",
            kv_solver_lbl: "NUMERICAL SOLVER",
            kv_solver_val: "d² • B_oq • Sh • Da • MOC",
            kv_corpus_lbl: "DATA SOURCES",
            kv_auditor_lbl: "SAFETY STANDARD",
            welcome_p1: "This module evaluates the active 3D chamber state, dimensionless transport numbers, ISS flight validation metrics (R² / RMSE), and 15 verified NASA PSI experiments via the analytical solver.",
            welcome_p2: "Ask about flammability bounds, invisible cool-flame behavior, and fine water mist protocols across ISS modules, EVA suits (100% O₂ @ 4.3 psia), Lunar/Mars bases, and pressurized rovers (10.2 psia).",
            chat_input_ph: "Ask about combustion equations, spacesuit/rover atmospheres, or NASA PSI experiments...",
            btn_stop_chat: "Stop",
            btn_send_chat: "Run Analysis",
            set_card1_title: "Solver Status",
            set_ollama_hub_title: "Local Model Settings",
            spec_k1: "TRANSPORT SOLVER",
            spec_k2: "ISS VALIDATION",
            spec_k3: "OPERATING MODE",
            spec_v3: "Offline / Local",
            spec_k4: "SAFETY STANDARD",
            con_enforced_badge: "ACTIVE AUDIT",
            acc_opt_badge: "OPTIONAL",
            btn_check_all: "Refresh Status",
            lbl_def_provider: "Default Analysis Mode",
            lbl_agy_model: "Local System Bridge",
            lbl_ollama_host: "Local Service Address",
            lbl_ollama_model: "Installed Local Model",
            lbl_ollama_pull: "Download Model or Clear Memory",
            btn_pull: "Download",
            btn_unload: "Clear",
            btn_test_provider: "Test Solver",
            set_card2_title: "Advanced Connections",
            set_card2_desc: "Connection keys are never embedded in source code; stored only in your local user configuration file.",
            lbl_gemini_key: "Google Gemini Key",
            lbl_gemini_model: "Google Gemini Model",
            lbl_agy_key: "Local Bridge Token (Optional)",
            lbl_or_key: "OpenRouter Key",
            lbl_or_model: "OpenRouter Model",
            lbl_custom_gw: "Custom Endpoint Connection",
            btn_save_cfg: "Save Settings",
            set_card3_title: "Physical Rules",
            set_card3_desc: "The following transport laws, dimensionless regime bounds, and NASA-STD-6001B flight safety rules are strictly enforced across all solver calculations:",
            lbl_extra_dir: "Reporting Notes",
            extra_dir_ph: "e.g., Always include psia alongside metric kPa pressure units in technical outputs...",
            btn_save_dir: "Update Notes",
            btn_export_report: "Download Report",
            btn_clear_chat: "Reset",
            shield_badge: "Offline Mode",
            lbl_audience: "View:",
            btn_guided_tour: "Guided Tour",
            chk_flight_pts: "ISS Flight Data",
            btn_export_csv: "Download CSV",
            btn_export_json: "Download JSON",
            btn_tour_end: "Finish",
            btn_tour_next: "Next Step",
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
        activeSourceLabel: "Yanma Odası",
        activeHardwareFilter: "ALL",
        activeIntraExpId: "PSI-FLEX-01",
        rankedList: [],
        selectedCompareIds: new Set(["PSI-FLEX-01", "PSI-BASS-03", "PSI-SAFFIRE5-07", "PSI-ACME-CFIG-14"]),
        chatHistory: [],
        attachedImageB64: null,
        attachedMediaSummary: "",
        attachedMediaSummaryTr: "",
        attachedMediaSummaryEn: "",
        attachedMediaPhases: [],
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

        if (window.ALTAR_SERVERLESS_MODE) {
            if ($("isolation-shield-pill")) {
                $("isolation-shield-pill").textContent =
                    state.lang === "en" ? "Browser Mode" : "Tarayıcı Modu";
            }
            document.querySelectorAll('[data-i18n="spec_v3"]').forEach((el) => {
                el.textContent = state.lang === "en" ? "In-Browser" : "Tarayıcı İçi";
            });
        }

        if (!state.streamEnabled && $("header-stream-text")) {
            $("header-stream-text").textContent = state.lang === "en" ? "Stream: Ready" : "Akış: Hazır";
        }
        if (state.attachedMediaName && (state.attachedMediaSummaryTr || state.attachedMediaSummaryEn)) {
            state.attachedMediaSummary = state.lang === "en"
                ? (state.attachedMediaSummaryEn || state.attachedMediaSummaryTr)
                : (state.attachedMediaSummaryTr || state.attachedMediaSummaryEn);
            renderUploadedMediaUI();
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
                tr: "**Araştırmacı Görünümü:** Analitik `d²` yasası (`K`), Spalding `B_oq`, Sherwood `Sh`, Damköhler `Da` ve ısıl kayıp (`χ_r`) denklemleri aktif. Grafikler üzerindeki **ISS ölçüm noktaları** gerçek NASA GRC uçuş verileriyle canlı `R²` / `RMSE` uyumunu gösterir; sağ üstten **CSV / JSON** veri setlerini indirebilirsiniz.",
                en: "**Researcher View:** Analytical `d²`-law (`K`), Spalding `B_oq`, Sherwood `Sh`, Damköhler `Da`, and radiative fraction (`χ_r`) highlighted. **ISS flight data markers** overlay NASA GRC flight telemetry with live `R²` / `RMSE` metrics; download predictive datasets via **Download CSV / JSON** above.",
            },
            student: {
                tr: "**Öğrenci Görünümü:** Dünya'da (`1G`) ısınan hava yükselerek alevi gözyaşı şekline sokar. Uzayda (`0G`) kaldırma kuvveti yok olur (`Ra = 0`); oksijen yalnızca moleküler difüzyonla ilerlediği için alev **küresel safir-mavi** bir topa dönüşür veya çıplak gözle görülemeyen **550–780 K Soğuk Alev** fazına geçer.",
                en: "**Student View:** On Earth (`1G`), rising hot gas stretches flames into teardrops. In freefall (`0G`), buoyancy vanishes (`Ra = 0`); oxygen arrives purely via molecular diffusion, turning the flame into a **sapphire-blue sphere** or an invisible **550–780 K Cool Flame** that blinds optical smoke detectors.",
            },
            engineer: {
                tr: "**Mühendis Görünümü:** Uzay giysisi (`4.3 psia / %100 O₂`) ve basınçlı Ay gezgini (`10.2 psia / %32 O₂`) atmosferlerinde azot ısıl balastı azaldığından yayılma hızı sıçrar. Aşağıdaki **Yaşam Destek Saati** ile `SMAC 125 ppm CO` süresini izleyin; ilk eylem daima **Fan Kapatma + İnce Su Sisi (SoFIE-MIST)** olmalıdır (*Halon 1301 yasaktır*).",
                en: "**Engineer View:** Reduced N₂ thermal ballast in EVA suits (`4.3 psia / 100% O₂`) and Lunar rovers (`10.2 psia / 32% O₂`) accelerates flame spread. Monitor the **Life Support Clock** below for `SMAC 125 ppm CO` margins; execute **HVAC Cutoff + Fine Water Mist (SoFIE-MIST)** (*Halon 1301 strictly prohibited*).",
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
            .replace(/\\mum\b/g, "µm")
            .replace(/\\mu(?![a-zA-Z])/g, "µ")
            .replace(/\\chi(?![a-zA-Z])/g, "χ")
            .replace(/\\lambda(?![a-zA-Z])/g, "λ")
            .replace(/\\rho(?![a-zA-Z])/g, "ρ")
            .replace(/\\sigma(?![a-zA-Z])/g, "σ")
            .replace(/\\nu(?![a-zA-Z])/g, "ν")
            .replace(/\\tau(?![a-zA-Z])/g, "τ")
            .replace(/\\alpha(?![a-zA-Z])/g, "α")
            .replace(/\\beta(?![a-zA-Z])/g, "β")
            .replace(/\\Delta(?![a-zA-Z])/g, "Δ")
            .replace(/\\nabla(?![a-zA-Z])/g, "∇")
            .replace(/\\infty(?![a-zA-Z])/g, "∞")
            .replace(/\\approx(?![a-zA-Z])/g, "≈")
            .replace(/\\propto(?![a-zA-Z])/g, "∝")
            .replace(/\\(?:leq|le)(?![a-zA-Z])/g, "≤")
            .replace(/\\(?:geq|ge)(?![a-zA-Z])/g, "≥")
            .replace(/\\pm(?![a-zA-Z])/g, "±")
            .replace(/\\cdot(?![a-zA-Z])/g, "·")
            .replace(/\\(?:rightarrow|to)(?![a-zA-Z])/g, "→")
            .replace(/\\times(?![a-zA-Z])/g, "×")
            .replace(/\\%/g, "%")
            .replace(/\$([^$\n]{1,80})\$/g, "$1");
        let html = escapeHtml(cleaned);

        html = html.replace(
            /(?:^\|.+\|[ \t]*(?:\n|$))+/gm,
            (tableBlock) => {
                const lines = tableBlock
                    .trim()
                    .split("\n")
                    .map((ln) => ln.trim())
                    .filter((ln) => ln.startsWith("|") && ln.endsWith("|"));
                if (lines.length < 2 || !/^\|[\s:\-\|]+\|$/.test(lines[1])) {
                    return tableBlock;
                }
                const parseCells = (rowStr) =>
                    rowStr
                        .slice(1, -1)
                        .split("|")
                        .map((c) => c.trim());
                const headers = parseCells(lines[0]);
                const bodyRows = lines.slice(2).map(parseCells);
                const thHtml = headers
                    .map((h) => `<th style="padding:6px 9px; border-bottom:1px solid rgba(56,189,248,0.3); text-align:left; color:#7dd3fc;">${h}</th>`)
                    .join("");
                const trHtml = bodyRows
                    .map(
                        (cols) =>
                            `<tr>${cols
                                .map((c) => `<td style="padding:5px 9px; border-bottom:1px solid rgba(148,163,184,0.14); vertical-align:top;">${c}</td>`)
                                .join("")}</tr>`
                    )
                    .join("");
                return `<div style="overflow-x:auto; margin:8px 0;"><table class="nasa-table" style="width:100%; border-collapse:collapse; font-size:12px;"><thead><tr>${thHtml}</tr></thead><tbody>${trHtml}</tbody></table></div>\n`;
            }
        );

        html = html.replace(/^####\s+(.+)$/gm, "<h4>$1</h4>");
        html = html.replace(/^###\s+(.+)$/gm, "<h3>$1</h3>");
        html = html.replace(/^##\s+(.+)$/gm, "<h3>$1</h3>");
        html = html.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
        html = html.replace(/\*([^*\n]+)\*/g, "<em>$1</em>");
        html = html.replace(/`([^`]+)`/g, "<code>$1</code>");
        html = html.replace(
            /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g,
            '<a class="ext-link" href="$2" target="_blank" rel="noopener">$1</a>'
        );
        html = html.replace(
            /^&gt;\s*(.+)$/gm,
            '<div style="margin:8px 0; padding:8px 12px; border-left:3px solid #f59e0b; background:rgba(245,158,11,0.1); border-radius:4px;">$1</div>'
        );
        html = html.replace(/^\s*\-\s+(.+)$/gm, "• $1");
        html = html.replace(/^\s*(\d+)\.\s+(.+)$/gm, '<strong style="color:#38bdf8;">$1.</strong> $2');
        html = html.replace(/<\/div>\n/g, "</div>");
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
    // SİMÜLASYON, 3B WEBGL, KISMİ YERÇEKİMİ VE DENKLEM TABLOSU GÜNCELLEME
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
            const defaultLbl = state.lang === "en" ? "Combustion Chamber" : "Yanma Odası";
            applySimulationStateEverywhere(data, sourceLabel || defaultLbl);
        } catch (err) {
            console.error("Simulation API error:", err);
        }
    }

    function scheduleSimUpdate() {
        syncSliderLabels();
        clearTimeout(state.simDebounceTimer);
        state.simDebounceTimer = setTimeout(() => {
            const lbl = state.lang === "en" ? "Combustion Chamber" : "Yanma Odası";
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

        const liveAiBox = $("live-formula-ai-box");
        if (liveAiBox && sim.instant_ai_summary) {
            const rawSummary = isEn ? sim.instant_ai_summary.en : sim.instant_ai_summary.tr;
            const mediaLbl = isEn ? "Active File" : "Aktif Dosya";
            const mediaBanner = state.attachedMediaName
                ? `<div style="margin-bottom:8px; padding:5px 9px; background:rgba(16,185,129,0.12); border:1px solid rgba(16,185,129,0.35); border-radius:6px; font-size:11.8px; color:#6ee7b7;">${mediaLbl}: <strong>${escapeHtml(state.attachedMediaName)}</strong></div>`
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
    // DOSYA (.CSV/.JSON/.PDF/.TXT) VE ALEV FOTOĞRAFI (.PNG/.JPG) İŞLEYİCİ
    // =========================================================================
    function activateUploadedPhase(ph, jumpToLab) {
        if (!ph || !ph.sim_params) return;
        const isEn = state.lang === "en";
        applyParamsToSliders(ph.sim_params);
        if (state.chamber3D) state.chamber3D.reigniteDroplet();
        const phTag = isEn
            ? `${state.attachedMediaName} (${ph.short_en || "Phase " + ph.index})`
            : `${state.attachedMediaName} (${ph.short_tr || "Faz " + ph.index})`;
        runSimulationUpdate(phTag);
        refreshRankingTable();
        if (jumpToLab) {
            switchTab("tab-lab");
        }
        showToast(
            isEn
                ? `${ph.short_en || "Phase " + ph.index} loaded into 3D Chamber (${ph.flame_temp_k} K).`
                : `${ph.short_tr || "Faz " + ph.index} 3B Yanma Odasına yüklendi (${ph.flame_temp_k} K).`
        );
    }

    function renderUploadedMediaUI() {
        const isEn = state.lang === "en";
        if (!state.attachedMediaName) return;

        if ($("copilot-live-context-tag")) {
            $("copilot-live-context-tag").textContent = isEn
                ? `Active File: ${state.attachedMediaName} + 3D Chamber`
                : `Aktif Dosya: ${state.attachedMediaName} + 3B Oda`;
        }

        const phases = state.attachedMediaPhases || [];
        const makePhasePillsHtml = (prefix) => {
            if (phases.length <= 1) return "";
            const lbl = isEn ? "3D Phase:" : "3B Faz Seç:";
            const btns = phases
                .map((p) => {
                    const bTxt = isEn ? (p.short_en || `Phase ${p.index}`) : (p.short_tr || `Faz ${p.index}`);
                    const tip = `${p.desc || bTxt} (${p.flame_temp_k} K)`;
                    return `<button type="button" class="btn-secondary ${prefix}-phase-btn" data-pidx="${p.index}" title="${escapeHtml(tip)}" style="padding:2px 7px; font-size:10.8px;">${escapeHtml(bTxt)}</button>`;
                })
                .join("");
            return `<div style="margin-top:6px; display:flex; gap:5px; flex-wrap:wrap; align-items:center;"><span style="font-size:11px; color:#94a3b8;">${lbl}</span>${btns}</div>`;
        };

        const previewBox = $("media-analysis-result-box");
        if (previewBox && state.attachedMediaSummary) {
            const thumbHtml = state.attachedImageB64
                ? `<img src="${state.attachedImageB64}" alt="Flame Preview" />`
                : "";
            previewBox.innerHTML = `
                <div class="media-preview-card">
                    ${thumbHtml}
                    <div style="flex:1; font-size:12px;">
                        <div>${renderSafeMarkdown(state.attachedMediaSummary)}</div>
                        ${makePhasePillsHtml("prev")}
                        <div style="margin-top:8px; display:flex; gap:8px; flex-wrap:wrap;">
                            <button class="btn-primary" id="btn-preview-goto-3d" style="padding:4px 10px; font-size:11.5px;">${isEn ? "View in 3D" : "3B Sahneyi Gör"}</button>
                            <button class="btn-secondary" id="btn-preview-ask-ai" style="padding:4px 10px; font-size:11.5px;">${isEn ? "Detailed Analysis" : "Detaylı Analiz"}</button>
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
            previewBox.querySelectorAll(".prev-phase-btn").forEach((btn) => {
                btn.addEventListener("click", () => {
                    const idx = parseInt(btn.getAttribute("data-pidx"), 10);
                    const found = phases.find((x) => x.index === idx);
                    if (found) activateUploadedPhase(found, true);
                });
            });
        }

        const chatSt = $("chat-image-status");
        if (chatSt) {
            chatSt.innerHTML = `<div><strong>${escapeHtml(state.attachedMediaName)}</strong> <button class="btn-secondary" id="btn-clear-chat-media" style="padding:1px 6px; font-size:10.5px; margin-left:5px;">${isEn ? "Clear" : "Temizle"}</button></div>${makePhasePillsHtml("chat")}`;
            const clr = $("btn-clear-chat-media");
            if (clr) {
                clr.addEventListener("click", () => {
                    state.attachedImageB64 = null;
                    state.attachedMediaSummary = "";
                    state.attachedMediaSummaryTr = "";
                    state.attachedMediaSummaryEn = "";
                    state.attachedMediaPhases = [];
                    state.attachedMediaName = "";
                    chatSt.textContent = "";
                    $("inp-chat-image").value = "";
                    $("copilot-live-context-tag").textContent = tStr("copilot_ctx_tag");
                });
            }
            chatSt.querySelectorAll(".chat-phase-btn").forEach((btn) => {
                btn.addEventListener("click", () => {
                    const idx = parseInt(btn.getAttribute("data-pidx"), 10);
                    const found = phases.find((x) => x.index === idx);
                    if (found) activateUploadedPhase(found, false);
                });
            });
        }
    }

    async function ingestMediaFile(fileObj, syncTo3D, targetStatusElId) {
        if (!fileObj) return;
        const isEn = state.lang === "en";
        const statusEl = targetStatusElId ? $(targetStatusElId) : null;
        if (statusEl) {
            statusEl.style.color = "#7dd3fc";
            statusEl.textContent = isEn
                ? `Analyzing '${fileObj.name}' and extracting parameters...`
                : `'${fileObj.name}' analiz ediliyor ve parametreler çıkarılıyor...`;
        }
        showToast(isEn ? `Processing '${fileObj.name}'...` : `'${fileObj.name}' işleniyor...`);

        const fd = new FormData();
        fd.append("file", fileObj);

        try {
            const res = await apiFetch("/api/ingest-media", { method: "POST", body: fd });
            const data = await res.json();
            if (!data.ok) {
                if (statusEl) {
                    statusEl.style.color = "#fca5a5";
                    statusEl.textContent = `${data.error || "Error"}`;
                }
                showToast(`${data.error || "Failed"}`);
                return;
            }

            state.attachedMediaSummaryTr = data.summary_tr || "";
            state.attachedMediaSummaryEn = data.summary_en || data.summary_tr || "";
            const pickedSummary = isEn ? state.attachedMediaSummaryEn : state.attachedMediaSummaryTr;
            state.attachedMediaName = data.filename || fileObj.name;
            state.attachedMediaSummary = pickedSummary;
            state.attachedMediaPhases = data.phases || [];
            if (data.media_type === "image" && data.image_base64) {
                state.attachedImageB64 = data.image_base64;
            } else {
                state.attachedImageB64 = null;
            }

            if (syncTo3D && data.extracted_sim_params) {
                applyParamsToSliders(data.extracted_sim_params);
                if (state.chamber3D) state.chamber3D.reigniteDroplet();
                const srcTag = isEn ? `Uploaded (${state.attachedMediaName})` : `Yüklenen Veri (${state.attachedMediaName})`;
                if (data.simulation) {
                    applySimulationStateEverywhere(data.simulation, srcTag);
                } else {
                    await runSimulationUpdate(srcTag);
                }
                refreshRankingTable();
            }

            const detectedReg = data.metrics
                ? (isEn ? (data.metrics.detected_regime_en || data.metrics.detected_regime_tr) : data.metrics.detected_regime_tr)
                : "";
            const phaseNote = state.attachedMediaPhases.length > 1
                ? (isEn ? `${state.attachedMediaPhases.length} phases` : `${state.attachedMediaPhases.length} faz`)
                : `${data.chunks || 1} blok`;
            const shortInfo =
                data.media_type === "image"
                    ? `${state.attachedMediaName} -> ${detectedReg}`
                    : `${state.attachedMediaName} (${phaseNote}) -> O₂:%${data.extracted_sim_params.oxygen_pct}, ${data.extracted_sim_params.airflow_cms} cm/s`;

            if (statusEl) {
                statusEl.style.color = "#6ee7b7";
                const btnTxt = isEn ? "Detailed Analysis" : "Detaylı Analiz";
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

            renderUploadedMediaUI();

            showToast(
                isEn
                    ? `'${state.attachedMediaName}' synced to 3D Chamber and Data Records.`
                    : `'${state.attachedMediaName}' 3B Yanma Odasına ve deney kayıtlarına aktarıldı.`
            );
        } catch (err) {
            if (statusEl) {
                statusEl.style.color = "#fca5a5";
                statusEl.textContent = `Error: ${err.message}`;
            }
            showToast(`${err.message}`);
        }
    }

    // =========================================================================
    // CANLI NASA AKIŞI (CONTINUOUS STREAM ENGINE)
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
            badge.textContent = isEn ? `Active (${st.interval_sec} s)` : `Aktif (${st.interval_sec} sn)`;
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
            meta.innerHTML = `<span style="color:#fca5a5;">(${escapeHtml(st.last_fetch_time)}): ${escapeHtml(st.last_error)}</span>`;
        } else if (st.last_fetch_time) {
            meta.textContent = isEn
                ? `Last Poll: ${st.last_fetch_time} • Packets: ${st.seq_id} • Source: ${st.source.toUpperCase()}`
                : `Son Çekim: ${st.last_fetch_time} • Toplam Paket: ${st.seq_id} • Kaynak: ${st.source.toUpperCase()}`;
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
                    state.attachedMediaSummary = `**Live Stream (${topEv.id} • ${topEv.time}):** ${topEv.title}\n${topEv.summary}`;
                }
                applyParamsToSliders(st.latest_sim_params);
                if (state.chamber3D) state.chamber3D.reigniteDroplet();
                runSimulationUpdate(srcTag);
                showToast(
                    isEn
                        ? `New NASA Packet (${topEv ? topEv.id : "#" + st.seq_id}) synced to 3D Chamber.`
                        : `Yeni NASA Paketi (${topEv ? topEv.id : "#" + st.seq_id}) 3B Yanma Odasına aktarıldı.`
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
                    ${ev.url ? `<a class="ext-link" href="${escapeHtml(ev.url)}" target="_blank" rel="noopener" style="font-size:11.5px;">${isEn ? "Open Source" : "Kaynağı Aç"}</a>` : ""}
                    <button class="btn-secondary stream-ev-sync-btn" style="padding:2px 8px; font-size:11px;">${isEn ? "Apply & Analyze" : "Uygula ve Analiz Et"}</button>
                </div>
            `;
            div.querySelector(".stream-ev-sync-btn").addEventListener("click", () => {
                applyParamsToSliders(p);
                state.attachedMediaName = `${ev.id} (${ev.title.slice(0, 45)})`;
                state.attachedMediaSummary = `**[${ev.id}]:** ${ev.title}\n${ev.summary}`;
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
            showToast(`${err.message}`);
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
    // SEKME 2: DENEY SIRALAMASI, DONANIM FİLTRESİ, TEST VARYASYONLARI VE KIYASLAMA
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
                    <div class="meta-detail-line"><strong>${isEn ? "Sample / Burner:" : "Numune / Brülör:"}</strong> ${escapeHtml(geom)}</div>
                    ${sens ? `<div class="meta-detail-line" style="color:#c4b5fd;"><strong>${isEn ? "Sensors:" : "Sensörler:"}</strong> ${escapeHtml(sens)}</div>` : ""}
                    <div style="font-size:12px; color:#6ee7b7; margin-top:4px;">${escapeHtml(insight)}</div>
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
                        NTRS ${escapeHtml(exp.ntrs_id)}
                    </a><br/>
                    <button class="btn-secondary load-exp-sim-btn" data-id="${escapeHtml(exp.exp_id)}" style="margin-top:5px; padding:3px 8px; font-size:11px; width:100%; justify-content:center;">
                        ${isEn ? "Load in 3D" : "3B'de Yükle"}
                    </button>
                    <button class="btn-secondary show-intra-runs-btn" data-id="${escapeHtml(exp.exp_id)}" style="margin-top:4px; padding:3px 8px; font-size:11px; width:100%; justify-content:center; border-color:rgba(56,189,248,0.45); color:#7dd3fc;">
                        ${isEn ? "Test Variations" : "Test Varyasyonları"}
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
                        showToast(isEn ? "Select up to 4 experiments at once." : "En fazla 4 deney aynı anda karşılaştırılabilir.");
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
                            ? `${exp.program} conditions loaded into 3D Chamber.`
                            : `${exp.program} deney koşulları 3B Yanma Odasına yüklendi.`
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
            ? `Test Variations (${exp.program})`
            : `Test Varyasyonları (${exp.program})`;
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
                    <strong style="color:#38bdf8; font-family:Consolas,monospace; font-size:13px;">${escapeHtml(r.run_code)}</strong>
                    <span class="preset-badge">${escapeHtml(exp.program)}</span>
                </div>
                <div style="margin-bottom:5px; color:#cbd5e1;">
                    <strong style="color:#94a3b8;">${isEn ? "Held Constant:" : "Sabit Tutulan:"}</strong> ${escapeHtml(sameTxt)}
                </div>
                <div style="margin-bottom:5px; color:#fde68a;">
                    <strong>${isEn ? "Varied:" : "Değiştirilen:"}</strong> ${escapeHtml(diffTxt)}
                </div>
                <div style="color:#6ee7b7;">
                    <strong>${isEn ? "Outcome:" : "Sonuç:"}</strong> ${escapeHtml(resTxt)}
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
                    <div style="font-size:11.8px; color:#94a3b8; margin-bottom:6px; line-height:1.5;">
                        ${escapeHtml(e.facility)}<br/>
                        ${e.oxygen_pct}% O₂ • ${e.pressure_psia} psia • ${e.airflow_cms} cm/s<br/>
                        ${escapeHtml(e.burning_rate_or_spread)}<br/>
                        ${escapeHtml(sens)}<br/>
                        ${isEn ? "Cool Flame:" : "Soğuk Alev:"} <strong>${e.cool_flame_observed ? (isEn ? "Observed" : "Gözlendi") : (isEn ? "No" : "Hayır")}</strong>
                    </div>
                    <a class="ext-link" href="${escapeHtml(e.ntrs_url)}" target="_blank" rel="noopener" style="font-size:12px;">
                        NTRS #${escapeHtml(e.ntrs_id)}
                    </a>
                `;
                box.appendChild(card);
            });
        } catch (err) {
            console.error("Compare error:", err);
        }
    }

    // =========================================================================
    // SEKME 3: NASA ARŞİV SORGUSU
    // =========================================================================
    async function fetchLiveNasaData() {
        const q = $("inp-live-nasa-q").value.trim() || "microgravity combustion";
        const source = $("sel-live-source").value;
        const badge = $("live-api-badge");
        const listBox = $("live-nasa-results-list");
        const isEn = state.lang === "en";

        badge.textContent = isEn ? "Connecting..." : "Bağlanıyor...";
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
                ? (isEn ? `NASA Live (${data.count})` : `Canlı (${data.count})`)
                : data.source_status === "cached_live"
                ? (isEn ? `Cached (${data.count})` : `Önbellek (${data.count})`)
                : (isEn ? "Offline" : "Çevrimdışı");

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
                    <a class="ext-link" href="${escapeHtml(item.url)}" target="_blank" rel="noopener">${isEn ? "Official Record" : "Resmi Kayıt"}</a>
                    ${item.pdf_url ? `<a class="ext-link" href="${escapeHtml(item.pdf_url)}" target="_blank" rel="noopener">PDF</a>` : ""}
                    <button class="btn-secondary index-ntrs-btn" style="padding:3px 9px; font-size:11.5px;">${isEn ? "Analyze Record" : "Kaydı Analiz Et"}</button>
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
                state.attachedMediaSummary = `**NASA [${item.id}]:** ${item.title}\n${item.abstract}`;
                showToast(isEn ? `${item.id} added to search records.` : `${item.id} arama kayıtlarına eklendi.`);
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
    // SEKME 4: MÜHENDİSLİK ANALİZİ VE KARAR DESTEĞİ
    // =========================================================================
    function formatKernelDisplayName(providerId) {
        const isEn = state.lang === "en";
        const p = String(providerId || "").toLowerCase();
        if (p === "local_cli_bridge" || p === "antigravity") {
            return isEn ? "Local System Bridge" : "Yerel Sistem Köprüsü";
        }
        if (p === "deterministic_physics") {
            return isEn ? "Analytical Physics Solver" : "Analitik Fizik Çözücü";
        }
        if (p === "ollama") {
            return isEn ? "Offline Local Model" : "Çevrimdışı Yerel Model";
        }
        if (p === "gemini") {
            return "Google Gemini";
        }
        if (p === "openrouter") {
            return "OpenRouter";
        }
        return providerId || "Analytical Solver";
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
        const engWord = state.lang === "en" ? "Solver" : "Çözücü";
        const dispProv = formatKernelDisplayName(metaInfo.provider);
        let chips = `<span>${engWord}: <strong>${escapeHtml(dispProv)} (${escapeHtml(metaInfo.model)})</strong></span>`;
        if (metaInfo.citations && metaInfo.citations.length) {
            metaInfo.citations.forEach((c) => {
                chips += `<a class="citation-chip" href="${escapeHtml(c.url)}" target="_blank" rel="noopener">${escapeHtml(c.program)} • ${escapeHtml(c.ntrs_id || c.id)}</a>`;
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
            showToast(isEn ? "Analysis in progress — wait or click Stop." : "Devam eden analizi bekleyin veya 'Durdur' düğmesine basın.");
            return;
        }
        const input = $("inp-chat-msg");
        const text = (customPrompt || input.value || "").trim();
        if (!text) return;
        if (!customPrompt) input.value = "";

        const chosenProvider = $("sel-copilot-provider") ? $("sel-copilot-provider").value : "auto";
        const userDisplay = state.attachedMediaName
            ? `<div style="font-size:11px; color:#bae6fd; margin-bottom:4px;">${escapeHtml(state.attachedMediaName)}</div>${escapeHtml(text)}`
            : escapeHtml(text);

        appendChatBubble("user", userDisplay);

        const aiBubble = appendChatBubble(
            "ai",
            isEn
                ? `<div class="stage-log-box">[1/4] Computing dimensionless laws, 3D telemetry & NASA PSI evidence...</div><div class="live-token-body"><em>Preparing engineering analysis...</em></div>`
                : `<div class="stage-log-box">[1/4] Boyutsuz taşınım yasaları, 3B ölçümler ve NASA PSI kanıtları hazırlanıyor...</div><div class="live-token-body"><em>Mühendislik analizi başlatılıyor...</em></div>`
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
                        aiBubble.innerHTML = `<span style="color:#fca5a5;">${escapeHtml(netErr.message)}</span>`;
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
                    const stageHtml = `<div class="stage-log-box">${escapeHtml(stagesText || "Solver active...")} ${pollData.model ? `<strong>(${escapeHtml(pollData.model)})</strong>` : ""}</div>`;
                    const bodyHtml = partial
                        ? `<div>${renderSafeMarkdown(partial)}</div>`
                        : `<em>${isEn ? "Evaluating governing equations and NASA PSI evidence..." : "Fiziksel taşınım denklemleri ve NASA PSI bulguları değerlendiriliyor..."}</em>`;
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
                        ? `${renderSafeMarkdown(partial)}<div style="margin-top:8px; font-size:11.5px; color:#fcd34d;">${isEn ? "Stopped by user." : "Kullanıcı tarafından durduruldu."}</div>`
                        : `<em style="color:#fcd34d;">${isEn ? "Stopped by user." : "Analiz durduruldu."}</em>`;
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
            showToast(state.lang === "en" ? "Analysis stopped." : "Analiz durduruldu.");
        } catch (_) {}
    }

    // =========================================================================
    // SEKME 5: DOĞRULAMA VE AYARLAR
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

            await runSimulationUpdate(state.lang === "en" ? "Combustion Chamber" : "Yanma Odası");
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
        if ($("sel-copilot-provider") && ["auto", "physics", "ollama", "antigravity", "gemini", "openrouter"].includes(activeProv)) {
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
            ? (isEn ? "Saved" : "Kayıtlı")
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
            badge.textContent = isEn ? `Ready (${bridgeSt.models.length} Profiles)` : `Hazır (${bridgeSt.models.length} Profil)`;
            badge.style.color = "#6ee7b7";
            sdkLabel.textContent = isEn ? "Local Bridge Active" : "Yerel Köprü Aktif";
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
                ? (isEn ? "Token Mode" : "Anahtar Modu")
                : (isEn ? "Inactive" : "Pasif");
            badge.style.color = keyConfigured ? "#fcd34d" : "#94a3b8";
            sdkLabel.textContent = keyConfigured
                ? (isEn ? "Token Saved" : "Anahtar Kayıtlı")
                : (isEn ? "Optional" : "İsteğe Bağlı");
        }
    }

    function populateOllamaDropdown(ollamaSt, savedModel) {
        const sel = $("cfg-ollama-model");
        const badge = $("ollama-online-badge");
        const isEn = state.lang === "en";
        sel.innerHTML = `<option value="auto">${isEn ? "Auto (Recommended Local Model)" : "Otomatik (Önerilen Yerel Model)"}</option>`;

        if (ollamaSt && ollamaSt.online) {
            badge.textContent = isEn ? `Online (${ollamaSt.models.length})` : `Aktif (${ollamaSt.models.length})`;
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
            badge.textContent = isEn ? "Service Offline" : "Servis Kapalı";
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

        if (pref === "physics" || pref === "deterministic") {
            dot.style.background = "#10b981";
            txt.textContent = isEn ? "Solver: Analytical Physics" : "Çözücü: Analitik Fizik";
        } else if (pref === "ollama" && providers.ollama && providers.ollama.online) {
            dot.style.background = "#38bdf8";
            txt.textContent = isEn ? "Solver: Analytical + Local" : "Çözücü: Analitik + Yerel";
        } else if (pref === "antigravity" && providers.antigravity_ready) {
            dot.style.background = "#10b981";
            txt.textContent = isEn ? "Solver: Analytical + Bridge" : "Çözücü: Analitik + Köprü";
        } else if (providers.gemini_ready) {
            dot.style.background = "#10b981";
            txt.textContent = isEn ? "Solver: Analytical + Gemini" : "Çözücü: Analitik + Gemini";
        } else if (providers.antigravity_ready && pref === "auto") {
            dot.style.background = "#10b981";
            txt.textContent = isEn ? "Solver: Analytical + Hybrid" : "Çözücü: Analitik + Hibrit";
        } else if (providers.ollama && providers.ollama.online) {
            dot.style.background = "#38bdf8";
            txt.textContent = isEn ? "Solver: Analytical + Local" : "Çözücü: Analitik + Yerel";
        } else if (providers.openrouter_ready) {
            dot.style.background = "#10b981";
            txt.textContent = isEn ? "Solver: Analytical + OpenRouter" : "Çözücü: Analitik + OpenRouter";
        } else if (window.ALTAR_SERVERLESS_MODE) {
            dot.style.background = "#38bdf8";
            txt.textContent = isEn ? "Solver: Browser Physics" : "Çözücü: Tarayıcı Motoru";
        } else {
            dot.style.background = "#10b981";
            txt.textContent = isEn ? "Solver: Analytical Physics" : "Çözücü: Analitik Fizik";
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
                    ? "Solver and connection settings saved."
                    : "Çözücü ve bağlantı ayarları kaydedildi."
            );
        }
    }

    // =========================================================================
    // VERİ SETİ İNDİRME (CSV & JSON) VE BİLİMSEL GÖREV RAPORU
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
                ? "Predictive CSV dataset downloaded."
                : "Öngörücü CSV veri seti indirildi."
        );
    }

    function exportPredictiveJSON() {
        const sim = state.currentSim;
        if (!sim) return;
        const isEn = state.lang === "en";
        const payload = {
            platform: "ALTAR-NASA Flame in Freefall v5.1",
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
                ? "Predictive JSON bundle downloaded."
                : "Öngörücü JSON veri paketi indirildi."
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
                    `- **#${e.rank} ${e.program} (${e.exp_id} • ${e.hardware_group})** — ${isEn ? "Match Score" : "Uyum Skoru"}: \`${e.priority_score}/100\` | MOC: \`${e.moc_measured_pct}%\` | [NTRS #${e.ntrs_id}](${e.ntrs_url})\n  - *${isEn ? e.sample_geometry_en : e.sample_geometry_tr}*\n  - ${isEn ? e.key_finding_en : e.key_finding_tr}`
            )
            .join("\n");

        const lastAssistant = [...state.chatHistory].reverse().find((m) => m.role === "assistant");

        const mdLines = isEn
            ? [
                  `# ALTAR-NASA • Flame in Freefall (v5.1) — Scientific Mission Report`,
                  `- **Generated:** ${nowStr} UTC`,
                  `- **Data Source:** ${state.activeSourceLabel}`,
                  `- **ISS Flight Telemetry Validation:** \`R² = ${fv.r_squared ?? 0.996}\` • \`RMSE = ${fv.rmse ?? 0.015}\` (${fv.campaign || "NASA GRC PSI"})`,
                  ``,
                  `## 1. Cabin / Spacesuit / Habitat Conditions`,
                  `- **Fuel / Sample / Burner:** ${inp.fuel_name_en} (\`${inp.formula}\`, 3D: \`${inp.geometry_3d}\`)`,
                  `- **Atmosphere:** Gravity \`${inp.gravity_g} G\` | Oxygen \`${inp.oxygen_pct}% O₂\` | Pressure \`${inp.pressure_psia} psia\` (\`${inp.pressure_kpa} kPa\`) | Partial \`P_O2 = ${tel.o2_partial_psia} psia\``,
                  `- **Ventilation & Scale:** Airflow \`${inp.airflow_cms} cm/s\` | Characteristic Diameter \`D₀ = ${inp.droplet_d0_mm} mm\` | Diluent \`${inp.diluent}\``,
                  ``,
                  `## 2. Live Measurements & Life Support Clock`,
                  `- **Active Regime:** **${call.badge_en}** (\`${tel.regime}\`)`,
                  `- **Fire Risk Score:** **${tel.risk_score} / 100**`,
                  `- **Flame Temperature:** \`${tel.flame_temp_k} K\` (\`${tel.flame_temp_c} °C\`) | **Critical MOC:** \`${tel.moc_pct}% O₂\``,
                  `- **Burn Constant (K):** \`${tel.burning_rate_k_mm2_s} mm²/s\` | **Flame Spread:** \`${tel.flame_spread_mm_s} mm/s\` | **Heat Flux:** \`${tel.heat_flux_kw_m2} kW/m²\` | **CO:** \`${tel.co_ppm} ppm\``,
                  tl.habitat_name_en
                      ? `- **Life Support Clock (${tl.habitat_name_en}):** Alarm \`+${tl.t_alarm_s} s\` | SMAC 125 ppm CO \`${tl.t_smac_125ppm_s} s\` | CO at Response \`${tl.co_at_response_ppm} ppm\` | Peak ΔT \`+${tl.peak_temp_rise_c} °C\``
                      : ``,
                  pg.show_banner ? `\n> ${pg.en}\n` : ``,
                  `## 3. Governing Equations & Dimensionless Numbers`,
                  `| Physical Law | Equation | Live Value | Status |`,
                  `| :--- | :--- | :--- | :--- |`,
                  eqRows,
                  ``,
                  `## 4. Ranked NASA PSI Experiments`,
                  expRows || "- Ranking table ready.",
                  lastAssistant ? `\n## 5. Engineering Analysis Output\n\n${lastAssistant.content}\n` : ``,
              ]
            : [
                  `# ALTAR-NASA • Flame in Freefall (v5.1) — Bilimsel Görev ve Yangın Güvenliği Raporu`,
                  `- **Oluşturulma Zamanı:** ${nowStr}`,
                  `- **Aktif Veri Kaynağı:** ${state.activeSourceLabel}`,
                  `- **ISS Uçuş Telemetrisi Doğrulaması:** \`R² = ${fv.r_squared ?? 0.996}\` • \`RMSE = ${fv.rmse ?? 0.015}\` (${fv.campaign || "NASA GRC PSI"})`,
                  ``,
                  `## 1. Kabin, Uzay Giysisi ve Yüzey Habitatı Koşulları`,
                  `- **Yakıt / Numune / Brülör:** ${inp.fuel_name_tr} (\`${inp.formula}\`, 3B Geometri: \`${inp.geometry_3d}\`)`,
                  `- **Atmosfer:** Yerçekimi \`${inp.gravity_g} G\` | Oksijen \`%${inp.oxygen_pct} O₂\` | Basınç \`${inp.pressure_psia} psia\` (\`${inp.pressure_kpa} kPa\`) | Kısmi Basınç \`P_O2 = ${tel.o2_partial_psia} psia\``,
                  `- **Havalandırma & Ölçek:** Akış Hızı \`${inp.airflow_cms} cm/s\` | Karakteristik Çap \`D₀ = ${inp.droplet_d0_mm} mm\` | Seyreltici Gaz \`${inp.diluent}\``,
                  ``,
                  `## 2. Anlık Ölçümler ve Yaşam Destek Saati`,
                  `- **Aktif Fiziksel Rejim:** **${call.badge_tr}** (\`${tel.regime}\`)`,
                  `- **Yangın Risk Skoru:** **${tel.risk_score} / 100**`,
                  `- **Alev Sıcaklığı:** \`${tel.flame_temp_k} K\` (\`${tel.flame_temp_c} °C\`) | **Kritik MOC Sınırı:** \`%${tel.moc_pct} O₂\``,
                  `- **Yanma Sabiti (K):** \`${tel.burning_rate_k_mm2_s} mm²/s\` | **Yayılma Hızı:** \`${tel.flame_spread_mm_s} mm/s\` | **Isı Akısı:** \`${tel.heat_flux_kw_m2} kW/m²\` | **CO:** \`${tel.co_ppm} ppm\``,
                  tl.habitat_name_tr
                      ? `- **Yaşam Destek Saati (${tl.habitat_name_tr}):** Alarm \`+${tl.t_alarm_s} sn\` | SMAC 125 ppm CO \`${tl.t_smac_125ppm_s} sn\` | Müdahale Anı CO \`${tl.co_at_response_ppm} ppm\` | ΔT \`+${tl.peak_temp_rise_c} °C\``
                      : ``,
                  pg.show_banner ? `\n> ${pg.tr}\n` : ``,
                  `## 3. Fiziksel Denklemler Tablosu`,
                  `| Fiziksel Yasa | Denklem | Sayısal Sonuç | Durum |`,
                  `| :--- | :--- | :--- | :--- |`,
                  eqRows,
                  ``,
                  `## 4. Sıralı NASA PSI Deneyleri`,
                  expRows || "- Sıralama tablosu hazır.",
                  lastAssistant ? `\n## 5. Mühendislik Analizi Çıktısı\n\n${lastAssistant.content}\n` : ``,
              ];

        const blob = new Blob([mdLines.filter((x) => x !== "").join("\n")], { type: "text/markdown;charset=utf-8" });
        const stamp = new Date().toISOString().slice(0, 16).replace(/[:T-]/g, "");
        triggerBlobDownload(blob, `ALTAR_NASA_Mission_Report_v5_1_${stamp}.md`);
        showToast(isEn ? "Scientific Mission Report (.md) downloaded." : "Bilimsel Görev Raporu (.md) indirildi.");
    }

    // =========================================================================
    // 5 ADIMLI REHBERLİ TUR
    // =========================================================================
    const GUIDED_TOUR_STEPS = [
        {
            tab: "tab-lab",
            simParams: { fuel_id: "n_heptane", gravity_g: 0.0, oxygen_pct: 21.0, pressure_psia: 14.7, airflow_cms: 0.2, droplet_d0_mm: 2.8, diluent: "N2", habitat_id: "iss_module", crew_response_s: 30 },
            cam: "front",
            title_tr: "1/5 • 0G Safir-Mavi Küre ve ISS Uçuş Doğrulaması (R²)",
            title_en: "1/5 • 0G Sapphire Sphere & ISS Flight Validation (R²)",
            body_tr: "ISS'te kaldırma kuvveti sıfırlanır (Ra = 0) ve n-Heptan damlacığı etrafında küresel mavi difüzyon alevi oluşur. Grafiklerdeki ISS ölçüm noktaları gerçek NASA GRC FLEX uçuş verileriyle modelimizin R² = 0.996 uyumunu kanıtlar.",
            body_en: "In 0G on the ISS, buoyancy vanishes (Ra = 0), forming a spherical sapphire diffusion flame around the n-Heptane droplet. ISS flight markers overlay real NASA GRC FLEX data with R² = 0.996 accuracy.",
        },
        {
            tab: "tab-lab",
            simParams: { fuel_id: "n_heptane", gravity_g: 0.0, oxygen_pct: 17.5, pressure_psia: 14.7, airflow_cms: 0.1, droplet_d0_mm: 3.6, diluent: "N2", habitat_id: "iss_module", crew_response_s: 30 },
            cam: "macro",
            title_tr: "2/5 • Görünmez İki Aşamalı Soğuk Alev (FLEX Cool Flame • 620 K)",
            title_en: "2/5 • Invisible Two-Stage Cool Flame (FLEX Discovery • 620 K)",
            body_tr: "Isıl kayıp görünür alevi söndürdüğünde yanma durmaz: 550–780 K'de görünmez düşük sıcaklık kimyası devam eder; optik kamera %0 görürken IR radyometre ve CO sensörü toksik sızıntıyı yakalar.",
            body_en: "When radiative heat loss quenches the visible flame, combustion continues invisibly at 550–780 K: optical sensors drop near 0%, while IR and CO sensors catch the hazard.",
        },
        {
            tab: "tab-lab",
            simParams: { fuel_id: "nomex", gravity_g: 0.16, oxygen_pct: 32.0, pressure_psia: 10.2, airflow_cms: 4.8, droplet_d0_mm: 3.2, diluent: "N2", habitat_id: "lunar_rover", crew_response_s: 30 },
            cam: "sensors",
            title_tr: "3/5 • Artemis Ay Gezgini (%32 O₂ / 10.2 psia) ve Yaşam Destek Saati",
            title_en: "3/5 • Artemis Lunar Rover (32% O₂ / 10.2 psia) & Life Support Clock",
            body_tr: "Uzay yürüyüşü ön-soluma süresini kısaltmak için kullanılan %32 O₂ düşük basınç atmosferinde azot ısıl balastı azaldığından MOC düşer ve yangın hızlanır. Alttaki Yaşam Destek Saatinden SMAC 125 ppm CO süresini inceleyin.",
            body_en: "Reduced N₂ thermal ballast in the 10.2 psia / 32% O₂ Exploration Atmosphere lowers MOC and accelerates flame spread. Check the Life Support Clock below for SMAC 125 ppm CO margins.",
        },
        {
            tab: "tab-rank",
            simParams: null,
            cam: null,
            title_tr: "4/5 • 15 NASA PSI Deneyi, Donanım Filtreleri ve Dünya Uygulamaları",
            title_en: "4/5 • 15 NASA PSI Experiments, Hardware Filters & Earth Applications",
            body_tr: "ISS CIR, MSG Fan Kanalı, Cygnus ve Duman/Toz donanımlarını tek tıkla filtreleyin; NTRS atıflı test varyasyonlarını kıyaslayın ve Dünya itfaiye/su sisi uygulamalarını inceleyin.",
            body_en: "Filter ISS CIR, MSG Flow Duct, Cygnus, and Smoke/Dust hardware; compare intra-experiment test variations with NTRS links and explore terrestrial fire-safety applications.",
        },
        {
            tab: "tab-copilot",
            simParams: null,
            cam: null,
            title_tr: "5/5 • Mühendislik Analizi ve Güvenlik Denetimi (NASA-STD-6001B)",
            title_en: "5/5 • Engineering Analysis & Safety Check (NASA-STD-6001B)",
            body_tr: "Derin uzay iletişim gecikmesinde çevrimdışı yerel çözücüyle NASA-STD-6001B (Halon yasağı ve su sisi) kurallarına uygun mühendislik analizi üretir; sağ üstten Rapor, CSV ve JSON veri paketlerini indirebilirsiniz.",
            body_en: "Generates offline engineering decision support verified against NASA-STD-6001B (Halon prohibition and water mist rules); download Report, CSV, and JSON data bundles anytime from the top bar.",
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
                ? (isEn ? "Finish Tour" : "Turu Tamamla")
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
                    ? "Guided Tour completed."
                    : "Rehberli Tur tamamlandı."
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
                        <div class="console-kv-val" data-i18n="kv_solver_val">${escapeHtml(tStr("kv_solver_val"))}</div>
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
        showToast(isEn ? "Analysis log reset." : "Analiz geçmişi sıfırlandı.");
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

        // TR / EN Dil Değiştirme
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
            showToast(state.lang === "en" ? "Language switched to English" : "Arayüz dili Türkçe olarak güncellendi");
        });

        $("btn-export-report").addEventListener("click", exportScientificMissionReport);
        $("btn-export-csv").addEventListener("click", exportPredictiveCSV);
        $("btn-export-json").addEventListener("click", exportPredictiveJSON);
        $("btn-clear-chat").addEventListener("click", clearCopilotChat);

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
            runSimulationUpdate(state.lang === "en" ? "Crew Response Time" : "Mürettebat Müdahale Süresi");
        });
        $("btn-guided-tour").addEventListener("click", startGuidedTour);
        $("btn-tour-next").addEventListener("click", advanceGuidedTour);
        $("btn-tour-close").addEventListener("click", stopGuidedTour);

        ["inp-fuel", "inp-diluent"].forEach((id) => {
            $(id).addEventListener("change", () => runSimulationUpdate());
        });
        ["inp-gravity", "inp-oxygen", "inp-pressure", "inp-airflow", "inp-droplet"].forEach((id) => {
            $(id).addEventListener("input", scheduleSimUpdate);
        });

        $("inp-quick-lab-media").addEventListener("change", (e) => {
            const f = e.target.files && e.target.files[0];
            if (f) ingestMediaFile(f, true, "quick-lab-media-status");
        });

        document.querySelectorAll(".cam-btn[data-cam]").forEach((btn) => {
            btn.addEventListener("click", () => {
                if (state.chamber3D) state.chamber3D.setCameraPreset(btn.dataset.cam);
            });
        });
        $("btn-reignite").addEventListener("click", () => {
            if (state.chamber3D) state.chamber3D.reigniteDroplet();
            showToast(state.lang === "en" ? "Hot-wire igniter triggered." : "Sıcak tel ateşleyici devreye alındı.");
        });

        $("btn-audio-toggle").addEventListener("click", () => {
            const playing = state.sonifier.toggle();
            $("btn-audio-toggle").textContent = playing ? tStr("audio_stop") : tStr("audio_start");
            if (playing && state.currentSim) {
                state.sonifier.updateTelemetry(state.currentSim.telemetry);
            }
        });

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

        document.querySelectorAll(".hw-filter-btn").forEach((btn) => {
            btn.addEventListener("click", () => {
                document.querySelectorAll(".hw-filter-btn").forEach((b) => b.classList.remove("active"));
                btn.classList.add("active");
                state.activeHardwareFilter = btn.dataset.hw || "ALL";
                refreshRankingTable();
            });
        });

        $("btn-run-rank").addEventListener("click", refreshRankingTable);
        $("inp-rank-query").addEventListener("keydown", (e) => {
            if (e.key === "Enter") refreshRankingTable();
        });
        $("btn-compare-selected").addEventListener("click", runComparisonUpdate);

        $("btn-stream-toggle").addEventListener("click", () => {
            configureContinuousStream(!state.streamEnabled, !state.streamEnabled);
        });
        $("btn-stream-poll-now").addEventListener("click", () => {
            configureContinuousStream(state.streamEnabled, true);
            showToast(state.lang === "en" ? "Fetching live NASA data packet..." : "Canlı NASA kaynağından veri paketi çekiliyor...");
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

        $("btn-scrape-url").addEventListener("click", async () => {
            const url = $("inp-scrape-url").value.trim();
            if (!url) return;
            showToast(state.lang === "en" ? "Parsing web link..." : "Web bağlantısı çözümleniyor...");
            try {
                const res = await apiFetch("/api/scrape-url", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ url }),
                });
                const data = await res.json();
                if (data.ok) {
                    state.attachedMediaName = data.title || url;
                    state.attachedMediaSummary = `**Web (${url}):** ${data.title}\n${data.preview || ""}`;
                    if ($("chk-media-autosync").checked && data.extracted_sim_params) {
                        applyParamsToSliders(data.extracted_sim_params);
                        if (data.simulation) {
                            applySimulationStateEverywhere(data.simulation, `Web (${(data.title || url).slice(0, 35)})`);
                        }
                    }
                    showToast(`'${data.title}' (${data.chunks} chunks) synced.`);
                } else {
                    showToast(`${data.error || "Failed"}`);
                }
            } catch (err) {
                showToast(`${err.message}`);
            }
        });

        $("btn-upload-doc").addEventListener("click", () => {
            const fileInput = $("inp-doc-file");
            if (!fileInput.files || !fileInput.files[0]) {
                showToast(
                    state.lang === "en"
                        ? "Please select a flame photo (.png/.jpg) or data file (.csv/.pdf/.json/.txt) first."
                        : "Lütfen önce bir alev fotoğrafı (.png/.jpg) veya veri dosyası (.csv/.pdf/.json/.txt) seçin."
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

        $("btn-save-config").addEventListener("click", () => saveAllSettings(false));
        $("btn-save-directives").addEventListener("click", () => saveAllSettings(false));
        $("btn-refresh-ollama").addEventListener("click", async () => {
            showToast(state.lang === "en" ? "Checking local model and system bridge..." : "Yerel model ve sistem köprüsü kontrol ediliyor...");
            const [resOll, resAgy] = await Promise.all([
                apiFetch("/api/ollama/status"),
                apiFetch("/api/antigravity/status"),
            ]);
            const stOll = await resOll.json();
            const stAgy = await resAgy.json();
            populateOllamaDropdown(stOll, $("cfg-ollama-model").value);
            populateLocalBridgeDropdown(stAgy, $("cfg-agy-model").value, false);
            showToast(
                `Local Model: ${stOll.online ? "Online" : "Offline"} | System Bridge: ${stAgy.cli_ready ? "Ready" : "Inactive"}`
            );
        });

        $("btn-test-provider").addEventListener("click", async () => {
            const out = $("provider-test-output");
            const prov = $("cfg-active-provider").value;
            out.style.color = "#93c5fd";
            out.textContent = state.lang === "en"
                ? `Testing '${formatKernelDisplayName(prov)}'...`
                : `'${formatKernelDisplayName(prov)}' doğrulanıyor...`;
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
                    out.innerHTML = `<strong>${escapeHtml(formatKernelDisplayName(d.provider))} (${escapeHtml(d.model)})</strong> — ${d.latency_s} s:<br/><em>"${escapeHtml(d.sample)}"</em>`;
                } else {
                    out.style.color = "#fca5a5";
                    out.textContent = `${d.error || d.note || "Failed"}`;
                }
            } catch (err) {
                out.style.color = "#fca5a5";
                out.textContent = `${err.message}`;
            }
        });

        $("btn-ollama-pull").addEventListener("click", async () => {
            const m = $("inp-ollama-pull").value.trim();
            if (!m) return;
            showToast(`Downloading '${m}'...`);
            const res = await apiFetch("/api/ollama/pull", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ model: m }),
            });
            const data = await res.json();
            showToast(data.ok ? `'${m}' ready.` : `${data.error}`);
            if (data.ok) $("btn-refresh-ollama").click();
        });

        $("btn-ollama-unload").addEventListener("click", async () => {
            const res = await apiFetch("/api/ollama/unload", { method: "POST" });
            const d = await res.json();
            showToast(`${d.unloaded || 0} models cleared from memory.`);
        });

        window.addEventListener("resize", () => {
            redrawActiveLabCharts();
        });

        renderAudienceBanner();
        loadSystemBootstrap();
    });
})();
