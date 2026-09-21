import { Module } from '@nestjs/common';
import { PenukaranService } from './penukaran.service';
import { PenukaranController } from './penukaran.controller';

@Module({
  providers: [PenukaranService],
  controllers: [PenukaranController],
  exports: [PenukaranService],
})
export class PenukaranModule {}
