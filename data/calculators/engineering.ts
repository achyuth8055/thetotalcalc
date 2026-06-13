// Engine-driven engineering, physics, and programming calculators.
// Each definition is pure data (an Expr AST) rendered generically by the
// DynamicCalculator component - no per-calculator UI. Units are chosen so the
// headline numbers stay human-readable (e.g. kilohms x microfarads = ms).

import type { CalculatorDefinition } from "@/lib/engine/types";

const TWO_PI = 6.283185307;
const C_MHZ_M = 299.792458; // speed of light expressed so MHz x metres works: lambda = c / f

// ---------------------------------------------------------------------------
// 1. Voltage Divider (electronics)
// ---------------------------------------------------------------------------
export const voltageDivider: CalculatorDefinition = {
  id: "voltage-divider",
  type: "estimate",
  region: "US",
  jurisdictionLevel: "federal",
  category: "engineering",
  slug: "voltage-divider",
  title: "Voltage Divider Calculator",
  description:
    "Find the output voltage of a two-resistor divider from the input voltage and resistor values using Vout = Vin x R2 / (R1 + R2).",
  inputs: [
    { name: "vin", label: "Input voltage Vin (V)", type: "number", default: 9, min: 0, max: 1000000, step: 0.1, required: true },
    { name: "r1", label: "R1 - top resistor (Ohms)", type: "number", default: 1000, min: 0.0001, max: 100000000, step: 1, required: true },
    { name: "r2", label: "R2 - bottom resistor (Ohms)", type: "number", default: 2000, min: 0.0001, max: 100000000, step: 1, required: true },
  ],
  derived: [
    { name: "vout", expr: { op: "*", args: [{ var: "vin" }, { op: "/", args: [{ var: "r2" }, { op: "+", args: [{ var: "r1" }, { var: "r2" }] }] }] } },
    { name: "vdrop", expr: { op: "-", args: [{ var: "vin" }, { var: "vout" }] } },
    { name: "ratio", expr: { op: "/", args: [{ var: "r2" }, { op: "+", args: [{ var: "r1" }, { var: "r2" }] }] } },
  ],
  outputs: [
    { name: "vout", label: "Output voltage Vout (V)", expr: { var: "vout" }, format: "number", primary: true },
    { name: "vdrop", label: "Voltage dropped across R1 (V)", expr: { var: "vdrop" }, format: "number" },
    { name: "ratio", label: "Divider ratio (Vout / Vin)", expr: { var: "ratio" }, format: "number" },
  ],
  sources: [{ title: "Voltage divider", url: "https://en.wikipedia.org/wiki/Voltage_divider", publisher: "Reference", retrieved: "2026-06-11" }],
  disclaimer: "For educational use. The formula assumes an ideal, unloaded divider; any real load on Vout draws current and pulls the output lower.",
  version: "1.0.0",
  effectiveYear: 2026,
  lastVerified: "2026-06-11",
  tests: [
    { name: "9V across 1k/2k", inputs: { vin: 9, r1: 1000, r2: 2000 }, expect: { vout: 6, vdrop: 3 } },
    { name: "5V equal divider", inputs: { vin: 5, r1: 1000, r2: 1000 }, expect: { vout: 2.5 } },
  ],
};

// ---------------------------------------------------------------------------
// 2. LED Series Resistor (electronics)
// ---------------------------------------------------------------------------
export const ledResistor: CalculatorDefinition = {
  id: "led-resistor",
  type: "estimate",
  region: "US",
  jurisdictionLevel: "federal",
  category: "engineering",
  slug: "led-resistor",
  title: "LED Resistor Calculator",
  description:
    "Size the series resistor for an LED from the supply voltage, LED forward voltage, and target current using R = (Vsupply - Vforward) / I.",
  inputs: [
    { name: "supplyV", label: "Supply voltage (V)", type: "number", default: 9, min: 0, max: 1000, step: 0.1, required: true },
    { name: "ledV", label: "LED forward voltage (V)", type: "number", default: 2, min: 0, max: 1000, step: 0.1, required: true },
    { name: "ledCurrent", label: "LED current (mA)", type: "number", default: 20, min: 0.0001, max: 100000, step: 1, required: true },
  ],
  derived: [
    { name: "headroom", expr: { op: "-", args: [{ var: "supplyV" }, { var: "ledV" }] } },
    { name: "currentA", expr: { op: "/", args: [{ var: "ledCurrent" }, 1000] } },
    { name: "resistance", expr: { op: "/", args: [{ var: "headroom" }, { var: "currentA" }] } },
    { name: "resistorPowerMw", expr: { op: "*", args: [{ var: "headroom" }, { var: "ledCurrent" }] } },
  ],
  outputs: [
    { name: "resistance", label: "Series resistor (Ohms)", expr: { var: "resistance" }, format: "number", primary: true },
    { name: "resistorPowerMw", label: "Power in resistor (mW)", expr: { var: "resistorPowerMw" }, format: "number" },
    { name: "headroom", label: "Voltage across resistor (V)", expr: { var: "headroom" }, format: "number" },
  ],
  sources: [{ title: "LED circuit", url: "https://en.wikipedia.org/wiki/LED_circuit", publisher: "Reference", retrieved: "2026-06-11" }],
  disclaimer: "For educational use. Choose the next standard resistor value at or above the result, and a power rating well above the figure shown.",
  version: "1.0.0",
  effectiveYear: 2026,
  lastVerified: "2026-06-11",
  tests: [
    { name: "9V red LED at 20mA", inputs: { supplyV: 9, ledV: 2, ledCurrent: 20 }, expect: { resistance: 350, resistorPowerMw: 140 } },
    { name: "5V LED at 10mA", inputs: { supplyV: 5, ledV: 2, ledCurrent: 10 }, expect: { resistance: 300 } },
  ],
};

// ---------------------------------------------------------------------------
// 3. RC Time Constant / Filter Cutoff (electronics)
// ---------------------------------------------------------------------------
export const rcTimeConstant: CalculatorDefinition = {
  id: "rc-time-constant",
  type: "estimate",
  region: "US",
  jurisdictionLevel: "federal",
  category: "engineering",
  slug: "rc-time-constant",
  title: "RC Time Constant Calculator",
  description:
    "Work out the time constant, charge time, and filter cutoff frequency of an RC circuit from resistance and capacitance (tau = R x C).",
  inputs: [
    { name: "resistance", label: "Resistance (kOhms)", type: "number", default: 10, min: 0.0001, max: 1000000, step: 0.1, required: true },
    { name: "capacitance", label: "Capacitance (microfarads, uF)", type: "number", default: 1, min: 0.0000001, max: 1000000, step: 0.1, required: true },
  ],
  derived: [
    // kOhms x uF gives milliseconds directly.
    { name: "tauMs", expr: { op: "*", args: [{ var: "resistance" }, { var: "capacitance" }] } },
    { name: "t5Ms", expr: { op: "*", args: [5, { var: "tauMs" }] } },
    // fc = 1 / (2 pi R C); with R in kOhms and C in uF the 1e-3 product gives Hz after scaling by 1000.
    { name: "cutoffHz", expr: { op: "/", args: [1000, { op: "*", args: [TWO_PI, { var: "resistance" }, { var: "capacitance" }] }] } },
  ],
  outputs: [
    { name: "tauMs", label: "Time constant tau (ms)", expr: { var: "tauMs" }, format: "number", primary: true },
    { name: "t5Ms", label: "Time to ~99% charge, 5 tau (ms)", expr: { var: "t5Ms" }, format: "number" },
    { name: "cutoffHz", label: "Filter cutoff frequency (Hz)", expr: { var: "cutoffHz" }, format: "number" },
  ],
  sources: [{ title: "RC time constant", url: "https://en.wikipedia.org/wiki/RC_time_constant", publisher: "Reference", retrieved: "2026-06-11" }],
  disclaimer: "For educational use. Real capacitors have tolerance and leakage, and the simple model ignores wiring resistance and source impedance.",
  version: "1.0.0",
  effectiveYear: 2026,
  lastVerified: "2026-06-11",
  tests: [
    { name: "10k and 1uF", inputs: { resistance: 10, capacitance: 1 }, expect: { tauMs: 10, t5Ms: 50, cutoffHz: 15.92 } },
    { name: "1k and 100uF", inputs: { resistance: 1, capacitance: 100 }, expect: { tauMs: 100 } },
  ],
};

// ---------------------------------------------------------------------------
// 4. Wavelength and Frequency (physics)
// ---------------------------------------------------------------------------
export const wavelengthFrequency: CalculatorDefinition = {
  id: "wavelength-frequency",
  type: "estimate",
  region: "US",
  jurisdictionLevel: "federal",
  category: "engineering",
  slug: "wavelength-frequency",
  title: "Wavelength and Frequency Calculator",
  description:
    "Convert between the wavelength and frequency of an electromagnetic wave in free space using the speed of light, c = lambda x f.",
  inputs: [
    {
      name: "solveFor", label: "Solve for", type: "select", required: true, default: "wavelength",
      options: [
        { value: "wavelength", label: "Wavelength (from frequency)" },
        { value: "frequency", label: "Frequency (from wavelength)" },
      ],
    },
    { name: "frequencyMhz", label: "Frequency (MHz)", type: "number", default: 100, min: 0.0000001, max: 1000000000, step: 0.1, showIf: { cmp: "==", left: { var: "solveFor" }, right: "wavelength" } },
    { name: "wavelengthM", label: "Wavelength (metres)", type: "number", default: 3, min: 0.0000001, max: 100000000, step: 0.1, showIf: { cmp: "==", left: { var: "solveFor" }, right: "frequency" } },
  ],
  derived: [
    { name: "wavelength", expr: { if: { cmp: "==", left: { var: "solveFor" }, right: "wavelength" }, then: { op: "/", args: [C_MHZ_M, { var: "frequencyMhz" }] }, else: { var: "wavelengthM" } } },
    { name: "frequency", expr: { if: { cmp: "==", left: { var: "solveFor" }, right: "frequency" }, then: { op: "/", args: [C_MHZ_M, { var: "wavelengthM" }] }, else: { var: "frequencyMhz" } } },
  ],
  outputs: [
    { name: "wavelength", label: "Wavelength (metres)", expr: { var: "wavelength" }, format: "number", primary: true },
    { name: "frequency", label: "Frequency (MHz)", expr: { var: "frequency" }, format: "number" },
  ],
  sources: [{ title: "Wavelength", url: "https://en.wikipedia.org/wiki/Wavelength", publisher: "Reference", retrieved: "2026-06-11" }],
  disclaimer: "For educational use. This uses the speed of light in a vacuum; waves travel slower in glass, water, or cable, so the wavelength inside a medium is shorter.",
  version: "1.0.0",
  effectiveYear: 2026,
  lastVerified: "2026-06-11",
  tests: [
    { name: "100 MHz to wavelength", inputs: { solveFor: "wavelength", frequencyMhz: 100 }, expect: { wavelength: 3.0 } },
    { name: "2 m to frequency", inputs: { solveFor: "frequency", wavelengthM: 2 }, expect: { frequency: 149.9 } },
  ],
};

// ---------------------------------------------------------------------------
// 5. Kinetic Energy (physics)
// ---------------------------------------------------------------------------
export const kineticEnergy: CalculatorDefinition = {
  id: "kinetic-energy",
  type: "estimate",
  region: "US",
  jurisdictionLevel: "federal",
  category: "engineering",
  slug: "kinetic-energy",
  title: "Kinetic Energy Calculator",
  description:
    "Calculate the kinetic energy and momentum of a moving object from its mass and speed using KE = 1/2 x m x v squared.",
  inputs: [
    { name: "mass", label: "Mass (kg)", type: "number", default: 1000, min: 0, max: 100000000, step: 0.1, required: true },
    { name: "velocity", label: "Speed (m/s)", type: "number", default: 20, min: 0, max: 300000000, step: 0.1, required: true },
  ],
  derived: [
    { name: "ke", expr: { op: "*", args: [0.5, { var: "mass" }, { op: "pow", args: [{ var: "velocity" }, 2] }] } },
    { name: "keKj", expr: { op: "/", args: [{ var: "ke" }, 1000] } },
    { name: "momentum", expr: { op: "*", args: [{ var: "mass" }, { var: "velocity" }] } },
  ],
  outputs: [
    { name: "ke", label: "Kinetic energy (joules)", expr: { var: "ke" }, format: "number", primary: true },
    { name: "keKj", label: "Kinetic energy (kilojoules)", expr: { var: "keKj" }, format: "number" },
    { name: "momentum", label: "Momentum (kg x m/s)", expr: { var: "momentum" }, format: "number" },
  ],
  sources: [{ title: "Kinetic energy", url: "https://en.wikipedia.org/wiki/Kinetic_energy", publisher: "Reference", retrieved: "2026-06-11" }],
  disclaimer: "For educational use. This is the classical (non-relativistic) formula; it is accurate for everyday speeds but not for speeds close to the speed of light.",
  version: "1.0.0",
  effectiveYear: 2026,
  lastVerified: "2026-06-11",
  tests: [
    { name: "1000 kg at 20 m/s", inputs: { mass: 1000, velocity: 20 }, expect: { ke: 200000, momentum: 20000 } },
    { name: "2 kg at 3 m/s", inputs: { mass: 2, velocity: 3 }, expect: { ke: 9 } },
  ],
};

// ---------------------------------------------------------------------------
// 6. Data Transfer Time (programming / networking)
// ---------------------------------------------------------------------------
export const dataTransferTime: CalculatorDefinition = {
  id: "data-transfer-time",
  type: "estimate",
  region: "US",
  jurisdictionLevel: "federal",
  category: "developer",
  slug: "data-transfer-time",
  title: "Data Transfer Time Calculator",
  description:
    "Estimate how long a file or backup takes to transfer from its size and the connection speed, accounting for the 8-bits-per-byte conversion.",
  tables: {
    unitToMb: { MB: 1, GB: 1000, TB: 1000000 },
  },
  inputs: [
    { name: "sizeValue", label: "File size", type: "number", default: 1, min: 0, max: 1000000000, step: 0.1, required: true },
    {
      name: "sizeUnit", label: "Size unit", type: "select", required: true, default: "GB",
      options: [
        { value: "MB", label: "Megabytes (MB)" },
        { value: "GB", label: "Gigabytes (GB)" },
        { value: "TB", label: "Terabytes (TB)" },
      ],
    },
    { name: "speedMbps", label: "Connection speed (Mbps)", type: "number", default: 100, min: 0.0001, max: 10000000, step: 1, required: true },
  ],
  derived: [
    { name: "sizeMegabytes", expr: { op: "*", args: [{ var: "sizeValue" }, { lookup: "unitToMb", key: { var: "sizeUnit" } }] } },
    { name: "sizeMegabits", expr: { op: "*", args: [{ var: "sizeMegabytes" }, 8] } },
    { name: "seconds", expr: { op: "/", args: [{ var: "sizeMegabits" }, { var: "speedMbps" }] } },
    { name: "minutes", expr: { op: "/", args: [{ var: "seconds" }, 60] } },
    { name: "hours", expr: { op: "/", args: [{ var: "minutes" }, 60] } },
  ],
  outputs: [
    { name: "seconds", label: "Transfer time (seconds)", expr: { var: "seconds" }, format: "number", primary: true },
    { name: "minutes", label: "Transfer time (minutes)", expr: { var: "minutes" }, format: "number" },
    { name: "hours", label: "Transfer time (hours)", expr: { var: "hours" }, format: "number" },
  ],
  sources: [{ title: "Data-rate units", url: "https://en.wikipedia.org/wiki/Data-rate_units", publisher: "Reference", retrieved: "2026-06-11" }],
  disclaimer: "For educational use. Real transfers run slower than the theoretical figure because of protocol overhead, latency, contention, and disk speed; treat this as a best case.",
  version: "1.0.0",
  effectiveYear: 2026,
  lastVerified: "2026-06-11",
  tests: [
    { name: "1 GB over 100 Mbps", inputs: { sizeValue: 1, sizeUnit: "GB", speedMbps: 100 }, expect: { seconds: 80, minutes: 1.333 } },
    { name: "500 MB over 50 Mbps", inputs: { sizeValue: 500, sizeUnit: "MB", speedMbps: 50 }, expect: { seconds: 80 } },
  ],
};

export const ENGINEERING_CALCULATORS: CalculatorDefinition[] = [
  voltageDivider,
  ledResistor,
  rcTimeConstant,
  wavelengthFrequency,
  kineticEnergy,
  dataTransferTime,
];
