#!/usr/bin/env python3
"""Haal extern gehoste afbeeldingen binnen en sla ze op als WebP + JPEG."""
import io, json, os, sys, urllib.request
from PIL import Image
UA={"User-Agent":"Mozilla/5.0 (compatible; FliiAssets/1.0)","Accept":"image/*,*/*"}
MAXW=1400
def main():
    cfg=json.load(open("tools/external-images.json"))
    os.makedirs("assets/media", exist_ok=True)
    bad=[]; tot_j=tot_w=0
    for it in cfg:
        n,u=it["name"],it["url"]
        try:
            with urllib.request.urlopen(urllib.request.Request(u,headers=UA),timeout=45) as r:
                data=r.read()
            im=Image.open(io.BytesIO(data))
            heeft_alfa = im.mode in ("RGBA","LA","P")
            im = im.convert("RGBA") if heeft_alfa else im.convert("RGB")
            if im.width>MAXW:
                im=im.resize((MAXW, round(im.height*MAXW/im.width)), Image.LANCZOS)
            im.save(f"assets/media/{n}.webp","WEBP",quality=82,method=5)
            tot_w+=os.path.getsize(f"assets/media/{n}.webp")
            fb = im.convert("RGB") if heeft_alfa else im
            ext = "png" if heeft_alfa else "jpg"
            if heeft_alfa:
                im.save(f"assets/media/{n}.png","PNG",optimize=True)
            else:
                fb.save(f"assets/media/{n}.jpg","JPEG",quality=84,optimize=True,progressive=True)
            tot_j+=os.path.getsize(f"assets/media/{n}.{ext}")
            print(f"OK   {n}  {im.width}x{im.height}  webp {os.path.getsize(f'assets/media/{n}.webp')//1024}kB")
        except Exception as e:
            bad.append(n); print(f"FAIL {n}  {type(e).__name__}: {str(e)[:70]}  {u[:60]}")
    print(f"\nklaar: {len(cfg)-len(bad)}/{len(cfg)} | webp {tot_w/1024/1024:.1f} MB, fallback {tot_j/1024/1024:.1f} MB")
    json.dump(bad, open("assets/media/_failed.json","w"))
    return 0
if __name__=="__main__": sys.exit(main())
