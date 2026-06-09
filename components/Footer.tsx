"use client";

import Link from "next/link";
import { useT } from "@/components/LanguageContext";

const COLUMNS: { headingKey: string; links: { label: string; href: string }[] }[] = [
  {
    headingKey: "footer.resources",
    links: [
      { label: "Calculators", href: "/calculators" },
      { label: "Benefits", href: "/calculators?category=benefits" },
      { label: "Property Tax", href: "/calculators?category=property-tax" },
      { label: "Blog", href: "/blog" },
    ],
  },
  {
    headingKey: "footer.legal",
    links: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Cookie Policy", href: "/cookie-policy" },
      { label: "Terms of Service", href: "/terms" },
      { label: "Accessibility", href: "/accessibility" },
      { label: "Advertising Disclosure", href: "/advertising-disclosure" },
    ],
  },
  {
    headingKey: "footer.company",
    links: [
      { label: "About", href: "/about" },
      { label: "Contact", href: "/contact" },
      { label: "Methodology", href: "/methodology" },
      { label: "Editorial Policy", href: "/editorial-policy" },
      { label: "Corrections", href: "/corrections" },
      { label: "AI Use Policy", href: "/ai-use" },
    ],
  },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const t = useT();

  return (
    <footer className="mt-auto border-t border-surface-border bg-surface-container-highest">
      <div className="mx-auto flex w-full max-w-container-max flex-col gap-stack-md px-margin-mobile py-stack-lg md:px-margin-desktop">
        <div className="grid grid-cols-2 gap-gutter md:grid-cols-4 lg:grid-cols-5">
          {/* Brand */}
          <div className="col-span-2 lg:col-span-1">
            <div className="mb-4 flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-on-primary">
                <span className="material-symbols-outlined text-[16px]">savings</span>
              </span>
              <span className="text-headline-md text-primary">OnlineCalc</span>
            </div>
            <p className="max-w-xs text-label-sm text-on-surface-variant">
              Free, region-aware calculators and eligibility checks for benefits, taxes, and property -
              built on official sources.
            </p>
          </div>

          {COLUMNS.map((col) => (
            <div key={col.headingKey}>
              <h5 className="mb-4 text-label-md text-primary">{t(col.headingKey)}</h5>
              <ul className="space-y-2 text-label-sm text-on-surface-variant">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="transition-colors hover:text-primary">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Subscribe */}
          <div className="col-span-2 lg:col-span-1">
            <h5 className="mb-4 text-label-md text-primary">{t("footer.stayUpdated")}</h5>
            <form className="flex gap-2">
              <input
                type="email"
                placeholder="Email"
                className="w-full rounded-lg border border-surface-border bg-surface px-3 text-label-sm text-on-surface focus:border-primary focus:ring-1 focus:ring-primary"
              />
              <button
                type="submit"
                aria-label="Subscribe"
                className="material-symbols-outlined rounded-lg bg-primary p-2 text-on-primary"
              >
                send
              </button>
            </form>
          </div>
        </div>

        <div className="mt-stack-md border-t border-outline-variant pt-stack-md">
          <p className="text-center text-label-sm text-on-surface-variant">
            © {currentYear} OnlineCalc. All rights reserved.{" "}
            <span className="block text-[11px] opacity-70 md:inline">
              Disclaimer: OnlineCalc is an informational tool and does not constitute tax, legal, or
              financial advice. Always consult a qualified professional.
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
}
