import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateKategoriSampahDto, UpdateKategoriSampahDto } from './dto/kategori-sampah.dto';
import {
  validateImageMagicBytes,
  saveUploadedFile,
  deleteFileSafe,
  buildPhotoUrl,
} from '../common/utils/file-upload.util';
import { KategoriSampah } from '@prisma/client';

@Injectable()
export class KategoriSampahService {
  constructor(private prisma: PrismaService) {}

  private transformResponse(kategori: KategoriSampah, baseUrl?: string) {
    return {
      ...kategori,
      foto: kategori.foto ?? null,
      foto_url: buildPhotoUrl(kategori.foto, baseUrl),
    };
  }

  private async findOneRaw(id: string): Promise<KategoriSampah> {
    const kategori = await this.prisma.kategoriSampah.findUnique({ where: { id } });
    if (!kategori) throw new NotFoundException('Kategori sampah tidak ditemukan');
    return kategori;
  }

  // Untuk Admin: semua kategori
  async findAllAdmin(baseUrl?: string) {
    const items = await this.prisma.kategoriSampah.findMany({ orderBy: { nama: 'asc' } });
    return items.map((item) => this.transformResponse(item, baseUrl));
  }

  // Untuk Nasabah: hanya kategori aktif (BR-01, BR-13)
  async findAllActive(baseUrl?: string) {
    const items = await this.prisma.kategoriSampah.findMany({
      where: { aktif: true },
      orderBy: { nama: 'asc' },
    });
    return items.map((item) => this.transformResponse(item, baseUrl));
  }

  async findOne(id: string, baseUrl?: string) {
    const kategori = await this.findOneRaw(id);
    return this.transformResponse(kategori, baseUrl);
  }

  async create(
    dto: CreateKategoriSampahDto,
    file?: Express.Multer.File,
    baseUrl?: string,
  ) {
    let savedRelativePath: string | null = null;
    if (file) {
      const magic = validateImageMagicBytes(file.buffer);
      const saved = await saveUploadedFile(file.buffer, magic.ext);
      savedRelativePath = saved.relativePath;
    }

    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { foto: _, ...data } = dto;
      const created = await this.prisma.kategoriSampah.create({
        data: {
          nama: data.nama,
          hargaPerKg: data.hargaPerKg,
          poinPerKg: data.poinPerKg,
          aktif: data.aktif !== undefined ? data.aktif : true,
          foto: savedRelativePath,
        },
      });
      return this.transformResponse(created, baseUrl);
    } catch (err) {
      if (savedRelativePath) {
        await deleteFileSafe(savedRelativePath);
      }
      throw err;
    }
  }

  async update(
    id: string,
    dto: UpdateKategoriSampahDto,
    file?: Express.Multer.File,
    baseUrl?: string,
  ) {
    const existing = await this.findOneRaw(id);
    let savedRelativePath: string | null = null;

    if (file) {
      const magic = validateImageMagicBytes(file.buffer);
      const saved = await saveUploadedFile(file.buffer, magic.ext);
      savedRelativePath = saved.relativePath;
    }

    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { foto: _, ...data } = dto;
      const updateData: any = {};
      if (data.nama !== undefined) updateData.nama = data.nama;
      if (data.hargaPerKg !== undefined) updateData.hargaPerKg = data.hargaPerKg;
      if (data.poinPerKg !== undefined) updateData.poinPerKg = data.poinPerKg;
      if (data.aktif !== undefined) updateData.aktif = data.aktif;
      if (savedRelativePath !== null) updateData.foto = savedRelativePath;

      const updated = await this.prisma.kategoriSampah.update({
        where: { id },
        data: updateData,
      });

      // If replacement photo succeeded, remove old photo
      if (savedRelativePath && existing.foto) {
        await deleteFileSafe(existing.foto);
      }

      return this.transformResponse(updated, baseUrl);
    } catch (err) {
      if (savedRelativePath) {
        await deleteFileSafe(savedRelativePath);
      }
      throw err;
    }
  }

  async remove(id: string) {
    const existing = await this.findOneRaw(id);
    const usageCount = await this.prisma.setoranItem.count({ where: { kategoriSampahId: id } });

    // BR-14: histori transaksi tidak berubah -> jangan hard-delete kategori yang sudah dipakai transaksi
    if (usageCount > 0) {
      throw new ConflictException(
        'Kategori ini sudah dipakai di transaksi. Nonaktifkan saja (bukan hapus) agar histori tetap aman.',
      );
    }

    await this.prisma.kategoriSampah.delete({ where: { id } });

    if (existing.foto) {
      await deleteFileSafe(existing.foto);
    }

    return { message: 'Kategori sampah berhasil dihapus' };
  }
}
