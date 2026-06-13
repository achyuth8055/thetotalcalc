"use client";

import { useState, useEffect } from "react";
import Breadcrumbs from "@/components/Breadcrumbs";
import CalculatorLayout from "@/components/CalculatorLayout";

export default function ElectricityCostCalculator() {
  const [power, setPower] = useState("1000");
  const [powerUnit, setPowerUnit] = useState<"W" | "kW">("W");
  const [hoursPerDay, setHoursPerDay] = useState("4");
  const [daysPerWeek, setDaysPerWeek] = useState("7");
  const [rate, setRate] = useState("0.17");
  const [currency, setCurrency] = useState("$");

  const [result, setResult] = useState<{
    kwhPerDay: number;
    costPerDay: number;
    costPerMonth: number;
    costPerYear: number;
    kwhPerYear: number;
  } | null>(null);

  useEffect(() => {
    const recent = JSON.parse(localStorage.getItem("recentCalculators") || "[]");
    const updated = ["electricity-cost", ...recent.filter((id: string) => id !== "electricity-cost")].slice(0, 10);
    localStorage.setItem("recentCalculators", JSON.stringify(updated));
  }, []);

  const calculate = () => {
    const p = parseFloat(power);
    const hrs = parseFloat(hoursPerDay);
    const days = parseFloat(daysPerWeek);
    const r = parseFloat(rate);

    if (!(p > 0) || !(hrs >= 0) || !(days >= 0) || !(r >= 0)) {
      setResult(null);
      return;
    }

    const kw = powerUnit === "kW" ? p : p / 1000;
    // Average usage per day, accounting for days used per week.
    const kwhPerDay = kw * hrs * (days / 7);
    const costPerDay = kwhPerDay * r;
    const costPerYear = costPerDay * 365;
    const costPerMonth = costPerYear / 12;
    const kwhPerYear = kwhPerDay * 365;

    setResult({ kwhPerDay, costPerDay, costPerMonth, costPerYear, kwhPerYear });
  };

  const inputClass =
    "w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500";
  const fmt = (n: number) => `${currency}${n.toFixed(2)}`;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Breadcrumbs
        items={[
          { label: "Everyday Calculators", href: "/everyday-calculators" },
          { label: "Electricity Cost Calculator", href: "/calculators/everyday/electricity-cost-calculator" },
        ]}
      />

      <CalculatorLayout
        title="Electricity Cost Calculator"
        description="Find out what any appliance really costs to run. Enter its power, how long you use it, and your electricity rate to see the daily, monthly, and yearly cost."
        explanation={
          <div>
            <p className="mb-4">
              Your electricity bill is measured in kilowatt-hours (kWh). One kilowatt-hour is the
              energy a 1,000-watt appliance uses in one hour. This calculator turns an appliance label
              into a real running cost so you can see which devices quietly drive your bill.
            </p>
            <p className="mb-4">
              <strong>How it works:</strong> Energy used per day (kWh) = power in kilowatts multiplied
              by hours used per day, scaled by how many days a week you use it. Cost = energy used
              multiplied by your price per kWh. We then extend the daily figure to a month and a year.
            </p>
            <p>
              You can find an appliance&apos;s wattage on its rating label, the power supply, or the
              manual. If only amps and volts are listed, multiply them to get watts (watts = volts
              times amps).
            </p>
          </div>
        }
        faqs={[
          {
            question: "Where do I find my electricity rate per kWh?",
            answer:
              "Your rate is on your electricity bill, usually shown as a price per kWh or per unit. If you have a tiered or time-of-use plan, use your average rate for a rough figure, or your peak rate for a worst-case estimate.",
          },
          {
            question: "How do I convert watts to kilowatts?",
            answer:
              "Divide watts by 1,000. A 1,500-watt heater is 1.5 kW. This calculator does the conversion automatically when you pick the watts or kilowatts unit.",
          },
          {
            question: "Does standby power count?",
            answer:
              "Yes. Many devices draw a few watts even when off or idle. Over a full year that standby draw adds up, so if you want the complete picture, run a separate calculation using the standby wattage and 24 hours a day.",
          },
          {
            question: "Why is my bill higher than the total of my appliances?",
            answer:
              "Bills also include fixed daily standing charges, taxes, and appliances you may have overlooked. This tool estimates the running cost of a single device, which is ideal for comparing appliances or deciding whether an upgrade pays off.",
          },
        ]}
        relatedCalculators={[
          { name: "Fuel Cost Calculator", href: "/calculators/everyday/fuel-cost-calculator" },
          { name: "Unit Price Calculator", href: "/calculators/everyday/unit-price-calculator" },
          { name: "Inflation Calculator", href: "/calculators/finance/inflation-calculator" },
        ]}
      >
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Appliance Power</label>
              <input type="number" value={power} onChange={(e) => setPower(e.target.value)} className={inputClass} placeholder="1000" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Power Unit</label>
              <select value={powerUnit} onChange={(e) => setPowerUnit(e.target.value as "W" | "kW")} className={inputClass}>
                <option value="W">Watts (W)</option>
                <option value="kW">Kilowatts (kW)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Hours Used Per Day</label>
              <input type="number" value={hoursPerDay} onChange={(e) => setHoursPerDay(e.target.value)} className={inputClass} placeholder="4" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Days Used Per Week</label>
              <input type="number" value={daysPerWeek} onChange={(e) => setDaysPerWeek(e.target.value)} className={inputClass} placeholder="7" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Price per kWh</label>
              <input type="number" step="0.01" value={rate} onChange={(e) => setRate(e.target.value)} className={inputClass} placeholder="0.17" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Currency Symbol</label>
              <select value={currency} onChange={(e) => setCurrency(e.target.value)} className={inputClass}>
                <option value="$">$ (USD / CAD)</option>
                <option value="£">£ (GBP)</option>
                <option value="€">€ (EUR)</option>
                <option value="₹">₹ (INR)</option>
              </select>
            </div>
          </div>

          <button
            onClick={calculate}
            className="w-full bg-primary-600 text-white py-4 rounded-lg font-semibold text-lg hover:bg-primary-700 transition-colors"
          >
            Calculate
          </button>

          {result && (
            <div className="mt-8 p-6 bg-green-50 rounded-lg border-2 border-green-200">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Results</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-3 border-b border-green-200">
                  <span className="text-gray-700">Energy used per day</span>
                  <span className="text-lg font-semibold text-gray-900">{result.kwhPerDay.toFixed(2)} kWh</span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-green-200">
                  <span className="text-gray-700">Cost per day</span>
                  <span className="text-lg font-semibold text-gray-900">{fmt(result.costPerDay)}</span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-green-200">
                  <span className="text-gray-700">Cost per month</span>
                  <span className="text-lg font-semibold text-gray-900">{fmt(result.costPerMonth)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700 font-semibold">Cost per year</span>
                  <span className="text-3xl font-bold text-green-600">{fmt(result.costPerYear)}</span>
                </div>
              </div>
              <div className="mt-4 p-3 bg-white rounded-lg">
                <p className="text-center text-gray-700 text-sm">
                  That is about <strong>{result.kwhPerYear.toFixed(0)} kWh</strong> of electricity a year.
                </p>
                <p className="text-center text-xs text-gray-500 mt-2">
                  Estimate only, based on the figures you entered and excluding fixed standing charges and taxes.
                </p>
              </div>
            </div>
          )}
        </div>
      </CalculatorLayout>
    </div>
  );
}
