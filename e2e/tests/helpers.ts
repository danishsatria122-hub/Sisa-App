import { Page, expect } from '@playwright/test';

export const ADMIN = { email: 'admin@sisa.com', password: 'admin123' };
export const NASABAH = { email: 'budi@sisa.com', password: 'nasabah123' };

export async function login(page: Page, email: string, password: string) {
  await page.goto('/login');
  await page.getByPlaceholder('nama@email.com').fill(email);
  await page.getByPlaceholder('••••••••').fill(password);
  await page.getByRole('button', { name: 'Masuk' }).click();
}

export async function loginAsNasabah(page: Page) {
  await login(page, NASABAH.email, NASABAH.password);
  await expect(page).toHaveURL(/\/dashboard$/);
}

export async function loginAsAdmin(page: Page) {
  await login(page, ADMIN.email, ADMIN.password);
  await expect(page).toHaveURL(/\/admin\/dashboard$/);
}
