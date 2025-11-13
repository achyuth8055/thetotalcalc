"use client";

import { useState, useEffect } from "react";
import Breadcrumbs from "@/components/Breadcrumbs";
import CalculatorLayout from "@/components/CalculatorLayout";

export default function ColorConverterCalculator() {
  const [hex, setHex] = useState("#FF5733");
  const [rgb, setRgb] = useState({ r: 255, g: 87, b: 51 });
  const [hsl, setHsl] = useState({ h: 9, s: 100, l: 60 });

  useEffect(() => {
    const recent = JSON.parse(localStorage.getItem("recentCalculators") || "[]");
    const updated = ["color-converter", ...recent.filter((id: string) => id !== "color-converter")].slice(0, 10);
    localStorage.setItem("recentCalculators", JSON.stringify(updated));
  }, []);

  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : { r: 0, g: 0, b: 0 };
  };

  const rgbToHex = (r: number, g: number, b: number) => {
    return "#" + [r, g, b].map(x => {
      const hex = x.toString(16);
      return hex.length === 1 ? "0" + hex : hex;
    }).join("");
  };

  const rgbToHsl = (r: number, g: number, b: number) => {
    r /= 255;
    g /= 255;
    b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
        case g: h = ((b - r) / d + 2) / 6; break;
        case b: h = ((r - g) / d + 4) / 6; break;
      }
    }

    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100),
    };
  };

  const hslToRgb = (h: number, s: number, l: number) => {
    h /= 360;
    s /= 100;
    l /= 100;
    let r, g, b;

    if (s === 0) {
      r = g = b = l;
    } else {
      const hue2rgb = (p: number, q: number, t: number) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1/6) return p + (q - p) * 6 * t;
        if (t < 1/2) return q;
        if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
        return p;
      };

      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = hue2rgb(p, q, h + 1/3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1/3);
    }

    return {
      r: Math.round(r * 255),
      g: Math.round(g * 255),
      b: Math.round(b * 255),
    };
  };

  const updateFromHex = (value: string) => {
    setHex(value);
    if (/^#[0-9A-F]{6}$/i.test(value)) {
      const newRgb = hexToRgb(value);
      setRgb(newRgb);
      setHsl(rgbToHsl(newRgb.r, newRgb.g, newRgb.b));
    }
  };

  const updateFromRgb = (r: number, g: number, b: number) => {
    const newRgb = { r, g, b };
    setRgb(newRgb);
    setHex(rgbToHex(r, g, b));
    setHsl(rgbToHsl(r, g, b));
  };

  const updateFromHsl = (h: number, s: number, l: number) => {
    const newHsl = { h, s, l };
    setHsl(newHsl);
    const newRgb = hslToRgb(h, s, l);
    setRgb(newRgb);
    setHex(rgbToHex(newRgb.r, newRgb.g, newRgb.b));
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumbs
        items={[
          { label: "Developer Tools", href: "/developer-calculators" },
          { label: "Color Converter", href: "/calculators/developer/color-converter" },
        ]}
      />

      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Color Converter</h1>
        <p className="text-base text-gray-600">
          Convert colors between HEX, RGB, and HSL formats
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200 mb-6">
        <div className="space-y-4">
          <div className="p-8 rounded-lg border-4" style={{ backgroundColor: hex }}>
            <div className="text-center text-white font-bold text-2xl drop-shadow-lg">Color Preview</div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">HEX</label>
            <input
              type="text"
              value={hex}
              onChange={(e) => updateFromHex(e.target.value.toUpperCase())}
              className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
              placeholder="#FF5733"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">RGB</label>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-xs text-gray-600 mb-1">Red (0-255)</label>
                <input
                  type="number"
                  value={rgb.r}
                  onChange={(e) => updateFromRgb(parseInt(e.target.value) || 0, rgb.g, rgb.b)}
                  min="0"
                  max="255"
                  className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">Green (0-255)</label>
                <input
                  type="number"
                  value={rgb.g}
                  onChange={(e) => updateFromRgb(rgb.r, parseInt(e.target.value) || 0, rgb.b)}
                  min="0"
                  max="255"
                  className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">Blue (0-255)</label>
                <input
                  type="number"
                  value={rgb.b}
                  onChange={(e) => updateFromRgb(rgb.r, rgb.g, parseInt(e.target.value) || 0)}
                  min="0"
                  max="255"
                  className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                />
              </div>
            </div>
            <div className="mt-2 text-sm text-gray-600 font-mono">
              rgb({rgb.r}, {rgb.g}, {rgb.b})
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">HSL</label>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-xs text-gray-600 mb-1">Hue (0-360)</label>
                <input
                  type="number"
                  value={hsl.h}
                  onChange={(e) => updateFromHsl(parseInt(e.target.value) || 0, hsl.s, hsl.l)}
                  min="0"
                  max="360"
                  className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">Saturation (0-100)</label>
                <input
                  type="number"
                  value={hsl.s}
                  onChange={(e) => updateFromHsl(hsl.h, parseInt(e.target.value) || 0, hsl.l)}
                  min="0"
                  max="100"
                  className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">Lightness (0-100)</label>
                <input
                  type="number"
                  value={hsl.l}
                  onChange={(e) => updateFromHsl(hsl.h, hsl.s, parseInt(e.target.value) || 0)}
                  min="0"
                  max="100"
                  className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                />
              </div>
            </div>
            <div className="mt-2 text-sm text-gray-600 font-mono">
              hsl({hsl.h}, {hsl.s}%, {hsl.l}%)
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200 mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">How It Works</h2>
        <div className="space-y-4 text-sm text-gray-700">
          <p>
            <strong className="text-blue-600">HEX (Hexadecimal):</strong> Uses 6 characters (#RRGGBB) to represent colors. Commonly used in web design and CSS.
          </p>
          <p>
            <strong className="text-green-600">RGB (Red, Green, Blue):</strong> Uses three values (0-255) for red, green, and blue channels. Direct color mixing model.
          </p>
          <p>
            <strong className="text-purple-600">HSL (Hue, Saturation, Lightness):</strong> Uses degrees for hue (0-360) and percentages for saturation and lightness (0-100). More intuitive for color selection.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
        <h2 className="text-xl font-bold text-gray-900 mb-4">FAQ</h2>
        <div className="space-y-3 text-sm">
          <div>
            <p className="font-semibold text-gray-900">What's the difference between RGB and HSL?</p>
            <p className="text-gray-600">RGB uses red, green, blue values while HSL uses hue, saturation, lightness - HSL is often more intuitive for color selection.</p>
          </div>
          <div>
            <p className="font-semibold text-gray-900">How do I use HEX colors?</p>
            <p className="text-gray-600">HEX colors are used in CSS like this: color: #FF5733; or background-color: #FF5733;</p>
          </div>
          <div>
            <p className="font-semibold text-gray-900">What does HSL stand for?</p>
            <p className="text-gray-600">HSL stands for Hue, Saturation, and Lightness - a more human-friendly color representation.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
