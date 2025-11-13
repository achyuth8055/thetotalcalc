"use client";

import { useState, useEffect } from "react";
import Breadcrumbs from "@/components/Breadcrumbs";
import CalculatorLayout from "@/components/CalculatorLayout";

export default function BMICalculator() {
  const [weight, setWeight] = useState(70);
  const [height, setHeight] = useState(170);
  const [unit, setUnit] = useState<"metric" | "imperial">("metric");
  const [result, setResult] = useState<{
    bmi: number;
    category: string;
    color: string;
    bgColor: string;
  } | null>(null);

  useEffect(() => {
    const recent = JSON.parse(localStorage.getItem("recentCalculators") || "[]");
    const updated = ["bmi", ...recent.filter((id: string) => id !== "bmi")].slice(0, 10);
    localStorage.setItem("recentCalculators", JSON.stringify(updated));
    calculateBMI();
  }, []);

  useEffect(() => {
    calculateBMI();
  }, [weight, height, unit]);

  const calculateBMI = () => {
    let w = weight;
    let h = height;

    if (unit === "imperial") {
      w = w * 0.453592; // pounds to kg
      h = h * 2.54; // inches to cm
    }

    if (w > 0 && h > 0) {
      const bmi = w / Math.pow(h / 100, 2);
      let category = "";
      let color = "";
      let bgColor = "";

      if (bmi < 18.5) {
        category = "Underweight";
        color = "text-blue-600";
        bgColor = "bg-blue-600";
      } else if (bmi < 25) {
        category = "Normal weight";
        color = "text-green-600";
        bgColor = "bg-green-600";
      } else if (bmi < 30) {
        category = "Overweight";
        color = "text-orange-600";
        bgColor = "bg-orange-600";
      } else {
        category = "Obese";
        color = "text-red-600";
        bgColor = "bg-red-600";
      }

      setResult({ bmi, category, color, bgColor });
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumbs
        items={[
          { label: "Health Calculators", href: "/health-calculators" },
          { label: "BMI Calculator", href: "/calculators/health/bmi-calculator" },
        ]}
      />

      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">BMI Calculator</h1>
        <p className="text-base text-gray-600">
          Calculate your Body Mass Index and understand your healthy weight range
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Left Side - Interactive Controls */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
          <div className="space-y-6">
            {/* Unit Selector */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">Unit System</label>
              <div className="flex gap-3">
                <button
                  onClick={() => setUnit("metric")}
                  className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                    unit === "metric"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Metric (kg/cm)
                </button>
                <button
                  onClick={() => setUnit("imperial")}
                  className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                    unit === "imperial"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Imperial (lbs/in)
                </button>
              </div>
            </div>

            {/* Weight Slider */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <label className="text-sm font-semibold text-gray-700">
                  Weight {unit === "metric" ? "(kg)" : "(lbs)"}
                </label>
                <input
                  type="number"
                  value={weight}
                  onChange={(e) => setWeight(Number(e.target.value) || 0)}
                  className="w-24 px-3 py-1.5 text-right border border-gray-300 rounded-md text-sm font-semibold text-blue-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <input
                type="range"
                min={unit === "metric" ? "30" : "66"}
                max={unit === "metric" ? "200" : "440"}
                step="1"
                value={weight}
                onChange={(e) => setWeight(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>{unit === "metric" ? "30 kg" : "66 lbs"}</span>
                <span>{unit === "metric" ? "200 kg" : "440 lbs"}</span>
              </div>
            </div>

            {/* Height Slider */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <label className="text-sm font-semibold text-gray-700">
                  Height {unit === "metric" ? "(cm)" : "(inches)"}
                </label>
                <input
                  type="number"
                  value={height}
                  onChange={(e) => setHeight(Number(e.target.value) || 0)}
                  className="w-24 px-3 py-1.5 text-right border border-gray-300 rounded-md text-sm font-semibold text-green-600 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <input
                type="range"
                min={unit === "metric" ? "100" : "39"}
                max={unit === "metric" ? "220" : "87"}
                step="1"
                value={height}
                onChange={(e) => setHeight(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>{unit === "metric" ? "100 cm" : "39 in"}</span>
                <span>{unit === "metric" ? "220 cm" : "87 in"}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Results */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
          {result && (
            <div className="space-y-5">
              {/* BMI Value - Highlight */}
              <div className={`${result.bgColor} rounded-xl p-5 text-white`}>
                <div className="text-xs font-medium mb-1 opacity-90">Your BMI</div>
                <div className="text-3xl font-bold">{result.bmi.toFixed(1)}</div>
                <div className="text-sm mt-1 opacity-95">{result.category}</div>
              </div>

              {/* BMI Gauge/Scale */}
              <div className="space-y-3">
                <div className="text-sm font-semibold text-gray-700 mb-2">BMI Scale</div>
                <div className="relative h-8 bg-gradient-to-r from-blue-500 via-green-500 via-yellow-500 to-red-500 rounded-lg">
                  {/* BMI Marker */}
                  <div
                    className="absolute top-0 bottom-0 w-1 bg-gray-900 shadow-lg"
                    style={{
                      left: `${Math.min(Math.max(((result.bmi - 15) / 25) * 100, 0), 100)}%`,
                      transform: "translateX(-50%)",
                    }}
                  >
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-0.5 rounded whitespace-nowrap">
                      {result.bmi.toFixed(1)}
                    </div>
                  </div>
                </div>
                <div className="flex justify-between text-xs text-gray-600">
                  <span>15</span>
                  <span>20</span>
                  <span>25</span>
                  <span>30</span>
                  <span>35</span>
                  <span>40</span>
                </div>
              </div>

              {/* Categories */}
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2 rounded-lg bg-blue-50">
                  <span className="text-sm text-gray-700">Underweight</span>
                  <span className="text-xs font-medium text-blue-600">&lt; 18.5</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg bg-green-50">
                  <span className="text-sm text-gray-700">Normal weight</span>
                  <span className="text-xs font-medium text-green-600">18.5 - 24.9</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg bg-orange-50">
                  <span className="text-sm text-gray-700">Overweight</span>
                  <span className="text-xs font-medium text-orange-600">25 - 29.9</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg bg-red-50">
                  <span className="text-sm text-gray-700">Obese</span>
                  <span className="text-xs font-medium text-red-600">&ge; 30</span>
                </div>
              </div>

              {/* Health Info */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs text-gray-700">
                <p className="mb-1">
                  <strong>Status:</strong> Your BMI is {result.bmi.toFixed(1)}, which is considered <strong>{result.category.toLowerCase()}</strong>.
                </p>
                <p>
                  {result.bmi < 18.5 && "Consider consulting with a healthcare provider about healthy weight gain strategies."}
                  {result.bmi >= 18.5 && result.bmi < 25 && "You're in a healthy weight range! Maintain your current lifestyle."}
                  {result.bmi >= 25 && result.bmi < 30 && "Consider adopting a healthy diet and regular exercise routine."}
                  {result.bmi >= 30 && "Consult with a healthcare provider for personalized weight management advice."}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Explanation Section */}
      <CalculatorLayout
        title=""
        description=""
        explanation={
          <div>
            <p className="mb-4">
              BMI (Body Mass Index) is a measure of body fat based on height and weight that applies to adult men and women.
            </p>
            <p className="mb-4">
              <strong>Formula:</strong> BMI = weight (kg) / [height (m)]²
            </p>
            <div className="space-y-2">
              <p><strong>BMI Categories:</strong></p>
              <ul className="list-disc list-inside">
                <li>Underweight: BMI less than 18.5</li>
                <li>Normal weight: BMI 18.5 to 24.9</li>
                <li>Overweight: BMI 25 to 29.9</li>
                <li>Obese: BMI 30 or greater</li>
              </ul>
            </div>
          </div>
        }
        faqs={[
          {
            question: "What is a healthy BMI?",
            answer: "A healthy BMI for adults is typically between 18.5 and 24.9. However, BMI doesn't account for muscle mass, bone density, or overall body composition.",
          },
          {
            question: "Is BMI accurate?",
            answer: "BMI is a useful screening tool but has limitations. It doesn't distinguish between muscle and fat, and may not be accurate for athletes, elderly, or pregnant women.",
          },
        ]}
        relatedCalculators={[
          { name: "BMR Calculator", href: "/calculators/health/bmr-calculator" },
          { name: "Calorie Calculator", href: "/calculators/health/calorie-calculator" },
          { name: "Ideal Weight", href: "/calculators/health/ideal-weight-calculator" },
        ]}
      >
        <div></div>
      </CalculatorLayout>
    </div>
  );
}
