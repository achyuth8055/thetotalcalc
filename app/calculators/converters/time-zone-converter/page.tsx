"use client";
import { useState, useMemo } from "react";
import Breadcrumbs from "@/components/Breadcrumbs";
import CalculatorLayout from "@/components/CalculatorLayout";

interface TZDef {
  label: string;
  city: string;
  offsetStd: number; // standard offset hours from UTC
  offsetDST: number; // DST offset hours from UTC
  hasDST: boolean;
}

// DST in Northern Hemisphere: second Sunday in March to first Sunday in November (US)
// DST in Southern Hemisphere (Australia): first Sunday in October to first Sunday in April
function isDSTNorth(date: Date): boolean {
  const year = date.getFullYear();
  // Second Sunday in March
  const marchStart = new Date(year, 2, 1);
  const marchDay = (14 - marchStart.getDay()) % 7 + 7;
  const dstStart = new Date(year, 2, marchDay, 2);
  // First Sunday in November
  const novStart = new Date(year, 10, 1);
  const novDay = (7 - novStart.getDay()) % 7 + 1;
  const dstEnd = new Date(year, 10, novDay, 2);
  return date >= dstStart && date < dstEnd;
}

function isDSTEurope(date: Date): boolean {
  const year = date.getFullYear();
  // Last Sunday in March
  const marchEnd = new Date(year, 2, 31);
  const marchSun = 31 - marchEnd.getDay();
  const dstStart = new Date(year, 2, marchSun, 1);
  // Last Sunday in October
  const octEnd = new Date(year, 9, 31);
  const octSun = 31 - octEnd.getDay();
  const dstEnd = new Date(year, 9, octSun, 1);
  return date >= dstStart && date < dstEnd;
}

function isDSTAustralia(date: Date): boolean {
  const year = date.getFullYear();
  // First Sunday in October
  const octStart = new Date(year, 9, 1);
  const octDay = (7 - octStart.getDay()) % 7 + 1;
  const dstStart = new Date(year, 9, octDay, 2);
  // First Sunday in April
  const aprStart = new Date(year, 3, 1);
  const aprDay = (7 - aprStart.getDay()) % 7 + 1;
  const dstEnd = new Date(year, 3, aprDay, 3);
  return date >= dstStart || date < dstEnd;
}

const TIMEZONES: TZDef[] = [
  { label: "UTC", city: "UTC", offsetStd: 0, offsetDST: 0, hasDST: false },
  { label: "EST/EDT", city: "New York", offsetStd: -5, offsetDST: -4, hasDST: true },
  { label: "CST/CDT", city: "Chicago", offsetStd: -6, offsetDST: -5, hasDST: true },
  { label: "MST/MDT", city: "Denver", offsetStd: -7, offsetDST: -6, hasDST: true },
  { label: "PST/PDT", city: "Los Angeles", offsetStd: -8, offsetDST: -7, hasDST: true },
  { label: "AKST/AKDT", city: "Anchorage", offsetStd: -9, offsetDST: -8, hasDST: true },
  { label: "HST", city: "Honolulu", offsetStd: -10, offsetDST: -10, hasDST: false },
  { label: "GMT/BST", city: "London", offsetStd: 0, offsetDST: 1, hasDST: true },
  { label: "CET/CEST", city: "Paris", offsetStd: 1, offsetDST: 2, hasDST: true },
  { label: "EET/EEST", city: "Athens", offsetStd: 2, offsetDST: 3, hasDST: true },
  { label: "MSK", city: "Moscow", offsetStd: 3, offsetDST: 3, hasDST: false },
  { label: "GST", city: "Dubai", offsetStd: 4, offsetDST: 4, hasDST: false },
  { label: "IST", city: "Mumbai", offsetStd: 5.5, offsetDST: 5.5, hasDST: false },
  { label: "BST", city: "Dhaka", offsetStd: 6, offsetDST: 6, hasDST: false },
  { label: "ICT", city: "Bangkok", offsetStd: 7, offsetDST: 7, hasDST: false },
  { label: "CST", city: "Beijing", offsetStd: 8, offsetDST: 8, hasDST: false },
  { label: "HKT", city: "Hong Kong", offsetStd: 8, offsetDST: 8, hasDST: false },
  { label: "SGT", city: "Singapore", offsetStd: 8, offsetDST: 8, hasDST: false },
  { label: "JST", city: "Tokyo", offsetStd: 9, offsetDST: 9, hasDST: false },
  { label: "AEST/AEDT", city: "Sydney", offsetStd: 10, offsetDST: 11, hasDST: true },
  { label: "NZST/NZDT", city: "Auckland", offsetStd: 12, offsetDST: 13, hasDST: true },
  { label: "BRT", city: "São Paulo", offsetStd: -3, offsetDST: -3, hasDST: false },
  { label: "CAT", city: "Nairobi", offsetStd: 3, offsetDST: 3, hasDST: false },
];

const EU_ZONES = new Set(["GMT/BST", "CET/CEST", "EET/EEST"]);
const AU_ZONES = new Set(["AEST/AEDT", "NZST/NZDT"]);
const NZ_ZONES = new Set(["NZST/NZDT"]);

function getOffset(tz: TZDef, date: Date): number {
  if (!tz.hasDST) return tz.offsetStd;
  if (EU_ZONES.has(tz.label)) return isDSTEurope(date) ? tz.offsetDST : tz.offsetStd;
  if (AU_ZONES.has(tz.label)) return isDSTAustralia(date) ? tz.offsetDST : tz.offsetStd;
  return isDSTNorth(date) ? tz.offsetDST : tz.offsetStd;
}

function pad2(n: number) { return n.toString().padStart(2, "0"); }

export default function TimeZoneConverter() {
  const today = new Date().toISOString().split("T")[0];
  const nowH = new Date().getHours();
  const nowM = new Date().getMinutes();

  const [sourceTime, setSourceTime] = useState(`${pad2(nowH)}:${pad2(nowM)}`);
  const [sourceDate, setSourceDate] = useState(today);
  const [sourceTZ, setSourceTZ] = useState("EST/EDT");

  const conversions = useMemo(() => {
    const [h, m] = sourceTime.split(":").map(Number);
    if (isNaN(h) || isNaN(m)) return [];

    const refDate = new Date(sourceDate + "T12:00:00");
    const srcDef = TIMEZONES.find((tz) => tz.label === sourceTZ) || TIMEZONES[1];
    const srcOffset = getOffset(srcDef, refDate);

    // Convert source to UTC
    const srcTotalMins = h * 60 + m;
    const utcMins = srcTotalMins - srcOffset * 60;

    return TIMEZONES.map((tz) => {
      const dstOff = getOffset(tz, refDate);
      const localMins = utcMins + dstOff * 60;
      const dayOffset = Math.floor(localMins / (24 * 60));
      const mins = ((localMins % (24 * 60)) + 24 * 60) % (24 * 60);
      const lh = Math.floor(mins / 60);
      const lm = mins % 60;
      const timeStr = `${pad2(lh)}:${pad2(lm)}`;
      const dayBadge = dayOffset > 0 ? "+1 day" : dayOffset < 0 ? "-1 day" : "";
      return { tz, timeStr, dayBadge, offset: dstOff };
    });
  }, [sourceTime, sourceDate, sourceTZ]);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumbs items={[
        { label: "Converters", href: "/converters" },
        { label: "Time Zone Converter", href: "/calculators/converters/time-zone-converter" },
      ]} />

      <div className="mb-6 flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Time Zone Converter</h1>
          <p className="text-base text-gray-600">Convert any time to all major world time zones instantly. DST-aware.</p>
        </div>
        <button onClick={() => window.print()} className="print:hidden flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg">
          ↓ PDF
        </button>
      </div>

      {/* Input */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Source Time</h2>
        <div className="grid sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
            <input type="time" value={sourceTime} onChange={(e) => setSourceTime(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date (for DST)</label>
            <input type="date" value={sourceDate} onChange={(e) => setSourceDate(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Timezone</label>
            <select value={sourceTZ} onChange={(e) => setSourceTZ(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
              {TIMEZONES.map((tz) => (
                <option key={tz.label} value={tz.label}>{tz.city} ({tz.label})</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Results grid */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">All Time Zones</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {conversions.map(({ tz, timeStr, dayBadge }) => (
            <div
              key={tz.label}
              className={`flex items-center justify-between p-3 rounded-xl border ${tz.label === sourceTZ ? "border-blue-300 bg-blue-50" : "border-gray-100 bg-gray-50"}`}
            >
              <div>
                <div className="text-xs text-gray-500">{tz.city}</div>
                <div className="text-xs font-medium text-gray-400">{tz.label}</div>
              </div>
              <div className="text-right">
                <div className={`text-xl font-bold ${tz.label === sourceTZ ? "text-blue-700" : "text-gray-800"}`}>{timeStr}</div>
                {dayBadge && (
                  <span className="text-xs px-1.5 py-0.5 rounded bg-orange-100 text-orange-700 font-medium">{dayBadge}</span>
                )}
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
            <h2 className="text-xl font-bold text-gray-900">A Brief History of Time Zones</h2>
            <p>
              Before the railroad era, every town in the world set its clocks by the local position of the sun — "local apparent solar time." When it was noon in Philadelphia (when the sun was highest in the sky there), it was about 11:54 AM in Pittsburgh and 12:05 PM in New York. This caused no problems when travel was slow enough that nobody cared about 10-minute differences. But the railroad changed everything.
            </p>
            <p>
              By the 1880s, American railroads were running on over 50 different local times — a nightmare for scheduling and a cause of genuine safety hazards. On November 18, 1883, American railroads unilaterally standardized the continent into four time zones: Eastern, Central, Mountain, and Pacific. The public nicknamed it "railroad time." Congress didn't formally authorize time zones until the Standard Time Act of 1918 — the railroads had simply done it themselves 35 years earlier.
            </p>
            <p>
              One year later, in 1884, delegates from 25 nations gathered at the International Meridian Conference in Washington, D.C. and agreed that the Greenwich Meridian at the Royal Observatory in London would be the world's Prime Meridian — 0° longitude from which all time zones would be measured. The resulting system divides the globe into 24 standard time zones, each theoretically 15° of longitude wide (since 360° ÷ 24 hours = 15°/hour). In practice, political borders have distorted this considerably.
            </p>
            <p>
              The difference between <strong>UTC</strong> (Coordinated Universal Time) and <strong>GMT</strong> (Greenwich Mean Time) is subtle but important. GMT is based on Earth's rotation relative to the sun — an astronomical measurement. UTC is based on International Atomic Time (TAI), measured by a network of over 400 atomic clocks worldwide, periodically adjusted by "leap seconds" to stay within 0.9 seconds of solar time. For practical purposes, UTC and GMT differ by less than a second, but UTC is the official standard for global timekeeping.
            </p>
            <p>
              Daylight Saving Time (DST) was popularized during World War I as an energy-saving measure — shifting an hour of morning sunlight to the evening when people were more likely to be active supposedly reduced demand for artificial lighting. The energy savings have since been disputed by numerous studies. A 2008 study of Indiana (which only adopted DST statewide in 2006) found DST actually <em>increased</em> electricity consumption by 1%. The European Parliament voted in 2019 to abolish DST, but implementation has been stalled by disagreements over which permanent time to adopt.
            </p>
            <p>
              Not all time zones are offset by whole hours. India (+5:30), Sri Lanka (+5:30), Iran (+3:30), Afghanistan (+4:30), Myanmar (+6:30), and Nepal (+5:45) all use half-hour or quarter-hour offsets. Nepal's +5:45 is the only quarter-hour offset currently in regular use. These offsets were often adopted to split the difference between two whole-hour zones or to distinguish themselves from neighbors.
            </p>
            <p>
              China is remarkable for covering what would naturally be five time zones with a single national time (UTC+8), which was imposed by the Communist government in 1949 for reasons of national unity. In Xinjiang province in western China, the sun doesn't rise until 10 AM in winter — many locals informally use "Xinjiang time" (UTC+6) in their daily lives while official time is UTC+8. The International Date Line, running approximately along 180° longitude, is another political artifact — it zigzags around Kiribati, Samoa, and Tonga to keep entire nations on the same calendar day. Kiribati's Line Islands use UTC+14, the furthest ahead of any inhabited territory.
            </p>
            <p>
              Aviation and the military use Zulu time — another name for UTC. Every flight plan, air traffic control communication, and meteorological report worldwide uses UTC regardless of where the aircraft is located. The phonetic alphabet letter "Z" corresponds to Zulu, and the zero meridian passes through Greenwich — hence "Zulu time" became synonymous with UTC in aviation parlance. Understanding the longitude-time relationship (every 15° of longitude equals one hour of time difference) helps make sense of the entire global system.
            </p>
          </div>
        }
        faqs={[
          {
            question: "What is UTC and how is it different from GMT?",
            answer: "UTC (Coordinated Universal Time) is the primary time standard by which the world regulates clocks and time. It is based on International Atomic Time (TAI), maintained by over 400 atomic clocks worldwide. GMT (Greenwich Mean Time) is an older standard based on astronomical observation of Earth's rotation. For practical purposes they differ by less than one second, but UTC is the official global standard while GMT is now primarily a historical and meteorological term."
          },
          {
            question: "Why do clocks change for daylight saving time?",
            answer: "Daylight saving time was originally introduced during World War I to save energy by shifting an hour of morning sunlight to the evening. Modern research has largely debunked the energy savings rationale — a 2008 study in Indiana found DST actually increased electricity consumption. Other documented effects include disrupted sleep patterns and a small but measurable increase in heart attacks and traffic accidents in the days after the spring changeover. The European Parliament voted to abolish DST in 2019 but implementation has stalled."
          },
          {
            question: "What is the International Date Line?",
            answer: "The International Date Line runs approximately along the 180° meridian (opposite the Prime Meridian in Greenwich) in the Pacific Ocean, where the calendar date changes by one full day. Cross it heading west and you gain a day; cross it heading east and you lose a day. The line is not straight — it zigzags to keep island nations and their territories on the same calendar date, curving around Kiribati, Samoa, Tonga, and Fiji."
          },
          {
            question: "Which country has the most time zones?",
            answer: "France, when including all its overseas territories, has 12 time zones — the most of any country in the world. These range from UTC-10 (French Polynesia) to UTC+12 (Wallis and Futuna). Russia has 11 time zones across its contiguous territory — the most of any country within a single landmass. The United States has 6 standard time zones (and 9 if you count territories)."
          },
          {
            question: "What does 'Zulu time' mean in aviation?",
            answer: "Zulu time means UTC — Coordinated Universal Time. In the NATO phonetic alphabet, the letter Z is called 'Zulu,' and since UTC is denoted with a Z suffix (e.g., 14:30Z), it became known as Zulu time. All aviation worldwide — flight plans, ATC communications, weather forecasts, and NOTAMs — uses UTC/Zulu regardless of the local time zone. This eliminates confusion when coordinating flights across multiple time zones."
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
