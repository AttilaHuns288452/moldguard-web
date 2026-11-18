import { useEffect, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { ContactShadows, Environment, Html, useGLTF, AdaptiveDpr } from '@react-three/drei'
import * as THREE from 'three'
import { PARTS, type PartId } from './parts'

/* The model is the team's own SketchUp assembly: 12 semantic components,
   144,486 tris, 795 KB Draco-compressed. It is authored Y-up with the control
   head on top (verified from the file's node transforms: chassis 0.664–0.823,
   peltier 0.000–0.799). Do NOT rotate or re-normalise it. */

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
  const spin = useRef(-0.55)
  const drag = useRef({ down: false, x: 0, y: 0, yaw: 0, pitch: 0 })
  const fitR = useRef(1.9)
  const target = useRef(new THREE.Vector3(0, 0.41, 0))
  const meshes = useRef<Record<string, THREE.Mesh>>({})
  const basePos = useRef<Record<string, THREE.Vector3>>({})

  useEffect(() => {
    model.traverse((o) => {
      const m = o as THREE.Mesh
      if (!m.isMesh) return
      m.castShadow = true
      m.receiveShadow = true
      const mats = Array.isArray(m.material) ? m.material : [m.material]
      mats.forEach((x) => { if (x) (x as THREE.Material).side = THREE.FrontSide })
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

    // frame from the model's own measured extent (Y-up, head on top)
    const bb = new THREE.Box3().setFromObject(model)
    const sz = bb.getSize(new THREE.Vector3())
    model.position.x -= bb.getCenter(new THREE.Vector3()).x
    model.position.z -= bb.getCenter(new THREE.Vector3()).z
    model.position.y -= bb.min.y
    model.updateWorldMatrix(true, true)

    const cam = camera as THREE.PerspectiveCamera
    const halfFov = THREE.MathUtils.degToRad(cam.fov / 2)
    fitR.current = Math.max(
      (sz.y / (2 * Math.tan(halfFov))) / 0.94,
      (sz.x / (2 * Math.tan(halfFov) * cam.aspect)) / 0.7,
    )
    target.current.set(0, sz.y / 2, 0)
    ready.current = true
    onLoaded()
  }, [model, scene, onLoaded, camera])

  useEffect(() => {
    if (!ready.current) return
    drag.current.yaw = 0
    drag.current.pitch = 0
    spin.current = -0.55
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
      if (!m.userData.baseEmissive) {
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
        const dir = new THREE.Vector3(part.at[0], part.at[1] - 0.41, part.at[2]).normalize()
        const goal = mode === 'explode'
          ? base.clone().add(dir.multiplyScalar(0.11))
          : base.clone()
        m.position.lerp(goal, k)
      }
    }
  })

  useFrame((_, dt) => {
    if (!ready.current) return
    if (settle.current < 1) settle.current = Math.min(1, settle.current + dt * 0.9)
    const ease = 1 - Math.pow(1 - settle.current, 3)
    if (autoSpin && !drag.current.down) spin.current += dt * 0.2
    const yaw = spin.current + drag.current.yaw
    const pitch = drag.current.pitch
    const r = (fitR.current / zoom) * (1 + (1 - ease) * 0.16)
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
      shadows
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      camera={{ fov: 30, near: 0.05, far: 40, position: [-0.95, 0.47, 1.55] }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping
        gl.toneMappingExposure = 0.95
      }}
    >
      <AdaptiveDpr pixelated />
      <ambientLight intensity={0.55} />
      <directionalLight position={[1.2, 1.9, 1.5]} intensity={2.4} color="#eaf2ff" castShadow shadow-mapSize={[1024, 1024]} />
      <directionalLight position={[-1.8, 1.1, -0.7]} intensity={0.7} color="#cfe2ff" />
      <pointLight position={[0.2, 0.5, 1.5]} intensity={0.8} color="#ffffff" />
      <Environment preset="studio" environmentIntensity={0.5} />
      <Rig {...props} />
      <ContactShadows position={[0, 0, 0]} opacity={0.42} scale={2.2} blur={2.2} far={0.95} resolution={512} color="#15385e" />
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
