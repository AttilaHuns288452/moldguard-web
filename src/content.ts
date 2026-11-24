/**
 * Customer-facing copy for the sales site.
 *
 * ONE business model: a one-time hardware sale. No subscriptions, no premium
 * tiers, no development fees on customer surfaces. The selling price
 * (PHP 9,994) comes from the feasibility study (Section 3.4) and the
 * cost-benefit analysis. Availability, delivery, warranty and service terms
 * are confirmed in a written quotation, never on this site. Nothing here is a
 * checkout: every funnel path ends at /contact.
 *
 * Dashboard/app numbers are sample data and are labelled as such on screen
 * (hero, Meet, data-flow figure). MoldGuard monitors environmental conditions;
 * it is not a mold diagnostic and does not guarantee prevention.
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

/** The one offer, stated the same way everywhere on the site. */
export const OFFER = {
  price: '\u20b19,994',
  priceLabel: 'One-time price',
  // The buyer's first qualifying question, answered beside the price.
  specs: ['One small enclosed room', 'About 28 × 28 × 40 cm', '1-litre removable tank'],
  priceNote: 'One payment. The device and its companion app are yours; nothing renews.',
  source: 'Priced from the feasibility study, Section 3.4',
  cta: { label: 'Check it fits my room', href: '/contact' },
  terms:
    'One-time purchase, no subscription. Availability, delivery and warranty terms are confirmed in your quotation before any commitment; no payment is taken on this site.',
  // Reassurance at the decision point: what happens after the click.
  reassurance: 'No payment now. We reply with fit and a firm quote, usually within one to two business days.',
}

export const HERO = {
  cat: '',
  titleLines: ['Less guessing.', 'More control over damp rooms.'],
  // The problem only. The mechanism is stated once below, by the comparison line
  // and the three bullets; repeating it here made the hero say the same thing
  // three times in one viewport.
  lede: 'Nothing is watching the room between the times you check it. MoldGuard does that part for you.',
  // the hero shows the unit open; one line so the visitor knows what they are
  // looking at rather than reading it as a broken front door
  stageNote: 'Sensors, stack, fan, tank',
  // Under the CTAs, beside the price: what the buyer gets, in their terms.
  bullets: [
    { title: 'One number for the room', body: 'A risk score from humidity, temperature and how long damp conditions last.' },
    { title: 'It runs the dehumidifier', body: 'Starts when the score crosses its threshold, stops once conditions settle.' },
    { title: 'Status from your phone', body: 'Alerts and manual control in the companion app while the device is online.' },
  ],
  primary: { label: 'Check it fits my room', href: '/contact' },
  secondary: { label: 'See how it works', href: '/how-it-works' },
  // One comparison a buyer makes immediately, answered before the FAQ.
  compare: 'A cheap dehumidifier dries when you switch it on. This one decides when to dry.',
}

// The demo readout used by DataFlow. It is NOT the hero card (that is explicit
// markup), but it is live, so its values must obey the site's one risk vocabulary:
// Safe / Watch / Act. It previously carried three rooms and "Elevated" — the same
// contradiction that was removed from the hero, still shipping in this component.
export const APP_MOCK = {
  risk: 38,
  cap: 'Conditions steady',
  rooms: [
    { name: 'Closet', state: 'Safe' },
    { name: 'Dehumidifier', state: 'Standby' },
  ],
}

export const PROBLEM = {
  title: 'Damp rooms are easy to miss until they are hard to ignore.',
  lede: 'Condensation on the windows after wet weather. A cupboard that smells musty. A dehumidifier switched on by hand and forgotten. MoldGuard watches those conditions for you, so a small room stops depending on you remembering to check it.',
  bridge: 'MoldGuard does that work for you. It watches the room, scores the risk, and dries the air when needed, so you get an answer instead of a guess.',
  items: [
    { n: '01', title: 'The cupboard you do not open', body: 'Damp collects behind closed doors, where you notice it only once the smell or the stains arrive.' },
    { n: '02', title: 'Wet windows after wet weather', body: 'Condensation can linger on cold surfaces. Checking one humidity reading does not tell you how long damp conditions have lasted.' },
    { n: '03', title: 'Switching it on by hand', body: 'Manual switching leaves the timing to you. MoldGuard links its built-in dehumidifier to the room’s risk score.' },
    { n: '04', title: 'Not knowing while you are away', body: 'A long week at work or a trip away: the room keeps its own conditions, and you find out afterwards.' },
  ],
}

export const MEET = {
  // Explicit break: the auto-splitter cut mid-phrase into "See what takes / care
  // of the room.", which separated the verb from its object.
  title: 'See what takes care|of the room.',
  lede: 'One device senses the room, scores the risk and dehumidifies on its own. You own the hardware.',
  caption: 'MoldGuard Pod · tabletop or wall-mounted',
  stages: [
    { n: '01', title: 'The pod senses', body: 'Temperature and humidity, read continuously.' },
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
    { n: '01', title: 'Sense', items: ['Humidity', 'Temperature', 'Time damp'] },
    { n: '02', title: 'Score', items: ['Mold Risk Index', 'Exposure duration', 'Dew-point conditions'] },
    { n: '03', title: 'Act', items: ['Dehumidification', 'Alerts'] },
  ],
}

export const FEATURES = {
  title: 'What the room gets from it.',
  cta: { label: 'Explore the features', href: '/features' },
  items: [
    { n: '1', title: 'Know where the room stands', body: 'One Mold Risk Index turns humidity, temperature and how long conditions persist into a status you can act on, instead of a raw percentage.' },
    { n: '2', title: 'See when conditions need attention', body: 'Track humidity, temperature and how long those conditions persist, so you can respond to a changing room without waiting for visible signs.' },
    { n: '3', title: 'Let the device handle the response', body: 'When risk crosses the threshold the built-in thermoelectric dehumidifier starts, then stops once conditions return to range. No schedule to set.' },
    { n: '4', title: 'Look back instead of guessing', body: 'Humidity, temperature and dew-point history for the room, so you can see patterns and changes instead of relying on memory.' },
    { n: '5', title: 'Check in while you are away', body: 'Check live status, alerts and manual override in the companion app while the device is online, wherever you are.' },
    { n: '6', title: 'Buy it once', body: 'You pay for the hardware once. The device and its companion app keep working for the room you own.' },
  ],
}

export const OWN = {
  title: 'One device. One price. Yours to keep.',
  lede: 'One unit handles the monitoring and the drying. You buy the hardware once and keep using it.',
  price: {
    label: OFFER.priceLabel,
    figure: OFFER.price,
    note: OFFER.priceNote,
    terms: OFFER.terms,
    source: OFFER.source,
  },
  includesTitle: 'What the system consists of',
  includes: [
    { title: 'Room sensing', body: 'Humidity and temperature sensing, with the Mold Risk Index running on the device.' },
    { title: 'Automatic dehumidifier', body: 'Thermoelectric stack and fan that pull moisture from the air when risk rises.' },
    { title: 'Removable reservoir', body: 'A 1-litre tank collects the extracted water, with its fill level monitored.' },
    { title: 'Companion app', body: 'The app shows live status, alerts and manual control. It runs alongside the device; it does not work on its own.' },
  ],
  fitTitle: 'Is it a fit for your room?',
  fitYes: [
    'One small enclosed room: a cupboard, bathroom, basement or small bedroom',
    'You want the room handled without reading a meter by hand',
    'You would rather buy hardware once than pay a monitoring subscription',
  ],
  fitNo: [
    'You need whole-house or open-plan coverage. One device covers one small room.',
    'You have existing mold growth; that needs professional remediation, not a monitoring device',
  ],
  cta: OFFER.cta,
}

export const PLACEMENT = {
  title: 'Made for the rooms where mold actually starts.',
  lede: 'Place MoldGuard in a bathroom, closet, basement or small bedroom, near the humidity that feeds damp. It works on a tabletop or mounted on the wall. Suitability for your room is confirmed in the inquiry.',
  cta: { label: 'Placement & setup', href: '/how-it-works' },
  photoAlt: 'MoldGuard Pod · tabletop or wall-mounted',
}

export const CTA = {
  title: 'Take the guesswork out of one damp room.',
  lede: 'Request a quotation for your room. It covers the device, the price and what happens next.',
  primary: OFFER.cta,
  // Never a second contact link: this route already ends on /contact.
  secondary: { label: 'View the app', href: '/download' },
  downloadSecondary: { label: 'Request the app build', href: `mailto:${CONTACT.email}?subject=MoldGuard%20app%20build` },
}

export const CAPABILITIES = {
  title: 'Mold-specific intelligence, end to end.',
  lede: "Warm, humid rooms are mold's ideal habitat. A humidity reading alone does not show how long damp conditions have persisted. MoldGuard reads the full picture, humidity, temperature, exposure duration, and virtual dew point margin, adds weather foresight, and responds on its own.",
  blocks: [
    {
      n: '01',
      eyebrow: 'Mold Risk Index engine',
      body: 'Risk scoring uses humidity, temperature, how long those conditions last, and a surface dew-point estimate. It does not rely on one humidity threshold, so a brief spike does not set it off.',
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
  lede: 'Each one exists so a damp room stops depending on you checking it.',
  auto: {
    eyebrow: 'Automatic Dehumidification',
    title: 'It acts before you would.',
    body: 'When risk climbs, the dehumidifier starts. It stops once conditions return to a safe range, so you do not have to schedule it or remember to switch it off.',
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
    title: 'See which days caused the problem.',
    body: 'Humidity, temperature and dew-point trends are logged for the room, so you can look back at the week the damp started. One room per device; multi-room views are not part of this offer.',
    sample: 'Master Bedroom · 30 days',
    ranges: ['24 hours', '7 days', '30 days'],
  },
}

export const LOOP = {
  title: 'From invisible risk to handled, automatically.',
  lede: 'MoldGuard runs one continuous loop: monitor the room, analyze the real mold risk, respond on its own, and keep conditions in range while you get on with your week.',
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
      n: '02', kicker: 'ANALYZE', head: 'Turn readings into a risk score.',
      body: "The Mold Risk Index combines humidity, temperature, and how long those conditions persist, instead of reacting to a single humidity threshold. That's what makes the prediction early: it catches the window where mold can start, before it does. Outdoor forecast data sharpens that window further.",
      meta: 'Closet 82% RH · 26h sustained · Dew point margin −0.4°C',
    },
    {
      n: '03', kicker: 'RESPOND · AUTO', head: 'Act: dehumidify, no hands.',
      body: "When the index crosses the risk threshold, the thermoelectric stack starts and pulls moisture back down, closing the loop without you touching anything. Extracted water collects in a removable 1-litre reservoir, monitored so you're told before it's full.",
      meta: 'Dry air out · Dehumidifier running on auto',
    },
    {
      n: '04', kicker: 'PROTECT', head: 'Report: see the room while you are away.',
      body: 'Live status and history live in the companion app. The moment risk rises you get an alert, and the dehumidifier has already responded. When the device is online you can step in with manual override from wherever you are; locally, Bluetooth control keeps working without the internet.',
      meta: 'History, alerts, control · device online',
    },
  ],
}

export const SETUP = {
  title: 'Place it, connect it, let it run.',
  steps: [
    { n: '1', title: 'Place the unit', body: 'Tabletop or wall-mounted, near the humidity-prone area: a cupboard, bathroom, basement or small bedroom.' },
    { n: '2', title: 'Connect to WiFi', body: 'The device joins your home network and syncs to the companion app in real time.' },
    { n: '3', title: 'Let the loop run', body: "From here it's automatic. Check trends in the app, get alerts, empty the tank when it's full." },
  ],
  caption: 'Placed in the room, tabletop or wall-mount',
}

export const FAQ = {
  title: 'Before you request a quote.',
  items: [
    { q: 'What is MoldGuard?', a: 'A one-time-purchase device for one small enclosed room. It monitors humidity and temperature, scores a room-level Mold Risk Index, and runs a built-in thermoelectric dehumidifier automatically. The companion app shows status, alerts and control.' },
    { q: 'How does it detect mold risk?', a: 'It scores the conditions mold needs rather than looking for mold. The Mold Risk Index combines humidity, temperature and how long those conditions persist, instead of a single humidity threshold, plus a dew-point estimate for condensation on cold surfaces.' },
    { q: 'Is it a dehumidifier?', a: 'Yes. MoldGuard contains its own thermoelectric dehumidifier: when the index crosses its threshold it starts pulling moisture from the air, and stops once conditions return to range.' },
    { q: 'Why not just buy a cheap dehumidifier?', a: 'A dehumidifier dries when you switch it on. MoldGuard also decides when that should happen, using humidity, temperature and how long the room has stayed damp rather than one humidity reading. You are paying for the sensing and the automatic response in the same unit. If you only need a fan and a compressor on a manual switch, a cheaper unit covers that.' },
    { q: 'What about warranty and returns?', a: 'Warranty, returns and service coverage are set out in your written quotation before you commit, because they depend on the final build and where you are. Nothing is charged on this site, so you can review those terms first.' },
    { q: 'What does it cost to run?', a: 'Electricity to run the unit and the effort of emptying the 1-litre tank. There is no monitoring fee. Exact power draw depends on how often the dehumidifier runs, which depends on the room.' },
    { q: 'How long until I get it?', a: 'MoldGuard is built to order rather than shipped from stock. Your quotation confirms build time, delivery and any service coverage before you commit. No payment is taken on this site.' },
    { q: 'What does the app show?', a: 'Live status for the room: the readings behind the score, humidity and temperature history, alerts, and manual override when the device is online. The app is a companion to the device; monitoring and dehumidification run on the unit itself.' },
    { q: 'Can I monitor more than one room?', a: 'One MoldGuard is scoped to one small enclosed room. Multi-room and multi-unit views are not part of this offer; ask about multiple units in your quotation.' },
    { q: 'How do I set it up?', a: 'Place it tabletop or wall-mounted and pair it with the companion app on Wi-Fi. Local Bluetooth control is also part of the design. Ask the team to confirm placement, setup requirements and support for your room in the quotation.' },
    { q: 'What happens if the internet goes down?', a: 'The device keeps monitoring and dehumidifying on its own, and local Bluetooth control keeps working. Remote status, alerts and app control need the device online.' },
    { q: 'What maintenance does it need?', a: 'Emptying the removable 1-litre reservoir, whose fill level is monitored so you are told before it is full. The device uses electricity and needs regular tank emptying.' },
    { q: 'Does it work without the internet?', a: 'Local monitoring, the risk logic and dehumidification run on the device. Live status and history in the app, alerts, and remote override are the parts that need a connection.' },
    { q: 'How much does it cost?', a: 'It is \u20b19,994 once: one payment for the hardware, with no subscription and no monthly monitoring fee. Electricity and routine maintenance sit outside that one payment.' },
    { q: 'What room size does it handle?', a: 'It is intended for one small enclosed room such as a cupboard, bathroom, basement or small bedroom, and it is sized around that. Confirm suitability for your room in the inquiry; larger or open-plan spaces are outside scope.' },
    { q: 'Who is it for?', a: 'Renters and small property owners with one humidity-prone room, and anyone who would rather buy a device once than pay a monitoring subscription. It is not a mold clean-up service: existing growth needs professional remediation.' },
  ],
}

export const CONTACT_PAGE = {
  title: 'Request a quotation for your room.',
  lede: 'Tell us which room and how damp it gets. We reply with whether one unit suits it, and the next step.',
  formTitle: 'Tell us about the room.',
  directTitle: 'Prefer direct?',
  directNotes: [
    'Quotations and product questions, replies from the team.',
    'Call to talk through the room, the quote, or anything else.',
    'A quotation request is not an order.',
  ],
  app: {
    kicker: 'Just want the app?',
    body: 'The MoldGuard companion pairs with the device and shows live risk scores and alerts.',
    cta: 'Download →',
  },
  steps: {
    title: 'What happens after you reach out.',
    note: 'Price, availability and warranty are confirmed in writing before you commit. This site takes no payment.',
    items: [
      { n: '01', title: 'Tell us about the room', body: 'Which room, roughly how big, and where damp or condensation shows up. The form or a short call covers it.' },
      { n: '02', title: 'Suitability and quote', body: 'We confirm whether the room is in scope for one MoldGuard unit, and set out exactly what the \u20b19,994 covers.' },
      { n: '03', title: 'Agree the next steps', body: 'If it fits, availability and terms are confirmed in writing and we agree what happens next. Nothing is charged through this site.' },
    ],
  },
  teamTitle: 'One team. One loop.',
  teamLede: 'MoldGuard is built in house, across hardware, firmware, backend, frontend, design and QA.',
  closing: { title: 'Ready when you are.', primary: 'Request a quotation', secondary: 'Email us directly' },
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
  body: 'Push notifications as risk rises, so you can check a changing room while the device is online.',
}

export const AUTOMATIONS = {
  eyebrow: 'Automations',
  title: 'The rule is on the screen.',
  body: "The loop's decisions are visible, not hidden in a black box: the rule the system runs is written right on the screen.",
  rule: 'When Mold Risk Index crosses its threshold → Run the dehumidifier',
  note: 'Runs automatically. You can override when the device is online.',
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
      cost: 'Low initial cost; replacements may be needed.',
      drawbacks: 'No monitoring, no data, no automation.',
    },
    {
      option: 'Commercial dehumidifiers',
      does: 'Removes moisture; monitoring and controls vary by model.',
      cost: 'Mid-to-high retail hardware cost.',
      drawbacks: 'Check each model for risk scoring, alerts, remote access and capacity.',
    },
    {
      option: 'MoldGuard (ours)',
      does: 'Mold Risk Index (humidity + temperature + duration), predictive weather integration, closed-loop auto-dehumidification, water-tank monitoring, web + mobile dashboard.',
      cost: 'One-time hardware price.',
      drawbacks: 'One small room per device; needs a power source; periodic tank emptying.',
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
