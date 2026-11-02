import { Link, Route, Routes } from 'react-router-dom';
import Tax1099Calculator from './components/Tax1099Calculator';
import { SisterSitesTopBar, SisterSitesFooterHub } from './components/SisterSitesBar';
import StateIndex from './pages/StateIndex';
import State1099Page from './pages/State1099Page';
import DeductionsPage from './pages/DeductionsPage';
import AboutPage from './pages/AboutPage';
import PrivacyPage from './pages/PrivacyPage';
import TermsPage from './pages/TermsPage';
import { TAX_STATES } from './data/taxStates';
import { usePageSeo } from './lib/seo';

// =========================================================================
// 홈 화면 컴포넌트 (SEO 메타태그 + 메인 1099 계산기 + 51개 주 빠른 이동 그리드)
// =========================================================================
function HomePage() {
  usePageSeo({
    title: '1099 Self-Employment & Quarterly Tax Calculator 2026 | Tax1099Smart',
    description:
      'Free 2026 US 1099 self-employment and quarterly estimated tax calculator for all 50 states and DC. Calculate 15.3% SE tax, QBI deduction, business write-offs, and IRS 1040-ES quarterly payments.',
    path: '/',
  });

  return (
    <div className="space-y-8">
      <Tax1099Calculator />

      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              1099 Self-Employment &amp; Quarterly Tax Calculator by State
            </h2>
            <p className="mt-1 text-xs text-slate-600">
              Select your state to load 2026 state income tax rates, no-income-tax state rules, and
              quarterly payment schedules:
            </p>
          </div>
          <div className="flex gap-3 text-xs font-semibold">
            <Link to="/1099-tax" className="text-blue-600 underline">
              Compare All 50 States &rarr;
            </Link>
            <Link to="/deductions" className="text-emerald-700 underline">
              Mileage &amp; Write-Off Saver &rarr;
            </Link>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 text-xs">
          {TAX_STATES.map((st) => (
            <Link
              key={st.slug}
              to={`/1099-tax/${st.slug}`}
              className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 font-medium text-slate-800 hover:border-blue-500 hover:bg-white hover:text-blue-600"
            >
              <span>
                {st.name} ({st.abbr})
              </span>
              <span
                className={`font-bold ${
                  st.hasStateIncomeTax ? 'text-slate-600' : 'text-emerald-600'
                }`}
              >
                {st.hasStateIncomeTax ? `${st.avgEffectiveTaxPct}%` : '0% Tax'}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

// =========================================================================
// 전체 앱 레이아웃 (상단 7개 자매 사이트 네트워크 바 + 헤더 + 라우터 + 하단 푸터 허브)
// =========================================================================
export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      {/* 최상단 7개 자매 사이트 상호 이동 네트워크 바 */}
      <SisterSitesTopBar currentSiteId="tax-1099-smart" />

      {/* 상단 네비게이션 헤더 */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-6 py-4">
          <Link to="/" className="text-xl font-extrabold tracking-tight text-blue-600">
            💼 Tax1099<span className="text-slate-900">Smart</span>
          </Link>
          <nav className="flex flex-wrap gap-5 text-sm font-semibold text-slate-700">
            <Link to="/" className="hover:text-blue-600">
              1099 &amp; Quarterly Calculator
            </Link>
            <Link to="/1099-tax" className="hover:text-blue-600">
              By State
            </Link>
            <Link to="/deductions" className="hover:text-blue-600">
              Write-Offs &amp; Mileage
            </Link>
            <Link to="/about" className="hover:text-blue-600">
              About
            </Link>
          </nav>
        </div>
      </header>

      {/* 본문 영역 */}
      <main className="mx-auto w-full max-w-5xl flex-1 p-6">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/1099-tax" element={<StateIndex />} />
          <Route path="/1099-tax/:state" element={<State1099Page />} />
          <Route path="/deductions" element={<DeductionsPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route
            path="*"
            element={
              <div className="rounded-2xl border border-slate-200 bg-white p-6">
                <h1 className="text-2xl font-bold text-slate-900">Page Not Found</h1>
                <Link to="/" className="mt-4 inline-block text-blue-600 underline">
                  Back to 1099 Tax Calculator
                </Link>
              </div>
            }
          />
        </Routes>
      </main>

      {/* 하단 푸터 (면책 문구 + 7개 자매 사이트 전체 링크 허브 + 법적 고지) */}
      <footer className="mt-12 border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-5xl px-6 py-8 text-xs text-slate-500 space-y-4">
          <p>
            Disclaimer: For informational and educational purposes only. Estimates do not constitute
            certified tax, legal, or accounting advice. Consult a licensed CPA or Enrolled Agent
            for official IRS Schedule C, Schedule SE, and Form 1040-ES filings.
          </p>

          {/* 7개 자매 사이트 전체 네트워크 허브 */}
          <SisterSitesFooterHub currentSiteId="tax-1099-smart" />

          <div className="flex flex-wrap justify-between gap-4 border-t border-slate-200 pt-4">
            <span>&copy; {new Date().getFullYear()} Tax1099Smart. All rights reserved.</span>
            <nav className="flex flex-wrap gap-4 font-medium">
              <Link to="/about" className="underline hover:text-slate-800">
                About &amp; Methodology
              </Link>
              <Link to="/privacy" className="underline hover:text-slate-800">
                Privacy Policy
              </Link>
              <Link to="/terms" className="underline hover:text-slate-800">
                Terms &amp; Disclaimer
              </Link>
            </nav>
          </div>
        </div>
      </footer>
    </div>
  );
}

