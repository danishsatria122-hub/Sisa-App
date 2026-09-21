import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { SetoranService } from './setoran.service';
import {
  CreateSetoranDto,
  UpdateSetoranStatusDto,
  VerifikasiSetoranDto,
} from './dto/setoran.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser, JwtUserPayload } from '../auth/decorators/current-user.decorator';
import { Role, StatusSetoran } from '@prisma/client';

@ApiTags('Setoran')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Controller()
export class SetoranController {
  constructor(private service: SetoranService) {}

  // ── NASABAH ──────────────────────────────────────────

  @Post('setoran')
  @ApiOperation({ summary: 'Buat pengajuan setoran baru (Nasabah)' })
  create(@CurrentUser() user: JwtUserPayload, @Body() dto: CreateSetoranDto) {
    return this.service.create(user.userId, dto);
  }

  @Get('setoran')
  @ApiOperation({ summary: 'Riwayat setoran milik sendiri (Nasabah)' })
  findAllForUser(
    @CurrentUser() user: JwtUserPayload,
    @Query('status') status?: StatusSetoran,
  ) {
    return this.service.findAllForUser(user.userId, status);
  }

  @Get('setoran/:id')
  @ApiOperation({ summary: 'Detail setoran milik sendiri (Nasabah)' })
  findOneForUser(@CurrentUser() user: JwtUserPayload, @Param('id') id: string) {
    return this.service.findOneForUser(user.userId, id);
  }

  @Delete('setoran/:id')
  @ApiOperation({ summary: 'Batalkan pengajuan (Nasabah, hanya jika status diajukan)' })
  cancel(@CurrentUser() user: JwtUserPayload, @Param('id') id: string) {
    return this.service.cancel(user.userId, id);
  }

  @Get('setoran/:id/qr')
  @ApiOperation({ summary: 'QR code untuk transaksi setoran (Nasabah)' })
  getQr(@CurrentUser() user: JwtUserPayload, @Param('id') id: string) {
    return this.service.getQrForUser(user.userId, id);
  }

  @Get('setoran/:id/nota')
  @ApiOperation({ summary: 'Nota transaksi setoran selesai (Nasabah)' })
  getNota(@CurrentUser() user: JwtUserPayload, @Param('id') id: string) {
    return this.service.getNotaForUser(user.userId, id);
  }

  // ── ADMIN ────────────────────────────────────────────

  @Get('admin/setoran')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Semua pengajuan, filter by status/metode/pencarian (Admin)' })
  findAllAdmin(
    @Query('status') status?: StatusSetoran,
    @Query('metode') metode?: string,
    @Query('search') search?: string,
  ) {
    return this.service.findAllAdmin({ status, metode, search });
  }

  @Get('admin/setoran/scan/:qrCode')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Scan QR setoran (GET) (Admin)' })
  scanQrCodeGet(
    @CurrentUser() user: JwtUserPayload,
    @Param('qrCode') qrCode: string,
  ) {
    return this.service.scanQrCode(user.userId, qrCode);
  }

  @Post(['admin/setoran/scan/:qrCode', 'admin/setoran/scan'])
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Scan QR setoran (POST) (Admin)' })
  scanQrCodePost(
    @CurrentUser() user: JwtUserPayload,
    @Param('qrCode') paramCode?: string,
    @Body('qrCode') bodyCode?: string,
  ) {
    const code = paramCode || bodyCode;
    return this.service.scanQrCode(user.userId, code as string);
  }

  @Get('admin/setoran/:id')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Detail pengajuan (Admin)' })
  findOneAdmin(@Param('id') id: string) {
    return this.service.findOneAdmin(id);
  }

  @Patch('admin/setoran/:id/status')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Terima/tolak pengajuan, wajib isi alasan jika tolak (Admin)' })
  updateStatus(@Param('id') id: string, @Body() dto: UpdateSetoranStatusDto) {
    return this.service.updateStatus(id, dto);
  }

  @Patch('admin/setoran/:id/verifikasi')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Input berat real per item, hitung poin otomatis (Admin)' })
  verifikasi(@Param('id') id: string, @Body() dto: VerifikasiSetoranDto) {
    return this.service.verifikasi(id, dto);
  }

  @Patch('admin/setoran/:id/selesaikan')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Finalisasi transaksi: kreditkan poin ke saldo Nasabah (Admin)' })
  selesaikan(@Param('id') id: string) {
    return this.service.selesaikan(id);
  }
}
