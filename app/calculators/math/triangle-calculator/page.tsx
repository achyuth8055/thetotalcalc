"use client";
import { useState, useMemo } from "react";
import Breadcrumbs from "@/components/Breadcrumbs";
import CalculatorLayout from "@/components/CalculatorLayout";

const DEG = Math.PI / 180;
const RAD = 180 / Math.PI;

type Mode = "SSS" | "SAS" | "ASA" | "AAS" | "Right";

interface TriResult {
  a: number; b: number; c: number;
  A: number; B: number; C: number;
  area: number; perimeter: number;
  typeShape: string; typeAngle: string;
  ha: number; hb: number; hc: number;
}

function heronArea(a: number, b: number, c: number) {
  const s = (a + b + c) / 2;
  return Math.sqrt(s * (s - a) * (s - b) * (s - c));
}

export default function TriangleCalculator() {
  const [mode, setMode] = useState<Mode>("SSS");
  const [vals, setVals] = useState<Record<string, string>>({ a: "3", b: "4", c: "5" });

  const setVal = (k: string, v: string) => setVals((prev) => ({ ...prev, [k]: v }));
  const n = (k: string) => parseFloat(vals[k] || "0");

  const result = useMemo<TriResult | null>(() => {
    try {
      let a = 0, b = 0, c = 0, A = 0, B = 0, C = 0;

      if (mode === "SSS") {
        a = n("a"); b = n("b"); c = n("c");
        if (a <= 0 || b <= 0 || c <= 0 || a + b <= c || a + c <= b || b + c <= a) return null;
        A = Math.acos((b * b + c * c - a * a) / (2 * b * c)) * RAD;
        B = Math.acos((a * a + c * c - b * b) / (2 * a * c)) * RAD;
        C = 180 - A - B;
      } else if (mode === "SAS") {
        a = n("a"); C = n("C"); b = n("b");
        if (a <= 0 || b <= 0 || C <= 0 || C >= 180) return null;
        c = Math.sqrt(a * a + b * b - 2 * a * b * Math.cos(C * DEG));
        A = Math.acos((b * b + c * c - a * a) / (2 * b * c)) * RAD;
        B = 180 - A - C;
      } else if (mode === "ASA") {
        A = n("A"); c = n("c"); B = n("B");
        if (A <= 0 || B <= 0 || c <= 0 || A + B >= 180) return null;
        C = 180 - A - B;
        a = c * Math.sin(A * DEG) / Math.sin(C * DEG);
        b = c * Math.sin(B * DEG) / Math.sin(C * DEG);
      } else if (mode === "AAS") {
        A = n("A"); B = n("B"); a = n("a");
        if (A <= 0 || B <= 0 || a <= 0 || A + B >= 180) return null;
        C = 180 - A - B;
        b = a * Math.sin(B * DEG) / Math.sin(A * DEG);
        c = a * Math.sin(C * DEG) / Math.sin(A * DEG);
      } else if (mode === "Right") {
        const leg1 = n("leg1"); const leg2 = n("leg2");
        if (leg1 <= 0 || leg2 <= 0) return null;
        a = leg1; b = leg2;
        c = Math.sqrt(a * a + b * b);
        C = 90;
        A = Math.atan(a / b) * RAD;
        B = 90 - A;
      }

      if ([a, b, c, A, B, C].some((v) => isNaN(v) || !isFinite(v) || v <= 0)) return null;

      const area = heronArea(a, b, c);
      const perimeter = a + b + c;
      const typeShape =
        Math.abs(a - b) < 0.0001 && Math.abs(b - c) < 0.0001
          ? "Equilateral"
          : Math.abs(a - b) < 0.0001 || Math.abs(b - c) < 0.0001 || Math.abs(a - c) < 0.0001
          ? "Isosceles"
          : "Scalene";
      const maxAngle = Math.max(A, B, C);
      const typeAngle =
        Math.abs(maxAngle - 90) < 0.01
          ? "Right"
          : maxAngle < 90
          ? "Acute"
          : "Obtuse";
      const ha = (2 * area) / a;
      const hb = (2 * area) / b;
      const hc = (2 * area) / c;

      return { a, b, c, A, B, C, area, perimeter, typeShape, typeAngle, ha, hb, hc };
    } catch {
      return null;
    }
  }, [mode, vals]);

  const fmt = (v: number, dec = 4) => isNaN(v) ? "—" : parseFloat(v.toFixed(dec)).toString();

  // SVG Triangle
  const svgTriangle = useMemo(() => {
    if (!result) return null;
    const { a, b, c, A } = result;
    const scale = 180 / Math.max(a, b, c);
    const ax = 10, ay = 200;
    const bx = ax + c * scale, by = 200;
    const cx2 = ax + b * scale * Math.cos(A * DEG);
    const cy2 = 200 - b * scale * Math.sin(A * DEG);
    return { ax, ay, bx, by, cx: cx2, cy: cy2 };
  }, [result]);

  const modes: Mode[] = ["SSS", "SAS", "ASA", "AAS", "Right"];

  const inputFields: Record<Mode, { key: string; label: string }[]> = {
    SSS: [{ key: "a", label: "Side a" }, { key: "b", label: "Side b" }, { key: "c", label: "Side c" }],
    SAS: [{ key: "a", label: "Side a" }, { key: "C", label: "Angle C (°)" }, { key: "b", label: "Side b" }],
    ASA: [{ key: "A", label: "Angle A (°)" }, { key: "c", label: "Side c" }, { key: "B", label: "Angle B (°)" }],
    AAS: [{ key: "A", label: "Angle A (°)" }, { key: "B", label: "Angle B (°)" }, { key: "a", label: "Side a" }],
    Right: [{ key: "leg1", label: "Leg 1 (a)" }, { key: "leg2", label: "Leg 2 (b)" }],
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumbs
        items={[
          { label: "Math Calculators", href: "/math-calculators" },
          { label: "Triangle Calculator", href: "/calculators/math/triangle-calculator" },
        ]}
      />
      <div className="mb-6 flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Triangle Calculator</h1>
          <p className="text-base text-gray-600">
            Solve any triangle using SSS, SAS, ASA, AAS, or Right Triangle — get all sides, angles, area, and more.
          </p>
        </div>
        <button
          onClick={() => window.print()}
          className="print:hidden flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg"
        >
          ↓ PDF
        </button>
      </div>

      {/* Mode tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {modes.map((m) => (
          <button
            key={m}
            onClick={() => { setMode(m); setVals({}); }}
            className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
              mode === m
                ? "bg-indigo-600 text-white border-indigo-600"
                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
            }`}
          >
            {m}
          </button>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Input */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200 space-y-4">
          <h2 className="text-lg font-semibold text-gray-800">
            {mode === "Right" ? "Right Triangle" : `${mode} — Enter Known Values`}
          </h2>
          <div className="space-y-3">
            {inputFields[mode].map(({ key, label }) => (
              <div key={key}>
                <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                <input
                  type="number"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={vals[key] || ""}
                  onChange={(e) => setVal(key, e.target.value)}
                  min="0"
                />
              </div>
            ))}
          </div>

          {/* SVG Triangle preview */}
          {svgTriangle && (
            <div className="mt-4">
              <svg viewBox="0 0 220 220" className="w-full max-h-48 border border-gray-100 rounded-lg bg-gray-50">
                <polygon
                  points={`${svgTriangle.ax},${svgTriangle.ay} ${svgTriangle.bx},${svgTriangle.by} ${svgTriangle.cx},${svgTriangle.cy}`}
                  fill="#e0e7ff"
                  stroke="#6366f1"
                  strokeWidth="2"
                />
                <text x={svgTriangle.ax - 12} y={svgTriangle.ay + 15} fontSize="13" fill="#374151" fontWeight="bold">A</text>
                <text x={svgTriangle.bx + 4} y={svgTriangle.by + 15} fontSize="13" fill="#374151" fontWeight="bold">B</text>
                <text x={svgTriangle.cx - 4} y={svgTriangle.cy - 8} fontSize="13" fill="#374151" fontWeight="bold">C</text>
              </svg>
            </div>
          )}
        </div>

        {/* Results */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Results</h2>
          {result ? (
            <div className="space-y-3">
              <div className="flex gap-2">
                <span className="px-3 py-1 bg-indigo-100 text-indigo-800 text-xs font-semibold rounded-full">{result.typeShape}</span>
                <span className="px-3 py-1 bg-purple-100 text-purple-800 text-xs font-semibold rounded-full">{result.typeAngle}</span>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: "Side a", value: fmt(result.a) },
                  { label: "Side b", value: fmt(result.b) },
                  { label: "Side c", value: fmt(result.c) },
                  { label: "Angle A", value: `${fmt(result.A, 2)}°` },
                  { label: "Angle B", value: `${fmt(result.B, 2)}°` },
                  { label: "Angle C", value: `${fmt(result.C, 2)}°` },
                  { label: "Area", value: fmt(result.area) },
                  { label: "Perimeter", value: fmt(result.perimeter) },
                  { label: "Height hₐ", value: fmt(result.ha) },
                  { label: "Height h_b", value: fmt(result.hb) },
                  { label: "Height h_c", value: fmt(result.hc) },
                ].map(({ label, value }) => (
                  <div key={label} className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-500 mb-0.5">{label}</p>
                    <p className="font-bold text-gray-900 text-sm">{value}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-gray-400 text-sm">Enter valid values to solve the triangle.</p>
          )}
        </div>
      </div>

      <CalculatorLayout
        title="Triangle Calculator"
        description="Solve any triangle with sides and angles using the Law of Sines, Law of Cosines, and Heron's formula."
        explanation={
          <div className="space-y-4 text-sm text-gray-700 leading-relaxed">
            <h3 className="text-base font-semibold text-gray-900">Foundations: The Pythagorean Theorem</h3>
            <p>
              The most famous relationship in geometry, a² + b² = c², applies to right triangles where c is the
              hypotenuse. Pythagorean triples — integer solutions like (3, 4, 5), (5, 12, 13), (8, 15, 17) —
              were known to Babylonians 1,000 years before Pythagoras. The theorem extends to all triangles
              through the Law of Cosines: c² = a² + b² − 2ab·cos(C), which reduces to the Pythagorean theorem
              when C = 90° since cos(90°) = 0.
            </p>
            <h3 className="text-base font-semibold text-gray-900">SOHCAHTOA and Trigonometry</h3>
            <p>
              In a right triangle, sin(θ) = Opposite/Hypotenuse, cos(θ) = Adjacent/Hypotenuse, tan(θ) = Opposite/Adjacent.
              This mnemonic (SOHCAHTOA) is the gateway to trigonometry. It enables surveyors to calculate inaccessible
              distances, architects to compute roof pitches, and navigators to plot bearings.
            </p>
            <h3 className="text-base font-semibold text-gray-900">Law of Sines and Law of Cosines</h3>
            <p>
              The <strong>Law of Sines</strong> (a/sin A = b/sin B = c/sin C) allows solving triangles when you know
              two angles and a side (AAS, ASA) or two sides and a non-included angle (SSA — the ambiguous case).
              The <strong>Law of Cosines</strong> handles SSS and SAS cases. Both laws are generalizations of
              right-triangle trigonometry to any triangle.
            </p>
            <h3 className="text-base font-semibold text-gray-900">Heron's Formula</h3>
            <p>
              Greek mathematician Heron of Alexandria (~60 AD) derived the area formula: Area = √(s(s−a)(s−b)(s−c))
              where s = (a+b+c)/2 is the semi-perimeter. This remarkable formula computes area knowing only the three
              sides — no angles needed. It's used in computer graphics for triangle mesh area calculations and in
              GPS positioning algorithms.
            </p>
            <h3 className="text-base font-semibold text-gray-900">Triangle Inequality and Classification</h3>
            <p>
              For a valid triangle, any side must be less than the sum of the other two (triangle inequality). Triangles
              are classified by sides: <strong>equilateral</strong> (all sides equal, all angles 60°),
              <strong> isosceles</strong> (two sides equal), <strong>scalene</strong> (all sides different).
              By angles: <strong>acute</strong> (all &lt;90°), <strong>right</strong> (one =90°),
              <strong> obtuse</strong> (one &gt;90°). The largest angle always opposes the longest side.
            </p>
            <h3 className="text-base font-semibold text-gray-900">Engineering Applications</h3>
            <p>
              <strong>Structural trusses</strong> — bridges and roofs rely on triangles as the only rigid polygon
              (a rectangle deforms under load; a triangle doesn't). <strong>GPS triangulation</strong> determines
              position by measuring distances from three satellites, then solving the resulting triangle system.
              <strong> Navigation:</strong> Pilots use the wind triangle to compute ground speed and heading when
              wind pushes an aircraft off course. <strong>Surveying:</strong> Triangulation networks cover entire
              continents, with each triangle's angles summing to 180°.
            </p>
            <h3 className="text-base font-semibold text-gray-900">The Ambiguous Case (SSA)</h3>
            <p>
              When given two sides and a non-included angle, there may be 0, 1, or 2 valid triangles — called the
              ambiguous case. If the side opposite the given angle is shorter than the other given side, two
              triangles may exist (two possible positions of the third vertex). This is why SSA is not a valid
              congruence criterion (unlike SSS, SAS, ASA, AAS).
            </p>
          </div>
        }
        faqs={[
          {
            question: "What is the triangle inequality theorem?",
            answer:
              "For any triangle with sides a, b, c, the sum of any two sides must be greater than the third side: a + b > c, a + c > b, and b + c > a. If this condition is violated, no triangle can be formed. For example, sides 1, 2, 10 cannot form a triangle because 1 + 2 = 3 < 10.",
          },
          {
            question: "How do I find the area of a triangle without the height?",
            answer:
              "Use Heron's formula: compute s = (a + b + c) / 2, then Area = √(s(s−a)(s−b)(s−c)). Alternatively, if you know two sides and the included angle: Area = 0.5 × a × b × sin(C). Both methods avoid needing the perpendicular height.",
          },
          {
            question: "Why does the sum of angles in a triangle equal 180°?",
            answer:
              "This holds for triangles on a flat (Euclidean) plane. Draw a line parallel to one side through the opposite vertex — alternate interior angles show the three angles fit perfectly on a straight line (180°). On a sphere (non-Euclidean geometry), triangle angles sum to more than 180°.",
          },
          {
            question: "What are Pythagorean triples?",
            answer:
              "Pythagorean triples are sets of three positive integers (a, b, c) satisfying a² + b² = c². Common examples: (3,4,5), (5,12,13), (8,15,17), (7,24,25). Any multiple of a triple also works (6,8,10 is 2×(3,4,5)). They're used in construction to create perfect right angles.",
          },
          {
            question: "What is the difference between similar and congruent triangles?",
            answer:
              "Congruent triangles have exactly the same size and shape — all corresponding sides and angles are equal. Similar triangles have the same shape but different sizes — all angles are equal, and corresponding sides are proportional. Similarity is established by AA (Angle-Angle), SAS, or SSS similarity criteria.",
          },
        ]}
        relatedCalculators={[]}
      >
        <div />
      </CalculatorLayout>
    </div>
  );
}
