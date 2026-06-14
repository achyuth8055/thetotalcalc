import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Math Quiz - Free Practice for Kids",
  description:
    "Free interactive math quizzes with multiple difficulty levels. Practice addition, subtraction, multiplication, and division for all ages.",
  keywords: ["math quiz","math quiz online","free math quiz"],
  alternates: { canonical: "/calculators/math/math-quiz" },
  openGraph: {
    title: "Math Quiz - Free Practice for Kids | OnlineCalc",
    description: "Free interactive math quizzes with multiple difficulty levels. Practice addition, subtraction, multiplication, and division for all ages.",
    url: "/calculators/math/math-quiz",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Math Quiz - Free Practice for Kids",
    description: "Free interactive math quizzes with multiple difficulty levels. Practice addition, subtraction, multiplication, and division for all ages.",
  },
};

export default function MathQuizLayout({ children }: { children: React.ReactNode }) {
  return children;
}
