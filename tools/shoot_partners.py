#!/usr/bin/env python3
"""Maak eenmalig een schermafdruk van elke partnersite."""
import json, os, sys
from playwright.sync_api import sync_playwright

def main():
    cfg = json.load(open("tools/partners.json"))
    os.makedirs("assets/partners", exist_ok=True)
    bad = []
    with sync_playwright() as p:
        b = p.chromium.launch()
        for it in cfg:
            n, u = it["name"], it["url"]
            try:
                ctx = b.new_context(viewport={"width": 1440, "height": 900},
                                    device_scale_factor=1.5)
                pg = ctx.new_page()
                pg.goto(u, wait_until="domcontentloaded", timeout=60000)
                try:
                    pg.wait_for_load_state("networkidle", timeout=15000)
                except Exception:
                    pass
                pg.wait_for_timeout(3500)
                # cookiemeldingen wegklikken waar mogelijk
                for tekst in ["Accepteren", "Accept", "Akkoord", "Alles accepteren",
                              "Souhlasím", "Přijmout vše", "Got it", "OK"]:
                    try:
                        pg.get_by_role("button", name=tekst, exact=False).first.click(timeout=1200)
                        pg.wait_for_timeout(700)
                        break
                    except Exception:
                        pass
                pg.screenshot(path=f"assets/partners/{n}.png", full_page=False)
                print(f"OK   {n:20} {u}")
                ctx.close()
            except Exception as e:
                bad.append(n)
                print(f"FAIL {n:20} {type(e).__name__}: {str(e)[:80]}")
        b.close()
    # naar webp voor het web
    from PIL import Image
    for it in cfg:
        n = it["name"]
        f = f"assets/partners/{n}.png"
        if not os.path.exists(f):
            continue
        im = Image.open(f).convert("RGB")
        if im.width > 1400:
            im = im.resize((1400, round(im.height * 1400 / im.width)), Image.LANCZOS)
        im.save(f"assets/partners/{n}.webp", "WEBP", quality=84, method=5)
        im.save(f"assets/partners/{n}.jpg", "JPEG", quality=84, optimize=True, progressive=True)
        os.remove(f)
        print(f"     {n}: webp {os.path.getsize(f'assets/partners/{n}.webp')//1024} kB")
    print(f"\nklaar: {len(cfg)-len(bad)}/{len(cfg)}")
    return 0

if __name__ == "__main__":
    sys.exit(main())
