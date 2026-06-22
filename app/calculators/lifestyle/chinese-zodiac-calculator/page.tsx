"use client";
import { useState, useMemo } from "react";
import Breadcrumbs from "@/components/Breadcrumbs";
import CalculatorLayout from "@/components/CalculatorLayout";

const ZODIAC_DATA = [
  {
    index: 0,
    name: "Rat",
    emoji: "🐭",
    traits: ["Clever", "Quick-witted", "Resourceful", "Versatile", "Kind"],
    description:
      "Rats are quick thinkers and possess great creativity. They excel at seizing opportunities and are highly adaptable in changing environments. Though they can be calculating, their loyalty to close friends and family is unwavering.",
    luckyNumbers: [2, 3],
    luckyColors: ["Blue", "Gold", "Green"],
    luckyFlower: "Lily",
    compatible: ["Dragon", "Monkey", "Ox"],
    avoid: ["Horse", "Rooster"],
  },
  {
    index: 1,
    name: "Ox",
    emoji: "🐂",
    traits: ["Diligent", "Dependable", "Strong", "Determined", "Honest"],
    description:
      "Oxen are known for their tireless work ethic and steadfast nature. They approach every task with methodical precision and rarely give up. While slow to anger, they hold deep convictions and earn trust through consistent action.",
    luckyNumbers: [1, 4],
    luckyColors: ["White", "Yellow", "Green"],
    luckyFlower: "Tulip",
    compatible: ["Rat", "Snake", "Rooster"],
    avoid: ["Tiger", "Dragon", "Horse", "Sheep"],
  },
  {
    index: 2,
    name: "Tiger",
    emoji: "🐯",
    traits: ["Brave", "Confident", "Competitive", "Charming", "Unpredictable"],
    description:
      "Tigers are natural leaders with magnetic personalities. Their courage and charisma draw people naturally, but their unpredictability keeps others on their toes. They hate being controlled and thrive when given full independence.",
    luckyNumbers: [1, 3, 4],
    luckyColors: ["Blue", "Grey", "Orange"],
    luckyFlower: "Yellow Lily",
    compatible: ["Horse", "Dog"],
    avoid: ["Ox", "Tiger", "Snake", "Monkey"],
  },
  {
    index: 3,
    name: "Rabbit",
    emoji: "🐰",
    traits: ["Gentle", "Elegant", "Quiet", "Alert", "Responsible"],
    description:
      "Rabbits are among the most artistic and tasteful signs. They have a talent for diplomacy and prefer peaceful resolutions. Highly intuitive, they sense shifts in relationships early and guard their emotional world carefully.",
    luckyNumbers: [3, 4, 6],
    luckyColors: ["Red", "Pink", "Purple", "Blue"],
    luckyFlower: "Plantain Lily",
    compatible: ["Sheep", "Monkey", "Dog", "Pig"],
    avoid: ["Snake", "Rooster"],
  },
  {
    index: 4,
    name: "Dragon",
    emoji: "🐲",
    traits: ["Confident", "Intelligent", "Enthusiastic", "Ambitious", "Charismatic"],
    description:
      "Dragons are the most revered sign in the Chinese zodiac. Their natural authority and visionary thinking inspire others. They pursue goals with relentless energy and rarely settle for mediocrity, though they can be demanding of those around them.",
    luckyNumbers: [1, 6, 7],
    luckyColors: ["Gold", "Silver", "Grey"],
    luckyFlower: "Dragon Snapdragon",
    compatible: ["Rooster", "Rat", "Monkey"],
    avoid: ["Ox", "Sheep", "Dog"],
  },
  {
    index: 5,
    name: "Snake",
    emoji: "🐍",
    traits: ["Enigmatic", "Intuitive", "Wise", "Graceful", "Private"],
    description:
      "Snakes are deep thinkers who trust their instincts above all else. They are drawn to philosophy and beauty, often pursuing artistic or intellectual careers. Their reserved exterior conceals a passionate inner world they share only with a trusted few.",
    luckyNumbers: [2, 8, 9],
    luckyColors: ["Black", "Red", "Yellow"],
    luckyFlower: "Orchid",
    compatible: ["Ox", "Rooster"],
    avoid: ["Tiger", "Rabbit", "Snake", "Sheep", "Pig"],
  },
  {
    index: 6,
    name: "Horse",
    emoji: "🐴",
    traits: ["Energetic", "Independent", "Impatient", "Free-spirited", "Warm-hearted"],
    description:
      "Horses are restless souls who crave adventure and freedom. Their enthusiasm is infectious and their social skills are exceptional. They love deeply but fear being tied down, making relationships a lifelong balancing act between connection and liberty.",
    luckyNumbers: [2, 3, 7],
    luckyColors: ["Yellow", "Green"],
    luckyFlower: "Calla Lily",
    compatible: ["Tiger", "Sheep", "Dog"],
    avoid: ["Rat", "Ox", "Rooster", "Horse"],
  },
  {
    index: 7,
    name: "Sheep",
    emoji: "🐑",
    traits: ["Calm", "Gentle", "Sympathetic", "Creative", "Perseverant"],
    description:
      "Sheep (also called Goat or Ram) are gentle souls with deeply creative spirits. They value harmony above conflict and possess a natural empathy that makes them wonderful friends and partners. Their artistic sensibilities often lead them toward creative professions.",
    luckyNumbers: [2, 7],
    luckyColors: ["Brown", "Red", "Purple"],
    luckyFlower: "Carnation",
    compatible: ["Rabbit", "Horse", "Pig"],
    avoid: ["Ox", "Tiger", "Dog"],
  },
  {
    index: 8,
    name: "Monkey",
    emoji: "🐵",
    traits: ["Witty", "Intelligent", "Innovative", "Sociable", "Mischievous"],
    description:
      "Monkeys are the entertainers and innovators of the zodiac. Their quick minds and sharp humor make them irresistible company. They thrive on mental stimulation and can solve complex problems with apparent ease, though their restlessness can lead to unfinished projects.",
    luckyNumbers: [1, 7, 8],
    luckyColors: ["White", "Blue", "Gold"],
    luckyFlower: "Chrysanthemum",
    compatible: ["Ox", "Rabbit", "Dragon"],
    avoid: ["Tiger", "Pig"],
  },
  {
    index: 9,
    name: "Rooster",
    emoji: "🐓",
    traits: ["Observant", "Hardworking", "Courageous", "Resourceful", "Confident"],
    description:
      "Roosters are meticulous perfectionists with an eye for detail others miss. They are fiercely loyal and take great pride in their accomplishments. Their confidence can occasionally come across as boastfulness, but their follow-through on commitments is unmatched.",
    luckyNumbers: [5, 7, 8],
    luckyColors: ["Gold", "Brown", "Yellow"],
    luckyFlower: "Gladiola",
    compatible: ["Ox", "Snake", "Dragon"],
    avoid: ["Rat", "Rabbit", "Horse", "Rooster"],
  },
  {
    index: 10,
    name: "Dog",
    emoji: "🐶",
    traits: ["Loyal", "Honest", "Amiable", "Kind", "Cautious"],
    description:
      "Dogs are the most loyal and trustworthy of all the signs. Their strong sense of justice drives them to champion underdogs and speak truth even when uncomfortable. They form deep bonds and once committed to a person or cause, remain steadfastly devoted.",
    luckyNumbers: [3, 4, 9],
    luckyColors: ["Green", "Red", "Purple"],
    luckyFlower: "Rose",
    compatible: ["Rabbit", "Tiger", "Horse"],
    avoid: ["Dragon", "Sheep", "Rooster"],
  },
  {
    index: 11,
    name: "Pig",
    emoji: "🐷",
    traits: ["Compassionate", "Generous", "Diligent", "Trusting", "Sincere"],
    description:
      "Pigs are blessed with a pure heart and genuine sincerity that others rarely question. Their generosity knows few limits and they often give more than they receive. Though sometimes taken advantage of due to their trusting nature, their optimism remains resilient.",
    luckyNumbers: [2, 5, 8],
    luckyColors: ["Yellow", "Grey", "Brown"],
    luckyFlower: "Daisy",
    compatible: ["Tiger", "Rabbit", "Sheep"],
    avoid: ["Snake", "Monkey"],
  },
];

const ELEMENT_MAP: Record<number, string> = {
  0: "Metal", 1: "Metal",
  2: "Water", 3: "Water",
  4: "Wood",  5: "Wood",
  6: "Fire",  7: "Fire",
  8: "Earth", 9: "Earth",
};

const ELEMENT_COLORS: Record<string, string> = {
  Metal: "bg-gray-200 text-gray-800",
  Water: "bg-blue-100 text-blue-800",
  Wood:  "bg-green-100 text-green-800",
  Fire:  "bg-red-100 text-red-800",
  Earth: "bg-yellow-100 text-yellow-800",
};

const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

function getZodiacIndex(year: number): number {
  return ((year - 1900) % 12 + 12) % 12;
}

function getElement(year: number): string {
  return ELEMENT_MAP[year % 10];
}

function getNextYearOfSign(zodiacIndex: number, fromYear: number): number {
  let y = fromYear + 1;
  while (getZodiacIndex(y) !== zodiacIndex) y++;
  return y;
}

export default function ChineseZodiacCalculator() {
  const currentYear = new Date().getFullYear();
  const [year, setYear] = useState(1990);
  const [month, setMonth] = useState(6);
  const [day, setDay] = useState(15);

  const result = useMemo(() => {
    const zodiacIndex = getZodiacIndex(year);
    const element = getElement(year);
    const zodiac = ZODIAC_DATA[zodiacIndex];
    const nextYear = getNextYearOfSign(zodiacIndex, currentYear);
    const showJanFebWarning = month <= 2;
    return { zodiac, element, nextYear, showJanFebWarning };
  }, [year, month, currentYear]);

  const explanation = (
    <div className="prose max-w-none text-gray-700 space-y-4">
      <p>
        The Chinese zodiac (shengxiao, meaning "born resembling") is one of humanity's oldest and most enduring astrological systems, predating the Western zodiac in continuous popular use by centuries. Unlike the Western system based on the position of the sun among the constellations at birth, the Chinese zodiac assigns a symbolic animal to each year in a repeating 12-year cycle. Each animal is believed to imprint personality traits, strengths, weaknesses, and life tendencies onto those born in its year.
      </p>
      <p>
        <strong>Origins and Mythology</strong><br />
        The most popular legend explaining the zodiac order is the Great Race. According to this story, the Jade Emperor (the supreme deity in Chinese folk religion) decreed that a great race would determine which animals would represent the years of the calendar. The Rat, despite being the smallest competitor, cleverly hitched a ride on the Ox's back and leaped off at the finish line to claim first place. The Ox came second, followed by Tiger, Rabbit, Dragon (who delayed to help rain-parched villages), Snake (who hitched a ride on Horse's hoof), Horse, Sheep, Monkey, Rooster, Dog, and finally the Pig, who arrived last after stopping for a nap and a meal.
      </p>
      <p>
        <strong>The Five Elements</strong><br />
        The 12-year zodiac cycle is further refined by a 10-year cycle of five elements: Wood, Fire, Earth, Metal, and Water. Each element governs two consecutive years, creating a 60-year grand cycle (jiazi) before the exact combination of animal and element repeats. The element significantly modifies the animal's expression — a Wood Rat differs meaningfully in temperament and fortune from a Water Rat or Metal Rat. The element system is rooted in Wu Xing, the foundational Chinese metaphysical framework describing how five fundamental forces interact through generation and destruction cycles.
      </p>
      <p>
        <strong>The Chinese New Year Complication</strong><br />
        A critical nuance: the Chinese zodiac year does not begin on January 1st. It starts on Chinese New Year, which falls on a different date each year (typically between January 21st and February 20th). This means that people born in January or early February may actually belong to the previous year's zodiac sign. For example, someone born on February 5, 1990 would be a Snake (1989) rather than a Horse (1990) if Chinese New Year had not yet occurred. This calculator flags those born in January or February to consult the specific year's Chinese New Year date for accuracy.
      </p>
      <p>
        <strong>Compatibility in Chinese Astrology</strong><br />
        Chinese astrological compatibility is not simply about which signs "get along." The system identifies natural allies (san he, or "three harmonies") that form supportive triangles: Rat-Dragon-Monkey, Ox-Snake-Rooster, Tiger-Horse-Dog, and Rabbit-Sheep-Pig. It also identifies the liuhe ("six harmonies") of pairs with exceptional affinity. Conversely, each sign has a "clash" (chong) partner — directly opposite in the 12-year wheel — with whom friction is most likely. These assessments inform not just romantic compatibility but business partnerships, friendships, and even family planning in some traditional communities.
      </p>
      <p>
        <strong>Ben Ming Nian: Your Unlucky Year</strong><br />
        A fascinating and widely observed tradition holds that your own zodiac year — ben ming nian — is actually the most challenging year of the cycle, not a celebration of your sign. It is believed that offending Tai Sui (the God of the Year, a rotating deity associated with Jupiter's position) brings misfortune. To ward off bad luck, people wear red underwear or clothing (traditionally gifted by elders, never purchased for oneself) throughout their zodiac year, and may wear a red string around the wrist. Major decisions like career changes, marriage, or large investments are sometimes postponed during ben ming nian.
      </p>
      <p>
        <strong>Cultural Spread and Modern Relevance</strong><br />
        While originating in China, the zodiac system spread throughout East and Southeast Asia, with local variations in Vietnam, Korea, Japan, and beyond. In Vietnam, the Rabbit is replaced by a Cat; in Japan, the Boar replaces the Pig. Today, the Chinese zodiac remains a living cultural institution — influencing everything from birth rate planning (Dragon years consistently see birth rate spikes in China, Hong Kong, and Chinese diaspora communities) to business decisions, festival celebrations, and gift-giving traditions worldwide.
      </p>
    </div>
  );

  const faqs = [
    {
      question: "How is the Chinese zodiac animal determined?",
      answer: "Your zodiac animal is determined by your birth year in the Chinese lunar calendar. The formula is: (year - 1900) mod 12, giving a number 0-11 corresponding to Rat through Pig in order. However, if you were born in January or February, you may need to check whether Chinese New Year had occurred yet in your birth year.",
    },
    {
      question: "What does the element add to my Chinese zodiac?",
      answer: "The five elements (Wood, Fire, Earth, Metal, Water) modify your zodiac animal's expression. Each element governs two years, creating a 60-year cycle before your exact animal-element combination repeats. A Fire Monkey behaves and fares differently than a Metal Monkey. The element is determined by the last digit of your birth year.",
    },
    {
      question: "Why might my zodiac sign be wrong if I was born in January or February?",
      answer: "The Chinese zodiac year begins on Chinese New Year, which falls between January 21 and February 20 each year. If you were born before that date in your birth year, you technically belong to the previous year's zodiac sign. Always verify against the specific Chinese New Year date for your birth year.",
    },
    {
      question: "Which Chinese zodiac signs are most compatible?",
      answer: "Traditional Chinese astrology identifies four harmony triangles: Rat-Dragon-Monkey, Ox-Snake-Rooster, Tiger-Horse-Dog, and Rabbit-Sheep-Pig. Signs within the same triangle are considered highly compatible. Each sign also has a direct opposite on the wheel (e.g., Rat and Horse, Ox and Sheep) that traditionally represents the most challenging pairing.",
    },
    {
      question: "Is the Chinese zodiac the same as Western astrology?",
      answer: "No. Western astrology assigns signs based on the sun's position among constellations at the time of birth, cycling through 12 signs annually (one per month). The Chinese zodiac assigns signs based on the year of birth, cycling through 12 animals over 12 years. They share the number 12 and the concept of symbolic archetypes but are independent systems with different cultural foundations and interpretive frameworks.",
    },
  ];

  const relatedCalculators = [
    { name: "Love Compatibility Calculator", href: "/calculators/lifestyle/love-compatibility-calculator" },
    { name: "Days Alive Calculator", href: "/calculators/lifestyle/days-alive-calculator" },
    { name: "Dog Age Calculator", href: "/calculators/lifestyle/dog-age-calculator" },
  ];

  const { zodiac, element, nextYear, showJanFebWarning } = result;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumbs
        items={[
          { label: "Lifestyle", href: "/calculators/lifestyle" },
          { label: "Chinese Zodiac Calculator", href: "/calculators/lifestyle/chinese-zodiac-calculator" },
        ]}
      />
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Chinese Zodiac Calculator</h1>
        <p className="text-base text-gray-600">Discover your Chinese zodiac animal, element, and personality traits</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Input */}
        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 space-y-6">
          <h2 className="text-lg font-semibold text-gray-800">Enter Your Birth Date</h2>

          {/* Year */}
          <div>
            <div className="flex justify-between items-center mb-3">
              <label className="text-sm font-semibold text-gray-700">Birth Year</label>
              <input
                type="number"
                min={1924}
                max={currentYear}
                value={year}
                onChange={(e) => {
                  const v = parseInt(e.target.value);
                  if (!isNaN(v) && v >= 1924 && v <= currentYear) setYear(v);
                }}
                className="w-28 px-3 py-1.5 text-right border border-gray-300 rounded-md text-sm font-semibold text-blue-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <input
              type="range"
              min={1924}
              max={currentYear}
              step={1}
              value={year}
              onChange={(e) => setYear(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>1924</span>
              <span>{currentYear}</span>
            </div>
          </div>

          {/* Month */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Birth Month</label>
            <select
              value={month}
              onChange={(e) => setMonth(parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {MONTHS.map((m, i) => (
                <option key={m} value={i + 1}>{m}</option>
              ))}
            </select>
          </div>

          {/* Day */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Birth Day</label>
            <select
              value={day}
              onChange={(e) => setDay(parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          {showJanFebWarning && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-800">
              <strong>Note:</strong> You were born in January or February. Chinese New Year typically falls between Jan 21 and Feb 20. If your birthday falls before Chinese New Year in {year}, your zodiac sign may actually be {ZODIAC_DATA[((getZodiacIndex(year) - 1 + 12) % 12)].name} ({year - 1}).
            </div>
          )}
        </div>

        {/* Result */}
        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 space-y-5">
          <h2 className="text-lg font-semibold text-gray-800">Your Chinese Zodiac</h2>

          {/* Main result card */}
          <div className="bg-gradient-to-br from-red-50 to-yellow-50 border border-red-100 rounded-xl p-6 text-center">
            <div className="text-7xl mb-3">{zodiac.emoji}</div>
            <div className="text-2xl font-bold text-gray-900">{zodiac.name}</div>
            <div className="flex items-center justify-center gap-2 mt-2">
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${ELEMENT_COLORS[element]}`}>
                {element} {zodiac.name}
              </span>
            </div>
            <div className="text-sm text-gray-500 mt-2">{year} · {element} element</div>
          </div>

          {/* Traits */}
          <div>
            <div className="text-sm font-semibold text-gray-700 mb-2">Key Traits</div>
            <div className="flex flex-wrap gap-2">
              {zodiac.traits.map((trait) => (
                <span key={trait} className="px-2.5 py-1 bg-blue-50 text-blue-700 text-xs rounded-full font-medium">
                  {trait}
                </span>
              ))}
            </div>
          </div>

          {/* Description */}
          <p className="text-sm text-gray-600 leading-relaxed">{zodiac.description}</p>

          {/* Lucky info */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-green-50 rounded-lg p-3">
              <div className="text-xs font-semibold text-green-700 mb-1">Lucky Numbers</div>
              <div className="text-sm text-green-800">{zodiac.luckyNumbers.join(", ")}</div>
            </div>
            <div className="bg-purple-50 rounded-lg p-3">
              <div className="text-xs font-semibold text-purple-700 mb-1">Lucky Colors</div>
              <div className="text-sm text-purple-800">{zodiac.luckyColors.join(", ")}</div>
            </div>
            <div className="bg-pink-50 rounded-lg p-3">
              <div className="text-xs font-semibold text-pink-700 mb-1">Compatible Signs</div>
              <div className="text-sm text-pink-800">{zodiac.compatible.join(", ")}</div>
            </div>
            <div className="bg-orange-50 rounded-lg p-3">
              <div className="text-xs font-semibold text-orange-700 mb-1">Next Year of {zodiac.name}</div>
              <div className="text-sm font-bold text-orange-800">{nextYear}</div>
            </div>
          </div>
        </div>
      </div>

      <CalculatorLayout
        title="Chinese Zodiac Calculator"
        description="Discover your Chinese zodiac animal, element, and personality traits"
        explanation={explanation}
        faqs={faqs}
        relatedCalculators={relatedCalculators}
      >
        <div></div>
      </CalculatorLayout>
    </div>
  );
}
