import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../app.module';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Role, StatusSetoran, MetodeSetoran } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
import * as bcrypt from 'bcryptjs';

describe('Setoran Mandatory QR Verification Integration Tests', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let jwtService: JwtService;
  let adminToken: string;
  let nasabahToken: string;

  let testAdminUser: any;
  let testNasabahUser: any;
  let testKategori: any;

  const createdSetoranIds: string[] = [];

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
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

    const pw = await bcrypt.hash('secret123', 10);
    // Find or create test users
    testAdminUser = await prisma.user.upsert({
      where: { email: 'test-admin-qr@sisa.test' },
      update: {},
      create: {
        email: 'test-admin-qr@sisa.test',
        password: pw,
        name: 'Test Admin QR',
        role: Role.ADMIN,
      },
    });

    testNasabahUser = await prisma.user.upsert({
      where: { email: 'test-nasabah-qr@sisa.test' },
      update: { pointBalance: 0 },
      create: {
        email: 'test-nasabah-qr@sisa.test',
        password: pw,
        name: 'Test Nasabah QR',
        role: Role.NASABAH,
        pointBalance: 0,
      },
    });

    testKategori = await prisma.kategoriSampah.findFirst({ where: { aktif: true } });
    if (!testKategori) {
      testKategori = await prisma.kategoriSampah.create({
        data: {
          nama: 'Test Sampah Plastik',
          hargaPerKg: 3000,
          poinPerKg: 10,
          aktif: true,
        },
      });
    }

    adminToken = jwtService.sign(
      { sub: testAdminUser.id, email: testAdminUser.email, role: Role.ADMIN },
      { secret },
    );
    nasabahToken = jwtService.sign(
      { sub: testNasabahUser.id, email: testNasabahUser.email, role: Role.NASABAH },
      { secret },
    );
  });

  afterAll(async () => {
    for (const id of createdSetoranIds) {
      try {
        await prisma.setoranItem.deleteMany({ where: { setoranId: id } });
        await prisma.setoran.delete({ where: { id } });
      } catch {
        // ignore
      }
    }
    await app.close();
  });

  async function createTestSetoran(status: StatusSetoran = StatusSetoran.DITERIMA) {
    const qrCode = uuidv4();
    const setoran = await prisma.setoran.create({
      data: {
        kode: `TEST-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        userId: testNasabahUser.id,
        metode: MetodeSetoran.ANTAR_SENDIRI,
        status,
        qrCode,
        items: {
          create: [
            {
              kategoriSampahId: testKategori.id,
              namaKategoriSnapshot: testKategori.nama,
              hargaPerKgSnapshot: testKategori.hargaPerKg,
              poinPerKgSnapshot: testKategori.poinPerKg,
              beratPerkiraan: 2.0,
            },
          ],
        },
      },
      include: { items: true },
    });
    createdSetoranIds.push(setoran.id);
    return setoran;
  }

  // 1. Verify WITHOUT scan -> 409 and no points credited
  it('1. should reject verify WITHOUT scan with 409 QR_NOT_SCANNED and credit no points', async () => {
    const setoran = await createTestSetoran(StatusSetoran.DITERIMA);
    const initialUser = await prisma.user.findUnique({ where: { id: testNasabahUser.id } });

    const res = await request(app.getHttpServer())
      .patch(`/admin/setoran/${setoran.id}/verifikasi`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        items: [
          {
            id: setoran.items[0].id,
            kategoriSampahId: testKategori.id,
            beratReal: 3.0,
          },
        ],
      })
      .expect(409);

    expect(res.body.code).toBe('QR_NOT_SCANNED');
    expect(res.body.message).toContain('Scan QR setoran terlebih dahulu');

    // Also check selesaikan
    const resSelesaikan = await request(app.getHttpServer())
      .patch(`/admin/setoran/${setoran.id}/selesaikan`)
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(409);

    expect(resSelesaikan.body.code).toBe('QR_NOT_SCANNED');

    // Verify balance unchanged
    const afterUser = await prisma.user.findUnique({ where: { id: testNasabahUser.id } });
    expect(afterUser?.pointBalance).toBe(initialUser?.pointBalance);
  });

  // 2. Scan then verify -> success and points credited exactly once
  it('2. should succeed scan then verify and credit points exactly once', async () => {
    const setoran = await createTestSetoran(StatusSetoran.DITERIMA);
    const initialUser = await prisma.user.findUnique({ where: { id: testNasabahUser.id } });
    const initialBalance = initialUser?.pointBalance ?? 0;

    // A. Scan QR
    const scanRes = await request(app.getHttpServer())
      .post(`/admin/setoran/scan/${setoran.qrCode}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(201); // or 200

    expect(scanRes.body.status).toBe(StatusSetoran.SUDAH_DISCAN);
    expect(scanRes.body.discanPada).toBeDefined();
    expect(scanRes.body.discanOleh).toBe(testAdminUser.id);

    // B. Verifikasi (input real weight: 3.0 kg, poinPerKg: 10 -> 30 poin)
    const verifRes = await request(app.getHttpServer())
      .patch(`/admin/setoran/${setoran.id}/verifikasi`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        items: [
          {
            id: setoran.items[0].id,
            kategoriSampahId: testKategori.id,
            beratReal: 3.0,
          },
        ],
      })
      .expect(200);

    expect(verifRes.body.status).toBe(StatusSetoran.DIVERIFIKASI);
    expect(verifRes.body.totalPoin).toBe(30);

    // C. Selesaikan
    const selesaiRes = await request(app.getHttpServer())
      .patch(`/admin/setoran/${setoran.id}/selesaikan`)
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);

    expect(selesaiRes.body.status).toBe(StatusSetoran.SELESAI);

    // Check user points balance increased by exactly 30
    const finalUser = await prisma.user.findUnique({ where: { id: testNasabahUser.id } });
    expect(finalUser?.pointBalance).toBe(initialBalance + 30);
  });

  // 3. Verify twice -> points not doubled
  it('3. should reject verifying twice with 409 ALREADY_VERIFIED and not double points', async () => {
    const setoran = await createTestSetoran(StatusSetoran.DITERIMA);

    // Scan
    await request(app.getHttpServer())
      .get(`/admin/setoran/scan/${setoran.qrCode}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);

    // Verify
    await request(app.getHttpServer())
      .patch(`/admin/setoran/${setoran.id}/verifikasi`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        items: [
          {
            id: setoran.items[0].id,
            kategoriSampahId: testKategori.id,
            beratReal: 2.0,
          },
        ],
      })
      .expect(200);

    // First selesaikan
    await request(app.getHttpServer())
      .patch(`/admin/setoran/${setoran.id}/selesaikan`)
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);

    const userAfterFirst = await prisma.user.findUnique({ where: { id: testNasabahUser.id } });
    const balanceAfterFirst = userAfterFirst?.pointBalance ?? 0;

    // Second selesaikan must fail with 409 ALREADY_VERIFIED
    const secondRes = await request(app.getHttpServer())
      .patch(`/admin/setoran/${setoran.id}/selesaikan`)
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(409);

    expect(secondRes.body.code).toBe('ALREADY_VERIFIED');

    // Balance should remain unchanged
    const userAfterSecond = await prisma.user.findUnique({ where: { id: testNasabahUser.id } });
    expect(userAfterSecond?.pointBalance).toBe(balanceAfterFirst);
  });

  // 4. Two parallel verify requests -> one success and points credited once
  it('4. should handle parallel verify requests safely (points credited once)', async () => {
    const setoran = await createTestSetoran(StatusSetoran.DITERIMA);

    // Scan
    await request(app.getHttpServer())
      .get(`/admin/setoran/scan/${setoran.qrCode}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);

    // Verifikasi (weight: 2.0 kg -> 20 points)
    await request(app.getHttpServer())
      .patch(`/admin/setoran/${setoran.id}/verifikasi`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        items: [
          {
            id: setoran.items[0].id,
            kategoriSampahId: testKategori.id,
            beratReal: 2.0,
          },
        ],
      })
      .expect(200);

    const beforeBalance = (await prisma.user.findUnique({ where: { id: testNasabahUser.id } }))?.pointBalance ?? 0;

    // Send two simultaneous selesaikan requests
    const [res1, res2] = await Promise.all([
      request(app.getHttpServer())
        .patch(`/admin/setoran/${setoran.id}/selesaikan`)
        .set('Authorization', `Bearer ${adminToken}`),
      request(app.getHttpServer())
        .patch(`/admin/setoran/${setoran.id}/selesaikan`)
        .set('Authorization', `Bearer ${adminToken}`),
    ]);

    const statuses = [res1.status, res2.status].sort();
    expect(statuses).toEqual([200, 409]);

    const afterBalance = (await prisma.user.findUnique({ where: { id: testNasabahUser.id } }))?.pointBalance ?? 0;
    expect(afterBalance).toBe(beforeBalance + 20);
  });

  // 5. Scan with a wrong code -> 404 and nothing changes
  it('5. should return 404 for unknown or wrong QR code', async () => {
    const res = await request(app.getHttpServer())
      .get('/admin/setoran/scan/invalid-uuid-or-fake-code-1234')
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(404);

    expect(res.body.message).toContain('tidak ditemukan');
  });

  // 6. A nasabah calling scan or verify -> 403
  it('6. should reject scan or verify with 403 when called by Nasabah', async () => {
    const setoran = await createTestSetoran(StatusSetoran.DITERIMA);

    await request(app.getHttpServer())
      .get(`/admin/setoran/scan/${setoran.qrCode}`)
      .set('Authorization', `Bearer ${nasabahToken}`)
      .expect(403);

    await request(app.getHttpServer())
      .patch(`/admin/setoran/${setoran.id}/verifikasi`)
      .set('Authorization', `Bearer ${nasabahToken}`)
      .send({ items: [] })
      .expect(403);

    await request(app.getHttpServer())
      .patch(`/admin/setoran/${setoran.id}/selesaikan`)
      .set('Authorization', `Bearer ${nasabahToken}`)
      .expect(403);
  });

  // 7. Direct request that tries to set status = VERIFIED through any other route -> rejected
  it('7. should reject attempts to set status = DIVERIFIKASI or SELESAI through status update route', async () => {
    const setoran = await createTestSetoran(StatusSetoran.DIAJUKAN);

    // Trying to pass action: 'verifikasi' or invalid action
    await request(app.getHttpServer())
      .patch(`/admin/setoran/${setoran.id}/status`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ action: 'verifikasi' })
      .expect(400);

    // Trying to send client-supplied status
    await request(app.getHttpServer())
      .patch(`/admin/setoran/${setoran.id}/status`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ action: 'terima', status: 'DIVERIFIKASI' })
      .expect(400); // forbidNonWhitelisted triggers if 'status' field is provided
  });

  // 8. Already-verified rows are untouched
  it('8. should reject scan on already verified/completed deposit with 409 ALREADY_VERIFIED', async () => {
    const setoran = await createTestSetoran(StatusSetoran.DITERIMA);

    // Scan
    await request(app.getHttpServer())
      .get(`/admin/setoran/scan/${setoran.qrCode}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);

    // Verifikasi
    await request(app.getHttpServer())
      .patch(`/admin/setoran/${setoran.id}/verifikasi`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        items: [
          {
            id: setoran.items[0].id,
            kategoriSampahId: testKategori.id,
            beratReal: 1.0,
          },
        ],
      })
      .expect(200);

    // Selesaikan
    await request(app.getHttpServer())
      .patch(`/admin/setoran/${setoran.id}/selesaikan`)
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);

    // Try scanning again
    const scanAgain = await request(app.getHttpServer())
      .get(`/admin/setoran/scan/${setoran.qrCode}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(409);

    expect(scanAgain.body.code).toBe('ALREADY_VERIFIED');
  });
});
