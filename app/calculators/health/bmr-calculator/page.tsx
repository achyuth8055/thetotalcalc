"use client";

import { useState, useEffect } from "react";
import Breadcrumbs from "@/components/Breadcrumbs";
import CalculatorLayout from "@/components/CalculatorLayout";

export default function BMRCalculator() {
  const [age, setAge] = useState(30);
  const [gender, setGender] = useState<"male" | "female">("male");
  const [weight, setWeight] = useState(70);
  const [height, setHeight] = useState(170);
  const [activityLevel, setActivityLevel] = useState("moderate");
  const [result, setResult] = useState<{ 
    bmr: number; 
    maintenance: number;
    weightLoss: number;
    weightGain: number;
  } | null>(null);

  useEffect(() => {
    const recent = JSON.parse(localStorage.getItem("recentCalculators") || "[]");
    const updated = ["bmr", ...recent.filter((id: string) => id !== "bmr")].slice(0, 10);
    localStorage.setItem("recentCalculators", JSON.stringify(updated));
    calculate();
  }, []);

  useEffect(() => {
    calculate();
  }, [age, gender, weight, height, activityLevel]);

  const calculate = () => {
    const w = weight;
    const h = height;
    const a = age;

    if (w > 0 && h > 0 && a > 0) {
      // Mifflin-St Jeor Equation
      let bmr;
      if (gender === "male") {
        bmr = 10 * w + 6.25 * h - 5 * a + 5;
      } else {
        bmr = 10 * w + 6.25 * h - 5 * a - 161;
      }

      const activityMultipliers: {[key: string]: number} = {
        sedentary: 1.2,
        light: 1.375,
        moderate: 1.55,
        active: 1.725,
        veryActive: 1.9,
      };

      const maintenance = bmr * activityMultipliers[activityLevel];
      const weightLoss = maintenance - 500; // 500 calorie deficit
      const weightGain = maintenance + 500; // 500 calorie surplus

      setResult({ 
        bmr: Math.round(bmr), 
        maintenance: Math.round(maintenance),
        weightLoss: Math.round(weightLoss),
        weightGain: Math.round(weightGain)
      });
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumbs
        items={[
          { label: "Health Calculators", href: "/health-calculators" },
          { label: "BMR Calculator", href: "/calculators/health/bmr-calculator" },
        ]}
      />

      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">BMR & Calorie Calculator</h1>
        <p className="text-base text-gray-600">
          Calculate your Basal Metabolic Rate and daily calorie needs for your goals
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Left Side - Interactive Controls */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
          <div className="space-y-6">
            {/* Gender Selector */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">Gender</label>
              <div className="flex gap-3">
                <button
                  onClick={() => setGender("male")}
                  className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                    gender === "male"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Male
                </button>
                <button
                  onClick={() => setGender("female")}
                  className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                    gender === "female"
                      ? "bg-pink-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Female
                </button>
              </div>
            </div>

            {/* Age Slider */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <label className="text-sm font-semibold text-gray-700">Age</label>
                <input
                  type="number"
                  value={age}
                  onChange={(e) => setAge(Number(e.target.value) || 0)}
                  className="w-20 px-3 py-1.5 text-right border border-gray-300 rounded-md text-sm font-semibold text-blue-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <input
                type="range"
                min="15"
                max="80"
                step="1"
                value={age}
                onChange={(e) => setAge(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>15</span>
                <span>80</span>
              </div>
            </div>

            {/* Weight Slider */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <label className="text-sm font-semibold text-gray-700">Weight (kg)</label>
                <input
                  type="number"
                  value={weight}
                  onChange={(e) => setWeight(Number(e.target.value) || 0)}
                  className="w-20 px-3 py-1.5 text-right border border-gray-300 rounded-md text-sm font-semibold text-green-600 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <input
                type="range"
                min="30"
                max="200"
                step="1"
                value={weight}
                onChange={(e) => setWeight(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>30 kg</span>
                <span>200 kg</span>
              </div>
            </div>

            {/* Height Slider */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <label className="text-sm font-semibold text-gray-700">Height (cm)</label>
                <input
                  type="number"
                  value={height}
                  onChange={(e) => setHeight(Number(e.target.value) || 0)}
                  className="w-20 px-3 py-1.5 text-right border border-gray-300 rounded-md text-sm font-semibold text-purple-600 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <input
                type="range"
                min="100"
                max="220"
                step="1"
                value={height}
                onChange={(e) => setHeight(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>100 cm</span>
                <span>220 cm</span>
              </div>
            </div>

            {/* Activity Level */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">Activity Level</label>
              <select
                value={activityLevel}
                onChange={(e) => setActivityLevel(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-md text-sm font-semibold text-orange-600 focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white"
              >
                <option value="sedentary">Sedentary (little or no exercise)</option>
                <option value="light">Light (exercise 1-3 days/week)</option>
                <option value="moderate">Moderate (exercise 3-5 days/week)</option>
                <option value="active">Active (exercise 6-7 days/week)</option>
                <option value="veryActive">Very Active (intense exercise daily)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Right Side - Results */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
          {result && (
            <div className="space-y-4">
              {/* BMR Card */}
              <div className="bg-blue-600 rounded-xl p-5 text-white">
                <div className="text-xs font-medium mb-1 opacity-90">Basal Metabolic Rate (BMR)</div>
                <div className="text-3xl font-bold">{result.bmr} cal/day</div>
                <div className="text-xs mt-1 opacity-90">Calories burned at rest</div>
              </div>

              {/* Three Goal Cards */}
              <div className="space-y-3">
                {/* Maintenance */}
                <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-semibold text-gray-700">Maintain Weight</span>
                    <span className="text-xs bg-green-600 text-white px-2 py-1 rounded-full">Target</span>
                  </div>
                  <div className="text-2xl font-bold text-green-600">{result.maintenance} cal/day</div>
                  <p className="text-xs text-gray-600 mt-1">Eat this amount to maintain current weight</p>
                </div>

                {/* Weight Loss */}
                <div className="bg-orange-50 border-2 border-orange-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-semibold text-gray-700">Lose Weight</span>
                    <span className="text-xs bg-orange-600 text-white px-2 py-1 rounded-full">-0.5 kg/week</span>
                  </div>
                  <div className="text-2xl font-bold text-orange-600">{result.weightLoss} cal/day</div>
                  <p className="text-xs text-gray-600 mt-1">500 calorie deficit for healthy weight loss</p>
                </div>

                {/* Weight Gain */}
                <div className="bg-purple-50 border-2 border-purple-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-semibold text-gray-700">Gain Weight</span>
                    <span className="text-xs bg-purple-600 text-white px-2 py-1 rounded-full">+0.5 kg/week</span>
                  </div>
                  <div className="text-2xl font-bold text-purple-600">{result.weightGain} cal/day</div>
                  <p className="text-xs text-gray-600 mt-1">500 calorie surplus for muscle gain</p>
                </div>
              </div>

              {/* Info Note */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs text-gray-700">
                <p className="mb-1">
                  <strong>Activity Level:</strong> {activityLevel.charAt(0).toUpperCase() + activityLevel.slice(1).replace(/([A-Z])/g, ' $1')}
                </p>
                <p>
                  <strong>Formula:</strong> Mifflin-St Jeor Equation
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
              BMR (Basal Metabolic Rate) is the number of calories your body needs to perform basic life-sustaining functions.
              TDEE (Total Daily Energy Expenditure) accounts for your activity level.
            </p>
            <p><strong>Mifflin-St Jeor Equation:</strong></p>
            <ul className="list-disc list-inside">
              <li>Men: BMR = 10W + 6.25H - 5A + 5</li>
              <li>Women: BMR = 10W + 6.25H - 5A - 161</li>
            </ul>
          </div>
        }
        faqs={[
          { question: "What's the difference between BMR and TDEE?", answer: "BMR is your calorie burn at complete rest. TDEE includes activity and is typically 20-80% higher than BMR." },
        ]}
        relatedCalculators={[
          { name: "BMI Calculator", href: "/calculators/health/bmi-calculator" },
          { name: "Calorie Calculator", href: "/calculators/health/calorie-calculator" },
        ]}
      >
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900">Understanding BMR</h2>
          <p className="text-gray-700">
            Your Basal Metabolic Rate (BMR) is the number of calories your body needs to perform basic life-sustaining functions. 
            This includes breathing, circulation, cell production, and nutrient processing.
          </p>
          
          <h3 className="text-xl font-semibold text-gray-900 mt-6">Activity Level Multipliers</h3>
          <ul className="list-disc pl-6 text-gray-700 space-y-2">
            <li><strong>Sedentary (1.2):</strong> Little to no exercise, desk job</li>
            <li><strong>Light (1.375):</strong> Light exercise 1-3 days per week</li>
            <li><strong>Moderate (1.55):</strong> Moderate exercise 3-5 days per week</li>
            <li><strong>Active (1.725):</strong> Hard exercise 6-7 days per week</li>
            <li><strong>Very Active (1.9):</strong> Very hard exercise and physical job</li>
          </ul>

          <h3 className="text-xl font-semibold text-gray-900 mt-6">Weight Management Tips</h3>
          <ul className="list-disc pl-6 text-gray-700 space-y-2">
            <li>A deficit of 500 calories per day typically leads to losing 0.5 kg per week</li>
            <li>A surplus of 500 calories per day can help gain 0.5 kg per week</li>
            <li>Always consult with healthcare professionals before major dietary changes</li>
            <li>Combine calorie management with regular exercise for best results</li>
          </ul>
        </div>
      </CalculatorLayout>
    </div>
  );
}
