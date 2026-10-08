// Loan products shown on the website. Edit text / rates here.
export type Product = {
  slug: string;
  name: string;
  short: string;
  icon: IconName;
  rate: string;
  maxAmount: string;
  tenure: string;
  heroTitle: string;
  heroPoints: string[];
  quickFacts: [string, string][];
  features: { title: string; desc: string }[];
  eligibility: string[];
  documents: string[];
  fees: [string, string][];
  faqs: { q: string; a: string }[];
  emi: { amount: number; rate: number; years: number; maxAmount: number; maxYears: number };
};

export type IconName =
  | "personal"
  | "business"
  | "home"
  | "property"
  | "gold"
  | "car"
  | "calculator"
  | "offer"
  | "partner"
  | "blog";

const commonSteps = [
  "Fill a short form with your name, mobile number and loan requirement.",
  "Our loan expert calls you and compares offers from multiple banks & NBFCs.",
  "Choose the best offer and submit documents online.",
  "Get approval and money credited directly to your bank account.",
];
export const HOW_IT_WORKS = commonSteps;

export const PRODUCTS: Product[] = [
  {
    slug: "personal-loan",
    name: "Personal Loan",
    short: "Instant funds for any need",
    icon: "personal",
    rate: "9.99%",
    maxAmount: "₹50 Lakh",
    tenure: "1 – 7 years",
    heroTitle: "Apply for a Personal Loan up to ₹50 Lakh at 9.99%* p.a.",
    heroPoints: [
      "Compare offers from 30+ banks & NBFCs",
      "Instant approval, disbursal in as fast as 24 hours",
      "No collateral, minimal documentation",
    ],
    quickFacts: [
      ["Interest Rate", "9.99% – 24% p.a."],
      ["Loan Amount", "₹50,000 – ₹50 Lakh"],
      ["Tenure", "12 – 84 months"],
      ["Processing Fee", "Up to 3% of loan amount"],
      ["Minimum CIBIL Score", "700+ preferred"],
      ["Disbursal Time", "24 – 72 hours"],
    ],
    features: [
      { title: "No Collateral", desc: "Unsecured loan — no need to pledge property or gold." },
      { title: "Use for Anything", desc: "Wedding, travel, medical, education or debt consolidation." },
      { title: "Flexible Tenure", desc: "Repay comfortably in 1 to 7 years." },
      { title: "Quick Disbursal", desc: "Money in your account within 24–72 hours of approval." },
    ],
    eligibility: [
      "Age between 21 and 60 years",
      "Salaried with minimum net monthly income of ₹15,000, or self-employed with stable income",
      "Minimum 1 year total work experience",
      "CIBIL score of 700 or above preferred",
      "Indian resident",
    ],
    documents: [
      "PAN Card and Aadhaar Card",
      "Last 3 months salary slips (salaried)",
      "Last 6 months bank statement",
      "Form 16 / ITR for last 2 years (self-employed)",
      "Passport size photograph",
    ],
    fees: [
      ["Processing Fee", "0.5% – 3% of loan amount"],
      ["Prepayment / Foreclosure", "0% – 5% of outstanding principal"],
      ["Late EMI Payment", "2% – 3% per month on overdue amount"],
      ["Cheque / ECS Bounce", "₹400 – ₹600 per instance"],
    ],
    faqs: [
      { q: "What is the minimum CIBIL score required for a personal loan?", a: "Most lenders prefer a CIBIL score of 700 or above. Some NBFCs may approve loans for lower scores at a higher interest rate." },
      { q: "How fast can I get a personal loan?", a: "With complete documents, many lenders approve and disburse within 24 to 72 hours. Pre-approved customers can get funds even faster." },
      { q: "Can I get a personal loan if I am self-employed?", a: "Yes. Self-employed individuals with a stable business income and ITR for the last 2 years can apply." },
      { q: "Can I prepay my personal loan?", a: "Yes, most lenders allow part-prepayment or foreclosure after a lock-in period, sometimes with a small charge." },
    ],
    emi: { amount: 500000, rate: 11, years: 3, maxAmount: 5000000, maxYears: 7 },
  },
  {
    slug: "business-loan",
    name: "Business Loan",
    short: "Grow your business faster",
    icon: "business",
    rate: "14%",
    maxAmount: "₹2 Crore",
    tenure: "1 – 5 years",
    heroTitle: "Get a Business Loan up to ₹2 Crore without collateral",
    heroPoints: [
      "Loans for MSMEs, traders, professionals & startups",
      "Collateral-free options available",
      "Quick approval with simple documentation",
    ],
    quickFacts: [
      ["Interest Rate", "14% – 30% p.a."],
      ["Loan Amount", "₹1 Lakh – ₹2 Crore"],
      ["Tenure", "12 – 60 months"],
      ["Processing Fee", "Up to 3% of loan amount"],
      ["Business Vintage", "Minimum 2 years"],
      ["Collateral", "Not required for most offers"],
    ],
    features: [
      { title: "Working Capital", desc: "Manage inventory, salaries and day-to-day expenses." },
      { title: "Business Expansion", desc: "Open new outlets, buy machinery or upgrade technology." },
      { title: "Govt. Schemes", desc: "Guidance on Mudra, CGTMSE and PMEGP loans." },
      { title: "Flexible Repayment", desc: "Choose EMI tenure that matches your cash flow." },
    ],
    eligibility: [
      "Age between 24 and 65 years",
      "Business operational for at least 2 years",
      "Annual turnover of ₹10 Lakh or more",
      "ITR filed for the last 2 years",
      "Good credit history of business and promoters",
    ],
    documents: [
      "PAN & Aadhaar of applicant / promoters",
      "Business PAN, GST registration certificate",
      "Last 12 months bank statement",
      "ITR with computation of income for 2 years",
      "Business address proof",
    ],
    fees: [
      ["Processing Fee", "1% – 3% of loan amount"],
      ["Prepayment / Foreclosure", "2% – 5% of outstanding principal"],
      ["Late EMI Payment", "2% per month on overdue amount"],
      ["Documentation Charges", "₹1,000 – ₹5,000"],
    ],
    faqs: [
      { q: "Do I need collateral for a business loan?", a: "No. Most business loans offered through our partners are unsecured. Larger amounts may require security." },
      { q: "Can a new business get a loan?", a: "Lenders usually need 2 years of business vintage. Startups can explore government schemes like Mudra loans." },
      { q: "How is my business loan eligibility decided?", a: "Lenders check your business turnover, profitability, bank statements, GST returns and credit score." },
    ],
    emi: { amount: 1000000, rate: 16, years: 3, maxAmount: 20000000, maxYears: 5 },
  },
  {
    slug: "home-loan",
    name: "Home Loan",
    short: "Buy your dream home",
    icon: "home",
    rate: "7.35%",
    maxAmount: "₹10 Crore",
    tenure: "Up to 30 years",
    heroTitle: "Home Loan at 7.35%* p.a. with tenure up to 30 years",
    heroPoints: [
      "Compare home loan rates from top banks & HFCs",
      "Balance transfer & top-up options available",
      "Tax benefits up to ₹3.5 Lakh per year",
    ],
    quickFacts: [
      ["Interest Rate", "7.35% – 12% p.a."],
      ["Loan Amount", "Up to 90% of property value"],
      ["Tenure", "Up to 30 years"],
      ["Processing Fee", "0.25% – 1% of loan amount"],
      ["Tax Benefits", "Sec 80C & Sec 24(b)"],
      ["Prepayment Charges", "Nil on floating rate loans"],
    ],
    features: [
      { title: "Lowest Rates", desc: "Secured loan with some of the lowest interest rates." },
      { title: "Long Tenure", desc: "Small EMIs with repayment up to 30 years." },
      { title: "Balance Transfer", desc: "Move your existing home loan to a lower rate." },
      { title: "Tax Savings", desc: "Save tax on both principal and interest repayment." },
    ],
    eligibility: [
      "Age between 21 and 65 years (at loan maturity)",
      "Salaried or self-employed with stable income",
      "CIBIL score of 750 or above for best rates",
      "Property with clear legal title",
    ],
    documents: [
      "PAN, Aadhaar and address proof",
      "Salary slips / ITR for last 2–3 years",
      "Last 6 months bank statement",
      "Property documents — sale agreement, title deed, approved plan",
    ],
    fees: [
      ["Processing Fee", "0.25% – 1% of loan amount"],
      ["Prepayment (floating rate)", "Nil"],
      ["Legal & Technical Charges", "As per actuals"],
      ["Late EMI Payment", "1% – 2% per month on overdue amount"],
    ],
    faqs: [
      { q: "How much home loan can I get?", a: "Banks finance up to 75–90% of the property value depending on the loan amount, and your EMI should generally be within 50–60% of your monthly income." },
      { q: "What is a home loan balance transfer?", a: "It means moving your existing home loan to another lender offering a lower interest rate, reducing your EMI or tenure." },
      { q: "Are there tax benefits on a home loan?", a: "Yes. You can claim up to ₹1.5 Lakh on principal under Sec 80C and up to ₹2 Lakh on interest under Sec 24(b) under the old tax regime." },
    ],
    emi: { amount: 3000000, rate: 8.5, years: 20, maxAmount: 50000000, maxYears: 30 },
  },
  {
    slug: "loan-against-property",
    name: "Loan Against Property",
    short: "Unlock your property's value",
    icon: "property",
    rate: "8.75%",
    maxAmount: "₹10 Crore",
    tenure: "Up to 20 years",
    heroTitle: "Loan Against Property at 8.75%* p.a. — get high loan value",
    heroPoints: [
      "Up to 70% of your property's market value",
      "Residential & commercial property accepted",
      "Lower interest rate than unsecured loans",
    ],
    quickFacts: [
      ["Interest Rate", "8.75% – 15% p.a."],
      ["Loan Amount", "Up to 70% of property value"],
      ["Tenure", "Up to 20 years"],
      ["Processing Fee", "0.5% – 2% of loan amount"],
      ["Property Type", "Residential, commercial, industrial"],
      ["End Use", "Business, education, wedding, medical & more"],
    ],
    features: [
      { title: "High Loan Amount", desc: "Get large funds based on your property value." },
      { title: "Lower Interest", desc: "Secured loan means lower rates than personal loans." },
      { title: "Keep Using Property", desc: "Continue to live in or rent out your property." },
      { title: "Long Tenure", desc: "Repay comfortably in up to 20 years." },
    ],
    eligibility: [
      "Age between 25 and 70 years (at loan maturity)",
      "Salaried or self-employed with regular income",
      "Self-owned property with clear title",
      "Good credit score (700+)",
    ],
    documents: [
      "KYC documents — PAN, Aadhaar",
      "Income proof — salary slips / ITR",
      "Last 6–12 months bank statement",
      "Complete property chain documents",
    ],
    fees: [
      ["Processing Fee", "0.5% – 2% of loan amount"],
      ["Prepayment (floating rate)", "Nil for individuals"],
      ["Legal & Valuation Charges", "As per actuals"],
      ["Late EMI Payment", "2% per month on overdue amount"],
    ],
    faqs: [
      { q: "How much loan can I get against my property?", a: "Typically 50% to 70% of the current market value of the property, depending on the lender and property type." },
      { q: "Can I get a loan against a property that is jointly owned?", a: "Yes, but all co-owners need to be co-applicants on the loan." },
    ],
    emi: { amount: 2500000, rate: 9.5, years: 15, maxAmount: 50000000, maxYears: 20 },
  },
  {
    slug: "gold-loan",
    name: "Gold Loan",
    short: "Instant cash against gold",
    icon: "gold",
    rate: "8.5%",
    maxAmount: "₹1 Crore",
    tenure: "3 – 36 months",
    heroTitle: "Gold Loan at 8.5%* p.a. — instant cash in 30 minutes",
    heroPoints: [
      "Up to 75% of your gold's value",
      "No CIBIL score required",
      "Gold kept safe in insured vaults",
    ],
    quickFacts: [
      ["Interest Rate", "8.5% – 26% p.a."],
      ["Loan to Value", "Up to 75% of gold value"],
      ["Tenure", "3 – 36 months"],
      ["Processing Fee", "0% – 1% of loan amount"],
      ["CIBIL Score", "Not mandatory"],
      ["Disbursal Time", "Within 30 minutes"],
    ],
    features: [
      { title: "Instant Cash", desc: "Quick valuation and same-day disbursal." },
      { title: "No Credit Check", desc: "Your gold is the security — CIBIL not mandatory." },
      { title: "Flexible Repayment", desc: "Pay interest monthly and principal at the end (bullet)." },
      { title: "Safe & Insured", desc: "Gold stored in secure, insured vaults." },
    ],
    eligibility: [
      "Age 18 years and above",
      "Owner of gold jewellery of 18–22 carat purity",
      "Valid KYC documents",
    ],
    documents: ["PAN Card", "Aadhaar Card / Address proof", "Passport size photograph"],
    fees: [
      ["Processing Fee", "0% – 1% of loan amount"],
      ["Valuation Charges", "Nil – ₹500"],
      ["Prepayment", "Nil with most lenders"],
      ["Late Payment", "As per lender policy"],
    ],
    faqs: [
      { q: "How is my gold valued?", a: "Lenders check the purity and weight of your jewellery and apply the current gold rate. Stones are not counted." },
      { q: "What happens if I don't repay my gold loan?", a: "The lender may auction the gold after sending notices. Always repay on time or renew the loan." },
    ],
    emi: { amount: 200000, rate: 10, years: 1, maxAmount: 10000000, maxYears: 3 },
  },
  {
    slug: "car-loan",
    name: "Car Loan",
    short: "Drive home your new car",
    icon: "car",
    rate: "8.75%",
    maxAmount: "100% on-road price",
    tenure: "1 – 8 years",
    heroTitle: "Car Loan at 8.75%* p.a. with up to 100% on-road funding",
    heroPoints: [
      "New & used car loans",
      "Up to 100% on-road price financing",
      "Quick approval at your dealership",
    ],
    quickFacts: [
      ["Interest Rate", "8.75% – 16% p.a."],
      ["Loan Amount", "Up to 100% of on-road price"],
      ["Tenure", "12 – 96 months"],
      ["Processing Fee", "Up to 2% of loan amount"],
      ["Used Car Loan", "Available"],
      ["Minimum CIBIL Score", "700+ preferred"],
    ],
    features: [
      { title: "High Funding", desc: "Finance up to 100% of on-road price on select models." },
      { title: "New & Used Cars", desc: "Loans available for both new and pre-owned cars." },
      { title: "Long Tenure", desc: "Lower EMIs with tenure up to 8 years." },
      { title: "Fast Processing", desc: "Approval in as little as 24 hours." },
    ],
    eligibility: [
      "Age between 21 and 65 years",
      "Minimum annual income of ₹3 Lakh",
      "Salaried or self-employed",
      "Good credit score (700+)",
    ],
    documents: [
      "PAN, Aadhaar and address proof",
      "Salary slips / ITR",
      "Last 6 months bank statement",
      "Car quotation / proforma invoice",
    ],
    fees: [
      ["Processing Fee", "Up to 2% of loan amount"],
      ["Foreclosure", "Up to 5% of outstanding principal"],
      ["Late EMI Payment", "2% per month on overdue amount"],
    ],
    faqs: [
      { q: "Can I get a car loan for a used car?", a: "Yes, many banks and NBFCs offer used car loans, usually for cars up to 8–10 years old at the end of tenure." },
      { q: "Is a down payment required?", a: "Some lenders offer 100% on-road funding for select models; otherwise a 10–20% down payment is common." },
    ],
    emi: { amount: 800000, rate: 9, years: 5, maxAmount: 5000000, maxYears: 8 },
  },
];

export const getProduct = (slug: string) => PRODUCTS.find((p) => p.slug === slug);
export const LOAN_TYPES = PRODUCTS.map((p) => p.name);
