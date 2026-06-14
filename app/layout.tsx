import type { Metadata } from "next";
import { Public_Sans } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { RegionProvider } from "@/components/RegionContext";
import { LanguageProvider } from "@/components/LanguageContext";
import RegionBanner from "@/components/RegionBanner";
import CookieConsent from "@/components/CookieConsent";
import { JsonLd, organizationSchema, websiteSchema } from "@/components/seo/JsonLd";
import Script from "next/script";

const publicSans = Public_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL('https://online-calc.com'),
  title: {
    default: "OnlineCalc - Free Online Calculators for Finance, Math, Health & More",
    template: "%s | OnlineCalc"
  },
  description: "Free online calculators for EMI, SIP, BMI, percentage, age, grade, loan, mortgage, tax, and more. OnlineCalc - Fast, accurate, and easy-to-use financial, mathematical, health, and everyday calculators.",
  keywords: [
    "calculator",
    "online calculator",
    "free calculator",
    "EMI calculator",
    "SIP calculator",
    "BMI calculator",
    "percentage calculator",
    "age calculator",
    "loan calculator",
    "mortgage calculator",
    "grade calculator",
    "GPA calculator",
    "scientific calculator",
    "tax calculator",
    "retirement calculator",
    "investment calculator",
    "compound interest calculator",
    "calorie calculator",
    "BMR calculator",
    "ideal weight calculator",
    "date calculator",
    "time calculator",
    "discount calculator",
    "tip calculator",
    "unit converter",
    "currency converter",
    "binary converter",
    "hex converter",
    "base64 encoder",
    "ASCII converter",
    "color converter",
    "finance calculator India",
    "home loan EMI calculator",
    "car loan calculator",
    "fixed deposit calculator",
    "FD calculator",
    "mutual fund calculator",
    "SWP calculator",
    "brokerage calculator",
    "margin calculator",
    "math quiz for kids",
    "online math practice",
    "math games",
  ],
  authors: [{ name: "OnlineCalc Team" }],
  creator: "OnlineCalc",
  publisher: "OnlineCalc",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/calculator.png',
    shortcut: '/calculator.png',
    apple: '/calculator.png',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://online-calc.com',
    title: 'OnlineCalc - Free Online Calculators for All Your Needs',
    description: 'Free online calculators for EMI, SIP, BMI, percentage, age, grade, and more. Fast, accurate financial, math, health, and everyday calculators.',
    siteName: 'OnlineCalc',
    images: [
      {
        url: '/calculator.png',
        width: 1200,
        height: 630,
        alt: 'OnlineCalc - Free Online Calculators',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'OnlineCalc - Free Online Calculators',
    description: 'Free online calculators for EMI, SIP, BMI, percentage, age, and more.',
    creator: '@onlinecalc',
    images: ['/calculator.png'],
  },
  // Set NEXT_PUBLIC_GSC_VERIFICATION in your environment to the token Google
  // Search Console gives you. When unset, no (broken) verification tag is emitted.
  ...(process.env.NEXT_PUBLIC_GSC_VERIFICATION
    ? { verification: { google: process.env.NEXT_PUBLIC_GSC_VERIFICATION } }
    : {}),
  alternates: {
    canonical: 'https://online-calc.com',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'OnlineCalc',
  url: 'https://online-calc.com',
  description: 'Free online calculators for finance, math, health, dates, and everyday calculations. EMI, SIP, BMI, percentage, age calculator and more.',
  applicationCategory: 'UtilityApplication',
  operatingSystem: 'Any',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Warm up connections to third-party origins so the first request to
            each does not pay the full DNS + TLS handshake cost. */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://pagead2.googlesyndication.com" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://ipapi.co" />
        {/* display=swap so icons paint with a fallback immediately instead of
            staying invisible (FOIT) while the icon font downloads. */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
        />
        <Script
          id="schema-org"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <JsonLd id="schema-organization" data={organizationSchema()} />
        <JsonLd id="schema-website" data={websiteSchema()} />
        {/* Google consent mode v2 - deny by default until the user accepts. */}
        <Script id="consent-default" strategy="beforeInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('consent', 'default', {
              ad_storage: 'denied',
              ad_user_data: 'denied',
              ad_personalization: 'denied',
              analytics_storage: 'denied',
              wait_for_update: 500
            });
          `}
        </Script>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-QEY6X1E51Y"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-QEY6X1E51Y');
          `}
        </Script>
        {/* AdSense runs heavy main-thread work and injects ad slots; load it
            lazily so it does not compete with page hydration and interaction. */}
        <Script
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8069357472142495"
          strategy="lazyOnload"
          crossOrigin="anonymous"
        />
      </head>
      <body className={`${publicSans.className} bg-background text-on-surface antialiased`}>
        <RegionProvider>
          <LanguageProvider>
            <div className="flex min-h-screen flex-col">
              <Navigation />
              <RegionBanner />
              <main className="flex-grow">{children}</main>
              <Footer />
            </div>
            <CookieConsent />
          </LanguageProvider>
        </RegionProvider>
      </body>
    </html>
  );
}
