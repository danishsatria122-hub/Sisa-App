import { Module } from '@nestjs/common';
import { KategoriSampahService } from './kategori-sampah.service';
import { KategoriSampahController } from './kategori-sampah.controller';

@Module({
  providers: [KategoriSampahService],
  controllers: [KategoriSampahController],
  exports: [KategoriSampahService],
})
export class KategoriSampahModule {}
