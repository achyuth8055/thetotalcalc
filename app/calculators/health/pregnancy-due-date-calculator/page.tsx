"use client";
import { useState, useEffect } from "react";
import Breadcrumbs from "@/components/Breadcrumbs";
import CalculatorLayout from "@/components/CalculatorLayout";

interface Milestone {
  label: string;
  date: Date;
}

interface PregnancyResult {
  dueDate: Date;
  gestWeeks: number;
  gestDaysRemainder: number;
  trimester: number;
  isPregnant: boolean;
  milestones: Milestone[];
  progressPct: number;
  lmpEquiv: Date;
}

function todayStr(): string {
  return new Date().toISOString().split("T")[0];
}

function offsetDaysStr(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().split("T")[0];
}

function formatDate(d: Date): string {
  return d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

function formatShort(d: Date): string {
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default function PregnancyDueDateCalculator() {
  const [activeTab, setActiveTab] = useState<"lmp" | "conception" | "ivf">("lmp");
  const [lmpDate, setLmpDate] = useState<string>(todayStr());
  const [cycleLength, setCycleLength] = useState<number>(28);
  const [conceptionDate, setConceptionDate] = useState<string>(offsetDaysStr(-14));
  const [ivfTransferDate, setIvfTransferDate] = useState<string>(todayStr());
  const [embryoAge, setEmbryoAge] = useState<3 | 5>(5);
  const [result, setResult] = useState<PregnancyResult | null>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("pregnancy-due-date");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.activeTab) setActiveTab(parsed.activeTab);
        if (parsed.lmpDate) setLmpDate(parsed.lmpDate);
        if (parsed.cycleLength) setCycleLength(parsed.cycleLength);
        if (parsed.conceptionDate) setConceptionDate(parsed.conceptionDate);
        if (parsed.ivfTransferDate) setIvfTransferDate(parsed.ivfTransferDate);
        if (parsed.embryoAge) setEmbryoAge(parsed.embryoAge);
      }
    } catch (_) {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(
        "pregnancy-due-date",
        JSON.stringify({ activeTab, lmpDate, cycleLength, conceptionDate, ivfTransferDate, embryoAge })
      );
    } catch (_) {}
  }, [activeTab, lmpDate, cycleLength, conceptionDate, ivfTransferDate, embryoAge]);

  function calculate() {
    let dueDate: Date;
    let conceptionEstimate: Date;

    if (activeTab === "lmp") {
      if (!lmpDate) return;
      const lmp = new Date(lmpDate);
      const cycleDiff = cycleLength - 28;
      dueDate = new Date(lmp);
      dueDate.setDate(lmp.getDate() + 280 + cycleDiff);
      conceptionEstimate = new Date(lmp);
      conceptionEstimate.setDate(lmp.getDate() + 14 + cycleDiff);
    } else if (activeTab === "conception") {
      if (!conceptionDate) return;
      const conception = new Date(conceptionDate);
      dueDate = new Date(conception);
      dueDate.setDate(conception.getDate() + 266);
      conceptionEstimate = conception;
    } else {
      if (!ivfTransferDate) return;
      const transfer = new Date(ivfTransferDate);
      const daysToAdd = embryoAge === 5 ? 261 : 263;
      dueDate = new Date(transfer);
      dueDate.setDate(transfer.getDate() + daysToAdd);
      conceptionEstimate = new Date(transfer);
      conceptionEstimate.setDate(transfer.getDate() - embryoAge);
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const lmpEquiv = new Date(dueDate);
    lmpEquiv.setDate(dueDate.getDate() - 280);

    const gestDays = Math.round(
      (today.getTime() - lmpEquiv.getTime()) / (1000 * 60 * 60 * 24)
    );
    const gestWeeks = Math.floor(gestDays / 7);
    const gestDaysRemainder = gestDays % 7;

    let trimester = 1;
    if (gestWeeks >= 28) trimester = 3;
    else if (gestWeeks >= 14) trimester = 2;

    function milestoneDate(weeks: number): Date {
      const d = new Date(lmpEquiv);
      d.setDate(lmpEquiv.getDate() + weeks * 7);
      return d;
    }

    setResult({
      dueDate,
      gestWeeks,
      gestDaysRemainder,
      trimester,
      isPregnant: gestDays > 0 && gestDays < 294,
      milestones: [
        { label: "Week 8 — First prenatal visit", date: milestoneDate(8) },
        { label: "Week 10–13 — First trimester screening", date: milestoneDate(10) },
        { label: "Week 18–20 — Anatomy ultrasound", date: milestoneDate(18) },
        { label: "Week 24 — Viability milestone", date: milestoneDate(24) },
        { label: "Week 28 — Third trimester begins", date: milestoneDate(28) },
        { label: "Week 37 — Early term", date: milestoneDate(37) },
        { label: "Week 39 — Full term", date: milestoneDate(39) },
        { label: "Week 40 — Due date", date: dueDate },
        { label: "Week 42 — Post-term threshold", date: milestoneDate(42) },
      ],
      progressPct:
        gestDays > 0 ? Math.min(100, Math.round((gestDays / 280) * 100)) : 0,
      lmpEquiv,
    });
  }

  const breadcrumbs = [
    { label: "Health Calculators", href: "/health-calculators" },
    { label: "Pregnancy Due Date Calculator", href: "/calculators/health/pregnancy-due-date-calculator" },
  ];

  const explanation = (
    <div className="space-y-4 text-sm text-gray-700 leading-relaxed">
      <p>
        The most widely used method for estimating a due date is <strong>Naegele's Rule</strong>, named
        after Franz Karl Naegele, a German obstetrician who published the formula in 1806. The rule is
        straightforward: add 280 days (40 weeks) to the first day of the last menstrual period (LMP).
        This calculation assumes a regular 28-day cycle with ovulation on day 14. For cycles that differ
        from 28 days, the due date shifts accordingly — a 35-day cycle pushes the due date 7 days later,
        while a 21-day cycle moves it 7 days earlier.
      </p>
      <p>
        Despite the precision of the formula, <strong>due dates are estimates, not appointments</strong>.
        Research consistently shows that only about 4% of babies arrive on their exact calculated due date.
        Roughly 80% of births occur within two weeks before or after the due date, meaning the true
        delivery window spans from about 38 weeks to 42 weeks. The due date is best understood as the
        midpoint of a statistically normal delivery range, not a fixed deadline.
      </p>
      <p>
        There is an important distinction between <strong>gestational age</strong> and <strong>fetal age</strong>
        (sometimes called fertilization age). Gestational age counts from the first day of the LMP —
        which means it includes roughly two weeks before conception even occurred. Fetal age counts from
        fertilization. Doctors and ultrasound reports always use gestational age, which is why a positive
        pregnancy test at "4 weeks pregnant" describes an embryo that is only about 2 weeks old
        biologically. This terminology gap can be confusing but is universal in obstetric practice.
      </p>
      <p>
        <strong>Ultrasound dating</strong> is the most accurate method for confirming gestational age,
        particularly in the first trimester. A measurement called crown-rump length (CRL) — the distance
        from the top of the embryo's head to its bottom — can date a pregnancy to within ±5–7 days when
        performed between 8 and 13 weeks. After the first trimester, ultrasound measurements become
        progressively less precise because fetal size varies more widely among individuals. A second or
        third trimester scan may have a margin of error of ±2–3 weeks. If an early ultrasound date
        differs from the LMP date by more than 7 days, most providers will adjust the official due date
        to match the ultrasound.
      </p>
      <p>
        You might wonder: <strong>why do doctors use LMP as the starting point</strong> when conception
        actually happens about two weeks later? The answer is practicality. Most people know when their
        last period started. Conception date is often uncertain even when the approximate timing is known,
        because sperm can survive in the reproductive tract for up to 5 days. LMP provides a reliable,
        consistently defined reference point that every patient can usually report accurately.
      </p>
      <p>
        Understanding what's happening at key milestones helps put the timeline in context. At{" "}
        <strong>Week 8</strong>, the embryo officially becomes a fetus — major organ systems have begun
        forming, and the heart has been beating since around week 6. By <strong>Week 12</strong>, the
        nuchal translucency (NT) scan can assess risk for chromosomal conditions such as Down syndrome.
        The <strong>Week 18–20 anatomy scan</strong> is a comprehensive ultrasound examining all major
        fetal structures, and fetal sex can typically be determined at this point if desired.{" "}
        <strong>Week 24</strong> is considered the threshold of viability — survival rates at this
        gestational age range from 50–70% with intensive NICU care, improving significantly with each
        additional week. At <strong>Week 28</strong>, rapid brain development accelerates and providers
        often recommend beginning kick counting: 10 fetal movements within a 2-hour window is the
        standard guideline for reassurance.
      </p>
      <p>
        Two important screening tests fall within specific windows. The <strong>glucose tolerance test
        (GTT)</strong> for gestational diabetes is typically performed between 24 and 28 weeks. The{" "}
        <strong>Group B Streptococcus (GBS)</strong> culture is collected between 36 and 37 weeks to
        determine whether IV antibiotics during labor are indicated. Missing these windows can require
        rescheduling, so noting them on your calendar early is worthwhile.
      </p>
      <p>
        Knowing the <strong>signs of preterm labor</strong> — before 37 weeks — is equally important.
        These include regular contractions (even if painless), persistent lower back pain, pelvic
        pressure, or a change in vaginal discharge. Preterm labor is not always painful, so timing
        contractions even when they feel mild is recommended if they seem regular.
      </p>
      <p>
        Finally, terminology around "term" was formally updated in 2013. <strong>Early term</strong> now
        refers to 37 weeks 0 days through 38 weeks 6 days. <strong>Full term</strong> is 39 weeks
        0 days through 40 weeks 6 days. <strong>Late term</strong> covers 41 weeks 0 days through 41
        weeks 6 days, and <strong>post-term</strong> begins at 42 weeks. Before 2013, anything from
        37 weeks onward was called "term," but research showed that babies born at 37–38 weeks have
        meaningfully higher rates of breathing difficulties, feeding problems, and NICU admissions
        compared to those born at 39+ weeks — even though they were previously grouped together.
      </p>
      <p className="text-xs text-gray-500 italic">
        This calculator is for informational purposes only and does not constitute medical advice.
        Always consult a qualified healthcare provider for guidance specific to your pregnancy.
      </p>
    </div>
  );

  const faqs = [
    {
      question: "How accurate is a due date?",
      answer:
        "Due dates are estimates — only about 4% of babies are born on their exact due date. Around 80% of births occur within two weeks before or after the date. The due date is best understood as the midpoint of a normal delivery window. First-trimester ultrasound is the most accurate dating tool, with a margin of error of only ±5–7 days.",
    },
    {
      question: "What\'s the difference between gestational age and fetal age?",
      answer:
        "Gestational age counts from the first day of your last menstrual period (LMP), which is typically about 2 weeks before conception actually occurred. Fetal age (also called fertilization age) counts from conception. Doctors and ultrasounds always use gestational age, which is why a \'positive pregnancy test at 4 weeks\' means the embryo is really only about 2 weeks old.",
    },
    {
      question: "Can I calculate my due date without knowing my LMP?",
      answer:
        "Yes. If you know your conception date, add 266 days (38 weeks). If you had an IVF transfer, use the embryo transfer date with the appropriate offset (261 days for 5-day blastocyst, 263 days for 3-day embryo). A first-trimester ultrasound can also date the pregnancy independently using crown-rump length measurements.",
    },
    {
      question: "When should I see a doctor after a positive pregnancy test?",
      answer:
        "Most providers recommend scheduling your first prenatal appointment between 8–10 weeks gestation. However, if you have a history of miscarriage, ectopic pregnancy, or fertility treatment, your provider may want to see you sooner — sometimes as early as 6 weeks for a viability ultrasound.",
    },
    {
      question: "What does \'full term\' mean?",
      answer:
        "Full term means 39 weeks 0 days through 40 weeks 6 days of gestation. This definition was updated in 2013 — 37–38 weeks is now called \'early term,\' not simply \'term.\' Babies born in the early term window have higher rates of breathing difficulties, feeding problems, and NICU admission than babies born at 39+ weeks, even though they were previously considered \'term.\'",
    },
  ];

  const relatedCalculators = [
    { name: "Ovulation Calculator", href: "/calculators/health/ovulation-calculator" },
    { name: "Age Calculator", href: "/calculators/date/age-calculator" },
    { name: "Water Intake Calculator", href: "/calculators/health/water-intake-calculator" },
  ];

  return (
    <CalculatorLayout
      title="Pregnancy Due Date Calculator"
      subtitle="Estimate your due date from LMP, conception date, or IVF transfer"
      explanation={explanation}
      faqs={faqs}
      relatedCalculators={relatedCalculators}
    >
      <Breadcrumbs items={breadcrumbs} />

      {/* Tab Selector */}
      <div className="mb-6 flex gap-2 flex-wrap">
        {[
          { id: "lmp", label: "Last Menstrual Period" },
          { id: "conception", label: "Conception Date" },
          { id: "ivf", label: "IVF Transfer Date" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as "lmp" | "conception" | "ivf")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? "bg-pink-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Card */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
          {activeTab === "lmp" && (
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  First Day of Last Menstrual Period
                </label>
                <input
                  type="date"
                  value={lmpDate}
                  onChange={(e) => setLmpDate(e.target.value)}
                  className="w-full border border-pink-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cycle Length: <span className="text-pink-600 font-semibold">{cycleLength} days</span>
                </label>
                <input
                  type="range"
                  min={21}
                  max={35}
                  value={cycleLength}
                  onChange={(e) => setCycleLength(Number(e.target.value))}
                  className="w-full accent-pink-600"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>21 days</span>
                  <span>28 days</span>
                  <span>35 days</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === "conception" && (
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Conception Date
                </label>
                <input
                  type="date"
                  value={conceptionDate}
                  onChange={(e) => setConceptionDate(e.target.value)}
                  className="w-full border border-purple-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 text-xs text-purple-700">
                Due date = conception date + 266 days (38 weeks)
              </div>
            </div>
          )}

          {activeTab === "ivf" && (
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  IVF Embryo Transfer Date
                </label>
                <input
                  type="date"
                  value={ivfTransferDate}
                  onChange={(e) => setIvfTransferDate(e.target.value)}
                  className="w-full border border-blue-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Embryo Age at Transfer
                </label>
                <div className="flex gap-3">
                  {([3, 5] as const).map((age) => (
                    <button
                      key={age}
                      onClick={() => setEmbryoAge(age)}
                      className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-colors ${
                        embryoAge === age
                          ? "bg-blue-600 text-white border-blue-600"
                          : "bg-white text-gray-700 border-gray-300 hover:border-blue-400"
                      }`}
                    >
                      {age}-day embryo{age === 5 ? " (blastocyst)" : ""}
                    </button>
                  ))}
                </div>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs text-blue-700 space-y-1">
                <div>5-day blastocyst: transfer date + 261 days</div>
                <div>3-day embryo: transfer date + 263 days</div>
              </div>
            </div>
          )}

          <button
            onClick={calculate}
            className="mt-6 w-full bg-pink-600 hover:bg-pink-700 text-white font-semibold py-3 rounded-lg transition-colors"
          >
            Calculate Due Date
          </button>
        </div>

        {/* Right Card */}
        <div id="results" className="space-y-4">
          {result ? (
            <>
              {/* Due Date */}
              <div className="bg-pink-600 text-white rounded-xl p-5">
                <div className="text-xs font-medium uppercase tracking-wide opacity-80 mb-1">
                  Estimated Due Date
                </div>
                <div className="text-2xl font-bold">{formatDate(result.dueDate)}</div>
                <div className="text-sm opacity-80 mt-1">
                  {result.dueDate.toLocaleDateString("en-US", { weekday: "long" })}
                </div>
              </div>

              {/* Gestational Age */}
              {result.isPregnant && (
                <div className="bg-purple-50 border-2 border-purple-200 rounded-xl p-4">
                  <div className="text-xs font-medium text-purple-600 uppercase tracking-wide mb-1">
                    Gestational Age
                  </div>
                  <div className="text-xl font-bold text-purple-800">
                    {result.gestWeeks} weeks and {result.gestDaysRemainder} days
                  </div>
                </div>
              )}

              {/* Trimester */}
              <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
                <div className="text-xs font-medium text-blue-600 uppercase tracking-wide mb-1">
                  Current Stage
                </div>
                <div className="text-xl font-bold text-blue-800">
                  {result.isPregnant ? `Trimester ${result.trimester}` : "Outside active pregnancy window"}
                </div>
              </div>

              {/* Progress Bar */}
              {result.isPregnant && (
                <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-200">
                  <div className="text-xs font-medium text-gray-600 mb-2">Pregnancy Progress</div>
                  <div className="bg-gray-100 rounded-full h-3 overflow-hidden">
                    <div
                      className="bg-pink-500 h-3 rounded-full transition-all"
                      style={{ width: `${result.progressPct}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>0 weeks</span>
                    <span>
                      {result.gestWeeks}w {result.gestDaysRemainder}d
                    </span>
                    <span>40 weeks</span>
                  </div>
                </div>
              )}

              {/* Medical Disclaimer */}
              <div className="text-xs text-gray-400 italic text-center px-2">
                This is an estimate only. Consult your healthcare provider for medical advice.
              </div>
            </>
          ) : (
            <div className="h-full flex items-center justify-center bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 p-8 text-center text-gray-400 text-sm">
              Enter your date above and click Calculate to see your results.
            </div>
          )}
        </div>
      </div>

      {/* Milestones Timeline */}
      {result && (
        <>
          <div className="mt-6 bg-white rounded-xl shadow-md p-6 border border-gray-200">
            <h3 className="text-sm font-semibold text-gray-700 mb-4">Key Pregnancy Milestones</h3>
            <div className="space-y-3">
              {result.milestones.map((m, i) => {
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                const isPast = m.date < today;
                const isCurrent =
                  !isPast && i > 0 && result.milestones[i - 1]?.date <= today;
                return (
                  <div
                    key={i}
                    className={`flex items-center gap-3 p-3 rounded-lg ${
                      isPast
                        ? "bg-gray-50 opacity-60"
                        : isCurrent
                        ? "bg-pink-50 border border-pink-200"
                        : "bg-white border border-gray-100"
                    }`}
                  >
                    <div
                      className={`w-3 h-3 rounded-full shrink-0 ${
                        isPast
                          ? "bg-gray-400"
                          : isCurrent
                          ? "bg-pink-500"
                          : "bg-gray-200"
                      }`}
                    />
                    <span className="text-sm text-gray-700 flex-1">{m.label}</span>
                    <span className="text-sm font-medium text-gray-600">
                      {formatShort(m.date)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Trimester Visual Bar */}
          <div className="mt-6 bg-white rounded-xl shadow-md p-6 border border-gray-200">
            <h3 className="text-sm font-semibold text-gray-700 mb-4">Pregnancy Timeline</h3>
            <div className="flex gap-1 rounded-lg overflow-hidden h-8">
              <div className="flex-1 bg-green-400 flex items-center justify-center text-xs font-bold text-white">
                T1 (Wk 1–13)
              </div>
              <div className="flex-[1.07] bg-blue-400 flex items-center justify-center text-xs font-bold text-white">
                T2 (Wk 14–27)
              </div>
              <div className="flex-1 bg-purple-400 flex items-center justify-center text-xs font-bold text-white">
                T3 (Wk 28–40)
              </div>
            </div>
            {result.isPregnant && (
              <div className="mt-2 text-xs text-gray-500 text-center">
                Currently in Trimester {result.trimester} — Week {result.gestWeeks}
              </div>
            )}
          </div>
        </>
      )}
    </CalculatorLayout>
  );
}
