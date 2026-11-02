import { Link } from 'react-router-dom';
import { TAX_STATES } from '../data/taxStates';
import { usePageSeo } from '../lib/seo';

// =========================================================================
// 51개 주(50개 주 + DC) 1099 자영업 소득세율 및 LLC 연간 수수료 비교 목록 페이지
// =========================================================================

export default function StateIndex() {
  usePageSeo({
    title: '1099 Self-Employment Tax Calculator by State (2026) | Tax1099Smart',
    description:
      'Compare 2026 state income tax rates for 1099 independent contractors, no-income-tax states, and annual LLC filing fees across all 50 US states and DC.',
    path: '/1099-tax',
  });

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <h1 className="text-3xl font-bold text-slate-900">
          US 1099 Self-Employment &amp; Quarterly Tax Calculator by State (2026)
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          Choose your state below to estimate your 2026 federal + state 1099 independent contractor
          taxes, 15.3% IRS self-employment tax, 20% QBI deduction, and quarterly estimated payments.
        </p>

        <div className="mt-6 overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-100 text-slate-700 font-semibold">
                <th className="p-3">State</th>
                <th className="p-3">State Income Tax?</th>
                <th className="p-3">Avg 1099 State Rate</th>
                <th className="p-3">Top Marginal Rate</th>
                <th className="p-3">Annual LLC Fee</th>
                <th className="p-3">Calculator</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {TAX_STATES.map((st) => (
                <tr key={st.slug} className="hover:bg-slate-50">
                  <td className="p-3 font-semibold text-slate-900">
                    <Link to={`/1099-tax/${st.slug}`} className="text-blue-600 hover:underline">
                      {st.name} ({st.abbr})
                    </Link>
                  </td>
                  <td className="p-3">
                    {st.hasStateIncomeTax ? (
                      <span className="inline-block rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-700">
                        Yes
                      </span>
                    ) : (
                      <span className="inline-block rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-800">
                        0% No State Tax!
                      </span>
                    )}
                  </td>
                  <td className="p-3 font-semibold text-slate-900">
                    {st.avgEffectiveTaxPct.toFixed(2)}%
                  </td>
                  <td className="p-3 text-slate-700">{st.topMarginalTaxPct.toFixed(2)}%</td>
                  <td className="p-3 text-slate-700">${st.annualLlcFee}/yr</td>
                  <td className="p-3">
                    <Link
                      to={`/1099-tax/${st.slug}`}
                      className="font-semibold text-blue-600 hover:underline"
                    >
                      Calculate 1099 Tax &rarr;
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

