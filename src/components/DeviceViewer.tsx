import { Suspense, lazy, useEffect, useRef, useState } from 'react'
import { RotateCcw, RefreshCw, Maximize2, ZoomIn, ZoomOut } from 'lucide-react'
import type { PartId } from './parts'

const Scene = lazy(() => import('./DeviceScene'))

type Props = {
  active: PartId | null
  onSelect: (id: PartId | null) => void
  autoSpin: boolean
  mode: 'tour' | 'explode'
}

/** 3D stage: lazy WebGL, real zoom, selection, graceful fallback. */
export default function DeviceViewer({ active, onSelect, autoSpin, mode }: Props) {
  const hostRef = useRef<HTMLDivElement>(null)
  const [mounted, setMounted] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const [failed, setFailed] = useState(false)
  const [resetKey, setResetKey] = useState(0)
  const [zoom, setZoom] = useState(1)
  const [hovering, setHovering] = useState(false)

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

  // Wheel + pinch zoom on the stage (the button labels used to promise this).
  useEffect(() => {
    const el = hostRef.current
    if (!el) return
    const clamp = (z: number) => Math.min(2.4, Math.max(0.55, z))
    const onWheel = (e: WheelEvent) => {
      if (!e.ctrlKey && Math.abs(e.deltaY) < 2) return
      e.preventDefault()
      setZoom((z) => clamp(z - e.deltaY * 0.0016))
    }
    let pinchStart: number | null = null
    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 2) pinchStart = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY)
    }
    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length !== 2 || pinchStart === null) return
      const d = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY)
      setZoom((z) => clamp(z * (d / pinchStart!)))
      pinchStart = d
    }
    el.addEventListener('wheel', onWheel, { passive: false })
    el.addEventListener('touchstart', onTouchStart, { passive: true })
    el.addEventListener('touchmove', onTouchMove, { passive: true })
    return () => {
      el.removeEventListener('wheel', onWheel)
      el.removeEventListener('touchstart', onTouchStart)
      el.removeEventListener('touchmove', onTouchMove)
    }
  }, [])

  return (
    <div className="relative h-full w-full">
      <div
        ref={hostRef}
        className="relative h-full w-full touch-none"
        role="application"
        aria-label="Interactive 3D model of the MoldGuard assembly. Drag to orbit, scroll to zoom, and select a component to read about it."
      >
        {mounted && !failed ? (
          <Suspense fallback={null}>
            <Scene
              active={active}
              onSelect={onSelect}
              mode={mode}
              autoSpin={autoSpin && !hovering}
              resetKey={resetKey}
              zoom={zoom}
              onLoaded={() => setLoaded(true)}
              onHoverHotspot={() => setHovering(true)}
            />
          </Suspense>
        ) : null}

        {!loaded && !failed && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
            <div className="device-silhouette h-[46%] w-[16%] min-h-[150px] min-w-[44px] rounded-[6px] border border-line-hi/70 bg-gradient-to-b from-white to-[#efece7]" />
            <span className="text-[0.6875rem] font-semibold tracking-[0.14em] text-ink-3 uppercase">Loading model</span>
          </div>
        )}

        {failed && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 px-6 text-center">
            <div className="device-silhouette h-[46%] w-[16%] min-h-[150px] min-w-[44px] rounded-[6px] border border-line-hi/70 bg-gradient-to-b from-white to-[#efece7]" />
            <p className="max-w-xs text-[0.8125rem] leading-relaxed text-ink-3">
              3D unavailable on this device. Every component is listed beside the model.
            </p>
          </div>
        )}
      </div>

      {!failed && (
        <div className="pointer-events-auto absolute inset-x-0 bottom-0 flex items-center justify-between px-2 pb-1">
          <span className="text-[11px] text-ink-3">Drag to orbit · scroll to zoom</span>
          <div className="flex items-center gap-0.5">
            <button type="button" onClick={() => setZoom((z) => Math.min(2.4, z + 0.18))}
              className="grid size-8 place-items-center rounded-full text-ink-3 transition-colors hover:bg-line/60 hover:text-ink"
              aria-label="Zoom in">
              <ZoomIn className="size-4" strokeWidth={1.9} />
            </button>
            <button type="button" onClick={() => setZoom((z) => Math.max(0.55, z - 0.18))}
              className="grid size-8 place-items-center rounded-full text-ink-3 transition-colors hover:bg-line/60 hover:text-ink"
              aria-label="Zoom out">
              <ZoomOut className="size-4" strokeWidth={1.9} />
            </button>
            <button type="button" onClick={() => { setZoom(1); setResetKey((k) => k + 1) }}
              className="grid size-8 place-items-center rounded-full text-ink-3 transition-colors hover:bg-line/60 hover:text-ink"
              aria-label="Reset the view">
              <RotateCcw className="size-3.5" strokeWidth={1.9} />
            </button>
            <button type="button" onClick={() => setResetKey((k) => k + 1)}
              className="grid size-8 place-items-center rounded-full text-ink-3 transition-colors hover:bg-line/60 hover:text-ink md:hidden"
              aria-label="Recentre">
              <RefreshCw className="size-3.5" strokeWidth={1.9} />
            </button>
            <button type="button"
              onClick={() => hostRef.current?.parentElement?.requestFullscreen?.().catch(() => {})}
              className="hidden size-8 place-items-center rounded-full text-ink-3 transition-colors hover:bg-line/60 hover:text-ink md:grid"
              aria-label="View the model fullscreen">
              <Maximize2 className="size-3.5" strokeWidth={1.9} />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
