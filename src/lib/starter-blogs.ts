// Starter articles added automatically the first time the site runs with an empty blog.
// They are normal posts — edit or delete them from Admin → Blogs.
// Cover photos are CC0 (free for commercial use) from rawpixel.com, stored in /public/blog.

export type StarterBlog = {
  title: string;
  slug: string;
  category: string;
  excerpt: string;
  metaTitle: string;
  metaDescription: string;
  tags: string[];
  coverImage: string;
  imageAlt: string;
  daysAgo: number;
  content: string;
};

export const STARTER_BLOGS: StarterBlog[] = [
  {
    title: "How to Improve Your CIBIL Score Fast: 10 Proven Tips",
    slug: "how-to-improve-cibil-score-fast",
    category: "Credit Score",
    excerpt: "A higher CIBIL score means faster loan approvals and lower interest rates. Here are 10 practical steps to raise your score.",
    metaTitle: "How to Improve CIBIL Score Fast: 10 Proven Tips | MyLoanWala",
    metaDescription: "Want a 750+ CIBIL score? Learn 10 proven tips to improve your credit score fast — pay on time, cut card usage, fix report errors and get cheaper loans.",
    tags: ["improve cibil score", "credit score tips", "cibil score 750", "credit report", "loan approval"],
    coverImage: "/blog/credit-score.webp",
    imageAlt: "Person holding a credit card — tips to improve CIBIL score",
    daysAgo: 2,
    content: `Your **CIBIL score** is a 3-digit number between 300 and 900 that tells banks how responsibly you handle credit. Most lenders prefer a score of **750 or above** for quick approval and the best interest rates on personal loans, home loans and credit cards. The good news? You can improve your CIBIL score with a few disciplined habits.

## What is a good CIBIL score?

| CIBIL Score | Rating | What it means for loans |
|---|---|---|
| 750 – 900 | Excellent | Fast approval, lowest interest rates |
| 700 – 749 | Good | Approval likely, slightly higher rates |
| 650 – 699 | Fair | Limited options, higher rates |
| Below 650 | Poor | Approval is difficult |

## 10 tips to improve your CIBIL score

### 1. Pay every EMI and credit card bill on time
Payment history has the biggest impact on your score. Even one missed EMI can pull your score down. Set up **auto-debit** or reminders a few days before the due date.

### 2. Keep credit card utilisation below 30%
If your card limit is ₹1,00,000, try to keep your monthly spend under ₹30,000. High usage signals credit hunger to lenders.

### 3. Never pay only the "minimum amount due"
Paying only the minimum keeps your account open but interest keeps adding up, and your outstanding balance stays high.

### 4. Don't apply for many loans at once
Every loan or card application creates a **hard enquiry**. Several enquiries in a short time make you look desperate for credit. Compare offers first, then apply to one lender.

### 5. Keep a healthy mix of credit
A balance of secured loans (home, car, gold) and unsecured credit (personal loan, credit card) helps your score over time.

### 6. Don't close your oldest credit card
A long credit history works in your favour. Keep old cards active with small spends and pay them in full.

### 7. Check your credit report regularly
You can get a free credit report from each credit bureau once a year. Look for loans you never took, wrong late-payment entries or closed accounts still showing as active.

### 8. Raise disputes for errors
If you find a mistake, raise a dispute with the credit bureau online. Corrections usually reflect within 30 days.

### 9. Settle old dues properly — don't just "settle"
A loan marked "settled" instead of "closed" hurts your score. Wherever possible, pay the full amount and collect a **No Objection Certificate (NOC)**.

### 10. Be careful when you co-sign a loan
If the person you guaranteed misses payments, your score drops too.

## How long does it take to improve a CIBIL score?

Small improvements show in **30 – 60 days** once you start paying on time and reduce card usage. Moving from a poor score to 750+ usually takes **6 – 12 months** of consistent behaviour.

## Frequently Asked Questions

**Does checking my own CIBIL score reduce it?**
No. Checking your own score is a "soft enquiry" and has no impact.

**Can I get a loan with a 650 CIBIL score?**
Yes, some NBFCs offer loans at higher interest rates, or you can opt for a secured option like a gold loan.

Ready to put your improved score to work? **Compare personal loan offers from 30+ lenders on MyLoanWala** and get the lowest rate for your profile.`,
  },
  {
    title: "Personal Loan Eligibility: Salary, CIBIL Score & Documents Explained",
    slug: "personal-loan-eligibility-salary-cibil-documents",
    category: "Personal Loan",
    excerpt: "Find out the minimum salary, CIBIL score, age and documents you need to get a personal loan approved quickly.",
    metaTitle: "Personal Loan Eligibility: Salary, CIBIL & Documents",
    metaDescription: "Check personal loan eligibility in India — minimum salary, CIBIL score, age, work experience and documents needed. Tips to get approved faster.",
    tags: ["personal loan eligibility", "personal loan documents", "minimum salary for personal loan", "instant personal loan", "cibil score"],
    coverImage: "/blog/personal-loan.webp",
    imageAlt: "Bundle of Indian rupee notes — personal loan eligibility",
    daysAgo: 5,
    content: `A **personal loan** is an unsecured loan you can use for almost anything — a wedding, medical bills, travel, home renovation or paying off expensive debt. Since there is no collateral, banks look closely at your income and credit history. Here is everything you need to know about **personal loan eligibility** in India.

## Basic eligibility criteria

| Criteria | Salaried | Self-employed |
|---|---|---|
| Age | 21 – 60 years | 25 – 65 years |
| Minimum income | ₹15,000 – ₹25,000 per month | ITR showing ₹3 – 5 Lakh per year |
| Work experience | 1 year total, 6 months in current job | 2 – 3 years in business |
| CIBIL score | 700+ (750+ for best rates) | 700+ |

*Exact requirements vary by lender and city.*

## How much personal loan can I get?

Most lenders keep your total EMIs (including the new loan) within **50 – 60% of your net monthly income**. For example, if you earn ₹50,000 a month and have no other EMI, you may get a loan where the EMI is up to about ₹25,000 – ₹30,000. For a 5-year tenure at around 11% interest, that is roughly **₹11 – 13 Lakh**.

## Documents required

### For salaried applicants
- PAN card and Aadhaar card
- Last 3 months' salary slips
- Last 6 months' bank statement (salary account)
- Form 16 or latest ITR
- Passport-size photograph

### For self-employed applicants
- PAN, Aadhaar and business address proof
- ITR with computation of income for the last 2 years
- Last 12 months' bank statement
- GST registration or business proof

## 5 tips to improve your chances of approval

1. **Check your CIBIL score first** and fix any errors in your credit report.
2. **Close small loans** or credit card dues before applying to lower your EMI burden.
3. **Apply with a co-applicant** with stable income if your salary is on the lower side.
4. **Choose a longer tenure** to bring down the EMI and improve eligibility.
5. **Compare before you apply** — different lenders have different rules for the same profile.

## Frequently Asked Questions

**Can I get a personal loan with a ₹15,000 salary?**
Yes, some NBFCs and fintech lenders offer small personal loans at this income, usually at higher interest rates.

**How fast is a personal loan disbursed?**
With complete documents, many lenders disburse within 24 – 72 hours. Pre-approved customers can get money in minutes.

**Is a personal loan possible without salary slips?**
Some lenders accept bank statements and ITR instead, especially for self-employed applicants.

Want to know your exact eligibility? **Fill a 2-minute form on MyLoanWala** and our experts will share the best personal loan offers for your profile — free of cost.`,
  },
  {
    title: "Home Loan Tax Benefits 2026: Section 80C, 24(b) and More",
    slug: "home-loan-tax-benefits-section-80c-24b",
    category: "Home Loan",
    excerpt: "Your home loan can save you lakhs in tax. Understand deductions under Section 80C and 24(b), joint loan benefits and the new vs old tax regime.",
    metaTitle: "Home Loan Tax Benefits 2026: Sec 80C, 24(b) Explained",
    metaDescription: "Save tax on your home loan. Learn deductions under Section 80C (principal) and 24(b) (interest), joint home loan benefits and old vs new tax regime rules.",
    tags: ["home loan tax benefit", "section 24b", "section 80c home loan", "joint home loan tax", "new tax regime home loan"],
    coverImage: "/blog/home-loan.webp",
    imageAlt: "New house keys in hand — home loan tax benefits",
    daysAgo: 9,
    content: `Buying a home is one of the biggest financial decisions you will make — and a **home loan** comes with valuable tax benefits that reduce your overall cost. Here is a simple guide to the **home loan tax benefits** available to individuals in India.

## 1. Section 80C — deduction on principal repayment

The principal part of your EMI qualifies for a deduction of up to **₹1.5 Lakh per year** under Section 80C. Stamp duty and registration charges paid in the year of purchase can also be claimed within this limit.

**Note:** The ₹1.5 Lakh limit is shared with PPF, ELSS, life insurance premiums, EPF and other 80C investments.

## 2. Section 24(b) — deduction on interest paid

| Property type | Maximum interest deduction |
|---|---|
| Self-occupied house | Up to ₹2 Lakh per year |
| Let-out (rented) house | Full interest (loss set-off against other income capped at ₹2 Lakh per year) |

For an under-construction property, interest paid before possession can be claimed in **5 equal instalments** starting from the year construction is completed (within the overall limit).

## 3. Joint home loan — double the benefit

If you take a home loan jointly with your spouse and **both are co-owners and co-borrowers**, each of you can claim:

- Up to ₹1.5 Lakh under Section 80C, and
- Up to ₹2 Lakh under Section 24(b)

That means a couple can together claim up to **₹7 Lakh** in deductions every year.

## 4. Old tax regime vs new tax regime

- **Old regime:** You can claim Section 80C and Section 24(b) for a self-occupied home.
- **New regime:** Deductions under Section 80C and 24(b) for a **self-occupied** property are not allowed. Interest on a **let-out** property can still be deducted from rental income.

If your home loan interest and 80C investments are high, the old regime may save you more. Compare both before filing your return.

## Example

Ravi pays ₹2,40,000 interest and ₹1,10,000 principal in a year on a self-occupied home and is in the 30% tax bracket (old regime):

- Interest deduction: ₹2,00,000
- Principal deduction: ₹1,10,000
- **Tax saved: about ₹96,700** (including cess)

## Frequently Asked Questions

**Can I claim tax benefits on two home loans?**
Yes. You can claim interest on more than one house, but the ₹2 Lakh cap applies to the total for self-occupied properties.

**What if I sell the house within 5 years?**
The 80C deductions claimed earlier are reversed and added to your income in the year of sale.

*Tax rules can change every Budget — please confirm with a tax advisor before filing.*

Planning to buy a home? **Compare home loan rates from top banks on MyLoanWala** and lock in a lower EMI.`,
  },
  {
    title: "Business Loan for MSMEs: How to Get Approved Without Collateral",
    slug: "business-loan-for-msme-without-collateral",
    category: "Business Loan",
    excerpt: "Need working capital or funds to expand? Here's how small businesses can get a collateral-free business loan, plus documents and government schemes.",
    metaTitle: "MSME Business Loan Without Collateral: Complete Guide",
    metaDescription: "Get a collateral-free business loan for your MSME. Eligibility, documents, Mudra & CGTMSE schemes and tips to get your business loan approved faster.",
    tags: ["business loan without collateral", "msme loan", "mudra loan", "cgtmse scheme", "working capital loan"],
    coverImage: "/blog/business-loan.webp",
    imageAlt: "Open sign on a small shop door — MSME business loan",
    daysAgo: 13,
    content: `Small businesses are the backbone of India's economy, but getting funds on time can be a challenge. The good news is that many banks and NBFCs now offer **business loans without collateral** to MSMEs, traders, shop owners and professionals.

## Types of business loans

| Loan type | Best for | Typical amount |
|---|---|---|
| Working capital loan | Stock, salaries, daily expenses | ₹1 Lakh – ₹50 Lakh |
| Term loan | Expansion, new outlet, renovation | ₹5 Lakh – ₹2 Crore |
| Machinery / equipment loan | Buying machines or vehicles | Up to 90% of cost |
| Overdraft / credit line | Seasonal cash-flow gaps | Based on turnover |

## Eligibility for an unsecured business loan

- Business running for at least **2 – 3 years**
- Annual turnover of **₹10 Lakh or more** (varies by lender)
- Profitable for at least the last year, with **ITR filed for 2 years**
- Good **CIBIL score** of the business owner (700+)
- Steady bank transactions and GST returns

## Documents you'll need

- PAN and Aadhaar of the owner / partners / directors
- Business PAN, GST certificate or Udyam registration
- Last 12 months' business bank statements
- ITR with balance sheet and P&L for 2 years
- Business address proof (rent agreement, utility bill)

## Government schemes worth knowing

### Pradhan Mantri Mudra Yojana (PMMY)
Collateral-free loans for micro enterprises under categories like **Shishu, Kishore, Tarun** and **Tarun Plus**, for amounts going up to ₹20 Lakh, through banks, NBFCs and MFIs.

### CGTMSE
The Credit Guarantee Fund Trust for Micro and Small Enterprises provides a guarantee to lenders, so eligible MSMEs can get loans **without collateral or third-party guarantee**.

## 6 tips to get your business loan approved

1. Keep your **GST returns and ITR up to date**.
2. Route most sales through your **business bank account**.
3. Avoid cheque bounces — they hurt your profile.
4. Register on **Udyam** to access MSME benefits.
5. Borrow only what your cash flow can repay.
6. **Compare multiple lenders** — rates for the same profile can differ by several percent.

## Frequently Asked Questions

**Can a new business get a loan?**
Most lenders need 2 years of vintage. New businesses can try Mudra loans or a loan against property.

**What is the interest rate on business loans?**
Unsecured business loans usually start from around 14% per year and depend on turnover, profit and credit score.

Looking for funds to grow? **Apply on MyLoanWala** and get business loan offers from multiple banks and NBFCs in one place.`,
  },
  {
    title: "Gold Loan vs Personal Loan: Which Is Better for You?",
    slug: "gold-loan-vs-personal-loan",
    category: "Gold Loan",
    excerpt: "Need money urgently? Compare gold loans and personal loans on interest rate, speed, eligibility and risk to choose the right option.",
    metaTitle: "Gold Loan vs Personal Loan: Which Is Better in 2026?",
    metaDescription: "Gold loan or personal loan? Compare interest rates, approval speed, CIBIL needs, repayment options and risks to pick the best loan for urgent money.",
    tags: ["gold loan vs personal loan", "gold loan interest rate", "instant loan", "urgent money", "gold loan"],
    coverImage: "/blog/gold-loan.webp",
    imageAlt: "Traditional Indian gold jewellery — gold loan vs personal loan",
    daysAgo: 17,
    content: `When you need money urgently, two of the fastest options are a **gold loan** and a **personal loan**. Both can be approved quickly, but they work very differently. Let's compare them side by side so you can choose the right one.

## Gold loan vs personal loan at a glance

| Feature | Gold Loan | Personal Loan |
|---|---|---|
| Security | Your gold jewellery is pledged | No security needed |
| Interest rate | Usually lower | Usually higher |
| CIBIL score | Not very important | Very important (700+) |
| Income proof | Often not required | Required |
| Disbursal | 30 minutes – same day | 1 – 3 days (instant if pre-approved) |
| Loan amount | Up to 75% of gold value | Based on income, up to ₹40 – 50 Lakh |
| Tenure | 3 – 36 months | 1 – 7 years |
| Repayment | EMI, interest-only or bullet | Fixed monthly EMI |

## When a gold loan is better

- You have **gold jewellery** lying idle at home
- Your **CIBIL score is low** or you have no credit history
- You need money **within hours**
- You need a **short-term** loan and can repay in a few months
- You want **flexible repayment**, such as paying only interest monthly

## When a personal loan is better

- You **don't want to pledge** your family jewellery
- You need a **larger amount** than your gold can fetch
- You want a **longer tenure** with small, fixed EMIs
- You have a **good salary and CIBIL score**

## Risks to keep in mind

- **Gold loan:** If you fail to repay, the lender can **auction your gold** after giving notice. A fall in gold prices may also lead to a margin call.
- **Personal loan:** Missing EMIs damages your **CIBIL score** and attracts heavy penalties.

## Quick example

You need ₹2 Lakh for 12 months:

- **Gold loan:** Pledge gold worth about ₹2.7 Lakh, pay interest monthly and return the principal at the end.
- **Personal loan:** No pledge, but a fixed EMI of roughly ₹17,700 at 11% interest.

## Frequently Asked Questions

**Is a gold loan safe?**
Yes, when taken from a regulated bank or NBFC. Your gold is stored in insured vaults and returned once you repay.

**Does a gold loan affect my CIBIL score?**
Yes. Repaying on time improves your score, while defaults reduce it.

Still unsure? **Compare gold loan and personal loan offers on MyLoanWala** and our experts will help you choose the cheapest option.`,
  },
  {
    title: "How Is Loan EMI Calculated? Formula, Examples & Tips to Reduce EMI",
    slug: "how-loan-emi-is-calculated",
    category: "Personal Finance",
    excerpt: "Understand the EMI formula with simple examples and learn 6 smart ways to reduce your EMI and total interest.",
    metaTitle: "How Loan EMI Is Calculated: Formula & Examples",
    metaDescription: "Learn how loan EMI is calculated with the formula and easy examples. See how tenure and interest rate change your EMI, and 6 tips to reduce it.",
    tags: ["emi calculation formula", "loan emi calculator", "reduce emi", "home loan emi", "personal loan emi"],
    coverImage: "/blog/emi-calculator.webp",
    imageAlt: "Calculator on a desk — how loan EMI is calculated",
    daysAgo: 21,
    content: `EMI (Equated Monthly Instalment) is the fixed amount you pay every month to repay a loan. Each EMI has two parts — **interest** and **principal**. Knowing **how EMI is calculated** helps you choose the right loan amount and tenure.

## The EMI formula

**EMI = P × r × (1 + r)ⁿ / ((1 + r)ⁿ − 1)**

- **P** = Loan amount (principal)
- **r** = Monthly interest rate (annual rate ÷ 12 ÷ 100)
- **n** = Tenure in months

## Example

Loan of **₹5,00,000** at **11% per year** for **3 years**:

- r = 11 ÷ 12 ÷ 100 = 0.009167
- n = 36 months
- **EMI ≈ ₹16,369**
- Total payment ≈ ₹5,89,300, so **total interest ≈ ₹89,300**

## How tenure changes your EMI (₹5 Lakh at 11%)

| Tenure | Monthly EMI | Total Interest |
|---|---|---|
| 2 years | ₹23,304 | ₹59,300 |
| 3 years | ₹16,369 | ₹89,300 |
| 5 years | ₹10,871 | ₹1,52,300 |

A longer tenure means a **smaller EMI** but **more total interest**.

## How the interest rate changes your EMI (₹30 Lakh home loan, 20 years)

| Interest rate | Monthly EMI |
|---|---|
| 8.0% | ₹25,093 |
| 8.5% | ₹26,035 |
| 9.0% | ₹26,992 |

Even a **0.5% lower rate** saves you around ₹2.2 Lakh over 20 years.

## 6 smart ways to reduce your EMI

1. **Improve your CIBIL score** to qualify for lower interest rates.
2. **Make a bigger down payment** to borrow less.
3. **Choose a longer tenure** if monthly cash flow is tight.
4. **Prepay** whenever you get a bonus — it cuts the principal.
5. **Balance transfer** your loan to a lender with a lower rate.
6. **Compare lenders** before you sign — rates differ widely.

## Frequently Asked Questions

**Does EMI change during the loan?**
For fixed-rate loans, no. For floating-rate loans (like most home loans), the EMI or tenure changes when the lender revises its rate.

**Why is most of my early EMI going to interest?**
Interest is calculated on the outstanding balance, which is highest in the early months. As you repay, the principal share grows.

Skip the maths — **use the free EMI calculator on MyLoanWala** and see your EMI, total interest and repayment instantly.`,
  },
  {
    title: "Car Loan Guide: Interest Rates, Down Payment & Smart Buying Tips",
    slug: "car-loan-guide-interest-rates-down-payment",
    category: "Car Loan",
    excerpt: "Planning to buy a new or used car on loan? Learn about interest rates, ideal down payment, tenure and mistakes to avoid.",
    metaTitle: "Car Loan Guide 2026: Interest Rates & Down Payment Tips",
    metaDescription: "Everything about car loans in India — interest rates, how much down payment to make, ideal tenure, documents and tips to get the cheapest car loan.",
    tags: ["car loan", "car loan interest rate", "car loan down payment", "used car loan", "new car loan emi"],
    coverImage: "/blog/car-loan.webp",
    imageAlt: "Man holding new car keys — car loan guide",
    daysAgo: 26,
    content: `A **car loan** lets you drive home your dream car today and pay for it in easy monthly instalments. But a few smart choices — down payment, tenure and lender — can save you a lot of money. Here's a complete **car loan guide** for Indian buyers.

## New vs used car loan

| Feature | New Car Loan | Used Car Loan |
|---|---|---|
| Interest rate | Lower | Higher |
| Funding | Up to 90 – 100% of on-road price | Up to 70 – 80% of car value |
| Tenure | Up to 7 – 8 years | Up to 5 years |
| Car age limit | — | Usually under 8 – 10 years at loan end |

## How much down payment should you make?

Although some lenders offer 100% funding, a **down payment of 20%** is a smart rule. It:

- Lowers your EMI and total interest
- Improves approval chances
- Protects you if the car's value falls faster than the loan reduces

## The 20/4/10 rule

A simple guideline used by many financial planners:

- **20%** down payment
- **4 years** or less tenure
- **10%** of monthly income as the maximum for EMI and fuel

You may not always follow it exactly, but it keeps your car from straining your budget.

## Documents required

- PAN, Aadhaar and address proof
- Salary slips (3 months) or ITR (2 years)
- Bank statement for 6 months
- Car quotation / proforma invoice from the dealer

## Tips to get the cheapest car loan

1. **Compare banks and NBFCs** — don't just accept the dealer's financing.
2. **Check the processing fee and foreclosure charges**, not only the interest rate.
3. **Negotiate** — festive season offers often include lower rates or zero processing fee.
4. **Keep your CIBIL score above 750** for the best deals.
5. **Avoid very long tenures** — you'll pay much more interest on a depreciating asset.

## Frequently Asked Questions

**Can I prepay my car loan?**
Yes, though some lenders charge a foreclosure fee of 2 – 5%. Check the terms before signing.

**Is car insurance included in the loan?**
Some lenders finance the first-year insurance as part of the on-road price.

Ready to drive? **Compare car loan offers on MyLoanWala** and get approved in as little as 24 hours.`,
  },
  {
    title: "Top 7 Reasons Loan Applications Get Rejected (And How to Avoid Them)",
    slug: "reasons-loan-application-rejected",
    category: "Personal Loan",
    excerpt: "Got a loan rejection? Learn the 7 most common reasons banks reject loan applications and simple fixes to get approved next time.",
    metaTitle: "7 Reasons Your Loan Gets Rejected & How to Fix Them",
    metaDescription: "Loan application rejected? Discover the top 7 reasons — low CIBIL score, high EMIs, job changes, errors — and practical steps to get your loan approved.",
    tags: ["loan rejected", "loan application rejection reasons", "personal loan approval", "cibil score", "foir"],
    coverImage: "/blog/loan-documents.webp",
    imageAlt: "Man signing loan documents — reasons loan applications get rejected",
    daysAgo: 31,
    content: `A **loan rejection** is frustrating — and every rejection also adds an enquiry to your credit report. Understanding **why loan applications get rejected** helps you fix the problem before you apply again.

## 1. Low CIBIL score

Most banks want a score of **700 – 750+**. Late payments, defaults or high card usage pull your score down.

**Fix:** Pay all dues on time for a few months, reduce credit card usage below 30% and check your report for errors.

## 2. High existing EMIs (FOIR)

Lenders check your **Fixed Obligation to Income Ratio (FOIR)** — the share of your income already going to EMIs. If it's above **50 – 60%**, a new loan is risky.

**Fix:** Close small loans first, or apply for a lower amount or a longer tenure.

## 3. Too many applications in a short time

Applying to several lenders at once creates multiple **hard enquiries** and signals credit hunger.

**Fix:** Compare offers on one platform, then apply to the best-suited lender only.

## 4. Unstable job or business

Frequent job changes or a very new business make lenders nervous.

**Fix:** Wait until you complete at least 6 months in your current job, or 2 years in business.

## 5. Incomplete or mismatched documents

A different name spelling on PAN and Aadhaar, missing salary slips or unclear bank statements can lead to rejection.

**Fix:** Keep all KYC details consistent and submit complete, clear documents.

## 6. Employer or location not on the lender's list

Some lenders only lend to employees of listed companies or in certain cities.

**Fix:** Try another bank or NBFC with a wider policy — this is where comparing helps.

## 7. Errors in your credit report

A loan you already closed may still show as active, or someone else's default may appear on your report.

**Fix:** Download your credit report and raise a dispute with the credit bureau.

## Quick checklist before you apply

| Check | Ideal |
|---|---|
| CIBIL score | 750+ |
| Existing EMIs | Below 40 – 50% of income |
| Job stability | 6+ months in current job |
| Documents | Complete & consistent |
| Recent applications | None in last 3 months |

## Frequently Asked Questions

**How soon can I re-apply after a rejection?**
Wait at least 3 – 6 months and fix the reason for rejection first.

**Will a rejection reduce my CIBIL score?**
The rejection itself isn't reported, but the enquiry is — and multiple enquiries lower your score.

Avoid rejections altogether — **check your eligibility with MyLoanWala's experts** and apply only where your approval chances are highest.`,
  },
];
