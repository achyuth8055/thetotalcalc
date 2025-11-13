"use client";

import { useState, useEffect } from "react";
import Breadcrumbs from "@/components/Breadcrumbs";
import CalculatorLayout from "@/components/CalculatorLayout";

export default function AsciiConverterCalculator() {
  const [text, setText] = useState("");
  const [ascii, setAscii] = useState("");
  const [mode, setMode] = useState<"textToAscii" | "asciiToText">("textToAscii");

  useEffect(() => {
    const recent = JSON.parse(localStorage.getItem("recentCalculators") || "[]");
    const updated = ["ascii-converter", ...recent.filter((id: string) => id !== "ascii-converter")].slice(0, 10);
    localStorage.setItem("recentCalculators", JSON.stringify(updated));
  }, []);

  const convertTextToAscii = (input: string) => {
    setText(input);
    if (input.trim() === "") {
      setAscii("");
      return;
    }
    const codes = input.split("").map(char => char.charCodeAt(0)).join(" ");
    setAscii(codes);
  };

  const convertAsciiToText = (input: string) => {
    setAscii(input);
    if (input.trim() === "") {
      setText("");
      return;
    }
    try {
      const codes = input.trim().split(/\s+/).map(code => parseInt(code));
      const text = codes.map(code => String.fromCharCode(code)).join("");
      setText(text);
    } catch (e) {
      setText("Invalid ASCII codes");
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumbs
        items={[
          { label: "Developer Tools", href: "/developer-calculators" },
          { label: "ASCII Converter", href: "/calculators/developer/ascii-converter" },
        ]}
      />

      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">ASCII Converter</h1>
        <p className="text-base text-gray-600">
          Convert text to ASCII codes and vice versa
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200 mb-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Conversion Mode</label>
            <select
              value={mode}
              onChange={(e) => {
                setMode(e.target.value as "textToAscii" | "asciiToText");
                setText("");
                setAscii("");
              }}
              className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            >
              <option value="textToAscii">Text to ASCII</option>
              <option value="asciiToText">ASCII to Text</option>
            </select>
          </div>

          {mode === "textToAscii" ? (
            <>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Text Input</label>
                <textarea
                  value={text}
                  onChange={(e) => convertTextToAscii(e.target.value)}
                  className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
                  placeholder="Enter text to convert"
                  rows={4}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">ASCII Codes</label>
                <textarea
                  value={ascii}
                  readOnly
                  className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg bg-gray-50 font-mono text-sm"
                  placeholder="ASCII codes will appear here"
                  rows={4}
                />
              </div>
            </>
          ) : (
            <>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">ASCII Codes <span className="text-xs font-normal text-gray-500">(space-separated)</span></label>
                <textarea
                  value={ascii}
                  onChange={(e) => convertAsciiToText(e.target.value)}
                  className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
                  placeholder="e.g., 72 101 108 108 111"
                  rows={4}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Text Output</label>
                <textarea
                  value={text}
                  readOnly
                  className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg bg-gray-50 font-mono text-sm"
                  placeholder="Converted text will appear here"
                  rows={4}
                />
              </div>
            </>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200 mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">How It Works</h2>
        <div className="space-y-4 text-sm text-gray-700">
          <p>
            <strong className="text-blue-600">ASCII (American Standard Code for Information Interchange)</strong> is a character encoding standard that assigns numeric codes (0-127) to characters for computer processing.
          </p>
          <p>
            Each character you type (letters, numbers, symbols) has a corresponding ASCII code. For example, 'A' = 65, 'a' = 97, '0' = 48.
          </p>
          <p>
            This converter allows you to translate between human-readable text and ASCII numeric codes in both directions.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
        <h2 className="text-xl font-bold text-gray-900 mb-4">FAQ</h2>
        <div className="space-y-3 text-sm">
          <div>
            <p className="font-semibold text-gray-900">What is ASCII?</p>
            <p className="text-gray-600">ASCII is a character encoding standard that represents text in computers using numeric codes from 0 to 127.</p>
          </div>
          <div>
            <p className="font-semibold text-gray-900">What is ASCII used for?</p>
            <p className="text-gray-600">ASCII is used for text encoding in computers, data transmission, and programming.</p>
          </div>
          <div>
            <p className="font-semibold text-gray-900">What's the ASCII code for space?</p>
            <p className="text-gray-600">The space character has ASCII code 32.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
