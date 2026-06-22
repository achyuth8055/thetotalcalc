"use client";
import { useState, useMemo } from "react";
import Breadcrumbs from "@/components/Breadcrumbs";
import CalculatorLayout from "@/components/CalculatorLayout";

type Size = "small" | "medium" | "large" | "giant";

// Human age equivalents by dog year and size (AKC-based guidelines)
const ageTable: Record<Size, number[]> = {
  small:  [15, 24, 28, 32, 36, 40, 44, 48, 52, 56, 60, 64, 68, 72, 76, 80, 84, 88, 92, 96],
  medium: [15, 24, 28, 32, 36, 42, 47, 51, 56, 60, 65, 69, 74, 78, 83, 87, 91, 95, 99, 103],
  large:  [15, 24, 28, 32, 36, 45, 50, 55, 61, 66, 72, 77, 82, 88, 93, 98, 103, 108, 113, 118],
  giant:  [12, 22, 31, 38, 45, 49, 56, 64, 71, 79, 86, 93, 100, 107, 114, 121, 128, 135, 142, 150],
};

function getHumanAge(dogYears: number, size: Size): number {
  const table = ageTable[size];
  const lower = Math.floor(dogYears);
  const upper = Math.min(Math.ceil(dogYears), table.length - 1);
  const lowerAge = table[Math.max(0, lower - 1)] ?? table[0];
  const upperAge = table[Math.max(0, upper - 1)] ?? table[0];
  const frac = dogYears - lower;
  return Math.round(lowerAge + frac * (upperAge - lowerAge));
}

function getLifeStage(humanAge: number, size: Size): { stage: string; emoji: string; advice: string } {
  const geriatricAge = size === "large" || size === "giant" ? 56 : 60;
  if (humanAge < 18) return { stage: "Puppy", emoji: "🐶", advice: "Focus on socialization, vaccinations, and basic training. Puppies need high-quality food formulated for growth and lots of sleep." };
  if (humanAge < 30) return { stage: "Adolescent", emoji: "🐕", advice: "Energy is at its peak! Consistent training, regular exercise, and dental hygiene are key. Spay/neuter decisions are typically made in this stage." };
  if (humanAge < geriatricAge) return { stage: "Adult", emoji: "🦮", advice: "Annual vet checkups, dental cleanings, and maintaining healthy weight are priorities. This is your dog's prime." };
  return { stage: "Senior", emoji: "🐾", advice: "Semi-annual vet visits recommended. Watch for CDS symptoms (confusion, disorientation). Joint support, softer food, and vision/hearing checks become important." };
}

export default function DogAgeCalculator() {
  const [dogYears, setDogYears] = useState(3);
  const [useMonths, setUseMonths] = useState(false);
  const [months, setMonths] = useState(6);
  const [size, setSize] = useState<Size>("medium");

  const result = useMemo(() => {
    const years = useMonths ? months / 12 : dogYears;
    const humanAge = getHumanAge(years, size);
    const stage = getLifeStage(humanAge, size);
    return { humanAge, ...stage };
  }, [dogYears, months, useMonths, size]);

  const sizeButtons: { key: Size; label: string; sub: string }[] = [
    { key: "small", label: "Small", sub: "<9 kg" },
    { key: "medium", label: "Medium", sub: "9–22 kg" },
    { key: "large", label: "Large", sub: "23–40 kg" },
    { key: "giant", label: "Giant", sub: "40+ kg" },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumbs items={[
        { label: "Lifestyle Calculators", href: "/lifestyle-calculators" },
        { label: "Dog Age Calculator", href: "/calculators/lifestyle/dog-age-calculator" },
      ]} />

      <div className="mb-6 flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dog Age Calculator</h1>
          <p className="text-base text-gray-600">Convert your dog's age to human years using size-based tables — not the outdated "× 7" myth.</p>
        </div>
        <button onClick={() => window.print()} className="print:hidden flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg">
          ↓ PDF
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        {/* Inputs */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Your Dog's Details</h2>

          {/* Age toggle */}
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setUseMonths(false)}
              className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${!useMonths ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
            >
              Age in Years
            </button>
            <button
              onClick={() => setUseMonths(true)}
              className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${useMonths ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
            >
              Age in Months (puppy)
            </button>
          </div>

          {!useMonths ? (
            <div className="mb-4">
              <div className="flex justify-between text-sm mb-1">
                <label className="font-medium text-gray-700">Dog's Age</label>
                <span className="font-bold text-blue-600">{dogYears} {dogYears === 1 ? "year" : "years"}</span>
              </div>
              <input
                type="range"
                min={1} max={20} step={0.5}
                value={dogYears}
                onChange={(e) => setDogYears(parseFloat(e.target.value))}
                className="w-full accent-blue-600"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1"><span>1</span><span>20</span></div>
            </div>
          ) : (
            <div className="mb-4">
              <div className="flex justify-between text-sm mb-1">
                <label className="font-medium text-gray-700">Puppy's Age</label>
                <span className="font-bold text-blue-600">{months} {months === 1 ? "month" : "months"}</span>
              </div>
              <input
                type="range"
                min={1} max={23} step={1}
                value={months}
                onChange={(e) => setMonths(parseInt(e.target.value))}
                className="w-full accent-blue-600"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1"><span>1 mo</span><span>23 mo</span></div>
            </div>
          )}

          {/* Size selector */}
          <label className="block text-sm font-medium text-gray-700 mb-2">Breed Size</label>
          <div className="grid grid-cols-2 gap-2">
            {sizeButtons.map((b) => (
              <button
                key={b.key}
                onClick={() => setSize(b.key)}
                className={`py-2 px-3 rounded-lg text-sm font-medium text-center transition-colors ${size === b.key ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
              >
                <div>{b.label}</div>
                <div className={`text-xs ${size === b.key ? "text-blue-200" : "text-gray-400"}`}>{b.sub}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Result */}
        <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl shadow-sm p-6 text-white">
          <p className="text-amber-100 text-sm font-medium uppercase tracking-wide mb-1">Human Age Equivalent</p>
          <div className="text-6xl font-extrabold mb-1">{result.humanAge}</div>
          <div className="text-amber-100 text-lg font-medium mb-4">human years</div>

          <div className="bg-white/15 rounded-xl p-4 mb-3">
            <div className="text-2xl mb-1">{result.emoji}</div>
            <div className="font-bold text-lg">{result.stage}</div>
            <div className="text-amber-100 text-sm">Life Stage</div>
          </div>

          <div className="bg-white/10 rounded-xl p-4">
            <p className="text-sm text-amber-50 leading-relaxed">{result.advice}</p>
          </div>
        </div>
      </div>

      {/* Info card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-3">Why Not Just Multiply by 7?</h2>
        <p className="text-sm text-gray-600 leading-relaxed">
          The "1 dog year = 7 human years" rule is a convenient fiction. Dogs mature much faster in their first two years — a 1-year-old dog is roughly equivalent to a 15-year-old human, not a 7-year-old. After early adulthood, aging slows for small breeds but remains faster for large breeds. This calculator uses size-based tables compiled from AKC guidelines and veterinary research.
        </p>
        <div className="mt-4 p-3 bg-blue-50 rounded-xl border border-blue-100">
          <p className="text-xs text-blue-700">🏆 <strong>Fun fact:</strong> The oldest reliably documented dog was Bobi, a Rafeiro do Alentejo from Portugal who reached 31 years and 165 days, certified by Guinness World Records in 2023.</p>
        </div>
      </div>

      <CalculatorLayout
        title=""
        description=""
        explanation={
          <div className="space-y-4 text-sm text-gray-700 leading-relaxed">
            <h2 className="text-xl font-bold text-gray-900">Why Dogs Age the Way They Do</h2>
            <p>
              Dogs and humans share more biological similarities than most pet owners realize — and yet their aging trajectories diverge dramatically from the very first year of life. Understanding why your dog ages faster, and why a Great Dane ages faster than a Chihuahua, requires a brief journey into cellular biology and metabolic science.
            </p>
            <p>
              The fundamental driver of biological aging is cellular oxidative stress — the accumulation of damage from free radicals, which are unstable molecules produced as byproducts of metabolism. Animals with higher metabolic rates produce more free radicals per unit of time, and this tends to correlate with faster aging. Small mammals like mice have extremely high metabolic rates and live only a few years; large mammals like elephants and whales have slower metabolisms and live for decades. Dogs, being mammals, follow this general rule — but with a fascinating twist.
            </p>
            <p>
              Within the dog species, the relationship inverts: <strong>larger dogs age faster than smaller dogs</strong>. This is essentially unique among mammals. A Great Dane might live 8–10 years while a Chihuahua commonly reaches 15–18 years. Researchers believe the explanation lies in growth rate — large breed dogs grow extraordinarily rapidly from puppyhood, and this accelerated growth appears to cause increased cellular stress, higher rates of abnormal cell division, and ultimately a compressed lifespan. A 2013 study published in <em>The American Naturalist</em> found that each additional 4.4 pounds of body weight corresponds to roughly one month less of life expectancy in dogs.
            </p>
            <p>
              A landmark 2019 paper in <em>Nature Aging</em> proposed a more accurate aging model based on DNA methylation — chemical modifications to the genome that accumulate predictably with age, sometimes called an "epigenetic clock." Researchers at UC San Diego found that dogs and humans share remarkably similar methylation patterns in youth and old age, but the canine clock runs much faster in early life and slows relative to humans in middle age. The formula they derived — human age ≈ 16 × ln(dog age) + 31 — produces results fairly similar to our size-based table for adult dogs.
            </p>
            <p>
              Canine cognitive dysfunction syndrome (CDS) is directly analogous to Alzheimer's disease in humans. It affects an estimated 14–35% of dogs over age 8. Symptoms include disorientation, disrupted sleep-wake cycles, loss of housetraining, reduced interaction with owners, and altered activity levels. Brain autopsies reveal the same amyloid-beta plaques and neurofibrillary tangles found in human Alzheimer's patients. Dogs are increasingly used as a natural model for dementia research precisely because of these parallels.
            </p>
            <p>
              Senior dog care deserves special attention. Dental disease affects over 80% of dogs by age 3, and in senior dogs it can contribute to heart, kidney, and liver problems as bacteria from inflamed gums enter the bloodstream. Joint support — through glucosamine, omega-3 fatty acids, and controlled exercise — can significantly improve quality of life. Vision and hearing changes are common in dogs over 10. Regular semi-annual veterinary checkups are recommended for dogs classified as seniors.
            </p>
            <p>
              Certain breeds are associated with exceptional longevity. Border Collies, Australian Shepherds, Beagles, and mixed-breed dogs tend toward the longer end of the lifespan spectrum. Mixed-breed dogs in particular benefit from what geneticists call "hybrid vigor" — the genetic diversity arising from outbreeding tends to reduce the expression of recessive disease genes that concentrated breeding has introduced into many purebred lines. On average, mixed-breed dogs live approximately 1–1.5 years longer than purebred counterparts of similar size.
            </p>
            <p>
              The care you provide directly influences where on the lifespan spectrum your dog lands. Annual wellness exams, appropriate body weight (obesity reduces canine lifespan by up to 2.5 years, per a Purina study), regular dental care, vaccination, parasite prevention, and mental stimulation all compound over a dog's lifetime into significantly more healthy years together.
            </p>
          </div>
        }
        faqs={[
          {
            question: "Is the '1 dog year = 7 human years' rule accurate?",
            answer: "No, it is a significant oversimplification. Dogs mature very rapidly in their first two years — a 1-year-old dog is developmentally closer to a 15-year-old human. The ratio also varies by breed size: small dogs age more slowly than large breeds. This calculator uses size-based tables for a much more accurate comparison."
          },
          {
            question: "Why do large dogs have shorter lifespans than small dogs?",
            answer: "This is one of the most unusual patterns in mammalian biology, because larger body size normally correlates with longer life across species. Within dogs, however, larger breeds grow much faster from puppyhood, and this accelerated growth rate appears to cause increased cellular stress and higher cancer rates. Each 4.4 lbs of body weight corresponds to roughly one month less of life expectancy, according to research published in The American Naturalist."
          },
          {
            question: "At what age is a dog considered a senior?",
            answer: "It depends on size. Small breeds are generally considered senior at around 11–12 years of age. Medium breeds enter their senior years around 10. Large breeds are considered senior at 8 years, and giant breeds (like Great Danes) may be considered senior as early as 5–6 years of age. Veterinarians typically recommend twice-yearly checkups once a dog reaches senior classification."
          },
          {
            question: "What is the oldest dog ever recorded?",
            answer: "Bobi, a Rafeiro do Alentejo from Conqueiros, Portugal, was certified by Guinness World Records as the world's oldest dog in 2023, having lived to 31 years and 165 days. He surpassed the previous record holder, an Australian Cattle Dog named Bluey who lived to 29 years and 5 months in the 1930s."
          },
          {
            question: "Do mixed breed dogs live longer than purebreds?",
            answer: "Generally yes, by about 1 to 1.5 years on average. This phenomenon, known as hybrid vigor or heterosis, results from the genetic diversity of mixed breeding reducing the likelihood of expressing recessive disease genes that have been amplified in some purebred lines through selective breeding. However, individual care, diet, exercise, and veterinary attention matter more than breed genetics for any individual dog."
          },
        ]}
        relatedCalculators={[
          { name: "Age Calculator", href: "/calculators/date/age-calculator" },
          { name: "Days Alive Calculator", href: "/calculators/lifestyle/days-alive-calculator" },
          { name: "BMI Calculator", href: "/calculators/health/bmi-calculator" },
        ]}
      >
        <div />
      </CalculatorLayout>
    </div>
  );
}
