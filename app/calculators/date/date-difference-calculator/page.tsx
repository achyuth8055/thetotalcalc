"use client";

import { useState, useEffect } from "react";
import Breadcrumbs from "@/components/Breadcrumbs";
import CalculatorLayout from "@/components/CalculatorLayout";

export default function DateDifferenceCalculator() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [result, setResult] = useState<{
    days: number;
    weeks: number;
    months: number;
    years: number;
    hours: number;
    minutes: number;
  } | null>(null);

  useEffect(() => {
    const recent = JSON.parse(localStorage.getItem("recentCalculators") || "[]");
    const updated = ["date-difference", ...recent.filter((id: string) => id !== "date-difference")].slice(0, 10);
    localStorage.setItem("recentCalculators", JSON.stringify(updated));
  }, []);

  const calculate = () => {
    if (!startDate || !endDate) return;

    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const weeks = Math.floor(days / 7);
    const months = Math.floor(days / 30.44);
    const years = Math.floor(days / 365.25);
    const hours = days * 24;
    const minutes = hours * 60;

    setResult({ days, weeks, months, years, hours, minutes });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Breadcrumbs
        items={[
          { label: "Date Calculators", href: "/date-calculators" },
          { label: "Date Difference", href: "/calculators/date/date-difference-calculator" },
        ]}
      />

      <CalculatorLayout
        title="Date Difference Calculator"
        description="Calculate the number of days, weeks, months, and years between two dates."
        explanation={
          <div className="space-y-4">
            <p>
              The date difference calculator measures the span between any two calendar dates and expresses it in several
              units at once: years, months, weeks, days, hours, and minutes. Pick a start date and an end date, and it
              returns the full duration between them, handling the awkward parts of the calendar - leap years, months of
              different lengths, and the shift across year boundaries - for you. It works equally well for dates in the
              past and the future, so you can measure how long ago something happened or how far away an upcoming date is.
            </p>
            <h3 className="text-lg font-semibold text-gray-900">How it works</h3>
            <p>
              Under the hood, the tool converts each date to a point in time, finds the absolute gap between them in
              milliseconds, and then divides that gap into the units you see. Days are the exact count of whole days
              between the two dates. Weeks are that day count divided by seven. Hours and minutes are simply the day count
              multiplied out, which is why a one-day difference shows as 24 hours and 1,440 minutes. Because the result is
              an absolute value, the order you enter the dates in does not change the answer; the gap between March and
              June is the same whichever you put first.
            </p>
            <h3 className="text-lg font-semibold text-gray-900">Why months and years are approximate</h3>
            <p>
              Days, hours, and minutes are exact, but months and years need a convention, because real months range from
              28 to 31 days and a year is not a whole number of weeks. This calculator uses the common averages of about
              30.44 days per month and 365.25 days per year, which keeps long spans accurate on average while staying
              simple. For a span of a few months that figure may differ slightly from a strict calendar count, so when you
              need the exact number of whole calendar months - for a contract term or a notice period, say - rely on the
              day count, which is always precise, rather than the rounded month figure.
            </p>
            <h3 className="text-lg font-semibold text-gray-900">A worked example</h3>
            <p>
              Take a start date of 1 January 2025 and an end date of 31 December 2025. The calculator counts 364 whole
              days between them, which it also reports as 52 weeks, roughly 11 months, and about 1 year. In hours that is
              8,736, and in minutes 524,160. If you instead measured 1 January 2024 to 1 January 2025, the count would be
              366 days, because 2024 is a leap year and includes 29 February. That single extra day is exactly the kind of
              detail the calculator handles so you do not have to.
            </p>
            <h3 className="text-lg font-semibold text-gray-900">Common uses</h3>
            <ul className="list-disc space-y-1 pl-6">
              <li>Counting down to a deadline, holiday, wedding, or trip, or measuring how long since a past event.</li>
              <li>Working out the length of a lease, employment period, loan term, or notice period in days.</li>
              <li>Tracking a project duration or the gap between two milestones.</li>
              <li>Checking how many days you have held an investment or stayed somewhere for tax or visa purposes.</li>
            </ul>
            <p>
              When precise legal or financial timing matters, confirm the figure against the exact terms of your
              agreement or with the relevant authority, since some rules count days inclusively or exclude weekends and
              public holidays.
            </p>
          </div>
        }
        faqs={[
          { question: "Does this calculator include both the start and end dates?", answer: "It counts the number of complete days between the two dates, which effectively excludes the start date and includes the end date. If you need an inclusive count - for example, counting both the first and last day of an event - add one to the day result." },
          { question: "Does it account for leap years?", answer: "Yes. Because the calculation works from the actual calendar timestamps of each date, any 29 February that falls between your two dates is automatically included in the day count, so leap years are handled correctly." },
          { question: "Why does the months figure look slightly off?", answer: "Months vary from 28 to 31 days, so the calculator uses an average of about 30.44 days per month to convert. Over long spans this is accurate, but for a few months it can differ from a strict calendar count. Use the exact day figure when you need precision." },
          { question: "Can I measure the difference to a date in the future?", answer: "Yes. The end date can be in the past or the future. The result is shown as an absolute duration, so the order of the dates does not change the answer." },
          { question: "Does the result include hours and minutes of a partial day?", answer: "This calculator works at the level of whole days, then expresses that span in larger and smaller units. For a live, second-by-second countdown to a specific date and time, use the Countdown Calculator instead." },
        ]}
        relatedCalculators={[
          { name: "Age Calculator", href: "/calculators/date/age-calculator" },
          { name: "Add/Subtract Days", href: "/calculators/date/add-subtract-days-calculator" },
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
            <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <button
            onClick={calculate}
            className="w-full bg-primary-600 text-white py-4 rounded-lg font-semibold text-lg hover:bg-primary-700 transition-colors"
          >
            Calculate Difference
          </button>

          {result && (
            <div className="mt-8 p-6 bg-indigo-50 rounded-lg border-2 border-indigo-200">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Time Difference</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="p-4 bg-white rounded-lg text-center border border-indigo-100">
                  <div className="text-2xl font-bold text-indigo-600">{result.years.toLocaleString()}</div>
                  <div className="text-xs font-medium text-gray-500 mt-1">Years</div>
                </div>
                <div className="p-4 bg-white rounded-lg text-center border border-indigo-100">
                  <div className="text-2xl font-bold text-indigo-600">{result.months.toLocaleString()}</div>
                  <div className="text-xs font-medium text-gray-500 mt-1">Months</div>
                </div>
                <div className="p-4 bg-white rounded-lg text-center border border-indigo-100">
                  <div className="text-2xl font-bold text-indigo-600">{result.weeks.toLocaleString()}</div>
                  <div className="text-xs font-medium text-gray-500 mt-1">Weeks</div>
                </div>
                <div className="p-4 bg-white rounded-lg text-center border border-indigo-100">
                  <div className="text-2xl font-bold text-purple-600">{result.days.toLocaleString()}</div>
                  <div className="text-xs font-medium text-gray-500 mt-1">Days</div>
                </div>
                <div className="p-4 bg-white rounded-lg text-center border border-indigo-100">
                  <div className="text-2xl font-bold text-purple-600">{result.hours.toLocaleString()}</div>
                  <div className="text-xs font-medium text-gray-500 mt-1">Hours</div>
                </div>
                <div className="p-4 bg-white rounded-lg text-center border border-indigo-100">
                  <div className="text-2xl font-bold text-purple-600">{result.minutes.toLocaleString()}</div>
                  <div className="text-xs font-medium text-gray-500 mt-1">Minutes</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </CalculatorLayout>
    </div>
  );
}
