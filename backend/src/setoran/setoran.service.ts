import {
  BadRequestException,
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as crypto from 'crypto';
import * as QRCode from 'qrcode';
import { v4 as uuidv4 } from 'uuid';
import { PrismaService } from '../prisma/prisma.service';
import { generateKode } from '../common/utils/generate-kode';
import {
  CreateSetoranDto,
  UpdateSetoranStatusDto,
  VerifikasiSetoranDto,
} from './dto/setoran.dto';
import { StatusSetoran } from '@prisma/client';

function timingSafeEqualStr(a: string, b: string): boolean {
  const bufA = Buffer.from(a, 'utf8');
  const bufB = Buffer.from(b, 'utf8');
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

const ITEM_INCLUDE = { items: { include: { kategoriSampah: true } } };

@Injectable()
export class SetoranService {
  constructor(private prisma: PrismaService) {}

  // ── NASABAH ──────────────────────────────────────────

  async create(userId: string, dto: CreateSetoranDto) {
    // Validasi setiap kategori aktif (BR-01)
    const kategoriIds = dto.items.map((i) => i.kategoriSampahId);
    const kategoriList = await this.prisma.kategoriSampah.findMany({
      where: { id: { in: kategoriIds } },
    });

    for (const item of dto.items) {
      const kategori = kategoriList.find((k) => k.id === item.kategoriSampahId);
      if (!kategori) throw new BadRequestException('Kategori sampah tidak ditemukan');
      if (!kategori.aktif) {
        throw new BadRequestException(`Kategori "${kategori.nama}" sedang nonaktif`);
      }
    }

    let addressSnapshot: string | undefined;
    if (dto.metode === 'DIJEMPUT') {
      const address = await this.prisma.address.findUnique({ where: { id: dto.addressId } });
      if (!address || address.userId !== userId) {
        throw new BadRequestException('Alamat tidak valid');
      }
      addressSnapshot = address.fullAddress; // FR-04: snapshot alamat
    }

    const setoran = await this.prisma.setoran.create({
      data: {
        kode: generateKode('SETOR'),
        userId,
        metode: dto.metode,
        status: StatusSetoran.DIAJUKAN,
        qrCode: uuidv4(), // BR-16: identifier transaksi, bukan akun permanen
        addressId: dto.metode === 'DIJEMPUT' ? dto.addressId : undefined,
        addressSnapshot,
        tanggalPickup: dto.tanggalPickup ? new Date(dto.tanggalPickup) : undefined,
        waktuPickupMulai: dto.waktuPickupMulai,
        waktuPickupSelesai: dto.waktuPickupSelesai,
        items: {
          create: dto.items.map((item) => {
            const kategori = kategoriList.find((k) => k.id === item.kategoriSampahId)!;
            return {
              kategoriSampahId: kategori.id,
              namaKategoriSnapshot: kategori.nama,
              hargaPerKgSnapshot: kategori.hargaPerKg,
              poinPerKgSnapshot: kategori.poinPerKg,
              beratPerkiraan: item.beratPerkiraan,
            };
          }),
        },
      },
      include: ITEM_INCLUDE,
    });

    return setoran;
  }

  findAllForUser(userId: string, status?: StatusSetoran) {
    return this.prisma.setoran.findMany({
      where: { userId, ...(status ? { status } : {}) },
      include: ITEM_INCLUDE,
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOneForUser(userId: string, id: string) {
    const setoran = await this.prisma.setoran.findUnique({ where: { id }, include: ITEM_INCLUDE });
    if (!setoran || setoran.userId !== userId) {
      throw new NotFoundException('Setoran tidak ditemukan');
    }
    return setoran;
  }

  async cancel(userId: string, id: string) {
    const setoran = await this.findOneForUser(userId, id);
    if (setoran.status !== StatusSetoran.DIAJUKAN) {
      throw new BadRequestException('Hanya pengajuan berstatus "diajukan" yang dapat dibatalkan'); // BR-06
    }
    return this.prisma.setoran.update({
      where: { id },
      data: { status: StatusSetoran.DIBATALKAN },
    });
  }

  async getQrForUser(userId: string, id: string) {
    const setoran = await this.findOneForUser(userId, id);
    if (!setoran.qrCode) throw new NotFoundException('QR belum tersedia untuk setoran ini');
    const qrImageBase64 = await QRCode.toDataURL(setoran.qrCode);
    return { qrCode: setoran.qrCode, qrImageBase64 };
  }

  async getNotaForUser(userId: string, id: string) {
    const setoran = await this.findOneForUser(userId, id);
    if (setoran.status !== StatusSetoran.SELESAI) {
      throw new BadRequestException('Nota hanya tersedia untuk transaksi yang sudah selesai'); // FR-17
    }
    return this.buildNota(setoran);
  }

  private buildNota(setoran: any) {
    return {
      kodeTransaksi: setoran.kode,
      tanggal: setoran.completedAt ?? setoran.updatedAt,
      items: setoran.items.map((item: any) => ({
        kategori: item.namaKategoriSnapshot,
        beratReal: item.beratReal,
        hargaPerKg: item.hargaPerKgSnapshot,
        poinPerKg: item.poinPerKgSnapshot,
        poinDidapat: item.poinDidapat,
      })),
      totalBeratReal: setoran.totalBeratReal,
      totalPoin: setoran.totalPoin,
    };
  }

  // ── ADMIN ────────────────────────────────────────────

  findAllAdmin(filter: { status?: StatusSetoran; metode?: string; search?: string }) {
    return this.prisma.setoran.findMany({
      where: {
        ...(filter.status ? { status: filter.status } : {}),
        ...(filter.metode ? { metode: filter.metode as any } : {}),
        ...(filter.search
          ? {
              OR: [
                { kode: { contains: filter.search, mode: 'insensitive' } },
                { user: { name: { contains: filter.search, mode: 'insensitive' } } },
              ],
            }
          : {}),
      },
      include: { ...ITEM_INCLUDE, user: { select: { id: true, name: true, email: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOneAdmin(id: string) {
    const setoran = await this.prisma.setoran.findUnique({
      where: { id },
      include: { ...ITEM_INCLUDE, user: { select: { id: true, name: true, email: true } } },
    });
    if (!setoran) throw new NotFoundException('Setoran tidak ditemukan');
    return setoran;
  }

  async scanQrCode(adminId: string, qrCode: string) {
    if (!qrCode || typeof qrCode !== 'string') {
      throw new NotFoundException('Transaksi dengan kode QR ini tidak ditemukan');
    }

    const setoran = await this.prisma.setoran.findUnique({
      where: { qrCode },
      include: { ...ITEM_INCLUDE, user: { select: { id: true, name: true, email: true } } },
    });

    if (!setoran || !setoran.qrCode || !timingSafeEqualStr(setoran.qrCode, qrCode)) {
      throw new NotFoundException('Transaksi dengan kode QR ini tidak ditemukan');
    }

    if (setoran.status === StatusSetoran.SELESAI || setoran.status === StatusSetoran.DIVERIFIKASI) {
      throw new HttpException(
        {
          statusCode: HttpStatus.CONFLICT,
          code: 'ALREADY_VERIFIED',
          message: 'Setoran sudah diverifikasi.',
        },
        HttpStatus.CONFLICT,
      );
    }

    if (setoran.status === StatusSetoran.DITOLAK || setoran.status === StatusSetoran.DIBATALKAN) {
      throw new HttpException(
        {
          statusCode: HttpStatus.CONFLICT,
          code: 'DEPOSIT_CANCELLED',
          message: 'Setoran sudah dibatalkan atau ditolak.',
        },
        HttpStatus.CONFLICT,
      );
    }

    // Idempotent: scanning twice does not error or duplicate anything
    if (setoran.status === StatusSetoran.SUDAH_DISCAN) {
      return setoran;
    }

    return this.prisma.setoran.update({
      where: { id: setoran.id },
      data: {
        status: StatusSetoran.SUDAH_DISCAN,
        discanPada: new Date(),
        discanOleh: adminId,
      },
      include: { ...ITEM_INCLUDE, user: { select: { id: true, name: true, email: true } } },
    });
  }

  async findByQrCode(qrCode: string, adminId?: string) {
    return this.scanQrCode(adminId ?? '', qrCode);
  }

  async updateStatus(id: string, dto: UpdateSetoranStatusDto) {
    const setoran = await this.findOneAdmin(id);
    if (setoran.status !== StatusSetoran.DIAJUKAN) {
      throw new BadRequestException('Hanya pengajuan berstatus "diajukan" yang dapat diproses');
    }

    if (dto.action === 'tolak') {
      // BR-07: alasan wajib — sudah divalidasi di DTO, ini pengaman tambahan
      if (!dto.alasanTolak) throw new BadRequestException('Alasan penolakan wajib diisi');
      return this.prisma.setoran.update({
        where: { id },
        data: { status: StatusSetoran.DITOLAK, alasanTolak: dto.alasanTolak },
      });
    }

    return this.prisma.setoran.update({
      where: { id },
      data: { status: StatusSetoran.DITERIMA },
    });
  }

  async verifikasi(id: string, dto: VerifikasiSetoranDto) {
    return this.prisma.$transaction(async (tx) => {
      // Row lock with SELECT ... FOR UPDATE
      const rows = await tx.$queryRaw<
        Array<{ id: string; status: StatusSetoran; discan_pada: Date | null }>
      >`
        SELECT id, status, discan_pada FROM setoran WHERE id = ${id} FOR UPDATE
      `;
      const current = rows[0];
      if (!current) {
        throw new NotFoundException('Setoran tidak ditemukan');
      }

      if (current.status === StatusSetoran.SELESAI) {
        throw new HttpException(
          {
            statusCode: HttpStatus.CONFLICT,
            code: 'ALREADY_VERIFIED',
            message: 'Setoran sudah diverifikasi.',
          },
          HttpStatus.CONFLICT,
        );
      }

      if (current.status === StatusSetoran.DITOLAK || current.status === StatusSetoran.DIBATALKAN) {
        throw new HttpException(
          {
            statusCode: HttpStatus.CONFLICT,
            code: 'DEPOSIT_CANCELLED',
            message: 'Setoran sudah dibatalkan atau ditolak.',
          },
          HttpStatus.CONFLICT,
        );
      }

      // Precondition: must be scanned
      if (!current.discan_pada || (current.status !== StatusSetoran.SUDAH_DISCAN && current.status !== StatusSetoran.DIVERIFIKASI)) {
        throw new HttpException(
          {
            statusCode: HttpStatus.CONFLICT,
            code: 'QR_NOT_SCANNED',
            message: 'Scan QR setoran terlebih dahulu.',
          },
          HttpStatus.CONFLICT,
        );
      }

      const kategoriIds = dto.items.map((i) => i.kategoriSampahId);
      const kategoriList = await tx.kategoriSampah.findMany({
        where: { id: { in: kategoriIds } },
      });

      const setoranWithItems = await tx.setoran.findUnique({
        where: { id },
        include: ITEM_INCLUDE,
      });

      const existingItemIds = (setoranWithItems?.items ?? []).map((i) => i.id);
      const keepItemIds = dto.items.filter((i) => i.id).map((i) => i.id as string);
      const toDelete = existingItemIds.filter((id) => !keepItemIds.includes(id));

      let totalBeratReal = 0;
      let totalPoin = 0;

      if (toDelete.length > 0) {
        await tx.setoranItem.deleteMany({ where: { id: { in: toDelete } } });
      }

      for (const item of dto.items) {
        const kategori = kategoriList.find((k) => k.id === item.kategoriSampahId);
        if (!kategori) throw new BadRequestException('Kategori sampah tidak ditemukan');

        const poinDidapat = Math.round(item.beratReal * Number(kategori.poinPerKg));
        totalBeratReal += item.beratReal;
        totalPoin += poinDidapat;

        if (item.id) {
          await tx.setoranItem.update({
            where: { id: item.id },
            data: {
              kategoriSampahId: kategori.id,
              namaKategoriSnapshot: kategori.nama,
              hargaPerKgSnapshot: kategori.hargaPerKg,
              poinPerKgSnapshot: kategori.poinPerKg,
              beratReal: item.beratReal,
              poinDidapat,
            },
          });
        } else {
          await tx.setoranItem.create({
            data: {
              setoranId: id,
              kategoriSampahId: kategori.id,
              namaKategoriSnapshot: kategori.nama,
              hargaPerKgSnapshot: kategori.hargaPerKg,
              poinPerKgSnapshot: kategori.poinPerKg,
              beratPerkiraan: 0,
              beratReal: item.beratReal,
              poinDidapat,
            },
          });
        }
      }

      await tx.setoran.update({
        where: { id },
        data: {
          status: StatusSetoran.DIVERIFIKASI,
          totalBeratReal,
          totalPoin,
          verifiedAt: new Date(),
        },
      });

      return tx.setoran.findUnique({
        where: { id },
        include: { ...ITEM_INCLUDE, user: { select: { id: true, name: true, email: true } } },
      });
    });
  }

  async selesaikan(id: string) {
    return this.prisma.$transaction(async (tx) => {
      // Load deposit with row-level lock
      const rows = await tx.$queryRaw<
        Array<{
          id: string;
          status: StatusSetoran;
          discan_pada: Date | null;
          user_id: string;
          total_poin: number | null;
        }>
      >`
        SELECT id, status, discan_pada, "userId" AS user_id, "totalPoin" AS total_poin FROM setoran WHERE id = ${id} FOR UPDATE
      `;
      const current = rows[0];
      if (!current) {
        throw new NotFoundException('Setoran tidak ditemukan');
      }

      if (current.status === StatusSetoran.SELESAI) {
        throw new HttpException(
          {
            statusCode: HttpStatus.CONFLICT,
            code: 'ALREADY_VERIFIED',
            message: 'Setoran sudah diverifikasi.',
          },
          HttpStatus.CONFLICT,
        );
      }

      if (!current.discan_pada) {
        throw new HttpException(
          {
            statusCode: HttpStatus.CONFLICT,
            code: 'QR_NOT_SCANNED',
            message: 'Scan QR setoran terlebih dahulu.',
          },
          HttpStatus.CONFLICT,
        );
      }

      if (current.status !== StatusSetoran.DIVERIFIKASI) {
        throw new BadRequestException('Setoran harus diverifikasi terlebih dahulu');
      }

      // Atomic conditional update ensures only one parallel request transitions DIVERIFIKASI -> SELESAI
      const updateResult = await tx.setoran.updateMany({
        where: { id, status: StatusSetoran.DIVERIFIKASI },
        data: { status: StatusSetoran.SELESAI, completedAt: new Date() },
      });

      if (updateResult.count === 0) {
        throw new HttpException(
          {
            statusCode: HttpStatus.CONFLICT,
            code: 'ALREADY_VERIFIED',
            message: 'Setoran sudah diverifikasi.',
          },
          HttpStatus.CONFLICT,
        );
      }

      await tx.user.update({
        where: { id: current.user_id },
        data: { pointBalance: { increment: current.total_poin ?? 0 } },
      });

      return tx.setoran.findUnique({
        where: { id },
        include: { ...ITEM_INCLUDE, user: { select: { id: true, name: true, email: true } } },
      });
    });
  }
}
