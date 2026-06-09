// Region + locale configuration. Drives currency, date formatting, tax-year
// handling, language options and subdivisions (states/provinces). New regions
// are added here; calculators reference a region by code.

import type { RegionCode } from "./engine/types";

export interface Subdivision {
  code: string;
  name: string;
}

export interface Region {
  code: RegionCode;
  name: string;
  currency: string; // ISO 4217
  locale: string; // BCP 47
  dateFormat: "MM/DD/YYYY" | "DD/MM/YYYY" | "YYYY-MM-DD";
  taxYear: { type: "calendar" | "uk_april"; label: string };
  languages: string[]; // priority order; first is default
  subdivisions?: Subdivision[];
}

export const REGIONS: Record<RegionCode, Region> = {
  US: {
    code: "US",
    name: "United States",
    currency: "USD",
    locale: "en-US",
    dateFormat: "MM/DD/YYYY",
    taxYear: { type: "calendar", label: "Calendar year (Jan–Dec)" },
    languages: ["en", "es", "zh", "hi", "ar", "vi"],
    subdivisions: [
      { code: "CA", name: "California" },
      { code: "NY", name: "New York" },
      { code: "TX", name: "Texas" },
      { code: "FL", name: "Florida" },
      { code: "IL", name: "Illinois" },
      { code: "NJ", name: "New Jersey" },
      { code: "PA", name: "Pennsylvania" },
      { code: "MI", name: "Michigan" },
      { code: "MA", name: "Massachusetts" },
      { code: "WA", name: "Washington" },
    ],
  },
  UK: {
    code: "UK",
    name: "United Kingdom",
    currency: "GBP",
    locale: "en-GB",
    dateFormat: "DD/MM/YYYY",
    taxYear: { type: "uk_april", label: "6 April – 5 April" },
    languages: ["en", "pl", "ur", "ar", "pa"],
    subdivisions: [
      { code: "ENG", name: "England" },
      { code: "SCT", name: "Scotland" },
      { code: "WLS", name: "Wales" },
      { code: "NIR", name: "Northern Ireland" },
    ],
  },
  CA: {
    code: "CA",
    name: "Canada",
    currency: "CAD",
    locale: "en-CA",
    dateFormat: "YYYY-MM-DD",
    taxYear: { type: "calendar", label: "Calendar year (Jan–Dec)" },
    languages: ["en", "fr", "pa", "zh", "ar", "tl"],
    subdivisions: [
      { code: "ON", name: "Ontario" },
      { code: "QC", name: "Quebec" },
      { code: "BC", name: "British Columbia" },
      { code: "AB", name: "Alberta" },
      { code: "MB", name: "Manitoba" },
      { code: "SK", name: "Saskatchewan" },
      { code: "NS", name: "Nova Scotia" },
      { code: "NB", name: "New Brunswick" },
    ],
  },
};

export function getRegion(code: RegionCode): Region {
  return REGIONS[code];
}

export function localeForRegion(code: RegionCode): { locale: string; currency: string } {
  const r = REGIONS[code];
  return { locale: r.locale, currency: r.currency };
}
