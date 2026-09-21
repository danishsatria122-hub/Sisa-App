import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { MetodeSetoran } from '@prisma/client';

export class CreateSetoranItemDto {
  @ApiProperty({ example: 'uuid-kategori-sampah' })
  @IsNotEmpty()
  @IsString()
  kategoriSampahId: string;

  @ApiProperty({ example: 5 })
  @IsNumber()
  @Min(0.1)
  beratPerkiraan: number;
}

export class CreateSetoranDto {
  @ApiProperty({ enum: MetodeSetoran, example: MetodeSetoran.ANTAR_SENDIRI })
  @IsEnum(MetodeSetoran)
  metode: MetodeSetoran;

  @ApiProperty({ type: [CreateSetoranItemDto] })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreateSetoranItemDto)
  items: CreateSetoranItemDto[];

  @ApiProperty({ required: false, description: 'Wajib jika metode = DIJEMPUT' })
  @ValidateIf((o) => o.metode === MetodeSetoran.DIJEMPUT)
  @IsNotEmpty()
  @IsString()
  addressId?: string;

  @ApiProperty({ required: false, description: 'Wajib jika metode = DIJEMPUT (format ISO date)' })
  @ValidateIf((o) => o.metode === MetodeSetoran.DIJEMPUT)
  @IsNotEmpty()
  @IsString()
  tanggalPickup?: string;

  @ApiProperty({ required: false, example: '09:00' })
  @ValidateIf((o) => o.metode === MetodeSetoran.DIJEMPUT)
  @IsNotEmpty()
  @IsString()
  waktuPickupMulai?: string;

  @ApiProperty({ required: false, example: '12:00' })
  @ValidateIf((o) => o.metode === MetodeSetoran.DIJEMPUT)
  @IsNotEmpty()
  @IsString()
  waktuPickupSelesai?: string;
}

export class UpdateSetoranStatusDto {
  @ApiProperty({ enum: ['terima', 'tolak'], example: 'terima' })
  @IsEnum(['terima', 'tolak'])
  action: 'terima' | 'tolak';

  @ApiProperty({ required: false, description: 'Wajib jika action = tolak' })
  @ValidateIf((o) => o.action === 'tolak')
  @IsNotEmpty()
  @IsString()
  alasanTolak?: string;
}

export class VerifikasiItemDto {
  @ApiProperty({ required: false, description: 'Kosongkan jika item baru dari Admin' })
  @IsOptional()
  @IsString()
  id?: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  kategoriSampahId: string;

  @ApiProperty({ example: 4.8 })
  @IsNumber()
  @Min(0)
  beratReal: number;
}

export class VerifikasiSetoranDto {
  @ApiProperty({ type: [VerifikasiItemDto] })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => VerifikasiItemDto)
  items: VerifikasiItemDto[];
}
