"use client";
import { useState, useMemo } from "react";
import Breadcrumbs from "@/components/Breadcrumbs";
import CalculatorLayout from "@/components/CalculatorLayout";

type Mode = "si" | "iec";

interface Unit {
  label: string;
  labelIEC?: string;
  siBytes: number;   // bytes in SI (1000-based)
  iecBytes: number;  // bytes in IEC (1024-based)
  name: string;
  nameIEC?: string;
}

const UNITS: Unit[] = [
  { label: "Bit", name: "Bit", siBytes: 1 / 8, iecBytes: 1 / 8 },
  { label: "Byte", name: "Byte", siBytes: 1, iecBytes: 1 },
  { label: "KB", labelIEC: "KiB", name: "Kilobyte", nameIEC: "Kibibyte", siBytes: 1e3, iecBytes: 1024 },
  { label: "MB", labelIEC: "MiB", name: "Megabyte", nameIEC: "Mebibyte", siBytes: 1e6, iecBytes: 1024 ** 2 },
  { label: "GB", labelIEC: "GiB", name: "Gigabyte", nameIEC: "Gibibyte", siBytes: 1e9, iecBytes: 1024 ** 3 },
  { label: "TB", labelIEC: "TiB", name: "Terabyte", nameIEC: "Tebibyte", siBytes: 1e12, iecBytes: 1024 ** 4 },
  { label: "PB", labelIEC: "PiB", name: "Petabyte", nameIEC: "Pebibyte", siBytes: 1e15, iecBytes: 1024 ** 5 },
  { label: "EB", labelIEC: "EiB", name: "Exabyte", nameIEC: "Exbibyte", siBytes: 1e18, iecBytes: 1024 ** 6 },
];

function formatNum(n: number): string {
  if (n === 0) return "0";
  if (n < 0.000001) return n.toExponential(3);
  if (n < 0.001) return n.toPrecision(4);
  if (n < 1) return n.toPrecision(4);
  if (n >= 1e18) return n.toExponential(4);
  return n.toLocaleString("en-US", { maximumSignificantDigits: 7 });
}

export default function DataSizeConverter() {
  const [value, setValue] = useState(1);
  const [fromUnit, setFromUnit] = useState("GB");
  const [mode, setMode] = useState<Mode>("iec");

  const fromDef = UNITS.find((u) => u.label === fromUnit) || UNITS[4];

  const bytes = useMemo(() => {
    const bytesPer = mode === "si" ? fromDef.siBytes : fromDef.iecBytes;
    return value * bytesPer;
  }, [value, fromUnit, mode, fromDef]);

  const conversions = useMemo(() => {
    return UNITS.map((u) => {
      const bytesPer = mode === "si" ? u.siBytes : u.iecBytes;
      const converted = bytes / bytesPer;
      const label = mode === "iec" && u.labelIEC ? u.labelIEC : u.label;
      const name = mode === "iec" && u.nameIEC ? u.nameIEC : u.name;
      return { unit: u, label, name, value: converted };
    });
  }, [bytes, mode]);

  // Real-world references (based on GB value)
  const gbValue = bytes / 1e9;
  const references = useMemo(() => [
    { label: "Songs (5 MB each)", value: Math.floor(gbValue * 1000 / 5).toLocaleString() },
    { label: "Photos (4 MB each)", value: Math.floor(gbValue * 1000 / 4).toLocaleString() },
    { label: "HD video minutes (1.5 GB/hr)", value: Math.floor(gbValue / 1.5 * 60).toLocaleString() },
    { label: "eBooks (1 MB each)", value: Math.floor(gbValue * 1000).toLocaleString() },
    { label: "PDF documents (200 KB each)", value: Math.floor(gbValue * 1000 / 0.2).toLocaleString() },
  ], [gbValue]);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumbs items={[
        { label: "Converters", href: "/converters" },
        { label: "Data Size Converter", href: "/calculators/converters/data-size-converter" },
      ]} />

      <div className="mb-6 flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Data Size Converter</h1>
          <p className="text-base text-gray-600">Convert between bits, bytes, KB, MB, GB, TB, PB, and EB. Supports both SI (1000-based) and IEC (1024-based) standards.</p>
        </div>
        <button onClick={() => window.print()} className="print:hidden flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg">
          ↓ PDF
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        {/* Input */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Convert From</h2>

          {/* SI vs IEC toggle */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Standard</label>
            <div className="flex gap-2">
              <button
                onClick={() => setMode("si")}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${mode === "si" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
              >
                SI (1 KB = 1,000 B)
              </button>
              <button
                onClick={() => setMode("iec")}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${mode === "iec" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
              >
                IEC (1 KiB = 1,024 B)
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-1">
              {mode === "iec" ? "IEC 80000-13 standard (KiB, MiB, GiB). Windows and Linux use this." : "SI / metric standard (KB, MB, GB). Storage manufacturers use this."}
            </p>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Value</label>
            <input
              type="number"
              value={value}
              min={0}
              onChange={(e) => setValue(parseFloat(e.target.value) || 0)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-lg font-bold focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Unit</label>
            <div className="grid grid-cols-4 gap-2">
              {UNITS.map((u) => {
                const label = mode === "iec" && u.labelIEC ? u.labelIEC : u.label;
                return (
                  <button
                    key={u.label}
                    onClick={() => setFromUnit(u.label)}
                    className={`py-2 rounded-lg text-sm font-bold transition-colors ${fromUnit === u.label ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick presets */}
          <div>
            <label className="block text-xs text-gray-500 mb-1">Quick presets</label>
            <div className="flex flex-wrap gap-2">
              {[
                { v: 1, u: "KB" }, { v: 1, u: "MB" }, { v: 1, u: "GB" },
                { v: 500, u: "GB" }, { v: 1, u: "TB" }, { v: 8, u: "GB" },
              ].map(({ v, u }) => (
                <button
                  key={`${v}${u}`}
                  onClick={() => { setValue(v); setFromUnit(u); }}
                  className="text-xs px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded text-gray-600"
                >
                  {v} {u}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Real-world references */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Real-World Capacity</h2>
          <p className="text-xs text-gray-500 mb-3">Approximate storage equivalents for <strong>{value} {mode === "iec" && fromDef.labelIEC ? fromDef.labelIEC : fromDef.label}</strong>:</p>
          <div className="space-y-3">
            {references.map(({ label, value: v }) => (
              <div key={label} className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                <span className="text-sm text-gray-600">{label}</span>
                <span className="font-bold text-gray-800 text-sm">{v}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 p-3 bg-yellow-50 rounded-xl border border-yellow-100">
            <p className="text-xs text-yellow-800">
              <strong>Why your 1 TB drive shows 931 GB in Windows:</strong> Manufacturers define 1 TB as 1,000,000,000,000 bytes (SI). Windows displays in GiB (1,073,741,824 bytes each). 1,000,000,000,000 ÷ 1,073,741,824 = 931 GiB.
            </p>
          </div>
        </div>
      </div>

      {/* All conversions table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          All Conversions — {value} {mode === "iec" && fromDef.labelIEC ? fromDef.labelIEC : fromDef.label}
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {conversions.map(({ unit, label, name, value: v }) => (
            <div
              key={unit.label}
              className={`p-3 rounded-xl border ${unit.label === fromUnit ? "border-blue-300 bg-blue-50" : "border-gray-100 bg-gray-50"}`}
            >
              <div className="text-xs text-gray-500 mb-1">{name}</div>
              <div className={`font-bold text-sm ${unit.label === fromUnit ? "text-blue-700" : "text-gray-800"}`}>
                {formatNum(v)} {label}
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
            <h2 className="text-xl font-bold text-gray-900">The Hidden Confusion in Digital Storage</h2>
            <p>
              Every year, millions of consumers buy a "1 terabyte" hard drive and feel vaguely cheated when their computer reports it as 931 gigabytes. Nobody stole 69 gigabytes. The discrepancy is entirely a matter of definitions — and understanding it requires knowing the difference between two competing standards that the technology industry has stubbornly refused to fully reconcile.
            </p>
            <p>
              Storage manufacturers define their capacities in <strong>SI (International System) units</strong>, where 1 kilobyte = exactly 1,000 bytes, 1 megabyte = 1,000,000 bytes, and 1 terabyte = exactly 1,000,000,000,000 bytes. This is mathematically clean and matches the metric system. However, computer engineers working with binary systems found it more natural to use powers of 2: 2¹⁰ = 1,024 bytes was called a "kilobyte," 2²⁰ = 1,048,576 bytes was called a "megabyte," and so on. Operating systems like Windows still report file sizes and storage capacity in these binary multiples, even though they label them "GB" rather than the technically correct "GiB." The result: a 1 TB drive (1 × 10¹²  bytes) divided by 1,073,741,824 bytes/GiB equals approximately 931 GiB — which Windows labels as 931 GB.
            </p>
            <p>
              To eliminate this ambiguity, the International Electrotechnical Commission (IEC) introduced a new set of prefixes in 1998 under the IEC 80000-13 standard: kibibyte (KiB) for 1,024 bytes, mebibyte (MiB) for 1,048,576 bytes, gibibyte (GiB) for 1,073,741,824 bytes, and so forth. Linux adopted these prefixes widely, and macOS switched to SI definitions (matching manufacturer labels) starting with macOS Snow Leopard in 2009, which is why Mac users typically see a 1 TB drive as approximately 1 TB — their OS uses the same definition as the manufacturer.
            </p>
            <p>
              The explosive growth of data in the modern era has made these distinctions more significant than ever. According to IDC projections, the amount of data created, captured, copied, and consumed globally was on pace to reach approximately 120 zettabytes annually by 2025. One zettabyte is 10²¹ bytes — a trillion gigabytes. The entire early internet's indexed content in 2000 was estimated at around one exabyte (one billion gigabytes). We now create that much data every few hours.
            </p>
            <p>
              Network speeds and storage sizes use different units, which causes widespread confusion. When your internet provider advertises "100 Mbps," that is 100 megabits per second — not megabytes. Since there are 8 bits in a byte, your maximum download speed in megabytes is 100 ÷ 8 = 12.5 MB/s. A 4 GB file download at 12.5 MB/s would take about 320 seconds — roughly five minutes. This is why downloading a large game feels slower than the advertised connection speed suggests.
            </p>
            <p>
              Streaming services have become one of the largest consumers of bandwidth and storage. Netflix uses approximately 0.7 GB per hour for standard definition, 3 GB per hour for HD (1080p), and 7 GB per hour for Ultra HD 4K. At an average of 4.5 hours of TV watched daily per American household, Netflix and similar services account for a substantial fraction of global internet traffic — Sandvine estimated streaming video represented over 65% of downstream internet traffic in North America in recent years.
            </p>
            <p>
              At the cutting edge of storage research, scientists are investigating DNA as an archival medium. DNA data storage encodes information in the four nucleotide bases (A, T, G, C), with each base representing approximately 2 bits. In theory, one gram of DNA can hold approximately 215 petabytes of information — roughly 215 million gigabytes. The challenge is the cost and speed of synthesizing and reading DNA sequences, which remain orders of magnitude slower and more expensive than conventional storage. But researchers at Microsoft and the University of Washington have demonstrated reading and writing of small amounts of data in DNA, and the longevity of the medium — DNA can survive thousands of years under the right conditions — makes it compelling for deep archival storage.
            </p>
            <p>
              Compression is the other major dimension of storage efficiency. Lossless compression (ZIP, FLAC audio, PNG images) reduces file size without discarding any information — every bit can be perfectly reconstructed. Lossy compression (MP3, JPEG, H.264 video) achieves much higher compression ratios by discarding information the human perceptual system is unlikely to notice. A 40 MB raw WAV audio file typically compresses to 3–5 MB as an MP3 at 192 kbps — a 90% size reduction at a quality level most listeners cannot distinguish from the original. Understanding what level of compression is appropriate for your use case is often more practically important than understanding the unit conversions themselves.
            </p>
          </div>
        }
        faqs={[
          {
            question: "Why does my 1 TB hard drive show only 931 GB in Windows?",
            answer: "Drive manufacturers define 1 TB as exactly 1,000,000,000,000 bytes (SI/metric definition). Windows reports storage in gibibytes (GiB), where 1 GiB = 1,073,741,824 bytes (IEC/binary definition). Dividing 1 trillion bytes by 1,073,741,824 gives approximately 931 — so Windows correctly reports 931 GiB but misleadingly labels it 'GB.' No data is missing; it is purely a labeling difference. macOS switched to SI definitions in 2009, so Macs show 1 TB drives as approximately 1 TB."
          },
          {
            question: "What is the difference between Mbps and MB?",
            answer: "Mbps stands for megabits per second — a unit of network bandwidth or transfer speed. MB stands for megabytes — a unit of data storage size. Since there are 8 bits in a byte, 1 MB = 8 Mb. So a 100 Mbps internet connection can theoretically download data at 12.5 MB/s. When comparing internet speed advertisements (in Mbps) with file sizes (in MB or GB), always divide the Mbps figure by 8 to get your download speed in MB/s."
          },
          {
            question: "How many GB does Netflix streaming use per hour?",
            answer: "Netflix data usage varies by quality setting: Standard Definition uses approximately 0.7 GB per hour; Standard HD (720p) uses about 1.5 GB per hour; Full HD (1080p) uses approximately 3 GB per hour; and Ultra HD 4K uses roughly 7 GB per hour. These are approximate figures and can vary based on video content complexity and the specific encoding used. Netflix allows you to set a data usage limit in the app settings."
          },
          {
            question: "What is a petabyte and how big is it?",
            answer: "In SI terms, 1 petabyte (PB) = 1,000 terabytes = 1,000,000 gigabytes = 1,000,000,000,000,000 bytes. To put it in perspective: 1 petabyte could hold approximately 200,000 hours of HD video, about 13 years of HD content. The entire text of the English Wikipedia — all articles — is roughly 22 gigabytes, meaning 1 petabyte could hold over 45,000 copies of Wikipedia. Google processes and stores petabytes of data daily."
          },
          {
            question: "How big is the entire internet?",
            answer: "This is genuinely difficult to measure because the internet includes indexed content, the deep web (databases, private content), cloud storage, and constantly growing data streams. Estimates for the total amount of data ever created and stored globally were approaching 100+ zettabytes by the mid-2020s (1 zettabyte = 1 billion terabytes). The publicly indexed surface web is a fraction of this — Google's index covers an estimated 45+ billion pages. The question of 'how big is the internet' depends enormously on what you choose to include."
          },
        ]}
        relatedCalculators={[
          { name: "Scientific Calculator", href: "/calculators/math/scientific-calculator" },
          { name: "Percentage Calculator", href: "/calculators/math/percentage-calculator" },
          { name: "Time Zone Converter", href: "/calculators/converters/time-zone-converter" },
        ]}
      >
        <div />
      </CalculatorLayout>
    </div>
  );
}
