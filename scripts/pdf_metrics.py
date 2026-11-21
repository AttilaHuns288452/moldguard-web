#!/usr/bin/env python3
"""Extract design measurements from the Figma PDF export.

The PDF is the approved artboard; the site should match its PROPORTIONS, not its
literal pixels. So this reports everything relative to the 1280pt page width:
font size, line height, left/right inset, and the band (background) at that y.

usage: python3 scripts/pdf_metrics.py <pdf> [page] [--dump]
"""
import re
import subprocess
import sys
from collections import Counter

PAGE_W = 1280.0


def words(pdf, page):
    xml = subprocess.run(
        ["pdftotext", "-bbox-layout", "-f", str(page), "-l", str(page), pdf, "-"],
        capture_output=True, text=True, check=True).stdout
    for m in re.finditer(
        r'<word xMin="([\d.]+)" yMin="([\d.]+)" xMax="([\d.]+)" yMax="([\d.]+)">(.*?)</word>', xml):
        x0, y0, x1, y1, t = m.groups()
        yield dict(x0=float(x0), y0=float(y0), x1=float(x1), y1=float(y1),
                   h=float(y1) - float(y0), text=t)


def main():
    pdf = sys.argv[1]
    page = int(sys.argv[2]) if len(sys.argv) > 2 else 1
    ws = list(words(pdf, page))
    if not ws:
        print("no words")
        return
    page_h = max(w["y1"] for w in ws)
    print(f"page {page}: {len(ws)} words, text spans y 0..{page_h:.0f} of 1280pt width")

    # font sizes = glyph height, clustered (Figma text boxes are tight)
    sizes = Counter(round(w["h"], 1) for w in ws)
    print("\nfont sizes (glyph height, pt  % of page width  count):")
    for h, n in sorted(sizes.items(), reverse=True)[:10]:
        print(f"  {h:5.1f}pt  {100*h/PAGE_W:5.2f}%  x{n}")

    # left/right insets — where does body copy start and end
    lefts = Counter(round(w["x0"]) for w in ws if w["h"] < 20)
    print("\nmost common left edges of body text (pt):", lefts.most_common(6))
    right = max(w["x1"] for w in ws)
    print(f"rightmost ink: {right:.0f}pt  (page {PAGE_W:.0f}) -> right inset {PAGE_W-right:.0f}pt")

    # paragraphs: group successive lines sharing a left edge and similar size
    print("\nlongest text runs (measure / line count):")
    runs, cur = [], []
    for w in sorted(ws, key=lambda w: (w["y0"], w["x0"])):
        if cur and abs(w["x0"] - cur[-1]["x0"]) < 2 and -2 < w["y0"] - cur[-1]["y0"] < 40:
            cur.append(w)
        else:
            if len(cur) > 3:
                runs.append(cur)
            cur = [w]
    if len(cur) > 3:
        runs.append(cur)
    for r in sorted(runs, key=lambda r: -max(x["x1"] for x in r) + min(x["x0"] for x in r))[:6]:
        width = max(x["x1"] for x in r) - min(x["x0"] for x in r)
        print(f"  {width:5.0f}pt = {100*width/PAGE_W:4.1f}% of page, {len(r)} lines, "
              f"starts x={min(x['x0'] for x in r):.0f} y={r[0]['y0']:.0f}")

    if "--dump" in sys.argv:
        print("\nall words (y, x0, size, text):")
        for w in sorted(ws, key=lambda w: (w["y0"], w["x0"])):
            print(f"  y={w['y0']:7.1f} x={w['x0']:6.1f} h={w['h']:5.1f}  {w['text']}")


if __name__ == "__main__":
    main()
