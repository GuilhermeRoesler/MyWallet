"""Recolor My Wallet icon from blue to brand teal and rebuild favicons."""
from __future__ import annotations

import colorsys
import struct
import zlib
from pathlib import Path

from PIL import Image

ROOT = Path(r"C:\Users\Gui\Desktop\Projetos\repo update\My-Wallet")
PUBLIC = ROOT / "public"
ASSETS = Path(
    r"C:\Users\Gui\.cursor\projects\c-Users-Gui-Desktop-Projetos-repo-update-My-Wallet\assets"
)

# Brand primary ≈ HSL(168, 78%, 24%) / theme-color #0F766E
BRAND_HEX = (0x0F, 0x76, 0x6E)  # #0F766E
LIGHT_HEX = (0x14, 0xB8, 0xA6)  # #14B8A6 teal-500 (top of gradient)
DARK_HEX = (0x0D, 0x5C, 0x56)  # #0D5C56 deep teal (bottom)


def hex_to_hsv(rgb: tuple[int, int, int]) -> tuple[float, float, float]:
    r, g, b = rgb
    return colorsys.rgb_to_hsv(r / 255, g / 255, b / 255)


def lerp(a: float, b: float, t: float) -> float:
    return a + (b - a) * t


def recolor(src: Path, dst: Path) -> Image.Image:
    img = Image.open(src).convert("RGBA")
    w, h = img.size
    px = img.load()

    # Collect colored (non-white) value range for gradient remapping
    values: list[float] = []
    for y in range(0, h, max(1, h // 60)):
        for x in range(0, w, max(1, w // 60)):
            r, g, b, a = px[x, y]
            if a < 200:
                continue
            hh, ss, vv = colorsys.rgb_to_hsv(r / 255, g / 255, b / 255)
            if ss < 0.12 and vv > 0.85:
                continue
            if vv < 0.05:
                continue
            values.append(vv)

    vmin, vmax = (min(values), max(values)) if values else (0.3, 0.95)
    print(f"value range {vmin:.3f}..{vmax:.3f} samples={len(values)}")

    brand_h, brand_s, brand_v = hex_to_hsv(BRAND_HEX)
    light_h, light_s, light_v = hex_to_hsv(LIGHT_HEX)
    dark_h, dark_s, dark_v = hex_to_hsv(DARK_HEX)

    out = Image.new("RGBA", (w, h))
    op = out.load()

    for y in range(h):
        # vertical gradient bias: lighter top, darker bottom
        y_t = y / max(1, h - 1)
        for x in range(w):
            r, g, b, a = px[x, y]
            if a == 0:
                op[x, y] = (0, 0, 0, 0)
                continue

            hh, ss, vv = colorsys.rgb_to_hsv(r / 255, g / 255, b / 255)

            # Keep white glyph / near-white
            if ss < 0.14 and vv > 0.82:
                op[x, y] = (255, 255, 255, a)
                continue

            # Keep fully transparent / near-black outside squircle
            if vv < 0.04 and ss < 0.2:
                op[x, y] = (r, g, b, a)
                continue

            # Normalize original brightness into 0..1 within colored range
            t = 0.0 if vmax <= vmin else (vv - vmin) / (vmax - vmin)
            t = max(0.0, min(1.0, t))
            # Combine with vertical position for a natural teal gradient
            g_t = max(0.0, min(1.0, 0.55 * (1 - t) + 0.45 * y_t))

            # Interpolate dark -> brand -> light inverted: high t = lighter
            # g_t 0 = light (top/bright), 1 = dark (bottom)
            if g_t < 0.5:
                u = g_t / 0.5
                nh = lerp(light_h, brand_h, u)
                ns = lerp(light_s, brand_s, u)
                nv = lerp(light_v, brand_v, u)
            else:
                u = (g_t - 0.5) / 0.5
                nh = lerp(brand_h, dark_h, u)
                ns = lerp(brand_s, dark_s, u)
                nv = lerp(brand_v, dark_v, u)

            # Soften AA / edge pixels that are low alpha or desaturated
            if ss < 0.25:
                # blend toward brand for anti-aliased edges
                nh, ns, nv = brand_h, brand_s * 0.7, max(nv, brand_v * 0.9)

            nr, ng, nb = colorsys.hsv_to_rgb(nh, ns, nv)
            op[x, y] = (int(nr * 255), int(ng * 255), int(nb * 255), a)

    out.save(dst, "PNG", optimize=True)
    print(f"saved {dst} ({dst.stat().st_size} bytes)")
    return out


def write_svg_favicon(path: Path) -> None:
    # Lightweight vector mark matching wallet + growth badge on brand teal
    svg = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" role="img">
  <defs>
    <linearGradient id="bg" x1="64" y1="0" x2="64" y2="128" gradientUnits="userSpaceOnUse">
      <stop stop-color="#14B8A6"/>
      <stop offset="0.55" stop-color="#0F766E"/>
      <stop offset="1" stop-color="#0D5C56"/>
    </linearGradient>
  </defs>
  <rect width="128" height="128" rx="28" fill="url(#bg)"/>
  <!-- wallet -->
  <path fill="#fff" d="M30 44c0-5.5 4.5-10 10-10h48c5.5 0 10 4.5 10 10v8h6c4.4 0 8 3.6 8 8v28c0 7.7-6.3 14-14 14H40c-7.7 0-14-6.3-14-14V44zm58 18v28c0 3.3-2.7 6-6 6H40c-3.3 0-6-2.7-6-6V48c0-2.2 1.8-4 4-4h40c2.2 0 4 1.8 4 4v6h6c2.2 0 4 1.8 4 4z"/>
  <circle fill="#fff" cx="92" cy="72" r="5"/>
  <rect fill="#fff" x="42" y="34" width="28" height="8" rx="2"/>
  <!-- growth badge -->
  <circle fill="#fff" cx="44" cy="92" r="18"/>
  <path fill="#0F766E" d="M34 98h5v-8h-5v8zm8 0h5v-14h-5v14zm9.2-2.2 5.3-5.3 3.2 3.2 1.8-1.8-5-5-3.2 3.2-7.1-7.1-1.8 1.8 8.8 8.8z"/>
  <path fill="#0F766E" d="M55.5 88.5h4v-2.5h2.5v-4H59.5V79.5h-4v2.5H53v4h2.5v2.5z"/>
</svg>
"""
    path.write_text(svg.strip() + "\n", encoding="utf-8")
    print(f"saved {path}")


def png_chunk(tag: bytes, data: bytes) -> bytes:
    return struct.pack(">I", len(data)) + tag + data + struct.pack(">I", zlib.crc32(tag + data) & 0xFFFFFFFF)


def image_to_png_bytes(im: Image.Image) -> bytes:
    import io

    buf = io.BytesIO()
    im.save(buf, format="PNG")
    return buf.getvalue()


def write_ico(path: Path, source: Image.Image, sizes=(16, 32, 48)) -> None:
    # Simple multi-size ICO with embedded PNGs (modern ICO)
    images: list[tuple[int, bytes]] = []
    for size in sizes:
        resized = source.resize((size, size), Image.Resampling.LANCZOS)
        # Ensure opaque background for small favicons (no soft alpha fringe)
        if resized.mode != "RGBA":
            resized = resized.convert("RGBA")
        images.append((size, image_to_png_bytes(resized)))

    # ICONDIR + ICONDIRENTRY * n + data
    count = len(images)
    header = struct.pack("<HHH", 0, 1, count)
    entries = b""
    offset = 6 + 16 * count
    data_blobs = b""
    for size, png in images:
        w = 0 if size >= 256 else size
        h = 0 if size >= 256 else size
        entries += struct.pack("<BBBBHHII", w, h, 0, 0, 1, 32, len(png), offset)
        data_blobs += png
        offset += len(png)

    path.write_bytes(header + entries + data_blobs)
    print(f"saved {path} ({path.stat().st_size} bytes)")


def main() -> None:
    # Prefer pristine blue original from git checkout temp if present
    orig_candidates = [
        Path(r"C:\Users\Gui\AppData\Local\Temp\icon-blue-orig.png"),
        PUBLIC / "icon.png",
    ]
    src = next(p for p in orig_candidates if p.exists() and p.stat().st_size > 1000)
    print(f"source: {src} ({src.stat().st_size})")

    # If source is already recolored (small), restore from git via subprocess note:
    # Temp file from git show should be the large blue original (~912k)
    icon = recolor(src, PUBLIC / "icon.png")
    icon.save(ASSETS / "my-wallet-icon-teal-final.png", "PNG")

    write_svg_favicon(PUBLIC / "favicon.svg")
    write_ico(PUBLIC / "favicon.ico", icon)

    # Spot-check colors
    w, h = icon.size
    for x, y in [(w // 2, h // 10), (w // 2, h // 2), (w // 2, 9 * h // 10)]:
        r, g, b, a = icon.getpixel((x, y))
        print(f"pixel({x},{y})=#{r:02X}{g:02X}{b:02X}")


if __name__ == "__main__":
    main()
