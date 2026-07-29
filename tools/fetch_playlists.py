#!/usr/bin/env python3
"""Read YouTube playlists via the public RSS feed (no API key required),
falling back to parsing the playlist page when the feed is short."""
import json, os, re, sys, urllib.request
from xml.etree import ElementTree as ET

UA = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
                    "(KHTML, like Gecko) Chrome/122 Safari/537.36",
      "Accept-Language": "nl-NL,nl;q=0.9,en;q=0.8",
      "Cookie": "CONSENT=YES+cb; SOCS=CAI"}
NS = {"a": "http://www.w3.org/2005/Atom",
      "yt": "http://www.youtube.com/xml/schemas/2015",
      "media": "http://search.yahoo.com/mrss/"}


def get(url):
    with urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=45) as r:
        return r.read()


def from_feed(pid):
    xml = get(f"https://www.youtube.com/feeds/videos.xml?playlist_id={pid}")
    root = ET.fromstring(xml)
    title = root.findtext("a:title", default="", namespaces=NS)
    out = []
    for e in root.findall("a:entry", NS):
        vid = e.findtext("yt:videoId", default="", namespaces=NS)
        t = e.findtext("a:title", default="", namespaces=NS)
        if vid:
            out.append({"id": vid, "title": t.strip(), "duration": ""})
    return title, out


def from_page(pid):
    html = get(f"https://www.youtube.com/playlist?list={pid}&hl=nl").decode("utf-8", "replace")
    title = ""
    m = re.search(r'<meta name="title" content="([^"]*)"', html)
    if m:
        title = m.group(1)
    ids, seen, out = re.findall(r'"videoId":"([\w-]{11})"', html), set(), []
    titles = re.findall(r'"videoId":"[\w-]{11}","thumbnail".*?"title":\{"runs":\[\{"text":"(.*?)"\}', html)
    for i, vid in enumerate(ids):
        if vid in seen:
            continue
        seen.add(vid)
        t = titles[i] if i < len(titles) else ""
        out.append({"id": vid, "title": t.encode().decode("unicode_escape", "ignore"),
                    "duration": ""})
    return title, out


def main():
    cfg = json.load(open("tools/playlists.json"))
    os.makedirs("assets/playlists", exist_ok=True)
    report = []
    for item in cfg:
        name, pid = item["name"], item["playlist"]
        title, vids, how = "", [], ""
        try:
            title, vids = from_feed(pid)
            how = "rss"
        except Exception as e:
            print(f"     feed faalde voor {name}: {type(e).__name__}")
        if len(vids) < 2:
            try:
                t2, v2 = from_page(pid)
                if len(v2) > len(vids):
                    title, vids, how = (title or t2), v2, "page"
            except Exception as e:
                print(f"     page faalde voor {name}: {type(e).__name__}")
        out = {"name": name, "playlist": pid, "title": title or name, "videos": vids}
        json.dump(out, open(f"assets/playlists/{name}.json", "w"),
                  ensure_ascii=False, indent=2)
        print(f"{'OK  ' if vids else 'LEEG'} {name:26} '{title}'  {len(vids)} video's  ({how})")
        for i, v in enumerate(vids[:20], 1):
            print(f"        {i:>2}. {v['id']}  {v['title'][:66]}")
        report.append({"name": name, "title": title, "count": len(vids), "via": how})
    json.dump(report, open("assets/playlists/_report.json", "w"), ensure_ascii=False, indent=2)
    return 0


if __name__ == "__main__":
    sys.exit(main())
