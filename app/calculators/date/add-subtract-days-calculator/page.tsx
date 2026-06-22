"use client";

import { useState, useEffect } from "react";
import Breadcrumbs from "@/components/Breadcrumbs";
import CalculatorLayout from "@/components/CalculatorLayout";
import MobileResultBar from "@/components/calculators/MobileResultBar";
import { scrollToResults } from "@/lib/ui/scrollToResults";

export default function AddSubtractDaysCalculator() {
  const [startDate, setStartDate] = useState("");
  const [days, setDays] = useState("30");
  const [operation, setOperation] = useState<"add" | "subtract">("add");
  const [result, setResult] = useState<string | null>(null);

  useEffect(() => {
    const recent = JSON.parse(localStorage.getItem("recentCalculators") || "[]");
    const updated = ["add-days", ...recent.filter((id: string) => id !== "add-days")].slice(0, 10);
    localStorage.setItem("recentCalculators", JSON.stringify(updated));
  }, []);

  const calculate = () => {
    if (!startDate) return;

    const date = new Date(startDate);
    const daysNum = parseInt(days);

    if (!isNaN(daysNum)) {
      if (operation === "add") {
        date.setDate(date.getDate() + daysNum);
      } else {
        date.setDate(date.getDate() - daysNum);
      }

      setResult(date.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }));
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Breadcrumbs
        items={[
          { label: "Date Calculators", href: "/date-calculators" },
          { label: "Add/Subtract Days", href: "/calculators/date/add-subtract-days-calculator" },
        ]}
      />

      <CalculatorLayout
        title="Add/Subtract Days Calculator"
        description="Add or subtract days from any date to find a future or past date."
        explanation={
          <div className="space-y-4">
            <p>
              This calculator answers a simple but surprisingly fiddly question: what date falls a given number of days
              before or after a starting date? Choose a start date, pick add or subtract, type the number of days, and it
              returns the resulting date along with the day of the week. It handles every calendar complication for you -
              months of different lengths, leap years, and the roll-over from one month or year to the next - so you do
              not have to count on your fingers or risk an off-by-one error.
            </p>
            <h3 className="text-lg font-semibold text-gray-900">How it works</h3>
            <p>
              The tool takes your start date and moves the calendar forward or backward by the exact number of days you
              enter. Because it shifts by real calendar days rather than by months, the answer is always precise: adding
              30 days lands on a genuine date 30 days later, even if that crosses into a new month with a different length.
              Subtracting works the same way in reverse, stepping back day by day into the past. The result includes the
              weekday, which is often the detail people actually need.
            </p>
            <h3 className="text-lg font-semibold text-gray-900">A worked example</h3>
            <p>
              Say you sign a document on 15 January 2025 and a clause gives the other side 45 days to respond. Enter 15
              January 2025, choose add, and type 45. The calculator returns 1 March 2025, a Saturday. Notice that it
              correctly steps through the 31 days of January and the 28 days of February 2025 (a non-leap year) to land on
              the right date. Change the year to 2024, a leap year, and the same 45-day count from 15 January lands on 29
              February instead, because that year has an extra day.
            </p>
            <h3 className="text-lg font-semibold text-gray-900">Why people use it</h3>
            <ul className="list-disc space-y-1 pl-6">
              <li>Finding a deadline a set number of days out, such as a 30-day notice period or a 90-day return window.</li>
              <li>Working out a due date in pregnancy, a follow-up appointment, or a project milestone.</li>
              <li>Calculating warranty or guarantee expiry from a purchase date.</li>
              <li>Backdating: finding the date a given number of days before an event, for planning or eligibility checks.</li>
            </ul>
            <h3 className="text-lg font-semibold text-gray-900">Calendar days versus business days</h3>
            <p>
              This calculator counts calendar days, meaning it includes weekends and public holidays. Many legal,
              financial, and shipping deadlines instead count only business days, which excludes Saturdays, Sundays, and
              holidays. If your deadline is defined in business days, the calendar-day result here will fall earlier than
              the true business-day deadline, so always check which basis your agreement uses before relying on the date.
            </p>
          </div>
        }
        faqs={[
          { question: "Does this account for leap years?", answer: "Yes. The calculator works from the real calendar, so any 29 February in the span you cross is automatically included when adding or subtracting days. The resulting date is always a genuine calendar date." },
          { question: "Does it count calendar days or business days?", answer: "It counts calendar days, including weekends and public holidays. If your deadline is measured in business days only, the actual date will be later than the result shown here, because weekends and holidays would be skipped." },
          { question: "Can I subtract days to find a past date?", answer: "Yes. Choose the subtract option and the calculator steps backward from your start date by the number of days you enter, returning the earlier date and its weekday." },
          { question: "Why does the result also show the day of the week?", answer: "The weekday is often the reason people use the tool - to check whether a deadline lands on a weekend, for instance. Knowing the day helps you plan around closures or move a deadline to the next working day if needed." },
          { question: "Is there a limit to how many days I can add?", answer: "You can enter large numbers, and the calculator will still return a valid date many years into the past or future. For very long spans, double-check the result if exact historical calendar accuracy matters." },
          { question: "Does daylight saving time change the result?", answer: "No. Because the calculator works in whole calendar days rather than exact hours, daylight saving changes do not shift the resulting date. The clocks moving forward or back by an hour affects the time of day, not which calendar date falls a set number of days away." },
          { question: "What date format does it use?", answer: "You select the start date from a date picker, so there is no ambiguity between day-first and month-first formats. The result is shown with the full month name and the weekday, which removes any confusion about whether, say, 03/04 means 3 April or 4 March." },
        ]}
        relatedCalculators={[
          { name: "Date Difference", href: "/calculators/date/date-difference-calculator" },
          { name: "Age Calculator", href: "/calculators/date/age-calculator" },
        ]}
      >
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Operation</label>
            <select
              value={operation}
              onChange={(e) => setOperation(e.target.value as "add" | "subtract")}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            >
              <option value="add">Add Days</option>
              <option value="subtract">Subtract Days</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Number of Days</label>
            <input
              type="number"
              value={days}
              onChange={(e) => setDays(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              placeholder="30"
            />
          </div>

          <button
            onClick={() => {
              calculate();
              requestAnimationFrame(() => scrollToResults());
            }}
            className="w-full bg-primary-600 text-white py-4 rounded-lg font-semibold text-lg hover:bg-primary-700 transition-colors"
          >
            Calculate
          </button>

          {result && (
            <div id="results" className="mt-8 p-6 bg-indigo-50 rounded-lg border-2 border-indigo-200 text-center scroll-mt-24">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Result</h3>
              <div className="text-2xl font-bold text-indigo-600">{result}</div>
            </div>
          )}
        </div>
      </CalculatorLayout>

      <MobileResultBar
        label="Result date"
        value={result || ""}
        show={!!result}
      />
    </div>
  );
}
