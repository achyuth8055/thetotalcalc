"use client";

import { useState, useEffect } from "react";
import Breadcrumbs from "@/components/Breadcrumbs";
import CalculatorLayout from "@/components/CalculatorLayout";

export default function CountdownCalculator() {
  const [targetDate, setTargetDate] = useState("");
  const [result, setResult] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  } | null>(null);

  useEffect(() => {
    const recent = JSON.parse(localStorage.getItem("recentCalculators") || "[]");
    const updated = ["countdown", ...recent.filter((id: string) => id !== "countdown")].slice(0, 10);
    localStorage.setItem("recentCalculators", JSON.stringify(updated));
  }, []);

  const calculate = () => {
    if (!targetDate) return;

    const now = new Date();
    const target = new Date(targetDate);
    const diffTime = target.getTime() - now.getTime();

    if (diffTime > 0) {
      const days = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diffTime % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diffTime % (1000 * 60)) / 1000);

      setResult({ days, hours, minutes, seconds });
    } else {
      setResult({ days: 0, hours: 0, minutes: 0, seconds: 0 });
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Breadcrumbs
        items={[
          { label: "Date Calculators", href: "/date-calculators" },
          { label: "Countdown Calculator", href: "/calculators/date/countdown-calculator" },
        ]}
      />

      <CalculatorLayout
        title="Countdown Calculator"
        description="Count down the days, hours, minutes, and seconds until a future date."
        explanation={
          <div className="space-y-4">
            <p>
              A countdown turns a far-off date into something you can feel. Enter any future date and time - a birthday,
              a wedding, a holiday, a product launch, a retirement day, or an exam - and this calculator breaks the time
              remaining into days, hours, minutes, and seconds. Seeing the gap counted out in real units makes planning
              concrete: a deadline that is &quot;sometime next month&quot; becomes &quot;26 days and 14 hours,&quot; which is far easier to
              act on.
            </p>
            <h3 className="text-lg font-semibold text-gray-900">How it works</h3>
            <p>
              The calculator compares your target date and time with the current moment on your device and finds the
              difference. It then divides that gap into whole days first, then the leftover hours, then the leftover
              minutes, and finally the remaining seconds. That is why the hours, minutes, and seconds shown are the
              remainder after the larger units are taken out, not the total time expressed in each unit. If the target you
              choose has already passed, the countdown simply reads zero across the board, since there is no future time
              left to count.
            </p>
            <h3 className="text-lg font-semibold text-gray-900">A worked example</h3>
            <p>
              Suppose it is noon on 1 December and you set a target of midnight on 25 December. The countdown shows 23
              days, 12 hours, 0 minutes, and 0 seconds remaining. As time passes, the seconds and minutes tick down first,
              then the hours, and each midnight removes another day. Because the calculation is based on the clock on your
              own device, the figure reflects your local time, which is what you want for a personal countdown.
            </p>
            <h3 className="text-lg font-semibold text-gray-900">Tips for an accurate countdown</h3>
            <ul className="list-disc space-y-1 pl-6">
              <li>Set the exact time, not just the date. Counting to midnight is different from counting to a 9 a.m. start, and the hours and minutes will reflect that.</li>
              <li>Check that your device clock and time zone are correct, since the countdown is measured against your local time.</li>
              <li>For an event in another time zone, convert its start to your own local time first, so the remaining hours are right for you.</li>
              <li>Remember that the hours, minutes, and seconds are what is left after the full days are counted, not the entire span re-expressed.</li>
            </ul>
            <h3 className="text-lg font-semibold text-gray-900">Countdown or total duration?</h3>
            <p>
              A countdown answers &quot;how much time is left until this moment?&quot; If you instead want the total span between
              two fixed dates expressed several ways - in weeks or months, say - the Date Difference Calculator is the
              better tool. Use a countdown for anticipation and deadlines, and a date difference for measuring a known
              start and end.
            </p>
          </div>
        }
        faqs={[
          { question: "How accurate is the countdown?", answer: "It is calculated to the second from your device's current time and the target you set. Because it reads your local clock, make sure your device time and time zone are correct for the most reliable result." },
          { question: "What happens if the target date has already passed?", answer: "The countdown shows zero days, hours, minutes, and seconds. There is no negative count, because a countdown only measures time remaining until a future moment." },
          { question: "Why are the hours and minutes smaller than I expected?", answer: "The hours, minutes, and seconds shown are the remainder after the whole days are removed, not the entire duration expressed in each unit. So a 23-day countdown shows the leftover hours within the final partial day, not 552 hours in total." },
          { question: "Does it handle events in a different time zone?", answer: "The countdown is based on your local time. For an event happening in another time zone, convert its start time to your own local time before entering it, so the remaining time is accurate for where you are." },
          { question: "Can I use it for recurring events like birthdays?", answer: "Yes. Set the next occurrence of the date as your target. Once that date passes, set the following year's date to start a fresh countdown to the next one." },
          { question: "Does the countdown update on its own?", answer: "The figure is calculated from the current moment each time you run it, giving an accurate snapshot of the time remaining. For a continuously ticking display, refresh or recalculate, and the days, hours, minutes, and seconds will reflect the latest time." },
          { question: "Why set a time as well as a date?", answer: "Many deadlines hinge on the hour, not just the day. A submission due at 9 a.m. leaves far less time than one due at midnight on the same date. Setting the exact target time makes the hours and minutes remaining meaningful rather than approximate." },
        ]}
        relatedCalculators={[
          { name: "Age Calculator", href: "/calculators/date/age-calculator" },
          { name: "Date Difference", href: "/calculators/date/date-difference-calculator" },
        ]}
      >
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Target Date & Time</label>
            <input
              type="datetime-local"
              value={targetDate}
              onChange={(e) => setTargetDate(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <button
            onClick={calculate}
            className="w-full bg-primary-600 text-white py-4 rounded-lg font-semibold text-lg hover:bg-primary-700 transition-colors"
          >
            Start Countdown
          </button>

          {result && (
            <div className="mt-8 p-6 bg-indigo-50 rounded-lg border-2 border-indigo-200">
              <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">Time Remaining</h3>
              <div className="grid grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-4xl font-bold text-indigo-600">{result.days}</div>
                  <div className="text-sm text-gray-600 mt-1">Days</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-indigo-600">{result.hours}</div>
                  <div className="text-sm text-gray-600 mt-1">Hours</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-indigo-600">{result.minutes}</div>
                  <div className="text-sm text-gray-600 mt-1">Minutes</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-indigo-600">{result.seconds}</div>
                  <div className="text-sm text-gray-600 mt-1">Seconds</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </CalculatorLayout>
    </div>
  );
}
