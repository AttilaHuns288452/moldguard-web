import { useState } from 'react'
import { Bell, Droplets, Home, Settings2 } from 'lucide-react'
import { Reveal, SectionHead, DemoTag } from '../components/ui'

const SCREENS = [
  { id: 'room', label: 'Room', icon: Home },
  { id: 'history', label: 'History', icon: Droplets },
  { id: 'alerts', label: 'Alerts', icon: Bell },
  { id: 'control', label: 'Control', icon: Settings2 },
] as const

type ScreenId = (typeof SCREENS)[number]['id']

export default function AppShowcase() {
  const [screen, setScreen] = useState<ScreenId>('room')

  return (
    <section id="app" className="relative overflow-hidden py-24 md:py-32">
      <div
        className="pointer-events-none absolute inset-0" aria-hidden="true"
        style={{ background: 'radial-gradient(70% 55% at 12% 40%, #eaf2fc 0%, transparent 64%)' }}
      />
      <div className="shell relative">
        <div className="grid gap-14 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-start lg:gap-16">
          <div>
            <SectionHead
              index="05"
              label="The application"
              title={
                <>
                  The loop,
                  <br />
                  <span className="text-ink-3">in your pocket.</span>
                </>
              }
              lead="Live status, the readings behind it, history over 24 hours, 7 days, or 30 days, and the automation rule that is running right now. Step in with manual override from anywhere."
            />

            <div className="mt-8 flex flex-wrap gap-1.5">
              {SCREENS.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setScreen(s.id)}
                  aria-pressed={screen === s.id}
                  className={`inline-flex items-center gap-2 rounded-tight border px-3.5 py-2 text-[0.8125rem] transition-colors duration-200 ${
                    screen === s.id
                      ? 'border-accent-ink/60 bg-accent-ink/12 text-ink'
                      : 'border-line text-ink-3 hover:border-line-hi hover:text-ink-2'
                  }`}
                >
                  <s.icon className="size-3.5" strokeWidth={1.75} />
                  {s.label}
                </button>
              ))}
            </div>

            <p className="mt-6 max-w-lg text-[0.8125rem] leading-relaxed text-ink-3">
              A promotional demonstration of the companion app. Every value shown is illustrative
              &mdash; this page is not connected to a live device.
            </p>
          </div>

          {/* phone */}
          <Reveal delay={120} className="mx-auto lg:mx-0">
            <div className="relative">
              <div
                className="pointer-events-none absolute -inset-10 rounded-full opacity-70 blur-2xl"
                aria-hidden="true"
                style={{ background: 'radial-gradient(circle at 50% 45%, #d7e3f2 0%, transparent 66%)' }}
              />
              <div className="relative w-[304px] rounded-[34px] border border-line-hi bg-white p-2 shadow-[0_50px_90px_-40px_#000]">
                <div className="relative overflow-hidden rounded-[26px] border border-line/80 bg-[#eaf2fc]">
                  {/* notch + status */}
                  <div className="flex items-center justify-between px-4 pt-4 pb-2">
                    <span className="font-mono text-[0.5625rem] text-ink-3">9:41</span>
                    <span className="h-1 w-10 rounded-full bg-[#d7e3f2]" aria-hidden="true" />
                    <span className="font-mono text-[0.5625rem] text-ink-3">•••</span>
                  </div>

                  <div className="px-4 pb-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[0.6875rem] font-medium tracking-tight text-ink-2">MoldGuard</span>
                      <DemoTag>Demo</DemoTag>
                    </div>
                    <ScreenBody screen={screen} />
                  </div>

                  {/* tab bar */}
                  <div className="grid grid-cols-4 border-t border-line bg-white">
                    {SCREENS.map((s) => (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => setScreen(s.id)}
                        aria-label={s.label}
                        className={`flex flex-col items-center gap-1 py-2.5 text-[0.5rem] transition-colors ${
                          screen === s.id ? 'text-accent' : 'text-ink-3/70 hover:text-ink-3'
                        }`}
                      >
                        <s.icon className="size-3.5" strokeWidth={1.75} />
                        {s.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

function ScreenBody({ screen }: { screen: ScreenId }) {
  if (screen === 'room') {
    return (
      <div className="mt-3 space-y-2.5">
        <div className="rounded-lg border border-[#d7e3f2] bg-white p-3">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[0.5rem] tracking-[0.16em] text-[#5c7392] uppercase">Mold risk index</span>
            <span className="rounded-full bg-[#1d4ed8]/15 px-1.5 py-0.5 font-mono text-[0.5rem] text-[#1d4ed8]">ACT</span>
          </div>
          <div className="mt-1 flex items-end gap-2">
            <span className="font-mono text-[1.75rem] leading-none text-[#1d4ed8]">82</span>
            <span className="font-mono text-[0.5rem] text-[#5c7392]">/ 100</span>
          </div>
          <div className="mt-2 flex items-center gap-2">
            <div className="h-1 flex-1 overflow-hidden rounded-full bg-[#d7e3f2]">
              <div className="h-full rounded-full bg-[#1d4ed8]" style={{ width: '82%' }} />
            </div>
            <span className="measure text-[0.4375rem] text-[#5c7392]">82%</span>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-1.5">
          {[['Temp', '28.0 °C'], ['RH', '82 %'], ['VOC', 'Low']].map(([k, v]) => (
            <div key={k} className="rounded-md border border-[#d7e3f2] bg-white px-2 py-2">
              <p className="font-mono text-[0.4375rem] tracking-[0.12em] text-[#5c7392] uppercase">{k}</p>
              <p className="measure mt-0.5 text-[0.6875rem] text-[#15385e]">{v}</p>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-2 rounded-md border border-[#2563eb]/30 bg-[#2563eb]/[0.07] px-2.5 py-2">
          <Droplets className="size-3 shrink-0 text-[#2563eb]" strokeWidth={2} />
          <p className="text-[0.5625rem] leading-tight text-[#465e7a]">
            Dehumidifier <span className="text-[#2563eb]">running on auto</span>
          </p>
        </div>
      </div>
    )
  }
  if (screen === 'history') {
    const bars = [40, 46, 53, 61, 68, 74, 79, 72, 64, 58, 55, 52]
    return (
      <div className="mt-3">
        <div className="flex items-center justify-between">
          <span className="font-mono text-[0.5rem] tracking-[0.14em] text-[#5c7392] uppercase">Bedroom · 7 d</span>
          <span className="font-mono text-[0.5rem] text-[#2563eb]">RH</span>
        </div>
        <div className="mt-2 flex h-[86px] items-end gap-1 rounded-md border border-[#d7e3f2] bg-white p-2">
          {bars.map((b, i) => (
            <div key={i} className="flex-1 rounded-sm" style={{
              height: `${b}%`,
              background: b > 70 ? '#1d4ed8' : b > 55 ? '#465e7a' : '#2563eb',
            }} />
          ))}
        </div>
        <div className="mt-1.5 flex justify-between font-mono text-[0.4375rem] text-[#5c7392]">
          {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => <span key={i}>{d}</span>)}
        </div>
        <div className="mt-2 space-y-1.5">
          {[['Temperature', '28.0 °C'], ['Dew point margin', '−0.4 °C']].map(([k, v]) => (
            <div key={k} className="flex items-center justify-between rounded-md border border-[#d7e3f2] bg-white px-2 py-1.5">
              <span className="text-[0.5625rem] text-[#465e7a]">{k}</span>
              <span className="font-mono text-[0.5625rem] text-[#15385e]">{v}</span>
            </div>
          ))}
        </div>
      </div>
    )
  }
  if (screen === 'alerts') {
    return (
      <div className="mt-3 space-y-2">
        {[
          ['High risk detected', 'Master Bedroom sustained 80% RH at 30 °C for 4+ hours.', '#1d4ed8', '2 min'],
          ['Tank level', 'Extracted water is at 80% of the 1 L tank.', '#465e7a', '1 h'],
          ['Back to safe range', 'Closet returned below the threshold. Auto-off.', '#2563eb', '3 h'],
        ].map(([t, b, c, when]) => (
          <div key={t as string} className="rounded-md border border-[#d7e3f2] bg-white p-2.5">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-[0.5625rem] font-medium text-[#15385e]">
                <span className="size-1 rounded-full" style={{ background: c as string }} />
                {t}
              </span>
              <span className="font-mono text-[0.4375rem] text-[#5c7392]">{when}</span>
            </div>
            <p className="mt-1 text-[0.5rem] leading-snug text-[#5c7392]">{b}</p>
          </div>
        ))}
      </div>
    )
  }
  return (
    <div className="mt-3 space-y-2.5">
      <div className="rounded-md border border-[#d7e3f2] bg-white p-2.5">
        <p className="font-mono text-[0.4375rem] tracking-[0.14em] text-[#5c7392] uppercase">Automation</p>
        <p className="mt-1.5 text-[0.5625rem] leading-relaxed text-[#15385e]">
          When <span className="font-mono">Mold Risk Index</span> stays above{' '}
          <span className="font-mono text-[#465e7a]">75</span> &rarr; run the dehumidifier
        </p>
      </div>
      <div className="flex items-center justify-between rounded-md border border-[#d7e3f2] bg-white px-2.5 py-2">
        <span className="text-[0.5625rem] text-[#465e7a]">Automatic dehumidification</span>
        <span className="rounded-full bg-[#2563eb]/15 px-1.5 py-0.5 font-mono text-[0.4375rem] text-[#2563eb]">ON</span>
      </div>
      <div className="flex items-center justify-between rounded-md border border-[#d7e3f2] bg-white px-2.5 py-2">
        <span className="text-[0.5625rem] text-[#465e7a]">Manual override</span>
        <span className="rounded-full bg-[#d7e3f2] px-1.5 py-0.5 font-mono text-[0.4375rem] text-[#5c7392]">STANDBY</span>
      </div>
      <div className="flex items-center justify-between rounded-md border border-[#d7e3f2] bg-white px-2.5 py-2">
        <span className="text-[0.5625rem] text-[#465e7a]">Tank level</span>
        <span className="font-mono text-[0.5rem] text-[#465e7a]">80 %</span>
      </div>
    </div>
  )
}
