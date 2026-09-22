import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateHadiahDto, UpdateHadiahDto } from './dto/hadiah.dto';
import {
  buildPhotoUrl,
  deleteFileSafe,
  saveUploadedFile,
  validateImageMagicBytes,
} from '../common/utils/file-upload.util';

@Injectable()
export class HadiahService {
  constructor(private prisma: PrismaService) {}

  private transformResponse(hadiah: any, baseUrl?: string) {
    return {
      ...hadiah,
      foto: hadiah.foto ?? null,
      foto_url: buildPhotoUrl(hadiah.foto, baseUrl),
      statusStok: hadiah.stok > 0 ? 'TERSEDIA' : 'HABIS',
    };
  }

  async findAll(baseUrl?: string) {
    const list = await this.prisma.hadiah.findMany({ orderBy: { createdAt: 'desc' } });
    return list.map((h) => this.transformResponse(h, baseUrl));
  }

  async findOne(id: string, baseUrl?: string) {
    const hadiah = await this.prisma.hadiah.findUnique({ where: { id } });
    if (!hadiah) throw new NotFoundException('Hadiah tidak ditemukan');
    return this.transformResponse(hadiah, baseUrl);
  }

  async create(dto: CreateHadiahDto, file?: Express.Multer.File, baseUrl?: string) {
    let savedRelativePath: string | null = null;
    if (file) {
      const magic = validateImageMagicBytes(file.buffer);
      const saved = await saveUploadedFile(file.buffer, magic.ext, 'hadiah');
      savedRelativePath = saved.relativePath;
    }

    try {
      const { foto: _foto, ...data } = dto as any;
      const created = await this.prisma.hadiah.create({
        data: {
          ...data,
          foto: savedRelativePath ?? dto.gambarUrl ?? null,
        },
      });
      return this.transformResponse(created, baseUrl);
    } catch (error) {
      if (savedRelativePath) {
        await deleteFileSafe(savedRelativePath);
      }
      throw error;
    }
  }

  async update(id: string, dto: UpdateHadiahDto, file?: Express.Multer.File, baseUrl?: string) {
    const existing = await this.prisma.hadiah.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Hadiah tidak ditemukan');

    let savedRelativePath: string | null = null;
    if (file) {
      const magic = validateImageMagicBytes(file.buffer);
      const saved = await saveUploadedFile(file.buffer, magic.ext, 'hadiah');
      savedRelativePath = saved.relativePath;
    }

    try {
      const { foto: _foto, ...data } = dto as any;
      const updateData: any = { ...data };
      if (savedRelativePath !== null) {
        updateData.foto = savedRelativePath;
      }
      if (dto.gambarUrl !== undefined) {
        updateData.gambarUrl = dto.gambarUrl;
      }

      const updated = await this.prisma.hadiah.update({ where: { id }, data: updateData });

      if (savedRelativePath && existing.foto) {
        await deleteFileSafe(existing.foto);
      }

      return this.transformResponse(updated, baseUrl);
    } catch (error) {
      if (savedRelativePath) {
        await deleteFileSafe(savedRelativePath);
      }
      throw error;
    }
  }

  async remove(id: string) {
    const existing = await this.prisma.hadiah.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Hadiah tidak ditemukan');

    const usageCount = await this.prisma.penukaran.count({ where: { hadiahId: id } });

    // BR-14: histori penukaran tidak boleh berubah -> tolak hard-delete jika sudah pernah ditukar
    if (usageCount > 0) {
      throw new ConflictException(
        'Hadiah ini sudah pernah ditukar Nasabah. Set stok ke 0 saja agar histori penukaran tetap aman.',
      );
    }

    await this.prisma.hadiah.delete({ where: { id } });

    if (existing.foto) {
      await deleteFileSafe(existing.foto);
    }

    return { message: 'Hadiah berhasil dihapus' };
  }
}
