"use client";

import { useState, useEffect } from "react";
import Breadcrumbs from "@/components/Breadcrumbs";

export default function ScientificCalculator() {
  const [display, setDisplay] = useState("0");
  const [equation, setEquation] = useState("");
  const [isRadian, setIsRadian] = useState(true);

  useEffect(() => {
    const recent = JSON.parse(localStorage.getItem("recentCalculators") || "[]");
    const updated = ["scientific", ...recent.filter((id: string) => id !== "scientific")].slice(0, 10);
    localStorage.setItem("recentCalculators", JSON.stringify(updated));
  }, []);

  const handleNumber = (num: string) => {
    if (display === "0" || display === "Error") {
      setDisplay(num);
    } else {
      setDisplay(display + num);
    }
  };

  const handleOperator = (op: string) => {
    if (display === "Error") return;
    setDisplay(display + op);
  };

  const handleFunction = (func: string) => {
    try {
      let result;
      const value = parseFloat(display);
      
      if (isNaN(value)) {
        setDisplay("Error");
        return;
      }

      const angleValue = isRadian ? value : (value * Math.PI) / 180;

      switch (func) {
        case "sin":
          result = Math.sin(angleValue);
          break;
        case "cos":
          result = Math.cos(angleValue);
          break;
        case "tan":
          result = Math.tan(angleValue);
          break;
        case "log":
          result = Math.log10(value);
          break;
        case "ln":
          result = Math.log(value);
          break;
        case "sqrt":
          result = Math.sqrt(value);
          break;
        case "square":
          result = value * value;
          break;
        case "cube":
          result = value * value * value;
          break;
        case "reciprocal":
          result = 1 / value;
          break;
        case "factorial":
          result = factorial(Math.floor(value));
          break;
        case "exp":
          result = Math.exp(value);
          break;
        case "abs":
          result = Math.abs(value);
          break;
        default:
          return;
      }
      
      if (isNaN(result) || !isFinite(result)) {
        setDisplay("Error");
      } else {
        const rounded = Math.round(result * 1000000000) / 1000000000;
        setDisplay(rounded.toString());
      }
    } catch (error) {
      setDisplay("Error");
    }
  };

  const factorial = (n: number): number => {
    if (n < 0 || !Number.isInteger(n)) return NaN;
    if (n === 0 || n === 1) return 1;
    if (n > 170) return Infinity;
    let result = 1;
    for (let i = 2; i <= n; i++) {
      result *= i;
    }
    return result;
  };

  const calculate = () => {
    try {
      if (display === "Error") return;
      
      let expression = display
        .replace(/×/g, "*")
        .replace(/÷/g, "/")
        .replace(/\^/g, "**");
      
      const result = Function('"use strict"; return (' + expression + ')')();
      
      if (isNaN(result) || !isFinite(result)) {
        setDisplay("Error");
      } else {
        const rounded = Math.round(result * 1000000000) / 1000000000;
        setDisplay(rounded.toString());
      }
    } catch (error) {
      setDisplay("Error");
    }
  };

  const clear = () => {
    setDisplay("0");
    setEquation("");
  };
  
  const backspace = () => {
    if (display === "Error") {
      setDisplay("0");
    } else {
      setDisplay(display.length > 1 ? display.slice(0, -1) : "0");
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumbs
        items={[
          { label: "Math Calculators", href: "/math-calculators" },
          { label: "Scientific Calculator", href: "/calculators/math/scientific-calculator" },
        ]}
      />

      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Scientific Calculator</h1>
        <p className="text-base text-gray-600">
          Advanced mathematical functions for scientific calculations
        </p>
      </div>

      {/* Calculator - Modern Design */}
      <div className="bg-slate-800 rounded-2xl shadow-2xl p-6 border-8 border-slate-700 mb-6">
        {/* Display */}
        <div className="bg-slate-900 rounded-xl p-6 mb-4 min-h-[100px] shadow-inner border-4 border-slate-950">
          <div className="text-right">
            <div className="text-5xl font-mono text-green-400 break-all tracking-wide font-bold">
              {display}
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Calculator */}
          <div className="lg:col-span-2 space-y-3">
            {/* Mode Toggle */}
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setIsRadian(true)}
                className={`py-3 px-4 rounded-lg font-bold transition-all text-sm ${
                  isRadian 
                    ? "bg-blue-600 text-white shadow-lg" 
                    : "bg-slate-600 text-slate-300 hover:bg-slate-500"
                }`}
              >
                RAD
              </button>
              <button
                onClick={() => setIsRadian(false)}
                className={`py-3 px-4 rounded-lg font-bold transition-all text-sm ${
                  !isRadian 
                    ? "bg-blue-600 text-white shadow-lg" 
                    : "bg-slate-600 text-slate-300 hover:bg-slate-500"
                }`}
              >
                DEG
              </button>
            </div>

            {/* Scientific Functions */}
            <div className="bg-slate-700 rounded-xl p-3">
              <div className="grid grid-cols-5 gap-2">
                <button onClick={() => handleFunction("sin")} className="calc-btn-sci">sin</button>
                <button onClick={() => handleFunction("cos")} className="calc-btn-sci">cos</button>
                <button onClick={() => handleFunction("tan")} className="calc-btn-sci">tan</button>
                <button onClick={() => handleFunction("log")} className="calc-btn-sci">log</button>
                <button onClick={() => handleFunction("ln")} className="calc-btn-sci">ln</button>
                
                <button onClick={() => handleFunction("sqrt")} className="calc-btn-sci">√x</button>
                <button onClick={() => handleFunction("square")} className="calc-btn-sci">x²</button>
                <button onClick={() => handleFunction("cube")} className="calc-btn-sci">x³</button>
                <button onClick={() => handleOperator("^")} className="calc-btn-sci">xʸ</button>
                <button onClick={() => handleFunction("exp")} className="calc-btn-sci">eˣ</button>
                
                <button onClick={() => handleNumber("(")} className="calc-btn-sci">(</button>
                <button onClick={() => handleNumber(")")} className="calc-btn-sci">)</button>
                <button onClick={() => handleFunction("factorial")} className="calc-btn-sci">n!</button>
                <button onClick={() => handleFunction("abs")} className="calc-btn-sci">|x|</button>
                <button onClick={() => handleNumber(Math.PI.toString())} className="calc-btn-sci">π</button>
              </div>
            </div>

            {/* Basic Calculator */}
            <div className="bg-slate-700 rounded-xl p-3">
              <div className="grid grid-cols-4 gap-2">
                <button onClick={clear} className="calc-btn-func col-span-2">AC</button>
                <button onClick={backspace} className="calc-btn-func text-2xl">⌫</button>
                <button onClick={() => handleOperator("÷")} className="calc-btn-op">÷</button>

                <button onClick={() => handleNumber("7")} className="calc-btn-num">7</button>
                <button onClick={() => handleNumber("8")} className="calc-btn-num">8</button>
                <button onClick={() => handleNumber("9")} className="calc-btn-num">9</button>
                <button onClick={() => handleOperator("×")} className="calc-btn-op">×</button>

                <button onClick={() => handleNumber("4")} className="calc-btn-num">4</button>
                <button onClick={() => handleNumber("5")} className="calc-btn-num">5</button>
                <button onClick={() => handleNumber("6")} className="calc-btn-num">6</button>
                <button onClick={() => handleOperator("-")} className="calc-btn-op">−</button>

                <button onClick={() => handleNumber("1")} className="calc-btn-num">1</button>
                <button onClick={() => handleNumber("2")} className="calc-btn-num">2</button>
                <button onClick={() => handleNumber("3")} className="calc-btn-num">3</button>
                <button onClick={() => handleOperator("+")} className="calc-btn-op">+</button>

                <button onClick={() => handleNumber("0")} className="calc-btn-num col-span-2">0</button>
                <button onClick={() => handleNumber(".")} className="calc-btn-num text-2xl">•</button>
                <button onClick={calculate} className="calc-btn-eq">=</button>
              </div>
            </div>
          </div>

          {/* Quick Reference Sidebar */}
          <div className="lg:col-span-1">
            <div className="space-y-3">
              <div className="bg-blue-900 border-2 border-blue-700 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                  <h3 className="font-bold text-blue-100 text-sm">Trigonometric</h3>
                </div>
                <ul className="text-xs text-blue-200 space-y-1">
                  <li><strong>sin, cos, tan</strong></li>
                  <li className="opacity-75">Use RAD/DEG toggle</li>
                </ul>
              </div>

              <div className="bg-green-900 border-2 border-green-700 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 rounded-full bg-green-400"></div>
                  <h3 className="font-bold text-green-100 text-sm">Logarithms</h3>
                </div>
                <ul className="text-xs text-green-200 space-y-1">
                  <li><strong>log:</strong> Base-10</li>
                  <li><strong>ln:</strong> Natural</li>
                </ul>
              </div>

              <div className="bg-purple-900 border-2 border-purple-700 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 rounded-full bg-purple-400"></div>
                  <h3 className="font-bold text-purple-100 text-sm">Powers & Roots</h3>
                </div>
                <ul className="text-xs text-purple-200 space-y-1">
                  <li><strong>√x</strong> Square root</li>
                  <li><strong>x²</strong> Square</li>
                  <li><strong>x³</strong> Cube</li>
                  <li><strong>xʸ</strong> Power (use ^)</li>
                </ul>
              </div>

              <div className="bg-orange-900 border-2 border-orange-700 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 rounded-full bg-orange-400"></div>
                  <h3 className="font-bold text-orange-100 text-sm">Special</h3>
                </div>
                <ul className="text-xs text-orange-200 space-y-1">
                  <li><strong>n!</strong> Factorial</li>
                  <li><strong>|x|</strong> Absolute</li>
                  <li><strong>π</strong> Pi (3.14159)</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Info Section */}
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200 mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">How to Use</h2>
        <div className="space-y-3 text-sm text-gray-700">
          <p><strong className="text-blue-600">Basic Operations:</strong> Click number buttons and operators (+, −, ×, ÷) to build expressions. Press = to calculate.</p>
          <p><strong className="text-green-600">Scientific Functions:</strong> Enter a number first, then click the function button (sin, cos, sqrt, etc.) to apply it.</p>
          <p><strong className="text-purple-600">Angle Mode:</strong> Switch between RAD (radians) and DEG (degrees) for trigonometric functions.</p>
          <p><strong className="text-orange-600">Power:</strong> Use the xʸ button or type ^ between numbers. Example: 2^3 = 8</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
        <h2 className="text-xl font-bold text-gray-900 mb-4">FAQ</h2>
        <div className="space-y-3 text-sm">
          <div>
            <p className="font-semibold text-gray-900">What's the difference between RAD and DEG?</p>
            <p className="text-gray-600">RAD (radians) and DEG (degrees) are units for measuring angles. Use DEG for standard angles (0-360°), RAD for calculus.</p>
          </div>
          <div>
            <p className="font-semibold text-gray-900">How do I calculate powers?</p>
            <p className="text-gray-600">Use x² for square, x³ for cube, or xʸ (^) for custom powers. Example: 2^3 = 8</p>
          </div>
          <div>
            <p className="font-semibold text-gray-900">What's the difference between log and ln?</p>
            <p className="text-gray-600">log is base-10 logarithm, ln is natural logarithm (base-e). ln is used more in calculus.</p>
          </div>
        </div>
      </div>

      <style jsx>{`
        .calc-btn-num {
          @apply bg-slate-600 text-white py-4 rounded-lg font-bold text-2xl hover:bg-slate-500 active:bg-slate-400 transition-all shadow-md;
        }
        .calc-btn-op {
          @apply bg-orange-600 text-white py-4 rounded-lg font-bold text-2xl hover:bg-orange-500 active:bg-orange-700 transition-all shadow-md;
        }
        .calc-btn-eq {
          @apply bg-green-600 text-white py-4 rounded-lg font-bold text-2xl hover:bg-green-500 active:bg-green-700 transition-all shadow-md;
        }
        .calc-btn-func {
          @apply bg-red-600 text-white py-4 rounded-lg font-bold text-lg hover:bg-red-500 active:bg-red-700 transition-all shadow-md;
        }
        .calc-btn-sci {
          @apply bg-slate-600 text-purple-200 py-3 rounded-lg font-semibold text-sm hover:bg-slate-500 active:bg-slate-400 transition-all;
        }
      `}</style>
    </div>
  );
}
