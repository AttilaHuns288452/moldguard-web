/**
 * Single source of truth for every claim on this site.
 * Copy is ported verbatim from the approved promo site
 * (attilahuns288452.github.io/moldguard-promo-site) and traces to MoldGuard.pdf.
 */

export const CONTACT = {
  email: 'moldguard.dev.team@gmail.com',
  phone: '0992 543 0608',
  phoneHref: '+639925430608',
  year: 2026,
}

/** Hero: the approved headline and lede. */
export const HERO = {
  cat: 'IoT mold risk prevention & detection',
  /* the approved rag: three full lines, no orphan word */
  titleLines: ['Know mold is', 'coming before', 'it shows.'],
  lede:
    'MoldGuard watches humidity, temperature and air conditions. It scores your mold risk in real time and activates a connected dehumidifier when conditions become unsafe.',
  primary: { label: 'Get Started', href: '/contact' },
  secondary: { label: 'See how it works', href: '/how-it-works' },
}

/** Hero app mock (approved values, illustrative). */
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
  lede: 'One device senses the room. One system understands it. When risk rises, it responds on its own.',
  caption: 'MoldGuard Pod · tabletop or wall-mounted',
  stages: [
    { n: '01', title: 'The pod senses', body: 'Temperature, humidity and air quality, continuously.' },
    { n: '02', title: 'The system understands', body: 'Readings become an environmental picture of the room.' },
    { n: '03', title: 'The system flags risk', body: 'A single Mold Risk Index, updated in real time.' },
    { n: '04', title: 'The system responds', body: 'The dehumidifier switches itself on and back off.' },
  ],
  flowLede:
    'MoldGuard monitors indoor conditions, identifies increasing mold or condensation risk, and can automatically control dehumidification.',
  flowNote: 'Illustrative demo data.',
}

export const SENSE_SCORE_ACT = {
  title: 'Sense. Score. Act.',
  cta: { label: 'Full walkthrough', href: '/how-it-works' },
  steps: [
    { n: '01', title: 'Sense', items: ['Humidity', 'Temperature', 'Air quality'] },
    { n: '02', title: 'Score', items: ['Mold Risk Index', 'Exposure duration', 'Dew-point conditions'] },
    { n: '03', title: 'Act', items: ['Dehumidification', 'Alerts', 'Manual override'] },
  ],
}

export const FEATURES = {
  title: 'Built for mold, not just moisture.',
  cta: { label: 'Explore the features', href: '/features' },
  items: [
    { n: '1', title: 'Mold Risk Index Engine', body: 'Risk scoring based on humidity, temperature and exposure duration.' },
    { n: '2', title: 'Early Detection', body: 'VOC sensing helps identify developing microbial conditions before visible signs.' },
    { n: '3', title: 'Auto-Dehumidification', body: 'Responds automatically when risk rises.' },
    { n: '4', title: 'Dashboard & Analytics', body: 'Historical trends and multi-room visibility.' },
    { n: '5', title: 'Mobile Alerts & Control', body: 'Know when something changes and act remotely.' },
    { n: '6', title: 'No Recurring Subscription', body: 'Own the system without monthly monitoring fees.' },
  ],
}

export const OWN = {
  title: "Own it, don't rent it.",
  lede: 'Standard, individually sourced parts built around a dehumidifier you choose. The system is yours, with no proprietary ecosystem.',
  points: [
    { title: 'Open hardware', body: 'Individually sourced, standard parts.' },
    { title: 'Fixed cost', body: 'One development cost, no monthly fees.' },
    { title: 'Your system', body: 'Works with your own dehumidifier.' },
  ],
}

export const PLACEMENT = {
  title: 'Made for the rooms where mold actually starts.',
  lede:
    'Place MoldGuard in bathrooms, closets, and basements, near the humidity that feeds growth. It works on a tabletop or mounted on the wall.',
  cta: { label: 'Placement & setup', href: '/how-it-works' },
  photoAlt: 'MoldGuard Pod on a bathroom vanity, monitoring humidity near the shower',
}

export const CTA = {
  title: 'Protect your space before mold appears.',
  lede: 'Tell us about your rooms and we will come back with a hardware list and a price.',
  primary: { label: 'Request a quotation', href: '/contact' },
  secondary: { label: 'See how it works', href: '/how-it-works' },
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

export const FAQ = [
  {
    q: 'What is MoldGuard?',
    a: 'An IoT mold-risk prevention and detection system. A compact sensor pod watches a room, runs a Mold Risk Index over those readings, and closes the loop by switching a connected dehumidifier on and off. Live readings and history are in the app and web dashboard.',
  },
  {
    q: 'How does it detect mold risk?',
    a: 'It does not look for mold directly. It scores the conditions mold needs: relative humidity, temperature, and how long those conditions persist, plus a virtual surface dew-point margin so condensation headroom is part of the score. VOC readings are supplementary context, never standalone proof.',
  },
  {
    q: 'Does it control a dehumidifier?',
    a: 'Yes. When the index crosses the risk threshold the connected dehumidifier is switched on automatically, and switched off again once conditions return to a safe range.',
  },
  {
    q: 'What does the app show?',
    a: 'Live room status, current environmental readings, the risk state, humidity / temperature / dew-point trends, the automation rule that is currently running, and alerts as risk rises.',
  },
  {
    q: 'Can I monitor more than one room?',
    a: 'Yes. Multi-room and multi-unit views are part of the design, aimed at larger households, dormitories, and property managers.',
  },
  {
    q: 'How do I set it up?',
    a: 'Place the unit (tabletop or wall-mounted, near a humidity-prone area), connect it to WiFi, and let the loop run.',
  },
  {
    q: 'What maintenance does it need?',
    a: 'Emptying the removable 1 L water tank that collects the extracted moisture. The tank is monitored, so you are told before it is full.',
  },
  {
    q: 'How much does it cost?',
    a: 'MoldGuard is a fixed-cost build rather than a subscription: itemized hardware, one development fee, and full ownership with no recurring monitoring fee.',
  },
  {
    q: 'Who is it for?',
    a: 'Homes, dormitories, and property managers who have humidity-prone rooms and want the risk handled rather than merely displayed.',
  },
]

/** The offer, stated plainly. The deck publishes a fixed one-time cost model but
 *  not a number, so the page states the model and routes to a quotation rather
 *  than inventing a price. */
export const OFFER = {
  title: 'What you are buying',
  lede: 'One unit, one fixed development cost, no monitoring subscription. The hardware is itemized line by line, so nothing is hidden inside a bundle.',
  included: [
    { k: 'The MoldGuard pod', v: 'Sensor unit, ready to monitor' },
    { k: 'Dashboard + app', v: 'Live risk, history, alerts, override' },
    { k: 'Automation', v: 'Runs your connected dehumidifier, not ours' },
    { k: 'Installation', v: 'On-site or remote, with handover' },
  ],
  notIncluded: [
    'We do not supply the dehumidifier — you pick one and we build around it',
  ],
  price: {
    model: 'One-time cost',
    note: 'Fixed for the hardware you need. Quoted per installation, because the room count sets the hardware list, and that list is itemized before you commit.',
    promise: 'No monthly monitoring fee, ever.',
    cta: { label: 'Request a quotation', href: '/contact' },
  },
}

/** Authority signals. Every number here is countable from the project itself:
 *  the roster in the PDF, and the sensor set the build actually specifies. */
export const CREDIBILITY = [
  { k: 'Fixed', label: 'one-time cost', note: 'No monitoring subscription, ever' },
  { k: 'Itemized', label: 'hardware list', note: 'Sourced part by part, nothing bundled' },
  { k: 'Yours', label: 'the system', note: 'No proprietary ecosystem after handover' },
  { k: 'Local', label: 'loop on-device', note: 'Dehumidification does not need a screen open' },
]
