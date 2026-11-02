import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { TAX_STATES, TaxStateInfo, PROFESSIONS_1099 } from '../data/taxStates';
import {
  calculate1099Taxes,
  FilingStatus,
  IRS_MILEAGE_RATE_2026,
} from '../lib/tax1099Calc';
import { save1099TaxEstimate } from '../lib/supabase';

// =========================================================================
// 미국 1099 프리랜서 / 자영업 세금 & 분기별 예납(Form 1040-ES) 메인 계산기
// - 15.3% 자영업세(SE Tax), 20% QBI 공제, 마일리지/홈오피스 경비 공제,
//   51개 주별 소득세 및 4분기 납부 마감일별 예납 금액을 즉시 계산합니다.
// =========================================================================

interface Tax1099CalculatorProps {
  initialState?: TaxStateInfo;
  initialGrossIncome?: number;
}

const usd = (n: number) => '$' + Math.round(n).toLocaleString('en-US');

export default function Tax1099Calculator({
  initialState,
  initialGrossIncome = 85000,
}: Tax1099CalculatorProps) {
  const defaultState =
    initialState || TAX_STATES.find((s) => s.slug === 'california') || TAX_STATES[0];

  const [selectedStateSlug, setSelectedStateSlug] = useState<string>(defaultState.slug);
  const [filingStatus, setFilingStatus] = useState<FilingStatus>('single');
  const [gross1099Income, setGross1099Income] = useState<number>(initialGrossIncome);
  const [w2WagesIncome, setW2WagesIncome] = useState<number>(0);
  const [businessMiles, setBusinessMiles] = useState<number>(8000);
  const [homeOfficeSqFt, setHomeOfficeSqFt] = useState<number>(150);
  const [otherBusinessExpenses, setOtherBusinessExpenses] = useState<number>(4500);
  const [healthInsurancePaid, setHealthInsurancePaid] = useState<number>(3600);
  const [retirementContribution, setRetirementContribution] = useState<number>(0);
  const [stateTaxPct, setStateTaxPct] = useState<number>(defaultState.avgEffectiveTaxPct);
  const [applyQbiDeduction, setApplyQbiDeduction] = useState<boolean>(true);

  const [scenarioNote, setScenarioNote] = useState<string>('');
  const [saveMessage, setSaveMessage] = useState<string>('');
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const currentStateInfo = useMemo(
    () => TAX_STATES.find((s) => s.slug === selectedStateSlug) || defaultState,
    [selectedStateSlug, defaultState]
  );

  const handleStateChange = (newSlug: string) => {
    setSelectedStateSlug(newSlug);
    const st = TAX_STATES.find((s) => s.slug === newSlug);
    if (st) {
      setStateTaxPct(st.avgEffectiveTaxPct);
    }
  };

  // 직종별 프리셋(Uber 드라이버, 개발자, 부동산 에이전트, 유튜버) 원클릭 적용
  const applyProfessionPreset = (presetId: string) => {
    const p = PROFESSIONS_1099.find((item) => item.id === presetId);
    if (p) {
      setGross1099Income(p.sampleGrossIncome);
      setBusinessMiles(p.sampleAnnualMiles);
      setHomeOfficeSqFt(p.sampleHomeOfficeSqFt);
      setOtherBusinessExpenses(p.sampleOtherExpenses);
    }
  };

  const result = useMemo(
    () =>
      calculate1099Taxes({
        gross1099Income,
        w2WagesIncome,
        businessMiles,
        homeOfficeSqFt,
        healthInsurancePaid,
        retirementContribution,
        otherBusinessExpenses,
        filingStatus,
        stateTaxPct,
        applyQbiDeduction,
      }),
    [
      gross1099Income,
      w2WagesIncome,
      businessMiles,
      homeOfficeSqFt,
      healthInsurancePaid,
      retirementContribution,
      otherBusinessExpenses,
      filingStatus,
      stateTaxPct,
      applyQbiDeduction,
    ]
  );

  const handleSaveEstimate = async () => {
    setIsSaving(true);
    setSaveMessage('');
    const res = await save1099TaxEstimate({
      state_slug: selectedStateSlug,
      filing_status: filingStatus,
      gross_1099_income: gross1099Income,
      total_deductions: result.totalScheduleCDeductions,
      net_business_profit: result.netBusinessProfit,
      self_employment_tax: result.selfEmploymentTaxTotal,
      federal_income_tax: result.federalIncomeTax,
      state_income_tax: result.stateIncomeTax,
      quarterly_payment: result.quarterlySchedule[0]?.totalQuarterlyPayment || 0,
      note: scenarioNote,
    });
    setIsSaving(false);
    if (res.success) {
      setSaveMessage('1099 tax scenario encrypted & saved!');
      setScenarioNote('');
    } else {
      setSaveMessage('Saved locally to browser.');
    }
  };

  return (
    <div className="space-y-8">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
        {/* 상단 타이틀 및 주별 링크 */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <span className="inline-block rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
              2026 IRS Schedule C, SE &amp; 1040-ES Rules
            </span>
            <h2 className="mt-2 text-2xl font-bold text-slate-900">
              1099 Self-Employment &amp; Quarterly Estimated Tax Calculator
            </h2>
          </div>
          <div className="text-right">
            <div className="text-xs font-medium text-slate-500">Selected State Tax Guide</div>
            <Link
              to={`/1099-tax/${currentStateInfo.slug}`}
              className="text-sm font-bold text-blue-600 underline hover:text-blue-800"
            >
              {currentStateInfo.name} (
              {currentStateInfo.hasStateIncomeTax
                ? `${currentStateInfo.avgEffectiveTaxPct}% Avg State Tax`
                : '0% State Income Tax!'}
              ) &rarr;
            </Link>
          </div>
        </div>

        {/* 직종별 원클릭 프리셋 바 */}
        <div className="mt-4 rounded-xl bg-slate-50 p-3 border border-slate-200">
          <div className="text-xs font-semibold text-slate-700">
            Load Sample 1099 Profession Write-Off Profile:
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            {PROFESSIONS_1099.map((prof) => (
              <button
                key={prof.id}
                type="button"
                onClick={() => applyProfessionPreset(prof.id)}
                className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:border-blue-500 hover:text-blue-600"
              >
                {prof.title} (${(prof.sampleGrossIncome / 1000).toFixed(0)}k)
              </button>
            ))}
          </div>
        </div>

        {/* 메인 그리드: 왼쪽 입력 / 오른쪽 세금 & 분기별 납부 결과 */}
        <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* 왼쪽 입력 폼 (7칸) */}
          <div className="space-y-5 lg:col-span-7">
            {/* 1. 주(State) 및 세금 신고 유형(Filing Status) */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide text-slate-600">
                  1. Select Your State
                </label>
                <select
                  value={selectedStateSlug}
                  onChange={(e) => handleStateChange(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm font-semibold text-slate-900"
                >
                  {TAX_STATES.map((st) => (
                    <option key={st.slug} value={st.slug}>
                      {st.name} ({st.abbr}) —{' '}
                      {st.hasStateIncomeTax ? `${st.avgEffectiveTaxPct}% Avg Tax` : '0% Tax'}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide text-slate-600">
                  2. IRS Filing Status
                </label>
                <select
                  value={filingStatus}
                  onChange={(e) => setFilingStatus(e.target.value as FilingStatus)}
                  className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm font-semibold text-slate-900"
                >
                  <option value="single">Single ($15,000 Std Deduction)</option>
                  <option value="married">Married Filing Jointly ($30,000 Std Deduction)</option>
                  <option value="head_of_household">
                    Head of Household ($22,500 Std Deduction)
                  </option>
                </select>
              </div>
            </div>

            <p className="rounded-lg bg-blue-50/70 border border-blue-100 p-3 text-xs text-slate-700">
              <strong>{currentStateInfo.name} 1099 Rule:</strong> {currentStateInfo.taxRuleNote}
            </p>

            {/* 2. 1099 총수입 및 겸업 W-2 급여 */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide text-slate-600">
                  Annual Gross 1099-NEC / 1099-K Income ($)
                </label>
                <input
                  type="number"
                  min={0}
                  step={1000}
                  value={gross1099Income}
                  onChange={(e) => setGross1099Income(Number(e.target.value))}
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-base font-semibold text-slate-900"
                />
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  {[40000, 75000, 120000, 200000].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setGross1099Income(preset)}
                      className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700 hover:bg-blue-50 hover:text-blue-700"
                    >
                      ${(preset / 1000).toFixed(0)}k
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide text-slate-600">
                  Other W-2 Job Wages (If Side Hustle, $)
                </label>
                <input
                  type="number"
                  min={0}
                  step={1000}
                  value={w2WagesIncome}
                  onChange={(e) => setW2WagesIncome(Number(e.target.value))}
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-base font-semibold text-slate-900"
                />
                <span className="mt-1 block text-[11px] text-slate-500">
                  Used to cap 12.4% Social Security tax at $176,100 total earnings.
                </span>
              </div>
            </div>

            {/* 3. Schedule C 비즈니스 비용 공제 (마일리지, 홈오피스, 기타 경비) */}
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900">
                  3. Business Write-Offs &amp; Tax Deductions (Schedule C)
                </h3>
                <span className="text-xs font-bold text-emerald-700">
                  Total Write-Offs: {usd(result.totalScheduleCDeductions)}
                </span>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700">
                    Business Miles Driven ({IRS_MILEAGE_RATE_2026.toFixed(2)}/mi)
                  </label>
                  <input
                    type="number"
                    min={0}
                    step={500}
                    value={businessMiles}
                    onChange={(e) => setBusinessMiles(Number(e.target.value))}
                    className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-900"
                  />
                  <span className="mt-1 block text-[11px] text-emerald-700 font-medium">
                    Mileage Deduction: {usd(result.mileageDeduction)}
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700">
                    Home Office Area (Max 300 sq ft @ $5/sq ft)
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={300}
                    step={10}
                    value={homeOfficeSqFt}
                    onChange={(e) => setHomeOfficeSqFt(Number(e.target.value))}
                    className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-900"
                  />
                  <span className="mt-1 block text-[11px] text-emerald-700 font-medium">
                    Home Office Deduction: {usd(result.homeOfficeDeduction)}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700">
                    Supplies, Software &amp; Ads ($)
                  </label>
                  <input
                    type="number"
                    min={0}
                    step={250}
                    value={otherBusinessExpenses}
                    onChange={(e) => setOtherBusinessExpenses(Number(e.target.value))}
                    className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700">
                    Self-Employed Health Ins. ($)
                  </label>
                  <input
                    type="number"
                    min={0}
                    step={250}
                    value={healthInsurancePaid}
                    onChange={(e) => setHealthInsurancePaid(Number(e.target.value))}
                    className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700">
                    Solo 401(k) / SEP IRA ($)
                  </label>
                  <input
                    type="number"
                    min={0}
                    step={500}
                    value={retirementContribution}
                    onChange={(e) => setRetirementContribution(Number(e.target.value))}
                    className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-900"
                  />
                </div>
              </div>
            </div>

            {/* 4. QBI 20% 공제 체크박스 및 주 세율 미세 조정 */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-1 text-xs text-slate-700">
              <label className="flex items-center gap-2 cursor-pointer font-medium">
                <input
                  type="checkbox"
                  checked={applyQbiDeduction}
                  onChange={(e) => setApplyQbiDeduction(e.target.checked)}
                  className="h-4 w-4 rounded-sm border-slate-300 text-blue-600"
                />
                <span>
                  Apply 20% Qualified Business Income (QBI / Section 199A) Deduction (Saves{' '}
                  <strong>{usd(result.qbiDeduction)}</strong> in taxable income)
                </span>
              </label>

              <div className="flex items-center gap-2">
                <span>State Tax Rate (%):</span>
                <input
                  type="number"
                  min={0}
                  max={15}
                  step={0.1}
                  value={stateTaxPct}
                  onChange={(e) => setStateTaxPct(Number(e.target.value))}
                  className="w-20 rounded-md border border-slate-300 px-2 py-1 text-xs font-bold text-slate-900"
                />
              </div>
            </div>
          </div>

          {/* 오른쪽 실시간 결과 영역 (5칸) */}
          <div className="lg:col-span-5 flex flex-col justify-between rounded-2xl bg-slate-900 p-6 text-white">
            <div className="space-y-5">
              {/* 분기별 예납 세액 하이라이트 */}
              <div>
                <div className="text-xs font-semibold uppercase tracking-wider text-blue-400">
                  IRS Quarterly Estimated Tax Payment (4x / Yr)
                </div>
                <div className="mt-1 text-4xl font-extrabold tracking-tight text-white">
                  {usd(result.quarterlySchedule[0]?.totalQuarterlyPayment || 0)}
                  <span className="text-base font-normal text-slate-400"> / quarter</span>
                </div>
                <div className="mt-1 text-xs text-emerald-400 font-medium">
                  Recommended: Set aside <strong>{result.recommendedTaxSavingsPct}%</strong> of
                  every 1099 client payment for taxes.
                </div>
              </div>

              {/* 연간 세금 상세 내역 */}
              <div className="rounded-xl bg-slate-800/90 p-4 space-y-2 text-xs">
                <div className="font-bold text-slate-200 uppercase tracking-wider border-b border-slate-700 pb-1.5">
                  Annual 1099 Profit &amp; Tax Breakdown
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Gross 1099 Revenue:</span>
                  <span className="font-semibold text-white">{usd(gross1099Income)}</span>
                </div>
                <div className="flex justify-between text-emerald-400">
                  <span>Schedule C Business Write-Offs:</span>
                  <span className="font-semibold">-{usd(result.totalScheduleCDeductions)}</span>
                </div>
                <div className="flex justify-between border-t border-slate-700 pt-1.5 font-bold">
                  <span className="text-slate-200">Net Self-Employment Profit:</span>
                  <span className="text-white">{usd(result.netBusinessProfit)}</span>
                </div>

                <div className="flex justify-between pt-2">
                  <span className="text-slate-400">15.3% Self-Employment Tax (SS + Med):</span>
                  <span className="font-semibold text-amber-300">
                    {usd(result.selfEmploymentTaxTotal)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Federal Income Tax (after QBI &amp; Std):</span>
                  <span className="font-semibold text-amber-300">
                    {usd(result.federalIncomeTax)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">
                    {currentStateInfo.name} State Tax ({stateTaxPct.toFixed(2)}%):
                  </span>
                  <span className="font-semibold text-amber-300">{usd(result.stateIncomeTax)}</span>
                </div>

                <div className="flex justify-between border-t border-slate-700 pt-2 text-sm font-bold">
                  <span className="text-rose-300">
                    Total Annual Tax ({result.effectiveTotalTaxRatePct.toFixed(1)}% Eff.):
                  </span>
                  <span className="text-rose-300">{usd(result.totalTaxLiability)}</span>
                </div>
                <div className="flex justify-between pt-1 text-sm font-extrabold">
                  <span className="text-emerald-400">Net Take-Home Income After Tax:</span>
                  <span className="text-emerald-400">{usd(result.netTakeHomeAfterTax)}</span>
                </div>
              </div>

              {/* 2026 IRS 4분기 예납 마감일 스케줄표 */}
              <div className="space-y-2 text-xs">
                <div className="font-bold text-slate-300 uppercase tracking-wider">
                  2026 IRS Form 1040-ES Quarterly Deadlines
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {result.quarterlySchedule.map((q) => (
                    <div
                      key={q.quarter}
                      className="rounded-lg bg-slate-800/70 border border-slate-700/80 p-2.5"
                    >
                      <div className="font-bold text-blue-300">{q.dueDate}</div>
                      <div className="text-[11px] text-slate-400">{q.periodCovered}</div>
                      <div className="mt-1 text-sm font-extrabold text-white">
                        {usd(q.totalQuarterlyPayment)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Supabase 암호화 세금 시나리오 저장 */}
            <div className="mt-6 border-t border-slate-800 pt-4">
              <label className="block text-[11px] font-medium text-slate-400">
                Save 1099 Tax Scenario (Client-Side AES-256 Encrypted)
              </label>
              <div className="mt-1.5 flex gap-2">
                <input
                  type="text"
                  placeholder="e.g., 2026 Consulting + Mileage Plan"
                  value={scenarioNote}
                  onChange={(e) => setScenarioNote(e.target.value)}
                  className="flex-1 rounded-lg bg-slate-800 border border-slate-700 px-3 py-1.5 text-xs text-white placeholder-slate-500"
                />
                <button
                  type="button"
                  disabled={isSaving}
                  onClick={handleSaveEstimate}
                  className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-blue-500 disabled:opacity-50"
                >
                  {isSaving ? 'Saving...' : 'Save Plan'}
                </button>
              </div>
              {saveMessage && (
                <p className="mt-1.5 text-[11px] font-medium text-emerald-400">{saveMessage}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

