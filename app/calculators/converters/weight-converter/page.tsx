"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import CalculatorLayout from "@/components/CalculatorLayout";

const weightUnits = [
  { id: "kg", name: "Kilogram (kg)", toKg: 1 },
  { id: "g", name: "Gram (g)", toKg: 0.001 },
  { id: "mg", name: "Milligram (mg)", toKg: 0.000001 },
  { id: "lb", name: "Pound (lb)", toKg: 0.453592 },
  { id: "oz", name: "Ounce (oz)", toKg: 0.0283495 },
  { id: "ton", name: "Metric Ton (t)", toKg: 1000 },
  { id: "stone", name: "Stone (st)", toKg: 6.35029 },
];

export default function WeightConverterPage() {
  const [fromValue, setFromValue] = useState<string>("1");
  const [fromUnit, setFromUnit] = useState<string>("lb");
  const [toUnit, setToUnit] = useState<string>("kg");
  const [result, setResult] = useState<number>(0);

  useEffect(() => {
    const value = parseFloat(fromValue) || 0;
    const fromUnitData = weightUnits.find(u => u.id === fromUnit);
    const toUnitData = weightUnits.find(u => u.id === toUnit);
    
    if (fromUnitData && toUnitData) {
      const kgValue = value * fromUnitData.toKg;
      const convertedValue = kgValue / toUnitData.toKg;
      setResult(convertedValue);
    }
  }, [fromValue, fromUnit, toUnit]);

  const handleSwap = () => {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
  };

  return (
    <CalculatorLayout
      title="Weight Converter"
      description="Convert between different weight units: kg, lb, g, oz, ton, stone and more"
    >
      <Breadcrumbs
        items={[
          { label: "Converters", href: "/converters" },
          { label: "Weight Converter", href: "/calculators/converters/weight-converter" },
        ]}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-4xl font-bold text-gray-900">Weight Converter</h1>
            <span className="text-4xl">⚖️</span>
          </div>
          <p className="text-lg text-gray-600">
            Convert between kilograms, pounds, ounces, grams, and more
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 border border-gray-200">
          <div className="space-y-6">
            {/* From Value */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">From</label>
              <div className="grid grid-cols-3 gap-3">
                <input
                  type="number"
                  value={fromValue}
                  onChange={(e) => setFromValue(e.target.value)}
                  className="col-span-2 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
                  placeholder="Enter value"
                />
                <select
                  value={fromUnit}
                  onChange={(e) => setFromUnit(e.target.value)}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base bg-white"
                >
                  {weightUnits.map(unit => (
                    <option key={unit.id} value={unit.id}>{unit.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Swap Button */}
            <div className="flex justify-center">
              <button
                onClick={handleSwap}
                className="p-3 bg-blue-50 hover:bg-blue-100 rounded-full transition-colors"
                aria-label="Swap units"
              >
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                </svg>
              </button>
            </div>

            {/* To Value */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">To</label>
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2 px-4 py-3 border-2 border-blue-500 bg-blue-50 rounded-lg text-lg font-bold text-blue-900">
                  {result.toLocaleString('en-US', { maximumFractionDigits: 6 })}
                </div>
                <select
                  value={toUnit}
                  onChange={(e) => setToUnit(e.target.value)}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base bg-white"
                >
                  {weightUnits.map(unit => (
                    <option key={unit.id} value={unit.id}>{unit.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Quick Conversion Table */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Reference</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="font-semibold text-gray-700">1 kg</div>
                <div className="text-gray-600">= 2.20462 lbs</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="font-semibold text-gray-700">1 lb</div>
                <div className="text-gray-600">= 0.453592 kg</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="font-semibold text-gray-700">1 kg</div>
                <div className="text-gray-600">= 1000 g</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="font-semibold text-gray-700">1 oz</div>
                <div className="text-gray-600">= 28.3495 g</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="font-semibold text-gray-700">1 stone</div>
                <div className="text-gray-600">= 6.35029 kg</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="font-semibold text-gray-700">1 ton</div>
                <div className="text-gray-600">= 1000 kg</div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Converters */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Related Converters</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <Link
              href="/calculators/converters/length-converter"
              className="bg-white rounded-lg shadow-md p-4 border border-gray-200 hover:shadow-lg transition-shadow"
            >
              <h3 className="font-semibold text-gray-800 mb-2">📏 Length Converter</h3>
              <p className="text-sm text-gray-600">Convert cm, m, ft, inches</p>
            </Link>
            <Link
              href="/calculators/converters/temperature-converter"
              className="bg-white rounded-lg shadow-md p-4 border border-gray-200 hover:shadow-lg transition-shadow"
            >
              <h3 className="font-semibold text-gray-800 mb-2">🌡️ Temperature Converter</h3>
              <p className="text-sm text-gray-600">Convert °C, °F, K</p>
            </Link>
            <Link
              href="/calculators/converters/currency-converter"
              className="bg-white rounded-lg shadow-md p-4 border border-gray-200 hover:shadow-lg transition-shadow"
            >
              <h3 className="font-semibold text-gray-800 mb-2">💱 Currency Converter</h3>
              <p className="text-sm text-gray-600">Convert USD, EUR, INR</p>
            </Link>
          </div>
        </div>
      </div>
    </CalculatorLayout>
  );
}
