"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useT } from "@/components/LanguageContext";

const KEY = "cookieConsent"; // "accepted" | "rejected"

type Gtag = (...args: unknown[]) => void;

function updateConsent(granted: boolean) {
  if (typeof window === "undefined") return;
  const w = window as unknown as { dataLayer?: unknown[]; gtag?: Gtag };
  w.dataLayer = w.dataLayer || [];
  const gtag: Gtag = w.gtag || ((...args: unknown[]) => w.dataLayer!.push(args));
  const value = granted ? "granted" : "denied";
  gtag("consent", "update", {
    ad_storage: value,
    ad_user_data: value,
    ad_personalization: value,
    analytics_storage: value,
  });
}

export default function CookieConsent() {
  const t = useT();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem(KEY);
    if (stored === "accepted") updateConsent(true);
    else if (stored === "rejected") updateConsent(false);
    else setVisible(true);
  }, []);

  const choose = (accepted: boolean) => {
    window.localStorage.setItem(KEY, accepted ? "accepted" : "rejected");
    updateConsent(accepted);
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-[60] p-3 sm:p-4">
      <div className="mx-auto flex max-w-container-max flex-col gap-3 rounded-xl border border-surface-border bg-surface-container-lowest p-4 shadow-lg sm:flex-row sm:items-center">
        <div className="flex items-start gap-3">
          <span className="material-symbols-outlined text-primary">cookie</span>
          <p className="text-label-md text-on-surface-variant">
            {t("consent.text")} See our{" "}
            <Link href="/privacy" className="text-secondary underline">Privacy Policy</Link> &amp;{" "}
            <Link href="/advertising-disclosure" className="text-secondary underline">Advertising Disclosure</Link>.
          </p>
        </div>
        <div className="flex flex-shrink-0 gap-2 sm:ml-auto">
          <button
            onClick={() => choose(false)}
            className="rounded-lg border border-surface-border px-4 py-2 text-label-md font-semibold text-primary transition-colors hover:bg-surface-container-low"
          >
            {t("consent.reject")}
          </button>
          <button
            onClick={() => choose(true)}
            className="rounded-lg bg-primary px-4 py-2 text-label-md font-bold text-on-primary transition-colors hover:bg-primary-container"
          >
            {t("consent.accept")}
          </button>
        </div>
      </div>
    </div>
  );
}
