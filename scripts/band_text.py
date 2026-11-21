#!/usr/bin/env python3
"""Band -> text map. For each background band in the page image, list the text
that sits inside it. This identifies WHAT each band is, so a band-for-band
comparison between the Figma PDF and the website is possible.

usage: python3 scripts/band_text.py <pdf> <page> <rendered.png> [scale]
  scale = rendered_px_per_pt (default: image_height / pdf_page_height)
"""
import re
import subprocess
import sys
from PIL import Image

sys.path.insert(0, __file__.rsplit("/", 1)[0])
from band_map import runs, hexc  # noqa: E402


def words(pdf, page):
    xml = subprocess.run(
        ["pdftotext", "-bbox-layout", "-f", str(page), "-l", str(page), pdf, "-"],
        capture_output=True, text=True, check=True).stdout
    out = []
    for m in re.finditer(
        r'<word xMin="([\d.]+)" yMin="([\d.]+)" xMax="([\d.]+)" yMax="([\d.]+)">(.*?)</word>', xml):
        x0, y0, x1, y1, t = m.groups()
        out.append((float(y0), float(x0), float(x1) - float(x0), float(y1) - float(y0), t))
    return out


def main():
    pdf, page, img = sys.argv[1], int(sys.argv[2]), sys.argv[3]
    im = Image.open(img).convert("RGB")
    w, h = im.size
    scale = h / 6053.114746 if page in (1, 3) else h / 5354.0
    scale = float(sys.argv[4]) if len(sys.argv) > 4 else scale
    ws = words(pdf, page)
    bands = runs(im, int(w * 0.03))
    print(f"page {page}: {len(bands)} bands, scale {scale:.3f} px/pt\n")
    for i, (a, b, c) in enumerate(bands):
        y0, y1 = a / scale, b / scale
        inside = [t for t in ws if y0 <= t[0] < y1]
        txt = " ".join(t[4] for t in inside)
        heads = [t for t in inside if t[3] > 24]
        print(f"band {i}  y {y0:6.0f}..{y1:6.0f}pt  {(y1-y0):5.0f}pt  {hexc(c)}  "
              f"{len(inside):3d} words")
        if heads:
            print("      big text: " + " | ".join(f"{t[4]}" for t in heads[:8]))
        print("      " + (txt[:150] + ("..." if len(txt) > 150 else "") if txt else "(no text)"))


if __name__ == "__main__":
    main()
