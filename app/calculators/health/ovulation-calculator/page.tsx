"use client";
import { useState, useEffect } from "react";
import Breadcrumbs from "@/components/Breadcrumbs";
import CalculatorLayout from "@/components/CalculatorLayout";

interface OvulationResult {
  ovulationDay: Date;
  fertileStart: Date;
  fertileEnd: Date;
  nextPeriod: Date;
  nextOvulation: Date;
  nextFertileStart: Date;
  nextFertileEnd: Date;
  daysUntilOvulation: number;
  daysUntilFertile: number;
  lmp: Date;
  cycleLength: number;
  periodLength: number;
}

function getDefaultLMP(): string {
  const d = new Date();
  d.setDate(d.getDate() - 14);
  return d.toISOString().split("T")[0];
}

function formatDate(d: Date): string {
  return d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

function formatShort(d: Date): string {
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export default function OvulationCalculatorPage() {
  const [lmpDate, setLmpDate] = useState<string>(getDefaultLMP());
  const [cycleLength, setCycleLength] = useState<number>(28);
  const [periodLength, setPeriodLength] = useState<number>(5);
  const [result, setResult] = useState<OvulationResult | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("ovulation-calc");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.lmpDate) setLmpDate(parsed.lmpDate);
        if (parsed.cycleLength) setCycleLength(parsed.cycleLength);
        if (parsed.periodLength) setPeriodLength(parsed.periodLength);
      } catch {}
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("ovulation-calc", JSON.stringify({ lmpDate, cycleLength, periodLength }));
    calculate();
  }, [lmpDate, cycleLength, periodLength]);

  function calculate() {
    if (!lmpDate) return;
    const lmp = new Date(lmpDate);

    const ovulationDay = new Date(lmp);
    ovulationDay.setDate(lmp.getDate() + cycleLength - 14);

    const fertileStart = new Date(ovulationDay);
    fertileStart.setDate(ovulationDay.getDate() - 5);

    const fertileEnd = new Date(ovulationDay);
    fertileEnd.setDate(ovulationDay.getDate() + 1);

    const nextPeriod = new Date(lmp);
    nextPeriod.setDate(lmp.getDate() + cycleLength);

    const nextOvulation = new Date(nextPeriod);
    nextOvulation.setDate(nextPeriod.getDate() + cycleLength - 14);

    const nextFertileStart = new Date(nextOvulation);
    nextFertileStart.setDate(nextOvulation.getDate() - 5);

    const nextFertileEnd = new Date(nextOvulation);
    nextFertileEnd.setDate(nextOvulation.getDate() + 1);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const daysUntilOvulation = Math.round(
      (ovulationDay.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    );
    const daysUntilFertile = Math.round(
      (fertileStart.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    );

    setResult({
      ovulationDay,
      fertileStart,
      fertileEnd,
      nextPeriod,
      nextOvulation,
      nextFertileStart,
      nextFertileEnd,
      daysUntilOvulation,
      daysUntilFertile,
      lmp,
      cycleLength,
      periodLength,
    });
  }

  function renderCalendar(r: OvulationResult) {
    const year = r.lmp.getFullYear();
    const month = r.lmp.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfWeek = new Date(year, month, 1).getDay();

    const cells: JSX.Element[] = [];

    for (let i = 0; i < firstDayOfWeek; i++) {
      cells.push(<div key={`e${i}`} />);
    }

    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(year, month, d);
      const isPeriod =
        date >= r.lmp &&
        date < new Date(r.lmp.getTime() + r.periodLength * 86400000);
      const isOvulation = date.toDateString() === r.ovulationDay.toDateString();
      const isFertile =
        date >= r.fertileStart && date <= r.fertileEnd && !isOvulation;

      let cellClass =
        "w-8 h-8 flex items-center justify-center text-xs rounded-full font-medium";
      if (isOvulation) cellClass += " bg-green-500 text-white font-bold";
      else if (isFertile) cellClass += " bg-green-200 text-green-800";
      else if (isPeriod) cellClass += " bg-pink-200 text-pink-800";
      else cellClass += " text-gray-700";

      cells.push(
        <div key={d} className="flex justify-center">
          <div className={cellClass}>{d}</div>
        </div>
      );
    }

    return (
      <div className="mt-6 bg-white rounded-xl shadow-md p-6 border border-gray-200">
        <h3 className="text-sm font-semibold text-gray-700 mb-4">
          {r.lmp.toLocaleDateString("en-US", { month: "long", year: "numeric" })} — Cycle Overview
        </h3>
        <div className="grid grid-cols-7 gap-1 text-center">
          {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
            <div key={day} className="text-xs font-semibold text-gray-500 mb-1">
              {day}
            </div>
          ))}
          {cells}
        </div>
        <div className="flex flex-wrap gap-3 mt-4 text-xs">
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-full bg-pink-200 inline-block" /> Period
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-full bg-green-200 inline-block" /> Fertile window
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-full bg-green-500 inline-block" /> Ovulation day
          </span>
        </div>
      </div>
    );
  }

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Calculators", href: "/calculators" },
    { label: "Health", href: "/calculators/health" },
    { label: "Ovulation Calculator", href: "/calculators/health/ovulation-calculator" },
  ];

  const faqs = [
    {
      question: "Can I get pregnant outside the fertile window?",
      answer:
        "It is very unlikely but not impossible. Sperm can survive in the female reproductive tract for up to 5 days under favorable cervical mucus conditions, and egg viability is 12–24 hours after release. Unprotected intercourse even a week before ovulation carries some theoretical risk if ovulation is delayed by illness or stress.",
    },
    {
      question: "How do I know if I actually ovulated?",
      answer:
        "The most accessible confirmation methods are: tracking basal body temperature (BBT) — a sustained rise of 0.2°C or more over 3 consecutive days indicates ovulation has occurred; using ovulation predictor kits (OPKs) to detect the LH surge 24–48 hours before ovulation; and noticing egg-white cervical mucus at peak fertility.",
    },
    {
      question: "Is this calculator accurate for irregular cycles?",
      answer:
        "Calendar-based predictions are less accurate for irregular cycles. If your cycle length varies by more than 7–10 days each month, use of OPK strips or BBT tracking will give you much more reliable ovulation timing than date calculations alone. Irregular cycles are often associated with PCOS, thyroid conditions, or high stress levels.",
    },
    {
      question: "What if my cycle is shorter than 28 days?",
      answer:
        "Ovulation occurs earlier. Since the luteal phase is relatively fixed at ~14 days, a shorter cycle means a shorter follicular phase and earlier ovulation. For example, with a 24-day cycle, ovulation typically occurs around day 10 rather than day 14.",
    },
    {
      question: "Can stress affect ovulation?",
      answer:
        "Yes, significantly. Psychological and physical stress elevates cortisol, which suppresses GnRH (gonadotropin-releasing hormone) and can delay or suppress the LH surge that triggers ovulation. Illness, intense exercise, dramatic weight change, and sleep deprivation can all push ovulation days or even weeks later than your typical pattern.",
    },
  ];

  const relatedCalculators = [
    { name: "Pregnancy Due Date Calculator", href: "/calculators/health/pregnancy-due-date-calculator" },
    { name: "Age Calculator", href: "/calculators/date/age-calculator" },
    { name: "Water Intake Calculator", href: "/calculators/health/water-intake-calculator" },
  ];

  const explanation = (
    <div className="space-y-4 text-sm text-gray-600 leading-relaxed">
      <p>
        The menstrual cycle is divided into three main phases: the <strong>follicular phase</strong>, which begins on the first day of menstruation and ends at ovulation; <strong>ovulation</strong> itself, when a mature egg is released from the dominant follicle; and the <strong>luteal phase</strong>, which follows ovulation and ends when the next period begins. Understanding this progression is the foundation of any calendar-based fertility awareness method.
      </p>
      <p>
        A key biological fact that makes this calculator work is that the <strong>luteal phase is relatively constant at approximately 14 days</strong> across most women, regardless of overall cycle length. This means cycle-to-cycle variability is almost entirely driven by differences in the follicular phase. A woman with a 35-day cycle simply ovulates later — around day 21 — while a woman with a 24-day cycle ovulates around day 10. By working backward 14 days from the expected next period, we can estimate the most likely ovulation date.
      </p>
      <p>
        The biological trigger for ovulation is a rapid surge in <strong>luteinizing hormone (LH)</strong>, produced by the pituitary gland. This surge typically occurs 24–48 hours before the egg is released. Over-the-counter <strong>ovulation predictor kits (OPKs)</strong> detect this LH surge in urine, giving couples advance notice of the most fertile days. A positive OPK result generally means ovulation is imminent within 12–36 hours, making intercourse in that window particularly effective for conception.
      </p>
      <p>
        <strong>Basal body temperature (BBT) charting</strong> offers a complementary but retroactive confirmation method. After ovulation, progesterone production by the corpus luteum causes a sustained temperature rise of approximately 0.2°C (0.4°F). By recording your resting temperature each morning before getting out of bed, you can identify a consistent post-ovulatory shift — confirming ovulation occurred but providing limited advance warning. BBT charting is most useful for identifying patterns over several cycles.
      </p>
      <p>
        <strong>Cervical mucus</strong> changes predictably throughout the cycle and is one of the most reliable observable signs of approaching ovulation. During the early follicular phase, mucus is typically absent or dry. As estrogen rises, it becomes sticky, then creamy and white, and finally — at peak fertility — takes on a raw egg-white consistency: clear, stretchy, and slippery. This egg-white cervical mucus (EWCM) creates a hospitable environment for sperm and signals that ovulation is imminent or occurring.
      </p>
      <p>
        It is important to note that the calendar method alone is <strong>not a reliable form of contraception</strong>. The Pearl Index — a measure of contraceptive efficacy — places typical-use failure rates for the calendar method at approximately 24% per year, meaning roughly 1 in 4 women relying solely on this method will experience an unintended pregnancy within twelve months. Cycle irregularities, stress, and illness can all shift ovulation unpredictably.
      </p>
      <p>
        <strong>Stress and illness</strong> can significantly delay ovulation by disrupting the hormonal cascade. Elevated cortisol from psychological stress or physical illness suppresses the hypothalamic secretion of GnRH (gonadotropin-releasing hormone), which in turn blunts the FSH and LH signals needed to drive follicle development. The result is a delayed or suppressed LH surge — meaning ovulation occurs later than the calendar predicts, or in some cycles, not at all (anovulation).
      </p>
      <p>
        Women with <strong>Polycystic Ovary Syndrome (PCOS)</strong> often experience highly irregular or infrequent ovulation, making calendar-based prediction unreliable. PCOS disrupts normal follicle development and the LH surge, leading to cycles that may vary by weeks or months. For women with PCOS or other hormonal conditions, daily OPK testing or consultation with a reproductive endocrinologist provides more actionable fertility information than date-based calculators.
      </p>
      <p>
        If an egg is fertilized, <strong>implantation</strong> typically occurs 6–12 days after ovulation as the developing embryo travels down the fallopian tube and embeds in the uterine lining. Once implanted, the embryo begins producing hCG (human chorionic gonadotropin), the hormone detected by pregnancy tests. hCG levels double approximately every 48–72 hours in early pregnancy, which is why tests become reliably positive 10–14 days after ovulation — roughly around the time of the expected period.
      </p>
      <p>
        Some women notice physical <strong>signs of ovulation</strong> beyond mucus changes. <em>Mittelschmerz</em> — a German word meaning "middle pain" — describes a one-sided pelvic ache or twinge that some women feel as the follicle ruptures. Breast tenderness, mild bloating, increased libido, and heightened sense of smell have also been reported around ovulation. Cervical position typically shifts higher, softer, and more open near peak fertility. While no single sign is definitive, tracking multiple markers together increases reliability.
      </p>
      <p className="text-xs text-gray-400 italic border-t pt-3">
        Disclaimer: This calculator is for informational and educational purposes only. It does not constitute medical advice, diagnosis, or treatment. Cycle predictions are estimates based on average hormonal patterns and may not reflect your individual physiology. Always consult a qualified healthcare provider or reproductive specialist for personal guidance on fertility, conception, or contraception.
      </p>
    </div>
  );

  return (
    <>
      <Breadcrumbs items={breadcrumbItems} />
      <CalculatorLayout
        title="Ovulation Calculator"
        description="Find your fertile window and ovulation date based on your menstrual cycle."
        explanation={explanation}
        faqs={faqs}
        relatedCalculators={relatedCalculators}
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Card - Inputs */}
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800 mb-5">Your Cycle Details</h2>

            <div className="space-y-6">
              {/* LMP Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  First Day of Last Period
                </label>
                <input
                  type="date"
                  value={lmpDate}
                  onChange={(e) => setLmpDate(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-md text-sm font-semibold text-pink-600 focus:ring-2 focus:ring-pink-500 focus:border-transparent bg-white"
                />
              </div>

              {/* Cycle Length Slider */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Average Cycle Length:{" "}
                  <span className="font-bold text-pink-600">{cycleLength} days</span>
                </label>
                <input
                  type="range"
                  min={21}
                  max={35}
                  value={cycleLength}
                  onChange={(e) => setCycleLength(Number(e.target.value))}
                  className="w-full h-2 rounded-lg appearance-none cursor-pointer accent-pink-600"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>21 days</span>
                  <span>35 days</span>
                </div>
              </div>

              {/* Period Length Slider */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Average Period Length:{" "}
                  <span className="font-bold text-rose-600">{periodLength} days</span>
                </label>
                <input
                  type="range"
                  min={2}
                  max={8}
                  value={periodLength}
                  onChange={(e) => setPeriodLength(Number(e.target.value))}
                  className="w-full h-2 rounded-lg appearance-none cursor-pointer accent-rose-600"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>2 days</span>
                  <span>8 days</span>
                </div>
              </div>

              {/* Cycle summary */}
              <div className="bg-pink-50 rounded-lg p-4 text-sm text-gray-600">
                <p className="font-medium text-pink-700 mb-1">How this works</p>
                <p>
                  Ovulation is estimated by subtracting 14 days from the end of your cycle. The fertile
                  window spans 5 days before ovulation through the day after — a total of 7 days when
                  conception is most likely.
                </p>
              </div>
            </div>
          </div>

          {/* Right Card - Results */}
          <div id="results" className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800 mb-5">Your Fertile Window</h2>

            {result ? (
              <div className="space-y-4">
                {/* Ovulation Date */}
                <div className="bg-pink-600 text-white rounded-xl p-5">
                  <p className="text-sm font-medium opacity-80 mb-1">Estimated Ovulation Date</p>
                  <p className="text-2xl font-bold">{formatDate(result.ovulationDay)}</p>
                  <p className="text-sm mt-2 opacity-90">
                    {result.daysUntilOvulation > 0
                      ? `${result.daysUntilOvulation} days from today`
                      : result.daysUntilOvulation === 0
                      ? "Today!"
                      : `Ovulation was ${Math.abs(result.daysUntilOvulation)} days ago`}
                  </p>
                </div>

                {/* Fertile Window */}
                <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4">
                  <p className="text-xs font-semibold text-green-700 uppercase tracking-wide mb-1">
                    Fertile Window
                  </p>
                  <p className="text-base font-bold text-green-800">
                    {formatDate(result.fertileStart)} – {formatDate(result.fertileEnd)}
                  </p>
                  <p className="text-xs text-green-600 mt-0.5">(6 days)</p>
                  <p className="text-xs text-gray-500 mt-2">
                    {result.daysUntilFertile > 0
                      ? `Fertile window begins in ${result.daysUntilFertile} days`
                      : result.daysUntilFertile === 0
                      ? "Fertile window starts today"
                      : "Currently in or past fertile window"}
                  </p>
                </div>

                {/* Next Period */}
                <div className="bg-gray-50 border-2 border-gray-200 rounded-lg p-4">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                    Next Expected Period
                  </p>
                  <p className="text-base font-bold text-gray-800">
                    {formatDate(result.nextPeriod)}
                  </p>
                </div>

                {/* Next Cycle Preview */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-xs font-semibold text-blue-700 uppercase tracking-wide mb-2">
                    Next Cycle Preview
                  </p>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Next ovulation:</span>
                      <span className="font-semibold text-blue-800">
                        {formatShort(result.nextOvulation)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Next fertile window:</span>
                      <span className="font-semibold text-blue-800">
                        {formatShort(result.nextFertileStart)} – {formatShort(result.nextFertileEnd)}
                      </span>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-gray-400 mt-4 border-t pt-3">
                  This calculator is for informational purposes only and does not constitute medical
                  advice. Consult your healthcare provider for personalized guidance.
                </p>
              </div>
            ) : (
              <div className="flex items-center justify-center h-48 text-gray-400">
                <p className="text-sm">Enter your cycle details to see results.</p>
              </div>
            )}
          </div>
        </div>

        {/* Calendar Visual */}
        {result && renderCalendar(result)}
      </CalculatorLayout>
    </>
  );
}
