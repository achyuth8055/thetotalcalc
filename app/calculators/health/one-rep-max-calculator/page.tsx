"use client";
import { useState, useEffect } from "react";
import Breadcrumbs from "@/components/Breadcrumbs";
import CalculatorLayout from "@/components/CalculatorLayout";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

type Formula = "brzycki" | "epley" | "lombardi";
type Unit = "kg" | "lb";

interface Result {
  brzycki: number;
  epley: number;
  lombardi: number;
  average: number;
}

const TRAINING_PERCENTAGES = [
  { pct: 50, label: "50%", useFor: "Warm-up" },
  { pct: 60, label: "60%", useFor: "Technique" },
  { pct: 70, label: "70%", useFor: "Hypertrophy (high reps)" },
  { pct: 75, label: "75%", useFor: "Hypertrophy" },
  { pct: 80, label: "80%", useFor: "Strength (4-6 reps)" },
  { pct: 85, label: "85%", useFor: "Heavy Strength (2-4 reps)" },
  { pct: 90, label: "90%", useFor: "Near-max (1-2 reps)" },
  { pct: 95, label: "95%", useFor: "Competition opener" },
  { pct: 100, label: "100%", useFor: "Max Attempt" },
];

export default function OneRepMaxCalculator() {
  const [weight, setWeight] = useState(80);
  const [reps, setReps] = useState(5);
  const [unit, setUnit] = useState<Unit>("kg");
  const [formula, setFormula] = useState<Formula>("brzycki");
  const [result, setResult] = useState<Result | null>(null);

  useEffect(() => {
    const recent = JSON.parse(localStorage.getItem("recentCalculators") || "[]");
    const updated = ["one-rep-max", ...recent.filter((id: string) => id !== "one-rep-max")].slice(0, 10);
    localStorage.setItem("recentCalculators", JSON.stringify(updated));
    calculate(weight, reps, unit);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    calculate(weight, reps, unit);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [weight, reps, unit, formula]);

  const calculate = (w: number, r: number, u: Unit) => {
    if (w <= 0 || r <= 0) return;
    const wKg = u === "lb" ? w / 2.2046 : w;
    const brzycki = wKg * 36 / (37 - r);
    const epley = wKg * (1 + r / 30);
    const lombardi = wKg * Math.pow(r, 0.10);
    const average = (brzycki + epley + lombardi) / 3;
    setResult({
      brzycki: Math.round(brzycki * 10) / 10,
      epley: Math.round(epley * 10) / 10,
      lombardi: Math.round(lombardi * 10) / 10,
      average: Math.round(average * 10) / 10,
    });
  };

  const displayWeight = (kg: number) => {
    if (unit === "lb") return Math.round(kg * 2.2046 * 10) / 10;
    return Math.round(kg * 10) / 10;
  };

  const weightMin = unit === "kg" ? 10 : 22;
  const weightMax = unit === "kg" ? 300 : 660;

  const chartData = result
    ? TRAINING_PERCENTAGES.map((row) => ({
        label: row.label,
        load: Math.round(displayWeight(result.average) * row.pct) / 100,
        pct: row.pct,
      }))
    : [];

  const formulaButtons: { key: Formula; label: string; sub: string }[] = [
    { key: "brzycki", label: "Brzycki", sub: "w × 36 / (37 − r)" },
    { key: "epley", label: "Epley", sub: "w × (1 + r/30)" },
    { key: "lombardi", label: "Lombardi", sub: "w × r^0.10" },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumbs
        items={[
          { label: "Health Calculators", href: "/health-calculators" },
          { label: "One Rep Max Calculator", href: "/calculators/health/one-rep-max-calculator" },
        ]}
      />

      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">One Rep Max Calculator</h1>
        <p className="text-base text-gray-600">
          Estimate your 1RM using Brzycki, Epley, or Lombardi formulas and get training load percentages
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Left Card - Inputs */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
          <div className="space-y-6">
            {/* Unit Toggle */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">Unit</label>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    if (unit !== "kg") {
                      setWeight(Math.round(weight / 2.2046));
                      setUnit("kg");
                    }
                  }}
                  className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                    unit === "kg" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  kg
                </button>
                <button
                  onClick={() => {
                    if (unit !== "lb") {
                      setWeight(Math.round(weight * 2.2046));
                      setUnit("lb");
                    }
                  }}
                  className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                    unit === "lb" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  lb
                </button>
              </div>
            </div>

            {/* Weight Slider */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <label className="text-sm font-semibold text-gray-700">
                  Weight Lifted ({unit})
                </label>
                <input
                  type="number"
                  value={weight}
                  onChange={(e) => setWeight(Number(e.target.value) || 0)}
                  className="w-20 px-3 py-1.5 text-right border border-gray-300 rounded-md text-sm font-semibold text-blue-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <input
                type="range"
                min={weightMin}
                max={weightMax}
                step="0.5"
                value={weight}
                onChange={(e) => setWeight(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>{weightMin} {unit}</span>
                <span>{weightMax} {unit}</span>
              </div>
            </div>

            {/* Reps Slider */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <label className="text-sm font-semibold text-gray-700">Reps Performed</label>
                <input
                  type="number"
                  value={reps}
                  onChange={(e) => setReps(Number(e.target.value) || 1)}
                  className="w-20 px-3 py-1.5 text-right border border-gray-300 rounded-md text-sm font-semibold text-green-600 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <input
                type="range"
                min="1"
                max="30"
                step="1"
                value={reps}
                onChange={(e) => setReps(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>1 rep</span>
                <span>30 reps</span>
              </div>
            </div>

            {/* Formula Selector */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">Formula</label>
              <div className="flex flex-col gap-2">
                {formulaButtons.map(({ key, label, sub }) => (
                  <button
                    key={key}
                    onClick={() => setFormula(key)}
                    className={`flex flex-col items-start px-4 py-3 rounded-lg font-medium transition-colors text-left ${
                      formula === key
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    <span className="text-sm font-semibold">{label}</span>
                    <span className={`text-xs mt-0.5 font-mono ${formula === key ? "text-blue-100" : "text-gray-500"}`}>
                      {sub}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Card - Results */}
        <div id="results" className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
          {result && (
            <div className="space-y-4">
              {/* Best Estimate */}
              <div className="bg-blue-600 rounded-xl p-5 text-white">
                <div className="text-xs font-medium mb-1 opacity-90">Best Estimate (Average)</div>
                <div className="text-3xl font-bold">
                  {displayWeight(result.average)} {unit}
                </div>
                <div className="text-xs mt-1 opacity-90">Average of all three formulas</div>
              </div>

              {/* Three Formula Cards */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-center">
                  <div className="text-xs text-gray-500 mb-1">Brzycki</div>
                  <div className="text-lg font-bold text-blue-700">
                    {displayWeight(result.brzycki)}
                  </div>
                  <div className="text-xs text-gray-500">{unit}</div>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-center">
                  <div className="text-xs text-gray-500 mb-1">Epley</div>
                  <div className="text-lg font-bold text-green-700">
                    {displayWeight(result.epley)}
                  </div>
                  <div className="text-xs text-gray-500">{unit}</div>
                </div>
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 text-center">
                  <div className="text-xs text-gray-500 mb-1">Lombardi</div>
                  <div className="text-lg font-bold text-purple-700">
                    {displayWeight(result.lombardi)}
                  </div>
                  <div className="text-xs text-gray-500">{unit}</div>
                </div>
              </div>

              {/* Training Percentages Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-2 text-xs font-semibold text-gray-500">%</th>
                      <th className="text-left py-2 text-xs font-semibold text-gray-500">
                        Load ({unit})
                      </th>
                      <th className="text-left py-2 text-xs font-semibold text-gray-500">Use For</th>
                    </tr>
                  </thead>
                  <tbody>
                    {TRAINING_PERCENTAGES.map((row) => {
                      const load = Math.round(displayWeight(result.average) * row.pct) / 100;
                      return (
                        <tr key={row.pct} className={`border-b border-gray-100 ${row.pct === 80 ? "bg-blue-50 font-semibold" : ""}`}>
                          <td className="py-1.5 text-gray-700">{row.label}</td>
                          <td className="py-1.5 text-blue-700 font-semibold">{load.toFixed(1)}</td>
                          <td className="py-1.5 text-gray-600 text-xs">{row.useFor}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Medical Disclaimer */}
              <p className="text-xs text-gray-400 mt-4 border-t pt-3">
                This calculator is for informational purposes only and does not constitute medical advice. Consult your healthcare provider for personalized guidance.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Training Load Chart */}
      {result && (
        <div className="mt-6 bg-white rounded-xl shadow-md p-6 border border-gray-200">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">
            Training Load by Percentage of 1RM
          </h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart
              layout="vertical"
              data={chartData}
              margin={{ top: 5, right: 30, left: 10, bottom: 5 }}
            >
              <XAxis type="number" tick={{ fontSize: 11 }} unit={` ${unit}`} />
              <YAxis type="category" dataKey="label" width={50} tick={{ fontSize: 11 }} />
              <Tooltip
                formatter={(value: number) => [`${value} ${unit}`, "Load"]}
                labelFormatter={(label) => `${label} of 1RM`}
              />
              <Bar dataKey="load" radius={[0, 4, 4, 0]}>
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.pct === 80 ? "#2563eb" : "#93c5fd"}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <p className="text-xs text-gray-500 mt-2 text-center">
            Highlighted bar = 80% (primary strength zone). Based on average 1RM across all three formulas.
          </p>
        </div>
      )}

      {/* Explanation + FAQs via CalculatorLayout */}
      <CalculatorLayout
        title=""
        description=""
        explanation={
          <div className="space-y-4 text-gray-700 text-sm leading-relaxed">
            <h3 className="text-lg font-semibold text-gray-900">Periodization and Programming with Your 1RM</h3>
            <p>
              Your one rep max is not just a bragging point — it is the cornerstone of intelligent strength programming.
              Linear periodization, the simplest model, has you increase load each week from around 65% up to 90%+ of your 1RM over several weeks before deloading and repeating.
              Undulating periodization alternates intensity and volume within the same week, so you might train at 75% on Monday, 85% on Wednesday, and 65% on Friday — targeting different adaptations in each session.
              Block periodization takes a longer view, dedicating full training blocks of 3–6 weeks to accumulation (volume), transmutation (intensity), and realization (peaking) phases.
              All three systems rely on knowing your 1RM to set the correct training loads.
            </p>
            <h3 className="text-lg font-semibold text-gray-900">When You Should NOT Test Your 1RM</h3>
            <p>
              A true maximum attempt carries genuine injury risk. Beginners should wait at least 6 months of consistent training before attempting maximal loads — the tendons and connective tissue adapt more slowly than muscle and need time to catch up.
              Avoid testing your 1RM when you are fatigued, sleep-deprived, nursing any injury, or in the middle of a high-volume training block.
              Testing after a hard week of training will produce an artificially low result and may hurt you.
              The formulas in this calculator let you estimate your 1RM from a safer submaximal set, which is accurate enough for programming purposes and carries far less risk.
            </p>
            <h3 className="text-lg font-semibold text-gray-900">RPE as an Alternative to Percentage-Based Training</h3>
            <p>
              Rate of Perceived Exertion (RPE) is an increasingly popular alternative to rigid percentage-based programming.
              On the standard 1–10 RPE scale used in powerlifting, an RPE of 10 means you could not have done another rep, RPE 9 means one rep left in the tank, RPE 8 means two reps left, and so on.
              RPE-based training is self-regulating — on days when your nervous system is recovered and nutrition is dialed in, you will naturally lift heavier at the prescribed RPE, and on bad days you will lift less without compromising the training stimulus.
              Many elite coaches now combine percentage anchors from a 1RM estimate with RPE caps to get the best of both systems.
            </p>
            <h3 className="text-lg font-semibold text-gray-900">Why Brzycki Loses Accuracy Above 10 Reps</h3>
            <p>
              The Brzycki formula was derived from data collected at rep ranges of 1–10, where the relationship between reps and percentage of 1RM is fairly linear.
              Above 10 reps, muscular endurance becomes a larger factor than pure strength, and the formula increasingly overestimates true 1RM.
              If you performed 15 reps with a given weight, the Epley or Lombardi formula will give you a more realistic estimate.
              For best accuracy, use a weight that limits you to 5–8 reps — this is the sweet spot for all three formulas.
            </p>
            <h3 className="text-lg font-semibold text-gray-900">Powerlifting vs Olympic Lifting 1RM Conventions</h3>
            <p>
              In powerlifting, the big three lifts — squat, bench press, and deadlift — each have their own 1RM, and your &quot;total&quot; is the sum of your best successful attempt on each.
              Olympic weightlifting measures the snatch and clean &amp; jerk separately, with the combined total determining your competition result.
              The clean &amp; jerk world record currently stands at 265 kg, set by Georgian superheavyweight Lasha Talakhadze, while Eddie Hall pulled 500 kg in the deadlift — the only human ever to do so in competition.
              These records give useful context for where elite strength ceilings actually sit across weight classes.
            </p>
            <h3 className="text-lg font-semibold text-gray-900">How to Peak for a Max Attempt</h3>
            <p>
              Peaking for a true 1RM attempt is a science unto itself.
              Most powerlifters follow a taper of 1–2 weeks where training volume drops significantly while intensity stays high.
              Sleep, hydration, and carbohydrate intake in the 48 hours before a max attempt have measurable effects on peak output.
              On the day itself, a thorough warm-up — working up through 60%, 70%, 80%, and 90% with adequate rest between sets — primes the central nervous system without depleting it.
              Your opening attempt should be a weight you can hit on the worst day you have ever had; your second attempt should be a target PR; your third attempt should be your ceiling.
            </p>
            <h3 className="text-lg font-semibold text-gray-900">The 5/3/1 Program and 1RM Percentages</h3>
            <p>
              Jim Wendler&apos;s 5/3/1 is one of the most widely followed strength programs in the world, and it is built entirely around a training max set at 85–90% of your true 1RM.
              Each four-week cycle uses three weeks of progressively heavier sets — week one at 65/75/85% of training max, week two at 70/80/90%, week three at 75/85/95% — followed by a deload week.
              The &quot;plus&quot; sets encourage you to do as many reps as possible at the top percentage, giving you ongoing submaximal data to refine your 1RM estimate without ever requiring a true max test.
              The program&apos;s genius is that the training max acts as a buffer, ensuring you are always lifting slightly below your absolute ceiling and staying healthy over long training cycles.
            </p>
            <h3 className="text-lg font-semibold text-gray-900">CNS Fatigue and Daily 1RM Variation</h3>
            <p>
              Your 1RM is not a fixed number — it fluctuates daily based on central nervous system (CNS) readiness.
              A single poor night of sleep can reduce peak strength output by 5–10%.
              Dehydration of just 2% of body weight measurably impairs performance.
              This is why serious strength athletes test their 1RM at the end of a structured taper rather than mid-block.
              Always test fresh: at least two days after your last heavy session, well-slept, well-fed, and well-hydrated.
            </p>
            <h3 className="text-lg font-semibold text-gray-900">The Conjugate Method and Maximal Effort Work</h3>
            <p>
              The Conjugate Method, pioneered by Louie Simmons at Westside Barbell, trains maximal strength and explosive speed simultaneously rather than in separate phases.
              Maximal effort days involve working up to a true or near-true 1RM on a competition lift variation — typically at 90%+ — to build absolute strength.
              Dynamic effort days use submaximal loads of around 50–60% of 1RM moved at maximal speed to develop rate of force development.
              The system is demanding and not recommended for beginners, but it has produced some of the strongest equipped powerlifters in history.
            </p>
          </div>
        }
        faqs={[
          {
            question: "How often should I test my 1RM?",
            answer:
              "Most athletes test every 8–12 weeks, ideally at the end of a training block after a short taper. If you train for general fitness, consider using the formula instead of a true max test — it\'s safer and gives you actionable data without the injury risk of an all-out effort.",
          },
          {
            question: "Is it dangerous to test a true 1RM?",
            answer:
              "Testing a 1RM carries real risk if not approached correctly. Always complete a thorough warm-up (working up to 90–95% before the true attempt), use a spotter for pressing movements, and never test when fatigued, injured, or sick. Beginners should wait at least 6 months before attempting maximal loads.",
          },
          {
            question: "Why does my 1RM feel different on different days?",
            answer:
              "Your central nervous system (CNS) is highly sensitive to sleep quality, hydration, nutrition, and accumulated training fatigue. A poor night\'s sleep alone can reduce strength output by 5–10%. This is why top powerlifters follow strict peaking protocols — maximizing CNS readiness on competition day.",
          },
          {
            question: "What\'s the difference between 1RM and training max?",
            answer:
              "A training max (TM) is typically set at 85–90% of your true 1RM. Programs like 5/3/1 use the training max to protect you from overtraining — you\'re always lifting submaximal loads relative to your true ceiling, which keeps recovery manageable and reduces injury risk over long training cycles.",
          },
          {
            question: "Should beginners calculate 1RM?",
            answer:
              "Beginners are better served by focusing on technique and progressive overload with moderate weights. That said, using the 1RM formula from an AMRAP (as many reps as possible) set with a weight you know is safe can be valuable for tracking progress without the risks of a true max attempt.",
          },
        ]}
        relatedCalculators={[
          { name: "BMR Calculator", href: "/calculators/health/bmr-calculator" },
          { name: "Calorie Calculator", href: "/calculators/health/calorie-calculator" },
        ]}
      >
        <div />
      </CalculatorLayout>
    </div>
  );
}
