# MoldGuard Product Brief

## Purpose

MoldGuard is a student prototype for indoor mold-risk prevention and detection. It combines room sensing, a Mold Risk Index, a thermoelectric dehumidification response, and app/web status views into one product story.

## Users

- Renters and small property owners dealing with humidity-prone rooms.
- Larger households, dormitories, and property managers are future or planned audiences for multi-room views.

## Positioning

MoldGuard is presented as a system that reasons about humidity, temperature, and sustained exposure instead of reacting to humidity alone. It is not a mold diagnostic and does not replace professional inspection.

## Information architecture

| Route | Purpose |
|---|---|
| `/` | Product introduction, problem, real hardware explorer, core features, ownership, placement, closing CTA |
| `/features` | Mold-specific intelligence, risk engine, comparison, parts, and product capabilities |
| `/how-it-works` | Sense → analyze → respond → protect loop, setup, FAQ, closing CTA |
| `/contact` | Inquiry form, direct contact, quote steps, team, and FAQ |
| `/download` | QR/direct app link, illustrative app screens, and prototype disclosure |

## Technical status

- Stack: React 19, TypeScript, Vite, Tailwind CSS v4, Three.js, React Three Fiber, Motion utilities, and Lucide icons.
- Routing: small static-path router in `src/lib/route.ts`; no router dependency.
- 3D: the supplied SketchUp-derived `public/moldguard.glb`, loaded lazily by `src/components/DeviceViewer.tsx` and framed by `src/components/DeviceScene.tsx`.
- Contact: Google Forms when configured, with a mailto fallback. The response is not stored by this site.
- Dashboard and app values are illustrative demo data and are labelled as such in the UI.

## Source and uncertainty register

- Primary visual/content reference: `/home/attila/Downloads/MoldGuard (1).pdf`.
- Proposal reference: `/home/attila/Downloads/Proposal - FINISHED.docx`.
- Visible copy source: `src/content.ts`.
- The proposal and current website contain unresolved component/BOM differences around VOC sensing, controller variant, and enclosure dimensions. Those claims must not be presented as independently verified until the hardware source documents are reconciled.

## Current acceptance criteria

- Every route renders without horizontal overflow.
- The real GLB remains the 3D source of truth.
- Demo values remain explicitly illustrative.
- Forms expose labels, validation, and a truthful fallback.
- Build, lint, axe, visual route QA, and 3D fallback checks run before release.
