"use client";

import { useState, useEffect } from "react";
import Breadcrumbs from "@/components/Breadcrumbs";
import CalculatorLayout from "@/components/CalculatorLayout";

export default function TipCalculator() {
  const [billAmount, setBillAmount] = useState("100");
  const [tipPercent, setTipPercent] = useState("15");
  const [people, setPeople] = useState("1");
  const [result, setResult] = useState<{
    tipAmount: number;
    totalBill: number;
    perPerson: number;
  } | null>(null);

  useEffect(() => {
    const recent = JSON.parse(localStorage.getItem("recentCalculators") || "[]");
    const updated = ["tip", ...recent.filter((id: string) => id !== "tip")].slice(0, 10);
    localStorage.setItem("recentCalculators", JSON.stringify(updated));
  }, []);

  const calculate = () => {
    const bill = parseFloat(billAmount);
    const tip = parseFloat(tipPercent);
    const numPeople = parseInt(people);

    if (bill > 0 && tip >= 0 && numPeople > 0) {
      const tipAmount = (bill * tip) / 100;
      const totalBill = bill + tipAmount;
      const perPerson = totalBill / numPeople;

      setResult({
        tipAmount,
        totalBill,
        perPerson,
      });
    }
  };

  const quickTip = (percent: number) => {
    setTipPercent(percent.toString());
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Breadcrumbs
        items={[
          { label: "Everyday Calculators", href: "/everyday-calculators" },
          { label: "Tip Calculator", href: "/calculators/everyday/tip-calculator" },
        ]}
      />

      <CalculatorLayout
        title="Tip Calculator"
        description="Calculate tip amount and split the bill among multiple people easily."
        explanation={
          <div>
            <p className="mb-4">
              This tip calculator helps you determine how much to tip based on your bill amount and service quality.
              You can also split the total among multiple people.
            </p>
            <p>
              Common tipping guidelines: 15% for good service, 18-20% for excellent service, 10% for fair service.
            </p>
          </div>
        }
        faqs={[
          {
            question: "What is a standard tip percentage?",
            answer: "In the US, 15-20% is standard for restaurant service. 15% for adequate service, 18-20% for good to excellent service.",
          },
          {
            question: "Should I tip on the pre-tax or post-tax amount?",
            answer: "It's common to tip on the pre-tax amount, though some people prefer to tip on the total including tax.",
          },
        ]}
        relatedCalculators={[
          { name: "Split Bill Calculator", href: "/calculators/everyday/split-bill-calculator" },
          { name: "Discount Calculator", href: "/calculators/everyday/discount-calculator" },
        ]}
      >
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Bill Amount ($)
            </label>
            <input
              type="number"
              value={billAmount}
              onChange={(e) => setBillAmount(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="100"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tip Percentage (%)
            </label>
            <input
              type="number"
              value={tipPercent}
              onChange={(e) => setTipPercent(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="15"
            />
            <div className="flex gap-2 mt-3">
              <button
                onClick={() => quickTip(10)}
                className="flex-1 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-md text-sm font-medium"
              >
                10%
              </button>
              <button
                onClick={() => quickTip(15)}
                className="flex-1 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-md text-sm font-medium"
              >
                15%
              </button>
              <button
                onClick={() => quickTip(18)}
                className="flex-1 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-md text-sm font-medium"
              >
                18%
              </button>
              <button
                onClick={() => quickTip(20)}
                className="flex-1 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-md text-sm font-medium"
              >
                20%
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Number of People
            </label>
            <input
              type="number"
              value={people}
              onChange={(e) => setPeople(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="1"
              min="1"
            />
          </div>

          <button
            onClick={calculate}
            className="w-full bg-primary-600 text-white py-4 rounded-lg font-semibold text-lg hover:bg-primary-700 transition-colors"
          >
            Calculate Tip
          </button>

          {result && (
            <div className="mt-8 space-y-4">
              <div className="p-6 bg-blue-50 rounded-lg border-2 border-blue-200">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Bill Summary</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center pb-3 border-b border-blue-200">
                    <span className="text-gray-700">Original Bill</span>
                    <span className="text-lg font-semibold text-gray-900">
                      ${parseFloat(billAmount).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pb-3 border-b border-blue-200">
                    <span className="text-gray-700">Tip ({tipPercent}%)</span>
                    <span className="text-lg font-semibold text-blue-600">
                      ${result.tipAmount.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pb-3 border-b border-blue-200">
                    <span className="text-gray-700 font-semibold">Total Bill</span>
                    <span className="text-2xl font-bold text-blue-600">
                      ${result.totalBill.toFixed(2)}
                    </span>
                  </div>
                  {parseInt(people) > 1 && (
                    <div className="flex justify-between items-center pt-2">
                      <span className="text-gray-700 font-semibold">Per Person</span>
                      <span className="text-2xl font-bold text-green-600">
                        ${result.perPerson.toFixed(2)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </CalculatorLayout>
    </div>
  );
}
