import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Role, StatusSetoran, StatusPenukaran } from '@prisma/client';

@Injectable()
export class LaporanService {
  constructor(private prisma: PrismaService) {}

  // ── FR-02: Dashboard Nasabah ─────────────────────────

  async dashboardNasabah(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });

    const selesaiAgg = await this.prisma.setoran.aggregate({
      where: { userId, status: StatusSetoran.SELESAI },
      _sum: { totalBeratReal: true, totalPoin: true },
    });

    const penukaranAktif = await this.prisma.penukaran.findMany({
      where: { userId, status: { in: [StatusPenukaran.DIPROSES, StatusPenukaran.SELESAI] } },
      select: { poinTerpakai: true },
    });
    const totalPoinDitukar = penukaranAktif.reduce((sum, p) => sum + p.poinTerpakai, 0);

    const transaksiTerakhir = await this.prisma.setoran.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 5,
    });

    return {
      saldoPoin: user?.pointBalance ?? 0,
      totalSampahDisetorKg: selesaiAgg._sum.totalBeratReal ?? 0,
      totalPoinDidapat: selesaiAgg._sum.totalPoin ?? 0,
      totalPoinDitukar,
      transaksiTerakhir,
    };
  }

  // ── FR-19: Dashboard Admin ───────────────────────────

  async dashboardAdmin() {
    const [totalNasabah, totalPengajuan, totalPenukaran, selesaiAgg, transaksiTerbaru] =
      await Promise.all([
        this.prisma.user.count({ where: { role: Role.NASABAH } }),
        this.prisma.setoran.count(),
        this.prisma.penukaran.count(),
        this.prisma.setoran.aggregate({
          where: { status: StatusSetoran.SELESAI },
          _sum: { totalBeratReal: true, totalPoin: true },
        }),
        this.prisma.setoran.findMany({
          orderBy: { createdAt: 'desc' },
          take: 10,
          include: { user: { select: { name: true } } },
        }),
      ]);

    const statistikBulanan = await this.statistikBulanan(6);

    return {
      totalNasabah,
      totalPengajuan,
      totalSampahKg: selesaiAgg._sum.totalBeratReal ?? 0,
      totalPoin: selesaiAgg._sum.totalPoin ?? 0,
      totalPenukaran,
      transaksiTerbaru,
      statistikBulanan,
    };
  }

  private async statistikBulanan(bulanTerakhir: number) {
    const result: { bulan: string; totalKg: number; totalPoin: number }[] = [];
    const now = new Date();

    for (let i = bulanTerakhir - 1; i >= 0; i--) {
      const target = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const start = new Date(target.getFullYear(), target.getMonth(), 1);
      const end = new Date(target.getFullYear(), target.getMonth() + 1, 1);

      const agg = await this.prisma.setoran.aggregate({
        where: { status: StatusSetoran.SELESAI, completedAt: { gte: start, lt: end } },
        _sum: { totalBeratReal: true, totalPoin: true },
      });

      result.push({
        bulan: `${target.getFullYear()}-${String(target.getMonth() + 1).padStart(2, '0')}`,
        totalKg: Number(agg._sum.totalBeratReal ?? 0),
        totalPoin: agg._sum.totalPoin ?? 0,
      });
    }

    return result;
  }

  // ── FR-21: Laporan Bulanan ───────────────────────────

  async laporanBulanan(bulan: number, tahun: number) {
    const start = new Date(tahun, bulan - 1, 1);
    const end = new Date(tahun, bulan, 1);

    const setoranSelesai = await this.prisma.setoran.findMany({
      where: { status: StatusSetoran.SELESAI, completedAt: { gte: start, lt: end } },
      include: { items: true },
    });

    let totalKg = 0;
    let totalPoinDiterbitkan = 0;
    let estimasiPembayaran = 0;
    const breakdownMap = new Map<
      string,
      { kategori: string; totalBeratReal: number; totalPoin: number; estimasi: number }
    >();

    for (const setoran of setoranSelesai) {
      totalPoinDiterbitkan += setoran.totalPoin ?? 0;
      for (const item of setoran.items) {
        const beratReal = Number(item.beratReal ?? 0);
        const hargaPerKg = Number(item.hargaPerKgSnapshot);
        const subtotalHarga = beratReal * hargaPerKg;

        totalKg += beratReal;
        estimasiPembayaran += subtotalHarga;

        const key = item.namaKategoriSnapshot;
        const existing = breakdownMap.get(key) ?? {
          kategori: key,
          totalBeratReal: 0,
          totalPoin: 0,
          estimasi: 0,
        };
        existing.totalBeratReal += beratReal;
        existing.totalPoin += item.poinDidapat ?? 0;
        existing.estimasi += subtotalHarga;
        breakdownMap.set(key, existing);
      }
    }

    const penukaranPeriode = await this.prisma.penukaran.findMany({
      where: { createdAt: { gte: start, lt: end } },
    });
    const rekapPenukaran = {
      totalPenukaran: penukaranPeriode.length,
      totalPoinDitukar: penukaranPeriode
        .filter((p) => p.status !== StatusPenukaran.DIBATALKAN)
        .reduce((sum, p) => sum + p.poinTerpakai, 0),
      selesai: penukaranPeriode.filter((p) => p.status === StatusPenukaran.SELESAI).length,
      diproses: penukaranPeriode.filter((p) => p.status === StatusPenukaran.DIPROSES).length,
      dibatalkan: penukaranPeriode.filter((p) => p.status === StatusPenukaran.DIBATALKAN).length,
    };

    return {
      periode: { bulan, tahun },
      totalKg,
      totalTon: totalKg / 1000,
      estimasiPembayaran,
      totalPoinDiterbitkan,
      breakdownKategori: Array.from(breakdownMap.values()),
      rekapPenukaran,
    };
  }
}
