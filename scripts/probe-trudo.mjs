import { chromium } from 'playwright'

const passwords = [
  'admin',
  'admin123',
  '12345',
  '123456',
  'password',
  'demo',
  'qwerty',
  'Admin',
  '1',
  '0000',
  '1111',
  'trudo',
  'pass',
  'root',
]

const browser = await chromium.launch({ headless: true })
const page = await browser.newPage()

for (const pw of passwords) {
  await page.goto('http://127.0.0.1:8000/login/', { waitUntil: 'networkidle' })
  await page.selectOption('select', '1')
  await page.fill('input[type=password]', pw)
  await Promise.all([
    page.waitForNavigation({ timeout: 5000 }).catch(() => null),
    page.click('button[type=submit], input[type=submit]'),
  ])
  await page.waitForTimeout(500)
  const url = page.url()
  console.log(pw, '->', url)
  if (!url.includes('/login')) {
    console.log('SUCCESS', pw)
    const h = await page.evaluate(() =>
      Math.max(document.documentElement.scrollHeight, document.body.scrollHeight),
    )
    console.log('height', h, 'path', page.url())
    break
  }
}

await browser.close()
