import { test, expect } from '@playwright/test';

test('Happy Flow', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle('Билетик в кино');

  await page.getByTestId('login router link').click();
  await page.getByTestId('login router link').click();
  await page.getByRole('textbox', { name: 'Логин' }).click();
  await page.getByTestId('username').click();
  await page.getByTestId('username').fill('Aa111111');
  await page.getByTestId('password').click();
  await page.getByTestId('password').fill('Aa111111');
  await page.getByTestId('password confirmation').click();
  await page.getByTestId('password confirmation').fill('Aa111111');
  await page.getByTestId('register button').click();

  await page.getByTestId('movies router link').click();
  await page.getByTestId('view sessions').first().click();
  await page.getByTestId('view session').first().click();

  await page.getByTitle('Ряд 1, место 1', { exact: true }).click();
  await page.getByTitle('Ряд 1, место 2', { exact: true }).click();
  await page.getByTitle('Ряд 1, место 3', { exact: true }).click();
  await page.getByTestId('book button').click();

  await page.getByTestId('pay button').first().click();
})
