import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Math Solver - Step-by-Step Answers",
  description:
    "Solve arithmetic, algebra, and trigonometry problems online. Free math solver that shows the steps to reach your answer.",
  keywords: ["math solver","math solver online","free math solver"],
  alternates: { canonical: "/calculators/math/math-solver" },
  openGraph: {
    title: "Math Solver - Step-by-Step Answers | OnlineCalc",
    description: "Solve arithmetic, algebra, and trigonometry problems online. Free math solver that shows the steps to reach your answer.",
    url: "/calculators/math/math-solver",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Math Solver - Step-by-Step Answers",
    description: "Solve arithmetic, algebra, and trigonometry problems online. Free math solver that shows the steps to reach your answer.",
  },
};

export default function MathSolverLayout({ children }: { children: React.ReactNode }) {
  return children;
}
