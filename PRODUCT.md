# MoldGuard Product Brief

## Purpose

MoldGuard is a real IoT product being built and sold as one-time hardware: room sensing, a Mold Risk Index, a thermoelectric dehumidification response, and a companion app. The site is a sales funnel: every path ends at a conversation or quotation request (`/contact`), never a checkout.

## Offer

- One business model: a one-time hardware sale. No subscriptions, no premium tiers, no development fees on customer surfaces.
- Selling price: **PHP 9,994**, one payment, no subscription. Source: feasibility study Section 3.4 and `moldguard-defense/cba/MoldGuard_Cost_Benefit_Analysis.md` (product summary and selling-price input).
- The price is stated as the price. Retail availability, certification, delivery, warranty and service terms are not confirmed; the quotation confirms them. No stock, shipping, warranty or payment claims are made on the site.
- The device is scoped to **one small enclosed room**. Numeric room coverage is deliberately omitted (source documents conflict: 9.7 m³ vs 30 m³); suitability is confirmed in the inquiry.
- Not a mold diagnostic, no guaranteed prevention. Existing mold requires professional remediation.
- App/dashboard values remain illustrative and labelled. No app-store listing exists; the build is sent on request.

## Copy and claims

- Visible copy: `src/content.ts` (`OFFER`, `HERO`, `PROBLEM`, `FEATURES`, `OWN`, `FAQ`, `CONTACT_PAGE`). `OFFER` is the single source of the price and CTA used by the hero, ownership band, closing CTA and header.
- Internal component cost is not a customer price and must not appear on customer surfaces.
- The contact form keeps its Google Forms transport (entry ids unchanged) and its mailto fallback; a sent submission is reported as *sent by the browser*, not as confirmed received.

## Users

- Renters and small property owners dealing with humidity-prone rooms.
- Larger households, dormitories, and property managers are future or planned audiences for multi-room views.

## Positioning

MoldGuard is presented as a system that reasons about humidity, temperature, and sustained exposure instead of reacting to humidity alone. It is not a mold diagnostic and does not replace professional inspection.

## Information architecture

| Route | Purpose |
|---|---|
| `/` | Outcome-led hero with the price, problem, real hardware explorer, outcomes, purchase offer, placement, buyer FAQ, closing CTA |
| `/features` | Mold-specific intelligence, risk engine, comparison, parts, and product capabilities |
| `/how-it-works` | Sense → analyze → respond → protect loop, setup, FAQ, closing CTA |
| `/contact` | Quotation request (form first on mobile), direct contact, three steps from room to quote, team, and FAQ |
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
