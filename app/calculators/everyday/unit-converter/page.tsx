"use client";

import { useState, useEffect } from "react";
import Breadcrumbs from "@/components/Breadcrumbs";
import CalculatorLayout from "@/components/CalculatorLayout";

export default function UnitConverterCalculator() {
  const [value, setValue] = useState("");
  const [category, setCategory] = useState("length");
  const [fromUnit, setFromUnit] = useState("meters");
  const [toUnit, setToUnit] = useState("feet");
  const [result, setResult] = useState<number | null>(null);

  const units = {
    length: {
      meters: 1,
      kilometers: 0.001,
      centimeters: 100,
      millimeters: 1000,
      miles: 0.000621371,
      yards: 1.09361,
      feet: 3.28084,
      inches: 39.3701,
    },
    weight: {
      kilograms: 1,
      grams: 1000,
      milligrams: 1000000,
      pounds: 2.20462,
      ounces: 35.274,
      tons: 0.001,
    },
    temperature: {
      celsius: { to: (v: number, unit: string) => unit === "fahrenheit" ? (v * 9/5) + 32 : v + 273.15 },
      fahrenheit: { to: (v: number, unit: string) => unit === "celsius" ? (v - 32) * 5/9 : ((v - 32) * 5/9) + 273.15 },
      kelvin: { to: (v: number, unit: string) => unit === "celsius" ? v - 273.15 : (v - 273.15) * 9/5 + 32 },
    },
    volume: {
      liters: 1,
      milliliters: 1000,
      gallons: 0.264172,
      quarts: 1.05669,
      pints: 2.11338,
      cups: 4.22675,
      tablespoons: 67.628,
      teaspoons: 202.884,
    },
  };

  useEffect(() => {
    const recent = JSON.parse(localStorage.getItem("recentCalculators") || "[]");
    const updated = ["unit-converter", ...recent.filter((id: string) => id !== "unit-converter")].slice(0, 10);
    localStorage.setItem("recentCalculators", JSON.stringify(updated));
  }, []);

  const convert = () => {
    const val = parseFloat(value);
    if (isNaN(val)) return;

    if (category === "temperature") {
      const temp = units.temperature as any;
      const converted = temp[fromUnit].to(val, toUnit);
      setResult(converted);
    } else {
      const categoryUnits = units[category as keyof typeof units] as { [key: string]: number };
      const baseValue = val / categoryUnits[fromUnit];
      const converted = baseValue * categoryUnits[toUnit];
      setResult(converted);
    }
  };

  const getUnitsForCategory = () => {
    return Object.keys(units[category as keyof typeof units]);
  };

  useEffect(() => {
    const unitList = getUnitsForCategory();
    setFromUnit(unitList[0]);
    setToUnit(unitList[1]);
    setResult(null);
  }, [category]);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Breadcrumbs
        items={[
          { label: "Everyday Calculators", href: "/everyday-calculators" },
          { label: "Unit Converter", href: "/calculators/everyday/unit-converter" },
        ]}
      />

      <CalculatorLayout
        title="Unit Converter"
        description="Convert between different units of length, weight, temperature, and volume."
        explanation={
          <div>
            <p>Easily convert measurements between metric and imperial units for length, weight, temperature, and volume.</p>
          </div>
        }
        faqs={[
          { question: "Is this accurate for scientific use?", answer: "This converter uses standard conversion factors and is suitable for everyday use and most applications." },
        ]}
        relatedCalculators={[
          { name: "Percentage Calculator", href: "/calculators/math/percentage-calculator" },
          { name: "BMI Calculator", href: "/calculators/health/bmi-calculator" },
        ]}
      >
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            >
              <option value="length">Length</option>
              <option value="weight">Weight</option>
              <option value="temperature">Temperature</option>
              <option value="volume">Volume</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Value</label>
            <input
              type="number"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              placeholder="Enter value"
              step="0.01"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">From</label>
              <select
                value={fromUnit}
                onChange={(e) => setFromUnit(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              >
                {getUnitsForCategory().map((unit) => (
                  <option key={unit} value={unit}>{unit}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">To</label>
              <select
                value={toUnit}
                onChange={(e) => setToUnit(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              >
                {getUnitsForCategory().map((unit) => (
                  <option key={unit} value={unit}>{unit}</option>
                ))}
              </select>
            </div>
          </div>

          <button
            onClick={convert}
            className="w-full bg-primary-600 text-white py-4 rounded-lg font-semibold text-lg hover:bg-primary-700 transition-colors"
          >
            Convert
          </button>

          {result !== null && (
            <div className="mt-8 p-6 bg-amber-50 rounded-lg border-2 border-amber-200 text-center">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Result</h3>
              <div className="text-3xl font-bold text-amber-600">
                {result.toFixed(4)} {toUnit}
              </div>
            </div>
          )}
        </div>
      </CalculatorLayout>
    </div>
  );
}
