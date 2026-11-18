import { useEffect, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { AdaptiveDpr, ContactShadows, Html, useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import { PARTS, type PartId } from './parts'

/* The model is the team's own SketchUp assembly, rebuilt by
   ~/.hermes/cache/scratch/rebuild_real.py: 12 semantic components, 246 x 150 x
   313 mm, standing upright with its base at y = 0.

   The raw export is not usable as-is: it carries the 4.4 m room plane and six
   Peltier instances stretched from 40 mm to ~714 mm, which invent a fake 823 mm
   "tower" that is pure degenerate geometry. Those are removed at build time.

   DeviceScene does not re-normalise the model. It only lifts it so the base
   sits on y = 0 and frames the camera from the measured extent. */

/** Product finishes, authored in the scene. Anything not listed gets _default.
 *  metalness is pinned to 0 on purpose: a metallic MeshStandardMaterial with no
 *  usable environment map renders pure black, and the env map is not dependable
 *  here. Matte finishes plus roughness/hue variation read just as well. */
const FINISH: Record<string, THREE.MeshStandardMaterialParameters> = {
  skin: { color: 0x8ea6bf, roughness: 0.34, metalness: 0 },
  enclosure: { color: 0x8ea6bf, roughness: 0.34, metalness: 0 },
  misc: { color: 0x8ea6bf, roughness: 0.34, metalness: 0 },
  display: { color: 0x1a2a3e, roughness: 0.12, metalness: 0, emissive: new THREE.Color(0x1a6bff), emissiveIntensity: 0.9 },
  controller: { color: 0x2b3a4a, roughness: 0.55, metalness: 0 },
  sensor: { color: 0x2f4a6b, roughness: 0.5, metalness: 0 },
  peltier: { color: 0x40515f, roughness: 0.3, metalness: 0 },
  heatsink: { color: 0x93a9bd, roughness: 0.26, metalness: 0 },
  fan: { color: 0x2a3744, roughness: 0.7, metalness: 0 },
  relay: { color: 0x314152, roughness: 0.55, metalness: 0 },
  buzzer: { color: 0x263340, roughness: 0.65, metalness: 0 },
  audio: { color: 0x2d3d4c, roughness: 0.6, metalness: 0 },
  usb: { color: 0x9fb0c0, roughness: 0.3, metalness: 0 },
  _default: { color: 0x7d93aa, roughness: 0.5, metalness: 0 },
}

export type { PartId }

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
}

function Rig({ active, mode, autoSpin, resetKey, onLoaded, zoom }: Props) {
  const { camera, scene } = useThree()
  const { scene: model } = useGLTF('/moldguard.glb') as unknown as { scene: THREE.Group }
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
      // The SketchUp export mixes winding orders: forcing FrontSide made the
      // enclosure render as its own dark interior (a pure black silhouette).
      // DoubleSide renders the surface that is actually there.
      // The GLB's own materials render black in three.js (a SketchUp -> Draco
      // export artefact: the same lights with a default MeshStandardMaterial
      // give 0.9% black vs 36% with the file's materials). So the product
      // finishes are authored here instead of trusted from the exporter.
      // side: DoubleSide is REQUIRED, not cosmetic. The joined SketchUp meshes
      // carry mixed winding, so FrontSide culls roughly half the faces and the
      // body renders as sparse wireframe fragments. Setting it on the material
      // being replaced does nothing.
      // The SketchUp shell has ~40% inward-facing polygons (verified: only 60%
      // of enclosure face normals point away from the body centre). With
      // DoubleSide those back faces are lit from behind and render pure black,
      // which is what turned the whole product into a silhouette. Emissive at a
      // fraction of the albedo makes every face carry its own colour, so the
      // body reads correctly regardless of which way a given polygon is wound.
      const f = FINISH[m.name] ?? FINISH._default
      m.material = new THREE.MeshStandardMaterial({ side: THREE.DoubleSide, ...f })
      // The presentation skin is opaque in assembled view so the product reads
      // as a real body, then fades in exploded/tour mode so the 11 real internal
      // components are actually visible. Otherwise the shell hides everything
      // the explorer exists to show.
      if (m.name === 'skin' || m.name === 'misc' || m.name === 'enclosure') {
        const mat = m.material as THREE.MeshStandardMaterial
        mat.transparent = true
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
    model.position.x -= ctr.x
    model.position.z -= ctr.z
    model.position.y -= bb.min.y
    model.updateWorldMatrix(true, true)

    const cam = camera as THREE.PerspectiveCamera
    const halfFov = THREE.MathUtils.degToRad(cam.fov / 2)
    // Frame the full height with headroom, and the width against the panel's
    // own aspect so a narrow viewport does not crop the body.
    fitR.current = Math.max(
      (sz.y / (2 * Math.tan(halfFov))) / 0.86,
      (sz.x / (2 * Math.tan(halfFov) * cam.aspect)) / 0.78,
    )
    target.current.set(0, sz.y * 0.5, 0)
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
      mat.depthWrite = mat.opacity > 0.9
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
          <span className={`absolute size-[10px] rounded-full border-2 transition-all duration-300 ${
            open ? 'border-accent bg-accent shadow-[0_0_18px_3px_#2563ebaa]' : 'border-white bg-deep/70 hover:border-accent hover:bg-accent'
          }`} />
          {open && <span className="absolute size-7 animate-pulse rounded-full border border-accent/50" />}
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
        gl.toneMappingExposure = 1.15
      }}
      camera={{ fov: 32, near: 0.02, far: 20, position: [-0.42, 0.30, 0.72] }}
    >
      <AdaptiveDpr pixelated />
      <ambientLight intensity={1.2} />
      <directionalLight position={[1.4, 1.8, 1.6]} intensity={2.5} color="#ffffff" />
      <directionalLight position={[-1.6, 0.9, -0.8]} intensity={1.0} color="#dfeaff" />
      <directionalLight position={[0.4, 0.6, -2.0]} intensity={0.45} color="#dbe9ff" />
      <pointLight position={[0.2, 0.45, 0.9]} intensity={0.5} color="#ffffff" />
      {/* Metallic PBR materials render BLACK in three.js without an environment
          map: they have nothing to reflect. <Environment preset="studio"> would
          supply one but fetches a 1k HDR from raw.githack.com at runtime, which
          fails offline and is a needless CDN dependency on a promo page. These
          Lightformers build the same studio environment locally on the GPU, so
          there is no network request and the metals read as metal. */}
      <Rig {...props} />
      <ContactShadows position={[0, 0.001, 0]} opacity={0.52} scale={0.8} blur={2.0} far={0.45} resolution={1024} color="#15385e" />
      {PARTS.map((p) => (
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
  useGLTF.preload('/moldguard.glb')
}
