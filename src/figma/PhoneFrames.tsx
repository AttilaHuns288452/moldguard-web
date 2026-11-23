import './figma.css'

/* Icons: inline 24x24, stroke-width 2, currentColor — the file's own convention. */
const I = ({ d, s = 18, c }: { d: string; s?: number; c?: string }) => (
  <svg className="ic" width={s} height={s} viewBox="0 0 24 24" aria-hidden="true" style={c ? { color: c } : undefined}><path d={d} /></svg>
)
/* multi-element icons, geometry copied verbatim from MoldGuard_All_23.html */
const Svg = ({ s = 18, c, children }: { s?: number; c?: string; children: React.ReactNode }) => (
  <svg className="ic" width={s} height={s} viewBox="0 0 24 24" aria-hidden="true" style={c ? { color: c } : undefined}>{children}</svg>
)
const CloudRain = ({ s = 18, c }: { s?: number; c?: string }) => (
  <Svg s={s} c={c}>
    <path d="M17.5 16.5a4.5 4.5 0 0 0-.5-8.97A7 7 0 1 0 5.4 14.3" />
    <path d="M8 19v2M12 19.5v2M16 19v2" />
  </Svg>
)
const Pin = ({ s = 18, c }: { s?: number; c?: string }) => (
  <Svg s={s} c={c}>
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx={12} cy={10} r={3} />
  </Svg>
)
const NavHome = () => (<Svg s={22}><path d="M3 11l9-8 9 8" /><path d="M5 9.8V21h14V9.8" /><path d="M9 21v-6h6v6" /></Svg>)
const NavDevices = () => (<Svg s={22}><rect x={7} y={2} width={10} height={20} rx={5} /><circle cx={12} cy={8.5} r={2.6} /><path d="M12 17.5h.01" /></Svg>)
const NavAnalytics = () => (<Svg s={22}><line x1={18} y1={20} x2={18} y2={10} /><line x1={12} y1={20} x2={12} y2={4} /><line x1={6} y1={20} x2={6} y2={14} /></Svg>)
const NavAlerts = () => (<Svg s={22}><path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.7 21a2 2 0 0 1-3.4 0" fill="currentColor" stroke="none" /></Svg>)
const NavMe = () => (<Svg s={24}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx={12} cy={7} r={4} /></Svg>)
const P = {
  home: 'M3 10.5 12 3l9 7.5V21H3z',
  chip: 'M9 3h6v3h3l2 3-2 3 2 3-2 3h-3v3H9v-3H6l-2-3 2-3-2-3 2-3h3z',
  chart: 'M4 20V10m6 10V4m6 16v-7m6 7V8',
  bell: 'M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18M10 21h4M13.7 21a2 2 0 0 1-3.4 0',
  me: 'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8',
  bolt: 'M13 2 3 14h7l-1 8 10-12h-7z',
  drop: 'M12 2.7 6.5 8.6a5 5 0 1 0 11 0z',
  thermo: 'M14 4v11a2 2 0 1 1-4 0V4a2 2 0 1 1 4 0zM12 9h.01',
  wind: 'M17.7 7A5 5 0 1 0 8 9h.01M3 12h8m-4 5h9',
  pin: 'M12 21s-7-6.1-7-10.5a7 7 0 1 1 14 0c0 4.4-7 10.5-7 10.5zM12 10v.01',
  cloud: 'M12 2v2m0 16v2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M2 12h2m16 0h2M4.9 19.1l1.4-1.4m11.4-11.4 1.4-1.4',
  gear: 'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 .6 1.7 1.7 0 0 0-.4 1.1v.1a2 2 0 1 1-3.6 2v-.3a1.7 1.7 0 0 0-1.1-1.5h-.1a2 2 0 1 1-2-3.6l.1-.1a1.7 1.7 0 0 0 .6-1 1.7 1.7 0 0 0-.6-1l-.1-.1a2 2 0 1 1 2-3.6h.1a1.7 1.7 0 0 0 1.1-1.5v-.1a2 2 0 1 1 3.6-2l.1.2a1.7 1.7 0 0 0 1 .6 1.7 1.7 0 0 0 1-.6l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8v.1a2 2 0 1 1 .4 3.6h-.3z',
  plus: 'M12 5v14M5 12h14',
  chev: 'M6 9l6 6 6-6',
  shield: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z',
  back: 'M19 12H5m7 7-7-7 7-7',
  wifi: 'M5 12.6a10 10 0 1 1 14 0M8.5 16.1a5 5 0 1 1 7 0M12 20h.01',
  power: 'M18.4 6.6a9 9 0 1 1-12.8 12.8M12 2v10',
  x: 'M18 6 6 18M6 6l12 12',
}

const NAV_ICON: Record<string, () => React.ReactElement> = {
  Home: NavHome, Devices: NavDevices, Analytics: NavAnalytics, Alerts: NavAlerts,
}
const NAV = [{ k: 'Home' }, { k: 'Devices' }, { k: 'Me' }, { k: 'Analytics' }, { k: 'Alerts' }]

function Nav({ active }: { active?: string }) {
  return (
    <div className="nav">
      {NAV.map((n) =>
        n.k === 'Me' ? (
          <div key="me" className={`nav-bubble${active === 'Me' ? ' me-active' : ''}`}>
            <NavMe />
          </div>
        ) : (
          <div key={n.k} className={`nav-item${active === n.k ? ' active' : ''}`}>
            <span className="nic">{NAV_ICON[n.k]()}</span>
            {n.k}
          </div>
        ),
      )}
    </div>
  )
}

/** Frame 11 — Home. The value screen: the daily answer, not a dashboard. */
export function FrameHome() {
  return (
    <div className="mg">
      <div className="hdr">
        <div className="brand">
          <div className="loc">My Home <I d={P.chev} s={15} /></div>
        </div>
        <div className="wx-chip"><CloudRain s={15} />31°C · 82% RH</div>
        <div className="icon-btn"><I d={P.bell} s={19} /><span className="dot-badge" /></div>
        <div className="icon-btn"><I d={P.plus} s={19} /></div>
      </div>

      <div className="body">
        <div className="card" style={{ padding: '11px 13px', gap: 11, display: 'flex', flexDirection: 'column' }}>
          <div className="hstack"><Pin s={18} c="#3d6bdf" /><span style={{ fontSize: 13, fontWeight: 700 }}>Caloocan City · Rain Showers</span></div>
          <div className="hint">Feels like 36°C · Outdoor RH 82% · Dew Point 26.2°C</div>
        </div>

        <div className="hstack between">
          <span className="small-t">My Pods</span>
          <span className="hint" style={{ fontWeight: 600 }}>2 online</span>
        </div>

        <div className="pod-grid">
          <div className="pod-card">
            <div className="pod-top">
              <div className="risk-tag sub-safe"><span className="dot9" style={{ background: 'var(--safe)' }} />42% • Safe</div>
              <div className="pw"><I d={P.bolt} s={15} /></div>
            </div>
            <div className="readout">28°C · 55% RH</div>
            <div className="pod-name">Living Room Pod</div>
            <div className="pod-sub sub-safe">Standby</div>
          </div>
          <div className="pod-card">
            <div className="pod-top">
              <div className="risk-tag sub-crit"><span className="dot9" style={{ background: '#ef5350' }} />88/100 • Act</div>
              <div className="pw on"><I d={P.bolt} s={15} /></div>
            </div>
            <div className="readout">30°C · 82% RH</div>
            <div className="pod-name">Master Bedroom Pod</div>
            <div className="pod-sub sub-crit">Dehumidifying</div>
          </div>
          <div className="add-card">
            <I d={P.plus} s={22} />
            <div style={{ fontSize: 14, fontWeight: 700 }}>Add New Pod</div>
            <div className="hint">Tap to pair additional unit</div>
          </div>
          <div className="pod-card" style={{ background: '#e7edf4', borderColor: '#2f4156' }}>
            <div className="small-t" style={{ color: '#1f2c3d' }}>Home Average</div>
            <div style={{ fontSize: 26, fontWeight: 700, color: '#1f2c3d', marginTop: 6 }}>65%</div>
            <div style={{ fontSize: 11, fontWeight: 600, color: '#4a5a72' }}>Avg Mold Risk Index</div>
            <div className="pod-sub" style={{ color: '#1f2c3d' }}>Updated 2 min ago</div>
          </div>
        </div>

        <div className="banner info mt-auto">
          <CloudRain s={16} />
          <span><b>Infiltration watch:</b> outdoor humidity is high today — keep windows closed.</span>
        </div>
      </div>
      <Nav active="Home" />
    </div>
  )
}

/** Frame 13 — Device Detail. The gauge is the product's whole claim in one mark. */
export function FrameDetail() {
  return (
    <div className="mg">
      <div className="hdr">
        <div className="icon-btn"><I d={P.back} s={19} /></div>
        <div className="flex1">
          <div className="t" style={{ fontSize: 16 }}>Master Bedroom Pod</div>
          <div className="s"><span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--safe)' }} />HiveMQ Online</div>
        </div>
        <div className="icon-btn"><I d={P.gear} s={19} /></div>
      </div>

      <div className="body body-11">
        <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, padding: '16px 14px' }}>
          <svg width={180} height={180} viewBox="0 0 190 190" aria-hidden="true">
            <circle cx={95} cy={95} r={76} fill="none" stroke="#e3e8f0" strokeWidth={12} />
            <circle cx={95} cy={95} r={76} fill="none" stroke="#ef5350" strokeWidth={12} strokeLinecap="round"
              strokeDasharray="420 478" transform="rotate(-90 95 95)" />
            <text x={95} y={95} textAnchor="middle" dominantBaseline="middle" fontSize={40} fontWeight={700} fill="#ef5350">88/100</text>
            <text x={95} y={122} textAnchor="middle" fontSize={13} fontWeight={700} fill="#ef5350">ACT</text>
          </svg>
          <div className="banner" style={{ width: '100%' }}>
            <span><b>Warning:</b> Surface Condensation Risk Rising (Dew Point 26.2°C)</span>
          </div>
        </div>

        <div className="strip">
          <I d={P.cloud} s={14} />Outdoor 82% RH
          <span className="sep">|</span>
          <I d={P.drop} s={14} c='#1f2c3d' />Indoor 80% RH
        </div>

        <div className="pod-grid" style={{ gap: 10 }}>
          {[
            { l: 'Relative Humidity', v: '80% RH', u: 'SHT41 sensor', d: P.drop, c: '#1f2c3d' },
            { l: 'Ambient Temp', v: '30.0°C', u: 'SHT41 sensor', d: P.thermo, c: '#1f2c3d' },
            { l: 'Surface Dew Point', v: '26.2°C', u: 'Air dew point calculation', d: P.wind, c: '#f5a623' },
          ].map((k) => (
            <div className="kpi" key={k.l}>
              <div className="hstack between"><span className="kl">{k.l}</span><I d={k.d} s={15} c={k.c} /></div>
              <div className="kv">{k.v}</div>
              <div className="ku">{k.u}</div>
            </div>
          ))}
          <div className="kpi">
            <div className="hstack between"><span className="kl">Dew point</span><I d={P.drop} s={15} /></div>
            <div className="kv">3.8°C <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--safe)' }}>Normal</span></div>
            <div className="ku">Surface condensation margin</div>
          </div>
        </div>

        <div className="entry-card">
          <span className="aic info"><I d={P.chart} s={17} /></span>
          <span className="st flex1">Analytics &amp; Environmental Trends</span>
          <I d={P.chev} s={16} c='#8a8f98' />
        </div>
        <div className="entry-card">
          <span className="aic crit"><I d={P.bell} s={17} /></span>
          <span className="st flex1">Pod Notification History</span>
          <I d={P.chev} s={16} c='#8a8f98' />
        </div>
      </div>
    </div>
  )
}

/** Frame 14 — Device Control. Manual override + tank safety. */
export function FrameControl() {
  return (
    <div className="mg">
      <div className="hdr">
        <div className="icon-btn"><I d={P.back} s={19} /></div>
        <div className="flex1">
          <div className="t" style={{ fontSize: 16 }}>Master Bedroom Pod</div>
          <div className="s"><span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--safe)' }} />HiveMQ Online</div>
        </div>
        <div className="icon-btn"><I d={P.gear} s={19} /></div>
      </div>

      <div className="body">
        <div className="seg"><div>Auto-Pilot</div><div className="on">Manual Override</div></div>

        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <div className="row row-52">
            <I d={P.bolt} s={18} c='#1f2c3d' />
            <div className="flex1">
              <div className="st">Dehumidifier Power</div>
              <div className="ss">Direct relay control (Manual mode)</div>
            </div>
            <div className="toggle"><span className="knob" /></div>
          </div>
          <div className="row row-52">
            <I d={P.power} s={18} c='var(--safe)' />
            <div className="flex1">
              <div className="st">Relay Indicator</div>
              <div className="ss">Physical SSR state</div>
            </div>
            <span className="chip on">CLOSED · Running</span>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div className="hstack between">
            <span className="small-t">Water Tank Safety</span>
            <span className="badge-ok"><I d={P.shield} s={13} />Tank Properly Seated</span>
          </div>
          <div className="tank-track"><div className="tank-fill" style={{ width: '82%' }} /></div>
          <div className="hstack between">
            <span style={{ fontSize: 13, fontWeight: 700 }}>82% Full</span>
            <span className="hint">VL53L0X ToF laser · Reed switch OK</span>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', flexDirection: 'column', padding: '4px 14px' }}>
          <div className="step-item">
            <I d={P.wifi} s={18} c='#1f2c3d' />
            <div className="flex1"><div className="st">HiveMQ Cloud Connection</div><div className="ss">Latency 38 ms · TLS 8883</div></div>
            <span className="chip on">Online</span>
          </div>
          <div className="step-item">
            <I d={P.gear} s={18} c='#8a8f98' />
            <div className="flex1"><div className="st">Firmware</div><div className="ss">ESP32 OTA</div></div>
            <span className="hint" style={{ fontWeight: 600 }}>Latest</span>
          </div>
        </div>

        <div className="btn-row mt-auto">
          <div className="btn btn-ghost"><I d={P.power} s={16} />Reboot Pod</div>
          <div className="btn btn-danger"><I d={P.x} s={16} />Remove Device</div>
        </div>
      </div>
    </div>
  )
}

/** Frame 15 — Analytics. Sustained-risk band is the insight, not the line. */
export function FrameAnalytics() {
  return (
    <div className="mg">
      <div className="hdr">
        <div className="flex1"><div className="t">Analytics &amp; History</div></div>
        <div className="icon-btn"><I d={P.gear} s={19} /></div>
      </div>

      <div className="body body-11">
        <div className="hstack" style={{ gap: 10 }}>
          <div className="card" style={{ flex: 1, padding: '10px 12px', display: 'flex', alignContent: 'center', alignItems: 'center', gap: 8 }}>
            <I d={P.chip} s={16} c='#1f2c3d' />
            <span style={{ fontSize: 13, fontWeight: 700 }}>Master Bedroom Pod</span>
            <I d={P.chev} s={14} c='#8a8f98' />
          </div>
          <div className="seg" style={{ flex: 1.1 }}><div>24H</div><div className="on">7D</div><div>30D</div></div>
        </div>

        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div className="hstack between">
            <span className="small-t">Humidity &amp; Dew Point</span>
            <div className="legend-row">
              <span className="lg"><span className="swatch" style={{ background: '#2f4156' }} />Indoor RH %</span>
              <span className="lg"><span className="swatch" style={{ borderTop: '2px dashed #3d6bdf', height: 0 }} />Dew Pt °C</span>
            </div>
          </div>
          <svg width={330} height={172} viewBox="0 0 330 172" style={{ width: '100%' }} aria-hidden="true">
            <rect x={130} y={18} width={70} height={132} fill="#fdecea" />
            {[30, 70, 110, 150].map((y) => <line key={y} x1={30} x2={325} y1={y} y2={y} stroke="#e3e8f0" />)}
            {[[90, 33], [70, 73], [50, 113], [30, 153]].map(([v, y]) => (
              <text key={y} x={26} y={y} textAnchor="end" fontSize={9} fill="#8a8f98" fontFamily="Arial">{v}</text>
            ))}
            <polyline points="40,102 90,84 140,76 190,66 240,78 290,92 320,92" fill="none" stroke="#3d6bdf" strokeWidth={2} strokeDasharray="5 4" />
            <polyline points="40,100 90,74 140,62 190,34 240,58 290,86 320,94" fill="none" stroke="#2f4156" strokeWidth={2.5} />
            <circle cx={190} cy={34} r={3.5} fill="#2f4156" />
            {[['Mon', 40], ['Wed', 140], ['Fri', 240], ['Today', 300]].map(([t, x]) => (
              <text key={t} x={x} y={166} fontSize={9} fill="#8a8f98" fontFamily="Arial">{t}</text>
            ))}
          </svg>
          <div className="banner err">
            <span>Red band = sustained mold-risk periods (RH &gt; 80% at warm temps)</span>
          </div>
        </div>

      </div>
      <Nav active="Analytics" />
    </div>
  )
}

export const FRAMES = [
  { id: 'home', label: 'Home', el: FrameHome },
  { id: 'detail', label: 'Device detail', el: FrameDetail },
  { id: 'control', label: 'Control', el: FrameControl },
  { id: 'analytics', label: 'Analytics', el: FrameAnalytics },
]
