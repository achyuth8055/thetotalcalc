"use client";
import { useState, useMemo } from "react";
import Breadcrumbs from "@/components/Breadcrumbs";
import CalculatorLayout from "@/components/CalculatorLayout";

function gcd(a: number, b: number): number {
  a = Math.abs(Math.round(a));
  b = Math.abs(Math.round(b));
  while (b !== 0) { [a, b] = [b, a % b]; }
  return a;
}

function lcm(a: number, b: number): number {
  if (a === 0 || b === 0) return 0;
  return Math.abs(a * b) / gcd(a, b);
}

function gcfMultiple(nums: number[]): number {
  return nums.reduce((acc, n) => gcd(acc, n));
}

function lcmMultiple(nums: number[]): number {
  return nums.reduce((acc, n) => lcm(acc, n));
}

interface PrimeFactor { prime: number; exp: number }

function primeFactors(n: number): PrimeFactor[] {
  n = Math.abs(Math.round(n));
  if (n <= 1) return [];
  const factors: PrimeFactor[] = [];
  let d = 2;
  while (d * d <= n) {
    if (n % d === 0) {
      let exp = 0;
      while (n % d === 0) { exp++; n = Math.floor(n / d); }
      factors.push({ prime: d, exp });
    }
    d++;
  }
  if (n > 1) factors.push({ prime: n, exp: 1 });
  return factors;
}

function formatFactors(factors: PrimeFactor[]): string {
  if (factors.length === 0) return "1";
  return factors.map(({ prime, exp }) => exp === 1 ? `${prime}` : `${prime}^${exp}`).join(" × ");
}

function formatFactorsDisplay(factors: PrimeFactor[]): string {
  if (factors.length === 0) return "1";
  return factors.map(({ prime, exp }) => exp === 1 ? `${prime}` : `${prime}${exp > 1 ? "^" + exp : ""}`).join(" × ");
}

export default function LcmGcfCalculator() {
  const [inputs, setInputs] = useState<string[]>(["12", "18"]);

  const addInput = () => { if (inputs.length < 5) setInputs([...inputs, ""]); };
  const removeInput = (i: number) => { if (inputs.length > 2) setInputs(inputs.filter((_, idx) => idx !== i)); };
  const setInput = (i: number, v: string) => {
    const next = [...inputs];
    next[i] = v;
    setInputs(next);
  };

  const result = useMemo(() => {
    const nums = inputs.map((v) => parseInt(v)).filter((n) => !isNaN(n) && n > 0);
    if (nums.length < 2) return null;

    const gcf = gcfMultiple(nums);
    const lcmVal = lcmMultiple(nums);
    const factorizations = nums.map((n) => ({ n, factors: primeFactors(n) }));

    // GCF via min exponents, LCM via max exponents
    const allPrimes = Array.from(new Set(factorizations.flatMap(({ factors }) => factors.map((f) => f.prime)))).sort((a, b) => a - b);

    const gcfSteps = allPrimes.map((p) => {
      const exps = factorizations.map(({ factors }) => factors.find((f) => f.prime === p)?.exp ?? 0);
      const minExp = Math.min(...exps);
      return { prime: p, exps, min: minExp, max: Math.max(...exps) };
    });

    const gcfFormula = gcfSteps.filter((s) => s.min > 0).map((s) => s.min === 1 ? `${s.prime}` : `${s.prime}^${s.min}`).join(" × ") || "1";
    const lcmFormula = gcfSteps.map((s) => s.max === 1 ? `${s.prime}` : `${s.prime}^${s.max}`).join(" × ") || "1";

    const verify = nums.length === 2 ? `${nums[0]} × ${nums[1]} = ${nums[0] * nums[1]}, LCM × GCF = ${lcmVal} × ${gcf} = ${lcmVal * gcf}` : null;

    // Euclidean steps for 2 numbers
    let euclideanSteps: string[] = [];
    if (nums.length === 2) {
      let a = nums[0], b = nums[1];
      const steps: string[] = [];
      while (b !== 0) {
        steps.push(`gcd(${a}, ${b}) → ${a} = ${Math.floor(a / b)} × ${b} + ${a % b}`);
        [a, b] = [b, a % b];
      }
      steps.push(`gcd(${a}, 0) = ${a}`);
      euclideanSteps = steps;
    }

    return { gcf, lcmVal, factorizations, gcfSteps, gcfFormula, lcmFormula, verify, euclideanSteps, nums, allPrimes };
  }, [inputs]);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumbs
        items={[
          { label: "Math Calculators", href: "/math-calculators" },
          { label: "LCM & GCF Calculator", href: "/calculators/math/lcm-gcf-calculator" },
        ]}
      />
      <div className="mb-6 flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">LCM & GCF Calculator</h1>
          <p className="text-base text-gray-600">
            Find the Least Common Multiple and Greatest Common Factor with prime factorization and Euclidean algorithm steps.
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
        {/* Input */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200 space-y-4">
          <h2 className="text-lg font-semibold text-gray-800">Enter Numbers (2–5)</h2>
          <div className="space-y-3">
            {inputs.map((val, i) => (
              <div key={i} className="flex gap-2 items-center">
                <label className="text-sm text-gray-500 w-8 flex-shrink-0">#{i + 1}</label>
                <input
                  type="number"
                  className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={val}
                  onChange={(e) => setInput(i, e.target.value)}
                  min="1"
                  placeholder={`Number ${i + 1}`}
                />
                {inputs.length > 2 && (
                  <button
                    onClick={() => removeInput(i)}
                    className="text-red-400 hover:text-red-600 text-lg leading-none w-8 flex-shrink-0 text-center"
                    title="Remove"
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
          </div>

          {inputs.length < 5 && (
            <button
              onClick={addInput}
              className="text-sm text-indigo-600 hover:text-indigo-800 font-medium flex items-center gap-1"
            >
              + Add another number
            </button>
          )}

          {/* Prime factorizations */}
          {result && (
            <div className="mt-4 space-y-2">
              <h3 className="text-sm font-semibold text-gray-700">Prime Factorizations</h3>
              {result.factorizations.map(({ n, factors }) => (
                <div key={n} className="bg-gray-50 rounded-lg px-3 py-2 font-mono text-sm">
                  <span className="font-bold text-gray-800">{n}</span>
                  <span className="text-gray-500"> = </span>
                  <span className="text-indigo-700">{formatFactorsDisplay(factors)}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Results */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Results</h2>
          {result ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-indigo-50 rounded-xl p-5 text-center border border-indigo-200">
                  <p className="text-sm text-indigo-600 font-medium mb-1">GCF (Greatest Common Factor)</p>
                  <p className="text-4xl font-bold text-indigo-900">{result.gcf}</p>
                  <p className="text-xs text-indigo-500 mt-2 font-mono">{result.gcfFormula}</p>
                </div>
                <div className="bg-purple-50 rounded-xl p-5 text-center border border-purple-200">
                  <p className="text-sm text-purple-600 font-medium mb-1">LCM (Least Common Multiple)</p>
                  <p className="text-4xl font-bold text-purple-900">{result.lcmVal}</p>
                  <p className="text-xs text-purple-500 mt-2 font-mono">{result.lcmFormula}</p>
                </div>
              </div>

              {/* Method explanation */}
              {result.allPrimes.length > 0 && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-xs font-semibold text-gray-600 mb-2">Prime Factor Analysis</p>
                  <table className="w-full text-xs text-center">
                    <thead>
                      <tr className="text-gray-500">
                        <th className="text-left pb-1">Prime</th>
                        {result.nums.map((n) => <th key={n} className="pb-1">{n}</th>)}
                        <th className="text-green-700 pb-1">GCF (min)</th>
                        <th className="text-purple-700 pb-1">LCM (max)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {result.gcfSteps.map(({ prime, exps, min, max }) => (
                        <tr key={prime} className="border-t border-gray-200">
                          <td className="text-left py-1 font-mono font-bold">{prime}</td>
                          {exps.map((e, i) => <td key={i} className="py-1">{e > 0 ? `^${e}` : "—"}</td>)}
                          <td className="text-green-700 font-bold py-1">{min > 0 ? `^${min}` : "—"}</td>
                          <td className="text-purple-700 font-bold py-1">{max > 0 ? `^${max}` : "—"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {result.verify && (
                <div className="bg-green-50 rounded-lg p-3 text-xs text-green-800 border border-green-200">
                  <span className="font-semibold">Verification: </span>{result.verify}
                </div>
              )}
            </div>
          ) : (
            <p className="text-gray-400 text-sm">Enter at least 2 positive integers to calculate.</p>
          )}
        </div>
      </div>

      {/* Euclidean Algorithm Steps */}
      {result?.euclideanSteps && result.euclideanSteps.length > 0 && (
        <div className="mt-6 bg-white rounded-xl shadow-md p-6 border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Euclidean Algorithm Steps (for 2 numbers)</h2>
          <div className="bg-gray-900 rounded-xl p-5 font-mono text-sm text-green-300 space-y-1">
            {result.euclideanSteps.map((step, i) => <div key={i}>{step}</div>)}
          </div>
          <p className="text-sm text-gray-600 mt-3">
            GCF = <strong>{result.gcf}</strong>. Then LCM = {result.nums[0]} × {result.nums[1]} ÷ {result.gcf} = <strong>{result.lcmVal}</strong>
          </p>
        </div>
      )}

      <CalculatorLayout
        title="LCM & GCF Calculator"
        description="Calculate the Least Common Multiple (LCM) and Greatest Common Factor (GCF) of 2–5 numbers using the Euclidean algorithm and prime factorization."
        explanation={
          <div className="space-y-4 text-sm text-gray-700 leading-relaxed">
            <h3 className="text-base font-semibold text-gray-900">Euclid's Algorithm: 2,300 Years Old and Still Best</h3>
            <p>
              The Euclidean algorithm, described in Euclid's <em>Elements</em> (circa 300 BC), is one of the
              oldest numerical algorithms still in everyday use. It computes GCF using the observation that
              gcd(a, b) = gcd(b, a mod b). Starting from two numbers, repeatedly replace the larger with the
              remainder of dividing the two — when the remainder is 0, the other number is the GCF.
              For gcd(48, 18): 48 = 2×18 + 12; 18 = 1×12 + 6; 12 = 2×6 + 0. Answer: 6.
              This algorithm is O(log(min(a,b))) — extremely efficient even for numbers with hundreds of digits.
            </p>
            <h3 className="text-base font-semibold text-gray-900">GCF in Real Life: Tiling and Distribution</h3>
            <p>
              The GCF answers: "What is the largest unit that evenly divides all given quantities?"
              <strong> Tiling a room:</strong> A room 12 feet × 18 feet can be tiled with the largest square
              tile that fits perfectly along both walls — the tile side length is GCF(12, 18) = 6 feet (or 2, 3, 6).
              <strong> Equal distribution:</strong> 48 apples and 60 oranges distributed into identical bags
              without remainder: max bags = GCF(48, 60) = 12, each with 4 apples and 5 oranges.
            </p>
            <h3 className="text-base font-semibold text-gray-900">LCM: Scheduling and Synchronization</h3>
            <p>
              The LCM answers: "When will two or more periodic events next coincide?"
              <strong> Bus scheduling:</strong> Bus A leaves every 12 minutes, Bus B every 18 minutes. They
              leave together at time 0 — the next simultaneous departure is at LCM(12, 18) = 36 minutes.
              <strong> Gear rotation:</strong> A gear with 12 teeth meshing with one of 18 teeth returns to
              the same tooth alignment after LCM(12,18) / 12 = 3 full rotations of the first gear.
              <strong> Musical polyrhythm:</strong> A 3-beat and 4-beat pattern align every LCM(3,4) = 12 beats,
              creating the rhythmic cycle heard in West African and Afro-Cuban music.
            </p>
            <h3 className="text-base font-semibold text-gray-900">Adding Fractions: Why LCM Matters</h3>
            <p>
              To add 1/12 + 1/18, find the Least Common Denominator = LCM(12, 18) = 36.
              Then 1/12 = 3/36, 1/18 = 2/36, sum = 5/36. Using LCM as the LCD gives the simplest
              common denominator without needing to simplify at the end. This is why LCM is taught
              alongside fraction arithmetic — it makes addition and subtraction of fractions systematic.
            </p>
            <h3 className="text-base font-semibold text-gray-900">Coprime Numbers and Bézout's Identity</h3>
            <p>
              Two numbers are <strong>coprime</strong> (or relatively prime) when their GCF = 1.
              Examples: (8, 9), (14, 15), any two consecutive integers. For coprime numbers,
              LCM(a, b) = a × b. <strong>Bézout's identity</strong> states that for any integers a and b,
              there exist integers x and y such that ax + by = gcd(a, b). This theorem underlies the
              Extended Euclidean Algorithm, crucial for computing modular inverses in RSA encryption.
            </p>
            <h3 className="text-base font-semibold text-gray-900">Modular Arithmetic Applications</h3>
            <p>
              GCF and LCM are foundational to modular arithmetic, which powers modern cryptography.
              RSA encryption relies on the fact that factoring large numbers (finding their prime factors)
              is computationally infeasible — while multiplying primes together is easy. The Euler totient
              function φ(n), used to select RSA keys, depends directly on the prime factorization of n.
              Every time you visit an HTTPS website, your browser and server are performing computations
              rooted in GCF and prime factorization.
            </p>
          </div>
        }
        faqs={[
          {
            question: "What is the difference between GCF and LCM?",
            answer:
              "GCF (Greatest Common Factor, also GCD) is the largest number that divides all given numbers without remainder. LCM (Least Common Multiple) is the smallest positive number divisible by all given numbers. GCF divides down; LCM multiplies up. For any two numbers: LCM × GCF = a × b.",
          },
          {
            question: "Can LCM or GCF be calculated for more than 2 numbers?",
            answer:
              "Yes. Apply the operation pairwise: GCF(a, b, c) = GCF(GCF(a, b), c). LCM(a, b, c) = LCM(LCM(a, b), c). This works because both GCF and LCM are associative. The prime factorization method also extends naturally: take minimum (GCF) or maximum (LCM) exponents of each prime across all numbers.",
          },
          {
            question: "Why is GCF(a, 0) = a?",
            answer:
              "Every positive integer divides 0 (since 0 = n × 0 for any n). So the greatest common divisor of any number a and 0 is a itself — because a divides both a and 0, and no number larger than a can divide a. This base case makes the Euclidean algorithm terminate correctly.",
          },
          {
            question: "How do I simplify a fraction using GCF?",
            answer:
              "Divide both numerator and denominator by their GCF. For 24/36: GCF(24, 36) = 12. So 24/36 = (24÷12)/(36÷12) = 2/3. This gives the fraction in lowest terms. If GCF = 1, the fraction is already fully simplified (the numerator and denominator are coprime).",
          },
          {
            question: "What does it mean for two numbers to be coprime?",
            answer:
              "Two numbers are coprime (relatively prime) when their GCF equals 1. They share no common prime factors. Examples: 8 and 9 are coprime (8 = 2³, 9 = 3²). Consecutive integers are always coprime. In cryptography, we need large coprime numbers — RSA keys require two large primes p and q to be coprime to φ(n) = (p−1)(q−1).",
          },
        ]}
        relatedCalculators={[]}
      >
        <div />
      </CalculatorLayout>
    </div>
  );
}
