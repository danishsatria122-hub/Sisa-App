import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
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

  @Get('hadiah')
  @ApiOperation({ summary: 'Katalog hadiah (Nasabah)' })
  findAll() {
    return this.service.findAll();
  }

  @Get('hadiah/:id')
  @ApiOperation({ summary: 'Detail hadiah' })
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Post('admin/hadiah')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Tambah hadiah (Admin)' })
  create(@Body() dto: CreateHadiahDto) {
    return this.service.create(dto);
  }

  @Patch('admin/hadiah/:id')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Ubah hadiah (Admin)' })
  update(@Param('id') id: string, @Body() dto: UpdateHadiahDto) {
    return this.service.update(id, dto);
  }

  @Delete('admin/hadiah/:id')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Hapus hadiah (Admin)' })
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
