# AdSense Approval Checklist

Analysis of the reference site **deutschland-rechner.de** (approved in ~1 week) and the
concrete changes made to OnlineCalc to follow the same playbook.

## Why the reference site passed quickly

1. **Substantial original content.** 269 calculators **plus** real editorial prose on the
   homepage - a value-proposition section, a "So rechnen wir" (how we calculate) section that
   cites the exact laws and official sources behind each calculator, and a real FAQ. AdSense
   rejects "low-value / thin" sites; editorial text is what reviewers read.
2. **Complete trust & legal pages.** Impressum (imprint), Datenschutz (privacy with explicit
   Google-ads + cookie-consent language), Werbehinweise (advertising disclosure), Kontakt,
   Über uns. Every one is a real, substantial page - not a stub.
3. **E-E-A-T signals.** Named author + location, cited official sources, clear "no guarantee /
   not advice" disclaimers, transparent funding ("financed by ads, ads never affect results").
4. **Consent + ads.txt.** A cookie-consent dialog for ad cookies, and an `ads.txt` file.
5. **Clean, fast, mobile-first UX** with clear navigation and no under-construction pages.

## What we changed

| Item | Status |
|---|---|
| `public/ads.txt` with publisher ID | ✅ added |
| Homepage editorial content: value prop, "How we calculate" + official sources, FAQ | ✅ added |
| Privacy Policy rewritten for Google AdSense, cookies, GDPR & CCPA, opt-outs | ✅ |
| Advertising Disclosure page (`/advertising-disclosure`) | ✅ |
| Methodology & Editorial Standards page (`/methodology`) with sourced references | ✅ |
| Contact page (`/contact`) | ✅ |
| About page rewritten (mission, who, accuracy commitment) | ✅ |
| Cookie-consent banner gating the AdSense script until accepted | ✅ |
| Footer links to every trust/legal page | ✅ |
| Per-calculator disclaimers, "last verified" dates, official source links | ✅ (engine) |

## Before you submit to AdSense - action items for you

1. **Confirm the publisher ID.** `ads.txt` and the AdSense script use
   `pub-7738496464135357`. Replace if that is not your account.
2. **Set a real contact email + owner name.** Search the codebase for
   `CONTACT_EMAIL` / `SITE_OWNER` placeholders in `lib/site.ts` and update them. A reachable
   contact method is an approval requirement.
3. **Deploy on the real domain** with HTTPS (the metadata uses `online-calc.com`).
4. **EEA users need a Google-certified CMP.** The included banner is a lightweight consent
   gate. For serving personalized ads in the EEA/UK, add a Google-certified Consent Management
   Platform (e.g. Funding Choices / Google's CMP) before driving EU traffic.
5. **Add more depth over time.** Keep shipping real calculators with unique explanations,
   FAQs, and sources - content depth is the single biggest approval factor.
6. **Submit only when** all pages render, navigation works, and there are no broken/empty
   ("coming soon") pages in the primary navigation path.
