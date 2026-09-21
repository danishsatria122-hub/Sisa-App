import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { generateKode } from '../common/utils/generate-kode';
import { StatusPenukaran } from '@prisma/client';

@Injectable()
export class PenukaranService {
  constructor(private prisma: PrismaService) {}

  // ── NASABAH ──────────────────────────────────────────

  async create(userId: string, hadiahId: string) {
    return this.prisma.$transaction(async (tx) => {
      const hadiah = await tx.hadiah.findUnique({ where: { id: hadiahId } });
      if (!hadiah) throw new NotFoundException('Hadiah tidak ditemukan');
      if (hadiah.stok <= 0) throw new BadRequestException('Stok hadiah habis'); // BR-12

      const user = await tx.user.findUnique({ where: { id: userId } });
      if (!user) throw new NotFoundException('User tidak ditemukan');
      if (user.pointBalance < hadiah.poinDibutuhkan) {
        throw new BadRequestException(
          `Poin tidak cukup. Kurang ${hadiah.poinDibutuhkan - user.pointBalance} poin`,
        ); // BR-09, FR-14
      }

      // BR-10: poin dikurangi & stok berkurang saat penukaran dibuat
      await tx.user.update({
        where: { id: userId },
        data: { pointBalance: { decrement: hadiah.poinDibutuhkan } },
      });
      await tx.hadiah.update({ where: { id: hadiahId }, data: { stok: { decrement: 1 } } });

      return tx.penukaran.create({
        data: {
          kode: generateKode('TUKAR'),
          userId,
          hadiahId,
          namaHadiahSnapshot: hadiah.nama,
          poinTerpakai: hadiah.poinDibutuhkan,
          status: StatusPenukaran.DIPROSES,
        },
      });
    });
  }

  findAllForUser(userId: string) {
    return this.prisma.penukaran.findMany({
      where: { userId },
      include: { hadiah: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOneForUser(userId: string, id: string) {
    const penukaran = await this.prisma.penukaran.findUnique({
      where: { id },
      include: { hadiah: true },
    });
    if (!penukaran || penukaran.userId !== userId) {
      throw new NotFoundException('Penukaran tidak ditemukan');
    }
    return penukaran;
  }

  async getNotaForUser(userId: string, id: string) {
    const penukaran = await this.findOneForUser(userId, id);
    return {
      kodePenukaran: penukaran.kode,
      hadiah: penukaran.namaHadiahSnapshot,
      poinTerpakai: penukaran.poinTerpakai,
      status: penukaran.status,
      tanggal: penukaran.createdAt,
    }; // FR-18
  }

  // ── ADMIN ────────────────────────────────────────────

  findAllAdmin(status?: StatusPenukaran) {
    return this.prisma.penukaran.findMany({
      where: status ? { status } : {},
      include: { hadiah: true, user: { select: { id: true, name: true, email: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOneAdmin(id: string) {
    const penukaran = await this.prisma.penukaran.findUnique({
      where: { id },
      include: { hadiah: true, user: { select: { id: true, name: true, email: true } } },
    });
    if (!penukaran) throw new NotFoundException('Penukaran tidak ditemukan');
    return penukaran;
  }

  async updateStatus(id: string, action: 'proses' | 'selesai' | 'batal') {
    const penukaran = await this.findOneAdmin(id);

    if (penukaran.status !== StatusPenukaran.DIPROSES) {
      throw new BadRequestException('Hanya penukaran berstatus "diproses" yang dapat diubah');
    }

    if (action === 'proses') {
      return penukaran; // sudah diproses sejak dibuat, no-op
    }

    if (action === 'selesai') {
      return this.prisma.penukaran.update({
        where: { id },
        data: { status: StatusPenukaran.SELESAI },
      });
    }

    // action === 'batal' → BR-11: kembalikan poin & stok otomatis
    return this.prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: penukaran.userId },
        data: { pointBalance: { increment: penukaran.poinTerpakai } },
      });
      await tx.hadiah.update({
        where: { id: penukaran.hadiahId },
        data: { stok: { increment: 1 } },
      });
      return tx.penukaran.update({
        where: { id },
        data: { status: StatusPenukaran.DIBATALKAN },
      });
    });
  }
}
