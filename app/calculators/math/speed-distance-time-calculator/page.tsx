"use client";
import { useState, useMemo } from "react";
import Breadcrumbs from "@/components/Breadcrumbs";
import CalculatorLayout from "@/components/CalculatorLayout";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

type FindMode = "speed" | "distance" | "time";
type DistUnit = "km" | "miles" | "meters";
type TimeUnit = "seconds" | "minutes" | "hours";
type SpeedUnit = "km/h" | "mph" | "m/s" | "knots";

const distToM: Record<DistUnit, number> = { meters: 1, km: 1000, miles: 1609.344 };
const timeToS: Record<TimeUnit, number> = { seconds: 1, minutes: 60, hours: 3600 };
const speedToMs: Record<SpeedUnit, number> = { "m/s": 1, "km/h": 1 / 3.6, "mph": 0.44704, knots: 0.514444 };

function fmtNum(v: number, dec = 4) {
  if (!isFinite(v) || isNaN(v)) return "—";
  return parseFloat(v.toFixed(dec)).toLocaleString();
}

export default function SpeedDistanceTimeCalculator() {
  const [findMode, setFindMode] = useState<FindMode>("speed");
  const [distVal, setDistVal] = useState("100");
  const [distUnit, setDistUnit] = useState<DistUnit>("km");
  const [timeVal, setTimeVal] = useState("2");
  const [timeUnit, setTimeUnit] = useState<TimeUnit>("hours");
  const [speedVal, setSpeedVal] = useState("60");
  const [speedUnit, setSpeedUnit] = useState<SpeedUnit>("mph");

  const result = useMemo(() => {
    const dM = parseFloat(distVal) * distToM[distUnit];
    const tS = parseFloat(timeVal) * timeToS[timeUnit];
    const sMs = parseFloat(speedVal) * speedToMs[speedUnit];

    let speedMs = 0, distM = 0, timeSec = 0;

    if (findMode === "speed") {
      distM = dM; timeSec = tS;
      if (distM <= 0 || timeSec <= 0) return null;
      speedMs = distM / timeSec;
    } else if (findMode === "distance") {
      speedMs = sMs; timeSec = tS;
      if (speedMs <= 0 || timeSec <= 0) return null;
      distM = speedMs * timeSec;
    } else {
      speedMs = sMs; distM = dM;
      if (speedMs <= 0 || distM <= 0) return null;
      timeSec = distM / speedMs;
    }

    const toUnit = (v: number, from: "ms" | "m" | "s"): Record<string, number> => {
      if (from === "ms") return { "km/h": v * 3.6, mph: v / 0.44704, "m/s": v, knots: v / 0.514444 };
      if (from === "m") return { km: v / 1000, miles: v / 1609.344, meters: v };
      return { hours: v / 3600, minutes: v / 60, seconds: v };
    };

    const speeds = toUnit(speedMs, "ms");
    const dists = toUnit(distM, "m");
    const times = toUnit(timeSec, "s");

    // NY to LA = 4490 km / speedMs
    const nytola = 4489630 / speedMs / 3600;
    const nytolaMi = 2790;

    // Chart: distance vs time at 10 points
    const chartData = Array.from({ length: 11 }, (_, i) => ({
      time: parseFloat(((timeSec * i) / 10 / timeToS[timeUnit]).toFixed(2)),
      distance: parseFloat(((speedMs * (timeSec * i) / 10) / distToM[distUnit]).toFixed(3)),
    }));

    return { speedMs, distM, timeSec, speeds, dists, times, nytola, nytolaMi, chartData };
  }, [findMode, distVal, distUnit, timeVal, timeUnit, speedVal, speedUnit]);

  const modes: { key: FindMode; label: string }[] = [
    { key: "speed", label: "Find Speed" },
    { key: "distance", label: "Find Distance" },
    { key: "time", label: "Find Time" },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumbs
        items={[
          { label: "Math Calculators", href: "/math-calculators" },
          { label: "Speed Distance Time Calculator", href: "/calculators/math/speed-distance-time-calculator" },
        ]}
      />
      <div className="mb-6 flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Speed Distance Time Calculator</h1>
          <p className="text-base text-gray-600">
            Calculate speed, distance, or time with multi-unit support and real-world context.
          </p>
        </div>
        <button
          onClick={() => window.print()}
          className="print:hidden flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg"
        >
          ↓ PDF
        </button>
      </div>

      {/* Mode tabs */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {modes.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setFindMode(key)}
            className={`px-5 py-2 rounded-lg text-sm font-medium border transition-colors ${
              findMode === key
                ? "bg-indigo-600 text-white border-indigo-600"
                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Inputs */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200 space-y-5">
          <h2 className="text-lg font-semibold text-gray-800">Enter Known Values</h2>
          <div className="bg-indigo-50 rounded-lg p-3 text-center text-sm font-mono text-indigo-800">
            {findMode === "speed" && "Speed = Distance ÷ Time"}
            {findMode === "distance" && "Distance = Speed × Time"}
            {findMode === "time" && "Time = Distance ÷ Speed"}
          </div>

          {/* Distance */}
          {findMode !== "distance" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Distance</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={distVal}
                  onChange={(e) => setDistVal(e.target.value)}
                  min="0"
                />
                <select
                  className="border border-gray-300 rounded-lg px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={distUnit}
                  onChange={(e) => setDistUnit(e.target.value as DistUnit)}
                >
                  {(["km", "miles", "meters"] as DistUnit[]).map((u) => <option key={u}>{u}</option>)}
                </select>
              </div>
            </div>
          )}

          {/* Time */}
          {findMode !== "time" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={timeVal}
                  onChange={(e) => setTimeVal(e.target.value)}
                  min="0"
                />
                <select
                  className="border border-gray-300 rounded-lg px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={timeUnit}
                  onChange={(e) => setTimeUnit(e.target.value as TimeUnit)}
                >
                  {(["seconds", "minutes", "hours"] as TimeUnit[]).map((u) => <option key={u}>{u}</option>)}
                </select>
              </div>
            </div>
          )}

          {/* Speed */}
          {findMode !== "speed" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Speed</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={speedVal}
                  onChange={(e) => setSpeedVal(e.target.value)}
                  min="0"
                />
                <select
                  className="border border-gray-300 rounded-lg px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={speedUnit}
                  onChange={(e) => setSpeedUnit(e.target.value as SpeedUnit)}
                >
                  {(["km/h", "mph", "m/s", "knots"] as SpeedUnit[]).map((u) => <option key={u}>{u}</option>)}
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Results */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Results</h2>
          {result ? (
            <div className="space-y-4">
              {findMode === "speed" && (
                <div className="grid grid-cols-2 gap-3">
                  {Object.entries(result.speeds).map(([u, v]) => (
                    <div key={u} className="bg-indigo-50 rounded-lg p-3">
                      <p className="text-xs text-indigo-600">{u}</p>
                      <p className="font-bold text-indigo-900">{fmtNum(v)}</p>
                    </div>
                  ))}
                </div>
              )}
              {findMode === "distance" && (
                <div className="grid grid-cols-2 gap-3">
                  {Object.entries(result.dists).map(([u, v]) => (
                    <div key={u} className="bg-indigo-50 rounded-lg p-3">
                      <p className="text-xs text-indigo-600">{u}</p>
                      <p className="font-bold text-indigo-900">{fmtNum(v)}</p>
                    </div>
                  ))}
                </div>
              )}
              {findMode === "time" && (
                <div className="grid grid-cols-2 gap-3">
                  {Object.entries(result.times).map(([u, v]) => (
                    <div key={u} className="bg-indigo-50 rounded-lg p-3">
                      <p className="text-xs text-indigo-600">{u}</p>
                      <p className="font-bold text-indigo-900">{fmtNum(v)}</p>
                    </div>
                  ))}
                </div>
              )}

              <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
                <p className="text-xs font-semibold text-amber-700 mb-1">Real-World Context</p>
                <p className="text-sm text-amber-900">
                  At this speed, New York to LA ({result.nytolaMi} mi) would take{" "}
                  <strong>{fmtNum(result.nytola, 2)} hours</strong>
                  {result.nytola < 1 ? ` (${fmtNum(result.nytola * 60, 1)} min)` : ""}.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-2 text-sm">
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500">Speed (m/s)</p>
                  <p className="font-bold text-gray-900">{fmtNum(result.speedMs, 3)}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500">Distance (m)</p>
                  <p className="font-bold text-gray-900">{fmtNum(result.distM, 1)}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500">Time (s)</p>
                  <p className="font-bold text-gray-900">{fmtNum(result.timeSec, 1)}</p>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-gray-400 text-sm">Enter valid positive values to calculate.</p>
          )}
        </div>
      </div>

      {/* Chart */}
      {result && (
        <div className="mt-6 bg-white rounded-xl shadow-md p-6 border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Distance vs Time (at constant speed)
          </h2>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={result.chartData} margin={{ top: 5, right: 20, left: 0, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="time" label={{ value: `Time (${timeUnit})`, position: "insideBottom", offset: -10 }} tick={{ fontSize: 11 }} />
              <YAxis label={{ value: `Dist (${distUnit})`, angle: -90, position: "insideLeft", offset: 15 }} tick={{ fontSize: 11 }} />
              <Tooltip />
              <Line type="monotone" dataKey="distance" stroke="#6366f1" strokeWidth={2} dot={false} name={`Distance (${distUnit})`} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      <CalculatorLayout
        title="Speed Distance Time Calculator"
        description="Calculate speed, distance, or time with multi-unit support including km/h, mph, m/s, knots, and more."
        explanation={
          <div className="space-y-4 text-sm text-gray-700 leading-relaxed">
            <h3 className="text-base font-semibold text-gray-900">Speed vs. Velocity: An Important Distinction</h3>
            <p>
              Speed is a <strong>scalar</strong> quantity — it has magnitude only. Velocity is a <strong>vector</strong> —
              it has both magnitude and direction. A car traveling at 60 mph north has speed 60 mph and velocity 60 mph N.
              If it turns around at 60 mph, its speed remains 60 mph but velocity reverses. This distinction matters
              enormously in physics: a ball thrown upward decelerates (velocity decreases) even though its speed
              magnitude changes continuously.
            </p>
            <h3 className="text-base font-semibold text-gray-900">Terminal Velocity</h3>
            <p>
              When a skydiver jumps from a plane, gravity accelerates them downward, but air resistance increases
              with speed. Eventually the drag force equals gravity, and acceleration stops —
              this is <strong>terminal velocity</strong>. In a spread-eagle position, a skydiver reaches about
              195 km/h (120 mph). In a head-down dive position, terminal velocity can exceed 290 km/h (180 mph).
              The world record for free-fall speed (in a spacesuit from 39 km altitude) was 1,357 km/h — exceeding
              the speed of sound.
            </p>
            <h3 className="text-base font-semibold text-gray-900">Speed of Sound and Mach Number</h3>
            <p>
              Sound travels at approximately <strong>343 m/s (1,235 km/h)</strong> in dry air at 20°C. Speed
              varies with temperature: roughly 0.6 m/s per °C. The <strong>Mach number</strong> is the ratio
              of an object's speed to the local speed of sound. Mach 1 (breaking the sound barrier) creates a
              sonic boom. The Concorde cruised at Mach 2.04 (2,179 km/h). Light travels at 299,792,458 m/s —
              about 874,030 times the speed of sound.
            </p>
            <h3 className="text-base font-semibold text-gray-900">GPS Speed Measurement</h3>
            <p>
              GPS devices measure speed by calculating position change over time — essentially distance ÷ time
              over very short intervals. Modern GPS chips sample position every 0.1–1 seconds with accuracy of
              ~2–5 meters, giving speed accuracy of about ±0.1 km/h. Dedicated sports GPS units sample at 10 Hz
              (every 0.1 seconds) for more accurate speed during rapid acceleration, like in sprint analysis.
            </p>
            <h3 className="text-base font-semibold text-gray-900">Reaction Distance and Braking</h3>
            <p>
              At 60 mph (~27 m/s), during the average human reaction time of 1.5 seconds, a car travels
              ~40 meters (131 feet) before the driver even touches the brakes. Total stopping distance
              (reaction + braking) at 60 mph on dry pavement is approximately 73 meters (240 feet).
              At 120 mph, reaction distance doubles to 81 meters and total stopping distance quadruples —
              because braking distance scales with the square of speed. This physics is why speed limits are set low.
            </p>
            <h3 className="text-base font-semibold text-gray-900">The 85th Percentile Rule in Traffic Engineering</h3>
            <p>
              Traffic engineers set speed limits using the <strong>85th percentile rule</strong>: the speed at
              or below which 85% of vehicles travel naturally (without enforcement) on a given road.
              This is considered the safest and most effective limit, balancing compliance with safety. Roads
              where the posted limit is far below the natural 85th percentile see more accidents due to speed
              variance between drivers — the speed difference between vehicles is a stronger predictor of
              accidents than absolute speed.
            </p>
          </div>
        }
        faqs={[
          {
            question: "How do I calculate average speed for a round trip?",
            answer:
              "You cannot simply average the two speeds. Average speed = total distance / total time. For example, 60 mph there and 40 mph back over equal distances: total distance = 2d, total time = d/60 + d/40 = 5d/120. Average speed = 2d / (5d/120) = 48 mph — the harmonic mean, not the arithmetic mean.",
          },
          {
            question: "What is the difference between knots and mph?",
            answer:
              "A knot is 1 nautical mile per hour. One nautical mile = 1,852 meters, compared to a standard mile = 1,609 meters. So 1 knot ≈ 1.151 mph or 1.852 km/h. Knots are used in aviation and maritime navigation because nautical miles directly correspond to degrees of latitude on Earth's surface.",
          },
          {
            question: "How long does it take light to travel from the Sun to Earth?",
            answer:
              "The average Earth-Sun distance is ~149.6 million km. Light travels at 299,792 km/s. Time = 149,600,000 / 299,792 ≈ 499 seconds, or about 8 minutes 19 seconds. This is why we see the Sun as it was 8 minutes ago — a concept called light travel time.",
          },
          {
            question: "What is relative speed?",
            answer:
              "Relative speed is how fast two objects move with respect to each other. Two cars moving in the same direction at 60 mph and 80 mph have a relative speed of 20 mph. Moving toward each other, their relative speed is 140 mph. This is used in collision physics, satellite orbital mechanics, and everyday driving safety calculations.",
          },
          {
            question: "How do I convert m/s to km/h?",
            answer:
              "Multiply by 3.6. This is because 1 m/s × 3,600 seconds/hour ÷ 1,000 meters/km = 3.6 km/h. To go from km/h to m/s, divide by 3.6. For example, 100 km/h = 100/3.6 ≈ 27.8 m/s.",
          },
        ]}
        relatedCalculators={[]}
      >
        <div />
      </CalculatorLayout>
    </div>
  );
}
