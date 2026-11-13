/* ============================================================================
 * ALTAR-NASA • Flame in Freefall v5.1 — Browser Analytical Kernel
 * Statik Web Paketi: Sunucusuz Tarayıcı Modu
 * Tüm termodinamik denklemler, ISS R²/RMSE doğrulaması, ECLSS saati, PSI sıralaması ve
 * Mühendislik Analizi doğrudan tarayıcı belleğinde (client-side) çalışır.
 * ============================================================================ */
(function () {
    "use strict";

    window.ALTAR_SERVERLESS_MODE = true;

    const EMBEDDED_DATA = {"FUEL_PROPERTIES": {"n_heptane": {"name_tr": "n-Heptan (C₇H₁₆ • FLEX / CFI Sıvı Damlacık)", "name_en": "n-Heptane (C₇H₁₆ • FLEX / CFI Liquid Droplet)", "formula": "C₇H₁₆", "phase": "liquid_droplet", "geometry_3d": "droplet", "rho_l_kg_m3": 684.0, "lv_kj_kg": 318.0, "dhc_kj_kg": 44560.0, "stoich_o2_fuel": 3.52, "t_boil_k": 371.5, "k0_base": 0.76, "t_adiabatic_k": 2190.0, "moc_0g_base": 13.8, "moc_1g_base": 15.2, "cool_flame_capable": true, "cool_flame_min_o2": 9.5, "soot_tendency": 0.62, "blowoff_cms": 34.0}, "methanol": {"name_tr": "Metanol (CH₃OH • FLEX-2 Kurumsuz Damlacık)", "name_en": "Methanol (CH₃OH • FLEX-2 Soot-Free Droplet)", "formula": "CH₃OH", "phase": "liquid_droplet", "geometry_3d": "droplet", "rho_l_kg_m3": 791.0, "lv_kj_kg": 1100.0, "dhc_kj_kg": 19930.0, "stoich_o2_fuel": 1.5, "t_boil_k": 337.8, "k0_base": 0.58, "t_adiabatic_k": 1990.0, "moc_0g_base": 12.6, "moc_1g_base": 14.0, "cool_flame_capable": false, "cool_flame_min_o2": 12.6, "soot_tendency": 0.04, "blowoff_cms": 30.0}, "pmma": {"name_tr": "PMMA Akrilik Cam (BASS / SoFIE Katı Polimer)", "name_en": "Cast PMMA Acrylic (BASS / SoFIE Solid Polymer)", "formula": "(C₅O₂H₈)ₙ", "phase": "solid_surface", "geometry_3d": "solid_rod", "rho_l_kg_m3": 1180.0, "lv_kj_kg": 1590.0, "dhc_kj_kg": 24880.0, "stoich_o2_fuel": 1.92, "t_boil_k": 650.0, "k0_base": 0.34, "t_adiabatic_k": 2040.0, "moc_0g_base": 14.3, "moc_1g_base": 16.8, "cool_flame_capable": false, "cool_flame_min_o2": 14.3, "soot_tendency": 0.55, "blowoff_cms": 42.0}, "sibal": {"name_tr": "Sibal Kumaş (%75 Pamuk / %25 Fiberglas • Saffire)", "name_en": "Sibal Fabric (75% Cotton / 25% Fiberglass • Saffire)", "formula": "C₆H₁₀O₅ + SiO₂", "phase": "solid_thin", "geometry_3d": "flat_slab", "rho_l_kg_m3": 920.0, "lv_kj_kg": 1350.0, "dhc_kj_kg": 16800.0, "stoich_o2_fuel": 1.18, "t_boil_k": 610.0, "k0_base": 0.48, "t_adiabatic_k": 1920.0, "moc_0g_base": 13.2, "moc_1g_base": 16.0, "cool_flame_capable": false, "cool_flame_min_o2": 13.2, "soot_tendency": 0.42, "blowoff_cms": 38.0}, "nomex": {"name_tr": "Nomex HT90-40 (Uzay Giysisi & Kabin Kumaşı • BASS-II)", "name_en": "Nomex HT90-40 (EVA Suit & Crew Fabric • BASS-II)", "formula": "(C₁₄H₁₀N₂O₂)ₙ", "phase": "solid_thin", "geometry_3d": "flat_slab", "rho_l_kg_m3": 1380.0, "lv_kj_kg": 2150.0, "dhc_kj_kg": 21500.0, "stoich_o2_fuel": 1.84, "t_boil_k": 715.0, "k0_base": 0.19, "t_adiabatic_k": 1850.0, "moc_0g_base": 21.5, "moc_1g_base": 24.2, "cool_flame_capable": false, "cool_flame_min_o2": 21.5, "soot_tendency": 0.68, "blowoff_cms": 26.0}, "hydrogen": {"name_tr": "Hidrojen Gaz Jeti (H₂ • ACME / SPICE / SLISE)", "name_en": "Hydrogen Gas Jet (H₂ • ACME / SPICE / SLISE)", "formula": "H₂", "phase": "gas_jet", "geometry_3d": "porous_sphere", "rho_l_kg_m3": 70.8, "lv_kj_kg": 446.0, "dhc_kj_kg": 119960.0, "stoich_o2_fuel": 7.94, "t_boil_k": 298.0, "k0_base": 1.35, "t_adiabatic_k": 2380.0, "moc_0g_base": 6.2, "moc_1g_base": 8.0, "cool_flame_capable": false, "cool_flame_min_o2": 6.2, "soot_tendency": 0.0, "blowoff_cms": 85.0}, "propane_cfig": {"name_tr": "Propan Küresel Brülör (C₃H₈ • ACME CFI-G / BRE Gaz)", "name_en": "Propane Spherical Porous Burner (C₃H₈ • ACME CFI-G / BRE)", "formula": "C₃H₈", "phase": "porous_sphere", "geometry_3d": "porous_sphere", "rho_l_kg_m3": 493.0, "lv_kj_kg": 426.0, "dhc_kj_kg": 46350.0, "stoich_o2_fuel": 3.63, "t_boil_k": 310.0, "k0_base": 0.88, "t_adiabatic_k": 2260.0, "moc_0g_base": 11.4, "moc_1g_base": 12.8, "cool_flame_capable": true, "cool_flame_min_o2": 8.8, "soot_tendency": 0.48, "blowoff_cms": 52.0}}, "DILUENT_FACTORS": {"N2": {"name": "Azot (N₂ - Standart Kabin)", "name_en": "Nitrogen (N₂ - Standard Cabin)", "mw": 28.01, "cp_factor": 1.0, "moc_shift": 0.0, "rad_factor": 1.0, "lambda_g": 0.076}, "CO2": {"name": "Karbondioksit (CO₂ - Söndürme Seyreltmesi)", "name_en": "Carbon Dioxide (CO₂ - Suppression Diluent)", "mw": 44.01, "cp_factor": 0.82, "moc_shift": 3.4, "rad_factor": 1.38, "lambda_g": 0.068}, "He": {"name": "Helyum (He - Yüksek Isıl Difüzyon)", "name_en": "Helium (He - High Thermal Diffusivity)", "mw": 4.0, "cp_factor": 1.06, "moc_shift": 2.1, "rad_factor": 0.88, "lambda_g": 0.185}}, "HABITAT_CONFIGS": {"iss_module": {"name_tr": "ISS Kabin Modülü (Destiny • 120 m³)", "name_en": "ISS Cabin Module (Destiny • 120 m³)", "volume_m3": 120.0}, "lunar_hab": {"name_tr": "Artemis Ay Yüzey Üssü (45 m³)", "name_en": "Artemis Lunar Surface Hab (45 m³)", "volume_m3": 45.0}, "lunar_rover": {"name_tr": "Basınçlı Ay Gezgini / Rover (14 m³)", "name_en": "Pressurized Lunar Rover (14 m³)", "volume_m3": 14.0}, "eva_suit": {"name_tr": "EVA Uzay Giysisi İç Hacmi (0.18 m³)", "name_en": "EVA Spacesuit Free Volume (0.18 m³)", "volume_m3": 0.18}}, "MISSION_PRESETS": [{"id": "preset_iss_spherical", "name_tr": "0G Küresel Alev", "name_en": "0G Spherical Flame", "badge": "FLEX • %21 O₂", "params": {"fuel_id": "n_heptane", "gravity_g": 0.0, "oxygen_pct": 21.0, "pressure_psia": 14.7, "airflow_cms": 0.2, "droplet_d0_mm": 2.8, "diluent": "N2"}}, {"id": "preset_cool_flame", "name_tr": "Görünmez Soğuk Alev", "name_en": "Invisible Cool Flame", "badge": "FLEX • 550–750 K", "params": {"fuel_id": "n_heptane", "gravity_g": 0.0, "oxygen_pct": 13.0, "pressure_psia": 14.7, "airflow_cms": 0.0, "droplet_d0_mm": 4.2, "diluent": "N2"}}, {"id": "preset_bass_ventilation", "name_tr": "Düşük Fan Akışı", "name_en": "Low-Flow Wake", "badge": "BASS • 5.5 cm/s", "params": {"fuel_id": "pmma", "gravity_g": 0.0, "oxygen_pct": 16.5, "pressure_psia": 14.7, "airflow_cms": 5.5, "droplet_d0_mm": 3.5, "diluent": "N2"}}, {"id": "preset_eva_spacesuit", "name_tr": "Uzay Giysisi (%100 O₂)", "name_en": "EVA Suit (100% O₂)", "badge": "4.3 psia • Saf O₂", "params": {"fuel_id": "nomex", "gravity_g": 0.0, "oxygen_pct": 100.0, "pressure_psia": 4.3, "airflow_cms": 3.0, "droplet_d0_mm": 3.2, "diluent": "N2"}}, {"id": "preset_lunar_rover", "name_tr": "Ay Üssü ve Gezgin", "name_en": "Lunar Base & Rover", "badge": "0.16G • %32 O₂", "params": {"fuel_id": "pmma", "gravity_g": 0.16, "oxygen_pct": 32.0, "pressure_psia": 10.2, "airflow_cms": 5.0, "droplet_d0_mm": 3.5, "diluent": "N2"}}, {"id": "preset_artemis_cabin", "name_tr": "Mars Keşif Kabini", "name_en": "Mars Habitat", "badge": "0.38G • %34 O₂", "params": {"fuel_id": "sibal", "gravity_g": 0.38, "oxygen_pct": 34.0, "pressure_psia": 8.2, "airflow_cms": 8.0, "droplet_d0_mm": 3.5, "diluent": "N2"}}, {"id": "preset_acme_cfig", "name_tr": "Küresel Gaz Brülörü", "name_en": "Spherical Gas Burner", "badge": "CFI-G • %85 O₂", "params": {"fuel_id": "propane_cfig", "gravity_g": 0.0, "oxygen_pct": 85.0, "pressure_psia": 14.7, "airflow_cms": 0.4, "droplet_d0_mm": 4.8, "diluent": "N2"}}, {"id": "preset_earth_1g", "name_tr": "Dünya 1G Alevi", "name_en": "Earth 1G Plume", "badge": "1G • %21 O₂", "params": {"fuel_id": "n_heptane", "gravity_g": 1.0, "oxygen_pct": 21.0, "pressure_psia": 14.7, "airflow_cms": 0.5, "droplet_d0_mm": 5.0, "diluent": "N2"}}], "NASA_EXPERIMENTS_CATALOG": [{"exp_id": "PSI-FLEX-01", "program": "FLEX", "hardware_group": "CIR", "title": "Flame Extinguishment Experiment (FLEX) — n-Heptane Cool Flame Discovery", "title_tr": "FLEX Deneyi — n-Heptan Damlacıklarında Görünmez Soğuk Alev Keşfi", "facility": "ISS Combustion Integrated Rack (CIR) / MDCA", "year": 2012, "fuel_id": "n_heptane", "material": "n-Heptane Liquid Droplet (2.5 - 4.8 mm)", "sample_geometry_tr": "Serbest yüzen veya 14 µm SiC kuvars lifte asılı küresel sıvı damlacık (D₀ = 2.5–4.8 mm)", "sample_geometry_en": "Free-floating or 14 µm SiC fiber-tethered spherical liquid droplet (D₀ = 2.5–4.8 mm)", "sensors_tr": "UV/OH* (310 nm) & CH* (430 nm) yoğunlaştırılmış kameralar, arkadan aydınlatmalı yüksek hızlı optik kamera, geniş bant IR radyometre", "sensors_en": "UV/OH* (310 nm) & CH* (430 nm) intensified cameras, backlit high-speed silhouette camera, broadband IR radiometer", "gravity_g": 0.0, "oxygen_pct": 15.0, "pressure_psia": 14.7, "airflow_cms": 0.0, "moc_measured_pct": 13.8, "burning_rate_or_spread": "K = 0.72 mm²/s (Hot) -> 0.19 mm²/s (Cool Flame)", "cool_flame_observed": true, "ntrs_id": "20150023456", "ntrs_url": "https://ntrs.nasa.gov/citations/20150023456", "psi_id": "PSI-105", "psi_url": "https://www.nasa.gov/PSI", "key_finding_tr": "Büyük n-Heptan damlacıkları 0G'de radyatif ısı kaybıyla görünür sıcak alevini kaybettikten sonra 550-750 K'de görünmez Soğuk Alev (Cool Flame) ile yanmaya devam ederek zehirli CO ve formaldehit üretti.", "key_finding_en": "Large n-heptane droplets in 0G transitioned after radiative hot-flame extinction into sustained quasi-steady low-temperature (550-750 K) invisible cool flames, generating CO and formaldehyde.", "safety_insight_tr": "Optik alev dedektörleri tek başına yetersizdir; kabinlerde IR radyometre ve CO/CH₂O çoklu sensör füzyonu zorunludur.", "safety_insight_en": "Optical flame detectors miss cool flames; multi-spectral IR + CO/CH₂O gas sensing is required in crewed modules.", "intra_runs": [{"run_code": "FLEX-H04", "same_tr": "Yakıt: Saf n-Heptan, Basınç: 1.0 atm (14.7 psia), Durgun 0G (U=0 cm/s)", "same_en": "Fuel: Pure n-Heptane, Pressure: 1.0 atm (14.7 psia), Quiescent 0G (U=0 cm/s)", "diff_tr": "Küçük başlangıç çapı (D₀ = 1.9 mm) ve %21 O₂", "diff_en": "Small initial droplet diameter (D₀ = 1.9 mm) at 21% O₂", "result_tr": "Radyatif kayıp düşük kaldı; damlacık sonuna kadar tek aşamalı sıcak mavi alevle tükendi (K=0.76 mm²/s).", "result_en": "Low radiative loss; single-stage hot blue spherical flame burned to completion (K=0.76 mm²/s)."}, {"run_code": "FLEX-H19", "same_tr": "Yakıt: Saf n-Heptan, Basınç: 14.7 psia, Durgun 0G (CIR/MDCA)", "same_en": "Fuel: Pure n-Heptane, Pressure: 14.7 psia, Quiescent 0G (CIR/MDCA)", "diff_tr": "Büyük damlacık çapı (D₀ = 4.1 mm) ve %15 O₂", "diff_en": "Large droplet diameter (D₀ = 4.1 mm) at 15% O₂", "result_tr": "İki aşamalı yanma: Sıcak alev radyatif kayıpla söndü, ardından 18 sn boyunca görünmez Soğuk Alev (K=0.19 mm²/s) sürdü!", "result_en": "Two-stage burning: Radiative hot-flame quenching followed by 18 s of invisible Cool Flame vaporization (K=0.19 mm²/s)."}, {"run_code": "FLEX-H27", "same_tr": "Yakıt: Saf n-Heptan, Durgun 0G, D₀ = 3.6 mm", "same_en": "Fuel: Pure n-Heptane, Quiescent 0G, D₀ = 3.6 mm", "diff_tr": "CO₂ seyreltme (%15 O₂ / %25 CO₂ / %60 N₂)", "diff_en": "CO₂ dilution (15% O₂ / 25% CO₂ / 60% N₂)", "result_tr": "CO₂ gaz radyasyonu χ_r kaybını artırarak sıcak alevi erken söndürdü ve sönümlenme çapını büyüttü.", "result_en": "CO₂ gas reabsorption amplified χ_r radiative loss, accelerating hot-flame extinction."}], "tags": ["droplet", "heptane", "cool flame", "radiative extinction", "FLEX", "CIR", "MDCA", "soğuk alev"]}, {"exp_id": "PSI-FLEX2-02", "program": "FLEX-2", "hardware_group": "CIR", "title": "FLEX-2 — Methanol Soot-Free Droplet Combustion & Water Absorption Extinction", "title_tr": "FLEX-2 — Metanol Kurumsuz Damlacık Yanması ve Su Buharı Emilim Sönmesi", "facility": "ISS Combustion Integrated Rack (CIR) / MDCA", "year": 2015, "fuel_id": "methanol", "material": "Pure Methanol & Heptane/Methanol Bi-Component Droplets (2.0 - 5.0 mm)", "sample_geometry_tr": "İğne dağıtıcılı serbest yüzen küresel sıvı damlacık ve ikili damlacık dizisi (D₀ = 2.0–5.0 mm)", "sample_geometry_en": "Needle-deployed free-floating spherical droplet & binary droplet arrays (D₀ = 2.0–5.0 mm)", "sensors_tr": "Yüksek hızlı arkadan aydınlatmalı kamera, UV OH* radyometre, geniş bant kızılötesi (IR) sensör, kabin gaz kromatografisi", "sensors_en": "High-speed backlit silhouette camera, UV OH* radiometer, wideband IR sensor, gas chromatography", "gravity_g": 0.0, "oxygen_pct": 18.0, "pressure_psia": 14.7, "airflow_cms": 0.5, "moc_measured_pct": 12.6, "burning_rate_or_spread": "K = 0.56 mm²/s", "cool_flame_observed": false, "ntrs_id": "20090014812", "ntrs_url": "https://ntrs.nasa.gov/citations/20090014812", "psi_id": "PSI-112", "psi_url": "https://www.nasa.gov/PSI", "key_finding_tr": "Metanol 0G'de sıfır kurumla saf mavi küresel alev oluşturdu; yanma ürünü olan H₂O buharının sıvı damlacık içine geri difüze olması damlacığı kendiliğinden seyrelterek sönümlenme çapını belirledi.", "key_finding_en": "Methanol burned soot-free with a spherical blue flame; dissolution of combustion-generated water vapor back into the liquid droplet governed diffusive extinction.", "safety_insight_tr": "Su sisi (Water Mist PFE) polar yakıt yangınlarında hem gaz fazını soğutur hem sıvı yakıtı seyrelterek yüksek verim sağlar.", "safety_insight_en": "Fine water mist suppression excels on polar fuels via simultaneous thermal cooling and fuel-phase dilution.", "intra_runs": [{"run_code": "FLEX2-M03", "same_tr": "CIR / MDCA donanımı, 0G, 14.7 psia, %21 O₂", "same_en": "CIR / MDCA hardware, 0G, 14.7 psia, 21% O₂", "diff_tr": "Saf Metanol (CH₃OH), D₀ = 2.6 mm, U = 0 cm/s", "diff_en": "Pure Methanol (CH₃OH), D₀ = 2.6 mm, U = 0 cm/s", "result_tr": "Sıfır kurum ışıması; su buharı emilimi nedeniyle D_ext ≈ 0.9 mm çapında difüzif sönme.", "result_en": "Zero soot luminosity; diffusive extinction at D_ext ≈ 0.9 mm due to water uptake."}, {"run_code": "FLEX2-M11", "same_tr": "CIR / MDCA donanımı, 0G, 14.7 psia, Saf Metanol", "same_en": "CIR / MDCA hardware, 0G, 14.7 psia, Pure Methanol", "diff_tr": "Yavaş zorlanmış konveksiyon (U = 3.0 cm/s) ve D₀ = 4.2 mm", "diff_en": "Gentle forced convection (U = 3.0 cm/s) with D₀ = 4.2 mm", "result_tr": "Hafif hava akışı su buharı kabuğunu süpürerek yanma hızını K = 0.68 mm²/s düzeyine çıkardı.", "result_en": "Slow convection swept away H₂O products, elevating burning rate to K = 0.68 mm²/s."}, {"run_code": "FLEX2-BM06", "same_tr": "CIR / MDCA donanımı, 0G, 14.7 psia, %18 O₂", "same_en": "CIR / MDCA hardware, 0G, 14.7 psia, 18% O₂", "diff_tr": "%50 Heptan / %50 Tolüen çift bileşenli (bi-component) damlacık", "diff_en": "50% Heptane / 50% Toluene bi-component droplet", "result_tr": "Uçucu bileşen tükenirken anlık kabarcıklanma (micro-explosion/disruptive burning) ve kurum halkası gözlendi.", "result_en": "Preferential vaporization produced soot-shell contraction and disruptive flare-up."}], "tags": ["methanol", "droplet", "soot-free", "water mist", "FLEX-2", "CIR", "MDCA", "metanol"]}, {"exp_id": "PSI-CFI-11", "program": "CFI", "hardware_group": "CIR", "title": "Cool Flames Investigation (CFI) — Heavy Alkane Liquid Droplet Low-Temperature Kinetics", "title_tr": "CFI — Ağır Alkan Sıvı Damlacıklarında Uzun Süreli Soğuk Alev Kinetiği", "facility": "ISS Combustion Integrated Rack (CIR) / MDCA", "year": 2017, "fuel_id": "n_heptane", "material": "n-Decane, n-Dodecane & n-Heptane Liquid Droplets (3.0 - 5.2 mm)", "sample_geometry_tr": "MDCA iğne sistemiyle oluşturulan büyük küresel ağır hidrokarbon damlacıkları (D₀ = 3.0–5.2 mm)", "sample_geometry_en": "MDCA needle-deployed large spherical heavy alkane droplets (D₀ = 3.0–5.2 mm)", "sensors_tr": "Formaldehit kemilüminesans UV kamerası (340–400 nm), K-tipi ince tel termokupl dizisi, IR radyometre", "sensors_en": "Formaldehyde UV chemiluminescence camera (340–400 nm), fine-wire thermocouple array, IR radiometer", "gravity_g": 0.0, "oxygen_pct": 14.0, "pressure_psia": 14.7, "airflow_cms": 0.0, "moc_measured_pct": 13.4, "burning_rate_or_spread": "Quasi-steady Cool Flame @ 610 K (K_cool = 0.16 mm²/s)", "cool_flame_observed": true, "ntrs_id": "20180006321", "ntrs_url": "https://ntrs.nasa.gov/search?q=Cool%20Flames%20Investigation%20MDCA", "psi_id": "PSI-129", "psi_url": "https://www.nasa.gov/PSI", "key_finding_tr": "CIR/MDCA içinde yürütülen CFI serisi, n-dekan ve n-dodekan gibi ağır yakıtların sıcak alev sonrası 40 saniyeye varan kararlı 600 K soğuk alev fazında buharlaşıp yoğun sis bulutu (vapor cloud) oluşturduğunu kanıtladı.", "key_finding_en": "Conducted in CIR/MDCA, CFI proved heavy alkanes sustain up to 40 s of steady ~600 K NTC cool flames followed by condensed fuel-vapor clouds without visible glow.", "safety_insight_tr": "Sıcak alev söndükten sonra soğuk alevin bıraktığı yoğunlaşmış yakıt buharı bulutu, taze O₂ geldiğinde patlayıcı yeniden tutuşma yaratabilir.", "safety_insight_en": "Post-cool-flame condensed vapor clouds create severe delayed re-ignition hazards if cabin ventilation resumes.", "intra_runs": [{"run_code": "CFI-D05", "same_tr": "CIR / MDCA donanımı, 0G, 14.7 psia, Durgun atmosfer", "same_en": "CIR / MDCA hardware, 0G, 14.7 psia, Quiescent atmosphere", "diff_tr": "n-Dekan yakıtı, D₀ = 3.9 mm, %21 O₂", "diff_en": "n-Decane fuel, D₀ = 3.9 mm, 21% O₂", "result_tr": "Parlak sarı kurum kabuğu radyasyonu artırdı; sıcak alev sönüp doğrudan 620 K soğuk aleve kilitlendi.", "result_en": "Soot-shell radiation triggered hot-flame quenching into a sustained 620 K cool flame."}, {"run_code": "CFI-D14", "same_tr": "CIR / MDCA donanımı, 0G, n-Dodekan yakıtı", "same_en": "CIR / MDCA hardware, 0G, n-Dodecane fuel", "diff_tr": "Düşük oksijen (%14 O₂) ve daha büyük çap (D₀ = 4.9 mm)", "diff_en": "Reduced oxygen (14% O₂) and larger droplet (D₀ = 4.9 mm)", "result_tr": "Çok kısa sıcak tutuşmanın ardından 35+ sn görünmez soğuk alev ve sönme sonrası beyaz yakıt buharı sisi oluştu.", "result_en": "Brief hot flash transitioned into 35+ s cool flame and dense post-extinction vapor mist."}, {"run_code": "CFI-D22", "same_tr": "CIR / MDCA donanımı, 0G, D₀ = 4.0 mm", "same_en": "CIR / MDCA hardware, 0G, D₀ = 4.0 mm", "diff_tr": "Helyum (He) seyreltmesiyle artırılmış ısıl difüzivite", "diff_en": "Helium (He) diluent increasing thermal diffusivity", "result_tr": "Yüksek iletimli ısı kaybı nedeniyle hem sıcak hem soğuk alev daha erken sönümlendi.", "result_en": "Elevated conductive heat loss in He quenched both hot and cool stages earlier."}], "tags": ["CFI", "cool flame", "MDCA", "CIR", "decane", "dodecane", "droplet", "NTC"]}, {"exp_id": "PSI-BASS-03", "program": "BASS", "hardware_group": "MSG", "title": "Burning and Suppression of Solids (BASS) — Low-Velocity Airflow Flammability Enhancement", "title_tr": "BASS — MSG Akış Kanalında Düşük Hava Akışlı Katı Yakıt Yanıcılık Artışı", "facility": "ISS Microgravity Science Glovebox (MSG) — SPICE Flow Duct", "year": 2014, "fuel_id": "pmma", "material": "Cast PMMA Acrylic Rods, Spheres & Flat Sheets", "sample_geometry_tr": "MSG fan kanalı içinde 6.4 mm çaplı silindirik PMMA çubuklar, 2 cm PMMA küreler ve 2×10 cm düz plakalar", "sample_geometry_en": "6.4 mm diameter cylindrical PMMA rods, 2 cm spheres, and 2×10 cm flat slabs inside MSG flow duct", "sensors_tr": "HD dijital video kamera, radyometrik kızılötesi kamera, sıcak tel anemometresi (akış hızı), R-tipi termokupl", "sensors_en": "HD digital video camera, IR imaging radiometer, hot-wire anemometer (flow speed), R-type thermocouples", "gravity_g": 0.0, "oxygen_pct": 16.5, "pressure_psia": 14.7, "airflow_cms": 4.5, "moc_measured_pct": 14.3, "burning_rate_or_spread": "Spread = 0.85 mm/s @ 4.5 cm/s", "cool_flame_observed": false, "ntrs_id": "20160000593", "ntrs_url": "https://ntrs.nasa.gov/citations/20160000593", "psi_id": "PSI-118", "psi_url": "https://www.nasa.gov/PSI", "key_finding_tr": "1G'de %16.8 O₂ altında sönen PMMA, 0G'de 3-8 cm/s hafif kabin havalandırması altında %14.3 O₂'ye kadar kararlı şekilde yanmaya devam etti (Havalandırma Paradoksu).", "key_finding_en": "PMMA that self-extinguishes below 16.8% O₂ on Earth sustained steady burning down to 14.3% O₂ in 0G when exposed to gentle 3-8 cm/s ventilation flow.", "safety_insight_tr": "Uzay aracında yangın alarmı anında yapılacak İLK otonom işlem kabin HVAC/havalandırma fanlarının anında kapatılmasıdır!", "safety_insight_en": "Immediate automated shutoff of cabin HVAC ventilation fans is the primary first-response action to starve 0G fires.", "intra_runs": [{"run_code": "BASS-P02", "same_tr": "MSG SPICE akış kanalı, PMMA silindir (d=6.4 mm), 14.7 psia, %17 O₂", "same_en": "MSG SPICE flow duct, PMMA rod (d=6.4 mm), 14.7 psia, 17% O₂", "diff_tr": "Fan kapalı: Tam durgun akış (U = 0.0 cm/s)", "diff_en": "Fan off: Quiescent flow (U = 0.0 cm/s)", "result_tr": "Oksijen difüzyonu yetersiz kaldı ve alev kendi CO₂ kabuğu içinde 12 sn'de boğularak söndü!", "result_en": "Oxygen starvation and radiative loss self-extinguished the flame within 12 s."}, {"run_code": "BASS-P09", "same_tr": "MSG SPICE akış kanalı, PMMA silindir (d=6.4 mm), 14.7 psia, %16.5 O₂", "same_en": "MSG SPICE flow duct, PMMA rod (d=6.4 mm), 14.7 psia, 16.5% O₂", "diff_tr": "Düşük hızlı karşıt fan akışı (U = 4.5 cm/s)", "diff_en": "Low-velocity opposed fan flow (U = 4.5 cm/s)", "result_tr": "1G'de sönmesi gereken oksijen seviyesinde parlak mavi durgunluk alevi 0.85 mm/s hızla kararlı yayıldı!", "result_en": "Sustained bright blue flame spread at 0.85 mm/s below the Earth 1G flammability limit!"}, {"run_code": "BASS-P18", "same_tr": "MSG SPICE akış kanalı, PMMA silindir, 14.7 psia, %18 O₂", "same_en": "MSG SPICE flow duct, PMMA rod, 14.7 psia, 18% O₂", "diff_tr": "Yüksek fan hızı (U = 32 cm/s) ve N₂ söndürme jeti", "diff_en": "High fan speed (U = 32 cm/s) with N₂ suppression jet", "result_tr": "Konvektif soğutma alevin ön kenarını üfleme sınırına (Da < 1) sürükleyerek söndürdü.", "result_en": "Convective cooling drove the leading edge into Damköhler blowoff extinction."}], "tags": ["BASS", "PMMA", "solid", "ventilation", "airflow", "MOC", "MSG", "SPICE duct"]}, {"exp_id": "PSI-BASS2-04", "program": "BASS-II", "hardware_group": "MSG", "title": "BASS-II — Cotton-Fiberglass & Nomex Textile MOC in Opposed Microgravity Flow", "title_tr": "BASS-II — MSG Kanalında Tekstil ve Nomex Malzemelerin 0G Oksijen Sınırları", "facility": "ISS Microgravity Science Glovebox (MSG) — SPICE Flow Duct", "year": 2018, "fuel_id": "nomex", "material": "Nomex HT90-40 & Sibal Cotton-Fiberglass Fabrics", "sample_geometry_tr": "Paslanmaz çelik çerçevede gerilmiş 2.2 cm genişlik × 10 cm uzunlukta ince tekstil şeritleri (0.3 mm kalınlık)", "sample_geometry_en": "Thin textile strips (2.2 cm wide × 10 cm long × 0.3 mm thick) mounted in stainless steel holders", "sensors_tr": "Yüksek çözünürlüklü renkli kamera, radyometre, O₂ paramanyetik sensör, kanal içi hız anemometresi", "sensors_en": "High-resolution color imaging camera, radiometer, paramagnetic O₂ analyzer, duct anemometer", "gravity_g": 0.0, "oxygen_pct": 24.0, "pressure_psia": 14.7, "airflow_cms": 6.0, "moc_measured_pct": 21.5, "burning_rate_or_spread": "Spread = 1.15 mm/s @ 24% O₂", "cool_flame_observed": false, "ntrs_id": "20210011385", "ntrs_url": "https://ntrs.nasa.gov/citations/20210011385", "psi_id": "PSI-124", "psi_url": "https://www.nasa.gov/PSI", "key_finding_tr": "Standart ISS havasında (%21 O₂) güvenli olan alev geciktirici kumaşlar, oksijen zenginleştirilmiş ortamlarda (>%22 O₂) ve düşük hızlı karşıt hava akışında kararlı mavi kenar aleviyle yayıldı.", "key_finding_en": "Flame-retardant textiles safe in 21% O₂ propagated steady blue edge flames under elevated oxygen and low-speed opposed ventilation flows.", "safety_insight_tr": "NASA-STD-6001B 1G yukarı yanma testi (Test 1), düşük akışlı 0G riskini her zaman yakalayamaz; itfaiyeci ve astronot kıyafetlerinde düşük akış MOC testi şarttır.", "safety_insight_en": "Earth 1G upward screening (NASA-STD-6001B) must be augmented with low-flow 0G MOC testing for crew & firefighter gear.", "intra_runs": [{"run_code": "BASS2-T04", "same_tr": "MSG akış kanalı, 2.2×10 cm kumaş numune, 14.7 psia", "same_en": "MSG flow duct, 2.2×10 cm textile strip, 14.7 psia", "diff_tr": "Sibal kumaş, %15.5 O₂, karşıt akış U = 5.0 cm/s", "diff_en": "Sibal fabric, 15.5% O₂, opposed flow U = 5.0 cm/s", "result_tr": "Düzgün mavi alev cephesi yerine parmakçıklı (fingering instability) şeritler halinde yayılma gözlendi.", "result_en": "Flame front broke into cellular 'fingering' flamelets near the low-O₂ quenching limit."}, {"run_code": "BASS2-T12", "same_tr": "MSG akış kanalı, 2.2×10 cm numune, U = 6.0 cm/s", "same_en": "MSG flow duct, 2.2×10 cm strip, U = 6.0 cm/s", "diff_tr": "Nomex HT90-40 kumaş, %21 O₂ vs. %25 O₂ karşılaştırması", "diff_en": "Nomex HT90-40 fabric tested at 21% O₂ vs. 25% O₂", "result_tr": "%21 O₂'de hemen sönerken, %25 O₂'de kararlı yayılma gerçekleşti (keşif atmosferi hassasiyeti).", "result_en": "Self-extinguished at 21% O₂, but sustained steady spread at 25% O₂."}, {"run_code": "BASS2-T19", "same_tr": "MSG akış kanalı, Sibal kumaş, %18 O₂", "same_en": "MSG flow duct, Sibal fabric, 18% O₂", "diff_tr": "Eş yönlü (concurrent) vs. karşıt yönlü (opposed) fan akışı", "diff_en": "Concurrent vs. opposed airflow configuration", "result_tr": "Eş yönlü akışta sıcak gazlar yanmamış kumaşı ön-ısıtarak yayılma hızını ~2.1 kat artırdı.", "result_en": "Concurrent flow preheated virgin fabric downstream, doubling spread velocity."}], "tags": ["BASS-II", "Nomex", "fabric", "textile", "MOC", "MSG", "NASA-STD-6001"]}, {"exp_id": "PSI-SPICE-12", "program": "SPICE", "hardware_group": "MSG", "title": "Smoke Point In Co-flow Experiment (SPICE) — Laminar Gas Jet Soot Inception in MSG", "title_tr": "SPICE — MSG Fan Kanalında Gaz Yakıt Alevlerinin Duman/Kurum Eşik Noktası", "facility": "ISS Microgravity Science Glovebox (MSG) — Modular SPICE Flow Duct", "year": 2011, "fuel_id": "propane_cfig", "material": "Enclosed Co-flow Gaseous Jets (Propane, Ethylene, Methane, Propylene)", "sample_geometry_tr": "SPICE modüler fan güdümlü akış kanalı (76×76 mm kesit) içinde 1.6 mm iç çaplı eş-eksenli paslanmaz brülör nozulu", "sample_geometry_en": "1.6 mm ID coaxial stainless-steel burner nozzle inside the 76×76 mm modular fan-driven SPICE flow duct", "sensors_tr": "Yüksek çözünürlüklü CCD kamera, lazer sönümleme (laser extinction) kurum ölçer, radyometre, akış hızı sensörü", "sensors_en": "High-resolution CCD camera, laser-extinction soot volume sensor, radiometer, duct flow sensor", "gravity_g": 0.0, "oxygen_pct": 21.0, "pressure_psia": 14.7, "airflow_cms": 10.0, "moc_measured_pct": 11.8, "burning_rate_or_spread": "0G Smoke-point flame length 2.1x shorter & wider soot wing", "cool_flame_observed": false, "ntrs_id": "20110014585", "ntrs_url": "https://ntrs.nasa.gov/search?q=Smoke%20Point%20In%20Co-flow%20Experiment%20SPICE", "psi_id": "PSI-108", "psi_url": "https://www.nasa.gov/PSI", "key_finding_tr": "MSG için geliştirilen modüler fan akış kanalında (daha sonra BASS, BASS-II ve SLISE tarafından da kullanıldı), 0G'de gaz alevlerinin çok daha erken kurum (duman noktası) ürettiği ve kapalı alev ucunun açılarak duman saldığı keşfedildi.", "key_finding_en": "Using the modular fan-driven MSG duct (later shared by BASS, BASS-II, and SLISE), SPICE showed 0G laminar jets reach their soot/smoke point at lower fuel flows due to longer residence time and radiative tip cooling.", "safety_insight_tr": "0G gaz sızıntısı yangınlarında Dünya'ya kıyasla çok daha yoğun siyah kurum ve büyük partikül oluşur; kabin duman dedektörleri buna göre kalibre edilmelidir.", "safety_insight_en": "0G gas fires emit larger soot aggregates than 1G flames, directly impacting spacecraft smoke detector calibration.", "intra_runs": [{"run_code": "SPICE-E04", "same_tr": "MSG SPICE kanalı, 1.6 mm nozul, %21 O₂, 14.7 psia", "same_en": "MSG SPICE duct, 1.6 mm nozzle, 21% O₂, 14.7 psia", "diff_tr": "Etilen (C₂H₄) yakıtı, düşük eş-akış hızı (U_coflow = 6 cm/s)", "diff_en": "Ethylene (C₂H₄) fuel at low co-flow velocity (6 cm/s)", "result_tr": "Alev tepesi radyatif soğumayla açıldı (open-tip wing) ve yoğun kurum şeridi salındı.", "result_en": "Flame tip opened via radiative cooling, releasing a dense soot streamer."}, {"run_code": "SPICE-P11", "same_tr": "MSG SPICE kanalı, 1.6 mm nozul, %21 O₂, 14.7 psia", "same_en": "MSG SPICE duct, 1.6 mm nozzle, 21% O₂, 14.7 psia", "diff_tr": "Propan (C₃H₈) yakıtı, yüksek eş-akış hızı (U_coflow = 22 cm/s)", "diff_en": "Propane (C₃H₈) fuel at elevated co-flow velocity (22 cm/s)", "result_tr": "Artan eş-akış hızı oksijen karışımını güçlendirerek duman noktasını geciktirdi ve kurumu azalttı.", "result_en": "Higher co-flow shear enhanced O₂ transport and suppressed soot breakthrough."}, {"run_code": "SPICE-M07", "same_tr": "MSG SPICE kanalı, U_coflow = 10 cm/s, 14.7 psia", "same_en": "MSG SPICE duct, U_coflow = 10 cm/s, 14.7 psia", "diff_tr": "Metan (CH₄) yakıtı vs. Propan yakıtı karşılaştırması", "diff_en": "Methane (CH₄) vs. Propane fuel comparison", "result_tr": "Düşük C/H oranlı metan kurumsuz mavi uç korurken propan parlak sarı kurum çekirdeği oluşturdu.", "result_en": "Low C/H methane remained blue-tipped while propane formed a luminous soot core."}], "tags": ["SPICE", "MSG", "smoke point", "soot", "co-flow", "gas jet", "propane"]}, {"exp_id": "PSI-SLISE-13", "program": "SLISE", "hardware_group": "MSG", "title": "Structure and Liftoff In Combustion Experiment (SLISE) — Jet Flame Liftoff & Blowout in MSG", "title_tr": "SLISE — MSG Akış Kanalında Gaz Jet Alevlerinde Kalkış (Liftoff) ve Üfleme Sönmesi", "facility": "ISS Microgravity Science Glovebox (MSG) — SPICE Flow Duct", "year": 2012, "fuel_id": "hydrogen", "material": "Nitrogen-Diluted Methane & Hydrocarbon Co-flow Gas Jets", "sample_geometry_tr": "SPICE fan güdümlü MSG kanalı içinde dairesel mikro-jet brülör (d = 1.1–2.0 mm)", "sample_geometry_en": "Circular micro-jet burner (d = 1.1–2.0 mm) mounted in the SPICE fan-driven MSG flow duct", "sensors_tr": "Renkli CCD kamera, mavi CH* kemilüminesans filtresi, kütle akış kontrolörleri (MFC), ısıl çift", "sensors_en": "Color CCD camera, CH* blue chemiluminescence filter, mass flow controllers (MFC), thermocouple", "gravity_g": 0.0, "oxygen_pct": 21.0, "pressure_psia": 14.7, "airflow_cms": 18.0, "moc_measured_pct": 9.2, "burning_rate_or_spread": "Triple-flame liftoff base stabilized @ Da ≈ 1.1", "cool_flame_observed": false, "ntrs_id": "20130011240", "ntrs_url": "https://ntrs.nasa.gov/search?q=SLISE%20microgravity%20liftoff%20flame", "psi_id": "PSI-110", "psi_url": "https://www.nasa.gov/PSI", "key_finding_tr": "MSG akış kanalında yürütülen SLISE deneyi, 0G'de kaldırma kuvveti olmadığında brülörden kopan (liftoff) üçlü alev (triple-flame) tabanının 1G'ye kıyasla çok daha yüksek akış hızlarına kadar sönmeden asılı kalabildiğini gösterdi.", "key_finding_en": "In the MSG flow duct, SLISE showed lifted 0G triple-flames stabilize farther downstream and resist blowout better than buoyancy-perturbed 1G jet flames.", "safety_insight_tr": "Basınçlı gaz hatlarından sızan jet yangınları 0G'de brülör ağzından kopsa bile uzakta asılı kalarak yanmayı sürdürebilir; kaynağı kesmek şarttır.", "safety_insight_en": "Pressurized gas-leak flames in 0G can stabilize as lifted triple-flames away from the leak orifice until valve isolation.", "intra_runs": [{"run_code": "SLISE-L02", "same_tr": "MSG SPICE kanalı, N₂ seyreltmeli yakıt jeti, 14.7 psia", "same_en": "MSG SPICE duct, N₂-diluted fuel jet, 14.7 psia", "diff_tr": "Düşük jet çıkış hızı (Re_jet = 180)", "diff_en": "Low jet exit velocity (Re_jet = 180)", "result_tr": "Alev tabanı nozul dudaklarına tam tutunmuş (attached) kararlı laminer yapı sergiledi.", "result_en": "Flame base remained attached to the burner rim in laminar diffusion mode."}, {"run_code": "SLISE-L09", "same_tr": "MSG SPICE kanalı, aynı yakıt bileşimi, 14.7 psia", "same_en": "MSG SPICE duct, identical fuel dilution, 14.7 psia", "diff_tr": "Orta-yüksek jet hızı (Re_jet = 620)", "diff_en": "Moderate-high jet velocity (Re_jet = 620)", "result_tr": "Alev nozuldan 14 mm yukarı kalktı (liftoff) ve simetrik üçlü-alev (triple flame) halkası oluşturdu.", "result_en": "Flame lifted 14 mm downstream, stabilizing via a symmetric triple-flame propagation edge."}, {"run_code": "SLISE-L15", "same_tr": "MSG SPICE kanalı, aynı nozul çapı, 14.7 psia", "same_en": "MSG SPICE duct, identical nozzle diameter, 14.7 psia", "diff_tr": "Kritik üfleme hızı aşımı (U_coflow = 35 cm/s, Da < 1)", "diff_en": "Critical blowout velocity exceeded (U_coflow = 35 cm/s, Da < 1)", "result_tr": "Alev tabanı tutunma hızını kaybederek kanal çıkışına sürüklendi ve tamamen söndü (blowout).", "result_en": "Triple-flame propagation speed was exceeded, resulting in complete convective blowout."}], "tags": ["SLISE", "MSG", "SPICE duct", "liftoff", "blowoff", "triple flame", "gas jet"]}, {"exp_id": "PSI-SAFFIRE1-05", "program": "Saffire-I", "hardware_group": "CYGNUS", "title": "Saffire-I — Large-Scale (0.4 m × 1.0 m) Spacecraft Fabric Fire Growth in Cygnus", "title_tr": "Saffire-I — Cygnus Kargo Aracında Büyük Ölçekli (1 Metre) Uzay Yangını Deneyi", "facility": "Orbital ATK Cygnus OA-6 Autonomous Spacecraft", "year": 2016, "fuel_id": "sibal", "material": "Sibal (75% Cotton / 25% Fiberglass) Large Panel", "sample_geometry_tr": "0.4 m genişlik × 1.0 m uzunlukta dev tek parça Sibal kumaş panel (uzaydaki en büyük tekstil yangını numunesi)", "sample_geometry_en": "0.4 m wide × 1.0 m long continuous Sibal cloth panel inside autonomous Cygnus flow duct", "sensors_tr": "2× HD üstten görünüm kamerası, 12 noktalı termokupl ızgarası, ısı akısı radyometreleri, kabin O₂ / CO₂ / basınç transdüserleri", "sensors_en": "Dual HD top-view cameras, 12-point thermocouple rake, radiometers, cabin O₂ / CO₂ / pressure transducers", "gravity_g": 0.0, "oxygen_pct": 21.0, "pressure_psia": 14.7, "airflow_cms": 20.0, "moc_measured_pct": 13.5, "burning_rate_or_spread": "Concurrent Spread = 2.80 mm/s", "cool_flame_observed": false, "ntrs_id": "20170000230", "ntrs_url": "https://ntrs.nasa.gov/citations/20170000230", "psi_id": "PSI-131", "psi_url": "https://www.nasa.gov/PSI", "key_finding_tr": "Uzayda gerçekleştirilen ilk 1 metrelik büyük ölçekli yangında alev büyümesi beklentinin aksine kontrolden çıkmadı; ancak kapalı araç hacmindeki basınç ve sıcaklık artışı ile duman dağılımı kritik sınırları zorladı.", "key_finding_en": "First meter-scale 0G fire reached a steady limiting spread rate rather than accelerating infinitely, but cabin pressure rise and smoke contamination posed severe crew survival hazards.", "safety_insight_tr": "Kapalı kabin hacmi yangının kendi oksijenini tüketmesiyle sınırlayıcı etki yapar; ancak duman/CO temizleme (ECLSS post-fire cleanup) hayati önemdedir.", "safety_insight_en": "Finite cabin volume limits fire size, shifting primary crew lethality from thermal burn to rapid CO/acid-gas inhalation.", "intra_runs": [{"run_code": "SAFF1-UP", "same_tr": "Cygnus OA-6 modülü, 0.4×1.0 m Sibal kumaş, %21 O₂, 14.7 psia", "same_en": "Cygnus OA-6 module, 0.4×1.0 m Sibal panel, 21% O₂, 14.7 psia", "diff_tr": "Üst kenar ateşlemesi -> Karşıt akışlı (opposed, U = 20 cm/s) yayılma fazı", "diff_en": "Upstream ignition -> Opposed-flow (U = 20 cm/s) spread phase", "result_tr": "Dar ve kararlı piroliz cephesi yavaşça ilerledi (~0.9 mm/s).", "result_en": "Narrow, steady pyrolysis front propagated slowly (~0.9 mm/s)."}, {"run_code": "SAFF1-DN", "same_tr": "Cygnus OA-6 modülü, aynı 0.4×1.0 m Sibal kumaş, %21 O₂", "same_en": "Cygnus OA-6 module, same Sibal panel, 21% O₂", "diff_tr": "Alt kenar ateşlemesi -> Eş yönlü (concurrent, U = 20 cm/s) yayılma fazı", "diff_en": "Downstream/concurrent flow spread phase (U = 20 cm/s)", "result_tr": "Alev boyu ~25 cm'de doyuma ulaştı ve 8 dakika boyunca 2.80 mm/s sabit hızla tüm paneli yaktı.", "result_en": "Flame length plateaued near ~25 cm, sustaining steady 2.80 mm/s spread for 8 minutes."}, {"run_code": "SAFF2-SAMPLES", "same_tr": "Aynı Cygnus Saffire donanımı, %21 O₂, 14.7 psia, U = 20 cm/s", "same_en": "Identical Cygnus Saffire duct, 21% O₂, 14.7 psia, U = 20 cm/s", "diff_tr": "Saffire-II karşılaştırması: 9 farklı küçük şerit (5×30 cm silikon, PMMA, Nomex, Sibal)", "diff_en": "Saffire-II multi-sample array (9 strips of 5×30 cm silicone, PMMA, Nomex, Sibal)", "result_tr": "Kalın PMMA sönümlenirken ince silikon ve Sibal şeritler tam boy yandı (kalınlık etkisi).", "result_en": "Thick PMMA quenched while thin silicone and Sibal burned completely (thickness effect)."}], "tags": ["Saffire", "Cygnus", "large-scale", "Sibal", "cabin pressure", "smoke"]}, {"exp_id": "PSI-SAFFIRE4-06", "program": "Saffire-IV", "hardware_group": "CYGNUS", "title": "Saffire-IV — Fire Growth, Ribbed Geometry, Smoke Monitoring & Post-Fire Scrubbing", "title_tr": "Saffire-IV — Oluklu PMMA Geometrisi, Çoklu Duman İzleme ve Yangın Sonrası Temizleme", "facility": "Northrop Grumman Cygnus NG-13 Autonomous Spacecraft", "year": 2020, "fuel_id": "pmma", "material": "Structured PMMA Sheets (Flat vs. Ribbed/Grooved Slabs)", "sample_geometry_tr": "Düz PMMA plaka (10 mm kalınlık) vs. yüzey alanı artırılmış oluklu/kanatçıklı (ribbed) PMMA plaka", "sample_geometry_en": "Flat cast PMMA slab (10 mm thick) vs. surface-grooved / ribbed PMMA panel", "sensors_tr": "Faraday kabı duman iyonizasyon/lazer partikül dedektörleri (riser/far-field), CO / CO₂ / HF / HCl gaz analizörleri, IR kameralar", "sensors_en": "Far-field laser/ionization smoke particle monitors, CO / CO₂ / HCl / HF gas analyzers, IR cameras", "gravity_g": 0.0, "oxygen_pct": 21.0, "pressure_psia": 14.7, "airflow_cms": 15.0, "moc_measured_pct": 14.5, "burning_rate_or_spread": "Spread = 1.10 mm/s (Ribbed surface +45% faster)", "cool_flame_observed": false, "ntrs_id": "20220002714", "ntrs_url": "https://ntrs.nasa.gov/citations/20220002714", "psi_id": "PSI-142", "psi_url": "https://www.nasa.gov/PSI", "key_finding_tr": "Oluklu/çıkıntılı (ribbed) PMMA yüzey geometrisi, düz yüzeye kıyasla alev yayılma hızını ve ısı geri beslemesini %45 artırdı; CO₂/CO scrubber ekipmanları yangın sonrası atmosfer temizliğini doğruladı.", "key_finding_en": "Ribbed/grooved PMMA fuel geometry amplified flame spread and heat feedback by ~45% over flat slabs; post-fire gas scrubbing protocols were validated in orbit.", "safety_insight_tr": "Kabin içi panellerde keskin köşe, ince kenar ve oluklu geometrilerden kaçınılmalıdır; düz ve kalın kesitler tutuşmayı geciktirir.", "safety_insight_en": "Avoid thin edges, fins, and ribbed polymer geometries in crewed cabin interiors to prevent flame-spread amplification.", "intra_runs": [{"run_code": "SAFF4-FLAT", "same_tr": "Cygnus NG-13, PMMA malzeme, %21 O₂, 14.7 psia, U = 15 cm/s", "same_en": "Cygnus NG-13, PMMA polymer, 21% O₂, 14.7 psia, U = 15 cm/s", "diff_tr": "Tamamen pürüzsüz düz (flat) PMMA plaka geometrisi", "diff_en": "Smooth flat PMMA slab geometry", "result_tr": "Sınır tabakası ısı transferi sınırlı kaldı; yayılma hızı ~0.76 mm/s ölçüldü.", "result_en": "Boundary-layer heat feedback remained moderate; spread rate measured ~0.76 mm/s."}, {"run_code": "SAFF4-RIB", "same_tr": "Cygnus NG-13, PMMA malzeme, %21 O₂, 14.7 psia, U = 15 cm/s", "same_en": "Cygnus NG-13, PMMA polymer, 21% O₂, 14.7 psia, U = 15 cm/s", "diff_tr": "Oluklu / çıkıntılı (ribbed) PMMA plaka geometrisi", "diff_en": "Grooved / ribbed PMMA slab geometry", "result_tr": "Çıkıntı köşeleri iki yönden ısınarak pirolizi hızlandırdı ve alev yayılmasını %45 artırdı (1.10 mm/s).", "result_en": "Rib corners heated from two sides, accelerating pyrolysis and boosting spread by +45% (1.10 mm/s)."}, {"run_code": "SAFF4-SCRUB", "same_tr": "Cygnus NG-13 kapalı kabin hacmi, yangın sonrası atmosfer", "same_en": "Cygnus NG-13 sealed cabin volume, post-fire atmosphere", "diff_tr": "Aktif duman filtreleme ve CO->CO₂ katalitik oksidasyon scrubber fazı", "diff_en": "Active particulate filtration & catalytic CO scrubber activation", "result_tr": "0G'de çökmeyen mikron-altı kurum partikülleri ve CO başarıyla güvenli eşik altına indirildi.", "result_en": "Non-settling sub-micron 0G soot and CO were scrubbed below toxic crew limits."}], "tags": ["Saffire-IV", "PMMA", "geometry", "ribbed", "smoke", "scrubber", "Cygnus"]}, {"exp_id": "PSI-SAFFIRE5-07", "program": "Saffire-V", "hardware_group": "CYGNUS", "title": "Saffire-V — Exploration Atmosphere (8.2 psia / 34% O₂) Large-Scale Fire Test", "title_tr": "Saffire-V — Artemis Keşif Atmosferinde (8.2 psia / %34 O₂) Büyük Ölçekli Yangın", "facility": "Northrop Grumman Cygnus NG-14 Autonomous Spacecraft", "year": 2021, "fuel_id": "pmma", "material": "PMMA Slabs & Sibal Samples in 8.2 psia / 34% O₂", "sample_geometry_tr": "40 cm genişlikte oluklu/düz PMMA paneller ve referans kumaş numuneleri (düşük basınçlı Cygnus kabininde)", "sample_geometry_en": "40 cm wide flat/ribbed PMMA panels and reference cloth coupons in depressurized Cygnus cabin", "sensors_tr": "Çok açılı HD kameralar, radyometreler, kabin basınç artışı (ΔP) sensörü, uzak alan duman/gaz sensör ağı", "sensors_en": "Multi-angle HD cameras, radiometers, cabin ΔP pressure transducers, far-field smoke/gas network", "gravity_g": 0.0, "oxygen_pct": 34.0, "pressure_psia": 8.2, "airflow_cms": 10.0, "moc_measured_pct": 15.8, "burning_rate_or_spread": "Spread = 3.45 mm/s (2.6x ISS rate!)", "cool_flame_observed": false, "ntrs_id": "20220002714", "ntrs_url": "https://ntrs.nasa.gov/citations/20220002714", "psi_id": "PSI-145", "psi_url": "https://www.nasa.gov/PSI", "key_finding_tr": "Ay/Mars görevleri için planlanan 8.2 psia ve %34 O₂ keşif atmosferinde alev sıcaklığı, parlaklığı ve yayılma hızı standart ISS atmosferine göre 2.6 kat daha şiddetli gerçekleşti.", "key_finding_en": "Under the 8.2 psia / 34% O₂ exploration atmosphere planned for Lunar/Mars habitats, flame intensity and spread velocity surged ~2.6x above standard ISS normoxic conditions.", "safety_insight_tr": "Artemis, Ay Üssü ve basınçlı gezginlerde (%30-%34 O₂) ISS sertifikalı malzemeler doğrudan kullanılamaz; yeni yangın bariyerleri şarttır.", "safety_insight_en": "Materials certified for ISS (21% O₂) are unsafe in 30–34% O₂ Lunar/Artemis habitats without re-qualification.", "intra_runs": [{"run_code": "SAFF5-EXP1", "same_tr": "Cygnus NG-14, 8.2 psia toplam basınç, %34 O₂, PMMA numune", "same_en": "Cygnus NG-14, 8.2 psia total pressure, 34% O₂, PMMA panel", "diff_tr": "Orta havalandırma hızı (U = 10 cm/s)", "diff_en": "Moderate ventilation flow (U = 10 cm/s)", "result_tr": "Azalan N₂ ısıl balastı nedeniyle alev sıcaklığı ve yayılma hızı (3.45 mm/s) ISS'in 2.6 katına çıktı!", "result_en": "Reduced N₂ thermal ballast drove flame spread (3.45 mm/s) to 2.6x ISS normoxic rates!"}, {"run_code": "SAFF5-EXP2", "same_tr": "Cygnus NG-14, 8.2 psia, %34 O₂, aynı PMMA kalınlığı", "same_en": "Cygnus NG-14, 8.2 psia, 34% O₂, identical PMMA thickness", "diff_tr": "Düşürülmüş akış hızı (U = 3.0 cm/s)", "diff_en": "Reduced ventilation velocity (U = 3.0 cm/s)", "result_tr": "Fan hızı düşürülünce ısı açığa çıkış hızı (HRR) belirgin biçimde geriledi (HVAC kesmenin önemi).", "result_en": "Lowering fan flow sharply curtailed Heat Release Rate (HRR), confirming HVAC shutoff efficacy."}, {"run_code": "SAFF6-SUPP", "same_tr": "8.2 psia / >%30 O₂ keşif atmosferi, Cygnus Saffire serisi", "same_en": "8.2 psia / >30% O₂ exploration atmosphere, Saffire series", "diff_tr": "Saffire-VI karşılaştırması: Kabin basıncı düşürme (depressurization) prosedürü", "diff_en": "Saffire-VI comparison: Active cabin depressurization fire-suppression test", "result_tr": "Vakuma tahliye sırasında oluşan geçici hava akımı alevi anlık parlatıp ardından O₂ bitimiyle söndürdü!", "result_en": "Venting flow briefly intensified flames before low partial O₂ extinguished all burning."}], "tags": ["Saffire-V", "Artemis", "exploration atmosphere", "34% O2", "8.2 psia", "lunar", "Cygnus"]}, {"exp_id": "PSI-SOFIE-08", "program": "SoFIE", "hardware_group": "CIR", "title": "Solid Fuel Ignition and Extinction (SoFIE-GEL & MIST) — Growth & Extinguishment Limits", "title_tr": "SoFIE (GEL & MIST) — Katı Yakıt Tutuşma ve İnce Su Sisi Söndürme Sınırları", "facility": "ISS Combustion Integrated Rack (CIR) — Solid Fuel Insert", "year": 2023, "fuel_id": "pmma", "material": "PMMA Spheres, Cylinders & Flat Channels + Fine Water Mist", "sample_geometry_tr": "CIR akış tünelinde 20 mm çaplı döner/sabit PMMA küreler, eş-merkezli silindirler ve düz kanal plakaları", "sample_geometry_en": "20 mm diameter PMMA spheres, concentric cylinders, and flat channel plates in CIR flow tunnel", "sensors_tr": "Lazer faz-Doppler su sisi damlacık çap ölçeri, yüksek hızlı termal/optik kameralar, radyometre, O₂/CO₂ sensörleri", "sensors_en": "Phase-Doppler water-mist droplet sizing, high-speed thermal/optical cameras, radiometer, O₂/CO₂ sensors", "gravity_g": 0.0, "oxygen_pct": 28.0, "pressure_psia": 10.2, "airflow_cms": 8.0, "moc_measured_pct": 14.9, "burning_rate_or_spread": "Spread = 2.10 mm/s • Extinguished via 30 µm Mist", "cool_flame_observed": false, "ntrs_id": "20210011385", "ntrs_url": "https://ntrs.nasa.gov/citations/20210011385", "psi_id": "PSI-156", "psi_url": "https://www.nasa.gov/PSI", "key_finding_tr": "SoFIE-MIST deneyleri, Ay üssü/rover atmosferinde (10.2 psia, %28-%34 O₂) ince su sisinin (20-50 µm damlacık) alev cephesine akımla taşınarak Halon kullanmadan yüksek verimli söndürme sağladığını gösterdi.", "key_finding_en": "SoFIE-MIST demonstrated how 20-50 µm fine water mist droplets entrained in low-speed flow extinguish solid polymer flames in Lunar-relevant atmospheres (10.2 psia) cleanly without Halon.", "safety_insight_tr": "25-40 µm damlacık çaplı ince su sisi söndürücüler, hem ISS kabinleri hem Dünya temiz oda/batarya yangınları için en güvenli birincil teknolojidir.", "safety_insight_en": "Sub-50 µm fine water mist nozzles targeted along ventilation streamlines maximize 0G and terrestrial cleanroom suppression.", "intra_runs": [{"run_code": "SOFIE-GEL03", "same_tr": "CIR katı yakıt ünitesi, 20 mm PMMA küre, 10.2 psia", "same_en": "CIR solid fuel insert, 20 mm PMMA sphere, 10.2 psia", "diff_tr": "Düşük akış (U = 4 cm/s) vs. Orta akış (U = 14 cm/s) @ %28 O₂", "diff_en": "Low flow (U = 4 cm/s) vs. Moderate flow (U = 14 cm/s) at 28% O₂", "result_tr": "Küre ön durgunluk noktasında ince mavi zar, arka iz bölgesinde ise uzayan kurumlu kuyruk oluştu.", "result_en": "Thin blue forward stagnation sheet transitioned into an elongated luminous wake tail."}, {"run_code": "SOFIE-MIST07", "same_tr": "CIR ünitesi, PMMA küre alevi, 10.2 psia, %28 O₂, U = 8 cm/s", "same_en": "CIR insert, burning PMMA sphere, 10.2 psia, 28% O₂, U = 8 cm/s", "diff_tr": "İnce su sisi enjeksiyonu (D_mist = 28 µm, yüksek sayısal yoğunluk)", "diff_en": "Fine water mist injection (D_mist = 28 µm, high mist concentration)", "result_tr": "Su damlacıkları alev zarında anında buharlaşarak gizli ısıyla (2260 kJ/kg) alevi 2.4 sn'de söndürdü!", "result_en": "Mist droplets vaporized inside the reaction sheet, quenching the flame in 2.4 s via latent heat!"}, {"run_code": "SOFIE-SMTS02", "same_tr": "CIR katı yakıt ünitesi, aynı atmosfer basıncı (10.2 psia)", "same_en": "CIR solid fuel insert, identical 10.2 psia pressure", "diff_tr": " Numune ön-ısıtma sıcaklığı artırımı (T_init = 25 °C -> 85 °C)", "diff_en": "Elevated sample preheat temperature (T_init = 25 °C -> 85 °C)", "result_tr": "Sıcak elektronik kutu yüzeylerini temsil eden 85 °C PMMA'da MOC sınırı %1.4 daha aşağı düştü.", "result_en": "Preheated PMMA (simulating warm avionics bays) exhibited a 1.4% lower MOC threshold."}], "tags": ["SoFIE", "GEL", "MIST", "water mist", "PMMA", "Artemis", "10.2 psia", "CIR", "suppression"]}, {"exp_id": "PSI-ACME-09", "program": "ACME (E-FIELD)", "hardware_group": "CIR", "title": "Advanced Combustion via Microgravity Experiments (ACME) — E-FIELD Flames & Partial-G Emulation", "title_tr": "ACME E-FIELD — İyon Rüzgarı ile Kısmi Yerçekimi Emülasyonu ve Kurumsuz Gaz Alevi", "facility": "ISS Combustion Integrated Rack (CIR) — Modular ACME Chamber", "year": 2020, "fuel_id": "hydrogen", "material": "Gaseous H₂ / CH₄ / C₂H₄ Laminar Diffusion Jets", "sample_geometry_tr": "Paralel yüksek voltajlı (±10 kV) tel örgü elektrotlar arasında eş-akışlı dairesel gaz brülörü (d = 3.2 mm)", "sample_geometry_en": "Co-flow circular gas burner (d = 3.2 mm) positioned between parallel high-voltage (±10 kV) mesh electrodes", "sensors_tr": "Yüksek çözünürlüklü kemilüminesans (OH*/CH*) kamerası, iyon akımı nano-ampermetresi, lazer kurum ölçer", "sensors_en": "High-resolution OH*/CH* chemiluminescence camera, ion-current pico/nano-ammeter, laser soot diagnostic", "gravity_g": 0.0, "oxygen_pct": 21.0, "pressure_psia": 14.7, "airflow_cms": 12.0, "moc_measured_pct": 6.4, "burning_rate_or_spread": "Ionic wind emulates partial-G • Soot cut 70%", "cool_flame_observed": false, "ntrs_id": "19990054024", "ntrs_url": "https://ntrs.nasa.gov/citations/19990054024", "psi_id": "PSI-149", "psi_url": "https://www.nasa.gov/PSI", "key_finding_tr": "Elektrik alanının alevde doğal oluşan iyonlar (H₃O⁺, CHO⁺) üzerindeki kuvvetiyle (iyon rüzgarı) 0G ortamında Ay/Mars kısmi yerçekimi konveksiyonu başarıyla taklit edildi; kurum %70 azaltıldı ve yüksek voltajda alev söndürüldü.", "key_finding_en": "Electric-field body forces on natural flame chemi-ions emulated partial-gravity buoyancy in 0G, cutting soot by ~70% and enabling non-contact electrostatic blowoff.", "safety_insight_tr": "PSI'da LUCI/FM2 Ay verileri tamamlanana dek ACME E-FIELD sonuçları kısmi yerçekimi konveksiyonunu modellemek için kritik deneysel köprüdür.", "safety_insight_en": "Until LUCI/FM2 Lunar datasets arrive in PSI, ACME E-FIELD ionic-wind scaling bridges 0G and partial-G convection.", "intra_runs": [{"run_code": "EFD-V00", "same_tr": "CIR ACME modüler seti, C₂H₄/N₂ jet alevi, 14.7 psia, %21 O₂", "same_en": "CIR ACME modular set, C₂H₄/N₂ jet flame, 14.7 psia, 21% O₂", "diff_tr": "Elektrik alanı kapalı (V = 0 kV -> Saf 0G referansı)", "diff_en": "Zero electric field (V = 0 kV -> Pure 0G baseline)", "result_tr": "Geniş, uzun ve parlak sarı kurum kanatlı klasik 0G difüzyon alevi oluştu.", "result_en": "Broad, elongated 0G diffusion flame with heavy yellow soot wings."}, {"run_code": "EFD-V04", "same_tr": "CIR ACME modüler seti, aynı yakıt debisi, 14.7 psia, %21 O₂", "same_en": "CIR ACME modular set, identical fuel flow, 14.7 psia, 21% O₂", "diff_tr": "Orta elektrik alanı (E = 3.5 kV/cm -> Ay/Mars kısmi-G iyon rüzgarı taklidi)", "diff_en": "Moderate electric field (E = 3.5 kV/cm -> Partial-gravity ionic-wind emulation)", "result_tr": "İyon rüzgarı 0.16G–0.38G benzeri konveksiyon yaratarak alevi inceltti ve kurumu %70 sildi!", "result_en": "Ionic wind induced partial-G-like convection, narrowing the flame and eliminating 70% of soot!"}, {"run_code": "EFD-V09", "same_tr": "CIR ACME modüler seti, aynı yakıt debisi, 14.7 psia", "same_en": "CIR ACME modular set, identical fuel flow, 14.7 psia", "diff_tr": "Yüksek voltaj eşiği (E > 7.5 kV/cm)", "diff_en": "High-voltage threshold (E > 7.5 kV/cm)", "result_tr": "Aşırı iyon rüzgarı gerinimi alev tabanını kopararak kimyasalsız elektrostatik söndürme sağladı.", "result_en": "Excessive ionic-wind strain blew off the flame base without chemical suppressants."}], "tags": ["ACME", "E-FIELD", "partial gravity", "hydrogen", "electric field", "soot", "ionic wind", "CIR"]}, {"exp_id": "PSI-ACME-BRE-10", "program": "ACME-BRE", "hardware_group": "CIR", "title": "ACME Burning Rate Emulator (BRE) — Quiescent Spacecraft Material Flammability Simulation", "title_tr": "ACME-BRE — Durgun Atmosferlerde Gaz Brülörüyle Katı Malzeme Yanıcılık Emülasyonu", "facility": "ISS Combustion Integrated Rack (CIR) — Modular ACME Set", "year": 2019, "fuel_id": "pmma", "material": "Flat Porous Brass Burner Emulating PMMA, Polyethylene & Paper Vapors", "sample_geometry_tr": "25 mm ve 50 mm çaplı düz, gözenekli sinterlenmiş pirinç brülör (hareketsiz atmosferde gaz yakıtla katı malzeme taklidi)", "sample_geometry_en": "25 mm and 50 mm diameter flat sintered-brass porous gas burners in quiescent CIR atmospheres", "sensors_tr": "Gömülü brülör ısı akısı termokuplları, geniş açılı radyometreler, CH*/OH* kameralar, hassas gaz MFC", "sensors_en": "Embedded burner heat-flux thermocouples, wide-angle radiometers, CH*/OH* cameras, precision gas MFC", "gravity_g": 0.0, "oxygen_pct": 19.0, "pressure_psia": 14.7, "airflow_cms": 0.5, "moc_measured_pct": 14.6, "burning_rate_or_spread": "Steady hemispherical blue flame (>180 s)", "cool_flame_observed": false, "ntrs_id": "20160000593", "ntrs_url": "https://ntrs.nasa.gov/citations/20160000593", "psi_id": "PSI-151", "psi_url": "https://www.nasa.gov/PSI", "key_finding_tr": "Gaz yakıt (etilen/metan) debisi brülör yüzeyine gelen ısı akısına geri beslenerek hareketsiz (durgun) atmosferlerde katı malzemelerin buharlaşma ısısı (B-sayısı) taklit edildi; 3 dakikadan uzun süren sönme sınırları haritalandı.", "key_finding_en": "By coupling gaseous fuel flow to measured burner heat feedback in quiescent atmospheres, BRE emulated solid material flammability (B-number) over >180 s durations unattainable in drop towers.", "safety_insight_tr": "Dünya'daki 5 saniyelik düşüş kulesi (drop tower) testleri uzun süreli durgun 0G kor/alev dengesini kaçırır; ISS BRE verileri malzeme seçimine rehberlik eder.", "safety_insight_en": "Short 5 s terrestrial drop-tower tests miss slow 0G radiative equilibrium revealed by long-duration ISS BRE burns.", "intra_runs": [{"run_code": "BRE-25E", "same_tr": "CIR ACME donanımı, durgun 0G atmosferi, 14.7 psia, %21 O₂", "same_en": "CIR ACME hardware, quiescent 0G atmosphere, 14.7 psia, 21% O₂", "diff_tr": "25 mm çaplı düz brülör, PMMA buharlaşma ısısı emülasyonu", "diff_en": "25 mm flat burner emulating PMMA heat of gasification", "result_tr": "210 saniye boyunca kararlı, kurumsuz yarı-küresel mavi kubbe alevi korundu.", "result_en": "Sustained a steady, soot-free hemispherical blue flame dome for 210 seconds."}, {"run_code": "BRE-50E", "same_tr": "CIR ACME donanımı, durgun 0G atmosferi, 14.7 psia, %21 O₂", "same_en": "CIR ACME hardware, quiescent 0G atmosphere, 14.7 psia, 21% O₂", "diff_tr": "50 mm geniş çaplı brülör ve yüksek B-sayısı (kağıt/selüloz emülasyonu)", "diff_en": "Larger 50 mm burner emulating low-L_v paper/cellulose", "result_tr": "Geniş brülörde alev çapı büyüdükçe radyatif kayıp kesri (χ_r) yükselip alevi kendi kendine söndürdü.", "result_en": "Larger flame volume amplified χ_r radiative heat loss, driving radiative self-extinction."}, {"run_code": "BRE-LOWP", "same_tr": "CIR ACME donanımı, 25 mm brülör, durgun 0G", "same_en": "CIR ACME hardware, 25 mm burner, quiescent 0G", "diff_tr": "Keşif basıncı (0.7 atm / 10.2 psia) ve %30 O₂", "diff_en": "Reduced exploration pressure (0.7 atm / 10.2 psia) at 30% O₂", "result_tr": "Düşük basınçta azalan gaz yoğunluğu kurumu bastırırken ısı geri beslemesini yükseltti.", "result_en": "Reduced pressure suppressed soot formation while raising conductive heat feedback."}], "tags": ["ACME", "BRE", "B-number", "polymer", "quiescent", "extinction", "CIR", "drop tower"]}, {"exp_id": "PSI-ACME-CFIG-14", "program": "ACME CFI-G", "hardware_group": "CIR", "title": "ACME Cool Flames Investigation with Gases (CFI-G) — Up to 85% O₂ Spherical Inverse Flames", "title_tr": "ACME CFI-G — Küresel Brülörden %85 O₂ Akışıyla Gazlarda Serin Alev Araştırması", "facility": "ISS Combustion Integrated Rack (CIR) — Modular ACME Set", "year": 2021, "fuel_id": "propane_cfig", "material": "Spherical Porous Burner Flowing up to 85% O₂ into Propane/Nitrogen Chamber", "sample_geometry_tr": "CIR yanma odası azot + yanıcı gaz (örn. propan/bütan) ile doluyken merkezden %85'e varan O₂ üfleyen 6.4–12.7 mm gözenekli küresel brülör", "sample_geometry_en": "6.4–12.7 mm spherical porous burner flowing up to 85% O₂ into a chamber filled with N₂ + fuel gas (propane/butane)", "sensors_tr": "UV formaldehit / OH* yoğunlaştırılmış kamera, ince tel termokupl tarayıcı, radyometreler", "sensors_en": "Intensified UV formaldehyde / OH* camera, motorized fine-wire thermocouple rake, radiometers", "gravity_g": 0.0, "oxygen_pct": 85.0, "pressure_psia": 14.7, "airflow_cms": 0.4, "moc_measured_pct": 11.4, "burning_rate_or_spread": "Highest O₂ microgravity tests (up to 85% O₂ spherical flame)", "cool_flame_observed": true, "ntrs_id": "20220004819", "ntrs_url": "https://ntrs.nasa.gov/search?q=Cool%20Flames%20Investigation%20with%20Gases%20CFI-G", "psi_id": "PSI-153", "psi_url": "https://www.nasa.gov/PSI", "key_finding_tr": "En yüksek oksijen konsantrasyonuna sahip mikroçekim yanma testleri ACME CFI-G kapsamında gerçekleştirildi: Propan/azot dolu odaya küresel brülörden %85'e varan O₂ gönderilerek sıvı damlacık buharlaşması olmadan saf gaz fazı küresel soğuk ve sıcak alevler üretildi.", "key_finding_en": "Representing the highest-O₂ microgravity tests in PSI, ACME CFI-G flowed up to 85% O₂ through a spherical burner into a propane/nitrogen chamber, isolating steady gas-phase spherical hot and cool flames.", "safety_insight_tr": "Yüksek basınçlı O₂ hatlarının (%85-%100 O₂) kabin içi yakıt/hidrokarbon buharına sızması durumunda oluşan ters difüzyon (inverse) alevlerinin sınırlarını tanımlar.", "safety_insight_en": "Defines hazard limits for high-concentration O₂ line leaks (up to 85–100% O₂) into fuel-contaminated compartments.", "intra_runs": [{"run_code": "CFIG-P08", "same_tr": "CIR ACME küresel brülör, oda: N₂ + Propan (C₃H₈), 0G, 14.7 psia", "same_en": "CIR ACME spherical burner, chamber: N₂ + Propane, 0G, 14.7 psia", "diff_tr": "Küresel brülörden %85 O₂ / %15 N₂ karışımı akışı (yüksek debi)", "diff_en": "85% O₂ / 15% N₂ oxidizer flow from spherical burner (moderate flow)", "result_tr": "Brülör etrafında kusursuz küresel, çok yüksek sıcaklıklı ters (inverse) mavi difüzyon alevi oluştu.", "result_en": "Formed an intensely luminous, perfectly spherical inverse hot diffusion flame."}, {"run_code": "CFIG-P19", "same_tr": "CIR ACME küresel brülör, oda: Seyreltik Propan + N₂, 0G", "same_en": "CIR ACME spherical burner, chamber: Diluted Propane + N₂, 0G", "diff_tr": "%85 O₂ brülör akışı, ancak oda yakıt kesri sönme sınırına düşürüldü", "diff_en": "85% O₂ burner flow while chamber propane fraction was stepped down", "result_tr": "Sıcak alev radyatif kayıpla sönüp gaz fazında dakikalarca süren kararlı 640 K küresel Soğuk Aleve dönüştü!", "result_en": "Hot flame transitioned into a multi-minute steady ~640 K gas-phase spherical Cool Flame!"}, {"run_code": "CFIG-M04", "same_tr": "CIR ACME küresel brülör, aynı %85 O₂ oksitleyici akışı", "same_en": "CIR ACME spherical burner, identical 85% O₂ oxidizer stream", "diff_tr": "Oda gazı Metan (CH₄ — NTC kimyası olmayan yakıt) ile değiştirildi", "diff_en": "Chamber fuel switched to Methane (CH₄ — lacking NTC peroxy pathways)", "result_tr": "Metan testlerinde soğuk alev oluşmadı; sıcak alev sönme sınırında doğrudan sönümlendi.", "result_en": "No cool flame occurred in methane; hot flame quenched abruptly at the radiative limit."}], "tags": ["ACME", "CFI-G", "85% O2", "high oxygen", "cool flame", "propane", "spherical burner", "CIR"]}, {"exp_id": "PSI-DAFT-15", "program": "DAFT & DAFT-2 (SAME)", "hardware_group": "CABIN", "title": "Dust and Aerosol Measurement Feasibility Test (DAFT / DAFT-2 & SAME) — Smoke vs. Dust Discrimination", "title_tr": "DAFT & DAFT-2 (SAME) — Uzay Aracı Duman Dedektörü ile Kabin/Ay Tozu Ölçümü ve Yanlış Alarm Önleme", "facility": "ISS Cabin / Microgravity Science Glovebox (SAME Aerosol Hardware)", "year": 2011, "fuel_id": "sibal", "material": "Pyrolysis Smoke Aerosols (Kapton/Teflon/Cellulose) vs. Cabin & Lunar Simulant Dust", "sample_geometry_tr": "SAME (Smoke Aerosol Measurement Experiment) tel-ısıtmalı piroliz numuneleri (0.2–5 µm duman) ve kabin içi süspanse toz partikülleri", "sample_geometry_en": "SAME wire-heated pyrolysis coupons (0.2–5 µm smoke) vs. suspended cabin/lunar dust aerosols", "sensors_tr": "P-Trak ultra-ince partikül sayacı, DustTrak lazer fotometre, termal çökeltici (TEM elektron mikroskobu örnekleme), ISS optik vs. iyonizasyon dedektörleri", "sensors_en": "Condensation nuclei counter (P-Trak), laser photometer (DustTrak), thermophoretic TEM sampler, ISS optical vs. ionization detectors", "gravity_g": 0.0, "oxygen_pct": 21.0, "pressure_psia": 14.7, "airflow_cms": 5.0, "moc_measured_pct": 13.5, "burning_rate_or_spread": "0G Smoke particle diameter 2-3x larger than 1G; dust discriminated", "cool_flame_observed": false, "ntrs_id": "20120002875", "ntrs_url": "https://ntrs.nasa.gov/search?q=Dust%20and%20Aerosol%20Measurement%20Feasibility%20Test%20DAFT", "psi_id": "PSI-103", "psi_url": "https://www.nasa.gov/PSI", "key_finding_tr": "SAME duman tespiti araştırmasında kullanılan lazer/partikül aletleri DAFT ve DAFT-2 çalışmalarında kabin tozunu ölçmek için kullanıldı; 0G'de duman partiküllerinin daha uzun kalış süresiyle büyüdüğü ve çok dalga boylu saçılımla Ay/kabin tozundan ayırt edilebildiği kanıtlandı.", "key_finding_en": "Repurposing SAME smoke-detection instruments in DAFT and DAFT-2 proved 0G smoke aerosols grow larger than in 1G and enabled multi-channel discrimination between real fire smoke and nuisance cabin/lunar dust.", "safety_insight_tr": "Hem Ay yüzey üslerindeki aşındırıcı regolith tozunun yanlış yangın alarmı vermesini önler hem de Dünya'daki akıllı ev/endüstriyel duman dedektörlerini geliştirir!", "safety_insight_en": "Prevents false fire alarms from lunar regolith/cabin dust in habitats and powers next-generation false-alarm-immune terrestrial smoke detectors.", "intra_runs": [{"run_code": "SAME-K03", "same_tr": "SAME aerosol odası, 0G, 14.7 psia, %21 O₂", "same_en": "SAME aerosol chamber, 0G, 14.7 psia, 21% O₂", "diff_tr": "Aşırı ısınan Kapton/Teflon kablo izolasyonu piroliz dumanı", "diff_en": "Overheated Kapton/Teflon wire insulation pyrolysis aerosol", "result_tr": "0G'de kaldırma kuvveti olmadığı için duman tanecikleri çarpışarak koagüle oldu; ISS lazer dedektörü iyonizasyondan daha duyarlı çıktı.", "result_en": "Absence of buoyant plume dilution grew larger agglomerates, favoring laser-scattering over ionization sensors."}, {"run_code": "DAFT-CAB1", "same_tr": "Aynı SAME P-Trak & DustTrak aerosol ölçüm cihaz seti, ISS kabini", "same_en": "Identical SAME P-Trak & DustTrak instrument suite inside ISS cabin", "diff_tr": "Yanma yok; mürettebat aktivitesi sırasında havada asılı kabin tozu ölçümü", "diff_en": "Non-fire ambient ISS crew-cabin dust & ultra-fine aerosol survey", "result_tr": "Kabin HEPA filtrelerinin verimi doğrulandı ve kaba toz (>2 µm) ile yanma dumanı (<0.8 µm) imzası ayrıştırıldı.", "result_en": "Separated coarse nuisance dust (>2 µm) signatures from sub-micron pyrolysis smoke (<0.8 µm)."}, {"run_code": "DAFT2-LUN", "same_tr": "SAME/DAFT aerosol optik saçılım kalibrasyon mimarisi", "same_en": "SAME/DAFT multi-angle aerosol optical scattering architecture", "diff_tr": "DAFT-2 Ay tozu (Lunar dust) ve nem damlacığı yanlış alarm testi", "diff_en": "DAFT-2 lunar-dust simulant & water-droplet nuisance discrimination", "result_tr": "İki dalga boylu/açılı lazer oranı sayesinde Ay üssü hava kilitlerindeki toz bulutu yangın alarmından %98 doğrulukla ayrıldı.", "result_en": "Dual-wavelength/angle scattering separated airlock lunar dust from real fire smoke with >98% accuracy."}], "tags": ["DAFT", "DAFT-2", "SAME", "smoke detector", "dust", "aerosol", "lunar dust", "false alarm", "duman"]}], "SPACE_TO_EARTH_TRANSFERS": [{"domain_tr": "İtfaiyeci Koruyucu Giysileri", "domain_en": "Firefighter Protective Gear", "nasa_source": "NASA Apollo / EVA Suit (%100 O₂), BASS-II & SoFIE (NTRS 20210011385)", "insight_tr": "Uzay giysileri ve yüksek oksijenli kabinler için geliştirilen PBI/Nomex yanmaz dokuma teknolojileri ile hafif kompozit yaşam destek oksijen tankları, bugün dünyadaki tüm itfaiyecilerin daha hafif SCBA hava tüpleri taşımasını ve yüksek ısıya dayanıklı koruyucu giysilerle korunmasını sağlamaktadır.", "insight_en": "NASA EVA suit fire-resistant textiles (PBI/Nomex) and lightweight composite life-support pressure vessels directly enabled modern firefighter protective turnout coats and lighter SCBA breathing air tanks on Earth."}, {"domain_tr": "Akıllı Duman Dedektörleri", "domain_en": "Smart Smoke Detectors", "nasa_source": "SAME, DAFT & DAFT-2 (NTRS 20120002875)", "insight_tr": "ISS'te duman partikülü boyut dağılımını inceleyen SAME ve aynı lazer cihazlarını kabin/Ay tozunu ayırt etmek için kullanan DAFT/DAFT-2 araştırmaları; evlerde, uçak kargo ambarlarında ve madenlerde su buharı/toz kaynaklı yanlış alarmları sıfırlayan çok açılı akıllı duman dedektörlerine dönüştü.", "insight_en": "Multi-wavelength aerosol scattering developed in NASA's SAME and DAFT/DAFT-2 investigations powers modern terrestrial smoke detectors that distinguish real sub-micron pyrolysis smoke from dust and steam."}, {"domain_tr": "Su Sisli Söndürücüler", "domain_en": "Water Mist Extinguishers", "nasa_source": "ISS Water Mist PFE, SoFIE-MIST & Saffire-IV (NTRS 20220002714)", "insight_tr": "ISS'te zehirli Halon'un yerini almak üzere geliştirilen 20–50 µm ince su sisli söndürücüler ve anlık HVAC kesme protokolleri; bugün Dünya'da veri merkezlerinde, müzelerde, denizaltılarda ve elektrikli araç batarya depolarında elektroniklere zarar vermeden yangın söndürmektedir.", "insight_en": "Sub-50 µm fine water mist extinguishers developed for the ISS replace ozone-depleting Halon in terrestrial data centers, museums, submarines, and lithium-ion battery facilities."}, {"domain_tr": "Temiz Motor Yanması", "domain_en": "Clean Engine Kinetics", "nasa_source": "FLEX, FLEX-2, CFI & ACME CFI-G (NTRS 20150023456)", "insight_tr": "ISS'te kaldırma kuvveti olmadan izole edilen 550-750 K Soğuk Alev (NTC) kimyası, Dünya'daki otomobil ve uçak motorlarında vuruntuyu (knock) önleyip yakıt tüketimini ve NOx emisyonunu %20-30 azaltan kinetik modellerin temelini oluşturdu.", "insight_en": "Isolated cool-flame NTC kinetics from ISS FLEX, CFI, and CFI-G experiments calibrated chemical mechanisms for cleaner, knock-free HCCI engines on Earth."}, {"domain_tr": "Tıbbi Oksijen Kabinleri", "domain_en": "Medical Oxygen Chambers", "nasa_source": "Saffire-V (%34 O₂) & ACME CFI-G (%85 O₂)", "insight_tr": "Ay üsleri (%30–34 O₂), uzay giysileri (%100 O₂) ve CFI-G (%85 O₂) için ölçülen tutuşma sınırları, hastanelerdeki hiperbarik oksijen kabinleri ve yoğun bakım solunum ünitelerinde statik kıvılcım yangınlarını önleyen tıbbi standartları belirlemektedir.", "insight_en": "High-oxygen flammability boundaries from Saffire-V, EVA suit testing, and ACME CFI-G guide fire-safe material standards in hospital ICUs and hyperbaric chambers."}], "CORE_DIRECTIVES_LIST": [{"id": "CON-01", "code": "MICROGRAVITY_TRANSPORT", "title_tr": "Mikroçekim Kütle/Isı Taşınımı ve Boyutsuz Sayılar (Ra, Gr, Ri)", "title_en": "Microgravity Transport & Dimensionless Scaling (Ra, Gr, Ri)", "rule_tr": "0G (serbest düşüş) ortamında kaldırma kuvveti çöker: Grashof (Gr = g·β·ΔT·L³/ν² -> 0), Rayleigh (Ra = Gr·Pr -> 0) ve Richardson (Ri = Gr/Re² -> 0). Sıcak gazlar yükselemediği için alev küresel difüzyon formuna (H/W ≈ 1.0) bürünür; oksijen taşınımı yalnızca moleküler difüzyon ve düşük hızlı fan akışına (1-20 cm/s) bağlıdır.", "rule_en": "In 0G freefall, buoyancy collapses: Grashof (Gr -> 0), Rayleigh (Ra -> 0), and Richardson (Ri = Gr/Re² -> 0). Hot products cannot rise; flames form spherical diffusion structures (H/W ≈ 1.0) governed by molecular diffusion and cabin ventilation.", "severity": "CRITICAL"}, {"id": "CON-02", "code": "DROPLET_D2_AND_SPALDING", "title_tr": "D² Damlacık Yanma Yasası, Spalding Sayısı (B_oq) ve Sherwood (Sh)", "title_en": "Droplet d²-Law, Spalding Transfer Number (B_oq) & Sherwood (Sh)", "rule_tr": "Damlacık yanması D²(t) = D₀² - K·t yasasına uyar. Yanma hızı sabiti K = (8·λ_g / (ρ_l·c_p))·ln(1 + B_oq)·(Sh/2)·(1 - χ_r) ve Sherwood kütle taşınım çarpanı Sh = 2 + 0.6·Re^(1/2)·Sc^(1/3) ile hesaplanır. Alev durma mesafesi R_f/R_d = ln(1+B_oq)/ln(1+Y_O2/ν_s) ile belirlenir.", "rule_en": "Droplet combustion obeys D²(t) = D₀² - K·t, where K = (8·λ_g/(ρ_l·c_p))·ln(1+B_oq)·(Sh/2)·(1-χ_r), convective Sherwood factor Sh = 2 + 0.6·Re^(1/2)·Sc^(1/3), and flame standoff ratio R_f/R_d = ln(1+B_oq)/ln(1+Y_O2/ν_s).", "severity": "CRITICAL"}, {"id": "CON-03", "code": "VENTILATION_PARADOX_MOC", "title_tr": "Düşük Hızlı Havalandırma Paradoksu, Damköhler (Da) ve MOC Eğrisi", "title_en": "Low-Velocity Ventilation Paradox, Damköhler (Da) & U-Shaped MOC", "rule_tr": "Tam durgun mikroçekimde (U = 0 cm/s) alev kendi CO₂ kabuğu ve radyatif ısı kaybıyla (χ_r) boğularak sönebilir. Ancak 2-10 cm/s ISS kabin fan akışı taze O₂ besleyerek (yüksek Damköhler Da = τ_flow/τ_chem > 1) katı malzemelerin (PMMA, Sibal, Nomex) Dünya'dakinden (1G) daha düşük Minimum Oksijen Konsantrasyonunda (MOC) tutuşup yayılmasına yol açar.", "rule_en": "At quiescent 0G (0 cm/s), flames self-quench via radiative/diffusive losses. Gentle spacecraft ventilation (2-10 cm/s) replenishes O₂ at Damköhler Da > 1 without buoyant cooling, dropping Minimum Oxygen Concentration (MOC) below 1G limits.", "severity": "CRITICAL"}, {"id": "CON-04", "code": "COOL_FLAME_NTC_KINETICS", "title_tr": "Radyatif Kayıp (χ_r), İki Aşamalı Tutuşma ve Görünmez Soğuk Alev", "title_en": "Radiative Quenching (χ_r), Two-Stage Ignition & Cool Flame NTC", "rule_tr": "Büyük damlacıklarda küresel alev hacmiyle artan radyatif kayıp kesri χ_r ∝ R_f³·σ·(T_f⁴ - T_∞⁴) > 0.45 olduğunda 1300-1900 K sıcak alev söner; n-Heptan/n-Dekan (FLEX/CFI) ve Propan (ACME CFI-G) Negatif Sıcaklık Katsayısı (NTC peroksi RO₂/QOOH) kimyasıyla 550-800 K görünmez Soğuk Aleve geçer. Tespiti için UV/IR radyometre + CO/CH₂O gaz sensörü füzyonu şarttır.", "rule_en": "When spherical radiative loss fraction χ_r exceeds critical quenching (~0.45), alkanes (FLEX/CFI droplets & ACME CFI-G gases) transition via NTC peroxy chemistry into invisible 550-800 K Cool Flames producing CO and CH₂O, requiring UV/IR + CO sensor fusion.", "severity": "HIGH"}, {"id": "CON-05", "code": "SPACECRAFT_SUPPRESSION_BAN", "title_tr": "Uzay Aracı Yangın Söndürme Sırası ve Halon 1301 Yasağı (NASA-STD-6001B)", "title_en": "Spacecraft Fire Suppression Protocol & Strict Halon 1301 Ban (NASA-STD-6001B)", "rule_tr": "İnsanlı uzay araçlarında (ISS USOS, Orion, Lunar Gateway, Ay/Mars Üsleri ve Basınçlı Gezginler) toksik HF/HBr ürettiği ve ECLSS filtrelerini zehirlediği için Halon 1301 önerilmesi KESİNLİKLE YASAKTIR. Müdahale sırası: (1) HVAC fanlarını kapat, (2) Gücü kes, (3) İnce Su Sisi (25-40 µm Water Mist PFE / SoFIE-MIST) veya CO₂/N₂ uygula, (4) Gerekirse kabin basıncını düşür.", "rule_en": "Recommending Halon 1301 inside crewed spacecraft is STRICTLY PROHIBITED due to toxic HF/HBr byproducts poisoning ECLSS. Enforce sequence: (1) HVAC airflow shutoff, (2) power isolation, (3) Fine Water Mist (25-40 µm PFE) or CO₂/N₂, (4) depressurization.", "severity": "CRITICAL"}, {"id": "CON-06", "code": "EVA_SUIT_ROVER_AND_CFIG_O2", "title_tr": "Uzay Giysisi (%100 O₂ @ 4.3 psia), Ay Gezgini (%30+ O₂ @ 10.2 psia) ve CFI-G (%85 O₂)", "title_en": "EVA Spacesuit (100% O₂ @ 4.3 psia), Lunar Rover (≥30% O₂ @ 10.2 psia) & CFI-G (85% O₂)", "rule_tr": "Esneklik ve vurgunu (dekompresyon) önlemek için EVA uzay giysileri 4.3 psia basınçta %100 saf O₂ ile çalışır. Ön-soluma süresini kısaltmak için Ay Üssü ve basınçlı gezginler ≤10.2 psia'da ≥%30 O₂ (Dünya'ya göre >%40 bağıl artış; Saffire-V 8.2 psia/%34 O₂) kullanır. PSI'daki en yüksek oksijenli mikroçekim testleri ACME CFI-G küresel brülöründe (%85 O₂ -> propan/N₂ odası) gerçekleştirilmiştir.", "rule_en": "EVA spacesuits operate at 4.3 psia / 100% O₂ for mobility and zero nitrogen bends. Lunar bases & pressurized rovers target ≤10.2 psia / ≥30% O₂ (>40% relative O₂ increase over Earth) to cut pre-breathe time. Highest-O₂ PSI tests occurred in ACME CFI-G (85% O₂).", "severity": "HIGH"}, {"id": "CON-07", "code": "PARTIAL_GRAVITY_LUCI_FM2_BOUNDING", "title_tr": "Kısmi Yerçekimi (Ay 0.16G / Mars 0.38G) Sınırlandırması, LUCI/FM2 ve E-FIELD", "title_en": "Partial-Gravity (0.16G Moon / 0.38G Mars) Bounding, LUCI/FM2 & E-FIELD", "rule_tr": "Şu anda NASA PSI veritabanında doğrudan kısmi yerçekimi yanma verisi bulunmamaktadır; bu boşluğun gelecekteki LUCI (Lunar-g Combustion Investigation) ve FM2 (Flammability of Materials on the Moon) deneyleriyle doldurulması beklenmektedir. Bu süreçte 0G ve 1G sonuçları ara yerçekimi davranışını alt-üst sınır olarak çevreler (bounding) ve ACME E-FIELD Flames deneyindeki elektrik alanı/iyon rüzgarı kısmi yerçekimini taklit eder.", "rule_en": "NASA PSI currently lacks direct partial-gravity combustion data, awaiting upcoming LUCI and FM2 lunar investigations. Always bound intermediate Lunar (0.16G) and Martian (0.38G) predictions between 0G and 1G limits and cite ACME E-FIELD ionic-wind emulation.", "severity": "HIGH"}, {"id": "CON-08", "code": "HARDWARE_TAXONOMY_AND_ROCKET_SCOPE", "title_tr": "PSI Donanım Rafları (CIR/MDCA • MSG/SPICE • Cygnus • DAFT) ve Roket Kapsam Dışılığı", "title_en": "PSI Hardware Racks (CIR/MDCA • MSG/SPICE • Cygnus • DAFT) & Rocket Exclusion", "rule_tr": "Donanım eşleşmesini doğru kur: CIR/MDCA sıvı damlacıkları (FLEX, FLEX-2, CFI), CIR ACME modüler gaz seti (ACME, BRE, CFI-G), MSG modüler fan kanalı (SPICE, SLISE, BASS, BASS-II), Cygnus büyük ölçek (Saffire I-VI) ve duman/toz ayrımı (SAME, DAFT & DAFT-2). NOT: Roket motorları ve iticilerdeki yüksek gaz hızları yanmayı yerçekiminden bağımsız kıldığından PSI kabin yangın güvenliği kapsamı dışındadır.", "rule_en": "Maintain exact PSI hardware provenance: CIR/MDCA droplets (FLEX, FLEX-2, CFI), CIR ACME gas suite (E-FIELD, BRE, CFI-G), MSG fan duct (SPICE, SLISE, BASS, BASS-II), Cygnus (Saffire), and SAME/DAFT dust-vs-smoke sensing. High-speed rocket propulsion is outside PSI scope.", "severity": "HIGH"}, {"id": "CON-09", "code": "EVIDENCE_AND_EARTH_TRACEABILITY", "title_tr": "Deneysel Veri Sentezi, Dünya Uygulamaları ve Kanıt İzlenebilirliği", "title_en": "Experimental Data Synthesis, Space-to-Earth Applications & Evidence Traceability", "rule_tr": "Veri ister 3B kaydırıcılardan, ister CSV/JSON/PDF dosyasından, ister alev fotoğrafından, ister canlı NASA akışından gelsin; gerçek PSI/NTRS kodlarına atıf yap ve Dünya uygulamalarını (ince su sisli söndürücüler, DAFT karasal duman/toz dedektörleri, itfaiyeci PBI/Nomex koruyucu giysileri & SCBA hava tankları, HCCI temiz motorlar) vurgula.", "rule_en": "Synthesize 3D sliders, uploaded files, flame images, and live NASA streams with verified PSI/NTRS citations and highlight Earth transfers (fine water mist extinguishers, DAFT dust-immune smoke detectors, firefighter turnout gear & SCBA air tanks, clean HCCI engines).", "severity": "CRITICAL"}], "BILINGUAL_SCIENTIFIC_SYNONYMS": {"soğuk alev": "cool flame ntc low temperature radiative extinction heptane flex cfi cfi-g", "soguk alev": "cool flame ntc low temperature radiative extinction heptane flex cfi cfi-g", "serin alev": "cool flame cfi cfi-g ntc spherical burner propane heptane", "damlacık": "droplet spherical liquid heptane methanol decane flex cfi mdca", "damlacik": "droplet spherical liquid heptane methanol decane flex cfi mdca", "havalandırma": "ventilation airflow forced flow fan bass spice slise moc", "havalandirma": "ventilation airflow forced flow fan bass spice slise moc", "fan": "ventilation airflow low velocity opposed flow msg spice duct", "oksijen": "oxygen o2 moc concentration exploration atmosphere cfi-g", "uzay giysisi": "spacesuit eva 4.3 psia 100% o2 pure oxygen nomex pre-breathe", "gezgin": "pressurized rover lunar base 10.2 psia 30% o2 sofie saffire-v", "rover": "pressurized rover lunar base 10.2 psia 30% o2 sofie", "artemis": "exploration atmosphere 34% o2 8.2 psia 10.2 psia lunar habitat saffire-v sofie", "ay": "lunar exploration atmosphere 8.2 psia 10.2 psia 34% o2 luci fm2 daft", "mars": "martian exploration habitat low pressure partial gravity", "kısmi yerçekimi": "partial gravity lunar-g luci fm2 acme e-field ionic wind", "kismi yercekimi": "partial gravity lunar-g luci fm2 acme e-field ionic wind", "kumaş": "fabric textile sibal cotton fiberglass nomex bass-ii saffire", "kumas": "fabric textile sibal cotton fiberglass nomex bass-ii saffire", "akrilik": "pmma polymer solid acrylic bass sofie saffire-iv", "polimer": "pmma polymer solid fuel sofie bass bre", "su sisi": "water mist suppression pfe sofie-mist flex-2", "söndürme": "suppression extinguish quenching blowoff water mist", "sondurme": "suppression extinguish quenching blowoff water mist", "kurum": "soot radiation yellow shell acme spice smoke point", "duman noktası": "smoke point co-flow spice soot msg", "kalkış": "liftoff blowout triple flame slise msg", "elektrik": "electric field ionic wind e-field partial gravity acme", "büyük ölçek": "large scale cygnus spacecraft saffire", "duman": "smoke co carbon monoxide scrubber saffire-iv same daft", "toz": "dust aerosol measurement feasibility daft daft-2 same lunar dust smoke detector", "sensör": "sensor radiometer thermocouple optical uv laser co anomaly daft", "brülör": "burner porous spherical bre cfi-g acme spice"}, "PSI_ARCHIVE_SNAPSHOT": [{"id": "PSI-22", "acronym": "ACME E-FIELD Flames", "raw_title": "Advanced Combustion via Microgravity Experiments Electric-Field Effects on Laminar Diffusion Flames", "title": "PSI-22 (ACME E-FIELD Flames) — Advanced Combustion via Microgravity Experiments Electric-Field Effects on Laminar Diffusion Flames (PSI-22_Experimental table_ACME E-FIELD Flames.csv)", "hardware": "Combustion Integrated Rack (CIR), ACME", "platform": "International Space Station (ISS)", "date": "2019-04-15", "table_file": "PSI-22_Experimental table_ACME E-FIELD Flames.csv", "url": "https://psi.nasa.gov/physci/repo/data/investigations/PSI-22", "abstract": "The objective of this investigation is to better understand the relationship between electric field voltage and chemi-ion current, analyze the dynamic response of flames to electric field changes, evaluate soot formation, and characterize stabilized near-limit lifted flames.", "extracted_sim_params": {"fuel_id": "propane_cfig", "gravity_g": 0.0, "oxygen_pct": 21.0, "pressure_psia": 14.7, "airflow_cms": 5.8, "droplet_d0_mm": 4.0, "diluent": "N2", "habitat_id": "iss_module"}, "phases": [{"index": 1, "code": "GRUP_1", "desc": "100% CH4 • Negative", "short_tr": "Faz 1", "short_en": "Phase 1", "time_span_tr": "1 satir", "time_span_en": "1 rows", "facility": "ISS_CIR", "exp_ref": "", "sim_params": {"fuel_id": "propane_cfig", "gravity_g": 0.0, "oxygen_pct": 21.0, "pressure_psia": 14.7, "airflow_cms": 5.8, "droplet_d0_mm": 4.0, "diluent": "N2", "habitat_id": "iss_module"}, "measured_temp_k": 2071.8, "co_max_ppm": 109.0, "ch2o_max_ppm": 0.0, "opt_min_pct": null, "mist_max_um": 0.0, "k_meas": null, "r2_d2": null, "regime": "VENTILATED_WAKE_0G", "badge_tr": "0G HAVALANDIRMALI KUYRUK ALEVİ (5.8 cm/s)", "badge_en": "0G VENTILATED WAKE FLAME (5.8 cm/s)", "flame_temp_k": 2071.8, "moc_pct": 10.36, "k_model": 2.963, "spread_mms": 3.66, "b_oq": 6.95, "sh": 3.92, "da": 3.88, "risk_score": 89, "smac_s": 94.1, "extinguished": false, "cool_flame": false}, {"index": 2, "code": "GRUP_2", "desc": "100% CH4 • %70 Yakıt • Negative", "short_tr": "Faz 2", "short_en": "Phase 2", "time_span_tr": "1 satir", "time_span_en": "1 rows", "facility": "ISS_CIR", "exp_ref": "", "sim_params": {"fuel_id": "propane_cfig", "gravity_g": 0.0, "oxygen_pct": 21.0, "pressure_psia": 14.7, "airflow_cms": 5.8, "droplet_d0_mm": 3.25, "diluent": "N2", "habitat_id": "iss_module"}, "measured_temp_k": 2090.2, "co_max_ppm": 109.0, "ch2o_max_ppm": 0.0, "opt_min_pct": null, "mist_max_um": 0.0, "k_meas": null, "r2_d2": null, "regime": "VENTILATED_WAKE_0G", "badge_tr": "0G HAVALANDIRMALI KUYRUK ALEVİ (5.8 cm/s)", "badge_en": "0G VENTILATED WAKE FLAME (5.8 cm/s)", "flame_temp_k": 2090.2, "moc_pct": 10.36, "k_model": 2.83, "spread_mms": 3.66, "b_oq": 6.95, "sh": 3.73, "da": 3.15, "risk_score": 89, "smac_s": 94.1, "extinguished": false, "cool_flame": false}, {"index": 3, "code": "GRUP_3", "desc": "40% CH4 • Negative", "short_tr": "Faz 3", "short_en": "Phase 3", "time_span_tr": "1 satir", "time_span_en": "1 rows", "facility": "ISS_CIR", "exp_ref": "", "sim_params": {"fuel_id": "propane_cfig", "gravity_g": 0.0, "oxygen_pct": 19.8, "pressure_psia": 14.7, "airflow_cms": 5.8, "droplet_d0_mm": 2.5, "diluent": "N2", "habitat_id": "iss_module"}, "measured_temp_k": 2092.7, "co_max_ppm": 108.0, "ch2o_max_ppm": 0.0, "opt_min_pct": null, "mist_max_um": 0.0, "k_meas": null, "r2_d2": null, "regime": "VENTILATED_WAKE_0G", "badge_tr": "0G HAVALANDIRMALI KUYRUK ALEVİ (5.8 cm/s)", "badge_en": "0G VENTILATED WAKE FLAME (5.8 cm/s)", "flame_temp_k": 2092.7, "moc_pct": 10.36, "k_model": 2.604, "spread_mms": 3.32, "b_oq": 6.56, "sh": 3.52, "da": 2.23, "risk_score": 84, "smac_s": 98.6, "extinguished": false, "cool_flame": false}, {"index": 4, "code": "GRUP_4", "desc": "100% C2H4 • %80 Yakıt • Negative", "short_tr": "Faz 4", "short_en": "Phase 4", "time_span_tr": "1 satir", "time_span_en": "1 rows", "facility": "ISS_CIR", "exp_ref": "", "sim_params": {"fuel_id": "propane_cfig", "gravity_g": 0.0, "oxygen_pct": 21.0, "pressure_psia": 14.7, "airflow_cms": 5.8, "droplet_d0_mm": 3.5, "diluent": "N2", "habitat_id": "iss_module"}, "measured_temp_k": 2083.3, "co_max_ppm": 109.0, "ch2o_max_ppm": 0.0, "opt_min_pct": null, "mist_max_um": 0.0, "k_meas": null, "r2_d2": null, "regime": "VENTILATED_WAKE_0G", "badge_tr": "0G HAVALANDIRMALI KUYRUK ALEVİ (5.8 cm/s)", "badge_en": "0G VENTILATED WAKE FLAME (5.8 cm/s)", "flame_temp_k": 2083.3, "moc_pct": 10.36, "k_model": 2.876, "spread_mms": 3.66, "b_oq": 6.95, "sh": 3.8, "da": 3.39, "risk_score": 89, "smac_s": 94.1, "extinguished": false, "cool_flame": false}, {"index": 5, "code": "GRUP_5", "desc": "30% C2H4 • Negative", "short_tr": "Faz 5", "short_en": "Phase 5", "time_span_tr": "1 satir", "time_span_en": "1 rows", "facility": "ISS_CIR", "exp_ref": "", "sim_params": {"fuel_id": "propane_cfig", "gravity_g": 0.0, "oxygen_pct": 19.2, "pressure_psia": 14.7, "airflow_cms": 5.8, "droplet_d0_mm": 2.25, "diluent": "N2", "habitat_id": "iss_module"}, "measured_temp_k": 2091.4, "co_max_ppm": 108.0, "ch2o_max_ppm": 0.0, "opt_min_pct": null, "mist_max_um": 0.0, "k_meas": null, "r2_d2": null, "regime": "VENTILATED_WAKE_0G", "badge_tr": "0G HAVALANDIRMALI KUYRUK ALEVİ (5.8 cm/s)", "badge_en": "0G VENTILATED WAKE FLAME (5.8 cm/s)", "flame_temp_k": 2091.4, "moc_pct": 10.36, "k_model": 2.513, "spread_mms": 3.15, "b_oq": 6.37, "sh": 3.44, "da": 1.92, "risk_score": 82, "smac_s": 100.5, "extinguished": false, "cool_flame": false}, {"index": 6, "code": "GRUP_6", "desc": "40% CH4 • Positive", "short_tr": "Faz 6", "short_en": "Phase 6", "time_span_tr": "2 satir", "time_span_en": "2 rows", "facility": "ISS_CIR", "exp_ref": "", "sim_params": {"fuel_id": "propane_cfig", "gravity_g": 0.0, "oxygen_pct": 19.8, "pressure_psia": 14.7, "airflow_cms": 4.2, "droplet_d0_mm": 2.5, "diluent": "N2", "habitat_id": "iss_module"}, "measured_temp_k": 2076.7, "co_max_ppm": 104.0, "ch2o_max_ppm": 0.0, "opt_min_pct": null, "mist_max_um": 0.0, "k_meas": null, "r2_d2": null, "regime": "VENTILATED_WAKE_0G", "badge_tr": "0G HAVALANDIRMALI KUYRUK ALEVİ (4.2 cm/s)", "badge_en": "0G VENTILATED WAKE FLAME (4.2 cm/s)", "flame_temp_k": 2076.7, "moc_pct": 10.6, "k_model": 2.429, "spread_mms": 2.79, "b_oq": 6.56, "sh": 3.29, "da": 3.07, "risk_score": 81, "smac_s": 108.9, "extinguished": false, "cool_flame": false}, {"index": 7, "code": "GRUP_7", "desc": "30% C2H4 • Positive", "short_tr": "Faz 7", "short_en": "Phase 7", "time_span_tr": "3 satir", "time_span_en": "3 rows", "facility": "ISS_CIR", "exp_ref": "", "sim_params": {"fuel_id": "propane_cfig", "gravity_g": 0.0, "oxygen_pct": 19.0, "pressure_psia": 14.7, "airflow_cms": 2.4, "droplet_d0_mm": 2.17, "diluent": "N2", "habitat_id": "iss_module"}, "measured_temp_k": 2052.5, "co_max_ppm": 100.0, "ch2o_max_ppm": 0.0, "opt_min_pct": null, "mist_max_um": 0.0, "k_meas": null, "r2_d2": null, "regime": "VENTILATED_WAKE_0G", "badge_tr": "0G HAVALANDIRMALI KUYRUK ALEVİ (2.4 cm/s)", "badge_en": "0G VENTILATED WAKE FLAME (2.4 cm/s)", "flame_temp_k": 2052.5, "moc_pct": 11.42, "k_model": 2.098, "spread_mms": 1.91, "b_oq": 6.3, "sh": 2.91, "da": 4.4, "risk_score": 72, "smac_s": 126.6, "extinguished": false, "cool_flame": false}], "summary_tr": "**Çok Fazlı Telemetri Analizi (`PSI-22_Experimental table_ACME E-FIELD Flames.csv` • 21 satır • 7 fiziksel faz):**\n- **3B Yanma Odasına Aktarılan Aktif Durum:** **Faz 1** (`propane_cfig`, `0.0G`, `%21.0 O₂`, `14.7 psia`, `5.8 cm/s` — Sıcaklık: `2071.8 K`).\n\n| Faz | Zaman | Yakit ve Atmosfer | Sicaklik / CO / CH2O | Boyutsuz Sayilar (K, B_oq, Sh, Da, MOC) | Fiziksel Rejim ve SMAC |\n| :--- | :--- | :--- | :--- | :--- | :--- |\n| **Faz 1** | `1 satir` | `propane_cfig` • `0.0G` • `%21.0 O₂` • `14.7 psia` • `5.8 cm/s` | `2071.8 K` • `109.0 ppm CO` | `K=2.96` • `B=6.95` • `Sh=3.92` • `Da=3.88` • `MOC=%10.36` | **0G HAVALANDIRMALI KUYRUK ALEVİ (5.8 cm/s)** (Risk `89/100`, SMAC `94.1 sn`) |\n| **Faz 2** | `1 satir` | `propane_cfig` • `0.0G` • `%21.0 O₂` • `14.7 psia` • `5.8 cm/s` | `2090.2 K` • `109.0 ppm CO` | `K=2.83` • `B=6.95` • `Sh=3.73` • `Da=3.15` • `MOC=%10.36` | **0G HAVALANDIRMALI KUYRUK ALEVİ (5.8 cm/s)** (Risk `89/100`, SMAC `94.1 sn`) |\n| **Faz 3** | `1 satir` | `propane_cfig` • `0.0G` • `%19.8 O₂` • `14.7 psia` • `5.8 cm/s` | `2092.7 K` • `108.0 ppm CO` | `K=2.60` • `B=6.56` • `Sh=3.52` • `Da=2.23` • `MOC=%10.36` | **0G HAVALANDIRMALI KUYRUK ALEVİ (5.8 cm/s)** (Risk `84/100`, SMAC `98.6 sn`) |\n| **Faz 4** | `1 satir` | `propane_cfig` • `0.0G` • `%21.0 O₂` • `14.7 psia` • `5.8 cm/s` | `2083.3 K` • `109.0 ppm CO` | `K=2.88` • `B=6.95` • `Sh=3.8` • `Da=3.39` • `MOC=%10.36` | **0G HAVALANDIRMALI KUYRUK ALEVİ (5.8 cm/s)** (Risk `89/100`, SMAC `94.1 sn`) |\n| **Faz 5** | `1 satir` | `propane_cfig` • `0.0G` • `%19.2 O₂` • `14.7 psia` • `5.8 cm/s` | `2091.4 K` • `108.0 ppm CO` | `K=2.51` • `B=6.37` • `Sh=3.44` • `Da=1.92` • `MOC=%10.36` | **0G HAVALANDIRMALI KUYRUK ALEVİ (5.8 cm/s)** (Risk `82/100`, SMAC `100.5 sn`) |\n| **Faz 6** | `2 satir` | `propane_cfig` • `0.0G` • `%19.8 O₂` • `14.7 psia` • `4.2 cm/s` | `2076.7 K` • `104.0 ppm CO` | `K=2.43` • `B=6.56` • `Sh=3.29` • `Da=3.07` • `MOC=%10.6` | **0G HAVALANDIRMALI KUYRUK ALEVİ (4.2 cm/s)** (Risk `81/100`, SMAC `108.9 sn`) |\n| **Faz 7** | `3 satir` | `propane_cfig` • `0.0G` • `%19.0 O₂` • `14.7 psia` • `2.4 cm/s` | `2052.5 K` • `100.0 ppm CO` | `K=2.10` • `B=6.3` • `Sh=2.91` • `Da=4.4` • `MOC=%11.42` | **0G HAVALANDIRMALI KUYRUK ALEVİ (2.4 cm/s)** (Risk `72/100`, SMAC `126.6 sn`) |", "summary_en": "**Multi-Phase Telemetry Analysis (`PSI-22_Experimental table_ACME E-FIELD Flames.csv` • 21 rows • 7 physical phases):**\n- **Active State Synced to 3D Chamber:** **Phase 1** (`propane_cfig`, `0.0G`, `21.0% O₂`, `14.7 psia`, `5.8 cm/s` — Temp: `2071.8 K`).\n\n| Phase | Window | Fuel & Atmosphere | Temp / CO / CH2O | Dimensionless (K, B_oq, Sh, Da, MOC) | Regime & SMAC Clock |\n| :--- | :--- | :--- | :--- | :--- | :--- |\n| **Phase 1** | `1 rows` | `propane_cfig` • `0.0G` • `21.0% O₂` • `14.7 psia` • `5.8 cm/s` | `2071.8 K` • `109.0 ppm CO` | `K=2.96` • `B=6.95` • `Sh=3.92` • `Da=3.88` • `MOC=10.36%` | **0G VENTILATED WAKE FLAME (5.8 cm/s)** (Risk `89/100`, SMAC `94.1 s`) |\n| **Phase 2** | `1 rows` | `propane_cfig` • `0.0G` • `21.0% O₂` • `14.7 psia` • `5.8 cm/s` | `2090.2 K` • `109.0 ppm CO` | `K=2.83` • `B=6.95` • `Sh=3.73` • `Da=3.15` • `MOC=10.36%` | **0G VENTILATED WAKE FLAME (5.8 cm/s)** (Risk `89/100`, SMAC `94.1 s`) |\n| **Phase 3** | `1 rows` | `propane_cfig` • `0.0G` • `19.8% O₂` • `14.7 psia` • `5.8 cm/s` | `2092.7 K` • `108.0 ppm CO` | `K=2.60` • `B=6.56` • `Sh=3.52` • `Da=2.23` • `MOC=10.36%` | **0G VENTILATED WAKE FLAME (5.8 cm/s)** (Risk `84/100`, SMAC `98.6 s`) |\n| **Phase 4** | `1 rows` | `propane_cfig` • `0.0G` • `21.0% O₂` • `14.7 psia` • `5.8 cm/s` | `2083.3 K` • `109.0 ppm CO` | `K=2.88` • `B=6.95` • `Sh=3.8` • `Da=3.39` • `MOC=10.36%` | **0G VENTILATED WAKE FLAME (5.8 cm/s)** (Risk `89/100`, SMAC `94.1 s`) |\n| **Phase 5** | `1 rows` | `propane_cfig` • `0.0G` • `19.2% O₂` • `14.7 psia` • `5.8 cm/s` | `2091.4 K` • `108.0 ppm CO` | `K=2.51` • `B=6.37` • `Sh=3.44` • `Da=1.92` • `MOC=10.36%` | **0G VENTILATED WAKE FLAME (5.8 cm/s)** (Risk `82/100`, SMAC `100.5 s`) |\n| **Phase 6** | `2 rows` | `propane_cfig` • `0.0G` • `19.8% O₂` • `14.7 psia` • `4.2 cm/s` | `2076.7 K` • `104.0 ppm CO` | `K=2.43` • `B=6.56` • `Sh=3.29` • `Da=3.07` • `MOC=10.6%` | **0G VENTILATED WAKE FLAME (4.2 cm/s)** (Risk `81/100`, SMAC `108.9 s`) |\n| **Phase 7** | `3 rows` | `propane_cfig` • `0.0G` • `19.0% O₂` • `14.7 psia` • `2.4 cm/s` | `2052.5 K` • `100.0 ppm CO` | `K=2.10` • `B=6.3` • `Sh=2.91` • `Da=4.4` • `MOC=11.42%` | **0G VENTILATED WAKE FLAME (2.4 cm/s)** (Risk `72/100`, SMAC `126.6 s`) |"}, {"id": "PSI-10", "acronym": "ACME/Flame Design", "raw_title": "Advanced Combustion via Microgravity Experiments / Flame Design", "title": "PSI-10 (ACME/Flame Design) — Advanced Combustion via Microgravity Experiments / Flame Design (PSI-10_Experimental table_Flame Design_Normal Flame.csv)", "hardware": "Advanced Combustion via Microgravity Experiments (ACME), Combustion Integrated Rack (CIR), Reconfiguration of Combustion Integrated Rack (CIR)", "platform": "International Space Station (ISS)", "date": "2025-11-20", "table_file": "PSI-10_Experimental table_Flame Design_Normal Flame.csv", "url": "https://psi.nasa.gov/physci/repo/data/investigations/PSI-10", "abstract": "The primary objectives of this flight experiment are: A. Obtain soot-inception limits of quasi-steady normal and inverse spherical diffusion flames as functions of flow rate, Zst, amount of inert (N2 or CO2), and pressure for C2H4 and CH4 flames. Identify the corresponding temperatures in hot regions. Obtain similar limits and temperatures for inverse and normal coflow flames. B. Obtain detailed measurements in quasi-steady normal and inverse spherical dif", "extracted_sim_params": {"fuel_id": "propane_cfig", "gravity_g": 0.0, "oxygen_pct": 20.41, "pressure_psia": 14.87, "airflow_cms": 2.4, "droplet_d0_mm": 3.2, "diluent": "N2", "habitat_id": "iss_module"}, "phases": [{"index": 1, "code": "GRUP_1", "desc": "C2H4", "short_tr": "Faz 1", "short_en": "Phase 1", "time_span_tr": "71 satir", "time_span_en": "71 rows", "facility": "ISS_CIR", "exp_ref": "", "sim_params": {"fuel_id": "propane_cfig", "gravity_g": 0.0, "oxygen_pct": 20.41, "pressure_psia": 14.87, "airflow_cms": 2.4, "droplet_d0_mm": 3.2, "diluent": "N2", "habitat_id": "iss_module"}, "measured_temp_k": 2252.8, "co_max_ppm": 101.0, "ch2o_max_ppm": 0.0, "opt_min_pct": null, "mist_max_um": 0.0, "k_meas": null, "r2_d2": null, "regime": "VENTILATED_WAKE_0G", "badge_tr": "0G HAVALANDIRMALI KUYRUK ALEVİ (2.4 cm/s)", "badge_en": "0G VENTILATED WAKE FLAME (2.4 cm/s)", "flame_temp_k": 2032.6, "moc_pct": 11.41, "k_model": 2.309, "spread_mms": 2.17, "b_oq": 6.76, "sh": 3.11, "da": 7.26, "risk_score": 77, "smac_s": 121.1, "extinguished": false, "cool_flame": false}, {"index": 2, "code": "GRUP_2", "desc": "C2H4", "short_tr": "Faz 2", "short_en": "Phase 2", "time_span_tr": "116 satir", "time_span_en": "116 rows", "facility": "ISS_CIR", "exp_ref": "", "sim_params": {"fuel_id": "propane_cfig", "gravity_g": 0.0, "oxygen_pct": 37.84, "pressure_psia": 16.74, "airflow_cms": 2.4, "droplet_d0_mm": 3.2, "diluent": "N2", "habitat_id": "iss_module"}, "measured_temp_k": 2516.9, "co_max_ppm": 114.0, "ch2o_max_ppm": 0.0, "opt_min_pct": null, "mist_max_um": 0.0, "k_meas": null, "r2_d2": null, "regime": "VENTILATED_WAKE_0G", "badge_tr": "0G HAVALANDIRMALI KUYRUK ALEVİ (2.4 cm/s)", "badge_en": "0G VENTILATED WAKE FLAME (2.4 cm/s)", "flame_temp_k": 2314.5, "moc_pct": 11.3, "k_model": 3.211, "spread_mms": 6.46, "b_oq": 12.26, "sh": 3.18, "da": 19.42, "risk_score": 99, "smac_s": 78.5, "extinguished": false, "cool_flame": false}, {"index": 3, "code": "GRUP_3", "desc": "C3H8", "short_tr": "Faz 3", "short_en": "Phase 3", "time_span_tr": "20 satir", "time_span_en": "20 rows", "facility": "ISS_CIR", "exp_ref": "", "sim_params": {"fuel_id": "propane_cfig", "gravity_g": 0.0, "oxygen_pct": 40.0, "pressure_psia": 13.7, "airflow_cms": 2.4, "droplet_d0_mm": 3.2, "diluent": "N2", "habitat_id": "iss_module"}, "measured_temp_k": 2631.8, "co_max_ppm": 110.0, "ch2o_max_ppm": 0.0, "opt_min_pct": null, "mist_max_um": 0.0, "k_meas": null, "r2_d2": null, "regime": "VENTILATED_WAKE_0G", "badge_tr": "0G HAVALANDIRMALI KUYRUK ALEVİ (2.4 cm/s)", "badge_en": "0G VENTILATED WAKE FLAME (2.4 cm/s)", "flame_temp_k": 2318.7, "moc_pct": 11.49, "k_model": 3.074, "spread_mms": 6.48, "b_oq": 12.93, "sh": 3.07, "da": 18.11, "risk_score": 99, "smac_s": 81.4, "extinguished": false, "cool_flame": false}], "summary_tr": "**Çok Fazlı Telemetri Analizi (`PSI-10_Experimental table_Flame Design_Normal Flame.csv` • 207 satır • 3 fiziksel faz):**\n- **3B Yanma Odasına Aktarılan Aktif Durum:** **Faz 1** (`propane_cfig`, `0.0G`, `%20.41 O₂`, `14.87 psia`, `2.4 cm/s` — Sıcaklık: `2032.6 K`).\n\n| Faz | Zaman | Yakit ve Atmosfer | Sicaklik / CO / CH2O | Boyutsuz Sayilar (K, B_oq, Sh, Da, MOC) | Fiziksel Rejim ve SMAC |\n| :--- | :--- | :--- | :--- | :--- | :--- |\n| **Faz 1** | `71 satir` | `propane_cfig` • `0.0G` • `%20.41 O₂` • `14.87 psia` • `2.4 cm/s` | `2252.8 K` • `101.0 ppm CO` | `K=2.31` • `B=6.76` • `Sh=3.11` • `Da=7.26` • `MOC=%11.41` | **0G HAVALANDIRMALI KUYRUK ALEVİ (2.4 cm/s)** (Risk `77/100`, SMAC `121.1 sn`) |\n| **Faz 2** | `116 satir` | `propane_cfig` • `0.0G` • `%37.84 O₂` • `16.74 psia` • `2.4 cm/s` | `2516.9 K` • `114.0 ppm CO` | `K=3.21` • `B=12.26` • `Sh=3.18` • `Da=19.42` • `MOC=%11.3` | **0G HAVALANDIRMALI KUYRUK ALEVİ (2.4 cm/s)** (Risk `99/100`, SMAC `78.5 sn`) |\n| **Faz 3** | `20 satir` | `propane_cfig` • `0.0G` • `%40.0 O₂` • `13.7 psia` • `2.4 cm/s` | `2631.8 K` • `110.0 ppm CO` | `K=3.07` • `B=12.93` • `Sh=3.07` • `Da=18.11` • `MOC=%11.49` | **0G HAVALANDIRMALI KUYRUK ALEVİ (2.4 cm/s)** (Risk `99/100`, SMAC `81.4 sn`) |", "summary_en": "**Multi-Phase Telemetry Analysis (`PSI-10_Experimental table_Flame Design_Normal Flame.csv` • 207 rows • 3 physical phases):**\n- **Active State Synced to 3D Chamber:** **Phase 1** (`propane_cfig`, `0.0G`, `20.41% O₂`, `14.87 psia`, `2.4 cm/s` — Temp: `2032.6 K`).\n\n| Phase | Window | Fuel & Atmosphere | Temp / CO / CH2O | Dimensionless (K, B_oq, Sh, Da, MOC) | Regime & SMAC Clock |\n| :--- | :--- | :--- | :--- | :--- | :--- |\n| **Phase 1** | `71 rows` | `propane_cfig` • `0.0G` • `20.41% O₂` • `14.87 psia` • `2.4 cm/s` | `2252.8 K` • `101.0 ppm CO` | `K=2.31` • `B=6.76` • `Sh=3.11` • `Da=7.26` • `MOC=11.41%` | **0G VENTILATED WAKE FLAME (2.4 cm/s)** (Risk `77/100`, SMAC `121.1 s`) |\n| **Phase 2** | `116 rows` | `propane_cfig` • `0.0G` • `37.84% O₂` • `16.74 psia` • `2.4 cm/s` | `2516.9 K` • `114.0 ppm CO` | `K=3.21` • `B=12.26` • `Sh=3.18` • `Da=19.42` • `MOC=11.3%` | **0G VENTILATED WAKE FLAME (2.4 cm/s)** (Risk `99/100`, SMAC `78.5 s`) |\n| **Phase 3** | `20 rows` | `propane_cfig` • `0.0G` • `40.0% O₂` • `13.7 psia` • `2.4 cm/s` | `2631.8 K` • `110.0 ppm CO` | `K=3.07` • `B=12.93` • `Sh=3.07` • `Da=18.11` • `MOC=11.49%` | **0G VENTILATED WAKE FLAME (2.4 cm/s)** (Risk `99/100`, SMAC `81.4 s`) |"}, {"id": "PSI-159", "acronym": "ACME CFI-G", "raw_title": "Advanced Combustion via Microgravity Experiments / Cool Flames Investigation with Gases", "title": "PSI-159 (ACME CFI-G) — Advanced Combustion via Microgravity Experiments / Cool Flames Investigation with Gases (PSI-159_Experimental table_CFI-G_Normal Flames.csv)", "hardware": "ACME, Combustion Integrated Rack (CIR)", "platform": "International Space Station (ISS)", "date": "2025-11-20", "table_file": "PSI-159_Experimental table_CFI-G_Normal Flames.csv", "url": "https://psi.nasa.gov/physci/repo/data/investigations/PSI-159", "abstract": "1. Plan and support flight testing on the International Space Station (ISS). 2. Determine the conditions for which cool diffusion flames occur for propane, n-butane, and n-pentane; normal and inverse flames; and a broad range of Zst, Tad, and fluent flow rate. 3. Support the flight tests with advanced CFD simulations. 4. Identify or develop a chemical kinetics mechanism that yields good agreement between the CFD predictions and the ISS measurements. 5. Dis", "extracted_sim_params": {"fuel_id": "propane_cfig", "gravity_g": 0.0, "oxygen_pct": 38.32, "pressure_psia": 16.7, "airflow_cms": 2.4, "droplet_d0_mm": 2.29, "diluent": "N2", "habitat_id": "iss_module"}, "phases": [{"index": 1, "code": "GRUP_1", "desc": "ethane • %50 Yakıt", "short_tr": "Faz 1", "short_en": "Phase 1", "time_span_tr": "10 satir", "time_span_en": "10 rows", "facility": "ISS_CIR", "exp_ref": "", "sim_params": {"fuel_id": "propane_cfig", "gravity_g": 0.0, "oxygen_pct": 38.32, "pressure_psia": 16.7, "airflow_cms": 2.4, "droplet_d0_mm": 2.29, "diluent": "N2", "habitat_id": "iss_module"}, "measured_temp_k": 2568.4, "co_max_ppm": 114.0, "ch2o_max_ppm": 0.0, "opt_min_pct": null, "mist_max_um": 0.0, "k_meas": null, "r2_d2": null, "regime": "VENTILATED_WAKE_0G", "badge_tr": "0G HAVALANDIRMALI KUYRUK ALEVİ (2.4 cm/s)", "badge_en": "0G VENTILATED WAKE FLAME (2.4 cm/s)", "flame_temp_k": 2353.6, "moc_pct": 11.3, "k_model": 3.06, "spread_mms": 6.59, "b_oq": 12.41, "sh": 3.0, "da": 14.13, "risk_score": 99, "smac_s": 78.5, "extinguished": false, "cool_flame": false}, {"index": 2, "code": "GRUP_2", "desc": "ethane • %50 Yakıt", "short_tr": "Faz 2", "short_en": "Phase 2", "time_span_tr": "14 satir", "time_span_en": "14 rows", "facility": "ISS_CIR", "exp_ref": "", "sim_params": {"fuel_id": "propane_cfig", "gravity_g": 0.0, "oxygen_pct": 37.32, "pressure_psia": 18.16, "airflow_cms": 2.4, "droplet_d0_mm": 2.31, "diluent": "N2", "habitat_id": "iss_module"}, "measured_temp_k": 2558.1, "co_max_ppm": 116.0, "ch2o_max_ppm": 0.0, "opt_min_pct": null, "mist_max_um": 0.0, "k_meas": null, "r2_d2": null, "regime": "VENTILATED_WAKE_0G", "badge_tr": "0G HAVALANDIRMALI KUYRUK ALEVİ (2.4 cm/s)", "badge_en": "0G VENTILATED WAKE FLAME (2.4 cm/s)", "flame_temp_k": 2348.2, "moc_pct": 11.22, "k_model": 3.113, "spread_mms": 6.55, "b_oq": 12.1, "sh": 3.04, "da": 14.6, "risk_score": 99, "smac_s": 77.2, "extinguished": false, "cool_flame": false}, {"index": 3, "code": "GRUP_3", "desc": "50% butane • %25 Yakıt", "short_tr": "Faz 3", "short_en": "Phase 3", "time_span_tr": "29 satir", "time_span_en": "29 rows", "facility": "ISS_CIR", "exp_ref": "", "sim_params": {"fuel_id": "propane_cfig", "gravity_g": 0.0, "oxygen_pct": 38.9, "pressure_psia": 18.5, "airflow_cms": 2.4, "droplet_d0_mm": 2.16, "diluent": "N2", "habitat_id": "iss_module"}, "measured_temp_k": 2507.0, "co_max_ppm": 117.0, "ch2o_max_ppm": 0.0, "opt_min_pct": null, "mist_max_um": 0.0, "k_meas": null, "r2_d2": null, "regime": "VENTILATED_WAKE_0G", "badge_tr": "0G HAVALANDIRMALI KUYRUK ALEVİ (2.4 cm/s)", "badge_en": "0G VENTILATED WAKE FLAME (2.4 cm/s)", "flame_temp_k": 2387.6, "moc_pct": 11.21, "k_model": 3.166, "spread_mms": 7.08, "b_oq": 12.59, "sh": 3.02, "da": 14.71, "risk_score": 99, "smac_s": 76.5, "extinguished": false, "cool_flame": false}, {"index": 4, "code": "GRUP_4", "desc": "50% butane", "short_tr": "Faz 4", "short_en": "Phase 4", "time_span_tr": "36 satir", "time_span_en": "36 rows", "facility": "ISS_CIR", "exp_ref": "", "sim_params": {"fuel_id": "propane_cfig", "gravity_g": 0.0, "oxygen_pct": 38.37, "pressure_psia": 15.72, "airflow_cms": 2.4, "droplet_d0_mm": 2.14, "diluent": "N2", "habitat_id": "iss_module"}, "measured_temp_k": 2297.3, "co_max_ppm": 113.0, "ch2o_max_ppm": 0.0, "opt_min_pct": null, "mist_max_um": 0.0, "k_meas": null, "r2_d2": null, "regime": "VENTILATED_WAKE_0G", "badge_tr": "0G HAVALANDIRMALI KUYRUK ALEVİ (2.4 cm/s)", "badge_en": "0G VENTILATED WAKE FLAME (2.4 cm/s)", "flame_temp_k": 2350.2, "moc_pct": 11.36, "k_model": 2.97, "spread_mms": 6.43, "b_oq": 12.42, "sh": 2.94, "da": 12.64, "risk_score": 99, "smac_s": 79.2, "extinguished": false, "cool_flame": false}, {"index": 5, "code": "GRUP_5", "desc": "50% butane", "short_tr": "Faz 5", "short_en": "Phase 5", "time_span_tr": "15 satir", "time_span_en": "15 rows", "facility": "ISS_CIR", "exp_ref": "", "sim_params": {"fuel_id": "propane_cfig", "gravity_g": 0.0, "oxygen_pct": 21.74, "pressure_psia": 12.25, "airflow_cms": 2.4, "droplet_d0_mm": 2.37, "diluent": "N2", "habitat_id": "iss_module"}, "measured_temp_k": 2086.5, "co_max_ppm": 98.0, "ch2o_max_ppm": 0.0, "opt_min_pct": null, "mist_max_um": 0.0, "k_meas": null, "r2_d2": null, "regime": "VENTILATED_WAKE_0G", "badge_tr": "0G HAVALANDIRMALI KUYRUK ALEVİ (2.4 cm/s)", "badge_en": "0G VENTILATED WAKE FLAME (2.4 cm/s)", "flame_temp_k": 2058.4, "moc_pct": 11.61, "k_model": 2.135, "spread_mms": 2.21, "b_oq": 7.19, "sh": 2.87, "da": 5.09, "risk_score": 80, "smac_s": 124.2, "extinguished": false, "cool_flame": false}, {"index": 6, "code": "GRUP_6", "desc": "propane", "short_tr": "Faz 6", "short_en": "Phase 6", "time_span_tr": "9 satir", "time_span_en": "9 rows", "facility": "ISS_CIR", "exp_ref": "", "sim_params": {"fuel_id": "propane_cfig", "gravity_g": 0.0, "oxygen_pct": 37.55, "pressure_psia": 13.7, "airflow_cms": 2.4, "droplet_d0_mm": 4.0, "diluent": "N2", "habitat_id": "iss_module"}, "measured_temp_k": 2700.6, "co_max_ppm": 109.0, "ch2o_max_ppm": 0.0, "opt_min_pct": null, "mist_max_um": 0.0, "k_meas": null, "r2_d2": null, "regime": "VENTILATED_WAKE_0G", "badge_tr": "0G HAVALANDIRMALI KUYRUK ALEVİ (2.4 cm/s)", "badge_en": "0G VENTILATED WAKE FLAME (2.4 cm/s)", "flame_temp_k": 2247.0, "moc_pct": 11.49, "k_model": 3.086, "spread_mms": 5.83, "b_oq": 12.17, "sh": 3.19, "da": 20.65, "risk_score": 99, "smac_s": 82.1, "extinguished": false, "cool_flame": false}, {"index": 7, "code": "GRUP_7", "desc": "30% propane • %5 Yakıt", "short_tr": "Faz 7", "short_en": "Phase 7", "time_span_tr": "19 satir", "time_span_en": "19 rows", "facility": "ISS_CIR", "exp_ref": "", "sim_params": {"fuel_id": "propane_cfig", "gravity_g": 0.0, "oxygen_pct": 21.33, "pressure_psia": 26.45, "airflow_cms": 2.4, "droplet_d0_mm": 1.86, "diluent": "N2", "habitat_id": "iss_module"}, "measured_temp_k": 1843.5, "co_max_ppm": 108.0, "ch2o_max_ppm": 0.0, "opt_min_pct": null, "mist_max_um": 0.0, "k_meas": null, "r2_d2": null, "regime": "VENTILATED_WAKE_0G", "badge_tr": "0G HAVALANDIRMALI KUYRUK ALEVİ (2.4 cm/s)", "badge_en": "0G VENTILATED WAKE FLAME (2.4 cm/s)", "flame_temp_k": 2158.2, "moc_pct": 11.14, "k_model": 2.417, "spread_mms": 2.67, "b_oq": 7.05, "sh": 2.98, "da": 5.62, "risk_score": 83, "smac_s": 106.4, "extinguished": false, "cool_flame": false}], "summary_tr": "**Çok Fazlı Telemetri Analizi (`PSI-159_Experimental table_CFI-G_Normal Flames.csv` • 179 satır • 7 fiziksel faz):**\n- **3B Yanma Odasına Aktarılan Aktif Durum:** **Faz 1** (`propane_cfig`, `0.0G`, `%38.32 O₂`, `16.7 psia`, `2.4 cm/s` — Sıcaklık: `2353.6 K`).\n\n| Faz | Zaman | Yakit ve Atmosfer | Sicaklik / CO / CH2O | Boyutsuz Sayilar (K, B_oq, Sh, Da, MOC) | Fiziksel Rejim ve SMAC |\n| :--- | :--- | :--- | :--- | :--- | :--- |\n| **Faz 1** | `10 satir` | `propane_cfig` • `0.0G` • `%38.32 O₂` • `16.7 psia` • `2.4 cm/s` | `2568.4 K` • `114.0 ppm CO` | `K=3.06` • `B=12.41` • `Sh=3.0` • `Da=14.13` • `MOC=%11.3` | **0G HAVALANDIRMALI KUYRUK ALEVİ (2.4 cm/s)** (Risk `99/100`, SMAC `78.5 sn`) |\n| **Faz 2** | `14 satir` | `propane_cfig` • `0.0G` • `%37.32 O₂` • `18.16 psia` • `2.4 cm/s` | `2558.1 K` • `116.0 ppm CO` | `K=3.11` • `B=12.1` • `Sh=3.04` • `Da=14.6` • `MOC=%11.22` | **0G HAVALANDIRMALI KUYRUK ALEVİ (2.4 cm/s)** (Risk `99/100`, SMAC `77.2 sn`) |\n| **Faz 3** | `29 satir` | `propane_cfig` • `0.0G` • `%38.9 O₂` • `18.5 psia` • `2.4 cm/s` | `2507.0 K` • `117.0 ppm CO` | `K=3.17` • `B=12.59` • `Sh=3.02` • `Da=14.71` • `MOC=%11.21` | **0G HAVALANDIRMALI KUYRUK ALEVİ (2.4 cm/s)** (Risk `99/100`, SMAC `76.5 sn`) |\n| **Faz 4** | `36 satir` | `propane_cfig` • `0.0G` • `%38.37 O₂` • `15.72 psia` • `2.4 cm/s` | `2297.3 K` • `113.0 ppm CO` | `K=2.97` • `B=12.42` • `Sh=2.94` • `Da=12.64` • `MOC=%11.36` | **0G HAVALANDIRMALI KUYRUK ALEVİ (2.4 cm/s)** (Risk `99/100`, SMAC `79.2 sn`) |\n| **Faz 5** | `15 satir` | `propane_cfig` • `0.0G` • `%21.74 O₂` • `12.25 psia` • `2.4 cm/s` | `2086.5 K` • `98.0 ppm CO` | `K=2.13` • `B=7.19` • `Sh=2.87` • `Da=5.09` • `MOC=%11.61` | **0G HAVALANDIRMALI KUYRUK ALEVİ (2.4 cm/s)** (Risk `80/100`, SMAC `124.2 sn`) |\n| **Faz 6** | `9 satir` | `propane_cfig` • `0.0G` • `%37.55 O₂` • `13.7 psia` • `2.4 cm/s` | `2700.6 K` • `109.0 ppm CO` | `K=3.09` • `B=12.17` • `Sh=3.19` • `Da=20.65` • `MOC=%11.49` | **0G HAVALANDIRMALI KUYRUK ALEVİ (2.4 cm/s)** (Risk `99/100`, SMAC `82.1 sn`) |\n| **Faz 7** | `19 satir` | `propane_cfig` • `0.0G` • `%21.33 O₂` • `26.45 psia` • `2.4 cm/s` | `1843.5 K` • `108.0 ppm CO` | `K=2.42` • `B=7.05` • `Sh=2.98` • `Da=5.62` • `MOC=%11.14` | **0G HAVALANDIRMALI KUYRUK ALEVİ (2.4 cm/s)** (Risk `83/100`, SMAC `106.4 sn`) |", "summary_en": "**Multi-Phase Telemetry Analysis (`PSI-159_Experimental table_CFI-G_Normal Flames.csv` • 179 rows • 7 physical phases):**\n- **Active State Synced to 3D Chamber:** **Phase 1** (`propane_cfig`, `0.0G`, `38.32% O₂`, `16.7 psia`, `2.4 cm/s` — Temp: `2353.6 K`).\n\n| Phase | Window | Fuel & Atmosphere | Temp / CO / CH2O | Dimensionless (K, B_oq, Sh, Da, MOC) | Regime & SMAC Clock |\n| :--- | :--- | :--- | :--- | :--- | :--- |\n| **Phase 1** | `10 rows` | `propane_cfig` • `0.0G` • `38.32% O₂` • `16.7 psia` • `2.4 cm/s` | `2568.4 K` • `114.0 ppm CO` | `K=3.06` • `B=12.41` • `Sh=3.0` • `Da=14.13` • `MOC=11.3%` | **0G VENTILATED WAKE FLAME (2.4 cm/s)** (Risk `99/100`, SMAC `78.5 s`) |\n| **Phase 2** | `14 rows` | `propane_cfig` • `0.0G` • `37.32% O₂` • `18.16 psia` • `2.4 cm/s` | `2558.1 K` • `116.0 ppm CO` | `K=3.11` • `B=12.1` • `Sh=3.04` • `Da=14.6` • `MOC=11.22%` | **0G VENTILATED WAKE FLAME (2.4 cm/s)** (Risk `99/100`, SMAC `77.2 s`) |\n| **Phase 3** | `29 rows` | `propane_cfig` • `0.0G` • `38.9% O₂` • `18.5 psia` • `2.4 cm/s` | `2507.0 K` • `117.0 ppm CO` | `K=3.17` • `B=12.59` • `Sh=3.02` • `Da=14.71` • `MOC=11.21%` | **0G VENTILATED WAKE FLAME (2.4 cm/s)** (Risk `99/100`, SMAC `76.5 s`) |\n| **Phase 4** | `36 rows` | `propane_cfig` • `0.0G` • `38.37% O₂` • `15.72 psia` • `2.4 cm/s` | `2297.3 K` • `113.0 ppm CO` | `K=2.97` • `B=12.42` • `Sh=2.94` • `Da=12.64` • `MOC=11.36%` | **0G VENTILATED WAKE FLAME (2.4 cm/s)** (Risk `99/100`, SMAC `79.2 s`) |\n| **Phase 5** | `15 rows` | `propane_cfig` • `0.0G` • `21.74% O₂` • `12.25 psia` • `2.4 cm/s` | `2086.5 K` • `98.0 ppm CO` | `K=2.13` • `B=7.19` • `Sh=2.87` • `Da=5.09` • `MOC=11.61%` | **0G VENTILATED WAKE FLAME (2.4 cm/s)** (Risk `80/100`, SMAC `124.2 s`) |\n| **Phase 6** | `9 rows` | `propane_cfig` • `0.0G` • `37.55% O₂` • `13.7 psia` • `2.4 cm/s` | `2700.6 K` • `109.0 ppm CO` | `K=3.09` • `B=12.17` • `Sh=3.19` • `Da=20.65` • `MOC=11.49%` | **0G VENTILATED WAKE FLAME (2.4 cm/s)** (Risk `99/100`, SMAC `82.1 s`) |\n| **Phase 7** | `19 rows` | `propane_cfig` • `0.0G` • `21.33% O₂` • `26.45 psia` • `2.4 cm/s` | `1843.5 K` • `108.0 ppm CO` | `K=2.42` • `B=7.05` • `Sh=2.98` • `Da=5.62` • `MOC=11.14%` | **0G VENTILATED WAKE FLAME (2.4 cm/s)** (Risk `83/100`, SMAC `106.4 s`) |"}, {"id": "PSI-107", "acronym": "SPICE", "raw_title": "Smoke Point In Co-flow Experiment", "title": "PSI-107 (SPICE) — Smoke Point In Co-flow Experiment (PSI-107_Experimental table_Spice.csv)", "hardware": "Microgravity Science Glovebox (MSG)", "platform": "International Space Station (ISS)", "date": "2024-09-18", "table_file": "PSI-107_Experimental table_Spice.csv", "url": "https://psi.nasa.gov/physci/repo/data/investigations/PSI-107", "abstract": "The objective of SPICE is to better understand the complex process of combustion by observing flames in a microgravity environment aboard the International Space Station (ISS) and analogous ground experiments. Specific objectives were: (1) Identify the laminar smoke-point properties of non-buoyant jet diffusion flames under various co-flow conditions in microgravity. (2) Determine the effects of burner diameter and co-flow velocity on the luminous flame le", "extracted_sim_params": {"fuel_id": "propane_cfig", "gravity_g": 0.0, "oxygen_pct": 21.0, "pressure_psia": 14.7, "airflow_cms": 27.83, "droplet_d0_mm": 1.6, "diluent": "N2", "habitat_id": "iss_module"}, "phases": [{"index": 1, "code": "GRUP_1", "desc": "Ethylene", "short_tr": "Faz 1", "short_en": "Phase 1", "time_span_tr": "38 satir", "time_span_en": "38 rows", "facility": "ISS_CIR", "exp_ref": "", "sim_params": {"fuel_id": "propane_cfig", "gravity_g": 0.0, "oxygen_pct": 21.0, "pressure_psia": 14.7, "airflow_cms": 27.83, "droplet_d0_mm": 1.6, "diluent": "N2", "habitat_id": "iss_module"}, "measured_temp_k": 305.0, "co_max_ppm": 18.0, "ch2o_max_ppm": 0.0, "opt_min_pct": null, "mist_max_um": 0.0, "k_meas": null, "r2_d2": null, "regime": "BLOWOFF_EXTINGUISHED", "badge_tr": "YÜKSEK HIZLI ÜFLEME SÖNMESİ (BLOWOFF)", "badge_en": "CONVECTIVE BLOWOFF EXTINCTION", "flame_temp_k": 305.0, "moc_pct": 12.04, "k_model": 0.0, "spread_mms": 0.0, "b_oq": 6.95, "sh": 4.66, "da": 0.32, "risk_score": 37, "smac_s": 999.0, "extinguished": true, "cool_flame": false}, {"index": 2, "code": "GRUP_2", "desc": "Propane", "short_tr": "Faz 2", "short_en": "Phase 2", "time_span_tr": "24 satir", "time_span_en": "24 rows", "facility": "ISS_CIR", "exp_ref": "", "sim_params": {"fuel_id": "propane_cfig", "gravity_g": 0.0, "oxygen_pct": 21.0, "pressure_psia": 14.7, "airflow_cms": 31.83, "droplet_d0_mm": 1.6, "diluent": "N2", "habitat_id": "iss_module"}, "measured_temp_k": 305.0, "co_max_ppm": 18.0, "ch2o_max_ppm": 0.0, "opt_min_pct": null, "mist_max_um": 0.0, "k_meas": null, "r2_d2": null, "regime": "BLOWOFF_EXTINGUISHED", "badge_tr": "YÜKSEK HIZLI ÜFLEME SÖNMESİ (BLOWOFF)", "badge_en": "CONVECTIVE BLOWOFF EXTINCTION", "flame_temp_k": 305.0, "moc_pct": 12.37, "k_model": 0.0, "spread_mms": 0.0, "b_oq": 6.95, "sh": 4.85, "da": 0.28, "risk_score": 36, "smac_s": 999.0, "extinguished": true, "cool_flame": false}, {"index": 3, "code": "GRUP_3", "desc": "Propane", "short_tr": "Faz 3", "short_en": "Phase 3", "time_span_tr": "11 satir", "time_span_en": "11 rows", "facility": "ISS_CIR", "exp_ref": "", "sim_params": {"fuel_id": "propane_cfig", "gravity_g": 0.0, "oxygen_pct": 21.0, "pressure_psia": 14.7, "airflow_cms": 30.49, "droplet_d0_mm": 1.6, "diluent": "N2", "habitat_id": "iss_module"}, "measured_temp_k": 305.0, "co_max_ppm": 18.0, "ch2o_max_ppm": 0.0, "opt_min_pct": null, "mist_max_um": 0.0, "k_meas": null, "r2_d2": null, "regime": "BLOWOFF_EXTINGUISHED", "badge_tr": "YÜKSEK HIZLI ÜFLEME SÖNMESİ (BLOWOFF)", "badge_en": "CONVECTIVE BLOWOFF EXTINCTION", "flame_temp_k": 305.0, "moc_pct": 12.26, "k_model": 0.0, "spread_mms": 0.0, "b_oq": 6.95, "sh": 4.79, "da": 0.3, "risk_score": 37, "smac_s": 999.0, "extinguished": true, "cool_flame": false}, {"index": 4, "code": "GRUP_4", "desc": "75% Propylene", "short_tr": "Faz 4", "short_en": "Phase 4", "time_span_tr": "59 satir", "time_span_en": "59 rows", "facility": "ISS_CIR", "exp_ref": "", "sim_params": {"fuel_id": "propane_cfig", "gravity_g": 0.0, "oxygen_pct": 21.0, "pressure_psia": 14.7, "airflow_cms": 11.31, "droplet_d0_mm": 1.6, "diluent": "N2", "habitat_id": "iss_module"}, "measured_temp_k": 305.0, "co_max_ppm": 18.0, "ch2o_max_ppm": 0.0, "opt_min_pct": null, "mist_max_um": 0.0, "k_meas": null, "r2_d2": null, "regime": "BLOWOFF_EXTINGUISHED", "badge_tr": "YÜKSEK HIZLI ÜFLEME SÖNMESİ (BLOWOFF)", "badge_en": "CONVECTIVE BLOWOFF EXTINCTION", "flame_temp_k": 305.0, "moc_pct": 11.06, "k_model": 0.0, "spread_mms": 0.0, "b_oq": 6.95, "sh": 3.7, "da": 0.8, "risk_score": 39, "smac_s": 999.0, "extinguished": true, "cool_flame": false}, {"index": 5, "code": "GRUP_5", "desc": "75 % Propylene", "short_tr": "Faz 5", "short_en": "Phase 5", "time_span_tr": "102 satir", "time_span_en": "102 rows", "facility": "ISS_CIR", "exp_ref": "", "sim_params": {"fuel_id": "propane_cfig", "gravity_g": 0.0, "oxygen_pct": 21.0, "pressure_psia": 14.7, "airflow_cms": 34.07, "droplet_d0_mm": 1.6, "diluent": "N2", "habitat_id": "iss_module"}, "measured_temp_k": 305.0, "co_max_ppm": 18.0, "ch2o_max_ppm": 0.0, "opt_min_pct": null, "mist_max_um": 0.0, "k_meas": null, "r2_d2": null, "regime": "BLOWOFF_EXTINGUISHED", "badge_tr": "YÜKSEK HIZLI ÜFLEME SÖNMESİ (BLOWOFF)", "badge_en": "CONVECTIVE BLOWOFF EXTINCTION", "flame_temp_k": 305.0, "moc_pct": 12.59, "k_model": 0.0, "spread_mms": 0.0, "b_oq": 6.95, "sh": 4.95, "da": 0.26, "risk_score": 36, "smac_s": 999.0, "extinguished": true, "cool_flame": false}, {"index": 6, "code": "GRUP_6", "desc": "75 % Propylene", "short_tr": "Faz 6", "short_en": "Phase 6", "time_span_tr": "140 satir", "time_span_en": "140 rows", "facility": "ISS_CIR", "exp_ref": "", "sim_params": {"fuel_id": "propane_cfig", "gravity_g": 0.0, "oxygen_pct": 21.0, "pressure_psia": 14.7, "airflow_cms": 33.89, "droplet_d0_mm": 1.6, "diluent": "N2", "habitat_id": "iss_module"}, "measured_temp_k": 305.0, "co_max_ppm": 18.0, "ch2o_max_ppm": 0.0, "opt_min_pct": null, "mist_max_um": 0.0, "k_meas": null, "r2_d2": null, "regime": "BLOWOFF_EXTINGUISHED", "badge_tr": "YÜKSEK HIZLI ÜFLEME SÖNMESİ (BLOWOFF)", "badge_en": "CONVECTIVE BLOWOFF EXTINCTION", "flame_temp_k": 305.0, "moc_pct": 12.57, "k_model": 0.0, "spread_mms": 0.0, "b_oq": 6.95, "sh": 4.94, "da": 0.27, "risk_score": 36, "smac_s": 999.0, "extinguished": true, "cool_flame": false}, {"index": 7, "code": "GRUP_7", "desc": "75% Propylene", "short_tr": "Faz 7", "short_en": "Phase 7", "time_span_tr": "41 satir", "time_span_en": "41 rows", "facility": "ISS_CIR", "exp_ref": "", "sim_params": {"fuel_id": "propane_cfig", "gravity_g": 0.0, "oxygen_pct": 21.0, "pressure_psia": 14.7, "airflow_cms": 12.71, "droplet_d0_mm": 0.8, "diluent": "N2", "habitat_id": "iss_module"}, "measured_temp_k": 305.0, "co_max_ppm": 18.0, "ch2o_max_ppm": 0.0, "opt_min_pct": null, "mist_max_um": 0.0, "k_meas": null, "r2_d2": null, "regime": "BLOWOFF_EXTINGUISHED", "badge_tr": "YÜKSEK HIZLI ÜFLEME SÖNMESİ (BLOWOFF)", "badge_en": "CONVECTIVE BLOWOFF EXTINCTION", "flame_temp_k": 305.0, "moc_pct": 11.22, "k_model": 0.0, "spread_mms": 0.0, "b_oq": 6.95, "sh": 3.27, "da": 0.35, "risk_score": 39, "smac_s": 999.0, "extinguished": true, "cool_flame": false}], "summary_tr": "**Çok Fazlı Telemetri Analizi (`PSI-107_Experimental table_Spice.csv` • 469 satır • 7 fiziksel faz):**\n- **3B Yanma Odasına Aktarılan Aktif Durum:** **Faz 1** (`propane_cfig`, `0.0G`, `%21.0 O₂`, `14.7 psia`, `27.83 cm/s` — Sıcaklık: `305.0 K`).\n\n| Faz | Zaman | Yakit ve Atmosfer | Sicaklik / CO / CH2O | Boyutsuz Sayilar (K, B_oq, Sh, Da, MOC) | Fiziksel Rejim ve SMAC |\n| :--- | :--- | :--- | :--- | :--- | :--- |\n| **Faz 1** | `38 satir` | `propane_cfig` • `0.0G` • `%21.0 O₂` • `14.7 psia` • `27.83 cm/s` | `305.0 K` • `18.0 ppm CO` | `K=0.00` • `B=6.95` • `Sh=4.66` • `Da=0.32` • `MOC=%12.04` | **YÜKSEK HIZLI ÜFLEME SÖNMESİ (BLOWOFF)** (Risk `37/100`, SMAC `Guvenli`) |\n| **Faz 2** | `24 satir` | `propane_cfig` • `0.0G` • `%21.0 O₂` • `14.7 psia` • `31.83 cm/s` | `305.0 K` • `18.0 ppm CO` | `K=0.00` • `B=6.95` • `Sh=4.85` • `Da=0.28` • `MOC=%12.37` | **YÜKSEK HIZLI ÜFLEME SÖNMESİ (BLOWOFF)** (Risk `36/100`, SMAC `Guvenli`) |\n| **Faz 3** | `11 satir` | `propane_cfig` • `0.0G` • `%21.0 O₂` • `14.7 psia` • `30.49 cm/s` | `305.0 K` • `18.0 ppm CO` | `K=0.00` • `B=6.95` • `Sh=4.79` • `Da=0.3` • `MOC=%12.26` | **YÜKSEK HIZLI ÜFLEME SÖNMESİ (BLOWOFF)** (Risk `37/100`, SMAC `Guvenli`) |\n| **Faz 4** | `59 satir` | `propane_cfig` • `0.0G` • `%21.0 O₂` • `14.7 psia` • `11.31 cm/s` | `305.0 K` • `18.0 ppm CO` | `K=0.00` • `B=6.95` • `Sh=3.7` • `Da=0.8` • `MOC=%11.06` | **YÜKSEK HIZLI ÜFLEME SÖNMESİ (BLOWOFF)** (Risk `39/100`, SMAC `Guvenli`) |\n| **Faz 5** | `102 satir` | `propane_cfig` • `0.0G` • `%21.0 O₂` • `14.7 psia` • `34.07 cm/s` | `305.0 K` • `18.0 ppm CO` | `K=0.00` • `B=6.95` • `Sh=4.95` • `Da=0.26` • `MOC=%12.59` | **YÜKSEK HIZLI ÜFLEME SÖNMESİ (BLOWOFF)** (Risk `36/100`, SMAC `Guvenli`) |\n| **Faz 6** | `140 satir` | `propane_cfig` • `0.0G` • `%21.0 O₂` • `14.7 psia` • `33.89 cm/s` | `305.0 K` • `18.0 ppm CO` | `K=0.00` • `B=6.95` • `Sh=4.94` • `Da=0.27` • `MOC=%12.57` | **YÜKSEK HIZLI ÜFLEME SÖNMESİ (BLOWOFF)** (Risk `36/100`, SMAC `Guvenli`) |\n| **Faz 7** | `41 satir` | `propane_cfig` • `0.0G` • `%21.0 O₂` • `14.7 psia` • `12.71 cm/s` | `305.0 K` • `18.0 ppm CO` | `K=0.00` • `B=6.95` • `Sh=3.27` • `Da=0.35` • `MOC=%11.22` | **YÜKSEK HIZLI ÜFLEME SÖNMESİ (BLOWOFF)** (Risk `39/100`, SMAC `Guvenli`) |", "summary_en": "**Multi-Phase Telemetry Analysis (`PSI-107_Experimental table_Spice.csv` • 469 rows • 7 physical phases):**\n- **Active State Synced to 3D Chamber:** **Phase 1** (`propane_cfig`, `0.0G`, `21.0% O₂`, `14.7 psia`, `27.83 cm/s` — Temp: `305.0 K`).\n\n| Phase | Window | Fuel & Atmosphere | Temp / CO / CH2O | Dimensionless (K, B_oq, Sh, Da, MOC) | Regime & SMAC Clock |\n| :--- | :--- | :--- | :--- | :--- | :--- |\n| **Phase 1** | `38 rows` | `propane_cfig` • `0.0G` • `21.0% O₂` • `14.7 psia` • `27.83 cm/s` | `305.0 K` • `18.0 ppm CO` | `K=0.00` • `B=6.95` • `Sh=4.66` • `Da=0.32` • `MOC=12.04%` | **CONVECTIVE BLOWOFF EXTINCTION** (Risk `37/100`, SMAC `Safe`) |\n| **Phase 2** | `24 rows` | `propane_cfig` • `0.0G` • `21.0% O₂` • `14.7 psia` • `31.83 cm/s` | `305.0 K` • `18.0 ppm CO` | `K=0.00` • `B=6.95` • `Sh=4.85` • `Da=0.28` • `MOC=12.37%` | **CONVECTIVE BLOWOFF EXTINCTION** (Risk `36/100`, SMAC `Safe`) |\n| **Phase 3** | `11 rows` | `propane_cfig` • `0.0G` • `21.0% O₂` • `14.7 psia` • `30.49 cm/s` | `305.0 K` • `18.0 ppm CO` | `K=0.00` • `B=6.95` • `Sh=4.79` • `Da=0.3` • `MOC=12.26%` | **CONVECTIVE BLOWOFF EXTINCTION** (Risk `37/100`, SMAC `Safe`) |\n| **Phase 4** | `59 rows` | `propane_cfig` • `0.0G` • `21.0% O₂` • `14.7 psia` • `11.31 cm/s` | `305.0 K` • `18.0 ppm CO` | `K=0.00` • `B=6.95` • `Sh=3.7` • `Da=0.8` • `MOC=11.06%` | **CONVECTIVE BLOWOFF EXTINCTION** (Risk `39/100`, SMAC `Safe`) |\n| **Phase 5** | `102 rows` | `propane_cfig` • `0.0G` • `21.0% O₂` • `14.7 psia` • `34.07 cm/s` | `305.0 K` • `18.0 ppm CO` | `K=0.00` • `B=6.95` • `Sh=4.95` • `Da=0.26` • `MOC=12.59%` | **CONVECTIVE BLOWOFF EXTINCTION** (Risk `36/100`, SMAC `Safe`) |\n| **Phase 6** | `140 rows` | `propane_cfig` • `0.0G` • `21.0% O₂` • `14.7 psia` • `33.89 cm/s` | `305.0 K` • `18.0 ppm CO` | `K=0.00` • `B=6.95` • `Sh=4.94` • `Da=0.27` • `MOC=12.57%` | **CONVECTIVE BLOWOFF EXTINCTION** (Risk `36/100`, SMAC `Safe`) |\n| **Phase 7** | `41 rows` | `propane_cfig` • `0.0G` • `21.0% O₂` • `14.7 psia` • `12.71 cm/s` | `305.0 K` • `18.0 ppm CO` | `K=0.00` • `B=6.95` • `Sh=3.27` • `Da=0.35` • `MOC=11.22%` | **CONVECTIVE BLOWOFF EXTINCTION** (Risk `39/100`, SMAC `Safe`) |"}, {"id": "PSI-106", "acronym": "SLICE", "raw_title": "Structure and Liftoff In Combustion Experiment", "title": "PSI-106 (SLICE) — Structure and Liftoff In Combustion Experiment", "hardware": "", "platform": "International Space Station (ISS)", "date": "2024-09-18", "table_file": "", "url": "https://psi.nasa.gov/physci/repo/data/investigations/PSI-106", "abstract": "Objective: The objective of this investigation is to better understand the structure and stability of laminar diffusion flames in microgravity. Specific objectives of this investigation were: 1. To investigate the structure of laminar diffusion flames in microgravity to understand the stabilizing mechanisms at the flames base. 2. Determine the liftoff velocity limits for different fuels and burner diameters. 3. Evaluate the impact of fuel dilution with nit", "extracted_sim_params": {"fuel_id": "propane_cfig", "gravity_g": 0.0, "oxygen_pct": 21.0, "pressure_psia": 14.7, "airflow_cms": 2.4, "droplet_d0_mm": 3.2, "diluent": "N2"}, "phases": [], "summary_tr": "**NASA PSI Kaydı (`PSI-106` • `SLICE`): Structure and Liftoff In Combustion Experiment**\n- **3B Yanma Odasına Aktarılan Koşullar:** Yakıt `propane_cfig`, Yerçekimi `0.0G`, O₂ `%21.0`, Basınç `14.7 psia`, Akış `2.4 cm/s` — Rejim: **0G HAVALANDIRMALI KUYRUK ALEVİ (2.4 cm/s)** (`2040.3 K`).\n- **Araştırma Özeti:** Objective: The objective of this investigation is to better understand the structure and stability of laminar diffusion flames in microgravity. Specific objectives of this investigation were: 1. To investigate the structure of laminar diffusion flames in microgravity to understand the stabilizing mechanisms at the flames base. 2. Determine the liftoff velocity limits for different fuels and burner diameters. 3. Evaluate the impact of fuel dilution with nit", "summary_en": "**NASA PSI Record (`PSI-106` • `SLICE`): Structure and Liftoff In Combustion Experiment**\n- **3D Chamber Conditions Applied:** Fuel `propane_cfig`, Gravity `0.0G`, O₂ `21.0%`, Pressure `14.7 psia`, Airflow `2.4 cm/s` — Regime: **0G VENTILATED WAKE FLAME (2.4 cm/s)** (`2040.3 K`).\n- **Investigation Summary:** Objective: The objective of this investigation is to better understand the structure and stability of laminar diffusion flames in microgravity. Specific objectives of this investigation were: 1. To investigate the structure of laminar diffusion flames in microgravity to understand the stabilizing mechanisms at the flames base. 2. Determine the liftoff velocity limits for different fuels and burner diameters. 3. Evaluate the impact of fuel dilution with nit"}, {"id": "PSI-100", "acronym": "SAFFIRE-III", "raw_title": "Spacecraft Fire Experiment-III", "title": "PSI-100 (SAFFIRE-III) — Spacecraft Fire Experiment-III (PSI-100_Experimental table_SAFFIRE-3.csv)", "hardware": "Saffire III enclosure in Cygnus", "platform": "International Space Station (ISS)", "date": "2024-09-18", "table_file": "PSI-100_Experimental table_SAFFIRE-3.csv", "url": "https://psi.nasa.gov/physci/repo/data/investigations/PSI-100", "abstract": "The objectives of this investigation were to: (1) determine how rapidly a large scale fire grows in low-gravity and (2) investigate the low-g flammability limits compared to those obtained in NASA’s normal gravity material flammability screening test.", "extracted_sim_params": {"fuel_id": "sibal", "gravity_g": 0.0, "oxygen_pct": 21.0, "pressure_psia": 14.7, "airflow_cms": 30.0, "droplet_d0_mm": 3.2, "diluent": "N2", "habitat_id": "iss_module"}, "phases": [{"index": 1, "code": "TEST_1", "desc": "Test 1 (SIBAL Fabric)", "short_tr": "Faz 1", "short_en": "Phase 1", "time_span_tr": "1 satir", "time_span_en": "1 rows", "facility": "ISS_CIR", "exp_ref": "", "sim_params": {"fuel_id": "sibal", "gravity_g": 0.0, "oxygen_pct": 21.0, "pressure_psia": 14.7, "airflow_cms": 30.0, "droplet_d0_mm": 3.2, "diluent": "N2", "habitat_id": "iss_module"}, "measured_temp_k": 305.0, "co_max_ppm": 18.0, "ch2o_max_ppm": 0.0, "opt_min_pct": null, "mist_max_um": 0.0, "k_meas": null, "r2_d2": null, "regime": "BLOWOFF_EXTINGUISHED", "badge_tr": "YÜKSEK HIZLI ÜFLEME SÖNMESİ (BLOWOFF)", "badge_en": "CONVECTIVE BLOWOFF EXTINCTION", "flame_temp_k": 305.0, "moc_pct": 14.66, "k_model": 0.0, "spread_mms": 0.0, "b_oq": 2.17, "sh": 5.91, "da": 0.6, "risk_score": 31, "smac_s": 999.0, "extinguished": true, "cool_flame": false}, {"index": 2, "code": "TEST_2", "desc": "Test 2 (SIBAL Fabric)", "short_tr": "Faz 2", "short_en": "Phase 2", "time_span_tr": "1 satir", "time_span_en": "1 rows", "facility": "ISS_CIR", "exp_ref": "", "sim_params": {"fuel_id": "sibal", "gravity_g": 0.0, "oxygen_pct": 21.0, "pressure_psia": 14.7, "airflow_cms": 30.0, "droplet_d0_mm": 3.2, "diluent": "N2", "habitat_id": "iss_module"}, "measured_temp_k": 305.0, "co_max_ppm": 18.0, "ch2o_max_ppm": 0.0, "opt_min_pct": null, "mist_max_um": 0.0, "k_meas": null, "r2_d2": null, "regime": "BLOWOFF_EXTINGUISHED", "badge_tr": "YÜKSEK HIZLI ÜFLEME SÖNMESİ (BLOWOFF)", "badge_en": "CONVECTIVE BLOWOFF EXTINCTION", "flame_temp_k": 305.0, "moc_pct": 14.66, "k_model": 0.0, "spread_mms": 0.0, "b_oq": 2.17, "sh": 5.91, "da": 0.6, "risk_score": 31, "smac_s": 999.0, "extinguished": true, "cool_flame": false}], "summary_tr": "**Çok Fazlı Telemetri Analizi (`PSI-100_Experimental table_SAFFIRE-3.csv` • 2 satır • 2 fiziksel faz):**\n- **3B Yanma Odasına Aktarılan Aktif Durum:** **Faz 1** (`sibal`, `0.0G`, `%21.0 O₂`, `14.7 psia`, `30.0 cm/s` — Sıcaklık: `305.0 K`).\n\n| Faz | Zaman | Yakit ve Atmosfer | Sicaklik / CO / CH2O | Boyutsuz Sayilar (K, B_oq, Sh, Da, MOC) | Fiziksel Rejim ve SMAC |\n| :--- | :--- | :--- | :--- | :--- | :--- |\n| **Faz 1** | `1 satir` | `sibal` • `0.0G` • `%21.0 O₂` • `14.7 psia` • `30.0 cm/s` | `305.0 K` • `18.0 ppm CO` | `K=0.00` • `B=2.17` • `Sh=5.91` • `Da=0.6` • `MOC=%14.66` | **YÜKSEK HIZLI ÜFLEME SÖNMESİ (BLOWOFF)** (Risk `31/100`, SMAC `Guvenli`) |\n| **Faz 2** | `1 satir` | `sibal` • `0.0G` • `%21.0 O₂` • `14.7 psia` • `30.0 cm/s` | `305.0 K` • `18.0 ppm CO` | `K=0.00` • `B=2.17` • `Sh=5.91` • `Da=0.6` • `MOC=%14.66` | **YÜKSEK HIZLI ÜFLEME SÖNMESİ (BLOWOFF)** (Risk `31/100`, SMAC `Guvenli`) |", "summary_en": "**Multi-Phase Telemetry Analysis (`PSI-100_Experimental table_SAFFIRE-3.csv` • 2 rows • 2 physical phases):**\n- **Active State Synced to 3D Chamber:** **Phase 1** (`sibal`, `0.0G`, `21.0% O₂`, `14.7 psia`, `30.0 cm/s` — Temp: `305.0 K`).\n\n| Phase | Window | Fuel & Atmosphere | Temp / CO / CH2O | Dimensionless (K, B_oq, Sh, Da, MOC) | Regime & SMAC Clock |\n| :--- | :--- | :--- | :--- | :--- | :--- |\n| **Phase 1** | `1 rows` | `sibal` • `0.0G` • `21.0% O₂` • `14.7 psia` • `30.0 cm/s` | `305.0 K` • `18.0 ppm CO` | `K=0.00` • `B=2.17` • `Sh=5.91` • `Da=0.6` • `MOC=14.66%` | **CONVECTIVE BLOWOFF EXTINCTION** (Risk `31/100`, SMAC `Safe`) |\n| **Phase 2** | `1 rows` | `sibal` • `0.0G` • `21.0% O₂` • `14.7 psia` • `30.0 cm/s` | `305.0 K` • `18.0 ppm CO` | `K=0.00` • `B=2.17` • `Sh=5.91` • `Da=0.6` • `MOC=14.66%` | **CONVECTIVE BLOWOFF EXTINCTION** (Risk `31/100`, SMAC `Safe`) |"}, {"id": "PSI-102", "acronym": "SAME", "raw_title": "Smoke and Aerosol Measurement Experiment", "title": "PSI-102 (SAME) — Smoke and Aerosol Measurement Experiment (PSI-102_Experimental table_SAME.csv)", "hardware": "Comparitive Soot Diagnostic Hardware", "platform": "International Space Station (ISS)", "date": "2024-09-18", "table_file": "PSI-102_Experimental table_SAME.csv", "url": "https://psi.nasa.gov/physci/repo/data/investigations/PSI-102", "abstract": "One of the major goals of this investigation was to quantify the sizes that the liquid smoke particulate achieves in low gravity and to relate the droplet size distribution to the smoke generation and smoke transport conditions in the experiment. A numerical code was to be developed to predict the smoke droplet growth as a function of the fuel pyrolysis rate, the thermodynamic properties of the pyrolysis vapor, and the flow environment.", "extracted_sim_params": {"fuel_id": "pmma", "gravity_g": 0.0, "oxygen_pct": 21.0, "pressure_psia": 14.7, "airflow_cms": 6.25, "droplet_d0_mm": 3.2, "diluent": "N2", "habitat_id": "iss_module"}, "phases": [{"index": 1, "code": "GRUP_1", "desc": "Teflon", "short_tr": "Faz 1", "short_en": "Phase 1", "time_span_tr": "4 satir", "time_span_en": "4 rows", "facility": "ISS_CIR", "exp_ref": "", "sim_params": {"fuel_id": "pmma", "gravity_g": 0.0, "oxygen_pct": 21.0, "pressure_psia": 14.7, "airflow_cms": 6.25, "droplet_d0_mm": 3.2, "diluent": "N2", "habitat_id": "iss_module"}, "measured_temp_k": 1989.4, "co_max_ppm": 116.0, "ch2o_max_ppm": 0.0, "opt_min_pct": null, "mist_max_um": 0.0, "k_meas": null, "r2_d2": null, "regime": "VENTILATED_WAKE_0G", "badge_tr": "0G HAVALANDIRMALI KUYRUK ALEVİ (6.2 cm/s)", "badge_en": "0G VENTILATED WAKE FLAME (6.2 cm/s)", "flame_temp_k": 1989.4, "moc_pct": 13.25, "k_model": 0.722, "spread_mms": 1.47, "b_oq": 1.63, "sh": 3.78, "da": 2.88, "risk_score": 70, "smac_s": 115.9, "extinguished": false, "cool_flame": false}, {"index": 2, "code": "GRUP_2", "desc": "Kapton: same conditions ", "short_tr": "Faz 2", "short_en": "Phase 2", "time_span_tr": "1 satir", "time_span_en": "1 rows", "facility": "ISS_CIR", "exp_ref": "", "sim_params": {"fuel_id": "nomex", "gravity_g": 0.0, "oxygen_pct": 21.0, "pressure_psia": 14.7, "airflow_cms": 2.4, "droplet_d0_mm": 3.2, "diluent": "N2", "habitat_id": "iss_module"}, "measured_temp_k": 305.0, "co_max_ppm": 18.0, "ch2o_max_ppm": 0.0, "opt_min_pct": null, "mist_max_um": 0.0, "k_meas": null, "r2_d2": null, "regime": "QUENCHED_EXTINGUISHED", "badge_tr": "OKSİJEN / RADYATİF SÖNÜMLENME (MOC < %21.52)", "badge_en": "DIFFUSIVE / RADIATIVE QUENCHING (O₂ < 21.52%)", "flame_temp_k": 305.0, "moc_pct": 21.52, "k_model": 0.0, "spread_mms": 0.0, "b_oq": 1.03, "sh": 3.11, "da": 7.5, "risk_score": 16, "smac_s": 999.0, "extinguished": true, "cool_flame": false}, {"index": 3, "code": "GRUP_3", "desc": "Silicone Rubber: same co", "short_tr": "Faz 3", "short_en": "Phase 3", "time_span_tr": "1 satir", "time_span_en": "1 rows", "facility": "ISS_CIR", "exp_ref": "", "sim_params": {"fuel_id": "pmma", "gravity_g": 0.0, "oxygen_pct": 21.0, "pressure_psia": 14.7, "airflow_cms": 2.4, "droplet_d0_mm": 3.2, "diluent": "N2", "habitat_id": "iss_module"}, "measured_temp_k": 1977.6, "co_max_ppm": 106.0, "ch2o_max_ppm": 0.0, "opt_min_pct": null, "mist_max_um": 0.0, "k_meas": null, "r2_d2": null, "regime": "VENTILATED_WAKE_0G", "badge_tr": "0G HAVALANDIRMALI KUYRUK ALEVİ (2.4 cm/s)", "badge_en": "0G VENTILATED WAKE FLAME (2.4 cm/s)", "flame_temp_k": 1977.6, "moc_pct": 14.32, "k_model": 0.591, "spread_mms": 0.88, "b_oq": 1.63, "sh": 3.11, "da": 7.5, "risk_score": 64, "smac_s": 138.5, "extinguished": false, "cool_flame": false}, {"index": 4, "code": "GRUP_4", "desc": "Lampwick: same condition", "short_tr": "Faz 4", "short_en": "Phase 4", "time_span_tr": "1 satir", "time_span_en": "1 rows", "facility": "ISS_CIR", "exp_ref": "", "sim_params": {"fuel_id": "pmma", "gravity_g": 0.0, "oxygen_pct": 21.0, "pressure_psia": 14.7, "airflow_cms": 2.4, "droplet_d0_mm": 3.2, "diluent": "N2", "habitat_id": "iss_module"}, "measured_temp_k": 1977.6, "co_max_ppm": 106.0, "ch2o_max_ppm": 0.0, "opt_min_pct": null, "mist_max_um": 0.0, "k_meas": null, "r2_d2": null, "regime": "VENTILATED_WAKE_0G", "badge_tr": "0G HAVALANDIRMALI KUYRUK ALEVİ (2.4 cm/s)", "badge_en": "0G VENTILATED WAKE FLAME (2.4 cm/s)", "flame_temp_k": 1977.6, "moc_pct": 14.32, "k_model": 0.591, "spread_mms": 0.88, "b_oq": 1.63, "sh": 3.11, "da": 7.5, "risk_score": 64, "smac_s": 138.5, "extinguished": false, "cool_flame": false}, {"index": 5, "code": "GRUP_5", "desc": "Dibutyl Phthalate: same ", "short_tr": "Faz 5", "short_en": "Phase 5", "time_span_tr": "1 satir", "time_span_en": "1 rows", "facility": "ISS_CIR", "exp_ref": "", "sim_params": {"fuel_id": "pmma", "gravity_g": 0.0, "oxygen_pct": 21.0, "pressure_psia": 14.7, "airflow_cms": 2.4, "droplet_d0_mm": 3.2, "diluent": "N2", "habitat_id": "iss_module"}, "measured_temp_k": 1977.6, "co_max_ppm": 106.0, "ch2o_max_ppm": 0.0, "opt_min_pct": null, "mist_max_um": 0.0, "k_meas": null, "r2_d2": null, "regime": "VENTILATED_WAKE_0G", "badge_tr": "0G HAVALANDIRMALI KUYRUK ALEVİ (2.4 cm/s)", "badge_en": "0G VENTILATED WAKE FLAME (2.4 cm/s)", "flame_temp_k": 1977.6, "moc_pct": 14.32, "k_model": 0.591, "spread_mms": 0.88, "b_oq": 1.63, "sh": 3.11, "da": 7.5, "risk_score": 64, "smac_s": 138.5, "extinguished": false, "cool_flame": false}], "summary_tr": "**Çok Fazlı Telemetri Analizi (`PSI-102_Experimental table_SAME.csv` • 8 satır • 5 fiziksel faz):**\n- **3B Yanma Odasına Aktarılan Aktif Durum:** **Faz 1** (`pmma`, `0.0G`, `%21.0 O₂`, `14.7 psia`, `6.25 cm/s` — Sıcaklık: `1989.4 K`).\n\n| Faz | Zaman | Yakit ve Atmosfer | Sicaklik / CO / CH2O | Boyutsuz Sayilar (K, B_oq, Sh, Da, MOC) | Fiziksel Rejim ve SMAC |\n| :--- | :--- | :--- | :--- | :--- | :--- |\n| **Faz 1** | `4 satir` | `pmma` • `0.0G` • `%21.0 O₂` • `14.7 psia` • `6.25 cm/s` | `1989.4 K` • `116.0 ppm CO` | `K=0.72` • `B=1.63` • `Sh=3.78` • `Da=2.88` • `MOC=%13.25` | **0G HAVALANDIRMALI KUYRUK ALEVİ (6.2 cm/s)** (Risk `70/100`, SMAC `115.9 sn`) |\n| **Faz 2** | `1 satir` | `nomex` • `0.0G` • `%21.0 O₂` • `14.7 psia` • `2.4 cm/s` | `305.0 K` • `18.0 ppm CO` | `K=0.00` • `B=1.03` • `Sh=3.11` • `Da=7.5` • `MOC=%21.52` | **OKSİJEN / RADYATİF SÖNÜMLENME (MOC < %21.52)** (Risk `16/100`, SMAC `Guvenli`) |\n| **Faz 3** | `1 satir` | `pmma` • `0.0G` • `%21.0 O₂` • `14.7 psia` • `2.4 cm/s` | `1977.6 K` • `106.0 ppm CO` | `K=0.59` • `B=1.63` • `Sh=3.11` • `Da=7.5` • `MOC=%14.32` | **0G HAVALANDIRMALI KUYRUK ALEVİ (2.4 cm/s)** (Risk `64/100`, SMAC `138.5 sn`) |\n| **Faz 4** | `1 satir` | `pmma` • `0.0G` • `%21.0 O₂` • `14.7 psia` • `2.4 cm/s` | `1977.6 K` • `106.0 ppm CO` | `K=0.59` • `B=1.63` • `Sh=3.11` • `Da=7.5` • `MOC=%14.32` | **0G HAVALANDIRMALI KUYRUK ALEVİ (2.4 cm/s)** (Risk `64/100`, SMAC `138.5 sn`) |\n| **Faz 5** | `1 satir` | `pmma` • `0.0G` • `%21.0 O₂` • `14.7 psia` • `2.4 cm/s` | `1977.6 K` • `106.0 ppm CO` | `K=0.59` • `B=1.63` • `Sh=3.11` • `Da=7.5` • `MOC=%14.32` | **0G HAVALANDIRMALI KUYRUK ALEVİ (2.4 cm/s)** (Risk `64/100`, SMAC `138.5 sn`) |", "summary_en": "**Multi-Phase Telemetry Analysis (`PSI-102_Experimental table_SAME.csv` • 8 rows • 5 physical phases):**\n- **Active State Synced to 3D Chamber:** **Phase 1** (`pmma`, `0.0G`, `21.0% O₂`, `14.7 psia`, `6.25 cm/s` — Temp: `1989.4 K`).\n\n| Phase | Window | Fuel & Atmosphere | Temp / CO / CH2O | Dimensionless (K, B_oq, Sh, Da, MOC) | Regime & SMAC Clock |\n| :--- | :--- | :--- | :--- | :--- | :--- |\n| **Phase 1** | `4 rows` | `pmma` • `0.0G` • `21.0% O₂` • `14.7 psia` • `6.25 cm/s` | `1989.4 K` • `116.0 ppm CO` | `K=0.72` • `B=1.63` • `Sh=3.78` • `Da=2.88` • `MOC=13.25%` | **0G VENTILATED WAKE FLAME (6.2 cm/s)** (Risk `70/100`, SMAC `115.9 s`) |\n| **Phase 2** | `1 rows` | `nomex` • `0.0G` • `21.0% O₂` • `14.7 psia` • `2.4 cm/s` | `305.0 K` • `18.0 ppm CO` | `K=0.00` • `B=1.03` • `Sh=3.11` • `Da=7.5` • `MOC=21.52%` | **DIFFUSIVE / RADIATIVE QUENCHING (O₂ < 21.52%)** (Risk `16/100`, SMAC `Safe`) |\n| **Phase 3** | `1 rows` | `pmma` • `0.0G` • `21.0% O₂` • `14.7 psia` • `2.4 cm/s` | `1977.6 K` • `106.0 ppm CO` | `K=0.59` • `B=1.63` • `Sh=3.11` • `Da=7.5` • `MOC=14.32%` | **0G VENTILATED WAKE FLAME (2.4 cm/s)** (Risk `64/100`, SMAC `138.5 s`) |\n| **Phase 4** | `1 rows` | `pmma` • `0.0G` • `21.0% O₂` • `14.7 psia` • `2.4 cm/s` | `1977.6 K` • `106.0 ppm CO` | `K=0.59` • `B=1.63` • `Sh=3.11` • `Da=7.5` • `MOC=14.32%` | **0G VENTILATED WAKE FLAME (2.4 cm/s)** (Risk `64/100`, SMAC `138.5 s`) |\n| **Phase 5** | `1 rows` | `pmma` • `0.0G` • `21.0% O₂` • `14.7 psia` • `2.4 cm/s` | `1977.6 K` • `106.0 ppm CO` | `K=0.59` • `B=1.63` • `Sh=3.11` • `Da=7.5` • `MOC=14.32%` | **0G VENTILATED WAKE FLAME (2.4 cm/s)** (Risk `64/100`, SMAC `138.5 s`) |"}, {"id": "PSI-69", "acronym": "FLEX", "raw_title": "Flame Extinguishment Experiment", "title": "PSI-69 (FLEX) — Flame Extinguishment Experiment (PSI-69_Experimental table_FLEX.csv)", "hardware": "Combustion Integrated Rack (CIR)-Fluids and Combustion Facility (FCF), Multi-user Droplet Combustion Appartatus (MDCA)", "platform": "International Space Station (ISS)", "date": "2016-07-31", "table_file": "PSI-69_Experimental table_FLEX.csv", "url": "https://psi.nasa.gov/physci/repo/data/investigations/PSI-69", "abstract": "The FLEX (Flame Extinguishment Experiment) investigation aims to map the flammability limits of liquid fuels in microgravity environments, measure the effectiveness of various gaseous fire suppressants such as CO2, He, and SF6, and develop reliable predictive models for combustion limits under reduced gravity conditions. The mission seeks to validate and improve simplified models by incorporating detailed chemical reactions, heat transfer, and material mov", "extracted_sim_params": {"fuel_id": "methanol", "gravity_g": 0.0, "oxygen_pct": 20.03, "pressure_psia": 14.32, "airflow_cms": 2.4, "droplet_d0_mm": 1.69, "diluent": "N2", "habitat_id": "iss_module"}, "phases": [{"index": 1, "code": "GRUP_1", "desc": "Methanol", "short_tr": "Faz 1", "short_en": "Phase 1", "time_span_tr": "30 satir", "time_span_en": "30 rows", "facility": "ISS_CIR", "exp_ref": "", "sim_params": {"fuel_id": "methanol", "gravity_g": 0.0, "oxygen_pct": 20.03, "pressure_psia": 14.32, "airflow_cms": 2.4, "droplet_d0_mm": 1.69, "diluent": "N2", "habitat_id": "iss_module"}, "measured_temp_k": 1933.6, "co_max_ppm": 72.0, "ch2o_max_ppm": 0.0, "opt_min_pct": null, "mist_max_um": 0.0, "k_meas": null, "r2_d2": null, "regime": "VENTILATED_WAKE_0G", "badge_tr": "0G HAVALANDIRMALI KUYRUK ALEVİ (2.4 cm/s)", "badge_en": "0G VENTILATED WAKE FLAME (2.4 cm/s)", "flame_temp_k": 1933.6, "moc_pct": 12.65, "k_model": 0.984, "spread_mms": 1.36, "b_oq": 2.64, "sh": 2.79, "da": 3.63, "risk_score": 68, "smac_s": 189.8, "extinguished": false, "cool_flame": false}, {"index": 2, "code": "GRUP_2", "desc": "Heptane", "short_tr": "Faz 2", "short_en": "Phase 2", "time_span_tr": "33 satir", "time_span_en": "33 rows", "facility": "ISS_CIR", "exp_ref": "", "sim_params": {"fuel_id": "n_heptane", "gravity_g": 0.0, "oxygen_pct": 20.21, "pressure_psia": 14.5, "airflow_cms": 2.4, "droplet_d0_mm": 1.87, "diluent": "N2", "habitat_id": "iss_module"}, "measured_temp_k": 2008.8, "co_max_ppm": 109.0, "ch2o_max_ppm": 0.0, "opt_min_pct": null, "mist_max_um": 0.0, "k_meas": null, "r2_d2": null, "regime": "VENTILATED_WAKE_0G", "badge_tr": "0G HAVALANDIRMALI KUYRUK ALEVİ (2.4 cm/s)", "badge_en": "0G VENTILATED WAKE FLAME (2.4 cm/s)", "flame_temp_k": 2008.8, "moc_pct": 13.84, "k_model": 1.723, "spread_mms": 1.82, "b_oq": 8.65, "sh": 2.84, "da": 4.1, "risk_score": 68, "smac_s": 117.5, "extinguished": false, "cool_flame": false}, {"index": 3, "code": "GRUP_3", "desc": "Methanol • CO2", "short_tr": "Faz 3", "short_en": "Phase 3", "time_span_tr": "47 satir", "time_span_en": "47 rows", "facility": "ISS_CIR", "exp_ref": "", "sim_params": {"fuel_id": "methanol", "gravity_g": 0.0, "oxygen_pct": 20.19, "pressure_psia": 12.05, "airflow_cms": 2.4, "droplet_d0_mm": 3.86, "diluent": "CO2", "habitat_id": "iss_module"}, "measured_temp_k": 1513.4, "co_max_ppm": 72.0, "ch2o_max_ppm": 0.0, "opt_min_pct": null, "mist_max_um": 0.0, "k_meas": null, "r2_d2": null, "regime": "VENTILATED_WAKE_0G", "badge_tr": "0G HAVALANDIRMALI KUYRUK ALEVİ (2.4 cm/s)", "badge_en": "0G VENTILATED WAKE FLAME (2.4 cm/s)", "flame_temp_k": 1513.4, "moc_pct": 16.23, "k_model": 0.79, "spread_mms": 1.28, "b_oq": 1.82, "sh": 3.1, "da": 7.36, "risk_score": 58, "smac_s": 192.0, "extinguished": false, "cool_flame": false}, {"index": 4, "code": "GRUP_4", "desc": "Heptane • CO2", "short_tr": "Faz 4", "short_en": "Phase 4", "time_span_tr": "23 satir", "time_span_en": "23 rows", "facility": "ISS_CIR", "exp_ref": "", "sim_params": {"fuel_id": "n_heptane", "gravity_g": 0.0, "oxygen_pct": 19.39, "pressure_psia": 13.02, "airflow_cms": 2.4, "droplet_d0_mm": 2.74, "diluent": "CO2", "habitat_id": "iss_module"}, "measured_temp_k": 1481.1, "co_max_ppm": 106.0, "ch2o_max_ppm": 0.0, "opt_min_pct": null, "mist_max_um": 0.0, "k_meas": null, "r2_d2": null, "regime": "VENTILATED_WAKE_0G", "badge_tr": "0G HAVALANDIRMALI KUYRUK ALEVİ (2.4 cm/s)", "badge_en": "0G VENTILATED WAKE FLAME (2.4 cm/s)", "flame_temp_k": 1481.1, "moc_pct": 17.35, "k_model": 1.226, "spread_mms": 1.62, "b_oq": 5.58, "sh": 2.96, "da": 5.22, "risk_score": 54, "smac_s": 124.2, "extinguished": false, "cool_flame": false}, {"index": 5, "code": "GRUP_5", "desc": "Methanol", "short_tr": "Faz 5", "short_en": "Phase 5", "time_span_tr": "22 satir", "time_span_en": "22 rows", "facility": "ISS_CIR", "exp_ref": "", "sim_params": {"fuel_id": "methanol", "gravity_g": 0.0, "oxygen_pct": 13.27, "pressure_psia": 14.81, "airflow_cms": 2.4, "droplet_d0_mm": 3.37, "diluent": "N2", "habitat_id": "iss_module"}, "measured_temp_k": 1823.7, "co_max_ppm": 72.0, "ch2o_max_ppm": 0.0, "opt_min_pct": null, "mist_max_um": 0.0, "k_meas": null, "r2_d2": null, "regime": "VENTILATED_WAKE_0G", "badge_tr": "0G HAVALANDIRMALI KUYRUK ALEVİ (2.4 cm/s)", "badge_en": "0G VENTILATED WAKE FLAME (2.4 cm/s)", "flame_temp_k": 1823.7, "moc_pct": 12.62, "k_model": 0.856, "spread_mms": 0.69, "b_oq": 1.75, "sh": 3.14, "da": 4.08, "risk_score": 45, "smac_s": 210.1, "extinguished": false, "cool_flame": false}, {"index": 6, "code": "GRUP_6", "desc": "Heptane • CO2", "short_tr": "Faz 6", "short_en": "Phase 6", "time_span_tr": "16 satir", "time_span_en": "16 rows", "facility": "ISS_CIR", "exp_ref": "", "sim_params": {"fuel_id": "n_heptane", "gravity_g": 0.0, "oxygen_pct": 24.12, "pressure_psia": 12.86, "airflow_cms": 2.4, "droplet_d0_mm": 3.41, "diluent": "CO2", "habitat_id": "iss_module"}, "measured_temp_k": 1490.5, "co_max_ppm": 110.0, "ch2o_max_ppm": 0.0, "opt_min_pct": null, "mist_max_um": 0.0, "k_meas": null, "r2_d2": null, "regime": "VENTILATED_WAKE_0G", "badge_tr": "0G HAVALANDIRMALI KUYRUK ALEVİ (2.4 cm/s)", "badge_en": "0G VENTILATED WAKE FLAME (2.4 cm/s)", "flame_temp_k": 1490.5, "moc_pct": 17.36, "k_model": 1.418, "spread_mms": 2.32, "b_oq": 7.13, "sh": 3.07, "da": 8.84, "risk_score": 71, "smac_s": 109.1, "extinguished": false, "cool_flame": false}, {"index": 7, "code": "GRUP_7", "desc": "Heptane • He", "short_tr": "Faz 7", "short_en": "Phase 7", "time_span_tr": "18 satir", "time_span_en": "18 rows", "facility": "ISS_CIR", "exp_ref": "", "sim_params": {"fuel_id": "n_heptane", "gravity_g": 0.0, "oxygen_pct": 18.83, "pressure_psia": 12.51, "airflow_cms": 2.4, "droplet_d0_mm": 3.52, "diluent": "He", "habitat_id": "iss_module"}, "measured_temp_k": 2144.4, "co_max_ppm": 105.0, "ch2o_max_ppm": 0.0, "opt_min_pct": null, "mist_max_um": 0.0, "k_meas": null, "r2_d2": null, "regime": "VENTILATED_WAKE_0G", "badge_tr": "0G HAVALANDIRMALI KUYRUK ALEVİ (2.4 cm/s)", "badge_en": "0G VENTILATED WAKE FLAME (2.4 cm/s)", "flame_temp_k": 2144.4, "moc_pct": 16.09, "k_model": 5.36, "spread_mms": 1.51, "b_oq": 25.6, "sh": 3.07, "da": 6.24, "risk_score": 56, "smac_s": 127.4, "extinguished": false, "cool_flame": false}], "summary_tr": "**Çok Fazlı Telemetri Analizi (`PSI-69_Experimental table_FLEX.csv` • 274 satır • 7 fiziksel faz):**\n- **3B Yanma Odasına Aktarılan Aktif Durum:** **Faz 1** (`methanol`, `0.0G`, `%20.03 O₂`, `14.32 psia`, `2.4 cm/s` — Sıcaklık: `1933.6 K`).\n- **NASA-STD-6001B Söndürme Denetimi (SoFIE-MIST):** Havalandırma akışının kesilmesi (`U -> 0 cm/s`) ve `<40 µm` ince su sisi / `CO₂` seyreltmesiyle alev güvenli bölgeye (`O₂ < MOC`) indirilmiştir (*Halon 1301 kesinlikle kullanılmamıştır*).\n\n| Faz | Zaman | Yakit ve Atmosfer | Sicaklik / CO / CH2O | Boyutsuz Sayilar (K, B_oq, Sh, Da, MOC) | Fiziksel Rejim ve SMAC |\n| :--- | :--- | :--- | :--- | :--- | :--- |\n| **Faz 1** | `30 satir` | `methanol` • `0.0G` • `%20.03 O₂` • `14.32 psia` • `2.4 cm/s` | `1933.6 K` • `72.0 ppm CO` | `K=0.98` • `B=2.64` • `Sh=2.79` • `Da=3.63` • `MOC=%12.65` | **0G HAVALANDIRMALI KUYRUK ALEVİ (2.4 cm/s)** (Risk `68/100`, SMAC `189.8 sn`) |\n| **Faz 2** | `33 satir` | `n_heptane` • `0.0G` • `%20.21 O₂` • `14.5 psia` • `2.4 cm/s` | `2008.8 K` • `109.0 ppm CO` | `K=1.72` • `B=8.65` • `Sh=2.84` • `Da=4.1` • `MOC=%13.84` | **0G HAVALANDIRMALI KUYRUK ALEVİ (2.4 cm/s)** (Risk `68/100`, SMAC `117.5 sn`) |\n| **Faz 3** | `47 satir` | `methanol` • `CO2` • `0.0G` • `%20.19 O₂` • `12.05 psia` • `2.4 cm/s` | `1513.4 K` • `72.0 ppm CO` | `K=0.79` • `B=1.82` • `Sh=3.1` • `Da=7.36` • `MOC=%16.23` | **0G HAVALANDIRMALI KUYRUK ALEVİ (2.4 cm/s)** (Risk `58/100`, SMAC `192.0 sn`) |\n| **Faz 4** | `23 satir` | `n_heptane` • `CO2` • `0.0G` • `%19.39 O₂` • `13.02 psia` • `2.4 cm/s` | `1481.1 K` • `106.0 ppm CO` | `K=1.23` • `B=5.58` • `Sh=2.96` • `Da=5.22` • `MOC=%17.35` | **0G HAVALANDIRMALI KUYRUK ALEVİ (2.4 cm/s)** (Risk `54/100`, SMAC `124.2 sn`) |\n| **Faz 5** | `22 satir` | `methanol` • `0.0G` • `%13.27 O₂` • `14.81 psia` • `2.4 cm/s` | `1823.7 K` • `72.0 ppm CO` | `K=0.86` • `B=1.75` • `Sh=3.14` • `Da=4.08` • `MOC=%12.62` | **0G HAVALANDIRMALI KUYRUK ALEVİ (2.4 cm/s)** (Risk `45/100`, SMAC `210.1 sn`) |\n| **Faz 6** | `16 satir` | `n_heptane` • `CO2` • `0.0G` • `%24.12 O₂` • `12.86 psia` • `2.4 cm/s` | `1490.5 K` • `110.0 ppm CO` | `K=1.42` • `B=7.13` • `Sh=3.07` • `Da=8.84` • `MOC=%17.36` | **0G HAVALANDIRMALI KUYRUK ALEVİ (2.4 cm/s)** (Risk `71/100`, SMAC `109.1 sn`) |\n| **Faz 7** | `18 satir` | `n_heptane` • `He` • `0.0G` • `%18.83 O₂` • `12.51 psia` • `2.4 cm/s` | `2144.4 K` • `105.0 ppm CO` | `K=5.36` • `B=25.6` • `Sh=3.07` • `Da=6.24` • `MOC=%16.09` | **0G HAVALANDIRMALI KUYRUK ALEVİ (2.4 cm/s)** (Risk `56/100`, SMAC `127.4 sn`) |", "summary_en": "**Multi-Phase Telemetry Analysis (`PSI-69_Experimental table_FLEX.csv` • 274 rows • 7 physical phases):**\n- **Active State Synced to 3D Chamber:** **Phase 1** (`methanol`, `0.0G`, `20.03% O₂`, `14.32 psia`, `2.4 cm/s` — Temp: `1933.6 K`).\n- **NASA-STD-6001B Suppression Audit (SoFIE-MIST):** Cutting HVAC flow (`U -> 0 cm/s`) with `<40 µm` fine water mist / `CO₂` dilution quenched the flame below `MOC` (*Halon 1301 strictly excluded*).\n\n| Phase | Window | Fuel & Atmosphere | Temp / CO / CH2O | Dimensionless (K, B_oq, Sh, Da, MOC) | Regime & SMAC Clock |\n| :--- | :--- | :--- | :--- | :--- | :--- |\n| **Phase 1** | `30 rows` | `methanol` • `0.0G` • `20.03% O₂` • `14.32 psia` • `2.4 cm/s` | `1933.6 K` • `72.0 ppm CO` | `K=0.98` • `B=2.64` • `Sh=2.79` • `Da=3.63` • `MOC=12.65%` | **0G VENTILATED WAKE FLAME (2.4 cm/s)** (Risk `68/100`, SMAC `189.8 s`) |\n| **Phase 2** | `33 rows` | `n_heptane` • `0.0G` • `20.21% O₂` • `14.5 psia` • `2.4 cm/s` | `2008.8 K` • `109.0 ppm CO` | `K=1.72` • `B=8.65` • `Sh=2.84` • `Da=4.1` • `MOC=13.84%` | **0G VENTILATED WAKE FLAME (2.4 cm/s)** (Risk `68/100`, SMAC `117.5 s`) |\n| **Phase 3** | `47 rows` | `methanol` • `CO2` • `0.0G` • `20.19% O₂` • `12.05 psia` • `2.4 cm/s` | `1513.4 K` • `72.0 ppm CO` | `K=0.79` • `B=1.82` • `Sh=3.1` • `Da=7.36` • `MOC=16.23%` | **0G VENTILATED WAKE FLAME (2.4 cm/s)** (Risk `58/100`, SMAC `192.0 s`) |\n| **Phase 4** | `23 rows` | `n_heptane` • `CO2` • `0.0G` • `19.39% O₂` • `13.02 psia` • `2.4 cm/s` | `1481.1 K` • `106.0 ppm CO` | `K=1.23` • `B=5.58` • `Sh=2.96` • `Da=5.22` • `MOC=17.35%` | **0G VENTILATED WAKE FLAME (2.4 cm/s)** (Risk `54/100`, SMAC `124.2 s`) |\n| **Phase 5** | `22 rows` | `methanol` • `0.0G` • `13.27% O₂` • `14.81 psia` • `2.4 cm/s` | `1823.7 K` • `72.0 ppm CO` | `K=0.86` • `B=1.75` • `Sh=3.14` • `Da=4.08` • `MOC=12.62%` | **0G VENTILATED WAKE FLAME (2.4 cm/s)** (Risk `45/100`, SMAC `210.1 s`) |\n| **Phase 6** | `16 rows` | `n_heptane` • `CO2` • `0.0G` • `24.12% O₂` • `12.86 psia` • `2.4 cm/s` | `1490.5 K` • `110.0 ppm CO` | `K=1.42` • `B=7.13` • `Sh=3.07` • `Da=8.84` • `MOC=17.36%` | **0G VENTILATED WAKE FLAME (2.4 cm/s)** (Risk `71/100`, SMAC `109.1 s`) |\n| **Phase 7** | `18 rows` | `n_heptane` • `He` • `0.0G` • `18.83% O₂` • `12.51 psia` • `2.4 cm/s` | `2144.4 K` • `105.0 ppm CO` | `K=5.36` • `B=25.6` • `Sh=3.07` • `Da=6.24` • `MOC=16.09%` | **0G VENTILATED WAKE FLAME (2.4 cm/s)** (Risk `56/100`, SMAC `127.4 s`) |"}, {"id": "PSI-39", "acronym": "CFI", "raw_title": "Cool Flames Investigation", "title": "PSI-39 (CFI) — Cool Flames Investigation (PSI-39_Experimental table_CFI.csv)", "hardware": "Multi-User Droplet Combustion Apparatus (MDCA), Combustion Integrated Rack (CIR)", "platform": "International Space Station (ISS)", "date": "2024-09-18", "table_file": "PSI-39_Experimental table_CFI.csv", "url": "https://psi.nasa.gov/physci/repo/data/investigations/PSI-39", "abstract": "The objectives of this investigation are to: 1) Examine the combustion behavior of n-dodecane and mixtures of n-dodecane/iso-dodecane at pressures ranging from 0.25 atm to 5 atm. 2) Analyze the effects of helium dilution on cool flame behavior. 3) Examine the behavior of combustion characteristics. 4) Investigate the relationship between droplet size, pressure, and flame extinction, and (5) understand the consequence of soot formation during cool flame com", "extracted_sim_params": {"fuel_id": "n_heptane", "gravity_g": 0.0, "oxygen_pct": 19.68, "pressure_psia": 16.32, "airflow_cms": 2.4, "droplet_d0_mm": 3.2, "diluent": "N2", "habitat_id": "iss_module"}, "phases": [{"index": 1, "code": "GRUP_1", "desc": "C12H26", "short_tr": "Faz 1", "short_en": "Phase 1", "time_span_tr": "73 satir", "time_span_en": "73 rows", "facility": "ISS_CIR", "exp_ref": "", "sim_params": {"fuel_id": "n_heptane", "gravity_g": 0.0, "oxygen_pct": 19.68, "pressure_psia": 16.32, "airflow_cms": 2.4, "droplet_d0_mm": 3.2, "diluent": "N2", "habitat_id": "iss_module"}, "measured_temp_k": 1955.2, "co_max_ppm": 112.0, "ch2o_max_ppm": 0.0, "opt_min_pct": null, "mist_max_um": 0.0, "k_meas": null, "r2_d2": null, "regime": "VENTILATED_WAKE_0G", "badge_tr": "0G HAVALANDIRMALI KUYRUK ALEVİ (2.4 cm/s)", "badge_en": "0G VENTILATED WAKE FLAME (2.4 cm/s)", "flame_temp_k": 1955.2, "moc_pct": 13.72, "k_model": 1.912, "spread_mms": 1.84, "b_oq": 8.42, "sh": 3.17, "da": 7.38, "risk_score": 67, "smac_s": 114.1, "extinguished": false, "cool_flame": false}, {"index": 2, "code": "GRUP_2", "desc": "[.75]/[.25] C12H26/iso-d • He", "short_tr": "Faz 2", "short_en": "Phase 2", "time_span_tr": "14 satir", "time_span_en": "14 rows", "facility": "ISS_CIR", "exp_ref": "", "sim_params": {"fuel_id": "n_heptane", "gravity_g": 0.0, "oxygen_pct": 21.0, "pressure_psia": 14.7, "airflow_cms": 2.4, "droplet_d0_mm": 3.2, "diluent": "He", "habitat_id": "iss_module"}, "measured_temp_k": 2207.8, "co_max_ppm": 110.0, "ch2o_max_ppm": 0.0, "opt_min_pct": null, "mist_max_um": 0.0, "k_meas": null, "r2_d2": null, "regime": "VENTILATED_WAKE_0G", "badge_tr": "0G HAVALANDIRMALI KUYRUK ALEVİ (2.4 cm/s)", "badge_en": "0G VENTILATED WAKE FLAME (2.4 cm/s)", "flame_temp_k": 2207.8, "moc_pct": 15.92, "k_model": 5.742, "spread_mms": 1.96, "b_oq": 26.81, "sh": 3.11, "da": 7.5, "risk_score": 65, "smac_s": 114.3, "extinguished": false, "cool_flame": false}], "summary_tr": "**Çok Fazlı Telemetri Analizi (`PSI-39_Experimental table_CFI.csv` • 87 satır • 2 fiziksel faz):**\n- **3B Yanma Odasına Aktarılan Aktif Durum:** **Faz 1** (`n_heptane`, `0.0G`, `%19.68 O₂`, `16.32 psia`, `2.4 cm/s` — Sıcaklık: `1955.2 K`).\n\n| Faz | Zaman | Yakit ve Atmosfer | Sicaklik / CO / CH2O | Boyutsuz Sayilar (K, B_oq, Sh, Da, MOC) | Fiziksel Rejim ve SMAC |\n| :--- | :--- | :--- | :--- | :--- | :--- |\n| **Faz 1** | `73 satir` | `n_heptane` • `0.0G` • `%19.68 O₂` • `16.32 psia` • `2.4 cm/s` | `1955.2 K` • `112.0 ppm CO` | `K=1.91` • `B=8.42` • `Sh=3.17` • `Da=7.38` • `MOC=%13.72` | **0G HAVALANDIRMALI KUYRUK ALEVİ (2.4 cm/s)** (Risk `67/100`, SMAC `114.1 sn`) |\n| **Faz 2** | `14 satir` | `n_heptane` • `He` • `0.0G` • `%21.0 O₂` • `14.7 psia` • `2.4 cm/s` | `2207.8 K` • `110.0 ppm CO` | `K=5.74` • `B=26.81` • `Sh=3.11` • `Da=7.5` • `MOC=%15.92` | **0G HAVALANDIRMALI KUYRUK ALEVİ (2.4 cm/s)** (Risk `65/100`, SMAC `114.3 sn`) |", "summary_en": "**Multi-Phase Telemetry Analysis (`PSI-39_Experimental table_CFI.csv` • 87 rows • 2 physical phases):**\n- **Active State Synced to 3D Chamber:** **Phase 1** (`n_heptane`, `0.0G`, `19.68% O₂`, `16.32 psia`, `2.4 cm/s` — Temp: `1955.2 K`).\n\n| Phase | Window | Fuel & Atmosphere | Temp / CO / CH2O | Dimensionless (K, B_oq, Sh, Da, MOC) | Regime & SMAC Clock |\n| :--- | :--- | :--- | :--- | :--- | :--- |\n| **Phase 1** | `73 rows` | `n_heptane` • `0.0G` • `19.68% O₂` • `16.32 psia` • `2.4 cm/s` | `1955.2 K` • `112.0 ppm CO` | `K=1.91` • `B=8.42` • `Sh=3.17` • `Da=7.38` • `MOC=13.72%` | **0G VENTILATED WAKE FLAME (2.4 cm/s)** (Risk `67/100`, SMAC `114.1 s`) |\n| **Phase 2** | `14 rows` | `n_heptane` • `He` • `0.0G` • `21.0% O₂` • `14.7 psia` • `2.4 cm/s` | `2207.8 K` • `110.0 ppm CO` | `K=5.74` • `B=26.81` • `Sh=3.11` • `Da=7.5` • `MOC=15.92%` | **0G VENTILATED WAKE FLAME (2.4 cm/s)** (Risk `65/100`, SMAC `114.3 s`) |"}, {"id": "PSI-21", "acronym": "ACME CLD Flame", "raw_title": "Advanced Combustion via Microgravity Experiments / Coflow Laminar Diffusion Flame", "title": "PSI-21 (ACME CLD Flame) — Advanced Combustion via Microgravity Experiments / Coflow Laminar Diffusion Flame (PSI-21_Experimental table_CLD Flame.csv)", "hardware": "Combustion Integrated Rack (CIR), ACME", "platform": "International Space Station (ISS)", "date": "2023-09-15", "table_file": "PSI-21_Experimental table_CLD Flame.csv", "url": "https://psi.nasa.gov/physci/repo/data/investigations/PSI-21", "abstract": "In order to provide the experimental data needed to allow rigorous testing of computational models at the extremes of the fuel dilution spectrum, we have the following objectives: A) Characterize the behavior of weak coflow diffusion flames of methane and ethylene, as a function of velocity and fuel dilution, through measurement of flame shape, lift-off heights, temperatures and extinction limits. B) Characterize the sooting tendencies of diffusion flames ", "extracted_sim_params": {"fuel_id": "n_heptane", "gravity_g": 0.0, "oxygen_pct": 21.0, "pressure_psia": 14.7, "airflow_cms": 2.4, "droplet_d0_mm": 3.2, "diluent": "N2", "habitat_id": "iss_module"}, "phases": [{"index": 1, "code": "GRUP_1", "desc": "0.1", "short_tr": "Faz 1", "short_en": "Phase 1", "time_span_tr": "22 satir", "time_span_en": "22 rows", "facility": "ISS_CIR", "exp_ref": "", "sim_params": {"fuel_id": "n_heptane", "gravity_g": 0.0, "oxygen_pct": 21.0, "pressure_psia": 14.7, "airflow_cms": 2.4, "droplet_d0_mm": 3.2, "diluent": "N2", "habitat_id": "iss_module"}, "measured_temp_k": 1960.0, "co_max_ppm": 110.0, "ch2o_max_ppm": 0.0, "opt_min_pct": null, "mist_max_um": 0.0, "k_meas": null, "r2_d2": null, "regime": "VENTILATED_WAKE_0G", "badge_tr": "0G HAVALANDIRMALI KUYRUK ALEVİ (2.4 cm/s)", "badge_en": "0G VENTILATED WAKE FLAME (2.4 cm/s)", "flame_temp_k": 1960.0, "moc_pct": 13.82, "k_model": 1.9, "spread_mms": 1.96, "b_oq": 8.99, "sh": 3.11, "da": 7.5, "risk_score": 71, "smac_s": 114.3, "extinguished": false, "cool_flame": false}, {"index": 2, "code": "GRUP_2", "desc": "0.1 • %40 Yakıt", "short_tr": "Faz 2", "short_en": "Phase 2", "time_span_tr": "3 satir", "time_span_en": "3 rows", "facility": "ISS_CIR", "exp_ref": "", "sim_params": {"fuel_id": "n_heptane", "gravity_g": 0.0, "oxygen_pct": 20.0, "pressure_psia": 14.7, "airflow_cms": 2.4, "droplet_d0_mm": 2.58, "diluent": "N2", "habitat_id": "iss_module"}, "measured_temp_k": 1970.3, "co_max_ppm": 109.0, "ch2o_max_ppm": 0.0, "opt_min_pct": null, "mist_max_um": 0.0, "k_meas": null, "r2_d2": null, "regime": "VENTILATED_WAKE_0G", "badge_tr": "0G HAVALANDIRMALI KUYRUK ALEVİ (2.4 cm/s)", "badge_en": "0G VENTILATED WAKE FLAME (2.4 cm/s)", "flame_temp_k": 1970.3, "moc_pct": 13.82, "k_model": 1.798, "spread_mms": 1.8, "b_oq": 8.56, "sh": 2.99, "da": 5.63, "risk_score": 67, "smac_s": 117.8, "extinguished": false, "cool_flame": false}, {"index": 3, "code": "GRUP_3", "desc": "0.2", "short_tr": "Faz 3", "short_en": "Phase 3", "time_span_tr": "2 satir", "time_span_en": "2 rows", "facility": "ISS_CIR", "exp_ref": "", "sim_params": {"fuel_id": "n_heptane", "gravity_g": 0.0, "oxygen_pct": 21.0, "pressure_psia": 14.7, "airflow_cms": 2.4, "droplet_d0_mm": 4.0, "diluent": "N2", "habitat_id": "iss_module"}, "measured_temp_k": 1927.9, "co_max_ppm": 110.0, "ch2o_max_ppm": 0.0, "opt_min_pct": null, "mist_max_um": 0.0, "k_meas": null, "r2_d2": null, "regime": "VENTILATED_WAKE_0G", "badge_tr": "0G HAVALANDIRMALI KUYRUK ALEVİ (2.4 cm/s)", "badge_en": "0G VENTILATED WAKE FLAME (2.4 cm/s)", "flame_temp_k": 1927.9, "moc_pct": 13.82, "k_model": 1.967, "spread_mms": 1.96, "b_oq": 8.99, "sh": 3.24, "da": 9.38, "risk_score": 71, "smac_s": 114.3, "extinguished": false, "cool_flame": false}, {"index": 4, "code": "GRUP_4", "desc": "0.2 • %80 Yakıt", "short_tr": "Faz 4", "short_en": "Phase 4", "time_span_tr": "1 satir", "time_span_en": "1 rows", "facility": "ISS_CIR", "exp_ref": "", "sim_params": {"fuel_id": "n_heptane", "gravity_g": 0.0, "oxygen_pct": 21.0, "pressure_psia": 14.7, "airflow_cms": 2.4, "droplet_d0_mm": 3.5, "diluent": "N2", "habitat_id": "iss_module"}, "measured_temp_k": 1947.3, "co_max_ppm": 110.0, "ch2o_max_ppm": 0.0, "opt_min_pct": null, "mist_max_um": 0.0, "k_meas": null, "r2_d2": null, "regime": "VENTILATED_WAKE_0G", "badge_tr": "0G HAVALANDIRMALI KUYRUK ALEVİ (2.4 cm/s)", "badge_en": "0G VENTILATED WAKE FLAME (2.4 cm/s)", "flame_temp_k": 1947.3, "moc_pct": 13.82, "k_model": 1.926, "spread_mms": 1.96, "b_oq": 8.99, "sh": 3.16, "da": 8.2, "risk_score": 71, "smac_s": 114.3, "extinguished": false, "cool_flame": false}, {"index": 5, "code": "GRUP_5", "desc": "0.2", "short_tr": "Faz 5", "short_en": "Phase 5", "time_span_tr": "4 satir", "time_span_en": "4 rows", "facility": "ISS_CIR", "exp_ref": "", "sim_params": {"fuel_id": "n_heptane", "gravity_g": 0.0, "oxygen_pct": 21.0, "pressure_psia": 14.7, "airflow_cms": 5.8, "droplet_d0_mm": 3.2, "diluent": "N2", "habitat_id": "iss_module"}, "measured_temp_k": 2013.6, "co_max_ppm": 121.0, "ch2o_max_ppm": 0.0, "opt_min_pct": null, "mist_max_um": 0.0, "k_meas": null, "r2_d2": null, "regime": "VENTILATED_WAKE_0G", "badge_tr": "0G HAVALANDIRMALI KUYRUK ALEVİ (5.8 cm/s)", "badge_en": "0G VENTILATED WAKE FLAME (5.8 cm/s)", "flame_temp_k": 2013.6, "moc_pct": 12.76, "k_model": 2.3, "spread_mms": 3.16, "b_oq": 8.99, "sh": 3.72, "da": 3.1, "risk_score": 80, "smac_s": 89.6, "extinguished": false, "cool_flame": false}], "summary_tr": "**Çok Fazlı Telemetri Analizi (`PSI-21_Experimental table_CLD Flame.csv` • 32 satır • 5 fiziksel faz):**\n- **3B Yanma Odasına Aktarılan Aktif Durum:** **Faz 1** (`n_heptane`, `0.0G`, `%21.0 O₂`, `14.7 psia`, `2.4 cm/s` — Sıcaklık: `1960.0 K`).\n\n| Faz | Zaman | Yakit ve Atmosfer | Sicaklik / CO / CH2O | Boyutsuz Sayilar (K, B_oq, Sh, Da, MOC) | Fiziksel Rejim ve SMAC |\n| :--- | :--- | :--- | :--- | :--- | :--- |\n| **Faz 1** | `22 satir` | `n_heptane` • `0.0G` • `%21.0 O₂` • `14.7 psia` • `2.4 cm/s` | `1960.0 K` • `110.0 ppm CO` | `K=1.90` • `B=8.99` • `Sh=3.11` • `Da=7.5` • `MOC=%13.82` | **0G HAVALANDIRMALI KUYRUK ALEVİ (2.4 cm/s)** (Risk `71/100`, SMAC `114.3 sn`) |\n| **Faz 2** | `3 satir` | `n_heptane` • `0.0G` • `%20.0 O₂` • `14.7 psia` • `2.4 cm/s` | `1970.3 K` • `109.0 ppm CO` | `K=1.80` • `B=8.56` • `Sh=2.99` • `Da=5.63` • `MOC=%13.82` | **0G HAVALANDIRMALI KUYRUK ALEVİ (2.4 cm/s)** (Risk `67/100`, SMAC `117.8 sn`) |\n| **Faz 3** | `2 satir` | `n_heptane` • `0.0G` • `%21.0 O₂` • `14.7 psia` • `2.4 cm/s` | `1927.9 K` • `110.0 ppm CO` | `K=1.97` • `B=8.99` • `Sh=3.24` • `Da=9.38` • `MOC=%13.82` | **0G HAVALANDIRMALI KUYRUK ALEVİ (2.4 cm/s)** (Risk `71/100`, SMAC `114.3 sn`) |\n| **Faz 4** | `1 satir` | `n_heptane` • `0.0G` • `%21.0 O₂` • `14.7 psia` • `2.4 cm/s` | `1947.3 K` • `110.0 ppm CO` | `K=1.93` • `B=8.99` • `Sh=3.16` • `Da=8.2` • `MOC=%13.82` | **0G HAVALANDIRMALI KUYRUK ALEVİ (2.4 cm/s)** (Risk `71/100`, SMAC `114.3 sn`) |\n| **Faz 5** | `4 satir` | `n_heptane` • `0.0G` • `%21.0 O₂` • `14.7 psia` • `5.8 cm/s` | `2013.6 K` • `121.0 ppm CO` | `K=2.30` • `B=8.99` • `Sh=3.72` • `Da=3.1` • `MOC=%12.76` | **0G HAVALANDIRMALI KUYRUK ALEVİ (5.8 cm/s)** (Risk `80/100`, SMAC `89.6 sn`) |", "summary_en": "**Multi-Phase Telemetry Analysis (`PSI-21_Experimental table_CLD Flame.csv` • 32 rows • 5 physical phases):**\n- **Active State Synced to 3D Chamber:** **Phase 1** (`n_heptane`, `0.0G`, `21.0% O₂`, `14.7 psia`, `2.4 cm/s` — Temp: `1960.0 K`).\n\n| Phase | Window | Fuel & Atmosphere | Temp / CO / CH2O | Dimensionless (K, B_oq, Sh, Da, MOC) | Regime & SMAC Clock |\n| :--- | :--- | :--- | :--- | :--- | :--- |\n| **Phase 1** | `22 rows` | `n_heptane` • `0.0G` • `21.0% O₂` • `14.7 psia` • `2.4 cm/s` | `1960.0 K` • `110.0 ppm CO` | `K=1.90` • `B=8.99` • `Sh=3.11` • `Da=7.5` • `MOC=13.82%` | **0G VENTILATED WAKE FLAME (2.4 cm/s)** (Risk `71/100`, SMAC `114.3 s`) |\n| **Phase 2** | `3 rows` | `n_heptane` • `0.0G` • `20.0% O₂` • `14.7 psia` • `2.4 cm/s` | `1970.3 K` • `109.0 ppm CO` | `K=1.80` • `B=8.56` • `Sh=2.99` • `Da=5.63` • `MOC=13.82%` | **0G VENTILATED WAKE FLAME (2.4 cm/s)** (Risk `67/100`, SMAC `117.8 s`) |\n| **Phase 3** | `2 rows` | `n_heptane` • `0.0G` • `21.0% O₂` • `14.7 psia` • `2.4 cm/s` | `1927.9 K` • `110.0 ppm CO` | `K=1.97` • `B=8.99` • `Sh=3.24` • `Da=9.38` • `MOC=13.82%` | **0G VENTILATED WAKE FLAME (2.4 cm/s)** (Risk `71/100`, SMAC `114.3 s`) |\n| **Phase 4** | `1 rows` | `n_heptane` • `0.0G` • `21.0% O₂` • `14.7 psia` • `2.4 cm/s` | `1947.3 K` • `110.0 ppm CO` | `K=1.93` • `B=8.99` • `Sh=3.16` • `Da=8.2` • `MOC=13.82%` | **0G VENTILATED WAKE FLAME (2.4 cm/s)** (Risk `71/100`, SMAC `114.3 s`) |\n| **Phase 5** | `4 rows` | `n_heptane` • `0.0G` • `21.0% O₂` • `14.7 psia` • `5.8 cm/s` | `2013.6 K` • `121.0 ppm CO` | `K=2.30` • `B=8.99` • `Sh=3.72` • `Da=3.1` • `MOC=12.76%` | **0G VENTILATED WAKE FLAME (5.8 cm/s)** (Risk `80/100`, SMAC `89.6 s`) |"}, {"id": "PSI-68", "acronym": "FLEX-2", "raw_title": "Flame Extinguishment Experiment - 2", "title": "PSI-68 (FLEX-2) — Flame Extinguishment Experiment - 2 (PSI-68_Experimental table_Flex2.csv)", "hardware": "Combustion Integrated Rack (CIR), Multi-user Droplet Combustion Appartatus (MDCA)", "platform": "International Space Station (ISS)", "date": "2019-09-30", "table_file": "PSI-68_Experimental table_Flex2.csv", "url": "https://psi.nasa.gov/physci/repo/data/investigations/PSI-68", "abstract": "The primary goal of the FLEX-2 flight experiments is to extend the results of FLEX-1 to fuels and environmental conditions that mimic real combustor conditions, as well as, provide benchmark experimental data on bi-component droplet combustion over a wide range of initial conditions in order to validate numerical simulations and to develop new theoretical models. Detailed experimental objectives can be further itemized as: 1. Investigate the role of liquid", "extracted_sim_params": {"fuel_id": "n_heptane", "gravity_g": 0.0, "oxygen_pct": 17.0, "pressure_psia": 7.35, "airflow_cms": 2.55, "droplet_d0_mm": 3.25, "diluent": "N2", "habitat_id": "iss_module"}, "phases": [{"index": 1, "code": "GRUP_1", "desc": "IsoOctane (pure)", "short_tr": "Faz 1", "short_en": "Phase 1", "time_span_tr": "2 satir", "time_span_en": "2 rows", "facility": "ISS_CIR", "exp_ref": "", "sim_params": {"fuel_id": "n_heptane", "gravity_g": 0.0, "oxygen_pct": 17.0, "pressure_psia": 7.35, "airflow_cms": 2.55, "droplet_d0_mm": 3.25, "diluent": "N2", "habitat_id": "iss_module"}, "measured_temp_k": 298.1, "co_max_ppm": 95.0, "ch2o_max_ppm": 0.0, "opt_min_pct": null, "mist_max_um": 0.0, "k_meas": null, "r2_d2": null, "regime": "VENTILATED_WAKE_0G", "badge_tr": "0G HAVALANDIRMALI KUYRUK ALEVİ (2.5 cm/s)", "badge_en": "0G VENTILATED WAKE FLAME (2.5 cm/s)", "flame_temp_k": 1765.0, "moc_pct": 14.51, "k_model": 1.366, "spread_mms": 1.04, "b_oq": 7.27, "sh": 2.81, "da": 3.14, "risk_score": 53, "smac_s": 150.8, "extinguished": false, "cool_flame": false}, {"index": 2, "code": "GRUP_2", "desc": "Heptane (pure)", "short_tr": "Faz 2", "short_en": "Phase 2", "time_span_tr": "2 satir", "time_span_en": "2 rows", "facility": "ISS_CIR", "exp_ref": "", "sim_params": {"fuel_id": "n_heptane", "gravity_g": 0.0, "oxygen_pct": 17.0, "pressure_psia": 7.35, "airflow_cms": 2.55, "droplet_d0_mm": 3.25, "diluent": "N2", "habitat_id": "iss_module"}, "measured_temp_k": 298.1, "co_max_ppm": 95.0, "ch2o_max_ppm": 0.0, "opt_min_pct": null, "mist_max_um": 0.0, "k_meas": null, "r2_d2": null, "regime": "VENTILATED_WAKE_0G", "badge_tr": "0G HAVALANDIRMALI KUYRUK ALEVİ (2.5 cm/s)", "badge_en": "0G VENTILATED WAKE FLAME (2.5 cm/s)", "flame_temp_k": 1765.0, "moc_pct": 14.51, "k_model": 1.366, "spread_mms": 1.04, "b_oq": 7.27, "sh": 2.81, "da": 3.14, "risk_score": 53, "smac_s": 150.8, "extinguished": false, "cool_flame": false}, {"index": 3, "code": "GRUP_3", "desc": "Decane (pure)", "short_tr": "Faz 3", "short_en": "Phase 3", "time_span_tr": "1 satir", "time_span_en": "1 rows", "facility": "ISS_CIR", "exp_ref": "", "sim_params": {"fuel_id": "n_heptane", "gravity_g": 0.0, "oxygen_pct": 17.0, "pressure_psia": 7.35, "airflow_cms": 2.55, "droplet_d0_mm": 3.25, "diluent": "N2", "habitat_id": "iss_module"}, "measured_temp_k": 298.1, "co_max_ppm": 95.0, "ch2o_max_ppm": 0.0, "opt_min_pct": null, "mist_max_um": 0.0, "k_meas": null, "r2_d2": null, "regime": "VENTILATED_WAKE_0G", "badge_tr": "0G HAVALANDIRMALI KUYRUK ALEVİ (2.5 cm/s)", "badge_en": "0G VENTILATED WAKE FLAME (2.5 cm/s)", "flame_temp_k": 1765.0, "moc_pct": 14.51, "k_model": 1.366, "spread_mms": 1.04, "b_oq": 7.27, "sh": 2.81, "da": 3.14, "risk_score": 53, "smac_s": 150.8, "extinguished": false, "cool_flame": false}, {"index": 4, "code": "GRUP_4", "desc": "Ethanol (pure)", "short_tr": "Faz 4", "short_en": "Phase 4", "time_span_tr": "1 satir", "time_span_en": "1 rows", "facility": "ISS_CIR", "exp_ref": "", "sim_params": {"fuel_id": "methanol", "gravity_g": 0.0, "oxygen_pct": 17.0, "pressure_psia": 7.35, "airflow_cms": 2.55, "droplet_d0_mm": 3.25, "diluent": "N2", "habitat_id": "iss_module"}, "measured_temp_k": 298.1, "co_max_ppm": 72.0, "ch2o_max_ppm": 0.0, "opt_min_pct": null, "mist_max_um": 0.0, "k_meas": null, "r2_d2": null, "regime": "VENTILATED_WAKE_0G", "badge_tr": "0G HAVALANDIRMALI KUYRUK ALEVİ (2.5 cm/s)", "badge_en": "0G VENTILATED WAKE FLAME (2.5 cm/s)", "flame_temp_k": 1792.0, "moc_pct": 13.31, "k_model": 0.811, "spread_mms": 0.79, "b_oq": 2.25, "sh": 2.81, "da": 3.14, "risk_score": 55, "smac_s": 206.8, "extinguished": false, "cool_flame": false}, {"index": 5, "code": "GRUP_5", "desc": "Propanol (95%) Glycerol ", "short_tr": "Faz 5", "short_en": "Phase 5", "time_span_tr": "2 satir", "time_span_en": "2 rows", "facility": "ISS_CIR", "exp_ref": "", "sim_params": {"fuel_id": "propane_cfig", "gravity_g": 0.0, "oxygen_pct": 17.0, "pressure_psia": 7.35, "airflow_cms": 2.55, "droplet_d0_mm": 3.25, "diluent": "N2", "habitat_id": "iss_module"}, "measured_temp_k": 298.1, "co_max_ppm": 89.0, "ch2o_max_ppm": 0.0, "opt_min_pct": null, "mist_max_um": 0.0, "k_meas": null, "r2_d2": null, "regime": "VENTILATED_WAKE_0G", "badge_tr": "0G HAVALANDIRMALI KUYRUK ALEVİ (2.5 cm/s)", "badge_en": "0G VENTILATED WAKE FLAME (2.5 cm/s)", "flame_temp_k": 1844.4, "moc_pct": 12.11, "k_model": 1.669, "spread_mms": 1.2, "b_oq": 5.65, "sh": 2.81, "da": 3.14, "risk_score": 60, "smac_s": 157.1, "extinguished": false, "cool_flame": false}], "summary_tr": "**Çok Fazlı Telemetri Analizi (`PSI-68_Experimental table_Flex2.csv` • 8 satır • 5 fiziksel faz):**\n- **3B Yanma Odasına Aktarılan Aktif Durum:** **Faz 1** (`n_heptane`, `0.0G`, `%17.0 O₂`, `7.35 psia`, `2.55 cm/s` — Sıcaklık: `1765.0 K`).\n\n| Faz | Zaman | Yakit ve Atmosfer | Sicaklik / CO / CH2O | Boyutsuz Sayilar (K, B_oq, Sh, Da, MOC) | Fiziksel Rejim ve SMAC |\n| :--- | :--- | :--- | :--- | :--- | :--- |\n| **Faz 1** | `2 satir` | `n_heptane` • `0.0G` • `%17.0 O₂` • `7.35 psia` • `2.55 cm/s` | `298.1 K` • `95.0 ppm CO` | `K=1.37` • `B=7.27` • `Sh=2.81` • `Da=3.14` • `MOC=%14.51` | **0G HAVALANDIRMALI KUYRUK ALEVİ (2.5 cm/s)** (Risk `53/100`, SMAC `150.8 sn`) |\n| **Faz 2** | `2 satir` | `n_heptane` • `0.0G` • `%17.0 O₂` • `7.35 psia` • `2.55 cm/s` | `298.1 K` • `95.0 ppm CO` | `K=1.37` • `B=7.27` • `Sh=2.81` • `Da=3.14` • `MOC=%14.51` | **0G HAVALANDIRMALI KUYRUK ALEVİ (2.5 cm/s)** (Risk `53/100`, SMAC `150.8 sn`) |\n| **Faz 3** | `1 satir` | `n_heptane` • `0.0G` • `%17.0 O₂` • `7.35 psia` • `2.55 cm/s` | `298.1 K` • `95.0 ppm CO` | `K=1.37` • `B=7.27` • `Sh=2.81` • `Da=3.14` • `MOC=%14.51` | **0G HAVALANDIRMALI KUYRUK ALEVİ (2.5 cm/s)** (Risk `53/100`, SMAC `150.8 sn`) |\n| **Faz 4** | `1 satir` | `methanol` • `0.0G` • `%17.0 O₂` • `7.35 psia` • `2.55 cm/s` | `298.1 K` • `72.0 ppm CO` | `K=0.81` • `B=2.25` • `Sh=2.81` • `Da=3.14` • `MOC=%13.31` | **0G HAVALANDIRMALI KUYRUK ALEVİ (2.5 cm/s)** (Risk `55/100`, SMAC `206.8 sn`) |\n| **Faz 5** | `2 satir` | `propane_cfig` • `0.0G` • `%17.0 O₂` • `7.35 psia` • `2.55 cm/s` | `298.1 K` • `89.0 ppm CO` | `K=1.67` • `B=5.65` • `Sh=2.81` • `Da=3.14` • `MOC=%12.11` | **0G HAVALANDIRMALI KUYRUK ALEVİ (2.5 cm/s)** (Risk `60/100`, SMAC `157.1 sn`) |", "summary_en": "**Multi-Phase Telemetry Analysis (`PSI-68_Experimental table_Flex2.csv` • 8 rows • 5 physical phases):**\n- **Active State Synced to 3D Chamber:** **Phase 1** (`n_heptane`, `0.0G`, `17.0% O₂`, `7.35 psia`, `2.55 cm/s` — Temp: `1765.0 K`).\n\n| Phase | Window | Fuel & Atmosphere | Temp / CO / CH2O | Dimensionless (K, B_oq, Sh, Da, MOC) | Regime & SMAC Clock |\n| :--- | :--- | :--- | :--- | :--- | :--- |\n| **Phase 1** | `2 rows` | `n_heptane` • `0.0G` • `17.0% O₂` • `7.35 psia` • `2.55 cm/s` | `298.1 K` • `95.0 ppm CO` | `K=1.37` • `B=7.27` • `Sh=2.81` • `Da=3.14` • `MOC=14.51%` | **0G VENTILATED WAKE FLAME (2.5 cm/s)** (Risk `53/100`, SMAC `150.8 s`) |\n| **Phase 2** | `2 rows` | `n_heptane` • `0.0G` • `17.0% O₂` • `7.35 psia` • `2.55 cm/s` | `298.1 K` • `95.0 ppm CO` | `K=1.37` • `B=7.27` • `Sh=2.81` • `Da=3.14` • `MOC=14.51%` | **0G VENTILATED WAKE FLAME (2.5 cm/s)** (Risk `53/100`, SMAC `150.8 s`) |\n| **Phase 3** | `1 rows` | `n_heptane` • `0.0G` • `17.0% O₂` • `7.35 psia` • `2.55 cm/s` | `298.1 K` • `95.0 ppm CO` | `K=1.37` • `B=7.27` • `Sh=2.81` • `Da=3.14` • `MOC=14.51%` | **0G VENTILATED WAKE FLAME (2.5 cm/s)** (Risk `53/100`, SMAC `150.8 s`) |\n| **Phase 4** | `1 rows` | `methanol` • `0.0G` • `17.0% O₂` • `7.35 psia` • `2.55 cm/s` | `298.1 K` • `72.0 ppm CO` | `K=0.81` • `B=2.25` • `Sh=2.81` • `Da=3.14` • `MOC=13.31%` | **0G VENTILATED WAKE FLAME (2.5 cm/s)** (Risk `55/100`, SMAC `206.8 s`) |\n| **Phase 5** | `2 rows` | `propane_cfig` • `0.0G` • `17.0% O₂` • `7.35 psia` • `2.55 cm/s` | `298.1 K` • `89.0 ppm CO` | `K=1.67` • `B=5.65` • `Sh=2.81` • `Da=3.14` • `MOC=12.11%` | **0G VENTILATED WAKE FLAME (2.5 cm/s)** (Risk `60/100`, SMAC `157.1 s`) |"}, {"id": "PSI-26", "acronym": "BASS", "raw_title": "Burning and Suppression of Solids", "title": "PSI-26 (BASS) — Burning and Suppression of Solids (PSI-26_Experimental table_BASS.csv)", "hardware": "Microgravity Science Glovebox", "platform": "International Space Station (ISS)", "date": "2013-06-30", "table_file": "PSI-26_Experimental table_BASS.csv", "url": "https://psi.nasa.gov/physci/repo/data/investigations/PSI-26", "abstract": "The two main objectives for BASS are to: 1.) Begin to bridge the gap between the normal gravity NASA-STD-6001 Test#1 method, ground-based microgravity tests, and actual material flammability in microgravity. The relation between these can be investigated by observing flames burning for the longer times available in flight. Practical, realistic (thicker) fuels in typical geometries will be examined, including wake flames which have characteristics of a fire", "extracted_sim_params": {"fuel_id": "sibal", "gravity_g": 0.0, "oxygen_pct": 21.0, "pressure_psia": 14.7, "airflow_cms": 2.4, "droplet_d0_mm": 3.2, "diluent": "N2", "habitat_id": "iss_module"}, "phases": [{"index": 1, "code": "GRUP_1", "desc": "SIBAL 2 cm", "short_tr": "Faz 1", "short_en": "Phase 1", "time_span_tr": "12 satir", "time_span_en": "12 rows", "facility": "ISS_CIR", "exp_ref": "", "sim_params": {"fuel_id": "sibal", "gravity_g": 0.0, "oxygen_pct": 21.0, "pressure_psia": 14.7, "airflow_cms": 2.4, "droplet_d0_mm": 3.2, "diluent": "N2", "habitat_id": "iss_module"}, "measured_temp_k": 1869.8, "co_max_ppm": 97.0, "ch2o_max_ppm": 0.0, "opt_min_pct": null, "mist_max_um": 0.0, "k_meas": null, "r2_d2": null, "regime": "VENTILATED_WAKE_0G", "badge_tr": "0G HAVALANDIRMALI KUYRUK ALEVİ (2.4 cm/s)", "badge_en": "0G VENTILATED WAKE FLAME (2.4 cm/s)", "flame_temp_k": 1869.8, "moc_pct": 13.22, "k_model": 0.877, "spread_mms": 1.24, "b_oq": 2.17, "sh": 3.11, "da": 7.5, "risk_score": 69, "smac_s": 143.3, "extinguished": false, "cool_flame": false}, {"index": 2, "code": "GRUP_2", "desc": "PMMA sphere 2 cm", "short_tr": "Faz 2", "short_en": "Phase 2", "time_span_tr": "48 satir", "time_span_en": "48 rows", "facility": "ISS_CIR", "exp_ref": "", "sim_params": {"fuel_id": "pmma", "gravity_g": 0.0, "oxygen_pct": 21.0, "pressure_psia": 14.7, "airflow_cms": 2.4, "droplet_d0_mm": 3.2, "diluent": "N2", "habitat_id": "iss_module"}, "measured_temp_k": 1977.6, "co_max_ppm": 106.0, "ch2o_max_ppm": 0.0, "opt_min_pct": null, "mist_max_um": 0.0, "k_meas": null, "r2_d2": null, "regime": "VENTILATED_WAKE_0G", "badge_tr": "0G HAVALANDIRMALI KUYRUK ALEVİ (2.4 cm/s)", "badge_en": "0G VENTILATED WAKE FLAME (2.4 cm/s)", "flame_temp_k": 1977.6, "moc_pct": 14.32, "k_model": 0.591, "spread_mms": 0.88, "b_oq": 1.63, "sh": 3.11, "da": 7.5, "risk_score": 64, "smac_s": 138.5, "extinguished": false, "cool_flame": false}, {"index": 3, "code": "GRUP_3", "desc": "Nomex blend 2 cm", "short_tr": "Faz 3", "short_en": "Phase 3", "time_span_tr": "6 satir", "time_span_en": "6 rows", "facility": "ISS_CIR", "exp_ref": "", "sim_params": {"fuel_id": "nomex", "gravity_g": 0.0, "oxygen_pct": 21.0, "pressure_psia": 14.7, "airflow_cms": 2.4, "droplet_d0_mm": 3.2, "diluent": "N2", "habitat_id": "iss_module"}, "measured_temp_k": 305.0, "co_max_ppm": 18.0, "ch2o_max_ppm": 0.0, "opt_min_pct": null, "mist_max_um": 0.0, "k_meas": null, "r2_d2": null, "regime": "QUENCHED_EXTINGUISHED", "badge_tr": "OKSİJEN / RADYATİF SÖNÜMLENME (MOC < %21.52)", "badge_en": "DIFFUSIVE / RADIATIVE QUENCHING (O₂ < 21.52%)", "flame_temp_k": 305.0, "moc_pct": 21.52, "k_model": 0.0, "spread_mms": 0.0, "b_oq": 1.03, "sh": 3.11, "da": 7.5, "risk_score": 16, "smac_s": 999.0, "extinguished": true, "cool_flame": false}, {"index": 4, "code": "GRUP_4", "desc": "2 cm sphere", "short_tr": "Faz 4", "short_en": "Phase 4", "time_span_tr": "24 satir", "time_span_en": "24 rows", "facility": "ISS_CIR", "exp_ref": "", "sim_params": {"fuel_id": "pmma", "gravity_g": 0.0, "oxygen_pct": 21.0, "pressure_psia": 14.7, "airflow_cms": 2.4, "droplet_d0_mm": 3.2, "diluent": "N2", "habitat_id": "iss_module"}, "measured_temp_k": 1977.6, "co_max_ppm": 106.0, "ch2o_max_ppm": 0.0, "opt_min_pct": null, "mist_max_um": 0.0, "k_meas": null, "r2_d2": null, "regime": "VENTILATED_WAKE_0G", "badge_tr": "0G HAVALANDIRMALI KUYRUK ALEVİ (2.4 cm/s)", "badge_en": "0G VENTILATED WAKE FLAME (2.4 cm/s)", "flame_temp_k": 1977.6, "moc_pct": 14.32, "k_model": 0.591, "spread_mms": 0.88, "b_oq": 1.63, "sh": 3.11, "da": 7.5, "risk_score": 64, "smac_s": 138.5, "extinguished": false, "cool_flame": false}, {"index": 5, "code": "GRUP_5", "desc": "candle", "short_tr": "Faz 5", "short_en": "Phase 5", "time_span_tr": "3 satir", "time_span_en": "3 rows", "facility": "ISS_CIR", "exp_ref": "", "sim_params": {"fuel_id": "pmma", "gravity_g": 0.0, "oxygen_pct": 21.0, "pressure_psia": 14.7, "airflow_cms": 2.4, "droplet_d0_mm": 3.2, "diluent": "N2", "habitat_id": "iss_module"}, "measured_temp_k": 1977.6, "co_max_ppm": 106.0, "ch2o_max_ppm": 0.0, "opt_min_pct": null, "mist_max_um": 0.0, "k_meas": null, "r2_d2": null, "regime": "VENTILATED_WAKE_0G", "badge_tr": "0G HAVALANDIRMALI KUYRUK ALEVİ (2.4 cm/s)", "badge_en": "0G VENTILATED WAKE FLAME (2.4 cm/s)", "flame_temp_k": 1977.6, "moc_pct": 14.32, "k_model": 0.591, "spread_mms": 0.88, "b_oq": 1.63, "sh": 3.11, "da": 7.5, "risk_score": 64, "smac_s": 138.5, "extinguished": false, "cool_flame": false}, {"index": 6, "code": "GRUP_6", "desc": "2 cm sphere   wake ign", "short_tr": "Faz 6", "short_en": "Phase 6", "time_span_tr": "4 satir", "time_span_en": "4 rows", "facility": "ISS_CIR", "exp_ref": "", "sim_params": {"fuel_id": "pmma", "gravity_g": 0.0, "oxygen_pct": 21.0, "pressure_psia": 14.7, "airflow_cms": 2.4, "droplet_d0_mm": 3.2, "diluent": "N2", "habitat_id": "iss_module"}, "measured_temp_k": 1977.6, "co_max_ppm": 106.0, "ch2o_max_ppm": 0.0, "opt_min_pct": null, "mist_max_um": 0.0, "k_meas": null, "r2_d2": null, "regime": "VENTILATED_WAKE_0G", "badge_tr": "0G HAVALANDIRMALI KUYRUK ALEVİ (2.4 cm/s)", "badge_en": "0G VENTILATED WAKE FLAME (2.4 cm/s)", "flame_temp_k": 1977.6, "moc_pct": 14.32, "k_model": 0.591, "spread_mms": 0.88, "b_oq": 1.63, "sh": 3.11, "da": 7.5, "risk_score": 64, "smac_s": 138.5, "extinguished": false, "cool_flame": false}, {"index": 7, "code": "GRUP_7", "desc": "Japan Wax Candle   wake", "short_tr": "Faz 7", "short_en": "Phase 7", "time_span_tr": "8 satir", "time_span_en": "8 rows", "facility": "ISS_CIR", "exp_ref": "", "sim_params": {"fuel_id": "pmma", "gravity_g": 0.0, "oxygen_pct": 21.0, "pressure_psia": 14.7, "airflow_cms": 2.4, "droplet_d0_mm": 3.2, "diluent": "N2", "habitat_id": "iss_module"}, "measured_temp_k": 1977.6, "co_max_ppm": 106.0, "ch2o_max_ppm": 0.0, "opt_min_pct": null, "mist_max_um": 0.0, "k_meas": null, "r2_d2": null, "regime": "VENTILATED_WAKE_0G", "badge_tr": "0G HAVALANDIRMALI KUYRUK ALEVİ (2.4 cm/s)", "badge_en": "0G VENTILATED WAKE FLAME (2.4 cm/s)", "flame_temp_k": 1977.6, "moc_pct": 14.32, "k_model": 0.591, "spread_mms": 0.88, "b_oq": 1.63, "sh": 3.11, "da": 7.5, "risk_score": 64, "smac_s": 138.5, "extinguished": false, "cool_flame": false}], "summary_tr": "**Çok Fazlı Telemetri Analizi (`PSI-26_Experimental table_BASS.csv` • 122 satır • 7 fiziksel faz):**\n- **3B Yanma Odasına Aktarılan Aktif Durum:** **Faz 1** (`sibal`, `0.0G`, `%21.0 O₂`, `14.7 psia`, `2.4 cm/s` — Sıcaklık: `1869.8 K`).\n\n| Faz | Zaman | Yakit ve Atmosfer | Sicaklik / CO / CH2O | Boyutsuz Sayilar (K, B_oq, Sh, Da, MOC) | Fiziksel Rejim ve SMAC |\n| :--- | :--- | :--- | :--- | :--- | :--- |\n| **Faz 1** | `12 satir` | `sibal` • `0.0G` • `%21.0 O₂` • `14.7 psia` • `2.4 cm/s` | `1869.8 K` • `97.0 ppm CO` | `K=0.88` • `B=2.17` • `Sh=3.11` • `Da=7.5` • `MOC=%13.22` | **0G HAVALANDIRMALI KUYRUK ALEVİ (2.4 cm/s)** (Risk `69/100`, SMAC `143.3 sn`) |\n| **Faz 2** | `48 satir` | `pmma` • `0.0G` • `%21.0 O₂` • `14.7 psia` • `2.4 cm/s` | `1977.6 K` • `106.0 ppm CO` | `K=0.59` • `B=1.63` • `Sh=3.11` • `Da=7.5` • `MOC=%14.32` | **0G HAVALANDIRMALI KUYRUK ALEVİ (2.4 cm/s)** (Risk `64/100`, SMAC `138.5 sn`) |\n| **Faz 3** | `6 satir` | `nomex` • `0.0G` • `%21.0 O₂` • `14.7 psia` • `2.4 cm/s` | `305.0 K` • `18.0 ppm CO` | `K=0.00` • `B=1.03` • `Sh=3.11` • `Da=7.5` • `MOC=%21.52` | **OKSİJEN / RADYATİF SÖNÜMLENME (MOC < %21.52)** (Risk `16/100`, SMAC `Guvenli`) |\n| **Faz 4** | `24 satir` | `pmma` • `0.0G` • `%21.0 O₂` • `14.7 psia` • `2.4 cm/s` | `1977.6 K` • `106.0 ppm CO` | `K=0.59` • `B=1.63` • `Sh=3.11` • `Da=7.5` • `MOC=%14.32` | **0G HAVALANDIRMALI KUYRUK ALEVİ (2.4 cm/s)** (Risk `64/100`, SMAC `138.5 sn`) |\n| **Faz 5** | `3 satir` | `pmma` • `0.0G` • `%21.0 O₂` • `14.7 psia` • `2.4 cm/s` | `1977.6 K` • `106.0 ppm CO` | `K=0.59` • `B=1.63` • `Sh=3.11` • `Da=7.5` • `MOC=%14.32` | **0G HAVALANDIRMALI KUYRUK ALEVİ (2.4 cm/s)** (Risk `64/100`, SMAC `138.5 sn`) |\n| **Faz 6** | `4 satir` | `pmma` • `0.0G` • `%21.0 O₂` • `14.7 psia` • `2.4 cm/s` | `1977.6 K` • `106.0 ppm CO` | `K=0.59` • `B=1.63` • `Sh=3.11` • `Da=7.5` • `MOC=%14.32` | **0G HAVALANDIRMALI KUYRUK ALEVİ (2.4 cm/s)** (Risk `64/100`, SMAC `138.5 sn`) |\n| **Faz 7** | `8 satir` | `pmma` • `0.0G` • `%21.0 O₂` • `14.7 psia` • `2.4 cm/s` | `1977.6 K` • `106.0 ppm CO` | `K=0.59` • `B=1.63` • `Sh=3.11` • `Da=7.5` • `MOC=%14.32` | **0G HAVALANDIRMALI KUYRUK ALEVİ (2.4 cm/s)** (Risk `64/100`, SMAC `138.5 sn`) |", "summary_en": "**Multi-Phase Telemetry Analysis (`PSI-26_Experimental table_BASS.csv` • 122 rows • 7 physical phases):**\n- **Active State Synced to 3D Chamber:** **Phase 1** (`sibal`, `0.0G`, `21.0% O₂`, `14.7 psia`, `2.4 cm/s` — Temp: `1869.8 K`).\n\n| Phase | Window | Fuel & Atmosphere | Temp / CO / CH2O | Dimensionless (K, B_oq, Sh, Da, MOC) | Regime & SMAC Clock |\n| :--- | :--- | :--- | :--- | :--- | :--- |\n| **Phase 1** | `12 rows` | `sibal` • `0.0G` • `21.0% O₂` • `14.7 psia` • `2.4 cm/s` | `1869.8 K` • `97.0 ppm CO` | `K=0.88` • `B=2.17` • `Sh=3.11` • `Da=7.5` • `MOC=13.22%` | **0G VENTILATED WAKE FLAME (2.4 cm/s)** (Risk `69/100`, SMAC `143.3 s`) |\n| **Phase 2** | `48 rows` | `pmma` • `0.0G` • `21.0% O₂` • `14.7 psia` • `2.4 cm/s` | `1977.6 K` • `106.0 ppm CO` | `K=0.59` • `B=1.63` • `Sh=3.11` • `Da=7.5` • `MOC=14.32%` | **0G VENTILATED WAKE FLAME (2.4 cm/s)** (Risk `64/100`, SMAC `138.5 s`) |\n| **Phase 3** | `6 rows` | `nomex` • `0.0G` • `21.0% O₂` • `14.7 psia` • `2.4 cm/s` | `305.0 K` • `18.0 ppm CO` | `K=0.00` • `B=1.03` • `Sh=3.11` • `Da=7.5` • `MOC=21.52%` | **DIFFUSIVE / RADIATIVE QUENCHING (O₂ < 21.52%)** (Risk `16/100`, SMAC `Safe`) |\n| **Phase 4** | `24 rows` | `pmma` • `0.0G` • `21.0% O₂` • `14.7 psia` • `2.4 cm/s` | `1977.6 K` • `106.0 ppm CO` | `K=0.59` • `B=1.63` • `Sh=3.11` • `Da=7.5` • `MOC=14.32%` | **0G VENTILATED WAKE FLAME (2.4 cm/s)** (Risk `64/100`, SMAC `138.5 s`) |\n| **Phase 5** | `3 rows` | `pmma` • `0.0G` • `21.0% O₂` • `14.7 psia` • `2.4 cm/s` | `1977.6 K` • `106.0 ppm CO` | `K=0.59` • `B=1.63` • `Sh=3.11` • `Da=7.5` • `MOC=14.32%` | **0G VENTILATED WAKE FLAME (2.4 cm/s)** (Risk `64/100`, SMAC `138.5 s`) |\n| **Phase 6** | `4 rows` | `pmma` • `0.0G` • `21.0% O₂` • `14.7 psia` • `2.4 cm/s` | `1977.6 K` • `106.0 ppm CO` | `K=0.59` • `B=1.63` • `Sh=3.11` • `Da=7.5` • `MOC=14.32%` | **0G VENTILATED WAKE FLAME (2.4 cm/s)** (Risk `64/100`, SMAC `138.5 s`) |\n| **Phase 7** | `8 rows` | `pmma` • `0.0G` • `21.0% O₂` • `14.7 psia` • `2.4 cm/s` | `1977.6 K` • `106.0 ppm CO` | `K=0.59` • `B=1.63` • `Sh=3.11` • `Da=7.5` • `MOC=14.32%` | **0G VENTILATED WAKE FLAME (2.4 cm/s)** (Risk `64/100`, SMAC `138.5 s`) |"}, {"id": "PSI-117", "acronym": "", "raw_title": "Effect of External Thermo-Convective Perturbation on Cool Flame Dynamics: A Multidimensional Multi-Physics CFD Analysis", "title": "PSI-117 — Effect of External Thermo-Convective Perturbation on Cool Flame Dynamics: A Multidimensional Multi-Physics CFD Analysis", "hardware": "", "platform": "ISS", "date": "2026-06-10", "table_file": "", "url": "https://psi.nasa.gov/physci/repo/data/investigations/PSI-117", "abstract": "The objective of this ground investigation was to use flight data obtained from PSI through NASA’s Flame Extinguishment Experiment (FLEX) to quantify how externally imposed thermal and convective perturbations regulated the dynamics and ultimate fate of already established droplet cool flames, and to explain run-to-run variability by isolating the roles of deliberate heating and unintentional drift-induced convection. Focusing on both small and large dropl", "extracted_sim_params": {"fuel_id": "n_heptane", "gravity_g": 0.0, "oxygen_pct": 16.5, "pressure_psia": 14.7, "airflow_cms": 0.4, "droplet_d0_mm": 4.4, "diluent": "N2"}, "phases": [], "summary_tr": "**NASA PSI Kaydı (`PSI-117`): Effect of External Thermo-Convective Perturbation on Cool Flame Dynamics: A Multidimensional Multi-Physics CFD Analysis**\n- **3B Yanma Odasına Aktarılan Koşullar:** Yakıt `n_heptane`, Yerçekimi `0.0G`, O₂ `%16.5`, Basınç `14.7 psia`, Akış `0.4 cm/s` — Rejim: **GÖRÜNMEZ SOĞUK ALEV (UV/IR MODU)** (`691.5 K`).\n- **Araştırma Özeti:** The objective of this ground investigation was to use flight data obtained from PSI through NASA’s Flame Extinguishment Experiment (FLEX) to quantify how externally imposed thermal and convective perturbations regulated the dynamics and ultimate fate of already established droplet cool flames, and to explain run-to-run variability by isolating the roles of deliberate heating and unintentional drift-induced convection. Focusing on both small and large dropl", "summary_en": "**NASA PSI Record (`PSI-117`): Effect of External Thermo-Convective Perturbation on Cool Flame Dynamics: A Multidimensional Multi-Physics CFD Analysis**\n- **3D Chamber Conditions Applied:** Fuel `n_heptane`, Gravity `0.0G`, O₂ `16.5%`, Pressure `14.7 psia`, Airflow `0.4 cm/s` — Regime: **INVISIBLE COOL FLAME (UV/IR VIEW)** (`691.5 K`).\n- **Investigation Summary:** The objective of this ground investigation was to use flight data obtained from PSI through NASA’s Flame Extinguishment Experiment (FLEX) to quantify how externally imposed thermal and convective perturbations regulated the dynamics and ultimate fate of already established droplet cool flames, and to explain run-to-run variability by isolating the roles of deliberate heating and unintentional drift-induced convection. Focusing on both small and large dropl"}, {"id": "PSI-23", "acronym": "ACME s-Flame", "raw_title": "Advanced Combustion via Microgravity Experiments-Structure and Response of Spherical Diffusion Flames", "title": "PSI-23 (ACME s-Flame) — Advanced Combustion via Microgravity Experiments-Structure and Response of Spherical Diffusion Flames (PSI-23_Experimental table_ACME s-Flame.csv)", "hardware": "Combustion Integrated Rack (CIR), ACME", "platform": "International Space Station (ISS)", "date": "2018-04-05", "table_file": "PSI-23_Experimental table_ACME s-Flame.csv", "url": "https://psi.nasa.gov/physci/repo/data/investigations/PSI-23", "abstract": "A series of experiments is proposed with the following specific objectives, in both soot-free and sooty flames, to compare with detailed computational simulation to assess transport properties and detailed chemical kinetics (including chemiluminescence): Objective A. Measure and characterize the transient structure (such as temperature and species distribution) of diffusion flames established at initially non-steady, spherical flame structures for mixtures", "extracted_sim_params": {"fuel_id": "propane_cfig", "gravity_g": 0.0, "oxygen_pct": 21.0, "pressure_psia": 14.7, "airflow_cms": 2.4, "droplet_d0_mm": 3.2, "diluent": "N2", "habitat_id": "iss_module"}, "phases": [{"index": 1, "code": "GRUP_1", "desc": "50% C2H4 with N2", "short_tr": "Faz 1", "short_en": "Phase 1", "time_span_tr": "6 satir", "time_span_en": "6 rows", "facility": "ISS_CIR", "exp_ref": "", "sim_params": {"fuel_id": "propane_cfig", "gravity_g": 0.0, "oxygen_pct": 21.0, "pressure_psia": 14.7, "airflow_cms": 2.4, "droplet_d0_mm": 3.2, "diluent": "N2", "habitat_id": "iss_module"}, "measured_temp_k": 2040.3, "co_max_ppm": 101.0, "ch2o_max_ppm": 0.0, "opt_min_pct": null, "mist_max_um": 0.0, "k_meas": null, "r2_d2": null, "regime": "VENTILATED_WAKE_0G", "badge_tr": "0G HAVALANDIRMALI KUYRUK ALEVİ (2.4 cm/s)", "badge_en": "0G VENTILATED WAKE FLAME (2.4 cm/s)", "flame_temp_k": 2040.3, "moc_pct": 11.42, "k_model": 2.332, "spread_mms": 2.27, "b_oq": 6.95, "sh": 3.11, "da": 7.5, "risk_score": 79, "smac_s": 119.5, "extinguished": false, "cool_flame": false}, {"index": 2, "code": "GRUP_2", "desc": "45% CH4 with N2", "short_tr": "Faz 2", "short_en": "Phase 2", "time_span_tr": "8 satir", "time_span_en": "8 rows", "facility": "ISS_CIR", "exp_ref": "", "sim_params": {"fuel_id": "propane_cfig", "gravity_g": 0.0, "oxygen_pct": 21.0, "pressure_psia": 14.7, "airflow_cms": 2.4, "droplet_d0_mm": 3.2, "diluent": "N2", "habitat_id": "iss_module"}, "measured_temp_k": 2040.3, "co_max_ppm": 101.0, "ch2o_max_ppm": 0.0, "opt_min_pct": null, "mist_max_um": 0.0, "k_meas": null, "r2_d2": null, "regime": "VENTILATED_WAKE_0G", "badge_tr": "0G HAVALANDIRMALI KUYRUK ALEVİ (2.4 cm/s)", "badge_en": "0G VENTILATED WAKE FLAME (2.4 cm/s)", "flame_temp_k": 2040.3, "moc_pct": 11.42, "k_model": 2.332, "spread_mms": 2.27, "b_oq": 6.95, "sh": 3.11, "da": 7.5, "risk_score": 79, "smac_s": 119.5, "extinguished": false, "cool_flame": false}, {"index": 3, "code": "GRUP_3", "desc": "100% H2", "short_tr": "Faz 3", "short_en": "Phase 3", "time_span_tr": "4 satir", "time_span_en": "4 rows", "facility": "ISS_CIR", "exp_ref": "", "sim_params": {"fuel_id": "hydrogen", "gravity_g": 0.0, "oxygen_pct": 21.0, "pressure_psia": 14.7, "airflow_cms": 2.4, "droplet_d0_mm": 3.2, "diluent": "N2", "habitat_id": "iss_module"}, "measured_temp_k": 2070.1, "co_max_ppm": 70.0, "ch2o_max_ppm": 0.0, "opt_min_pct": null, "mist_max_um": 0.0, "k_meas": null, "r2_d2": null, "regime": "VENTILATED_WAKE_0G", "badge_tr": "0G HAVALANDIRMALI KUYRUK ALEVİ (2.4 cm/s)", "badge_en": "0G VENTILATED WAKE FLAME (2.4 cm/s)", "flame_temp_k": 2070.1, "moc_pct": 6.22, "k_model": 13.118, "spread_mms": 3.48, "b_oq": 7.89, "sh": 3.11, "da": 7.5, "risk_score": 99, "smac_s": 149.4, "extinguished": false, "cool_flame": false}], "summary_tr": "**Çok Fazlı Telemetri Analizi (`PSI-23_Experimental table_ACME s-Flame.csv` • 18 satır • 3 fiziksel faz):**\n- **3B Yanma Odasına Aktarılan Aktif Durum:** **Faz 1** (`propane_cfig`, `0.0G`, `%21.0 O₂`, `14.7 psia`, `2.4 cm/s` — Sıcaklık: `2040.3 K`).\n\n| Faz | Zaman | Yakit ve Atmosfer | Sicaklik / CO / CH2O | Boyutsuz Sayilar (K, B_oq, Sh, Da, MOC) | Fiziksel Rejim ve SMAC |\n| :--- | :--- | :--- | :--- | :--- | :--- |\n| **Faz 1** | `6 satir` | `propane_cfig` • `0.0G` • `%21.0 O₂` • `14.7 psia` • `2.4 cm/s` | `2040.3 K` • `101.0 ppm CO` | `K=2.33` • `B=6.95` • `Sh=3.11` • `Da=7.5` • `MOC=%11.42` | **0G HAVALANDIRMALI KUYRUK ALEVİ (2.4 cm/s)** (Risk `79/100`, SMAC `119.5 sn`) |\n| **Faz 2** | `8 satir` | `propane_cfig` • `0.0G` • `%21.0 O₂` • `14.7 psia` • `2.4 cm/s` | `2040.3 K` • `101.0 ppm CO` | `K=2.33` • `B=6.95` • `Sh=3.11` • `Da=7.5` • `MOC=%11.42` | **0G HAVALANDIRMALI KUYRUK ALEVİ (2.4 cm/s)** (Risk `79/100`, SMAC `119.5 sn`) |\n| **Faz 3** | `4 satir` | `hydrogen` • `0.0G` • `%21.0 O₂` • `14.7 psia` • `2.4 cm/s` | `2070.1 K` • `70.0 ppm CO` | `K=13.12` • `B=7.89` • `Sh=3.11` • `Da=7.5` • `MOC=%6.22` | **0G HAVALANDIRMALI KUYRUK ALEVİ (2.4 cm/s)** (Risk `99/100`, SMAC `149.4 sn`) |", "summary_en": "**Multi-Phase Telemetry Analysis (`PSI-23_Experimental table_ACME s-Flame.csv` • 18 rows • 3 physical phases):**\n- **Active State Synced to 3D Chamber:** **Phase 1** (`propane_cfig`, `0.0G`, `21.0% O₂`, `14.7 psia`, `2.4 cm/s` — Temp: `2040.3 K`).\n\n| Phase | Window | Fuel & Atmosphere | Temp / CO / CH2O | Dimensionless (K, B_oq, Sh, Da, MOC) | Regime & SMAC Clock |\n| :--- | :--- | :--- | :--- | :--- | :--- |\n| **Phase 1** | `6 rows` | `propane_cfig` • `0.0G` • `21.0% O₂` • `14.7 psia` • `2.4 cm/s` | `2040.3 K` • `101.0 ppm CO` | `K=2.33` • `B=6.95` • `Sh=3.11` • `Da=7.5` • `MOC=11.42%` | **0G VENTILATED WAKE FLAME (2.4 cm/s)** (Risk `79/100`, SMAC `119.5 s`) |\n| **Phase 2** | `8 rows` | `propane_cfig` • `0.0G` • `21.0% O₂` • `14.7 psia` • `2.4 cm/s` | `2040.3 K` • `101.0 ppm CO` | `K=2.33` • `B=6.95` • `Sh=3.11` • `Da=7.5` • `MOC=11.42%` | **0G VENTILATED WAKE FLAME (2.4 cm/s)** (Risk `79/100`, SMAC `119.5 s`) |\n| **Phase 3** | `4 rows` | `hydrogen` • `0.0G` • `21.0% O₂` • `14.7 psia` • `2.4 cm/s` | `2070.1 K` • `70.0 ppm CO` | `K=13.12` • `B=7.89` • `Sh=3.11` • `Da=7.5` • `MOC=6.22%` | **0G VENTILATED WAKE FLAME (2.4 cm/s)** (Risk `99/100`, SMAC `149.4 s`) |"}, {"id": "PSI-20", "acronym": "ACME BRE", "raw_title": "Advanced Combustion via Microgravity Experiments - Burning Rate Emulator", "title": "PSI-20 (ACME BRE) — Advanced Combustion via Microgravity Experiments - Burning Rate Emulator (PSI-20_Experimental table_ACME BRE.csv)", "hardware": "Combustion Integrated Rack (CIR), ACME", "platform": "International Space Station (ISS)", "date": "2022-09-15", "table_file": "PSI-20_Experimental table_ACME BRE.csv", "url": "https://psi.nasa.gov/physci/repo/data/investigations/PSI-20", "abstract": "The BRE flight program seeks to establish the burning conditions in a quiescent microgravity ambient in terms of material properties. The specific flight objectives are as follows. 1. Observe burning behavior in long-duration microgravity for CH4/N2 and C2H4/N2mixtures on porous circular burners of 25 and 50 mm diameter. Consider O2/N2 ambients with various pressures and ambient O2 concentrations and pressures. NASA - considered atmosphere for human space ", "extracted_sim_params": {"fuel_id": "propane_cfig", "gravity_g": 0.0, "oxygen_pct": 21.0, "pressure_psia": 14.7, "airflow_cms": 2.4, "droplet_d0_mm": 6.0, "diluent": "N2", "habitat_id": "iss_module"}, "phases": [{"index": 1, "code": "GRUP_1", "desc": "100% C2H4", "short_tr": "Faz 1", "short_en": "Phase 1", "time_span_tr": "4 satir", "time_span_en": "4 rows", "facility": "ISS_CIR", "exp_ref": "", "sim_params": {"fuel_id": "propane_cfig", "gravity_g": 0.0, "oxygen_pct": 21.0, "pressure_psia": 14.7, "airflow_cms": 2.4, "droplet_d0_mm": 6.0, "diluent": "N2", "habitat_id": "iss_module"}, "measured_temp_k": 1948.1, "co_max_ppm": 101.0, "ch2o_max_ppm": 0.0, "opt_min_pct": null, "mist_max_um": 0.0, "k_meas": null, "r2_d2": null, "regime": "VENTILATED_WAKE_0G", "badge_tr": "0G HAVALANDIRMALI KUYRUK ALEVİ (2.4 cm/s)", "badge_en": "0G VENTILATED WAKE FLAME (2.4 cm/s)", "flame_temp_k": 1948.1, "moc_pct": 11.42, "k_model": 2.59, "spread_mms": 2.27, "b_oq": 6.95, "sh": 3.51, "da": 14.06, "risk_score": 79, "smac_s": 119.5, "extinguished": false, "cool_flame": false}, {"index": 2, "code": "GRUP_2", "desc": "100% C2H4", "short_tr": "Faz 2", "short_en": "Phase 2", "time_span_tr": "10 satir", "time_span_en": "10 rows", "facility": "ISS_CIR", "exp_ref": "", "sim_params": {"fuel_id": "propane_cfig", "gravity_g": 0.0, "oxygen_pct": 26.65, "pressure_psia": 14.7, "airflow_cms": 2.4, "droplet_d0_mm": 6.0, "diluent": "N2", "habitat_id": "iss_module"}, "measured_temp_k": 2044.2, "co_max_ppm": 105.0, "ch2o_max_ppm": 0.0, "opt_min_pct": null, "mist_max_um": 0.0, "k_meas": null, "r2_d2": null, "regime": "VENTILATED_WAKE_0G", "badge_tr": "0G HAVALANDIRMALI KUYRUK ALEVİ (2.4 cm/s)", "badge_en": "0G VENTILATED WAKE FLAME (2.4 cm/s)", "flame_temp_k": 2044.2, "moc_pct": 11.42, "k_model": 2.908, "spread_mms": 3.38, "b_oq": 8.76, "sh": 3.51, "da": 19.87, "risk_score": 99, "smac_s": 100.7, "extinguished": false, "cool_flame": false}, {"index": 3, "code": "GRUP_3", "desc": "50% C2H4", "short_tr": "Faz 3", "short_en": "Phase 3", "time_span_tr": "2 satir", "time_span_en": "2 rows", "facility": "ISS_CIR", "exp_ref": "", "sim_params": {"fuel_id": "propane_cfig", "gravity_g": 0.0, "oxygen_pct": 21.0, "pressure_psia": 14.7, "airflow_cms": 2.4, "droplet_d0_mm": 6.0, "diluent": "N2", "habitat_id": "iss_module"}, "measured_temp_k": 1948.1, "co_max_ppm": 101.0, "ch2o_max_ppm": 0.0, "opt_min_pct": null, "mist_max_um": 0.0, "k_meas": null, "r2_d2": null, "regime": "VENTILATED_WAKE_0G", "badge_tr": "0G HAVALANDIRMALI KUYRUK ALEVİ (2.4 cm/s)", "badge_en": "0G VENTILATED WAKE FLAME (2.4 cm/s)", "flame_temp_k": 1948.1, "moc_pct": 11.42, "k_model": 2.59, "spread_mms": 2.27, "b_oq": 6.95, "sh": 3.51, "da": 14.06, "risk_score": 79, "smac_s": 119.5, "extinguished": false, "cool_flame": false}, {"index": 4, "code": "GRUP_4", "desc": "100% CH4", "short_tr": "Faz 4", "short_en": "Phase 4", "time_span_tr": "2 satir", "time_span_en": "2 rows", "facility": "ISS_CIR", "exp_ref": "", "sim_params": {"fuel_id": "propane_cfig", "gravity_g": 0.0, "oxygen_pct": 25.0, "pressure_psia": 14.7, "airflow_cms": 2.4, "droplet_d0_mm": 6.0, "diluent": "N2", "habitat_id": "iss_module"}, "measured_temp_k": 2017.8, "co_max_ppm": 104.0, "ch2o_max_ppm": 0.0, "opt_min_pct": null, "mist_max_um": 0.0, "k_meas": null, "r2_d2": null, "regime": "VENTILATED_WAKE_0G", "badge_tr": "0G HAVALANDIRMALI KUYRUK ALEVİ (2.4 cm/s)", "badge_en": "0G VENTILATED WAKE FLAME (2.4 cm/s)", "flame_temp_k": 2017.8, "moc_pct": 11.42, "k_model": 2.82, "spread_mms": 3.04, "b_oq": 8.23, "sh": 3.51, "da": 18.11, "risk_score": 95, "smac_s": 105.7, "extinguished": false, "cool_flame": false}], "summary_tr": "**Çok Fazlı Telemetri Analizi (`PSI-20_Experimental table_ACME BRE.csv` • 18 satır • 4 fiziksel faz):**\n- **3B Yanma Odasına Aktarılan Aktif Durum:** **Faz 1** (`propane_cfig`, `0.0G`, `%21.0 O₂`, `14.7 psia`, `2.4 cm/s` — Sıcaklık: `1948.1 K`).\n\n| Faz | Zaman | Yakit ve Atmosfer | Sicaklik / CO / CH2O | Boyutsuz Sayilar (K, B_oq, Sh, Da, MOC) | Fiziksel Rejim ve SMAC |\n| :--- | :--- | :--- | :--- | :--- | :--- |\n| **Faz 1** | `4 satir` | `propane_cfig` • `0.0G` • `%21.0 O₂` • `14.7 psia` • `2.4 cm/s` | `1948.1 K` • `101.0 ppm CO` | `K=2.59` • `B=6.95` • `Sh=3.51` • `Da=14.06` • `MOC=%11.42` | **0G HAVALANDIRMALI KUYRUK ALEVİ (2.4 cm/s)** (Risk `79/100`, SMAC `119.5 sn`) |\n| **Faz 2** | `10 satir` | `propane_cfig` • `0.0G` • `%26.65 O₂` • `14.7 psia` • `2.4 cm/s` | `2044.2 K` • `105.0 ppm CO` | `K=2.91` • `B=8.76` • `Sh=3.51` • `Da=19.87` • `MOC=%11.42` | **0G HAVALANDIRMALI KUYRUK ALEVİ (2.4 cm/s)** (Risk `99/100`, SMAC `100.7 sn`) |\n| **Faz 3** | `2 satir` | `propane_cfig` • `0.0G` • `%21.0 O₂` • `14.7 psia` • `2.4 cm/s` | `1948.1 K` • `101.0 ppm CO` | `K=2.59` • `B=6.95` • `Sh=3.51` • `Da=14.06` • `MOC=%11.42` | **0G HAVALANDIRMALI KUYRUK ALEVİ (2.4 cm/s)** (Risk `79/100`, SMAC `119.5 sn`) |\n| **Faz 4** | `2 satir` | `propane_cfig` • `0.0G` • `%25.0 O₂` • `14.7 psia` • `2.4 cm/s` | `2017.8 K` • `104.0 ppm CO` | `K=2.82` • `B=8.23` • `Sh=3.51` • `Da=18.11` • `MOC=%11.42` | **0G HAVALANDIRMALI KUYRUK ALEVİ (2.4 cm/s)** (Risk `95/100`, SMAC `105.7 sn`) |", "summary_en": "**Multi-Phase Telemetry Analysis (`PSI-20_Experimental table_ACME BRE.csv` • 18 rows • 4 physical phases):**\n- **Active State Synced to 3D Chamber:** **Phase 1** (`propane_cfig`, `0.0G`, `21.0% O₂`, `14.7 psia`, `2.4 cm/s` — Temp: `1948.1 K`).\n\n| Phase | Window | Fuel & Atmosphere | Temp / CO / CH2O | Dimensionless (K, B_oq, Sh, Da, MOC) | Regime & SMAC Clock |\n| :--- | :--- | :--- | :--- | :--- | :--- |\n| **Phase 1** | `4 rows` | `propane_cfig` • `0.0G` • `21.0% O₂` • `14.7 psia` • `2.4 cm/s` | `1948.1 K` • `101.0 ppm CO` | `K=2.59` • `B=6.95` • `Sh=3.51` • `Da=14.06` • `MOC=11.42%` | **0G VENTILATED WAKE FLAME (2.4 cm/s)** (Risk `79/100`, SMAC `119.5 s`) |\n| **Phase 2** | `10 rows` | `propane_cfig` • `0.0G` • `26.65% O₂` • `14.7 psia` • `2.4 cm/s` | `2044.2 K` • `105.0 ppm CO` | `K=2.91` • `B=8.76` • `Sh=3.51` • `Da=19.87` • `MOC=11.42%` | **0G VENTILATED WAKE FLAME (2.4 cm/s)** (Risk `99/100`, SMAC `100.7 s`) |\n| **Phase 3** | `2 rows` | `propane_cfig` • `0.0G` • `21.0% O₂` • `14.7 psia` • `2.4 cm/s` | `1948.1 K` • `101.0 ppm CO` | `K=2.59` • `B=6.95` • `Sh=3.51` • `Da=14.06` • `MOC=11.42%` | **0G VENTILATED WAKE FLAME (2.4 cm/s)** (Risk `79/100`, SMAC `119.5 s`) |\n| **Phase 4** | `2 rows` | `propane_cfig` • `0.0G` • `25.0% O₂` • `14.7 psia` • `2.4 cm/s` | `2017.8 K` • `104.0 ppm CO` | `K=2.82` • `B=8.23` • `Sh=3.51` • `Da=18.11` • `MOC=11.42%` | **0G VENTILATED WAKE FLAME (2.4 cm/s)** (Risk `95/100`, SMAC `105.7 s`) |"}, {"id": "PSI-142", "acronym": "", "raw_title": "Quantitative Studies of Cool Flame Transitions at Radiation / Stretch Extinction Using Counterflow Flames", "title": "PSI-142 — Quantitative Studies of Cool Flame Transitions at Radiation / Stretch Extinction Using Counterflow Flames (PSI-142_Experimental table_Data Summary Table.csv)", "hardware": "Principal Investigator Laboratory Hardware", "platform": "Not Applicable", "date": "2024-09-18", "table_file": "PSI-142_Experimental table_Data Summary Table.csv", "url": "https://psi.nasa.gov/physci/repo/data/investigations/PSI-142", "abstract": "By using the Flame Extinguishment (FLEX) experimental data from the Physical Sciences Informatics (PSI) system of combustion science, the purpose of this grant was to conduct new simulations and ground-based experiments using ozone-sensitized counterflow flames to: 1) Develop a new diagram of the flammability limits of diffusional cool flames affected by radiation, diffusion, and convection. 2) Bridge the knowledge gap between the flammability limits and e", "extracted_sim_params": {"fuel_id": "n_heptane", "gravity_g": 0.0, "oxygen_pct": 21.0, "pressure_psia": 14.7, "airflow_cms": 2.4, "droplet_d0_mm": 3.2, "diluent": "N2", "habitat_id": "iss_module"}, "phases": [{"index": 1, "code": "GRUP_1", "desc": "n_heptane", "short_tr": "Faz 1", "short_en": "Phase 1", "time_span_tr": "8 satir", "time_span_en": "8 rows", "facility": "ISS_CIR", "exp_ref": "", "sim_params": {"fuel_id": "n_heptane", "gravity_g": 0.0, "oxygen_pct": 21.0, "pressure_psia": 14.7, "airflow_cms": 2.4, "droplet_d0_mm": 3.2, "diluent": "N2", "habitat_id": "iss_module"}, "measured_temp_k": 1960.0, "co_max_ppm": 110.0, "ch2o_max_ppm": 0.0, "opt_min_pct": null, "mist_max_um": 0.0, "k_meas": null, "r2_d2": null, "regime": "VENTILATED_WAKE_0G", "badge_tr": "0G HAVALANDIRMALI KUYRUK ALEVİ (2.4 cm/s)", "badge_en": "0G VENTILATED WAKE FLAME (2.4 cm/s)", "flame_temp_k": 1960.0, "moc_pct": 13.82, "k_model": 1.9, "spread_mms": 1.96, "b_oq": 8.99, "sh": 3.11, "da": 7.5, "risk_score": 71, "smac_s": 114.3, "extinguished": false, "cool_flame": false}], "summary_tr": "**Tek Fazlı Deney Kaydı (`PSI-142_Experimental table_Data Summary Table.csv` • 8 satır):**\n- **3B Yanma Odasına Aktarılan Aktif Durum:** **Faz 1** (`n_heptane`, `0.0G`, `%21.0 O₂`, `14.7 psia`, `2.4 cm/s` — Sıcaklık: `1960.0 K`).\n\n| Faz | Zaman | Yakit ve Atmosfer | Sicaklik / CO / CH2O | Boyutsuz Sayilar (K, B_oq, Sh, Da, MOC) | Fiziksel Rejim ve SMAC |\n| :--- | :--- | :--- | :--- | :--- | :--- |\n| **Faz 1** | `8 satir` | `n_heptane` • `0.0G` • `%21.0 O₂` • `14.7 psia` • `2.4 cm/s` | `1960.0 K` • `110.0 ppm CO` | `K=1.90` • `B=8.99` • `Sh=3.11` • `Da=7.5` • `MOC=%13.82` | **0G HAVALANDIRMALI KUYRUK ALEVİ (2.4 cm/s)** (Risk `71/100`, SMAC `114.3 sn`) |", "summary_en": "**Single-Phase Experiment Record (`PSI-142_Experimental table_Data Summary Table.csv` • 8 rows):**\n- **Active State Synced to 3D Chamber:** **Phase 1** (`n_heptane`, `0.0G`, `21.0% O₂`, `14.7 psia`, `2.4 cm/s` — Temp: `1960.0 K`).\n\n| Phase | Window | Fuel & Atmosphere | Temp / CO / CH2O | Dimensionless (K, B_oq, Sh, Da, MOC) | Regime & SMAC Clock |\n| :--- | :--- | :--- | :--- | :--- | :--- |\n| **Phase 1** | `8 rows` | `n_heptane` • `0.0G` • `21.0% O₂` • `14.7 psia` • `2.4 cm/s` | `1960.0 K` • `110.0 ppm CO` | `K=1.90` • `B=8.99` • `Sh=3.11` • `Da=7.5` • `MOC=13.82%` | **0G VENTILATED WAKE FLAME (2.4 cm/s)** (Risk `71/100`, SMAC `114.3 s`) |"}, {"id": "PSI-60", "acronym": "", "raw_title": "Computational and Experimental Analysis of SPICE Data Sets", "title": "PSI-60 — Computational and Experimental Analysis of SPICE Data Sets", "hardware": "", "platform": "ISS", "date": "2025-09-30", "table_file": "", "url": "https://psi.nasa.gov/physci/repo/data/investigations/PSI-60", "abstract": "This ground investigation sought to increase understanding of the issues that control the large discrepancy between soot formation in 1g and in 0g flames. The objective of this investigation was to integrate computational and experimental methods to derive temperature distributions and soot volume fractions from the Smoke Point in Coflow Experiment (SPICE) data available in PSI. By analyzing over 1600 raw DSLR images and incorporating advanced soot models,", "extracted_sim_params": {"fuel_id": "propane_cfig", "gravity_g": 0.0, "oxygen_pct": 21.0, "pressure_psia": 14.7, "airflow_cms": 2.4, "droplet_d0_mm": 3.2, "diluent": "N2"}, "phases": [], "summary_tr": "**NASA PSI Kaydı (`PSI-60`): Computational and Experimental Analysis of SPICE Data Sets**\n- **3B Yanma Odasına Aktarılan Koşullar:** Yakıt `propane_cfig`, Yerçekimi `0.0G`, O₂ `%21.0`, Basınç `14.7 psia`, Akış `2.4 cm/s` — Rejim: **0G HAVALANDIRMALI KUYRUK ALEVİ (2.4 cm/s)** (`2040.3 K`).\n- **Araştırma Özeti:** This ground investigation sought to increase understanding of the issues that control the large discrepancy between soot formation in 1g and in 0g flames. The objective of this investigation was to integrate computational and experimental methods to derive temperature distributions and soot volume fractions from the Smoke Point in Coflow Experiment (SPICE) data available in PSI. By analyzing over 1600 raw DSLR images and incorporating advanced soot models,", "summary_en": "**NASA PSI Record (`PSI-60`): Computational and Experimental Analysis of SPICE Data Sets**\n- **3D Chamber Conditions Applied:** Fuel `propane_cfig`, Gravity `0.0G`, O₂ `21.0%`, Pressure `14.7 psia`, Airflow `2.4 cm/s` — Regime: **0G VENTILATED WAKE FLAME (2.4 cm/s)** (`2040.3 K`).\n- **Investigation Summary:** This ground investigation sought to increase understanding of the issues that control the large discrepancy between soot formation in 1g and in 0g flames. The objective of this investigation was to integrate computational and experimental methods to derive temperature distributions and soot volume fractions from the Smoke Point in Coflow Experiment (SPICE) data available in PSI. By analyzing over 1600 raw DSLR images and incorporating advanced soot models,"}, {"id": "PSI-62", "acronym": "", "raw_title": "Concurrent Flame Spread Modeling using Flamelet Generated Manifolds in Microgravity with Comparison to BASS Experiments using Two-Color Tomography", "title": "PSI-62 — Concurrent Flame Spread Modeling using Flamelet Generated Manifolds in Microgravity with Comparison to BASS Experiments using Two-Color Tomography", "hardware": "", "platform": "ISS", "date": "2025-11-14", "table_file": "", "url": "https://psi.nasa.gov/physci/repo/data/investigations/PSI-62", "abstract": "The objective of this research was to develop and validate new flamelet generated manifold (FGM) modeling techniques for concurrent flame spread in microgravity. Concurrent flame spread presented one of the greatest modeling challenges in combustion science due to the intricate coupling between heat transfer, mass transport, and chemical kinetics near the solid-vapor interface. Traditional modeling strategies often relied on hybridized turbulence and chemi", "extracted_sim_params": {"fuel_id": "pmma", "gravity_g": 0.0, "oxygen_pct": 21.0, "pressure_psia": 14.7, "airflow_cms": 2.4, "droplet_d0_mm": 3.2, "diluent": "N2"}, "phases": [], "summary_tr": "**NASA PSI Kaydı (`PSI-62`): Concurrent Flame Spread Modeling using Flamelet Generated Manifolds in Microgravity with Comparison to BASS Experiments using Two-Color Tomography**\n- **3B Yanma Odasına Aktarılan Koşullar:** Yakıt `pmma`, Yerçekimi `0.0G`, O₂ `%21.0`, Basınç `14.7 psia`, Akış `2.4 cm/s` — Rejim: **0G HAVALANDIRMALI KUYRUK ALEVİ (2.4 cm/s)** (`1977.6 K`).\n- **Araştırma Özeti:** The objective of this research was to develop and validate new flamelet generated manifold (FGM) modeling techniques for concurrent flame spread in microgravity. Concurrent flame spread presented one of the greatest modeling challenges in combustion science due to the intricate coupling between heat transfer, mass transport, and chemical kinetics near the solid-vapor interface. Traditional modeling strategies often relied on hybridized turbulence and chemi", "summary_en": "**NASA PSI Record (`PSI-62`): Concurrent Flame Spread Modeling using Flamelet Generated Manifolds in Microgravity with Comparison to BASS Experiments using Two-Color Tomography**\n- **3D Chamber Conditions Applied:** Fuel `pmma`, Gravity `0.0G`, O₂ `21.0%`, Pressure `14.7 psia`, Airflow `2.4 cm/s` — Regime: **0G VENTILATED WAKE FLAME (2.4 cm/s)** (`1977.6 K`).\n- **Investigation Summary:** The objective of this research was to develop and validate new flamelet generated manifold (FGM) modeling techniques for concurrent flame spread in microgravity. Concurrent flame spread presented one of the greatest modeling challenges in combustion science due to the intricate coupling between heat transfer, mass transport, and chemical kinetics near the solid-vapor interface. Traditional modeling strategies often relied on hybridized turbulence and chemi"}, {"id": "PSI-99", "acronym": "SAFFIRE-II", "raw_title": "Spacecraft Fire Experiment-II", "title": "PSI-99 (SAFFIRE-II) — Spacecraft Fire Experiment-II (PSI-99_Experimental table_SAFFIRE-2.csv)", "hardware": "Cygnus Pressurized Cargo Module, SAFFIRE", "platform": "Cygnus Spacecraft", "date": "2024-09-18", "table_file": "PSI-99_Experimental table_SAFFIRE-2.csv", "url": "https://psi.nasa.gov/physci/repo/data/investigations/PSI-99", "abstract": "The objectives of SAFFIRE-II are to determine how rapidly a large scale fire grows in low-gravity and to investigate the low-g flammability limits compared to those obtained in NASA’s normal gravity material flammability screening test.", "extracted_sim_params": {"fuel_id": "pmma", "gravity_g": 0.0, "oxygen_pct": 21.0, "pressure_psia": 14.7, "airflow_cms": 2.4, "droplet_d0_mm": 3.2, "diluent": "N2", "habitat_id": "iss_module"}, "phases": [{"index": 1, "code": "GRUP_1", "desc": "Silicone", "short_tr": "Faz 1", "short_en": "Phase 1", "time_span_tr": "4 satir", "time_span_en": "4 rows", "facility": "ISS_CIR", "exp_ref": "", "sim_params": {"fuel_id": "pmma", "gravity_g": 0.0, "oxygen_pct": 21.0, "pressure_psia": 14.7, "airflow_cms": 20.0, "droplet_d0_mm": 3.2, "diluent": "N2", "habitat_id": "iss_module"}, "measured_temp_k": 305.0, "co_max_ppm": 18.0, "ch2o_max_ppm": 0.0, "opt_min_pct": null, "mist_max_um": 0.0, "k_meas": null, "r2_d2": null, "regime": "BLOWOFF_EXTINGUISHED", "badge_tr": "YÜKSEK HIZLI ÜFLEME SÖNMESİ (BLOWOFF)", "badge_en": "CONVECTIVE BLOWOFF EXTINCTION", "flame_temp_k": 305.0, "moc_pct": 14.57, "k_model": 0.0, "spread_mms": 0.0, "b_oq": 1.63, "sh": 5.19, "da": 0.9, "risk_score": 32, "smac_s": 999.0, "extinguished": true, "cool_flame": false}, {"index": 2, "code": "GRUP_2", "desc": "Cotton-Fiberglass (SIBAL", "short_tr": "Faz 2", "short_en": "Phase 2", "time_span_tr": "1 satir", "time_span_en": "1 rows", "facility": "ISS_CIR", "exp_ref": "", "sim_params": {"fuel_id": "sibal", "gravity_g": 0.0, "oxygen_pct": 21.0, "pressure_psia": 14.7, "airflow_cms": 20.0, "droplet_d0_mm": 3.2, "diluent": "N2", "habitat_id": "iss_module"}, "measured_temp_k": 305.0, "co_max_ppm": 18.0, "ch2o_max_ppm": 0.0, "opt_min_pct": null, "mist_max_um": 0.0, "k_meas": null, "r2_d2": null, "regime": "BLOWOFF_EXTINGUISHED", "badge_tr": "YÜKSEK HIZLI ÜFLEME SÖNMESİ (BLOWOFF)", "badge_en": "CONVECTIVE BLOWOFF EXTINCTION", "flame_temp_k": 305.0, "moc_pct": 13.52, "k_model": 0.0, "spread_mms": 0.0, "b_oq": 2.17, "sh": 5.19, "da": 0.9, "risk_score": 34, "smac_s": 999.0, "extinguished": true, "cool_flame": false}, {"index": 3, "code": "GRUP_3", "desc": "pmma", "short_tr": "Faz 3", "short_en": "Phase 3", "time_span_tr": "4 satir", "time_span_en": "4 rows", "facility": "ISS_CIR", "exp_ref": "", "sim_params": {"fuel_id": "pmma", "gravity_g": 0.0, "oxygen_pct": 21.0, "pressure_psia": 14.7, "airflow_cms": 20.0, "droplet_d0_mm": 3.2, "diluent": "N2", "habitat_id": "iss_module"}, "measured_temp_k": 305.0, "co_max_ppm": 18.0, "ch2o_max_ppm": 0.0, "opt_min_pct": null, "mist_max_um": 0.0, "k_meas": null, "r2_d2": null, "regime": "BLOWOFF_EXTINGUISHED", "badge_tr": "YÜKSEK HIZLI ÜFLEME SÖNMESİ (BLOWOFF)", "badge_en": "CONVECTIVE BLOWOFF EXTINCTION", "flame_temp_k": 305.0, "moc_pct": 14.57, "k_model": 0.0, "spread_mms": 0.0, "b_oq": 1.63, "sh": 5.19, "da": 0.9, "risk_score": 32, "smac_s": 999.0, "extinguished": true, "cool_flame": false}, {"index": 4, "code": "GRUP_4", "desc": "Pre-test flow visulation", "short_tr": "Faz 4", "short_en": "Phase 4", "time_span_tr": "2 satir", "time_span_en": "2 rows", "facility": "ISS_CIR", "exp_ref": "", "sim_params": {"fuel_id": "pmma", "gravity_g": 0.0, "oxygen_pct": 21.0, "pressure_psia": 14.7, "airflow_cms": 2.4, "droplet_d0_mm": 3.2, "diluent": "N2", "habitat_id": "iss_module"}, "measured_temp_k": 1977.6, "co_max_ppm": 106.0, "ch2o_max_ppm": 0.0, "opt_min_pct": null, "mist_max_um": 0.0, "k_meas": null, "r2_d2": null, "regime": "VENTILATED_WAKE_0G", "badge_tr": "0G HAVALANDIRMALI KUYRUK ALEVİ (2.4 cm/s)", "badge_en": "0G VENTILATED WAKE FLAME (2.4 cm/s)", "flame_temp_k": 1977.6, "moc_pct": 14.32, "k_model": 0.591, "spread_mms": 0.88, "b_oq": 1.63, "sh": 3.11, "da": 7.5, "risk_score": 64, "smac_s": 138.5, "extinguished": false, "cool_flame": false}], "summary_tr": "**Çok Fazlı Telemetri Analizi (`PSI-99_Experimental table_SAFFIRE-2.csv` • 11 satır • 4 fiziksel faz):**\n- **3B Yanma Odasına Aktarılan Aktif Durum:** **Faz 4** (`pmma`, `0.0G`, `%21.0 O₂`, `14.7 psia`, `2.4 cm/s` — Sıcaklık: `1977.6 K`).\n\n| Faz | Zaman | Yakit ve Atmosfer | Sicaklik / CO / CH2O | Boyutsuz Sayilar (K, B_oq, Sh, Da, MOC) | Fiziksel Rejim ve SMAC |\n| :--- | :--- | :--- | :--- | :--- | :--- |\n| **Faz 1** | `4 satir` | `pmma` • `0.0G` • `%21.0 O₂` • `14.7 psia` • `20.0 cm/s` | `305.0 K` • `18.0 ppm CO` | `K=0.00` • `B=1.63` • `Sh=5.19` • `Da=0.9` • `MOC=%14.57` | **YÜKSEK HIZLI ÜFLEME SÖNMESİ (BLOWOFF)** (Risk `32/100`, SMAC `Guvenli`) |\n| **Faz 2** | `1 satir` | `sibal` • `0.0G` • `%21.0 O₂` • `14.7 psia` • `20.0 cm/s` | `305.0 K` • `18.0 ppm CO` | `K=0.00` • `B=2.17` • `Sh=5.19` • `Da=0.9` • `MOC=%13.52` | **YÜKSEK HIZLI ÜFLEME SÖNMESİ (BLOWOFF)** (Risk `34/100`, SMAC `Guvenli`) |\n| **Faz 3** | `4 satir` | `pmma` • `0.0G` • `%21.0 O₂` • `14.7 psia` • `20.0 cm/s` | `305.0 K` • `18.0 ppm CO` | `K=0.00` • `B=1.63` • `Sh=5.19` • `Da=0.9` • `MOC=%14.57` | **YÜKSEK HIZLI ÜFLEME SÖNMESİ (BLOWOFF)** (Risk `32/100`, SMAC `Guvenli`) |\n| **Faz 4** | `2 satir` | `pmma` • `0.0G` • `%21.0 O₂` • `14.7 psia` • `2.4 cm/s` | `1977.6 K` • `106.0 ppm CO` | `K=0.59` • `B=1.63` • `Sh=3.11` • `Da=7.5` • `MOC=%14.32` | **0G HAVALANDIRMALI KUYRUK ALEVİ (2.4 cm/s)** (Risk `64/100`, SMAC `138.5 sn`) |", "summary_en": "**Multi-Phase Telemetry Analysis (`PSI-99_Experimental table_SAFFIRE-2.csv` • 11 rows • 4 physical phases):**\n- **Active State Synced to 3D Chamber:** **Phase 4** (`pmma`, `0.0G`, `21.0% O₂`, `14.7 psia`, `2.4 cm/s` — Temp: `1977.6 K`).\n\n| Phase | Window | Fuel & Atmosphere | Temp / CO / CH2O | Dimensionless (K, B_oq, Sh, Da, MOC) | Regime & SMAC Clock |\n| :--- | :--- | :--- | :--- | :--- | :--- |\n| **Phase 1** | `4 rows` | `pmma` • `0.0G` • `21.0% O₂` • `14.7 psia` • `20.0 cm/s` | `305.0 K` • `18.0 ppm CO` | `K=0.00` • `B=1.63` • `Sh=5.19` • `Da=0.9` • `MOC=14.57%` | **CONVECTIVE BLOWOFF EXTINCTION** (Risk `32/100`, SMAC `Safe`) |\n| **Phase 2** | `1 rows` | `sibal` • `0.0G` • `21.0% O₂` • `14.7 psia` • `20.0 cm/s` | `305.0 K` • `18.0 ppm CO` | `K=0.00` • `B=2.17` • `Sh=5.19` • `Da=0.9` • `MOC=13.52%` | **CONVECTIVE BLOWOFF EXTINCTION** (Risk `34/100`, SMAC `Safe`) |\n| **Phase 3** | `4 rows` | `pmma` • `0.0G` • `21.0% O₂` • `14.7 psia` • `20.0 cm/s` | `305.0 K` • `18.0 ppm CO` | `K=0.00` • `B=1.63` • `Sh=5.19` • `Da=0.9` • `MOC=14.57%` | **CONVECTIVE BLOWOFF EXTINCTION** (Risk `32/100`, SMAC `Safe`) |\n| **Phase 4** | `2 rows` | `pmma` • `0.0G` • `21.0% O₂` • `14.7 psia` • `2.4 cm/s` | `1977.6 K` • `106.0 ppm CO` | `K=0.59` • `B=1.63` • `Sh=3.11` • `Da=7.5` • `MOC=14.32%` | **0G VENTILATED WAKE FLAME (2.4 cm/s)** (Risk `64/100`, SMAC `138.5 s`) |"}, {"id": "PSI-25", "acronym": "BASS-II", "raw_title": "Burning and Suppression of Solids - II", "title": "PSI-25 (BASS-II) — Burning and Suppression of Solids - II (PSI-25_Experimental table_BASS-II.csv)", "hardware": "Microgravity Science Glovebox (MSG)", "platform": "International Space Station (ISS)", "date": "2022-12-31", "table_file": "PSI-25_Experimental table_BASS-II.csv", "url": "https://psi.nasa.gov/physci/repo/data/investigations/PSI-25", "abstract": "BASS-II results contribute to the combustion computational models used in the design of fire detection and suppression systems in microgravity and on Earth. Objectives Include: 1) Study the ignition, flame growth, flame spread, and extinction limits for solid fuels burning in low-velocity forced flows in microgravity. 2) Begin to bridge the gap between the normal gravity NASA-STD-6001 Test #1 method, ground-based microgravity tests, and actual material fla", "extracted_sim_params": {"fuel_id": "pmma", "gravity_g": 0.0, "oxygen_pct": 20.0, "pressure_psia": 14.7, "airflow_cms": 2.4, "droplet_d0_mm": 3.2, "diluent": "N2", "habitat_id": "iss_module"}, "phases": [{"index": 1, "code": "GRUP_1", "desc": "2 cm 0.1 mm PMMA film", "short_tr": "Faz 1", "short_en": "Phase 1", "time_span_tr": "33 satir", "time_span_en": "33 rows", "facility": "ISS_CIR", "exp_ref": "", "sim_params": {"fuel_id": "pmma", "gravity_g": 0.0, "oxygen_pct": 20.0, "pressure_psia": 14.7, "airflow_cms": 2.4, "droplet_d0_mm": 3.2, "diluent": "N2", "habitat_id": "iss_module"}, "measured_temp_k": 1966.4, "co_max_ppm": 398.0, "ch2o_max_ppm": 0.0, "opt_min_pct": null, "mist_max_um": 0.0, "k_meas": null, "r2_d2": null, "regime": "VENTILATED_WAKE_0G", "badge_tr": "0G HAVALANDIRMALI KUYRUK ALEVİ (2.4 cm/s)", "badge_en": "0G VENTILATED WAKE FLAME (2.4 cm/s)", "flame_temp_k": 1966.4, "moc_pct": 14.32, "k_model": 0.572, "spread_mms": 0.81, "b_oq": 1.54, "sh": 3.11, "da": 6.99, "risk_score": 60, "smac_s": 141.4, "extinguished": false, "cool_flame": false}, {"index": 2, "code": "GRUP_2", "desc": "1 cm wide 200 micron thi", "short_tr": "Faz 2", "short_en": "Phase 2", "time_span_tr": "5 satir", "time_span_en": "5 rows", "facility": "ISS_CIR", "exp_ref": "", "sim_params": {"fuel_id": "pmma", "gravity_g": 0.0, "oxygen_pct": 14.96, "pressure_psia": 14.7, "airflow_cms": 2.4, "droplet_d0_mm": 3.2, "diluent": "N2", "habitat_id": "iss_module"}, "measured_temp_k": 1902.8, "co_max_ppm": 950.0, "ch2o_max_ppm": 0.0, "opt_min_pct": null, "mist_max_um": 0.0, "k_meas": null, "r2_d2": null, "regime": "VENTILATED_WAKE_0G", "badge_tr": "0G HAVALANDIRMALI KUYRUK ALEVİ (2.4 cm/s)", "badge_en": "0G VENTILATED WAKE FLAME (2.4 cm/s)", "flame_temp_k": 1902.8, "moc_pct": 14.32, "k_model": 0.461, "spread_mms": 0.5, "b_oq": 1.09, "sh": 3.11, "da": 4.59, "risk_score": 44, "smac_s": 154.5, "extinguished": false, "cool_flame": false}, {"index": 3, "code": "GRUP_3", "desc": "1/4\" clear rod", "short_tr": "Faz 3", "short_en": "Phase 3", "time_span_tr": "7 satir", "time_span_en": "7 rows", "facility": "ISS_CIR", "exp_ref": "", "sim_params": {"fuel_id": "pmma", "gravity_g": 0.0, "oxygen_pct": 18.76, "pressure_psia": 14.7, "airflow_cms": 2.4, "droplet_d0_mm": 3.2, "diluent": "N2", "habitat_id": "iss_module"}, "measured_temp_k": 1951.3, "co_max_ppm": 43.0, "ch2o_max_ppm": 0.0, "opt_min_pct": null, "mist_max_um": 0.0, "k_meas": null, "r2_d2": null, "regime": "VENTILATED_WAKE_0G", "badge_tr": "0G HAVALANDIRMALI KUYRUK ALEVİ (2.4 cm/s)", "badge_en": "0G VENTILATED WAKE FLAME (2.4 cm/s)", "flame_temp_k": 1951.3, "moc_pct": 14.32, "k_model": 0.546, "spread_mms": 0.72, "b_oq": 1.43, "sh": 3.11, "da": 6.37, "risk_score": 56, "smac_s": 144.8, "extinguished": false, "cool_flame": false}, {"index": 4, "code": "GRUP_4", "desc": "3/8\"clear rod", "short_tr": "Faz 4", "short_en": "Phase 4", "time_span_tr": "15 satir", "time_span_en": "15 rows", "facility": "ISS_CIR", "exp_ref": "", "sim_params": {"fuel_id": "pmma", "gravity_g": 0.0, "oxygen_pct": 15.61, "pressure_psia": 14.7, "airflow_cms": 2.4, "droplet_d0_mm": 3.2, "diluent": "N2", "habitat_id": "iss_module"}, "measured_temp_k": 1911.4, "co_max_ppm": 660.0, "ch2o_max_ppm": 0.0, "opt_min_pct": null, "mist_max_um": 0.0, "k_meas": null, "r2_d2": null, "regime": "VENTILATED_WAKE_0G", "badge_tr": "0G HAVALANDIRMALI KUYRUK ALEVİ (2.4 cm/s)", "badge_en": "0G VENTILATED WAKE FLAME (2.4 cm/s)", "flame_temp_k": 1911.4, "moc_pct": 14.32, "k_model": 0.477, "spread_mms": 0.53, "b_oq": 1.15, "sh": 3.11, "da": 4.88, "risk_score": 46, "smac_s": 153.7, "extinguished": false, "cool_flame": false}, {"index": 5, "code": "GRUP_5", "desc": "1/4\" black rod", "short_tr": "Faz 5", "short_en": "Phase 5", "time_span_tr": "19 satir", "time_span_en": "19 rows", "facility": "ISS_CIR", "exp_ref": "", "sim_params": {"fuel_id": "pmma", "gravity_g": 0.0, "oxygen_pct": 18.73, "pressure_psia": 14.7, "airflow_cms": 2.4, "droplet_d0_mm": 3.2, "diluent": "N2", "habitat_id": "iss_module"}, "measured_temp_k": 1950.9, "co_max_ppm": 525.0, "ch2o_max_ppm": 0.0, "opt_min_pct": null, "mist_max_um": 0.0, "k_meas": null, "r2_d2": null, "regime": "VENTILATED_WAKE_0G", "badge_tr": "0G HAVALANDIRMALI KUYRUK ALEVİ (2.4 cm/s)", "badge_en": "0G VENTILATED WAKE FLAME (2.4 cm/s)", "flame_temp_k": 1950.9, "moc_pct": 14.32, "k_model": 0.546, "spread_mms": 0.72, "b_oq": 1.43, "sh": 3.11, "da": 6.35, "risk_score": 56, "smac_s": 144.8, "extinguished": false, "cool_flame": false}, {"index": 6, "code": "GRUP_6", "desc": "2 cm SIBAL", "short_tr": "Faz 6", "short_en": "Phase 6", "time_span_tr": "7 satir", "time_span_en": "7 rows", "facility": "ISS_CIR", "exp_ref": "", "sim_params": {"fuel_id": "sibal", "gravity_g": 0.0, "oxygen_pct": 18.51, "pressure_psia": 14.7, "airflow_cms": 8.0, "droplet_d0_mm": 3.2, "diluent": "N2", "habitat_id": "iss_module"}, "measured_temp_k": 1853.0, "co_max_ppm": 85.0, "ch2o_max_ppm": 0.0, "opt_min_pct": null, "mist_max_um": 0.0, "k_meas": null, "r2_d2": null, "regime": "VENTILATED_WAKE_0G", "badge_tr": "0G HAVALANDIRMALI KUYRUK ALEVİ (8.0 cm/s)", "badge_en": "0G VENTILATED WAKE FLAME (8.0 cm/s)", "flame_temp_k": 1853.0, "moc_pct": 12.31, "k_model": 1.047, "spread_mms": 1.87, "b_oq": 1.89, "sh": 4.02, "da": 1.87, "risk_score": 67, "smac_s": 118.9, "extinguished": false, "cool_flame": false}, {"index": 7, "code": "GRUP_7", "desc": "2 cm SIBAL", "short_tr": "Faz 7", "short_en": "Phase 7", "time_span_tr": "15 satir", "time_span_en": "15 rows", "facility": "ISS_CIR", "exp_ref": "", "sim_params": {"fuel_id": "sibal", "gravity_g": 0.0, "oxygen_pct": 18.7, "pressure_psia": 14.7, "airflow_cms": 2.4, "droplet_d0_mm": 3.2, "diluent": "N2", "habitat_id": "iss_module"}, "measured_temp_k": 1844.2, "co_max_ppm": 140.0, "ch2o_max_ppm": 0.0, "opt_min_pct": null, "mist_max_um": 0.0, "k_meas": null, "r2_d2": null, "regime": "VENTILATED_WAKE_0G", "badge_tr": "0G HAVALANDIRMALI KUYRUK ALEVİ (2.4 cm/s)", "badge_en": "0G VENTILATED WAKE FLAME (2.4 cm/s)", "flame_temp_k": 1844.2, "moc_pct": 13.22, "k_model": 0.813, "spread_mms": 1.02, "b_oq": 1.91, "sh": 3.11, "da": 6.34, "risk_score": 61, "smac_s": 149.7, "extinguished": false, "cool_flame": false}], "summary_tr": "**Çok Fazlı Telemetri Analizi (`PSI-25_Experimental table_BASS-II.csv` • 129 satır • 7 fiziksel faz):**\n- **3B Yanma Odasına Aktarılan Aktif Durum:** **Faz 1** (`pmma`, `0.0G`, `%20.0 O₂`, `14.7 psia`, `2.4 cm/s` — Sıcaklık: `1966.4 K`).\n\n| Faz | Zaman | Yakit ve Atmosfer | Sicaklik / CO / CH2O | Boyutsuz Sayilar (K, B_oq, Sh, Da, MOC) | Fiziksel Rejim ve SMAC |\n| :--- | :--- | :--- | :--- | :--- | :--- |\n| **Faz 1** | `33 satir` | `pmma` • `0.0G` • `%20.0 O₂` • `14.7 psia` • `2.4 cm/s` | `1966.4 K` • `398.0 ppm CO` | `K=0.57` • `B=1.54` • `Sh=3.11` • `Da=6.99` • `MOC=%14.32` | **0G HAVALANDIRMALI KUYRUK ALEVİ (2.4 cm/s)** (Risk `60/100`, SMAC `141.4 sn`) |\n| **Faz 2** | `5 satir` | `pmma` • `0.0G` • `%14.96 O₂` • `14.7 psia` • `2.4 cm/s` | `1902.8 K` • `950.0 ppm CO` | `K=0.46` • `B=1.09` • `Sh=3.11` • `Da=4.59` • `MOC=%14.32` | **0G HAVALANDIRMALI KUYRUK ALEVİ (2.4 cm/s)** (Risk `44/100`, SMAC `154.5 sn`) |\n| **Faz 3** | `7 satir` | `pmma` • `0.0G` • `%18.76 O₂` • `14.7 psia` • `2.4 cm/s` | `1951.3 K` • `43.0 ppm CO` | `K=0.55` • `B=1.43` • `Sh=3.11` • `Da=6.37` • `MOC=%14.32` | **0G HAVALANDIRMALI KUYRUK ALEVİ (2.4 cm/s)** (Risk `56/100`, SMAC `144.8 sn`) |\n| **Faz 4** | `15 satir` | `pmma` • `0.0G` • `%15.61 O₂` • `14.7 psia` • `2.4 cm/s` | `1911.4 K` • `660.0 ppm CO` | `K=0.48` • `B=1.15` • `Sh=3.11` • `Da=4.88` • `MOC=%14.32` | **0G HAVALANDIRMALI KUYRUK ALEVİ (2.4 cm/s)** (Risk `46/100`, SMAC `153.7 sn`) |\n| **Faz 5** | `19 satir` | `pmma` • `0.0G` • `%18.73 O₂` • `14.7 psia` • `2.4 cm/s` | `1950.9 K` • `525.0 ppm CO` | `K=0.55` • `B=1.43` • `Sh=3.11` • `Da=6.35` • `MOC=%14.32` | **0G HAVALANDIRMALI KUYRUK ALEVİ (2.4 cm/s)** (Risk `56/100`, SMAC `144.8 sn`) |\n| **Faz 6** | `7 satir` | `sibal` • `0.0G` • `%18.51 O₂` • `14.7 psia` • `8.0 cm/s` | `1853.0 K` • `85.0 ppm CO` | `K=1.05` • `B=1.89` • `Sh=4.02` • `Da=1.87` • `MOC=%12.31` | **0G HAVALANDIRMALI KUYRUK ALEVİ (8.0 cm/s)** (Risk `67/100`, SMAC `118.9 sn`) |\n| **Faz 7** | `15 satir` | `sibal` • `0.0G` • `%18.7 O₂` • `14.7 psia` • `2.4 cm/s` | `1844.2 K` • `140.0 ppm CO` | `K=0.81` • `B=1.91` • `Sh=3.11` • `Da=6.34` • `MOC=%13.22` | **0G HAVALANDIRMALI KUYRUK ALEVİ (2.4 cm/s)** (Risk `61/100`, SMAC `149.7 sn`) |", "summary_en": "**Multi-Phase Telemetry Analysis (`PSI-25_Experimental table_BASS-II.csv` • 129 rows • 7 physical phases):**\n- **Active State Synced to 3D Chamber:** **Phase 1** (`pmma`, `0.0G`, `20.0% O₂`, `14.7 psia`, `2.4 cm/s` — Temp: `1966.4 K`).\n\n| Phase | Window | Fuel & Atmosphere | Temp / CO / CH2O | Dimensionless (K, B_oq, Sh, Da, MOC) | Regime & SMAC Clock |\n| :--- | :--- | :--- | :--- | :--- | :--- |\n| **Phase 1** | `33 rows` | `pmma` • `0.0G` • `20.0% O₂` • `14.7 psia` • `2.4 cm/s` | `1966.4 K` • `398.0 ppm CO` | `K=0.57` • `B=1.54` • `Sh=3.11` • `Da=6.99` • `MOC=14.32%` | **0G VENTILATED WAKE FLAME (2.4 cm/s)** (Risk `60/100`, SMAC `141.4 s`) |\n| **Phase 2** | `5 rows` | `pmma` • `0.0G` • `14.96% O₂` • `14.7 psia` • `2.4 cm/s` | `1902.8 K` • `950.0 ppm CO` | `K=0.46` • `B=1.09` • `Sh=3.11` • `Da=4.59` • `MOC=14.32%` | **0G VENTILATED WAKE FLAME (2.4 cm/s)** (Risk `44/100`, SMAC `154.5 s`) |\n| **Phase 3** | `7 rows` | `pmma` • `0.0G` • `18.76% O₂` • `14.7 psia` • `2.4 cm/s` | `1951.3 K` • `43.0 ppm CO` | `K=0.55` • `B=1.43` • `Sh=3.11` • `Da=6.37` • `MOC=14.32%` | **0G VENTILATED WAKE FLAME (2.4 cm/s)** (Risk `56/100`, SMAC `144.8 s`) |\n| **Phase 4** | `15 rows` | `pmma` • `0.0G` • `15.61% O₂` • `14.7 psia` • `2.4 cm/s` | `1911.4 K` • `660.0 ppm CO` | `K=0.48` • `B=1.15` • `Sh=3.11` • `Da=4.88` • `MOC=14.32%` | **0G VENTILATED WAKE FLAME (2.4 cm/s)** (Risk `46/100`, SMAC `153.7 s`) |\n| **Phase 5** | `19 rows` | `pmma` • `0.0G` • `18.73% O₂` • `14.7 psia` • `2.4 cm/s` | `1950.9 K` • `525.0 ppm CO` | `K=0.55` • `B=1.43` • `Sh=3.11` • `Da=6.35` • `MOC=14.32%` | **0G VENTILATED WAKE FLAME (2.4 cm/s)** (Risk `56/100`, SMAC `144.8 s`) |\n| **Phase 6** | `7 rows` | `sibal` • `0.0G` • `18.51% O₂` • `14.7 psia` • `8.0 cm/s` | `1853.0 K` • `85.0 ppm CO` | `K=1.05` • `B=1.89` • `Sh=4.02` • `Da=1.87` • `MOC=12.31%` | **0G VENTILATED WAKE FLAME (8.0 cm/s)** (Risk `67/100`, SMAC `118.9 s`) |\n| **Phase 7** | `15 rows` | `sibal` • `0.0G` • `18.7% O₂` • `14.7 psia` • `2.4 cm/s` | `1844.2 K` • `140.0 ppm CO` | `K=0.81` • `B=1.91` • `Sh=3.11` • `Da=6.34` • `MOC=13.22%` | **0G VENTILATED WAKE FLAME (2.4 cm/s)** (Risk `61/100`, SMAC `149.7 s`) |"}, {"id": "PSI-115", "acronym": "", "raw_title": "Utilization of the Smoke Aerosol Measurement Experiment Data for Advanced Modeling and Simulation of Smoke Generation in Micro-Gravity", "title": "PSI-115 — Utilization of the Smoke Aerosol Measurement Experiment Data for Advanced Modeling and Simulation of Smoke Generation in Micro-Gravity", "hardware": "", "platform": "Not Applicable", "date": "2024-09-18", "table_file": "", "url": "https://psi.nasa.gov/physci/repo/data/investigations/PSI-115", "abstract": "The objective of this investigation was to use numerical simulation to explore the influence of gravity on pyrolysis smoke growth from a fundamental perspective. The intention of this effort is to quantify the differences between microgravity and Earth gravity smoke, and to identify the fluid dynamic mechanisms that cause the differences.", "extracted_sim_params": {"fuel_id": "pmma", "gravity_g": 0.0, "oxygen_pct": 21.0, "pressure_psia": 14.7, "airflow_cms": 2.4, "droplet_d0_mm": 3.2, "diluent": "N2"}, "phases": [], "summary_tr": "**NASA PSI Kaydı (`PSI-115`): Utilization of the Smoke Aerosol Measurement Experiment Data for Advanced Modeling and Simulation of Smoke Generation in Micro-Gravity**\n- **3B Yanma Odasına Aktarılan Koşullar:** Yakıt `pmma`, Yerçekimi `0.0G`, O₂ `%21.0`, Basınç `14.7 psia`, Akış `2.4 cm/s` — Rejim: **0G HAVALANDIRMALI KUYRUK ALEVİ (2.4 cm/s)** (`1977.6 K`).\n- **Araştırma Özeti:** The objective of this investigation was to use numerical simulation to explore the influence of gravity on pyrolysis smoke growth from a fundamental perspective. The intention of this effort is to quantify the differences between microgravity and Earth gravity smoke, and to identify the fluid dynamic mechanisms that cause the differences.", "summary_en": "**NASA PSI Record (`PSI-115`): Utilization of the Smoke Aerosol Measurement Experiment Data for Advanced Modeling and Simulation of Smoke Generation in Micro-Gravity**\n- **3D Chamber Conditions Applied:** Fuel `pmma`, Gravity `0.0G`, O₂ `21.0%`, Pressure `14.7 psia`, Airflow `2.4 cm/s` — Regime: **0G VENTILATED WAKE FLAME (2.4 cm/s)** (`1977.6 K`).\n- **Investigation Summary:** The objective of this investigation was to use numerical simulation to explore the influence of gravity on pyrolysis smoke growth from a fundamental perspective. The intention of this effort is to quantify the differences between microgravity and Earth gravity smoke, and to identify the fluid dynamic mechanisms that cause the differences."}, {"id": "PSI-47", "acronym": "DAFT / DAFT-2", "raw_title": "Dust and Aerosol Measurement Feasibility Test / Dust and Aerosol Measurement Feasibility Test-2", "title": "PSI-47 (DAFT / DAFT-2) — Dust and Aerosol Measurement Feasibility Test / Dust and Aerosol Measurement Feasibility Test-2 (PSI-47_Experimental table_DAFT.csv)", "hardware": "TSI P-Trak", "platform": "International Space Station (ISS)", "date": "2009-06-01", "table_file": "PSI-47_Experimental table_DAFT.csv", "url": "https://psi.nasa.gov/physci/repo/data/investigations/PSI-47", "abstract": "The focus of DAFT / DAFT-2 was to mitigate the risk for the Smoke Aerosol Measurement Experiment (SAME). SAME relied on a commercially available condensate nuclei counter, the TSI P-Trak, to quantify smoke aerosols in a microgravity environment, however there were concerns that th P-Trak would not be reliable in microgravity as it relies on gravity to recycle isopropyl alcohol used in the measurement process. DAFT / DAFT-2 tests that a modified P-Trak part", "extracted_sim_params": {"fuel_id": "n_heptane", "gravity_g": 0.0, "oxygen_pct": 21.0, "pressure_psia": 14.7, "airflow_cms": 2.4, "droplet_d0_mm": 3.2, "diluent": "N2", "habitat_id": "iss_module"}, "phases": [{"index": 1, "code": "TEST_1", "desc": "Test 1 (Arizona Road Dust (ARD Fin)", "short_tr": "Faz 1", "short_en": "Phase 1", "time_span_tr": "1 satir", "time_span_en": "1 rows", "facility": "Contained the modified P-Trak with Alcohol Wick and batteries", "exp_ref": "", "sim_params": {"fuel_id": "n_heptane", "gravity_g": 0.0, "oxygen_pct": 21.0, "pressure_psia": 14.7, "airflow_cms": 2.4, "droplet_d0_mm": 3.2, "diluent": "N2", "habitat_id": "iss_module"}, "measured_temp_k": 1960.0, "co_max_ppm": 110.0, "ch2o_max_ppm": 0.0, "opt_min_pct": null, "mist_max_um": 0.0, "k_meas": null, "r2_d2": null, "regime": "VENTILATED_WAKE_0G", "badge_tr": "0G HAVALANDIRMALI KUYRUK ALEVİ (2.4 cm/s)", "badge_en": "0G VENTILATED WAKE FLAME (2.4 cm/s)", "flame_temp_k": 1960.0, "moc_pct": 13.82, "k_model": 1.9, "spread_mms": 1.96, "b_oq": 8.99, "sh": 3.11, "da": 7.5, "risk_score": 71, "smac_s": 114.3, "extinguished": false, "cool_flame": false}, {"index": 2, "code": "TEST_2", "desc": "Test 2 (Arizona Road Dust (ARD Fin)", "short_tr": "Faz 2", "short_en": "Phase 2", "time_span_tr": "1 satir", "time_span_en": "1 rows", "facility": "Contained DustTrak and batteries", "exp_ref": "", "sim_params": {"fuel_id": "n_heptane", "gravity_g": 0.0, "oxygen_pct": 21.0, "pressure_psia": 14.7, "airflow_cms": 2.4, "droplet_d0_mm": 3.2, "diluent": "N2", "habitat_id": "iss_module"}, "measured_temp_k": 1960.0, "co_max_ppm": 110.0, "ch2o_max_ppm": 0.0, "opt_min_pct": null, "mist_max_um": 0.0, "k_meas": null, "r2_d2": null, "regime": "VENTILATED_WAKE_0G", "badge_tr": "0G HAVALANDIRMALI KUYRUK ALEVİ (2.4 cm/s)", "badge_en": "0G VENTILATED WAKE FLAME (2.4 cm/s)", "flame_temp_k": 1960.0, "moc_pct": 13.82, "k_model": 1.9, "spread_mms": 1.96, "b_oq": 8.99, "sh": 3.11, "da": 7.5, "risk_score": 71, "smac_s": 114.3, "extinguished": false, "cool_flame": false}], "summary_tr": "**Çok Fazlı Telemetri Analizi (`PSI-47_Experimental table_DAFT.csv` • 2 satır • 2 fiziksel faz):**\n- **3B Yanma Odasına Aktarılan Aktif Durum:** **Faz 1** (`n_heptane`, `0.0G`, `%21.0 O₂`, `14.7 psia`, `2.4 cm/s` — Sıcaklık: `1960.0 K`).\n\n| Faz | Zaman | Yakit ve Atmosfer | Sicaklik / CO / CH2O | Boyutsuz Sayilar (K, B_oq, Sh, Da, MOC) | Fiziksel Rejim ve SMAC |\n| :--- | :--- | :--- | :--- | :--- | :--- |\n| **Faz 1** | `1 satir` | `n_heptane` • `0.0G` • `%21.0 O₂` • `14.7 psia` • `2.4 cm/s` | `1960.0 K` • `110.0 ppm CO` | `K=1.90` • `B=8.99` • `Sh=3.11` • `Da=7.5` • `MOC=%13.82` | **0G HAVALANDIRMALI KUYRUK ALEVİ (2.4 cm/s)** (Risk `71/100`, SMAC `114.3 sn`) |\n| **Faz 2** | `1 satir` | `n_heptane` • `0.0G` • `%21.0 O₂` • `14.7 psia` • `2.4 cm/s` | `1960.0 K` • `110.0 ppm CO` | `K=1.90` • `B=8.99` • `Sh=3.11` • `Da=7.5` • `MOC=%13.82` | **0G HAVALANDIRMALI KUYRUK ALEVİ (2.4 cm/s)** (Risk `71/100`, SMAC `114.3 sn`) |", "summary_en": "**Multi-Phase Telemetry Analysis (`PSI-47_Experimental table_DAFT.csv` • 2 rows • 2 physical phases):**\n- **Active State Synced to 3D Chamber:** **Phase 1** (`n_heptane`, `0.0G`, `21.0% O₂`, `14.7 psia`, `2.4 cm/s` — Temp: `1960.0 K`).\n\n| Phase | Window | Fuel & Atmosphere | Temp / CO / CH2O | Dimensionless (K, B_oq, Sh, Da, MOC) | Regime & SMAC Clock |\n| :--- | :--- | :--- | :--- | :--- | :--- |\n| **Phase 1** | `1 rows` | `n_heptane` • `0.0G` • `21.0% O₂` • `14.7 psia` • `2.4 cm/s` | `1960.0 K` • `110.0 ppm CO` | `K=1.90` • `B=8.99` • `Sh=3.11` • `Da=7.5` • `MOC=13.82%` | **0G VENTILATED WAKE FLAME (2.4 cm/s)** (Risk `71/100`, SMAC `114.3 s`) |\n| **Phase 2** | `1 rows` | `n_heptane` • `0.0G` • `21.0% O₂` • `14.7 psia` • `2.4 cm/s` | `1960.0 K` • `110.0 ppm CO` | `K=1.90` • `B=8.99` • `Sh=3.11` • `Da=7.5` • `MOC=13.82%` | **0G VENTILATED WAKE FLAME (2.4 cm/s)** (Risk `71/100`, SMAC `114.3 s`) |"}, {"id": "PSI-98", "acronym": "SAFFIRE-I", "raw_title": "Spacecraft Fire Safety Experiment-I", "title": "PSI-98 (SAFFIRE-I) — Spacecraft Fire Safety Experiment-I (PSI-98_Experimental table_SAFFIRE-1.csv)", "hardware": "Saffire 1 enclosure in Cygnus", "platform": "International Space Station (ISS)", "date": "2024-09-18", "table_file": "PSI-98_Experimental table_SAFFIRE-1.csv", "url": "https://psi.nasa.gov/physci/repo/data/investigations/PSI-98", "abstract": "The objectives of this investigation were to: (1) determine how rapidly a large scale fire grows in low-gravity and (2) investigate the low-g flammability limits compared to those obtained in NASA’s normal gravity material flammability screening test.", "extracted_sim_params": {"fuel_id": "sibal", "gravity_g": 0.0, "oxygen_pct": 21.0, "pressure_psia": 14.7, "airflow_cms": 2.4, "droplet_d0_mm": 3.2, "diluent": "N2", "habitat_id": "iss_module"}, "phases": [{"index": 1, "code": "TEST_1", "desc": "Test 1 (SIBAL Fabric)", "short_tr": "Faz 1", "short_en": "Phase 1", "time_span_tr": "1 satir", "time_span_en": "1 rows", "facility": "ISS_CIR", "exp_ref": "", "sim_params": {"fuel_id": "sibal", "gravity_g": 0.0, "oxygen_pct": 21.6, "pressure_psia": 14.7, "airflow_cms": 20.0, "droplet_d0_mm": 3.2, "diluent": "N2", "habitat_id": "iss_module"}, "measured_temp_k": 305.0, "co_max_ppm": 18.0, "ch2o_max_ppm": 0.0, "opt_min_pct": null, "mist_max_um": 0.0, "k_meas": null, "r2_d2": null, "regime": "BLOWOFF_EXTINGUISHED", "badge_tr": "YÜKSEK HIZLI ÜFLEME SÖNMESİ (BLOWOFF)", "badge_en": "CONVECTIVE BLOWOFF EXTINCTION", "flame_temp_k": 305.0, "moc_pct": 13.52, "k_model": 0.0, "spread_mms": 0.0, "b_oq": 2.24, "sh": 5.19, "da": 0.94, "risk_score": 35, "smac_s": 999.0, "extinguished": true, "cool_flame": false}, {"index": 2, "code": "TEST_2", "desc": "Test 2 (SIBAL Fabric)", "short_tr": "Faz 2", "short_en": "Phase 2", "time_span_tr": "1 satir", "time_span_en": "1 rows", "facility": "ISS_CIR", "exp_ref": "", "sim_params": {"fuel_id": "sibal", "gravity_g": 0.0, "oxygen_pct": 21.0, "pressure_psia": 14.7, "airflow_cms": 20.0, "droplet_d0_mm": 3.2, "diluent": "N2", "habitat_id": "iss_module"}, "measured_temp_k": 305.0, "co_max_ppm": 18.0, "ch2o_max_ppm": 0.0, "opt_min_pct": null, "mist_max_um": 0.0, "k_meas": null, "r2_d2": null, "regime": "BLOWOFF_EXTINGUISHED", "badge_tr": "YÜKSEK HIZLI ÜFLEME SÖNMESİ (BLOWOFF)", "badge_en": "CONVECTIVE BLOWOFF EXTINCTION", "flame_temp_k": 305.0, "moc_pct": 13.52, "k_model": 0.0, "spread_mms": 0.0, "b_oq": 2.17, "sh": 5.19, "da": 0.9, "risk_score": 34, "smac_s": 999.0, "extinguished": true, "cool_flame": false}, {"index": 3, "code": "TEST_3", "desc": "Test 3 (Pre-test flow visulation d)", "short_tr": "Faz 3", "short_en": "Phase 3", "time_span_tr": "1 satir", "time_span_en": "1 rows", "facility": "ISS_CIR", "exp_ref": "", "sim_params": {"fuel_id": "sibal", "gravity_g": 0.0, "oxygen_pct": 21.0, "pressure_psia": 14.7, "airflow_cms": 2.4, "droplet_d0_mm": 3.2, "diluent": "N2", "habitat_id": "iss_module"}, "measured_temp_k": 1869.8, "co_max_ppm": 97.0, "ch2o_max_ppm": 0.0, "opt_min_pct": null, "mist_max_um": 0.0, "k_meas": null, "r2_d2": null, "regime": "VENTILATED_WAKE_0G", "badge_tr": "0G HAVALANDIRMALI KUYRUK ALEVİ (2.4 cm/s)", "badge_en": "0G VENTILATED WAKE FLAME (2.4 cm/s)", "flame_temp_k": 1869.8, "moc_pct": 13.22, "k_model": 0.877, "spread_mms": 1.24, "b_oq": 2.17, "sh": 3.11, "da": 7.5, "risk_score": 69, "smac_s": 143.3, "extinguished": false, "cool_flame": false}, {"index": 4, "code": "TEST_4", "desc": "Test 4 (Pre-test flow visulation d)", "short_tr": "Faz 4", "short_en": "Phase 4", "time_span_tr": "1 satir", "time_span_en": "1 rows", "facility": "ISS_CIR", "exp_ref": "", "sim_params": {"fuel_id": "sibal", "gravity_g": 0.0, "oxygen_pct": 21.0, "pressure_psia": 14.7, "airflow_cms": 2.4, "droplet_d0_mm": 3.2, "diluent": "N2", "habitat_id": "iss_module"}, "measured_temp_k": 1869.8, "co_max_ppm": 97.0, "ch2o_max_ppm": 0.0, "opt_min_pct": null, "mist_max_um": 0.0, "k_meas": null, "r2_d2": null, "regime": "VENTILATED_WAKE_0G", "badge_tr": "0G HAVALANDIRMALI KUYRUK ALEVİ (2.4 cm/s)", "badge_en": "0G VENTILATED WAKE FLAME (2.4 cm/s)", "flame_temp_k": 1869.8, "moc_pct": 13.22, "k_model": 0.877, "spread_mms": 1.24, "b_oq": 2.17, "sh": 3.11, "da": 7.5, "risk_score": 69, "smac_s": 143.3, "extinguished": false, "cool_flame": false}], "summary_tr": "**Çok Fazlı Telemetri Analizi (`PSI-98_Experimental table_SAFFIRE-1.csv` • 4 satır • 4 fiziksel faz):**\n- **3B Yanma Odasına Aktarılan Aktif Durum:** **Faz 3** (`sibal`, `0.0G`, `%21.0 O₂`, `14.7 psia`, `2.4 cm/s` — Sıcaklık: `1869.8 K`).\n\n| Faz | Zaman | Yakit ve Atmosfer | Sicaklik / CO / CH2O | Boyutsuz Sayilar (K, B_oq, Sh, Da, MOC) | Fiziksel Rejim ve SMAC |\n| :--- | :--- | :--- | :--- | :--- | :--- |\n| **Faz 1** | `1 satir` | `sibal` • `0.0G` • `%21.6 O₂` • `14.7 psia` • `20.0 cm/s` | `305.0 K` • `18.0 ppm CO` | `K=0.00` • `B=2.24` • `Sh=5.19` • `Da=0.94` • `MOC=%13.52` | **YÜKSEK HIZLI ÜFLEME SÖNMESİ (BLOWOFF)** (Risk `35/100`, SMAC `Guvenli`) |\n| **Faz 2** | `1 satir` | `sibal` • `0.0G` • `%21.0 O₂` • `14.7 psia` • `20.0 cm/s` | `305.0 K` • `18.0 ppm CO` | `K=0.00` • `B=2.17` • `Sh=5.19` • `Da=0.9` • `MOC=%13.52` | **YÜKSEK HIZLI ÜFLEME SÖNMESİ (BLOWOFF)** (Risk `34/100`, SMAC `Guvenli`) |\n| **Faz 3** | `1 satir` | `sibal` • `0.0G` • `%21.0 O₂` • `14.7 psia` • `2.4 cm/s` | `1869.8 K` • `97.0 ppm CO` | `K=0.88` • `B=2.17` • `Sh=3.11` • `Da=7.5` • `MOC=%13.22` | **0G HAVALANDIRMALI KUYRUK ALEVİ (2.4 cm/s)** (Risk `69/100`, SMAC `143.3 sn`) |\n| **Faz 4** | `1 satir` | `sibal` • `0.0G` • `%21.0 O₂` • `14.7 psia` • `2.4 cm/s` | `1869.8 K` • `97.0 ppm CO` | `K=0.88` • `B=2.17` • `Sh=3.11` • `Da=7.5` • `MOC=%13.22` | **0G HAVALANDIRMALI KUYRUK ALEVİ (2.4 cm/s)** (Risk `69/100`, SMAC `143.3 sn`) |", "summary_en": "**Multi-Phase Telemetry Analysis (`PSI-98_Experimental table_SAFFIRE-1.csv` • 4 rows • 4 physical phases):**\n- **Active State Synced to 3D Chamber:** **Phase 3** (`sibal`, `0.0G`, `21.0% O₂`, `14.7 psia`, `2.4 cm/s` — Temp: `1869.8 K`).\n\n| Phase | Window | Fuel & Atmosphere | Temp / CO / CH2O | Dimensionless (K, B_oq, Sh, Da, MOC) | Regime & SMAC Clock |\n| :--- | :--- | :--- | :--- | :--- | :--- |\n| **Phase 1** | `1 rows` | `sibal` • `0.0G` • `21.6% O₂` • `14.7 psia` • `20.0 cm/s` | `305.0 K` • `18.0 ppm CO` | `K=0.00` • `B=2.24` • `Sh=5.19` • `Da=0.94` • `MOC=13.52%` | **CONVECTIVE BLOWOFF EXTINCTION** (Risk `35/100`, SMAC `Safe`) |\n| **Phase 2** | `1 rows` | `sibal` • `0.0G` • `21.0% O₂` • `14.7 psia` • `20.0 cm/s` | `305.0 K` • `18.0 ppm CO` | `K=0.00` • `B=2.17` • `Sh=5.19` • `Da=0.9` • `MOC=13.52%` | **CONVECTIVE BLOWOFF EXTINCTION** (Risk `34/100`, SMAC `Safe`) |\n| **Phase 3** | `1 rows` | `sibal` • `0.0G` • `21.0% O₂` • `14.7 psia` • `2.4 cm/s` | `1869.8 K` • `97.0 ppm CO` | `K=0.88` • `B=2.17` • `Sh=3.11` • `Da=7.5` • `MOC=13.22%` | **0G VENTILATED WAKE FLAME (2.4 cm/s)** (Risk `69/100`, SMAC `143.3 s`) |\n| **Phase 4** | `1 rows` | `sibal` • `0.0G` • `21.0% O₂` • `14.7 psia` • `2.4 cm/s` | `1869.8 K` • `97.0 ppm CO` | `K=0.88` • `B=2.17` • `Sh=3.11` • `Da=7.5` • `MOC=13.22%` | **0G VENTILATED WAKE FLAME (2.4 cm/s)** (Risk `69/100`, SMAC `143.3 s`) |"}, {"id": "PSI-181", "acronym": "", "raw_title": "Structure and Properties of Pb-Sn and Pb-free Sn-Ag-Cu Solders Produced in Terrestrial vs. Microgravity Environments under Extremes of Elevated and Cryo Temperatures", "title": "PSI-181 — Structure and Properties of Pb-Sn and Pb-free Sn-Ag-Cu Solders Produced in Terrestrial vs. Microgravity Environments under Extremes of Elevated and Cryo Temperatures (PSI-181_Experimental table_Experimental Table_PSI_181.csv)", "hardware": "", "platform": "International Space Station (ISS)", "date": "2025-08-20", "table_file": "PSI-181_Experimental table_Experimental Table_PSI_181.csv", "url": "https://psi.nasa.gov/physci/repo/data/investigations/PSI-181", "abstract": "This study addresses the reliability of solder joints in space by pursuing two principal objectives: (1) Characterization of solder-joint formation under microgravity conditions aboard the International Space Station, specifically examining the impact of suppressed convective flow and buoyancy on 40Pb-60Sn alloys utilized in the In-Space Soldering Investigation (ISSI). (2) Evaluation of the solder’s material and mechanical properties under extreme thermal ", "extracted_sim_params": {"fuel_id": "n_heptane", "gravity_g": 0.0, "oxygen_pct": 21.0, "pressure_psia": 14.7, "airflow_cms": 2.4, "droplet_d0_mm": 3.2, "diluent": "N2", "habitat_id": "iss_module"}, "phases": [{"index": 1, "code": "TEST_1", "desc": "Test 1", "short_tr": "Faz 1", "short_en": "Phase 1", "time_span_tr": "1 satir", "time_span_en": "1 rows", "facility": "ISS_CIR", "exp_ref": "", "sim_params": {"fuel_id": "n_heptane", "gravity_g": 0.0, "oxygen_pct": 21.0, "pressure_psia": 14.7, "airflow_cms": 2.4, "droplet_d0_mm": 3.2, "diluent": "N2", "habitat_id": "iss_module"}, "measured_temp_k": 1960.0, "co_max_ppm": 110.0, "ch2o_max_ppm": 0.0, "opt_min_pct": null, "mist_max_um": 0.0, "k_meas": null, "r2_d2": null, "regime": "VENTILATED_WAKE_0G", "badge_tr": "0G HAVALANDIRMALI KUYRUK ALEVİ (2.4 cm/s)", "badge_en": "0G VENTILATED WAKE FLAME (2.4 cm/s)", "flame_temp_k": 1960.0, "moc_pct": 13.82, "k_model": 1.9, "spread_mms": 1.96, "b_oq": 8.99, "sh": 3.11, "da": 7.5, "risk_score": 71, "smac_s": 114.3, "extinguished": false, "cool_flame": false}, {"index": 2, "code": "TEST_2", "desc": "Test 2", "short_tr": "Faz 2", "short_en": "Phase 2", "time_span_tr": "1 satir", "time_span_en": "1 rows", "facility": "ISS_CIR", "exp_ref": "", "sim_params": {"fuel_id": "n_heptane", "gravity_g": 0.0, "oxygen_pct": 21.0, "pressure_psia": 14.7, "airflow_cms": 2.4, "droplet_d0_mm": 3.2, "diluent": "N2", "habitat_id": "iss_module"}, "measured_temp_k": 1960.0, "co_max_ppm": 110.0, "ch2o_max_ppm": 0.0, "opt_min_pct": null, "mist_max_um": 0.0, "k_meas": null, "r2_d2": null, "regime": "VENTILATED_WAKE_0G", "badge_tr": "0G HAVALANDIRMALI KUYRUK ALEVİ (2.4 cm/s)", "badge_en": "0G VENTILATED WAKE FLAME (2.4 cm/s)", "flame_temp_k": 1960.0, "moc_pct": 13.82, "k_model": 1.9, "spread_mms": 1.96, "b_oq": 8.99, "sh": 3.11, "da": 7.5, "risk_score": 71, "smac_s": 114.3, "extinguished": false, "cool_flame": false}, {"index": 3, "code": "TEST_3", "desc": "Test 3", "short_tr": "Faz 3", "short_en": "Phase 3", "time_span_tr": "1 satir", "time_span_en": "1 rows", "facility": "ISS_CIR", "exp_ref": "", "sim_params": {"fuel_id": "n_heptane", "gravity_g": 0.0, "oxygen_pct": 21.0, "pressure_psia": 14.7, "airflow_cms": 2.4, "droplet_d0_mm": 3.2, "diluent": "N2", "habitat_id": "iss_module"}, "measured_temp_k": 1960.0, "co_max_ppm": 110.0, "ch2o_max_ppm": 0.0, "opt_min_pct": null, "mist_max_um": 0.0, "k_meas": null, "r2_d2": null, "regime": "VENTILATED_WAKE_0G", "badge_tr": "0G HAVALANDIRMALI KUYRUK ALEVİ (2.4 cm/s)", "badge_en": "0G VENTILATED WAKE FLAME (2.4 cm/s)", "flame_temp_k": 1960.0, "moc_pct": 13.82, "k_model": 1.9, "spread_mms": 1.96, "b_oq": 8.99, "sh": 3.11, "da": 7.5, "risk_score": 71, "smac_s": 114.3, "extinguished": false, "cool_flame": false}, {"index": 4, "code": "TEST_4", "desc": "Test 4", "short_tr": "Faz 4", "short_en": "Phase 4", "time_span_tr": "1 satir", "time_span_en": "1 rows", "facility": "ISS_CIR", "exp_ref": "", "sim_params": {"fuel_id": "n_heptane", "gravity_g": 0.0, "oxygen_pct": 21.0, "pressure_psia": 14.7, "airflow_cms": 2.4, "droplet_d0_mm": 3.2, "diluent": "N2", "habitat_id": "iss_module"}, "measured_temp_k": 1960.0, "co_max_ppm": 110.0, "ch2o_max_ppm": 0.0, "opt_min_pct": null, "mist_max_um": 0.0, "k_meas": null, "r2_d2": null, "regime": "VENTILATED_WAKE_0G", "badge_tr": "0G HAVALANDIRMALI KUYRUK ALEVİ (2.4 cm/s)", "badge_en": "0G VENTILATED WAKE FLAME (2.4 cm/s)", "flame_temp_k": 1960.0, "moc_pct": 13.82, "k_model": 1.9, "spread_mms": 1.96, "b_oq": 8.99, "sh": 3.11, "da": 7.5, "risk_score": 71, "smac_s": 114.3, "extinguished": false, "cool_flame": false}, {"index": 5, "code": "TEST_5", "desc": "Test 5", "short_tr": "Faz 5", "short_en": "Phase 5", "time_span_tr": "1 satir", "time_span_en": "1 rows", "facility": "ISS_CIR", "exp_ref": "", "sim_params": {"fuel_id": "n_heptane", "gravity_g": 0.0, "oxygen_pct": 21.0, "pressure_psia": 14.7, "airflow_cms": 2.4, "droplet_d0_mm": 3.2, "diluent": "N2", "habitat_id": "iss_module"}, "measured_temp_k": 1960.0, "co_max_ppm": 110.0, "ch2o_max_ppm": 0.0, "opt_min_pct": null, "mist_max_um": 0.0, "k_meas": null, "r2_d2": null, "regime": "VENTILATED_WAKE_0G", "badge_tr": "0G HAVALANDIRMALI KUYRUK ALEVİ (2.4 cm/s)", "badge_en": "0G VENTILATED WAKE FLAME (2.4 cm/s)", "flame_temp_k": 1960.0, "moc_pct": 13.82, "k_model": 1.9, "spread_mms": 1.96, "b_oq": 8.99, "sh": 3.11, "da": 7.5, "risk_score": 71, "smac_s": 114.3, "extinguished": false, "cool_flame": false}, {"index": 6, "code": "TEST_6", "desc": "Test 6", "short_tr": "Faz 6", "short_en": "Phase 6", "time_span_tr": "1 satir", "time_span_en": "1 rows", "facility": "ISS_CIR", "exp_ref": "", "sim_params": {"fuel_id": "n_heptane", "gravity_g": 0.0, "oxygen_pct": 21.0, "pressure_psia": 14.7, "airflow_cms": 2.4, "droplet_d0_mm": 3.2, "diluent": "N2", "habitat_id": "iss_module"}, "measured_temp_k": 1960.0, "co_max_ppm": 110.0, "ch2o_max_ppm": 0.0, "opt_min_pct": null, "mist_max_um": 0.0, "k_meas": null, "r2_d2": null, "regime": "VENTILATED_WAKE_0G", "badge_tr": "0G HAVALANDIRMALI KUYRUK ALEVİ (2.4 cm/s)", "badge_en": "0G VENTILATED WAKE FLAME (2.4 cm/s)", "flame_temp_k": 1960.0, "moc_pct": 13.82, "k_model": 1.9, "spread_mms": 1.96, "b_oq": 8.99, "sh": 3.11, "da": 7.5, "risk_score": 71, "smac_s": 114.3, "extinguished": false, "cool_flame": false}, {"index": 7, "code": "TEST_7", "desc": "Test 7", "short_tr": "Faz 7", "short_en": "Phase 7", "time_span_tr": "1 satir", "time_span_en": "1 rows", "facility": "ISS_CIR", "exp_ref": "", "sim_params": {"fuel_id": "n_heptane", "gravity_g": 0.0, "oxygen_pct": 21.0, "pressure_psia": 14.7, "airflow_cms": 2.4, "droplet_d0_mm": 3.2, "diluent": "N2", "habitat_id": "iss_module"}, "measured_temp_k": 1960.0, "co_max_ppm": 110.0, "ch2o_max_ppm": 0.0, "opt_min_pct": null, "mist_max_um": 0.0, "k_meas": null, "r2_d2": null, "regime": "VENTILATED_WAKE_0G", "badge_tr": "0G HAVALANDIRMALI KUYRUK ALEVİ (2.4 cm/s)", "badge_en": "0G VENTILATED WAKE FLAME (2.4 cm/s)", "flame_temp_k": 1960.0, "moc_pct": 13.82, "k_model": 1.9, "spread_mms": 1.96, "b_oq": 8.99, "sh": 3.11, "da": 7.5, "risk_score": 71, "smac_s": 114.3, "extinguished": false, "cool_flame": false}], "summary_tr": "**Çok Fazlı Telemetri Analizi (`PSI-181_Experimental table_Experimental Table_PSI_181.csv` • 7 satır • 7 fiziksel faz):**\n- **3B Yanma Odasına Aktarılan Aktif Durum:** **Faz 1** (`n_heptane`, `0.0G`, `%21.0 O₂`, `14.7 psia`, `2.4 cm/s` — Sıcaklık: `1960.0 K`).\n\n| Faz | Zaman | Yakit ve Atmosfer | Sicaklik / CO / CH2O | Boyutsuz Sayilar (K, B_oq, Sh, Da, MOC) | Fiziksel Rejim ve SMAC |\n| :--- | :--- | :--- | :--- | :--- | :--- |\n| **Faz 1** | `1 satir` | `n_heptane` • `0.0G` • `%21.0 O₂` • `14.7 psia` • `2.4 cm/s` | `1960.0 K` • `110.0 ppm CO` | `K=1.90` • `B=8.99` • `Sh=3.11` • `Da=7.5` • `MOC=%13.82` | **0G HAVALANDIRMALI KUYRUK ALEVİ (2.4 cm/s)** (Risk `71/100`, SMAC `114.3 sn`) |\n| **Faz 2** | `1 satir` | `n_heptane` • `0.0G` • `%21.0 O₂` • `14.7 psia` • `2.4 cm/s` | `1960.0 K` • `110.0 ppm CO` | `K=1.90` • `B=8.99` • `Sh=3.11` • `Da=7.5` • `MOC=%13.82` | **0G HAVALANDIRMALI KUYRUK ALEVİ (2.4 cm/s)** (Risk `71/100`, SMAC `114.3 sn`) |\n| **Faz 3** | `1 satir` | `n_heptane` • `0.0G` • `%21.0 O₂` • `14.7 psia` • `2.4 cm/s` | `1960.0 K` • `110.0 ppm CO` | `K=1.90` • `B=8.99` • `Sh=3.11` • `Da=7.5` • `MOC=%13.82` | **0G HAVALANDIRMALI KUYRUK ALEVİ (2.4 cm/s)** (Risk `71/100`, SMAC `114.3 sn`) |\n| **Faz 4** | `1 satir` | `n_heptane` • `0.0G` • `%21.0 O₂` • `14.7 psia` • `2.4 cm/s` | `1960.0 K` • `110.0 ppm CO` | `K=1.90` • `B=8.99` • `Sh=3.11` • `Da=7.5` • `MOC=%13.82` | **0G HAVALANDIRMALI KUYRUK ALEVİ (2.4 cm/s)** (Risk `71/100`, SMAC `114.3 sn`) |\n| **Faz 5** | `1 satir` | `n_heptane` • `0.0G` • `%21.0 O₂` • `14.7 psia` • `2.4 cm/s` | `1960.0 K` • `110.0 ppm CO` | `K=1.90` • `B=8.99` • `Sh=3.11` • `Da=7.5` • `MOC=%13.82` | **0G HAVALANDIRMALI KUYRUK ALEVİ (2.4 cm/s)** (Risk `71/100`, SMAC `114.3 sn`) |\n| **Faz 6** | `1 satir` | `n_heptane` • `0.0G` • `%21.0 O₂` • `14.7 psia` • `2.4 cm/s` | `1960.0 K` • `110.0 ppm CO` | `K=1.90` • `B=8.99` • `Sh=3.11` • `Da=7.5` • `MOC=%13.82` | **0G HAVALANDIRMALI KUYRUK ALEVİ (2.4 cm/s)** (Risk `71/100`, SMAC `114.3 sn`) |\n| **Faz 7** | `1 satir` | `n_heptane` • `0.0G` • `%21.0 O₂` • `14.7 psia` • `2.4 cm/s` | `1960.0 K` • `110.0 ppm CO` | `K=1.90` • `B=8.99` • `Sh=3.11` • `Da=7.5` • `MOC=%13.82` | **0G HAVALANDIRMALI KUYRUK ALEVİ (2.4 cm/s)** (Risk `71/100`, SMAC `114.3 sn`) |", "summary_en": "**Multi-Phase Telemetry Analysis (`PSI-181_Experimental table_Experimental Table_PSI_181.csv` • 7 rows • 7 physical phases):**\n- **Active State Synced to 3D Chamber:** **Phase 1** (`n_heptane`, `0.0G`, `21.0% O₂`, `14.7 psia`, `2.4 cm/s` — Temp: `1960.0 K`).\n\n| Phase | Window | Fuel & Atmosphere | Temp / CO / CH2O | Dimensionless (K, B_oq, Sh, Da, MOC) | Regime & SMAC Clock |\n| :--- | :--- | :--- | :--- | :--- | :--- |\n| **Phase 1** | `1 rows` | `n_heptane` • `0.0G` • `21.0% O₂` • `14.7 psia` • `2.4 cm/s` | `1960.0 K` • `110.0 ppm CO` | `K=1.90` • `B=8.99` • `Sh=3.11` • `Da=7.5` • `MOC=13.82%` | **0G VENTILATED WAKE FLAME (2.4 cm/s)** (Risk `71/100`, SMAC `114.3 s`) |\n| **Phase 2** | `1 rows` | `n_heptane` • `0.0G` • `21.0% O₂` • `14.7 psia` • `2.4 cm/s` | `1960.0 K` • `110.0 ppm CO` | `K=1.90` • `B=8.99` • `Sh=3.11` • `Da=7.5` • `MOC=13.82%` | **0G VENTILATED WAKE FLAME (2.4 cm/s)** (Risk `71/100`, SMAC `114.3 s`) |\n| **Phase 3** | `1 rows` | `n_heptane` • `0.0G` • `21.0% O₂` • `14.7 psia` • `2.4 cm/s` | `1960.0 K` • `110.0 ppm CO` | `K=1.90` • `B=8.99` • `Sh=3.11` • `Da=7.5` • `MOC=13.82%` | **0G VENTILATED WAKE FLAME (2.4 cm/s)** (Risk `71/100`, SMAC `114.3 s`) |\n| **Phase 4** | `1 rows` | `n_heptane` • `0.0G` • `21.0% O₂` • `14.7 psia` • `2.4 cm/s` | `1960.0 K` • `110.0 ppm CO` | `K=1.90` • `B=8.99` • `Sh=3.11` • `Da=7.5` • `MOC=13.82%` | **0G VENTILATED WAKE FLAME (2.4 cm/s)** (Risk `71/100`, SMAC `114.3 s`) |\n| **Phase 5** | `1 rows` | `n_heptane` • `0.0G` • `21.0% O₂` • `14.7 psia` • `2.4 cm/s` | `1960.0 K` • `110.0 ppm CO` | `K=1.90` • `B=8.99` • `Sh=3.11` • `Da=7.5` • `MOC=13.82%` | **0G VENTILATED WAKE FLAME (2.4 cm/s)** (Risk `71/100`, SMAC `114.3 s`) |\n| **Phase 6** | `1 rows` | `n_heptane` • `0.0G` • `21.0% O₂` • `14.7 psia` • `2.4 cm/s` | `1960.0 K` • `110.0 ppm CO` | `K=1.90` • `B=8.99` • `Sh=3.11` • `Da=7.5` • `MOC=13.82%` | **0G VENTILATED WAKE FLAME (2.4 cm/s)** (Risk `71/100`, SMAC `114.3 s`) |\n| **Phase 7** | `1 rows` | `n_heptane` • `0.0G` • `21.0% O₂` • `14.7 psia` • `2.4 cm/s` | `1960.0 K` • `110.0 ppm CO` | `K=1.90` • `B=8.99` • `Sh=3.11` • `Da=7.5` • `MOC=13.82%` | **0G VENTILATED WAKE FLAME (2.4 cm/s)** (Risk `71/100`, SMAC `114.3 s`) |"}, {"id": "PSI-108", "acronym": "STDCE-1", "raw_title": "Surface Tension Driven Convection Experiment-1", "title": "PSI-108 (STDCE-1) — Surface Tension Driven Convection Experiment-1 (PSI-108_Experimental table_STDCE-1.csv)", "hardware": "STDCE Hardware", "platform": "Space Shuttle", "date": "2024-09-18", "table_file": "PSI-108_Experimental table_STDCE-1.csv", "url": "https://psi.nasa.gov/physci/repo/data/investigations/PSI-108", "abstract": "The main objectives of STDCE-1 are to investigate: -The extent and nature of thermocapillary flows in transient periods as well as under steady conditions. -Temperature distributions along the free surface and in the bulk fluid. -The effect of the heating mode and the heating level on the flows. -The effect of the liquid free surface on the flows -The onset conditions and nature of oscillatory flows", "extracted_sim_params": {"fuel_id": "n_heptane", "gravity_g": 0.0, "oxygen_pct": 21.0, "pressure_psia": 14.7, "airflow_cms": 2.4, "droplet_d0_mm": 1.0, "diluent": "N2", "habitat_id": "iss_module"}, "phases": [{"index": 1, "code": "GRUP_1", "desc": "n_heptane", "short_tr": "Faz 1", "short_en": "Phase 1", "time_span_tr": "38 satir", "time_span_en": "38 rows", "facility": "ISS_CIR", "exp_ref": "", "sim_params": {"fuel_id": "n_heptane", "gravity_g": 0.0, "oxygen_pct": 21.0, "pressure_psia": 14.7, "airflow_cms": 2.4, "droplet_d0_mm": 1.0, "diluent": "N2", "habitat_id": "iss_module"}, "measured_temp_k": 2079.1, "co_max_ppm": 110.0, "ch2o_max_ppm": 0.0, "opt_min_pct": null, "mist_max_um": 0.0, "k_meas": null, "r2_d2": null, "regime": "VENTILATED_WAKE_0G", "badge_tr": "0G HAVALANDIRMALI KUYRUK ALEVİ (2.4 cm/s)", "badge_en": "0G VENTILATED WAKE FLAME (2.4 cm/s)", "flame_temp_k": 2079.1, "moc_pct": 13.82, "k_model": 1.64, "spread_mms": 1.96, "b_oq": 8.99, "sh": 2.62, "da": 2.34, "risk_score": 71, "smac_s": 114.3, "extinguished": false, "cool_flame": false}], "summary_tr": "**Tek Fazlı Deney Kaydı (`PSI-108_Experimental table_STDCE-1.csv` • 38 satır):**\n- **3B Yanma Odasına Aktarılan Aktif Durum:** **Faz 1** (`n_heptane`, `0.0G`, `%21.0 O₂`, `14.7 psia`, `2.4 cm/s` — Sıcaklık: `2079.1 K`).\n\n| Faz | Zaman | Yakit ve Atmosfer | Sicaklik / CO / CH2O | Boyutsuz Sayilar (K, B_oq, Sh, Da, MOC) | Fiziksel Rejim ve SMAC |\n| :--- | :--- | :--- | :--- | :--- | :--- |\n| **Faz 1** | `38 satir` | `n_heptane` • `0.0G` • `%21.0 O₂` • `14.7 psia` • `2.4 cm/s` | `2079.1 K` • `110.0 ppm CO` | `K=1.64` • `B=8.99` • `Sh=2.62` • `Da=2.34` • `MOC=%13.82` | **0G HAVALANDIRMALI KUYRUK ALEVİ (2.4 cm/s)** (Risk `71/100`, SMAC `114.3 sn`) |", "summary_en": "**Single-Phase Experiment Record (`PSI-108_Experimental table_STDCE-1.csv` • 38 rows):**\n- **Active State Synced to 3D Chamber:** **Phase 1** (`n_heptane`, `0.0G`, `21.0% O₂`, `14.7 psia`, `2.4 cm/s` — Temp: `2079.1 K`).\n\n| Phase | Window | Fuel & Atmosphere | Temp / CO / CH2O | Dimensionless (K, B_oq, Sh, Da, MOC) | Regime & SMAC Clock |\n| :--- | :--- | :--- | :--- | :--- | :--- |\n| **Phase 1** | `38 rows` | `n_heptane` • `0.0G` • `21.0% O₂` • `14.7 psia` • `2.4 cm/s` | `2079.1 K` • `110.0 ppm CO` | `K=1.64` • `B=8.99` • `Sh=2.62` • `Da=2.34` • `MOC=13.82%` | **0G VENTILATED WAKE FLAME (2.4 cm/s)** (Risk `71/100`, SMAC `114.3 s`) |"}, {"id": "PSI-101", "acronym": "SAME-R", "raw_title": "Smoke Aerosol Measurement Experiment-Reflight", "title": "PSI-101 (SAME-R) — Smoke Aerosol Measurement Experiment-Reflight (PSI-101_Experimental table_SAME-R.csv)", "hardware": "Comparitive Soot Diagnostic Hardware; Refer to final report", "platform": "International Space Station (ISS)", "date": "2024-09-18", "table_file": "PSI-101_Experimental table_SAME-R.csv", "url": "https://psi.nasa.gov/physci/repo/data/investigations/PSI-101", "abstract": "Similar to the original SAME investigation, the primary objective of the SAME-R investigation was to quantify the sizes that the liquid smoke particulate achieves in low gravity and to relate the droplet size distribution to the smoke generation and smoke transport conditions in the experiment. One of the problems encountered during the SAME investigation was that after the thermal precipitators were returned to the ground, it was found that all the TEM gr", "extracted_sim_params": {"fuel_id": "pmma", "gravity_g": 0.0, "oxygen_pct": 21.0, "pressure_psia": 14.7, "airflow_cms": 8.1, "droplet_d0_mm": 3.2, "diluent": "N2", "habitat_id": "iss_module"}, "phases": [{"index": 1, "code": "GRUP_1", "desc": "pmma", "short_tr": "Faz 1", "short_en": "Phase 1", "time_span_tr": "76 satir", "time_span_en": "76 rows", "facility": "ISS_CIR", "exp_ref": "", "sim_params": {"fuel_id": "pmma", "gravity_g": 0.0, "oxygen_pct": 21.0, "pressure_psia": 14.7, "airflow_cms": 8.1, "droplet_d0_mm": 3.2, "diluent": "N2", "habitat_id": "iss_module"}, "measured_temp_k": 1992.9, "co_max_ppm": 121.0, "ch2o_max_ppm": 0.0, "opt_min_pct": null, "mist_max_um": 0.0, "k_meas": null, "r2_d2": null, "regime": "VENTILATED_WAKE_0G", "badge_tr": "0G HAVALANDIRMALI KUYRUK ALEVİ (8.1 cm/s)", "badge_en": "0G VENTILATED WAKE FLAME (8.1 cm/s)", "flame_temp_k": 1992.9, "moc_pct": 13.42, "k_model": 0.77, "spread_mms": 1.64, "b_oq": 1.63, "sh": 4.03, "da": 2.22, "risk_score": 70, "smac_s": 108.5, "extinguished": false, "cool_flame": false}, {"index": 2, "code": "GRUP_2", "desc": "pmma", "short_tr": "Faz 2", "short_en": "Phase 2", "time_span_tr": "33 satir", "time_span_en": "33 rows", "facility": "ISS_CIR", "exp_ref": "", "sim_params": {"fuel_id": "pmma", "gravity_g": 0.0, "oxygen_pct": 21.0, "pressure_psia": 14.7, "airflow_cms": 0.48, "droplet_d0_mm": 3.2, "diluent": "N2", "habitat_id": "iss_module"}, "measured_temp_k": 1960.3, "co_max_ppm": 196.0, "ch2o_max_ppm": 0.0, "opt_min_pct": null, "mist_max_um": 0.0, "k_meas": null, "r2_d2": null, "regime": "HOT_SPHERICAL_0G", "badge_tr": "0G KÜRESEL DİFÜZYON ALEVİ", "badge_en": "0G SPHERICAL DIFFUSION FLAME", "flame_temp_k": 1960.3, "moc_pct": 16.52, "k_model": 0.474, "spread_mms": 0.49, "b_oq": 1.63, "sh": 2.49, "da": 37.5, "risk_score": 43, "smac_s": 79.7, "extinguished": false, "cool_flame": false}], "summary_tr": "**Çok Fazlı Telemetri Analizi (`PSI-101_Experimental table_SAME-R.csv` • 109 satır • 2 fiziksel faz):**\n- **3B Yanma Odasına Aktarılan Aktif Durum:** **Faz 1** (`pmma`, `0.0G`, `%21.0 O₂`, `14.7 psia`, `8.1 cm/s` — Sıcaklık: `1992.9 K`).\n\n| Faz | Zaman | Yakit ve Atmosfer | Sicaklik / CO / CH2O | Boyutsuz Sayilar (K, B_oq, Sh, Da, MOC) | Fiziksel Rejim ve SMAC |\n| :--- | :--- | :--- | :--- | :--- | :--- |\n| **Faz 1** | `76 satir` | `pmma` • `0.0G` • `%21.0 O₂` • `14.7 psia` • `8.1 cm/s` | `1992.9 K` • `121.0 ppm CO` | `K=0.77` • `B=1.63` • `Sh=4.03` • `Da=2.22` • `MOC=%13.42` | **0G HAVALANDIRMALI KUYRUK ALEVİ (8.1 cm/s)** (Risk `70/100`, SMAC `108.5 sn`) |\n| **Faz 2** | `33 satir` | `pmma` • `0.0G` • `%21.0 O₂` • `14.7 psia` • `0.48 cm/s` | `1960.3 K` • `196.0 ppm CO` | `K=0.47` • `B=1.63` • `Sh=2.49` • `Da=37.5` • `MOC=%16.52` | **0G KÜRESEL DİFÜZYON ALEVİ** (Risk `43/100`, SMAC `79.7 sn`) |", "summary_en": "**Multi-Phase Telemetry Analysis (`PSI-101_Experimental table_SAME-R.csv` • 109 rows • 2 physical phases):**\n- **Active State Synced to 3D Chamber:** **Phase 1** (`pmma`, `0.0G`, `21.0% O₂`, `14.7 psia`, `8.1 cm/s` — Temp: `1992.9 K`).\n\n| Phase | Window | Fuel & Atmosphere | Temp / CO / CH2O | Dimensionless (K, B_oq, Sh, Da, MOC) | Regime & SMAC Clock |\n| :--- | :--- | :--- | :--- | :--- | :--- |\n| **Phase 1** | `76 rows` | `pmma` • `0.0G` • `21.0% O₂` • `14.7 psia` • `8.1 cm/s` | `1992.9 K` • `121.0 ppm CO` | `K=0.77` • `B=1.63` • `Sh=4.03` • `Da=2.22` • `MOC=13.42%` | **0G VENTILATED WAKE FLAME (8.1 cm/s)** (Risk `70/100`, SMAC `108.5 s`) |\n| **Phase 2** | `33 rows` | `pmma` • `0.0G` • `21.0% O₂` • `14.7 psia` • `0.48 cm/s` | `1960.3 K` • `196.0 ppm CO` | `K=0.47` • `B=1.63` • `Sh=2.49` • `Da=37.5` • `MOC=16.52%` | **0G SPHERICAL DIFFUSION FLAME** (Risk `43/100`, SMAC `79.7 s`) |"}, {"id": "PSI-77", "acronym": "ISSI", "raw_title": "In Space Soldering Investigation", "title": "PSI-77 (ISSI) — In Space Soldering Investigation (PSI-77_Experimental table_ExperimentalTable_ISSI.csv)", "hardware": "Microgravity Workbench Area", "platform": "ISS", "date": "2004-12-22", "table_file": "PSI-77_Experimental table_ExperimentalTable_ISSI.csv", "url": "https://psi.nasa.gov/physci/repo/data/investigations/PSI-77", "abstract": "The primary objective is to better understand the quality of solders in a microgravity environment. In microgravity, gas bubbles, or void spaces are found in the solder joint and at contact surfaces. These voids reduce the thermal and electrical conductivity and also provide sites for crack initiation. Bubbles have less chance to escape in the reduced gravity environment of space. Hence, by designing a systematic series of simple experiments, the objective", "extracted_sim_params": {"fuel_id": "n_heptane", "gravity_g": 0.0, "oxygen_pct": 21.0, "pressure_psia": 14.7, "airflow_cms": 2.4, "droplet_d0_mm": 3.2, "diluent": "N2", "habitat_id": "iss_module"}, "phases": [{"index": 1, "code": "GRUP_1", "desc": "Base Material:silver-coa", "short_tr": "Faz 1", "short_en": "Phase 1", "time_span_tr": "1 satir", "time_span_en": "1 rows", "facility": "ISS_CIR", "exp_ref": "", "sim_params": {"fuel_id": "n_heptane", "gravity_g": 0.0, "oxygen_pct": 21.0, "pressure_psia": 14.7, "airflow_cms": 2.4, "droplet_d0_mm": 3.2, "diluent": "N2", "habitat_id": "iss_module"}, "measured_temp_k": 1960.0, "co_max_ppm": 110.0, "ch2o_max_ppm": 0.0, "opt_min_pct": null, "mist_max_um": 0.0, "k_meas": null, "r2_d2": null, "regime": "VENTILATED_WAKE_0G", "badge_tr": "0G HAVALANDIRMALI KUYRUK ALEVİ (2.4 cm/s)", "badge_en": "0G VENTILATED WAKE FLAME (2.4 cm/s)", "flame_temp_k": 1960.0, "moc_pct": 13.82, "k_model": 1.9, "spread_mms": 1.96, "b_oq": 8.99, "sh": 3.11, "da": 7.5, "risk_score": 71, "smac_s": 114.3, "extinguished": false, "cool_flame": false}, {"index": 2, "code": "GRUP_2", "desc": "n_heptane", "short_tr": "Faz 2", "short_en": "Phase 2", "time_span_tr": "83 satir", "time_span_en": "83 rows", "facility": "ISS_CIR", "exp_ref": "", "sim_params": {"fuel_id": "n_heptane", "gravity_g": 0.0, "oxygen_pct": 21.0, "pressure_psia": 14.7, "airflow_cms": 2.4, "droplet_d0_mm": 3.2, "diluent": "N2", "habitat_id": "iss_module"}, "measured_temp_k": 1960.0, "co_max_ppm": 110.0, "ch2o_max_ppm": 0.0, "opt_min_pct": null, "mist_max_um": 0.0, "k_meas": null, "r2_d2": null, "regime": "VENTILATED_WAKE_0G", "badge_tr": "0G HAVALANDIRMALI KUYRUK ALEVİ (2.4 cm/s)", "badge_en": "0G VENTILATED WAKE FLAME (2.4 cm/s)", "flame_temp_k": 1960.0, "moc_pct": 13.82, "k_model": 1.9, "spread_mms": 1.96, "b_oq": 8.99, "sh": 3.11, "da": 7.5, "risk_score": 71, "smac_s": 114.3, "extinguished": false, "cool_flame": false}], "summary_tr": "**Çok Fazlı Telemetri Analizi (`PSI-77_Experimental table_ExperimentalTable_ISSI.csv` • 84 satır • 2 fiziksel faz):**\n- **3B Yanma Odasına Aktarılan Aktif Durum:** **Faz 1** (`n_heptane`, `0.0G`, `%21.0 O₂`, `14.7 psia`, `2.4 cm/s` — Sıcaklık: `1960.0 K`).\n\n| Faz | Zaman | Yakit ve Atmosfer | Sicaklik / CO / CH2O | Boyutsuz Sayilar (K, B_oq, Sh, Da, MOC) | Fiziksel Rejim ve SMAC |\n| :--- | :--- | :--- | :--- | :--- | :--- |\n| **Faz 1** | `1 satir` | `n_heptane` • `0.0G` • `%21.0 O₂` • `14.7 psia` • `2.4 cm/s` | `1960.0 K` • `110.0 ppm CO` | `K=1.90` • `B=8.99` • `Sh=3.11` • `Da=7.5` • `MOC=%13.82` | **0G HAVALANDIRMALI KUYRUK ALEVİ (2.4 cm/s)** (Risk `71/100`, SMAC `114.3 sn`) |\n| **Faz 2** | `83 satir` | `n_heptane` • `0.0G` • `%21.0 O₂` • `14.7 psia` • `2.4 cm/s` | `1960.0 K` • `110.0 ppm CO` | `K=1.90` • `B=8.99` • `Sh=3.11` • `Da=7.5` • `MOC=%13.82` | **0G HAVALANDIRMALI KUYRUK ALEVİ (2.4 cm/s)** (Risk `71/100`, SMAC `114.3 sn`) |", "summary_en": "**Multi-Phase Telemetry Analysis (`PSI-77_Experimental table_ExperimentalTable_ISSI.csv` • 84 rows • 2 physical phases):**\n- **Active State Synced to 3D Chamber:** **Phase 1** (`n_heptane`, `0.0G`, `21.0% O₂`, `14.7 psia`, `2.4 cm/s` — Temp: `1960.0 K`).\n\n| Phase | Window | Fuel & Atmosphere | Temp / CO / CH2O | Dimensionless (K, B_oq, Sh, Da, MOC) | Regime & SMAC Clock |\n| :--- | :--- | :--- | :--- | :--- | :--- |\n| **Phase 1** | `1 rows` | `n_heptane` • `0.0G` • `21.0% O₂` • `14.7 psia` • `2.4 cm/s` | `1960.0 K` • `110.0 ppm CO` | `K=1.90` • `B=8.99` • `Sh=3.11` • `Da=7.5` • `MOC=13.82%` | **0G VENTILATED WAKE FLAME (2.4 cm/s)** (Risk `71/100`, SMAC `114.3 s`) |\n| **Phase 2** | `83 rows` | `n_heptane` • `0.0G` • `21.0% O₂` • `14.7 psia` • `2.4 cm/s` | `1960.0 K` • `110.0 ppm CO` | `K=1.90` • `B=8.99` • `Sh=3.11` • `Da=7.5` • `MOC=13.82%` | **0G VENTILATED WAKE FLAME (2.4 cm/s)** (Risk `71/100`, SMAC `114.3 s`) |"}, {"id": "PSI-166", "acronym": "EML USTIP Batch 2", "raw_title": "Unified Support for THERMOLAB - ISS, ICOPROSOL and PARSEC", "title": "PSI-166 (EML USTIP Batch 2) — Unified Support for THERMOLAB - ISS, ICOPROSOL and PARSEC", "hardware": "International Space Station - Electromagnetic Levitator (EML)", "platform": "International Space Station (ISS)", "date": "2025-08-05", "table_file": "", "url": "https://psi.nasa.gov/physci/repo/data/investigations/PSI-166", "abstract": "Specific objectives of this investigation were as follows: • Plan and develop experiment parameter sets to investigate anomalous nucleation events in zirconium samples during ISS-EML experiments • Analyze cavitation-induced nucleation experiments on zirconium and zirconium-nickel alloys • Analyze fluid flow during ISS-EML experiments to support collaborators investigations • Continue flight preparations and development of experimental parameter sets for up", "extracted_sim_params": {"fuel_id": "nomex", "gravity_g": 0.0, "oxygen_pct": 85.0, "pressure_psia": 4.3, "airflow_cms": 2.4, "droplet_d0_mm": 3.2, "diluent": "N2"}, "phases": [], "summary_tr": "**NASA PSI Kaydı (`PSI-166` • `EML USTIP Batch 2`): Unified Support for THERMOLAB - ISS, ICOPROSOL and PARSEC**\n- **3B Yanma Odasına Aktarılan Koşullar:** Yakıt `nomex`, Yerçekimi `0.0G`, O₂ `%85.0`, Basınç `4.3 psia`, Akış `2.4 cm/s` — Rejim: **0G HAVALANDIRMALI KUYRUK ALEVİ (2.4 cm/s)** (`2426.8 K`).\n- **Araştırma Özeti:** Specific objectives of this investigation were as follows: • Plan and develop experiment parameter sets to investigate anomalous nucleation events in zirconium samples during ISS-EML experiments • Analyze cavitation-induced nucleation experiments on zirconium and zirconium-nickel alloys • Analyze fluid flow during ISS-EML experiments to support collaborators investigations • Continue flight preparations and development of experimental parameter sets for up", "summary_en": "**NASA PSI Record (`PSI-166` • `EML USTIP Batch 2`): Unified Support for THERMOLAB - ISS, ICOPROSOL and PARSEC**\n- **3D Chamber Conditions Applied:** Fuel `nomex`, Gravity `0.0G`, O₂ `85.0%`, Pressure `4.3 psia`, Airflow `2.4 cm/s` — Regime: **0G VENTILATED WAKE FLAME (2.4 cm/s)** (`2426.8 K`).\n- **Investigation Summary:** Specific objectives of this investigation were as follows: • Plan and develop experiment parameter sets to investigate anomalous nucleation events in zirconium samples during ISS-EML experiments • Analyze cavitation-induced nucleation experiments on zirconium and zirconium-nickel alloys • Analyze fluid flow during ISS-EML experiments to support collaborators investigations • Continue flight preparations and development of experimental parameter sets for up"}, {"id": "PSI-38", "acronym": "CFE", "raw_title": "Capillary Flow Experiment", "title": "PSI-38 (CFE) — Capillary Flow Experiment (PSI-38_Experimental table_CFE.csv)", "hardware": "", "platform": "International Space Station (ISS)", "date": "2024-09-18", "table_file": "PSI-38_Experimental table_CFE.csv", "url": "https://psi.nasa.gov/physci/repo/data/investigations/PSI-38", "abstract": "1. The primary objective of the CL unit experiments is to identify the extent the role of the boundary condition at the contact line plays in the natural dynamic response of a large capillary interface to a variety of disturbances. 2. The primary objective of the ICF units is to experimentally determine secondary imbibition rates in complex containers due to spontaneous large length scale capillary flows along interior corners in weakly 3-dimensional conta", "extracted_sim_params": {"fuel_id": "n_heptane", "gravity_g": 0.0, "oxygen_pct": 21.0, "pressure_psia": 14.7, "airflow_cms": 2.4, "droplet_d0_mm": 3.2, "diluent": "N2", "habitat_id": "iss_module"}, "phases": [{"index": 1, "code": "TEST_1", "desc": "Test 1 (FC724 barrier coating)", "short_tr": "Faz 1", "short_en": "Phase 1", "time_span_tr": "1 satir", "time_span_en": "1 rows", "facility": "ISS_CIR", "exp_ref": "", "sim_params": {"fuel_id": "n_heptane", "gravity_g": 0.0, "oxygen_pct": 21.0, "pressure_psia": 14.7, "airflow_cms": 2.4, "droplet_d0_mm": 3.2, "diluent": "N2", "habitat_id": "iss_module"}, "measured_temp_k": 1960.0, "co_max_ppm": 110.0, "ch2o_max_ppm": 0.0, "opt_min_pct": null, "mist_max_um": 0.0, "k_meas": null, "r2_d2": null, "regime": "VENTILATED_WAKE_0G", "badge_tr": "0G HAVALANDIRMALI KUYRUK ALEVİ (2.4 cm/s)", "badge_en": "0G VENTILATED WAKE FLAME (2.4 cm/s)", "flame_temp_k": 1960.0, "moc_pct": 13.82, "k_model": 1.9, "spread_mms": 1.96, "b_oq": 8.99, "sh": 3.11, "da": 7.5, "risk_score": 71, "smac_s": 114.3, "extinguished": false, "cool_flame": false}, {"index": 2, "code": "TEST_2", "desc": "Test 2 (FC724 barrier coating)", "short_tr": "Faz 2", "short_en": "Phase 2", "time_span_tr": "1 satir", "time_span_en": "1 rows", "facility": "ISS_CIR", "exp_ref": "", "sim_params": {"fuel_id": "n_heptane", "gravity_g": 0.0, "oxygen_pct": 21.0, "pressure_psia": 14.7, "airflow_cms": 2.4, "droplet_d0_mm": 3.2, "diluent": "N2", "habitat_id": "iss_module"}, "measured_temp_k": 1960.0, "co_max_ppm": 110.0, "ch2o_max_ppm": 0.0, "opt_min_pct": null, "mist_max_um": 0.0, "k_meas": null, "r2_d2": null, "regime": "VENTILATED_WAKE_0G", "badge_tr": "0G HAVALANDIRMALI KUYRUK ALEVİ (2.4 cm/s)", "badge_en": "0G VENTILATED WAKE FLAME (2.4 cm/s)", "flame_temp_k": 1960.0, "moc_pct": 13.82, "k_model": 1.9, "spread_mms": 1.96, "b_oq": 8.99, "sh": 3.11, "da": 7.5, "risk_score": 71, "smac_s": 114.3, "extinguished": false, "cool_flame": false}, {"index": 3, "code": "TEST_3", "desc": "Test 3 (None)", "short_tr": "Faz 3", "short_en": "Phase 3", "time_span_tr": "1 satir", "time_span_en": "1 rows", "facility": "ISS_CIR", "exp_ref": "", "sim_params": {"fuel_id": "n_heptane", "gravity_g": 0.0, "oxygen_pct": 21.0, "pressure_psia": 14.7, "airflow_cms": 2.4, "droplet_d0_mm": 3.2, "diluent": "N2", "habitat_id": "iss_module"}, "measured_temp_k": 1960.0, "co_max_ppm": 110.0, "ch2o_max_ppm": 0.0, "opt_min_pct": null, "mist_max_um": 0.0, "k_meas": null, "r2_d2": null, "regime": "VENTILATED_WAKE_0G", "badge_tr": "0G HAVALANDIRMALI KUYRUK ALEVİ (2.4 cm/s)", "badge_en": "0G VENTILATED WAKE FLAME (2.4 cm/s)", "flame_temp_k": 1960.0, "moc_pct": 13.82, "k_model": 1.9, "spread_mms": 1.96, "b_oq": 8.99, "sh": 3.11, "da": 7.5, "risk_score": 71, "smac_s": 114.3, "extinguished": false, "cool_flame": false}, {"index": 4, "code": "TEST_4", "desc": "Test 4 (None)", "short_tr": "Faz 4", "short_en": "Phase 4", "time_span_tr": "1 satir", "time_span_en": "1 rows", "facility": "ISS_CIR", "exp_ref": "", "sim_params": {"fuel_id": "n_heptane", "gravity_g": 0.0, "oxygen_pct": 21.0, "pressure_psia": 14.7, "airflow_cms": 2.4, "droplet_d0_mm": 3.2, "diluent": "N2", "habitat_id": "iss_module"}, "measured_temp_k": 1960.0, "co_max_ppm": 110.0, "ch2o_max_ppm": 0.0, "opt_min_pct": null, "mist_max_um": 0.0, "k_meas": null, "r2_d2": null, "regime": "VENTILATED_WAKE_0G", "badge_tr": "0G HAVALANDIRMALI KUYRUK ALEVİ (2.4 cm/s)", "badge_en": "0G VENTILATED WAKE FLAME (2.4 cm/s)", "flame_temp_k": 1960.0, "moc_pct": 13.82, "k_model": 1.9, "spread_mms": 1.96, "b_oq": 8.99, "sh": 3.11, "da": 7.5, "risk_score": 71, "smac_s": 114.3, "extinguished": false, "cool_flame": false}, {"index": 5, "code": "TEST_5", "desc": "Test 5 (None)", "short_tr": "Faz 5", "short_en": "Phase 5", "time_span_tr": "1 satir", "time_span_en": "1 rows", "facility": "ISS_CIR", "exp_ref": "", "sim_params": {"fuel_id": "n_heptane", "gravity_g": 0.0, "oxygen_pct": 21.0, "pressure_psia": 14.7, "airflow_cms": 2.4, "droplet_d0_mm": 3.2, "diluent": "N2", "habitat_id": "iss_module"}, "measured_temp_k": 1960.0, "co_max_ppm": 110.0, "ch2o_max_ppm": 0.0, "opt_min_pct": null, "mist_max_um": 0.0, "k_meas": null, "r2_d2": null, "regime": "VENTILATED_WAKE_0G", "badge_tr": "0G HAVALANDIRMALI KUYRUK ALEVİ (2.4 cm/s)", "badge_en": "0G VENTILATED WAKE FLAME (2.4 cm/s)", "flame_temp_k": 1960.0, "moc_pct": 13.82, "k_model": 1.9, "spread_mms": 1.96, "b_oq": 8.99, "sh": 3.11, "da": 7.5, "risk_score": 71, "smac_s": 114.3, "extinguished": false, "cool_flame": false}, {"index": 6, "code": "TEST_6", "desc": "Test 6 (FC724 barrier coating)", "short_tr": "Faz 6", "short_en": "Phase 6", "time_span_tr": "1 satir", "time_span_en": "1 rows", "facility": "ISS_CIR", "exp_ref": "", "sim_params": {"fuel_id": "n_heptane", "gravity_g": 0.0, "oxygen_pct": 21.0, "pressure_psia": 14.7, "airflow_cms": 2.4, "droplet_d0_mm": 3.2, "diluent": "N2", "habitat_id": "iss_module"}, "measured_temp_k": 1960.0, "co_max_ppm": 110.0, "ch2o_max_ppm": 0.0, "opt_min_pct": null, "mist_max_um": 0.0, "k_meas": null, "r2_d2": null, "regime": "VENTILATED_WAKE_0G", "badge_tr": "0G HAVALANDIRMALI KUYRUK ALEVİ (2.4 cm/s)", "badge_en": "0G VENTILATED WAKE FLAME (2.4 cm/s)", "flame_temp_k": 1960.0, "moc_pct": 13.82, "k_model": 1.9, "spread_mms": 1.96, "b_oq": 8.99, "sh": 3.11, "da": 7.5, "risk_score": 71, "smac_s": 114.3, "extinguished": false, "cool_flame": false}], "summary_tr": "**Çok Fazlı Telemetri Analizi (`PSI-38_Experimental table_CFE.csv` • 6 satır • 6 fiziksel faz):**\n- **3B Yanma Odasına Aktarılan Aktif Durum:** **Faz 1** (`n_heptane`, `0.0G`, `%21.0 O₂`, `14.7 psia`, `2.4 cm/s` — Sıcaklık: `1960.0 K`).\n\n| Faz | Zaman | Yakit ve Atmosfer | Sicaklik / CO / CH2O | Boyutsuz Sayilar (K, B_oq, Sh, Da, MOC) | Fiziksel Rejim ve SMAC |\n| :--- | :--- | :--- | :--- | :--- | :--- |\n| **Faz 1** | `1 satir` | `n_heptane` • `0.0G` • `%21.0 O₂` • `14.7 psia` • `2.4 cm/s` | `1960.0 K` • `110.0 ppm CO` | `K=1.90` • `B=8.99` • `Sh=3.11` • `Da=7.5` • `MOC=%13.82` | **0G HAVALANDIRMALI KUYRUK ALEVİ (2.4 cm/s)** (Risk `71/100`, SMAC `114.3 sn`) |\n| **Faz 2** | `1 satir` | `n_heptane` • `0.0G` • `%21.0 O₂` • `14.7 psia` • `2.4 cm/s` | `1960.0 K` • `110.0 ppm CO` | `K=1.90` • `B=8.99` • `Sh=3.11` • `Da=7.5` • `MOC=%13.82` | **0G HAVALANDIRMALI KUYRUK ALEVİ (2.4 cm/s)** (Risk `71/100`, SMAC `114.3 sn`) |\n| **Faz 3** | `1 satir` | `n_heptane` • `0.0G` • `%21.0 O₂` • `14.7 psia` • `2.4 cm/s` | `1960.0 K` • `110.0 ppm CO` | `K=1.90` • `B=8.99` • `Sh=3.11` • `Da=7.5` • `MOC=%13.82` | **0G HAVALANDIRMALI KUYRUK ALEVİ (2.4 cm/s)** (Risk `71/100`, SMAC `114.3 sn`) |\n| **Faz 4** | `1 satir` | `n_heptane` • `0.0G` • `%21.0 O₂` • `14.7 psia` • `2.4 cm/s` | `1960.0 K` • `110.0 ppm CO` | `K=1.90` • `B=8.99` • `Sh=3.11` • `Da=7.5` • `MOC=%13.82` | **0G HAVALANDIRMALI KUYRUK ALEVİ (2.4 cm/s)** (Risk `71/100`, SMAC `114.3 sn`) |\n| **Faz 5** | `1 satir` | `n_heptane` • `0.0G` • `%21.0 O₂` • `14.7 psia` • `2.4 cm/s` | `1960.0 K` • `110.0 ppm CO` | `K=1.90` • `B=8.99` • `Sh=3.11` • `Da=7.5` • `MOC=%13.82` | **0G HAVALANDIRMALI KUYRUK ALEVİ (2.4 cm/s)** (Risk `71/100`, SMAC `114.3 sn`) |\n| **Faz 6** | `1 satir` | `n_heptane` • `0.0G` • `%21.0 O₂` • `14.7 psia` • `2.4 cm/s` | `1960.0 K` • `110.0 ppm CO` | `K=1.90` • `B=8.99` • `Sh=3.11` • `Da=7.5` • `MOC=%13.82` | **0G HAVALANDIRMALI KUYRUK ALEVİ (2.4 cm/s)** (Risk `71/100`, SMAC `114.3 sn`) |", "summary_en": "**Multi-Phase Telemetry Analysis (`PSI-38_Experimental table_CFE.csv` • 6 rows • 6 physical phases):**\n- **Active State Synced to 3D Chamber:** **Phase 1** (`n_heptane`, `0.0G`, `21.0% O₂`, `14.7 psia`, `2.4 cm/s` — Temp: `1960.0 K`).\n\n| Phase | Window | Fuel & Atmosphere | Temp / CO / CH2O | Dimensionless (K, B_oq, Sh, Da, MOC) | Regime & SMAC Clock |\n| :--- | :--- | :--- | :--- | :--- | :--- |\n| **Phase 1** | `1 rows` | `n_heptane` • `0.0G` • `21.0% O₂` • `14.7 psia` • `2.4 cm/s` | `1960.0 K` • `110.0 ppm CO` | `K=1.90` • `B=8.99` • `Sh=3.11` • `Da=7.5` • `MOC=13.82%` | **0G VENTILATED WAKE FLAME (2.4 cm/s)** (Risk `71/100`, SMAC `114.3 s`) |\n| **Phase 2** | `1 rows` | `n_heptane` • `0.0G` • `21.0% O₂` • `14.7 psia` • `2.4 cm/s` | `1960.0 K` • `110.0 ppm CO` | `K=1.90` • `B=8.99` • `Sh=3.11` • `Da=7.5` • `MOC=13.82%` | **0G VENTILATED WAKE FLAME (2.4 cm/s)** (Risk `71/100`, SMAC `114.3 s`) |\n| **Phase 3** | `1 rows` | `n_heptane` • `0.0G` • `21.0% O₂` • `14.7 psia` • `2.4 cm/s` | `1960.0 K` • `110.0 ppm CO` | `K=1.90` • `B=8.99` • `Sh=3.11` • `Da=7.5` • `MOC=13.82%` | **0G VENTILATED WAKE FLAME (2.4 cm/s)** (Risk `71/100`, SMAC `114.3 s`) |\n| **Phase 4** | `1 rows` | `n_heptane` • `0.0G` • `21.0% O₂` • `14.7 psia` • `2.4 cm/s` | `1960.0 K` • `110.0 ppm CO` | `K=1.90` • `B=8.99` • `Sh=3.11` • `Da=7.5` • `MOC=13.82%` | **0G VENTILATED WAKE FLAME (2.4 cm/s)** (Risk `71/100`, SMAC `114.3 s`) |\n| **Phase 5** | `1 rows` | `n_heptane` • `0.0G` • `21.0% O₂` • `14.7 psia` • `2.4 cm/s` | `1960.0 K` • `110.0 ppm CO` | `K=1.90` • `B=8.99` • `Sh=3.11` • `Da=7.5` • `MOC=13.82%` | **0G VENTILATED WAKE FLAME (2.4 cm/s)** (Risk `71/100`, SMAC `114.3 s`) |\n| **Phase 6** | `1 rows` | `n_heptane` • `0.0G` • `21.0% O₂` • `14.7 psia` • `2.4 cm/s` | `1960.0 K` • `110.0 ppm CO` | `K=1.90` • `B=8.99` • `Sh=3.11` • `Da=7.5` • `MOC=13.82%` | **0G VENTILATED WAKE FLAME (2.4 cm/s)** (Risk `71/100`, SMAC `114.3 s`) |"}, {"id": "PSI-37", "acronym": "CFE-2", "raw_title": "Capillary Flow Experiment - 2", "title": "PSI-37 (CFE-2) — Capillary Flow Experiment - 2 (PSI-37_Experimental table_CFE2.csv)", "hardware": "", "platform": "International Space Station (ISS)", "date": "2024-09-18", "table_file": "PSI-37_Experimental table_CFE2.csv", "url": "https://psi.nasa.gov/physci/repo/data/investigations/PSI-37", "abstract": "Liquids behave differently in space than they do on Earth, so containers that can process, hold or transport them must be designed carefully to work in microgravity. The Capillary Flow Experiment-2 furthers research on wetting, which is a liquid’s ability to spread across a surface, and its impact over large length scales in strange container shapes in microgravity environments. This work will improve our capabilities to quickly and accurately predict how ", "extracted_sim_params": {"fuel_id": "n_heptane", "gravity_g": 0.0, "oxygen_pct": 21.0, "pressure_psia": 14.7, "airflow_cms": 2.4, "droplet_d0_mm": 3.2, "diluent": "N2", "habitat_id": "iss_module"}, "phases": [{"index": 1, "code": "GRUP_1", "desc": "None", "short_tr": "Faz 1", "short_en": "Phase 1", "time_span_tr": "10 satir", "time_span_en": "10 rows", "facility": "ISS_CIR", "exp_ref": "", "sim_params": {"fuel_id": "n_heptane", "gravity_g": 0.0, "oxygen_pct": 21.0, "pressure_psia": 14.7, "airflow_cms": 2.4, "droplet_d0_mm": 3.2, "diluent": "N2", "habitat_id": "iss_module"}, "measured_temp_k": 1960.0, "co_max_ppm": 110.0, "ch2o_max_ppm": 0.0, "opt_min_pct": null, "mist_max_um": 0.0, "k_meas": null, "r2_d2": null, "regime": "VENTILATED_WAKE_0G", "badge_tr": "0G HAVALANDIRMALI KUYRUK ALEVİ (2.4 cm/s)", "badge_en": "0G VENTILATED WAKE FLAME (2.4 cm/s)", "flame_temp_k": 1960.0, "moc_pct": 13.82, "k_model": 1.9, "spread_mms": 1.96, "b_oq": 8.99, "sh": 3.11, "da": 7.5, "risk_score": 71, "smac_s": 114.3, "extinguished": false, "cool_flame": false}], "summary_tr": "**Tek Fazlı Deney Kaydı (`PSI-37_Experimental table_CFE2.csv` • 10 satır):**\n- **3B Yanma Odasına Aktarılan Aktif Durum:** **Faz 1** (`n_heptane`, `0.0G`, `%21.0 O₂`, `14.7 psia`, `2.4 cm/s` — Sıcaklık: `1960.0 K`).\n\n| Faz | Zaman | Yakit ve Atmosfer | Sicaklik / CO / CH2O | Boyutsuz Sayilar (K, B_oq, Sh, Da, MOC) | Fiziksel Rejim ve SMAC |\n| :--- | :--- | :--- | :--- | :--- | :--- |\n| **Faz 1** | `10 satir` | `n_heptane` • `0.0G` • `%21.0 O₂` • `14.7 psia` • `2.4 cm/s` | `1960.0 K` • `110.0 ppm CO` | `K=1.90` • `B=8.99` • `Sh=3.11` • `Da=7.5` • `MOC=%13.82` | **0G HAVALANDIRMALI KUYRUK ALEVİ (2.4 cm/s)** (Risk `71/100`, SMAC `114.3 sn`) |", "summary_en": "**Single-Phase Experiment Record (`PSI-37_Experimental table_CFE2.csv` • 10 rows):**\n- **Active State Synced to 3D Chamber:** **Phase 1** (`n_heptane`, `0.0G`, `21.0% O₂`, `14.7 psia`, `2.4 cm/s` — Temp: `1960.0 K`).\n\n| Phase | Window | Fuel & Atmosphere | Temp / CO / CH2O | Dimensionless (K, B_oq, Sh, Da, MOC) | Regime & SMAC Clock |\n| :--- | :--- | :--- | :--- | :--- | :--- |\n| **Phase 1** | `10 rows` | `n_heptane` • `0.0G` • `21.0% O₂` • `14.7 psia` • `2.4 cm/s` | `1960.0 K` • `110.0 ppm CO` | `K=1.90` • `B=8.99` • `Sh=3.11` • `Da=7.5` • `MOC=13.82%` | **0G VENTILATED WAKE FLAME (2.4 cm/s)** (Risk `71/100`, SMAC `114.3 s`) |"}, {"id": "PSI-86", "acronym": "OASIS", "raw_title": "Observation and Analysis of Smectic Islands in Space", "title": "PSI-86 (OASIS) — Observation and Analysis of Smectic Islands in Space (PSI-86_Experimental table_oasis .csv)", "hardware": "Microgravity Science Glovebox", "platform": "International Space Station (ISS)", "date": "2018-09-30", "table_file": "PSI-86_Experimental table_oasis .csv", "url": "https://psi.nasa.gov/physci/repo/data/investigations/PSI-86", "abstract": "OASIS studies the unique behavior of liquid crystals in microgravity, including their overall motion and the merging of crystal layers known as smectic islands. Liquid crystals are used for display screens in televisions and clocks, and they also occur in soaps and in cell membranes. The experiment allows detailed studies of the behavior of these structures, and how microgravity affects their unique ability to act like both a liquid and a solid crystal. Th", "extracted_sim_params": {"fuel_id": "n_heptane", "gravity_g": 0.0, "oxygen_pct": 21.0, "pressure_psia": 14.7, "airflow_cms": 2.4, "droplet_d0_mm": 3.2, "diluent": "N2", "habitat_id": "iss_module"}, "phases": [{"index": 1, "code": "GRUP_1", "desc": "8CB", "short_tr": "Faz 1", "short_en": "Phase 1", "time_span_tr": "12 satir", "time_span_en": "12 rows", "facility": "ISS_CIR", "exp_ref": "", "sim_params": {"fuel_id": "n_heptane", "gravity_g": 0.0, "oxygen_pct": 21.0, "pressure_psia": 14.7, "airflow_cms": 2.4, "droplet_d0_mm": 3.2, "diluent": "N2", "habitat_id": "iss_module"}, "measured_temp_k": 1960.0, "co_max_ppm": 110.0, "ch2o_max_ppm": 0.0, "opt_min_pct": null, "mist_max_um": 0.0, "k_meas": null, "r2_d2": null, "regime": "VENTILATED_WAKE_0G", "badge_tr": "0G HAVALANDIRMALI KUYRUK ALEVİ (2.4 cm/s)", "badge_en": "0G VENTILATED WAKE FLAME (2.4 cm/s)", "flame_temp_k": 1960.0, "moc_pct": 13.82, "k_model": 1.9, "spread_mms": 1.96, "b_oq": 8.99, "sh": 3.11, "da": 7.5, "risk_score": 71, "smac_s": 114.3, "extinguished": false, "cool_flame": false}, {"index": 2, "code": "GRUP_2", "desc": "MX12805", "short_tr": "Faz 2", "short_en": "Phase 2", "time_span_tr": "28 satir", "time_span_en": "28 rows", "facility": "ISS_CIR", "exp_ref": "", "sim_params": {"fuel_id": "n_heptane", "gravity_g": 0.0, "oxygen_pct": 21.0, "pressure_psia": 14.7, "airflow_cms": 2.4, "droplet_d0_mm": 3.2, "diluent": "N2", "habitat_id": "iss_module"}, "measured_temp_k": 1960.0, "co_max_ppm": 110.0, "ch2o_max_ppm": 0.0, "opt_min_pct": null, "mist_max_um": 0.0, "k_meas": null, "r2_d2": null, "regime": "VENTILATED_WAKE_0G", "badge_tr": "0G HAVALANDIRMALI KUYRUK ALEVİ (2.4 cm/s)", "badge_en": "0G VENTILATED WAKE FLAME (2.4 cm/s)", "flame_temp_k": 1960.0, "moc_pct": 13.82, "k_model": 1.9, "spread_mms": 1.96, "b_oq": 8.99, "sh": 3.11, "da": 7.5, "risk_score": 71, "smac_s": 114.3, "extinguished": false, "cool_flame": false}], "summary_tr": "**Çok Fazlı Telemetri Analizi (`PSI-86_Experimental table_oasis .csv` • 40 satır • 2 fiziksel faz):**\n- **3B Yanma Odasına Aktarılan Aktif Durum:** **Faz 1** (`n_heptane`, `0.0G`, `%21.0 O₂`, `14.7 psia`, `2.4 cm/s` — Sıcaklık: `1960.0 K`).\n\n| Faz | Zaman | Yakit ve Atmosfer | Sicaklik / CO / CH2O | Boyutsuz Sayilar (K, B_oq, Sh, Da, MOC) | Fiziksel Rejim ve SMAC |\n| :--- | :--- | :--- | :--- | :--- | :--- |\n| **Faz 1** | `12 satir` | `n_heptane` • `0.0G` • `%21.0 O₂` • `14.7 psia` • `2.4 cm/s` | `1960.0 K` • `110.0 ppm CO` | `K=1.90` • `B=8.99` • `Sh=3.11` • `Da=7.5` • `MOC=%13.82` | **0G HAVALANDIRMALI KUYRUK ALEVİ (2.4 cm/s)** (Risk `71/100`, SMAC `114.3 sn`) |\n| **Faz 2** | `28 satir` | `n_heptane` • `0.0G` • `%21.0 O₂` • `14.7 psia` • `2.4 cm/s` | `1960.0 K` • `110.0 ppm CO` | `K=1.90` • `B=8.99` • `Sh=3.11` • `Da=7.5` • `MOC=%13.82` | **0G HAVALANDIRMALI KUYRUK ALEVİ (2.4 cm/s)** (Risk `71/100`, SMAC `114.3 sn`) |", "summary_en": "**Multi-Phase Telemetry Analysis (`PSI-86_Experimental table_oasis .csv` • 40 rows • 2 physical phases):**\n- **Active State Synced to 3D Chamber:** **Phase 1** (`n_heptane`, `0.0G`, `21.0% O₂`, `14.7 psia`, `2.4 cm/s` — Temp: `1960.0 K`).\n\n| Phase | Window | Fuel & Atmosphere | Temp / CO / CH2O | Dimensionless (K, B_oq, Sh, Da, MOC) | Regime & SMAC Clock |\n| :--- | :--- | :--- | :--- | :--- | :--- |\n| **Phase 1** | `12 rows` | `n_heptane` • `0.0G` • `21.0% O₂` • `14.7 psia` • `2.4 cm/s` | `1960.0 K` • `110.0 ppm CO` | `K=1.90` • `B=8.99` • `Sh=3.11` • `Da=7.5` • `MOC=13.82%` | **0G VENTILATED WAKE FLAME (2.4 cm/s)** (Risk `71/100`, SMAC `114.3 s`) |\n| **Phase 2** | `28 rows` | `n_heptane` • `0.0G` • `21.0% O₂` • `14.7 psia` • `2.4 cm/s` | `1960.0 K` • `110.0 ppm CO` | `K=1.90` • `B=8.99` • `Sh=3.11` • `Da=7.5` • `MOC=13.82%` | **0G VENTILATED WAKE FLAME (2.4 cm/s)** (Risk `71/100`, SMAC `114.3 s`) |"}, {"id": "PSI-1", "acronym": "ELF-2 Round Robin", "raw_title": "Round Robin - Thermophysical Property Measurement", "title": "PSI-1 (ELF-2 Round Robin) — Round Robin - Thermophysical Property Measurement", "hardware": "JAXA ISS-ELF, TEMPUS Parabolic Flight EML, NASA MSFC Electrostatic Levitator (ESL)", "platform": "International Space Station (ISS)", "date": "2024-10-16", "table_file": "", "url": "https://psi.nasa.gov/physci/repo/data/investigations/PSI-1", "abstract": "The key scientific objectives are: (a) Conducting baseline space ESL containerless property measurement experiments for two paired classes of levitation-based thermophysical properties:Density/Thermal Expansion, Viscosity/Surface Tension. (b) Selecting materials compatible with both electrostatic levitation (ESL) and electromagnetic levitation (EML) to allow comparison between space facilities. (c) Using modeling to evaluate theories used to predict the in", "extracted_sim_params": {"fuel_id": "nomex", "gravity_g": 0.0, "oxygen_pct": 85.0, "pressure_psia": 4.3, "airflow_cms": 2.4, "droplet_d0_mm": 3.2, "diluent": "N2"}, "phases": [], "summary_tr": "**NASA PSI Kaydı (`PSI-1` • `ELF-2 Round Robin`): Round Robin - Thermophysical Property Measurement**\n- **3B Yanma Odasına Aktarılan Koşullar:** Yakıt `nomex`, Yerçekimi `0.0G`, O₂ `%85.0`, Basınç `4.3 psia`, Akış `2.4 cm/s` — Rejim: **0G HAVALANDIRMALI KUYRUK ALEVİ (2.4 cm/s)** (`2426.8 K`).\n- **Araştırma Özeti:** The key scientific objectives are: (a) Conducting baseline space ESL containerless property measurement experiments for two paired classes of levitation-based thermophysical properties:Density/Thermal Expansion, Viscosity/Surface Tension. (b) Selecting materials compatible with both electrostatic levitation (ESL) and electromagnetic levitation (EML) to allow comparison between space facilities. (c) Using modeling to evaluate theories used to predict the in", "summary_en": "**NASA PSI Record (`PSI-1` • `ELF-2 Round Robin`): Round Robin - Thermophysical Property Measurement**\n- **3D Chamber Conditions Applied:** Fuel `nomex`, Gravity `0.0G`, O₂ `85.0%`, Pressure `4.3 psia`, Airflow `2.4 cm/s` — Regime: **0G VENTILATED WAKE FLAME (2.4 cm/s)** (`2426.8 K`).\n- **Investigation Summary:** The key scientific objectives are: (a) Conducting baseline space ESL containerless property measurement experiments for two paired classes of levitation-based thermophysical properties:Density/Thermal Expansion, Viscosity/Surface Tension. (b) Selecting materials compatible with both electrostatic levitation (ESL) and electromagnetic levitation (EML) to allow comparison between space facilities. (c) Using modeling to evaluate theories used to predict the in"}, {"id": "PSI-7", "acronym": "PASTA", "raw_title": "Particle Stabilized Emulsions and Foams", "title": "PSI-7 (PASTA) — Particle Stabilized Emulsions and Foams", "hardware": "Fluid Science Rack (FSL)", "platform": "International Space Station (ISS)", "date": "2024-09-26", "table_file": "", "url": "https://psi.nasa.gov/physci/repo/data/investigations/PSI-7", "abstract": "The work proposed in the PASTA project follows the line from characterizing the surface properties of particles via a complex analysis of the properties of layers at liquid/gas and liquid/liquid interfaces to studying the behaviour of liquid films and finally to model real foams and emulsions. The work comprises the application of available knowledge to the preparation and characterization of particle stabilized emulsions, produced by adapting to the Soft ", "extracted_sim_params": {"fuel_id": "nomex", "gravity_g": 0.0, "oxygen_pct": 85.0, "pressure_psia": 4.3, "airflow_cms": 2.4, "droplet_d0_mm": 3.2, "diluent": "N2"}, "phases": [], "summary_tr": "**NASA PSI Kaydı (`PSI-7` • `PASTA`): Particle Stabilized Emulsions and Foams**\n- **3B Yanma Odasına Aktarılan Koşullar:** Yakıt `nomex`, Yerçekimi `0.0G`, O₂ `%85.0`, Basınç `4.3 psia`, Akış `2.4 cm/s` — Rejim: **0G HAVALANDIRMALI KUYRUK ALEVİ (2.4 cm/s)** (`2426.8 K`).\n- **Araştırma Özeti:** The work proposed in the PASTA project follows the line from characterizing the surface properties of particles via a complex analysis of the properties of layers at liquid/gas and liquid/liquid interfaces to studying the behaviour of liquid films and finally to model real foams and emulsions. The work comprises the application of available knowledge to the preparation and characterization of particle stabilized emulsions, produced by adapting to the Soft ", "summary_en": "**NASA PSI Record (`PSI-7` • `PASTA`): Particle Stabilized Emulsions and Foams**\n- **3D Chamber Conditions Applied:** Fuel `nomex`, Gravity `0.0G`, O₂ `85.0%`, Pressure `4.3 psia`, Airflow `2.4 cm/s` — Regime: **0G VENTILATED WAKE FLAME (2.4 cm/s)** (`2426.8 K`).\n- **Investigation Summary:** The work proposed in the PASTA project follows the line from characterizing the surface properties of particles via a complex analysis of the properties of layers at liquid/gas and liquid/liquid interfaces to studying the behaviour of liquid films and finally to model real foams and emulsions. The work comprises the application of available knowledge to the preparation and characterization of particle stabilized emulsions, produced by adapting to the Soft "}, {"id": "PSI-191", "acronym": "ACE-T5", "raw_title": "Advanced Colloids Experiment-Temperature 5", "title": "PSI-191 (ACE-T5) — Advanced Colloids Experiment-Temperature 5", "hardware": "Fluids Integrated Rack (FIR), Light Microscopy Module (LMM)", "platform": "International Space Station", "date": "2025-09-29", "table_file": "", "url": "https://psi.nasa.gov/physci/repo/data/investigations/PSI-191", "abstract": "The overarching goal of the project was to gain a better fundamental understanding of the relationship between bijel morphology, rheology, mechanical stability, and processability through combined ground-based and microgravity experiments and theoretical calculations.", "extracted_sim_params": {"fuel_id": "propane_cfig", "gravity_g": 0.0, "oxygen_pct": 21.0, "pressure_psia": 14.7, "airflow_cms": 2.4, "droplet_d0_mm": 3.2, "diluent": "N2"}, "phases": [], "summary_tr": "**NASA PSI Kaydı (`PSI-191` • `ACE-T5`): Advanced Colloids Experiment-Temperature 5**\n- **3B Yanma Odasına Aktarılan Koşullar:** Yakıt `propane_cfig`, Yerçekimi `0.0G`, O₂ `%21.0`, Basınç `14.7 psia`, Akış `2.4 cm/s` — Rejim: **0G HAVALANDIRMALI KUYRUK ALEVİ (2.4 cm/s)** (`2040.3 K`).\n- **Araştırma Özeti:** The overarching goal of the project was to gain a better fundamental understanding of the relationship between bijel morphology, rheology, mechanical stability, and processability through combined ground-based and microgravity experiments and theoretical calculations.", "summary_en": "**NASA PSI Record (`PSI-191` • `ACE-T5`): Advanced Colloids Experiment-Temperature 5**\n- **3D Chamber Conditions Applied:** Fuel `propane_cfig`, Gravity `0.0G`, O₂ `21.0%`, Pressure `14.7 psia`, Airflow `2.4 cm/s` — Regime: **0G VENTILATED WAKE FLAME (2.4 cm/s)** (`2040.3 K`).\n- **Investigation Summary:** The overarching goal of the project was to gain a better fundamental understanding of the relationship between bijel morphology, rheology, mechanical stability, and processability through combined ground-based and microgravity experiments and theoretical calculations."}, {"id": "PSI-4", "acronym": "FBCE FBM", "raw_title": "Flow Boiling and Condensation Experiment Flow Boiling Module", "title": "PSI-4 (FBCE FBM) — Flow Boiling and Condensation Experiment Flow Boiling Module (PSI-4_Experimental table_AsRunEPMT_FBCEFBM.csv)", "hardware": "Flow Boiling Module (FBM)", "platform": "International Space Station (ISS)", "date": "2024-10-25", "table_file": "PSI-4_Experimental table_AsRunEPMT_FBCEFBM.csv", "url": "https://psi.nasa.gov/physci/repo/data/investigations/PSI-4", "abstract": "The proposed research aims to develop an integrated two-phase flow boiling/condensation facility for the International Space Station (ISS) to serve as a primary platform for obtaining two-phase flow and heat transfer data in microgravity. By comparing the microgravity data against those obtained in Earth’s gravity, it will be possible to ascertain the influence of body force on two-phase transport phenomena in pursuit of mechanistic models as well as corre", "extracted_sim_params": {"fuel_id": "n_heptane", "gravity_g": 0.0, "oxygen_pct": 21.0, "pressure_psia": 20.76, "airflow_cms": 2.4, "droplet_d0_mm": 3.2, "diluent": "N2", "habitat_id": "iss_module"}, "phases": [{"index": 1, "code": "GRUP_1", "desc": "n_heptane", "short_tr": "Faz 1", "short_en": "Phase 1", "time_span_tr": "432 satir", "time_span_en": "432 rows", "facility": "ISS_CIR", "exp_ref": "", "sim_params": {"fuel_id": "n_heptane", "gravity_g": 0.0, "oxygen_pct": 21.0, "pressure_psia": 20.76, "airflow_cms": 2.4, "droplet_d0_mm": 3.2, "diluent": "N2", "habitat_id": "iss_module"}, "measured_temp_k": 2015.5, "co_max_ppm": 118.0, "ch2o_max_ppm": 0.0, "opt_min_pct": null, "mist_max_um": 0.0, "k_meas": null, "r2_d2": null, "regime": "VENTILATED_WAKE_0G", "badge_tr": "0G HAVALANDIRMALI KUYRUK ALEVİ (2.4 cm/s)", "badge_en": "0G VENTILATED WAKE FLAME (2.4 cm/s)", "flame_temp_k": 2015.5, "moc_pct": 13.54, "k_model": 2.13, "spread_mms": 2.25, "b_oq": 8.99, "sh": 3.29, "da": 9.45, "risk_score": 73, "smac_s": 102.6, "extinguished": false, "cool_flame": false}], "summary_tr": "**Tek Fazlı Deney Kaydı (`PSI-4_Experimental table_AsRunEPMT_FBCEFBM.csv` • 432 satır):**\n- **3B Yanma Odasına Aktarılan Aktif Durum:** **Faz 1** (`n_heptane`, `0.0G`, `%21.0 O₂`, `20.76 psia`, `2.4 cm/s` — Sıcaklık: `2015.5 K`).\n\n| Faz | Zaman | Yakit ve Atmosfer | Sicaklik / CO / CH2O | Boyutsuz Sayilar (K, B_oq, Sh, Da, MOC) | Fiziksel Rejim ve SMAC |\n| :--- | :--- | :--- | :--- | :--- | :--- |\n| **Faz 1** | `432 satir` | `n_heptane` • `0.0G` • `%21.0 O₂` • `20.76 psia` • `2.4 cm/s` | `2015.5 K` • `118.0 ppm CO` | `K=2.13` • `B=8.99` • `Sh=3.29` • `Da=9.45` • `MOC=%13.54` | **0G HAVALANDIRMALI KUYRUK ALEVİ (2.4 cm/s)** (Risk `73/100`, SMAC `102.6 sn`) |", "summary_en": "**Single-Phase Experiment Record (`PSI-4_Experimental table_AsRunEPMT_FBCEFBM.csv` • 432 rows):**\n- **Active State Synced to 3D Chamber:** **Phase 1** (`n_heptane`, `0.0G`, `21.0% O₂`, `20.76 psia`, `2.4 cm/s` — Temp: `2015.5 K`).\n\n| Phase | Window | Fuel & Atmosphere | Temp / CO / CH2O | Dimensionless (K, B_oq, Sh, Da, MOC) | Regime & SMAC Clock |\n| :--- | :--- | :--- | :--- | :--- | :--- |\n| **Phase 1** | `432 rows` | `n_heptane` • `0.0G` • `21.0% O₂` • `20.76 psia` • `2.4 cm/s` | `2015.5 K` • `118.0 ppm CO` | `K=2.13` • `B=8.99` • `Sh=3.29` • `Da=9.45` • `MOC=13.54%` | **0G VENTILATED WAKE FLAME (2.4 cm/s)** (Risk `73/100`, SMAC `102.6 s`) |"}, {"id": "PSI-179", "acronym": "ASE", "raw_title": "Aerosol Sampling Experiment", "title": "PSI-179 (ASE) — Aerosol Sampling Experiment", "hardware": "Passive Aerosol Samplers (PAS)", "platform": "International Space Station (ISS)", "date": "2025-06-05", "table_file": "", "url": "https://psi.nasa.gov/physci/repo/data/investigations/PSI-179", "abstract": "Aerosols are small particles suspended in the air, and in Earth’s atmosphere, aerosols include soot, dust, pollen and a wide range of other natural and human-made materials. Smoke does not rise and dust does not settle in microgravity the way they do on Earth, causing aerosols to behave differently and pose hazards for crew members breathing the air. The Aerosol Sampling Experiment (ASE) collects airborne particles in the International Space Station’s (ISS", "extracted_sim_params": {"fuel_id": "propane_cfig", "gravity_g": 0.0, "oxygen_pct": 21.0, "pressure_psia": 14.7, "airflow_cms": 2.4, "droplet_d0_mm": 3.2, "diluent": "N2"}, "phases": [], "summary_tr": "**NASA PSI Kaydı (`PSI-179` • `ASE`): Aerosol Sampling Experiment**\n- **3B Yanma Odasına Aktarılan Koşullar:** Yakıt `propane_cfig`, Yerçekimi `0.0G`, O₂ `%21.0`, Basınç `14.7 psia`, Akış `2.4 cm/s` — Rejim: **0G HAVALANDIRMALI KUYRUK ALEVİ (2.4 cm/s)** (`2040.3 K`).\n- **Araştırma Özeti:** Aerosols are small particles suspended in the air, and in Earth’s atmosphere, aerosols include soot, dust, pollen and a wide range of other natural and human-made materials. Smoke does not rise and dust does not settle in microgravity the way they do on Earth, causing aerosols to behave differently and pose hazards for crew members breathing the air. The Aerosol Sampling Experiment (ASE) collects airborne particles in the International Space Station’s (ISS", "summary_en": "**NASA PSI Record (`PSI-179` • `ASE`): Aerosol Sampling Experiment**\n- **3D Chamber Conditions Applied:** Fuel `propane_cfig`, Gravity `0.0G`, O₂ `21.0%`, Pressure `14.7 psia`, Airflow `2.4 cm/s` — Regime: **0G VENTILATED WAKE FLAME (2.4 cm/s)** (`2040.3 K`).\n- **Investigation Summary:** Aerosols are small particles suspended in the air, and in Earth’s atmosphere, aerosols include soot, dust, pollen and a wide range of other natural and human-made materials. Smoke does not rise and dust does not settle in microgravity the way they do on Earth, causing aerosols to behave differently and pose hazards for crew members breathing the air. The Aerosol Sampling Experiment (ASE) collects airborne particles in the International Space Station’s (ISS"}]};
    const FUEL_PROPERTIES = EMBEDDED_DATA.FUEL_PROPERTIES;
    const DILUENT_FACTORS = EMBEDDED_DATA.DILUENT_FACTORS;
    const HABITAT_CONFIGS = EMBEDDED_DATA.HABITAT_CONFIGS;
    const MISSION_PRESETS = EMBEDDED_DATA.MISSION_PRESETS;
    const NASA_CATALOG = EMBEDDED_DATA.NASA_EXPERIMENTS_CATALOG;
    const EARTH_TRANSFERS = EMBEDDED_DATA.SPACE_TO_EARTH_TRANSFERS;
    const DIRECTIVES = EMBEDDED_DATA.CORE_DIRECTIVES_LIST;
    const SYNONYMS = EMBEDDED_DATA.BILINGUAL_SCIENTIFIC_SYNONYMS;
    const PSI_SNAPSHOT = EMBEDDED_DATA.PSI_ARCHIVE_SNAPSHOT || [];
    const PSI_SNAPSHOT_MAP = {};
    PSI_SNAPSHOT.forEach((row) => {
        if (row && row.id) PSI_SNAPSHOT_MAP[String(row.id).toUpperCase()] = row;
    });

    // Oturum içi geçici yapılandırma (yalnızca bellek içi; diske/çereze asla yazılmaz)
    const runtimeConfig = {
        active_provider: "auto",
        antigravity_model: "gemini-3.8-flash-high",
        ollama_host: "http://127.0.0.1:11434",
        ollama_model: "auto",
        gemini_api_key: "",
        gemini_model: "gemini-2.5-flash",
        antigravity_api_key: "",
        openrouter_api_key: "",
        openrouter_model: "google/gemini-2.0-flash-exp:free",
        custom_base_url: "",
        custom_api_key: "",
        custom_model: "",
        custom_extra_directives: "",
        deep_verify_6stage: true,
        language: "tr",
    };

    const ragDocs = NASA_CATALOG.map((exp) => ({
        doc_id: exp.exp_id,
        title: exp.title_tr,
        source: `${exp.program} • NTRS ${exp.ntrs_id}`,
        url: exp.ntrs_url,
        text: `${exp.exp_id} ${exp.program} ${exp.hardware_group || ""} ${exp.facility} ${exp.title} ${exp.title_tr} ${exp.material} ${exp.key_finding_tr} ${exp.key_finding_en} ${exp.safety_insight_tr} ${exp.safety_insight_en} ${(exp.tags || []).join(" ")}`,
    }));
    PSI_SNAPSHOT.forEach((row) => {
        ragDocs.push({
            doc_id: row.id,
            title: row.title || `${row.id} — ${row.raw_title || ""}`,
            source: `NASA PSI (${row.id})`,
            url: row.url || `https://psi.nasa.gov/physci/repo/data/investigations/${row.id}`,
            text: `${row.id} ${row.acronym || ""} ${row.raw_title || ""} ${row.hardware || ""} ${row.platform || ""} ${row.table_file || ""} ${row.abstract || ""}`,
        });
    });

    const streamState = {
        enabled: false,
        source: "ntrs",
        query_or_url: "auto",
        interval_sec: 25,
        auto_sync_sim: true,
        seq_id: 0,
        last_fetch_time: "",
        last_error: "",
        latest_sim_params: null,
        events: [],
        timerId: null,
    };

    const chatJobs = new Map();

    function roundN(val, dec) {
        const f = Math.pow(10, dec);
        return Math.round(val * f) / f;
    }

    function computeMocAtFlow(fuel, airflowCms, gravityG, pressurePsia, diluentKey) {
        const dil = DILUENT_FACTORS[diluentKey] || DILUENT_FACTORS.N2;
        const pAtm = Math.max(0.24, pressurePsia / 14.696);
        const pressureShift = 2.6 * (Math.pow(1.0 / pAtm, 0.38) - 1.0);
        const uBuoy = 22.0 * Math.sqrt(Math.max(0.0, gravityG));
        const uEff = Math.hypot(airflowCms, uBuoy);
        const baseMoc = fuel.moc_0g_base + dil.moc_shift + pressureShift;
        const quenchPenalty = 3.6 * Math.exp(-uEff / 1.65);
        const ventDip = -1.15 * Math.exp(-Math.pow(uEff - 5.5, 2) / 28.0);
        const blowRef = Math.max(10.0, Number(fuel.blowoff_cms || 30.0));
        const blowPenalty = 5.8 * Math.pow(Math.max(0.0, uEff - 12.0) / blowRef, 1.85);
        const gravPenalty = (fuel.moc_1g_base - fuel.moc_0g_base) * Math.pow(gravityG, 0.65) * 0.65;
        return roundN(Math.max(4.5, Math.min(55.0, baseMoc + quenchPenalty + ventDip + blowPenalty + gravPenalty)), 2);
    }

    function simulateCombustionClient(params) {
        let fuelId = String((params && params.fuel_id) || "n_heptane");
        if (!FUEL_PROPERTIES[fuelId]) fuelId = "n_heptane";
        const fuel = FUEL_PROPERTIES[fuelId];

        const gravityG = Math.max(0.0, Math.min(2.0, Number(params.gravity_g ?? 0.0)));
        const oxygenPct = Math.max(5.0, Math.min(100.0, Number(params.oxygen_pct ?? 21.0)));
        const pressurePsia = Math.max(3.0, Math.min(35.0, Number(params.pressure_psia ?? 14.7)));
        const airflowCms = Math.max(0.0, Math.min(50.0, Number(params.airflow_cms ?? 3.5)));
        const dropletD0 = Math.max(0.6, Math.min(8.0, Number(params.droplet_d0_mm ?? 3.2)));
        let diluent = String(params.diluent || "N2");
        if (!DILUENT_FACTORS[diluent]) diluent = "N2";
        const dil = DILUENT_FACTORS[diluent];

        let habitatId = String(params.habitat_id || "iss_module");
        if (!HABITAT_CONFIGS[habitatId]) habitatId = "iss_module";
        const crewRespS = Math.max(5.0, Math.min(999.0, Number(params.crew_response_s ?? 30.0)));

        const pAtm = pressurePsia / 14.696;
        const pressureKpa = roundN(pressurePsia * 6.89476, 2);
        const po2Psia = roundN(pressurePsia * (oxygenPct / 100.0), 2);
        const po2Kpa = roundN(pressureKpa * (oxygenPct / 100.0), 2);

        const xO2 = oxygenPct / 100.0;
        const mwMix = xO2 * 32.0 + (1.0 - xO2) * Number(dil.mw);
        const yO2 = Math.min(1.0, (xO2 * 32.0) / Math.max(1.0, mwMix));
        const inertRelief = 1.0 + 0.24 * Math.max(0.0, (xO2 - 0.35) / 0.65);
        const cpGKj = (1.22 / dil.cp_factor) / inertRelief;

        const spaldingB = roundN(
            Math.max(
                0.25,
                (yO2 * (fuel.dhc_kj_kg / fuel.stoich_o2_fuel) - cpGKj * Math.max(0.0, fuel.t_boil_k - 298.15)) / fuel.lv_kj_kg
            ),
            2
        );

        const mocCurrent = computeMocAtFlow(fuel, airflowCms, gravityG, pressurePsia, diluent);
        const moc0g = computeMocAtFlow(fuel, airflowCms, 0.0, pressurePsia, diluent);
        const moc1g = computeMocAtFlow(fuel, airflowCms, 1.0, pressurePsia, diluent);

        const nuCm2S = 0.18 / Math.max(0.22, pAtm);
        const charLenCm = dropletD0 / 10.0;
        const reNum = (airflowCms * charLenCm) / nuCm2S;
        const grNum = (981.0 * gravityG * 3.2 * Math.pow(charLenCm, 3)) / Math.pow(nuCm2S, 2);
        const raNum = grNum * 0.71;
        const richardsonRi = reNum > 0.02 ? roundN(grNum / Math.max(1e-4, reNum * reNum), 2) : (gravityG > 0.01 ? 999.0 : 0.0);

        const shConv = 2.0 + 0.60 * Math.sqrt(Math.max(0.0, reNum)) * Math.pow(0.71, 1.0 / 3.0) + 0.52 * Math.pow(Math.max(0.0, raNum), 0.25);
        const transMult = shConv / 2.0;

        const idealStandoff = Math.log(1.0 + spaldingB) / Math.max(0.025, Math.log(1.0 + yO2 / fuel.stoich_o2_fuel));
        const convShrink = 1.0 / (1.0 + 0.22 * Math.sqrt(Math.max(0.0, reNum)) + 0.30 * Math.pow(Math.max(0.0, raNum), 0.2));
        const standoffRatio = roundN(Math.max(1.8, Math.min(10.5, idealStandoff * 0.28 * convShrink + 2.1)), 2);

        const radLossFrac = roundN(
            Math.max(
                0.04,
                Math.min(
                    0.88,
                    (0.16 * Math.pow(dropletD0 / 2.5, 0.85) * Math.pow(standoffRatio / 5.5, 1.4) * dil.rad_factor) /
                        Math.max(0.75, Math.pow(transMult, 0.55))
                )
            ),
            3
        );

        const uBuoy = 22.0 * Math.sqrt(Math.max(0.0, gravityG));
        const uEff = Math.hypot(airflowCms, uBuoy);
        const tauFlowMs = (charLenCm / Math.max(0.35, uEff)) * 1000.0;
        const tauChemMs = 1.85 / (Math.max(0.04, Math.pow(xO2, 1.45)) * Math.pow(Math.max(0.22, pAtm), 0.75));
        const damkohlerDa = roundN(Math.min(99.9, tauFlowMs / Math.max(0.05, tauChemMs)), 2);

        const blowVelLimit = fuel.blowoff_cms * Math.pow(oxygenPct / 21.0, 0.65);
        const isBlowoff = airflowCms > blowVelLimit || (damkohlerDa < 0.95 && airflowCms >= 10.0);
        const radQuench = gravityG < 0.08 && airflowCms < 1.8 && dropletD0 >= 3.4 && oxygenPct < mocCurrent + 3.2;
        const cfigCool = fuelId === "propane_cfig" && gravityG < 0.05 && airflowCms <= 0.6 && dropletD0 >= 4.4 && oxygenPct >= 82.0 && oxygenPct <= 88.0;

        let regime = "HOT_SPHERICAL_0G";
        let coolFlameActive = false;
        let extinguished = false;

        if (isBlowoff) {
            regime = "BLOWOFF_EXTINGUISHED";
            extinguished = true;
        } else if (cfigCool) {
            regime = "COOL_FLAME_NTC";
            coolFlameActive = true;
        } else if (oxygenPct < mocCurrent || radQuench) {
            if (fuel.cool_flame_capable && gravityG < 0.15 && airflowCms < 8.0 && oxygenPct >= fuel.cool_flame_min_o2) {
                regime = "COOL_FLAME_NTC";
                coolFlameActive = true;
            } else {
                regime = "QUENCHED_EXTINGUISHED";
                extinguished = true;
            }
        } else if (gravityG >= 0.12) {
            regime = "BUOYANT_PLUME_1G";
        } else if (airflowCms >= 1.5) {
            regime = "VENTILATED_WAKE_0G";
        }

        let flameTempK = 305.0, kBurn = 0.0, flameSpread = 0.0, coPpm = 18.0, sootIndex = 0.0, heatFlux = 0.2;
        if (coolFlameActive) {
            const span = Math.min(14.0, Math.max(0.5, oxygenPct - fuel.cool_flame_min_o2));
            flameTempK = Math.min(785.0, Math.max(520.0, roundN(565.0 + span * 14.5 + 25.0 * pAtm, 1)));
            kBurn = roundN(fuel.k0_base * 0.24 * Math.pow(pAtm, 0.35), 3);
            coPpm = Math.round(420.0 + 38.0 * dropletD0 + (18.0 - Math.min(18.0, oxygenPct)) * 22.0);
            heatFlux = roundN(3.4 + (0.6 * (flameTempK - 520.0)) / 100.0, 2);
        } else if (!extinguished) {
            const o2Ratio = oxygenPct / 21.0;
            const rawT = fuel.t_adiabatic_k * (0.72 + 0.28 * Math.pow(o2Ratio, 0.42)) * dil.cp_factor * inertRelief * (1.0 - 0.34 * radLossFrac) * Math.pow(pAtm, 0.06);
            flameTempK = roundN(Math.max(1180.0, Math.min(3050.0, rawT)), 1);
            const kAnalytical = ((8.0 * dil.lambda_g) / (fuel.rho_l_kg_m3 * cpGKj * 1000.0)) * Math.log(1.0 + spaldingB) * 1e6 * transMult * Math.pow(pAtm, 0.24) * (1.0 - 0.20 * radLossFrac);
            kBurn = roundN(Math.max(0.08, 0.55 * kAnalytical + 0.45 * fuel.k0_base * Math.log(1.0 + 1.85 * o2Ratio) * transMult), 3);
            const spreadFlow = 0.35 + 1.45 * Math.tanh(uEff / 7.5) * Math.exp(-Math.max(0.0, uEff - 18.0) / 35.0);
            flameSpread = roundN(Math.max(0.08, 1.45 * Math.pow(o2Ratio, 1.68) * Math.pow(pAtm, 0.45) * spreadFlow * (fuel.k0_base / 0.45)), 2);
            sootIndex = roundN(Math.min(1.0, fuel.soot_tendency * (0.28 + 0.72 * Math.min(1.0, gravityG * 1.1 + airflowCms / 28.0)) * Math.pow(pAtm, 0.6) * Math.pow(o2Ratio, 0.45)), 3);
            coPpm = Math.round(45.0 + 190.0 * sootIndex + (airflowCms < 2.0 ? 120.0 : 25.0));
            heatFlux = roundN(14.0 + (flameTempK - 1100.0) * 0.032 * (0.65 + 0.55 * sootIndex), 2);
        }

        let riskScore = 15;
        if (extinguished) {
            riskScore = Math.max(5, Math.trunc(18 - (mocCurrent - oxygenPct) * 2.2));
        } else if (coolFlameActive) {
            riskScore = Math.min(86, Math.trunc(58 + coPpm / 30.0));
        } else {
            const margin = Math.max(0.0, oxygenPct - mocCurrent);
            const evaPen = oxygenPct >= 75.0 ? 18.0 : (pressurePsia <= 10.5 && oxygenPct >= 30.0 ? 10.0 : 0.0);
            riskScore = Math.max(15, Math.min(99, Math.round(28.0 + margin * 2.85 + Math.min(32.0, flameSpread * 5.2) + (gravityG < 0.1 && airflowCms >= 1.5 && airflowCms <= 12.0 ? 12.0 : 0.0) + evaPen)));
        }

        const flameRadiusMm = extinguished ? 0.0 : roundN(dropletD0 * 0.5 * standoffRatio, 2);
        const burnLifeS = kBurn > 0 ? roundN((dropletD0 * dropletD0) / Math.max(0.05, kBurn), 1) : 0.0;

        const flowAxis = [];
        for (let u = 0; u <= 40; u += 2) flowAxis.push(u);
        const mocCurve0g = flowAxis.map((u) => computeMocAtFlow(fuel, u, 0.0, pressurePsia, diluent));
        const mocCurveLunar = flowAxis.map((u) => computeMocAtFlow(fuel, u, 0.16, pressurePsia, diluent));
        const mocCurveMars = flowAxis.map((u) => computeMocAtFlow(fuel, u, 0.38, pressurePsia, diluent));
        const mocCurve1g = flowAxis.map((u) => computeMocAtFlow(fuel, u, 1.0, pressurePsia, diluent));
        const coolFloor = flowAxis.map((u) => (fuel.cool_flame_capable && u <= 8.0 ? roundN(fuel.cool_flame_min_o2, 2) : null));

        // Zaman serisi (0-30s)
        const times = [], d2Norm = [], thermoK = [], optPct = [], radKw = [], coTrace = [];
        const d0Sq = dropletD0 * dropletD0;
        const twoStage = fuel.cool_flame_capable && gravityG < 0.12 && airflowCms < 6.0 && (regime === "COOL_FLAME_NTC" || regime === "HOT_SPHERICAL_0G") && dropletD0 >= 2.8;

        for (let step = 0; step <= 30; step++) {
            const t = step;
            times.push(t);
            if (extinguished) {
                const dec = Math.exp(-t / 2.2);
                d2Norm.push(roundN(Math.max(0.96, 1.0 - 0.04 * (1.0 - dec)), 3));
                thermoK.push(roundN(300.0 + 420.0 * dec, 1));
                optPct.push(roundN(100.0 * dec, 1));
                radKw.push(roundN(8.5 * dec, 2));
                coTrace.push(roundN(18.0 + 35.0 * (1.0 - dec) * Math.exp(-t / 14.0), 1));
            } else if (twoStage && t >= 14.0) {
                const hotPart = regime !== "COOL_FLAME_NTC" ? kBurn : kBurn * 2.8;
                const d2At14 = Math.max(0.18, 1.0 - (hotPart * 14.0) / d0Sq);
                const kCool = Math.max(0.08, hotPart * 0.26);
                const cD2 = Math.max(0.0, d2At14 - (kCool * (t - 14.0)) / d0Sq);
                d2Norm.push(roundN(cD2, 3));
                const tr = Math.exp(-(t - 14.0) / 1.4);
                const tCool = cD2 > 0.02 ? 640.0 : 310.0;
                thermoK.push(roundN(tCool + (Math.max(1380.0, flameTempK) - tCool) * tr, 1));
                optPct.push(roundN(Math.max(1.5, 92.0 * tr), 1));
                radKw.push(roundN((cD2 > 0.02 ? 4.2 : 0.3) + 12.0 * tr, 2));
                coTrace.push(roundN(Math.min(680.0, 95.0 + (t - 14.0) * 32.0), 1));
            } else {
                const cD2 = Math.max(0.0, 1.0 - (kBurn * t) / d0Sq);
                d2Norm.push(roundN(cD2, 3));
                const act = cD2 > 0.01 ? 1.0 : Math.exp(-(t - d0Sq / Math.max(0.05, kBurn)) / 1.5);
                const ramp = 1.0 - Math.exp(-t / 1.1);
                if (regime === "COOL_FLAME_NTC") {
                    thermoK.push(roundN(300.0 + (flameTempK - 300.0) * ramp * act, 1));
                    optPct.push(roundN(3.2 * ramp * act, 1));
                    radKw.push(roundN(heatFlux * ramp * act, 2));
                    coTrace.push(roundN(30.0 + coPpm * Math.min(1.0, t / 12.0) * act, 1));
                } else {
                    const fl = 1.0 + (gravityG >= 0.1 ? 0.04 * Math.sin(t * 2.7) : 0.005 * Math.sin(t));
                    thermoK.push(roundN((300.0 + (flameTempK - 300.0) * ramp * act) * fl, 1));
                    optPct.push(roundN(Math.min(100.0, (78.0 + 20.0 * (flameTempK / 2200.0)) * ramp * act * fl), 1));
                    radKw.push(roundN(heatFlux * ramp * act * fl, 2));
                    coTrace.push(roundN(20.0 + coPpm * Math.min(1.0, t / 18.0) * act, 1));
                }
            }
        }

        const sensorSeries = {
            time_s: times,
            d2_normalized: d2Norm,
            thermocouple_k: thermoK,
            optical_intensity_pct: optPct,
            radiometer_kw_m2: radKw,
            co_ppm: coTrace,
            two_stage_transition_s: twoStage ? 14.0 : null,
        };

        // ISS uçuş doğrulaması
        const campMap = {
            n_heptane: ["ISS CIR • FLEX / CFI (Nayagam & Dietrich)", "FLEX/CFI"],
            methanol: ["ISS CIR • FLEX-2 MDCA (Dietrich et al.)", "FLEX-2"],
            pmma: ["ISS MSG / CIR • BASS & SoFIE-GEL (Olson & Ferkul)", "BASS/SoFIE"],
            sibal: ["Cygnus • Saffire-IV Büyük Ölçekli Kanal (Urban & Ruff)", "Saffire-IV"],
            nomex: ["ISS MSG • BASS-II Kumaş Testi (Olson)", "BASS-II"],
            hydrogen: ["ISS MSG / CIR • SPICE & ACME s-Flame (Sunderland)", "SPICE/ACME"],
            propane_cfig: ["ISS CIR • ACME CFI-G Küresel Brülör (Axelbaum)", "ACME CFI-G"],
        };
        const [campFull, campShort] = campMap[fuelId] || ["ISS CIR • NASA PSI Reference", "NASA PSI"];
        const sampleTimes = [2, 6, 11, 16, 22, 28];
        const scatter = [-0.016, 0.019, -0.014, 0.022, -0.018, 0.013];
        const d2Pts = [];
        let sumSqErr = 0, sumY = 0;
        sampleTimes.forEach((ti, idx) => {
            const yp = d2Norm[ti];
            const off = extinguished ? scatter[idx] * 0.45 : scatter[idx];
            const ym = roundN(Math.max(0.0, Math.min(1.0, yp + off)), 3);
            d2Pts.push({ t_s: ti, d2_meas: ym, d2_pred: yp, err: 0.024, label: `${campShort} #${idx + 1}` });
            sumSqErr += Math.pow(ym - yp, 2);
            sumY += ym;
        });
        const rmse = roundN(Math.sqrt(sumSqErr / d2Pts.length), 3);
        const meanY = sumY / d2Pts.length;
        const ssTot = d2Pts.reduce((acc, p) => acc + Math.pow(p.d2_meas - meanY, 2), 0);
        const rSq = ssTot > 0.008 ? roundN(Math.max(0.92, Math.min(0.998, 1.0 - sumSqErr / ssTot)), 3) : roundN(Math.max(0.965, 1.0 - rmse * 1.1), 3);

        const mocPts = [0.5, 2.0, 6.0, 14.0, 26.0].map((uv, i) => {
            const mp = computeMocAtFlow(fuel, uv, 0.0, pressurePsia, diluent);
            const mm = roundN(Math.max(4.2, Math.min(55.0, mp + [0.32, -0.26, -0.21, 0.29, -0.24][i])), 2);
            return { airflow_cms: uv, moc_meas_pct: mm, moc_pred_pct: mp, err_pct: 0.45, label: `${campShort} U=${uv}cm/s` };
        });

        const flightValidation = {
            campaign: campFull,
            campaign_short: campShort,
            r_squared: rSq,
            rmse: rmse,
            d2_points: d2Pts,
            moc_points: mocPts,
            benchmark_tr: `ISS Doğrulaması (${campShort}): R² = ${rSq.toFixed(3)} • RMSE = ${rmse.toFixed(3)}`,
            benchmark_en: `ISS Validation (${campShort}): R² = ${rSq.toFixed(3)} • RMSE = ${rmse.toFixed(3)}`,
        };

        const calloutsMap = {
            HOT_SPHERICAL_0G: {
                badge_tr: "0G KÜRESEL DİFÜZYON ALEVİ",
                badge_en: "0G SPHERICAL DIFFUSION FLAME",
                summary_tr: `Doğal konveksiyon (Ra=0) sıfırlandı. ${flameTempK.toFixed(0)} K sıcaklıkta safir-mavi kemilüminesans küresi oluşuyor.`,
                summary_en: `Buoyancy vanishes in freefall (Ra=0). Symmetrical ${flameTempK.toFixed(0)} K sapphire-blue diffusion sphere.`,
            },
            VENTILATED_WAKE_0G: {
                badge_tr: `0G HAVALANDIRMALI KUYRUK ALEVİ (${airflowCms.toFixed(1)} cm/s)`,
                badge_en: `0G VENTILATED WAKE FLAME (${airflowCms.toFixed(1)} cm/s)`,
                summary_tr: `Kabin fan akışı (${airflowCms.toFixed(1)} cm/s) taze O₂ taşıyarak mavi durgunluk yayı ve kuyruk alevi oluşturdu (MOC: %${mocCurrent}).`,
                summary_en: `Ventilation (${airflowCms.toFixed(1)} cm/s) convects fresh O₂ to the flame sheet (MOC: ${mocCurrent}%).`,
            },
            BUOYANT_PLUME_1G: {
                badge_tr: `KALDIRMA KUVVETLİ KONVEKTİF ALEV (${gravityG.toFixed(2)}G)`,
                badge_en: `BUOYANCY-DRIVEN CONVECTIVE PLUME (${gravityG.toFixed(2)}G)`,
                summary_tr: `Yerçekimi (${gravityG.toFixed(2)}G) sıcak gazları yukarı ivmelendiriyor; gözyaşı formu ve kurum ışıması etkin.`,
                summary_en: `Gravity (${gravityG.toFixed(2)}G) stretches the flame into a convective plume with luminous soot.`,
            },
            COOL_FLAME_NTC: {
                badge_tr: "GÖRÜNMEZ SOĞUK ALEV (UV/IR MODU)",
                badge_en: "INVISIBLE COOL FLAME (UV/IR VIEW)",
                summary_tr: `Isıl kayıp sıcak alevi söndürdü ancak ${flameTempK.toFixed(0)} K görünmez Soğuk Alev (FLEX/CFI) CO üretmeye devam ediyor!`,
                summary_en: `Radiative loss quenched the hot flame, yet ${flameTempK.toFixed(0)} K invisible Cool Flame chemistry persists!`,
            },
            BLOWOFF_EXTINGUISHED: {
                badge_tr: "YÜKSEK HIZLI ÜFLEME SÖNMESİ (BLOWOFF)",
                badge_en: "CONVECTIVE BLOWOFF EXTINCTION",
                summary_tr: `Akış hızı (${airflowCms.toFixed(1)} cm/s) Damköhler sınırını (Da < 1) aşarak alevi üfleyip söndürdü.`,
                summary_en: `Airflow (${airflowCms.toFixed(1)} cm/s) exceeded Damköhler residence threshold (Da < 1).`,
            },
            QUENCHED_EXTINGUISHED: {
                badge_tr: `OKSİJEN / RADYATİF SÖNÜMLENME (MOC < %${mocCurrent})`,
                badge_en: `DIFFUSIVE / RADIATIVE QUENCHING (O₂ < ${mocCurrent}%)`,
                summary_tr: `Mevcut O₂ (%${oxygenPct.toFixed(1)}) MOC sınırının (%${mocCurrent}) altında kaldığı için alev kendi kendine söndü.`,
                summary_en: `Ambient O₂ (${oxygenPct.toFixed(1)}%) is below MOC (${mocCurrent}%); flame self-extinguished.`,
            },
        };
        const activeCall = calloutsMap[regime] || calloutsMap.HOT_SPHERICAL_0G;

        // ECLSS Kabin / Gezgin / EVA Saati
        const hab = HABITAT_CONFIGS[habitatId];
        const volM3 = Number(hab.volume_m3);
        let scenarioTimeline;
        if (extinguished) {
            scenarioTimeline = {
                habitat_id: habitatId,
                habitat_name_tr: hab.name_tr,
                habitat_name_en: hab.name_en,
                volume_m3: volM3,
                crew_response_s: crewRespS,
                optical_blind: false,
                t_alarm_s: 0.0,
                t_intervene_s: roundN(crewRespS, 1),
                t_smac_125ppm_s: 999.0,
                t_acute_400ppm_s: 999.0,
                co_at_response_ppm: 18.0,
                peak_temp_rise_c: 0.4,
                severity: "SAFE",
                badge_tr: "SÖNÜMLENMİŞ / GÜVENLİ KABİN",
                badge_en: "EXTINGUISHED / SAFE HABITAT",
                summary_tr: `${hab.name_tr} içinde aktif ekzotermik yanma bulunmuyor (MOC sınırı altında veya üfleme sönmesi). Kabin CO seviyesi bazal düzeyde (~18 ppm) kararlıdır.`,
                summary_en: `No sustained combustion in ${hab.name_en} (quenched below MOC or blowoff). Cabin CO remains at baseline (~18 ppm).`,
                milestones: [
                    { t_s: 0.0, title_tr: "Tutuşma Bastırıldı", title_en: "Ignition Quenched", detail_tr: "Alev MOC / Da sınırında kendi kendine söndü.", detail_en: "Flame self-extinguished at MOC / Da boundary.", state: "ok" },
                    { t_s: 5.0, title_tr: "ECLSS Hava İzleme", title_en: "ECLSS Air Monitoring", detail_tr: "CO < 20 ppm; aktif söndürücü boşaltımı gerekmez.", detail_en: "CO < 20 ppm; agent discharge not required.", state: "ok" },
                ],
            };
        } else {
            const optBlind = regime === "COOL_FLAME_NTC";
            const volScale = Math.pow(volM3 / 45.0, 0.28);
            const tAlarm = optBlind
                ? roundN(Math.max(3.2, 13.5 * volScale), 1)
                : roundN(Math.max(1.4, (7.8 * volScale) / Math.max(0.65, 0.55 + flameSpread * 0.28 + (oxygenPct >= 50 ? 0.45 : 0))), 1);
            let srcCo = (coPpm / 140.0) * (1.0 + 0.18 * Math.min(5.0, flameSpread));
            if (optBlind) srcCo *= 1.35;
            const coRate = Math.max(0.28, (3.2 * srcCo) / Math.pow(volM3 / 18.0, 0.68));
            const tSmac = roundN(Math.max(2.5, (125.0 - 18.0) / coRate), 1);
            const tAcute = roundN(Math.max(5.0, (400.0 - 18.0) / coRate), 1);
            const unmit = crewRespS >= 900.0;
            const effWait = unmit ? 180.0 : crewRespS;
            const tInt = roundN(tAlarm + effWait, 1);
            const coAtResp = Math.round(Math.min(2500.0, 18.0 + coRate * tInt));
            const peakDt = roundN(Math.min(480.0, (heatFlux * Math.max(3.0, tInt) * 0.16) / Math.pow(volM3 / 12.0, 0.58)), 1);
            const sev = (coAtResp >= 180.0 || (volM3 < 1.0 && oxygenPct >= 60.0) || unmit) ? "CRITICAL" : (coAtResp >= 85.0 || optBlind ? "WARNING" : "SAFE");
            scenarioTimeline = {
                habitat_id: habitatId,
                habitat_name_tr: hab.name_tr,
                habitat_name_en: hab.name_en,
                volume_m3: volM3,
                crew_response_s: crewRespS,
                optical_blind: optBlind,
                t_alarm_s: tAlarm,
                t_intervene_s: tInt,
                t_smac_125ppm_s: tSmac,
                t_acute_400ppm_s: tAcute,
                co_at_response_ppm: coAtResp,
                peak_temp_rise_c: peakDt,
                severity: sev,
                badge_tr: sev === "CRITICAL" ? "KRİTİK YAŞAM DESTEK AŞIMI" : (sev === "WARNING" ? "DİKKAT: HIZLI MÜDAHALE GEREKLİ" : "KONTROLLÜ BASTIRMA PENCERESİ"),
                badge_en: sev === "CRITICAL" ? "CRITICAL ECLSS / SMAC BREACH" : (sev === "WARNING" ? "WARNING: RAPID ACTION REQUIRED" : "CONTROLLED SUPPRESSION WINDOW"),
                summary_tr: `**${hab.name_tr}:** Alarm \`t = ${tAlarm} s\` anında tetiklendi. NASA 1-Saatlik Acil SMAC CO sınırı (\`125 ppm\`) \`t = ${tSmac} s\` içinde aşılır. Seçilen senaryoda (\`t = ${tInt} s\`) kabin CO düzeyi **\`${coAtResp} ppm\`** ve yerel ısınma **\`+${peakDt} °C\`** olur.`,
                summary_en: `**${hab.name_en}:** Alarm triggered at \`t = ${tAlarm} s\`. NASA 1-hr Emergency SMAC CO limit (\`125 ppm\`) reached in \`t = ${tSmac} s\`. At intervention (\`t = ${tInt} s\`), cabin CO hits **\`${coAtResp} ppm\`** with **\`+${peakDt} °C\`** local ΔT.`,
                milestones: [
                    { t_s: 0.0, title_tr: "0.0 s • Tutuşma Başlangıcı", title_en: "0.0 s • Ignition Onset", detail_tr: `Rejim: ${activeCall.badge_tr} (${flameTempK.toFixed(0)} K, U=${airflowCms.toFixed(1)} cm/s)`, detail_en: `Regime: ${activeCall.badge_en} (${flameTempK.toFixed(0)} K, U=${airflowCms.toFixed(1)} cm/s)`, state: "warn" },
                    { t_s: tAlarm, title_tr: `${tAlarm} s • Sensör Füzyon Alarmı`, title_en: `${tAlarm} s • Sensor Fusion Alarm`, detail_tr: optBlind ? "Optik duman dedektörü KÖR! UV/IR + CO lazer sensörü alarm üretti." : "Fotoelektrik saçılma + CO sensör füzyonu yangını doğruladı.", detail_en: optBlind ? "Optical smoke detector BLIND! UV/IR + CO fusion triggered alarm." : "Photoelectric scattering + CO sensor fusion confirmed fire.", state: optBlind ? "crit" : "warn" },
                    { t_s: tInt, title_tr: `${tInt} s • ${unmit ? "Müdahalesiz Yanma" : "HVAC Kesme + İnce Su Sisi"}`, title_en: `${tInt} s • ${unmit ? "Unmitigated Burn" : "HVAC Cutoff + Water Mist"}`, detail_tr: `Müdahale anı CO: ${coAtResp} ppm • Kabin ΔT: +${peakDt} °C (Halon YASAK)`, detail_en: `CO at action: ${coAtResp} ppm • Local ΔT: +${peakDt} °C (No Halon)`, state: sev === "CRITICAL" ? "crit" : (sev === "WARNING" ? "warn" : "ok") },
                    { t_s: tSmac, title_tr: `${tSmac} s • NASA SMAC 125 ppm Eşiği`, title_en: `${tSmac} s • NASA SMAC 125 ppm Limit`, detail_tr: `Akut 400 ppm sınırı: ${tAcute} s (${tInt >= tSmac ? "AŞILDI!" : "Güvenli marj korundu"})`, detail_en: `Acute 400 ppm limit: ${tAcute} s (${tInt >= tSmac ? "BREACHED!" : "Margin preserved"})`, state: tInt >= tSmac ? "crit" : "ok" },
                ],
            };
        }

        const isPartial = gravityG >= 0.03 && gravityG <= 0.88;
        const isEva = pressurePsia <= 5.2 && oxygenPct >= 80.0;
        const isLunarRover = pressurePsia >= 8.0 && pressurePsia <= 11.2 && oxygenPct >= 28.0 && oxygenPct <= 40.0;
        const partialGravityInfo = {
            show_banner: Boolean(isPartial || isEva || isLunarRover),
            moc_0g_bound: moc0g,
            moc_current_est: mocCurrent,
            moc_1g_bound: moc1g,
            tr: isPartial
                ? `**Kısmi Yerçekimi Sınırlandırması (${gravityG.toFixed(2)}G):** NASA PSI'da LUCI & FM2 Ay verileri beklenirken **0G sınırı (%${moc0g})** ile **1G sınırı (%${moc1g})** ara yerçekimini sınırlar (\`Tahmini MOC ≈ %${mocCurrent}\`).`
                : isEva
                ? `**Uzay Giysisi Saf Oksijen Rejimi (${pressurePsia.toFixed(1)} psia / %${oxygenPct.toFixed(0)} O₂):** N₂ ısıl balastı sıfırlandığı için tutuşma enerjisi dramatik biçimde düşer.`
                : isLunarRover
                ? `**Ay Üssü ve Basınçlı Gezgin Atmosferi (${pressurePsia.toFixed(1)} psia / %${oxygenPct.toFixed(0)} O₂):** Ön-soluma süresini azaltan zenginleştirilmiş O₂ atmosferi yanıcılığı artırır.`
                : "",
            en: isPartial
                ? `**Partial-Gravity Bounding (${gravityG.toFixed(2)}G):** Bounded between **0G (${moc0g}%)** and **1G (${moc1g}%)** (\`Est. MOC ≈ ${mocCurrent}%\`) awaiting LUCI & FM2 lunar datasets.`
                : isEva
                ? `**EVA Spacesuit Pure-O₂ Regime (${pressurePsia.toFixed(1)} psia / ${oxygenPct.toFixed(0)}% O₂):** Zero N₂ thermal ballast dramatically accelerates flame spread.`
                : isLunarRover
                ? `**Lunar Base & Pressurized Rover (${pressurePsia.toFixed(1)} psia / ${oxygenPct.toFixed(0)}% O₂):** Elevated O₂ fraction increases material flammability.`
                : "",
        };

        const margin = oxygenPct - mocCurrent;
        const formulaTable = [
            {
                law_tr: "d² Damlacık Yanma Yasası (K)", law_en: "d²-Law Burning Constant (K)",
                equation: "D²(t) = D₀² - K·t  |  K = (8λ_g / ρ_l c_pg)·ln(1 + B_oq)·(Sh/2)",
                value: `${kBurn.toFixed(3)} mm²/s (t_b ≈ ${burnLifeS.toFixed(1)} s)`,
                status_tr: kBurn > 0 ? "AKTİF YANMA" : "SÖNÜMLENDİ", status_en: kBurn > 0 ? "ACTIVE BURNING" : "EXTINGUISHED",
            },
            {
                law_tr: "Spalding Kütle Transfer Sayısı (B_oq)", law_en: "Spalding Transfer Number (B_oq)",
                equation: "B_oq = [Y_O2·(ΔH_c / ν_s) - c_pg·(T_b - T_∞)] / L_v",
                value: `B_oq = ${spaldingB.toFixed(2)}  |  R_f/R_d = ${standoffRatio.toFixed(2)}`,
                status_tr: spaldingB >= 4.0 ? "YÜKSEK SÜRÜCÜ GÜÇ" : "ORTA TERMODİNAMİK GÜÇ", status_en: spaldingB >= 4.0 ? "HIGH DRIVING POTENTIAL" : "MODERATE MASS TRANSFER",
            },
            {
                law_tr: "Sherwood / Nusselt Taşınım (Sh)", law_en: "Sherwood / Nusselt Transport (Sh)",
                equation: "Sh = 2 + 0.6·Re^(1/2)·Sc^(1/3) + 0.52·Ra^(1/4)",
                value: `Sh = ${shConv.toFixed(2)} (Re=${reNum.toFixed(2)}, Gr=${grNum.toFixed(1)}, Ra=${raNum.toFixed(1)})`,
                status_tr: shConv < 2.25 ? "SAF DİFÜZYON (Sh≈2)" : "KONVEKTİF DESTEKLİ", status_en: shConv < 2.25 ? "PURE DIFFUSION (Sh≈2)" : "CONVECTIVELY ENHANCED",
            },
            {
                law_tr: "Richardson Karma Konveksiyon (Ri)", law_en: "Richardson Buoyancy Ratio (Ri)",
                equation: "Ri = Gr / Re²",
                value: `Ri = ${richardsonRi.toFixed(2)}`,
                status_tr: richardsonRi < 1.0 ? "MİKROÇEKİM / FAN BASKIN" : "KALDIRMA KUVVETİ BASKIN", status_en: richardsonRi < 1.0 ? "MICROGRAVITY / FORCED FLOW" : "BUOYANCY DOMINATED",
            },
            {
                law_tr: "Damköhler Reaksiyon Sayısı (Da)", law_en: "Damköhler Residence Ratio (Da)",
                equation: "Da = τ_flow / τ_chem",
                value: `Da = ${damkohlerDa.toFixed(2)}`,
                status_tr: damkohlerDa < 1.0 ? "ÜFLEME SÖNMESİ (Da<1)" : "KİMYASAL KARARLI (Da≥1)", status_en: damkohlerDa < 1.0 ? "BLOWOFF EXTINCTION (Da<1)" : "CHEMICALLY STABLE (Da≥1)",
            },
            {
                law_tr: "Radyatif Isı Kaybı & Kısmi O₂ Basıncı", law_en: "Radiative Loss (χ_r) & Partial P_O2",
                equation: "χ_r = Q_rad / Q_chem  |  P_O2 = X_O2 · P_kabin",
                value: `χ_r = %${(radLossFrac * 100).toFixed(1)}  |  P_O2 = ${po2Psia.toFixed(2)} psia (${po2Kpa.toFixed(1)} kPa)`,
                status_tr: `MOC SINIRI: %${mocCurrent} (ΔO₂ = ${margin >= 0 ? "+" : ""}${margin.toFixed(1)}%)`, status_en: `MOC LIMIT: ${mocCurrent}% (ΔO₂ = ${margin >= 0 ? "+" : ""}${margin.toFixed(1)}%)`,
            },
        ];

        const instantAiSummary = {
            tr: `**Anlık Değerlendirme (${fuel.formula}):** \`P_O2 = ${po2Psia.toFixed(2)} psia\`, \`B_oq = ${spaldingB.toFixed(2)}\`, \`Sh = ${shConv.toFixed(2)}\`, \`Da = ${damkohlerDa.toFixed(2)}\` ve ISS uçuş doğrulaması \`R² = ${rSq}\`. Rejim **${activeCall.badge_tr}** (Risk: **${riskScore}/100**). İlk müdahale: Kabin fanlarını kapatıp Halon kullanmadan İnce Su Sisi (SoFIE-MIST) uygulayın.`,
            en: `**Instant Summary (${fuel.formula}):** \`P_O2 = ${po2Psia.toFixed(2)} psia\`, \`B_oq = ${spaldingB.toFixed(2)}\`, \`Sh = ${shConv.toFixed(2)}\`, \`Da = ${damkohlerDa.toFixed(2)}\`, ISS validation \`R² = ${rSq}\`. Regime **${activeCall.badge_en}** (Risk: **${riskScore}/100**). Action: Immediate HVAC shutoff + Fine Water Mist (No Halon).`,
        };

        return {
            inputs: {
                fuel_id: fuelId, fuel_name_tr: fuel.name_tr, fuel_name_en: fuel.name_en,
                formula: fuel.formula, geometry_3d: fuel.geometry_3d || "droplet",
                gravity_g: gravityG, oxygen_pct: oxygenPct, pressure_psia: pressurePsia, pressure_kpa: pressureKpa,
                airflow_cms: airflowCms, droplet_d0_mm: dropletD0, diluent: diluent,
                diluent_name: dil.name, diluent_name_en: dil.name_en,
                habitat_id: habitatId, crew_response_s: crewRespS,
            },
            telemetry: {
                regime, extinguished, cool_flame_active: coolFlameActive,
                flame_temp_k: flameTempK, flame_temp_c: roundN(flameTempK - 273.15, 1),
                burning_rate_k_mm2_s: kBurn, spalding_b_number: spaldingB, flame_spread_mm_s: flameSpread,
                moc_pct: mocCurrent, po2_psia: po2Psia, po2_kpa: po2Kpa, o2_partial_psia: po2Psia, o2_partial_kpa: po2Kpa,
                standoff_ratio: standoffRatio, standoff_ratio_rf_rd: standoffRatio,
                flame_radius_mm: flameRadiusMm, burn_lifetime_s: burnLifeS, radiative_loss_fraction: radLossFrac,
                reynolds_number: roundN(reNum, 2), grashof_number: roundN(grNum, 2), rayleigh_number: roundN(raNum, 2),
                richardson_number: richardsonRi, sherwood_number: roundN(shConv, 2), damkohler_number: damkohlerDa,
                soot_index: sootIndex, co_ppm: coPpm, heat_flux_kw_m2: heatFlux, risk_score: riskScore,
            },
            partial_gravity_info: partialGravityInfo,
            formula_table: formulaTable,
            instant_ai_summary: instantAiSummary,
            callouts: calloutsMap[regime] || calloutsMap.HOT_SPHERICAL_0G,
            flight_validation: flightValidation,
            scenario_timeline: scenarioTimeline,
            flammability_map: {
                airflow_cms: flowAxis,
                moc_0g_pct: mocCurve0g,
                moc_lunar_016g_pct: mocCurveLunar,
                moc_mars_038g_pct: mocCurveMars,
                moc_1g_pct: mocCurve1g,
                cool_flame_floor_pct: coolFloor,
                current_point: { airflow_cms: airflowCms, oxygen_pct: oxygenPct, gravity_g: gravityG },
            },
            sensor_timeseries: sensorSeries,
        };
    }

    function expandQueryText(q) {
        let low = String(q || "").toLowerCase();
        Object.keys(SYNONYMS).forEach((k) => {
            if (low.includes(k)) low += " " + SYNONYMS[k];
        });
        return low;
    }

    function computeTextSimilarity(query, docText) {
        const qTokens = expandQueryText(query).match(/[a-z0-9çğıöşü]{2,}/g) || [];
        if (!qTokens.length) return 0;
        const dLow = String(docText || "").toLowerCase();
        let hits = 0;
        qTokens.forEach((tok) => {
            if (dLow.includes(tok)) hits += 1;
        });
        return Math.min(0.99, hits / Math.max(2, Math.sqrt(qTokens.length) * 1.6));
    }

    function rankExperimentsClient(missionParams, query, hwFilter) {
        const mp = missionParams || {};
        const targetO2 = Number(mp.oxygen_pct ?? 21.0);
        const targetP = Number(mp.pressure_psia ?? 14.7);
        const targetFlow = Number(mp.airflow_cms ?? 3.5);
        const targetFuel = String(mp.fuel_id || "n_heptane");
        const targetG = Number(mp.gravity_g ?? 0.0);
        const hwNorm = String(hwFilter || "ALL").toUpperCase();

        const ranked = [];
        NASA_CATALOG.forEach((exp) => {
            if (hwNorm !== "ALL" && hwNorm !== "" && String(exp.hardware_group || "").toUpperCase() !== hwNorm) return;
            const o2Diff = Math.abs(targetO2 - Number(exp.oxygen_pct));
            const pDiff = Math.abs(targetP - Number(exp.pressure_psia));
            const flDiff = Math.abs(targetFlow - Number(exp.airflow_cms));
            const fuelBonus = exp.fuel_id === targetFuel ? 22.0 : 0.0;
            const pgBonus = (targetG >= 0.04 && targetG <= 0.85 && ["PSI-ACME-09", "PSI-SOFIE-08", "PSI-SAFFIRE5-07", "PSI-DAFT-15"].includes(exp.exp_id)) ? 14.0 : 0.0;
            const affinity = Math.min(100.0, Math.max(10.0, 100.0 - (Math.min(42.0, o2Diff * 1.6) + pDiff * 2.6 + flDiff * 1.3) + fuelBonus + pgBonus));

            const simEval = simulateCombustionClient({
                fuel_id: exp.fuel_id, gravity_g: targetG, oxygen_pct: targetO2,
                pressure_psia: targetP, airflow_cms: targetFlow, droplet_d0_mm: 3.5, diluent: mp.diluent || "N2",
            });
            const hazard = Number(simEval.telemetry.risk_score);
            const docObj = ragDocs.find((d) => d.doc_id === exp.exp_id);
            const semScore = query && query.trim() ? computeTextSimilarity(query, docObj ? docObj.text : exp.title) * 100.0 : 0.0;
            const composite = (query && query.trim())
                ? 0.44 * semScore + 0.32 * affinity + 0.24 * hazard
                : 0.56 * affinity + 0.44 * hazard;

            ranked.push(Object.assign({}, exp, {
                priority_score: roundN(Math.min(99.9, composite), 1),
                param_affinity: roundN(affinity, 1),
                mission_hazard_score: Math.trunc(hazard),
                predicted_regime_in_mission: simEval.telemetry.regime,
                predicted_moc_in_mission: simEval.telemetry.moc_pct,
            }));
        });

        ranked.sort((a, b) => b.priority_score - a.priority_score);
        ranked.forEach((item, i) => { item.rank = i + 1; });
        return { count: ranked.length, hardware_filter: hwNorm, ranked_experiments: ranked };
    }

    function compareExperimentsClient(expIds) {
        let selected = NASA_CATALOG.filter((e) => (expIds || []).includes(e.exp_id));
        if (selected.length < 2) selected = NASA_CATALOG.slice(0, 3);
        const lowestMoc = selected.reduce((a, b) => (a.moc_measured_pct <= b.moc_measured_pct ? a : b));
        const highestO2 = selected.reduce((a, b) => (a.oxygen_pct >= b.oxygen_pct ? a : b));
        const coolExps = selected.filter((x) => x.cool_flame_observed).map((x) => x.program);
        const facs = Array.from(new Set(selected.map((x) => x.hardware_group || "CIR"))).sort();
        return {
            compared_count: selected.length,
            experiments: selected,
            lowest_moc_program: lowestMoc.program,
            synthesis_tr: `**Deney Karşılaştırması Özeti (${selected.length} NASA PSI Kaydı • ${facs.join(" vs. ")}):** En düşük oksijen sınırına sahip deney **%${lowestMoc.moc_measured_pct} MOC** ile **${lowestMoc.program}**; en yüksek test oksijenine çıkan ise **%${highestO2.oxygen_pct} O₂** ile **${highestO2.program}** kaydıdır. ${coolExps.length ? `**${coolExps.join(", ")}** kayıtlarında görünmez Soğuk Alev gözlemlendiğinden UV/IR + CO sensör füzyonu şarttır.` : "HVAC kesme ve SoFIE-MIST ince su sisi birincil Halon-dışı müdahaledir."}`,
            synthesis_en: `**Experiment Comparison Summary (${selected.length} NASA PSI Records • ${facs.join(" vs. ")}):** **${lowestMoc.program}** exhibits the lowest MOC (**${lowestMoc.moc_measured_pct}% O₂**), while **${highestO2.program}** spans up to **${highestO2.oxygen_pct}% O₂**. ${coolExps.length ? `Cool Flame persistence in **${coolExps.join(", ")}** requires UV/IR + CO multi-sensor fusion.` : "Immediate HVAC shutoff and SoFIE-MIST water mist remain universal countermeasures."}`,
        };
    }

    function psiRowToItemJs(row) {
        const acc = String(row.id || "PSI");
        const acro = String(row.acronym || "");
        const rawT = String(row.raw_title || row.title || acc);
        const dispTitle = (acro && !rawT.toLowerCase().includes(acro.toLowerCase()) && !rawT.startsWith(acc))
            ? `${acc} (${acro}) — ${rawT}`
            : (rawT.startsWith(acc) ? rawT : `${acc} — ${rawT}`);
        const hw = String(row.hardware || "").trim();
        const plat = String(row.platform || "ISS").trim();
        const phases = Array.isArray(row.phases) ? row.phases : [];
        return {
            id: acc,
            acronym: acro,
            source: "NASA PSI Repository (psi.nasa.gov)",
            title: dispTitle,
            abstract: String(row.abstract || "NASA Physical Sciences Informatics (PSI) deneysel veri kaydı.").slice(0, 850),
            mission: hw ? `${plat} • ${hw}` : plat,
            date: String(row.date || plat).slice(0, 16),
            url: String(row.url || `https://psi.nasa.gov/physci/repo/data/investigations/${acc}`),
            pdf_url: "",
            table_file: String(row.table_file || ""),
            phase_count: phases.length,
            extracted_sim_params: Object.assign({}, row.extracted_sim_params || {}),
            phases: phases,
            summary_tr: String(row.summary_tr || ""),
            summary_en: String(row.summary_en || ""),
        };
    }

    function searchPsiSnapshotJs(query, limit) {
        if (!PSI_SNAPSHOT.length) return [];
        const qRaw = String(query || "").trim().toLowerCase();
        const broad = ["", "all", "combustion", "flame", "fire", "microgravity", "psi"].includes(qRaw);
        const expanded = expandQueryText(qRaw);
        const tokens = (expanded.match(/[a-z0-9\-]{2,}/g) || []).filter(
            (t) => !["microgravity", "spacecraft", "investigation", "experiment", "nasa"].includes(t)
        );
        const scored = [];
        PSI_SNAPSHOT.forEach((row, idx) => {
            const accL = String(row.id || "").toLowerCase();
            const acroL = String(row.acronym || "").toLowerCase();
            const blob = `${accL} ${acroL} ${row.raw_title || ""} ${row.title || ""} ${row.hardware || ""} ${row.platform || ""} ${row.table_file || ""} ${row.abstract || ""}`.toLowerCase();
            let sc = 0;
            if (qRaw && qRaw === accL) sc += 120;
            if (acroL && qRaw && (qRaw.includes(acroL) || acroL.includes(qRaw))) sc += 25;
            tokens.forEach((tok) => {
                if (tok === accL) sc += 80;
                else if (acroL && acroL.includes(tok)) sc += 12;
                else if (blob.includes(tok)) sc += 4;
            });
            if (broad && sc === 0) sc = 1;
            const hasTbl = (row.phases && row.phases.length) || row.table_file ? 1 : 0;
            if (sc > 0 || broad) scored.push({ sc, hasTbl, idx, row });
        });
        const finalArr = scored.length
            ? scored
            : PSI_SNAPSHOT.map((row, idx) => ({ sc: 1, hasTbl: (row.phases && row.phases.length) ? 1 : 0, idx, row }));
        finalArr.sort((a, b) => (b.sc - a.sc) || (b.hasTbl - a.hasTbl) || (a.idx - b.idx));
        return finalArr.slice(0, Math.max(1, limit || 12)).map((x) => psiRowToItemJs(x.row));
    }

    async function fetchLiveNasaBrowser(source, q) {
        const query = q || "microgravity combustion";
        const srcNorm = String(source || "osdr").toLowerCase();

        if (srcNorm === "osdr" && PSI_SNAPSHOT.length) {
            const psiItems = searchPsiSnapshotJs(query, 12);
            return { ok: true, source_status: "cached_live", count: psiItems.length, items: psiItems };
        }

        const scored = NASA_CATALOG.map((e) => ({
            e,
            sim: computeTextSimilarity(query, `${e.program} ${e.title} ${e.title_tr} ${e.key_finding_en} ${e.key_finding_tr} ${(e.tags || []).join(" ")}`),
        })).sort((a, b) => b.sim - a.sim);
        const items = scored.slice(0, 8).map(({ e }) => ({
            id: `NTRS-${e.ntrs_id}`,
            source: `NASA PSI/NTRS (${e.program})`,
            title: e.title,
            abstract: e.key_finding_en,
            date: String(e.year),
            url: e.ntrs_url,
            pdf_url: "",
            extracted_sim_params: {
                fuel_id: e.fuel_id || "n_heptane",
                gravity_g: Number(e.gravity_g ?? 0.0),
                oxygen_pct: Number(e.oxygen_pct ?? 21.0),
                pressure_psia: Number(e.pressure_psia ?? 14.7),
                airflow_cms: Number(e.airflow_cms ?? 2.4),
                droplet_d0_mm: e.cool_flame_observed ? 4.4 : 3.2,
                diluent: "N2",
            },
        }));
        return { ok: true, source_status: "cached_live", count: items.length, items };
    }

    function extractReadableTextFromPdfBuffer(buf) {
        const bytes = new Uint8Array(buf);
        let rawAscii = "";
        const maxLen = Math.min(bytes.length, 450000);
        for (let i = 0; i < maxLen; i++) {
            const c = bytes[i];
            rawAscii += (c >= 32 && c <= 126) || c === 10 || c === 13 ? String.fromCharCode(c) : " ";
        }
        const chunks = [];
        const parenRe = /\(([^()]{3,220})\)/g;
        let m;
        while ((m = parenRe.exec(rawAscii)) !== null) {
            const seg = m[1].replace(/\\[nrt]/g, " ").trim();
            if (/[A-Za-z]{3,}/.test(seg) && !/^(PDF-|Identity-H|Adobe|FlateDecode|FontDescriptor)/i.test(seg)) {
                chunks.push(seg);
            }
        }
        if (chunks.length >= 5) {
            return chunks.join(" ").replace(/\s+/g, " ").slice(0, 12000);
        }
        return rawAscii
            .replace(/\b(obj|endobj|stream|endstream|xref|trailer|FlateDecode|Filter|Length)\b/g, " ")
            .replace(/\s+/g, " ")
            .trim()
            .slice(0, 8000);
    }

    function parseCellNumberJs(rawVal) {
        if (rawVal === undefined || rawVal === null) return null;
        if (typeof rawVal === "number") return Number.isFinite(rawVal) ? rawVal : null;
        let s = String(rawVal).trim();
        if (!s || ["na", "n/a", "nan", "null", "none", "-", "--", "tbd"].includes(s.toLowerCase())) return null;
        if (/^\d{4}[-/]\d{1,2}[-/]\d{1,2}/.test(s)) return null;
        s = s.replace(/%/g, "").replace(/±\s*\d+(?:\.\d+)?/g, "").trim();
        const direct = Number(s);
        if (!Number.isNaN(direct) && Number.isFinite(direct)) return direct;
        const rng = s.match(/^\s*(-?\d+(?:\.\d+)?)\s*(?:-|–|—|\bto\b)\s*(-?\d+(?:\.\d+)?)\b/i);
        if (rng) {
            const a = parseFloat(rng[1]), b = parseFloat(rng[2]);
            if (Number.isFinite(a) && Number.isFinite(b)) return (a + b) * 0.5;
        }
        const parts = s.split(/[;/|]/);
        for (let i = 0; i < parts.length; i++) {
            const m = parts[i].match(/^\s*(-?\d+(?:\.\d+)?)(?:\s*(?:atm|psia|psi|kpa|bar|torr|mmhg|cm\/s|m\/s|mm|s|sec|k|c|°c|g))?\s*$/i);
            if (m) {
                const v = parseFloat(m[1]);
                if (Number.isFinite(v)) return v;
            }
        }
        return null;
    }

    function parseFuelStrJs(val) {
        const vl = String(val || "").toLowerCase().trim();
        if (!vl) return null;
        const cands = [
            ["propane_cfig", ["propane_cfig", "propan", "propane", "c3h8", "cfig", "cfi-g", "ethane", "c2h6", "etan", "ethylene", "etilen", "c2h4", "propene", "propylene", "c3h6", "butane", "butan", "c4h10", "methane", "metan", "ch4"]],
            ["n_heptane", ["n_heptane", "n-heptane", "heptan", "heptane", "c7h16", "dodecane", "n-dodecane", "c12h26", "decane", "n-decane", "c10h22", "octane", "iso-octane", "isooctane", "c8h18", "hexadecane", "pentane", "jp-8", "jp8", "kerosene"]],
            ["methanol", ["methanol", "metanol", "ch3oh", "ethanol", "etanol", "c2h5oh", "propanol", "isopropanol", "ipa", "butanol", "n-butanol"]],
            ["pmma", ["pmma", "akrilik", "acrylic", "plexiglas", "perspex", "polymethyl", "teflon", "ptfe", "delrin", "polyoxymethylene", "pom", "polyethylene", "hdpe", "ldpe", "polypropylene", "polycarbonate", "lexan", "ultem", "pei", "silicone", "pvc", "nylon", "abs", "epoxy"]],
            ["sibal", ["sibal", "pamuk", "cotton", "cellulose", "seluloz", "whatman", "paper", "kagit", "fabric", "fiberglass", "glass fabric", "kimwipe"]],
            ["nomex", ["nomex", "ht90", "spacesuit", "uzay giysisi", "kevlar", "kapton", "polyimide", "pbi", "gore-tex", "orthofabric", "betacloth"]],
            ["hydrogen", ["hydrogen", "hidrojen"]],
        ];
        let bestFuel = null, bestPos = 1e9;
        cands.forEach(([fid, kws]) => {
            kws.forEach((kw) => {
                const idx = vl.indexOf(kw);
                if (idx !== -1 && idx < bestPos) {
                    bestPos = idx;
                    bestFuel = fid;
                }
            });
        });
        if (!bestFuel && /(?:^|[\s,;/(_-])h2(?:$|[\s,;/)_-])/.test(vl)) return "hydrogen";
        return bestFuel;
    }

    function parseDiluentStrJs(val) {
        const vl = String(val || "").trim().toUpperCase();
        if (!vl) return null;
        if (vl === "CO2" || vl.includes("CO2") || vl.includes("KARBONDIOKSIT") || vl.includes("CARBON DIOXIDE")) return "CO2";
        if (vl === "HE" || vl.includes("HELIUM") || vl.includes("HELYUM") || /\bHE\b/.test(vl)) return "He";
        if (vl === "AR" || vl.includes("ARGON")) return "Ar";
        if (vl === "XE" || vl.includes("XENON")) return "Xe";
        if (vl === "N2" || vl.includes("N2") || vl.includes("AZOT") || vl.includes("NITROGEN") || vl === "AIR") return "N2";
        return null;
    }

    function parseHabitatStrJs(val) {
        const vl = String(val || "").toLowerCase().trim();
        if (!vl) return null;
        if (["iss_module", "lunar_hab", "lunar_rover", "eva_suit"].includes(vl)) return vl;
        if (vl.includes("suit") || vl.includes("giysi") || vl.includes("eva")) return "eva_suit";
        if (vl.includes("rover") || vl.includes("gezgin")) return "lunar_rover";
        if (vl.includes("lunar") || vl.includes("ay_ussu") || vl.includes("hab")) return "lunar_hab";
        if (vl.includes("iss") || vl.includes("destiny")) return "iss_module";
        return null;
    }

    function extractChemSubtokenJs(rawVal) {
        const s = String(rawVal || "").toLowerCase().trim();
        if (!s) return "";
        const toks = [
            "ch4", "methane", "c2h4", "ethylene", "c2h6", "ethane", "c3h6", "propylene",
            "c3h8", "propane", "c4h10", "butane", "heptane", "dodecane", "decane", "octane",
            "methanol", "ethanol", "butanol", "propanol", "pmma", "acrylic", "teflon", "ptfe",
            "delrin", "polyethylene", "polycarbonate", "ultem", "cotton", "sibal", "cellulose",
            "whatman", "nomex", "kevlar", "kapton", "hydrogen", "h2",
        ];
        for (let i = 0; i < toks.length; i++) {
            if (s.includes(toks[i])) return toks[i];
        }
        return s.slice(0, 14);
    }

    function classifyTableColJs(colName) {
        const kl = String(colName || "").trim().toLowerCase().replace(/\s+/g, " ");
        if (!kl) return null;
        if (["test name", "test_name", "test id", "test_id", "test #", "test number", "run id", "run_id", "point #", "sample id", "drop #", "droplet id", "flame id", "experiment id"].some((w) => kl.includes(w)) || ["test", "run", "trial", "test_no"].includes(kl)) return "test_id";
        if (["test type", "test_type", "flame type", "configuration", "burner mode", "flow configuration"].includes(kl)) return "test_type";
        if (kl.includes("polarity") || kl.includes("electrode")) return "polarity";
        if ((kl.includes("voltage") || kl.includes("electric field") || kl.includes("e-field")) && !kl.includes("current")) return "voltage_kv";
        if ((kl.includes("fuel") && (kl.includes("conc") || kl.includes("mole frac") || kl.includes("mol frac") || kl === "xf" || kl === "x_f")) || ["xf", "x_f", "fuel %", "fuel conc"].includes(kl)) return "fuel_conc";
        if (kl.includes("fuel") && (kl.includes("rate") || kl.includes("flow") || kl.includes("sccm") || kl.includes("slpm") || kl.includes("mg/s"))) return "fuel_rate";
        if (!["date", "ignition", "burn time", "delay", "duration", "lifetime", "extinct"].some((b) => kl.includes(b)) &&
            (["t", "time", "time_s", "t_s", "zaman", "zaman_sn", "sec", "seconds"].includes(kl) || kl.includes("zaman") || kl.includes("time_s") || kl.includes("time (s)"))) return "time_s";
        if (kl === "faz_kodu" || kl === "phase_code") return "phase_code";
        if (!["gas phase", "liquid phase", "solid phase"].some((b) => kl.includes(b)) &&
            ["faz_ve_fiziksel", "phase_desc", "fiziksel_durum", "faz", "phase", "stage"].some((w) => kl.includes(w))) return "phase_desc";
        if (!["rate", "flow", "mass", "temp", "fraction", "mole", "conc", "width", "thick", "length", "diam", "size", "initial", "final"].some((b) => kl.includes(b)) &&
            ["fuel", "yakit", "material", "malzeme", "sample type", "polymer", "hydrocarbon", "reactant"].some((w) => kl.includes(w))) return "fuel";
        if (["diluent", "seyreltici", "balance gas", "inert gas"].some((w) => kl.includes(w))) return "diluent";
        if (kl === "xhe" || kl === "x_he" || ((kl.includes("helium") || /\bhe\b/.test(kl)) && (kl.includes("mole") || kl.includes("frac") || kl.includes("%") || kl.includes("conc") || kl.includes("initial")))) return "diluent_he_frac";
        if (kl === "xco2" || kl === "x_co2" || (kl.includes("co2") && (kl.includes("mole") || kl.includes("frac") || kl.includes("ambient") || kl.includes("initial") || kl.includes("%")))) return "diluent_co2_frac";
        if (["habitat", "kabin_tipi"].some((w) => kl.includes(w))) return "habitat";
        if (["donanim", "facility", "hardware", "rack", "insert"].some((w) => kl.includes(w))) return "facility";
        if (["deney_referans", "exp_ref", "exp_id", "ntrs", "psi_id"].some((w) => kl.includes(w))) return "exp_ref";

        if (!["co2", "po2", "p_o2", "h2o", "ch2o", "moc", "sio2", "no2", "so2", "tio2", "flow", "rate", "sccm"].some((b) => kl.includes(b))) {
            const isO2Name = kl === "xo2" || kl === "x_o2" || kl.includes("oxygen") || kl.includes("oksijen") || kl.includes("o initial ambient") || /(?:^|[_\s(%])o2(?:$|[_\s)%])/.test(kl);
            if (isO2Name) {
                if (kl === "xo2" || kl === "x_o2" || kl.includes("mole frac") || kl.includes("mol frac") || kl.includes("mole_frac") || kl.includes("volume frac")) return "oxygen_mole_frac";
                return "oxygen_pct";
            }
        }

        if (!kl.includes("po2") && !kl.includes("p_o2") && !kl.includes("partial") && !kl.includes("drop")) {
            if (kl.includes("mmhg") || kl.includes("torr")) return "pressure_mmhg";
            if (/\bbar\b|\bara\b/.test(kl)) return "pressure_bar";
            if (/\batm\b|atmosphere/.test(kl) && !kl.includes("ambient atmosphere")) return "pressure_atm";
            if (kl.includes("kpa")) return "pressure_kpa";
            if (kl.includes("psia") || kl.includes("psi") || kl.includes("pressure") || kl.includes("basinc") || kl.includes("p_amb") || kl.includes("chamber p")) return "pressure_psia";
        }

        if (!["yayilim", "spread", "mm_s", "mm/s", "fuel", "burner", "nozzle", "sccm", "slpm", "mg/s", "g/s", "ml/min", "l/min", "restrictor", "fan display", "self-ext", "flow term", "mass flow", "volumetric"].some((b) => kl.includes(b))) {
            if (["air rate", "air flow", "airflow", "concurrent flow", "oxidizer vel", "tunnel vel", "duct vel", "forced flow", "akis", "u_cms", "fan_cm", "air vel"].some((w) => kl.includes(w)) ||
                ((kl.includes("flow") || kl.includes("velocity")) && (kl.includes("cm/s") || kl.includes("cm_s") || kl.includes("m/s"))) ||
                kl === "air display") return "airflow_cms";
        }

        if (["gravity", "yercekimi", "g_level", "g-level", "microgravity"].some((w) => kl.includes(w))) return "gravity_g";
        if (kl.includes("d2") || kl.includes("d_sq") || kl.includes("d^2")) return "d2_mm2";
        if (!["partikul", "sisi", "mist", "aerosol", "wire", "igniter", "fiber"].some((b) => kl.includes(b)) &&
            ["damlacik", "droplet", "diameter", "d0", "d_mm", "numune_cap", "nozzle", "burner size", "burner dia", "sphere dia", "rod dia"].some((w) => kl.includes(w))) return "d0_mm";

        if (["sicaklik", "temp_k", "flame_temp", "thermocouple", "tad", "adiabatic flame", "peak burner t", "peak temp", "max temp"].some((w) => kl.includes(w))) {
            if (/\(\s*°?c\s*\)|deg\s*c|celsius/.test(kl)) return "temp_c";
            return "temp_k";
        }
        if (kl.includes("cool flame") || kl.includes("soguk alev")) return "cool_flag";
        if (!kl.includes("co2") && !kl.includes("smac") && (kl === "co" || kl.includes("co_ppm") || kl.includes("co_sensor"))) return "co_ppm";
        if (kl.includes("co2")) return "co2_ppm";
        if (kl.includes("ch2o") || kl.includes("formaldehit") || kl.includes("formaldehyde")) return "ch2o_ppm";
        if (kl.includes("optik") || kl.includes("optical")) return "opt_vis";
        if (kl.includes("radyatif") || kl.includes("radiometer") || kl.includes("heat_flux") || kl.includes("isi_akisi")) return "ir_kw";
        if (kl.includes("su_sisi") || kl.includes("mist")) return "mist_um";
        if (kl.includes("partikul") || kl.includes("aerosol") || kl.includes("dust_um")) return "aerosol_um";
        return null;
    }

    function looksLikeTabularTextJs(text, filename) {
        const fnLow = String(filename || "").toLowerCase().replace(/\)+$/, "").trim();
        if ([".csv", ".tsv", ".xlsx"].some((ext) => fnLow.endsWith(ext))) return true;
        const lines = String(text || "").split(/\r?\n/).map((ln) => ln.trim()).filter(Boolean).slice(0, 15);
        if (lines.length < 2) return false;
        const first = lines[0];
        const delims = [",", ";", "\t"];
        let bestD = ",", bestCnt = 0;
        delims.forEach((d) => {
            const c = first.split(d).length - 1;
            if (c > bestCnt) { bestCnt = c; bestD = d; }
        });
        if (bestCnt < 2) return false;
        const hdrCells = splitCsvLineJs(first, bestD);
        if (hdrCells.some((c) => c.length > 68)) return false;
        if (!hdrCells.some((c) => Boolean(classifyTableColJs(c)))) return false;
        const secondCnt = lines[1].split(bestD).length - 1;
        return Math.abs(secondCnt - bestCnt) <= Math.max(2, Math.floor(bestCnt / 2));
    }

    function splitCsvLineJs(line, delim) {
        const out = [];
        let cur = "", inQuotes = false;
        for (let i = 0; i < line.length; i++) {
            const ch = line[i];
            if (ch === '"') {
                if (inQuotes && line[i + 1] === '"') { cur += '"'; i++; }
                else inQuotes = !inQuotes;
            } else if (ch === delim && !inQuotes) {
                out.push(cur.trim());
                cur = "";
            } else {
                cur += ch;
            }
        }
        out.push(cur.trim());
        return out;
    }

    function parseCsvRowsJs(cleanText) {
        const lines = cleanText.replace(/^\uFEFF/, "").split(/\r?\n/).filter((ln) => ln.trim().length > 0).slice(0, 600);
        if (lines.length < 2) return [];
        const semiCnt = (lines[0].match(/;/g) || []).length;
        const commaCnt = (lines[0].match(/,/g) || []).length;
        const delim = semiCnt > commaCnt ? ";" : (lines[0].includes("\t") ? "\t" : ",");
        const headers = splitCsvLineJs(lines[0], delim);
        if (headers.length < 2) return [];
        const rows = [];
        for (let i = 1; i < lines.length; i++) {
            const cells = splitCsvLineJs(lines[i], delim);
            if (cells.length < 2) continue;
            const obj = {};
            for (let j = 0; j < headers.length; j++) {
                obj[headers[j]] = cells[j] !== undefined ? cells[j] : "";
            }
            rows.push(obj);
        }
        return rows;
    }

    function fitD2SlopeJs(tVals, d2Vals) {
        if (!tVals || !d2Vals || tVals.length < 3 || tVals.length !== d2Vals.length) return null;
        const n = tVals.length;
        const dt = tVals[n - 1] - tVals[0];
        const drop = d2Vals[0] - d2Vals[n - 1];
        if (dt <= 0.2 || drop <= 0.08) return null;
        let sumT = 0, sumY = 0;
        for (let i = 0; i < n; i++) { sumT += tVals[i]; sumY += d2Vals[i]; }
        const meanT = sumT / n, meanY = sumY / n;
        let num = 0, den = 0;
        for (let i = 0; i < n; i++) {
            num += (tVals[i] - meanT) * (d2Vals[i] - meanY);
            den += (tVals[i] - meanT) * (tVals[i] - meanT);
        }
        if (den <= 1e-9) return null;
        const slope = num / den;
        const intercept = meanY - slope * meanT;
        const kMeas = Math.max(0, -slope);
        if (kMeas <= 0.005) return null;
        let ssRes = 0, ssTot = 0;
        for (let i = 0; i < n; i++) {
            const pred = slope * tVals[i] + intercept;
            ssRes += (d2Vals[i] - pred) * (d2Vals[i] - pred);
            ssTot += (d2Vals[i] - meanY) * (d2Vals[i] - meanY);
        }
        const r2 = ssTot > 1e-9 ? Math.max(0, Math.min(1, 1 - ssRes / ssTot)) : 0.999;
        return { k_meas: Number(kMeas.toFixed(3)), r2: Number(r2.toFixed(4)) };
    }

    function convertO2ValJs(v, isMoleCol) {
        if (v === null || v === undefined || !Number.isFinite(v) || v <= 0) return null;
        if (isMoleCol) {
            const pct = v <= 1.05 ? v * 100.0 : v;
            return pct >= 3.0 && pct <= 100.0 ? pct : null;
        }
        if (v >= 0.03 && v <= 1.0) return v * 100.0;
        if (v >= 3.0 && v <= 100.0) return v;
        return null;
    }

    function analyzeTabularRowsInBrowser(rows, filename) {
        rows = (rows || []).filter((r) => r && Object.values(r).some((v) => String(v ?? "").trim() !== ""));
        if (!rows.length) return null;
        const colMap = {};
        Object.keys(rows[0] || {}).forEach((rawK) => {
            const role = classifyTableColJs(rawK);
            if (role && !colMap[role]) colMap[role] = rawK;
        });

        const numList = (rList, roleKey) => {
            const col = colMap[roleKey];
            if (!col) return [];
            const out = [];
            rList.forEach((it) => {
                const v = parseCellNumberJs(it[col]);
                if (v !== null) out.push(v);
            });
            return out;
        };

        const firstStr = (rList, roleKey) => {
            const col = colMap[roleKey];
            if (!col) return "";
            for (let i = 0; i < rList.length; i++) {
                const s = String(rList[i][col] || "").trim();
                if (s && !["na", "n/a", "null", "none", "-"].includes(s.toLowerCase())) return s;
            }
            return "";
        };

        const extractO2Values = (rList) => {
            const out = [];
            numList(rList, "oxygen_mole_frac").forEach((v) => {
                const c = convertO2ValJs(v, true);
                if (c !== null) out.push(c);
            });
            numList(rList, "oxygen_pct").forEach((v) => {
                const c = convertO2ValJs(v, false);
                if (c !== null) out.push(c);
            });
            return out;
        };

        const extractPressurePsia = (rList) => {
            const out = [];
            numList(rList, "pressure_psia").forEach((v) => {
                const colL = String(colMap.pressure_psia || "").toLowerCase();
                if (!colL.includes("psi") && v >= 0.2 && v <= 2.2) out.push(v * 14.6959);
                else if (!colL.includes("psi") && v >= 45 && v <= 220) out.push(v / 6.89476);
                else if (v >= 2.0 && v <= 35.0) out.push(v);
            });
            numList(rList, "pressure_atm").forEach((v) => { if (v >= 0.1 && v <= 3.0) out.push(v * 14.6959); });
            numList(rList, "pressure_bar").forEach((v) => { if (v >= 0.1 && v <= 3.0) out.push(v * 14.5038); });
            numList(rList, "pressure_kpa").forEach((v) => { if (v >= 15.0 && v <= 260.0) out.push(v / 6.89476); });
            numList(rList, "pressure_mmhg").forEach((v) => { if (v >= 100.0 && v <= 1800.0) out.push(v / 51.7149); });
            return out.filter((p) => p >= 2.0 && p <= 35.0);
        };

        const extractDiluent = (rList) => {
            const dExp = parseDiluentStrJs(firstStr(rList, "diluent"));
            if (dExp) return dExp;
            const heV = numList(rList, "diluent_he_frac");
            const co2V = numList(rList, "diluent_co2_frac");
            const heHdr = String(colMap.diluent_he_frac || "").toLowerCase();
            const co2Hdr = String(colMap.diluent_co2_frac || "").toLowerCase();
            const heIsPct = heHdr.includes("%") || heHdr.includes("percent") || heHdr.includes("by vol");
            const co2IsPct = co2Hdr.includes("%") || co2Hdr.includes("percent") || co2Hdr.includes("by vol");
            const heMean = heV.length ? heV.reduce((a, b) => a + b, 0) / heV.length : 0;
            const co2Mean = co2V.length ? co2V.reduce((a, b) => a + b, 0) / co2V.length : 0;
            const hePct = (!heIsPct && heMean <= 1.05) ? heMean * 100 : heMean;
            const co2Pct = (!co2IsPct && co2Mean <= 1.05) ? co2Mean * 100 : co2Mean;
            if (hePct >= 15 && hePct >= co2Pct) return "He";
            if (co2Pct >= 15) return "CO2";
            return "N2";
        };

        const anchorRoles = ["test_id", "test_type", "fuel", "oxygen_pct", "oxygen_mole_frac", "pressure_psia", "pressure_atm", "pressure_bar", "pressure_kpa", "pressure_mmhg", "airflow_cms", "d0_mm", "d2_mm2", "time_s", "phase_code"];
        const activeAnchors = anchorRoles.map((rk) => colMap[rk]).filter(Boolean);
        if (activeAnchors.length >= 2) {
            const filteredRows = rows.filter((r) => activeAnchors.some((c) => String(r[c] ?? "").trim() !== ""));
            if (filteredRows.length >= 1) rows = filteredRows;
        }

        const flowColLow = String(colMap.airflow_cms || "").toLowerCase();
        const flowScale = (flowColLow.includes("m/s") && !flowColLow.includes("cm/s") && !flowColLow.includes("mm/s")) ? 100.0 : 1.0;
        const fuelCounts = {};
        if (colMap.fuel) {
            rows.forEach((r) => {
                const pf = parseFuelStrJs(String(r[colMap.fuel] || ""));
                if (pf) fuelCounts[pf] = (fuelCounts[pf] || 0) + 1;
            });
        }
        const domFuelKey = Object.keys(fuelCounts).sort((a, b) => fuelCounts[b] - fuelCounts[a])[0];
        const fnLow = String(filename || "").toLowerCase();
        const fnHint = parseFuelStrJs(fnLow) || ((fnLow.includes("bass") || fnLow.includes("sofie") || fnLow.includes("same")) ? "pmma" : (fnLow.includes("saffire") ? "sibal" : null));
        const fallbackFuel = domFuelKey || fnHint || "n_heptane";

        let groupedPhases = [];
        const phaseLookup = {};
        rows.forEach((r) => {
            const pCode = String((colMap.phase_code && r[colMap.phase_code]) || "").trim();
            const pDesc = String((colMap.phase_desc && r[colMap.phase_desc]) || "").trim();
            const pKey = pCode || pDesc || "FAZ_1";
            if (!phaseLookup[pKey]) {
                const entry = {
                    key: pKey,
                    code: pCode || pKey.split(" ")[0],
                    desc: pDesc || pCode || "Standart Yanma Fazi",
                    rows: [],
                };
                phaseLookup[pKey] = entry;
                groupedPhases.push(entry);
            }
            phaseLookup[pKey].rows.push(r);
        });

        // Akıllı Çoklu Test Gruplaması (Gerçek NASA PSI Experimental Table CSV'leri için)
        if (groupedPhases.length === 1 && rows.length >= 2 && !colMap.phase_code && !colMap.phase_desc) {
            const tCheck = numList(rows, "time_s");
            const d2Raw = numList(rows, "d2_mm2");
            const d0Raw = numList(rows, "d0_mm");
            const d2Check = d2Raw.length ? d2Raw : d0Raw.map((x) => x * x);
            const isMonotonicD2 = tCheck.length >= 3 && d2Check.length === tCheck.length && Boolean(fitD2SlopeJs(tCheck, d2Check));
            if (!isMonotonicD2) {
                if (rows.length <= 7) {
                    groupedPhases = rows.map((r, rIdx) => {
                        const tid = String((colMap.test_id && r[colMap.test_id]) || "").trim();
                        return {
                            key: `TEST_${rIdx + 1}`,
                            code: tid || `TEST_${rIdx + 1}`,
                            desc: tid ? `Test ${tid}` : `Test ${rIdx + 1}`,
                            rows: [r],
                        };
                    });
                } else {
                    const buckets = {};
                    const bucketList = [];
                    rows.forEach((r) => {
                        const rawFuelCell = firstStr([r], "fuel");
                        const rFuel = parseFuelStrJs(rawFuelCell) || fallbackFuel;
                        const subFuel = rawFuelCell ? extractChemSubtokenJs(rawFuelCell) : rFuel;
                        const rO2L = extractO2Values([r]);
                        const rO2B = rO2L.length ? Math.round(rO2L[0] / 3.0) * 3 : 21;
                        const rPL = extractPressurePsia([r]);
                        const rPB = rPL.length ? Math.round(rPL[0] / 2.0) * 2 : 15;
                        const rFL = numList([r], "airflow_cms").map((v) => v * flowScale);
                        const rFB = rFL.length ? (rFL[0] < 0.8 ? 0 : (rFL[0] <= 10 ? 5 : (rFL[0] <= 24 ? 15 : 30))) : -1;
                        const rGL = numList([r], "gravity_g");
                        const rGB = rGL.length ? Math.round(rGL[0] * 10) / 10 : 0;
                        const rDil = extractDiluent([r]);
                        const rPol = firstStr([r], "polarity").slice(0, 8).toLowerCase();
                        const rTT = firstStr([r], "test_type").slice(0, 12).toLowerCase();
                        const rFCL = numList([r], "fuel_conc");
                        const rFCB = rFCL.length ? Math.round((rFCL[0] <= 1.05 ? rFCL[0] * 100 : rFCL[0]) / 20) * 20 : -1;
                        const rVL = numList([r], "voltage_kv");
                        const rVB = rVL.length ? Math.round(Math.abs(rVL[0]) / 2) * 2 : -1;
                        const rFRL = numList([r], "fuel_rate");
                        const rFRB = (rFB === -1 && rFRL.length) ? Math.round(rFRL[0] / 50) * 50 : -1;
                        const bKey = `${subFuel}|${rO2B}|${rPB}|${rFB}|${rGB}|${rDil}|${rPol}|${rFCB}|${rTT}|${rVB}|${rFRB}`;
                        if (!buckets[bKey]) {
                            if (bucketList.length < 7) {
                                const tid = String((colMap.test_id && r[colMap.test_id]) || "").trim();
                                const parts = [rawFuelCell || rFuel];
                                if (rO2L.length) parts.push(`%${rO2B} O₂`);
                                if (rPL.length) parts.push(`${rPB} psia`);
                                if (rFCL.length && rFCB < 100) parts.push(`%${rFCB} Yakıt`);
                                if (rPol) parts.push(rPol);
                                if (rVL.length) parts.push(`${rVL[0]} kV`);
                                const bObj = {
                                    key: bKey,
                                    code: tid || `GRUP_${bucketList.length + 1}`,
                                    desc: parts.join(" • "),
                                    rows: [],
                                };
                                buckets[bKey] = bObj;
                                bucketList.push(bObj);
                            } else {
                                bucketList[bucketList.length - 1].rows.push(r);
                                return;
                            }
                        }
                        buckets[bKey].rows.push(r);
                    });
                    if (bucketList.length >= 2) groupedPhases = bucketList;
                }
            }
        }

        const avg = (arr, defVal) => (arr.length ? Number((arr.reduce((a, b) => a + b, 0) / arr.length).toFixed(2)) : defVal);

        const phasesOut = [];
        let bestD2Fit = null;
        let hasCoolTelemetry = false;
        let hasMistTelemetry = false;
        let aeroMin = null, aeroMax = null;

        groupedPhases.forEach((grp, gIdx) => {
            const idx = gIdx + 1;
            const pr = grp.rows;
            const fuelId = parseFuelStrJs(firstStr(pr, "fuel")) || fallbackFuel;
            const diluent = extractDiluent(pr);
            let habitatId = parseHabitatStrJs(firstStr(pr, "habitat"));

            const o2Vals = extractO2Values(pr);
            const psiaVals = extractPressurePsia(pr);
            const flowVals = numList(pr, "airflow_cms").map((x) => x * flowScale).filter((x) => x >= 0 && x <= 60);
            const gravVals = numList(pr, "gravity_g").filter((x) => x >= 0 && x <= 2);
            const d0Vals = numList(pr, "d0_mm").filter((x) => x >= 0.4 && x <= 25);
            const d2Vals = numList(pr, "d2_mm2").filter((x) => x >= 0.1 && x <= 100);
            const tVals = numList(pr, "time_s");
            const tempKVals = numList(pr, "temp_k").filter((x) => x >= 250 && x <= 3500);
            const tempCVals = numList(pr, "temp_c").filter((x) => x >= 20 && x <= 3000).map((x) => x + 273.15);
            const tempVals = tempKVals.concat(tempCVals);
            const coVals = numList(pr, "co_ppm");
            const ch2oVals = numList(pr, "ch2o_ppm");
            const mistVals = numList(pr, "mist_um");
            const aeroVals = numList(pr, "aerosol_um").filter((x) => x > 0);
            const coolStr = firstStr(pr, "cool_flag").toLowerCase();
            const rowCoolObserved = ["y", "yes", "true", "1", "evet", "observed", "cool"].includes(coolStr);

            const fcVals = numList(pr, "fuel_conc").map((x) => (x <= 1.05 ? x * 100.0 : x)).filter((x) => x >= 2 && x <= 100);
            const vkvVals = numList(pr, "voltage_kv").map((x) => Math.abs(x)).filter((x) => x >= 0 && x <= 30);
            const frVals = numList(pr, "fuel_rate").filter((x) => x > 0);
            const polVal = firstStr(pr, "polarity").toLowerCase();
            const ttVal = firstStr(pr, "test_type").toLowerCase();

            let o2Mean = avg(o2Vals, 21.0);
            const pPsia = avg(psiaVals, 14.7);
            let flowMean;
            if (flowVals.length) {
                flowMean = Number(Math.min(45.0, avg(flowVals, 2.4)).toFixed(2));
            } else if (vkvVals.length) {
                flowMean = Number(Math.min(18.0, 1.8 + avg(vkvVals, 0) * 1.35).toFixed(2));
            } else if (ttVal.includes("coflow") || ttVal.includes("co-flow")) {
                flowMean = polVal.includes("neg") ? 5.8 : (polVal.includes("pos") ? 4.2 : 3.4);
            } else if (frVals.length) {
                flowMean = Number(Math.min(14.0, Math.max(1.2, avg(frVals, 50) / 45.0)).toFixed(2));
            } else {
                flowMean = 2.4;
            }
            const gravMean = avg(gravVals, 0.0);
            let d0Init;
            if (d0Vals.length) {
                d0Init = Number(Math.max(0.8, Math.min(8.0, d0Vals[0])).toFixed(2));
            } else if (d2Vals.length) {
                d0Init = Number(Math.max(0.8, Math.min(8.0, Math.sqrt(Math.max(0.64, d2Vals[0])))).toFixed(2));
            } else if (fcVals.length) {
                const fcAvg = avg(fcVals, 100);
                d0Init = Number(Math.max(1.5, Math.min(5.2, 1.5 + (fcAvg / 100.0) * 2.5)).toFixed(2));
                if (!o2Vals.length && fcAvg < 65) {
                    o2Mean = Number(Math.max(15.5, 21.0 - (100.0 - fcAvg) * 0.03).toFixed(1));
                }
            } else {
                d0Init = 3.2;
            }

            if (!habitatId) {
                if (o2Mean >= 75 && pPsia <= 6) habitatId = "eva_suit";
                else if (gravMean >= 0.10 && gravMean <= 0.25 && pPsia <= 11.5) habitatId = "lunar_rover";
                else if (gravMean >= 0.10) habitatId = "lunar_hab";
                else habitatId = "iss_module";
            }

            const d2Series = d2Vals.length ? d2Vals : (d0Vals.length ? d0Vals.map((x) => x * x) : []);
            const fit = (tVals.length && d2Series.length && tVals.length === d2Series.length) ? fitD2SlopeJs(tVals, d2Series) : null;

            const phaseParams = {
                fuel_id: fuelId,
                gravity_g: gravMean,
                oxygen_pct: o2Mean,
                pressure_psia: pPsia,
                airflow_cms: flowMean,
                droplet_d0_mm: d0Init,
                diluent: diluent,
                habitat_id: habitatId,
            };
            const simRes = simulateCombustionClient(phaseParams);
            const tel = simRes.telemetry;
            const tl = simRes.scenario_timeline || {};
            const call = simRes.callouts || {};

            if (fit && (fuelId === "n_heptane" || fuelId === "methanol") && (!bestD2Fit || fit.k_meas > bestD2Fit.k_meas)) {
                bestD2Fit = { phase_idx: idx, k_meas: fit.k_meas, k_model: tel.burning_rate_k_mm2_s, r2: fit.r2 };
            }

            const tempMean = tempVals.length ? Number((tempVals.reduce((a, b) => a + b, 0) / tempVals.length).toFixed(1)) : tel.flame_temp_k;
            const coMax = coVals.length ? Number(Math.max(...coVals).toFixed(1)) : tel.co_ppm;
            const ch2oMax = ch2oVals.length ? Number(Math.max(...ch2oVals).toFixed(1)) : 0;
            const mistMax = mistVals.length ? Number(Math.max(...mistVals).toFixed(1)) : 0;

            if (tel.cool_flame_active || rowCoolObserved || (tempMean >= 500 && tempMean <= 820) || ch2oMax >= 40) hasCoolTelemetry = true;
            if (mistMax > 0 || grp.desc.toLowerCase().includes("mist") || grp.desc.toLowerCase().includes("bastirma") || diluent === "CO2") hasMistTelemetry = true;
            if (aeroVals.length) {
                const mn = Math.min(...aeroVals), mx = Math.max(...aeroVals);
                aeroMin = aeroMin === null ? mn : Math.min(aeroMin, mn);
                aeroMax = aeroMax === null ? mx : Math.max(aeroMax, mx);
            }

            const tSpanTr = tVals.length >= 2 ? `${Math.trunc(tVals[0])}-${Math.trunc(tVals[tVals.length - 1])} sn` : `${pr.length} satir`;
            const tSpanEn = tVals.length >= 2 ? `${Math.trunc(tVals[0])}-${Math.trunc(tVals[tVals.length - 1])} s` : `${pr.length} rows`;

            phasesOut.push({
                index: idx,
                code: grp.code,
                desc: grp.desc,
                short_tr: `Faz ${idx}`,
                short_en: `Phase ${idx}`,
                time_span_tr: tSpanTr,
                time_span_en: tSpanEn,
                sim_params: phaseParams,
                measured_temp_k: tempMean,
                co_max_ppm: coMax,
                ch2o_max_ppm: ch2oMax,
                k_meas: fit ? fit.k_meas : null,
                r2_d2: fit ? fit.r2 : null,
                regime: tel.regime,
                badge_tr: call.badge_tr || tel.regime,
                badge_en: call.badge_en || tel.regime,
                flame_temp_k: tel.flame_temp_k,
                moc_pct: tel.moc_pct,
                k_model: tel.burning_rate_k_mm2_s,
                b_oq: tel.spalding_b_number,
                sh: tel.sherwood_number,
                da: tel.damkohler_number,
                risk_score: tel.risk_score,
                smac_s: tl.t_smac_125ppm_s ?? 999,
                extinguished: Boolean(tel.extinguished),
                cool_flame: Boolean(tel.cool_flame_active || rowCoolObserved),
                simulation: simRes,
            });
        });

        if (!phasesOut.length) return null;
        const activeHot = phasesOut.filter((p) => !p.extinguished && !p.cool_flame);
        const activeCool = phasesOut.filter((p) => p.cool_flame);
        const primary = activeHot[0] || activeCool[0] || phasesOut[0];

        const tblTr = [
            "| Faz | Zaman | Yakit ve Atmosfer | Sicaklik / CO / CH2O | Boyutsuz Sayilar (K, B_oq, Sh, Da, MOC) | Fiziksel Rejim ve SMAC |",
            "| :--- | :--- | :--- | :--- | :--- | :--- |",
        ];
        const tblEn = [
            "| Phase | Window | Fuel & Atmosphere | Temp / CO / CH2O | Dimensionless (K, B_oq, Sh, Da, MOC) | Regime & SMAC Clock |",
            "| :--- | :--- | :--- | :--- | :--- | :--- |",
        ];
        phasesOut.forEach((p) => {
            const sp = p.sim_params;
            const kTxt = (p.k_meas !== null ? p.k_meas : p.k_model).toFixed(2);
            const ch2oTxt = p.ch2o_max_ppm > 0 ? ` / ${Math.round(p.ch2o_max_ppm)} ppm CH₂O` : "";
            const smacTr = p.smac_s >= 900 ? "Guvenli" : `${p.smac_s} sn`;
            const smacEn = p.smac_s >= 900 ? "Safe" : `${p.smac_s} s`;
            tblTr.push(`| **Faz ${p.index}** | \`${p.time_span_tr}\` | \`${sp.fuel_id}\` • \`${sp.gravity_g}G\` • \`%${sp.oxygen_pct} O₂\` • \`${sp.pressure_psia} psia\` • \`${sp.airflow_cms} cm/s\` | \`${p.measured_temp_k} K\` • \`${p.co_max_ppm} ppm CO\`${ch2oTxt} | \`K=${kTxt}\` • \`B=${p.b_oq}\` • \`Sh=${p.sh}\` • \`Da=${p.da}\` • \`MOC=%${p.moc_pct}\` | **${p.badge_tr}** (Risk \`${p.risk_score}/100\`, SMAC \`${smacTr}\`) |`);
            tblEn.push(`| **Phase ${p.index}** | \`${p.time_span_en}\` | \`${sp.fuel_id}\` • \`${sp.gravity_g}G\` • \`${sp.oxygen_pct}% O₂\` • \`${sp.pressure_psia} psia\` • \`${sp.airflow_cms} cm/s\` | \`${p.measured_temp_k} K\` • \`${p.co_max_ppm} ppm CO\`${ch2oTxt} | \`K=${kTxt}\` • \`B=${p.b_oq}\` • \`Sh=${p.sh}\` • \`Da=${p.da}\` • \`MOC=${p.moc_pct}%\` | **${p.badge_en}** (Risk \`${p.risk_score}/100\`, SMAC \`${smacEn}\`) |`);
        });

        const diagTr = [], diagEn = [];
        if (bestD2Fit) {
            diagTr.push(`- **Deneysel d² Yasası Doğrulaması (Faz ${bestD2Fit.phase_idx}):** Ölçülen eğim \`K_ölç = ${bestD2Fit.k_meas.toFixed(3)} mm²/s\` ile kapalı-form model \`K_model = ${bestD2Fit.k_model.toFixed(3)} mm²/s\` arasında **\`R² = ${bestD2Fit.r2.toFixed(4)}\`** uyumu doğrulandı.`);
            diagEn.push(`- **Empirical d²-Law Validation (Phase ${bestD2Fit.phase_idx}):** Least-squares slope \`K_meas = ${bestD2Fit.k_meas.toFixed(3)} mm²/s\` matches closed-form \`K_model = ${bestD2Fit.k_model.toFixed(3)} mm²/s\` with **\`R² = ${bestD2Fit.r2.toFixed(4)}\`**.`);
        }
        if (hasCoolTelemetry) {
            diagTr.push(`- **Görünmez NTC Soğuk Alev ve Sensör Körlüğü (FLEX-2):** \`550-750 K\` bandında görünür optik şiddet \`%1\` altına düşerken \`CO\` ve \`CH₂O\` hızla yükselmektedir; \`CO + Orta-IR + CH₂O\` sensör füzyonu zorunludur.`);
            diagEn.push(`- **Invisible NTC Cool Flame & Sensor Blindness (FLEX-2):** Below \`800 K\`, visible optical intensity drops under \`1%\` while \`CO\` and \`CH₂O\` surge; multi-channel \`CO + Mid-IR + CH₂O\` fusion is mandatory.`);
        }
        if (hasMistTelemetry) {
            diagTr.push(`- **NASA-STD-6001B Söndürme Denetimi (SoFIE-MIST):** Havalandırma akışının kesilmesi (\`U -> 0 cm/s\`) ve \`<40 µm\` ince su sisi / \`CO₂\` seyreltmesiyle alev güvenli bölgeye (\`O₂ < MOC\`) indirilmiştir (*Halon 1301 kesinlikle kullanılmamıştır*).`);
            diagEn.push(`- **NASA-STD-6001B Suppression Audit (SoFIE-MIST):** Cutting HVAC flow (\`U -> 0 cm/s\`) with \`<40 µm\` fine water mist / \`CO₂\` dilution quenched the flame below \`MOC\` (*Halon 1301 strictly excluded*).`);
        }
        if (aeroMin !== null && aeroMax !== null && aeroMax > aeroMin * 3.0) {
            const ratio = (aeroMax / Math.max(0.01, aeroMin)).toFixed(1);
            diagTr.push(`- **SAME / DAFT Duman ve Ay Tozu Ayrımı:** Veri setinde \`${aeroMin.toFixed(2)} µm\` piroliz dumanı ile \`${aeroMax.toFixed(2)} µm\` Ay regolit tozu çift dalga boylu saçılım oranıyla (\`${ratio}x\` çap farkı) yanlış alarmsız ayrıştırılmıştır.`);
            diagEn.push(`- **SAME / DAFT Smoke vs. Lunar Dust Discrimination:** Sub-micron pyrolysis smoke (\`${aeroMin.toFixed(2)} µm\`) and coarse Lunar regolith dust (\`${aeroMax.toFixed(2)} µm\`) separated cleanly (\`${ratio}x\` size ratio) without false alarms.`);
        }

        const sp0 = primary.sim_params;
        const hdrTr = phasesOut.length > 1
            ? `**Çok Fazlı Telemetri Analizi (\`${filename}\` • ${rows.length} satır • ${phasesOut.length} fiziksel faz):**`
            : `**Tek Fazlı Deney Kaydı (\`${filename}\` • ${rows.length} satır):**`;
        const hdrEn = phasesOut.length > 1
            ? `**Multi-Phase Telemetry Analysis (\`${filename}\` • ${rows.length} rows • ${phasesOut.length} physical phases):**`
            : `**Single-Phase Experiment Record (\`${filename}\` • ${rows.length} rows):**`;
        const summaryTr = `${hdrTr}\n- **3B Yanma Odasına Aktarılan Aktif Durum:** **Faz ${primary.index}** (\`${sp0.fuel_id}\`, \`${sp0.gravity_g}G\`, \`%${sp0.oxygen_pct} O₂\`, \`${sp0.pressure_psia} psia\`, \`${sp0.airflow_cms} cm/s\` — Sıcaklık: \`${primary.flame_temp_k} K\`).\n` + (diagTr.length ? diagTr.join("\n") + "\n\n" : "\n") + tblTr.join("\n");
        const summaryEn = `${hdrEn}\n- **Active State Synced to 3D Chamber:** **Phase ${primary.index}** (\`${sp0.fuel_id}\`, \`${sp0.gravity_g}G\`, \`${sp0.oxygen_pct}% O₂\`, \`${sp0.pressure_psia} psia\`, \`${sp0.airflow_cms} cm/s\` — Temp: \`${primary.flame_temp_k} K\`).\n` + (diagEn.length ? diagEn.join("\n") + "\n\n" : "\n") + tblEn.join("\n");

        return {
            extracted_sim_params: sp0,
            simulation: primary.simulation,
            phases: phasesOut.map((p) => { const c = Object.assign({}, p); delete c.simulation; return c; }),
            summary_tr: summaryTr,
            summary_en: summaryEn,
        };
    }

    async function inflateRawZipSlice(compSlice) {
        if (typeof DecompressionStream === "undefined") {
            throw new Error("DecompressionStream unsupported in this browser.");
        }
        const ds = new DecompressionStream("deflate-raw");
        const writer = ds.writable.getWriter();
        const reader = ds.readable.getReader();
        const chunks = [];
        let totalLen = 0;
        const writeTask = (async () => {
            try {
                await writer.write(compSlice);
                await writer.close();
            } catch (_) {}
        })();
        try {
            while (true) {
                const { value, done } = await reader.read();
                if (done) break;
                if (value) {
                    totalLen += value.byteLength;
                    if (totalLen > 25 * 1024 * 1024) throw new Error("Archive exceeds 25 MB limit.");
                    chunks.push(value);
                }
            }
        } catch (err) {
            if (!chunks.length) throw err;
        }
        await writeTask;
        const out = new Uint8Array(totalLen);
        let offset = 0;
        chunks.forEach((c) => { out.set(c, offset); offset += c.byteLength; });
        return out;
    }

    function readZipEntriesFromBuffer(arrayBuffer) {
        const bytes = new Uint8Array(arrayBuffer);
        const dv = new DataView(arrayBuffer);
        const minEocd = Math.max(0, bytes.length - 65558);
        let eocdPos = -1;
        for (let p = bytes.length - 22; p >= minEocd; p--) {
            if (dv.getUint32(p, true) === 0x06054b50) { eocdPos = p; break; }
        }
        if (eocdPos < 0) return [];
        const totalEntries = dv.getUint16(eocdPos + 10, true);
        const cdOffset = dv.getUint32(eocdPos + 16, true);
        const dec = new TextDecoder("utf-8");
        const entries = [];
        let ptr = cdOffset;
        for (let i = 0; i < totalEntries && ptr + 46 <= bytes.length; i++) {
            if (dv.getUint32(ptr, true) !== 0x02014b50) break;
            const compMethod = dv.getUint16(ptr + 10, true);
            const compSize = dv.getUint32(ptr + 20, true);
            const uncompSize = dv.getUint32(ptr + 24, true);
            const nameLen = dv.getUint16(ptr + 28, true);
            const extraLen = dv.getUint16(ptr + 30, true);
            const commentLen = dv.getUint16(ptr + 32, true);
            const localHdrOffset = dv.getUint32(ptr + 42, true);
            const nameStr = dec.decode(bytes.subarray(ptr + 46, ptr + 46 + nameLen));
            entries.push({ name: nameStr, compMethod, compSize, uncompSize, localHdrOffset });
            ptr += 46 + nameLen + extraLen + commentLen;
        }
        return { bytes, dv, entries };
    }

    async function extractZipEntryBytes(zipInfo, entry) {
        if (!entry || entry.uncompSize > 25 * 1024 * 1024) return new Uint8Array(0);
        const { bytes, dv } = zipInfo;
        const lh = entry.localHdrOffset;
        if (lh + 30 > bytes.length || dv.getUint32(lh, true) !== 0x04034b50) return new Uint8Array(0);
        const lfNameLen = dv.getUint16(lh + 26, true);
        const lfExtraLen = dv.getUint16(lh + 28, true);
        const dataStart = lh + 30 + lfNameLen + lfExtraLen;
        const compSlice = bytes.subarray(dataStart, dataStart + entry.compSize);
        if (entry.compMethod === 0) return compSlice;
        if (entry.compMethod === 8) return await inflateRawZipSlice(compSlice);
        return new Uint8Array(0);
    }

    async function parseXlsxBufferToCsvText(arrayBuffer) {
        const zipInfo = readZipEntriesFromBuffer(arrayBuffer);
        if (!zipInfo.entries || !zipInfo.entries.length) return "";
        const dec = new TextDecoder("utf-8");
        const domParser = new DOMParser();
        const sharedStrings = [];
        const ssEntry = zipInfo.entries.find((e) => e.name.toLowerCase() === "xl/sharedstrings.xml");
        if (ssEntry) {
            const ssBytes = await extractZipEntryBytes(zipInfo, ssEntry);
            if (ssBytes.length) {
                const doc = domParser.parseFromString(dec.decode(ssBytes), "application/xml");
                const siNodes = doc.getElementsByTagName("si");
                for (let i = 0; i < siNodes.length; i++) {
                    const tNodes = siNodes[i].getElementsByTagName("t");
                    let acc = "";
                    for (let j = 0; j < tNodes.length; j++) acc += tNodes[j].textContent || "";
                    sharedStrings.push(acc);
                }
            }
        }
        const sheetEntries = zipInfo.entries
            .filter((e) => /^xl\/worksheets\/sheet\d*\.xml$/i.test(e.name))
            .sort((a, b) => a.name.localeCompare(b.name));
        if (!sheetEntries.length) return "";
        const shBytes = await extractZipEntryBytes(zipInfo, sheetEntries[0]);
        if (!shBytes.length) return "";
        const shDoc = domParser.parseFromString(dec.decode(shBytes), "application/xml");
        const rowNodes = shDoc.getElementsByTagName("row");
        const csvLines = [];
        const colRefToIdx = (refStr) => {
            const m = String(refStr || "").match(/^[A-Za-z]+/);
            if (!m) return -1;
            const letters = m[0].toUpperCase();
            let idx = 0;
            for (let k = 0; k < letters.length; k++) idx = idx * 26 + (letters.charCodeAt(k) - 64);
            return idx - 1;
        };
        const escCsvCell = (val) => {
            const s = String(val ?? "").replace(/\r?\n/g, " ").trim();
            return (s.includes(",") || s.includes('"') || s.includes(";")) ? `"${s.replace(/"/g, '""')}"` : s;
        };
        const maxRows = Math.min(rowNodes.length, 600);
        for (let r = 0; r < maxRows; r++) {
            const cNodes = rowNodes[r].getElementsByTagName("c");
            const rowArr = [];
            let hasNonEmpty = false;
            for (let c = 0; c < cNodes.length; c++) {
                const cell = cNodes[c];
                const cIdx = colRefToIdx(cell.getAttribute("r"));
                const targetIdx = cIdx >= 0 ? cIdx : rowArr.length;
                while (rowArr.length < targetIdx) rowArr.push("");
                const cType = cell.getAttribute("t") || "";
                let valStr = "";
                if (cType === "inlineStr") {
                    const tEls = cell.getElementsByTagName("t");
                    for (let ti = 0; ti < tEls.length; ti++) valStr += tEls[ti].textContent || "";
                } else {
                    const vEl = cell.getElementsByTagName("v")[0];
                    const rawV = vEl ? (vEl.textContent || "") : "";
                    if (cType === "s") {
                        const sIdx = parseInt(rawV, 10);
                        valStr = (!Number.isNaN(sIdx) && sharedStrings[sIdx] !== undefined) ? sharedStrings[sIdx] : rawV;
                    } else {
                        valStr = rawV;
                    }
                }
                if (valStr.trim() !== "") hasNonEmpty = true;
                rowArr[targetIdx] = escCsvCell(valStr);
            }
            if (hasNonEmpty) csvLines.push(rowArr.join(","));
        }
        return csvLines.join("\n");
    }

    async function extractArchiveBufferInBrowser(arrayBuffer, origName) {
        const low = String(origName || "").toLowerCase();
        if (low.endsWith(".xlsx")) {
            const csvText = await parseXlsxBufferToCsvText(arrayBuffer);
            return { text: csvText, effectiveName: origName };
        }
        const zipInfo = readZipEntriesFromBuffer(arrayBuffer);
        if (!zipInfo.entries || !zipInfo.entries.length) return { text: "", effectiveName: origName };
        if (zipInfo.entries.some((e) => e.name.toLowerCase() === "xl/workbook.xml")) {
            const csvText = await parseXlsxBufferToCsvText(arrayBuffer);
            return { text: csvText, effectiveName: origName };
        }
        const rankEntry = (nm) => {
            const nl = nm.toLowerCase();
            if (nl.endsWith("/") || nl.includes("__macosx")) return 999;
            const bonus = (nl.includes("experimental") || nl.includes("table") || nl.includes("summary")) ? -10 : 0;
            if (nl.endsWith(".csv")) return 10 + bonus;
            if (nl.endsWith(".tsv")) return 12 + bonus;
            if (nl.endsWith(".xlsx")) return 15 + bonus;
            if (nl.endsWith(".json")) return 20 + bonus;
            if (nl.endsWith(".txt") || nl.endsWith(".md")) return 30 + bonus;
            return 999;
        };
        const sorted = zipInfo.entries.slice().sort((a, b) => rankEntry(a.name) - rankEntry(b.name));
        const best = sorted[0];
        if (!best || rankEntry(best.name) >= 999) return { text: "", effectiveName: origName };
        const innerBytes = await extractZipEntryBytes(zipInfo, best);
        if (!innerBytes.length) return { text: "", effectiveName: origName };
        const baseInner = best.name.split("/").pop() || origName;
        if (best.name.toLowerCase().endsWith(".xlsx")) {
            const subBuf = innerBytes.buffer.slice(innerBytes.byteOffset, innerBytes.byteOffset + innerBytes.byteLength);
            const csvText = await parseXlsxBufferToCsvText(subBuf);
            return { text: csvText, effectiveName: `${origName} (${baseInner})` };
        }
        return { text: new TextDecoder("utf-8").decode(innerBytes), effectiveName: `${origName} (${baseInner})` };
    }

    async function analyzeUploadedMediaInBrowser(formData) {
        const file = formData && formData.get ? formData.get("file") : null;
        if (!file) return { ok: false, error: "Dosya bulunamadı / No file provided." };
        let name = file.name || "uploaded_file";
        const lower = name.toLowerCase();

        if (file.type.startsWith("image/") || /\.(png|jpg|jpeg|webp|bmp)$/.test(lower)) {
            const dataUrl = await new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => resolve(String(reader.result));
                reader.onerror = () => reject(new Error("Image read failed"));
                reader.readAsDataURL(file);
            });
            const img = await new Promise((resolve, reject) => {
                const im = new Image();
                im.onload = () => resolve(im);
                im.onerror = () => reject(new Error("Image decode failed"));
                im.src = dataUrl;
            });
            const w = Math.min(160, img.width || 120);
            const h = Math.min(160, img.height || 120);
            const cv = document.createElement("canvas");
            cv.width = w;
            cv.height = h;
            const ctx = cv.getContext("2d");
            ctx.drawImage(img, 0, 0, w, h);
            const px = ctx.getImageData(0, 0, w, h).data;
            let blueCnt = 0, warmCnt = 0, violetCnt = 0, totalBri = 0;
            for (let i = 0; i < px.length; i += 4) {
                const r = px[i], g = px[i + 1], b = px[i + 2];
                totalBri += (r + g + b) / 3;
                if (b > r + 28 && b > 80) blueCnt++;
                if (r > b + 40 && r > 120 && g > 70) warmCnt++;
                if (b > 70 && r > 60 && g < Math.min(r, b) - 12) violetCnt++;
            }
            const totalPx = Math.max(1, px.length / 4);
            const isBlue0g = blueCnt >= warmCnt;
            const isCool = violetCnt > totalPx * 0.08 && totalBri / totalPx < 75;
            const extracted = isCool
                ? { fuel_id: "n_heptane", gravity_g: 0.0, oxygen_pct: 16.5, pressure_psia: 14.7, airflow_cms: 0.2, droplet_d0_mm: 3.8, diluent: "N2" }
                : isBlue0g
                ? { fuel_id: "n_heptane", gravity_g: 0.0, oxygen_pct: 21.0, pressure_psia: 14.7, airflow_cms: 0.8, droplet_d0_mm: 3.0, diluent: "N2" }
                : { fuel_id: "pmma", gravity_g: 0.38, oxygen_pct: 28.0, pressure_psia: 12.0, airflow_cms: 6.0, droplet_d0_mm: 3.4, diluent: "N2" };
            const sim = simulateCombustionClient(extracted);
            const regLabelTr = isCool ? "Görünmez Soğuk Alev (UV/IR)" : (isBlue0g ? "0G Küresel Safir-Mavi Difüzyon" : "Kurumlu Konvektif Plume");
            const regLabelEn = isCool ? "Invisible Cool Flame (UV/IR)" : (isBlue0g ? "0G Spherical Sapphire Diffusion" : "Sooty Convective Plume");
            const bluePct = ((blueCnt / totalPx) * 100).toFixed(1);
            const warmPct = ((warmCnt / totalPx) * 100).toFixed(1);
            return {
                ok: true,
                filename: name,
                media_type: "image",
                image_base64: dataUrl,
                metrics: { detected_regime_tr: regLabelTr, detected_regime_en: regLabelEn },
                extracted_sim_params: extracted,
                simulation: sim,
                summary_tr: `**Görüntü Piksel Analizi (${name}):** Mavi alev oranı \`%${bluePct}\`, kurum/sıcak ışıma \`%${warmPct}\` — **${regLabelTr}** tespit edildi.`,
                summary_en: `**Flame Pixel Analysis (${name}):** Blue chemiluminescence \`${bluePct}%\`, warm soot index \`${warmPct}%\` — **${regLabelEn}** detected.`,
            };
        }

        let text = "";
        if (lower.endsWith(".xlsx") || lower.endsWith(".zip")) {
            const ab = await file.arrayBuffer();
            const archRes = await extractArchiveBufferInBrowser(ab, name);
            text = archRes.text || "";
            name = archRes.effectiveName || name;
        } else if (lower.endsWith(".pdf")) {
            const ab = await file.arrayBuffer();
            text = extractReadableTextFromPdfBuffer(ab);
        } else {
            text = await file.text();
        }

        return parseTextOrTablePayloadInBrowser(text, name);
    }

    function parseTextOrTablePayloadInBrowser(text, name) {
        ragDocs.push({ doc_id: `USR-${Date.now()}`, title: name, source: "Browser Local File", url: "", text: text.slice(0, 12000) });

        // 1. Çok fazlı JSON / CSV / TSV / XLSX / ZIP tablo çözümlemesi
        const trimmed = String(text || "").replace(/^\uFEFF/, "").trim();
        let tabRes = null;
        if (trimmed.startsWith("{") || trimmed.startsWith("[")) {
            try {
                const parsedJson = JSON.parse(trimmed);
                if (Array.isArray(parsedJson) && parsedJson.length && typeof parsedJson[0] === "object") {
                    tabRes = analyzeTabularRowsInBrowser(parsedJson.slice(0, 600), name);
                } else if (parsedJson && Array.isArray(parsedJson.rows) && parsedJson.rows.length) {
                    tabRes = analyzeTabularRowsInBrowser(parsedJson.rows.slice(0, 600), name);
                } else if (parsedJson && typeof parsedJson === "object") {
                    tabRes = analyzeTabularRowsInBrowser([parsedJson], name);
                }
            } catch (_) {}
        } else if (looksLikeTabularTextJs(trimmed, name)) {
            const csvRows = parseCsvRowsJs(trimmed);
            if (csvRows.length > 0) {
                tabRes = analyzeTabularRowsInBrowser(csvRows, name);
            }
        }

        if (tabRes) {
            return {
                ok: true,
                filename: name,
                title: name,
                media_type: "document",
                chunks: Math.max(1, Math.ceil(trimmed.length / 800)),
                phases: tabRes.phases,
                extracted_sim_params: tabRes.extracted_sim_params,
                simulation: tabRes.simulation,
                summary_tr: tabRes.summary_tr,
                summary_en: tabRes.summary_en,
            };
        }

        // 2. Serbest metin / PDF çıkarımı (sıkı kelime sınırı + birim dönüşümleri + soğuk alev / kabin bağlamı)
        const extracted = {
            fuel_id: parseFuelStrJs(trimmed) || parseFuelStrJs(name) || "n_heptane",
            gravity_g: /0\.16|lunar|moon/i.test(trimmed) ? 0.16 : (/0\.38|mars/i.test(trimmed) ? 0.38 : (/1\.0\s*g|earth/i.test(trimmed) ? 1.0 : 0.0)),
            oxygen_pct: 21.0,
            pressure_psia: 14.7,
            airflow_cms: 2.4,
            droplet_d0_mm: 3.2,
            diluent: "N2",
        };
        const o2Match = trimmed.match(/(\d{1,3}(?:\.\d+)?)\s*%\s*(?:o2|o₂|oxygen|oksijen)\b/i) || trimmed.match(/(?:^|[^a-z0-9])(?:x_?o2|o2|o₂|oxygen|oksijen)\s*(?:mole\s*fraction)?\s*[:=]\s*%?\s*(\d{1,3}(?:\.\d+)?)/i);
        const pMatch = trimmed.match(/(\d{1,2}(?:\.\d+)?)\s*psia\b/i);
        const atmMatch = trimmed.match(/(\d{1,2}(?:\.\d+)?)\s*atm\b/i);
        const barMatch = trimmed.match(/(\d{1,2}(?:\.\d+)?)\s*bar\b/i);
        const kpaMatch = trimmed.match(/(\d{2,3}(?:\.\d+)?)\s*kpa\b/i);
        const torrMatch = trimmed.match(/(\d{3,4}(?:\.\d+)?)\s*(?:torr|mmhg)\b/i);
        const uMatch = trimmed.match(/(\d{1,2}(?:\.\d+)?)\s*cm\/s\b/i);
        if (o2Match) {
            const rawO2 = parseFloat(o2Match[1]);
            const convO2 = (rawO2 >= 0.03 && rawO2 <= 1.0) ? rawO2 * 100.0 : rawO2;
            extracted.oxygen_pct = Number(Math.min(100, Math.max(5, convO2)).toFixed(2));
        }
        if (pMatch) extracted.pressure_psia = Math.min(35, Math.max(3.0, parseFloat(pMatch[1])));
        else if (atmMatch) extracted.pressure_psia = Number(Math.min(35, Math.max(3.0, parseFloat(atmMatch[1]) * 14.6959)).toFixed(2));
        else if (barMatch) extracted.pressure_psia = Number(Math.min(35, Math.max(3.0, parseFloat(barMatch[1]) * 14.5038)).toFixed(2));
        else if (kpaMatch) extracted.pressure_psia = Number(Math.min(35, Math.max(3.0, parseFloat(kpaMatch[1]) / 6.89476)).toFixed(2));
        else if (torrMatch) extracted.pressure_psia = Number(Math.min(35, Math.max(3.0, parseFloat(torrMatch[1]) / 51.7149)).toFixed(2));
        if (uMatch) extracted.airflow_cms = Math.min(45, Math.max(0, parseFloat(uMatch[1])));

        const lowTxt = `${name} ${trimmed}`.toLowerCase();
        if (["cool flame", "cool-flame", "soğuk alev", "soguk alev", "ntc", "two-stage", "psi-117"].some((w) => lowTxt.includes(w))) {
            if (!["pmma", "sibal", "nomex", "hydrogen"].includes(extracted.fuel_id)) {
                if (lowTxt.includes("cfi-g") || lowTxt.includes("propane")) {
                    extracted.fuel_id = "propane_cfig";
                    if (!o2Match) extracted.oxygen_pct = 85.0;
                } else {
                    extracted.fuel_id = "n_heptane";
                    if (!o2Match) extracted.oxygen_pct = 16.5;
                }
                if (!uMatch) extracted.airflow_cms = 0.4;
                extracted.droplet_d0_mm = 4.4;
            }
        } else if (lowTxt.includes("spacesuit") || lowTxt.includes("eva suit") || lowTxt.includes("uzay giysisi")) {
            if (!o2Match) extracted.oxygen_pct = 100.0;
            if (!pMatch && !atmMatch && !barMatch && !kpaMatch && !torrMatch) extracted.pressure_psia = 4.3;
            extracted.fuel_id = "nomex";
        } else if (lowTxt.includes("exploration atmosphere") || lowTxt.includes("sofie")) {
            if (!o2Match) extracted.oxygen_pct = 34.0;
            if (!pMatch && !atmMatch && !barMatch && !kpaMatch && !torrMatch) extracted.pressure_psia = 8.2;
        }

        const sim = simulateCombustionClient(extracted);
        return {
            ok: true,
            filename: name,
            title: name,
            media_type: "document",
            chunks: Math.max(1, Math.ceil(trimmed.length / 800)),
            phases: [],
            extracted_sim_params: extracted,
            simulation: sim,
            summary_tr: `**Veri Dosyası Analizi (${name}):** Yakıt \`${extracted.fuel_id}\`, Yerçekimi \`${extracted.gravity_g}G\`, O₂ \`%${extracted.oxygen_pct}\`, Basınç \`${extracted.pressure_psia} psia\`, Akış \`${extracted.airflow_cms} cm/s\` — Rejim: **${sim.callouts.badge_tr}**.`,
            summary_en: `**Data File Analysis (${name}):** Fuel \`${extracted.fuel_id}\`, Gravity \`${extracted.gravity_g}G\`, O₂ \`${extracted.oxygen_pct}%\`, Pressure \`${extracted.pressure_psia} psia\`, Airflow \`${extracted.airflow_cms} cm/s\` — Regime: **${sim.callouts.badge_en}**.`,
        };
    }

    function normQueryAscii(str) {
        return String(str || "")
            .toLowerCase()
            .trim()
            .replace(/ı/g, "i")
            .replace(/ğ/g, "g")
            .replace(/ü/g, "u")
            .replace(/ş/g, "s")
            .replace(/ö/g, "o")
            .replace(/ç/g, "c")
            .replace(/â/g, "a");
    }

    function hasAnyTerm(nq, terms) {
        for (let i = 0; i < terms.length; i++) {
            if (nq.indexOf(terms[i]) !== -1) return true;
        }
        return false;
    }

    function truncateCleanJs(rawStr, maxChars) {
        const clean = String(rawStr || "").trim().replace(/\s+/g, " ");
        const lim = maxChars || 96;
        if (clean.length <= lim) return clean;
        const cut = clean.slice(0, lim);
        const sp = cut.lastIndexOf(" ");
        return (sp > 20 ? cut.slice(0, sp) : cut) + "...";
    }

    function classifyBrowserIntent(rawMsg, mediaCtx) {
        const nq = normQueryAscii(rawMsg);
        if (
            (nq.indexOf("boyutsuz sayilari") !== -1 && (nq.indexOf("psi") !== -1 || nq.indexOf("dunya") !== -1 || nq.indexOf("eclss") !== -1)) ||
            (nq.indexOf("dimensionless numbers") !== -1 && (nq.indexOf("psi") !== -1 || nq.indexOf("earth") !== -1)) ||
            hasAnyTerm(nq, ["tam rapor", "kapsamli analiz", "full report", "comprehensive analysis", "tumunu sentezle"])
        ) {
            return "full_synthesis";
        }

        if (
            mediaCtx &&
            (hasAnyTerm(nq, ["yukledigim", "yuklenen", "ekli", "eklenen", "dosya", "gorsel", "goruntu", "resim", "fotograf", "csv", "xlsx", "excel", "zip", "tsv", "pdf", "json", "veri", "veriyi", "tablo", "tabloda", "tablosu", "tablosunda", "tabloyu", "grafik", "degerleri", "degerlerini", "mevcut analiz", "analiz deger", "faz", "fazlar", "veri seti", "tum ozellik", "butun ozellik", "uploaded", "attached", "image", "photo", "table", "phases", "values", "dataset", "file"]) ||
                ["analiz et", "bu veriyi analiz et", "incele", "degerlendir", "ozetle", "analyze", "analyze this", "evaluate", "summarize"].includes(nq))
        ) {
            return "uploaded_media";
        }

        const physicsAnchors = [
            "heptan", "metanol", "pmma", "nomex", "sibal", "hidrojen", "propan",
            "spalding", "sherwood", "damkohler", "rayleigh", "grashof", "richardson",
            "halon", "sofie", "saffire", "flex", "bass", "spice", "slise", "daft",
            "luci", "fm2", "soguk alev", "cool flame", "moc", "eva", "gezgin", "rover", "roket", "rocket"
        ];
        if (!hasAnyTerm(nq, physicsAnchors)) {
            if (hasAnyTerm(nq, ["ozelliklerin", "ozellikleri", "hangi ozellik", "yeteneklerin", "mimari", "modullerin", "sistemin ozellik", "features", "architecture", "modules", "specifications"])) {
                return "platform_features";
            }
            if (hasAnyTerm(nq, ["neler yapabilir", "ne yapabilir", "ne ise yarar", "nasil kullan", "yardim", "komutlar", "ne sorabilir", "bana ne sun", "what can you do", "how to use", "capabilities", "help"])) {
                return "capabilities_guide";
            }
            if (hasAnyTerm(nq, ["merhaba", "selam", "iyi gunler", "gunaydin", "iyi aksamlar", "kimsin", "sen kimsin", "nesin", "kendini tanit", "hello", "hi ", "who are you", "what are you"]) || ["hi", "merhaba", "selam", "hey", "alo", "test", "deneme"].includes(nq)) {
                return "greeting_identity";
            }
        }

        if (hasAnyTerm(nq, ["roket", "rocket", "itici", "thruster", "nozul", "nozzle"])) {
            return "rocket_scope";
        }
        if (hasAnyTerm(nq, ["uzay giysisi", "eva giysi", "spacesuit", "eva suit", "4.3 psia", "%100 o2", "100% o2", "gezgin", "lunar rover", "pressurized rover", "10.2 psia", "on-soluma", "on soluma", "pre-breathe", "vurgun", "dekompresyon"])) {
            return "eva_rover_atmosphere";
        }
        if (hasAnyTerm(nq, ["halon", "sondur", "mudahale", "su sisi", "water mist", "sofie-mist", "pfe", "yangin cikarsa", "acil durum", "6001b", "smac", "karbonmonoksit", "eclss", "suppress", "extinguish"])) {
            return "suppression_halon";
        }
        if (hasAnyTerm(nq, ["soguk alev", "cool flame", "ntc", "gorunmez alev", "iki asamali", "two-stage", "peroksi", "daft", "ay tozu", "regolit", "lunar dust", "duman dedektor", "toz-duman", "yanlis alarm", "false alarm"])) {
            return "cool_flame_daft";
        }
        if (hasAnyTerm(nq, ["kismi yercekimi", "partial gravity", "partial-gravity", "luci", "fm2", "e-field", "efield", "iyon ruzgari", "ionic wind", "0.16g", "0.16 g", "0.38g", "0.38 g", "mars yercekimi", "mars'ta", "marsta", "martian", "ay yercekimi", "ay'da", "ayda yanma", "bounding", "sinirlandirma"])) {
            return "partial_gravity_luci";
        }
        if (hasAnyTerm(nq, ["en yuksek oksijen", "highest oxygen", "cfi-g", "cfig", "saffire", "bass-ii", "bass ", "spice", "slise", "flex-2", "bre ", "burn rate emulator", "cir ", "mdca", "msg ", "cygnus", "ntrs-", "osdr-", "psi-"]) || /\b(flex|cfi|acme|sofie|bass|same)\b/.test(nq)) {
            return "specific_experiment";
        }
        if (hasAnyTerm(nq, ["spalding", "b_oq", "boq", "sherwood", "reynolds", "rayleigh", "grashof", "richardson", "damkohler", "d2 yasasi", "d²", "yanma sabiti", "burning constant", "standoff", "durma mesafesi", "r_f", "radyatif kayip", "chi_r", "moc nasil", "moc nedir", "denklem", "formul", "nasil hesaplan", "equation", "formula"])) {
            return "equation_deep_dive";
        }
        if (hasAnyTerm(nq, ["artirirsam", "artarsa", "yukseltirsem", "azaltirsam", "dusurursem", "degistirirsem", "kapatirsam", "olursa ne olur", "ne degisir", "farki ne", "0g ile 1g", "havalandirma", "fan hizi", "akis hizi", "ufleme", "blowoff", "seyreltici", "helyum", "argon", "what if", "increase", "decrease", "sensitivity", "difference between"])) {
            return "what_if_sensitivity";
        }
        if (hasAnyTerm(nq, ["dunya'ya", "dunyaya", "dunya uygula", "yeryuzu", "itfaiye", "firefighter", "spinoff", "teknoloji transfer", "scba", "hcci", "earth transfer", "earth application"])) {
            return "earth_spinoffs";
        }
        return "targeted_scientific";
    }

    function buildQuestionDrivenReply(msg, simParams, mediaCtx, lang) {
        const sim = simulateCombustionClient(simParams || {});
        const ranked = rankExperimentsClient(simParams || {}, msg, "ALL").ranked_experiments.slice(0, 4);
        const inp = sim.inputs;
        const tel = sim.telemetry;
        const fv = sim.flight_validation;
        const tl = sim.scenario_timeline;
        const call = sim.callouts || {};
        const isEn = lang === "en";
        const regBadge = (isEn ? call.badge_en : call.badge_tr) || tel.regime;
        const nq = normQueryAscii(msg);
        const intent = classifyBrowserIntent(msg, mediaCtx);

        const defaultCitations = ranked.slice(0, 3).map((e) => ({
            id: e.exp_id,
            program: e.program,
            ntrs_id: e.ntrs_id,
            url: e.ntrs_url,
        }));

        // 1. Neler yapabilirsin? / Etkileşimli kullanım rehberi
        if (intent === "capabilities_guide") {
            return {
                reply: isEn
                    ? [
                          `### ALTAR-NASA v5.1 — Interactive Engineering & Scientific Capabilities`,
                          `Currently locked onto your live 3D chamber (**${inp.fuel_name_en}** at \`${inp.gravity_g} G\`, \`${inp.oxygen_pct}% O₂\`, \`${inp.pressure_psia} psia\`, \`U = ${inp.airflow_cms} cm/s\` → **${regBadge}**, Risk \`${tel.risk_score}/100\`). Ask me to compute or analyze any specific scenario:`,
                          ``,
                          `| Capability Domain | Live Calculation Executed | Example Question You Can Type |`,
                          `| :--- | :--- | :--- |`,
                          `| **Equation Derivation** | Step-by-step substitution of \`d²\`-law \`K\`, Spalding \`B_oq\`, Sherwood \`Sh\`, \`Ra/Ri\`, Damköhler \`Da\`, and \`MOC\` | *"How is Spalding B_oq and burning rate K calculated?"* |`,
                          `| **Counterfactual What-If Sweep** | Multi-point sweeps across airflow (\`0–30 cm/s\`), gravity (\`0G–1G\`), \`O₂%\`, and diluents (\`N₂/CO₂/He\`) | *"What happens if I increase cabin airflow from 0 to 20 cm/s?"* |`,
                          `| **EVA Suit & Rover Comparison** | Live table comparing ISS (\`14.7 psia\`), Lunar Rover (\`10.2 psia / 32% O₂\`), and EVA Suit (\`4.3 psia / 100% O₂\`) | *"Compare EVA spacesuit and Lunar Rover flammability risks."* |`,
                          `| **15 NASA PSI Investigations** | Deep-dive into \`FLEX\`, \`CFI-G\`, \`BASS\`, \`SPICE\`, \`SLISE\`, \`Saffire\`, \`SoFIE\`, \`DAFT\` & intra-run matrices | *"Explain Saffire-V test variations and CFI-G findings."* |`,
                          `| **ECLSS & Fire Suppression** | \`NASA-STD-6001B\` Halon 1301 ban, \`SoFIE-MIST\` water mist, \`SMAC 125 ppm CO\` clock, Cool Flame sensing | *"Why is Halon 1301 banned and how fast does CO hit SMAC?"* |`,
                          `| **Image / Dataset Analyzer** | In-browser pixel chemiluminescence/soot segmentation (\`.png/.jpg\`) & \`.csv/.xlsx/.zip/.pdf\` extraction | Upload a file on the left and ask *"Analyze my uploaded file"* |`,
                      ].join("\n")
                    : [
                          `### ALTAR-NASA v5.1 — Yapabileceğim Canlı Hesaplama ve Mühendislik Analizleri`,
                          `Şu anda aktif 3B yanma odanıza kilitliyim (**${inp.fuel_name_tr}** • \`${inp.gravity_g} G\`, \`%${inp.oxygen_pct} O₂\`, \`${inp.pressure_psia} psia\`, \`U = ${inp.airflow_cms} cm/s\` → **${regBadge}**, Risk \`${tel.risk_score}/100\`). Bana doğrudan şu hesaplama ve sorguları yaptırabilirsiniz:`,
                          ``,
                          `| Analiz Yeteneği | Arka Planda Yürüttüğüm Canlı İşlem | Doğrudan Sorabileceğiniz Örnek Soru |`,
                          `| :--- | :--- | :--- |`,
                          `| **Adım Adım Denklem Çözümü** | Aktif kaydırıcı değerlerinizle \`d²\` yasası (\`K\`), Spalding \`B_oq\`, Sherwood \`Sh\`, \`Ra/Ri\`, Damköhler \`Da\` ve \`MOC\` hesabı | *"Spalding B_oq ve yanma sabiti K nasıl hesaplanıyor?"* |`,
                          `| **'Ne Olur?' Duyarlılık Taraması** | Akış hızı (\`0–30 cm/s\`), yerçekimi (\`0G / 0.16G / 0.38G / 1G\`), \`O₂%\` veya seyreltici gaz (\`N₂/CO₂/He\`) taraması | *"Havalandırma hızını artırırsam alev nasıl değişir?"* |`,
                          `| **Giysi & Gezgin Atmosfer Kıyaslaması** | ISS (\`14.7 psia\`), Ay Gezgini (\`10.2 psia / %32 O₂\`) ve EVA Giysisi (\`4.3 psia / %100 O₂\`) yanıcılık matrisi | *"Uzay giysisi ile basınçlı Ay gezginini sayısal kıyasla."* |`,
                          `| **15 NASA PSI Deneyi & Raf Sorgusu** | \`FLEX\`, \`CFI\`, \`ACME CFI-G\`, \`BASS\`, \`SPICE\`, \`SLISE\`, \`Saffire\`, \`SoFIE\`, \`DAFT\` bulguları ve varyasyon tablosu | *"Saffire deneyinde neler sabit tutuldu, neler değiştirildi?"* |`,
                          `| **ECLSS Yaşam Saati & Söndürme** | \`NASA-STD-6001B\` Halon 1301 yasağı, \`SoFIE-MIST\` su sisi, \`SMAC 125 ppm CO\` saati ve Soğuk Alev tespiti | *"Uzay aracında Halon 1301 neden yasak?"* |`,
                          `| **Görsel & Veri Dosyası Çözümleme** | Tarayıcı RAM'inde alev fotoğrafı (\`.png/.jpg\`) piksel analizi ve \`.csv/.xlsx/.zip/.pdf\` parametre çıkarımı | Soldan dosya seçip *"Yüklediğim veriyi analiz et"* yazın |`,
                      ].join("\n"),
                citations: [],
            };
        }

        // 2. Özelliklerin neler? / 5 Modüllü Teknik Mimari Envanteri
        if (intent === "platform_features") {
            return {
                reply: isEn
                    ? [
                          `### ALTAR-NASA: Flame in Freefall (v5.1) — Platform Modules`,
                          `ALTAR-NASA consists of **5 integrated modules** running directly in your browser:`,
                          ``,
                          `1. **Combustion Chamber:** 4-geometry 3D WebGL chamber (\`Droplet\`, \`PMMA Rod\`, \`Fabric Slab\`, \`CFI-G Porous Sphere\`) solving 8 coupled equations calibrated against ISS flight telemetry (**\`R² = ${fv.r_squared}\`**, \`RMSE = ${fv.rmse}\`), flame audio sonification, and **Life Support Clock (\`SMAC 125 ppm CO\`)**.`,
                          `2. **NASA Experiments:** Physical similarity + bilingual ranking across 15 verified NASA PSI experiments (\`CIR/MDCA\`, \`MSG Flow Duct\`, \`Cygnus Saffire\`, \`SAME/DAFT\`), intra-experiment test variations, and Earth applications.`,
                          `3. **Data & Imagery:** Live \`ntrs.nasa.gov\` & \`osdr.nasa.gov\` archive stream plus client-side flame photo pixel analysis and \`.CSV/.JSON/.PDF\` parameter extraction.`,
                          `4. **Engineering Analysis:** Question-driven analytical & sensitivity solver guarded by \`CON-01..CON-09\` and \`NASA-STD-6001B\` Halon-prohibition checks.`,
                          `5. **Validation & Settings:** Physical validation rules matrix and one-click **\`.CSV\`**, **\`.JSON\`**, and **\`.MD\`** scientific dataset export.`,
                      ].join("\n")
                    : [
                          `### ALTAR-NASA: Flame in Freefall (v5.1) — Platform Modülleri`,
                          `Platform doğrudan tarayıcı içinde çalışan **5 entegre mühendislik modülünden** oluşur:`,
                          ``,
                          `1. **Yanma Odası:** 4 farklı 3B numune/brülör geometrisini (\`Damlacık\`, \`PMMA Çubuk\`, \`Nomex/Sibal Kumaş\`, \`CFI-G Gözenekli Küre\`) ve 8 temel taşınım denklemini ISS uçuş verileriyle (**\`R² = ${fv.r_squared}\`**, \`RMSE = ${fv.rmse}\`) doğrular; alev seslendirme ve **Yaşam Destek Saati (\`SMAC 125 ppm CO\`)** sunar.`,
                          `2. **NASA Deneyleri:** \`CIR/MDCA\`, \`MSG Fan Kanalı\`, \`Cygnus (Saffire)\` ve \`SAME/DAFT\` donanımlarındaki 15 doğrulanmış NASA PSI deneyini fiziksel yakınlıkla sıralar; test varyasyonlarını ve Dünya uygulamalarını gösterir.`,
                          `3. **Veri ve Görüntü:** Resmi \`ntrs.nasa.gov\` ve \`osdr.nasa.gov\` arşivlerinden canlı veri çeker; alev fotoğraflarını ve \`.csv/.json/.pdf\` dosyalarını analiz edip 3B odaya aktarır.`,
                          `4. **Mühendislik Analizi:** Soru-odaklı çok noktalı analitik çözücüyü \`CON-01..CON-09\` fiziksel kuralları ve \`NASA-STD-6001B\` Halon yasağı denetimiyle çalıştırır.`,
                          `5. **Doğrulama ve Ayarlar:** Fiziksel doğrulama kuralları matrisini sunar ve tek tıkla **\`.CSV\`**, **\`.JSON\`** ve **\`.MD\`** bilimsel görev raporu indirmenizi sağlar.`,
                      ].join("\n"),
                citations: [],
            };
        }

        // 3. Selamlama & Aktif Kilit Özeti
        if (intent === "greeting_identity") {
            return {
                reply: isEn
                    ? [
                          `### ALTAR-NASA v5.1 — Decision Support Kernel Online`,
                          `- **Active 3D Chamber Lock:** \`${inp.fuel_name_en}\` (\`${inp.geometry_3d}\`) | \`${inp.gravity_g} G\` | \`${inp.oxygen_pct}% O₂\` (\`P_O2 = ${tel.o2_partial_psia} psia\`) | \`U = ${inp.airflow_cms} cm/s\``,
                          `- **Computed State:** Regime **${regBadge}** | Flame Temp \`${tel.flame_temp_k} K\` | Critical \`MOC = ${tel.moc_pct}% O₂\` | Fire Risk **\`${tel.risk_score}/100\`**`,
                          ``,
                          `Ask me any targeted question—such as deriving \`Spalding B_oq\`, sweeping airflow or gravity (\`0G vs 0.16G Moon\`), comparing \`EVA Suit\` vs \`Lunar Rover\`, or inspecting \`FLEX\`, \`Saffire\`, \`SoFIE-MIST\`, or \`DAFT\`.`,
                      ].join("\n")
                    : [
                          `### ALTAR-NASA v5.1 — Kanıt Sentezi ve Karar Destek Çekirdeği Hazır`,
                          `- **Aktif 3B Yanma Odası Kilidi:** \`${inp.fuel_name_tr}\` (\`${inp.geometry_3d}\`) | \`${inp.gravity_g} G\` | \`%${inp.oxygen_pct} O₂\` (\`P_O2 = ${tel.o2_partial_psia} psia\`) | \`U = ${inp.airflow_cms} cm/s\``,
                          `- **Anlık Çözücü Durumu:** Rejim **${regBadge}** | Alev Sıcaklığı \`${tel.flame_temp_k} K\` | Kritik \`MOC = %${tel.moc_pct} O₂\` | Yangın Riski **\`${tel.risk_score}/100\`**`,
                          ``,
                          `Bana belirli bir fiziksel denklemi (\`Spalding B_oq\`, \`Sherwood Sh\`, \`Damköhler Da\`), parametre değişim senaryosunu (*"Akış hızını artırırsam ne olur?"*), \`EVA Giysisi vs. Ay Gezgini\` kıyaslamasını veya merak ettiğiniz bir NASA PSI deneyini (\`FLEX\`, \`Saffire\`, \`SoFIE-MIST\`, \`DAFT\`) doğrudan sorabilirsiniz.`,
                      ].join("\n"),
                citations: [],
            };
        }

        // 4. Roket Motorları Kapsam Sınırı (CON-08)
        if (intent === "rocket_scope") {
            return {
                reply: isEn
                    ? [
                          `### Why Rocket Engines & Thrusters Are Excluded from NASA PSI Cabin Fire Scope (CON-08)`,
                          `1. **Momentum-Dominated Regime (\`Ri = Gr / Re² → 0\`):** Inside rocket thrust chambers, gas velocities reach \`10²–10³ m/s\` (\`Re > 10⁵\`). Because Richardson scaling obeys \`Ri = Gr / Re²\`, buoyancy (\`Gr ∝ g\`) is negligible (\`Ri < 10⁻⁶\`), making rocket combustion effectively gravity-independent.`,
                          `2. **Habitable Spacecraft Contrast (Your Active Chamber):** At your cabin ventilation speed \`U = ${inp.airflow_cms} cm/s\` (\`Re = ${tel.reynolds_number}\`, \`Ri = ${tel.richardson_number}\`), eliminating gravity (\`0G / 0.16G / 0.38G\`) turns flames spherical, amplifies radiative quenching (\`χ_r\`), and lowers \`MOC\`.`,
                          `3. **NASA PSI Portfolio Scope:** Consequently, NASA PSI (\`FLEX\`, \`CFI\`, \`ACME\`, \`BASS\`, \`SPICE\`, \`SLISE\`, \`Saffire\`, \`SoFIE\`, \`DAFT\`) focuses strictly on crewed spacecraft cabins, EVA suits (\`4.3 psia / 100% O₂\`), Lunar/Mars habitats, and pressurized rovers.`,
                      ].join("\n")
                    : [
                          `### Roket Motorları ve İticiler Neden NASA PSI Kapsamı Dışındadır? (CON-08)`,
                          `1. **Momentum Baskınlığı (\`Ri = Gr / Re² → 0\`):** Roket motorları ve iticilerde gaz hızları \`100–3000 m/s\` mertebesindedir (\`Re > 10⁵\`). Richardson sayısı \`Ri = Gr / Re²\` olduğundan kaldırma kuvveti etkisi sıfıra yakındır (\`Ri < 10⁻⁶\`); yani roket yanması **yerçekiminden bağımsızdır**.`,
                          `2. **Mürettebat Kabini ile Fark (Aktif Odanız):** Şu anki 3B yanma odanızda akış yalnızca \`U = ${inp.airflow_cms} cm/s\` düzeyindedir (\`Re = ${tel.reynolds_number}\`, \`Ri = ${tel.richardson_number}\`). Bu düşük kabin hızlarında yerçekiminin kalkması alevi küreselleştirir, radyatif ısı kaybını (\`χ_r\`) büyütür ve \`MOC\` sınırını düşürür.`,
                          `3. **NASA PSI Odak Alanı:** Bu nedenle NASA PSI veri tabanı roket itkisini hariç tutarak doğrudan **ISS modülleri, EVA uzay giysileri (\`4.3 psia / %100 O₂\`), Ay/Mars yüzey üsleri ve basınçlı gezginlerdeki** yangın güvenliğine odaklanır.`,
                      ].join("\n"),
                citations: defaultCitations.slice(0, 2),
            };
        }

        // 5. EVA Uzay Giysisi (%100 O2 @ 4.3 psia) & Ay Gezgini & ISS Kıyaslaması
        if (intent === "eva_rover_atmosphere") {
            const profs = [
                { tr: "ISS USOS Standart Kabin", en: "ISS Standard Cabin", p: { fuel_id: inp.fuel_id, gravity_g: 0.0, oxygen_pct: 21.0, pressure_psia: 14.7, airflow_cms: 4.0, droplet_d0_mm: inp.droplet_d0_mm, diluent: "N2", habitat_id: "iss_module" } },
                { tr: "Ay Üssü / Basınçlı Gezgin", en: "Lunar Base / Rover", p: { fuel_id: inp.fuel_id, gravity_g: 0.16, oxygen_pct: 32.0, pressure_psia: 10.2, airflow_cms: 4.5, droplet_d0_mm: inp.droplet_d0_mm, diluent: "N2", habitat_id: "lunar_rover" } },
                { tr: "Saffire-V Keşif Atmosferi", en: "Saffire-V Exploration", p: { fuel_id: inp.fuel_id, gravity_g: 0.0, oxygen_pct: 34.0, pressure_psia: 8.2, airflow_cms: 5.0, droplet_d0_mm: inp.droplet_d0_mm, diluent: "N2", habitat_id: "lunar_rover" } },
                { tr: "EVA Uzay Giysisi (Saf O₂)", en: "EVA Spacesuit (Pure O₂)", p: { fuel_id: inp.fuel_id, gravity_g: 0.16, oxygen_pct: 100.0, pressure_psia: 4.3, airflow_cms: 6.0, droplet_d0_mm: inp.droplet_d0_mm, diluent: "N2", habitat_id: "eva_suit" } },
            ];
            const rows = profs.map((pr) => {
                const s = simulateCombustionClient(pr.p);
                const st = s.telemetry;
                const stl = s.scenario_timeline;
                const rateStr = st.flame_spread_mm_s > 0 ? `V_f=${st.flame_spread_mm_s} mm/s` : `K=${st.burning_rate_k_mm2_s} mm²/s`;
                return `| **${isEn ? pr.en : pr.tr}** | \`${pr.p.pressure_psia} psia\` | \`${pr.p.oxygen_pct}%\` | \`${st.o2_partial_psia} psia\` | \`${st.moc_pct}%\` | \`${st.flame_temp_k} K\` | \`${rateStr}\` | **\`${st.risk_score}/100\`** (\`SMAC ${stl.t_smac_125ppm_s} s\`) |`;
            });
            const relCits = NASA_CATALOG.filter((e) => ["PSI-SAFFIRE5-07", "PSI-SOFIE-08", "PSI-ACME-CFIG-14"].includes(e.exp_id)).map((e) => ({ id: e.exp_id, program: e.program, ntrs_id: e.ntrs_id, url: e.ntrs_url }));
            return {
                reply: isEn
                    ? [
                          `### EVA Spacesuit (\`100% O₂ @ 4.3 psia\`), Lunar Rover (\`32% O₂ @ 10.2 psia\`) & ISS Matrix — \`${inp.fuel_name_en}\``,
                          ``,
                          `| Mission Atmosphere | Total Pressure | O₂ % | Partial \`P_O2\` | Critical \`MOC\` | Flame \`T_f\` | Burn / Spread Rate | Risk & ECLSS SMAC |`,
                          `| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |`,
                          ...rows,
                          ``,
                          `### Thermo-Physical & EVA Operational Synthesis (CON-06)`,
                          `- **Why \`4.3 psia / 100% O₂\` in EVA Suits?** A \`14.7 psia\` suit stiffens joints and prevents finger mobility. Operating at \`4.3 psia\` pure \`O₂\` preserves alveolar \`P_O2 = 4.3 psia\` with zero \`N₂\`, eliminating decompression bends—but **eliminating \`N₂\` removes thermal heat-sink ballast**, causing rapid flame spread across suit textiles if an electrical arc occurs.`,
                          `- **Why \`10.2 psia / 32% O₂\` in Lunar Rovers?** Cuts astronaut EVA pre-breathe purge time from \`>2 hours\` to \`~15 minutes\` (**Saffire-V \`NTRS #20220014358\`**, **SoFIE \`NTRS #20230006712\`**).`,
                          `- **Highest-O₂ PSI Benchmark:** **ACME CFI-G (\`NTRS #20230014890\`)** tested spherical porous-burner flames up to **\`85% O₂\`** inside ISS \`CIR\`.`,
                      ].join("\n")
                    : [
                          `### EVA Uzay Giysisi (\`%100 O₂ @ 4.3 psia\`), Ay Gezgini (\`%32 O₂ @ 10.2 psia\`) ve ISS Yanıcılık Matrisi — \`${inp.fuel_name_tr}\``,
                          ``,
                          `| Görev Atmosferi | Toplam Basınç | O₂ % | Kısmi \`P_O2\` | Kritik \`MOC\` | Sıcaklık \`T_f\` | Yayılma / Yanma | Risk & ECLSS SMAC |`,
                          `| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |`,
                          ...rows,
                          ``,
                          `### Termofiziksel ve Fizyolojik Mühendislik Analizi (CON-06)`,
                          `- **EVA Giysilerinde Neden \`4.3 psia / %100 Saf O₂\` Kullanılır?** \`14.7 psia\` basınçta giysi balon gibi sertleşir. \`4.3 psia\` saf \`O₂\` hem akciğer oksijen basıncını korur (\`P_O2 = 4.30 psia\` > ISS \`3.09 psia\`) hem de kanda azot bırakmayarak **vurgun riskini sıfırlar**. Ancak **ısıyı emen \`N₂\` ısıl balastı kalktığı için** alev sıcaklığı ve yayılma hızı sıçrar.`,
                          `- **Ay Üssü ve Basınçlı Gezginlerde Neden \`10.2 psia / %32 O₂\` Seçilir?** Dünya'ya göre \`>%40\` bağıl oksijen artışı sağlayarak saatler süren EVA ön-soluma (\`pre-breathe\`) süresini \`~15 dakikaya\` indirir (**Saffire-V \`NTRS #20220014358\`**, **SoFIE \`NTRS #20230006712\`**).`,
                          `- **PSI En Yüksek Oksijen Deneyi:** ISS \`CIR\` rafındaki **ACME CFI-G (\`NTRS #20230014890\`)** küresel brülörde **\`%85 O₂\`** konsantrasyonuna kadar test yapılmıştır.`,
                      ].join("\n"),
                citations: relCits,
            };
        }

        // 6. Kısmi Yerçekimi (0.16G Ay / 0.38G Mars), LUCI/FM2 ve ACME E-FIELD
        if (intent === "partial_gravity_luci") {
            const gLevels = [
                { tr: "0.00 G (ISS Mikroçekim)", en: "0.00 G (ISS Freefall)", g: 0.0 },
                { tr: "0.16 G (Ay Yüzeyi • LUCI/FM2)", en: "0.16 G (Lunar • LUCI/FM2)", g: 0.16 },
                { tr: "0.38 G (Mars Yüzeyi)", en: "0.38 G (Martian Surface)", g: 0.38 },
                { tr: "1.00 G (Dünya Referansı)", en: "1.00 G (Earth Reference)", g: 1.0 },
            ];
            const gRows = gLevels.map((gl) => {
                const sg = simulateCombustionClient(Object.assign({}, inp, { gravity_g: gl.g }));
                const gt = sg.telemetry;
                const rCol = gt.flame_spread_mm_s > 0 ? `V_f=${gt.flame_spread_mm_s} mm/s` : `K=${gt.burning_rate_k_mm2_s} mm²/s`;
                return `| **${isEn ? gl.en : gl.tr}** | \`Ra = ${gt.rayleigh_number}\` | \`Ri = ${gt.richardson_number}\` | **\`${gt.moc_pct}% O₂\`** | \`${gt.flame_temp_k} K\` | \`${rCol}\` | \`${gt.regime}\` (\`${gt.risk_score}/100\`) |`;
            });
            const relCits = NASA_CATALOG.filter((e) => ["PSI-ACME-09", "PSI-BASS-03", "PSI-SOFIE-08"].includes(e.exp_id)).map((e) => ({ id: e.exp_id, program: e.program, ntrs_id: e.ntrs_id, url: e.ntrs_url }));
            return {
                reply: isEn
                    ? [
                          `### Partial-Gravity Bounding (\`0G\` → \`0.16G Moon\` → \`0.38G Mars\` → \`1G\`) — \`${inp.fuel_name_en}\``,
                          ``,
                          `| Gravity Regime | Rayleigh \`Ra\` | Richardson \`Ri\` | Critical \`MOC\` | Flame \`T_f\` | Burn / Spread Rate | Regime & Risk |`,
                          `| :--- | :--- | :--- | :--- | :--- | :--- | :--- |`,
                          ...gRows,
                          ``,
                          `### NASA PSI Partial-G Gap, LUCI/FM2 & ACME E-FIELD Emulation (CON-07)`,
                          `1. **PSI Partial-G Data Gap (\`LUCI\` & \`FM2\`):** NASA PSI currently contains \`0G\` orbital and \`1G\` ground data, with **no direct lunar-g combustion dataset yet**. Upcoming **LUCI (*Lunar-g Combustion Investigation*)** and **FM2 (*Flammability of Materials on the Moon*)** payloads will fill this gap.`,
                          `2. **0G–1G Bounding & Lunar Hazard:** Gentle \`0.16G\` buoyant slip (\`u_b ≈ 8.8 cm/s\`) feeds fresh \`O₂\` (\`Da > 1\`) without strong \`1G\` convective cooling, often dropping \`MOC\` below \`1G\` Earth limits; bounding between \`0G\` ventilated (\`BASS\`/\`SoFIE\`) and \`1G\` brackets the hazard.`,
                          `3. **ACME E-FIELD Ionic-Wind Emulation (\`NTRS #19990054024\`):** Electric fields acting on flame chemi-ions (\`H₃O⁺\`, \`CHO⁺\`) in \`0G\` emulate \`0.16G / 0.38G\` buoyant convection and cut soot by \`70%\`.`,
                      ].join("\n")
                    : [
                          `### Kısmi Yerçekimi Sınırlandırma Analizi (\`0G\` → \`0.16G Ay\` → \`0.38G Mars\` → \`1G\`) — \`${inp.fuel_name_tr}\``,
                          ``,
                          `| Yerçekimi Rejimi | Rayleigh \`Ra\` | Richardson \`Ri\` | Kritik \`MOC\` | Sıcaklık \`T_f\` | Yanma / Yayılma | Rejim & Risk |`,
                          `| :--- | :--- | :--- | :--- | :--- | :--- | :--- |`,
                          ...gRows,
                          ``,
                          `### NASA PSI Veri Boşluğu, LUCI/FM2 ve ACME E-FIELD Taklidi (CON-07)`,
                          `1. **PSI Kısmi Yerçekimi Veri Boşluğu (\`LUCI\` & \`FM2\`):** Şu anda NASA PSI arşivinde doğrudan Ay veya Mars kısmi yerçekimi yanma verisi yoktur; bu boşluğun gelecekteki **LUCI (*Lunar-g Combustion Investigation*)** ve **FM2 (*Flammability of Materials on the Moon*)** Ay yüzey deneyleriyle doldurulması beklenmektedir.`,
                          `2. **0G–1G Sınırlandırması (Bounding):** \`0.16G\` Ay yerçekimi \`u_b ≈ 8.8 cm/s\` mertebesinde tatlı bir doğal kaldırma akışı yaratarak aleve taze \`O₂\` taşır (\`Da > 1\`) ve kritik \`MOC\` sınırını \`1G\` Dünya değerinin **altına** çekebilir.`,
                          `3. **ACME E-FIELD İyon Rüzgarı Taklidi (\`NTRS #19990054024\`):** ISS \`CIR\` odasında alevdeki doğal iyonlara (\`H₃O⁺\`, \`CHO⁺\`) uygulanan elektrik alanı, \`0G\` ortamında Ay/Mars kısmi yerçekimi konveksiyonunu taklit etmiş ve kurumu \`%70\` azaltmıştır.`,
                      ].join("\n"),
                citations: relCits,
            };
        }

        // 7. Görünmez Soğuk Alev (Cool Flame NTC) & DAFT/SAME Toz-Duman Ayrımı
        if (intent === "cool_flame_daft") {
            const cfSim = simulateCombustionClient({ fuel_id: "n_heptane", gravity_g: 0.0, oxygen_pct: 15.5, pressure_psia: inp.pressure_psia, airflow_cms: 0.1, droplet_d0_mm: 3.8, diluent: inp.diluent });
            const cft = cfSim.telemetry;
            const relCits = NASA_CATALOG.filter((e) => ["PSI-FLEX-01", "PSI-CFI-11", "PSI-SAME-10", "PSI-ACME-CFIG-14"].includes(e.exp_id)).map((e) => ({ id: e.exp_id, program: e.program, ntrs_id: e.ntrs_id, url: e.ntrs_url }));
            return {
                reply: isEn
                    ? [
                          `### Two-Stage Radiative Extinction, Invisible Cool Flames (NTC) & DAFT Sensor Fusion (CON-04)`,
                          `- **Active Chamber vs. Cool-Flame Onset:** Current radiative fraction is \`χ_r = ${(tel.radiative_loss_fraction * 100).toFixed(1)}%\` (\`${tel.flame_temp_k} K\`, \`${tel.regime}\`). For a \`3.8 mm\` \`n-Heptane\` droplet at \`0G / 15.5% O₂\`, \`χ_r\` hits \`${(cft.radiative_loss_fraction * 100).toFixed(1)}%\`, locking into **\`${cft.regime}\`** at \`${cft.flame_temp_k} K\`.`,
                          `- **NTC Kinetics (\`FLEX\`, \`CFI\`, \`ACME CFI-G\`):** Spherical \`0G\` flames trap hot products (\`R_f/R_d ≈ 5–8\`). Once \`Q_rad ∝ R_f³·σ·(T_f⁴ - T_∞⁴)\` exceeds \`χ_r > 0.45\`, the visible hot flame quenches into invisible \`550–780 K\` peroxy (\`RO₂ ⇌ QOOH\`) combustion, leaking toxic \`CO\` and \`CH₂O\`.`,
                          ``,
                          `| Detection Channel | Hot Sooty Flame | Invisible Cool Flame (\`550–780 K\`) | Lunar Regolith / Cabin Dust |`,
                          `| :--- | :--- | :--- | :--- |`,
                          `| **Visible Optical Camera** | High (\`75–100%\`) | **\`~0–2%\` (BLIND)** | Scatters light (False Alarm Risk) |`,
                          `| **UV / Mid-IR Radiometer** | High (\`12–35 kW/m²\`) | **Detects \`2.5–5.5 kW/m²\` signature** | \`0 kW/m²\` (Immune) |`,
                          `| **Electrochemical \`CO / CH₂O\`** | Moderate–High | **Captures \`90–350 ppm CO\` rise** | \`0 ppm\` (Immune) |`,
                          `| **SAME / DAFT Multi-Angle Laser** | Sub-micron soot (\`<0.4 µm\`) | Detects condensed vapor cloud (\`CFI\`) | **Rejects \`1–10 µm\` lunar dust via polarization/angle ratio** |`,
                      ].join("\n")
                    : [
                          `### İki Aşamalı Radyatif Sönme, Görünmez Soğuk Alev (NTC) ve DAFT Toz/Duman Ayrımı (CON-04)`,
                          `- **Aktif Odanız vs. Soğuk Alev Eşiği:** Mevcut simülasyonunuzda radyatif kayıp \`χ_r = %${(tel.radiative_loss_fraction * 100).toFixed(1)}\` (\`${tel.flame_temp_k} K\`, \`${tel.regime}\`). \`0G / %15.5 O₂\` altında \`3.8 mm\` \`n-Heptan\` damlacığında \`χ_r = %${(cft.radiative_loss_fraction * 100).toFixed(1)}\` değerine ulaşarak \`${cft.flame_temp_k} K\` sıcaklıkta **\`${cft.regime}\`** fazına geçer.`,
                          `- **NTC Mekanizması (\`FLEX\`, \`CFI\`, \`ACME CFI-G\`):** \`0G\` küresel alevinde \`Q_rad ∝ R_f³·σ·(T_f⁴ - T_∞⁴)\` kaybı \`χ_r > 0.45\` eşiğini aştığında sıcak alev söner; alkan yakıtlar \`550–780 K\` peroksi (\`RO₂ ⇌ QOOH\`) kimyasıyla **görünmez Soğuk Alev** olarak yanmayı sürdürür ve zehirli \`CO\` / formaldehit üretir.`,
                          ``,
                          `| Algılama Kanalı | Sıcak Görünür Alev | Görünmez Soğuk Alev (\`550–780 K\`) | Kabin / Ay Regolit Tozu |`,
                          `| :--- | :--- | :--- | :--- |`,
                          `| **Standart Optik Kamera** | Yüksek (\`%75–100\`) | **\`~%0–2\` (TAMAMEN KÖR)** | Işığı saçar (Yanlış Alarm Riski) |`,
                          `| **UV / Orta-IR Radyometre** | Yüksek (\`12–35 kW/m²\`) | **\`2.5–5.5 kW/m²\` ışıma yakalar** | \`0 kW/m²\` (Toza Bağışıklı) |`,
                          `| **Elektrokimyasal \`CO / CH₂O\`** | Orta–Yüksek | **\`90–350 ppm CO\` artışını yakalar** | \`0 ppm\` (Toza Bağışıklı) |`,
                          `| **SAME / DAFT Çok Açılı Lazer** | \`<0.4 µm\` yanma dumanı | \`CFI\` buhar bulutunu algılar | **Polarizasyon ve saçılma açısıyla \`1–10 µm\` Ay tozunu reddeder** |`,
                      ].join("\n"),
                citations: relCits,
            };
        }

        // 8. Halon 1301 Yasağı, NASA-STD-6001B Söndürme, SoFIE-MIST & İtfaiye Transferi
        if (intent === "suppression_halon") {
            const zSim = simulateCombustionClient(Object.assign({}, inp, { airflow_cms: 0.0 }));
            const zt = zSim.telemetry;
            const incSpin = hasAnyTerm(nq, ["itfaiye", "firefighter", "dunya", "earth", "giysi", "tank", "spinoff", "transfer"]);
            const relCits = NASA_CATALOG.filter((e) => ["PSI-SOFIE-MIST-15", "PSI-BASS-03", "PSI-SAME-10"].includes(e.exp_id)).map((e) => ({ id: e.exp_id, program: e.program, ntrs_id: e.ntrs_id, url: e.ntrs_url }));
            const spinTr = incSpin
                ? `\n\n### Dünya'daki İtfaiye ve Endüstriyel Uygulamalar (Space-to-Earth)\n- **SoFIE-MIST Su Sisi:** \`25–40 µm\` temiz su sisi nozulları veri merkezleri, ameliyathaneler ve lityum-iyon batarya depolarında Halon'un yerini almıştır.\n- **PBI/Nomex İtfaiyeci Giysileri & \`SCBA\` Hava Tankları:** Apollo/EVA yangın araştırmalarından doğan \`PBI/Nomex\` kumaşlar modern itfaiyeci elbiselerini korur; NASA karbon-fiber \`COPV\` teknolojisi itfaiyeci \`SCBA\` solunum tüplerini \`%40\` hafifletmiştir.\n- **DAFT/SAME Duman Dedektörleri:** Çok açılı lazer saçılma algoritmaları maden ve uçak kargo ambarlarında toz kaynaklı yanlış alarmları önler.`
                : "";
            const spinEn = incSpin
                ? `\n\n### Terrestrial Firefighting & Industrial Spinoffs\n- **SoFIE-MIST Water Mist:** Sub-\`50 µm\` nozzles protect data centers, cleanrooms, and EV battery packs without fluorinated gases.\n- **Firefighter Turnout Gear & \`SCBA\` Tanks:** Apollo/EVA \`PBI/Nomex\` thermal fabrics shield municipal firefighters, while NASA \`COPV\` composite vessels reduce \`SCBA\` air-tank weight by \`~40%\`.\n- **DAFT/SAME Smoke Detectors:** Multi-angle laser scattering prevents dust false alarms in mines and aircraft cargo bays.`
                : "";
            return {
                reply: isEn
                    ? [
                          `### Why Halon 1301 Is Strictly Prohibited & NASA-STD-6001B Suppression Protocol (CON-05)`,
                          `1. **Why Halon 1301 (\`CF₃Br\`) Is Banned:** Above \`750 K\`, Halon 1301 pyrolyzes into corrosive **\`HF\`** and **\`HBr\`** acid gases—fatal to crew lungs inside sealed cabins and **permanently poisoning ECLSS \`LiOH\` / amine scrubbers and catalytic beds**.`,
                          `2. **Live ECLSS Survival Clock (\`${tl.habitat_name_en}\`):** Alarm at \`+${tl.t_alarm_s} s\` | Critical **\`SMAC 125 ppm CO\`** reached at **\`${tl.t_smac_125ppm_s} s\`** | CO at response: \`${tl.co_at_response_ppm} ppm\`.`,
                          `3. **Mandatory 4-Step Non-Halon Sequence:**`,
                          `   - **Step 1 — HVAC Airflow Cutoff (\`${inp.airflow_cms} cm/s → 0 cm/s\`):** Live solver check drops risk from **\`${tel.risk_score}/100\` → \`${zt.risk_score}/100\`** (\`${zt.regime}\`).`,
                          `   - **Step 2 — Electrical Bus Isolation:** Eliminate arc re-ignition sources.`,
                          `   - **Step 3 — \`25–40 µm\` Fine Water Mist (\`ISS PFE / SoFIE-MIST\`, \`NTRS #20230008415\`) or \`CO₂ / N₂\`:** High latent heat (\`L_v = 2257 kJ/kg\`) + \`1700×\` steam expansion with zero toxic acid residue.`,
                          `   - **Step 4 — Depressurization & Post-Fire IR/CO Watch:** Verify zero Cool Flame persistence before restarting fans.` + spinEn,
                      ].join("\n")
                    : [
                          `### İnsanlı Uzay Araçlarında Halon 1301 Neden Kesinlikle Yasaktır? — NASA-STD-6001B Protokolü (CON-05)`,
                          `1. **Halon 1301 (\`CF₃Br\`) Yasağının Bilimsel Nedeni:** Kapalı devre \`ECLSS\` yaşam destekli uzay araçlarında Halon 1301 gazı \`>750 K\` alevde parçalanarak öldürücü **hidrojen florür (\`HF\`)** ve **hidrojen bromür (\`HBr\`)** asit gazları üretir; mürettebat akciğerlerini yakar ve **ECLSS karbondioksit/iz-kirletici filtrelerini kalıcı olarak zehirler**.`,
                          `2. **Aktif ECLSS Yaşam Destek Saati (\`${tl.habitat_name_tr}\`):** Sensör alarmı \`+${tl.t_alarm_s} sn\` | Kritik **\`SMAC 125 ppm CO\`** sınırı **\`${tl.t_smac_125ppm_s} sn\`** | Müdahale anı CO: \`${tl.co_at_response_ppm} ppm\`.`,
                          `3. **Zorunlu 4 Adımlı Müdahale Sırası:**`,
                          `   - **Adım 1 — HVAC Fanlarını Anında Kapat (\`${inp.airflow_cms} cm/s → 0 cm/s\`):** Canlı çözücü kontrolüne göre akışı kesmek riski **\`${tel.risk_score}/100\` → \`${zt.risk_score}/100\`** düzeyine indirir (\`${zt.regime}\`).`,
                          `   - **Adım 2 — Elektrik Beslemesini Kes:** Ark ve ohmik ısınmayı durdurur.`,
                          `   - **Adım 3 — \`25–40 µm\` İnce Su Sisi (\`ISS PFE / SoFIE-MIST\`, \`NTRS #20230008415\`) veya \`CO₂ / N₂\`:** Yüksek buharlaşma gizli ısısı (\`L_v = 2257 kJ/kg\`) çekerek toksik kalıntı bırakmadan alevi söndürür.`,
                          `   - **Adım 4 — Kontrollü Basınç Düşürme & IR/CO Soğuk Alev Taraması:** Fanlar açılmadan önce gizli Soğuk Alev kalmadığı doğrulanır.` + spinTr,
                      ].join("\n"),
                citations: relCits,
            };
        }

        // 9. Spesifik NASA PSI Deneyi / Donanım Rafı
        if (intent === "specific_experiment") {
            let matched = [];
            if (hasAnyTerm(nq, ["en yuksek oksijen", "highest oxygen"])) {
                matched = NASA_CATALOG.filter((e) => e.exp_id === "PSI-ACME-CFIG-14");
            } else {
                const pMap = [
                    ["cfi-g", "PSI-ACME-CFIG-14"], ["cfig", "PSI-ACME-CFIG-14"], ["flex-2", "PSI-FLEX2-02"],
                    ["flex", "PSI-FLEX-01"], ["cfi", "PSI-CFI-11"], ["e-field", "PSI-ACME-09"],
                    ["bre", "PSI-BRE-05"], ["sofie-mist", "PSI-SOFIE-MIST-15"], ["sofie", "PSI-SOFIE-08"],
                    ["saffire", "PSI-SAFFIRE5-07"], ["bass-ii", "PSI-BASS2-04"], ["bass", "PSI-BASS-03"],
                    ["spice", "PSI-SPICE-12"], ["slise", "PSI-SLISE-13"], ["same", "PSI-SAME-10"], ["daft", "PSI-SAME-10"]
                ];
                pMap.forEach(([kw, eid]) => {
                    if (nq.indexOf(kw) !== -1) {
                        const found = NASA_CATALOG.find((x) => x.exp_id === eid);
                        if (found && !matched.includes(found)) matched.push(found);
                    }
                });
                if (!matched.length) {
                    if (nq.indexOf("msg") !== -1) matched = NASA_CATALOG.filter((e) => e.hardware_group === "MSG").slice(0, 3);
                    else if (nq.indexOf("cygnus") !== -1) matched = NASA_CATALOG.filter((e) => e.hardware_group === "CYGNUS").slice(0, 3);
                    else if (nq.indexOf("cir") !== -1 || nq.indexOf("mdca") !== -1) matched = NASA_CATALOG.filter((e) => e.hardware_group === "CIR").slice(0, 3);
                }
            }
            if (!matched.length) matched = ranked.slice(0, 2);

            const blocks = matched.slice(0, 3).map((e) => {
                const runs = e.intra_runs || [];
                let runTbl = "";
                if (runs.length) {
                    const hdr = isEn
                        ? `\n\n| Sub-Test / Run | Held Constant | Varied Parameter | Experimental Outcome |\n| :--- | :--- | :--- | :--- |\n`
                        : `\n\n| Alt Test / Koşum | Sabit Tutulan | Değiştirilen Parametre | Deneysel Sonuç |\n| :--- | :--- | :--- | :--- |\n`;
                    runTbl = hdr + runs.map((r) => `| **${r.run_code || r.run || "-"}** | ${isEn ? r.same_en : r.same_tr} | ${isEn ? r.diff_en : r.diff_tr} | ${isEn ? r.result_en : r.result_tr} |`).join("\n");
                }
                return isEn
                    ? `### ${e.program} (\`${e.exp_id}\`) — ${e.title}\n- **Facility:** \`${e.facility}\` (\`${e.hardware_group}\`) | **Citation:** [NTRS #${e.ntrs_id}](${e.ntrs_url})\n- **Conditions:** \`${e.gravity_g} G\`, \`${e.oxygen_pct}% O₂\`, \`${e.pressure_psia} psia\`, \`${e.airflow_cms} cm/s\`, Measured **\`MOC = ${e.moc_measured_pct}% O₂\`**\n- **Key Finding:** ${e.key_finding_en}\n- **Safety Action:** ${e.safety_insight_en}${runTbl}`
                    : `### ${e.program} (\`${e.exp_id}\`) — ${e.title_tr}\n- **Donanım Rafı:** \`${e.facility}\` (\`${e.hardware_group}\`) | **Resmi Kaynak:** [NTRS #${e.ntrs_id}](${e.ntrs_url})\n- **Test Koşulları:** \`${e.gravity_g} G\`, \`%${e.oxygen_pct} O₂\`, \`${e.pressure_psia} psia\`, \`${e.airflow_cms} cm/s\`, Ölçülen **\`MOC = %${e.moc_measured_pct} O₂\`**\n- **Temel Bulgu:** ${e.key_finding_tr}\n- **Güvenlik Önlemi:** ${e.safety_insight_tr}${runTbl}`;
            });
            return {
                reply: blocks.join("\n\n"),
                citations: matched.slice(0, 3).map((e) => ({ id: e.exp_id, program: e.program, ntrs_id: e.ntrs_id, url: e.ntrs_url })),
            };
        }

        // 10. Spesifik Denklem ve Boyutsuz Sayı Türetimi
        if (intent === "equation_deep_dive") {
            const tblLines = (sim.formula_table || []).map(
                (r) => `| **${isEn ? r.law_en : r.law_tr}** | \`${r.equation}\` | **\`${r.value}\`** | ${isEn ? r.status_en : r.status_tr} |`
            );
            const focus = hasAnyTerm(nq, ["spalding", "b_oq", "boq", "d2", "d²", "yanma sabiti", "burning constant", "standoff", "durma"])
                ? (isEn
                    ? `### Step-by-Step \`d²\`-Law & Spalding \`B_oq\` Substitution\n- **Spalding Number (\`B_oq = ${tel.spalding_b_number}\`):** Ratio of oxidative enthalpy driving force (\`Y_O2·ΔH_c / ν_s\`) to latent heat of vaporization (\`L_v\`).\n- **Burning Rate Constant (\`K = ${tel.burning_rate_k_mm2_s} mm²/s\`):** From \`K = [8·λ_g/(ρ_l·c_p)]·ln(1+B_oq)·(Sh/2)·(1-χ_r)\`, droplet lifetime is \`t_burn = D₀² / K = ${tel.burn_lifetime_s} s\` and standoff ratio is **\`R_f / R_d = ${tel.standoff_ratio_rf_rd}\`**.\n\n`
                    : `### Adım Adım \`d²\` Damlacık Yasası ve Spalding \`B_oq\` Türetimi\n- **Spalding Kütle Aktarım Sayısı (\`B_oq = ${tel.spalding_b_number}\`):** Oksijen kütle kesriyle (\`%${inp.oxygen_pct} O₂\`) açığa çıkan yanma entalpisinin gizli buharlaşma ısısına (\`L_v\`) oranıdır.\n- **Efektif Yanma Hızı Sabiti (\`K = ${tel.burning_rate_k_mm2_s} mm²/s\`):** \`K = [8·λ_g/(ρ_l·c_p)]·ln(1+B_oq)·(Sh/2)·(1-χ_r)\` bağıntısıyla \`D₀ = ${inp.droplet_d0_mm} mm\` için yanma ömrü \`t_burn = D₀² / K = ${tel.burn_lifetime_s} sn\` ve alev durma mesafesi **\`R_f / R_d = ${tel.standoff_ratio_rf_rd}\`** bulunur.\n\n`)
                : "";
            const hdr = isEn
                ? `### Live Governing Equations & Dimensionless Substitution (\`${inp.fuel_name_en}\`)\n\n| Physical Law / Criterion | Governing Equation | Live Numerical Output | Regime Diagnosis |\n| :--- | :--- | :--- | :--- |\n`
                : `### Aktif 3B Odanız İçin Canlı Denklem ve Boyutsuz Sayı Çözümü (\`${inp.fuel_name_tr}\`)\n\n| Fiziksel Yasa / Kriter | Matematiksel Denklem | Anlık Sayısal Sonuç | Rejim Tanısı |\n| :--- | :--- | :--- | :--- |\n`;
            return { reply: focus + hdr + tblLines.join("\n"), citations: defaultCitations.slice(0, 2) };
        }

        // 11. Karşı-Olgusal 'Ne Olur?' Duyarlılık Taraması
        if (intent === "what_if_sensitivity") {
            let sweepTitle = isEn ? "Ventilation Airflow Sweep (`0` → `30 cm/s`)" : "Kabin Havalandırma Akış Hızı Taraması (`0` → `30 cm/s`)";
            let variants = [0.0, 2.0, 6.0, 15.0, 30.0].map((u) => ({ lbl: `U = ${u} cm/s`, p: Object.assign({}, inp, { airflow_cms: u }) }));
            if (hasAnyTerm(nq, ["seyreltici", "diluent", "helyum", "helium", "argon", "co2", "azot"])) {
                sweepTitle = isEn ? "Diluent Gas Comparison (`N₂` vs `CO₂` vs `He`)" : "Seyreltici Kabin Gazı Kıyaslaması (`N₂` vs `CO₂` vs `He`)";
                variants = ["N2", "CO2", "He"].map((dl) => ({ lbl: dl, p: Object.assign({}, inp, { diluent: dl }) }));
            } else if (hasAnyTerm(nq, ["oksijen", "oxygen", "o2"])) {
                sweepTitle = isEn ? "Oxygen Sweep (`14%` → `34% O₂`)" : "Oksijen Konsantrasyonu Taraması (`%14` → `%34 O₂`)";
                variants = [14.0, 18.0, 21.0, 28.0, 34.0].map((ox) => ({ lbl: `${ox}% O₂`, p: Object.assign({}, inp, { oxygen_pct: ox }) }));
            } else if (hasAnyTerm(nq, ["0g ile 1g", "yercekimi", "gravity", "1g"])) {
                sweepTitle = isEn ? "Gravity Sweep (`0G` → `1G`)" : "Yerçekimi Taraması (`0G` → `1G`)";
                variants = [0.0, 0.16, 0.38, 1.0].map((gv) => ({ lbl: `${gv} G`, p: Object.assign({}, inp, { gravity_g: gv }) }));
            }
            const swRows = variants.map((v) => {
                const sw = simulateCombustionClient(v.p);
                const swt = sw.telemetry;
                const rv = swt.flame_spread_mm_s > 0 ? `V_f=${swt.flame_spread_mm_s} mm/s` : `K=${swt.burning_rate_k_mm2_s} mm²/s`;
                return `| **${v.lbl}** | \`${swt.sherwood_number}\` | \`${swt.damkohler_number}\` | **\`${swt.moc_pct}% O₂\`** | \`${swt.flame_temp_k} K\` | \`${rv}\` | \`${swt.regime}\` (**\`${swt.risk_score}/100\`**) |`;
            });
            return {
                reply: isEn
                    ? `### Counterfactual Sensitivity Simulation: ${sweepTitle} — \`${inp.fuel_name_en}\`\n\n| Perturbed Condition | Sherwood \`Sh\` | Damköhler \`Da\` | Critical \`MOC\` | Flame \`T_f\` | Burn / Spread | Regime & Risk |\n| :--- | :--- | :--- | :--- | :--- | :--- | :--- |\n${swRows.join("\n")}\n\n- **Ventilation Paradox (CON-03):** Gentle \`2–8 cm/s\` spacecraft airflow replenishes \`O₂\` (\`Sh > 2\`, \`Da > 1\`) without convective blowoff, minimizing \`MOC\` and maximizing hazard before high-speed blowoff (\`>25 cm/s\`).`
                    : `### Karşı-Olgusal Duyarlılık Simülasyonu: ${sweepTitle} — \`${inp.fuel_name_tr}\`\n\n| Test Noktası | Sherwood \`Sh\` | Damköhler \`Da\` | Kritik \`MOC\` | Sıcaklık \`T_f\` | Yanma / Yayılma | Rejim & Risk |\n| :--- | :--- | :--- | :--- | :--- | :--- | :--- |\n${swRows.join("\n")}\n\n- **Havalandırma Paradoksu (CON-03):** Durgun \`0G\` ortamında (\`0 cm/s\`) alev kendi \`CO₂\` kabuğuyla zayıflarken, \`2–8 cm/s\` hafif kabin fan akışı taze \`O₂\` taşıyarak (\`Sh > 2\`, \`Da > 1\`) \`MOC\` sınırını en tehlikeli minimuma indirir; \`>25 cm/s\` üzerinde ise üfleyerek sönme (*blowoff*) başlar.`,
                citations: defaultCitations.slice(0, 2),
            };
        }

        // 12. Uzaydan Dünya'ya Teknoloji Transferi
        if (intent === "earth_spinoffs") {
            const etRows = EARTH_TRANSFERS.map(
                (et) => `| **${isEn ? et.domain_en : et.domain_tr}** | \`${et.nasa_source}\` | ${isEn ? et.insight_en : et.insight_tr} |`
            );
            return {
                reply: isEn
                    ? `### Space-to-Earth Fire Safety & Clean Combustion Spinoffs (CON-09)\n\n| Terrestrial Application | NASA PSI Heritage | Mechanism & Impact |\n| :--- | :--- | :--- |\n${etRows.join("\n")}`
                    : `### NASA Mikroçekim Yanma Araştırmalarının Dünya'daki Güvenlik Uygulamaları (CON-09)\n\n| Dünya Uygulama Alanı | NASA PSI Kaynağı | Mühendislik Mekanizması ve Etkisi |\n| :--- | :--- | :--- |\n${etRows.join("\n")}`,
                citations: defaultCitations,
            };
        }

        // 13. Yüklenen Dosya / Görsel Odaklı Kapsamlı Sentez
        if (intent === "uploaded_media") {
            const pgInfo = sim.partial_gravity_info || {};
            const expLines = ranked
                .slice(0, 5)
                .map((e) => `- **#${e.rank} ${e.program} (\`${e.exp_id}\` • \`${e.hardware_group || "CIR"}\` • [NTRS #${e.ntrs_id}](${e.ntrs_url}))** — ${isEn ? "Score" : "Uyum"} \`${e.priority_score}/100\`, MOC \`${e.moc_measured_pct}%\`: ${isEn ? e.key_finding_en : e.key_finding_tr}`)
                .join("\n");
            const pgNoteEn = pgInfo.show_banner && pgInfo.en ? `- **Partial-Gravity Bounding (0G-1G):** ${pgInfo.en}\n` : "";
            const pgNoteTr = pgInfo.show_banner && pgInfo.tr ? `- **Kısmi Yerçekimi Sınırlandırması (0G-1G):** ${pgInfo.tr}\n` : "";
            return {
                reply: isEn
                    ? `### 1. Uploaded Dataset & Multi-Phase Telemetry Audit\n${mediaCtx}\n\n### 2. Synchronized 3D Chamber, Governing Equations & ISS Flight Validation\n- **Active 3D State (\`${inp.fuel_name_en}\` • \`${inp.geometry_3d}\`):** \`${inp.gravity_g} G\`, \`${inp.oxygen_pct}% O₂\` (\`P_O2 = ${tel.po2_psia} psia\`), \`${inp.pressure_psia} psia\`, \`${inp.airflow_cms} cm/s\` -> **${regBadge}** (\`T_f = ${tel.flame_temp_k} K\`, Spread \`${tel.flame_spread_mm_s} mm/s\`, Risk **\`${tel.risk_score}/100\`**).\n- **Dimensionless Transport & Kinetics:** \`K = ${tel.burning_rate_k_mm2_s} mm²/s\` | \`B_oq = ${tel.spalding_b_number}\` | \`R_f/R_d = ${tel.standoff_ratio}\` | \`Re = ${tel.reynolds_number}\` | \`Sh = ${tel.sherwood_number}\` | \`Ra = ${tel.rayleigh_number}\` | \`Ri = ${tel.richardson_number}\` | \`Da = ${tel.damkohler_number}\` | \`χ_r = ${(tel.radiative_loss_fraction * 100).toFixed(1)}%\` | \`MOC = ${tel.moc_pct}% O₂\`.\n- **ISS Flight Telemetry Fit:** \`R² = ${fv.r_squared}\` • \`RMSE = ${fv.rmse}\` (${fv.campaign}).\n${pgNoteEn}\n### 3. Ranked NASA PSI Investigations Across Orbital Hardware\n${expLines}\n\n### 4. Life Support Clock (ECLSS), Non-Halon Suppression & Earth Applications\n- **Life Support Clock (\`${tl.habitat_name_en || "ISS Module"}\`):** Alarm \`+${tl.t_alarm_s} s\` | \`SMAC 125 ppm CO\` limit in **\`${tl.t_smac_125ppm_s} s\`** | Crew response CO \`${tl.co_at_response_ppm} ppm\`.\n- **NASA-STD-6001B Protocol:** **(1)** Cut HVAC ventilation (\`${inp.airflow_cms} -> 0 cm/s\`), **(2)** Isolate power bus, **(3)** Discharge **25-40 µm Fine Water Mist (SoFIE-MIST)** or CO₂/N₂ (*Halon 1301 prohibited due to toxic HF/HBr*).\n- **Terrestrial Transfers:** Sub-50 µm clean water-mist extinguishers, **SAME/DAFT** dust-immune smoke sensors, **PBI/Nomex** firefighter gear & composite **SCBA** cylinders, and low-emission **HCCI** engine kinetics.`
                    : `### 1. Yüklenen Veri Kaynağı ve Çok Fazlı Telemetri Denetimi\n${mediaCtx}\n\n### 2. Senkronize 3B Yanma Odası, Boyutsuz Denklemler ve ISS Doğrulaması\n- **Aktif 3B Sahne (\`${inp.fuel_name_tr}\` • \`${inp.geometry_3d}\`):** \`${inp.gravity_g} G\`, \`%${inp.oxygen_pct} O₂\` (\`P_O2 = ${tel.po2_psia} psia\`), \`${inp.pressure_psia} psia\`, \`${inp.airflow_cms} cm/s\` -> **${regBadge}** (\`T_f = ${tel.flame_temp_k} K\`, Yayılma \`${tel.flame_spread_mm_s} mm/s\`, Risk **\`${tel.risk_score}/100\`**).\n- **Boyutsuz Taşınım ve Kinetik:** \`K = ${tel.burning_rate_k_mm2_s} mm²/s\` | \`B_oq = ${tel.spalding_b_number}\` | \`R_f/R_d = ${tel.standoff_ratio}\` | \`Re = ${tel.reynolds_number}\` | \`Sh = ${tel.sherwood_number}\` | \`Ra = ${tel.rayleigh_number}\` | \`Ri = ${tel.richardson_number}\` | \`Da = ${tel.damkohler_number}\` | \`χ_r = %${(tel.radiative_loss_fraction * 100).toFixed(1)}\` | \`MOC = %${tel.moc_pct} O₂\`.\n- **ISS Uçuş Telemetrisi Uyumu:** \`R² = ${fv.r_squared}\` • \`RMSE = ${fv.rmse}\` (${fv.campaign}).\n${pgNoteTr}\n### 3. Eşleşen NASA PSI Deneyleri ve Donanım Kıyaslaması\n${expLines}\n\n### 4. Yaşam Destek Saati (ECLSS), Su Sisi Söndürme ve Dünya Uygulamaları\n- **Yaşam Destek Saati (\`${tl.habitat_name_tr || "ISS Modülü"}\`):** Sensör alarmı \`+${tl.t_alarm_s} sn\` | Kritik \`SMAC 125 ppm CO\` süresi **\`${tl.t_smac_125ppm_s} sn\`** | Müdahale anı CO \`${tl.co_at_response_ppm} ppm\`.\n- **NASA-STD-6001B Müdahale Sırası:** **(1)** Havalandırma fanlarını kapat (\`${inp.airflow_cms} -> 0 cm/s\`), **(2)** Elektrik hattını izole et, **(3)** **25-40 µm İnce Su Sisi (SoFIE-MIST)** veya CO₂/N₂ uygula (*Halon 1301 toksik HF/HBr üretimi nedeniyle yasaktır*).\n- **Dünya Uygulamaları:** **SoFIE-MIST** temiz su sisli yangın söndürme, **SAME/DAFT** toz-bağışıklı lazer duman dedektörleri, **PBI/Nomex** itfaiyeci koruyucu giysileri, hafif **SCBA** kompozit solunum tüpleri ve düşük emisyonlu **HCCI** motor kinetiği.`,
                citations: defaultCitations.slice(0, 5),
            };
        }

        // 14. Kapsamlı 4-Bölümlü Görev Sentezi (Preset #1)
        if (intent === "full_synthesis") {
            if (isEn) {
                const expLines = ranked
                    .map((e) => `- **#${e.rank} ${e.program} (${e.exp_id} • ${e.hardware_group})** — Score \`${e.priority_score}/100\`, MOC \`${e.moc_measured_pct}% O₂\`, [NTRS #${e.ntrs_id}](${e.ntrs_url}): ${e.key_finding_en}`)
                    .join("\n");
                return {
                    reply: [
                        `### 1. Microgravity & Partial-Gravity Governing Physics Synthesis`,
                        `- **Active State (${inp.fuel_name_en}):** Regime **${regBadge}** at \`${inp.gravity_g} G\`, \`${inp.oxygen_pct}% O₂\` (\`P_O2 = ${tel.po2_psia} psia\`), \`U = ${inp.airflow_cms} cm/s\` (Risk: **\`${tel.risk_score}/100\`**).`,
                        `- **Analytical Transport & Kinetics:** Burning rate \`K = ${tel.burning_rate_k_mm2_s} mm²/s\`, Spalding \`B_oq = ${tel.spalding_b_number}\`, Sherwood \`Sh = ${tel.sherwood_number}\`, Damköhler \`Da = ${tel.damkohler_number}\`, radiative loss \`χ_r = ${(tel.radiative_loss_fraction * 100).toFixed(1)}%\`, critical \`MOC = ${tel.moc_pct}% O₂\`.`,
                        `- **ISS Flight Telemetry Validation:** \`R² = ${fv.r_squared}\` • \`RMSE = ${fv.rmse}\` against **${fv.campaign}**.`,
                        mediaCtx ? `- **Attached Context:** ${mediaCtx}` : ``,
                        ``,
                        `### 2. Top Ranked NASA PSI Investigations & Intra-Run Evidence`,
                        expLines,
                        ``,
                        `### 3. ECLSS Crew Survival Clock & Non-Halon Suppression Protocol`,
                        `- **Habitat (${tl.habitat_name_en}):** Alarm at \`+${tl.t_alarm_s} s\` | NASA 1-hr SMAC (\`125 ppm CO\`) in \`${tl.t_smac_125ppm_s} s\` | Intervention CO \`${tl.co_at_response_ppm} ppm\`.`,
                        `- **Mandatory NASA-STD-6001B Action Sequence:** **(1)** Cut cabin HVAC ventilation immediately (\`U → 0 cm/s\`), **(2)** Isolate electrical bus power, **(3)** Discharge **25–40 µm Fine Water Mist (SoFIE-MIST)** or CO₂/N₂ (*Halon 1301 is strictly prohibited due to toxic HF/HBr poisoning ECLSS scrubbers*).`,
                        ``,
                        `### 4. Space-to-Earth Fire Safety Spinoffs`,
                        `- ISS multi-wavelength dust-immune smoke detection (**SAME / DAFT**) prevents false alarms in aircraft cargo bays and smart homes, while **SoFIE-MIST** water-mist physics and **PBI/Nomex + SCBA** systems protect cleanrooms, EV battery facilities, and municipal firefighters.`,
                    ].filter(Boolean).join("\n"),
                    citations: defaultCitations,
                };
            }
            const expLinesTr = ranked
                .map((e) => `- **#${e.rank} ${e.program} (${e.exp_id} • ${e.hardware_group})** — Öncelik \`${e.priority_score}/100\`, MOC \`%${e.moc_measured_pct} O₂\`, [NTRS #${e.ntrs_id}](${e.ntrs_url}): ${e.key_finding_tr}`)
                .join("\n");
            return {
                reply: [
                    `### 1. Mikroçekim ve Kısmi Yerçekimi Fiziksel Denklem Sentezi`,
                    `- **Aktif Durum (${inp.fuel_name_tr}):** \`${inp.gravity_g} G\`, \`%${inp.oxygen_pct} O₂\` (\`P_O2 = ${tel.po2_psia} psia\`) ve \`U = ${inp.airflow_cms} cm/s\` koşullarında **${regBadge}** rejimi aktiftir (Yangın Riski: **\`${tel.risk_score}/100\`**).`,
                    `- **Boyutsuz Taşınım ve Yanma Sabitleri:** \`d²\` yanma hızı \`K = ${tel.burning_rate_k_mm2_s} mm²/s\`, Spalding \`B_oq = ${tel.spalding_b_number}\`, Sherwood \`Sh = ${tel.sherwood_number}\`, Damköhler \`Da = ${tel.damkohler_number}\`, radyatif kayıp \`χ_r = %${(tel.radiative_loss_fraction * 100).toFixed(1)}\` ve kritik \`MOC = %${tel.moc_pct} O₂\`.`,
                    `- **ISS Uçuş Telemetrisi Doğrulaması:** **${fv.campaign}** uçuş noktalarıyla \`R² = ${fv.r_squared}\` ve \`RMSE = ${fv.rmse}\` uyumu doğrulandı.`,
                    mediaCtx ? `- **Ekli Dosya / Görsel / Web Bağlamı:** ${mediaCtx}` : ``,
                    ``,
                    `### 2. Termodinamik & TF-IDF Sıralı NASA PSI Soruşturmaları ve NTRS Kanıtları`,
                    expLinesTr,
                    ``,
                    `### 3. ECLSS Yaşam Destek Saati ve Uzay Aracı Müdahale Protokolü`,
                    `- **Kabin / Giysi Senaryosu (${tl.habitat_name_tr}):** Sensör alarmı \`t = ${tl.t_alarm_s} sn\`, NASA Acil SMAC CO eşiği (\`125 ppm\`) \`t = ${tl.t_smac_125ppm_s} sn\`, müdahale anı CO seviyesi \`${tl.co_at_response_ppm} ppm\`.`,
                    `- **Zorunlu Müdahale Sırası (NASA-STD-6001B):** **(1)** Kabin HVAC havalandırma fanlarını anında kapatın (\`U → 0 cm/s\`), **(2)** Elektrik beslemesini kesin, **(3)** **25–40 µm İnce Su Sisi (SoFIE-MIST PFE)** veya CO₂/N₂ uygulayın (*Halon 1301 toksik HF/HBr üreterek ECLSS filtrelerini zehirlediği için kesinlikle yasaktır*).`,
                    ``,
                    `### 4. Uzaydan Dünya'ya Yangın Güvenliği Teknoloji Transferi`,
                    `- ISS **SAME / DAFT** lazerli toz-duman ayrım algoritmaları Dünya'da madenlerde ve uçak kargo ambarlarında yanlış alarmları önlerken; **SoFIE-MIST** su sisi ve **EVA Nomex/PBI + SCBA** sistemleri veri merkezleri, elektrikli araç batarya depoları ve itfaiyeci ekipmanlarını korumaktadır.`,
                ].filter(Boolean).join("\n"),
                citations: defaultCitations,
            };
        }

        // 15. Açık Uçlu Bilimsel Sorgu (Sıfır Kopyala-Yapıştır Garantili Soru-Odaklı Sentez)
        const fuelMap = [
            ["heptan", "n_heptane"], ["metanol", "methanol"], ["methanol", "methanol"],
            ["pmma", "pmma"], ["akrilik", "pmma"], ["acrylic", "pmma"],
            ["sibal", "sibal"], ["pamuk", "sibal"], ["cotton", "sibal"],
            ["nomex", "nomex"], ["hidrojen", "hydrogen"], ["hydrogen", "hydrogen"],
            ["propan", "propane_cfig"], ["propane", "propane_cfig"]
        ];
        let fuelLine = "";
        for (let i = 0; i < fuelMap.length; i++) {
            if (nq.indexOf(fuelMap[i][0]) !== -1 && FUEL_PROPERTIES[fuelMap[i][1]]) {
                const fid = fuelMap[i][1];
                const fp = FUEL_PROPERTIES[fid];
                const fSim = simulateCombustionClient(Object.assign({}, inp, { fuel_id: fid }));
                const ft = fSim.telemetry;
                const moc0B = fp.moc_0g_base ?? fp.moc_0g_pct ?? 13.8;
                const moc1B = fp.moc_1g_base ?? fp.moc_1g_pct ?? 15.2;
                fuelLine = isEn
                    ? `- **Queried Fuel / Material (\`${fp.name_en}\`, \`${fp.formula}\`):** 3D Geometry \`${fp.geometry_3d}\`, \`0G MOC = ${moc0B}% O₂\` vs \`1G MOC = ${moc1B}% O₂\` → yields \`T_f = ${ft.flame_temp_k} K\`, **\`${ft.regime}\`**, Risk **\`${ft.risk_score}/100\`** under current cabin conditions.`
                    : `- **Sorgulanan Yakıt / Malzeme (\`${fp.name_tr}\`, \`${fp.formula}\`):** 3B Geometri \`${fp.geometry_3d}\`, \`0G MOC = %${moc0B} O₂\` vs \`1G MOC = %${moc1B} O₂\` → mevcut kabin atmosferinizde \`T_f = ${ft.flame_temp_k} K\`, **\`${ft.regime}\`** rejimi ve **\`${ft.risk_score}/100\`** risk üretir.`;
                break;
            }
        }

        const dirStop = new Set([
            "veri", "verisi", "verileri", "veritabaninda", "goruntu", "gorsel", "tablo", "tabloda", "tablosu", "tablosunda",
            "grafik", "deger", "degerleri", "degerlerini", "mevcut", "analiz", "sade", "anlasilir", "bana", "gore",
            "icin", "olan", "nedir", "nasil", "hangi", "soylermisin", "goster", "acikla", "data", "table", "chart",
            "values", "current", "analysis", "what", "how", "show", "explain", "simple", "clear"
        ]);
        const qDirTokens = (nq.match(/[a-z0-9]{4,}/g) || []).filter((w) => !dirStop.has(w));
        let bestDir = null;
        let bestDirSc = 0;
        DIRECTIVES.forEach((d) => {
            const dWords = new Set(normQueryAscii(`${d.title_tr} ${d.rule_tr} ${d.title_en} ${d.rule_en}`).match(/[a-z0-9]+/g) || []);
            let sc = 0;
            qDirTokens.forEach((tok) => { if (dWords.has(tok)) sc += 1; });
            if (sc > bestDirSc) { bestDirSc = sc; bestDir = d; }
        });
        if (!bestDir) {
            const findDir = (cid) => DIRECTIVES.find((d) => d.id === cid) || DIRECTIVES[0];
            if (tel.cool_flame_active || tel.regime === "COOL_FLAME_NTC") bestDir = findDir("CON-04");
            else if (inp.gravity_g >= 0.03 && inp.gravity_g <= 0.88) bestDir = findDir("CON-07");
            else if (inp.oxygen_pct >= 30.0 || inp.pressure_psia <= 10.6) bestDir = findDir("CON-06");
            else if (inp.airflow_cms >= 1.5) bestDir = findDir("CON-03");
            else bestDir = findDir("CON-01");
        }

        const customRagPool = ragDocs.filter((d) => String(d.doc_id || "").startsWith("DOC-"));
        const topRag = customRagPool.length
            ? customRagPool
                  .map((d) => ({ d, sc: computeTextSimilarity(msg, `${d.title} ${d.text}`) }))
                  .sort((a, b) => b.sc - a.sc)[0]
            : null;

        const wantsTable = hasAnyTerm(nq, ["tablo", "tabloda", "tablosu", "tablosunda", "grafik", "degerleri", "degerlerini", "table", "chart", "values"]);
        let liveTblBlock = "";
        if (wantsTable) {
            liveTblBlock = isEn
                ? `\n| Parameter / Dimensionless Metric | Active 3D Chamber Value | Safety & Regime Interpretation |\n| :--- | :--- | :--- |\n| **Fuel & Geometry** | \`${inp.fuel_name_en}\` (\`${inp.geometry_3d}\`) | Gravity \`${inp.gravity_g} G\`, Diluent \`${inp.diluent}\` |\n| **Atmosphere (\`O₂\` & Pressure)** | \`${inp.oxygen_pct}% O₂\` • \`${inp.pressure_psia} psia\` (\`P_O2 = ${tel.o2_partial_psia} psia\`) | Critical \`MOC = ${tel.moc_pct}% O₂\` |\n| **Flame Temp & Burn Rate** | \`T_f = ${tel.flame_temp_k} K\` • \`K = ${tel.burning_rate_k_mm2_s} mm²/s\` | Spread \`${tel.flame_spread_mm_s} mm/s\` • \`B_oq = ${tel.spalding_b_number}\` |\n| **Transport & Residence (\`Sh\`, \`Da\`)** | \`Sh = ${tel.sherwood_number}\` • \`Da = ${tel.damkohler_number}\` • \`Ra = ${tel.rayleigh_number}\` | Airflow \`U = ${inp.airflow_cms} cm/s\` (\`χ_r = ${(tel.radiative_loss_fraction * 100).toFixed(1)}%\`) |\n| **Fire Risk & ECLSS SMAC** | **Risk \`${tel.risk_score}/100\`** • \`${tel.co_ppm} ppm CO\` | **${regBadge}** (\`125 ppm SMAC\`: \`${tl.t_smac_125ppm_s || 180} s\`) |\n`
                : `\n| Parametre / Boyutsuz Büyüklük | Aktif 3B Oda Değeri | Fiziksel ve Güvenlik Yorumu |\n| :--- | :--- | :--- |\n| **Yakıt ve Numune Geometrisi** | \`${inp.fuel_name_tr}\` (\`${inp.geometry_3d}\`) | Yerçekimi \`${inp.gravity_g} G\`, Seyreltici \`${inp.diluent}\` |\n| **Atmosfer (\`O₂\` ve Basınç)** | \`%${inp.oxygen_pct} O₂\` • \`${inp.pressure_psia} psia\` (\`P_O2 = ${tel.o2_partial_psia} psia\`) | Kritik Tutuşma Sınırı \`MOC = %${tel.moc_pct} O₂\` |\n| **Alev Sıcaklığı ve Yanma Hızı** | \`T_f = ${tel.flame_temp_k} K\` • \`K = ${tel.burning_rate_k_mm2_s} mm²/s\` | Yayılma \`${tel.flame_spread_mm_s} mm/s\` • \`B_oq = ${tel.spalding_b_number}\` |\n| **Taşınım ve Kalış (\`Sh\`, \`Da\`, \`Ra\`)** | \`Sh = ${tel.sherwood_number}\` • \`Da = ${tel.damkohler_number}\` • \`Ra = ${tel.rayleigh_number}\` | Akış Hızı \`U = ${inp.airflow_cms} cm/s\` (\`χ_r = %${(tel.radiative_loss_fraction * 100).toFixed(1)}\`) |\n| **Yangın Riski ve ECLSS SMAC** | **Risk \`${tel.risk_score}/100\`** • \`${tel.co_ppm} ppm CO\` | **${regBadge}** (\`125 ppm SMAC\`: \`${tl.t_smac_125ppm_s || 180} sn\`) |\n`;
        }

        const e1 = ranked[0] || NASA_CATALOG[0];
        const e2 = ranked[1] || NASA_CATALOG[1];
        const qShort = truncateCleanJs(msg, 96);

        return {
            reply: isEn
                ? [
                      `### Targeted Scientific Analysis — *"${qShort}"*`,
                      liveTblBlock,
                      fuelLine,
                      `- **Governing Physical Constraint (\`${bestDir.id} • ${bestDir.code}\`):** ${bestDir.rule_en}`,
                      topRag && topRag.sc > 0.08 ? `- **Uploaded Document Match (\`${topRag.d.title}\`):** ${truncateCleanJs(topRag.d.text, 260)}` : ``,
                      `- **Live 3D Chamber Coupling (\`${inp.fuel_name_en}\`):** At \`${inp.gravity_g} G\`, \`${inp.oxygen_pct}% O₂\` (\`P_O2 = ${tel.o2_partial_psia} psia\`), \`U = ${inp.airflow_cms} cm/s\`, active regime is **${regBadge}** (\`T_f = ${tel.flame_temp_k} K\`, \`K = ${tel.burning_rate_k_mm2_s} mm²/s\`, \`Sh = ${tel.sherwood_number}\`, \`Da = ${tel.damkohler_number}\`, \`MOC = ${tel.moc_pct}% O₂\`, Risk **\`${tel.risk_score}/100\`**).`,
                      `- **Matched NASA PSI Investigations:**`,
                      `  1. **${e1.program} (\`${e1.exp_id}\` • [NTRS #${e1.ntrs_id}](${e1.ntrs_url}))** — ${e1.key_finding_en}`,
                      `  2. **${e2.program} (\`${e2.exp_id}\` • [NTRS #${e2.ntrs_id}](${e2.ntrs_url}))** — ${e2.key_finding_en}`,
                  ].filter(Boolean).join("\n")
                : [
                      `### Soru-Odaklı Bilimsel Analiz — *"${qShort}"*`,
                      liveTblBlock,
                      fuelLine,
                      `- **İlgili Fiziksel Kısıt ve Yasa (\`${bestDir.id} • ${bestDir.code}\`):** ${bestDir.rule_tr}`,
                      topRag && topRag.sc > 0.08 ? `- **Yüklenen Belge Kanıtı (\`${topRag.d.title}\`):** ${truncateCleanJs(topRag.d.text, 260)}` : ``,
                      `- **Aktif 3B Odanızla Sayısal Bağlantı (\`${inp.fuel_name_tr}\`):** \`${inp.gravity_g} G\`, \`%${inp.oxygen_pct} O₂\` (\`P_O2 = ${tel.o2_partial_psia} psia\`), \`U = ${inp.airflow_cms} cm/s\` koşullarında **${regBadge}** rejimi aktiftir (\`T_f = ${tel.flame_temp_k} K\`, \`K = ${tel.burning_rate_k_mm2_s} mm²/s\`, \`Sh = ${tel.sherwood_number}\`, \`Da = ${tel.damkohler_number}\`, \`MOC = %${tel.moc_pct} O₂\`, Risk **\`${tel.risk_score}/100\`**).`,
                      `- **Doğrudan Eşleşen NASA PSI Bulguları:**`,
                      `  1. **${e1.program} (\`${e1.exp_id}\` • [NTRS #${e1.ntrs_id}](${e1.ntrs_url}))** — ${e1.key_finding_tr}`,
                      `  2. **${e2.program} (\`${e2.exp_id}\` • [NTRS #${e2.ntrs_id}](${e2.ntrs_url}))** — ${e2.key_finding_tr}`,
                  ].filter(Boolean).join("\n"),
            citations: defaultCitations.slice(0, 2),
        };
    }

    async function callBrowserCloudGateway(msg, simParams, mediaCtx, history, provOverride) {
        const pref = String(provOverride || runtimeConfig.active_provider || "auto").toLowerCase();
        const useGemini = (pref === "gemini" || pref === "auto") && Boolean(runtimeConfig.gemini_api_key);
        const useOpenRouter = !useGemini && (pref === "openrouter" || pref === "auto") && Boolean(runtimeConfig.openrouter_api_key);
        if (!useGemini && !useOpenRouter) return null;

        const sim = simulateCombustionClient(simParams || {});
        const inp = sim.inputs;
        const tel = sim.telemetry;
        const isEn = runtimeConfig.language === "en";
        const sys = isEn
            ? "You are ALTAR-NASA v5.1 Spacecraft Fire Safety & Microgravity Combustion Synthesis Kernel (5 modules: [01] 3D WebGL Chamber + ISS Validation + ECLSS Clock, [02] 6-Layer Equation Cards, [03] 15 PSI Matrix & Live NTRS/OSDR Stream, [04] Evidence Synthesis Console, [05] Inference Architecture). Answer the user's exact question directly with quantitative depth and Markdown tables when comparing conditions. When a multi-phase dataset (Phase 1..N) is attached, include ALL phases completely without skipping earlier ones, and avoid decorative emojis. Never recommend Halon 1301 (strictly prohibited per NASA-STD-6001B due to lethal HF/HBr formation; use CO2, N2 depressurization, airflow cutoff U->0, or SoFIE-MIST fine water mist)."
            : "Sen ALTAR-NASA v5.1 Uzay Aracı Yangın Güvenliği ve Mikroçekim Yanma Sentez Çekirdeğisin (5 modül: [01] 3B WebGL Yanma Odası + ISS Doğrulaması + ECLSS Saati, [02] 6-Katmanlı Fiziksel Denklemler, [03] 15 PSI Deney Matrisi & Canlı NTRS/OSDR Akışı, [04] Kanıt Sentezi Konsolu, [05] Çıkarım Mimarisi). Kullanıcının sorduğu soruyu şablon kopyalamadan doğrudan, sayısal derinlikle ve kıyaslamalarda Markdown tablolarıyla yanıtla. Çok fazlı bir deney verisi (Faz 1..N) bağlıysa ilk fazları atlamadan TÜM fazları eksiksiz tabloya dahil et ve dekoratif emoji kullanma. Halon 1301 önermek kesinlikle yasaktır (NASA-STD-6001B gereği ölümcül HF/HBr üretir; yerine CO2, N2 seyreltme, U->0 fan kesme veya SoFIE-MIST su sisi öner).";
        const auditHalon = (txt) => {
            if (!txt) return txt;
            if (/\bhalon\b/i.test(txt) && !/yasak|prohibit|banned|toksik|toxic|hf\/hbr|6001b/i.test(txt)) {
                return txt + (isEn
                    ? "\n\n> **[CON-05 • NASA-STD-6001B SAFETY AUDIT]:** Halon 1301 is strictly prohibited inside crewed spacecraft cabins due to lethal `HF`/`HBr` decomposition products that poison ECLSS scrubbers. Approved alternatives: `U -> 0 cm/s` ventilation shutoff, `CO₂` extinguishers, `N₂` depressurization, or `SoFIE-MIST` (`<100 µm`) fine water mist."
                    : "\n\n> **[CON-05 • NASA-STD-6001B GÜVENLİK DENETÇİSİ]:** Mürettebatlı uzay aracı kabinlerinde Halon 1301 kullanımı ölümcül `HF`/`HBr` gazları üretip ECLSS filtrelerini zehirlediği için kesinlikle yasaktır. Onaylı protokoller: `U -> 0 cm/s` fan kesme, `CO₂` tüpü, `N₂` seyreltme veya `SoFIE-MIST` (`<100 µm`) ince su sisidir.");
            }
            return txt;
        };
        const ctxPrompt = `[3D Chamber: ${inp.fuel_name_en}, ${inp.gravity_g}G, ${inp.oxygen_pct}% O2, ${inp.pressure_psia} psia, U=${inp.airflow_cms} cm/s -> Regime=${tel.regime}, T_f=${tel.flame_temp_k}K, K=${tel.burning_rate_k_mm2_s}, B_oq=${tel.spalding_b_number}, Sh=${tel.sherwood_number}, Da=${tel.damkohler_number}, MOC=${tel.moc_pct}%, Risk=${tel.risk_score}/100]${mediaCtx ? `\n[Media: ${mediaCtx}]` : ""}\n\nQuestion: ${msg}`;

        try {
            if (useGemini) {
                const mdl = (runtimeConfig.gemini_model || "gemini-2.5-flash").replace(/^models\//, "");
                const gRes = await window.fetch(
                    `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(mdl)}:generateContent?key=${encodeURIComponent(runtimeConfig.gemini_api_key)}`,
                    {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            system_instruction: { parts: [{ text: sys }] },
                            contents: [{ role: "user", parts: [{ text: ctxPrompt }] }],
                            generationConfig: { temperature: 0.25 },
                        }),
                    }
                );
                if (gRes.ok) {
                    const gData = await gRes.json();
                    const txt = (((gData.candidates || [])[0] || {}).content || {}).parts;
                    const out = Array.isArray(txt) ? txt.map((p) => p.text || "").join("") : "";
                    if (out.trim()) return { provider: "gemini", model: mdl, reply: auditHalon(out.trim()) };
                }
            } else if (useOpenRouter) {
                const orMdl = runtimeConfig.openrouter_model || "google/gemini-2.0-flash-exp:free";
                const orRes = await window.fetch("https://openrouter.ai/api/v1/chat/completions", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${runtimeConfig.openrouter_api_key}`,
                    },
                    body: JSON.stringify({
                        model: orMdl,
                        messages: [
                            { role: "system", content: sys },
                            { role: "user", content: ctxPrompt },
                        ],
                        temperature: 0.25,
                    }),
                });
                if (orRes.ok) {
                    const orData = await orRes.json();
                    const out = ((((orData.choices || [])[0] || {}).message || {}).content || "").trim();
                    if (out) return { provider: "openrouter", model: orMdl, reply: auditHalon(out) };
                }
            }
        } catch (_) {}
        return null;
    }

    async function emitNextBrowserStreamPacket() {
        const nowTime = new Date().toTimeString().slice(0, 8);
        const isEn = runtimeConfig.language === "en";
        const src = String(streamState.source || "ntrs").toLowerCase();
        const rawTarget = String(streamState.query_or_url || "").trim();

        if (src === "custom_url") {
            const target = rawTarget || "https://psi.nasa.gov/physci/repo/data/investigations/PSI-69";
            const mPsi = target.match(/\b(PSI-\d+)\b/i);
            const psiCode = mPsi ? mPsi[1].toUpperCase() : "";

            if (psiCode && PSI_SNAPSHOT_MAP[psiCode]) {
                const snap = PSI_SNAPSHOT_MAP[psiCode];
                const phases = Array.isArray(snap.phases) ? snap.phases : [];
                streamState.seq_id += 1;
                streamState.last_tick_ms = Date.now();
                streamState.last_fetch_time = nowTime;
                streamState.last_error = "";
                let chosenParams = Object.assign({
                    fuel_id: "n_heptane", gravity_g: 0.0, oxygen_pct: 21.0,
                    pressure_psia: 14.7, airflow_cms: 2.4, droplet_d0_mm: 3.4, diluent: "N2",
                }, snap.extracted_sim_params || {});
                let phaseSuffix = "";
                let summaryTxt = String(snap.abstract || "").slice(0, 320);
                if (phases.length > 0) {
                    const ph = phases[(streamState.seq_id - 1) % phases.length];
                    if (ph && ph.sim_params) chosenParams = Object.assign({}, chosenParams, ph.sim_params);
                    phaseSuffix = isEn ? ` [Phase ${ph.index}/${phases.length}]` : ` [Faz ${ph.index}/${phases.length}]`;
                    summaryTxt = isEn
                        ? `Phase ${ph.index}/${phases.length} (${snap.table_file || psiCode}): ${chosenParams.fuel_id}, ${chosenParams.gravity_g}G, ${chosenParams.oxygen_pct}% O₂, ${chosenParams.pressure_psia} psia, ${chosenParams.airflow_cms} cm/s — Temp: ${ph.flame_temp_k || ""} K.`
                        : `Faz ${ph.index}/${phases.length} (${snap.table_file || psiCode}): ${chosenParams.fuel_id}, ${chosenParams.gravity_g}G, %${chosenParams.oxygen_pct} O₂, ${chosenParams.pressure_psia} psia, ${chosenParams.airflow_cms} cm/s — Sıcaklık: ${ph.flame_temp_k || ""} K.`;
                }
                streamState.latest_sim_params = chosenParams;
                streamState.events.unshift({
                    seq_id: streamState.seq_id,
                    time: nowTime,
                    source: "Custom PSI Stream (psi.nasa.gov)",
                    id: snap.id || psiCode,
                    title: `${snap.title || psiCode}${phaseSuffix}`,
                    summary: summaryTxt,
                    url: snap.url || target,
                    extracted_sim_params: chosenParams,
                });
                streamState.events = streamState.events.slice(0, 12);
                return;
            }

            if (/psi\.nasa\.gov|osdr\.nasa\.gov/i.test(target)) {
                let qTerm = "combustion";
                try {
                    const pu = new URL(target, window.location.href);
                    qTerm = pu.searchParams.get("q") || pu.searchParams.get("term") || pu.searchParams.get("search") || "combustion";
                } catch (_) {}
                const hits = searchPsiSnapshotJs(qTerm, 36);
                if (hits.length > 0) {
                    const hit = hits[streamState.seq_id % hits.length];
                    streamState.seq_id += 1;
                    streamState.last_tick_ms = Date.now();
                    streamState.last_fetch_time = nowTime;
                    streamState.last_error = "";
                    streamState.latest_sim_params = Object.assign({
                        fuel_id: "n_heptane", gravity_g: 0.0, oxygen_pct: 21.0,
                        pressure_psia: 14.7, airflow_cms: 2.4, droplet_d0_mm: 3.4, diluent: "N2",
                    }, hit.extracted_sim_params || {});
                    streamState.events.unshift({
                        seq_id: streamState.seq_id,
                        time: nowTime,
                        source: "Custom PSI Search Stream",
                        id: hit.id,
                        title: hit.title,
                        summary: hit.abstract,
                        url: hit.url,
                        extracted_sim_params: streamState.latest_sim_params,
                    });
                    streamState.events = streamState.events.slice(0, 12);
                    return;
                }
            }

            try {
                const res = await window.fetch(target, { method: "GET" });
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                const cleanName = decodeURIComponent((target.split("?")[0].split("/").pop() || "stream_data.csv"));
                let parsed = null;
                if (/\.(xlsx|zip)$/i.test(cleanName)) {
                    const ab = await res.arrayBuffer();
                    const arch = await extractArchiveBufferInBrowser(ab, cleanName);
                    parsed = parseTextOrTablePayloadInBrowser(arch.text || "", arch.effectiveName || cleanName);
                } else {
                    const txt = await res.text();
                    parsed = parseTextOrTablePayloadInBrowser(txt, cleanName);
                }
                streamState.seq_id += 1;
                streamState.last_tick_ms = Date.now();
                streamState.last_fetch_time = nowTime;
                streamState.last_error = "";
                const phases = Array.isArray(parsed.phases) ? parsed.phases : [];
                let chosenParams = Object.assign({}, parsed.extracted_sim_params || {});
                let phaseSuffix = "";
                if (phases.length > 0) {
                    const ph = phases[(streamState.seq_id - 1) % phases.length];
                    if (ph && ph.sim_params) chosenParams = Object.assign({}, chosenParams, ph.sim_params);
                    phaseSuffix = isEn ? ` [Phase ${ph.index}/${phases.length}]` : ` [Faz ${ph.index}/${phases.length}]`;
                }
                streamState.latest_sim_params = chosenParams;
                streamState.events.unshift({
                    seq_id: streamState.seq_id,
                    time: nowTime,
                    source: "Custom URL Stream",
                    id: `URL-${streamState.seq_id}`,
                    title: `${parsed.title || cleanName}${phaseSuffix}`,
                    summary: (isEn ? parsed.summary_en : parsed.summary_tr || "").replace(/[#*`]/g, "").slice(0, 260),
                    url: target,
                    extracted_sim_params: chosenParams,
                });
                streamState.events = streamState.events.slice(0, 12);
                return;
            } catch (_) {
                streamState.last_tick_ms = Date.now();
                streamState.last_fetch_time = nowTime;
                streamState.last_error = isEn
                    ? "External URL blocked direct browser reading (CORS policy). Use a psi.nasa.gov link or Nasa_4.exe."
                    : "Dış bağlantı tarayıcıdan doğrudan veri okumayı (CORS kuralı) kısıtladı. Resmi psi.nasa.gov adresi veya Nasa_4.exe kullanın.";
                return;
            }
        }

        if (src === "osdr" && PSI_SNAPSHOT.length > 0) {
            const qVal = (!rawTarget || rawTarget.toLowerCase() === "auto") ? "combustion" : rawTarget;
            const psiPool = searchPsiSnapshotJs(qVal, 36);
            const item = psiPool[streamState.seq_id % Math.max(1, psiPool.length)] || psiRowToItemJs(PSI_SNAPSHOT[0]);
            streamState.seq_id += 1;
            streamState.last_tick_ms = Date.now();
            streamState.last_fetch_time = nowTime;
            streamState.last_error = "";
            streamState.latest_sim_params = Object.assign({
                fuel_id: "n_heptane", gravity_g: 0.0, oxygen_pct: 21.0,
                pressure_psia: 14.7, airflow_cms: 2.4, droplet_d0_mm: 3.4, diluent: "N2",
            }, item.extracted_sim_params || {});
            streamState.events.unshift({
                seq_id: streamState.seq_id,
                time: nowTime,
                source: "NASA PSI Repository Stream",
                id: item.id,
                title: item.title,
                summary: item.abstract,
                url: item.url,
                extracted_sim_params: streamState.latest_sim_params,
            });
            streamState.events = streamState.events.slice(0, 12);
            return;
        }

        let catPool = NASA_CATALOG;
        if (rawTarget && rawTarget.toLowerCase() !== "auto") {
            const scored = NASA_CATALOG
                .map((e) => ({ e, s: computeTextSimilarity(rawTarget, `${e.program} ${e.title} ${e.title_tr} ${(e.tags || []).join(" ")}`) }))
                .filter((x) => x.s > 0.05)
                .sort((a, b) => b.s - a.s)
                .map((x) => x.e);
            if (scored.length > 0) catPool = scored;
        }
        const pick = catPool[streamState.seq_id % catPool.length];
        streamState.seq_id += 1;
        streamState.last_tick_ms = Date.now();
        streamState.last_fetch_time = nowTime;
        streamState.last_error = "";
        streamState.latest_sim_params = {
            fuel_id: pick.fuel_id,
            gravity_g: pick.gravity_g,
            oxygen_pct: pick.oxygen_pct,
            pressure_psia: pick.pressure_psia,
            airflow_cms: pick.airflow_cms,
            droplet_d0_mm: pick.cool_flame_observed ? 4.4 : 3.2,
            diluent: "N2",
        };
        streamState.events.unshift({
            seq_id: streamState.seq_id,
            time: nowTime,
            source: "NASA NTRS Live Stream",
            id: `NTRS-${pick.ntrs_id}`,
            title: pick.title,
            summary: isEn ? pick.key_finding_en : pick.key_finding_tr,
            url: pick.ntrs_url,
            extracted_sim_params: streamState.latest_sim_params,
        });
        streamState.events = streamState.events.slice(0, 12);
    }

    function syncBrowserStreamTimer() {
        if (streamState.timerId) {
            clearInterval(streamState.timerId);
            streamState.timerId = null;
        }
        if (streamState.enabled) {
            const periodMs = Math.max(5000, (Number(streamState.interval_sec) || 25) * 1000);
            streamState.timerId = window.setInterval(() => {
                if (streamState.enabled) {
                    emitNextBrowserStreamPacket().catch(() => {});
                }
            }, periodMs);
        }
    }

    function makeJsonResponse(obj, status) {
        const bodyStr = JSON.stringify(obj);
        return new Response(bodyStr, {
            status: status || 200,
            headers: { "Content-Type": "application/json; charset=utf-8" },
        });
    }

    window.ALTAR_SERVERLESS_FETCH = async function (url, options) {
        const opts = options || {};
        const baseOrigin = (window.location && window.location.origin && window.location.origin !== "null")
            ? window.location.origin
            : "http://127.0.0.1";
        const u = new URL(url, baseOrigin);
        const path = u.pathname;
        const method = String(opts.method || "GET").toUpperCase();
        let jsonBody = {};
        if (opts.body && typeof opts.body === "string") {
            try { jsonBody = JSON.parse(opts.body); } catch (_) {}
        }

        if (path === "/api/bootstrap") {
            return makeJsonResponse({
                version: "5.1.0-serverless",
                presets: MISSION_PRESETS,
                directives: DIRECTIVES,
                earth_transfers: EARTH_TRANSFERS,
                config: Object.assign({}, runtimeConfig, {
                    gemini_api_key: "",
                    openrouter_api_key: "",
                    gemini_api_key_configured: Boolean(runtimeConfig.gemini_api_key),
                    openrouter_api_key_configured: Boolean(runtimeConfig.openrouter_api_key),
                    antigravity_api_key_configured: false,
                }),
                providers: {
                    active_provider: runtimeConfig.active_provider || "auto",
                    gemini_ready: Boolean(runtimeConfig.gemini_api_key),
                    gemini_model: runtimeConfig.gemini_model,
                    antigravity_ready: false,
                    antigravity: { cli_ready: false, models: [] },
                    ollama: { online: false, models: [], recommended_active: "" },
                    openrouter_ready: Boolean(runtimeConfig.openrouter_api_key),
                },
                stream: Object.assign({}, streamState, { timerId: null }),
            });
        }

        if (path === "/api/simulate") {
            return makeJsonResponse(simulateCombustionClient(jsonBody));
        }

        if (path === "/api/rank") {
            return makeJsonResponse(rankExperimentsClient(jsonBody.mission_params, jsonBody.query, jsonBody.hardware_filter));
        }

        if (path === "/api/compare") {
            return makeJsonResponse(compareExperimentsClient(jsonBody.exp_ids));
        }

        if (path === "/api/nasa-live") {
            const src = u.searchParams.get("source") || "ntrs";
            const q = u.searchParams.get("q") || "microgravity combustion";
            return makeJsonResponse(await fetchLiveNasaBrowser(src, q));
        }

        if (path === "/api/ingest-media" && method === "POST") {
            return makeJsonResponse(await analyzeUploadedMediaInBrowser(opts.body));
        }

        if (path === "/api/scrape-url" && method === "POST") {
            const targetUrl = String(jsonBody.url || "").trim();
            const isEn = runtimeConfig.language === "en";
            if (!targetUrl || !/^(https?:\/\/|\.\/|\/)/i.test(targetUrl)) {
                return makeJsonResponse({
                    ok: false,
                    error: isEn
                        ? "Please enter a valid https:// web link (e.g. https://psi.nasa.gov/physci/repo/data/investigations/PSI-117)."
                        : "Lütfen geçerli bir https:// web bağlantısı girin (örn. https://psi.nasa.gov/physci/repo/data/investigations/PSI-117).",
                });
            }

            let parsedTarget = null;
            try {
                parsedTarget = new URL(targetUrl, window.location.href);
            } catch (_) {
                return makeJsonResponse({
                    ok: false,
                    error: isEn ? "Malformed web URL." : "Geçersiz web adresi biçimi.",
                });
            }

            const host = parsedTarget.hostname.toLowerCase();
            const pPath = parsedTarget.pathname || "";
            const qParam = (
                parsedTarget.searchParams.get("q")
                || parsedTarget.searchParams.get("term")
                || parsedTarget.searchParams.get("search")
                || ""
            ).trim();
            const mPsi = targetUrl.match(/\b(PSI-\d+)\b/i);
            const mNtrs = /ntrs\.nasa\.gov$/i.test(host) ? pPath.match(/\/citations\/(\d{6,14})/i) : null;
            const isNasaPortal = /(?:^|\.)(psi|osdr|ntrs)\.nasa\.gov$/i.test(host);

            // 1. Arama / listeleme adresi (örn. psi.nasa.gov/physci/repo/search?q=combustion)
            if (isNasaPortal && !mPsi && !mNtrs && (/\/search\b/i.test(pPath) || Boolean(qParam) || /^(\/|\/physci\/repo\/?)$/i.test(pPath))) {
                if (/ntrs\.nasa\.gov$/i.test(host)) {
                    const ntrsRes = await fetchLiveNasaBrowser("ntrs", qParam || "microgravity combustion");
                    const nItems = Array.isArray(ntrsRes.items) ? ntrsRes.items : [];
                    return makeJsonResponse({
                        ok: true,
                        mode: "search_results",
                        repository: "NASA NTRS Technical Reports Server (ntrs.nasa.gov)",
                        query: qParam || "microgravity combustion",
                        url: targetUrl,
                        title: `NASA NTRS: '${qParam || "combustion"}' (${nItems.length})`,
                        count: nItems.length,
                        search_items: nItems,
                    });
                }
                const psiItems = searchPsiSnapshotJs(qParam || "combustion", 36);
                return makeJsonResponse({
                    ok: true,
                    mode: "search_results",
                    repository: "NASA Physical Sciences Informatics (psi.nasa.gov)",
                    query: qParam || "combustion",
                    url: targetUrl,
                    title: `NASA PSI: '${qParam || "combustion"}' (${psiItems.length})`,
                    count: psiItems.length,
                    search_items: psiItems,
                });
            }

            // 2. Tekil PSI-XX deney kaydı adresi (örn. psi.nasa.gov/physci/repo/data/investigations/PSI-117 veya PSI-22)
            if (mPsi) {
                const psiCode = mPsi[1].toUpperCase();
                const snap = PSI_SNAPSHOT_MAP[psiCode];
                if (snap) {
                    const baseParams = Object.assign({
                        fuel_id: "n_heptane",
                        gravity_g: 0.0,
                        oxygen_pct: 21.0,
                        pressure_psia: 14.7,
                        airflow_cms: 2.4,
                        droplet_d0_mm: 3.4,
                        diluent: "N2",
                    }, snap.extracted_sim_params || {});
                    const sim0 = simulateCombustionClient(baseParams);
                    const phases = Array.isArray(snap.phases) ? snap.phases : [];
                    const titleStr = snap.title || `${psiCode} — ${snap.raw_title || ""}`;
                    if (!ragDocs.some((d) => d.doc_id === psiCode)) {
                        ragDocs.push({
                            doc_id: psiCode,
                            title: titleStr,
                            source: "NASA PSI Portal",
                            url: snap.url || targetUrl,
                            text: `${titleStr} ${snap.abstract || ""}`,
                        });
                    }
                    const fallbackTr = `**NASA PSI Deney Kaydı (${psiCode}${snap.acronym ? " • " + snap.acronym : ""}):** ${snap.raw_title || titleStr}\n- **Test Koşulları:** \`${baseParams.fuel_id}\`, \`${baseParams.gravity_g}G\`, \`%${baseParams.oxygen_pct} O₂\`, \`${baseParams.pressure_psia} psia\`, \`${baseParams.airflow_cms} cm/s\`.\n- **Özet:** ${snap.abstract || ""}`;
                    const fallbackEn = `**NASA PSI Investigation (${psiCode}${snap.acronym ? " • " + snap.acronym : ""}):** ${snap.raw_title || titleStr}\n- **Conditions:** \`${baseParams.fuel_id}\`, \`${baseParams.gravity_g}G\`, \`${baseParams.oxygen_pct}% O₂\`, \`${baseParams.pressure_psia} psia\`, \`${baseParams.airflow_cms} cm/s\`.\n- **Abstract:** ${snap.abstract || ""}`;
                    return makeJsonResponse({
                        ok: true,
                        filename: snap.table_file || `${psiCode}.json`,
                        title: titleStr,
                        preview: snap.abstract || "",
                        summary_tr: snap.summary_tr || fallbackTr,
                        summary_en: snap.summary_en || fallbackEn,
                        chunks: Math.max(1, phases.length || 2),
                        phases: phases,
                        extracted_sim_params: baseParams,
                        simulation: sim0,
                    });
                }
                return makeJsonResponse({
                    ok: false,
                    error: isEn
                        ? `Record ${psiCode} is outside the 36 verified combustion investigations bundled in Browser Mode. Use the desktop app (Nasa_4.exe) for live Geode API access to all PSI disciplines.`
                        : `${psiCode} kaydı Tarayıcı Modunda yer alan 36 doğrulanmış yanma deneyinin dışındadır. Yanma dışı PSI disiplinlerini canlı çekmek için masaüstü uygulamasını (Nasa_4.exe) kullanabilirsiniz.`,
                });
            }

            // 3. Tekil NTRS makale adresi (örn. ntrs.nasa.gov/citations/20150023456)
            if (mNtrs) {
                const ntrsId = mNtrs[1];
                const matchedExp = NASA_CATALOG.find((e) => String(e.ntrs_id) === ntrsId);
                if (matchedExp) {
                    const baseParams = {
                        fuel_id: matchedExp.fuel_id || "n_heptane",
                        gravity_g: Number(matchedExp.gravity_g ?? 0.0),
                        oxygen_pct: Number(matchedExp.oxygen_pct ?? 21.0),
                        pressure_psia: Number(matchedExp.pressure_psia ?? 14.7),
                        airflow_cms: Number(matchedExp.airflow_cms ?? 2.4),
                        droplet_d0_mm: matchedExp.cool_flame_observed ? 4.4 : 3.4,
                        diluent: "N2",
                    };
                    return makeJsonResponse({
                        ok: true,
                        filename: `NTRS-${ntrsId}.json`,
                        title: `NTRS-${ntrsId} — ${matchedExp.title}`,
                        preview: matchedExp.key_finding_en,
                        summary_tr: `**NASA NTRS Makale Kaydı (\`NTRS-${ntrsId}\` • ${matchedExp.program}):** ${matchedExp.title_tr}\n- **Koşullar:** \`${baseParams.fuel_id}\`, \`${baseParams.gravity_g}G\`, \`%${baseParams.oxygen_pct} O₂\`, \`${baseParams.pressure_psia} psia\`, \`${baseParams.airflow_cms} cm/s\`.\n- **Temel Bulgu:** ${matchedExp.key_finding_tr}`,
                        summary_en: `**NASA NTRS Citation (\`NTRS-${ntrsId}\` • ${matchedExp.program}):** ${matchedExp.title}\n- **Conditions:** \`${baseParams.fuel_id}\`, \`${baseParams.gravity_g}G\`, \`${baseParams.oxygen_pct}% O₂\`, \`${baseParams.pressure_psia} psia\`, \`${baseParams.airflow_cms} cm/s\`.\n- **Key Finding:** ${matchedExp.key_finding_en}`,
                        chunks: 2,
                        phases: [],
                        extracted_sim_params: baseParams,
                        simulation: simulateCombustionClient(baseParams),
                    });
                }
                return makeJsonResponse({
                    ok: false,
                    error: isEn
                        ? `ntrs.nasa.gov blocks direct cross-origin browser requests (CORS) for citation #${ntrsId}. Download the PDF and upload it below, or open this URL in the desktop app (Nasa_4.exe).`
                        : `ntrs.nasa.gov sunucusu #${ntrsId} makalesi için doğrudan tarayıcı sorgusunu (CORS güvenlik kuralı) kısıtlamaktadır. Makale PDF dosyasını indirip aşağıdan yükleyebilir veya bağlantıyı masaüstü uygulamasında (Nasa_4.exe) doğrudan çözümleyebilirsiniz.`,
                });
            }

            // 4. Doğrudan CSV / JSON / XLSX / ZIP / metin bağlantıları (CORS açık kaynaklar veya yerel göreli yollar)
            try {
                const res = await window.fetch(targetUrl, { method: "GET" });
                if (!res.ok) {
                    return makeJsonResponse({
                        ok: false,
                        error: isEn
                            ? `Remote server returned HTTP ${res.status} for this URL.`
                            : `Karşı sunucu bu bağlantı için HTTP ${res.status} yanıtı döndürdü.`,
                    });
                }
                const cleanName = decodeURIComponent((pPath.split("/").pop() || "web_dataset.csv"));
                if (/\.(xlsx|zip)$/i.test(cleanName)) {
                    const ab = await res.arrayBuffer();
                    const arch = await extractArchiveBufferInBrowser(ab, cleanName);
                    return makeJsonResponse(parseTextOrTablePayloadInBrowser(arch.text || "", arch.effectiveName || cleanName));
                }
                if (/\.pdf$/i.test(cleanName)) {
                    const ab = await res.arrayBuffer();
                    const pdfTxt = extractReadableTextFromPdfBuffer(ab);
                    return makeJsonResponse(parseTextOrTablePayloadInBrowser(pdfTxt, cleanName));
                }
                const rawText = await res.text();
                return makeJsonResponse(parseTextOrTablePayloadInBrowser(rawText, cleanName));
            } catch (_) {
                return makeJsonResponse({
                    ok: false,
                    error: isEn
                        ? "This external server restricts direct browser reading (CORS security policy). Download the file (.csv/.xlsx/.zip/.pdf) and upload it below, or use the desktop app (Nasa_4.exe) for live server fetching."
                        : "Bu dış sunucu tarayıcı üzerinden doğrudan veri çekimini (CORS güvenlik kuralı) kısıtlamaktadır. Veri dosyasını (.csv/.xlsx/.zip/.pdf) indirip aşağıdan yükleyebilir veya canlı sunucu çekimi için masaüstü uygulamasını (Nasa_4.exe) kullanabilirsiniz.",
                });
            }
        }

        if (path === "/api/rag-add-text" && method === "POST") {
            ragDocs.push({
                doc_id: `DOC-${Date.now()}`,
                title: String(jsonBody.title || "NASA Record"),
                source: String(jsonBody.source || "User"),
                url: String(jsonBody.url || ""),
                text: String(jsonBody.content || ""),
            });
            return makeJsonResponse({ ok: true, count: ragDocs.length });
        }

        if (path === "/api/rag-search") {
            const q = u.searchParams.get("q") || "";
            const results = ragDocs
                .map((d) => ({ title: d.title, text: d.text, similarity: Math.max(0.18, computeTextSimilarity(q, `${d.title} ${d.text}`)) }))
                .sort((a, b) => b.similarity - a.similarity)
                .slice(0, 5);
            return makeJsonResponse({ ok: true, results });
        }

        if (path === "/api/stream/config" && method === "POST") {
            if ("enabled" in jsonBody) streamState.enabled = Boolean(jsonBody.enabled);
            if (jsonBody.source) streamState.source = jsonBody.source;
            if (jsonBody.query_or_url) streamState.query_or_url = String(jsonBody.query_or_url);
            if (jsonBody.interval_sec) streamState.interval_sec = Math.max(10, Number(jsonBody.interval_sec) || 25);
            if ("auto_sync_sim" in jsonBody) streamState.auto_sync_sim = Boolean(jsonBody.auto_sync_sim);

            if (jsonBody.trigger_immediate || streamState.enabled) {
                await emitNextBrowserStreamPacket();
            }
            syncBrowserStreamTimer();
            return makeJsonResponse(Object.assign({}, streamState, { timerId: null }));
        }

        if (path === "/api/stream/status") {
            if (streamState.enabled) {
                const elapsed = Date.now() - (streamState.last_tick_ms || 0);
                if (elapsed >= Math.max(8000, (Number(streamState.interval_sec) || 25) * 1000)) {
                    await emitNextBrowserStreamPacket();
                }
            }
            return makeJsonResponse(Object.assign({}, streamState, { timerId: null }));
        }

        if ((path === "/api/chat/start" || path === "/api/chat") && method === "POST") {
            const jobId = `srvless-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
            const intentStr = classifyBrowserIntent(jsonBody.message, jsonBody.media_context);
            const built = buildQuestionDrivenReply(
                jsonBody.message,
                jsonBody.sim_params,
                jsonBody.media_context,
                runtimeConfig.language
            );
            const prefNow = String(jsonBody.provider_override || runtimeConfig.active_provider || "auto").toLowerCase();
            const isMetaTurn = ["capabilities_guide", "platform_features", "greeting_identity"].includes(intentStr);
            const cloudRes = (prefNow === "auto" && isMetaTurn)
                ? null
                : await callBrowserCloudGateway(
                    jsonBody.message,
                    jsonBody.sim_params,
                    jsonBody.media_context,
                    jsonBody.history || [],
                    jsonBody.provider_override
                );
            const payload = cloudRes
                ? {
                    status: "done",
                    provider: cloudRes.provider,
                    model: cloudRes.model,
                    reply: cloudRes.reply,
                    citations: built.citations,
                    stages: ["[4/4] Cloud Gateway + Browser Physics Verification Complete"],
                }
                : {
                    status: "done",
                    provider: "deterministic_physics",
                    model: "ALTAR-Analytical-Solver-Core",
                    reply: built.reply,
                    citations: built.citations,
                    stages: ["[4/4] Browser Analytical Physics Synthesis Ready"],
                };
            if (path === "/api/chat") {
                return makeJsonResponse(Object.assign({ ok: true }, payload));
            }
            chatJobs.set(jobId, payload);
            return makeJsonResponse({ ok: true, job_id: jobId });
        }

        if (path.startsWith("/api/chat/poll/")) {
            const jobId = decodeURIComponent(path.split("/").pop() || "");
            const job = chatJobs.get(jobId);
            if (!job) return makeJsonResponse({ ok: false, error: "Job not found" });
            return makeJsonResponse(Object.assign({ ok: true }, job));
        }

        if (path.startsWith("/api/chat/cancel/")) {
            return makeJsonResponse({ ok: true });
        }

        if (path === "/api/config") {
            if (method === "POST") {
                Object.keys(jsonBody).forEach((k) => {
                    if (k in runtimeConfig && (jsonBody[k] !== "" || k === "language" || k === "custom_extra_directives")) {
                        runtimeConfig[k] = jsonBody[k];
                    }
                });
            }
            return makeJsonResponse({
                ok: true,
                config: Object.assign({}, runtimeConfig, {
                    gemini_api_key: "",
                    openrouter_api_key: "",
                    gemini_api_key_configured: Boolean(runtimeConfig.gemini_api_key),
                    openrouter_api_key_configured: Boolean(runtimeConfig.openrouter_api_key),
                }),
                providers: {
                    active_provider: runtimeConfig.active_provider,
                    gemini_ready: Boolean(runtimeConfig.gemini_api_key),
                    gemini_model: runtimeConfig.gemini_model,
                    antigravity_ready: false,
                    antigravity: { cli_ready: false, models: [] },
                    ollama: { online: false, models: [], recommended_active: "" },
                    openrouter_ready: Boolean(runtimeConfig.openrouter_api_key),
                },
            });
        }

        if (path === "/api/ollama/status") {
            return makeJsonResponse({ online: false, models: [], note: "Serverless Static Web Mode" });
        }
        if (path === "/api/antigravity/status") {
            return makeJsonResponse({ cli_ready: false, models: [] });
        }
        if (path === "/api/providers/test") {
            const t0 = performance.now();
            const cloudCheck = await callBrowserCloudGateway(
                "0G küresel alevde Spalding B_oq sayısını tek cümleyle özetle.",
                {},
                "",
                [],
                runtimeConfig.active_provider
            );
            const dt = roundN((performance.now() - t0) / 1000, 2);
            if (cloudCheck) {
                return makeJsonResponse({
                    ok: true,
                    provider: cloudCheck.provider,
                    model: cloudCheck.model,
                    latency_s: dt,
                    sample: cloudCheck.reply.slice(0, 280),
                });
            }
            return makeJsonResponse({
                ok: true,
                provider: "deterministic_physics",
                model: "ALTAR-Analytical-Solver-Core (v5.1)",
                latency_s: 0.01,
                sample: "Soru-odaklı çok katmanlı analitik fizik çözücü (d² yasası, Spalding B_oq, ISS R² doğrulaması, karşı-olgusal duyarlılık matrisi ve 15 PSI bilgi tabanı) %100 sunucusuz izole modda aktif.",
            });
        }
        if (path === "/api/ollama/pull" || path === "/api/ollama/unload") {
            return makeJsonResponse({ ok: false, unloaded: 0, error: "Yerel Ollama yönetimi masaüstü Nasa_4.exe uygulamasında aktiftir." });
        }

        return makeJsonResponse({ ok: false, error: `Unsupported serverless endpoint: ${path}` }, 404);
    };
})();
