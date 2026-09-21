import { Module } from '@nestjs/common';
import { LaporanService } from './laporan.service';
import { LaporanController } from './laporan.controller';

@Module({
  providers: [LaporanService],
  controllers: [LaporanController],
})
export class LaporanModule {}
