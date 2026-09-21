/**
 * Generate kode unik dengan prefix, format: PREFIX-YYYYMMDD-XXXX
 * Contoh: SETOR-20260901-A1B2
 */
export function generateKode(prefix: string): string {
  const date = new Date();
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}-${y}${m}${d}-${random}`;
}
