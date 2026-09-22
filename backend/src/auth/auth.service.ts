import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { Role } from '@prisma/client';
import { buildPhotoUrl } from '../common/utils/file-upload.util';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const existing = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (existing) {
      throw new ConflictException('Email sudah terdaftar');
    }

    const hashed = await bcrypt.hash(dto.password, 10);
    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        password: hashed,
        name: dto.name,
        phone: dto.phone,
        role: Role.NASABAH,
      },
    });

    return this.buildAuthResponse(
      user.id,
      user.email,
      user.role,
      user.name,
      user.pointBalance,
      user.foto,
    );
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (!user) {
      throw new UnauthorizedException('Email atau password salah');
    }

    const match = await bcrypt.compare(dto.password, user.password);
    if (!match) {
      throw new UnauthorizedException('Email atau password salah');
    }

    return this.buildAuthResponse(
      user.id,
      user.email,
      user.role,
      user.name,
      user.pointBalance,
      user.foto,
    );
  }

  async me(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        role: true,
        foto: true,
        pointBalance: true,
        createdAt: true,
      },
    });
    if (!user) throw new UnauthorizedException('User tidak ditemukan');
    return {
      ...user,
      foto: user.foto ?? null,
      foto_url: buildPhotoUrl(user.foto),
    };
  }

  private buildAuthResponse(
    userId: string,
    email: string,
    role: Role,
    name: string,
    pointBalance = 0,
    foto: string | null = null,
  ) {
    const payload = { sub: userId, email, role };
    const accessToken = this.jwt.sign(payload);
    return {
      accessToken,
      user: {
        id: userId,
        email,
        name,
        role,
        pointBalance,
        foto: foto ?? null,
        foto_url: buildPhotoUrl(foto),
      },
    };
  }
}
