"use client";

import { useState, useEffect } from "react";
import Breadcrumbs from "@/components/Breadcrumbs";
import CalculatorLayout from "@/components/CalculatorLayout";

export default function IdealWeightCalculator() {
  const [height, setHeight] = useState(170);
  const [gender, setGender] = useState<"male" | "female">("male");
  const [currentWeight, setCurrentWeight] = useState(70);
  const [result, setResult] = useState<{ 
    min: number; 
    max: number; 
    ideal: number;
    currentBMI: number;
    status: string;
  } | null>(null);

  useEffect(() => {
    const recent = JSON.parse(localStorage.getItem("recentCalculators") || "[]");
    const updated = ["ideal-weight", ...recent.filter((id: string) => id !== "ideal-weight")].slice(0, 10);
    localStorage.setItem("recentCalculators", JSON.stringify(updated));
  }, []);

  useEffect(() => {
    calculate();
  }, [height, gender, currentWeight]);

  const calculate = () => {
    if (height > 0) {
      // BMI-based calculation
      const minBMI = 18.5;
      const maxBMI = 24.9;
      const idealBMI = 22;

      const heightM = height / 100;
      const min = Math.round(minBMI * heightM * heightM);
      const max = Math.round(maxBMI * heightM * heightM);
      const ideal = Math.round(idealBMI * heightM * heightM);
      
      const currentBMI = currentWeight / (heightM * heightM);
      
      let status = "";
      if (currentWeight < min) {
        status = `${Math.round(min - currentWeight)} kg below healthy range`;
      } else if (currentWeight > max) {
        status = `${Math.round(currentWeight - max)} kg above healthy range`;
      } else {
        status = "Within healthy range";
      }

      setResult({ min, max, ideal, currentBMI: Math.round(currentBMI * 10) / 10, status });
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumbs
        items={[
          { label: "Health Calculators", href: "/health-calculators" },
          { label: "Ideal Weight Calculator", href: "/calculators/health/ideal-weight-calculator" },
        ]}
      />

      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Ideal Weight Calculator</h1>
        <p className="text-base text-gray-600">
          Find your ideal weight range based on BMI recommendations
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

            {/* Current Weight Slider */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <label className="text-sm font-semibold text-gray-700">Current Weight (kg)</label>
                <input
                  type="number"
                  value={currentWeight}
                  onChange={(e) => setCurrentWeight(Number(e.target.value) || 0)}
                  className="w-20 px-3 py-1.5 text-right border border-gray-300 rounded-md text-sm font-semibold text-green-600 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <input
                type="range"
                min="30"
                max="200"
                step="1"
                value={currentWeight}
                onChange={(e) => setCurrentWeight(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>30 kg</span>
                <span>200 kg</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Results */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
          {result && (
            <div className="space-y-4">
              {/* Current Status Card */}
              <div className={`rounded-xl p-5 text-white ${
                result.status === "Within healthy range" ? "bg-green-600" : "bg-orange-600"
              }`}>
                <div className="text-xs font-medium mb-1 opacity-90">Your Current Status</div>
                <div className="text-2xl font-bold">{result.status}</div>
                <div className="text-xs mt-1 opacity-90">Current BMI: {result.currentBMI}</div>
              </div>

              {/* Ideal Weight Card */}
              <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-5">
                <div className="text-center">
                  <div className="text-sm font-semibold text-gray-700 mb-1">Ideal Weight</div>
                  <div className="text-4xl font-bold text-blue-600">{result.ideal} kg</div>
                  <div className="text-xs text-gray-600 mt-1">Based on BMI of 22</div>
                </div>
              </div>

              {/* Healthy Range */}
              <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4">
                <div className="text-sm font-semibold text-gray-700 mb-3 text-center">Healthy Weight Range</div>
                <div className="flex justify-between items-center">
                  <div className="text-center">
                    <div className="text-xs text-gray-600 mb-1">Minimum</div>
                    <div className="text-2xl font-bold text-gray-700">{result.min} kg</div>
                    <div className="text-xs text-gray-500">BMI 18.5</div>
                  </div>
                  <div className="text-gray-400">—</div>
                  <div className="text-center">
                    <div className="text-xs text-gray-600 mb-1">Maximum</div>
                    <div className="text-2xl font-bold text-gray-700">{result.max} kg</div>
                    <div className="text-xs text-gray-500">BMI 24.9</div>
                  </div>
                </div>
              </div>

              {/* Visual Weight Range Bar */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <div className="text-xs font-semibold text-gray-700 mb-2 text-center">Weight Position</div>
                <div className="relative h-8 bg-gray-200 rounded-full overflow-hidden">
                  {/* Healthy range indicator */}
                  <div 
                    className="absolute h-full bg-green-300"
                    style={{
                      left: `${Math.max(0, ((result.min - 30) / 170) * 100)}%`,
                      width: `${((result.max - result.min) / 170) * 100}%`
                    }}
                  />
                  {/* Current weight marker */}
                  <div 
                    className="absolute top-0 w-1 h-full bg-blue-600 shadow-lg"
                    style={{
                      left: `${Math.max(0, Math.min(100, ((currentWeight - 30) / 170) * 100))}%`
                    }}
                  >
                    <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs font-bold text-blue-600 whitespace-nowrap">
                      You
                    </div>
                  </div>
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>30 kg</span>
                  <span>200 kg</span>
                </div>
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
              This calculator provides an ideal weight range based on BMI recommendations. The healthy weight
              range corresponds to a BMI of 18.5-24.9.
            </p>
          </div>
        }
        faqs={[
          { question: "Is ideal weight the same for everyone?", answer: "No, ideal weight varies by height, gender, age, and body composition. This calculator provides a general healthy range." },
        ]}
        relatedCalculators={[
          { name: "BMI Calculator", href: "/calculators/health/bmi-calculator" },
          { name: "BMR Calculator", href: "/calculators/health/bmr-calculator" },
        ]}
      >
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900">Understanding Ideal Weight</h2>
          <p className="text-gray-700">
            Your ideal weight is based on Body Mass Index (BMI) recommendations from health organizations. 
            A BMI of 18.5-24.9 is considered healthy, with 22 being optimal for most people.
          </p>
          
          <h3 className="text-xl font-semibold text-gray-900 mt-6">BMI Categories</h3>
          <ul className="list-disc pl-6 text-gray-700 space-y-2">
            <li><strong>Underweight:</strong> BMI below 18.5</li>
            <li><strong>Normal weight:</strong> BMI 18.5-24.9 (healthy range)</li>
            <li><strong>Overweight:</strong> BMI 25-29.9</li>
            <li><strong>Obese:</strong> BMI 30 or above</li>
          </ul>

          <h3 className="text-xl font-semibold text-gray-900 mt-6">Important Considerations</h3>
          <ul className="list-disc pl-6 text-gray-700 space-y-2">
            <li>BMI doesn't account for muscle mass - athletes may have higher BMI but be healthy</li>
            <li>Age, bone density, and body composition also affect ideal weight</li>
            <li>Consult healthcare professionals for personalized weight goals</li>
            <li>Focus on health markers (energy, fitness) not just the scale</li>
            <li>Sustainable weight management is better than rapid changes</li>
          </ul>

          <h3 className="text-xl font-semibold text-gray-900 mt-6">Achieving Your Ideal Weight</h3>
          <ul className="list-disc pl-6 text-gray-700 space-y-2">
            <li>Use the <a href="/calculators/health/calorie-calculator" className="text-blue-600 hover:underline">Calorie Calculator</a> to plan your diet</li>
            <li>Combine healthy eating with regular exercise</li>
            <li>Aim for 0.5-1 kg per week for healthy weight loss</li>
            <li>Track progress with weekly weigh-ins</li>
            <li>Stay consistent and patient with your journey</li>
          </ul>
        </div>
      </CalculatorLayout>
    </div>
  );
}
