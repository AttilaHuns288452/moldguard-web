# MoldGuard — promotional website

Production: **https://moldguard-web.vercel.app**

React 19 + TypeScript + Vite 8 + Tailwind v4 + React Three Fiber, with the team's
own SketchUp model (`final-3d.skp`) shipped as an interactive glTF.

## Run

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # dist/
node scripts/qa.mjs [url]   # visual + interaction QA, 103 checks, writes .qa/
```

## Source of truth

| What | Where |
|---|---|
| Product claims, contact, team, FAQ | `src/content.ts` — every string traces to `MoldGuard.pdf` |
| Palette + type + surfaces | `src/styles/tokens.css` — sampled from the PDF, not invented |
| 3D model pipeline | `~/.hermes/cache/scratch/export_final.py` (Blender) → `public/moldguard.glb` |
| Section components | `src/sections/` |
| 3D viewer | `src/components/DeviceViewer.tsx` (loading/fallback) + `DeviceScene.tsx` (R3F) |

## Design system

Colours are **measured from the PDF**, not chosen: ice-blue ground `#eaf2fc`,
deep navy `#15385e` / `#0f2747` / `#0a1f3c`, electric cobalt `#2563eb` as the one
accent, slate ink `#465e7a` / `#46586f`. Severity is carried by type weight and
background intensity, never by coloured lamps. Bricolage Grotesque display,
Figtree text, Spline Sans Mono for measurements only.

## The 3D model

`final-3d.skp` is a **technical assembly**, not a sealed enclosure: a 317 x 292 mm
control head at the base, a six-module Peltier column rising to 823 mm, and an
exposed electronics layout. That is the real geometry, so the site presents it
honestly as an engineering cutaway rather than inventing a closed pod.

Pipeline (`export_final.py`, Blender 5.2 headless):

1. Import the supplied GLB; drop the 4.4 m floor slab and 19 parked duplicates.
2. Join 284 meshes into 12 semantic parts (chassis, peltier, display, sensors…).
3. Bake mm→m, centre X/Y, base on Z=0. **Do not pre-rotate**: the exporter's own
   Z-up→Y-up conversion stands it up. Pre-rotating applies it twice and lays the
   model on its side.
4. Decimate 0.5 → 72k tris (from 145k), assign 12 art-directed materials.
5. Export Draco-compressed: **394 KB**.

Verify orientation numerically, never by eye:

```bash
python3 -c "import json,struct;d=open('public/moldguard.glb','rb').read();cl,_=struct.unpack('<I4s',d[12:20]);j=json.loads(d[20:20+cl]);a=j['accessors'];s=[round(max(a[p['attributes']['POSITION']]['max'][i] for m in j['meshes'] for p in m['primitives'])-min(a[p['attributes']['POSITION']]['min'][i] for m in j['meshes'] for p in m['primitives']),3) for i in range(3)];print(s)"
# expect [0.317, 0.823, 0.292] — tall axis must be index 1 (glTF Y-up)
```

## What is illustrative vs real

- The hero risk readout (`38`, `82% RH`, `26h`) and every dashboard/app value is
  **demo data**, labelled as such on screen. The page is not connected to a device.
- The contact form has **no backend**: it composes a `mailto:` to the team address
  and says so. Nothing is stored.
- Everything else (product capabilities, hardware, placement, team, FAQ) is from
  the PDF.

## Known limitations

- **Lighthouse performance reads 58 in this container** because the 3D mesh
  renders through SwiftShader software GL. Blocking the GLB gives 76 with 480 ms
  TBT, which is the real-user shape. Re-measure on GPU hardware before quoting.
- `og.png` is a screenshot of the live hero; regenerate if the hero changes.
- Vercel SSO protection is enabled at team level, so only the production alias
  `moldguard-web.vercel.app` is public; raw `*-projects.vercel.app` URLs redirect
  to a Vercel login. That is a team setting, deliberately not changed here.
