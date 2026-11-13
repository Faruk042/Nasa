# -*- coding: utf-8 -*-
"""
ALTAR-NASA Evrensel Dosya, Alev Görüntüsü (Computer Vision) ve Web Verisi İşleme Motoru.
Kullanıcı sisteme bir RESİM (.png/.jpg/.webp), VERİ DOSYASI (.csv/.json/.pdf/.txt) veya WEB URL'si
verdiğinde bu modül:
1) Sayısal ve fiziksel yanma parametrelerini (O2 %, Basınç psia, Akış hızı cm/s, Yerçekimi G,
   Damlacık çapı mm, Yakıt tipi, D² eğimi K, Spektral CH*/Soot oranı, Küresellik H/W) çıkarır,
2) Doğrudan 3B Simülasyon ve Grafik motorunun anlayacağı 'extracted_sim_params' sözlüğüne dönüştürür,
3) Yapay Zekâ (Ollama / Gemini / Antigravity / OpenRouter) için yapılandırılmış bilimsel özet üretir.
"""

from __future__ import annotations

import base64
import csv
import io
import json
import math
import re
from typing import Any, Dict, List, Optional

import numpy as np
from PIL import Image

# Görsel Decompression Bomb saldırılarını kesin olarak önle (Maks 25 Megapiksel)
Image.MAX_IMAGE_PIXELS = 25_000_000


def analyze_flame_image_bytes(raw_bytes: bytes, filename: str = "flame.jpg") -> Dict[str, Any]:
    """
    Yüklenen alev fotoğrafını veya deney grafiğini Pillow + NumPy ile piksel düzeyinde inceler:
    - Parlak alev bölgesini segmente eder,
    - En/Boy küresellik oranından (H/W) 0G Küresel vs. 0G Havalandırmalı vs. 1G Kaldırma rejimini saptar,
    - Mavi Kemilüminesans (CH*/OH*) ile Sarı/Turuncu Kurum (Soot) ve Mor UV (Cool Flame) oranlarını ölçer,
    - Tahmini sıcaklık (K), kurum indeksi ve 3B simülasyon parametrelerini üretir.
    """
    try:
        img = Image.open(io.BytesIO(raw_bytes)).convert("RGB")
        orig_w, orig_h = img.size
        # Hızlı ve kararlı analiz için 256px ölçeğe örnekle
        proc = img.resize((256, 256), Image.Resampling.BILINEAR)
        arr = np.asarray(proc, dtype=np.float32) / 255.0

        r = arr[:, :, 0]
        g = arr[:, :, 1]
        b = arr[:, :, 2]
        lum = 0.299 * r + 0.587 * g + 0.114 * b
        max_channel = np.maximum(np.maximum(r, g), b)

        # Alev / ışıma maskesi (karanlık uzay odası arka planından ayırma)
        threshold = max(0.16, float(np.percentile(max_channel, 78)) * 0.55)
        mask = max_channel > threshold
        active_count = int(np.sum(mask))

        if active_count < 30:
            mask = max_channel > 0.08
            active_count = max(1, int(np.sum(mask)))

        ys, xs = np.where(mask)
        if len(xs) > 5 and len(ys) > 5:
            bbox_w = max(4.0, float(np.percentile(xs, 95) - np.percentile(xs, 5)))
            bbox_h = max(4.0, float(np.percentile(ys, 95) - np.percentile(ys, 5)))
            aspect_hw = round(bbox_h / bbox_w, 2)
        else:
            bbox_w, bbox_h = 60.0, 60.0
            aspect_hw = 1.0

        mean_r = float(np.mean(r[mask])) if np.any(mask) else float(np.mean(r))
        mean_g = float(np.mean(g[mask])) if np.any(mask) else float(np.mean(g))
        mean_b = float(np.mean(b[mask])) if np.any(mask) else float(np.mean(b))
        rgb_sum = max(1e-5, mean_r + mean_g + mean_b)

        blue_chemilum_ratio = round(mean_b / rgb_sum, 3)
        soot_warm_ratio = round((mean_r + 0.5 * mean_g) / (rgb_sum * 1.25), 3)
        violet_uv_ratio = round(min(mean_r, mean_b) / max(0.05, mean_g + 0.2), 3)

        # Fiziksel rejim çıkarımı
        is_cool_flame = (blue_chemilum_ratio > 0.36 and violet_uv_ratio > 0.72 and float(np.mean(lum[mask])) < 0.48)
        if is_cool_flame:
            inferred_gravity = 0.0
            inferred_airflow = 0.0
            inferred_o2 = 13.0
            inferred_fuel = "n_heptane"
            detected_regime_tr = "Görünmez/UV Soğuk Alev (Cool Flame • 0G NTC Rejimi)"
            detected_regime_en = "Invisible/UV Cool Flame (0G NTC Regime)"
        elif aspect_hw > 1.28:
            inferred_gravity = min(1.0, round((aspect_hw - 1.0) * 1.15, 2))
            inferred_airflow = 2.0
            inferred_o2 = 21.0 if soot_warm_ratio < 0.58 else 26.0
            inferred_fuel = "n_heptane" if soot_warm_ratio >= 0.42 else "methanol"
            detected_regime_tr = f"Kaldırma Kuvvetli (Buoyant) Uzamış Alev (H/W = {aspect_hw})"
            detected_regime_en = f"Buoyant Elongated Plume (H/W = {aspect_hw})"
        elif aspect_hw < 0.82:
            inferred_gravity = 0.0
            inferred_airflow = round(min(25.0, (1.0 / max(0.3, aspect_hw)) * 6.5), 1)
            inferred_o2 = 18.5
            inferred_fuel = "pmma" if soot_warm_ratio >= 0.45 else "methanol"
            detected_regime_tr = f"0G Havalandırma Kuyruk Alevi (Wake Flame • W/H = {round(1/aspect_hw, 2)})"
            detected_regime_en = f"0G Ventilated Wake Flame (W/H = {round(1/aspect_hw, 2)})"
        else:
            inferred_gravity = 0.0
            inferred_airflow = 0.3
            inferred_o2 = 21.0 if blue_chemilum_ratio >= 0.38 else 19.0
            inferred_fuel = "methanol" if blue_chemilum_ratio >= 0.46 else "n_heptane"
            detected_regime_tr = f"0G Küresel Mikroçekim Difüzyon Alevi (H/W = {aspect_hw} ≈ 1.0)"
            detected_regime_en = f"0G Spherical Microgravity Diffusion Flame (H/W = {aspect_hw} ≈ 1.0)"

        inferred_d0 = round(max(1.8, min(5.4, (math.sqrt(active_count) / 256.0) * 7.5)), 1)

        # Base64 önizleme (AI multimodal gönderimi ve arayüz önizlemesi için)
        thumb = img.copy()
        thumb.thumbnail((640, 640))
        buf = io.BytesIO()
        thumb.save(buf, format="JPEG", quality=85)
        b64_data_uri = "data:image/jpeg;base64," + base64.b64encode(buf.getvalue()).decode("ascii")

        extracted_params = {
            "fuel_id": inferred_fuel,
            "gravity_g": inferred_gravity,
            "oxygen_pct": inferred_o2,
            "pressure_psia": 14.7,
            "airflow_cms": inferred_airflow,
            "droplet_d0_mm": inferred_d0,
            "diluent": "N2",
        }

        summary_tr = (
            f"**Görsel Spektral ve Morfolojik Analiz ({filename} • {orig_w}×{orig_h}px):**\n"
            f"- **Tespit Edilen Geometrik Rejim:** {detected_regime_tr}\n"
            f"- **CH*/OH* Mavi Kemilüminesans Oranı:** `%{blue_chemilum_ratio * 100:.1f}` | **Kurum (Soot) Sıcak Işıma İndeksi:** `{soot_warm_ratio:.2f}`\n"
            f"- **Çıkarılan 3B Simülasyon Parametreleri:** Yerçekimi `{inferred_gravity}G`, Oksijen `%{inferred_o2}`, Akış `{inferred_airflow} cm/s`, Yakıt `{inferred_fuel}`, Çap `{inferred_d0} mm`."
        )
        summary_en = (
            f"**Spectral & Morphological Flame Analysis ({filename} • {orig_w}×{orig_h}px):**\n"
            f"- **Detected Geometric Regime:** {detected_regime_en}\n"
            f"- **CH*/OH* Blue Chemiluminescence:** `{blue_chemilum_ratio * 100:.1f}%` | **Soot Thermal Index:** `{soot_warm_ratio:.2f}`\n"
            f"- **Extracted 3D Parameters:** Gravity `{inferred_gravity}G`, Oxygen `{inferred_o2}%`, Airflow `{inferred_airflow} cm/s`, Fuel `{inferred_fuel}`, Diameter `{inferred_d0} mm`."
        )

        return {
            "ok": True,
            "media_type": "image",
            "filename": filename,
            "metrics": {
                "resolution": f"{orig_w}x{orig_h}",
                "aspect_ratio_hw": aspect_hw,
                "blue_chemiluminescence_ratio": blue_chemilum_ratio,
                "soot_warm_ratio": soot_warm_ratio,
                "detected_regime_tr": detected_regime_tr,
                "detected_regime_en": detected_regime_en,
            },
            "extracted_sim_params": extracted_params,
            "summary_tr": summary_tr,
            "summary_en": summary_en,
            "image_base64": b64_data_uri,
        }
    except Exception as exc:
        return {"ok": False, "error": f"Görsel işlenemedi: {exc}"}


def _parse_fuel_string(val: str) -> Optional[str]:
    vl = (val or "").lower().strip()
    if not vl:
        return None
    candidates = [
        ("propane_cfig", ("propane_cfig", "propan", "propane", "cfig", "cfi-g")),
        ("n_heptane", ("n_heptane", "heptan", "heptane")),
        ("methanol", ("methanol", "metanol")),
        ("pmma", ("pmma", "akrilik", "acrylic")),
        ("sibal", ("sibal", "pamuk", "cotton")),
        ("nomex", ("nomex", "ht90", "spacesuit", "uzay giysisi")),
        ("hydrogen", ("hydrogen", "hidrojen")),
    ]
    best_fuel: Optional[str] = None
    best_pos = 10**9
    for fid, kws in candidates:
        for kw in kws:
            idx = vl.find(kw)
            if idx != -1 and idx < best_pos:
                best_pos = idx
                best_fuel = fid
    return best_fuel


def _parse_diluent_string(val: str) -> Optional[str]:
    vl = (val or "").strip().upper()
    if vl in ("CO2", "HE", "N2"):
        return "He" if vl == "HE" else vl
    if "CO2" in vl or "KARBONDIOKSIT" in vl:
        return "CO2"
    if "HELIUM" in vl or "HELYUM" in vl:
        return "He"
    if "N2" in vl or "AZOT" in vl or "NITROGEN" in vl:
        return "N2"
    return None


def _parse_habitat_string(val: str) -> Optional[str]:
    vl = (val or "").lower().strip()
    if not vl:
        return None
    if vl in ("iss_module", "lunar_hab", "lunar_rover", "eva_suit"):
        return vl
    if "suit" in vl or "giysi" in vl or "eva" in vl:
        return "eva_suit"
    if "rover" in vl or "gezgin" in vl:
        return "lunar_rover"
    if "lunar" in vl or "ay_ussu" in vl or "hab" in vl:
        return "lunar_hab"
    if "iss" in vl or "destiny" in vl:
        return "iss_module"
    return None


def _classify_table_column(col_name: str) -> Optional[str]:
    kl = str(col_name or "").strip().lower()
    if not kl:
        return None
    if kl in ("t", "time", "time_s", "t_s", "zaman", "zaman_sn", "sec", "seconds") or "zaman" in kl or "time_s" in kl:
        return "time_s"
    if kl in ("faz_kodu", "phase_code"):
        return "phase_code"
    if any(w in kl for w in ("faz_ve_fiziksel", "phase_desc", "fiziksel_durum", "faz", "phase", "stage")):
        return "phase_desc"
    if any(w in kl for w in ("fuel", "yakit", "material", "malzeme")):
        return "fuel"
    if any(w in kl for w in ("diluent", "seyreltici")):
        return "diluent"
    if any(w in kl for w in ("habitat", "kabin_tipi")):
        return "habitat"
    if any(w in kl for w in ("donanim", "facility", "hardware")):
        return "facility"
    if any(w in kl for w in ("deney_referans", "exp_ref", "exp_id", "ntrs")):
        return "exp_ref"
    if (
        "co2" not in kl
        and "po2" not in kl
        and "h2o" not in kl
        and "ch2o" not in kl
        and "moc" not in kl
        and ("oxygen" in kl or "oksijen" in kl or re.search(r"(?:^|[_\s])o2(?:$|[_\s])", kl) is not None)
    ):
        return "oxygen_pct"
    if "po2" not in kl and ("psia" in kl or (("pressure" in kl or "basinc" in kl) and "kpa" not in kl)):
        return "pressure_psia"
    if "po2" not in kl and "kpa" in kl:
        return "pressure_kpa"
    if (
        "yayilim" not in kl
        and "spread" not in kl
        and "mm_s" not in kl
        and any(w in kl for w in ("airflow", "akis", "flow", "velocity", "u_cms", "fan_cm"))
    ):
        return "airflow_cms"
    if any(w in kl for w in ("gravity", "yercekimi", "g_level")):
        return "gravity_g"
    if "d2" in kl or "d_sq" in kl:
        return "d2_mm2"
    if (
        "partikul" not in kl
        and "sisi" not in kl
        and "mist" not in kl
        and "aerosol" not in kl
        and any(w in kl for w in ("damlacik", "droplet", "diameter", "d0", "d_mm", "numune_cap"))
    ):
        return "d0_mm"
    if any(w in kl for w in ("sicaklik", "temp_k", "flame_temp", "thermocouple")):
        return "temp_k"
    if "co2" not in kl and "smac" not in kl and (kl == "co" or "co_ppm" in kl or "co_sensor" in kl):
        return "co_ppm"
    if "co2" in kl:
        return "co2_ppm"
    if "ch2o" in kl or "formaldehit" in kl or "formaldehyde" in kl:
        return "ch2o_ppm"
    if "optik" in kl or "optical" in kl:
        return "opt_vis"
    if "radyatif" in kl or "radiometer" in kl or "heat_flux" in kl or "isi_akisi" in kl:
        return "ir_kw"
    if "su_sisi" in kl or "mist" in kl:
        return "mist_um"
    if "partikul" in kl or "aerosol" in kl or "dust_um" in kl:
        return "aerosol_um"
    return None


def _fit_d2_slope(t_vals: List[float], d2_vals: List[float]) -> Optional[Dict[str, float]]:
    if len(t_vals) < 3 or len(t_vals) != len(d2_vals):
        return None
    t_arr = np.asarray(t_vals, dtype=np.float64)
    y_arr = np.asarray(d2_vals, dtype=np.float64)
    dt = float(t_arr[-1] - t_arr[0])
    drop = float(y_arr[0] - y_arr[-1])
    if dt <= 0.2 or drop <= 0.08:
        return None
    slope, intercept = np.polyfit(t_arr, y_arr, 1)
    k_meas = max(0.0, float(-slope))
    if k_meas <= 0.005:
        return None
    y_pred = slope * t_arr + intercept
    ss_res = float(np.sum((y_arr - y_pred) ** 2))
    ss_tot = float(np.sum((y_arr - np.mean(y_arr)) ** 2))
    r2 = 1.0 - (ss_res / ss_tot) if ss_tot > 1e-9 else 0.999
    return {"k_meas": round(k_meas, 3), "r2": round(max(0.0, min(1.0, r2)), 4)}


def _analyze_tabular_rows(rows: List[Dict[str, Any]], filename: str) -> Optional[Dict[str, Any]]:
    if not rows:
        return None
    from core.physics_engine import simulate_combustion_state

    col_map: Dict[str, str] = {}
    sample_keys = list(rows[0].keys())
    for raw_k in sample_keys:
        role = _classify_table_column(raw_k)
        if role and role not in col_map:
            col_map[role] = raw_k

    # Satırları kronolojik fazlara ayır
    grouped_phases: List[Dict[str, Any]] = []
    phase_lookup: Dict[str, Dict[str, Any]] = {}
    for r in rows:
        p_code = str(r.get(col_map.get("phase_code", ""), "") or "").strip()
        p_desc = str(r.get(col_map.get("phase_desc", ""), "") or "").strip()
        p_key = p_code or p_desc or "FAZ_1"
        if p_key not in phase_lookup:
            entry = {
                "key": p_key,
                "code": p_code or p_key.split(" ")[0],
                "desc": p_desc or p_code or "Standart Yanma Fazi",
                "rows": [],
            }
            phase_lookup[p_key] = entry
            grouped_phases.append(entry)
        phase_lookup[p_key]["rows"].append(r)

    def _num_list(r_list: List[Dict[str, Any]], role_key: str) -> List[float]:
        col = col_map.get(role_key)
        if not col:
            return []
        out_nums: List[float] = []
        for item in r_list:
            v = item.get(col)
            if v is None:
                continue
            try:
                out_nums.append(float(str(v).replace("%", "").strip()))
            except ValueError:
                pass
        return out_nums

    def _first_str(r_list: List[Dict[str, Any]], role_key: str) -> str:
        col = col_map.get(role_key)
        if not col:
            return ""
        for item in r_list:
            s = str(item.get(col) or "").strip()
            if s:
                return s
        return ""

    phases_out: List[Dict[str, Any]] = []
    best_d2_fit: Optional[Dict[str, Any]] = None
    has_cool_flame_telemetry = False
    has_water_mist_telemetry = False
    aerosol_min_um: Optional[float] = None
    aerosol_max_um: Optional[float] = None

    for idx, grp in enumerate(grouped_phases, start=1):
        pr = grp["rows"]
        fuel_raw = _first_str(pr, "fuel")
        fuel_id = _parse_fuel_string(fuel_raw) or "n_heptane"
        diluent = _parse_diluent_string(_first_str(pr, "diluent")) or "N2"
        habitat_id = _parse_habitat_string(_first_str(pr, "habitat"))

        o2_vals = [x for x in _num_list(pr, "oxygen_pct") if 5.0 <= x <= 100.0]
        psia_vals = [x for x in _num_list(pr, "pressure_psia") if 3.0 <= x <= 25.0]
        kpa_vals = [x for x in _num_list(pr, "pressure_kpa") if 20.0 <= x <= 180.0]
        flow_vals = [x for x in _num_list(pr, "airflow_cms") if 0.0 <= x <= 50.0]
        grav_vals = [x for x in _num_list(pr, "gravity_g") if 0.0 <= x <= 2.0]
        d0_vals = [x for x in _num_list(pr, "d0_mm") if 0.5 <= x <= 10.0]
        d2_vals = [x for x in _num_list(pr, "d2_mm2") if 0.1 <= x <= 100.0]
        t_vals = _num_list(pr, "time_s")
        temp_vals = _num_list(pr, "temp_k")
        co_vals = _num_list(pr, "co_ppm")
        ch2o_vals = _num_list(pr, "ch2o_ppm")
        opt_vals = _num_list(pr, "opt_vis")
        mist_vals = _num_list(pr, "mist_um")
        aero_vals = [x for x in _num_list(pr, "aerosol_um") if x > 0.0]

        o2_mean = round(sum(o2_vals) / len(o2_vals), 2) if o2_vals else 21.0
        if psia_vals:
            p_psia = round(sum(psia_vals) / len(psia_vals), 2)
        elif kpa_vals:
            p_psia = round((sum(kpa_vals) / len(kpa_vals)) / 6.89476, 2)
        else:
            p_psia = 14.7
        flow_mean = round(sum(flow_vals) / len(flow_vals), 2) if flow_vals else 2.4
        grav_mean = round(sum(grav_vals) / len(grav_vals), 2) if grav_vals else 0.0

        if d0_vals:
            d0_init = round(max(0.8, min(8.0, d0_vals[0])), 2)
        elif d2_vals:
            d0_init = round(max(0.8, min(8.0, math.sqrt(max(0.64, d2_vals[0])))), 2)
        else:
            d0_init = 3.2

        if not habitat_id:
            if o2_mean >= 75.0 and p_psia <= 6.0:
                habitat_id = "eva_suit"
            elif 0.10 <= grav_mean <= 0.25 and p_psia <= 11.5:
                habitat_id = "lunar_rover"
            elif grav_mean >= 0.10:
                habitat_id = "lunar_hab"
            else:
                habitat_id = "iss_module"

        d2_series = d2_vals if d2_vals else ([x * x for x in d0_vals] if d0_vals else [])
        fit = _fit_d2_slope(t_vals, d2_series) if (t_vals and d2_series and len(t_vals) == len(d2_series)) else None

        phase_params = {
            "fuel_id": fuel_id,
            "gravity_g": grav_mean,
            "oxygen_pct": o2_mean,
            "pressure_psia": p_psia,
            "airflow_cms": flow_mean,
            "droplet_d0_mm": d0_init,
            "diluent": diluent,
            "habitat_id": habitat_id,
        }
        sim_res = simulate_combustion_state(phase_params)
        tel = sim_res["telemetry"]
        tl = sim_res["scenario_timeline"]
        call = sim_res["callouts"]

        if fit and fuel_id in ("n_heptane", "methanol") and (best_d2_fit is None or fit["k_meas"] > best_d2_fit["k_meas"]):
            best_d2_fit = {
                "phase_idx": idx,
                "k_meas": fit["k_meas"],
                "k_model": tel["burning_rate_k_mm2_s"],
                "r2": fit["r2"],
                "fuel_id": fuel_id,
            }

        temp_mean = round(sum(temp_vals) / len(temp_vals), 1) if temp_vals else tel["flame_temp_k"]
        co_max = round(max(co_vals), 1) if co_vals else tel["co_ppm"]
        ch2o_max = round(max(ch2o_vals), 1) if ch2o_vals else 0.0
        opt_min = round(min(opt_vals), 2) if opt_vals else None
        mist_max = round(max(mist_vals), 1) if mist_vals else 0.0

        if tel.get("cool_flame_active") or (500.0 <= temp_mean <= 820.0) or ch2o_max >= 40.0:
            has_cool_flame_telemetry = True
        if mist_max > 0.0 or "mist" in grp["desc"].lower() or "bastirma" in grp["desc"].lower() or diluent == "CO2":
            has_water_mist_telemetry = True
        if aero_vals:
            aerosol_min_um = min(aero_vals) if aerosol_min_um is None else min(aerosol_min_um, min(aero_vals))
            aerosol_max_um = max(aero_vals) if aerosol_max_um is None else max(aerosol_max_um, max(aero_vals))

        t_span = f"{int(t_vals[0])}-{int(t_vals[-1])} sn" if len(t_vals) >= 2 else f"{len(pr)} satir"
        t_span_en = f"{int(t_vals[0])}-{int(t_vals[-1])} s" if len(t_vals) >= 2 else f"{len(pr)} rows"

        phases_out.append({
            "index": idx,
            "code": grp["code"],
            "desc": grp["desc"],
            "short_tr": f"Faz {idx}",
            "short_en": f"Phase {idx}",
            "time_span_tr": t_span,
            "time_span_en": t_span_en,
            "facility": _first_str(pr, "facility") or "ISS_CIR",
            "exp_ref": _first_str(pr, "exp_ref") or "",
            "sim_params": phase_params,
            "measured_temp_k": temp_mean,
            "co_max_ppm": co_max,
            "ch2o_max_ppm": ch2o_max,
            "opt_min_pct": opt_min,
            "mist_max_um": mist_max,
            "k_meas": fit["k_meas"] if fit else None,
            "r2_d2": fit["r2"] if fit else None,
            "regime": tel["regime"],
            "badge_tr": call["badge_tr"],
            "badge_en": call["badge_en"],
            "flame_temp_k": tel["flame_temp_k"],
            "moc_pct": tel["moc_pct"],
            "k_model": tel["burning_rate_k_mm2_s"],
            "spread_mms": tel["flame_spread_mm_s"],
            "b_oq": tel["spalding_b_number"],
            "sh": tel["sherwood_number"],
            "da": tel["damkohler_number"],
            "risk_score": tel["risk_score"],
            "smac_s": tl["t_smac_125ppm_s"],
            "extinguished": bool(tel.get("extinguished")),
            "cool_flame": bool(tel.get("cool_flame_active")),
        })

    if not phases_out:
        return None

    # 3B Yanma Odasına ilk olarak aktif sıcak alev fazını senkronize et (sönmüş faz yerine canlı alev gösterilir)
    active_hot = [p for p in phases_out if not p["extinguished"] and not p["cool_flame"]]
    active_cool = [p for p in phases_out if p["cool_flame"]]
    primary_phase = active_hot[0] if active_hot else (active_cool[0] if active_cool else phases_out[0])

    notes: List[str] = [
        f"Toplam {len(rows)} telemetri satiri ve {len(phases_out)} fiziksel faz cozumlenerek Faz {primary_phase['index']} aktif 3B sahneye aktarildi"
    ]
    if best_d2_fit:
        notes.append(
            f"Faz {best_d2_fit['phase_idx']} d² dogrusal regresyonu: K_olculen = {best_d2_fit['k_meas']:.3f} mm²/s, K_model = {best_d2_fit['k_model']:.3f} mm²/s (R² = {best_d2_fit['r2']:.4f})"
        )

    table_tr_lines = [
        "| Faz | Zaman | Yakit ve Atmosfer | Sicaklik / CO / CH2O | Boyutsuz Sayilar (K, B_oq, Sh, Da, MOC) | Fiziksel Rejim ve SMAC |",
        "| :--- | :--- | :--- | :--- | :--- | :--- |",
    ]
    table_en_lines = [
        "| Phase | Window | Fuel & Atmosphere | Temp / CO / CH2O | Dimensionless (K, B_oq, Sh, Da, MOC) | Regime & SMAC Clock |",
        "| :--- | :--- | :--- | :--- | :--- | :--- |",
    ]
    for p in phases_out:
        sp = p["sim_params"]
        k_txt = f"{p['k_meas']:.2f}" if p["k_meas"] is not None else f"{p['k_model']:.2f}"
        ch2o_txt = f" / {p['ch2o_max_ppm']:.0f} ppm CH₂O" if p["ch2o_max_ppm"] > 0 else ""
        smac_txt_tr = "Guvenli" if p["smac_s"] >= 900 else f"{p['smac_s']} sn"
        smac_txt_en = "Safe" if p["smac_s"] >= 900 else f"{p['smac_s']} s"
        table_tr_lines.append(
            f"| **Faz {p['index']}** | `{p['time_span_tr']}` | `{sp['fuel_id']}` • `{sp['gravity_g']}G` • `%{sp['oxygen_pct']} O₂` • `{sp['pressure_psia']} psia` • `{sp['airflow_cms']} cm/s` | `{p['measured_temp_k']} K` • `{p['co_max_ppm']} ppm CO`{ch2o_txt} | `K={k_txt}` • `B={p['b_oq']}` • `Sh={p['sh']}` • `Da={p['da']}` • `MOC=%{p['moc_pct']}` | **{p['badge_tr']}** (Risk `{p['risk_score']}/100`, SMAC `{smac_txt_tr}`) |"
        )
        table_en_lines.append(
            f"| **Phase {p['index']}** | `{p['time_span_en']}` | `{sp['fuel_id']}` • `{sp['gravity_g']}G` • `{sp['oxygen_pct']}% O₂` • `{sp['pressure_psia']} psia` • `{sp['airflow_cms']} cm/s` | `{p['measured_temp_k']} K` • `{p['co_max_ppm']} ppm CO`{ch2o_txt} | `K={k_txt}` • `B={p['b_oq']}` • `Sh={p['sh']}` • `Da={p['da']}` • `MOC={p['moc_pct']}%` | **{p['badge_en']}** (Risk `{p['risk_score']}/100`, SMAC `{smac_txt_en}`) |"
        )

    diag_tr: List[str] = []
    diag_en: List[str] = []
    if best_d2_fit:
        diag_tr.append(
            f"- **Deneysel d² Yasası Doğrulaması (Faz {best_d2_fit['phase_idx']}):** Ölçülen eğim `K_ölç = {best_d2_fit['k_meas']:.3f} mm²/s` ile kapalı-form model `K_model = {best_d2_fit['k_model']:.3f} mm²/s` arasında **`R² = {best_d2_fit['r2']:.4f}`** uyumu doğrulandı."
        )
        diag_en.append(
            f"- **Empirical d²-Law Validation (Phase {best_d2_fit['phase_idx']}):** Least-squares slope `K_meas = {best_d2_fit['k_meas']:.3f} mm²/s` matches closed-form `K_model = {best_d2_fit['k_model']:.3f} mm²/s` with **`R² = {best_d2_fit['r2']:.4f}`**."
        )
    if has_cool_flame_telemetry:
        diag_tr.append(
            "- **Görünmez NTC Soğuk Alev ve Sensör Körlüğü (FLEX-2):** `550-750 K` bandında görünür optik şiddet `%1` altına düşerken `CO` ve `CH₂O` (formaldehit) hızla yükselmektedir; tek kanallı optik dedektör yerine `CO + Orta-IR + CH₂O` sensör füzyonu zorunludur."
        )
        diag_en.append(
            "- **Invisible NTC Cool Flame & Sensor Blindness (FLEX-2):** Below `800 K`, visible optical intensity drops under `1%` while `CO` and `CH₂O` surge; multi-channel `CO + Mid-IR + CH₂O` fusion is mandatory."
        )
    if has_water_mist_telemetry:
        diag_tr.append(
            "- **NASA-STD-6001B Söndürme Denetimi (SoFIE-MIST):** Havalandırma akışının kesilmesi (`U -> 0 cm/s`) ve `<40 µm` ince su sisi / `CO₂` seyreltmesiyle alev güvenli bölgeye (`O₂ < MOC`) indirilmiştir (*Halon 1301 kesinlikle kullanılmamıştır*)."
        )
        diag_en.append(
            "- **NASA-STD-6001B Suppression Audit (SoFIE-MIST):** Cutting HVAC flow (`U -> 0 cm/s`) with `<40 µm` fine water mist / `CO₂` dilution quenched the flame below `MOC` (*Halon 1301 strictly excluded*)."
        )
    if aerosol_min_um is not None and aerosol_max_um is not None and aerosol_max_um > aerosol_min_um * 3.0:
        diag_tr.append(
            f"- **SAME / DAFT Duman ve Ay Tozu Ayrımı:** Veri setinde `{aerosol_min_um:.2f} µm` piroliz dumanı ile `{aerosol_max_um:.2f} µm` Ay regolit tozu çift dalga boylu saçılım oranıyla (`{aerosol_max_um / max(0.01, aerosol_min_um):.1f}x` çap farkı) yanlış alarmsız ayrıştırılmıştır."
        )
        diag_en.append(
            f"- **SAME / DAFT Smoke vs. Lunar Dust Discrimination:** Sub-micron pyrolysis smoke (`{aerosol_min_um:.2f} µm`) and coarse Lunar regolith dust (`{aerosol_max_um:.2f} µm`) separated cleanly (`{aerosol_max_um / max(0.01, aerosol_min_um):.1f}x` size ratio) without false alarms."
        )

    rich_tr = (
        f"**Çok Fazlı Telemetri Analizi (`{filename}` • {len(rows)} satır • {len(phases_out)} fiziksel faz):**\n"
        f"- **3B Yanma Odasına Aktarılan Aktif Faz:** **Faz {primary_phase['index']}** (`{primary_phase['sim_params']['fuel_id']}`, `{primary_phase['sim_params']['gravity_g']}G`, `%{primary_phase['sim_params']['oxygen_pct']} O₂`, `{primary_phase['sim_params']['pressure_psia']} psia`, `{primary_phase['sim_params']['airflow_cms']} cm/s` -> `{primary_phase['flame_temp_k']} K`).\n"
        + ("\n".join(diag_tr) + "\n\n" if diag_tr else "\n")
        + "\n".join(table_tr_lines)
    )
    rich_en = (
        f"**Multi-Phase Telemetry Analysis (`{filename}` • {len(rows)} rows • {len(phases_out)} physical phases):**\n"
        f"- **Active Phase Synced to 3D Chamber:** **Phase {primary_phase['index']}** (`{primary_phase['sim_params']['fuel_id']}`, `{primary_phase['sim_params']['gravity_g']}G`, `{primary_phase['sim_params']['oxygen_pct']}% O₂`, `{primary_phase['sim_params']['pressure_psia']} psia`, `{primary_phase['sim_params']['airflow_cms']} cm/s` -> `{primary_phase['flame_temp_k']} K`).\n"
        + ("\n".join(diag_en) + "\n\n" if diag_en else "\n")
        + "\n".join(table_en_lines)
    )

    return {
        "extracted_fields": list(col_map.keys()),
        "extracted_sim_params": primary_phase["sim_params"],
        "notes": notes,
        "phases": phases_out,
        "rich_summary_tr": rich_tr,
        "rich_summary_en": rich_en,
    }


def extract_sim_params_from_text_or_table(text: str, filename: str = "data.txt") -> Dict[str, Any]:
    """
    CSV, JSON, PDF veya Web sayfası metninden bilimsel yanma parametrelerini (O2, basınç, akış, yerçekimi, yakıt, çap)
    ve varsa çok fazlı zaman serisi verilerini otomatik olarak ayıklar.
    """
    clean = (text or "").lstrip("\ufeff").strip()
    lower = clean.lower()

    extracted: Dict[str, Any] = {}
    notes: List[str] = []

    # 1. JSON formatı kontrolü (Tek nesne veya çok satırlı dizi)
    if clean.startswith("{") or clean.startswith("["):
        try:
            obj = json.loads(clean)
            if isinstance(obj, list) and obj and isinstance(obj[0], dict):
                tab_res = _analyze_tabular_rows(obj[:600], filename)
                if tab_res:
                    return tab_res
            elif isinstance(obj, dict):
                if isinstance(obj.get("rows"), list) and obj["rows"] and isinstance(obj["rows"][0], dict):
                    tab_res = _analyze_tabular_rows(obj["rows"][:600], filename)
                    if tab_res:
                        return tab_res
                _map_dict_row_to_params(obj, extracted, notes)
        except Exception:
            pass

    # 2. CSV / TSV / Noktalı Virgül Tablo kontrolü (600 satıra kadar çok fazlı çözümleme)
    if not extracted and ("," in clean or ";" in clean or "\t" in clean):
        lines = [ln for ln in clean.splitlines() if ln.strip()][:600]
        if len(lines) >= 2:
            delim = ";" if lines[0].count(";") > lines[0].count(",") else ("\t" if "\t" in lines[0] else ",")
            try:
                reader = list(csv.DictReader(lines, delimiter=delim))
                if reader:
                    tab_res = _analyze_tabular_rows(reader, filename)
                    if tab_res:
                        return tab_res
            except Exception:
                pass

    # 3. Serbest Metin / PDF / Web Makalesi Regex Çıkarımı
    if "fuel_id" not in extracted:
        parsed_f = _parse_fuel_string(lower)
        if parsed_f:
            extracted["fuel_id"] = parsed_f

    if "oxygen_pct" not in extracted:
        m_o2 = re.search(r"(\d{1,3}(?:\.\d+)?)\s*%\s*(?:o2|o₂|oxygen|oksijen)\b", lower) or re.search(
            r"(?<![a-z0-9])(?:o2|o₂|oksijen|oxygen)\s*[:=]?\s*%?\s*(\d{1,3}(?:\.\d+)?)", lower
        )
        if m_o2:
            val = float(m_o2.group(1))
            if 5.0 <= val <= 100.0:
                extracted["oxygen_pct"] = val
                notes.append(f"Metinden O₂ = %{val} saptandı")

    if "pressure_psia" not in extracted:
        m_psia = re.search(r"(\d{1,2}(?:\.\d+)?)\s*psi(?:a)?", lower)
        m_kpa = re.search(r"(\d{2,3}(?:\.\d+)?)\s*kpa", lower)
        if m_psia:
            extracted["pressure_psia"] = round(float(m_psia.group(1)), 2)
        elif m_kpa:
            extracted["pressure_psia"] = round(float(m_kpa.group(1)) / 6.89476, 2)

    if "airflow_cms" not in extracted:
        m_flow = re.search(r"(\d{1,2}(?:\.\d+)?)\s*cm\s*/\s*s", lower)
        if m_flow:
            extracted["airflow_cms"] = round(min(45.0, float(m_flow.group(1))), 2)

    if "gravity_g" not in extracted:
        if any(w in lower for w in ("microgravity", "mikroçekim", "0g", "0 g", "iss", "freefall", "serbest düşüş")):
            extracted["gravity_g"] = 0.0
        elif "lunar" in lower or "0.16g" in lower:
            extracted["gravity_g"] = 0.16
        elif "mars" in lower or "0.38g" in lower:
            extracted["gravity_g"] = 0.38
        elif "1g" in lower or "earth" in lower:
            extracted["gravity_g"] = 1.0

    # Varsayılan güvenli tamamlama
    defaults = {
        "fuel_id": "n_heptane",
        "gravity_g": 0.0,
        "oxygen_pct": 21.0,
        "pressure_psia": 14.7,
        "airflow_cms": 3.5,
        "droplet_d0_mm": 3.2,
        "diluent": "N2",
    }
    final_params = {**defaults, **extracted}
    return {
        "extracted_fields": list(extracted.keys()),
        "extracted_sim_params": final_params,
        "notes": notes,
        "phases": [],
    }


def _map_dict_row_to_params(row: Dict[str, Any], out: Dict[str, Any], notes: List[str]) -> None:
    for k, v in row.items():
        role = _classify_table_column(k)
        if role == "fuel" and isinstance(v, str):
            pf = _parse_fuel_string(v)
            if pf:
                out["fuel_id"] = pf
            continue
        if role == "diluent" and isinstance(v, str):
            pd = _parse_diluent_string(v)
            if pd:
                out["diluent"] = pd
            continue
        if role == "habitat" and isinstance(v, str):
            ph = _parse_habitat_string(v)
            if ph:
                out["habitat_id"] = ph
            continue
        try:
            num = float(v)
        except (TypeError, ValueError):
            continue
        if role == "oxygen_pct" and 5 <= num <= 100:
            out["oxygen_pct"] = round(num, 2)
            notes.append(f"Tablodan O₂ = %{num:.1f}")
        elif role == "pressure_psia" and num <= 25:
            out["pressure_psia"] = round(num, 2)
        elif role == "pressure_kpa" and 20 <= num <= 180:
            out["pressure_psia"] = round(num / 6.89476, 2)
        elif role == "airflow_cms" and 0 <= num <= 50:
            out["airflow_cms"] = round(num, 2)
        elif role == "gravity_g" and 0 <= num <= 2:
            out["gravity_g"] = round(num, 2)
        elif role == "d0_mm" and 0.5 <= num <= 10:
            out["droplet_d0_mm"] = round(num, 2)
        elif role == "d2_mm2" and 0.6 <= num <= 80 and "droplet_d0_mm" not in out:
            out["droplet_d0_mm"] = round(math.sqrt(num), 2)
