"use client";

import { useState, useEffect } from "react";
import Breadcrumbs from "@/components/Breadcrumbs";
import CalculatorLayout from "@/components/CalculatorLayout";

type Mode = "duration" | "add" | "hours";

export default function TimeCalculator() {
  const [mode, setMode] = useState<Mode>("duration");

  // Duration mode
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("17:30");

  // Add/Subtract mode
  const [baseTime, setBaseTime] = useState("10:00");
  const [addHours, setAddHours] = useState(2);
  const [addMins, setAddMins] = useState(30);
  const [operation, setOperation] = useState<"add" | "subtract">("add");

  // Hours calculator
  const [h1, setH1] = useState(1);
  const [m1, setM1] = useState(30);
  const [h2, setH2] = useState(2);
  const [m2, setM2] = useState(45);
  const [hoursOp, setHoursOp] = useState<"add" | "subtract" | "multiply" | "divide">("add");
  const [multiplier, setMultiplier] = useState(3);

  const [result, setResult] = useState<string>("");
  const [subResult, setSubResult] = useState<string>("");

  useEffect(() => {
    const recent = JSON.parse(localStorage.getItem("recentCalculators") || "[]");
    const updated = ["time", ...recent.filter((id: string) => id !== "time")].slice(0, 10);
    localStorage.setItem("recentCalculators", JSON.stringify(updated));
  }, []);

  useEffect(() => { calculate(); }, [mode, startTime, endTime, baseTime, addHours, addMins, operation, h1, m1, h2, m2, hoursOp, multiplier]);

  const timeToMins = (t: string) => {
    const [h, m] = t.split(":").map(Number);
    return h * 60 + m;
  };

  const minsToTime = (total: number) => {
    const sign = total < 0 ? "-" : "";
    const abs = Math.abs(total);
    const h = Math.floor(abs / 60);
    const m = abs % 60;
    return `${sign}${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
  };

  const formatDuration = (mins: number) => {
    const abs = Math.abs(mins);
    const h = Math.floor(abs / 60);
    const m = abs % 60;
    const parts = [];
    if (h > 0) parts.push(`${h} hour${h !== 1 ? "s" : ""}`);
    if (m > 0) parts.push(`${m} minute${m !== 1 ? "s" : ""}`);
    return parts.join(" ") || "0 minutes";
  };

  const calculate = () => {
    if (mode === "duration") {
      let diff = timeToMins(endTime) - timeToMins(startTime);
      if (diff < 0) diff += 24 * 60; // crosses midnight
      setResult(formatDuration(diff));
      setSubResult(`${(diff / 60).toFixed(2)} hours · ${diff} minutes`);
    } else if (mode === "add") {
      const baseMins = timeToMins(baseTime);
      const delta = addHours * 60 + addMins;
      const newMins = operation === "add" ? baseMins + delta : baseMins - delta;
      const wrapped = ((newMins % (24 * 60)) + 24 * 60) % (24 * 60);
      setResult(minsToTime(wrapped));
      setSubResult(`${operation === "add" ? "Added" : "Subtracted"} ${formatDuration(delta)}`);
    } else {
      const total1 = h1 * 60 + m1;
      const total2 = h2 * 60 + m2;
      let resultMins = 0;
      if (hoursOp === "add") resultMins = total1 + total2;
      else if (hoursOp === "subtract") resultMins = total1 - total2;
      else if (hoursOp === "multiply") resultMins = total1 * multiplier;
      else if (hoursOp === "divide") resultMins = multiplier !== 0 ? total1 / multiplier : 0;
      const sign = resultMins < 0 ? "-" : "";
      const abs = Math.abs(Math.round(resultMins));
      const rh = Math.floor(abs / 60);
      const rm = abs % 60;
      setResult(`${sign}${rh}h ${rm}m`);
      setSubResult(`${Math.abs(resultMins).toFixed(2)} total minutes`);
    }
  };

  const MODES: { label: string; value: Mode }[] = [
    { label: "Time Duration", value: "duration" },
    { label: "Add/Subtract", value: "add" },
    { label: "Hours Math", value: "hours" },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumbs
        items={[
          { label: "Date Calculators", href: "/date-calculators" },
          { label: "Time Calculator", href: "/calculators/date/time-calculator" },
        ]}
      />
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Time Calculator</h1>
        <p className="text-base text-gray-600">Calculate time duration, add or subtract time, and do hours/minutes math</p>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200 mb-6">
        <div className="flex gap-2 mb-6">
          {MODES.map(m => (
            <button key={m.value} onClick={() => setMode(m.value)}
              className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-colors ${mode === m.value ? "bg-indigo-600 text-white border-indigo-600" : "bg-white text-gray-700 border-gray-300 hover:border-indigo-400"}`}>
              {m.label}
            </button>
          ))}
        </div>

        {mode === "duration" && (
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-semibold text-gray-700 block mb-2">Start Time</label>
                <input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-lg font-mono focus:ring-2 focus:ring-indigo-500" />
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700 block mb-2">End Time</label>
                <input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-lg font-mono focus:ring-2 focus:ring-indigo-500" />
              </div>
            </div>
            <div className="bg-indigo-50 border-2 border-indigo-200 rounded-lg p-6 flex flex-col justify-center items-center">
              <div className="text-sm text-gray-600 mb-2">Duration</div>
              <div className="text-3xl font-bold text-indigo-600 text-center">{result}</div>
              <div className="text-sm text-gray-500 mt-2">{subResult}</div>
            </div>
          </div>
        )}

        {mode === "add" && (
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-semibold text-gray-700 block mb-2">Base Time</label>
                <input type="time" value={baseTime} onChange={(e) => setBaseTime(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-lg font-mono focus:ring-2 focus:ring-indigo-500" />
              </div>
              <div className="flex gap-2">
                <button onClick={() => setOperation("add")}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium border ${operation === "add" ? "bg-green-600 text-white border-green-600" : "bg-white text-gray-700 border-gray-300"}`}>
                  + Add
                </button>
                <button onClick={() => setOperation("subtract")}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium border ${operation === "subtract" ? "bg-red-600 text-white border-red-600" : "bg-white text-gray-700 border-gray-300"}`}>
                  − Subtract
                </button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-gray-600 block mb-1">Hours</label>
                  <input type="number" value={addHours} min={0} max={999}
                    onChange={(e) => setAddHours(Number(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-center font-semibold focus:ring-2 focus:ring-indigo-500" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 block mb-1">Minutes</label>
                  <input type="number" value={addMins} min={0} max={59}
                    onChange={(e) => setAddMins(Number(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-center font-semibold focus:ring-2 focus:ring-indigo-500" />
                </div>
              </div>
            </div>
            <div className="bg-indigo-50 border-2 border-indigo-200 rounded-lg p-6 flex flex-col justify-center items-center">
              <div className="text-sm text-gray-600 mb-2">Result Time</div>
              <div className="text-4xl font-bold text-indigo-600 font-mono">{result}</div>
              <div className="text-sm text-gray-500 mt-2">{subResult}</div>
            </div>
          </div>
        )}

        {mode === "hours" && (
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-gray-600 block mb-1">Time 1 — Hours</label>
                  <input type="number" value={h1} min={0} onChange={(e) => setH1(Number(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-center font-semibold focus:ring-2 focus:ring-indigo-500" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 block mb-1">Minutes</label>
                  <input type="number" value={m1} min={0} max={59} onChange={(e) => setM1(Number(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-center font-semibold focus:ring-2 focus:ring-indigo-500" />
                </div>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {(["add", "subtract", "multiply", "divide"] as const).map(op => (
                  <button key={op} onClick={() => setHoursOp(op)}
                    className={`py-2 text-xs font-medium rounded-lg border transition-colors ${hoursOp === op ? "bg-indigo-600 text-white border-indigo-600" : "bg-white text-gray-700 border-gray-300"}`}>
                    {op === "add" ? "+" : op === "subtract" ? "−" : op === "multiply" ? "×" : "÷"}
                  </button>
                ))}
              </div>
              {(hoursOp === "add" || hoursOp === "subtract") ? (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-gray-600 block mb-1">Time 2 — Hours</label>
                    <input type="number" value={h2} min={0} onChange={(e) => setH2(Number(e.target.value) || 0)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-center font-semibold focus:ring-2 focus:ring-indigo-500" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-600 block mb-1">Minutes</label>
                    <input type="number" value={m2} min={0} max={59} onChange={(e) => setM2(Number(e.target.value) || 0)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-center font-semibold focus:ring-2 focus:ring-indigo-500" />
                  </div>
                </div>
              ) : (
                <div>
                  <label className="text-xs font-semibold text-gray-600 block mb-1">
                    {hoursOp === "multiply" ? "Multiply by" : "Divide by"}
                  </label>
                  <input type="number" value={multiplier} min={1} onChange={(e) => setMultiplier(Number(e.target.value) || 1)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-center font-semibold focus:ring-2 focus:ring-indigo-500" />
                </div>
              )}
            </div>
            <div className="bg-indigo-50 border-2 border-indigo-200 rounded-lg p-6 flex flex-col justify-center items-center">
              <div className="text-sm text-gray-600 mb-2">Result</div>
              <div className="text-4xl font-bold text-indigo-600">{result}</div>
              <div className="text-sm text-gray-500 mt-2">{subResult}</div>
            </div>
          </div>
        )}
      </div>

      <CalculatorLayout title="" description=""
        explanation={<p>Three modes: <strong>Time Duration</strong> finds how long between two times. <strong>Add/Subtract</strong> moves a time forward or backward. <strong>Hours Math</strong> adds, subtracts, multiplies, or divides time values.</p>}
        faqs={[
          { question: "What if end time is before start time?", answer: "In Duration mode, if the end time is earlier, the calculator assumes the period crosses midnight and adds 24 hours." },
          { question: "How do I calculate hours worked?", answer: "Use Duration mode — enter your clock-in as Start Time and clock-out as End Time to get exact hours and minutes worked." },
          { question: "Can I calculate total hours across multiple shifts?", answer: "Use Hours Math mode with the Add (+) operation to sum multiple durations together." },
        ]}
        relatedCalculators={[
          { name: "Date Difference Calculator", href: "/calculators/date/date-difference-calculator" },
          { name: "Age Calculator", href: "/calculators/date/age-calculator" },
          { name: "Countdown Calculator", href: "/calculators/date/countdown-calculator" },
        ]}
      >
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900">Time Calculation Guide</h2>
          <p className="text-sm text-gray-700">To convert time to decimal hours: divide minutes by 60. For example, 1h 30m = 1.5 hours. This is useful for billing, payroll, and tracking work hours.</p>
        </div>
      </CalculatorLayout>
    </div>
  );
}
