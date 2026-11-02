import { usePageSeo } from '../lib/seo';

// =========================================================================
// 사이트 소개 및 1099 세금 계산 공식 안내 페이지 (/about)
// =========================================================================

export default function AboutPage() {
  usePageSeo({
    title: 'About Tax1099Smart & IRS 1099 Tax Methodology | Tax1099Smart',
    description:
      'Learn how Tax1099Smart calculates IRS Schedule C net profit, Schedule SE 15.3% self-employment tax, Section 199A QBI deduction, and Form 1040-ES quarterly taxes.',
    path: '/about',
  });

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-4 text-sm text-slate-700 leading-relaxed">
      <h1 className="text-3xl font-bold text-slate-900">
        About Tax1099Smart &amp; Methodology
      </h1>
      <p>
        <strong>Tax1099Smart</strong> is a free, privacy-first US self-employment and quarterly tax
        calculator built for freelancers, independent contractors, gig workers (Uber, DoorDash,
        Instacart), consultants, and sole proprietors.
      </p>
      <h2 className="text-lg font-bold text-slate-900 pt-2">
        How Our 2026 1099 Tax Engine Works
      </h2>
      <ul className="list-disc pl-5 space-y-1.5">
        <li>
          <strong>Schedule C Net Profit:</strong> Subtracts IRS standard mileage ($0.70/mile),
          simplified home office ($5/sq ft up to 300 sq ft), and ordinary business expenses from
          your gross 1099-NEC / 1099-K receipts.
        </li>
        <li>
          <strong>Schedule SE (15.3% Self-Employment Tax):</strong> Applies the IRS 92.35% net
          earnings multiplier, 12.4% Social Security tax up to the annual wage base ($176,100), and
          2.9% Medicare tax (+ 0.9% Additional Medicare Tax for high earners).
        </li>
        <li>
          <strong>Above-the-Line &amp; QBI Deductions:</strong> Automatically deducts 50% of your
          self-employment tax, self-employed health insurance premiums, Solo 401(k)/SEP IRA
          contributions, the 2026 standard deduction, and the 20% Section 199A Qualified Business
          Income (QBI) deduction.
        </li>
      </ul>
    </div>
  );
}

