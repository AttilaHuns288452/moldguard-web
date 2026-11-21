# Figma reconstruction log

Cycle 3: Figma-to-website fidelity. Branch `refine/figma-fidelity`, based on
`ac5226e`. Reviewer: xkcode over rendered screenshots (round 1 findings quoted where
acted on; it was stopped before a final summary after ~40 min, so its intermediate
findings were verified and acted on individually).

## Method

Rendered the artboard to PNG (`pdftoppm -r 110`) and wrote four measurement tools so
that comparisons are numbers, not impressions:

- `pdf_metrics.py` / `type_scale.py` — exact font sizes from the PDF text layer
  (`pdftohtml -xml` gives real `fontspec` sizes; glyph bboxes do not).
- `band_map.py` — background bands down the page gutter: count, height, colour.
- `band_text.py` — which text sits in which band, so bands can be identified.
- `shots.mjs` — captures that fail loudly if any `.reveal` block is still invisible.

## What was found and changed

### 1. The missing band (root cause of "sections merge")

`band_map.py` on artboard p1 vs the live `/`:

```
PDF  p1: 11 runs, 5 colours:  hero pale | problem white | meet pale | [SENSE] white | features pale | own navy | placement white | cta navy
site /  : 10 runs, 4 colours: hero pale | problem white | meet pale |                features white | own navy | placement white | cta navy
```

`SenseScoreAct` was deleted in `2c6c70a`. With it gone, `meet` and `features` — both
`#eaf2fc` — became adjacent and merged into one 2,667px pale wash. `Features` was then
switched to white to paper over it, which is why its own comment reads *"this has to be
white because the section that used to separate it from `meet` was removed."*

Restored `src/sections/SenseScoreAct.tsx`, rebuilt as the artboard's hairline
three-column band (a rule + thin dividers, **not** cards). Re-measured: `/` is back to
8 bands with the correct 5-colour rhythm.

### 2. Type scale

| Role | Artboard (% of width) | Site before | Site after |
|---|---|---|---|
| h1 | 8.59% | 5.00% | 4.6vw (3 clean lines, see caveat) |
| section h2 | 5.08% | 3.00% | 4.75% |
| body | 2.27% | 1.36% | 1.82% |

h1 caveat: the shipped headline copy is 41 chars vs the artboard's 30, and a sweep
(4.0→7.6vw in 0.2 steps) showed 3 clean lines only up to 4.6vw at 1440; above that it
splits "mold-friendly". 4.6vw = 66px, 3 lines, 33% larger than before.

### 3. Product stage

Artboard: warm beige studio ground, cool white product, soft shadow. Site: cool
mid-blue gradient — a white object on a cool-blue field at the same value, which is
literally why it read as a "ghost". Stage ground changed to warm
(`#fdfbf7 → #efe7db → #d9cdbb`). Product-region tonal spread **70 → 91**; both 3D
stages still verified with real rendered pixels (`model_check.mjs`: hero 93%, meet 68%,
hero still 94% after Meet mounts).

### 4. Hero clutter

The artboard's hero has no stickers. The site had three: an "OPEN VIEW · INSIDE THE
UNIT" pill, a parts caption, and a CTA note. Collapsed to one line
("Open cutaway · Sensors · thermoelectric stack · fan · water tank"). The prototype
disclosure was kept — that is an honesty requirement, not decoration.

### 5. Meet narrative restored

`MEET.stages` (four numbered sentences — "The pod senses / The system understands /
The system flags risk / The system responds") existed in `content.ts` and was never
rendered. Restored above the explorer, so the plain-language idea comes before the
12-part component list. This was the reviewer's best find.

### 6. Footer logo

`public/mark.png` shipped as an opaque RGB image with a near-white field
(`253,253,254` at the corners). On the navy footer that rendered as a pale slab
(measured mean RGB 69,100,137 against footer 21,56,94). Added an alpha channel by
treating >244 luma as background (49.3% of the asset). Non-destructive: original kept
at `/tmp/mark_original_backup.png`.

### 7. 320px overflow

`/features` forced 31px of horizontal page scroll. Located by hiding sections in turn
(only `#risk` owned it), then hiding its children in turn — a legend row of four
unbreakable `flex` items. Added `flex-wrap` + `whitespace-nowrap` per item. Verified:
no overflow on any of 5 routes × 8 viewports (320→1920).

## Verification

| Gate | Result |
|---|---|
| `npm run build` | exit 0 |
| `node scripts/qa.mjs` | **202/202** |
| `node scripts/axe.cjs` | **0 violations**, 10 route·viewport combos |
| `npx oxlint` | 0 errors (16 pre-existing warnings) |
| `node scripts/model_check.mjs` | MODEL: PASS (both stages, hero survives Meet) |
| `node scripts/moball.mjs` | no overflow, 5 routes × 8 viewports |
| `band_map.py` on `/` | 8 bands, artboard rhythm |

## Deliberate divergences from the artboard

| Divergence | Why |
|---|---|
| h1 at 4.6vw not 8.59% | Longer shipped copy; larger splits "mold-friendly". Documented with the measured sweep. |
| Interactive 3D instead of a static render | Owner's explicit requirement; a live assembly is the product argument. The artboard's *ground and lighting logic* was adopted instead. |
| Meet keeps the component explorer | Functional advantage the artboard cannot have. Artboard's narrative restored above it so the story still reads first. |
| Prototype disclosure in the hero | Honesty requirement (no store listing, no install package). |
| `/features` kept one continuous white canvas | Artboard p2 is 92.8% one white canvas — the site already matched. My earlier assumption of divergence was **wrong**; measured before changing. |

## Remaining known gaps

- Artboard's h1 proportion is unreachable with the current copy (above).
- Meet is denser than the artboard by design (12 hotspots, tour, explorer panel).
- Mobile `/contact` puts contact details above the form (approved order).
- Assembly chunk still exceeds Vite's 900 kB warning (1.03 MB raw / 276 kB gzip).
