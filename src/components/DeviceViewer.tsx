import { Suspense, lazy, useEffect, useRef, useState } from 'react'
import { RotateCcw, Maximize2 } from 'lucide-react'
import { prefersReducedMotion } from '../lib/motion'

/* Lazy: the whole three.js stack only downloads once the hero is actually in
   view and the visitor has not asked for reduced motion. */
const Scene = lazy(() => import('./DeviceScene'))

export type HotspotId = 'display' | 'sensors' | 'tof' | 'dry' | 'power'

type Props = { onHotspot: (id: HotspotId | null) => void; active: HotspotId | null }

export default function DeviceViewer({ onHotspot, active }: Props) {
  const hostRef = useRef<HTMLDivElement>(null)
  const [mounted, setMounted] = useState(false)      // three has been asked for
  const [loaded, setLoaded] = useState(false)        // glb parsed
  const [failed, setFailed] = useState(false)        // no webgl / glb error
  const [resetKey, setResetKey] = useState(0)
  const [autoSpin, setAutoSpin] = useState(!prefersReducedMotion())

  // Pull three.js down only when the hero is in view AND the page has already
  // painted. Loading the 3D scene eagerly competes with LCP for the same
  // bandwidth and main thread, so it waits for idle after first paint.
  useEffect(() => {
    const el = hostRef.current
    if (!el) return
    let armed = false
    const mount = () => { if (armed) setMounted(true) }
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return
        io.disconnect()
        armed = true
        // wait for the first paint / next idle window
        if ('requestIdleCallback' in window) {
          ;(window as unknown as { requestIdleCallback: (cb: () => void, o?: { timeout: number }) => void })
            .requestIdleCallback(mount, { timeout: 1200 })
        } else {
          setTimeout(mount, 300)
        }
      },
      { rootMargin: '0px' },   // load only when the viewer is actually close
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  // WebGL availability gate — never mount a canvas that cannot render.
  const webglOk = useRef(true)
  useEffect(() => {
    try {
      const c = document.createElement('canvas')
      const gl = c.getContext('webgl2') ?? c.getContext('webgl')
      webglOk.current = !!gl
    } catch { webglOk.current = false }
    if (!webglOk.current) setFailed(true)
  }, [])

  return (
    <div className="relative h-full w-full">
      <div
        ref={hostRef}
        className="relative h-full w-full touch-none"
        aria-label="Interactive 3D model of the MoldGuard device. Drag to rotate, scroll to zoom."
        role="img"
      >
        {mounted && !failed ? (
          <Suspense fallback={null}>
            <Scene
              resetKey={resetKey}
              autoSpin={autoSpin}
              active={active}
              onHotspot={onHotspot}
              onLoaded={() => setLoaded(true)}
              onError={() => setFailed(true)}
            />
          </Suspense>
        ) : null}

        {/* Static fallback: shown until the model is parsed, or if WebGL is absent. */}
        {!loaded && !failed && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
              <div className="device-silhouette relative h-[62%] w-[19%] min-h-[170px] min-w-[54px] rounded-[6px] border border-line-hi bg-gradient-to-b from-[#c9d8ea] to-[#94a9c4]">
                <span className="absolute inset-x-[16%] top-[6%] h-[10%] rounded-[2px] bg-accent/12" />
                <span className="absolute inset-x-[30%] bottom-[10%] h-px bg-line-hi" />
              </div>
              <span className="text-[0.6562rem] font-semibold tracking-[0.12em] text-ink-3 uppercase">
                Loading model
              </span>
            </div>
          </div>
        )}

        {failed && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-5 px-6 text-center">
            <div className="device-silhouette h-[62%] w-[19%] min-h-[170px] min-w-[56px] rounded-[6px] border border-line-hi bg-gradient-to-b from-[#c9d8ea] to-[#94a9c4]" />
            <p className="max-w-xs text-[0.8125rem] leading-relaxed text-ink-3">
              3D view unavailable on this device. Everything below describes the same hardware.
            </p>
          </div>
        )}
      </div>

      {/* Controls */}
      {!failed && (
        <div className="pointer-events-auto absolute inset-x-0 bottom-0 flex items-center justify-between gap-3 px-4 pb-1">
          <span className="text-[0.6562rem] font-semibold tracking-[0.12em] text-ink-3 uppercase">
            Drag to rotate
          </span>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setAutoSpin((v) => !v)}
              aria-pressed={autoSpin}
              className="rounded-tight border border-line-hi bg-card px-2.5 py-1.5 text-[0.6562rem] font-semibold tracking-[0.12em] text-ink-3 uppercase transition-colors hover:border-line-hi hover:text-ink-2"
            >
              {autoSpin ? 'Spin on' : 'Spin off'}
            </button>
            <button
              type="button"
              onClick={() => setResetKey((k) => k + 1)}
              className="grid size-7 place-items-center rounded-full border border-line bg-card/90 text-ink-3 transition-colors hover:border-line-hi hover:text-ink-2"
              aria-label="Reset camera"
            >
              <RotateCcw className="size-3.5" strokeWidth={1.75} />
            </button>
            <button
              type="button"
              onClick={() => {
                hostRef.current?.parentElement?.requestFullscreen?.().catch(() => {})
              }}
              className="hidden rounded-full border border-line bg-card/90 p-1.5 text-ink-3 transition-colors hover:border-line-hi hover:text-ink-2 md:block"
              aria-label="View model fullscreen"
            >
              <Maximize2 className="size-3.5" strokeWidth={1.75} />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
