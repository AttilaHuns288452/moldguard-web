# MoldGuard Messaging Register

**Purpose:** keep visible claims traceable to the supplied references and current implementation.

| ID | Visible claim | Current source | Status |
|---|---|---|---|
| C1 | MoldGuard watches humidity, temperature, and air conditions. | `src/content.ts` `HERO`, `LOOP`; PDF pages 1–3 | Approved product narrative; hero wording now frames the output as mold-friendly environmental conditions |
| C2 | The Mold Risk Index combines conditions and sustained exposure rather than one humidity threshold. | `src/content.ts` `CAPABILITIES`, `LOOP`; PDF page 2 and proposal | Approved narrative |
| C3 | The thermoelectric stack responds automatically and extracted water is collected in a tank. | `src/content.ts` `LOOP`, `FAQ`; PDF/proposal | Approved narrative, prototype behavior |
| C4 | Dashboard/app readouts such as 38/100, room states, and sample duration are illustrative. | `src/content.ts` comments and UI disclosures | Must remain labelled demo/illustrative |
| C5 | The supplied GLB is a real SketchUp-derived assembly shown as a technical/open view. | `README.md`, `public/moldguard.glb`, `src/components/DeviceScene.tsx` | Verified implementation fact |
| C6 | VOC sensing provides supplementary context, not proof of mold. | `src/content.ts` `CAPABILITIES`, `FEATURES`, `PARTS_TRUST` | Site claim; proposal BOM reconciliation still required |
| C7 | Multi-room and multi-unit views are available in the base product. | Older site copy conflicted with `FAQ`, feature rows, and analytics copy | Corrected everywhere to planned optional tier |
| C8 | The device is not a mold diagnostic or substitute for professional inspection. | `src/content.ts` `CONTACT.disclaimer`, `Footer.tsx` | Required safety limitation |
| C9 | The contact form sends to the team inbox. | `src/sections/Contact.tsx`, Google Forms configuration | Conditional: Google Forms when configured; otherwise mailto fallback |
| C10 | The app is available through an app store. | No verified store listing in current project | Do not claim; current page uses QR/direct link and prototype disclosure |
| C11 | Component/BOM details such as VOC sensor, controller variant, and enclosure dimensions are final. | `src/content.ts` vs `Proposal - FINISHED.docx` | **Unresolved**; reconcile before using as authoritative technical specification |
| C12 | The project is a student prototype under evaluation, not a confirmed commercial order. | `src/content.ts` `CONTACT_PAGE.steps.note`, `HERO.status`; proposal | Required contextual limitation; direct app access is not an app-store listing |

## Publishing rule

Before changing visible product copy, update this register and verify the claim against the PDF, proposal, current hardware source, or an explicitly labelled illustrative-data decision. Never convert demo values, planned features, or unresolved BOM details into unqualified production claims.
