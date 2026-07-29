#!/usr/bin/env python3
"""Read YouTube playlists without an API key.
RSS feed first, playlist page as fallback, oEmbed to fill in missing titles.
A playlist can be split into several named lists with `from` / `to`."""
import json, os, re, sys, time, urllib.request
from xml.etree import ElementTree as ET

UA = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
                    "(KHTML, like Gecko) Chrome/122 Safari/537.36",
      "Accept-Language": "nl-NL,nl;q=0.9,en;q=0.8",
      "Cookie": "CONSENT=YES+cb; SOCS=CAI"}
NS = {"a": "http://www.w3.org/2005/Atom",
      "yt": "http://www.youtube.com/xml/schemas/2015"}


def get(url):
    with urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=45) as r:
        return r.read()


def from_feed(pid):
    root = ET.fromstring(get(f"https://www.youtube.com/feeds/videos.xml?playlist_id={pid}"))
    title = root.findtext("a:title", default="", namespaces=NS)
    out = []
    for e in root.findall("a:entry", NS):
        vid = e.findtext("yt:videoId", default="", namespaces=NS)
        t = e.findtext("a:title", default="", namespaces=NS)
        if vid:
            out.append({"id": vid, "title": (t or "").strip()})
    return title, out


def from_page(pid):
    html = get(f"https://www.youtube.com/playlist?list={pid}&hl=nl").decode("utf-8", "replace")
    m = re.search(r'<meta name="title" content="([^"]*)"', html)
    title = m.group(1) if m else ""
    seen, out = set(), []
    for vid in re.findall(r'"videoId":"([\w-]{11})"', html):
        if vid not in seen:
            seen.add(vid)
            out.append({"id": vid, "title": ""})
    return title, out


def oembed_title(vid):
    try:
        raw = get("https://www.youtube.com/oembed?url="
                  f"https://www.youtube.com/watch?v={vid}&format=json")
        return json.loads(raw).get("title", "")
    except Exception:
        return ""


def main():
    cfg = json.load(open("tools/playlists.json"))
    os.makedirs("assets/playlists", exist_ok=True)
    cache, report = {}, []

    for item in cfg:
        name, pid = item["name"], item["playlist"]
        if pid not in cache:
            title, vids = "", []
            try:
                title, vids = from_feed(pid)
            except Exception as e:
                print(f"     feed faalde ({pid}): {type(e).__name__}")
            try:
                t2, v2 = from_page(pid)
                if len(v2) > len(vids):
                    known = {v["id"]: v["title"] for v in vids}
                    vids = [{"id": v["id"], "title": known.get(v["id"], "")} for v in v2]
                    title = title or t2
            except Exception as e:
                print(f"     page faalde ({pid}): {type(e).__name__}")
            for v in vids:
                if not v["title"]:
                    v["title"] = oembed_title(v["id"])
                    time.sleep(0.2)
            cache[pid] = (title, vids)

        title, vids = cache[pid]
        a = item.get("from", 1) - 1
        b = item.get("to", len(vids))
        part = [dict(v) for v in vids[a:b]]
        label = item.get("label") or title or name
        json.dump({"name": name, "playlist": pid, "title": label, "videos": part},
                  open(f"assets/playlists/{name}.json", "w"), ensure_ascii=False, indent=2)
        print(f"OK   {name:26} '{label}'  {len(part)} video's")
        for i, v in enumerate(part, 1):
            print(f"        {i:>2}. {v['id']}  {v['title'][:64]}")
        report.append({"name": name, "label": label, "count": len(part),
                       "missing_titles": sum(1 for v in part if not v["title"])})

    json.dump(report, open("assets/playlists/_report.json", "w"), ensure_ascii=False, indent=2)
    return 0


if __name__ == "__main__":
    sys.exit(main())
