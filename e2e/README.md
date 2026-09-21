# SI:)SA — E2E Testing (Playwright)

Test end-to-end untuk 4 flow utama:
- `auth.spec.ts` — login Nasabah & Admin, password salah, proteksi role, logout.
- `full-journey.spec.ts` — **flow lengkap**: setor sampah (Antar Sendiri) → Admin terima → Admin verifikasi & selesaikan → poin masuk ke saldo Nasabah → Nasabah tukar poin → Admin selesaikan penukaran.
- `setoran-pickup.spec.ts` — setor sampah dengan metode **Dijemput** (termasuk tambah alamat).

## Prasyarat

1. **Database sudah di-migrate & di-seed** (data demo dipakai langsung oleh test ini):
   ```bash
   cd ../backend
   npx prisma migrate dev
   npx prisma db seed
   ```
2. **Backend harus sudah jalan manual** di `http://localhost:3001`:
   ```bash
   cd ../backend
   npm run start:dev
   ```
   (Frontend akan dinyalakan otomatis oleh Playwright lewat `webServer` di `playwright.config.ts` — tidak perlu dijalankan manual.)

## Instalasi & Menjalankan Test

```bash
cd e2e
npm install
npx playwright install --with-deps chromium   # sekali saja, download browser
npm test
```

Mode lain yang berguna:
```bash
npm run test:ui       # UI mode interaktif, enak untuk debugging
npm run test:headed   # browser terlihat (tidak headless)
npm run report        # buka laporan HTML hasil run terakhir
```

## Akun yang Dipakai Test

Semua dari seeder (`backend/prisma/seed.ts`), jangan diubah/dihapus manual selama menjalankan test:
- Admin: `admin@sisa.com` / `admin123`
- Nasabah (flow utama): `budi@sisa.com` / `nasabah123`
- Nasabah (flow pickup): `siti@sisa.com` / `nasabah123`

## Catatan

- Test ini **stateful** — `full-journey.spec.ts` benar-benar membuat data baru (setoran, poin, penukaran) di database Anda tiap kali dijalankan. Jalankan di database development/testing, jangan di database produksi.
- Kalau ingin reset state di antara run, cukup ulangi migrate+seed (`prisma migrate reset` lalu `db seed`).
