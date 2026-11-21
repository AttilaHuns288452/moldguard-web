# Figma design analysis

Source: `/home/attila/Downloads/MoldGuard (1).pdf` — a Figma export, 5 pages, each
1280pt wide. This is the approved visual reference; the site is the functional
implementation. The job was to find where the translation lost quality and restore
it, not to redesign.

Method: every claim below is measured with a script in `scripts/` (`pdf_metrics.py`,
`band_map.py`, `band_text.py`, `type_scale.py`, `wrapcount.mjs`). Where the two
disagreed, measurement won over both agents' opinions — including my own.

---

## A. Figma artboard — strengths

1. **A fixed, intentional band map.** Page 1 uses 8 content bands with 5 distinct
   backgrounds: `#f7fbff` hero → `#ffffff` problem → `#eaf2fc` meet → `#ffffff`
   sense/score/act → `#eaf2fc` features → `#15385e` ownership → `#ffffff`
   placement → `#15385e` CTA. Each section is legible as a separate object without
   needing a container to draw a boundary.

2. **One type scale, stated as proportions.** h1 110pt = 8.59% of page width, every
   section heading 65pt = 5.08%, body 29pt = 2.27%, card titles 26pt = 2.03%. Every
   section heading on every page is *exactly* the same size. That consistency, not
   the fonts, is what makes the artboard feel designed.

3. **Warm-ground product photography.** The hero device sits on warm beige/cream with
   a soft shadow, and the UI overlay is navy. Warm ground + cool white product is a
   deliberate contrast direction that makes the object read as an object.

4. **One idea per band.** Meet = product + four numbered sentences + a data-flow
   diagram. No toggles, no hotspots, no tour controls. The reading path is obvious.

5. **Hairline structure over cards.** Sense/Score/Act is one rule and three columns
   with thin list separators — no boxes.

## B. Figma artboard — weaknesses (real ones)

1. **No responsiveness at all.** It is a 1280pt artboard. Nothing states what happens
   at 390px; the site has to invent that, and that invention is legitimate divergence.
2. **No interaction.** The product cannot be inspected, the FAQ cannot open, the form
   cannot be submitted. Those are functional additions, not design drift.
3. **The 3D model cannot exist.** The artboard shows a static render. The site ships a
   real interactive assembly of 12 documented parts. That is strictly better as a
   product argument and cannot be "matched".
4. **Long-page density.** Page 1 is 6,053pt tall at 1280 wide. Reproducing it literally
   means a very long scroll; the site already breaks it into 5 routes.
5. **Detail loss in the export.** Text in this PDF is emitted as `FigmaGlyphs` with
   per-word bboxes, so kerning is approximate and some words are split ("M eet M
   oldGuard"). Copy decisions must come from project text, not raw PDF extraction.

## C. Current website — strengths (preserved)

- Real routing with per-route title/description/canonical, `aria-current`, skip link.
- A live, inspectable 3D model with per-viewer cloning, graceful WebGL failure and a
  documented fallback — verified every cycle by `model_check.mjs`.
- 202 interaction checks and 0 axe violations across 5 routes × 2 viewports.
- Single content source (`content.ts`) and single token file.
- Honest prototype disclosure (no store badges, no invented specs).

## D. Current website — weaknesses (found and fixed)

| # | Weakness | Measured cause |
|---|---|---|
| 1 | Sections merged into one wash | `SenseScoreAct` deleted → two `#eaf2fc` bands adjacent; `Features` forced to white to compensate → 5 colours became 4 |
| 2 | Type read smaller and less assured | h2 ran at 59% of the artboard's proportion (3.00% vs 5.08%); body at 60% (1.36% vs 2.27%) |
| 3 | Hero product looked like a ghost | cool-blue stage under a white model; the artboard uses warm ground. Product-region tonal spread 70 → 91 after the fix |
| 4 | Hero was cluttered vs the artboard | 3 stickers (an "OPEN VIEW" pill, a parts caption, a CTA note) where the artboard has none |
| 5 | The artboard's Meet narrative was absent | `MEET.stages` (four numbered sentences) existed in `content.ts` and was never rendered |
| 6 | Footer logo was a white tile on navy | `mark.png` shipped as RGB with no alpha channel |
| 7 | A legend row broke 320px phones | unbreakable `flex` row forced 31px of horizontal page scroll |

## E. Verdict

The artboard is stronger on **composition and type proportions**; the site is stronger
on **function, responsiveness, accessibility and product honesty**. The gap was never
the palette — every colour already matched. It was (1) a missing band, (2) two type
tiers running at ~60% of the artboard's proportions, and (3) a product stage lit and
grounded in a way the artboard isn't. All three are measurable, and all three are now
corrected.
