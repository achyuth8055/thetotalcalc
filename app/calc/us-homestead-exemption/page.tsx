"use client";

import { useState, useMemo } from "react";
import Link from "next/link";

// ─── SVG Icon library ─────────────────────────────────────────────────────────

const Icon = {
  MapPin: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
      <circle cx="12" cy="9" r="2.5"/>
    </svg>
  ),
  Home: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
      <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z"/>
      <path d="M9 21V12h6v9"/>
    </svg>
  ),
  HomeLg: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z"/>
      <path d="M9 21V12h6v9"/>
    </svg>
  ),
  User: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
      <circle cx="12" cy="8" r="4"/>
      <path d="M4 20c0-4 3.58-7 8-7s8 3 8 7"/>
    </svg>
  ),
  Shield: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <path d="M12 2L4 6v6c0 5.25 3.5 10.15 8 11.5C16.5 22.15 20 17.25 20 12V6l-8-4z"/>
      <path d="M9 12l2 2 4-4"/>
    </svg>
  ),
  Accessibility: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <circle cx="12" cy="4" r="1.5"/>
      <path d="M7 8h10M12 8v5l3 3"/>
      <path d="M9 21l1.5-4.5L12 18l1.5-1.5L15 21"/>
    </svg>
  ),
  Senior: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <circle cx="12" cy="7" r="3.5"/>
      <path d="M5 21c0-3.87 3.13-7 7-7s7 3.13 7 7"/>
      <path d="M8 21l1.5-5M16 21l-1.5-5"/>
    </svg>
  ),
  Info: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <circle cx="12" cy="12" r="9"/>
      <line x1="12" y1="8" x2="12" y2="8.5"/>
      <line x1="12" y1="11" x2="12" y2="16"/>
    </svg>
  ),
  CheckCircle: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <circle cx="12" cy="12" r="9"/>
      <path d="M8 12l3 3 5-5"/>
    </svg>
  ),
  AlertTriangle: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
      <line x1="12" y1="9" x2="12" y2="13"/>
      <line x1="12" y1="17" x2="12.01" y2="17"/>
    </svg>
  ),
  XCircle: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <circle cx="12" cy="12" r="9"/>
      <line x1="9" y1="9" x2="15" y2="15"/>
      <line x1="15" y1="9" x2="9" y2="15"/>
    </svg>
  ),
  Clipboard: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"/>
      <rect x="9" y="3" width="6" height="4" rx="1"/>
      <line x1="9" y1="12" x2="15" y2="12"/>
      <line x1="9" y1="16" x2="12" y2="16"/>
    </svg>
  ),
  Clock: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
      <circle cx="12" cy="12" r="9"/>
      <polyline points="12 7 12 12 15 14"/>
    </svg>
  ),
  Mail: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
      <polyline points="22,6 12,13 2,6"/>
    </svg>
  ),
  Download: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
      <polyline points="7 10 12 15 17 10"/>
      <line x1="12" y1="15" x2="12" y2="3"/>
    </svg>
  ),
  Check: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  ),
  ChevronDown: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
      <polyline points="6 9 12 15 18 9"/>
    </svg>
  ),
  TrendDown: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
      <polyline points="23 18 13.5 8.5 8.5 13.5 1 6"/>
      <polyline points="17 18 23 18 23 12"/>
    </svg>
  ),
  TrendUp: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
      <polyline points="17 6 23 6 23 12"/>
    </svg>
  ),
  Savings: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/>
      <circle cx="12" cy="12" r="5"/>
    </svg>
  ),
  Search: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
      <circle cx="11" cy="11" r="7"/>
      <line x1="21" y1="21" x2="16.65" y2="16.65"/>
    </svg>
  ),
  Steps: {
    Find: () => (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
        <circle cx="11" cy="11" r="7"/>
        <line x1="21" y1="21" x2="16.65" y2="16.65"/>
      </svg>
    ),
    Form: () => (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
        <polyline points="14 2 14 8 20 8"/>
        <line x1="9" y1="13" x2="15" y2="13"/>
        <line x1="9" y1="17" x2="13" y2="17"/>
      </svg>
    ),
    Docs: () => (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
        <path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48"/>
      </svg>
    ),
    Send: () => (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
        <line x1="22" y1="2" x2="11" y2="13"/>
        <polygon points="22 2 15 22 11 13 2 9 22 2"/>
      </svg>
    ),
  },
};

// ─── State data ───────────────────────────────────────────────────────────────

const STATE_DATA: Record<string, {
  name: string;
  effRate: number;
  base: number;
  senior: number;
  seniorIncomeLimit: number;
  veteran: number;
  disability: number;
  notes: string;
  deadline?: string;
}> = {
  AL: { name: "Alabama", effRate: 0.40, base: 4000, senior: 0, seniorIncomeLimit: 0, veteran: 0, disability: 0, notes: "$4,000 off assessed value for owner-occupied primary residences.", deadline: "October 1" },
  AK: { name: "Alaska", effRate: 1.04, base: 0, senior: 150000, seniorIncomeLimit: 0, veteran: 0, disability: 0, notes: "No base exemption; seniors 65+ get a $150,000 exemption from assessed value.", deadline: "January 15" },
  AZ: { name: "Arizona", effRate: 0.62, base: 3000, senior: 0, seniorIncomeLimit: 0, veteran: 3000, disability: 3000, notes: "$3,000 base exemption; qualifying veterans and disabled persons receive an additional $3,000.", deadline: "March 1" },
  AR: { name: "Arkansas", effRate: 0.61, base: 375, senior: 0, seniorIncomeLimit: 0, veteran: 0, disability: 0, notes: "$375 annual credit applied directly to the tax bill for primary residence owners.", deadline: "October 15" },
  CA: { name: "California", effRate: 0.71, base: 7000, senior: 0, seniorIncomeLimit: 0, veteran: 4000, disability: 0, notes: "$7,000 off assessed value. Proposition 19 allows seniors 55+ to transfer their base year value.", deadline: "February 15" },
  CO: { name: "Colorado", effRate: 0.49, base: 0, senior: 200000, seniorIncomeLimit: 72000, veteran: 0, disability: 0, notes: "50% exemption on first $400,000 (up to $200,000) for homeowners age 65+ with income ≤ $72,000.", deadline: "July 15" },
  CT: { name: "Connecticut", effRate: 1.79, base: 1000, senior: 2000, seniorIncomeLimit: 40300, veteran: 0, disability: 0, notes: "$1,000 base exemption; additional $2,000 for seniors with income ≤ $40,300.", deadline: "October 1" },
  DE: { name: "Delaware", effRate: 0.55, base: 0, senior: 500, seniorIncomeLimit: 0, veteran: 0, disability: 0, notes: "$500 senior credit applied at county level for homeowners 65+.", deadline: "April 30" },
  FL: { name: "Florida", effRate: 0.86, base: 50000, senior: 25000, seniorIncomeLimit: 35167, veteran: 5000, disability: 5000, notes: "Up to $50,000 base exemption; additional $25,000 senior exemption for low-income age 65+; $5,000 for veterans.", deadline: "March 1" },
  GA: { name: "Georgia", effRate: 0.87, base: 2000, senior: 10000, seniorIncomeLimit: 0, veteran: 0, disability: 0, notes: "$2,000 base exemption; $10,000 school tax exemption for seniors 62+.", deadline: "April 1" },
  HI: { name: "Hawaii", effRate: 0.29, base: 100000, senior: 140000, seniorIncomeLimit: 0, veteran: 0, disability: 0, notes: "$100,000 base exemption; increases to $140,000 for homeowners 65+.", deadline: "December 31" },
  ID: { name: "Idaho", effRate: 0.69, base: 125000, senior: 0, seniorIncomeLimit: 37000, veteran: 0, disability: 0, notes: "$125,000 exemption; requires household income ≤ $37,000 to qualify.", deadline: "April 15" },
  IL: { name: "Illinois", effRate: 2.08, base: 10000, senior: 8000, seniorIncomeLimit: 0, veteran: 5000, disability: 0, notes: "$10,000 General Homestead; $8,000 additional for seniors; multiple Senior Freeze programs available.", deadline: "October 1" },
  IN: { name: "Indiana", effRate: 0.84, base: 48000, senior: 12480, seniorIncomeLimit: 30000, veteran: 14000, disability: 12480, notes: "$48,000 base exemption; senior exemption requires age 65+ and income ≤ $30,000.", deadline: "May 10" },
  IA: { name: "Iowa", effRate: 1.50, base: 4850, senior: 0, seniorIncomeLimit: 0, veteran: 0, disability: 0, notes: "Homestead credit of up to $4,850 reduction in assessed value.", deadline: "July 1" },
  KS: { name: "Kansas", effRate: 1.41, base: 20000, senior: 0, seniorIncomeLimit: 40000, veteran: 0, disability: 0, notes: "$20,000 exemption; household income must be ≤ $40,000 to qualify.", deadline: "March 15" },
  KY: { name: "Kentucky", effRate: 0.80, base: 46350, senior: 0, seniorIncomeLimit: 0, veteran: 0, disability: 0, notes: "$46,350 exemption from assessed value for primary residences; no income limit.", deadline: "December 31" },
  LA: { name: "Louisiana", effRate: 0.55, base: 75000, senior: 0, seniorIncomeLimit: 0, veteran: 0, disability: 0, notes: "$75,000 homestead exemption from assessed property value.", deadline: "December 31" },
  ME: { name: "Maine", effRate: 1.09, base: 25000, senior: 0, seniorIncomeLimit: 0, veteran: 6000, disability: 0, notes: "$25,000 base exemption; $6,000 additional for qualifying veterans.", deadline: "April 1" },
  MD: { name: "Maryland", effRate: 1.07, base: 0, senior: 0, seniorIncomeLimit: 0, veteran: 0, disability: 0, notes: "Maryland caps annual assessment increases at 10% (Homestead Tax Credit) rather than a fixed dollar exemption.", deadline: "October 1" },
  MA: { name: "Massachusetts", effRate: 1.12, base: 100000, senior: 175000, seniorIncomeLimit: 0, veteran: 400, disability: 0, notes: "$100,000 base exemption; Clause 41C gives seniors age 65+ up to $175,000 exemption.", deadline: "March 1" },
  MI: { name: "Michigan", effRate: 1.54, base: 0, senior: 0, seniorIncomeLimit: 0, veteran: 0, disability: 0, notes: "Michigan's Principal Residence Exemption caps the school millage rate — reduces school tax portion significantly.", deadline: "May 1" },
  MN: { name: "Minnesota", effRate: 1.02, base: 0, senior: 0, seniorIncomeLimit: 0, veteran: 0, disability: 0, notes: "Homestead classification reduces taxable market value by up to 33%. Automatic for primary residences.", deadline: "December 1" },
  MS: { name: "Mississippi", effRate: 0.65, base: 300, senior: 0, seniorIncomeLimit: 0, veteran: 0, disability: 0, notes: "$300 homestead credit applied directly to the tax bill.", deadline: "April 1" },
  MO: { name: "Missouri", effRate: 0.93, base: 0, senior: 30000, seniorIncomeLimit: 30000, veteran: 0, disability: 0, notes: "Senior Circuit Breaker program provides relief for income ≤ $30,000; no base exemption.", deadline: "May 30" },
  MT: { name: "Montana", effRate: 0.74, base: 0, senior: 0, seniorIncomeLimit: 45000, veteran: 0, disability: 0, notes: "Property Tax Assistance Program for seniors/disabled with income ≤ $45,000.", deadline: "March 1" },
  NE: { name: "Nebraska", effRate: 1.61, base: 0, senior: 0, seniorIncomeLimit: 52800, veteran: 0, disability: 0, notes: "Homestead exemption for seniors and disabled persons with income ≤ $52,800.", deadline: "June 30" },
  NV: { name: "Nevada", effRate: 0.48, base: 0, senior: 0, seniorIncomeLimit: 0, veteran: 2000, disability: 0, notes: "$2,000 veteran exemption from assessed value; no general homestead exemption.", deadline: "July 1" },
  NH: { name: "New Hampshire", effRate: 2.09, base: 0, senior: 0, seniorIncomeLimit: 0, veteran: 0, disability: 0, notes: "No statewide homestead exemption. Individual municipalities may offer local property tax relief.", deadline: "April 15" },
  NJ: { name: "New Jersey", effRate: 2.21, base: 0, senior: 250, seniorIncomeLimit: 0, veteran: 250, disability: 0, notes: "$250 deductions for seniors and veterans from tax bill. Senior Freeze available.", deadline: "October 1" },
  NM: { name: "New Mexico", effRate: 0.67, base: 2000, senior: 0, seniorIncomeLimit: 0, veteran: 4000, disability: 0, notes: "$2,000 base exemption; $4,000 additional veteran exemption.", deadline: "April 1" },
  NY: { name: "New York", effRate: 1.40, base: 30000, senior: 50000, seniorIncomeLimit: 93200, veteran: 5400, disability: 0, notes: "Basic STAR for all homeowners; Enhanced STAR ($50k) for seniors with income ≤ $93,200.", deadline: "March 1" },
  NC: { name: "North Carolina", effRate: 0.80, base: 25000, senior: 50000, seniorIncomeLimit: 33800, veteran: 45000, disability: 0, notes: "$25,000 base; elderly/disabled get $50,000 exemption with income ≤ $33,800; disabled veterans may qualify for full exemption.", deadline: "June 1" },
  ND: { name: "North Dakota", effRate: 0.98, base: 9000, senior: 0, seniorIncomeLimit: 0, veteran: 0, disability: 0, notes: "$9,000 homestead credit for primary residence.", deadline: "February 1" },
  OH: { name: "Ohio", effRate: 1.41, base: 25000, senior: 25000, seniorIncomeLimit: 36100, veteran: 0, disability: 0, notes: "$25,000 base plus additional $25,000 for seniors with income ≤ $36,100.", deadline: "June 1" },
  OK: { name: "Oklahoma", effRate: 0.85, base: 1000, senior: 0, seniorIncomeLimit: 0, veteran: 0, disability: 0, notes: "$1,000 homestead exemption; additional senior freeze program available.", deadline: "March 15" },
  OR: { name: "Oregon", effRate: 0.82, base: 0, senior: 0, seniorIncomeLimit: 26280, veteran: 0, disability: 0, notes: "Property Tax Deferral program for seniors/disabled with income ≤ $26,280.", deadline: "April 15" },
  PA: { name: "Pennsylvania", effRate: 1.49, base: 0, senior: 0, seniorIncomeLimit: 45000, veteran: 0, disability: 0, notes: "Homestead exclusion varies by school district; Senior Rebate for income ≤ $45,000.", deadline: "June 1" },
  RI: { name: "Rhode Island", effRate: 1.53, base: 0, senior: 0, seniorIncomeLimit: 0, veteran: 0, disability: 0, notes: "Exemptions vary by municipality — check your city or town assessor.", deadline: "Varies by city" },
  SC: { name: "South Carolina", effRate: 0.55, base: 50000, senior: 0, seniorIncomeLimit: 0, veteran: 0, disability: 0, notes: "$50,000 exemption for legal residence; no income limit.", deadline: "January 15" },
  SD: { name: "South Dakota", effRate: 1.14, base: 0, senior: 0, seniorIncomeLimit: 16000, veteran: 0, disability: 0, notes: "Assessment freeze for low-income seniors with income ≤ $16,000.", deadline: "April 1" },
  TN: { name: "Tennessee", effRate: 0.66, base: 25000, senior: 0, seniorIncomeLimit: 43560, veteran: 0, disability: 0, notes: "$25,000 exemption; household income must be ≤ $43,560 to qualify.", deadline: "April 5" },
  TX: { name: "Texas", effRate: 1.68, base: 100000, senior: 60000, seniorIncomeLimit: 0, veteran: 12000, disability: 12000, notes: "$100,000 base exemption; additional $60,000 school tax exemption for age 65+.", deadline: "April 30" },
  UT: { name: "Utah", effRate: 0.57, base: 0, senior: 0, seniorIncomeLimit: 38369, veteran: 0, disability: 0, notes: "Circuit Breaker property tax credit for low-income seniors with income ≤ $38,369.", deadline: "September 1" },
  VT: { name: "Vermont", effRate: 1.83, base: 0, senior: 0, seniorIncomeLimit: 0, veteran: 0, disability: 0, notes: "Homestead declaration + income sensitivity adjustment reduces school property tax.", deadline: "April 15" },
  VA: { name: "Virginia", effRate: 0.82, base: 0, senior: 0, seniorIncomeLimit: 75000, veteran: 0, disability: 0, notes: "Many localities offer senior/disability relief with income ≤ $75,000; varies by city/county.", deadline: "April 1" },
  WA: { name: "Washington", effRate: 0.84, base: 0, senior: 60000, seniorIncomeLimit: 58423, veteran: 0, disability: 0, notes: "Senior exemption up to $60,000 for homeowners with income ≤ $58,423.", deadline: "December 31" },
  WV: { name: "West Virginia", effRate: 0.58, base: 20000, senior: 0, seniorIncomeLimit: 0, veteran: 0, disability: 0, notes: "$20,000 homestead exemption for homeowners age 65+ or permanently disabled.", deadline: "December 1" },
  WI: { name: "Wisconsin", effRate: 1.61, base: 0, senior: 0, seniorIncomeLimit: 0, veteran: 0, disability: 0, notes: "Homestead Credit for low-income homeowners based on property taxes and household income.", deadline: "October 15" },
  WY: { name: "Wyoming", effRate: 0.57, base: 0, senior: 3000, seniorIncomeLimit: 41012, veteran: 3000, disability: 0, notes: "Senior and veteran exemptions up to $3,000 for qualifying households with income ≤ $41,012.", deadline: "March 1" },
  DC: { name: "Washington D.C.", effRate: 0.56, base: 84550, senior: 50000, seniorIncomeLimit: 0, veteran: 0, disability: 0, notes: "$84,550 base exemption; additional senior exemption for age 65+.", deadline: "April 1" },
};

const NATIONAL_AVG_RATE = 1.1;

const STATE_LIST = Object.entries(STATE_DATA)
  .map(([code, data]) => ({ code, name: data.name }))
  .sort((a, b) => a.name.localeCompare(b.name));

const fmt = (v: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(v);

type ProgramStatus = "qualifies" | "check_income" | "not_eligible";

interface Program {
  name: string;
  iconType: "home" | "senior" | "shield" | "accessibility" | "info";
  status: ProgramStatus;
  exemption: number;
  reason: string;
}

// ─── Toggle component ─────────────────────────────────────────────────────────

function Toggle({ checked, onChange, accent = "primary" }: {
  checked: boolean;
  onChange: (v: boolean) => void;
  accent?: "primary" | "blue" | "purple";
}) {
  const trackColor = {
    primary: checked ? "bg-primary" : "bg-surface-container-high",
    blue: checked ? "bg-blue-500" : "bg-surface-container-high",
    purple: checked ? "bg-purple-500" : "bg-surface-container-high",
  }[accent];

  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative h-6 w-11 flex-shrink-0 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary/40 ${trackColor}`}
    >
      <span className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${checked ? "translate-x-5" : "translate-x-0"}`} />
    </button>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function HomesteadExemptionPage() {
  const [stateCode, setStateCode] = useState("FL");
  const [primaryResidence, setPrimaryResidence] = useState(true);
  const [age, setAge] = useState(45);
  const [isVeteran, setIsVeteran] = useState(false);
  const [hasDisability, setHasDisability] = useState(false);
  const [income, setIncome] = useState(50000);
  const [homeValue, setHomeValue] = useState(350000);

  const sd = STATE_DATA[stateCode];

  const programs = useMemo<Program[]>(() => {
    const list: Program[] = [];
    if (!primaryResidence) {
      list.push({ name: "Base Homestead Exemption", iconType: "home", status: "not_eligible", exemption: 0, reason: "Homestead exemptions only apply to your primary residence." });
      return list;
    }
    if (sd.base > 0) {
      list.push({ name: "Base Homestead Exemption", iconType: "home", status: "qualifies", exemption: sd.base, reason: `${sd.name} offers a ${fmt(sd.base)} exemption for all qualifying primary-residence homeowners.` });
    }
    if (age >= 65 && sd.senior > 0) {
      const ok = sd.seniorIncomeLimit === 0 || income <= sd.seniorIncomeLimit;
      list.push({
        name: "Senior Exemption (Age 65+)", iconType: "senior",
        status: ok ? "qualifies" : "check_income",
        exemption: ok ? sd.senior : 0,
        reason: ok
          ? `Additional ${fmt(sd.senior)} exemption for homeowners age 65+.`
          : `Available, but income limit is ${fmt(sd.seniorIncomeLimit)}. Your income (${fmt(income)}) may exceed the limit.`,
      });
    }
    if (isVeteran && sd.veteran > 0) {
      list.push({ name: "Veteran / Military Exemption", iconType: "shield", status: "qualifies", exemption: sd.veteran, reason: `${sd.name} provides a ${fmt(sd.veteran)} exemption for qualifying veterans and active-duty service members.` });
    }
    if (hasDisability && sd.disability > 0) {
      list.push({ name: "Disability Exemption", iconType: "accessibility", status: "qualifies", exemption: sd.disability, reason: `${sd.name} provides a ${fmt(sd.disability)} exemption for homeowners with a qualifying permanent disability.` });
    }
    if (list.length === 0) {
      list.push({ name: "No Standard Dollar Exemption", iconType: "info", status: "not_eligible", exemption: 0, reason: sd.notes });
    }
    return list;
  }, [stateCode, primaryResidence, age, isVeteran, hasDisability, income, sd]);

  const { totalExemption, annualSavings, taxWithout, taxWith } = useMemo(() => {
    const total = programs.filter(p => p.status === "qualifies").reduce((s, p) => s + p.exemption, 0);
    const taxWithout = homeValue * sd.effRate / 100;
    const taxWith = Math.max(0, (homeValue - Math.min(total, homeValue)) * sd.effRate / 100);
    return { totalExemption: total, annualSavings: taxWithout - taxWith, taxWithout, taxWith };
  }, [programs, homeValue, sd]);

  const hasSavings = annualSavings > 0;
  const qualifyCount = programs.filter(p => p.status === "qualifies").length;
  const rateBelow = sd.effRate < NATIONAL_AVG_RATE;
  const rateDiff = Math.abs(sd.effRate - NATIONAL_AVG_RATE).toFixed(2);

  const STEP_ICONS = [Icon.Steps.Find, Icon.Steps.Form, Icon.Steps.Docs, Icon.Steps.Send];

  return (
    <>
      {/* ── Header ───────────────────────────────────────────────────────────── */}
      <header className="border-b border-surface-border bg-surface-container-low pb-stack-lg pt-stack-lg print:hidden">
        <div className="mx-auto max-w-container-max px-margin-mobile md:px-margin-desktop">
          <nav className="mb-stack-md" aria-label="Breadcrumb">
            <ol className="flex flex-wrap items-center gap-stack-sm text-label-sm text-on-surface-variant">
              <li><Link href="/" className="hover:text-primary">Home</Link></li>
              <li className="material-symbols-outlined text-sm leading-none">chevron_right</li>
              <li><Link href="/calculators" className="hover:text-primary">Calculators</Link></li>
              <li className="material-symbols-outlined text-sm leading-none">chevron_right</li>
              <li className="font-bold text-primary">Homestead Exemption Checker</li>
            </ol>
          </nav>
          <div className="flex items-start justify-between flex-wrap gap-3">
            <div>
              <h1 className="mb-unit text-headline-lg text-primary">Homestead Exemption Checker</h1>
              <p className="max-w-2xl text-body-md text-on-surface-variant">
                See exactly which property tax exemptions you qualify for — base, senior, veteran, and disability programs — all 50 states plus D.C.
              </p>
            </div>
            <button
              onClick={() => window.print()}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-surface-border rounded-lg text-label-sm text-on-surface-variant hover:bg-surface-container-low transition-colors"
            >
              <Icon.Download />
              Download PDF
            </button>
          </div>
        </div>
      </header>

      {/* ── Main ─────────────────────────────────────────────────────────────── */}
      <main className="mx-auto max-w-6xl px-margin-mobile py-stack-lg md:px-margin-desktop">
        <div className="grid lg:grid-cols-2 gap-6">

          {/* ══ LEFT COLUMN: Inputs ══════════════════════════════════════════ */}
          <div className="flex flex-col gap-5">

            {/* ── State selector ───────────────────────────────────────────── */}
            <div className="premium-card rounded-xl bg-white p-6">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-on-surface-variant"><Icon.MapPin /></span>
                <h2 className="text-label-sm font-semibold uppercase tracking-widest text-on-surface-variant">Your Location</h2>
              </div>

              <label className="block text-label-md text-primary mb-2">State</label>
              <select
                value={stateCode}
                onChange={e => setStateCode(e.target.value)}
                className="w-full rounded-lg border border-surface-border bg-white px-4 py-3 text-body-md text-on-surface outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
              >
                {STATE_LIST.map(s => (
                  <option key={s.code} value={s.code}>{s.name}</option>
                ))}
              </select>

              {/* Rate badge */}
              <div className={`mt-3 rounded-lg border px-4 py-3 flex items-center justify-between ${rateBelow ? "bg-green-50 border-green-200" : "bg-orange-50 border-orange-200"}`}>
                <div>
                  <p className="text-label-sm text-on-surface-variant">Effective Tax Rate</p>
                  <p className={`text-headline-sm font-bold ${rateBelow ? "text-green-700" : "text-orange-700"}`}>{sd.effRate.toFixed(2)}%</p>
                </div>
                <div className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 ${rateBelow ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"}`}>
                  {rateBelow ? <Icon.TrendDown /> : <Icon.TrendUp />}
                  <span className="text-label-sm font-semibold">{rateDiff}% {rateBelow ? "below" : "above"} avg</span>
                </div>
              </div>
            </div>

            {/* ── Property details ─────────────────────────────────────────── */}
            <div className="premium-card rounded-xl bg-white p-6">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-on-surface-variant"><Icon.HomeLg /></span>
                <h2 className="text-label-sm font-semibold uppercase tracking-widest text-on-surface-variant">Property Details</h2>
              </div>

              {/* Primary residence toggle */}
              <div className={`mb-5 flex items-center justify-between rounded-xl border-2 px-4 py-3 transition-all cursor-pointer ${primaryResidence ? "border-primary bg-primary/5" : "border-surface-border bg-white"}`}
                onClick={() => setPrimaryResidence(!primaryResidence)}>
                <div>
                  <p className="text-label-md font-semibold text-on-surface">Primary Residence</p>
                  <p className="text-label-sm text-on-surface-variant">This is my main home</p>
                </div>
                <Toggle checked={primaryResidence} onChange={setPrimaryResidence} accent="primary" />
              </div>

              {/* Home value */}
              <div className="mb-5">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-label-md text-primary">Estimated Home Value</label>
                  <input type="number" value={homeValue}
                    onChange={e => setHomeValue(Math.max(0, Number(e.target.value) || 0))}
                    className="w-32 rounded-lg border border-surface-border px-3 py-1.5 text-right text-label-md font-semibold text-primary outline-none focus:border-primary focus:ring-1 focus:ring-primary" />
                </div>
                <input type="range" min={50000} max={2000000} step={5000} value={homeValue}
                  onChange={e => setHomeValue(Number(e.target.value))}
                  className="w-full h-2 bg-surface-container-high rounded-full appearance-none cursor-pointer accent-primary" />
                <div className="flex justify-between text-label-sm text-on-surface-variant mt-1"><span>$50k</span><span>$2M</span></div>
              </div>

              {/* Income */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-label-md text-primary">Annual Household Income</label>
                  <input type="number" value={income}
                    onChange={e => setIncome(Math.max(0, Number(e.target.value) || 0))}
                    className="w-32 rounded-lg border border-surface-border px-3 py-1.5 text-right text-label-md font-semibold text-primary outline-none focus:border-primary focus:ring-1 focus:ring-primary" />
                </div>
                <input type="range" min={0} max={200000} step={1000} value={income}
                  onChange={e => setIncome(Number(e.target.value))}
                  className="w-full h-2 bg-surface-container-high rounded-full appearance-none cursor-pointer accent-primary" />
                <div className="flex justify-between text-label-sm text-on-surface-variant mt-1"><span>$0</span><span>$200k</span></div>
                <p className="text-label-sm text-on-surface-variant mt-1">Used to check income-limited programs.</p>
              </div>
            </div>

            {/* ── Profile ──────────────────────────────────────────────────── */}
            <div className="premium-card rounded-xl bg-white p-6">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-on-surface-variant"><Icon.User /></span>
                <h2 className="text-label-sm font-semibold uppercase tracking-widest text-on-surface-variant">Your Profile</h2>
              </div>

              {/* Age */}
              <div className="mb-5">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-label-md text-primary">Your Age</label>
                  <div className="flex items-center gap-2">
                    <input type="number" min={18} max={100} value={age}
                      onChange={e => setAge(Math.min(100, Math.max(18, Number(e.target.value) || 18)))}
                      className="w-20 rounded-lg border border-surface-border px-3 py-1.5 text-right text-label-md font-semibold text-primary outline-none focus:border-primary focus:ring-1 focus:ring-primary" />
                    {age >= 65 && (
                      <span className="flex items-center gap-1 rounded-full bg-green-100 px-2.5 py-0.5 text-label-sm font-semibold text-green-700">
                        <Icon.Check />
                        Senior
                      </span>
                    )}
                  </div>
                </div>
                <input type="range" min={18} max={100} value={age}
                  onChange={e => setAge(Number(e.target.value))}
                  className="w-full h-2 bg-surface-container-high rounded-full appearance-none cursor-pointer accent-primary" />
                <div className="flex justify-between text-label-sm text-on-surface-variant mt-1">
                  <span>18</span>
                  <span className="text-primary font-medium">65+ unlocks senior programs</span>
                  <span>100</span>
                </div>
              </div>

              {/* Veteran toggle */}
              <div
                className={`mb-3 flex cursor-pointer items-center justify-between rounded-xl border-2 px-4 py-3 transition-all ${isVeteran ? "border-blue-400 bg-blue-50" : "border-surface-border bg-white"}`}
                onClick={() => setIsVeteran(!isVeteran)}>
                <div className="flex items-center gap-3">
                  <span className={isVeteran ? "text-blue-600" : "text-on-surface-variant"}><Icon.Shield /></span>
                  <div>
                    <p className="text-label-md font-semibold text-on-surface">Veteran or Active Military</p>
                    <p className="text-label-sm text-on-surface-variant">May receive an additional exemption</p>
                  </div>
                </div>
                <Toggle checked={isVeteran} onChange={setIsVeteran} accent="blue" />
              </div>

              {/* Disability toggle */}
              <div
                className={`flex cursor-pointer items-center justify-between rounded-xl border-2 px-4 py-3 transition-all ${hasDisability ? "border-purple-400 bg-purple-50" : "border-surface-border bg-white"}`}
                onClick={() => setHasDisability(!hasDisability)}>
                <div className="flex items-center gap-3">
                  <span className={hasDisability ? "text-purple-600" : "text-on-surface-variant"}><Icon.Accessibility /></span>
                  <div>
                    <p className="text-label-md font-semibold text-on-surface">Qualifying Disability</p>
                    <p className="text-label-sm text-on-surface-variant">Permanent disability recognized by your state</p>
                  </div>
                </div>
                <Toggle checked={hasDisability} onChange={setHasDisability} accent="purple" />
              </div>
            </div>
          </div>

          {/* ══ RIGHT COLUMN: Results ════════════════════════════════════════ */}
          <div className="flex flex-col gap-5">

            {/* ── Savings hero ─────────────────────────────────────────────── */}
            <div className={`rounded-2xl p-6 ${hasSavings ? "bg-gradient-to-br from-green-500 to-emerald-600 text-white" : "bg-surface-container-low border border-surface-border"}`}>
              {hasSavings ? (
                <>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-green-200"><Icon.Savings /></span>
                    <p className="text-sm font-medium text-green-100">Estimated Annual Tax Savings</p>
                  </div>
                  <p className="text-5xl font-bold text-white mb-4">{fmt(annualSavings)}</p>
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="bg-white/20 rounded-xl p-3">
                      <p className="text-xs text-green-100 mb-0.5">Without Exemption</p>
                      <p className="text-lg font-bold line-through opacity-60">{fmt(taxWithout)}/yr</p>
                    </div>
                    <div className="bg-white/20 rounded-xl p-3">
                      <p className="text-xs text-green-100 mb-0.5">With Exemption</p>
                      <p className="text-lg font-bold">{fmt(taxWith)}/yr</p>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs text-green-100 mb-1.5">
                      <span>Tax reduction</span>
                      <span>{taxWithout > 0 ? Math.round((annualSavings / taxWithout) * 100) : 0}%</span>
                    </div>
                    <div className="w-full bg-white/20 rounded-full h-2">
                      <div className="bg-white rounded-full h-2 transition-all duration-500"
                        style={{ width: `${taxWithout > 0 ? Math.min(100, (annualSavings / taxWithout) * 100) : 0}%` }} />
                    </div>
                  </div>
                  <p className="mt-3 text-xs text-green-100">
                    Total exemption: {fmt(totalExemption)} · {sd.name} rate: {sd.effRate.toFixed(2)}%
                  </p>
                </>
              ) : (
                <div className="text-center py-6">
                  <span className="inline-flex p-4 rounded-full bg-surface-container mb-3 text-on-surface-variant"><Icon.Search /></span>
                  <p className="text-headline-sm text-primary font-bold mb-2">No Fixed Dollar Exemption</p>
                  <p className="text-body-md text-on-surface-variant">{sd.name} provides relief through a different mechanism — see state notes below.</p>
                </div>
              )}
            </div>

            {/* ── Program cards ────────────────────────────────────────────── */}
            <div className="premium-card rounded-xl bg-white p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-label-sm font-semibold uppercase tracking-widest text-on-surface-variant">Programs You Qualify For</h2>
                {qualifyCount > 0 && (
                  <span className="rounded-full bg-green-100 px-3 py-1 text-label-sm font-bold text-green-700">
                    {qualifyCount} program{qualifyCount !== 1 ? "s" : ""}
                  </span>
                )}
              </div>
              <div className="flex flex-col gap-3">
                {programs.map(prog => (
                  <ProgramCard key={prog.name} program={prog} />
                ))}
              </div>
            </div>

            {/* ── State notes ──────────────────────────────────────────────── */}
            <div className="rounded-xl border border-surface-border bg-surface-container-low p-5">
              <div className="flex items-start gap-3">
                <span className="mt-0.5 flex-shrink-0 text-primary"><Icon.Clipboard /></span>
                <div>
                  <p className="text-label-md font-semibold text-primary mb-1">{sd.name} — State Notes</p>
                  <p className="text-body-md text-on-surface-variant">{sd.notes}</p>
                  {sd.deadline && (
                    <div className="mt-3 inline-flex items-center gap-2 rounded-lg bg-amber-50 border border-amber-200 px-3 py-2">
                      <span className="text-amber-600"><Icon.Clock /></span>
                      <p className="text-label-sm text-amber-800"><strong>Typical deadline:</strong> {sd.deadline}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* ── How to apply ─────────────────────────────────────────────── */}
            <div className="premium-card rounded-xl bg-white p-6">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-on-surface-variant"><Icon.Mail /></span>
                <h2 className="text-label-sm font-semibold uppercase tracking-widest text-on-surface-variant">How to Apply</h2>
              </div>

              <div className="flex flex-col gap-3 mb-5">
                {[
                  { step: "Find your county assessor", desc: `Search "${sd.name} county property appraiser" or visit your county's official website.` },
                  { step: "Download the application", desc: "Most counties offer online forms. Ask for the Homestead Exemption Application." },
                  { step: "Gather your documents", desc: "Proof of residency, photo ID, deed or tax bill. Additional docs for senior/veteran/disability programs." },
                  { step: "Submit before the deadline", desc: `${sd.deadline ? `Typical deadline for ${sd.name}: ${sd.deadline}.` : "Deadline varies by county."} Submit early to ensure processing.` },
                ].map((item, i) => {
                  const StepIcon = STEP_ICONS[i];
                  return (
                    <div key={i} className="flex items-start gap-3 rounded-lg border border-surface-border p-3">
                      <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary text-white">
                        <StepIcon />
                      </div>
                      <div>
                        <p className="text-label-md font-semibold text-on-surface">{item.step}</p>
                        <p className="text-label-sm text-on-surface-variant">{item.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="rounded-lg bg-surface-container-low p-4">
                <p className="text-label-md font-semibold text-primary mb-3">Documents Typically Required</p>
                <ul className="space-y-2 text-label-sm text-on-surface-variant">
                  {[
                    "Proof of primary residence (utility bill or driver's license)",
                    "Property deed or recent tax bill",
                    "Government-issued photo ID matching property address",
                    ...(age >= 65 ? ["Proof of age (passport or birth certificate)"] : []),
                    ...(isVeteran ? ["DD-214 discharge document"] : []),
                    ...(hasDisability ? ["Disability certification from SSA or physician"] : []),
                  ].map((doc, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="mt-0.5 flex-shrink-0 text-green-600"><Icon.Check /></span>
                      {doc}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* ── FAQs ─────────────────────────────────────────────────────────── */}
        <section className="mt-8 flex flex-col gap-4">
          <h2 className="text-headline-md text-primary">Frequently Asked Questions</h2>
          <div className="grid md:grid-cols-2 gap-3">
            {FAQS.map(faq => (
              <details key={faq.q} className="premium-card group cursor-pointer rounded-xl bg-white p-5">
                <summary className="flex list-none items-center justify-between text-label-md font-semibold text-primary">
                  <span>{faq.q}</span>
                  <span className="flex-shrink-0 ml-3 text-on-surface-variant transition-transform group-open:rotate-180">
                    <Icon.ChevronDown />
                  </span>
                </summary>
                <p className="mt-3 text-body-md text-on-surface-variant leading-relaxed">{faq.a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* ── Disclaimer ───────────────────────────────────────────────────── */}
        <p className="mt-6 rounded-xl border border-surface-border bg-surface-container-low px-5 py-4 text-label-sm text-on-surface-variant">
          <strong className="text-primary">Disclaimer:</strong> This tool provides estimates based on statewide averages. Actual exemption amounts, eligibility rules, and deadlines are set by your county or city assessor and can vary significantly within the same state. Always verify with your local government before applying.
        </p>
      </main>
    </>
  );
}

// ─── ProgramCard ─────────────────────────────────────────────────────────────

function ProgramIcon({ type }: { type: Program["iconType"] }) {
  switch (type) {
    case "home": return <Icon.HomeLg />;
    case "senior": return <Icon.Senior />;
    case "shield": return <Icon.Shield />;
    case "accessibility": return <Icon.Accessibility />;
    case "info": return <Icon.Info />;
  }
}

function ProgramCard({ program }: { program: Program }) {
  const config: Record<ProgramStatus, {
    card: string;
    badge: string;
    label: string;
    statusIcon: React.ReactNode;
  }> = {
    qualifies: {
      card: "border-green-200 bg-green-50",
      badge: "bg-green-100 text-green-800 border border-green-200",
      label: "Likely Qualify",
      statusIcon: <span className="text-green-600"><Icon.CheckCircle /></span>,
    },
    check_income: {
      card: "border-amber-200 bg-amber-50",
      badge: "bg-amber-100 text-amber-800 border border-amber-200",
      label: "Check Income Limit",
      statusIcon: <span className="text-amber-600"><Icon.AlertTriangle /></span>,
    },
    not_eligible: {
      card: "border-surface-border bg-white",
      badge: "bg-surface-container text-on-surface-variant border border-surface-border",
      label: "Does Not Apply",
      statusIcon: <span className="text-on-surface-variant"><Icon.XCircle /></span>,
    },
  };

  const c = config[program.status];

  return (
    <div className={`rounded-xl border p-4 transition-all ${c.card}`}>
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex items-center gap-2.5">
          <span className="text-primary"><ProgramIcon type={program.iconType} /></span>
          <p className="text-label-md font-semibold text-on-surface">{program.name}</p>
        </div>
        <span className={`flex flex-shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-label-sm font-semibold ${c.badge}`}>
          {c.statusIcon}
          {c.label}
        </span>
      </div>
      {program.exemption > 0 && (
        <p className="text-headline-sm font-bold text-primary mb-1">
          {fmt(program.exemption)} <span className="text-label-sm font-normal text-on-surface-variant">exemption</span>
        </p>
      )}
      <p className="text-label-sm text-on-surface-variant">{program.reason}</p>
    </div>
  );
}

// ─── FAQs ────────────────────────────────────────────────────────────────────

const FAQS = [
  {
    q: "What is a homestead exemption?",
    a: "A homestead exemption reduces the taxable assessed value of your primary residence, directly lowering your annual property tax bill. Most states offer a base exemption for all qualifying homeowners, with additional programs for seniors, veterans, and disabled individuals.",
  },
  {
    q: "Do I need to apply every year?",
    a: "In most states, you apply once and the exemption automatically renews annually as long as you remain eligible and stay in the same home. Some states require you to notify the assessor if your status changes. Always check with your local assessor for your state's renewal rules.",
  },
  {
    q: "What if my state shows no exemption?",
    a: "Some states — like Michigan, Minnesota, and Vermont — provide property tax relief through percentage reductions, assessment caps, or circuit-breaker credits rather than a fixed dollar exemption. These can still save you hundreds or thousands of dollars annually.",
  },
  {
    q: "Can I stack multiple exemptions?",
    a: "Yes, in many states you can combine multiple exemptions. For example, a 65+ veteran with a disability in Texas can receive the $100,000 base exemption, the $60,000 senior school tax exemption, and the $12,000 disability exemption — saving over $3,000 annually.",
  },
  {
    q: "What is an income limit for a senior exemption?",
    a: "Some senior exemptions are means-tested — only available to households below a certain income threshold. If your income exceeds the limit, you typically don't qualify for that specific program, though you may still qualify for the base homestead exemption.",
  },
  {
    q: "When should I apply?",
    a: "Most states have deadlines between January 1 and April 1 for the current tax year. Missing the deadline usually means waiting until the following year. Some states allow retroactive applications — check with your county assessor. Deadlines shown are for reference only.",
  },
];
