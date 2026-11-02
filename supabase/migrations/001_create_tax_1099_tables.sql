-- ==============================================================================
-- 001_create_tax_1099_tables.sql
-- 목적: Tax1099Smart 사이트의 프리랜서 분기별 세금 계산 시나리오 저장 및 보안 피드백 테이블 생성
-- 규칙 준수:
--   1. 파일명 앞에 001_ 순서 번호 부여 및 supabase/migrations 폴더 내 정리
--   2. 모든 사용자 메모 및 식별 정보는 클라이언트에서 AES-256-GCM / SHA-256 암호화 후 저장
--   3. Row Level Security (RLS) 활성화로 익명 사용자의 타인 데이터 조회 원천 차단
-- ==============================================================================

-- 1. 1099 세금 및 분기별 예납 시나리오 저장 테이블
CREATE TABLE IF NOT EXISTS public.tax_1099_estimates (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    state_slug VARCHAR(64) NOT NULL,            -- 선택한 주 슬러그 (예: 'california', 'texas')
    filing_status VARCHAR(32) NOT NULL,         -- 'single', 'married', 'head_of_household'
    gross_1099_income NUMERIC(12, 2) NOT NULL,  -- 총 1099 수입 ($)
    total_deductions NUMERIC(12, 2) NOT NULL,   -- 총 비즈니스 경비 공제액 ($)
    net_business_profit NUMERIC(12, 2) NOT NULL,-- 순수 자영업 이익 ($)
    self_employment_tax NUMERIC(12, 2) NOT NULL,-- 15.3% 자영업세 ($)
    federal_income_tax NUMERIC(12, 2) NOT NULL, -- 연방 소득세 ($)
    state_income_tax NUMERIC(12, 2) NOT NULL,   -- 주 소득세 ($)
    quarterly_payment NUMERIC(12, 2) NOT NULL,  -- 분기별 예납 세액 ($)
    encrypted_note TEXT                         -- 클라이언트 AES-256-GCM 암호화된 시나리오 메모
);

CREATE INDEX IF NOT EXISTS idx_tax_1099_estimates_state ON public.tax_1099_estimates (state_slug);
CREATE INDEX IF NOT EXISTS idx_tax_1099_estimates_created_at ON public.tax_1099_estimates (created_at DESC);

ALTER TABLE public.tax_1099_estimates ENABLE ROW LEVEL SECURITY;

-- 익명/인증 사용자 모두 자신의 계산 결과를 저장(INSERT) 가능하지만 타인 기록 조회(SELECT)는 차단
CREATE POLICY "Allow anonymous 1099 tax estimate insert"
    ON public.tax_1099_estimates
    FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

-- 2. 사이트 보안 피드백 테이블
CREATE TABLE IF NOT EXISTS public.tax_1099_feedbacks (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    category VARCHAR(50) NOT NULL,
    email_sha256_hash VARCHAR(128),
    encrypted_contact TEXT,
    message TEXT NOT NULL,
    page_url TEXT,
    status VARCHAR(30) DEFAULT 'new' NOT NULL
);

ALTER TABLE public.tax_1099_feedbacks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anonymous 1099 feedback insert"
    ON public.tax_1099_feedbacks
    FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

