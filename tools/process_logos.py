#!/usr/bin/env python3
"""
Fetch brand logos, knock out the background, trim and normalise them.

Reads tools/logos.json  ->  [{"name": "spokk", "url": "https://..."}, ...]
Writes assets/logos/<name>.png  (transparent, trimmed, max 240px tall)

Background removal uses an edge flood-fill rather than a global colour
threshold, so white *inside* the logo (letter counters, highlights) survives.
"""
import io
import json
import os
import sys
import urllib.request
from collections import deque

from PIL import Image

TARGET_H = 240          # source height; the page scales down from here
TOLERANCE = 26          # per-channel distance treated as "same as background"
UA = {"User-Agent": "Mozilla/5.0 (compatible; FliiLogoFetcher/1.0)"}


def get(url: str) -> bytes:
    req = urllib.request.Request(url, headers=UA)
    with urllib.request.urlopen(req, timeout=45) as r:
        return r.read()


def fetch(url: str) -> Image.Image:
    return Image.open(io.BytesIO(get(url))).convert("RGBA")


def discover(site: str) -> str:
    """Find the most likely logo file on a site's homepage."""
    import re as _re
    from urllib.parse import urljoin

    html = get(site).decode("utf-8", "replace")
    cands: list[tuple[int, str]] = []

    for m in _re.finditer(r"<img[^>]+>", html, _re.I):
        tag = m.group(0)
        src = _re.search(r'src=["\']([^"\']+)', tag)
        if not src:
            continue
        u = src.group(1)
        if u.startswith("data:"):
            continue
        blob = tag.lower()
        score = 0
        if "logo" in blob:
            score += 10
        if _re.search(r"header|nav|brand|site-logo|custom-logo", blob):
            score += 6
        if m.start() < len(html) * 0.30:          # near the top of the document
            score += 3
        if u.lower().endswith((".svg", ".png")):
            score += 2
        if _re.search(r"icon|avatar|flag|badge|payment|sprite", blob):
            score -= 8
        if score > 0:
            cands.append((score, urljoin(site, u)))

    for pat, sc in ((r'property=["\']og:image["\'][^>]*content=["\']([^"\']+)', 4),
                    (r'rel=["\']apple-touch-icon["\'][^>]*href=["\']([^"\']+)', 2)):
        m = _re.search(pat, html, _re.I)
        if m:
            cands.append((sc, urljoin(site, m.group(1))))

    if not cands:
        raise RuntimeError("no logo candidate found")
    cands.sort(key=lambda c: -c[0])
    return cands[0][1]


def close(a, b, tol=TOLERANCE) -> bool:
    return abs(a[0] - b[0]) <= tol and abs(a[1] - b[1]) <= tol and abs(a[2] - b[2]) <= tol


def knockout(img: Image.Image) -> Image.Image:
    """Flood-fill transparent from every edge pixel matching the corner colour."""
    img = img.convert("RGBA")
    w, h = img.size
    px = img.load()

    # Only act if the image actually has an opaque background.
    corners = [px[0, 0], px[w - 1, 0], px[0, h - 1], px[w - 1, h - 1]]
    opaque = [c for c in corners if c[3] > 200]
    if not opaque:
        return img                      # already transparent
    bg = max(set(opaque), key=opaque.count)

    seen = bytearray(w * h)
    q = deque()
    for x in range(w):
        for y in (0, h - 1):
            if not seen[y * w + x] and close(px[x, y], bg):
                seen[y * w + x] = 1
                q.append((x, y))
    for y in range(h):
        for x in (0, w - 1):
            if not seen[y * w + x] and close(px[x, y], bg):
                seen[y * w + x] = 1
                q.append((x, y))

    original = img.copy()

    while q:
        x, y = q.popleft()
        px[x, y] = (px[x, y][0], px[x, y][1], px[x, y][2], 0)
        for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)):
            nx, ny = x + dx, y + dy
            if 0 <= nx < w and 0 <= ny < h and not seen[ny * w + nx]:
                if close(px[nx, ny], bg) and px[nx, ny][3] > 0:
                    seen[ny * w + nx] = 1
                    q.append((nx, ny))

    # Safety net: if the fill ate (almost) the whole image the background
    # guess was wrong -- e.g. a white logo on a white plate. Keep the original.
    opaque = sum(1 for p in img.getdata() if p[3] > 40)
    if opaque < 0.02 * w * h:
        return original
    return img


def normalise(img: Image.Image, target_h: int = TARGET_H) -> Image.Image:
    bbox = img.getbbox()                # transparent margins gone
    if bbox:
        img = img.crop(bbox)
    if img.height > target_h:
        ratio = target_h / img.height
        img = img.resize((max(1, round(img.width * ratio)), target_h), Image.LANCZOS)
    return img


def main() -> int:
    cfg = json.load(open("tools/logos.json"))
    os.makedirs("assets/logos", exist_ok=True)
    failed = []
    report = []

    for item in cfg:
        name = item["name"]
        try:
            url = item.get("url")
            if not url:
                url = discover(item["site"])
                print(f"     discovered {name}: {url}")
            img = fetch(url)
            before = img.size
            img = normalise(knockout(img))
            out = f"assets/logos/{name}.png"
            img.save(out, optimize=True)
            print(f"OK   {name:24} {before[0]}x{before[1]} -> {img.width}x{img.height}  {os.path.getsize(out):,}B")
            report.append({"name": name, "status": "ok", "source": url,
                           "size": f"{img.width}x{img.height}"})
        except Exception as exc:                      # noqa: BLE001
            failed.append(name)
            print(f"FAIL {name:24} {type(exc).__name__}: {exc}")
            report.append({"name": name, "status": "failed",
                           "error": f"{type(exc).__name__}: {exc}"[:300]})

    json.dump(report, open("assets/logos/_report.json", "w"), indent=2)
    if failed:
        print("\nFailed:", ", ".join(failed))
    print(f"\nDone: {len(cfg) - len(failed)}/{len(cfg)} logos written")
    return 0


if __name__ == "__main__":
    sys.exit(main())
