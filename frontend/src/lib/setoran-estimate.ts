export interface SetoranEstimate {
  harga: number;
  poin: number;
}

export function getSetoranEstimate(
  beratPerkiraan: number,
  hargaPerKg: number,
  poinPerKg: number,
): SetoranEstimate {
  return {
    harga: beratPerkiraan * hargaPerKg,
    poin: Math.round(beratPerkiraan * poinPerKg),
  };
}

export function formatRupiah(value: number): string {
  return `Rp${Math.round(value).toLocaleString('id-ID')}`;
}