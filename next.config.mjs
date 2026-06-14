/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Tree-shake heavy barrel imports so each calculator page only ships the
  // chart/icon code it actually uses, instead of the whole library. This is a
  // big win for the finance/health pages that statically import recharts.
  experimental: {
    optimizePackageImports: ["recharts", "react-icons", "country-flag-icons"],
  },
  // Drop console.* from production bundles (keep warnings and errors).
  compiler: {
    removeConsole: { exclude: ["error", "warn"] },
  },
  // Consolidate duplicate calculators so they don't cannibalize each other in
  // search. The /calculators/finance/... URL is the canonical compound-interest
  // page; the old /calc/compound-interest path 301s into it.
  async redirects() {
    return [
      {
        source: "/calc/compound-interest",
        destination: "/calculators/finance/compound-interest-calculator",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
