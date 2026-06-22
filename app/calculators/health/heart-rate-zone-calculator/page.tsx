"use client";
import { useState, useEffect } from "react";
import Breadcrumbs from "@/components/Breadcrumbs";
import CalculatorLayout from "@/components/CalculatorLayout";

interface Zone {
  name: string;
  label: string;
  low: number;
  high: number;
  pctLow: number;
  pctHigh: number;
  color: string;
  bgColor: string;
  borderColor: string;
  feel: string;
}

interface ZoneResult {
  zones: Zone[];
  maxHR: number;
}

const ZONE_DEFINITIONS = [
  {
    name: "Zone 1 Recovery",
    label: "Z1",
    pctLow: 50,
    pctHigh: 60,
    color: "#3b82f6",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-300",
    feel: "Very light — easy breathing, can hold full conversation",
  },
  {
    name: "Zone 2 Fat Burn",
    label: "Z2",
    pctLow: 60,
    pctHigh: 70,
    color: "#22c55e",
    bgColor: "bg-green-50",
    borderColor: "border-green-300",
    feel: "Light — comfortable breathing, can speak in sentences",
  },
  {
    name: "Zone 3 Aerobic",
    label: "Z3",
    pctLow: 70,
    pctHigh: 80,
    color: "#eab308",
    bgColor: "bg-yellow-50",
    borderColor: "border-yellow-300",
    feel: "Moderate — deeper breathing, can speak in short phrases",
  },
  {
    name: "Zone 4 Threshold",
    label: "Z4",
    pctLow: 80,
    pctHigh: 90,
    color: "#f97316",
    bgColor: "bg-orange-50",
    borderColor: "border-orange-300",
    feel: "Hard — heavy breathing, can only speak a few words",
  },
  {
    name: "Zone 5 Maximum",
    label: "Z5",
    pctLow: 90,
    pctHigh: 100,
    color: "#ef4444",
    bgColor: "bg-red-50",
    borderColor: "border-red-300",
    feel: "All-out — gasping, cannot speak, sustainable only seconds to minutes",
  },
];

function calculateZones(age: number, restingHR: number, method: "simple" | "karvonen"): ZoneResult {
  const maxHR = 220 - age;
  const hrr = maxHR - restingHR;

  const zones: Zone[] = ZONE_DEFINITIONS.map((def) => {
    let low: number;
    let high: number;

    if (method === "simple") {
      low = Math.round((def.pctLow / 100) * maxHR);
      high = Math.round((def.pctHigh / 100) * maxHR);
    } else {
      low = Math.round(restingHR + (def.pctLow / 100) * hrr);
      high = Math.round(restingHR + (def.pctHigh / 100) * hrr);
    }

    return {
      ...def,
      low,
      high,
    };
  });

  return { zones, maxHR };
}

const STORAGE_KEY = "heart-rate-zones";

const faqs = [
  {
    question: "Which method is more accurate: simple or Karvonen?",
    answer:
      "The Karvonen method is generally more accurate because it accounts for your individual fitness level through resting heart rate. A trained athlete with a low resting HR of 45 bpm has a much larger heart rate reserve than a sedentary person at 80 bpm — and their effective training zones differ significantly even at the same age.",
  },
  {
    question: "Should I train in the \"fat-burning zone\"?",
    answer:
      "Zone 2 (60–70%) does burn the highest percentage of calories from fat, but this doesn't mean it burns more total fat than higher-intensity training. A 30-minute HIIT session burns more total calories — and more total fat — than 30 minutes in Zone 2. That said, Zone 2 is sustainable for hours, building aerobic capacity and metabolic efficiency that benefits all training.",
  },
  {
    question: "Why is my heart rate so high when I run?",
    answer:
      "Common causes include dehydration (even mild dehydration of 2% body weight raises HR), heat and humidity, altitude, lack of aerobic base (your heart works harder at the same pace until you build fitness), caffeine, stress, and illness. New runners often see very high Zone 4–5 HR at easy paces — this normalizes with consistent training over 3–6 months.",
  },
  {
    question: "What is a normal resting heart rate?",
    answer:
      "60–100 bpm is the standard clinical range. Endurance athletes commonly have resting HR in the 40–60 bpm range due to cardiac adaptation — the heart pumps more blood per beat (higher stroke volume), so it needs fewer beats per minute. Tour de France cyclists have been measured at resting HRs of 28–38 bpm.",
  },
  {
    question: "How do I use heart rate zones in training?",
    answer:
      "The research-backed approach is polarized training: roughly 80% of your sessions in Zone 1–2, and 20% in Zone 4–5, with minimal time in Zone 3 (the 'grey zone' that's too hard to recover from easily but too easy to build lactate threshold). Most amateur athletes make the mistake of doing most training in Zone 3.",
  },
];

const relatedCalculators = [
  { name: "BMR Calculator", href: "/calculators/health/bmr-calculator" },
  { name: "Calorie Calculator", href: "/calculators/health/calorie-calculator" },
];

const explanationContent = (
  <div className="space-y-4 text-gray-700 text-sm leading-relaxed">
    <p>
      <strong>The Maffetone Method</strong> offers an alternative approach to zone-based training. Sports scientist Phil Maffetone developed a simple formula — 180 minus your age — to identify the top of your aerobic base zone. Training at or below this number maximizes fat oxidation and builds an aerobic engine without stressing your body's recovery systems. Maffetone advocates spending months training exclusively below this threshold before adding intensity, a method adopted by ultra-endurance athletes and triathletes who need to sustain output for many hours.
    </p>
    <p>
      <strong>Zone 2 as the foundation of endurance</strong> is supported by decades of exercise physiology research. Training in Zone 2 (roughly 60–70% of max HR) stimulates mitochondrial biogenesis — the creation of new mitochondria in muscle cells, the energy-producing organelles responsible for aerobic metabolism. More mitochondria means more fat you can oxidize per minute, which matters enormously for any event lasting longer than 60–90 minutes. Zone 2 also improves the density of slow-twitch muscle fibers and enhances lactate clearance, making you more efficient at all intensities.
    </p>
    <p>
      <strong>The polarized training model</strong> emerged from research on elite endurance athletes by sports scientist Stephen Seiler. Analyzing training logs of world-class cross-country skiers, rowers, and runners — including marathon world record holder Eliud Kipchoge — Seiler found a consistent pattern: roughly 80% of training sessions at low intensity (Zones 1–2) and 20% at high intensity (Zones 4–5), with very little time in the middle Zone 3. This distribution outperforms threshold-heavy training because it allows full recovery between hard sessions and maximizes the adaptation stimulus from the high-intensity work.
    </p>
    <p>
      <strong>Lactate threshold</strong> is the exercise intensity at which lactic acid accumulates in the blood faster than it can be cleared. Measured in millimoles per liter (mmol/L), the threshold typically sits between 2 and 4 mmol/L. Below this point, your body efficiently recycles lactate as fuel. Above it, hydrogen ions accumulate, interfering with muscle contraction and causing the burning sensation associated with hard effort. Zone 4 training targets lactate threshold, pushing it higher over time so you can sustain faster paces before accumulation overwhelms clearance.
    </p>
    <p>
      <strong>Heart rate monitor accuracy</strong> varies significantly by device type. Chest straps use electrical ECG-like signals (similar to a medical EKG) and are considered the gold standard for accuracy, detecting each heartbeat with high precision even during intense interval training or changing intensities. Wrist-based monitors use optical photoplethysmography (PPG) — shining green or red light into the skin and measuring blood flow changes. PPG is convenient but struggles with motion artifact, low perfusion from cold temperatures, dark skin tones, and rapid HR changes, making it less reliable for high-intensity or interval workouts. For serious training, a chest strap or arm optical monitor provides significantly better data.
    </p>
    <p>
      <strong>Cardiac drift</strong> is the gradual increase in heart rate that occurs during sustained aerobic exercise even when pace and effort remain constant. During long runs or rides, the body sweats and loses fluid, reducing plasma volume in the blood. With less blood volume, the heart must beat faster to deliver the same cardiac output. Heat stress compounds this — blood is redirected toward the skin to dissipate heat, further reducing central blood volume and driving HR upward. On a hot day, a runner might finish a two-hour easy run in Zone 3–4 despite starting in Zone 2, purely due to drift.
    </p>
    <p>
      <strong>Heat's effect on heart rate</strong> operates through thermoregulation. When core temperature rises, the body's priority shifts toward cooling — expanding blood vessels near the skin and increasing sweat rate. This demands more cardiac output for cooling alone, on top of the oxygen demands of exercise. At the same perceived effort and pace, heart rate in summer heat may run 10–20 bpm higher than in cool conditions. Experienced endurance athletes often train by effort or power output rather than pace in hot weather, allowing HR to drift without chasing a pace target that's physiologically unrealistic in those conditions.
    </p>
    <p>
      <strong>Overtraining syndrome</strong> develops when training load chronically exceeds recovery capacity. Early warning signs include an elevated resting HR of 5–7 bpm above baseline, declining heart rate variability (HRV), persistent muscle soreness that doesn't resolve after 48 hours, mood disturbances, reduced motivation, and performance plateaus or declines. Monitoring resting HR each morning — ideally right after waking, before getting up — provides an accessible signal. A spike of more than 5–7 bpm above your established baseline is reason to take a rest day or reduce training intensity.
    </p>
    <p>
      <strong>Heart Rate Variability (HRV)</strong> measures the millisecond-level variation between successive heartbeats. Counterintuitively, a healthy heart is not perfectly regular — the interval between beats fluctuates slightly based on the balance between sympathetic (fight-or-flight) and parasympathetic (rest-and-digest) nervous system activity. Higher HRV indicates better parasympathetic tone and recovery capacity. Lower HRV signals stress, fatigue, illness, or insufficient sleep. Apps like WHOOP, Oura Ring, and Garmin's Body Battery track HRV trends to help athletes modulate daily training load, pushing hard when HRV is elevated and backing off when it drops.
    </p>
    <p>
      <strong>Finding your true zones through a field test</strong> is more accurate than any formula. The standard method is a 25-minute time trial at maximum sustainable effort — after a thorough 15-minute warmup, run or cycle as hard as you can hold for 25 minutes. The average heart rate from the final 20 minutes of this effort approximates your lactate threshold heart rate (LTHR). From this number, training zones can be calculated relative to your actual physiology rather than an age-based estimate. This test should be repeated every 8–12 weeks as fitness improves, since LTHR changes with training.
    </p>
  </div>
);

export default function HeartRateZoneCalculatorPage() {
  const [age, setAge] = useState(30);
  const [restingHR, setRestingHR] = useState(65);
  const [method, setMethod] = useState<"simple" | "karvonen">("simple");
  const [result, setResult] = useState<ZoneResult | null>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.age) setAge(parsed.age);
        if (parsed.restingHR) setRestingHR(parsed.restingHR);
        if (parsed.method) setMethod(parsed.method);
      }
    } catch {}
  }, []);

  useEffect(() => {
    const zones = calculateZones(age, restingHR, method);
    setResult(zones);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ age, restingHR, method }));
    } catch {}
  }, [age, restingHR, method]);

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Calculators", href: "/calculators" },
    { label: "Health", href: "/calculators/health" },
    { label: "Heart Rate Zone Calculator" },
  ];

  return (
    <CalculatorLayout
      title="Heart Rate Zone Calculator"
      description="Calculate your 5 personalized heart rate training zones using the simple max HR method or the more precise Karvonen Heart Rate Reserve formula."
      faqs={faqs}
      relatedCalculators={relatedCalculators}
      explanation={explanationContent}
    >
      <Breadcrumbs items={breadcrumbItems} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {/* Input Card */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800 mb-6">Your Details</h2>

          <div className="space-y-6">
            {/* Age Slider */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-medium text-gray-700">Age</label>
                <span className="text-sm font-bold text-blue-600">{age} years</span>
              </div>
              <input
                type="range"
                min={15}
                max={90}
                value={age}
                onChange={(e) => setAge(Number(e.target.value))}
                className="w-full h-2 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>15</span>
                <span>90</span>
              </div>
            </div>

            {/* Resting HR Slider */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-medium text-gray-700">
                  Resting Heart Rate
                  {method === "karvonen" && (
                    <span className="ml-2 text-xs text-rose-600 font-normal">(used in Karvonen)</span>
                  )}
                </label>
                <span className="text-sm font-bold text-rose-600">{restingHR} bpm</span>
              </div>
              <input
                type="range"
                min={40}
                max={100}
                value={restingHR}
                onChange={(e) => setRestingHR(Number(e.target.value))}
                className="w-full h-2 rounded-lg appearance-none cursor-pointer accent-rose-600"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>40</span>
                <span>100</span>
              </div>
            </div>

            {/* Method Selector */}
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-2">Calculation Method</label>
              <div className="grid grid-cols-1 gap-2">
                <button
                  onClick={() => setMethod("simple")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
                    method === "simple"
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-white text-gray-700 border-gray-300 hover:border-blue-400"
                  }`}
                >
                  Simple (% of Max HR)
                </button>
                <button
                  onClick={() => setMethod("karvonen")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
                    method === "karvonen"
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-white text-gray-700 border-gray-300 hover:border-blue-400"
                  }`}
                >
                  Karvonen (Heart Rate Reserve)
                </button>
              </div>
              {method === "karvonen" && (
                <p className="text-xs text-gray-500 mt-2">
                  Uses your resting HR to personalise each zone based on your Heart Rate Reserve (HRR = Max HR − Resting HR).
                </p>
              )}
            </div>
          </div>

          {result && (
            <div className="mt-6 pt-4 border-t border-gray-100 text-sm text-gray-600">
              <div className="flex justify-between">
                <span>Estimated Max HR:</span>
                <span className="font-bold text-gray-800">{result.maxHR} bpm</span>
              </div>
              {method === "karvonen" && (
                <div className="flex justify-between mt-1">
                  <span>Heart Rate Reserve:</span>
                  <span className="font-bold text-gray-800">{result.maxHR - restingHR} bpm</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Results Card */}
        <div id="results" className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Your Training Zones</h2>

          {result && (
            <div className="space-y-3">
              {result.zones.map((zone) => (
                <div
                  key={zone.name}
                  className={`${zone.bgColor} border-2 ${zone.borderColor} rounded-lg p-4`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-gray-800">{zone.name}</span>
                    <span className="text-sm font-semibold" style={{ color: zone.color }}>
                      {zone.pctLow}–{zone.pctHigh}%
                    </span>
                  </div>
                  <div className="text-2xl font-bold" style={{ color: zone.color }}>
                    {zone.low}–{zone.high} bpm
                  </div>
                  <p className="text-xs text-gray-600 mt-1">{zone.feel}</p>
                </div>
              ))}

              <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200 text-xs text-gray-500">
                <p className="font-semibold text-gray-600 mb-1">Max HR: {result.maxHR} bpm (220 − {age})</p>
                <p>
                  These zones are estimates based on the 220−age formula. For precise zones, consider a supervised
                  lactate threshold field test with a coach or sports lab.
                </p>
              </div>

              <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-800">
                <strong>Medical Disclaimer:</strong> Heart rate zone calculators provide general fitness guidance only
                and are not a substitute for medical advice. Consult a physician before starting a new exercise program,
                especially if you have cardiovascular disease, hypertension, or any other medical condition.
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Zone Distribution Visual */}
      {result && (
        <div className="mt-6 bg-white rounded-xl shadow-md p-6 border border-gray-200">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">Heart Rate Zone Distribution</h3>
          <div className="space-y-2">
            {result.zones.map((zone) => {
              const totalRange = result.maxHR;
              const widthPct = ((zone.high - zone.low) / totalRange) * 100;
              const offsetPct = (zone.low / totalRange) * 100;
              return (
                <div key={zone.name} className="flex items-center gap-3">
                  <span className="text-xs font-medium text-gray-600 w-24 shrink-0">{zone.name}</span>
                  <div className="flex-1 bg-gray-100 rounded-full h-6 relative">
                    <div
                      className="absolute h-6 rounded-full flex items-center justify-center text-xs font-bold text-white"
                      style={{
                        left: `${offsetPct}%`,
                        width: `${widthPct}%`,
                        backgroundColor: zone.color,
                        minWidth: "40px",
                      }}
                    >
                      {zone.low}–{zone.high}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-2">
            <span>0 bpm</span>
            <span>{result.maxHR} bpm (Max)</span>
          </div>
        </div>
      )}
    </CalculatorLayout>
  );
}
