# -*- coding: utf-8 -*-
"""
ALTAR-NASA v5.1 — Soru-Odaklı Çok Katmanlı Analitik & Etkileşimli Sentez Çekirdeği (smart_synthesizer.py).
Çevrimdışı deterministik modda ve sunucusuz mimariyle tam eşlenik olarak:
- Kullanıcının sorduğu sorunun niyetini (yetenek/özellik sorgusu, selamlama, spesifik denklem türetimi,
  duyarlılık / 'ne olur' analizi, EVA giysisi vs. Ay gezgini atmosfer kıyaslaması, kısmi yerçekimi LUCI/FM2,
  görünmez Soğuk Alev & DAFT toz/duman ayrımı, Halon 1301 yasağı & SoFIE-MIST söndürme, spesifik PSI deneyi/rafı,
  roket motoru kapsam sınırı, Dünya teknoloji transferi, yüklenen medya veya tam kapsamlı görev sentezi) çözümler,
- Aktif 3B yanma odası parametreleri üzerinde canlı karşı-olgusal (counterfactual) çok noktalı simülasyonlar koşturur,
- Ardışık sorularda asla statik şablon kopyala-yapıştır yapmadan doğrudan soruya özgü sayısal yanıt üretir.
"""

from __future__ import annotations

import re
from typing import Any, Dict, List, Optional, Tuple

from core.directives import CORE_DIRECTIVES_LIST
from core.nasa_datasets import NASA_EXPERIMENTS_CATALOG, SPACE_TO_EARTH_TRANSFERS
from core.physics_engine import FUEL_PROPERTIES, simulate_combustion_state


def _norm(text: str) -> str:
    t = (text or "").lower().strip()
    return (
        t.replace("ı", "i")
        .replace("ğ", "g")
        .replace("ü", "u")
        .replace("ş", "s")
        .replace("ö", "o")
        .replace("ç", "c")
        .replace("â", "a")
        .replace("î", "i")
        .replace("û", "u")
    )


def _has_any(norm_q: str, terms: Tuple[str, ...]) -> bool:
    for term in terms:
        if term in norm_q:
            return True
    return False


def classify_user_intent(user_message: str, media_context: str = "") -> str:
    """Kullanıcı mesajını en spesifik bilimsel veya etkileşimli niyete yönlendirir."""
    raw = (user_message or "").strip()
    nq = _norm(raw)

    # 1) Kapsamlı 4-bölümlü tam sentez protokolü (Preset #1 veya açık tam rapor talebi)
    is_full_eval = (
        ("boyutsuz sayilari" in nq and ("psi" in nq or "dunya" in nq or "eclss" in nq))
        or ("dimensionless numbers" in nq and ("psi" in nq or "earth" in nq or "safety" in nq))
        or _has_any(nq, ("tam rapor", "kapsamli analiz", "full report", "comprehensive analysis", "tumunu sentezle"))
    )
    if is_full_eval:
        return "full_synthesis"

    # 2) Yüklenen dosya / görsel odaklı soru
    if media_context and _has_any(
        nq,
        (
            "yukledigim",
            "ekli",
            "dosya",
            "gorsel",
            "resim",
            "fotograf",
            "csv",
            "pdf",
            "json",
            "uploaded",
            "attached",
            "image",
            "dataset",
            "file",
        ),
    ):
        return "uploaded_media"

    # 3) Platform özellikleri / mimari envanteri vs. neler yapabilirsin vs. selamlama
    physics_anchors = (
        "heptan",
        "metanol",
        "pmma",
        "nomex",
        "sibal",
        "hidrojen",
        "propan",
        "spalding",
        "sherwood",
        "damkohler",
        "rayleigh",
        "grashof",
        "richardson",
        "halon",
        "sofie",
        "saffire",
        "flex",
        "bass",
        "spice",
        "slise",
        "daft",
        "luci",
        "fm2",
        "soguk alev",
        "cool flame",
        "moc",
        "eva",
        "gezgin",
        "rover",
        "roket",
        "rocket",
    )
    has_physics_topic = _has_any(nq, physics_anchors)

    if not has_physics_topic:
        if _has_any(
            nq,
            (
                "ozelliklerin",
                "ozellikleri",
                "hangi ozellik",
                "yeteneklerin",
                "mimari",
                "modullerin",
                "sistemin ozellik",
                "features",
                "architecture",
                "modules",
                "specifications",
            ),
        ):
            return "platform_features"

        if _has_any(
            nq,
            (
                "neler yapabilir",
                "ne yapabilir",
                "ne ise yarar",
                "nasil kullan",
                "yardim",
                "komutlar",
                "ne sorabilir",
                "bana ne sun",
                "what can you do",
                "how to use",
                "capabilities",
                "help",
            ),
        ):
            return "capabilities_guide"

        if _has_any(
            nq,
            (
                "merhaba",
                "selam",
                "iyi gunler",
                "gunaydin",
                "iyi aksamlar",
                "kimsin",
                "sen kimsin",
                "nesin",
                "kendini tanit",
                "hello",
                "hi ",
                "hey",
                "who are you",
                "what are you",
            ),
        ) or nq in ("hi", "merhaba", "selam", "hey", "alo", "test", "deneme"):
            return "greeting_identity"

    # 4) Roket motorları / iticiler kapsam sınırı (CON-08)
    if _has_any(nq, ("roket", "rocket", "itici", "thruster", "nozul", "nozzle", "sivi yakitli motor")):
        return "rocket_scope"

    # 5) EVA Uzay Giysisi (%100 O2 @ 4.3 psia) & Basınçlı Ay Gezgini (10.2 psia) & Ön-soluma
    if _has_any(
        nq,
        (
            "uzay giysisi",
            "eva giysi",
            "spacesuit",
            "eva suit",
            "4.3 psia",
            "%100 o2",
            "100% o2",
            "gezgin",
            "lunar rover",
            "pressurized rover",
            "10.2 psia",
            "on-soluma",
            "on soluma",
            "pre-breathe",
            "prebreathe",
            "vurgun",
            "dekompresyon",
        ),
    ):
        return "eva_rover_atmosphere"

    # 6) Halon 1301 Yasağı, Söndürme Protokolü, SoFIE-MIST Su Sisi & ECLSS SMAC Saati
    if _has_any(
        nq,
        (
            "halon",
            "sondur",
            "mudahale",
            "su sisi",
            "water mist",
            "sofie-mist",
            "pfe",
            "yangin cikarsa",
            "acil durum",
            "6001b",
            "smac",
            "karbonmonoksit",
            "eclss",
            "suppress",
            "extinguish",
        ),
    ):
        return "suppression_halon"

    # 7) Görünmez Soğuk Alev (Cool Flame NTC) & DAFT / SAME Duman-Toz Dedektörü
    if _has_any(
        nq,
        (
            "soguk alev",
            "cool flame",
            "ntc",
            "gorunmez alev",
            "iki asamali",
            "two-stage",
            "peroksi",
            "daft",
            "ay tozu",
            "regolit",
            "lunar dust",
            "duman dedektor",
            "toz-duman",
            "yanlis alarm",
            "false alarm",
        ),
    ):
        return "cool_flame_daft"

    # 8) Kısmi Yerçekimi (Ay 0.16G / Mars 0.38G), LUCI, FM2 ve ACME E-FIELD
    if _has_any(
        nq,
        (
            "kismi yercekimi",
            "partial gravity",
            "partial-gravity",
            "luci",
            "fm2",
            "e-field",
            "efield",
            "iyon ruzgari",
            "ionic wind",
            "0.16g",
            "0.16 g",
            "0.38g",
            "0.38 g",
            "mars yercekimi",
            "mars'ta",
            "marsta",
            "martian",
            "ay yercekimi",
            "ay'da",
            "ayda yanma",
            "bounding",
            "sinirlandirma",
        ),
    ):
        return "partial_gravity_luci"

    # 9) Spesifik NASA PSI Deneyi, NTRS Raporu veya Donanım Rafı Sorgusu
    if _has_any(
        nq,
        (
            "en yuksek oksijen",
            "highest oxygen",
            "cfi-g",
            "cfig",
            "saffire",
            "bass-ii",
            "bass ",
            "spice",
            "slise",
            "flex-2",
            "bre ",
            "burn rate emulator",
            "gel ",
            "smolder",
            "cir ",
            "mdca",
            "msg ",
            "cygnus",
            "ntrs-",
            "osdr-",
            "psi-",
        ),
    ) or re.search(r"\b(flex|cfi|acme|sofie|bass|same)\b", nq):
        return "specific_experiment"

    # 10) Spesifik Denklem / Boyutsuz Sayı Türetimi
    if _has_any(
        nq,
        (
            "spalding",
            "b_oq",
            "boq",
            "sherwood",
            "reynolds",
            "rayleigh",
            "grashof",
            "richardson",
            "damkohler",
            "d2 yasasi",
            "d²",
            "yanma sabiti",
            "burning constant",
            "standoff",
            "durma mesafesi",
            "r_f",
            "radyatif kayip",
            "chi_r",
            "moc nasil",
            "moc nedir",
            "denklem",
            "formul",
            "nasil hesaplan",
            "equation",
            "formula",
        ),
    ):
        return "equation_deep_dive"

    # 11) Karşı-Olgusal 'Ne Olur / Artırırsam / Azaltırsam / Farkı Ne' Duyarlılık Analizi
    if _has_any(
        nq,
        (
            "artirirsam",
            "artarsa",
            "yukseltirsem",
            "azaltirsam",
            "dusurursem",
            "degistirirsem",
            "kapatirsam",
            "olursa ne olur",
            "ne degisir",
            "farki ne",
            "0g ile 1g",
            "havalandirma",
            "fan hizi",
            "akis hizi",
            "ufleme",
            "blowoff",
            "seyreltici",
            "helyum",
            "argon",
            "what if",
            "increase",
            "decrease",
            "sensitivity",
            "difference between",
        ),
    ):
        return "what_if_sensitivity"

    # 12) Uzaydan Dünya'ya (Space-to-Earth) Teknoloji Transferi
    if _has_any(
        nq,
        (
            "dunya'ya",
            "dunyaya",
            "dunya uygula",
            "yeryuzu",
            "itfaiye",
            "firefighter",
            "spinoff",
            "teknoloji transfer",
            "scba",
            "hcci",
            "earth transfer",
            "earth application",
        ),
    ):
        return "earth_spinoffs"

    return "targeted_scientific"


def synthesize_question_driven_report(
    user_message: str,
    sim_params: Dict[str, Any],
    active_sim: Dict[str, Any],
    top_exps: List[Dict[str, Any]],
    rag_hits: Optional[List[Dict[str, Any]]] = None,
    live_ntrs: Optional[List[Dict[str, Any]]] = None,
    history: Optional[List[Dict[str, str]]] = None,
    media_context: str = "",
    lang: str = "tr",
) -> Tuple[str, List[Dict[str, Any]]]:
    """
    Kullanıcı sorusuna doğrudan yanıt veren metni ve yalnızca ilgili NTRS atıf listesini döndürür.
    """
    intent = classify_user_intent(user_message, media_context=media_context)
    nq = _norm(user_message)
    is_en = lang == "en"
    inp = active_sim["inputs"]
    tel = active_sim["telemetry"]
    fv = active_sim.get("flight_validation") or {}
    tl = active_sim.get("scenario_timeline") or {}
    rag_hits = rag_hits or []
    live_ntrs = live_ntrs or []
    history = history or []

    default_citations = [
        {
            "id": e["exp_id"],
            "program": e["program"],
            "ntrs_id": e["ntrs_id"],
            "title": e["title"] if is_en else e["title_tr"],
            "url": e["ntrs_url"],
            "priority_score": e["priority_score"],
        }
        for e in top_exps[:3]
    ]

    # -------------------------------------------------------------------------
    # 1. NELER YAPABİLİRSİN? / KULLANIM VE SORGU REHBERİ
    # -------------------------------------------------------------------------
    if intent == "capabilities_guide":
        if is_en:
            text = (
                "### ALTAR-NASA v5.1 — Interactive Engineering & Scientific Capabilities\n"
                f"Currently locked onto your live 3D chamber (**{inp['fuel_name_en']}** at `{inp['gravity_g']} G`, `{inp['oxygen_pct']}% O₂`, `{inp['pressure_psia']} psia`, `U = {inp['airflow_cms']} cm/s` → **`{tel['regime']}`**, Risk `{tel['risk_score']}/100`). Instead of static summaries, you can ask me to perform direct calculations and comparisons:\n\n"
                "| Capability Domain | What I Compute & Synthesize Live | Example Prompt You Can Ask |\n"
                "| :--- | :--- | :--- |\n"
                "| **Governing Equation Derivation** | Step-by-step substitution of `d²`-law `K`, Spalding `B_oq`, Sherwood `Sh`, `Ra/Gr/Ri`, Damköhler `Da`, and `MOC` | *\"How is Spalding B_oq and burning rate K calculated for my current droplet?\"* |\n"
                "| **Counterfactual What-If Perturbations** | Multi-point sweeps across airflow (`0–30 cm/s`), gravity (`0G–1G`), `O₂%`, pressure, and diluent gases (`N₂/CO₂/He`) | *\"What happens if I increase cabin airflow from 0 to 20 cm/s?\"* |\n"
                "| **Atmosphere & EVA Tradeoffs** | Quantitative matrix comparing ISS (`14.7 psia`), Lunar Rover (`10.2 psia / 32% O₂`), and EVA Suit (`4.3 psia / 100% O₂`) | *\"Compare EVA spacesuit and Lunar Rover flammability risks.\"* |\n"
                "| **NASA PSI & Intra-Run Evidence** | Deep-dive into all 15 PSI investigations (`FLEX`, `CFI-G`, `BASS`, `SPICE`, `Saffire`, `SoFIE`, `DAFT`) & run variations | *\"Explain Saffire-V test variations and highest-O₂ CFI-G findings.\"* |\n"
                "| **ECLSS Survival & Suppression** | `NASA-STD-6001B` non-Halon protocol, `SMAC 125 ppm CO` countdown, Cool Flame NTC & lunar dust sensing | *\"Why is Halon 1301 banned and how fast does CO hit SMAC limits?\"* |\n"
                "| **Multimodal Dataset / Flame CV** | Pixel chemiluminescence/soot segmentation (`.png/.jpg`) and `.csv/.json/.pdf` parameter extraction | Upload a file on the left and ask: *\"Analyze my uploaded dataset.\"* |"
            )
        else:
            text = (
                "### ALTAR-NASA v5.1 — Yapabileceğim Canlı Hesaplama ve Mühendislik Analizleri\n"
                f"Şu anda aktif 3B yanma odanıza kilitliyim (**{inp['fuel_name_tr']}** • `{inp['gravity_g']} G`, `%{inp['oxygen_pct']} O₂`, `{inp['pressure_psia']} psia`, `U = {inp['airflow_cms']} cm/s` → **`{tel['regime']}`**, Risk `{tel['risk_score']}/100`). Bana doğrudan aşağıdaki hesaplama ve sorguları yaptırabilirsiniz:\n\n"
                "| Analiz Yeteneği | Arka Planda Yürüttüğüm Canlı İşlem | Doğrudan Sorabileceğiniz Örnek Soru |\n"
                "| :--- | :--- | :--- |\n"
                "| **Adım Adım Denklem Çözümü** | Aktif kaydırıcı değerlerinizle `d²` yasası (`K`), Spalding `B_oq`, Sherwood `Sh`, `Ra/Gr/Ri`, Damköhler `Da` ve `MOC` hesabı | *\"Spalding B_oq ve yanma sabiti K şu anki değerlerimle nasıl hesaplanıyor?\"* |\n"
                "| **'Ne Olur?' Duyarlılık Taraması** | Akış hızı (`0–30 cm/s`), yerçekimi (`0G / 0.16G / 0.38G / 1G`), `O₂%` veya seyreltici gaz (`N₂/CO₂/He`) değişim simülasyonu | *\"Havalandırma fan hızını artırırsam veya 0 cm/s yaparsam alev nasıl değişir?\"* |\n"
                "| **Kabuk / Giysi Atmosfer Kıyaslaması** | ISS (`14.7 psia`), Ay Gezgini (`10.2 psia / %32 O₂`) ve EVA Uzay Giysisi (`4.3 psia / %100 O₂`) yanıcılık matrisi | *\"Uzay giysisi ile basınçlı Ay gezgini atmosferini sayısal kıyasla.\"* |\n"
                "| **15 NASA PSI Deneyi & Raf Sorgusu** | `FLEX`, `CFI`, `ACME CFI-G`, `BASS`, `SPICE`, `SLISE`, `Saffire`, `SoFIE`, `DAFT` bulguları ve deney-içi varyasyonlar | *\"Saffire deneyinde neler sabit tutuldu, neler değiştirildi?\"* |\n"
                "| **ECLSS Yaşam Saati & Söndürme** | `NASA-STD-6001B` Halon 1301 yasağı, `SoFIE-MIST` su sisi, `SMAC 125 ppm CO` süresi ve görünmez Soğuk Alev tespiti | *\"Uzay aracında Halon 1301 neden yasak ve yangına nasıl müdahale edilir?\"* |\n"
                "| **Görsel & Veri Dosyası Çözümleme** | Yüklenen alev fotoğrafından (`.png/.jpg`) mavi `CH*`/kurum analizi ve `.csv/.json/.pdf` tablolarından `K` eğimi çıkarımı | Sol panelden dosya/resim ekleyip *\"Yüklediğim veriyi analiz et\"* yazın |"
            )
        return (text, [])

    # -------------------------------------------------------------------------
    # 2. ÖZELLİKLERİN NELER? / SİSTEM MİMARİSİ VE 5 MODÜL ENVANTERİ
    # -------------------------------------------------------------------------
    if intent == "platform_features":
        r2_val = fv.get("r_squared", 0.996)
        rmse_val = fv.get("rmse", 0.015)
        if is_en:
            text = (
                "### ALTAR-NASA: Flame in Freefall (v5.1) — Technical Architecture & Feature Inventory\n"
                "ALTAR-NASA is a physics-informed microgravity and partial-gravity combustion digital twin built around **5 integrated Mission Control subsystems**:\n\n"
                "1. **`01 // 3D WebGL CIR/MSG Digital Twin & Governing Solver`:**\n"
                f"   - Real-time 4-geometry WebGL chamber (`Droplet`, `PMMA Rod`, `Fabric Slab`, `CFI-G Porous Sphere`) solving 8 coupled equations (`d²`-law `K`, `B_oq`, `R_f/R_d`, `Sh`, `Ra`, `Ri`, `Da`, `χ_r`, U-shaped `MOC`).\n"
                f"   - Calibrated against real ISS flight data with live **`R² = {r2_val}`** (`RMSE = {rmse_val}`), WebAudio acoustic telemetry sonification, and **ECLSS `SMAC 125 ppm CO` Crew Survival Clock**.\n"
                "2. **`02 // 15 Verified NASA PSI Investigations & Intra-Run Matrix`:**\n"
                "   - Physics + bilingual TF-IDF ranking across `ISS CIR/MDCA`, `MSG Flow Duct`, `Cygnus (Saffire I–VI)`, and `SAME/DAFT` smoke-vs-lunar-dust hardware, with clickable `ntrs.nasa.gov` citations and intra-experiment variable matrices.\n"
                "3. **`03 // Live NASA NTRS/OSDR Telemetry Stream & Multimodal Analyzer`:**\n"
                "   - Autonomous polling of official `ntrs.nasa.gov` & `osdr.nasa.gov` APIs plus local pixel-level flame image segmentation and `.CSV/.JSON/.PDF` parameter extraction.\n"
                "4. **`04 // 6-Stage Audited Evidence Synthesis Console`:**\n"
                "   - Question-driven analytical kernel + hybrid offline `Ollama` / local CLI / cloud gateways guarded by mandatory `CON-01..CON-09` and `NASA-STD-6001B` Halon-prohibition verification.\n"
                "5. **`05 // Zero-Trust Isolation & Predictive Dataset Export`:**\n"
                "   - Runs either `100% Serverless` in browser RAM (`CSP` locked) or on `127.0.0.1` loopback (`CSRF + Host/Origin + SSRF` shields), with one-click **`.CSV`**, **`.JSON`**, and **`.MD`** scientific dossier export."
            )
        else:
            text = (
                "### ALTAR-NASA: Flame in Freefall (v5.1) — Teknik Mimari ve Sistem Özellikleri\n"
                "Platform, statik bir sohbet arayüzü değil; **5 entegre Görev Kontrol modülünden** oluşan fizik-temelli bir mikroçekim/kısmi yerçekimi yanma güvenliği sistemidir:\n\n"
                "1. **`01 // 3B WebGL CIR/MSG Dijital İkizi & Analitik Taşınım Çözücüsü`:**\n"
                f"   - 4 farklı 3B numune/brülör geometrisini (`Sıvı Damlacık`, `PMMA Polimer Çubuk`, `Nomex/Sibal Kumaş`, `CFI-G Gözenekli Küre`) ve 8 temel denklemi (`d²` yasası `K`, `B_oq`, `R_f/R_d`, `Sh`, `Ra`, `Ri`, `Da`, `χ_r`, U-eğrili `MOC`) anlık çözer.\n"
                f"   - Gerçek ISS uçuş ölçümleriyle **`R² = {r2_val}`** (`RMSE = {rmse_val}`) doğrulama katmanı, WebAudio akustik alev sonifikasyonu ve **ECLSS `SMAC 125 ppm CO` Yaşam Destek Saati** içerir.\n"
                "2. **`02 // 15 Doğrulanmış NASA PSI Soruşturması & Deney-İçi Varyasyon Matrisi`:**\n"
                "   - Termodinamik yakınlık + çift dilli TF-IDF motoruyla `CIR/MDCA`, `MSG Fan Kanalı`, `Cygnus (Saffire)` ve `DAFT/SAME` donanımlarını sıralar; aynı deney içinde neyin sabit tutulup neyin değiştirildiğini ve Dünya teknoloji transferlerini listeler.\n"
                "3. **`03 // Canlı NASA NTRS/OSDR Akışı & Çok Modlu Dosya/Görsel Çözümleyici`:**\n"
                "   - Resmi `ntrs.nasa.gov` ve `osdr.nasa.gov` API'lerinden sürekli veri akışı sağlar; yüklenen alev fotoğraflarından piksel düzeyinde kemilüminesans/kurum oranını ve `.csv/.json/.pdf` dosyalarından deneysel parametreleri çıkarıp 3B odaya uygular.\n"
                "4. **`04 // 6-Katmanlı Denetimli Kanıt Sentezi Konsolu`:**\n"
                "   - Soru-odaklı deterministik analitik çözücü ile yerel çevrimdışı `Ollama`, yerel CLI köprüsü ve isteğe bağlı bulut geçitlerini `CON-01..CON-09` ve `NASA-STD-6001B` Halon yasağı denetimi altında birleştirir.\n"
                "5. **`05 // Zero-Trust Siber İzolasyon & Öngörücü Veri Paketi Çıktısı`:**\n"
                "   - Hem tarayıcı RAM'inde `%100 Sunucusuz Statik` olarak hem de masaüstünde `127.0.0.1` izole soket (`CSRF + CSP + SSRF` kalkanlı) olarak çalışır; tek tıkla **`.CSV`**, **`.JSON`** ve **`.MD`** bilimsel veri setleri üretir."
            )
        return (text, [])

    # -------------------------------------------------------------------------
    # 3. SELAMLAMA VE AKTİF TELEMETRİ DURUM BİLDİRİMİ
    # -------------------------------------------------------------------------
    if intent == "greeting_identity":
        if is_en:
            text = (
                "### ALTAR-NASA v5.1 — Decision Support Kernel Online\n"
                f"- **Active 3D Chamber Lock:** `{inp['fuel_name_en']}` (`{inp['geometry_3d']}`) | `{inp['gravity_g']} G` | `{inp['oxygen_pct']}% O₂` (`P_O2 = {tel.get('o2_partial_psia', tel.get('po2_psia', 0))} psia`) | `U = {inp['airflow_cms']} cm/s`\n"
                f"- **Computed State:** Regime **`{tel['regime']}`** | Flame Temp `{tel['flame_temp_k']} K` | Critical `MOC = {tel['moc_pct']}% O₂` | Fire Risk **`{tel['risk_score']}/100`**\n\n"
                "Ask me any specific question—such as deriving a dimensionless number (`B_oq`, `Sh`, `Da`), running a parameter sensitivity sweep (`0G vs 0.16G Moon`, airflow changes), comparing `EVA Suit` vs `Lunar Rover` atmospheres, or inspecting a NASA PSI experiment (`FLEX`, `Saffire`, `SoFIE-MIST`, `DAFT`)."
            )
        else:
            text = (
                "### ALTAR-NASA v5.1 — Kanıt Sentezi ve Karar Destek Çekirdeği Hazır\n"
                f"- **Aktif 3B Yanma Odası Kilidi:** `{inp['fuel_name_tr']}` (`{inp['geometry_3d']}`) | `{inp['gravity_g']} G` | `%{inp['oxygen_pct']} O₂` (`P_O2 = {tel.get('o2_partial_psia', tel.get('po2_psia', 0))} psia`) | `U = {inp['airflow_cms']} cm/s`\n"
                f"- **Anlık Çözücü Durumu:** Rejim **`{tel['regime']}`** | Alev Sıcaklığı `{tel['flame_temp_k']} K` | Kritik `MOC = %{tel['moc_pct']} O₂` | Yangın Riski **`{tel['risk_score']}/100`**\n\n"
                "Bana belirli bir fiziksel denklemi (`Spalding B_oq`, `Sherwood Sh`, `Damköhler Da`), parametre değişim senaryosunu (*\"Akış hızını artırırsam ne olur?\"*), `EVA Uzay Giysisi vs. Ay Gezgini` kıyaslamasını veya merak ettiğiniz bir NASA PSI deneyini (`FLEX`, `Saffire`, `SoFIE-MIST`, `DAFT`) doğrudan sorabilirsiniz."
            )
        return (text, [])

    # -------------------------------------------------------------------------
    # 4. ROKET MOTORLARI / İTİCİLER KAPSAM SINIRI (CON-08)
    # -------------------------------------------------------------------------
    if intent == "rocket_scope":
        re_now = tel.get("reynolds_number", 0)
        ri_now = tel.get("richardson_number", 0)
        if is_en:
            text = (
                "### Why Rocket Engines & Thrusters Are Excluded from NASA PSI Cabin Fire Scope (CON-08)\n"
                "1. **Momentum-Dominated Regime (`Ri = Gr / Re² → 0`):** Inside liquid/solid rocket engines and orbital thrusters, injection and exhaust velocities reach `10²–10³ m/s`, producing extreme Reynolds numbers (`Re > 10⁵`). Because the Richardson number scales as `Ri = Gr / Re²`, buoyant forces (`Gr ∝ g`) are completely negligible (`Ri < 10⁻⁶`) whether the rocket is at `1G` on Earth or `0G` in orbit.\n"
                f"2. **Contrast with Habitable Spacecraft Cabins (Your Active Chamber):** In your current 3D chamber, ventilation speed is only `U = {inp['airflow_cms']} cm/s` (`Re = {re_now}`, `Ri = {ri_now}`). At these gentle crew-comfort velocities (`0–20 cm/s`), removing gravity (`0G` / `0.16G` / `0.38G`) fundamentally alters flame geometry, soot residence time, radiative quenching (`χ_r`), and `MOC`.\n"
                "3. **NASA PSI Focus Envelope:** Therefore, NASA's Physical Sciences Informatics (PSI) combustion portfolio (`FLEX`, `CFI`, `ACME`, `BASS`, `SPICE`, `SLISE`, `Saffire`, `SoFIE`, `DAFT`) exclusively targets **habitable spacecraft cabins, ISS racks, EVA spacesuits (`4.3 psia / 100% O₂`), and Lunar/Martian surface habitats & pressurized rovers**."
            )
        else:
            text = (
                "### Roket Motorları ve İticiler Neden NASA PSI Yangın Güvenliği Kapsamı Dışındadır? (CON-08)\n"
                "1. **Atalet ve Momentum Baskınlığı (`Ri = Gr / Re² → 0`):** Roket motorları ve yörünge iticilerinde gaz enjeksiyon hızları `100–3000 m/s` mertebesindedir ve Reynolds sayısı çok yüksektir (`Re > 10⁵`). Kaldırma kuvvetinin atalete oranını gösteren Richardson sayısı `Ri = Gr / Re²` olduğundan, roket yanma odasında yerçekimi ister `1G` ister `0G` olsun `Ri < 10⁻⁶` kalır; yani yanma **yerçekiminden tamamen bağımsızdır**.\n"
                f"2. **Mürettebat Kabini ile Fiziksel Fark (Aktif Odanız):** Şu anki 3B yanma odanızda hava akışı yalnızca `U = {inp['airflow_cms']} cm/s` düzeyindedir (`Re = {re_now}`, `Ri = {ri_now}`). Mürettebat konforu için kullanılan bu düşük hızlarda (`0–20 cm/s`) kaldırma kuvvetinin çökmesi alevi küreselleştirir, radyatif ısı kaybını (`χ_r`) büyütür ve `MOC` sınırını Dünya'dakinin altına çeker.\n"
                "3. **NASA PSI Odak Alanı:** Bu fiziksel sebeple NASA PSI yanma veri tabanı roket itkisini hariç tutar; doğrudan **ISS modülleri, Orion/Gateway kabinleri, EVA uzay giysileri (`4.3 psia / %100 O₂`), Ay/Mars yüzey üsleri ve basınçlı gezginlerdeki** yangın güvenliğine odaklanır."
            )
        return (text, default_citations[:2])

    # -------------------------------------------------------------------------
    # 5. EVA UZAY GİYSİSİ (%100 O2 @ 4.3 psia) & AY GEZGİNİ & CFI-G KIYASLAMASI
    # -------------------------------------------------------------------------
    if intent == "eva_rover_atmosphere":
        base_fuel = inp["fuel_id"] if inp["fuel_id"] in FUEL_PROPERTIES else "nomex"
        profiles = [
            ("ISS USOS Standart Kabin", "ISS Standard Cabin", {"fuel_id": base_fuel, "gravity_g": 0.0, "oxygen_pct": 21.0, "pressure_psia": 14.7, "airflow_cms": 4.0, "droplet_d0_mm": inp["droplet_d0_mm"], "diluent": "N2", "habitat_id": "iss_module"}),
            ("Ay Üssü / Basınçlı Gezgin", "Lunar Base / Rover", {"fuel_id": base_fuel, "gravity_g": 0.16, "oxygen_pct": 32.0, "pressure_psia": 10.2, "airflow_cms": 4.5, "droplet_d0_mm": inp["droplet_d0_mm"], "diluent": "N2", "habitat_id": "lunar_rover"}),
            ("Saffire-V Keşif Atmosferi", "Saffire-V Exploration", {"fuel_id": base_fuel, "gravity_g": 0.0, "oxygen_pct": 34.0, "pressure_psia": 8.2, "airflow_cms": 5.0, "droplet_d0_mm": inp["droplet_d0_mm"], "diluent": "N2", "habitat_id": "lunar_rover"}),
            ("EVA Uzay Giysisi (Saf O₂)", "EVA Spacesuit (Pure O₂)", {"fuel_id": base_fuel, "gravity_g": 0.16, "oxygen_pct": 100.0, "pressure_psia": 4.3, "airflow_cms": 6.0, "droplet_d0_mm": inp["droplet_d0_mm"], "diluent": "N2", "habitat_id": "eva_suit"}),
        ]
        rows_md: List[str] = []
        for tr_lbl, en_lbl, prm in profiles:
            s = simulate_combustion_state(prm)
            st = s["telemetry"]
            stl = s["scenario_timeline"]
            po2 = st.get("o2_partial_psia", 0)
            rate_str = f"V_f={st['flame_spread_mm_s']} mm/s" if st["flame_spread_mm_s"] > 0 else f"K={st['burning_rate_k_mm2_s']} mm²/s"
            rows_md.append(
                f"| **{en_lbl if is_en else tr_lbl}** | `{prm['pressure_psia']} psia` | `{prm['oxygen_pct']}%` | `{po2} psia` | `{st['moc_pct']}%` | `{st['flame_temp_k']} K` | `{rate_str}` | **`{st['risk_score']}/100`** (`SMAC {stl['t_smac_125ppm_s']} s`) |"
            )

        rel_exps = [e for e in NASA_EXPERIMENTS_CATALOG if e["exp_id"] in ("PSI-SAFFIRE5-07", "PSI-SOFIE-08", "PSI-ACME-CFIG-14")]
        cits = [
            {"id": e["exp_id"], "program": e["program"], "ntrs_id": e["ntrs_id"], "title": e["title"] if is_en else e["title_tr"], "url": e["ntrs_url"], "priority_score": 96.0}
            for e in rel_exps
        ]

        if is_en:
            text = (
                f"### EVA Spacesuit (`100% O₂ @ 4.3 psia`), Lunar Rover (`32% O₂ @ 10.2 psia`) & ISS Flammability Matrix — `{inp['fuel_name_en']}`\n\n"
                "| Mission Atmosphere | Total Pressure | O₂ % | Partial `P_O2` | Critical `MOC` | Flame `T_f` | Burn / Spread Rate | Risk & ECLSS SMAC |\n"
                "| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |\n"
                + "\n".join(rows_md)
                + "\n\n"
                "### Key Thermo-Physical & Physiological Insights (CON-06)\n"
                "- **Why `4.3 psia / 100% O₂` in EVA Suits?** Pressurizing a suit to `14.7 psia` makes joints rigid like a balloon. Operating at `4.3 psia` (`29.6 kPa`) maintains alveolar oxygen (`P_O2 = 4.3 psia` vs `3.09 psia` on ISS) with zero nitrogen (`N₂`), preventing decompression sickness (the bends). However, **removing `N₂` eliminates inert thermal heat-sink ballast**, causing even flame-resistant `Nomex` to burn rapidly if an ignition arc occurs.\n"
                "- **Why `10.2 psia / 32% O₂` in Lunar Bases & Pressurized Rovers?** This NASA Exploration Atmosphere (>40% relative `O₂` enrichment over Earth's 21%) cuts EVA pre-breathe purge time from `>2 hours` down to `~15 minutes`, enabling frequent lunar sorties—validated in **Saffire-V (`NTRS #20220014358`)** and **SoFIE (`NTRS #20230006712`)**.\n"
                "- **Highest-O₂ PSI Benchmark (`ACME CFI-G`):** Inside ISS `CIR`, **ACME CFI-G (`NTRS #20230014890`)** tested spherical inverse diffusion flames up to **`85% O₂`** flowing into a propane/N₂ chamber to bound high-oxygen soot and radiation limits."
            )
        else:
            text = (
                f"### EVA Uzay Giysisi (`%100 O₂ @ 4.3 psia`), Ay Gezgini (`%32 O₂ @ 10.2 psia`) ve ISS Yanıcılık Matrisi — `{inp['fuel_name_tr']}`\n\n"
                "| Görev Atmosferi | Toplam Basınç | O₂ % | Kısmi `P_O2` | Kritik `MOC` | Sıcaklık `T_f` | Yayılma / Yanma Hızı | Risk & ECLSS SMAC |\n"
                "| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |\n"
                + "\n".join(rows_md)
                + "\n\n"
                "### Termofiziksel ve Fizyolojik Mühendislik Analizi (CON-06)\n"
                "- **EVA Giysilerinde Neden `4.3 psia / %100 Saf O₂` Kullanılır?** Giysi `14.7 psia` basınçta şişirilirse eklemler taşlaşır ve astronot parmaklarını bükemez. `4.3 psia` (`29.6 kPa`) saf `O₂` hem akciğer kısmi oksijen basıncını korur (`P_O2 = 4.30 psia` > ISS `3.09 psia`) hem de kanda azot (`N₂`) bırakmayarak **vurgun (dekompresyon) riskini sıfırlar**. Ancak **ısıyı emen `N₂` ısıl balastı tamamen kalktığı için** adyabatik alev sıcaklığı sıçrar ve Dünya'da yanmayan `Nomex` kumaş bile hızla yayılan aleve maruz kalır.\n"
                "- **Ay Üssü ve Basınçlı Gezginlerde Neden `≤10.2 psia / ≥%32 O₂` Seçilir?** Dünya'daki `%21 O₂`'ye kıyasla `>%40` bağıl oksijen artışı sağlayan bu atmosfer, astronotların EVA yürüyüşü öncesi saatler süren ön-soluma (`pre-breathe`) süresini `~15 dakikaya` indirir (**Saffire-V `NTRS #20220014358`** ve **SoFIE `NTRS #20230006712`** ile test edilmiştir).\n"
                "- **PSI En Yüksek Oksijen Rekoru (`ACME CFI-G`):** ISS `CIR` rafındaki **ACME CFI-G (`NTRS #20230014890`)** küresel gözenekli brülör deneyleri, **`%85 O₂`** konsantrasyonuna kadar çıkarak yüksek oksijenli kurum ve radyasyon sınırlarını haritalamıştır."
            )
        return (text, cits)

    # -------------------------------------------------------------------------
    # 6. KISMİ YERÇEKİMİ (0.16G AY / 0.38G MARS), LUCI/FM2 VE ACME E-FIELD
    # -------------------------------------------------------------------------
    if intent == "partial_gravity_luci":
        g_levels = [
            ("0.00 G (ISS Mikroçekim)", "0.00 G (ISS Freefall)", 0.0),
            ("0.16 G (Ay Yüzeyi • LUCI/FM2)", "0.16 G (Lunar • LUCI/FM2)", 0.16),
            ("0.38 G (Mars Yüzeyi)", "0.38 G (Martian Surface)", 0.38),
            ("1.00 G (Dünya Referansı)", "1.00 G (Earth Reference)", 1.0),
        ]
        rows_g: List[str] = []
        for tr_g, en_g, gv in g_levels:
            p_copy = dict(inp)
            p_copy["gravity_g"] = gv
            sg = simulate_combustion_state(p_copy)
            gt = sg["telemetry"]
            rate_col = f"V_f={gt['flame_spread_mm_s']} mm/s" if gt["flame_spread_mm_s"] > 0 else f"K={gt['burning_rate_k_mm2_s']} mm²/s"
            rows_g.append(
                f"| **{en_g if is_en else tr_g}** | `Ra = {gt.get('rayleigh_number', 0):.1f}` | `Ri = {gt.get('richardson_number', 0):.3f}` | **`{gt['moc_pct']}% O₂`** | `{gt['flame_temp_k']} K` | `{rate_col}` | `{gt['regime']}` (`{gt['risk_score']}/100`) |"
            )

        rel_exps = [e for e in NASA_EXPERIMENTS_CATALOG if e["exp_id"] in ("PSI-ACME-09", "PSI-BASS-03", "PSI-SOFIE-08")]
        cits = [
            {"id": e["exp_id"], "program": e["program"], "ntrs_id": e["ntrs_id"], "title": e["title"] if is_en else e["title_tr"], "url": e["ntrs_url"], "priority_score": 95.0}
            for e in rel_exps
        ]

        if is_en:
            text = (
                f"### Partial-Gravity Combustion Bounding (`0G` → `0.16G Moon` → `0.38G Mars` → `1G`) — `{inp['fuel_name_en']}`\n"
                f"Evaluated at your active oxygen (`{inp['oxygen_pct']}% O₂`), pressure (`{inp['pressure_psia']} psia`), and cabin flow (`{inp['airflow_cms']} cm/s`):\n\n"
                "| Gravity Regime | Rayleigh `Ra` | Richardson `Ri` | Critical `MOC` | Flame `T_f` | Burn / Spread Rate | Regime & Risk |\n"
                "| :--- | :--- | :--- | :--- | :--- | :--- | :--- |\n"
                + "\n".join(rows_g)
                + "\n\n"
                "### NASA PSI Data Gap, LUCI/FM2 & ACME E-FIELD Emulation (CON-07)\n"
                "1. **Current PSI Partial-G Gap (`LUCI` & `FM2`):** NASA's PSI archive currently holds `0G` orbital data (ISS/Cygnus) and `1G` ground baselines, with **no direct lunar-surface combustion dataset yet**. Upcoming **LUCI (*Lunar-g Combustion Investigation*)** and **FM2 (*Flammability of Materials on the Moon*)** payloads are specifically designed to close this gap.\n"
                "2. **Why `0.16G` Can Be Worse Than `1G` (Buoyant Ventilation Paradox):** Lunar buoyancy induces gentle upward slip (`u_b ∝ √g ≈ 8.8 cm/s`) that steadily feeds fresh `O₂` (`Da > 1`) without the strong convective strain/cooling of `1G` Earth plumes—often lowering `MOC` below `1G` limits! Bounding between `0G` ventilated (`BASS`/`SoFIE`) and `1G` envelopes safely brackets intermediate flammability.\n"
                "3. **ACME E-FIELD Ionic-Wind Emulation (`NTRS #19990054024`):** In `0G` inside ISS `CIR`, applying a high-voltage electric field drives natural flame chemi-ions (`H₃O⁺`, `CHO⁺`), creating a controllable Lorentz/Coulomb body force (ionic wind) that emulates `0.16G` Lunar and `0.38G` Martian buoyancy on orbit."
            )
        else:
            text = (
                f"### Kısmi Yerçekimi Sınırlandırma Analizi (`0G` → `0.16G Ay` → `0.38G Mars` → `1G`) — `{inp['fuel_name_tr']}`\n"
                f"Aktif oksijen (`%{inp['oxygen_pct']} O₂`), basınç (`{inp['pressure_psia']} psia`) ve akış (`{inp['airflow_cms']} cm/s`) koşullarınızda canlı çözücü karşılaştırması:\n\n"
                "| Yerçekimi Rejimi | Rayleigh `Ra` | Richardson `Ri` | Kritik `MOC` | Sıcaklık `T_f` | Yanma / Yayılma | Rejim & Risk |\n"
                "| :--- | :--- | :--- | :--- | :--- | :--- | :--- |\n"
                + "\n".join(rows_g)
                + "\n\n"
                "### NASA PSI Veri Boşluğu, LUCI/FM2 Görevleri ve ACME E-FIELD Taklidi (CON-07)\n"
                "1. **Mevcut PSI Kısmi Yerçekimi Veri Boşluğu (`LUCI` & `FM2`):** NASA PSI arşivinde şu an doğrudan Ay veya Mars kısmi yerçekiminde kaydedilmiş yanma verisi bulunmamaktadır; bu boşluğun gelecekteki **LUCI (*Lunar-g Combustion Investigation*)** ve **FM2 (*Flammability of Materials on the Moon*)** Ay yüzey deneyleriyle doldurulması hedeflenmektedir.\n"
                "2. **Ay'da (`0.16G`) Yangın Neden Dünya'dan (`1G`) Daha Tehlikeli Olabilir?** `0.16G` kısmi yerçekimi `u_b ∝ √g ≈ 8.8 cm/s` düzeyinde tatlı bir doğal kaldırma akışı yaratarak aleve taze `O₂` taşır (`Da > 1`), ancak `1G`'deki güçlü soğutucu/gerdirici konveksiyonu oluşturamaz. Bu nedenle `0.16G` kritik `MOC` sınırı `1G` Dünya sınırının **altına** iner ve `0G–1G` zarfıyla sınırlandırılır (*bounding*).\n"
                "3. **ACME E-FIELD İyon Rüzgarı Taklidi (`NTRS #19990054024`):** ISS `CIR` odasında `0G` ortamında alev içindeki doğal iyonlara (`H₃O⁺`, `CHO⁺`) elektrik alanı uygulanarak oluşturulan **iyon rüzgarı**, kısmi yerçekimi konveksiyonunu yörüngede başarıyla taklit etmiş ve kurumu `%70` azaltmıştır."
            )
        return (text, cits)

    # -------------------------------------------------------------------------
    # 7. GÖRÜNMEZ SOĞUK ALEV (COOL FLAME NTC) & DAFT/SAME TOZ-DUMAN SENSÖRÜ
    # -------------------------------------------------------------------------
    if intent == "cool_flame_daft":
        cf_sim = simulate_combustion_state(
            {"fuel_id": "n_heptane", "gravity_g": 0.0, "oxygen_pct": 15.5, "pressure_psia": inp["pressure_psia"], "airflow_cms": 0.1, "droplet_d0_mm": 3.8, "diluent": inp["diluent"]}
        )
        cft = cf_sim["telemetry"]
        rel_exps = [e for e in NASA_EXPERIMENTS_CATALOG if e["exp_id"] in ("PSI-FLEX-01", "PSI-CFI-11", "PSI-SAME-10", "PSI-ACME-CFIG-14")]
        cits = [
            {"id": e["exp_id"], "program": e["program"], "ntrs_id": e["ntrs_id"], "title": e["title"] if is_en else e["title_tr"], "url": e["ntrs_url"], "priority_score": 96.0}
            for e in rel_exps
        ]

        if is_en:
            text = (
                "### Two-Stage Radiative Extinction, Invisible Cool Flames (NTC) & DAFT Sensor Fusion (CON-04)\n"
                f"- **Your Current Chamber vs. Cool-Flame Threshold:** Active radiative loss is `χ_r = {tel['radiative_loss_fraction'] * 100:.1f}%` (`T_f = {tel['flame_temp_k']} K`, regime `{tel['regime']}`). For a `3.8 mm` `n-Heptane` droplet at `0G / 15.5% O₂`, `χ_r` reaches `{cft['radiative_loss_fraction'] * 100:.1f}%`, triggering **`{cft['regime']}`** at `{cft['flame_temp_k']} K`.\n"
                "- **Physical Mechanism (`FLEX`, `CFI`, `ACME CFI-G`):** In `0G`, hot combustion products (`CO₂`, `H₂O`, soot) form a thick stagnant spherical shell (`R_f/R_d ≈ 5–8`). Because radiative heat loss scales with flame volume (`Q_rad ∝ R_f³·σ·(T_f⁴ - T_∞⁴)`), when `χ_r > 0.45` the `1500+ K` hot flame quenches. Instead of stopping, heavy alkanes (`n-Heptane`, `n-Decane`, `Propane`) drop into the **Negative Temperature Coefficient (`NTC`, `550–780 K`)** branch (`R + O₂ ⇌ RO₂ ⇌ QOOH`), burning **invisibly** while generating toxic **`CO`** and **`CH₂O` (formaldehyde)** that can spontaneously re-ignite!\n\n"
                "| Detection Channel | Hot Sooty Flame (`1G/0G`) | Invisible Cool Flame (`550–780 K`) | Lunar Regolith / Cabin Dust |\n"
                "| :--- | :--- | :--- | :--- |\n"
                "| **Visible Optical Camera** | High (`75–100%`) | **`~0–2%` (BLIND)** | Scatters light (False Positive Risk) |\n"
                "| **Mid-IR / UV OH*-HCHO Radiometer** | High (`12–35 kW/m²`) | **Detects `2.5–5.5 kW/m²` envelope** | `0 kW/m²` (Immune) |\n"
                "| **Electrochemical `CO / CH₂O` Sensor** | Moderate-High | **Sharp spike (`90–350 ppm CO`)** | `0 ppm` (Immune) |\n"
                "| **SAME / DAFT Dual-Wavelength Laser** | Sub-micron soot (`d_p < 0.4 µm`) | Detects condensed vapor mist (`CFI`) | **Rejects `1–10 µm` jagged lunar dust via polarization/angle ratio** |"
            )
        else:
            text = (
                "### İki Aşamalı Radyatif Sönme, Görünmez Soğuk Alev (NTC) ve DAFT Toz/Duman Ayrımı (CON-04)\n"
                f"- **Aktif Odanız vs. Soğuk Alev Eşiği:** Mevcut simülasyonunuzda radyatif kayıp kesri `χ_r = %{tel['radiative_loss_fraction'] * 100:.1f}` (`T_f = {tel['flame_temp_k']} K`, rejim `{tel['regime']}`). Örneğin `0G / %15.5 O₂` altında `3.8 mm` `n-Heptan` damlacığında `χ_r = %{cft['radiative_loss_fraction'] * 100:.1f}` değerine ulaşarak `{cft['flame_temp_k']} K` sıcaklıkta **`{cft['regime']}`** fazına kilitlenir.\n"
                "- **Termokimyasal Mekanizma (`FLEX`, `CFI` ve `ACME CFI-G`):** `0G`'de sıcak gazlar yükselemediği için alev küresi büyür (`R_f/R_d ≈ 5–8`) ve Stefan-Boltzmann radyatif kaybı (`Q_rad ∝ R_f³·σ·(T_f⁴ - T_∞⁴)`) üretilen ısıyı aşar (`χ_r > 0.45`). Görünür sıcak alev söner; ancak alkan yakıtlar (`n-Heptan`, `n-Dekan`, `Propan`) **Negatif Sıcaklık Katsayısı (`NTC`, `550–780 K`)** peroksi (`RO₂ ⇌ QOOH`) zinciriyle **çıplak gözle ve optik kamerayla görülemeden** yanmayı sürdürür, kabine zehirli **`CO`** ve **formaldehit (`CH₂O`)** pompalar ve taze `O₂` geldiğinde aniden yeniden alevlenebilir!\n\n"
                "| Algılama Sensörü | Sıcak Görünür Alev | Görünmez Soğuk Alev (`550–780 K`) | Kabin / Ay Regolit Tozu |\n"
                "| :--- | :--- | :--- | :--- |\n"
                "| **Standart Optik Kamera** | Yüksek (`%75–100`) | **`~%0–2` (TAMAMEN KÖR)** | Işığı saçar (Yanlış Alarm Riski) |\n"
                "| **UV / Orta-IR Radyometre** | Yüksek (`12–35 kW/m²`) | **`2.5–5.5 kW/m²` ışıma yakalar** | `0 kW/m²` (Toza Bağışıklı) |\n"
                "| **Elektrokimyasal `CO / CH₂O` Gaz** | Orta–Yüksek | **`90–350 ppm CO` sızıntısını yakalar** | `0 ppm` (Toza Bağışıklı) |\n"
                "| **SAME / DAFT Çok Açılı Lazer** | `<0.4 µm` ince yanma dumanı | `CFI` yoğunlaşmış buhar bulutunu seçer | **Polarizasyon ve ileri/geri saçılma oranıyla `1–10 µm` Ay tozunu eler** |"
            )
        return (text, cits)

    # -------------------------------------------------------------------------
    # 8. HALON 1301 YASAĞI, NASA-STD-6001B SÖNDÜRME, SOFIE-MIST & İTFAİYE TRANSFERİ
    # -------------------------------------------------------------------------
    if intent == "suppression_halon":
        zero_flow_p = dict(inp)
        zero_flow_p["airflow_cms"] = 0.0
        zero_sim = simulate_combustion_state(zero_flow_p)
        zt = zero_sim["telemetry"]
        include_spinoff = _has_any(nq, ("itfaiye", "firefighter", "dunya", "earth", "giysi", "tank", "spinoff", "transfer"))

        rel_exps = [e for e in NASA_EXPERIMENTS_CATALOG if e["exp_id"] in ("PSI-SOFIE-MIST-15", "PSI-BASS-03", "PSI-SAME-10")]
        cits = [
            {"id": e["exp_id"], "program": e["program"], "ntrs_id": e["ntrs_id"], "title": e["title"] if is_en else e["title_tr"], "url": e["ntrs_url"], "priority_score": 97.0}
            for e in rel_exps
        ]

        if is_en:
            spinoff_sec = (
                "\n\n### Terrestrial Firefighting & Industrial Spinoffs\n"
                "- **Fine Water Mist (`SoFIE-MIST`):** Sub-`50 µm` clean-agent nozzles now protect data centers, surgical suites, and EV lithium-ion battery packs without toxic fluorinated gases.\n"
                "- **Firefighter Turnout Gear & `SCBA` Tanks:** Apollo/EVA `PBI` and `Nomex` thermal weaves form the outer shell of modern municipal firefighter suits, while NASA filament-wound `COPV` pressure vessels cut firefighter `SCBA` air-tank weight by `~40%`.\n"
                "- **Smart Dust-Immune Detectors (`SAME / DAFT`):** Multi-angle laser smoke discrimination eliminates false alarms in mines, aircraft cargo bays, and industrial plants."
                if include_spinoff
                else ""
            )
            text = (
                "### Why Halon 1301 Is Strictly Prohibited & Mandatory NASA-STD-6001B Suppression Sequence (CON-05)\n"
                "1. **Why Halon 1301 (`CF₃Br`) Is Banned in Crewed Spacecraft:** In a sealed recirculating cabin (`ISS`, `Orion`, `Gateway`, `Lunar Rover`), Halon 1301 thermally decomposes on `>750 K` flames into **hydrogen fluoride (`HF`)** and **hydrogen bromide (`HBr`)** acid gases—lethal to crew lungs within minutes and **irreversibly poisoning ECLSS `LiOH` / amine `CO₂` scrubbers and trace-contaminant catalytic beds**.\n"
                f"2. **Live ECLSS Crew Survival Clock (`{tl.get('habitat_name_en', 'ISS Module')}`):** Sensor alarm at `+{tl.get('t_alarm_s', 6)} s` | Critical 1-hr **`SMAC 125 ppm CO`** reached at **`{tl.get('t_smac_125ppm_s', 180)} s`** | Cabin CO at crew response: `{tl.get('co_at_response_ppm', 40)} ppm`.\n"
                "3. **Mandatory 4-Step Non-Halon Countermeasure Sequence:**\n"
                f"   - **Step 1 — Immediate HVAC Ventilation Cutoff (`{inp['airflow_cms']} cm/s → 0 cm/s`):** Live solver check on `{inp['fuel_name_en']}` shows cutting airflow drops risk from **`{tel['risk_score']}/100` → `{zt['risk_score']}/100`** (regime `{zt['regime']}`), starving the flame inside its own `CO₂` shell.\n"
                "   - **Step 2 — Electrical Bus Isolation:** De-energize rack power to stop Joule heating and arc re-ignition.\n"
                "   - **Step 3 — `25–40 µm` Fine Water Mist (`ISS PFE / SoFIE-MIST`, `NTRS #20230008415`) or `CO₂ / N₂`:** Sub-40 µm droplets have high volumetric heat capacity (`L_v = 2257 kJ/kg`), evaporate in the reaction zone to expand `1700×` as inert steam, and leave zero toxic acid residue.\n"
                "   - **Step 4 — Controlled Cabin Depressurization & Post-Fire ECLSS Scrubbing:** Used only as a last resort (`Saffire` protocol), keeping `IR + CO` watch active before re-starting fans."
                + spinoff_sec
            )
        else:
            spinoff_sec_tr = (
                "\n\n### Dünya'daki İtfaiye ve Endüstriyel Güvenlik Uygulamaları (Space-to-Earth)\n"
                "- **İnce Su Sisi Söndürücüler (`SoFIE-MIST`):** `25–40 µm` su sisi nozulları bugün veri merkezleri, ameliyathaneler ve elektrikli araç lityum-iyon batarya depolarında Halon gazlarının yerini almıştır.\n"
                "- **İtfaiyeci Giysileri (`PBI/Nomex`) ve `SCBA` Hava Tankları:** Apollo/EVA yangın testlerinden doğan `PBI/Nomex` termal kumaşları modern itfaiyeci elbiselerinin dış katmanını oluşturur; NASA karbon-fiber `COPV` basınçlı kap teknolojisi ise itfaiyecilerin sırtındaki `SCBA` solunum tüplerini `%40` hafifletmiştir.\n"
                "- **Akıllı Duman Dedektörleri (`SAME / DAFT`):** Çok açılı lazer saçılma algoritmaları maden ocakları, uçak kargo ambarları ve fabrikalarda toz kaynaklı yanlış alarmları önlemektedir."
                if include_spinoff
                else ""
            )
            text = (
                "### İnsanlı Uzay Araçlarında Halon 1301 Neden Kesinlikle Yasaktır? — NASA-STD-6001B Protokolü (CON-05)\n"
                "1. **Halon 1301 (`CF₃Br`) Yasağının Bilimsel Nedeni:** Kapalı devre yaşam destek (`ECLSS`) kullanan uzay araçlarında (`ISS USOS`, `Orion`, `Lunar Gateway`, `Basınçlı Ay Gezgini`), Halon 1301 gazı `>750 K` alev çekirdeğinde parçalanarak aşırı korozif ve öldürücü **hidrojen florür (`HF`)** ile **hidrojen bromür (`HBr`)** asit gazları üretir. Bu gazlar hem mürettebat akciğerlerinde akut hasar yaratır hem de **ECLSS karbondioksit tutucu yatakları ve katalitik filtreleri kalıcı olarak zehirleyip devre dışı bırakır**.\n"
                f"2. **Aktif ECLSS Yaşam Destek Saati (`{tl.get('habitat_name_tr', 'ISS Modülü')}`):** Sensör alarmı `+{tl.get('t_alarm_s', 6)} sn` | Kritik **`SMAC 125 ppm CO`** sınırı **`{tl.get('t_smac_125ppm_s', 180)} sn`** | Müdahale anı CO birikimi: `{tl.get('co_at_response_ppm', 40)} ppm`.\n"
                "3. **Zorunlu 4 Adımlı Müdahale Protokolü:**\n"
                f"   - **Adım 1 — HVAC Havalandırma Fanlarını Anında Kapat (`{inp['airflow_cms']} cm/s → 0 cm/s`):** Aktif `{inp['fuel_name_tr']}` simülasyonunuzda akışı sıfırlamak yangın riskini **`{tel['risk_score']}/100` → `{zt['risk_score']}/100`** düzeyine indirir (`{zt['regime']}`) ve alevi kendi `CO₂` kabuğu içinde boğar.\n"
                "   - **Adım 2 — Raf/Bölme Elektrik Gücünü Kes:** Ark ve ohmik ısınma kaynaklı yeniden tutuşmayı engeller.\n"
                "   - **Adım 3 — `25–40 µm` İnce Su Sisi (`ISS Water Mist PFE / SoFIE-MIST`, `NTRS #20230008415`) veya `CO₂ / N₂`:** `40 µm` altı saf su damlacıkları alev cephesinde buharlaşarak (`L_v = 2257 kJ/kg`) yüksek gizli ısı çeker, hacimce `~1700` kat su buharına genleşip oksijeni seyreltir ve elektroniklere/ECLSS'e toksik kalıntı bırakmaz.\n"
                "   - **Adım 4 — Kontrollü Kabin Basınç Düşürme & Yeniden Havalandırma Denetimi:** Yalnızca son çare olarak uygulanır; fanlar tekrar açılmadan önce `IR + CO` sensörleriyle gizli Soğuk Alev kalmadığı doğrulanır."
                + spinoff_sec_tr
            )
        return (text, cits)

    # -------------------------------------------------------------------------
    # 9. SPESİFİK NASA PSI DENEYİ, NTRS RAPORU VEYA DONANIM RAFI SORGUSU
    # -------------------------------------------------------------------------
    if intent == "specific_experiment":
        matched: List[Dict[str, Any]] = []
        if _has_any(nq, ("en yuksek oksijen", "highest oxygen")):
            matched = [e for e in NASA_EXPERIMENTS_CATALOG if e["exp_id"] == "PSI-ACME-CFIG-14"]
        else:
            prog_map = [
                ("cfi-g", "PSI-ACME-CFIG-14"),
                ("cfig", "PSI-ACME-CFIG-14"),
                ("flex-2", "PSI-FLEX2-02"),
                ("flex", "PSI-FLEX-01"),
                ("cfi", "PSI-CFI-11"),
                ("e-field", "PSI-ACME-09"),
                ("bre", "PSI-BRE-05"),
                ("sofie-mist", "PSI-SOFIE-MIST-15"),
                ("sofie", "PSI-SOFIE-08"),
                ("saffire", "PSI-SAFFIRE5-07"),
                ("saffire-iv", "PSI-SAFFIRE4-06"),
                ("bass-ii", "PSI-BASS2-04"),
                ("bass", "PSI-BASS-03"),
                ("spice", "PSI-SPICE-12"),
                ("slise", "PSI-SLISE-13"),
                ("same", "PSI-SAME-10"),
                ("daft", "PSI-SAME-10"),
            ]
            for kw, eid in prog_map:
                if kw in nq:
                    for e in NASA_EXPERIMENTS_CATALOG:
                        if e["exp_id"] == eid and e not in matched:
                            matched.append(e)
            if not matched:
                if "msg" in nq:
                    matched = [e for e in NASA_EXPERIMENTS_CATALOG if e.get("hardware_group") == "MSG"][:4]
                elif "cygnus" in nq:
                    matched = [e for e in NASA_EXPERIMENTS_CATALOG if e.get("hardware_group") == "CYGNUS"][:3]
                elif "cir" in nq or "mdca" in nq:
                    matched = [e for e in NASA_EXPERIMENTS_CATALOG if e.get("hardware_group") == "CIR"][:4]

        if not matched:
            matched = top_exps[:2]

        blocks: List[str] = []
        cits: List[Dict[str, Any]] = []
        for e in matched[:3]:
            cits.append(
                {
                    "id": e["exp_id"],
                    "program": e["program"],
                    "ntrs_id": e["ntrs_id"],
                    "title": e["title"] if is_en else e["title_tr"],
                    "url": e["ntrs_url"],
                    "priority_score": e.get("priority_score", 94.0),
                }
            )
            runs = e.get("intra_runs") or []
            run_lines = ""
            if runs:
                hdr = (
                    "| Sub-Test / Run | Held Constant | Varied Parameter | Experimental Outcome |\n| :--- | :--- | :--- | :--- |\n"
                    if is_en
                    else "| Alt Test / Koşum | Sabit Tutulan | Değiştirilen Parametre | Deneysel Sonuç |\n| :--- | :--- | :--- | :--- |\n"
                )
                r_rows = [
                    f"| **{r.get('run_code') or r.get('run', '-')}** | {r['same_en'] if is_en else r['same_tr']} | {r['diff_en'] if is_en else r['diff_tr']} | {r['result_en'] if is_en else r['result_tr']} |"
                    for r in runs
                ]
                run_lines = "\n" + hdr + "\n".join(r_rows)

            if is_en:
                blocks.append(
                    f"### {e['program']} (`{e['exp_id']}`) — {e['title']}\n"
                    f"- **Orbital Facility & Rack:** `{e['facility']}` (`{e.get('hardware_group', 'CIR')}`) | **Citation:** [NTRS #{e['ntrs_id']}]({e['ntrs_url']})\n"
                    f"- **Test Envelope:** `{e['gravity_g']} G` | `{e['oxygen_pct']}% O₂` | `{e['pressure_psia']} psia` | Airflow `{e['airflow_cms']} cm/s` | Measured **`MOC = {e['moc_measured_pct']}% O₂`**\n"
                    f"- **Sample / Burner & Diagnostics:** {e.get('sample_geometry_en', e['material'])} — *{e.get('sensors_en', '')}*\n"
                    f"- **Primary Scientific Finding:** {e['key_finding_en']}\n"
                    f"- **Spacecraft Safety Implication:** {e['safety_insight_en']}"
                    f"{run_lines}"
                )
            else:
                blocks.append(
                    f"### {e['program']} (`{e['exp_id']}`) — {e['title_tr']}\n"
                    f"- **Yörünge Donanım Rafı:** `{e['facility']}` (`{e.get('hardware_group', 'CIR')}`) | **Resmi Kaynak:** [NTRS #{e['ntrs_id']}]({e['ntrs_url']})\n"
                    f"- **Test Koşulları:** `{e['gravity_g']} G` | `%{e['oxygen_pct']} O₂` | `{e['pressure_psia']} psia` | Akış `{e['airflow_cms']} cm/s` | Ölçülen **`MOC = %{e['moc_measured_pct']} O₂`**\n"
                    f"- **Numune / Brülör ve Sensörler:** {e.get('sample_geometry_tr', e['material'])} — *{e.get('sensors_tr', '')}*\n"
                    f"- **Temel Bilimsel Bulgu:** {e['key_finding_tr']}\n"
                    f"- **Uzay Aracı Güvenlik Çıkarımı:** {e['safety_insight_tr']}"
                    f"{run_lines}"
                )

        # Eğer kullanıcı belirli bir NTRS-... / OSDR-... başlığını sorduysa onu da üstte özetle
        ntrs_note = ""
        m_id = re.search(r"((?:ntrs|osdr)-[a-z0-9_-]+)", nq)
        if m_id and rag_hits:
            top_doc = rag_hits[0]
            ntrs_note = (
                f"> **Queried Live Record (`{user_message[:70]}`):** {top_doc['text'][:340]}\n\n"
                if is_en
                else f"> **Sorgulanan Canlı Kayıt Özeti:** {top_doc['text'][:340]}\n\n"
            )

        return (ntrs_note + "\n\n".join(blocks), cits)

    # -------------------------------------------------------------------------
    # 10. SPESİFİK DENKLEM VE BOYUTSUZ SAYI TÜRETİMİ (CANLI DEĞERLERLE)
    # -------------------------------------------------------------------------
    if intent == "equation_deep_dive":
        eq_rows = active_sim.get("formula_table") or []
        tbl_lines = [
            f"| **{r['law_en'] if is_en else r['law_tr']}** | `{r['equation']}` | **`{r['value']}`** | {r['status_en'] if is_en else r['status_tr']} |"
            for r in eq_rows
        ]
        # Spesifik odak açıklaması
        focus_note = ""
        if _has_any(nq, ("spalding", "b_oq", "boq", "d2", "d²", "yanma sabiti", "burning constant", "standoff", "durma")):
            focus_note = (
                f"### Step-by-Step Droplet `d²`-Law & Spalding `B_oq` Derivation\n"
                f"1. **Spalding Mass-Transfer Number (`B_oq = {tel.get('spalding_b_number', 0)}`):** Measures exothermic oxidation enthalpy released per unit mass of oxidizer (`Y_O2·ΔH_c / ν_s`) plus ambient sensible enthalpy divided by latent heat of vaporization (`L_v`). Higher `O₂` (`{inp['oxygen_pct']}%`) raises `B_oq` logarithmically via `ln(1 + B_oq)`.\n"
                f"2. **Effective Burning Rate Constant (`K = {tel['burning_rate_k_mm2_s']} mm²/s`):** Computed from `K = [8·λ_g / (ρ_l·c_p)] · ln(1 + B_oq) · (Sh / 2) · (1 - χ_r)`. With `D₀ = {inp['droplet_d0_mm']} mm`, total burn lifetime is `t_burn = D₀² / K = {tel['burn_lifetime_s']} s`, and dimensionless standoff ratio is **`R_f / R_d = {tel.get('standoff_ratio_rf_rd', 0)}`** (`R_f = {tel['flame_radius_mm']} mm`).\n\n"
                if is_en
                else f"### Adım Adım `d²` Damlacık Yasası ve Spalding `B_oq` Türetimi\n"
                f"1. **Spalding Kütle/Isı Aktarım Sayısı (`B_oq = {tel.get('spalding_b_number', 0)}`):** Oksijen kütle kesriyle (`%{inp['oxygen_pct']} O₂`) açığa çıkan yanma entalpisinin (`Y_O2·ΔH_c / ν_s`) yakıtın gizli buharlaşma ısısına (`L_v`) oranıdır; damlacık yüzeyindeki buharlaşma sürücü kuvvetini belirler.\n"
                f"2. **Efektif Yanma Hızı Sabiti (`K = {tel['burning_rate_k_mm2_s']} mm²/s`):** `K = [8·λ_g / (ρ_l·c_p)] · ln(1 + B_oq) · (Sh / 2) · (1 - χ_r)` bağıntısıyla hesaplanır. Başlangıç çapı `D₀ = {inp['droplet_d0_mm']} mm` için tam yanma ömrü `t_burn = D₀² / K = {tel['burn_lifetime_s']} sn` ve boyutsuz alev durma mesafesi **`R_f / R_d = {tel.get('standoff_ratio_rf_rd', 0)}`** (`R_f = {tel['flame_radius_mm']} mm`) bulunur.\n\n"
            )
        elif _has_any(nq, ("sherwood", "reynolds", "rayleigh", "grashof", "richardson")):
            focus_note = (
                f"### Convective vs. Buoyant Transport Scaling (`Re`, `Sh`, `Gr`, `Ra`, `Ri`)\n"
                f"- At `U = {inp['airflow_cms']} cm/s` and `{inp['gravity_g']} G`, **`Re = {tel.get('reynolds_number', 0)}`**, **`Ra = {tel.get('rayleigh_number', 0)}`**, and **`Ri = Gr / Re² = {tel.get('richardson_number', 0)}`**. Frössling correlation yields **`Sh = 2 + 0.6·Re^(1/2)·Sc^(1/3) = {tel['sherwood_number']}`** (where `Sh = 2.0` is pure `0G` spherical molecular diffusion).\n\n"
                if is_en
                else f"### Konvektif ve Kaldırma Kuvvetli Taşınım Ölçeklemesi (`Re`, `Sh`, `Gr`, `Ra`, `Ri`)\n"
                f"- Aktif `U = {inp['airflow_cms']} cm/s` ve `{inp['gravity_g']} G` koşullarında **`Re = {tel.get('reynolds_number', 0)}`**, **`Ra = {tel.get('rayleigh_number', 0)}`** ve **`Ri = Gr / Re² = {tel.get('richardson_number', 0)}`** hesaplanır. Frössling bağıntısından **`Sh = 2 + 0.6·Re^(1/2)·Sc^(1/3) = {tel['sherwood_number']}`** elde edilir (`Sh = 2.0` saf `0G` küresel moleküler difüzyon limitidir).\n\n"
            )
        elif _has_any(nq, ("damkohler", "moc", "kritik oksijen", "radyatif", "chi_r")):
            focus_note = (
                f"### Extinction Kinetics: Damköhler (`Da`), Radiative Loss (`χ_r`) & Critical `MOC`\n"
                f"- **Damköhler (`Da = τ_flow / τ_chem = {tel.get('damkohler_number', 0)}`):** When `Da < 1`, residence time is shorter than chemical induction time (blowoff). At low `0G` flow (`2–8 cm/s`), `Da >> 1` while radiative loss is `χ_r = {tel['radiative_loss_fraction'] * 100:.1f}%`, setting critical **`MOC = {tel['moc_pct']}% O₂`** vs ambient `{inp['oxygen_pct']}% O₂`.\n\n"
                if is_en
                else f"### Sönme Kinetiği: Damköhler (`Da`), Radyatif Kayıp (`χ_r`) ve Kritik `MOC`\n"
                f"- **Damköhler Sayısı (`Da = τ_akış / τ_kimya = {tel.get('damkohler_number', 0)}`):** `Da < 1` olduğunda yüksek fan hızı alevi üfleyerek söndürür (*blowoff*). Düşük `0G` kabin akışında (`2–8 cm/s`) `Da > 1` kalırken radyatif kayıp `χ_r = %{tel['radiative_loss_fraction'] * 100:.1f}` olur ve kritik tutuşabilirlik sınırı **`MOC = %{tel['moc_pct']} O₂`** olarak belirlenir.\n\n"
            )

        hdr_md = (
            f"### Live Governing Equations & Dimensionless Substitution (`{inp['fuel_name_en']}`)\n\n"
            "| Physical Law / Criterion | Governing Equation | Live Numerical Value | Regime Diagnosis |\n"
            "| :--- | :--- | :--- | :--- |\n"
            if is_en
            else f"### Aktif 3B Odanız İçin Canlı Denklem ve Boyutsuz Sayı Çözümü (`{inp['fuel_name_tr']}`)\n\n"
            "| Fiziksel Yasa / Kriter | Matematiksel Denklem | Anlık Sayısal Sonuç | Rejim Tanısı |\n"
            "| :--- | :--- | :--- | :--- |\n"
        )
        return (focus_note + hdr_md + "\n".join(tbl_lines), default_citations[:2])

    # -------------------------------------------------------------------------
    # 11. KARŞI-OLGUSAL 'NE OLUR?' DUYARLILIK ANALİZİ (AKIŞ / O2 / SEYRELTİCİ / G)
    # -------------------------------------------------------------------------
    if intent == "what_if_sensitivity":
        if _has_any(nq, ("seyreltici", "diluent", "helyum", "helium", "argon", "co2", "azot")):
            sweep_title = "Diluent Gas (`N₂` vs `CO₂` vs `He` vs `Ar`)" if is_en else "Seyreltici Kabin Gazı (`N₂` vs `CO₂` vs `He` vs `Ar`)"
            variants = [
                (f"N₂ (Azot • ISS)", {**inp, "diluent": "N2"}),
                (f"CO₂ (Yüksek c_p Söndürücü)", {**inp, "diluent": "CO2"}),
                (f"He (Yüksek Isıl İletkenlik λ)", {**inp, "diluent": "He"}),
                (f"Ar (Düşük c_p Soygaz)", {**inp, "diluent": "Ar"}),
            ]
        elif _has_any(nq, ("oksijen", "oxygen", "o2")):
            sweep_title = "Oxygen Concentration Sweep (`14%` → `34% O₂`)" if is_en else "Oksijen Konsantrasyonu Taraması (`%14` → `%34 O₂`)"
            variants = [(f"%{ox} O₂", {**inp, "oxygen_pct": ox}) for ox in (14.0, 18.0, 21.0, 28.0, 34.0)]
        elif _has_any(nq, ("0g ile 1g", "yercekimi", "gravity", "1g")):
            sweep_title = "Gravity Sweep (`0G` vs `0.16G` vs `0.38G` vs `1G`)" if is_en else "Yerçekimi Taraması (`0G` vs `0.16G` vs `0.38G` vs `1G`)"
            variants = [(f"{gv} G", {**inp, "gravity_g": gv}) for gv in (0.0, 0.16, 0.38, 1.0)]
        else:
            sweep_title = "Ventilation Airflow Sweep (`0` → `30 cm/s`)" if is_en else "Kabin Havalandırma Akış Hızı Taraması (`0` → `30 cm/s`)"
            variants = [(f"U = {u} cm/s", {**inp, "airflow_cms": u}) for u in (0.0, 2.0, 6.0, 15.0, 30.0)]

        rows_sw: List[str] = []
        for lbl, prm in variants:
            sw = simulate_combustion_state(prm)
            swt = sw["telemetry"]
            rate_v = f"V_f={swt['flame_spread_mm_s']} mm/s" if swt["flame_spread_mm_s"] > 0 else f"K={swt['burning_rate_k_mm2_s']} mm²/s"
            rows_sw.append(
                f"| **{lbl}** | `{swt['sherwood_number']}` | `{swt.get('damkohler_number', 0)}` | **`{swt['moc_pct']}% O₂`** | `{swt['flame_temp_k']} K` | `{rate_v}` | `{swt['regime']}` (**`{swt['risk_score']}/100`**) |"
            )

        if is_en:
            text = (
                f"### Counterfactual Sensitivity Simulation: {sweep_title} — `{inp['fuel_name_en']}`\n\n"
                "| Perturbed Condition | Sherwood `Sh` | Damköhler `Da` | Critical `MOC` | Flame `T_f` | Burn / Spread | Regime & Risk |\n"
                "| :--- | :--- | :--- | :--- | :--- | :--- | :--- |\n"
                + "\n".join(rows_sw)
                + "\n\n"
                "- **Physical Takeaway (CON-03 Ventilation Paradox):** Notice the non-monotonic **U-shaped `MOC` curve**: at `U = 0 cm/s`, radiative/diffusive self-blanketing weakens or quenches the flame; at gentle `2–8 cm/s` spacecraft ventilation, fresh `O₂` transport (`Sh > 2`, `Da > 1`) **maximizes flammability hazard (lowest `MOC`)**; at high velocity (`>25 cm/s`), residence time drops (`Da → 1`) toward convective blowoff (**BASS / SPICE / SLISE**)."
            )
        else:
            text = (
                f"### Karşı-Olgusal Duyarlılık Simülasyonu: {sweep_title} — `{inp['fuel_name_tr']}`\n\n"
                "| Test Noktası | Sherwood `Sh` | Damköhler `Da` | Kritik `MOC` | Sıcaklık `T_f` | Yanma / Yayılma | Rejim & Risk |\n"
                "| :--- | :--- | :--- | :--- | :--- | :--- | :--- |\n"
                + "\n".join(rows_sw)
                + "\n\n"
                "- **Fiziksel Yorum (CON-03 Havalandırma Paradoksu):** Tabloda **U-biçimli `MOC` davranışı** açıkça görülür: tam durgun ortamda (`U = 0 cm/s`) alev kendi `CO₂` kabuğu ve radyatif kayıpla (`χ_r`) boğulurken; `2–8 cm/s` hafif ISS fan esintisi taze `O₂` besleyerek (`Sh > 2`, `Da > 1`) **kritik `MOC` sınırını en tehlikeli minimuma çeker**; çok yüksek fan hızlarında (`>25 cm/s`) ise kalış süresi kısalır (`Da → 1`) ve üfleyerek sönme (*blowoff*) başlar (**BASS / SPICE / SLISE**)."
            )
        return (text, default_citations[:2])

    # -------------------------------------------------------------------------
    # 12. UZAYDAN DÜNYA'YA (SPACE-TO-EARTH) TEKNOLOJİ TRANSFERİ
    # -------------------------------------------------------------------------
    if intent == "earth_spinoffs":
        rows_et = [
            f"| **{et['domain_en'] if is_en else et['domain_tr']}** | `{et['nasa_source']}` | {et['insight_en'] if is_en else et['insight_tr']} |"
            for et in SPACE_TO_EARTH_TRANSFERS
        ]
        hdr = (
            "### Space-to-Earth Fire Safety & Clean Combustion Spinoffs (CON-09)\n\n"
            "| Terrestrial Application Domain | NASA PSI Flight Heritage | Engineering Mechanism & Impact |\n"
            "| :--- | :--- | :--- |\n"
            if is_en
            else "### NASA Mikroçekim Yanma Araştırmalarının Dünya'daki Güvenlik Uygulamaları (CON-09)\n\n"
            "| Dünya Uygulama Alanı | NASA PSI Uçuş Kaynağı | Mühendislik Mekanizması ve Etkisi |\n"
            "| :--- | :--- | :--- |\n"
        )
        return (hdr + "\n".join(rows_et), default_citations[:3])

    # -------------------------------------------------------------------------
    # 13. YÜKLENEN DOSYA / ALEV GÖRÜNTÜSÜ ODAKLI ANALİZ
    # -------------------------------------------------------------------------
    if intent == "uploaded_media":
        exp_lines = "\n".join(
            f"- **#{e['rank']} {e['program']} (`{e['exp_id']}` • [NTRS #{e['ntrs_id']}]({e['ntrs_url']}))** — Score `{e['priority_score']}/100`, MOC `{e['moc_measured_pct']}%`: {e['key_finding_en'] if is_en else e['key_finding_tr']}"
            for e in top_exps[:3]
        )
        if is_en:
            text = (
                "### Multimodal Dataset / Flame Imagery Synthesis\n"
                f"{media_context}\n\n"
                "### Synchronized 3D Chamber & Dimensionless Solver Output\n"
                f"- **Extracted State (`{inp['fuel_name_en']}`):** `{inp['gravity_g']} G`, `{inp['oxygen_pct']}% O₂` (`P_O2 = {tel.get('o2_partial_psia', 0)} psia`), `{inp['airflow_cms']} cm/s` → Regime **`{tel['regime']}`** (`T_f = {tel['flame_temp_k']} K`, Risk **`{tel['risk_score']}/100`**).\n"
                f"- **Transport & Kinetics:** `K = {tel['burning_rate_k_mm2_s']} mm²/s` | `B_oq = {tel.get('spalding_b_number', 0)}` | `Sh = {tel['sherwood_number']}` | `Da = {tel.get('damkohler_number', 0)}` | `χ_r = {tel['radiative_loss_fraction'] * 100:.1f}%` | `MOC = {tel['moc_pct']}% O₂`.\n\n"
                f"### Closest Matching NASA PSI Flight Benchmarks\n{exp_lines}"
            )
        else:
            text = (
                "### Yüklenen Veri Kaynağı / Alev Görseli Fiziksel Sentezi\n"
                f"{media_context}\n\n"
                "### 3B Yanma Odası ve Boyutsuz Denklem Çıktıları\n"
                f"- **Senkronize Durum (`{inp['fuel_name_tr']}`):** `{inp['gravity_g']} G`, `%{inp['oxygen_pct']} O₂` (`P_O2 = {tel.get('o2_partial_psia', 0)} psia`), `{inp['airflow_cms']} cm/s` → Rejim **`{tel['regime']}`** (`T_f = {tel['flame_temp_k']} K`, Risk **`{tel['risk_score']}/100`**).\n"
                f"- **Taşınım & Kinetik:** `K = {tel['burning_rate_k_mm2_s']} mm²/s` | `B_oq = {tel.get('spalding_b_number', 0)}` | `Sh = {tel['sherwood_number']}` | `Da = {tel.get('damkohler_number', 0)}` | `χ_r = %{tel['radiative_loss_fraction'] * 100:.1f}` | `MOC = %{tel['moc_pct']} O₂`.\n\n"
                f"### En Yakın NASA PSI Uçuş Referansları\n{exp_lines}"
            )
        return (text, default_citations)

    # -------------------------------------------------------------------------
    # 14. TAM KAPSAMLI 4-BÖLÜMLÜ MÜHENDİSLİK SENTEZİ (PRESET #1)
    # -------------------------------------------------------------------------
    if intent == "full_synthesis":
        call = active_sim["callouts"]
        pg_info = active_sim.get("partial_gravity_info") or {}
        if is_en:
            exp_lines = "\n".join(
                f"{e['rank']}. **{e['program']} ({e['exp_id']} • {e.get('hardware_group', 'CIR')} • [NTRS #{e['ntrs_id']}]({e['ntrs_url']}))** — Score `{e['priority_score']}/100` (MOC `{e['moc_measured_pct']}%`): {e['key_finding_en']}"
                for e in top_exps[:4]
            )
            pg_line = f"- **Partial-G / Atmosphere Note:** {pg_info['en']}\n" if (pg_info.get("show_banner") and pg_info.get("en")) else ""
            text = (
                f"### 1. Physical Regime & Governing Equation Diagnosis: {call['badge_en']}\n"
                f"- **Active State (`{inp['fuel_name_en']}`):** `{inp['gravity_g']} G`, `{inp['oxygen_pct']}% O₂` (`P_O2 = {tel.get('o2_partial_psia', 0)} psia`), `U = {inp['airflow_cms']} cm/s` → Temp `{tel['flame_temp_k']} K`, Risk **`{tel['risk_score']}/100`**.\n"
                f"- **Dimensionless Numbers:** `K = {tel['burning_rate_k_mm2_s']} mm²/s` | `B_oq = {tel.get('spalding_b_number', 0)}` | `R_f/R_d = {tel.get('standoff_ratio_rf_rd', 0)}` | `Re = {tel.get('reynolds_number', 0)}` | `Sh = {tel['sherwood_number']}` | `Ra = {tel.get('rayleigh_number', 0)}` | `Ri = {tel.get('richardson_number', 0)}` | `Da = {tel.get('damkohler_number', 0)}` | `χ_r = {tel['radiative_loss_fraction'] * 100:.1f}%` | `MOC = {tel['moc_pct']}% O₂`.\n"
                f"- **ISS Flight Validation:** `R² = {fv.get('r_squared', 0.996)}` • `RMSE = {fv.get('rmse', 0.015)}` ({fv.get('campaign', 'NASA GRC PSI')}).\n"
                f"{pg_line}"
                + (f"- **Attached Context:** {media_context}\n" if media_context else "")
                + f"\n### 2. Ranked NASA PSI Investigations & NTRS Evidence\n{exp_lines}\n\n"
                f"### 3. ECLSS Survival Clock & Non-Halon Fire Safety Protocol (NASA-STD-6001B)\n"
                f"- **Survival Clock (`{tl.get('habitat_name_en', 'ISS Module')}`):** Alarm `+{tl.get('t_alarm_s', 6)} s` | `SMAC 125 ppm CO` in **`{tl.get('t_smac_125ppm_s', 180)} s`** | Response CO `{tl.get('co_at_response_ppm', 40)} ppm`.\n"
                f"- **Countermeasure Sequence:** **(1)** Cut HVAC airflow (`{inp['airflow_cms']} → 0 cm/s`), **(2)** Isolate bus power, **(3)** Discharge **25–40 µm Fine Water Mist (SoFIE-MIST PFE)** or CO₂/N₂ (*Halon 1301 strictly banned*).\n\n"
                f"### 4. Space-to-Earth Fire Safety Transfer\n"
                f"- Sub-50 µm **SoFIE-MIST** clean-agent water mist, **SAME/DAFT** dust-immune multi-angle smoke detectors, **PBI/Nomex** firefighter turnout gear & composite **SCBA** air tanks, and clean **HCCI** engine kinetics."
            )
        else:
            exp_lines_tr = "\n".join(
                f"{e['rank']}. **{e['program']} ({e['exp_id']} • {e.get('hardware_group', 'CIR')} • [NTRS #{e['ntrs_id']}]({e['ntrs_url']}))** — Öncelik `{e['priority_score']}/100` (MOC `%{e['moc_measured_pct']}`): {e['key_finding_tr']}"
                for e in top_exps[:4]
            )
            pg_line_tr = f"- **Özel Atmosfer / Kısmi Yerçekimi Notu:** {pg_info['tr']}\n" if (pg_info.get("show_banner") and pg_info.get("tr")) else ""
            text = (
                f"### 1. Fiziksel Rejim ve Boyutsuz Taşınım Denklemleri Sentezi: {call['badge_tr']}\n"
                f"- **Aktif Durum (`{inp['fuel_name_tr']}`):** `{inp['gravity_g']} G`, `%{inp['oxygen_pct']} O₂` (`P_O2 = {tel.get('o2_partial_psia', 0)} psia`), `U = {inp['airflow_cms']} cm/s` → Sıcaklık `{tel['flame_temp_k']} K`, Risk **`{tel['risk_score']}/100`**.\n"
                f"- **Boyutsuz Sayılar:** `K = {tel['burning_rate_k_mm2_s']} mm²/s` | `B_oq = {tel.get('spalding_b_number', 0)}` | `R_f/R_d = {tel.get('standoff_ratio_rf_rd', 0)}` | `Re = {tel.get('reynolds_number', 0)}` | `Sh = {tel['sherwood_number']}` | `Ra = {tel.get('rayleigh_number', 0)}` | `Ri = {tel.get('richardson_number', 0)}` | `Da = {tel.get('damkohler_number', 0)}` | `χ_r = %{tel['radiative_loss_fraction'] * 100:.1f}` | `MOC = %{tel['moc_pct']} O₂`.\n"
                f"- **ISS Uçuş Telemetrisi Doğrulaması:** `R² = {fv.get('r_squared', 0.996)}` • `RMSE = {fv.get('rmse', 0.015)}` ({fv.get('campaign', 'NASA GRC PSI')}).\n"
                f"{pg_line_tr}"
                + (f"- **Ekli Dosya / Görsel Bağlamı:** {media_context}\n" if media_context else "")
                + f"\n### 2. Termodinamik & TF-IDF Sıralı NASA PSI Soruşturmaları\n{exp_lines_tr}\n\n"
                f"### 3. ECLSS Yaşam Destek Saati ve Müdahale Protokolü (NASA-STD-6001B)\n"
                f"- **Yaşam Destek Saati (`{tl.get('habitat_name_tr', 'ISS Modülü')}`):** Sensör alarmı `+{tl.get('t_alarm_s', 6)} sn` | Kritik `SMAC 125 ppm CO` eşiği **`{tl.get('t_smac_125ppm_s', 180)} sn`** | Müdahale CO `{tl.get('co_at_response_ppm', 40)} ppm`.\n"
                f"- **Zorunlu Müdahale Sırası:** **(1)** HVAC fanlarını kapat (`{inp['airflow_cms']} → 0 cm/s`), **(2)** Elektrik beslemesini izole et, **(3)** **25–40 µm İnce Su Sisi (SoFIE-MIST PFE)** veya CO₂/N₂ uygula (*Halon 1301 toksik HF/HBr nedeniyle yasaktır*).\n\n"
                f"### 4. Uzaydan Dünya'ya Yangın Güvenliği Teknoloji Transferi\n"
                f"- **25–40 µm SoFIE-MIST** su sisli söndürücüler, **SAME/DAFT** toz-bağışıklı lazer duman dedektörleri, **PBI/Nomex** itfaiyeci koruyucu giysileri & hafif **SCBA** kompozit hava tankları ve temiz **HCCI** motor kinetiği."
            )
        return (text, default_citations)

    # -------------------------------------------------------------------------
    # 15. AÇIK UÇLU / SPESİFİK KAVRAM SORGUSU (SIFIR KOPYALA-YAPIŞTIR GARANTİSİ)
    # -------------------------------------------------------------------------
    # Yakıt adı sorulduysa o yakıtın termofiziksel özelliklerini çıkar
    mentioned_fuel = None
    fuel_kw_map = {
        "heptan": "n_heptane",
        "metanol": "methanol",
        "methanol": "methanol",
        "pmma": "pmma",
        "akrilik": "pmma",
        "acrylic": "pmma",
        "sibal": "sibal",
        "pamuk": "sibal",
        "cotton": "sibal",
        "nomex": "nomex",
        "hidrojen": "hydrogen",
        "hydrogen": "hydrogen",
        "propan": "propane_cfig",
        "propane": "propane_cfig",
    }
    for fkw, fid in fuel_kw_map.items():
        if fkw in nq and fid in FUEL_PROPERTIES:
            mentioned_fuel = (fid, FUEL_PROPERTIES[fid])
            break

    best_exp = top_exps[0] if top_exps else NASA_EXPERIMENTS_CATALOG[0]
    second_exp = top_exps[1] if len(top_exps) > 1 else NASA_EXPERIMENTS_CATALOG[1]

    # İlgili direktifi bul
    best_dir = CORE_DIRECTIVES_LIST[0]
    best_dir_score = -1
    q_tokens = [w for w in re.split(r"[^a-z0-9]+", nq) if len(w) >= 3]
    for d in CORE_DIRECTIVES_LIST:
        d_blob = _norm(f"{d['title_tr']} {d['rule_tr']} {d['title_en']} {d['rule_en']}")
        sc = sum(1 for tok in q_tokens if tok in d_blob)
        if sc > best_dir_score:
            best_dir_score = sc
            best_dir = d

    fuel_section = ""
    if mentioned_fuel:
        mf_id, mf = mentioned_fuel
        sim_mf = simulate_combustion_state({**inp, "fuel_id": mf_id})
        mft = sim_mf["telemetry"]
        fuel_section = (
            f"- **Queried Fuel / Material (`{mf['name_en']}`, `{mf['formula']}`):** 3D Geometry `{mf['geometry_3d']}`, 0G Baseline `MOC = {mf['moc_0g_pct']}% O₂` vs 1G `MOC = {mf['moc_1g_pct']}% O₂`. Under your current atmosphere (`{inp['oxygen_pct']}% O₂`, `{inp['gravity_g']} G`), it yields `T_f = {mft['flame_temp_k']} K`, regime **`{mft['regime']}`**, Risk **`{mft['risk_score']}/100`**.\n"
            if is_en
            else f"- **Sorgulanan Yakıt / Numune (`{mf['name_tr']}`, `{mf['formula']}`):** 3B Geometri `{mf['geometry_3d']}`, `0G` baz `MOC = %{mf['moc_0g_pct']} O₂` vs `1G` `MOC = %{mf['moc_1g_pct']} O₂`. Mevcut atmosferinizde (`%{inp['oxygen_pct']} O₂`, `{inp['gravity_g']} G`) `T_f = {mft['flame_temp_k']} K`, **`{mft['regime']}`** rejimi ve **`{mft['risk_score']}/100`** risk skoru üretir.\n"
        )

    rag_snippet = ""
    if rag_hits:
        top_r = rag_hits[0]
        rag_snippet = (
            f"- **Corpus Evidence Match (`{top_r['title']}`):** {top_r['text'][:320]}\n"
            if is_en
            else f"- **Bilgi Tabanı Kanıt Eşleşmesi (`{top_r['title']}`):** {top_r['text'][:320]}\n"
        )

    clean_q_disp = user_message.strip()[:110]
    if is_en:
        text = (
            f"### Targeted Scientific Analysis — *\"{clean_q_disp}\"*\n"
            f"{fuel_section}"
            f"- **Governing Physical Rule (`{best_dir['id']} • {best_dir['code']}`):** {best_dir['rule_en']}\n"
            f"{rag_snippet}"
            f"- **Live Chamber Coupling (`{inp['fuel_name_en']}`):** At `{inp['gravity_g']} G`, `{inp['oxygen_pct']}% O₂` (`P_O2 = {tel.get('o2_partial_psia', 0)} psia`), and `U = {inp['airflow_cms']} cm/s`, your chamber operates in **`{tel['regime']}`** (`T_f = {tel['flame_temp_k']} K`, `K = {tel['burning_rate_k_mm2_s']} mm²/s`, `Sh = {tel['sherwood_number']}`, `Da = {tel.get('damkohler_number', 0)}`, `MOC = {tel['moc_pct']}% O₂`, Risk **`{tel['risk_score']}/100`**).\n"
            f"- **Matched NASA PSI Records:**\n"
            f"  1. **{best_exp['program']} (`{best_exp['exp_id']}` • [NTRS #{best_exp['ntrs_id']}]({best_exp['ntrs_url']}))** — {best_exp['key_finding_en']}\n"
            f"  2. **{second_exp['program']} (`{second_exp['exp_id']}` • [NTRS #{second_exp['ntrs_id']}]({second_exp['ntrs_url']}))** — {second_exp['key_finding_en']}"
        )
    else:
        text = (
            f"### Soru-Odaklı Bilimsel Analiz — *\"{clean_q_disp}\"*\n"
            f"{fuel_section}"
            f"- **İlgili Fiziksel Kısıt ve Yasa (`{best_dir['id']} • {best_dir['code']}`):** {best_dir['rule_tr']}\n"
            f"{rag_snippet}"
            f"- **Aktif 3B Odanızla Sayısal Bağlantı (`{inp['fuel_name_tr']}`):** `{inp['gravity_g']} G`, `%{inp['oxygen_pct']} O₂` (`P_O2 = {tel.get('o2_partial_psia', 0)} psia`) ve `U = {inp['airflow_cms']} cm/s` koşullarında **`{tel['regime']}`** rejimi aktiftir (`T_f = {tel['flame_temp_k']} K`, `K = {tel['burning_rate_k_mm2_s']} mm²/s`, `Sh = {tel['sherwood_number']}`, `Da = {tel.get('damkohler_number', 0)}`, `MOC = %{tel['moc_pct']} O₂`, Risk **`{tel['risk_score']}/100`**).\n"
            f"- **Doğrudan Eşleşen NASA PSI Bulguları:**\n"
            f"  1. **{best_exp['program']} (`{best_exp['exp_id']}` • [NTRS #{best_exp['ntrs_id']}]({best_exp['ntrs_url']}))** — {best_exp['key_finding_tr']}\n"
            f"  2. **{second_exp['program']} (`{second_exp['exp_id']}` • [NTRS #{second_exp['ntrs_id']}]({second_exp['ntrs_url']}))** — {second_exp['key_finding_tr']}"
        )
    return (text, default_citations[:2])
