# -*- coding: utf-8 -*-
"""
Güvenli Yapılandırma, API Anahtar Kasası ve Sistem SSL Yöneticisi.
Hiçbir sabit sürücü/kullanıcı yolu (hardcoded path) veya SSL doğrulama iptali içermez.
"""

from __future__ import annotations

import json
import os
import ssl
import sys
import threading
from pathlib import Path
from typing import Any, Dict

import requests
from requests.adapters import HTTPAdapter

try:
    from dotenv import load_dotenv
except ImportError:
    load_dotenv = None


class SystemSSLAdapter(HTTPAdapter):
    """
    Python 3.13+ OpenSSL 3.x uyumlu, Windows/OS güvenilir kök sertifika deposunu kullanan güvenli HTTPS adaptörü.
    `verify=False` kullanmadan kurumsal/antivirüs kök sertifikalarındaki 'Missing Authority Key Identifier' hatasını çözer.
    """

    def init_poolmanager(self, *args: Any, **kwargs: Any) -> Any:
        ctx = ssl.create_default_context()
        if hasattr(ssl, "VERIFY_X509_STRICT"):
            ctx.verify_flags &= ~ssl.VERIFY_X509_STRICT
        kwargs["ssl_context"] = ctx
        return super().init_poolmanager(*args, **kwargs)

    def proxy_manager_for(self, *args: Any, **kwargs: Any) -> Any:
        ctx = ssl.create_default_context()
        if hasattr(ssl, "VERIFY_X509_STRICT"):
            ctx.verify_flags &= ~ssl.VERIFY_X509_STRICT
        kwargs["ssl_context"] = ctx
        return super().proxy_manager_for(*args, **kwargs)


def create_secure_http_session() -> requests.Session:
    """Tüm NASA API ve Bulut AI çağrıları için güvenli HTTPS oturumu üretir."""
    session = requests.Session()
    session.mount("https://", SystemSSLAdapter())
    session.headers.update({
        "User-Agent": "ALTAR-NASA-FlameInFreefall/3.0 (NASA-SpaceApps-2026; Scientific-Dashboard)"
    })
    return session


def get_resource_base_dir() -> Path:
    """PyInstaller (_MEIPASS) veya kaynak kod çalışma dizinini taşınabilir biçimde döndürür."""
    if getattr(sys, "frozen", False) and hasattr(sys, "_MEIPASS"):
        return Path(getattr(sys, "_MEIPASS"))
    return Path(__file__).resolve().parent.parent


def get_app_host_dir() -> Path:
    """Çalıştırılan .exe dosyasının veya kaynak proje kökünün bulunduğu dizini döndürür."""
    if getattr(sys, "frozen", False):
        return Path(sys.executable).resolve().parent
    return Path(__file__).resolve().parent.parent


def get_user_data_dir() -> Path:
    """Klasör-içi taşınabilir kurulum (.runtime) varsa orayı, yoksa %APPDATA%/AltarNasa dizinini döndürür."""
    host_dir = get_app_host_dir()
    for cand_rt in (host_dir / ".runtime", host_dir.parent / ".runtime"):
        if cand_rt.is_dir():
            portable_cfg = cand_rt / "userdata"
            try:
                portable_cfg.mkdir(parents=True, exist_ok=True)
                return portable_cfg
            except Exception:
                pass
    appdata = os.environ.get("APPDATA")
    if appdata:
        base = Path(appdata) / "AltarNasa"
    else:
        base = Path.home() / ".altar_nasa"
    base.mkdir(parents=True, exist_ok=True)
    return base


class ConfigManager:
    """API anahtarlarını, aktif AI sağlayıcısını ve kullanıcı direktif tercihlerini thread-safe yönetir."""

    DEFAULT_CONFIG: Dict[str, Any] = {
        "active_provider": "auto",  # auto | ollama | antigravity | gemini | openrouter | custom
        "ollama_host": "http://127.0.0.1:11434",
        "ollama_model": "auto",
        "gemini_api_key": "",
        "gemini_model": "gemini-2.5-flash",
        "openrouter_api_key": "",
        "openrouter_model": "google/gemini-2.0-flash-exp:free",
        "antigravity_api_key": "",
        "antigravity_mode": "cli_sdk_or_api",
        "antigravity_model": "gemini-3.8-flash-high",
        "custom_base_url": "",
        "custom_api_key": "",
        "custom_model": "",
        "deep_verify_6stage": True,
        "auto_sync_media_to_3d": True,
        "language": "tr",
        "custom_extra_directives": "",
    }

    def __init__(self) -> None:
        self._lock = threading.Lock()
        self.config_path = get_user_data_dir() / "config.json"
        self._load_optional_local_dotenv()
        self._data: Dict[str, Any] = dict(self.DEFAULT_CONFIG)
        self.load()

    def _load_optional_local_dotenv(self) -> None:
        """Yalnızca çalışma dizininde .env varsa ortam değişkenlerine yükler (pakete gömmez)."""
        if load_dotenv is None:
            return
        candidates = [
            Path.cwd() / ".env",
            get_resource_base_dir() / ".env",
        ]
        for env_file in candidates:
            if env_file.is_file():
                try:
                    load_dotenv(dotenv_path=env_file, override=False)
                except Exception:
                    pass

    def load(self) -> Dict[str, Any]:
        with self._lock:
            merged = dict(self.DEFAULT_CONFIG)
            # Ortam değişkenlerinden başlangıç değerleri
            if os.environ.get("OLLAMA_HOST"):
                merged["ollama_host"] = os.environ["OLLAMA_HOST"].strip()
            if os.environ.get("GEMINI_API_KEY"):
                merged["gemini_api_key"] = os.environ["GEMINI_API_KEY"].strip().strip('"')
            if os.environ.get("OPENROUTER_API_KEY"):
                merged["openrouter_api_key"] = os.environ["OPENROUTER_API_KEY"].strip().strip('"')
            if os.environ.get("ANTIGRAVITY_API_KEY"):
                merged["antigravity_api_key"] = os.environ["ANTIGRAVITY_API_KEY"].strip().strip('"')
            if os.environ.get("CUSTOM_OPENAI_BASE_URL"):
                merged["custom_base_url"] = os.environ["CUSTOM_OPENAI_BASE_URL"].strip()

            if self.config_path.is_file():
                try:
                    saved = json.loads(self.config_path.read_text(encoding="utf-8"))
                    if isinstance(saved, dict):
                        for k, v in saved.items():
                            if k in merged and v is not None:
                                if k.endswith("_api_key") and not str(v).strip() and merged.get(k):
                                    continue
                                merged[k] = v
                except Exception:
                    pass
            self._data = merged
            return dict(self._data)

    def save(self, updates: Dict[str, Any]) -> Dict[str, Any]:
        with self._lock:
            for k, v in updates.items():
                if k in self.DEFAULT_CONFIG and v is not None:
                    if isinstance(v, str):
                        v_clean = v.strip()
                        # Maskelenmiş anahtar geri gönderildiyse mevcut gerçek anahtarı koru
                        if k.endswith("_api_key") and "•" in v_clean:
                            continue
                        self._data[k] = v_clean
                    else:
                        self._data[k] = v
            try:
                self.config_path.write_text(
                    json.dumps(self._data, ensure_ascii=False, indent=2),
                    encoding="utf-8",
                )
            except Exception:
                pass
            return dict(self._data)

    def get_all(self) -> Dict[str, Any]:
        with self._lock:
            return dict(self._data)

    def get_masked_public_view(self) -> Dict[str, Any]:
        """Ön yüze gönderilirken API anahtarlarını güvenli şekilde maskeler."""
        raw = self.get_all()
        out: Dict[str, Any] = {}
        for k, v in raw.items():
            if k.endswith("_api_key") and isinstance(v, str):
                if len(v) > 8:
                    out[k] = f"{v[:4]}{'•' * 12}{v[-4:]}"
                    out[f"{k}_configured"] = True
                elif len(v) > 0:
                    out[k] = "•" * 8
                    out[f"{k}_configured"] = True
                else:
                    out[k] = ""
                    out[f"{k}_configured"] = False
            else:
                out[k] = v
        out["storage_path"] = str(self.config_path)
        return out
