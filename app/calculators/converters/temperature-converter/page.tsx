"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import CalculatorLayout from "@/components/CalculatorLayout";

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
            <span className="text-4xl">🌡️</span>
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
              <h3 className="font-semibold text-gray-800 mb-2">⚖️ Weight Converter</h3>
              <p className="text-sm text-gray-600">Convert kg, lbs, oz, grams</p>
            </Link>
            <Link
              href="/calculators/converters/length-converter"
              className="bg-white rounded-lg shadow-md p-4 border border-gray-200 hover:shadow-lg transition-shadow"
            >
              <h3 className="font-semibold text-gray-800 mb-2">📏 Length Converter</h3>
              <p className="text-sm text-gray-600">Convert cm, m, ft, inches</p>
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
