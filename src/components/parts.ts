/**
 * The 12 semantic components of public/moldguard.glb.
 *
 * Geometry source: final-3d.skp -> final-3d.glb, imported into Blender, the
 * 4.4 m room plane and 12 degenerate stretched Peltier instances removed, then
 * grouped by the components' real names and stood portrait.
 *
 * Cross-validated size: 317 x 158 x 254 mm (W x D x H), standing upright with
 * the base at y = 0. Every `at` / `size` below is dumped from the exported
 * GLB's world matrices in three.js Y-up metres. Do not hand-edit them: rerun
 * ~/.hermes/cache/scratch/dump_xform.py instead.
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
    id: 'enclosure', name: 'Enclosure panels',
    what: 'The front and rear panels that form the body, with the vents and the mounting points.',
    role: 'Holds every other part in place. Tabletop or wall-mounted, it is the shell the whole loop lives inside.',
    at: [0.0, 0.1271, 0.0], size: [0.3168, 0.2543, 0.1585],
    face: 'front',
  },
  {
    id: 'display', name: 'Status display',
    what: 'The unit\u2019s own readout on the front face.',
    role: 'Shows the current risk state and the automation rule on the device itself, not only in the app.',
    at: [-0.1537, 0.2315, -0.0049], size: [0.0094, 0.03, 0.085],
    face: 'front',
  },
  {
    id: 'sensor', name: 'Humidity & temperature sensor',
    what: 'DHT11 relative-humidity and temperature sensor, with the VL53L0X time-of-flight sensor beside it.',
    role: 'Two of the four Mold Risk Index inputs. Humidity and temperature are the core of the score, not a side reading.',
    at: [-0.0115, 0.1685, 0.0217], size: [0.0314, 0.0476, 0.1148],
    face: 'front',
  },
  {
    id: 'controller', name: 'ESP32 controller',
    what: 'The ESP32 board that runs the risk engine and the automation rule.',
    role: 'Turns raw readings into a Mold Risk Index and decides when the dehumidifier should run.',
    at: [0.0139, 0.2044, -0.0028], size: [0.0047, 0.0223, 0.011],
    face: 'side',
  },
  {
    id: 'relay', name: 'Relay module',
    what: 'A single-channel relay board that switches the connected dehumidifier.',
    role: 'The part that makes the response physical: it closes the circuit so the dehumidifier actually runs.',
    at: [0.0078, 0.1734, -0.0031], size: [0.0096, 0.0119, 0.0229],
    face: 'side',
  },
  {
    id: 'peltier', name: 'Thermoelectric stack',
    what: 'Peltier modules sandwiched between the heat exchangers.',
    role: 'The part that pulls moisture out of the air. It is why MoldGuard is a prevention system, not just a sensor.',
    at: [-0.1259, 0.1598, 0.0025], size: [0.002, 0.0183, 0.1057],
    face: 'side',
  },
  {
    id: 'heatsink', name: 'Heatsink',
    what: 'Extruded aluminium fins bonded to the Peltier stack.',
    role: 'Dissipates the heat the Peltier modules move. Without it the stack cannot condense efficiently.',
    at: [-0.1258, 0.1577, 0.0016], size: [0.0235, 0.0412, 0.1203],
    face: 'side',
  },
  {
    id: 'fan', name: 'Circulation fan',
    what: '80 mm axial fan drawing room air across the heatsink.',
    role: 'Keeps air moving over the stack so humidity is measured and treated in the room, not just at the sensor.',
    at: [-0.1449, 0.1591, -0.0008], size: [0.0124, 0.0367, 0.1155],
    face: 'side',
  },
  {
    id: 'buzzer', name: 'Buzzer',
    what: 'A small piezo buzzer on the board.',
    role: 'Gives the unit a local audible alert, so a risk event is noticeable in the room without the app.',
    at: [-0.1442, 0.2094, 0.0142], size: [0.013, 0.014, 0.014],
    face: 'front',
  },
  {
    id: 'audio', name: 'Audio amplifier',
    what: 'Adafruit TPA2016D2 class-D stereo amplifier.',
    role: 'Drives the unit\u2019s speaker output for local alerts and spoken status.',
    at: [-0.0206, 0.2001, 0.079], size: [0.0074, 0.0094, 0.0005],
    face: 'front',
  },
  {
    id: 'usb', name: 'USB service port',
    what: 'Micro-USB connector on the controller board.',
    role: 'Service and firmware access, so the device can be updated without opening it.',
    at: [0.0167, 0.1927, -0.0027], size: [0.0014, 0.0025, 0.0033],
    face: 'side',
  },
  {
    id: 'misc', name: 'Mounting & structure',
    what: 'Brackets, standoffs, jumpers and the remaining structural hardware.',
    role: 'Holds the stack together and keeps the electronics seated.',
    at: [-0.0003, 0.1273, -0.0017], size: [0.3091, 0.2539, 0.1544],
    face: 'front',
  },
]

export const PART_BY_ID = Object.fromEntries(PARTS.map((p) => [p.id, p])) as Record<PartId, Part>

/** Cross-validated overall size, metres: width x height x depth. */
export const MODEL_SIZE: [number, number, number] = [0.3168, 0.2542, 0.1585]

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
