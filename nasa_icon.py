# -*- coding: utf-8 -*-
"""ALTAR-NASA 0G Küresel Mavi Alev Masaüstü İkon Üreticisi (.ico)."""

from __future__ import annotations

import math
from pathlib import Path
from PIL import Image, ImageDraw, ImageFilter


def generate_nasa_ico(target_path: Path) -> Path:
    size = 256
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    # Koyu uzay dairesel rozet zemini
    draw.ellipse((8, 8, 248, 248), fill=(7, 14, 30, 255), outline=(30, 64, 124, 255), width=6)

    # Yumuşak 0G küresel mavi alev katmanları
    glow = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    gdraw = ImageDraw.Draw(glow)
    gdraw.ellipse((36, 36, 220, 220), fill=(29, 78, 216, 120))
    gdraw.ellipse((56, 56, 200, 200), fill=(14, 165, 233, 190))
    gdraw.ellipse((78, 78, 178, 178), fill=(125, 211, 252, 235))
    gdraw.ellipse((102, 102, 154, 154), fill=(240, 249, 255, 255))
    # Merkezde yakıt damlacığı çekirdeği
    gdraw.ellipse((116, 116, 140, 140), fill=(15, 23, 42, 235))
    glow = glow.filter(ImageFilter.GaussianBlur(radius=6))
    img = Image.alpha_composite(img, glow)

    # İnce yörünge halkası
    draw2 = ImageDraw.Draw(img)
    draw2.arc((22, 74, 234, 182), start=155, end=385, fill=(56, 189, 248, 230), width=4)
    # Küçük uydu / sensör noktası
    sx = int(128 + 104 * math.cos(math.radians(35)))
    sy = int(128 + 52 * math.sin(math.radians(35)))
    draw2.ellipse((sx - 6, sy - 6, sx + 6, sy + 6), fill=(251, 191, 36, 255))

    target_path.parent.mkdir(parents=True, exist_ok=True)
    img.save(
        target_path,
        format="ICO",
        sizes=[(256, 256), (128, 128), (64, 64), (48, 48), (32, 32), (16, 16)],
    )
    return target_path


if __name__ == "__main__":
    out = Path(__file__).resolve().parent / "web" / "static" / "nasa_flame.ico"
    generate_nasa_ico(out)
    print(f"Generated icon: {out}")
