import { test, expect } from '@playwright/test';
import { login, loginAsNasabah, loginAsAdmin, ADMIN, NASABAH } from './helpers';

test.describe('Flow Login', () => {
  test('Nasabah dapat login dan diarahkan ke dashboard Nasabah', async ({ page }) => {
    await loginAsNasabah(page);
    await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
    await expect(page.getByText('Saldo Poin')).toBeVisible();
  });

  test('Admin dapat login dan diarahkan ke dashboard Admin', async ({ page }) => {
    await loginAsAdmin(page);
    await expect(page.getByRole('heading', { name: 'Dashboard Admin' })).toBeVisible();
    await expect(page.getByText('Total Nasabah')).toBeVisible();
  });

  test('Login dengan password salah menampilkan error', async ({ page }) => {
    await login(page, NASABAH.email, 'password-salah');
    await expect(page.getByText(/email atau password salah/i)).toBeVisible();
    await expect(page).toHaveURL(/\/login$/);
  });

  test('Nasabah tidak bisa mengakses halaman Admin', async ({ page }) => {
    await loginAsNasabah(page);
    await page.goto('/admin/dashboard');
    // middleware harus melempar kembali ke area Nasabah
    await expect(page).toHaveURL(/\/dashboard$/);
  });

  test('Logout mengarahkan kembali ke halaman login', async ({ page }) => {
    await loginAsAdmin(page);
    await page.getByRole('button', { name: 'Keluar' }).click();
    await expect(page).toHaveURL(/\/login$/);
  });
});
