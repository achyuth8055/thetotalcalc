"use client";
import { useState, useEffect, useMemo } from "react";
import Breadcrumbs from "@/components/Breadcrumbs";
import CalculatorLayout from "@/components/CalculatorLayout";
import MobileResultBar from "@/components/calculators/MobileResultBar";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

type Goal = "maintain" | "build" | "lose" | "athletic";
type Activity = "sedentary" | "light" | "moderate" | "active" | "athlete";

const PROTEIN_TABLE: Record<Goal, Record<Activity, number>> = {
  maintain:  { sedentary: 0.8, light: 1.0, moderate: 1.2, active: 1.4, athlete: 1.6 },
  build:     { sedentary: 1.6, light: 1.8, moderate: 2.0, active: 2.2, athlete: 2.4 },
  lose:      { sedentary: 1.8, light: 2.0, moderate: 2.2, active: 2.4, athlete: 2.6 },
  athletic:  { sedentary: 2.0, light: 2.2, moderate: 2.4, active: 2.6, athlete: 3.0 },
};

const GOAL_LABELS: Record<Goal, string> = {
  maintain: "Maintain Muscle",
  build: "Build Muscle",
  lose: "Lose Fat",
  athletic: "Athletic Performance",
};

const ACTIVITY_LABELS: Record<Activity, string> = {
  sedentary: "Sedentary",
  light: "Lightly Active",
  moderate: "Moderately Active",
  active: "Very Active",
  athlete: "Athlete",
};

export default function ProteinCalculator() {
  const [weightKg, setWeightKg] = useState(75);
  const [useKg, setUseKg] = useState(true);
  const [goal, setGoal] = useState<Goal>("build");
  const [activity, setActivity] = useState<Activity>("moderate");

  useEffect(() => {
    try {
      const recent = JSON.parse(localStorage.getItem("recentCalculators") || "[]");
      const updated = ["protein-calculator", ...recent.filter((id: string) => id !== "protein-calculator")].slice(0, 10);
      localStorage.setItem("recentCalculators", JSON.stringify(updated));
    } catch {}
  }, []);

  const displayWeight = useKg ? weightKg : Math.round(weightKg * 2.2046);

  const handleWeightChange = (val: number) => {
    setWeightKg(useKg ? val : Math.round(val / 2.2046));
  };

  const fmt = (v: number) => new Intl.NumberFormat("en-US", { maximumFractionDigits: 1 }).format(v);

  const results = useMemo(() => {
    const multiplier = PROTEIN_TABLE[goal][activity];
    const daily = Math.round(weightKg * multiplier);
    const perMeal = Math.round(daily / 4);
    const calories = daily * 4;
    const pct = ((calories / 2000) * 100).toFixed(1);
    return { daily, perMeal, calories, pct };
  }, [weightKg, goal, activity]);

  const chartData = useMemo(() => {
    return (["maintain", "build", "lose", "athletic"] as Goal[]).map((g) => ({
      name: g === "maintain" ? "Maintain" : g === "build" ? "Build" : g === "lose" ? "Lose Fat" : "Athletic",
      grams: Math.round(weightKg * PROTEIN_TABLE[g][activity]),
      isActive: g === goal,
    }));
  }, [weightKg, goal, activity]);

  const sliderMin = useKg ? 40 : 88;
  const sliderMax = useKg ? 200 : 440;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumbs items={[
        { label: "Health Calculators", href: "/health-calculators" },
        { label: "Protein Calculator", href: "/calculators/health/protein-calculator" },
      ]} />

      <div className="mb-6 flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Protein Calculator</h1>
          <p className="text-base text-gray-600">Find your daily protein target based on your body weight, goal, and activity level.</p>
        </div>
        <button onClick={() => window.print()} className="print:hidden flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg transition-colors">
          <span className="text-sm">↓</span> Download PDF
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Inputs */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200 space-y-5">
          <h2 className="text-lg font-semibold text-gray-800">Your Details</h2>

          {/* Weight */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-semibold text-gray-700">Body Weight</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={displayWeight}
                  onChange={e => handleWeightChange(Number(e.target.value) || 0)}
                  className="w-20 px-2 py-1.5 text-right border border-gray-300 rounded-md text-sm font-semibold text-blue-600 focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={() => setUseKg(!useKg)}
                  className="px-2 py-1.5 text-xs font-medium border border-gray-300 rounded-md bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  {useKg ? "kg" : "lb"}
                </button>
              </div>
            </div>
            <input
              type="range"
              min={sliderMin}
              max={sliderMax}
              step={1}
              value={displayWeight}
              onChange={e => handleWeightChange(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>{sliderMin} {useKg ? "kg" : "lb"}</span>
              <span>{sliderMax} {useKg ? "kg" : "lb"}</span>
            </div>
          </div>

          {/* Goal */}
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-2 block">Goal</label>
            <div className="grid grid-cols-2 gap-2">
              {(["maintain", "build", "lose", "athletic"] as Goal[]).map(g => (
                <button
                  key={g}
                  onClick={() => setGoal(g)}
                  className={`px-3 py-2 text-sm font-medium rounded-lg border transition-colors ${
                    goal === g
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  {GOAL_LABELS[g]}
                </button>
              ))}
            </div>
          </div>

          {/* Activity */}
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-2 block">Activity Level</label>
            <select
              value={activity}
              onChange={e => setActivity(e.target.value as Activity)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {(Object.keys(ACTIVITY_LABELS) as Activity[]).map(a => (
                <option key={a} value={a}>{ACTIVITY_LABELS[a]}</option>
              ))}
            </select>
          </div>

          <div className="bg-blue-50 rounded-lg p-3 text-xs text-blue-700">
            <strong>Multiplier used:</strong> {PROTEIN_TABLE[goal][activity]}g per kg bodyweight — based on current sports science consensus.
          </div>
        </div>

        {/* Results */}
        <div id="results" className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Your Protein Targets</h2>
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="col-span-2 bg-green-50 rounded-lg p-4 text-center border border-green-100">
              <div className="text-xs text-gray-500 mb-1">Daily Protein Target</div>
              <div className="text-4xl font-bold text-green-700">{fmt(results.daily)}g</div>
              <div className="text-xs text-gray-400 mt-1">{GOAL_LABELS[goal]} · {ACTIVITY_LABELS[activity]}</div>
            </div>
            <div className="bg-blue-50 rounded-lg p-3">
              <div className="text-xs text-gray-500 mb-1">Per Meal (÷4)</div>
              <div className="text-xl font-bold text-blue-700">{fmt(results.perMeal)}g</div>
            </div>
            <div className="bg-blue-50 rounded-lg p-3">
              <div className="text-xs text-gray-500 mb-1">Calories from Protein</div>
              <div className="text-xl font-bold text-blue-700">{fmt(results.calories)} kcal</div>
            </div>
            <div className="bg-blue-50 rounded-lg p-3 col-span-2">
              <div className="text-xs text-gray-500 mb-1">% of 2,000 cal diet</div>
              <div className="text-xl font-bold text-blue-700">{results.pct}%</div>
            </div>
          </div>

          <div className="border-t border-gray-100 pt-4">
            <p className="text-xs text-gray-500 mb-3">Comparison across goals (at current weight &amp; activity)</p>
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={chartData} barCategoryGap="30%">
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} unit="g" width={40} />
                <Tooltip formatter={(v: number) => [`${v}g`, "Protein"]} />
                <Bar dataKey="grams" radius={[4, 4, 0, 0]}>
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
              Protein is the only macronutrient your body cannot synthesize from scratch — every gram must come from food.
              But how much you actually need depends on a surprisingly complex interplay of body composition, training stimulus,
              and even your age. The numbers above are grounded in current sports science, not marketing materials.
            </p>
            <p>
              <strong>Muscle Protein Synthesis and the Leucine Threshold</strong><br />
              Each time you eat protein, your body triggers a process called muscle protein synthesis (MPS) — the cellular
              machinery that builds and repairs muscle fibres. MPS is gated by leucine, a branched-chain amino acid. Research
              shows you need roughly 2–3g of leucine per meal to maximally stimulate MPS. This explains why a single serving of
              chicken breast (about 30g protein, ~2.5g leucine) is effective, while a handful of peanuts (5g protein, ~0.4g leucine)
              barely moves the needle on its own.
            </p>
            <p>
              <strong>The Anabolic Window Is Wider Than You Think</strong><br />
              The idea that you must consume protein within 30 minutes post-workout — the so-called "anabolic window" — has been
              substantially revised. A 2013 meta-analysis by Aragon and Schoenfeld showed that total daily protein intake matters
              far more than precise timing. That said, spreading protein across 4–5 meals of roughly 25–40g each consistently
              outperforms concentrating it in one or two large servings, because each meal independently triggers an MPS spike that
              lasts approximately 3–5 hours.
            </p>
            <p>
              <strong>Protein Sources: What the Numbers Actually Say</strong><br />
              Not all protein is equal when scored by DIAAS (Digestibility-Corrected Amino Acid Score), which measures how well
              a protein meets human amino acid requirements after digestion. Chicken breast provides around 31g protein per 100g
              with a DIAAS near 1.0 (the maximum). Eggs deliver about 13g per 100g with excellent bioavailability. Greek yogurt
              contributes roughly 10g per 100g and is rich in leucine. Lentils offer about 9g per 100g but score lower on DIAAS
              due to limiting amino acids — though this is easily compensated by eating varied plant proteins across a day. Tofu
              provides around 8g per 100g with a DIAAS of 0.97, making it surprisingly competitive with animal sources when consumed
              in adequate quantities.
            </p>
            <p>
              <strong>Age Changes Everything</strong><br />
              Older adults (60+) experience anabolic resistance — the same leucine dose that fully stimulates MPS in a 25-year-old
              may only partially stimulate it at 65. This is why protein recommendations for older adults trend 20–30% higher than
              for younger populations. The current evidence-based recommendation for adults over 65 is 1.2–1.6g/kg, compared to
              0.8–1.2g/kg for sedentary younger adults. If you are over 60, consider moving one activity level up from your actual
              level when reading these results.
            </p>
            <p>
              <strong>Plant vs. Animal Protein</strong><br />
              If you eat animal foods, hitting your protein target is straightforward. Plant-based athletes need to be more strategic:
              combine sources across the day (legumes + grains, for example), prioritize leucine-rich plants like edamame, tempeh,
              and pumpkin seeds, and target the higher end of the recommended range to account for slightly lower digestibility.
              Soy is the plant protein most comparable to whey — both score near the top of DIAAS rankings.
            </p>
            <p>
              <strong>Does Excess Protein Harm Healthy Kidneys?</strong><br />
              Decades of research in healthy individuals show no evidence that high-protein diets (up to 3g/kg) damage kidney function.
              The concern stems from misapplied research on patients with pre-existing kidney disease, where protein restriction
              is sometimes warranted. For healthy people, excess protein is simply converted to glucose via gluconeogenesis or
              stored as fat — an inefficient process, which is actually one reason high-protein diets support fat loss.
            </p>
          </div>
        }
        faqs={[
          {
            question: "Can I eat too much protein?",
            answer: "In healthy individuals with normal kidney function, very high protein intakes (up to 3g/kg/day) have not been shown to cause harm. Excess protein is converted to glucose or stored as fat via an inefficient pathway — which means protein is the hardest macronutrient to overeat. People with pre-existing kidney disease should consult a physician before significantly increasing protein intake.",
          },
          {
            question: "Is protein timing important?",
            answer: "Timing matters less than total daily intake. The most important factor is hitting your daily target. That said, distributing protein across 4–5 meals of 25–40g each produces slightly better muscle protein synthesis outcomes than concentrating it in 1–2 large meals, because each meal triggers an independent anabolic response lasting 3–5 hours.",
          },
          {
            question: "Do plant proteins count the same as animal proteins?",
            answer: "Yes, if you eat a variety of plant sources and consume sufficient total protein. The main consideration is leucine content and digestibility. Soy, pumpkin seeds, tempeh, and edamame are the highest-leucine plant foods. Combining legumes with grains across a day fills amino acid gaps. Plant-based athletes typically benefit from targeting the upper end of recommended ranges.",
          },
          {
            question: "How much protein do I need to build muscle?",
            answer: "The evidence-based range for maximizing muscle hypertrophy is 1.6–2.2g per kg of bodyweight per day. Studies show minimal additional benefit beyond 2.2g/kg for most people. The higher end of this range may benefit those in a calorie deficit, as extra protein helps preserve muscle tissue while fat is lost.",
          },
          {
            question: "Does eating a lot of protein make you fat?",
            answer: "Protein has the highest thermic effect of any macronutrient — your body burns 25–30% of protein calories just during digestion, compared to 6–8% for carbs and 2–3% for fat. Protein also has the highest satiety per calorie, suppressing hunger hormones like ghrelin more effectively than carbs or fat. This combination makes it the hardest macronutrient to overeat.",
          },
        ]}
        relatedCalculators={[
          { name: "BMR Calculator", href: "/calculators/health/bmr-calculator" },
          { name: "TDEE Calculator", href: "/calculators/health/tdee-calculator" },
          { name: "Calorie Deficit Calculator", href: "/calculators/health/calorie-deficit-calculator" },
        ]}
      >
        <div />
      </CalculatorLayout>

      <MobileResultBar
        label="Daily Protein"
        value={`${fmt(results.daily)}g · ${results.pct}% of 2000 cal`}
        tone="positive"
        targetId="results"
        show={true}
      />
    </div>
  );
}
