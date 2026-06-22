"use client";
import { useState, useMemo } from "react";
import Breadcrumbs from "@/components/Breadcrumbs";
import CalculatorLayout from "@/components/CalculatorLayout";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

type Mode = "pace" | "time" | "distance";
type Unit = "km" | "mi";

const PRESETS = [
  { label: "1 Mile", km: 1.60934 },
  { label: "5K", km: 5 },
  { label: "10K", km: 10 },
  { label: "Half Marathon", km: 21.0975 },
  { label: "Marathon", km: 42.195 },
  { label: "Custom", km: null },
];

function secsToMMSS(s: number): string {
  const m = Math.floor(s / 60);
  const sec = Math.round(s % 60);
  return `${m}:${String(sec).padStart(2, "0")}`;
}

function secsToHHMMSS(s: number): string {
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = Math.round(s % 60);
  if (h > 0) return `${h}:${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  return `${m}:${String(sec).padStart(2, "0")}`;
}

function paceKmToMi(secPerKm: number): number {
  return secPerKm * 1.60934;
}

const content = `
<h2>How to Set a Realistic Race Pace</h2>
<p>The most common mistake beginner runners make is starting too fast. Adrenaline and crowd excitement at races cause runners to go out 15–30 seconds per mile faster than planned, leading to a dramatic slowdown in the second half — known as a positive split. A reliable rule of thumb: your race pace should feel "comfortably hard." You can speak 3–4 word sentences with effort, but cannot hold a full conversation. Going out too fast triggers early glycogen depletion and lactate accumulation, making the back half of the race significantly harder than necessary. The best race-day strategy is to treat the first mile as a warmup and resist the urge to chase faster runners.</p>

<h2>Pacing Strategies: Negative, Even, and Positive Splits</h2>
<p>A negative split means running the second half of a race faster than the first. This approach is associated with the fastest finishing times and is used by most elite runners. Physiologically, it conserves glycogen in the early miles and allows a controlled increase in effort as you warm up and find your rhythm. An even split — running both halves at identical pace — is the next best strategy and a realistic goal for most recreational runners. A positive split, where the first half is faster, almost always produces a slower overall finish time because the anaerobic cost of early hard effort cannot be repaid efficiently. For beginners, targeting even splits is an achievable and rewarding first goal before experimenting with negative-split racing.</p>

<h2>Heart Rate as a Pacing Guide: The MAF Method</h2>
<p>Dr. Phil Maffetone's Maximum Aerobic Function (MAF) method prescribes training at 180 minus your age in beats per minute. At this heart rate, the body primarily burns fat for fuel and builds aerobic base without accumulating excessive lactate. Running at MAF heart rate might feel surprisingly slow at first — many athletes discover their aerobic base is underdeveloped. This is completely normal. Over months of consistent aerobic training at MAF pace, the body adapts and the pace at which you can run at that heart rate improves substantially. Athletes who commit to MAF training for 3–6 months typically report running 1–2 minutes per mile faster at the same heart rate compared to when they started.</p>

<h2>How Elevation Affects Pace</h2>
<p>Elevation change has an asymmetric effect on running pace. A 1% uphill grade costs approximately 15–20 seconds per mile; a 1% downhill gradient returns only about 10–12 seconds per mile. The asymmetry exists because of braking forces: running downhill requires quadriceps to absorb impact, increasing muscle damage and energy cost relative to pure gravity assistance. Strava's Grade Adjusted Pace (GAP) feature normalizes your pace to the flat-equivalent effort, which is useful for comparing hilly and flat runs. On a very hilly course — such as a trail race or a city marathon with significant elevation changes — traditional pace targets become unreliable. Running by feel or heart rate is more appropriate and prevents blowing up on the uphills.</p>

<h2>Treadmill vs. Outdoor Running Pace</h2>
<p>Treadmills eliminate wind resistance and feature a moving belt that slightly assists leg turnover, making outdoor paces harder to replicate at the same displayed speed. Setting a 0.5–1% incline on a treadmill more accurately mimics the energy cost of outdoor flat running. A treadmill displaying 5:00/km may feel harder or easier than outdoor running at the same pace depending on individual biomechanics, stride patterns, and thermoregulation — treadmills are typically warmer due to reduced airflow. When transitioning from treadmill training back to outdoor running (or vice versa), allow a 1–2 week adjustment period. GPS pace data from outdoor runs is generally more reliable for race-pace calibration than treadmill readouts.</p>

<h2>The Talk Test for Easy Pace</h2>
<p>Easy runs should feel conversational. If you cannot speak in complete sentences without breathlessness, you are going too fast. The 80/20 rule — also called polarized training — prescribes that 80% of weekly mileage should be at easy, conversational pace, with only 20% at moderate or hard effort. Research by exercise physiologist Stephen Seiler on elite endurance athletes consistently shows this distribution outperforms training approaches where most miles are run at moderate intensity. Most recreational runners run too fast on easy days and too slow on hard days, inadvertently training in the "moderate" zone that is too hard for recovery but not hard enough for significant fitness adaptation. Slowing down your easy runs is often the most effective change a runner can make.</p>

<h2>Tempo Runs and Lactate Threshold</h2>
<p>Lactate threshold (LT) pace is the fastest pace you can sustain for approximately 60 minutes. It corresponds to roughly 85–90% of maximum heart rate. Physiologically, it is the intensity at which lactate production and clearance are in balance — just above it, lactate accumulates faster than it can be removed, causing the burning sensation and forced slowdown that runners know well. Tempo runs at LT pace for 20–40 minutes, performed once per week, are widely considered the single most effective workout for improving race pace. The subjective feel is "comfortably hard" — you can speak only a few words at a time. As fitness improves, LT pace becomes faster, meaning you can sustain harder effort for longer, which directly translates to better race times.</p>

<h2>Yasso 800s as a Marathon Predictor</h2>
<p>Yasso 800s are a heuristic workout developed by Bart Yasso of Runner's World that correlates closely with marathon finishing time. The protocol: run 10 × 800m repeats at a pace in minutes:seconds matching your goal marathon time in hours:minutes. A runner targeting a 3:30 marathon runs each 800m in 3 minutes 30 seconds. Recovery between repeats equals the duration of the repeat. If you can complete all 10 repeats at goal pace, you have a reasonable chance of achieving that marathon time assuming appropriate long-run training. The prediction is not perfect — it assumes typical marathon training, appropriate long runs, and race-day conditions — but it has been validated anecdotally by thousands of runners and provides a useful, measurable training benchmark during the buildup cycle.</p>

<h2>Fueling Based on Race Pace and Duration</h2>
<p>Exercise lasting under 60–75 minutes can rely entirely on stored muscle glycogen without mid-run fueling. Beyond 75 minutes, exogenous carbohydrate intake of 30–60 grams per hour — from energy gels, dates, sports drinks, or real food — helps maintain blood glucose and delay the glycogen depletion that causes "hitting the wall." At marathon pace, aim for 60 grams of carbohydrate per hour. Faster runners may need less per hour because their race is shorter in duration. The most important rule of fueling: practice in training. Gastrointestinal distress from gels is one of the most common causes of DNS (did not start) and DNF (did not finish) at marathons. Test your fueling strategy on long runs at race effort, not on race day for the first time.</p>

<h2>Recovery Run Pace</h2>
<p>Recovery runs, typically performed the day after a hard workout or long run, should be run 60–90 seconds per mile (40–55 seconds per km) slower than your easy pace — which itself may be 2 or more minutes per mile slower than race pace. Their purpose is to increase blood flow to the muscles to accelerate repair, reduce muscle soreness through gentle movement, and accumulate easy mileage without adding fitness stress. Running too fast on recovery days negates the recovery benefit and compounds accumulated fatigue, increasing injury risk. If your recovery run ever feels hard, you are running too fast. An easy test: you should be able to breathe comfortably through your nose for the entire run. If mouth breathing is required, slow down.</p>
`;

const faqs = [
  {
    question: "What is a good 5K pace for a beginner?",
    answer: "For most beginners, completing a 5K in 28–40 minutes (9:00–13:00 per mile, or 5:36–8:03 per km) is a realistic and respectable goal. A sub-30 minute 5K (9:39/mile, 6:00/km) is a popular beginner milestone. Elite runners cover 5K in under 15 minutes (4:50/mile). Focus on running the full 3.1 miles without stopping before optimizing pace — consistency of effort matters more than speed in the first months of running.",
  },
  {
    question: "How do I run a negative split?",
    answer: "Start the first half of your race 5–10 seconds per mile slower than your goal pace. This feels frustratingly slow in the early miles when energy is high and adrenaline is flowing — this discomfort is normal and necessary. Trust the process. By mile 2–3 of a 5K or mile 10–13 of a half marathon, the effort should feel appropriate and you will have reserves to increase pace. Review your GPS data after races to calibrate future pacing decisions.",
  },
  {
    question: "What pace should my easy runs be?",
    answer: "Easy runs should be 60–90 seconds per mile (40–55 seconds per km) slower than your goal race pace, or at a pace where you can hold a full conversation without breathlessness. Many runners use heart rate: easy runs at 65–75% of maximum heart rate. For a runner targeting a 3:30 marathon (8:00/mile), easy runs would be around 9:00–9:30/mile. Easy pace is not junk mileage — it builds aerobic base, improves fat metabolism, and allows recovery between hard sessions.",
  },
  {
    question: "How does heat affect running pace?",
    answer: "Above 55°F (13°C), performance begins to decline. A useful rule of thumb: add 15–20 seconds per mile for every 5°F above 55°F for races under 10K; the adjustment compounds for longer distances. At 85°F (29°C), expect to run 60–90 seconds per mile slower than your cool-weather pace. High humidity compounds the effect by reducing the evaporative cooling of sweat. In heat, running by effort or heart rate rather than pace is more appropriate.",
  },
  {
    question: "What is a BQ (Boston Qualifier) pace?",
    answer: "Boston Qualifier standards vary by age group and sex and change periodically. As a reference: the 18–34 male standard requires a marathon under 3:00:00 (6:52/mile); 18–34 female under 3:30:00 (8:01/mile); 45–49 male under 3:15:00 (7:27/mile). Due to high demand, qualifying times are often cut by 2–5 minutes beyond the published standard. Check the official Boston Athletic Association website for current standards, as they update periodically based on registration volume.",
  },
];

const relatedCalculators = [
  { name: "Calorie Calculator", href: "/calculators/health/calorie-calculator" },
  { name: "BMI Calculator", href: "/calculators/health/bmi-calculator" },
  { name: "BMR Calculator", href: "/calculators/health/bmr-calculator" },
];

export default function RunningPaceCalculator() {
  const [mode, setMode] = useState<Mode>("pace");
  const [distanceValue, setDistanceValue] = useState<number>(5);
  const [distanceUnit, setDistanceUnit] = useState<Unit>("km");
  const [presetDistance, setPresetDistance] = useState<string>("5K");
  const [timeHours, setTimeHours] = useState<number>(0);
  const [timeMinutes, setTimeMinutes] = useState<number>(25);
  const [timeSeconds, setTimeSeconds] = useState<number>(0);
  const [paceMinutes, setPaceMinutes] = useState<number>(5);
  const [paceSeconds, setPaceSeconds] = useState<number>(0);
  const [paceUnit, setPaceUnit] = useState<Unit>("km");

  const distanceKm = useMemo(() => {
    return distanceUnit === "km" ? distanceValue : distanceValue * 1.60934;
  }, [distanceValue, distanceUnit]);

  const totalTimeSec = useMemo(() => {
    return timeHours * 3600 + timeMinutes * 60 + timeSeconds;
  }, [timeHours, timeMinutes, timeSeconds]);

  const paceSecPerKm = useMemo(() => {
    const raw = paceMinutes * 60 + paceSeconds;
    return paceUnit === "km" ? raw : raw / 1.60934;
  }, [paceMinutes, paceSeconds, paceUnit]);

  const result = useMemo<
    | { paceKm: number }
    | { totalSec: number }
    | { distKm: number }
    | null
  >(() => {
    if (mode === "pace") {
      if (distanceKm <= 0 || totalTimeSec <= 0) return null;
      return { paceKm: totalTimeSec / distanceKm };
    } else if (mode === "time") {
      if (distanceKm <= 0 || paceSecPerKm <= 0) return null;
      return { totalSec: paceSecPerKm * distanceKm };
    } else {
      if (totalTimeSec <= 0 || paceSecPerKm <= 0) return null;
      return { distKm: totalTimeSec / paceSecPerKm };
    }
  }, [mode, distanceKm, totalTimeSec, paceSecPerKm]);

  const derivedPaceSecPerKm = useMemo(() => {
    if (mode === "pace" && result && "paceKm" in result) return result.paceKm;
    if (mode === "time") return paceSecPerKm;
    if (mode === "distance") return paceSecPerKm;
    return null;
  }, [mode, result, paceSecPerKm]);

  const splitData = useMemo(() => {
    const p = derivedPaceSecPerKm;
    if (!p || p <= 0) return [];
    const pacePerMileSec = paceKmToMi(p);
    const milesCount = mode === "distance" && result && "distKm" in result
      ? Math.ceil(result.distKm / 1.60934)
      : Math.ceil(distanceKm / 1.60934);
    const count = Math.min(milesCount, 10);
    return Array.from({ length: count }, (_, i) => ({
      name: `Mile ${i + 1}`,
      time: parseFloat(((pacePerMileSec * (i + 1)) / 60).toFixed(2)),
    }));
  }, [derivedPaceSecPerKm, distanceKm, mode, result]);

  const trainingZones = useMemo(() => {
    const p = derivedPaceSecPerKm;
    if (!p) return null;
    return [
      { zone: "Easy", adj: "+90 sec/km", paceKm: p + 90 },
      { zone: "Tempo", adj: "+20 sec/km", paceKm: p + 20 },
      { zone: "Race", adj: "±0", paceKm: p },
      { zone: "Threshold", adj: "−15 sec/km", paceKm: p - 15 },
    ];
  }, [derivedPaceSecPerKm]);

  const handlePreset = (preset: { label: string; km: number | null }) => {
    setPresetDistance(preset.label);
    if (preset.km !== null) {
      setDistanceValue(preset.km);
      setDistanceUnit("km");
    }
  };

  const tabs: { label: string; value: Mode }[] = [
    { label: "Calculate Pace", value: "pace" },
    { label: "Finish Time", value: "time" },
    { label: "Distance", value: "distance" },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <Breadcrumbs
        items={[
          { label: "Health Calculators", href: "/health-calculators" },
          { label: "Running Pace Calculator", href: "/calculators/health/running-pace-calculator" },
        ]}
      />

      <div className="flex items-start justify-between mb-2">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Running Pace Calculator</h1>
          <p className="text-gray-500 mt-1">Calculate your running pace, finish time, or distance for any race</p>
        </div>
        <button
          onClick={() => window.print()}
          className="text-sm border border-gray-300 rounded px-3 py-1.5 hover:bg-gray-50 print:hidden"
        >
          Print
        </button>
      </div>

      {/* Mode Tabs */}
      <div className="flex gap-1 bg-gray-100 rounded-lg p-1 mb-5 w-fit print:hidden">
        {tabs.map((t) => (
          <button
            key={t.value}
            onClick={() => setMode(t.value)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              mode === t.value
                ? "bg-white text-blue-600 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Preset Buttons */}
      <div className="flex flex-wrap gap-2 mb-5">
        {PRESETS.map((p) => (
          <button
            key={p.label}
            onClick={() => handlePreset(p)}
            className={`px-3 py-1.5 text-sm rounded-full border transition-colors ${
              presetDistance === p.label
                ? "bg-blue-600 text-white border-blue-600"
                : "border-gray-300 text-gray-700 hover:border-blue-400 hover:text-blue-600"
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Inputs + Results Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Inputs Card */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <h2 className="text-base font-semibold text-gray-800 mb-4">Inputs</h2>

          {/* Distance (shown for pace and time modes) */}
          {(mode === "pace" || mode === "time") && (
            <div className="mb-4">
              <label className="block text-sm text-gray-600 mb-1">Distance</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  min={0}
                  step={0.01}
                  value={distanceValue}
                  onChange={(e) => {
                    setDistanceValue(parseFloat(e.target.value) || 0);
                    setPresetDistance("Custom");
                  }}
                  className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <select
                  value={distanceUnit}
                  onChange={(e) => setDistanceUnit(e.target.value as Unit)}
                  className="border border-gray-300 rounded-md px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  <option value="km">km</option>
                  <option value="mi">mi</option>
                </select>
              </div>
            </div>
          )}

          {/* Time (shown for pace and distance modes) */}
          {(mode === "pace" || mode === "distance") && (
            <div className="mb-4">
              <label className="block text-sm text-gray-600 mb-1">Time (hh:mm:ss)</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  min={0}
                  placeholder="h"
                  value={timeHours}
                  onChange={(e) => setTimeHours(parseInt(e.target.value) || 0)}
                  className="w-16 border border-gray-300 rounded-md px-2 py-2 text-sm text-center focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <span className="self-center text-gray-400">:</span>
                <input
                  type="number"
                  min={0}
                  max={59}
                  placeholder="mm"
                  value={timeMinutes}
                  onChange={(e) => setTimeMinutes(parseInt(e.target.value) || 0)}
                  className="w-16 border border-gray-300 rounded-md px-2 py-2 text-sm text-center focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <span className="self-center text-gray-400">:</span>
                <input
                  type="number"
                  min={0}
                  max={59}
                  placeholder="ss"
                  value={timeSeconds}
                  onChange={(e) => setTimeSeconds(parseInt(e.target.value) || 0)}
                  className="w-16 border border-gray-300 rounded-md px-2 py-2 text-sm text-center focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
            </div>
          )}

          {/* Pace (shown for time and distance modes) */}
          {(mode === "time" || mode === "distance") && (
            <div className="mb-4">
              <label className="block text-sm text-gray-600 mb-1">Pace (mm:ss)</label>
              <div className="flex gap-2 items-center">
                <input
                  type="number"
                  min={0}
                  placeholder="mm"
                  value={paceMinutes}
                  onChange={(e) => setPaceMinutes(parseInt(e.target.value) || 0)}
                  className="w-16 border border-gray-300 rounded-md px-2 py-2 text-sm text-center focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <span className="self-center text-gray-400">:</span>
                <input
                  type="number"
                  min={0}
                  max={59}
                  placeholder="ss"
                  value={paceSeconds}
                  onChange={(e) => setPaceSeconds(parseInt(e.target.value) || 0)}
                  className="w-16 border border-gray-300 rounded-md px-2 py-2 text-sm text-center focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <select
                  value={paceUnit}
                  onChange={(e) => setPaceUnit(e.target.value as Unit)}
                  className="border border-gray-300 rounded-md px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  <option value="km">/km</option>
                  <option value="mi">/mi</option>
                </select>
              </div>
            </div>
          )}

          {/* Distance shown for distance mode */}
          {mode === "distance" && (
            <p className="text-xs text-gray-400 mt-2">Enter your time and pace to calculate distance.</p>
          )}
        </div>

        {/* Results Card */}
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-6 shadow-sm">
          <h2 className="text-base font-semibold text-gray-800 mb-4">Results</h2>

          {!result ? (
            <p className="text-sm text-gray-400">Enter values to see your result.</p>
          ) : (
            <>
              {mode === "pace" && "paceKm" in result && (
                <div>
                  <div className="mb-3">
                    <p className="text-xs text-gray-500 uppercase tracking-wide">Pace per km</p>
                    <p className="text-4xl font-bold text-blue-600">{secsToMMSS(result.paceKm)} <span className="text-lg font-normal text-gray-500">/km</span></p>
                  </div>
                  <div className="mb-4">
                    <p className="text-xs text-gray-500 uppercase tracking-wide">Pace per mile</p>
                    <p className="text-2xl font-semibold text-gray-700">{secsToMMSS(paceKmToMi(result.paceKm))} <span className="text-base font-normal text-gray-400">/mi</span></p>
                  </div>
                  <SplitsTable paceSecPerKm={result.paceKm} distanceKm={distanceKm} />
                </div>
              )}

              {mode === "time" && "totalSec" in result && (
                <div>
                  <div className="mb-3">
                    <p className="text-xs text-gray-500 uppercase tracking-wide">Finish Time</p>
                    <p className="text-4xl font-bold text-blue-600">{secsToHHMMSS(result.totalSec)}</p>
                  </div>
                  <div className="mb-4 flex gap-4">
                    <div>
                      <p className="text-xs text-gray-500">Pace used</p>
                      <p className="text-sm font-medium text-gray-700">{secsToMMSS(paceSecPerKm)} /km · {secsToMMSS(paceKmToMi(paceSecPerKm))} /mi</p>
                    </div>
                  </div>
                  <SplitsTable paceSecPerKm={paceSecPerKm} distanceKm={distanceKm} />
                </div>
              )}

              {mode === "distance" && "distKm" in result && (
                <div>
                  <div className="mb-3">
                    <p className="text-xs text-gray-500 uppercase tracking-wide">Distance</p>
                    <p className="text-4xl font-bold text-blue-600">{result.distKm.toFixed(2)} <span className="text-lg font-normal text-gray-500">km</span></p>
                  </div>
                  <div className="mb-4">
                    <p className="text-xs text-gray-500 uppercase tracking-wide">In miles</p>
                    <p className="text-2xl font-semibold text-gray-700">{(result.distKm / 1.60934).toFixed(2)} <span className="text-base font-normal text-gray-400">mi</span></p>
                  </div>
                  <p className="text-sm text-gray-500">At pace: {secsToMMSS(paceSecPerKm)} /km · {secsToMMSS(paceKmToMi(paceSecPerKm))} /mi</p>
                </div>
              )}
            </>
          )}

          {/* Training Zones Table */}
          {trainingZones && (
            <div className="mt-6">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Training Zones</h3>
              <table className="w-full text-xs">
                <thead>
                  <tr className="text-gray-400">
                    <th className="text-left pb-1">Zone</th>
                    <th className="text-left pb-1">Adjustment</th>
                    <th className="text-left pb-1">Pace /km</th>
                    <th className="text-left pb-1">Pace /mi</th>
                  </tr>
                </thead>
                <tbody>
                  {trainingZones.map((z) => (
                    <tr key={z.zone} className={z.zone === "Race" ? "font-semibold text-blue-600" : "text-gray-600"}>
                      <td className="py-0.5">{z.zone}</td>
                      <td className="py-0.5">{z.adj}</td>
                      <td className="py-0.5">{secsToMMSS(z.paceKm)}</td>
                      <td className="py-0.5">{secsToMMSS(paceKmToMi(z.paceKm))}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Chart */}
      {splitData.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm mb-8">
          <h2 className="text-base font-semibold text-gray-800 mb-4">Projected Mile Splits</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={splitData} margin={{ top: 4, right: 16, left: 0, bottom: 4 }}>
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis
                tick={{ fontSize: 11 }}
                label={{ value: "Cumulative min", angle: -90, position: "insideLeft", fontSize: 11, offset: 10 }}
              />
              <Tooltip
                formatter={(value: number) => [`${value.toFixed(1)} min`, "Cumulative Time"]}
              />
              <Bar dataKey="time" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      <CalculatorLayout
        title="Running Pace Calculator"
        description="Use this running pace calculator to find your pace per mile or per kilometer, predict finish times, and plan training zones for any race distance."
        faqs={faqs}
        relatedCalculators={relatedCalculators}
      >
        <div
          className="prose max-w-none text-gray-700"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </CalculatorLayout>
    </div>
  );
}

function SplitsTable({ paceSecPerKm, distanceKm }: { paceSecPerKm: number; distanceKm: number }) {
  const pacePerMileSec = paceKmToMi(paceSecPerKm);
  const totalMiles = Math.ceil(distanceKm / 1.60934);
  const rows = Math.min(totalMiles, 10);

  return (
    <div>
      <h3 className="text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">Mile Splits</h3>
      <table className="w-full text-xs">
        <thead>
          <tr className="text-gray-400">
            <th className="text-left pb-1">Mile</th>
            <th className="text-left pb-1">Split</th>
            <th className="text-left pb-1">Cumulative</th>
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: rows }, (_, i) => (
            <tr key={i} className="text-gray-600 border-t border-gray-100">
              <td className="py-0.5">{i + 1}</td>
              <td className="py-0.5">{secsToMMSS(pacePerMileSec)}</td>
              <td className="py-0.5">{secsToHHMMSS(pacePerMileSec * (i + 1))}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {totalMiles > 10 && (
        <p className="text-xs text-gray-400 mt-1">Showing first 10 miles only.</p>
      )}
    </div>
  );
}
