"use client";

import Link from "next/link";
import { useState } from "react";

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-xl bg-slate-900/70 border-b border-white/5 shadow-[0_12px_40px_rgba(2,6,23,0.6)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 sm:space-x-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-br from-primary-400 to-primary-700 rounded-2xl flex items-center justify-center shadow-lg shadow-primary-900/40">
              <span className="text-white font-bold text-lg">=</span>
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-lg sm:text-xl font-bold text-white tracking-wide">OnlineCalc</span>
              <span className="hidden sm:block text-[10px] uppercase tracking-[0.3em] text-white/60">Since 2017</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            <Link href="/" className="px-3 xl:px-4 py-2 text-sm font-medium text-white/80 hover:text-white hover:bg-white/5 rounded-full transition-colors">
              Home
            </Link>
            
            {/* Finance Dropdown */}
            <div className="relative"
              onMouseEnter={() => setOpenDropdown('finance')}
              onMouseLeave={() => setOpenDropdown(null)}
            >
              <Link href="/finance-calculators" className="px-3 xl:px-4 py-2 text-sm font-medium text-white/80 hover:text-white hover:bg-white/5 rounded-full transition-colors flex items-center gap-1">
                Finance
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </Link>
              {openDropdown === 'finance' && (
                <div className="absolute top-full left-0 mt-3 w-64 bg-slate-900/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/10 py-3 z-50">
                  <Link href="/calculators/finance/emi-calculator" className="block px-5 py-2 text-sm text-white/80 hover:bg-white/5 hover:text-white">EMI Calculator</Link>
                  <Link href="/calculators/finance/sip-calculator" className="block px-5 py-2 text-sm text-white/80 hover:bg-white/5 hover:text-white">SIP Calculator</Link>
                  <Link href="/calculators/finance/home-loan-emi-calculator" className="block px-5 py-2 text-sm text-white/80 hover:bg-white/5 hover:text-white">Home Loan EMI</Link>
                  <Link href="/calculators/finance/flat-vs-reducing-rate-calculator" className="block px-5 py-2 text-sm text-white/80 hover:bg-white/5 hover:text-white">Flat vs Reducing Rate</Link>
                  <Link href="/finance-calculators" className="block px-5 pt-3 text-sm text-primary-200 font-semibold hover:text-white border-t border-white/10 mt-2">View All →</Link>
                </div>
              )}
            </div>

            {/* Converters Dropdown */}
            <div className="relative"
              onMouseEnter={() => setOpenDropdown('converters')}
              onMouseLeave={() => setOpenDropdown(null)}
            >
              <button className="px-3 xl:px-4 py-2 text-sm font-medium text-white/80 hover:text-white hover:bg-white/5 rounded-full transition-colors flex items-center gap-1">
                Converters
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {openDropdown === 'converters' && (
                <div className="absolute top-full left-0 mt-3 w-64 bg-slate-900/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/10 py-3 z-50">
                  <Link href="/calculators/converters/weight-converter" className="block px-5 py-2 text-sm text-white/80 hover:bg-white/5 hover:text-white">Weight Converter</Link>
                  <Link href="/calculators/converters/length-converter" className="block px-5 py-2 text-sm text-white/80 hover:bg-white/5 hover:text-white">Length Converter</Link>
                  <Link href="/calculators/converters/temperature-converter" className="block px-5 py-2 text-sm text-white/80 hover:bg-white/5 hover:text-white">Temperature Converter</Link>
                  <Link href="/calculators/converters/currency-converter" className="block px-5 py-2 text-sm text-white/80 hover:bg-white/5 hover:text-white">Currency Converter</Link>
                  <Link href="/converters" className="block px-5 pt-3 text-sm text-primary-200 font-semibold hover:text-white border-t border-white/10 mt-2">View All →</Link>
                </div>
              )}
            </div>

            <Link href="/math-calculators" className="px-3 xl:px-4 py-2 text-sm font-medium text-white/80 hover:text-white hover:bg-white/5 rounded-full transition-colors">
              Math
            </Link>
            <Link href="/health-calculators" className="px-3 xl:px-4 py-2 text-sm font-medium text-white/80 hover:text-white hover:bg-white/5 rounded-full transition-colors">
              Health
            </Link>
            <Link href="/date-calculators" className="px-3 xl:px-4 py-2 text-sm font-medium text-white/80 hover:text-white hover:bg-white/5 rounded-full transition-colors">
              Date & Time
            </Link>
            <Link href="/everyday-calculators" className="px-3 xl:px-4 py-2 text-sm font-medium text-white/80 hover:text-white hover:bg-white/5 rounded-full transition-colors">
              Everyday
            </Link>
            <Link href="/developer-calculators" className="px-3 xl:px-4 py-2 text-sm font-medium text-white/80 hover:text-white hover:bg-white/5 rounded-full transition-colors">
              Developer
            </Link>
            <Link
              href="/finance-calculators"
              className="ml-2 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary-400 to-primary-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-primary-900/50 hover:shadow-primary-700/80 transition-all"
            >
              Explore Tools
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 rounded-full text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-primary-400"
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden pb-4 space-y-1">
            <Link
              href="/"
              className="block px-4 py-2 text-sm font-medium text-white/80 hover:bg-white/10 rounded-xl"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/finance-calculators"
              className="block px-4 py-2 text-sm font-medium text-white/80 hover:bg-white/10 rounded-xl"
              onClick={() => setIsMenuOpen(false)}
            >
              Finance
            </Link>
            <Link
              href="/converters"
              className="block px-4 py-2 text-sm font-medium text-white/80 hover:bg-white/10 rounded-xl"
              onClick={() => setIsMenuOpen(false)}
            >
              Converters
            </Link>
            <Link
              href="/math-calculators"
              className="block px-4 py-2 text-sm font-medium text-white/80 hover:bg-white/10 rounded-xl"
              onClick={() => setIsMenuOpen(false)}
            >
              Math
            </Link>
            <Link
              href="/health-calculators"
              className="block px-4 py-2 text-sm font-medium text-white/80 hover:bg-white/10 rounded-xl"
              onClick={() => setIsMenuOpen(false)}
            >
              Health
            </Link>
            <Link
              href="/date-calculators"
              className="block px-4 py-2 text-sm font-medium text-white/80 hover:bg-white/10 rounded-xl"
              onClick={() => setIsMenuOpen(false)}
            >
              Date & Time
            </Link>
            <Link
              href="/everyday-calculators"
              className="block px-4 py-2 text-sm font-medium text-white/80 hover:bg-white/10 rounded-xl"
              onClick={() => setIsMenuOpen(false)}
            >
              Everyday
            </Link>
            <Link
              href="/developer-calculators"
              className="block px-4 py-2 text-sm font-medium text-white/80 hover:bg-white/10 rounded-xl"
              onClick={() => setIsMenuOpen(false)}
            >
              Developer
            </Link>
            <Link
              href="/finance-calculators"
              className="block px-4 py-3 text-sm font-semibold text-center text-white bg-gradient-to-r from-primary-400 to-primary-600 rounded-xl mt-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Explore Tools
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
