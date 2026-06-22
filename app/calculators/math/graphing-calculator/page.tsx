"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Breadcrumbs from "@/components/Breadcrumbs";
import CalculatorLayout from "@/components/CalculatorLayout";

const COLORS = ["#6366f1", "#ef4444", "#22c55e", "#f59e0b", "#06b6d4"];

interface FunctionEntry {
  id: number;
  expr: string;
  color: string;
  enabled: boolean;
  error: string;
}

let nextId = 1;

function parseAndEval(expr: string, x: number): number {
  const clean = expr
    .replace(/\^/g, "**")
    .replace(/π/g, String(Math.PI))
    .replace(/pi/gi, String(Math.PI))
    .replace(/sqrt\(/g, "Math.sqrt(")
    .replace(/sin\(/g, "Math.sin(")
    .replace(/cos\(/g, "Math.cos(")
    .replace(/tan\(/g, "Math.tan(")
    .replace(/abs\(/g, "Math.abs(")
    .replace(/log\(/g, "Math.log10(")
    .replace(/ln\(/g, "Math.log(")
    .replace(/e(?![a-zA-Z])/g, String(Math.E));
  // eslint-disable-next-line no-new-func
  return Function("x", `"use strict"; return (${clean})`)(x);
}

export default function GraphingCalculator() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [functions, setFunctions] = useState<FunctionEntry[]>([
    { id: nextId++, expr: "x^2", color: COLORS[0], enabled: true, error: "" },
    { id: nextId++, expr: "sin(x)*3", color: COLORS[1], enabled: true, error: "" },
  ]);
  const [xMin, setXMin] = useState(-10);
  const [xMax, setXMax] = useState(10);
  const [yMin, setYMin] = useState(-10);
  const [yMax, setYMax] = useState(10);
  const [crosshair, setCrosshair] = useState<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const recent = JSON.parse(localStorage.getItem("recentCalculators") || "[]");
    const updated = ["graphing", ...recent.filter((id: string) => id !== "graphing")].slice(0, 10);
    localStorage.setItem("recentCalculators", JSON.stringify(updated));
  }, []);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const W = canvas.width;
    const H = canvas.height;

    const toCanvasX = (x: number) => ((x - xMin) / (xMax - xMin)) * W;
    const toCanvasY = (y: number) => H - ((y - yMin) / (yMax - yMin)) * H;

    ctx.clearRect(0, 0, W, H);

    // Background
    ctx.fillStyle = "#fafafa";
    ctx.fillRect(0, 0, W, H);

    // Grid
    ctx.strokeStyle = "#e5e7eb";
    ctx.lineWidth = 1;
    const xStep = (xMax - xMin) / 10;
    for (let gx = Math.ceil(xMin / xStep) * xStep; gx <= xMax; gx += xStep) {
      const cx = toCanvasX(gx);
      ctx.beginPath(); ctx.moveTo(cx, 0); ctx.lineTo(cx, H); ctx.stroke();
    }
    const yStep = (yMax - yMin) / 10;
    for (let gy = Math.ceil(yMin / yStep) * yStep; gy <= yMax; gy += yStep) {
      const cy = toCanvasY(gy);
      ctx.beginPath(); ctx.moveTo(0, cy); ctx.lineTo(W, cy); ctx.stroke();
    }

    // Axes
    ctx.strokeStyle = "#9ca3af";
    ctx.lineWidth = 1.5;
    const ax = toCanvasX(0);
    const ay = toCanvasY(0);
    if (ax >= 0 && ax <= W) { ctx.beginPath(); ctx.moveTo(ax, 0); ctx.lineTo(ax, H); ctx.stroke(); }
    if (ay >= 0 && ay <= H) { ctx.beginPath(); ctx.moveTo(0, ay); ctx.lineTo(W, ay); ctx.stroke(); }

    // Axis labels
    ctx.fillStyle = "#6b7280";
    ctx.font = "11px sans-serif";
    ctx.textAlign = "center";
    for (let gx = Math.ceil(xMin / xStep) * xStep; gx <= xMax; gx += xStep) {
      if (Math.abs(gx) < 0.0001) continue;
      const cx = toCanvasX(gx);
      ctx.fillText(parseFloat(gx.toPrecision(3)).toString(), cx, Math.min(H - 4, Math.max(14, ay + 14)));
    }
    ctx.textAlign = "right";
    for (let gy = Math.ceil(yMin / yStep) * yStep; gy <= yMax; gy += yStep) {
      if (Math.abs(gy) < 0.0001) continue;
      const cy = toCanvasY(gy);
      ctx.fillText(parseFloat(gy.toPrecision(3)).toString(), Math.min(W - 4, Math.max(30, ax - 4)), cy + 4);
    }

    // Functions
    functions.forEach(fn => {
      if (!fn.enabled || fn.error) return;
      ctx.strokeStyle = fn.color;
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      let started = false;
      const steps = W * 2;
      for (let i = 0; i <= steps; i++) {
        const x = xMin + (i / steps) * (xMax - xMin);
        try {
          const y = parseAndEval(fn.expr, x);
          if (!isFinite(y) || isNaN(y)) { started = false; continue; }
          const cx = toCanvasX(x);
          const cy = toCanvasY(y);
          if (!started) { ctx.moveTo(cx, cy); started = true; }
          else ctx.lineTo(cx, cy);
        } catch { started = false; }
      }
      ctx.stroke();
    });

    // Crosshair
    if (crosshair) {
      ctx.strokeStyle = "#374151";
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 4]);
      const cx = toCanvasX(crosshair.x);
      const cy = toCanvasY(crosshair.y);
      ctx.beginPath(); ctx.moveTo(cx, 0); ctx.lineTo(cx, H); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, cy); ctx.lineTo(W, cy); ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = "#374151";
      ctx.textAlign = "left";
      ctx.font = "12px monospace";
      ctx.fillText(`(${crosshair.x.toFixed(2)}, ${crosshair.y.toFixed(2)})`, cx + 6, cy - 6);
    }
  }, [functions, xMin, xMax, yMin, yMax, crosshair]);

  useEffect(() => { draw(); }, [draw]);

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const px = (e.clientX - rect.left) * (canvas.width / rect.width);
    const py = (e.clientY - rect.top) * (canvas.height / rect.height);
    const x = xMin + (px / canvas.width) * (xMax - xMin);
    const y = yMax - (py / canvas.height) * (yMax - yMin);
    setCrosshair({ x, y });
  };

  const addFunction = () => {
    setFunctions(prev => [...prev, { id: nextId++, expr: "", color: COLORS[prev.length % COLORS.length], enabled: true, error: "" }]);
  };

  const updateFn = (id: number, expr: string) => {
    let error = "";
    if (expr) {
      try { parseAndEval(expr, 1); } catch { error = "Syntax error"; }
    }
    setFunctions(prev => prev.map(f => f.id === id ? { ...f, expr, error } : f));
  };

  const toggleFn = (id: number) => setFunctions(prev => prev.map(f => f.id === id ? { ...f, enabled: !f.enabled } : f));
  const removeFn = (id: number) => setFunctions(prev => prev.filter(f => f.id !== id));

  const zoom = (factor: number) => {
    const cx = (xMin + xMax) / 2;
    const cy = (yMin + yMax) / 2;
    const hw = (xMax - xMin) / 2 * factor;
    const hh = (yMax - yMin) / 2 * factor;
    setXMin(cx - hw); setXMax(cx + hw);
    setYMin(cy - hh); setYMax(cy + hh);
  };

  const PRESETS = [
    { label: "Parabola", expr: "x^2" },
    { label: "Sine", expr: "sin(x)" },
    { label: "Cosine", expr: "cos(x)" },
    { label: "Line", expr: "2*x + 1" },
    { label: "Cubic", expr: "x^3 - x" },
    { label: "1/x", expr: "1/x" },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumbs
        items={[
          { label: "Math Calculators", href: "/math-calculators" },
          { label: "Graphing Calculator", href: "/calculators/math/graphing-calculator" },
        ]}
      />
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Graphing Calculator</h1>
        <p className="text-base text-gray-600">Plot mathematical functions and explore their behavior interactively</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Controls */}
        <div className="bg-white rounded-xl shadow-md p-5 border border-gray-200 space-y-4">
          <div>
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-sm font-semibold text-gray-700">Functions</h3>
              <button onClick={addFunction} className="text-xs px-2 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700">+ Add</button>
            </div>
            <div className="space-y-2">
              {functions.map(fn => (
                <div key={fn.id} className="flex items-center gap-2">
                  <button onClick={() => toggleFn(fn.id)}
                    className="w-5 h-5 rounded border-2 flex-shrink-0 transition-colors"
                    style={{ backgroundColor: fn.enabled ? fn.color : "transparent", borderColor: fn.color }} />
                  <div className="flex-1">
                    <input type="text" value={fn.expr} placeholder="e.g. x^2"
                      onChange={(e) => updateFn(fn.id, e.target.value)}
                      className={`w-full px-2 py-1.5 border rounded text-sm font-mono focus:ring-1 focus:ring-indigo-500 ${fn.error ? "border-red-400" : "border-gray-300"}`} />
                    {fn.error && <p className="text-xs text-red-500 mt-0.5">{fn.error}</p>}
                  </div>
                  {functions.length > 1 && (
                    <button onClick={() => removeFn(fn.id)} className="text-gray-400 hover:text-red-500 text-lg leading-none">×</button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-xs font-semibold text-gray-600 mb-2">Presets</h3>
            <div className="flex flex-wrap gap-1.5">
              {PRESETS.map(p => (
                <button key={p.label} onClick={() => setFunctions([{ id: nextId++, expr: p.expr, color: COLORS[0], enabled: true, error: "" }])}
                  className="text-xs px-2 py-1 bg-gray-100 hover:bg-indigo-100 hover:text-indigo-700 rounded font-mono border border-gray-200 transition-colors">
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-xs font-semibold text-gray-600 mb-2">View Range</h3>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {[
                { label: "X min", value: xMin, set: setXMin },
                { label: "X max", value: xMax, set: setXMax },
                { label: "Y min", value: yMin, set: setYMin },
                { label: "Y max", value: yMax, set: setYMax },
              ].map(({ label, value, set }) => (
                <div key={label}>
                  <label className="text-gray-500 block mb-0.5">{label}</label>
                  <input type="number" value={value} onChange={(e) => set(Number(e.target.value))}
                    className="w-full px-2 py-1 border border-gray-300 rounded font-mono focus:ring-1 focus:ring-indigo-500" />
                </div>
              ))}
            </div>
            <div className="flex gap-2 mt-2">
              <button onClick={() => zoom(0.5)} className="flex-1 py-1 text-xs bg-gray-100 rounded border border-gray-200 hover:bg-gray-200">Zoom In</button>
              <button onClick={() => zoom(2)} className="flex-1 py-1 text-xs bg-gray-100 rounded border border-gray-200 hover:bg-gray-200">Zoom Out</button>
              <button onClick={() => { setXMin(-10); setXMax(10); setYMin(-10); setYMax(10); }}
                className="flex-1 py-1 text-xs bg-gray-100 rounded border border-gray-200 hover:bg-gray-200">Reset</button>
            </div>
          </div>
        </div>

        {/* Canvas */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
          <canvas
            ref={canvasRef}
            width={640}
            height={480}
            className="w-full h-auto cursor-crosshair"
            onMouseMove={handleMouseMove}
            onMouseLeave={() => setCrosshair(null)}
          />
        </div>
      </div>

      <CalculatorLayout title="" description=""
        explanation={<div><p className="mb-2">Enter any mathematical function using x as the variable. Move your mouse over the graph to see coordinates. Add multiple functions to compare them.</p><p className="text-sm text-gray-600">Syntax: use * for multiplication, ^ for powers, sin/cos/tan for trig, sqrt() for square root, π for pi.</p></div>}
        faqs={[
          { question: "How do I enter a function?", answer: "Type the formula using x as the variable. Examples: x^2, sin(x), 2*x+1, sqrt(x). Use * for multiplication." },
          { question: "Can I plot multiple functions?", answer: "Yes - click '+ Add' to add more functions. Each gets a different color so you can compare them." },
          { question: "How do I zoom in?", answer: "Use the Zoom In/Out buttons, or manually change the X min/max and Y min/max values to set your view range." },
        ]}
        relatedCalculators={[
          { name: "Scientific Calculator", href: "/calculators/math/scientific-calculator" },
          { name: "Math Solver", href: "/calculators/math/math-solver" },
          { name: "Percentage Calculator", href: "/calculators/math/percentage-calculator" },
        ]}
      >
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900">Plotting Functions</h2>
          <p className="text-sm text-gray-700">A graphing calculator visualizes how a function behaves across a range of x values. It's essential for understanding algebra, calculus, and trigonometry.</p>
        </div>
      </CalculatorLayout>
    </div>
  );
}
