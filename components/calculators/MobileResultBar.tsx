"use client";

import { useEffect, useState } from "react";

type Tone = "primary" | "positive" | "warning" | "neutral";

// Tone colours mirror the result badges used elsewhere (ResultPanel / globals.css)
// so the bar feels native to the rest of the app.
const TONE_CLASS: Record<Tone, string> = {
  primary: "bg-primary text-on-primary",
  positive: "bg-[#2f855a] text-white",
  warning: "bg-[#b7791f] text-white",
  neutral: "bg-[#1a365d] text-white",
};

export interface MobileResultBarProps {
  /** Small uppercase label, e.g. "Monthly payment" or "Your BMI". */
  label: string;
  /** The headline figure/outcome, already formatted, e.g. "$1,240" or "24.2 (Normal)". */
  value: string;
  /** Optional secondary line, e.g. "Total interest $98,210". */
  sub?: string;
  tone?: Tone;
  /** id of the full results section to scroll to on tap. */
  targetId?: string;
  /** Render only when there is a result to show. */
  show?: boolean;
}

/**
 * Sticky bottom summary bar shown on mobile only. It surfaces the primary
 * result the instant it is computed so first-time users never have to hunt for
 * it, and politely hides itself once the full results section scrolls into
 * view. Announced to screen readers via aria-live.
 */
export default function MobileResultBar({
  label,
  value,
  sub,
  tone = "primary",
  targetId = "results",
  show = true,
}: MobileResultBarProps) {
  const [resultInView, setResultInView] = useState(false);

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;
    const el = document.getElementById(targetId);
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => setResultInView(entry.isIntersecting),
      { rootMargin: "-15% 0px -25% 0px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [targetId, show, value]);

  if (!show || !value) return null;

  const jump = () =>
    document
      .getElementById(targetId)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-40 md:hidden transition-transform duration-200 ${
        resultInView ? "translate-y-full" : "translate-y-0"
      }`}
      role="status"
      aria-live="polite"
    >
      <button
        type="button"
        onClick={jump}
        className={`flex w-full items-center justify-between gap-3 px-4 py-3 text-left shadow-[0_-4px_16px_rgba(0,0,0,0.16)] ${TONE_CLASS[tone]}`}
        style={{ paddingBottom: "calc(0.75rem + env(safe-area-inset-bottom))" }}
        aria-label={`${label}: ${value}. Tap to view full results.`}
      >
        <span className="min-w-0">
          <span className="block text-[11px] font-semibold uppercase tracking-wide opacity-80">
            {label}
          </span>
          <span className="block truncate text-lg font-bold leading-tight">{value}</span>
          {sub && <span className="block truncate text-xs opacity-90">{sub}</span>}
        </span>
        <span className="flex shrink-0 items-center gap-1 rounded-full bg-white/15 px-3 py-1.5 text-sm font-semibold">
          View
          <span className="material-symbols-outlined text-[18px]">arrow_downward</span>
        </span>
      </button>
    </div>
  );
}
