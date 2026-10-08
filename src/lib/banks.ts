// Lender logos shown on the homepage ("Our partners from across the industry").
// Files are in /public/banks. Remove any lender the business does not actually work with.
export type Bank = { name: string; logo: string; types: string[] };

export const BANK_FILTERS = ["Personal Loan", "Business Loan", "Home Loan", "Gold Loan", "Credit Card", "Credit Bureau"];

export const BANKS: Bank[] = [
  { name: "American Express", logo: "/banks/american_express.png", types: ["Credit Card"] },
  { name: "Axis Bank", logo: "/banks/axis_bank.png", types: ["Personal Loan", "Business Loan", "Home Loan", "Gold Loan", "Credit Card"] },
  { name: "CASHe", logo: "/banks/cash.png", types: ["Personal Loan"] },
  { name: "CIBIL", logo: "/banks/cibil.png", types: ["Credit Bureau"] },
  { name: "Clix Capital", logo: "/banks/clix.png", types: ["Personal Loan", "Business Loan"] },
  { name: "Credit Saison", logo: "/banks/credit_saison.png", types: ["Personal Loan"] },
  { name: "CRIF High Mark", logo: "/banks/crif.png", types: ["Credit Bureau"] },
  { name: "DMI Finance", logo: "/banks/dmi_finance.png", types: ["Personal Loan"] },
  { name: "EarlySalary", logo: "/banks/early_salary.png", types: ["Personal Loan"] },
  { name: "Equifax", logo: "/banks/equifax.png", types: ["Credit Bureau"] },
  { name: "Experian", logo: "/banks/experian.png", types: ["Credit Bureau"] },
  { name: "Federal Bank", logo: "/banks/federal_bank.png", types: ["Personal Loan", "Home Loan", "Gold Loan"] },
  { name: "FlexiLoans", logo: "/banks/flexloans.png", types: ["Personal Loan", "Business Loan"] },
  { name: "SMFG India Credit", logo: "/banks/smfg_india.png", types: ["Personal Loan", "Business Loan"] },
  { name: "HDB Financial Services", logo: "/banks/hdb.png", types: ["Personal Loan", "Business Loan", "Home Loan"] },
  { name: "HDFC Bank", logo: "/banks/hdfc.png", types: ["Personal Loan", "Business Loan", "Home Loan", "Gold Loan", "Credit Card"] },
  { name: "Home First Finance", logo: "/banks/home_first.png", types: ["Home Loan"] },
  { name: "ICICI Bank", logo: "/banks/icici.png", types: ["Personal Loan", "Business Loan", "Home Loan", "Gold Loan", "Credit Card"] },
  { name: "IDFC FIRST Bank", logo: "/banks/idfc.png", types: ["Personal Loan", "Business Loan", "Home Loan", "Credit Card"] },
  { name: "Indiabulls", logo: "/banks/indiabulls.png", types: ["Personal Loan"] },
  { name: "Indifi", logo: "/banks/indifi.png", types: ["Personal Loan", "Business Loan"] },
  { name: "IndusInd Bank", logo: "/banks/indusind_bank.png", types: ["Personal Loan", "Business Loan", "Gold Loan", "Credit Card"] },
  { name: "Kotak Mahindra Bank", logo: "/banks/kotak.png", types: ["Personal Loan", "Business Loan", "Gold Loan"] },
  { name: "KreditBee", logo: "/banks/kredit_bee.png", types: ["Personal Loan"] },
  { name: "L&T Finance", logo: "/banks/landt.png", types: ["Personal Loan", "Business Loan", "Home Loan"] },
  { name: "Lendingkart", logo: "/banks/lending_kart.png", types: ["Personal Loan", "Business Loan"] },
  { name: "Moneyview", logo: "/banks/money_view.png", types: ["Personal Loan"] },
  { name: "Muthoot Finance", logo: "/banks/muthoot_finance.png", types: ["Personal Loan", "Gold Loan"] },
  { name: "NeoGrowth", logo: "/banks/neogrowth.png", types: ["Personal Loan", "Business Loan"] },
  { name: "SBI", logo: "/banks/sbi.png", types: ["Home Loan", "Gold Loan"] },
  { name: "SBI Card", logo: "/banks/sbi_cards.png", types: ["Credit Card"] },
  { name: "SME Corner", logo: "/banks/sme_corner.png", types: ["Personal Loan", "Business Loan"] },
  { name: "Standard Chartered", logo: "/banks/standard_chartered.png", types: ["Personal Loan"] },
  { name: "Stashfin", logo: "/banks/stash_fin.png", types: ["Personal Loan"] },
  { name: "Tata Capital", logo: "/banks/tata_capital.png", types: ["Personal Loan", "Business Loan"] },
  { name: "RBL Bank", logo: "/banks/rbl_bank.png", types: ["Personal Loan", "Home Loan", "Credit Card"] },
  { name: "TVS Credit", logo: "/banks/tvs_credit.png", types: [] },
  { name: "UGRO Capital", logo: "/banks/ugro.png", types: ["Personal Loan", "Business Loan"] },
  { name: "YES Bank", logo: "/banks/yes_bank.png", types: ["Personal Loan", "Business Loan", "Credit Card"] },
  { name: "SBM Bank", logo: "/banks/sbm_bank.png", types: ["Credit Card"] },
  { name: "Piramal Finance", logo: "/banks/primal.png", types: ["Personal Loan"] },
  { name: "Hero FinCorp", logo: "/banks/hero_fincorp.png", types: ["Personal Loan", "Business Loan"] },
  { name: "Poonawalla Fincorp", logo: "/banks/poonawala_fincorp.png", types: ["Personal Loan", "Business Loan"] },
  { name: "Prefr", logo: "/banks/credit_vidya.png", types: ["Personal Loan"] },
  { name: "AU Small Finance Bank", logo: "/banks/au_bank.png", types: ["Credit Card"] },
  { name: "HSBC", logo: "/banks/hsbc_bank.png", types: ["Credit Card"] },
  { name: "Protium", logo: "/banks/protium.png", types: ["Personal Loan", "Business Loan"] },
  { name: "Easy Home Finance", logo: "/banks/bhfl.png", types: ["Home Loan"] },
  { name: "Bajaj Housing", logo: "/banks/ehfl.png", types: ["Home Loan"] },
  { name: "Shriram Finance", logo: "/banks/shriram_finance.png", types: ["Personal Loan", "Business Loan"] },
  { name: "InCred", logo: "/banks/incred.png", types: ["Personal Loan", "Business Loan"] },
  { name: "Muthoot FinCorp", logo: "/banks/muthoot_fincorp.png", types: ["Personal Loan", "Gold Loan"] },
  { name: "Tata Capital Housing", logo: "/banks/tata_housing_finance.png", types: ["Home Loan"] },
  { name: "Sammaan Capital", logo: "/banks/samman_capital.png", types: ["Home Loan"] },
  { name: "IDBI Bank", logo: "/banks/idbi_bank.png", types: ["Home Loan"] },
  { name: "Jio Credit", logo: "/banks/jio_housing_finance.png", types: ["Home Loan"] },
  { name: "Aditya Birla Capital", logo: "/banks/aditya_birla.png", types: ["Personal Loan", "Home Loan"] },
  { name: "Zype", logo: "/banks/zype.png", types: ["Personal Loan"] },
];

/** Finds a logo for a lender name typed in Admin → Offers (e.g. "HDFC Bank"). */
export function findBankLogo(lender: string) {
  const norm = (x: string) => x.toLowerCase().replace(/[^a-z0-9]/g, "");
  const n = norm(lender);
  if (!n) return undefined;
  const exact = BANKS.find((b) => norm(b.name) === n);
  if (exact) return exact.logo;
  // longest name first so "SBI Card" wins over "SBI"
  return [...BANKS]
    .sort((a, b) => b.name.length - a.name.length)
    .find((b) => n.startsWith(norm(b.name)) || norm(b.name).startsWith(n))?.logo;
}
