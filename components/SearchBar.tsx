"use client";

import { useState, useEffect, useRef } from "react";
import { calculators } from "@/data/calculators";
import Link from "next/link";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<typeof calculators>([]);
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

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

  useEffect(() => {
    const handleShortcut = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        inputRef.current?.focus();
      }
    };

    window.addEventListener("keydown", handleShortcut);
    return () => window.removeEventListener("keydown", handleShortcut);
  }, []);

  return (
    <div className="relative w-full max-w-2xl mx-auto px-4 sm:px-0">
      <div className="relative group">
        <div className="absolute inset-0 rounded-2xl border border-white/15 bg-white/10 backdrop-blur-2xl transition duration-300 group-focus-within:border-white/40" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query && setIsOpen(true)}
          placeholder="Search calculators..."
          className="w-full px-4 sm:px-6 py-3 sm:py-4 pr-20 text-sm sm:text-base rounded-2xl focus:ring-4 focus:ring-white/20 focus:outline-none text-white placeholder-white/70 bg-transparent relative z-10"
        />
        <div className="absolute right-4 sm:right-5 top-1/2 -translate-y-1/2 text-white/70 flex items-center gap-3">
          <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold tracking-wide uppercase bg-white/10 border border-white/20 text-white/80 px-2 py-1 rounded-full">
            ⌘K
          </span>
          <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {/* Search Results Dropdown */}
      {isOpen && results.length > 0 && (
        <div className="absolute z-50 w-full mt-3 rounded-3xl bg-white/95 backdrop-blur-xl border border-slate-100 shadow-2xl max-h-80 sm:max-h-96 overflow-y-auto">
          {results.map((calc) => (
            <Link
              key={calc.id}
              href={`/calculators/${calc.category}/${calc.slug}`}
              className="flex items-start px-4 sm:px-5 py-3 sm:py-4 hover:bg-slate-50 border-b border-slate-100 last:border-b-0 group transition-colors"
              onClick={() => {
                setQuery("");
                setIsOpen(false);
              }}
            >
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors text-sm sm:text-base truncate">{calc.name}</div>
                <div className="text-xs sm:text-sm text-gray-500 mt-1 line-clamp-2">{calc.description}</div>
              </div>
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 group-hover:text-primary-600 mt-1 ml-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          ))}
        </div>
      )}

      {isOpen && results.length === 0 && query && (
        <div className="absolute z-50 w-full mt-3 bg-white/95 backdrop-blur-xl border border-slate-100 rounded-3xl shadow-2xl p-4 sm:p-6">
          <p className="text-gray-500 text-center text-sm sm:text-base">No calculators found for "{query}"</p>
        </div>
      )}
    </div>
  );
}
