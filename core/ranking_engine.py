# -*- coding: utf-8 -*-
"""
ALTAR-NASA v4.0 SI Deney Sıralama (Ranking), Çapraz Dilli Semantik Vektör Arama (RAG),
Donanım Raf Filtresi (CIR/MDCA • MSG/SPICE • Cygnus • Kabin/DAFT) ve Karşılaştırma Motoru.
Gerçek TF-IDF + Karakter Dörtlüsü (4-gram) + TR<->EN Bilimsel Eş Anlamlı Genişletmeli
Kosinüs Benzerliği (NumPy) ve Fiziksel Parametre Yakınlık Puanlaması kullanır.
"""

from __future__ import annotations

import math
import re
from collections import Counter
from typing import Any, Dict, List, Optional

import numpy as np

from core.nasa_datasets import NASA_EXPERIMENTS_CATALOG
from core.physics_engine import simulate_combustion_state

# Türkçe <-> İngilizce Bilimsel Terim Köprüsü (Çapraz Dilli Semantik Eşleşme İçin)
BILINGUAL_SCIENTIFIC_SYNONYMS: Dict[str, str] = {
    "soğuk alev": "cool flame ntc low temperature radiative extinction heptane flex cfi cfi-g",
    "soguk alev": "cool flame ntc low temperature radiative extinction heptane flex cfi cfi-g",
    "serin alev": "cool flame cfi cfi-g ntc spherical burner propane heptane",
    "damlacık": "droplet spherical liquid heptane methanol decane flex cfi mdca",
    "damlacik": "droplet spherical liquid heptane methanol decane flex cfi mdca",
    "havalandırma": "ventilation airflow forced flow fan bass spice slise moc",
    "havalandirma": "ventilation airflow forced flow fan bass spice slise moc",
    "fan": "ventilation airflow low velocity opposed flow msg spice duct",
    "oksijen": "oxygen o2 moc concentration exploration atmosphere cfi-g",
    "uzay giysisi": "spacesuit eva 4.3 psia 100% o2 pure oxygen nomex pre-breathe",
    "gezgin": "pressurized rover lunar base 10.2 psia 30% o2 sofie saffire-v",
    "rover": "pressurized rover lunar base 10.2 psia 30% o2 sofie",
    "artemis": "exploration atmosphere 34% o2 8.2 psia 10.2 psia lunar habitat saffire-v sofie",
    "ay": "lunar exploration atmosphere 8.2 psia 10.2 psia 34% o2 luci fm2 daft",
    "mars": "martian exploration habitat low pressure partial gravity",
    "kısmi yerçekimi": "partial gravity lunar-g luci fm2 acme e-field ionic wind",
    "kismi yercekimi": "partial gravity lunar-g luci fm2 acme e-field ionic wind",
    "kumaş": "fabric textile sibal cotton fiberglass nomex bass-ii saffire",
    "kumas": "fabric textile sibal cotton fiberglass nomex bass-ii saffire",
    "akrilik": "pmma polymer solid acrylic bass sofie saffire-iv",
    "polimer": "pmma polymer solid fuel sofie bass bre",
    "su sisi": "water mist suppression pfe sofie-mist flex-2",
    "söndürme": "suppression extinguish quenching blowoff water mist",
    "sondurme": "suppression extinguish quenching blowoff water mist",
    "kurum": "soot radiation yellow shell acme spice smoke point",
    "duman noktası": "smoke point co-flow spice soot msg",
    "kalkış": "liftoff blowout triple flame slise msg",
    "elektrik": "electric field ionic wind e-field partial gravity acme",
    "büyük ölçek": "large scale cygnus spacecraft saffire",
    "duman": "smoke co carbon monoxide scrubber saffire-iv same daft",
    "toz": "dust aerosol measurement feasibility daft daft-2 same lunar dust smoke detector",
    "sensör": "sensor radiometer thermocouple optical uv laser co anomaly daft",
    "brülör": "burner porous spherical bre cfi-g acme spice",
}


def _expand_bilingual_text(text: str) -> str:
    lower = text.lower()
    extras: List[str] = []
    for tr_term, en_expansion in BILINGUAL_SCIENTIFIC_SYNONYMS.items():
        if tr_term in lower:
            extras.append(en_expansion)
    return f"{lower} {' '.join(extras)}"


def _tokenize_features(text: str) -> Counter:
    """Kelime ve 4-karakterli kök n-gram özniteliklerini çıkarır (hem TR eklerine hem EN terimlerine dayanıklıdır)."""
    expanded = _expand_bilingual_text(text)
    words = re.findall(r"[a-z0-9çğıöşü]{2,}", expanded)
    counts: Counter = Counter()
    for w in words:
        counts[f"w:{w}"] += 2.0
        if len(w) >= 4:
            for i in range(len(w) - 3):
                counts[f"g:{w[i:i+4]}"] += 0.5
    return counts


class SemanticKnowledgeIndex:
    """
    Hafif, hızlı ve %100 taşınabilir NumPy TF-IDF Kosinüs Benzerliği Vektör Hafızası.
    Hem yerleşik 15 NASA PSI deney kataloğunu hem de kullanıcının yüklediği PDF/NTRS belgelerini indeksler.
    """

    def __init__(self) -> None:
        self.documents: List[Dict[str, Any]] = []
        self.vocab: Dict[str, int] = {}
        self.idf: Optional[np.ndarray] = None
        self.matrix: Optional[np.ndarray] = None
        self._seed_catalog()

    def _seed_catalog(self) -> None:
        for exp in NASA_EXPERIMENTS_CATALOG:
            runs_txt = " ".join(
                f"{r.get('run_code', '')} {r.get('diff_tr', '')} {r.get('diff_en', '')} {r.get('result_tr', '')}"
                for r in exp.get("intra_runs", [])
            )
            combined = (
                f"{exp['exp_id']} {exp['program']} {exp.get('hardware_group', '')} {exp['facility']} "
                f"{exp['title']} {exp['title_tr']} {exp['material']} "
                f"{exp.get('sample_geometry_tr', '')} {exp.get('sample_geometry_en', '')} "
                f"{exp.get('sensors_tr', '')} {exp.get('sensors_en', '')} "
                f"{exp['key_finding_tr']} {exp['key_finding_en']} "
                f"{exp['safety_insight_tr']} {exp['safety_insight_en']} "
                f"{runs_txt} {' '.join(exp['tags'])}"
            )
            self.documents.append({
                "doc_id": exp["exp_id"],
                "doc_type": "nasa_experiment",
                "title": exp["title_tr"],
                "source": f"{exp['program']} • NTRS {exp['ntrs_id']}",
                "url": exp["ntrs_url"],
                "text": combined,
                "metadata": exp,
            })
        self._rebuild_matrix()

    def add_custom_document(self, title: str, content: str, source: str = "User Upload", url: str = "") -> int:
        """Yeni bir PDF/Web/NTRS belgesini parçalara (chunk) ayırarak semantik vektör indeksine ekler."""
        clean = (content or "").strip()
        if not clean:
            return 0
        chunk_size = 1200
        overlap = 150
        chunks: List[str] = []
        idx = 0
        while idx < len(clean) and len(chunks) < 40:
            chunks.append(clean[idx:idx + chunk_size])
            idx += (chunk_size - overlap)

        base_num = len(self.documents)
        for i, ch in enumerate(chunks, 1):
            self.documents.append({
                "doc_id": f"DOC-{base_num + i}",
                "doc_type": "ingested_doc",
                "title": f"{title} (Bölüm {i}/{len(chunks)})",
                "source": source,
                "url": url,
                "text": f"{title}\n{ch}",
                "metadata": {"snippet": ch[:450]},
            })
        self._rebuild_matrix()
        return len(chunks)

    def _rebuild_matrix(self) -> None:
        if not self.documents:
            return
        tokenized_docs = [_tokenize_features(d["text"]) for d in self.documents]
        df: Counter = Counter()
        for tdoc in tokenized_docs:
            for feat in tdoc.keys():
                df[feat] += 1

        most_common = [feat for feat, _ in df.most_common(4096)]
        self.vocab = {feat: idx for idx, feat in enumerate(most_common)}
        n_docs = len(self.documents)
        n_vocab = len(self.vocab)

        idf_arr = np.zeros(n_vocab, dtype=np.float32)
        for feat, idx in self.vocab.items():
            idf_arr[idx] = math.log((1.0 + n_docs) / (1.0 + df[feat])) + 1.0
        self.idf = idf_arr

        mat = np.zeros((n_docs, n_vocab), dtype=np.float32)
        for d_idx, tdoc in enumerate(tokenized_docs):
            for feat, cnt in tdoc.items():
                v_idx = self.vocab.get(feat)
                if v_idx is not None:
                    mat[d_idx, v_idx] = (1.0 + math.log(cnt)) * idf_arr[v_idx]
            norm = np.linalg.norm(mat[d_idx])
            if norm > 1e-8:
                mat[d_idx] /= norm
        self.matrix = mat

    def search(self, query: str, top_k: int = 5, doc_type: Optional[str] = None) -> List[Dict[str, Any]]:
        if self.matrix is None or self.idf is None or not self.vocab:
            return []
        q_feats = _tokenize_features(query or "microgravity combustion")
        q_vec = np.zeros(len(self.vocab), dtype=np.float32)
        for feat, cnt in q_feats.items():
            v_idx = self.vocab.get(feat)
            if v_idx is not None:
                q_vec[v_idx] = (1.0 + math.log(cnt)) * self.idf[v_idx]
        q_norm = np.linalg.norm(q_vec)
        if q_norm > 1e-8:
            q_vec /= q_norm

        scores = self.matrix @ q_vec
        ranked_indices = np.argsort(-scores)

        results: List[Dict[str, Any]] = []
        for idx in ranked_indices:
            doc = self.documents[int(idx)]
            if doc_type and doc["doc_type"] != doc_type:
                continue
            sim = float(scores[int(idx)])
            results.append({
                "doc_id": doc["doc_id"],
                "doc_type": doc["doc_type"],
                "title": doc["title"],
                "source": doc["source"],
                "url": doc["url"],
                "similarity": round(max(0.0, sim), 4),
                "text": doc["text"][:800],
                "metadata": doc["metadata"],
            })
            if len(results) >= top_k:
                break
        return results


class ExperimentRankingEngine:
    """
    Yarışmanın ana hedefi olan 'Summarize, Rank, Compare & Interpret' işlevini yürütür.
    Kullanıcının görev atmosferi, donanım raf filtresi (CIR / MSG / CYGNUS / CABIN) ve sorgusuna göre NASA deneylerini:
    1) Fiziksel Parametre Uyumu (O2 %, Basınç psia, Akış hızı cm/s, Yakıt sınıfı)
    2) Semantik Sorgu Benzerliği
    3) Yangın Güvenliği Kritiklik / Risk Skoru
    kriterleriyle puanlayıp sıralar.
    """

    def __init__(self, knowledge_index: SemanticKnowledgeIndex) -> None:
        self.index = knowledge_index

    def rank_experiments(
        self,
        mission_params: Dict[str, Any],
        query: str = "",
        hardware_filter: str = "ALL",
    ) -> Dict[str, Any]:
        target_o2 = float(mission_params.get("oxygen_pct", 21.0))
        target_p = float(mission_params.get("pressure_psia", 14.7))
        target_flow = float(mission_params.get("airflow_cms", 3.5))
        target_fuel = str(mission_params.get("fuel_id", "n_heptane"))
        target_g = float(mission_params.get("gravity_g", 0.0))
        hw_norm = (hardware_filter or "ALL").strip().upper()

        sem_map: Dict[str, float] = {}
        if query and query.strip():
            sem_hits = self.index.search(query.strip(), top_k=len(NASA_EXPERIMENTS_CATALOG), doc_type="nasa_experiment")
            for h in sem_hits:
                sem_map[h["doc_id"]] = h["similarity"]

        ranked: List[Dict[str, Any]] = []
        for exp in NASA_EXPERIMENTS_CATALOG:
            if hw_norm not in ("", "ALL") and exp.get("hardware_group", "").upper() != hw_norm:
                continue

            # 1) Atmosfer ve Akış Yakınlık Skoru (0 - 100)
            o2_diff = abs(target_o2 - float(exp["oxygen_pct"]))
            p_diff = abs(target_p - float(exp["pressure_psia"]))
            flow_diff = abs(target_flow - float(exp["airflow_cms"]))
            fuel_bonus = 22.0 if exp["fuel_id"] == target_fuel else 0.0
            # Kısmi yerçekimi seçildiyse ACME E-FIELD ve Ay/keşif atmosferi deneylerine ek uyum bonusu
            partial_g_bonus = 14.0 if (0.04 <= target_g <= 0.85 and exp["exp_id"] in ("PSI-ACME-09", "PSI-SOFIE-08", "PSI-SAFFIRE5-07", "PSI-DAFT-15")) else 0.0

            param_affinity = max(
                10.0,
                100.0 - (min(42.0, o2_diff * 1.6) + p_diff * 2.6 + flow_diff * 1.3) + fuel_bonus + partial_g_bonus,
            )
            param_affinity = min(100.0, param_affinity)

            # 2) Bu deneydeki malzemenin hedef görev atmosferindeki gerçek fiziksel riski
            sim_eval = simulate_combustion_state({
                "fuel_id": exp["fuel_id"],
                "gravity_g": target_g,
                "oxygen_pct": target_o2,
                "pressure_psia": target_p,
                "airflow_cms": target_flow,
                "droplet_d0_mm": 3.5,
                "diluent": mission_params.get("diluent", "N2"),
            })
            hazard_score = float(sim_eval["telemetry"]["risk_score"])

            # 3) Semantik alaka
            sem_score = sem_map.get(exp["exp_id"], 0.0) * 100.0

            if query and query.strip():
                composite = 0.44 * sem_score + 0.32 * param_affinity + 0.24 * hazard_score
            else:
                composite = 0.56 * param_affinity + 0.44 * hazard_score

            ranked.append({
                **exp,
                "priority_score": round(min(99.9, composite), 1),
                "param_affinity": round(param_affinity, 1),
                "mission_hazard_score": int(hazard_score),
                "predicted_regime_in_mission": sim_eval["telemetry"]["regime"],
                "predicted_moc_in_mission": sim_eval["telemetry"]["moc_pct"],
            })

        ranked.sort(key=lambda x: x["priority_score"], reverse=True)
        for rank_no, item in enumerate(ranked, 1):
            item["rank"] = rank_no

        return {
            "count": len(ranked),
            "hardware_filter": hw_norm,
            "mission_evaluated": {
                "oxygen_pct": target_o2,
                "pressure_psia": target_p,
                "airflow_cms": target_flow,
                "gravity_g": target_g,
                "fuel_id": target_fuel,
            },
            "ranked_experiments": ranked,
        }

    def compare_experiments(self, exp_ids: List[str], mission_params: Dict[str, Any]) -> Dict[str, Any]:
        """Seçilen 2 ila 4 NASA deneyini donanım, brülör/numune şekli, sensör ve MOC açısından yan yana karşılaştırır."""
        selected = [e for e in NASA_EXPERIMENTS_CATALOG if e["exp_id"] in exp_ids]
        if len(selected) < 2:
            selected = NASA_EXPERIMENTS_CATALOG[:3]

        lowest_moc_exp = min(selected, key=lambda x: x["moc_measured_pct"])
        highest_o2_exp = max(selected, key=lambda x: x["oxygen_pct"])
        cool_flame_exps = [x["program"] for x in selected if x["cool_flame_observed"]]
        facilities = sorted(list({x.get("hardware_group", "CIR") for x in selected}))

        hw_note_tr = (
            f"Donanım mimarisi olarak tümü aynı **{facilities[0]}** platformunu paylaşmaktadır. "
            if len(facilities) == 1
            else f"Farklı uzay donanım mimarilerini (**{' vs. '.join(facilities)}**) kapsayarak ölçek ve akış etkisini karşılaştırmaktadır. "
        )
        hw_note_en = (
            f"All selected investigations share the **{facilities[0]}** orbital hardware facility. "
            if len(facilities) == 1
            else f"Spans distinct orbital facilities (**{' vs. '.join(facilities)}**), contrasting scale, containment, and flow ducts. "
        )

        synthesis_tr = (
            f"◈ **Soruşturmalar Arası Benzerlik & Farklılık Sentezi ({len(selected)} NASA PSI Kaydı):** {hw_note_tr}"
            f"En düşük oksijen sınırına sahip (en kolay tutuşan) deney **%{lowest_moc_exp['moc_measured_pct']} MOC** ile "
            f"**{lowest_moc_exp['program']}** ({lowest_moc_exp['material']}); en yüksek test oksijenine çıkan ise "
            f"**%{highest_o2_exp['oxygen_pct']} O₂** ile **{highest_o2_exp['program']}** kaydıdır. "
        )
        if cool_flame_exps:
            synthesis_tr += (
                f"Ayrıca **{', '.join(cool_flame_exps)}** soruşturmalarında 550–750 K görünmez Soğuk Alev gözlemlendiğinden "
                f"yalnızca optik kamera yerine UV/IR radyometre + CO/CH₂O ve DAFT/SAME toz-ayrımlı lazer sensör füzyonu zorunludur."
            )
        else:
            synthesis_tr += "Havalandırma fanlarının (HVAC) anında kapatılması ve ince su sisi (SoFIE-MIST) tüm seçili rejimlerde ortak birincil bastırma adımıdır."

        synthesis_en = (
            f"◈ **Cross-Investigation Similarity & Difference Synthesis ({len(selected)} NASA PSI Records):** {hw_note_en}"
            f"**{lowest_moc_exp['program']}** ({lowest_moc_exp['material']}) exhibits the lowest Minimum Oxygen Concentration "
            f"(**{lowest_moc_exp['moc_measured_pct']}% O₂**), whereas **{highest_o2_exp['program']}** spans up to **{highest_o2_exp['oxygen_pct']}% O₂**. "
        )
        if cool_flame_exps:
            synthesis_en += (
                f"Invisible NTC Cool Flame persistence in **{', '.join(cool_flame_exps)}** mandates UV/IR + CO multi-sensor fusion alongside DAFT/SAME dust-immune smoke detection."
            )
        else:
            synthesis_en += "Immediate cabin HVAC shutoff and fine water mist (SoFIE-MIST) remain the universal non-Halon countermeasures."

        return {
            "compared_count": len(selected),
            "experiments": selected,
            "lowest_moc_program": lowest_moc_exp["program"],
            "synthesis_tr": synthesis_tr,
            "synthesis_en": synthesis_en,
        }
