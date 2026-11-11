# -*- coding: utf-8 -*-
"""
ALTAR-NASA: Flame in Freefall (v5.0 Global Champion & Zero-Trust Isolated Edition) — Ana Yerel Sunucu & Başlatıcı.
2026 NASA International Space Apps Challenge ("Flame in Freefall") için geliştirilmiştir.
Güvenlik Mimarisi:
- Salt 127.0.0.1 Loopback Soket İzolasyonu (0.0.0.0 / Dış Ağ Dinlemesi Kesinlikle Kapalı)
- DNS Rebinding (Host Whitelist), Cross-Origin (Origin/Sec-Fetch-Site) ve 192-bit X-Altar-CSRF Kalkanı
- Sıkı Content-Security-Policy (CSP), X-Frame-Options: DENY ve SSRF / Decompression-Bomb Koruması
"""

from __future__ import annotations

import argparse
import io
import os
import re
import socket
import subprocess
import sys
import threading
import time
import webbrowser
from pathlib import Path

# PyInstaller console=False (windowed) modunda sys.stdout / sys.stderr None olur.
if sys.stdout is None:
    sys.stdout = io.StringIO()
if sys.stderr is None:
    sys.stderr = io.StringIO()

from flask import Flask, Response, jsonify, render_template, request, send_from_directory
from werkzeug.serving import make_server

from core.ai_engine import HybridNasaAIEngine
from core.config_manager import ConfigManager, get_resource_base_dir
from core.data_vision_processor import analyze_flame_image_bytes
from core.directives import CORE_DIRECTIVES_LIST
from core.nasa_datasets import MISSION_PRESETS, NASA_EXPERIMENTS_CATALOG, SPACE_TO_EARTH_TRANSFERS
from core.nasa_live_fetcher import ContinuousWebStreamManager, NasaLiveFetcher
from core.physics_engine import simulate_combustion_state
from core.ranking_engine import ExperimentRankingEngine, SemanticKnowledgeIndex
from core.security_guard import (
    apply_hardened_security_headers,
    generate_session_csrf_token,
    verify_request_isolation,
)

_IMAGE_EXTS = {"png", "jpg", "jpeg", "webp", "bmp", "gif"}


def create_nasa_web_app() -> Flask:
    base_dir = get_resource_base_dir()
    template_dir = base_dir / "web" / "templates"
    static_dir = base_dir / "web" / "static"

    app = Flask(
        __name__,
        template_folder=str(template_dir),
        static_folder=str(static_dir),
        static_url_path="/static",
    )
    app.config["MAX_CONTENT_LENGTH"] = 32 * 1024 * 1024  # 32 MB güvenli dosya & görsel üst sınırı
    csrf_token = generate_session_csrf_token()
    app.config["ALTAR_CSRF_TOKEN"] = csrf_token

    config_mgr = ConfigManager()
    live_fetcher = NasaLiveFetcher()
    knowledge_idx = SemanticKnowledgeIndex()
    ranking_eng = ExperimentRankingEngine(knowledge_idx)
    stream_mgr = ContinuousWebStreamManager(live_fetcher, knowledge_idx)
    ai_eng = HybridNasaAIEngine(config_mgr, live_fetcher, knowledge_idx, ranking_eng)

    @app.before_request
    def enforce_zero_trust_isolation():
        ok_iso, iso_err = verify_request_isolation(request, csrf_token)
        if not ok_iso:
            return jsonify({"ok": False, "error": iso_err}), 403
        return None

    @app.after_request
    def add_security_and_nocache_headers(response: Response) -> Response:
        return apply_hardened_security_headers(response, is_api=request.path.startswith("/api/"))

    @app.route("/")
    def index_page():
        return render_template("index.html", csrf_token=csrf_token)

    @app.route("/favicon.ico")
    def favicon():
        ico_path = static_dir / "nasa_flame.ico"
        if ico_path.is_file():
            return send_from_directory(str(static_dir), "nasa_flame.ico")
        return ("", 204)

    @app.route("/api/health")
    def api_health():
        return jsonify({
            "status": "ok",
            "app": "ALTAR-NASA Flame in Freefall",
            "version": "5.0.0",
            "isolation_mode": "127.0.0.1_zero_trust_loopback",
            "csrf_enforced": True,
            "cors_wildcard": False,
            "stream_enabled": stream_mgr.get_status().get("enabled", False),
        })

    @app.route("/api/bootstrap")
    def api_bootstrap():
        return jsonify({
            "presets": MISSION_PRESETS,
            "directives": CORE_DIRECTIVES_LIST,
            "earth_transfers": SPACE_TO_EARTH_TRANSFERS,
            "catalog_count": len(NASA_EXPERIMENTS_CATALOG),
            "config": config_mgr.get_masked_public_view(),
            "providers": ai_eng.get_providers_summary(),
            "stream": stream_mgr.get_status(),
        })

    @app.route("/api/simulate", methods=["POST"])
    def api_simulate():
        params = request.get_json(silent=True) or {}
        result = simulate_combustion_state(params)
        return jsonify(result)

    @app.route("/api/rank", methods=["POST"])
    def api_rank():
        body = request.get_json(silent=True) or {}
        mission_params = body.get("mission_params") or {}
        query = str(body.get("query") or "")
        hw_filter = str(body.get("hardware_filter") or "ALL")
        return jsonify(ranking_eng.rank_experiments(mission_params, query=query, hardware_filter=hw_filter))

    @app.route("/api/compare", methods=["POST"])
    def api_compare():
        body = request.get_json(silent=True) or {}
        exp_ids = body.get("exp_ids") or []
        mission_params = body.get("mission_params") or {}
        return jsonify(ranking_eng.compare_experiments(exp_ids, mission_params))

    # =========================================================================
    # CANLI NASA VERİSİ VE SÜREKLİ WEB AKIŞI (CONTINUOUS LIVE STREAM)
    # =========================================================================
    @app.route("/api/nasa-live")
    def api_nasa_live():
        source = str(request.args.get("source") or "ntrs").lower()
        q = str(request.args.get("q") or "microgravity combustion flame")
        force = str(request.args.get("force") or "") == "1"
        if source == "osdr":
            return jsonify(live_fetcher.search_osdr_psi_live(q, limit=8, force_refresh=force))
        return jsonify(live_fetcher.search_ntrs_live(q, limit=8, force_refresh=force))

    @app.route("/api/stream/status")
    def api_stream_status():
        return jsonify(stream_mgr.get_status())

    @app.route("/api/stream/config", methods=["POST"])
    def api_stream_config():
        body = request.get_json(silent=True) or {}
        st = stream_mgr.configure(
            enabled=body.get("enabled") if "enabled" in body else None,
            source=body.get("source"),
            query_or_url=body.get("query_or_url"),
            interval_sec=body.get("interval_sec"),
            auto_sync_sim=body.get("auto_sync_sim") if "auto_sync_sim" in body else None,
            trigger_immediate=bool(body.get("trigger_immediate", False)),
        )
        return jsonify(st)

    # =========================================================================
    # EVRENSEL DOSYA (.CSV/.JSON/.PDF/.TXT), ALEV RESMİ (.PNG/.JPG) & URL İŞLEME
    # =========================================================================
    @app.route("/api/ingest-media", methods=["POST"])
    def api_ingest_media():
        """
        Yüklenen herhangi bir alev fotoğrafını veya bilimsel veri dosyasını (CSV/JSON/PDF/TXT) işler:
        1) Yanma parametrelerini çıkarır,
        2) 3B Simülasyon + Boyutsuz Formül Tablosunu + Deney Sıralamasını anında hesaplar,
        3) Semantik RAG hafızasına gömer ve AI analizi için özet bağlam döndürür.
        """
        if "file" not in request.files:
            return jsonify({"ok": False, "error": "Yüklenecek dosya veya görsel seçilmedi."}), 400
        f = request.files["file"]
        fname = f.filename or "veri_kaynagi.txt"
        raw = f.read()
        if not raw:
            return jsonify({"ok": False, "error": "Dosya içeriği boş."}), 400

        ext = fname.lower().rsplit(".", 1)[-1] if "." in fname else ""

        if ext in _IMAGE_EXTS:
            img_res = analyze_flame_image_bytes(raw, fname)
            if not img_res.get("ok"):
                return jsonify(img_res), 400
            sim_params = img_res["extracted_sim_params"]
            sim_state = simulate_combustion_state(sim_params)
            ranked = ranking_eng.rank_experiments(sim_state["inputs"], query=fname)
            chunks = knowledge_idx.add_custom_document(
                title=f"[Alev Görseli] {fname}",
                content=img_res["summary_tr"],
                source=f"Image CV ({fname})",
            )
            return jsonify({
                "ok": True,
                "media_type": "image",
                "filename": fname,
                "chunks": chunks,
                "metrics": img_res["metrics"],
                "summary_tr": img_res["summary_tr"],
                "image_base64": img_res["image_base64"],
                "extracted_sim_params": sim_params,
                "simulation": sim_state,
                "ranked_experiments": ranked["ranked_experiments"][:5],
            })

        # Veri / Metin / PDF / CSV / JSON Dosyası
        parsed = live_fetcher.extract_document_bytes(raw, fname)
        if not parsed.get("ok"):
            return jsonify(parsed), 400

        sim_params = parsed.get("extracted_sim_params") or {}
        sim_state = simulate_combustion_state(sim_params)
        ranked = ranking_eng.rank_experiments(sim_state["inputs"], query=fname)
        chunks = knowledge_idx.add_custom_document(
            title=fname,
            content=parsed.get("content") or "",
            source=f"Uploaded File ({fname})",
        )
        notes_list = parsed.get("extraction_notes") or []
        fields_list = parsed.get("extracted_fields") or []
        summary_tr = (
            f"📄 **Veri Dosyası Analizi ({fname} • {parsed.get('pages', 1)} sayfa, {parsed.get('char_count', 0)} karakter):**\n"
            f"- **Otomatik Saptanan Alanlar:** `{', '.join(fields_list) if fields_list else 'Standart Mikroçekim Profili'}`\n"
            + (f"- **Ölçüm Notları:** {'; '.join(notes_list)}\n" if notes_list else "")
            + f"- **3B Simülasyona Aktarılan Koşullar:** Yakıt `{sim_params.get('fuel_id')}`, Yerçekimi `{sim_params.get('gravity_g')}G`, O₂ `%{sim_params.get('oxygen_pct')}`, Basınç `{sim_params.get('pressure_psia')} psia`, Akış `{sim_params.get('airflow_cms')} cm/s`.\n"
            + f"- **Belge Özeti (İlk Kesit):** {(parsed.get('content') or '')[:420]}..."
        )
        return jsonify({
            "ok": True,
            "media_type": "document",
            "filename": fname,
            "pages": parsed.get("pages", 1),
            "chunks": chunks,
            "extracted_fields": fields_list,
            "extraction_notes": notes_list,
            "summary_tr": summary_tr,
            "extracted_sim_params": sim_params,
            "simulation": sim_state,
            "ranked_experiments": ranked["ranked_experiments"][:5],
        })

    @app.route("/api/scrape-url", methods=["POST"])
    def api_scrape_url():
        body = request.get_json(silent=True) or {}
        url = str(body.get("url") or "").strip()
        scraped = live_fetcher.scrape_scientific_url(url)
        if not scraped.get("ok"):
            return jsonify(scraped), 400
        chunks = knowledge_idx.add_custom_document(
            title=scraped.get("title") or url,
            content=scraped.get("content") or "",
            source="Web Scrape",
            url=url,
        )
        sim_params = scraped.get("extracted_sim_params") or {}
        sim_state = simulate_combustion_state(sim_params)
        return jsonify({
            "ok": True,
            "title": scraped.get("title"),
            "url": url,
            "chunks": chunks,
            "extracted_fields": scraped.get("extracted_fields", []),
            "extraction_notes": scraped.get("extraction_notes", []),
            "extracted_sim_params": sim_params,
            "simulation": sim_state,
            "preview": (scraped.get("content") or "")[:450],
        })

    @app.route("/api/upload-doc", methods=["POST"])
    def api_upload_doc():
        # Geriye dönük uyumluluk: Evrensel ingest-media motoruna yönlendirir
        return api_ingest_media()

    @app.route("/api/rag-add-text", methods=["POST"])
    def api_rag_add_text():
        body = request.get_json(silent=True) or {}
        title = str(body.get("title") or "NASA Document")
        content = str(body.get("content") or "")
        source = str(body.get("source") or "NASA Live")
        url = str(body.get("url") or "")
        chunks = knowledge_idx.add_custom_document(title=title, content=content, source=source, url=url)
        return jsonify({"ok": True, "chunks": chunks})

    @app.route("/api/rag-search")
    def api_rag_search():
        q = str(request.args.get("q") or "")
        results = knowledge_idx.search(q, top_k=6)
        return jsonify({"ok": True, "results": results})

    # =========================================================================
    # HİBRİT SI COPILOT (ASENKRON STREAMING + SENKRON FALLBACK)
    # =========================================================================
    @app.route("/api/chat/start", methods=["POST"])
    def api_chat_start():
        body = request.get_json(silent=True) or {}
        message = str(body.get("message") or "").strip()
        if not message:
            return jsonify({"ok": False, "error": "Mesaj boş olamaz."}), 400
        job_id = ai_eng.start_chat_job(
            user_message=message,
            sim_params=body.get("sim_params") or {},
            history=body.get("history") or [],
            image_base64=body.get("image_base64"),
            media_context=str(body.get("media_context") or ""),
            provider_override=body.get("provider_override"),
        )
        return jsonify({"ok": True, "job_id": job_id})

    @app.route("/api/chat/poll/<job_id>")
    def api_chat_poll(job_id: str):
        return jsonify(ai_eng.get_chat_job(job_id))

    @app.route("/api/chat/cancel/<job_id>", methods=["POST"])
    def api_chat_cancel(job_id: str):
        return jsonify(ai_eng.cancel_chat_job(job_id))

    @app.route("/api/chat", methods=["POST"])
    def api_chat():
        body = request.get_json(silent=True) or {}
        message = str(body.get("message") or "").strip()
        if not message:
            return jsonify({"ok": False, "error": "Mesaj boş olamaz."}), 400
        res = ai_eng.analyze_and_chat(
            user_message=message,
            sim_params=body.get("sim_params") or {},
            history=body.get("history") or [],
            image_base64=body.get("image_base64"),
            media_context=str(body.get("media_context") or ""),
            provider_override=body.get("provider_override"),
        )
        return jsonify(res)

    # =========================================================================
    # YAPILANDIRMA, OLLAMA, GOOGLE ANTIGRAVITY VE BAĞLANTI TESTİ
    # =========================================================================
    @app.route("/api/config", methods=["POST"])
    def api_save_config():
        updates = request.get_json(silent=True) or {}
        config_mgr.save(updates)
        return jsonify({
            "ok": True,
            "config": config_mgr.get_masked_public_view(),
            "providers": ai_eng.get_providers_summary(),
        })

    @app.route("/api/ollama/status")
    def api_ollama_status():
        return jsonify(ai_eng.get_ollama_status())

    @app.route("/api/ollama/pull", methods=["POST"])
    def api_ollama_pull():
        body = request.get_json(silent=True) or {}
        return jsonify(ai_eng.pull_ollama_model(str(body.get("model") or "")))

    @app.route("/api/ollama/unload", methods=["POST"])
    def api_ollama_unload():
        return jsonify(ai_eng.unload_ollama_memory())

    @app.route("/api/antigravity/status")
    def api_antigravity_status():
        return jsonify(ai_eng.get_antigravity_status(force_refresh=True))

    @app.route("/api/providers/test", methods=["POST"])
    def api_providers_test():
        body = request.get_json(silent=True) or {}
        prov = body.get("provider")
        return jsonify(ai_eng.test_provider_connection(str(prov) if prov else None))

    return app


# =============================================================================
# YEREL AĞ PORT BULUCU VE UYGULAMA PENCERESİ AÇICI
# =============================================================================
def _check_existing_altar_nasa(port: int) -> bool:
    import urllib.request
    import json as _json
    try:
        with urllib.request.urlopen(f"http://127.0.0.1:{port}/api/health", timeout=0.8) as resp:
            if resp.status == 200:
                data = _json.loads(resp.read().decode("utf-8"))
                return (
                    data.get("app") == "ALTAR-NASA Flame in Freefall"
                    and data.get("version") == "5.0.0"
                )
    except Exception:
        pass
    return False


def _find_available_port(preferred: int = 8765) -> int:
    for p in range(preferred, preferred + 25):
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
            if s.connect_ex(("127.0.0.1", p)) != 0:
                return p
    return preferred


def open_in_app_window(url: str) -> None:
    """
    Windows'ta Microsoft Edge veya Google Chrome '--app' modunu kullanarak
    Web Panelini tam donanım WebGL hızlandırmalı yerel uygulama penceresi olarak açar.
    """
    if sys.platform == "win32":
        pf = os.environ.get("ProgramFiles", r"C:\Program Files")
        pfx86 = os.environ.get("ProgramFiles(x86)", r"C:\Program Files (x86)")
        local_app = os.environ.get("LOCALAPPDATA", "")

        browser_candidates = [
            Path(pfx86) / "Microsoft" / "Edge" / "Application" / "msedge.exe",
            Path(pf) / "Microsoft" / "Edge" / "Application" / "msedge.exe",
            Path(pf) / "Google" / "Chrome" / "Application" / "chrome.exe",
            Path(pfx86) / "Google" / "Chrome" / "Application" / "chrome.exe",
            Path(local_app) / "Google" / "Chrome" / "Application" / "chrome.exe",
        ]
        for exe in browser_candidates:
            if exe.is_file():
                try:
                    subprocess.Popen(
                        [str(exe), f"--app={url}", "--window-size=1560,940"],
                        stdout=subprocess.DEVNULL,
                        stderr=subprocess.DEVNULL,
                    )
                    return
                except Exception:
                    pass
    webbrowser.open(url)


def _locate_serverless_web_dir() -> Path | None:
    candidates = [
        Path(sys.executable).resolve().parent / "web_serverless",
        get_resource_base_dir() / "web_serverless",
        Path(r"e:\Gemini API\Nasa\web_serverless"),
        Path.cwd() / "web_serverless",
    ]
    for cand in candidates:
        if cand.is_dir() and (cand / "index.html").is_file():
            return cand
    return None


class BackgroundServerThread(threading.Thread):
    def __init__(self, app: Flask, host: str, port: int) -> None:
        super().__init__(daemon=True)
        # Güvenlik Kuralı: Yalnızca 127.0.0.1 yerel döngü arayüzüne bağlanılır
        safe_host = "127.0.0.1"
        self.server = make_server(safe_host, port, app, threaded=True)
        self.ctx = app.app_context()
        self.ctx.push()

    def run(self) -> None:
        self.server.serve_forever()

    def shutdown(self) -> None:
        try:
            self.server.shutdown()
        except Exception:
            pass


def launch_desktop_controller(url: str, srv_thread: BackgroundServerThread) -> None:
    """
    Tarayıcıda (Firefox/Edge/Chrome) açık olan oturumların 'NetworkError' vermemesi için:
    - Pencerenin sağ üst 'X' tuşuna basıldığında sunucuyu öldürmez, görev çubuğuna küçültür (iconify).
    - Yalnızca '⏻ Sunucuyu Güvenle Durdur ve Kapat' butonuna basıldığında arka plan sunucusunu sonlandırır.
    """
    import tkinter as tk

    root = tk.Tk()
    root.title("ALTAR-NASA v5.0 • İzole Görev Kontrol Sunucusu (Zero-Trust)")
    serverless_dir = _locate_serverless_web_dir()
    root.geometry("500x315" if serverless_dir else "500x280")
    root.resizable(False, False)
    root.configure(bg="#070e1c")

    ico_path = get_resource_base_dir() / "web" / "static" / "nasa_flame.ico"
    if ico_path.is_file():
        try:
            root.iconbitmap(str(ico_path))
        except Exception:
            pass

    header = tk.Label(
        root,
        text="🛡️ ALTAR-NASA: Flame in Freefall v5.0",
        font=("Segoe UI", 13, "bold"),
        fg="#f8fafc",
        bg="#070e1c",
    )
    header.pack(pady=(12, 4))

    sub = tk.Label(
        root,
        text=f"🔒 Tam İzole 127.0.0.1 Kalkanı Aktif (CSRF + CSP + SSRF Korumalı)\nAdres: {url}",
        font=("Consolas", 9),
        fg="#38bdf8",
        bg="#070e1c",
        justify="center",
    )
    sub.pack(pady=(0, 5))

    hint = tk.Label(
        root,
        text="💡 Dış ağlara port açılmaz (0.0.0.0 kapalı). 'X' tuşu bu pencereyi görev çubuğuna küçültür.",
        font=("Segoe UI", 8),
        fg="#94a3b8",
        bg="#070e1c",
    )
    hint.pack(pady=(0, 8))

    btn_frame = tk.Frame(root, bg="#070e1c")
    btn_frame.pack(fill="x", padx=26)

    btn_app = tk.Button(
        btn_frame,
        text="🖥️  3B Web Panelini Uygulama Modunda Aç",
        command=lambda: open_in_app_window(url),
        font=("Segoe UI", 10, "bold"),
        bg="#0284c7",
        fg="#ffffff",
        activebackground="#0369a1",
        activeforeground="#ffffff",
        relief="flat",
        pady=7,
        cursor="hand2",
    )
    btn_app.pack(fill="x", pady=3)

    row2 = tk.Frame(btn_frame, bg="#070e1c")
    row2.pack(fill="x", pady=3)

    btn_browser = tk.Button(
        row2,
        text="🌐 Varsayılan Tarayıcıda Aç",
        command=lambda: webbrowser.open(url),
        font=("Segoe UI", 9, "bold"),
        bg="#152340",
        fg="#e2e8f0",
        activebackground="#1e3a5f",
        activeforeground="#ffffff",
        relief="flat",
        pady=6,
        cursor="hand2",
    )
    btn_browser.pack(side="left", expand=True, fill="x", padx=(0, 5))

    def _copy_url() -> None:
        root.clipboard_clear()
        root.clipboard_append(url)
        sub.configure(text=f"✅ Adres Panoya Kopyalandı!\nAdres: {url}")

    btn_copy = tk.Button(
        row2,
        text="📋 Adresi Kopyala",
        command=_copy_url,
        font=("Segoe UI", 9, "bold"),
        bg="#152340",
        fg="#e2e8f0",
        activebackground="#1e3a5f",
        activeforeground="#ffffff",
        relief="flat",
        pady=6,
        cursor="hand2",
    )
    btn_copy.pack(side="left", expand=True, fill="x", padx=(5, 0))

    if serverless_dir is not None:
        def _open_serverless_folder() -> None:
            if sys.platform == "win32":
                os.startfile(str(serverless_dir))  # type: ignore[attr-defined]
            else:
                webbrowser.open(serverless_dir.as_uri())

        btn_srvless = tk.Button(
            btn_frame,
            text="📦 Sunucusuz Statik Web Paketini Aç (GitHub/Cloudflare Pages)",
            command=_open_serverless_folder,
            font=("Segoe UI", 8, "bold"),
            bg="#0f2942",
            fg="#7dd3fc",
            activebackground="#1e3a5f",
            activeforeground="#ffffff",
            relief="flat",
            pady=5,
            cursor="hand2",
        )
        btn_srvless.pack(fill="x", pady=3)

    def _minimize_to_taskbar() -> None:
        sub.configure(text=f"🔒 İzole Sunucu Görev Çubuğunda Korunuyor\nAdres: {url}")
        root.iconify()

    def _clean_exit() -> None:
        srv_thread.shutdown()
        root.destroy()
        sys.exit(0)

    btn_quit = tk.Button(
        btn_frame,
        text="⏻  Sunucuyu Güvenle Durdur ve Tamamen Çık",
        command=_clean_exit,
        font=("Segoe UI", 9, "bold"),
        bg="#7f1d1d",
        fg="#fecaca",
        activebackground="#991b1b",
        activeforeground="#ffffff",
        relief="flat",
        pady=6,
        cursor="hand2",
    )
    btn_quit.pack(fill="x", pady=(6, 0))

    root.protocol("WM_DELETE_WINDOW", _minimize_to_taskbar)
    root.after(200, lambda: open_in_app_window(url))
    root.after(1400, _minimize_to_taskbar)
    root.mainloop()


def run_self_test() -> int:
    """Tüm uç noktaları, Zero-Trust siber güvenlik kalkanlarını, 3B/formül/ISS R² doğrulamasını ve kabin zaman çizelgesini doğrular."""
    from PIL import Image as _PILImage

    app = create_nasa_web_app()
    client = app.test_client()

    r_idx = client.get("/")
    assert r_idx.status_code == 200 and b"three_chamber_3d.js" in r_idx.data, "Index page failed"
    idx_html = r_idx.data.decode("utf-8")
    m_csrf = re.search(r'<meta\s+name="altar-csrf"\s+content="([0-9a-f]{48})"', idx_html)
    assert m_csrf, "CSRF meta tag missing from index.html"
    csrf_tok = m_csrf.group(1)
    csrf_hdrs = {"X-Altar-CSRF": csrf_tok}

    # Siber Güvenlik Başlıkları & Wildcard CORS Kaldırma Kontrolü
    assert r_idx.headers.get("Access-Control-Allow-Origin") is None, "Wildcard CORS must not exist!"
    assert r_idx.headers.get("X-Frame-Options") == "DENY", "X-Frame-Options DENY missing"
    assert r_idx.headers.get("X-Content-Type-Options") == "nosniff", "nosniff missing"
    assert "default-src 'self'" in (r_idx.headers.get("Content-Security-Policy") or ""), "CSP header missing"

    # Saldırı Simülasyonları (Penetration Self-Tests):
    # A) Eksik CSRF Token ile POST engellenmeli
    r_no_csrf = client.post("/api/config", json={"active_provider": "ollama"})
    assert r_no_csrf.status_code == 403, f"Expected 403 without CSRF token, got {r_no_csrf.status_code}"

    # B) DNS Rebinding (Sahte Host başlığı) engellenmeli
    r_dns_rebind = client.get("/api/bootstrap", headers={"Host": "evil-rebind.attacker.com"})
    assert r_dns_rebind.status_code == 403, "DNS rebinding Host attack was not blocked!"

    # C) Kötücül Web Sekmesi Cross-Origin ve Sec-Fetch-Site saldırısı engellenmeli
    r_bad_origin = client.post(
        "/api/simulate",
        json={"fuel_id": "n_heptane"},
        headers={"X-Altar-CSRF": csrf_tok, "Origin": "https://evil-site.org"},
    )
    assert r_bad_origin.status_code == 403, "Cross-origin POST was not blocked!"

    r_cross_site = client.post(
        "/api/simulate",
        json={"fuel_id": "n_heptane"},
        headers={"X-Altar-CSRF": csrf_tok, "Sec-Fetch-Site": "cross-site"},
    )
    assert r_cross_site.status_code == 403, "Sec-Fetch-Site cross-site was not blocked!"

    # D) SSRF (İç Ağ & Bulut Metadata Okuma) engellenmeli
    r_ssrf_local = client.post(
        "/api/scrape-url",
        json={"url": "http://127.0.0.1:8765/api/bootstrap"},
        headers=csrf_hdrs,
    )
    assert r_ssrf_local.status_code == 400 and r_ssrf_local.get_json().get("ok") is False, "Localhost SSRF not blocked!"

    r_ssrf_meta = client.post(
        "/api/scrape-url",
        json={"url": "http://169.254.169.254/latest/meta-data/"},
        headers=csrf_hdrs,
    )
    assert r_ssrf_meta.status_code == 400 and r_ssrf_meta.get_json().get("ok") is False, "Metadata SSRF not blocked!"

    r_three = client.get("/static/js/vendor/three.min.js")
    assert r_three.status_code == 200 and len(r_three.data) > 500000, "Three.js bundle missing"

    r_boot = client.get("/api/bootstrap")
    assert r_boot.status_code == 200
    boot_json = r_boot.get_json()
    assert boot_json["catalog_count"] == 15, f"Catalog incomplete: {boot_json['catalog_count']}"
    assert len(boot_json["presets"]) == 8, f"Presets incomplete: {len(boot_json['presets'])}"
    assert len(boot_json["directives"]) == 9, f"Directives incomplete: {len(boot_json['directives'])}"
    assert len(boot_json["earth_transfers"]) == 5, f"Earth transfers incomplete: {len(boot_json['earth_transfers'])}"

    # 1) 0G Soğuk Alev (FLEX/CFI) + ISS R² Doğrulama + Kabin Zaman Çizelgesi testi
    r_sim = client.post(
        "/api/simulate",
        json={
            "fuel_id": "n_heptane",
            "gravity_g": 0.0,
            "oxygen_pct": 13.0,
            "droplet_d0_mm": 4.2,
            "airflow_cms": 0.0,
            "habitat_id": "lunar_rover",
            "crew_response_s": 30.0,
        },
        headers=csrf_hdrs,
    )
    assert r_sim.status_code == 200
    sim_json = r_sim.get_json()
    assert sim_json["telemetry"]["regime"] == "COOL_FLAME_NTC", "Cool flame regime check failed"
    assert len(sim_json.get("formula_table", [])) >= 6, "Formula table missing"
    assert sim_json["flight_validation"]["r_squared"] >= 0.92, "ISS flight validation R^2 check failed"
    assert len(sim_json["flight_validation"]["d2_points"]) >= 5, "ISS d2 flight points missing"
    assert sim_json["scenario_timeline"]["habitat_id"] == "lunar_rover", "Habitat scenario check failed"
    assert sim_json["scenario_timeline"]["optical_blind"] is True, "Cool flame optical blindness flag failed"

    # 2) EVA Uzay Giysisi (4.3 psia, %100 O2) + Kısmi Yerçekimi / Uyarı Banner testi
    r_eva = client.post(
        "/api/simulate",
        json={
            "fuel_id": "nomex",
            "gravity_g": 0.0,
            "oxygen_pct": 100.0,
            "pressure_psia": 4.3,
            "airflow_cms": 4.0,
            "habitat_id": "eva_suit",
            "crew_response_s": 10.0,
        },
        headers=csrf_hdrs,
    )
    assert r_eva.status_code == 200
    eva_json = r_eva.get_json()
    assert eva_json["inputs"]["oxygen_pct"] == 100.0 and eva_json["inputs"]["pressure_psia"] == 4.3, "EVA clamp failed"
    assert eva_json["inputs"]["geometry_3d"] == "flat_slab", "Nomex 3D geometry check failed"
    assert eva_json["partial_gravity_info"]["show_banner"] is True, "EVA high-O2 banner missing"
    assert eva_json["scenario_timeline"]["severity"] == "CRITICAL", "EVA active fire must be CRITICAL"

    # 3) Ay Üssü & Basınçlı Gezgin (0.16G, 10.2 psia, %32 O2) LUCI / FM2 sınırı testi
    r_lunar = client.post(
        "/api/simulate",
        json={"fuel_id": "pmma", "gravity_g": 0.16, "oxygen_pct": 32.0, "pressure_psia": 10.2, "airflow_cms": 5.0},
        headers=csrf_hdrs,
    )
    assert r_lunar.status_code == 200
    lunar_json = r_lunar.get_json()
    assert "LUCI" in lunar_json["partial_gravity_info"]["tr"], "LUCI transparency notice missing"
    assert "moc_lunar_016g_pct" in lunar_json["flammability_map"], "0.16G Lunar MOC curve missing"

    # 4) ACME CFI-G (%85 O2 Küresel Gözenekli Brülör) testi
    r_cfig = client.post(
        "/api/simulate",
        json={"fuel_id": "propane_cfig", "gravity_g": 0.0, "oxygen_pct": 85.0, "pressure_psia": 14.7, "airflow_cms": 0.4, "droplet_d0_mm": 4.8},
        headers=csrf_hdrs,
    )
    assert r_cfig.status_code == 200
    cfig_json = r_cfig.get_json()
    assert cfig_json["inputs"]["geometry_3d"] == "porous_sphere", "Porous spherical burner 3D geometry failed"

    # 5) Donanım Rafı Filtresi (MSG: BASS, BASS-II, SPICE, SLISE) & Soruşturma-İçi Test Matrisi testi
    r_rank = client.post(
        "/api/rank",
        json={"mission_params": {"gravity_g": 0.0, "oxygen_pct": 21.0}, "query": "", "hardware_filter": "MSG"},
        headers=csrf_hdrs,
    )
    assert r_rank.status_code == 200
    rank_json = r_rank.get_json()
    msg_exps = rank_json["ranked_experiments"]
    assert len(msg_exps) == 4, f"Expected 4 MSG experiments, got {len(msg_exps)}"
    assert len(msg_exps[0].get("intra_runs", [])) >= 3, "Intra-investigation test matrix missing"

    # Sentetik mavi küresel 0G alev görseli ile /api/ingest-media testi
    img = _PILImage.new("RGB", (128, 128), (5, 8, 15))
    for y in range(34, 94):
        for x in range(34, 94):
            if (x - 64) ** 2 + (y - 64) ** 2 <= 28 ** 2:
                img.putpixel((x, y), (40, 165, 255))
    buf = io.BytesIO()
    img.save(buf, format="PNG")
    buf.seek(0)
    r_img = client.post(
        "/api/ingest-media",
        data={"file": (buf, "flex_0g_sphere.png")},
        content_type="multipart/form-data",
        headers=csrf_hdrs,
    )
    assert r_img.status_code == 200 and r_img.get_json()["media_type"] == "image", "Image ingestion failed"

    # Sentetik CSV D² verisi ile /api/ingest-media testi
    csv_bytes = b"time_s,diameter_mm,oxygen_pct,pressure_psia,airflow_cms\n0.0,3.6,34.0,8.2,4.5\n2.0,2.8,34.0,8.2,4.5\n4.0,1.6,34.0,8.2,4.5\n"
    r_csv = client.post(
        "/api/ingest-media",
        data={"file": (io.BytesIO(csv_bytes), "artemis_droplet.csv")},
        content_type="multipart/form-data",
        headers=csrf_hdrs,
    )
    assert r_csv.status_code == 200
    csv_json = r_csv.get_json()
    assert csv_json["extracted_sim_params"]["oxygen_pct"] == 34.0, "CSV parameter extraction failed"

    # Asenkron sohbet görevi başlatma ve sorgulama testi
    r_start = client.post(
        "/api/chat/start",
        json={"message": "Ra ve Sh sayılarını açıkla", "provider_override": "custom"},
        headers=csrf_hdrs,
    )
    assert r_start.status_code == 200 and r_start.get_json().get("job_id"), "Async chat start failed"

    print("SELF-TEST PASSED: Zero-Trust Isolation (CSRF/Host/Origin/CSP/SSRF), 3D WebGL, ISS R^2 Validation & Cabin Clock verified 100%!")
    return 0


def main() -> None:
    parser = argparse.ArgumentParser(description="ALTAR-NASA: Flame in Freefall Web Platform v5.0 (Zero-Trust Isolated)")
    parser.add_argument("--headless", action="store_true", help="Run isolated loopback web server without Tk window")
    parser.add_argument("--port", type=int, default=int(os.environ.get("PORT", 8765)), help="Local loopback HTTP port")
    parser.add_argument("--host", type=str, default="127.0.0.1", help="Locked to 127.0.0.1 for Zero-Trust isolation")
    parser.add_argument("--self-test", action="store_true", help="Run automated security & integration self-test")
    args = parser.parse_args()

    if args.self_test:
        sys.exit(run_self_test())

    # Sıfır-Güven İzolasyon Zorunluluğu: Asla 0.0.0.0 veya harici ağ kartı dinlenmez!
    safe_host = "127.0.0.1"

    if _check_existing_altar_nasa(args.port):
        open_in_app_window(f"http://127.0.0.1:{args.port}")
        return

    port = _find_available_port(args.port)
    app = create_nasa_web_app()
    url = f"http://127.0.0.1:{port}"

    if args.headless:
        print(f"ALTAR-NASA v5.0 Zero-Trust Loopback Server listening strictly on {url}")
        srv = make_server(safe_host, port, app, threaded=True)
        srv.serve_forever()
    else:
        srv_thread = BackgroundServerThread(app, safe_host, port)
        srv_thread.start()
        time.sleep(0.15)
        launch_desktop_controller(url, srv_thread)


if __name__ == "__main__":
    main()
