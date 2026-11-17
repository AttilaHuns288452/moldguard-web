/**
 * Single source of truth for every claim on this site.
 * Derived from MoldGuard.pdf (the team's own proposal deck). Nothing here is
 * invented: if a fact is not in the deck it does not appear on the site.
 */

export const CONTACT = {
  email: 'moldguard.dev.team@gmail.com',
  phone: '0992 543 0608',
  phoneHref: '+639925430608',
  year: 2026,
}

export const LOOP = [
  {
    id: 'sense',
    index: '01',
    name: 'Sense',
    head: 'Sense the room, continuously.',
    body:
      'A compact sensor pod watches the conditions mold actually cares about: relative humidity, temperature, and volatile organic compounds. Humidity and temperature feed the risk engine’s core inputs. VOCs add context, read together with everything else rather than as a verdict.',
    meta: 'Readings stream in around the clock',
  },
  {
    id: 'analyze',
    index: '02',
    name: 'Analyze',
    head: 'Score the risk, not just a number.',
    body:
      'The Mold Risk Index combines humidity, temperature, and how long those conditions persist, instead of reacting to a single humidity threshold. That is what makes the prediction early: it catches the window where mold can start, before it does. Outdoor forecast data sharpens that window further.',
    meta: 'Mold Risk Index engine',
  },
  {
    id: 'respond',
    index: '03',
    name: 'Respond',
    head: 'Act: dehumidify, no hands.',
    body:
      'When the index crosses the risk threshold, MoldGuard switches the connected dehumidifier on and pulls moisture back down, closing the loop without you touching anything. Extracted water collects in the removable 1 L tank, monitored so you are told before it is full.',
    meta: 'Dehumidifier running on auto',
  },
  {
    id: 'protect',
    index: '04',
    name: 'Protect',
    head: 'Report: see everything, anywhere.',
    body:
      'Live status and full history live in the app and web dashboard. The moment risk rises, you get an alert, and the dehumidifier has already responded. You can step in with manual override from anywhere, any time.',
    meta: 'App + web dashboard',
  },
]

export const RISK_FACTORS = [
  { label: 'Relative humidity', note: 'Core input' },
  { label: 'Temperature', note: 'Core input' },
  { label: 'Sustained exposure', note: 'How long conditions persist' },
  { label: 'Virtual surface dew-point margin', note: 'Condensation headroom' },
  { label: 'Weather forecast', note: 'Additional context' },
  { label: 'VOC / air quality', note: 'Supplementary context only' },
]

export const FEATURES = [
  {
    id: 'engine',
    title: 'Mold Risk Index engine',
    lead: 'Real-time risk scoring built from humidity, temperature, and sustained exposure duration, with a virtual surface dew-point calculation. It goes beyond the single-threshold triggers used by commercial dehumidifiers and avoids false triggers during temporary humidity spikes.',
    kind: 'primary',
  },
  {
    id: 'sensors',
    title: 'Environmental & VOC monitoring',
    lead: 'Temperature, humidity, and air quality measured together, continuously, so the risk score is built on the full picture, not one input.',
    note: 'We treat VOC as context, never standalone proof: research shows microbial VOC levels are often too low for reliable detection and easily confounded by household sources.',
  },
  {
    id: 'auto',
    title: 'Automatic dehumidification',
    lead: 'When risk climbs, the dehumidifier switches itself on, and off again once conditions return to safe range. The loop closes with no manual action, no scheduling, no remembering.',
  },
  {
    id: 'analytics',
    title: 'Analytics & history',
    lead: 'Look back at any room, any week. Humidity, temperature, and dew-point trends are logged over time, with multi-room and multi-unit views for larger households, dormitories, or property managers.',
  },
  {
    id: 'alerts',
    title: 'Alerts',
    lead: 'Real-time push notifications as risk rises, so a room never waits for you to check on it.',
  },
  {
    id: 'automations',
    title: 'Automations',
    lead: 'The loop’s decisions are visible, not hidden in a black box: the rule the system runs is written right on the screen. Runs automatically. You can override any time from the app.',
  },
]

export const COMPARISON = [
  {
    option: 'Passive moisture absorbers',
    does: 'Chemical moisture absorption, no sensors',
    cost: 'Low one-time cost',
    drawback: 'No monitoring, no data, no automation',
  },
  {
    option: 'Commercial dehumidifiers',
    does: 'App-controlled humidity threshold triggers',
    cost: 'Mid-to-high retail hardware cost',
    drawback: 'No mold-specific modeling; locked to vendor app; no web dashboard',
  },
  {
    option: 'MoldGuard V1.0',
    does:
      'Mold Risk Index (humidity + temperature + duration), supplementary VOC context, predictive weather integration, closed-loop auto-dehumidification, water-tank monitoring, web + mobile dashboard',
    cost: 'Fixed development fee',
    drawback: 'Requires dedicated power source; periodic water-tank emptying',
    ours: true,
  },
]

export const STEPS = [
  { n: '1', title: 'Place the unit', body: 'Tabletop or wall-mounted, near humidity-prone areas: bathrooms, closets, basements.' },
  { n: '2', title: 'Connect to WiFi', body: 'The device joins your home network and syncs to the dashboard in real time.' },
  { n: '3', title: 'Watch the loop run', body: 'From here it is automatic. Check trends in the dashboard, get alerts in the app, empty the tank when it is full.' },
]

export const OWNERSHIP = [
  { title: 'Itemized hardware', body: 'Components sourced individually, listed line by line, not bundled into a black box.' },
  { title: 'One development fee', body: 'Built and delivered for a fixed cost. No recurring monitoring subscription.' },
  { title: 'Full ownership', body: 'No proprietary ecosystem. The build is yours once handed over.' },
  { title: 'Around your dehumidifier', body: 'The unit is designed around a dehumidifier selected for the setup, not the reverse.' },
]

export const PLACEMENT = [
  { room: 'Bathrooms', note: 'Steam, splashing, and cold surfaces meet every day.' },
  { room: 'Closets', note: 'Enclosed, unventilated, and easy to forget for months.' },
  { room: 'Basements', note: 'Cool walls, ground moisture, and weak airflow.' },
  { room: 'Humidity-prone rooms', note: 'Anywhere warm air meets a cold surface.' },
]

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

/** Questions the deck raises. Answers are constrained to what the deck establishes. */
export const FAQ = [
  {
    q: 'What is MoldGuard?',
    a: 'An IoT mold-risk prevention and detection system. A compact sensor pod watches a room, runs a Mold Risk Index over those readings, and closes the loop by switching a connected dehumidifier on and off. Live readings and history are in the app and web dashboard.',
  },
  {
    q: 'How does it detect mold risk?',
    a: 'It does not look for mold directly. It scores the conditions mold needs: relative humidity, temperature, and how long those conditions persist, plus a virtual surface dew-point margin so condensation headroom is part of the score. Outdoor forecast data is additional context. VOC readings are supplementary context, never standalone proof.',
  },
  {
    q: 'Does it control a dehumidifier?',
    a: 'Yes. When the index crosses the risk threshold the connected dehumidifier is switched on automatically, and switched off again once conditions return to a safe range. You can override at any time from the app.',
  },
  {
    q: 'What does the app show?',
    a: 'Live room status, current environmental readings, the risk state, humidity / temperature / dew-point trends over 24 hours, 7 days, or 30 days, the automation rule that is currently running, and alerts as risk rises.',
  },
  {
    q: 'Can I monitor more than one room?',
    a: 'Yes. Multi-room and multi-unit views are part of the design, aimed at larger households, dormitories, and property managers.',
  },
  {
    q: 'How do I set it up?',
    a: 'Three steps: place the unit (tabletop or wall-mounted, near a humidity-prone area), connect it to WiFi, and let the loop run. Installation and handover can be handled on-site or remotely, with training and documentation.',
  },
  {
    q: 'What maintenance does it need?',
    a: 'Emptying the removable 1 L water tank that collects the extracted moisture. The tank is monitored, so you are told before it is full. The unit needs a dedicated power source.',
  },
  {
    q: 'Does it work without the internet?',
    a: 'The loop itself runs on the device and its connected dehumidifier, so dehumidification is not dependent on a screen being open. Live dashboards, history, weather context, and push alerts are the parts that travel over the network. The team can confirm the exact offline behaviour for your setup.',
  },
  {
    q: 'How much does it cost?',
    a: 'MoldGuard is a fixed-cost build rather than a subscription: itemized hardware, one development fee, and full ownership with no recurring monitoring fee. Because the hardware list depends on your space, the team quotes per installation.',
  },
  {
    q: 'Who is it for?',
    a: 'Homes, dormitories, and property managers who have humidity-prone rooms and want the risk handled rather than merely displayed: bathrooms, closets, basements, and anywhere warm air meets a cold surface.',
  },
]
