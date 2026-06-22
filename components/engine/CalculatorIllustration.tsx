// Lightweight, category-aware inline SVG illustration for calculator pages.
// No external image asset - renders instantly, themes with the design tokens,
// and gives each tool a relevant visual without bloat.

const MOTIF: Record<string, { label: string; glyph: string; accent: string }> = {
  benefits: { label: "Benefits & eligibility", glyph: "M12 3l2.5 5 5.5.8-4 3.9.9 5.5L12 21l-4.9 2.6.9-5.5-4-3.9 5.5-.8z", accent: "#9ff5c1" },
  "property-tax": { label: "Property tax", glyph: "M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z", accent: "#83d8a6" },
  "tax-credits": { label: "Tax credits", glyph: "M4 5h16v4H4zm0 6h16v8H4zm3 3h6v2H7z", accent: "#f8bc4b" },
  salary: { label: "Salary & wages", glyph: "M3 6h18v12H3zm9 2a4 4 0 1 0 0 8 4 4 0 0 0 0-8z", accent: "#9ff5c1" },
  finance: { label: "Finance & loans", glyph: "M4 18l5-5 4 3 7-8", accent: "#adc7f7" },
  engineering: { label: "Engineering", glyph: "M13 2l-2 7h4l-6 13 2-9H7z", accent: "#adc7f7" },
};

export default function CalculatorIllustration({ category }: { category: string }) {
  const m = MOTIF[category] ?? MOTIF.finance;
  const filled = category === "tax-credits" || category === "property-tax" || category === "salary";

  return (
    <div className="overflow-hidden rounded-xl border border-surface-border">
      <svg viewBox="0 0 800 200" className="h-36 w-full" role="img" aria-label={`${m.label} illustration`}>
        <rect width="800" height="200" fill="#f1f4f6" />
        <circle cx="690" cy="20" r="110" fill={m.accent} opacity="0.45" />
        <circle cx="80" cy="190" r="70" fill="#d6e3ff" opacity="0.5" />
        {/* faint grid */}
        <g stroke="#c4c6cf" strokeWidth="1" opacity="0.4">
          {[160, 320, 480, 640].map((x) => (
            <line key={x} x1={x} y1="0" x2={x} y2="200" />
          ))}
        </g>
        {/* category glyph badge */}
        <g transform="translate(56 56)">
          <rect width="88" height="88" rx="20" fill="#002045" />
          <g transform="translate(20 20) scale(2)">
            <path
              d={m.glyph}
              fill={filled ? "#ffffff" : "none"}
              stroke="#ffffff"
              strokeWidth={filled ? 0 : 1.8}
              strokeLinejoin="round"
              strokeLinecap="round"
            />
          </g>
        </g>
        <text x="170" y="108" fontFamily="Public Sans, sans-serif" fontSize="22" fontWeight="700" fill="#002045">
          {m.label}
        </text>
        <text x="170" y="136" fontFamily="Public Sans, sans-serif" fontSize="15" fill="#43474e">
          Free · sourced · region-aware
        </text>
      </svg>
    </div>
  );
}
