/**
 * Copy audited against MoldGuard.pdf (5 artboards) with `pdftotext` + a diff, not
 * a word count. Product claims are the PDF's own sentences; short UI labels are
 * necessarily tightened. The dashboard/app numbers are illustrative demo data
 * and are labelled as such on screen (hero, Meet, data-flow figure).
 *
 * p1 — hero, problem, meet, sense/score/act, features, ownership, placement, closing
 * p2 — capabilities: risk engine, VOC monitoring, dehumidification, sensors, analytics
 * p3 — closed loop, four stages, setup, FAQ, closing
 * p4 — contact, quote steps, team
 * p5 — app download
 */

export const CONTACT = {
  email: 'moldguard.dev.team@gmail.com',
  phone: '0992 543 0608',
  phoneHref: '+639925430608',
  year: 2026,
  disclaimer: 'Monitoring device · not a mold diagnostic or substitute for professional inspection',
  colophon: 'Prototype build · photography is placeholder',
}

export const HERO = {
  cat: 'IoT mold risk prevention & detection',
  titleLines: ['Know mold is', 'coming before', 'it shows.'],
  lede: 'MoldGuard watches humidity, temperature and air conditions. It scores your mold risk in real time and starts dehumidifying before conditions become unsafe.',
  // the hero shows the unit open; one line so the visitor knows what they are
  // looking at rather than reading it as a broken front door
  stageNote: 'Sensors, thermoelectric stack, fan and water tank \u2014 inside one unit.',
  primary: { label: 'Get the app', href: '/download' },
  secondary: { label: 'See how it works', href: '/how-it-works' },
}

export const APP_MOCK = {
  risk: 38,
  cap: 'Conditions steady',
  rooms: [
    { name: 'Living room', state: 'Low' },
    { name: 'Bedroom', state: 'Low' },
    { name: 'Closet', state: 'Elevated' },
    { name: 'Dehumidifier', state: 'Running' },
  ],
}

export const PROBLEM = {
  title: 'By the time you can see mold, it has already been growing.',
  lede: 'High humidity can persist for weeks before mold becomes visible. Most people find out too late.',
  items: [
    { n: '01', title: 'Discovered too late', body: 'Households usually notice mold only after visible growth or odor.' },
    { n: '02', title: 'Dumb triggers', body: 'Typical dehumidifiers react to a single humidity number, ignoring exposure duration and temperature.' },
    { n: '03', title: 'Zero feedback', body: 'Passive moisture absorbers offer no monitoring, no data, no automation.' },
    { n: '04', title: 'Priced for enterprises', body: 'Building-grade monitoring is out of reach for renters and small property owners.' },
  ],
}

export const MEET = {
  title: 'Meet MoldGuard.',
  lede: 'One device senses the room, scores the risk and dehumidifies on its own. You own the hardware.',
  caption: 'MoldGuard Pod · tabletop or wall-mounted',
  stages: [
    { n: '01', title: 'The pod senses', body: 'Temperature, humidity and air quality, continuously.' },
    { n: '02', title: 'The system understands', body: 'Readings become an environmental picture of the room.' },
    { n: '03', title: 'The system flags risk', body: 'A single Mold Risk Index, updated in real time.' },
    { n: '04', title: 'The system responds', body: 'The stack switches itself on and back off.' },
  ],
  flowLabel: 'See the full data flow',
  flowLede: 'MoldGuard monitors indoor conditions, identifies increasing mold or condensation risk, and dehumidifies automatically.',
  flowNote: 'Illustrative demo data.',
}

export const SENSE_SCORE_ACT = {
  title: 'Sense. Score. Act.',
  cta: { label: 'Full walkthrough', href: '/how-it-works' },
  steps: [
    { n: '01', title: 'Sense', items: ['Humidity', 'Temperature', 'Air quality'] },
    { n: '02', title: 'Score', items: ['Mold Risk Index', 'Exposure duration', 'Dew-point conditions'] },
    { n: '03', title: 'Act', items: ['Dehumidification', 'Alerts'] },
  ],
}

export const FEATURES = {
  title: 'Built for mold, not just moisture.',
  cta: { label: 'Explore the features', href: '/features' },
  items: [
    { n: '1', title: 'Mold Risk Index Engine', body: 'Risk scoring based on humidity, temperature and exposure duration.' },
    { n: '2', title: 'Early detection', body: 'Humidity, temperature and sustained exposure catch the risky window before mold becomes visible. VOC sensing adds context alongside them, never a verdict on its own.' },
    { n: '3', title: 'Auto-Dehumidification', body: 'Responds automatically when risk rises.' },
    { n: '4', title: 'Dashboard & Analytics', body: 'Historical trends and multi-room visibility.' },
    { n: '5', title: 'Mobile Alerts & Control', body: 'Know when something changes and act remotely.' },
    { n: '6', title: 'No Recurring Subscription', body: 'Own the system without monthly monitoring fees.' },
  ],
}

export const OWN = {
  title: "Own it, don't rent it.",
  lede: 'Standard, individually sourced parts inside one unit: sensors, a thermoelectric stack and a water tank. The hardware is yours, with no proprietary ecosystem.',
  // Every figure below is from the MTELOS Feasibility Study (Section V,
  // Economic feasibility). The caveat line is the study's own, not a hedge:
  // it states plainly that every production scenario currently loses money.
  cost: {
    label: 'Prototype build cost',
    figure: '\u20b19,268.30',
    note: 'Including a 20% contingency.',
    caveat: 'Production economics are not settled yet: at the \u20b14,994.00 price tested in our survey, unit cost runs from \u20b15,044.68 to \u20b17,734.68, so no production scenario is profitable and supplier quotes are still outstanding.',
    source: 'MTELOS Feasibility Study, Section V',
  },
  points: [
    { title: 'Open hardware', body: 'Individually sourced, standard parts.' },
    { title: 'Fixed cost', body: 'One development cost, no monthly fees.' },
    { title: 'Your unit', body: 'Senses, scores and dehumidifies in one device.' },
  ],
}

export const PLACEMENT = {
  title: 'Made for the rooms where mold actually starts.',
  lede: 'Place MoldGuard in bathrooms, closets, and basements, near the humidity that feeds growth. It works on a tabletop or mounted on the wall.',
  cta: { label: 'Placement & setup', href: '/how-it-works' },
  photoAlt: 'MoldGuard Pod · tabletop or wall-mounted',
}

export const CTA = {
  title: 'Protect your space before mold appears.',
  lede: 'Get the app, or talk to the team about your space.',
  primary: { label: 'Get the app', href: '/download' },
  secondary: { label: 'Contact us', href: '/contact' },
}

export const CAPABILITIES = {
  title: 'Mold-specific intelligence, end to end.',
  lede: "Warm, humid rooms are mold's ideal habitat. Most dehumidifiers see one number, humidity. MoldGuard reads the full picture, humidity, temperature, exposure duration, and virtual dew point margin, adds weather foresight, and responds on its own.",
  blocks: [
    {
      n: '01',
      eyebrow: 'Mold Risk Index engine',
      body: 'Real-time risk scoring built from humidity, temperature, and sustained exposure duration, with a virtual surface dew point calculation, going beyond the single-threshold triggers used by commercial dehumidifiers, and avoiding false triggers during temporary humidity spikes.',
      index: 38,
      band: 'Low',
      bandHigh: 'High',
    },
    {
      n: '02',
      eyebrow: 'Environmental & VOC monitoring',
      body: 'A VOC sensor adds supplementary air-quality context alongside humidity, temperature, and duration. We treat VOC as context, never standalone proof: research shows microbial VOC levels are often too low for reliable detection and easily confounded by household sources.',
    },
  ],
}

export const WHAT_IT_DOES = {
  title: 'What MoldGuard does for you.',
  lede: 'Each one exists so you never have to think about mold again.',
  auto: {
    eyebrow: 'Automatic Dehumidification',
    title: 'It acts before you would.',
    body: 'When risk climbs, the dehumidifier switches itself on, and off again once conditions return to safe range. The loop closes with no manual action, no scheduling, no remembering.',
    diagram: [
      { a: '76% RH held', b: 'Watch' },
      { a: 'Threshold crossed', b: 'Decision made' },
      { a: 'Moisture pulled down', b: 'Running on auto' },
    ],
  },
  sensors: {
    eyebrow: 'Environmental Sensors',
    title: 'Every number the risk engine needs.',
    body: 'Temperature, humidity, and air quality measured together, continuously, so the risk score is built on the full picture, not one input.',
    pod: 'Living Room Pod',
    readings: [
      { k: 'Temperature', v: '28.0°C' },
      { k: 'Humidity', v: '55% RH' },
      { k: 'VOC', v: 'Normal' },
    ],
  },
  analytics: {
    eyebrow: 'Analytics & History',
    title: 'Look back at any room, any week.',
    body: 'Humidity, temperature, and dew point trends are logged over time, with multi-room and multi-unit views for larger households, dormitories, or property managers.',
    sample: 'Master Bedroom · 30 days',
    ranges: ['24 hours', '7 days', '30 days'],
  },
}

export const LOOP = {
  title: 'From invisible risk to handled, automatically.',
  lede: 'MoldGuard runs one continuous loop: monitor the room, analyze the real mold risk, respond on its own, and protect your home around the clock.',
  label: 'The closed loop: sense → analyze → respond → protect',
  rail: [
    { n: '01', name: 'SENSE', meta: 'Humidity, temperature, VOC' },
    { n: '02', name: 'ANALYZE', meta: 'The Mold Risk Index engine' },
    { n: '03', name: 'RESPOND', meta: 'Dehumidifier on auto' },
    { n: '04', name: 'PROTECT', meta: 'History, alerts, control' },
  ],
  stages: [
    {
      n: '01', kicker: 'SENSE', head: 'Sense the room, continuously.',
      body: "A compact sensor pod watches the conditions mold actually cares about: relative humidity, temperature, and volatile organic compounds (VOCs). Humidity and temperature feed the risk engine's core inputs. VOCs add context, read together with everything else rather than as a verdict.",
      meta: 'Readings stream in around the clock',
    },
    {
      n: '02', kicker: 'ANALYZE', head: 'Score the risk, not just a number.',
      body: "The Mold Risk Index combines humidity, temperature, and how long those conditions persist, instead of reacting to a single humidity threshold. That's what makes the prediction early: it catches the window where mold can start, before it does. Outdoor forecast data sharpens that window further.",
      meta: 'Closet 82% RH · 26h sustained · Dew point margin −0.4°C',
    },
    {
      n: '03', kicker: 'RESPOND · AUTO', head: 'Act: dehumidify, no hands.',
      body: "When the index crosses the risk threshold, the thermoelectric stack starts and pulls moisture back down, closing the loop without you touching anything. Extracted water collects in the removable 1 L tank, monitored so you're told before it's full.",
      meta: 'Dry air out · Dehumidifier running on auto',
    },
    {
      n: '04', kicker: 'PROTECT', head: 'Report: see everything, anywhere.',
      body: 'Live status and full history live in the app and web dashboard. The moment risk rises, you get an alert, and the dehumidifier has already responded. You can step in with manual override from anywhere, any time.',
      meta: 'History, alerts, control',
    },
  ],
}

export const SETUP = {
  title: 'Plug in, connect, done.',
  steps: [
    { n: '1', title: 'Place the unit', body: 'Tabletop or wall-mounted, near humidity-prone areas: bathrooms, closets, basements.' },
    { n: '2', title: 'Connect to WiFi', body: 'The device joins your home network and syncs to the dashboard in real time.' },
    { n: '3', title: 'Watch the loop run', body: "From here it's automatic. Check trends in the dashboard, get alerts in the app, empty the tank when it's full." },
  ],
  caption: 'Placed in the room, tabletop or wall-mount',
}

export const FAQ = {
  title: 'Straight answers.',
  items: [
    { q: 'What is MoldGuard?', a: 'An IoT mold risk prevention and detection system: a sensor pod that scores the Mold Risk Index for a room and can automatically control dehumidification.' },
    { q: 'How does it detect mold risk?', a: 'It scores the conditions mold needs rather than looking for mold. The Mold Risk Index combines humidity, temperature, and how long those conditions persist, instead of reacting to a single humidity threshold. Outdoor forecast data sharpens that window further.' },
    { q: 'Is it a dehumidifier?', a: 'Yes, it is one. MoldGuard contains its own thermoelectric dehumidifier: when the index crosses the threshold it starts pulling moisture down by itself.' },
    { q: 'What does the app show?', a: 'Live status and full history: the room, the readings behind the score, humidity, temperature, and dew point trends over time, with multi-room and multi-unit views. You can step in with manual override from anywhere, any time.' },
    { q: 'Can I monitor more than one room?', a: 'Yes. Multi-room and multi-unit views are logged over time for larger households, dormitories, or property managers.' },
    { q: 'How do I set it up?', a: 'Plug in, connect, done. Place the unit tabletop or wall-mounted, connect it to WiFi, and watch the loop run.' },
    { q: 'What maintenance does it need?', a: "Emptying the removable 1 L tank. Extracted water collects there, monitored so you're told before it's full." },
    { q: 'Does it work without the internet?', a: 'The loop runs on the device. Live status and history, alerts, and manual override are the parts that travel through the app and web dashboard.' },
    { q: 'How much does it cost?', a: 'One development cost, no monthly fees. Standard, individually sourced parts inside one unit: sensors, a thermoelectric stack and a water tank. The hardware is yours, with no proprietary ecosystem.' },
    { q: 'Who is it for?', a: 'Renters and small property owners, larger households, dormitories, and property managers.' },
  ],
}

export const CONTACT_PAGE = {
  title: "Let's keep your space ahead of mold.",
  lede: "Tell us a little about your space and we'll get back to you, or reach us directly through any channel below.",
  formTitle: 'Start the conversation.',
  directTitle: 'Prefer direct?',
  directNotes: [
    'General inquiries and quotes, replies from the team.',
    'Call to discuss the quote, request more information, or anything else.',
    "Quote: sign the proposal's first page and return it by email or post, details in the document itself. Approved by our course advisor.",
  ],
  app: {
    kicker: 'Just want the app?',
    body: 'The MoldGuard companion shows live risk scores and alerts.',
    cta: 'Download →',
  },
  steps: {
    title: 'From message to quote in three steps.',
    items: [
      { n: '01', title: 'Tell us your space', body: 'Rooms, size, and where humidity hits hardest, the form or a quick call covers it.' },
      { n: '02', title: 'Get your quote', body: "MoldGuard is a fixed cost build: itemized hardware, one development fee, full ownership, no proprietary ecosystem. We'll walk you through it." },
      { n: '03', title: 'Installation & handover', body: 'We handle on-site or remote installation, user training, and documentation handover.' },
    ],
  },
  teamTitle: 'Eight students. One loop.',
  teamLede: 'MoldGuard is built by a full stack student team, hardware, firmware, backend, frontend, design, and QA all in house.',
  closing: { title: 'Ready when you are.', primary: 'Send a message', secondary: 'Email us directly' },
}

export const TEAM = [
  { initials: 'LB', name: 'Louie Jein D. Banting', role: 'Project Manager / Firmware Dev' },
  { initials: 'JC', name: 'Jeremy V. Cabuntas', role: 'Quality Assurance / Research Dev' },
  { initials: 'MF', name: 'Maron E. Fajardo', role: 'Backend Lead Dev' },
  { initials: 'MA', name: 'Mcraven Akira S. Fernandez', role: 'Full Stack Dev' },
  { initials: 'BL', name: 'Bernadette B. Lalata', role: 'Hardware Engineer / UI-UX' },
  { initials: 'ML', name: 'Michael T. Litang', role: 'Hardware Lead Dev' },
  { initials: 'JP', name: 'Jessica Mae T. Palma', role: 'Frontend Dev / UI-UX' },
  { initials: 'AS', name: 'Attila P. Sabiniano', role: 'Frontend Lead Dev' },
]

/** PAGE 2 — the alert + automation copy, verbatim. */
export const ALERTS = {
  eyebrow: 'Alerts',
  title: 'Told the moment it matters.',
  body: 'Real-time push notifications as risk rises, so a room never waits for you to check on it.',
}

export const AUTOMATIONS = {
  eyebrow: 'Automations',
  title: 'The rule is on the screen.',
  body: "The loop's decisions are visible, not hidden in a black box: the rule the system runs is written right on the screen.",
  rule: 'When Mold Risk Index stays above 75 → Run the dehumidifier',
  note: 'Runs automatically. You can override any time from the app.',
}

/** Illustrative scenarios. The only invented numbers, labelled as demo data,
 *  anchored to the PDF's own sample readings. */
export const RISK_SCENARIOS = [
  { label: 'Closet', room: 'Closet', index: 87, band: 'Act', rh: 79, temp: 29, hours: 26, dew: 0.4,
    note: 'The PDF sample: closet 82% RH, 26h sustained, dew point margin −0.4°C. The loop has already switched the dehumidifier on.' },
  { label: 'Bathroom', room: 'Bathroom', index: 58, band: 'Watch', rh: 71, temp: 29, hours: 9, dew: 1.6,
    note: 'A shower spikes humidity for minutes. Time-weighted scoring keeps this at Watch instead of tripping a threshold.' },
  { label: 'Basement', room: 'Basement', index: 93, band: 'Act', rh: 86, temp: 23, hours: 41, dew: -0.2,
    note: 'Warm air meets cold stone, and condensation waits. A negative dew-point margin means surfaces are already wet.' },
  { label: 'Living room', room: 'Living room', index: 31, band: 'Safe', rh: 52, temp: 27, hours: 2, dew: 4.1,
    note: 'Conditions sit outside the mold window. Nothing to do but keep watching.' },
]

/** PDF page 2, "How it compares." Verbatim rows: option / what it does / cost model / drawbacks. */
export const COMPARISON = {
  title: 'How it compares.',
  lede: 'Existing options were built for general comfort or simple humidity control, not mold-specific risk modeling.',
  columns: ['Option', 'What it does', 'Cost model', 'Drawbacks'],
  rows: [
    {
      option: 'Passive moisture absorbers',
      does: 'Chemical moisture absorption, no sensors.',
      cost: 'Low one-time cost.',
      drawbacks: 'No monitoring, no data, no automation.',
    },
    {
      option: 'Commercial dehumidifiers',
      does: 'App-controlled humidity threshold triggers.',
      cost: 'Mid-to-high retail hardware cost.',
      drawbacks: 'No mold-specific modeling; locked to vendor app; no web dashboard.',
    },
    {
      option: 'MoldGuard V1.0 (ours)',
      does: 'Mold Risk Index (humidity + temperature + duration), supplementary VOC context, predictive weather integration, closed-loop auto-dehumidification, water-tank monitoring, web + mobile dashboard.',
      cost: 'Fixed development fee.',
      drawbacks: 'Requires dedicated power source; periodic water-tank emptying.',
      ours: true,
    },
  ],
}

/**
 * PDF page 2, "Built from parts you can trust." — six collapsed spec rows. The
 * PDF ships them collapsed so its text layer has no body copy; the spec text
 * here comes from the team's own hardware documents
 * (moldguard-defense/context/cost-benefit-analysis.md and
 * panel-defense-general-notes.md), so every line is verifiable, not invented.
 */
export const PARTS_TRUST = {
  title: 'Built from parts you can trust.',
  lede: 'Open, off-the-shelf components, expand a row for the plain-language spec.',
  rows: [
    {
      n: '01',
      title: 'Humidity & temperature sensing',
      body: 'SHT41 relative-humidity and temperature sensor, read continuously rather than polled once per minute. Humidity and temperature are the two core inputs to the Mold Risk Index.',
    },
    {
      n: '02',
      title: 'VOC / air-quality sensing',
      body: 'SGP40 volatile-organic-compound sensor, plus a VL53L0X time-of-flight sensor beside it. VOC is treated as supplementary context, never as standalone proof of mold.',
    },
    {
      n: '03',
      title: 'Dehumidification unit',
      body: 'Thermoelectric TEC-12706 Peltier cooling stack between heat exchangers, with an 80 mm fan moving room air across the heatsink. Two units move roughly a litre of condensate a day.',
    },
    {
      n: '04',
      title: 'Brain & connectivity',
      body: 'ESP32-WROOM microcontroller running the risk engine and the automation rule, publishing over WiFi to the app. No vendor cloud sits in the middle.',
    },
    {
      n: '05',
      title: 'Enclosure & placement',
      body: 'ABS enclosure, 318 × 255 × 159 mm, standing on a tabletop or mounted to a wall. The lower bay holds the removable water tank; the upper bay holds the electronics and the LCD.',
    },
    {
      n: '06',
      title: 'Software stack',
      body: 'Web dashboard and companion app on a standard stack, with a weather API for predictive pre-cooling. The rule the system runs is printed on screen, not hidden in a black box.',
    },
  ],
}
