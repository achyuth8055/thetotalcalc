"use client";

import { useState, useEffect } from "react";
import Breadcrumbs from "@/components/Breadcrumbs";
import CalculatorLayout from "@/components/CalculatorLayout";

export default function Base64EncoderCalculator() {
  const [text, setText] = useState("");
  const [base64, setBase64] = useState("");
  const [mode, setMode] = useState<"encode" | "decode">("encode");

  useEffect(() => {
    const recent = JSON.parse(localStorage.getItem("recentCalculators") || "[]");
    const updated = ["base64-encoder", ...recent.filter((id: string) => id !== "base64-encoder")].slice(0, 10);
    localStorage.setItem("recentCalculators", JSON.stringify(updated));
  }, []);

  const encode = (input: string) => {
    setText(input);
    if (input.trim() === "") {
      setBase64("");
      return;
    }
    try {
      const encoded = btoa(input);
      setBase64(encoded);
    } catch (e) {
      setBase64("Error encoding");
    }
  };

  const decode = (input: string) => {
    setBase64(input);
    if (input.trim() === "") {
      setText("");
      return;
    }
    try {
      const decoded = atob(input);
      setText(decoded);
    } catch (e) {
      setText("Invalid Base64 string");
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumbs
        items={[
          { label: "Developer Tools", href: "/developer-calculators" },
          { label: "Base64 Encoder", href: "/calculators/developer/base64-encoder" },
        ]}
      />

      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Base64 Encoder/Decoder</h1>
        <p className="text-base text-gray-600">
          Encode text to Base64 or decode Base64 strings back to text
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200 mb-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Mode</label>
            <select
              value={mode}
              onChange={(e) => {
                setMode(e.target.value as "encode" | "decode");
                setText("");
                setBase64("");
              }}
              className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            >
              <option value="encode">Encode to Base64</option>
              <option value="decode">Decode from Base64</option>
            </select>
          </div>

          {mode === "encode" ? (
            <>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Text Input</label>
                <textarea
                  value={text}
                  onChange={(e) => encode(e.target.value)}
                  className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
                  placeholder="Enter text to encode"
                  rows={5}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Base64 Output</label>
                <textarea
                  value={base64}
                  readOnly
                  className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg bg-gray-50 font-mono text-sm"
                  placeholder="Base64 encoded result"
                  rows={5}
                />
              </div>
            </>
          ) : (
            <>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Base64 Input</label>
                <textarea
                  value={base64}
                  onChange={(e) => decode(e.target.value)}
                  className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
                  placeholder="Enter Base64 string to decode"
                  rows={5}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Decoded Text</label>
                <textarea
                  value={text}
                  readOnly
                  className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg bg-gray-50 font-mono text-sm"
                  placeholder="Decoded text will appear here"
                  rows={5}
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
            <strong className="text-blue-600">Base64 encoding</strong> is commonly used to encode binary data as ASCII text for transmission over text-based protocols.
          </p>
          <p>
            Base64 uses 64 printable characters (A-Z, a-z, 0-9, +, /) to represent binary data. Every 3 bytes of input produces 4 bytes of Base64 output.
          </p>
          <p>
            Common uses include email attachments, embedding images in HTML/CSS, and API data transmission.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
        <h2 className="text-xl font-bold text-gray-900 mb-4">FAQ</h2>
        <div className="space-y-3 text-sm">
          <div>
            <p className="font-semibold text-gray-900">What is Base64?</p>
            <p className="text-gray-600">Base64 is an encoding scheme that converts binary data into ASCII text format using 64 printable characters.</p>
          </div>
          <div>
            <p className="font-semibold text-gray-900">When should I use Base64?</p>
            <p className="text-gray-600">Use Base64 when you need to transmit binary data over text-based protocols like HTTP or email.</p>
          </div>
          <div>
            <p className="font-semibold text-gray-900">Is Base64 encryption?</p>
            <p className="text-gray-600">No, Base64 is encoding, not encryption. It can be easily decoded and doesn't provide security.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
