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

  const clampValue = (value: number, min: number, max: number) =>
    Math.min(max, Math.max(min, value));
  const bmiGaugePercent = result ? clampValue((result.currentBMI - 14) / 26, 0, 1) : 0;
  const pointerAngle = Math.PI - bmiGaugePercent * Math.PI;
  const pointerX = 120 + 80 * Math.cos(pointerAngle);
  const pointerY = 120 - 80 * Math.sin(pointerAngle);
  const weightRangeMin = 30;
  const weightRangeMax = 200;
  const rangeSpan = weightRangeMax - weightRangeMin;
  const healthyLeft = result
    ? clampValue(((result.min - weightRangeMin) / rangeSpan) * 100, 0, 100)
    : 0;
  const healthyWidth = result
    ? clampValue(((result.max - result.min) / rangeSpan) * 100, 0, 100 - healthyLeft)
    : 0;
  const markerPosition = result ? clampValue(((currentWeight - weightRangeMin) / rangeSpan) * 100, 0, 100) : 0;
  const isHealthyRange = result ? result.status.toLowerCase().includes("within") : false;
  const statusGradient = isHealthyRange
    ? "from-emerald-500 via-emerald-400 to-emerald-500"
    : "from-orange-500 via-amber-400 to-orange-500";
  const statusBadge = isHealthyRange ? "bg-emerald-100 text-emerald-700" : "bg-orange-100 text-orange-700";

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <Breadcrumbs
        items={[
          { label: "Health Calculators", href: "/health-calculators" },
          { label: "Ideal Weight Calculator", href: "/calculators/health/ideal-weight-calculator" },
        ]}
      />

      <div className="glow-card p-6 sm:p-8 text-white/90">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <span className="inline-flex items-center text-xs uppercase tracking-[0.4em] text-white/60 mb-3">Health</span>
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">Ideal Weight Calculator</h1>
            <p className="text-white/70 text-base max-w-2xl">
              Get a personalized weight range, BMI insight, and visual guide for how close you are to the healthiest zone for your height and gender.
            </p>
          </div>
          {result && (
            <div className="grid grid-cols-2 gap-3 min-w-[220px]">
              <div className="rounded-2xl border border-white/20 bg-white/10 p-4 text-center">
                <p className="text-xs text-white/60 uppercase tracking-[0.3em]">Healthy Min</p>
                <p className="text-2xl font-semibold text-white">{result.min}kg</p>
              </div>
              <div className="rounded-2xl border border-white/20 bg-white/10 p-4 text-center">
                <p className="text-xs text-white/60 uppercase tracking-[0.3em]">Healthy Max</p>
                <p className="text-2xl font-semibold text-white">{result.max}kg</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Left Side - Interactive Controls */}
        <div className="bg-white/95 rounded-[28px] shadow-[0_20px_80px_rgba(15,23,42,0.18)] p-6 sm:p-8 border border-white/80">
          <div className="space-y-6">
            {/* Gender Selector */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">Gender</label>
              <div className="flex gap-3 bg-gray-100 rounded-full p-1">
                <button
                  onClick={() => setGender("male")}
                  className={`flex-1 py-2 rounded-full font-semibold transition-colors ${
                    gender === "male"
                      ? "bg-blue-600 text-white shadow-lg"
                      : "text-gray-600 hover:text-blue-600"
                  }`}
                >
                  Male
                </button>
                <button
                  onClick={() => setGender("female")}
                  className={`flex-1 py-2 rounded-full font-semibold transition-colors ${
                    gender === "female"
                      ? "bg-pink-600 text-white shadow-lg"
                      : "text-gray-600 hover:text-pink-600"
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
        <div className="bg-white/95 rounded-[28px] shadow-[0_20px_80px_rgba(15,23,42,0.12)] p-6 sm:p-8 border border-white/80">
          {result && (
            <div className="space-y-6">
              {/* Current Status Card */}
              <div className={`rounded-[24px] p-5 text-white bg-gradient-to-tr ${statusGradient} shadow-lg`}>
                <div className="text-xs font-semibold mb-2 uppercase tracking-[0.3em] opacity-80">Your current status</div>
                <div className="text-3xl font-bold">{result.status}</div>
                <div className="flex items-center gap-3 mt-3">
                  <span className="text-sm font-semibold bg-white/20 rounded-full px-3 py-1">BMI {result.currentBMI}</span>
                  <span className={`text-xs font-semibold rounded-full px-3 py-1 ${statusBadge}`}>
                    {isHealthyRange ? "Healthy" : "Needs attention"}
                  </span>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                {/* Ideal Weight Card */}
                <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5 text-center">
                  <p className="text-xs uppercase tracking-[0.3em] text-blue-500 mb-2">Ideal weight</p>
                  <p className="text-4xl font-bold text-blue-600">{result.ideal} kg</p>
                  <p className="text-xs text-blue-500 mt-1">Based on BMI of 22</p>
                </div>

                {/* Healthy Range */}
                <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-5 text-center">
                  <p className="text-xs uppercase tracking-[0.3em] text-emerald-500 mb-2">Healthy range</p>
                  <div className="flex items-center justify-center gap-4">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Min</p>
                      <p className="text-2xl font-bold text-gray-800">{result.min} kg</p>
                    </div>
                    <div className="text-gray-300 text-2xl">—</div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Max</p>
                      <p className="text-2xl font-bold text-gray-800">{result.max} kg</p>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-3">BMI 18.5 – 24.9</p>
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                {/* BMI Gauge */}
                <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5">
                  <p className="text-sm font-semibold text-gray-700 mb-3 text-center">BMI Gauge</p>
                  <div className="flex flex-col items-center">
                    <svg viewBox="0 0 240 140" className="w-full max-w-xs">
                      <defs>
                        <linearGradient id="bmiGaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#f97316" />
                          <stop offset="40%" stopColor="#fbbf24" />
                          <stop offset="70%" stopColor="#34d399" />
                          <stop offset="100%" stopColor="#38bdf8" />
                        </linearGradient>
                      </defs>
                      <path
                        d="M30 120 A90 90 0 0 1 210 120"
                        stroke="#e5e7eb"
                        strokeWidth="18"
                        fill="none"
                        strokeLinecap="round"
                      />
                      <path
                        d="M30 120 A90 90 0 0 1 210 120"
                        stroke="url(#bmiGaugeGradient)"
                        strokeWidth="18"
                        fill="none"
                        strokeLinecap="round"
                      />
                      <line
                        x1="120"
                        y1="120"
                        x2={pointerX}
                        y2={pointerY}
                        stroke="#0ea5e9"
                        strokeWidth="8"
                        strokeLinecap="round"
                      />
                      <circle cx="120" cy="120" r="10" fill="#0ea5e9" />
                    </svg>
                    <p className="text-2xl font-bold text-gray-800 mt-2">{result.currentBMI}</p>
                    <p className="text-sm text-gray-500">BMI now</p>
                    <div className="flex gap-4 text-xs text-gray-500 mt-3">
                      <span>Underweight</span>
                      <span>Healthy</span>
                      <span>Overweight</span>
                    </div>
                  </div>
                </div>

                {/* Visual Weight Range Bar */}
                <div className="bg-gray-50 border border-gray-200 rounded-2xl p-5">
                  <p className="text-sm font-semibold text-gray-700 mb-3 text-center">Weight Position</p>
                  <div className="relative h-10 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="absolute h-full bg-emerald-300/70"
                      style={{
                        left: `${healthyLeft}%`,
                        width: `${healthyWidth}%`,
                      }}
                    />
                    <div
                      className="absolute top-1/2 -translate-y-1/2 w-[2px] h-12 bg-blue-600 shadow-lg shadow-blue-200"
                      style={{ left: `${markerPosition}%` }}
                    >
                      <div className="absolute -top-7 left-1/2 -translate-x-1/2 text-xs font-bold text-blue-600 whitespace-nowrap">
                        You
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 mt-2">
                    <span>{weightRangeMin} kg</span>
                    <span>{weightRangeMax} kg</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Explanation Section */}
      <CalculatorLayout
        title="Ideal Weight Playbook"
        description="Learn how BMI defines your healthy weight zone and what habits keep you on track."
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
