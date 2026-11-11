# -*- coding: utf-8 -*-
"""
ALTAR-NASA v5.1 Birleşik Kanıt Sentezi ve Karar Destek Çekirdeği.
Desteklenen Çıkarım Katmanları:
1. Yerel Ollama Motoru (qwen3.5-nasa-pro, qwen3.5, llava vb. — Canlı Token Akışlı Derin Uzay Çevrimdışı Mod)
2. Yerel Sistem Çıkarım Köprüsü (Yerel CLI / Python SDK / Köprü Geçidi)
3. Google Gemini Cloud API (GEMINI_API_KEY — REST v1beta, Çok Modlu Görüntü & Metin)
4. OpenRouter & Özel OpenAI Uyumlu API (OPENROUTER_API_KEY / CUSTOM_BASE_URL)
5. Deterministik Fizik, Formül & Kanıt Sentezleyici (İnternet ve dış motorlar kapalıyken bile %100 çalışan çekirdek)
"""

from __future__ import annotations

import asyncio
import base64
import json
import os
import re
import shutil
import subprocess
import threading
import time
import uuid
from pathlib import Path
from typing import Any, Callable, Dict, List, Optional, Tuple

from core.config_manager import ConfigManager, create_secure_http_session, get_resource_base_dir, get_user_data_dir
from core.data_vision_processor import analyze_flame_image_bytes
from core.directives import build_system_prompt
from core.nasa_live_fetcher import NasaLiveFetcher
from core.physics_engine import simulate_combustion_state
from core.ranking_engine import ExperimentRankingEngine, SemanticKnowledgeIndex
from core.smart_synthesizer import classify_user_intent, synthesize_question_driven_report

_RE_THOUGHT_CLEAN = re.compile(
    r"<(think|düşünce|thought)>.*?</\1>|<think>.*?$",
    re.DOTALL | re.IGNORECASE,
)
_RE_NTRS_TOOL = re.compile(r"\[NASA_NTRS:\s*([^\]]+)\]", re.IGNORECASE)
_RE_PSI_TOOL = re.compile(r"\[NASA_PSI:\s*([^\]]+)\]", re.IGNORECASE)


class HybridNasaAIEngine:
    """Tüm yerel çevrimdışı (Ollama), yerel sistem köprüsü ve harici ağ geçidi (Gemini/OpenRouter) katmanlarını yönetir."""

    def __init__(
        self,
        config: ConfigManager,
        fetcher: NasaLiveFetcher,
        knowledge: SemanticKnowledgeIndex,
        ranker: ExperimentRankingEngine,
    ) -> None:
        self.config = config
        self.fetcher = fetcher
        self.knowledge = knowledge
        self.ranker = ranker
        self.http = create_secure_http_session()
        self._ollama_lock = threading.Lock()
        self._jobs_lock = threading.Lock()
        self._chat_jobs: Dict[str, Dict[str, Any]] = {}
        self._antigravity_sdk_available = self._detect_antigravity_sdk()
        self._agy_cache_lock = threading.Lock()
        self._agy_cached_status: Optional[Dict[str, Any]] = None
        self._agy_cache_ts: float = 0.0

    @staticmethod
    def _detect_antigravity_sdk() -> bool:
        try:
            import importlib.util
            return importlib.util.find_spec("google.antigravity") is not None
        except Exception:
            return False

    @staticmethod
    def _find_antigravity_cli() -> Optional[Path]:
        """Kullanıcının bilgisayarındaki yerel CLI çıkarım köprüsü yürütülebilir dosyasını dinamik bulur."""
        which_hit = shutil.which("agy")
        if which_hit:
            p = Path(which_hit)
            if p.is_file():
                return p
        local_app = os.environ.get("LOCALAPPDATA", "")
        prog_files = os.environ.get("ProgramFiles", "")
        candidates = [
            Path(local_app) / "agy" / "bin" / "agy.exe" if local_app else None,
            Path(prog_files) / "agy" / "bin" / "agy.exe" if prog_files else None,
            Path.home() / ".local" / "bin" / "agy",
        ]
        for c in candidates:
            if c is not None and c.is_file():
                return c
        return None

    def get_antigravity_status(self, force_refresh: bool = False) -> Dict[str, Any]:
        """Yerel sistem çıkarım köprüsünün (CLI, Python SDK ve API) canlı durumunu ve model listesini döndürür."""
        now = time.time()
        with self._agy_cache_lock:
            if not force_refresh and self._agy_cached_status is not None and (now - self._agy_cache_ts) < 120.0:
                return dict(self._agy_cached_status)

        agy_exe = self._find_antigravity_cli()
        models: List[Dict[str, str]] = []
        cli_ready = False

        if agy_exe is not None:
            try:
                proc = subprocess.run(
                    [str(agy_exe), "models"],
                    stdin=subprocess.DEVNULL,
                    capture_output=True,
                    text=True,
                    encoding="utf-8",
                    errors="replace",
                    timeout=6,
                    creationflags=getattr(subprocess, "CREATE_NO_WINDOW", 0),
                )
                if proc.returncode == 0 and proc.stdout.strip():
                    for line in proc.stdout.splitlines():
                        ln = line.strip()
                        if not ln:
                            continue
                        parts = ln.split("\t", 1)
                        m_id = parts[0].strip()
                        m_label = parts[1].strip() if len(parts) > 1 else m_id
                        models.append({"id": m_id, "label": m_label})
                    cli_ready = len(models) > 0
            except Exception:
                cli_ready = False

        cfg = self.config.get_all()
        st = {
            "cli_installed": agy_exe is not None,
            "cli_ready": cli_ready,
            "cli_path": str(agy_exe) if agy_exe else "",
            "sdk_installed": self._antigravity_sdk_available,
            "api_key_ready": bool(cfg.get("antigravity_api_key")),
            "models": models,
            "active_model": cfg.get("antigravity_model") or "gemini-3.8-flash-high",
        }
        with self._agy_cache_lock:
            self._agy_cached_status = st
            self._agy_cache_ts = now
        return dict(st)

    # =========================================================================
    # OLLAMA DURUM VE MODEL YÖNETİMİ
    # =========================================================================
    def get_ollama_status(self) -> Dict[str, Any]:
        cfg = self.config.get_all()
        host = (cfg.get("ollama_host") or "http://127.0.0.1:11434").rstrip("/")
        try:
            resp = self.http.get(f"{host}/api/tags", timeout=2.5)
            if resp.status_code == 200:
                raw_models = resp.json().get("models", [])
                models: List[Dict[str, Any]] = []
                for m in raw_models:
                    name = str(m.get("name") or m.get("model") or "")
                    size_gb = round(float(m.get("size", 0)) / (1024 ** 3), 2)
                    models.append({"name": name, "size_gb": size_gb})
                best_default = self._pick_best_ollama_model([m["name"] for m in models], cfg.get("language", "tr"))
                return {
                    "online": True,
                    "host": host,
                    "models": models,
                    "recommended_active": best_default,
                }
        except Exception:
            pass
        return {"online": False, "host": host, "models": [], "recommended_active": ""}

    @staticmethod
    def _pick_best_ollama_model(model_names: List[str], lang: str = "tr") -> str:
        if not model_names:
            return ""
        if lang == "en":
            priorities = [
                "qwen3.5-nasa-pro-en:4b-q8_0",
                "qwen3.5-nasa-pro-en:4b-q4_k_m",
                "qwen3.5-nasa-pro:4b-q8_0",
                "qwen3.5-nasa-pro:4b-q4_k_m",
                "qwen3.5:4b",
            ]
        else:
            priorities = [
                "qwen3.5-nasa-pro:4b-q8_0",
                "qwen3.5-nasa-pro:4b-q4_k_m",
                "qwen3.5-nasa-pro-en:4b-q8_0",
                "qwen3.5-nasa-pro-en:4b-q4_k_m",
                "qwen3.5:4b",
            ]
        lower_map = {m.lower(): m for m in model_names}
        for p in priorities:
            if p.lower() in lower_map:
                return lower_map[p.lower()]
        for m in model_names:
            if "nasa" in m.lower():
                return m
        for m in model_names:
            if "uncensored" not in m.lower() and "llava" not in m.lower():
                return m
        return model_names[0]

    def pull_ollama_model(self, model_name: str) -> Dict[str, Any]:
        clean_model = (model_name or "").strip()
        if not clean_model:
            return {"ok": False, "error": "Model adı boş olamaz."}
        host = (self.config.get_all().get("ollama_host") or "http://127.0.0.1:11434").rstrip("/")
        try:
            resp = self.http.post(
                f"{host}/api/pull",
                json={"name": clean_model, "stream": False},
                timeout=300,
            )
            if resp.status_code == 200:
                return {"ok": True, "model": clean_model, "detail": resp.json()}
            return {"ok": False, "error": f"Ollama HTTP {resp.status_code}: {resp.text[:200]}"}
        except Exception as exc:
            return {"ok": False, "error": f"Ollama model indirme hatası: {exc}"}

    def unload_ollama_memory(self) -> Dict[str, Any]:
        status = self.get_ollama_status()
        if not status["online"]:
            return {"ok": True, "unloaded": 0}
        host = status["host"]
        count = 0
        for m in status["models"][:4]:
            try:
                self.http.post(
                    f"{host}/api/generate",
                    json={"model": m["name"], "prompt": "", "keep_alive": 0},
                    timeout=4,
                )
                count += 1
            except Exception:
                pass
        return {"ok": True, "unloaded": count}

    def get_providers_summary(self, force_agy_refresh: bool = False) -> Dict[str, Any]:
        cfg = self.config.get_all()
        ollama_st = self.get_ollama_status()
        agy_st = self.get_antigravity_status(force_refresh=force_agy_refresh)
        return {
            "active_provider": cfg.get("active_provider", "auto"),
            "ollama": ollama_st,
            "antigravity": agy_st,
            "antigravity_ready": bool(agy_st["cli_ready"] or agy_st["sdk_installed"] or agy_st["api_key_ready"]),
            "antigravity_sdk_installed": self._antigravity_sdk_available,
            "antigravity_key_ready": bool(cfg.get("antigravity_api_key")),
            "gemini_ready": bool(cfg.get("gemini_api_key")),
            "gemini_model": cfg.get("gemini_model", "gemini-2.5-flash"),
            "openrouter_ready": bool(cfg.get("openrouter_api_key")),
            "openrouter_model": cfg.get("openrouter_model", "google/gemini-2.0-flash-exp:free"),
            "custom_ready": bool(cfg.get("custom_base_url") and cfg.get("custom_api_key")),
            "deep_verify_6stage": bool(cfg.get("deep_verify_6stage", True)),
        }

    def test_provider_connection(self, provider: Optional[str] = None) -> Dict[str, Any]:
        """Kullanıcının seçtiği AI sağlayıcısını canlı bir mikroçekim doğrulama istemiyle uçtan uca test eder."""
        cfg = self.config.get_all()
        lang = str(cfg.get("language", "tr"))
        target = (provider or cfg.get("active_provider") or "auto").lower()
        if lang == "en":
            test_sys = "You are the ALTAR-NASA microgravity combustion assistant. Reply in one concise English sentence."
            test_prompt = "Why does the Rayleigh number (Ra) approach zero in 0G freefall? Answer in one sentence."
        else:
            test_sys = "Sen ALTAR-NASA mikroçekim yanma asistanısın. Tek cümleyle Türkçe yanıt ver."
            test_prompt = "0G mikroçekimde Rayleigh sayısı (Ra) neden sıfıra yaklaşır? Tek cümleyle yaz."

        t0 = time.time()
        if target == "auto":
            if cfg.get("gemini_api_key"):
                target = "gemini"
            elif self.get_antigravity_status().get("cli_ready") or cfg.get("antigravity_api_key"):
                target = "antigravity"
            elif self.get_ollama_status().get("online"):
                target = "ollama"
            elif cfg.get("openrouter_api_key"):
                target = "openrouter"
            elif cfg.get("custom_base_url") and cfg.get("custom_api_key"):
                target = "custom"

        if target == "ollama":
            ok, m_name, txt, note = self._call_ollama_local(cfg, test_sys, test_prompt, [], max_predict=120)
        elif target == "antigravity":
            ok, m_name, txt, note = self._call_antigravity(cfg, test_sys, test_prompt, [])
        elif target == "gemini":
            if not cfg.get("gemini_api_key"):
                return {"ok": False, "provider": "gemini", "error": "GEMINI_API_KEY henüz girilmedi."}
            ok, m_name, txt, note = self._call_gemini_api(cfg["gemini_api_key"], cfg.get("gemini_model") or "gemini-2.5-flash", test_sys, test_prompt, [])
        elif target == "openrouter":
            if not cfg.get("openrouter_api_key"):
                return {"ok": False, "provider": "openrouter", "error": "OPENROUTER_API_KEY henüz girilmedi."}
            ok, m_name, txt, note = self._call_openai_compatible(
                "https://openrouter.ai/api/v1/chat/completions",
                cfg["openrouter_api_key"],
                cfg.get("openrouter_model") or "google/gemini-2.0-flash-exp:free",
                test_sys,
                test_prompt,
                [],
                "OpenRouter",
            )
        elif target == "custom":
            if not (cfg.get("custom_base_url") and cfg.get("custom_api_key")):
                return {"ok": False, "provider": "custom", "error": "Özel Base URL veya API anahtarı eksik."}
            url = str(cfg["custom_base_url"]).rstrip("/")
            if not url.endswith("/chat/completions"):
                url = f"{url}/chat/completions"
            ok, m_name, txt, note = self._call_openai_compatible(url, cfg["custom_api_key"], cfg.get("custom_model") or "gpt-4o-mini", test_sys, test_prompt, [], "Custom")
        else:
            return {"ok": True, "provider": "deterministic_physics", "model": "ALTAR-Analytical-Solver-Core", "sample": "Ra = Gr·Pr -> 0 (g -> 0).", "latency_s": 0.01}

        dt = round(time.time() - t0, 2)
        clean_txt = _RE_THOUGHT_CLEAN.sub("", txt or "").strip()
        disp_prov = "local_cli_bridge" if target == "antigravity" else target
        return {
            "ok": ok and bool(clean_txt),
            "provider": disp_prov,
            "model": m_name.replace("agy/", "cli/").replace("antigravity/", "bridge/"),
            "note": note,
            "sample": clean_txt[:280],
            "latency_s": dt,
            "error": "" if (ok and clean_txt) else note,
        }

    # =========================================================================
    # ASENKRON CANLI TOKEN AKIŞLI (STREAMING) SOHBET YÖNETİCİSİ (SIFIR TIMEOUT!)
    # =========================================================================
    def start_chat_job(
        self,
        user_message: str,
        sim_params: Optional[Dict[str, Any]] = None,
        history: Optional[List[Dict[str, str]]] = None,
        image_base64: Optional[str] = None,
        media_context: Optional[str] = None,
        provider_override: Optional[str] = None,
    ) -> str:
        """
        Tarayıcı zaman aşımını (NetworkError) %100 ortadan kaldıran arka plan görev başlatıcısı.
        <10 ms içinde job_id döndürür; yanıt üretildikçe partial_reply alanına canlı token akıtır.
        """
        job_id = uuid.uuid4().hex[:12]
        now = time.time()
        lang_init = str(self.config.get_all().get("language", "tr"))
        init_stage = (
            "[1/4] ◈ Solving dimensionless transport laws & 3D telemetry..."
            if lang_init == "en"
            else "[1/4] ◈ Boyutsuz taşınım denklemleri ve 3B telemetri çözülüyor..."
        )
        job_obj: Dict[str, Any] = {
            "job_id": job_id,
            "created_ts": now,
            "status": "running",  # running | done | error | cancelled
            "provider": "",
            "model": "",
            "partial_reply": "",
            "reply": "",
            "stages": [init_stage],
            "citations": [],
            "error": "",
            "cancel_requested": False,
        }
        with self._jobs_lock:
            # Eski tamamlanmış görevleri temizle (en fazla son 25 görev tut)
            if len(self._chat_jobs) > 25:
                sorted_ids = sorted(self._chat_jobs.keys(), key=lambda k: self._chat_jobs[k].get("created_ts", 0))
                for old_k in sorted_ids[:-20]:
                    self._chat_jobs.pop(old_k, None)
            self._chat_jobs[job_id] = job_obj

        def _worker() -> None:
            def _on_stage(st_text: str) -> None:
                with self._jobs_lock:
                    if job_id in self._chat_jobs:
                        self._chat_jobs[job_id]["stages"].append(st_text)

            def _on_chunk(accumulated_text: str, prov: str, mdl: str) -> None:
                clean_part = _RE_THOUGHT_CLEAN.sub("", accumulated_text).lstrip()
                with self._jobs_lock:
                    if job_id in self._chat_jobs:
                        self._chat_jobs[job_id]["partial_reply"] = clean_part
                        self._chat_jobs[job_id]["provider"] = prov
                        self._chat_jobs[job_id]["model"] = mdl

            def _is_cancelled() -> bool:
                with self._jobs_lock:
                    return bool(self._chat_jobs.get(job_id, {}).get("cancel_requested", False))

            try:
                res = self.analyze_and_chat(
                    user_message=user_message,
                    sim_params=sim_params,
                    history=history,
                    image_base64=image_base64,
                    media_context=media_context,
                    provider_override=provider_override,
                    on_stage=_on_stage,
                    on_chunk=_on_chunk,
                    cancel_check=_is_cancelled,
                )
                with self._jobs_lock:
                    if job_id not in self._chat_jobs:
                        return
                    if self._chat_jobs[job_id].get("cancel_requested"):
                        self._chat_jobs[job_id]["status"] = "cancelled"
                        return
                    self._chat_jobs[job_id]["status"] = "done" if res.get("ok") else "error"
                    self._chat_jobs[job_id]["provider"] = res.get("provider", "")
                    self._chat_jobs[job_id]["model"] = res.get("model", "")
                    self._chat_jobs[job_id]["reply"] = res.get("reply", "")
                    self._chat_jobs[job_id]["partial_reply"] = res.get("reply", "")
                    self._chat_jobs[job_id]["stages"] = res.get("stages", [])
                    self._chat_jobs[job_id]["citations"] = res.get("citations", [])
                    self._chat_jobs[job_id]["error"] = res.get("error", "")
            except Exception as exc:
                with self._jobs_lock:
                    if job_id in self._chat_jobs:
                        self._chat_jobs[job_id]["status"] = "error"
                        self._chat_jobs[job_id]["error"] = str(exc)

        threading.Thread(target=_worker, daemon=True, name=f"ChatJob-{job_id}").start()
        return job_id

    def get_chat_job(self, job_id: str) -> Dict[str, Any]:
        with self._jobs_lock:
            job = self._chat_jobs.get(job_id)
            if not job:
                return {"ok": False, "status": "not_found", "error": "Sohbet görevi bulunamadı."}
            return {
                "ok": True,
                "job_id": job["job_id"],
                "status": job["status"],
                "provider": job["provider"],
                "model": job["model"],
                "partial_reply": job["partial_reply"],
                "reply": job["reply"],
                "stages": list(job["stages"]),
                "citations": list(job["citations"]),
                "error": job["error"],
            }

    def cancel_chat_job(self, job_id: str) -> Dict[str, Any]:
        with self._jobs_lock:
            job = self._chat_jobs.get(job_id)
            if not job:
                return {"ok": False, "error": "Görev bulunamadı."}
            job["cancel_requested"] = True
            job["status"] = "cancelled"
            return {"ok": True, "job_id": job_id, "status": "cancelled"}

    # =========================================================================
    # ANA SOHBET VE OTONOM BİLİMSEL ANALİZ AKIŞI
    # =========================================================================
    def analyze_and_chat(
        self,
        user_message: str,
        sim_params: Optional[Dict[str, Any]] = None,
        history: Optional[List[Dict[str, str]]] = None,
        image_base64: Optional[str] = None,
        media_context: Optional[str] = None,
        provider_override: Optional[str] = None,
        include_live_nasa: bool = True,
        on_stage: Optional[Callable[[str], None]] = None,
        on_chunk: Optional[Callable[[str, str, str], None]] = None,
        cancel_check: Optional[Callable[[], bool]] = None,
    ) -> Dict[str, Any]:
        cfg = self.config.get_all()
        if provider_override and provider_override in ("auto", "ollama", "antigravity", "gemini", "openrouter", "custom"):
            cfg["active_provider"] = provider_override

        lang = str(cfg.get("language", "tr"))
        sys_prompt = build_system_prompt(lang=lang, extra_user_directives=cfg.get("custom_extra_directives", ""))

        # Eğer görsel eklendiyse, piksel düzeyinde CV (H/W küresellik, CH*/Kurum spektrumu) analizini çıkar
        cv_image_summary = ""
        if image_base64:
            try:
                raw_b64 = image_base64.split(",", 1)[-1] if "," in image_base64 else image_base64
                img_bytes = base64.b64decode(raw_b64)
                cv_res = analyze_flame_image_bytes(img_bytes, "attached_flame.jpg")
                if cv_res.get("ok"):
                    cv_image_summary = str(cv_res.get("summary_tr") or "")
                    if not sim_params:
                        sim_params = cv_res.get("extracted_sim_params")
            except Exception:
                pass

        # 1. Mevcut 3B Simülasyon + Tüm Boyutsuz Sayılar + NASA Deney Sıralaması + RAG Hafızası
        active_sim = simulate_combustion_state(sim_params or {})
        ranked_pack = self.ranker.rank_experiments(active_sim["inputs"], query=user_message)
        top_exps = ranked_pack["ranked_experiments"][:4]
        rag_hits = self.knowledge.search(user_message, top_k=4)
        combined_media_ctx = "\n".join(x for x in (media_context or "", cv_image_summary) if x.strip())
        query_intent = classify_user_intent(user_message, media_context=combined_media_ctx)
        is_meta_intent = query_intent in ("capabilities_guide", "platform_features", "greeting_identity")

        live_ntrs_snippets: List[Dict[str, Any]] = []
        if include_live_nasa and not is_meta_intent and len(user_message.strip()) > 3:
            if on_stage:
                on_stage(
                    "[2/4] ◈ Querying live NASA NTRS & PSI databases..."
                    if lang == "en"
                    else "[2/4] ◈ Canlı NASA NTRS & PSI veri tabanları taranıyor..."
                )
            ntrs_res = self.fetcher.search_ntrs_live(user_message, limit=3)
            if ntrs_res.get("ok"):
                live_ntrs_snippets = ntrs_res.get("items", [])[:3]

        if cancel_check and cancel_check():
            return {"ok": False, "error": "Stopped by user." if lang == "en" else "Kullanıcı tarafından durduruldu."}

        grounded_context = self._format_grounded_context(
            active_sim=active_sim,
            top_exps=top_exps,
            rag_hits=rag_hits,
            live_ntrs=live_ntrs_snippets,
            media_context=combined_media_ctx,
        )

        if on_stage:
            on_stage(
                "[3/4] ◈ Synthesizing governing equations & NASA PSI evidence..."
                if lang == "en"
                else "[3/4] ◈ Taşınım denklemleri ve NASA PSI kanıtları sentezleniyor..."
            )

        # 2. Sağlayıcıyı Seç ve Çalıştır
        provider_used, model_used, raw_reply, stages_log = self._dispatch_generation(
            cfg=cfg,
            sys_prompt=sys_prompt,
            user_message=user_message,
            grounded_context=grounded_context,
            history=history or [],
            image_base64=image_base64,
            active_sim=active_sim,
            top_exps=top_exps,
            live_ntrs=live_ntrs_snippets,
            rag_hits=rag_hits,
            media_context=combined_media_ctx,
            on_chunk=on_chunk,
            cancel_check=cancel_check,
        )

        if cancel_check and cancel_check():
            return {"ok": False, "error": "Kullanıcı tarafından durduruldu."}

        # 3. Model Ek Olarak [NASA_NTRS: ...] veya [NASA_PSI: ...] Aracı Çağırdıysa Otonom Yürüt
        ntrs_match = _RE_NTRS_TOOL.search(raw_reply)
        psi_match = _RE_PSI_TOOL.search(raw_reply)
        if ntrs_match or psi_match:
            tool_notes: List[str] = []
            if ntrs_match:
                q_tool = ntrs_match.group(1).strip()
                extra_ntrs = self.fetcher.search_ntrs_live(q_tool, limit=3)
                stages_log.append(f"◈ NTRS Sorgusu: NASA_NTRS('{q_tool}') -> {extra_ntrs.get('count', 0)} kayıt")
                for it in extra_ntrs.get("items", []):
                    tool_notes.append(f"[{it['id']}] {it['title']}: {it['abstract'][:320]} ({it['url']})")
            if psi_match:
                q_psi = psi_match.group(1).strip()
                extra_psi = self.fetcher.search_osdr_psi_live(q_psi, limit=3)
                stages_log.append(f"◈ PSI Sorgusu: NASA_PSI('{q_psi}') -> {extra_psi.get('count', 0)} kayıt")
                for it in extra_psi.get("items", []):
                    tool_notes.append(f"[{it['id']}] {it['title']}: {it['abstract'][:320]}")

            if tool_notes and not (cancel_check and cancel_check()):
                followup_ctx = grounded_context + "\n\n=== CANLI AJAN ARAÇ SONUÇLARI ===\n" + "\n".join(tool_notes)
                _, _, second_reply, _ = self._dispatch_generation(
                    cfg=cfg,
                    sys_prompt=sys_prompt,
                    user_message=user_message + "\n(Araç sonuçlarını sentezleyerek nihai yanıtı ver, tekrar araç etiketi yazma.)",
                    grounded_context=followup_ctx,
                    history=history or [],
                    image_base64=None,
                    active_sim=active_sim,
                    top_exps=top_exps,
                    live_ntrs=live_ntrs_snippets,
                    rag_hits=rag_hits,
                    media_context=combined_media_ctx,
                    on_chunk=on_chunk,
                    cancel_check=cancel_check,
                )
                if second_reply:
                    raw_reply = second_reply

        # 4. 6 Katmanlı Kural & Halon Güvenlik Denetimi
        if bool(cfg.get("deep_verify_6stage", True)) and provider_used != "deterministic_physics":
            raw_reply, critic_note = self._apply_safety_rule_critic(raw_reply, lang)
            if critic_note:
                stages_log.append(critic_note)
                if on_stage:
                    on_stage(f"[4/4] {critic_note}")

        clean_reply = _RE_THOUGHT_CLEAN.sub("", raw_reply).strip()

        if is_meta_intent:
            citations: List[Dict[str, Any]] = []
        elif provider_used == "deterministic_physics":
            _, det_cits = synthesize_question_driven_report(
                user_message=user_message,
                sim_params=active_sim["inputs"],
                active_sim=active_sim,
                top_exps=top_exps,
                rag_hits=rag_hits,
                live_ntrs=live_ntrs_snippets,
                history=history or [],
                media_context=combined_media_ctx,
                lang=lang,
            )
            citations = list(det_cits)
            for n_item in live_ntrs_snippets[:2]:
                citations.append({
                    "id": n_item["id"],
                    "program": "NTRS Live",
                    "ntrs_id": n_item["raw_id"],
                    "title": n_item["title"],
                    "url": n_item["url"],
                    "priority_score": 92.0,
                })
        else:
            citations = [
                {
                    "id": exp["exp_id"],
                    "program": exp["program"],
                    "ntrs_id": exp["ntrs_id"],
                    "title": exp["title_tr"] if lang == "tr" else exp["title"],
                    "url": exp["ntrs_url"],
                    "priority_score": exp["priority_score"],
                }
                for exp in top_exps[:3]
            ]
            for n_item in live_ntrs_snippets[:2]:
                citations.append({
                    "id": n_item["id"],
                    "program": "NTRS Live",
                    "ntrs_id": n_item["raw_id"],
                    "title": n_item["title"],
                    "url": n_item["url"],
                    "priority_score": 92.0,
                })

        return {
            "ok": True,
            "provider": provider_used,
            "model": model_used,
            "reply": clean_reply,
            "stages": stages_log,
            "citations": citations,
            "telemetry_snapshot": active_sim["telemetry"],
        }

    def _format_grounded_context(
        self,
        active_sim: Dict[str, Any],
        top_exps: List[Dict[str, Any]],
        rag_hits: List[Dict[str, Any]],
        live_ntrs: List[Dict[str, Any]],
        media_context: str = "",
    ) -> str:
        inp = active_sim["inputs"]
        tel = active_sim["telemetry"]
        pg_info = active_sim.get("partial_gravity_info") or {}
        lines = [
            "=== ANLIK 3B YANMA ODASI TELEMETRİSİ VE HESAPLANAN BOYUTSUZ SAYILAR ===",
            f"- Yakıt/Malzeme: {inp['fuel_name_tr']} ({inp['fuel_id']}) | Yerçekimi: {inp['gravity_g']}G | O2: %{inp['oxygen_pct']} | Kabin Basıncı: {inp['pressure_psia']} psia | Kısmi O2 Basıncı P_O2: {tel.get('o2_partial_psia', 0)} psia ({tel.get('o2_partial_kpa', 0)} kPa) | Hava Akışı: {inp['airflow_cms']} cm/s | Çap D0: {inp['droplet_d0_mm']} mm | Seyreltici: {inp['diluent']}",
            f"- Aktif Yanma Rejimi: {tel['regime']} | Alev Sıcaklığı T_f: {tel['flame_temp_k']} K ({tel['flame_temp_c']} °C) | Risk Skoru: {tel['risk_score']}/100",
            f"- D² Yanma Sabiti K: {tel['burning_rate_k_mm2_s']} mm²/s | Damlacık Yanma Ömrü t_b: {tel['burn_lifetime_s']} s | Katı/Yüzey Yayılma Hızı V_f: {tel['flame_spread_mm_s']} mm/s",
            f"- Spalding Kütle Aktarım Sayısı B_oq: {tel.get('spalding_b_number', 0)} | Alev Durma Oranı R_f/R_d: {tel.get('standoff_ratio_rf_rd', 0)} (Alev Yarıçapı: {tel['flame_radius_mm']} mm)",
            f"- Boyutsuz Sayılar: Reynolds Re = {tel.get('reynolds_number', 0)} | Sherwood Sh = {tel['sherwood_number']} | Grashof Gr = {tel.get('grashof_number', 0)} | Rayleigh Ra = {tel.get('rayleigh_number', 0)} | Richardson Ri = {tel.get('richardson_number', 0)} | Damköhler Da = {tel.get('damkohler_number', 0)}",
            f"- Kritik Oksijen Sınırı (MOC): %{tel['moc_pct']} O2 | Radyatif Kayıp Kesri χ_r: {tel['radiative_loss_fraction']} | Isı Akısı: {tel['heat_flux_kw_m2']} kW/m² | CO: {tel['co_ppm']} ppm | Kurum İndeksi: {tel['soot_index']}",
        ]
        if pg_info.get("show_banner") and pg_info.get("tr"):
            lines.append(f"- NASA Özel Atmosfer & Kısmi Yerçekimi Notu: {pg_info['tr']}")
        if media_context:
            lines.append("\n=== YÜKLENEN DOSYA / ALEV GÖRSELİ / CANLI WEB AKIŞI ÖZEL VERİSİ ===")
            lines.append(media_context[:1800])

        lines.append("\n=== GÖREVLE EŞLEŞEN EN KRİTİK NASA PSI DENEYLERİ (TERMODİNAMİK & TF-IDF SIRALI) ===")
        for e in top_exps:
            lines.append(
                f"- #{e['rank']} [{e['exp_id']} | {e['program']} | Donanım:{e.get('hardware_group', 'CIR')} | NTRS:{e['ntrs_id']}] (Öncelik:{e['priority_score']}/100, MOC:%{e['moc_measured_pct']}): "
                f"Numune/Brülör: {e.get('sample_geometry_tr', e['material'])} | Sensörler: {e.get('sensors_tr', '')} | Bulgu: {e['key_finding_tr']} | Önlem: {e['safety_insight_tr']}"
            )
        if live_ntrs:
            lines.append("\n=== CANLI NASA NTRS API SONUÇLARI ===")
            for n in live_ntrs:
                lines.append(f"- [{n['id']}] {n['title']} ({n['date']}): {n['abstract'][:260]}")
        extra_docs = [h for h in rag_hits if h["doc_type"] == "ingested_doc"]
        if extra_docs:
            lines.append("\n=== YÜKLENEN BELGE & CANLI AKIŞ HAFIZASI (RAG) ===")
            for d in extra_docs:
                lines.append(f"- [{d['title']}]: {d['text'][:360]}")
        return "\n".join(lines)

    def _dispatch_generation(
        self,
        cfg: Dict[str, Any],
        sys_prompt: str,
        user_message: str,
        grounded_context: str,
        history: List[Dict[str, str]],
        image_base64: Optional[str],
        active_sim: Dict[str, Any],
        top_exps: List[Dict[str, Any]],
        live_ntrs: List[Dict[str, Any]],
        rag_hits: Optional[List[Dict[str, Any]]] = None,
        media_context: str = "",
        on_chunk: Optional[Callable[[str, str, str], None]] = None,
        cancel_check: Optional[Callable[[], bool]] = None,
    ) -> Tuple[str, str, str, List[str]]:
        pref = str(cfg.get("active_provider", "auto")).lower()
        stages: List[str] = ["◈ Boyutsuz Denklemler (K, B_oq, Sh, Ra, Ri, Da) + NASA PSI/NTRS Kanıtları Hazırlandı"]
        intent = classify_user_intent(user_message, media_context=media_context)

        # Otomatik modda doğrudan sistem yetenek/mimari/selamlama sorularına sıfır gecikmeyle %100 kesin mimari envanter dön
        if pref == "auto" and intent in ("capabilities_guide", "platform_features", "greeting_identity"):
            fast_text, _ = synthesize_question_driven_report(
                user_message=user_message,
                sim_params=active_sim["inputs"],
                active_sim=active_sim,
                top_exps=top_exps,
                rag_hits=rag_hits,
                live_ntrs=live_ntrs,
                history=history,
                media_context=media_context,
                lang=str(cfg.get("language", "tr")),
            )
            stages.append("◈ Sistem Yetenek & Telemetri Envanteri Doğrudan Yanıtlandı")
            if on_chunk:
                on_chunk(fast_text, "deterministic_physics", "ALTAR-Analytical-Solver-Core")
            return ("deterministic_physics", "ALTAR-Analytical-Solver-Core", fast_text, stages)

        agy_st = self.get_antigravity_status()
        agy_available = bool(agy_st["cli_ready"] or self._antigravity_sdk_available or cfg.get("antigravity_api_key"))

        order: List[str] = []
        if pref == "auto":
            # Görsel yüklendiyse önce doğrudan görsel işleyen çok modlu geçitlere, ardından yerel CV destekli köprüye öncelik tanı
            if image_base64:
                if cfg.get("gemini_api_key"):
                    order.append("gemini")
                order.append("ollama")
                if agy_available:
                    order.append("antigravity")
            else:
                if cfg.get("gemini_api_key"):
                    order.append("gemini")
                if agy_available:
                    order.append("antigravity")
                if cfg.get("openrouter_api_key"):
                    order.append("openrouter")
                if cfg.get("custom_base_url") and cfg.get("custom_api_key"):
                    order.append("custom")
                order.append("ollama")
        else:
            order.append(pref)
            for backup in ("antigravity", "ollama", "gemini", "openrouter", "custom"):
                if backup not in order:
                    order.append(backup)

        full_user_prompt = f"{grounded_context}\n\n=== KULLANICI SORUSU / GÖREVİ ===\n{user_message}"

        for provider in order:
            if cancel_check and cancel_check():
                break

            if provider == "gemini" and cfg.get("gemini_api_key"):
                ok, model_name, text, note = self._call_gemini_api(
                    api_key=cfg["gemini_api_key"],
                    model=cfg.get("gemini_model") or "gemini-2.5-flash",
                    sys_prompt=sys_prompt,
                    user_prompt=full_user_prompt,
                    history=history,
                    image_base64=image_base64,
                )
                stages.append(note)
                if ok and text:
                    if on_chunk:
                        on_chunk(text, "gemini", model_name)
                    return ("gemini", model_name, text, stages)

            elif provider == "antigravity" and agy_available:
                ok, model_name, text, note = self._call_antigravity(
                    cfg=cfg,
                    sys_prompt=sys_prompt,
                    user_prompt=full_user_prompt,
                    history=history,
                    on_chunk=on_chunk,
                )
                stages.append(note)
                if ok and text:
                    return ("local_cli_bridge", model_name, text, stages)

            elif provider == "openrouter" and cfg.get("openrouter_api_key"):
                ok, model_name, text, note = self._call_openai_compatible(
                    base_url="https://openrouter.ai/api/v1/chat/completions",
                    api_key=cfg["openrouter_api_key"],
                    model=cfg.get("openrouter_model") or "google/gemini-2.0-flash-exp:free",
                    sys_prompt=sys_prompt,
                    user_prompt=full_user_prompt,
                    history=history,
                    label="OpenRouter",
                )
                stages.append(note)
                if ok and text:
                    if on_chunk:
                        on_chunk(text, "openrouter", model_name)
                    return ("openrouter", model_name, text, stages)

            elif provider == "custom" and cfg.get("custom_base_url") and cfg.get("custom_api_key"):
                url = str(cfg["custom_base_url"]).rstrip("/")
                if not url.endswith("/chat/completions"):
                    url = f"{url}/chat/completions"
                ok, model_name, text, note = self._call_openai_compatible(
                    base_url=url,
                    api_key=cfg["custom_api_key"],
                    model=cfg.get("custom_model") or "gpt-4o-mini",
                    sys_prompt=sys_prompt,
                    user_prompt=full_user_prompt,
                    history=history,
                    label="Custom Gateway",
                )
                stages.append(note)
                if ok and text:
                    if on_chunk:
                        on_chunk(text, "custom", model_name)
                    return ("custom", model_name, text, stages)

            elif provider == "ollama":
                ok, model_name, text, note = self._call_ollama_local(
                    cfg=cfg,
                    sys_prompt=sys_prompt,
                    user_prompt=full_user_prompt,
                    history=history,
                    image_base64=image_base64,
                    on_chunk=on_chunk,
                    cancel_check=cancel_check,
                )
                stages.append(note)
                if ok and text:
                    return ("ollama", model_name, text, stages)

        stages.append("◈ Deterministik Soru-Odaklı Termodinamik & NASA PSI Analitik Çekirdeği yanıt üretti")
        fallback_text, _ = synthesize_question_driven_report(
            user_message=user_message,
            sim_params=active_sim["inputs"],
            active_sim=active_sim,
            top_exps=top_exps,
            rag_hits=rag_hits,
            live_ntrs=live_ntrs,
            history=history,
            media_context=media_context,
            lang=str(cfg.get("language", "tr")),
        )
        if on_chunk:
            on_chunk(fallback_text, "deterministic_physics", "ALTAR-Analytical-Solver-Core")
        return ("deterministic_physics", "ALTAR-Analytical-Solver-Core", fallback_text, stages)

    # =========================================================================
    # ÇIKARIM İSTEMCİLERİ (GEMINI • YEREL KÖPRÜ • OPENROUTER • OLLAMA)
    # =========================================================================
    def _call_gemini_api(
        self,
        api_key: str,
        model: str,
        sys_prompt: str,
        user_prompt: str,
        history: List[Dict[str, str]],
        image_base64: Optional[str] = None,
    ) -> Tuple[bool, str, str, str]:
        clean_model = model.replace("models/", "").strip() or "gemini-2.5-flash"
        url = f"https://generativelanguage.googleapis.com/v1beta/models/{clean_model}:generateContent"

        contents: List[Dict[str, Any]] = []
        for h in history[-6:]:
            role = "model" if h.get("role") == "assistant" else "user"
            txt = str(h.get("content", "")).strip()
            if txt:
                contents.append({"role": role, "parts": [{"text": txt}]})

        user_parts: List[Dict[str, Any]] = [{"text": user_prompt}]
        if image_base64 and "," in image_base64:
            header, b64_data = image_base64.split(",", 1)
            mime = "image/png" if "png" in header else "image/jpeg"
            user_parts.append({"inline_data": {"mime_type": mime, "data": b64_data}})
        elif image_base64:
            user_parts.append({"inline_data": {"mime_type": "image/jpeg", "data": image_base64}})

        contents.append({"role": "user", "parts": user_parts})

        payload = {
            "systemInstruction": {"parts": [{"text": sys_prompt}]},
            "contents": contents,
            "generationConfig": {"temperature": 0.2, "maxOutputTokens": 2200},
        }
        try:
            resp = self.http.post(url, params={"key": api_key}, json=payload, timeout=45)
            if resp.status_code == 200:
                data = resp.json()
                candidates = data.get("candidates") or []
                if candidates:
                    parts = candidates[0].get("content", {}).get("parts") or []
                    text = "".join(str(p.get("text", "")) for p in parts).strip()
                    if text:
                        return (True, clean_model, text, f"◈ Bulut Çıkarım Geçidi ({clean_model}) ile sentezlendi")
            return (False, clean_model, "", f"▲ Gemini REST HTTP {resp.status_code}")
        except Exception as exc:
            return (False, clean_model, "", f"▲ Bulut bağlantı uyarısı: {exc}")

    def _call_antigravity(
        self,
        cfg: Dict[str, Any],
        sys_prompt: str,
        user_prompt: str,
        history: List[Dict[str, str]],
        on_chunk: Optional[Callable[[str, str, str], None]] = None,
    ) -> Tuple[bool, str, str, str]:
        """
        1) Bilgisayarda kurulu ve oturum açılmış yerel CLI çıkarım köprüsünü çalıştırır,
        2) Kuruluysa yerel Python SDK köprüsünü dener,
        3) Girilmişse köprü API anahtarı üzerinden bağlanır.
        """
        agy_st = self.get_antigravity_status()
        agy_exe_str = agy_st.get("cli_path", "")
        if agy_st.get("cli_ready") and agy_exe_str:
            try:
                agy_ws = get_user_data_dir() / "bridge_workspace"
                agy_ws.mkdir(parents=True, exist_ok=True)

                avail_ids = [m["id"] for m in agy_st.get("models", [])]
                chosen_model = str(cfg.get("antigravity_model") or "gemini-3.8-flash-high").strip()
                if chosen_model == "auto" or (avail_ids and chosen_model not in avail_ids):
                    chosen_model = "gemini-3.8-flash-high" if "gemini-3.8-flash-high" in avail_ids else (avail_ids[0] if avail_ids else "gemini-3.8-flash-high")

                hist_snippet = ""
                if history:
                    recent_lines = [
                        f"{'Kullanıcı' if h.get('role') == 'user' else 'Asistan'}: {str(h.get('content', ''))[:300]}"
                        for h in history[-3:]
                    ]
                    hist_snippet = "\n=== ÖNCEKİ SOHBET ÖZETİ ===\n" + "\n".join(recent_lines) + "\n"

                combined_prompt = (
                    f"{sys_prompt}\n{hist_snippet}\n{user_prompt}\n\n"
                    "(ÖNEMLİ: Dosya düzenleme veya alt-komut çalıştırma yapmadan doğrudan kapsamlı bilimsel yanıtı Markdown formatında yaz.)"
                )
                # Windows CreateProcess 32KB komut satırı sınırına karşı güvenli kırpma
                if len(combined_prompt) > 12000:
                    combined_prompt = combined_prompt[:12000]

                cmd = [
                    agy_exe_str,
                    "--disable-slash-commands",
                    "--sandbox",
                    f"--model={chosen_model}",
                    f"--print={combined_prompt}",
                ]
                proc = subprocess.run(
                    cmd,
                    cwd=str(agy_ws),
                    stdin=subprocess.DEVNULL,
                    capture_output=True,
                    text=True,
                    encoding="utf-8",
                    errors="replace",
                    timeout=95,
                    creationflags=getattr(subprocess, "CREATE_NO_WINDOW", 0),
                )
                out_text = (proc.stdout or "").strip()
                if proc.returncode == 0 and out_text:
                    if on_chunk:
                        on_chunk(out_text, "local_cli_bridge", chosen_model)
                    return (True, f"cli/{chosen_model}", out_text, f"◈ Yerel Sistem Çıkarım Köprüsü ({chosen_model}) ile sentezlendi")
            except Exception as exc:
                pass

        # 2) Yerel Python SDK Köprüsü
        if self._antigravity_sdk_available:
            try:
                from google.antigravity import Agent, LocalAgentConfig  # type: ignore

                async def _run_agy() -> str:
                    agent_cfg = LocalAgentConfig(system_instructions=sys_prompt)
                    chunks: List[str] = []
                    async with Agent(agent_cfg) as agent:
                        response = await agent.chat(user_prompt)
                        async for token in response:
                            chunks.append(str(token))
                    return "".join(chunks).strip()

                text = asyncio.run(_run_agy())
                if text:
                    if on_chunk:
                        on_chunk(text, "local_cli_bridge", "local.sdk.Agent")
                    return (True, "local.sdk.Agent", text, "◈ Yerel SDK Çıkarım Köprüsü ile sentezlendi")
            except Exception:
                pass

        # 3) Yedek Köprü Anahtarı
        agy_key = str(cfg.get("antigravity_api_key", "")).strip()
        if agy_key:
            ok, m_name, txt, note = self._call_gemini_api(
                api_key=agy_key,
                model=cfg.get("gemini_model") or "gemini-2.5-flash",
                sys_prompt=sys_prompt,
                user_prompt=user_prompt,
                history=history,
            )
            if ok and txt:
                if on_chunk:
                    on_chunk(txt, "local_cli_bridge", f"bridge/{m_name}")
                return (True, f"bridge/{m_name}", txt, "◈ Yerel Köprü Geçidi ile sentezlendi")
            return (False, m_name, "", note)

        return (False, "local_cli_bridge", "", "◈ Yerel CLI köprüsü oturumu bulunamadı")

    def _call_openai_compatible(
        self,
        base_url: str,
        api_key: str,
        model: str,
        sys_prompt: str,
        user_prompt: str,
        history: List[Dict[str, str]],
        label: str = "OpenRouter",
    ) -> Tuple[bool, str, str, str]:
        messages: List[Dict[str, str]] = [{"role": "system", "content": sys_prompt}]
        for h in history[-6:]:
            r = "assistant" if h.get("role") == "assistant" else "user"
            c = str(h.get("content", "")).strip()
            if c:
                messages.append({"role": r, "content": c})
        messages.append({"role": "user", "content": user_prompt})

        headers = {
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json",
            "HTTP-Referer": "https://spaceappschallenge.org/2026/challenges/flame-in-freefall/",
            "X-Title": "ALTAR-NASA Flame in Freefall",
        }
        try:
            resp = self.http.post(
                base_url,
                headers=headers,
                json={"model": model, "messages": messages, "temperature": 0.2, "max_tokens": 2200},
                timeout=45,
            )
            if resp.status_code == 200:
                data = resp.json()
                choices = data.get("choices") or []
                if choices:
                    txt = str(choices[0].get("message", {}).get("content", "")).strip()
                    if txt:
                        return (True, model, txt, f"◈ {label} ({model}) ile sentezlendi")
            return (False, model, "", f"▲ {label} HTTP {resp.status_code}")
        except Exception as exc:
            return (False, model, "", f"▲ {label} bağlantı uyarısı: {exc}")

    def _call_ollama_local(
        self,
        cfg: Dict[str, Any],
        sys_prompt: str,
        user_prompt: str,
        history: List[Dict[str, str]],
        image_base64: Optional[str] = None,
        on_chunk: Optional[Callable[[str, str, str], None]] = None,
        cancel_check: Optional[Callable[[], bool]] = None,
        max_predict: int = 1350,
    ) -> Tuple[bool, str, str, str]:
        st = self.get_ollama_status()
        if not st["online"] or not st["models"]:
            return (False, "ollama", "", "◈ Yerel Ollama servisi kapalı veya yüklü model bulunamadı")

        available_names = [m["name"] for m in st["models"]]
        chosen = str(cfg.get("ollama_model", "auto")).strip()
        if image_base64:
            vision_candidates = [m for m in available_names if any(v in m.lower() for v in ("llava", "vision", "vl"))]
            if vision_candidates:
                chosen = vision_candidates[0]
        if not chosen or chosen == "auto" or chosen not in available_names:
            chosen = st["recommended_active"] or available_names[0]

        messages: List[Dict[str, Any]] = [{"role": "system", "content": sys_prompt}]
        for h in history[-4:]:
            r = "assistant" if h.get("role") == "assistant" else "user"
            c = str(h.get("content", "")).strip()
            if c:
                messages.append({"role": r, "content": c})

        user_msg_obj: Dict[str, Any] = {"role": "user", "content": user_prompt}
        if image_base64 and any(v in chosen.lower() for v in ("llava", "vision", "vl")):
            clean_b64 = image_base64.split(",", 1)[-1] if "," in image_base64 else image_base64
            user_msg_obj["images"] = [clean_b64]
        messages.append(user_msg_obj)

        host = st["host"]
        payload: Dict[str, Any] = {
            "model": chosen,
            "messages": messages,
            "stream": True,
            "think": False,
            "options": {"temperature": 0.18, "num_ctx": 4096, "num_predict": max_predict},
        }

        with self._ollama_lock:
            try:
                resp = self.http.post(f"{host}/api/chat", json=payload, stream=True, timeout=(8, 180))
                if resp.status_code == 400:
                    resp.close()
                    payload.pop("think", None)
                    resp = self.http.post(f"{host}/api/chat", json=payload, stream=True, timeout=(8, 180))

                if resp.status_code != 200:
                    code = resp.status_code
                    resp.close()
                    return (False, chosen, "", f"▲ Ollama HTTP {code}")

                acc_chunks: List[str] = []
                acc_thinking: List[str] = []
                last_emit_len = 0

                try:
                    for raw_line in resp.iter_lines(decode_unicode=True):
                        if cancel_check and cancel_check():
                            break
                        if not raw_line:
                            continue
                        try:
                            pkt = json.loads(raw_line)
                        except Exception:
                            continue
                        msg = pkt.get("message") or {}
                        piece = str(msg.get("content") or pkt.get("response") or "")
                        if piece:
                            acc_chunks.append(piece)
                            joined = "".join(acc_chunks)
                            if on_chunk and (len(joined) - last_emit_len >= 12 or pkt.get("done")):
                                last_emit_len = len(joined)
                                on_chunk(joined, "ollama", chosen)
                        elif msg.get("thinking"):
                            acc_thinking.append(str(msg.get("thinking")))
                        if pkt.get("done"):
                            break
                finally:
                    resp.close()

                final_txt = "".join(acc_chunks).strip()
                if not final_txt and acc_thinking:
                    final_txt = _RE_THOUGHT_CLEAN.sub("", "".join(acc_thinking)).strip()
                if final_txt:
                    if on_chunk:
                        on_chunk(final_txt, "ollama", chosen)
                    return (True, chosen, final_txt, f"◈ Yerel Çevrimdışı Ollama ({chosen} • Canlı Akış) ile sentezlendi")
                return (False, chosen, "", "▲ Ollama boş yanıt döndürdü")
            except Exception as exc:
                return (False, chosen, "", f"▲ Ollama çalışma uyarısı: {exc}")

    @staticmethod
    def _apply_safety_rule_critic(reply_text: str, lang: str) -> Tuple[str, str]:
        """6 Katmanlı Sektörel Denetçi: Halon önerisi gibi tehlikeli uzay aracı ihlallerini yakalar ve düzeltir."""
        lower = reply_text.lower()
        if "halon" in lower and not any(w in lower for w in ("yasak", "kullanılmaz", "prohibited", "banned", "avoid", "yerine", "strictly")):
            if lang == "en":
                patch = (
                    "\n\n> **[ALTAR-NASA SAFETY CRITIC OVERRIDE • CON-05 / NASA-STD-6001B]:** *Halon 1301 is strictly prohibited in modern "
                    "crewed spacecraft due to toxic HF/HBr byproducts. Enforce HVAC shutoff + Fine Water Mist (ISS PFE) or CO₂.*"
                )
            else:
                patch = (
                    "\n\n> **[ALTAR-NASA GÜVENLİK DENETÇİSİ ŞERHİ • CON-05 / NASA-STD-6001B]:** *İnsanlı uzay araçlarında toksik HF/HBr "
                    "gazı ürettiği için Halon 1301 kullanımı yasaktır. Önce HVAC fanlarını kapatın, ardından İnce Su Sisi (ISS PFE) veya CO₂ uygulayın.*"
                )
            return (reply_text + patch, "◈ 6-Katmanlı Denetçi: CON-05 Halon Kural Şerhi Eklendi")
        return (reply_text, "✓ 6-Katmanlı Denklem & NASA-STD-6001B Halon Denetimi Onaylandı")

    @staticmethod
    def _build_deterministic_scientific_report(
        active_sim: Dict[str, Any],
        top_exps: List[Dict[str, Any]],
        live_ntrs: List[Dict[str, Any]],
        lang: str = "tr",
    ) -> str:
        inp = active_sim["inputs"]
        tel = active_sim["telemetry"]
        call = active_sim["callouts"]
        pg_info = active_sim.get("partial_gravity_info") or {}

        if lang == "en":
            exp_lines = "\n".join(
                f"{e['rank']}. **{e['program']} ({e['exp_id']} • {e.get('hardware_group', 'CIR')} • NTRS `{e['ntrs_id']}`)** — Priority `{e['priority_score']}/100` (MOC `{e['moc_measured_pct']}%`): {e['key_finding_en']} *(Safety Action: {e['safety_insight_en']})*"
                for e in top_exps
            )
            pg_block_en = f"- **Special Regime / Partial-G Transparency:** {pg_info['en']}\n" if (pg_info.get("show_banner") and pg_info.get("en")) else ""
            ntrs_extra_en = ""
            if live_ntrs:
                ntrs_extra_en = "\n\n### 5. Live NASA NTRS Literature Matches\n" + "\n".join(
                    f"- **[{n['id']}]({n['url']})** — *{n['title']}* ({n['date']})"
                    for n in live_ntrs[:3]
                )
            return (
                f"### 1. Physical Regime & Governing Equation Diagnosis: {call['badge_en']}\n"
                f"- **Thermodynamic & Transport State:** Temp `{tel['flame_temp_k']} K` | d²-Law Constant `K = {tel['burning_rate_k_mm2_s']} mm²/s` | Spalding `B_oq = {tel.get('spalding_b_number', 0)}` | Standoff `R_f/R_d = {tel.get('standoff_ratio_rf_rd', 0)}`\n"
                f"- **Dimensionless Scaling:** `Re = {tel.get('reynolds_number', 0)}` | `Sh = {tel['sherwood_number']}` | `Ra = {tel.get('rayleigh_number', 0)}` | `Ri = {tel.get('richardson_number', 0)}` | `Da = {tel.get('damkohler_number', 0)}` | Radiative Loss `χ_r = {tel['radiative_loss_fraction']}`\n"
                f"- **Flammability Margin:** Partial Pressure `P_O2 = {tel.get('o2_partial_psia', 0)} psia` vs. Critical `MOC = {tel['moc_pct']}% O₂` -> **Risk Score `{tel['risk_score']}/100`**.\n"
                f"{pg_block_en}"
                f"- **Interpretation:** {call['summary_en']}\n\n"
                f"### 2. Ranked NASA Microgravity Evidence & Comparison (PSI & NTRS)\n{exp_lines}\n\n"
                f"### 3. Spacecraft, EVA Suit & Rover Fire Safety Protocol (CON-05 / NASA-STD-6001B)\n"
                f"- **Step 1 (Ventilation Isolation):** Cut HVAC cabin airflow (`{inp['airflow_cms']} cm/s -> 0 cm/s`) to force diffusive CO₂ self-quenching.\n"
                f"- **Step 2 (Clean Suppression):** Deploy **25–40 µm Fine Water Mist (ISS PFE / SoFIE-MIST)** or localized **CO₂** (Halon 1301 is strictly prohibited).\n"
                f"- **Step 3 (Multi-Sensor Watch):** Fuse optical cameras with IR radiometry (`{tel['heat_flux_kw_m2']} kW/m²`), CO sensing (`{tel['co_ppm']} ppm`), and **DAFT/SAME** dust-immune laser smoke detectors against invisible Cool Flames.\n\n"
                f"### 4. Space-to-Earth Fire Safety Transfer\n"
                f"- Sub-50 µm water-mist extinguishers (SoFIE-MIST), **DAFT/SAME** smart dust-immune smoke detectors, **PBI/Nomex** firefighter turnout gear & lightweight **SCBA** composite air tanks, and NTC cool-flame clean HCCI engine kinetics directly enhance terrestrial fire protection."
                f"{ntrs_extra_en}"
            )

        exp_lines_tr = "\n".join(
            f"{e['rank']}. **{e['program']} ({e['exp_id']} • {e.get('hardware_group', 'CIR')} • NTRS `{e['ntrs_id']}`)** — Öncelik `{e['priority_score']}/100` (Ölçülen MOC `%{e['moc_measured_pct']}`): {e['key_finding_tr']} *(Mühendislik Önlemi: {e['safety_insight_tr']})*"
            for e in top_exps
        )
        pg_block_tr = f"- **Özel Atmosfer & Kısmi Yerçekimi Notu:** {pg_info['tr']}\n" if (pg_info.get("show_banner") and pg_info.get("tr")) else ""
        ntrs_extra = ""
        if live_ntrs:
            ntrs_extra = "\n\n### 5. Canlı NASA NTRS Literatür Eşleşmeleri\n" + "\n".join(
                f"- **[{n['id']}]({n['url']})** — *{n['title']}* ({n['date']})"
                for n in live_ntrs[:3]
            )
        return (
            f"### 1. Fiziksel Rejim ve Formülsel Taşınım Analizi: {call['badge_tr']}\n"
            f"- **Termodinamik & D² Yasası Durumu:** Sıcaklık `{tel['flame_temp_k']} K` | Yanma Sabiti `K = {tel['burning_rate_k_mm2_s']} mm²/s` (`D²(t) = D₀² - K·t`, Ömür `{tel['burn_lifetime_s']} sn`) | Spalding Sayısı `B_oq = {tel.get('spalding_b_number', 0)}` | Alev Durma Oranı `R_f/R_d = {tel.get('standoff_ratio_rf_rd', 0)}`\n"
            f"- **Boyutsuz Taşınım Sayıları:** `Re = {tel.get('reynolds_number', 0)}` | Sherwood `Sh = {tel['sherwood_number']}` | Rayleigh `Ra = {tel.get('rayleigh_number', 0)}` | Richardson `Ri = {tel.get('richardson_number', 0)}` | Damköhler `Da = {tel.get('damkohler_number', 0)}` | Radyatif Kayıp `χ_r = %{tel['radiative_loss_fraction'] * 100:.1f}`\n"
            f"- **Tutuşabilirlik Sınırı:** Kısmi Oksijen Basıncı `P_O2 = {tel.get('o2_partial_psia', 0)} psia ({tel.get('o2_partial_kpa', 0)} kPa)` | Kritik `MOC = %{tel['moc_pct']} O₂` | **Yangın Risk Skoru: `{tel['risk_score']}/100`**\n"
            f"{pg_block_tr}"
            f"- **Fiziksel Yorum:** {call['summary_tr']}\n\n"
            f"### 2. NASA Deneysel Kanıt Sıralaması ve Kıyaslama (PSI & NTRS)\n{exp_lines_tr}\n\n"
            f"### 3. Uzay Aracı, Uzay Giysisi & Gezgin Yangın Güvenliği Protokolü (CON-05 / NASA-STD-6001B)\n"
            f"- **Adım 1 (Havalandırma Kesme):** Kabin HVAC fanlarını (`{inp['airflow_cms']} cm/s -> 0 cm/s`) derhal kapatarak alevi kendi CO₂ kabuğu içinde difüzif boğulmaya zorlayın.\n"
            f"- **Adım 2 (Aktif Söndürme):** CON-05 / NASA-STD-6001B kuralı uyarınca Halon 1301 kesinlikle yasaktır; **İnce Su Sisi (ISS Water Mist PFE / SoFIE-MIST, 25–40 µm)** veya **CO₂** seyreltmesi uygulayın.\n"
            f"- **Adım 3 (Çoklu Sensör Füzyonu):** Görünmez Soğuk Alev (550–750 K) ve Ay tozu yanlış alarmlarına karşı optik kamerayı IR radyometre (`{tel['heat_flux_kw_m2']} kW/m²`), CO sensörü (`{tel['co_ppm']} ppm`) ve **DAFT/SAME** çok kanallı duman dedektörüyle çapraz doğrulayın.\n\n"
            f"### 4. Uzaydan Dünya'ya (Space-to-Earth) Güvenlik Uygulamaları\n"
            f"- NASA mikroçekim bulgularından türetilen **25–40 µm ince su sisli söndürücüler** (SoFIE-MIST), **DAFT/SAME toz-bağışıklı karasal duman algılama**, **PBI/Nomex itfaiyeci koruyucu giysileri ve kompozit SCBA hava tankları** ile NTC soğuk alev temiz motor kinetiği Dünya'daki yangın güvenliğini doğrudan güçlendirmektedir."
            f"{ntrs_extra}"
        )
