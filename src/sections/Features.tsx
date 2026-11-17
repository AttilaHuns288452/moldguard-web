import { FEATURES, COMPARISON } from '../content'
import { Activity, Bell, Droplets, Gauge, Layers, SlidersHorizontal, Check, Minus } from 'lucide-react'
import { Reveal, SectionHead, Rule } from '../components/ui'

const ICONS: Record<string, typeof Gauge> = {
  engine: Gauge, sensors: Activity, auto: Droplets,
  analytics: Layers, alerts: Bell, automations: SlidersHorizontal,
}

/* Deliberately varied layouts: one flagship, one wide split, then an even
   pair, then a rule-separated list. Six identical cards was the thing to avoid. */
export default function Features() {
  const [engine, sensors, auto, analytics, alerts, automations] = FEATURES

  return (
    <section id="features" className="relative py-24 md:py-32">
      <div className="shell">
        <SectionHead
          index="04"
          label="Capabilities"
          max="max-w-3xl"
          title={
            <>
              Six capabilities.
              <br />
              <span className="text-ink-3">One loop.</span>
            </>
          }
          lead="Each one exists so you never have to think about mold again."
        />

        {/* ── flagship ── */}
        <Reveal delay={80}>
          <article className="panel-raised mt-10 overflow-hidden">
            <div className="grid gap-8 p-7 md:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)] md:items-center md:p-10">
              <div>
                <span className="inline-flex items-center gap-2 text-[0.6562rem] font-semibold tracking-[0.12em] text-accent uppercase">
                  <Gauge className="size-3.5" strokeWidth={1.75} />
                  01 &middot; core
                </span>
                <h3 className="mt-4 text-[clamp(1.5rem,3vw,2.125rem)] font-medium tracking-tight text-ink">
                  {engine.title}
                </h3>
                <p className="mt-4 text-[1rem] leading-relaxed text-ink-2">{engine.lead}</p>
              </div>
              {/* index anatomy: the four inputs stacked into one score */}
              <div className="rounded-soft border border-line bg-card p-5">
                <div className="space-y-2.5">
                  {[
                    ['Humidity', '78 %RH', 78],
                    ['Temperature', '30 °C', 52],
                    ['Sustained exposure', '26 h', 66],
                    ['Dew-point margin', '0.4 °C', 34],
                  ].map(([label, v, bar]) => (
                    <div key={label as string}>
                      <div className="flex items-center justify-between">
                        <span className="text-[0.6562rem] font-semibold tracking-[0.12em] text-ink-3 uppercase">{label}</span>
                        <span className="measure text-[0.6875rem] text-ink-2">{v}</span>
                      </div>
                      <div className="mt-1 h-px w-full bg-line">
                        <div
                          className="h-px bg-gradient-to-r from-accent-ink to-accent transition-[width] duration-1000"
                          style={{ width: `${bar as number}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 flex items-baseline justify-between border-t border-line pt-3.5">
                  <span className="text-[0.6562rem] font-semibold tracking-[0.12em] text-ink-3 uppercase">Index</span>
                  <span className="measure text-[1.375rem] text-accent-ink">82<span className="ml-1 text-[0.6875rem] text-ink-3">/100</span></span>
                </div>
              </div>
            </div>
          </article>
        </Reveal>

        {/* ── sensors: wide split with the VOC caveat given real weight ── */}
        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <Reveal delay={60}>
            <article className="panel flex h-full flex-col p-7 md:p-8">
              <span className="inline-flex items-center gap-2 text-[0.6562rem] font-semibold tracking-[0.12em] text-ink-3 uppercase">
                <Activity className="size-3.5" strokeWidth={1.75} /> 02
              </span>
              <h3 className="mt-3.5 text-[1.25rem] font-medium tracking-tight text-ink">{sensors.title}</h3>
              <p className="mt-3 text-[0.9375rem] leading-relaxed text-ink-2">{sensors.lead}</p>
              <div className="mt-6 grid grid-cols-3 gap-px overflow-hidden rounded-tight border border-line bg-line">
                {[['Temp', '28.0 °C'], ['Humidity', '55 %RH'], ['VOC', 'Normal']].map(([k, v]) => (
                  <div key={k} className="bg-card px-3 py-3">
                    <p className="text-[0.6562rem] font-semibold tracking-[0.12em] text-ink-3 uppercase">{k}</p>
                    <p className="mt-1 font-mono text-[0.8125rem] text-ink">{v}</p>
                  </div>
                ))}
              </div>
              <p className="mt-4 border-l border-ink-3/40 pl-4 text-[0.8125rem] leading-relaxed text-ink-3">
                <span className="text-ink-3">VOC is context, never a verdict.</span> {sensors.note}
              </p>
            </article>
          </Reveal>

          <Reveal delay={130}>
            <article className="panel flex h-full flex-col p-7 md:p-8">
              <span className="inline-flex items-center gap-2 text-[0.6562rem] font-semibold tracking-[0.12em] text-ink-3 uppercase">
                <Droplets className="size-3.5" strokeWidth={1.75} /> 03
              </span>
              <h3 className="mt-3.5 text-[1.25rem] font-medium tracking-tight text-ink">{auto.title}</h3>
              <p className="mt-3 text-[0.9375rem] leading-relaxed text-ink-2">{auto.lead}</p>
              <ol className="mt-6 space-y-3">
                {[
                  ['76 %RH held', 'Watch'],
                  ['Threshold crossed', 'Decision made'],
                  ['Moisture pulled down', 'Running on auto'],
                ].map(([a, b]) => (
                  <li key={a} className="flex items-center gap-3">
                    <span className="font-mono text-[0.6875rem] text-ink-3">{a}</span>
                    <span className="h-px flex-1 bg-line" aria-hidden="true" />
                    <span className="text-[0.6562rem] font-semibold tracking-[0.12em] text-accent uppercase">{b}</span>
                  </li>
                ))}
              </ol>
            </article>
          </Reveal>
        </div>

        {/* ── analytics + alerts side by side, tighter ── */}
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          {[analytics, alerts].map((f, i) => {
            const Icon = ICONS[f.id]
            return (
              <Reveal key={f.id} delay={i * 60}>
                <article className="panel h-full p-6 md:p-7">
                  <span className="inline-flex items-center gap-2 text-[0.6562rem] font-semibold tracking-[0.12em] text-ink-3 uppercase">
                    <Icon className="size-3.5" strokeWidth={1.75} /> 0{i + 4}
                  </span>
                  <h3 className="mt-3 text-[1.0625rem] font-medium tracking-tight text-ink">{f.title}</h3>
                  <p className="mt-2.5 text-[0.875rem] leading-relaxed text-ink-2">{f.lead}</p>
                </article>
              </Reveal>
            )
          })}
        </div>

        {/* ── automations: full-width list row ── */}
        <Reveal delay={60}>
          <article className="panel mt-6 flex flex-col gap-5 p-6 md:flex-row md:items-center md:gap-10 md:p-8">
            <div className="md:w-[38%]">
              <span className="inline-flex items-center gap-2 text-[0.6562rem] font-semibold tracking-[0.12em] text-ink-3 uppercase">
                <SlidersHorizontal className="size-3.5" strokeWidth={1.75} /> 06
              </span>
              <h3 className="mt-3 text-[1.0625rem] font-medium tracking-tight text-ink">{automations.title}</h3>
              <p className="mt-2.5 text-[0.875rem] leading-relaxed text-ink-2">{automations.lead}</p>
            </div>
            <div className="flex-1 rounded-soft border border-line-hi bg-card px-5 py-4">
              <p className="text-[0.6562rem] font-semibold tracking-[0.12em] text-ink-3 uppercase">Automation</p>
              <p className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-[0.9375rem] text-ink-2">
                When <span className="font-mono text-ink">Mold Risk Index</span> stays above
                <span className="font-mono text-ink-3">75</span>
                <span className="text-ink-3">&rarr;</span>
                Run the dehumidifier
              </p>
              <p className="mt-2 text-[0.75rem] text-ink-3">Runs automatically. You can override any time from the app.</p>
            </div>
          </article>
        </Reveal>

        {/* ── comparison ── */}
        <Rule className="mt-20" />
        <Reveal>
          <div className="mt-10 flex flex-wrap items-end justify-between gap-6">
            <h3 className="text-[clamp(1.375rem,2.6vw,1.875rem)] font-medium tracking-tight text-ink">
              How it compares
            </h3>
            <p className="max-w-md text-[0.875rem] leading-relaxed text-ink-3">
              Existing options were built for general comfort or simple humidity control, not
              mold-specific risk modeling.
            </p>
          </div>
        </Reveal>

        <Reveal delay={90}>
          <div className="mt-7 overflow-x-auto">
            <table className="w-full min-w-[720px] border-collapse text-left">
              <caption className="sr-only">Comparison of moisture-control options</caption>
              <thead>
                <tr className="border-b border-line-hi">
                  {['Option', 'What it does', 'Cost model', 'Drawbacks'].map((h) => (
                    <th key={h} scope="col" className="pb-3 pr-6 text-[0.6562rem] font-semibold tracking-[0.12em] text-ink-3 uppercase">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {COMPARISON.map((r) => (
                  <tr key={r.option} className={`border-b border-line align-top ${r.ours ? 'bg-accent-ink/[0.055]' : ''}`}>
                    <th scope="row" className="py-5 pr-6">
                      <span className={`flex items-start gap-2 text-[0.9375rem] ${r.ours ? 'text-ink' : 'text-ink-2'}`}>
                        {r.ours
                          ? <Check className="mt-0.5 size-3.5 shrink-0 text-accent" strokeWidth={2.5} />
                          : <Minus className="mt-0.5 size-3.5 shrink-0 text-ink-3/60" strokeWidth={2} />}
                        {r.option}
                      </span>
                      {r.ours && (
                        <span className="mt-1.5 block text-[0.6562rem] font-semibold tracking-[0.12em] text-accent uppercase">this build</span>
                      )}
                    </th>
                    <td className={`py-5 pr-6 text-[0.8125rem] leading-relaxed ${r.ours ? 'text-ink-2' : 'text-ink-3'}`}>{r.does}</td>
                    <td className={`py-5 pr-6 text-[0.8125rem] ${r.ours ? 'text-ink-2' : 'text-ink-3'}`}>{r.cost}</td>
                    <td className={`py-5 text-[0.8125rem] leading-relaxed ${r.ours ? 'text-ink-2' : 'text-ink-3'}`}>{r.drawback}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
