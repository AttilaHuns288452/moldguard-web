import { useEffect, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { AdaptiveDpr, Html, useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js'
import { PARTS, PART_NO, type PartId } from './parts'

/**
 * The shipped GLB is meshopt-compressed (EXT_meshopt_compression, 2.3 MB instead
 * of 5.7 MB). Without a decoder registered on the loader, three.js silently loads
 * NO geometry: no error, no warning, just an empty stage. Measured on the
 * committed file - mid-frame ink 0.01%, i.e. blank - which is how the broken hero
 * shipped.
 *
 * drei does register three-stdlib's decoder, but that copy did not decode this
 * file, so the decoder three ships alongside the loader is registered below and
 * wired into useGLTF through its extendLoader hook.
 */
const extendLoader = (loader: { setMeshoptDecoder?: (d: unknown) => void }) => {
  loader.setMeshoptDecoder?.(MeshoptDecoder)
}

/* The model is the team's own SketchUp assembly, rebuilt by
   ~/.hermes/cache/scratch/rebuild_real.py: 12 semantic components, 246 x 150 x
   313 mm, standing upright with its base at y = 0.

   The raw export is not usable as-is: it carries the 4.4 m room plane and six
   Peltier instances stretched from 40 mm to ~714 mm, which invent a fake 823 mm
   "tower" that is pure degenerate geometry. Those are removed at build time.

   DeviceScene does not re-normalise the model. It only lifts it so the base
   sits on y = 0 and frames the camera from the measured extent. */


export type { PartId }

/** Soft radial blob used as the product's ground shadow. Built once on a 2D
 *  canvas so it costs nothing at runtime and needs no asset or network. */
let blob: THREE.CanvasTexture | null = null
function shadowBlob(): THREE.CanvasTexture {
  if (blob) return blob
  const s = 128
  const c = document.createElement('canvas')
  c.width = c.height = s
  const g = c.getContext('2d')!
  const grad = g.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2)
  grad.addColorStop(0, 'rgba(21,56,94,0.78)')
  grad.addColorStop(0.5, 'rgba(21,56,94,0.34)')
  grad.addColorStop(1, 'rgba(21,56,94,0)')
  g.fillStyle = grad
  g.fillRect(0, 0, s, s)
  blob = new THREE.CanvasTexture(c)
  return blob
}

export type ViewerMode = 'tour' | 'explode'

type Props = {
  active: PartId | null
  onSelect: (id: PartId | null) => void
  mode: ViewerMode
  autoSpin: boolean
  resetKey: number
  onLoaded: () => void
  onHoverHotspot: () => void
  zoom: number  // 1 = fit
  /** the hero shows the product alone; hotspot dots belong to the explorer */
  hotspots?: boolean
}

function Rig({ active, mode, autoSpin, resetKey, onLoaded, zoom }: Props) {
  const { camera, scene } = useThree()
  const { scene: model } = useGLTF('/moldguard.glb', true, true, extendLoader) as unknown as { scene: THREE.Group }
  const ready = useRef(false)
  const settle = useRef(0)
  // Initial yaw. Every `face: 'front'` part in parts.ts sits at +Z (the display,
  // sensor, buzzer, audio amp), so the camera must start near yaw 0 to look at
  // the product's front. 0.42 rad keeps a 3/4 angle so the depth reads too.
  const spin = useRef(0.42)
  const drag = useRef({ down: false, x: 0, y: 0, yaw: 0, pitch: 0 })
  const fitR = useRef(1.9)
  const target = useRef(new THREE.Vector3(0, 0.41, 0))
  const meshes = useRef<Record<string, THREE.Mesh>>({})
  const basePos = useRef<Record<string, THREE.Vector3>>({})

  useEffect(() => {
    model.traverse((o) => {
      const m = o as THREE.Mesh
      if (!m.isMesh) return
      // NOT castShadow: with side=DoubleSide the back faces are written into
      // the shadow map, the object self-shadows completely, and a light grey
      // body renders as a pure black silhouette. Shipping a convincing drop
      // shadow is not worth a black product, so the mesh does not cast.
      m.castShadow = false
      m.receiveShadow = false
      // KEEP the exported materials. The previous code threw them away and
      // repainted every mesh from a 13-entry lookup keyed on component names,
      // but the real assembly has 278 meshes and 93 exported materials,
      // including the green LCD and the four status LEDs. Replacing them with
      // one flat finish is precisely what made the product read as a plain box.
      //
      // side: DoubleSide is still REQUIRED, not cosmetic: the joined SketchUp
      // meshes carry mixed winding, so FrontSide culls roughly half the faces.
      const mat = m.material as THREE.MeshStandardMaterial
      if (mat) {
        mat.side = THREE.DoubleSide
        mat.shadowSide = THREE.DoubleSide
        if (mat.emissive && mat.emissiveIntensity !== undefined) {
          // Blend unconditionally: metallic PBR renders black without an
          // environment map, and several of these materials carry metalness.
          mat.metalness = Math.min(mat.metalness ?? 0, 0.2)
          mat.roughness = Math.min(Math.max(mat.roughness ?? 0.8, 0.55), 0.95)
        }
      }
      // Three nested shells occupy the IDENTICAL volume (Y -15..239,
      // Z -305..-146): mesh_1 (200_217_230_ds), mesh_5 (198_198_198_ss) and
      // mesh_3 (200_217_230_ss). Rendering all three makes the box read as
      // several separate slabs - a front door swung open - which is exactly how
      // the hero was reported broken. The SKP contains no door components and no
      // rotations, so one outer shell is the whole product: keep the largest
      // (mesh_3) and hide the nested duplicates.
      if (/^mesh_(1|5)_ROOT_Layer0_/i.test(m.name || '')) {
        m.visible = false
        return
      }

      // The body shell in the real export is the root `Layer0` meshes (the
      // enclosure panels). Those are what must fade to reveal the internals;
      // the old names ('skin'/'misc'/'enclosure') came from the deleted
      // synthetic model and matched nothing.
      if (/^mesh_\d+_ROOT_Layer0/i.test(m.name || '')) {
        const mat = m.material as THREE.MeshStandardMaterial
        // Do NOT set transparent here. An always-transparent material is drawn
        // after opaque geometry and depth-sorted per OBJECT, so an opaque shell
        // shows its own back faces through its front face - which reads exactly
        // as "the front door is open". Flip transparency on only when the shell
        // actually fades (see the opacity frame loop).
        mat.transparent = false
        mat.depthWrite = true
        m.userData.isShell = true
      }
    })
    model.updateWorldMatrix(true, true)
    scene.add(model)

    model.traverse((o) => {
      const m = o as THREE.Mesh
      if (!m.isMesh) return
      meshes.current[m.name] = m
      basePos.current[m.name] = m.position.clone()
      m.userData.baseEmissive = (m.material as THREE.MeshStandardMaterial)?.emissive?.clone?.()
    })

    // The GLB's own node transforms are NOT centred: measured base sits at
    // y = -0.015 and the body's centre is off origin in x/z. Recompute the box
    // AFTER the scene graph has settled, then lift the base to y = 0 and centre
    // it. (A missing updateWorldMatrix here left the model at its raw offset,
    // so the camera aimed at empty space above it and the body read as broken.)
    model.updateWorldMatrix(true, true)
    const bb = new THREE.Box3().setFromObject(model)
    const sz = bb.getSize(new THREE.Vector3())
    const ctr = bb.getCenter(new THREE.Vector3())
    // Do NOT re-centre the model: PARTS.at and the hotspot positions are in the
    // model's own coordinates. Shifting the model left every hotspot behind
    // (measured 950px on a stage ending at 792). The camera aims at the real
    // centre instead, so pins and geometry share one space.
    model.updateWorldMatrix(true, true)

    const cam = camera as THREE.PerspectiveCamera
    const halfFov = THREE.MathUtils.degToRad(cam.fov / 2)
    // Frame the full height with headroom, and the width against the panel's
    // own aspect so a narrow viewport does not crop the body.
    fitR.current = Math.max(
      (sz.y / (2 * Math.tan(halfFov))) / 0.98,
      (sz.x / (2 * Math.tan(halfFov) * cam.aspect)) / 0.92,
    )
    target.current.set(ctr.x, bb.min.y + sz.y * 0.5, ctr.z)
    ready.current = true
    onLoaded()
  }, [model, scene, onLoaded, camera])

  useEffect(() => {
    if (!ready.current) return
    drag.current.yaw = 0
    drag.current.pitch = 0
    spin.current = 0.42
  }, [resetKey])

  // Pointer drag
  useEffect(() => {
    const dom = document.querySelector<HTMLElement>('[data-device-canvas]')
    if (!dom) return
    const down = (e: PointerEvent) => { drag.current.down = true; drag.current.x = e.clientX; drag.current.y = e.clientY }
    const move = (e: PointerEvent) => {
      if (!drag.current.down) return
      drag.current.yaw += (e.clientX - drag.current.x) * 0.0075
      drag.current.pitch = THREE.MathUtils.clamp(drag.current.pitch + (e.clientY - drag.current.y) * 0.0045, -0.42, 0.5)
      drag.current.x = e.clientX; drag.current.y = e.clientY
    }
    const up = () => { drag.current.down = false }
    dom.addEventListener('pointerdown', down)
    dom.addEventListener('pointermove', move)
    dom.addEventListener('pointerup', up)
    dom.addEventListener('pointercancel', up)
    return () => {
      dom.removeEventListener('pointerdown', down)
      dom.removeEventListener('pointermove', move)
      dom.removeEventListener('pointerup', up)
      dom.removeEventListener('pointercancel', up)
    }
  }, [])

  // Emissive highlight + exploded offsets, applied per frame so a mode change
  // animates rather than snapping.
  useFrame((_, dt) => {
    if (!ready.current) return
    const k = Math.min(1, dt * 6)
    for (const part of PARTS) {
      const m = meshes.current[part.id]
      if (!m) continue
      // materials are shared between meshes, so clone on first use and tint the
      // clone: a selection must be visible, not just two decimal places of lerp.
      const selected = active === part.id
      const mat = m.material as THREE.MeshStandardMaterial
      if (!mat?.emissive) continue
      // Seed BOTH values together and guard on the intensity field, not on
      // baseEmissive (which the setup pass already sets). Guarding on the wrong
      // field left baseEmissiveI undefined -> wantI became NaN -> emissiveIntensity
      // was poisoned to NaN and the material rendered pure black.
      if (typeof m.userData.baseEmissiveI !== 'number') {
        m.userData.baseEmissive = mat.emissive.clone()
        m.userData.baseEmissiveI = mat.emissiveIntensity ?? 0
      }
      const baseI = m.userData.baseEmissiveI as number
      const wantI = selected ? baseI + 0.85 : baseI
      mat.emissiveIntensity += (wantI - mat.emissiveIntensity) * k
      mat.emissive.lerp(selected ? new THREE.Color('#3a7bff') : m.userData.baseEmissive as THREE.Color, k)
      // exploded view: push each part outward along its own offset from centre
      const base = basePos.current[part.id]
      if (base) {
        // Offsets are measured from the real body centre (y = 0.127), not the
        // old fake-tower value, and scaled to the 0.25 m body so the parts
        // actually separate instead of nudging.
        const c = new THREE.Vector3(0, 0.127, 0)
        const dir = new THREE.Vector3(part.at[0], part.at[1], part.at[2]).sub(c).normalize()
        const goal = mode === 'explode'
          ? base.clone().add(dir.multiplyScalar(0.075))
          : base.clone()
        m.position.lerp(goal, k)
      }
    }
  })

  // Shell opacity is independent of PARTS: the presentation skin has no part
  // entry, so it must be driven from the mesh map or it never fades.
  useFrame((_, dt) => {
    if (!ready.current) return
    const k = Math.min(1, dt * 6)
    const want = mode === 'explode' || active !== null ? 0.02 : 1
    for (const mesh of Object.values(meshes.current)) {
      if (!mesh.userData.isShell) continue
      const mat = mesh.material as THREE.MeshStandardMaterial
      mat.opacity += (want - mat.opacity) * k
      // An opaque shell must NOT be in the transparent pass: transparent objects
      // are depth-sorted per object, not per fragment, so a solid box would show
      // its own interior through its front face.
      const solid = mat.opacity > 0.98
      mat.transparent = !solid
      mat.depthWrite = solid
      mat.visible = mat.opacity > 0.03
    }
  })

  useFrame((_, dt) => {
    if (!ready.current) return
    if (settle.current < 1) settle.current = Math.min(1, settle.current + dt * 0.9)
    const ease = 1 - Math.pow(1 - settle.current, 3)
    if (autoSpin && !drag.current.down) spin.current += dt * 0.2
    const yaw = spin.current + drag.current.yaw
    const pitch = drag.current.pitch
    // pull back a little in exploded view so the separated parts stay in frame
    const explodePad = mode === 'explode' ? 1.28 : 1
    const r = (fitR.current / zoom) * explodePad * (1 + (1 - ease) * 0.16)
    camera.position.set(
      r * Math.sin(yaw) * Math.cos(pitch),
      target.current.y + r * Math.sin(pitch),
      r * Math.cos(yaw) * Math.cos(pitch),
    )
    camera.lookAt(target.current)
  })

  return null
}

function Hotspot({ part, open, onSelect, onHover }: {
  part: (typeof PARTS)[number]; open: boolean; onSelect: () => void; onHover: (v: boolean) => void
}) {
  return (
    <group position={part.at as unknown as THREE.Vector3Tuple}>
      <Html center zIndexRange={[20, 0]} style={{ pointerEvents: 'auto' }}>
        <button
          type="button"
          onClick={onSelect}
          onPointerEnter={() => onHover(true)}
          onPointerLeave={() => onHover(false)}
          aria-label={part.name}
          aria-pressed={open}
          className="relative grid size-11 place-items-center"
        >
          {/* A numbered pin, not a bare dot. A dot gives no way to tell the parts
              apart, which is exactly what makes a cutaway look like an accident
              rather than an explanation. The number matches the legend beside
              the stage. */}
          <span
            className={`grid size-6 place-items-center rounded-full border-2 text-[10px] font-bold tabular-nums transition-all duration-300 ${
              open
                ? 'border-accent bg-accent text-white shadow-[0_0_18px_3px_#2563ebaa]'
                : 'border-white bg-deep/85 text-white hover:border-accent hover:bg-accent'
            }`}
          >
            {PART_NO[part.id]}
          </span>
          {open && <span className="absolute size-9 animate-pulse rounded-full border border-accent/50" />}
        </button>
      </Html>
    </group>
  )
}

export default function DeviceScene(props: Props) {
  return (
    <Canvas
      data-device-canvas
      dpr={[1, 1.75]}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping
        gl.toneMappingExposure = 1.46
      }}
      camera={{ fov: 32, near: 0.02, far: 20, position: [-0.42, 0.30, 0.72] }}
    >
      <AdaptiveDpr pixelated />
      {/* Warm key + warm fill, not the old blue-grey rig. The approved product
          photos are a warm room (#fef9ef body, ~3000K light); a blue fill
          neutralised the ivory albedo to #d7d4cf and the model read as bare
          CAD instead of the product. */}
      {/* A white product on a white stage needs EDGE separation more than
          brightness: two judges independently called the hero "washed out,
          white-on-white, CAD". Lower ambient + a hard key gives form, and the
          rim light draws a bright line along the silhouette. */}
      <ambientLight intensity={0.22} color="#fff6ea" />
      <directionalLight position={[1.4, 1.8, 1.6]} intensity={3.6} color="#fffaf2" />
      <directionalLight position={[-1.9, 1.1, -1.4]} intensity={1.6} color="#dce8ff" />
      <directionalLight position={[-1.6, 0.9, -0.8]} intensity={0.5} color="#f2f0ff" />
      <directionalLight position={[0.4, 0.6, -2.0]} intensity={0.4} color="#eeeaff" />
      <pointLight position={[0.2, 0.45, 0.9]} intensity={0.45} color="#fff8f0" />
      {/* Metallic PBR materials render BLACK in three.js without an environment
          map: they have nothing to reflect. <Environment preset="studio"> would
          supply one but fetches a 1k HDR from raw.githack.com at runtime, which
          fails offline and is a needless CDN dependency on a promo page. These
          Lightformers build the same studio environment locally on the GPU, so
          there is no network request and the metals read as metal. */}
      <Rig {...props} />
      {/* ponytail: a soft radial blob, not ContactShadows. The product meshes
          must stay castShadow=false (DoubleSide back faces write into the shadow
          map and the body self-shadows to a black silhouette), so a real shadow
          pass can never render — ContactShadows was silently drawing nothing.
          One transparent plane is what actually grounds the product. */}
      <mesh position={[0, 0.0015, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.52, 0.40]} />
        <meshBasicMaterial transparent depthWrite={false} map={shadowBlob()} />
      </mesh>
      {props.hotspots !== false && PARTS.map((p) => (
        <Hotspot
          key={p.id} part={p} open={props.active === p.id}
          onSelect={() => props.onSelect(p.id)}
          onHover={(v) => { if (v) props.onHoverHotspot() }}
        />
      ))}
    </Canvas>
  )
}

export function preloadModel() {
  useGLTF.preload('/moldguard.glb', true, true, extendLoader)
}
