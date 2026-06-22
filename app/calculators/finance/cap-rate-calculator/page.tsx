"use client";
import { useState, useMemo } from "react";
import Breadcrumbs from "@/components/Breadcrumbs";
import CalculatorLayout from "@/components/CalculatorLayout";
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from "recharts";

type Mode = "capRate" | "value" | "noi";

export default function CapRateCalculator() {
  const [mode, setMode] = useState<Mode>("capRate");

  // Find Cap Rate inputs
  const [grossRent, setGrossRent] = useState(36000);
  const [vacancyRate, setVacancyRate] = useState(5);
  const [propertyTax, setPropertyTax] = useState(4000);
  const [insurance, setInsurance] = useState(1500);
  const [maintenancePct, setMaintenancePct] = useState(8);
  const [mgmtPct, setMgmtPct] = useState(8);
  const [hoa, setHoa] = useState(0);
  const [propertyValue, setPropertyValue] = useState(500000);

  // Find Property Value inputs
  const [inputNOI, setInputNOI] = useState(20000);
  const [inputCapRate, setInputCapRate] = useState(5);

  // Find NOI inputs
  const [inputValue, setInputValue] = useState(500000);
  const [inputCapRate2, setInputCapRate2] = useState(5);

  const fmt = (v: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(v);
  const fmtPct = (v: number) => `${v.toFixed(2)}%`;

  const calc = useMemo(() => {
    if (mode === "capRate") {
      const egi = grossRent * (1 - vacancyRate / 100);
      const maintenanceAmt = (maintenancePct / 100) * egi;
      const mgmtAmt = (mgmtPct / 100) * egi;
      const totalExpenses = propertyTax + insurance + maintenanceAmt + mgmtAmt + hoa;
      const noi = egi - totalExpenses;
      const capRate = propertyValue > 0 ? (noi / propertyValue) * 100 : 0;
      const vacancyLoss = grossRent - egi;
      // 1% cap rate change in value = NOI / (capRate/100)^2 * 0.01
      const capRateSensitivity = capRate > 0 ? (noi / Math.pow(capRate / 100, 2)) * 0.01 : 0;

      const pieData = [
        { name: "Tax", value: propertyTax },
        { name: "Insurance", value: insurance },
        { name: "Maintenance", value: maintenanceAmt },
        { name: "Management", value: mgmtAmt },
        { name: "HOA", value: hoa },
        { name: "Vacancy Loss", value: vacancyLoss },
      ].filter((d) => d.value > 0);

      return { capRate, noi, egi, totalExpenses, capRateSensitivity, pieData, vacancyLoss, maintenanceAmt, mgmtAmt };
    }
    if (mode === "value") {
      const derivedValue = inputCapRate > 0 ? (inputNOI / inputCapRate) * 100 : 0;
      return { derivedValue };
    }
    // noi mode
    const derivedNOI = inputValue * (inputCapRate2 / 100);
    return { derivedNOI };
  }, [mode, grossRent, vacancyRate, propertyTax, insurance, maintenancePct, mgmtPct, hoa, propertyValue, inputNOI, inputCapRate, inputValue, inputCapRate2]);

  const capRateColor = (rate: number) => {
    if (rate < 4) return "text-red-600";
    if (rate < 6) return "text-amber-500";
    if (rate < 8) return "text-green-600";
    return "text-blue-600";
  };

  const capRateBadge = (rate: number) => {
    if (rate < 4) return "bg-red-50 border-red-200 text-red-700";
    if (rate < 6) return "bg-amber-50 border-amber-200 text-amber-700";
    if (rate < 8) return "bg-green-50 border-green-200 text-green-700";
    return "bg-blue-50 border-blue-200 text-blue-700";
  };

  const PIE_COLORS = ["#3b82f6", "#8b5cf6", "#f59e0b", "#10b981", "#f43f5e", "#6b7280"];

  const tabs: { key: Mode; label: string }[] = [
    { key: "capRate", label: "Find Cap Rate" },
    { key: "value", label: "Find Property Value" },
    { key: "noi", label: "Find NOI" },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumbs
        items={[
          { label: "Finance Calculators", href: "/finance-calculators" },
          { label: "Cap Rate Calculator", href: "/calculators/finance/cap-rate-calculator" },
        ]}
      />

      <div className="mb-6 flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Cap Rate Calculator</h1>
          <p className="text-base text-gray-600">
            Calculate capitalization rate, property value, or net operating income for any real estate investment.
          </p>
        </div>
        <button
          onClick={() => window.print()}
          className="print:hidden flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg"
        >
          ↓ PDF
        </button>
      </div>

      {/* Mode Tabs */}
      <div className="flex gap-1 bg-gray-100 rounded-xl p-1 mb-6 w-full sm:w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setMode(tab.key)}
            className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              mode === tab.key
                ? "bg-white text-blue-700 shadow-sm"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Find Cap Rate Mode */}
      {mode === "capRate" && (
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* Inputs */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-5">
            <h2 className="text-lg font-semibold text-gray-900">Income & Expenses</h2>

            {/* Annual Gross Rent */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-semibold text-gray-700">Annual Gross Rent</label>
                <input
                  type="number"
                  value={grossRent}
                  onChange={(e) => setGrossRent(Number(e.target.value) || 0)}
                  className="w-28 px-2 py-1.5 text-right border border-gray-300 rounded-md text-sm font-semibold text-blue-600 focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <input
                type="range" min={10000} max={200000} step={1000} value={grossRent}
                onChange={(e) => setGrossRent(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>$10k</span><span>$200k</span>
              </div>
            </div>

            {/* Vacancy Rate */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-semibold text-gray-700">Vacancy Rate</label>
                <input
                  type="number"
                  value={vacancyRate}
                  onChange={(e) => setVacancyRate(Number(e.target.value) || 0)}
                  className="w-28 px-2 py-1.5 text-right border border-gray-300 rounded-md text-sm font-semibold text-blue-600 focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <input
                type="range" min={0} max={20} step={0.5} value={vacancyRate}
                onChange={(e) => setVacancyRate(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>0%</span><span>20%</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Property Tax (annual)</label>
                <input
                  type="number" value={propertyTax}
                  onChange={(e) => setPropertyTax(Number(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Insurance (annual)</label>
                <input
                  type="number" value={insurance}
                  onChange={(e) => setInsurance(Number(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Maintenance % */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-semibold text-gray-700">Maintenance (% of EGI)</label>
                <input
                  type="number"
                  value={maintenancePct}
                  onChange={(e) => setMaintenancePct(Number(e.target.value) || 0)}
                  className="w-28 px-2 py-1.5 text-right border border-gray-300 rounded-md text-sm font-semibold text-blue-600 focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <input
                type="range" min={0} max={15} step={0.5} value={maintenancePct}
                onChange={(e) => setMaintenancePct(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>0%</span><span>15%</span>
              </div>
            </div>

            {/* Mgmt % */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-semibold text-gray-700">Property Management (% of EGI)</label>
                <input
                  type="number"
                  value={mgmtPct}
                  onChange={(e) => setMgmtPct(Number(e.target.value) || 0)}
                  className="w-28 px-2 py-1.5 text-right border border-gray-300 rounded-md text-sm font-semibold text-blue-600 focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <input
                type="range" min={0} max={15} step={0.5} value={mgmtPct}
                onChange={(e) => setMgmtPct(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>0%</span><span>15%</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">HOA (annual)</label>
              <input
                type="number" value={hoa}
                onChange={(e) => setHoa(Number(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Property Value */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-semibold text-gray-700">Property Value</label>
                <input
                  type="number"
                  value={propertyValue}
                  onChange={(e) => setPropertyValue(Number(e.target.value) || 0)}
                  className="w-28 px-2 py-1.5 text-right border border-gray-300 rounded-md text-sm font-semibold text-blue-600 focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <input
                type="range" min={100000} max={2000000} step={5000} value={propertyValue}
                onChange={(e) => setPropertyValue(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>$100k</span><span>$2M</span>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">Results</h2>

            {/* Cap Rate hero */}
            <div className={`text-center p-5 rounded-xl border ${capRateBadge((calc as { capRate: number }).capRate)}`}>
              <p className="text-sm font-medium mb-1">Capitalization Rate</p>
              <p className={`text-6xl font-bold ${capRateColor((calc as { capRate: number }).capRate)}`}>
                {fmtPct((calc as { capRate: number }).capRate)}
              </p>
              <p className="text-xs mt-2 opacity-80">
                {(calc as { capRate: number }).capRate < 4 && "Below market — premium asset or overpriced"}
                {(calc as { capRate: number }).capRate >= 4 && (calc as { capRate: number }).capRate < 6 && "Typical for Class A / major metro"}
                {(calc as { capRate: number }).capRate >= 6 && (calc as { capRate: number }).capRate < 8 && "Solid — balanced risk/return"}
                {(calc as { capRate: number }).capRate >= 8 && "High yield — Class C or secondary market"}
              </p>
            </div>

            {/* Key metrics */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Net Operating Income", value: fmt((calc as { noi: number }).noi), color: "text-green-700" },
                { label: "Effective Gross Income", value: fmt((calc as { egi: number }).egi), color: "text-blue-700" },
                { label: "Total Expenses", value: fmt((calc as { totalExpenses: number }).totalExpenses), color: "text-red-600" },
                { label: "Expense Ratio", value: fmtPct((calc as { totalExpenses: number; egi: number }).egi > 0 ? (calc as { totalExpenses: number; egi: number }).totalExpenses / (calc as { totalExpenses: number; egi: number }).egi * 100 : 0), color: "text-gray-700" },
              ].map(({ label, value, color }) => (
                <div key={label} className="bg-gray-50 rounded-xl p-3">
                  <p className="text-xs text-gray-500 mb-1">{label}</p>
                  <p className={`text-lg font-bold ${color}`}>{value}</p>
                </div>
              ))}
            </div>

            {/* Sensitivity */}
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-sm">
              <p className="font-semibold text-blue-800 mb-1">Cap Rate Sensitivity</p>
              <p className="text-blue-700">
                A 1% change in cap rate = <strong>{fmt(Math.abs((calc as { capRateSensitivity: number }).capRateSensitivity))}</strong> change in property value
              </p>
            </div>

            {/* Expense breakdown table */}
            <div className="space-y-1.5 text-sm border-t border-gray-100 pt-4">
              <p className="font-semibold text-gray-700 mb-2">Income Breakdown</p>
              {[
                { label: "Gross Rent", value: fmt(grossRent) },
                { label: "— Vacancy Loss", value: `−${fmt((calc as { vacancyLoss: number }).vacancyLoss)}` },
                { label: "Effective Gross Income", value: fmt((calc as { egi: number }).egi), bold: true },
                { label: "— Property Tax", value: `−${fmt(propertyTax)}` },
                { label: "— Insurance", value: `−${fmt(insurance)}` },
                { label: "— Maintenance", value: `−${fmt((calc as { maintenanceAmt: number }).maintenanceAmt)}` },
                { label: "— Management", value: `−${fmt((calc as { mgmtAmt: number }).mgmtAmt)}` },
                { label: "— HOA", value: `−${fmt(hoa)}` },
                { label: "Net Operating Income", value: fmt((calc as { noi: number }).noi), bold: true, color: "text-green-700" },
              ].map(({ label, value, bold, color }) => (
                <div key={label} className={`flex justify-between ${bold ? "font-bold border-t border-gray-200 pt-1 mt-1" : "text-gray-600"} ${color || ""}`}>
                  <span>{label}</span>
                  <span>{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Find Property Value Mode */}
      {mode === "value" && (
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-5">
            <h2 className="text-lg font-semibold text-gray-900">Known Variables</h2>
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-semibold text-gray-700">Net Operating Income (NOI)</label>
                <input
                  type="number" value={inputNOI}
                  onChange={(e) => setInputNOI(Number(e.target.value) || 0)}
                  className="w-28 px-2 py-1.5 text-right border border-gray-300 rounded-md text-sm font-semibold text-blue-600 focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <input
                type="range" min={1000} max={200000} step={500} value={inputNOI}
                onChange={(e) => setInputNOI(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-semibold text-gray-700">Target Cap Rate (%)</label>
                <input
                  type="number" value={inputCapRate}
                  onChange={(e) => setInputCapRate(Number(e.target.value) || 0)}
                  className="w-28 px-2 py-1.5 text-right border border-gray-300 rounded-md text-sm font-semibold text-blue-600 focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <input
                type="range" min={1} max={15} step={0.25} value={inputCapRate}
                onChange={(e) => setInputCapRate(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
            </div>
            <div className="bg-gray-50 rounded-xl p-4 text-xs text-gray-600">
              <strong>Formula:</strong> Property Value = NOI ÷ Cap Rate
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col justify-center items-center">
            <p className="text-sm text-gray-500 mb-2">Implied Property Value</p>
            <p className="text-6xl font-bold text-blue-700">{fmt((calc as { derivedValue: number }).derivedValue)}</p>
            <p className="text-sm text-gray-500 mt-4">
              {fmt(inputNOI)} NOI at a {inputCapRate}% cap rate
            </p>
            <div className="mt-6 w-full space-y-2 text-sm">
              {[3, 5, 7, 9].map((rate) => (
                <div key={rate} className="flex justify-between px-4 py-2 bg-gray-50 rounded-lg">
                  <span className="text-gray-600">{rate}% cap rate</span>
                  <span className="font-semibold text-gray-900">{fmt((inputNOI / rate) * 100)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Find NOI Mode */}
      {mode === "noi" && (
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-5">
            <h2 className="text-lg font-semibold text-gray-900">Known Variables</h2>
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-semibold text-gray-700">Property Value</label>
                <input
                  type="number" value={inputValue}
                  onChange={(e) => setInputValue(Number(e.target.value) || 0)}
                  className="w-28 px-2 py-1.5 text-right border border-gray-300 rounded-md text-sm font-semibold text-blue-600 focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <input
                type="range" min={100000} max={2000000} step={5000} value={inputValue}
                onChange={(e) => setInputValue(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-semibold text-gray-700">Cap Rate (%)</label>
                <input
                  type="number" value={inputCapRate2}
                  onChange={(e) => setInputCapRate2(Number(e.target.value) || 0)}
                  className="w-28 px-2 py-1.5 text-right border border-gray-300 rounded-md text-sm font-semibold text-blue-600 focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <input
                type="range" min={1} max={15} step={0.25} value={inputCapRate2}
                onChange={(e) => setInputCapRate2(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
            </div>
            <div className="bg-gray-50 rounded-xl p-4 text-xs text-gray-600">
              <strong>Formula:</strong> NOI = Property Value × Cap Rate
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col justify-center items-center">
            <p className="text-sm text-gray-500 mb-2">Implied NOI</p>
            <p className="text-6xl font-bold text-green-700">{fmt((calc as { derivedNOI: number }).derivedNOI)}</p>
            <p className="text-sm text-gray-500 mt-4">
              {fmt(inputValue)} property at {inputCapRate2}% cap rate
            </p>
            <div className="mt-6 w-full space-y-2 text-sm">
              {[3, 5, 7, 9].map((rate) => (
                <div key={rate} className="flex justify-between px-4 py-2 bg-gray-50 rounded-lg">
                  <span className="text-gray-600">{rate}% cap rate</span>
                  <span className="font-semibold text-gray-900">{fmt(inputValue * (rate / 100))}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Pie Chart — only in Find Cap Rate mode */}
      {mode === "capRate" && (calc as { pieData?: { name: string; value: number }[] }).pieData && (calc as { pieData: { name: string; value: number }[] }).pieData.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Expense & Vacancy Breakdown</h2>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={(calc as { pieData: { name: string; value: number }[] }).pieData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={3}
                dataKey="value"
              >
                {(calc as { pieData: { name: string; value: number }[] }).pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => fmt(value)} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}

      <CalculatorLayout
        title=""
        description=""
        explanation={
          <div className="space-y-4 text-sm text-gray-700 leading-relaxed">
            <p>
              The capitalization rate — universally shortened to "cap rate" — is the foundational metric of commercial and residential income real estate. Unlike equity returns that depend on how much leverage you used, the cap rate measures the unlevered return on an asset: what the property would yield if purchased entirely in cash. Two investors buying the same building at different loan-to-value ratios will see the same cap rate, but very different cash-on-cash returns. This makes cap rate uniquely useful for comparing properties across markets and asset classes, independent of each buyer's financing structure.
            </p>
            <p>
              <strong>Cap rates vary dramatically by geography.</strong> In New York City and San Francisco, institutional-quality multifamily trades at 3–4% cap rates, reflecting the market's expectation of long-term rent growth and liquidity. In secondary Midwest cities — Cleveland, Indianapolis, Kansas City — similar-quality assets may trade at 7–10% because demand is lower, growth expectations are more modest, and investors require higher income yields to accept the risk. This inverse relationship means a NYC building may be priced at 25× NOI while a Midwest equivalent trades at 10–12× NOI.
            </p>
            <p>
              <strong>Cap rate and value move in opposite directions.</strong> When cap rates compress (fall), values rise — the market is willing to pay more per dollar of NOI. When cap rates expand (rise), values fall. This is why rising interest rates put downward pressure on real estate prices: as the risk-free rate on 10-year Treasury bonds climbs, real estate must offer a competitive spread — historically 100 to 200 basis points above the 10-year — or prices must adjust downward to restore that premium. The 2022–2024 rate cycle illustrated this painfully for many leveraged buyers.
            </p>
            <p>
              <strong>Cap rate vs. cash-on-cash return:</strong> Cash-on-cash return measures actual dollars of annual pre-tax cash flow against the cash invested (down payment + closing costs + renovation). It accounts for financing costs — mortgage payments — that cap rate deliberately ignores. A property with a 6% cap rate might produce a 10% cash-on-cash return with favorable leverage, or only 3% with a high-rate mortgage. Cash-on-cash is what you actually put in your pocket; cap rate is what the asset inherently earns.
            </p>
            <p>
              <strong>Going-in vs. stabilized cap rate:</strong> When evaluating a value-add property — one with below-market rents, high vacancy, or deferred maintenance — brokers often present both a going-in cap rate (based on current NOI) and a "stabilized" or pro-forma cap rate (based on projected NOI after improvements). The gap between these figures is where value-add deals are won or lost. Underwrite stabilized assumptions conservatively; assume renovation costs 20–30% higher than initial quotes and lease-up takes twice as long as projected.
            </p>
            <p>
              <strong>NOI calculation pitfalls:</strong> Sophisticated buyers always include vacancy in NOI calculations — typically 5–10% of gross potential rent. Sellers and inexperienced brokers sometimes present NOI based on 100% occupancy, which overstates income and understates the true cap rate. Equally common is omitting replacement reserves — a capital expenditure allocation for major systems like roofs, HVAC, and plumbing. A proper NOI excludes debt service and income taxes but includes management fees even if self-managed (because you could hire out), realistic maintenance, and adequate vacancy.
            </p>
            <p>
              <strong>Property class and cap rate ranges:</strong> Class A properties (new construction, premium locations, institutional tenants) trade at 4–5% in most markets. Class B (aging but well-maintained, good locations) typically 5–7%. Class C (older, workforce housing, secondary locations) often 7–10%+. The higher cap rate reflects higher risk: more deferred maintenance, more tenant turnover, greater sensitivity to economic downturns. The "right" cap rate for your purchase depends entirely on your risk tolerance, hold period, and ability to execute on any business plan.
            </p>
            <p>
              <strong>1031 exchange and cap rate strategy:</strong> When selling an appreciated property and executing a 1031 exchange to defer capital gains taxes, investors frequently trade into a higher-value property with a lower cap rate. A long-held Midwest asset at an 8% cap rate might be exchanged into a coastal multifamily at 4.5% — accepting lower current yield in exchange for a more liquid, appreciating asset and the ability to compound gains tax-deferred. The cap rate at exit is as important as the cap rate at acquisition; buying at a 7% cap and selling at a 6% cap (cap rate compression) delivers a significant windfall beyond operating cash flow.
            </p>
          </div>
        }
        faqs={[
          {
            question: "What is a good cap rate for rental property?",
            answer: "A 'good' cap rate depends entirely on market, asset class, and your investment goals. In major coastal markets (NYC, SF, LA), 3–4% is typical for Class A properties — investors accept low current yield expecting appreciation. In secondary and tertiary markets, 7–10% is common. Most individual investors targeting cash flow look for 5–7% as a balanced range. Avoid chasing high cap rates (10%+) without understanding why they're elevated — it usually signals higher risk, deferred maintenance, or a weak rental market.",
          },
          {
            question: "How does cap rate differ from cash-on-cash return?",
            answer: "Cap rate is calculated before financing — it's what you'd earn if you paid all cash. Cash-on-cash return accounts for your actual mortgage payments and measures real cash flow against your cash invested. A property with a 6% cap rate and a 7.5% mortgage might produce a negative cash-on-cash return. Conversely, in a low-rate environment, the same property could yield 9% cash-on-cash with leverage. Use cap rate to compare properties; use cash-on-cash to evaluate whether a specific deal works given your financing.",
          },
          {
            question: "Why do cap rates vary so much by city?",
            answer: "Cap rates reflect local supply/demand dynamics, rent growth expectations, liquidity, and risk perception. High-demand coastal markets with tight supply, strong job markets, and deep investor pools command premium prices and thus low cap rates — investors accept 3–4% because they expect rents and values to grow. Slower-growth markets offer less price appreciation upside, so buyers demand higher income yields to compensate. Regulatory environments matter too: markets with strong tenant protections can pressure cap rates upward due to perceived operational risk.",
          },
          {
            question: "Does cap rate include mortgage payments?",
            answer: "No — cap rate deliberately excludes debt service. This is one of its most useful features: it lets you evaluate a property's intrinsic income-generating ability regardless of how it's financed. Two investors buying the same property with 20% down vs. 50% down will see the same cap rate but very different cash-on-cash returns. To understand your actual cash flow after mortgage payments, calculate cash-on-cash return using Net Cash Flow (NOI minus annual debt service) divided by total cash invested.",
          },
          {
            question: "How do rising interest rates affect cap rates?",
            answer: "Rising interest rates typically push cap rates upward (and property values downward) through two mechanisms. First, real estate must compete with higher-yielding risk-free alternatives like Treasury bonds — if the 10-year yield rises from 2% to 5%, a 4% cap rate property looks far less attractive. Second, higher borrowing costs reduce what leveraged buyers can afford to pay. The 'cap rate spread' over the 10-year Treasury has historically been 100–200 basis points; when that spread compresses too far, cap rate expansion (and price correction) typically follows.",
          },
        ]}
        relatedCalculators={[
          { name: "Rental Property ROI Calculator", href: "/calculators/finance/rental-property-roi-calculator" },
          { name: "Home Sale Proceeds Calculator", href: "/calculators/finance/home-sale-proceeds-calculator" },
          { name: "Closing Cost Calculator", href: "/calculators/finance/closing-cost-calculator" },
          { name: "ROI Calculator", href: "/calculators/finance/roi-calculator" },
        ]}
      >
        <div />
      </CalculatorLayout>
    </div>
  );
}
