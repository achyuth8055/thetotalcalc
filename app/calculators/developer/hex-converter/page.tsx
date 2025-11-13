"use client";

import { useState, useEffect } from "react";
import Breadcrumbs from "@/components/Breadcrumbs";
import CalculatorLayout from "@/components/CalculatorLayout";

export default function HexConverterCalculator() {
  const [hexValue, setHexValue] = useState("");
  const [decimalValue, setDecimalValue] = useState("");
  const [binaryValue, setBinaryValue] = useState("");
  const [octalValue, setOctalValue] = useState("");

  useEffect(() => {
    const recent = JSON.parse(localStorage.getItem("recentCalculators") || "[]");
    const updated = ["hex-converter", ...recent.filter((id: string) => id !== "hex-converter")].slice(0, 10);
    localStorage.setItem("recentCalculators", JSON.stringify(updated));
  }, []);

  const convertFromHex = (hex: string) => {
    setHexValue(hex);
    if (hex.trim() === "") {
      setDecimalValue("");
      setBinaryValue("");
      setOctalValue("");
      return;
    }

    try {
      const decimal = parseInt(hex, 16);
      if (!isNaN(decimal)) {
        setDecimalValue(decimal.toString());
        setBinaryValue(decimal.toString(2));
        setOctalValue(decimal.toString(8));
      }
    } catch (e) {
      setDecimalValue("Invalid");
      setBinaryValue("Invalid");
      setOctalValue("Invalid");
    }
  };

  const convertFromDecimal = (dec: string) => {
    setDecimalValue(dec);
    if (dec.trim() === "") {
      setHexValue("");
      setBinaryValue("");
      setOctalValue("");
      return;
    }

    const decimal = parseInt(dec);
    if (!isNaN(decimal)) {
      setHexValue(decimal.toString(16).toUpperCase());
      setBinaryValue(decimal.toString(2));
      setOctalValue(decimal.toString(8));
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumbs
        items={[
          { label: "Developer Tools", href: "/developer-calculators" },
          { label: "Hex Converter", href: "/calculators/developer/hex-converter" },
        ]}
      />

      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Hexadecimal Converter</h1>
        <p className="text-base text-gray-600">
          Convert between hexadecimal, decimal, binary, and octal number systems
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200 mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Hexadecimal
              <span className="text-xs font-normal text-gray-500 ml-2">(0-9, A-F)</span>
            </label>
            <input
              type="text"
              value={hexValue}
              onChange={(e) => convertFromHex(e.target.value.toUpperCase())}
              className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
              placeholder="e.g., FF"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Decimal
              <span className="text-xs font-normal text-gray-500 ml-2">(0-9)</span>
            </label>
            <input
              type="text"
              value={decimalValue}
              onChange={(e) => convertFromDecimal(e.target.value)}
              className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
              placeholder="e.g., 255"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Binary
              <span className="text-xs font-normal text-gray-500 ml-2">(0-1)</span>
            </label>
            <input
              type="text"
              value={binaryValue}
              readOnly
              className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg bg-gray-50 font-mono text-sm"
              placeholder="Binary result"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Octal
              <span className="text-xs font-normal text-gray-500 ml-2">(0-7)</span>
            </label>
            <input
              type="text"
              value={octalValue}
              readOnly
              className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg bg-gray-50 font-mono text-sm"
              placeholder="Octal result"
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200 mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">How It Works</h2>
        <div className="space-y-4 text-sm text-gray-700">
          <p>
            <strong className="text-blue-600">Hexadecimal (Base-16):</strong> Uses digits 0-9 and letters A-F. Commonly used in programming and web development (e.g., color codes #FF5733).
          </p>
          <p>
            <strong className="text-green-600">Decimal (Base-10):</strong> Standard number system with digits 0-9 that we use in everyday life.
          </p>
          <p>
            <strong className="text-purple-600">Binary (Base-2):</strong> Computer language using only 0 and 1. Each digit is called a "bit".
          </p>
          <p>
            <strong className="text-orange-600">Octal (Base-8):</strong> Uses digits 0-7. Sometimes used in computing for file permissions.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
        <h2 className="text-xl font-bold text-gray-900 mb-4">FAQ</h2>
        <div className="space-y-3 text-sm">
          <div>
            <p className="font-semibold text-gray-900">What is hexadecimal used for?</p>
            <p className="text-gray-600">Hexadecimal is used in web colors, memory addresses, and data representation in programming.</p>
          </div>
          <div>
            <p className="font-semibold text-gray-900">How do I convert hex to decimal?</p>
            <p className="text-gray-600">Simply enter the hex value and the decimal equivalent will be calculated automatically.</p>
          </div>
          <div>
            <p className="font-semibold text-gray-900">What does FF mean in hex?</p>
            <p className="text-gray-600">FF in hexadecimal equals 255 in decimal, the maximum value for a single byte.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
