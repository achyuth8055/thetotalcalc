"use client";
import { useState, useMemo } from "react";
import Breadcrumbs from "@/components/Breadcrumbs";
import CalculatorLayout from "@/components/CalculatorLayout";

type Gender = "male" | "female";
type UnitSystem = "cm" | "inches";

interface Category {
  label: string;
  color: string;
  bg: string;
  border: string;
}

function getCategory(bodyFat: number, gender: Gender): Category {
  if (gender === "male") {
    if (bodyFat < 6) return { label: "Essential", color: "text-blue-600", bg: "bg-blue-100", border: "border-blue-300" };
    if (bodyFat < 14) return { label: "Athlete", color: "text-green-600", bg: "bg-green-100", border: "border-green-300" };
    if (bodyFat < 18) return { label: "Fit", color: "text-green-600", bg: "bg-green-100", border: "border-green-300" };
    if (bodyFat < 25) return { label: "Acceptable", color: "text-yellow-600", bg: "bg-yellow-100", border: "border-yellow-300" };
    return { label: "Obese", color: "text-red-600", bg: "bg-red-100", border: "border-red-300" };
  } else {
    if (bodyFat < 14) return { label: "Essential", color: "text-blue-600", bg: "bg-blue-100", border: "border-blue-300" };
    if (bodyFat < 21) return { label: "Athlete", color: "text-green-600", bg: "bg-green-100", border: "border-green-300" };
    if (bodyFat < 25) return { label: "Fit", color: "text-green-600", bg: "bg-green-100", border: "border-green-300" };
    if (bodyFat < 32) return { label: "Acceptable", color: "text-yellow-600", bg: "bg-yellow-100", border: "border-yellow-300" };
    return { label: "Obese", color: "text-red-600", bg: "bg-red-100", border: "border-red-300" };
  }
}

function toCm(val: number): number {
  return val * 2.54;
}

const maleSegments = [
  { label: "Essential", widthPct: 3, color: "#3b82f6", min: 2, max: 5 },
  { label: "Athlete", widthPct: 8, color: "#22c55e", min: 6, max: 13 },
  { label: "Fit", widthPct: 4, color: "#86efac", min: 14, max: 17 },
  { label: "Acceptable", widthPct: 7, color: "#eab308", min: 18, max: 24 },
  { label: "Obese", widthPct: 78, color: "#ef4444", min: 25, max: 60 },
];

const femaleSegments = [
  { label: "Essential", widthPct: 4, color: "#3b82f6", min: 10, max: 13 },
  { label: "Athlete", widthPct: 7, color: "#22c55e", min: 14, max: 20 },
  { label: "Fit", widthPct: 4, color: "#86efac", min: 21, max: 24 },
  { label: "Acceptable", widthPct: 7, color: "#eab308", min: 25, max: 31 },
  { label: "Obese", widthPct: 78, color: "#ef4444", min: 32, max: 70 },
];

function GaugeBar({ bodyFat, gender }: { bodyFat: number; gender: Gender }) {
  const segments = gender === "male" ? maleSegments : femaleSegments;
  const minVal = segments[0].min;
  const maxVal = 60;
  const clampedFat = Math.min(Math.max(bodyFat, minVal), maxVal);
  const markerPct = ((clampedFat - minVal) / (maxVal - minVal)) * 100;

  return (
    <div className="w-full">
      <div className="relative mb-6">
        {/* Marker triangle */}
        <div
          className="absolute -top-5 flex flex-col items-center"
          style={{ left: `calc(${markerPct}% - 8px)` }}
        >
          <span className="text-xs font-bold text-gray-700">{bodyFat.toFixed(1)}%</span>
          <div
            className="w-0 h-0"
            style={{
              borderLeft: "6px solid transparent",
              borderRight: "6px solid transparent",
              borderTop: "8px solid #374151",
            }}
          />
        </div>
        {/* Bar */}
        <div className="flex h-6 w-full rounded-full overflow-hidden">
          {segments.map((seg) => (
            <div
              key={seg.label}
              style={{ width: `${seg.widthPct}%`, backgroundColor: seg.color }}
              title={`${seg.label}: ${seg.min}–${seg.max}%`}
            />
          ))}
        </div>
        {/* Labels */}
        <div className="flex mt-1 text-xs text-gray-500">
          {segments.map((seg) => (
            <div
              key={seg.label}
              style={{ width: `${seg.widthPct}%` }}
              className="text-center truncate px-0.5"
            >
              {seg.label}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function SliderRow({
  label,
  value,
  min,
  max,
  step,
  unit,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit: string;
  onChange: (v: number) => void;
}) {
  return (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-1">
        <label className="text-sm font-medium text-gray-700">{label}</label>
        <span className="text-sm font-semibold text-gray-900 w-20 text-right">
          {value} {unit}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-blue-600"
      />
      <div className="flex justify-between text-xs text-gray-400 mt-0.5">
        <span>{min}</span>
        <span>{max}</span>
      </div>
    </div>
  );
}

function ToggleGroup({
  options,
  value,
  onChange,
}: {
  options: { label: string; value: string }[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="inline-flex rounded-lg border border-gray-200 overflow-hidden">
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={`px-4 py-1.5 text-sm font-medium transition-colors ${
            value === opt.value
              ? "bg-blue-600 text-white"
              : "bg-white text-gray-600 hover:bg-gray-50"
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

const explanation = (
  <div className="text-gray-700 text-sm leading-relaxed">
    <h2 className="text-xl font-bold text-gray-900 mb-3">Understanding Body Fat Percentage</h2>

    <p className="mb-4">
      The clinical gold standard for measuring body fat is the DEXA scan (dual-energy X-ray absorptiometry), which distinguishes bone mineral density, lean tissue, and fat tissue with an accuracy of about ±1–2%. However, DEXA scans require specialized equipment costing $50–150 per session. The US Navy circumference method offers a practical alternative using only a measuring tape, with a margin of error of approximately ±3–4 percentage points. It works by using the circumference of the waist, neck, and (for women) hips as proxies for the proportion of lean versus fatty tissue. Fat tends to accumulate around the abdomen and hips, while lean tissue is distributed more uniformly, so these measurements together give a reasonable estimate of total body fat without any equipment beyond a tape measure.
    </p>

    <p className="mb-4">
      Body Mass Index (BMI) is widely used but fundamentally flawed for individuals with significant muscle mass. A 200-pound bodybuilder and a 200-pound sedentary person of the same height will have identical BMI scores, yet their health profiles are completely different. BMI is a mathematical ratio of weight to height — it cannot distinguish a kilogram of fat from a kilogram of muscle or bone. Elite athletes are frequently classified as "overweight" or even "obese" by BMI despite carrying very low body fat and exceptional cardiovascular fitness. Body fat percentage directly answers the question BMI cannot: how much of your body weight is actually fat tissue?
    </p>

    <p className="mb-4">
      Not all fat is equal. Visceral fat wraps around the internal organs inside the abdominal cavity and is metabolically active in ways that are harmful. It releases inflammatory cytokines, free fatty acids, and hormones that drive insulin resistance, promote type 2 diabetes, raise LDL cholesterol, and increase cardiovascular disease risk. Subcutaneous fat — the fat stored just beneath the skin, which is measured by skinfold calipers — is comparatively inert and may even have some protective metabolic effects. This distinction matters because a person can have a normal total body fat percentage while still carrying dangerous levels of visceral fat if they are sedentary and have poor metabolic health.
    </p>

    <p className="mb-4">
      Adipose tissue is not a single uniform substance. White adipose tissue stores energy as lipid droplets and is the primary fat depot in adults. Brown adipose tissue (BAT) functions differently: it burns calories to generate heat through a process called thermogenesis, driven by a protein called uncoupling protein 1 (UCP1). Newborns have abundant brown fat to regulate body temperature, and adults retain small deposits around the neck, shoulders, and spine. Cold exposure, certain hormones like irisin (released during exercise), and some dietary compounds can activate brown fat activity, though the caloric impact in adults is modest. Research into brown fat activation is an active area in obesity medicine.
    </p>

    <p className="mb-4">
      Body fat percentage naturally rises with age even in the absence of weight gain. Beginning around age 30, the body loses roughly 3–8% of muscle mass per decade — a process called sarcopenia — and this lost muscle mass is partially replaced by fat. As a result, a 60-year-old and a 30-year-old at the same body weight will typically have meaningfully different body fat percentages. Some clinical guidelines adjust the thresholds for "acceptable" body fat upward for adults over 60 to reflect this physiological reality and avoid overly penalizing older adults for changes that are partially driven by aging rather than lifestyle.
    </p>

    <p className="mb-4">
      Women naturally carry 6–11% more body fat than men at any given fitness level, primarily due to the effects of estrogen and other sex hormones that promote fat storage for reproductive function. Women also tend to store fat in the hips, thighs, and buttocks (a gynoid or pear-shaped pattern), while men store fat preferentially in the abdomen (an android or apple-shaped pattern). The waist-to-hip ratio (WHR) is a complementary metric that captures this distribution pattern, and a high WHR is independently associated with cardiometabolic risk regardless of total body fat percentage.
    </p>

    <p className="mb-4">
      Essential fat is not merely a reserve — it is physiologically necessary. Essential fat is found in the brain, bone marrow, nerves, and organ membranes, and it supports hormone production, thermal insulation, vitamin absorption (vitamins A, D, E, and K are fat-soluble and require fat for transport and absorption), and cushioning of vital organs. Female athletes who drop below the essential fat threshold face the female athlete triad: low energy availability, menstrual dysfunction (amenorrhea), and low bone mineral density. Men dropping below 2–3% body fat experience similar hormonal disruption, immune suppression, and impaired recovery.
    </p>

    <p className="mb-4">
      There are several methods for measuring body fat beyond the Navy formula. Hydrostatic (underwater) weighing achieves ±1–2% accuracy by measuring body density relative to water but requires full submersion and specialized equipment. The Bod Pod uses air displacement plethysmography and is comparably accurate. Skinfold caliper testing — pinching fat at 3–7 standardized sites — achieves ±3–5% accuracy in the hands of a skilled and consistent technician, but is highly operator-dependent. Bioelectrical impedance analysis (BIA), used in consumer body weight scales and handheld devices, passes a weak electrical current through the body and estimates fat from resistance; it achieves ±3–8% accuracy but is significantly affected by hydration status, meal timing, and body temperature.
    </p>

    <p className="mb-4">
      Tracking body composition progress does not require a scale. Circumference measurements of the waist, hips, arms, and thighs taken every two to four weeks reveal fat loss and muscle gain that the scale might mask. Progress photographs taken under consistent lighting and at consistent times capture visual changes in body composition. How clothing fits — particularly in the waist and hips — is a practical real-world indicator. And strength performance metrics (how much weight you can lift, how many pull-ups you can complete) directly reflect changes in lean muscle mass. When pursuing body recomposition — simultaneous muscle gain and fat loss — the scale is an especially unreliable metric because increases in lean mass offset fat loss, keeping total weight flat even as body composition improves dramatically.
    </p>

    <h2 className="text-xl font-bold text-gray-900 mb-3 mt-6">Frequently Asked Questions</h2>

    <div className="mb-4">
      <p className="font-semibold text-gray-800 mb-1">How accurate is the Navy body fat formula?</p>
      <p>
        The US Navy formula has a margin of error of approximately 3–4 percentage points compared to DEXA scan (dual-energy X-ray absorptiometry), the clinical gold standard. It tends to overestimate body fat in very lean individuals and can underestimate it in those with high abdominal fat relative to other measurements. For population-level screening and personal tracking over time, it is sufficiently accurate. For medical decisions, a DEXA scan is recommended.
      </p>
    </div>

    <div className="mb-4">
      <p className="font-semibold text-gray-800 mb-1">What is essential body fat?</p>
      <p>
        Essential fat is the minimum amount of fat required for normal physiological function. For men, this is approximately 2–5%; for women, 10–13%. This fat is found in the brain, bone marrow, nerves, and organs. Women carry more essential fat due to sex-specific fat deposits related to childbearing. Dropping below essential fat levels causes hormonal disruption, immune dysfunction, and organ damage.
      </p>
    </div>

    <div className="mb-4">
      <p className="font-semibold text-gray-800 mb-1">Why is my body fat high even though I am thin?</p>
      <p>
        This is called being TOFI — Thin Outside, Fat Inside. Normal-weight individuals can have high visceral fat deposits around their organs without visible excess weight. This is particularly common in people who are sedentary but not overweight. TOFI individuals face the same metabolic risks as those who appear overweight, including insulin resistance and cardiovascular disease. Resistance training and aerobic exercise reduce visceral fat even without significant weight change.
      </p>
    </div>

    <div className="mb-4">
      <p className="font-semibold text-gray-800 mb-1">Does body fat percentage matter more than BMI?</p>
      <p>
        Yes, for most health outcomes. Body fat percentage directly measures the ratio of fat to lean tissue, whereas BMI is a mathematical ratio of weight to height that cannot distinguish fat from muscle or bone. Studies consistently show that body fat percentage is a better predictor of metabolic health, cardiovascular risk, and all-cause mortality than BMI. That said, BMI remains useful as a quick, no-equipment screening tool at the population level.
      </p>
    </div>

    <div className="mb-4">
      <p className="font-semibold text-gray-800 mb-1">How fast can I reduce body fat?</p>
      <p>
        A realistic and sustainable rate of body fat reduction is approximately 0.5–1 percentage point per month for most people. This typically corresponds to losing 0.5–1 kg of fat per week while maintaining muscle mass through adequate protein intake and resistance training. Aggressive deficits accelerate fat loss but also increase muscle loss. Losing more than 1% body fat per month consistently requires very careful tracking of protein intake and strength training volume.
      </p>
    </div>
  </div>
);

const relatedCalculators = [
  { name: "BMI Calculator", href: "/calculators/health/bmi-calculator" },
  { name: "Ideal Weight Calculator", href: "/calculators/health/ideal-weight-calculator" },
  { name: "Calorie Calculator", href: "/calculators/health/calorie-calculator" },
];

export default function BodyFatCalculatorPage() {
  const [gender, setGender] = useState<Gender>("male");
  const [unitSystem, setUnitSystem] = useState<UnitSystem>("cm");

  // cm defaults
  const [heightCm, setHeightCm] = useState(175);
  const [neckCm, setNeckCm] = useState(38);
  const [waistCm, setWaistCm] = useState(85);
  const [hipCm, setHipCm] = useState(95);
  const [weightKg, setWeightKg] = useState(70);

  // inches defaults
  const [heightIn, setHeightIn] = useState(69);
  const [neckIn, setNeckIn] = useState(15);
  const [waistIn, setWaistIn] = useState(33);
  const [hipIn, setHipIn] = useState(37);
  const [weightLb, setWeightLb] = useState(154);

  const unit = unitSystem === "cm" ? "cm" : "in";
  const weightUnit = unitSystem === "cm" ? "kg" : "lbs";

  const results = useMemo(() => {
    let h: number, n: number, w: number, hip: number, weight: number;

    if (unitSystem === "cm") {
      h = heightCm;
      n = neckCm;
      w = waistCm;
      hip = hipCm;
      weight = weightKg;
    } else {
      h = toCm(heightIn);
      n = toCm(neckIn);
      w = toCm(waistIn);
      hip = toCm(hipIn);
      weight = weightLb / 2.20462;
    }

    let bodyFat: number;
    if (gender === "male") {
      const denom = w - n;
      if (denom <= 0) return null;
      bodyFat = 495 / (1.0324 - 0.19077 * Math.log10(denom) + 0.15456 * Math.log10(h)) - 450;
    } else {
      const denom = w + hip - n;
      if (denom <= 0) return null;
      bodyFat = 495 / (1.29579 - 0.35004 * Math.log10(denom) + 0.22100 * Math.log10(h)) - 450;
    }

    bodyFat = Math.max(1, Math.min(bodyFat, 70));

    const fatMass = weight * (bodyFat / 100);
    const leanMass = weight - fatMass;
    const fitUpperPct = gender === "male" ? 17 : 24;
    const targetFatMass = weight * (fitUpperPct / 100);
    const fatToLose = Math.max(0, fatMass - targetFatMass);
    const category = getCategory(bodyFat, gender);

    return { bodyFat, fatMass, leanMass, targetFatMass, fatToLose, category, weight };
  }, [gender, unitSystem, heightCm, neckCm, waistCm, hipCm, weightKg, heightIn, neckIn, waistIn, hipIn, weightLb]);

  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Health Calculators", href: "/calculators/health" },
    { label: "Body Fat Calculator", href: "/calculators/health/body-fat-calculator" },
  ];

  return (
    <>
      <Breadcrumbs items={breadcrumbs} />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Body Fat Calculator</h1>
        <p className="text-gray-500 mb-8 text-sm">
          Uses the US Navy circumference method to estimate body fat percentage.
        </p>

        {/* Toggles */}
        <div className="flex flex-wrap gap-4 mb-6">
          <div>
            <p className="text-xs text-gray-500 mb-1 font-medium uppercase tracking-wide">Gender</p>
            <ToggleGroup
              options={[
                { label: "Male", value: "male" },
                { label: "Female", value: "female" },
              ]}
              value={gender}
              onChange={(v) => {
                setGender(v as Gender);
                if (v === "female") {
                  setNeckCm(34);
                  setNeckIn(13);
                } else {
                  setNeckCm(38);
                  setNeckIn(15);
                }
              }}
            />
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1 font-medium uppercase tracking-wide">Units</p>
            <ToggleGroup
              options={[
                { label: "cm / kg", value: "cm" },
                { label: "in / lbs", value: "inches" },
              ]}
              value={unitSystem}
              onChange={(v) => setUnitSystem(v as UnitSystem)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Inputs Card */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-800 mb-5">Measurements</h2>

            {unitSystem === "cm" ? (
              <>
                <SliderRow label="Height" value={heightCm} min={140} max={210} step={1} unit="cm" onChange={setHeightCm} />
                <SliderRow label="Neck Circumference" value={neckCm} min={30} max={60} step={1} unit="cm" onChange={setNeckCm} />
                <SliderRow label="Waist Circumference" value={waistCm} min={60} max={140} step={1} unit="cm" onChange={setWaistCm} />
                {gender === "female" && (
                  <SliderRow label="Hip Circumference" value={hipCm} min={70} max={140} step={1} unit="cm" onChange={setHipCm} />
                )}
                <SliderRow label="Body Weight" value={weightKg} min={40} max={200} step={1} unit="kg" onChange={setWeightKg} />
              </>
            ) : (
              <>
                <SliderRow label="Height" value={heightIn} min={55} max={83} step={1} unit="in" onChange={setHeightIn} />
                <SliderRow label="Neck Circumference" value={neckIn} min={12} max={24} step={1} unit="in" onChange={setNeckIn} />
                <SliderRow label="Waist Circumference" value={waistIn} min={24} max={55} step={1} unit="in" onChange={setWaistIn} />
                {gender === "female" && (
                  <SliderRow label="Hip Circumference" value={hipIn} min={28} max={55} step={1} unit="in" onChange={setHipIn} />
                )}
                <SliderRow label="Body Weight" value={weightLb} min={88} max={440} step={1} unit="lbs" onChange={setWeightLb} />
              </>
            )}
          </div>

          {/* Results Card */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-800 mb-5">Results</h2>

            {results ? (
              <div className="space-y-4">
                {/* Body Fat % */}
                <div className={`rounded-xl p-4 border ${results.category.bg} ${results.category.border}`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Body Fat</p>
                      <p className={`text-4xl font-bold mt-1 ${results.category.color}`}>
                        {results.bodyFat.toFixed(1)}%
                      </p>
                    </div>
                    <span className={`text-sm font-semibold px-3 py-1 rounded-full ${results.category.bg} ${results.category.color} border ${results.category.border}`}>
                      {results.category.label}
                    </span>
                  </div>
                </div>

                {/* Fat / Lean Mass */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gray-50 rounded-xl p-3 text-center">
                    <p className="text-xs text-gray-500 mb-1">Fat Mass</p>
                    <p className="text-xl font-bold text-gray-800">
                      {results.fatMass.toFixed(1)} {weightUnit}
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-3 text-center">
                    <p className="text-xs text-gray-500 mb-1">Lean Mass</p>
                    <p className="text-xl font-bold text-gray-800">
                      {results.leanMass.toFixed(1)} {weightUnit}
                    </p>
                  </div>
                </div>

                {/* Target / Fat to Lose */}
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-xs text-gray-500 mb-2 font-medium uppercase tracking-wide">
                    To reach "Fit" category
                  </p>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-xs text-gray-400">Target Fat Mass</p>
                      <p className="text-lg font-semibold text-gray-800">
                        {results.targetFatMass.toFixed(1)} {weightUnit}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-400">Fat to Lose</p>
                      <p className={`text-lg font-semibold ${results.fatToLose > 0 ? "text-orange-600" : "text-green-600"}`}>
                        {results.fatToLose > 0 ? `-${results.fatToLose.toFixed(1)} ${weightUnit}` : "Already fit!"}
                      </p>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-gray-400 text-center">
                  US Navy formula · ±3–4% margin of error vs. DEXA scan
                </p>
              </div>
            ) : (
              <div className="flex items-center justify-center h-40 text-gray-400 text-sm">
                Adjust measurements to see results
              </div>
            )}
          </div>
        </div>

        {/* Gauge Card */}
        {results && (
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm mb-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Body Fat Scale</h2>
            <GaugeBar bodyFat={results.bodyFat} gender={gender} />
            <div className="flex flex-wrap gap-3 mt-2">
              {(gender === "male" ? maleSegments : femaleSegments).map((seg) => (
                <div key={seg.label} className="flex items-center gap-1.5 text-xs text-gray-600">
                  <div className="w-3 h-3 rounded-sm flex-shrink-0" style={{ backgroundColor: seg.color }} />
                  <span>{seg.label} ({seg.min}–{seg.max === 60 || seg.max === 70 ? `${seg.min}%+` : `${seg.max}%`})</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <CalculatorLayout
        title="Body Fat Calculator"
        description="Estimate your body fat percentage using the US Navy circumference method."
        explanation={explanation}
        relatedCalculators={relatedCalculators}
      >
        <div />
      </CalculatorLayout>
    </>
  );
}
