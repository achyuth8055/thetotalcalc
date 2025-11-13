"use client";

import { useState, useEffect } from "react";
import Breadcrumbs from "@/components/Breadcrumbs";
import CalculatorLayout from "@/components/CalculatorLayout";

export default function CalorieCalculator() {
  const [tdee, setTdee] = useState(2000);
  const [result, setResult] = useState<{ 
    maintenance: number; 
    mildLoss: number;
    moderateLoss: number;
    mildGain: number;
    moderateGain: number;
  } | null>(null);

  useEffect(() => {
    const recent = JSON.parse(localStorage.getItem("recentCalculators") || "[]");
    const updated = ["calorie", ...recent.filter((id: string) => id !== "calorie")].slice(0, 10);
    localStorage.setItem("recentCalculators", JSON.stringify(updated));
  }, []);

  useEffect(() => {
    calculate();
  }, [tdee]);

  const calculate = () => {
    if (tdee > 0) {
      setResult({
        maintenance: Math.round(tdee),
        mildLoss: Math.round(tdee - 250),
        moderateLoss: Math.round(tdee - 500),
        mildGain: Math.round(tdee + 250),
        moderateGain: Math.round(tdee + 500)
      });
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumbs
        items={[
          { label: "Health Calculators", href: "/health-calculators" },
          { label: "Calorie Calculator", href: "/calculators/health/calorie-calculator" },
        ]}
      />

      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Daily Calorie Calculator</h1>
        <p className="text-base text-gray-600">
          Calculate your daily calorie needs for different weight goals
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Left Side - Interactive Controls */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
          <div className="space-y-6">
            {/* TDEE Slider */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <label className="text-sm font-semibold text-gray-700">Your TDEE (Maintenance Calories)</label>
                <input
                  type="number"
                  value={tdee}
                  onChange={(e) => setTdee(Number(e.target.value) || 0)}
                  className="w-24 px-3 py-1.5 text-right border border-gray-300 rounded-md text-sm font-semibold text-blue-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <input
                type="range"
                min="1200"
                max="4000"
                step="50"
                value={tdee}
                onChange={(e) => setTdee(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>1200</span>
                <span>4000</span>
              </div>
            </div>

            {/* Info Box */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="text-sm font-semibold text-gray-700 mb-2">💡 What is TDEE?</div>
              <p className="text-xs text-gray-600">
                TDEE (Total Daily Energy Expenditure) is the total number of calories you burn per day, 
                including activity. Calculate it using the <a href="/calculators/health/bmr-calculator" className="text-blue-600 hover:underline">BMR Calculator</a>.
              </p>
            </div>
          </div>
        </div>

        {/* Right Side - Results */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
          {result && (
            <div className="space-y-3">
              {/* Maintain Weight */}
              <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-semibold text-gray-700">Maintain Weight</span>
                  <span className="text-xs bg-green-600 text-white px-2 py-1 rounded-full">Balanced</span>
                </div>
                <div className="text-2xl font-bold text-green-600">{result.maintenance} cal/day</div>
                <p className="text-xs text-gray-600 mt-1">Keep your current weight stable</p>
              </div>

              {/* Mild Weight Loss */}
              <div className="bg-orange-50 border-2 border-orange-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-semibold text-gray-700">Mild Weight Loss</span>
                  <span className="text-xs bg-orange-500 text-white px-2 py-1 rounded-full">-0.25 kg/week</span>
                </div>
                <div className="text-2xl font-bold text-orange-500">{result.mildLoss} cal/day</div>
                <p className="text-xs text-gray-600 mt-1">250 calorie deficit for gradual loss</p>
              </div>

              {/* Moderate Weight Loss */}
              <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-semibold text-gray-700">Moderate Weight Loss</span>
                  <span className="text-xs bg-red-600 text-white px-2 py-1 rounded-full">-0.5 kg/week</span>
                </div>
                <div className="text-2xl font-bold text-red-600">{result.moderateLoss} cal/day</div>
                <p className="text-xs text-gray-600 mt-1">500 calorie deficit for steady loss</p>
              </div>

              {/* Mild Weight Gain */}
              <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-semibold text-gray-700">Mild Weight Gain</span>
                  <span className="text-xs bg-blue-500 text-white px-2 py-1 rounded-full">+0.25 kg/week</span>
                </div>
                <div className="text-2xl font-bold text-blue-500">{result.mildGain} cal/day</div>
                <p className="text-xs text-gray-600 mt-1">250 calorie surplus for slow gain</p>
              </div>

              {/* Moderate Weight Gain */}
              <div className="bg-purple-50 border-2 border-purple-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-semibold text-gray-700">Moderate Weight Gain</span>
                  <span className="text-xs bg-purple-600 text-white px-2 py-1 rounded-full">+0.5 kg/week</span>
                </div>
                <div className="text-2xl font-bold text-purple-600">{result.moderateGain} cal/day</div>
                <p className="text-xs text-gray-600 mt-1">500 calorie surplus for muscle building</p>
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
              Your calorie needs depend on your BMR and your goals. This calculator helps determine
              the right calorie intake for your objectives.
            </p>
            <ul className="list-disc list-inside">
              <li>Weight loss: Create a calorie deficit (consume less than TDEE)</li>
              <li>Maintenance: Eat at your TDEE</li>
              <li>Weight gain: Create a calorie surplus</li>
            </ul>
          </div>
        }
        faqs={[
          { question: "How many calories to lose 1 pound per week?", answer: "You need a deficit of approximately 500 calories per day, which equals 3,500 calories per week (1 pound)." },
          { question: "Is a 500 calorie deficit safe?", answer: "A 500 calorie deficit is generally considered safe and sustainable for most people, leading to about 0.5 kg (1 lb) of weight loss per week." },
          { question: "How quickly will I see results?", answer: "Weight changes typically become noticeable after 2-3 weeks of consistent calorie management combined with exercise." },
        ]}
        relatedCalculators={[
          { name: "BMR Calculator", href: "/calculators/health/bmr-calculator" },
          { name: "BMI Calculator", href: "/calculators/health/bmi-calculator" },
          { name: "Ideal Weight Calculator", href: "/calculators/health/ideal-weight-calculator" },
        ]}
      >
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900">Understanding Calorie Deficits & Surpluses</h2>
          <p className="text-gray-700">
            Your calorie intake directly impacts your weight. Creating a deficit (eating less than TDEE) leads to weight loss, 
            while a surplus (eating more) leads to weight gain.
          </p>
          
          <h3 className="text-xl font-semibold text-gray-900 mt-6">Calorie Guidelines</h3>
          <ul className="list-disc pl-6 text-gray-700 space-y-2">
            <li><strong>250 cal deficit:</strong> Safe for gradual weight loss (~0.25 kg/week)</li>
            <li><strong>500 cal deficit:</strong> Moderate weight loss (~0.5 kg/week)</li>
            <li><strong>250 cal surplus:</strong> Slow muscle gain without excess fat</li>
            <li><strong>500 cal surplus:</strong> Faster muscle building for bulking phase</li>
          </ul>

          <h3 className="text-xl font-semibold text-gray-900 mt-6">Important Tips</h3>
          <ul className="list-disc pl-6 text-gray-700 space-y-2">
            <li>Don't go below 1200 calories/day (women) or 1500 calories/day (men) without medical supervision</li>
            <li>Track your calories consistently using a food diary or app</li>
            <li>Combine calorie management with strength training for best body composition</li>
            <li>Adjust your intake based on progress - weigh yourself weekly</li>
            <li>Focus on nutrient-dense foods for better satiety and health</li>
          </ul>
        </div>
      </CalculatorLayout>
    </div>
  );
}
