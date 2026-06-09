"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRegion } from "@/components/RegionContext";
import { useT } from "@/components/LanguageContext";
import { REGION_NAMES } from "@/lib/region-detection";
import { RegionFlag } from "@/components/RegionFlag";

const DISMISS_KEY = "regionBannerDismissed";

export default function RegionBanner() {
  const { region, autoDetected } = useRegion();
  const t = useT();
  const [dismissed, setDismissed] = useState(true); // default hidden (SSR-safe)

  useEffect(() => {
    setDismissed(window.sessionStorage.getItem(DISMISS_KEY) === "1");
  }, []);

  // Only show for an auto-detected, specific region.
  if (dismissed || !autoDetected || region === "Global") return null;

  const dismiss = () => {
    setDismissed(true);
    window.sessionStorage.setItem(DISMISS_KEY, "1");
  };

  return (
    <div className="border-b border-surface-border bg-primary-fixed">
      <div className="mx-auto flex max-w-container-max items-center gap-3 px-margin-mobile py-2 md:px-margin-desktop">
        <span className="material-symbols-outlined text-[20px] text-primary">location_on</span>
        <p className="flex-grow text-label-md text-primary">
          {t("banner.detected")}{" "}
          <span className="inline-flex items-center gap-1 font-bold">
            <RegionFlag region={region} /> {REGION_NAMES[region]}
          </span>
          .
        </p>
        <Link
          href={`/calculators?region=${region}`}
          className="flex items-center gap-1 rounded-lg bg-primary px-3 py-1.5 text-label-sm font-bold text-on-primary transition-colors hover:bg-primary-container"
        >
          {t("banner.proceed")} {REGION_NAMES[region]} {t("banner.calculators")}
          <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
        </Link>
        <button
          onClick={dismiss}
          aria-label="Dismiss"
          className="material-symbols-outlined text-on-surface-variant transition-colors hover:text-primary"
        >
          close
        </button>
      </div>
    </div>
  );
}
