"use client";

import { useState, useEffect } from "react";
import Breadcrumbs from "@/components/Breadcrumbs";
import CalculatorLayout from "@/components/CalculatorLayout";

export default function UnitPriceCalculator() {
  const [priceA, setPriceA] = useState("4.50");
  const [qtyA, setQtyA] = useState("500");
  const [priceB, setPriceB] = useState("7.20");
  const [qtyB, setQtyB] = useState("900");
  const [unit, setUnit] = useState("g");
  const [currency, setCurrency] = useState("$");

  const [result, setResult] = useState<{
    unitA: number;
    unitB: number;
    cheaper: "A" | "B" | "equal";
    savingsPercent: number;
  } | null>(null);

  useEffect(() => {
    const recent = JSON.parse(localStorage.getItem("recentCalculators") || "[]");
    const updated = ["unit-price", ...recent.filter((id: string) => id !== "unit-price")].slice(0, 10);
    localStorage.setItem("recentCalculators", JSON.stringify(updated));
  }, []);

  const calculate = () => {
    const pA = parseFloat(priceA);
    const qA = parseFloat(qtyA);
    const pB = parseFloat(priceB);
    const qB = parseFloat(qtyB);

    if (!(pA >= 0) || !(qA > 0) || !(pB >= 0) || !(qB > 0)) {
      setResult(null);
      return;
    }

    const unitA = pA / qA;
    const unitB = pB / qB;

    let cheaper: "A" | "B" | "equal";
    let savingsPercent = 0;
    if (Math.abs(unitA - unitB) < 1e-9) {
      cheaper = "equal";
    } else if (unitA < unitB) {
      cheaper = "A";
      savingsPercent = ((unitB - unitA) / unitB) * 100;
    } else {
      cheaper = "B";
      savingsPercent = ((unitA - unitB) / unitA) * 100;
    }

    setResult({ unitA, unitB, cheaper, savingsPercent });
  };

  const inputClass =
    "w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500";

  // Unit prices are often tiny (cost per gram), so show enough decimals to be useful.
  const fmtUnit = (n: number) => `${currency}${n < 1 ? n.toFixed(4) : n.toFixed(3)} / ${unit}`;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Breadcrumbs
        items={[
          { label: "Everyday Calculators", href: "/everyday-calculators" },
          { label: "Unit Price Calculator", href: "/calculators/everyday/unit-price-calculator" },
        ]}
      />

      <CalculatorLayout
        title="Unit Price Calculator"
        description="Compare two products by their price per unit to find the real bargain. The bigger package is not always the better deal, and this tool shows you which one wins."
        explanation={
          <div>
            <p className="mb-4">
              Shops price items in different pack sizes, which makes it hard to compare them at a
              glance. The unit price, the cost for one gram, ounce, litre, or item, puts every option
              on the same footing. The lowest unit price is the better value.
            </p>
            <p className="mb-4">
              <strong>How it works:</strong> Unit price = total price divided by quantity. Enter both
              products in the same unit (both in grams, or both in ounces, and so on), and the
              calculator shows the cost per unit for each, which one is cheaper, and the percentage you
              save by choosing it.
            </p>
            <p>
              Bulk and family sizes usually win, but not always. Promotions, loyalty prices, and
              odd pack sizes regularly make the smaller pack cheaper per unit, which is exactly the
              trap this tool helps you avoid.
            </p>
          </div>
        }
        faqs={[
          {
            question: "Do both products need the same unit?",
            answer:
              "Yes. Enter both quantities in the same unit, such as grams against grams or fluid ounces against fluid ounces. If one is listed in kilograms and the other in grams, convert first so the comparison is fair.",
          },
          {
            question: "Is the bigger package always cheaper per unit?",
            answer:
              "No. Larger sizes are often, but not always, cheaper per unit. Sales on smaller packs, multi-buy offers, and premium 'convenience' large sizes can flip the result, which is why checking the unit price is worth the few seconds it takes.",
          },
          {
            question: "What counts as a unit?",
            answer:
              "Whatever you measure the product in: grams, kilograms, ounces, pounds, litres, millilitres, or simply the number of items such as tablets or sheets. Just keep the unit consistent across both products.",
          },
          {
            question: "Should I always buy the lowest unit price?",
            answer:
              "Usually, but not blindly. A larger pack only saves money if you actually use it before it expires or goes stale. For perishable goods, the cheapest unit price can still be a false economy if half of it ends up in the bin.",
          },
        ]}
        relatedCalculators={[
          { name: "Discount Calculator", href: "/calculators/everyday/discount-calculator" },
          { name: "Electricity Cost Calculator", href: "/calculators/everyday/electricity-cost-calculator" },
          { name: "Percentage Calculator", href: "/calculators/math/percentage-calculator" },
        ]}
      >
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Unit of Measure (same for both)</label>
            <input type="text" value={unit} onChange={(e) => setUnit(e.target.value)} className={inputClass} placeholder="g, oz, ml, item" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="p-4 rounded-lg border border-gray-200 bg-gray-50">
              <h3 className="font-semibold text-gray-900 mb-3">Product A</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                  <input type="number" step="0.01" value={priceA} onChange={(e) => setPriceA(e.target.value)} className={inputClass} placeholder="4.50" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Quantity ({unit || "unit"})</label>
                  <input type="number" value={qtyA} onChange={(e) => setQtyA(e.target.value)} className={inputClass} placeholder="500" />
                </div>
              </div>
            </div>

            <div className="p-4 rounded-lg border border-gray-200 bg-gray-50">
              <h3 className="font-semibold text-gray-900 mb-3">Product B</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                  <input type="number" step="0.01" value={priceB} onChange={(e) => setPriceB(e.target.value)} className={inputClass} placeholder="7.20" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Quantity ({unit || "unit"})</label>
                  <input type="number" value={qtyB} onChange={(e) => setQtyB(e.target.value)} className={inputClass} placeholder="900" />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-center">
            <label className="text-sm text-gray-600 flex items-center gap-2">
              Currency:
              <select value={currency} onChange={(e) => setCurrency(e.target.value)} className="px-3 py-2 border border-gray-300 rounded-lg">
                <option value="$">$</option>
                <option value="£">£</option>
                <option value="€">€</option>
                <option value="₹">₹</option>
              </select>
            </label>
          </div>

          <button
            onClick={calculate}
            className="w-full bg-primary-600 text-white py-4 rounded-lg font-semibold text-lg hover:bg-primary-700 transition-colors"
          >
            Compare
          </button>

          {result && (
            <div className="mt-8 p-6 bg-green-50 rounded-lg border-2 border-green-200">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Results</h3>
              <div className="space-y-4">
                <div className={`flex justify-between items-center pb-3 border-b border-green-200 ${result.cheaper === "A" ? "font-semibold" : ""}`}>
                  <span className="text-gray-700">Product A unit price</span>
                  <span className="text-lg text-gray-900">{fmtUnit(result.unitA)}</span>
                </div>
                <div className={`flex justify-between items-center pb-3 border-b border-green-200 ${result.cheaper === "B" ? "font-semibold" : ""}`}>
                  <span className="text-gray-700">Product B unit price</span>
                  <span className="text-lg text-gray-900">{fmtUnit(result.unitB)}</span>
                </div>
              </div>
              <div className="mt-4 p-4 bg-white rounded-lg text-center">
                {result.cheaper === "equal" ? (
                  <p className="text-gray-700">Both products cost the same per {unit || "unit"}. Either is an equal deal.</p>
                ) : (
                  <p className="text-gray-700">
                    <strong className="text-green-600">Product {result.cheaper}</strong> is the better value, saving{" "}
                    <strong className="text-green-600">{result.savingsPercent.toFixed(1)}%</strong> per {unit || "unit"}.
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </CalculatorLayout>
    </div>
  );
}
