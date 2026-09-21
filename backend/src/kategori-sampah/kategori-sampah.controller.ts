import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { KategoriSampahService } from './kategori-sampah.service';
import { CreateKategoriSampahDto, UpdateKategoriSampahDto } from './dto/kategori-sampah.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

@ApiTags('Kategori Sampah')
@Controller()
export class KategoriSampahController {
  constructor(private service: KategoriSampahService) {}

  private getBaseUrl(req: any): string {
    if (!req) return '';
    return `${req.protocol}://${req.get('host')}`;
  }

  // 14. GET /api/v1/kategori-sampah - Nasabah + Admin
  @Get(['api/v1/kategori-sampah', 'kategori-sampah'])
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Daftar kategori sampah (Nasabah & Admin)' })
  findList(@Req() req: any, @Query('all') all?: string) {
    const baseUrl = this.getBaseUrl(req);
    const userRole = req.user?.role;
    // Jika admin dan tidak minta filter aktif saja (all !== 'false'), kembalikan semua kategori
    if (userRole === Role.ADMIN && all !== 'false') {
      return this.service.findAllAdmin(baseUrl);
    }
    return this.service.findAllActive(baseUrl);
  }

  // Alias untuk admin list lama
  @Get('admin/kategori-sampah')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Daftar semua kategori sampah (Admin)' })
  findAllAdmin(@Req() req: any) {
    return this.service.findAllAdmin(this.getBaseUrl(req));
  }

  // 16. GET /api/v1/kategori-sampah/:id - Nasabah + Admin (detail)
  @Get(['api/v1/kategori-sampah/:id', 'admin/kategori-sampah/:id'])
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Detail kategori sampah (Nasabah & Admin)' })
  findOne(@Param('id') id: string, @Req() req: any) {
    return this.service.findOne(id, this.getBaseUrl(req));
  }

  // 15. POST /api/v1/kategori-sampah - Admin: create (photo upload)
  @Post(['api/v1/kategori-sampah', 'admin/kategori-sampah'])
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @UseInterceptors(
    FileInterceptor('foto', {
      limits: {
        fileSize: (parseInt(process.env.MAX_UPLOAD_MB || '2', 10)) * 1024 * 1024,
        files: 1,
      },
    }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      required: ['nama', 'hargaPerKg', 'poinPerKg'],
      properties: {
        nama: { type: 'string', example: 'Botol Plastik PET' },
        hargaPerKg: { type: 'number', example: 3000 },
        poinPerKg: { type: 'number', example: 10 },
        aktif: { type: 'boolean', example: true },
        foto: {
          type: 'string',
          format: 'binary',
          description: 'Foto kategori (JPEG, PNG, WebP, max 2MB)',
        },
      },
    },
  })
  @ApiOperation({ summary: 'Tambah kategori sampah dengan upload foto (Admin)' })
  create(
    @Body() dto: CreateKategoriSampahDto,
    @UploadedFile() file?: Express.Multer.File,
    @Req() req?: any,
  ) {
    return this.service.create(dto, file, this.getBaseUrl(req));
  }

  // 17. PUT /api/v1/kategori-sampah/:id - Admin: update (photo upload)
  @Put(['api/v1/kategori-sampah/:id', 'admin/kategori-sampah/:id'])
  @Patch(['api/v1/kategori-sampah/:id', 'admin/kategori-sampah/:id'])
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @UseInterceptors(
    FileInterceptor('foto', {
      limits: {
        fileSize: (parseInt(process.env.MAX_UPLOAD_MB || '2', 10)) * 1024 * 1024,
        files: 1,
      },
    }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        nama: { type: 'string', example: 'Botol Plastik PET' },
        hargaPerKg: { type: 'number', example: 3000 },
        poinPerKg: { type: 'number', example: 10 },
        aktif: { type: 'boolean', example: true },
        foto: {
          type: 'string',
          format: 'binary',
          description: 'Ganti foto kategori (opsional, JPEG, PNG, WebP, max 2MB)',
        },
      },
    },
  })
  @ApiOperation({ summary: 'Ubah kategori sampah dengan foto (Admin)' })
  update(
    @Param('id') id: string,
    @Body() dto: UpdateKategoriSampahDto,
    @UploadedFile() file?: Express.Multer.File,
    @Req() req?: any,
  ) {
    return this.service.update(id, dto, file, this.getBaseUrl(req));
  }

  // 18. DELETE /api/v1/kategori-sampah/:id - Admin: delete
  @Delete(['api/v1/kategori-sampah/:id', 'admin/kategori-sampah/:id'])
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Hapus kategori sampah (Admin)' })
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
