"use client";

import type { ReactNode } from "react";

export const fmtUSD = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(
    Number.isFinite(n) ? n : 0,
  );

export const fmtNum = (n: number, digits = 0) =>
  new Intl.NumberFormat("en-US", { maximumFractionDigits: digits }).format(Number.isFinite(n) ? n : 0);

// Labeled numeric input with an optional range slider.
export function NumberField({
  label,
  value,
  onChange,
  min = 0,
  max,
  step = 1,
  prefix,
  suffix,
  slider = true,
  help,
}: {
  label: string;
  value: number;
  onChange: (n: number) => void;
  min?: number;
  max?: number;
  step?: number;
  prefix?: string;
  suffix?: string;
  slider?: boolean;
  help?: string;
}) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-label-sm font-semibold text-on-surface-variant">{label}</span>
      <div className="flex items-center gap-2 rounded-lg border border-surface-border bg-surface px-3 py-2 focus-within:border-primary">
        {prefix && <span className="text-label-md text-on-surface-variant">{prefix}</span>}
        <input
          type="number"
          inputMode="decimal"
          value={Number.isFinite(value) ? value : 0}
          min={min}
          max={max}
          step={step}
          onChange={(e) => onChange(e.target.value === "" ? 0 : Number(e.target.value))}
          className="w-full border-none bg-transparent text-body-md text-on-surface focus:outline-none focus:ring-0"
        />
        {suffix && <span className="text-label-md text-on-surface-variant">{suffix}</span>}
      </div>
      {slider && max !== undefined && (
        <input
          type="range"
          value={Number.isFinite(value) ? value : 0}
          min={min}
          max={max}
          step={step}
          onChange={(e) => onChange(Number(e.target.value))}
          className="accent-primary"
          aria-label={`${label} slider`}
        />
      )}
      {help && <span className="text-label-sm text-on-surface-variant">{help}</span>}
    </label>
  );
}

export function ResultCard({ children }: { children: ReactNode }) {
  return <div className="rounded-xl border border-surface-border bg-surface-container-lowest p-stack-md">{children}</div>;
}

export function PrimaryResult({ label, value, note }: { label: string; value: string; note?: string }) {
  return (
    <div className="rounded-xl border border-primary bg-primary-fixed p-stack-md">
      <p className="text-label-sm uppercase tracking-[0.2em] text-on-surface-variant">{label}</p>
      <p className="text-display-lg text-primary">{value}</p>
      {note && <p className="text-label-sm text-on-surface-variant">{note}</p>}
    </div>
  );
}

export function ResultRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b border-surface-border py-2 last:border-0">
      <span className="text-body-md text-on-surface-variant">{label}</span>
      <span className="text-body-md font-semibold text-primary">{value}</span>
    </div>
  );
}
