"use client";
import { useState, useEffect, useMemo } from "react";
import Breadcrumbs from "@/components/Breadcrumbs";
import CalculatorLayout from "@/components/CalculatorLayout";
import MobileResultBar from "@/components/calculators/MobileResultBar";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

type Gender = "male" | "female";
type ActivityLevel = "sedentary" | "light" | "moderate" | "active" | "extra";

const ACTIVITY_CONFIG: { key: ActivityLevel; label: string; short: string; multiplier: number }[] = [
  { key: "sedentary", label: "Sedentary (desk job, little exercise)", short: "Sedentary", multiplier: 1.2 },
  { key: "light",     label: "Lightly Active (1–3x/week)",           short: "Light",     multiplier: 1.375 },
  { key: "moderate",  label: "Moderately Active (3–5x/week)",        short: "Moderate",  multiplier: 1.55 },
  { key: "active",    label: "Very Active (6–7x/week)",              short: "Active",    multiplier: 1.725 },
  { key: "extra",     label: "Extra Active (physical job + gym)",    short: "Extra",     multiplier: 1.9 },
];

export default function TDEECalculator() {
  const [age, setAge] = useState(30);
  const [gender, setGender] = useState<Gender>("male");
  const [weightKg, setWeightKg] = useState(70);
  const [useKg, setUseKg] = useState(true);
  const [heightCm, setHeightCm] = useState(170);
  const [useCm, setUseCm] = useState(true);
  const [activityLevel, setActivityLevel] = useState<ActivityLevel>("moderate");

  useEffect(() => {
    try {
      const recent = JSON.parse(localStorage.getItem("recentCalculators") || "[]");
      const updated = ["tdee-calculator", ...recent.filter((id: string) => id !== "tdee-calculator")].slice(0, 10);
      localStorage.setItem("recentCalculators", JSON.stringify(updated));
    } catch {}
  }, []);

  const displayWeight = useKg ? weightKg : Math.round(weightKg * 2.2046);
  const displayHeight = useCm ? heightCm : Math.round(heightCm / 2.54);

  const handleWeightChange = (val: number) => setWeightKg(useKg ? val : Math.round(val / 2.2046));
  const handleHeightChange = (val: number) => setHeightCm(useCm ? val : Math.round(val * 2.54));

  const fmt = (v: number) => new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(v);

  const results = useMemo(() => {
    const bmr = gender === "male"
      ? 10 * weightKg + 6.25 * heightCm - 5 * age + 5
      : 10 * weightKg + 6.25 * heightCm - 5 * age - 161;
    const multiplier = ACTIVITY_CONFIG.find(a => a.key === activityLevel)!.multiplier;
    const tdee = Math.round(bmr * multiplier);
    return {
      bmr: Math.round(bmr),
      tdee,
      lose1lb: tdee - 500,
      loseHalfLb: tdee - 250,
      gainHalfLb: tdee + 250,
      gain1lb: tdee + 500,
    };
  }, [age, gender, weightKg, heightCm, activityLevel]);

  const chartData = useMemo(() => {
    const bmr = gender === "male"
      ? 10 * weightKg + 6.25 * heightCm - 5 * age + 5
      : 10 * weightKg + 6.25 * heightCm - 5 * age - 161;
    return ACTIVITY_CONFIG.map(a => ({
      name: a.short,
      tdee: Math.round(bmr * a.multiplier),
      isActive: a.key === activityLevel,
    }));
  }, [age, gender, weightKg, heightCm, activityLevel]);

  const weightSliderMin = useKg ? 40 : 88;
  const weightSliderMax = useKg ? 200 : 440;
  const heightSliderMin = useCm ? 140 : 55;
  const heightSliderMax = useCm ? 210 : 83;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumbs items={[
        { label: "Health Calculators", href: "/health-calculators" },
        { label: "TDEE Calculator", href: "/calculators/health/tdee-calculator" },
      ]} />

      <div className="mb-6 flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">TDEE Calculator</h1>
          <p className="text-base text-gray-600">Calculate your Total Daily Energy Expenditure — the calories you burn each day — using the Mifflin-St Jeor equation.</p>
        </div>
        <button onClick={() => window.print()} className="print:hidden flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg transition-colors">
          <span className="text-sm">↓</span> Download PDF
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Inputs */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200 space-y-5">
          <h2 className="text-lg font-semibold text-gray-800">Your Details</h2>

          {/* Gender */}
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-2 block">Biological Sex</label>
            <div className="flex gap-3">
              {(["male", "female"] as Gender[]).map(g => (
                <button
                  key={g}
                  onClick={() => setGender(g)}
                  className={`flex-1 py-2 text-sm font-medium rounded-lg border transition-colors capitalize ${
                    gender === g ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>

          {/* Age */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-semibold text-gray-700">Age</label>
              <input type="number" value={age} onChange={e => setAge(Math.max(15, Math.min(80, Number(e.target.value) || 15)))}
                className="w-24 px-2 py-1.5 text-right border border-gray-300 rounded-md text-sm font-semibold text-blue-600 focus:ring-2 focus:ring-blue-500" />
            </div>
            <input type="range" min={15} max={80} step={1} value={age} onChange={e => setAge(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600" />
            <div className="flex justify-between text-xs text-gray-400 mt-1"><span>15</span><span>80</span></div>
          </div>

          {/* Weight */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-semibold text-gray-700">Weight</label>
              <div className="flex items-center gap-2">
                <input type="number" value={displayWeight} onChange={e => handleWeightChange(Number(e.target.value) || 0)}
                  className="w-20 px-2 py-1.5 text-right border border-gray-300 rounded-md text-sm font-semibold text-blue-600 focus:ring-2 focus:ring-blue-500" />
                <button onClick={() => setUseKg(!useKg)}
                  className="px-2 py-1.5 text-xs font-medium border border-gray-300 rounded-md bg-gray-50 hover:bg-gray-100 transition-colors">
                  {useKg ? "kg" : "lb"}
                </button>
              </div>
            </div>
            <input type="range" min={weightSliderMin} max={weightSliderMax} step={1} value={displayWeight}
              onChange={e => handleWeightChange(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600" />
            <div className="flex justify-between text-xs text-gray-400 mt-1"><span>{weightSliderMin}</span><span>{weightSliderMax}</span></div>
          </div>

          {/* Height */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-semibold text-gray-700">Height</label>
              <div className="flex items-center gap-2">
                <input type="number" value={displayHeight} onChange={e => handleHeightChange(Number(e.target.value) || 0)}
                  className="w-20 px-2 py-1.5 text-right border border-gray-300 rounded-md text-sm font-semibold text-blue-600 focus:ring-2 focus:ring-blue-500" />
                <button onClick={() => setUseCm(!useCm)}
                  className="px-2 py-1.5 text-xs font-medium border border-gray-300 rounded-md bg-gray-50 hover:bg-gray-100 transition-colors">
                  {useCm ? "cm" : "in"}
                </button>
              </div>
            </div>
            <input type="range" min={heightSliderMin} max={heightSliderMax} step={1} value={displayHeight}
              onChange={e => handleHeightChange(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600" />
            <div className="flex justify-between text-xs text-gray-400 mt-1"><span>{heightSliderMin}</span><span>{heightSliderMax}</span></div>
          </div>

          {/* Activity */}
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-2 block">Activity Level</label>
            <div className="space-y-2">
              {ACTIVITY_CONFIG.map(a => (
                <button key={a.key} onClick={() => setActivityLevel(a.key)}
                  className={`w-full text-left px-3 py-2 text-sm rounded-lg border transition-colors ${
                    activityLevel === a.key ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                  }`}>
                  {a.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results */}
        <div id="results" className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Your Energy Expenditure</h2>

          <div className="bg-gray-50 rounded-lg p-3 mb-3 border border-gray-200">
            <div className="text-xs text-gray-500 mb-1">Basal Metabolic Rate (BMR)</div>
            <div className="text-lg font-bold text-gray-700">{fmt(results.bmr)} kcal/day</div>
            <div className="text-xs text-gray-400">Calories burned at complete rest</div>
          </div>

          <div className="bg-green-50 rounded-lg p-4 mb-4 text-center border border-green-100">
            <div className="text-xs text-gray-500 mb-1">TDEE — Maintenance Calories</div>
            <div className="text-4xl font-bold text-green-700">{fmt(results.tdee)}</div>
            <div className="text-xs text-gray-400 mt-1">kcal/day to maintain current weight</div>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-red-50 rounded-lg p-3 border border-red-100">
              <div className="text-xs text-gray-500 mb-1">Lose 1 lb/week</div>
              <div className="text-lg font-bold text-red-600">{fmt(results.lose1lb)}</div>
              <div className="text-xs text-gray-400">−500 cal/day</div>
            </div>
            <div className="bg-orange-50 rounded-lg p-3 border border-orange-100">
              <div className="text-xs text-gray-500 mb-1">Lose 0.5 lb/week</div>
              <div className="text-lg font-bold text-orange-600">{fmt(results.loseHalfLb)}</div>
              <div className="text-xs text-gray-400">−250 cal/day</div>
            </div>
            <div className="bg-blue-50 rounded-lg p-3 border border-blue-100">
              <div className="text-xs text-gray-500 mb-1">Gain 0.5 lb/week</div>
              <div className="text-lg font-bold text-blue-600">{fmt(results.gainHalfLb)}</div>
              <div className="text-xs text-gray-400">+250 cal/day</div>
            </div>
            <div className="bg-purple-50 rounded-lg p-3 border border-purple-100">
              <div className="text-xs text-gray-500 mb-1">Gain 1 lb/week</div>
              <div className="text-lg font-bold text-purple-600">{fmt(results.gain1lb)}</div>
              <div className="text-xs text-gray-400">+500 cal/day</div>
            </div>
          </div>

          <div className="border-t border-gray-100 pt-4">
            <p className="text-xs text-gray-500 mb-2">TDEE comparison across activity levels</p>
            <ResponsiveContainer width="100%" height={140}>
              <BarChart data={chartData} barCategoryGap="30%">
                <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} width={45} />
                <Tooltip formatter={(v: number) => [`${v} kcal`, "TDEE"]} />
                <Bar dataKey="tdee" radius={[4, 4, 0, 0]}>
                  {chartData.map((entry, idx) => (
                    <Cell key={idx} fill={entry.isActive ? "#16a34a" : "#93c5fd"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <CalculatorLayout
        title=""
        description=""
        explanation={
          <div className="space-y-4 text-sm text-gray-700 leading-relaxed">
            <p>
              Your Total Daily Energy Expenditure (TDEE) is the total number of calories your body burns in 24 hours —
              the true maintenance figure that sits at the heart of every nutrition strategy. Get it right and you have
              a precise starting point for fat loss, muscle gain, or performance. Get it wrong and months of effort can
              stall for no apparent reason.
            </p>
            <p>
              <strong>What Actually Makes Up Your TDEE</strong><br />
              TDEE has four components. Your Basal Metabolic Rate (BMR) — what the calculator shows first — accounts for
              roughly 60–75% and represents the energy your body burns just to stay alive: heartbeat, breathing,
              temperature regulation, organ function. Exercise activity (EA) adds another 15–30% for most people.
              Diet-induced thermogenesis (DIT) contributes around 10% — your body burns calories just digesting food,
              particularly protein. The fourth and most underappreciated component is Non-Exercise Activity Thermogenesis (NEAT).
            </p>
            <p>
              <strong>NEAT: The Hidden Variable</strong><br />
              NEAT encompasses every movement that is not formal exercise — fidgeting, walking to your car, standing at your
              desk, gesturing while talking. Research by Dr. James Levine at the Mayo Clinic found that NEAT can vary by up
              to 2,000 calories per day between two people of similar size. Lean people tend to fidget and move spontaneously
              far more than sedentary individuals — and this explains much of why some people seem to "eat whatever they want"
              without gaining weight. NEAT is also the first thing that drops when you diet, partly explaining why weight loss
              slows after several weeks.
            </p>
            <p>
              <strong>Adaptive Thermogenesis: Why Your Metabolism Fights Back</strong><br />
              When you eat in a prolonged calorie deficit, your body responds by reducing TDEE by 5–15% beyond what simple
              weight loss would predict. This adaptive thermogenesis (sometimes called metabolic adaptation) occurs through
              reduced NEAT, lowered thyroid hormone output, and decreased thermogenesis. A 500 cal/day deficit that should
              theoretically produce 0.5 kg of fat loss per week often produces less over time — not because of "broken
              metabolism," but because the body is defending its weight. Diet breaks and refeeds partially reverse this adaptation.
            </p>
            <p>
              <strong>Mifflin-St Jeor vs. Harris-Benedict</strong><br />
              The Mifflin-St Jeor equation (1990) is the formula used here and is consistently the most accurate for most
              populations, validated against indirect calorimetry in multiple studies. The older Harris-Benedict equation
              (1919, revised 1984) tends to overestimate BMR by about 5% in modern, less physically active populations.
              For very obese individuals, the Katch-McArdle formula (which uses lean body mass rather than total weight)
              can be more accurate, but it requires body fat percentage measurement.
            </p>
            <p>
              <strong>Why Fitness Trackers Overestimate Burn</strong><br />
              Wrist-based wearables (Apple Watch, Fitbit, Garmin) consistently overestimate calorie burn during exercise
              by 15–40% in published validation studies. They also tend to overestimate NEAT. This creates a systematic
              error: people eat back "exercise calories" they did not fully burn, inadvertently eating at maintenance or even
              a surplus while believing they are in a deficit. If you use a tracker, consider eating back only 50–70% of
              reported exercise calories until you have 4–6 weeks of scale data to calibrate against.
            </p>
            <p>
              <strong>Formula Limitations for Muscular Individuals</strong><br />
              The Mifflin formula uses total body weight, which means very muscular individuals (bodybuilders, strength
              athletes) will have their BMR underestimated — muscle is metabolically expensive tissue that burns more
              calories at rest than fat. Conversely, the formula slightly overestimates BMR for individuals carrying
              significant excess body fat. If you are considerably above or below average body fat levels, treat these
              numbers as a starting estimate and adjust based on 2–3 weeks of actual intake versus weight change data.
            </p>
          </div>
        }
        faqs={[
          {
            question: "Why does my TDEE change when I diet?",
            answer: "This is adaptive thermogenesis — your body's biological defence against starvation. When you eat below maintenance for extended periods, your body reduces NEAT (spontaneous movement decreases), lowers thyroid hormone output, and reduces the thermogenic effect of food. The result is a TDEE that can drop 10–15% below what the formula predicts. This is why weight loss often slows after 8–12 weeks even with consistent calorie intake.",
          },
          {
            question: "Is TDEE the same as maintenance calories?",
            answer: "Yes. TDEE represents the total calories your body expends over 24 hours including all activity. Eating exactly at your TDEE means your weight remains stable over time. Eating below TDEE creates a deficit (weight loss); eating above creates a surplus (weight gain). The terms are interchangeable in practical nutrition planning.",
          },
          {
            question: "Why is my TDEE different from what my fitness tracker shows?",
            answer: "Fitness trackers overestimate calorie burn during exercise by 15–40% and also inflate NEAT estimates. They use optical heart rate sensors and accelerometers, which introduce significant error especially during strength training and cycling. Your calculated TDEE is a better starting baseline — use scale weight changes over 2–3 weeks to verify and fine-tune your actual maintenance level.",
          },
          {
            question: "Should I eat back exercise calories?",
            answer: "It depends on how you set your activity level. If you selected your true activity level (including workouts) when calculating TDEE, then no — exercise is already accounted for. If you selected 'Sedentary' and do additional workouts, you can eat back a portion of those calories. The safest approach: set activity level accurately, do not eat back tracked exercise calories, and adjust based on weekly scale trends.",
          },
          {
            question: "How accurate is the Mifflin-St Jeor formula?",
            answer: "Studies show Mifflin-St Jeor predicts BMR within 10% of measured values for roughly 80% of people. It tends to be most accurate for average body composition adults aged 20–60. It underestimates for very muscular individuals (who have more metabolically active tissue) and overestimates slightly for people with high body fat percentages. Treat the result as a starting estimate and calibrate based on real-world weight change over 3–4 weeks.",
          },
        ]}
        relatedCalculators={[
          { name: "Protein Calculator", href: "/calculators/health/protein-calculator" },
          { name: "Macro Calculator", href: "/calculators/health/macro-calculator" },
          { name: "BMR Calculator", href: "/calculators/health/bmr-calculator" },
        ]}
      >
        <div />
      </CalculatorLayout>

      <MobileResultBar
        label="TDEE"
        value={`${fmt(results.tdee)} kcal/day · BMR ${fmt(results.bmr)}`}
        tone="positive"
        targetId="results"
        show={true}
      />
    </div>
  );
}
