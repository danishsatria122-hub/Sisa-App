import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';

export class CreateHadiahDto {
  @ApiProperty({ example: 'Tumbler SI:)SA' })
  @IsNotEmpty()
  @IsString()
  nama: string;

  @ApiProperty({ example: 'Tumbler stainless 500ml', required: false })
  @IsOptional()
  @IsString()
  deskripsi?: string;

  @ApiProperty({ example: 500 })
  @IsInt()
  @Min(1)
  poinDibutuhkan: number;

  @ApiProperty({ example: 10 })
  @IsInt()
  @Min(0)
  stok: number;

  @ApiProperty({ example: 'https://example.com/tumbler.png', required: false })
  @IsOptional()
  @IsString()
  gambarUrl?: string;
}

export class UpdateHadiahDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  nama?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  deskripsi?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsInt()
  @Min(1)
  poinDibutuhkan?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsInt()
  @Min(0)
  stok?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  gambarUrl?: string;
}
