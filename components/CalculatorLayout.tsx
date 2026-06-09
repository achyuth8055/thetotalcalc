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
    <section className="space-y-stack-lg">
      {(title?.trim() || description?.trim()) && (
        <div>
          {title && (
            <>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-surface-border bg-surface-container-low px-4 py-1 text-label-sm uppercase tracking-[0.3em] text-on-surface-variant">
                Calculator
              </div>
              <h1 className="mb-3 text-headline-lg text-primary">{title}</h1>
            </>
          )}
          {description && (
            <p className="max-w-3xl text-body-md leading-relaxed text-on-surface-variant">{description}</p>
          )}
        </div>
      )}

      {children}

      {explanation && (
        <div className="premium-card rounded-xl p-stack-lg text-on-surface-variant">
          <div className="mb-stack-md flex items-start gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-fixed text-primary">
              <span className="material-symbols-outlined">menu_book</span>
            </div>
            <div>
              <p className="mb-1 text-label-sm uppercase tracking-[0.3em] text-on-surface-variant">Guide</p>
              <h2 className="text-headline-md text-primary">How it works</h2>
            </div>
          </div>
          <div className="max-w-none">{explanation}</div>
        </div>
      )}

      {faqs && faqs.length > 0 && (
        <div className="grid gap-4">
          {faqs.map((faq, index) => (
            <details
              key={index}
              className="premium-card group rounded-xl p-stack-md transition-all"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between text-label-md text-primary">
                <span>{faq.question}</span>
                <span className="material-symbols-outlined text-on-surface-variant transition-transform group-open:rotate-180">
                  expand_more
                </span>
              </summary>
              <p className="mt-3 text-body-md leading-relaxed text-on-surface-variant">{faq.answer}</p>
            </details>
          ))}
        </div>
      )}

      {relatedCalculators && relatedCalculators.length > 0 && (
        <div className="rounded-xl border border-surface-border bg-surface-container-low p-stack-md">
          <div className="mb-stack-md flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-label-sm uppercase tracking-[0.3em] text-on-surface-variant">Next steps</p>
              <h2 className="text-headline-md text-primary">Related Calculators</h2>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            {relatedCalculators.map((calc, index) => (
              <a
                key={index}
                href={calc.href}
                className="rounded-full border border-surface-border bg-white px-4 py-2 text-label-md text-primary transition-colors hover:border-primary hover:bg-primary-fixed"
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
