import { Controller, Get, Query, UseGuards, BadRequestException } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { LaporanService } from './laporan.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser, JwtUserPayload } from '../auth/decorators/current-user.decorator';
import { Role } from '@prisma/client';

@ApiTags('Dashboard & Laporan')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Controller()
export class LaporanController {
  constructor(private service: LaporanService) {}

  @Get('dashboard')
  @ApiOperation({ summary: 'Dashboard Nasabah: saldo, statistik, transaksi terakhir' })
  dashboardNasabah(@CurrentUser() user: JwtUserPayload) {
    return this.service.dashboardNasabah(user.userId);
  }

  @Get('admin/dashboard')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Dashboard Admin: total Nasabah, pengajuan, sampah, poin, penukaran' })
  dashboardAdmin() {
    return this.service.dashboardAdmin();
  }

  @Get('admin/laporan/bulanan')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Laporan bulanan: total kg/ton, estimasi, poin, breakdown kategori' })
  laporanBulanan(@Query('bulan') bulan: string, @Query('tahun') tahun: string) {
    const b = parseInt(bulan, 10);
    const t = parseInt(tahun, 10);
    if (!b || !t || b < 1 || b > 12) {
      throw new BadRequestException('Parameter bulan (1-12) dan tahun wajib diisi dengan benar');
    }
    return this.service.laporanBulanan(b, t);
  }
}
