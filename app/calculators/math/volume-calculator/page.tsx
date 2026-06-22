"use client";
import { useState, useMemo } from "react";
import Breadcrumbs from "@/components/Breadcrumbs";
import CalculatorLayout from "@/components/CalculatorLayout";

type Shape = "Cube" | "Rectangular Prism" | "Sphere" | "Cylinder" | "Cone" | "Pyramid";
type Unit = "cm" | "m" | "in" | "ft";

const SHAPES: Shape[] = ["Cube", "Rectangular Prism", "Sphere", "Cylinder", "Cone", "Pyramid"];
const UNITS: Unit[] = ["cm", "m", "in", "ft"];
const ICONS: Record<Shape, string> = {
  Cube: "🧊", "Rectangular Prism": "📦", Sphere: "🔮", Cylinder: "🥫", Cone: "🍦", Pyramid: "🔺",
};

interface ShapeInput { key: string; label: string }
const INPUTS: Record<Shape, ShapeInput[]> = {
  Cube: [{ key: "s", label: "Side length (s)" }],
  "Rectangular Prism": [{ key: "l", label: "Length (l)" }, { key: "w", label: "Width (w)" }, { key: "h", label: "Height (h)" }],
  Sphere: [{ key: "r", label: "Radius (r)" }],
  Cylinder: [{ key: "r", label: "Radius (r)" }, { key: "h", label: "Height (h)" }],
  Cone: [{ key: "r", label: "Radius (r)" }, { key: "h", label: "Height (h)" }],
  Pyramid: [{ key: "b", label: "Base side (b)" }, { key: "h", label: "Height (h)" }],
};

function calcShape(shape: Shape, v: Record<string, number>) {
  const π = Math.PI;
  switch (shape) {
    case "Cube": {
      const s = v.s || 0;
      return { volume: s ** 3, surface: 6 * s ** 2, formula: "V = s³", saFormula: "SA = 6s²" };
    }
    case "Rectangular Prism": {
      const { l = 0, w = 0, h = 0 } = v;
      return { volume: l * w * h, surface: 2 * (l * w + l * h + w * h), formula: "V = l × w × h", saFormula: "SA = 2(lw + lh + wh)" };
    }
    case "Sphere": {
      const r = v.r || 0;
      return { volume: (4 / 3) * π * r ** 3, surface: 4 * π * r ** 2, formula: "V = (4/3)πr³", saFormula: "SA = 4πr²" };
    }
    case "Cylinder": {
      const { r = 0, h = 0 } = v;
      return { volume: π * r ** 2 * h, surface: 2 * π * r * (r + h), formula: "V = πr²h", saFormula: "SA = 2πr(r + h)" };
    }
    case "Cone": {
      const { r = 0, h = 0 } = v;
      const slant = Math.sqrt(r ** 2 + h ** 2);
      return { volume: (1 / 3) * π * r ** 2 * h, surface: π * r * (r + slant), formula: "V = (1/3)πr²h", saFormula: "SA = πr(r + l)" };
    }
    case "Pyramid": {
      const { b = 0, h = 0 } = v;
      const slant = Math.sqrt((b / 2) ** 2 + h ** 2);
      return { volume: (1 / 3) * b ** 2 * h, surface: b ** 2 + 2 * b * slant, formula: "V = (1/3)b²h", saFormula: "SA = b² + 2b√((b/2)² + h²)" };
    }
  }
}

const UNIT_LABELS: Record<Unit, string> = { cm: "cm³ / mL", m: "m³", in: "in³", ft: "ft³" };
const TO_LITERS: Record<Unit, number> = { cm: 0.001, m: 1000, in: 0, ft: 0 };

export default function VolumeCalculator() {
  const [shape, setShape] = useState<Shape>("Cube");
  const [unit, setUnit] = useState<Unit>("cm");
  const [vals, setVals] = useState<Record<string, string>>({ s: "5" });

  const setVal = (k: string, v: string) => setVals((prev) => ({ ...prev, [k]: v }));

  const result = useMemo(() => {
    const numVals: Record<string, number> = {};
    for (const { key } of INPUTS[shape]) {
      numVals[key] = parseFloat(vals[key] || "0");
    }
    if (Object.values(numVals).some((v) => isNaN(v) || v <= 0)) return null;
    const calc = calcShape(shape, numVals);
    const liters = ["cm", "m"].includes(unit) ? calc.volume * TO_LITERS[unit] : null;
    return { ...calc, liters };
  }, [shape, unit, vals]);

  const fmt = (v: number, dec = 4) => parseFloat(v.toFixed(dec)).toLocaleString();

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumbs
        items={[
          { label: "Math Calculators", href: "/math-calculators" },
          { label: "Volume Calculator", href: "/calculators/math/volume-calculator" },
        ]}
      />
      <div className="mb-6 flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Volume Calculator</h1>
          <p className="text-base text-gray-600">
            Calculate volume and surface area for 6 geometric shapes with unit conversion and formula display.
          </p>
        </div>
        <button
          onClick={() => window.print()}
          className="print:hidden flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg"
        >
          ↓ PDF
        </button>
      </div>

      {/* Shape selector */}
      <div className="flex flex-wrap gap-2 mb-6">
        {SHAPES.map((s) => (
          <button
            key={s}
            onClick={() => { setShape(s); setVals({}); }}
            className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors flex items-center gap-1.5 ${
              shape === s
                ? "bg-indigo-600 text-white border-indigo-600"
                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
            }`}
          >
            {ICONS[s]} {s}
          </button>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Input */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200 space-y-4">
          <div className="flex items-center gap-3">
            <span className="text-4xl">{ICONS[shape]}</span>
            <h2 className="text-lg font-semibold text-gray-800">{shape}</h2>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Unit</label>
            <div className="flex gap-2 flex-wrap">
              {UNITS.map((u) => (
                <button
                  key={u}
                  onClick={() => setUnit(u)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${
                    unit === u
                      ? "bg-indigo-600 text-white border-indigo-600"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  {u}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            {INPUTS[shape].map(({ key, label }) => (
              <div key={key}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {label} ({unit})
                </label>
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

          {result && (
            <div className="bg-gray-50 rounded-lg p-3 space-y-1">
              <p className="text-xs font-mono text-indigo-700">{result.formula}</p>
              <p className="text-xs font-mono text-purple-700">{result.saFormula}</p>
            </div>
          )}
        </div>

        {/* Results */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-2xl">{ICONS[shape]}</span>
            <h2 className="text-lg font-semibold text-gray-800">Results</h2>
          </div>
          {result ? (
            <div className="space-y-4">
              <div className="bg-indigo-50 rounded-xl p-5 text-center">
                <p className="text-sm text-indigo-600 mb-1 font-medium">Volume</p>
                <p className="text-3xl font-bold text-indigo-900">{fmt(result.volume)}</p>
                <p className="text-sm text-indigo-600 mt-1">{UNIT_LABELS[unit]}</p>
                {result.liters !== null && (
                  <p className="text-sm text-indigo-500 mt-2">= {fmt(result.liters)} liters</p>
                )}
              </div>
              <div className="bg-purple-50 rounded-xl p-5 text-center">
                <p className="text-sm text-purple-600 mb-1 font-medium">Surface Area</p>
                <p className="text-3xl font-bold text-purple-900">{fmt(result.surface)}</p>
                <p className="text-sm text-purple-600 mt-1">
                  {unit}²
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm text-gray-600">
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500 mb-1">Volume Formula</p>
                  <p className="font-mono text-xs text-indigo-700">{result.formula}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500 mb-1">Surface Area Formula</p>
                  <p className="font-mono text-xs text-purple-700">{result.saFormula}</p>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-gray-400 text-sm">Enter positive dimensions to calculate volume and surface area.</p>
          )}
        </div>
      </div>

      <CalculatorLayout
        title="Volume Calculator"
        description="Calculate volume and surface area for cubes, rectangular prisms, spheres, cylinders, cones, and pyramids."
        explanation={
          <div className="space-y-4 text-sm text-gray-700 leading-relaxed">
            <h3 className="text-base font-semibold text-gray-900">Archimedes and Displacement</h3>
            <p>
              The legendary story of Archimedes leaping from his bath shouting "Eureka!" (I have found it) marks
              one of the first practical uses of volume measurement. He needed to determine whether a crown was
              pure gold without melting it. By measuring the water displaced, he could compute the crown's volume
              and density. This principle — submerged volume equals displaced fluid volume — underlies modern
              techniques for measuring irregularly shaped objects.
            </p>
            <h3 className="text-base font-semibold text-gray-900">Cavalieri's Principle: Why Cone = ⅓ Cylinder</h3>
            <p>
              Italian mathematician Bonaventura Cavalieri (1598–1647) proved that if two solids have equal cross-sectional
              areas at every height, they have equal volumes. This explains why a cone's volume is exactly one-third
              of the cylinder with the same base and height — at every height level, the cone's circular cross-section
              is smaller by a consistent ratio that integrates to 1/3. Similarly, a pyramid is 1/3 of the prism.
            </p>
            <h3 className="text-base font-semibold text-gray-900">The Isoperimetric Problem: Why Spheres Win</h3>
            <p>
              Among all shapes with the same surface area, the <strong>sphere encloses the maximum volume</strong>.
              This is the isoperimetric inequality. A sphere achieves ~74% packing efficiency in random arrangements,
              while a cube fills 100% of space by itself but stacks less efficiently with identical spheres.
              Nature exploits this: soap bubbles form spheres to minimize surface tension energy. Cell membranes
              adopt spherical shapes to maximize interior volume.
            </p>
            <h3 className="text-base font-semibold text-gray-900">Practical Applications: Aquariums and Concrete</h3>
            <p>
              <strong>Aquarium sizing:</strong> A rectangular tank 120cm × 50cm × 60cm holds 360,000 cm³ = 360 liters.
              Fish require approximately 1 liter per 1cm of fish length, so this tank could house 360cm of fish.
              <strong> Concrete estimation:</strong> A rectangular foundation 10m × 8m × 0.3m needs 24 m³ of concrete.
              At ~2.4 tonnes per m³, that's about 57.6 tonnes. Knowing the cylinder formula is critical for
              estimating concrete for round columns and piers.
            </p>
            <h3 className="text-base font-semibold text-gray-900">Manufacturing and Cost Optimization</h3>
            <p>
              Packaging engineers minimize surface area for a given volume to reduce material costs. For a fixed
              cylinder volume, the optimal (least surface area) proportions are height = 2 × radius — a nearly
              square cross-section. Many soup cans approximate this. For rectangular boxes, the optimal shape
              is a cube. These insights save millions in material costs across industries producing billions of units.
            </p>
            <h3 className="text-base font-semibold text-gray-900">Industrial Storage: Tanks and Silos</h3>
            <p>
              Large cylindrical tanks for oil, grain, and water are common because cylinders have a favorable
              volume-to-surface ratio and distribute internal pressure uniformly (no stress concentrations at
              corners, unlike rectangular tanks). The volume formula V = πr²h means doubling the radius quadruples
              capacity while only doubling circumference — favoring wider, shorter tanks for maximum storage efficiency.
            </p>
          </div>
        }
        faqs={[
          {
            question: "How do I convert cubic centimeters to liters?",
            answer:
              "1 liter = 1,000 cubic centimeters (cm³). To convert, divide cm³ by 1,000. For example, a volume of 2,500 cm³ = 2.5 liters. This is why 1 cm³ is also called 1 milliliter (mL). For cubic meters, 1 m³ = 1,000 liters.",
          },
          {
            question: "Why is the volume of a cone one-third of a cylinder?",
            answer:
              "This can be proven using calculus (integration of circular cross-sections from 0 to h) or Cavalieri's principle. Experimentally, you can fill a cone with water and pour it into the matching cylinder exactly three times to fill it. Euclid proved this in Elements around 300 BC.",
          },
          {
            question: "What is the surface area of a sphere used for in real life?",
            answer:
              "Sphere surface area is used in heat transfer calculations (how fast a ball cools), material estimates for spherical tanks and domes, and calculating drag on projectiles. The formula SA = 4πr² also appears in the inverse-square law governing gravity and light intensity.",
          },
          {
            question: "How does volume scale with size?",
            answer:
              "Volume scales with the cube of linear dimensions. If you double all dimensions of a shape, the volume increases by 2³ = 8 times. Surface area only increases by 2² = 4 times. This cube-square law explains why large animals need different cooling systems than small ones, and why large insects can't exist.",
          },
          {
            question: "What is the difference between a pyramid and a cone?",
            answer:
              "Both have a single apex and a base, and both have volume = (1/3) × base area × height. A pyramid has a polygonal base (square, triangular, etc.) while a cone has a circular base. As the number of sides of a pyramid's polygon increases toward infinity, the pyramid approaches a cone.",
          },
        ]}
        relatedCalculators={[]}
      >
        <div />
      </CalculatorLayout>
    </div>
  );
}
