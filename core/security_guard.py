# -*- coding: utf-8 -*-
"""
ALTAR-NASA v5.0 Sıfır-Güven (Zero-Trust) İzolasyon ve Siber Güvenlik Kalkanı.
Savunma Katmanları:
1. Salt Yerel Döngü (127.0.0.1 Loopback) Soket ve Host Başlığı Doğrulaması (DNS Rebinding Engeli)
2. Cross-Origin / Cross-Site (Origin & Sec-Fetch-Site) Engeli — Wildcard CORS Kesinlikle Kapalı
3. Kriptografik 192-bit Oturum CSRF Anahtarı (X-Altar-CSRF) Doğrulaması
4. Sıkı Content-Security-Policy (CSP), Clickjacking (X-Frame-Options: DENY) ve MIME Koruması
5. Dış URL Okumalarında Soket/DNS Düzeyinde Özel IP & Bulut Metadata (SSRF) Bloklayıcı
"""

from __future__ import annotations

import hmac
import ipaddress
import re
import secrets
import socket
from typing import Tuple
from urllib.parse import urlparse

from flask import Request, Response

_VALID_LOOPBACK_HOST_RE = re.compile(r"^(127\.0\.0\.1|localhost)(:\d{1,5})?$", re.IGNORECASE)


def generate_session_csrf_token() -> str:
    """Her uygulama açılışında benzersiz 192-bit kriptografik oturum anahtarı üretir."""
    return secrets.token_hex(24)


def verify_request_isolation(req: Request, expected_csrf_token: str) -> Tuple[bool, str]:
    """
    Gelen her HTTP isteğini DNS Rebinding, Cross-Site CSRF ve Yetkisiz Ağ erişimine karşı denetler.
    """
    # 1. İstemci IP kontrolü: Yalnızca 127.0.0.1 / ::1 (veya Flask test_client) kabul edilir
    remote_ip = (req.remote_addr or "127.0.0.1").strip()
    if remote_ip not in ("127.0.0.1", "::1", "localhost"):
        return (False, "Forbidden: Non-loopback client rejected.")

    # 2. Host başlığı kontrolü (DNS Rebinding saldırılarını %100 keser)
    host_hdr = (req.headers.get("Host") or "").strip()
    if not host_hdr or not _VALID_LOOPBACK_HOST_RE.match(host_hdr):
        return (False, "Forbidden: Invalid Host header (DNS rebinding protection).")

    # 3. Tarayıcı Sec-Fetch-Site kontrolü: Başka bir web sekmesinden gelen cross-site istekleri reddet
    sec_site = (req.headers.get("Sec-Fetch-Site") or "").strip().lower()
    if sec_site and sec_site not in ("same-origin", "none"):
        return (False, "Forbidden: Cross-site browser request blocked.")

    # 4. Origin kontrolü: Mevcutsa yalnızca aynı yerel http://127.0.0.1 veya http://localhost portuna izin ver
    origin_hdr = (req.headers.get("Origin") or "").strip()
    if origin_hdr:
        parsed_orig = urlparse(origin_hdr)
        if parsed_orig.scheme != "http" or not _VALID_LOOPBACK_HOST_RE.match(parsed_orig.netloc or ""):
            return (False, "Forbidden: Untrusted Origin blocked.")

    # 5. Durum değiştiren tüm API POST isteklerinde kriptografik X-Altar-CSRF token kontrolü
    if req.path.startswith("/api/") and req.method in ("POST", "PUT", "DELETE", "PATCH"):
        provided_token = (req.headers.get("X-Altar-CSRF") or "").strip()
        if not provided_token or not hmac.compare_digest(provided_token, expected_csrf_token):
            return (False, "Forbidden: Missing or invalid X-Altar-CSRF security token.")

    return (True, "ok")


def apply_hardened_security_headers(response: Response, is_api: bool = False) -> Response:
    """
    Tarayıcı ve yerel sunucu katmanında XSS, Clickjacking, MIME-sniffing ve veri sızıntısını önler.
    Wildcard CORS ('*') KESİNLİKLE kullanılmaz.
    """
    # Herhangi bir eski CORS başlığı kalmışsa temizle
    response.headers.pop("Access-Control-Allow-Origin", None)
    response.headers.pop("Access-Control-Allow-Headers", None)
    response.headers.pop("Access-Control-Allow-Methods", None)

    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["Referrer-Policy"] = "no-referrer"
    response.headers["Cross-Origin-Opener-Policy"] = "same-origin"
    response.headers["Cross-Origin-Resource-Policy"] = "same-origin"
    response.headers["Permissions-Policy"] = (
        "camera=(), microphone=(), geolocation=(), payment=(), usb=(), bluetooth=(), magnetometer=()"
    )
    response.headers["Content-Security-Policy"] = (
        "default-src 'self'; "
        "script-src 'self'; "
        "style-src 'self' 'unsafe-inline'; "
        "img-src 'self' data: blob:; "
        "media-src 'self' blob:; "
        "font-src 'self' data:; "
        "connect-src 'self'; "
        "object-src 'none'; "
        "base-uri 'self'; "
        "frame-ancestors 'none'; "
        "form-action 'self';"
    )

    if is_api:
        response.headers["Cache-Control"] = "no-store, no-cache, must-revalidate, max-age=0"
        response.headers["Pragma"] = "no-cache"
    return response


def validate_external_url_strict(raw_url: str) -> Tuple[bool, str]:
    """
    SSRF (Server-Side Request Forgery) ve DNS Rebinding Koruması:
    - Yalnızca https:// (veya güvenli açık akademik http://) şemasını kabul eder.
    - Kullanıcı adı/parola gömülü URL'leri reddeder.
    - Alan adını DNS ile çözümler ve tüm özel ağ (10.x, 192.168.x, 172.16-31.x), yerel döngü (127.x, ::1),
      link-local / bulut metadata (169.254.169.254) ve ayrılmış IP'leri kesin olarak bloklar.
    """
    clean = (raw_url or "").strip()
    if not clean or len(clean) > 2048:
        return (False, "Geçersiz veya çok uzun URL adresi.")

    try:
        parsed = urlparse(clean)
    except Exception:
        return (False, "URL ayrıştırılamadı.")

    if parsed.scheme not in ("https", "http"):
        return (False, "Güvenlik nedeniyle yalnızca https:// veya http:// protokollerine izin verilir.")

    if parsed.username or parsed.password:
        return (False, "Kimlik bilgisi içeren URL'ler güvenlik kuralı gereği engellendi.")

    hostname = (parsed.hostname or "").strip().lower()
    if not hostname or hostname in ("localhost", "localhost.localdomain", "broadcasthost", "metadata.google.internal"):
        return (False, "Yerel veya iç ağ (localhost/metadata) adreslerine erişim güvenlik kalkanı tarafından engellendi.")

    if parsed.port and parsed.port not in (80, 443):
        return (False, "Güvenlik politikası gereği yalnızca standart web portlarına (80/443) izin verilir.")

    # Doğrudan IP yazılmışsa veya DNS çözümlemesindeki tüm A/AAAA kayıtlarını kontrol et
    try:
        addr_infos = socket.getaddrinfo(hostname, parsed.port or (443 if parsed.scheme == "https" else 80), proto=socket.IPPROTO_TCP)
    except Exception:
        # Eğer doğrudan IP formatındaysa yine de kontrol et
        try:
            ip_direct = ipaddress.ip_address(hostname)
            if _is_forbidden_ip(ip_direct):
                return (False, f"Özel veya iç ağ IP adresi ({ip_direct}) güvenlik kalkanı tarafından engellendi.")
        except ValueError:
            pass
        return (False, f"Alan adı doğrulanamadı: {hostname}")

    if not addr_infos:
        return (False, "Alan adı için geçerli genel IP bulunamadı.")

    for info in addr_infos:
        sockaddr = info[4]
        ip_str = sockaddr[0]
        try:
            ip_obj = ipaddress.ip_address(ip_str)
            if _is_forbidden_ip(ip_obj):
                return (False, f"Güvenlik Engeli (SSRF Koruması): {hostname} iç/yerel bir IP adresine ({ip_str}) çözümleniyor.")
        except ValueError:
            return (False, "Geçersiz IP adresi yanıtı engellendi.")

    return (True, clean)


def _is_forbidden_ip(ip_obj: ipaddress._BaseAddress) -> bool:
    return bool(
        ip_obj.is_private
        or ip_obj.is_loopback
        or ip_obj.is_link_local
        or ip_obj.is_multicast
        or ip_obj.is_reserved
        or ip_obj.is_unspecified
    )
