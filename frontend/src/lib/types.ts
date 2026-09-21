export type Role = 'ADMIN' | 'NASABAH';

export type StatusSetoran =
  | 'DIAJUKAN'
  | 'DITERIMA'
  | 'SUDAH_DISCAN'
  | 'DIVERIFIKASI'
  | 'DITOLAK'
  | 'SELESAI'
  | 'DIBATALKAN';

export type StatusPenukaran = 'DIPROSES' | 'SELESAI' | 'DITOLAK' | 'DIBATALKAN';
export type MetodeSetoran = 'ANTAR_SENDIRI' | 'DIJEMPUT';

export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string | null;
  role: Role;
  pointBalance?: number;
  createdAt?: string;
}

export interface Address {
  id: string;
  label?: string | null;
  fullAddress: string;
  isPrimary: boolean;
}

export interface KategoriSampah {
  id: string;
  nama: string;
  hargaPerKg: number;
  poinPerKg: number;
  aktif: boolean;
  foto?: string | null;
  foto_url?: string | null;
}

export interface SetoranItem {
  id: string;
  kategoriSampahId: string;
  namaKategoriSnapshot: string;
  hargaPerKgSnapshot: number;
  poinPerKgSnapshot: number;
  beratPerkiraan: number;
  beratReal?: number | null;
  poinDidapat?: number | null;
  kategoriSampah?: KategoriSampah;
}

export interface Setoran {
  id: string;
  kode: string;
  userId: string;
  user?: { id: string; name: string; email: string };
  metode: MetodeSetoran;
  status: StatusSetoran;
  addressSnapshot?: string | null;
  tanggalPickup?: string | null;
  waktuPickupMulai?: string | null;
  waktuPickupSelesai?: string | null;
  qrCode?: string | null;
  discanPada?: string | null;
  discanOleh?: string | null;
  alasanTolak?: string | null;
  totalBeratReal?: number | null;
  totalPoin?: number | null;
  items: SetoranItem[];
  verifiedAt?: string | null;
  completedAt?: string | null;
  createdAt: string;
}

export interface Hadiah {
  id: string;
  nama: string;
  deskripsi?: string | null;
  poinDibutuhkan: number;
  stok: number;
  gambarUrl?: string | null;
  statusStok?: 'TERSEDIA' | 'HABIS';
}

export interface Penukaran {
  id: string;
  kode: string;
  userId: string;
  user?: { id: string; name: string; email: string };
  hadiahId: string;
  hadiah?: Hadiah;
  namaHadiahSnapshot: string;
  poinTerpakai: number;
  status: StatusPenukaran;
  createdAt: string;
}

export interface DashboardNasabah {
  saldoPoin: number;
  totalSampahDisetorKg: number;
  totalPoinDidapat: number;
  totalPoinDitukar: number;
  transaksiTerakhir: Setoran[];
}

export interface DashboardAdmin {
  totalNasabah: number;
  totalPengajuan: number;
  totalSampahKg: number;
  totalPoin: number;
  totalPenukaran: number;
  transaksiTerbaru: Setoran[];
  statistikBulanan: { bulan: string; totalKg: number; totalPoin: number }[];
}

export interface LaporanBulanan {
  periode: { bulan: number; tahun: number };
  totalKg: number;
  totalTon: number;
  estimasiPembayaran: number;
  totalPoinDiterbitkan: number;
  breakdownKategori: {
    kategori: string;
    totalBeratReal: number;
    totalPoin: number;
    estimasi: number;
  }[];
  rekapPenukaran: {
    totalPenukaran: number;
    totalPoinDitukar: number;
    selesai: number;
    diproses: number;
    dibatalkan: number;
  };
}
