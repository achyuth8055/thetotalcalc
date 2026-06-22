"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import CalculatorLayout from "@/components/CalculatorLayout";
import { FaThermometerHalf, FaBalanceScale, FaRuler, FaExchangeAlt } from "react-icons/fa";

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
      explanation={
        <div className="space-y-4">
          <p>
            This weight converter changes a measurement from one unit of mass into another - kilograms to pounds, grams to
            ounces, stone to kilograms, and many more - instantly and in both directions. It is built for the everyday
            moments when two systems collide: a recipe in grams when your scale reads ounces, a suitcase limit in
            kilograms when the airline app shows pounds, or a body weight in stone that a form wants in kilograms. Enter a
            value, choose the units, and read the converted figure.
          </p>
          <h3 className="text-lg font-semibold text-gray-900">Metric and imperial, side by side</h3>
          <p>
            Most of the world measures mass in metric units - grams, kilograms, and tonnes - while the United States and,
            for body weight, the United Kingdom still lean on imperial units like ounces, pounds, and stone. The two
            systems meet through fixed conversion factors. A kilogram is exactly 1,000 grams, and a pound is defined as
            0.45359237 kilograms, which is the anchor that ties the systems together. From that single relationship every
            other conversion follows.
          </p>
          <h3 className="text-lg font-semibold text-gray-900">Key conversions worth remembering</h3>
          <ul className="list-disc space-y-1 pl-6">
            <li>1 kilogram = 1,000 grams = about 2.205 pounds</li>
            <li>1 pound = 16 ounces = about 0.454 kilograms</li>
            <li>1 ounce = about 28.35 grams</li>
            <li>1 stone = 14 pounds = about 6.35 kilograms</li>
            <li>1 metric tonne = 1,000 kilograms = about 2,205 pounds</li>
          </ul>
          <h3 className="text-lg font-semibold text-gray-900">A worked example</h3>
          <p>
            Suppose a recipe calls for 250 grams of flour and your kitchen scale only shows ounces. Since one ounce is
            about 28.35 grams, 250 grams divided by 28.35 gives roughly 8.8 ounces. Going the other way, a 150-pound
            person weighs about 68 kilograms, because 150 multiplied by 0.454 is close to 68. The converter does this
            arithmetic for you and keeps the decimal places, which matters most when you are scaling a recipe or measuring
            a dose where small differences add up.
          </p>
          <h3 className="text-lg font-semibold text-gray-900">Mass versus weight</h3>
          <p>
            Strictly speaking, the units here measure mass, the amount of matter in an object, while weight is the force
            gravity exerts on that mass. In everyday use on Earth the two track each other closely, so people use the
            words interchangeably and this tool follows that convention. The distinction only becomes practical in
            physics problems or off the planet, where the same mass would &quot;weigh&quot; less on the Moon even though its
            kilograms do not change.
          </p>
        </div>
      }
      faqs={[
        { question: "How many pounds are in a kilogram?", answer: "One kilogram is approximately 2.205 pounds. To convert kilograms to pounds, multiply by 2.205; to convert pounds to kilograms, multiply by 0.454 (or divide by 2.205)." },
        { question: "What is the difference between an ounce and a fluid ounce?", answer: "An ounce is a unit of weight (mass), equal to about 28.35 grams. A fluid ounce measures volume, not weight, so the two are not interchangeable. This converter handles weight ounces only; use a volume converter for fluid ounces." },
        { question: "How many pounds are in a stone?", answer: "One stone equals exactly 14 pounds, or about 6.35 kilograms. Stone is still commonly used for body weight in the United Kingdom and Ireland." },
        { question: "Is a metric tonne the same as a US ton?", answer: "No. A metric tonne is 1,000 kilograms (about 2,205 pounds). A US short ton is 2,000 pounds (about 907 kilograms), and a UK long ton is 2,240 pounds. Check which ton a figure refers to before converting." },
        { question: "Does this converter measure mass or weight?", answer: "It converts units of mass, such as kilograms, grams, pounds, and ounces. On Earth, mass and weight track each other closely, so for everyday purposes the result is what people mean when they say weight." },
        { question: "How do I convert grams to ounces for cooking?", answer: "Divide the number of grams by about 28.35 to get ounces. For example, 200 grams is roughly 7.05 ounces. For dry baking ingredients, weighing in grams is usually more accurate than measuring by volume, which is why many recipes now list both." },
        { question: "Why do imperial units use 16 ounces in a pound?", answer: "The imperial system grew from historical trade measures rather than a base-ten logic, so a pound is 16 ounces and a stone is 14 pounds. That is why converting within imperial units is less tidy than metric, where everything scales by powers of ten, and why a converter saves time." },
      ]}
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
            <span className="text-4xl"><FaBalanceScale aria-hidden /></span>
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
                  className="col-span-2 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg bg-white"
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
              <h3 className="flex items-center gap-2 font-semibold text-gray-800 mb-2"><FaRuler aria-hidden /> Length Converter</h3>
              <p className="text-sm text-gray-600">Convert cm, m, ft, inches</p>
            </Link>
            <Link
              href="/calculators/converters/temperature-converter"
              className="bg-white rounded-lg shadow-md p-4 border border-gray-200 hover:shadow-lg transition-shadow"
            >
              <h3 className="flex items-center gap-2 font-semibold text-gray-800 mb-2"><FaThermometerHalf aria-hidden /> Temperature Converter</h3>
              <p className="text-sm text-gray-600">Convert °C, °F, K</p>
            </Link>
            <Link
              href="/calculators/converters/currency-converter"
              className="bg-white rounded-lg shadow-md p-4 border border-gray-200 hover:shadow-lg transition-shadow"
            >
              <h3 className="flex items-center gap-2 font-semibold text-gray-800 mb-2"><FaExchangeAlt aria-hidden /> Currency Converter</h3>
              <p className="text-sm text-gray-600">Convert USD, EUR, INR</p>
            </Link>
          </div>
        </div>
      </div>
    </CalculatorLayout>
  );
}
