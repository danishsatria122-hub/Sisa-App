import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function seedAdmin() {
  const email = 'admin@sisa.com';
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    console.log('✓ Admin sudah ada, dilewati.');
    return;
  }
  const password = await bcrypt.hash('admin123', 10);
  await prisma.user.create({
    data: { email, password, name: 'Admin SI:)SA', role: Role.ADMIN },
  });
  console.log(`✓ Admin dibuat: ${email} / admin123`);
}

async function seedNasabahDemo() {
  const demoUsers = [
    { email: 'budi@sisa.com', name: 'Budi Santoso', phone: '081234567001' },
    { email: 'siti@sisa.com', name: 'Siti Aminah', phone: '081234567002' },
    { email: 'andi@sisa.com', name: 'Andi Wijaya', phone: '081234567003' },
  ];

  for (const u of demoUsers) {
    const existing = await prisma.user.findUnique({ where: { email: u.email } });
    if (existing) continue;
    const password = await bcrypt.hash('nasabah123', 10);
    await prisma.user.create({
      data: { ...u, password, role: Role.NASABAH, pointBalance: 0 },
    });
  }
  console.log('✓ 3 akun Nasabah demo dibuat (password: nasabah123)');
}

async function seedKategoriSampah() {
  const kategoriList = [
    { nama: 'Botol Plastik PET', hargaPerKg: 3000, poinPerKg: 10 },
    { nama: 'Kardus', hargaPerKg: 2000, poinPerKg: 7 },
    { nama: 'Kertas Putih (HVS)', hargaPerKg: 2500, poinPerKg: 8 },
    { nama: 'Kaleng Aluminium', hargaPerKg: 8000, poinPerKg: 20 },
    { nama: 'Botol Kaca', hargaPerKg: 1000, poinPerKg: 5 },
    { nama: 'Plastik Kresek/Kemasan', hargaPerKg: 1500, poinPerKg: 5 },
  ];

  let created = 0;
  for (const k of kategoriList) {
    const existing = await prisma.kategoriSampah.findFirst({ where: { nama: k.nama } });
    if (existing) continue;
    await prisma.kategoriSampah.create({ data: k });
    created++;
  }
  console.log(`✓ ${created} kategori sampah demo dibuat (${kategoriList.length - created} sudah ada)`);
}

async function seedHadiah() {
  const hadiahList = [
    { nama: 'Tumbler SI:)SA', deskripsi: 'Tumbler stainless steel 500ml', poinDibutuhkan: 500, stok: 15 },
    { nama: 'Tas Belanja Kain', deskripsi: 'Tote bag kanvas, ramah lingkungan', poinDibutuhkan: 250, stok: 30 },
    { nama: 'Payung Lipat', deskripsi: 'Payung lipat anti angin', poinDibutuhkan: 800, stok: 10 },
    { nama: 'Voucher Pulsa 10rb', deskripsi: 'Voucher pulsa semua operator', poinDibutuhkan: 400, stok: 20 },
    { nama: 'Bibit Tanaman', deskripsi: 'Paket bibit tanaman hias/produktif', poinDibutuhkan: 150, stok: 0 },
  ];

  let created = 0;
  for (const h of hadiahList) {
    const existing = await prisma.hadiah.findFirst({ where: { nama: h.nama } });
    if (existing) continue;
    await prisma.hadiah.create({ data: h });
    created++;
  }
  console.log(`✓ ${created} hadiah demo dibuat (${hadiahList.length - created} sudah ada)`);
}

async function main() {
  console.log('🌱 Menjalankan seed SI:)SA...\n');
  await seedAdmin();
  await seedNasabahDemo();
  await seedKategoriSampah();
  await seedHadiah();
  console.log('\n✅ Seed selesai.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
