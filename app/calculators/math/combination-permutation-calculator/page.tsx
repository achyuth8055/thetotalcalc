"use client";
import { useState, useMemo } from "react";
import Breadcrumbs from "@/components/Breadcrumbs";
import CalculatorLayout from "@/components/CalculatorLayout";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

function factorial(n: number): bigint {
  if (n <= 1) return BigInt(1);
  let result = BigInt(1);
  for (let i = BigInt(2); i <= BigInt(n); i++) result *= i;
  return result;
}

function permutation(n: number, r: number): bigint {
  if (r > n) return BigInt(0);
  return factorial(n) / factorial(n - r);
}

function combination(n: number, r: number): bigint {
  if (r > n) return BigInt(0);
  return factorial(n) / (factorial(r) * factorial(n - r));
}

function permWithRepeat(n: number, r: number): bigint {
  let result = BigInt(1);
  const base = BigInt(n);
  for (let i = 0; i < r; i++) result *= base;
  return result;
}

function combWithRepeat(n: number, r: number): bigint {
  return combination(n + r - 1, r);
}

function fmtBig(b: bigint): string {
  return b.toLocaleString();
}

export default function CombinationPermutationCalculator() {
  const [n, setN] = useState(10);
  const [r, setR] = useState(3);

  const effectiveR = Math.min(r, n);

  const result = useMemo(() => {
    if (n < 1 || effectiveR < 0) return null;
    const pnr = permutation(n, effectiveR);
    const cnr = combination(n, effectiveR);
    const pRep = permWithRepeat(n, effectiveR);
    const cRep = combWithRepeat(n, effectiveR);

    // For chart: use log10 if values differ greatly
    const vals = [
      { name: "P(n,r)", value: Number(pnr > BigInt(Number.MAX_SAFE_INTEGER) ? Number.MAX_SAFE_INTEGER : pnr), label: fmtBig(pnr), color: "#6366f1" },
      { name: "C(n,r)", value: Number(cnr > BigInt(Number.MAX_SAFE_INTEGER) ? Number.MAX_SAFE_INTEGER : cnr), label: fmtBig(cnr), color: "#8b5cf6" },
      { name: "nʳ", value: Number(pRep > BigInt(Number.MAX_SAFE_INTEGER) ? Number.MAX_SAFE_INTEGER : pRep), label: fmtBig(pRep), color: "#a78bfa" },
      { name: "C(n+r-1,r)", value: Number(cRep > BigInt(Number.MAX_SAFE_INTEGER) ? Number.MAX_SAFE_INTEGER : cRep), label: fmtBig(cRep), color: "#c4b5fd" },
    ];

    return { pnr, cnr, pRep, cRep, vals };
  }, [n, effectiveR]);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumbs
        items={[
          { label: "Math Calculators", href: "/math-calculators" },
          { label: "Combination & Permutation Calculator", href: "/calculators/math/combination-permutation-calculator" },
        ]}
      />
      <div className="mb-6 flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Combination & Permutation Calculator</h1>
          <p className="text-base text-gray-600">
            Calculate P(n,r), C(n,r), and repetition variants — with real-world lottery and password context.
          </p>
        </div>
        <button
          onClick={() => window.print()}
          className="print:hidden flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg"
        >
          ↓ PDF
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Inputs */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200 space-y-6">
          <h2 className="text-lg font-semibold text-gray-800">Parameters</h2>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              n — Total items: <span className="text-indigo-600 font-bold">{n}</span>
            </label>
            <input
              type="range"
              min="1"
              max="30"
              value={n}
              onChange={(e) => { const v = parseInt(e.target.value); setN(v); if (r > v) setR(v); }}
              className="w-full accent-indigo-600"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1"><span>1</span><span>30</span></div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              r — Items chosen: <span className="text-indigo-600 font-bold">{effectiveR}</span>
              {r > n && <span className="text-amber-500 text-xs ml-2">(capped at n)</span>}
            </label>
            <input
              type="range"
              min="0"
              max="15"
              value={r}
              onChange={(e) => setR(parseInt(e.target.value))}
              className="w-full accent-indigo-600"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1"><span>0</span><span>15</span></div>
          </div>

          <div className="bg-indigo-50 rounded-lg p-4 space-y-2 text-sm">
            <p className="font-semibold text-indigo-800">n = {n}, r = {effectiveR}</p>
            <p className="text-indigo-700">n! = {n <= 20 ? fmtBig(factorial(n)) : `${n}! (very large)`}</p>
            <p className="text-indigo-700">r! = {fmtBig(factorial(effectiveR))}</p>
            <p className="text-indigo-700">(n−r)! = {fmtBig(factorial(n - effectiveR))}</p>
          </div>
        </div>

        {/* Results */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Results</h2>
          {result ? (
            <div className="space-y-3">
              {[
                {
                  label: "Permutation P(n,r)",
                  sublabel: "Order matters, no repetition",
                  formula: "n! / (n−r)!",
                  value: fmtBig(result.pnr),
                  color: "bg-indigo-50 border-indigo-200",
                  textColor: "text-indigo-900",
                },
                {
                  label: "Combination C(n,r)",
                  sublabel: "Order doesn't matter, no repetition",
                  formula: "n! / (r! × (n−r)!)",
                  value: fmtBig(result.cnr),
                  color: "bg-purple-50 border-purple-200",
                  textColor: "text-purple-900",
                },
                {
                  label: "Permutation with Repetition",
                  sublabel: "Order matters, repetition allowed",
                  formula: "nʳ",
                  value: fmtBig(result.pRep),
                  color: "bg-violet-50 border-violet-200",
                  textColor: "text-violet-900",
                },
                {
                  label: "Combination with Repetition",
                  sublabel: "Order doesn't matter, repetition allowed",
                  formula: "C(n+r−1, r)",
                  value: fmtBig(result.cRep),
                  color: "bg-fuchsia-50 border-fuchsia-200",
                  textColor: "text-fuchsia-900",
                },
              ].map(({ label, sublabel, formula, value, color, textColor }) => (
                <div key={label} className={`rounded-lg p-4 border ${color}`}>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-sm font-semibold text-gray-800">{label}</p>
                      <p className="text-xs text-gray-500">{sublabel}</p>
                      <p className="text-xs font-mono text-gray-400 mt-0.5">{formula}</p>
                    </div>
                    <p className={`text-lg font-bold ${textColor} text-right`}>{value}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 text-sm">Adjust sliders to calculate.</p>
          )}
        </div>
      </div>

      {/* Context cards */}
      {result && (
        <div className="mt-6 grid sm:grid-cols-2 gap-4">
          <div className="bg-yellow-50 rounded-xl shadow-md p-5 border border-yellow-200">
            <p className="text-sm font-semibold text-yellow-800 mb-2">🎰 Lottery Odds</p>
            <p className="text-sm text-yellow-900">
              Choosing {effectiveR} numbers from {n}: <strong>1 in {fmtBig(result.cnr)}</strong> chance of winning.
            </p>
          </div>
          <div className="bg-blue-50 rounded-xl shadow-md p-5 border border-blue-200">
            <p className="text-sm font-semibold text-blue-800 mb-2">🔐 Password Strength</p>
            <p className="text-sm text-blue-900">
              {effectiveR}-character passwords from {n} symbols: <strong>{fmtBig(result.pRep)}</strong> possible combinations.
            </p>
          </div>
        </div>
      )}

      {/* Chart */}
      {result && (
        <div className="mt-6 bg-white rounded-xl shadow-md p-6 border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Comparison (values may be clipped at MAX_SAFE_INTEGER)</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={result.vals} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip formatter={(_, __, props) => [props.payload.label, props.payload.name]} />
              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                {result.vals.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      <CalculatorLayout
        title="Combination & Permutation Calculator"
        description="Calculate permutations, combinations, and their repetition variants using factorial-based formulas with BigInt precision."
        explanation={
          <div className="space-y-4 text-sm text-gray-700 leading-relaxed">
            <h3 className="text-base font-semibold text-gray-900">Order Matters vs. Doesn't Matter</h3>
            <p>
              The fundamental question in counting is whether arrangement matters.
              <strong> Permutations</strong> count ordered arrangements: choosing a gold, silver, and bronze
              medalist from 10 athletes is P(10,3) = 720 — because "Alice, Bob, Carol" and "Bob, Alice, Carol"
              are different outcomes. <strong>Combinations</strong> count unordered selections: choosing 3
              committee members from 10 is C(10,3) = 120 — "Alice, Bob, Carol" is the same committee regardless
              of who's listed first. Permutations are always greater than or equal to combinations for the same
              n and r, since P(n,r) = C(n,r) × r!.
            </p>
            <h3 className="text-base font-semibold text-gray-900">Factorials and Pascal's Triangle</h3>
            <p>
              The factorial n! = n × (n−1) × ... × 2 × 1 grows extremely fast: 10! = 3,628,800 and 20! ≈ 2.4 × 10¹⁸.
              This calculator uses JavaScript's BigInt for exact integer arithmetic, avoiding floating-point overflow.
              The binomial coefficients C(n,r) form <strong>Pascal's triangle</strong>, where each entry is the
              sum of the two entries above it. Row n of Pascal's triangle lists C(n,0), C(n,1), ..., C(n,n).
              They also appear as coefficients in the binomial expansion (a+b)ⁿ.
            </p>
            <h3 className="text-base font-semibold text-gray-900">The Birthday Paradox</h3>
            <p>
              How many people do you need in a room for a 50% chance that two share a birthday? The answer
              is surprisingly small: just <strong>23 people</strong>. With 70 people, the probability exceeds
              99.9%. This is because we're counting pairs — 23 people generate C(23,2) = 253 pairs, and each
              pair has a 1/365 chance of sharing a birthday. The probability accumulates rapidly across
              all pairs. This paradox is exploited in cryptographic hash collision attacks.
            </p>
            <h3 className="text-base font-semibold text-gray-900">Password Security</h3>
            <p>
              An 8-character password using 62 characters (a-z, A-Z, 0-9) has 62⁸ = 218,340,105,584,896
              (about 218 trillion) possible combinations. At 1 billion guesses per second, cracking it takes
              ~2.5 days. A 12-character password from the same set has 62¹² ≈ 3.2 × 10²¹ — about 100 million
              years to crack. Adding symbols (95 characters total) makes 95¹² ≈ 5.4 × 10²³, raising the bar
              dramatically. This is why length matters more than complexity.
            </p>
            <h3 className="text-base font-semibold text-gray-900">DNA and Genetic Diversity</h3>
            <p>
              DNA uses 4 nucleotides (A, T, G, C). Three-nucleotide codons encode amino acids: 4³ = 64 possible
              codons, but only 20 amino acids are needed — hence some amino acids have multiple codons (redundancy).
              The human genome has ~3 billion base pairs. The number of possible human genomes exceeds atoms in
              the observable universe — explaining why every person (except identical twins) is genetically unique.
            </p>
            <h3 className="text-base font-semibold text-gray-900">Machine Learning: Hyperparameter Search</h3>
            <p>
              When training an ML model, tuning hyperparameters involves combinatorial explosion. Testing 5
              learning rates × 4 batch sizes × 3 network depths × 6 regularization values = 360 combinations.
              With 10 hyperparameters each at 5 values: 5¹⁰ ≈ 10 million combinations — too many for exhaustive
              search. This motivates random search, Bayesian optimization, and AutoML, all rooted in combinatorics.
            </p>
          </div>
        }
        faqs={[
          {
            question: "What is the difference between a combination and a permutation?",
            answer:
              "A permutation is an ordered selection — the sequence matters. A combination is an unordered selection — only which items are chosen matters. Example: PIN codes are permutations (1234 ≠ 4321); lottery tickets are combinations (the numbers in any order win). Always ask: 'Does changing the order give a different outcome?'",
          },
          {
            question: "What does 'with repetition' mean?",
            answer:
              "With repetition means items can be chosen more than once. A PIN can use '1111' (repetition allowed); a race podium cannot have the same person twice (no repetition). Permutations with repetition = nʳ; combinations with repetition = C(n+r−1, r), also called 'multiset coefficients.'",
          },
          {
            question: "How do I know which formula to use?",
            answer:
              "Ask two questions: (1) Does order matter? If yes → permutation; if no → combination. (2) Can items repeat? Use the repetition variant if yes. For racing positions → P(n,r) no repeat. For ice cream scoops (same flavor twice) → combination with repetition. For PIN codes → permutation with repetition.",
          },
          {
            question: "Why is C(n,0) = 1 for any n?",
            answer:
              "There is exactly one way to choose 0 items from any set: choose nothing. The formula confirms this: C(n,0) = n! / (0! × n!) = n! / (1 × n!) = 1. The convention that 0! = 1 is what makes this work — and it's consistent with the recursive property that n! = n × (n−1)!.",
          },
          {
            question: "What are the poker hand probabilities?",
            answer:
              "A 52-card deck has C(52,5) = 2,598,960 possible 5-card hands. Royal flush: 4 (probability 0.000154%). Straight flush: 36. Four of a kind: 624. Full house: 3,744. Flush: 5,108. Straight: 10,200. Three of a kind: 54,912. Two pair: 123,552. One pair: 1,098,240. High card only: 1,302,540.",
          },
        ]}
        relatedCalculators={[]}
      >
        <div />
      </CalculatorLayout>
    </div>
  );
}
