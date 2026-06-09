import Link from "next/link";
import {
  DIRECTORY,
  CATEGORY_LABELS,
  type DirectoryEntry,
  type DirectoryCategory,
  type DirectoryRegion,
} from "@/data/directory";

// Reusable, data-driven internal-linking blocks. No "use client" and no
// server-only APIs, so these render in both server pages (e.g. /calc/[slug])
// and client pages (CalculatorLayout).

function dedupe(entries: DirectoryEntry[], currentHref?: string): DirectoryEntry[] {
  const seen = new Set<string>();
  const out: DirectoryEntry[] = [];
  for (const e of entries) {
    if (e.href === currentHref || seen.has(e.href)) continue;
    seen.add(e.href);
    out.push(e);
  }
  return out;
}

function LinkCard({ entry }: { entry: DirectoryEntry }) {
  return (
    <Link
      href={entry.href}
      className="group flex items-start gap-3 rounded-xl border border-surface-border bg-surface-container-lowest p-stack-md transition-colors hover:border-primary"
    >
      <span className="material-symbols-outlined mt-0.5 text-[20px] text-primary">{entry.icon}</span>
      <span className="min-w-0">
        <span className="block truncate text-label-md font-semibold text-primary group-hover:underline">
          {entry.name}
        </span>
        <span className="line-clamp-2 text-label-sm text-on-surface-variant">{entry.description}</span>
      </span>
    </Link>
  );
}

function Block({ title, kicker, entries }: { title: string; kicker: string; entries: DirectoryEntry[] }) {
  if (entries.length === 0) return null;
  return (
    <section className="rounded-xl border border-surface-border bg-surface-container-low p-stack-md">
      <p className="text-label-sm uppercase tracking-[0.3em] text-on-surface-variant">{kicker}</p>
      <h2 className="mb-stack-md text-headline-md text-primary">{title}</h2>
      <div className="grid gap-3 sm:grid-cols-2">
        {entries.map((e) => (
          <LinkCard key={e.href} entry={e} />
        ))}
      </div>
    </section>
  );
}

export function RelatedCalculators({
  category,
  currentHref,
  limit = 4,
}: {
  category: DirectoryCategory;
  currentHref?: string;
  limit?: number;
}) {
  const entries = dedupe(
    DIRECTORY.filter((e) => e.live && e.category === category),
    currentHref,
  ).slice(0, limit);
  return <Block kicker="Related" title="Related calculators" entries={entries} />;
}

export function PopularInRegion({
  region,
  currentHref,
  limit = 4,
}: {
  region: DirectoryRegion;
  currentHref?: string;
  limit?: number;
}) {
  if (region === "Global") return null;
  const entries = dedupe(
    DIRECTORY.filter((e) => e.live && e.region === region),
    currentHref,
  ).slice(0, limit);
  return <Block kicker={`Popular in ${region}`} title={`More for ${region}`} entries={entries} />;
}

// A curated, high-intent set users commonly move to next.
const NEXT_PRIORITY: DirectoryCategory[] = ["salary", "tax-credits", "benefits", "property-tax", "finance"];

export function NextToTry({ currentHref, limit = 4 }: { currentHref?: string; limit?: number }) {
  const ranked = [...DIRECTORY.filter((e) => e.live)].sort(
    (a, b) => NEXT_PRIORITY.indexOf(a.category) - NEXT_PRIORITY.indexOf(b.category),
  );
  const entries = dedupe(ranked, currentHref).slice(0, limit);
  return <Block kicker="Keep going" title="Next calculators to try" entries={entries} />;
}

// Map a calculator category to the relevant guide/hub pages.
const GUIDE_LINKS: Partial<Record<DirectoryCategory, { label: string; href: string }[]>> = {
  salary: [
    { label: "Salary After Tax guide", href: "/salary-after-tax" },
    { label: "Self-Employed Tax guide", href: "/self-employed-tax" },
  ],
  "tax-credits": [
    { label: "Tax Credits guide", href: "/tax-credits" },
    { label: "Salary After Tax guide", href: "/salary-after-tax" },
  ],
  benefits: [
    { label: "Benefits guide", href: "/benefits" },
    { label: "Tax Credits guide", href: "/tax-credits" },
  ],
  "property-tax": [
    { label: "Property Tax guide", href: "/property-tax" },
    { label: "Property Tax Exemptions", href: "/property-tax/exemptions" },
  ],
};

export function GuidesRelated({ category }: { category: DirectoryCategory }) {
  const links = GUIDE_LINKS[category];
  if (!links || links.length === 0) return null;
  return (
    <section className="rounded-xl border border-surface-border bg-surface-container-low p-stack-md">
      <p className="text-label-sm uppercase tracking-[0.3em] text-on-surface-variant">Learn more</p>
      <h2 className="mb-stack-md text-headline-md text-primary">Guides related to this calculator</h2>
      <ul className="flex flex-wrap gap-3">
        {links.map((l) => (
          <li key={l.href}>
            <Link
              href={l.href}
              className="inline-flex items-center gap-2 rounded-full border border-surface-border bg-surface-container-lowest px-4 py-2 text-label-md text-primary transition-colors hover:border-primary"
            >
              <span className="material-symbols-outlined text-[18px]">menu_book</span>
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

// Convenience wrapper used on calculator pages.
export function CalculatorLinks({
  category,
  region,
  currentHref,
}: {
  category: DirectoryCategory;
  region: DirectoryRegion;
  currentHref?: string;
}) {
  return (
    <div className="mt-stack-lg flex flex-col gap-stack-md">
      <RelatedCalculators category={category} currentHref={currentHref} />
      <PopularInRegion region={region} currentHref={currentHref} />
      <GuidesRelated category={category} />
      <NextToTry currentHref={currentHref} />
    </div>
  );
}
