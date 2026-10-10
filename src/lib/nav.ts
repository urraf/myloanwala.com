// Menus + homepage product tiles (Paisabazaar-style). Icons live in /public/icons.

export type Tile = { label: string; sub?: string; href: string; icon: string; tag?: string };
export type MenuLink = { label: string; href: string };

export const NAV_MENUS: { label: string; links: MenuLink[] }[] = [
  {
    label: "Credit Score",
    links: [
      { label: "Free CIBIL Score Check", href: "/credit-score" },
      { label: "How to Improve CIBIL Score", href: "/blog/how-to-improve-cibil-score-fast" },
      { label: "CIBIL Score for Home Loan", href: "/credit-score#home-loan" },
      { label: "Credit Score Tips", href: "/blog?category=Credit%20Score" },
    ],
  },
  {
    label: "Loans",
    links: [
      { label: "Home Loan", href: "/home-loan" },
      { label: "Loan Against Property", href: "/loan-against-property" },
      { label: "Home Loan Balance Transfer", href: "/home-loan#rates" },
      { label: "Personal Loan", href: "/personal-loan" },
      { label: "Business Loan", href: "/business-loan" },
      { label: "Gold Loan", href: "/gold-loan" },
      { label: "Car Loan", href: "/car-loan" },
      { label: "Apply for a Loan", href: "/apply" },
    ],
  },
  {
    label: "Interest Rates",
    links: [
      { label: "Home Loan Interest Rates", href: "/home-loan#rates" },
      { label: "Loan Against Property Rates", href: "/loan-against-property#rates" },
      { label: "Personal Loan Interest Rates", href: "/personal-loan#rates" },
      { label: "Business Loan Interest Rates", href: "/business-loan#rates" },
      { label: "Gold Loan Interest Rates", href: "/gold-loan#rates" },
      { label: "Car Loan Interest Rates", href: "/car-loan#rates" },
    ],
  },
  {
    label: "Calculators",
    links: [
      { label: "Home Loan EMI Calculator", href: "/emi-calculator?type=home-loan" },
      { label: "LAP EMI Calculator", href: "/emi-calculator?type=loan-against-property" },
      { label: "Personal Loan EMI Calculator", href: "/emi-calculator?type=personal-loan" },
      { label: "Business Loan EMI Calculator", href: "/emi-calculator?type=business-loan" },
      { label: "Gold Loan EMI Calculator", href: "/emi-calculator?type=gold-loan" },
      { label: "Car Loan EMI Calculator", href: "/emi-calculator?type=car-loan" },
    ],
  },
  {
    label: "Learn",
    links: [
      { label: "Best Loan Offers", href: "/offers" },
      { label: "Blog", href: "/blog" },
      { label: "Home Loan Guides", href: "/blog?category=Home%20Loan" },
      { label: "Personal Finance", href: "/blog?category=Personal%20Finance" },
    ],
  },
  {
    label: "Partners",
    links: [
      { label: "Become a DSA Partner", href: "/partner?tab=register" },
      { label: "NBFC / Lender Partnership", href: "/partner?tab=register" },
      { label: "Partner Login", href: "/partner" },
    ],
  },
];

export const TILE_SECTIONS: { title: string; tiles: Tile[] }[] = [
  {
    title: "Loans",
    tiles: [
      { label: "Home Loan", href: "/home-loan", icon: "house", tag: "Lowest Rate" },
      { label: "Loan Against Property", href: "/loan-against-property", icon: "office", tag: "High Value" },
      { label: "Home Loan Transfer", href: "/home-loan#rates", icon: "house-garden" },
      { label: "Personal Loan", href: "/personal-loan", icon: "money-bag" },
      { label: "Business Loan", href: "/business-loan", icon: "briefcase" },
      { label: "Gold Loan", href: "/gold-loan", icon: "coin" },
      { label: "Car Loan", href: "/car-loan", icon: "car" },
      { label: "Apply Online", href: "/apply", icon: "bolt" },
    ],
  },
  {
    title: "Credit Score & Calculators",
    tiles: [
      { label: "CIBIL Score Check", href: "/credit-score", icon: "chart-up", tag: "FREE" },
      { label: "Home Loan EMI", href: "/emi-calculator?type=home-loan", icon: "calendar" },
      { label: "LAP EMI", href: "/emi-calculator?type=loan-against-property", icon: "abacus" },
      { label: "Personal Loan EMI", href: "/emi-calculator?type=personal-loan", icon: "receipt" },
      { label: "Best Loan Offers", href: "/offers", icon: "label", tag: "New" },
      { label: "Check Eligibility", href: "/apply", icon: "check" },
      { label: "Home Loan Guides", href: "/blog?category=Home%20Loan", icon: "newspaper" },
      { label: "Explore More", href: "/offers", icon: "sparkles" },
    ],
  },
  {
    title: "Partner With Us",
    tiles: [
      { label: "Become a DSA", sub: "Earn on every loan", href: "/partner?tab=register", icon: "handshake", tag: "Earn More" },
      { label: "NBFC Partner", sub: "Get quality leads", href: "/partner?tab=register", icon: "bank" },
      { label: "Partner Login", href: "/partner", icon: "key" },
      { label: "Talk to Expert", href: "/contact", icon: "headphone" },
      { label: "Apply Online", sub: "In 2 minutes", href: "/apply", icon: "mobile" },
      { label: "Loan Guides", href: "/blog", icon: "bulb" },
      { label: "About Us", href: "/about", icon: "classical" },
      { label: "Contact Us", href: "/contact", icon: "phone" },
    ],
  },
];

// Hero slider — real photos on the right, brand gradient on the left. Home Loan & LAP first (core products).
export const HERO_SLIDES = [
  { title: "Home Loan at", highlight: "7.35%* onwards", point: "Up to 90% funding · tenure up to 30 years", href: "/home-loan", image: "/hero/home-loan.webp", from: "#0b3b2c", to: "#11724f", btn: "#c9f5da" },
  { title: "Loan Against Property", highlight: "up to ₹10 Crore", point: "Residential & commercial property · from 8.75%*", href: "/loan-against-property", image: "/hero/property.webp", from: "#14205a", to: "#2b46b8", btn: "#d6e2ff" },
  { title: "Check your CIBIL Score", highlight: "absolutely FREE", point: "Know your home loan eligibility instantly", href: "/credit-score", cta: "Check Now", image: "/blog/credit-score.webp", from: "#4a1d5c", to: "#8a3aa8", btn: "#f2dcff" },
  { title: "Get Personal Loan", highlight: "up to ₹50 Lakhs", point: "Interest rates starts @9.99%*", href: "/personal-loan", image: "/blog/personal-loan.webp", from: "#5a3a06", to: "#a86f0c", btn: "#ffe9b8" },
  { title: "Business Loan for", highlight: "MSMEs & Traders", point: "Collateral-free up to ₹2 Crore", href: "/business-loan", image: "/hero/business.jpg", from: "#0c3a5a", to: "#1c78b0", btn: "#d3ecff" },
];
