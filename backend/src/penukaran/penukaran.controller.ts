import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { PenukaranService } from './penukaran.service';
import { CreatePenukaranDto, UpdatePenukaranStatusDto } from './dto/penukaran.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser, JwtUserPayload } from '../auth/decorators/current-user.decorator';
import { Role, StatusPenukaran } from '@prisma/client';

@ApiTags('Penukaran')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Controller()
export class PenukaranController {
  constructor(private service: PenukaranService) {}

  // ── NASABAH ──────────────────────────────────────────

  @Post('penukaran')
  @ApiOperation({ summary: 'Tukar poin dengan hadiah (Nasabah)' })
  create(@CurrentUser() user: JwtUserPayload, @Body() dto: CreatePenukaranDto) {
    return this.service.create(user.userId, dto.hadiahId);
  }

  @Get('penukaran')
  @ApiOperation({ summary: 'Riwayat penukaran milik sendiri (Nasabah)' })
  findAllForUser(@CurrentUser() user: JwtUserPayload) {
    return this.service.findAllForUser(user.userId);
  }

  @Get('penukaran/:id')
  @ApiOperation({ summary: 'Detail penukaran milik sendiri (Nasabah)' })
  findOneForUser(@CurrentUser() user: JwtUserPayload, @Param('id') id: string) {
    return this.service.findOneForUser(user.userId, id);
  }

  @Get('penukaran/:id/nota')
  @ApiOperation({ summary: 'Nota penukaran (Nasabah)' })
  getNota(@CurrentUser() user: JwtUserPayload, @Param('id') id: string) {
    return this.service.getNotaForUser(user.userId, id);
  }

  // ── ADMIN ────────────────────────────────────────────

  @Get('admin/penukaran')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Semua permintaan penukaran (Admin)' })
  findAllAdmin(@Query('status') status?: StatusPenukaran) {
    return this.service.findAllAdmin(status);
  }

  @Get('admin/penukaran/:id')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Detail penukaran (Admin)' })
  findOneAdmin(@Param('id') id: string) {
    return this.service.findOneAdmin(id);
  }

  @Patch('admin/penukaran/:id/status')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Ubah status: proses/selesai/batal, poin dikembalikan jika batal (Admin)' })
  updateStatus(@Param('id') id: string, @Body() dto: UpdatePenukaranStatusDto) {
    return this.service.updateStatus(id, dto.action);
  }
}
