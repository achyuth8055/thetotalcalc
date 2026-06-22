"use client";
import { useState, useMemo } from "react";
import Breadcrumbs from "@/components/Breadcrumbs";
import CalculatorLayout from "@/components/CalculatorLayout";

function getDefaultBirthdate(): string {
  const d = new Date();
  d.setDate(d.getDate() - 10000);
  return d.toISOString().split("T")[0];
}

function getDayOfWeek(dateStr: string): string {
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  return days[new Date(dateStr + "T12:00:00").getDay()];
}

function getSeason(dateStr: string): string {
  const month = new Date(dateStr + "T12:00:00").getMonth() + 1;
  if (month >= 3 && month <= 5) return "Spring 🌸";
  if (month >= 6 && month <= 8) return "Summer ☀️";
  if (month >= 9 && month <= 11) return "Autumn 🍂";
  return "Winter ❄️";
}

function nextMilestone(daysAlive: number, step: number): number {
  return Math.ceil(daysAlive / step) * step;
}

export default function DaysAliveCalculator() {
  const [birthdate, setBirthdate] = useState(getDefaultBirthdate());

  const stats = useMemo(() => {
    if (!birthdate) return null;
    const birth = new Date(birthdate + "T00:00:00");
    const now = new Date();
    const diffMs = now.getTime() - birth.getTime();
    if (diffMs < 0) return null;

    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const minutes = Math.floor(diffMs / (1000 * 60));
    const seconds = Math.floor(diffMs / 1000);
    const weeks = Math.floor(days / 7);
    const months = Math.floor(days / 30.4375);

    // Age in years, months, days
    let ageYears = now.getFullYear() - birth.getFullYear();
    let ageMonths = now.getMonth() - birth.getMonth();
    let ageDays = now.getDate() - birth.getDate();
    if (ageDays < 0) { ageMonths--; ageDays += 30; }
    if (ageMonths < 0) { ageYears--; ageMonths += 12; }

    // Next birthday
    const nextBday = new Date(now.getFullYear(), birth.getMonth(), birth.getDate());
    if (nextBday <= now) nextBday.setFullYear(now.getFullYear() + 1);
    const daysUntilBday = Math.ceil((nextBday.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    // Milestones
    const next10k = nextMilestone(days, 10000);
    const next5k = nextMilestone(days, 5000);
    const daysTo10k = next10k - days;
    const daysTo5k = next5k - days;

    // Heartbeats
    const heartbeats = Math.floor(days * 24 * 60 * 70);

    return {
      days, hours, minutes, seconds, weeks, months,
      ageYears, ageMonths, ageDays,
      daysUntilBday, next10k, next5k, daysTo10k, daysTo5k,
      dayOfWeek: getDayOfWeek(birthdate),
      season: getSeason(birthdate),
      heartbeats,
    };
  }, [birthdate]);

  const milestoneAchieved = stats && stats.days >= 10000 && stats.days % 10000 < 100;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumbs items={[
        { label: "Lifestyle Calculators", href: "/lifestyle-calculators" },
        { label: "Days Alive Calculator", href: "/calculators/lifestyle/days-alive-calculator" },
      ]} />

      <div className="mb-6 flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Days Alive Calculator</h1>
          <p className="text-base text-gray-600">Discover exactly how many days, hours, minutes, and seconds you've been alive — and what milestones await.</p>
        </div>
        <button onClick={() => window.print()} className="print:hidden flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg">
          ↓ PDF
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        {/* Input */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Enter Your Birthday</h2>
          <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
          <input
            type="date"
            value={birthdate}
            max={new Date().toISOString().split("T")[0]}
            onChange={(e) => setBirthdate(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {stats && (
            <div className="mt-4 space-y-2 text-sm text-gray-600">
              <div className="flex justify-between"><span>Born on a:</span><span className="font-semibold text-gray-800">{stats.dayOfWeek}</span></div>
              <div className="flex justify-between"><span>Season of birth:</span><span className="font-semibold text-gray-800">{stats.season}</span></div>
            </div>
          )}
        </div>

        {/* Big counter */}
        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl shadow-sm p-6 text-white">
          <p className="text-blue-200 text-sm font-medium uppercase tracking-wide mb-1">You have been alive for</p>
          {stats ? (
            <>
              <div className="text-5xl font-extrabold mb-1">{stats.days.toLocaleString()}</div>
              <div className="text-blue-200 text-lg font-medium mb-4">DAYS</div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="bg-white/10 rounded-xl p-3">
                  <div className="text-white/70">Hours</div>
                  <div className="font-bold text-base">{stats.hours.toLocaleString()}</div>
                </div>
                <div className="bg-white/10 rounded-xl p-3">
                  <div className="text-white/70">Minutes</div>
                  <div className="font-bold text-base">{stats.minutes.toLocaleString()}</div>
                </div>
                <div className="bg-white/10 rounded-xl p-3">
                  <div className="text-white/70">Weeks</div>
                  <div className="font-bold text-base">{stats.weeks.toLocaleString()}</div>
                </div>
                <div className="bg-white/10 rounded-xl p-3">
                  <div className="text-white/70">Months</div>
                  <div className="font-bold text-base">{stats.months.toLocaleString()}</div>
                </div>
              </div>
            </>
          ) : (
            <div className="text-blue-200">Enter your birthday to see your stats!</div>
          )}
        </div>
      </div>

      {stats && (
        <>
          {/* Age breakdown + milestones */}
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Your Exact Age</h2>
              <div className="text-3xl font-bold text-blue-600 mb-1">
                {stats.ageYears} yrs, {stats.ageMonths} mo, {stats.ageDays} days
              </div>
              <p className="text-sm text-gray-500 mt-1">Approximate seconds alive: <span className="font-semibold text-gray-700">{stats.seconds.toLocaleString()}</span></p>
              <p className="text-sm text-gray-500 mt-1">Estimated heartbeats: <span className="font-semibold text-gray-700">{stats.heartbeats.toLocaleString()}</span></p>
              <div className="mt-4 p-3 bg-pink-50 rounded-xl border border-pink-100">
                <p className="text-sm text-pink-700">🎂 Next birthday in <strong>{stats.daysUntilBday} days</strong></p>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">🏆 Day Milestones</h2>
              <div className="space-y-3">
                {stats.days >= 10000 && (
                  <div className="p-3 bg-yellow-50 rounded-xl border border-yellow-200">
                    <p className="text-sm font-semibold text-yellow-800">🎉 You've passed 10,000 days!</p>
                  </div>
                )}
                {stats.days >= 5000 && (
                  <div className="p-3 bg-green-50 rounded-xl border border-green-200">
                    <p className="text-sm font-semibold text-green-800">✅ You've passed 5,000 days!</p>
                  </div>
                )}
                <div className="flex justify-between text-sm p-2 bg-gray-50 rounded-lg">
                  <span className="text-gray-600">Next 5,000-day mark:</span>
                  <span className="font-semibold">{stats.next5k.toLocaleString()} days <span className="text-gray-400">(in {stats.daysTo5k} days)</span></span>
                </div>
                <div className="flex justify-between text-sm p-2 bg-gray-50 rounded-lg">
                  <span className="text-gray-600">Next 10,000-day mark:</span>
                  <span className="font-semibold">{stats.next10k.toLocaleString()} days <span className="text-gray-400">(in {stats.daysTo10k} days)</span></span>
                </div>
                <div className="flex justify-between text-sm p-2 bg-gray-50 rounded-lg">
                  <span className="text-gray-600">1,000,000 days would be:</span>
                  <span className="font-semibold text-gray-500">~2,739 years</span>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      <CalculatorLayout
        title=""
        description=""
        explanation={
          <div className="space-y-4 text-sm text-gray-700 leading-relaxed">
            <h2 className="text-xl font-bold text-gray-900">The Surprising Math of Your Life</h2>
            <p>
              Most of us think about our age in years — a blunt, rounded unit that doesn't quite capture the remarkable specificity of a human life. But the moment you switch from years to days, something changes. Suddenly, your life isn't an abstract number like "31" but a vivid tally: 11,315 days of sunrises, meals, conversations, and choices. That specificity matters.
            </p>
            <p>
              Malcolm Gladwell popularized the idea of 10,000 hours of deliberate practice as the threshold for world-class mastery in his book <em>Outliers</em>. A 10,000-hour commitment, pursued at three hours per day, takes roughly nine years. Interestingly, 10,000 days — a common life milestone around age 27 — is the moment many people are just beginning to feel like competent adults. You've been alive approximately 10,000-hour-equivalents of practice just by living. Imagine what you've implicitly mastered simply through existing.
            </p>
            <p>
              The Stoic philosophers — Marcus Aurelius, Seneca, Epictetus — were obsessed with the finite nature of time. Seneca wrote in <em>Letters to Lucilius</em>: "Omnia aliena sunt, tempus tantum nostrum est" — Everything is alien to us; time alone is ours. The practice of <em>memento mori</em> (remember that you must die) was not morbid but motivational. Contemplating the countdown of days was meant to ignite urgency, not despair. When you know approximately how many days you've used, the remaining days sharpen in focus.
            </p>
            <p>
              The oldest confirmed human being in recorded history was Jeanne Louise Calment of France, who died in 1997 at the extraordinary age of 122 years and 164 days — a total of approximately 44,724 days. For context, she was born in 1875, before the automobile, before electricity was widespread, before commercial flight was even imagined. The regions associated with exceptional longevity — Sardinia in Italy, Okinawa in Japan, Nicoya Peninsula in Costa Rica, the Seventh-day Adventist community in Loma Linda, California, and Ikaria in Greece — are collectively called the Blue Zones. Residents of these areas frequently reach their 90s and beyond in good health. Their common traits: plant-heavy diets, daily movement, strong social bonds, and a sense of purpose or <em>ikigai</em>.
            </p>
            <p>
              The average resting heart rate is about 70 beats per minute. That means in a single day, your heart beats approximately 100,800 times. Multiply that by your days alive and you get a staggering number — likely in the billions. Your heart has never once asked for permission to keep going. It simply does.
            </p>
            <p>
              Birthdays are a culturally specific construct. In the traditional Korean age system (<em>nai</em>), a baby is considered one year old at birth — because the nine months of pregnancy count — and everyone gains a year on New Year's Day rather than on their personal birthday. Under this system, a baby born on December 31st would be two years old on January 1st, just two days after birth. South Korea officially adopted the international age-counting system in June 2023, but the traditional system is still widely understood.
            </p>
            <p>
              The day of the week you were born can be calculated algorithmically using the Doomsday algorithm, invented by mathematician John Conway. The algorithm exploits the fact that certain memorable dates within a year — 4/4, 6/6, 8/8, 10/10, 12/12, and the last day of February — all fall on the same day of the week in any given year (the "Doomsday" for that year). By anchoring to that day, you can quickly calculate any date's weekday in your head. Our calculator does this automatically.
            </p>
            <p>
              If you could somehow live for 1,000,000 days, that would be approximately 2,739 years — meaning you'd have been born around 714 AD and would currently be watching the modern world emerge from the Middle Ages. The absurdity of that number makes your actual count — whatever it is — feel both humble and precious. Use this calculator not as a countdown clock, but as a reminder that each day recorded here was a day actually lived.
            </p>
          </div>
        }
        faqs={[
          {
            question: "How many days are in a year?",
            answer: "A standard year has 365 days. A leap year — which occurs every 4 years, except for century years not divisible by 400 — has 366 days. On average, a year is 365.2425 days. Our calculator accounts for leap years in its calculations."
          },
          {
            question: "What day of the week was I born?",
            answer: "Our calculator tells you instantly. Mathematically, you can use the Doomsday algorithm, invented by John Conway, which exploits the fact that certain anchor dates in every year fall on the same weekday. For most people, the calculator is far faster than doing it by hand."
          },
          {
            question: "How many days until I'm 10,000 days old?",
            answer: "Enter your birthdate and the calculator will show your next 10,000-day milestone under the 'Day Milestones' section. The 10,000-day mark falls at roughly age 27 years and 4 months. Many people celebrate this milestone the same way they'd celebrate a round birthday."
          },
          {
            question: "What is the oldest anyone has ever lived?",
            answer: "The oldest verified human life belongs to Jeanne Calment of Arles, France, who lived to 122 years and 164 days (1875–1997), totaling approximately 44,724 days. She rode a bicycle until age 100 and attributed her longevity to olive oil, port wine, and chocolate."
          },
          {
            question: "Is my age the same in all cultures?",
            answer: "No. The traditional Korean age system considers a newborn to be one year old at birth and adds another year on New Year's Day. East Asian reckoning has historically counted the year of birth as 'year one.' South Korea officially moved to the international system in 2023, but cultural differences in how age is perceived persist worldwide."
          },
        ]}
        relatedCalculators={[
          { name: "Age Calculator", href: "/calculators/date/age-calculator" },
          { name: "Date Difference Calculator", href: "/calculators/date/date-difference-calculator" },
          { name: "Countdown Calculator", href: "/calculators/date/countdown-calculator" },
        ]}
      >
        <div />
      </CalculatorLayout>
    </div>
  );
}
