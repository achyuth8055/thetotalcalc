"use client";

import { useState, useMemo } from "react";
import Breadcrumbs from "@/components/Breadcrumbs";
import CalculatorLayout from "@/components/CalculatorLayout";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell,
} from "recharts";

// ─── Unit conversions ─────────────────────────────────────────────────────────
const KM_PER_MILE = 1.609344;
const L_PER_US_GAL = 3.785411784;
const L_PER_UK_GAL = 4.54609;

type DistUnit = "miles" | "km";
type EffUnit = "mpg_us" | "mpg_uk" | "l_100km" | "km_l";
type PriceUnit = "us_gal" | "uk_gal" | "litre";
type Currency = "$" | "£" | "€" | "₹" | "¥";

// ─── Vehicle presets ──────────────────────────────────────────────────────────
const PRESETS = [
  { label: "Compact", eff: 35, unit: "mpg_us" as EffUnit },
  { label: "Midsize", eff: 28, unit: "mpg_us" as EffUnit },
  { label: "SUV",     eff: 22, unit: "mpg_us" as EffUnit },
  { label: "Truck",   eff: 17, unit: "mpg_us" as EffUnit },
  { label: "Hybrid",  eff: 50, unit: "mpg_us" as EffUnit },
  { label: "EV Range",eff: 0,  unit: "mpg_us" as EffUnit }, // placeholder for no-fuel
];

// ─── SVG Icons ────────────────────────────────────────────────────────────────
const Icons = {
  Road: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
      <path d="M3 17l3-10h12l3 10"/>
      <path d="M10 17V7M14 17V7"/>
      <path d="M3 17h18"/>
    </svg>
  ),
  Fuel: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
      <path d="M3 22V6a2 2 0 012-2h8a2 2 0 012 2v16"/>
      <path d="M3 22h12"/>
      <path d="M15 8h2a2 2 0 012 2v2a2 2 0 002 2v6a2 2 0 01-2 2"/>
      <path d="M9 6v4"/>
    </svg>
  ),
  Tag: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
      <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"/>
      <circle cx="7" cy="7" r="1.5" fill="currentColor" stroke="none"/>
    </svg>
  ),
  Repeat: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
      <polyline points="17 1 21 5 17 9"/>
      <path d="M3 11V9a4 4 0 014-4h14"/>
      <polyline points="7 23 3 19 7 15"/>
      <path d="M21 13v2a4 4 0 01-4 4H3"/>
    </svg>
  ),
  Car: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
      <path d="M5 17H3a2 2 0 01-2-2V9a2 2 0 012-2h1l2-4h10l2 4h1a2 2 0 012 2v6a2 2 0 01-2 2h-2"/>
      <circle cx="7.5" cy="17" r="2.5"/>
      <circle cx="16.5" cy="17" r="2.5"/>
    </svg>
  ),
  Dollar: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
      <line x1="12" y1="1" x2="12" y2="23"/>
      <path d="M17 5H9.5a3.5 3.5 0 100 7h5a3.5 3.5 0 110 7H6"/>
    </svg>
  ),
  TrendUp: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
      <polyline points="17 6 23 6 23 12"/>
    </svg>
  ),
  Download: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
      <polyline points="7 10 12 15 17 10"/>
      <line x1="12" y1="15" x2="12" y2="3"/>
    </svg>
  ),
  Droplet: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <path d="M12 2C6 10 4 14 4 16a8 8 0 0016 0c0-2-2-6-8-14z"/>
    </svg>
  ),
  Route: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <circle cx="6" cy="19" r="3"/>
      <path d="M9 19h8.5a3.5 3.5 0 000-7H5.5a3.5 3.5 0 010-7H14"/>
      <circle cx="18" cy="5" r="3"/>
    </svg>
  ),
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
function litresUsed(dist: number, distUnit: DistUnit, eff: number, effUnit: EffUnit): number {
  const km = distUnit === "miles" ? dist * KM_PER_MILE : dist;
  switch (effUnit) {
    case "mpg_us":  return (km / KM_PER_MILE) * (L_PER_US_GAL / eff);
    case "mpg_uk":  return (km / KM_PER_MILE) * (L_PER_UK_GAL / eff);
    case "l_100km": return km * (eff / 100);
    case "km_l":    return km / eff;
  }
}

function costFromLitres(litres: number, price: number, priceUnit: PriceUnit): number {
  switch (priceUnit) {
    case "us_gal": return (litres / L_PER_US_GAL) * price;
    case "uk_gal": return (litres / L_PER_UK_GAL) * price;
    case "litre":  return litres * price;
  }
}

function fuelInUnit(litres: number, priceUnit: PriceUnit): number {
  switch (priceUnit) {
    case "us_gal": return litres / L_PER_US_GAL;
    case "uk_gal": return litres / L_PER_UK_GAL;
    case "litre":  return litres;
  }
}

function priceUnitLabel(u: PriceUnit) {
  return u === "us_gal" ? "US gal" : u === "uk_gal" ? "UK gal" : "litres";
}

// ─── Slider + number input ────────────────────────────────────────────────────
function SliderInput({
  label, value, onChange, min, max, step, icon, suffix,
}: {
  label: string; value: number; onChange: (v: number) => void;
  min: number; max: number; step: number;
  icon?: React.ReactNode; suffix?: string;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2 text-label-md text-primary">
          {icon && <span className="text-on-surface-variant">{icon}</span>}
          <span>{label}</span>
        </div>
        <div className="flex items-center gap-1">
          <input
            type="number"
            value={value}
            onChange={e => onChange(Math.max(min, Math.min(max, Number(e.target.value) || min)))}
            className="w-24 rounded-lg border border-surface-border px-2 py-1.5 text-right text-label-md font-semibold text-primary outline-none focus:border-primary focus:ring-1 focus:ring-primary"
          />
          {suffix && <span className="text-label-sm text-on-surface-variant">{suffix}</span>}
        </div>
      </div>
      <input
        type="range" min={min} max={max} step={step} value={value}
        onChange={e => onChange(Number(e.target.value))}
        className="w-full h-2 bg-surface-container-high rounded-full appearance-none cursor-pointer accent-primary"
      />
      <div className="flex justify-between text-label-sm text-on-surface-variant mt-1">
        <span>{min}{suffix || ""}</span>
        <span>{max}{suffix || ""}</span>
      </div>
    </div>
  );
}

// ─── Stat card ────────────────────────────────────────────────────────────────
function StatCard({ label, value, sub, accent = false }: {
  label: string; value: string; sub?: string; accent?: boolean;
}) {
  return (
    <div className={`rounded-xl border p-4 ${accent ? "border-primary/20 bg-primary/5" : "border-surface-border bg-white"}`}>
      <p className="text-label-sm text-on-surface-variant mb-1">{label}</p>
      <p className={`text-headline-sm font-bold ${accent ? "text-primary" : "text-on-surface"}`}>{value}</p>
      {sub && <p className="text-label-sm text-on-surface-variant mt-0.5">{sub}</p>}
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function FuelCostCalculator() {
  const [distance, setDistance]       = useState(100);
  const [distUnit, setDistUnit]       = useState<DistUnit>("miles");
  const [eff, setEff]                 = useState(30);
  const [effUnit, setEffUnit]         = useState<EffUnit>("mpg_us");
  const [price, setPrice]             = useState(3.50);
  const [priceUnit, setPriceUnit]     = useState<PriceUnit>("us_gal");
  const [trips, setTrips]             = useState(1);
  const [currency, setCurrency]       = useState<Currency>("$");

  const fmt = (n: number) =>
    `${currency}${n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  const result = useMemo(() => {
    if (!(distance > 0) || !(eff > 0) || !(price >= 0)) return null;
    const litres     = litresUsed(distance, distUnit, eff, effUnit);
    const tripCost   = costFromLitres(litres, price, priceUnit);
    const totalCost  = tripCost * trips;
    const fuelUnits  = fuelInUnit(litres, priceUnit);
    const perDist    = tripCost / distance;

    return { litres, fuelUnits, tripCost, totalCost, perDist };
  }, [distance, distUnit, eff, effUnit, price, priceUnit, trips]);

  const chartData = useMemo(() => {
    if (!result) return [];
    const tc = result.tripCost;
    return [
      { label: "1 trip",   cost: parseFloat((tc * 1).toFixed(2))   },
      { label: "5 trips",  cost: parseFloat((tc * 5).toFixed(2))   },
      { label: "Weekly",   cost: parseFloat((tc * 7).toFixed(2))   },
      { label: "Monthly",  cost: parseFloat((tc * 30).toFixed(2))  },
      { label: "Annual",   cost: parseFloat((tc * 365).toFixed(2)) },
    ];
  }, [result]);

  const CHART_COLORS = ["#6366f1", "#818cf8", "#a5b4fc", "#c7d2fe", "#e0e7ff"];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Breadcrumbs
        items={[
          { label: "Everyday Calculators", href: "/everyday-calculators" },
          { label: "Fuel Cost Calculator", href: "/calculators/everyday/fuel-cost-calculator" },
        ]}
      />

      {/* ── Page header ──────────────────────────────────────────────────────── */}
      <div className="flex items-start justify-between flex-wrap gap-3 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Fuel Cost Calculator</h1>
          <p className="text-base text-on-surface-variant max-w-2xl">
            Estimate trip fuel cost for any distance, vehicle, and price — US, UK, or metric. Updates live as you adjust.
          </p>
        </div>
        <button
          onClick={() => window.print()}
          className="print:hidden flex items-center gap-2 px-4 py-2 bg-white border border-surface-border rounded-lg text-label-sm text-on-surface-variant hover:bg-surface-container-low transition-colors"
        >
          <Icons.Download />
          Download PDF
        </button>
      </div>

      {/* ── Vehicle presets ───────────────────────────────────────────────────── */}
      <div className="flex flex-wrap gap-2 mb-6">
        <span className="flex items-center gap-1.5 text-label-sm text-on-surface-variant self-center">
          <Icons.Car />
          Quick preset:
        </span>
        {PRESETS.filter(p => p.eff > 0).map(p => (
          <button
            key={p.label}
            onClick={() => { setEff(p.eff); setEffUnit(p.unit); }}
            className={`px-3 py-1.5 rounded-full text-label-sm font-medium border transition-all ${eff === p.eff && effUnit === p.unit ? "bg-primary text-white border-primary" : "bg-white text-on-surface border-surface-border hover:border-primary hover:text-primary"}`}
          >
            {p.label} — {p.eff} mpg
          </button>
        ))}
      </div>

      {/* ── 2-column grid ────────────────────────────────────────────────────── */}
      <div className="grid lg:grid-cols-2 gap-6">

        {/* ══ LEFT: Inputs ════════════════════════════════════════════════════ */}
        <div className="flex flex-col gap-5">

          {/* Distance */}
          <div className="rounded-xl border border-surface-border bg-white p-6">
            <div className="flex items-center gap-2 mb-5">
              <span className="text-on-surface-variant"><Icons.Route /></span>
              <h2 className="text-label-sm font-semibold uppercase tracking-widest text-on-surface-variant">Distance</h2>
            </div>

            <SliderInput
              label="Trip Distance"
              value={distance}
              onChange={setDistance}
              min={1} max={distUnit === "miles" ? 3000 : 5000} step={1}
              icon={<Icons.Road />}
            />

            {/* Unit toggle */}
            <div className="mt-4 flex rounded-lg overflow-hidden border border-surface-border">
              {(["miles", "km"] as DistUnit[]).map(u => (
                <button key={u}
                  onClick={() => {
                    if (u !== distUnit) {
                      setDistUnit(u);
                      setDistance(u === "km"
                        ? Math.round(distance * KM_PER_MILE)
                        : Math.round(distance / KM_PER_MILE));
                    }
                  }}
                  className={`flex-1 py-2.5 text-label-sm font-semibold transition-colors ${distUnit === u ? "bg-primary text-white" : "bg-white text-on-surface-variant hover:bg-surface-container-low"}`}
                >
                  {u === "miles" ? "Miles" : "Kilometres"}
                </button>
              ))}
            </div>
          </div>

          {/* Fuel economy */}
          <div className="rounded-xl border border-surface-border bg-white p-6">
            <div className="flex items-center gap-2 mb-5">
              <span className="text-on-surface-variant"><Icons.Droplet /></span>
              <h2 className="text-label-sm font-semibold uppercase tracking-widest text-on-surface-variant">Fuel Economy</h2>
            </div>

            <SliderInput
              label={effUnit === "l_100km" ? "Litres per 100 km" : effUnit === "km_l" ? "Kilometres per litre" : "Miles per gallon"}
              value={eff}
              onChange={setEff}
              min={1}
              max={effUnit === "l_100km" ? 30 : effUnit === "km_l" ? 30 : 80}
              step={0.5}
              icon={<Icons.Fuel />}
              suffix={effUnit === "l_100km" ? " L/100km" : effUnit === "km_l" ? " km/L" : " mpg"}
            />

            <div className="mt-4 grid grid-cols-2 gap-2">
              {([
                { value: "mpg_us", label: "MPG (US)" },
                { value: "mpg_uk", label: "MPG (UK)" },
                { value: "l_100km", label: "L/100 km" },
                { value: "km_l", label: "km/L" },
              ] as { value: EffUnit; label: string }[]).map(opt => (
                <button key={opt.value}
                  onClick={() => setEffUnit(opt.value)}
                  className={`py-2 rounded-lg text-label-sm font-medium border transition-colors ${effUnit === opt.value ? "bg-primary text-white border-primary" : "bg-white text-on-surface-variant border-surface-border hover:border-primary hover:text-primary"}`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Fuel price + trips */}
          <div className="rounded-xl border border-surface-border bg-white p-6">
            <div className="flex items-center gap-2 mb-5">
              <span className="text-on-surface-variant"><Icons.Tag /></span>
              <h2 className="text-label-sm font-semibold uppercase tracking-widest text-on-surface-variant">Fuel Price &amp; Trips</h2>
            </div>

            <div className="mb-5">
              <SliderInput
                label={`Price per ${priceUnitLabel(priceUnit)}`}
                value={price}
                onChange={setPrice}
                min={0.1} max={priceUnit === "litre" ? 4 : 12} step={0.01}
                icon={<Icons.Dollar />}
                suffix={` ${currency}`}
              />
              <div className="mt-3 flex rounded-lg overflow-hidden border border-surface-border">
                {([
                  { value: "us_gal", label: "US gal" },
                  { value: "uk_gal", label: "UK gal" },
                  { value: "litre",  label: "Per litre" },
                ] as { value: PriceUnit; label: string }[]).map(opt => (
                  <button key={opt.value}
                    onClick={() => setPriceUnit(opt.value)}
                    className={`flex-1 py-2 text-label-sm font-medium transition-colors ${priceUnit === opt.value ? "bg-primary text-white" : "bg-white text-on-surface-variant hover:bg-surface-container-low"}`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="border-t border-surface-border pt-5">
              <SliderInput
                label="Number of Trips"
                value={trips}
                onChange={setTrips}
                min={1} max={100} step={1}
                icon={<Icons.Repeat />}
                suffix=" trips"
              />
            </div>

            {/* Currency */}
            <div className="mt-5 border-t border-surface-border pt-5">
              <p className="text-label-md text-primary mb-3">Currency</p>
              <div className="flex gap-2 flex-wrap">
                {(["$", "£", "€", "₹", "¥"] as Currency[]).map(c => (
                  <button key={c}
                    onClick={() => setCurrency(c)}
                    className={`w-10 h-10 rounded-lg border text-label-md font-semibold transition-colors ${currency === c ? "bg-primary text-white border-primary" : "bg-white text-on-surface border-surface-border hover:border-primary hover:text-primary"}`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ══ RIGHT: Results ══════════════════════════════════════════════════ */}
        <div className="flex flex-col gap-5">

          {result ? (
            <>
              {/* Hero total */}
              <div className="rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 p-6 text-white">
                <p className="text-sm font-medium text-indigo-200 mb-1">Total Trip Cost</p>
                <p className="text-6xl font-bold mb-1">{fmt(result.totalCost)}</p>
                <p className="text-indigo-200 text-sm">
                  {trips} trip{trips !== 1 ? "s" : ""} × {distance} {distUnit} each
                </p>

                {/* Mini breakdown bar */}
                <div className="mt-5 bg-white/10 rounded-xl p-4">
                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div>
                      <p className="text-xs text-indigo-200">Per trip</p>
                      <p className="text-lg font-bold">{fmt(result.tripCost)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-indigo-200">Per {distUnit === "miles" ? "mile" : "km"}</p>
                      <p className="text-lg font-bold">{fmt(result.perDist)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-indigo-200">Fuel used</p>
                      <p className="text-lg font-bold">{result.litres.toFixed(1)} L</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stat cards */}
              <div className="grid grid-cols-2 gap-3">
                <StatCard
                  label="Fuel consumed"
                  value={`${result.fuelUnits.toFixed(2)} ${priceUnitLabel(priceUnit)}`}
                  sub={`${result.litres.toFixed(2)} litres`}
                />
                <StatCard
                  label="Cost per trip"
                  value={fmt(result.tripCost)}
                  accent
                />
                <StatCard
                  label={`Cost per ${distUnit === "miles" ? "mile" : "km"}`}
                  value={fmt(result.perDist)}
                />
                <StatCard
                  label="Annual cost (daily use)"
                  value={fmt(result.tripCost * 365)}
                  sub="If driven every day"
                />
              </div>

              {/* Projection chart */}
              <div className="rounded-xl border border-surface-border bg-white p-6">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-on-surface-variant"><Icons.TrendUp /></span>
                  <h3 className="text-label-sm font-semibold uppercase tracking-widest text-on-surface-variant">Cost Projections</h3>
                </div>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={chartData} barSize={36}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                    <XAxis dataKey="label" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                    <YAxis tickFormatter={v => `${currency}${v >= 1000 ? (v/1000).toFixed(1)+"k" : v}`} tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} width={52} />
                    <Tooltip
                      formatter={(v: number) => [`${currency}${v.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, "Cost"]}
                      contentStyle={{ borderRadius: 8, border: "1px solid #e2e8f0", fontSize: 12 }}
                    />
                    <Bar dataKey="cost" radius={[6, 6, 0, 0]}>
                      {chartData.map((_, i) => (
                        <Cell key={i} fill={CHART_COLORS[i] || "#6366f1"} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Periodic breakdown */}
              <div className="rounded-xl border border-surface-border bg-white p-5">
                <h3 className="text-label-sm font-semibold uppercase tracking-widest text-on-surface-variant mb-4">Recurring Cost Estimate</h3>
                <div className="space-y-2">
                  {[
                    { label: "Daily commute (2 trips/day)", multiplier: 2 * 260 / 12, period: "/mo" },
                    { label: "Weekend trips (2/week)",      multiplier: 2 * 52 / 12,  period: "/mo" },
                    { label: "Monthly average (30 days)",  multiplier: 30,             period: "/mo" },
                    { label: "Quarterly",                   multiplier: 90,             period: "/qtr" },
                    { label: "Annually",                    multiplier: 365,            period: "/yr"  },
                  ].map(row => (
                    <div key={row.label} className="flex items-center justify-between py-2 border-b border-surface-border last:border-0">
                      <span className="text-label-sm text-on-surface-variant">{row.label}</span>
                      <span className="text-label-md font-semibold text-on-surface">
                        {fmt(result.tripCost * row.multiplier)}
                        <span className="text-label-sm font-normal text-on-surface-variant ml-1">{row.period}</span>
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <p className="rounded-lg border border-surface-border bg-surface-container-low px-4 py-3 text-label-sm text-on-surface-variant">
                Estimate based on stated values. Real fuel use varies with driving style, traffic, AC use, load, and temperature.
              </p>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-surface-border bg-surface-container-low/50 p-16 text-center h-full min-h-64">
              <span className="mb-3 text-on-surface-variant opacity-40"><Icons.Fuel /></span>
              <p className="text-label-md text-on-surface-variant">Adjust the inputs on the left to see your fuel cost estimate.</p>
            </div>
          )}
        </div>
      </div>

      {/* ── Explanation + FAQs ───────────────────────────────────────────────── */}
      <div className="mt-8">
        <CalculatorLayout
          title=""
          description=""
          explanation={
            <div className="space-y-4 text-sm text-gray-700 leading-relaxed">
              <p>This calculator estimates how much fuel a trip consumes and what it costs. Everything is converted to a common metric base internally, so you can freely mix miles with US gallons, kilometres with litres, or UK MPG with pence per litre — the math handles the unit conversions for you.</p>
              <p><strong>How it works:</strong> Fuel used equals distance divided by fuel economy. Trip cost equals fuel used multiplied by the unit price. The trips multiplier lets you scale a single trip into a round trip, a weekly commute, or a monthly total in one step.</p>
              <p><strong>US vs UK gallons:</strong> A UK gallon (4.546 L) is about 20% larger than a US gallon (3.785 L). That is why the same car scores higher MPG when quoted in UK terms — more distance per a larger gallon. Always match the MPG and price units to the same country or the estimate will be off by around 20%.</p>
              <p><strong>L/100 km explained:</strong> Unlike MPG, a lower number means better efficiency — 5 L/100 km is more economical than 10 L/100 km. The two scales move in opposite directions, which is why the calculator handles both without you needing to convert.</p>
              <p><strong>Improving accuracy:</strong> Manufacturer fuel economy figures are measured under controlled conditions. Real-world consumption is typically 10–25% higher due to city driving, cold starts, highway speeds above 60 mph, air conditioning, cargo weight, and tyre pressure. For budgeting, using a slightly worse figure than the official rating gives a more realistic result.</p>
              <p>The projection table shows how daily or weekly driving habits compound over time. A commute that feels affordable at $8 per trip amounts to over $4,000 per year for a typical 5-day-a-week commuter — useful context when deciding between a more fuel-efficient vehicle or switching to an EV.</p>
            </div>
          }
          faqs={[
            {
              question: "What is the difference between US MPG and UK MPG?",
              answer: "A UK gallon (4.546 litres) is larger than a US gallon (3.785 litres), so the same vehicle shows a higher MPG figure when quoted in UK terms. Always match the unit to the source of the figure. Mixing them produces an estimate off by roughly 20%.",
            },
            {
              question: "How do I find my vehicle's fuel economy?",
              answer: "Check your owner's manual, the manufacturer's website, or the fueleconomy.gov database (US). For real-world estimates, fill the tank, drive normally until nearly empty, then divide distance driven by fuel added at the next fill-up.",
            },
            {
              question: "How do I estimate my monthly fuel bill?",
              answer: "Enter your typical one-way trip distance. Set trips to your total monthly one-way legs — for example, a 5-day commute is roughly 44 one-way trips per month. The total cost line gives your monthly estimate, and the projection table shows additional scenarios.",
            },
            {
              question: "Why is my real cost higher than the estimate?",
              answer: "Official fuel economy figures are measured under ideal lab conditions. City traffic, cold weather, heavy loads, air conditioning, and aggressive acceleration all increase real-world consumption by 10–25%. Use a slightly lower efficiency figure than the rating to get a more realistic budget estimate.",
            },
            {
              question: "Can I use this for diesel or hybrid vehicles?",
              answer: "Yes — enter the fuel economy in whatever unit applies to your vehicle (diesel MPG works the same way). For hybrids, use your real-world combined economy. For EVs, fuel cost calculators don't apply directly — use a kWh per mile cost calculator instead.",
            },
          ]}
          relatedCalculators={[
            { name: "Car Loan EMI Calculator", href: "/calculators/finance/car-loan-emi-calculator" },
            { name: "Car Lease vs Buy", href: "/calculators/finance/car-lease-vs-buy" },
            { name: "Electricity Cost Calculator", href: "/calculators/everyday/electricity-cost-calculator" },
          ]}
        >
          <div />
        </CalculatorLayout>
      </div>
    </div>
  );
}
