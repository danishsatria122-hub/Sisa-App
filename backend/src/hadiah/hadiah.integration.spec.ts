import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../app.module';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Role } from '@prisma/client';
import { MulterExceptionFilter } from '../common/filters/multer-exception.filter';
import * as fs from 'fs';
import * as path from 'path';

describe('Hadiah photo CRUD integration', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let adminToken: string;
  const validJpeg = Buffer.from([
    0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10, 0x4a, 0x46, 0x49, 0x46, 0x00, 0x01, 0x01, 0x01, 0x00,
    0x48, 0x00, 0x48, 0x00, 0x00, 0xff, 0xd9,
  ]);
  const createdIds: string[] = [];

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({ imports: [AppModule] }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalFilters(new MulterExceptionFilter());
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    await app.init();

    prisma = app.get(PrismaService);
    const jwtService = app.get(JwtService);
    const config = app.get(ConfigService);
    adminToken = jwtService.sign(
      { sub: 'admin-photo-id', email: 'admin-photo@sisa.com', role: Role.ADMIN },
      { secret: config.get<string>('JWT_SECRET') ?? 'dev-secret' },
    );
  });

  afterAll(async () => {
    for (const id of createdIds) {
      try {
        const item = await prisma.hadiah.findUnique({ where: { id } });
        if (item?.foto) {
          const disk = path.resolve(process.cwd(), 'uploads', item.foto);
          if (fs.existsSync(disk)) fs.unlinkSync(disk);
        }
        await prisma.hadiah.delete({ where: { id } });
      } catch {
        // ignore cleanup
      }
    }
    await app.close();
  });

  it('should create hadiah with uploaded photo and include foto_url', async () => {
    const res = await request(app.getHttpServer())
      .post('/admin/hadiah')
      .set('Authorization', `Bearer ${adminToken}`)
      .field('nama', 'Tumbler SI:)SA')
      .field('deskripsi', 'Botol stainless 500ml')
      .field('poinDibutuhkan', '120')
      .field('stok', '5')
      .attach('foto', validJpeg, 'tumbler.jpg')
      .expect(201);

    expect(res.body.foto).toMatch(/^hadiah\/.*\.jpg$/);
    expect(res.body.foto_url).toContain('/uploads/hadiah/');
    createdIds.push(res.body.id);
  });

  it('should list hadiah with foto_url and allow replacing photo', async () => {
    const createRes = await request(app.getHttpServer())
      .post('/admin/hadiah')
      .set('Authorization', `Bearer ${adminToken}`)
      .field('nama', 'Kaos SI:)SA')
      .field('poinDibutuhkan', '80')
      .field('stok', '3')
      .attach('foto', validJpeg, 'kaos.jpg')
      .expect(201);

    createdIds.push(createRes.body.id);

    const list = await request(app.getHttpServer())
      .get('/hadiah')
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);

    expect(list.body.some((item: any) => item.id === createRes.body.id && item.foto_url)).toBe(true);

    const replace = await request(app.getHttpServer())
      .patch(`/admin/hadiah/${createRes.body.id}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .field('nama', 'Kaos SI:)SA Baru')
      .attach('foto', validJpeg, 'new-kaos.jpg')
      .expect(200);

    expect(replace.body.foto).toMatch(/^hadiah\/.*\.jpg$/);
    expect(replace.body.foto_url).toContain('/uploads/hadiah/');
  });
});
