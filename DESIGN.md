# MoldGuard Design Contract

## Visual direction

Use the PDF's restrained product-editorial language: pale ice-blue and white bands, deep navy structure, cobalt action color, thin blue rules, rounded but controlled surfaces, and generous left alignment. Do not turn the product into a generic dark-tech dashboard or a decorative glassmorphism page.

## Tokens

Authoritative tokens live in `src/styles/tokens.css`.

- Ground: `paper` / `paper-deep`.
- Surfaces: `surface` / `card`.
- Structure: `deep` / `deeper` / `ink`.
- Supporting text: `ink-2` / `ink-3`.
- Action: `accent` / `accent-ink`.
- Type: Bricolage Grotesque for display, Figtree for interface/body, Spline Sans Mono for measurements and indices.
- Radii: tight controls, soft cards, shell-level feature frames.

## Band rhythm

Use only the shared band vocabulary from `src/styles/tokens.css`:

- `band-white` for primary content.
- `band-pale` for supporting sections and soft separation.
- `band-dark` for ownership/closing/footer moments.

Avoid introducing one-off section colors when a shared band communicates the same role.

## Composition rules

- Keep the hero message and CTA on the left, with the real hardware visual on the right at desktop.
- Let the 3D assembly remain honest as an open technical view. Do not replace it with a primitive box or imply a sealed enclosure not present in the source model.
- Use one clear hierarchy per section. A dominant claim may have supporting rows, but equal cards must not make every feature feel equally important.
- Keep content widths readable and preserve deliberate whitespace without adding fixed-height dead zones.
- On narrow screens, stack the content intentionally rather than shrinking desktop compositions into unreadable columns.

## Motion and interaction

- Reveal content when it enters the viewport, not only when it mounts.
- Use the shared easing and duration variables in `src/styles/app.css`.
- Support `prefers-reduced-motion: reduce`; the final content state must remain visible and the 3D model must stop auto-spinning.
- Every interactive control needs a visible focus state and a minimum touch target.
- The 3D hero hides explorer chrome and redundant prompts; the full explorer keeps controls, hotspots, and a usable fallback.

## Accessibility

- Maintain one meaningful page `h1` per route.
- Keep the skip link as the first keyboard stop on a clean load.
- Use `aria-current="page"` for active navigation and visible focus rings on both pale and navy surfaces.
- Keep form labels, `aria-invalid`, error descriptions, and polite success announcements connected to their controls.
- Do not rely on color alone for risk status or selected states.

## Reference boundary

The PDF controls visual structure and approved product narrative. The proposal controls technical/business claims where the two conflict. Any unresolved discrepancy is a content-review item, not a reason to silently invent a compromise.
