"use client";

import { useState, useEffect, useMemo } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  ReferenceLine,
} from "recharts";
import Breadcrumbs from "@/components/Breadcrumbs";
import CalculatorLayout from "@/components/CalculatorLayout";

// ─── Types ───────────────────────────────────────────────────────────────────

interface YearSnapshot {
  year: number;
  homeValue: number;
  loanBalance: number;
  equity: number;
  buyNetWorth: number;
  rentNetWorth: number;
  rentPaidCum: number;
  buyOutOfPocketCum: number;
}

interface CostBreakdownItem {
  label: string;
  value: number;
}

interface Result {
  winner: "buy" | "rent";
  advantage: number;
  buyNetWorth: number;
  rentNetWorth: number;
  netSaleProceeds: number;
  buyPortfolio: number;
  rentPortfolio: number;
  monthlyMortgage: number;
  firstMonthBuyCost: number;
  firstMonthRentCost: number;
  totalBuyOutOfPocket: number;
  totalRentPaid: number;
  totalInterest: number;
  homeValueAtSale: number;
  breakEvenYear: number | null;
  buyBreakdown: CostBreakdownItem[];
  yearly: YearSnapshot[];
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

const fmt = (n: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);

const fmtK = (n: number) => {
  const abs = Math.abs(n);
  if (abs >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (abs >= 1_000) return `$${(n / 1_000).toFixed(0)}k`;
  return `$${n.toFixed(0)}`;
};

const monthlyRateFromAnnual = (annualPct: number) =>
  Math.pow(1 + annualPct / 100, 1 / 12) - 1;

// ─── Core model: invest-the-difference net worth comparison ──────────────────
//
// We compare the two paths on the same yardstick: net worth at the end of the
// stay. The buyer's net worth is the cash they would walk away with after
// selling (home value minus selling costs minus remaining loan) plus any side
// investments. The renter's net worth is their investment portfolio: they start
// by investing the down payment and closing costs the buyer tied up, then each
// month the cheaper option invests the difference so both spend the same.

function compute(i: {
  homePrice: number;
  downPct: number;
  mortgageRate: number;
  loanTermYears: number;
  closingCostPct: number;
  monthlyRent: number;
  rentGrowthPct: number;
  propertyTaxPct: number;
  homeInsurancePct: number;
  maintenancePct: number;
  hoaMonthly: number;
  homeAppreciationPct: number;
  investmentReturnPct: number;
  sellingCostPct: number;
  rentersInsuranceMonthly: number;
  pmiRatePct: number;
  yearsToStay: number;
}): Result | null {
  if (i.homePrice <= 0) return null;

  const downPayment = i.homePrice * (i.downPct / 100);
  const closingCosts = i.homePrice * (i.closingCostPct / 100);
  const loanAmount = Math.max(0, i.homePrice - downPayment);

  const mRate = i.mortgageRate / 100 / 12;
  const nPayments = i.loanTermYears * 12;
  const monthlyMortgage =
    loanAmount <= 0
      ? 0
      : mRate === 0
        ? loanAmount / nPayments
        : (loanAmount * mRate * Math.pow(1 + mRate, nPayments)) /
          (Math.pow(1 + mRate, nPayments) - 1);

  const apprM = monthlyRateFromAnnual(i.homeAppreciationPct);
  const investM = monthlyRateFromAnnual(i.investmentReturnPct);
  const pmiMonthly = (loanAmount * (i.pmiRatePct / 100)) / 12;

  // Simulate long enough to find a realistic break-even, capped at 30 years.
  const simYears = Math.min(30, Math.max(i.yearsToStay, 15));
  const totalMonths = simYears * 12;

  let balance = loanAmount;
  // Renter invests the capital the buyer locked into the house up front.
  let rentPortfolio = downPayment + closingCosts;
  let buyPortfolio = 0;

  // Cumulative trackers (only the chosen-horizon slice is reported).
  let totalInterest = 0;
  let totalPrincipal = 0;
  let totalPropertyTax = 0;
  let totalInsurance = 0;
  let totalMaintenance = 0;
  let totalHoa = 0;
  let totalPmi = 0;
  let totalRentPaid = 0;
  let totalRentersInsurance = 0;

  const yearly: YearSnapshot[] = [];
  let breakEvenYear: number | null = null;

  // Snapshot helpers captured at the chosen horizon.
  let horizonSnap: {
    netSaleProceeds: number;
    buyNetWorth: number;
    rentNetWorth: number;
    homeValueAtSale: number;
    totalBuyOutOfPocket: number;
    totalRentPaid: number;
    totalInterest: number;
    firstMonthBuyCost: number;
    firstMonthRentCost: number;
    buyBreakdown: CostBreakdownItem[];
  } | null = null;

  let firstMonthBuyCost = 0;
  let firstMonthRentCost = 0;

  for (let m = 1; m <= totalMonths; m++) {
    const homeValue = i.homePrice * Math.pow(1 + apprM, m);

    // Mortgage amortization for this month.
    let interest = 0;
    let principal = 0;
    let mortgageThisMonth = 0;
    if (balance > 0 && m <= nPayments) {
      interest = balance * mRate;
      principal = Math.min(balance, monthlyMortgage - interest);
      balance = Math.max(0, balance - principal);
      mortgageThisMonth = interest + principal;
      totalInterest += interest;
      totalPrincipal += principal;
    }

    // Recurring ownership costs, scaled to current home value.
    const propertyTax = (homeValue * (i.propertyTaxPct / 100)) / 12;
    const insurance = (homeValue * (i.homeInsurancePct / 100)) / 12;
    const maintenance = (homeValue * (i.maintenancePct / 100)) / 12;
    const hoa = i.hoaMonthly;
    // PMI applies while the loan exceeds 80% of the original price.
    const pmi = balance / i.homePrice > 0.8 ? pmiMonthly : 0;

    totalPropertyTax += propertyTax;
    totalInsurance += insurance;
    totalMaintenance += maintenance;
    totalHoa += hoa;
    totalPmi += pmi;

    const buyMonthly =
      mortgageThisMonth + propertyTax + insurance + maintenance + hoa + pmi;

    // Rent grows once per year.
    const yearIndex = Math.floor((m - 1) / 12);
    const rentThisMonth =
      i.monthlyRent * Math.pow(1 + i.rentGrowthPct / 100, yearIndex);
    const rentMonthly = rentThisMonth + i.rentersInsuranceMonthly;
    totalRentPaid += rentThisMonth;
    totalRentersInsurance += i.rentersInsuranceMonthly;

    if (m === 1) {
      firstMonthBuyCost = buyMonthly;
      firstMonthRentCost = rentMonthly;
    }

    // Invest the difference: both paths spend the larger amount each month, and
    // the cheaper path puts the surplus into the investment portfolio.
    const budget = Math.max(buyMonthly, rentMonthly);
    buyPortfolio = buyPortfolio * (1 + investM) + (budget - buyMonthly);
    rentPortfolio = rentPortfolio * (1 + investM) + (budget - rentMonthly);

    // Year boundary: record a snapshot assuming a sale at this point.
    if (m % 12 === 0) {
      const year = m / 12;
      const sellingCosts = homeValue * (i.sellingCostPct / 100);
      const netSaleProceeds = homeValue - sellingCosts - balance;
      const buyNetWorth = netSaleProceeds + buyPortfolio;
      const rentNetWorth = rentPortfolio;
      const equity = homeValue - balance;

      const buyOutOfPocketCum =
        downPayment +
        closingCosts +
        totalInterest +
        totalPrincipal +
        totalPropertyTax +
        totalInsurance +
        totalMaintenance +
        totalHoa +
        totalPmi;

      yearly.push({
        year,
        homeValue,
        loanBalance: balance,
        equity,
        buyNetWorth,
        rentNetWorth,
        rentPaidCum: totalRentPaid + totalRentersInsurance,
        buyOutOfPocketCum,
      });

      if (breakEvenYear === null && buyNetWorth >= rentNetWorth) {
        breakEvenYear = year;
      }

      if (year === i.yearsToStay) {
        horizonSnap = {
          netSaleProceeds,
          buyNetWorth,
          rentNetWorth,
          homeValueAtSale: homeValue,
          totalBuyOutOfPocket: buyOutOfPocketCum,
          totalRentPaid: totalRentPaid + totalRentersInsurance,
          totalInterest,
          firstMonthBuyCost,
          firstMonthRentCost,
          buyBreakdown: [
            { label: "Down payment", value: downPayment },
            { label: "Closing costs", value: closingCosts },
            { label: "Mortgage interest", value: totalInterest },
            { label: "Principal paid", value: totalPrincipal },
            { label: "Property tax", value: totalPropertyTax },
            { label: "Home insurance", value: totalInsurance },
            { label: "Maintenance", value: totalMaintenance },
            { label: "HOA fees", value: totalHoa },
            { label: "PMI", value: totalPmi },
          ].filter((row) => row.value > 0.5),
        };
      }
    }
  }

  if (!horizonSnap) return null;

  const winner =
    horizonSnap.buyNetWorth >= horizonSnap.rentNetWorth ? "buy" : "rent";
  const advantage = Math.abs(
    horizonSnap.buyNetWorth - horizonSnap.rentNetWorth
  );

  return {
    winner,
    advantage,
    buyNetWorth: horizonSnap.buyNetWorth,
    rentNetWorth: horizonSnap.rentNetWorth,
    netSaleProceeds: horizonSnap.netSaleProceeds,
    buyPortfolio: buyPortfolio,
    rentPortfolio: rentPortfolio,
    monthlyMortgage,
    firstMonthBuyCost: horizonSnap.firstMonthBuyCost,
    firstMonthRentCost: horizonSnap.firstMonthRentCost,
    totalBuyOutOfPocket: horizonSnap.totalBuyOutOfPocket,
    totalRentPaid: horizonSnap.totalRentPaid,
    totalInterest: horizonSnap.totalInterest,
    homeValueAtSale: horizonSnap.homeValueAtSale,
    breakEvenYear,
    buyBreakdown: horizonSnap.buyBreakdown,
    yearly,
  };
}

// ─── Reusable input row ──────────────────────────────────────────────────────

function SliderInput({
  label,
  value,
  onChange,
  min,
  max,
  step,
  prefix,
  suffix,
  accent = "blue",
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
  step: number;
  prefix?: string;
  suffix?: string;
  accent?: "blue" | "green";
}) {
  const ring = accent === "green" ? "focus:ring-green-500" : "focus:ring-blue-500";
  const text = accent === "green" ? "text-green-600" : "text-blue-600";
  const acc = accent === "green" ? "accent-green-600" : "accent-blue-600";
  return (
    <div>
      <div className="flex justify-between items-center mb-1">
        <label className="text-sm font-semibold text-gray-700">{label}</label>
        <div className="flex items-center gap-1">
          {prefix && <span className="text-sm text-gray-500">{prefix}</span>}
          <input
            type="number"
            value={value}
            onChange={(e) => onChange(Number(e.target.value) || 0)}
            className={`w-24 px-2 py-1.5 text-right border border-gray-300 rounded-md text-sm font-semibold ${text} focus:ring-2 ${ring} focus:border-transparent`}
          />
          {suffix && <span className="text-sm text-gray-500">{suffix}</span>}
        </div>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className={`w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer ${acc}`}
      />
    </div>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function RentVsBuyCalculator() {
  // Shared
  const [yearsToStay, setYearsToStay] = useState(5);
  const [investmentReturn, setInvestmentReturn] = useState(6);

  // Buy
  const [homePrice, setHomePrice] = useState(400000);
  const [downPct, setDownPct] = useState(20);
  const [mortgageRate, setMortgageRate] = useState(6.5);
  const [loanTermYears, setLoanTermYears] = useState(30);
  const [closingCostPct, setClosingCostPct] = useState(3);
  const [propertyTaxPct, setPropertyTaxPct] = useState(1.1);
  const [homeInsurancePct, setHomeInsurancePct] = useState(0.5);
  const [maintenancePct, setMaintenancePct] = useState(1);
  const [hoaMonthly, setHoaMonthly] = useState(0);
  const [homeAppreciation, setHomeAppreciation] = useState(3.5);
  const [sellingCostPct, setSellingCostPct] = useState(6);
  const [pmiRatePct] = useState(0.5);

  // Rent
  const [monthlyRent, setMonthlyRent] = useState(2000);
  const [rentGrowth, setRentGrowth] = useState(3);
  const [rentersInsurance, setRentersInsurance] = useState(15);

  useEffect(() => {
    try {
      const recent = JSON.parse(
        localStorage.getItem("recentCalculators") || "[]"
      );
      const updated = [
        "rent-vs-buy",
        ...recent.filter((id: string) => id !== "rent-vs-buy"),
      ].slice(0, 10);
      localStorage.setItem("recentCalculators", JSON.stringify(updated));
    } catch {
      // ignore
    }
  }, []);

  const result = useMemo(
    () =>
      compute({
        homePrice,
        downPct,
        mortgageRate,
        loanTermYears,
        closingCostPct,
        monthlyRent,
        rentGrowthPct: rentGrowth,
        propertyTaxPct,
        homeInsurancePct,
        maintenancePct,
        hoaMonthly,
        homeAppreciationPct: homeAppreciation,
        investmentReturnPct: investmentReturn,
        sellingCostPct,
        rentersInsuranceMonthly: rentersInsurance,
        pmiRatePct,
        yearsToStay,
      }),
    [
      homePrice,
      downPct,
      mortgageRate,
      loanTermYears,
      closingCostPct,
      monthlyRent,
      rentGrowth,
      propertyTaxPct,
      homeInsurancePct,
      maintenancePct,
      hoaMonthly,
      homeAppreciation,
      investmentReturn,
      sellingCostPct,
      rentersInsurance,
      pmiRatePct,
      yearsToStay,
    ]
  );

  const downPayment = homePrice * (downPct / 100);
  const chartData =
    result?.yearly
      .filter((r) => r.year <= Math.max(yearsToStay, 10))
      .map((r) => ({
        year: r.year,
        Buy: Math.round(r.buyNetWorth),
        Rent: Math.round(r.rentNetWorth),
      })) ?? [];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumbs
        items={[
          { label: "Finance Calculators", href: "/finance-calculators" },
          {
            label: "Rent vs Buy",
            href: "/calculators/finance/rent-vs-buy-calculator",
          },
        ]}
      />

      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Rent vs Buy Calculator
        </h1>
        <p className="text-base text-gray-600">
          Compare the true cost of renting against buying over the years you plan
          to stay, including the investment return on money you do not tie up in a
          home.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* ── Inputs ── */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200 space-y-5">
          <div>
            <SliderInput
              label="Years You Plan to Stay"
              value={yearsToStay}
              onChange={setYearsToStay}
              min={1}
              max={15}
              step={1}
              suffix="yrs"
            />
          </div>

          <h3 className="text-sm font-bold text-gray-700 border-b pb-1">
            Buying
          </h3>
          <SliderInput
            label="Home Price"
            value={homePrice}
            onChange={setHomePrice}
            min={50000}
            max={2000000}
            step={5000}
            prefix="$"
            accent="green"
          />
          <SliderInput
            label="Down Payment"
            value={downPct}
            onChange={setDownPct}
            min={0}
            max={100}
            step={1}
            suffix="%"
            accent="green"
          />
          <p className="-mt-2 text-xs text-gray-500">
            {fmt(downPayment)} down
            {downPct < 20 ? " - below 20%, PMI is added until you reach 20% equity" : ""}
          </p>
          <SliderInput
            label="Mortgage Rate"
            value={mortgageRate}
            onChange={setMortgageRate}
            min={0}
            max={12}
            step={0.05}
            suffix="%"
            accent="green"
          />
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-2">
              Loan Term
            </label>
            <div className="flex gap-2">
              {[15, 20, 30].map((t) => (
                <button
                  key={t}
                  onClick={() => setLoanTermYears(t)}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-colors ${
                    loanTermYears === t
                      ? "bg-green-600 text-white border-green-600"
                      : "bg-white text-gray-700 border-gray-300 hover:border-green-400"
                  }`}
                >
                  {t} yr
                </button>
              ))}
            </div>
          </div>
          <SliderInput
            label="Home Appreciation"
            value={homeAppreciation}
            onChange={setHomeAppreciation}
            min={-2}
            max={10}
            step={0.1}
            suffix="%/yr"
            accent="green"
          />
          <SliderInput
            label="Property Tax"
            value={propertyTaxPct}
            onChange={setPropertyTaxPct}
            min={0}
            max={4}
            step={0.05}
            suffix="%/yr"
            accent="green"
          />
          <SliderInput
            label="Home Insurance"
            value={homeInsurancePct}
            onChange={setHomeInsurancePct}
            min={0}
            max={2}
            step={0.05}
            suffix="%/yr"
            accent="green"
          />
          <SliderInput
            label="Maintenance"
            value={maintenancePct}
            onChange={setMaintenancePct}
            min={0}
            max={3}
            step={0.1}
            suffix="%/yr"
            accent="green"
          />
          <SliderInput
            label="HOA Fees"
            value={hoaMonthly}
            onChange={setHoaMonthly}
            min={0}
            max={1500}
            step={25}
            prefix="$"
            suffix="/mo"
            accent="green"
          />
          <div className="grid grid-cols-2 gap-3">
            <SliderInput
              label="Closing Costs"
              value={closingCostPct}
              onChange={setClosingCostPct}
              min={0}
              max={6}
              step={0.5}
              suffix="%"
              accent="green"
            />
            <SliderInput
              label="Selling Costs"
              value={sellingCostPct}
              onChange={setSellingCostPct}
              min={0}
              max={10}
              step={0.5}
              suffix="%"
              accent="green"
            />
          </div>

          <h3 className="text-sm font-bold text-gray-700 border-b pb-1">
            Renting
          </h3>
          <SliderInput
            label="Monthly Rent"
            value={monthlyRent}
            onChange={setMonthlyRent}
            min={300}
            max={10000}
            step={50}
            prefix="$"
          />
          <SliderInput
            label="Rent Increase"
            value={rentGrowth}
            onChange={setRentGrowth}
            min={0}
            max={10}
            step={0.1}
            suffix="%/yr"
          />
          <SliderInput
            label="Renters Insurance"
            value={rentersInsurance}
            onChange={setRentersInsurance}
            min={0}
            max={100}
            step={5}
            prefix="$"
            suffix="/mo"
          />

          <h3 className="text-sm font-bold text-gray-700 border-b pb-1">
            Investing
          </h3>
          <SliderInput
            label="Investment Return"
            value={investmentReturn}
            onChange={setInvestmentReturn}
            min={0}
            max={12}
            step={0.1}
            suffix="%/yr"
          />
          <p className="-mt-2 text-xs text-gray-500">
            The return earned on cash not locked into a home (the down payment,
            closing costs, and any monthly savings).
          </p>
        </div>

        {/* ── Results ── */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
          {result && (
            <div className="space-y-4">
              <div
                className={`border-2 rounded-lg p-4 text-center ${
                  result.winner === "buy"
                    ? "bg-green-50 border-green-200"
                    : "bg-blue-50 border-blue-200"
                }`}
              >
                <div className="text-sm text-gray-600 mb-1">
                  After {yearsToStay} year{yearsToStay !== 1 ? "s" : ""},{" "}
                  {result.winner === "buy" ? "buying" : "renting"} leaves you ahead by
                </div>
                <div
                  className={`text-4xl font-bold ${
                    result.winner === "buy" ? "text-green-600" : "text-blue-600"
                  }`}
                >
                  {fmt(result.advantage)}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  measured as end-of-period net worth
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <div className="text-xs text-gray-500 mb-1">
                    Net Worth if You Buy
                  </div>
                  <div className="text-xl font-bold text-green-700">
                    {fmt(result.buyNetWorth)}
                  </div>
                  <div className="text-xs text-gray-500">
                    sale proceeds {fmt(result.netSaleProceeds)}
                  </div>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <div className="text-xs text-gray-500 mb-1">
                    Net Worth if You Rent
                  </div>
                  <div className="text-xl font-bold text-blue-700">
                    {fmt(result.rentNetWorth)}
                  </div>
                  <div className="text-xs text-gray-500">
                    invested portfolio
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="border border-gray-200 rounded-lg p-3">
                  <div className="text-xs text-gray-500">
                    Mortgage Payment (P+I)
                  </div>
                  <div className="font-semibold text-gray-800">
                    {fmt(result.monthlyMortgage)}/mo
                  </div>
                </div>
                <div className="border border-gray-200 rounded-lg p-3">
                  <div className="text-xs text-gray-500">
                    Full Owning Cost, Month 1
                  </div>
                  <div className="font-semibold text-gray-800">
                    {fmt(result.firstMonthBuyCost)}/mo
                  </div>
                </div>
                <div className="border border-gray-200 rounded-lg p-3">
                  <div className="text-xs text-gray-500">
                    Total Spent Owning
                  </div>
                  <div className="font-semibold text-gray-800">
                    {fmt(result.totalBuyOutOfPocket)}
                  </div>
                </div>
                <div className="border border-gray-200 rounded-lg p-3">
                  <div className="text-xs text-gray-500">Total Rent Paid</div>
                  <div className="font-semibold text-gray-800">
                    {fmt(result.totalRentPaid)}
                  </div>
                </div>
              </div>

              <div
                className={`rounded-lg p-3 text-sm border ${
                  result.breakEvenYear
                    ? "bg-amber-50 border-amber-200 text-amber-800"
                    : "bg-gray-50 border-gray-200 text-gray-700"
                }`}
              >
                {result.breakEvenYear ? (
                  <>
                    <strong>Break-even point:</strong> Buying pulls ahead of renting
                    around year {result.breakEvenYear}. If you expect to move before
                    then, renting is usually the stronger financial choice.
                  </>
                ) : (
                  <>
                    <strong>No break-even within 30 years:</strong> with these
                    inputs, renting and investing the difference stays ahead the
                    whole time. Lower the rent, raise appreciation, or hold longer to
                    change that.
                  </>
                )}
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-2">
                  Where Your Owning Money Goes ({yearsToStay} yr)
                </h3>
                <div className="space-y-1">
                  {result.buyBreakdown.map(({ label, value }) => (
                    <div key={label} className="flex justify-between text-sm">
                      <span className="text-gray-600">{label}</span>
                      <span className="font-medium text-gray-800">
                        {fmt(value)}
                      </span>
                    </div>
                  ))}
                </div>
                <p className="mt-2 text-xs text-gray-500">
                  Principal and appreciation come back to you at sale; interest,
                  tax, insurance, maintenance, HOA, and fees do not.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Net worth chart ── */}
      {result && chartData.length > 0 && (
        <div className="mt-6 bg-white rounded-xl shadow-md p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-gray-700">
              Net Worth Over Time: Buy vs Rent
            </h3>
            <button
              onClick={() => window.print()}
              className="print:hidden text-xs px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg"
            >
              Download PDF
            </button>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart
              data={chartData}
              margin={{ top: 5, right: 10, left: 10, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="year"
                tick={{ fontSize: 11 }}
                tickFormatter={(v) => `Yr ${v}`}
              />
              <YAxis tick={{ fontSize: 11 }} tickFormatter={fmtK} width={55} />
              <Tooltip
                formatter={(value: number) => [fmt(value), undefined]}
                labelFormatter={(l) => `Year ${l}`}
              />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              {result.breakEvenYear && (
                <ReferenceLine
                  x={result.breakEvenYear}
                  stroke="#d97706"
                  strokeDasharray="4 4"
                  label={{
                    value: "break-even",
                    position: "top",
                    fontSize: 10,
                    fill: "#d97706",
                  }}
                />
              )}
              <Line
                type="monotone"
                dataKey="Buy"
                stroke="#22c55e"
                strokeWidth={2.5}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="Rent"
                stroke="#3b82f6"
                strokeWidth={2.5}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
          <p className="mt-2 text-xs text-gray-500">
            Net worth assumes you sell the home at the end of each year (buy line)
            or cash out your portfolio (rent line). Where the lines cross is the
            break-even point.
          </p>
        </div>
      )}

      {/* ── Year-by-year table ── */}
      {result && (
        <div className="mt-6 bg-white rounded-xl shadow-md p-6 border border-gray-200">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">
            Year-by-Year Breakdown
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="bg-gray-50 text-gray-600 font-semibold">
                  <th className="px-3 py-2">Year</th>
                  <th className="px-3 py-2 text-right">Home Value</th>
                  <th className="px-3 py-2 text-right">Loan Balance</th>
                  <th className="px-3 py-2 text-right">Rent Paid</th>
                  <th className="px-3 py-2 text-right">Buy Net Worth</th>
                  <th className="px-3 py-2 text-right">Rent Net Worth</th>
                </tr>
              </thead>
              <tbody>
                {result.yearly
                  .filter((r) => r.year <= Math.max(yearsToStay, 10))
                  .map((r, idx) => {
                    const buyAhead = r.buyNetWorth >= r.rentNetWorth;
                    return (
                      <tr
                        key={r.year}
                        className={`${idx % 2 === 0 ? "bg-white" : "bg-gray-50/60"} ${
                          r.year === yearsToStay ? "ring-1 ring-inset ring-blue-200" : ""
                        }`}
                      >
                        <td className="px-3 py-2 text-gray-600">{r.year}</td>
                        <td className="px-3 py-2 text-right text-gray-700">
                          {fmt(r.homeValue)}
                        </td>
                        <td className="px-3 py-2 text-right text-gray-700">
                          {fmt(r.loanBalance)}
                        </td>
                        <td className="px-3 py-2 text-right text-gray-700">
                          {fmt(r.rentPaidCum)}
                        </td>
                        <td
                          className={`px-3 py-2 text-right font-semibold ${
                            buyAhead ? "text-green-700" : "text-gray-700"
                          }`}
                        >
                          {fmt(r.buyNetWorth)}
                        </td>
                        <td
                          className={`px-3 py-2 text-right font-semibold ${
                            !buyAhead ? "text-blue-700" : "text-gray-700"
                          }`}
                        >
                          {fmt(r.rentNetWorth)}
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <p className="mt-4 text-xs text-gray-500">
        Estimate only - not financial, tax, or legal advice. Real results depend
        on local taxes, loan terms, market conditions, and the mortgage interest
        and property tax deductions, which this model does not itemize. Figures
        use general assumptions; confirm numbers with a licensed professional.
      </p>

      <CalculatorLayout
        title=""
        description=""
        explanation={
          <div className="space-y-4">
            <p>
              Renting is not throwing money away, and buying is not automatically
              building wealth. The honest comparison is what each path does to your
              net worth over the years you actually plan to stay. This calculator
              runs both paths month by month and lines them up on the same
              yardstick.
            </p>
            <p>
              On the buying side it tracks your mortgage (splitting each payment
              into interest and principal), property tax, insurance, maintenance,
              HOA, and PMI if your down payment is under 20%. The home appreciates
              each year. When you sell, you get back the sale price minus selling
              costs and the remaining loan balance. That recovered equity is the
              real payoff of owning.
            </p>
            <p>
              On the renting side it tracks rent that rises each year plus renters
              insurance. The key fairness step is the opportunity cost of cash: a
              buyer locks a large down payment and closing costs into the house, so
              the renter is assumed to invest that same money instead. Each month
              whichever option costs less invests the difference, so both people
              spend exactly the same. At the end, the renter cashes out their
              portfolio. Comparing the two final net worth figures is the result.
            </p>
            <p>
              The break-even point is the year buying first overtakes renting.
              Below it, the upfront and transaction costs of owning have not yet
              been outweighed by equity and appreciation, so renting and investing
              wins. The classic rule of thumb is that buying tends to pay off only
              if you stay five years or more, but as you will see, your own numbers
              can push that line in either direction.
            </p>
          </div>
        }
        faqs={[
          {
            question: "Is renting really just throwing money away?",
            answer:
              "No. Rent buys you housing, flexibility, and zero exposure to maintenance, property tax, and market risk. The fair question is not rent versus a mortgage payment, but the total cost of owning (interest, tax, insurance, upkeep, and transaction costs that you never get back) against rent, after accounting for the investment return a renter earns on the down payment they did not spend. Over short stays, renting often comes out ahead.",
          },
          {
            question: "Why does the calculator assume the renter invests money?",
            answer:
              "Because a buyer ties up a large down payment and closing costs in the house, while a renter keeps that cash. To compare the two paths fairly, the renter is assumed to invest that lump sum, plus any month where renting costs less than owning. Ignoring this opportunity cost would unfairly favor buying. The investment return slider lets you set how that money grows, often a stock index assumption of 5 to 7 percent.",
          },
          {
            question: "What is the break-even point?",
            answer:
              "It is the number of years you need to own before buying overtakes renting in net worth. Buying carries heavy upfront costs (down payment, closing) and exit costs (agent commission, transfer fees), so it takes time for equity and appreciation to overcome them. If you move before the break-even year, renting usually leaves you richer. Staying past it tilts the math toward buying.",
          },
          {
            question: "Does this include the mortgage interest tax deduction?",
            answer:
              "No. Since the 2018 standard deduction increase, most households no longer itemize, so including the deduction by default would overstate the benefit of buying for most people. If you itemize and your mortgage interest and property tax exceed the standard deduction, owning looks somewhat better than shown here. Treat the result as a pre-tax comparison and consult a tax professional for your situation.",
          },
          {
            question: "What home appreciation and rent growth should I use?",
            answer:
              "Long-run US home prices have risen roughly 3 to 4 percent a year on average, though local markets vary widely and can fall. Rents have historically grown around 3 percent annually. These are defaults, not predictions. Because the result is sensitive to these rates, try a pessimistic and an optimistic case rather than trusting a single number.",
          },
          {
            question: "Why does my monthly owning cost look higher than rent?",
            answer:
              "The full cost of owning is far more than the mortgage payment. Property tax, insurance, maintenance, HOA, and PMI often add 40 to 60 percent on top of principal and interest. The calculator shows your true first-month owning cost so you can compare it honestly against rent, not just the loan payment a lender quotes.",
          },
        ]}
        relatedCalculators={[
          {
            name: "Mortgage Calculator",
            href: "/calculators/finance/mortgage-calculator",
          },
          {
            name: "Home Affordability Calculator",
            href: "/calculators/finance/home-affordability-calculator",
          },
          {
            name: "Loan Calculator",
            href: "/calculators/finance/loan-calculator",
          },
          {
            name: "Investment Calculator",
            href: "/calculators/finance/investment-calculator",
          },
        ]}
      >
        <div className="space-y-3">
          <h2 className="text-2xl font-bold text-gray-900">
            How to read your rent vs buy result
          </h2>
          <p className="text-sm text-gray-700">
            Start with the years you plan to stay, since that single input drives
            the answer more than any other. Set a realistic home price, rent, and
            mortgage rate, then look at the break-even year on the chart. If it
            lands after you expect to move, renting and investing the difference is
            likely the stronger play. If your stay comfortably clears the break-even
            year, buying starts to build lasting equity. Always test a few
            appreciation and rent-growth scenarios, because the result swings hard
            on assumptions no one can predict.
          </p>
        </div>
      </CalculatorLayout>
    </div>
  );
}
