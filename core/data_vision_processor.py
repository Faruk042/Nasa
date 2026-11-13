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


def extract_sim_params_from_text_or_table(text: str, filename: str = "data.txt") -> Dict[str, Any]:
    """
    CSV, JSON, PDF veya Web sayfası metninden bilimsel yanma parametrelerini (O2, basınç, akış, yerçekimi, yakıt, çap)
    ve varsa zaman serisi verilerini otomatik olarak ayıklar.
    """
    clean = (text or "").strip()
    lower = clean.lower()

    extracted: Dict[str, Any] = {}
    notes: List[str] = []

    # 1. JSON formatı kontrolü
    if clean.startswith("{") or clean.startswith("["):
        try:
            obj = json.loads(clean)
            row = obj[0] if (isinstance(obj, list) and obj and isinstance(obj[0], dict)) else (obj if isinstance(obj, dict) else {})
            _map_dict_row_to_params(row, extracted, notes)
        except Exception:
            pass

    # 2. CSV / Tablo satırı kontrolü
    if not extracted and ("," in clean or ";" in clean or "\t" in clean):
        lines = [ln for ln in clean.splitlines() if ln.strip()][:80]
        if len(lines) >= 2:
            delim = ";" if lines[0].count(";") > lines[0].count(",") else ("\t" if "\t" in lines[0] else ",")
            try:
                reader = list(csv.DictReader(lines, delimiter=delim))
                if reader:
                    # Sayısal sütunların ortalamasını al
                    agg: Dict[str, List[float]] = {}
                    for r in reader:
                        for k, v in r.items():
                            if not k or v is None:
                                continue
                            try:
                                num = float(str(v).replace("%", "").strip())
                                agg.setdefault(k.strip().lower(), []).append(num)
                            except ValueError:
                                pass
                    mean_row = {k: sum(vals) / len(vals) for k, vals in agg.items() if vals}
                    _map_dict_row_to_params(mean_row, extracted, notes)
                    # Zaman ve D / D² sütunu varsa deneysel yanma sabiti K regresyonu!
                    t_vals = _find_col(agg, ("time", "t_s", "zaman", "sec"))
                    d_vals = _find_col(agg, ("diameter", "d_mm", "cap", "droplet"))
                    if t_vals and d_vals and len(t_vals) == len(d_vals) and len(t_vals) >= 3:
                        d2_arr = np.array(d_vals) ** 2
                        t_arr = np.array(t_vals)
                        dt = float(t_arr[-1] - t_arr[0])
                        if dt > 0.1:
                            k_meas = max(0.0, float(d2_arr[0] - d2_arr[-1]) / dt)
                            notes.append(f"Tablodan ölçülen deneysel D² eğimi K = {k_meas:.3f} mm²/s")
                            extracted["droplet_d0_mm"] = round(max(1.0, min(7.0, float(d_vals[0]))), 2)
            except Exception:
                pass

    # 3. Serbest Metin / PDF / Web Makalesi Regex Çıkarımı
    if "fuel_id" not in extracted:
        if "propane" in lower or "propan" in lower or "cfi-g" in lower or "cfig" in lower:
            extracted["fuel_id"] = "propane_cfig"
        elif "heptane" in lower or "heptan" in lower or "flex" in lower:
            extracted["fuel_id"] = "n_heptane"
        elif "methanol" in lower or "metanol" in lower:
            extracted["fuel_id"] = "methanol"
        elif "nomex" in lower or "spacesuit" in lower or "uzay giysisi" in lower:
            extracted["fuel_id"] = "nomex"
        elif "sibal" in lower or "cotton" in lower or "pamuk" in lower:
            extracted["fuel_id"] = "sibal"
        elif "pmma" in lower or "acrylic" in lower or "akrilik" in lower:
            extracted["fuel_id"] = "pmma"
        elif "hydrogen" in lower or "hidrojen" in lower:
            extracted["fuel_id"] = "hydrogen"

    if "oxygen_pct" not in extracted:
        m_o2 = re.search(r"(\d{1,3}(?:\.\d+)?)\s*%\s*(?:o2|o₂|oxygen|oksijen)", lower) or re.search(
            r"(?:o2|oksijen|oxygen)\s*[:=]?\s*%?\s*(\d{1,3}(?:\.\d+)?)", lower
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
    }


def _find_col(agg: Dict[str, List[float]], keys: tuple) -> Optional[List[float]]:
    for col_name, vals in agg.items():
        if any(k in col_name for k in keys):
            return vals
    return None


def _map_dict_row_to_params(row: Dict[str, Any], out: Dict[str, Any], notes: List[str]) -> None:
    for k, v in row.items():
        kl = str(k).lower().strip()
        if isinstance(v, str) and kl in ("fuel", "fuel_id", "yakit", "material", "malzeme"):
            vl = v.lower()
            if "propan" in vl or "cfig" in vl or "cfi-g" in vl:
                out["fuel_id"] = "propane_cfig"
                continue
            for fid in ("n_heptane", "methanol", "pmma", "sibal", "nomex", "hydrogen"):
                if fid.replace("n_", "") in vl:
                    out["fuel_id"] = fid
            continue
        try:
            num = float(v)
        except (TypeError, ValueError):
            continue
        if any(x in kl for x in ("oxygen", "o2", "oksijen")) and 5 <= num <= 100:
            out["oxygen_pct"] = round(num, 2)
            notes.append(f"Tablodan O₂ = %{num:.1f}")
        elif "psia" in kl or ("pressure" in kl and num <= 25) or ("basinc" in kl and num <= 25):
            out["pressure_psia"] = round(num, 2)
        elif "kpa" in kl and 24 <= num <= 160:
            out["pressure_psia"] = round(num / 6.89476, 2)
        elif any(x in kl for x in ("airflow", "flow", "velocity", "akis", "hiz")) and 0 <= num <= 50:
            out["airflow_cms"] = round(num, 2)
        elif any(x in kl for x in ("gravity", "yercekimi", "g_level")) and 0 <= num <= 2:
            out["gravity_g"] = round(num, 2)
        elif any(x in kl for x in ("droplet", "d0", "diameter", "cap")) and 0.5 <= num <= 10:
            out["droplet_d0_mm"] = round(num, 2)
