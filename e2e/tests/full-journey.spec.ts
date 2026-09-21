import { test, expect } from '@playwright/test';
import { loginAsNasabah, loginAsAdmin } from './helpers';

// Data ini mengacu ke seed demo (prisma/seed.ts):
// Kategori "Botol Plastik PET" = 10 poin/kg, berat 50kg -> 500 poin.
// Hadiah "Tas Belanja Kain" butuh 250 poin (stok tersedia).
const KATEGORI_LABEL = 'Botol Plastik PET (10 poin/kg)';
const BERAT_KG = '50';
const EXPECTED_POIN = 500;
const HADIAH_NAMA = 'Tas Belanja Kain';

test('Flow lengkap: setor sampah → verifikasi Admin → poin masuk → tukar poin', async ({
  browser,
}) => {
  const nasabahContext = await browser.newContext();
  const adminContext = await browser.newContext();
  const nasabahPage = await nasabahContext.newPage();
  const adminPage = await adminContext.newPage();

  await test.step('Nasabah membuat pengajuan setoran (Antar Sendiri)', async () => {
    await loginAsNasabah(nasabahPage);
    await nasabahPage.goto('/setoran/baru');

    await nasabahPage.getByRole('button', { name: /Antar Sendiri/ }).click();
    await nasabahPage.getByRole('button', { name: /Lanjut/ }).click();

    await nasabahPage.getByTestId('item-kategori-0').selectOption({ label: KATEGORI_LABEL });
    await nasabahPage.getByTestId('item-berat-0').fill(BERAT_KG);
    await nasabahPage.getByRole('button', { name: /Lanjut/ }).click();

    await expect(nasabahPage.getByText('Review pengajuan')).toBeVisible();
    await nasabahPage.getByRole('button', { name: 'Kirim Pengajuan' }).click();

    await expect(nasabahPage).toHaveURL(/\/setoran$/);
  });

  const kode = await test.step('Ambil kode transaksi yang baru dibuat', async () => {
    const firstItem = nasabahPage.locator('a', { hasText: 'SETOR-' }).first();
    await expect(firstItem).toBeVisible();
    const text = await firstItem.locator('p').first().textContent();
    expect(text).toBeTruthy();
    return text!.trim();
  });

  await test.step('Admin menerima pengajuan', async () => {
    await loginAsAdmin(adminPage);
    await adminPage.goto('/admin/setoran');
    await adminPage.getByPlaceholder('Cari kode / nama nasabah...').fill(kode);
    await adminPage.getByRole('button', { name: 'Cari', exact: true }).click();

    const row = adminPage.locator('tr', { hasText: kode });
    await expect(row).toBeVisible();
    await row.getByRole('button', { name: 'Terima' }).click();
    await expect(row.getByText('Diterima')).toBeVisible();
  });

  await test.step('Admin verifikasi berat real dan menyelesaikan transaksi', async () => {
    const row = adminPage.locator('tr', { hasText: kode });
    await row.getByRole('button', { name: 'Verifikasi' }).click();

    await expect(adminPage).toHaveURL(/\/admin\/setoran\/.+\/verifikasi$/);
    await adminPage.getByTestId('verifikasi-berat-0').fill(BERAT_KG);
    await adminPage.getByRole('button', { name: 'Selesaikan Verifikasi' }).click();

    await expect(adminPage).toHaveURL(/\/admin\/setoran$/);
  });

  await test.step('Poin masuk ke saldo Nasabah', async () => {
    await nasabahPage.goto('/dashboard');
    await expect(nasabahPage.getByTestId('saldo-poin-value')).toHaveText(
      String(EXPECTED_POIN),
    );
  });

  await test.step('Nasabah menukar poin dengan hadiah', async () => {
    await nasabahPage.goto('/hadiah');
    const card = nasabahPage.locator('[data-testid="hadiah-card"]', { hasText: HADIAH_NAMA });
    await card.getByRole('button', { name: 'Tukar' }).click();
    await nasabahPage.getByRole('button', { name: 'Ya, Tukar' }).click();

    await expect(nasabahPage.getByText(`Berhasil menukar ${HADIAH_NAMA}!`)).toBeVisible();
  });

  await test.step('Admin menyelesaikan permintaan penukaran', async () => {
    await adminPage.goto('/admin/penukaran');
    const row = adminPage.locator('tr', { hasText: HADIAH_NAMA }).first();
    await expect(row).toBeVisible();
    await row.getByRole('button', { name: 'Selesai' }).click();
    await expect(row.getByText('Selesai')).toBeVisible();
  });

  await nasabahContext.close();
  await adminContext.close();
});
