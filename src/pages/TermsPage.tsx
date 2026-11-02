import { usePageSeo } from '../lib/seo';

// =========================================================================
// 이용약관 및 세무 면책조항 페이지 (/terms)
// =========================================================================

export default function TermsPage() {
  usePageSeo({
    title: 'Terms of Use & Tax Disclaimer | Tax1099Smart',
    description:
      'Terms of Use and Tax Disclaimer for Tax1099Smart. All 1099 self-employment and quarterly estimated tax calculations are for educational purposes only.',
    path: '/terms',
  });

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-4 text-sm text-slate-700 leading-relaxed">
      <h1 className="text-3xl font-bold text-slate-900">
        Terms of Use &amp; Tax Disclaimer
      </h1>
      <p>
        All calculations and figures on <strong>Tax1099Smart</strong>—including self-employment
        tax, federal and state income tax, QBI deductions, business write-offs, and IRS Form
        1040-ES quarterly payments—are estimates for informational and educational purposes only.
      </p>
      <p>
        Tax1099Smart is not a Certified Public Accountant (CPA), Enrolled Agent, or law firm, and
        use of this website does not create a professional advisory relationship. Always consult a
        qualified tax professional regarding your specific federal, state, and local tax filings.
      </p>
    </div>
  );
}

