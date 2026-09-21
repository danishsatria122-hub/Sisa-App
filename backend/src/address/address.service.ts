import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAddressDto, UpdateAddressDto } from './dto/address.dto';

@Injectable()
export class AddressService {
  constructor(private prisma: PrismaService) {}

  findAllForUser(userId: string) {
    return this.prisma.address.findMany({
      where: { userId },
      orderBy: [{ isPrimary: 'desc' }, { createdAt: 'desc' }],
    });
  }

  async findOneForUser(userId: string, id: string) {
    const address = await this.prisma.address.findUnique({ where: { id } });
    if (!address || address.userId !== userId) {
      throw new NotFoundException('Alamat tidak ditemukan');
    }
    return address;
  }

  async create(userId: string, dto: CreateAddressDto) {
    if (dto.isPrimary) {
      await this.unsetPrimary(userId);
    } else {
      // Kalau ini alamat pertama, otomatis jadi primary
      const count = await this.prisma.address.count({ where: { userId } });
      if (count === 0) dto.isPrimary = true;
    }

    return this.prisma.address.create({
      data: { ...dto, userId },
    });
  }

  async update(userId: string, id: string, dto: UpdateAddressDto) {
    await this.findOneForUser(userId, id);

    if (dto.isPrimary) {
      await this.unsetPrimary(userId);
    }

    return this.prisma.address.update({ where: { id }, data: dto });
  }

  async remove(userId: string, id: string) {
    await this.findOneForUser(userId, id);
    await this.prisma.address.delete({ where: { id } });
    return { message: 'Alamat berhasil dihapus' };
  }

  private async unsetPrimary(userId: string) {
    await this.prisma.address.updateMany({
      where: { userId, isPrimary: true },
      data: { isPrimary: false },
    });
  }
}
