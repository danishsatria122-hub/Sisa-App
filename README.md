# SI:)SA — Bank Sampah Digital

Aplikasi fullstack sesuai PRD v1.0: Next.js 14 (App Router) + NestJS + PostgreSQL + Prisma.

```
sisa-app/
├── backend/     (NestJS + Prisma + PostgreSQL)
└── frontend/    (Next.js 14 App Router + Tailwind)
```

---

## 🚀 Cara Menjalankan

### 1. Database

Pastikan PostgreSQL sudah jalan (lihat opsi Docker atau native di bagian bawah), lalu buat database kosong bernama `sisa_db`.

### 2. Backend

```bash
cd backend
npm install
cp .env.example .env
# edit .env: isi DATABASE_URL (user/password/port sesuai server Anda) dan JWT_SECRET bebas string acak

npx prisma generate
npx prisma migrate dev --name init
npx prisma db seed        # membuat akun admin default

npm run start:dev
```

- API: http://localhost:3001
- Swagger docs: http://localhost:3001/api/docs
- Postman Collection & Docs: [postman/README.md](postman/README.md)

**Akun Admin default** (dibuat oleh seeder):
- Email: `admin@sisa.com`
- Password: `admin123`

Akun Nasabah dibuat lewat halaman **Register** di frontend, atau lewat endpoint `POST /auth/register`.

### 3. Frontend

```bash
cd frontend
npm install
cp .env.example .env
# pastikan NEXT_PUBLIC_API_URL mengarah ke backend (default http://localhost:3001)

npm run dev
```

Buka http://localhost:3000 — otomatis diarahkan ke `/login`.

---

## 🐘 Setup PostgreSQL (jika belum ada)

**Opsi Docker (tercepat):**
```bash
docker run --name sisa-db \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=sisa_db \
  -p 5432:5432 \
  -v sisa-db-data:/var/lib/postgresql/data \
  -d postgres:16
```
Lalu `DATABASE_URL="postgresql://postgres:postgres@localhost:5432/sisa_db?schema=public"`.

**Opsi native (Windows/Mac/Linux):** install PostgreSQL, buat database `sisa_db` lewat pgAdmin/psql, lalu sesuaikan `DATABASE_URL` dengan user/password/port server Anda.

---

## ✅ Fitur yang Sudah Diimplementasikan

### Backend — semua endpoint kontrak + Product Decision PRD
| Module | Endpoint utama |
|---|---|
| Auth | `POST /auth/register`, `POST /auth/login`, `GET /auth/me` |
| Users (Admin) | CRUD `/admin/users` |
| Kategori Sampah | CRUD `/admin/kategori-sampah`, publik `/kategori-sampah` |
| Setoran | `POST/GET/DELETE /setoran`, QR (`/setoran/:id/qr`), nota (`/setoran/:id/nota`) |
| Setoran (Admin) | filter `/admin/setoran`, terima/tolak (`/status`), `/verifikasi`, `/selesaikan`, scan (`/scan/:qrCode`) |
| Hadiah | CRUD `/admin/hadiah`, publik `/hadiah` |
| Penukaran | `POST/GET /penukaran`, nota; Admin: filter + ubah status (refund otomatis saat batal) |
| Address | CRUD `/addresses` (milik Nasabah sendiri) |
| Laporan | `/dashboard`, `/admin/dashboard`, `/admin/laporan/bulanan` |

### Frontend — semua halaman Tahap 5–7
**Nasabah:** Login, Register, Dashboard, Pengajuan Setoran (4 langkah), Riwayat + Detail Setoran, QR Code, Nota (cetak), Katalog Hadiah, Riwayat Penukaran, Profil + CRUD Alamat.
**Admin:** Dashboard (grafik 6 bulan), Kelola Pengajuan (filter + terima/tolak/scan QR), Verifikasi Setoran (edit item dinamis + hitung poin live), CRUD Kategori/Hadiah/Nasabah, Kelola Penukaran, Laporan Bulanan (cetak).

**Tahap 8 (Polishing)** — sudah termasuk sejak awal: skeleton loading, empty state, toast notification, modal konfirmasi untuk aksi destruktif, validasi form (react-hook-form + zod di form auth), responsive (mobile nav/sidebar), halaman cetak nota/laporan, role-based redirect di middleware.

---

## ⚠️ Keputusan Desain yang Perlu Anda Ketahui

Beberapa hal di PRD punya celah/ambiguitas yang saya putuskan secara eksplisit — cek apakah sesuai ekspektasi Anda (misalnya rubrik penilaian UKK):

1. **Alur status Setoran**: `DIAJUKAN → DITERIMA → DIVERIFIKASI → SELESAI` (atau `DITOLAK`/`DIBATALKAN`). Tombol **"Selesaikan Verifikasi"** di frontend memanggil endpoint `/verifikasi` lalu `/selesaikan` sekaligus dalam satu klik — poin baru masuk ke saldo Nasabah pada langkah `selesaikan`. Ini dipilih supaya status `diverifikasi` (wajib ada per FR-09) tetap benar-benar tersimpan sebagai state, bukan cuma dilewati.
2. **QR library**: pakai `html5-qrcode` (bukan `react-qr-reader` yang disebut di prompt awal — sudah tidak actively maintained). API dan hasil akhirnya setara. Ada fallback input manual kalau kamera tidak tersedia/diizinkan.
3. **bcrypt → bcryptjs**: supaya tidak perlu native build tools di Windows.
4. **Nota & QR Code**: digabung ke dalam `SetoranModule`/`PenukaranModule` (bukan module terpisah) karena satu domain data — endpoint-nya tetap persis sesuai kontrak Tahap 4.
5. **Update profil Nasabah**: PRD hanya minta "informasi pribadi" ditampilkan + CRUD alamat, jadi nama/email/no. HP di halaman Profil bersifat read-only (edit oleh Nasabah sendiri belum ada endpoint-nya). Admin tetap bisa mengubah data Nasabah lewat `/admin/users`.
6. **Upload gambar Hadiah**: belum ada (form pakai field `gambarUrl` opsional saja, tampilan pakai ikon placeholder 🎁) — sesuai instruksi awal ("upload gambar placeholder").

---

## 🧪 Testing (Tahap 9)

E2E test dengan Playwright ada di folder `e2e/` — lihat `e2e/README.md` untuk cara menjalankan. Cakupan: login Nasabah/Admin, flow setor sampah (Antar Sendiri & Dijemput), flow verifikasi Admin, dan flow tukar poin, semuanya menggunakan akun & data demo dari seeder.

Seeder (`backend/prisma/seed.ts`) juga sudah menyediakan data demo siap pakai:
- 1 Admin (`admin@sisa.com` / `admin123`)
- 3 Nasabah (`budi@sisa.com`, `siti@sisa.com`, `andi@sisa.com`, semua password `nasabah123`)
- 6 kategori sampah, 5 hadiah (termasuk 1 dengan stok 0 untuk menguji status "Habis")

Jalankan seeder dengan `npx prisma db seed` di folder `backend`.

---

## 🚀 Deployment

Arsitektur yang disarankan: **Vercel** (frontend) + **Railway/Render** (backend) + **Supabase/Neon** (PostgreSQL). Semua punya free tier yang cukup untuk demo/UKK.

### 1. Database — Supabase atau Neon.tech

1. Buat project baru di [supabase.com](https://supabase.com) atau [neon.tech](https://neon.tech).
2. Salin **connection string** (pilih mode "Connection Pooling" jika tersedia, lebih stabil untuk serverless).
3. Simpan string ini — dipakai sebagai `DATABASE_URL` di langkah backend.

### 2. Backend — Railway atau Render

**Railway:**
1. `railway.app` → New Project → Deploy from GitHub repo → pilih folder `backend` sebagai root.
2. Set environment variables di tab Variables:
   ```
   DATABASE_URL=<connection string dari Supabase/Neon>
   JWT_SECRET=<string acak yang panjang>
   JWT_EXPIRES_IN=1d
   FRONTEND_URL=<URL Vercel Anda, isi setelah langkah 3>
   PORT=3001
   ```
3. Build command: `npm install && npx prisma generate && npm run build`
   Start command: `npx prisma migrate deploy && npm run start:prod`
4. Setelah deploy sukses, jalankan seeder sekali via Railway's shell/CLI: `npx prisma db seed`.
5. Catat URL backend yang di-generate (misal `https://sisa-backend.up.railway.app`).

**Render** caranya serupa: New → Web Service → root directory `backend`, isi environment variables yang sama, build command dan start command sama seperti di atas.

### 3. Frontend — Vercel

1. `vercel.com` → New Project → import repo, pilih folder `frontend` sebagai root.
2. Environment variable:
   ```
   NEXT_PUBLIC_API_URL=<URL backend dari langkah 2>
   ```
3. Deploy. Setelah dapat URL Vercel, kembali ke Railway/Render dan update `FRONTEND_URL` supaya CORS backend mengizinkan origin frontend production.

### Checklist setelah deploy

- [ ] Buka `<backend-url>/api/docs` — Swagger harus bisa diakses.
- [ ] Login dengan akun admin default di frontend production.
- [ ] Cek CORS: kalau request dari frontend gagal karena CORS, pastikan `FRONTEND_URL` di backend match persis dengan domain Vercel (termasuk `https://`, tanpa trailing slash).
- [ ] Ganti `JWT_SECRET` production dengan string acak baru (jangan pakai nilai dari `.env.example`).

---

## 📁 Struktur Data (schema.prisma)

`User` (role ADMIN/NASABAH) · `Address` · `KategoriSampah` · `Setoran` + `SetoranItem` (dengan field `*Snapshot` untuk BR-14/BR-15) · `Hadiah` · `Penukaran`.
