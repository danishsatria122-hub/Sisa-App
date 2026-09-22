import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { HadiahService } from './hadiah.service';
import { CreateHadiahDto, UpdateHadiahDto } from './dto/hadiah.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

@ApiTags('Hadiah')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Controller()
export class HadiahController {
  constructor(private service: HadiahService) {}

  private getBaseUrl(req: any): string {
    if (!req) return '';
    return `${req.protocol}://${req.get('host')}`;
  }

  @Get('hadiah')
  @ApiOperation({ summary: 'Katalog hadiah (Nasabah)' })
  findAll(@Req() req: any) {
    return this.service.findAll(this.getBaseUrl(req));
  }

  @Get('hadiah/:id')
  @ApiOperation({ summary: 'Detail hadiah' })
  findOne(@Param('id') id: string, @Req() req: any) {
    return this.service.findOne(id, this.getBaseUrl(req));
  }

  @Post('admin/hadiah')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
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
      required: ['nama', 'poinDibutuhkan', 'stok'],
      properties: {
        nama: { type: 'string', example: 'Tumbler SI:)SA' },
        deskripsi: { type: 'string', example: 'Botol stainless 500ml' },
        poinDibutuhkan: { type: 'number', example: 120 },
        stok: { type: 'number', example: 5 },
        foto: {
          type: 'string',
          format: 'binary',
          description: 'Foto hadiah (JPEG, PNG, WebP, max 2MB)',
        },
      },
    },
  })
  @ApiOperation({ summary: 'Tambah hadiah (Admin)' })
  create(
    @Body() dto: CreateHadiahDto,
    @UploadedFile() file?: Express.Multer.File,
    @Req() req?: any,
  ) {
    if (!dto || typeof dto !== 'object') {
      throw new BadRequestException('Data hadiah tidak valid');
    }
    return this.service.create(dto, file, this.getBaseUrl(req));
  }

  @Patch('admin/hadiah/:id')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
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
        nama: { type: 'string', example: 'Tumbler SI:)SA' },
        deskripsi: { type: 'string', example: 'Botol stainless 500ml' },
        poinDibutuhkan: { type: 'number', example: 120 },
        stok: { type: 'number', example: 5 },
        foto: {
          type: 'string',
          format: 'binary',
          description: 'Ganti foto hadiah (opsional, JPEG, PNG, WebP, max 2MB)',
        },
      },
    },
  })
  @ApiOperation({ summary: 'Ubah hadiah (Admin)' })
  update(
    @Param('id') id: string,
    @Body() dto: UpdateHadiahDto,
    @UploadedFile() file?: Express.Multer.File,
    @Req() req?: any,
  ) {
    if (!dto || typeof dto !== 'object') {
      throw new BadRequestException('Data hadiah tidak valid');
    }
    return this.service.update(id, dto, file, this.getBaseUrl(req));
  }

  @Delete('admin/hadiah/:id')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Hapus hadiah (Admin)' })
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
