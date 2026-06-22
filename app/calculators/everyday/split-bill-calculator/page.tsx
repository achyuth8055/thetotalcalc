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
          <div className="space-y-4">
            <p>
              The split bill calculator takes a total, adds a tip if you want one, and divides the result evenly across
              the group, so everyone pays a fair, identical share. It is built for the moment the check lands and nobody
              wants to do mental math: a restaurant dinner, a shared taxi, a group gift, a utility bill between
              housemates, or the cost of a weekend away. Enter the bill, choose a tip percentage and the number of people,
              and it shows the per-person amount along with the tip and grand total.
            </p>
            <h3 className="text-lg font-semibold text-gray-900">How it works</h3>
            <p>
              The math is straightforward, which is exactly why it is easy to get wrong after a long meal. The calculator
              first works out the tip as a percentage of the bill, adds it to the original amount to get the grand total,
              and then divides that total by the number of people. Doing the steps in that order matters: tipping on the
              pre-tip bill and then splitting gives everyone an equal share of both the cost and the gratuity, with no one
              quietly underpaying.
            </p>
            <h3 className="text-lg font-semibold text-gray-900">A worked example</h3>
            <p>
              Suppose dinner for four comes to $120 and you want to leave an 18% tip. The tip is 18% of $120, which is
              $21.60, making the grand total $141.60. Split four ways, that is $35.40 each. Without a tip, the same $120
              divided by four is $30 each. Seeing both the per-person figure and the total helps the group sanity-check
              the bill before anyone pays, and it settles the awkward &quot;who owes what&quot; question in seconds.
            </p>
            <h3 className="text-lg font-semibold text-gray-900">Tips for splitting fairly</h3>
            <ul className="list-disc space-y-1 pl-6">
              <li>Decide whether to tip on the pre-tax or post-tax amount; tipping on the pre-tax subtotal is common and slightly cheaper.</li>
              <li>Round the per-person amount up to the nearest dollar if you are paying cash, so the tip is never short.</li>
              <li>For groups, check whether the venue already added a service charge, which means you may not need to tip again.</li>
              <li>When one person pays the whole bill on a card, have the others send their exact share so no one is left out of pocket.</li>
            </ul>
            <h3 className="text-lg font-semibold text-gray-900">When an even split is not fair</h3>
            <p>
              An equal split works best when everyone consumed roughly the same. If one person had a starter and three
              courses while another just had a salad, or if a few people drank and others did not, a strict even split
              quietly overcharges the lighter spenders. In those cases, total each person&apos;s own items first, then apply
              the tip proportionally, rather than dividing the whole bill equally. This calculator handles the common
              even-split case; for very uneven groups, tally individual portions before sharing the tip.
            </p>
          </div>
        }
        faqs={[
          { question: "Can I split the bill unevenly?", answer: "This calculator splits the total evenly across the group. For uneven splits, total each person's own items first, then add a proportional share of the tip to each. An even split is best when everyone consumed roughly the same amount." },
          { question: "Should I tip on the amount before or after tax?", answer: "Either is acceptable, but many people tip on the pre-tax subtotal, which is slightly less than tipping on the taxed total. Decide as a group, then apply the same basis for everyone so the split stays fair." },
          { question: "Does the calculator add the tip before or after splitting?", answer: "It adds the tip to the bill first, then divides the grand total by the number of people. That way each person pays an equal share of both the cost and the gratuity." },
          { question: "How do I handle a service charge that is already included?", answer: "If the venue has already added a service charge or gratuity, you usually do not need to tip again. Enter a tip of zero and simply split the total, or reduce the tip to top up only if you wish." },
          { question: "What if the per-person amount has awkward cents?", answer: "Rounding each share up to the nearest dollar is a simple fix, especially when paying cash. It ensures the tip is never short and avoids the group coming up a few cents below the total." },
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
