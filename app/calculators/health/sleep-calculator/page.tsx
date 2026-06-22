"use client";
import { useState, useMemo } from "react";
import Breadcrumbs from "@/components/Breadcrumbs";
import CalculatorLayout from "@/components/CalculatorLayout";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, Legend } from "recharts";

// ── helpers ──────────────────────────────────────────────────────────────────

function hour12to24(h: number, ampm: "AM" | "PM"): number {
  if (ampm === "AM" && h === 12) return 0;
  if (ampm === "PM" && h !== 12) return h + 12;
  return h;
}

function minutesToTime(minutes: number): string {
  const m = ((minutes % 1440) + 1440) % 1440;
  const h24 = Math.floor(m / 60);
  const min = m % 60;
  const ampm = h24 < 12 ? "AM" : "PM";
  const h12 = h24 % 12 === 0 ? 12 : h24 % 12;
  return `${h12}:${String(min).padStart(2, "0")} ${ampm}`;
}

// ── chart data ────────────────────────────────────────────────────────────────

const chartData = [
  { cycle: "Cycle 1", deep: 35, light: 50, rem: 15 },
  { cycle: "Cycle 2", deep: 25, light: 50, rem: 25 },
  { cycle: "Cycle 3", deep: 20, light: 50, rem: 30 },
  { cycle: "Cycle 4", deep: 15, light: 45, rem: 40 },
  { cycle: "Cycle 5", deep: 10, light: 45, rem: 45 },
  { cycle: "Cycle 6", deep: 5, light: 45, rem: 50 },
];

// ── result card config ────────────────────────────────────────────────────────

const CYCLE_CONFIG = [
  { n: 3, label: "4.5 hours", subtext: "Not recommended", bg: "bg-red-50", border: "border-red-200", textColor: "text-red-600" },
  { n: 4, label: "6 hours", subtext: "Minimum", bg: "bg-yellow-50", border: "border-yellow-200", textColor: "text-yellow-600" },
  { n: 5, label: "7.5 hours ✓", subtext: "Recommended", bg: "bg-green-50", border: "border-green-200", textColor: "text-green-600" },
  { n: 6, label: "9 hours", subtext: "Ideal", bg: "bg-blue-50", border: "border-blue-200", textColor: "text-blue-600" },
];

// ── content for CalculatorLayout ──────────────────────────────────────────────

const explanation = `
Sleep is not a uniform block of unconsciousness. A full night's rest consists of 4 to 6 complete 90-minute cycles, each containing four distinct stages that cycle in a predictable pattern. Stage N1 (light sleep, approximately 5% of each cycle) is the brief transition from wakefulness to sleep — the stage where you may feel yourself "falling" and muscle twitches are common. Stage N2 (light sleep, 45–50% of each cycle) is characterized by sleep spindles and K-complexes, neural events that consolidate memories and protect sleep from external disturbances. Stage N3 (deep or slow-wave sleep, 15–25%) is the most physiologically restorative phase, dominated by delta brain waves. Finally, REM (Rapid Eye Movement, 25–30%) is when most vivid dreaming occurs and the brain processes emotional and procedural memories. The proportion of each stage shifts across the night: the first half is dominated by deep N3 sleep, while the second half is weighted toward longer, more elaborate REM episodes. This is why cutting a night short by even 90 minutes can disproportionately eliminate REM sleep.

Why do 90-minute cycles matter when setting an alarm? Waking mid-cycle — particularly during N3 deep sleep — causes a phenomenon called sleep inertia: the disorienting, heavy-headed grogginess that can last anywhere from 15 minutes to two hours. During N3, the brain is flooded with adenosine (the neurotransmitter that drives sleep pressure) and is actively suppressing arousal systems. Interrupting this phase means the brain has not completed its biological reset. Timing your alarm to coincide with the natural transition at the end of a cycle, when you are momentarily in the lighter N1 or N2 phase, dramatically reduces morning grogginess. You may even find yourself waking naturally just before the alarm — this is the brain anticipating the wake signal based on circadian rhythms.

Deep sleep (N3) is not merely rest — it is a period of intense biological maintenance. Growth hormone is released almost exclusively during N3, making it critical for muscle repair and synthesis, bone density maintenance, and immune system strengthening. The glymphatic system, the brain's dedicated waste-clearance network, becomes highly active during deep sleep, flushing out metabolic byproducts including beta-amyloid plaques strongly associated with Alzheimer's disease. Declarative memories — facts, names, events from the day — are transferred from the hippocampus to long-term cortical storage during N3. This is why sleep deprivation before an exam impairs recall even if you studied thoroughly: the consolidation step was skipped.

REM sleep is equally vital, but serves different cognitive functions. During REM, the brain is nearly as metabolically active as during wakefulness, yet the body is in a state of voluntary muscle paralysis (atonia) that prevents acting out dreams. REM sleep is essential for processing emotional memories: it replays and re-encodes experiences in a neurochemical environment low in norepinephrine (a stress-related neurotransmitter), effectively stripping the emotional charge from distressing events. This is one reason why "sleeping on it" reduces the emotional intensity of upsetting situations. REM also consolidates procedural and creative memories — motor skills, artistic intuitions, and insight-based problem-solving all improve after REM-rich sleep. Chronic sleep restriction selectively reduces REM (since it is concentrated in the final hours of the night), impairing emotional regulation and creative thinking.

Sleep debt is cumulative and its cognitive effects are insidious. After 17 continuous hours of wakefulness, cognitive impairment becomes equivalent to a blood-alcohol level of 0.05% — enough to impair driving, reaction time, and decision-making. After 24 hours without sleep, impairment reaches the equivalent of 0.10% blood alcohol — above the legal limit in most countries. Particularly concerning is that people who are chronically sleep-restricted adapt to their impaired state and can no longer accurately gauge their own deficit: they report feeling "fine" on 6 hours per night, yet objective performance tests show significant deterioration. Sleeping in on weekends can partially reduce acute sleep debt, but chronic sleep restriction over weeks causes immune and metabolic disruptions that a single extended sleep cannot fully reverse.

The circadian clock creates predictable windows of alertness and sleepiness across the 24-hour day. Two natural alertness dips occur: a post-lunch dip between 1–3 pm (caused by a circadian trough, independent of what or whether you ate), and the primary sleepiness window around midnight. Many people experience a "second wind" around 10–11 pm — a circadian arousal spike driven by the suprachiasmatic nucleus that briefly suppresses melatonin. If you ride out this spike by staying up later, you will need to wait through another alertness cycle before drowsiness returns, making it progressively harder to fall asleep at a reasonable hour. This is why people who describe themselves as night owls often find it easier to stay up until 2 am than to fall asleep at midnight.

Chronotype — your natural preference for early or late sleep timing — is approximately 50% heritable and tied to specific gene variants, particularly in the PER3, CLOCK, and BMAL1 genes. About 25% of people are natural "morning larks" (highest alertness and performance in the morning, naturally tired by 9–10 pm), 25% are "night owls" (peak performance in the evening, naturally alert until midnight or later), and 50% fall between these poles. Chronotype is not a lifestyle choice: night owls who are forced into early schedules by school or work schedules accumulate social jet lag — a chronic misalignment between their biological clock and social demands — associated with poorer health outcomes. Chronotype also shifts across the lifespan: children tend toward early schedules, teenagers shift significantly later (a biological change, not laziness), and adults gradually shift earlier again after age 20, accelerating after age 60. The Morningness-Eveningness Questionnaire (MEQ) is a validated tool for identifying your chronotype.

Light is the most powerful environmental signal for the circadian clock. The suprachiasmatic nucleus (SCN) in the hypothalamus receives light signals directly from the retina via the retinohypothalamic tract and uses them to synchronize the body's master clock. Particularly important is short-wavelength blue light at around 480 nanometers, which strongly suppresses melatonin secretion from the pineal gland. The screens of smartphones, laptops, and tablets emit substantial blue light. Exposure to these screens within 1–2 hours of bedtime can delay melatonin onset by 90 minutes to 3 hours, pushing back sleep onset and shortening overall sleep time. Blue-light-filtering glasses and software solutions such as f.lux or Night Shift on Apple devices reduce (but do not eliminate) this effect. The single most effective intervention is limiting bright light exposure in the hour before bed, combined with bright morning light exposure within 30 minutes of waking to anchor the circadian clock.

A useful framework for sleep hygiene is the 10-3-2-1 rule. No caffeine within 10 hours of bedtime: caffeine's half-life in the body is 5–7 hours, meaning a 3 pm coffee still has approximately 50% of its concentration in your bloodstream at 10 pm, suppressing adenosine (the chemical that builds sleep pressure) and delaying sleep onset. No alcohol within 3 hours of bedtime: while alcohol is sedating initially, it causes a rebound arousal effect in the second half of the night as it is metabolized, fragmenting sleep architecture and suppressing REM in the early morning hours. No large meals within 2 hours: digestion raises core body temperature, which opposes the natural temperature drop required for sleep onset. No screens within 1 hour: the combination of blue light and the psychological activation of social media, news, and email keeps the brain in a state of heightened arousal incompatible with falling asleep quickly.

Bedroom temperature is often overlooked in sleep optimization. Core body temperature must drop by approximately 1–2°C from its daytime peak for sleep onset to occur — this is a hard physiological requirement, not a preference. The optimal bedroom temperature for most adults is between 65 and 68°F (18–20°C). Interestingly, taking a warm bath or shower 1–2 hours before bed can paradoxically accelerate this process: immersion in warm water increases blood flow to the skin and extremities; once you exit the bath, this peripheral warmth rapidly dissipates, actively accelerating the drop in core body temperature and shortening the time it takes to fall asleep. Studies show this reduces sleep onset latency by 10 minutes on average — a meaningful effect for people who struggle to fall asleep.
`;

const faqs = [
  {
    question: "Is 6 hours of sleep enough?",
    answer: "For most adults, 6 hours is insufficient for optimal health and cognitive function. While a small percentage of people (estimated 1–3%) carry a genetic mutation (hDEC2) that allows them to function well on 6 hours, most people who report functioning fine on 6 hours have adapted to their impairment and can no longer accurately gauge their own deficit. Short-term sleep restriction for occasional demands is manageable; chronic 6-hour nights are associated with increased risks of obesity, type 2 diabetes, cardiovascular disease, and reduced immune function.",
  },
  {
    question: "Why do I wake up at 3am?",
    answer: "Waking between 2–4 am typically corresponds to the transition between sleep cycles when you are in the lighter N1/N2 phase. A natural cortisol mini-spike occurs in the early morning hours (part of the cortisol awakening response) as the body prepares to wake up. Stress, alcohol (which causes rebound arousal 4–6 hours after consumption), blood sugar fluctuations, or an overactive bladder can amplify this natural arousal to full wakefulness. Most 3 am wakings lasting less than 20 minutes are normal; persistent waking may indicate sleep apnea or anxiety.",
  },
  {
    question: "Should I nap to catch up on sleep?",
    answer: "A 20-minute power nap (set your alarm for 25 minutes to account for falling asleep) can restore alertness and performance without causing sleep inertia. Napping for 30–60 minutes risks waking in N2 or N3, causing grogginess. A full 90-minute nap completes one cycle and includes REM, which is restorative but can reduce nighttime sleep pressure if taken after 3 pm. Napping cannot fully repay sleep debt, but strategically placed power naps improve afternoon performance significantly.",
  },
  {
    question: "What is sleep debt?",
    answer: "Sleep debt is the cumulative difference between the sleep you need and the sleep you actually get. If you need 8 hours but average 6.5, you accumulate 1.5 hours of debt per night — 10.5 hours per week. Research suggests sleep debt builds across multiple nights and affects health cumulatively, not just acutely. While two to three nights of extended sleep can partially reduce accumulated debt, chronic sleep deprivation creates changes in immune function and metabolic markers that require more than a weekend to fully reverse.",
  },
  {
    question: "Does melatonin help you fall asleep?",
    answer: "Melatonin is most effective for circadian rhythm disruption (jet lag, shift work, delayed sleep phase syndrome) rather than as a general sleep aid. The key is timing and dose: 0.3–1 mg taken 2 hours before desired bedtime is evidence-based. Many commercial supplements contain 5–10 mg, which can shift the circadian clock but also cause morning grogginess. Melatonin signals 'it is dark outside' to the brain — it is not a sedative. It works best when light exposure is also managed (dark environment after taking it).",
  },
];

const relatedCalculators = [
  { name: "Age Calculator", href: "/calculators/math/age-calculator" },
  { name: "BMR Calculator", href: "/calculators/health/bmr-calculator" },
  { name: "Calorie Calculator", href: "/calculators/health/calorie-calculator" },
];

// ── component ─────────────────────────────────────────────────────────────────

export default function SleepCalculatorPage() {
  const [mode, setMode] = useState<"wakeup" | "bedtime">("wakeup");
  const [timeHour, setTimeHour] = useState(7);
  const [timeMinute, setTimeMinute] = useState(0);
  const [timeAmPm, setTimeAmPm] = useState<"AM" | "PM">("AM");
  const [fallAsleepMin, setFallAsleepMin] = useState<0 | 5 | 10 | 15>(15);

  const results = useMemo(() => {
    const h24 = hour12to24(timeHour, timeAmPm);
    const inputMinutes = h24 * 60 + timeMinute;

    return CYCLE_CONFIG.map(({ n, label, subtext, bg, border, textColor }) => {
      let targetMinutes: number;
      if (mode === "wakeup") {
        targetMinutes = inputMinutes - fallAsleepMin - n * 90;
      } else {
        targetMinutes = inputMinutes + fallAsleepMin + n * 90;
      }
      return {
        n,
        label,
        subtext,
        bg,
        border,
        textColor,
        time: minutesToTime(targetMinutes),
        hours: (n * 90) / 60,
      };
    });
  }, [mode, timeHour, timeMinute, timeAmPm, fallAsleepMin]);

  const modeLabel = mode === "wakeup" ? "Suggested bedtimes" : "Suggested wake-up times";
  const inputLabel = mode === "wakeup" ? "I want to wake up at" : "I want to go to bed at";

  return (
    <>
      <Breadcrumbs
        items={[
          { label: "Health Calculators", href: "/health-calculators" },
          { label: "Sleep Calculator", href: "/calculators/health/sleep-calculator" },
        ]}
      />

      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-start justify-between mb-2">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Sleep Calculator</h1>
            <p className="mt-1 text-gray-500 text-base">
              Find the best bedtime or wake-up time based on 90-minute sleep cycles
            </p>
          </div>
          <button
            onClick={() => window.print()}
            className="hidden sm:inline-flex items-center gap-1.5 text-sm text-gray-500 border border-gray-200 rounded-md px-3 py-1.5 hover:bg-gray-50 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            Print
          </button>
        </div>

        {/* Mode Tabs */}
        <div className="flex rounded-lg border border-gray-200 overflow-hidden mb-6 mt-6">
          <button
            onClick={() => setMode("wakeup")}
            className={`flex-1 py-2.5 text-sm font-medium transition-colors ${
              mode === "wakeup" ? "bg-indigo-600 text-white" : "bg-white text-gray-600 hover:bg-gray-50"
            }`}
          >
            Wake Up At…
          </button>
          <button
            onClick={() => setMode("bedtime")}
            className={`flex-1 py-2.5 text-sm font-medium transition-colors ${
              mode === "bedtime" ? "bg-indigo-600 text-white" : "bg-white text-gray-600 hover:bg-gray-50"
            }`}
          >
            Go to Bed At…
          </button>
        </div>

        {/* Inputs Card */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6 shadow-sm">
          <p className="text-sm font-semibold text-gray-700 mb-3">{inputLabel}</p>

          {/* Time picker */}
          <div className="flex items-center gap-2 mb-5">
            {/* Hour */}
            <select
              value={timeHour}
              onChange={(e) => setTimeHour(Number(e.target.value))}
              className="border border-gray-200 rounded-md px-3 py-2 text-lg font-semibold text-gray-800 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            >
              {Array.from({ length: 12 }, (_, i) => i + 1).map((h) => (
                <option key={h} value={h}>{String(h).padStart(2, "0")}</option>
              ))}
            </select>
            <span className="text-xl font-bold text-gray-500">:</span>
            {/* Minute */}
            <select
              value={timeMinute}
              onChange={(e) => setTimeMinute(Number(e.target.value))}
              className="border border-gray-200 rounded-md px-3 py-2 text-lg font-semibold text-gray-800 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            >
              {[0, 15, 30, 45].map((m) => (
                <option key={m} value={m}>{String(m).padStart(2, "0")}</option>
              ))}
            </select>
            {/* AM/PM */}
            <div className="flex rounded-md border border-gray-200 overflow-hidden">
              {(["AM", "PM"] as const).map((ap) => (
                <button
                  key={ap}
                  onClick={() => setTimeAmPm(ap)}
                  className={`px-4 py-2 text-sm font-semibold transition-colors ${
                    timeAmPm === ap ? "bg-indigo-600 text-white" : "bg-white text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {ap}
                </button>
              ))}
            </div>
          </div>

          {/* Fall asleep time */}
          <div className="mb-5">
            <p className="text-sm font-semibold text-gray-700 mb-2">Time to fall asleep</p>
            <div className="flex gap-2 flex-wrap">
              {([0, 5, 10, 15] as const).map((min) => (
                <button
                  key={min}
                  onClick={() => setFallAsleepMin(min)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                    fallAsleepMin === min
                      ? "bg-indigo-600 text-white border-indigo-600"
                      : "bg-white text-gray-600 border-gray-200 hover:border-indigo-300 hover:text-indigo-600"
                  }`}
                >
                  {min === 0 ? "Instantly" : `${min} min`}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="mb-6">
          <p className="text-sm font-semibold text-gray-600 mb-3 uppercase tracking-wide">
            {modeLabel}
          </p>
          <div className="grid grid-cols-2 gap-3">
            {results.map(({ n, label, subtext, bg, border, textColor, time }) => (
              <div
                key={n}
                className={`${bg} border ${border} rounded-xl p-4 ${n === 5 ? "ring-2 ring-green-400 ring-offset-1" : ""}`}
              >
                <p className={`text-2xl font-bold ${textColor}`}>{time}</p>
                <p className="text-sm font-semibold text-gray-800 mt-1">{label}</p>
                <p className="text-xs text-gray-500">{subtext}</p>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-400 mt-2 text-center">
            Based on 90-minute sleep cycles · includes {fallAsleepMin} min to fall asleep
          </p>
        </div>

        {/* Chart */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 mb-8 shadow-sm">
          <h2 className="text-base font-semibold text-gray-800 mb-1">
            Sleep Stage Distribution Across the Night
          </h2>
          <p className="text-xs text-gray-400 mb-4">
            Deep sleep dominates early cycles; REM increases in later cycles.
          </p>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={chartData} margin={{ top: 4, right: 8, left: -16, bottom: 4 }}>
              <XAxis dataKey="cycle" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} unit="%" />
              <Tooltip formatter={(value: number, name: string) => [`${value}%`, name]} />
              <Legend
                wrapperStyle={{ fontSize: 12 }}
                formatter={(value) =>
                  value === "deep" ? "Deep (N3)" : value === "light" ? "Light (N1/N2)" : "REM"
                }
              />
              <Bar dataKey="deep" stackId="a" fill="#3730a3" name="deep" radius={[0, 0, 0, 0]} />
              <Bar dataKey="light" stackId="a" fill="#93c5fd" name="light" />
              <Bar dataKey="rem" stackId="a" fill="#a855f7" name="rem" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs text-gray-500">
            <div className="flex items-center justify-center gap-1.5">
              <span className="inline-block w-3 h-3 rounded-sm bg-indigo-800" />
              Deep (N3) — restorative
            </div>
            <div className="flex items-center justify-center gap-1.5">
              <span className="inline-block w-3 h-3 rounded-sm bg-blue-300" />
              Light (N1/N2) — memory
            </div>
            <div className="flex items-center justify-center gap-1.5">
              <span className="inline-block w-3 h-3 rounded-sm bg-purple-500" />
              REM — emotional / creative
            </div>
          </div>
        </div>
      </div>

      {/* CalculatorLayout handles explanation, FAQs, related calcs */}
      <CalculatorLayout
        title="Sleep Calculator"
        description="Find the best bedtime or wake-up time based on 90-minute sleep cycles"
        explanation={explanation}
        faqs={faqs}
        relatedCalculators={relatedCalculators}
      >
        <div />
      </CalculatorLayout>
    </>
  );
}
