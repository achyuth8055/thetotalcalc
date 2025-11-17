import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import Script from "next/script";

const inter = Inter({ subsets: ["latin"] });

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
  verification: {
    google: 'your-google-verification-code',
  },
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
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.8',
    ratingCount: '2547',
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
        <Script
          id="schema-org"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-QEY6X1E51Y"
        />
        <Script id="google-analytics">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-QEY6X1E51Y');
          `}
        </Script>
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7738496464135357"
          crossOrigin="anonymous"
        />
      </head>
      <body className={`${inter.className} bg-slate-950 text-slate-100 antialiased`}>
        <div className="relative min-h-screen overflow-hidden">
          <div className="pointer-events-none absolute inset-0 -z-10">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.15),_transparent_55%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,_rgba(79,70,229,0.15),_transparent_60%)]" />
            <div className="absolute -top-32 right-0 w-[30rem] h-[30rem] bg-primary-500/40 blur-[140px] rounded-full opacity-70" />
            <div className="absolute -bottom-24 left-10 w-[24rem] h-[24rem] bg-emerald-500/40 blur-[130px] rounded-full opacity-60" />
            <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(255,255,255,0.08)_1px,transparent_1px)] bg-[size:70px_70px] opacity-[0.04]" />
          </div>
          <Navigation />
          <main className="relative z-10 min-h-screen">
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
