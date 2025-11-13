"use client";

import { useState, useEffect } from "react";
import Breadcrumbs from "@/components/Breadcrumbs";
import CalculatorLayout from "@/components/CalculatorLayout";

export default function BinaryConverter() {
  const [decimal, setDecimal] = useState("");
  const [binary, setBinary] = useState("");
  const [hexadecimal, setHexadecimal] = useState("");
  const [octal, setOctal] = useState("");
  const [activeInput, setActiveInput] = useState<"decimal" | "binary" | "hex" | "octal">("decimal");

  useEffect(() => {
    const recent = JSON.parse(localStorage.getItem("recentCalculators") || "[]");
    const updated = ["binary-converter", ...recent.filter((id: string) => id !== "binary-converter")].slice(0, 10);
    localStorage.setItem("recentCalculators", JSON.stringify(updated));
  }, []);

  const convertFromDecimal = (value: string) => {
    const num = parseInt(value, 10);
    if (!isNaN(num) && num >= 0) {
      setDecimal(value);
      setBinary(num.toString(2));
      setHexadecimal(num.toString(16).toUpperCase());
      setOctal(num.toString(8));
    } else if (value === "") {
      clearAll();
    }
  };

  const convertFromBinary = (value: string) => {
    if (/^[01]*$/.test(value)) {
      const num = parseInt(value, 2);
      if (!isNaN(num)) {
        setBinary(value);
        setDecimal(num.toString());
        setHexadecimal(num.toString(16).toUpperCase());
        setOctal(num.toString(8));
      }
    } else if (value === "") {
      clearAll();
    }
  };

  const convertFromHex = (value: string) => {
    if (/^[0-9A-Fa-f]*$/.test(value)) {
      const num = parseInt(value, 16);
      if (!isNaN(num)) {
        setHexadecimal(value.toUpperCase());
        setDecimal(num.toString());
        setBinary(num.toString(2));
        setOctal(num.toString(8));
      }
    } else if (value === "") {
      clearAll();
    }
  };

  const convertFromOctal = (value: string) => {
    if (/^[0-7]*$/.test(value)) {
      const num = parseInt(value, 8);
      if (!isNaN(num)) {
        setOctal(value);
        setDecimal(num.toString());
        setBinary(num.toString(2));
        setHexadecimal(num.toString(16).toUpperCase());
      }
    } else if (value === "") {
      clearAll();
    }
  };

  const clearAll = () => {
    setDecimal("");
    setBinary("");
    setHexadecimal("");
    setOctal("");
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumbs
        items={[
          { label: "Developer Tools", href: "/developer-calculators" },
          { label: "Binary Converter", href: "/calculators/developer/binary-converter" },
        ]}
      />

      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Binary Converter</h1>
        <p className="text-base text-gray-600">
          Convert between binary, decimal, hexadecimal, and octal number systems instantly
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200 mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Decimal */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Decimal (Base-10)
            </label>
            <input
              type="text"
              value={decimal}
              onChange={(e) => {
                setActiveInput("decimal");
                convertFromDecimal(e.target.value);
              }}
              className={`w-full px-3 py-2 border-2 rounded-lg focus:outline-none font-mono text-sm ${
                activeInput === "decimal"
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-300 bg-white"
              }`}
              placeholder="e.g., 255"
            />
            <p className="text-xs text-gray-500 mt-1">0-9</p>
          </div>

          {/* Binary */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Binary (Base-2)
            </label>
            <input
              type="text"
              value={binary}
              onChange={(e) => {
                setActiveInput("binary");
                convertFromBinary(e.target.value);
              }}
              className={`w-full px-3 py-2 border-2 rounded-lg focus:outline-none font-mono text-sm ${
                activeInput === "binary"
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-300 bg-white"
              }`}
              placeholder="e.g., 11111111"
            />
            <p className="text-xs text-gray-500 mt-1">0-1</p>
          </div>

          {/* Hexadecimal */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Hexadecimal (Base-16)
            </label>
            <input
              type="text"
              value={hexadecimal}
              onChange={(e) => {
                setActiveInput("hex");
                convertFromHex(e.target.value);
              }}
              className={`w-full px-3 py-2 border-2 rounded-lg focus:outline-none font-mono text-sm ${
                activeInput === "hex"
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-300 bg-white"
              }`}
              placeholder="e.g., FF"
            />
            <p className="text-xs text-gray-500 mt-1">0-9, A-F</p>
          </div>

          {/* Octal */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Octal (Base-8)
            </label>
            <input
              type="text"
              value={octal}
              onChange={(e) => {
                setActiveInput("octal");
                convertFromOctal(e.target.value);
              }}
              className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none font-mono ${
                activeInput === "octal"
                  ? "border-primary-500 bg-primary-50"
                  : "border-gray-300 bg-white"
              }`}
              placeholder="e.g., 377"
            />
            <p className="text-xs text-gray-500 mt-1">0-7</p>
          </div>
        </div>

        <button
          onClick={clearAll}
          className="w-full mt-4 bg-red-100 text-red-600 py-2 rounded-lg font-semibold hover:bg-red-200 transition-colors text-sm"
        >
          Clear All
        </button>
      </div>

      {/* Explanation Section */}
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200 mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">How It Works</h2>
        <div className="space-y-4 text-sm text-gray-700">
          <p>
            This converter helps you switch between different number systems commonly used in programming:
          </p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li><strong>Binary (Base-2):</strong> Uses only 0 and 1, fundamental to computer systems</li>
            <li><strong>Decimal (Base-10):</strong> The standard number system we use daily</li>
            <li><strong>Hexadecimal (Base-16):</strong> Uses 0-9 and A-F, commonly used for colors and memory addresses</li>
            <li><strong>Octal (Base-8):</strong> Uses 0-7, sometimes used in Unix file permissions</li>
          </ul>
          <p className="mt-4">
            Enter a value in any field, and the converter will automatically calculate and display the equivalent values in all other number systems.
          </p>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">What is binary used for?</h3>
            <p className="text-sm text-gray-700">Binary is the fundamental language of computers. Every piece of data in a computer is ultimately stored and processed as binary (0s and 1s), representing electrical states of off and on.</p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Why is hexadecimal important in programming?</h3>
            <p className="text-sm text-gray-700">Hexadecimal is compact and human-readable. It's commonly used for representing colors in web design (#FF5733), memory addresses, and debugging. Each hex digit represents exactly 4 binary bits.</p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">How do I convert binary to decimal manually?</h3>
            <p className="text-sm text-gray-700">Multiply each binary digit by 2 raised to its position (starting from 0 on the right), then sum the results. For example: 1011 = (1×2³) + (0×2²) + (1×2¹) + (1×2⁰) = 8 + 0 + 2 + 1 = 11</p>
          </div>
        </div>
      </div>
    </div>
  );
}
