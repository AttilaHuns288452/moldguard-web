#!/usr/bin/env python3
"""Band map: background colour runs down the left gutter of a tall page image.

Gives an objective section map (which band, how tall, what colour) for the Figma
PDF export and for a website screenshot, so the two can be compared as
proportions instead of by opinion.

usage: python3 scripts/band_map.py <image.png> [--pct]
"""
import sys
from PIL import Image


def runs(im, x, tol=6):
    px = im.load()
    w, h = im.size
    out, start, cur = [], 0, px[x, 0]
    for y in range(1, h):
        c = px[x, y]
        if max(abs(c[i] - cur[i]) for i in range(3)) > tol:
            out.append((start, y, cur))
            start, cur = y, c
    out.append((start, h, cur))
    return [r for r in out if r[1] - r[0] > 8]


def hexc(c):
    return "#%02x%02x%02x" % c[:3]


def main():
    path = sys.argv[1]
    pct = "--pct" in sys.argv
    im = Image.open(path).convert("RGB")
    w, h = im.size
    # left gutter: inside the page, outside the 6.25% content column
    x = int(w * 0.03)
    rs = runs(im, x)
    total = h
    print(f"{path}  {w}x{h}, gutter x={x}")
    for a, b, c in rs:
        share = 100 * (b - a) / total
        print(f"  y {a:6d}..{b:6d}  {(b-a):5d}px  {share:5.1f}%  {hexc(c)}")
    print(f"  distinct colours: {len({hexc(c) for _,_,c in rs})}")


if __name__ == "__main__":
    main()
