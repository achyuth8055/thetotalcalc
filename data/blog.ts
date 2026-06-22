// Blog posts - original long-form articles (1,000–1,200 words each), each on a
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
    slug: "compound-interest-why-starting-early-wins",
    title: "Compound interest: why starting early beats saving more",
    description:
      "Compound interest rewards time more than effort, which is why a small amount saved in your twenties can outgrow a larger amount saved later. Here is how compounding actually works, the rule that estimates it in your head, and the real cost of waiting.",
    date: "2026-06-21",
    readingMinutes: 6,
    category: "Saving & Investing",
    related: { name: "Compound Interest Calculator", href: "/calculators/finance/compound-interest-calculator" },
    body: [
      {
        paragraphs: [
          "There is a reason compound interest gets called the most powerful force in personal finance, and it is not marketing. It is the simple, slightly counterintuitive fact that money left to grow earns returns on its returns, so the longer it compounds, the faster it moves. The effect is gentle at first and then startling, which is exactly why so many people underestimate it and start later than they should.",
          "Understanding compounding does not require any math you cannot do on a napkin. What it requires is seeing clearly that time, not the size of each contribution, is the input that matters most. Once that lands, the case for starting now rather than waiting until you can afford more becomes hard to argue with.",
        ],
      },
      {
        heading: "Simple interest versus compound interest",
        paragraphs: [
          "Simple interest pays you only on the money you originally put in. Put $1,000 in an account paying 5% simple interest and you earn $50 every year, forever, on that same $1,000. After 30 years you would have your $1,000 back plus $1,500 in interest.",
          "Compound interest pays you on your original money and on the interest you have already earned. That same $1,000 at 5% compounded annually earns $50 in year one, but in year two it earns 5% on $1,050, not $1,000. Each year the base grows, so each year's interest is a little larger than the last. After 30 years the account holds about $4,322, not $2,500. The extra came entirely from interest earning interest.",
        ],
      },
      {
        heading: "The rule that estimates it in your head",
        paragraphs: [
          "You do not need a spreadsheet to get a feel for compounding. The rule of 72 says that dividing 72 by your annual return gives the rough number of years it takes for money to double. At 6% a year, money doubles in about 12 years; at 8%, in about 9 years; at 4%, in about 18.",
          "The rule is an approximation, but it is close enough to be useful and it makes the power of higher returns and longer time concrete. Money that doubles every nine years doubles roughly three times in a 27-year career, turning one dollar into eight. The doublings late in the run are the biggest, which is why the final years of a long investment do the heaviest lifting.",
        ],
      },
      {
        heading: "Why the early saver wins",
        paragraphs: [
          "Consider two savers. The first invests $300 a month from age 25 to 35, ten years, then stops and never adds another dollar. The second waits, then invests $300 a month from age 35 all the way to 65, thirty years. Assuming the same steady return, the first saver, who contributed for only ten years, often ends up with more at 65 than the second, who contributed for thirty.",
          "It feels wrong, because the second saver put in three times as much money. But the first saver's contributions had an extra decade to compound, and that decade at the start is worth more than three decades of contributions added later. The lesson is blunt: a small amount invested early can beat a larger amount invested late, because you cannot buy back lost time.",
        ],
      },
      {
        heading: "What makes compounding work harder",
        list: [
          "Time in the market. Years are the raw material of compounding, so the single biggest lever is simply starting sooner rather than waiting for a perfect moment.",
          "A higher rate of return, within reason. A few percentage points compounded over decades produces a far larger gap than the same difference over a few years.",
          "Frequency of compounding. Interest that compounds monthly or daily grows slightly faster than the same rate compounded once a year.",
          "Reinvesting, not withdrawing. Spending the interest or dividends along the way breaks the chain; leaving them in is what lets returns earn returns.",
          "Avoiding high fees. A 1% annual fee does not sound like much, but compounded over a lifetime it can quietly consume a large slice of the final balance.",
        ],
      },
      {
        heading: "The same force can work against you",
        paragraphs: [
          "Compounding is neutral about direction. The mechanism that grows your investments is the same one that grows debt, which is why a credit card balance at 22% can feel impossible to escape. Unpaid interest is added to the balance, then charged interest itself, so the debt accelerates exactly the way savings do, only against you.",
          "This symmetry is worth holding in mind. High-interest debt compounding against you usually outruns any investment compounding for you, which is why paying off expensive debt is often the best guaranteed return available. The decision to invest or pay down debt is really a question of which compounding force is stronger.",
        ],
      },
      {
        heading: "See it on your own numbers",
        paragraphs: [
          "The cleanest way to believe in compounding is to project it. Enter a starting amount, a regular contribution, an assumed rate of return, and a number of years, and look at how much of the final balance is your own money versus growth. Over a long horizon, the growth portion usually dwarfs the contributions, and that crossover is the whole point.",
          "These projections rest on an assumed steady return that real markets never deliver in a straight line, so treat them as estimates rather than promises, and nothing here is financial advice. But the underlying truth holds regardless of the exact numbers: time is the ingredient you can least afford to waste, and the best day to start compounding was years ago. The second best is today.",
        ],
      },
    ],
  },

  {
    slug: "how-much-house-can-you-actually-afford",
    title: "How much house can you actually afford?",
    description:
      "A lender's maximum loan and a comfortable monthly payment are rarely the same number. Here is how the 28/36 rule works, the costs beyond the mortgage that buyers forget, and how to find a payment you can live with.",
    date: "2026-06-20",
    readingMinutes: 6,
    category: "Home Buying",
    related: { name: "Mortgage Affordability Calculator", href: "/calculators/finance/mortgage-affordability-calculator" },
    body: [
      {
        paragraphs: [
          "When you ask a lender how much house you can afford, they answer a narrow question: how large a loan will we approve based on your income and debts? That number is often surprisingly high, and it is easy to mistake it for the amount you should actually spend. The two are not the same, and the gap between them is where a lot of household stress is born.",
          "Affordability is really two questions stacked on top of each other. The first is how much a bank will lend you. The second, and more important, is how much you can repay every month for years without your life feeling squeezed. A sensible budget answers the second question first and lets it cap the first.",
        ],
      },
      {
        heading: "The 28/36 rule lenders lean on",
        paragraphs: [
          "Most affordability math starts with two ratios known together as the 28/36 rule. The first says your housing costs - mortgage principal and interest, property tax, homeowners insurance, and any association dues - should stay at or below 28% of your gross monthly income. On a $6,000 monthly income, that points to a housing budget of about $1,680.",
          "The second ratio looks at total debt. It says all your monthly debt payments combined - housing plus car loans, student loans, credit card minimums, and the like - should stay at or below 36% of gross income. The same $6,000 earner would aim to keep all debt payments under roughly $2,160. Whichever ratio is tighter for your situation sets the real ceiling, and existing debts can pull the housing number well below the 28% figure.",
        ],
      },
      {
        heading: "Gross income hides the real squeeze",
        paragraphs: [
          "Notice that both ratios use gross income, the figure before any tax or deduction comes out. Your actual take-home pay is smaller, sometimes much smaller once income tax, payroll tax, retirement contributions, and health premiums are removed. A payment that looks like 28% of gross can be a much larger share of the money that actually lands in your account.",
          "This is the single most common reason a mortgage that was approved on paper feels tight in practice. The honest move is to test any target payment against your take-home pay, not your salary, and ask what share of the money you really receive it would consume each month.",
        ],
      },
      {
        heading: "The costs the sticker price hides",
        list: [
          "Property tax, which can add hundreds a month and rises over time as assessments climb.",
          "Homeowners insurance, required by lenders and increasingly expensive in many regions.",
          "Private mortgage insurance, charged on many loans with a down payment under 20% until you build enough equity.",
          "Maintenance and repairs, often estimated at around 1% of the home's value a year, which never stops and tends to arrive in lumps.",
          "Association or condo fees, utilities that are larger than in a rental, and the closing costs you pay just to complete the purchase.",
        ],
      },
      {
        heading: "Why the down payment changes everything",
        paragraphs: [
          "The size of your down payment moves affordability on several fronts at once. A larger down payment shrinks the loan, which lowers the monthly payment directly. It can also lift you past the 20% threshold that removes private mortgage insurance, cutting another recurring cost. And a stronger down payment sometimes earns a better interest rate, which compounds the saving over the life of the loan.",
          "The trade-off is liquidity. Pouring every dollar into a down payment can leave you house-rich and cash-poor, with nothing left for the emergency fund a homeowner needs more than a renter does. The goal is a down payment large enough to make the payment comfortable while still leaving a cushion for the repairs and surprises that ownership guarantees.",
        ],
      },
      {
        heading: "Interest rates set the ceiling more than price",
        paragraphs: [
          "Buyers fixate on the home's price, but the interest rate often does more to the monthly payment than a swing in price would. Because a mortgage is repaid over decades, even a one percentage point change in the rate can move the payment by hundreds of dollars and change the total interest by tens of thousands over the loan's life.",
          "This is why the same buyer can afford a noticeably more expensive home when rates are low and far less when rates are high, even though their income has not changed. Running your budget at the current rate, rather than the rate you wish existed, keeps the target realistic.",
        ],
      },
      {
        heading: "Find a number you can live with",
        paragraphs: [
          "The most useful exercise before house hunting is to work backward from a comfortable monthly payment to a price, rather than starting from a price you hope to justify. Enter your income, your existing debts, your expected down payment, the current interest rate, and estimates for tax and insurance, and look at the price that keeps you safely inside both ratios with room to breathe.",
          "These figures are estimates that depend on rates, taxes, and insurance costs that vary by location and change over time, and nothing here is financial advice. But choosing a payment you can sustain in a bad month, not just a good one, is what separates a home you enjoy from one that owns you. The bank's maximum is a limit, not a target.",
        ],
      },
    ],
  },

  {
    slug: "when-to-claim-social-security",
    title: "When to claim Social Security: the eight-year decision",
    description:
      "You can start Social Security any time from 62 to 70, and the age you pick can change your monthly check by more than 70%. Here is how early and delayed claiming really work, what break-even age means, and the factors that should drive the choice.",
    date: "2026-06-19",
    readingMinutes: 6,
    category: "Retirement",
    related: { name: "Social Security Calculator", href: "/calculators/finance/social-security-calculator" },
    body: [
      {
        paragraphs: [
          "Few financial choices are as consequential, or as irreversible, as when to start Social Security. You can claim as early as 62 or as late as 70, and the date you pick is locked in for the rest of your life, setting the size of a monthly check that often becomes the backbone of retirement income. Get it right and you add a meaningful cushion; get it wrong and you can leave years of higher payments on the table.",
          "The decision is built around a single fact: the longer you wait, within the allowed window, the larger each monthly payment becomes. Everything else is about weighing that larger-but-later check against a smaller-but-sooner one, in light of your own health, savings, and circumstances.",
        ],
      },
      {
        heading: "Full retirement age is the anchor",
        paragraphs: [
          "Social Security is built around your full retirement age, the point at which you receive 100% of the benefit you have earned. For anyone born in 1960 or later, that age is 67. Claiming exactly then gives you your full, unreduced amount, and the system measures early and late claiming as adjustments away from that anchor.",
          "Your benefit amount itself is based on your highest 35 years of earnings, adjusted for wage growth. Years with no earnings count as zeros in that average, which is why a few extra working years late in a career can nudge the benefit up by replacing an early low or zero year.",
        ],
      },
      {
        heading: "Claiming early shrinks the check permanently",
        paragraphs: [
          "Start before full retirement age and your benefit is reduced for life. Claiming at 62, the earliest age, cuts the monthly amount by about 30% for someone whose full retirement age is 67. That reduction does not go away when you later reach 67; it is permanent, baked into every check you receive thereafter.",
          "There is also an earnings test for people who claim early and keep working. If your wages exceed an annual limit before full retirement age, part of your benefit is temporarily withheld, though it is effectively returned later through a higher payment. For someone still earning a normal salary, claiming at 62 can mean giving up much of the check anyway.",
        ],
      },
      {
        heading: "Delaying past full retirement age pays a bonus",
        paragraphs: [
          "Waiting beyond full retirement age earns delayed retirement credits, which increase your benefit by about 8% for each year you postpone, up to age 70. Push from 67 to 70 and your monthly payment grows by roughly 24%. After 70 the credits stop, so there is no reason to wait any longer than that.",
          "Stack the ends of the range together and the spread is large. The benefit at 70 can be more than 70% higher than the benefit at 62 for the same person, simply because of when they chose to start. That is an unusually generous, guaranteed increase for patience, effectively a return the government pays you for waiting.",
        ],
      },
      {
        heading: "Break-even is the heart of the math",
        paragraphs: [
          "Claiming early gives you more checks, but smaller ones. Claiming late gives you fewer checks, but larger ones. The break-even age is the point where the two strategies have paid out the same total. Live past it and waiting wins; die before it and claiming early wins. For many people the break-even between claiming at 62 and waiting until full retirement age lands somewhere in the late seventies to early eighties.",
          "Break-even analysis is useful but incomplete, because it treats the decision as a bet on your lifespan alone. In reality, a larger delayed check is also insurance against the risk of living a very long time and running short, which is a different kind of value than simply maximizing total dollars.",
        ],
      },
      {
        heading: "What should actually drive the choice",
        list: [
          "Your health and family longevity. If you expect a long life, delaying usually pays more over the full retirement; serious health concerns argue for claiming earlier.",
          "Whether you are still working. Earning a salary before full retirement age can trigger the earnings test, often making early claiming pointless.",
          "Other income and savings. If you can live on savings for a few years, delaying buys a larger guaranteed check for the rest of your life.",
          "Marital status. A higher earner who delays leaves a larger survivor benefit for a spouse, which can outlast the higher earner by many years.",
          "Your need for cash now. If the income is essential to cover basic costs at 62, the theoretical gains from waiting may not be a real option.",
        ],
      },
      {
        heading: "Run your own numbers first",
        paragraphs: [
          "Because the choice is permanent, it is worth modeling before you commit. Estimate your monthly benefit at 62, at full retirement age, and at 70, then look at the lifetime totals under different assumptions about how long you live. Seeing the break-even age and the size of the survivor benefit side by side turns an abstract decision into a concrete one.",
          "These estimates depend on your earnings record and on rules that Congress can change, so confirm your actual figures with the Social Security Administration before deciding, and treat any projection as an estimate rather than a guarantee. Nothing here is financial advice. But understanding the eight-year window, and what you gain or give up at each end of it, is what lets you claim on purpose rather than by default.",
        ],
      },
    ],
  },

  {
    slug: "the-freelancers-self-employment-tax-surprise",
    title: "The freelancer's tax surprise: self-employment tax",
    description:
      "New freelancers often discover they owe far more tax than expected, and the culprit is self-employment tax. Here is what the 15.3% really covers, why an employer used to pay half of it, and how quarterly payments keep you out of trouble.",
    date: "2026-06-18",
    readingMinutes: 6,
    category: "Self-Employment",
    related: { name: "Freelance Tax Calculator", href: "/calculators/finance/freelance-tax-calculator" },
    body: [
      {
        paragraphs: [
          "The first tax bill as a freelancer is often a genuine shock. You set aside what you assumed was enough for income tax, only to find the total is far larger than a comparable salaried worker would owe on the same earnings. The extra is not a penalty or a mistake. It is self-employment tax, and not knowing it exists is one of the most expensive surprises of going independent.",
          "The good news is that self-employment tax is entirely predictable once you understand it. It runs on a fixed rate, it covers something you were already paying as an employee without noticing, and there are deductions that soften it. The trouble only comes from being blindsided, and that is avoidable.",
        ],
      },
      {
        heading: "What the 15.3% actually covers",
        paragraphs: [
          "Self-employment tax is the self-employed version of the payroll tax that funds Social Security and Medicare. It is charged at 15.3% of your net self-employment earnings, made up of 12.4% for Social Security and 2.9% for Medicare. This is entirely separate from federal income tax, which you still owe on top.",
          "The Social Security portion applies only up to an annual wage base, $176,100 in 2025, after which the 12.4% piece stops. The 2.9% Medicare portion has no ceiling and applies to all your net earnings, with an additional 0.9% added on earnings above $200,000 for single filers. For most freelancers, the full 15.3% is the number that matters.",
        ],
      },
      {
        heading: "Why employees never see this",
        paragraphs: [
          "A salaried worker pays exactly the same Social Security and Medicare taxes, but only half of them appear on their paystub. The employer quietly pays the other half, 7.65%, directly to the government. Most employees have no idea this second contribution exists, because it never touches their take-home pay.",
          "When you become self-employed, you are both the worker and the employer, so you owe both halves. That is why the rate is 15.3% rather than the 7.65% an employee sees. You are not being taxed more harshly than everyone else; you are simply seeing the full cost that an employer used to hide on your behalf.",
        ],
      },
      {
        heading: "The deductions that soften the blow",
        paragraphs: [
          "Two built-in adjustments make the real burden lighter than the headline rate suggests. First, self-employment tax is calculated on 92.35% of your net profit, not the full amount, which slightly shrinks the base it applies to. Second, you can deduct one-half of your self-employment tax when figuring your income tax, mirroring the fact that the employer's half was never taxable income to an employee.",
          "On top of these, self-employment tax is charged on your net profit, meaning revenue minus legitimate business expenses, not your gross income. Every deductible business cost - software, equipment, mileage, a home office that qualifies - lowers the profit that both self-employment tax and income tax are calculated on. Tracking expenses carefully is one of the highest-value habits a freelancer can build.",
        ],
      },
      {
        heading: "Quarterly payments are not optional",
        paragraphs: [
          "Employees have tax withheld from every paycheck automatically. Freelancers have no one doing that for them, so the tax system expects you to pay as you go through estimated quarterly payments, typically due in April, June, September, and January. These cover both your income tax and your self-employment tax.",
          "Skip them and you can face an underpayment penalty even if you pay the full amount at filing time, because the system wants the money throughout the year, not all at once. A common rule of thumb is to set aside somewhere between a quarter and a third of every payment you receive into a separate account for taxes, so the quarterly bills are already funded when they arrive.",
        ],
      },
      {
        heading: "Mistakes that cost freelancers money",
        list: [
          "Saving only for income tax and forgetting the 15.3% self-employment tax entirely.",
          "Spending gross income as if it were take-home pay, then scrambling when the bill comes due.",
          "Missing quarterly deadlines and triggering underpayment penalties on top of the tax.",
          "Failing to track deductible business expenses, which inflates the profit that gets taxed twice over.",
          "Overlooking a retirement account for the self-employed, which can lower taxable income while building savings.",
        ],
      },
      {
        heading: "Estimate before the bill arrives",
        paragraphs: [
          "The way to defuse the surprise is to estimate the tax as income comes in, rather than at year end. Enter your expected net profit, and look at the self-employment tax and income tax separately, so you can see how much of each payment truly belongs to you and how much belongs to the government. Knowing the combined effective rate lets you set the right amount aside from day one.",
          "These figures are estimates that depend on your full tax situation, your state, and deductions a calculator cannot see, so treat them as a starting point and confirm with the IRS or a tax professional before filing. Nothing here is tax advice. But the freelancers who never get blindsided are simply the ones who priced self-employment tax into their rates and their savings from the very first invoice.",
        ],
      },
    ],
  },

  {
    slug: "401k-match-is-free-money",
    title: "The 401(k) match is free money, and most people leave some behind",
    description:
      "An employer 401(k) match is the closest thing to free money in personal finance, yet billions go unclaimed every year. Here is how matching really works, the contribution limits for 2025, and the order in which to fund your retirement accounts.",
    date: "2026-06-10",
    readingMinutes: 6,
    category: "Retirement",
    related: { name: "401(k) Calculator", href: "/calculators/finance/401k-calculator" },
    body: [
      {
        paragraphs: [
          "There are very few guaranteed returns in investing. Markets rise and fall, interest rates move, and most promises of certainty are best ignored. The employer 401(k) match is the rare exception: a return you lock in the moment the money lands in your account, before a single dollar is invested. And yet a large share of workers who are offered a match never capture all of it, walking past money their employer has already set aside for them.",
          "The reason is rarely indifference. It is usually a misunderstanding of how the match works, or a budget that feels too tight to contribute. Both are worth challenging, because the math here is unusually one-sided.",
        ],
      },
      {
        heading: "What a match actually is",
        paragraphs: [
          "A 401(k) match is a contribution your employer makes to your retirement account based on what you put in yourself. The most common formula is a full match on the first portion of your pay and a half match on the next slice, often written as something like '100% on the first 3%, then 50% on the next 2%.' Under that formula, contributing 5% of your salary earns you another 4% from your employer, every pay period, automatically.",
          "Put plainly, that is an immediate 80% return on the money you contributed up to the match, before any market growth. No investment available to an ordinary saver comes close. If your salary is $60,000 and you contribute 5%, you add $3,000 and your employer adds $2,400. Skip the contribution and that $2,400 simply does not exist.",
        ],
      },
      {
        heading: "The limits that govern how much you can add",
        paragraphs: [
          "For 2025, you can contribute up to $23,500 of your own money to a 401(k). If you are age 50 or older, a catch-up provision lets you add a further $7,500, and a new higher catch-up applies to savers aged 60 to 63. Employer matching contributions sit on top of your personal limit, under a much larger combined cap that most workers never approach.",
          "Two details trip people up. First, the match does not count against your personal contribution limit, so it never crowds out your own saving. Second, the match has its own ceiling set by the formula, so contributing far above the match percentage earns you tax advantages but no extra employer money. The first goal is always to contribute at least enough to capture the full match.",
        ],
      },
      {
        heading: "Vesting: the string sometimes attached",
        paragraphs: [
          "Your own contributions are always yours immediately. Employer contributions can be subject to a vesting schedule, which means you earn ownership of them over time. Some plans vest instantly, some on a cliff (nothing until a set year, then all at once), and some gradually over several years. If you leave before you are fully vested, you forfeit the unvested employer portion.",
          "This matters most if you change jobs often. It does not change the advice to capture the match, but it is worth knowing your schedule before counting employer money as fully yours, especially if a move is on the horizon.",
        ],
      },
      {
        heading: "The order most savers should fund accounts",
        list: [
          "Contribute enough to your 401(k) to capture the full employer match - this is the highest-return step available.",
          "Pay down high-interest debt, such as credit cards, where the guaranteed saving rivals or beats the match.",
          "Build a basic emergency fund so a setback does not force you to raid retirement savings.",
          "Consider a Roth or traditional IRA for more investment choice and flexibility.",
          "Return to the 401(k) and increase contributions toward the annual limit if you have room.",
        ],
      },
      {
        heading: "Why people still miss it",
        paragraphs: [
          "The most common reason is starting at a contribution rate below the match threshold, often the plan's default, and never revisiting it. A default of 3% feels responsible, but if the match runs to 5% it leaves part of the employer money on the table. Raising your rate to meet the full match, even gradually by a percentage point a year, closes that gap.",
          "Another reason is the belief that money is too tight. Because traditional 401(k) contributions come out pre-tax, the hit to your take-home pay is smaller than the amount you save. A $200 contribution might reduce your paycheck by closer to $160 once the tax deferral is accounted for, while still unlocking the full employer match on top.",
        ],
      },
      {
        heading: "See the long-run difference",
        paragraphs: [
          "The reason the match matters so much is compounding. Money added early has decades to grow, and employer contributions effectively increase your savings rate for free. Over a career, capturing a full match rather than half of it can mean a difference measured in six figures by retirement, driven almost entirely by money you never had to earn.",
          "The simplest way to make this concrete is to project it. Enter your salary, your contribution rate, your employer's match formula, and an assumed rate of return, and look at the balance at retirement with and without the full match. The gap between those two numbers is the cost of leaving the match unclaimed. These projections are estimates, not guarantees, and are not financial advice, but they make an abstract benefit impossible to ignore.",
        ],
      },
    ],
  },

  {
    slug: "hsa-the-quiet-retirement-account",
    title: "The HSA is the most tax-advantaged account almost nobody uses right",
    description:
      "A Health Savings Account is the only account in the US tax code with three separate tax breaks. Here is how the triple advantage works, the 2025 limits, and why treating it as a retirement account beats spending it each year.",
    date: "2026-06-10",
    readingMinutes: 6,
    category: "Health & Savings",
    related: { name: "HSA Calculator", href: "/calculators/finance/hsa-calculator" },
    body: [
      {
        paragraphs: [
          "Most tax-advantaged accounts give you one break and take another. A traditional 401(k) defers tax now but taxes withdrawals later. A Roth does the reverse. The Health Savings Account is the only account in the US tax code that does neither, offering three distinct tax advantages at once. It is also, by a wide margin, the most misunderstood, because almost everyone treats it as a simple spending account rather than the long-term wealth tool it can be.",
          "The catch is that not everyone can use one, and the rules around eligibility are strict. But for those who qualify, the HSA quietly outperforms accounts that get far more attention.",
        ],
      },
      {
        heading: "The triple tax advantage",
        paragraphs: [
          "The three breaks stack. First, the money you contribute is deductible, lowering your taxable income the year you put it in, much like a traditional retirement contribution. Second, the balance grows tax-free, so any interest or investment gains inside the account are never taxed as they accumulate. Third, withdrawals for qualified medical expenses come out completely tax-free.",
          "No other account does all three. A 401(k) gives you the first two but taxes withdrawals. A Roth IRA gives you the second and third but no upfront deduction. The HSA gives you all three at the same time, which is why financial planners sometimes call it the most efficient account available to ordinary savers.",
        ],
      },
      {
        heading: "Who can contribute, and how much",
        paragraphs: [
          "Eligibility is the gatekeeper. To contribute to an HSA you must be covered by a qualifying high-deductible health plan, you cannot be enrolled in Medicare, and you cannot be claimed as someone else's dependent. The high-deductible plan requirement is the one most people overlook: a low-deductible plan, however good, locks you out of the account entirely.",
          "For 2025, the contribution limit is $4,300 for self-only coverage and $8,550 for family coverage. Savers aged 55 and older can add a further $1,000 catch-up contribution. Contributions made through payroll also avoid Social Security and Medicare payroll taxes, a fourth quiet advantage that a Roth or IRA cannot match.",
        ],
      },
      {
        heading: "The mistake: spending it every year",
        paragraphs: [
          "Most people open an HSA, contribute a little, and spend it on this year's prescriptions and copays. That captures the tax deduction but throws away the account's real power, which is tax-free growth over decades. Money spent immediately never gets the chance to compound.",
          "The alternative strategy is to pay current medical bills out of pocket where you can, leave the HSA invested, and let it grow. Crucially, there is no deadline to reimburse yourself. If you keep your receipts, you can pay a medical bill today and withdraw the matching amount tax-free years later, after the balance has grown. The HSA effectively becomes a medical-expense reimbursement account with a long fuse.",
        ],
      },
      {
        heading: "What happens at retirement",
        paragraphs: [
          "The HSA has a feature that makes it work as a stealth retirement account. After age 65, you can withdraw money for any purpose without the 20% penalty that normally applies to non-medical withdrawals. Those non-medical withdrawals are taxed as ordinary income, which makes the account behave exactly like a traditional IRA for general spending.",
          "But medical costs do not disappear in retirement; they rise. One large study estimates a typical retired couple will spend hundreds of thousands of dollars on healthcare over their remaining lives. A well-funded HSA covers those costs tax-free, which is the best possible outcome, while still acting as an IRA-equivalent for anything else.",
        ],
      },
      {
        heading: "Common pitfalls to avoid",
        list: [
          "Leaving the balance in cash. Many HSAs let you invest above a threshold, and an uninvested balance loses the growth advantage to inflation.",
          "Confusing an HSA with an FSA. A Flexible Spending Account is use-it-or-lose-it; an HSA rolls over and is yours forever.",
          "Contributing while enrolled in Medicare, which is not allowed and can trigger penalties.",
          "Throwing away receipts. They are what let you reimburse yourself tax-free in the future.",
          "Overlooking the payroll-tax saving by contributing outside your employer's plan when a payroll option exists.",
        ],
      },
      {
        heading: "Model it before you decide",
        paragraphs: [
          "The decision to treat an HSA as a long-term account rather than a spending account is easier to make once you see the numbers. Project a steady annual contribution, an assumed rate of return, and the years until retirement, and compare the result against spending the same money each year. The invested version typically ends up dramatically larger, because every layer of tax that would normally erode growth is removed.",
          "These projections are estimates and depend on assumptions that will not hold exactly, and none of this is tax or medical advice. But the structure is real: an account with three tax breaks, used patiently, is one of the strongest tools an eligible saver has. The hardest part is simply choosing not to spend it.",
        ],
      },
    ],
  },

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
          "The credit is generous well into the upper-middle class, but it does not last forever. Once your adjusted gross income passes $200,000 as a single filer, or $400,000 if you are married filing jointly, the credit begins to taper. The taper is mechanical: for every $1,000 of income above your threshold - and any part of a thousand counts as a whole step - you lose $50 of credit. A married couple earning $410,000 with two children, for example, sees ten steps of reduction, or $500 off their $4,400 base, leaving $3,900.",
          "Most families never reach the phase-out at all, which is why the more important question for them is not income but the second factor: how the refundable portion works.",
        ],
      },
      {
        heading: "The refundable portion is where low earners win or lose",
        paragraphs: [
          "A non-refundable credit can only erase tax you owe. If your tax bill is small, a $4,400 credit that is purely non-refundable would be wasted past the point where your tax hits zero. This is exactly the situation many working families face, and it is why the Additional Child Tax Credit exists. It lets you receive part of the credit as a cash refund even when you owe little or no income tax.",
          "The refundable amount is capped two ways. First, it cannot exceed $1,700 per child. Second, it is calculated as 15% of your earned income above $2,500. That second rule is the one that quietly limits large, low-income families: a parent of three earning $20,000 has only $17,500 of earnings above the $2,500 floor, and 15% of that is $2,625 - well below the $5,100 per-child ceiling for three children. Their refund is limited by their wages, not by the number of children.",
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
          "None of this is tax advice, and a complete return can shift the final figure. But understanding the two levers - income for the phase-out, earned income for the refund - puts you ahead of most filers, and makes it far less likely you leave money on the table.",
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
          "Then it plateaus at a maximum - in 2025, that is $649 with no children, $4,328 with one, $7,152 with two, and $8,046 with three or more. The plateau holds across a band of income. Only after a higher threshold does the credit begin to phase out, falling gradually to zero at the income limit for your situation. This rise-plateau-fall shape is why a worker can earn more and, past a point, see the credit shrink slightly even as take-home pay rises.",
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
          "There is one cliff worth knowing about. The EITC has an investment-income limit - $11,950 in 2025 - and it is a hard cutoff, not a gentle taper. Earn a dollar of investment income above that line and the entire credit disappears, no matter how low your wages are. Investment income here includes interest, dividends, capital gains, and certain rental and royalty income. For most low-wage workers this never comes into play, but for someone with a brokerage account or a rental property, it can quietly erase a credit they would otherwise receive.",
          "A second trap is filing status: married couples generally cannot claim the EITC if they file separately. And everyone on the return usually needs a valid Social Security number.",
        ],
      },
      {
        heading: "Why the money goes unclaimed",
        list: [
          "People assume childless workers are excluded - they are not.",
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
          "Broadly, two kinds of federal tax come out of a typical paycheck, and they behave very differently from each other. Add a third layer - state tax - and you have the full picture of why the headline salary is never what lands in your account.",
        ],
      },
      {
        heading: "Federal income tax is progressive",
        paragraphs: [
          "The first deduction is federal income tax, and it works in slices. After subtracting the standard deduction - $15,750 for a single filer in 2025 - your remaining taxable income is split across brackets, each taxed at its own rate, from 10% on the first slice up to 37% at the very top. Crucially, only the income that falls within a bracket is taxed at that bracket's rate. So being 'in the 22% bracket' does not mean 22% of everything; it means your last dollars are taxed at 22% while earlier dollars were taxed less.",
          "This is why your effective rate - total income tax divided by total income - is always lower than your top bracket. A single person earning $60,000 pays around $5,072 in federal income tax, an effective rate under 9%, despite touching the 12% bracket.",
        ],
      },
      {
        heading: "FICA is flat, and it is the part people forget",
        paragraphs: [
          "The second federal deduction is FICA, the payroll tax that funds Social Security and Medicare. Unlike income tax, it does not care about brackets or deductions. Social Security takes 6.2% of your wages up to an annual ceiling - $176,100 in 2025 - and nothing above that. Medicare takes 1.45% of every dollar of wages with no ceiling at all, and adds an extra 0.9% on wages above $200,000 for singles or $250,000 for couples.",
          "For most workers, FICA is a bigger surprise than income tax, because it starts from the first dollar and has no standard deduction to soften it. On that $60,000 salary, FICA alone is $4,590 - nearly as much as the income tax. Your employer quietly matches the Social Security and Medicare portions, which is part of why hiring you costs more than your salary.",
        ],
      },
      {
        heading: "Putting it together",
        paragraphs: [
          "On a $60,000 single salary, roughly $5,072 of federal income tax and $4,590 of FICA come to about $9,662, leaving around $50,338 of federal take-home - just under $4,195 a month. And that is before state tax, retirement contributions, and health premiums, all of which come out too.",
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
          "Many people treat a big tax refund as a windfall, but it usually means you over-withheld and lent the government money interest-free all year. The opposite - a surprise bill - means you under-withheld. The goal is to land close to zero, keeping more of each paycheck and avoiding shocks at filing time. Estimating your take-home pay first, then comparing it to your actual paystub, is the simplest way to spot when your withholding has drifted and needs a tweak.",
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
          "Most household bills are fixed: you cannot negotiate your electricity rate or talk your way out of a parking fine. Property tax is the unusual exception. It is large, recurring, and - to a degree that surprises many homeowners - contestable. Between exemptions you may not have claimed and assessments that may be too high, a meaningful number of owners are paying more than they need to, year after year.",
          "Understanding how the bill is built is the first step to lowering it. Property tax is, at heart, a value multiplied by a rate. Change either side of that equation in your favor and the bill falls.",
        ],
      },
      {
        heading: "Why identical homes pay wildly different taxes",
        paragraphs: [
          "The 'rate' side of the equation is intensely local. It is set not by one government but by the overlapping layers - county, city, school district, and special districts - that each levy a piece. Combine them and you get an effective rate, the share of your home's value you pay each year. That rate ranges from well under 1% in low-tax states to over 2% in the highest.",
          "The practical consequence is that location matters more than price. A $300,000 home in Texas, at an effective rate near 1.68%, carries about $5,040 in annual tax; the same home in California, near 0.71%, runs closer to $2,130. Neither owner can change their state's rate, but knowing your effective rate tells you whether your bill is in a normal range or worth investigating.",
        ],
      },
      {
        heading: "Exemptions: money you may be leaving unclaimed",
        paragraphs: [
          "The 'value' side is where most savings hide, and the biggest lever is the homestead exemption. It removes a slice of your home's value from taxation if the property is your primary residence. Florida exempts up to $50,000 of value; Texas offers a substantial school-district exemption; other states structure theirs differently. On a home in a state with a 1% effective rate, a $50,000 exemption is worth about $500 a year - every year you hold the home.",
          "The catch is that exemptions are usually not automatic. You typically apply once, through your county assessor, and many owners simply never do. On top of the general homestead exemption, many states layer additional relief for people over 65, veterans, surviving spouses, and people with disabilities, sometimes freezing the assessed value so it cannot rise. Each has its own eligibility test and deadline, often early in the year.",
        ],
      },
      {
        heading: "Appealing an assessment that is too high",
        paragraphs: [
          "If your home's assessed value looks higher than what comparable homes are selling for, you can appeal. The process varies by county but generally involves gathering recent sales of similar nearby properties, documenting any condition issues that reduce your home's value, and filing within a short window - often 30 to 60 days after the assessment notice. A successful appeal lowers the value the rate is applied to, and the saving repeats every year until the next reassessment.",
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
          "On top of the standard allowance, you add elements for your circumstances. The most common is the child element - £333.33 a month for an eligible first child and £287.92 for others - though the two-child limit restricts this for most children born after April 2017. Further elements exist for housing costs, childcare, disability, and caring responsibilities. Add them all and you get your maximum award: the most you could receive if you had no income at all.",
        ],
      },
      {
        heading: "The taper: how earnings reduce the award",
        paragraphs: [
          "Universal Credit is designed so that work always pays, which is why it tapers rather than cutting off. If you have children or a limited capability for work, you get a work allowance - an amount you can earn each month before anything is deducted. Above that allowance, every £1 of take-home earnings reduces your award by 55p. That is the taper, and the 55% rate is the single most important number in the system.",
          "Other income - such as certain other benefits - generally reduces the award pound for pound rather than through the taper. And savings matter too: capital over £16,000 usually rules out Universal Credit entirely, while savings between £6,000 and £16,000 reduce the award through an assumed income.",
        ],
      },
      {
        heading: "A worked example",
        paragraphs: [
          "Picture a single parent aged 25 or over with one child, taking home £800 a month. Their standard allowance of £400.14 plus a £333.33 child element gives a maximum of £733.47. Because they have a child, a work allowance of £411 applies, so only the £389 of earnings above it is tapered. At 55%, that is about £214, which is subtracted from the maximum to leave roughly £519 a month.",
          "Notice what happens at the edges. Earn less, and the award climbs toward the £733.47 maximum. Earn more, and the taper takes a bit more - but never all of it, so each extra hour of work still leaves you better off overall. That gradual reduction is the whole point of the design.",
        ],
      },
      {
        heading: "What trips people up",
        list: [
          "Confusing gross pay with take-home pay - the taper applies to earnings after tax and National Insurance.",
          "Forgetting the two-child limit when counting child elements.",
          "Not realizing housing and childcare support can add substantially to the award.",
          "Overlooking the £16,000 savings limit, which ends entitlement entirely.",
          "Assuming the first payment is immediate - it usually arrives about five weeks after claiming.",
        ],
      },
      {
        heading: "Estimate first, then claim",
        paragraphs: [
          "Because so much depends on your exact circumstances, the honest advice is to treat any quick estimate as a starting point rather than a promise. A simplified calculation that covers the standard allowance, child elements, and the taper will tell you whether a claim is likely worthwhile and roughly what scale of support to expect. From there, the official service - or a detailed benefits calculator that factors in housing, childcare, and disability - gives the accurate figure.",
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
          "Two of the most valuable benefits a Canadian household can receive arrive almost invisibly. There is no monthly application, no interview, no queue - just deposits that show up if you have filed your taxes. The Canada Child Benefit and the GST/HST credit are both tied to your tax return, and both are tax-free, which makes the humble act of filing one of the highest-return chores in personal finance.",
          "Because they run off income, both benefits also shift each July, when the Canada Revenue Agency recalculates them using your previous year's return. Understanding how they are built helps you anticipate the change and, occasionally, catch a payment you were owed.",
        ],
      },
      {
        heading: "The Canada Child Benefit: large, and income-tested",
        paragraphs: [
          "The Canada Child Benefit is the bigger of the two for families with children. For the July 2025 to June 2026 benefit year, the maximum is $7,997 per year for each child under six and $6,748 for each child aged six to seventeen. If your adjusted family net income is at or below $37,487, you receive the full amount - a substantial, tax-free monthly deposit.",
          "Above that threshold, the benefit reduces on a two-tier basis. Income between $37,487 and $81,222 is reduced at a first rate that depends on how many children you have; income above $81,222 is reduced by a fixed amount plus a second, lower rate. The result is a benefit that fades gradually rather than cutting off, so even middle-income families often receive something.",
        ],
      },
      {
        heading: "A quick example",
        paragraphs: [
          "A family with two children under six and an adjusted family net income of $30,000 sits below the threshold, so they receive the full maximum: two times $7,997, or $15,994 a year - about $1,333 every month, tax-free. A family with one young child and one older child and an income of $50,000 starts from a maximum of $14,745 but, being in the first reduction tier, loses about 13.5% of the income above $37,487, leaving roughly $13,056. Same country, very different cheques, driven entirely by income and the ages of the children.",
        ],
      },
      {
        heading: "The GST/HST credit: small, broad, and easy to miss",
        paragraphs: [
          "The GST/HST credit is quieter but reaches far more people, because it is aimed at offsetting the sales tax that lower-income households pay. For 2025–26 it is worth up to roughly $533 a year for a single adult and $698 for a couple, plus about $184 for each child under nineteen. It is paid quarterly, in July, October, January, and April.",
          "Like the child benefit, it phases out with income - reduced by 5% of adjusted family net income above about $45,521 - but its real quirk is how invisible it is. Most people are considered automatically when they file, so the only way to miss it is to not file at all. Newcomers to Canada are the exception: they usually need to complete a specific form to start receiving it rather than waiting for automatic enrolment.",
        ],
      },
      {
        heading: "Why filing is the whole game",
        list: [
          "Both benefits are recalculated every July from your prior-year return, so filing on time keeps payments uninterrupted.",
          "You must file even with no income - non-filers simply do not get assessed.",
          "Both partners in a couple need to file for the family to be assessed correctly.",
          "Provincial top-ups, such as the Ontario Child Benefit or the BC Family Benefit, often ride alongside the federal amounts.",
          "Newcomers should apply rather than wait for automatic enrolment.",
        ],
      },
      {
        heading: "Plan around the July reset",
        paragraphs: [
          "Because both benefits change each July using last year's income, a big income swing takes time to show up. A year of lower income raises next July's payments; a strong year lowers them. Families planning around parental leave, a job change, or a move can use this lag to anticipate what is coming rather than being surprised by it.",
          "The simplest way to stay ahead is to estimate both benefits whenever your income or family situation changes. Knowing roughly what the Canada Child Benefit and the GST/HST credit should be - and confirming the figure once the CRA recalculates - turns two invisible deposits into something you can actually budget around. And the single action that protects both is the same: file your taxes, every year, on time.",
        ],
      },
    ],
  },

  {
    slug: "avalanche-vs-snowball-debt-payoff",
    title: "Avalanche or snowball: which debt payoff method gets you free faster",
    description:
      "The two most popular debt payoff strategies pull in opposite directions: one saves the most money, the other keeps you motivated. Here is how the avalanche and snowball methods actually differ, the math behind each, and how to pick the one you will finish.",
    date: "2026-06-12",
    readingMinutes: 6,
    category: "Debt Payoff",
    related: { name: "Debt Payoff Calculator", href: "/calculators/finance/debt-payoff-calculator" },
    body: [
      {
        paragraphs: [
          "If you carry more than one balance, the hardest part of paying off debt is not finding the money. It is deciding where to send the extra dollar each month. Every credit card, car loan, and personal loan competes for the same limited surplus, and the order you tackle them in changes both how much interest you pay and how long the whole effort takes.",
          "Two methods dominate the advice you will hear, and they disagree on purpose. The avalanche method optimizes for math. The snowball method optimizes for momentum. Neither is wrong, but they suit different people, and choosing the one that fits how you actually behave matters more than choosing the one that looks best on a spreadsheet.",
        ],
      },
      {
        heading: "The one rule both methods share",
        paragraphs: [
          "Before the two strategies diverge, they agree on a starting move: pay the minimum on every debt, every month, without exception. Missing a minimum triggers late fees and can damage your credit score, which makes every remaining balance more expensive. The minimums are non-negotiable.",
          "What the methods argue about is the surplus, the amount you can pay above the combined minimums. That extra payment is the only lever that actually shrinks your debt faster, so where you aim it is the entire decision.",
        ],
      },
      {
        heading: "The avalanche: attack the highest rate first",
        paragraphs: [
          "The avalanche method tells you to throw every spare dollar at the debt with the highest interest rate, while paying minimums on the rest. Once that balance hits zero, you roll its payment into the next-highest rate, and so on down the line. The interest rate, not the balance size, decides the order.",
          "This is the mathematically optimal approach. High-rate debt grows fastest, so killing it first stops the most interest from accruing. A credit card at 24% does far more damage per month than a car loan at 6%, even if the car loan balance is larger. Over the life of the payoff, the avalanche almost always costs the least and finishes soonest, sometimes by months and hundreds of dollars.",
        ],
      },
      {
        heading: "The snowball: clear the smallest balance first",
        paragraphs: [
          "The snowball method ignores interest rates and orders debts by balance, smallest to largest. You pour the surplus into the smallest debt until it is gone, then move to the next smallest, regardless of rate. Each cleared balance frees up its minimum payment, which rolls into the next one, so the payment you are throwing grows like a snowball rolling downhill.",
          "On pure math, the snowball usually costs a little more than the avalanche, because you may be paying minimums on a high-rate card while you knock out a small low-rate loan first. The trade is deliberate: by retiring whole debts quickly, you get visible wins early. Fewer bills, fewer due dates, and a shrinking list of creditors. For many people that early sense of progress is what keeps them going.",
        ],
      },
      {
        heading: "A worked example",
        paragraphs: [
          "Say you have three debts: a $1,000 store card at 22%, a $4,000 credit card at 18%, and a $9,000 car loan at 7%. You can pay $400 a month above the minimums.",
          "Under the avalanche, you attack the 22% store card first, then the 18% card, then the 7% loan, so the two most expensive debts go first and you pay the least total interest. The snowball happens to start the same way here, because the smallest balance is also the highest rate. But flip the example, make the smallest debt the lowest-rate one, and the two methods split apart: the snowball clears that small balance for the morale boost while a pricier card keeps charging, trading some interest savings for an earlier feeling of progress.",
        ],
      },
      {
        heading: "How to choose the one you will finish",
        list: [
          "Choose the avalanche if you are motivated by numbers, have a wide gap between your highest and lowest rates, and trust yourself to stay the course without frequent wins.",
          "Choose the snowball if past attempts have stalled, if you need visible progress to stay disciplined, or if your debts are similar in rate so the math difference is small.",
          "Consider a hybrid: knock out one tiny balance first for the morale boost, then switch to strict avalanche order for everything else.",
          "Whichever you pick, automate the payments so the decision is made once, not relitigated every month when motivation dips.",
        ],
      },
      {
        heading: "The traps that undo either plan",
        paragraphs: [
          "Both methods fail the same way: new debt added while you pay off the old. Putting fresh charges on a card you are trying to clear resets your progress and is the single most common reason payoff plans stall. Pausing new borrowing matters more than the method you pick.",
          "The other trap is ignoring a balance transfer or refinance that could lower a rate outright. If a high-interest card can be moved to a lower-rate product, doing so shrinks the problem before either method even starts. Just watch transfer fees and the date any promotional rate expires, because a rate that jumps later can erase the saving.",
        ],
      },
      {
        heading: "Model it before you start",
        paragraphs: [
          "The fastest way to settle the avalanche-versus-snowball debate for your own debts is to run the numbers both ways. Enter each balance, its rate, and the extra amount you can pay, then compare the payoff date and total interest under each ordering. Seeing that the avalanche saves, for instance, two months and a few hundred dollars, against a snowball that clears your first debt sooner, turns an abstract argument into a concrete choice you can make with your eyes open.",
          "These projections are estimates, not guarantees, and they are not financial advice. But they make the trade-off visible, and the best payoff plan is almost always the one you will actually see through to zero.",
        ],
      },
    ],
  },

  {
    slug: "inflation-tax-on-idle-cash",
    title: "Inflation is a quiet tax on the cash you are not investing",
    description:
      "Money sitting in a low-interest account does not stay still; it loses purchasing power every year to inflation. Here is what inflation really does to a dollar, why a large cash pile can cost you, and how to think about real return rather than the number on your statement.",
    date: "2026-06-12",
    readingMinutes: 6,
    category: "Inflation & Saving",
    related: { name: "Inflation Calculator", href: "/calculators/finance/inflation-calculator" },
    body: [
      {
        paragraphs: [
          "A bank balance feels like the safest thing you own. The number does not fall, no statement ever shows a loss, and the money is there whenever you need it. That sense of safety is real in one way and an illusion in another. The dollar count holds steady, but what each dollar can buy quietly shrinks year after year.",
          "That shrinkage is inflation, and over a long stretch it behaves like a tax you never see on any bill. It takes nothing from the number in your account and everything from the value behind it. Understanding how that works changes how much cash you choose to hold and where you put the rest.",
        ],
      },
      {
        heading: "What inflation does to a single dollar",
        paragraphs: [
          "Inflation is the rate at which prices rise across the economy. When inflation runs at 3% a year, a basket of goods that costs $100 today costs $103 a year from now. The flip side is that your $100, if it did not grow, now buys what $97 used to. The money did not move; the goal post did.",
          "The effect compounds, which is what makes it easy to underestimate. At 3% annual inflation, prices roughly double in about 24 years. Money left untouched in a drawer or a near-zero account would lose half its purchasing power over that span, even though the dollar amount never changed. A long retirement or savings horizon turns a small annual rate into a large cumulative loss.",
        ],
      },
      {
        heading: "Why a big cash pile can cost you",
        paragraphs: [
          "Cash that earns less than the inflation rate loses real value every year it sits. If your savings account pays 1% while prices rise 3%, you are going backward by about 2% a year in what your money can actually buy, even as the statement balance ticks slightly upward. The gain is nominal; the loss is real.",
          "This is why holding far more cash than you need is not the conservative choice it appears to be. It feels safe because the number is stable, but stability of the number is not the same as stability of value. The larger the idle pile and the longer it sits, the more inflation quietly removes.",
        ],
      },
      {
        heading: "Real return is the number that matters",
        paragraphs: [
          "The figure on your statement is the nominal return: the raw interest or growth rate. The number that actually tells you whether you are getting richer is the real return, which is roughly the nominal return minus inflation. A savings account paying 4% during 3% inflation gives a real return near 1%. The same account during 6% inflation gives a real return of about negative 2%, a loss in everything but the headline.",
          "Once you start thinking in real terms, financial choices look different. A high-yield savings account that beats inflation is genuinely growing your money. One that trails inflation is shrinking it slowly, no matter how positive the advertised rate looks. The comparison that counts is always your rate against the inflation rate, not your rate against zero.",
        ],
      },
      {
        heading: "Where cash still belongs",
        paragraphs: [
          "None of this argues for holding no cash. An emergency fund, money for bills, and savings for anything you will spend in the next year or two should stay in cash precisely because you cannot afford a market dip to hit them right when you need the money. For short horizons, certainty of the number is exactly the point, and a small real loss is the price of that certainty.",
          "The problem is not cash itself; it is cash held far beyond its job. Money you will not touch for many years has time to ride out the ups and downs of investments that have historically outpaced inflation, so parking it in a near-zero account locks in the slow loss for no reason. The skill is matching the timeframe to the place: short-term money in cash, long-term money somewhere it can grow.",
        ],
      },
      {
        heading: "What to do about it",
        list: [
          "Keep an emergency fund and near-term spending in cash, ideally in a high-yield account that at least keeps pace with inflation.",
          "Move money you will not need for several years into investments with a long track record of beating inflation, accepting short-term swings as the cost of long-term growth.",
          "Compare any savings rate against the current inflation rate, not against zero, so you know whether you are gaining or losing in real terms.",
          "Revisit large cash balances periodically; a pile that made sense during a scary stretch may be quietly bleeding value once the emergency passes.",
        ],
      },
      {
        heading: "See it on your own numbers",
        paragraphs: [
          "The cleanest way to feel the effect is to project it forward. Take an amount you are holding in cash, pick an inflation rate, and look at what that money will buy in 5, 10, or 20 years if it does not grow. The drop is usually larger and faster than intuition expects, because compounding works against you here just as it works for you when you invest.",
          "These figures are estimates based on assumed rates, not predictions, and nothing here is financial advice. But seeing the future purchasing power of today's cash, side by side with the comfortable-looking balance, makes the quiet tax visible, and a tax you can see is one you can finally do something about.",
        ],
      },
    ],
  },
  {
    slug: "rent-vs-buy-the-math-that-decides-it",
    title: "Rent vs. buy: the math that actually decides it",
    description:
      "Buying a home is not automatically smarter than renting. The honest comparison weighs the full cost of owning, including the money you would have invested, against rent that rises over time. Here is how to run the numbers for your own situation.",
    date: "2026-06-13",
    readingMinutes: 7,
    category: "Housing",
    related: { name: "Rent vs. Buy Calculator", href: "/calculators/finance/rent-vs-buy-calculator" },
    body: [
      {
        paragraphs: [
          "Almost everyone has heard that renting is throwing money away. It is one of the most repeated pieces of financial advice, and it is also one of the least examined. Renting buys you a place to live and the freedom to move, while a large part of an early mortgage payment goes to interest, not ownership. Whether buying wins depends on numbers that vary widely by city, price, and how long you stay.",
          "The point of running the comparison is not to talk yourself into or out of a house. It is to replace a slogan with a decision you can defend, using your own rent, your own home price, and a realistic guess at how long you will stay put.",
        ],
      },
      {
        heading: "The costs of owning that the slogan ignores",
        paragraphs: [
          "A mortgage payment is the visible cost of owning, but it is far from the only one. Property tax, homeowners insurance, and maintenance are ongoing and never stop. Many buyers also pay private mortgage insurance until they build enough equity, plus closing costs to buy and agent fees to sell. Together these can add a few percent of the home's value every year, on top of the loan.",
          "There is also a cost that does not show up on any bill: the money tied up in your down payment and closing costs. Invested elsewhere, that lump sum could have grown. Economists call this the opportunity cost, and leaving it out is the single biggest reason the rent-versus-buy comparison gets distorted in favor of buying.",
        ],
      },
      {
        heading: "Why time horizon decides almost everything",
        paragraphs: [
          "The largest one-time costs of owning come at the start and the end: closing costs when you buy, and agent commissions plus fees when you sell. Spread those over two or three years and they are punishing. Spread them over ten years and they fade into the background.",
          "This is why the honest answer to 'should I buy?' usually starts with 'how long will you stay?' Below roughly five years, the transaction costs and early interest often make renting cheaper. Past seven or eight years, rising rents and slowly building equity tend to tip the balance toward owning. The exact crossover depends on your local prices, but the shape of the answer is almost always about time.",
        ],
      },
      {
        heading: "Rent does not stand still either",
        paragraphs: [
          "The case for renting weakens if you assume rent stays flat, and it almost never does. Over a long stay, rent typically rises with inflation or faster in tight markets, while a fixed-rate mortgage payment stays the same for decades. That widening gap is a real advantage of owning that a snapshot comparison misses.",
          "A fair comparison therefore grows rent over time and holds the mortgage payment fixed, while still charging the owner for tax, insurance, and upkeep that also rise. Done this way, neither side gets an unearned head start.",
        ],
      },
      {
        heading: "What a fair comparison looks like",
        list: [
          "Add up the full annual cost of owning: mortgage interest, property tax, insurance, maintenance, and any mortgage insurance, minus the small slice of payment that builds equity.",
          "Charge the owner the opportunity cost of the down payment and closing costs, as if that money had been invested instead.",
          "Grow rent each year at a realistic rate, rather than freezing it at today's figure.",
          "Account for the eventual selling costs, since most owners do sell, and those fees are large.",
          "Compare the two totals over the number of years you actually expect to stay, not over an idealized 30.",
        ],
      },
      {
        heading: "The factors that swing the result",
        paragraphs: [
          "Three inputs move the answer more than any others. The first is how long you stay, because it spreads the fixed transaction costs. The second is the gap between home prices and rents in your area; in expensive coastal cities, rent can be cheap relative to purchase prices, which favors renting. The third is what you assume the invested down payment would earn, since a higher return makes renting and investing more attractive.",
          "Home price growth matters too, but less than people expect, because a rising home also means higher property tax and a larger sum you could have invested. Treating appreciation as a guaranteed jackpot is how buyers overpay.",
        ],
      },
      {
        heading: "Run it on your own numbers",
        paragraphs: [
          "There is no universal winner between renting and buying, only a winner for your price, your rent, and your timeline. The most useful thing you can do is plug your real figures into a side-by-side calculation and see where the lines cross, then ask whether you truly expect to stay past that point.",
          "These projections rest on assumptions about rates, returns, and how long you stay, so treat them as estimates, not promises, and nothing here is financial advice. But running the full comparison, with the opportunity cost included and rent allowed to rise, turns a tired slogan into a number you can actually act on.",
        ],
      },
    ],
  },
  {
    slug: "roth-or-traditional-ira-which-first",
    title: "Roth or traditional IRA: which one deserves your money first",
    description:
      "The choice between a Roth and a traditional IRA comes down to one honest guess: whether your tax rate is higher now or in retirement. Here is how each account is taxed, who each one favors, and why many savers should hold both.",
    date: "2026-06-13",
    readingMinutes: 6,
    category: "Retirement",
    related: { name: "Roth vs. Traditional IRA Calculator", href: "/calculators/finance/roth-vs-traditional-ira" },
    body: [
      {
        paragraphs: [
          "An individual retirement account is one of the best deals an ordinary saver can get, but the first question always stops people: Roth or traditional? The accounts hold the same investments and share the same yearly limit. The only real difference is when you pay tax, and getting that timing right can change your retirement income by a meaningful amount.",
          "The good news is that the decision rests on a single comparison you can reason about, even if you cannot predict it perfectly. Once you see what that comparison is, the rest is detail.",
        ],
      },
      {
        heading: "How each account is taxed",
        paragraphs: [
          "A traditional IRA gives you a tax deduction now. You contribute pre-tax money, it grows untaxed, and you pay ordinary income tax on every dollar you withdraw in retirement. The benefit is up front; the bill comes later.",
          "A Roth IRA flips the timing. You contribute money you have already paid tax on, so there is no deduction today, but qualified withdrawals in retirement are completely tax-free, including all the growth. The benefit is at the end; the cost is now.",
        ],
      },
      {
        heading: "The one question that decides it",
        paragraphs: [
          "Strip away the detail and the choice is this: do you expect your tax rate to be higher today or in retirement? If your rate is higher now, the traditional deduction is worth more, so deferring tax wins. If your rate will be higher later, paying tax now at a Roth's lower rate wins.",
          "That is why a Roth often suits younger savers and people early in their careers, whose income and tax rate are likely to climb. A traditional IRA tends to suit high earners in their peak years who expect to drop into a lower bracket once they stop working.",
        ],
      },
      {
        heading: "Why a Roth's advantages go beyond the rate",
        list: [
          "Tax-free withdrawals make retirement income easier to plan, because what you see is what you keep.",
          "A Roth IRA has no required minimum distributions during your lifetime, so the money can keep growing untouched if you do not need it.",
          "You can withdraw your own contributions (not the earnings) at any time without tax or penalty, which adds flexibility in an emergency.",
          "Tax-free dollars are valuable for managing your bracket in retirement, letting you draw from Roth and traditional accounts in the mix that keeps your tax bill low.",
        ],
      },
      {
        heading: "Limits and eligibility to know",
        paragraphs: [
          "For 2025, you can contribute up to $7,000 across your IRAs, or $8,000 if you are 50 or older. That combined limit applies whether you choose Roth, traditional, or split between them. You also need earned income to contribute at all.",
          "Roth IRAs add an income ceiling: above certain limits, your ability to contribute directly phases out. Traditional IRA contributions are always allowed if you have earned income, though the deduction can be reduced if you or a spouse have a workplace plan and earn above set thresholds. These numbers change yearly, so confirm the current figures with the IRS before you contribute.",
        ],
      },
      {
        heading: "Why holding both can be the smartest move",
        paragraphs: [
          "Because no one knows their future tax rate for certain, splitting contributions between Roth and traditional is a hedge, not a cop-out. It gives you tax-free and taxable buckets to draw from in retirement, so you can adapt to whatever rates and rules exist then. This is sometimes called tax diversification, and it is genuinely useful.",
          "Many savers already have a large traditional balance through a workplace 401(k). For them, directing IRA contributions to a Roth builds the tax-free side that their retirement is missing, improving the balance between the two without any extra cost.",
        ],
      },
      {
        heading: "Put your own numbers to it",
        paragraphs: [
          "The cleanest way to choose is to compare the after-tax value of each account using your current tax rate and a realistic guess at your retirement rate. When the two rates are similar, the accounts end up close, and flexibility becomes the tiebreaker. When they differ, the math points clearly to one side.",
          "These outcomes depend on tax rates that can change and on assumptions about growth, so treat any projection as an estimate rather than a guarantee, and nothing here is tax or financial advice. Still, running the comparison turns an intimidating either-or into a clear, personal answer.",
        ],
      },
    ],
  },
  {
    slug: "uk-stamp-duty-2025-what-buyers-pay",
    title: "UK Stamp Duty in 2025: what buyers actually pay",
    description:
      "Stamp Duty Land Tax can add thousands to the cost of buying a home in England and Northern Ireland. Here is how the banded rates work after the April 2025 changes, what first-time buyers still save, and the surcharges that catch people out.",
    date: "2026-06-13",
    readingMinutes: 6,
    category: "UK Property",
    related: { name: "UK Stamp Duty Calculator", href: "/calc/uk-stamp-duty-calculator" },
    body: [
      {
        paragraphs: [
          "Stamp Duty Land Tax, usually just called stamp duty, is the tax you pay when you buy a property or land over a certain price in England and Northern Ireland. Scotland and Wales run their own separate systems. For most buyers it is one of the largest single costs of moving, and because it changed in April 2025, a lot of online guidance is now out of date.",
          "The tax often gets described as a flat percentage, which is wrong and usually makes it sound worse than it is. Stamp duty works in bands, like income tax, so understanding the structure can save you from nasty surprises and from overestimating the bill.",
        ],
      },
      {
        heading: "How the bands work",
        paragraphs: [
          "You do not pay one rate on the whole price. Instead, each slice of the price falls into a band with its own rate, and you pay that rate only on the part of the price within the band. A portion below the starting threshold is taxed at zero, the next slice at a low rate, and higher slices at progressively higher rates.",
          "Because of this, the headline rate for an expensive home overstates the real cost, since the lower slices are still taxed lightly or not at all. The effective rate, meaning the total tax as a share of the price, is always lower than the top band you reach.",
        ],
      },
      {
        heading: "What changed in April 2025",
        paragraphs: [
          "Temporary thresholds that had been in place reverted from 1 April 2025, which means the tax-free starting band is lower than it was, and more purchases now fall into the charge. In practice, buyers of mid-priced and higher homes are paying somewhat more stamp duty than they would have a year earlier.",
          "First-time buyer relief also tightened. First-time buyers still pay no stamp duty up to a set threshold and a reduced rate on a band above that, but both of those limits came down in April 2025. The relief remains valuable, just less generous than during the temporary period.",
        ],
      },
      {
        heading: "The surcharges that catch people out",
        list: [
          "An additional-property surcharge applies on top of the standard rates if you buy a second home or a buy-to-let while keeping another residence, and it can add a large amount to the bill.",
          "Non-UK residents pay a further surcharge on residential purchases, stacked on top of the standard and additional-property rates where they apply.",
          "If you buy a new home before selling your old one, you may pay the surcharge up front and reclaim it later, within a time limit, once the previous home is sold.",
          "First-time buyer relief is lost entirely if the price is above the upper limit, so a purchase just over the line can cost noticeably more than one just under it.",
        ],
      },
      {
        heading: "Who pays and when",
        paragraphs: [
          "Stamp duty is the buyer's responsibility, not the seller's. Your solicitor or conveyancer normally files the return and pays the tax on your behalf shortly after completion, and there is a strict deadline. Missing it brings penalties and interest, so this is not a bill to leave until later.",
          "Crucially, stamp duty is paid in cash on top of your deposit and cannot be added to most mortgages. That makes it essential to budget for it from the start, because it directly reduces the deposit you have available.",
        ],
      },
      {
        heading: "Work out your own figure",
        paragraphs: [
          "Because the tax is banded and depends on whether you are a first-time buyer, an additional-property purchaser, or a non-resident, the only reliable way to know your bill is to run your exact price through the current bands. Small changes in price near a threshold can move the total by a surprising amount.",
          "Rates and thresholds are set by the government and can change again, so treat any figure as an estimate and check the latest rules on GOV.UK before you commit; nothing here is tax or legal advice. But knowing roughly what stamp duty will cost, well before completion, keeps it from derailing your budget at the worst possible moment.",
        ],
      },
    ],
  },
  {
    slug: "canada-capital-gains-inclusion-rate-explained",
    title: "Canada's capital gains tax: how the inclusion rate really works",
    description:
      "Capital gains in Canada are not taxed like regular income. Only part of each gain is taxable, set by the inclusion rate, and after the 2024-25 reversal that rate stayed at one-half. Here is how it works and what it means when you sell.",
    date: "2026-06-13",
    readingMinutes: 6,
    category: "Canada Tax",
    related: { name: "Canada Capital Gains Tax Calculator", href: "/calc/ca-capital-gains-tax" },
    body: [
      {
        paragraphs: [
          "When you sell an investment in Canada for more than you paid, the profit is a capital gain, and it is taxed more gently than your salary. A common worry is that selling a winning stock or a cottage will hand half the profit to the government. The reality is milder, because Canada taxes only a portion of each gain, not the whole thing.",
          "The mechanism that decides how much is the inclusion rate, and it has been in the news. A proposed increase created real confusion in 2024 and 2025, so it is worth being clear about where things actually landed.",
        ],
      },
      {
        heading: "What the inclusion rate means",
        paragraphs: [
          "The inclusion rate is the share of your capital gain that gets added to your taxable income for the year. The rest is not taxed at all. At a one-half inclusion rate, if you realize a $10,000 gain, $5,000 is included in your income and the other $5,000 is tax-free.",
          "That included amount is then taxed at your ordinary marginal rate, the same rate that applies to your salary. So your actual tax on a gain depends on two things: the inclusion rate, which sets how much counts, and your tax bracket, which sets the rate on the part that counts.",
        ],
      },
      {
        heading: "Where the rate stands after the reversal",
        paragraphs: [
          "In 2024 the federal government proposed raising the inclusion rate to two-thirds on the portion of annual gains above $250,000 for individuals, and on most gains for corporations and many trusts. The plan caused months of uncertainty, was deferred, and was then cancelled, so the long-standing one-half inclusion rate remained in place.",
          "The practical takeaway is that, for the vast majority of individuals, half of each capital gain is taxable, as it has been for years. Because tax rules can change again, confirm the current rate with the Canada Revenue Agency before relying on it for a large sale.",
        ],
      },
      {
        heading: "Gains that are sheltered or exempt",
        list: [
          "Gains on your principal residence are generally exempt, so selling the home you actually live in usually triggers no capital gains tax.",
          "Investments held inside a TFSA grow and can be withdrawn completely tax-free, with no capital gains tax on the growth.",
          "Investments inside an RRSP are tax-deferred; you pay no capital gains tax inside the account, though withdrawals are later taxed as ordinary income.",
          "Capital losses can offset capital gains, reducing the taxable amount, and unused losses can often be carried back or forward to other years.",
        ],
      },
      {
        heading: "When the gain is counted",
        paragraphs: [
          "Capital gains tax is triggered when you realize the gain, which usually means you sell or are deemed to have disposed of the asset. Simply watching an investment rise in value creates no tax; the bill only arrives when you actually sell. This gives you some control over timing.",
          "That timing can matter. Because only realized gains count, spreading large sales across more than one tax year, or pairing a sale with realized losses, can keep more of the gain in lower brackets. These are general ideas, not a plan for any specific situation.",
        ],
      },
      {
        heading: "Estimate your own tax",
        paragraphs: [
          "To estimate the tax on a sale, take your gain, apply the inclusion rate to find the taxable portion, and then apply your marginal tax rate to that portion. The result is usually a good deal smaller than people fear, precisely because half the gain escapes tax entirely.",
          "Rates, brackets, and inclusion rules are set by government and can change, so treat any number as an estimate and verify the current rules with the CRA; nothing here is tax advice. Still, understanding the inclusion rate turns a vague dread of capital gains tax into a figure you can plan around before you sell.",
        ],
      },
    ],
  },
];

export function getPost(slug: string): BlogPost | undefined {
  return POSTS.find((p) => p.slug === slug);
}
