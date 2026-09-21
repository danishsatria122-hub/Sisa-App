# PRD — SI:)SA

**Versi:** 1.0  
**Status:** Draft  
**Produk:** SI:)SA  
**Tagline:** *A little smile for things left behind.*  
**Core Concept:** *Yang tersisa bukan berarti tidak bernilai.*

---

## 1. Product Overview

**SI:)SA** adalah platform digital Bank Sampah yang membantu Nasabah mengelola setoran sampah daur ulang, memperoleh poin berdasarkan hasil penimbangan, serta menukarkan poin dengan hadiah.

Sistem memiliki dua pengguna utama:

1. **Nasabah**, yaitu siswa/masyarakat yang melakukan penyetoran dan penukaran poin.
2. **Admin Bank Sampah**, yaitu pengelola yang menangani kategori sampah, verifikasi setoran, hadiah, penukaran, Nasabah, dan laporan.

> **Catatan scope:** App Maker dari kontrak/API tidak dijadikan role yang tampil kepada pengguna. Produk user-facing berfokus pada Nasabah dan Admin.

---

## 2. Source of Truth & Scope

Requirement dari soal/kontrak API menjadi baseline implementasi. PRD ini menambahkan keputusan produk SI:)SA yang telah disepakati.

### Requirement soal

- Authentication
- Dashboard Nasabah
- Pengajuan dan histori setoran
- Verifikasi/penimbangan oleh Admin
- Kategori sampah, harga/kg, dan poin/kg
- Hadiah dan penukaran poin
- CRUD Nasabah
- Dashboard Admin
- Rekap/laporan bulanan
- Nota/bukti transaksi

### Product Decision SI:)SA

Pengembangan produk:

- metode **Antar Sendiri** dan **Dijemput**;
- QR transaksi untuk menghubungkan Nasabah dengan pengajuan;
- alamat dan jadwal pickup;
- Admin merangkap petugas lapangan;
- aturan pembatalan, stok, dan pengembalian poin.

Pengembangan tidak boleh menghilangkan atau mengubah requirement wajib soal.

---

# 3. Problem Statement

Pengelolaan Bank Sampah secara konvensional dapat menimbulkan:

- pencatatan setoran manual;
- Nasabah sulit memantau histori dan poin;
- proses verifikasi berat dan poin perlu dicatat konsisten;
- informasi hadiah dan penukaran tidak terpusat;
- Admin membutuhkan rekap aktivitas.

SI:)SA mendigitalisasi proses tersebut secara terstruktur.

---

# 4. Product Goals

### G1 — Digitalisasi Penyetoran
Nasabah dapat membuat pengajuan setoran dan memantau statusnya.

### G2 — Transparansi Poin
Nasabah dapat mengetahui kategori, harga/kg, poin/kg, berat real, dan poin yang diperoleh.

### G3 — Verifikasi Terkontrol
Admin menentukan berat real dan poin final.

### G4 — Digitalisasi Penukaran
Nasabah dapat melihat katalog hadiah dan menukarkan poin.

### G5 — Pengelolaan Bank Sampah
Admin dapat mengelola kategori, hadiah, Nasabah, transaksi, dan penukaran.

### G6 — Pelaporan
Admin dapat melihat rekap aktivitas berdasarkan periode bulanan.

---

# 5. User Roles

## 5.1 Nasabah

- Registrasi/login
- Dashboard
- Profil
- Pengajuan setoran
- Pilih antar/pickup
- Pilih kategori dan berat perkiraan
- Status pengajuan
- QR transaksi
- Saldo dan histori poin
- Katalog hadiah
- Penukaran poin
- Riwayat penukaran
- Nota transaksi

## 5.2 Admin Bank Sampah

- Login
- Dashboard
- CRUD kategori sampah
- CRUD Nasabah
- CRUD hadiah
- Kelola pengajuan
- Terima/tolak pengajuan
- Menangani pickup
- Scan QR
- Penimbangan dan verifikasi
- Mengubah/menambah/menghapus item hasil verifikasi
- Memproses penukaran
- Laporan bulanan

---

# 6. Core Product Loop

```text
Nasabah membuat pengajuan
        ↓
Memilih metode setoran
        ↓
Serah-terima sampah
        ↓
QR transaksi
        ↓
Admin scan QR
        ↓
Admin verifikasi & menimbang
        ↓
Berat real
        ↓
Sistem menghitung poin
        ↓
Transaksi selesai
        ↓
Poin masuk ke saldo Nasabah
```

---

# 7. Functional Requirements

## FR-01 — Authentication

Nasabah dan Admin dapat login sesuai role dan memperoleh access token. Endpoint yang membutuhkan autentikasi menggunakan JWT sesuai kontrak API.

## FR-02 — Dashboard Nasabah

Menampilkan:

- saldo poin;
- total sampah disetor;
- total poin didapat;
- total poin ditukar;
- transaksi terakhir.

## FR-03 — Pengajuan Setoran

Nasabah membuat pengajuan dengan beberapa item. Setiap item memiliki:

- kategori sampah;
- berat perkiraan.

Contoh:

```text
Botol Plastik PET — 5 kg
Kardus — 3 kg
```

## FR-04 — Metode Setoran

### Antar Sendiri
Nasabah membawa sampah ke Bank Sampah.

### Dijemput
Nasabah menentukan:

- alamat pickup;
- tanggal;
- rentang waktu.

Alamat utama tersimpan di profil dan dapat dipakai kembali atau diganti pada pengajuan tertentu. Alamat yang tersimpan pada pengajuan menjadi snapshot transaksi.

## FR-05 — QR Setoran

QR merepresentasikan pengajuan/transaksi setoran, bukan identitas permanen Nasabah.

QR digunakan untuk mengidentifikasi transaksi dan membuka detail pengajuan bagi Admin.

QR aktif ketika Nasabah sudah berada pada tahap serah-terima, baik di lokasi Bank Sampah maupun saat pickup.

> QR hanya menghubungkan Nasabah dengan transaksi. QR tidak menghitung poin.

## FR-06 — Verifikasi & Penimbangan

Nasabah memasukkan berat perkiraan. Admin melakukan penimbangan fisik dan memasukkan berat real.

Admin dapat:

- mengubah kategori;
- menambah item;
- menghapus item;
- memasukkan berat real.

Poin final berdasarkan hasil penimbangan real.

## FR-07 — Point System

Formula:

```text
Poin = Berat Real × Poin/kg
```

Berat pecahan seperti `2.5 kg` diperbolehkan.

Poin tidak memiliki masa berlaku.

## FR-08 — Kategori Sampah

Admin memiliki CRUD kategori.

Data minimal:

- nama;
- harga/kg;
- poin/kg;
- status aktif/nonaktif.

Nasabah dapat melihat jenis sampah, harga/kg, dan poin/kg.

Kategori nonaktif tidak dapat dipilih untuk pengajuan baru, tetapi histori transaksi tetap aman.

## FR-09 — Status Setoran

Status utama mengikuti kebutuhan soal, termasuk:

- `diajukan`;
- `diverifikasi`;
- `ditolak`;
- `selesai`.

Status tambahan dapat digunakan untuk flow pickup/QR bila diperlukan tanpa menghilangkan status wajib.

## FR-10 — Pembatalan Setoran

Nasabah dapat membatalkan pengajuan selama Admin belum memprosesnya.

## FR-11 — Penolakan Setoran

Admin dapat menolak pengajuan. Alasan penolakan wajib diisi dan dapat dilihat Nasabah.

## FR-12 — Riwayat Setoran

Menampilkan kode transaksi, tanggal, status, item/kategori, berat, dan poin.

## FR-13 — Hadiah

Nasabah melihat katalog hadiah dengan:

- nama;
- deskripsi;
- poin yang dibutuhkan;
- stok.

Admin memiliki CRUD hadiah.

Jika stok `0`, hadiah tetap ditampilkan dengan status **Habis** dan tidak dapat ditukar.

## FR-14 — Penukaran Poin

Nasabah hanya dapat menukar jika saldo cukup.

Jika saldo kurang:

- tombol **Tukar** disabled;
- tampilkan kekurangan poin.

Saat penukaran berhasil dibuat, poin langsung dikurangi dan status menjadi `diproses`.

Jika penukaran ditolak/dibatalkan, poin dikembalikan otomatis.

## FR-15 — Pengambilan Hadiah

Untuk MVP, hadiah fisik diambil sendiri oleh Nasabah di Bank Sampah. Tidak ada delivery hadiah.

## FR-16 — Riwayat Penukaran

Menampilkan kode penukaran, hadiah, poin terpakai, status, dan tanggal.

## FR-17 — Nota Setoran

Dapat dilihat/dicetak setelah transaksi selesai, berisi:

- kode transaksi;
- tanggal;
- kategori/item;
- berat real;
- harga/kg;
- poin/kg;
- total poin.

## FR-18 — Nota Penukaran

Berisi:

- kode penukaran;
- hadiah;
- poin terpakai;
- status;
- tanggal.

## FR-19 — Dashboard Admin

Menampilkan:

- total Nasabah;
- total pengajuan/setoran;
- total sampah;
- total poin;
- total penukaran;
- transaksi terbaru;
- statistik bulanan.

## FR-20 — Pengelolaan Nasabah

Admin dapat melihat, menambah, mengubah, dan menghapus Nasabah.

## FR-21 — Laporan Bulanan

Admin memilih bulan dan tahun lalu melihat:

- total kg;
- total ton;
- estimasi pembayaran;
- total poin diterbitkan;
- breakdown jenis sampah;
- rekap penukaran poin.

Laporan dapat dilihat dan dicetak/export.

---

# 8. Business Rules

| ID | Rule |
|---|---|
| BR-01 | Nasabah hanya dapat memilih kategori aktif. |
| BR-02 | Berat perkiraan berasal dari Nasabah. |
| BR-03 | Berat real ditentukan Admin. |
| BR-04 | Poin final dihitung berdasarkan berat real. |
| BR-05 | Nasabah tidak menentukan poin manual. |
| BR-06 | Pengajuan dapat dibatalkan sebelum Admin memprosesnya. |
| BR-07 | Penolakan pengajuan wajib memiliki alasan. |
| BR-08 | Poin tidak expired. |
| BR-09 | Penukaran membutuhkan saldo yang cukup. |
| BR-10 | Poin dikurangi saat penukaran berhasil dibuat. |
| BR-11 | Poin dikembalikan jika penukaran ditolak/dibatalkan. |
| BR-12 | Hadiah stok 0 tidak dapat ditukar. |
| BR-13 | Kategori nonaktif tidak tersedia untuk transaksi baru. |
| BR-14 | Histori transaksi tidak berubah karena perubahan master data. |
| BR-15 | Nilai harga/poin yang digunakan transaksi dipertahankan sebagai snapshot saat transaksi diproses. |
| BR-16 | QR mengidentifikasi transaksi, bukan akun permanen Nasabah. |
| BR-17 | Admin adalah role yang melakukan verifikasi/penimbangan. |
| BR-18 | Admin juga menangani proses pickup. |

---

# 9. Pickup Flow

```text
Nasabah pilih Dijemput
        ↓
Pilih/ganti alamat
        ↓
Pilih tanggal
        ↓
Pilih rentang waktu
        ↓
Review
        ↓
Kirim pengajuan
        ↓
Menunggu konfirmasi
        ↓
Admin menerima
        ↓
Terjadwal
        ↓
Admin datang
        ↓
Serah-terima + QR
        ↓
Scan
        ↓
Timbang
        ↓
Verifikasi
```

---

# 10. MVP Scope

### Nasabah

- Authentication
- Dashboard
- Profil
- Pengajuan setoran
- Antar sendiri
- Pickup
- QR setoran
- Status setoran
- Riwayat
- Saldo poin
- Katalog hadiah
- Penukaran
- Riwayat penukaran
- Nota

### Admin

- Authentication
- Dashboard
- CRUD kategori
- CRUD Nasabah
- CRUD hadiah
- Pengelolaan setoran
- QR scanner
- Verifikasi & penimbangan
- Pengelolaan penukaran
- Laporan bulanan
- Cetak/export

---

# 11. Non-Goals

Tidak termasuk MVP:

- role Petugas terpisah;
- delivery hadiah;
- payment gateway;
- chat;
- marketplace;
- social feed;
- gamification kompleks;
- GPS/live tracking pickup;
- notifikasi real-time kompleks;
- dashboard App Maker.

---

# 12. UX & Brand Principles

### Brand

**SI:)SA**  
*A little smile for things left behind.*

**Core concept:**  
*Yang tersisa bukan berarti tidak bernilai.*

**Personality:** Charming & Playful.

### Visual Direction

- Primary logo: `SI:)SA`
- Logo typeface: Bagel Fat One
- Supporting/UI typeface: Google Sans
- Brand symbol: `:)`
- Symbol: bold, cute, slightly imperfect, rounded/oval eyes, compact smile, solid shape, calm expression.

### Design Principles

1. **Playfulness lives in the details.**
2. **Clear before cute.**
3. **Reward the action.**
4. **Human & warm.**

---

# 13. Brand Colors

| Token | Value | Purpose |
|---|---|---|
| Primary Green | `#68E36D` | Brand accent |
| Functional Green | `#4CAF50` | UI/action |
| Soft Green | `#AFD794` | Supporting |
| Smile Yellow | `#FAEF8A` | Smile/reward accent |
| Digital Accent | `#C7E6E9` | Supporting digital accent |

---

# 14. Technical Direction

## Frontend

- Next.js / React
- TypeScript
- Tailwind CSS

## Backend

- NestJS
- TypeScript
- REST API
- JWT Authentication

## Database

- PostgreSQL

## ORM

- Prisma

## API Documentation

- Swagger / OpenAPI

Kontrak API dari soal menjadi acuan implementasi endpoint dan struktur request/response.

---

# 15. High-Level Data Domains

ERD final belum dikunci. Domain utama yang perlu dipertimbangkan:

```text
User / Nasabah
      │
      ├── Profile / Address
      │
      ├── Setoran
      │      └── Setoran Item
      │              └── Kategori Sampah
      │
      ├── Point Balance
      │
      └── Penukaran
              └── Hadiah
```

ERD final dibuat setelah User Flow dan Information Architecture disepakati.

---

# 16. Success Criteria

### Nasabah

```text
Register
→ Login
→ Membuat pengajuan
→ Memilih sampah
→ Memasukkan berat perkiraan
→ Serah-terima
→ QR
→ Verifikasi Admin
→ Mendapat poin
→ Melihat hadiah
→ Menukar poin
```

### Admin

```text
Login
→ Melihat pengajuan
→ Menerima/menolak
→ Scan QR
→ Menimbang
→ Memasukkan berat real
→ Menyelesaikan transaksi
→ Mengelola kategori
→ Mengelola hadiah
→ Memproses penukaran
→ Melihat laporan
```

### Data Integrity

Sistem harus menjaga konsistensi:

```text
Setoran
↓
Berat Real
↓
Poin
↓
Saldo
↓
Penukaran
↓
Sisa Saldo
```

---

# 17. Scope Control

Fitur tambahan selama pengembangan harus dievaluasi terhadap:

1. requirement soal;
2. nilai/tujuan fitur;
3. kompleksitas implementasi;
4. risiko terhadap scope UKK.

Tidak semua ide yang menarik harus masuk MVP.

---

# 18. Next Steps

```text
PRD
 ↓
01. Core User Flow
 ↓
02. Detailed User Flow
 ↓
03. Information Architecture
 ↓
04. Page / Feature Inventory
 ↓
05. Database / ERD
 ↓
06. API Mapping
 ↓
07. UI/UX
 ↓
08. Development
```

**Next:** menyelesaikan **Core User Flow: Setor Sampah → QR → Verifikasi → Poin**.
