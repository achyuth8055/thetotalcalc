"use client";

import { useState, useEffect } from "react";
import Breadcrumbs from "@/components/Breadcrumbs";
import CalculatorLayout from "@/components/CalculatorLayout";

export default function PercentageCalculator() {
  const [value1, setValue1] = useState(50);
  const [value2, setValue2] = useState(200);
  const [results, setResults] = useState<{
    percentOf: number;
    isPercent: number;
    percentChange: number;
  } | null>(null);

  useEffect(() => {
    const recent = JSON.parse(localStorage.getItem("recentCalculators") || "[]");
    const updated = ["percentage", ...recent.filter((id: string) => id !== "percentage")].slice(0, 10);
    localStorage.setItem("recentCalculators", JSON.stringify(updated));
  }, []);

  useEffect(() => {
    calculate();
  }, [value1, value2]);

  const calculate = () => {
    if (value1 >= 0 && value2 > 0) {
      setResults({
        percentOf: (value1 / 100) * value2,
        isPercent: (value1 / value2) * 100,
        percentChange: ((value2 - value1) / value1) * 100,
      });
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumbs
        items={[
          { label: "Math Calculators", href: "/math-calculators" },
          { label: "Percentage Calculator", href: "/calculators/math/percentage-calculator" },
        ]}
      />

      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Percentage Calculator</h1>
        <p className="text-base text-gray-600">
          Calculate percentages, percentage changes, and percentage of values
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Left Side - Interactive Controls */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
          <div className="space-y-6">
            {/* Value 1 Slider */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <label className="text-sm font-semibold text-gray-700">Value 1</label>
                <input
                  type="number"
                  value={value1}
                  onChange={(e) => setValue1(Number(e.target.value) || 0)}
                  className="w-24 px-3 py-1.5 text-right border border-gray-300 rounded-md text-sm font-semibold text-blue-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <input
                type="range"
                min="0"
                max="1000"
                step="1"
                value={value1}
                onChange={(e) => setValue1(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>0</span>
                <span>1000</span>
              </div>
            </div>

            {/* Value 2 Slider */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <label className="text-sm font-semibold text-gray-700">Value 2</label>
                <input
                  type="number"
                  value={value2}
                  onChange={(e) => setValue2(Number(e.target.value) || 0)}
                  className="w-24 px-3 py-1.5 text-right border border-gray-300 rounded-md text-sm font-semibold text-green-600 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <input
                type="range"
                min="1"
                max="1000"
                step="1"
                value={value2}
                onChange={(e) => setValue2(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>1</span>
                <span>1000</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Results */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
          {results && (
            <div className="space-y-4">
              {/* Percentage Of */}
              <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
                <div className="text-sm text-gray-600 mb-1">
                  What is {value1}% of {value2}?
                </div>
                <div className="text-3xl font-bold text-blue-600">
                  {results.percentOf.toFixed(2)}
                </div>
              </div>

              {/* Is What Percent */}
              <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4">
                <div className="text-sm text-gray-600 mb-1">
                  {value1} is what % of {value2}?
                </div>
                <div className="text-3xl font-bold text-green-600">
                  {results.isPercent.toFixed(2)}%
                </div>
              </div>

              {/* Percentage Change */}
              <div className="bg-purple-50 border-2 border-purple-200 rounded-lg p-4">
                <div className="text-sm text-gray-600 mb-1">
                  Percentage change from {value1} to {value2}
                </div>
                <div className="text-3xl font-bold text-purple-600">
                  {results.percentChange > 0 ? "+" : ""}
                  {results.percentChange.toFixed(2)}%
                </div>
                <div className="text-xs text-gray-600 mt-1">
                  {results.percentChange > 0 ? "Increase" : results.percentChange < 0 ? "Decrease" : "No change"}
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
              This calculator helps you solve three common percentage problems:
            </p>
            <ul className="list-disc list-inside space-y-2">
              <li><strong>What is X% of Y?</strong> - Finds a percentage of a number</li>
              <li><strong>X is what % of Y?</strong> - Finds what percentage one number is of another</li>
              <li><strong>Percentage change from X to Y</strong> - Calculates increase or decrease</li>
            </ul>
          </div>
        }
        faqs={[
          {
            question: "How do you calculate percentage?",
            answer: "To find what percent X is of Y, divide X by Y and multiply by 100. For example, 25 is 50% of 50 because (25 ÷ 50) × 100 = 50%.",
          },
          {
            question: "What is percentage increase?",
            answer: "Percentage increase is calculated as ((New Value - Old Value) / Old Value) × 100. For example, increasing from 50 to 75 is a 50% increase.",
          },
        ]}
        relatedCalculators={[
          { name: "Grade Calculator", href: "/calculators/math/grade-calculator" },
          { name: "Discount Calculator", href: "/calculators/everyday/discount-calculator" },
          { name: "Ratio Calculator", href: "/calculators/math/ratio-calculator" },
        ]}
      >
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900">Percentage Formulas</h2>
          <div className="space-y-4">
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2">1. What is X% of Y?</h3>
              <p className="text-sm text-gray-700 mb-1">Formula: (X ÷ 100) × Y</p>
              <p className="text-xs text-gray-600">Example: What is 25% of 200? = (25 ÷ 100) × 200 = 50</p>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2">2. X is what % of Y?</h3>
              <p className="text-sm text-gray-700 mb-1">Formula: (X ÷ Y) × 100</p>
              <p className="text-xs text-gray-600">Example: 50 is what % of 200? = (50 ÷ 200) × 100 = 25%</p>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2">3. Percentage Change</h3>
              <p className="text-sm text-gray-700 mb-1">Formula: ((New - Old) ÷ Old) × 100</p>
              <p className="text-xs text-gray-600">Example: Change from 50 to 75? = ((75 - 50) ÷ 50) × 100 = 50% increase</p>
            </div>
          </div>

          <h3 className="text-xl font-semibold text-gray-900 mt-6">Common Uses</h3>
          <ul className="list-disc pl-6 text-gray-700 space-y-2">
            <li>Calculate discounts and sales prices</li>
            <li>Find tax amounts and tips</li>
            <li>Track percentage growth or decline</li>
            <li>Compare values as percentages</li>
            <li>Calculate grade percentages</li>
          </ul>
        </div>
      </CalculatorLayout>
    </div>
  );
}
