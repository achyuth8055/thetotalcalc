"use client";
import { useState, useMemo } from "react";
import Breadcrumbs from "@/components/Breadcrumbs";
import CalculatorLayout from "@/components/CalculatorLayout";

const activityLabels = ["Sedentary", "Light Exercise", "Moderate Exercise", "Intense Exercise"];
const climateLabels = ["Cool", "Hot", "Very Hot"];

const explanation = (
  <div className="space-y-4 text-sm text-gray-700 leading-relaxed">
    <p>
      The widely repeated advice to drink "8 glasses of water a day" traces back to a 1945 recommendation from
      the U.S. Food and Nutrition Board, which stated that adults need roughly 2.5 liters of water daily. What
      got lost in translation is that the recommendation explicitly included water from all sources — food,
      coffee, tea, milk, and other beverages — not just plain drinking water. The phrase was simplified,
      stripped of its context, and repeated for decades until it became cultural doctrine. Modern research has
      never validated the "8×8" rule (eight 8-ounce glasses) as a universal requirement. Actual needs vary
      enormously based on body size, activity, climate, diet, and individual physiology.
    </p>
    <p>
      Dehydration impairs function long before you feel obviously thirsty. A fluid deficit equivalent to just
      1% of body weight causes noticeable thirst and mild reductions in alertness. At 2%, cognitive performance
      measurably declines, and physical endurance drops by as much as 10-20%. A 3-4% deficit produces
      headaches, fatigue, and significantly impaired concentration. At 5%, heat exhaustion becomes a serious
      risk. Beyond 8%, heat stroke and organ failure can occur. The brain is approximately 75% water, making
      it uniquely sensitive to even small changes in hydration — which is why dehydration so reliably produces
      brain fog, poor mood, and difficulty with complex tasks.
    </p>
    <p>
      Hydration is not just about water volume — electrolytes matter equally. Sodium, potassium, and magnesium
      regulate fluid balance across cell membranes. Drinking large volumes of plain water without adequate
      electrolytes can dilute blood sodium levels, causing hyponatremia. This condition — dangerously low blood
      sodium — is most commonly seen in endurance athletes who consume enormous quantities of plain water during
      races lasting several hours. Symptoms include nausea, confusion, seizures, and in severe cases, death.
      Sports drinks formulated with sodium and potassium are genuinely useful for exercise lasting over 60-90
      minutes, but unnecessary for normal daily hydration or shorter workouts.
    </p>
    <p>
      Caffeine has a reputation as a diuretic that dehydrates you, but the evidence tells a more nuanced story.
      Caffeine does cause mild diuresis, but the water content of coffee or tea more than compensates for the
      increased urine output. Research consistently shows that moderate coffee and tea consumption net
      contributes to daily fluid intake. The exception is very high-dose caffeine (energy shots, caffeine
      supplements) taken in concentrated form without accompanying fluid. Alcohol behaves differently: it
      suppresses antidiuretic hormone (ADH), a key regulator of water retention in the kidneys, causing
      significantly increased urine production. This is a primary mechanism behind hangover dehydration — the
      dry mouth, headache, and fatigue characteristic of the morning after.
    </p>
    <p>
      Urine color is one of the most practical real-time hydration indicators available. Pale straw yellow —
      similar to the color of lemonade — indicates good hydration. Dark yellow or amber signals that you
      should drink more water. Colorless or very pale urine may indicate overhydration, though this is rarely
      dangerous for healthy people with functioning kidneys. First morning urine is almost always darker
      because the kidneys concentrate waste products during the hours of sleep when no fluid is consumed.
      Certain foods (beets, berries) and supplements (B vitamins, which turn urine bright yellow) can alter
      urine color independently of hydration status, so context matters.
    </p>
    <p>
      Morning hydration deserves special attention. During 7-9 hours of sleep, the body loses an estimated
      500-1000mL of water through respiration and perspiration — exhaled air is saturated with water vapor,
      and even in a cool room you perspire continuously overnight. You wake up in a mild state of dehydration
      every morning without exception. Drinking 500mL of water within 30 minutes of waking has been shown to
      rehydrate tissues, jumpstart metabolism, help flush overnight metabolic waste products accumulated in
      the kidneys, and reduce appetite at breakfast. It also establishes an early daily hydration buffer that
      makes it easier to meet total daily needs.
    </p>
    <p>
      Temperature and activity dramatically alter water requirements. Sweat rates during moderate exercise in
      temperate conditions average 0.5-1 liter per hour. During intense exercise in heat, sweat rates of
      2-3 liters per hour are not uncommon among trained athletes. For every 1% of body weight lost to
      dehydration, core body temperature rises approximately 1°C — a dangerous feedback loop during sustained
      effort in heat. Workers in hot environments such as construction sites, foundries, and commercial
      kitchens may require 8-12 liters of fluid per day. Climate is therefore not a minor adjustment to
      hydration needs — it can more than double them.
    </p>
    <p>
      Chronic mild dehydration — being habitually slightly underhydrated — produces a cluster of symptoms
      that are frequently attributed to other causes. Recurring headaches, persistent fatigue, difficulty
      concentrating, and hunger-like sensations are all common manifestations. The colon reabsorbs water from
      stool as its final pass; when the body is chronically short on fluid, this process becomes too
      aggressive, producing dry, hard stool and chronic constipation. Concentrated urine from habitual
      underhydration creates conditions favorable for calcium oxalate crystal precipitation — the primary
      mechanism for kidney stone formation. Urinary tract infections are also more common when urine is
      concentrated and the bladder is not flushed regularly. Skin dryness and reduced elasticity are
      additional visible signs.
    </p>
    <p>
      Water from food is a significant and often overlooked hydration source. Cucumbers and lettuce are
      96-97% water by weight. Watermelon is 92%, strawberries 91%, broccoli 89%, and plain yogurt
      approximately 85%. A diet rich in fruits and vegetables can supply 700-1000mL of water daily through
      food alone, meaningfully reducing the volume needed from beverages. This is why the 80/20 estimate
      used in this calculator — 80% of needs from drinks, 20% from food — is only an approximation. Someone
      eating mostly whole, plant-based foods may derive considerably more than 20% of their total water intake
      from their diet, while someone eating primarily dry, processed foods may derive far less.
    </p>
    <p>
      For athletes, a continuing debate exists between "drink to thirst" and scheduled drinking protocols.
      Newer research suggests that thirst is a reliable guide for recreational athletes in moderate conditions
      — the sensation is finely calibrated to actual need under normal circumstances. For endurance athletes
      exercising for more than two hours in heat, however, thirst can lag meaningfully behind actual fluid
      deficit, making scheduled drinking a safer strategy. A practical method is to weigh yourself before and
      after exercise: every 0.5kg of weight lost during activity represents approximately 500mL of fluid that
      needs to be replaced, ideally with a beverage containing some sodium to aid reabsorption.
    </p>
  </div>
);

const faqs = [
  {
    q: "Does coffee count toward my daily water intake?",
    a: "Yes. Despite caffeine's mild diuretic effect, research consistently shows that coffee and tea net contribute to daily hydration. Moderate caffeine consumption — up to 400mg per day, approximately 4 cups of coffee — does not cause net fluid loss. The water content of the beverage more than offsets the mild increase in urine output. Strongly caffeinated drinks such as energy shots and caffeine pills taken in high doses without accompanying fluid can cause meaningful diuresis, but standard coffee and tea consumption does not.",
  },
  {
    q: "Is sparkling water as hydrating as still water?",
    a: "Yes. Carbonation does not affect hydration. Sparkling water, flavored sparkling water, and still water are equally hydrating. The CO₂ bubbles are inert from a hydration perspective and are simply expelled through the digestive tract. The only practical caveat is that some people find carbonated water less comfortable to drink in large volumes and may naturally drink less of it, which could affect total intake.",
  },
  {
    q: "Can you drink too much water?",
    a: "Yes, though it is rare in healthy adults. Hyponatremia — low blood sodium caused by excessive water diluting electrolyte levels — occurs most commonly in endurance athletes who drink large volumes of plain water during races, psychiatric patients with compulsive water-drinking disorder, or very young children given too much plain water. Symptoms include nausea, headache, confusion, and in severe cases, seizures or death. Healthy kidneys can process approximately 1 liter of water per hour — drinking more than this rate consistently exceeds renal excretion capacity and increases hyponatremia risk.",
  },
  {
    q: "Why do I need more water in summer?",
    a: "Heat triggers sweating as the body's primary cooling mechanism. Sweat is predominantly water with dissolved electrolytes, primarily sodium and chloride. On a hot day, sweat rates of 1-2 liters per hour are common during even moderate activity. Even at rest in a hot environment, insensible water losses through skin evaporation and respiration increase substantially compared to cool conditions. Higher ambient humidity further reduces evaporative cooling efficiency, forcing the body to produce even more sweat to maintain core temperature, amplifying fluid requirements.",
  },
  {
    q: "Does drinking more water help with weight loss?",
    a: "Modestly, yes. Drinking 500mL of water before meals has been shown in controlled studies to reduce calorie intake at that meal by approximately 13%, likely by increasing gastric fullness. Water also temporarily increases resting metabolic rate by 24-30% for about an hour through thermogenesis — the energy cost of heating ingested water to body temperature. Replacing sugary beverages with water eliminates liquid calories directly. The effect is real but not dramatic in isolation. Hydration supports weight loss as part of a broader healthy diet rather than functioning as a primary weight-loss intervention on its own.",
  },
];

export default function WaterIntakeCalculatorPage() {
  const [weight, setWeight] = useState(70);
  const [weightUnit, setWeightUnit] = useState<"kg" | "lb">("kg");
  const [activity, setActivity] = useState<0 | 1 | 2 | 3>(0);
  const [climate, setClimate] = useState<0 | 1 | 2>(0);
  const [pregnant, setPregnant] = useState(false);
  const [breastfeeding, setBreastfeeding] = useState(false);

  const weightKg = weightUnit === "kg" ? weight : weight / 2.20462;
  const displayWeight = weightUnit === "kg" ? weight : Math.round(weight * 2.20462 * 10) / 10;

  const results = useMemo(() => {
    const base = weightKg * 35;
    const activityAdd = [0, 350, 700, 1050][activity];
    const climateAdd = [0, 500, 1000][climate];
    const pregnantAdd = pregnant ? 300 : 0;
    const breastfeedingAdd = breastfeeding ? 700 : 0;
    const total = base + activityAdd + climateAdd + pregnantAdd + breastfeedingAdd;
    return {
      total,
      liters: (total / 1000).toFixed(1),
      flOz: Math.round(total * 0.033814),
      glasses8oz: Math.ceil(total / 236.6),
      bottles500mL: Math.ceil(total / 500),
      bottles1L: Math.ceil(total / 1000),
      fromFood: (total * 0.2 / 1000).toFixed(1),
      fromDrinks: (total * 0.8 / 1000).toFixed(1),
    };
  }, [weightKg, activity, climate, pregnant, breastfeeding]);

  const dropsToShow = Math.min(results.glasses8oz, 16);

  const handleWeightUnitToggle = (unit: "kg" | "lb") => {
    if (unit === weightUnit) return;
    if (unit === "lb") {
      setWeight(Math.round(weight * 2.20462));
    } else {
      setWeight(Math.round(weight / 2.20462));
    }
    setWeightUnit(unit);
  };

  const sliderMin = weightUnit === "kg" ? 40 : 88;
  const sliderMax = weightUnit === "kg" ? 200 : 441;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Breadcrumbs
        items={[
          { label: "Health Calculators", href: "/health-calculators" },
          { label: "Water Intake Calculator", href: "/calculators/health/water-intake-calculator" },
        ]}
      />

      <div className="flex items-start justify-between mb-2">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Daily Water Intake Calculator</h1>
          <p className="text-gray-500 mt-1">
            Find your personalized daily hydration target based on weight, activity level, and climate
          </p>
        </div>
        <button
          onClick={() => window.print()}
          className="hidden sm:inline-flex items-center gap-2 px-3 py-2 text-sm border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
          </svg>
          Print
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mt-6">
        {/* Inputs card */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-800">Your Details</h2>

          {/* Weight */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-700">Body Weight</label>
              <div className="flex rounded-lg overflow-hidden border border-gray-200 text-sm">
                <button
                  onClick={() => handleWeightUnitToggle("kg")}
                  className={`px-3 py-1 transition-colors ${weightUnit === "kg" ? "bg-blue-500 text-white" : "bg-white text-gray-600 hover:bg-gray-50"}`}
                >
                  kg
                </button>
                <button
                  onClick={() => handleWeightUnitToggle("lb")}
                  className={`px-3 py-1 transition-colors ${weightUnit === "lb" ? "bg-blue-500 text-white" : "bg-white text-gray-600 hover:bg-gray-50"}`}
                >
                  lb
                </button>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min={sliderMin}
                max={sliderMax}
                value={weight}
                onChange={(e) => setWeight(Number(e.target.value))}
                className="flex-1 accent-blue-500"
              />
              <span className="w-20 text-right font-semibold text-gray-800 text-sm">
                {weight} {weightUnit}
              </span>
            </div>
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>{sliderMin} {weightUnit}</span>
              <span>{sliderMax} {weightUnit}</span>
            </div>
          </div>

          {/* Activity level */}
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-2">Activity Level</label>
            <div className="grid grid-cols-2 gap-2">
              {activityLabels.map((label, i) => (
                <button
                  key={i}
                  onClick={() => setActivity(i as 0 | 1 | 2 | 3)}
                  className={`px-3 py-2 rounded-lg text-xs font-medium border transition-colors text-left ${
                    activity === i
                      ? "bg-blue-500 text-white border-blue-500"
                      : "bg-white text-gray-600 border-gray-200 hover:border-blue-300"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Climate */}
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-2">Climate</label>
            <div className="grid grid-cols-3 gap-2">
              {climateLabels.map((label, i) => (
                <button
                  key={i}
                  onClick={() => setClimate(i as 0 | 1 | 2)}
                  className={`px-3 py-2 rounded-lg text-xs font-medium border transition-colors ${
                    climate === i
                      ? "bg-blue-500 text-white border-blue-500"
                      : "bg-white text-gray-600 border-gray-200 hover:border-blue-300"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Checkboxes */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-700 block">Additional Factors</label>
            <label className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={pregnant}
                onChange={(e) => setPregnant(e.target.checked)}
                className="w-4 h-4 rounded accent-blue-500"
              />
              <span className="text-sm text-gray-700 group-hover:text-gray-900">Pregnant (+300 mL/day)</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={breastfeeding}
                onChange={(e) => setBreastfeeding(e.target.checked)}
                className="w-4 h-4 rounded accent-blue-500"
              />
              <span className="text-sm text-gray-700 group-hover:text-gray-900">Breastfeeding (+700 mL/day)</span>
            </label>
          </div>
        </div>

        {/* Results card */}
        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 space-y-5 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-800">Your Daily Hydration Target</h2>

          <div className="text-center bg-white rounded-xl py-5 px-4 border border-blue-100">
            <div className="text-5xl font-bold text-blue-600">{results.liters}<span className="text-2xl ml-1 font-medium text-blue-400">L</span></div>
            <div className="text-gray-500 text-sm mt-1">{results.flOz} fl oz per day</div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white rounded-xl p-4 border border-blue-100">
              <div className="text-2xl font-bold text-gray-800">{results.glasses8oz}</div>
              <div className="text-xs text-gray-500 mt-0.5">8 oz glasses</div>
            </div>
            <div className="bg-white rounded-xl p-4 border border-blue-100">
              <div className="text-2xl font-bold text-gray-800">{results.bottles500mL}</div>
              <div className="text-xs text-gray-500 mt-0.5">500 mL bottles</div>
            </div>
            <div className="bg-white rounded-xl p-4 border border-blue-100">
              <div className="text-2xl font-bold text-gray-800">{results.bottles1L}</div>
              <div className="text-xs text-gray-500 mt-0.5">1 L bottles</div>
            </div>
            <div className="bg-white rounded-xl p-4 border border-blue-100">
              <div className="text-2xl font-bold text-gray-800">{results.liters}</div>
              <div className="text-xs text-gray-500 mt-0.5">liters total</div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 border border-blue-100 space-y-2">
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Breakdown by Source (estimated)</div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">From beverages (80%)</span>
              <span className="font-semibold text-gray-800">{results.fromDrinks} L</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">From food (20%)</span>
              <span className="font-semibold text-gray-800">{results.fromFood} L</span>
            </div>
          </div>
        </div>
      </div>

      {/* Water drop visual */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 mt-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-800 mb-1">Daily Glasses Visualization</h2>
        <p className="text-sm text-gray-500 mb-4">
          Each drop represents one 8 oz glass.
          {results.glasses8oz > 16 && (
            <span className="ml-1 text-blue-500">Showing first 16 of {results.glasses8oz} glasses.</span>
          )}
        </p>
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: dropsToShow }).map((_, i) => (
            <div
              key={i}
              className="bg-blue-500 text-white rounded-lg text-center py-2 px-3 text-base select-none"
              title={`Glass ${i + 1}`}
            >
              💧
            </div>
          ))}
        </div>
        <p className="text-sm text-gray-500 mt-3">
          {results.glasses8oz > 16
            ? `Showing 16 of ${results.glasses8oz} glasses (${results.liters} L total)`
            : `${results.glasses8oz} glasses of water per day`}
        </p>
      </div>

      <CalculatorLayout
        explanation={explanation}
        faqs={faqs}
        relatedCalculators={[
          { name: "Calorie Calculator", href: "/calculators/health/calorie-calculator" },
          { name: "BMI Calculator", href: "/calculators/health/bmi-calculator" },
          { name: "BMR Calculator", href: "/calculators/health/bmr-calculator" },
        ]}
      />
    </div>
  );
}
