import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AddressService } from './address.service';
import { CreateAddressDto, UpdateAddressDto } from './dto/address.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser, JwtUserPayload } from '../auth/decorators/current-user.decorator';

@ApiTags('Address')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Controller('addresses')
export class AddressController {
  constructor(private service: AddressService) {}

  @Get()
  @ApiOperation({ summary: 'Daftar alamat milik Nasabah yang login' })
  findAll(@CurrentUser() user: JwtUserPayload) {
    return this.service.findAllForUser(user.userId);
  }

  @Post()
  @ApiOperation({ summary: 'Tambah alamat baru' })
  create(@CurrentUser() user: JwtUserPayload, @Body() dto: CreateAddressDto) {
    return this.service.create(user.userId, dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Ubah alamat' })
  update(
    @CurrentUser() user: JwtUserPayload,
    @Param('id') id: string,
    @Body() dto: UpdateAddressDto,
  ) {
    return this.service.update(user.userId, id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Hapus alamat' })
  remove(@CurrentUser() user: JwtUserPayload, @Param('id') id: string) {
    return this.service.remove(user.userId, id);
  }
}
