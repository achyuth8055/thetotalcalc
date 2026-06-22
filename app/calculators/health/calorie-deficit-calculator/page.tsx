"use client";
import { useState, useEffect, useMemo } from "react";
import Breadcrumbs from "@/components/Breadcrumbs";
import CalculatorLayout from "@/components/CalculatorLayout";
import MobileResultBar from "@/components/calculators/MobileResultBar";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";

type LossRate = 0.25 | 0.5 | 1;

const LOSS_RATE_OPTIONS: { value: LossRate; label: string; description: string }[] = [
  { value: 0.25, label: "0.25 kg/wk", description: "Slow & sustainable" },
  { value: 0.5,  label: "0.5 kg/wk",  description: "Recommended" },
  { value: 1,    label: "1 kg/wk",    description: "Aggressive" },
];

const CALS_PER_KG = 7700;

export default function CalorieDeficitCalculator() {
  const [currentWeightKg, setCurrentWeightKg] = useState(80);
  const [goalWeightKg, setGoalWeightKg] = useState(70);
  const [useKg, setUseKg] = useState(true);
  const [tdee, setTdee] = useState(2200);
  const [lossRate, setLossRate] = useState<LossRate>(0.5);

  useEffect(() => {
    try {
      const recent = JSON.parse(localStorage.getItem("recentCalculators") || "[]");
      const updated = ["calorie-deficit-calculator", ...recent.filter((id: string) => id !== "calorie-deficit-calculator")].slice(0, 10);
      localStorage.setItem("recentCalculators", JSON.stringify(updated));
    } catch {}
  }, []);

  const fmt = (v: number) => new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(v);
  const fmtDate = (d: Date) => d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  const displayCurrentWeight = useKg ? currentWeightKg : Math.round(currentWeightKg * 2.2046);
  const displayGoalWeight    = useKg ? goalWeightKg    : Math.round(goalWeightKg * 2.2046);

  const handleCurrentWeightChange = (val: number) => setCurrentWeightKg(useKg ? val : Math.round(val / 2.2046));
  const handleGoalWeightChange    = (val: number) => setGoalWeightKg(useKg ? val : Math.round(val / 2.2046));

  const results = useMemo(() => {
    const weeklyDeficit = lossRate * CALS_PER_KG;
    const dailyDeficit  = Math.round(weeklyDeficit / 7);
    const dailyCalories = tdee - dailyDeficit;
    const weightToLose  = Math.max(0, currentWeightKg - goalWeightKg);
    const weeksToGoal   = weightToLose > 0 ? weightToLose / lossRate : 0;
    const targetDate    = new Date();
    targetDate.setDate(targetDate.getDate() + Math.round(weeksToGoal * 7));
    const totalCaloriesToBurn = Math.round(weightToLose * CALS_PER_KG);
    const unsafe = dailyCalories < 1200;
    return {
      weeklyDeficit: Math.round(weeklyDeficit),
      dailyDeficit,
      dailyCalories,
      weeksToGoal: Math.round(weeksToGoal * 10) / 10,
      targetDate,
      totalCaloriesToBurn,
      unsafe,
    };
  }, [currentWeightKg, goalWeightKg, tdee, lossRate]);

  const chartData = useMemo(() => {
    const weeks = Math.ceil(results.weeksToGoal);
    if (weeks <= 0) return [];
    const points = [];
    const intervalStep = Math.max(1, Math.ceil(weeks / 6));
    for (let w = 0; w <= Math.min(weeks, 52); w++) {
      points.push({
        week: w,
        weight: Math.max(goalWeightKg, currentWeightKg - w * lossRate),
        label: w % intervalStep === 0 ? `Wk ${w}` : "",
      });
    }
    return points;
  }, [currentWeightKg, goalWeightKg, lossRate, results.weeksToGoal]);

  const sliderMin = useKg ? 40 : 88;
  const sliderMax = useKg ? 200 : 440;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumbs items={[
        { label: "Health Calculators", href: "/health-calculators" },
        { label: "Calorie Deficit Calculator", href: "/calculators/health/calorie-deficit-calculator" },
      ]} />

      <div className="mb-6 flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Calorie Deficit Calculator</h1>
          <p className="text-base text-gray-600">Calculate your daily calorie target and projected timeline to reach your goal weight.</p>
        </div>
        <button onClick={() => window.print()} className="print:hidden flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg transition-colors">
          <span className="text-sm">↓</span> Download PDF
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Inputs */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200 space-y-5">
          <h2 className="text-lg font-semibold text-gray-800">Your Details</h2>

          {/* Unit toggle */}
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600">Units:</span>
            <button onClick={() => setUseKg(!useKg)}
              className="px-3 py-1.5 text-sm font-medium border border-gray-300 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
              {useKg ? "Metric (kg)" : "Imperial (lb)"}
            </button>
          </div>

          {/* Current Weight */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-semibold text-gray-700">Current Weight ({useKg ? "kg" : "lb"})</label>
              <input type="number" value={displayCurrentWeight} onChange={e => handleCurrentWeightChange(Number(e.target.value) || 0)}
                className="w-24 px-2 py-1.5 text-right border border-gray-300 rounded-md text-sm font-semibold text-blue-600 focus:ring-2 focus:ring-blue-500" />
            </div>
            <input type="range" min={sliderMin} max={sliderMax} step={1} value={displayCurrentWeight}
              onChange={e => handleCurrentWeightChange(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600" />
            <div className="flex justify-between text-xs text-gray-400 mt-1"><span>{sliderMin}</span><span>{sliderMax}</span></div>
          </div>

          {/* Goal Weight */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-semibold text-gray-700">Goal Weight ({useKg ? "kg" : "lb"})</label>
              <input type="number" value={displayGoalWeight} onChange={e => handleGoalWeightChange(Number(e.target.value) || 0)}
                className="w-24 px-2 py-1.5 text-right border border-gray-300 rounded-md text-sm font-semibold text-blue-600 focus:ring-2 focus:ring-blue-500" />
            </div>
            <input type="range" min={sliderMin} max={sliderMax} step={1} value={displayGoalWeight}
              onChange={e => handleGoalWeightChange(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600" />
            <div className="flex justify-between text-xs text-gray-400 mt-1"><span>{sliderMin}</span><span>{sliderMax}</span></div>
          </div>

          {/* TDEE */}
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-2 block">Maintenance Calories (TDEE)</label>
            <div className="flex items-center gap-2">
              <input type="number" value={tdee}
                onChange={e => setTdee(Math.max(1000, Math.min(6000, Number(e.target.value) || 2000)))}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm font-semibold text-blue-600 focus:ring-2 focus:ring-blue-500" />
              <span className="text-sm text-gray-500 font-medium">kcal</span>
            </div>
            <p className="text-xs text-gray-400 mt-1">Not sure? Use our TDEE Calculator</p>
          </div>

          {/* Loss Rate */}
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-2 block">Weekly Weight Loss Rate</label>
            <div className="space-y-2">
              {LOSS_RATE_OPTIONS.map(opt => (
                <button key={opt.value} onClick={() => setLossRate(opt.value)}
                  className={`w-full flex justify-between items-center px-4 py-3 rounded-lg border text-sm transition-colors ${
                    lossRate === opt.value ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                  }`}>
                  <span className="font-medium">{opt.label}</span>
                  <span className={lossRate === opt.value ? "text-blue-100" : "text-gray-400"}>{opt.description}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results */}
        <div id="results" className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Your Fat Loss Plan</h2>

          {results.unsafe && (
            <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-3">
              <div className="text-sm font-semibold text-red-700">Warning: Deficit Too Large</div>
              <div className="text-xs text-red-600 mt-1">
                Your target of {fmt(results.dailyCalories)} kcal/day falls below safe minimums (1,200 kcal for women, 1,500 kcal for men).
                Consider a slower loss rate or consult a dietitian.
              </div>
            </div>
          )}

          <div className="bg-green-50 rounded-lg p-4 mb-4 text-center border border-green-100">
            <div className="text-xs text-gray-500 mb-1">Daily Calorie Target</div>
            <div className={`text-4xl font-bold ${results.unsafe ? "text-red-600" : "text-green-700"}`}>
              {fmt(results.dailyCalories)}
            </div>
            <div className="text-xs text-gray-400 mt-1">kcal/day</div>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-red-50 rounded-lg p-3">
              <div className="text-xs text-gray-500 mb-1">Daily Deficit</div>
              <div className="text-xl font-bold text-red-600">−{fmt(results.dailyDeficit)} kcal</div>
            </div>
            <div className="bg-blue-50 rounded-lg p-3">
              <div className="text-xs text-gray-500 mb-1">Weekly Deficit</div>
              <div className="text-xl font-bold text-blue-700">−{fmt(results.weeklyDeficit)} kcal</div>
            </div>
            <div className="bg-blue-50 rounded-lg p-3">
              <div className="text-xs text-gray-500 mb-1">Weeks to Goal</div>
              <div className="text-xl font-bold text-blue-700">{results.weeksToGoal}</div>
            </div>
            <div className="bg-blue-50 rounded-lg p-3">
              <div className="text-xs text-gray-500 mb-1">Target Date</div>
              <div className="text-base font-bold text-blue-700">{fmtDate(results.targetDate)}</div>
            </div>
            <div className="col-span-2 bg-blue-50 rounded-lg p-3">
              <div className="text-xs text-gray-500 mb-1">Total Calories to Burn</div>
              <div className="text-xl font-bold text-blue-700">{fmt(results.totalCaloriesToBurn)} kcal</div>
              <div className="text-xs text-gray-400">{Math.max(0, currentWeightKg - goalWeightKg)} kg × 7,700 kcal/kg</div>
            </div>
          </div>

          {chartData.length > 1 && (
            <div className="border-t border-gray-100 pt-4">
              <p className="text-xs text-gray-500 mb-2">Projected weight loss curve</p>
              <ResponsiveContainer width="100%" height={150}>
                <LineChart data={chartData}>
                  <XAxis dataKey="label" tick={{ fontSize: 10 }} interval={0} />
                  <YAxis
                    tick={{ fontSize: 10 }}
                    domain={[Math.floor(goalWeightKg - 1), Math.ceil(currentWeightKg + 1)]}
                    unit={useKg ? "kg" : "lb"}
                    width={45}
                  />
                  <Tooltip
                    formatter={(v: number) => [`${v.toFixed(1)} ${useKg ? "kg" : "lb"}`, "Weight"]}
                    labelFormatter={(_label: unknown, payload?: ReadonlyArray<{ payload?: { week?: number } }>) =>
                      payload?.[0]?.payload?.week != null ? `Week ${payload[0].payload.week}` : ""
                    }
                  />
                  <ReferenceLine y={goalWeightKg} stroke="#16a34a" strokeDasharray="3 3" label={{ value: "Goal", fontSize: 10, fill: "#16a34a" }} />
                  <Line type="monotone" dataKey="weight" stroke="#3b82f6" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>

      <CalculatorLayout
        title=""
        description=""
        explanation={
          <div className="space-y-4 text-sm text-gray-700 leading-relaxed">
            <p>
              A calorie deficit is the foundation of fat loss, but the relationship between "eat less, weigh less" is
              far more nuanced than the simple arithmetic suggests. Understanding what is actually happening in your body
              helps explain why the scale sometimes refuses to move — and what to do about it.
            </p>
            <p>
              <strong>Fat Loss vs. Weight Loss: A Critical Distinction</strong><br />
              When most people say they want to lose weight, they mean they want to lose body fat. These are not the same
              thing. Your scale weight reflects fat, muscle, water, bone, organs, and gut contents. In a given week, total
              body water can fluctuate by 1–3 kg based on sodium intake, carbohydrate consumption, hormonal cycles,
              inflammation, and even stress. This means you can lose fat while the scale goes up — particularly when
              starting a new exercise program, which simultaneously burns fat and causes muscle-related water retention
              (the "newbie gains" effect). A DEXA scan, taken every 12 weeks, is the only reliable way to separate fat
              loss from muscle change.
            </p>
            <p>
              <strong>Why the Scale Fluctuates 1–3 kg Daily</strong><br />
              Glycogen — the stored form of carbohydrates in muscle and liver — binds approximately 3–4 grams of water
              per gram. When you eat high-carb meals, glycogen stores refill and water retention increases. When you eat
              low-carb or fast, glycogen depletes and water is released. This is why very-low-carb diets produce dramatic
              initial weight loss (3–5 kg in week one), which is almost entirely water and glycogen, not fat. It is also
              why a single high-sodium, high-carb meal the night before a weigh-in can show 2 kg more on the scale.
            </p>
            <p>
              <strong>The Whoosh Effect</strong><br />
              Many dieters report periods where weight stays frustratingly stable for 1–2 weeks and then drops several
              kilograms almost overnight. This is sometimes called the "whoosh effect." The leading explanation is that
              fat cells, when emptied of triglycerides, temporarily fill with water before eventually shrinking. The result
              is continued fat oxidation with no apparent scale change — followed by a sudden release of that retained
              water. Trusting the process and tracking weight as a weekly average (rather than fixating on daily numbers)
              smooths out this variability considerably.
            </p>
            <p>
              <strong>Why 500 Cal/Day Does Not Always Equal 0.5 kg/Week</strong><br />
              The theoretical formula (7,700 kcal = 1 kg fat) assumes you are burning pure fat and your metabolism does
              not change. In reality, both assumptions are wrong. First, weight lost is a mix of fat, water, glycogen,
              and sometimes a small amount of lean mass. Second, metabolic adaptation reduces your TDEE as you lose weight
              — a lighter body burns fewer calories, and adaptive thermogenesis reduces NEAT and thermogenesis by an
              additional 5–15%. The formula is a useful planning tool, but expect real-world results to diverge from
              predictions over time as your body adapts.
            </p>
            <p>
              <strong>Slow Deficits Preserve More Muscle</strong><br />
              The aggressive 1 kg/week rate (1,000 cal/day deficit) is the upper limit of what research considers safe
              for most adults. Beyond this, the body increasingly catabolises muscle tissue for energy, particularly if
              protein intake is inadequate. A 0.5 kg/week deficit is the most studied sweet spot — it produces
              meaningful fat loss while preserving the vast majority of muscle mass, especially when combined with
              resistance training and sufficient protein (1.6–2.4g/kg). The 0.25 kg/week rate is ideal for lean
              individuals or those close to their goal weight who want to minimise any muscle loss risk.
            </p>
            <p>
              <strong>Diet Breaks and Refeeds</strong><br />
              After 8–12 weeks of continuous dieting, leptin levels drop significantly — leptin is the satiety hormone
              that signals your brain that you have enough stored energy. Low leptin increases hunger, decreases motivation,
              and further slows metabolism. A diet break (eating at maintenance for 1–2 weeks) partially restores leptin,
              reduces psychological diet fatigue, and may improve adherence over a longer diet. Research by Byrne et al.
              (2017) found that intermittent energy restriction with diet breaks produced better preservation of lean mass
              than continuous restriction over 16 weeks, making planned breaks a legitimate and effective strategy.
            </p>
          </div>
        }
        faqs={[
          {
            question: "Why am I not losing weight even though I am in a deficit?",
            answer: "The most common reasons are: (1) calorie intake is underestimated — liquid calories, cooking oils, and condiments are easy to miss; (2) water retention is masking fat loss, particularly if you have recently started exercising or changed sodium intake; (3) adaptive thermogenesis has reduced your actual TDEE below the estimated value; (4) the measurement timeline is too short — scale weight needs to be tracked as a weekly average over 3–4 weeks before drawing conclusions.",
          },
          {
            question: "Is eating 1,200 calories safe?",
            answer: "1,200 kcal is generally considered the minimum for sedentary women to obtain adequate micronutrients from food alone; 1,500 kcal is the typical minimum for sedentary men. Below these thresholds, it becomes very difficult to meet requirements for vitamins, minerals, and essential fatty acids without supplementation. Very-low-calorie diets also accelerate muscle loss and metabolic adaptation. If your deficit requires going below these thresholds, a slower loss rate is the safer choice.",
          },
          {
            question: "What is a diet break and should I take one?",
            answer: "A diet break is a planned period of 1–2 weeks where you return to eating at your maintenance calorie level (your TDEE). It partially reverses metabolic adaptation, restores leptin levels, and reduces psychological diet fatigue. Research supports incorporating diet breaks every 6–12 weeks during extended fat loss phases. A diet break is different from giving up — it is a structured tool that often improves long-term results.",
          },
          {
            question: "Does my deficit need to be the same every day?",
            answer: "No — what matters is your average weekly deficit, not day-to-day consistency. This is the basis of flexible dieting: you might eat at maintenance on weekends and at a larger deficit on weekdays and still hit your weekly calorie target. This flexibility dramatically improves adherence for most people. The caveat is that very large single-day deficits (2,000+ calories) can negatively impact workout performance and recovery.",
          },
          {
            question: "How do I know if I am losing fat vs. losing muscle?",
            answer: "The most reliable method is a DEXA (dual-energy X-ray absorptiometry) scan, which measures fat mass and lean mass separately. A more practical day-to-day proxy is strength maintenance: if your performance in compound lifts (squat, bench, deadlift) stays stable or improves while you are losing weight, you are preserving muscle well. Rapid strength loss often signals excessive muscle catabolism. Ensuring adequate protein (1.6–2.4g/kg) and continuing resistance training are the two most important factors for muscle preservation during a deficit.",
          },
        ]}
        relatedCalculators={[
          { name: "TDEE Calculator", href: "/calculators/health/tdee-calculator" },
          { name: "Macro Calculator", href: "/calculators/health/macro-calculator" },
          { name: "BMR Calculator", href: "/calculators/health/bmr-calculator" },
        ]}
      >
        <div />
      </CalculatorLayout>

      <MobileResultBar
        label="Daily Target"
        value={`${fmt(results.dailyCalories)} kcal · Goal in ${results.weeksToGoal} wks`}
        tone={results.unsafe ? "warning" : "positive"}
        targetId="results"
        show={true}
      />
    </div>
  );
}
