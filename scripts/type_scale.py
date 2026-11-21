#!/usr/bin/env python3
"""Compare type scale: PDF artboard proportions vs the live site's computed sizes.

Proportions, not pixels: every size is expressed as % of the page width, so a
1280pt artboard and a 1440px viewport are directly comparable.

usage: python3 scripts/type_scale.py
"""
import re
import subprocess

PDF = "/home/attila/Downloads/MoldGuard (1).pdf"
PAGE_W = 1280.0


def words(page):
    xml = subprocess.run(
        ["pdftotext", "-bbox-layout", "-f", str(page), "-l", str(page), PDF, "-"],
        capture_output=True, text=True, check=True).stdout
    out = []
    for m in re.finditer(
        r'<word xMin="([\d.]+)" yMin="([\d.]+)" xMax="([\d.]+)" yMax="([\d.]+)">(.*?)</word>', xml):
        x0, y0, x1, y1, t = m.groups()
        out.append(dict(x0=float(x0), y0=float(y0), x1=float(x1),
                        h=float(y1) - float(y0), text=t))
    return out


def collect(text, x0, x1, y0, y1):
    """Glyph heights of the words of one visual line, in reading order."""
    ws = [w for w in text if y0 - 3 <= w["y0"] <= y1 + 3]
    return ws


def main():
    # page 1 hero headline: the biggest words below the nav
    ws = words(1)
    hero = [w for w in ws if w["y0"] < 700 and w["h"] > 60]
    if hero:
        h = max(w["h"] for w in hero)
        print(f"PDF hero headline : {h:6.1f}pt = {100*h/PAGE_W:5.2f}% of width"
              f"  -> {h/PAGE_W*1440:5.1f}px at a 1440 viewport")
        print("   text:", " ".join(w["text"] for w in sorted(hero, key=lambda w: (w["y0"], w["x0"])))[:90])

    # section headings: 2nd size tier
    h2 = [w for w in ws if 24 < w["h"] < 40]
    if h2:
        from collections import Counter
        c = Counter(round(w["h"], 1) for w in h2)
        size, _ = c.most_common(1)[0]
        print(f"PDF section h2    : {size:6.1f}pt = {100*size/PAGE_W:5.2f}% of width"
              f"  -> {size/PAGE_W*1440:5.1f}px at 1440")

    # body: the dominant small tier
    body = [w for w in ws if 18 < w["h"] < 24]
    if body:
        from collections import Counter
        c = Counter(round(w["h"], 1) for w in body)
        size, _ = c.most_common(1)[0]
        print(f"PDF body          : {size:6.1f}pt = {100*size/PAGE_W:5.2f}% of width"
              f"  -> {size/PAGE_W*1440:5.1f}px at 1440")

    # content column: left inset and right inset from the text itself
    lefts = [(w["x0"], w["text"]) for w in ws if w["h"] > 18]
    left = min(x for x, _ in lefts)
    right = max(w["x1"] for w in ws)
    print(f"PDF content column: x {left:.0f}..{right:.0f} = {100*(right-left)/PAGE_W:.2f}% of width"
          f"  (insets {100*left/PAGE_W:.2f}% / {100*(PAGE_W-right)/PAGE_W:.2f}%)")


if __name__ == "__main__":
    main()
