// UK VAT calculator. Adds or removes VAT at the standard (20%), reduced (5%),
// or zero (0%) rate. Pure arithmetic, so figures are exact.
import type { CalculatorDefinition } from "@/lib/engine/types";

export const ukVat: CalculatorDefinition = {
  id: "uk-vat",
  type: "estimate",
  region: "UK",
  jurisdictionLevel: "federal",
  category: "tax",
  slug: "uk-vat-calculator",
  title: "UK VAT Calculator",
  description:
    "Add or remove UK VAT at the standard 20%, reduced 5%, or zero rate. See the net price, the VAT amount, and the gross total.",
  inputs: [
    { name: "amount", label: "Amount", type: "currency", required: true, default: 100, min: 0, max: 10000000, step: 1 },
    {
      name: "direction", label: "What do you want to do?", type: "select", required: true, default: "add",
      options: [
        { value: "add", label: "Add VAT (amount excludes VAT)" },
        { value: "remove", label: "Remove VAT (amount includes VAT)" },
      ],
    },
    {
      name: "rate", label: "VAT rate", type: "select", required: true, default: "20",
      options: [
        { value: "20", label: "Standard rate (20%)" },
        { value: "5", label: "Reduced rate (5%)" },
        { value: "0", label: "Zero rate (0%)" },
      ],
    },
  ],
  tables: {
    vatRate: { "20": 0.2, "5": 0.05, "0": 0 },
  },
  derived: [
    { name: "r", expr: { lookup: "vatRate", key: { var: "rate" } } },
    {
      name: "net",
      expr: {
        if: { cmp: "==", left: { var: "direction" }, right: "add" },
        then: { var: "amount" },
        else: { op: "/", args: [{ var: "amount" }, { op: "+", args: [1, { var: "r" }] }] },
      },
    },
    {
      name: "gross",
      expr: {
        if: { cmp: "==", left: { var: "direction" }, right: "add" },
        then: { op: "*", args: [{ var: "amount" }, { op: "+", args: [1, { var: "r" }] }] },
        else: { var: "amount" },
      },
    },
    { name: "vat", expr: { op: "-", args: [{ var: "gross" }, { var: "net" }] } },
  ],
  outputs: [
    { name: "gross", label: "Total (including VAT)", expr: { var: "gross" }, format: "currency", primary: true, note: "Net price plus VAT." },
    { name: "vat", label: "VAT amount", expr: { var: "vat" }, format: "currency" },
    { name: "net", label: "Net (excluding VAT)", expr: { var: "net" }, format: "currency" },
  ],
  faqs: [
    { question: "What is the standard UK VAT rate?", answer: "The standard rate of VAT in the UK is 20%. A reduced rate of 5% applies to some goods and services (such as domestic energy), and some items are zero-rated (0%)." },
    { question: "How do I remove VAT from a price?", answer: "Divide the VAT-inclusive (gross) price by 1.20 for the 20% rate. The result is the net price; the difference between the two is the VAT. This calculator does it for you when you choose 'Remove VAT'." },
    { question: "Is VAT the same across the UK?", answer: "Yes. VAT is a UK-wide tax set by HMRC, so the same rates apply in England, Scotland, Wales, and Northern Ireland." },
  ],
  whoFor:
    "Anyone pricing a product or service, checking an invoice, or working out how much of a price is VAT - including freelancers, small businesses, and shoppers.",
  howItWorks:
    "To add VAT, the net amount is multiplied by 1 plus the rate (for example x1.20 at 20%). To remove VAT, the gross amount is divided by 1 plus the rate to get the net price, and the VAT is the difference between the two.",
  workedExample:
    "On a net price of 100 at the 20% standard rate: VAT is 100 x 0.20 = 20, so the total is 120. Working backwards from a 120 gross price: 120 / 1.20 = 100 net, and the VAT is 20.",
  commonMistakes: [
    "Removing VAT by subtracting 20% of the gross price - that is incorrect. You must divide by 1.20, not multiply by 0.80.",
    "Applying the standard rate to zero-rated or reduced-rate items.",
    "Forgetting that the VAT registration threshold and rules are separate from the rate used here.",
  ],
  regionalVariations:
    "VAT is set UK-wide by HMRC, so rates do not vary by nation. Note that VAT is different from sales taxes used in other countries, which are added at the till rather than built into the displayed price.",
  sources: [
    { title: "VAT rates", url: "https://www.gov.uk/vat-rates", publisher: "GOV.UK", retrieved: "2026-06-09" },
    { title: "How VAT works", url: "https://www.gov.uk/how-vat-works", publisher: "GOV.UK", retrieved: "2026-06-09" },
  ],
  disclaimer:
    "For general information only. VAT rules, rates, and registration thresholds can change and some supplies have special treatment. Check GOV.UK or an accountant for your specific situation.",
  version: "1.0.0",
  effectiveYear: 2025,
  lastVerified: "2026-06-09",
  tests: [
    { name: "Add 20% to 100", inputs: { amount: 100, direction: "add", rate: "20" }, expect: { net: 100, vat: 20, gross: 120 } },
    { name: "Remove 20% from 120", inputs: { amount: 120, direction: "remove", rate: "20" }, expect: { net: 100, vat: 20, gross: 120 } },
    { name: "Add 5% to 200", inputs: { amount: 200, direction: "add", rate: "5" }, expect: { net: 200, vat: 10, gross: 210 } },
    { name: "Zero rate", inputs: { amount: 500, direction: "add", rate: "0" }, expect: { net: 500, vat: 0, gross: 500 } },
  ],
};
