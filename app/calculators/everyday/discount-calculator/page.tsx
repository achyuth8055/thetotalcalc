"use client";

import { useState, useEffect } from "react";
import Breadcrumbs from "@/components/Breadcrumbs";
import CalculatorLayout from "@/components/CalculatorLayout";

export default function DiscountCalculator() {
  const [originalPrice, setOriginalPrice] = useState("100");
  const [discountPercent, setDiscountPercent] = useState("20");
  const [result, setResult] = useState<{
    discountAmount: number;
    finalPrice: number;
    savings: number;
  } | null>(null);

  useEffect(() => {
    const recent = JSON.parse(localStorage.getItem("recentCalculators") || "[]");
    const updated = ["discount", ...recent.filter((id: string) => id !== "discount")].slice(0, 10);
    localStorage.setItem("recentCalculators", JSON.stringify(updated));
  }, []);

  const calculate = () => {
    const price = parseFloat(originalPrice);
    const discount = parseFloat(discountPercent);

    if (price > 0 && discount >= 0 && discount <= 100) {
      const discountAmount = (price * discount) / 100;
      const finalPrice = price - discountAmount;

      setResult({
        discountAmount,
        finalPrice,
        savings: discountAmount,
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Breadcrumbs
        items={[
          { label: "Everyday Calculators", href: "/everyday-calculators" },
          { label: "Discount Calculator", href: "/calculators/everyday/discount-calculator" },
        ]}
      />

      <CalculatorLayout
        title="Discount Calculator"
        description="Calculate sale price, discount amount, and your total savings with ease."
        explanation={
          <div>
            <p className="mb-4">
              This calculator helps you determine the final price after applying a discount percentage.
              Perfect for shopping, budgeting, and finding the best deals.
            </p>
            <p>
              <strong>Formula:</strong> Final Price = Original Price - (Original Price × Discount % ÷ 100)
            </p>
          </div>
        }
        faqs={[
          {
            question: "How do I calculate discount percentage?",
            answer: "Discount Amount = Original Price × (Discount Percentage ÷ 100). Then subtract this from the original price to get the final price.",
          },
          {
            question: "Can I calculate reverse discount?",
            answer: "Yes! If you know the final price and discount percentage, you can work backwards to find the original price.",
          },
        ]}
        relatedCalculators={[
          { name: "Tip Calculator", href: "/calculators/everyday/tip-calculator" },
          { name: "Percentage Calculator", href: "/calculators/math/percentage-calculator" },
        ]}
      >
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Original Price ($)
            </label>
            <input
              type="number"
              value={originalPrice}
              onChange={(e) => setOriginalPrice(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="100"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Discount Percentage (%)
            </label>
            <input
              type="number"
              value={discountPercent}
              onChange={(e) => setDiscountPercent(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="20"
            />
          </div>

          <button
            onClick={calculate}
            className="w-full bg-primary-600 text-white py-4 rounded-lg font-semibold text-lg hover:bg-primary-700 transition-colors"
          >
            Calculate
          </button>

          {result && (
            <div className="mt-8 p-6 bg-green-50 rounded-lg border-2 border-green-200">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Results</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-3 border-b border-green-200">
                  <span className="text-gray-700">Original Price</span>
                  <span className="text-lg font-semibold text-gray-900">
                    ${parseFloat(originalPrice).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-green-200">
                  <span className="text-gray-700">Discount ({discountPercent}%)</span>
                  <span className="text-lg font-semibold text-red-600">
                    -${result.discountAmount.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700 font-semibold">Final Price</span>
                  <span className="text-3xl font-bold text-green-600">
                    ${result.finalPrice.toFixed(2)}
                  </span>
                </div>
              </div>
              <div className="mt-4 p-3 bg-white rounded-lg">
                <p className="text-center text-gray-700">
                  You save <strong className="text-green-600">${result.savings.toFixed(2)}</strong>!
                </p>
              </div>
            </div>
          )}
        </div>
      </CalculatorLayout>
    </div>
  );
}
