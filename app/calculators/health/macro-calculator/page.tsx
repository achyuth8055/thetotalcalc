"use client";
import { useState, useEffect, useMemo } from "react";
import Breadcrumbs from "@/components/Breadcrumbs";
import CalculatorLayout from "@/components/CalculatorLayout";
import MobileResultBar from "@/components/calculators/MobileResultBar";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

type Goal = "lose" | "maintain" | "build";
type DietStyle = "balanced" | "lowcarb" | "keto" | "highprotein";

const DIET_PRESETS: Record<DietStyle, { protein: number; fat: number }> = {
  balanced:    { protein: 30, fat: 30 },
  lowcarb:     { protein: 35, fat: 45 },
  keto:        { protein: 25, fat: 70 },
  highprotein: { protein: 40, fat: 30 },
};

const GOAL_LABELS: Record<Goal, string> = {
  lose: "Lose Fat",
  maintain: "Maintain",
  build: "Build Muscle",
};

const DIET_LABELS: Record<DietStyle, string> = {
  balanced: "Balanced",
  lowcarb: "Low-Carb",
  keto: "Keto",
  highprotein: "High-Protein",
};

const PIE_COLORS = { protein: "#3b82f6", carbs: "#22c55e", fat: "#f59e0b" };

export default function MacroCalculator() {
  const [tdee, setTdee] = useState(2000);
  const [goal, setGoal] = useState<Goal>("maintain");
  const [dietStyle, setDietStyle] = useState<DietStyle>("balanced");
  const [proteinPct, setProteinPct] = useState(30);
  const [fatPct, setFatPct] = useState(30);

  useEffect(() => {
    try {
      const recent = JSON.parse(localStorage.getItem("recentCalculators") || "[]");
      const updated = ["macro-calculator", ...recent.filter((id: string) => id !== "macro-calculator")].slice(0, 10);
      localStorage.setItem("recentCalculators", JSON.stringify(updated));
    } catch {}
  }, []);

  const handleDietStyleChange = (style: DietStyle) => {
    setDietStyle(style);
    setProteinPct(DIET_PRESETS[style].protein);
    setFatPct(DIET_PRESETS[style].fat);
  };

  const carbPct = Math.max(0, 100 - proteinPct - fatPct);

  const fmt = (v: number) => new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(v);

  const results = useMemo(() => {
    const proteinG = Math.round((tdee * proteinPct) / 100 / 4);
    const fatG = Math.round((tdee * fatPct) / 100 / 9);
    const carbG = Math.round((tdee * carbPct) / 100 / 4);
    const proteinCal = proteinG * 4;
    const fatCal = fatG * 9;
    const carbCal = carbG * 4;
    const fiber = Math.round((tdee / 1000) * 14);
    return { proteinG, fatG, carbG, proteinCal, fatCal, carbCal, fiber };
  }, [tdee, proteinPct, fatPct, carbPct]);

  const pieData = [
    { name: "Protein", value: results.proteinCal, color: PIE_COLORS.protein },
    { name: "Carbs",   value: results.carbCal,    color: PIE_COLORS.carbs },
    { name: "Fat",     value: results.fatCal,     color: PIE_COLORS.fat },
  ];

  const handleProteinChange = (val: number) => {
    const capped = Math.min(val, 100 - fatPct);
    setProteinPct(capped);
  };

  const handleFatChange = (val: number) => {
    const capped = Math.min(val, 100 - proteinPct);
    setFatPct(capped);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumbs items={[
        { label: "Health Calculators", href: "/health-calculators" },
        { label: "Macro Calculator", href: "/calculators/health/macro-calculator" },
      ]} />

      <div className="mb-6 flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Macro Calculator</h1>
          <p className="text-base text-gray-600">Calculate your daily protein, carbohydrate, and fat targets from your calorie goal.</p>
        </div>
        <button onClick={() => window.print()} className="print:hidden flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg transition-colors">
          <span className="text-sm">↓</span> Download PDF
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Inputs */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200 space-y-5">
          <h2 className="text-lg font-semibold text-gray-800">Your Settings</h2>

          {/* TDEE */}
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-2 block">Daily Calorie Target (TDEE)</label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={tdee}
                onChange={e => setTdee(Math.max(800, Math.min(6000, Number(e.target.value) || 2000)))}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm font-semibold text-blue-600 focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-500 font-medium">kcal</span>
            </div>
            <p className="text-xs text-gray-400 mt-1">Use our TDEE Calculator to find your maintenance calories</p>
          </div>

          {/* Goal */}
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-2 block">Goal</label>
            <div className="flex gap-2">
              {(["lose", "maintain", "build"] as Goal[]).map(g => (
                <button key={g} onClick={() => setGoal(g)}
                  className={`flex-1 py-2 text-sm font-medium rounded-lg border transition-colors ${
                    goal === g ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                  }`}>
                  {GOAL_LABELS[g]}
                </button>
              ))}
            </div>
          </div>

          {/* Diet Style */}
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-2 block">Diet Style (applies preset ratios)</label>
            <div className="grid grid-cols-2 gap-2">
              {(["balanced", "lowcarb", "keto", "highprotein"] as DietStyle[]).map(d => (
                <button key={d} onClick={() => handleDietStyleChange(d)}
                  className={`py-2 text-sm font-medium rounded-lg border transition-colors ${
                    dietStyle === d ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                  }`}>
                  {DIET_LABELS[d]}
                </button>
              ))}
            </div>
          </div>

          {/* Protein % */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-semibold text-gray-700">Protein %</label>
              <input type="number" value={proteinPct} onChange={e => handleProteinChange(Number(e.target.value) || 0)}
                className="w-20 px-2 py-1.5 text-right border border-gray-300 rounded-md text-sm font-semibold text-blue-600 focus:ring-2 focus:ring-blue-500" />
            </div>
            <input type="range" min={10} max={50} step={1} value={proteinPct} onChange={e => handleProteinChange(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600" />
            <div className="flex justify-between text-xs text-gray-400 mt-1"><span>10%</span><span>50%</span></div>
          </div>

          {/* Fat % */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-semibold text-gray-700">Fat %</label>
              <input type="number" value={fatPct} onChange={e => handleFatChange(Number(e.target.value) || 0)}
                className="w-20 px-2 py-1.5 text-right border border-gray-300 rounded-md text-sm font-semibold text-blue-600 focus:ring-2 focus:ring-blue-500" />
            </div>
            <input type="range" min={10} max={60} step={1} value={fatPct} onChange={e => handleFatChange(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600" />
            <div className="flex justify-between text-xs text-gray-400 mt-1"><span>10%</span><span>60%</span></div>
          </div>

          {/* Carb % read-only */}
          <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
            <div className="flex justify-between items-center">
              <span className="text-sm font-semibold text-gray-700">Carbs % (auto)</span>
              <span className="text-lg font-bold text-green-600">{carbPct}%</span>
            </div>
            <p className="text-xs text-gray-400 mt-1">Remaining after protein + fat</p>
          </div>
        </div>

        {/* Results */}
        <div id="results" className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Your Daily Macros</h2>

          <div className="bg-green-50 rounded-lg p-3 mb-4 text-center border border-green-100">
            <div className="text-xs text-gray-500 mb-1">Daily Calories</div>
            <div className="text-3xl font-bold text-green-700">{fmt(tdee)} kcal</div>
          </div>

          <div className="space-y-3 mb-4">
            <div className="flex items-center gap-3 bg-blue-50 rounded-lg p-3">
              <div className="w-3 h-3 rounded-full bg-blue-500 flex-shrink-0" />
              <div className="flex-1">
                <div className="text-xs text-gray-500">Protein</div>
                <div className="text-lg font-bold text-blue-700">{fmt(results.proteinG)}g</div>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium text-gray-600">{fmt(results.proteinCal)} kcal</div>
                <div className="text-xs text-gray-400">{proteinPct}%</div>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-green-50 rounded-lg p-3">
              <div className="w-3 h-3 rounded-full bg-green-500 flex-shrink-0" />
              <div className="flex-1">
                <div className="text-xs text-gray-500">Carbohydrates</div>
                <div className="text-lg font-bold text-green-700">{fmt(results.carbG)}g</div>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium text-gray-600">{fmt(results.carbCal)} kcal</div>
                <div className="text-xs text-gray-400">{carbPct}%</div>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-amber-50 rounded-lg p-3">
              <div className="w-3 h-3 rounded-full bg-amber-500 flex-shrink-0" />
              <div className="flex-1">
                <div className="text-xs text-gray-500">Fat</div>
                <div className="text-lg font-bold text-amber-700">{fmt(results.fatG)}g</div>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium text-gray-600">{fmt(results.fatCal)} kcal</div>
                <div className="text-xs text-gray-400">{fatPct}%</div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
              <div className="text-xs text-gray-500 mb-1">Fiber Recommendation</div>
              <div className="text-lg font-bold text-gray-700">{results.fiber}g/day</div>
              <div className="text-xs text-gray-400">14g per 1,000 kcal (dietary guidelines)</div>
            </div>
          </div>

          <div className="border-t border-gray-100 pt-4">
            <p className="text-xs text-gray-500 mb-3">Macro split by calories</p>
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={75}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {pieData.map((entry, idx) => (
                    <Cell key={idx} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(v: number) => [`${v} kcal`]} />
                <Legend iconType="circle" iconSize={10} />
              </PieChart>
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
              Counting macros — protein, carbohydrates, and fat — is a more nuanced approach to nutrition than simply
              tracking total calories. It gives you control over body composition, not just body weight. Two people eating
              2,000 calories can have dramatically different physiques if their macro ratios differ, because each
              macronutrient has distinct metabolic roles beyond pure energy.
            </p>
            <p>
              <strong>IIFYM vs. Clean Eating</strong><br />
              "If It Fits Your Macros" (IIFYM) is the philosophy that food choices matter less than macro totals — a
              position backed by controlled research showing that calorie-and-protein-matched diets produce similar fat
              loss regardless of food quality. Clean eating advocates argue that micronutrients, fiber, and food processing
              affect hormones and gut health in ways that calorie math does not capture. The truth is somewhere between: macro
              tracking ensures you hit quantitative targets, while food quality determines whether you get adequate
              micronutrients, fiber, and satiety. Both matter.
            </p>
            <p>
              <strong>Carbohydrates and Insulin: Debunking the Villain Narrative</strong><br />
              The idea that carbohydrates cause fat gain through insulin spikes has been widely popularised but is
              inconsistent with the controlled evidence. In metabolic ward studies where calories and protein are matched,
              low-carb and high-carb diets produce equivalent fat loss. Insulin is a storage hormone, yes — but it also
              strongly suppresses appetite. The main reason low-carb diets work for many people is improved satiety and
              reduced overall calorie intake, not some unique metabolic advantage of lowering insulin per se.
            </p>
            <p>
              <strong>Dietary Fat and Hormones</strong><br />
              Fat is uniquely critical for hormone production. Steroid hormones — testosterone, estrogen, cortisol, DHEA —
              are all synthesised from cholesterol, which requires adequate dietary fat. Studies in male athletes show that
              dropping fat intake below 15% of calories significantly reduces free testosterone levels. This is why keto
              and high-fat diets often maintain hormonal health better than extremely low-fat approaches, despite the
              popular assumption that dietary fat is harmful. Essential fatty acids (omega-3 and omega-6) also regulate
              inflammation, cell membrane integrity, and brain function.
            </p>
            <p>
              <strong>Fiber: The Underappreciated Fourth Macro</strong><br />
              Fiber is technically a carbohydrate, but it deserves its own consideration. Soluble fiber (oats, beans,
              apples) forms a gel in your gut that slows glucose absorption and feeds beneficial bacteria. Insoluble fiber
              (vegetables, whole grains) adds bulk and promotes motility. The recommended 14g per 1,000 calories is a
              minimum — populations with historically low rates of colon cancer consume 30–50g daily. Fiber also adds
              significant satiety without contributing meaningfully to calorie intake, which makes high-fiber foods
              invaluable in fat loss phases.
            </p>
            <p>
              <strong>Tracking Apps and Practical Strategies</strong><br />
              Apps like MyFitnessPal and Cronometer make macro tracking feasible. The key discipline is weighing food
              on a kitchen scale rather than estimating portions — visual estimates of calorie-dense foods like nuts,
              oils, and cheese are notoriously inaccurate. If weight loss stalls after 3–4 weeks on a deficit, consider
              a 2-week diet break at maintenance before resuming. This partially reverses adaptive thermogenesis and
              often restarts progress.
            </p>
            <p>
              <strong>Carb Cycling: Periodising Your Macros</strong><br />
              Advanced athletes sometimes cycle carbohydrates — eating more on training days (when glycogen demands are
              higher) and less on rest days. This can optimise muscle glycogen without chronically high carb intake.
              For most people, daily consistency matters far more than day-to-day variation. Carb cycling is a refinement
              strategy, not a foundation. Start with consistent daily targets before experimenting with cycling.
            </p>
          </div>
        }
        faqs={[
          {
            question: "What's the difference between macros and calories?",
            answer: "Calories are a measure of total energy. Macros (protein, carbs, fat) are the three categories of nutrients that provide those calories. Protein and carbs each provide 4 calories per gram; fat provides 9 calories per gram. Counting macros automatically controls calories, but also controls the ratio of nutrients — which affects body composition, hormones, and satiety differently than calorie counting alone.",
          },
          {
            question: "Is counting macros better than just counting calories?",
            answer: "For body composition goals (building muscle while losing fat, or vice versa), macro tracking is more precise. It ensures you preserve muscle with adequate protein, maintain hormonal health with sufficient fat, and fuel performance with appropriate carbs. For simple weight management without body composition concerns, calorie counting alone is often sufficient and simpler to maintain.",
          },
          {
            question: "What are net carbs?",
            answer: "Net carbs are total carbohydrates minus dietary fiber. Since fiber is indigestible and does not raise blood glucose, it is excluded from net carb calculations — particularly relevant on ketogenic diets where carb limits are strict. Sugar alcohols (like erythritol) are sometimes also subtracted, though their impact varies. This calculator uses total carbs, not net carbs.",
          },
          {
            question: "How long does it take to see results from macro tracking?",
            answer: "Meaningful body composition changes — visible changes in muscle definition or fat distribution — typically take 8–12 weeks of consistent tracking. Weight changes on the scale can appear in 1–2 weeks, but this often reflects water and glycogen fluctuations rather than actual fat change. A DEXA scan at 12 weeks compared to baseline is the most accurate way to measure true body composition change.",
          },
          {
            question: "Can I build muscle on a plant-based diet?",
            answer: "Yes, absolutely. The key requirements are meeting total protein targets (possibly 10–20% higher than omnivore targets to account for digestibility), prioritising leucine-rich plant sources (edamame, tempeh, pumpkin seeds, soy protein), and combining varied protein sources throughout the day. Creatine supplementation — often lower in plant-based eaters due to its absence in plant foods — has strong evidence for supporting strength and muscle gain.",
          },
        ]}
        relatedCalculators={[
          { name: "TDEE Calculator", href: "/calculators/health/tdee-calculator" },
          { name: "Protein Calculator", href: "/calculators/health/protein-calculator" },
          { name: "Calorie Deficit Calculator", href: "/calculators/health/calorie-deficit-calculator" },
        ]}
      >
        <div />
      </CalculatorLayout>

      <MobileResultBar
        label="Daily Macros"
        value={`P: ${fmt(results.proteinG)}g · C: ${fmt(results.carbG)}g · F: ${fmt(results.fatG)}g`}
        tone="positive"
        targetId="results"
        show={true}
      />
    </div>
  );
}
