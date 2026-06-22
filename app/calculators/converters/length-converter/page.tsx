"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import CalculatorLayout from "@/components/CalculatorLayout";
import { FaThermometerHalf, FaBalanceScale, FaRuler, FaExchangeAlt } from "react-icons/fa";

const lengthUnits = [
  { id: "m", name: "Meter (m)", toMeter: 1 },
  { id: "km", name: "Kilometer (km)", toMeter: 1000 },
  { id: "cm", name: "Centimeter (cm)", toMeter: 0.01 },
  { id: "mm", name: "Millimeter (mm)", toMeter: 0.001 },
  { id: "mi", name: "Mile (mi)", toMeter: 1609.34 },
  { id: "yd", name: "Yard (yd)", toMeter: 0.9144 },
  { id: "ft", name: "Foot (ft)", toMeter: 0.3048 },
  { id: "in", name: "Inch (in)", toMeter: 0.0254 },
];

export default function LengthConverterPage() {
  const [fromValue, setFromValue] = useState<string>("1");
  const [fromUnit, setFromUnit] = useState<string>("ft");
  const [toUnit, setToUnit] = useState<string>("cm");
  const [result, setResult] = useState<number>(0);

  useEffect(() => {
    const value = parseFloat(fromValue) || 0;
    const fromUnitData = lengthUnits.find(u => u.id === fromUnit);
    const toUnitData = lengthUnits.find(u => u.id === toUnit);
    
    if (fromUnitData && toUnitData) {
      const meterValue = value * fromUnitData.toMeter;
      const convertedValue = meterValue / toUnitData.toMeter;
      setResult(convertedValue);
    }
  }, [fromValue, fromUnit, toUnit]);

  const handleSwap = () => {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
  };

  return (
    <CalculatorLayout
      title="Length Converter"
      description="Convert between different length units: meters, feet, inches, cm, km and more"
      explanation={
        <div className="space-y-4">
          <p>
            This length converter translates a distance from one unit into another - metres to feet, inches to
            centimetres, miles to kilometres, and many more - in both directions and without the mental arithmetic. It is
            the tool you reach for when a piece of furniture is listed in centimetres but your room is measured in feet,
            when a running route is in kilometres but you think in miles, or when a screen, a fabric, or a plot of land is
            quoted in units you do not normally use.
          </p>
          <h3 className="text-lg font-semibold text-gray-900">Two systems, one fixed bridge</h3>
          <p>
            Length is measured in two main systems. The metric system uses millimetres, centimetres, metres, and
            kilometres, scaling neatly by powers of ten. The imperial and US customary system uses inches, feet, yards,
            and miles, which scale by less tidy factors of 12, 3, and 1,760. The bridge between them is fixed by
            definition: one inch is exactly 2.54 centimetres. Every metric-to-imperial conversion ultimately rests on that
            single exact relationship, which is why the results are precise rather than approximate.
          </p>
          <h3 className="text-lg font-semibold text-gray-900">Key conversions worth remembering</h3>
          <ul className="list-disc space-y-1 pl-6">
            <li>1 inch = 2.54 centimetres (exactly)</li>
            <li>1 foot = 12 inches = 30.48 centimetres</li>
            <li>1 metre = about 3.281 feet = 39.37 inches</li>
            <li>1 mile = 1,760 yards = about 1.609 kilometres</li>
            <li>1 kilometre = about 0.621 miles</li>
          </ul>
          <h3 className="text-lg font-semibold text-gray-900">A worked example</h3>
          <p>
            Imagine a bookshelf listed as 180 centimetres tall and you want to know if it clears a 6-foot doorway. Since
            one foot is 30.48 centimetres, 6 feet is about 183 centimetres, so the 180-centimetre shelf fits with room to
            spare. Converting the other way, a 10-kilometre race is about 6.21 miles, because you multiply kilometres by
            0.621. The converter keeps the decimals so you are not caught out by a rounding error at the margin, which is
            exactly where these checks tend to matter.
          </p>
          <h3 className="text-lg font-semibold text-gray-900">Tips for accurate results</h3>
          <ul className="list-disc space-y-1 pl-6">
            <li>Match the unit to the job: millimetres for fine work, metres for rooms, kilometres or miles for travel.</li>
            <li>Keep one or two decimal places for practical tasks, but more when cutting materials or fitting parts precisely.</li>
            <li>Remember that a US mile and a nautical mile differ; a nautical mile is about 1.852 kilometres and is used at sea and in aviation.</li>
            <li>For area or volume, convert the underlying length first, since squaring or cubing a unit changes the factor (a square metre is not 3.281 square feet).</li>
          </ul>
        </div>
      }
      faqs={[
        { question: "How many centimetres are in an inch?", answer: "Exactly 2.54 centimetres. This is a defined value, so converting inches to centimetres means multiplying by 2.54, and centimetres to inches means dividing by 2.54." },
        { question: "How do I convert metres to feet?", answer: "Multiply the number of metres by about 3.281 to get feet. For example, 5 metres is roughly 16.4 feet. To go from feet to metres, multiply by 0.3048 instead." },
        { question: "How many kilometres are in a mile?", answer: "One mile is about 1.609 kilometres. To convert miles to kilometres, multiply by 1.609; to convert kilometres to miles, multiply by 0.621." },
        { question: "What is the difference between a mile and a nautical mile?", answer: "A standard (statute) mile is about 1.609 kilometres and is used on land. A nautical mile is about 1.852 kilometres and is used in sea and air navigation because it relates to degrees of latitude. They are not interchangeable." },
        { question: "Can I use this converter for height?", answer: "Yes. Enter a height in feet and inches or in centimetres and convert between them. For example, 5 feet 9 inches is about 175 centimetres, a common conversion for forms and medical records." },
        { question: "How do I convert square feet to square metres?", answer: "Area uses the square of the length factor, so you cannot use the plain length conversion. One square metre is about 10.76 square feet. To convert square feet to square metres, divide by 10.76; this converter handles straight lengths, so square or cubic measures need that adjusted factor." },
        { question: "Why is one inch defined as exactly 2.54 centimetres?", answer: "In 1959 the major English-speaking countries agreed to define the inch as precisely 2.54 centimetres, tying the imperial system to the metric one. Because it is a defined value rather than a measured approximation, every inch-based conversion is exact rather than rounded." },
      ]}
    >
      <Breadcrumbs
        items={[
          { label: "Converters", href: "/converters" },
          { label: "Length Converter", href: "/calculators/converters/length-converter" },
        ]}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-4xl font-bold text-gray-900">Length Converter</h1>
            <span className="text-4xl"><FaRuler aria-hidden /></span>
          </div>
          <p className="text-lg text-gray-600">
            Convert between meters, feet, inches, centimeters, and more
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
                  className="col-span-2 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-lg bg-white"
                  placeholder="Enter value"
                />
                <select
                  value={fromUnit}
                  onChange={(e) => setFromUnit(e.target.value)}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-base bg-white"
                >
                  {lengthUnits.map(unit => (
                    <option key={unit.id} value={unit.id}>{unit.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Swap Button */}
            <div className="flex justify-center">
              <button
                onClick={handleSwap}
                className="p-3 bg-green-50 hover:bg-green-100 rounded-full transition-colors"
                aria-label="Swap units"
              >
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                </svg>
              </button>
            </div>

            {/* To Value */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">To</label>
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2 px-4 py-3 border-2 border-green-500 bg-green-50 rounded-lg text-lg font-bold text-green-900">
                  {result.toLocaleString('en-US', { maximumFractionDigits: 6 })}
                </div>
                <select
                  value={toUnit}
                  onChange={(e) => setToUnit(e.target.value)}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-base bg-white"
                >
                  {lengthUnits.map(unit => (
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
                <div className="font-semibold text-gray-700">1 m</div>
                <div className="text-gray-600">= 3.28084 ft</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="font-semibold text-gray-700">1 ft</div>
                <div className="text-gray-600">= 30.48 cm</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="font-semibold text-gray-700">1 in</div>
                <div className="text-gray-600">= 2.54 cm</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="font-semibold text-gray-700">1 km</div>
                <div className="text-gray-600">= 0.621371 mi</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="font-semibold text-gray-700">1 mi</div>
                <div className="text-gray-600">= 1.60934 km</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="font-semibold text-gray-700">1 yd</div>
                <div className="text-gray-600">= 0.9144 m</div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Converters */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Related Converters</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <Link
              href="/calculators/converters/weight-converter"
              className="bg-white rounded-lg shadow-md p-4 border border-gray-200 hover:shadow-lg transition-shadow"
            >
              <h3 className="flex items-center gap-2 font-semibold text-gray-800 mb-2"><FaBalanceScale aria-hidden /> Weight Converter</h3>
              <p className="text-sm text-gray-600">Convert kg, lbs, oz, grams</p>
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
