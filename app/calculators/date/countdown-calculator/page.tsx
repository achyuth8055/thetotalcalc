"use client";

import { useState, useEffect } from "react";
import Breadcrumbs from "@/components/Breadcrumbs";
import CalculatorLayout from "@/components/CalculatorLayout";

export default function CountdownCalculator() {
  const [targetDate, setTargetDate] = useState("");
  const [result, setResult] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  } | null>(null);

  useEffect(() => {
    const recent = JSON.parse(localStorage.getItem("recentCalculators") || "[]");
    const updated = ["countdown", ...recent.filter((id: string) => id !== "countdown")].slice(0, 10);
    localStorage.setItem("recentCalculators", JSON.stringify(updated));
  }, []);

  const calculate = () => {
    if (!targetDate) return;

    const now = new Date();
    const target = new Date(targetDate);
    const diffTime = target.getTime() - now.getTime();

    if (diffTime > 0) {
      const days = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diffTime % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diffTime % (1000 * 60)) / 1000);

      setResult({ days, hours, minutes, seconds });
    } else {
      setResult({ days: 0, hours: 0, minutes: 0, seconds: 0 });
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Breadcrumbs
        items={[
          { label: "Date Calculators", href: "/date-calculators" },
          { label: "Countdown Calculator", href: "/calculators/date/countdown-calculator" },
        ]}
      />

      <CalculatorLayout
        title="Countdown Calculator"
        description="Count down the days, hours, minutes, and seconds until a future date."
        explanation={
          <div>
            <p>Use this countdown calculator for birthdays, vacations, weddings, holidays, or any important event.</p>
          </div>
        }
        faqs={[
          { question: "How accurate is the countdown?", answer: "The countdown is calculated to the second based on your current time and the target date you set." },
        ]}
        relatedCalculators={[
          { name: "Age Calculator", href: "/calculators/date/age-calculator" },
          { name: "Date Difference", href: "/calculators/date/date-difference-calculator" },
        ]}
      >
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Target Date & Time</label>
            <input
              type="datetime-local"
              value={targetDate}
              onChange={(e) => setTargetDate(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <button
            onClick={calculate}
            className="w-full bg-primary-600 text-white py-4 rounded-lg font-semibold text-lg hover:bg-primary-700 transition-colors"
          >
            Start Countdown
          </button>

          {result && (
            <div className="mt-8 p-6 bg-indigo-50 rounded-lg border-2 border-indigo-200">
              <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">Time Remaining</h3>
              <div className="grid grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-4xl font-bold text-indigo-600">{result.days}</div>
                  <div className="text-sm text-gray-600 mt-1">Days</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-indigo-600">{result.hours}</div>
                  <div className="text-sm text-gray-600 mt-1">Hours</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-indigo-600">{result.minutes}</div>
                  <div className="text-sm text-gray-600 mt-1">Minutes</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-indigo-600">{result.seconds}</div>
                  <div className="text-sm text-gray-600 mt-1">Seconds</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </CalculatorLayout>
    </div>
  );
}
