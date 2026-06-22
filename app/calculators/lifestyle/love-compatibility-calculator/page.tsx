"use client";
import { useState, useMemo } from "react";
import Breadcrumbs from "@/components/Breadcrumbs";
import CalculatorLayout from "@/components/CalculatorLayout";

function nameScore(name: string): number {
  return name.toUpperCase().split("").reduce((acc, c) => acc + (c.charCodeAt(0) || 0), 0);
}

function getZodiac(dateStr: string): { sign: string; element: string } | null {
  if (!dateStr) return null;
  const d = new Date(dateStr + "T12:00:00");
  const m = d.getMonth() + 1;
  const day = d.getDate();
  const signs: [number, number, string, string][] = [
    [3, 21, "Aries", "Fire"], [4, 20, "Taurus", "Earth"], [5, 21, "Gemini", "Air"],
    [6, 21, "Cancer", "Water"], [7, 23, "Leo", "Fire"], [8, 23, "Virgo", "Earth"],
    [9, 23, "Libra", "Air"], [10, 23, "Scorpio", "Water"], [11, 22, "Sagittarius", "Fire"],
    [12, 22, "Capricorn", "Earth"], [1, 20, "Aquarius", "Air"], [2, 19, "Pisces", "Water"],
  ];
  for (const [sm, sd, sign, element] of signs) {
    if ((m === sm && day >= sd) || (m === sm + 1 && day < sd) ||
        (sm === 12 && m === 1 && day < sd) || (sm === 1 && m === 12 && day >= 22)) {
      return { sign, element };
    }
  }
  // Default fallback
  const idx = (m - 1) % 12;
  const s = signs[idx];
  return { sign: s[2], element: s[3] };
}

function elementCompatibility(e1: string, e2: string): number {
  if (e1 === e2) return 85;
  const combos: Record<string, number> = {
    "Fire+Air": 90, "Air+Fire": 90,
    "Earth+Water": 88, "Water+Earth": 88,
    "Fire+Earth": 65, "Earth+Fire": 65,
    "Air+Water": 70, "Water+Air": 70,
    "Fire+Water": 55, "Water+Fire": 55,
    "Air+Earth": 60, "Earth+Air": 60,
  };
  return combos[`${e1}+${e2}`] ?? 70;
}

function lifePathNumber(dateStr: string): number {
  if (!dateStr) return 1;
  const digits = dateStr.replace(/-/g, "").split("").map(Number);
  let sum = digits.reduce((a, b) => a + b, 0);
  while (sum > 9 && sum !== 11 && sum !== 22) {
    sum = sum.toString().split("").map(Number).reduce((a, b) => a + b, 0);
  }
  return sum;
}

function calcCompatibility(name1: string, name2: string, date1: string, date2: string) {
  const s1 = nameScore(name1 || "A");
  const s2 = nameScore(name2 || "B");
  const combined = (s1 * 31 + s2 * 17 + (s1 ^ s2) * 7) % 100;
  const baseScore = 30 + (combined % 71); // 30-100 range

  // Sub-scores derived deterministically
  const comm = 25 + ((s1 * 13 + s2 * 7) % 76);
  const romance = 20 + ((s1 * 7 + s2 * 19) % 81);
  const friendship = 30 + ((s1 * 11 + s2 * 3) % 71);
  const longTerm = 25 + ((s1 * 3 + s2 * 23) % 76);
  const adventure = 20 + ((s1 * 17 + s2 * 11) % 81);

  let score = baseScore;
  let zodiacNote: string | null = null;

  const z1 = getZodiac(date1);
  const z2 = getZodiac(date2);
  if (z1 && z2) {
    const elemBonus = elementCompatibility(z1.element, z2.element);
    const lp1 = lifePathNumber(date1);
    const lp2 = lifePathNumber(date2);
    score = Math.round(score * 0.6 + elemBonus * 0.3 + ((lp1 + lp2) % 10) * 1.0);
    score = Math.min(100, Math.max(25, score));
    zodiacNote = `${z1.sign} (${z1.element}) + ${z2.sign} (${z2.element})`;
  }

  const label =
    score >= 90 ? "Soulmates! ❤️" :
    score >= 75 ? "Great Match! 💕" :
    score >= 60 ? "Good Compatibility 💛" :
    score >= 45 ? "Could Work with Effort 🌟" :
    score >= 30 ? "Opposites Attract? 🤔" : "Challenge Accepted! 🎭";

  return { score, label, comm, romance, friendship, longTerm, adventure, zodiacNote };
}

export default function LoveCompatibilityCalculator() {
  const [name1, setName1] = useState("");
  const [name2, setName2] = useState("");
  const [date1, setDate1] = useState("");
  const [date2, setDate2] = useState("");
  const [calculated, setCalculated] = useState(false);
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    if (!calculated || !name1 || !name2) return null;
    return calcCompatibility(name1, name2, date1, date2);
  }, [name1, name2, date1, date2, calculated]);

  const handleCopy = () => {
    if (!result) return;
    const text = `💕 Love Compatibility: ${name1} & ${name2}\nScore: ${result.score}% — ${result.label}\nCommunication: ${result.comm}% | Romance: ${result.romance}% | Friendship: ${result.friendship}% | Long-term: ${result.longTerm}% | Adventure: ${result.adventure}%\nCalculated at thetotalcalc.com`;
    navigator.clipboard.writeText(text).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); });
  };

  const scoreColor = result
    ? result.score >= 75 ? "from-pink-500 to-rose-600"
    : result.score >= 60 ? "from-yellow-400 to-amber-500"
    : result.score >= 45 ? "from-blue-400 to-indigo-500"
    : "from-gray-400 to-gray-600"
    : "from-pink-500 to-rose-600";

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumbs items={[
        { label: "Lifestyle Calculators", href: "/lifestyle-calculators" },
        { label: "Love Compatibility Calculator", href: "/calculators/lifestyle/love-compatibility-calculator" },
      ]} />

      <div className="mb-6 flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Love Compatibility Calculator 💕</h1>
          <p className="text-base text-gray-600">A fun, shareable compatibility check using name numerology and zodiac factors. For entertainment only — real love is more complex!</p>
        </div>
        <button onClick={() => window.print()} className="print:hidden flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg">
          ↓ PDF
        </button>
      </div>

      <div className="bg-pink-50 border border-pink-200 rounded-xl p-3 mb-6 text-sm text-pink-700">
        🎭 <strong>Just for fun!</strong> This calculator is entertainment only. Real compatibility is built on shared values, communication, and mutual respect — not names or star signs.
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        {/* Inputs */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Enter Your Names</h2>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Your Name ✨</label>
            <input
              type="text"
              value={name1}
              onChange={(e) => { setName1(e.target.value); setCalculated(false); }}
              placeholder="Enter your name"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Partner's Name 💘</label>
            <input
              type="text"
              value={name2}
              onChange={(e) => { setName2(e.target.value); setCalculated(false); }}
              placeholder="Enter partner's name"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
          </div>

          <p className="text-xs text-gray-500 mb-3">Optional: add birthdates for zodiac compatibility boost</p>

          <div className="grid grid-cols-2 gap-3 mb-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Your Birthday</label>
              <input
                type="date"
                value={date1}
                onChange={(e) => { setDate1(e.target.value); setCalculated(false); }}
                className="w-full border border-gray-300 rounded-lg px-2 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Their Birthday</label>
              <input
                type="date"
                value={date2}
                onChange={(e) => { setDate2(e.target.value); setCalculated(false); }}
                className="w-full border border-gray-300 rounded-lg px-2 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
            </div>
          </div>

          <button
            onClick={() => setCalculated(true)}
            disabled={!name1 || !name2}
            className="w-full py-3 bg-pink-500 hover:bg-pink-600 disabled:bg-gray-200 disabled:text-gray-400 text-white font-semibold rounded-xl transition-colors"
          >
            Calculate Compatibility 💕
          </button>
        </div>

        {/* Result */}
        <div className={`bg-gradient-to-br ${scoreColor} rounded-2xl shadow-sm p-6 text-white flex flex-col justify-center`}>
          {result ? (
            <>
              <p className="text-white/80 text-sm font-medium uppercase tracking-wide mb-1">{name1} & {name2}</p>
              <div className="text-7xl font-extrabold mb-1">{result.score}%</div>
              <div className="text-xl font-bold mb-4">{result.label}</div>
              {result.zodiacNote && (
                <div className="bg-white/15 rounded-xl p-3 mb-3 text-sm">
                  🔮 {result.zodiacNote}
                </div>
              )}
              <button
                onClick={handleCopy}
                className="bg-white/20 hover:bg-white/30 text-white text-sm font-medium py-2 px-4 rounded-lg transition-colors"
              >
                {copied ? "✅ Copied!" : "📋 Copy Results to Share"}
              </button>
            </>
          ) : (
            <div className="text-center text-white/70">
              <div className="text-5xl mb-3">💕</div>
              <p className="text-lg font-medium">Enter both names and click Calculate</p>
            </div>
          )}
        </div>
      </div>

      {/* Report card */}
      {result && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">💌 Compatibility Report Card</h2>
          <div className="space-y-3">
            {[
              { label: "Communication 🗣️", val: result.comm },
              { label: "Romance 💑", val: result.romance },
              { label: "Friendship 🤝", val: result.friendship },
              { label: "Long-term Potential 🏡", val: result.longTerm },
              { label: "Adventure 🌍", val: result.adventure },
            ].map(({ label, val }) => (
              <div key={label}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-700">{label}</span>
                  <span className="font-bold text-gray-800">{val}%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div className="bg-pink-400 h-2 rounded-full transition-all" style={{ width: `${val}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <CalculatorLayout
        title=""
        description=""
        explanation={
          <div className="space-y-4 text-sm text-gray-700 leading-relaxed">
            <h2 className="text-xl font-bold text-gray-900">Love, Compatibility, and the Science of Connection</h2>
            <p>
              Humans have been trying to predict romantic compatibility since at least 2,000 BCE. Chinese astrology, developed across millennia, assigned personality traits to birth years (the twelve-animal zodiac cycle) and used these to counsel marriage decisions. Western zodiac compatibility — the idea that Fire signs harmonize with Air signs, and Earth signs complement Water signs — derives from ancient Greek four-element theory adapted by medieval astrologers. Vedic astrology developed an elaborate compatibility system called <em>Kundali Milan</em>, which assessed eight factors (Ashtakoota) including temperament, cosmic harmony, and longevity.
            </p>
            <p>
              Numerology traces its Western roots to Pythagoras (c. 570–495 BCE), the mathematician and philosopher who believed numbers were the fundamental language of reality. He taught that each number carried a specific vibrational essence, and that names and birthdates could be reduced to single "life path" digits that revealed personality and destiny. While modern mathematics has long abandoned this idea, numerology remains popular as a system of self-reflection.
            </p>
            <p>
              So what does actual psychological research say about compatibility? The most robust findings come from Dr. John Gottman's decades of observational research at his "Love Lab" at the University of Washington. Gottman identified what he calls the "Four Horsemen" — communication patterns that predict divorce with over 90% accuracy: <strong>criticism</strong> (attacking a partner's character), <strong>contempt</strong> (treating them as inferior), <strong>defensiveness</strong> (deflecting blame), and <strong>stonewalling</strong> (emotional withdrawal). The antidotes — gentle start-up, taking responsibility, physiological self-soothing, and expressing appreciation — are behaviors anyone can learn.
            </p>
            <p>
              Psychologist Arthur Aron designed an experiment in 1997 to test whether sustained mutual vulnerability could accelerate intimacy between strangers. Pairs of strangers who spent 45 minutes answering 36 increasingly personal questions — ending by staring silently into each other's eyes for four minutes — reported significantly higher feelings of closeness. One couple from the original study married six months later. The "36 Questions That Lead to Love" went viral after a New York Times Modern Love column in 2015 and demonstrated that intimacy is less about chemistry and more about attention and disclosure.
            </p>
            <p>
              The <em>mere exposure effect</em> — first documented by Robert Zajonc in 1968 — shows that simply being around someone more often increases how much you like them. This is why workplace romances and friend-group relationships are so common: repeated exposure breeds familiarity, and familiarity feels like comfort, and comfort can feel like attraction. It also suggests that love calculators, as conversation starters between people curious about each other, might serve a subtle social function.
            </p>
            <p>
              The personality compatibility debate — should you seek someone similar or complementary? — has been studied extensively. The evidence generally favors similarity: couples with similar values, interests, and personality traits report higher satisfaction and stability. The "opposites attract" trope is more romantic than real. However, complementarity in specific functional areas (one partner more organized, the other more spontaneous) can reduce friction when those roles are consciously negotiated rather than defaulted into.
            </p>
            <p>
              Love compatibility calculators are wildly popular online — generating millions of searches each month — because they offer something real-life human messiness can't: an immediate, shareable, concrete-feeling answer to a question that is deeply subjective and emotionally loaded. Whether the score is high or low, it almost always prompts a conversation. And it is precisely that conversation — the comparing, the laughing, the debating about whether Scorpios are really that intense — that is the actual value. Our calculator uses consistent, deterministic math so the same names always give the same result. But please: use it as a conversation starter, not a verdict. 💕
            </p>
          </div>
        }
        faqs={[
          {
            question: "Is this love calculator scientifically accurate?",
            answer: "No, and we'd be worried if it were! Real romantic compatibility depends on shared values, communication patterns, emotional maturity, life goals, and mutual respect — none of which can be derived from names. This calculator is purely for entertainment and uses deterministic math on name characters to produce consistent (but not meaningful) scores. Use it as a conversation starter, not a verdict."
          },
          {
            question: "Why do two couples with different names get different results?",
            answer: "The algorithm uses the ASCII (numerical) values of each character in both names to calculate a score through a series of deterministic mathematical operations. Because every name has a unique character sequence, every name combination produces a unique result. The same two names will always produce the same score, making it fun and consistent without being random."
          },
          {
            question: "What zodiac signs are most compatible with each other?",
            answer: "In traditional Western astrology, the four elements create natural affinities: Fire signs (Aries, Leo, Sagittarius) harmonize with Air signs (Gemini, Libra, Aquarius), and Earth signs (Taurus, Virgo, Capricorn) harmonize with Water signs (Cancer, Scorpio, Pisces). Signs of the same element understand each other well. Opposite-element combinations (Fire+Water, Earth+Air) are traditionally seen as more challenging but some astrologers argue these create exciting tension."
          },
          {
            question: "Does a low score mean we are incompatible?",
            answer: "Absolutely not. This is a fun math exercise using your names, not a psychological profile. Many deeply compatible couples would score low and many deeply incompatible couples might score high. Research consistently shows that compatibility is built through behavior — the Four Horsemen study by Dr. John Gottman found communication patterns predict relationship success far better than any initial 'chemistry' or personality matching."
          },
          {
            question: "How does the algorithm actually work?",
            answer: "It sums the ASCII character values of both names, applies several mathematical operations (multiplication, XOR, modulo) to create a number in the 30–100 range, then derives sub-scores for each category (communication, romance, etc.) using different multipliers on the same input values. If you add birthdates, the zodiac elements and life path numbers shift the final score by up to 30 points. The system is deterministic: identical inputs always produce identical outputs."
          },
        ]}
        relatedCalculators={[
          { name: "Age Calculator", href: "/calculators/date/age-calculator" },
          { name: "Days Alive Calculator", href: "/calculators/lifestyle/days-alive-calculator" },
          { name: "Countdown Calculator", href: "/calculators/date/countdown-calculator" },
        ]}
      >
        <div />
      </CalculatorLayout>
    </div>
  );
}
