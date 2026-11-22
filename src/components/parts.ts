/**
 * The 12 semantic components of public/moldguard.glb.
 *
 * Geometry source: final-3d.skp -> final-3d.glb, imported into Blender, the
 * 4.4 m room plane and 12 degenerate stretched Peltier instances removed, then
 * grouped by the components' real names and stood portrait.
 *
 * Source of truth: ~/Downloads/final-3d.skp, exported through three.js with the
 * 4.4 m room plane and the stray stretched Peltier instances dropped. The real
 * assembly is 278 meshes / 93 materials, 318 x 255 x 159 mm, base at y = 0.
 * Every `at` / `size` below is MEASURED from that export, not hand-guessed;
 * dump with ~/.hermes/cache/scratch/mg/dump-parts.cjs.
 */
export type PartId =
  | 'enclosure' | 'display' | 'controller' | 'sensor' | 'peltier' | 'heatsink'
  | 'fan' | 'relay' | 'buzzer' | 'audio' | 'usb' | 'misc'

export type Part = {
  id: PartId
  name: string
  what: string
  role: string
  /** world-space centre of the mesh, metres, glTF Y-up */
  at: [number, number, number]
  /** metres: x = width, y = height, z = depth */
  size: [number, number, number]
  /** which face of the model this part sits on, for hotspot placement */
  face: 'front' | 'side'
}

export const PARTS: Part[] = [
  {
    id: 'sensor', name: 'SHT41 sensor',
    what: 'SHT41 relative-humidity and temperature sensor, with the VL53L0X time-of-flight sensor beside it.',
    role: 'Two of the four Mold Risk Index inputs. Humidity and temperature are the core of the score, not a side reading.',
    at: [-0.0752, 0.154, -0.204], size: [0.0315, 0.0477, 0.1151],
    face: 'front',
  },
  {
    id: 'controller', name: 'ESP32-S3 N16R8',
    what: 'The ESP32-S3 N16R8 board that runs the risk engine and the automation rule.',
    role: 'Turns raw readings into a Mold Risk Index and decides when the dehumidifier should run.',
    at: [-0.0498, 0.19, -0.2285], size: [0.0048, 0.0224, 0.011],
    face: 'side',
  },
  {
    id: 'relay', name: '4-channel relay module',
    what: 'A single-channel relay board that switches the unit\u2019s own thermoelectric stack.',
    role: 'The part that makes the response physical: it closes the circuit so the stack actually runs.',
    at: [-0.0559, 0.1589, -0.2288], size: [0.0096, 0.0119, 0.0229],
    face: 'side',
  },
  {
    id: 'peltier', name: 'Thermoelectric stack',
    what: 'Peltier modules sandwiched between the heat exchangers.',
    role: 'The part that pulls moisture out of the air. It is why MoldGuard is a prevention system, not just a sensor.',
    at: [-0.19, 0.1453, -0.2233], size: [0.002, 0.0184, 0.106],
    face: 'side',
  },
  {
    id: 'heatsink', name: 'Heatsink',
    what: 'Extruded aluminium fins bonded to the Peltier stack.',
    role: 'Dissipates the heat the Peltier modules move. Without it the stack cannot condense efficiently.',
    at: [-0.1898, 0.1431, -0.2241], size: [0.0236, 0.0414, 0.1207],
    face: 'side',
  },
  {
    id: 'fan', name: 'Circulation fan',
    what: '80 mm axial fan drawing room air across the heatsink.',
    role: 'Keeps air moving over the stack so humidity is measured and treated in the room, not just at the sensor.',
    at: [-0.209, 0.1446, -0.2266], size: [0.0124, 0.0368, 0.1159],
    face: 'side',
  },
  {
    id: 'display', name: '16x2 LCD display',
    what: 'The unit\u2019s own readout on the front face.',
    role: 'Shows the current risk state and the automation rule on the device itself, not only in the app.',
    at: [-0.2178, 0.2172, -0.2307], size: [0.0094, 0.0301, 0.0853],
    face: 'front',
  },
  {
    id: 'buzzer', name: 'Buzzer',
    what: 'A small piezo buzzer on the board.',
    role: 'Gives the unit a local audible alert, so a risk event is noticeable in the room without the app.',
    at: [-0.2083, 0.195, -0.2115], size: [0.013, 0.014, 0.014],
    face: 'front',
  },
  {
    id: 'audio', name: 'Audio amplifier',
    what: 'Adafruit TPA2016D2 class-D stereo amplifier.',
    role: 'Drives the unit\u2019s speaker output for local alerts and spoken status.',
    at: [-0.0843, 0.1856, -0.1465], size: [0.0074, 0.0094, 0.0006],
    face: 'front',
  },
  {
    id: 'usb', name: 'USB service port',
    what: 'Micro-USB connector on the controller board.',
    role: 'Service and firmware access, so the device can be updated without opening it.',
    at: [-0.047, 0.1783, -0.2285], size: [0.0014, 0.0025, 0.0033],
    face: 'side',
  },
  {
    id: 'misc', name: 'Mounting & structure',
    what: 'Brackets, standoffs, jumpers and the remaining structural hardware.',
    role: 'Holds the stack together and keeps the electronics seated.',
    at: [-0.0607, 0.0957, -0.2246], size: [0.3035, 0.2207, 0.1453],
    face: 'front',
  },
  {
    id: 'enclosure', name: 'Enclosure panels',
    what: 'The front and rear panels that form the body, with the vents and the mounting points.',
    role: 'Holds every other part in place. Tabletop or wall-mounted, it is the shell the whole loop lives inside.',
    at: [-0.0625, 0.1125, -0.2259], size: [0.3153, 0.255, 0.1588],
    face: 'front',
  },
]

export const PART_BY_ID = Object.fromEntries(PARTS.map((p) => [p.id, p])) as Record<PartId, Part>

/**
 * Display numbers, derived from position in PARTS so the pins on the model and
 * the legend can never disagree with the list. Zero-padded to match the list.
 */
export const PART_NO: Record<PartId, string> = Object.fromEntries(
  PARTS.map((p, i) => [p.id, String(i + 1).padStart(2, '0')]),
) as Record<PartId, string>

/** Cross-validated overall size, metres: width x height x depth. */
export const MODEL_SIZE: [number, number, number] = [0.3177, 0.255, 0.159]

/** The documented journey: what happens in the order the product does it. */
export const TOUR: PartId[] = [
  'sensor',      // 01 sense the room
  'controller',  // 02 score the risk
  'relay',       // 03 switch the dehumidifier
  'peltier',     // 04 pull the moisture out
  'heatsink',    // 05 reject the heat
  'fan',         // 06 move the air
  'display',     // 07 show the state
  'enclosure',   // 08 the body it all lives in
]
