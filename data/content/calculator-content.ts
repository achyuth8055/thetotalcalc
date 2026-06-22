// Long-form, people-first content for each engine calculator.
// Kept separate from the calculator definitions so the rule logic stays lean.
// This map is merged into the registry; every entry is unique (no shared
// template text) to provide genuine, indexable content under each tool.

import type { CalculatorDefinition } from "@/lib/engine/types";

type Content = Partial<CalculatorDefinition>;

export const CONTENT: Record<string, Content> = {
  // -------------------------------------------------------------------------
  // US Child Tax Credit
  // -------------------------------------------------------------------------
  us_child_tax_credit_2025: {
    whoFor:
      "This calculator is for parents and guardians who want a fast, realistic picture of their 2025 Child Tax Credit before they file. It is most useful if you have at least one child who was under 17 at the end of the year, if your household income sits anywhere near the $200,000 single or $400,000 married phase-out lines, or if you are trying to understand how much of the credit you could actually receive as a refund when your tax bill is small. It is also helpful for separated or blended families working out which parent claims a child, and for anyone who has heard that the credit changed in 2025 and wants to see the new numbers applied to their own situation rather than a headline figure.",
    howItWorks:
      "The Child Tax Credit for 2025 is worth up to $2,200 for each qualifying child under 17, a figure made permanent and indexed by the 2025 reconciliation law. The calculator first totals your base credit from qualifying children plus a $500 Credit for Other Dependents for older or non-child dependents. It then applies the income phase-out: for every $1,000 (or part of $1,000) of adjusted gross income above your threshold, the credit drops by $50. Separately, it estimates the refundable Additional Child Tax Credit, which is the part you can receive even when you owe little tax. That refundable amount is capped at $1,700 per child and is calculated as 15% of your earned income above $2,500, so a low earner with several children is limited by their wages rather than by the per-child cap. The result is the smaller of those constraints.",
    workedExample:
      "Imagine a married couple filing jointly with two qualifying children, $100,000 of adjusted gross income, and $100,000 of earned income. Their base credit is two times $2,200, or $4,400. Because $100,000 is well below the $400,000 joint threshold, there is no phase-out, so the full $4,400 stands. To check the refundable portion, the calculator takes earned income above $2,500 ($97,500), multiplies by 15% ($14,625), and caps it at two times $1,700, or $3,400. Since $3,400 is below the $4,400 total credit, up to $3,400 could come back as a refund even if the family owed no income tax, with the remainder offsetting any tax due.",
    regionalVariations:
      "The Child Tax Credit is a federal credit, so the core amount and phase-out are the same in every state. What changes by state is the surrounding picture: roughly a dozen states, including California, Colorado, New York, and Minnesota, offer their own child tax credits or young-child credits on top of the federal one, often with different income limits and refundability. This calculator estimates only the federal credit. If you live in a state with its own credit, treat the federal figure here as a floor and check your state revenue department for an additional amount.",
    commonMistakes: [
      "Confusing the Child Tax Credit with the Child and Dependent Care Credit - they are separate, and a child can support a claim for both.",
      "Assuming the full $2,200 is always refundable. Only up to $1,700 per child is refundable, and only to the extent your earned income supports it.",
      "Counting a 17-year-old as a qualifying child. The child must be under 17 at the end of the tax year; a 17-year-old usually falls under the $500 Credit for Other Dependents instead.",
      "Forgetting that a qualifying child needs a Social Security number valid for work, issued before the return's due date.",
      "Using gross pay instead of adjusted gross income for the phase-out test.",
    ],
    deadlines:
      "You claim the Child Tax Credit on your federal income tax return for the year. For the 2025 tax year, returns are generally due in mid-April 2026, with an automatic extension to October 2026 available if you request it (an extension to file is not an extension to pay). If you miss a year, you can usually still claim a refund by filing within three years of the original deadline.",
    faqs: [
      { question: "How much is the Child Tax Credit for 2025?", answer: "Up to $2,200 per qualifying child under 17. Up to $1,700 of that per child can be refundable through the Additional Child Tax Credit if your tax liability is low and your earned income supports it." },
      { question: "At what income does the credit start to phase out?", answer: "It is reduced by $50 for every $1,000 of adjusted gross income above $200,000 for single, head of household, and married-filing-separately filers, or $400,000 for married filing jointly." },
      { question: "What is the difference between the Child Tax Credit and the refundable ACTC?", answer: "The Child Tax Credit first reduces the tax you owe. If the credit is larger than your tax, the Additional Child Tax Credit lets you receive part of the leftover as a refund - up to $1,700 per child, based on 15% of earned income over $2,500." },
      { question: "Can I claim the credit with no income?", answer: "The refundable portion depends on earned income above $2,500, so with no earned income there is generally nothing refundable, even though you may still list the child as a dependent." },
      { question: "Does a newborn qualify for the full year?", answer: "Yes. A child born at any point during the tax year is treated as a qualifying child for the whole year, provided the other tests are met." },
      { question: "What is the $500 Credit for Other Dependents?", answer: "It is a non-refundable credit for dependents who are not qualifying children under 17 - for example, a 17- or 18-year-old, a college student, or a dependent parent. This calculator includes it when you enter other dependents." },
      { question: "Do both parents claim the same child?", answer: "No. Only one taxpayer can claim a given child in a year. Separated parents typically follow the residency test or a written agreement (Form 8332) to decide who claims the child." },
      { question: "Does this calculator account for my actual tax bill?", answer: "It estimates the total credit and the refundable ceiling. Your final benefit also depends on your tax liability, which a full return determines. Treat the result as a close estimate, not a filed figure." },
      { question: "Is the credit affected by receiving other benefits?", answer: "The Child Tax Credit itself is not means-tested beyond the income phase-out, and it does not count as income for most federal benefit programs." },
      { question: "Where do the figures come from?", answer: "From the IRS Child Tax Credit guidance and the refundable-credit rules for 2025. Each result links to those sources, and the page shows the date the figures were last verified." },
    ],
  },

  // -------------------------------------------------------------------------
  // US EITC
  // -------------------------------------------------------------------------
  "us-eitc": {
    whoFor:
      "The Earned Income Tax Credit estimator is built for working people on low and moderate incomes who may be leaving money on the table. Each year a large share of eligible workers - especially those without children, people who recently started or stopped working, and those filing for the first time - never claim the EITC because they assume they do not qualify. This tool is for anyone with wages or self-employment income who wants to see, in plain terms, whether their earnings and family size put them in range, and roughly how large the credit could be. It is particularly useful for single workers aged 25 to 64 with no children, who are often surprised they qualify at all, and for parents comparing how an extra child or a change in hours affects the credit.",
    howItWorks:
      "The EITC is unusual because it rises with income before it falls. As you earn your first dollars, the credit phases in at a fixed rate per dollar of earned income: about 7.65% with no children, 34% with one child, 40% with two, and 45% with three or more. It climbs to a maximum - $649, $4,328, $7,152, or $8,046 in 2025 depending on the number of qualifying children - and holds at that plateau across a band of income. Above a threshold, it phases out at a set rate against the greater of your earned income or adjusted gross income, falling to zero at the published limit for your family size and filing status. The calculator runs all three stages and also enforces the hard rule that investment income above $11,950 disqualifies you entirely.",
    workedExample:
      "Take a single parent with one child, $15,000 of earned income and the same adjusted gross income, and no investment income. The phase-in rate of 34% on $15,000 would give about $5,100, but the credit is capped at the one-child maximum of $4,328, so the plateau applies and the estimate is $4,328. Because $15,000 is below the point where the one-child credit begins to taper, there is no reduction. If that same parent earned $40,000 instead, they would be into the phase-out band, and the credit would be reduced from $4,328 at roughly 15.98 cents per dollar above the threshold, leaving a smaller but still meaningful amount.",
    regionalVariations:
      "The federal EITC applies nationwide, but more than thirty states plus the District of Columbia offer their own earned income credits, usually calculated as a percentage of the federal amount - anywhere from around 3% to over 40%. A handful are refundable and a few are not. This estimator covers the federal credit only. If your state has its own EITC, you can often add a sizeable percentage on top, so it is worth checking your state's tax website once you know your federal figure.",
    commonMistakes: [
      "Believing you must have children to qualify. Workers aged 25 to 64 with no children can claim a smaller EITC.",
      "Stopping at gross wages. Self-employment income counts as earned income, but business losses and certain other items change the picture.",
      "Ignoring the investment-income limit. More than $11,950 of investment income in 2025 eliminates the credit entirely, regardless of earnings.",
      "Assuming more income is always better. Past the plateau, extra income reduces the credit, so a raise can slightly lower the EITC even as take-home rises.",
      "Forgetting that everyone on the return generally needs a valid Social Security number.",
    ],
    deadlines:
      "The EITC is claimed on your annual federal return; for 2025 that means filing in early 2026. By law the IRS cannot issue EITC refunds before mid-February, so even an early filer waits a little longer for that portion. If you qualified in a past year but never claimed it, you can usually file or amend within three years to recover it.",
    faqs: [
      { question: "What is the maximum EITC for 2025?", answer: "$649 with no qualifying children, $4,328 with one, $7,152 with two, and $8,046 with three or more qualifying children." },
      { question: "Can I get the EITC with no children?", answer: "Yes, if you are between 25 and 64, are not claimed as someone else's dependent, and your income is under roughly $19,104 (single) or $26,214 (married filing jointly) in 2025." },
      { question: "Why does my credit go down when I earn more?", answer: "Once your income passes the plateau for your family size, the EITC phases out gradually. This is by design - it tapers rather than cutting off suddenly." },
      { question: "Does self-employment income count?", answer: "Yes. Net self-employment earnings are earned income for the EITC, the same as wages, though you must report them properly." },
      { question: "What disqualifies me instantly?", answer: "Investment income above $11,950 in 2025 disqualifies you regardless of how low your wages are. Filing as married filing separately can also block the credit in many cases." },
      { question: "Is the EITC refundable?", answer: "Yes, fully. If the credit is larger than the tax you owe, you receive the difference as a refund." },
      { question: "Does the EITC affect other benefits?", answer: "Federal EITC refunds are not counted as income for most federal means-tested programs and are excluded from resources for a period, but rules vary, so check the specific program." },
      { question: "How accurate is this estimate?", answer: "It applies the official 2025 phase-in, plateau, and phase-out figures, but the real credit also depends on residency, relationship, and SSN tests the IRS verifies. Treat it as a strong estimate." },
      { question: "Can both parents claim the EITC for the same child?", answer: "No. A qualifying child can only be used by one taxpayer, generally the one the child lived with for more than half the year." },
      { question: "Where are the numbers from?", answer: "From the IRS EITC tables for tax year 2025, linked on the result. The page shows when the figures were last verified." },
    ],
  },

  // -------------------------------------------------------------------------
  // US Federal Income Tax
  // -------------------------------------------------------------------------
  "us-income-tax": {
    whoFor:
      "This calculator suits anyone who wants a clear, jargon-free estimate of their 2025 federal income tax before payroll math or filing software muddies the picture. It is handy when you are weighing a job offer, deciding how much to put into a pre-tax retirement account, checking whether your withholding looks roughly right, or simply trying to understand how the bracket system actually treats your income. Because it uses the standard deduction, it is most accurate for the large majority of filers who do not itemize. It is not built for complex returns with significant capital gains, business income, or itemized deductions, but it gives a solid baseline that those situations adjust from.",
    howItWorks:
      "Federal income tax is progressive, which means different slices of your income are taxed at different rates rather than your whole income at one rate. The calculator starts from your gross income, subtracts the 2025 standard deduction - $15,750 for single filers and $31,500 for married filing jointly after the 2025 law raised them - to get taxable income. It then walks that taxable income through the seven brackets (10%, 12%, 22%, 24%, 32%, 35%, and 37%), taxing each band only at its own rate. Adding the slices together gives your tax. Your effective rate, also shown, is that total divided by gross income, and it is always lower than the top bracket your income reaches because only the last slice is taxed at the highest rate.",
    workedExample:
      "Consider a single filer earning $60,000. Subtracting the $15,750 standard deduction leaves $44,250 of taxable income. The first $11,925 is taxed at 10% ($1,192.50). The remaining $32,325 falls in the 12% bracket ($3,879). There is nothing in the higher brackets, so total federal income tax is about $5,071.50 - an effective rate of roughly 8.5% on the $60,000, far below the 12% top bracket the income touches. This is why people who say they are 'in the 22% bracket' usually pay an effective rate well under that.",
    regionalVariations:
      "This is federal tax only. Most states add their own income tax, which can be a flat rate or its own set of brackets, and a few - Florida, Texas, Washington, Nevada, South Dakota, Wyoming, Alaska, Tennessee, and New Hampshire on wages - levy no broad personal income tax at all. Some cities add a local income tax on top. To see your true tax burden, add your state (and any local) tax to the federal figure here; our salary-after-tax calculator brings federal tax and payroll taxes together, and state layers are on the roadmap.",
    commonMistakes: [
      "Thinking your whole income is taxed at your top bracket. Only the income within each bracket is taxed at that bracket's rate.",
      "Mixing up marginal and effective rates. Your marginal rate is on your next dollar; your effective rate is your average across all income.",
      "Forgetting that the standard deduction was raised for 2025, which lowers taxable income compared with earlier years.",
      "Adding FICA (Social Security and Medicare) to income tax. Those are separate payroll taxes, not part of this calculation.",
      "Assuming a refund means you 'won.' A large refund usually means you over-withheld and lent the government money interest-free all year.",
    ],
    deadlines:
      "Federal income tax for 2025 is generally due by mid-April 2026. You can request an extension to file until October 2026, but any tax owed is still due in April to avoid interest and penalties. If you are self-employed or have significant untaxed income, you may also owe quarterly estimated payments throughout the year.",
    faqs: [
      { question: "What is the 2025 standard deduction?", answer: "$15,750 for single filers and $31,500 for married filing jointly (with $23,625 for heads of household), after the 2025 law increased the amounts." },
      { question: "What are the 2025 tax brackets?", answer: "Seven rates: 10%, 12%, 22%, 24%, 32%, 35%, and 37%. The top 37% rate starts above $626,350 for single filers and $751,600 for married filing jointly." },
      { question: "Does this include Social Security and Medicare tax?", answer: "No. This shows federal income tax only. FICA payroll taxes are separate - see the salary-after-tax calculator for the full picture." },
      { question: "Why is my effective rate lower than my bracket?", answer: "Because the progressive system taxes each slice of income at its own rate. Only your last dollars are taxed at the top bracket you reach." },
      { question: "Does it handle itemized deductions?", answer: "No. It uses the standard deduction, which is correct for most filers. If you itemize, your taxable income - and therefore your tax - may differ." },
      { question: "What about credits like the Child Tax Credit?", answer: "Credits reduce the tax this calculator estimates. Use the dedicated credit calculators to see those, then subtract them from the tax shown here." },
      { question: "Is state tax included?", answer: "No. This is federal only. Add your state (and any local) income tax separately for your full liability." },
      { question: "How accurate is the estimate?", answer: "Very close for a standard-deduction return with ordinary wage income. Capital gains, business income, and itemizing all change the result." },
      { question: "Where do the figures come from?", answer: "From the IRS federal rates and brackets for 2025, linked on the result, with the last-verified date shown." },
    ],
  },

  // -------------------------------------------------------------------------
  // US Salary After Tax
  // -------------------------------------------------------------------------
  "us-salary-after-tax": {
    whoFor:
      "This take-home pay estimator is for employees and job seekers who want to know what actually lands in their bank account, not just the headline salary. It helps when you are comparing two offers, negotiating a raise, budgeting around a move, or trying to understand why your paycheck is smaller than your annual salary divided by twelve. It is built for ordinary W-2 wage earners using the standard deduction. If you have large bonuses, equity, multiple jobs, or significant deductions, the figure here is a clean starting point you can refine, rather than an exact paystub.",
    howItWorks:
      "Your gross salary is reduced by two very different kinds of federal tax. The first is federal income tax, calculated progressively after the standard deduction, exactly as in our income tax calculator. The second is FICA, the payroll tax that funds Social Security and Medicare. Social Security takes 6.2% of wages up to the annual wage base - $176,100 in 2025 - and nothing above it, while Medicare takes 1.45% of all wages with no cap, plus an extra 0.9% on wages over $200,000 (single) or $250,000 (married). The calculator adds federal income tax and FICA together, subtracts them from gross, and shows your annual and monthly take-home along with each component so you can see where the money goes.",
    workedExample:
      "A single employee earning $60,000 owes about $5,071.50 in federal income tax after the standard deduction. On the payroll side, Social Security is 6.2% of $60,000 ($3,720) and Medicare is 1.45% ($870), for $4,590 of FICA, with no additional Medicare tax at this income. Total federal withholding is roughly $9,661.50, leaving about $50,338.50 of annual take-home, or just under $4,195 a month - before any state tax, 401(k) contributions, or health premiums, which would reduce it further.",
    regionalVariations:
      "Federal income tax and FICA are identical in every state, but state and local income taxes are not included here and vary enormously. A $60,000 earner keeps noticeably more in Texas or Florida, which have no state income tax, than in California or New York, where state tax can take several thousand dollars more. Some cities add their own income tax as well. Use this figure as your federal-only baseline and subtract your state and local tax to see true net pay.",
    commonMistakes: [
      "Assuming salary divided by twelve is your monthly take-home. Taxes and payroll deductions always reduce it.",
      "Overlooking the Social Security wage base. Earnings above $176,100 in 2025 are not subject to the 6.2% Social Security tax.",
      "Forgetting pre-tax deductions. 401(k), HSA, and health-premium contributions lower taxable pay and change both income tax and take-home.",
      "Ignoring state tax. In high-tax states this is one of the largest deductions and is not shown here.",
      "Treating a bonus as taxed at a higher rate forever. Bonuses are withheld at a flat supplemental rate but taxed at your normal rate when you file.",
    ],
    deadlines:
      "There is no separate deadline for take-home pay - taxes are withheld each pay period. But the annual reconciliation happens when you file your federal return by mid-April 2026. If too much was withheld you get a refund; if too little, you owe. Reviewing your Form W-4 mid-year is the simplest way to keep withholding close to your real liability.",
    faqs: [
      { question: "What is FICA?", answer: "FICA is the federal payroll tax that funds Social Security (6.2% up to the wage base) and Medicare (1.45% on all wages, plus 0.9% extra on high earnings). Employers match the Social Security and Medicare portions." },
      { question: "What is the 2025 Social Security wage base?", answer: "$176,100. You pay 6.2% Social Security tax on wages up to that amount and nothing on wages above it. Medicare has no cap." },
      { question: "Does this include state income tax?", answer: "No. It covers federal income tax and FICA only. Add your state and any local income tax for true net pay." },
      { question: "Why is my take-home less than this shows?", answer: "Likely state tax, retirement contributions, health insurance premiums, or other deductions that come out of your paycheck and are not modeled here." },
      { question: "What is the additional Medicare tax?", answer: "An extra 0.9% Medicare tax on wages above $200,000 for single filers or $250,000 for married filing jointly. The calculator applies it automatically." },
      { question: "Do pre-tax 401(k) contributions change my take-home?", answer: "Yes. They reduce taxable wages, lowering federal income tax now, though take-home falls by less than the contribution because of the tax saving." },
      { question: "Is overtime taxed more?", answer: "Overtime is taxed at your normal rates. It can push some income into a higher bracket, but only the portion above the threshold is taxed at the higher rate." },
      { question: "How accurate is this for hourly workers?", answer: "Convert your hourly pay to an annual figure (hours per week times 52) and enter it. The federal estimate will be close for steady schedules." },
      { question: "Where are the rates from?", answer: "Federal brackets and the standard deduction from the IRS, and FICA rates and the wage base from IRS payroll guidance, both linked and dated on the result." },
    ],
  },

  // -------------------------------------------------------------------------
  // US Property Tax Estimator
  // -------------------------------------------------------------------------
  "us-property-tax": {
    whoFor:
      "This estimator is aimed at home buyers, current owners, and anyone budgeting around a property purchase who needs a realistic annual property-tax figure quickly. Buyers use it to fold taxes into an affordability calculation before they fall in love with a house; owners use it to sanity-check an escrow estimate or to compare the tax burden of moving between states. It is also useful for landlords pricing a rental and for people relocating who are stunned by how differently two states treat the same home value. Because it works from a single statewide average rate, it is a planning tool rather than a substitute for your county assessor's exact bill.",
    howItWorks:
      "Property tax in the United States is broadly a percentage of your home's value applied each year by local governments to fund schools, roads, and services. That percentage, the effective rate, is what this calculator uses. You enter your home's market value and state, and it multiplies the value by the state's average effective property-tax rate to produce an annual figure, then divides by twelve for the monthly amount lenders typically collect in escrow. Effective rates vary widely - from well under 1% in low-tax states to over 2% in the highest - which is why the same $350,000 home can carry a tax bill that differs by thousands of dollars depending only on where it sits.",
    workedExample:
      "Suppose you are buying a $300,000 home in Texas, where the average effective rate is around 1.68%. Multiplying $300,000 by 1.68% gives roughly $5,040 a year, or about $420 a month set aside in escrow. The identical home in California, with an effective rate near 0.71%, would run closer to $2,130 a year. Neither figure is your exact bill - your specific county, city, and school-district rates, plus any exemptions, move it - but the comparison shows how location, not just price, drives what you pay.",
    regionalVariations:
      "Property tax is the most local of the major taxes, so variation is the whole story. Rates differ not only between states but between counties, cities, and special districts within a state, and some places reassess every year while others, like California under Proposition 13, cap how fast assessed value can rise. Newer developments may carry extra assessments for infrastructure. The statewide average used here smooths over all of that; for an exact number, look up your parcel on your county assessor's site, where the precise millage rate and assessed value are published.",
    commonMistakes: [
      "Using the purchase price as the taxable value everywhere. Many areas tax an assessed value that differs from market price, sometimes by a fixed ratio.",
      "Forgetting exemptions. Homestead, senior, veteran, and disability exemptions can cut the taxable value significantly - check the homestead calculator too.",
      "Assuming the rate never changes. Local governments adjust millage rates, and reassessments can raise your bill even if the rate holds.",
      "Overlooking special assessments. Some neighborhoods add levies for schools, water, or infrastructure on top of the base rate.",
      "Treating the statewide average as your exact bill. Your county and city rates can be well above or below the state average.",
    ],
    deadlines:
      "Property-tax due dates are set locally and vary widely - some counties bill annually, others semi-annually or quarterly, often in installments due in winter and spring. Missing a payment usually triggers interest and penalties and, eventually, a tax lien. If you pay through a mortgage escrow, the lender handles the deadlines for you. Appeal windows after a new assessment are typically short, often 30 to 60 days, so act quickly if your valuation looks too high.",
    faqs: [
      { question: "How is property tax calculated?", answer: "Generally as your property's taxable (assessed) value multiplied by a local tax rate, often expressed in mills. This tool approximates it using your state's average effective rate on market value." },
      { question: "What is an effective property-tax rate?", answer: "The tax you pay as a percentage of your home's market value. It bundles together all the local rates and assessment practices into one comparable number." },
      { question: "Why do two identical homes have different taxes?", answer: "Because rates and assessment rules differ by state, county, city, and school district. Location is often a bigger factor than the home's price." },
      { question: "Does this include exemptions?", answer: "No. It estimates the gross tax. Homestead, senior, veteran, and disability exemptions can lower it - use the homestead exemption checker to estimate those savings." },
      { question: "Can I lower my property tax?", answer: "Sometimes, by claiming exemptions you qualify for or by appealing an assessment you believe is too high relative to comparable sales." },
      { question: "Is property tax deductible?", answer: "State and local taxes, including property tax, may be deductible on a federal return if you itemize, subject to the SALT cap. Most filers using the standard deduction do not benefit." },
      { question: "How accurate is the estimate?", answer: "It is a planning estimate based on state averages. Your county assessor's site has the exact millage and assessed value for your parcel." },
      { question: "What if my state isn't listed?", answer: "Choose 'Other / not listed' to use a national-average rate, then verify with your local assessor for a precise figure." },
      { question: "Where do the rates come from?", answer: "From published average effective property-tax rates by state, linked on the result and dated when last verified." },
    ],
  },

  // -------------------------------------------------------------------------
  // US Homestead Exemption Checker
  // -------------------------------------------------------------------------
  "us-homestead": {
    whoFor:
      "This checker is for homeowners who live in the home they own and want to know whether a homestead exemption could shave money off their property-tax bill. Many owners qualify but never apply, simply because they do not know the exemption exists or assume it is automatic. It is especially relevant for recent buyers in their first full year of ownership, for seniors and veterans who may qualify for enhanced exemptions, and for anyone comparing the after-exemption cost of owning in different states. It answers two questions at once: are you likely eligible, and roughly how much could the exemption be worth each year.",
    howItWorks:
      "A homestead exemption removes a slice of your home's value from taxation, so you are taxed on a lower amount. The size of that slice varies dramatically by state - some exempt a flat dollar amount of value, others a percentage, and a few tie it to age or income. The checker confirms the basic eligibility test (the property must be your primary residence) and then estimates the saving by multiplying the typical exemption amount in your state by that state's effective property-tax rate. The result is the approximate yearly reduction, not the new total bill, so you can see the exemption's value at a glance.",
    workedExample:
      "Picture a primary residence in Florida, which offers a homestead exemption of up to $50,000 of value, in a state with an effective rate near 0.86%. The estimated annual saving is $50,000 multiplied by 0.86%, or about $430 a year - money you only receive if you actually file for the exemption. In Texas, where the school-district homestead exemption is larger, the saving is bigger; in states with no general homestead exemption, the checker will tell you the relief varies locally and points you to your county.",
    regionalVariations:
      "Homestead rules are set entirely at the state and county level, so they are some of the most varied provisions in the tax code. Florida and Texas have generous, well-known exemptions; Illinois and New York structure theirs differently; California's is modest for general property tax but protective in bankruptcy. Many states layer additional exemptions for people over 65, veterans, surviving spouses, and people with disabilities, sometimes freezing the assessed value entirely. Because of this, the checker treats unlisted states as 'varies' and always recommends confirming with the local assessor, who administers the actual exemption and its deadlines.",
    commonMistakes: [
      "Assuming the exemption is automatic. In most places you must apply, often once, through your county assessor.",
      "Claiming it on a second home or rental. Homestead exemptions apply only to your primary residence.",
      "Missing the application deadline, which is often early in the year and easy to overlook after a purchase.",
      "Stacking exemptions you don't qualify for. Senior or veteran add-ons have their own age, income, or service tests.",
      "Forgetting to reapply after moving. The exemption follows the residence, not you, so a new home usually needs a new application.",
    ],
    deadlines:
      "Application deadlines are local and often fall in the first quarter of the year - Florida's is March 1, for example - with the exemption taking effect for that tax year. Some states require a one-time application that then renews automatically as long as you keep living there; others ask for periodic reconfirmation. After buying a home, applying as soon as you move in is the safest approach so you do not lose a year of savings.",
    faqs: [
      { question: "What is a homestead exemption?", answer: "A reduction in the taxable value of your primary residence, which lowers your property-tax bill. The amount and rules are set by your state and county." },
      { question: "Who qualifies?", answer: "Generally, owners who occupy the home as their primary residence. Some states add enhanced exemptions for seniors, veterans, surviving spouses, and people with disabilities." },
      { question: "Is it automatic?", answer: "Usually not. Most states require an application through the county assessor, often once, after which it may renew automatically while you live there." },
      { question: "How much can it save me?", answer: "It depends on your state's exemption amount and effective tax rate. This checker estimates the yearly saving; your county provides the exact figure." },
      { question: "Can I claim it on a rental or vacation home?", answer: "No. The exemption is limited to your primary residence. Claiming it improperly can lead to back taxes and penalties." },
      { question: "Do seniors and veterans get more?", answer: "Often yes. Many states offer additional exemptions or assessment freezes based on age, disability, or military service, with their own eligibility tests." },
      { question: "What if my state isn't listed?", answer: "Choose 'Other / not listed' - the checker will flag that relief varies and direct you to your county assessor for specifics." },
      { question: "Does the exemption affect my mortgage escrow?", answer: "Yes. A lower tax bill reduces the amount your lender collects in escrow, which can lower your monthly payment after the exemption is applied." },
      { question: "Where do the figures come from?", answer: "From published state homestead exemption amounts and effective rates, linked and dated on the result. Always confirm with your county." },
    ],
  },

  // -------------------------------------------------------------------------
  // Loan EMI
  // -------------------------------------------------------------------------
  "loan-emi": {
    whoFor:
      "This EMI calculator is for anyone taking on or comparing a fixed-instalment loan - a personal loan, car loan, home loan, or any borrowing repaid in equal monthly payments. It helps borrowers see the true monthly commitment before signing, compare offers with different rates and terms on a like-for-like basis, and understand how much of their money goes to interest versus principal over the life of the loan. It is equally useful for someone deciding between a shorter, pricier-per-month loan and a longer, cheaper-per-month one, where the monthly figure and the total interest pull in opposite directions.",
    howItWorks:
      "EMI stands for Equated Monthly Instalment: a single fixed payment that covers both interest and principal so the loan is fully repaid by the end of the term. The calculator uses the standard amortization formula, which takes your principal, the monthly interest rate (the annual rate divided by twelve), and the number of months, and solves for the payment that exactly clears the balance. Early payments are mostly interest because the outstanding balance is large; later payments are mostly principal as the balance shrinks. The tool reports the monthly EMI, the total interest you will pay, and the total amount repaid, so the real cost of borrowing is visible up front.",
    workedExample:
      "Borrow $200,000 at 8% annual interest over five years. The monthly rate is about 0.667%, and over 60 months the EMI works out to roughly $4,056. Across all 60 payments you repay about $243,300, meaning around $43,300 is interest on top of the $200,000 borrowed. Stretching the same loan to ten years would lower the monthly payment but raise total interest substantially, which is the classic trade-off the calculator makes easy to see.",
    regionalVariations:
      "The amortization math is universal, but how lenders quote and compound interest is not. Some markets advertise a nominal annual rate, others an APR that bundles fees, and compounding conventions differ. This calculator assumes monthly compounding on the rate you enter and excludes fees, insurance, and taxes, which a lender's official quote may add. Currency formatting defaults to dollars, but the result is the same in any currency because the formula is rate-and-term based, not country-specific.",
    commonMistakes: [
      "Focusing only on the monthly payment. A lower EMI from a longer term usually means much more total interest.",
      "Entering the annual rate where a monthly rate is needed, or vice versa. This tool takes the annual rate and converts it for you.",
      "Ignoring fees. Origination fees, insurance, and taxes are not in the EMI and raise the true cost.",
      "Forgetting that extra payments shorten the loan. Paying more than the EMI reduces principal faster and cuts total interest.",
      "Assuming a variable rate stays fixed. If your rate can change, the EMI here reflects only the current rate.",
    ],
    deadlines:
      "Loan payments are due on a schedule set by your lender, typically the same date each month. Missing a payment usually triggers a late fee and can harm your credit; repeated misses risk default. If your loan allows prepayment without penalty, making extra payments early in the term saves the most interest because that is when the balance - and therefore the interest charge - is highest.",
    faqs: [
      { question: "What is EMI?", answer: "An Equated Monthly Instalment is the fixed amount you pay each month to repay a loan, covering both interest and principal so the balance reaches zero at the end of the term." },
      { question: "How is EMI calculated?", answer: "With the amortization formula using principal, the monthly interest rate, and the number of months. The calculator does the math from the annual rate and term you enter." },
      { question: "Why is more of my early payment interest?", answer: "Because interest is charged on the outstanding balance, which is largest at the start. As you repay principal, the interest share of each payment falls." },
      { question: "Does a longer term reduce the cost?", answer: "It reduces the monthly payment but increases total interest, because you owe the balance for longer. The calculator shows both so you can weigh them." },
      { question: "Are fees included?", answer: "No. The EMI covers principal and interest only. Origination fees, insurance, and taxes are extra and vary by lender." },
      { question: "What if I make extra payments?", answer: "Extra payments reduce principal, shorten the loan, and cut total interest. This tool shows the scheduled EMI; prepayments would lower the totals." },
      { question: "Does it work for any currency?", answer: "Yes. The formula depends on rate and term, not country. Amounts display in dollars by default but represent the same calculation in any currency." },
      { question: "What rate should I enter?", answer: "Enter the annual interest rate the lender quotes. The calculator converts it to a monthly rate internally." },
      { question: "Is this an offer or quote?", answer: "No. It is an estimate. Your lender's official quote, which may include fees and a different compounding method, is the binding figure." },
    ],
  },

  // -------------------------------------------------------------------------
  // Credit Card Payoff & APR
  // -------------------------------------------------------------------------
  "credit-card-payoff": {
    whoFor:
      "This payoff calculator is for anyone carrying a credit-card balance who wants to understand how long it will take to clear it and how much interest the delay will cost. It is sobering and useful for people making only the minimum payment, for those deciding how much extra to throw at a balance, and for anyone weighing whether a balance transfer or a fixed payment plan is worth it. By turning an APR into a concrete payoff timeline and a total interest figure, it replaces a vague sense of debt with a clear plan.",
    howItWorks:
      "Credit-card interest compounds on the balance you carry, so a fixed monthly payment chips away at principal only after covering that month's interest. The calculator converts your APR to a monthly rate, checks whether your payment even exceeds the monthly interest charge, and then solves for the number of months needed to reach a zero balance. From that it estimates the total interest you will pay over the payoff period. The critical insight it surfaces is the tipping point: if your payment is below the monthly interest, the balance never falls, and the tool flags that so you know to increase the payment.",
    workedExample:
      "Say you owe $5,000 at a 22% APR and pay $200 a month. The monthly interest rate is about 1.83%, so the first month's interest alone is roughly $92, leaving only about $108 to reduce principal. The calculator works out that it takes around 32 months to clear the balance and that you pay well over $1,000 in interest along the way. Raising the payment to $300 a month cuts both the time and the interest dramatically - the kind of comparison that makes the cost of minimum payments obvious.",
    regionalVariations:
      "Credit-card interest mechanics are broadly similar across countries, but disclosure rules, typical APRs, and minimum-payment formulas differ. In the United States the CARD Act shapes how minimums and disclosures work; other markets have their own rules. This calculator assumes a fixed monthly payment and a constant APR, and it does not model promotional 0% periods, cash-advance rates, or new purchases. If your card has a promotional rate that later jumps, run the calculation again at the go-to rate to see the real picture.",
    commonMistakes: [
      "Paying only the minimum. Minimum payments are designed to stretch repayment for years and maximize interest.",
      "Adding new purchases while paying down. New spending resets your progress and is not modeled here.",
      "Ignoring the interest-coverage point. If your payment is below the monthly interest, the balance never shrinks.",
      "Forgetting promotional rates expire. A 0% offer that reverts to a high APR changes the payoff math sharply.",
      "Overlooking cash-advance and penalty APRs, which are often far higher than the purchase rate.",
    ],
    deadlines:
      "Credit-card payments are due monthly on your statement date; paying at least the minimum by the due date avoids late fees and protects your credit, while paying the full statement balance avoids interest entirely. If you are working a payoff plan, paying more than the minimum as early in the cycle as possible reduces the average daily balance and therefore the interest charged that month.",
    faqs: [
      { question: "How long will it take to pay off my card?", answer: "It depends on your balance, APR, and monthly payment. The calculator solves for the number of months until the balance reaches zero at a fixed payment." },
      { question: "Why does my balance barely move with minimum payments?", answer: "Because most of a minimum payment goes to interest. Only the small remainder reduces principal, so payoff stretches over years." },
      { question: "What if my payment doesn't cover the interest?", answer: "Then the balance grows or never falls. The calculator flags this and shows your monthly interest charge so you can set a higher payment." },
      { question: "How is the total interest estimated?", answer: "By projecting your fixed payment over the payoff period and subtracting the original balance. It assumes a constant APR and no new purchases." },
      { question: "Does it model 0% promotional rates?", answer: "No. It uses a single APR. If you have a promo rate that later increases, run the numbers again at the go-to rate." },
      { question: "Should I pay more than the minimum?", answer: "Almost always. Even a modest increase above the minimum can cut months and hundreds of dollars of interest from the payoff." },
      { question: "Does a balance transfer help?", answer: "It can, if the new rate is meaningfully lower and the transfer fee is worth it. Compare the payoff at each rate to decide." },
      { question: "Will paying it off help my credit?", answer: "Lowering your balance reduces your credit utilization, which is a major factor in scores, so paying down typically helps over time." },
      { question: "Where do the figures come from?", answer: "The math follows standard credit-card interest mechanics; the result links to consumer-finance guidance and shows when it was last verified." },
    ],
  },

  // -------------------------------------------------------------------------
  // Compound Interest
  // -------------------------------------------------------------------------
  "compound-interest": {
    whoFor:
      "This compound-interest calculator is for savers and long-term investors who want to see how money grows over time when returns are reinvested. It suits someone starting a retirement or index-fund contribution, a parent saving for a child's education, or anyone curious about what regular monthly deposits could become over a decade or more. By separating the money you put in from the growth on top, it makes the power - and the patience - of compounding tangible, and it shows why starting earlier usually beats saving more later.",
    howItWorks:
      "Compounding means you earn returns not only on your original money but also on the returns it has already generated, so growth accelerates over time. The calculator handles two streams. Your initial lump sum grows by compounding at the annual rate over the number of years. Your regular monthly contributions grow as a series, each deposit compounding for the time remaining until the end, using the future-value-of-an-annuity formula. Adding the two gives the projected balance. It also reports your total contributions and the interest earned, so you can see how much of the final figure is your own money versus growth.",
    workedExample:
      "Start with $10,000, add nothing more, and assume a 7% annual return for 10 years. Compounding turns the $10,000 into about $19,672 - nearly doubling it without a single extra deposit. Now add $200 a month over the same decade: those contributions total $24,000, but with growth they add roughly $34,600, pushing the balance toward $54,000. The gap between the $34,000 you contributed and the final balance is compounding doing the work, and that gap widens the longer you stay invested.",
    regionalVariations:
      "Compound-interest math is the same everywhere; what differs is the tax treatment of the growth and the realistic rate of return. In a tax-advantaged account the gains may compound untaxed, while in a regular account taxes can reduce the effective rate. The calculator uses a single nominal annual rate and monthly compounding and does not deduct taxes, fees, or inflation. For a real-purchasing-power view, subtract an inflation estimate from your assumed return before entering it.",
    commonMistakes: [
      "Assuming returns are guaranteed. Markets fluctuate; the rate you enter is an assumption, not a promise.",
      "Ignoring inflation. A 7% nominal return is worth less in real terms after inflation, which this tool does not subtract.",
      "Underestimating time. Most of compounding's magic happens in the final years, so cutting the horizon short loses the biggest gains.",
      "Forgetting fees. Investment fees reduce the effective rate; a 7% return after a 1% fee compounds like 6%.",
      "Mixing up nominal and effective rates if your account compounds at a different frequency than assumed.",
    ],
    deadlines:
      "There is no deadline to compounding, but time is the single most valuable input, so the practical 'deadline' is simply to start. For tax-advantaged accounts, annual contribution windows and limits apply - for example, retirement-account contributions for a year often must be made by the filing deadline the following spring - so contributing earlier each year gives the money more time to grow.",
    faqs: [
      { question: "What is compound interest?", answer: "Earning returns on both your original money and the returns it has already produced, so growth accelerates the longer the money stays invested." },
      { question: "How is the future value calculated?", answer: "By compounding your initial amount over the period and adding the compounded value of your monthly contributions, then summing the two." },
      { question: "Does it account for taxes?", answer: "No. It shows pre-tax growth. In a taxable account, taxes on gains reduce the effective return; in a tax-advantaged account they may not." },
      { question: "Should I subtract inflation?", answer: "For a real-purchasing-power estimate, yes - enter a rate net of inflation. The calculator uses the nominal rate you provide." },
      { question: "Why do small differences in rate matter so much?", answer: "Because the effect compounds. Over decades, even one extra percentage point can change the final balance dramatically." },
      { question: "What return should I assume?", answer: "That is your choice and depends on the investment. Broad stock-market averages have historically been higher than savings accounts, but with more risk and volatility." },
      { question: "Do monthly contributions really matter that much?", answer: "Yes. Regular contributions, compounded over years, often end up contributing more to the final balance than the initial lump sum." },
      { question: "Is monthly compounding assumed?", answer: "Yes. The calculator compounds monthly, which is a common and reasonable assumption for regular-contribution scenarios." },
      { question: "Where does the method come from?", answer: "Standard future-value formulas; the result links to a regulator's compound-interest explainer and shows the last-verified date." },
    ],
  },

  // -------------------------------------------------------------------------
  // Ohm's Law
  // -------------------------------------------------------------------------
  "ohms-law": {
    whoFor:
      "This Ohm's Law calculator is for students, hobbyists, electricians, and engineers who need to relate voltage, current, resistance, and power quickly and reliably. It is the everyday tool for sizing a resistor, checking whether a component can handle the current, working out the wattage a device will draw, or teaching the fundamental relationship at the heart of electronics. Anyone who has ever stared at a breadboard wondering which resistor to use, or needed to confirm a power supply can deliver enough current, will find it faster than rearranging the formula by hand.",
    howItWorks:
      "Ohm's Law states that voltage equals current times resistance, written V = I × R, and power is voltage times current, P = V × I. From any two of voltage, current, and resistance, the third follows, and power can then be derived. The calculator asks which quantity you want to solve for, takes the two values you know, and applies the appropriate rearrangement: voltage from current and resistance, current from voltage and resistance, or resistance from voltage and current. It then computes power so you can check component ratings. Because the relationships are exact, the results are precise for ideal direct-current conditions.",
    workedExample:
      "Suppose a circuit carries 2 amps through a 10-ohm resistor and you want the voltage. Multiplying 2 by 10 gives 20 volts. The power dissipated is voltage times current, 20 × 2, which is 40 watts - meaning that resistor needs to be rated for at least 40 watts to avoid overheating. Switch the problem around: with 12 volts across a 4-ohm load, current is 12 divided by 4, or 3 amps, and power is 12 × 3, or 36 watts. The calculator handles each rearrangement so you do not have to.",
    regionalVariations:
      "Physics does not change by region, so Ohm's Law is identical worldwide. What differs in practice is mains voltage and frequency - around 120 volts at 60 hertz in North America versus 230 volts at 50 hertz across much of Europe and beyond - and the wiring and safety standards built around them. This calculator deals with the underlying direct-current relationship and does not model alternating-current effects like impedance, reactance, or power factor, which matter for AC circuits and motors.",
    commonMistakes: [
      "Mixing up units - using milliamps where amps are expected, or kilohms where ohms are needed - which throws results off by factors of a thousand.",
      "Applying simple Ohm's Law to AC circuits with inductance or capacitance, where impedance, not plain resistance, governs the relationship.",
      "Ignoring the power rating. A resistor with the right resistance can still fail if it cannot dissipate the calculated wattage.",
      "Forgetting real components have tolerances, so measured values differ slightly from the ideal calculation.",
      "Dividing by zero - entering zero current when solving for resistance produces a meaningless result.",
    ],
    deadlines:
      "There are no deadlines in physics, but there is a safety point worth stressing: always confirm a component's voltage, current, and especially power rating before energizing a circuit. Undersized components overheat, and working on mains-voltage circuits without proper training or isolation is dangerous. Use the calculated power figure to choose parts with comfortable headroom rather than ones that sit right at their limit.",
    faqs: [
      { question: "What is Ohm's Law?", answer: "The relationship V = I × R: voltage equals current times resistance. Power follows as P = V × I. Knowing any two of voltage, current, and resistance gives the rest." },
      { question: "How do I find resistance from voltage and current?", answer: "Divide voltage by current: R = V ÷ I. Select 'Resistance' in the calculator and enter the voltage and current." },
      { question: "How is power calculated?", answer: "Power is voltage times current (P = V × I). The calculator computes it automatically once it has voltage and current, so you can check wattage ratings." },
      { question: "Does this work for AC circuits?", answer: "It covers the basic direct-current relationship. AC circuits with inductors or capacitors require impedance and power-factor calculations not modeled here." },
      { question: "Why does power matter?", answer: "Components must dissipate the power they carry without overheating. A resistor with the correct resistance can still burn out if its wattage rating is too low." },
      { question: "What units should I use?", answer: "Volts, amps, and ohms. Be careful to convert milliamps to amps and kilohms to ohms, or results will be off by factors of a thousand." },
      { question: "Can I solve for any quantity?", answer: "Yes. Choose whether to solve for voltage, current, or resistance, enter the two known values, and the calculator returns the third plus power." },
      { question: "Why did I get an odd result?", answer: "Check for unit mismatches or a zero in the denominator (for example, zero current when solving for resistance), which produces an undefined value." },
      { question: "Is this suitable for school work?", answer: "Yes. It is ideal for learning and homework involving DC circuits, and it shows the relationships clearly." },
    ],
  },

  // -------------------------------------------------------------------------
  // UK Universal Credit
  // -------------------------------------------------------------------------
  "uk-universal-credit": {
    whoFor:
      "This Universal Credit estimator is for people in the UK on a low income or out of work who want a quick sense of what monthly support they might receive. It helps those considering a claim, people whose hours or earnings have changed, and anyone trying to understand how working more affects their payment through the earnings taper. It is a planning aid for single claimants and couples with or without children. Because Universal Credit is genuinely complex, the estimate here is deliberately simplified and is best used to decide whether a full application or a detailed benefits calculator is worth your time.",
    howItWorks:
      "Universal Credit starts from a monthly standard allowance set by your age and whether you claim as a single person or a couple - ranging from £316.98 for a single person under 25 to £628.10 for a couple where at least one is 25 or over in 2025/26. On top of that, child elements are added for children, subject to the two-child limit for most children born after April 2017. That total is your maximum award. Earnings then reduce it: above a work allowance, every £1 of take-home pay cuts the award by 55p through the taper, and other income generally reduces it pound for pound. The calculator applies these steps to estimate your monthly payment.",
    workedExample:
      "Consider a single person aged 25 or over with one child, taking home £800 a month. Their standard allowance is £400.14 and the child element adds £333.33, for a maximum of £733.47. Because they have a child, a work allowance of £411 applies, so only earnings above that are tapered: £800 minus £411 is £389, and 55% of that is about £214. Subtracting £214 from £733.47 leaves an estimated award of around £519 a month. Earn more, and the taper reduces the award further; earn less, and it rises toward the maximum.",
    regionalVariations:
      "Universal Credit is a UK-wide benefit administered by the Department for Work and Pensions, but the wider picture differs across the nations. Scotland operates some of its own social-security powers and choices, such as how housing support and certain top-ups work, and devolved administrations can add their own schemes. Housing costs, childcare support, and disability elements - none of which this simplified tool includes - can change the award substantially and are handled differently in places. Always check your specific circumstances through the official service.",
    commonMistakes: [
      "Treating this as your exact award. Housing, childcare, disability, and carer elements can change it significantly and are not included here.",
      "Forgetting the two-child limit, which restricts the child element for most third and later children born after April 2017.",
      "Confusing take-home pay with gross pay in the taper. The 55% taper applies to earnings after tax and National Insurance.",
      "Overlooking the work allowance, which only applies to people with children or limited capability for work.",
      "Ignoring savings. Capital over £16,000 usually rules out Universal Credit entirely, which this estimate does not check.",
    ],
    deadlines:
      "Universal Credit is claimed online and paid monthly in arrears, normally a calendar month plus a few days after you apply, which is why the first payment can take around five weeks. You report changes in circumstances and earnings each assessment period, and missing those updates can lead to over- or underpayments. If you need money during the initial wait, an advance is available but is repaid from future payments.",
    faqs: [
      { question: "How much is the Universal Credit standard allowance in 2025/26?", answer: "Monthly: £316.98 (single under 25), £400.14 (single 25+), £497.55 (couple both under 25), and £628.10 (couple, one or both 25+)." },
      { question: "How does the earnings taper work?", answer: "Above your work allowance, every £1 of take-home earnings reduces your award by 55p. Below the work allowance, earnings do not reduce it." },
      { question: "What is the work allowance?", answer: "An amount you can earn before the taper bites, available to claimants with children or limited capability for work. The calculator applies it when you have children." },
      { question: "Does this include housing costs?", answer: "No. This simplified estimate covers the standard allowance and child elements only. Housing, childcare, disability, and carer elements can add significantly." },
      { question: "What is the two-child limit?", answer: "For most children born after 6 April 2017, the child element is paid for only the first two children, with some exceptions." },
      { question: "Will savings affect my claim?", answer: "Yes. Capital over £16,000 generally disqualifies you, and savings between £6,000 and £16,000 reduce the award. This tool does not model that." },
      { question: "How accurate is the estimate?", answer: "It is a simplified guide. For an accurate figure use the official GOV.UK service or a full benefits calculator that includes all elements and your circumstances." },
      { question: "Can I get Universal Credit while working?", answer: "Yes. Universal Credit is designed to support people in work on low incomes; the taper means it reduces gradually as earnings rise rather than stopping abruptly." },
      { question: "Where do the figures come from?", answer: "From the 2025/26 benefit rates published on GOV.UK, linked on the result and dated when last verified." },
    ],
  },

  // -------------------------------------------------------------------------
  // UK Council Tax Reduction
  // -------------------------------------------------------------------------
  "uk-council-tax": {
    whoFor:
      "This checker is for UK residents on a low income who want to know whether they might get help with their Council Tax bill and roughly how much. It is useful for pensioners, people on benefits, and low earners who often qualify but never apply. Because every local council runs its own Council Tax Reduction scheme for working-age residents, the help available varies enormously from one area to the next, so this tool is a first-pass eligibility indicator rather than a precise quote. It answers the practical question of whether it is worth applying to your council.",
    howItWorks:
      "Council Tax Reduction lowers the Council Tax you owe based on your income, household, and savings. The national framework protects pensioners, who can get up to a 100% reduction, while working-age schemes are designed locally and often cap the maximum help at a lower level. This checker applies a simplified income test: it rules out claimants who are not liable or, for working-age people, who hold savings over £16,000, then estimates a reduction percentage that tapers as income rises, and multiplies it by your annual bill. The result is indicative - your council's actual scheme, with its own bands and rules, sets the real figure.",
    workedExample:
      "Take a pensioner who is liable for Council Tax, has modest savings, an annual bill of £1,800, and a household income around £800 a month. Because pension-age claimants can receive up to a full reduction and the income is low, the checker estimates a high reduction percentage - potentially the full £1,800 - and flags that they likely qualify. A working-age claimant with the same income would typically see a capped percentage instead, reflecting that most local schemes limit help for people below pension age.",
    regionalVariations:
      "Variation is the defining feature here. England's roughly 300 billing authorities each design their own working-age scheme, so two neighbours in different council areas with identical finances can receive very different support. Scotland and Wales run their own national arrangements that differ again, and pension-age rules follow a UK-wide framework. Because of this, the estimate is deliberately rough, and the only reliable figure comes from applying to your specific local council, which publishes its scheme and runs its own calculator.",
    commonMistakes: [
      "Assuming the scheme is the same everywhere. Working-age Council Tax Reduction is set locally and differs by council.",
      "Not applying because you think you earn too much. Partial reductions exist well above the lowest incomes in many schemes.",
      "Forgetting other discounts. A single-person discount, student exemption, or disability reduction may apply separately from Council Tax Reduction.",
      "Overlooking the savings limit. Working-age claimants with capital over £16,000 are usually excluded.",
      "Treating this estimate as a decision. Only your council's assessment is binding.",
    ],
    deadlines:
      "You apply for Council Tax Reduction through your local council, and reductions can often be backdated only for a short period, so applying promptly matters. Bills are usually payable in ten or twelve monthly instalments across the financial year, which runs April to March. If your circumstances change, report them to the council quickly to keep your reduction correct and avoid arrears.",
    faqs: [
      { question: "What is Council Tax Reduction?", answer: "A reduction in your Council Tax bill based on income, household, and savings. It is sometimes called Council Tax Support, and schemes are run by your local council." },
      { question: "Who can get up to 100% off?", answer: "Pension-age claimants are protected under a national framework and can receive up to a full reduction. Working-age schemes vary and often cap the maximum lower." },
      { question: "Why is this only an estimate?", answer: "Because every council designs its own working-age scheme, with different income bands and rules. Only your council's calculation is accurate." },
      { question: "Do savings affect it?", answer: "Yes. Working-age claimants with capital over £16,000 are usually excluded, and savings below that can reduce the help. This checker applies a simplified version." },
      { question: "Is it the same as the single-person discount?", answer: "No. The single-person discount (usually 25% off) is separate and not income-based. You may be entitled to both." },
      { question: "How do I apply?", answer: "Through your local council's website. You will need details of your income, savings, household, and your Council Tax account." },
      { question: "Can it be backdated?", answer: "Sometimes, but usually only for a limited period, so it is best to apply as soon as you think you qualify." },
      { question: "Does it cover Scotland and Wales?", answer: "Those nations run their own arrangements that differ from England's. Use your local authority's scheme for an accurate figure." },
      { question: "Where do the rules come from?", answer: "The result links to the official GOV.UK Council Tax Reduction guidance; the estimate is a simplified indicator and is dated when last verified." },
    ],
  },

  // -------------------------------------------------------------------------
  // Canada Child Benefit
  // -------------------------------------------------------------------------
  "ca-child-benefit": {
    whoFor:
      "This calculator is for Canadian parents and guardians who want to estimate their monthly Canada Child Benefit before the CRA recalculates it each July. It helps families budget, understand how a change in income or a new child affects the payment, and see why the benefit drops as income rises. It is useful for new parents registering a baby, for separated parents in shared-custody arrangements, and for anyone whose income changed last year and who wants to anticipate the new benefit year. The estimate is based on the July 2025 to June 2026 amounts, which use your 2024 income.",
    howItWorks:
      "The Canada Child Benefit is a tax-free monthly payment whose amount depends on the number and ages of your children and your adjusted family net income (AFNI). For the 2025–26 benefit year, the maximum is $7,997 per year for each child under six and $6,748 for each child aged six to seventeen. If your AFNI is at or below $37,487 you receive the maximum. Above that, the benefit is reduced on a two-tier basis: a first reduction rate applies to income between $37,487 and $81,222, and a higher fixed amount plus a second rate applies to income above $81,222, with both rates depending on how many children you have. The calculator applies your income to these tiers and reports the annual and monthly result.",
    workedExample:
      "A family with two children under six and an AFNI of $30,000 is below the $37,487 threshold, so they receive the full maximum: two times $7,997, or $15,994 a year - about $1,333 a month, completely tax-free. Now take a family with one child under six and one aged six to seventeen, with an AFNI of $50,000. Their maximum is $7,997 plus $6,748, or $14,745. Because $50,000 is in the first reduction tier, the benefit is reduced by 13.5% (the two-child rate) of income above $37,487 - about $1,689 - leaving roughly $13,056 a year.",
    regionalVariations:
      "The Canada Child Benefit is federal and consistent across the country, but several provinces and territories add their own child benefits that the CRA often pays alongside it, such as the Ontario Child Benefit, the BC Family Benefit, and the Alberta Child and Family Benefit. These have their own amounts and income tests and are not included in this estimate. If you live in a province with a top-up, your total monthly payment will be higher than the federal figure shown here, so check your provincial program as well.",
    commonMistakes: [
      "Using gross income instead of adjusted family net income, which is line-based and lower for many families.",
      "Forgetting the July reset. Each July the benefit is recalculated using the prior year's tax return, so filing on time matters even with no tax owing.",
      "Overlooking provincial top-ups, which add to the federal benefit and are not shown here.",
      "Assuming a new child is added automatically. You usually need to register the birth or apply so the CRA knows to pay.",
      "Ignoring shared custody, where each parent typically receives half the benefit for the shared child.",
    ],
    deadlines:
      "The benefit year runs from July to June and is based on the previous year's tax return, so both parents must file their taxes every year - even with no income - to keep payments flowing. Register a new child as soon as possible through birth registration or the CRA so payments start promptly; the CRA can generally only backdate a limited number of months. Payments arrive monthly, usually around the 20th.",
    faqs: [
      { question: "How much is the Canada Child Benefit for 2025–26?", answer: "Up to $7,997 per year for each child under six and $6,748 for each child aged six to seventeen, for the July 2025 to June 2026 benefit year." },
      { question: "What income is used?", answer: "Your adjusted family net income (AFNI) from the previous tax year - 2024 income for the 2025–26 benefit year." },
      { question: "At what income does it start to reduce?", answer: "Above $37,487. A first reduction rate applies up to $81,222, and a higher fixed amount plus a second rate applies above $81,222, both depending on the number of children." },
      { question: "Is the benefit taxable?", answer: "No. The Canada Child Benefit is tax-free and does not need to be reported as income." },
      { question: "Do I need to reapply each year?", answer: "No, but you and your partner must file your taxes every year so the CRA can recalculate the benefit. Payments can stop if returns are not filed." },
      { question: "Does it include provincial benefits?", answer: "No. Provinces like Ontario, BC, and Alberta add their own child benefits, often paid with the CCB, which would increase your total." },
      { question: "How does shared custody work?", answer: "In a shared-custody arrangement, each parent generally receives 50% of the benefit they would get if the child lived with them full-time." },
      { question: "When are payments made?", answer: "Monthly, typically around the 20th of each month." },
      { question: "Where do the figures come from?", answer: "From the CRA's Canada Child Benefit amounts for 2025–26, linked on the result and dated when last verified." },
    ],
  },

  // -------------------------------------------------------------------------
  // Canada GST/HST Credit
  // -------------------------------------------------------------------------
  "ca-gst-hst": {
    whoFor:
      "This estimator is for Canadians on low and modest incomes who want to know roughly how much GST/HST credit they will receive. The credit is automatic for most people who file a tax return, but understanding the amount helps with budgeting and confirms you are getting what you should. It is useful for single adults, couples, and families with children, and for newcomers to Canada working out what they qualify for. Because the credit uses the previous year's income and is paid quarterly, the estimate here reflects the July 2025 to June 2026 period based on 2024 income.",
    howItWorks:
      "The GST/HST credit is a tax-free quarterly payment that offsets some of the sales tax lower-income households pay. The amount depends on your family situation and your adjusted family net income. The calculator builds a base from your status - a single adult, a couple, and an amount for each child under nineteen - then reduces it as income rises. Above an income threshold of about $45,521, the credit is reduced by 5% of the income above that level, phasing out to zero for higher earners. The result is shown as an annual amount and as the per-quarter payment you would actually receive.",
    workedExample:
      "A single adult with no children and an adjusted family net income of $20,000 is below the phase-out threshold, so they receive the base single amount of about $533 a year - roughly $133 every quarter. A couple with two children and an income of $50,000 starts from a higher base - around $698 for the couple plus $184 for each child, or about $1,066 - but because $50,000 is above the $45,521 threshold, the credit is reduced by 5% of the excess (about $224), leaving roughly $842 a year.",
    regionalVariations:
      "The GST/HST credit is federal and the same across the country, but several provinces run parallel sales-tax or cost-of-living credits that the CRA frequently pays together with it, such as credits tied to provincial sales taxes or carbon-pricing rebates. These provincial amounts are separate and not included here. The federal credit also interacts with newcomer rules and residency, so recent arrivals may need to apply rather than rely on automatic enrolment. Your province may add to the figure this calculator shows.",
    commonMistakes: [
      "Not filing a tax return. The credit is calculated from your return, so non-filers miss out even with very low income.",
      "Using gross income rather than adjusted family net income for the phase-out.",
      "Forgetting it is based on last year's income, so a recent change may not show up until the next benefit year.",
      "Overlooking the per-child amount, which raises the credit for families.",
      "Assuming provincial credits are included - they are paid separately and add to the total.",
    ],
    deadlines:
      "Eligibility is assessed automatically when you file your annual tax return, so filing on time each year - even with no income - is essential to receive the credit. Payments are made quarterly, typically in July, October, January, and April. Newcomers to Canada usually need to complete a specific form to start receiving the credit rather than waiting for automatic enrolment.",
    faqs: [
      { question: "How much is the GST/HST credit?", answer: "For 2025–26, roughly up to $533 a year for a single adult and $698 for a couple, plus about $184 per child under 19, reducing as income rises." },
      { question: "Do I need to apply?", answer: "Most residents are considered automatically when they file a tax return. Newcomers to Canada generally need to complete a specific application form." },
      { question: "What income is used?", answer: "Your adjusted family net income from the previous tax year - 2024 income for the July 2025 to June 2026 payments." },
      { question: "When does it phase out?", answer: "The credit reduces by 5% of adjusted family net income above approximately $45,521, phasing to zero for higher incomes depending on family size." },
      { question: "Is it taxable?", answer: "No. The GST/HST credit is tax-free and does not need to be reported as income." },
      { question: "How often is it paid?", answer: "Quarterly - usually in July, October, January, and April." },
      { question: "Does it include provincial credits?", answer: "No. Some provinces add their own sales-tax or cost-of-living credits, often paid alongside it, which this estimate does not include." },
      { question: "Why is this called a simplified estimate?", answer: "The single-supplement phase-in and certain provincial interactions are approximated. The CRA's calculation, based on your filed return, is exact." },
      { question: "Where do the figures come from?", answer: "From the CRA's GST/HST credit amounts for 2025–26, linked on the result and dated when last verified." },
    ],
  },

  // -------------------------------------------------------------------------
  // Voltage Divider
  // -------------------------------------------------------------------------
  "voltage-divider": {
    whoFor:
      "This voltage divider calculator is for electronics students, makers, and engineers who need a smaller voltage from a larger one using two resistors. It is the tool you reach for when scaling a sensor signal down to fit a microcontroller's input range, setting a reference voltage, biasing a transistor, or reading a battery's level through an analog pin. Anyone learning how resistors share a voltage, or anyone who wants to skip rearranging the divider formula by hand, will find it quicker and less error-prone than working it out on paper.",
    howItWorks:
      "A voltage divider puts two resistors in series across a source. The output is taken from the point between them. Because the same current flows through both resistors, each one takes a share of the total voltage in proportion to its resistance. The output across the bottom resistor R2 is Vout = Vin x R2 / (R1 + R2). The calculator adds R1 and R2, divides R2 by that total to get the ratio, and multiplies by your input voltage. It also reports the voltage dropped across R1, which is simply the input minus the output, so you can see how the source voltage splits between the two parts.",
    workedExample:
      "Say you have a 9 volt supply and you want roughly two-thirds of it. Put a 1,000 ohm resistor on top (R1) and a 2,000 ohm resistor on the bottom (R2). The total is 3,000 ohms, and R2 is two-thirds of that, so the ratio is 0.667. Multiply 9 volts by 0.667 and the output is 6 volts, with the remaining 3 volts dropped across R1. Swap to two equal 1,000 ohm resistors and the ratio becomes 0.5, so a 5 volt input gives 2.5 volts out - a clean halving.",
    regionalVariations:
      "Resistor physics is the same everywhere, so the math does not change by country. What differs is the labelling convention you may see on parts and schematics: resistor values follow the international E-series (E12, E24, and so on), and color-band codes are standard worldwide. Some regions favor showing values as 4k7 instead of 4.7k, but the number is identical. This calculator works in plain ohms and volts, so enter whatever your parts are marked once you convert any kilohm or megohm values.",
    commonMistakes: [
      "Loading the output without accounting for it. The simple formula assumes nothing draws current from Vout. If your load resistance is not much larger than R2, the real output sags below the calculated value.",
      "Choosing very large resistor values to save power, then finding the divider is too weak to drive the next stage, or that it picks up noise.",
      "Choosing very small resistor values, which waste power and can overload the source.",
      "Mixing up which resistor is R1 and which is R2. The output is always measured across the resistor connected to ground, which this calculator treats as R2.",
      "Forgetting to convert kilohms to ohms, which shifts the answer but, because it is a ratio, often hides the slip until a loaded test reveals it.",
    ],
    deadlines:
      "There is no deadline in electronics, but there is a design check worth making every time: confirm the current through the divider and the power each resistor handles. Power in a resistor is voltage across it times the current through it. A divider that runs hot, or one whose output collapses the moment you connect a load, points to resistor values that are too small or too large for the job. Prototype and measure before committing the values to a board.",
    faqs: [
      { question: "What is a voltage divider?", answer: "Two resistors in series across a voltage source. The output, taken from the midpoint, is a fixed fraction of the input set by the ratio of the resistors." },
      { question: "What is the voltage divider formula?", answer: "Vout = Vin x R2 / (R1 + R2), where R2 is the resistor across which you measure the output (usually the one connected to ground)." },
      { question: "Why is my real output lower than the calculation?", answer: "The formula assumes no load. Anything you connect to the output draws current and lowers the voltage. Use resistor values much smaller than your load, or buffer the output." },
      { question: "Can a voltage divider supply power to a circuit?", answer: "Not well. It suits low-current reference and signal-scaling jobs. For powering a load, use a regulator, which holds the voltage steady as the current changes." },
      { question: "How do I pick the resistor values?", answer: "Pick the ratio you need first, then choose a total resistance that draws a small but stable current - often a few kilohms to tens of kilohms for signal work." },
      { question: "What voltage appears across R1?", answer: "The input voltage minus the output. The two drops always add up to Vin, because the resistors share the source between them." },
      { question: "Does it work with AC signals?", answer: "Yes, for purely resistive dividers the ratio holds for AC too. Once capacitors or inductors are involved, the division becomes frequency-dependent." },
      { question: "Can I divide a voltage to an exact value?", answer: "Standard resistors come in fixed steps, so you usually get close rather than exact. A trimmer potentiometer lets you fine-tune the output." },
      { question: "Is this safe for mains voltage?", answer: "No. Do not build dividers across mains without proper isolation and training. This tool is for low-voltage DC and signal work." },
    ],
  },

  // -------------------------------------------------------------------------
  // LED Resistor
  // -------------------------------------------------------------------------
  "led-resistor": {
    whoFor:
      "This LED resistor calculator is for anyone wiring up an LED and wanting it to be bright without burning out. That includes electronics beginners on their first breadboard, makers adding indicator lights to a project, and hobbyists building displays or signage. An LED needs a resistor in series to limit its current, and choosing the wrong value either leaves the LED dim or destroys it in an instant. This tool gives the correct resistor in one step, plus the power that resistor must handle, so you can pick a part that will not overheat.",
    howItWorks:
      "An LED drops a roughly fixed voltage when lit, called its forward voltage, and it is brightness is set by the current through it, not the voltage across it. The series resistor soaks up the difference between your supply and the LED's forward voltage. The formula is R = (Vsupply - Vforward) / I, where I is your target current in amps. The calculator subtracts the forward voltage from the supply to find the voltage the resistor must drop, converts your milliamp current to amps, and divides to get the resistance. It then multiplies the voltage across the resistor by the current to show how much power the resistor dissipates, so you can choose a part with enough headroom.",
    workedExample:
      "Suppose you run a standard red LED from a 9 volt battery and want 20 milliamps through it. A red LED drops about 2 volts, so the resistor must absorb 9 minus 2, which is 7 volts. Dividing 7 volts by 0.02 amps gives 350 ohms, so pick the next common value at or above that, which is 360 or 390 ohms. The power in the resistor is 7 volts times 20 milliamps, or 140 milliwatts, so a standard quarter-watt (250 milliwatt) resistor is fine with room to spare. Drop the supply to 5 volts at 10 milliamps and the resistor becomes 300 ohms.",
    regionalVariations:
      "LEDs behave the same in every country, so the formula does not change. What varies is the typical forward voltage by LED color and type, which is a property of the part, not the region: red and yellow LEDs sit around 1.8 to 2.2 volts, green and blue closer to 3 to 3.4 volts, and white LEDs around 3 to 3.6 volts. Check the datasheet for your exact part. Mains adapters differ by region too, but you should always work from the DC voltage your LED actually sees, not the wall voltage.",
    commonMistakes: [
      "Connecting an LED with no resistor at all. Without one, the LED draws far too much current and fails almost instantly.",
      "Entering current in amps when the field expects milliamps, or vice versa, which throws the resistor value off by a factor of a thousand.",
      "Using the wrong forward voltage. A blue or white LED needs a different value than a red one, so use the datasheet figure for your color.",
      "Ignoring the resistor's power rating. The right resistance can still cook if the wattage is too low for the power it dissipates.",
      "Rounding down to a smaller resistor, which raises the current above your target. Always round up to the next standard value.",
    ],
    deadlines:
      "There is no deadline, but there is a sequence worth following before you power on: confirm the LED's forward voltage and maximum current from its datasheet, calculate the resistor, round up to a standard value, and check the resistor's power rating against the figure shown here. Most small indicator LEDs are happy between 10 and 20 milliamps, and many look plenty bright at less, which also saves power and runs cooler. When in doubt, choose a slightly larger resistor and a little less brightness.",
    faqs: [
      { question: "Why does an LED need a resistor?", answer: "An LED's current rises steeply once it is forward voltage is reached, so a small voltage change causes a large current change. The series resistor limits the current to a safe, steady value." },
      { question: "What current should I use?", answer: "Most standard indicator LEDs run well at 10 to 20 milliamps. Check the datasheet for the maximum, and stay comfortably below it." },
      { question: "What is forward voltage?", answer: "The roughly fixed voltage an LED drops when lit. It depends on the LED's color and chemistry - around 2 volts for red, near 3 volts or more for blue and white." },
      { question: "What if my calculated value is not a standard resistor?", answer: "Round up to the next standard value (for example, 350 ohms to 360 or 390). Rounding up slightly lowers the current, which is the safe direction." },
      { question: "Can I put several LEDs on one resistor?", answer: "If they are in series, yes, and you subtract all their forward voltages from the supply. In parallel, give each LED its own resistor so they share current evenly." },
      { question: "How do I work out the resistor's power rating?", answer: "Multiply the voltage across the resistor by the current. The calculator shows this in milliwatts; pick a resistor rated well above it, such as a quarter-watt part." },
      { question: "My LED is dim - what went wrong?", answer: "The resistor is probably too large, so the current is low. Recheck the supply and forward voltage, and confirm you used the right current target." },
      { question: "Does the resistor go before or after the LED?", answer: "Either side works, because they are in series and the same current flows through both. The order does not change the result." },
      { question: "Can I use this for high-power LEDs?", answer: "Simple resistor limiting suits small indicator LEDs. High-power LEDs are better driven by a constant-current driver, which is more efficient and more stable with temperature." },
    ],
  },

  // -------------------------------------------------------------------------
  // RC Time Constant
  // -------------------------------------------------------------------------
  "rc-time-constant": {
    whoFor:
      "This RC time constant calculator is for students and engineers working with resistor-capacitor circuits: timing delays, debounce circuits, smoothing and filtering, and the simple low-pass and high-pass filters at the heart of audio and sensor electronics. If you need to know how fast a capacitor charges through a resistor, how long before a signal settles, or where a filter starts to roll off frequencies, this tool gives all three from two values you already have.",
    howItWorks:
      "When a capacitor charges or discharges through a resistor, it does not change instantly. The time constant, written with the Greek letter tau, is the resistance times the capacitance: tau = R x C. After one time constant the capacitor reaches about 63% of the way to its final voltage, and after five time constants it is within about 1%, which engineers treat as fully charged. The same R and C set the cutoff frequency of a simple filter, fc = 1 / (2 x pi x R x C), the point where the filter begins to noticeably cut the signal. The calculator computes the time constant, the practical five-tau settling time, and the cutoff frequency together. It works in kilohms and microfarads, whose product conveniently lands in milliseconds.",
    workedExample:
      "Take a 10 kilohm resistor and a 1 microfarad capacitor. The time constant is 10 times 1, which is 10 milliseconds. Five time constants is 50 milliseconds, so the capacitor is effectively fully charged about a twentieth of a second after you apply voltage. The same pair forms a filter with a cutoff of 1 divided by (2 x pi x 10,000 ohms x 0.000001 farads), about 15.9 hertz - low enough to smooth out anything faster while letting slow changes through. Swap in a 1 kilohm resistor with a 100 microfarad capacitor and the time constant jumps to 100 milliseconds, a much slower circuit.",
    regionalVariations:
      "Capacitor and resistor behavior is universal, so the formulas are the same everywhere. The conventions you meet on components are international too: capacitor values are often printed as a three-digit code (for example 104 means 100,000 picofarads, or 0.1 microfarads), and tolerance is shown by a letter. Mains frequency differs by region, 50 hertz in much of the world and 60 hertz in North America, which matters when you design a filter to reject mains hum, but the RC math itself does not change.",
    commonMistakes: [
      "Mixing units. Kilohms with microfarads gives milliseconds; if you enter plain ohms and farads expecting milliseconds, the result is off by huge factors.",
      "Assuming the capacitor charges instantly or linearly. The charge curve is exponential, fast at first and then slowing as it approaches the final voltage.",
      "Treating one time constant as fully charged. It only reaches about 63%; allow about five time constants for the circuit to settle.",
      "Ignoring the capacitor's tolerance, which is often 10% or 20%, so the real time constant varies from the ideal figure.",
      "Forgetting the resistance of whatever drives the circuit. A high source resistance adds to R and slows charging beyond the calculated value.",
    ],
    deadlines:
      "Timing in electronics is the point, so the practical rule is to design for about five time constants whenever you need a circuit to settle fully before the next event - whether that is a switch debounce, a reset pulse, or a sample on an analog input. For filters, place the cutoff frequency clearly below the noise you want to remove and clearly above the signal you want to keep, leaving margin for component tolerance so the filter still does its job at the edges of its rated values.",
    faqs: [
      { question: "What is the RC time constant?", answer: "It is the resistance times the capacitance, tau = R x C. It sets how quickly a capacitor charges or discharges through the resistor." },
      { question: "How long until the capacitor is fully charged?", answer: "About five time constants, after which it is within roughly 1% of the final voltage. One time constant alone reaches about 63%." },
      { question: "Why kilohms and microfarads?", answer: "Their product lands neatly in milliseconds, which is the range most timing and filter circuits use. The calculator handles the unit scaling for you." },
      { question: "What is the cutoff frequency?", answer: "For a simple RC filter, fc = 1 / (2 x pi x R x C). It is the frequency where the filter starts to noticeably reduce the signal, dropping it by about 30%." },
      { question: "Is this a high-pass or low-pass filter?", answer: "The same R and C can make either, depending on whether the output is taken across the capacitor (low-pass) or the resistor (high-pass). The cutoff frequency is identical for both." },
      { question: "Does the charge curve ever truly reach the supply voltage?", answer: "In theory it approaches but never quite reaches it, getting exponentially closer. In practice, five time constants is close enough for almost any circuit." },
      { question: "How does tolerance affect the result?", answer: "Real resistors and capacitors vary from their marked values, so the actual time constant can differ by 10% or more. Design with margin if timing is critical." },
      { question: "Can I slow a circuit down without huge components?", answer: "Yes - raise either the resistance or the capacitance. Very large resistors can pick up noise, and very large capacitors take space, so balance the two." },
      { question: "Does source resistance matter?", answer: "Yes. Whatever drives the circuit adds its own resistance in series, increasing the effective R and lengthening the time constant beyond the calculated figure." },
    ],
  },

  // -------------------------------------------------------------------------
  // Wavelength and Frequency
  // -------------------------------------------------------------------------
  "wavelength-frequency": {
    whoFor:
      "This wavelength and frequency calculator is for radio amateurs, RF and antenna designers, physics students, and anyone working with light or electromagnetic waves. If you need the wavelength of a radio frequency to cut an antenna to length, or the frequency that matches a known wavelength, this tool converts between the two instantly using the speed of light. It suits homework on the electromagnetic spectrum just as well as a quick check on the bench.",
    howItWorks:
      "Every electromagnetic wave in free space travels at the speed of light, about 299,792,458 metres per second. Wavelength and frequency are tied together by that speed: c = wavelength x frequency. So a higher frequency means a shorter wavelength, and the other way around. The calculator lets you pick which one you know. Enter a frequency in megahertz and it returns the wavelength in metres by dividing the speed of light by the frequency; enter a wavelength in metres and it returns the frequency. Because the speed of light is a constant, the conversion is exact for waves travelling through a vacuum or, very nearly, through air.",
    workedExample:
      "FM radio around 100 megahertz is a familiar case. Dividing the speed of light by 100 megahertz gives a wavelength of about 3 metres, which is why FM antennas are sized in metres rather than centimetres. Going the other way, a 2 metre wavelength - the name of a popular amateur radio band - corresponds to a frequency of about 150 megahertz. Shorter wavelengths mean higher frequencies: a microwave oven near 2,450 megahertz has a wavelength of only about 12 centimetres.",
    regionalVariations:
      "The physics is identical worldwide, but the radio bands allocated to each use are not. The exact frequencies set aside for FM broadcast, amateur radio, Wi-Fi, and mobile networks are decided by national and regional regulators, so a band that is legal to transmit on in one country may be restricted in another. This calculator gives the pure physics relationship; always check your local spectrum rules before transmitting. Note too that waves slow down in materials like glass, water, or coaxial cable, so the wavelength inside a medium is shorter than the free-space figure shown here.",
    commonMistakes: [
      "Forgetting the units. This tool uses megahertz and metres; mixing in hertz or centimetres without converting gives answers off by large factors.",
      "Applying the free-space result inside a cable or material. Signals travel slower there, so the real wavelength is shorter by the velocity factor.",
      "Confusing wavelength with antenna length. Practical antennas are often a half or a quarter of a wavelength, not a full one.",
      "Assuming the speed of light applies to sound. Sound is a mechanical wave with a completely different, much slower speed; this formula is only for electromagnetic waves.",
      "Rounding the speed of light too aggressively for precise RF work, where small differences shift the result.",
    ],
    deadlines:
      "There are no deadlines here, but there is a practical caution: before transmitting on any frequency, confirm it is allocated for your use and that you hold any license your country requires. Antennas cut from a wavelength should account for the velocity factor of the wire or element and for end effects, so treat the calculated wavelength as the starting point and trim to tune. For coaxial cable and waveguides, apply the medium's velocity factor rather than the free-space number.",
    faqs: [
      { question: "What is the relationship between wavelength and frequency?", answer: "They multiply to the wave's speed: c = wavelength x frequency. In free space that speed is the speed of light, so higher frequency means shorter wavelength." },
      { question: "What units does this calculator use?", answer: "Frequency in megahertz and wavelength in metres. Convert gigahertz or kilohertz, and centimetres or millimetres, before entering them." },
      { question: "Why is the wavelength shorter inside a cable?", answer: "Waves travel slower than the speed of light in any material. The wavelength inside is the free-space value multiplied by the medium's velocity factor." },
      { question: "How long should my antenna be?", answer: "Antennas are sized as a fraction of a wavelength, commonly a half or a quarter. Use the wavelength here as a guide, then account for velocity factor and trim to tune." },
      { question: "Does this work for visible light?", answer: "Yes. Visible light is electromagnetic, so the same formula applies, though its frequencies are far higher and wavelengths far shorter, measured in nanometres." },
      { question: "Can I use it for sound waves?", answer: "No. Sound travels far slower and at a speed that depends on the medium and temperature, so it needs a different speed value, not the speed of light." },
      { question: "What is the speed of light used here?", answer: "About 299,792,458 metres per second, the speed of electromagnetic waves in a vacuum, which is also very close to their speed in air." },
      { question: "Why do higher frequencies have shorter wavelengths?", answer: "Because their product is fixed at the speed of light. If one goes up, the other must come down to keep the product constant." },
    ],
  },

  // -------------------------------------------------------------------------
  // Kinetic Energy
  // -------------------------------------------------------------------------
  "kinetic-energy": {
    whoFor:
      "This kinetic energy calculator is for physics and engineering students, teachers, and anyone who needs the energy or momentum of a moving object. It is useful for homework on mechanics, for rough estimates of impact energy in safety and design work, and for getting an intuitive feel for how energy grows with speed. Enter a mass and a speed and it returns the kinetic energy in joules and kilojoules, plus the momentum, so you can compare how hard something is to stop with how much energy it carries.",
    howItWorks:
      "Kinetic energy is the energy an object has because it is moving. The formula is KE = one half times mass times speed squared, written KE = 1/2 x m x v squared, with mass in kilograms and speed in metres per second giving energy in joules. The squared term is the important part: doubling the speed quadruples the energy. The calculator multiplies half the mass by the square of the speed for the energy, divides by a thousand to also show kilojoules, and separately multiplies mass by speed to give momentum in kilogram-metres per second. Momentum grows in step with speed, while energy grows with its square, which is why high speed is so dangerous.",
    workedExample:
      "Picture a 1,000 kilogram car moving at 20 metres per second, roughly 72 kilometres per hour. Half of 1,000 is 500, and 20 squared is 400, so the kinetic energy is 500 times 400, which is 200,000 joules, or 200 kilojoules. The momentum is 1,000 times 20, or 20,000 kilogram-metres per second. Now double the speed to 40 metres per second: the momentum doubles to 40,000, but the energy quadruples to 800 kilojoules. That fourfold jump in energy is why stopping distances and crash forces rise so sharply with speed.",
    regionalVariations:
      "Physics does not change from place to place, so the result is the same anywhere. The only regional difference is units. This calculator uses SI units - kilograms, metres per second, and joules - which are standard in science worldwide. If you are used to miles per hour, pounds, or foot-pounds, convert to kilograms and metres per second first. As a guide, one metre per second is about 3.6 kilometres per hour or 2.24 miles per hour, and one kilogram is about 2.2 pounds.",
    commonMistakes: [
      "Forgetting to square the speed. The speed term is squared, so leaving it out underestimates the energy badly.",
      "Using the wrong units. Mass must be in kilograms and speed in metres per second to get joules; mixing in grams or kilometres per hour gives a wrong answer.",
      "Confusing energy with momentum. Momentum rises with speed, but energy rises with the square of speed, so they are not interchangeable.",
      "Applying this near the speed of light, where the classical formula breaks down and a relativistic version is needed.",
      "Treating kinetic energy as a vector. Energy is a single number with no direction, unlike momentum and velocity.",
    ],
    deadlines:
      "There is no deadline in mechanics, but there is a safety lesson worth keeping in mind: because energy grows with the square of speed, modest increases in speed produce large increases in impact energy and braking distance. In design and safety work, that square relationship is the reason speed limits and crumple zones matter so much. When estimating impact energy, use realistic masses and speeds, and remember the calculated figure is the energy that must be absorbed somewhere when the object stops.",
    faqs: [
      { question: "What is kinetic energy?", answer: "The energy an object has because of its motion. A heavier or faster object carries more, and it is the energy that must be absorbed when the object stops." },
      { question: "What is the kinetic energy formula?", answer: "KE = 1/2 x m x v squared, with mass in kilograms and speed in metres per second, giving energy in joules." },
      { question: "Why does speed matter more than mass?", answer: "Because speed is squared in the formula while mass is not. Doubling the mass doubles the energy, but doubling the speed quadruples it." },
      { question: "What units should I use?", answer: "Kilograms for mass and metres per second for speed, which give energy in joules. Convert other units before entering them." },
      { question: "What is the difference between energy and momentum?", answer: "Momentum is mass times speed and grows in step with speed; kinetic energy grows with the square of speed. Momentum has direction; energy does not." },
      { question: "How do I convert from kilometres per hour?", answer: "Divide by 3.6 to get metres per second. For example, 72 kilometres per hour is 20 metres per second." },
      { question: "Does this work for very high speeds?", answer: "It uses the classical formula, accurate for everyday speeds. Near the speed of light, a relativistic calculation is needed instead." },
      { question: "What is a joule?", answer: "The SI unit of energy. One joule is roughly the energy needed to lift a small apple one metre; a moving car carries hundreds of thousands of joules." },
      { question: "Can kinetic energy be negative?", answer: "No. Mass is positive and speed squared is never negative, so kinetic energy is always zero or positive." },
    ],
  },

  // -------------------------------------------------------------------------
  // Data Transfer Time
  // -------------------------------------------------------------------------
  "data-transfer-time": {
    whoFor:
      "This data transfer time calculator is for developers, system administrators, and anyone moving large files who wants to know how long it will take before they start. It is handy for planning backups and restores, estimating cloud uploads and downloads, sizing migration windows, and sanity-checking whether a connection is fast enough for the job. Enter a file size and a connection speed and it returns the transfer time in seconds, minutes, and hours, with the tricky bits-versus-bytes conversion handled for you.",
    howItWorks:
      "The catch with transfer times is that file sizes are quoted in bytes (megabytes, gigabytes) while connection speeds are quoted in bits per second (megabits per second). There are 8 bits in a byte, so a file's size in megabits is eight times its size in megabytes. The calculator converts your file size to megabits, then divides by the connection speed in megabits per second to get the time in seconds, and also shows that in minutes and hours. It uses the common decimal convention where one gigabyte is 1,000 megabytes, matching how internet speeds and storage are usually advertised.",
    workedExample:
      "Suppose you upload a 1 gigabyte file over a 100 megabit per second connection. One gigabyte is 1,000 megabytes, which is 8,000 megabits. Divide 8,000 by 100 and you get 80 seconds, or about 1.3 minutes, in the best case. A 500 megabyte file over a slower 50 megabit per second link works out the same way: 500 megabytes is 4,000 megabits, divided by 50 gives 80 seconds again. Notice how halving both the size and the speed leaves the time unchanged - time depends on the ratio of the two.",
    regionalVariations:
      "Bits, bytes, and the math are the same everywhere, but advertised internet speeds and their real-world delivery vary widely by country and provider. Some markets quote speeds in megabits per second, others promote gigabit fibre, and actual throughput often falls short of the headline figure because of contention and distance. There is also a labelling subtlety: storage and network marketing use decimal units (1 gigabyte = 1,000 megabytes), while operating systems sometimes report binary units (1 gibibyte = 1,024 mebibytes), which makes measured sizes look slightly different. This calculator uses the decimal convention.",
    commonMistakes: [
      "Confusing megabits with megabytes. Speeds are in megabits per second and sizes in megabytes; forgetting the factor of 8 makes the estimate eight times wrong.",
      "Expecting to hit the advertised speed. Real transfers run slower because of protocol overhead, latency, network congestion, and disk read or write limits.",
      "Ignoring the slowest link in the chain. The transfer is limited by whichever is slower - your connection, the server, or the storage device.",
      "Mixing decimal and binary units. A file shown as some number of gibibytes by the operating system is slightly larger in megabytes than the round decimal figure.",
      "Forgetting overhead on many small files, where per-file delays can dwarf the raw transfer time of the data itself.",
    ],
    deadlines:
      "When you are planning a maintenance or migration window, treat the calculated time as a best case and add generous margin. Real throughput is commonly a good deal lower than the line speed, especially over long distances or busy networks, and transferring many small files is far slower than one large file of the same total size. Test with a representative sample before committing to a schedule, and where possible run large transfers during off-peak hours to get closer to the theoretical figure.",
    faqs: [
      { question: "Why multiply the file size by 8?", answer: "File sizes are in bytes and connection speeds are in bits. There are 8 bits in a byte, so converting megabytes to megabits means multiplying by 8." },
      { question: "Why is my real transfer slower than this estimate?", answer: "The figure is a theoretical best case. Protocol overhead, latency, network congestion, and disk speed all reduce the throughput you actually achieve." },
      { question: "What is the difference between Mbps and MBps?", answer: "Mbps is megabits per second (used for connection speeds); MBps is megabytes per second (eight times larger). Mixing them up is the most common error." },
      { question: "Does it use decimal or binary units?", answer: "Decimal, where one gigabyte is 1,000 megabytes, matching how internet speeds and storage are advertised. Operating systems sometimes report binary units, which differ slightly." },
      { question: "How do I estimate a download instead of an upload?", answer: "The same way - enter the file size and your download speed. Just use the relevant direction's speed, since upload and download rates often differ." },
      { question: "Why are many small files slower than one big file?", answer: "Each file adds setup and overhead, and storage seeks between them. The raw data math is the same, but the real time is much higher." },
      { question: "What speed should I enter?", answer: "Use your real measured throughput if you have it; the advertised line speed gives an optimistic best case rather than a realistic one." },
      { question: "Can I speed up a large transfer?", answer: "Compressing the data, using more parallel streams, or moving to a faster link or closer server all help. The slowest link in the chain sets the limit." },
    ],
  },
};
