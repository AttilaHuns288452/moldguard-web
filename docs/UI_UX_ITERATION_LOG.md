# MoldGuard — UI/UX iteration log

Two-agent loop: lead agent implements and verifies; a separate reviewer agent
(xkcode, deepseek-v4.1-flash) is given the rendered screenshots and told to
challenge the work. Every reviewer claim is re-verified against the DOM, the GLB,
or a pixel measurement before it is accepted. Rejected claims are recorded so they
are not "fixed" twice.

Tools: `node scripts/shots.mjs <url> <out>` (route captures, asserts every reveal
block is visible before shooting), `node scripts/heading-audit.mjs` (heading
structure), `node scripts/qa.mjs`, `node scripts/axe.cjs`, `npx oxlint`.

---

## Baseline

`c690b8a`, branch `refine/ui-ux-cycle`.

| Gate | Result |
|---|---|
| `npm run build` | exit 0 |
| `node scripts/qa.mjs` (dev) | 202/202 pass, exit 1 from pre-existing R3F console noise |
| `node scripts/axe.cjs` | 0 violations / 10 route·viewport combos |
| `npx oxlint` | 0 errors, 16 warnings (all pre-existing) |

Baseline captures in `.qa/base/`.

### Audit harness bug found before any review

The first capture script scrolled with `scrollTo(0, y)` in a loop. `html` has
`scroll-behavior: smooth`, so successive calls cancelled each other and the walk
stopped mid-page — leaving 19 of 21 reveal blocks at `opacity: 0`. The reviewer was
fed screenshots full of blank bands and correctly flagged empty sections.

That was a harness defect, not a site defect. Fixed in `scripts/shots.mjs`: force
`scrollBehavior = 'auto'`, use `behavior: 'instant'`, re-measure the page height each
pass (the 3D stage mounts lazily and grows the page), and **assert** that zero
`.reveal` blocks remain hidden before the screenshot is taken. Captures after that
are trustworthy.

---

## Cycle 1 — 10 confirmed defects

### Fixed

| # | Defect | Verification |
|---|---|---|
| 1 | Hero 3D washed out | Stage tonal spread 60 → **176** (5th/95th percentile luminance over the product area; explorer reference 116) |
| 2 | Risk vocabulary contradiction (`Low/Watch/High` and `Elevated` vs the site's `Safe/Watch/Act`) | Text scan: `elevated` 0, gauge axes read Safe/Watch/Act on all three gauges |
| 3 | Hero readout listed 3 rooms; `content.ts` calls multi-room a planned premium tier | Hero card now one room + dehumidifier |
| 4 | Duplicate "select to explore" hint (pill + control bar) | Pill removed; DOM shows one instance |
| 5 | Print/Ctrl+P mostly blank (20 of 24 blocks at opacity 0) | `@media print` forces final state; PDF carries every page |
| 6 | Fast scroll could strand content invisible (`{ once: true }` listener) | 17 stranded at 120ms/step before, 0 after |
| 7 | `/features` CTA linked to itself | Hidden on that route, still present on `/` |
| 8 | Download claimed "direct install available" with no `.apk`/`.ipa` in `public/` | Copy corrected |
| 9 | Empty half-row in the features card (item 6 at 573px in a 1194px row) | `grid-column: span 2 / span 2`, width 1194 |
| 10 | `/how-it-works` text-only on mobile while the intro promised "app screens and readouts below" | Visuals at 390/360/768: 0 → every stage |

### Rejected (verified false)

| Claim | Evidence |
|---|---|
| Hero 3D "broken geometry / missing panels" | Hiding the real shell (mesh_3) → max pixel diff 206; hiding the suspected duplicate (mesh_4) → **0**. The "stripes" are the intentionally ghosted front panel of the open view. |
| "Three repeated feature headings" | `heading-audit.mjs`: no duplicate `h2` on any route, exactly one `h1` per route. |
| "'Open view' pill overlaps the readout card" | Rect intersection at 390 and 1440: `false` at both. |
| "38 and 87 contradict each other" | Different rooms, both from `content.ts`. |
| "Gauge arc collides with text" | Gauge contained in card, labels clear. |

---

## Cycle 2 — reviewer round 2

Reviewer verdict on the 10 cycle-1 claims: 7 FIXED, 2 PARTIAL, 1 FIXED-with-caveat.
No P0 remaining. It also reported 8 new items; each was measured.

| Item | Verdict | Evidence / action |
|---|---|---|
| N2 duplicate "SAFE" under the score | **Real** | The axis directly below already reads Safe/Watch/Act, so the caption printed the same word twice. Caption removed, axis spacing increased. |
| N3 divider gap above the spanning row | **Real** | Per-cell `border-b` drew rules at x123–696 and x744–1317 (48px hole). Removed `gap-x-12`, moved the gutter into cell padding: rules now meet at x720 with no gap. |
| N1 `/download` QR resolves to `/download` | **Real (framing)** | The QR encodes this page's URL, so "Scan with your phone" is technically true but the caption promised an app. Relabelled "Open this page on your phone" and pointed the access path at the team mailto. |
| N6 hero stage prints empty | **Real** | WebGL never composites into print. Added a print-only still (`[data-print-still]` → `pod-hero.png` / `pod-meet.png`), canvas hidden in print. |
| N8 compare badge wraps into a blob | **Real** | "MOLDGUARD PROTOTYPE" → "Prototype" + `whitespace-nowrap`. |
| N4 self-links on `/download` and `/contact` | **Partially accepted** | The header "Get the app" on `/download` is the only nav CTA at phone width; hiding it removes the primary action on that route, which is worse than a redundant link. Left as-is deliberately. |
| N5 hero striping "worse" (0.57 → 1.64) | **Rejected** | Re-measured the same panel region: 0.410 → 0.399. The reviewer's crop included the ghosted front panel, whose transparency is by design. |
| N7 mobile `/contact` buries the form | **Not a defect** | Contact details above the form is the approved order and matches the PDF. |

### Extra defect found during cycle 2 verification

The reveal safety net still stranded **4 of 21** blocks on `/` when the capture ran
while the QA suite competed for CPU. Root cause: the net depended on scroll events,
which coalesce or are dropped when the main thread is saturated — and
`IntersectionObserver` only reports *changes*, so a block stepped past between
callbacks never reports intersection at all.

Fix: geometry poll (200ms, self-terminating) **plus** the unconditional scroll
listener, and an element counts as reached when it is above the fold `or` already
scrolled past (`bottom < 0`).

Verified under the same contention that previously failed: re-ran the capture with a
full QA suite running concurrently → **zero** stranded blocks.

---

## Final gate results

| Gate | Result |
|---|---|
| `npm run build` (tsc + vite + prerender) | exit 0 |
| `node scripts/qa.mjs` | **202/202** checks |
| `node scripts/axe.cjs` | **0 violations**, 10 route × viewport combos |
| `npx oxlint` | 0 errors, 16 pre-existing warnings |
| Reveal integrity | 0 stranded blocks on all 5 routes, idle and under load |

QA exit code remains 1 on the dev server only because it counts the 48
`Attempted to synchronously unmount a root` messages React Three Fiber emits during
route transitions. Pre-existing, unchanged by this work, clean against the
production build.

## Still open (not defects)

- Mobile sticky CTA — changes the approved composition on every route.
- `/features` progressive disclosure restructure.
- Silencing the R3F route-transition console noise (needs an `App.tsx` refactor).
