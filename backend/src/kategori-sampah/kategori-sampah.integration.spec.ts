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

describe('KategoriSampah Integration / E2E Tests (#14-#18)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let jwtService: JwtService;
  let adminToken: string;
  let nasabahToken: string;

  const validJpeg = Buffer.from([
    0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10, 0x4a, 0x46, 0x49, 0x46, 0x00, 0x01, 0x01, 0x01, 0x00,
    0x48, 0x00, 0x48, 0x00, 0x00, 0xff, 0xd9,
  ]);
  const validPng = Buffer.from([
    0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00, 0x00, 0x00, 0x0d, 0x49, 0x48, 0x44,
    0x52,
  ]);
  const fakeJpg = Buffer.from('NOT_A_REAL_IMAGE_CONTENT_PLAIN_TEXT_DATA_SAMPLE');
  const tooLargeJpg = Buffer.concat([validJpeg, Buffer.alloc(2.5 * 1024 * 1024, 1)]);

  const createdCategoryIds: string[] = [];

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
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
    jwtService = app.get(JwtService);
    const config = app.get(ConfigService);
    const secret = config.get<string>('JWT_SECRET') ?? 'dev-secret';

    adminToken = jwtService.sign(
      { sub: 'admin-test-id', email: 'admin@sisa.com', role: Role.ADMIN },
      { secret },
    );
    nasabahToken = jwtService.sign(
      { sub: 'nasabah-test-id', email: 'nasabah@sisa.com', role: Role.NASABAH },
      { secret },
    );
  });

  afterAll(async () => {
    // Cleanup created test categories
    for (const id of createdCategoryIds) {
      try {
        const item = await prisma.kategoriSampah.findUnique({ where: { id } });
        if (item?.foto) {
          const p = path.resolve(process.cwd(), 'uploads', item.foto);
          if (fs.existsSync(p)) fs.unlinkSync(p);
        }
        await prisma.kategoriSampah.delete({ where: { id } });
      } catch {
        // ignore
      }
    }
    await app.close();
  });

  // 1. Create with photo (POST /api/v1/kategori-sampah)
  it('1. should create category with photo (Admin)', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/v1/kategori-sampah')
      .set('Authorization', `Bearer ${adminToken}`)
      .field('nama', 'Test Kategori Photo')
      .field('hargaPerKg', '4000')
      .field('poinPerKg', '12')
      .field('aktif', 'true')
      .attach('foto', validJpeg, 'photo.jpg')
      .expect(201);

    expect(res.body.id).toBeDefined();
    expect(res.body.nama).toBe('Test Kategori Photo');
    expect(res.body.foto).toMatch(/^kategori-sampah\/.*\.jpg$/);
    expect(res.body.foto_url).toContain('/uploads/kategori-sampah/');
    createdCategoryIds.push(res.body.id);

    // Verify file exists on disk
    const diskPath = path.resolve(process.cwd(), 'uploads', res.body.foto);
    expect(fs.existsSync(diskPath)).toBe(true);
  });

  // 2. Create without photo
  it('2. should create category without photo (Admin)', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/v1/kategori-sampah')
      .set('Authorization', `Bearer ${adminToken}`)
      .field('nama', 'Test Kategori No Photo')
      .field('hargaPerKg', '2500')
      .field('poinPerKg', '8')
      .field('aktif', 'true')
      .expect(201);

    expect(res.body.id).toBeDefined();
    expect(res.body.foto).toBeNull();
    expect(res.body.foto_url).toBeNull();
    createdCategoryIds.push(res.body.id);
  });

  // 3. Update with a new photo (old file removed)
  it('3. should update with a new photo and delete old file', async () => {
    // Create initial
    const initRes = await request(app.getHttpServer())
      .post('/api/v1/kategori-sampah')
      .set('Authorization', `Bearer ${adminToken}`)
      .field('nama', 'Test Update Replace Photo')
      .field('hargaPerKg', '5000')
      .field('poinPerKg', '15')
      .attach('foto', validJpeg, 'first.jpg')
      .expect(201);

    const oldFilePath = path.resolve(process.cwd(), 'uploads', initRes.body.foto);
    expect(fs.existsSync(oldFilePath)).toBe(true);
    createdCategoryIds.push(initRes.body.id);

    // Update with PNG
    const updateRes = await request(app.getHttpServer())
      .put(`/api/v1/kategori-sampah/${initRes.body.id}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .field('nama', 'Test Update Replace Photo Edited')
      .attach('foto', validPng, 'second.png')
      .expect(200);

    expect(updateRes.body.foto).toMatch(/^kategori-sampah\/.*\.png$/);
    const newFilePath = path.resolve(process.cwd(), 'uploads', updateRes.body.foto);
    expect(fs.existsSync(newFilePath)).toBe(true);

    // Old file must be removed
    expect(fs.existsSync(oldFilePath)).toBe(false);
  });

  // 4. Update without photo (kept)
  it('4. should update text fields and keep existing photo', async () => {
    const initRes = await request(app.getHttpServer())
      .post('/api/v1/kategori-sampah')
      .set('Authorization', `Bearer ${adminToken}`)
      .field('nama', 'Test Keep Photo')
      .field('hargaPerKg', '3000')
      .field('poinPerKg', '10')
      .attach('foto', validJpeg, 'first.jpg')
      .expect(201);

    createdCategoryIds.push(initRes.body.id);
    const originalFoto = initRes.body.foto;

    const updateRes = await request(app.getHttpServer())
      .put(`/api/v1/kategori-sampah/${initRes.body.id}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .field('nama', 'Test Keep Photo Updated')
      .field('hargaPerKg', '3500')
      .expect(200);

    expect(updateRes.body.nama).toBe('Test Keep Photo Updated');
    expect(updateRes.body.foto).toBe(originalFoto);
    expect(updateRes.body.foto_url).toContain(originalFoto);
  });

  // 5. Reject wrong type (e.g. text/plain or gif)
  it('5. should reject wrong type with 400', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/v1/kategori-sampah')
      .set('Authorization', `Bearer ${adminToken}`)
      .field('nama', 'Test Wrong Type')
      .field('hargaPerKg', '3000')
      .field('poinPerKg', '10')
      .attach('foto', Buffer.from('GIF89a...fake_gif'), 'sample.gif')
      .expect(400);

    expect(res.body.message).toMatch(/Tipe file tidak diizinkan|tidak valid/i);
  });

  // 6. Reject too large file (> 2MB)
  it('6. should reject file larger than 2MB with 400', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/v1/kategori-sampah')
      .set('Authorization', `Bearer ${adminToken}`)
      .field('nama', 'Test Too Large')
      .field('hargaPerKg', '3000')
      .field('poinPerKg', '10')
      .attach('foto', tooLargeJpg, 'large.jpg')
      .expect(400);

    expect(res.body.message).toMatch(/Ukuran file terlalu besar/i);
  });

  // 7. Reject fake file with .jpg extension but text content
  it('7. should reject fake .jpg file with non-image magic bytes with 400', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/v1/kategori-sampah')
      .set('Authorization', `Bearer ${adminToken}`)
      .field('nama', 'Test Fake Jpg')
      .field('hargaPerKg', '3000')
      .field('poinPerKg', '10')
      .attach('foto', fakeJpg, 'fake.jpg')
      .expect(400);

    expect(res.body.message).toMatch(/Tipe file tidak diizinkan|tidak valid/i);
  });

  // 8. Nasabah gets 403 on POST / PUT / DELETE
  it('8. should return 403 when Nasabah tries to POST, PUT, or DELETE', async () => {
    // POST
    await request(app.getHttpServer())
      .post('/api/v1/kategori-sampah')
      .set('Authorization', `Bearer ${nasabahToken}`)
      .field('nama', 'Unauthorized Category')
      .field('hargaPerKg', '1000')
      .field('poinPerKg', '5')
      .expect(403);

    // Pick one created id
    const targetId = createdCategoryIds[0];

    // PUT
    await request(app.getHttpServer())
      .put(`/api/v1/kategori-sampah/${targetId}`)
      .set('Authorization', `Bearer ${nasabahToken}`)
      .field('nama', 'Unauthorized Edit')
      .expect(403);

    // DELETE
    await request(app.getHttpServer())
      .delete(`/api/v1/kategori-sampah/${targetId}`)
      .set('Authorization', `Bearer ${nasabahToken}`)
      .expect(403);
  });

  // 9. GET works for Nasabah
  it('9. should allow Nasabah to list and get detail', async () => {
    // List
    const listRes = await request(app.getHttpServer())
      .get('/api/v1/kategori-sampah')
      .set('Authorization', `Bearer ${nasabahToken}`)
      .expect(200);

    expect(Array.isArray(listRes.body)).toBe(true);
    expect(listRes.body.length).toBeGreaterThan(0);
    expect(listRes.body[0]).toHaveProperty('id');
    expect(listRes.body[0]).toHaveProperty('hargaPerKg');
    expect(listRes.body[0]).toHaveProperty('poinPerKg');
    expect(listRes.body[0]).toHaveProperty('foto');
    expect(listRes.body[0]).toHaveProperty('foto_url');

    // Detail
    const detailRes = await request(app.getHttpServer())
      .get(`/api/v1/kategori-sampah/${listRes.body[0].id}`)
      .set('Authorization', `Bearer ${nasabahToken}`)
      .expect(200);

    expect(detailRes.body.id).toBe(listRes.body[0].id);
    expect(detailRes.body).toHaveProperty('foto_url');
  });

  // 10. DELETE removes the file from disk
  it('10. should delete category and remove its photo from disk', async () => {
    const createRes = await request(app.getHttpServer())
      .post('/api/v1/kategori-sampah')
      .set('Authorization', `Bearer ${adminToken}`)
      .field('nama', 'Test Delete With Photo')
      .field('hargaPerKg', '1200')
      .field('poinPerKg', '4')
      .attach('foto', validJpeg, 'delete-me.jpg')
      .expect(201);

    const filePath = path.resolve(process.cwd(), 'uploads', createRes.body.foto);
    expect(fs.existsSync(filePath)).toBe(true);

    await request(app.getHttpServer())
      .delete(`/api/v1/kategori-sampah/${createRes.body.id}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);

    // File should be removed
    expect(fs.existsSync(filePath)).toBe(false);

    // Category should be gone
    await request(app.getHttpServer())
      .get(`/api/v1/kategori-sampah/${createRes.body.id}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(404);
  });

  // 11. DELETE of category referenced by transactions returns 409 Conflict
  it('11. should return 409 Conflict when deleting category referenced by setoran', async () => {
    // Create a temporary user & setoran with item
    const user = await prisma.user.create({
      data: {
        email: `test-${Date.now()}@sisa.com`,
        password: 'password',
        name: 'Test Trans User',
      },
    });

    const cat = await prisma.kategoriSampah.create({
      data: {
        nama: `Ref Category ${Date.now()}`,
        hargaPerKg: 3000,
        poinPerKg: 10,
      },
    });
    createdCategoryIds.push(cat.id);

    const setoran = await prisma.setoran.create({
      data: {
        kode: `SETORAN-TEST-${Date.now()}`,
        userId: user.id,
        metode: 'ANTAR_SENDIRI',
        status: 'DIAJUKAN',
      },
    });

    const setoranItem = await prisma.setoranItem.create({
      data: {
        setoranId: setoran.id,
        kategoriSampahId: cat.id,
        namaKategoriSnapshot: cat.nama,
        hargaPerKgSnapshot: 3000,
        poinPerKgSnapshot: 10,
        beratPerkiraan: 5,
      },
    });

    // Try to delete category
    const delRes = await request(app.getHttpServer())
      .delete(`/api/v1/kategori-sampah/${cat.id}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(409);

    expect(delRes.body.message).toMatch(/Kategori ini sudah dipakai di transaksi/i);

    // Clean up transaction
    await prisma.setoranItem.delete({ where: { id: setoranItem.id } });
    await prisma.setoran.delete({ where: { id: setoran.id } });
    await prisma.user.delete({ where: { id: user.id } });
  });
});
