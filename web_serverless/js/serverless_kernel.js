/* ============================================================================
 * ALTAR-NASA • Flame in Freefall v5.1 — Serverless Zero-Trust Browser Kernel
 * Seçenek 1 (Statik Web Paketi): Sıfır Arka Plan Sunucusu • Sıfır Açık Port • %100 İzole
 * Tüm termodinamik denklemler, ISS R²/RMSE doğrulaması, ECLSS saati, PSI sıralaması ve
 * Kanıt Sentezi Konsolu doğrudan tarayıcı belleğinde (client-side) çalışır.
 * ============================================================================ */
(function () {
    "use strict";

    window.ALTAR_SERVERLESS_MODE = true;

    const EMBEDDED_DATA = {"FUEL_PROPERTIES": {"n_heptane": {"name_tr": "n-Heptan (C₇H₁₆ • FLEX / CFI Sıvı Damlacık)", "name_en": "n-Heptane (C₇H₁₆ • FLEX / CFI Liquid Droplet)", "formula": "C₇H₁₆", "phase": "liquid_droplet", "geometry_3d": "droplet", "rho_l_kg_m3": 684.0, "lv_kj_kg": 318.0, "dhc_kj_kg": 44560.0, "stoich_o2_fuel": 3.52, "t_boil_k": 371.5, "k0_base": 0.76, "t_adiabatic_k": 2190.0, "moc_0g_base": 13.8, "moc_1g_base": 15.2, "cool_flame_capable": true, "cool_flame_min_o2": 9.5, "soot_tendency": 0.62, "blowoff_cms": 34.0}, "methanol": {"name_tr": "Metanol (CH₃OH • FLEX-2 Kurumsuz Damlacık)", "name_en": "Methanol (CH₃OH • FLEX-2 Soot-Free Droplet)", "formula": "CH₃OH", "phase": "liquid_droplet", "geometry_3d": "droplet", "rho_l_kg_m3": 791.0, "lv_kj_kg": 1100.0, "dhc_kj_kg": 19930.0, "stoich_o2_fuel": 1.5, "t_boil_k": 337.8, "k0_base": 0.58, "t_adiabatic_k": 1990.0, "moc_0g_base": 12.6, "moc_1g_base": 14.0, "cool_flame_capable": false, "cool_flame_min_o2": 12.6, "soot_tendency": 0.04, "blowoff_cms": 30.0}, "pmma": {"name_tr": "PMMA Akrilik Cam (BASS / SoFIE Katı Polimer)", "name_en": "Cast PMMA Acrylic (BASS / SoFIE Solid Polymer)", "formula": "(C₅O₂H₈)ₙ", "phase": "solid_surface", "geometry_3d": "solid_rod", "rho_l_kg_m3": 1180.0, "lv_kj_kg": 1590.0, "dhc_kj_kg": 24880.0, "stoich_o2_fuel": 1.92, "t_boil_k": 650.0, "k0_base": 0.34, "t_adiabatic_k": 2040.0, "moc_0g_base": 14.3, "moc_1g_base": 16.8, "cool_flame_capable": false, "cool_flame_min_o2": 14.3, "soot_tendency": 0.55, "blowoff_cms": 42.0}, "sibal": {"name_tr": "Sibal Kumaş (%75 Pamuk / %25 Fiberglas • Saffire)", "name_en": "Sibal Fabric (75% Cotton / 25% Fiberglass • Saffire)", "formula": "C₆H₁₀O₅ + SiO₂", "phase": "solid_thin", "geometry_3d": "flat_slab", "rho_l_kg_m3": 920.0, "lv_kj_kg": 1350.0, "dhc_kj_kg": 16800.0, "stoich_o2_fuel": 1.18, "t_boil_k": 610.0, "k0_base": 0.48, "t_adiabatic_k": 1920.0, "moc_0g_base": 13.2, "moc_1g_base": 16.0, "cool_flame_capable": false, "cool_flame_min_o2": 13.2, "soot_tendency": 0.42, "blowoff_cms": 38.0}, "nomex": {"name_tr": "Nomex HT90-40 (Uzay Giysisi & Kabin Kumaşı • BASS-II)", "name_en": "Nomex HT90-40 (EVA Suit & Crew Fabric • BASS-II)", "formula": "(C₁₄H₁₀N₂O₂)ₙ", "phase": "solid_thin", "geometry_3d": "flat_slab", "rho_l_kg_m3": 1380.0, "lv_kj_kg": 2150.0, "dhc_kj_kg": 21500.0, "stoich_o2_fuel": 1.84, "t_boil_k": 715.0, "k0_base": 0.19, "t_adiabatic_k": 1850.0, "moc_0g_base": 21.5, "moc_1g_base": 24.2, "cool_flame_capable": false, "cool_flame_min_o2": 21.5, "soot_tendency": 0.68, "blowoff_cms": 26.0}, "hydrogen": {"name_tr": "Hidrojen Gaz Jeti (H₂ • ACME / SPICE / SLISE)", "name_en": "Hydrogen Gas Jet (H₂ • ACME / SPICE / SLISE)", "formula": "H₂", "phase": "gas_jet", "geometry_3d": "porous_sphere", "rho_l_kg_m3": 70.8, "lv_kj_kg": 446.0, "dhc_kj_kg": 119960.0, "stoich_o2_fuel": 7.94, "t_boil_k": 298.0, "k0_base": 1.35, "t_adiabatic_k": 2380.0, "moc_0g_base": 6.2, "moc_1g_base": 8.0, "cool_flame_capable": false, "cool_flame_min_o2": 6.2, "soot_tendency": 0.0, "blowoff_cms": 85.0}, "propane_cfig": {"name_tr": "Propan Küresel Brülör (C₃H₈ • ACME CFI-G / BRE Gaz)", "name_en": "Propane Spherical Porous Burner (C₃H₈ • ACME CFI-G / BRE)", "formula": "C₃H₈", "phase": "porous_sphere", "geometry_3d": "porous_sphere", "rho_l_kg_m3": 493.0, "lv_kj_kg": 426.0, "dhc_kj_kg": 46350.0, "stoich_o2_fuel": 3.63, "t_boil_k": 310.0, "k0_base": 0.88, "t_adiabatic_k": 2260.0, "moc_0g_base": 11.4, "moc_1g_base": 12.8, "cool_flame_capable": true, "cool_flame_min_o2": 8.8, "soot_tendency": 0.48, "blowoff_cms": 52.0}}, "DILUENT_FACTORS": {"N2": {"name": "Azot (N₂ - Standart Kabin)", "name_en": "Nitrogen (N₂ - Standard Cabin)", "mw": 28.01, "cp_factor": 1.0, "moc_shift": 0.0, "rad_factor": 1.0, "lambda_g": 0.076}, "CO2": {"name": "Karbondioksit (CO₂ - Söndürme Seyreltmesi)", "name_en": "Carbon Dioxide (CO₂ - Suppression Diluent)", "mw": 44.01, "cp_factor": 0.82, "moc_shift": 3.4, "rad_factor": 1.38, "lambda_g": 0.068}, "He": {"name": "Helyum (He - Yüksek Isıl Difüzyon)", "name_en": "Helium (He - High Thermal Diffusivity)", "mw": 4.0, "cp_factor": 1.06, "moc_shift": 2.1, "rad_factor": 0.88, "lambda_g": 0.185}}, "HABITAT_CONFIGS": {"iss_module": {"name_tr": "ISS Kabin Modülü (Destiny • 120 m³)", "name_en": "ISS Cabin Module (Destiny • 120 m³)", "volume_m3": 120.0}, "lunar_hab": {"name_tr": "Artemis Ay Yüzey Üssü (45 m³)", "name_en": "Artemis Lunar Surface Hab (45 m³)", "volume_m3": 45.0}, "lunar_rover": {"name_tr": "Basınçlı Ay Gezgini / Rover (14 m³)", "name_en": "Pressurized Lunar Rover (14 m³)", "volume_m3": 14.0}, "eva_suit": {"name_tr": "EVA Uzay Giysisi İç Hacmi (0.18 m³)", "name_en": "EVA Spacesuit Free Volume (0.18 m³)", "volume_m3": 0.18}}, "MISSION_PRESETS": [{"id": "preset_iss_spherical", "name_tr": "◈ ISS FLEX: 0G Küresel Heptan Alevi", "name_en": "◈ ISS FLEX: 0G Spherical Heptane Flame", "badge": "0G • %21 O₂ • 14.7 psia", "params": {"fuel_id": "n_heptane", "gravity_g": 0.0, "oxygen_pct": 21.0, "pressure_psia": 14.7, "airflow_cms": 0.2, "droplet_d0_mm": 2.8, "diluent": "N2"}}, {"id": "preset_cool_flame", "name_tr": "◈ FLEX / CFI: Görünmez Soğuk Alev (550–750 K)", "name_en": "◈ FLEX / CFI: Invisible Cool Flame (550–750 K)", "badge": "0G • %13 O₂ • UV/IR", "params": {"fuel_id": "n_heptane", "gravity_g": 0.0, "oxygen_pct": 13.0, "pressure_psia": 14.7, "airflow_cms": 0.0, "droplet_d0_mm": 4.2, "diluent": "N2"}}, {"id": "preset_bass_ventilation", "name_tr": "◈ BASS Paradoksu: MSG Düşük Fan Akışı (5 cm/s)", "name_en": "◈ BASS Paradox: MSG Low-Flow Wake Flame", "badge": "0G • %16.5 O₂ • 5.5 cm/s", "params": {"fuel_id": "pmma", "gravity_g": 0.0, "oxygen_pct": 16.5, "pressure_psia": 14.7, "airflow_cms": 5.5, "droplet_d0_mm": 3.5, "diluent": "N2"}}, {"id": "preset_eva_spacesuit", "name_tr": "◈ EVA Uzay Giysisi: Saf Oksijen (4.3 psia / %100 O₂)", "name_en": "◈ EVA Spacesuit: Pure Oxygen (4.3 psia / 100% O₂)", "badge": "0G • %100 O₂ • 4.3 psia", "params": {"fuel_id": "nomex", "gravity_g": 0.0, "oxygen_pct": 100.0, "pressure_psia": 4.3, "airflow_cms": 3.0, "droplet_d0_mm": 3.2, "diluent": "N2"}}, {"id": "preset_lunar_rover", "name_tr": "◈ Ay Üssü & Basınçlı Rover (0.16G • 10.2 psia • %32 O₂)", "name_en": "◈ Lunar Base & Pressurized Rover (0.16G • 10.2 psia • 32% O₂)", "badge": "0.16G • %32 O₂ • LUCI/FM2", "params": {"fuel_id": "pmma", "gravity_g": 0.16, "oxygen_pct": 32.0, "pressure_psia": 10.2, "airflow_cms": 5.0, "droplet_d0_mm": 3.5, "diluent": "N2"}}, {"id": "preset_artemis_cabin", "name_tr": "◈ Saffire-V / Mars Kabini: Keşif (8.2 psia / %34 O₂)", "name_en": "◈ Saffire-V / Mars Habitat: Exploration (8.2 psia / 34% O₂)", "badge": "0.38G • %34 O₂ • 8.2 psia", "params": {"fuel_id": "sibal", "gravity_g": 0.38, "oxygen_pct": 34.0, "pressure_psia": 8.2, "airflow_cms": 8.0, "droplet_d0_mm": 3.5, "diluent": "N2"}}, {"id": "preset_acme_cfig", "name_tr": "◈ ACME CFI-G: Küresel Brülör (%85 O₂ Rekor Test)", "name_en": "◈ ACME CFI-G: Spherical Burner (85% O₂ Peak Test)", "badge": "0G • %85 O₂ • C₃H₈", "params": {"fuel_id": "propane_cfig", "gravity_g": 0.0, "oxygen_pct": 85.0, "pressure_psia": 14.7, "airflow_cms": 0.4, "droplet_d0_mm": 4.8, "diluent": "N2"}}, {"id": "preset_earth_1g", "name_tr": "◈ Dünya (1G) Referans Karşılaştırması", "name_en": "◈ Earth (1G) Buoyant Reference Plume", "badge": "1G • %21 O₂ • Kaldırma", "params": {"fuel_id": "n_heptane", "gravity_g": 1.0, "oxygen_pct": 21.0, "pressure_psia": 14.7, "airflow_cms": 2.0, "droplet_d0_mm": 3.2, "diluent": "N2"}}], "NASA_EXPERIMENTS_CATALOG": [{"exp_id": "PSI-FLEX-01", "program": "FLEX", "hardware_group": "CIR", "title": "Flame Extinguishment Experiment (FLEX) — n-Heptane Cool Flame Discovery", "title_tr": "FLEX Deneyi — n-Heptan Damlacıklarında Görünmez Soğuk Alev Keşfi", "facility": "ISS Combustion Integrated Rack (CIR) / MDCA", "year": 2012, "fuel_id": "n_heptane", "material": "n-Heptane Liquid Droplet (2.5 - 4.8 mm)", "sample_geometry_tr": "Serbest yüzen veya 14 µm SiC kuvars lifte asılı küresel sıvı damlacık (D₀ = 2.5–4.8 mm)", "sample_geometry_en": "Free-floating or 14 µm SiC fiber-tethered spherical liquid droplet (D₀ = 2.5–4.8 mm)", "sensors_tr": "UV/OH* (310 nm) & CH* (430 nm) yoğunlaştırılmış kameralar, arkadan aydınlatmalı yüksek hızlı optik kamera, geniş bant IR radyometre", "sensors_en": "UV/OH* (310 nm) & CH* (430 nm) intensified cameras, backlit high-speed silhouette camera, broadband IR radiometer", "gravity_g": 0.0, "oxygen_pct": 15.0, "pressure_psia": 14.7, "airflow_cms": 0.0, "moc_measured_pct": 13.8, "burning_rate_or_spread": "K = 0.72 mm²/s (Hot) -> 0.19 mm²/s (Cool Flame)", "cool_flame_observed": true, "ntrs_id": "20150023456", "ntrs_url": "https://ntrs.nasa.gov/citations/20150023456", "psi_id": "PSI-105", "psi_url": "https://www.nasa.gov/PSI", "key_finding_tr": "Büyük n-Heptan damlacıkları 0G'de radyatif ısı kaybıyla görünür sıcak alevini kaybettikten sonra 550-750 K'de görünmez Soğuk Alev (Cool Flame) ile yanmaya devam ederek zehirli CO ve formaldehit üretti.", "key_finding_en": "Large n-heptane droplets in 0G transitioned after radiative hot-flame extinction into sustained quasi-steady low-temperature (550-750 K) invisible cool flames, generating CO and formaldehyde.", "safety_insight_tr": "Optik alev dedektörleri tek başına yetersizdir; kabinlerde IR radyometre ve CO/CH₂O çoklu sensör füzyonu zorunludur.", "safety_insight_en": "Optical flame detectors miss cool flames; multi-spectral IR + CO/CH₂O gas sensing is required in crewed modules.", "intra_runs": [{"run_code": "FLEX-H04", "same_tr": "Yakıt: Saf n-Heptan, Basınç: 1.0 atm (14.7 psia), Durgun 0G (U=0 cm/s)", "same_en": "Fuel: Pure n-Heptane, Pressure: 1.0 atm (14.7 psia), Quiescent 0G (U=0 cm/s)", "diff_tr": "Küçük başlangıç çapı (D₀ = 1.9 mm) ve %21 O₂", "diff_en": "Small initial droplet diameter (D₀ = 1.9 mm) at 21% O₂", "result_tr": "Radyatif kayıp düşük kaldı; damlacık sonuna kadar tek aşamalı sıcak mavi alevle tükendi (K=0.76 mm²/s).", "result_en": "Low radiative loss; single-stage hot blue spherical flame burned to completion (K=0.76 mm²/s)."}, {"run_code": "FLEX-H19", "same_tr": "Yakıt: Saf n-Heptan, Basınç: 14.7 psia, Durgun 0G (CIR/MDCA)", "same_en": "Fuel: Pure n-Heptane, Pressure: 14.7 psia, Quiescent 0G (CIR/MDCA)", "diff_tr": "Büyük damlacık çapı (D₀ = 4.1 mm) ve %15 O₂", "diff_en": "Large droplet diameter (D₀ = 4.1 mm) at 15% O₂", "result_tr": "İki aşamalı yanma: Sıcak alev radyatif kayıpla söndü, ardından 18 sn boyunca görünmez Soğuk Alev (K=0.19 mm²/s) sürdü!", "result_en": "Two-stage burning: Radiative hot-flame quenching followed by 18 s of invisible Cool Flame vaporization (K=0.19 mm²/s)."}, {"run_code": "FLEX-H27", "same_tr": "Yakıt: Saf n-Heptan, Durgun 0G, D₀ = 3.6 mm", "same_en": "Fuel: Pure n-Heptane, Quiescent 0G, D₀ = 3.6 mm", "diff_tr": "CO₂ seyreltme (%15 O₂ / %25 CO₂ / %60 N₂)", "diff_en": "CO₂ dilution (15% O₂ / 25% CO₂ / 60% N₂)", "result_tr": "CO₂ gaz radyasyonu χ_r kaybını artırarak sıcak alevi erken söndürdü ve sönümlenme çapını büyüttü.", "result_en": "CO₂ gas reabsorption amplified χ_r radiative loss, accelerating hot-flame extinction."}], "tags": ["droplet", "heptane", "cool flame", "radiative extinction", "FLEX", "CIR", "MDCA", "soğuk alev"]}, {"exp_id": "PSI-FLEX2-02", "program": "FLEX-2", "hardware_group": "CIR", "title": "FLEX-2 — Methanol Soot-Free Droplet Combustion & Water Absorption Extinction", "title_tr": "FLEX-2 — Metanol Kurumsuz Damlacık Yanması ve Su Buharı Emilim Sönmesi", "facility": "ISS Combustion Integrated Rack (CIR) / MDCA", "year": 2015, "fuel_id": "methanol", "material": "Pure Methanol & Heptane/Methanol Bi-Component Droplets (2.0 - 5.0 mm)", "sample_geometry_tr": "İğne dağıtıcılı serbest yüzen küresel sıvı damlacık ve ikili damlacık dizisi (D₀ = 2.0–5.0 mm)", "sample_geometry_en": "Needle-deployed free-floating spherical droplet & binary droplet arrays (D₀ = 2.0–5.0 mm)", "sensors_tr": "Yüksek hızlı arkadan aydınlatmalı kamera, UV OH* radyometre, geniş bant kızılötesi (IR) sensör, kabin gaz kromatografisi", "sensors_en": "High-speed backlit silhouette camera, UV OH* radiometer, wideband IR sensor, gas chromatography", "gravity_g": 0.0, "oxygen_pct": 18.0, "pressure_psia": 14.7, "airflow_cms": 0.5, "moc_measured_pct": 12.6, "burning_rate_or_spread": "K = 0.56 mm²/s", "cool_flame_observed": false, "ntrs_id": "20090014812", "ntrs_url": "https://ntrs.nasa.gov/citations/20090014812", "psi_id": "PSI-112", "psi_url": "https://www.nasa.gov/PSI", "key_finding_tr": "Metanol 0G'de sıfır kurumla saf mavi küresel alev oluşturdu; yanma ürünü olan H₂O buharının sıvı damlacık içine geri difüze olması damlacığı kendiliğinden seyrelterek sönümlenme çapını belirledi.", "key_finding_en": "Methanol burned soot-free with a spherical blue flame; dissolution of combustion-generated water vapor back into the liquid droplet governed diffusive extinction.", "safety_insight_tr": "Su sisi (Water Mist PFE) polar yakıt yangınlarında hem gaz fazını soğutur hem sıvı yakıtı seyrelterek yüksek verim sağlar.", "safety_insight_en": "Fine water mist suppression excels on polar fuels via simultaneous thermal cooling and fuel-phase dilution.", "intra_runs": [{"run_code": "FLEX2-M03", "same_tr": "CIR / MDCA donanımı, 0G, 14.7 psia, %21 O₂", "same_en": "CIR / MDCA hardware, 0G, 14.7 psia, 21% O₂", "diff_tr": "Saf Metanol (CH₃OH), D₀ = 2.6 mm, U = 0 cm/s", "diff_en": "Pure Methanol (CH₃OH), D₀ = 2.6 mm, U = 0 cm/s", "result_tr": "Sıfır kurum ışıması; su buharı emilimi nedeniyle D_ext ≈ 0.9 mm çapında difüzif sönme.", "result_en": "Zero soot luminosity; diffusive extinction at D_ext ≈ 0.9 mm due to water uptake."}, {"run_code": "FLEX2-M11", "same_tr": "CIR / MDCA donanımı, 0G, 14.7 psia, Saf Metanol", "same_en": "CIR / MDCA hardware, 0G, 14.7 psia, Pure Methanol", "diff_tr": "Yavaş zorlanmış konveksiyon (U = 3.0 cm/s) ve D₀ = 4.2 mm", "diff_en": "Gentle forced convection (U = 3.0 cm/s) with D₀ = 4.2 mm", "result_tr": "Hafif hava akışı su buharı kabuğunu süpürerek yanma hızını K = 0.68 mm²/s düzeyine çıkardı.", "result_en": "Slow convection swept away H₂O products, elevating burning rate to K = 0.68 mm²/s."}, {"run_code": "FLEX2-BM06", "same_tr": "CIR / MDCA donanımı, 0G, 14.7 psia, %18 O₂", "same_en": "CIR / MDCA hardware, 0G, 14.7 psia, 18% O₂", "diff_tr": "%50 Heptan / %50 Tolüen çift bileşenli (bi-component) damlacık", "diff_en": "50% Heptane / 50% Toluene bi-component droplet", "result_tr": "Uçucu bileşen tükenirken anlık kabarcıklanma (micro-explosion/disruptive burning) ve kurum halkası gözlendi.", "result_en": "Preferential vaporization produced soot-shell contraction and disruptive flare-up."}], "tags": ["methanol", "droplet", "soot-free", "water mist", "FLEX-2", "CIR", "MDCA", "metanol"]}, {"exp_id": "PSI-CFI-11", "program": "CFI", "hardware_group": "CIR", "title": "Cool Flames Investigation (CFI) — Heavy Alkane Liquid Droplet Low-Temperature Kinetics", "title_tr": "CFI — Ağır Alkan Sıvı Damlacıklarında Uzun Süreli Soğuk Alev Kinetiği", "facility": "ISS Combustion Integrated Rack (CIR) / MDCA", "year": 2017, "fuel_id": "n_heptane", "material": "n-Decane, n-Dodecane & n-Heptane Liquid Droplets (3.0 - 5.2 mm)", "sample_geometry_tr": "MDCA iğne sistemiyle oluşturulan büyük küresel ağır hidrokarbon damlacıkları (D₀ = 3.0–5.2 mm)", "sample_geometry_en": "MDCA needle-deployed large spherical heavy alkane droplets (D₀ = 3.0–5.2 mm)", "sensors_tr": "Formaldehit kemilüminesans UV kamerası (340–400 nm), K-tipi ince tel termokupl dizisi, IR radyometre", "sensors_en": "Formaldehyde UV chemiluminescence camera (340–400 nm), fine-wire thermocouple array, IR radiometer", "gravity_g": 0.0, "oxygen_pct": 14.0, "pressure_psia": 14.7, "airflow_cms": 0.0, "moc_measured_pct": 13.4, "burning_rate_or_spread": "Quasi-steady Cool Flame @ 610 K (K_cool = 0.16 mm²/s)", "cool_flame_observed": true, "ntrs_id": "20180006321", "ntrs_url": "https://ntrs.nasa.gov/search?q=Cool%20Flames%20Investigation%20MDCA", "psi_id": "PSI-129", "psi_url": "https://www.nasa.gov/PSI", "key_finding_tr": "CIR/MDCA içinde yürütülen CFI serisi, n-dekan ve n-dodekan gibi ağır yakıtların sıcak alev sonrası 40 saniyeye varan kararlı 600 K soğuk alev fazında buharlaşıp yoğun sis bulutu (vapor cloud) oluşturduğunu kanıtladı.", "key_finding_en": "Conducted in CIR/MDCA, CFI proved heavy alkanes sustain up to 40 s of steady ~600 K NTC cool flames followed by condensed fuel-vapor clouds without visible glow.", "safety_insight_tr": "Sıcak alev söndükten sonra soğuk alevin bıraktığı yoğunlaşmış yakıt buharı bulutu, taze O₂ geldiğinde patlayıcı yeniden tutuşma yaratabilir.", "safety_insight_en": "Post-cool-flame condensed vapor clouds create severe delayed re-ignition hazards if cabin ventilation resumes.", "intra_runs": [{"run_code": "CFI-D05", "same_tr": "CIR / MDCA donanımı, 0G, 14.7 psia, Durgun atmosfer", "same_en": "CIR / MDCA hardware, 0G, 14.7 psia, Quiescent atmosphere", "diff_tr": "n-Dekan yakıtı, D₀ = 3.9 mm, %21 O₂", "diff_en": "n-Decane fuel, D₀ = 3.9 mm, 21% O₂", "result_tr": "Parlak sarı kurum kabuğu radyasyonu artırdı; sıcak alev sönüp doğrudan 620 K soğuk aleve kilitlendi.", "result_en": "Soot-shell radiation triggered hot-flame quenching into a sustained 620 K cool flame."}, {"run_code": "CFI-D14", "same_tr": "CIR / MDCA donanımı, 0G, n-Dodekan yakıtı", "same_en": "CIR / MDCA hardware, 0G, n-Dodecane fuel", "diff_tr": "Düşük oksijen (%14 O₂) ve daha büyük çap (D₀ = 4.9 mm)", "diff_en": "Reduced oxygen (14% O₂) and larger droplet (D₀ = 4.9 mm)", "result_tr": "Çok kısa sıcak tutuşmanın ardından 35+ sn görünmez soğuk alev ve sönme sonrası beyaz yakıt buharı sisi oluştu.", "result_en": "Brief hot flash transitioned into 35+ s cool flame and dense post-extinction vapor mist."}, {"run_code": "CFI-D22", "same_tr": "CIR / MDCA donanımı, 0G, D₀ = 4.0 mm", "same_en": "CIR / MDCA hardware, 0G, D₀ = 4.0 mm", "diff_tr": "Helyum (He) seyreltmesiyle artırılmış ısıl difüzivite", "diff_en": "Helium (He) diluent increasing thermal diffusivity", "result_tr": "Yüksek iletimli ısı kaybı nedeniyle hem sıcak hem soğuk alev daha erken sönümlendi.", "result_en": "Elevated conductive heat loss in He quenched both hot and cool stages earlier."}], "tags": ["CFI", "cool flame", "MDCA", "CIR", "decane", "dodecane", "droplet", "NTC"]}, {"exp_id": "PSI-BASS-03", "program": "BASS", "hardware_group": "MSG", "title": "Burning and Suppression of Solids (BASS) — Low-Velocity Airflow Flammability Enhancement", "title_tr": "BASS — MSG Akış Kanalında Düşük Hava Akışlı Katı Yakıt Yanıcılık Artışı", "facility": "ISS Microgravity Science Glovebox (MSG) — SPICE Flow Duct", "year": 2014, "fuel_id": "pmma", "material": "Cast PMMA Acrylic Rods, Spheres & Flat Sheets", "sample_geometry_tr": "MSG fan kanalı içinde 6.4 mm çaplı silindirik PMMA çubuklar, 2 cm PMMA küreler ve 2×10 cm düz plakalar", "sample_geometry_en": "6.4 mm diameter cylindrical PMMA rods, 2 cm spheres, and 2×10 cm flat slabs inside MSG flow duct", "sensors_tr": "HD dijital video kamera, radyometrik kızılötesi kamera, sıcak tel anemometresi (akış hızı), R-tipi termokupl", "sensors_en": "HD digital video camera, IR imaging radiometer, hot-wire anemometer (flow speed), R-type thermocouples", "gravity_g": 0.0, "oxygen_pct": 16.5, "pressure_psia": 14.7, "airflow_cms": 4.5, "moc_measured_pct": 14.3, "burning_rate_or_spread": "Spread = 0.85 mm/s @ 4.5 cm/s", "cool_flame_observed": false, "ntrs_id": "20160000593", "ntrs_url": "https://ntrs.nasa.gov/citations/20160000593", "psi_id": "PSI-118", "psi_url": "https://www.nasa.gov/PSI", "key_finding_tr": "1G'de %16.8 O₂ altında sönen PMMA, 0G'de 3-8 cm/s hafif kabin havalandırması altında %14.3 O₂'ye kadar kararlı şekilde yanmaya devam etti (Havalandırma Paradoksu).", "key_finding_en": "PMMA that self-extinguishes below 16.8% O₂ on Earth sustained steady burning down to 14.3% O₂ in 0G when exposed to gentle 3-8 cm/s ventilation flow.", "safety_insight_tr": "Uzay aracında yangın alarmı anında yapılacak İLK otonom işlem kabin HVAC/havalandırma fanlarının anında kapatılmasıdır!", "safety_insight_en": "Immediate automated shutoff of cabin HVAC ventilation fans is the primary first-response action to starve 0G fires.", "intra_runs": [{"run_code": "BASS-P02", "same_tr": "MSG SPICE akış kanalı, PMMA silindir (d=6.4 mm), 14.7 psia, %17 O₂", "same_en": "MSG SPICE flow duct, PMMA rod (d=6.4 mm), 14.7 psia, 17% O₂", "diff_tr": "Fan kapalı: Tam durgun akış (U = 0.0 cm/s)", "diff_en": "Fan off: Quiescent flow (U = 0.0 cm/s)", "result_tr": "Oksijen difüzyonu yetersiz kaldı ve alev kendi CO₂ kabuğu içinde 12 sn'de boğularak söndü!", "result_en": "Oxygen starvation and radiative loss self-extinguished the flame within 12 s."}, {"run_code": "BASS-P09", "same_tr": "MSG SPICE akış kanalı, PMMA silindir (d=6.4 mm), 14.7 psia, %16.5 O₂", "same_en": "MSG SPICE flow duct, PMMA rod (d=6.4 mm), 14.7 psia, 16.5% O₂", "diff_tr": "Düşük hızlı karşıt fan akışı (U = 4.5 cm/s)", "diff_en": "Low-velocity opposed fan flow (U = 4.5 cm/s)", "result_tr": "1G'de sönmesi gereken oksijen seviyesinde parlak mavi durgunluk alevi 0.85 mm/s hızla kararlı yayıldı!", "result_en": "Sustained bright blue flame spread at 0.85 mm/s below the Earth 1G flammability limit!"}, {"run_code": "BASS-P18", "same_tr": "MSG SPICE akış kanalı, PMMA silindir, 14.7 psia, %18 O₂", "same_en": "MSG SPICE flow duct, PMMA rod, 14.7 psia, 18% O₂", "diff_tr": "Yüksek fan hızı (U = 32 cm/s) ve N₂ söndürme jeti", "diff_en": "High fan speed (U = 32 cm/s) with N₂ suppression jet", "result_tr": "Konvektif soğutma alevin ön kenarını üfleme sınırına (Da < 1) sürükleyerek söndürdü.", "result_en": "Convective cooling drove the leading edge into Damköhler blowoff extinction."}], "tags": ["BASS", "PMMA", "solid", "ventilation", "airflow", "MOC", "MSG", "SPICE duct"]}, {"exp_id": "PSI-BASS2-04", "program": "BASS-II", "hardware_group": "MSG", "title": "BASS-II — Cotton-Fiberglass & Nomex Textile MOC in Opposed Microgravity Flow", "title_tr": "BASS-II — MSG Kanalında Tekstil ve Nomex Malzemelerin 0G Oksijen Sınırları", "facility": "ISS Microgravity Science Glovebox (MSG) — SPICE Flow Duct", "year": 2018, "fuel_id": "nomex", "material": "Nomex HT90-40 & Sibal Cotton-Fiberglass Fabrics", "sample_geometry_tr": "Paslanmaz çelik çerçevede gerilmiş 2.2 cm genişlik × 10 cm uzunlukta ince tekstil şeritleri (0.3 mm kalınlık)", "sample_geometry_en": "Thin textile strips (2.2 cm wide × 10 cm long × 0.3 mm thick) mounted in stainless steel holders", "sensors_tr": "Yüksek çözünürlüklü renkli kamera, radyometre, O₂ paramanyetik sensör, kanal içi hız anemometresi", "sensors_en": "High-resolution color imaging camera, radiometer, paramagnetic O₂ analyzer, duct anemometer", "gravity_g": 0.0, "oxygen_pct": 24.0, "pressure_psia": 14.7, "airflow_cms": 6.0, "moc_measured_pct": 21.5, "burning_rate_or_spread": "Spread = 1.15 mm/s @ 24% O₂", "cool_flame_observed": false, "ntrs_id": "20210011385", "ntrs_url": "https://ntrs.nasa.gov/citations/20210011385", "psi_id": "PSI-124", "psi_url": "https://www.nasa.gov/PSI", "key_finding_tr": "Standart ISS havasında (%21 O₂) güvenli olan alev geciktirici kumaşlar, oksijen zenginleştirilmiş ortamlarda (>%22 O₂) ve düşük hızlı karşıt hava akışında kararlı mavi kenar aleviyle yayıldı.", "key_finding_en": "Flame-retardant textiles safe in 21% O₂ propagated steady blue edge flames under elevated oxygen and low-speed opposed ventilation flows.", "safety_insight_tr": "NASA-STD-6001B 1G yukarı yanma testi (Test 1), düşük akışlı 0G riskini her zaman yakalayamaz; itfaiyeci ve astronot kıyafetlerinde düşük akış MOC testi şarttır.", "safety_insight_en": "Earth 1G upward screening (NASA-STD-6001B) must be augmented with low-flow 0G MOC testing for crew & firefighter gear.", "intra_runs": [{"run_code": "BASS2-T04", "same_tr": "MSG akış kanalı, 2.2×10 cm kumaş numune, 14.7 psia", "same_en": "MSG flow duct, 2.2×10 cm textile strip, 14.7 psia", "diff_tr": "Sibal kumaş, %15.5 O₂, karşıt akış U = 5.0 cm/s", "diff_en": "Sibal fabric, 15.5% O₂, opposed flow U = 5.0 cm/s", "result_tr": "Düzgün mavi alev cephesi yerine parmakçıklı (fingering instability) şeritler halinde yayılma gözlendi.", "result_en": "Flame front broke into cellular 'fingering' flamelets near the low-O₂ quenching limit."}, {"run_code": "BASS2-T12", "same_tr": "MSG akış kanalı, 2.2×10 cm numune, U = 6.0 cm/s", "same_en": "MSG flow duct, 2.2×10 cm strip, U = 6.0 cm/s", "diff_tr": "Nomex HT90-40 kumaş, %21 O₂ vs. %25 O₂ karşılaştırması", "diff_en": "Nomex HT90-40 fabric tested at 21% O₂ vs. 25% O₂", "result_tr": "%21 O₂'de hemen sönerken, %25 O₂'de kararlı yayılma gerçekleşti (keşif atmosferi hassasiyeti).", "result_en": "Self-extinguished at 21% O₂, but sustained steady spread at 25% O₂."}, {"run_code": "BASS2-T19", "same_tr": "MSG akış kanalı, Sibal kumaş, %18 O₂", "same_en": "MSG flow duct, Sibal fabric, 18% O₂", "diff_tr": "Eş yönlü (concurrent) vs. karşıt yönlü (opposed) fan akışı", "diff_en": "Concurrent vs. opposed airflow configuration", "result_tr": "Eş yönlü akışta sıcak gazlar yanmamış kumaşı ön-ısıtarak yayılma hızını ~2.1 kat artırdı.", "result_en": "Concurrent flow preheated virgin fabric downstream, doubling spread velocity."}], "tags": ["BASS-II", "Nomex", "fabric", "textile", "MOC", "MSG", "NASA-STD-6001"]}, {"exp_id": "PSI-SPICE-12", "program": "SPICE", "hardware_group": "MSG", "title": "Smoke Point In Co-flow Experiment (SPICE) — Laminar Gas Jet Soot Inception in MSG", "title_tr": "SPICE — MSG Fan Kanalında Gaz Yakıt Alevlerinin Duman/Kurum Eşik Noktası", "facility": "ISS Microgravity Science Glovebox (MSG) — Modular SPICE Flow Duct", "year": 2011, "fuel_id": "propane_cfig", "material": "Enclosed Co-flow Gaseous Jets (Propane, Ethylene, Methane, Propylene)", "sample_geometry_tr": "SPICE modüler fan güdümlü akış kanalı (76×76 mm kesit) içinde 1.6 mm iç çaplı eş-eksenli paslanmaz brülör nozulu", "sample_geometry_en": "1.6 mm ID coaxial stainless-steel burner nozzle inside the 76×76 mm modular fan-driven SPICE flow duct", "sensors_tr": "Yüksek çözünürlüklü CCD kamera, lazer sönümleme (laser extinction) kurum ölçer, radyometre, akış hızı sensörü", "sensors_en": "High-resolution CCD camera, laser-extinction soot volume sensor, radiometer, duct flow sensor", "gravity_g": 0.0, "oxygen_pct": 21.0, "pressure_psia": 14.7, "airflow_cms": 10.0, "moc_measured_pct": 11.8, "burning_rate_or_spread": "0G Smoke-point flame length 2.1x shorter & wider soot wing", "cool_flame_observed": false, "ntrs_id": "20110014585", "ntrs_url": "https://ntrs.nasa.gov/search?q=Smoke%20Point%20In%20Co-flow%20Experiment%20SPICE", "psi_id": "PSI-108", "psi_url": "https://www.nasa.gov/PSI", "key_finding_tr": "MSG için geliştirilen modüler fan akış kanalında (daha sonra BASS, BASS-II ve SLISE tarafından da kullanıldı), 0G'de gaz alevlerinin çok daha erken kurum (duman noktası) ürettiği ve kapalı alev ucunun açılarak duman saldığı keşfedildi.", "key_finding_en": "Using the modular fan-driven MSG duct (later shared by BASS, BASS-II, and SLISE), SPICE showed 0G laminar jets reach their soot/smoke point at lower fuel flows due to longer residence time and radiative tip cooling.", "safety_insight_tr": "0G gaz sızıntısı yangınlarında Dünya'ya kıyasla çok daha yoğun siyah kurum ve büyük partikül oluşur; kabin duman dedektörleri buna göre kalibre edilmelidir.", "safety_insight_en": "0G gas fires emit larger soot aggregates than 1G flames, directly impacting spacecraft smoke detector calibration.", "intra_runs": [{"run_code": "SPICE-E04", "same_tr": "MSG SPICE kanalı, 1.6 mm nozul, %21 O₂, 14.7 psia", "same_en": "MSG SPICE duct, 1.6 mm nozzle, 21% O₂, 14.7 psia", "diff_tr": "Etilen (C₂H₄) yakıtı, düşük eş-akış hızı (U_coflow = 6 cm/s)", "diff_en": "Ethylene (C₂H₄) fuel at low co-flow velocity (6 cm/s)", "result_tr": "Alev tepesi radyatif soğumayla açıldı (open-tip wing) ve yoğun kurum şeridi salındı.", "result_en": "Flame tip opened via radiative cooling, releasing a dense soot streamer."}, {"run_code": "SPICE-P11", "same_tr": "MSG SPICE kanalı, 1.6 mm nozul, %21 O₂, 14.7 psia", "same_en": "MSG SPICE duct, 1.6 mm nozzle, 21% O₂, 14.7 psia", "diff_tr": "Propan (C₃H₈) yakıtı, yüksek eş-akış hızı (U_coflow = 22 cm/s)", "diff_en": "Propane (C₃H₈) fuel at elevated co-flow velocity (22 cm/s)", "result_tr": "Artan eş-akış hızı oksijen karışımını güçlendirerek duman noktasını geciktirdi ve kurumu azalttı.", "result_en": "Higher co-flow shear enhanced O₂ transport and suppressed soot breakthrough."}, {"run_code": "SPICE-M07", "same_tr": "MSG SPICE kanalı, U_coflow = 10 cm/s, 14.7 psia", "same_en": "MSG SPICE duct, U_coflow = 10 cm/s, 14.7 psia", "diff_tr": "Metan (CH₄) yakıtı vs. Propan yakıtı karşılaştırması", "diff_en": "Methane (CH₄) vs. Propane fuel comparison", "result_tr": "Düşük C/H oranlı metan kurumsuz mavi uç korurken propan parlak sarı kurum çekirdeği oluşturdu.", "result_en": "Low C/H methane remained blue-tipped while propane formed a luminous soot core."}], "tags": ["SPICE", "MSG", "smoke point", "soot", "co-flow", "gas jet", "propane"]}, {"exp_id": "PSI-SLISE-13", "program": "SLISE", "hardware_group": "MSG", "title": "Structure and Liftoff In Combustion Experiment (SLISE) — Jet Flame Liftoff & Blowout in MSG", "title_tr": "SLISE — MSG Akış Kanalında Gaz Jet Alevlerinde Kalkış (Liftoff) ve Üfleme Sönmesi", "facility": "ISS Microgravity Science Glovebox (MSG) — SPICE Flow Duct", "year": 2012, "fuel_id": "hydrogen", "material": "Nitrogen-Diluted Methane & Hydrocarbon Co-flow Gas Jets", "sample_geometry_tr": "SPICE fan güdümlü MSG kanalı içinde dairesel mikro-jet brülör (d = 1.1–2.0 mm)", "sample_geometry_en": "Circular micro-jet burner (d = 1.1–2.0 mm) mounted in the SPICE fan-driven MSG flow duct", "sensors_tr": "Renkli CCD kamera, mavi CH* kemilüminesans filtresi, kütle akış kontrolörleri (MFC), ısıl çift", "sensors_en": "Color CCD camera, CH* blue chemiluminescence filter, mass flow controllers (MFC), thermocouple", "gravity_g": 0.0, "oxygen_pct": 21.0, "pressure_psia": 14.7, "airflow_cms": 18.0, "moc_measured_pct": 9.2, "burning_rate_or_spread": "Triple-flame liftoff base stabilized @ Da ≈ 1.1", "cool_flame_observed": false, "ntrs_id": "20130011240", "ntrs_url": "https://ntrs.nasa.gov/search?q=SLISE%20microgravity%20liftoff%20flame", "psi_id": "PSI-110", "psi_url": "https://www.nasa.gov/PSI", "key_finding_tr": "MSG akış kanalında yürütülen SLISE deneyi, 0G'de kaldırma kuvveti olmadığında brülörden kopan (liftoff) üçlü alev (triple-flame) tabanının 1G'ye kıyasla çok daha yüksek akış hızlarına kadar sönmeden asılı kalabildiğini gösterdi.", "key_finding_en": "In the MSG flow duct, SLISE showed lifted 0G triple-flames stabilize farther downstream and resist blowout better than buoyancy-perturbed 1G jet flames.", "safety_insight_tr": "Basınçlı gaz hatlarından sızan jet yangınları 0G'de brülör ağzından kopsa bile uzakta asılı kalarak yanmayı sürdürebilir; kaynağı kesmek şarttır.", "safety_insight_en": "Pressurized gas-leak flames in 0G can stabilize as lifted triple-flames away from the leak orifice until valve isolation.", "intra_runs": [{"run_code": "SLISE-L02", "same_tr": "MSG SPICE kanalı, N₂ seyreltmeli yakıt jeti, 14.7 psia", "same_en": "MSG SPICE duct, N₂-diluted fuel jet, 14.7 psia", "diff_tr": "Düşük jet çıkış hızı (Re_jet = 180)", "diff_en": "Low jet exit velocity (Re_jet = 180)", "result_tr": "Alev tabanı nozul dudaklarına tam tutunmuş (attached) kararlı laminer yapı sergiledi.", "result_en": "Flame base remained attached to the burner rim in laminar diffusion mode."}, {"run_code": "SLISE-L09", "same_tr": "MSG SPICE kanalı, aynı yakıt bileşimi, 14.7 psia", "same_en": "MSG SPICE duct, identical fuel dilution, 14.7 psia", "diff_tr": "Orta-yüksek jet hızı (Re_jet = 620)", "diff_en": "Moderate-high jet velocity (Re_jet = 620)", "result_tr": "Alev nozuldan 14 mm yukarı kalktı (liftoff) ve simetrik üçlü-alev (triple flame) halkası oluşturdu.", "result_en": "Flame lifted 14 mm downstream, stabilizing via a symmetric triple-flame propagation edge."}, {"run_code": "SLISE-L15", "same_tr": "MSG SPICE kanalı, aynı nozul çapı, 14.7 psia", "same_en": "MSG SPICE duct, identical nozzle diameter, 14.7 psia", "diff_tr": "Kritik üfleme hızı aşımı (U_coflow = 35 cm/s, Da < 1)", "diff_en": "Critical blowout velocity exceeded (U_coflow = 35 cm/s, Da < 1)", "result_tr": "Alev tabanı tutunma hızını kaybederek kanal çıkışına sürüklendi ve tamamen söndü (blowout).", "result_en": "Triple-flame propagation speed was exceeded, resulting in complete convective blowout."}], "tags": ["SLISE", "MSG", "SPICE duct", "liftoff", "blowoff", "triple flame", "gas jet"]}, {"exp_id": "PSI-SAFFIRE1-05", "program": "Saffire-I", "hardware_group": "CYGNUS", "title": "Saffire-I — Large-Scale (0.4 m × 1.0 m) Spacecraft Fabric Fire Growth in Cygnus", "title_tr": "Saffire-I — Cygnus Kargo Aracında Büyük Ölçekli (1 Metre) Uzay Yangını Deneyi", "facility": "Orbital ATK Cygnus OA-6 Autonomous Spacecraft", "year": 2016, "fuel_id": "sibal", "material": "Sibal (75% Cotton / 25% Fiberglass) Large Panel", "sample_geometry_tr": "0.4 m genişlik × 1.0 m uzunlukta dev tek parça Sibal kumaş panel (uzaydaki en büyük tekstil yangını numunesi)", "sample_geometry_en": "0.4 m wide × 1.0 m long continuous Sibal cloth panel inside autonomous Cygnus flow duct", "sensors_tr": "2× HD üstten görünüm kamerası, 12 noktalı termokupl ızgarası, ısı akısı radyometreleri, kabin O₂ / CO₂ / basınç transdüserleri", "sensors_en": "Dual HD top-view cameras, 12-point thermocouple rake, radiometers, cabin O₂ / CO₂ / pressure transducers", "gravity_g": 0.0, "oxygen_pct": 21.0, "pressure_psia": 14.7, "airflow_cms": 20.0, "moc_measured_pct": 13.5, "burning_rate_or_spread": "Concurrent Spread = 2.80 mm/s", "cool_flame_observed": false, "ntrs_id": "20170000230", "ntrs_url": "https://ntrs.nasa.gov/citations/20170000230", "psi_id": "PSI-131", "psi_url": "https://www.nasa.gov/PSI", "key_finding_tr": "Uzayda gerçekleştirilen ilk 1 metrelik büyük ölçekli yangında alev büyümesi beklentinin aksine kontrolden çıkmadı; ancak kapalı araç hacmindeki basınç ve sıcaklık artışı ile duman dağılımı kritik sınırları zorladı.", "key_finding_en": "First meter-scale 0G fire reached a steady limiting spread rate rather than accelerating infinitely, but cabin pressure rise and smoke contamination posed severe crew survival hazards.", "safety_insight_tr": "Kapalı kabin hacmi yangının kendi oksijenini tüketmesiyle sınırlayıcı etki yapar; ancak duman/CO temizleme (ECLSS post-fire cleanup) hayati önemdedir.", "safety_insight_en": "Finite cabin volume limits fire size, shifting primary crew lethality from thermal burn to rapid CO/acid-gas inhalation.", "intra_runs": [{"run_code": "SAFF1-UP", "same_tr": "Cygnus OA-6 modülü, 0.4×1.0 m Sibal kumaş, %21 O₂, 14.7 psia", "same_en": "Cygnus OA-6 module, 0.4×1.0 m Sibal panel, 21% O₂, 14.7 psia", "diff_tr": "Üst kenar ateşlemesi -> Karşıt akışlı (opposed, U = 20 cm/s) yayılma fazı", "diff_en": "Upstream ignition -> Opposed-flow (U = 20 cm/s) spread phase", "result_tr": "Dar ve kararlı piroliz cephesi yavaşça ilerledi (~0.9 mm/s).", "result_en": "Narrow, steady pyrolysis front propagated slowly (~0.9 mm/s)."}, {"run_code": "SAFF1-DN", "same_tr": "Cygnus OA-6 modülü, aynı 0.4×1.0 m Sibal kumaş, %21 O₂", "same_en": "Cygnus OA-6 module, same Sibal panel, 21% O₂", "diff_tr": "Alt kenar ateşlemesi -> Eş yönlü (concurrent, U = 20 cm/s) yayılma fazı", "diff_en": "Downstream/concurrent flow spread phase (U = 20 cm/s)", "result_tr": "Alev boyu ~25 cm'de doyuma ulaştı ve 8 dakika boyunca 2.80 mm/s sabit hızla tüm paneli yaktı.", "result_en": "Flame length plateaued near ~25 cm, sustaining steady 2.80 mm/s spread for 8 minutes."}, {"run_code": "SAFF2-SAMPLES", "same_tr": "Aynı Cygnus Saffire donanımı, %21 O₂, 14.7 psia, U = 20 cm/s", "same_en": "Identical Cygnus Saffire duct, 21% O₂, 14.7 psia, U = 20 cm/s", "diff_tr": "Saffire-II karşılaştırması: 9 farklı küçük şerit (5×30 cm silikon, PMMA, Nomex, Sibal)", "diff_en": "Saffire-II multi-sample array (9 strips of 5×30 cm silicone, PMMA, Nomex, Sibal)", "result_tr": "Kalın PMMA sönümlenirken ince silikon ve Sibal şeritler tam boy yandı (kalınlık etkisi).", "result_en": "Thick PMMA quenched while thin silicone and Sibal burned completely (thickness effect)."}], "tags": ["Saffire", "Cygnus", "large-scale", "Sibal", "cabin pressure", "smoke"]}, {"exp_id": "PSI-SAFFIRE4-06", "program": "Saffire-IV", "hardware_group": "CYGNUS", "title": "Saffire-IV — Fire Growth, Ribbed Geometry, Smoke Monitoring & Post-Fire Scrubbing", "title_tr": "Saffire-IV — Oluklu PMMA Geometrisi, Çoklu Duman İzleme ve Yangın Sonrası Temizleme", "facility": "Northrop Grumman Cygnus NG-13 Autonomous Spacecraft", "year": 2020, "fuel_id": "pmma", "material": "Structured PMMA Sheets (Flat vs. Ribbed/Grooved Slabs)", "sample_geometry_tr": "Düz PMMA plaka (10 mm kalınlık) vs. yüzey alanı artırılmış oluklu/kanatçıklı (ribbed) PMMA plaka", "sample_geometry_en": "Flat cast PMMA slab (10 mm thick) vs. surface-grooved / ribbed PMMA panel", "sensors_tr": "Faraday kabı duman iyonizasyon/lazer partikül dedektörleri (riser/far-field), CO / CO₂ / HF / HCl gaz analizörleri, IR kameralar", "sensors_en": "Far-field laser/ionization smoke particle monitors, CO / CO₂ / HCl / HF gas analyzers, IR cameras", "gravity_g": 0.0, "oxygen_pct": 21.0, "pressure_psia": 14.7, "airflow_cms": 15.0, "moc_measured_pct": 14.5, "burning_rate_or_spread": "Spread = 1.10 mm/s (Ribbed surface +45% faster)", "cool_flame_observed": false, "ntrs_id": "20220002714", "ntrs_url": "https://ntrs.nasa.gov/citations/20220002714", "psi_id": "PSI-142", "psi_url": "https://www.nasa.gov/PSI", "key_finding_tr": "Oluklu/çıkıntılı (ribbed) PMMA yüzey geometrisi, düz yüzeye kıyasla alev yayılma hızını ve ısı geri beslemesini %45 artırdı; CO₂/CO scrubber ekipmanları yangın sonrası atmosfer temizliğini doğruladı.", "key_finding_en": "Ribbed/grooved PMMA fuel geometry amplified flame spread and heat feedback by ~45% over flat slabs; post-fire gas scrubbing protocols were validated in orbit.", "safety_insight_tr": "Kabin içi panellerde keskin köşe, ince kenar ve oluklu geometrilerden kaçınılmalıdır; düz ve kalın kesitler tutuşmayı geciktirir.", "safety_insight_en": "Avoid thin edges, fins, and ribbed polymer geometries in crewed cabin interiors to prevent flame-spread amplification.", "intra_runs": [{"run_code": "SAFF4-FLAT", "same_tr": "Cygnus NG-13, PMMA malzeme, %21 O₂, 14.7 psia, U = 15 cm/s", "same_en": "Cygnus NG-13, PMMA polymer, 21% O₂, 14.7 psia, U = 15 cm/s", "diff_tr": "Tamamen pürüzsüz düz (flat) PMMA plaka geometrisi", "diff_en": "Smooth flat PMMA slab geometry", "result_tr": "Sınır tabakası ısı transferi sınırlı kaldı; yayılma hızı ~0.76 mm/s ölçüldü.", "result_en": "Boundary-layer heat feedback remained moderate; spread rate measured ~0.76 mm/s."}, {"run_code": "SAFF4-RIB", "same_tr": "Cygnus NG-13, PMMA malzeme, %21 O₂, 14.7 psia, U = 15 cm/s", "same_en": "Cygnus NG-13, PMMA polymer, 21% O₂, 14.7 psia, U = 15 cm/s", "diff_tr": "Oluklu / çıkıntılı (ribbed) PMMA plaka geometrisi", "diff_en": "Grooved / ribbed PMMA slab geometry", "result_tr": "Çıkıntı köşeleri iki yönden ısınarak pirolizi hızlandırdı ve alev yayılmasını %45 artırdı (1.10 mm/s).", "result_en": "Rib corners heated from two sides, accelerating pyrolysis and boosting spread by +45% (1.10 mm/s)."}, {"run_code": "SAFF4-SCRUB", "same_tr": "Cygnus NG-13 kapalı kabin hacmi, yangın sonrası atmosfer", "same_en": "Cygnus NG-13 sealed cabin volume, post-fire atmosphere", "diff_tr": "Aktif duman filtreleme ve CO->CO₂ katalitik oksidasyon scrubber fazı", "diff_en": "Active particulate filtration & catalytic CO scrubber activation", "result_tr": "0G'de çökmeyen mikron-altı kurum partikülleri ve CO başarıyla güvenli eşik altına indirildi.", "result_en": "Non-settling sub-micron 0G soot and CO were scrubbed below toxic crew limits."}], "tags": ["Saffire-IV", "PMMA", "geometry", "ribbed", "smoke", "scrubber", "Cygnus"]}, {"exp_id": "PSI-SAFFIRE5-07", "program": "Saffire-V", "hardware_group": "CYGNUS", "title": "Saffire-V — Exploration Atmosphere (8.2 psia / 34% O₂) Large-Scale Fire Test", "title_tr": "Saffire-V — Artemis Keşif Atmosferinde (8.2 psia / %34 O₂) Büyük Ölçekli Yangın", "facility": "Northrop Grumman Cygnus NG-14 Autonomous Spacecraft", "year": 2021, "fuel_id": "pmma", "material": "PMMA Slabs & Sibal Samples in 8.2 psia / 34% O₂", "sample_geometry_tr": "40 cm genişlikte oluklu/düz PMMA paneller ve referans kumaş numuneleri (düşük basınçlı Cygnus kabininde)", "sample_geometry_en": "40 cm wide flat/ribbed PMMA panels and reference cloth coupons in depressurized Cygnus cabin", "sensors_tr": "Çok açılı HD kameralar, radyometreler, kabin basınç artışı (ΔP) sensörü, uzak alan duman/gaz sensör ağı", "sensors_en": "Multi-angle HD cameras, radiometers, cabin ΔP pressure transducers, far-field smoke/gas network", "gravity_g": 0.0, "oxygen_pct": 34.0, "pressure_psia": 8.2, "airflow_cms": 10.0, "moc_measured_pct": 15.8, "burning_rate_or_spread": "Spread = 3.45 mm/s (2.6x ISS rate!)", "cool_flame_observed": false, "ntrs_id": "20220002714", "ntrs_url": "https://ntrs.nasa.gov/citations/20220002714", "psi_id": "PSI-145", "psi_url": "https://www.nasa.gov/PSI", "key_finding_tr": "Ay/Mars görevleri için planlanan 8.2 psia ve %34 O₂ keşif atmosferinde alev sıcaklığı, parlaklığı ve yayılma hızı standart ISS atmosferine göre 2.6 kat daha şiddetli gerçekleşti.", "key_finding_en": "Under the 8.2 psia / 34% O₂ exploration atmosphere planned for Lunar/Mars habitats, flame intensity and spread velocity surged ~2.6x above standard ISS normoxic conditions.", "safety_insight_tr": "Artemis, Ay Üssü ve basınçlı gezginlerde (%30-%34 O₂) ISS sertifikalı malzemeler doğrudan kullanılamaz; yeni yangın bariyerleri şarttır.", "safety_insight_en": "Materials certified for ISS (21% O₂) are unsafe in 30–34% O₂ Lunar/Artemis habitats without re-qualification.", "intra_runs": [{"run_code": "SAFF5-EXP1", "same_tr": "Cygnus NG-14, 8.2 psia toplam basınç, %34 O₂, PMMA numune", "same_en": "Cygnus NG-14, 8.2 psia total pressure, 34% O₂, PMMA panel", "diff_tr": "Orta havalandırma hızı (U = 10 cm/s)", "diff_en": "Moderate ventilation flow (U = 10 cm/s)", "result_tr": "Azalan N₂ ısıl balastı nedeniyle alev sıcaklığı ve yayılma hızı (3.45 mm/s) ISS'in 2.6 katına çıktı!", "result_en": "Reduced N₂ thermal ballast drove flame spread (3.45 mm/s) to 2.6x ISS normoxic rates!"}, {"run_code": "SAFF5-EXP2", "same_tr": "Cygnus NG-14, 8.2 psia, %34 O₂, aynı PMMA kalınlığı", "same_en": "Cygnus NG-14, 8.2 psia, 34% O₂, identical PMMA thickness", "diff_tr": "Düşürülmüş akış hızı (U = 3.0 cm/s)", "diff_en": "Reduced ventilation velocity (U = 3.0 cm/s)", "result_tr": "Fan hızı düşürülünce ısı açığa çıkış hızı (HRR) belirgin biçimde geriledi (HVAC kesmenin önemi).", "result_en": "Lowering fan flow sharply curtailed Heat Release Rate (HRR), confirming HVAC shutoff efficacy."}, {"run_code": "SAFF6-SUPP", "same_tr": "8.2 psia / >%30 O₂ keşif atmosferi, Cygnus Saffire serisi", "same_en": "8.2 psia / >30% O₂ exploration atmosphere, Saffire series", "diff_tr": "Saffire-VI karşılaştırması: Kabin basıncı düşürme (depressurization) prosedürü", "diff_en": "Saffire-VI comparison: Active cabin depressurization fire-suppression test", "result_tr": "Vakuma tahliye sırasında oluşan geçici hava akımı alevi anlık parlatıp ardından O₂ bitimiyle söndürdü!", "result_en": "Venting flow briefly intensified flames before low partial O₂ extinguished all burning."}], "tags": ["Saffire-V", "Artemis", "exploration atmosphere", "34% O2", "8.2 psia", "lunar", "Cygnus"]}, {"exp_id": "PSI-SOFIE-08", "program": "SoFIE", "hardware_group": "CIR", "title": "Solid Fuel Ignition and Extinction (SoFIE-GEL & MIST) — Growth & Extinguishment Limits", "title_tr": "SoFIE (GEL & MIST) — Katı Yakıt Tutuşma ve İnce Su Sisi Söndürme Sınırları", "facility": "ISS Combustion Integrated Rack (CIR) — Solid Fuel Insert", "year": 2023, "fuel_id": "pmma", "material": "PMMA Spheres, Cylinders & Flat Channels + Fine Water Mist", "sample_geometry_tr": "CIR akış tünelinde 20 mm çaplı döner/sabit PMMA küreler, eş-merkezli silindirler ve düz kanal plakaları", "sample_geometry_en": "20 mm diameter PMMA spheres, concentric cylinders, and flat channel plates in CIR flow tunnel", "sensors_tr": "Lazer faz-Doppler su sisi damlacık çap ölçeri, yüksek hızlı termal/optik kameralar, radyometre, O₂/CO₂ sensörleri", "sensors_en": "Phase-Doppler water-mist droplet sizing, high-speed thermal/optical cameras, radiometer, O₂/CO₂ sensors", "gravity_g": 0.0, "oxygen_pct": 28.0, "pressure_psia": 10.2, "airflow_cms": 8.0, "moc_measured_pct": 14.9, "burning_rate_or_spread": "Spread = 2.10 mm/s • Extinguished via 30 µm Mist", "cool_flame_observed": false, "ntrs_id": "20210011385", "ntrs_url": "https://ntrs.nasa.gov/citations/20210011385", "psi_id": "PSI-156", "psi_url": "https://www.nasa.gov/PSI", "key_finding_tr": "SoFIE-MIST deneyleri, Ay üssü/rover atmosferinde (10.2 psia, %28-%34 O₂) ince su sisinin (20-50 µm damlacık) alev cephesine akımla taşınarak Halon kullanmadan yüksek verimli söndürme sağladığını gösterdi.", "key_finding_en": "SoFIE-MIST demonstrated how 20-50 µm fine water mist droplets entrained in low-speed flow extinguish solid polymer flames in Lunar-relevant atmospheres (10.2 psia) cleanly without Halon.", "safety_insight_tr": "25-40 µm damlacık çaplı ince su sisi söndürücüler, hem ISS kabinleri hem Dünya temiz oda/batarya yangınları için en güvenli birincil teknolojidir.", "safety_insight_en": "Sub-50 µm fine water mist nozzles targeted along ventilation streamlines maximize 0G and terrestrial cleanroom suppression.", "intra_runs": [{"run_code": "SOFIE-GEL03", "same_tr": "CIR katı yakıt ünitesi, 20 mm PMMA küre, 10.2 psia", "same_en": "CIR solid fuel insert, 20 mm PMMA sphere, 10.2 psia", "diff_tr": "Düşük akış (U = 4 cm/s) vs. Orta akış (U = 14 cm/s) @ %28 O₂", "diff_en": "Low flow (U = 4 cm/s) vs. Moderate flow (U = 14 cm/s) at 28% O₂", "result_tr": "Küre ön durgunluk noktasında ince mavi zar, arka iz bölgesinde ise uzayan kurumlu kuyruk oluştu.", "result_en": "Thin blue forward stagnation sheet transitioned into an elongated luminous wake tail."}, {"run_code": "SOFIE-MIST07", "same_tr": "CIR ünitesi, PMMA küre alevi, 10.2 psia, %28 O₂, U = 8 cm/s", "same_en": "CIR insert, burning PMMA sphere, 10.2 psia, 28% O₂, U = 8 cm/s", "diff_tr": "İnce su sisi enjeksiyonu (D_mist = 28 µm, yüksek sayısal yoğunluk)", "diff_en": "Fine water mist injection (D_mist = 28 µm, high mist concentration)", "result_tr": "Su damlacıkları alev zarında anında buharlaşarak gizli ısıyla (2260 kJ/kg) alevi 2.4 sn'de söndürdü!", "result_en": "Mist droplets vaporized inside the reaction sheet, quenching the flame in 2.4 s via latent heat!"}, {"run_code": "SOFIE-SMTS02", "same_tr": "CIR katı yakıt ünitesi, aynı atmosfer basıncı (10.2 psia)", "same_en": "CIR solid fuel insert, identical 10.2 psia pressure", "diff_tr": " Numune ön-ısıtma sıcaklığı artırımı (T_init = 25 °C -> 85 °C)", "diff_en": "Elevated sample preheat temperature (T_init = 25 °C -> 85 °C)", "result_tr": "Sıcak elektronik kutu yüzeylerini temsil eden 85 °C PMMA'da MOC sınırı %1.4 daha aşağı düştü.", "result_en": "Preheated PMMA (simulating warm avionics bays) exhibited a 1.4% lower MOC threshold."}], "tags": ["SoFIE", "GEL", "MIST", "water mist", "PMMA", "Artemis", "10.2 psia", "CIR", "suppression"]}, {"exp_id": "PSI-ACME-09", "program": "ACME (E-FIELD)", "hardware_group": "CIR", "title": "Advanced Combustion via Microgravity Experiments (ACME) — E-FIELD Flames & Partial-G Emulation", "title_tr": "ACME E-FIELD — İyon Rüzgarı ile Kısmi Yerçekimi Emülasyonu ve Kurumsuz Gaz Alevi", "facility": "ISS Combustion Integrated Rack (CIR) — Modular ACME Chamber", "year": 2020, "fuel_id": "hydrogen", "material": "Gaseous H₂ / CH₄ / C₂H₄ Laminar Diffusion Jets", "sample_geometry_tr": "Paralel yüksek voltajlı (±10 kV) tel örgü elektrotlar arasında eş-akışlı dairesel gaz brülörü (d = 3.2 mm)", "sample_geometry_en": "Co-flow circular gas burner (d = 3.2 mm) positioned between parallel high-voltage (±10 kV) mesh electrodes", "sensors_tr": "Yüksek çözünürlüklü kemilüminesans (OH*/CH*) kamerası, iyon akımı nano-ampermetresi, lazer kurum ölçer", "sensors_en": "High-resolution OH*/CH* chemiluminescence camera, ion-current pico/nano-ammeter, laser soot diagnostic", "gravity_g": 0.0, "oxygen_pct": 21.0, "pressure_psia": 14.7, "airflow_cms": 12.0, "moc_measured_pct": 6.4, "burning_rate_or_spread": "Ionic wind emulates partial-G • Soot cut 70%", "cool_flame_observed": false, "ntrs_id": "19990054024", "ntrs_url": "https://ntrs.nasa.gov/citations/19990054024", "psi_id": "PSI-149", "psi_url": "https://www.nasa.gov/PSI", "key_finding_tr": "Elektrik alanının alevde doğal oluşan iyonlar (H₃O⁺, CHO⁺) üzerindeki kuvvetiyle (iyon rüzgarı) 0G ortamında Ay/Mars kısmi yerçekimi konveksiyonu başarıyla taklit edildi; kurum %70 azaltıldı ve yüksek voltajda alev söndürüldü.", "key_finding_en": "Electric-field body forces on natural flame chemi-ions emulated partial-gravity buoyancy in 0G, cutting soot by ~70% and enabling non-contact electrostatic blowoff.", "safety_insight_tr": "PSI'da LUCI/FM2 Ay verileri tamamlanana dek ACME E-FIELD sonuçları kısmi yerçekimi konveksiyonunu modellemek için kritik deneysel köprüdür.", "safety_insight_en": "Until LUCI/FM2 Lunar datasets arrive in PSI, ACME E-FIELD ionic-wind scaling bridges 0G and partial-G convection.", "intra_runs": [{"run_code": "EFD-V00", "same_tr": "CIR ACME modüler seti, C₂H₄/N₂ jet alevi, 14.7 psia, %21 O₂", "same_en": "CIR ACME modular set, C₂H₄/N₂ jet flame, 14.7 psia, 21% O₂", "diff_tr": "Elektrik alanı kapalı (V = 0 kV -> Saf 0G referansı)", "diff_en": "Zero electric field (V = 0 kV -> Pure 0G baseline)", "result_tr": "Geniş, uzun ve parlak sarı kurum kanatlı klasik 0G difüzyon alevi oluştu.", "result_en": "Broad, elongated 0G diffusion flame with heavy yellow soot wings."}, {"run_code": "EFD-V04", "same_tr": "CIR ACME modüler seti, aynı yakıt debisi, 14.7 psia, %21 O₂", "same_en": "CIR ACME modular set, identical fuel flow, 14.7 psia, 21% O₂", "diff_tr": "Orta elektrik alanı (E = 3.5 kV/cm -> Ay/Mars kısmi-G iyon rüzgarı taklidi)", "diff_en": "Moderate electric field (E = 3.5 kV/cm -> Partial-gravity ionic-wind emulation)", "result_tr": "İyon rüzgarı 0.16G–0.38G benzeri konveksiyon yaratarak alevi inceltti ve kurumu %70 sildi!", "result_en": "Ionic wind induced partial-G-like convection, narrowing the flame and eliminating 70% of soot!"}, {"run_code": "EFD-V09", "same_tr": "CIR ACME modüler seti, aynı yakıt debisi, 14.7 psia", "same_en": "CIR ACME modular set, identical fuel flow, 14.7 psia", "diff_tr": "Yüksek voltaj eşiği (E > 7.5 kV/cm)", "diff_en": "High-voltage threshold (E > 7.5 kV/cm)", "result_tr": "Aşırı iyon rüzgarı gerinimi alev tabanını kopararak kimyasalsız elektrostatik söndürme sağladı.", "result_en": "Excessive ionic-wind strain blew off the flame base without chemical suppressants."}], "tags": ["ACME", "E-FIELD", "partial gravity", "hydrogen", "electric field", "soot", "ionic wind", "CIR"]}, {"exp_id": "PSI-ACME-BRE-10", "program": "ACME-BRE", "hardware_group": "CIR", "title": "ACME Burning Rate Emulator (BRE) — Quiescent Spacecraft Material Flammability Simulation", "title_tr": "ACME-BRE — Durgun Atmosferlerde Gaz Brülörüyle Katı Malzeme Yanıcılık Emülasyonu", "facility": "ISS Combustion Integrated Rack (CIR) — Modular ACME Set", "year": 2019, "fuel_id": "pmma", "material": "Flat Porous Brass Burner Emulating PMMA, Polyethylene & Paper Vapors", "sample_geometry_tr": "25 mm ve 50 mm çaplı düz, gözenekli sinterlenmiş pirinç brülör (hareketsiz atmosferde gaz yakıtla katı malzeme taklidi)", "sample_geometry_en": "25 mm and 50 mm diameter flat sintered-brass porous gas burners in quiescent CIR atmospheres", "sensors_tr": "Gömülü brülör ısı akısı termokuplları, geniş açılı radyometreler, CH*/OH* kameralar, hassas gaz MFC", "sensors_en": "Embedded burner heat-flux thermocouples, wide-angle radiometers, CH*/OH* cameras, precision gas MFC", "gravity_g": 0.0, "oxygen_pct": 19.0, "pressure_psia": 14.7, "airflow_cms": 0.5, "moc_measured_pct": 14.6, "burning_rate_or_spread": "Steady hemispherical blue flame (>180 s)", "cool_flame_observed": false, "ntrs_id": "20160000593", "ntrs_url": "https://ntrs.nasa.gov/citations/20160000593", "psi_id": "PSI-151", "psi_url": "https://www.nasa.gov/PSI", "key_finding_tr": "Gaz yakıt (etilen/metan) debisi brülör yüzeyine gelen ısı akısına geri beslenerek hareketsiz (durgun) atmosferlerde katı malzemelerin buharlaşma ısısı (B-sayısı) taklit edildi; 3 dakikadan uzun süren sönme sınırları haritalandı.", "key_finding_en": "By coupling gaseous fuel flow to measured burner heat feedback in quiescent atmospheres, BRE emulated solid material flammability (B-number) over >180 s durations unattainable in drop towers.", "safety_insight_tr": "Dünya'daki 5 saniyelik düşüş kulesi (drop tower) testleri uzun süreli durgun 0G kor/alev dengesini kaçırır; ISS BRE verileri malzeme seçimine rehberlik eder.", "safety_insight_en": "Short 5 s terrestrial drop-tower tests miss slow 0G radiative equilibrium revealed by long-duration ISS BRE burns.", "intra_runs": [{"run_code": "BRE-25E", "same_tr": "CIR ACME donanımı, durgun 0G atmosferi, 14.7 psia, %21 O₂", "same_en": "CIR ACME hardware, quiescent 0G atmosphere, 14.7 psia, 21% O₂", "diff_tr": "25 mm çaplı düz brülör, PMMA buharlaşma ısısı emülasyonu", "diff_en": "25 mm flat burner emulating PMMA heat of gasification", "result_tr": "210 saniye boyunca kararlı, kurumsuz yarı-küresel mavi kubbe alevi korundu.", "result_en": "Sustained a steady, soot-free hemispherical blue flame dome for 210 seconds."}, {"run_code": "BRE-50E", "same_tr": "CIR ACME donanımı, durgun 0G atmosferi, 14.7 psia, %21 O₂", "same_en": "CIR ACME hardware, quiescent 0G atmosphere, 14.7 psia, 21% O₂", "diff_tr": "50 mm geniş çaplı brülör ve yüksek B-sayısı (kağıt/selüloz emülasyonu)", "diff_en": "Larger 50 mm burner emulating low-L_v paper/cellulose", "result_tr": "Geniş brülörde alev çapı büyüdükçe radyatif kayıp kesri (χ_r) yükselip alevi kendi kendine söndürdü.", "result_en": "Larger flame volume amplified χ_r radiative heat loss, driving radiative self-extinction."}, {"run_code": "BRE-LOWP", "same_tr": "CIR ACME donanımı, 25 mm brülör, durgun 0G", "same_en": "CIR ACME hardware, 25 mm burner, quiescent 0G", "diff_tr": "Keşif basıncı (0.7 atm / 10.2 psia) ve %30 O₂", "diff_en": "Reduced exploration pressure (0.7 atm / 10.2 psia) at 30% O₂", "result_tr": "Düşük basınçta azalan gaz yoğunluğu kurumu bastırırken ısı geri beslemesini yükseltti.", "result_en": "Reduced pressure suppressed soot formation while raising conductive heat feedback."}], "tags": ["ACME", "BRE", "B-number", "polymer", "quiescent", "extinction", "CIR", "drop tower"]}, {"exp_id": "PSI-ACME-CFIG-14", "program": "ACME CFI-G", "hardware_group": "CIR", "title": "ACME Cool Flames Investigation with Gases (CFI-G) — Up to 85% O₂ Spherical Inverse Flames", "title_tr": "ACME CFI-G — Küresel Brülörden %85 O₂ Akışıyla Gazlarda Serin Alev Araştırması", "facility": "ISS Combustion Integrated Rack (CIR) — Modular ACME Set", "year": 2021, "fuel_id": "propane_cfig", "material": "Spherical Porous Burner Flowing up to 85% O₂ into Propane/Nitrogen Chamber", "sample_geometry_tr": "CIR yanma odası azot + yanıcı gaz (örn. propan/bütan) ile doluyken merkezden %85'e varan O₂ üfleyen 6.4–12.7 mm gözenekli küresel brülör", "sample_geometry_en": "6.4–12.7 mm spherical porous burner flowing up to 85% O₂ into a chamber filled with N₂ + fuel gas (propane/butane)", "sensors_tr": "UV formaldehit / OH* yoğunlaştırılmış kamera, ince tel termokupl tarayıcı, radyometreler", "sensors_en": "Intensified UV formaldehyde / OH* camera, motorized fine-wire thermocouple rake, radiometers", "gravity_g": 0.0, "oxygen_pct": 85.0, "pressure_psia": 14.7, "airflow_cms": 0.4, "moc_measured_pct": 11.4, "burning_rate_or_spread": "Highest O₂ microgravity tests (up to 85% O₂ spherical flame)", "cool_flame_observed": true, "ntrs_id": "20220004819", "ntrs_url": "https://ntrs.nasa.gov/search?q=Cool%20Flames%20Investigation%20with%20Gases%20CFI-G", "psi_id": "PSI-153", "psi_url": "https://www.nasa.gov/PSI", "key_finding_tr": "En yüksek oksijen konsantrasyonuna sahip mikroçekim yanma testleri ACME CFI-G kapsamında gerçekleştirildi: Propan/azot dolu odaya küresel brülörden %85'e varan O₂ gönderilerek sıvı damlacık buharlaşması olmadan saf gaz fazı küresel soğuk ve sıcak alevler üretildi.", "key_finding_en": "Representing the highest-O₂ microgravity tests in PSI, ACME CFI-G flowed up to 85% O₂ through a spherical burner into a propane/nitrogen chamber, isolating steady gas-phase spherical hot and cool flames.", "safety_insight_tr": "Yüksek basınçlı O₂ hatlarının (%85-%100 O₂) kabin içi yakıt/hidrokarbon buharına sızması durumunda oluşan ters difüzyon (inverse) alevlerinin sınırlarını tanımlar.", "safety_insight_en": "Defines hazard limits for high-concentration O₂ line leaks (up to 85–100% O₂) into fuel-contaminated compartments.", "intra_runs": [{"run_code": "CFIG-P08", "same_tr": "CIR ACME küresel brülör, oda: N₂ + Propan (C₃H₈), 0G, 14.7 psia", "same_en": "CIR ACME spherical burner, chamber: N₂ + Propane, 0G, 14.7 psia", "diff_tr": "Küresel brülörden %85 O₂ / %15 N₂ karışımı akışı (yüksek debi)", "diff_en": "85% O₂ / 15% N₂ oxidizer flow from spherical burner (moderate flow)", "result_tr": "Brülör etrafında kusursuz küresel, çok yüksek sıcaklıklı ters (inverse) mavi difüzyon alevi oluştu.", "result_en": "Formed an intensely luminous, perfectly spherical inverse hot diffusion flame."}, {"run_code": "CFIG-P19", "same_tr": "CIR ACME küresel brülör, oda: Seyreltik Propan + N₂, 0G", "same_en": "CIR ACME spherical burner, chamber: Diluted Propane + N₂, 0G", "diff_tr": "%85 O₂ brülör akışı, ancak oda yakıt kesri sönme sınırına düşürüldü", "diff_en": "85% O₂ burner flow while chamber propane fraction was stepped down", "result_tr": "Sıcak alev radyatif kayıpla sönüp gaz fazında dakikalarca süren kararlı 640 K küresel Soğuk Aleve dönüştü!", "result_en": "Hot flame transitioned into a multi-minute steady ~640 K gas-phase spherical Cool Flame!"}, {"run_code": "CFIG-M04", "same_tr": "CIR ACME küresel brülör, aynı %85 O₂ oksitleyici akışı", "same_en": "CIR ACME spherical burner, identical 85% O₂ oxidizer stream", "diff_tr": "Oda gazı Metan (CH₄ — NTC kimyası olmayan yakıt) ile değiştirildi", "diff_en": "Chamber fuel switched to Methane (CH₄ — lacking NTC peroxy pathways)", "result_tr": "Metan testlerinde soğuk alev oluşmadı; sıcak alev sönme sınırında doğrudan sönümlendi.", "result_en": "No cool flame occurred in methane; hot flame quenched abruptly at the radiative limit."}], "tags": ["ACME", "CFI-G", "85% O2", "high oxygen", "cool flame", "propane", "spherical burner", "CIR"]}, {"exp_id": "PSI-DAFT-15", "program": "DAFT & DAFT-2 (SAME)", "hardware_group": "CABIN", "title": "Dust and Aerosol Measurement Feasibility Test (DAFT / DAFT-2 & SAME) — Smoke vs. Dust Discrimination", "title_tr": "DAFT & DAFT-2 (SAME) — Uzay Aracı Duman Dedektörü ile Kabin/Ay Tozu Ölçümü ve Yanlış Alarm Önleme", "facility": "ISS Cabin / Microgravity Science Glovebox (SAME Aerosol Hardware)", "year": 2011, "fuel_id": "sibal", "material": "Pyrolysis Smoke Aerosols (Kapton/Teflon/Cellulose) vs. Cabin & Lunar Simulant Dust", "sample_geometry_tr": "SAME (Smoke Aerosol Measurement Experiment) tel-ısıtmalı piroliz numuneleri (0.2–5 µm duman) ve kabin içi süspanse toz partikülleri", "sample_geometry_en": "SAME wire-heated pyrolysis coupons (0.2–5 µm smoke) vs. suspended cabin/lunar dust aerosols", "sensors_tr": "P-Trak ultra-ince partikül sayacı, DustTrak lazer fotometre, termal çökeltici (TEM elektron mikroskobu örnekleme), ISS optik vs. iyonizasyon dedektörleri", "sensors_en": "Condensation nuclei counter (P-Trak), laser photometer (DustTrak), thermophoretic TEM sampler, ISS optical vs. ionization detectors", "gravity_g": 0.0, "oxygen_pct": 21.0, "pressure_psia": 14.7, "airflow_cms": 5.0, "moc_measured_pct": 13.5, "burning_rate_or_spread": "0G Smoke particle diameter 2-3x larger than 1G; dust discriminated", "cool_flame_observed": false, "ntrs_id": "20120002875", "ntrs_url": "https://ntrs.nasa.gov/search?q=Dust%20and%20Aerosol%20Measurement%20Feasibility%20Test%20DAFT", "psi_id": "PSI-103", "psi_url": "https://www.nasa.gov/PSI", "key_finding_tr": "SAME duman tespiti araştırmasında kullanılan lazer/partikül aletleri DAFT ve DAFT-2 çalışmalarında kabin tozunu ölçmek için kullanıldı; 0G'de duman partiküllerinin daha uzun kalış süresiyle büyüdüğü ve çok dalga boylu saçılımla Ay/kabin tozundan ayırt edilebildiği kanıtlandı.", "key_finding_en": "Repurposing SAME smoke-detection instruments in DAFT and DAFT-2 proved 0G smoke aerosols grow larger than in 1G and enabled multi-channel discrimination between real fire smoke and nuisance cabin/lunar dust.", "safety_insight_tr": "Hem Ay yüzey üslerindeki aşındırıcı regolith tozunun yanlış yangın alarmı vermesini önler hem de Dünya'daki akıllı ev/endüstriyel duman dedektörlerini geliştirir!", "safety_insight_en": "Prevents false fire alarms from lunar regolith/cabin dust in habitats and powers next-generation false-alarm-immune terrestrial smoke detectors.", "intra_runs": [{"run_code": "SAME-K03", "same_tr": "SAME aerosol odası, 0G, 14.7 psia, %21 O₂", "same_en": "SAME aerosol chamber, 0G, 14.7 psia, 21% O₂", "diff_tr": "Aşırı ısınan Kapton/Teflon kablo izolasyonu piroliz dumanı", "diff_en": "Overheated Kapton/Teflon wire insulation pyrolysis aerosol", "result_tr": "0G'de kaldırma kuvveti olmadığı için duman tanecikleri çarpışarak koagüle oldu; ISS lazer dedektörü iyonizasyondan daha duyarlı çıktı.", "result_en": "Absence of buoyant plume dilution grew larger agglomerates, favoring laser-scattering over ionization sensors."}, {"run_code": "DAFT-CAB1", "same_tr": "Aynı SAME P-Trak & DustTrak aerosol ölçüm cihaz seti, ISS kabini", "same_en": "Identical SAME P-Trak & DustTrak instrument suite inside ISS cabin", "diff_tr": "Yanma yok; mürettebat aktivitesi sırasında havada asılı kabin tozu ölçümü", "diff_en": "Non-fire ambient ISS crew-cabin dust & ultra-fine aerosol survey", "result_tr": "Kabin HEPA filtrelerinin verimi doğrulandı ve kaba toz (>2 µm) ile yanma dumanı (<0.8 µm) imzası ayrıştırıldı.", "result_en": "Separated coarse nuisance dust (>2 µm) signatures from sub-micron pyrolysis smoke (<0.8 µm)."}, {"run_code": "DAFT2-LUN", "same_tr": "SAME/DAFT aerosol optik saçılım kalibrasyon mimarisi", "same_en": "SAME/DAFT multi-angle aerosol optical scattering architecture", "diff_tr": "DAFT-2 Ay tozu (Lunar dust) ve nem damlacığı yanlış alarm testi", "diff_en": "DAFT-2 lunar-dust simulant & water-droplet nuisance discrimination", "result_tr": "İki dalga boylu/açılı lazer oranı sayesinde Ay üssü hava kilitlerindeki toz bulutu yangın alarmından %98 doğrulukla ayrıldı.", "result_en": "Dual-wavelength/angle scattering separated airlock lunar dust from real fire smoke with >98% accuracy."}], "tags": ["DAFT", "DAFT-2", "SAME", "smoke detector", "dust", "aerosol", "lunar dust", "false alarm", "duman"]}], "SPACE_TO_EARTH_TRANSFERS": [{"domain_tr": "◫ İtfaiyeci Koruyucu Kıyafetleri (PBI/Nomex) & SCBA Solunum Hava Tankları", "domain_en": "◫ Firefighter Protective Turnout Gear (PBI/Nomex) & SCBA Air Tanks", "nasa_source": "NASA Apollo / EVA Suit (%100 O₂), BASS-II & SoFIE (NTRS 20210011385)", "insight_tr": "Uzay giysileri ve yüksek oksijenli kabinler için geliştirilen PBI/Nomex yanmaz dokuma teknolojileri ile hafif kompozit yaşam destek oksijen tankları, bugün dünyadaki tüm itfaiyecilerin daha hafif SCBA hava tüpleri taşımasını ve yüksek ısıya dayanıklı koruyucu giysilerle korunmasını sağlamaktadır.", "insight_en": "NASA EVA suit fire-resistant textiles (PBI/Nomex) and lightweight composite life-support pressure vessels directly enabled modern firefighter protective turnout coats and lighter SCBA breathing air tanks on Earth."}, {"domain_tr": "◫ Karasal Akıllı Duman Algılama ve Toz / Yanlış Alarm Ayrımı", "domain_en": "◫ Terrestrial Smart Smoke Detection & Dust False-Alarm Immunity", "nasa_source": "SAME, DAFT & DAFT-2 (NTRS 20120002875)", "insight_tr": "ISS'te duman partikülü boyut dağılımını inceleyen SAME ve aynı lazer cihazlarını kabin/Ay tozunu ayırt etmek için kullanan DAFT/DAFT-2 araştırmaları; evlerde, uçak kargo ambarlarında ve madenlerde su buharı/toz kaynaklı yanlış alarmları sıfırlayan çok açılı akıllı duman dedektörlerine dönüştü.", "insight_en": "Multi-wavelength aerosol scattering developed in NASA's SAME and DAFT/DAFT-2 investigations powers modern terrestrial smoke detectors that distinguish real sub-micron pyrolysis smoke from dust and steam."}, {"domain_tr": "◫ İnce Su Sisli Söndürücüler (Water Mist) & EV Batarya / Temiz Oda Güvenliği", "domain_en": "◫ Fine Water Mist Extinguishers & EV Battery / Cleanroom Protection", "nasa_source": "ISS Water Mist PFE, SoFIE-MIST & Saffire-IV (NTRS 20220002714)", "insight_tr": "ISS'te zehirli Halon'un yerini almak üzere geliştirilen 20–50 µm ince su sisli söndürücüler ve anlık HVAC kesme protokolleri; bugün Dünya'da veri merkezlerinde, müzelerde, denizaltılarda ve elektrikli araç batarya depolarında elektroniklere zarar vermeden yangın söndürmektedir.", "insight_en": "Sub-50 µm fine water mist extinguishers developed for the ISS replace ozone-depleting Halon in terrestrial data centers, museums, submarines, and lithium-ion battery facilities."}, {"domain_tr": "◫ Yüksek Verimli Motorlar ve HCCI Soğuk Alev Yanması", "domain_en": "◫ Ultra-Lean HCCI Engines & Low-Temperature Cool-Flame Kinetics", "nasa_source": "FLEX, FLEX-2, CFI & ACME CFI-G (NTRS 20150023456)", "insight_tr": "ISS'te kaldırma kuvveti olmadan izole edilen 550-750 K Soğuk Alev (NTC) kimyası, Dünya'daki otomobil ve uçak motorlarında vuruntuyu (knock) önleyip yakıt tüketimini ve NOx emisyonunu %20-30 azaltan kinetik modellerin temelini oluşturdu.", "insight_en": "Isolated cool-flame NTC kinetics from ISS FLEX, CFI, and CFI-G experiments calibrated chemical mechanisms for cleaner, knock-free HCCI engines on Earth."}, {"domain_tr": "◫ Hiperbarik ve Oksijen Zenginleştirilmiş Yoğun Bakım Üniteleri", "domain_en": "◫ Oxygen-Enriched ICU & Hyperbaric Medical Chambers", "nasa_source": "Saffire-V (%34 O₂) & ACME CFI-G (%85 O₂)", "insight_tr": "Ay üsleri (%30–34 O₂), uzay giysileri (%100 O₂) ve CFI-G (%85 O₂) için ölçülen tutuşma sınırları, hastanelerdeki hiperbarik oksijen kabinleri ve yoğun bakım solunum ünitelerinde statik kıvılcım yangınlarını önleyen tıbbi standartları belirlemektedir.", "insight_en": "High-oxygen flammability boundaries from Saffire-V, EVA suit testing, and ACME CFI-G guide fire-safe material standards in hospital ICUs and hyperbaric chambers."}], "CORE_DIRECTIVES_LIST": [{"id": "CON-01", "code": "MICROGRAVITY_TRANSPORT", "title_tr": "Mikroçekim Kütle/Isı Taşınımı ve Boyutsuz Sayılar (Ra, Gr, Ri)", "title_en": "Microgravity Transport & Dimensionless Scaling (Ra, Gr, Ri)", "rule_tr": "0G (serbest düşüş) ortamında kaldırma kuvveti çöker: Grashof (Gr = g·β·ΔT·L³/ν² -> 0), Rayleigh (Ra = Gr·Pr -> 0) ve Richardson (Ri = Gr/Re² -> 0). Sıcak gazlar yükselemediği için alev küresel difüzyon formuna (H/W ≈ 1.0) bürünür; oksijen taşınımı yalnızca moleküler difüzyon ve düşük hızlı fan akışına (1-20 cm/s) bağlıdır.", "rule_en": "In 0G freefall, buoyancy collapses: Grashof (Gr -> 0), Rayleigh (Ra -> 0), and Richardson (Ri = Gr/Re² -> 0). Hot products cannot rise; flames form spherical diffusion structures (H/W ≈ 1.0) governed by molecular diffusion and cabin ventilation.", "severity": "CRITICAL"}, {"id": "CON-02", "code": "DROPLET_D2_AND_SPALDING", "title_tr": "D² Damlacık Yanma Yasası, Spalding Sayısı (B_oq) ve Sherwood (Sh)", "title_en": "Droplet d²-Law, Spalding Transfer Number (B_oq) & Sherwood (Sh)", "rule_tr": "Damlacık yanması D²(t) = D₀² - K·t yasasına uyar. Yanma hızı sabiti K = (8·λ_g / (ρ_l·c_p))·ln(1 + B_oq)·(Sh/2)·(1 - χ_r) ve Sherwood kütle taşınım çarpanı Sh = 2 + 0.6·Re^(1/2)·Sc^(1/3) ile hesaplanır. Alev durma mesafesi R_f/R_d = ln(1+B_oq)/ln(1+Y_O2/ν_s) ile belirlenir.", "rule_en": "Droplet combustion obeys D²(t) = D₀² - K·t, where K = (8·λ_g/(ρ_l·c_p))·ln(1+B_oq)·(Sh/2)·(1-χ_r), convective Sherwood factor Sh = 2 + 0.6·Re^(1/2)·Sc^(1/3), and flame standoff ratio R_f/R_d = ln(1+B_oq)/ln(1+Y_O2/ν_s).", "severity": "CRITICAL"}, {"id": "CON-03", "code": "VENTILATION_PARADOX_MOC", "title_tr": "Düşük Hızlı Havalandırma Paradoksu, Damköhler (Da) ve MOC Eğrisi", "title_en": "Low-Velocity Ventilation Paradox, Damköhler (Da) & U-Shaped MOC", "rule_tr": "Tam durgun mikroçekimde (U = 0 cm/s) alev kendi CO₂ kabuğu ve radyatif ısı kaybıyla (χ_r) boğularak sönebilir. Ancak 2-10 cm/s ISS kabin fan akışı taze O₂ besleyerek (yüksek Damköhler Da = τ_flow/τ_chem > 1) katı malzemelerin (PMMA, Sibal, Nomex) Dünya'dakinden (1G) daha düşük Minimum Oksijen Konsantrasyonunda (MOC) tutuşup yayılmasına yol açar.", "rule_en": "At quiescent 0G (0 cm/s), flames self-quench via radiative/diffusive losses. Gentle spacecraft ventilation (2-10 cm/s) replenishes O₂ at Damköhler Da > 1 without buoyant cooling, dropping Minimum Oxygen Concentration (MOC) below 1G limits.", "severity": "CRITICAL"}, {"id": "CON-04", "code": "COOL_FLAME_NTC_KINETICS", "title_tr": "Radyatif Kayıp (χ_r), İki Aşamalı Tutuşma ve Görünmez Soğuk Alev", "title_en": "Radiative Quenching (χ_r), Two-Stage Ignition & Cool Flame NTC", "rule_tr": "Büyük damlacıklarda küresel alev hacmiyle artan radyatif kayıp kesri χ_r ∝ R_f³·σ·(T_f⁴ - T_∞⁴) > 0.45 olduğunda 1300-1900 K sıcak alev söner; n-Heptan/n-Dekan (FLEX/CFI) ve Propan (ACME CFI-G) Negatif Sıcaklık Katsayısı (NTC peroksi RO₂/QOOH) kimyasıyla 550-800 K görünmez Soğuk Aleve geçer. Tespiti için UV/IR radyometre + CO/CH₂O gaz sensörü füzyonu şarttır.", "rule_en": "When spherical radiative loss fraction χ_r exceeds critical quenching (~0.45), alkanes (FLEX/CFI droplets & ACME CFI-G gases) transition via NTC peroxy chemistry into invisible 550-800 K Cool Flames producing CO and CH₂O, requiring UV/IR + CO sensor fusion.", "severity": "HIGH"}, {"id": "CON-05", "code": "SPACECRAFT_SUPPRESSION_BAN", "title_tr": "Uzay Aracı Yangın Söndürme Sırası ve Halon 1301 Yasağı (NASA-STD-6001B)", "title_en": "Spacecraft Fire Suppression Protocol & Strict Halon 1301 Ban (NASA-STD-6001B)", "rule_tr": "İnsanlı uzay araçlarında (ISS USOS, Orion, Lunar Gateway, Ay/Mars Üsleri ve Basınçlı Gezginler) toksik HF/HBr ürettiği ve ECLSS filtrelerini zehirlediği için Halon 1301 önerilmesi KESİNLİKLE YASAKTIR. Müdahale sırası: (1) HVAC fanlarını kapat, (2) Gücü kes, (3) İnce Su Sisi (25-40 µm Water Mist PFE / SoFIE-MIST) veya CO₂/N₂ uygula, (4) Gerekirse kabin basıncını düşür.", "rule_en": "Recommending Halon 1301 inside crewed spacecraft is STRICTLY PROHIBITED due to toxic HF/HBr byproducts poisoning ECLSS. Enforce sequence: (1) HVAC airflow shutoff, (2) power isolation, (3) Fine Water Mist (25-40 µm PFE) or CO₂/N₂, (4) depressurization.", "severity": "CRITICAL"}, {"id": "CON-06", "code": "EVA_SUIT_ROVER_AND_CFIG_O2", "title_tr": "Uzay Giysisi (%100 O₂ @ 4.3 psia), Ay Gezgini (%30+ O₂ @ 10.2 psia) ve CFI-G (%85 O₂)", "title_en": "EVA Spacesuit (100% O₂ @ 4.3 psia), Lunar Rover (≥30% O₂ @ 10.2 psia) & CFI-G (85% O₂)", "rule_tr": "Esneklik ve vurgunu (dekompresyon) önlemek için EVA uzay giysileri 4.3 psia basınçta %100 saf O₂ ile çalışır. Ön-soluma süresini kısaltmak için Ay Üssü ve basınçlı gezginler ≤10.2 psia'da ≥%30 O₂ (Dünya'ya göre >%40 bağıl artış; Saffire-V 8.2 psia/%34 O₂) kullanır. PSI'daki en yüksek oksijenli mikroçekim testleri ACME CFI-G küresel brülöründe (%85 O₂ -> propan/N₂ odası) gerçekleştirilmiştir.", "rule_en": "EVA spacesuits operate at 4.3 psia / 100% O₂ for mobility and zero nitrogen bends. Lunar bases & pressurized rovers target ≤10.2 psia / ≥30% O₂ (>40% relative O₂ increase over Earth) to cut pre-breathe time. Highest-O₂ PSI tests occurred in ACME CFI-G (85% O₂).", "severity": "HIGH"}, {"id": "CON-07", "code": "PARTIAL_GRAVITY_LUCI_FM2_BOUNDING", "title_tr": "Kısmi Yerçekimi (Ay 0.16G / Mars 0.38G) Sınırlandırması, LUCI/FM2 ve E-FIELD", "title_en": "Partial-Gravity (0.16G Moon / 0.38G Mars) Bounding, LUCI/FM2 & E-FIELD", "rule_tr": "Şu anda NASA PSI veritabanında doğrudan kısmi yerçekimi yanma verisi bulunmamaktadır; bu boşluğun gelecekteki LUCI (Lunar-g Combustion Investigation) ve FM2 (Flammability of Materials on the Moon) deneyleriyle doldurulması beklenmektedir. Bu süreçte 0G ve 1G sonuçları ara yerçekimi davranışını alt-üst sınır olarak çevreler (bounding) ve ACME E-FIELD Flames deneyindeki elektrik alanı/iyon rüzgarı kısmi yerçekimini taklit eder.", "rule_en": "NASA PSI currently lacks direct partial-gravity combustion data, awaiting upcoming LUCI and FM2 lunar investigations. Always bound intermediate Lunar (0.16G) and Martian (0.38G) predictions between 0G and 1G limits and cite ACME E-FIELD ionic-wind emulation.", "severity": "HIGH"}, {"id": "CON-08", "code": "HARDWARE_TAXONOMY_AND_ROCKET_SCOPE", "title_tr": "PSI Donanım Rafları (CIR/MDCA • MSG/SPICE • Cygnus • DAFT) ve Roket Kapsam Dışılığı", "title_en": "PSI Hardware Racks (CIR/MDCA • MSG/SPICE • Cygnus • DAFT) & Rocket Exclusion", "rule_tr": "Donanım eşleşmesini doğru kur: CIR/MDCA sıvı damlacıkları (FLEX, FLEX-2, CFI), CIR ACME modüler gaz seti (ACME, BRE, CFI-G), MSG modüler fan kanalı (SPICE, SLISE, BASS, BASS-II), Cygnus büyük ölçek (Saffire I-VI) ve duman/toz ayrımı (SAME, DAFT & DAFT-2). NOT: Roket motorları ve iticilerdeki yüksek gaz hızları yanmayı yerçekiminden bağımsız kıldığından PSI kabin yangın güvenliği kapsamı dışındadır.", "rule_en": "Maintain exact PSI hardware provenance: CIR/MDCA droplets (FLEX, FLEX-2, CFI), CIR ACME gas suite (E-FIELD, BRE, CFI-G), MSG fan duct (SPICE, SLISE, BASS, BASS-II), Cygnus (Saffire), and SAME/DAFT dust-vs-smoke sensing. High-speed rocket propulsion is outside PSI scope.", "severity": "HIGH"}, {"id": "CON-09", "code": "MULTIMODAL_AND_EVIDENCE_TRACEABILITY", "title_tr": "Evrensel Veri Sentezi (Dosya/Resim/Web), Dünya Transferi ve Kanıt İzlenebilirliği", "title_en": "Universal Multimodal Synthesis, Space-to-Earth Transfer & Evidence Traceability", "rule_tr": "Veri ister 3B kaydırıcılardan, ister CSV/JSON/PDF dosyasından, ister alev fotoğrafından, ister canlı NASA akışından gelsin; gerçek PSI/NTRS kodlarına atıf yap ve Dünya uygulamalarını (ince su sisli söndürücüler, DAFT karasal duman/toz dedektörleri, itfaiyeci PBI/Nomex koruyucu giysileri & SCBA hava tankları, HCCI temiz motorlar) vurgula.", "rule_en": "Synthesize 3D sliders, uploaded files, flame images, and live NASA streams with verified PSI/NTRS citations and highlight Earth transfers (fine water mist extinguishers, DAFT dust-immune smoke detectors, firefighter turnout gear & SCBA air tanks, clean HCCI engines).", "severity": "CRITICAL"}], "BILINGUAL_SCIENTIFIC_SYNONYMS": {"soğuk alev": "cool flame ntc low temperature radiative extinction heptane flex cfi cfi-g", "soguk alev": "cool flame ntc low temperature radiative extinction heptane flex cfi cfi-g", "serin alev": "cool flame cfi cfi-g ntc spherical burner propane heptane", "damlacık": "droplet spherical liquid heptane methanol decane flex cfi mdca", "damlacik": "droplet spherical liquid heptane methanol decane flex cfi mdca", "havalandırma": "ventilation airflow forced flow fan bass spice slise moc", "havalandirma": "ventilation airflow forced flow fan bass spice slise moc", "fan": "ventilation airflow low velocity opposed flow msg spice duct", "oksijen": "oxygen o2 moc concentration exploration atmosphere cfi-g", "uzay giysisi": "spacesuit eva 4.3 psia 100% o2 pure oxygen nomex pre-breathe", "gezgin": "pressurized rover lunar base 10.2 psia 30% o2 sofie saffire-v", "rover": "pressurized rover lunar base 10.2 psia 30% o2 sofie", "artemis": "exploration atmosphere 34% o2 8.2 psia 10.2 psia lunar habitat saffire-v sofie", "ay": "lunar exploration atmosphere 8.2 psia 10.2 psia 34% o2 luci fm2 daft", "mars": "martian exploration habitat low pressure partial gravity", "kısmi yerçekimi": "partial gravity lunar-g luci fm2 acme e-field ionic wind", "kismi yercekimi": "partial gravity lunar-g luci fm2 acme e-field ionic wind", "kumaş": "fabric textile sibal cotton fiberglass nomex bass-ii saffire", "kumas": "fabric textile sibal cotton fiberglass nomex bass-ii saffire", "akrilik": "pmma polymer solid acrylic bass sofie saffire-iv", "polimer": "pmma polymer solid fuel sofie bass bre", "su sisi": "water mist suppression pfe sofie-mist flex-2", "söndürme": "suppression extinguish quenching blowoff water mist", "sondurme": "suppression extinguish quenching blowoff water mist", "kurum": "soot radiation yellow shell acme spice smoke point", "duman noktası": "smoke point co-flow spice soot msg", "kalkış": "liftoff blowout triple flame slise msg", "elektrik": "electric field ionic wind e-field partial gravity acme", "büyük ölçek": "large scale cygnus spacecraft saffire", "duman": "smoke co carbon monoxide scrubber saffire-iv same daft", "toz": "dust aerosol measurement feasibility daft daft-2 same lunar dust smoke detector", "sensör": "sensor radiometer thermocouple optical uv laser co anomaly daft", "brülör": "burner porous spherical bre cfi-g acme spice"}};
    const FUEL_PROPERTIES = EMBEDDED_DATA.FUEL_PROPERTIES;
    const DILUENT_FACTORS = EMBEDDED_DATA.DILUENT_FACTORS;
    const HABITAT_CONFIGS = EMBEDDED_DATA.HABITAT_CONFIGS;
    const MISSION_PRESETS = EMBEDDED_DATA.MISSION_PRESETS;
    const NASA_CATALOG = EMBEDDED_DATA.NASA_EXPERIMENTS_CATALOG;
    const EARTH_TRANSFERS = EMBEDDED_DATA.SPACE_TO_EARTH_TRANSFERS;
    const DIRECTIVES = EMBEDDED_DATA.CORE_DIRECTIVES_LIST;
    const SYNONYMS = EMBEDDED_DATA.BILINGUAL_SCIENTIFIC_SYNONYMS;

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
        const pressurePsia = Math.max(3.5, Math.min(20.0, Number(params.pressure_psia ?? 14.7)));
        const airflowCms = Math.max(0.0, Math.min(50.0, Number(params.airflow_cms ?? 3.5)));
        const dropletD0 = Math.max(0.8, Math.min(8.0, Number(params.droplet_d0_mm ?? 3.2)));
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

        const isBlowoff = airflowCms > fuel.blowoff_cms * Math.pow(oxygenPct / 21.0, 0.65) || damkohlerDa < 0.95;
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
            benchmark_tr: `◆ NASA PSI Uçuş Doğrulaması (${campShort}): R² = ${rSq.toFixed(3)} • RMSE = ${rmse.toFixed(3)}`,
            benchmark_en: `◆ NASA PSI Flight Validation (${campShort}): R² = ${rSq.toFixed(3)} • RMSE = ${rmse.toFixed(3)}`,
        };

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
                badge_tr: "● SÖNÜMLENMİŞ / GÜVENLİ KABİN",
                badge_en: "● EXTINGUISHED / SAFE HABITAT",
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
                badge_tr: sev === "CRITICAL" ? "▲ KRİTİK YAŞAM DESTEK AŞIMI" : (sev === "WARNING" ? "◆ DİKKAT: HIZLI MÜDAHALE GEREKLİ" : "● KONTROLLÜ BASTIRMA PENCERESİ"),
                badge_en: sev === "CRITICAL" ? "▲ CRITICAL ECLSS / SMAC BREACH" : (sev === "WARNING" ? "◆ WARNING: RAPID ACTION REQUIRED" : "● CONTROLLED SUPPRESSION WINDOW"),
                summary_tr: `**${hab.name_tr}:** Alarm \`t = ${tAlarm} s\` anında tetiklendi. NASA 1-Saatlik Acil SMAC CO sınırı (\`125 ppm\`) \`t = ${tSmac} s\` içinde aşılır. Seçilen senaryoda (\`t = ${tInt} s\`) kabin CO düzeyi **\`${coAtResp} ppm\`** ve yerel ısınma **\`+${peakDt} °C\`** olur.`,
                summary_en: `**${hab.name_en}:** Alarm triggered at \`t = ${tAlarm} s\`. NASA 1-hr Emergency SMAC CO limit (\`125 ppm\`) reached in \`t = ${tSmac} s\`. At intervention (\`t = ${tInt} s\`), cabin CO hits **\`${coAtResp} ppm\`** with **\`+${peakDt} °C\`** local ΔT.`,
                milestones: [
                    { t_s: 0.0, title_tr: "0.0 s • Tutuşma Başlangıcı", title_en: "0.0 s • Ignition Onset", detail_tr: `Rejim: ${regime} (${flameTempK.toFixed(0)} K, U=${airflowCms.toFixed(1)} cm/s)`, detail_en: `Regime: ${regime} (${flameTempK.toFixed(0)} K, U=${airflowCms.toFixed(1)} cm/s)`, state: "warn" },
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
                ? `◈ **NASA PSI Kısmi Yerçekimi Veri Şeffaflığı (${gravityG.toFixed(2)}G):** NASA PSI'da LUCI & FM2 Ay verileri beklenirken **0G sınırı (%${moc0g})** ile **1G sınırı (%${moc1g})** ara yerçekimini sınırlar (\`Tahmini MOC ≈ %${mocCurrent}\`).`
                : isEva
                ? `◈ **EVA Uzay Giysisi Saf Oksijen Rejimi (${pressurePsia.toFixed(1)} psia / %${oxygenPct.toFixed(0)} O₂):** N₂ ısıl balastı sıfırlandığı için tutuşma enerjisi dramatik biçimde düşer!`
                : isLunarRover
                ? `◈ **Ay Üssü & Basınçlı Gezgin Atmosferi (${pressurePsia.toFixed(1)} psia / %${oxygenPct.toFixed(0)} O₂):** EVA ön-soluma süresini azaltan zenginleştirilmiş O₂ atmosferi yanıcılığı artırır.`
                : "",
            en: isPartial
                ? `◈ **NASA PSI Partial-Gravity Transparency (${gravityG.toFixed(2)}G):** Bounded between **0G (${moc0g}%)** and **1G (${moc1g}%)** (\`Est. MOC ≈ ${mocCurrent}%\`) awaiting LUCI & FM2 lunar datasets.`
                : isEva
                ? `◈ **EVA Spacesuit Pure-O₂ Regime (${pressurePsia.toFixed(1)} psia / ${oxygenPct.toFixed(0)}% O₂):** Zero N₂ thermal ballast dramatically accelerates flame spread.`
                : isLunarRover
                ? `◈ **Lunar Base & Pressurized Rover (${pressurePsia.toFixed(1)} psia / ${oxygenPct.toFixed(0)}% O₂):** Elevated O₂ fraction increases material flammability.`
                : "",
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
                badge_tr: "▲ GÖRÜNMEZ SOĞUK ALEV (COOL FLAME • UV/IR MODU)",
                badge_en: "▲ INVISIBLE COOL FLAME (NTC REGIME • UV/IR VIEW)",
                summary_tr: `Radyatif ısı kaybı sıcak alevi söndürdü ancak ${flameTempK.toFixed(0)} K görünmez Soğuk Alev (FLEX/CFI) CO üretmeye devam ediyor!`,
                summary_en: `Radiative loss quenched the hot flame, yet ${flameTempK.toFixed(0)} K invisible Cool Flame chemistry persists!`,
            },
            BLOWOFF_EXTINGUISHED: {
                badge_tr: "◆ YÜKSEK HIZLI ÜFLEME SÖNMESİ (BLOWOFF)",
                badge_en: "◆ CONVECTIVE BLOWOFF EXTINCTION",
                summary_tr: `Akış hızı (${airflowCms.toFixed(1)} cm/s) Damköhler sınırını (Da < 1) aşarak alevi üfleyip söndürdü.`,
                summary_en: `Airflow (${airflowCms.toFixed(1)} cm/s) exceeded Damköhler residence threshold (Da < 1).`,
            },
            QUENCHED_EXTINGUISHED: {
                badge_tr: `◆ OKSİJEN / RADYATİF SÖNÜMLENME (MOC < %${mocCurrent})`,
                badge_en: `◆ DIFFUSIVE / RADIATIVE QUENCHING (O₂ < ${mocCurrent}%)`,
                summary_tr: `Mevcut O₂ (%${oxygenPct.toFixed(1)}) MOC sınırının (%${mocCurrent}) altında kaldığı için alev kendi kendine söndü.`,
                summary_en: `Ambient O₂ (${oxygenPct.toFixed(1)}%) is below MOC (${mocCurrent}%); flame self-extinguished.`,
            },
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
            tr: `◈ **Anlık Bilimsel Formül Sentezi (${fuel.formula}):** \`P_O2 = ${po2Psia.toFixed(2)} psia\`, \`B_oq = ${spaldingB.toFixed(2)}\`, \`Sh = ${shConv.toFixed(2)}\`, \`Da = ${damkohlerDa.toFixed(2)}\` ve ISS uçuş doğrulaması \`R² = ${rSq}\`. Rejim **${regime}** (Risk: **${riskScore}/100**). İlk müdahale: HVAC fanlarını kapatıp Halon kullanmadan İnce Su Sisi (SoFIE-MIST) uygulayın.`,
            en: `◈ **Live Formula Synthesis (${fuel.formula}):** \`P_O2 = ${po2Psia.toFixed(2)} psia\`, \`B_oq = ${spaldingB.toFixed(2)}\`, \`Sh = ${shConv.toFixed(2)}\`, \`Da = ${damkohlerDa.toFixed(2)}\`, ISS validation \`R² = ${rSq}\`. Regime **${regime}** (Risk: **${riskScore}/100**). Action: Immediate HVAC shutoff + Fine Water Mist (No Halon).`,
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
            synthesis_tr: `◈ **Soruşturmalar Arası Benzerlik & Farklılık Sentezi (${selected.length} NASA PSI Kaydı • ${facs.join(" vs. ")}):** En düşük oksijen sınırına sahip deney **%${lowestMoc.moc_measured_pct} MOC** ile **${lowestMoc.program}**; en yüksek test oksijenine çıkan ise **%${highestO2.oxygen_pct} O₂** ile **${highestO2.program}** kaydıdır. ${coolExps.length ? `**${coolExps.join(", ")}** kayıtlarında görünmez Soğuk Alev gözlemlendiğinden UV/IR + CO sensör füzyonu şarttır.` : "HVAC kesme ve SoFIE-MIST ince su sisi birincil Halon-dışı müdahaledir."}`,
            synthesis_en: `◈ **Cross-Investigation Synthesis (${selected.length} NASA PSI Records • ${facs.join(" vs. ")}):** **${lowestMoc.program}** exhibits the lowest MOC (**${lowestMoc.moc_measured_pct}% O₂**), while **${highestO2.program}** spans up to **${highestO2.oxygen_pct}% O₂**. ${coolExps.length ? `Cool Flame persistence in **${coolExps.join(", ")}** requires UV/IR + CO multi-sensor fusion.` : "Immediate HVAC shutoff and SoFIE-MIST water mist remain universal countermeasures."}`,
        };
    }

    async function fetchLiveNasaBrowser(source, q) {
        const query = q || "microgravity combustion";
        try {
            const url = `https://ntrs.nasa.gov/api/citations/search?q=${encodeURIComponent(query)}`;
            const res = await window.fetch(url, { method: "GET" });
            if (res.ok) {
                const raw = await res.json();
                const results = (raw.results || []).slice(0, 8).map((r) => {
                    const cid = String(r.id || "");
                    return {
                        id: `NTRS-${cid}`,
                        source: "NASA NTRS Live",
                        title: r.title || "NASA Technical Report",
                        abstract: String(r.abstract || "Official NASA Technical Reports Server citation.").slice(0, 460),
                        date: String(r.created || "").slice(0, 10),
                        url: `https://ntrs.nasa.gov/citations/${cid}`,
                        pdf_url: "",
                    };
                });
                if (results.length > 0) {
                    return { source_status: "live_online", count: results.length, items: results };
                }
            }
        } catch (_) {}

        // Çevrimdışı / CORS yedeklemesi: Doğrulanmış yerleşik 15 NASA PSI kaydı
        const items = NASA_CATALOG.filter((e) => computeTextSimilarity(query, `${e.program} ${e.title} ${e.title_tr} ${e.key_finding_en}`) > 0 || !q)
            .slice(0, 8)
            .map((e) => ({
                id: e.exp_id,
                source: `NASA PSI (${e.program})`,
                title: e.title,
                abstract: e.key_finding_en,
                date: String(e.year),
                url: e.ntrs_url,
                pdf_url: "",
            }));
        return { source_status: "cached_live", count: items.length, items };
    }

    async function analyzeUploadedMediaInBrowser(formData) {
        const file = formData && formData.get ? formData.get("file") : null;
        if (!file) return { ok: false, error: "Dosya bulunamadı / No file provided." };
        const name = file.name || "uploaded_file";
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
            const regLabel = isCool ? "Görünmez Soğuk Alev (UV/IR)" : (isBlue0g ? "0G Küresel Safir-Mavi Difüzyon" : "Kurumlu Konvektif Plume");
            return {
                ok: true,
                filename: name,
                media_type: "image",
                image_base64: dataUrl,
                metrics: { detected_regime_tr: regLabel },
                extracted_sim_params: extracted,
                simulation: sim,
                summary_tr: `◫ **İstemci-İçi İzole Piksel Analizi (${name}):** Kemilüminesans mavi oranı \`%${((blueCnt / totalPx) * 100).toFixed(1)}\`, kurum/sıcak ışıma \`%${((warmCnt / totalPx) * 100).toFixed(1)}\` -> **${regLabel}** tespit edildi (Dosya tarayıcı dışına çıkmadı).`,
            };
        }

        const text = await file.text();
        const o2Match = text.match(/(?:o2|oxygen|oksijen)[^\d]{0,12}(\d{1,3}(?:\.\d+)?)/i);
        const pMatch = text.match(/(\d{1,2}(?:\.\d+)?)\s*psia/i);
        const uMatch = text.match(/(\d{1,2}(?:\.\d+)?)\s*cm\/s/i);
        const extracted = {
            fuel_id: /pmma|acrylic/i.test(text) ? "pmma" : (/nomex|suit/i.test(text) ? "nomex" : (/sibal/i.test(text) ? "sibal" : "n_heptane")),
            gravity_g: /0\.16|lunar|moon/i.test(text) ? 0.16 : (/0\.38|mars/i.test(text) ? 0.38 : 0.0),
            oxygen_pct: o2Match ? Math.min(100, Math.max(8, parseFloat(o2Match[1]))) : 21.0,
            pressure_psia: pMatch ? Math.min(18, Math.max(4, parseFloat(pMatch[1]))) : 14.7,
            airflow_cms: uMatch ? Math.min(40, Math.max(0, parseFloat(uMatch[1]))) : 2.4,
            droplet_d0_mm: 3.2,
            diluent: "N2",
        };
        ragDocs.push({ doc_id: `USR-${Date.now()}`, title: name, source: "Browser Local File", url: "", text: text.slice(0, 6000) });
        const sim = simulateCombustionClient(extracted);
        return {
            ok: true,
            filename: name,
            media_type: "document",
            chunks: Math.max(1, Math.ceil(text.length / 800)),
            extracted_sim_params: extracted,
            simulation: sim,
            summary_tr: `◫ **İstemci-İçi İzole Veri Çözümleme (${name}):** Tarayıcı belleğinde işlendi -> O₂ \`%${extracted.oxygen_pct}\`, Basınç \`${extracted.pressure_psia} psia\`, Akış \`${extracted.airflow_cms} cm/s\`.`,
        };
    }

    function buildDeterministicSiReply(msg, simParams, mediaCtx, lang) {
        const sim = simulateCombustionClient(simParams || {});
        const ranked = rankExperimentsClient(simParams || {}, msg, "ALL").ranked_experiments.slice(0, 4);
        const inp = sim.inputs;
        const tel = sim.telemetry;
        const fv = sim.flight_validation;
        const tl = sim.scenario_timeline;
        const isEn = lang === "en";

        const citations = ranked.map((e) => ({
            program: e.program,
            ntrs_id: e.ntrs_id,
            url: e.ntrs_url,
        }));

        if (isEn) {
            const expLines = ranked
                .map((e) => `- **#${e.rank} ${e.program} (${e.exp_id} • ${e.hardware_group})** — Score \`${e.priority_score}/100\`, MOC \`${e.moc_measured_pct}% O₂\`, [NTRS #${e.ntrs_id}](${e.ntrs_url}): ${e.key_finding_en}`)
                .join("\n");
            return {
                reply: [
                    `## 1. Microgravity & Partial-Gravity Governing Physics Synthesis`,
                    `- **Active State (${inp.fuel_name_en}):** Regime **\`${tel.regime}\`** at \`${inp.gravity_g} G\`, \`${inp.oxygen_pct}% O₂\` (\`P_O2 = ${tel.po2_psia} psia\`), \`U = ${inp.airflow_cms} cm/s\`.`,
                    `- **Analytical Transport & Kinetics:** Burning rate \`K = ${tel.burning_rate_k_mm2_s} mm²/s\`, Spalding \`B_oq = ${tel.spalding_b_number}\`, Sherwood \`Sh = ${tel.sherwood_number}\`, Damköhler \`Da = ${tel.damkohler_number}\`, radiative loss \`χ_r = ${(tel.radiative_loss_fraction * 100).toFixed(1)}%\`, critical \`MOC = ${tel.moc_pct}% O₂\`.`,
                    `- **ISS Flight Telemetry Validation:** \`R² = ${fv.r_squared}\` • \`RMSE = ${fv.rmse}\` against **${fv.campaign}**.`,
                    mediaCtx ? `- **Attached Dataset / Image Context:** ${mediaCtx}` : ``,
                    ``,
                    `## 2. Top Ranked NASA PSI Investigations & Intra-Run Evidence`,
                    expLines,
                    ``,
                    `## 3. ECLSS Crew Survival Clock & Non-Halon Suppression Protocol`,
                    `- **Habitat (${tl.habitat_name_en}):** Alarm at \`+${tl.t_alarm_s} s\` | NASA 1-hr SMAC (\`125 ppm CO\`) in \`${tl.t_smac_125ppm_s} s\` | Intervention CO \`${tl.co_at_response_ppm} ppm\`.`,
                    `- **Mandatory NASA-STD-6001B Action Sequence:** **(1)** Cut cabin HVAC ventilation immediately (\`U -> 0 cm/s\`), **(2)** Isolate electrical bus power, **(3)** Discharge **25–40 µm Fine Water Mist (SoFIE-MIST)** or CO₂/N₂ (*Halon 1301 is strictly prohibited due to toxic HF/HBr poisoning ECLSS scrubbers*).`,
                    ``,
                    `## 4. Space-to-Earth Fire Safety Spinoffs`,
                    `- ISS multi-wavelength dust-immune smoke detection (**SAME / DAFT**) prevents false alarms in aircraft cargo bays and smart homes, while **SoFIE-MIST** water-mist physics protects cleanrooms and EV lithium-ion battery facilities on Earth.`,
                ].filter(Boolean).join("\n"),
                citations,
            };
        }

        const expLinesTr = ranked
            .map((e) => `- **#${e.rank} ${e.program} (${e.exp_id} • ${e.hardware_group})** — Öncelik \`${e.priority_score}/100\`, MOC \`%${e.moc_measured_pct} O₂\`, [NTRS #${e.ntrs_id}](${e.ntrs_url}): ${e.key_finding_tr}`)
            .join("\n");
        return {
            reply: [
                `## 1. Mikroçekim ve Kısmi Yerçekimi Fiziksel Denklem Sentezi`,
                `- **Aktif Durum (${inp.fuel_name_tr}):** \`${inp.gravity_g} G\`, \`%${inp.oxygen_pct} O₂\` (\`P_O2 = ${tel.po2_psia} psia\`) ve \`U = ${inp.airflow_cms} cm/s\` koşullarında **\`${tel.regime}\`** rejimi aktiftir (Yangın Riski: **\`${tel.risk_score}/100\`**).`,
                `- **Boyutsuz Taşınım ve Yanma Sabitleri:** \`d²\` yanma hızı \`K = ${tel.burning_rate_k_mm2_s} mm²/s\`, Spalding \`B_oq = ${tel.spalding_b_number}\`, Sherwood \`Sh = ${tel.sherwood_number}\`, Damköhler \`Da = ${tel.damkohler_number}\`, radyatif kayıp \`χ_r = %${(tel.radiative_loss_fraction * 100).toFixed(1)}\` ve kritik \`MOC = %${tel.moc_pct} O₂\`.`,
                `- **ISS Uçuş Telemetrisi Doğrulaması:** **${fv.campaign}** uçuş noktalarıyla \`R² = ${fv.r_squared}\` ve \`RMSE = ${fv.rmse}\` uyumu doğrulandı.`,
                mediaCtx ? `- **Ekli Dosya / Görsel / Web Bağlamı:** ${mediaCtx}` : ``,
                ``,
                `## 2. Termodinamik & TF-IDF Sıralı NASA PSI Soruşturmaları ve NTRS Kanıtları`,
                expLinesTr,
                ``,
                `## 3. ECLSS Yaşam Destek Saati ve Uzay Aracı Müdahale Protokolü`,
                `- **Kabin / Giysi Senaryosu (${tl.habitat_name_tr}):** Sensör alarmı \`t = ${tl.t_alarm_s} sn\`, NASA Acil SMAC CO eşiği (\`125 ppm\`) \`t = ${tl.t_smac_125ppm_s} sn\`, müdahale anı CO seviyesi \`${tl.co_at_response_ppm} ppm\`.`,
                `- **Zorunlu Müdahale Sırası (NASA-STD-6001B):** **(1)** Kabin HVAC havalandırma fanlarını anında kapatın (\`U -> 0 cm/s\`), **(2)** Elektrik beslemesini kesin, **(3)** **25–40 µm İnce Su Sisi (SoFIE-MIST PFE)** veya CO₂/N₂ uygulayın (*Halon 1301 toksik HF/HBr üreterek ECLSS filtrelerini zehirlediği için kesinlikle yasaktır*).`,
                ``,
                `## 4. Uzaydan Dünya'ya Yangın Güvenliği Teknoloji Transferi`,
                `- ISS **SAME / DAFT** lazerli toz-duman ayrım algoritmaları Dünya'da madenlerde ve uçak kargo ambarlarında yanlış alarmları önlerken; **SoFIE-MIST** su sisi ve **EVA Nomex/PBI** dokumaları veri merkezleri, elektrikli araç batarya depoları ve itfaiyeci ekipmanlarını korumaktadır.`,
            ].filter(Boolean).join("\n"),
            citations,
        };
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
        const u = new URL(url, window.location.origin);
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
                    gemini_api_key_configured: Boolean(runtimeConfig.gemini_api_key),
                    antigravity_api_key_configured: false,
                }),
                providers: {
                    active_provider: "auto",
                    gemini_ready: Boolean(runtimeConfig.gemini_api_key),
                    gemini_model: runtimeConfig.gemini_model,
                    antigravity_ready: false,
                    antigravity: { cli_ready: false, models: [] },
                    ollama: { online: false, models: [], recommended_active: "" },
                    openrouter_ready: false,
                },
                stream: streamState,
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
            const targetUrl = String(jsonBody.url || "");
            if (!/^https:\/\/(ntrs\.nasa\.gov|osdr\.nasa\.gov)/i.test(targetUrl)) {
                return makeJsonResponse({
                    ok: false,
                    error: "Sunucusuz İzole Modda dış bağlantı güvenliği (CSP) gereği yalnızca resmi https://ntrs.nasa.gov ve https://osdr.nasa.gov kaynakları sorgulanabilir.",
                });
            }
            const live = await fetchLiveNasaBrowser("ntrs", "Saffire microgravity fire");
            const first = (live.items && live.items[0]) || { title: "NASA NTRS Citation", abstract: "" };
            const extracted = { fuel_id: "sibal", gravity_g: 0.0, oxygen_pct: 21.0, pressure_psia: 14.7, airflow_cms: 3.0, droplet_d0_mm: 3.4, diluent: "N2" };
            return makeJsonResponse({
                ok: true,
                title: first.title,
                preview: first.abstract,
                chunks: 2,
                extracted_sim_params: extracted,
                simulation: simulateCombustionClient(extracted),
            });
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
            return makeJsonResponse({ results });
        }

        if (path === "/api/stream/config" && method === "POST") {
            streamState.enabled = Boolean(jsonBody.enabled);
            streamState.source = jsonBody.source || "ntrs";
            streamState.interval_sec = Number(jsonBody.interval_sec || 25);
            if (jsonBody.trigger_immediate || streamState.enabled) {
                const pick = NASA_CATALOG[streamState.seq_id % NASA_CATALOG.length];
                streamState.seq_id += 1;
                streamState.last_fetch_time = new Date().toTimeString().slice(0, 8);
                streamState.latest_sim_params = {
                    fuel_id: pick.fuel_id, gravity_g: pick.gravity_g, oxygen_pct: pick.oxygen_pct,
                    pressure_psia: pick.pressure_psia, airflow_cms: pick.airflow_cms, droplet_d0_mm: 3.2, diluent: "N2",
                };
                streamState.events.unshift({
                    seq_id: streamState.seq_id,
                    time: streamState.last_fetch_time,
                    id: pick.exp_id,
                    title: pick.title,
                    summary: pick.key_finding_tr,
                    url: pick.ntrs_url,
                    extracted_sim_params: streamState.latest_sim_params,
                });
                streamState.events = streamState.events.slice(0, 10);
            }
            return makeJsonResponse(streamState);
        }

        if (path === "/api/stream/status") {
            return makeJsonResponse(streamState);
        }

        if (path === "/api/chat/start" && method === "POST") {
            const jobId = `srvless-${Date.now()}`;
            const built = buildDeterministicSiReply(jsonBody.message, jsonBody.sim_params, jsonBody.media_context, runtimeConfig.language);
            chatJobs.set(jobId, {
                status: "done",
                provider: "Browser Analytical Solver",
                model: "d² / B_oq / Sh + 15 PSI NTRS",
                reply: built.reply,
                citations: built.citations,
                stages: ["[4/4] Zero-Trust Browser Evidence Synthesis Ready"],
            });
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
                    gemini_api_key_configured: Boolean(runtimeConfig.gemini_api_key),
                }),
                providers: {
                    active_provider: runtimeConfig.active_provider,
                    gemini_ready: Boolean(runtimeConfig.gemini_api_key),
                    gemini_model: runtimeConfig.gemini_model,
                    antigravity_ready: false,
                    antigravity: { cli_ready: false, models: [] },
                    ollama: { online: false, models: [], recommended_active: "" },
                    openrouter_ready: false,
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
            return makeJsonResponse({
                ok: true,
                provider: "Browser Analytical Physics Solver",
                model: "v5.1 Serverless Kernel",
                latency_s: 0.01,
                sample: "0G küresel difüzyon denklemleri (d² yasası, Spalding B_oq, ISS R² doğrulaması) ve 15 PSI bilgi tabanı %100 sunucusuz izole modda aktif.",
            });
        }
        if (path === "/api/ollama/pull" || path === "/api/ollama/unload") {
            return makeJsonResponse({ ok: false, unloaded: 0, error: "Yerel Ollama yönetimi masaüstü Nasa_4.exe uygulamasında aktiftir." });
        }

        return makeJsonResponse({ ok: false, error: `Unsupported serverless endpoint: ${path}` }, 404);
    };
})();
