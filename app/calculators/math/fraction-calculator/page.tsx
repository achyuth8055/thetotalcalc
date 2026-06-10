"use client";

import { useState, useEffect } from "react";
import Breadcrumbs from "@/components/Breadcrumbs";
import CalculatorLayout from "@/components/CalculatorLayout";

type Op = "add" | "subtract" | "multiply" | "divide";

function gcd(a: number, b: number): number {
  return b === 0 ? Math.abs(a) : gcd(b, a % b);
}

function simplify(n: number, d: number): [number, number] {
  if (d === 0) return [n, d];
  const g = gcd(Math.abs(n), Math.abs(d));
  const sign = d < 0 ? -1 : 1;
  return [(sign * n) / g, (sign * d) / g];
}

export default function FractionCalculator() {
  const [n1, setN1] = useState(1);
  const [d1, setD1] = useState(2);
  const [n2, setN2] = useState(1);
  const [d2, setD2] = useState(3);
  const [op, setOp] = useState<Op>("add");
  const [result, setResult] = useState<{ n: number; d: number; decimal: number; mixed: string } | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const recent = JSON.parse(localStorage.getItem("recentCalculators") || "[]");
    const updated = ["fraction", ...recent.filter((id: string) => id !== "fraction")].slice(0, 10);
    localStorage.setItem("recentCalculators", JSON.stringify(updated));
    calculate();
  }, []);

  useEffect(() => { calculate(); }, [n1, d1, n2, d2, op]);

  const calculate = () => {
    setError("");
    if (d1 === 0 || d2 === 0) { setError("Denominator cannot be zero"); return; }

    let rn: number, rd: number;
    if (op === "add") { rn = n1 * d2 + n2 * d1; rd = d1 * d2; }
    else if (op === "subtract") { rn = n1 * d2 - n2 * d1; rd = d1 * d2; }
    else if (op === "multiply") { rn = n1 * n2; rd = d1 * d2; }
    else { // divide
      if (n2 === 0) { setError("Cannot divide by zero"); return; }
      rn = n1 * d2; rd = d1 * n2;
    }

    const [sn, sd] = simplify(rn, rd);
    const decimal = sd !== 0 ? sn / sd : NaN;
    const wholeNum = sd !== 0 ? Math.trunc(sn / sd) : 0;
    const remN = Math.abs(sn % sd);
    const mixed = sd !== 0 && Math.abs(sn) >= Math.abs(sd) && remN !== 0
      ? `${wholeNum} ${remN}/${Math.abs(sd)}`
      : "";

    setResult({ n: sn, d: sd, decimal, mixed });
  };

  const OPS: { label: string; value: Op; symbol: string }[] = [
    { label: "Add", value: "add", symbol: "+" },
    { label: "Subtract", value: "subtract", symbol: "−" },
    { label: "Multiply", value: "multiply", symbol: "×" },
    { label: "Divide", value: "divide", symbol: "÷" },
  ];

  const FractionInput = ({ n, d, setN, setD, label }: { n: number; d: number; setN: (v: number) => void; setD: (v: number) => void; label: string }) => (
    <div className="flex flex-col items-center">
      <div className="text-xs font-semibold text-gray-500 mb-2">{label}</div>
      <input type="number" value={n} onChange={(e) => setN(Number(e.target.value))}
        className="w-20 px-2 py-2 border border-gray-300 rounded-t-lg text-center text-xl font-bold text-blue-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:outline-none" />
      <div className="w-20 h-0.5 bg-gray-800" />
      <input type="number" value={d} onChange={(e) => setD(Number(e.target.value))}
        className="w-20 px-2 py-2 border border-gray-300 rounded-b-lg text-center text-xl font-bold text-blue-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:outline-none" />
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumbs
        items={[
          { label: "Math Calculators", href: "/math-calculators" },
          { label: "Fraction Calculator", href: "/calculators/math/fraction-calculator" },
        ]}
      />
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Fraction Calculator</h1>
        <p className="text-base text-gray-600">Add, subtract, multiply, and divide fractions with automatic simplification</p>
      </div>

      <div className="bg-white rounded-xl shadow-md p-8 border border-gray-200 mb-6">
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <FractionInput n={n1} d={d1} setN={setN1} setD={setD1} label="Fraction 1" />

          <div className="flex flex-col gap-2">
            {OPS.map(o => (
              <button key={o.value} onClick={() => setOp(o.value)}
                className={`w-12 h-12 rounded-full text-xl font-bold border-2 transition-colors ${op === o.value ? "bg-purple-600 text-white border-purple-600" : "bg-white text-gray-700 border-gray-300 hover:border-purple-400"}`}>
                {o.symbol}
              </button>
            ))}
          </div>

          <FractionInput n={n2} d={d2} setN={setN2} setD={setD2} label="Fraction 2" />

          <div className="text-3xl font-bold text-gray-400">=</div>

          <div className="flex flex-col items-center min-w-24">
            <div className="text-xs font-semibold text-gray-500 mb-2">Result</div>
            {error ? (
              <div className="text-red-500 text-sm font-medium">{error}</div>
            ) : result ? (
              <div className="flex flex-col items-center">
                <div className="text-2xl font-bold text-purple-600">{result.n}</div>
                <div className="w-16 h-0.5 bg-purple-600" />
                <div className="text-2xl font-bold text-purple-600">{result.d}</div>
              </div>
            ) : null}
          </div>
        </div>

        {result && !error && (
          <div className="mt-6 pt-6 border-t border-gray-100 grid sm:grid-cols-3 gap-4">
            <div className="bg-purple-50 rounded-lg p-3 text-center">
              <div className="text-xs text-gray-500 mb-1">Simplified</div>
              <div className="text-xl font-bold text-purple-700">{result.n}/{result.d}</div>
            </div>
            <div className="bg-blue-50 rounded-lg p-3 text-center">
              <div className="text-xs text-gray-500 mb-1">Decimal</div>
              <div className="text-xl font-bold text-blue-700">{result.decimal.toFixed(6).replace(/\.?0+$/, "")}</div>
            </div>
            {result.mixed && (
              <div className="bg-green-50 rounded-lg p-3 text-center">
                <div className="text-xs text-gray-500 mb-1">Mixed Number</div>
                <div className="text-xl font-bold text-green-700">{result.mixed}</div>
              </div>
            )}
          </div>
        )}
      </div>

      <CalculatorLayout title="" description=""
        explanation={<p>Enter any two fractions, select the operation, and get the simplified result, decimal equivalent, and mixed number form instantly.</p>}
        faqs={[
          { question: "How do you add fractions?", answer: "Find a common denominator, convert both fractions, then add the numerators. Example: 1/2 + 1/3 = 3/6 + 2/6 = 5/6." },
          { question: "How do you divide fractions?", answer: "Multiply by the reciprocal of the second fraction. Example: 1/2 ÷ 1/4 = 1/2 × 4/1 = 4/2 = 2." },
          { question: "What is a mixed number?", answer: "A mixed number has a whole part and a fraction part, like 2 1/3. It's equivalent to an improper fraction (7/3)." },
        ]}
        relatedCalculators={[
          { name: "Percentage Calculator", href: "/calculators/math/percentage-calculator" },
          { name: "Ratio Calculator", href: "/calculators/math/ratio-calculator" },
          { name: "Scientific Calculator", href: "/calculators/math/scientific-calculator" },
        ]}
      >
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900">Fraction Operations</h2>
          <div className="grid sm:grid-cols-2 gap-3 text-sm">
            <div className="bg-gray-50 rounded-lg p-3"><strong>Addition:</strong> a/b + c/d = (ad + bc) / bd</div>
            <div className="bg-gray-50 rounded-lg p-3"><strong>Subtraction:</strong> a/b − c/d = (ad − bc) / bd</div>
            <div className="bg-gray-50 rounded-lg p-3"><strong>Multiplication:</strong> a/b × c/d = ac / bd</div>
            <div className="bg-gray-50 rounded-lg p-3"><strong>Division:</strong> a/b ÷ c/d = ad / bc</div>
          </div>
        </div>
      </CalculatorLayout>
    </div>
  );
}
