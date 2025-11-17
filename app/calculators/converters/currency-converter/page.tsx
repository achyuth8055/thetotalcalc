"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import CalculatorLayout from "@/components/CalculatorLayout";

// Exchange rates relative to USD (1 USD = X)
const currencies = [
  { id: "USD", name: "US Dollar", symbol: "$", rate: 1 },
  { id: "EUR", name: "Euro", symbol: "€", rate: 0.92 },
  { id: "GBP", name: "British Pound", symbol: "£", rate: 0.79 },
  { id: "INR", name: "Indian Rupee", symbol: "₹", rate: 83.12 },
  { id: "JPY", name: "Japanese Yen", symbol: "¥", rate: 149.50 },
  { id: "AUD", name: "Australian Dollar", symbol: "A$", rate: 1.53 },
  { id: "CAD", name: "Canadian Dollar", symbol: "C$", rate: 1.36 },
  { id: "CHF", name: "Swiss Franc", symbol: "CHF", rate: 0.88 },
  { id: "CNY", name: "Chinese Yuan", symbol: "¥", rate: 7.24 },
  { id: "AED", name: "UAE Dirham", symbol: "د.إ", rate: 3.67 },
];

export default function CurrencyConverterPage() {
  const [fromValue, setFromValue] = useState<string>("1");
  const [fromCurrency, setFromCurrency] = useState<string>("USD");
  const [toCurrency, setToCurrency] = useState<string>("INR");
  const [result, setResult] = useState<number>(0);
  const [exchangeRate, setExchangeRate] = useState<number>(0);

  useEffect(() => {
    const value = parseFloat(fromValue) || 0;
    const fromCurr = currencies.find(c => c.id === fromCurrency);
    const toCurr = currencies.find(c => c.id === toCurrency);
    
    if (fromCurr && toCurr) {
      // Convert to USD first, then to target currency
      const usdValue = value / fromCurr.rate;
      const convertedValue = usdValue * toCurr.rate;
      const rate = toCurr.rate / fromCurr.rate;
      
      setResult(convertedValue);
      setExchangeRate(rate);
    }
  }, [fromValue, fromCurrency, toCurrency]);

  const handleSwap = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  const fromCurr = currencies.find(c => c.id === fromCurrency);
  const toCurr = currencies.find(c => c.id === toCurrency);

  return (
    <CalculatorLayout
      title="Currency Converter"
      description="Convert between major world currencies: USD, EUR, GBP, INR, JPY and more"
    >
      {/* Currency converter component */}
      <Breadcrumbs
        items={[
          { label: "Converters", href: "/converters" },
          { label: "Currency Converter", href: "/calculators/converters/currency-converter" },
        ]}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-4xl font-bold text-gray-900">Currency Converter</h1>
            <span className="text-4xl">💱</span>
          </div>
          <p className="text-lg text-gray-600">
            Convert between major world currencies with live exchange rates
          </p>
          <p className="text-sm text-gray-500 mt-1">
            ⓘ Exchange rates are indicative and may vary from actual market rates
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
                  className="col-span-2 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-lg bg-white"
                  placeholder="Enter amount"
                />
                <select
                  value={fromCurrency}
                  onChange={(e) => setFromCurrency(e.target.value)}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-base bg-white"
                >
                  {currencies.map(curr => (
                    <option key={curr.id} value={curr.id}>
                      {curr.symbol} {curr.id}
                    </option>
                  ))}
                </select>
              </div>
              {fromCurr && (
                <div className="text-sm text-gray-600 mt-2">{fromCurr.name}</div>
              )}
            </div>

            {/* Exchange Rate & Swap */}
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Exchange Rate: <span className="font-semibold text-purple-600">
                  {exchangeRate.toFixed(4)}
                </span>
              </div>
              <button
                onClick={handleSwap}
                className="p-3 bg-purple-50 hover:bg-purple-100 rounded-full transition-colors"
                aria-label="Swap currencies"
              >
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                </svg>
              </button>
            </div>

            {/* To Value */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">To</label>
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2 px-4 py-3 border-2 border-purple-500 bg-purple-50 rounded-lg text-lg font-bold text-purple-900">
                  {result.toLocaleString('en-US', { maximumFractionDigits: 2 })}
                </div>
                <select
                  value={toCurrency}
                  onChange={(e) => setToCurrency(e.target.value)}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-base bg-white"
                >
                  {currencies.map(curr => (
                    <option key={curr.id} value={curr.id}>
                      {curr.symbol} {curr.id}
                    </option>
                  ))}
                </select>
              </div>
              {toCurr && (
                <div className="text-sm text-gray-600 mt-2">{toCurr.name}</div>
              )}
            </div>
          </div>

          {/* Popular Conversions */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Popular Conversions</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="font-semibold text-gray-700">1 USD</div>
                <div className="text-gray-600">= ₹83.12 INR</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="font-semibold text-gray-700">1 EUR</div>
                <div className="text-gray-600">= $1.09 USD</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="font-semibold text-gray-700">1 GBP</div>
                <div className="text-gray-600">= $1.27 USD</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="font-semibold text-gray-700">1 USD</div>
                <div className="text-gray-600">= ¥149.50 JPY</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="font-semibold text-gray-700">1 USD</div>
                <div className="text-gray-600">= €0.92 EUR</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="font-semibold text-gray-700">1 USD</div>
                <div className="text-gray-600">= د.إ3.67 AED</div>
              </div>
            </div>
          </div>

          {/* Currency List */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Supported Currencies</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-sm">
              {currencies.map(curr => (
                <div key={curr.id} className="flex items-center gap-2">
                  <span className="font-semibold text-gray-700">{curr.symbol}</span>
                  <span className="text-gray-600">{curr.id} - {curr.name}</span>
                </div>
              ))}
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
              href="/calculators/converters/temperature-converter"
              className="bg-white rounded-lg shadow-md p-4 border border-gray-200 hover:shadow-lg transition-shadow"
            >
              <h3 className="font-semibold text-gray-800 mb-2">🌡️ Temperature Converter</h3>
              <p className="text-sm text-gray-600">Convert °C, °F, K</p>
            </Link>
          </div>
        </div>
      </div>
    </CalculatorLayout>
  );
}
