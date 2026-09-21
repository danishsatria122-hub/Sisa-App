-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'NASABAH');

-- CreateEnum
CREATE TYPE "MetodeSetoran" AS ENUM ('ANTAR_SENDIRI', 'DIJEMPUT');

-- CreateEnum
CREATE TYPE "StatusSetoran" AS ENUM ('DIAJUKAN', 'DITERIMA', 'DIVERIFIKASI', 'DITOLAK', 'SELESAI', 'DIBATALKAN');

-- CreateEnum
CREATE TYPE "StatusPenukaran" AS ENUM ('DIPROSES', 'SELESAI', 'DITOLAK', 'DIBATALKAN');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT,
    "role" "Role" NOT NULL DEFAULT 'NASABAH',
    "pointBalance" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "addresses" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "label" TEXT,
    "fullAddress" TEXT NOT NULL,
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "addresses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "kategori_sampah" (
    "id" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "hargaPerKg" DECIMAL(12,2) NOT NULL,
    "poinPerKg" DECIMAL(12,2) NOT NULL,
    "aktif" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "kategori_sampah_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "setoran" (
    "id" TEXT NOT NULL,
    "kode" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "metode" "MetodeSetoran" NOT NULL,
    "status" "StatusSetoran" NOT NULL DEFAULT 'DIAJUKAN',
    "addressId" TEXT,
    "addressSnapshot" TEXT,
    "tanggalPickup" TIMESTAMP(3),
    "waktuPickupMulai" TEXT,
    "waktuPickupSelesai" TEXT,
    "qrCode" TEXT,
    "alasanTolak" TEXT,
    "totalBeratReal" DECIMAL(12,2),
    "totalPoin" INTEGER,
    "verifiedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "setoran_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "setoran_items" (
    "id" TEXT NOT NULL,
    "setoranId" TEXT NOT NULL,
    "kategoriSampahId" TEXT NOT NULL,
    "namaKategoriSnapshot" TEXT NOT NULL,
    "hargaPerKgSnapshot" DECIMAL(12,2) NOT NULL,
    "poinPerKgSnapshot" DECIMAL(12,2) NOT NULL,
    "beratPerkiraan" DECIMAL(12,2) NOT NULL,
    "beratReal" DECIMAL(12,2),
    "poinDidapat" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "setoran_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "hadiah" (
    "id" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "deskripsi" TEXT,
    "poinDibutuhkan" INTEGER NOT NULL,
    "stok" INTEGER NOT NULL DEFAULT 0,
    "gambarUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "hadiah_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "penukaran" (
    "id" TEXT NOT NULL,
    "kode" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "hadiahId" TEXT NOT NULL,
    "namaHadiahSnapshot" TEXT NOT NULL,
    "poinTerpakai" INTEGER NOT NULL,
    "status" "StatusPenukaran" NOT NULL DEFAULT 'DIPROSES',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "penukaran_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "setoran_kode_key" ON "setoran"("kode");

-- CreateIndex
CREATE UNIQUE INDEX "setoran_qrCode_key" ON "setoran"("qrCode");

-- CreateIndex
CREATE UNIQUE INDEX "penukaran_kode_key" ON "penukaran"("kode");

-- AddForeignKey
ALTER TABLE "addresses" ADD CONSTRAINT "addresses_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "setoran" ADD CONSTRAINT "setoran_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "setoran" ADD CONSTRAINT "setoran_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "addresses"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "setoran_items" ADD CONSTRAINT "setoran_items_setoranId_fkey" FOREIGN KEY ("setoranId") REFERENCES "setoran"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "setoran_items" ADD CONSTRAINT "setoran_items_kategoriSampahId_fkey" FOREIGN KEY ("kategoriSampahId") REFERENCES "kategori_sampah"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "penukaran" ADD CONSTRAINT "penukaran_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "penukaran" ADD CONSTRAINT "penukaran_hadiahId_fkey" FOREIGN KEY ("hadiahId") REFERENCES "hadiah"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
