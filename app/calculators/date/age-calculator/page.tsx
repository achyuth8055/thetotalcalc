"use client";

import { useState, useEffect } from "react";
import Breadcrumbs from "@/components/Breadcrumbs";
import CalculatorLayout from "@/components/CalculatorLayout";

export default function AgeCalculator() {
  const [birthDate, setBirthDate] = useState("");
  const [result, setResult] = useState<{
    years: number;
    months: number;
    days: number;
    totalDays: number;
    nextBirthday: number;
  } | null>(null);

  useEffect(() => {
    const recent = JSON.parse(localStorage.getItem("recentCalculators") || "[]");
    const updated = ["age", ...recent.filter((id: string) => id !== "age")].slice(0, 10);
    localStorage.setItem("recentCalculators", JSON.stringify(updated));
  }, []);

  const calculateAge = () => {
    if (!birthDate) return;

    const birth = new Date(birthDate);
    const today = new Date();

    let years = today.getFullYear() - birth.getFullYear();
    let months = today.getMonth() - birth.getMonth();
    let days = today.getDate() - birth.getDate();

    if (days < 0) {
      months--;
      const lastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
      days += lastMonth.getDate();
    }

    if (months < 0) {
      years--;
      months += 12;
    }

    const totalDays = Math.floor(
      (today.getTime() - birth.getTime()) / (1000 * 60 * 60 * 24)
    );

    // Calculate next birthday
    let nextBirthday = new Date(
      today.getFullYear(),
      birth.getMonth(),
      birth.getDate()
    );
    if (nextBirthday < today) {
      nextBirthday = new Date(
        today.getFullYear() + 1,
        birth.getMonth(),
        birth.getDate()
      );
    }
    const daysUntilBirthday = Math.ceil(
      (nextBirthday.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    );

    setResult({
      years,
      months,
      days,
      totalDays,
      nextBirthday: daysUntilBirthday,
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Breadcrumbs
        items={[
          { label: "Date Calculators", href: "/date-calculators" },
          { label: "Age Calculator", href: "/calculators/date/age-calculator" },
        ]}
      />

      <CalculatorLayout
        title="Age Calculator"
        description="Calculate your exact age in years, months, and days from your date of birth."
        explanation={
          <div>
            <p className="mb-4">
              This calculator finds your exact age based on your date of birth. It calculates:
            </p>
            <ul className="list-disc list-inside space-y-2">
              <li>Your age in years, months, and days</li>
              <li>Total number of days you've lived</li>
              <li>Days remaining until your next birthday</li>
            </ul>
          </div>
        }
        faqs={[
          {
            question: "How is age calculated?",
            answer: "Age is calculated by finding the difference between your birth date and today's date, accounting for the exact number of years, months, and days.",
          },
          {
            question: "Why is my age different from what I thought?",
            answer: "If you haven't had your birthday yet this year, you're still the age from your last birthday. This calculator shows your exact age including months and days.",
          },
        ]}
        relatedCalculators={[
          { name: "Date Difference", href: "/calculators/date/date-difference-calculator" },
          { name: "Add/Subtract Days", href: "/calculators/date/add-subtract-days-calculator" },
          { name: "Countdown", href: "/calculators/date/countdown-calculator" },
        ]}
      >
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date of Birth
            </label>
            <input
              type="date"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>

          <button
            onClick={calculateAge}
            className="w-full bg-primary-600 text-white py-4 rounded-lg font-semibold text-lg hover:bg-primary-700 transition-colors"
          >
            Calculate Age
          </button>

          {result && (
            <div className="mt-8 space-y-4">
              <div className="p-6 bg-primary-50 rounded-lg border-2 border-primary-200">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Your Age</h3>
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary-600">
                      {result.years}
                    </div>
                    <div className="text-sm text-gray-600">Years</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary-600">
                      {result.months}
                    </div>
                    <div className="text-sm text-gray-600">Months</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary-600">
                      {result.days}
                    </div>
                    <div className="text-sm text-gray-600">Days</div>
                  </div>
                </div>
                <p className="text-center text-gray-700">
                  You are <strong>{result.years} years, {result.months} months, and {result.days} days</strong> old
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="text-sm text-gray-600 mb-1">Total Days</div>
                  <div className="text-2xl font-bold text-blue-600">
                    {result.totalDays.toLocaleString()}
                  </div>
                </div>
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="text-sm text-gray-600 mb-1">Next Birthday In</div>
                  <div className="text-2xl font-bold text-green-600">
                    {result.nextBirthday} days
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </CalculatorLayout>
    </div>
  );
}
