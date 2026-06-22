"use client";
import { useState, useMemo } from "react";
import Breadcrumbs from "@/components/Breadcrumbs";
import CalculatorLayout from "@/components/CalculatorLayout";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

function parseNumbers(input: string): number[] {
  return input
    .split(/[\s,;\n]+/)
    .map((s) => parseFloat(s.trim()))
    .filter((n) => !isNaN(n));
}

function quantile(sorted: number[], p: number): number {
  const idx = p * (sorted.length - 1);
  const lo = Math.floor(idx);
  const hi = Math.ceil(idx);
  return sorted[lo] + (sorted[hi] - sorted[lo]) * (idx - lo);
}

function buildHistogram(nums: number[], bins = 7) {
  const min = Math.min(...nums);
  const max = Math.max(...nums);
  const range = max - min || 1;
  const width = range / bins;
  const buckets = Array.from({ length: bins }, (_, i) => ({
    label: `${(min + i * width).toFixed(1)}–${(min + (i + 1) * width).toFixed(1)}`,
    count: 0,
  }));
  nums.forEach((n) => {
    const idx = Math.min(Math.floor((n - min) / width), bins - 1);
    buckets[idx].count++;
  });
  return buckets;
}

export default function StatisticsCalculator() {
  const [input, setInput] = useState("2, 4, 6, 8, 10, 12, 14");
  const [sampleMode, setSampleMode] = useState(true);

  const stats = useMemo(() => {
    const nums = parseNumbers(input);
    if (nums.length === 0) return null;
    const n = nums.length;
    const sorted = [...nums].sort((a, b) => a - b);
    const sum = nums.reduce((a, b) => a + b, 0);
    const mean = sum / n;
    const median = quantile(sorted, 0.5);
    const freq: Record<number, number> = {};
    nums.forEach((v) => (freq[v] = (freq[v] || 0) + 1));
    const maxF = Math.max(...Object.values(freq));
    const modes = Object.entries(freq)
      .filter(([, f]) => f === maxF)
      .map(([v]) => Number(v));
    const min = sorted[0];
    const max = sorted[n - 1];
    const range = max - min;
    const variance =
      nums.reduce((a, b) => a + (b - mean) ** 2, 0) / (sampleMode ? n - 1 : n);
    const sd = Math.sqrt(variance);
    const se = sd / Math.sqrt(n);
    const q1 = quantile(sorted, 0.25);
    const q3 = quantile(sorted, 0.75);
    const iqr = q3 - q1;
    const lowerFence = q1 - 1.5 * iqr;
    const upperFence = q3 + 1.5 * iqr;
    const outliers = nums.filter((v) => v < lowerFence || v > upperFence);
    return {
      n, sum, mean, median,
      mode: modes.join(", "),
      min, max, range,
      variance, sd, se,
      q1, q2: median, q3, iqr,
      lowerFence, upperFence,
      outliers,
      histogram: buildHistogram(nums),
    };
  }, [input, sampleMode]);

  const fmt = (v: number) => isNaN(v) ? "—" : parseFloat(v.toFixed(6)).toString();

  const resultCards = stats
    ? [
        { label: "Count (n)", value: stats.n, formula: "Count of values" },
        { label: "Sum", value: fmt(stats.sum), formula: "Σxᵢ" },
        { label: "Mean", value: fmt(stats.mean), formula: "Σxᵢ / n" },
        { label: "Median", value: fmt(stats.median), formula: "Middle value" },
        { label: "Mode", value: stats.mode, formula: "Most frequent" },
        { label: "Range", value: fmt(stats.range), formula: "Max − Min" },
        { label: "Min", value: fmt(stats.min), formula: "Smallest value" },
        { label: "Max", value: fmt(stats.max), formula: "Largest value" },
        { label: "Variance", value: fmt(stats.variance), formula: sampleMode ? "Σ(xᵢ−x̄)²/(n−1)" : "Σ(xᵢ−x̄)²/n" },
        { label: "Std Deviation", value: fmt(stats.sd), formula: "√Variance" },
        { label: "Std Error", value: fmt(stats.se), formula: "SD / √n" },
        { label: "Q1 (25th %ile)", value: fmt(stats.q1), formula: "25th percentile" },
        { label: "Q2 (Median)", value: fmt(stats.q2), formula: "50th percentile" },
        { label: "Q3 (75th %ile)", value: fmt(stats.q3), formula: "75th percentile" },
        { label: "IQR", value: fmt(stats.iqr), formula: "Q3 − Q1" },
        { label: "Lower Fence", value: fmt(stats.lowerFence), formula: "Q1 − 1.5×IQR" },
        { label: "Upper Fence", value: fmt(stats.upperFence), formula: "Q3 + 1.5×IQR" },
        { label: "Outliers", value: stats.outliers.length ? stats.outliers.join(", ") : "None", formula: "Outside fences" },
      ]
    : [];

  const COLORS = ["#6366f1", "#8b5cf6", "#a78bfa", "#c4b5fd", "#ddd6fe", "#ede9fe", "#f5f3ff"];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumbs
        items={[
          { label: "Math Calculators", href: "/math-calculators" },
          { label: "Statistics Calculator", href: "/calculators/math/statistics-calculator" },
        ]}
      />
      <div className="mb-6 flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Statistics Calculator</h1>
          <p className="text-base text-gray-600">
            Calculate mean, median, mode, standard deviation, quartiles, and more from your dataset.
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
          <h2 className="text-lg font-semibold text-gray-800">Enter Your Data</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Numbers (comma, space, or newline separated)
            </label>
            <textarea
              className="w-full border border-gray-300 rounded-lg p-3 text-sm font-mono h-36 resize-y focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="e.g. 2, 4, 6, 8, 10"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Variance Type</label>
            <div className="flex gap-3">
              <button
                onClick={() => setSampleMode(true)}
                className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
                  sampleMode
                    ? "bg-indigo-600 text-white border-indigo-600"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                }`}
              >
                Sample (÷ n−1)
              </button>
              <button
                onClick={() => setSampleMode(false)}
                className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
                  !sampleMode
                    ? "bg-indigo-600 text-white border-indigo-600"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                }`}
              >
                Population (÷ n)
              </button>
            </div>
          </div>
          {stats && (
            <div className="bg-indigo-50 rounded-lg p-3 text-sm text-indigo-800">
              <span className="font-semibold">{stats.n}</span> values parsed successfully.
            </div>
          )}
        </div>

        {/* Results */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Results</h2>
          {stats ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {resultCards.map((card) => (
                <div key={card.label} className="bg-gray-50 rounded-lg p-3">
                  <div className="text-xs text-gray-500 mb-0.5">{card.label}</div>
                  <div className="text-sm font-bold text-gray-900 break-all">{card.value}</div>
                  <div className="text-xs text-indigo-600 mt-0.5 font-mono">{card.formula}</div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 text-sm">Enter numbers to see statistics.</p>
          )}
        </div>
      </div>

      {/* Histogram */}
      {stats && (
        <div className="mt-6 bg-white rounded-xl shadow-md p-6 border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Frequency Histogram</h2>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={stats.histogram} margin={{ top: 5, right: 20, left: 0, bottom: 40 }}>
              <XAxis dataKey="label" tick={{ fontSize: 10 }} angle={-30} textAnchor="end" />
              <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="count" name="Frequency" radius={[4, 4, 0, 0]}>
                {stats.histogram.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      <CalculatorLayout
        title="Statistics Calculator"
        description="Comprehensive descriptive statistics calculator with mean, median, mode, standard deviation, quartiles, IQR, and outlier detection."
        explanation={
          <div className="space-y-4 text-sm text-gray-700 leading-relaxed">
            <h3 className="text-base font-semibold text-gray-900">Understanding Descriptive Statistics</h3>
            <p>
              Statistics is the science of collecting, organizing, analyzing, and interpreting data. Descriptive statistics
              summarize the main features of a dataset, while inferential statistics use sample data to make predictions
              about a larger population. This calculator focuses on descriptive statistics — the foundation for any
              data analysis task.
            </p>
            <h3 className="text-base font-semibold text-gray-900">Mean vs. Median: Choosing the Right Center</h3>
            <p>
              The <strong>mean</strong> (arithmetic average) is sensitive to extreme values. Consider household income:
              if nine households earn $40,000 and one earns $4,000,000, the mean becomes $436,000 — misleading for the
              typical household. The <strong>median</strong> ($40,000) better represents the center of this skewed
              distribution. This is why economists report median household income rather than mean income. For symmetric
              distributions, mean and median are nearly equal; for skewed data, use the median.
            </p>
            <h3 className="text-base font-semibold text-gray-900">The Empirical Rule (68-95-99.7)</h3>
            <p>
              For normally distributed data, approximately <strong>68%</strong> of values fall within 1 standard deviation
              of the mean, <strong>95%</strong> within 2 standard deviations, and <strong>99.7%</strong> within 3 standard
              deviations. This rule is used in quality control (Six Sigma), test score analysis, and setting tolerances
              in manufacturing. A product that falls outside 3σ from the mean is statistically rare (0.3% probability).
            </p>
            <h3 className="text-base font-semibold text-gray-900">Outlier Detection: IQR Method vs. Z-Score</h3>
            <p>
              This calculator uses the <strong>IQR (Interquartile Range) method</strong>: values below Q1 − 1.5×IQR or
              above Q3 + 1.5×IQR are flagged as outliers. This method is robust because it isn't affected by the
              outliers themselves. The alternative <strong>z-score method</strong> flags values more than 2 or 3 standard
              deviations from the mean — but since outliers inflate the standard deviation, this method can mask extreme
              values in small datasets. The IQR method is preferred for exploratory analysis and non-normal distributions.
            </p>
            <h3 className="text-base font-semibold text-gray-900">Sample vs. Population: Bessel's Correction</h3>
            <p>
              When computing variance for a <strong>sample</strong> (a subset of a larger population), we divide by
              n−1 instead of n. This is called <strong>Bessel's correction</strong>. Why? A sample's values tend to
              cluster closer to the sample mean than the population mean, causing the raw variance to underestimate
              the true population variance. Dividing by n−1 corrects this bias. Use population variance (÷n) only
              when you have the complete dataset — every member of the group you care about.
            </p>
            <h3 className="text-base font-semibold text-gray-900">Central Limit Theorem</h3>
            <p>
              The <strong>Central Limit Theorem (CLT)</strong> states that the distribution of sample means approaches
              a normal distribution as sample size increases, regardless of the original distribution's shape. This
              underpins hypothesis testing, confidence intervals, and A/B testing. The standard error (SE = SD/√n)
              quantifies how much sample means vary — larger samples produce smaller standard errors, meaning more
              precise estimates of the population mean.
            </p>
            <h3 className="text-base font-semibold text-gray-900">Applications</h3>
            <p>
              <strong>Quality control:</strong> Statistical Process Control (SPC) uses mean and standard deviation to
              monitor manufacturing processes. Control charts flag when a process drifts beyond 3σ limits.
              <strong> A/B testing:</strong> Marketers use standard error and t-tests to determine if a conversion rate
              difference between two page versions is statistically significant or due to random chance.
              <strong> Finance:</strong> Portfolio variance and covariance form the basis of Modern Portfolio Theory —
              diversification reduces overall portfolio standard deviation even when individual asset volatilities are high.
            </p>
          </div>
        }
        faqs={[
          {
            question: "What is the difference between standard deviation and standard error?",
            answer:
              "Standard deviation measures the spread of individual data points around the mean. Standard error measures how accurately the sample mean estimates the population mean. SE = SD / √n — as sample size grows, SE shrinks, meaning larger samples give more reliable mean estimates.",
          },
          {
            question: "When should I use median instead of mean?",
            answer:
              "Use median when your data is skewed or contains outliers. Income, home prices, and response times are classic examples where the median is more representative. Use mean when data is symmetric and approximately normally distributed.",
          },
          {
            question: "What does IQR tell me?",
            answer:
              "The Interquartile Range (IQR = Q3 − Q1) spans the middle 50% of your data. It is a robust measure of variability that isn't affected by extreme values. A large IQR means the middle half of data is widely spread; a small IQR means they cluster tightly.",
          },
          {
            question: "Can a dataset have more than one mode?",
            answer:
              "Yes. A dataset with two modes is bimodal, three is trimodal, and so on. This often indicates the data comes from two distinct groups — for example, heights of a mixed-gender group may show peaks around 5'4\" and 5'10\".",
          },
          {
            question: "Why might my variance be 0?",
            answer:
              "Variance is 0 when all values in the dataset are identical. Every value equals the mean, so all squared deviations are zero. This means there is no variability in your data.",
          },
        ]}
        relatedCalculators={[]}
      >
        <div />
      </CalculatorLayout>
    </div>
  );
}
