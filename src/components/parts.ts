/**
 * The 12 semantic components of public/moldguard.glb, with positions read from
 * the file's own node transforms (glTF Y-up, metres) and descriptions grounded
 * in the components' real identities and the PDF's capability list.
 *
 * Nothing here is invented: each `what` names the actual part, and each `role`
 * is the documented job that part performs in the loop.
 */
export type PartId =
  | 'chassis' | 'peltier' | 'heatsink' | 'fan' | 'display'
  | 'relay' | 'brakesp32' | 'dht11' | 'tof' | 'usb' | 'buzzer' | 'audio'

export type Part = {
  id: PartId
  name: string
  what: string
  role: string
  /** world-space centre of the mesh, metres, glTF Y-up */
  at: [number, number, number]
  /** metres */
  size: [number, number, number]
  count?: number
}

export const PARTS: Part[] = [
  {
    id: 'chassis', name: 'Enclosure & control head',
    what: 'The structural body that carries the display, the sensors and the relay board.',
    role: 'Holds the electronics the loop is built on. Everything else mounts to it.',
    at: [0.001, 0.744, 0.019], size: [0.314, 0.158, 0.254],
  },
  {
    id: 'peltier', name: 'Thermoelectric stack', count: 6,
    what: 'Six Peltier modules forming the column that runs the height of the unit.',
    role: 'This is the part that actually pulls moisture out of the air. It is why MoldGuard is a prevention system, not just a sensor.',
    at: [-0.126, 0.4, -0.075], size: [0.002, 0.799, 0.141],
  },
  {
    id: 'heatsink', name: 'Heatsink',
    what: 'Extruded aluminium fins bonded to the Peltier stack.',
    role: 'Dissipates the heat the Peltier modules move. Without it the stack cannot condense efficiently.',
    at: [-0.126, 0.745, -0.012], size: [0.024, 0.12, 0.041],
  },
  {
    id: 'fan', name: 'Circulation fan',
    what: '80 mm axial fan drawing room air across the heatsink.',
    role: 'Keeps air moving over the stack so humidity is measured and treated in the room, not just at the sensor.',
    at: [-0.145, 0.743, -0.013], size: [0.012, 0.116, 0.037],
  },
  {
    id: 'display', name: 'Status display',
    what: 'The unit\'s own readout.',
    role: 'Shows the current risk state and the automation rule on the device itself, not only in the app.',
    at: [-0.154, 0.739, -0.086], size: [0.009, 0.085, 0.03],
  },
  {
    id: 'dht11', name: 'Humidity & temperature sensor',
    what: 'DHT11 combined relative-humidity and temperature sensor.',
    role: 'Two of the four Mold Risk Index inputs. Humidity and temperature are the core of the score, not a side reading.',
    at: [-0.021, 0.82, -0.035], size: [0.012, 0.006, 0.022],
  },
  {
    id: 'tof', name: 'Time-of-flight sensor',
    what: 'VL53L0X laser range sensor.',
    role: 'Measures surface distance — the proximity input that informs the dew-point margin calculation.',
    at: [0.002, 0.711, 0.001], size: [0.005, 0.006, 0.001],
  },
  {
    id: 'brakesp32', name: 'ESP32 controller',
    what: 'The microcontroller that runs the risk engine on-device.',
    role: 'Scores the Mold Risk Index and decides when the dehumidifier runs. The loop keeps working when no screen is open.',
    at: [0.014, 0.741, -0.058], size: [0.005, 0.011, 0.022],
  },
  {
    id: 'relay', name: 'Relay module',
    what: 'Single-channel relay board, 115 individual parts on the assembly.',
    role: 'The switching element: this is what physically turns a connected dehumidifier on and off.',
    at: [0.008, 0.741, -0.028], size: [0.01, 0.023, 0.012],
    count: 115,
  },
  {
    id: 'buzzer', name: 'Buzzer',
    what: 'On-device audible alert.',
    role: 'Raises a local warning as risk climbs, for the room you are standing in rather than the phone in your pocket.',
    at: [-0.144, 0.758, -0.063], size: [0.013, 0.014, 0.014],
  },
  {
    id: 'audio', name: 'Stereo amplifier',
    what: 'Adafruit TPA2016D2 class-D amplifier.',
    role: 'Drives the audio feedback the unit gives during setup and alerts.',
    at: [-0.021, 0.823, -0.054], size: [0.007, 0.001, 0.009],
  },
  {
    id: 'usb', name: 'USB service port',
    what: 'Micro-USB connector for service and firmware.',
    role: 'Access point for firmware updates and diagnostics — the OTA path runs from here.',
    at: [0.017, 0.741, -0.047], size: [0.001, 0.003, 0.002],
  },
]

export const PART_BY_ID = Object.fromEntries(PARTS.map((p) => [p.id, p])) as Record<PartId, Part>

/** The documented journey: what happens in the order the product does it. */
export const TOUR: PartId[] = ['dht11', 'tof', 'brakesp32', 'display', 'relay', 'peltier', 'heatsink', 'fan']
