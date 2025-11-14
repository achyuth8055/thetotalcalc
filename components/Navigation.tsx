"use client";

import Link from "next/link";
import { useState } from "react";

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 backdrop-blur-sm bg-white/95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 sm:space-x-3">
            <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-primary-600 to-primary-800 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-base sm:text-lg">=</span>
            </div>
            <span className="text-lg sm:text-xl font-bold text-gray-900">OnlineCalc</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            <Link href="/" className="px-3 xl:px-4 py-2 text-sm font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50 rounded-md transition-colors">
              Home
            </Link>
            <Link href="/finance-calculators" className="px-3 xl:px-4 py-2 text-sm font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50 rounded-md transition-colors">
              Finance
            </Link>
            <Link href="/math-calculators" className="px-3 xl:px-4 py-2 text-sm font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50 rounded-md transition-colors">
              Math
            </Link>
            <Link href="/health-calculators" className="px-3 xl:px-4 py-2 text-sm font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50 rounded-md transition-colors">
              Health
            </Link>
            <Link href="/date-calculators" className="px-3 xl:px-4 py-2 text-sm font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50 rounded-md transition-colors">
              Date & Time
            </Link>
            <Link href="/everyday-calculators" className="px-3 xl:px-4 py-2 text-sm font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50 rounded-md transition-colors">
              Everyday
            </Link>
            <Link href="/developer-calculators" className="px-3 xl:px-4 py-2 text-sm font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50 rounded-md transition-colors">
              Developer
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 rounded-md text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
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
              className="block px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/finance-calculators"
              className="block px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md"
              onClick={() => setIsMenuOpen(false)}
            >
              Finance
            </Link>
            <Link
              href="/math-calculators"
              className="block px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md"
              onClick={() => setIsMenuOpen(false)}
            >
              Math
            </Link>
            <Link
              href="/health-calculators"
              className="block px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md"
              onClick={() => setIsMenuOpen(false)}
            >
              Health
            </Link>
            <Link
              href="/date-calculators"
              className="block px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md"
              onClick={() => setIsMenuOpen(false)}
            >
              Date & Time
            </Link>
            <Link
              href="/everyday-calculators"
              className="block px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md"
              onClick={() => setIsMenuOpen(false)}
            >
              Everyday
            </Link>
            <Link
              href="/developer-calculators"
              className="block px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md"
              onClick={() => setIsMenuOpen(false)}
            >
              Developer
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
