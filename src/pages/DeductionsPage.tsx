import { useState, useMemo } from 'react';
import { PROFESSIONS_1099 } from '../data/taxStates';
import { IRS_MILEAGE_RATE_2026 } from '../lib/tax1099Calc';
import { usePageSeo } from '../lib/seo';

// =========================================================================
// 1099 비즈니스 경비 공제(Write-Offs) & 마일리지 절세 계산기 페이지 (/deductions)
// =========================================================================

const usd = (n: number) => '$' + Math.round(n).toLocaleString('en-US');

export default function DeductionsPage() {
  usePageSeo({
    title: '1099 Write-Offs & IRS Mileage Deduction Calculator (2026) | Tax1099Smart',
    description:
      'Calculate how much money you save on 1099 taxes using the 2026 IRS standard mileage rate ($0.70/mile), simplified home office deduction, and Schedule C business write-offs.',
    path: '/deductions',
  });

  const [annualMiles, setAnnualMiles] = useState<number>(15000);
  const [homeOfficeSqFt, setHomeOfficeSqFt] = useState<number>(200);
  const [phoneInternetAnnual, setPhoneInternetAnnual] = useState<number>(2400);
  const [businessUsePct, setBusinessUsePct] = useState<number>(70);
  const [equipmentAndSoftware, setEquipmentAndSoftware] = useState<number>(3200);
  const [combinedMarginalTaxRate, setCombinedMarginalTaxRate] = useState<number>(30);

  const summary = useMemo(() => {
    const mileageWriteOff = Math.max(0, annualMiles) * IRS_MILEAGE_RATE_2026;
    const homeOfficeWriteOff = Math.min(300, Math.max(0, homeOfficeSqFt)) * 5;
    const phoneInternetWriteOff =
      Math.max(0, phoneInternetAnnual) * (Math.min(100, Math.max(0, businessUsePct)) / 100);
    const totalWriteOffs =
      mileageWriteOff +
      homeOfficeWriteOff +
      phoneInternetWriteOff +
      Math.max(0, equipmentAndSoftware);
    const cashTaxSaved = totalWriteOffs * (Math.max(0, combinedMarginalTaxRate) / 100);

    return {
      mileageWriteOff,
      homeOfficeWriteOff,
      phoneInternetWriteOff,
      totalWriteOffs,
      cashTaxSaved,
    };
  }, [
    annualMiles,
    homeOfficeSqFt,
    phoneInternetAnnual,
    businessUsePct,
    equipmentAndSoftware,
    combinedMarginalTaxRate,
  ]);

  return (
    <div className="space-y-8">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
        <span className="inline-block rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
          IRS Schedule C Tax Saver
        </span>
        <h1 className="mt-2 text-3xl font-bold text-slate-900">
          1099 Write-Offs &amp; IRS Mileage Tax Savings Calculator
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          Every legitimate business expense you deduct on <strong>IRS Schedule C</strong> lowers
          both your federal/state income tax <em>and</em> your 15.3% self-employment tax. See how
          much actual cash you keep by tracking your mileage and home office deductions.
        </p>

        <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-12">
          <div className="space-y-4 lg:col-span-7">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide text-slate-600">
                  Annual Business Miles Driven
                </label>
                <input
                  type="number"
                  min={0}
                  step={1000}
                  value={annualMiles}
                  onChange={(e) => setAnnualMiles(Number(e.target.value))}
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-base font-semibold text-slate-900"
                />
                <span className="mt-1 block text-xs text-slate-500">
                  2026 IRS Standard Mileage Rate: ${IRS_MILEAGE_RATE_2026.toFixed(2)} / mile
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide text-slate-600">
                  Dedicated Home Office (Sq Ft, Max 300)
                </label>
                <input
                  type="number"
                  min={0}
                  max={300}
                  step={10}
                  value={homeOfficeSqFt}
                  onChange={(e) => setHomeOfficeSqFt(Number(e.target.value))}
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-base font-semibold text-slate-900"
                />
                <span className="mt-1 block text-xs text-slate-500">
                  Simplified Method: $5 per sq ft (up to $1,500/yr)
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide text-slate-600">
                  Annual Phone &amp; Internet ($)
                </label>
                <input
                  type="number"
                  min={0}
                  step={100}
                  value={phoneInternetAnnual}
                  onChange={(e) => setPhoneInternetAnnual(Number(e.target.value))}
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide text-slate-600">
                  Business Use (%)
                </label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  step={5}
                  value={businessUsePct}
                  onChange={(e) => setBusinessUsePct(Number(e.target.value))}
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide text-slate-600">
                  Laptop, Gear &amp; Software ($)
                </label>
                <input
                  type="number"
                  min={0}
                  step={200}
                  value={equipmentAndSoftware}
                  onChange={(e) => setEquipmentAndSoftware(Number(e.target.value))}
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wide text-slate-600">
                Your Combined Marginal Tax Rate (15.3% SE Tax + Fed + State, %)
              </label>
              <input
                type="number"
                min={10}
                max={55}
                step={1}
                value={combinedMarginalTaxRate}
                onChange={(e) => setCombinedMarginalTaxRate(Number(e.target.value))}
                className="mt-1 w-40 rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-900"
              />
            </div>
          </div>

          <div className="lg:col-span-5 rounded-2xl bg-slate-900 p-6 text-white space-y-4">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
                Estimated Cash Saved on Taxes
              </div>
              <div className="mt-1 text-4xl font-extrabold text-white">
                {usd(summary.cashTaxSaved)}
              </div>
              <div className="mt-1 text-xs text-slate-400">
                Total Schedule C Deductions: <strong>{usd(summary.totalWriteOffs)}</strong>
              </div>
            </div>

            <div className="border-t border-slate-800 pt-4 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">IRS Mileage Deduction:</span>
                <span className="font-semibold text-white">{usd(summary.mileageWriteOff)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Home Office Deduction:</span>
                <span className="font-semibold text-white">{usd(summary.homeOfficeWriteOff)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Phone &amp; Internet Write-Off:</span>
                <span className="font-semibold text-white">
                  {usd(summary.phoneInternetWriteOff)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Equipment, Supplies &amp; Software:</span>
                <span className="font-semibold text-white">{usd(equipmentAndSoftware)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 직종별 대표 공제 체크리스트 */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <h2 className="text-xl font-bold text-slate-900">
          Top 1099 Tax Write-Offs by Profession
        </h2>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {PROFESSIONS_1099.map((prof) => (
            <div key={prof.id} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <h3 className="font-bold text-slate-900">{prof.title}</h3>
              <ul className="mt-2 list-disc pl-5 text-xs text-slate-600 space-y-1">
                {prof.topWriteOffs.map((w) => (
                  <li key={w}>{w}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

