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
from typing import Any, Dict, List, Optional
from bs4 import BeautifulSoup
from urllib.parse import quote_plus, urljoin

from core.config_manager import create_secure_http_session, get_user_data_dir
from core.data_vision_processor import extract_sim_params_from_text_or_table
from core.nasa_datasets import NASA_EXPERIMENTS_CATALOG
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
    """NASA NTRS, NASA OSDR/PSI ve bilimsel URL/JSON/CSV/PDF kaynaklarından canlı veri çeker ve önbellekler."""

    NTRS_SEARCH_URL = "https://ntrs.nasa.gov/api/citations/search"
    OSDR_SEARCH_URL = "https://osdr.nasa.gov/osdr/data/search"

    def __init__(self) -> None:
        self.session = create_secure_http_session()
        self.cache_file = get_user_data_dir() / "nasa_live_cache.json"
        self._cache_lock = threading.Lock()
        self._cache: Dict[str, Any] = self._load_cache()

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
        """
        effective_q = build_english_nasa_query(query)
        cache_key = f"ntrs::{effective_q.lower()}::{limit}"
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
            raw_results = payload.get("results", [])[:limit]

            parsed: List[Dict[str, Any]] = []
            for item in raw_results:
                cid = str(item.get("id", ""))
                title = str(item.get("title") or "Untitled NASA Technical Report").strip()
                abstract = str(item.get("abstract") or "Özet metni NTRS kaydında yer almıyor.").strip()
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
                })

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
            }
            for e in chosen
        ]

    def search_osdr_psi_live(self, query: str, limit: int = 6, force_refresh: bool = False) -> Dict[str, Any]:
        """
        NASA OSDR / PSI (Open Science Data Repository & Physical Sciences Informatics) API üzerinden canlı arama yapar.
        """
        clean_q = build_english_nasa_query(query)
        cache_key = f"osdr::{clean_q.lower()}::{limit}"
        now = time.time()

        if not force_refresh:
            with self._cache_lock:
                if cache_key in self._cache and (now - self._cache[cache_key].get("ts", 0)) < 3600:
                    cached = dict(self._cache[cache_key])
                    cached["source_status"] = "cached_live"
                    return cached

        try:
            resp = self.session.get(
                self.OSDR_SEARCH_URL,
                params={"term": clean_q, "size": limit},
                timeout=8,
            )
            resp.raise_for_status()
            data = resp.json()
            hits = data.get("hits", {}).get("hits", [])

            items: List[Dict[str, Any]] = []
            for h in hits[:limit]:
                src = h.get("_source", {}) if isinstance(h, dict) else {}
                acc = str(src.get("Accession") or src.get("Authoritative Source URL") or "OSDR-PSI")
                title = str(src.get("Study Title") or src.get("Project Title") or "NASA OSDR/PSI Investigation").strip()
                desc = str(src.get("Study Description") or src.get("Experiment Description") or "").strip()
                mission = str(src.get("Flight Program") or src.get("Space Program") or "NASA Spaceflight / Ground").strip()
                items.append({
                    "id": acc,
                    "source": "NASA OSDR / PSI Live API",
                    "title": title,
                    "abstract": desc[:800] if desc else "NASA OSDR/PSI açık bilim veri seti kaydı.",
                    "mission": mission,
                    "url": f"https://osdr.nasa.gov/bio/repo/search?q={quote_plus(clean_q)}",
                })

            if not items:
                items = self._catalog_fallback_items(clean_q, limit=limit, source_tag="NASA OSDR / PSI Archive")
                status_tag = "cached_live"
            else:
                status_tag = "live_online"

            out = {
                "ok": True,
                "source_status": status_tag,
                "query_used": clean_q,
                "count": len(items),
                "items": items,
                "ts": now,
            }
            with self._cache_lock:
                self._cache[cache_key] = out
            self._save_cache()
            return out
        except Exception as exc:
            with self._cache_lock:
                if cache_key in self._cache and self._cache[cache_key].get("items"):
                    fallback = dict(self._cache[cache_key])
                    fallback["source_status"] = "offline_cache"
                    return fallback
            fb_items = self._catalog_fallback_items(clean_q, limit=limit, source_tag="NASA OSDR / PSI Verified Archive")
            return {
                "ok": True,
                "source_status": "offline_cache",
                "query_used": clean_q,
                "count": len(fb_items),
                "items": fb_items,
                "note": str(exc),
            }

    def scrape_scientific_url(self, url: str) -> Dict[str, Any]:
        """
        Kullanıcının verdiği herhangi bir NASA / bilimsel web sayfasını, canlı JSON/CSV API'sini veya PDF bağlantısını
        SSRF ve DNS Rebinding kalkanı altında güvenle okur, metne çevirir ve yanma parametrelerini çıkarır.
        """
        is_safe, clean_or_err = validate_external_url_strict(url)
        if not is_safe:
            return {"ok": False, "error": clean_or_err}
        clean_url = clean_or_err

        try:
            # Yönlendirmeleri (301/302) her adımda SSRF kalkanından geçirerek doğrula (DNS Rebinding / Redirect SSRF engeli)
            current_url = clean_url
            resp = None
            for _ in range(4):
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

            # Bellek taşması (DoS) koruması: En fazla 10 MB veri oku
            max_bytes = 10 * 1024 * 1024
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

            raw_content = b"".join(chunks_buf)

            if "application/pdf" in ctype or current_url.lower().endswith(".pdf"):
                doc_res = self.extract_document_bytes(raw_content, filename=current_url.split("/")[-1] or "remote.pdf")
                if doc_res.get("ok"):
                    parsed_sim = extract_sim_params_from_text_or_table(doc_res.get("content", ""), doc_res.get("filename", "remote.pdf"))
                    doc_res["url"] = current_url
                    doc_res["title"] = doc_res.get("filename", current_url)
                    doc_res["extracted_sim_params"] = parsed_sim["extracted_sim_params"]
                    doc_res["extracted_fields"] = parsed_sim["extracted_fields"]
                    doc_res["extraction_notes"] = parsed_sim["notes"]
                return doc_res

            raw_txt_decoded = raw_content.decode(encoding, errors="replace")

            # JSON veya CSV doğrudan veri akışıysa ham metni koru
            if "application/json" in ctype or "text/csv" in ctype or current_url.lower().endswith((".json", ".csv")):
                raw_txt = raw_txt_decoded.strip()
                parsed_sim = extract_sim_params_from_text_or_table(raw_txt, current_url.split("/")[-1] or "feed.json")
                return {
                    "ok": True,
                    "title": f"Canlı Veri Akışı ({current_url.split('/')[-1] or current_url})",
                    "url": current_url,
                    "char_count": len(raw_txt),
                    "content": raw_txt[:22000],
                    "extracted_sim_params": parsed_sim["extracted_sim_params"],
                    "extracted_fields": parsed_sim["extracted_fields"],
                    "extraction_notes": parsed_sim["notes"],
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
            }
        except Exception as exc:
            return {"ok": False, "error": f"Web sayfası okunamadı: {exc}"}

    def extract_document_bytes(self, raw_bytes: bytes, filename: str) -> Dict[str, Any]:
        """Yüklenen PDF, CSV, JSON veya TXT bilimsel belgelerinden bellek korumalı metin ve parametre çıkarır."""
        if len(raw_bytes) > 25 * 1024 * 1024:
            return {"ok": False, "error": "Güvenlik sınırı: Dosya boyutu 25 MB limitini aşıyor."}
        ext = filename.lower().rsplit(".", 1)[-1] if "." in filename else "txt"
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
            else:
                try:
                    full_text = raw_bytes.decode("utf-8")
                except UnicodeDecodeError:
                    full_text = raw_bytes.decode("latin-1", errors="ignore")
                pages_count = 1

            parsed_sim = extract_sim_params_from_text_or_table(full_text, filename)
            return {
                "ok": True,
                "filename": filename,
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

                title = str(scraped.get("title") or target)
                content = str(scraped.get("content") or "")
                sim_p = scraped.get("extracted_sim_params") or {}
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
                    "title": title[:140],
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

            parsed = extract_sim_params_from_text_or_table(f"{title}\n{abstract}", item_id)
            sim_p = parsed["extracted_sim_params"]

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
                "extracted_fields": parsed["extracted_fields"],
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
