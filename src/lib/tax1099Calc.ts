// =========================================================================
// 미국 1099 프리랜서 / 자영업 세금(Schedule C + Schedule SE) 및
// IRS 분기별 예납 세금(Form 1040-ES Quarterly Estimated Tax) 계산 엔진
// =========================================================================

export type FilingStatus = 'single' | 'married' | 'head_of_household';

export const IRS_MILEAGE_RATE_2026 = 0.70; // 2026 IRS 표준 비즈니스 마일리지 공제 단가 ($0.70 / mile)
export const SS_WAGE_BASE_2026 = 176100;   // Social Security 12.4% 과세 상한선 ($)

export interface Tax1099Input {
  gross1099Income: number;        // 연간 총 1099 수입 (Schedule C Gross Receipts, $)
  w2WagesIncome: number;          // 본업/겸업 W-2 급여 소득이 있는 경우 합산 ($ - SS 상한 및 세율 구간 반영)
  businessMiles: number;          // 연간 업무용 주행 마일리지 (miles)
  homeOfficeSqFt: number;         // 홈오피스 전용 면적 (최대 300 sq ft, $5/sq ft 간편법)
  healthInsurancePaid: number;    // 자영업자 건강보험료 연간 납부액 ($)
  retirementContribution: number; // Solo 401(k) / SEP IRA 연간 납입액 ($)
  otherBusinessExpenses: number;  // 장비, 소프트웨어, 광고비 등 기타 비즈니스 경비 ($)
  filingStatus: FilingStatus;     // 세금 신고 유형 (Single, Married, Head of Household)
  stateTaxPct: number;            // 선택한 주의 실효 소득세율 (%)
  applyQbiDeduction: boolean;     // 20% 적격 사업소득 공제(QBI / Section 199A) 적용 여부
}

export interface QuarterlyDeadline {
  quarter: string;
  periodCovered: string;
  dueDate: string;
  federalPayment: number;
  statePayment: number;
  totalQuarterlyPayment: number;
}

export interface Tax1099Result {
  mileageDeduction: number;        // 마일리지 공제액 ($)
  homeOfficeDeduction: number;     // 홈오피스 공제액 ($)
  totalScheduleCDeductions: number;// Schedule C 총 사업 경비 공제액 ($)
  netBusinessProfit: number;       // 순수 사업 이익 (Net Profit, $)
  seTaxableEarnings: number;       // 자영업세 과세 표준 (순이익의 92.35%)
  socialSecurityTax: number;       // 12.4% 사회보장세 ($)
  medicareTax: number;             // 2.9% 메디케어세 (+ 고소득 0.9% 추가세, $)
  selfEmploymentTaxTotal: number;  // 총 자영업세 (15.3% SE Tax, $)
  halfSeTaxDeduction: number;      // 소득공제되는 자영업세의 50% ($)
  standardDeduction: number;       // 2026 연방 표준공제액 ($)
  qbiDeduction: number;            // 20% QBI (Section 199A) 사업소득 공제액 ($)
  federalTaxableIncome: number;    // 연방 소득세 과세표준 ($)
  federalIncomeTax: number;        // 연방 소득세 ($)
  stateIncomeTax: number;          // 주 소득세 ($)
  totalTaxLiability: number;       // 총 납부 세금 (자영업세 + 연방세 + 주세, $)
  effectiveTotalTaxRatePct: number;// 순수익 대비 총 실효 세율 (%)
  netTakeHomeAfterTax: number;     // 세후 순수령액 ($)
  recommendedTaxSavingsPct: number;// 매달 입금 시 떼어놓아야 할 권장 세금 저축 비율 (%)
  equivalentW2Salary: number;      // 동일한 실수령액을 받기 위해 필요한 W-2 직장인 연봉 환산액 ($)
  quarterlySchedule: QuarterlyDeadline[]; // 4분기 예납 스케줄
}

// 2026 연방 표준공제액 (Standard Deduction)
const STANDARD_DEDUCTION_2026: Record<FilingStatus, number> = {
  single: 15000,
  married: 30000,
  head_of_household: 22500,
};

// 2026 연방 소득세 누진 과세 구간 (Federal Tax Brackets)
const FEDERAL_BRACKETS_2026: Record<FilingStatus, Array<{ max: number; rate: number }>> = {
  single: [
    { max: 11925, rate: 0.10 },
    { max: 48475, rate: 0.12 },
    { max: 103350, rate: 0.22 },
    { max: 197300, rate: 0.24 },
    { max: 250525, rate: 0.32 },
    { max: 626350, rate: 0.35 },
    { max: Infinity, rate: 0.37 },
  ],
  married: [
    { max: 23850, rate: 0.10 },
    { max: 96950, rate: 0.12 },
    { max: 206700, rate: 0.22 },
    { max: 394600, rate: 0.24 },
    { max: 501050, rate: 0.32 },
    { max: 751600, rate: 0.35 },
    { max: Infinity, rate: 0.37 },
  ],
  head_of_household: [
    { max: 17000, rate: 0.10 },
    { max: 64850, rate: 0.12 },
    { max: 103350, rate: 0.22 },
    { max: 197300, rate: 0.24 },
    { max: 250500, rate: 0.32 },
    { max: 626350, rate: 0.35 },
    { max: Infinity, rate: 0.37 },
  ],
};

function computeProgressiveFederalTax(taxableIncome: number, status: FilingStatus): number {
  if (taxableIncome <= 0) return 0;
  const brackets = FEDERAL_BRACKETS_2026[status];
  let tax = 0;
  let prevMax = 0;

  for (const b of brackets) {
    if (taxableIncome <= prevMax) break;
    const taxableInBracket = Math.min(taxableIncome, b.max) - prevMax;
    tax += taxableInBracket * b.rate;
    prevMax = b.max;
  }
  return tax;
}

export function calculate1099Taxes(input: Tax1099Input): Tax1099Result {
  const gross = Math.max(0, input.gross1099Income);
  const w2 = Math.max(0, input.w2WagesIncome);
  const miles = Math.max(0, input.businessMiles);
  const sqFt = Math.min(300, Math.max(0, input.homeOfficeSqFt)); // IRS Simplified Home Office max 300 sq ft
  const healthIns = Math.max(0, input.healthInsurancePaid);
  const retirement = Math.max(0, input.retirementContribution);
  const otherExp = Math.max(0, input.otherBusinessExpenses);

  // 1. Schedule C 비즈니스 비용 공제 합산
  const mileageDeduction = miles * IRS_MILEAGE_RATE_2026;
  const homeOfficeDeduction = sqFt * 5; // $5 per sq ft up to $1,500
  const totalScheduleCDeductions = mileageDeduction + homeOfficeDeduction + otherExp;

  // 2. 순수 1099 사업 이익 (Schedule C Net Profit)
  const netBusinessProfit = Math.max(0, gross - totalScheduleCDeductions);

  // 3. 자영업세 (Self-Employment Tax: 92.35% 과세 표준에 12.4% SS + 2.9% Medicare 부과)
  const seTaxableEarnings = netBusinessProfit * 0.9235;
  const remainingSsCap = Math.max(0, SS_WAGE_BASE_2026 - w2);
  const ssTaxable = Math.min(seTaxableEarnings, remainingSsCap);
  const socialSecurityTax = ssTaxable * 0.124;

  const baseMedicareTax = seTaxableEarnings * 0.029;
  const addlMedicareThreshold = input.filingStatus === 'married' ? 250000 : 200000;
  const excessMedicareBase = Math.max(0, seTaxableEarnings + w2 - addlMedicareThreshold);
  const additionalMedicareTax = Math.min(seTaxableEarnings, excessMedicareBase) * 0.009;
  const medicareTax = baseMedicareTax + additionalMedicareTax;

  const selfEmploymentTaxTotal = socialSecurityTax + medicareTax;
  const halfSeTaxDeduction = selfEmploymentTaxTotal * 0.5;

  // 4. 조정 총소득(AGI) 및 연방 과세표준 계산
  const adjustedGrossIncome = Math.max(
    0,
    netBusinessProfit + w2 - halfSeTaxDeduction - healthIns - retirement
  );

  const standardDeduction = STANDARD_DEDUCTION_2026[input.filingStatus];
  const incomeAfterStdDeduction = Math.max(0, adjustedGrossIncome - standardDeduction);

  // 20% QBI (Section 199A) 적격 사업소득 공제 계산
  const qbiBase = Math.max(
    0,
    netBusinessProfit - halfSeTaxDeduction - healthIns - retirement
  );
  const qbiDeduction = input.applyQbiDeduction
    ? Math.min(qbiBase * 0.2, incomeAfterStdDeduction * 0.2)
    : 0;

  const federalTaxableIncome = Math.max(0, incomeAfterStdDeduction - qbiDeduction);

  // W-2 소득이 있는 경우 한계 세율 구간을 반영하여 1099 귀속 연방 소득세 산출
  const totalFedTax = computeProgressiveFederalTax(federalTaxableIncome, input.filingStatus);
  const w2OnlyTaxable = Math.max(0, w2 - standardDeduction);
  const w2FedTax = w2 > 0 ? computeProgressiveFederalTax(w2OnlyTaxable, input.filingStatus) : 0;
  const federalIncomeTax = Math.max(0, totalFedTax - w2FedTax);

  // 5. 주 소득세 (State Income Tax)
  const stateTaxableBase = Math.max(0, netBusinessProfit - halfSeTaxDeduction - retirement);
  const stateIncomeTax = stateTaxableBase * (Math.max(0, input.stateTaxPct) / 100);

  // 6. 총 세금 및 세후 실수령액
  const totalTaxLiability = selfEmploymentTaxTotal + federalIncomeTax + stateIncomeTax;
  const effectiveTotalTaxRatePct =
    netBusinessProfit > 0 ? (totalTaxLiability / netBusinessProfit) * 100 : 0;
  const netTakeHomeAfterTax = Math.max(
    0,
    netBusinessProfit - totalTaxLiability - healthIns - retirement
  );
  const recommendedTaxSavingsPct = Math.min(
    50,
    Math.max(15, Math.ceil(effectiveTotalTaxRatePct))
  );

  // 1099 자영업자가 부담하는 고용주 몫 FICA(7.65%)와 무급휴가/보험을 감안한 W-2 환산 연봉
  const equivalentW2Salary = Math.max(0, netBusinessProfit - halfSeTaxDeduction);

  // 7. IRS 4분기 예납 스케줄 (Form 1040-ES)
  const qFed = federalIncomeTax + selfEmploymentTaxTotal;
  const qState = stateIncomeTax;
  const quarterlySchedule: QuarterlyDeadline[] = [
    {
      quarter: 'Q1 Payment',
      periodCovered: 'Jan 1 – Mar 31',
      dueDate: 'April 15, 2026',
      federalPayment: qFed / 4,
      statePayment: qState / 4,
      totalQuarterlyPayment: (qFed + qState) / 4,
    },
    {
      quarter: 'Q2 Payment',
      periodCovered: 'Apr 1 – May 31',
      dueDate: 'June 15, 2026',
      federalPayment: qFed / 4,
      statePayment: qState / 4,
      totalQuarterlyPayment: (qFed + qState) / 4,
    },
    {
      quarter: 'Q3 Payment',
      periodCovered: 'Jun 1 – Aug 31',
      dueDate: 'September 15, 2026',
      federalPayment: qFed / 4,
      statePayment: qState / 4,
      totalQuarterlyPayment: (qFed + qState) / 4,
    },
    {
      quarter: 'Q4 Payment',
      periodCovered: 'Sep 1 – Dec 31',
      dueDate: 'January 15, 2027',
      federalPayment: qFed / 4,
      statePayment: qState / 4,
      totalQuarterlyPayment: (qFed + qState) / 4,
    },
  ];

  return {
    mileageDeduction,
    homeOfficeDeduction,
    totalScheduleCDeductions,
    netBusinessProfit,
    seTaxableEarnings,
    socialSecurityTax,
    medicareTax,
    selfEmploymentTaxTotal,
    halfSeTaxDeduction,
    standardDeduction,
    qbiDeduction,
    federalTaxableIncome,
    federalIncomeTax,
    stateIncomeTax,
    totalTaxLiability,
    effectiveTotalTaxRatePct,
    netTakeHomeAfterTax,
    recommendedTaxSavingsPct,
    equivalentW2Salary,
    quarterlySchedule,
  };
}

