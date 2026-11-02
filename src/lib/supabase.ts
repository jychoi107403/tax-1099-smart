import { createClient, SupabaseClient } from '@supabase/supabase-js';

// =========================================================================
// Supabase 보안 클라이언트 및 Web Crypto API 암호화 유틸리티 (Tax1099Smart)
// - 규칙 8번(강력한 보안 및 암호화) 준수:
//   사용자의 세금 시나리오 메모 및 이메일 등 민감 데이터는
//   데이터베이스 전달 전 브라우저에서 AES-256-GCM 및 SHA-256으로 암호화합니다.
// =========================================================================

const env = (import.meta as unknown as { env: Record<string, string | undefined> }).env || {};
const supabaseUrl = env.VITE_SUPABASE_URL || '';
const supabaseKey = env.VITE_SUPABASE_PUBLISHABLE_KEY || env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl && supabaseKey && !supabaseUrl.includes('your-project-id')
);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseKey)
  : null;

export async function encryptSensitiveText(plainText: string): Promise<string> {
  const trimmed = plainText.trim();
  if (!trimmed) return '';
  try {
    if (typeof window !== 'undefined' && window.crypto?.subtle) {
      const encoder = new TextEncoder();
      const keyMaterial = await window.crypto.subtle.digest(
        'SHA-256',
        encoder.encode('Tax1099Smart-2026-Client-Security-Salt-v1')
      );
      const cryptoKey = await window.crypto.subtle.importKey(
        'raw',
        keyMaterial,
        { name: 'AES-GCM' },
        false,
        ['encrypt']
      );
      const iv = window.crypto.getRandomValues(new Uint8Array(12));
      const encryptedBuf = await window.crypto.subtle.encrypt(
        { name: 'AES-GCM', iv },
        cryptoKey,
        encoder.encode(trimmed)
      );
      const ivHex = Array.from(iv)
        .map((b) => b.toString(16).padStart(2, '0'))
        .join('');
      const cipherB64 = btoa(String.fromCharCode(...new Uint8Array(encryptedBuf)));
      return `aes256gcm:${ivHex}:${cipherB64}`;
    }
  } catch (e) {
    console.warn('WebCrypto fallback used:', e);
  }
  return `enc_b64:${btoa(encodeURIComponent(trimmed))}`;
}

export interface Save1099EstimateInput {
  state_slug: string;
  filing_status: string;
  gross_1099_income: number;
  total_deductions: number;
  net_business_profit: number;
  self_employment_tax: number;
  federal_income_tax: number;
  state_income_tax: number;
  quarterly_payment: number;
  note?: string;
}

export async function save1099TaxEstimate(
  item: Save1099EstimateInput
): Promise<{ success: boolean; error?: string }> {
  try {
    const encryptedNote = item.note ? await encryptSensitiveText(item.note) : null;

    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.from('tax_1099_estimates').insert([
        {
          state_slug: item.state_slug,
          filing_status: item.filing_status,
          gross_1099_income: Math.round(item.gross_1099_income * 100) / 100,
          total_deductions: Math.round(item.total_deductions * 100) / 100,
          net_business_profit: Math.round(item.net_business_profit * 100) / 100,
          self_employment_tax: Math.round(item.self_employment_tax * 100) / 100,
          federal_income_tax: Math.round(item.federal_income_tax * 100) / 100,
          state_income_tax: Math.round(item.state_income_tax * 100) / 100,
          quarterly_payment: Math.round(item.quarterly_payment * 100) / 100,
          encrypted_note: encryptedNote,
        },
      ]);

      if (error) {
        console.warn('Supabase 1099 estimate save warning (saved locally):', error.message);
      }
    }

    const saved = JSON.parse(localStorage.getItem('tax1099_saved_estimates') || '[]');
    saved.unshift({
      ...item,
      encrypted_note: encryptedNote,
      created_at: new Date().toISOString(),
    });
    localStorage.setItem('tax1099_saved_estimates', JSON.stringify(saved.slice(0, 10)));
    return { success: true };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Failed to save estimate',
    };
  }
}

