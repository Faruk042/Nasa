# -*- coding: utf-8 -*-
"""
Canlı NASA Veri Çekme, Sürekli Otonom Web Veri Akışı (Continuous Stream) ve Belge/URL Analiz Motoru.
Desteklenen Kaynaklar:
1. NASA Technical Reports Server (NTRS REST API — ntrs.nasa.gov)
2. NASA Open Science Data Repository & PSI (OSDR REST API — osdr.nasa.gov)
3. Herhangi bir Bilimsel Web URL'si, Canlı JSON/CSV Telemetri Beslemesi veya PDF/TXT Raporu
"""

from __future__ import annotations

import datetime
import io
import json
import re
import threading
import time
from pathlib import Path
from typing import Any, Dict, List, Optional
from bs4 import BeautifulSoup
from urllib.parse import parse_qs, quote, quote_plus, urljoin, urlparse

from core.config_manager import create_secure_http_session, get_resource_base_dir, get_user_data_dir
from core.data_vision_processor import (
    extract_sim_params_from_text_or_table,
    extract_tabular_or_text_from_archive_bytes,
)
from core.nasa_datasets import NASA_EXPERIMENTS_CATALOG
from core.physics_engine import simulate_combustion_state
from core.security_guard import validate_external_url_strict

try:
    import pymupdf as fitz  # Modern PyMuPDF API (uyarısız)
    PDF_SUPPORT = True
except ImportError:
    try:
        import fitz  # Eski sürüm yedeği
        PDF_SUPPORT = True
    except ImportError:
        fitz = None
        PDF_SUPPORT = False


_TR_TO_EN_COMBUSTION_MAP = [
    ("soğuk alev", "cool flame"),
    ("soguk alev", "cool flame"),
    ("serin alev", "ACME CFI-G cool flame"),
    ("cool flame", "cool flame"),
    ("uzay giysisi", "EVA spacesuit flammability 100% oxygen"),
    ("spacesuit", "EVA spacesuit flammability"),
    ("ay üssü", "lunar partial gravity material flammability"),
    ("gezgin", "pressurized rover exploration atmosphere"),
    ("kısmi yerçekimi", "partial gravity lunar combustion"),
    ("luci", "lunar gravity combustion investigation"),
    ("havalandırma", "low velocity airflow"),
    ("havalandirma", "low velocity airflow"),
    ("su sisi", "fine water mist suppression"),
    ("halon", "spacecraft fire suppression"),
    ("artemis", "exploration atmosphere 34% oxygen"),
    ("%34", "exploration atmosphere oxygen"),
    ("34%", "exploration atmosphere oxygen"),
    ("%100", "spacesuit 100% oxygen flammability"),
    ("%85", "ACME CFI-G spherical burner oxygen"),
    ("moc", "limiting oxygen concentration"),
    ("oksijen", "oxygen flammability"),
    ("propan", "ACME CFI-G propane spherical burner"),
    ("propane", "ACME CFI-G propane spherical burner"),
    ("heptan", "heptane droplet"),
    ("heptane", "heptane droplet"),
    ("metanol", "methanol droplet"),
    ("methanol", "methanol droplet"),
    ("pmma", "PMMA solid fuel"),
    ("akrilik", "PMMA solid fuel"),
    ("nomex", "Nomex flame spread"),
    ("sibal", "Saffire cotton fiberglass"),
    ("hidrojen", "hydrogen jet diffusion"),
    ("saffire", "Saffire spacecraft fire"),
    ("flex", "FLEX droplet combustion"),
    ("bass", "BASS microgravity burning"),
    ("spice", "SPICE smoke point coflow microgravity"),
    ("slise", "SLISE flame liftoff microgravity"),
    ("sofie", "SoFIE solid fuel ignition"),
    ("cfi-g", "ACME Cool Flames Investigation Gases"),
    ("bre", "ACME Burning Rate Emulator"),
    ("e-field", "ACME E-FIELD laminar diffusion flame"),
    ("daft", "DAFT dust aerosol smoke detection ISS"),
    ("acme", "ACME microgravity flame"),
    ("sensör", "fire detection sensor"),
    ("kurum", "soot radiation"),
]


def build_english_nasa_query(raw_query: str) -> str:
    """
    Uzun Türkçe veya karmaşık kullanıcı sorularını NASA NTRS / OSDR REST API'lerinin
    milisaniyeler içinde en yüksek isabetle yanıtlayacağı özlü İngilizce bilimsel sorguya dönüştürür.
    """
    clean = (raw_query or "").strip()
    if not clean:
        return "microgravity combustion flame safety"

    lower = clean.lower()
    # Eğer zaten kısa ve Türkçe karakter içermeyen doğrudan İngilizce teknik sorguysa koru
    has_tr_chars = any(ch in lower for ch in "çğıöşü")
    if len(clean) <= 65 and not has_tr_chars and any(
        w in lower for w in ("flame", "combustion", "fire", "saffire", "flex", "bass", "sofie", "acme", "microgravity", "droplet")
    ):
        return clean

    matched_terms: List[str] = []
    for needle, eng_term in _TR_TO_EN_COMBUSTION_MAP:
        if needle in lower and eng_term not in matched_terms:
            matched_terms.append(eng_term)
        if len(matched_terms) >= 3:
            break

    if matched_terms:
        q_out = " ".join(matched_terms)
        if "microgravity" not in q_out.lower() and "spacecraft" not in q_out.lower():
            q_out = f"microgravity {q_out}"
        return q_out[:85]

    # İngilizce kelimeleri ayıkla veya varsayılan mikroçekim sorgusuna düş
    ascii_words = re.findall(r"[a-zA-Z0-9\-]{3,}", clean)
    stop_tr = {
        "analiz", "mevcut", "yanma", "odasi", "parametrelerimi", "degerlendir", "hangi", "deneyleriyle",
        "siralayarak", "uzay", "araci", "yangin", "guvenligi", "onerilerini", "acikla", "icin", "olan",
        "gore", "nasil", "neden", "karsilastir", "kiyasla", "aktif", "telemetrisini", "ortustugunu",
    }
    filtered = [w for w in ascii_words if w.lower() not in stop_tr][:5]
    if filtered:
        return (" ".join(filtered) + " microgravity combustion")[:85]
    return "microgravity combustion spacecraft fire safety"


class NasaLiveFetcher:
    """NASA NTRS, NASA PSI (psi.nasa.gov), OSDR ve bilimsel URL/JSON/CSV/XLSX/ZIP/PDF kaynaklarından canlı veri çeker."""

    NTRS_SEARCH_URL = "https://ntrs.nasa.gov/api/citations/search"
    NTRS_CITATION_URL = "https://ntrs.nasa.gov/api/citations"
    PSI_SEARCH_URL = "https://psi.nasa.gov/geode-py/ws/repo/search"
    PSI_INV_URL = "https://psi.nasa.gov/geode-py/ws/repo/investigations"
    PSI_STUDY_DL_URL = "https://psi.nasa.gov/geode-py/ws/studies"
    OSDR_SEARCH_URL = "https://osdr.nasa.gov/osdr/data/search"

    def __init__(self) -> None:
        self.session = create_secure_http_session()
        self.cache_file = get_user_data_dir() / "nasa_live_cache.json"
        self._cache_lock = threading.Lock()
        self._cache: Dict[str, Any] = self._load_cache()
        self._psi_snapshot_list: List[Dict[str, Any]] = self._load_psi_snapshot()
        self._psi_snapshot_map: Dict[str, Dict[str, Any]] = {
            str(r.get("id") or "").upper(): r for r in self._psi_snapshot_list if r.get("id")
        }

    @staticmethod
    def _load_psi_snapshot() -> List[Dict[str, Any]]:
        candidates = [
            get_resource_base_dir() / "core" / "psi_archive_snapshot.json",
            Path(__file__).resolve().parent / "psi_archive_snapshot.json",
        ]
        for cand in candidates:
            if cand.is_file():
                try:
                    data = json.loads(cand.read_text(encoding="utf-8"))
                    if isinstance(data, list):
                        return data
                except Exception:
                    continue
        return []

    @staticmethod
    def _format_psi_date(raw_val: Any, fallback: str = "ISS") -> str:
        s = str(raw_val or "").strip()
        if not s:
            return fallback[:16]
        try:
            ts = float(s)
            if ts > 900_000_000:
                return datetime.datetime.fromtimestamp(ts, tz=datetime.timezone.utc).strftime("%Y-%m-%d")
        except Exception:
            pass
        return s[:16]

    def _snapshot_row_to_item(self, row: Dict[str, Any], source_label: str = "NASA PSI Repository (psi.nasa.gov)") -> Dict[str, Any]:
        acc = str(row.get("id") or "PSI").strip()
        acro = str(row.get("acronym") or "").strip()
        raw_title = str(row.get("raw_title") or row.get("title") or acc).strip()
        display_title = (
            f"{acc} ({acro}) — {raw_title}"
            if (acro and acro.lower() not in raw_title.lower() and not raw_title.startswith(acc))
            else (raw_title if raw_title.startswith(acc) else f"{acc} — {raw_title}")
        )
        hw = str(row.get("hardware") or "").strip()
        plat = str(row.get("platform") or "ISS").strip()
        mission_str = f"{plat} • {hw}" if hw else plat
        phases = row.get("phases") or []
        return {
            "id": acc,
            "acronym": acro,
            "source": source_label,
            "title": display_title,
            "abstract": str(row.get("abstract") or "NASA Physical Sciences Informatics (PSI) deneysel veri kaydı.")[:850],
            "mission": mission_str,
            "date": self._format_psi_date(row.get("date"), plat),
            "url": str(row.get("url") or f"https://psi.nasa.gov/physci/repo/data/investigations/{acc}"),
            "table_file": str(row.get("table_file") or ""),
            "phase_count": len(phases),
            "extracted_sim_params": dict(row.get("extracted_sim_params") or {}),
            "phases": phases,
            "summary_tr": str(row.get("summary_tr") or ""),
            "summary_en": str(row.get("summary_en") or ""),
        }

    def _search_psi_snapshot(self, query: str, limit: int = 25, source_label: str = "NASA PSI Verified Archive") -> List[Dict[str, Any]]:
        if not self._psi_snapshot_list:
            return []
        q_raw = (query or "").strip().lower()
        q_eng = build_english_nasa_query(query).lower()
        broad_queries = {"", "all", "combustion", "flame", "fire", "microgravity", "psi"}
        is_broad = q_raw in broad_queries

        raw_tokens = [w for w in re.split(r"[^a-z0-9\-]+", f"{q_raw} {q_eng}") if len(w) >= 2]
        stop_generic = {"microgravity", "spacecraft", "investigation", "experiment", "experiments", "nasa"}
        spec_tokens = [t for t in raw_tokens if t not in stop_generic] or raw_tokens

        scored: List[tuple] = []
        for idx, row in enumerate(self._psi_snapshot_list):
            acc_l = str(row.get("id") or "").lower()
            acro_l = str(row.get("acronym") or "").lower()
            blob = (
                f"{acc_l} {acro_l} {row.get('raw_title', '')} {row.get('title', '')} "
                f"{row.get('hardware', '')} {row.get('platform', '')} {row.get('table_file', '')} {row.get('abstract', '')}"
            ).lower()
            score = 0
            if q_raw and q_raw == acc_l:
                score += 120
            if acro_l and q_raw and (q_raw in acro_l or acro_l in q_raw):
                score += 25
            for tok in spec_tokens:
                if tok == acc_l:
                    score += 80
                elif acro_l and tok in acro_l:
                    score += 12
                elif tok in blob:
                    score += 4
            if is_broad and score == 0:
                score = 1
            has_tbl = 1 if (row.get("phases") or row.get("table_file")) else 0
            if score > 0 or is_broad:
                scored.append((score, has_tbl, -idx, row))

        if not scored:
            scored = [(1, 1 if row.get("phases") else 0, -idx, row) for idx, row in enumerate(self._psi_snapshot_list)]

        scored.sort(key=lambda x: (x[0], x[1], x[2]), reverse=True)
        return [self._snapshot_row_to_item(x[3], source_label=source_label) for x in scored[: max(1, limit)]]

    def _load_cache(self) -> Dict[str, Any]:
        if self.cache_file.is_file():
            try:
                return json.loads(self.cache_file.read_text(encoding="utf-8"))
            except Exception:
                return {}
        return {}

    def _save_cache(self) -> None:
        try:
            with self._cache_lock:
                if len(self._cache) > 60:
                    keys = list(self._cache.keys())[-50:]
                    self._cache = {k: self._cache[k] for k in keys}
                payload_txt = json.dumps(self._cache, ensure_ascii=False, indent=2)
            self.cache_file.write_text(payload_txt, encoding="utf-8")
        except Exception:
            pass

    def search_ntrs_live(self, query: str, limit: int = 8, force_refresh: bool = False) -> Dict[str, Any]:
        """
        Gerçek NASA Technical Reports Server (NTRS) API üzerinden canlı bilimsel makale ve deney raporu arar.
        Özet metni boş olan poster/slayt kayıtlarını otomatik ayıklar.
        """
        effective_q = build_english_nasa_query(query)
        cache_key = f"ntrs_v3::{effective_q.lower()}::{limit}"
        now = time.time()

        if not force_refresh:
            with self._cache_lock:
                if cache_key in self._cache and (now - self._cache[cache_key].get("ts", 0)) < 3600:
                    cached_data = dict(self._cache[cache_key])
                    cached_data["source_status"] = "cached_live"
                    return cached_data

        try:
            resp = self.session.get(
                self.NTRS_SEARCH_URL,
                params={"q": effective_q},
                timeout=(3.0, 5.0),
            )
            resp.raise_for_status()
            payload = resp.json()
            raw_results = payload.get("results", [])[: max(limit * 4, 28)]

            parsed: List[Dict[str, Any]] = []
            for item in raw_results:
                raw_abstract = str(item.get("abstract") or "").strip()
                if len(raw_abstract) < 25 or "özet metni ntrs kaydında" in raw_abstract.lower():
                    continue
                cid = str(item.get("id", ""))
                title = str(item.get("title") or "Untitled NASA Technical Report").strip()
                abstract = raw_abstract
                pub_date = ""
                pubs = item.get("publications") or []
                if pubs and isinstance(pubs, list) and isinstance(pubs[0], dict):
                    pub_date = str(pubs[0].get("publicationDate", ""))[:10]
                if not pub_date:
                    pub_date = str(item.get("created", ""))[:10]

                center = ""
                c_obj = item.get("center")
                if isinstance(c_obj, dict):
                    center = str(c_obj.get("code") or c_obj.get("name") or "NASA")

                authors: List[str] = []
                for aff in (item.get("authorAffiliations") or [])[:4]:
                    if isinstance(aff, dict):
                        meta = aff.get("meta", {})
                        author_name = meta.get("author", {}).get("name") if isinstance(meta, dict) else None
                        if author_name:
                            authors.append(str(author_name))

                pdf_url = ""
                for dl in item.get("downloads") or []:
                    if isinstance(dl, dict):
                        links = dl.get("links") or {}
                        if isinstance(links, dict) and links.get("pdf"):
                            pdf_rel = str(links["pdf"])
                            pdf_url = pdf_rel if pdf_rel.startswith("http") else f"https://ntrs.nasa.gov{pdf_rel}"
                            break

                sim_ext = extract_sim_params_from_text_or_table(f"{title}\n{abstract}", f"NTRS-{cid}.txt")
                parsed.append({
                    "id": f"NTRS-{cid}",
                    "raw_id": cid,
                    "source": "NASA NTRS Live API",
                    "title": title,
                    "abstract": abstract[:900],
                    "date": pub_date or "NASA Archive",
                    "center": center or "GRC",
                    "authors": ", ".join(authors) if authors else "NASA Research Team",
                    "url": f"https://ntrs.nasa.gov/citations/{cid}" if cid else f"https://ntrs.nasa.gov/search?q={quote_plus(effective_q)}",
                    "pdf_url": pdf_url,
                    "extracted_sim_params": sim_ext["extracted_sim_params"],
                })
                if len(parsed) >= limit:
                    break

            if not parsed:
                parsed = self._catalog_fallback_items(effective_q, limit=limit, source_tag="NASA PSI / NTRS Archive")
                status_tag = "cached_live"
            else:
                status_tag = "live_online"

            result_obj = {
                "ok": True,
                "source_status": status_tag,
                "query_used": effective_q,
                "count": len(parsed),
                "items": parsed,
                "ts": now,
            }
            with self._cache_lock:
                self._cache[cache_key] = result_obj
            self._save_cache()
            return result_obj

        except Exception as exc:
            with self._cache_lock:
                if cache_key in self._cache and self._cache[cache_key].get("items"):
                    fallback = dict(self._cache[cache_key])
                    fallback["source_status"] = "offline_cache"
                    return fallback
            fb_items = self._catalog_fallback_items(effective_q, limit=limit, source_tag="NASA PSI / NTRS Verified Archive")
            return {
                "ok": True,
                "source_status": "offline_cache",
                "query_used": effective_q,
                "count": len(fb_items),
                "items": fb_items,
                "note": str(exc),
            }

    @staticmethod
    def _catalog_fallback_items(query: str, limit: int = 6, source_tag: str = "NASA PSI Archive") -> List[Dict[str, Any]]:
        tokens = [w for w in re.split(r"[^a-z0-9]+", (query or "").lower()) if len(w) >= 3]
        scored: List[tuple] = []
        for idx, exp in enumerate(NASA_EXPERIMENTS_CATALOG):
            blob = (
                f"{exp['exp_id']} {exp['program']} {exp['title']} {exp['title_tr']} "
                f"{exp['key_finding_en']} {exp['key_finding_tr']} {' '.join(exp.get('tags', []))}"
            ).lower()
            hits = sum(2 for t in tokens if t in blob)
            scored.append((hits, -idx, exp))
        scored.sort(key=lambda x: (x[0], x[1]), reverse=True)
        chosen = [x[2] for x in scored[: max(1, limit)]]
        return [
            {
                "id": f"NTRS-{e['ntrs_id']}",
                "raw_id": str(e["ntrs_id"]),
                "source": f"{source_tag} ({e['program']})",
                "title": e["title"],
                "abstract": e["key_finding_en"],
                "date": str(e.get("year", "NASA")),
                "center": "GRC",
                "authors": e.get("facility", "ISS CIR / MSG"),
                "url": e["ntrs_url"],
                "pdf_url": "",
                "extracted_sim_params": {
                    "fuel_id": e.get("fuel_id", "n_heptane"),
                    "gravity_g": float(e.get("gravity_g", 0.0)),
                    "oxygen_pct": float(e.get("oxygen_pct", 21.0)),
                    "pressure_psia": float(e.get("pressure_psia", 14.7)),
                    "airflow_cms": float(e.get("airflow_cms", 2.4)),
                    "droplet_d0_mm": 4.4 if e.get("cool_flame_observed") else 3.2,
                    "diluent": "N2",
                },
            }
            for e in chosen
        ]

    def search_osdr_psi_live(self, query: str, limit: int = 8, force_refresh: bool = False) -> Dict[str, Any]:
        """
        Öncelikle doğrudan resmi NASA Physical Sciences Informatics (psi.nasa.gov/geode-py/ws) REST servisini,
        ardından NASA OSDR servisini ve doğrulanmış 36 deneylik PSI arşiv önbelleğini sorgular.
        """
        clean_q = build_english_nasa_query(query)
        cache_key = f"psi_v3::{clean_q.lower()}::{limit}"
        now = time.time()

        if not force_refresh:
            with self._cache_lock:
                if cache_key in self._cache and (now - self._cache[cache_key].get("ts", 0)) < 3600:
                    cached = dict(self._cache[cache_key])
                    cached["source_status"] = "cached_live"
                    return cached

        items: List[Dict[str, Any]] = []
        last_exc: Optional[Exception] = None

        # 1. Resmi psi.nasa.gov Geode PSI Investigation API sorgusu
        try:
            psi_resp = self.session.get(
                self.PSI_SEARCH_URL,
                params={"term": clean_q, "source": "psi", "type": "investigation", "size": max(limit, 25)},
                timeout=(3.5, 6.5),
            )
            if psi_resp.status_code == 200:
                psi_data = psi_resp.json()
                psi_hits = psi_data.get("hits", {}).get("hits", [])
                for h in psi_hits[:limit]:
                    src = h.get("_source", {}) if isinstance(h, dict) else {}
                    acc = str(src.get("Accession") or "PSI").strip()
                    snap = self._psi_snapshot_map.get(acc.upper())
                    if snap:
                        items.append(self._snapshot_row_to_item(snap, source_label="NASA PSI Repository (psi.nasa.gov)"))
                        continue
                    raw_title = str(src.get("Title") or src.get("Study Title") or "NASA PSI Investigation").strip()
                    acro = str(src.get("Acronym") or "").strip()
                    full_title = f"{acc} ({acro}) — {raw_title}" if (acro and acro.lower() not in raw_title.lower()) else f"{acc} — {raw_title}"
                    desc = str(
                        src.get("Objectives")
                        or src.get("Study Description")
                        or src.get("Approach")
                        or ""
                    ).strip()
                    hw = str(src.get("Experiment Hardware") or "").strip()
                    if hw.startswith("{") or hw.startswith("["):
                        hw = ""
                    plat = str(src.get("Flight Platform") or src.get("Flight Program") or "ISS").strip()
                    mission_str = f"{plat} • {hw}" if hw else plat
                    sim_ext = extract_sim_params_from_text_or_table(f"{full_title}\n{desc}", f"{acc}.txt")
                    items.append({
                        "id": acc,
                        "acronym": acro,
                        "source": "NASA PSI Repository (psi.nasa.gov)",
                        "title": full_title,
                        "abstract": desc[:850] if desc else "NASA Physical Sciences Informatics (PSI) deneysel veri kaydı.",
                        "mission": mission_str,
                        "date": self._format_psi_date(src.get("Public Release Date"), plat),
                        "url": f"https://psi.nasa.gov/physci/repo/data/investigations/{acc}" if acc.startswith("PSI-") else f"https://psi.nasa.gov/physci/repo/search?q={quote_plus(clean_q)}",
                        "table_file": "",
                        "phase_count": 0,
                        "extracted_sim_params": sim_ext["extracted_sim_params"],
                        "phases": [],
                    })
        except Exception as exc_psi:
            last_exc = exc_psi

        # 2. Yedek olarak osdr.nasa.gov açık bilim API'sini dene
        if not items:
            try:
                resp = self.session.get(
                    self.OSDR_SEARCH_URL,
                    params={"term": clean_q, "size": limit},
                    timeout=(3.5, 6.5),
                )
                resp.raise_for_status()
                data = resp.json()
                hits = data.get("hits", {}).get("hits", [])
                for h in hits[:limit]:
                    src = h.get("_source", {}) if isinstance(h, dict) else {}
                    acc = str(src.get("Accession") or src.get("Authoritative Source URL") or "OSDR-PSI").strip()
                    snap = self._psi_snapshot_map.get(acc.upper())
                    if snap:
                        items.append(self._snapshot_row_to_item(snap, source_label="NASA OSDR / PSI Live API"))
                        continue
                    title = str(src.get("Study Title") or src.get("Project Title") or "NASA OSDR/PSI Investigation").strip()
                    desc = str(src.get("Study Description") or src.get("Experiment Description") or "").strip()
                    mission = str(src.get("Flight Program") or src.get("Space Program") or "NASA Spaceflight / Ground").strip()
                    sim_ext = extract_sim_params_from_text_or_table(f"{title}\n{desc}", f"{acc}.txt")
                    items.append({
                        "id": acc,
                        "source": "NASA OSDR / PSI Live API",
                        "title": title,
                        "abstract": desc[:800] if desc else "NASA OSDR/PSI açık bilim veri seti kaydı.",
                        "mission": mission,
                        "date": "NASA PSI",
                        "url": f"https://psi.nasa.gov/physci/repo/data/investigations/{acc}" if acc.startswith("PSI-") else f"https://psi.nasa.gov/physci/repo/search?q={quote_plus(clean_q)}",
                        "table_file": "",
                        "phase_count": 0,
                        "extracted_sim_params": sim_ext["extracted_sim_params"],
                        "phases": [],
                    })
            except Exception as exc_osdr:
                last_exc = exc_osdr

        if items:
            out = {
                "ok": True,
                "source_status": "live_online",
                "query_used": clean_q,
                "count": len(items),
                "items": items,
                "ts": now,
            }
            with self._cache_lock:
                self._cache[cache_key] = out
            self._save_cache()
            return out

        with self._cache_lock:
            if cache_key in self._cache and self._cache[cache_key].get("items"):
                fallback = dict(self._cache[cache_key])
                fallback["source_status"] = "offline_cache"
                return fallback

        snap_fb = self._search_psi_snapshot(query, limit=limit, source_tag="NASA PSI Verified Archive") if False else self._search_psi_snapshot(query, limit=limit, source_label="NASA PSI Verified Archive")
        fb_items = snap_fb or self._catalog_fallback_items(clean_q, limit=limit, source_tag="NASA PSI Verified Archive")
        return {
            "ok": True,
            "source_status": "offline_cache",
            "query_used": clean_q,
            "count": len(fb_items),
            "items": fb_items,
            "note": str(last_exc) if last_exc else "",
        }

    def _safe_get_bytes(self, start_url: str, max_bytes: int = 10 * 1024 * 1024) -> Dict[str, Any]:
        current_url = start_url
        resp = None
        for _ in range(5):
            ok_hop, hop_msg = validate_external_url_strict(current_url)
            if not ok_hop:
                return {"ok": False, "error": hop_msg}
            resp = self.session.get(current_url, timeout=12, allow_redirects=False, stream=True)
            if resp.status_code in (301, 302, 303, 307, 308) and resp.headers.get("Location"):
                next_loc = urljoin(current_url, resp.headers["Location"])
                resp.close()
                current_url = next_loc
                continue
            break

        if resp is None:
            return {"ok": False, "error": "Bağlantı yanıtı alınamadı."}
        resp.raise_for_status()

        chunks_buf: List[bytes] = []
        total_read = 0
        try:
            for chunk in resp.iter_content(chunk_size=65536):
                if not chunk:
                    continue
                total_read += len(chunk)
                if total_read > max_bytes:
                    return {"ok": False, "error": "Güvenlik sınırı: Uzak dosya boyutu 10 MB limitini aşıyor."}
                chunks_buf.append(chunk)
        finally:
            ctype = (resp.headers.get("Content-Type") or "").lower()
            encoding = resp.encoding or "utf-8"
            resp.close()

        return {
            "ok": True,
            "final_url": current_url,
            "content_type": ctype,
            "encoding": encoding,
            "bytes": b"".join(chunks_buf),
        }

    def _build_single_psi_scrape_from_snapshot(self, psi_id: str, clean_url: str) -> Optional[Dict[str, Any]]:
        snap = self._psi_snapshot_map.get(psi_id.upper())
        if not snap:
            return None
        title = str(snap.get("title") or f"{psi_id} — {snap.get('raw_title', '')}").strip()
        abstract = str(snap.get("abstract") or "").strip()
        sum_tr = str(snap.get("summary_tr") or "")
        sum_en = str(snap.get("summary_en") or sum_tr)
        content_txt = f"[{psi_id}] {title}\n\n{abstract}\n\n{sum_tr}".strip()
        return {
            "ok": True,
            "title": title,
            "url": clean_url,
            "char_count": len(content_txt),
            "content": content_txt[:22000],
            "extracted_sim_params": dict(snap.get("extracted_sim_params") or {}),
            "extracted_fields": ["psi_archive_snapshot"],
            "extraction_notes": [f"NASA PSI doğrulanmış veri kaydı ({psi_id}) yüklendi."],
            "phases": snap.get("phases") or [],
            "rich_summary_tr": sum_tr,
            "rich_summary_en": sum_en,
        }

    def _scrape_psi_or_nasa_portal_url(self, clean_url: str) -> Optional[Dict[str, Any]]:
        """
        psi.nasa.gov / osdr.nasa.gov / ntrs.nasa.gov (Angular SPA) bağlantılarını yakalar:
        1) Arama/listeleme sayfasıysa (/search?q=...) kullanıcıya interaktif deney seçici (mode='search_results') döndürür.
        2) Tekil PSI-XX deneyiyse resmi Geode REST API'den meta veriyi + Experimental Table (.csv/.xlsx) tablosunu indirip çözümler (çevrimdışıysa doğrulanmış PSI önbelleğine düşer).
        3) Tekil NTRS makale kaydıysa (/citations/<id>) resmi NTRS JSON API'sinden gerçek özet ve parametreleri çeker.
        """
        parsed_u = urlparse(clean_url)
        host = (parsed_u.hostname or "").lower()
        path_low = (parsed_u.path or "").lower()
        query_low = (parsed_u.query or "").lower()

        is_psi_host = "psi.nasa.gov" in host or "osdr.nasa.gov" in host
        is_ntrs_host = "ntrs.nasa.gov" in host
        if not (is_psi_host or is_ntrs_host):
            return None

        m_inv = re.search(r"\b(PSI-\d+)\b", clean_url, re.IGNORECASE)
        psi_id = m_inv.group(1).upper() if m_inv else ""
        m_ntrs_cit = re.search(r"/citations/(\d+)", path_low)
        ntrs_cid = m_ntrs_cit.group(1) if m_ntrs_cit else ""

        # 1. Arama / Listeleme URL'si Kontrolü (/search?q=combustion vb.)
        is_search_page = (
            "/search" in path_low
            or (not psi_id and not ntrs_cid and ("q=" in query_low or "term=" in query_low or path_low.rstrip("/") in ("", "/physci/repo", "/bio/repo")))
        )
        if is_search_page:
            qs = parse_qs(parsed_u.query or "")
            q_term = (qs.get("q") or qs.get("term") or ["combustion"])[0].strip() or "combustion"
            if is_ntrs_host:
                srch = self.search_ntrs_live(q_term, limit=18)
                srch_items = srch.get("items") or []
                repo_label = "NTRS"
            else:
                srch = self.search_osdr_psi_live(q_term, limit=25)
                srch_items = list(srch.get("items") or [])
                # Genel yanma sorgusunda 36 deneylik resmi PSI kümesinin tamamını seçiciye dahil et
                if q_term.lower() in ("combustion", "flame", "fire", "all"):
                    seen_ids = {str(it.get("id") or "").upper() for it in srch_items}
                    for extra in self._search_psi_snapshot(q_term, limit=36, source_label="NASA PSI Repository (psi.nasa.gov)"):
                        eid = str(extra.get("id") or "").upper()
                        if eid and eid not in seen_ids:
                            seen_ids.add(eid)
                            srch_items.append(extra)
                repo_label = "PSI"

            if srch_items:
                return {
                    "ok": True,
                    "mode": "search_results",
                    "repository": repo_label,
                    "query": q_term,
                    "url": clean_url,
                    "title": f"NASA {repo_label} Arama Sonuçları ({q_term})",
                    "count": len(srch_items),
                    "search_items": srch_items[:36],
                }
            return None

        # 2. Tekil NTRS Makale Kaydı (https://ntrs.nasa.gov/citations/20150023456)
        if is_ntrs_host and ntrs_cid:
            try:
                cit_fetched = self._safe_get_bytes(f"{self.NTRS_CITATION_URL}/{ntrs_cid}")
                if cit_fetched.get("ok") and cit_fetched.get("bytes"):
                    c_json = json.loads(cit_fetched["bytes"].decode("utf-8", errors="replace"))
                    c_title = str(c_json.get("title") or f"NTRS-{ntrs_cid}").strip()
                    c_abs = str(c_json.get("abstract") or "").strip()
                    meta_txt = f"NTRS-{ntrs_cid} — {c_title}\n\n{c_abs}".strip()
                    parsed_cit = extract_sim_params_from_text_or_table(meta_txt, f"NTRS_{ntrs_cid}.txt")
                    sp_c = parsed_cit["extracted_sim_params"]
                    sim_c = simulate_combustion_state(sp_c)
                    call_c = sim_c["callouts"]
                    tel_c = sim_c["telemetry"]
                    clean_abs = " ".join(c_abs.split())[:480]
                    sum_tr = (
                        f"**NASA NTRS Kaydı (`NTRS-{ntrs_cid}`): {c_title}**\n"
                        f"- **3B Yanma Odasına Aktarılan Koşullar:** Yakıt `{sp_c['fuel_id']}`, Yerçekimi `{sp_c['gravity_g']}G`, O₂ `%{sp_c['oxygen_pct']}`, Basınç `{sp_c['pressure_psia']} psia`, Akış `{sp_c['airflow_cms']} cm/s` — Rejim: **{call_c['badge_tr']}** (`{tel_c['flame_temp_k']} K`).\n"
                        + (f"- **Yayın Özeti:** {clean_abs}" if clean_abs else "")
                    )
                    sum_en = (
                        f"**NASA NTRS Record (`NTRS-{ntrs_cid}`): {c_title}**\n"
                        f"- **3D Chamber Conditions Applied:** Fuel `{sp_c['fuel_id']}`, Gravity `{sp_c['gravity_g']}G`, O₂ `{sp_c['oxygen_pct']}%`, Pressure `{sp_c['pressure_psia']} psia`, Airflow `{sp_c['airflow_cms']} cm/s` — Regime: **{call_c['badge_en']}** (`{tel_c['flame_temp_k']} K`).\n"
                        + (f"- **Publication Abstract:** {clean_abs}" if clean_abs else "")
                    )
                    return {
                        "ok": True,
                        "title": f"NTRS-{ntrs_cid}: {c_title}",
                        "url": clean_url,
                        "char_count": len(meta_txt),
                        "content": meta_txt[:20000],
                        "extracted_sim_params": sp_c,
                        "extracted_fields": parsed_cit["extracted_fields"],
                        "extraction_notes": parsed_cit["notes"],
                        "phases": [],
                        "rich_summary_tr": sum_tr,
                        "rich_summary_en": sum_en,
                    }
            except Exception:
                pass
            # NTRS çevrimdışı yedeği: katalogda varsa döndür
            for exp in NASA_EXPERIMENTS_CATALOG:
                if str(exp.get("ntrs_id")) == ntrs_cid:
                    sp_e = {
                        "fuel_id": exp.get("fuel_id", "n_heptane"),
                        "gravity_g": float(exp.get("gravity_g", 0.0)),
                        "oxygen_pct": float(exp.get("oxygen_pct", 21.0)),
                        "pressure_psia": float(exp.get("pressure_psia", 14.7)),
                        "airflow_cms": float(exp.get("airflow_cms", 2.4)),
                        "droplet_d0_mm": 4.4 if exp.get("cool_flame_observed") else 3.2,
                        "diluent": "N2",
                    }
                    sim_e = simulate_combustion_state(sp_e)
                    return {
                        "ok": True,
                        "title": f"NTRS-{ntrs_cid}: {exp['title']}",
                        "url": clean_url,
                        "char_count": len(exp["key_finding_en"]),
                        "content": f"{exp['title']}\n\n{exp['key_finding_en']}",
                        "extracted_sim_params": sp_e,
                        "extracted_fields": ["ntrs_verified_catalog"],
                        "extraction_notes": [],
                        "phases": [],
                        "rich_summary_tr": f"**NASA NTRS Kaydı (`NTRS-{ntrs_cid}`): {exp['title_tr']}**\n- **3B Yanma Odasına Aktarılan Koşullar:** `{sp_e['fuel_id']}`, `{sp_e['gravity_g']}G`, `%{sp_e['oxygen_pct']} O₂`, `{sp_e['airflow_cms']} cm/s` — Rejim: **{sim_e['callouts']['badge_tr']}**.\n- **Temel Bulgu:** {exp['key_finding_tr']}",
                        "rich_summary_en": f"**NASA NTRS Record (`NTRS-{ntrs_cid}`): {exp['title']}**\n- **3D Chamber Conditions Applied:** `{sp_e['fuel_id']}`, `{sp_e['gravity_g']}G`, `{sp_e['oxygen_pct']}% O₂`, `{sp_e['airflow_cms']} cm/s` — Regime: **{sim_e['callouts']['badge_en']}**.\n- **Key Finding:** {exp['key_finding_en']}",
                    }
            return None

        # 3. Tekil PSI-XX Deney Kaydı (https://psi.nasa.gov/physci/repo/data/investigations/PSI-117 vb.)
        if not psi_id:
            return None

        # Doğrulanmış 36 yanma deneyinden biriyse gecikmesiz (milisaniyede) önceden ayrıştırılmış resmi tablo ve özetle döndür
        if psi_id.upper() in self._psi_snapshot_map:
            return self._build_single_psi_scrape_from_snapshot(psi_id, clean_url)

        inv_api_url = f"{self.PSI_INV_URL}/{psi_id}"
        try:
            fetched = self._safe_get_bytes(inv_api_url)
        except Exception:
            fetched = {"ok": False}

        if not fetched.get("ok"):
            return self._build_single_psi_scrape_from_snapshot(psi_id, clean_url)

        try:
            inv_json = json.loads(fetched["bytes"].decode("utf-8", errors="replace"))
        except Exception:
            return self._build_single_psi_scrape_from_snapshot(psi_id, clean_url)

        title = str(
            inv_json.get("title")
            or inv_json.get("Title")
            or inv_json.get("proposalTitle")
            or psi_id
        ).strip()
        acro = str(inv_json.get("acronym") or inv_json.get("Acronym") or "").strip()
        objectives = str(inv_json.get("objectives") or inv_json.get("Objectives") or "").strip()
        approach = str(inv_json.get("approach") or inv_json.get("Approach") or "").strip()
        exp_tables = inv_json.get("experimentalTable") or []

        if isinstance(exp_tables, list) and exp_tables:
            sorted_tbls = sorted(
                [t for t in exp_tables if isinstance(t, dict) and t.get("file_name")],
                key=lambda t: (
                    0 if str(t["file_name"]).lower().endswith(".csv")
                    else (1 if str(t["file_name"]).lower().endswith(".xlsx") else 2)
                ),
            )
            for cand_tbl in sorted_tbls[:2]:
                tbl_fname = str(cand_tbl.get("file_name") or "").strip()
                if not tbl_fname.lower().endswith((".csv", ".xlsx", ".tsv")):
                    continue
                dl_url = f"{self.PSI_STUDY_DL_URL}/{psi_id}/download?file={quote(tbl_fname)}&redirect=true"
                try:
                    dl_res = self._safe_get_bytes(dl_url)
                except Exception:
                    dl_res = {"ok": False}
                if dl_res.get("ok") and dl_res.get("bytes"):
                    if tbl_fname.lower().endswith(".xlsx"):
                        csv_txt, _, _ = extract_tabular_or_text_from_archive_bytes(dl_res["bytes"], tbl_fname)
                    else:
                        csv_txt = dl_res["bytes"].decode("utf-8", errors="replace")
                    if csv_txt.strip():
                        parsed_tbl = extract_sim_params_from_text_or_table(csv_txt, tbl_fname)
                        combined_txt = f"[{psi_id}] {title}\n\nObjectives:\n{objectives}\n\nExperimental Table ({tbl_fname}):\n{csv_txt[:16000]}"
                        return {
                            "ok": True,
                            "title": f"{psi_id}: {title} ({tbl_fname})",
                            "url": clean_url,
                            "char_count": len(combined_txt),
                            "content": combined_txt[:22000],
                            "extracted_sim_params": parsed_tbl["extracted_sim_params"],
                            "extracted_fields": parsed_tbl["extracted_fields"],
                            "extraction_notes": parsed_tbl["notes"],
                            "phases": parsed_tbl.get("phases") or [],
                            "rich_summary_tr": parsed_tbl.get("rich_summary_tr") or "",
                            "rich_summary_en": parsed_tbl.get("rich_summary_en") or "",
                        }

        # Tablo indirilemediyse önce önbellekteki önceden ayrıştırılmış tabloyu kontrol et
        snap_entry = self._psi_snapshot_map.get(psi_id)
        if snap_entry and (snap_entry.get("phases") or snap_entry.get("table_file")):
            return self._build_single_psi_scrape_from_snapshot(psi_id, clean_url)

        meta_txt = f"{psi_id} ({acro}) — {title}\n\n{objectives}\n\n{approach}".strip()
        parsed_meta = extract_sim_params_from_text_or_table(meta_txt, f"{psi_id}.txt")
        sp_m = parsed_meta["extracted_sim_params"]
        sim_m = simulate_combustion_state(sp_m)
        call_m = sim_m["callouts"]
        tel_m = sim_m["telemetry"]
        clean_obj = " ".join(objectives.split())[:460]
        sum_tr = parsed_meta.get("rich_summary_tr") or (
            f"**NASA PSI Kaydı (`{psi_id}`" + (f" • `{acro}`" if acro else "") + f"): {title}**\n"
            f"- **3B Yanma Odasına Aktarılan Koşullar:** Yakıt `{sp_m['fuel_id']}`, Yerçekimi `{sp_m['gravity_g']}G`, O₂ `%{sp_m['oxygen_pct']}`, Basınç `{sp_m['pressure_psia']} psia`, Akış `{sp_m['airflow_cms']} cm/s` — Rejim: **{call_m['badge_tr']}** (`{tel_m['flame_temp_k']} K`).\n"
            + (f"- **Araştırma Özeti:** {clean_obj}" if clean_obj else "")
        )
        sum_en = parsed_meta.get("rich_summary_en") or (
            f"**NASA PSI Record (`{psi_id}`" + (f" • `{acro}`" if acro else "") + f"): {title}**\n"
            f"- **3D Chamber Conditions Applied:** Fuel `{sp_m['fuel_id']}`, Gravity `{sp_m['gravity_g']}G`, O₂ `{sp_m['oxygen_pct']}%`, Pressure `{sp_m['pressure_psia']} psia`, Airflow `{sp_m['airflow_cms']} cm/s` — Regime: **{call_m['badge_en']}** (`{tel_m['flame_temp_k']} K`).\n"
            + (f"- **Investigation Summary:** {clean_obj}" if clean_obj else "")
        )
        return {
            "ok": True,
            "title": f"{psi_id}: {title}",
            "url": clean_url,
            "char_count": len(meta_txt),
            "content": meta_txt[:20000],
            "extracted_sim_params": sp_m,
            "extracted_fields": parsed_meta["extracted_fields"],
            "extraction_notes": parsed_meta["notes"],
            "phases": parsed_meta.get("phases") or [],
            "rich_summary_tr": sum_tr,
            "rich_summary_en": sum_en,
        }

    def scrape_scientific_url(self, url: str) -> Dict[str, Any]:
        """
        Kullanıcının verdiği herhangi bir NASA (psi.nasa.gov / ntrs.nasa.gov / osdr.nasa.gov) veya bilimsel web sayfasını,
        canlı JSON/CSV/XLSX/ZIP/PDF bağlantısını SSRF kalkanı altında güvenle okur ve yanma parametrelerini çıkarır.
        """
        is_safe, clean_or_err = validate_external_url_strict(url)
        if not is_safe:
            return {"ok": False, "error": clean_or_err}
        clean_url = clean_or_err

        try:
            psi_direct = self._scrape_psi_or_nasa_portal_url(clean_url)
            if psi_direct and psi_direct.get("ok"):
                return psi_direct
        except Exception:
            pass

        try:
            fetched = self._safe_get_bytes(clean_url)
            if not fetched.get("ok"):
                return fetched

            current_url = fetched["final_url"]
            ctype = fetched["content_type"]
            encoding = fetched["encoding"]
            raw_content = fetched["bytes"]
            url_low = current_url.lower().split("?")[0]

            if (
                "application/pdf" in ctype
                or "spreadsheetml" in ctype
                or "application/zip" in ctype
                or url_low.endswith((".pdf", ".xlsx", ".zip"))
            ):
                fname_guess = url_low.split("/")[-1] or "remote_data.pdf"
                doc_res = self.extract_document_bytes(raw_content, filename=fname_guess)
                if doc_res.get("ok"):
                    doc_res["url"] = current_url
                    doc_res["title"] = doc_res.get("filename", current_url)
                return doc_res

            raw_txt_decoded = raw_content.decode(encoding, errors="replace")

            # JSON, CSV veya TSV doğrudan veri akışıysa ham metni koru
            if (
                "application/json" in ctype
                or "text/csv" in ctype
                or "tab-separated" in ctype
                or url_low.endswith((".json", ".csv", ".tsv"))
            ):
                raw_txt = raw_txt_decoded.strip()
                parsed_sim = extract_sim_params_from_text_or_table(raw_txt, url_low.split("/")[-1] or "feed.csv")
                return {
                    "ok": True,
                    "title": f"Canlı Veri Akışı ({url_low.split('/')[-1] or current_url})",
                    "url": current_url,
                    "char_count": len(raw_txt),
                    "content": raw_txt[:22000],
                    "extracted_sim_params": parsed_sim["extracted_sim_params"],
                    "extracted_fields": parsed_sim["extracted_fields"],
                    "extraction_notes": parsed_sim["notes"],
                    "phases": parsed_sim.get("phases") or [],
                    "rich_summary_tr": parsed_sim.get("rich_summary_tr") or "",
                    "rich_summary_en": parsed_sim.get("rich_summary_en") or "",
                }

            soup = BeautifulSoup(raw_txt_decoded, "html.parser")
            for tag in soup(["script", "style", "nav", "footer", "noscript", "svg"]):
                tag.decompose()
            title = soup.title.string.strip() if (soup.title and soup.title.string) else current_url
            paragraphs = [p.get_text(" ", strip=True) for p in soup.find_all(["h1", "h2", "h3", "p", "li", "td", "pre"])]
            text = "\n".join(p for p in paragraphs if len(p) > 12)
            text = re.sub(r"\n{3,}", "\n\n", text).strip()
            parsed_sim = extract_sim_params_from_text_or_table(f"{title}\n{text}", current_url)
            return {
                "ok": True,
                "title": title,
                "url": current_url,
                "char_count": len(text),
                "content": text[:20000],
                "extracted_sim_params": parsed_sim["extracted_sim_params"],
                "extracted_fields": parsed_sim["extracted_fields"],
                "extraction_notes": parsed_sim["notes"],
                "phases": parsed_sim.get("phases") or [],
                "rich_summary_tr": parsed_sim.get("rich_summary_tr") or "",
                "rich_summary_en": parsed_sim.get("rich_summary_en") or "",
            }
        except Exception as exc:
            return {"ok": False, "error": f"Web sayfası okunamadı: {exc}"}

    def extract_document_bytes(self, raw_bytes: bytes, filename: str) -> Dict[str, Any]:
        """Yüklenen PDF, CSV, TSV, XLSX, ZIP, JSON veya TXT bilimsel belgelerinden bellek korumalı metin ve parametre çıkarır."""
        if len(raw_bytes) > 25 * 1024 * 1024:
            return {"ok": False, "error": "Güvenlik sınırı: Dosya boyutu 25 MB limitini aşıyor."}
        ext = filename.lower().rsplit(".", 1)[-1] if "." in filename else "txt"
        effective_name = filename
        try:
            if ext == "pdf":
                if not PDF_SUPPORT or fitz is None:
                    return {"ok": False, "error": "PyMuPDF (fitz) modülü bulunamadı."}
                doc = fitz.open(stream=io.BytesIO(raw_bytes), filetype="pdf")
                max_pages = min(len(doc), 60)
                pages = [doc[p_idx].get_text("text") for p_idx in range(max_pages)]
                pages_count = len(doc)
                doc.close()
                full_text = "\n\n".join(pages).strip()
            elif ext in ("xlsx", "zip"):
                full_text, inner_name, pages_count = extract_tabular_or_text_from_archive_bytes(raw_bytes, filename)
                if ext == "zip" and inner_name and inner_name != filename:
                    effective_name = f"{filename} ({inner_name})"
                if not full_text.strip():
                    return {"ok": False, "error": f"{filename} arşivinden okunabilir veri tablosu çıkarılamadı."}
            else:
                try:
                    full_text = raw_bytes.decode("utf-8")
                except UnicodeDecodeError:
                    full_text = raw_bytes.decode("latin-1", errors="ignore")
                pages_count = 1

            parsed_sim = extract_sim_params_from_text_or_table(full_text, effective_name)
            return {
                "ok": True,
                "filename": effective_name,
                "pages": pages_count,
                "char_count": len(full_text),
                "content": full_text[:25000],
                "extracted_sim_params": parsed_sim["extracted_sim_params"],
                "extracted_fields": parsed_sim["extracted_fields"],
                "extraction_notes": parsed_sim["notes"],
                "phases": parsed_sim.get("phases") or [],
                "rich_summary_tr": parsed_sim.get("rich_summary_tr") or "",
                "rich_summary_en": parsed_sim.get("rich_summary_en") or "",
            }
        except Exception as exc:
            return {"ok": False, "error": f"Belge ayrıştırılamadı: {exc}"}


class ContinuousWebStreamManager:
    """
    Kullanıcının seçtiği bir web kaynağından (NASA NTRS, NASA OSDR/PSI veya Özel HTTP/HTTPS URL/JSON/CSV Akışı)
    belirlenen periyotlarla (örn. her 15-60 saniyede bir) kesintisiz veri çeken, parametreleri ayrıştıran ve
    RAG hafızası ile 3B simülasyonu gerçek zamanlı besleyen arka plan akış motoru.
    """

    ROTATING_NASA_TOPICS = [
        "FLEX microgravity heptane droplet cool flame",
        "Saffire spacecraft cabin fire oxygen spread",
        "BASS-II PMMA solid combustion ventilation airflow",
        "SoFIE solid fuel ignition exploration atmosphere 34% oxygen",
        "ACME CFI-G spherical burner cool flame oxygen",
        "lunar partial gravity material flammability spacesuit",
        "SPICE SLISE microgravity smoke point glovebox",
        "DAFT SAME spacecraft smoke aerosol detection",
    ]

    def __init__(self, fetcher: NasaLiveFetcher, knowledge_index: Any) -> None:
        self.fetcher = fetcher
        self.knowledge = knowledge_index
        self._lock = threading.Lock()
        self._enabled = False
        self._source = "ntrs"  # ntrs | osdr | custom_url
        self._query_or_url = "FLEX microgravity droplet cool flame"
        self._interval_sec = 20
        self._auto_sync_sim = True
        self._tick_count = 0
        self._seq_id = 0
        self._last_fetch_iso = ""
        self._last_error = ""
        self._latest_sim_params: Optional[Dict[str, Any]] = None
        self._events: List[Dict[str, Any]] = []
        self._indexed_ids: set[str] = set()
        self._wake_event = threading.Event()
        self._worker = threading.Thread(target=self._loop, daemon=True, name="NasaContinuousStreamWorker")
        self._worker.start()

    def configure(
        self,
        enabled: Optional[bool] = None,
        source: Optional[str] = None,
        query_or_url: Optional[str] = None,
        interval_sec: Optional[int] = None,
        auto_sync_sim: Optional[bool] = None,
        trigger_immediate: bool = False,
    ) -> Dict[str, Any]:
        with self._lock:
            if source in ("ntrs", "osdr", "custom_url"):
                self._source = source
            if query_or_url is not None and str(query_or_url).strip():
                self._query_or_url = str(query_or_url).strip()
            if interval_sec is not None:
                self._interval_sec = max(10, min(300, int(interval_sec)))
            if auto_sync_sim is not None:
                self._auto_sync_sim = bool(auto_sync_sim)
            if enabled is not None:
                self._enabled = bool(enabled)

        if trigger_immediate or (enabled is True):
            # Hemen eşzamanlı bir veri çekme adımı yürüterek yanıtın anında güncel paketi içermesini sağla
            st = self.poll_once()
            self._wake_event.set()
            return st

        return self.get_status()

    def _loop(self) -> None:
        while True:
            self._wake_event.wait(timeout=2.0)
            self._wake_event.clear()

            with self._lock:
                is_on = self._enabled
                wait_s = self._interval_sec

            if not is_on:
                continue

            self.poll_once()

            # Bir sonraki periyoda kadar bekle (erken uyanma destekli)
            slept = 0.0
            while slept < wait_s:
                with self._lock:
                    if not self._enabled:
                        break
                    wait_s = self._interval_sec
                time.sleep(0.5)
                slept += 0.5

    def poll_once(self) -> Dict[str, Any]:
        with self._lock:
            src = self._source
            target = self._query_or_url
            tick = self._tick_count
            self._tick_count += 1

        now_iso = datetime.datetime.now().strftime("%H:%M:%S")

        try:
            if src == "custom_url":
                scraped = self.fetcher.scrape_scientific_url(target)
                if not scraped.get("ok"):
                    with self._lock:
                        self._last_error = str(scraped.get("error") or "URL okunamadı")
                        self._last_fetch_iso = now_iso
                    return self.get_status()

                if scraped.get("mode") == "search_results":
                    s_items = scraped.get("search_items") or []
                    if not s_items:
                        with self._lock:
                            self._last_error = "Arama bağlantısında kayıt bulunamadı"
                            self._last_fetch_iso = now_iso
                        return self.get_status()
                    chosen_s = s_items[tick % len(s_items)]
                    sim_p = chosen_s.get("extracted_sim_params") or extract_sim_params_from_text_or_table(
                        f"{chosen_s.get('title', '')}\n{chosen_s.get('abstract', '')}", str(chosen_s.get("id") or "PSI")
                    )["extracted_sim_params"]
                    event = {
                        "seq_id": 0,
                        "time": now_iso,
                        "source": "Canlı Web URL",
                        "id": str(chosen_s.get("id") or f"WEB-{tick + 1}"),
                        "title": str(chosen_s.get("title") or target)[:140],
                        "summary": str(chosen_s.get("abstract") or "")[:260].replace("\n", " "),
                        "url": str(chosen_s.get("url") or target),
                        "extracted_sim_params": sim_p,
                        "extracted_fields": ["search_stream_item"],
                    }
                    self._record_event(event, sim_p, now_iso)
                    return self.get_status()

                title = str(scraped.get("title") or target)
                content = str(scraped.get("content") or "")
                phases_s = scraped.get("phases") or []
                if phases_s:
                    cur_ph = phases_s[tick % len(phases_s)]
                    sim_p = dict(cur_ph.get("sim_params") or scraped.get("extracted_sim_params") or {})
                    ph_tag = cur_ph.get("short_tr") or f"Faz {(tick % len(phases_s)) + 1}"
                    ev_title = f"{title[:110]} — {ph_tag}"
                else:
                    sim_p = scraped.get("extracted_sim_params") or {}
                    ev_title = title[:140]

                doc_sig = f"url::{target}::{len(content)}"
                if doc_sig not in self._indexed_ids and content:
                    self._indexed_ids.add(doc_sig)
                    self.knowledge.add_custom_document(
                        title=f"[Canlı Akış] {title}",
                        content=content[:6000],
                        source="Continuous Web Stream",
                        url=target,
                    )

                event = {
                    "seq_id": 0,
                    "time": now_iso,
                    "source": "Canlı Web URL",
                    "id": f"WEB-{tick + 1}",
                    "title": ev_title,
                    "summary": content[:260].replace("\n", " "),
                    "url": target,
                    "extracted_sim_params": sim_p,
                    "extracted_fields": scraped.get("extracted_fields", []),
                }
                self._record_event(event, sim_p, now_iso)
                return self.get_status()

            # NTRS veya OSDR akışı: Kullanıcı genel bıraktıysa veya her adımda farklı kayıt görmek için rotasyonlu/dinamik indeks seçimi
            effective_q = target
            if not target or target.lower() in ("auto", "otomatik", "flex microgravity droplet cool flame"):
                effective_q = self.ROTATING_NASA_TOPICS[tick % len(self.ROTATING_NASA_TOPICS)]

            if src == "osdr":
                res = self.fetcher.search_osdr_psi_live(effective_q, limit=8)
            else:
                res = self.fetcher.search_ntrs_live(effective_q, limit=8)

            items = res.get("items") or []
            if not items:
                with self._lock:
                    self._last_error = str(res.get("error") or "Kayıt bulunamadı")
                    self._last_fetch_iso = now_iso
                return self.get_status()

            chosen_item = items[tick % len(items)]
            item_id = str(chosen_item.get("id") or f"NASA-{tick + 1}")
            title = str(chosen_item.get("title") or "NASA Record")
            abstract = str(chosen_item.get("abstract") or "")
            url = str(chosen_item.get("url") or "")

            if chosen_item.get("extracted_sim_params"):
                sim_p = dict(chosen_item["extracted_sim_params"])
                ext_fields = ["verified_psi_or_ntrs_params"]
            else:
                parsed = extract_sim_params_from_text_or_table(f"{title}\n{abstract}", f"{item_id}.txt")
                sim_p = parsed["extracted_sim_params"]
                ext_fields = parsed["extracted_fields"]

            if item_id not in self._indexed_ids and abstract:
                self._indexed_ids.add(item_id)
                self.knowledge.add_custom_document(
                    title=f"[{item_id}] {title}",
                    content=f"{title}\n{abstract}",
                    source=chosen_item.get("source", "NASA Live Stream"),
                    url=url,
                )

            event = {
                "seq_id": 0,
                "time": now_iso,
                "source": chosen_item.get("source", "NASA Live"),
                "id": item_id,
                "title": title,
                "summary": abstract[:280],
                "url": url,
                "extracted_sim_params": sim_p,
                "extracted_fields": ext_fields,
            }
            self._record_event(event, sim_p, now_iso)
            return self.get_status()

        except Exception as exc:
            with self._lock:
                self._last_error = str(exc)
                self._last_fetch_iso = now_iso
            return self.get_status()

    def _record_event(self, event: Dict[str, Any], sim_p: Dict[str, Any], now_iso: str) -> None:
        with self._lock:
            self._seq_id += 1
            event["seq_id"] = self._seq_id
            self._latest_sim_params = sim_p
            self._last_fetch_iso = now_iso
            self._last_error = ""
            self._events.insert(0, event)
            if len(self._events) > 30:
                self._events = self._events[:30]

    def get_status(self) -> Dict[str, Any]:
        with self._lock:
            return {
                "ok": True,
                "enabled": self._enabled,
                "source": self._source,
                "query_or_url": self._query_or_url,
                "interval_sec": self._interval_sec,
                "auto_sync_sim": self._auto_sync_sim,
                "tick_count": self._tick_count,
                "seq_id": self._seq_id,
                "last_fetch_time": self._last_fetch_iso,
                "last_error": self._last_error,
                "latest_sim_params": self._latest_sim_params,
                "events": list(self._events[:12]),
            }
