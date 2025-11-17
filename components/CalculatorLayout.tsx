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
    <section className="space-y-10">
      {(title?.trim() || description?.trim()) && (
        <div className="text-center md:text-left">
          {title && (
            <>
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/30 text-[11px] uppercase tracking-[0.4em] px-4 py-1 text-white/70 mb-3">
                Calculator
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">{title}</h1>
            </>
          )}
          <p className="text-base text-white/70 max-w-3xl mx-auto md:mx-0 leading-relaxed">
            {description}
          </p>
        </div>
      )}

      <div className="rounded-[32px] bg-gradient-to-br from-white via-slate-50 to-slate-100 shadow-[0_25px_90px_rgba(15,23,42,0.2)] border border-white/60 p-6 md:p-10">
        {children}
      </div>

      {explanation && (
        <div className="glow-card p-6 md:p-10 text-white/80">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-xl text-white">?</div>
            <div>
              <p className="text-sm uppercase tracking-[0.4em] text-white/60 mb-1">Guide</p>
              <h2 className="text-2xl font-bold text-white">How it works</h2>
            </div>
          </div>
          <div className="prose prose-invert max-w-none text-white/80">
            {explanation}
          </div>
        </div>
      )}

      {faqs && faqs.length > 0 && (
        <div className="grid gap-4">
          {faqs.map((faq, index) => (
            <details
              key={index}
              className="group rounded-2xl border border-white/10 bg-white/5 backdrop-blur-lg p-5 text-white/80 transition-all duration-300 hover:border-primary-400/50"
            >
              <summary className="flex items-center justify-between cursor-pointer text-lg font-semibold text-white list-none">
                <span>{faq.question}</span>
                <svg
                  className="w-5 h-5 text-white/60 transition-transform duration-300 group-open:rotate-45"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </summary>
              <p className="mt-3 text-sm text-white/70 leading-relaxed">
                {faq.answer}
              </p>
            </details>
          ))}
        </div>
      )}

      {relatedCalculators && relatedCalculators.length > 0 && (
        <div className="glass-panel rounded-2xl p-6 md:p-8">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-white/60">Next steps</p>
              <h2 className="text-xl font-semibold text-white">Related Calculators</h2>
            </div>
            <div className="h-px flex-1 bg-gradient-to-r from-white/0 via-white/40 to-white/0" />
          </div>
          <div className="flex flex-wrap gap-3">
            {relatedCalculators.map((calc, index) => (
              <a
                key={index}
                href={calc.href}
                className="px-4 py-2 rounded-full bg-white/10 text-white text-sm font-medium border border-white/20 hover:border-primary-300 hover:bg-primary-300/20 transition-colors"
              >
                {calc.name}
              </a>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
