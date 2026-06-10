"use client";

import { useState, useEffect, useRef } from "react";
import Breadcrumbs from "@/components/Breadcrumbs";
import CalculatorLayout from "@/components/CalculatorLayout";

interface Step {
  expression: string;
  result: string;
}

// Safe expression evaluator
function safeEval(expr: string): string {
  // Replace common math notation
  let clean = expr
    .replace(/×/g, "*")
    .replace(/÷/g, "/")
    .replace(/\^/g, "**")
    .replace(/π/g, String(Math.PI))
    .replace(/pi/gi, String(Math.PI))
    .replace(/e(?![a-zA-Z])/g, String(Math.E))
    .replace(/sqrt\(/g, "Math.sqrt(")
    .replace(/√\(/g, "Math.sqrt(")
    .replace(/√(\d+)/g, "Math.sqrt($1)")
    .replace(/sin\(/g, "Math.sin(")
    .replace(/cos\(/g, "Math.cos(")
    .replace(/tan\(/g, "Math.tan(")
    .replace(/log\(/g, "Math.log10(")
    .replace(/ln\(/g, "Math.log(")
    .replace(/abs\(/g, "Math.abs(")
    .replace(/ceil\(/g, "Math.ceil(")
    .replace(/floor\(/g, "Math.floor(")
    .replace(/round\(/g, "Math.round(")
    .replace(/pow\(([^,]+),([^)]+)\)/g, "Math.pow($1,$2)")
    .trim();

  // Validate: only allow safe characters
  if (/[^0-9+\-*/%.() Math\n\r\t,!]/.test(clean.replace(/Math\.(sqrt|sin|cos|tan|log10|log|abs|ceil|floor|round|pow|PI|E)/g, ""))) {
    throw new Error("Invalid characters");
  }

  // eslint-disable-next-line no-new-func
  const result = Function(`"use strict"; return (${clean})`)();
  if (typeof result !== "number") throw new Error("Not a number");
  if (!isFinite(result)) return result > 0 ? "∞" : result < 0 ? "-∞" : "NaN";

  // Format nicely
  if (Number.isInteger(result)) return result.toString();
  return parseFloat(result.toPrecision(10)).toString();
}

const EXAMPLES = [
  "2 + 3 × 4",
  "(15 + 5) / 4",
  "√(144)",
  "sin(π/2)",
  "2^10",
  "log(1000)",
  "25% × 80",
];

export default function MathSolver() {
  const [input, setInput] = useState("2 + 3 × 4");
  const [history, setHistory] = useState<Step[]>([]);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const recent = JSON.parse(localStorage.getItem("recentCalculators") || "[]");
    const updated = ["math-solver", ...recent.filter((id: string) => id !== "math-solver")].slice(0, 10);
    localStorage.setItem("recentCalculators", JSON.stringify(updated));
  }, []);

  const solve = (expr?: string) => {
    const expression = (expr ?? input).trim();
    if (!expression) return;
    setError("");

    // Handle percentage: e.g. "25% × 80" → "25/100 * 80"
    const cleaned = expression.replace(/(\d+(?:\.\d+)?)%/g, "($1/100)");

    try {
      const result = safeEval(cleaned);
      const step: Step = { expression, result };
      setHistory(prev => [step, ...prev.slice(0, 19)]);
      if (!expr) setInput("");
    } catch {
      setError("Could not evaluate. Check syntax and try again.");
    }
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") solve();
  };

  const insert = (char: string) => {
    setInput(prev => prev + char);
    inputRef.current?.focus();
  };

  const BUTTONS = [
    ["7", "8", "9", "÷", "sqrt("],
    ["4", "5", "6", "×", "^"],
    ["1", "2", "3", "-", "π"],
    ["0", ".", "(", ")", "+"],
    ["sin(", "cos(", "tan(", "log(", "ln("],
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumbs
        items={[
          { label: "Math Calculators", href: "/math-calculators" },
          { label: "Math Solver", href: "/calculators/math/math-solver" },
        ]}
      />
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Math Solver</h1>
        <p className="text-base text-gray-600">Solve expressions with arithmetic, algebra, trigonometry, and more</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Input panel */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200 space-y-4">
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-2">Enter Expression</label>
            <div className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => { setInput(e.target.value); setError(""); }}
                onKeyDown={handleKey}
                placeholder="e.g. 2 + 3 × 4"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg font-mono text-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <button onClick={() => solve()}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors">
                Solve
              </button>
            </div>
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          </div>

          {/* Keypad */}
          <div className="grid grid-cols-5 gap-1.5">
            {BUTTONS.flat().map((btn) => (
              <button key={btn} onClick={() => insert(btn)}
                className="py-2 text-sm font-mono font-medium bg-gray-100 hover:bg-purple-100 hover:text-purple-700 rounded-lg border border-gray-200 transition-colors">
                {btn}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <button onClick={() => setInput(prev => prev.slice(0, -1))}
              className="flex-1 py-2 text-sm font-medium bg-orange-50 hover:bg-orange-100 text-orange-700 rounded-lg border border-orange-200 transition-colors">
              ⌫ Backspace
            </button>
            <button onClick={() => { setInput(""); setError(""); }}
              className="flex-1 py-2 text-sm font-medium bg-red-50 hover:bg-red-100 text-red-700 rounded-lg border border-red-200 transition-colors">
              Clear
            </button>
          </div>

          {/* Examples */}
          <div>
            <div className="text-xs text-gray-500 mb-2">Quick examples:</div>
            <div className="flex flex-wrap gap-1.5">
              {EXAMPLES.map(ex => (
                <button key={ex} onClick={() => { setInput(ex); solve(ex); }}
                  className="text-xs px-2 py-1 bg-purple-50 text-purple-700 rounded border border-purple-200 hover:bg-purple-100 font-mono">
                  {ex}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* History panel */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-sm font-semibold text-gray-700">Results</h2>
            {history.length > 0 && (
              <button onClick={() => setHistory([])} className="text-xs text-red-500 hover:text-red-700">Clear history</button>
            )}
          </div>
          {history.length === 0 ? (
            <div className="text-center text-gray-400 text-sm py-12">
              Type an expression and press Solve or Enter
            </div>
          ) : (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {history.map((step, i) => (
                <div key={i} className="bg-gray-50 rounded-lg p-3 border border-gray-100 cursor-pointer hover:border-purple-300"
                  onClick={() => setInput(step.expression)}>
                  <div className="font-mono text-sm text-gray-600">{step.expression}</div>
                  <div className="font-mono text-xl font-bold text-purple-600">= {step.result}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <CalculatorLayout title="" description=""
        explanation={<div>
          <p className="mb-3">This math solver evaluates expressions including arithmetic, powers, roots, and trig functions. Type your expression and press Enter or Solve.</p>
          <div className="text-sm text-gray-600 space-y-1">
            <p><strong>Supported:</strong> + − × ÷ ^ √ sin cos tan log ln π e abs</p>
            <p><strong>Tip:</strong> Use parentheses to control order of operations</p>
          </div>
        </div>}
        faqs={[
          { question: "Does this solve equations like x + 2 = 5?", answer: "This version solves numerical expressions. For algebraic equation solving (finding x), use the Scientific Calculator or a CAS tool like Wolfram Alpha." },
          { question: "How do I enter trigonometry?", answer: "Type sin(, cos(, or tan( followed by the angle in radians. For degrees, convert first: 90° = π/2 radians. Use π for pi." },
          { question: "How do I calculate percentages?", answer: "Type 25% × 80 to get 20 (25% of 80). Percentages are automatically converted to decimals." },
        ]}
        relatedCalculators={[
          { name: "Scientific Calculator", href: "/calculators/math/scientific-calculator" },
          { name: "Fraction Calculator", href: "/calculators/math/fraction-calculator" },
          { name: "Percentage Calculator", href: "/calculators/math/percentage-calculator" },
        ]}
      >
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900">Supported Functions</h2>
          <div className="grid sm:grid-cols-2 gap-2 text-sm">
            {[["sqrt(x)", "Square root"], ["sin/cos/tan(x)", "Trig (radians)"], ["log(x)", "Base-10 log"], ["ln(x)", "Natural log"], ["x^n", "Powers"], ["π, e", "Constants"], ["abs(x)", "Absolute value"], ["25%", "Percentages"]].map(([fn, desc]) => (
              <div key={fn} className="bg-gray-50 rounded p-2 flex justify-between">
                <code className="text-purple-700 font-mono">{fn}</code>
                <span className="text-gray-600">{desc}</span>
              </div>
            ))}
          </div>
        </div>
      </CalculatorLayout>
    </div>
  );
}
