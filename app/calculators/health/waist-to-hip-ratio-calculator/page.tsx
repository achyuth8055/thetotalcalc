"use client";
import { useState, useMemo } from "react";
import Breadcrumbs from "@/components/Breadcrumbs";
import CalculatorLayout from "@/components/CalculatorLayout";

export default function WaistToHipRatioCalculator() {
  const [gender, setGender] = useState<"male" | "female">("male");
  const [unit, setUnit] = useState<"cm" | "inches">("cm");
  const [waistCm, setWaistCm] = useState(80);
  const [hipCm, setHipCm] = useState(95);
  const [heightCm, setHeightCm] = useState(170);

  const CM_TO_IN = 0.393701;
  const IN_TO_CM = 2.54;

  const waistIn = waistCm * CM_TO_IN;
  const hipIn = hipCm * CM_TO_IN;
  const heightIn = heightCm * CM_TO_IN;

  const waistDisplay = unit === "cm" ? waistCm : waistIn;
  const hipDisplay = unit === "cm" ? hipCm : hipIn;
  const heightDisplay = unit === "cm" ? heightCm : heightIn;

  const handleWaistChange = (val: number) => {
    setWaistCm(unit === "cm" ? val : val * IN_TO_CM);
  };
  const handleHipChange = (val: number) => {
    setHipCm(unit === "cm" ? val : val * IN_TO_CM);
  };
  const handleHeightChange = (val: number) => {
    setHeightCm(unit === "cm" ? val : val * IN_TO_CM);
  };

  const results = useMemo(() => {
    const whr = waistCm / hipCm;
    const whtr = waistCm / heightCm;

    let riskCategory = "";
    let riskColor = "";
    let threshold = 0;

    if (gender === "male") {
      threshold = 0.90;
      if (whr < 0.90) { riskCategory = "Low Risk"; riskColor = "green"; }
      else if (whr < 1.0) { riskCategory = "Moderate Risk"; riskColor = "yellow"; }
      else { riskCategory = "High Risk"; riskColor = "red"; }
    } else {
      threshold = 0.80;
      if (whr < 0.80) { riskCategory = "Low Risk"; riskColor = "green"; }
      else if (whr < 0.90) { riskCategory = "Moderate Risk"; riskColor = "yellow"; }
      else { riskCategory = "High Risk"; riskColor = "red"; }
    }

    let whtrCategory = "";
    if (whtr < 0.4) whtrCategory = "Underweight";
    else if (whtr < 0.5) whtrCategory = "Healthy";
    else if (whtr < 0.6) whtrCategory = "Overweight";
    else whtrCategory = "Obese";

    const idealWaistCm = hipCm * threshold;
    const idealWaist = unit === "cm" ? idealWaistCm : idealWaistCm * CM_TO_IN;

    const barMin = gender === "male" ? 0.70 : 0.60;
    const barMax = gender === "male" ? 1.10 : 1.00;
    const markerPct = Math.min(100, Math.max(0, ((whr - barMin) / (barMax - barMin)) * 100));

    return { whr, whtr, riskCategory, riskColor, whtrCategory, idealWaist, markerPct };
  }, [waistCm, hipCm, heightCm, gender, unit]);

  const riskBgMap: Record<string, string> = {
    green: "bg-green-100 text-green-800 border-green-200",
    yellow: "bg-yellow-100 text-yellow-800 border-yellow-200",
    red: "bg-red-100 text-red-800 border-red-200",
  };
  const riskTextMap: Record<string, string> = {
    green: "text-green-600",
    yellow: "text-yellow-600",
    red: "text-red-600",
  };

  const sliderWaistMin = unit === "cm" ? 50 : 50 * CM_TO_IN;
  const sliderWaistMax = unit === "cm" ? 150 : 150 * CM_TO_IN;
  const sliderHipMin = unit === "cm" ? 60 : 60 * CM_TO_IN;
  const sliderHipMax = unit === "cm" ? 160 : 160 * CM_TO_IN;
  const sliderHeightMin = unit === "cm" ? 140 : 140 * CM_TO_IN;
  const sliderHeightMax = unit === "cm" ? 220 : 220 * CM_TO_IN;

  const explanation = (
    <div className="prose max-w-none text-gray-700 space-y-4">
      <p>
        Your waist-to-hip ratio (WHR) is one of the most revealing measurements in preventive medicine, offering insights that your bathroom scale simply cannot provide. Unlike body weight or even BMI, WHR tells clinicians where your body stores fat — and that location matters enormously for your long-term health.
      </p>
      <p>
        <strong>Apple vs. Pear: The Shape That Shapes Your Health</strong><br />
        Physicians distinguish between two fundamental fat distribution patterns. "Android" or apple-shaped fat accumulation concentrates around the abdomen, with the waist wider than the hips. "Gynoid" or pear-shaped distribution settles fat predominantly in the hips, thighs, and buttocks. These are not merely aesthetic differences — they represent fundamentally different types of fat tissue with distinct metabolic activities. Abdominal visceral fat wraps around your internal organs, including the liver, pancreas, and intestines, and is far more metabolically active and dangerous than the subcutaneous fat deposited in your lower body.
      </p>
      <p>
        <strong>WHR vs. BMI: Which Tells More?</strong><br />
        The landmark INTERHEART study, which examined heart attack risk factors in 52 countries involving 27,000 participants, delivered a decisive verdict: WHR was a significantly stronger predictor of myocardial infarction risk than BMI. The study found that people in the highest WHR quintile had a 2.24-fold increased risk of heart attack compared to those in the lowest quintile — a more powerful association than BMI demonstrated. This is because visceral adipose tissue (VAT) secretes inflammatory cytokines, disrupts insulin signaling, and releases free fatty acids directly into the portal circulation supplying the liver, contributing to insulin resistance, dyslipidemia, and hypertension.
      </p>
      <p>
        <strong>Clinical Waist Circumference Thresholds</strong><br />
        Some clinicians use waist circumference alone as a screening tool, bypassing the hip measurement entirely. The widely accepted thresholds for elevated cardiometabolic risk are 102 cm (40 inches) for men and 88 cm (35 inches) for women. However, these cutoffs were derived primarily from Western European populations and may not apply universally.
      </p>
      <p>
        <strong>Ethnic Considerations in WHR Cutoffs</strong><br />
        Research consistently shows that South Asian and East Asian populations develop metabolic complications at lower WHR values than their Western counterparts. Organizations including the World Health Organization have recognized lower action points for these groups — approximately 0.85 for South Asian and East Asian men (versus 0.90) and 0.75 for women (versus 0.80). At any given BMI, people of South Asian descent tend to carry more visceral fat, making standard cutoffs potentially inadequate for risk identification.
      </p>
      <p>
        <strong>Measuring Correctly</strong><br />
        Measurement technique dramatically affects accuracy. For waist circumference, stand upright, breathe out naturally (do not suck in), and measure at the narrowest point between your lower rib cage and the top of the hip bone (iliac crest). Use a flexible tape held parallel to the floor without compressing the skin. For hips, measure at the widest point across the buttocks. Consistency matters more than perfection — take measurements at the same time of day under comparable conditions.
      </p>
      <p>
        <strong>Hormones, Stress, and Fat Distribution</strong><br />
        Fat distribution is not purely a function of calories consumed. Hormonal environment plays a profound role. Estrogen promotes gynoid (pear-shaped) fat distribution, which explains why pre-menopausal women naturally carry fat in the hips and thighs. After menopause, declining estrogen levels shift fat distribution toward the android pattern, increasing cardiovascular risk. Cortisol, the primary stress hormone, specifically promotes visceral fat accumulation through its interaction with cortisol receptors concentrated in abdominal fat cells. Chronic psychological stress is therefore a genuine metabolic risk factor mediated partly through WHR.
      </p>
      <p>
        <strong>Genetics and Lifestyle: A Complex Interaction</strong><br />
        Studies of twins suggest approximately 50% of fat distribution is genetically determined — you can inherit a tendency toward apple or pear shapes independent of your total body fat. However, lifestyle factors exert substantial influence over the remaining variation. High-intensity interval training (HIIT) has demonstrated superior efficacy over steady-state cardio specifically for reducing visceral adiposity. Resistance training preserves lean muscle mass while fat is lost, favorably shifting body composition. The Mediterranean dietary pattern — emphasizing olive oil, fish, legumes, vegetables, nuts, and whole grains — has shown consistent benefits for reducing visceral fat independent of caloric restriction.
      </p>
    </div>
  );

  const faqs = [
    {
      question: "What is a healthy waist-to-hip ratio?",
      answer: "A healthy WHR is below 0.90 for men and below 0.80 for women. Values above 1.0 for men and 0.90 for women indicate high cardiovascular risk according to WHO criteria.",
    },
    {
      question: "Is WHR better than BMI for health assessment?",
      answer: "Yes, for cardiovascular and metabolic risk specifically. The INTERHEART study demonstrated WHR is a stronger predictor of heart attack risk than BMI. BMI cannot distinguish between muscle and fat mass or identify where fat is stored, both of which matter greatly for health outcomes.",
    },
    {
      question: "Why do women have lower WHR thresholds than men?",
      answer: "Estrogen promotes gynoid (hip and thigh) fat distribution in women, so a higher hip-to-waist ratio is natural and healthy for women. When women's WHR approaches men's thresholds, it indicates significant android (abdominal) fat redistribution that carries elevated health risk.",
    },
    {
      question: "How do I measure my waist correctly for WHR?",
      answer: "Stand relaxed, exhale naturally without pulling your stomach in, and measure at the narrowest point between your lower ribs and hip bone. Keep the tape parallel to the floor without compressing the skin. Avoid measuring immediately after eating.",
    },
    {
      question: "Can waist-to-hip ratio be improved?",
      answer: "Yes. High-intensity interval training is particularly effective at reducing visceral abdominal fat. Resistance training preserves lean mass while reducing fat. The Mediterranean diet pattern has demonstrated visceral fat reduction benefits. Even modest weight loss of 5-10% of body weight can meaningfully improve WHR.",
    },
  ];

  const relatedCalculators = [
    { name: "Body Fat Calculator", href: "/calculators/health/body-fat-calculator" },
    { name: "BMI Calculator", href: "/calculators/health/bmi-calculator" },
    { name: "TDEE Calculator", href: "/calculators/health/tdee-calculator" },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumbs
        items={[
          { label: "Health", href: "/calculators/health" },
          { label: "Waist-to-Hip Ratio Calculator", href: "/calculators/health/waist-to-hip-ratio-calculator" },
        ]}
      />
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Waist-to-Hip Ratio Calculator</h1>
        <p className="text-base text-gray-600">Assess your body fat distribution and cardiovascular health risk</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Inputs */}
        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 space-y-6">
          <h2 className="text-lg font-semibold text-gray-800">Your Measurements</h2>

          {/* Gender toggle */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
            <div className="flex rounded-lg overflow-hidden border border-gray-200">
              <button
                onClick={() => setGender("male")}
                className={`flex-1 py-2 text-sm font-medium transition-colors ${gender === "male" ? "bg-blue-600 text-white" : "bg-white text-gray-600 hover:bg-gray-50"}`}
              >
                Male
              </button>
              <button
                onClick={() => setGender("female")}
                className={`flex-1 py-2 text-sm font-medium transition-colors ${gender === "female" ? "bg-blue-600 text-white" : "bg-white text-gray-600 hover:bg-gray-50"}`}
              >
                Female
              </button>
            </div>
          </div>

          {/* Unit toggle */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Unit</label>
            <div className="flex rounded-lg overflow-hidden border border-gray-200">
              <button
                onClick={() => setUnit("cm")}
                className={`flex-1 py-2 text-sm font-medium transition-colors ${unit === "cm" ? "bg-blue-600 text-white" : "bg-white text-gray-600 hover:bg-gray-50"}`}
              >
                Centimeters
              </button>
              <button
                onClick={() => setUnit("inches")}
                className={`flex-1 py-2 text-sm font-medium transition-colors ${unit === "inches" ? "bg-blue-600 text-white" : "bg-white text-gray-600 hover:bg-gray-50"}`}
              >
                Inches
              </button>
            </div>
          </div>

          {/* Waist */}
          <div>
            <div className="flex justify-between mb-1">
              <label className="text-sm font-medium text-gray-700">Waist Circumference</label>
              <span className="text-sm font-semibold text-blue-600">{waistDisplay.toFixed(1)} {unit}</span>
            </div>
            <input
              type="range"
              min={sliderWaistMin}
              max={sliderWaistMax}
              step={unit === "cm" ? 1 : 0.5}
              value={waistDisplay}
              onChange={(e) => handleWaistChange(parseFloat(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>{unit === "cm" ? "50 cm" : "20 in"}</span>
              <span>{unit === "cm" ? "150 cm" : "59 in"}</span>
            </div>
          </div>

          {/* Hip */}
          <div>
            <div className="flex justify-between mb-1">
              <label className="text-sm font-medium text-gray-700">Hip Circumference</label>
              <span className="text-sm font-semibold text-blue-600">{hipDisplay.toFixed(1)} {unit}</span>
            </div>
            <input
              type="range"
              min={sliderHipMin}
              max={sliderHipMax}
              step={unit === "cm" ? 1 : 0.5}
              value={hipDisplay}
              onChange={(e) => handleHipChange(parseFloat(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>{unit === "cm" ? "60 cm" : "24 in"}</span>
              <span>{unit === "cm" ? "160 cm" : "63 in"}</span>
            </div>
          </div>

          {/* Height */}
          <div>
            <div className="flex justify-between mb-1">
              <label className="text-sm font-medium text-gray-700">Height (for WHtR)</label>
              <span className="text-sm font-semibold text-blue-600">{heightDisplay.toFixed(1)} {unit}</span>
            </div>
            <input
              type="range"
              min={sliderHeightMin}
              max={sliderHeightMax}
              step={unit === "cm" ? 1 : 0.5}
              value={heightDisplay}
              onChange={(e) => handleHeightChange(parseFloat(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>{unit === "cm" ? "140 cm" : "55 in"}</span>
              <span>{unit === "cm" ? "220 cm" : "87 in"}</span>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 space-y-5">
          <h2 className="text-lg font-semibold text-gray-800">Results</h2>

          {/* WHR big display */}
          <div className="text-center py-4">
            <div className={`text-6xl font-bold ${riskTextMap[results.riskColor]}`}>
              {results.whr.toFixed(2)}
            </div>
            <div className="text-sm text-gray-500 mt-1">Waist-to-Hip Ratio</div>
            <div className={`inline-block mt-3 px-4 py-1.5 rounded-full border text-sm font-semibold ${riskBgMap[results.riskColor]}`}>
              {results.riskCategory}
            </div>
          </div>

          {/* Color bar */}
          <div>
            <div className="relative h-4 rounded-full overflow-hidden" style={{ background: "linear-gradient(to right, #22c55e, #eab308, #ef4444)" }}>
              <div
                className="absolute top-0 w-1 h-full bg-gray-900 rounded"
                style={{ left: `calc(${results.markerPct}% - 2px)` }}
              />
            </div>
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>Low Risk</span>
              <span>Moderate</span>
              <span>High Risk</span>
            </div>
          </div>

          {/* WHtR */}
          <div className="bg-gray-50 rounded-xl p-4">
            <div className="flex justify-between items-center">
              <div>
                <div className="text-sm font-medium text-gray-700">Waist-to-Height Ratio (WHtR)</div>
                <div className="text-xs text-gray-500 mt-0.5">{results.whtrCategory}</div>
              </div>
              <div className="text-2xl font-bold text-gray-800">{results.whtr.toFixed(3)}</div>
            </div>
          </div>

          {/* Ideal waist */}
          <div className="bg-blue-50 rounded-xl p-4">
            <div className="text-sm font-medium text-blue-800">Ideal Waist for Low Risk</div>
            <div className="text-2xl font-bold text-blue-700 mt-1">
              {results.idealWaist.toFixed(1)} {unit}
            </div>
            <div className="text-xs text-blue-600 mt-1">
              Based on your hip measurement and {gender === "male" ? "male" : "female"} threshold
            </div>
          </div>
        </div>
      </div>

      <CalculatorLayout
        title="Waist-to-Hip Ratio Calculator"
        description="Assess your body fat distribution and cardiovascular health risk"
        explanation={explanation}
        faqs={faqs}
        relatedCalculators={relatedCalculators}
      >
        <div></div>
      </CalculatorLayout>
    </div>
  );
}
