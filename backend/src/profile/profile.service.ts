import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { buildPhotoUrl, deleteFileSafe, saveUploadedFile, validateImageMagicBytes } from '../common/utils/file-upload.util';

@Injectable()
export class ProfileService {
  constructor(private readonly prisma: PrismaService) {}

  async getProfile(userId: string, baseUrl?: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        role: true,
        pointBalance: true,
        foto: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) throw new NotFoundException('User tidak ditemukan');

    return {
      ...user,
      foto: user.foto ?? null,
      foto_url: buildPhotoUrl(user.foto, baseUrl),
    };
  }

  async updateProfile(userId: string, dto: Record<string, any>, baseUrl?: string) {
    const existing = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!existing) throw new NotFoundException('User tidak ditemukan');

    const { foto, ...data } = dto;
    const updateData: Record<string, any> = { ...data };

    if (typeof dto.name !== 'undefined') updateData.name = dto.name;
    if (typeof dto.phone !== 'undefined') updateData.phone = dto.phone;

    const updated = await this.prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        role: true,
        pointBalance: true,
        foto: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return {
      ...updated,
      foto: updated.foto ?? null,
      foto_url: buildPhotoUrl(updated.foto, baseUrl),
    };
  }

  async uploadPhoto(userId: string, file: Express.Multer.File, baseUrl?: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User tidak ditemukan');

    const magic = validateImageMagicBytes(file.buffer);
    const saved = await saveUploadedFile(file.buffer, magic.ext, 'profil');

    try {
      const updated = await this.prisma.user.update({
        where: { id: userId },
        data: { foto: saved.relativePath },
        select: {
          id: true,
          email: true,
          name: true,
          phone: true,
          role: true,
          pointBalance: true,
          foto: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      if (user.foto) {
        await deleteFileSafe(user.foto);
      }

      return {
        ...updated,
        foto: updated.foto ?? null,
        foto_url: buildPhotoUrl(updated.foto, baseUrl),
      };
    } catch (error) {
      await deleteFileSafe(saved.relativePath);
      throw error;
    }
  }

  async deletePhoto(userId: string, baseUrl?: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User tidak ditemukan');

    const updated = await this.prisma.user.update({
      where: { id: userId },
      data: { foto: null },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        role: true,
        pointBalance: true,
        foto: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (user.foto) {
      await deleteFileSafe(user.foto);
    }

    return {
      ...updated,
      foto: updated.foto ?? null,
      foto_url: null,
    };
  }
}
