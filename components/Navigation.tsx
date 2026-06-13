"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRegion } from "@/components/RegionContext";
import { useLanguage } from "@/components/LanguageContext";
import { REGION_ORDER, REGION_NAMES, type DetectableRegion } from "@/lib/region-detection";
import { LANGUAGES } from "@/lib/languages";

const NAV_LINKS = [
  { key: "nav.calculators", href: "/calculators" },
  { key: "nav.benefits", href: "/calculators?category=benefits" },
  { key: "nav.propertyTax", href: "/calculators?category=property-tax" },
  { key: "nav.taxCredits", href: "/calculators?category=tax-credits" },
  { key: "nav.blog", href: "/blog" },
];

export default function Navigation() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const { region, setRegion } = useRegion();
  const { lang, setLang, t } = useLanguage();

  const isActive = (href: string) => {
    const base = href.split("?")[0];
    return base === "/calculators" ? pathname.startsWith("/calculators") : pathname === base;
  };

  return (
    <header className="sticky top-0 z-50 border-b border-surface-border bg-surface shadow-sm">
      <div className="mx-auto flex h-16 w-full max-w-container-max items-center justify-between px-margin-mobile md:px-margin-desktop">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-on-primary">
            <span className="material-symbols-outlined text-[20px]">savings</span>
          </span>
          <span className="text-headline-md font-bold text-primary">OnlineCalc</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-gutter lg:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.key}
              href={link.href}
              className={`pb-1 text-label-md transition-colors ${
                isActive(link.href)
                  ? "border-b-2 border-primary text-primary"
                  : "text-on-surface-variant hover:text-primary"
              }`}
            >
              {t(link.key)}
            </Link>
          ))}
        </nav>

        {/* Right controls */}
        <div className="flex items-center gap-stack-sm">
          {/* Region */}
          <div className="hidden items-center gap-1 rounded-lg border border-surface-border bg-surface-container-low px-2 py-1.5 sm:flex">
            <span className="material-symbols-outlined text-[18px] text-on-surface-variant">public</span>
            <select
              aria-label="Region"
              value={region}
              onChange={(e) => setRegion(e.target.value as DetectableRegion)}
              className="cursor-pointer border-none bg-transparent p-0 pr-1 text-label-sm text-on-surface focus:outline-none focus:ring-0"
            >
              {REGION_ORDER.map((r) => (
                <option key={r} value={r}>
                  {r === "Global" ? "All" : r}
                </option>
              ))}
            </select>
          </div>

          {/* Language */}
          <div className="hidden items-center gap-1 rounded-lg border border-surface-border bg-surface-container-low px-2 py-1.5 md:flex">
            <span className="material-symbols-outlined text-[18px] text-on-surface-variant">translate</span>
            <select
              aria-label="Language"
              value={lang}
              onChange={(e) => setLang(e.target.value)}
              className="cursor-pointer border-none bg-transparent p-0 pr-1 text-label-sm text-on-surface focus:outline-none focus:ring-0"
            >
              {LANGUAGES.map((l) => (
                <option key={l.code} value={l.code}>
                  {l.label}
                </option>
              ))}
            </select>
          </div>

          <Link
            href="/calculators"
            aria-label="Search calculators"
            className="material-symbols-outlined text-on-surface-variant transition-colors hover:text-primary"
          >
            search
          </Link>
          <button
            aria-label="Toggle menu"
            onClick={() => setMobileOpen((v) => !v)}
            className="material-symbols-outlined text-primary lg:hidden"
          >
            {mobileOpen ? "close" : "menu"}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <nav className="border-t border-surface-border bg-surface px-margin-mobile py-stack-md lg:hidden">
          <div className="flex flex-col gap-1">
            {[...NAV_LINKS, { key: "nav.about", href: "/about" }].map((link) => (
              <Link
                key={link.key}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="rounded-lg px-3 py-2 text-label-md text-on-surface-variant hover:bg-surface-container-low hover:text-primary"
              >
                {t(link.key)}
              </Link>
            ))}

            <div className="mt-2 grid grid-cols-2 gap-2 border-t border-surface-border pt-3">
              <label className="flex flex-col gap-1 text-label-sm text-on-surface-variant">
                Region
                <select
                  value={region}
                  onChange={(e) => setRegion(e.target.value as DetectableRegion)}
                  className="rounded-lg border border-surface-border bg-surface p-2 text-body-md text-on-surface focus:border-primary focus:outline-none"
                >
                  {REGION_ORDER.map((r) => (
                    <option key={r} value={r}>
                      {REGION_NAMES[r]}
                    </option>
                  ))}
                </select>
              </label>
              <label className="flex flex-col gap-1 text-label-sm text-on-surface-variant">
                Language
                <select
                  value={lang}
                  onChange={(e) => setLang(e.target.value)}
                  className="rounded-lg border border-surface-border bg-surface p-2 text-body-md text-on-surface focus:border-primary focus:outline-none"
                >
                  {LANGUAGES.map((l) => (
                    <option key={l.code} value={l.code}>
                      {l.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </div>
        </nav>
      )}
    </header>
  );
}
