"use client";

import { useState, useEffect } from "react";
import { CurrencyConfig, getAllCurrencies, setPreferredCurrency } from "@/lib/currency";

interface CurrencySelectorProps {
  selectedCurrency: CurrencyConfig;
  onCurrencyChange: (currency: CurrencyConfig) => void;
  isLoading?: boolean;
}

export default function CurrencySelector({ selectedCurrency, onCurrencyChange, isLoading = false }: CurrencySelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const currencies = getAllCurrencies();

  const handleCurrencySelect = (currency: CurrencyConfig) => {
    setPreferredCurrency(currency.code);
    onCurrencyChange(currency);
    setIsOpen(false);
  };

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg text-sm font-medium text-gray-500">
        <span className="animate-pulse">Loading...</span>
      </div>
    );
  }

  return (
    <div className="relative inline-block">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700"
        aria-label="Select currency"
      >
        <span className="text-lg">{selectedCurrency.symbol}</span>
        <span className="hidden sm:inline">{selectedCurrency.code}</span>
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown */}
          <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-20 max-h-80 overflow-y-auto">
            <div className="p-2">
              <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase">
                Select Currency
              </div>
              {currencies.map((currency) => (
                <button
                  key={currency.code}
                  onClick={() => handleCurrencySelect(currency)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-sm hover:bg-gray-100 transition-colors ${
                    selectedCurrency.code === currency.code ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-medium">{currency.symbol}</span>
                    <div className="text-left">
                      <div className="font-medium">{currency.code}</div>
                      <div className="text-xs text-gray-500">{currency.name}</div>
                    </div>
                  </div>
                  {selectedCurrency.code === currency.code && (
                    <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
