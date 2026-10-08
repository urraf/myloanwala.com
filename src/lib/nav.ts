// Menus + homepage product tiles (Paisabazaar-style). Icons live in /public/icons.

export type Tile = { label: string; sub?: string; href: string; icon: string; tag?: string };
export type MenuLink = { label: string; href: string };

export const NAV_MENUS: { label: string; links: MenuLink[] }[] = [
  {
    label: "Loans",
    links: [
      { label: "Personal Loan", href: "/personal-loan" },
      { label: "Business Loan", href: "/business-loan" },
      { label: "Home Loan", href: "/home-loan" },
      { label: "Loan Against Property", href: "/loan-against-property" },
      { label: "Gold Loan", href: "/gold-loan" },
      { label: "Car Loan", href: "/car-loan" },
      { label: "Apply for a Loan", href: "/apply" },
    ],
  },
  {
    label: "Interest Rates",
    links: [
      { label: "Personal Loan Interest Rates", href: "/personal-loan#rates" },
      { label: "Business Loan Interest Rates", href: "/business-loan#rates" },
      { label: "Home Loan Interest Rates", href: "/home-loan#rates" },
      { label: "Loan Against Property Rates", href: "/loan-against-property#rates" },
      { label: "Gold Loan Interest Rates", href: "/gold-loan#rates" },
      { label: "Car Loan Interest Rates", href: "/car-loan#rates" },
    ],
  },
  {
    label: "Calculators",
    links: [
      { label: "EMI Calculator", href: "/emi-calculator" },
      { label: "Personal Loan EMI Calculator", href: "/emi-calculator?type=personal-loan" },
      { label: "Business Loan EMI Calculator", href: "/emi-calculator?type=business-loan" },
      { label: "Home Loan EMI Calculator", href: "/emi-calculator?type=home-loan" },
      { label: "LAP EMI Calculator", href: "/emi-calculator?type=loan-against-property" },
      { label: "Gold Loan EMI Calculator", href: "/emi-calculator?type=gold-loan" },
      { label: "Car Loan EMI Calculator", href: "/emi-calculator?type=car-loan" },
    ],
  },
  {
    label: "Offers & Learn",
    links: [
      { label: "Best Loan Offers", href: "/offers" },
      { label: "Blog", href: "/blog" },
      { label: "Credit Score Tips", href: "/blog?category=Credit%20Score" },
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
      { label: "Personal Loan", href: "/personal-loan", icon: "money-bag", tag: "Lowest Rate" },
      { label: "Business Loan", href: "/business-loan", icon: "briefcase" },
      { label: "Home Loan", href: "/home-loan", icon: "house" },
      { label: "Loan Against Property", href: "/loan-against-property", icon: "office" },
      { label: "Gold Loan", href: "/gold-loan", icon: "coin", tag: "In 30 Mins" },
      { label: "Car Loan", href: "/car-loan", icon: "car" },
      { label: "Instant Personal Loan", href: "/personal-loan", icon: "bolt" },
      { label: "Home Loan Transfer", href: "/home-loan", icon: "house-garden" },
    ],
  },
  {
    title: "Calculators & Tools",
    tiles: [
      { label: "EMI Calculator", href: "/emi-calculator", icon: "abacus", tag: "Free" },
      { label: "Personal Loan EMI", href: "/emi-calculator?type=personal-loan", icon: "receipt" },
      { label: "Home Loan EMI", href: "/emi-calculator?type=home-loan", icon: "calendar" },
      { label: "Business Loan EMI", href: "/emi-calculator?type=business-loan", icon: "bar-chart" },
      { label: "Best Loan Offers", href: "/offers", icon: "label", tag: "New" },
      { label: "Check Eligibility", href: "/apply", icon: "check" },
      { label: "Finance Blog", href: "/blog", icon: "newspaper" },
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

export const HERO_SLIDES = [
  { title: "Get Personal Loan", highlight: "up to ₹50 Lakhs", point: "Interest rates starts @9.99%", href: "/personal-loan", icon: "money-wings", from: "#0b3b2c", to: "#11724f", btn: "#c9f5da" },
  { title: "Business Loan for", highlight: "MSMEs & Traders", point: "Collateral-free up to ₹2 Crore", href: "/business-loan", icon: "briefcase", from: "#14205a", to: "#2b46b8", btn: "#d6e2ff" },
  { title: "Home Loan at", highlight: "7.35%* onwards", point: "Tenure up to 30 years", href: "/home-loan", icon: "house", from: "#4a1d5c", to: "#8a3aa8", btn: "#f2dcff" },
  { title: "Gold Loan", highlight: "Cash in 30 Minutes", point: "Up to 75% of gold value", href: "/gold-loan", icon: "coin", from: "#5a3a06", to: "#a86f0c", btn: "#ffe9b8" },
];
