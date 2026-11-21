# MoldGuard — UI/UX audit

Baseline: `c690b8a` on `master`, branch `refine/ui-ux-cycle`.
Evidence: `node scripts/qa.mjs` (202 checks), `node scripts/axe.cjs` (WCAG 2.1 AA,
5 routes × 2 viewports), `npx oxlint`, and full-page screenshots of every route at
1440 and 390 (`scripts/shots.mjs` → `.qa/base/`, then `.qa/cycle1/`).

The audit was run as two independent passes: the lead agent plus a separate
reviewer agent (xkcode, deepseek-v4.1-flash) that was given the rendered
screenshots and told to challenge the work, not agree with it. Findings from the
reviewer were re-verified against the DOM, the GLB, or pixel measurements before
being accepted — several were rejected that way, and they are recorded below so
the same false positives do not get "fixed" twice.

## Baseline gate results

| Gate | Result |
|---|---|
| `npm run build` (tsc + vite + prerender) | pass |
| `node scripts/qa.mjs` | 202/202 checks pass |
| `node scripts/axe.cjs` | 0 violations, 10 route/viewport combos |
| `npx oxlint` | 0 errors, 16 pre-existing warnings |
| QA exit code | **1** — see "known noise" |

Known noise: `qa.mjs` exits 1 on the dev server because it counts console errors,
and React logs `Attempted to synchronously unmount a root while React was already
rendering` 48 times during route transitions inside React Three Fiber. The same
suite against the production build is clean. This is pre-existing and is not a
regression from this work.

## Confirmed defects (fixed)

### 1. Hero 3D stage was washed out — P0
Measured on the rendered stage, not judged by eye: extract the stage screenshot,
compute the 5th/95th percentile luminance over the product area.
Hero spread **60**, explorer spread **116**. The white assembly had almost no
value range against a pale radial gradient.

Fix: darker outer stops on the hero stage backdrop (`#5f7d9b` outer vs `#91aac0`).
Re-measured: spread **176**.

### 2. Risk band vocabulary contradicted itself — P0
`content.ts` defines exactly one vocabulary for risk bands: `Safe / Watch / Act`
(`RISK_SCENARIOS[*].band`). The gauge components invented two others:

- `RiskGaugeCard` (how-it-works) labelled the arc `Low / Elevated / High` and
  printed **"Elevated"** under the score 38.
- `Features` and `Capabilities` labelled the same three zones `Low / Watch / High`.

So 38 read as "Elevated" on one page and "Low" on another — the same number with
opposite verdicts, 4,000px apart.

Fix: all three gauges now use `Safe / Watch / Act`, including the SVG `aria-label`.

### 3. Hero readout claimed a capability the FAQ disclaims — P1
The hero card listed `Living room, Bedroom, Closet` — three rooms. `content.ts`
states multi-room visibility is "planned as an optional premium tier", and the FAQ
repeats it. A visitor saw multi-room monitoring above the fold and a disclaimer
several screens later.

Fix: hero card shows one room plus the dehumidifier state, which is what the base
product actually does.

### 4. Duplicate interaction hint in the component explorer — P1
Two elements carried the same instruction ~2 lines apart: a centered pill
("Select to explore · drag to orbit") and the control bar's own status line. Measured
`y≈850` on the desktop home screenshot.

Fix: removed the pill. The control bar always shows the instruction, and the hero
stage (`chrome={false}`) is deliberately bare.

### 5. Print / Ctrl+P produced mostly blank pages — P1
Entrance blocks start at `opacity: 0` until scrolled into view, and a printed sheet
never scrolls. Measured on `/features`: 20 of 24 reveal blocks invisible in print
media.

Fix: `@media print` forces `.reveal`, `.seq > *` and line spans to their final
state.

### 6. A fast scroll could strand content invisible forever — P1
`useInView`'s safety net listened for `scroll` with `{ once: true }`. Measured: at
120ms/step scroll, 17 blocks stayed at `opacity: 0` on `/features`; at reading pace,
0. A single-shot listener races a flick.

Fix: the listener stays until the element is actually within 1.2 viewports, then
removes itself.

### 7. `/features` CTA linked to itself — P2
"Explore the features →" with `href="/features"`, rendered on `/features`.

Fix: hidden when the current route is `/features`.

### 8. Download page promised an install that cannot happen — P1
Copy read "Direct install and scan-code access are available". Verified: `public/`
contains no `.apk`, `.ipa` or `.aab`. The QR also resolves to the same `/download`
page, so "scan to get the app" returns the visitor to the page they scanned.

Fix: copy now states there is no public install package and the team grants access.

### 9. Empty half-row in the features card — P2
Six features, the first in a full-width band, the remaining five in a 2-column
grid → the last row was half empty (measured: item 6 at 573px in a 1194px row).

Fix: the last item spans both columns. The old `nth-last-child(2)` border exception
was also removed — with the spanning row it punched a gap in the divider above it
(measured: item 3 `border-bottom: 0px` while its row boundary should be drawn).

### 10. `/how-it-works` was text-only on mobile — P1
The four approved stage visuals were `hidden md:flex`, i.e. desktop-only, while the
page intro promises "App screens and readouts below use demo data". Measured on
390px: 0 visuals in all four stages.

Fix: visuals render at every width, scaled for phone (0.285 of the 390x844 frame).
Re-measured at 390, 360 and 768: every stage has its visual.

## Rejected findings (verified false — do not "fix" these)

| Finding | Why it is wrong |
|---|---|
| Hero 3D "broken geometry, missing panels, dark triangular hole" | The unit is deliberately shown open; the dark triangle is the roof underside. Hiding the *real* shell (mesh_3) changes 206/255 max pixel diff; hiding the suspected duplicate (mesh_4) changes **0 pixels**, so mesh_4 is already invisible and the "z-fighting stripes" are the intentional ghosted front panel. |
| "Three identical feature headings repeated on one page" | Counted in the DOM: no duplicate `h2` on any route; exactly one `h1` per route. |
| "'Open view' pill overlaps the readout card on mobile" | Rect-intersection test at 390 and 1440: `pillOverlapsCard: false` at both. |
| "`38` and `87` on `/features` are a contradiction" | Different rooms (index card vs. scenario tab). Both trace to `content.ts`. |
| "Gauge arc collides with text" | Measured: gauge contained in the card, labels and caption clear of it. |

## Remaining, not addressed in cycle 1

- **Mobile sticky CTA.** No persistent call-to-action on long mobile routes. Adding
  one changes the approved composition on every route, so it is a design decision,
  not a defect fix.
- **`/features` restructure** (progressive disclosure on the features page) — from
  the earlier plan, deliberately not attempted yet.
- **R3F route-transition console noise** (48 messages). Cosmetic in the suite; would
  need a route-transition refactor in `App.tsx` to silence.
