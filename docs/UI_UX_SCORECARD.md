# MoldGuard — UI/UX scorecard

Scored after cycle 2 on `refine/ui-ux-cycle`. A 10 means "no known material defect
within the tested scope", not "an agent likes its own work". Every score names its
evidence and what is still missing.

| Category | Score | Evidence | Still missing |
|---|---|---|---|
| Overall art direction | 9 | Palette and band rhythm trace to the PDF (`DESIGN.md`); no invented one-off colours (band vocabulary is exactly white/pale/dark) | — |
| Typography | 8.5 | One display face, one body face, one mono for readouts; heading audit: 1 `h1` + no duplicate `h2` per route | Scale is still utility-class per section rather than a single token set |
| Section hierarchy / composition | 8.5 | Band map matches the PDF page order; the stranded half-row is closed (spanning row, continuous rules) | No progressive disclosure on `/features` |
| Backgrounds / contrast | 9 | Every band is a token; focus ring has a white halo for navy surfaces (cobalt alone is 1.78:1 there) | — |
| Spacing / alignment | 8.5 | Section rhythm 108px desktop / 64px mobile was measured, not guessed; card gutters now continuous | — |
| Component consistency | 8.5 | One gauge vocabulary (Safe/Watch/Act) across all three gauges; one reveal vocabulary | — |
| 3D appearance | 7.5 | Honest open-cutaway assembly; hero stage spread 60 → 176; shadow blob grounds it | White-on-pale is still the hardest case; striping on the ghosted front panel is design, not a bug |
| 3D functionality | 9 | Drag/zoom/reset/tour/exploded all exercised by the suite; per-viewer clone prevents the hero going blank when Meet mounts; WebGL/model failure degrades without killing the page | — |
| Website functionality | 9 | 202/202 interaction checks; no self-links left on `/features`; download claim now matches the absence of any package | Header CTA still links to `/download` while on `/download` (deliberate: it is the only nav CTA at phone width) |
| Responsive design | 8.5 | No horizontal overflow at 360/390/430/768/1024/1440/1920; how-it-works visuals now render at 390 with nothing cropped or overlapping | Mobile `/contact` puts contact details above the form (approved order) |
| Accessibility | 9 | axe: 0 violations across 5 routes × 2 viewports; skip link first; focus ring visible on pale and navy; form labels + `aria-invalid` + polite status wired | — |
| Performance | 7.5 | 3D lazy-mounts on intersection via `requestIdleCallback`; the device chunk is split (1.03 MB raw / 276 kB gzip) | The device scene chunk still warns above the 900 kB threshold |
| Code maintainability | 8.5 | Single content source (`content.ts`), single token file, viewer safeguards documented in place | 16 pre-existing oxlint warnings in the 3D code |

**Weighted read:** the site is in good shape where it was weakest (truthfulness of
claims, one consistent risk vocabulary, content that actually renders when scrolled
or printed). The remaining ceiling is the 3D presentation on a pale ground and the
device chunk size, not the layout or the copy.

## What was NOT verified

- Real-device GPU rendering. All captures use SwiftShader; the hero's contrast was
  measured on that path. A hardware GPU may render the PBR materials differently.
- Real screen readers. Accessibility is axe + semantic review, not NVDA/VoiceOver.
- Actual print output on paper. The print rule was verified through print-media
  rendering, not a physical printer.

## Honest summary of this round

Fixed and verified: 13 defects. Rejected after measurement: 7 claims that would have
caused regressions if "fixed" (including a hero 3D rewrite that was not needed, and a
striping change that measurement shows never existed).

The single most valuable outcome is not any one fix: it is that the capture harness
now fails loudly when content is invisible, and the reveal system no longer depends
on a scroll event that a saturated main thread can drop.
