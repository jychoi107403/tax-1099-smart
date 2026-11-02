// =========================================================================
// 57개 전체 페이지 정적 HTML 사전 생성(Pre-rendering / SSG) 스크립트 (Tax1099Smart)
// =========================================================================

import { readFileSync, mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const DIST = join(ROOT, 'dist');
const STATES_TS = join(ROOT, 'src', 'data', 'taxStates.ts');

const SITE_ORIGIN = 'https://1099tax.bangjang.net';

function esc(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

const baseHtml = readFileSync(join(DIST, 'index.html'), 'utf8');

const stateRegex =
  /\{\s*slug:\s*'([^']+)',\s*name:\s*'([^']+)',\s*abbr:\s*'([^']+)',\s*hasStateIncomeTax:\s*(true|false),\s*avgEffectiveTaxPct:\s*([0-9.]+),\s*topMarginalTaxPct:\s*([0-9.]+),\s*annualLlcFee:\s*([0-9]+),\s*taxRuleNote:\s*'([^']+)'\s*\}/g;

const states = [...readFileSync(STATES_TS, 'utf8').matchAll(stateRegex)].map((m) => ({
  slug: m[1],
  name: m[2],
  abbr: m[3],
  hasStateIncomeTax: m[4] === 'true',
  avgEffectiveTaxPct: Number(m[5]),
  topMarginalTaxPct: Number(m[6]),
  annualLlcFee: Number(m[7]),
  taxRuleNote: m[8],
}));

if (states.length !== 51) {
  console.error(`주 데이터 파싱 실패: ${states.length}개`);
  process.exit(1);
}

function writePageHtml({ routePath, title, description, heading, summaryHtml, faqItems }) {
  const canonical = `${SITE_ORIGIN}${routePath}`;
  let html = baseHtml;

  html = html.replace(/<title>[\s\S]*?<\/title>/, `<title>${esc(title)}</title>`);
  html = html.replace(
    /<meta\s+name="title"\s+content="[^"]*"\s*\/>/,
    `<meta name="title" content="${esc(title)}" />`
  );
  html = html.replace(
    /<meta\s+name="description"\s+content="[^"]*"\s*\/>/,
    `<meta name="description" content="${esc(description)}" />`
  );
  html = html.replace(
    /<link\s+rel="canonical"\s+href="[^"]*"\s*\/>/,
    `<link rel="canonical" href="${esc(canonical)}" />`
  );
  html = html.replace(
    /<meta\s+property="og:url"\s+content="[^"]*"\s*\/>/,
    `<meta property="og:url" content="${esc(canonical)}" />`
  );
  html = html.replace(
    /<meta\s+property="og:title"\s+content="[^"]*"\s*\/>/,
    `<meta property="og:title" content="${esc(title)}" />`
  );
  html = html.replace(
    /<meta\s+property="og:description"\s+content="[^"]*"\s*\/>/,
    `<meta property="og:description" content="${esc(description)}" />`
  );
  html = html.replace(
    /<meta\s+property="twitter:title"\s+content="[^"]*"\s*\/>/,
    `<meta property="twitter:title" content="${esc(title)}" />`
  );
  html = html.replace(
    /<meta\s+property="twitter:description"\s+content="[^"]*"\s*\/>/,
    `<meta property="twitter:description" content="${esc(description)}" />`
  );

  if (faqItems && faqItems.length > 0) {
    const faqJsonLd = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqItems.map((item) => ({
        '@type': 'Question',
        name: item.q,
        acceptedAnswer: {
          '@type': 'Answer',
          text: item.a,
        },
      })),
    };
    const scriptTag = `    <script type="application/ld+json">${JSON.stringify(faqJsonLd)}</script>\n  </head>`;
    html = html.replace('</head>', scriptTag);
  }

  const seoBody = `<div id="root"><main class="mx-auto max-w-5xl p-6"><h1 class="text-3xl font-bold text-slate-900">${esc(heading)}</h1>${summaryHtml}</main></div>`;
  html = html.replace('<div id="root"></div>', seoBody);

  const outDir = routePath === '/' ? DIST : join(DIST, ...routePath.replace(/^\//, '').split('/'));
  mkdirSync(outDir, { recursive: true });
  writeFileSync(join(outDir, 'index.html'), html, 'utf8');
}

let count = 0;

const fixedPages = [
  {
    routePath: '/',
    title: '1099 Self-Employment & Quarterly Tax Calculator 2026 | Tax1099Smart',
    description:
      'Free 2026 US 1099 self-employment and quarterly estimated tax calculator for all 50 states and DC. Calculate 15.3% SE tax, QBI deduction, business write-offs, and IRS 1040-ES quarterly payments.',
    heading: '1099 Self-Employment & Quarterly Estimated Tax Calculator',
    summaryHtml:
      '<p class="mt-2 text-slate-600">Calculate your 2026 1099 independent contractor taxes, 15.3% self-employment tax, 20% QBI deduction, mileage write-offs, and IRS quarterly tax payments across all 50 US states.</p>',
  },
  {
    routePath: '/1099-tax',
    title: '1099 Self-Employment Tax Calculator by State (2026) | Tax1099Smart',
    description:
      'Compare 2026 state income tax rates for 1099 independent contractors, no-income-tax states, and annual LLC filing fees across all 50 US states and DC.',
    heading: 'US 1099 Self-Employment & Quarterly Tax Calculator by State',
    summaryHtml:
      '<p class="mt-2 text-slate-600">Select your state to estimate your 2026 federal and state 1099 independent contractor taxes and quarterly estimated payments.</p>',
  },
  {
    routePath: '/deductions',
    title: '1099 Write-Offs & IRS Mileage Deduction Calculator (2026) | Tax1099Smart',
    description:
      'Calculate how much money you save on 1099 taxes using the 2026 IRS standard mileage rate ($0.70/mile), simplified home office deduction, and Schedule C business write-offs.',
    heading: '1099 Write-Offs & IRS Mileage Tax Savings Calculator',
    summaryHtml:
      '<p class="mt-2 text-slate-600">See how much cash you save on federal, state, and 15.3% self-employment taxes with IRS Schedule C business write-offs and mileage deductions.</p>',
  },
  {
    routePath: '/about',
    title: 'About Tax1099Smart & IRS 1099 Tax Methodology | Tax1099Smart',
    description:
      'Learn how Tax1099Smart calculates IRS Schedule C net profit, Schedule SE 15.3% self-employment tax, Section 199A QBI deduction, and Form 1040-ES quarterly taxes.',
    heading: 'About Tax1099Smart & Methodology',
    summaryHtml:
      '<p class="mt-2 text-slate-600">Tax1099Smart combines IRS Schedule C, Schedule SE, Section 199A QBI deduction rules, and 50-state tax rates.</p>',
  },
  {
    routePath: '/privacy',
    title: 'Privacy Policy | Tax1099Smart',
    description:
      'Privacy Policy for Tax1099Smart. Learn how we run 100% browser-based 1099 tax calculations, encrypt saved scenarios with AES-256, and handle advertising cookies.',
    heading: 'Privacy Policy',
    summaryHtml:
      '<p class="mt-2 text-slate-600">All 1099 tax and write-off calculations run locally in your browser with AES-256 client-side encryption for saved notes.</p>',
  },
  {
    routePath: '/terms',
    title: 'Terms of Use & Tax Disclaimer | Tax1099Smart',
    description:
      'Terms of Use and Tax Disclaimer for Tax1099Smart. All 1099 self-employment and quarterly estimated tax calculations are for educational purposes only.',
    heading: 'Terms of Use & Tax Disclaimer',
    summaryHtml:
      '<p class="mt-2 text-slate-600">All calculators and tax figures on Tax1099Smart are estimates for educational purposes only.</p>',
  },
];

for (const p of fixedPages) {
  writePageHtml(p);
  count++;
}

for (const state of states) {
  const rateText = state.hasStateIncomeTax
    ? `${state.avgEffectiveTaxPct.toFixed(2)}% Avg State Tax`
    : '0% State Income Tax';

  writePageHtml({
    routePath: `/1099-tax/${state.slug}`,
    title: `${state.name} 1099 Self-Employment & Quarterly Tax Calculator (2026)`,
    description: `Calculate your 2026 1099 independent contractor and self-employment taxes in ${state.name}. Includes 15.3% SE tax, ${rateText}, QBI deduction, and quarterly payments.`,
    heading: `${state.name} (${state.abbr}) 1099 Self-Employment & Quarterly Tax Calculator`,
    summaryHtml: `<p class="mt-2 text-slate-600">Estimate your 1099 freelancer and independent contractor taxes in ${esc(state.name)}. ${esc(state.taxRuleNote)}</p>`,
    faqItems: [
      {
        q: `How are 1099 independent contractors taxed in ${state.name}?`,
        a: `${state.taxRuleNote} In addition, all 1099 contractors pay the 15.3% federal self-employment tax (12.4% Social Security + 2.9% Medicare on 92.35% of net business profit).`,
      },
      {
        q: `How much should I set aside for 1099 taxes in ${state.name}?`,
        a: state.hasStateIncomeTax
          ? `Independent contractors in ${state.name} should typically set aside 25% to 32% of net self-employment income to cover federal income tax, 15.3% SE tax, and ${state.name} state income tax.`
          : `Because ${state.name} has 0% state personal income tax, 1099 contractors typically set aside 20% to 26% of net income for federal income tax and the 15.3% self-employment tax.`,
      },
    ],
  });
  count++;
}

console.log(`정적 HTML 사전 생성(SSG) 완료: 총 ${count}개 페이지 생성됨`);

