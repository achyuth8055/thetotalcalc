"use client";

import { useState, useEffect } from "react";
import Breadcrumbs from "@/components/Breadcrumbs";
import CalculatorLayout from "@/components/CalculatorLayout";

function minutesFromTime(t: string): number | null {
  const parts = t.split(":");
  if (parts.length !== 2) return null;
  const h = parseInt(parts[0], 10);
  const m = parseInt(parts[1], 10);
  if (Number.isNaN(h) || Number.isNaN(m)) return null;
  return h * 60 + m;
}

export default function WorkHoursCalculator() {
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("17:30");
  const [breakMinutes, setBreakMinutes] = useState("30");
  const [hourlyRate, setHourlyRate] = useState("");
  const [currency, setCurrency] = useState("$");

  const [result, setResult] = useState<{
    totalMinutes: number;
    hours: number;
    minutes: number;
    decimalHours: number;
    overnight: boolean;
    pay: number | null;
  } | null>(null);

  useEffect(() => {
    const recent = JSON.parse(localStorage.getItem("recentCalculators") || "[]");
    const updated = ["work-hours", ...recent.filter((id: string) => id !== "work-hours")].slice(0, 10);
    localStorage.setItem("recentCalculators", JSON.stringify(updated));
  }, []);

  const calculate = () => {
    const start = minutesFromTime(startTime);
    const end = minutesFromTime(endTime);
    const brk = parseFloat(breakMinutes) || 0;

    if (start === null || end === null) {
      setResult(null);
      return;
    }

    // If the end time is at or before the start, treat it as an overnight shift.
    let span = end - start;
    let overnight = false;
    if (span <= 0) {
      span += 24 * 60;
      overnight = true;
    }

    const totalMinutes = Math.max(0, span - brk);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    const decimalHours = totalMinutes / 60;

    const rate = parseFloat(hourlyRate);
    const pay = !Number.isNaN(rate) && rate > 0 ? decimalHours * rate : null;

    setResult({ totalMinutes, hours, minutes, decimalHours, overnight, pay });
  };

  const inputClass =
    "w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500";

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Breadcrumbs
        items={[
          { label: "Everyday Calculators", href: "/everyday-calculators" },
          { label: "Work Hours Calculator", href: "/calculators/everyday/work-hours-calculator" },
        ]}
      />

      <CalculatorLayout
        title="Work Hours Calculator"
        description="Add up the hours in a shift in seconds. Enter your start and end times and any unpaid break to get total hours worked, plus optional gross pay from your hourly rate."
        explanation={
          <div>
            <p className="mb-4">
              Working out hours by hand is fiddly because time is in base 60, not base 10. From 9:00 to
              17:30 is 8 hours and 30 minutes, which is 8.5 hours in decimal, not 8.3. This calculator
              handles both the clock format and the decimal format that payroll systems use.
            </p>
            <p className="mb-4">
              <strong>How it works:</strong> Total time = end time minus start time, minus any unpaid
              break. If the end time is earlier than the start time, the calculator assumes the shift
              runs past midnight and adds a day, so overnight shifts come out right.
            </p>
            <p>
              Enter an hourly rate to also see estimated gross pay for the shift. This is pay before
              tax and other deductions, so your take-home amount will be lower.
            </p>
          </div>
        }
        faqs={[
          {
            question: "How do I convert hours and minutes to decimal hours?",
            answer:
              "Divide the minutes by 60 and add them to the hours. 30 minutes is 0.5 hours, 15 minutes is 0.25 hours, and 45 minutes is 0.75 hours. The calculator shows both the clock format and the decimal format for you.",
          },
          {
            question: "Does it handle overnight or night shifts?",
            answer:
              "Yes. If your end time is earlier than your start time, for example 22:00 to 06:00, the calculator assumes the shift crosses midnight and adds 24 hours, giving the correct total.",
          },
          {
            question: "Should I subtract my lunch break?",
            answer:
              "If your break is unpaid, enter it in the break field so it is removed from the total. If your break is paid, leave the field at zero so the full shift counts.",
          },
          {
            question: "Is the pay figure my take-home amount?",
            answer:
              "No. The pay figure is gross pay, before income tax, payroll taxes, pension or retirement contributions, and other deductions. Your actual take-home pay will be lower. This is an estimate, not payroll or tax advice.",
          },
        ]}
        relatedCalculators={[
          { name: "Paycheck Calculator", href: "/calculators/finance/paycheck-calculator" },
          { name: "US Salary After Tax", href: "/calc/us-salary-after-tax" },
          { name: "UK Salary After Tax", href: "/calc/uk-salary-after-tax" },
        ]}
      >
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Start Time</label>
              <input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">End Time</label>
              <input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} className={inputClass} />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Unpaid Break (minutes)</label>
              <input type="number" value={breakMinutes} onChange={(e) => setBreakMinutes(e.target.value)} className={inputClass} placeholder="30" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Hourly Rate (optional)</label>
              <div className="flex gap-2">
                <select value={currency} onChange={(e) => setCurrency(e.target.value)} className="px-3 py-3 border border-gray-300 rounded-lg">
                  <option value="$">$</option>
                  <option value="£">£</option>
                  <option value="€">€</option>
                  <option value="₹">₹</option>
                </select>
                <input type="number" step="0.01" value={hourlyRate} onChange={(e) => setHourlyRate(e.target.value)} className={inputClass} placeholder="20.00" />
              </div>
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
                  <span className="text-gray-700">Total worked</span>
                  <span className="text-lg font-semibold text-gray-900">
                    {result.hours}h {result.minutes}m
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700 font-semibold">Decimal hours</span>
                  <span className="text-3xl font-bold text-green-600">{result.decimalHours.toFixed(2)}</span>
                </div>
                {result.pay !== null && (
                  <div className="flex justify-between items-center pt-3 border-t border-green-200">
                    <span className="text-gray-700 font-semibold">Estimated gross pay</span>
                    <span className="text-2xl font-bold text-gray-900">
                      {currency}
                      {result.pay.toFixed(2)}
                    </span>
                  </div>
                )}
              </div>
              {result.overnight && (
                <div className="mt-4 p-3 bg-white rounded-lg">
                  <p className="text-center text-gray-700 text-sm">
                    Counted as an overnight shift, since the end time falls on the next day.
                  </p>
                </div>
              )}
              {result.pay !== null && (
                <div className="mt-3 p-3 bg-white rounded-lg">
                  <p className="text-center text-xs text-gray-500">
                    Gross pay before tax and deductions. Estimate only, not payroll or tax advice.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </CalculatorLayout>
    </div>
  );
}
