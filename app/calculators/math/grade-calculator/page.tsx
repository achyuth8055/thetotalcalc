"use client";

import { useState, useEffect } from "react";
import Breadcrumbs from "@/components/Breadcrumbs";
import CalculatorLayout from "@/components/CalculatorLayout";

export default function GradeCalculator() {
  const [currentGrade, setCurrentGrade] = useState("85");
  const [desiredGrade, setDesiredGrade] = useState("90");
  const [finalWeight, setFinalWeight] = useState("40");
  const [result, setResult] = useState<number | null>(null);

  useEffect(() => {
    const recent = JSON.parse(localStorage.getItem("recentCalculators") || "[]");
    const updated = ["grade", ...recent.filter((id: string) => id !== "grade")].slice(0, 10);
    localStorage.setItem("recentCalculators", JSON.stringify(updated));
  }, []);

  const calculate = () => {
    const current = parseFloat(currentGrade);
    const desired = parseFloat(desiredGrade);
    const weight = parseFloat(finalWeight) / 100;

    if (!isNaN(current) && !isNaN(desired) && weight > 0 && weight <= 1) {
      const needed = (desired - current * (1 - weight)) / weight;
      setResult(needed);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Breadcrumbs
        items={[
          { label: "Math Calculators", href: "/math-calculators" },
          { label: "Grade Calculator", href: "/calculators/math/grade-calculator" },
        ]}
      />

      <CalculatorLayout
        title="Grade Calculator"
        description="Calculate what grade you need on your final exam to achieve your desired overall grade."
        explanation={
          <div>
            <p className="mb-4">
              This calculator helps you determine what score you need on your final exam to reach your target grade.
            </p>
            <p><strong>Formula:</strong> Final Exam Score = (Desired Grade - Current Grade × (1 - Final Weight)) / Final Weight</p>
          </div>
        }
        faqs={[
          { question: "How is the final grade calculated?", answer: "Final Grade = (Current Grade × (100% - Final Weight)) + (Final Exam Score × Final Weight)" },
        ]}
        relatedCalculators={[
          { name: "GPA Calculator", href: "/calculators/math/gpa-calculator" },
          { name: "Percentage Calculator", href: "/calculators/math/percentage-calculator" },
        ]}
      >
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Current Grade (%)
            </label>
            <input
              type="number"
              value={currentGrade}
              onChange={(e) => setCurrentGrade(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              placeholder="85"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Desired Grade (%)
            </label>
            <input
              type="number"
              value={desiredGrade}
              onChange={(e) => setDesiredGrade(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              placeholder="90"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Final Exam Weight (%)
            </label>
            <input
              type="number"
              value={finalWeight}
              onChange={(e) => setFinalWeight(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              placeholder="40"
            />
          </div>

          <button
            onClick={calculate}
            className="w-full bg-primary-600 text-white py-4 rounded-lg font-semibold text-lg hover:bg-primary-700 transition-colors"
          >
            Calculate
          </button>

          {result !== null && (
            <div className="mt-8 p-6 bg-purple-50 rounded-lg border-2 border-purple-200">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Result</h3>
              <p className="text-gray-700 mb-4">
                You need to score <strong className="text-3xl text-purple-600">{result.toFixed(1)}%</strong> on your final exam
              </p>
              {result > 100 && (
                <p className="text-red-600 font-medium">⚠️ This grade may not be achievable. Consider talking to your instructor about extra credit options.</p>
              )}
              {result < 0 && (
                <p className="text-green-600 font-medium">🎉 You've already achieved your desired grade!</p>
              )}
            </div>
          )}
        </div>
      </CalculatorLayout>
    </div>
  );
}
