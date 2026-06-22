"use client";
import { useState, useMemo } from "react";
import Breadcrumbs from "@/components/Breadcrumbs";
import CalculatorLayout from "@/components/CalculatorLayout";

type Tab = "check" | "sieve" | "factorize";

function isPrime(n: number): boolean {
  if (n < 2) return false;
  if (n === 2) return true;
  if (n % 2 === 0) return false;
  for (let i = 3; i <= Math.sqrt(n); i += 2) {
    if (n % i === 0) return false;
  }
  return true;
}

function nextPrime(n: number): number {
  let candidate = n + 1;
  while (!isPrime(candidate)) candidate++;
  return candidate;
}

function prevPrime(n: number): number | null {
  if (n <= 2) return null;
  let candidate = n - 1;
  while (candidate >= 2 && !isPrime(candidate)) candidate--;
  return candidate >= 2 ? candidate : null;
}

function sieveOfEratosthenes(limit: number): boolean[] {
  const sieve = new Array(limit + 1).fill(true);
  sieve[0] = false;
  if (limit >= 1) sieve[1] = false;
  for (let i = 2; i * i <= limit; i++) {
    if (sieve[i]) {
      for (let j = i * i; j <= limit; j += i) {
        sieve[j] = false;
      }
    }
  }
  return sieve;
}

function primeFactorization(n: number): Map<number, number> {
  const factors = new Map<number, number>();
  let num = n;
  for (let d = 2; d * d <= num; d++) {
    while (num % d === 0) {
      factors.set(d, (factors.get(d) ?? 0) + 1);
      num = Math.floor(num / d);
    }
  }
  if (num > 1) {
    factors.set(num, (factors.get(num) ?? 0) + 1);
  }
  return factors;
}

function countDivisors(factors: Map<number, number>): number {
  let count = 1;
  for (const exp of Array.from(factors.values())) {
    count *= exp + 1;
  }
  return count;
}

function superscript(n: number): string {
  const map: Record<string, string> = {
    "0": "⁰","1": "¹","2": "²","3": "³","4": "⁴",
    "5": "⁵","6": "⁶","7": "⁷","8": "⁸","9": "⁹",
  };
  return String(n).split("").map((c) => map[c] ?? c).join("");
}

export default function PrimeNumberChecker() {
  const [tab, setTab] = useState<Tab>("check");

  // Tab A: check
  const [checkInput, setCheckInput] = useState(97);

  // Tab B: sieve
  const [sieveLimit, setSieveLimit] = useState(100);

  // Tab C: factorize
  const [factInput, setFactInput] = useState(360);

  // --- Tab A results ---
  const checkResult = useMemo(() => {
    const n = checkInput;
    const prime = isPrime(n);
    const next = prime ? nextPrime(n) : nextPrime(n - 1 < 2 ? 1 : n - 1);
    const actualNext = nextPrime(n);
    const prev = prevPrime(n);
    return { n, prime, prevPrime: prev, nextPrime: actualNext };
  }, [checkInput]);

  // --- Tab B results ---
  const sieveResult = useMemo(() => {
    const sieve = sieveOfEratosthenes(sieveLimit);
    const primes = sieve.map((v, i) => (v ? i : -1)).filter((v) => v > 0);
    const showGrid = sieveLimit <= 200;
    return { sieve, primes, showGrid };
  }, [sieveLimit]);

  // --- Tab C results ---
  const factResult = useMemo(() => {
    const n = factInput;
    if (n < 2) return null;
    const factors = primeFactorization(n);
    const divisors = countDivisors(factors);
    const expression = Array.from(factors.entries())
      .map(([p, e]) => (e === 1 ? String(p) : `${p}${superscript(e)}`))
      .join(" × ");
    return { n, factors, divisors, expression };
  }, [factInput]);

  const tabs: { id: Tab; label: string }[] = [
    { id: "check", label: "Check Number" },
    { id: "sieve", label: "Find Primes Up To N" },
    { id: "factorize", label: "Prime Factorization" },
  ];

  const explanation = (
    <div className="prose max-w-none text-gray-700 space-y-4">
      <p>
        Prime numbers are the atoms of arithmetic — the indivisible building blocks from which all integers are constructed. A prime number is a whole number greater than 1 that has exactly two distinct positive divisors: 1 and itself. The number 17 is prime because only 1 and 17 divide it evenly. The number 15 is not prime because it factors as 3 times 5.
      </p>
      <p>
        <strong>The Fundamental Theorem of Arithmetic</strong><br />
        One of mathematics' most elegant results is the Fundamental Theorem of Arithmetic: every integer greater than 1 can be represented as a product of prime numbers in exactly one way (up to the order of factors). This unique prime factorization makes primes the universal "DNA" of integers. The number 360 = 2³ × 3² × 5, and no other combination of primes produces 360. This uniqueness underlies vast swaths of number theory, algebra, and cryptography.
      </p>
      <p>
        <strong>How Many Primes Are There?</strong><br />
        Euclid proved over 2,300 years ago that infinitely many primes exist, using one of mathematics' most elegant proofs by contradiction. Assume there are finitely many primes p₁, p₂, ..., pₙ. Form the number N = (p₁ × p₂ × ... × pₙ) + 1. Either N is prime (contradicting our assumption) or N has a prime factor not in our list (also contradicting our assumption). Therefore no finite list can contain all primes. The prime counting function π(n) — how many primes exist up to n — grows approximately as n / ln(n), a result formalized in the Prime Number Theorem proved independently by Hadamard and de la Vallée Poussin in 1896.
      </p>
      <p>
        <strong>The Sieve of Eratosthenes</strong><br />
        The ancient Greek mathematician Eratosthenes (c. 276-194 BCE) devised an elegant algorithm for finding all primes up to a given limit. Start with all numbers from 2 to N. Mark 2 as prime, then cross out all its multiples. Move to the next unmarked number (3), mark it prime, cross out its multiples. Continue until you reach √N — every remaining unmarked number is prime. The algorithm runs in O(n log log n) time and remains one of the most efficient methods for generating primes in bulk, still used in competitive programming and cryptographic applications today.
      </p>
      <p>
        <strong>Primality Testing at Scale</strong><br />
        The trial division method used here works well for numbers up to a few million but becomes impractical for very large numbers. Modern cryptographic applications (RSA encryption, for instance) require working with primes of hundreds of digits. The Miller-Rabin primality test, a probabilistic algorithm, can verify primality of such numbers in milliseconds. For deterministic verification, the AKS primality test (2002) was a landmark achievement — the first polynomial-time deterministic algorithm — though Miller-Rabin remains faster in practice.
      </p>
      <p>
        <strong>Primes in Cryptography</strong><br />
        The entire RSA cryptosystem, which secures much of internet communication, depends on the computational asymmetry between multiplication and factorization. Multiplying two large primes together takes milliseconds. Factoring the result back into those two primes — given only the product — takes classical computers longer than the age of the universe for sufficiently large numbers. Your browser's HTTPS connection, banking transactions, and encrypted emails all rely on this one-way mathematical trapdoor. Quantum computers running Shor's algorithm would break RSA, which is why post-quantum cryptography standards are now being developed.
      </p>
      <p>
        <strong>Unsolved Problems in Prime Theory</strong><br />
        Despite millennia of study, primes remain deeply mysterious. The Goldbach Conjecture (1742) states that every even integer greater than 2 is the sum of two primes — verified computationally to 4 × 10¹⁸ but never proven. The Twin Prime Conjecture holds that there are infinitely many pairs of primes differing by 2 (like 11 and 13, or 17 and 19) — significant progress was made in 2013 when Yitang Zhang proved infinitely many prime pairs exist within a bounded gap, but the conjecture remains open. The Riemann Hypothesis, arguably the most important unsolved problem in mathematics, makes a precise claim about the distribution of prime numbers in the complex plane. It carries a $1 million Millennium Prize.
      </p>
    </div>
  );

  const faqs = [
    {
      question: "What makes a number prime?",
      answer: "A prime number is any whole number greater than 1 that has exactly two divisors: 1 and itself. The number must not be divisible by any integer other than these two. By this definition, 1 is not prime (it has only one divisor), and 2 is the only even prime.",
    },
    {
      question: "How do you check if a large number is prime?",
      answer: "The simplest method is trial division: test whether the number is divisible by any integer from 2 up to its square root. If no divisor is found, it is prime. You only need to check up to the square root because if n = a × b and both a and b are greater than √n, then a × b would exceed n. For very large numbers, probabilistic tests like Miller-Rabin are used instead.",
    },
    {
      question: "What is prime factorization used for?",
      answer: "Prime factorization has widespread applications: computing the greatest common divisor (GCD) and least common multiple (LCM) of numbers, simplifying fractions, solving modular arithmetic problems, and most importantly, forming the mathematical foundation of RSA public-key cryptography. The difficulty of factoring large semiprimes (products of two large primes) secures most internet communications.",
    },
    {
      question: "Are there patterns in prime numbers?",
      answer: "Primes become less frequent as numbers grow larger, following the Prime Number Theorem (the density near n is approximately 1/ln(n)). However, their exact distribution contains deep structure described by the Riemann zeta function. Primes often appear in patterns like twin primes (differing by 2), cousin primes (differing by 4), and sexy primes (differing by 6), but whether infinitely many such pairs exist for each gap size remains mostly unproven.",
    },
    {
      question: "What are the first few prime numbers?",
      answer: "The first 25 prime numbers are: 2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97. The number 2 is the only even prime — all larger even numbers are divisible by 2 and therefore composite.",
    },
  ];

  const relatedCalculators = [
    { name: "LCM & GCF Calculator", href: "/calculators/math/lcm-gcf-calculator" },
    { name: "Statistics Calculator", href: "/calculators/math/statistics-calculator" },
    { name: "Combination & Permutation", href: "/calculators/math/combination-permutation-calculator" },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumbs
        items={[
          { label: "Math", href: "/calculators/math" },
          { label: "Prime Number Checker", href: "/calculators/math/prime-number-checker" },
        ]}
      />
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Prime Number Checker</h1>
        <p className="text-base text-gray-600">Check primality, find primes in a range, and compute prime factorizations</p>
      </div>

      {/* Tab bar */}
      <div className="flex gap-1 bg-gray-100 rounded-xl p-1 mb-6">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex-1 py-2.5 px-3 rounded-lg text-sm font-medium transition-colors ${
              tab === t.id ? "bg-white text-blue-700 shadow-sm" : "text-gray-600 hover:text-gray-800"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab A: Check Number */}
      {tab === "check" && (
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 space-y-6">
            <h2 className="text-lg font-semibold text-gray-800">Enter a Number</h2>
            <div>
              <div className="flex justify-between items-center mb-3">
                <label className="text-sm font-semibold text-gray-700">Number to Check</label>
                <input
                  type="number"
                  min={1}
                  max={999999}
                  value={checkInput}
                  onChange={(e) => {
                    const v = parseInt(e.target.value);
                    if (!isNaN(v) && v >= 1) setCheckInput(Math.min(v, 999999));
                  }}
                  className="w-32 px-3 py-1.5 text-right border border-gray-300 rounded-md text-sm font-semibold text-blue-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <input
                type="range"
                min={2}
                max={1000}
                step={1}
                value={Math.min(checkInput, 1000)}
                onChange={(e) => setCheckInput(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>2</span>
                <span>1,000</span>
              </div>
              <p className="text-xs text-gray-400 mt-2">Type any number up to 999,999 in the field above</p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 space-y-5">
            <h2 className="text-lg font-semibold text-gray-800">Result</h2>

            <div className={`rounded-xl p-6 text-center ${checkResult.prime ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"}`}>
              <div className={`text-5xl font-bold ${checkResult.prime ? "text-green-700" : "text-red-700"}`}>
                {checkResult.n.toLocaleString()}
              </div>
              <div className={`text-lg font-semibold mt-2 ${checkResult.prime ? "text-green-600" : "text-red-600"}`}>
                is {checkResult.prime ? "" : "NOT "}a prime number
              </div>
              {!checkResult.prime && checkResult.n > 1 && (
                <div className="text-sm text-gray-500 mt-1">
                  It has factors other than 1 and itself
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-blue-50 rounded-lg p-3 text-center">
                <div className="text-xs text-blue-600 font-medium mb-1">Previous Prime</div>
                <div className="text-xl font-bold text-blue-800">
                  {checkResult.prevPrime !== null ? checkResult.prevPrime.toLocaleString() : "—"}
                </div>
              </div>
              <div className="bg-purple-50 rounded-lg p-3 text-center">
                <div className="text-xs text-purple-600 font-medium mb-1">Next Prime</div>
                <div className="text-xl font-bold text-purple-800">{checkResult.nextPrime.toLocaleString()}</div>
              </div>
            </div>

            {!checkResult.prime && checkResult.n > 1 && (
              <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-600">
                <strong>Tip:</strong> Switch to the "Prime Factorization" tab to see the prime factors of {checkResult.n.toLocaleString()}.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab B: Sieve */}
      {tab === "sieve" && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Find All Primes Up To N</h2>
            <div>
              <div className="flex justify-between items-center mb-3">
                <label className="text-sm font-semibold text-gray-700">Upper Limit (N)</label>
                <span className="text-sm font-semibold text-blue-600">{sieveLimit}</span>
              </div>
              <input
                type="range"
                min={10}
                max={1000}
                step={10}
                value={sieveLimit}
                onChange={(e) => setSieveLimit(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>10</span>
                <span>1,000</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-gray-700">
                Found <span className="text-blue-600">{sieveResult.primes.length}</span> prime{sieveResult.primes.length !== 1 ? "s" : ""} up to {sieveLimit}
              </h3>
              <div className="flex items-center gap-3 text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded bg-blue-500 inline-block"></span> Prime
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded bg-gray-100 inline-block border border-gray-200"></span> Composite
                </span>
              </div>
            </div>

            {sieveResult.showGrid ? (
              <div className="grid gap-1" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(40px, 1fr))" }}>
                {Array.from({ length: sieveLimit - 1 }, (_, i) => i + 2).map((n) => (
                  <div
                    key={n}
                    className={`aspect-square flex items-center justify-center text-xs font-medium rounded ${
                      sieveResult.sieve[n]
                        ? "bg-blue-500 text-white"
                        : "bg-gray-100 text-gray-400"
                    }`}
                  >
                    {n}
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {sieveResult.primes.map((p) => (
                  <span key={p} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded">
                    {p}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab C: Factorization */}
      {tab === "factorize" && (
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 space-y-6">
            <h2 className="text-lg font-semibold text-gray-800">Enter a Number to Factorize</h2>
            <div>
              <div className="flex justify-between items-center mb-3">
                <label className="text-sm font-semibold text-gray-700">Number</label>
                <input
                  type="number"
                  min={2}
                  max={999999}
                  value={factInput}
                  onChange={(e) => {
                    const v = parseInt(e.target.value);
                    if (!isNaN(v) && v >= 2) setFactInput(Math.min(v, 999999));
                  }}
                  className="w-32 px-3 py-1.5 text-right border border-gray-300 rounded-md text-sm font-semibold text-blue-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <input
                type="range"
                min={2}
                max={1000}
                step={1}
                value={Math.min(factInput, 1000)}
                onChange={(e) => setFactInput(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>2</span>
                <span>1,000</span>
              </div>
              <p className="text-xs text-gray-400 mt-2">Type any number up to 999,999 in the field above</p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 space-y-5">
            <h2 className="text-lg font-semibold text-gray-800">Factorization Result</h2>

            {factResult ? (
              <>
                <div className="bg-blue-50 rounded-xl p-5 text-center">
                  <div className="text-sm text-blue-600 mb-1">Prime Factorization</div>
                  <div className="text-2xl font-bold text-blue-900 break-all">
                    {factResult.n.toLocaleString()} = {factResult.expression}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="text-sm font-semibold text-gray-700">Prime Factors</div>
                  {Array.from(factResult.factors.entries()).map(([prime, exp]) => (
                    <div key={prime} className="flex items-center justify-between bg-gray-50 rounded-lg px-4 py-2.5">
                      <div className="flex items-center gap-3">
                        <span className="w-8 h-8 bg-blue-500 text-white text-sm font-bold rounded-lg flex items-center justify-center">
                          {prime}
                        </span>
                        <span className="text-sm text-gray-700">appears {exp} time{exp !== 1 ? "s" : ""}</span>
                      </div>
                      <span className="text-sm font-semibold text-gray-800">
                        {prime}{exp > 1 ? superscript(exp) : ""}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="bg-green-50 rounded-lg p-3 text-center">
                  <div className="text-xs text-green-600 font-medium">Total Number of Divisors</div>
                  <div className="text-3xl font-bold text-green-700 mt-1">{factResult.divisors}</div>
                  <div className="text-xs text-green-600 mt-1">
                    Formula: {Array.from(factResult.factors.entries()).map(([, e]) => `(${e}+1)`).join(" × ")} = {factResult.divisors}
                  </div>
                </div>
              </>
            ) : (
              <div className="text-gray-500 text-sm">Enter a number 2 or greater.</div>
            )}
          </div>
        </div>
      )}

      <CalculatorLayout
        title="Prime Number Checker"
        description="Check primality, find primes in a range, and compute prime factorizations"
        explanation={explanation}
        faqs={faqs}
        relatedCalculators={relatedCalculators}
      >
        <div></div>
      </CalculatorLayout>
    </div>
  );
}
