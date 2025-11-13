"use client";

import { useState, useEffect } from "react";
import Breadcrumbs from "@/components/Breadcrumbs";
import CalculatorLayout from "@/components/CalculatorLayout";

export default function AddSubtractDaysCalculator() {
  const [startDate, setStartDate] = useState("");
  const [days, setDays] = useState("30");
  const [operation, setOperation] = useState<"add" | "subtract">("add");
  const [result, setResult] = useState<string | null>(null);

  useEffect(() => {
    const recent = JSON.parse(localStorage.getItem("recentCalculators") || "[]");
    const updated = ["add-days", ...recent.filter((id: string) => id !== "add-days")].slice(0, 10);
    localStorage.setItem("recentCalculators", JSON.stringify(updated));
  }, []);

  const calculate = () => {
    if (!startDate) return;

    const date = new Date(startDate);
    const daysNum = parseInt(days);

    if (!isNaN(daysNum)) {
      if (operation === "add") {
        date.setDate(date.getDate() + daysNum);
      } else {
        date.setDate(date.getDate() - daysNum);
      }

      setResult(date.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }));
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Breadcrumbs
        items={[
          { label: "Date Calculators", href: "/date-calculators" },
          { label: "Add/Subtract Days", href: "/calculators/date/add-subtract-days-calculator" },
        ]}
      />

      <CalculatorLayout
        title="Add/Subtract Days Calculator"
        description="Add or subtract days from any date to find a future or past date."
        explanation={
          <div>
            <p>Calculate what date it will be after adding or subtracting a certain number of days from a given date.</p>
          </div>
        }
        faqs={[
          { question: "Does this account for leap years?", answer: "Yes, the calculator automatically accounts for leap years and varying month lengths." },
        ]}
        relatedCalculators={[
          { name: "Date Difference", href: "/calculators/date/date-difference-calculator" },
          { name: "Age Calculator", href: "/calculators/date/age-calculator" },
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
            <label className="block text-sm font-medium text-gray-700 mb-2">Operation</label>
            <select
              value={operation}
              onChange={(e) => setOperation(e.target.value as "add" | "subtract")}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            >
              <option value="add">Add Days</option>
              <option value="subtract">Subtract Days</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Number of Days</label>
            <input
              type="number"
              value={days}
              onChange={(e) => setDays(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              placeholder="30"
            />
          </div>

          <button
            onClick={calculate}
            className="w-full bg-primary-600 text-white py-4 rounded-lg font-semibold text-lg hover:bg-primary-700 transition-colors"
          >
            Calculate
          </button>

          {result && (
            <div className="mt-8 p-6 bg-indigo-50 rounded-lg border-2 border-indigo-200 text-center">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Result</h3>
              <div className="text-2xl font-bold text-indigo-600">{result}</div>
            </div>
          )}
        </div>
      </CalculatorLayout>
    </div>
  );
}
