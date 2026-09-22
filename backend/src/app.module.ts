import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { KategoriSampahModule } from './kategori-sampah/kategori-sampah.module';
import { SetoranModule } from './setoran/setoran.module';
import { HadiahModule } from './hadiah/hadiah.module';
import { PenukaranModule } from './penukaran/penukaran.module';
import { LaporanModule } from './laporan/laporan.module';
import { AddressModule } from './address/address.module';
import { ProfileModule } from './profile/profile.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    AuthModule,
    UsersModule,
    KategoriSampahModule,
    SetoranModule,
    HadiahModule,
    PenukaranModule,
    LaporanModule,
    AddressModule,
    ProfileModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
