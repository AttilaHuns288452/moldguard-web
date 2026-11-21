import { Component, Suspense, lazy, useCallback, useEffect, useRef, useState, type ReactNode } from 'react'
import { RotateCcw, RefreshCw, Maximize2, ZoomIn, ZoomOut } from 'lucide-react'
import type { PartId } from './parts'

const Scene = lazy(() => import('./DeviceScene'))

/**
 * Without this, a rejected GLB fetch (offline demo, CDN blip, 404, blocked Draco
 * decoder) propagates through Suspense and React unmounts the WHOLE page — the
 * hero, the copy, every section. Verified: blocking /moldguard.glb left
 * document.body with zero text. One boundary turns a dead site into a missing
 * 3D stage.
 */
class SceneBoundary extends Component<{ children: ReactNode; onError: () => void }, { failed: boolean }> {
  state = { failed: false }
  static getDerivedStateFromError() { return { failed: true } }
  componentDidCatch() { this.props.onError() }
  render() { return this.state.failed ? null : this.props.children }
}

type Props = {
  /** hero mode hides the viewer chrome so the product is the only thing on show */
  chrome?: boolean
  /** show the interactive component dots (explorer) - off in the hero */
  hotspots?: boolean
  active: PartId | null
  onSelect: (id: PartId | null) => void
  autoSpin: boolean
  mode: 'tour' | 'explode'
  /** shift the framed centre in model units so the hero clears its readout card */
  nudgeX?: number
}

/** 3D stage: lazy WebGL, real zoom, selection, graceful fallback. */
export default function DeviceViewer({ active, onSelect, autoSpin, mode, chrome = true, hotspots = true, nudgeX }: Props) {
  const hostRef = useRef<HTMLDivElement>(null)
  const [mounted, setMounted] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const [failed, setFailed] = useState(false)
  const [resetKey, setResetKey] = useState(0)
  const [zoom, setZoom] = useState(1)
  const [hovering, setHovering] = useState(false)
  const [armed, setArmed] = useState(false)
  // DeviceScene's setup effect depends on these, so an inline arrow re-ran the
  // whole GLB import + material build on every zoom step and hover. Stable
  // identities keep setup to once per model.
  const handleLoaded = useCallback(() => setLoaded(true), [])
  const handleHover = useCallback(() => setHovering(true), [])

  useEffect(() => {
    const el = hostRef.current
    if (!el) return
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return
        io.disconnect()
        if ('requestIdleCallback' in window) {
          (window as unknown as { requestIdleCallback: (cb: () => void, o?: { timeout: number }) => void })
            .requestIdleCallback(() => setMounted(true), { timeout: 1200 })
        } else setTimeout(() => setMounted(true), 300)
      },
      { rootMargin: '0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    try {
      const c = document.createElement('canvas')
      if (!(c.getContext('webgl2') ?? c.getContext('webgl'))) setFailed(true)
    } catch { setFailed(true) }
  }, [])

  useEffect(() => {
    if (!hovering) return
    const t = setTimeout(() => setHovering(false), 1400)
    return () => clearTimeout(t)
  }, [hovering])

  // Zoom. Clicking the stage "arms" it first so the page scroll is never
  // hijacked: before activation the wheel is ignored entirely and a two-finger
  // gesture does not swallow vertical panning. Escape or a click outside disarms.
  useEffect(() => {
    const el = hostRef.current
    if (!el) return
    const clamp = (z: number) => Math.min(2.4, Math.max(0.55, z))
    const onWheel = (e: WheelEvent) => {
      if (!armed) return
      if (!e.ctrlKey && Math.abs(e.deltaY) < 2) return
      e.preventDefault()
      setZoom((z) => clamp(z - e.deltaY * 0.0016))
    }
    let pinchStart: number | null = null
    const onTouchStart = (e: TouchEvent) => {
      if (!armed || e.touches.length !== 2) return
      pinchStart = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY)
    }
    const onTouchMove = (e: TouchEvent) => {
      if (!armed || e.touches.length !== 2 || pinchStart === null) return
      const d = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY)
      setZoom((z) => clamp(z * (d / pinchStart!)))
      pinchStart = d
    }
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setArmed(false) }
    const onDocDown = (e: PointerEvent) => {
      if (armed && !el.contains(e.target as Node)) setArmed(false)
    }
    el.addEventListener('wheel', onWheel, { passive: false })
    el.addEventListener('touchstart', onTouchStart, { passive: true })
    el.addEventListener('touchmove', onTouchMove, { passive: true })
    window.addEventListener('keydown', onKey)
    document.addEventListener('pointerdown', onDocDown)
    return () => {
      el.removeEventListener('wheel', onWheel)
      el.removeEventListener('touchstart', onTouchStart)
      el.removeEventListener('touchmove', onTouchMove)
      window.removeEventListener('keydown', onKey)
      document.removeEventListener('pointerdown', onDocDown)
    }
  }, [])

  return (
    <div className="relative h-full w-full">
      <div
        ref={hostRef}
        data-model-loaded={loaded ? 'true' : 'false'}
        className={`relative h-full w-full ${armed ? 'touch-none' : 'touch-pan-y'}`}
        onClick={() => { if (!armed) setArmed(true) }}
        role="application"
        aria-label="Interactive 3D model of the MoldGuard assembly. Drag to orbit, scroll to zoom, and select a component to read about it."
      >
        {mounted && !failed ? (
          <SceneBoundary onError={() => setFailed(true)}>
          <Suspense fallback={null}>
            <Scene
              active={active}
              onSelect={onSelect}
              mode={mode}
              autoSpin={autoSpin && !hovering}
              resetKey={resetKey}
              zoom={zoom}
              onLoaded={handleLoaded}
              onHoverHotspot={handleHover}
              hotspots={hotspots}
              nudgeX={nudgeX}
            />
          </Suspense>
          </SceneBoundary>
        ) : null}

        {!loaded && !failed && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
            <div className="device-silhouette h-[46%] w-[16%] min-h-[150px] min-w-[44px] rounded-tight border border-line-hi/70 bg-gradient-to-b from-white to-[#efece7]" />
            <span className="text-[0.6875rem] font-semibold tracking-[0.14em] text-ink-3 uppercase">Loading model</span>
          </div>
        )}

        {failed && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 px-6 text-center">
            <div className="device-silhouette h-[46%] w-[16%] min-h-[150px] min-w-[44px] rounded-tight border border-line-hi/70 bg-gradient-to-b from-white to-[#efece7]" />
            <p className="max-w-xs text-[0.8125rem] leading-relaxed text-ink-3">
              3D unavailable on this device. Every component is listed beside the model.
            </p>
          </div>
        )}
      </div>

      {/* the activation hint is not chrome: without it the stage looks static */}
      {!failed && chrome && loaded && !armed && (
        <div className="pointer-events-none absolute inset-x-0 bottom-3 flex justify-center">
          <span className="rounded-full border border-line bg-card/90 px-3 py-1 text-[11px] text-ink-2 shadow-sm">
            Click to interact
          </span>
        </div>
      )}

      {!failed && chrome && (
        <div className="pointer-events-auto absolute inset-x-0 bottom-0 flex items-center justify-between px-2 pb-1">
          <span className="text-[11px] text-ink-3">
            {armed ? 'Drag to orbit · scroll to zoom · Esc to release' : loaded ? 'Click to interact' : 'Loading model'}
          </span>
          <div className="flex items-center gap-0.5">
            <button type="button" onClick={() => setZoom((z) => Math.min(2.4, z + 0.18))}
              className="grid size-10 place-items-center rounded-full border border-line bg-card/80 text-ink-2 shadow-sm transition-colors hover:bg-card hover:text-ink"
              aria-label="Zoom in">
              <ZoomIn className="size-4" strokeWidth={1.9} />
            </button>
            <button type="button" onClick={() => setZoom((z) => Math.max(0.55, z - 0.18))}
              className="grid size-10 place-items-center rounded-full border border-line bg-card/80 text-ink-2 shadow-sm transition-colors hover:bg-card hover:text-ink"
              aria-label="Zoom out">
              <ZoomOut className="size-4" strokeWidth={1.9} />
            </button>
            <button type="button" onClick={() => { setZoom(1); setResetKey((k) => k + 1) }}
              className="grid size-10 place-items-center rounded-full border border-line bg-card/80 text-ink-2 shadow-sm transition-colors hover:bg-card hover:text-ink"
              aria-label="Reset the view">
              <RotateCcw className="size-3.5" strokeWidth={1.9} />
            </button>
            <button type="button" onClick={() => setResetKey((k) => k + 1)}
              className="grid size-10 place-items-center rounded-full text-ink-3 transition-colors hover:bg-line/60 hover:text-ink md:hidden"
              aria-label="Recentre">
              <RefreshCw className="size-3.5" strokeWidth={1.9} />
            </button>
            <button type="button"
              onClick={() => hostRef.current?.parentElement?.requestFullscreen?.().catch(() => {})}
              className="hidden size-10 place-items-center rounded-full text-ink-3 transition-colors hover:bg-line/60 hover:text-ink md:grid"
              aria-label="View the model fullscreen">
              <Maximize2 className="size-3.5" strokeWidth={1.9} />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
