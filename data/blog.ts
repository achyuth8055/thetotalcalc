// Blog posts — original long-form articles (1,000–1,200 words each), each on a
// distinct topic with no shared/templated copy. Body is structured into sections
// so the post page can render headings, paragraphs, and lists.

export interface BlogSection {
  heading?: string;
  paragraphs?: string[];
  list?: string[];
}

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string; // ISO
  readingMinutes: number;
  category: string;
  related?: { name: string; href: string };
  body: BlogSection[];
}

export const POSTS: BlogPost[] = [
  {
    slug: "child-tax-credit-2025-what-changed",
    title: "The 2025 Child Tax Credit: what changed, and how to get every dollar",
    description:
      "The Child Tax Credit was rewritten for 2025. Here is what the new $2,200 figure means in practice, who the refundable portion really helps, and the mistakes that cost families money.",
    date: "2026-06-09",
    readingMinutes: 6,
    category: "Family & Tax Credits",
    related: { name: "US Child Tax Credit Calculator", href: "/calculators/benefits/us-child-tax-credit" },
    body: [
      {
        paragraphs: [
          "For a credit that touches tens of millions of households, the Child Tax Credit is surprisingly badly understood. Part of the reason is that it keeps changing, and 2025 brought one of the larger shifts in years. If your mental model of the credit is stuck on an older figure, you are probably either over- or under-estimating what your family is owed. This is a practical walk through how the 2025 version actually behaves once you stop reading headlines and start applying it to a real household.",
          "The starting number is $2,200 per qualifying child under the age of seventeen. That figure was made permanent and indexed to inflation by the 2025 reconciliation law, which is a meaningful change from the temporary patchwork families had grown used to. But the headline amount is only the beginning of the story, because two things determine what you actually receive: your income, and your tax bill.",
        ],
      },
      {
        heading: "Income decides whether you keep the full amount",
        paragraphs: [
          "The credit is generous well into the upper-middle class, but it does not last forever. Once your adjusted gross income passes $200,000 as a single filer, or $400,000 if you are married filing jointly, the credit begins to taper. The taper is mechanical: for every $1,000 of income above your threshold — and any part of a thousand counts as a whole step — you lose $50 of credit. A married couple earning $410,000 with two children, for example, sees ten steps of reduction, or $500 off their $4,400 base, leaving $3,900.",
          "Most families never reach the phase-out at all, which is why the more important question for them is not income but the second factor: how the refundable portion works.",
        ],
      },
      {
        heading: "The refundable portion is where low earners win or lose",
        paragraphs: [
          "A non-refundable credit can only erase tax you owe. If your tax bill is small, a $4,400 credit that is purely non-refundable would be wasted past the point where your tax hits zero. This is exactly the situation many working families face, and it is why the Additional Child Tax Credit exists. It lets you receive part of the credit as a cash refund even when you owe little or no income tax.",
          "The refundable amount is capped two ways. First, it cannot exceed $1,700 per child. Second, it is calculated as 15% of your earned income above $2,500. That second rule is the one that quietly limits large, low-income families: a parent of three earning $20,000 has only $17,500 of earnings above the $2,500 floor, and 15% of that is $2,625 — well below the $5,100 per-child ceiling for three children. Their refund is limited by their wages, not by the number of children.",
          "The takeaway is that earned income, not just the number of dependents, drives the refund. A family that picks up additional earned income often unlocks more refundable credit, up to the caps.",
        ],
      },
      {
        heading: "Five things that quietly cost families money",
        list: [
          "Treating a seventeen-year-old as a qualifying child. They are over the age limit for the main credit but may still bring a $500 Credit for Other Dependents.",
          "Assuming the whole $2,200 comes back as cash. Only up to $1,700 per child is refundable, and only if earnings support it.",
          "Letting a Social Security number lapse. Each qualifying child needs an SSN valid for work, issued before the return's due date.",
          "Using take-home pay instead of adjusted gross income to judge the phase-out.",
          "Forgetting state credits. More than a dozen states stack their own child credit on top of the federal one.",
        ],
      },
      {
        heading: "How to use the numbers",
        paragraphs: [
          "The most useful thing you can do before filing is run your real figures rather than relying on a remembered amount. Enter your filing status, the number of qualifying children, your income, and your earned income, and look at two outputs: the total credit after any phase-out, and the slice of it that could be refundable. If the refundable number is lower than you expected, the usual cause is earned income below the level needed to reach the per-child cap.",
          "It is also worth separating this credit from others it is often confused with. The Child and Dependent Care Credit, which offsets the cost of childcare so you can work, is entirely different and can be claimed alongside the Child Tax Credit for the same child. The Earned Income Tax Credit is different again, and many families qualify for all three at once.",
          "None of this is tax advice, and a complete return can shift the final figure. But understanding the two levers — income for the phase-out, earned income for the refund — puts you ahead of most filers, and makes it far less likely you leave money on the table.",
        ],
      },
    ],
  },

  {
    slug: "the-eitc-is-the-most-missed-tax-break",
    title: "The Earned Income Tax Credit is the most-missed tax break in America",
    description:
      "Every year, billions in Earned Income Tax Credit go unclaimed. Here is who qualifies, why the credit rises before it falls, and the single rule that quietly disqualifies otherwise-eligible workers.",
    date: "2026-06-09",
    readingMinutes: 6,
    category: "Tax Credits",
    related: { name: "EITC Estimator", href: "/calc/us-eitc" },
    body: [
      {
        paragraphs: [
          "There is a tax break that can be worth more than $8,000 to a working family, is fully refundable, and is routinely left unclaimed by roughly one in five people who are entitled to it. It is the Earned Income Tax Credit, and the gap between who could claim it and who does is one of the quieter failures in the tax system. The money is real, the rules are knowable, and the main barrier is simply that people assume it is not for them.",
          "The assumption is understandable. The EITC behaves unlike almost any other part of the tax code, and that strangeness is exactly what trips people up.",
        ],
      },
      {
        heading: "A credit that grows before it shrinks",
        paragraphs: [
          "Most benefits start at a maximum and fade as you earn more. The EITC does the opposite at first. It phases in: as you earn your first dollars of wages or self-employment income, the credit grows with every dollar, at a rate that depends on family size. With one child the phase-in rate is 34 cents per dollar; with two it is 40 cents; with three or more it is 45 cents. So the credit rewards work on the way up.",
          "Then it plateaus at a maximum — in 2025, that is $649 with no children, $4,328 with one, $7,152 with two, and $8,046 with three or more. The plateau holds across a band of income. Only after a higher threshold does the credit begin to phase out, falling gradually to zero at the income limit for your situation. This rise-plateau-fall shape is why a worker can earn more and, past a point, see the credit shrink slightly even as take-home pay rises.",
        ],
      },
      {
        heading: "You do not need children to qualify",
        paragraphs: [
          "The single most common reason people skip the EITC is the belief that it is only for parents. It is not. Childless workers between the ages of 25 and 64 can claim a smaller version, worth up to $649 in 2025, provided their income is under roughly $19,104 (single) or $26,214 (married filing jointly). For someone on a modest wage, that is not a trivial sum, and it is left on the table constantly by people who never thought to look.",
          "Self-employed workers are also covered. Net earnings from a side business or gig work count as earned income, the same as wages. The credit was built for exactly these workers, even if the paperwork feels more intimidating than a simple W-2.",
        ],
      },
      {
        heading: "The rule that disqualifies people instantly",
        paragraphs: [
          "There is one cliff worth knowing about. The EITC has an investment-income limit — $11,950 in 2025 — and it is a hard cutoff, not a gentle taper. Earn a dollar of investment income above that line and the entire credit disappears, no matter how low your wages are. Investment income here includes interest, dividends, capital gains, and certain rental and royalty income. For most low-wage workers this never comes into play, but for someone with a brokerage account or a rental property, it can quietly erase a credit they would otherwise receive.",
          "A second trap is filing status: married couples generally cannot claim the EITC if they file separately. And everyone on the return usually needs a valid Social Security number.",
        ],
      },
      {
        heading: "Why the money goes unclaimed",
        list: [
          "People assume childless workers are excluded — they are not.",
          "First-time filers and those who recently started working do not realize they crossed into eligibility.",
          "Workers who are not required to file skip filing entirely, and you cannot get the credit without a return.",
          "Self-employed people underestimate that their net earnings count.",
          "Fear of getting it wrong leads people to leave it off rather than ask.",
        ],
      },
      {
        heading: "What to do about it",
        paragraphs: [
          "The fix is unglamorous: file a return, even if your income is low enough that you are not required to, and check the EITC. Because the credit is refundable, filing can put money in your pocket rather than just settling a bill. If you qualified in a prior year and never claimed it, you can usually still file or amend within three years and recover it.",
          "Before you file, it helps to see roughly where you land. Enter your filing status, number of qualifying children, earned income, and adjusted gross income, and the estimate will show whether you are in the phase-in, the plateau, or the phase-out, and approximately how much the credit is worth. It will also catch the investment-income cliff. None of this replaces the IRS's own determination, but it turns a credit most people ignore into one you can actually plan around.",
        ],
      },
    ],
  },

  {
    slug: "where-does-my-american-paycheck-go",
    title: "Where does my American paycheck actually go?",
    description:
      "Your salary and your take-home pay are two very different numbers. This is a clear breakdown of federal income tax, Social Security, Medicare, and why the gap is bigger than most people expect.",
    date: "2026-06-09",
    readingMinutes: 6,
    category: "Salary & Pay",
    related: { name: "US Salary After Tax Calculator", href: "/calc/us-salary-after-tax" },
    body: [
      {
        paragraphs: [
          "Almost everyone has had the experience of being thrilled by a salary figure and then deflated by the first paycheck. The gap between the two is not a mistake or a hidden fee; it is the predictable result of several different taxes, each working in its own way. Understanding them turns a confusing deduction line into something you can anticipate and plan around.",
          "Broadly, two kinds of federal tax come out of a typical paycheck, and they behave very differently from each other. Add a third layer — state tax — and you have the full picture of why the headline salary is never what lands in your account.",
        ],
      },
      {
        heading: "Federal income tax is progressive",
        paragraphs: [
          "The first deduction is federal income tax, and it works in slices. After subtracting the standard deduction — $15,750 for a single filer in 2025 — your remaining taxable income is split across brackets, each taxed at its own rate, from 10% on the first slice up to 37% at the very top. Crucially, only the income that falls within a bracket is taxed at that bracket's rate. So being 'in the 22% bracket' does not mean 22% of everything; it means your last dollars are taxed at 22% while earlier dollars were taxed less.",
          "This is why your effective rate — total income tax divided by total income — is always lower than your top bracket. A single person earning $60,000 pays around $5,072 in federal income tax, an effective rate under 9%, despite touching the 12% bracket.",
        ],
      },
      {
        heading: "FICA is flat, and it is the part people forget",
        paragraphs: [
          "The second federal deduction is FICA, the payroll tax that funds Social Security and Medicare. Unlike income tax, it does not care about brackets or deductions. Social Security takes 6.2% of your wages up to an annual ceiling — $176,100 in 2025 — and nothing above that. Medicare takes 1.45% of every dollar of wages with no ceiling at all, and adds an extra 0.9% on wages above $200,000 for singles or $250,000 for couples.",
          "For most workers, FICA is a bigger surprise than income tax, because it starts from the first dollar and has no standard deduction to soften it. On that $60,000 salary, FICA alone is $4,590 — nearly as much as the income tax. Your employer quietly matches the Social Security and Medicare portions, which is part of why hiring you costs more than your salary.",
        ],
      },
      {
        heading: "Putting it together",
        paragraphs: [
          "On a $60,000 single salary, roughly $5,072 of federal income tax and $4,590 of FICA come to about $9,662, leaving around $50,338 of federal take-home — just under $4,195 a month. And that is before state tax, retirement contributions, and health premiums, all of which come out too.",
          "State tax is where outcomes diverge sharply. A worker in Texas or Florida, which levy no state income tax, keeps that $50,338. The same worker in California or New York hands over a few thousand more. This single difference can outweigh a modest salary bump when comparing offers in different states, which is why take-home, not headline pay, is the number that matters.",
        ],
      },
      {
        heading: "Things that change the math in your favor",
        list: [
          "Pre-tax retirement contributions (401(k), traditional IRA) lower taxable income, cutting income tax now.",
          "Health savings account contributions are pre-tax and reduce both income and, in some cases, payroll tax.",
          "Pre-tax health and commuter benefits shrink taxable wages.",
          "Moving to a no-income-tax state removes a whole layer of deduction.",
          "Adjusting your W-4 keeps withholding close to your real bill, so you neither overpay nor face a surprise.",
        ],
      },
      {
        heading: "A note on refunds",
        paragraphs: [
          "Many people treat a big tax refund as a windfall, but it usually means you over-withheld and lent the government money interest-free all year. The opposite — a surprise bill — means you under-withheld. The goal is to land close to zero, keeping more of each paycheck and avoiding shocks at filing time. Estimating your take-home pay first, then comparing it to your actual paystub, is the simplest way to spot when your withholding has drifted and needs a tweak.",
        ],
      },
    ],
  },

  {
    slug: "lower-your-property-tax-legally",
    title: "How to lower your property tax, legally",
    description:
      "Property tax is one of the few big bills you can actually reduce. Exemptions, assessment appeals, and understanding effective rates can save homeowners hundreds or thousands a year.",
    date: "2026-06-09",
    readingMinutes: 6,
    category: "Property Tax",
    related: { name: "Property Tax Estimator", href: "/calc/us-property-tax" },
    body: [
      {
        paragraphs: [
          "Most household bills are fixed: you cannot negotiate your electricity rate or talk your way out of a parking fine. Property tax is the unusual exception. It is large, recurring, and — to a degree that surprises many homeowners — contestable. Between exemptions you may not have claimed and assessments that may be too high, a meaningful number of owners are paying more than they need to, year after year.",
          "Understanding how the bill is built is the first step to lowering it. Property tax is, at heart, a value multiplied by a rate. Change either side of that equation in your favor and the bill falls.",
        ],
      },
      {
        heading: "Why identical homes pay wildly different taxes",
        paragraphs: [
          "The 'rate' side of the equation is intensely local. It is set not by one government but by the overlapping layers — county, city, school district, and special districts — that each levy a piece. Combine them and you get an effective rate, the share of your home's value you pay each year. That rate ranges from well under 1% in low-tax states to over 2% in the highest.",
          "The practical consequence is that location matters more than price. A $300,000 home in Texas, at an effective rate near 1.68%, carries about $5,040 in annual tax; the same home in California, near 0.71%, runs closer to $2,130. Neither owner can change their state's rate, but knowing your effective rate tells you whether your bill is in a normal range or worth investigating.",
        ],
      },
      {
        heading: "Exemptions: money you may be leaving unclaimed",
        paragraphs: [
          "The 'value' side is where most savings hide, and the biggest lever is the homestead exemption. It removes a slice of your home's value from taxation if the property is your primary residence. Florida exempts up to $50,000 of value; Texas offers a substantial school-district exemption; other states structure theirs differently. On a home in a state with a 1% effective rate, a $50,000 exemption is worth about $500 a year — every year you hold the home.",
          "The catch is that exemptions are usually not automatic. You typically apply once, through your county assessor, and many owners simply never do. On top of the general homestead exemption, many states layer additional relief for people over 65, veterans, surviving spouses, and people with disabilities, sometimes freezing the assessed value so it cannot rise. Each has its own eligibility test and deadline, often early in the year.",
        ],
      },
      {
        heading: "Appealing an assessment that is too high",
        paragraphs: [
          "If your home's assessed value looks higher than what comparable homes are selling for, you can appeal. The process varies by county but generally involves gathering recent sales of similar nearby properties, documenting any condition issues that reduce your home's value, and filing within a short window — often 30 to 60 days after the assessment notice. A successful appeal lowers the value the rate is applied to, and the saving repeats every year until the next reassessment.",
          "Appeals are not guaranteed, and not every assessment is wrong. But assessors work at scale and rely on mass models, so individual homes are sometimes misvalued. The cost of checking is low, and the potential saving compounds.",
        ],
      },
      {
        heading: "A homeowner's checklist",
        list: [
          "Look up your home's assessed value and effective rate on your county assessor's site.",
          "Confirm you have filed for the homestead exemption if the home is your primary residence.",
          "Check whether you qualify for senior, veteran, or disability exemptions and their deadlines.",
          "Compare your assessed value to recent sales of similar nearby homes.",
          "Note your county's appeal window and act quickly if your valuation looks high.",
        ],
      },
      {
        heading: "Start with an estimate",
        paragraphs: [
          "Before any of this, it helps to know roughly what your bill should be. Estimating annual property tax from your home value and state gives you a benchmark; estimating your homestead exemption shows what you might already be entitled to. If your actual bill is far above the estimate, that is a signal to dig into your assessment and exemptions. If it is in line, you at least have the confidence that you are not overpaying. Either way, these are among the few four-figure bills a household can genuinely move.",
        ],
      },
    ],
  },

  {
    slug: "universal-credit-2025-26-plain-english",
    title: "Universal Credit in 2025/26, in plain English",
    description:
      "Universal Credit confuses almost everyone. Here is how the standard allowance, child elements, work allowance, and the 55% taper fit together for the 2025/26 year.",
    date: "2026-06-09",
    readingMinutes: 6,
    category: "UK Benefits",
    related: { name: "Universal Credit Estimator", href: "/calc/uk-universal-credit" },
    body: [
      {
        paragraphs: [
          "Universal Credit replaced a tangle of older benefits with a single monthly payment, and in doing so it became famous for being hard to understand. The complexity is real, but the core machinery is more logical than it looks. Once you see how the pieces fit, you can estimate roughly what you might receive and, just as importantly, understand how working more affects it.",
          "The system has two halves: what you are entitled to, and what gets taken away because of income. Get those two ideas straight and the rest follows.",
        ],
      },
      {
        heading: "Your maximum award is built from blocks",
        paragraphs: [
          "Everything starts with the standard allowance, a monthly amount that depends only on your age and whether you claim as a single person or a couple. For 2025/26 it ranges from £316.98 for a single person under 25 up to £628.10 for a couple where at least one partner is 25 or over. This is the foundation.",
          "On top of the standard allowance, you add elements for your circumstances. The most common is the child element — £333.33 a month for an eligible first child and £287.92 for others — though the two-child limit restricts this for most children born after April 2017. Further elements exist for housing costs, childcare, disability, and caring responsibilities. Add them all and you get your maximum award: the most you could receive if you had no income at all.",
        ],
      },
      {
        heading: "The taper: how earnings reduce the award",
        paragraphs: [
          "Universal Credit is designed so that work always pays, which is why it tapers rather than cutting off. If you have children or a limited capability for work, you get a work allowance — an amount you can earn each month before anything is deducted. Above that allowance, every £1 of take-home earnings reduces your award by 55p. That is the taper, and the 55% rate is the single most important number in the system.",
          "Other income — such as certain other benefits — generally reduces the award pound for pound rather than through the taper. And savings matter too: capital over £16,000 usually rules out Universal Credit entirely, while savings between £6,000 and £16,000 reduce the award through an assumed income.",
        ],
      },
      {
        heading: "A worked example",
        paragraphs: [
          "Picture a single parent aged 25 or over with one child, taking home £800 a month. Their standard allowance of £400.14 plus a £333.33 child element gives a maximum of £733.47. Because they have a child, a work allowance of £411 applies, so only the £389 of earnings above it is tapered. At 55%, that is about £214, which is subtracted from the maximum to leave roughly £519 a month.",
          "Notice what happens at the edges. Earn less, and the award climbs toward the £733.47 maximum. Earn more, and the taper takes a bit more — but never all of it, so each extra hour of work still leaves you better off overall. That gradual reduction is the whole point of the design.",
        ],
      },
      {
        heading: "What trips people up",
        list: [
          "Confusing gross pay with take-home pay — the taper applies to earnings after tax and National Insurance.",
          "Forgetting the two-child limit when counting child elements.",
          "Not realizing housing and childcare support can add substantially to the award.",
          "Overlooking the £16,000 savings limit, which ends entitlement entirely.",
          "Assuming the first payment is immediate — it usually arrives about five weeks after claiming.",
        ],
      },
      {
        heading: "Estimate first, then claim",
        paragraphs: [
          "Because so much depends on your exact circumstances, the honest advice is to treat any quick estimate as a starting point rather than a promise. A simplified calculation that covers the standard allowance, child elements, and the taper will tell you whether a claim is likely worthwhile and roughly what scale of support to expect. From there, the official service — or a detailed benefits calculator that factors in housing, childcare, and disability — gives the accurate figure.",
          "Universal Credit will never be simple, but it is not arbitrary. Entitlement built from blocks, reduced by a single taper rate, is a model you can reason about. And reasoning about it beats guessing, especially when the difference is hundreds of pounds a month.",
        ],
      },
    ],
  },

  {
    slug: "canada-family-benefits-ccb-gst-2025",
    title: "Canada's family benefits in 2025–26: the CCB and GST/HST credit",
    description:
      "Two of Canada's most valuable household benefits run quietly off your tax return. Here is how the Canada Child Benefit and the GST/HST credit are calculated for 2025–26, and why filing matters.",
    date: "2026-06-09",
    readingMinutes: 6,
    category: "Canada Benefits",
    related: { name: "Canada Child Benefit Calculator", href: "/calc/ca-child-benefit" },
    body: [
      {
        paragraphs: [
          "Two of the most valuable benefits a Canadian household can receive arrive almost invisibly. There is no monthly application, no interview, no queue — just deposits that show up if you have filed your taxes. The Canada Child Benefit and the GST/HST credit are both tied to your tax return, and both are tax-free, which makes the humble act of filing one of the highest-return chores in personal finance.",
          "Because they run off income, both benefits also shift each July, when the Canada Revenue Agency recalculates them using your previous year's return. Understanding how they are built helps you anticipate the change and, occasionally, catch a payment you were owed.",
        ],
      },
      {
        heading: "The Canada Child Benefit: large, and income-tested",
        paragraphs: [
          "The Canada Child Benefit is the bigger of the two for families with children. For the July 2025 to June 2026 benefit year, the maximum is $7,997 per year for each child under six and $6,748 for each child aged six to seventeen. If your adjusted family net income is at or below $37,487, you receive the full amount — a substantial, tax-free monthly deposit.",
          "Above that threshold, the benefit reduces on a two-tier basis. Income between $37,487 and $81,222 is reduced at a first rate that depends on how many children you have; income above $81,222 is reduced by a fixed amount plus a second, lower rate. The result is a benefit that fades gradually rather than cutting off, so even middle-income families often receive something.",
        ],
      },
      {
        heading: "A quick example",
        paragraphs: [
          "A family with two children under six and an adjusted family net income of $30,000 sits below the threshold, so they receive the full maximum: two times $7,997, or $15,994 a year — about $1,333 every month, tax-free. A family with one young child and one older child and an income of $50,000 starts from a maximum of $14,745 but, being in the first reduction tier, loses about 13.5% of the income above $37,487, leaving roughly $13,056. Same country, very different cheques, driven entirely by income and the ages of the children.",
        ],
      },
      {
        heading: "The GST/HST credit: small, broad, and easy to miss",
        paragraphs: [
          "The GST/HST credit is quieter but reaches far more people, because it is aimed at offsetting the sales tax that lower-income households pay. For 2025–26 it is worth up to roughly $533 a year for a single adult and $698 for a couple, plus about $184 for each child under nineteen. It is paid quarterly, in July, October, January, and April.",
          "Like the child benefit, it phases out with income — reduced by 5% of adjusted family net income above about $45,521 — but its real quirk is how invisible it is. Most people are considered automatically when they file, so the only way to miss it is to not file at all. Newcomers to Canada are the exception: they usually need to complete a specific form to start receiving it rather than waiting for automatic enrolment.",
        ],
      },
      {
        heading: "Why filing is the whole game",
        list: [
          "Both benefits are recalculated every July from your prior-year return, so filing on time keeps payments uninterrupted.",
          "You must file even with no income — non-filers simply do not get assessed.",
          "Both partners in a couple need to file for the family to be assessed correctly.",
          "Provincial top-ups, such as the Ontario Child Benefit or the BC Family Benefit, often ride alongside the federal amounts.",
          "Newcomers should apply rather than wait for automatic enrolment.",
        ],
      },
      {
        heading: "Plan around the July reset",
        paragraphs: [
          "Because both benefits change each July using last year's income, a big income swing takes time to show up. A year of lower income raises next July's payments; a strong year lowers them. Families planning around parental leave, a job change, or a move can use this lag to anticipate what is coming rather than being surprised by it.",
          "The simplest way to stay ahead is to estimate both benefits whenever your income or family situation changes. Knowing roughly what the Canada Child Benefit and the GST/HST credit should be — and confirming the figure once the CRA recalculates — turns two invisible deposits into something you can actually budget around. And the single action that protects both is the same: file your taxes, every year, on time.",
        ],
      },
    ],
  },
];

export function getPost(slug: string): BlogPost | undefined {
  return POSTS.find((p) => p.slug === slug);
}
