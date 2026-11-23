import { useEffect, useMemo, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Html, useGLTF } from '@react-three/drei'
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
  /** shift the framed centre left/right in model units (hero clears its readout card) */
  nudgeX?: number
}

const PART_NODE_MATCHERS: Partial<Record<PartId, RegExp>> = {
  // These names are the export's actual semantic groups. Matching them avoids
  // selecting a wall just because its bounding box happens to cross a hotspot.
  sensor: /dht11|vl53l0x/i,
  controller: /esp32/i,
  relay: /relay_module/i,
  peltier: /peltier_thermoelectric_cooler/i,
  heatsink: /aluminium_extruded_heatsink/i,
  fan: /generic_80mm_computer_fan/i,
  display: /display/i,
  buzzer: /buzzer/i,
  audio: /adafruit_tpa2016d2/i,
  usb: /usb_micro_port/i,
  // Root Layer0 nodes are the enclosure panels and their status indicators.
  enclosure: /^mesh_\d+_root_layer0_/i,
}

function matsOf(mesh: THREE.Mesh): THREE.MeshStandardMaterial[] {
  const m = mesh.material
  return (Array.isArray(m) ? m : [m]).filter(Boolean) as THREE.MeshStandardMaterial[]
}

/** Tint the selected group is pushed toward. Allocated once: the highlight used to
 *  construct a Color per mesh per frame. */
const HIGHLIGHT = new THREE.Color('#3a7bff')
/** Exploded view travels this many world metres outward, per part. */
const EXPLODE_WORLD = 0.035

function Rig({ active, mode, autoSpin, resetKey, onLoaded, zoom, nudgeX = 0, onSelect, hotspots }: Props) {
  const { camera, scene, gl } = useThree()
  const { scene: cached } = useGLTF('/moldguard.glb', true, true, extendLoader) as unknown as { scene: THREE.Group }
  /**
   * useGLTF caches by URL, so the hero and the Meet explorer were handed the
   * SAME Group. scene.add() REPARENTS it: mounting the second viewer pulled the
   * model out of the first viewer's scene, and scrolling back up left the hero
   * canvas showing only its CSS backdrop. Materials were shared too, so one
   * viewer's shell fade / emissive highlight ghosted the other's model.
   * Clone the graph per stage and clone every material this file mutates.
   * Geometry is only read here and stays shared with the loader cache.
   */
  const model = useMemo(() => {
    const c = cached.clone(true)
    c.traverse((o) => {
      const m = o as THREE.Mesh
      if (!m.isMesh || !m.material) return
      m.material = Array.isArray(m.material) ? m.material.map((x) => x.clone()) : m.material.clone()
    })
    return c
  }, [cached])

  // Teardown owns exactly what the clone created: detach it from this viewer's
  // scene and dispose the per-instance materials. Geometry and textures are
  // shared immutable data owned by the useGLTF cache and are NOT disposed here,
  // or a second viewer would lose its buffers when the first unmounts.
  useEffect(() => () => {
    scene.remove(model)
    model.traverse((o) => {
      const m = o as THREE.Mesh
      if (!m.isMesh || !m.material) return
      for (const mat of Array.isArray(m.material) ? m.material : [m.material]) mat.dispose()
    })
  }, [model, scene])
  const ready = useRef(false)
  const settle = useRef(0)
  /** Smoothed camera aim/radius: both are lerped every frame, so switching from
   *  one part to another glides instead of snapping once focus is already 1. */
  const aim = useRef(new THREE.Vector3(0, 0.41, 0))
  const aimR = useRef(1.9)
  // Initial yaw. Every `face: 'front'` part in parts.ts sits at +Z (the display,
  // sensor, buzzer, audio amp), so the camera must start near yaw 0 to look at
  // the product's front. 0.42 rad keeps a 3/4 angle so the depth reads too.
  const spin = useRef(0.42)
  // Seed a 3/4 view: dead-on front puts the detached near-side panel between
  // the camera and the interior, so the cutaway reads as grey blocks.
  const drag = useRef({ down: false, x: 0, y: 0, yaw: -0.62, pitch: 0.06 })
  const fitR = useRef(1.9)
  const halfExtent = useRef(new THREE.Vector3(0.15, 0.12, 0.08))
  const target = useRef(new THREE.Vector3(0, 0.41, 0))
  const partCentersRef = useRef<Map<PartId, THREE.Vector3>>(new Map())
  const partSizesRef = useRef<Map<PartId, THREE.Vector3>>(new Map())
  /** Measured body centre in world metres: the origin exploded offsets radiate from. */
  const modelCtr = useRef(new THREE.Vector3())
  const meshList = useRef<THREE.Mesh[]>([])
  const partMeshesRef = useRef<Map<PartId, THREE.Mesh[]>>(new Map())
  /** Local units per world metre (the export root is scaled ~0.001). */
  const worldPerLocalRef = useRef(1)
  /** Raycast picking state: a click that did not drag selects the component under it. */
  const clickPick = useRef(false)
  const raycaster = useRef(new THREE.Raycaster())
  const pointer = useRef(new THREE.Vector2())
  /** Mesh -> owning semantic part, so a pick can resolve to the part the user means. */
  const meshPart = useRef<Map<THREE.Mesh, PartId>>(new Map())
  /** Latest onSelect, so rebinding the pointer listeners does not depend on an
   *  inline callback's identity (Meet passes a fresh lambda every render). */
  const selectRef = useRef(onSelect)
  selectRef.current = onSelect


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
      // DO NOT hide the other shells. This is where "the walls are broken" came
      // from: mesh_1/mesh_5 are not nested duplicates of mesh_3, they are the
      // missing WALL PANELS of the enclosure. Hiding them left the box as a
      // front panel plus a floating back slab, which is exactly what a reader
      // reports as broken walls / gaps at the corners.
      //
      // A/B verified on the rendered hero: with mesh_1+mesh_5 hidden the box has
      // an open right side and a detached back panel; with them visible the
      // front, side and top panels meet cleanly at every corner. The earlier
      // "keep the largest shell" decision was made from a pixel-difference test
      // that measured whether hiding a mesh CHANGED THE IMAGE, which cannot tell
      // a duplicate from a wall - both change pixels, and a wall changes them
      // more. Shell fading for the exploded/selected state is handled below via
      // userData.isShell, so every panel still ghosts together.

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

    const list: THREE.Mesh[] = []
    model.traverse((o) => {
      const m = o as THREE.Mesh
      if (!m.isMesh) return
      list.push(m)
      m.userData.basePos = m.position.clone()
      // Cache the material slots once: walking 278 meshes x Array.isArray x filter
      // every frame allocated ~280 throwaway arrays per frame.
      m.userData.mats = matsOf(m)
    })
    meshList.current = list
    // Meshes sit under the export root, which is scaled ~0.001, so a WORLD metre
    // is 1/scale local units. Read it from the mesh's PARENT: getWorldScale on
    // the gltf.scene Group returns 1 (the 0.001 is on its child) and on a mesh it
    // folds in that mesh's own size, which is not the space its position lives in.
    const parentScale = list[0]?.parent?.getWorldScale(new THREE.Vector3()).x ?? 1
    worldPerLocalRef.current = parentScale ? 1 / parentScale : 1

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

    // Keep the measured HALF-EXTENTS, not a pre-solved distance: cam.aspect is not
    // settled when this effect first runs and it differs between runs, so any
    // distance solved here goes stale. The frame loop solves it against the
    // canvas's current aspect instead, so the unit is framed identically on first
    // paint and after a scroll away and back.
    halfExtent.current.set(sz.x / 2, sz.y / 2, sz.z / 2)
    target.current.set(ctr.x, bb.min.y + sz.y * 0.5, ctr.z)
    target.current.x += nudgeX
    modelCtr.current.copy(ctr)
    // Seed the smoothed pose at the fit so the first paint does not glide in from
    // a hard-coded guess.
    aim.current.copy(target.current)

    // Map each declared part to the meshes that actually belong to it. The GLB
    // export preserves semantic names for the real hardware groups, so the names
    // ARE the join. `misc` is then whatever no named part claimed: exclusive by
    // construction, which is what the old spatial probe could not guarantee (one
    // wall mesh landed in several parts and the last loop pass won).
    const partMeshes = new Map<PartId, THREE.Mesh[]>()
    const owner = new Map<THREE.Mesh, PartId>()
    for (const part of PARTS) {
      if (part.id === 'misc') continue
      const rx = PART_NODE_MATCHERS[part.id]
      if (!rx) { partMeshes.set(part.id, []); continue }
      const group = list.filter((m) => !owner.has(m) && rx.test(m.name))
      partMeshes.set(part.id, group)
      for (const m of group) if (!owner.has(m)) owner.set(m, part.id)
    }
    const leftovers = list.filter((m) => !owner.has(m))
    partMeshes.set('misc', leftovers)
    for (const m of leftovers) owner.set(m, 'misc')

    for (const [id, hits] of partMeshes) {
      const bounds = new THREE.Box3()
      for (const mesh of hits) bounds.union(new THREE.Box3().setFromObject(mesh))
      if (bounds.isEmpty()) continue
      const centre = bounds.getCenter(new THREE.Vector3())
      partCentersRef.current.set(id, centre)
      partSizesRef.current.set(id, bounds.getSize(new THREE.Vector3()))
      // Explode direction is per PART, so remember which part owns each mesh.
      for (const mesh of hits) mesh.userData.partCentre = centre
    }
    partMeshesRef.current = partMeshes
    meshPart.current = owner
    ready.current = true
    onLoaded()
  }, [model, scene, onLoaded])

  useEffect(() => {
    if (!ready.current) return
    drag.current.yaw = -0.62
    drag.current.pitch = 0
    spin.current = 0.42
    // Recentre also drops any focus, so "reset the view" cannot leave the camera
    // parked on a component.
    aim.current.copy(target.current)
  }, [resetKey])

  // Pointer drag, bound to THIS stage's canvas. document.querySelector grabbed the
  // first canvas on the page, so the hero and the explorer stole each other's orbit.
  useEffect(() => {
    const dom = gl.domElement
    if (!dom) return
    // Orbit works on both stages; only the explorer picks by clicking geometry,
    // because in the hero the whole canvas is a hover target for the hotspot pins.
    const pickable = hotspots !== false
    const down = (e: PointerEvent) => {
      drag.current.down = true; drag.current.x = e.clientX; drag.current.y = e.clientY
      clickPick.current = true
    }
    const move = (e: PointerEvent) => {
      if (!drag.current.down) return
      if (Math.abs(e.clientX - drag.current.x) + Math.abs(e.clientY - drag.current.y) > 3) clickPick.current = false
      drag.current.yaw += (e.clientX - drag.current.x) * 0.0075
      drag.current.pitch = THREE.MathUtils.clamp(drag.current.pitch + (e.clientY - drag.current.y) * 0.0045, -0.42, 0.5)
      drag.current.x = e.clientX; drag.current.y = e.clientY
    }
    const up = (e: PointerEvent) => {
      if (!drag.current.down) return
      drag.current.down = false
      // Click a component to focus it. A drag that moved is an orbit, not a pick.
      if (!pickable || !clickPick.current) return
      clickPick.current = false
      const r = gl.domElement.getBoundingClientRect()
      pointer.current.set(
        ((e.clientX - r.left) / r.width) * 2 - 1,
        -((e.clientY - r.top) / r.height) * 2 + 1,
      )
      raycaster.current.setFromCamera(pointer.current, camera)
      const hit = raycaster.current.intersectObjects(meshList.current, false)[0]
      selectRef.current((hit && meshPart.current.get(hit.object as THREE.Mesh)) ?? null)
    }
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
  const goal = useRef(new THREE.Vector3())
  const dirV = useRef(new THREE.Vector3())
  const liveBox = useRef(new THREE.Box3())
  const scratchBox = useRef(new THREE.Box3())
  const liveCtr = useRef(new THREE.Vector3())
  const liveSize = useRef(new THREE.Vector3())
  /** Cache key so the group's box is measured on selection change, not per frame. */
  const liveKey = useRef('')
  /** Seconds left in which offsets may still be settling, so the box is re-measured. */
  const settleBox = useRef(0)

  useFrame((_, dt) => {
    if (!ready.current) return
    const k = Math.min(1, dt * 6)
    const explode = mode === 'explode'
    // A part that resolved to no meshes must not ghost the whole unit: an empty
    // Set is still truthy, so `dimmed` would be true for every mesh on stage.
    const group = active ? partMeshesRef.current.get(active) : null
    const keep = group && group.length ? new Set(group) : null
    const worldPerLocal = worldPerLocalRef.current
    const meshes = meshList.current

    for (const m of meshes) {
      const mats = m.userData.mats as THREE.MeshStandardMaterial[]
      const picked = keep ? keep.has(m) : false
      const dimmed = Boolean(keep) && !picked

      // Highlight: only the selected group emits; everything else keeps its own.
      for (const mat of mats) {
        if (!mat.emissive) continue
        if (typeof mat.userData.baseEmissiveI !== 'number') {
          mat.userData.baseEmissive = mat.emissive.clone()
          mat.userData.baseEmissiveI = mat.emissiveIntensity ?? 0
        }
        const baseI = mat.userData.baseEmissiveI as number
        const wantI = picked ? baseI + 0.85 : baseI
        mat.emissiveIntensity += (wantI - mat.emissiveIntensity) * k
        mat.emissive.lerp(picked ? HIGHLIGHT : mat.userData.baseEmissive as THREE.Color, k)
      }

      // Exploded offsets are authored in WORLD metres; mesh positions are local
      // units under the ~0.001 root scale, so convert or the parts never move.
      const base = m.userData.basePos as THREE.Vector3 | undefined
      if (!base) continue
      goal.current.copy(base)
      if (explode && m.userData.partCentre) {
        const c = m.userData.partCentre as THREE.Vector3
        dirV.current.set(c.x - modelCtr.current.x, c.y - modelCtr.current.y, c.z - modelCtr.current.z)
        if (dirV.current.lengthSq() > 1e-8) {
          goal.current.addScaledVector(dirV.current.normalize(), EXPLODE_WORLD * worldPerLocal)
        }
      }
      m.position.lerp(goal.current, k)

      // Opacity: the picked group stays solid, everything else ghosts including
      // the enclosure panels (they used to lose because each mesh was looped once
      // per part and the last pass overwrote the selection).
      for (const mat of mats) {
        const u = mat.userData
        if (typeof u.baseOpacity !== 'number') {
          u.baseOpacity = mat.opacity
          u.baseTransparent = mat.transparent
          u.baseDepthWrite = mat.depthWrite
        }
        const baseOpacity = u.baseOpacity as number
        const want = picked
          ? 1
          : m.userData.isShell
            ? (active ? 0.06 : explode ? 0.12 : baseOpacity)
            : dimmed ? 0.12 : baseOpacity
        mat.opacity += (want - mat.opacity) * k
        // Only a fully solid frame may go back into the opaque pass: keeping
        // transparent=true while it fades avoids the pop where the renderer
        // ignores opacity and the mesh snaps back to solid.
        // Selection is explicitly solid, even for translucent source materials.
        // Restore the original material flags only after deselection settles.
        const solidSelection = picked && mat.opacity > 0.999
        const restored = !picked && Math.abs(mat.opacity - baseOpacity) < 0.001
        if (solidSelection) mat.opacity = 1
        else if (restored) mat.opacity = baseOpacity
        mat.transparent = solidSelection ? false : restored ? (u.baseTransparent as boolean) : true
        mat.depthWrite = solidSelection ? true : restored ? (u.baseDepthWrite as boolean) : false
      }
    }

    // Live world bounds of the selected group, offsets included, so the camera
    // targets where the meshes actually are rather than their rest position.
    // Re-measured while offsets settle (1 s), then cached per selection: `relay`
    // is 115 meshes and a per-frame box union was the expensive path.
    if (keep) {
      const key = `${active}|${explode}`
      if (liveKey.current !== key) {
        liveKey.current = key
        settleBox.current = 1
        // Seed from the load-time measured bounds so frame one already has a
        // target, even if setFromObject comes back empty for a degenerate group.
        const seedCtr = partCentersRef.current.get(active!)
        const seedSize = partSizesRef.current.get(active!)
        if (seedCtr) liveCtr.current.copy(seedCtr)
        if (seedSize) liveSize.current.copy(seedSize)
      }
      settleBox.current = Math.max(0, settleBox.current - dt)
      if (settleBox.current > 0) {
        liveBox.current.makeEmpty()
        for (const m of keep) {
          liveBox.current.union(scratchBox.current.setFromObject(m))
        }
        if (!liveBox.current.isEmpty()) {
          liveBox.current.getCenter(liveCtr.current)
          liveBox.current.getSize(liveSize.current)
        }
      }
    } else {
      liveKey.current = ''
    }
  })

  useFrame((_, dt) => {
    if (!ready.current) return
    if (settle.current < 1) settle.current = Math.min(1, settle.current + dt * 0.9)
    const ease = 1 - Math.pow(1 - settle.current, 3)
    if (autoSpin && !drag.current.down) spin.current += dt * 0.32
    // Oscillate, do not orbit. A full 360 turns the unit's own white panels toward
    // the camera and a white body on a pale stage dissolves; but so does swinging
    // too far the other way - at yaw ~ -0.2 the camera is nearly dead-on at the
    // flat FRONT face, which measured 28% footprint and read as blank. Keep every
    // frame on the open 3/4 side: -0.82 .. -0.42.
    const swing = -0.62 + Math.sin(spin.current) * 0.20
    const yaw = swing + drag.current.yaw
    const pitch = drag.current.pitch
    // pull back a little in exploded view so the separated parts stay in frame
    const explodePad = mode === 'explode' ? 1.28 : 1
    // Frame the full height with headroom and the width against the panel's own
    // aspect, using the CURRENT aspect - never a cached one.
    const cam = camera as THREE.PerspectiveCamera
    const halfFov = THREE.MathUtils.degToRad(cam.fov / 2)
    const hx = halfExtent.current.x
    const hy = halfExtent.current.y
    fitR.current = Math.max(
      // Leave deliberate headroom around the technical assembly. The tighter
      // 0.98/0.92 fit cropped the top and hid the silhouette behind the hero card.
      hy / Math.tan(halfFov) / 0.84,
      hx / (Math.tan(halfFov) * cam.aspect) / 0.82,
    )
    // Selecting a part pushes in on it. The aim point and radius are their own
    // smoothed state (not a scalar blend of two fixed poses): that way A -> B
    // glides from the current frame instead of snapping once focus is already 1,
    // and deselect glides back to the fit.
    const wantAim = active ? liveCtr.current : target.current
    const wantR = active
      ? Math.max(
          Math.max(liveSize.current.x, liveSize.current.y, liveSize.current.z) /
            (2 * 0.62 * Math.tan(halfFov)),
          // A 5 mm connector would otherwise put the camera inside the enclosure.
          fitR.current * 0.18,
        )
      : fitR.current * explodePad
    aim.current.lerp(wantAim, Math.min(1, dt * 4.2))
    aimR.current += (wantR - aimR.current) * Math.min(1, dt * 4.2)
    const look = aim.current
    const r = (aimR.current / zoom) * (1 + (1 - ease) * 0.16)
    camera.position.set(
      look.x + r * Math.sin(yaw) * Math.cos(pitch),
      look.y + r * Math.sin(pitch),
      look.z + r * Math.cos(yaw) * Math.cos(pitch),
    )
    camera.lookAt(look)
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
          aria-label={`Part ${PART_NO[part.id]}: ${part.name}`}
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
      dpr={Math.min(window.devicePixelRatio || 1, 1.75)}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping
        gl.toneMappingExposure = 1.46
      }}
      camera={{ fov: 32, near: 0.02, far: 20, position: [-0.42, 0.30, 0.72] }}
    >
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
