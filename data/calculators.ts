export interface Calculator {
  id: string;
  name: string;
  description: string;
  category: string;
  slug: string;
  keywords: string[];
  color: string; // Tailwind color class for visual distinction
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  color: string; // Tailwind color class
  calculators: Calculator[];
}

export const calculators: Calculator[] = [
  // Finance Calculators
  {
    id: "emi",
    name: "EMI Calculator",
    description: "Calculate your monthly loan EMI with detailed breakdown",
    category: "finance",
    slug: "emi-calculator",
    keywords: ["loan", "emi", "monthly payment", "interest"],
    color: "blue",
  },
  {
    id: "home-loan-emi",
    name: "Home Loan EMI",
    description: "Calculate home loan EMI and total interest payable",
    category: "finance",
    slug: "home-loan-emi-calculator",
    keywords: ["home loan", "mortgage", "property loan"],
    color: "blue",
  },
  {
    id: "car-loan-emi",
    name: "Car Loan EMI",
    description: "Calculate car loan monthly payments and total cost",
    category: "finance",
    slug: "car-loan-emi-calculator",
    keywords: ["car loan", "auto loan", "vehicle finance"],
    color: "blue",
  },
  {
    id: "sip",
    name: "SIP Calculator",
    description: "Calculate returns on monthly SIP investments",
    category: "finance",
    slug: "sip-calculator",
    keywords: ["sip", "mutual fund", "investment", "returns"],
    color: "blue",
  },
  {
    id: "fd",
    name: "FD Calculator",
    description: "Calculate fixed deposit maturity amount and interest",
    category: "finance",
    slug: "fd-calculator",
    keywords: ["fixed deposit", "fd", "interest"],
    color: "blue",
  },
  {
    id: "swp",
    name: "SWP Calculator",
    description: "Calculate systematic withdrawal plan returns and duration",
    category: "finance",
    slug: "swp-calculator",
    keywords: ["swp", "systematic withdrawal", "retirement", "mutual fund"],
    color: "blue",
  },
  {
    id: "margin",
    name: "Margin Calculator",
    description: "Calculate margin requirements for trading positions",
    category: "finance",
    slug: "margin-calculator",
    keywords: ["margin", "trading", "leverage", "stocks"],
    color: "blue",
  },
  {
    id: "brokerage",
    name: "Brokerage Calculator",
    description: "Calculate brokerage and other trading charges",
    category: "finance",
    slug: "brokerage-calculator",
    keywords: ["brokerage", "trading charges", "transaction cost"],
    color: "blue",
  },

  // Math Calculators
  {
    id: "scientific",
    name: "Scientific Calculator",
    description: "Advanced calculator with trigonometric, logarithmic, and exponential functions",
    category: "math",
    slug: "scientific-calculator",
    keywords: ["scientific", "trigonometry", "logarithm", "exponential", "advanced"],
    color: "purple",
  },
  {
    id: "math-quiz",
    name: "Math Quiz & Practice",
    description: "Interactive math quizzes for children with multiple difficulty levels",
    category: "math",
    slug: "math-quiz",
    keywords: ["quiz", "practice", "learning", "children", "education"],
    color: "purple",
  },
  {
    id: "percentage",
    name: "Percentage Calculator",
    description: "Calculate percentages, increases, and decreases easily",
    category: "math",
    slug: "percentage-calculator",
    keywords: ["percentage", "percent", "calculation"],
    color: "purple",
  },
  {
    id: "average",
    name: "Average Calculator",
    description: "Calculate mean, median, and mode of numbers",
    category: "math",
    slug: "average-calculator",
    keywords: ["average", "mean", "median", "mode"],
    color: "purple",
  },
  {
    id: "gpa",
    name: "GPA Calculator",
    description: "Calculate your Grade Point Average",
    category: "math",
    slug: "gpa-calculator",
    keywords: ["gpa", "grade", "academic"],
    color: "purple",
  },
  {
    id: "grade",
    name: "Grade Calculator",
    description: "Calculate final grade and required exam score",
    category: "math",
    slug: "grade-calculator",
    keywords: ["grade", "exam", "score"],
    color: "purple",
  },
  {
    id: "ratio",
    name: "Ratio Calculator",
    description: "Simplify and calculate ratios",
    category: "math",
    slug: "ratio-calculator",
    keywords: ["ratio", "proportion", "simplify"],
    color: "purple",
  },

  // Health Calculators
  {
    id: "bmi",
    name: "BMI Calculator",
    description: "Calculate Body Mass Index and healthy weight range",
    category: "health",
    slug: "bmi-calculator",
    keywords: ["bmi", "body mass index", "weight", "health"],
    color: "green",
  },
  {
    id: "bmr",
    name: "BMR Calculator",
    description: "Calculate Basal Metabolic Rate and daily calorie needs",
    category: "health",
    slug: "bmr-calculator",
    keywords: ["bmr", "metabolism", "calories"],
    color: "green",
  },
  {
    id: "calorie",
    name: "Calorie Calculator",
    description: "Calculate daily calorie needs for weight goals",
    category: "health",
    slug: "calorie-calculator",
    keywords: ["calorie", "diet", "weight loss", "weight gain"],
    color: "green",
  },
  {
    id: "ideal-weight",
    name: "Ideal Weight Calculator",
    description: "Find your ideal weight range based on height",
    category: "health",
    slug: "ideal-weight-calculator",
    keywords: ["ideal weight", "healthy weight", "target weight"],
    color: "green",
  },

  // Date Calculators
  {
    id: "age",
    name: "Age Calculator",
    description: "Calculate age in years, months, and days",
    category: "date",
    slug: "age-calculator",
    keywords: ["age", "birthday", "years old"],
    color: "indigo",
  },
  {
    id: "date-difference",
    name: "Date Difference",
    description: "Calculate days between two dates",
    category: "date",
    slug: "date-difference-calculator",
    keywords: ["date difference", "days between", "duration"],
    color: "indigo",
  },
  {
    id: "add-days",
    name: "Add/Subtract Days",
    description: "Add or subtract days from a date",
    category: "date",
    slug: "add-subtract-days-calculator",
    keywords: ["add days", "subtract days", "date calculation"],
    color: "indigo",
  },
  {
    id: "countdown",
    name: "Countdown Calculator",
    description: "Count days remaining until a future date",
    category: "date",
    slug: "countdown-calculator",
    keywords: ["countdown", "days until", "time remaining"],
    color: "indigo",
  },

  // Everyday Calculators
  {
    id: "discount",
    name: "Discount Calculator",
    description: "Calculate sale price and savings",
    category: "everyday",
    slug: "discount-calculator",
    keywords: ["discount", "sale", "savings"],
    color: "orange",
  },
  {
    id: "tip",
    name: "Tip Calculator",
    description: "Calculate tip amount and total bill",
    category: "everyday",
    slug: "tip-calculator",
    keywords: ["tip", "gratuity", "restaurant"],
    color: "orange",
  },
  {
    id: "split-bill",
    name: "Split Bill Calculator",
    description: "Split bill among multiple people",
    category: "everyday",
    slug: "split-bill-calculator",
    keywords: ["split bill", "divide", "share cost"],
    color: "orange",
  },
  {
    id: "unit-converter",
    name: "Unit Converter",
    description: "Convert between different units of measurement",
    category: "everyday",
    slug: "unit-converter",
    keywords: ["unit conversion", "convert", "measurement"],
    color: "orange",
  },

  // Developer Calculators
  {
    id: "binary-converter",
    name: "Binary Converter",
    description: "Convert between binary, decimal, hexadecimal, and octal",
    category: "developer",
    slug: "binary-converter",
    keywords: ["binary", "decimal", "hex", "octal", "conversion"],
    color: "cyan",
  },
  {
    id: "hex-converter",
    name: "Hex Converter",
    description: "Convert hexadecimal to decimal, binary, and octal",
    category: "developer",
    slug: "hex-converter",
    keywords: ["hexadecimal", "hex", "conversion", "programming"],
    color: "cyan",
  },
  {
    id: "ascii-converter",
    name: "ASCII Converter",
    description: "Convert text to ASCII and ASCII to text",
    category: "developer",
    slug: "ascii-converter",
    keywords: ["ascii", "text", "character", "encoding"],
    color: "cyan",
  },
  {
    id: "base64-encoder",
    name: "Base64 Encoder/Decoder",
    description: "Encode and decode Base64 strings",
    category: "developer",
    slug: "base64-encoder",
    keywords: ["base64", "encode", "decode", "encoding"],
    color: "cyan",
  },
  {
    id: "color-converter",
    name: "Color Converter",
    description: "Convert between RGB, HEX, and HSL color formats",
    category: "developer",
    slug: "color-converter",
    keywords: ["color", "rgb", "hex", "hsl", "css"],
    color: "cyan",
  },
];

export const categories: Category[] = [
  {
    id: "finance",
    name: "Finance Calculators",
    slug: "finance-calculators",
    description: "EMI, loans, investments, and financial planning tools",
    color: "blue",
    calculators: calculators.filter(c => c.category === "finance"),
  },
  {
    id: "math",
    name: "Math & Percentage",
    slug: "math-calculators",
    description: "Percentage, GPA, averages, and mathematical calculations",
    color: "purple",
    calculators: calculators.filter(c => c.category === "math"),
  },
  {
    id: "health",
    name: "Health & Fitness",
    slug: "health-calculators",
    description: "BMI, BMR, calories, and health-related calculators",
    color: "green",
    calculators: calculators.filter(c => c.category === "health"),
  },
  {
    id: "date",
    name: "Date & Time",
    slug: "date-calculators",
    description: "Age, date difference, countdowns, and date calculations",
    color: "indigo",
    calculators: calculators.filter(c => c.category === "date"),
  },
  {
    id: "everyday",
    name: "Everyday Tools",
    slug: "everyday-calculators",
    description: "Discount, tip, split bill, and daily life calculators",
    color: "orange",
    calculators: calculators.filter(c => c.category === "everyday"),
  },
  {
    id: "developer",
    name: "Developer Tools",
    slug: "developer-calculators",
    description: "Binary, hex, ASCII, Base64, and color converters for developers",
    color: "cyan",
    calculators: calculators.filter(c => c.category === "developer"),
  },
];

export const popularCalculators = [
  calculators.find(c => c.id === "emi")!,
  calculators.find(c => c.id === "age")!,
  calculators.find(c => c.id === "bmi")!,
  calculators.find(c => c.id === "percentage")!,
];
