"use client";

import { useState, useEffect } from "react";
import Breadcrumbs from "@/components/Breadcrumbs";
import CalculatorLayout from "@/components/CalculatorLayout";

// All math is done in metric internally: distance in km, fuel in litres.
const KM_PER_MILE = 1.609344;
const LITRES_PER_US_GAL = 3.785411784;
const LITRES_PER_UK_GAL = 4.54609;

type EfficiencyUnit = "mpg_us" | "mpg_uk" | "l_100km" | "km_l";
type PriceUnit = "us_gal" | "uk_gal" | "litre";

export default function FuelCostCalculator() {
  const [distance, setDistance] = useState("100");
  const [distanceUnit, setDistanceUnit] = useState<"miles" | "km">("miles");
  const [efficiency, setEfficiency] = useState("30");
  const [efficiencyUnit, setEfficiencyUnit] = useState<EfficiencyUnit>("mpg_us");
  const [price, setPrice] = useState("3.50");
  const [priceUnit, setPriceUnit] = useState<PriceUnit>("us_gal");
  const [trips, setTrips] = useState("1");
  const [currency, setCurrency] = useState("$");

  const [result, setResult] = useState<{
    litres: number;
    fuelInPriceUnit: number;
    priceUnitLabel: string;
    tripCost: number;
    totalCost: number;
    costPerDistance: number;
    distanceUnitLabel: string;
  } | null>(null);

  useEffect(() => {
    const recent = JSON.parse(localStorage.getItem("recentCalculators") || "[]");
    const updated = ["fuel-cost", ...recent.filter((id: string) => id !== "fuel-cost")].slice(0, 10);
    localStorage.setItem("recentCalculators", JSON.stringify(updated));
  }, []);

  const calculate = () => {
    const dist = parseFloat(distance);
    const eff = parseFloat(efficiency);
    const pr = parseFloat(price);
    const numTrips = parseFloat(trips) || 1;

    if (!(dist > 0) || !(eff > 0) || !(pr >= 0)) {
      setResult(null);
      return;
    }

    const distanceKm = distanceUnit === "miles" ? dist * KM_PER_MILE : dist;

    // Convert the chosen fuel economy into litres consumed per kilometre.
    let litresPerKm: number;
    switch (efficiencyUnit) {
      case "mpg_us":
        litresPerKm = LITRES_PER_US_GAL / (eff * KM_PER_MILE);
        break;
      case "mpg_uk":
        litresPerKm = LITRES_PER_UK_GAL / (eff * KM_PER_MILE);
        break;
      case "l_100km":
        litresPerKm = eff / 100;
        break;
      case "km_l":
        litresPerKm = 1 / eff;
        break;
    }

    const litres = distanceKm * litresPerKm;

    // Convert the entered price into a price per litre.
    let pricePerLitre: number;
    let priceUnitLabel: string;
    let fuelInPriceUnit: number;
    switch (priceUnit) {
      case "us_gal":
        pricePerLitre = pr / LITRES_PER_US_GAL;
        priceUnitLabel = "US gallons";
        fuelInPriceUnit = litres / LITRES_PER_US_GAL;
        break;
      case "uk_gal":
        pricePerLitre = pr / LITRES_PER_UK_GAL;
        priceUnitLabel = "UK gallons";
        fuelInPriceUnit = litres / LITRES_PER_UK_GAL;
        break;
      case "litre":
        pricePerLitre = pr;
        priceUnitLabel = "litres";
        fuelInPriceUnit = litres;
        break;
    }

    const tripCost = litres * pricePerLitre;
    const totalCost = tripCost * numTrips;
    const distanceUnitLabel = distanceUnit === "miles" ? "mile" : "km";
    const costPerDistance = tripCost / dist;

    setResult({
      litres,
      fuelInPriceUnit,
      priceUnitLabel,
      tripCost,
      totalCost,
      costPerDistance,
      distanceUnitLabel,
    });
  };

  const inputClass =
    "w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500";
  const fmt = (n: number) => `${currency}${n.toFixed(2)}`;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Breadcrumbs
        items={[
          { label: "Everyday Calculators", href: "/everyday-calculators" },
          { label: "Fuel Cost Calculator", href: "/calculators/everyday/fuel-cost-calculator" },
        ]}
      />

      <CalculatorLayout
        title="Fuel Cost Calculator"
        description="Estimate the gas or petrol cost of any trip from distance, fuel economy, and price. Works with US and UK MPG, litres per 100km, and km per litre."
        explanation={
          <div>
            <p className="mb-4">
              This calculator works out how much fuel a journey uses and what it costs. It converts
              everything to a common metric base, so you can mix units freely: enter distance in miles
              or kilometres, fuel economy as MPG, litres per 100km, or km per litre, and price per
              gallon or per litre.
            </p>
            <p className="mb-4">
              <strong>How it works:</strong> Fuel used = distance divided by fuel economy. Trip cost =
              fuel used multiplied by the price of that fuel. The trips field multiplies the result, so
              you can turn a one-way figure into a round trip, a weekly commute, or a monthly total.
            </p>
            <p>
              Note that US and UK gallons are different sizes (a UK gallon is about 20% larger), which
              is why MPG figures and pump prices do not compare directly between the two. Picking the
              right unit matters.
            </p>
          </div>
        }
        faqs={[
          {
            question: "What is the difference between US MPG and UK MPG?",
            answer:
              "A UK gallon (4.546 litres) is larger than a US gallon (3.785 litres), so the same car shows a higher MPG figure in the UK. Always match the MPG type to where the figure came from, or the cost will be off by about 20%.",
          },
          {
            question: "How do I convert L/100km to MPG?",
            answer:
              "They move in opposite directions: a lower L/100km means better economy, while a higher MPG means better economy. This calculator handles the conversion for you, so just enter your number in whichever unit your car or country uses.",
          },
          {
            question: "How can I estimate my monthly fuel cost?",
            answer:
              "Enter your typical one-way commute distance and set the trips field to the number of one-way journeys you make in a month (for example 2 trips per work day times about 22 work days is 44). The total cost line then shows the monthly figure.",
          },
          {
            question: "Why is my real fuel cost higher than the estimate?",
            answer:
              "Stated fuel economy is measured under ideal conditions. City driving, heavy loads, air conditioning, cold weather, and aggressive acceleration all lower real-world economy, so treat the result as a planning estimate rather than an exact figure.",
          },
        ]}
        relatedCalculators={[
          { name: "Car Loan EMI Calculator", href: "/calculators/finance/car-loan-emi-calculator" },
          { name: "Car Lease vs Buy", href: "/calculators/finance/car-lease-vs-buy" },
          { name: "Electricity Cost Calculator", href: "/calculators/everyday/electricity-cost-calculator" },
        ]}
      >
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Trip Distance</label>
              <input type="number" value={distance} onChange={(e) => setDistance(e.target.value)} className={inputClass} placeholder="100" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Distance Unit</label>
              <select value={distanceUnit} onChange={(e) => setDistanceUnit(e.target.value as "miles" | "km")} className={inputClass}>
                <option value="miles">Miles</option>
                <option value="km">Kilometres</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Fuel Economy</label>
              <input type="number" value={efficiency} onChange={(e) => setEfficiency(e.target.value)} className={inputClass} placeholder="30" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Economy Unit</label>
              <select value={efficiencyUnit} onChange={(e) => setEfficiencyUnit(e.target.value as EfficiencyUnit)} className={inputClass}>
                <option value="mpg_us">MPG (US gallon)</option>
                <option value="mpg_uk">MPG (UK gallon)</option>
                <option value="l_100km">Litres per 100 km</option>
                <option value="km_l">Kilometres per litre</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Fuel Price</label>
              <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} className={inputClass} placeholder="3.50" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Price Unit</label>
              <select value={priceUnit} onChange={(e) => setPriceUnit(e.target.value as PriceUnit)} className={inputClass}>
                <option value="us_gal">Per US gallon</option>
                <option value="uk_gal">Per UK gallon</option>
                <option value="litre">Per litre</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Number of Trips</label>
              <input type="number" value={trips} onChange={(e) => setTrips(e.target.value)} className={inputClass} placeholder="1" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Currency Symbol</label>
              <select value={currency} onChange={(e) => setCurrency(e.target.value)} className={inputClass}>
                <option value="$">$ (USD / CAD)</option>
                <option value="£">£ (GBP)</option>
                <option value="€">€ (EUR)</option>
                <option value="₹">₹ (INR)</option>
              </select>
            </div>
          </div>

          <button
            onClick={calculate}
            className="w-full bg-primary-600 text-white py-4 rounded-lg font-semibold text-lg hover:bg-primary-700 transition-colors"
          >
            Calculate
          </button>

          {result && (
            <div className="mt-8 p-6 bg-green-50 rounded-lg border-2 border-green-200">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Results</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-3 border-b border-green-200">
                  <span className="text-gray-700">Fuel used (one trip)</span>
                  <span className="text-lg font-semibold text-gray-900">
                    {result.fuelInPriceUnit.toFixed(2)} {result.priceUnitLabel} ({result.litres.toFixed(2)} L)
                  </span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-green-200">
                  <span className="text-gray-700">Cost per trip</span>
                  <span className="text-lg font-semibold text-gray-900">{fmt(result.tripCost)}</span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-green-200">
                  <span className="text-gray-700">Cost per {result.distanceUnitLabel}</span>
                  <span className="text-lg font-semibold text-gray-900">{fmt(result.costPerDistance)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700 font-semibold">Total cost ({trips} trip{parseFloat(trips) === 1 ? "" : "s"})</span>
                  <span className="text-3xl font-bold text-green-600">{fmt(result.totalCost)}</span>
                </div>
              </div>
              <div className="mt-4 p-3 bg-white rounded-lg">
                <p className="text-center text-xs text-gray-500">
                  Estimate only, based on the figures you entered. Real-world fuel use varies with
                  driving style, traffic, load, and weather.
                </p>
              </div>
            </div>
          )}
        </div>
      </CalculatorLayout>
    </div>
  );
}
