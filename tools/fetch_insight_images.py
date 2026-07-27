#!/usr/bin/env python3
"""Fetch insight cover images from the old Webflow CDN and store them locally."""
import io, json, os, sys, urllib.request
from PIL import Image

MAX_W = 1200
UA = {"User-Agent": "Mozilla/5.0 (compatible; FliiImageFetcher/1.0)"}

def main():
    cfg = json.load(open("tools/insight-images.json"))
    os.makedirs("assets/insight", exist_ok=True)
    failed = []
    for it in cfg:
        name, url = it["name"], it["url"]
        try:
            req = urllib.request.Request(url, headers=UA)
            with urllib.request.urlopen(req, timeout=45) as r:
                data = r.read()
            img = Image.open(io.BytesIO(data)).convert("RGB")
            if img.width > MAX_W:
                img = img.resize((MAX_W, round(img.height * MAX_W / img.width)), Image.LANCZOS)
            out = f"assets/insight/{name}.jpg"
            img.save(out, "JPEG", quality=82, optimize=True, progressive=True)
            print(f"OK   {name:46} {img.width}x{img.height}  {os.path.getsize(out):,}B")
        except Exception as exc:
            failed.append(name)
            print(f"FAIL {name:46} {type(exc).__name__}: {exc}")
    if failed:
        print("\nFailed:", ", ".join(failed))
    print(f"\nDone: {len(cfg)-len(failed)}/{len(cfg)}")
    return 0

if __name__ == "__main__":
    sys.exit(main())
