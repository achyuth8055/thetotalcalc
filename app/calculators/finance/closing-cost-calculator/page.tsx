"use client";
import { useState, useMemo } from "react";
import Breadcrumbs from "@/components/Breadcrumbs";
import CalculatorLayout from "@/components/CalculatorLayout";
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from "recharts";

type LoanType = "Conventional" | "FHA" | "VA" | "Cash";
type Mode = "Buyer" | "Seller";

const STATE_RATES: { label: string; rate: number }[] = [
  { label: "New York (0.4%)", rate: 0.004 },
  { label: "Florida (0.35%)", rate: 0.0035 },
  { label: "California (0.11%)", rate: 0.0011 },
  { label: "Texas (0%)", rate: 0 },
  { label: "Illinois (0.1%)", rate: 0.001 },
  { label: "Pennsylvania (1%)", rate: 0.01 },
  { label: "New Jersey (1%)", rate: 0.01 },
  { label: "Ohio (0.1%)", rate: 0.001 },
  { label: "Other (0.25%)", rate: 0.0025 },
];

const PIE_COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#8b5cf6", "#ef4444"];

const fmt = (v: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(v);

const fmt2 = (v: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(v);

function SliderRow({
  label,
  value,
  setValue,
  min,
  max,
  step,
  prefix,
  suffix,
}: {
  label: string;
  value: number;
  setValue: (v: number) => void;
  min: number;
  max: number;
  step: number;
  prefix?: string;
  suffix?: string;
}) {
  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <label className="text-sm font-semibold text-gray-700">{label}</label>
        <div className="flex items-center gap-1">
          {prefix && <span className="text-sm text-gray-500">{prefix}</span>}
          <input
            type="number"
            value={value}
            onChange={(e) => setValue(Number(e.target.value) || 0)}
            className="w-28 px-2 py-1.5 text-right border border-gray-300 rounded-md text-sm font-semibold text-blue-600 focus:ring-2 focus:ring-blue-500"
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
        onChange={(e) => setValue(Number(e.target.value))}
        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
      />
      <div className="flex justify-between text-xs text-gray-400 mt-1">
        <span>{prefix}{min.toLocaleString()}{suffix}</span>
        <span>{prefix}{max.toLocaleString()}{suffix}</span>
      </div>
    </div>
  );
}

export default function ClosingCostCalculator() {
  const [mode, setMode] = useState<Mode>("Buyer");

  // Buyer state
  const [purchasePrice, setPurchasePrice] = useState(400000);
  const [downPct, setDownPct] = useState(10);
  const [interestRate, setInterestRate] = useState(7);
  const [loanType, setLoanType] = useState<LoanType>("Conventional");
  const [stateIndex, setStateIndex] = useState(0);

  // Seller state
  const [salePrice, setSalePrice] = useState(400000);
  const [commissionPct, setCommissionPct] = useState(5.5);
  const [transferTaxPct, setTransferTaxPct] = useState(0.5);
  const [titleFees, setTitleFees] = useState(2000);

  const buyerCalc = useMemo(() => {
    const stateRate = STATE_RATES[stateIndex].rate;
    const downPayment = purchasePrice * (downPct / 100);
    const loanAmount = purchasePrice - downPayment;
    const isCash = loanType === "Cash";

    const originationFee = isCash ? 0 : loanAmount * 0.01;
    const appraisal = 550;
    const lenderTitle = isCash ? 0 : loanAmount * 0.005;
    const ownerTitle = purchasePrice * 0.003;
    const homeInspection = 400;
    const creditReport = isCash ? 0 : 30;
    const recordingFees = 125;
    const prepaidInterest = isCash ? 0 : loanAmount * (interestRate / 100 / 365) * 15;
    const taxEscrow = isCash ? 0 : (8000 / 12) * 2;
    const homeownersInsurance = isCash ? 0 : 1500;
    const fhaMip = loanType === "FHA" ? loanAmount * 0.0175 : 0;
    const vaFundingFee = loanType === "VA" ? loanAmount * 0.023 : 0;
    const transferTax = purchasePrice * stateRate;

    const total =
      originationFee +
      appraisal +
      lenderTitle +
      ownerTitle +
      homeInspection +
      creditReport +
      recordingFees +
      prepaidInterest +
      taxEscrow +
      homeownersInsurance +
      fhaMip +
      vaFundingFee +
      transferTax;

    const cashNeeded = downPayment + total;
    const pctOfPrice = purchasePrice > 0 ? (total / purchasePrice) * 100 : 0;

    const lenderFees = originationFee + creditReport;
    const titleInsurance = lenderTitle + ownerTitle + homeownersInsurance;
    const govtFees = recordingFees + transferTax + fhaMip + vaFundingFee;
    const prepaids = prepaidInterest + taxEscrow;
    const inspectionAppraisal = homeInspection + appraisal;

    const pieData = [
      { name: "Lender Fees", value: Math.round(lenderFees) },
      { name: "Title & Insurance", value: Math.round(titleInsurance) },
      { name: "Government Fees", value: Math.round(govtFees) },
      { name: "Prepaid Items", value: Math.round(prepaids) },
      { name: "Inspection & Appraisal", value: Math.round(inspectionAppraisal) },
    ].filter((d) => d.value > 0);

    const lineItems = [
      { label: "Loan Origination Fee (1%)", value: originationFee, show: !isCash },
      { label: "Appraisal Fee", value: appraisal, show: true },
      { label: "Lender Title Insurance", value: lenderTitle, show: !isCash },
      { label: "Owner's Title Insurance", value: ownerTitle, show: true },
      { label: "Home Inspection", value: homeInspection, show: true },
      { label: "Credit Report Fee", value: creditReport, show: !isCash },
      { label: "Recording Fees", value: recordingFees, show: true },
      { label: "Prepaid Interest (15 days)", value: prepaidInterest, show: !isCash },
      { label: "Property Tax Escrow (2 mo.)", value: taxEscrow, show: !isCash },
      { label: "Homeowners Insurance (1 yr)", value: homeownersInsurance, show: !isCash },
      { label: "FHA Upfront MIP (1.75%)", value: fhaMip, show: loanType === "FHA" },
      { label: "VA Funding Fee (2.3%)", value: vaFundingFee, show: loanType === "VA" },
      { label: `State Transfer Tax (${(stateRate * 100).toFixed(2)}%)`, value: transferTax, show: true },
    ].filter((i) => i.show);

    return {
      downPayment,
      loanAmount,
      total,
      cashNeeded,
      pctOfPrice,
      lineItems,
      pieData,
    };
  }, [purchasePrice, downPct, interestRate, loanType, stateIndex]);

  const sellerCalc = useMemo(() => {
    const commission = salePrice * (commissionPct / 100);
    const transferTax = salePrice * (transferTaxPct / 100);
    const total = commission + transferTax + titleFees;
    const netToSeller = salePrice - total;
    return { commission, transferTax, total, netToSeller };
  }, [salePrice, commissionPct, transferTaxPct, titleFees]);

  const CustomTooltip = ({
    active,
    payload,
  }: {
    active?: boolean;
    payload?: { name: string; value: number }[];
  }) => {
    if (!active || !payload?.length) return null;
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-lg text-sm">
        <p className="font-semibold text-gray-700">{payload[0].name}</p>
        <p className="text-blue-600 font-bold">{fmt(payload[0].value)}</p>
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumbs
        items={[
          { label: "Finance Calculators", href: "/finance-calculators" },
          { label: "Closing Cost Calculator", href: "/calculators/finance/closing-cost-calculator" },
        ]}
      />

      {/* Header */}
      <div className="mb-6 flex items-start justify-between flex-wrap gap-3 print:hidden">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-1">Closing Cost Calculator</h1>
          <p className="text-base text-gray-600">
            Estimate buyer and seller closing costs including lender fees, title insurance, taxes, and prepaids
          </p>
        </div>
        <button
          onClick={() => window.print()}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          Download PDF
        </button>
      </div>

      {/* Mode Toggle */}
      <div className="flex gap-1 mb-6 bg-gray-100 rounded-xl p-1 w-fit print:hidden">
        {(["Buyer", "Seller"] as Mode[]).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`px-6 py-2 rounded-lg text-sm font-semibold transition-all ${
              mode === m
                ? "bg-white text-blue-600 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {m}
          </button>
        ))}
      </div>

      {/* Print title */}
      <div className="hidden print:block mb-4">
        <h1 className="text-2xl font-bold">Closing Cost Report — {mode}</h1>
        <p className="text-sm text-gray-600">thetotalcalc.com</p>
      </div>

      {/* ===== BUYER MODE ===== */}
      {mode === "Buyer" && (
        <>
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            {/* Inputs */}
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200 space-y-5 print:shadow-none print:border-gray-300">
              <h2 className="text-lg font-bold text-gray-900">Buyer Inputs</h2>

              <SliderRow
                label="Home Purchase Price"
                value={purchasePrice}
                setValue={setPurchasePrice}
                min={100000}
                max={1500000}
                step={5000}
                prefix="$"
              />

              <SliderRow
                label="Down Payment %"
                value={downPct}
                setValue={setDownPct}
                min={3.5}
                max={30}
                step={0.5}
                suffix="%"
              />

              <SliderRow
                label="Interest Rate %"
                value={interestRate}
                setValue={setInterestRate}
                min={3}
                max={12}
                step={0.1}
                suffix="%"
              />

              {/* Loan Type */}
              <div>
                <label className="text-sm font-semibold text-gray-700 block mb-2">Loan Type</label>
                <div className="flex gap-2 flex-wrap">
                  {(["Conventional", "FHA", "VA", "Cash"] as LoanType[]).map((t) => (
                    <button
                      key={t}
                      onClick={() => setLoanType(t)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
                        loanType === t
                          ? "bg-blue-600 text-white border-blue-600"
                          : "bg-white text-gray-700 border-gray-300 hover:border-blue-400"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* State */}
              <div>
                <label className="text-sm font-semibold text-gray-700 block mb-2">State</label>
                <select
                  value={stateIndex}
                  onChange={(e) => setStateIndex(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {STATE_RATES.map((s, i) => (
                    <option key={i} value={i}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Computed summary below inputs */}
              <div className="bg-gray-50 rounded-lg p-3 grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-gray-500">Down Payment</span>
                  <div className="font-semibold text-gray-800">{fmt(buyerCalc.downPayment)}</div>
                </div>
                <div>
                  <span className="text-gray-500">Loan Amount</span>
                  <div className="font-semibold text-gray-800">{fmt(buyerCalc.loanAmount)}</div>
                </div>
              </div>
            </div>

            {/* Results */}
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200 print:shadow-none print:border-gray-300">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Closing Cost Breakdown</h2>

              {/* Big number */}
              <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-5 text-center mb-4">
                <div className="text-sm text-gray-600 mb-1">Total Closing Costs</div>
                <div className="text-4xl font-bold text-blue-600">{fmt(buyerCalc.total)}</div>
                <div className="text-sm text-gray-500 mt-1">
                  {buyerCalc.pctOfPrice.toFixed(2)}% of purchase price
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-green-50 rounded-lg p-3 text-center">
                  <div className="text-xs text-gray-500 mb-0.5">Cash Needed at Closing</div>
                  <div className="text-xl font-bold text-green-700">{fmt(buyerCalc.cashNeeded)}</div>
                  <div className="text-xs text-gray-400 mt-0.5">Down payment + closing costs</div>
                </div>
                <div className="bg-purple-50 rounded-lg p-3 text-center">
                  <div className="text-xs text-gray-500 mb-0.5">% of Purchase Price</div>
                  <div className="text-xl font-bold text-purple-700">
                    {buyerCalc.pctOfPrice.toFixed(2)}%
                  </div>
                  <div className="text-xs text-gray-400 mt-0.5">Closing costs only</div>
                </div>
              </div>

              {/* Line items table */}
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-3 py-2 text-left font-semibold text-gray-700 border-b border-gray-200">
                        Item
                      </th>
                      <th className="px-3 py-2 text-right font-semibold text-gray-700 border-b border-gray-200">
                        Amount
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {buyerCalc.lineItems.map((item, i) => (
                      <tr
                        key={item.label}
                        className={i % 2 === 0 ? "bg-white" : "bg-gray-50/50"}
                      >
                        <td className="px-3 py-2 border-b border-gray-100 text-gray-700">
                          {item.label}
                        </td>
                        <td className="px-3 py-2 border-b border-gray-100 text-right font-medium text-gray-800">
                          {fmt2(item.value)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="bg-blue-50">
                      <td className="px-3 py-2.5 font-bold text-blue-800 border-t-2 border-blue-200">
                        Total Closing Costs
                      </td>
                      <td className="px-3 py-2.5 text-right font-bold text-blue-800 border-t-2 border-blue-200">
                        {fmt(buyerCalc.total)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </div>

          {/* Pie Chart */}
          {buyerCalc.pieData.length > 0 && (
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200 mb-6 print:shadow-none print:border-gray-300 print:break-inside-avoid">
              <h2 className="text-lg font-bold text-gray-900 mb-4">
                Closing Cost Breakdown by Category
              </h2>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={buyerCalc.pieData}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    dataKey="value"
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                    labelLine={false}
                  >
                    {buyerCalc.pieData.map((_entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={PIE_COLORS[index % PIE_COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </>
      )}

      {/* ===== SELLER MODE ===== */}
      {mode === "Seller" && (
        <>
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            {/* Seller Inputs */}
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200 space-y-5 print:shadow-none print:border-gray-300">
              <h2 className="text-lg font-bold text-gray-900">Seller Inputs</h2>

              <SliderRow
                label="Sale Price"
                value={salePrice}
                setValue={setSalePrice}
                min={100000}
                max={1500000}
                step={5000}
                prefix="$"
              />

              <SliderRow
                label="Agent Commission %"
                value={commissionPct}
                setValue={setCommissionPct}
                min={0}
                max={7}
                step={0.1}
                suffix="%"
              />

              <SliderRow
                label="Transfer Tax %"
                value={transferTaxPct}
                setValue={setTransferTaxPct}
                min={0}
                max={3}
                step={0.05}
                suffix="%"
              />

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-semibold text-gray-700">
                    Title / Escrow Fees
                  </label>
                  <input
                    type="number"
                    value={titleFees}
                    onChange={(e) => setTitleFees(Number(e.target.value) || 0)}
                    className="w-28 px-2 py-1.5 text-right border border-gray-300 rounded-md text-sm font-semibold text-blue-600 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <p className="text-xs text-gray-400">Enter exact amount (default $2,000)</p>
              </div>
            </div>

            {/* Seller Results */}
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200 print:shadow-none print:border-gray-300">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Seller Net Proceeds</h2>

              <div className="bg-green-50 border-2 border-green-200 rounded-xl p-5 text-center mb-4">
                <div className="text-sm text-gray-600 mb-1">Net Proceeds to Seller</div>
                <div className="text-4xl font-bold text-green-600">
                  {fmt(sellerCalc.netToSeller)}
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  After all selling costs
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-3 py-2 text-left font-semibold text-gray-700 border-b border-gray-200">
                        Item
                      </th>
                      <th className="px-3 py-2 text-right font-semibold text-gray-700 border-b border-gray-200">
                        Amount
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="bg-white">
                      <td className="px-3 py-2 border-b border-gray-100 text-gray-700">
                        Sale Price
                      </td>
                      <td className="px-3 py-2 border-b border-gray-100 text-right font-medium text-gray-800">
                        {fmt(salePrice)}
                      </td>
                    </tr>
                    <tr className="bg-gray-50/50">
                      <td className="px-3 py-2 border-b border-gray-100 text-gray-700">
                        Agent Commission ({commissionPct}%)
                      </td>
                      <td className="px-3 py-2 border-b border-gray-100 text-right font-medium text-red-600">
                        − {fmt(sellerCalc.commission)}
                      </td>
                    </tr>
                    <tr className="bg-white">
                      <td className="px-3 py-2 border-b border-gray-100 text-gray-700">
                        Transfer Tax ({transferTaxPct}%)
                      </td>
                      <td className="px-3 py-2 border-b border-gray-100 text-right font-medium text-red-600">
                        − {fmt(sellerCalc.transferTax)}
                      </td>
                    </tr>
                    <tr className="bg-gray-50/50">
                      <td className="px-3 py-2 border-b border-gray-100 text-gray-700">
                        Title / Escrow Fees
                      </td>
                      <td className="px-3 py-2 border-b border-gray-100 text-right font-medium text-red-600">
                        − {fmt(titleFees)}
                      </td>
                    </tr>
                  </tbody>
                  <tfoot>
                    <tr className="bg-red-50">
                      <td className="px-3 py-2.5 font-bold text-red-800 border-t-2 border-red-200">
                        Total Seller Costs
                      </td>
                      <td className="px-3 py-2.5 text-right font-bold text-red-800 border-t-2 border-red-200">
                        {fmt(sellerCalc.total)}
                      </td>
                    </tr>
                    <tr className="bg-green-50">
                      <td className="px-3 py-2.5 font-bold text-green-800 border-t border-green-200">
                        Net to Seller
                      </td>
                      <td className="px-3 py-2.5 text-right font-bold text-green-800 border-t border-green-200">
                        {fmt(sellerCalc.netToSeller)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Print styles */}
      <style jsx global>{`
        @media print {
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .print\\:hidden { display: none !important; }
          .print\\:block { display: block !important; }
          .print\\:break-inside-avoid { break-inside: avoid; }
          .print\\:shadow-none { box-shadow: none !important; }
          .print\\:border-gray-300 { border-color: #d1d5db !important; }
        }
      `}</style>

      <CalculatorLayout
        title=""
        description=""
        explanation={
          <div className="space-y-4 text-sm text-gray-700 leading-relaxed">
            <h2 className="text-xl font-bold text-gray-900">Understanding Closing Costs</h2>

            <p>
              Closing costs are the fees and expenses paid at the settlement table when a real
              estate transaction closes. For buyers, these typically run 2–5% of the loan amount
              on top of the down payment. Knowing what to expect prevents last-minute surprises
              that can derail a deal.
            </p>

            <h3 className="font-bold text-gray-800">The Loan Estimate (LE) Document</h3>
            <p>
              Federal law (TRID) requires lenders to provide a Loan Estimate within three business
              days of receiving your loan application. The LE is a standardized three-page document
              that outlines your projected interest rate, monthly payment, and all estimated closing
              costs broken into categories: origination charges, services you can shop for, services
              you cannot shop for, prepaid items, and initial escrow payments. Use it to compare
              offers from multiple lenders apples-to-apples.
            </p>

            <h3 className="font-bold text-gray-800">The Closing Disclosure (CD)</h3>
            <p>
              Three business days before closing, your lender must deliver the Closing Disclosure —
              the final, legally binding version of your closing costs. Compare it line-by-line with
              your Loan Estimate. Most fees cannot increase by more than 10% (zero tolerance items
              like origination fees cannot increase at all). If numbers have shifted significantly,
              ask your lender for a written explanation before signing.
            </p>

            <h3 className="font-bold text-gray-800">Shopping for Title Insurance</h3>
            <p>
              In most states, buyers have the right to choose their own title company for owner's
              title insurance. Title fees vary widely — shopping can save $300–$800 on a typical
              transaction. Request quotes from two or three title companies and compare the premium
              plus settlement fee. Note: some states (like New Jersey and New York) have regulated
              title rates, leaving less room to negotiate, but the settlement/closing fee is still
              competitive.
            </p>

            <h3 className="font-bold text-gray-800">Negotiating Seller Concessions</h3>
            <p>
              In a buyer's market, sellers often agree to cover a portion of closing costs — called
              seller concessions or seller-paid costs. Conventional loans allow up to 3% (with
              less than 10% down), 6% (10–25% down), or 9% (over 25% down). FHA allows up to 6%.
              VA permits up to 4% plus reasonable and customary fees. Concessions are built into
              the purchase price, so the home must appraise at the higher value for the deal to work.
            </p>

            <h3 className="font-bold text-gray-800">No-Closing-Cost Loans: When They Make Sense</h3>
            <p>
              Lenders can roll closing costs into a slightly higher interest rate — you pay nothing
              upfront, but your monthly payment increases. The math: divide total closing costs by
              the monthly payment increase to find the breakeven point in months. If you plan to
              sell or refinance before that breakeven (often 4–7 years), a no-closing-cost loan
              wins. If you're staying long-term, paying upfront is almost always cheaper.
            </p>

            <h3 className="font-bold text-gray-800">Wire Fraud at Closing</h3>
            <p>
              Real estate wire fraud is one of the fastest-growing financial crimes in the U.S.
              Scammers intercept email communications and send convincing fake wiring instructions.
              Always verify wire instructions by calling your title company or attorney directly
              using a phone number you looked up independently — never one found in an email. Never
              wire funds based solely on email instructions, even if they appear to come from a
              trusted contact.
            </p>

            <h3 className="font-bold text-gray-800">Closing Costs vs. Prepaids and Escrows</h3>
            <p>
              Many buyers confuse closing costs with prepaid items and escrow deposits. True closing
              costs are one-time fees for services (origination, title, appraisal). Prepaids are
              expenses paid in advance: homeowners insurance premium, prepaid interest for the
              remaining days of the month, and initial escrow deposits for property taxes and
              insurance. Both appear on your Closing Disclosure but serve different purposes —
              prepaids are your money held in reserve, not fees paid to the lender.
            </p>

            <h3 className="font-bold text-gray-800">First-Time Buyer Assistance Programs</h3>
            <p>
              Every state offers Down Payment Assistance (DPA) programs, and many counties and
              cities do too. Programs range from forgivable grants (no repayment if you stay 5+
              years) to low-interest second mortgages. HUD's website lists approved housing
              counseling agencies that can connect you with local programs. Some programs cover
              closing costs in full; others provide 3–5% of the purchase price. Income limits
              typically apply, but many programs serve households earning up to 120% of area
              median income.
            </p>

            <h3 className="font-bold text-gray-800">Who Chooses the Title Company?</h3>
            <p>
              This varies by state custom. In buyer-controlled states (California, Texas, most of
              the Midwest), the buyer typically selects the title/escrow company. In
              seller-controlled states (Florida, New York, New Jersey), the seller traditionally
              controls the choice. RESPA prohibits sellers from requiring use of a specific title
              company as a condition of sale, but custom can create pressure. In all cases, the
              buyer retains the right to shop for and purchase their own owner's title insurance
              policy separately.
            </p>

            <h3 className="font-bold text-gray-800">Remote Online Notarization (RON)</h3>
            <p>
              Over 40 U.S. states have passed laws enabling Remote Online Notarization — closing
              documents are signed and notarized via live video call with a licensed notary.
              RON eliminates the need for all parties to be physically present at a title office,
              making it especially useful for relocation buyers, investors with multiple properties,
              and transactions where parties are in different states. Lenders must also accept
              e-notes for RON closings to be fully electronic; adoption is growing but not yet
              universal across all lenders.
            </p>
          </div>
        }
        faqs={[
          {
            question: "Can I roll closing costs into my mortgage?",
            answer:
              "Yes, in two ways. First, you can ask the lender for a 'no-closing-cost' loan where costs are covered by accepting a slightly higher interest rate. Second, on refinances (not purchases), some loan programs allow rolling costs into the new loan balance. On a purchase, you cannot simply add closing costs to the loan beyond the appraised value unless the seller is paying them via concessions built into the purchase price.",
          },
          {
            question: "What is the difference between a Loan Estimate and a Closing Disclosure?",
            answer:
              "The Loan Estimate (LE) is the initial good-faith estimate lenders must provide within 3 business days of application — it's an approximation used to compare lenders. The Closing Disclosure (CD) is the final, legally binding version provided at least 3 business days before closing. The CD reflects actual costs; most fees must match the LE within tolerance limits (0–10% depending on the fee category). If costs jumped significantly without a 'changed circumstance,' the lender may need to re-disclose.",
          },
          {
            question: "Can I negotiate closing costs with the lender?",
            answer:
              "Absolutely. Origination fees, application fees, and rate lock fees are negotiable. You can also ask for a lender credit in exchange for a slightly higher interest rate, which reduces upfront costs. Shopping at least 3 lenders and comparing their Loan Estimates is the most effective strategy — lenders often match or beat competitors' fees to earn your business. Third-party costs (appraisal, title, recording) are set by outside vendors, but you can shop for title insurance independently.",
          },
          {
            question: "What are seller concessions and how much can the seller pay?",
            answer:
              "Seller concessions are credits from the seller to help cover buyer closing costs. Limits depend on loan type and down payment: Conventional allows 3–9% (tied to down payment size), FHA allows up to 6%, VA allows up to 4% plus customary fees, and USDA allows up to 6%. The concession is negotiated into the purchase price, meaning the home must appraise at or above the agreed price. Concessions cannot be used to reduce the down payment — only to offset closing costs and prepaids.",
          },
          {
            question: "How do closing costs differ between FHA, VA, and conventional loans?",
            answer:
              "FHA loans require an upfront Mortgage Insurance Premium (MIP) of 1.75% of the loan amount — a significant cost that can be financed into the loan. VA loans charge a Funding Fee (2.3% for first-time use with no down payment) instead of monthly PMI; veterans with service-related disabilities are exempt. Conventional loans avoid both fees but may require PMI until you reach 20% equity. FHA and VA loans also have limits on which fees sellers can pay, while conventional loans are more flexible. Overall, VA loans often have the lowest total closing costs for eligible buyers.",
          },
        ]}
        relatedCalculators={[
          {
            name: "Home Sale Proceeds Calculator",
            href: "/calculators/finance/home-sale-proceeds-calculator",
          },
          {
            name: "Rental Property ROI Calculator",
            href: "/calculators/finance/rental-property-roi-calculator",
          },
          {
            name: "Cap Rate Calculator",
            href: "/calculators/finance/cap-rate-calculator",
          },
          {
            name: "Mortgage Calculator",
            href: "/calculators/finance/mortgage-calculator",
          },
        ]}
      >
        <div />
      </CalculatorLayout>
    </div>
  );
}
