-- AlterEnum
ALTER TYPE "StatusSetoran" ADD VALUE 'SUDAH_DISCAN';

-- AlterTable
ALTER TABLE "setoran" ADD COLUMN "discan_pada" TIMESTAMP(3),
ADD COLUMN "discan_oleh" TEXT;
