import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class CreatePenukaranDto {
  @ApiProperty({ example: 'uuid-hadiah' })
  @IsNotEmpty()
  @IsString()
  hadiahId: string;
}

export class UpdatePenukaranStatusDto {
  @ApiProperty({ enum: ['proses', 'selesai', 'batal'], example: 'selesai' })
  @IsEnum(['proses', 'selesai', 'batal'])
  action: 'proses' | 'selesai' | 'batal';
}
