import { test, expect } from '@playwright/test';
import { login } from './helpers';

// Pakai akun demo berbeda dari full-journey.spec.ts supaya saldo/riwayatnya tidak tercampur.
const NASABAH_PICKUP = { email: 'siti@sisa.com', password: 'nasabah123' };

function futureDateInput(daysAhead: number): string {
  const d = new Date();
  d.setDate(d.getDate() + daysAhead);
  return d.toISOString().split('T')[0];
}

test('Nasabah dapat membuat pengajuan setoran dengan metode Dijemput', async ({ page }) => {
  await login(page, NASABAH_PICKUP.email, NASABAH_PICKUP.password);

  await test.step('Tambah alamat di halaman Profil', async () => {
    await page.goto('/profil');
    await page.getByRole('button', { name: '+ Tambah Alamat' }).click();
    await page.getByPlaceholder('Rumah, Kos, dll').fill('Rumah');
    await page.locator('textarea').fill('Jl. Merdeka No. 10, Malang');
    await page.getByRole('button', { name: 'Simpan' }).click();
    await expect(page.getByText('Alamat berhasil ditambahkan')).toBeVisible();
  });

  await test.step('Isi pengajuan setoran metode Dijemput', async () => {
    await page.goto('/setoran/baru');
    await page.getByRole('button', { name: /Dijemput/ }).click();
    await page.getByRole('button', { name: /Lanjut/ }).click();

    // Step 2: jadwal pickup — alamat utama otomatis terpilih
    await page.locator('input[type="date"]').fill(futureDateInput(3));
    await page.locator('input[type="time"]').first().fill('09:00');
    await page.locator('input[type="time"]').last().fill('12:00');
    await page.getByRole('button', { name: /Lanjut/ }).click();

    // Step 3: item
    await page.getByTestId('item-kategori-0').selectOption({ index: 1 });
    await page.getByTestId('item-berat-0').fill('3');
    await page.getByRole('button', { name: /Lanjut/ }).click();

    // Step 4: review harus menampilkan alamat & jadwal
    await expect(page.getByText('Jl. Merdeka No. 10, Malang')).toBeVisible();
    await page.getByRole('button', { name: 'Kirim Pengajuan' }).click();
  });

  await expect(page).toHaveURL(/\/setoran$/);
  const newest = page.locator('a', { hasText: 'SETOR-' }).first();
  await expect(newest).toContainText('Dijemput');
});
