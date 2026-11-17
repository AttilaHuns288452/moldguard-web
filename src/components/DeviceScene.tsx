import { useEffect, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { ContactShadows, Environment, Html, useGLTF, AdaptiveDpr } from '@react-three/drei'
import * as THREE from 'three'
import type { HotspotId } from './DeviceViewer'

/* The model is the team's own SketchUp assembly, exported to glTF and
   re-materialed for the site. Draco-compressed: 714 KB, 12 parts, 144k tris.
   Proportions are untouched: 317 x 292 x 823 mm, base sitting on y = 0. */

export const HOTSPOTS = [
  { id: 'display', label: 'Status display',   copy: 'Reads out the current risk state and the automation rule that is running.', at: [-0.154, 0.739, 0.055] },
  { id: 'sensors', label: 'Humidity / temperature', copy: 'DHT11 feeds relative humidity and temperature to the Mold Risk Index.', at: [-0.021, 0.820, 0.035] },
  { id: 'tof',     label: 'Surface distance', copy: 'VL53L0X time-of-flight sensor: a proximity reading alongside humidity, temperature and VOC.', at: [0.002, 0.711, -0.001] },
  { id: 'dry',     label: 'Thermoelectric stack', copy: 'Six Peltier modules on the 0.8 m column, with fan and heatsink. This is what pulls moisture out of the air.', at: [-0.126, 0.400, -0.075] },
  { id: 'power',   label: 'Control & relay board', copy: 'ESP32, relay module and stereo amp: the electronics that decide when the dehumidifier runs.', at: [0.001, 0.744, -0.019] },
] as const


type Props = {
  resetKey: number
  autoSpin: boolean
  active: HotspotId | null
  onHotspot: (id: HotspotId | null) => void
  onLoaded: () => void
  onError?: () => void
}

function Rig({ autoSpin, resetKey, onLoaded }: Props) {
  const { camera, scene } = useThree()
  const { scene: model } = useGLTF('/moldguard.glb') as unknown as { scene: THREE.Group }
  const ready = useRef(false)
  const spin = useRef(-0.55)  // open showing the display + sensor head
  const drag = useRef({ down: false, x: 0, y: 0, yaw: 0, pitch: 0 })
  // Framing is computed, not eyeballed: the device is 0.823 m tall and the
  // vertical FOV governs, so the orbit radius must exceed h / (2 tan(fov/2)).
  const MODEL_H = 0.82
  const target = new THREE.Vector3(0, MODEL_H / 2, 0)
  let settle = 0

  useEffect(() => {
    model.traverse((o) => {
      const m = o as THREE.Mesh
      if (!m.isMesh) return
      m.castShadow = true
      m.receiveShadow = true
      // SketchUp exports panels double-sided; single side halves the fill cost.
      const mats = Array.isArray(m.material) ? m.material : [m.material]
      mats.forEach((x) => { if (x) (x as THREE.Material).side = THREE.FrontSide })
    })

    // The GLB is already correct: 0.317 x 0.823 x 0.292 m, tall axis on +Y,
    // base at y=0 (verified against the file's node transforms). Do not
    // "normalise" it - that is what previously laid it on its side.
    scene.add(model)
    ready.current = true
    onLoaded()
  }, [model, scene, onLoaded])

  useEffect(() => {
    if (!ready.current) return
    drag.current.yaw = 0
    drag.current.pitch = 0
  }, [resetKey])

  // Pointer drag on the canvas element itself (not window) so page scroll and
  // keyboard focus elsewhere keep working.
  useEffect(() => {
    const dom = document.querySelector<HTMLElement>('[data-device-canvas]')
    if (!dom) return
    const down = (e: PointerEvent) => {
      drag.current.down = true
      drag.current.x = e.clientX
      drag.current.y = e.clientY
    }
    const move = (e: PointerEvent) => {
      if (!drag.current.down) return
      drag.current.yaw += (e.clientX - drag.current.x) * 0.0075
      drag.current.pitch = THREE.MathUtils.clamp(
        drag.current.pitch + (e.clientY - drag.current.y) * 0.0045, -0.42, 0.5)
      drag.current.x = e.clientX
      drag.current.y = e.clientY
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

  useFrame((_, dt) => {
    if (!ready.current) return
    // brief settle: the camera eases out from further back on first paint,
    // so the product arrives rather than being simply there.
    if (settle < 1) settle = Math.min(1, settle + dt * 0.9)
    const ease = 1 - Math.pow(1 - settle, 3)
    if (autoSpin && !drag.current.down) spin.current += dt * 0.2
    const yaw = spin.current + drag.current.yaw
    const pitch = drag.current.pitch
    const r = 1.34 + (1 - ease) * 0.36   // the head is the only real volume; the column is 2mm thin by design
    camera.position.set(
      r * Math.sin(yaw) * Math.cos(pitch),
      target.y + 0.13 + r * Math.sin(pitch) * 0.9,
      r * Math.cos(yaw) * Math.cos(pitch),
    )
    camera.lookAt(target)
  })

  return null
}

function Hotspot({ h, open, onEnter, onLeave }: {
  h: (typeof HOTSPOTS)[number]; open: boolean; onEnter: () => void; onLeave: () => void
}) {
  return (
    <group position={h.at as unknown as THREE.Vector3Tuple}>
      <Html center zIndexRange={[20, 0]} style={{ pointerEvents: 'auto' }}>
        <button
          type="button"
          onMouseEnter={onEnter}
          onFocus={onEnter}
          onMouseLeave={onLeave}
          onBlur={onLeave}
          aria-label={h.label}
          className="group relative grid size-12 place-items-center"
          style={{ width: 48, height: 48, padding: 6 }}
        >
          <span
            className={`absolute size-[9px] rounded-full border transition-all duration-300 ${
              open ? 'border-accent bg-accent shadow-[0_0_16px_2px_#2563ebaa]' : 'border-ink-3 bg-card hover:border-accent'
            }`}
          />
          <span className={`absolute size-6 rounded-full border transition-all duration-300 ${
            open ? 'scale-100 border-accent/45 opacity-100' : 'scale-75 border-line opacity-0'
          }`} />
          <span className={`pointer-events-none absolute left-1/2 top-[calc(100%+2px)] w-max max-w-[190px] translate-x-[-50%] rounded-tight border border-line-hi bg-card px-2.5 py-2 text-left transition-all duration-200 ${
            open ? 'translate-y-0 opacity-100' : 'pointer-events-none -translate-y-1 opacity-0'
          }`}>
            <span className="block text-[0.6562rem] font-semibold tracking-[0.12em] text-accent uppercase">{h.label}</span>
            <span className="mt-1 block text-[0.6875rem] leading-snug text-ink-2">{h.copy}</span>
          </span>
        </button>
      </Html>
    </group>
  )
}

export default function DeviceScene(props: Props) {
  const [hover, setHover] = useState<HotspotId | null>(null)
  const activeId = props.active ?? hover

  return (
    <Canvas
      data-device-canvas
      dpr={[1, 1.75]}
      shadows
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      camera={{ fov: 30, near: 0.05, far: 40, position: [-0.88, 0.41, 1.43] }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping
        gl.toneMappingExposure = 0.9
      }}
    >
      <AdaptiveDpr pixelated />
      <ambientLight intensity={0.5} />
      <directionalLight
        position={[1.2, 1.9, 1.5]} intensity={2.2} color="#eaf2ff"
        castShadow shadow-mapSize={[1024, 1024]}
      />
      <directionalLight position={[-1.8, 1.1, -0.7]} intensity={0.55} color="#eaf2fc" />
      <pointLight position={[0.2, 0.5, 1.5]} intensity={0.7} color="#ffffff" />
      <Environment preset="studio" environmentIntensity={0.5} />
      <Rig {...props} />
      <ContactShadows
        position={[0, 0, 0]} opacity={0.62} scale={2.0} blur={1.6}
        far={0.95} resolution={512} color="#465e7a"
      />
      {HOTSPOTS.map((h) => (
        <Hotspot
          key={h.id} h={h} open={activeId === h.id}
          onEnter={() => setHover(h.id)}
          onLeave={() => setHover(null)}
        />
      ))}
    </Canvas>
  )
}

export function preloadModel() {
  useGLTF.preload('/moldguard.glb')
}
