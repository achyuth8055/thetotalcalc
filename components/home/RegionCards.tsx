"use client";

import Link from "next/link";
import { useRegion } from "@/components/RegionContext";
import { REGION_NAMES, type DetectableRegion } from "@/lib/region-detection";
import { RegionFlag } from "@/components/RegionFlag";

const CARDS: { code: DetectableRegion; note: string }[] = [
  { code: "US", note: "Federal & State Programs" },
  { code: "CA", note: "CRA & Provincial Credits" },
  { code: "UK", note: "Council & HMRC Rebates" },
  { code: "DE", note: "Kindergeld & Tax Relief" },
  { code: "CH", note: "Cantonal Tax & Benefits" },
  { code: "NO", note: "NAV & Skatteetaten" },
  { code: "NZ", note: "IRD & Working for Families" },
  { code: "AU", note: "ATO & Centrelink" },
];

export default function RegionCards() {
  const { region, setRegion, autoDetected } = useRegion();

  return (
    <div className="grid grid-cols-1 gap-stack-md sm:grid-cols-2 lg:grid-cols-4">
      {CARDS.map((c) => {
        const active = region === c.code;
        return (
          <Link
            key={c.code}
            href={`/calculators?region=${c.code}`}
            onClick={() => setRegion(c.code)}
            className={`tonal-shadow card-hover group rounded-xl border bg-white p-stack-md transition-all ${
              active ? "border-primary ring-2 ring-primary/30" : "border-surface-border"
            }`}
          >
            <div className="flex items-center gap-stack-md">
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center overflow-hidden rounded-lg bg-surface-container-low">
                <RegionFlag region={c.code} className="h-7 w-auto rounded-sm" />
              </div>
              <div className="min-w-0 flex-grow">
                <h3 className="truncate text-headline-md text-primary">{REGION_NAMES[c.code]}</h3>
                <p className="truncate text-label-sm text-on-surface-variant">{c.note}</p>
              </div>
              {active && (
                <span className="flex-shrink-0 rounded-full bg-secondary-container px-2 py-0.5 text-label-sm text-on-secondary-container">
                  {autoDetected ? "Detected" : "Selected"}
                </span>
              )}
            </div>
          </Link>
        );
      })}
    </div>
  );
}
