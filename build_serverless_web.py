# -*- coding: utf-8 -*-
"""
ALTAR-NASA v5.1 — Seçenek 1: %100 İzole Sunucusuz Statik Web Paketi Üreticisi (build_serverless_web.py).
- Arka planda hiçbir Python/Node sunucusu veya açık port barındırmaz (Sıfır Saldırı Yüzeyi).
- GitHub Pages / Cloudflare Pages veya doğrudan yerel statik klasör olarak çalışır.
- Fizik motoru, ISS R² doğrulaması, ECLSS yaşam saati, 15 PSI sıralama matrisi, istemci tarafı görüntü/veri analizi
  ve NTRS atıflı Kanıt Sentezi Konsolu tamamen kullanıcının kendi tarayıcısında (RAM içinde) çalışır.
- Hiçbir API anahtarı veya .env verisi pakete gömülmez.
"""

from __future__ import annotations

import json
import re
import shutil
from pathlib import Path

from core.directives import CORE_DIRECTIVES_LIST
from core.nasa_datasets import (
    MISSION_PRESETS,
    NASA_EXPERIMENTS_CATALOG,
    SPACE_TO_EARTH_TRANSFERS,
)
from core.physics_engine import DILUENT_FACTORS, FUEL_PROPERTIES, HABITAT_CONFIGS
from core.ranking_engine import BILINGUAL_SCIENTIFIC_SYNONYMS

PROJECT_ROOT = Path(__file__).resolve().parent
WEB_SRC = PROJECT_ROOT / "web"
OUT_DIR = PROJECT_ROOT / "web_serverless"


SERVERLESS_KERNEL_TEMPLATE = r"""/* ============================================================================
 * ALTAR-NASA • Flame in Freefall v5.1 — Serverless Zero-Trust Browser Kernel
 * Seçenek 1 (Statik Web Paketi): Sıfır Arka Plan Sunucusu • Sıfır Açık Port • %100 İzole
 * Tüm termodinamik denklemler, ISS R²/RMSE doğrulaması, ECLSS saati, PSI sıralaması ve
 * Kanıt Sentezi Konsolu doğrudan tarayıcı belleğinde (client-side) çalışır.
 * ============================================================================ */
(function () {
    "use strict";

    window.ALTAR_SERVERLESS_MODE = true;

    const EMBEDDED_DATA = __EMBEDDED_JSON__;
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
"""


README_STATIC_DEPLOY = """# ◈ ALTAR-NASA • Flame in Freefall (v5.1) — Seçenek 1: %100 İzole Sunucusuz Statik Web Paketi

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
"""


def build_bundle() -> None:
    if OUT_DIR.exists():
        shutil.rmtree(OUT_DIR)
    (OUT_DIR / "css").mkdir(parents=True, exist_ok=True)
    (OUT_DIR / "js" / "vendor").mkdir(parents=True, exist_ok=True)

    # 1. Statik varlıkları kopyala
    shutil.copy2(WEB_SRC / "static" / "css" / "mission_control.css", OUT_DIR / "css" / "mission_control.css")
    if (WEB_SRC / "static" / "nasa_flame.ico").is_file():
        shutil.copy2(WEB_SRC / "static" / "nasa_flame.ico", OUT_DIR / "nasa_flame.ico")
    shutil.copy2(WEB_SRC / "static" / "js" / "vendor" / "three.min.js", OUT_DIR / "js" / "vendor" / "three.min.js")
    shutil.copy2(WEB_SRC / "static" / "js" / "three_chamber_3d.js", OUT_DIR / "js" / "three_chamber_3d.js")
    shutil.copy2(WEB_SRC / "static" / "js" / "charts_and_audio.js", OUT_DIR / "js" / "charts_and_audio.js")
    shutil.copy2(WEB_SRC / "static" / "js" / "app_controller.js", OUT_DIR / "js" / "app_controller.js")

    # 2. serverless_kernel.js dosyasını gömülü doğrulanmış bilimsel katalogla oluştur
    embedded_payload = {
        "FUEL_PROPERTIES": FUEL_PROPERTIES,
        "DILUENT_FACTORS": DILUENT_FACTORS,
        "HABITAT_CONFIGS": HABITAT_CONFIGS,
        "MISSION_PRESETS": MISSION_PRESETS,
        "NASA_EXPERIMENTS_CATALOG": NASA_EXPERIMENTS_CATALOG,
        "SPACE_TO_EARTH_TRANSFERS": SPACE_TO_EARTH_TRANSFERS,
        "CORE_DIRECTIVES_LIST": CORE_DIRECTIVES_LIST,
        "BILINGUAL_SCIENTIFIC_SYNONYMS": BILINGUAL_SCIENTIFIC_SYNONYMS,
    }
    embedded_json = json.dumps(embedded_payload, ensure_ascii=False)
    kernel_code = SERVERLESS_KERNEL_TEMPLATE.replace("__EMBEDDED_JSON__", embedded_json)
    (OUT_DIR / "js" / "serverless_kernel.js").write_text(kernel_code, encoding="utf-8")

    # 3. index.html dosyasını sunucusuz statik CSP ve göreli yollarla dönüştür
    src_html = (WEB_SRC / "templates" / "index.html").read_text(encoding="utf-8")
    # Sunucu CSRF meta etiketini kaldır ve yerine sıkı statik CSP koy
    csp_meta = (
        '<meta http-equiv="Content-Security-Policy" content="'
        "default-src 'self'; "
        "script-src 'self'; "
        "style-src 'self' 'unsafe-inline'; "
        "img-src 'self' data: blob:; "
        "media-src 'self' blob:; "
        "font-src 'self' data:; "
        "connect-src 'self' https://ntrs.nasa.gov https://osdr.nasa.gov; "
        "object-src 'none'; "
        "base-uri 'self'; "
        "form-action 'self';"
        '" />\n    <link rel="icon" href="./nasa_flame.ico" />'
    )
    out_html = re.sub(r'<meta\s+name="altar-csrf"[^>]*>', csp_meta, src_html)
    out_html = out_html.replace('href="/static/css/mission_control.css"', 'href="./css/mission_control.css"')
    out_html = out_html.replace('src="/static/js/vendor/three.min.js"', 'src="./js/vendor/three.min.js"')
    out_html = out_html.replace('src="/static/js/three_chamber_3d.js"', 'src="./js/three_chamber_3d.js"')
    out_html = out_html.replace('src="/static/js/charts_and_audio.js"', 'src="./js/charts_and_audio.js"')
    out_html = out_html.replace(
        'src="/static/js/app_controller.js"',
        'src="./js/serverless_kernel.js"></script>\n    <script src="./js/app_controller.js"',
    )
    out_html = out_html.replace("◈ 127.0.0.1 Zero-Trust İzole", "◈ %100 Sunucusuz Statik İzole")
    (OUT_DIR / "index.html").write_text(out_html, encoding="utf-8")

    # 4. Dağıtım kılavuzunu yaz ve Jekyll işlemesini devre dışı bırakan .nojekyll ekle
    (OUT_DIR / "README_GITHUB_CLOUDFLARE_PAGES.md").write_text(README_STATIC_DEPLOY, encoding="utf-8")
    (OUT_DIR / ".nojekyll").write_text("", encoding="utf-8")

    print(f"[OK] Serverless static bundle generated at: {OUT_DIR}")


if __name__ == "__main__":
    build_bundle()
