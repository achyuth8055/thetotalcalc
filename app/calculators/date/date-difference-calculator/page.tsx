"use client";

import { useState, useEffect } from "react";
import Breadcrumbs from "@/components/Breadcrumbs";
import CalculatorLayout from "@/components/CalculatorLayout";

export default function DateDifferenceCalculator() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [result, setResult] = useState<{
    days: number;
    weeks: number;
    months: number;
    years: number;
  } | null>(null);

  useEffect(() => {
    const recent = JSON.parse(localStorage.getItem("recentCalculators") || "[]");
    const updated = ["date-difference", ...recent.filter((id: string) => id !== "date-difference")].slice(0, 10);
    localStorage.setItem("recentCalculators", JSON.stringify(updated));
  }, []);

  const calculate = () => {
    if (!startDate || !endDate) return;

    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const weeks = Math.floor(days / 7);
    const months = Math.floor(days / 30.44);
    const years = Math.floor(days / 365.25);

    setResult({ days, weeks, months, years });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Breadcrumbs
        items={[
          { label: "Date Calculators", href: "/date-calculators" },
          { label: "Date Difference", href: "/calculators/date/date-difference-calculator" },
        ]}
      />

      <CalculatorLayout
        title="Date Difference Calculator"
        description="Calculate the number of days, weeks, months, and years between two dates."
        explanation={
          <div>
            <p>This calculator finds the exact duration between any two dates in various time units.</p>
          </div>
        }
        faqs={[
          { question: "Does this calculator include both dates?", answer: "The calculator counts complete days between the dates, excluding the start date." },
        ]}
        relatedCalculators={[
          { name: "Age Calculator", href: "/calculators/date/age-calculator" },
          { name: "Add/Subtract Days", href: "/calculators/date/add-subtract-days-calculator" },
        ]}
      >
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <button
            onClick={calculate}
            className="w-full bg-primary-600 text-white py-4 rounded-lg font-semibold text-lg hover:bg-primary-700 transition-colors"
          >
            Calculate Difference
          </button>

          {result && (
            <div className="mt-8 p-6 bg-indigo-50 rounded-lg border-2 border-indigo-200">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Time Difference</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-white rounded-lg">
                  <div className="text-sm text-gray-600 mb-1">Days</div>
                  <div className="text-3xl font-bold text-indigo-600">{result.days}</div>
                </div>
                <div className="p-4 bg-white rounded-lg">
                  <div className="text-sm text-gray-600 mb-1">Weeks</div>
                  <div className="text-3xl font-bold text-indigo-600">{result.weeks}</div>
                </div>
                <div className="p-4 bg-white rounded-lg">
                  <div className="text-sm text-gray-600 mb-1">Months</div>
                  <div className="text-3xl font-bold text-indigo-600">{result.months}</div>
                </div>
                <div className="p-4 bg-white rounded-lg">
                  <div className="text-sm text-gray-600 mb-1">Years</div>
                  <div className="text-3xl font-bold text-indigo-600">{result.years}</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </CalculatorLayout>
    </div>
  );
}
