import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateHadiahDto, UpdateHadiahDto } from './dto/hadiah.dto';

@Injectable()
export class HadiahService {
  constructor(private prisma: PrismaService) {}

  private withStatus(hadiah: any) {
    return { ...hadiah, statusStok: hadiah.stok > 0 ? 'TERSEDIA' : 'HABIS' };
  }

  async findAll() {
    const list = await this.prisma.hadiah.findMany({ orderBy: { createdAt: 'desc' } });
    return list.map((h) => this.withStatus(h));
  }

  async findOne(id: string) {
    const hadiah = await this.prisma.hadiah.findUnique({ where: { id } });
    if (!hadiah) throw new NotFoundException('Hadiah tidak ditemukan');
    return this.withStatus(hadiah);
  }

  create(dto: CreateHadiahDto) {
    return this.prisma.hadiah.create({ data: dto });
  }

  async update(id: string, dto: UpdateHadiahDto) {
    await this.findOne(id);
    return this.prisma.hadiah.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    await this.findOne(id);
    const usageCount = await this.prisma.penukaran.count({ where: { hadiahId: id } });

    // BR-14: histori penukaran tidak boleh berubah -> tolak hard-delete jika sudah pernah ditukar
    if (usageCount > 0) {
      throw new ConflictException(
        'Hadiah ini sudah pernah ditukar Nasabah. Set stok ke 0 saja agar histori penukaran tetap aman.',
      );
    }

    await this.prisma.hadiah.delete({ where: { id } });
    return { message: 'Hadiah berhasil dihapus' };
  }
}
