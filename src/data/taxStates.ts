// =========================================================================
// 미국 50개 주 + 워싱턴 D.C. 1099 프리랜서/자영업 주 소득세(State Income Tax) 데이터
// 및 주요 직종별(Uber, Real Estate, Developer 등) 평균 비즈니스 경비 공제 프리셋
// =========================================================================

export interface TaxStateInfo {
  slug: string;                // URL 슬러그 (예: 'california', 'texas')
  name: string;                // 주 영문명
  abbr: string;                // 주 2자리 약어
  hasStateIncomeTax: boolean;  // 주 소득세 부과 여부 (False면 0% 비과세 주)
  avgEffectiveTaxPct: number;  // 중간 소득($75k~$120k) 1099 자영업자 평균 실효 주 소득세율 (%)
  topMarginalTaxPct: number;   // 최고 한계 주 소득세율 (%)
  annualLlcFee: number;        // 1인 LLC 유지 시 주 정부 연간 최소 수수료/Franchise Tax ($)
  taxRuleNote: string;         // 주별 1099 세금 및 분기 예납 안내 설명 (영문 SEO 본문용)
}

export const TAX_STATES: TaxStateInfo[] = [
  { slug: 'alabama', name: 'Alabama', abbr: 'AL', hasStateIncomeTax: true, avgEffectiveTaxPct: 4.5, topMarginalTaxPct: 5.0, annualLlcFee: 100, taxRuleNote: 'Alabama taxes 1099 net business income at up to 5.0% and requires quarterly state estimated payments if state tax liability exceeds $500.' },
  { slug: 'alaska', name: 'Alaska', abbr: 'AK', hasStateIncomeTax: false, avgEffectiveTaxPct: 0.0, topMarginalTaxPct: 0.0, annualLlcFee: 100, taxRuleNote: 'Alaska has 0% state individual income tax, so 1099 contractors only pay federal income tax and the 15.3% IRS self-employment tax.' },
  { slug: 'arizona', name: 'Arizona', abbr: 'AZ', hasStateIncomeTax: true, avgEffectiveTaxPct: 2.5, topMarginalTaxPct: 2.5, annualLlcFee: 0, taxRuleNote: 'Arizona features a low 2.5% flat state income tax rate for 1099 freelancers and charges $0 annual LLC report fees.' },
  { slug: 'arkansas', name: 'Arkansas', abbr: 'AR', hasStateIncomeTax: true, avgEffectiveTaxPct: 3.9, topMarginalTaxPct: 4.4, annualLlcFee: 150, taxRuleNote: 'Arkansas taxes self-employed net income at graduated rates up to 4.4% and requires an annual $150 LLC franchise tax.' },
  { slug: 'california', name: 'California', abbr: 'CA', hasStateIncomeTax: true, avgEffectiveTaxPct: 6.8, topMarginalTaxPct: 13.3, annualLlcFee: 800, taxRuleNote: 'California imposes progressive state tax brackets up to 13.3% and a mandatory $800 minimum annual Franchise Tax Board (FTB) fee on LLCs.' },
  { slug: 'colorado', name: 'Colorado', abbr: 'CO', hasStateIncomeTax: true, avgEffectiveTaxPct: 4.4, topMarginalTaxPct: 4.4, annualLlcFee: 10, taxRuleNote: 'Colorado levies a flat 4.4% state income tax on federal taxable income, making 1099 quarterly tax calculations straightforward.' },
  { slug: 'connecticut', name: 'Connecticut', abbr: 'CT', hasStateIncomeTax: true, avgEffectiveTaxPct: 5.2, topMarginalTaxPct: 6.99, annualLlcFee: 80, taxRuleNote: 'Connecticut taxes 1099 contractor earnings at progressive rates from 2% to 6.99% with quarterly Form CT-1040ES filings.' },
  { slug: 'delaware', name: 'Delaware', abbr: 'DE', hasStateIncomeTax: true, avgEffectiveTaxPct: 5.4, topMarginalTaxPct: 6.6, annualLlcFee: 300, taxRuleNote: 'Delaware taxes resident 1099 income at up to 6.6% and charges a flat $300 annual LLC franchise tax.' },
  { slug: 'district-of-columbia', name: 'District of Columbia', abbr: 'DC', hasStateIncomeTax: true, avgEffectiveTaxPct: 6.5, topMarginalTaxPct: 10.75, annualLlcFee: 150, taxRuleNote: 'DC taxes self-employed individuals at progressive rates up to 10.75% and imposes an Unincorporated Business Franchise Tax on high-grossing businesses.' },
  { slug: 'florida', name: 'Florida', abbr: 'FL', hasStateIncomeTax: false, avgEffectiveTaxPct: 0.0, topMarginalTaxPct: 0.0, annualLlcFee: 139, taxRuleNote: 'Florida has 0% state personal income tax! Florida 1099 freelancers only pay federal income tax and 15.3% IRS self-employment tax.' },
  { slug: 'georgia', name: 'Georgia', abbr: 'GA', hasStateIncomeTax: true, avgEffectiveTaxPct: 5.39, topMarginalTaxPct: 5.39, annualLlcFee: 50, taxRuleNote: 'Georgia transitioned to a flat 5.39% state income tax rate on taxable 1099 business profits.' },
  { slug: 'hawaii', name: 'Hawaii', abbr: 'HI', hasStateIncomeTax: true, avgEffectiveTaxPct: 7.2, topMarginalTaxPct: 11.0, annualLlcFee: 15, taxRuleNote: 'Hawaii 1099 contractors face progressive state income taxes up to 11.0% plus Hawaii General Excise Tax (GET) of 4.0% to 4.5% on gross service receipts.' },
  { slug: 'idaho', name: 'Idaho', abbr: 'ID', hasStateIncomeTax: true, avgEffectiveTaxPct: 5.695, topMarginalTaxPct: 5.695, annualLlcFee: 0, taxRuleNote: 'Idaho taxes 1099 net income at a flat 5.695% rate after deductions and charges $0 for annual LLC reports.' },
  { slug: 'illinois', name: 'Illinois', abbr: 'IL', hasStateIncomeTax: true, avgEffectiveTaxPct: 4.95, topMarginalTaxPct: 4.95, annualLlcFee: 75, taxRuleNote: 'Illinois applies a flat 4.95% state income tax to net 1099 self-employment income.' },
  { slug: 'indiana', name: 'Indiana', abbr: 'IN', hasStateIncomeTax: true, avgEffectiveTaxPct: 3.05, topMarginalTaxPct: 3.05, annualLlcFee: 32, taxRuleNote: 'Indiana features a low 3.05% flat state income tax (plus county income tax averaging 1.7%).' },
  { slug: 'iowa', name: 'Iowa', abbr: 'IA', hasStateIncomeTax: true, avgEffectiveTaxPct: 3.8, topMarginalTaxPct: 3.8, annualLlcFee: 30, taxRuleNote: 'Iowa reformed its tax code to a flat 3.8% state income tax rate for all 1099 independent contractors.' },
  { slug: 'kansas', name: 'Kansas', abbr: 'KS', hasStateIncomeTax: true, avgEffectiveTaxPct: 5.2, topMarginalTaxPct: 5.58, annualLlcFee: 50, taxRuleNote: 'Kansas taxes 1099 earnings at progressive rates up to 5.58% with quarterly Form K-40ES estimated payments.' },
  { slug: 'kentucky', name: 'Kentucky', abbr: 'KY', hasStateIncomeTax: true, avgEffectiveTaxPct: 4.0, topMarginalTaxPct: 4.0, annualLlcFee: 15, taxRuleNote: 'Kentucky charges a flat 4.0% state income tax on net 1099 contractor income.' },
  { slug: 'louisiana', name: 'Louisiana', abbr: 'LA', hasStateIncomeTax: true, avgEffectiveTaxPct: 3.0, topMarginalTaxPct: 3.0, annualLlcFee: 35, taxRuleNote: 'Louisiana applies a flat 3.0% state individual income tax on net self-employment earnings.' },
  { slug: 'maine', name: 'Maine', abbr: 'ME', hasStateIncomeTax: true, avgEffectiveTaxPct: 6.2, topMarginalTaxPct: 7.15, annualLlcFee: 85, taxRuleNote: 'Maine taxes 1099 freelancers across three progressive brackets from 5.8% to 7.15%.' },
  { slug: 'maryland', name: 'Maryland', abbr: 'MD', hasStateIncomeTax: true, avgEffectiveTaxPct: 5.5, topMarginalTaxPct: 5.75, annualLlcFee: 300, taxRuleNote: 'Maryland imposes state income tax up to 5.75% plus county local income tax (2.25% to 3.20%) on 1099 net profit.' },
  { slug: 'massachusetts', name: 'Massachusetts', abbr: 'MA', hasStateIncomeTax: true, avgEffectiveTaxPct: 5.0, topMarginalTaxPct: 9.0, annualLlcFee: 500, taxRuleNote: 'Massachusetts levies a 5.0% flat state income tax on standard 1099 income (plus a 4% surtax on income over $1 million).' },
  { slug: 'michigan', name: 'Michigan', abbr: 'MI', hasStateIncomeTax: true, avgEffectiveTaxPct: 4.25, topMarginalTaxPct: 4.25, annualLlcFee: 25, taxRuleNote: 'Michigan charges a flat 4.25% state income tax on net self-employment profit.' },
  { slug: 'minnesota', name: 'Minnesota', abbr: 'MN', hasStateIncomeTax: true, avgEffectiveTaxPct: 6.4, topMarginalTaxPct: 9.85, annualLlcFee: 0, taxRuleNote: 'Minnesota taxes 1099 independent contractors at progressive rates from 5.35% to 9.85%, with $0 annual LLC renewal fee.' },
  { slug: 'mississippi', name: 'Mississippi', abbr: 'MS', hasStateIncomeTax: true, avgEffectiveTaxPct: 4.4, topMarginalTaxPct: 4.4, annualLlcFee: 0, taxRuleNote: 'Mississippi applies a flat 4.4% state income tax on taxable income above $10,000.' },
  { slug: 'missouri', name: 'Missouri', abbr: 'MO', hasStateIncomeTax: true, avgEffectiveTaxPct: 4.5, topMarginalTaxPct: 4.8, annualLlcFee: 0, taxRuleNote: 'Missouri taxes 1099 business income at rates up to 4.8% and requires $0 annual LLC report fees.' },
  { slug: 'montana', name: 'Montana', abbr: 'MT', hasStateIncomeTax: true, avgEffectiveTaxPct: 5.4, topMarginalTaxPct: 5.9, annualLlcFee: 20, taxRuleNote: 'Montana taxes self-employed net income at up to 5.9% based on federal taxable income.' },
  { slug: 'nebraska', name: 'Nebraska', abbr: 'NE', hasStateIncomeTax: true, avgEffectiveTaxPct: 5.0, topMarginalTaxPct: 5.2, annualLlcFee: 13, taxRuleNote: 'Nebraska continues reducing its top state income tax rate (5.2% for 2026) on 1099 freelancer earnings.' },
  { slug: 'nevada', name: 'Nevada', abbr: 'NV', hasStateIncomeTax: false, avgEffectiveTaxPct: 0.0, topMarginalTaxPct: 0.0, annualLlcFee: 350, taxRuleNote: 'Nevada has 0% state individual income tax, making it a top state for 1099 freelancers and independent contractors.' },
  { slug: 'new-hampshire', name: 'New Hampshire', abbr: 'NH', hasStateIncomeTax: false, avgEffectiveTaxPct: 0.0, topMarginalTaxPct: 0.0, annualLlcFee: 100, taxRuleNote: 'New Hampshire charges 0% individual wage/1099 income tax; high-earning businesses over $103,000 gross receipts may file Business Profits Tax.' },
  { slug: 'new-jersey', name: 'New Jersey', abbr: 'NJ', hasStateIncomeTax: true, avgEffectiveTaxPct: 5.8, topMarginalTaxPct: 10.75, annualLlcFee: 75, taxRuleNote: 'New Jersey taxes 1099 net business profit across progressive brackets from 1.4% to 10.75%.' },
  { slug: 'new-mexico', name: 'New Mexico', abbr: 'NM', hasStateIncomeTax: true, avgEffectiveTaxPct: 4.7, topMarginalTaxPct: 5.9, annualLlcFee: 0, taxRuleNote: 'New Mexico taxes 1099 income up to 5.9% and may also apply Gross Receipts Tax (GRT) to service businesses.' },
  { slug: 'new-york', name: 'New York', abbr: 'NY', hasStateIncomeTax: true, avgEffectiveTaxPct: 6.0, topMarginalTaxPct: 10.9, annualLlcFee: 25, taxRuleNote: 'New York taxes 1099 earnings at progressive rates from 4.0% to 10.9% (NYC residents also pay local NYC income tax).' },
  { slug: 'north-carolina', name: 'North Carolina', abbr: 'NC', hasStateIncomeTax: true, avgEffectiveTaxPct: 4.25, topMarginalTaxPct: 4.25, annualLlcFee: 200, taxRuleNote: 'North Carolina applies a low flat 4.25% state income tax rate on 1099 net earnings for 2026.' },
  { slug: 'north-dakota', name: 'North Dakota', abbr: 'ND', hasStateIncomeTax: true, avgEffectiveTaxPct: 1.95, topMarginalTaxPct: 2.5, annualLlcFee: 50, taxRuleNote: 'North Dakota offers one of the lowest state income taxes in the country (0% to 2.5%) for 1099 freelancers.' },
  { slug: 'ohio', name: 'Ohio', abbr: 'OH', hasStateIncomeTax: true, avgEffectiveTaxPct: 2.75, topMarginalTaxPct: 3.5, annualLlcFee: 0, taxRuleNote: 'Ohio exempts the first $250,000 of Schedule C / pass-through business income via the Ohio Business Income Deduction!' },
  { slug: 'oklahoma', name: 'Oklahoma', abbr: 'OK', hasStateIncomeTax: true, avgEffectiveTaxPct: 4.5, topMarginalTaxPct: 4.75, annualLlcFee: 25, taxRuleNote: 'Oklahoma taxes self-employed net income at rates up to 4.75%.' },
  { slug: 'oregon', name: 'Oregon', abbr: 'OR', hasStateIncomeTax: true, avgEffectiveTaxPct: 7.8, topMarginalTaxPct: 9.9, annualLlcFee: 100, taxRuleNote: 'Oregon has no sales tax but taxes 1099 independent contractor income at rates between 4.75% and 9.9%.' },
  { slug: 'pennsylvania', name: 'Pennsylvania', abbr: 'PA', hasStateIncomeTax: true, avgEffectiveTaxPct: 3.07, topMarginalTaxPct: 3.07, annualLlcFee: 70, taxRuleNote: 'Pennsylvania levies a low flat 3.07% state personal income tax on net 1099 business profits.' },
  { slug: 'rhode-island', name: 'Rhode Island', abbr: 'RI', hasStateIncomeTax: true, avgEffectiveTaxPct: 4.75, topMarginalTaxPct: 5.99, annualLlcFee: 50, taxRuleNote: 'Rhode Island taxes 1099 income across three brackets from 3.75% to 5.99%.' },
  { slug: 'south-carolina', name: 'South Carolina', abbr: 'SC', hasStateIncomeTax: true, avgEffectiveTaxPct: 5.0, topMarginalTaxPct: 6.2, annualLlcFee: 0, taxRuleNote: 'South Carolina taxes active 1099 trade or business income at a reduced flat cap or graduated rates up to 6.2%.' },
  { slug: 'south-dakota', name: 'South Dakota', abbr: 'SD', hasStateIncomeTax: false, avgEffectiveTaxPct: 0.0, topMarginalTaxPct: 0.0, annualLlcFee: 50, taxRuleNote: 'South Dakota has 0% state personal or corporate income tax for 1099 contractors.' },
  { slug: 'tennessee', name: 'Tennessee', abbr: 'TN', hasStateIncomeTax: false, avgEffectiveTaxPct: 0.0, topMarginalTaxPct: 0.0, annualLlcFee: 300, taxRuleNote: 'Tennessee has 0% state personal income tax on 1099 freelance earnings.' },
  { slug: 'texas', name: 'Texas', abbr: 'TX', hasStateIncomeTax: false, avgEffectiveTaxPct: 0.0, topMarginalTaxPct: 0.0, annualLlcFee: 0, taxRuleNote: 'Texas has 0% state personal income tax and exempts businesses under $2.47M revenue from Franchise Tax!' },
  { slug: 'utah', name: 'Utah', abbr: 'UT', hasStateIncomeTax: true, avgEffectiveTaxPct: 4.55, topMarginalTaxPct: 4.55, annualLlcFee: 18, taxRuleNote: 'Utah charges a flat 4.55% state income tax on net self-employment income.' },
  { slug: 'vermont', name: 'Vermont', abbr: 'VT', hasStateIncomeTax: true, avgEffectiveTaxPct: 6.0, topMarginalTaxPct: 8.75, annualLlcFee: 35, taxRuleNote: 'Vermont taxes 1099 contractor net profits at progressive rates from 3.35% to 8.75%.' },
  { slug: 'virginia', name: 'Virginia', abbr: 'VA', hasStateIncomeTax: true, avgEffectiveTaxPct: 5.4, topMarginalTaxPct: 5.75, annualLlcFee: 50, taxRuleNote: 'Virginia applies a 5.75% top marginal tax rate to all taxable 1099 income above $17,000.' },
  { slug: 'washington', name: 'Washington', abbr: 'WA', hasStateIncomeTax: false, avgEffectiveTaxPct: 0.0, topMarginalTaxPct: 0.0, annualLlcFee: 70, taxRuleNote: 'Washington has 0% state personal income tax on 1099 wages, though businesses over certain thresholds file B&O tax.' },
  { slug: 'west-virginia', name: 'West Virginia', abbr: 'WV', hasStateIncomeTax: true, avgEffectiveTaxPct: 4.5, topMarginalTaxPct: 5.12, annualLlcFee: 25, taxRuleNote: 'West Virginia taxes self-employed net income at reduced brackets up to 5.12%.' },
  { slug: 'wisconsin', name: 'Wisconsin', abbr: 'WI', hasStateIncomeTax: true, avgEffectiveTaxPct: 5.3, topMarginalTaxPct: 7.65, annualLlcFee: 25, taxRuleNote: 'Wisconsin taxes 1099 independent contractors across four brackets from 3.50% to 7.65%.' },
  { slug: 'wyoming', name: 'Wyoming', abbr: 'WY', hasStateIncomeTax: false, avgEffectiveTaxPct: 0.0, topMarginalTaxPct: 0.0, annualLlcFee: 60, taxRuleNote: 'Wyoming has 0% state personal or corporate income tax and low $60 annual LLC fees.' },
];

export function findTaxStateBySlug(slug: string): TaxStateInfo | undefined {
  return TAX_STATES.find((s) => s.slug === slug.toLowerCase());
}

// =========================================================================
// 미국 대표 1099 직종별 평균 연소득 및 주요 경비 공제(Write-Off) 프리셋
// =========================================================================
export interface ProfessionPreset {
  id: string;
  title: string;
  sampleGrossIncome: number;
  sampleAnnualMiles: number;
  sampleHomeOfficeSqFt: number;
  sampleOtherExpenses: number;
  topWriteOffs: string[];
}

export const PROFESSIONS_1099: ProfessionPreset[] = [
  {
    id: 'rideshare-delivery',
    title: 'Uber / DoorDash / Instacart Driver',
    sampleGrossIncome: 52000,
    sampleAnnualMiles: 24000,
    sampleHomeOfficeSqFt: 0,
    sampleOtherExpenses: 1800,
    topWriteOffs: [
      'IRS Standard Mileage ($0.70/mile)',
      'Cell phone & data plan (business %)',
      'Insulated delivery bags, dashcam & mounts',
      'Roadside assistance & tolls/parking',
    ],
  },
  {
    id: 'software-it',
    title: 'Software Developer / IT Consultant',
    sampleGrossIncome: 135000,
    sampleAnnualMiles: 1500,
    sampleHomeOfficeSqFt: 200,
    sampleOtherExpenses: 6500,
    topWriteOffs: [
      'Home Office Deduction ($5/sq ft up to 300 sq ft)',
      'MacBook/PC hardware, cloud servers & AI/SaaS subscriptions',
      'Self-employed health insurance premiums (100% deductible)',
      'Solo 401(k) / SEP IRA retirement contributions',
    ],
  },
  {
    id: 'real-estate-agent',
    title: 'Real Estate Agent / Realtor',
    sampleGrossIncome: 95000,
    sampleAnnualMiles: 14000,
    sampleHomeOfficeSqFt: 180,
    sampleOtherExpenses: 8500,
    topWriteOffs: [
      'Client showing mileage ($0.70/mile)',
      'MLS dues, brokerage desk fees & E&O insurance',
      'Real estate photography, staging & digital ads',
      'Home office & CRM software subscriptions',
    ],
  },
  {
    id: 'creator-youtuber',
    title: 'YouTuber / Content Creator / Influencer',
    sampleGrossIncome: 80000,
    sampleAnnualMiles: 3000,
    sampleHomeOfficeSqFt: 250,
    sampleOtherExpenses: 9200,
    topWriteOffs: [
      'Cameras, lighting, microphones & editing software',
      'Dedicated studio / home office space',
      'Video editor & thumbnail designer contractor fees',
      'Props, review items & production travel',
    ],
  },
];

