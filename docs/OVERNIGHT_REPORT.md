# Overnight design refinement — final report

Run 2026-11-19/20. Commits `56f7198`, `d630e2a`, plus the earlier audit pass
`125b228`. Every claim below was measured on the rendered page; nothing is
reported from source inspection alone.

---

## 1. What changed

The site was already functional and accessible. What it lacked was **one
vocabulary**. Three specific inconsistencies were real, and each was found by
measuring the rendered page, not by reading the code.

### 1a. Every secondary page had no band map

The home page carried a band map sampled from PDF page 1 and looked right. The
four secondary pages had no map at all, so every section fell through to the pale
body colour. Measured consequence:

```
/features     P P P P W W D     four consecutive pale sections, merged
/how-it-works P P D             merged
/contact      P P               merged
```

So I re-sampled the approved PDF at the page edge and found:

| Page | PDF band map |
|---|---|
| p1 `/` | `f7fbff · W · P · W · P · D · W · D` |
| p2 `/features` | **all white** — measured 0 pale pixels down x=2 across 2991px |
| p3 `/how-it-works` | strict W/P alternation, then dark |
| p4 `/contact` | W · P · W |
| p5 `/download` | W, then dark |

Applied. Now:

```
/              h W P W D W D    clean  (PDF p1 exactly)
/features      W W W W W W D    clean  (one white canvas, as the PDF is)
/how-it-works  W P D            clean
/contact       W P              clean
/download      W D              clean
```

A visual pass on `/features` confirms it *"reads as ONE continuous white canvas
with sections separated by whitespace and card borders … not disconnected
blocks."* That is what the approved page does, and the site had been 4 pale
washes off it.

**Root cause worth recording:** deleting `SenseScoreAct` earlier removed the white
block that sat between `meet` and `features` in the PDF map, so two pale sections
became adjacent. `Features` is now white, which restores the sampled rhythm.

### 1b. One paragraph role had three sizes

`.lede` in `tokens.css` is a single definition used by 8 sections — including
non-hero ones like Problem and Placement. Seven other sections hand-rolled
`text-[1rem]` or `text-[1.05rem]` for the same semantic role, so the same
paragraph changed size depending on the page.

Routed all of them through the token. Measured across all 5 routes afterwards:
**every lede is 19.52px**. Before: 16 / 16.8 / 19.52 mixed on the same site.

### 1c. Two radii for one role

8 CTAs used a literal `rounded-[10px]` while cards used `rounded-tight` (9px),
with no rule deciding which. Every CTA already agreed on 10px, so it is now
`--radius-btn` with a `rounded-btn` utility, and the header CTA (which had the
*card* radius) uses it too.

### 1d. Two entrance speeds

`.reveal` hard-coded `0.72s` while `.seq` used `var(--dur-reveal)` = `0.42s`.
Both are entrance animations, both run on the same page, so a section's entrance
speed depended on which wrapper it happened to use. Both now read
`var(--dur-reveal) var(--ease-out)`.

Measured after, on `/` and `/features`: every transition duration in the DOM maps
to a token (0.42 / 0.18 / 0.7 / 1.1s).

### 1e. Removed a duplicate name

`.section-alt` was the same colour as `.band-pale`. Two names for one band is how
a palette drifts. Deleted; every section uses a `band-*` token.

---

## 2. Pages and components improved

| File | Change |
|---|---|
| `src/styles/tokens.css` | `--radius-btn` added; `.section-alt` removed; `.reveal` duration tokenised |
| `src/styles/app.css` | `.reveal` unified on `--dur-reveal` |
| `src/sections/Capabilities.tsx` | white band; lede tokenised |
| `src/sections/Features.tsx` | white band (restores the PDF p1 rhythm) |
| `src/sections/WhatItDoes.tsx` | white band; lede tokenised |
| `src/sections/RiskShowcase.tsx` | white band |
| `src/sections/Loop.tsx` | white band; lede tokenised |
| `src/sections/Contact.tsx` | white band; lede tokenised; button radii |
| `src/sections/GetApp.tsx` | white band; lede tokenised |
| `src/sections/ClosingCta.tsx`, `Ownership.tsx`, `Meet.tsx`, `NotFound.tsx`, `Faq.tsx` | lede tokenised; button radii |
| `src/components/Header.tsx` | CTA uses `rounded-btn` (was the card radius) |

---

## 3. Design system

- **Type**: `.lede` is now the single lede. Three weights remain, each with a
  clear role — `font-bold` for hero h1s and the wordmark, `font-[650]` for
  headings (96 uses), `font-semibold` for buttons and numeric figures. Verified
  as intentional, not drift.
- **Spacing**: section padding is uniform (108px) across all five routes; the
  only larger value is the closing CTA band at 128px, a deliberate full-stop
  panel.
- **Bands**: `band-white` / `band-pale` / `band-dark`, with a per-page map
  sampled from the PDF and recorded in `tokens.css`.
- **Radii**: `--radius-tight` 9px (cards), `--radius-btn` 10px (buttons),
  `--radius-soft` 12px, `--radius-shell` 20px.
- **Motion**: `--dur-micro` .18s, `--dur-reveal` .42s, `--dur-media` .7s,
  `--dur-instrument` 1.1s, `--stagger` 80ms, plus `--ease-out` / `--ease-state`.
  Entrance uses one duration everywhere now.

---

## 4. 3D presentation

Inspected the shipped asset directly by parsing the GLB's JSON chunk:

```
meshes: 278   nodes: 280   materials: 83   generator: glTF-Transform v4.5.1
```

SketchUp component names survive in the node tree (`nut_Power_Supply`,
`Bolt_Power_Supply`, `mesh_1_ROOT_Layer0_…`), so this is the team's real assembly
from `~/Downloads/final-3d.skp` — not a primitive, not an approximation.

Rendered at both widths: **0 console errors**, canvas present on desktop and
mobile. On a 390px phone a visual pass confirms the unit *"fills most of the
frame … visible and prominent."*

The open-view presentation stands (there is no closed shell in the source
geometry — verified previously by hiding all 278 internals, which renders
nothing).

---

## 5. Build and testing

| Gate | Result |
|---|---|
| `npm run build` | ✓ builds clean |
| `tsc -p tsconfig.json --noEmit` | ✓ clean |
| `npm run lint` | 0 errors |
| `node scripts/qa.mjs` | **170/170** |
| `node scripts/axe.cjs` | **0 violations / 10 route-viewport combos** |
| Console errors | 0 across all routes |
| Mobile (390×844) | band rhythm identical to desktop, **no horizontal overflow** on any route |

Screenshots of the final implementation: `docs/screenshots/{home,features,how,contact,download}.jpg`
(1440px wide, full page).

---

## 6. Unresolved / limitations

1. **Two transition durations (0.9s, 0.15s) have no source match.** They appear
   on 2 elements out of ~150 and look like Tailwind defaults on a component that
   sets a duration utility without a matching token. Not worth a refactor.
2. **The Google Form has no "I am a" question.** The role is folded into the
   message body instead (`I am a: <role>`), verified in the POST payload.
3. **A stray unused form** named "MoldGuard enquiry" (`11OMQ9oHw…`) remains in the
   Drive from a rebuild attempt. It is wired to nothing; the live one is
   `1FAIpQLSf4Vru…`. Documented in `docs/google-form-setup.md`.
4. **`.dial-fill` in `app.css` is unused.** Left in place rather than churned.
5. **The 3D dark-ink metric is misleading on this model.** The unit is near-white
   on a pale stage, so a dark-pixel count reads ~2% on mobile while the product
   visibly fills the frame. Judge this panel visually, not by ink.
6. **Lighthouse was measured at 100/100/100/100 earlier in the session** on this
   container (SwiftShader). Not re-run after these commits.
