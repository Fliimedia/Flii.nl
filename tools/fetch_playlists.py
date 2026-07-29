#!/usr/bin/env python3
"""Read YouTube playlists and store id, title and thumbnail per video."""
import json, os, re, sys, urllib.request

UA = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
                    "(KHTML, like Gecko) Chrome/122 Safari/537.36",
      "Accept-Language": "nl-NL,nl;q=0.9,en;q=0.8"}


def fetch(pid):
    url = f"https://www.youtube.com/playlist?list={pid}&hl=nl"
    req = urllib.request.Request(url, headers=UA)
    with urllib.request.urlopen(req, timeout=45) as r:
        return r.read().decode("utf-8", "replace")


def parse(html):
    m = re.search(r"var ytInitialData\s*=\s*(\{.*?\});</script>", html, re.S)
    if not m:
        m = re.search(r'ytInitialData"\]\s*=\s*(\{.*?\});', html, re.S)
    if not m:
        return None, []
    data = json.loads(m.group(1))

    title = None
    try:
        title = data["metadata"]["playlistMetadataRenderer"]["title"]
    except Exception:
        pass

    vids, seen = [], set()

    def walk(node):
        if isinstance(node, dict):
            if "playlistVideoRenderer" in node:
                v = node["playlistVideoRenderer"]
                vid = v.get("videoId")
                if vid and vid not in seen:
                    seen.add(vid)
                    t = ""
                    tt = v.get("title", {})
                    if "runs" in tt:
                        t = "".join(r.get("text", "") for r in tt["runs"])
                    elif "simpleText" in tt:
                        t = tt["simpleText"]
                    dur = ""
                    d = v.get("lengthText", {})
                    dur = d.get("simpleText", "")
                    vids.append({"id": vid, "title": t.strip(), "duration": dur})
            for x in node.values():
                walk(x)
        elif isinstance(node, list):
            for x in node:
                walk(x)

    walk(data)
    return title, vids


def main():
    cfg = json.load(open("tools/playlists.json"))
    os.makedirs("assets/playlists", exist_ok=True)
    report = []
    for item in cfg:
        name, pid = item["name"], item["playlist"]
        try:
            title, vids = parse(fetch(pid))
            out = {"name": name, "playlist": pid, "title": title or name, "videos": vids}
            json.dump(out, open(f"assets/playlists/{name}.json", "w"),
                      ensure_ascii=False, indent=2)
            print(f"OK   {name:28} '{title}'  {len(vids)} video's")
            for i, v in enumerate(vids, 1):
                print(f"        {i:>2}. {v['id']}  {v['duration']:>6}  {v['title'][:64]}")
            report.append({"name": name, "title": title, "count": len(vids)})
        except Exception as e:
            print(f"FAIL {name:28} {type(e).__name__}: {e}")
            report.append({"name": name, "error": str(e)[:200]})
    json.dump(report, open("assets/playlists/_report.json", "w"), ensure_ascii=False, indent=2)
    return 0


if __name__ == "__main__":
    sys.exit(main())
