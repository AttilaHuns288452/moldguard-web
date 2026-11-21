# Figma → website gap matrix

Measured, not eyeballed. Every number below comes from a script in `scripts/`:

| Tool | What it measures |
|---|---|
| `pdf_metrics.py` | font sizes, insets, measure from the PDF text layer |
| `band_map.py` | background bands down the page gutter (count, height, colour) |
| `band_text.py` | which text sits inside which band |
| `type_scale.py` | artboard type scale as % of page width |
| `shots.mjs` | route captures that FAIL if a reveal block is still invisible |
| `model_check.mjs` | real rendered pixels on both 3D stages |

Artboard = `/home/attila/Downloads/MoldGuard (1).pdf`, 5 pages, each 1280pt wide
(6053pt, 5354pt, 6053pt, 3193pt, 1158pt tall).

---

## 1. Band map — the structural gap (root cause of "sections merge")

`band_map.py` on PDF page 1 vs the live `/`:

| Band | PDF p1 | Site `/` (before) | Site `/` (after) |
|---|---|---|---|
| 1 | `#f7fbff` hero | `#f7fbff` hero | same |
| 2 | `#ffffff` problem | `#ffffff` problem | same |
| 3 | `#eaf2fc` meet | `#eaf2fc` meet | same |
| 4 | `#ffffff` **Sense. Score. Act.** | — **MISSING** | `#ffffff` restored |
| 5 | `#eaf2fc` features | `#ffffff` features | `#ffffff` |
| 6 | `#15385e` ownership | `#15385e` | same |
| 7 | `#ffffff` placement | `#ffffff` | same |
| 8 | `#15385e` CTA | `#15385e` | same |
| bands | **8 content bands, 5 colours** | 7 bands, 4 colours | **8 bands** |

**Cause.** `SenseScoreAct` was deleted in `2c6c70a` to stop the home page naming the
sense→score→act flow in four places. Reasonable on its own — but page 1's band map
is fixed, and without that white band `meet` (`#eaf2fc`) and `features` (`#eaf2fc`)
became adjacent and merged into one **2,667px** pale wash. To cover that, `Features`
was switched to white — which is why its own code comment says *"this has to be white
because the section that used to separate it from `meet` was removed."* The result:
two neighbouring white bands (`meet/features` boundary and `features/ownership`
boundary) read as one continuous slab.

**Fix.** Restored the section as a hairline three-column band (not cards), which
returns the page to 8 bands. `SenseScoreAct.tsx` carries the full explanation.

## 2. Typography — the "less polished" gap

The PDF text layer gives exact sizes (`pdftohtml -xml`, `fontspec` per run):

| Role | Artboard | % of 1280 | Site before | % at 1440 | Action |
|---|---|---|---|---|---|
| Hero h1 | 110pt | **8.59%** | 72px | 5.00% | → 66px / 4.6vw (3 lines) |
| Every section h2 | 65pt | **5.08%** | 43.2px | 3.00% | → 68.4px / 4.75vw ✅ |
| Body copy | 29pt | **2.27%** | 19.5px | 1.36% | → 26.2px / 1.82vw ✅ |
| Card title | 26pt | 2.03% | 16.8px | 1.17% | unchanged (card tier) |
| Nav | 29pt | 2.27% | ~16px | — | unchanged |

Two tiers were running at **~59% and ~60% of the artboard's proportions** — that is
the measurable core of "the Figma frames feel more polished". Both are now within a
few percent.

**h1 caveat, stated honestly.** The artboard's 8.59% cannot be reached here: its
headline copy is *"Know mold is coming before it shows."* (30 chars, 3 lines) and the
shipped copy is *"Know when conditions become mold-friendly."* (41 chars). Measured
sweep at 1440 — 4.0vw→7.6vw in 0.2 steps (`wrapcount.mjs`): 3 clean lines only up to
**4.6vw**; above that it wraps to 4–5 lines and splits *"mold-friendly"* across lines,
which looks worse than being smaller. Chose 4.6vw: correct line shape, 33% larger than
before. If the headline copy is ever shortened to the artboard's, raise it to ~7.4vw.

## 3. Product presentation — the 3D stage

The owner's constraint: **keep the 3D model**. So the goal is to make the live model
sit in the artboard's *visual logic*, not to replace it with a photo.

| Property | Artboard | Site before | After |
|---|---|---|---|
| Ground tone | **warm** beige/cream studio | cool blue `#e8f0f7→#5f7d9b` | warm `#fdfbf7→#d9cdbb` |
| Contrast direction | warm ground vs cool white product | white on cool blue (same value) | warm vs cool ✅ |
| Product-region tonal spread | — | 70 | **91** |
| Stickers in the stage | none | "OPEN VIEW · INSIDE THE UNIT" pill + caption | one line, no pill |

A white product on a cool-blue field sits at the same value and dissolves; on a warm
lighter ground it separates. That is the artboard's actual trick, and it is now the
site's. `model_check.mjs` verifies real rendered pixels on both stages after every
change (hero 93%, meet 68%, and the hero keeps its model after Meet mounts).

## 4. Hero composition

| Element | Artboard | Site | Verdict |
|---|---|---|---|
| Text column | ~40% width | 561px of 1440 = 39% | ✅ matches |
| Product card | square-ish, right | square 1:1.01, right | ✅ matches |
| Readout overlay | bottom-right, navy | bottom-right, navy | ✅ matches |
| Secondary CTA | "See how it works" | "Contact the team" | → **changed** to "See how it works" |
| Disclaimers | none in hero | 2 (app-store note + stage note) | 1 kept (honesty requirement) |

## 5. What was NOT changed, and why

| Item | Why not |
|---|---|
| `/features` banding | `band_map.py`: artboard p2 is **92.8% one white canvas** then navy; the site is already 85% white then navy. My earlier prediction of a divergence was wrong — measured before changing. |
| `/how-it-works` banding | Artboard p3 alternates pale/white **per stage row** (bands 2–7), not per page section. The site's `Loop` already alternates internally with hairline rows; changing the page-level bands would be a mechanical flip the brief explicitly warns against. |
| Meet explorer's 12 hotspots + tour | The artboard shows one static render; the explorer is the site's functional advantage and the brief says to preserve those. Density is a deliberate trade, documented in `UI_UX_SCORECARD.md`. |
| Nav / footer | Not flagged by any measurement. |
