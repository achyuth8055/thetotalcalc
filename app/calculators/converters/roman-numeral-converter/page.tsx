"use client";
import { useState, useMemo } from "react";
import Breadcrumbs from "@/components/Breadcrumbs";
import CalculatorLayout from "@/components/CalculatorLayout";

const ROMAN_VALUES: [string, number][] = [
  ["M", 1000], ["CM", 900], ["D", 500], ["CD", 400],
  ["C", 100], ["XC", 90], ["L", 50], ["XL", 40],
  ["X", 10], ["IX", 9], ["V", 5], ["IV", 4], ["I", 1],
];

function toRoman(num: number): { roman: string; breakdown: { symbol: string; value: number; count: number }[] } {
  if (num < 1 || num > 3999) return { roman: "", breakdown: [] };
  let n = num;
  let roman = "";
  const breakdown: { symbol: string; value: number; count: number }[] = [];
  for (const [sym, val] of ROMAN_VALUES) {
    const count = Math.floor(n / val);
    if (count > 0) {
      roman += sym.repeat(count);
      breakdown.push({ symbol: sym, value: val, count });
      n -= val * count;
    }
  }
  return { roman, breakdown };
}

function fromRoman(str: string): number | null {
  const s = str.toUpperCase().trim();
  if (!s) return null;
  const valid = /^[IVXLCDM]+$/.test(s);
  if (!valid) return null;

  const map: Record<string, number> = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 };
  let result = 0;
  for (let i = 0; i < s.length; i++) {
    const cur = map[s[i]];
    const next = map[s[i + 1]] ?? 0;
    if (cur < next) result -= cur;
    else result += cur;
  }
  // Validate by converting back
  const { roman } = toRoman(result);
  if (roman !== s) return null;
  return result;
}

const REFERENCE_TABLE: [string, number, string][] = [
  ["I", 1, "One tally mark"],
  ["IV", 4, "One before five"],
  ["V", 5, "Hand with 5 fingers"],
  ["IX", 9, "One before ten"],
  ["X", 10, "Two V's crossed"],
  ["XL", 40, "Ten before fifty"],
  ["L", 50, "Half a C"],
  ["XC", 90, "Ten before hundred"],
  ["C", 100, "Centum (Latin)"],
  ["CD", 400, "Hundred before five hundred"],
  ["D", 500, "Half of M symbol"],
  ["CM", 900, "Hundred before thousand"],
  ["M", 1000, "Mille (Latin)"],
];

export default function RomanNumeralConverter() {
  const [mode, setMode] = useState<"toRoman" | "fromRoman">("toRoman");
  const [numInput, setNumInput] = useState(1994);
  const [romanInput, setRomanInput] = useState("MCMXCIV");

  const toRomanResult = useMemo(() => toRoman(numInput), [numInput]);
  const fromRomanResult = useMemo(() => fromRoman(romanInput), [romanInput]);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumbs items={[
        { label: "Converters", href: "/converters" },
        { label: "Roman Numeral Converter", href: "/calculators/converters/roman-numeral-converter" },
      ]} />

      <div className="mb-6 flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Roman Numeral Converter</h1>
          <p className="text-base text-gray-600">Convert numbers to Roman numerals and back. Supports 1–3,999 with full breakdown.</p>
        </div>
        <button onClick={() => window.print()} className="print:hidden flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg">
          ↓ PDF
        </button>
      </div>

      {/* Mode toggle */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setMode("toRoman")}
          className={`flex-1 py-3 rounded-xl text-sm font-semibold transition-colors ${mode === "toRoman" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
        >
          Number → Roman Numeral
        </button>
        <button
          onClick={() => setMode("fromRoman")}
          className={`flex-1 py-3 rounded-xl text-sm font-semibold transition-colors ${mode === "fromRoman" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
        >
          Roman Numeral → Number
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        {/* Input */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            {mode === "toRoman" ? "Enter a Number (1–3,999)" : "Enter Roman Numerals"}
          </h2>

          {mode === "toRoman" ? (
            <>
              <input
                type="number"
                min={1}
                max={3999}
                value={numInput}
                onChange={(e) => setNumInput(Math.min(3999, Math.max(1, parseInt(e.target.value) || 1)))}
                className="w-full border border-gray-300 rounded-lg px-3 py-3 text-xl font-bold focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="mt-2 flex gap-2 flex-wrap">
                {[1, 4, 9, 14, 40, 90, 399, 1994, 2024, 3999].map((n) => (
                  <button key={n} onClick={() => setNumInput(n)}
                    className="text-xs px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded text-gray-600">{n}</button>
                ))}
              </div>
            </>
          ) : (
            <>
              <input
                type="text"
                value={romanInput}
                onChange={(e) => setRomanInput(e.target.value.toUpperCase())}
                placeholder="e.g. MMXXV"
                className="w-full border border-gray-300 rounded-lg px-3 py-3 text-xl font-bold uppercase focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="mt-2 flex gap-2 flex-wrap">
                {["XIV", "XLII", "MCMXCIX", "MMXXV", "MMMCMXCIX"].map((r) => (
                  <button key={r} onClick={() => setRomanInput(r)}
                    className="text-xs px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded text-gray-600">{r}</button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Result */}
        <div className="bg-gradient-to-br from-slate-700 to-slate-900 rounded-2xl shadow-sm p-6 text-white">
          {mode === "toRoman" ? (
            toRomanResult.roman ? (
              <>
                <p className="text-slate-400 text-sm uppercase tracking-wide mb-2">{numInput} in Roman numerals</p>
                <div className="text-5xl font-extrabold tracking-widest mb-6">{toRomanResult.roman}</div>
                <div className="space-y-2">
                  <p className="text-slate-400 text-xs uppercase tracking-wide mb-2">Breakdown</p>
                  {toRomanResult.breakdown.map(({ symbol, value, count }) => (
                    <div key={symbol} className="flex justify-between text-sm bg-white/10 rounded-lg px-3 py-2">
                      <span className="font-bold tracking-widest">{symbol.repeat(count)}</span>
                      <span className="text-slate-300">= {(value * count).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="text-slate-400 text-center mt-8">Enter a number between 1 and 3,999</div>
            )
          ) : (
            fromRomanResult !== null ? (
              <>
                <p className="text-slate-400 text-sm uppercase tracking-wide mb-2">{romanInput} in numbers</p>
                <div className="text-6xl font-extrabold mb-4">{fromRomanResult.toLocaleString()}</div>
                <div className="text-slate-300 text-sm">Valid Roman numeral ✓</div>
              </>
            ) : (
              <div className="text-slate-400 text-center mt-8">
                {romanInput ? "Invalid Roman numeral — check your input" : "Enter Roman numerals above"}
              </div>
            )
          )}
        </div>
      </div>

      {/* Reference table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Roman Numeral Reference Table</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {REFERENCE_TABLE.map(([sym, val, note]) => (
            <div key={sym} className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
              <div className="text-xl font-bold text-slate-700 w-16 text-center">{sym}</div>
              <div>
                <div className="text-sm font-semibold text-gray-800">= {val.toLocaleString()}</div>
                <div className="text-xs text-gray-400">{note}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <CalculatorLayout
        title=""
        description=""
        explanation={
          <div className="space-y-4 text-sm text-gray-700 leading-relaxed">
            <h2 className="text-xl font-bold text-gray-900">The History and Legacy of Roman Numerals</h2>
            <p>
              Roman numerals were the dominant numeral system in Europe for well over a thousand years, from the height of the Roman Republic through most of the Medieval period. Their origins almost certainly lie in tally marks — the most primitive form of counting, where each object being counted gets a stroke. The "I" symbol is literally a single tally. The "V" may have originated from the shape made by an outstretched hand (four fingers up, thumb out at an angle), and "X" from two V's crossed or from the double-hand gesture used when counting to ten.
            </p>
            <p>
              The Romans used an additive system: to represent a number, you write symbols in descending order and add them up. III is three, XV is fifteen, LXII is sixty-two. The subtractive notation we recognize today — IV for four instead of IIII, IX for nine instead of VIIII — was not standardized in the classical Roman period. Ancient Roman inscriptions frequently used IIII for 4 and VIIII for 9. Medieval scribes gradually adopted the subtractive convention because it was more compact and less prone to transcription errors.
            </p>
            <p>
              The system's survival long past the fall of Rome can be attributed to the Catholic Church, which remained the dominant cultural institution through the medieval period and used Roman numerals extensively in manuscripts, papal documents, and calendars. The system also had an appealing property for merchants and craftsmen who didn't need to perform complex calculations — you could record quantities without knowing arithmetic. A merchant didn't need to add XIV + XXIII; they just had to tally goods.
            </p>
            <p>
              Roman numerals persist in modern life in a surprising number of places. The Super Bowl has used Roman numerals since Super Bowl V in 1971 (Super Bowl I was labeled retroactively), partly because the game frequently crosses a calendar year boundary — "Super Bowl 50" just looked awkward, which is why Super Bowl 50 in 2016 was actually the only one in recent decades to use Arabic numerals before reverting to LI. Movie copyright years use Roman numerals in closing credits — a tradition that began partly to obscure the production date and prevent audiences from knowing how old a film was. Clockfaces often show IIII rather than IV, a convention that dates to medieval clockmaking and is thought to create visual balance against the VIII on the opposite side. Book chapters, outline numbering, and legal document sections frequently use Roman numerals for hierarchical clarity.
            </p>
            <p>
              The reason Roman numerals were eventually replaced for mathematical purposes is straightforward: you cannot do arithmetic efficiently with them. Try multiplying XLVII by XXXIX. There is no place value system, no concept of zero, and no way to perform column arithmetic. When Arabic numerals — actually Hindu numerals adapted and transmitted by Arab mathematicians — arrived in Europe via al-Khwarizmi's treatises in the 9th and 10th centuries, and were popularized by Fibonacci's <em>Liber Abaci</em> in 1202, the mathematical advantages were immediately obvious to merchants and scholars. Zero was the revolutionary concept: a placeholder that makes positional notation possible. The word "algorithm" itself comes from a Latinization of al-Khwarizmi's name.
            </p>
            <p>
              The largest number expressible in standard Roman numerals is 3,999 (MMMCMXCIX). Beyond this, the classical system required a vinculum — a horizontal line drawn over a numeral to multiply its value by 1,000, allowing V̅ to represent 5,000 and M̅ to represent 1,000,000. Modern typographic limitations have made vinculum notation rare. In music theory, Roman numerals denote chord functions in harmonic analysis (I, IV, V are the tonic, subdominant, and dominant chords), and the case of the numeral indicates major (uppercase) vs. minor (lowercase). In pharmacy and prescription writing, Roman numerals have historically denoted quantities, and the system persists in some legal documents and formal outlines even today.
            </p>
          </div>
        }
        faqs={[
          {
            question: "What is the largest number in standard Roman numerals?",
            answer: "The largest number expressible in standard Roman notation is 3,999, written MMMCMXCIX. The standard system cannot represent 4,000 or above without a vinculum (a bar drawn over a symbol to multiply its value by 1,000) or other extensions. Our converter supports 1 through 3,999."
          },
          {
            question: "Why do some clocks show IIII instead of IV?",
            answer: "This is a centuries-old clockmaking tradition with several proposed explanations. The most practical is visual balance: IIII (four strokes) visually balances VIII (three strokes and two curves) on the opposite side of the clock face. Another theory is that medieval clockmakers were hesitant to use IV because it resembled the first two letters of IVPITER (Jupiter), the Roman king of the gods — considered potentially blasphemous. Whatever the origin, the tradition persists on many luxury and traditional clock faces today."
          },
          {
            question: "When did Europeans stop using Roman numerals for everyday math?",
            answer: "The transition happened gradually between the 13th and 15th centuries, following Fibonacci's publication of Liber Abaci in 1202, which demonstrated the superior utility of Hindu-Arabic numerals (0–9) for calculation. Italian merchants and bankers adopted the new system first; the printing press (1440s) accelerated spread across Europe. Roman numerals continued for ceremonial and formal uses even as Arabic numerals dominated practical arithmetic, a division that persists to this day."
          },
          {
            question: "Can you perform arithmetic with Roman numerals?",
            answer: "Addition is possible but cumbersome. Multiplication, division, and working with fractions are extremely difficult because the system has no place value and no zero. This is why Arabic numerals (with their positional notation and zero placeholder) replaced Roman numerals for calculation — you can perform column arithmetic, long division, and algebra with positional notation in ways that are simply impossible with Roman numerals."
          },
          {
            question: "What year is MMXXV in Roman numerals?",
            answer: "MMXXV = 2025. Breaking it down: MM = 2000, XX = 20, V = 5, total = 2025. Roman numerals are still commonly used for years in formal contexts like building inscriptions, movie copyright notices, and Super Bowl numbering."
          },
        ]}
        relatedCalculators={[
          { name: "Scientific Calculator", href: "/calculators/math/scientific-calculator" },
          { name: "Date Difference Calculator", href: "/calculators/date/date-difference-calculator" },
          { name: "Percentage Calculator", href: "/calculators/math/percentage-calculator" },
        ]}
      >
        <div />
      </CalculatorLayout>
    </div>
  );
}
