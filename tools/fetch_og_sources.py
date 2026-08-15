#!/usr/bin/env python3
"""Download the source photos used on service and insight pages."""
import io, json, os, sys, urllib.request
from PIL import Image
UA={"User-Agent":"Mozilla/5.0 (compatible; FliiOG/1.0)"}
def main():
    cfg=json.load(open("tools/og-sources.json"))
    os.makedirs("assets/og-src", exist_ok=True)
    bad=[]
    for it in cfg:
        n,u=it["name"],it["url"]
        try:
            with urllib.request.urlopen(urllib.request.Request(u,headers=UA),timeout=45) as r:
                data=r.read()
            im=Image.open(io.BytesIO(data)).convert("RGB")
            # ruim genoeg voor een laptopscherm in 1200x630
            if im.width>1400:
                im=im.resize((1400, round(im.height*1400/im.width)), Image.LANCZOS)
            im.save(f"assets/og-src/{n}.jpg","JPEG",quality=88,optimize=True)
            print(f"OK   {n:44} {im.width}x{im.height}")
        except Exception as e:
            bad.append(n); print(f"FAIL {n:44} {type(e).__name__}: {e}")
    print(f"\nklaar: {len(cfg)-len(bad)}/{len(cfg)}")
    return 0
if __name__=="__main__": sys.exit(main())
