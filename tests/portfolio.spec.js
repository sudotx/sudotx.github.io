import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

test('opening, project links, navigation, and both themes stay accessible', async ({
  page,
}) => {
  await page.emulateMedia({ colorScheme: 'light' })
  await page.goto('/')
  await expect(page.getByRole('heading', { name: 'about me' })).toBeVisible()
  await expect(page.getByText('AFK AF', { exact: true })).toBeVisible()
  await expect(page.getByText('TƎᴎA⅃ꟼ ƎHT KↃAH', { exact: true })).toBeVisible()
  await expect(
    page.getByRole('banner').getByRole('link', { name: 'github ↗' }),
  ).toBeVisible()
  for (const name of [
    'miyatees',
    'gas-station-service',
    'fitcheck',
    'anchor-token-whitelist',
    'jobs-program',
  ]) {
    await expect(
      page.getByRole('link', { name, exact: false }).first(),
    ).toHaveAttribute('href', `https://github.com/sudotx/${name}`)
  }
  await page.keyboard.press('Tab')
  await expect(
    page.getByRole('link', { name: 'Skip to content' }),
  ).toBeFocused()
  await page.keyboard.press('Enter')
  await expect(page.getByRole('main')).toBeFocused()

  for (const theme of ['light', 'dark']) {
    if (theme === 'dark')
      await page
        .getByRole('button', { name: 'Light theme. Switch to dark theme' })
        .click()
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze()
    expect(results.violations).toEqual([])
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true)
  }

  for (const [label, heading] of [
    ['work', 'selected work'],
    ['experience', 'experience'],
    ['stack', 'stack'],
    ['contact', /open to working/],
  ]) {
    await page
      .getByRole('navigation', { name: 'Sections' })
      .getByRole('link', { name: label, exact: true })
      .click()
    const target = page.getByRole('heading', { name: heading, exact: true })
    await expect(target).toBeInViewport()
    const targetBox = await target.boundingBox()
    const headerBox = await page.getByRole('banner').boundingBox()
    expect(targetBox.y).toBeGreaterThanOrEqual(headerBox.y + headerBox.height)
  }
  await expect(
    page.getByRole('link', { name: 'let’s talk on Telegram ↗' }),
  ).toHaveAttribute('href', 'https://t.me/sudotx')
})

test('theme follows the system until an explicit preference is saved', async ({
  page,
}) => {
  await page.emulateMedia({ colorScheme: 'dark' })
  await page.goto('/')
  await expect(
    page.getByRole('button', { name: 'Dark theme. Switch to light theme' }),
  ).toBeVisible()
  await expect(page.locator('html')).toHaveCSS('color-scheme', 'dark')
  await page.emulateMedia({ colorScheme: 'light' })
  const button = page.getByRole('button', {
    name: 'Light theme. Switch to dark theme',
  })
  await expect(button).toBeVisible()
  await button.focus()
  await page.keyboard.press('Enter')
  await page.reload()
  await expect(page.locator('html')).toHaveCSS('color-scheme', 'dark')
  await expect(
    page.getByRole('button', { name: 'Dark theme. Switch to light theme' }),
  ).toBeVisible()
  await page.getByRole('button').click()
  await page.emulateMedia({ colorScheme: 'dark' })
  await page.reload()
  await expect(page.locator('html')).toHaveCSS('color-scheme', 'light')
})

test('blocked storage does not break the page or theme switch', async ({
  page,
}) => {
  const errors = []
  page.on('pageerror', (error) => errors.push(error.message))
  await page.addInitScript(() => {
    Object.defineProperty(window, 'localStorage', {
      get() {
        throw new DOMException('Storage blocked', 'SecurityError')
      },
    })
  })
  await page.emulateMedia({ colorScheme: 'light', reducedMotion: 'reduce' })
  await page.goto('/')
  await page
    .getByRole('button', { name: 'Light theme. Switch to dark theme' })
    .click()
  await expect(page.locator('html')).toHaveCSS('color-scheme', 'dark')
  await expect(
    page.getByRole('heading', { name: 'selected work' }),
  ).toBeVisible()
  expect(errors).toEqual([])
})
