"use client";

import { useState, useEffect } from "react";
import Breadcrumbs from "@/components/Breadcrumbs";
import CalculatorLayout from "@/components/CalculatorLayout";

export default function AverageCalculator() {
  const [numbers, setNumbers] = useState("10, 20, 30, 40, 50");
  const [result, setResult] = useState<{
    mean: number;
    median: number;
    mode: number[];
    sum: number;
    count: number;
  } | null>(null);

  useEffect(() => {
    const recent = JSON.parse(localStorage.getItem("recentCalculators") || "[]");
    const updated = ["average", ...recent.filter((id: string) => id !== "average")].slice(0, 10);
    localStorage.setItem("recentCalculators", JSON.stringify(updated));
  }, []);

  const calculate = () => {
    const nums = numbers
      .split(/[,\s]+/)
      .map((n) => parseFloat(n.trim()))
      .filter((n) => !isNaN(n));

    if (nums.length > 0) {
      // Mean
      const sum = nums.reduce((a, b) => a + b, 0);
      const mean = sum / nums.length;

      // Median
      const sorted = [...nums].sort((a, b) => a - b);
      const mid = Math.floor(sorted.length / 2);
      const median =
        sorted.length % 2 === 0
          ? (sorted[mid - 1] + sorted[mid]) / 2
          : sorted[mid];

      // Mode
      const frequency: { [key: number]: number } = {};
      nums.forEach((n) => {
        frequency[n] = (frequency[n] || 0) + 1;
      });
      const maxFreq = Math.max(...Object.values(frequency));
      const mode = Object.keys(frequency)
        .filter((key) => frequency[Number(key)] === maxFreq && maxFreq > 1)
        .map(Number);

      setResult({
        mean,
        median,
        mode,
        sum,
        count: nums.length,
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Breadcrumbs
        items={[
          { label: "Math Calculators", href: "/math-calculators" },
          { label: "Average Calculator", href: "/calculators/math/average-calculator" },
        ]}
      />

      <CalculatorLayout
        title="Average Calculator"
        description="Calculate mean, median, mode, sum, and count of a set of numbers."
        explanation={
          <div>
            <p className="mb-4">This calculator computes various statistical measures:</p>
            <ul className="list-disc list-inside space-y-2">
              <li><strong>Mean:</strong> The arithmetic average (sum divided by count)</li>
              <li><strong>Median:</strong> The middle value when numbers are sorted</li>
              <li><strong>Mode:</strong> The most frequently occurring number(s)</li>
            </ul>
          </div>
        }
        faqs={[
          {
            question: "What's the difference between mean and median?",
            answer: "Mean is the average of all numbers, while median is the middle value. Median is less affected by extreme values (outliers) than mean.",
          },
          {
            question: "What if there is no mode?",
            answer: "If all numbers appear with the same frequency, there is no mode. This calculator will only show mode if at least one number appears more than once.",
          },
        ]}
        relatedCalculators={[
          { name: "Percentage Calculator", href: "/calculators/math/percentage-calculator" },
          { name: "GPA Calculator", href: "/calculators/math/gpa-calculator" },
        ]}
      >
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Enter Numbers (separated by commas or spaces)
            </label>
            <textarea
              value={numbers}
              onChange={(e) => setNumbers(e.target.value)}
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="10, 20, 30, 40, 50"
            />
          </div>

          <button
            onClick={calculate}
            className="w-full bg-primary-600 text-white py-4 rounded-lg font-semibold text-lg hover:bg-primary-700 transition-colors"
          >
            Calculate
          </button>

          {result && (
            <div className="mt-8 space-y-4">
              <div className="p-6 bg-purple-50 rounded-lg border-2 border-purple-200">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Results</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-white rounded-lg">
                    <div className="text-sm text-gray-600 mb-1">Mean (Average)</div>
                    <div className="text-2xl font-bold text-purple-600">
                      {result.mean.toFixed(2)}
                    </div>
                  </div>
                  <div className="p-4 bg-white rounded-lg">
                    <div className="text-sm text-gray-600 mb-1">Median</div>
                    <div className="text-2xl font-bold text-purple-600">
                      {result.median.toFixed(2)}
                    </div>
                  </div>
                  <div className="p-4 bg-white rounded-lg">
                    <div className="text-sm text-gray-600 mb-1">Sum</div>
                    <div className="text-2xl font-bold text-purple-600">
                      {result.sum.toFixed(2)}
                    </div>
                  </div>
                  <div className="p-4 bg-white rounded-lg">
                    <div className="text-sm text-gray-600 mb-1">Count</div>
                    <div className="text-2xl font-bold text-purple-600">
                      {result.count}
                    </div>
                  </div>
                </div>
                {result.mode.length > 0 && (
                  <div className="mt-4 p-4 bg-white rounded-lg">
                    <div className="text-sm text-gray-600 mb-1">Mode</div>
                    <div className="text-2xl font-bold text-purple-600">
                      {result.mode.join(", ")}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </CalculatorLayout>
    </div>
  );
}
