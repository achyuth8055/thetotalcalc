"use client";

import { useState, useEffect } from "react";
import { calculators } from "@/data/calculators";
import Link from "next/link";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<typeof calculators>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (query.trim() === "") {
      setResults([]);
      setIsOpen(false);
      return;
    }

    const searchQuery = query.toLowerCase();
    const filtered = calculators.filter(
      (calc) =>
        calc.name.toLowerCase().includes(searchQuery) ||
        calc.description.toLowerCase().includes(searchQuery) ||
        calc.keywords.some((keyword) => keyword.toLowerCase().includes(searchQuery))
    );

    setResults(filtered);
    setIsOpen(true);
  }, [query]);

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query && setIsOpen(true)}
          placeholder="Search calculators: EMI, BMI, Percentage, Binary..."
          className="w-full px-6 py-4 pr-14 text-base border-2 border-white/20 rounded-2xl focus:border-white focus:outline-none shadow-lg bg-white/10 backdrop-blur-sm text-white placeholder-white/70"
        />
        <div className="absolute right-5 top-1/2 transform -translate-y-1/2 text-white/70">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {/* Search Results Dropdown */}
      {isOpen && results.length > 0 && (
        <div className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-2xl max-h-96 overflow-y-auto">
          {results.map((calc) => (
            <Link
              key={calc.id}
              href={`/calculators/${calc.category}/${calc.slug}`}
              className="flex items-start px-5 py-4 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 group transition-colors"
              onClick={() => {
                setQuery("");
                setIsOpen(false);
              }}
            >
              <div className="flex-1">
                <div className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">{calc.name}</div>
                <div className="text-sm text-gray-500 mt-1">{calc.description}</div>
              </div>
              <svg className="w-5 h-5 text-gray-400 group-hover:text-primary-600 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          ))}
        </div>
      )}

      {isOpen && results.length === 0 && query && (
        <div className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-2xl p-6">
          <p className="text-gray-500 text-center">No calculators found for "{query}"</p>
        </div>
      )}
    </div>
  );
}
