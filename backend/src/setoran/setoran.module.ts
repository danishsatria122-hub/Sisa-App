import { Module } from '@nestjs/common';
import { SetoranService } from './setoran.service';
import { SetoranController } from './setoran.controller';

@Module({
  providers: [SetoranService],
  controllers: [SetoranController],
  exports: [SetoranService],
})
export class SetoranModule {}
