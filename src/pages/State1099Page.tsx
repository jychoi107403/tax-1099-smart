import { Link, useParams } from 'react-router-dom';
import Tax1099Calculator from '../components/Tax1099Calculator';
import { TAX_STATES, findTaxStateBySlug } from '../data/taxStates';
import { calculate1099Taxes } from '../lib/tax1099Calc';
import { usePageSeo } from '../lib/seo';

// =========================================================================
// 주(State)별 1099 프리랜서 세금 & 분기별 예납 전용 SEO 페이지 (/1099-tax/:state)
// =========================================================================

const usd = (n: number) => '$' + Math.round(n).toLocaleString('en-US');

export default function State1099Page() {
  const { state = '' } = useParams<{ state: string }>();
  const stateInfo = findTaxStateBySlug(state);

  usePageSeo({
    title: stateInfo
      ? `${stateInfo.name} 1099 Self-Employment & Quarterly Tax Calculator (2026)`
      : 'State 1099 Tax Calculator | Tax1099Smart',
    description: stateInfo
      ? `Calculate your 2026 1099 independent contractor and self-employment taxes in ${stateInfo.name}. Includes 15.3% SE tax, ${stateInfo.hasStateIncomeTax ? `${stateInfo.avgEffectiveTaxPct}% avg ${stateInfo.abbr} state tax` : '0% state income tax'}, QBI deduction, and quarterly payments.`
      : 'State 1099 self-employment tax calculator.',
    path: stateInfo ? `/1099-tax/${stateInfo.slug}` : '/1099-tax',
  });

  if (!stateInfo) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <h1 className="text-2xl font-bold text-slate-900">State Not Found</h1>
        <Link to="/1099-tax" className="mt-4 inline-block font-semibold text-blue-600 underline">
          Browse all 50 US states &rarr;
        </Link>
      </div>
    );
  }

  const sampleIncomes = [50000, 75000, 100000, 150000];

  return (
    <div className="space-y-8">
      {/* 상단 주별 요약 헤더 */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <div className="text-xs text-slate-500">
          <Link to="/" className="hover:underline">
            Home
          </Link>{' '}
          &rsaquo;{' '}
          <Link to="/1099-tax" className="hover:underline">
            States
          </Link>{' '}
          &rsaquo; <span className="font-semibold text-slate-700">{stateInfo.name}</span>
        </div>

        <h1 className="mt-2 text-3xl font-bold text-slate-900">
          {stateInfo.name} ({stateInfo.abbr}) 1099 Self-Employment &amp; Quarterly Tax Calculator
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          Freelancers, Uber/DoorDash drivers, and independent contractors in{' '}
          <strong>{stateInfo.name}</strong> pay the federal 15.3% self-employment tax (Social
          Security &amp; Medicare) plus federal income tax and{' '}
          {stateInfo.hasStateIncomeTax
            ? `an average ${stateInfo.name} state income tax rate of ${stateInfo.avgEffectiveTaxPct.toFixed(2)}% (top marginal rate ${stateInfo.topMarginalTaxPct.toFixed(2)}%).`
            : '0% state personal income tax!'}
        </p>

        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-xl bg-slate-50 p-3.5 border border-slate-200">
            <div className="text-xs text-slate-500">Avg {stateInfo.abbr} State Tax</div>
            <div className="mt-1 text-xl font-bold text-slate-900">
              {stateInfo.hasStateIncomeTax ? `${stateInfo.avgEffectiveTaxPct.toFixed(2)}%` : '0%'}
            </div>
          </div>
          <div className="rounded-xl bg-slate-50 p-3.5 border border-slate-200">
            <div className="text-xs text-slate-500">IRS Self-Employment Tax</div>
            <div className="mt-1 text-xl font-bold text-blue-600">15.3%</div>
          </div>
          <div className="rounded-xl bg-slate-50 p-3.5 border border-slate-200">
            <div className="text-xs text-slate-500">Top {stateInfo.abbr} Bracket</div>
            <div className="mt-1 text-xl font-bold text-slate-900">
              {stateInfo.topMarginalTaxPct.toFixed(2)}%
            </div>
          </div>
          <div className="rounded-xl bg-slate-50 p-3.5 border border-slate-200">
            <div className="text-xs text-slate-500">Annual LLC Report Fee</div>
            <div className="mt-1 text-xl font-bold text-slate-900">${stateInfo.annualLlcFee}/yr</div>
          </div>
        </div>
      </div>

      {/* 해당 주 세율이 자동 로드된 1099 계산기 */}
      <Tax1099Calculator key={stateInfo.slug} initialState={stateInfo} />

      {/* 소득 구간별 1099 세금 및 분기별 예납액 비교표 */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <h2 className="text-xl font-bold text-slate-900">
          {stateInfo.name} 1099 Tax &amp; Quarterly Payment Examples (2026)
        </h2>
        <p className="mt-1 text-xs text-slate-600">
          Estimates for a Single filer in {stateInfo.name} with $8,000 in Schedule C business
          write-offs and the 20% QBI deduction applied:
        </p>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-100 text-slate-700 font-semibold">
                <th className="p-3">Gross 1099 Income</th>
                <th className="p-3">15.3% SE Tax</th>
                <th className="p-3">Federal + {stateInfo.abbr} Tax</th>
                <th className="p-3">Quarterly Payment (4x/Yr)</th>
                <th className="p-3">Net Take-Home Pay</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {sampleIncomes.map((inc) => {
                const sample = calculate1099Taxes({
                  gross1099Income: inc,
                  w2WagesIncome: 0,
                  businessMiles: 5000,
                  homeOfficeSqFt: 100,
                  healthInsurancePaid: 0,
                  retirementContribution: 0,
                  otherBusinessExpenses: 4000,
                  filingStatus: 'single',
                  stateTaxPct: stateInfo.avgEffectiveTaxPct,
                  applyQbiDeduction: true,
                });
                return (
                  <tr key={inc} className="hover:bg-slate-50">
                    <td className="p-3 font-semibold text-slate-900">{usd(inc)}</td>
                    <td className="p-3 text-slate-700">{usd(sample.selfEmploymentTaxTotal)}</td>
                    <td className="p-3 text-slate-700">
                      {usd(sample.federalIncomeTax + sample.stateIncomeTax)}
                    </td>
                    <td className="p-3 font-bold text-blue-600">
                      {usd(sample.quarterlySchedule[0]?.totalQuarterlyPayment || 0)} / qtr
                    </td>
                    <td className="p-3 font-bold text-emerald-700">
                      {usd(sample.netTakeHomeAfterTax)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 주별 자주 묻는 질문 (FAQ) */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-4">
        <h2 className="text-xl font-bold text-slate-900">
          {stateInfo.name} 1099 Independent Contractor Tax FAQs
        </h2>
        <div className="space-y-3 text-sm text-slate-700">
          <div className="rounded-xl bg-slate-50 p-4">
            <h3 className="font-bold text-slate-900">
              How much should I set aside for 1099 taxes in {stateInfo.name}?
            </h3>
            <p className="mt-1 text-xs sm:text-sm text-slate-600">
              {stateInfo.hasStateIncomeTax
                ? `In ${stateInfo.name}, most 1099 contractors should set aside 25% to 32% of their net business profit to cover the 15.3% IRS self-employment tax, federal income tax, and ${stateInfo.name}'s ${stateInfo.avgEffectiveTaxPct.toFixed(2)}% average state income tax.`
                : `Because ${stateInfo.name} has 0% state income tax, most 1099 freelancers should set aside 20% to 26% of their net profit to cover the 15.3% IRS self-employment tax and federal income tax.`}
            </p>
          </div>

          <div className="rounded-xl bg-slate-50 p-4">
            <h3 className="font-bold text-slate-900">
              When are quarterly estimated taxes due in {stateInfo.name}?
            </h3>
            <p className="mt-1 text-xs sm:text-sm text-slate-600">
              Quarterly estimated tax payments (IRS Form 1040-ES and state equivalents) are due four
              times a year: <strong>April 15, June 15, September 15, and January 15</strong> of the
              following year.
            </p>
          </div>
        </div>
      </div>

      {/* 다른 주 빠른 이동 링크 */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <h2 className="text-base font-bold text-slate-900">
          Compare 1099 Self-Employment Taxes in Other US States
        </h2>
        <div className="mt-3 flex flex-wrap gap-2 text-xs">
          {TAX_STATES.map((s) => (
            <Link
              key={s.slug}
              to={`/1099-tax/${s.slug}`}
              className={`rounded-md border px-2.5 py-1 font-medium ${
                s.slug === stateInfo.slug
                  ? 'border-blue-600 bg-blue-600 text-white'
                  : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-blue-400'
              }`}
            >
              {s.name} ({s.hasStateIncomeTax ? `${s.avgEffectiveTaxPct}%` : '0% Tax'})
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

