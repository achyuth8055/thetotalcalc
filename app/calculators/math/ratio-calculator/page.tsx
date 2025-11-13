"use client";

import { useState, useEffect } from "react";
import Breadcrumbs from "@/components/Breadcrumbs";
import CalculatorLayout from "@/components/CalculatorLayout";

export default function RatioCalculator() {
  const [value1, setValue1] = useState("12");
  const [value2, setValue2] = useState("16");
  const [result, setResult] = useState<{ simplified: string; decimal: number } | null>(null);

  useEffect(() => {
    const recent = JSON.parse(localStorage.getItem("recentCalculators") || "[]");
    const updated = ["ratio", ...recent.filter((id: string) => id !== "ratio")].slice(0, 10);
    localStorage.setItem("recentCalculators", JSON.stringify(updated));
  }, []);

  const gcd = (a: number, b: number): number => {
    return b === 0 ? a : gcd(b, a % b);
  };

  const calculate = () => {
    const a = parseFloat(value1);
    const b = parseFloat(value2);

    if (!isNaN(a) && !isNaN(b) && b !== 0) {
      const divisor = gcd(Math.abs(a), Math.abs(b));
      const simplified = `${a / divisor}:${b / divisor}`;
      const decimal = a / b;
      setResult({ simplified, decimal });
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Breadcrumbs
        items={[
          { label: "Math Calculators", href: "/math-calculators" },
          { label: "Ratio Calculator", href: "/calculators/math/ratio-calculator" },
        ]}
      />

      <CalculatorLayout
        title="Ratio Calculator"
        description="Simplify ratios and find equivalent ratios easily."
        explanation={
          <div>
            <p className="mb-4">
              A ratio shows the relative sizes of two or more values. This calculator simplifies ratios to their lowest terms.
            </p>
            <p>The simplified ratio is found by dividing both numbers by their greatest common divisor (GCD).</p>
          </div>
        }
        faqs={[
          { question: "What is a simplified ratio?", answer: "A simplified ratio has no common factors between the numbers except 1. For example, 12:16 simplifies to 3:4." },
          { question: "How do ratios work?", answer: "If a ratio is 3:4, it means for every 3 units of the first quantity, there are 4 units of the second quantity." },
        ]}
        relatedCalculators={[
          { name: "Percentage Calculator", href: "/calculators/math/percentage-calculator" },
        ]}
      >
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">First Value</label>
              <input
                type="number"
                value={value1}
                onChange={(e) => setValue1(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Second Value</label>
              <input
                type="number"
                value={value2}
                onChange={(e) => setValue2(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>

          <button
            onClick={calculate}
            className="w-full bg-primary-600 text-white py-4 rounded-lg font-semibold text-lg hover:bg-primary-700 transition-colors"
          >
            Simplify Ratio
          </button>

          {result && (
            <div className="mt-8 p-6 bg-purple-50 rounded-lg border-2 border-purple-200">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Result</h3>
              <div className="space-y-4">
                <div>
                  <div className="text-sm text-gray-600 mb-1">Original Ratio</div>
                  <div className="text-2xl font-bold text-gray-900">{value1}:{value2}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600 mb-1">Simplified Ratio</div>
                  <div className="text-3xl font-bold text-purple-600">{result.simplified}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600 mb-1">As Decimal</div>
                  <div className="text-2xl font-bold text-gray-900">{result.decimal.toFixed(4)}</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </CalculatorLayout>
    </div>
  );
}
