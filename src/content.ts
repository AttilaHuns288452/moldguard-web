/**
 * Copy audited against MoldGuard.pdf (5 artboards) with `pdftotext` + a diff, not
 * a word count. Product claims are the PDF's own sentences; short UI labels are
 * necessarily tightened. The dashboard/app numbers are sample data
 * and are labelled as such on screen (hero, Meet, data-flow figure).
 *
 * p1 — hero, problem, meet, sense/score/act, features, ownership, placement, closing
 * p2 — capabilities: risk engine, predictive weather, dehumidification, sensors, analytics
 * p3 — closed loop, four stages, setup, FAQ, closing
 * p4 — contact, quote steps, team
 * p5 — app download
 */

export const CONTACT = {
  email: 'moldguard.dev.team@gmail.com',
  phone: '0992 543 0608',
  // The displayed number is the local PH form: 0992 543 0608 -> +63 992 543 0608.
  phoneHref: '+639925430608',
  year: 2026,
  disclaimer: 'Monitoring device · not a mold diagnostic or substitute for professional inspection',
}

export const HERO = {
  cat: 'Indoor environmental monitoring',
  titleLines: ['Know when', 'conditions become', 'mold-friendly.'],
  lede: 'MoldGuard watches humidity, temperature and sustained exposure, then turns those conditions into a room-level risk score and an automatic dehumidification response.',
  // the hero shows the unit open; one line so the visitor knows what they are
  // looking at rather than reading it as a broken front door
  stageNote: 'Sensors · thermoelectric stack · fan · water tank',
  status: 'Direct app access',
  // The artboard's CTA pair is "Get Started" + "See how it works". "See how it
  // works" is the more useful second action here: it answers the question the
  // hero raises (how does it know?) and it points at the /how-it-works page this
  // site has and the static artboard could not. Contact remains in the nav and in
  // the closing band, so nothing is lost.
  primary: { label: 'Get the app', href: '/download' },
  secondary: { label: 'See how it works', href: '/how-it-works' },
}

// The demo readout used by DataFlow. It is NOT the hero card (that is explicit
// markup), but it is live, so its values must obey the site's one risk vocabulary:
// Safe / Watch / Act. It previously carried three rooms and "Elevated" — the same
// contradiction that was removed from the hero, still shipping in this component.
export const APP_MOCK = {
  risk: 38,
  cap: 'Conditions steady',
  rooms: [
    { name: 'Closet', state: 'Watch' },
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
  flowNote: 'Sample data.',
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
    { n: '1', title: 'Mold Risk Index Engine', body: 'A VTT-based model scores risk from relative humidity, temperature and sustained exposure duration, not a fixed humidity threshold.' },
    { n: '2', title: 'Early detection', body: 'Humidity, temperature and sustained exposure catch the risky window before mold becomes visible.' },
    { n: '3', title: 'Auto-Dehumidification', body: 'Responds automatically when risk rises.' },
    { n: '4', title: 'Dashboard & Analytics', body: 'Historical trends for the room; multi-room visibility is planned as an optional premium tier.' },
    { n: '5', title: 'Mobile Alerts & Control', body: 'Know when something changes and act remotely.' },
    { n: '6', title: 'No Recurring Subscription', body: 'Own the system without monthly monitoring fees.' },
  ],
}

export const OWN = {
  title: "Own it, don't rent it.",
  lede: 'Standard, individually sourced parts inside one unit: sensors, a thermoelectric stack and a water tank. The hardware is yours, with no proprietary ecosystem.',
  // The proposal (Section 5, Budgetary Risks) states the hardware cost as "a
  // fixed, itemized total of ₱4,363" from its own component table. The site had
  // been quoting ₱9,268.30 from the feasibility study instead, which contradicts
  // the document the project is assessed against.
  cost: {
    label: 'Build cost',
    figure: '\u20b14,363',
    note: 'Itemised hardware total.',
    caveat: 'Development cost is separate. Supplier quotes and certification (DTI-BPS / NTC) are still pending, so a figure here is a project proposal, not a product order.',
    source: 'Software Development Proposal, Section 5',
  },
  points: [
    { title: 'Open hardware', body: 'Individually sourced, standard parts.' },
    { title: 'Fixed cost', body: 'One development cost, no monthly fees.' },
    { title: 'Your unit', body: 'Senses, scores and dehumidifies in one device.' },
    { title: 'Works offline', body: 'Bluetooth LE local control when Wi-Fi or cloud is down; automation keeps running either way.' },
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
  secondary: { label: 'Contact the team', href: '/contact' },
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
      eyebrow: 'Predictive weather integration',
      body: 'The backend pulls external forecasts and combines them with current and historical indoor readings, so the system anticipates a humidity surge instead of only reacting to one.',
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
    body: 'Temperature and relative humidity measured continuously, alongside a dew-point estimate for cold surfaces, so the risk score is built on the full picture, not one input.',
    pod: 'Living Room Pod',
    readings: [
      { k: 'Temperature', v: '28.0°C' },
      { k: 'Humidity', v: '55% RH' },
    ],
  },
  analytics: {
    eyebrow: 'Analytics & History',
    title: 'Look back at any room, any week.',
    body: 'Humidity, temperature, and dew point trends are logged over time for the room. Multi-room and multi-unit views are planned as an optional premium tier for larger households, dormitories, or property managers.',
    sample: 'Master Bedroom · 30 days',
    ranges: ['24 hours', '7 days', '30 days'],
  },
}

export const LOOP = {
  title: 'From invisible risk to handled, automatically.',
  lede: 'MoldGuard runs one continuous loop: monitor the room, analyze the real mold risk, respond on its own, and protect your home around the clock.',
  label: 'The closed loop: sense → analyze → respond → protect',
  rail: [
    { n: '01', name: 'SENSE', meta: 'Humidity, temperature, dew point' },
    { n: '02', name: 'ANALYZE', meta: 'The Mold Risk Index engine' },
    { n: '03', name: 'RESPOND', meta: 'Dehumidifier on auto' },
    { n: '04', name: 'PROTECT', meta: 'History, alerts, control' },
  ],
  stages: [
    {
      n: '01', kicker: 'SENSE', head: 'Sense the room, continuously.',
      body: "A compact sensor pod watches the conditions mold actually cares about: relative humidity and temperature, read continuously. Those two feed the risk engine's core inputs, and an air dew-point calculation estimates condensation risk at cold surfaces a single ambient sensor cannot see.",
      meta: 'Readings stream in around the clock',
    },
    {
      n: '02', kicker: 'ANALYZE', head: 'Score the risk, not just a number.',
      body: "The Mold Risk Index combines humidity, temperature, and how long those conditions persist, instead of reacting to a single humidity threshold. That's what makes the prediction early: it catches the window where mold can start, before it does. Outdoor forecast data sharpens that window further.",
      meta: 'Closet 82% RH · 26h sustained · Dew point margin −0.4°C',
    },
    {
      n: '03', kicker: 'RESPOND · AUTO', head: 'Act: dehumidify, no hands.',
      body: "When the index crosses the risk threshold, the thermoelectric stack starts and pulls moisture back down, closing the loop without you touching anything. Extracted water collects in a removable 1-litre reservoir, monitored so you're told before it's full.",
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
    { q: 'What does the app show?', a: 'Live status and history: the room, the readings behind the score, and humidity, temperature and dew-point trends over time (multi-room and multi-unit views are planned as a premium tier). You can step in with manual override from anywhere, any time.' },
    { q: 'Can I monitor more than one room?', a: 'Not in the base product. Multi-room and multi-unit views are planned as an optional premium tier for larger households, dormitories or property managers.' },
    { q: 'How do I set it up?', a: 'Plug in, connect, done. Place the unit tabletop or wall-mounted, connect it to Wi-Fi, and watch the loop run.' },
    { q: 'What happens if the internet goes down?', a: 'Bluetooth Low Energy keeps local monitoring and manual control working, and the dehumidification logic keeps running autonomously either way. One phone at a time over Bluetooth; several devices can connect over Wi-Fi.' },
    { q: 'What maintenance does it need?', a: "Emptying the removable tank. Extracted water collects there, monitored so you're told before it's full." },
    { q: 'Does it work without the internet?', a: 'The loop runs on the device. Live status and history, alerts, and manual override are the parts that travel through the app and web dashboard.' },
    { q: 'How much does it cost?', a: 'One development cost, no monthly fees. Standard, individually sourced parts inside one unit: sensors, a thermoelectric stack and a water tank. The hardware is yours, with no proprietary ecosystem.' },
    { q: 'What room size does it handle?', a: 'One small enclosed room, about 30 m\u00b3 (roughly 2.9 \u00d7 4.2 \u00d7 2.4 m), which is what the 1-litre reservoir is sized for. Larger or open-plan spaces are outside scope.' },
    { q: 'Who is it for?', a: 'Renters and small property owners, larger households, dormitories, and property managers.' },
  ],
}

export const CONTACT_PAGE = {
  title: "Let's keep your space ahead of mold.",
  lede: "Tell us a little about your space and we'll get back to you, or reach us directly through any channel below.",
  formTitle: 'Tell us about your space.',
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
    title: 'What happens after you reach out.',
    note: 'Certification (DTI-BPS / NTC) is pending, so a quote here is a project proposal, not a product order.',
    items: [
      { n: '01', title: 'Tell us your space', body: 'Rooms, size, and where humidity hits hardest, the form or a quick call covers it.' },
      { n: '02', title: 'Get your quote', body: "MoldGuard is a fixed cost build: itemized hardware, one development fee, full ownership, no proprietary ecosystem. We'll walk you through it." },
      { n: '03', title: 'Installation & handover', body: 'We handle on-site or remote installation, user training, and documentation handover.' },
    ],
  },
  teamTitle: 'One team. One loop.',
  teamLede: 'MoldGuard is built by a full stack team — hardware, firmware, backend, frontend, design, and QA, all in house.',
  closing: { title: 'Ready when you are.', primary: 'Send a message', secondary: 'Email us directly' },
}

export type TeamMember = {
  id: string
  name: string
  initials: string
  role: string
  /** Work area, not a job title: the row the profile sits under. */
  section: string
  photo: string
  firstName: string
  bio: string
}

/** Order follows the supplied team sheet (photo grid, left to right, top row first).
 *  Bios are first-person and role-grounded only — no background or credentials
 *  that the team sheet does not state. */
export const TEAM: TeamMember[] = [
  {
    id: 'louie-banting', name: 'Louie Jein D. Banting', initials: 'LB',
    role: 'Project Manager / Firmware Developer', section: 'Leadership & Firmware',
    photo: '/team/louie-banting.webp', firstName: 'Louie',
    bio: "Hello, I'm Louie. I manage the MoldGuard project and work on its firmware, keeping the build on schedule and the device logic dependable.",
  },
  {
    id: 'jeremy-cabuntas', name: 'Jeremy V. Cabuntas', initials: 'JC',
    role: 'Quality Assurance / Research Developer', section: 'Quality & Research',
    photo: '/team/jeremy-cabuntas.webp', firstName: 'Jeremy',
    bio: "Hello, I'm Jeremy. I look after quality assurance and research, testing what we ship and checking the questions behind each decision.",
  },
  {
    id: 'maron-fajardo', name: 'Maron E. Fajardo', initials: 'MF',
    role: 'Backend Lead / Database', section: 'Backend & Data',
    photo: '/team/maron-fajardo.webp', firstName: 'Maron',
    bio: "Hello, I'm Maron. I lead the backend and database work, making sure every reading from the device lands somewhere reliable.",
  },
  {
    id: 'akira-fernandez', name: 'Mcraven Akira S. Fernandez', initials: 'MA',
    role: 'Full Stack Developer', section: 'Full Stack',
    photo: '/team/akira-fernandez.webp', firstName: 'Akira',
    bio: "Hello, I'm Akira. I work across the full stack, connecting the interface, the server, and the device so the whole loop holds together.",
  },
  {
    id: 'bernadette-lalata', name: 'Bernadette B. Lalata', initials: 'BL',
    role: 'UI/UX / Hardware Specialist', section: 'Design & Hardware',
    photo: '/team/bernadette-lalata.webp', firstName: 'Bernadette',
    bio: "Hello, I'm Bernadette. I work on UI/UX and hardware, shaping how MoldGuard looks and how its parts fit together.",
  },
  {
    id: 'michael-litang', name: 'Michael T. Litang', initials: 'ML',
    role: 'IoT Lead', section: 'IoT & Hardware',
    photo: '/team/michael-litang.webp', firstName: 'Michael',
    bio: "Hello, I'm Michael. I lead IoT, bringing the sensors and connectivity together into one working system.",
  },
  {
    id: 'jessica-palma', name: 'Jessica Mae T. Palma', initials: 'JP',
    role: 'UI/UX / Frontend Developer', section: 'UI/UX & Frontend',
    photo: '/team/jessica-palma.webp', firstName: 'Jessica',
    bio: "Hello, I'm Jessica. I work on UI/UX and the frontend, turning our designs into the screens people actually use.",
  },
  {
    id: 'attila-sabiniano', name: 'Attila P. Sabiniano', initials: 'AS',
    role: 'Frontend Lead', section: 'UI/UX & Frontend',
    photo: '/team/attila-sabiniano.webp', firstName: 'Attila',
    bio: "Hello, I'm Attila. I lead MoldGuard's frontend and UI/UX, turning our designs into clear, responsive screens and making the interface easy to use.",
  },
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
  rule: 'When Mold Risk Index crosses its threshold → Run the dehumidifier',
  note: 'Runs automatically. You can override any time from the app.',
}

/** Sample scenarios. The only invented numbers, labelled as sample data,
 *  anchored to the PDF's own sample readings. */
export const RISK_SCENARIOS = [
  { label: 'Closet', room: 'Closet', index: 87, band: 'Act', rh: 79, temp: 29, hours: 26, dew: -0.4,
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
      option: 'MoldGuard (ours)',
      does: 'Mold Risk Index (humidity + temperature + duration), predictive weather integration, closed-loop auto-dehumidification, water-tank monitoring, web + mobile dashboard.',
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
      title: 'Condensate reservoir sensing',
      body: 'VL53L0X time-of-flight ranging measures the distance to the water surface to estimate fill level, and a normally-closed magnetic reed switch confirms the removable reservoir is properly seated.',
    },
    {
      n: '03',
      title: 'Dehumidification unit',
      body: 'Thermoelectric TEC-12706 Peltier cooling stack between heat exchangers, with an 80 mm fan moving room air across the heatsink. Condensate is collected in a removable reservoir, with capacity tracked by a time-of-flight sensor.',
    },
    {
      n: '04',
      title: 'Brain & connectivity',
      body: 'ESP32-S3 N16R8 running the risk engine and the automation rule, publishing over Wi-Fi to the app. Standard MQTT broker and open backend - no vendor-locked ecosystem.',
    },
    {
      n: '05',
      title: 'Enclosure & placement',
      body: 'ABS enclosure, approximately 28 × 28 × 40 cm, standing on a tabletop or mounted to a wall. The lower bay holds the removable 1-litre reservoir; the upper bay holds the electronics and the LCD.',
    },
    {
      n: '06',
      title: 'Software stack',
      body: 'Web dashboard and companion app on a standard stack, with a weather API for forecast-based anticipation. The rule the system runs is printed on screen, not hidden in a black box.',
    },
  ],
}
