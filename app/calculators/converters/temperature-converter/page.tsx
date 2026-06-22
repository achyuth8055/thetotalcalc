"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import CalculatorLayout from "@/components/CalculatorLayout";
import { FaThermometerHalf, FaBalanceScale, FaRuler, FaExchangeAlt } from "react-icons/fa";

export default function TemperatureConverterPage() {
  const [celsius, setCelsius] = useState<string>("0");
  const [fahrenheit, setFahrenheit] = useState<string>("32");
  const [kelvin, setKelvin] = useState<string>("273.15");
  const [activeInput, setActiveInput] = useState<string>("celsius");

  const convertFromCelsius = (c: number) => {
    const f = (c * 9/5) + 32;
    const k = c + 273.15;
    setFahrenheit(f.toFixed(2));
    setKelvin(k.toFixed(2));
  };

  const convertFromFahrenheit = (f: number) => {
    const c = (f - 32) * 5/9;
    const k = c + 273.15;
    setCelsius(c.toFixed(2));
    setKelvin(k.toFixed(2));
  };

  const convertFromKelvin = (k: number) => {
    const c = k - 273.15;
    const f = (c * 9/5) + 32;
    setCelsius(c.toFixed(2));
    setFahrenheit(f.toFixed(2));
  };

  const handleCelsiusChange = (value: string) => {
    setCelsius(value);
    setActiveInput("celsius");
    const c = parseFloat(value) || 0;
    convertFromCelsius(c);
  };

  const handleFahrenheitChange = (value: string) => {
    setFahrenheit(value);
    setActiveInput("fahrenheit");
    const f = parseFloat(value) || 0;
    convertFromFahrenheit(f);
  };

  const handleKelvinChange = (value: string) => {
    setKelvin(value);
    setActiveInput("kelvin");
    const k = parseFloat(value) || 0;
    convertFromKelvin(k);
  };

  return (
    <CalculatorLayout
      title="Temperature Converter"
      description="Convert between Celsius, Fahrenheit, and Kelvin temperature scales"
      explanation={
        <div className="space-y-4">
          <p>
            This temperature converter moves a reading between the three scales people actually use: Celsius, Fahrenheit,
            and Kelvin. Type a value in any one and read the equivalent in the others. It is the tool for a recipe written
            in Fahrenheit when your oven shows Celsius, a weather forecast in the unfamiliar scale, or a science problem
            that demands Kelvin. Unlike length or weight, temperature scales do not simply scale by a single factor, which
            is exactly why a dedicated converter is so useful.
          </p>
          <h3 className="text-lg font-semibold text-gray-900">Why temperature is different</h3>
          <p>
            Most conversions multiply by a fixed number, but temperature scales have different zero points as well as
            different step sizes, so converting needs both a multiplication and an addition. Celsius sets zero at the
            freezing point of water and 100 at its boiling point. Fahrenheit puts those same two points at 32 and 212,
            spreading 180 degrees across the range where Celsius uses 100. Kelvin keeps the Celsius step size but starts at
            absolute zero, the coldest temperature physically possible, which sits at -273.15 degrees Celsius.
          </p>
          <h3 className="text-lg font-semibold text-gray-900">The formulas</h3>
          <ul className="list-disc space-y-1 pl-6">
            <li>Celsius to Fahrenheit: F = (C times 9/5) + 32</li>
            <li>Fahrenheit to Celsius: C = (F - 32) times 5/9</li>
            <li>Celsius to Kelvin: K = C + 273.15</li>
            <li>Kelvin to Celsius: C = K - 273.15</li>
          </ul>
          <h3 className="text-lg font-semibold text-gray-900">A worked example</h3>
          <p>
            Take a warm day of 30 degrees Celsius. Multiply by 9/5 to get 54, then add 32, which gives 86 degrees
            Fahrenheit. To express the same temperature in Kelvin, add 273.15 to the Celsius figure, giving 303.15 Kelvin.
            Notice that the addition step is what trips people up in mental math: forgetting to add 32 turns a pleasant 86
            Fahrenheit into a meaningless 54, which is why letting the converter handle both steps avoids easy errors.
          </p>
          <h3 className="text-lg font-semibold text-gray-900">Reference points worth knowing</h3>
          <ul className="list-disc space-y-1 pl-6">
            <li>Water freezes at 0 degrees Celsius, 32 degrees Fahrenheit, 273.15 Kelvin.</li>
            <li>A comfortable room is about 20 to 22 degrees Celsius, or 68 to 72 degrees Fahrenheit.</li>
            <li>Normal human body temperature is about 37 degrees Celsius, or 98.6 degrees Fahrenheit.</li>
            <li>Water boils at 100 degrees Celsius, 212 degrees Fahrenheit, 373.15 Kelvin (at sea level).</li>
            <li>The scales cross at -40, where -40 degrees Celsius equals -40 degrees Fahrenheit.</li>
          </ul>
          <p>
            Kelvin is written without the word &quot;degrees&quot; - a reading is &quot;300 kelvin,&quot; not &quot;300 degrees kelvin&quot; - and is
            standard in science because it has no negative values, making it the natural scale for physics and chemistry.
          </p>
        </div>
      }
      faqs={[
        { question: "How do I convert Celsius to Fahrenheit?", answer: "Multiply the Celsius value by 9/5 (which is 1.8), then add 32. For example, 25 degrees Celsius is (25 times 1.8) + 32 = 77 degrees Fahrenheit." },
        { question: "How do I convert Fahrenheit to Celsius?", answer: "Subtract 32 from the Fahrenheit value, then multiply by 5/9. For example, 98.6 degrees Fahrenheit is (98.6 - 32) times 5/9 = 37 degrees Celsius, normal body temperature." },
        { question: "What is Kelvin and when is it used?", answer: "Kelvin is the scientific temperature scale that starts at absolute zero, the lowest possible temperature. It uses the same step size as Celsius, so you convert by adding 273.15 to a Celsius value. It is standard in physics and chemistry because it has no negative numbers." },
        { question: "At what temperature do Celsius and Fahrenheit read the same?", answer: "At -40 degrees. Minus 40 Celsius and minus 40 Fahrenheit are exactly the same temperature, the single point where the two scales cross." },
        { question: "Why can't I just multiply to convert temperatures?", answer: "Because the scales have different zero points as well as different step sizes. A simple multiplication only works when both scales start at the same zero. Temperature needs both a multiply and an add (or subtract), which is why the formulas include the +32 or +273.15 step." },
        { question: "What oven temperature in Celsius equals 350 Fahrenheit?", answer: "About 177 degrees Celsius, which most ovens and recipes round to 175 or 180. To convert, subtract 32 from 350 to get 318, then multiply by 5/9. This is one of the most common kitchen conversions, since many recipes are written in Fahrenheit." },
        { question: "Is there a lowest possible temperature?", answer: "Yes. Absolute zero, 0 Kelvin or about -273.15 degrees Celsius, is the coldest temperature physically possible, the point at which particle motion is at its minimum. Nothing can be colder, which is why the Kelvin scale starts there and never goes negative." },
      ]}
    >
      <Breadcrumbs
        items={[
          { label: "Converters", href: "/converters" },
          { label: "Temperature Converter", href: "/calculators/converters/temperature-converter" },
        ]}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-4xl font-bold text-gray-900">Temperature Converter</h1>
            <span className="text-4xl"><FaThermometerHalf aria-hidden /></span>
          </div>
          <p className="text-lg text-gray-600">
            Convert between Celsius, Fahrenheit, and Kelvin
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 border border-gray-200">
          <div className="space-y-6">
            {/* Celsius */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Celsius (°C)
              </label>
              <input
                type="number"
                value={celsius}
                onChange={(e) => handleCelsiusChange(e.target.value)}
                className={`w-full px-4 py-3 border-2 ${activeInput === 'celsius' ? 'border-orange-500 bg-orange-50' : 'border-gray-300 bg-white'} rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-lg font-semibold`}
                placeholder="Enter Celsius"
              />
            </div>

            {/* Fahrenheit */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Fahrenheit (°F)
              </label>
              <input
                type="number"
                value={fahrenheit}
                onChange={(e) => handleFahrenheitChange(e.target.value)}
                className={`w-full px-4 py-3 border-2 ${activeInput === 'fahrenheit' ? 'border-orange-500 bg-orange-50' : 'border-gray-300 bg-white'} rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-lg font-semibold`}
                placeholder="Enter Fahrenheit"
              />
            </div>

            {/* Kelvin */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Kelvin (K)
              </label>
              <input
                type="number"
                value={kelvin}
                onChange={(e) => handleKelvinChange(e.target.value)}
                className={`w-full px-4 py-3 border-2 ${activeInput === 'kelvin' ? 'border-orange-500 bg-orange-50' : 'border-gray-300 bg-white'} rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-lg font-semibold`}
                placeholder="Enter Kelvin"
              />
            </div>
          </div>

          {/* Quick Reference */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Reference</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <div className="bg-blue-50 p-3 rounded-lg">
                <div className="font-semibold text-blue-800">Water Freezes</div>
                <div className="text-blue-600">0°C = 32°F = 273.15 K</div>
              </div>
              <div className="bg-red-50 p-3 rounded-lg">
                <div className="font-semibold text-red-800">Water Boils</div>
                <div className="text-red-600">100°C = 212°F = 373.15 K</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="font-semibold text-gray-700">Room Temperature</div>
                <div className="text-gray-600">20°C = 68°F = 293.15 K</div>
              </div>
              <div className="bg-yellow-50 p-3 rounded-lg">
                <div className="font-semibold text-yellow-800">Body Temperature</div>
                <div className="text-yellow-600">37°C = 98.6°F = 310.15 K</div>
              </div>
            </div>
          </div>

          {/* Formulas */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Conversion Formulas</h3>
            <div className="space-y-2 text-sm bg-gray-50 p-4 rounded-lg">
              <div><strong>°C to °F:</strong> (°C × 9/5) + 32</div>
              <div><strong>°F to °C:</strong> (°F - 32) × 5/9</div>
              <div><strong>°C to K:</strong> °C + 273.15</div>
              <div><strong>K to °C:</strong> K - 273.15</div>
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
              href="/calculators/converters/length-converter"
              className="bg-white rounded-lg shadow-md p-4 border border-gray-200 hover:shadow-lg transition-shadow"
            >
              <h3 className="flex items-center gap-2 font-semibold text-gray-800 mb-2"><FaRuler aria-hidden /> Length Converter</h3>
              <p className="text-sm text-gray-600">Convert cm, m, ft, inches</p>
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
