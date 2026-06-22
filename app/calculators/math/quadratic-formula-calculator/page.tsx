"use client";
import { useState, useMemo } from "react";
import Breadcrumbs from "@/components/Breadcrumbs";
import CalculatorLayout from "@/components/CalculatorLayout";

export default function QuadraticFormulaCalculator() {
  const [a, setA] = useState("1");
  const [b, setB] = useState("-5");
  const [c, setC] = useState("6");

  const result = useMemo(() => {
    const av = parseFloat(a);
    const bv = parseFloat(b);
    const cv = parseFloat(c);
    if (isNaN(av) || isNaN(bv) || isNaN(cv) || av === 0) return null;

    const discriminant = bv * bv - 4 * av * cv;
    const vertexX = -bv / (2 * av);
    const vertexY = av * vertexX * vertexX + bv * vertexX + cv;
    const axisOfSymmetry = vertexX;

    let roots: { type: string; x1: string; x2: string | null; complex: boolean } = {
      type: "",
      x1: "",
      x2: null,
      complex: false,
    };

    if (discriminant > 0) {
      const sqrtD = Math.sqrt(discriminant);
      const x1 = (-bv + sqrtD) / (2 * av);
      const x2 = (-bv - sqrtD) / (2 * av);
      roots = {
        type: "Two distinct real roots",
        x1: x1.toFixed(6).replace(/\.?0+$/, ""),
        x2: x2.toFixed(6).replace(/\.?0+$/, ""),
        complex: false,
      };
    } else if (discriminant === 0) {
      const x = -bv / (2 * av);
      roots = {
        type: "One repeated real root",
        x1: x.toFixed(6).replace(/\.?0+$/, ""),
        x2: null,
        complex: false,
      };
    } else {
      const realPart = (-bv / (2 * av)).toFixed(4).replace(/\.?0+$/, "");
      const imagPart = (Math.sqrt(Math.abs(discriminant)) / (2 * av)).toFixed(4).replace(/\.?0+$/, "");
      roots = {
        type: "Two complex conjugate roots",
        x1: `${realPart} + ${imagPart}i`,
        x2: `${realPart} − ${imagPart}i`,
        complex: true,
      };
    }

    const fmt = (n: number) => {
      const s = n.toFixed(6).replace(/\.?0+$/, "");
      return s;
    };

    const steps = [
      `Step 1: Identify coefficients: a = ${av}, b = ${bv}, c = ${cv}`,
      `Step 2: Calculate discriminant: Δ = b² − 4ac = (${bv})² − 4(${av})(${cv}) = ${bv * bv} − ${4 * av * cv} = ${discriminant}`,
      discriminant >= 0
        ? `Step 3: √Δ = √${discriminant} = ${Math.sqrt(Math.abs(discriminant)).toFixed(6).replace(/\.?0+$/, "")}`
        : `Step 3: √|Δ| = √${Math.abs(discriminant)} = ${Math.sqrt(Math.abs(discriminant)).toFixed(6).replace(/\.?0+$/, "")}i`,
      discriminant > 0
        ? `Step 4: x₁ = (−(${bv}) + ${Math.sqrt(discriminant).toFixed(4)}) / (2×${av}) = ${roots.x1}`
        : discriminant === 0
        ? `Step 4: x = −b / (2a) = −(${bv}) / (2×${av}) = ${roots.x1}`
        : `Step 4: x = ${(-bv / (2 * av)).toFixed(4)} ± ${(Math.sqrt(Math.abs(discriminant)) / (2 * av)).toFixed(4)}i`,
      discriminant > 0 ? `Step 5: x₂ = (−(${bv}) − ${Math.sqrt(discriminant).toFixed(4)}) / (2×${av}) = ${roots.x2}` : "",
    ].filter(Boolean);

    let factorForm = "";
    if (!roots.complex && roots.x1 && roots.x2) {
      const r1 = parseFloat(roots.x1);
      const r2 = parseFloat(roots.x2);
      factorForm = `${av !== 1 ? av : ""}(x − ${r1})(x − ${r2})`;
    } else if (!roots.complex && roots.x1 && !roots.x2) {
      const r1 = parseFloat(roots.x1);
      factorForm = `${av !== 1 ? av : ""}(x − ${r1})²`;
    } else {
      factorForm = "Complex — cannot factor over reals";
    }

    const opensUpDown = av > 0 ? "opens upward ∪ (minimum)" : "opens downward ∩ (maximum)";

    return {
      discriminant,
      roots,
      vertexX: fmt(vertexX),
      vertexY: fmt(vertexY),
      axisOfSymmetry: fmt(axisOfSymmetry),
      yIntercept: fmt(cv),
      factorForm,
      opensUpDown,
      steps,
    };
  }, [a, b, c]);

  const av = parseFloat(a) || 0;
  const bv = parseFloat(b) || 0;
  const cv = parseFloat(c) || 0;

  const formatCoeff = (coeff: number, variable: string, first = false) => {
    if (coeff === 0) return "";
    if (first) return `${coeff}${variable}`;
    return coeff > 0 ? ` + ${coeff}${variable}` : ` − ${Math.abs(coeff)}${variable}`;
  };

  const equation = `${formatCoeff(av, "x²", true)}${formatCoeff(bv, "x")}${
    cv === 0 ? "" : cv > 0 ? ` + ${cv}` : ` − ${Math.abs(cv)}`
  } = 0`;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumbs
        items={[
          { label: "Math Calculators", href: "/math-calculators" },
          { label: "Quadratic Formula Calculator", href: "/calculators/math/quadratic-formula-calculator" },
        ]}
      />
      <div className="mb-6 flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Quadratic Formula Calculator</h1>
          <p className="text-base text-gray-600">
            Solve ax² + bx + c = 0 with step-by-step solutions, discriminant analysis, and parabola details.
          </p>
        </div>
        <button
          onClick={() => window.print()}
          className="print:hidden flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg"
        >
          ↓ PDF
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Input */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200 space-y-4">
          <h2 className="text-lg font-semibold text-gray-800">Enter Coefficients</h2>
          <div className="bg-indigo-50 rounded-lg p-4 text-center">
            <p className="text-xl font-mono font-bold text-indigo-800">{equation || "ax² + bx + c = 0"}</p>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "a (x²)", val: a, set: setA, note: "≠ 0" },
              { label: "b (x)", val: b, set: setB, note: "" },
              { label: "c (constant)", val: c, set: setC, note: "" },
            ].map(({ label, val, set, note }) => (
              <div key={label}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {label} <span className="text-gray-400 text-xs">{note}</span>
                </label>
                <input
                  type="number"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={val}
                  onChange={(e) => set(e.target.value)}
                />
              </div>
            ))}
          </div>
          {parseFloat(a) === 0 && (
            <p className="text-red-500 text-sm">⚠ Coefficient a cannot be 0 (not a quadratic equation)</p>
          )}
          <div className="text-xs text-gray-500 bg-gray-50 rounded-lg p-3">
            <p className="font-mono">x = (−b ± √(b²−4ac)) / (2a)</p>
          </div>
        </div>

        {/* Results */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Results</h2>
          {result ? (
            <div className="space-y-3">
              <div className={`rounded-lg p-3 ${result.roots.complex ? "bg-orange-50" : "bg-green-50"}`}>
                <p className="text-xs font-medium text-gray-500 mb-1">Root Type</p>
                <p className={`font-bold text-sm ${result.roots.complex ? "text-orange-700" : "text-green-700"}`}>
                  {result.roots.type}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500">Discriminant (Δ)</p>
                  <p className="font-bold text-gray-900">{result.discriminant}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500">Y-Intercept</p>
                  <p className="font-bold text-gray-900">(0, {result.yIntercept})</p>
                </div>
                <div className="bg-indigo-50 rounded-lg p-3">
                  <p className="text-xs text-indigo-600">x₁</p>
                  <p className="font-bold text-indigo-900 text-sm">{result.roots.x1}</p>
                </div>
                {result.roots.x2 && (
                  <div className="bg-indigo-50 rounded-lg p-3">
                    <p className="text-xs text-indigo-600">x₂</p>
                    <p className="font-bold text-indigo-900 text-sm">{result.roots.x2}</p>
                  </div>
                )}
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500">Vertex</p>
                  <p className="font-bold text-gray-900 text-sm">({result.vertexX}, {result.vertexY})</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500">Axis of Symmetry</p>
                  <p className="font-bold text-gray-900">x = {result.axisOfSymmetry}</p>
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-500 mb-1">Factored Form</p>
                <p className="font-mono text-sm text-gray-800">{result.factorForm}</p>
              </div>
              <div className="bg-purple-50 rounded-lg p-3">
                <p className="text-xs text-purple-600 mb-1">Parabola</p>
                <p className="text-sm text-purple-900">{result.opensUpDown}</p>
              </div>
            </div>
          ) : (
            <p className="text-gray-400 text-sm">Enter coefficients (a ≠ 0) to see the solution.</p>
          )}
        </div>
      </div>

      {/* Step-by-step */}
      {result && (
        <div className="mt-6 bg-white rounded-xl shadow-md p-6 border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Step-by-Step Solution</h2>
          <div className="bg-gray-900 rounded-xl p-5 font-mono text-sm text-green-300 space-y-2">
            {result.steps.map((step, i) => (
              <div key={i}>{step}</div>
            ))}
          </div>
        </div>
      )}

      <CalculatorLayout
        title="Quadratic Formula Calculator"
        description="Solve any quadratic equation ax² + bx + c = 0 with full step-by-step workings, discriminant analysis, vertex, and factored form."
        explanation={
          <div className="space-y-4 text-sm text-gray-700 leading-relaxed">
            <h3 className="text-base font-semibold text-gray-900">A 4,000-Year-Old Formula</h3>
            <p>
              Quadratic equations have been solved since at least 2000 BC. Babylonian mathematicians solved
              equivalent problems using geometric methods — completing the square on clay tablets, without
              algebraic notation. Ancient Indian and Greek mathematicians developed similar techniques. The
              explicit formula we use today was popularized by the Persian mathematician <strong>al-Khwarizmi</strong>
              around 820 AD in his book "Al-Kitab al-mukhtasar fi hisab al-jabr wal-muqabala" — the origin of
              the word <em>algebra</em>.
            </p>
            <h3 className="text-base font-semibold text-gray-900">The Parabola and Its Roots</h3>
            <p>
              Every quadratic equation ax² + bx + c = 0 corresponds to a parabola y = ax² + bx + c. The roots
              (solutions) are the x-coordinates where this parabola crosses the x-axis. If the discriminant Δ = b² − 4ac
              is positive, the parabola crosses the x-axis twice (two real roots). If Δ = 0, it just touches the axis
              (one repeated root, vertex on x-axis). If Δ &lt; 0, it never crosses (complex roots, parabola entirely
              above or below the x-axis).
            </p>
            <h3 className="text-base font-semibold text-gray-900">Deriving the Formula: Completing the Square</h3>
            <p>
              Starting from ax² + bx + c = 0, divide by a: x² + (b/a)x + c/a = 0. Move c/a to the right:
              x² + (b/a)x = −c/a. Add (b/2a)² to both sides: (x + b/2a)² = (b² − 4ac)/(4a²). Take the square
              root and solve: x = (−b ± √(b² − 4ac)) / (2a). This algebraic manipulation is called
              <strong> completing the square</strong> and reveals why the vertex x-coordinate is −b/(2a).
            </p>
            <h3 className="text-base font-semibold text-gray-900">Three Forms of a Quadratic</h3>
            <p>
              Quadratics appear in three equivalent forms: <strong>Standard form</strong> (ax² + bx + c) shows
              y-intercept directly. <strong>Vertex form</strong> (a(x − h)² + k) reveals the vertex (h, k) at
              a glance. <strong>Factored form</strong> (a(x − r₁)(x − r₂)) shows roots directly. Converting
              between forms is a core algebra skill.
            </p>
            <h3 className="text-base font-semibold text-gray-900">Vieta's Formulas</h3>
            <p>
              French mathematician François Viète discovered elegant relationships between roots and coefficients:
              x₁ + x₂ = −b/a and x₁ × x₂ = c/a. These allow you to check your answers without substituting back
              into the equation, and are used to construct polynomials with desired roots.
            </p>
            <h3 className="text-base font-semibold text-gray-900">Real-World Applications</h3>
            <p>
              <strong>Projectile motion:</strong> The height h = −16t² + v₀t + h₀ (feet, imperial) is quadratic
              in time t. Solving for h = 0 gives when the projectile lands. <strong>Profit maximization:</strong>
              Revenue minus cost often yields a quadratic in price or quantity. The vertex gives the optimal price.
              <strong> Engineering:</strong> Cable suspension bridges form parabolas under uniform load.
              <strong> Optics:</strong> Parabolic mirrors focus parallel light rays to a single focal point, used
              in telescopes and satellite dishes.
            </p>
          </div>
        }
        faqs={[
          {
            question: "What does it mean when the discriminant is negative?",
            answer:
              "A negative discriminant means the quadratic has no real solutions — only complex (imaginary) roots. The parabola doesn't cross the x-axis. In physics, this might mean a projectile never reaches a certain height; in engineering, it might indicate a system never reaches equilibrium under given conditions.",
          },
          {
            question: "Can a = 0 in a quadratic equation?",
            answer:
              "No. If a = 0, the equation becomes linear (bx + c = 0), not quadratic. The quadratic formula requires a ≠ 0 because we divide by 2a during the derivation. A linear equation has exactly one solution: x = −c/b.",
          },
          {
            question: "What are complex roots and when do they appear?",
            answer:
              "Complex roots appear when Δ < 0 and take the form p ± qi, where i = √(−1). They always come in conjugate pairs. While they have no geometric meaning on the real number line, complex roots are essential in electrical engineering (AC circuits), signal processing, and quantum mechanics.",
          },
          {
            question: "How do I check if my roots are correct?",
            answer:
              "Substitute each root back into ax² + bx + c. The result should equal 0. You can also use Vieta's formulas: check that x₁ + x₂ = −b/a and x₁ × x₂ = c/a. Both checks should hold simultaneously for correct roots.",
          },
          {
            question: "Why is the vertex at x = −b/(2a)?",
            answer:
              "The vertex occurs at the axis of symmetry, which is exactly halfway between the two roots. Using Vieta's formulas: (x₁ + x₂)/2 = (−b/a)/2 = −b/(2a). It's also the point where the derivative of ax² + bx + c equals zero, confirming it's a maximum or minimum.",
          },
        ]}
        relatedCalculators={[]}
      >
        <div />
      </CalculatorLayout>
    </div>
  );
}
