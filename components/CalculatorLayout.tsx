"use client";

import { ReactNode } from "react";

interface CalculatorLayoutProps {
  title: string;
  description: string;
  children: ReactNode;
  explanation?: ReactNode;
  faqs?: { question: string; answer: string }[];
  relatedCalculators?: { name: string; href: string }[];
}

export default function CalculatorLayout({
  title,
  description,
  children,
  explanation,
  faqs,
  relatedCalculators,
}: CalculatorLayoutProps) {
  return (
    <div className="space-y-8">
      {/* Description */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-3">{title}</h1>
        <p className="text-gray-600">{description}</p>
      </div>

      {/* Calculator Card */}
      <div className="bg-white rounded-lg shadow-lg p-6 md:p-8 border border-gray-200">
        {children}
      </div>

      {/* Explanation Section */}
      {explanation && (
        <div className="bg-gray-50 rounded-lg p-6 md:p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">How It Works</h2>
          <div className="prose max-w-none text-gray-700">
            {explanation}
          </div>
        </div>
      )}

      {/* FAQs */}
      {faqs && faqs.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div key={index}>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {faq.question}
                </h3>
                <p className="text-gray-700">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Related Calculators */}
      {relatedCalculators && relatedCalculators.length > 0 && (
        <div className="bg-gray-50 rounded-lg p-6 md:p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Related Calculators
          </h2>
          <div className="flex flex-wrap gap-3">
            {relatedCalculators.map((calc, index) => (
              <a
                key={index}
                href={calc.href}
                className="px-4 py-2 bg-white border border-gray-300 rounded-md hover:border-primary-500 hover:text-primary-600 transition-colors"
              >
                {calc.name}
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
