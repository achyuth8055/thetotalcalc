"use client";

import { useState, useEffect } from "react";
import Breadcrumbs from "@/components/Breadcrumbs";
import CalculatorLayout from "@/components/CalculatorLayout";

export default function SplitBillCalculator() {
  const [billAmount, setBillAmount] = useState("");
  const [tipPercentage, setTipPercentage] = useState("15");
  const [numberOfPeople, setNumberOfPeople] = useState("2");
  const [result, setResult] = useState<{
    totalAmount: number;
    tipAmount: number;
    perPerson: number;
  } | null>(null);

  useEffect(() => {
    const recent = JSON.parse(localStorage.getItem("recentCalculators") || "[]");
    const updated = ["split-bill", ...recent.filter((id: string) => id !== "split-bill")].slice(0, 10);
    localStorage.setItem("recentCalculators", JSON.stringify(updated));
  }, []);

  const calculate = () => {
    const bill = parseFloat(billAmount);
    const tip = parseFloat(tipPercentage);
    const people = parseInt(numberOfPeople);

    if (!isNaN(bill) && !isNaN(tip) && !isNaN(people) && people > 0) {
      const tipAmount = (bill * tip) / 100;
      const totalAmount = bill + tipAmount;
      const perPerson = totalAmount / people;

      setResult({ totalAmount, tipAmount, perPerson });
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Breadcrumbs
        items={[
          { label: "Everyday Calculators", href: "/everyday-calculators" },
          { label: "Split Bill", href: "/calculators/everyday/split-bill-calculator" },
        ]}
      />

      <CalculatorLayout
        title="Split Bill Calculator"
        description="Easily split a bill among multiple people with automatic tip calculation."
        explanation={
          <div>
            <p>Split restaurant bills, group expenses, or any shared costs evenly among any number of people.</p>
          </div>
        }
        faqs={[
          { question: "Can I split the bill unevenly?", answer: "This calculator splits the bill evenly. For uneven splits, you'll need to calculate individual portions separately." },
        ]}
        relatedCalculators={[
          { name: "Tip Calculator", href: "/calculators/everyday/tip-calculator" },
          { name: "Discount Calculator", href: "/calculators/everyday/discount-calculator" },
        ]}
      >
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Bill Amount ($)</label>
            <input
              type="number"
              value={billAmount}
              onChange={(e) => setBillAmount(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              placeholder="100.00"
              step="0.01"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tip Percentage (%)</label>
            <input
              type="number"
              value={tipPercentage}
              onChange={(e) => setTipPercentage(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              placeholder="15"
            />
            <div className="flex gap-2 mt-2">
              {[10, 15, 18, 20].map((percent) => (
                <button
                  key={percent}
                  onClick={() => setTipPercentage(percent.toString())}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm"
                >
                  {percent}%
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Number of People</label>
            <input
              type="number"
              value={numberOfPeople}
              onChange={(e) => setNumberOfPeople(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              placeholder="2"
              min="1"
            />
          </div>

          <button
            onClick={calculate}
            className="w-full bg-primary-600 text-white py-4 rounded-lg font-semibold text-lg hover:bg-primary-700 transition-colors"
          >
            Calculate Split
          </button>

          {result && (
            <div className="mt-8 p-6 bg-amber-50 rounded-lg border-2 border-amber-200 space-y-4">
              <div className="text-center">
                <div className="text-sm text-gray-600 mb-1">Each Person Pays</div>
                <div className="text-4xl font-bold text-amber-600">${result.perPerson.toFixed(2)}</div>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-amber-300">
                <div className="text-center">
                  <div className="text-sm text-gray-600 mb-1">Bill Amount</div>
                  <div className="text-xl font-semibold text-gray-900">${parseFloat(billAmount).toFixed(2)}</div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-gray-600 mb-1">Tip Amount</div>
                  <div className="text-xl font-semibold text-gray-900">${result.tipAmount.toFixed(2)}</div>
                </div>
                <div className="text-center col-span-2">
                  <div className="text-sm text-gray-600 mb-1">Total Amount</div>
                  <div className="text-2xl font-bold text-amber-600">${result.totalAmount.toFixed(2)}</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </CalculatorLayout>
    </div>
  );
}
