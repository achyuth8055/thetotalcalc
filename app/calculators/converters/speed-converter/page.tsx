"use client";
import { useState, useMemo } from "react";
import Breadcrumbs from "@/components/Breadcrumbs";
import CalculatorLayout from "@/components/CalculatorLayout";

type SpeedUnit = "kmh" | "mph" | "ms" | "knots" | "fts" | "mach";

const UNITS: { id: SpeedUnit; label: string; short: string; toMs: number }[] = [
  { id: "kmh",   label: "Kilometers per hour", short: "km/h",   toMs: 0.277778  },
  { id: "mph",   label: "Miles per hour",       short: "mph",    toMs: 0.44704   },
  { id: "ms",    label: "Meters per second",    short: "m/s",    toMs: 1         },
  { id: "knots", label: "Knots",                short: "kn",     toMs: 0.514444  },
  { id: "fts",   label: "Feet per second",      short: "ft/s",   toMs: 0.3048    },
  { id: "mach",  label: "Mach (at sea level)",  short: "Mach",   toMs: 340.29    },
];

const REFERENCE_SPEEDS: { label: string; description: string; ms: number; emoji: string }[] = [
  { label: "Human walking",   description: "Average adult walking pace",        ms: 1.4,        emoji: "🚶" },
  { label: "Usain Bolt",      description: "100m world record peak speed",      ms: 12.4,       emoji: "🏃" },
  { label: "Cheetah",         description: "Fastest land animal (peak sprint)", ms: 29.0,       emoji: "🐆" },
  { label: "Formula 1 car",   description: "Top speed on circuit straights",    ms: 97.2,       emoji: "🏎️" },
  { label: "Commercial jet",  description: "Cruising altitude airspeed",        ms: 245.0,      emoji: "✈️" },
  { label: "Speed of sound",  description: "Mach 1 at sea level, 20°C",        ms: 340.29,     emoji: "💨" },
  { label: "Low Earth orbit", description: "International Space Station speed", ms: 7660.0,     emoji: "🛸" },
  { label: "Speed of light",  description: "c in vacuum",                       ms: 299792458,  emoji: "💡" },
];

function formatValue(ms: number, unit: typeof UNITS[0]): string {
  const val = ms / unit.toMs;
  if (val === 0) return "0";
  if (val >= 1e12) return val.toExponential(3);
  if (val >= 1000000) return val.toExponential(3);
  if (val >= 100) return val.toFixed(2);
  if (val >= 1) return val.toFixed(4);
  return val.toFixed(6);
}

function percentOfLight(ms: number): string {
  const c = 299792458;
  const pct = (ms / c) * 100;
  if (pct < 0.0001) return "< 0.0001%";
  if (pct < 1) return `${pct.toFixed(4)}%`;
  return `${pct.toFixed(2)}%`;
}

export default function SpeedConverter() {
  const [inputValue, setInputValue] = useState<string>("100");
  const [fromUnit, setFromUnit] = useState<SpeedUnit>("kmh");

  const numericValue = parseFloat(inputValue) || 0;

  const speedInMs = useMemo(() => {
    const unit = UNITS.find((u) => u.id === fromUnit)!;
    return numericValue * unit.toMs;
  }, [numericValue, fromUnit]);

  const converted = useMemo(() => {
    return UNITS.map((unit) => ({
      ...unit,
      value: speedInMs / unit.toMs,
      formatted: formatValue(speedInMs, unit),
    }));
  }, [speedInMs]);

  const explanation = (
    <div className="prose max-w-none text-gray-700 space-y-4">
      <p>
        Speed is among the most fundamental quantities in physics — the rate at which an object covers distance over time. Yet the sheer variety of units used to express speed across different fields, countries, and eras can make comparisons remarkably confusing. A pilot speaks in knots, a physicist in meters per second, a driver in kilometers or miles per hour, and a jet manufacturer might quote performance in Mach numbers. This converter unifies all of these into a single framework.
      </p>
      <p>
        <strong>Why So Many Units?</strong><br />
        Speed units evolved independently in different domains long before international standardization efforts took hold. Maritime navigation developed knots because sailors measured speed by counting how many knots in a rope passed through their hands in a fixed time as the rope unreeled behind the vessel. Road transportation adopted miles per hour in countries using the imperial system, while the metric world standardized on kilometers per hour. Aviation initially used knots for compatibility with nautical charts and navigation, a practice retained globally because airspace is international. Physics and engineering prefer meters per second because it slots directly into SI unit calculations without conversion factors.
      </p>
      <p>
        <strong>The Knot: A Nautical Unit Still in Wide Use</strong><br />
        One knot equals exactly one nautical mile per hour, and a nautical mile is defined as one minute of arc along a meridian of the Earth — making it a natural unit for navigation based on latitude and longitude. At 0.514444 m/s, one knot is almost identical to one kilometer per 1.94 hours. Knots are used universally in aviation and maritime contexts because they integrate directly with navigational chart distances and standard air/sea traffic control procedures. The unit's persistence demonstrates how domain-specific practicality often wins over metric simplicity.
      </p>
      <p>
        <strong>Mach Number: Relative Speed, Not Absolute</strong><br />
        Unlike other units in this converter, Mach is not an absolute unit — it is a dimensionless ratio expressing a vehicle's speed relative to the local speed of sound. Mach 1 at sea level in standard atmosphere is approximately 340.29 m/s (1,235 km/h). However, the speed of sound decreases with altitude as temperature drops; at cruising altitude (35,000 ft), the local speed of sound is about 295 m/s, making Mach 1 at altitude slower in absolute terms than Mach 1 at sea level. This calculator uses the sea-level standard, which is the most commonly referenced value.
      </p>
      <p>
        <strong>The Speed of Sound: More Than One Value</strong><br />
        The speed of sound in air depends on temperature, pressure, and humidity. The simple formula is approximately v = 331.3 + 0.606 × T m/s, where T is temperature in Celsius. At 0°C, sound travels at about 331 m/s; at 20°C, about 343 m/s; at body temperature (37°C), about 352 m/s. In water, sound travels about 4.3 times faster than in air (approximately 1,481 m/s at 25°C) because water molecules are more tightly packed. In steel, sound travels at about 5,100 m/s. The Mach number must always be contextually understood within the medium.
      </p>
      <p>
        <strong>Relativistic Speeds and the Universal Speed Limit</strong><br />
        Classical Newtonian mechanics treats speed as unlimited in principle, but Einstein's special theory of relativity establishes the speed of light in vacuum (c = 299,792,458 m/s) as an absolute speed limit for objects with mass. As an object with mass approaches c, the energy required to accelerate it further approaches infinity. At 10% of the speed of light, relativistic effects become measurable but remain small; at 90% of c, time dilation means the traveler's clock runs at 44% the rate of a stationary observer's clock. No spacecraft built today approaches a meaningful fraction of c — the New Horizons probe, one of humanity's fastest spacecraft, travels at roughly 0.000053c.
      </p>
      <p>
        <strong>Practical Speed Comparisons</strong><br />
        Grounding abstract units in real-world references helps build intuition. The human walking pace of about 5 km/h (1.4 m/s) serves as a natural baseline. At 120 km/h (highway driving), a car covers a full kilometer every 30 seconds. A commercial aircraft cruising at 900 km/h completes a transatlantic crossing in roughly 8 hours. A rifle bullet travels at approximately 900 m/s — about Mach 2.6 at sea level. The International Space Station orbits at approximately 7.66 km/s, or 27,600 km/h — fast enough to circle the Earth in about 92 minutes. These reference points, combined with this converter, make any speed measurement immediately comprehensible.
      </p>
    </div>
  );

  const faqs = [
    {
      question: "How do I convert km/h to mph?",
      answer: "Multiply kilometers per hour by 0.621371 to get miles per hour. For a quick mental approximation, multiply by 5 and divide by 8. For example, 100 km/h × 0.621371 = 62.14 mph. The reverse is to multiply mph by 1.60934 to get km/h.",
    },
    {
      question: "What is a knot in km/h and mph?",
      answer: "One knot equals 1.852 km/h exactly (by definition) or approximately 1.15078 mph. Knots are nautical miles per hour, where one nautical mile equals 1,852 meters — defined as one minute of arc along the Earth's meridian. Both aviation and maritime navigation use knots as their standard speed unit.",
    },
    {
      question: "What is Mach 1 in km/h and mph?",
      answer: "At sea level in standard atmosphere (15°C), Mach 1 equals approximately 1,235 km/h or 767 mph or 340.29 m/s. The speed of sound varies with temperature and altitude — at 35,000 feet cruising altitude where temperatures reach around -56°C, Mach 1 is approximately 1,062 km/h (660 mph).",
    },
    {
      question: "How fast is the speed of light in km/h?",
      answer: "The speed of light in vacuum is exactly 299,792,458 m/s, which equals approximately 1,079,252,849 km/h (about 1.08 billion km/h) or 670,616,629 mph. Light travels from the Earth to the Moon (about 384,400 km) in approximately 1.28 seconds.",
    },
    {
      question: "Why do pilots use knots instead of km/h or mph?",
      answer: "Pilots use knots because aviation navigation is based on nautical miles, which relate directly to degrees of latitude on Earth. One nautical mile per hour (one knot) corresponds to one arcminute of latitude per hour, making chart navigation straightforward. Since airspace is international, knots serve as a universal standard regardless of whether a country uses metric or imperial units on its roads.",
    },
  ];

  const relatedCalculators = [
    { name: "Speed, Distance & Time", href: "/calculators/math/speed-distance-time-calculator" },
    { name: "Data Size Converter", href: "/calculators/converters/data-size-converter" },
    { name: "Time Zone Converter", href: "/calculators/converters/time-zone-converter" },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumbs
        items={[
          { label: "Converters", href: "/calculators/converters" },
          { label: "Speed Converter", href: "/calculators/converters/speed-converter" },
        ]}
      />
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Speed Converter</h1>
        <p className="text-base text-gray-600">Convert between km/h, mph, m/s, knots, ft/s, and Mach instantly</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Input */}
        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 space-y-6">
          <h2 className="text-lg font-semibold text-gray-800">Enter Speed</h2>

          {/* Value input */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Speed Value</label>
            <input
              type="number"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-lg font-semibold text-blue-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter a number..."
              min={0}
            />
          </div>

          {/* Unit selector */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">From Unit</label>
            <div className="space-y-2">
              {UNITS.map((unit) => (
                <button
                  key={unit.id}
                  onClick={() => setFromUnit(unit.id)}
                  className={`w-full flex items-center justify-between px-4 py-2.5 rounded-lg border transition-colors text-sm ${
                    fromUnit === unit.id
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  <span>{unit.label}</span>
                  <span className={`font-mono font-semibold ${fromUnit === unit.id ? "text-blue-100" : "text-gray-400"}`}>
                    {unit.short}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Converted Values</h2>
            <div className="space-y-3">
              {converted.map((unit) => (
                <div
                  key={unit.id}
                  className={`flex items-center justify-between p-3 rounded-lg ${
                    unit.id === fromUnit ? "bg-blue-50 border border-blue-200" : "bg-gray-50"
                  }`}
                >
                  <div>
                    <div className="text-sm font-medium text-gray-700">{unit.label}</div>
                    <div className="text-xs text-gray-400 font-mono">{unit.short}</div>
                  </div>
                  <div className={`text-lg font-bold font-mono ${unit.id === fromUnit ? "text-blue-700" : "text-gray-800"}`}>
                    {unit.formatted}
                  </div>
                </div>
              ))}
            </div>
            {speedInMs > 0 && (
              <div className="mt-3 pt-3 border-t border-gray-100 text-xs text-gray-400 text-center">
                {percentOfLight(speedInMs)} of the speed of light
              </div>
            )}
          </div>

          {/* Reference cards */}
          <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
            <h2 className="text-sm font-semibold text-gray-700 mb-3">Real-World Speed References</h2>
            <div className="space-y-2">
              {REFERENCE_SPEEDS.map((ref) => {
                const fromUnitObj = UNITS.find((u) => u.id === fromUnit)!;
                const valInFromUnit = ref.ms / fromUnitObj.toMs;
                const display = valInFromUnit >= 1000
                  ? valInFromUnit.toFixed(0)
                  : valInFromUnit >= 10
                  ? valInFromUnit.toFixed(1)
                  : valInFromUnit.toFixed(3);
                const isAbove = speedInMs > 0 && ref.ms <= speedInMs;
                return (
                  <div
                    key={ref.label}
                    className={`flex items-center gap-3 p-2.5 rounded-lg text-xs ${isAbove ? "bg-green-50" : "bg-gray-50"}`}
                  >
                    <span className="text-lg">{ref.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-gray-800 truncate">{ref.label}</div>
                      <div className="text-gray-400 truncate">{ref.description}</div>
                    </div>
                    <div className="font-mono font-semibold text-gray-700 whitespace-nowrap">
                      {display} {fromUnitObj.short}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <CalculatorLayout
        title="Speed Converter"
        description="Convert between km/h, mph, m/s, knots, ft/s, and Mach instantly"
        explanation={explanation}
        faqs={faqs}
        relatedCalculators={relatedCalculators}
      >
        <div></div>
      </CalculatorLayout>
    </div>
  );
}
