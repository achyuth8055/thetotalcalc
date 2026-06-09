"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  DIRECTORY,
  CATEGORY_LABELS,
  type DirectoryCategory,
  type DirectoryEntry,
} from "@/data/directory";
import { useRegion } from "@/components/RegionContext";
import { useT } from "@/components/LanguageContext";
import { REGION_NAMES, REGION_ORDER, isValidRegion, type DetectableRegion } from "@/lib/region-detection";
import { RegionFlag } from "@/components/RegionFlag";

const REGION_OPTIONS: DetectableRegion[] = REGION_ORDER;

const FILTER_CATEGORIES: DirectoryCategory[] = [
  "benefits",
  "property-tax",
  "tax-credits",
  "salary",
  "finance",
  "engineering",
  "health",
  "math",
  "converters",
  "date",
  "everyday",
  "developer",
];

const PAGE_SIZE = 8;

const ICON_BG: Record<string, string> = {
  benefits: "bg-primary-fixed text-primary",
  "property-tax": "bg-secondary-fixed text-on-secondary-fixed-variant",
  "tax-credits": "bg-tertiary-fixed text-on-tertiary-fixed-variant",
  salary: "bg-secondary-container text-on-secondary-container",
  finance: "bg-primary-fixed text-primary",
  engineering: "bg-surface-container-high text-primary",
};

export default function DirectoryClient() {
  const params = useSearchParams();
  const { region, setRegion, autoDetected } = useRegion();
  const t = useT();

  const initialCategory = params.get("category") ?? "";
  const initialQuery = params.get("q") ?? "";
  const paramRegion = params.get("region");

  const [query, setQuery] = useState(initialQuery);
  const [categories, setCategories] = useState<Set<string>>(
    new Set(initialCategory ? [initialCategory] : [])
  );
  const [page, setPage] = useState(1);

  // A ?region= query param is an explicit choice - apply it once on mount.
  useEffect(() => {
    if (isValidRegion(paramRegion)) setRegion(paramRegion);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Reset to first page whenever the effective filters change.
  useEffect(() => setPage(1), [region, query, categories]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return DIRECTORY.filter((e) => {
      // Region: when a specific region is selected, show that region's tools
      // plus region-agnostic ("Global") tools.
      if (region !== "Global" && e.region !== region && e.region !== "Global") return false;
      if (categories.size > 0 && !categories.has(e.category)) return false;
      if (q && !`${e.name} ${e.description}`.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [query, region, categories]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pageItems = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const toggleCategory = (c: string) =>
    setCategories((prev) => {
      const next = new Set(prev);
      next.has(c) ? next.delete(c) : next.add(c);
      return next;
    });

  const resetFilters = () => {
    setQuery("");
    setCategories(new Set());
    setRegion("Global");
  };

  return (
    <div className="flex flex-col gap-gutter lg:flex-row">
      {/* Filters */}
      <aside className="w-full flex-shrink-0 lg:w-72">
        <div className="card-shadow sticky top-24 rounded-xl border border-surface-border bg-surface-container-lowest p-stack-lg">
          <div className="mb-stack-md flex items-center justify-between">
            <h2 className="text-label-md uppercase tracking-wider text-primary">{t("dir.filters")}</h2>
            <button onClick={resetFilters} className="text-label-sm text-outline transition-colors hover:text-primary">
              {t("dir.reset")}
            </button>
          </div>
          <div className="space-y-stack-md">
            <div>
              <label className="mb-1 block text-label-sm text-on-surface-variant">{t("dir.country")}</label>
              <select
                value={region}
                onChange={(e) => setRegion(e.target.value as DetectableRegion)}
                className="w-full rounded-lg border border-surface-border bg-surface p-2 text-body-md text-on-surface focus:border-primary focus:ring-1 focus:ring-primary/20"
              >
                {REGION_OPTIONS.map((r) => (
                  <option key={r} value={r}>
                    {r === "Global" ? t("common.allRegions") : REGION_NAMES[r]}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-label-sm text-on-surface-variant">{t("dir.category")}</label>
              <div className="mt-2 space-y-2">
                {FILTER_CATEGORIES.map((c) => (
                  <label key={c} className="flex cursor-pointer items-center gap-2">
                    <input
                      type="checkbox"
                      checked={categories.has(c)}
                      onChange={() => toggleCategory(c)}
                      className="rounded border-outline text-primary focus:ring-primary"
                    />
                    <span className="text-body-md text-on-surface">{CATEGORY_LABELS[c]}</span>
                  </label>
                ))}
              </div>
            </div>
            <div>
              <label className="mb-1 block text-label-sm text-on-surface-variant">{t("dir.taxYear")}</label>
              <div className="grid grid-cols-2 gap-2">
                <button className="rounded-lg bg-primary px-3 py-2 text-label-md text-on-primary">2025</button>
                <button className="rounded-lg border border-surface-border bg-surface px-3 py-2 text-label-md text-on-surface transition-colors hover:bg-surface-container-high">
                  2024
                </button>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Grid */}
      <div className="flex-grow">
        {/* Region detection hint */}
        {region !== "Global" && (
          <div className="mb-stack-md flex flex-wrap items-center gap-2 rounded-lg border border-surface-border bg-primary-fixed/60 px-4 py-2 text-label-sm text-primary">
            <span className="material-symbols-outlined text-[18px]">location_on</span>
            <span>
              {t("dir.showingFor")} <span className="inline-flex items-center gap-1 font-bold"><RegionFlag region={region} /> {REGION_NAMES[region]}</span>
              {autoDetected ? " (auto-detected)" : ""}
            </span>
            <button onClick={() => setRegion("Global")} className="ml-auto font-semibold text-secondary underline">
              {t("dir.showAll")}
            </button>
          </div>
        )}

        <div className="mb-stack-lg flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-body-md text-on-surface-variant">
            <span className="font-bold text-primary">{filtered.length}</span> {t("dir.tools")}
          </p>
          <div className="relative w-full md:w-96">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">search</span>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t("dir.searchPh")}
              className="card-shadow w-full rounded-full border border-surface-border bg-surface-container-lowest py-2 pl-10 pr-4 text-body-md focus:border-primary focus:ring-1 focus:ring-primary/20"
            />
          </div>
        </div>

        {pageItems.length === 0 ? (
          <div className="py-16 text-center">
            <div className="mb-stack-md inline-flex h-24 w-24 items-center justify-center rounded-full bg-surface-container-high">
              <span className="material-symbols-outlined text-[48px] text-outline">search_off</span>
            </div>
            <h3 className="text-headline-md text-primary">{t("dir.none")}</h3>
            <p className="mx-auto mt-2 max-w-sm text-body-md text-on-surface-variant">
              Try adjusting your filters or search terms.
            </p>
            <button onClick={resetFilters} className="mt-stack-md text-label-md text-primary underline">
              Clear all filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-stack-lg md:grid-cols-2">
            {pageItems.map((entry) => (
              <Card key={entry.id} entry={entry} />
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div className="mt-stack-lg flex items-center justify-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={safePage === 1}
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-surface-border bg-surface text-on-surface transition-colors hover:bg-surface-container-high disabled:opacity-40"
            >
              <span className="material-symbols-outlined">chevron_left</span>
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`h-10 w-10 rounded-lg text-label-md transition-colors ${
                  p === safePage
                    ? "bg-primary text-on-primary"
                    : "border border-surface-border bg-surface text-on-surface hover:bg-surface-container-high"
                }`}
              >
                {p}
              </button>
            ))}
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={safePage === totalPages}
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-surface-border bg-surface text-on-surface transition-colors hover:bg-surface-container-high disabled:opacity-40"
            >
              <span className="material-symbols-outlined">chevron_right</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function Card({ entry }: { entry: DirectoryEntry }) {
  const iconBg = ICON_BG[entry.category] ?? "bg-surface-container text-primary";

  return (
    <div className="card-shadow card-hover relative flex h-full flex-col rounded-xl border border-surface-border bg-surface-container-lowest p-stack-lg">
      <div className="mb-stack-md flex items-start justify-between">
        <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${iconBg}`}>
          <span className="material-symbols-outlined text-[28px]">{entry.icon}</span>
        </div>
        <span className="material-symbols-outlined text-outline">bookmark</span>
      </div>
      <h3 className="mb-1 text-headline-md text-primary">{entry.name}</h3>
      <p className="mb-stack-lg flex-grow text-body-md text-on-surface-variant">{entry.description}</p>
      <div className="mb-stack-md flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-1 text-label-sm text-on-surface-variant">
          <span className="material-symbols-outlined text-[18px]">schedule</span>
          {entry.minutes} min
        </div>
        {entry.region !== "Global" && (
          <span className="inline-flex items-center gap-1 rounded-full bg-surface-container px-2 py-0.5 text-label-sm text-on-surface-variant">
            <RegionFlag region={entry.region as DetectableRegion} /> {entry.region}
          </span>
        )}
        <div
          className={`rounded-full border px-2 py-0.5 text-label-sm ${
            entry.badge === "official"
              ? "border-secondary bg-secondary-container text-on-secondary-container"
              : "border-outline-variant bg-surface-container text-on-surface-variant"
          }`}
        >
          {entry.badge === "official" ? "Official Source" : "Institutional Tool"}
        </div>
        {!entry.live && (
          <span className="rounded-full bg-surface-container-high px-2 py-0.5 text-label-sm text-on-surface-variant">
            Coming soon
          </span>
        )}
      </div>
      {entry.live ? (
        <Link
          href={entry.href}
          className="w-full rounded-lg bg-primary py-3 text-center text-label-md text-on-primary transition-all hover:bg-primary-container"
        >
          {entry.cta}
        </Link>
      ) : (
        <span className="w-full cursor-not-allowed rounded-lg border border-surface-border bg-surface-container py-3 text-center text-label-md text-on-surface-variant">
          {entry.cta}
        </span>
      )}
    </div>
  );
}
