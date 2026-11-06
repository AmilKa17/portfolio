import { chromium } from 'playwright'
import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const shots = path.resolve(__dirname, '../public/shots')
const tmp = path.resolve(__dirname, '../.tmp-scrolls')
fs.mkdirSync(tmp, { recursive: true })
fs.mkdirSync(shots, { recursive: true })

function stitchPngs(inputs, outPath) {
  const py = `
from PIL import Image
import sys
paths = sys.argv[1:-1]
out = sys.argv[-1]
imgs = [Image.open(p).convert('RGB') for p in paths]
w = max(i.width for i in imgs)
total_h = sum(i.height for i in imgs)
canvas = Image.new('RGB', (w, total_h), (22, 22, 22))
y = 0
for im in imgs:
    x = (w - im.width) // 2
    canvas.paste(im, (x, y))
    y += im.height
canvas.save(out, optimize=True)
print(out, canvas.size)
`
  execFileSync('python', ['-c', py, ...inputs, outPath], { stdio: 'inherit' })
}

async function fullPage(page, out) {
  await page.waitForTimeout(600)
  await page.screenshot({ path: out, fullPage: true, type: 'png' })
  const box = await page.evaluate(() => ({
    w: document.documentElement.scrollWidth,
    h: Math.max(
      document.documentElement.scrollHeight,
      document.body?.scrollHeight || 0,
    ),
  }))
  console.log('shot', path.basename(out), box)
}

const browser = await chromium.launch({ headless: true })
const context = await browser.newContext({
  viewport: { width: 1280, height: 800 },
  deviceScaleFactor: 1,
})

// --- Beta ---
{
  const page = await context.newPage()
  await page.goto('http://127.0.0.1:8765/', { waitUntil: 'networkidle', timeout: 90000 })
  await page.waitForTimeout(1200)
  await page.evaluate(() => {
    document.querySelectorAll('.reveal').forEach((el) => {
      el.classList.add('visible')
      el.style.opacity = '1'
      el.style.transform = 'none'
      el.style.visibility = 'visible'
    })
  })
  await fullPage(page, path.join(shots, 'beta-scroll.png'))
  await page.close()
}

// --- FizMat: home + events + course ---
{
  const page = await context.newPage()
  const parts = []
  for (const [i, url] of [
    'http://127.0.0.1:5173/',
    'http://127.0.0.1:5173/events',
    'http://127.0.0.1:5173/course/informatics',
  ].entries()) {
    await page.goto(url, { waitUntil: 'networkidle', timeout: 90000 })
    await page.waitForTimeout(1000)
    const out = path.join(tmp, `fizmat-${i}.png`)
    await fullPage(page, out)
    parts.push(out)
  }
  stitchPngs(parts, path.join(shots, 'fizmat-scroll.png'))
  await page.close()
}

// --- Trudo: login then several app pages ---
{
  const page = await context.newPage()
  await page.goto('http://127.0.0.1:8000/login/', { waitUntil: 'networkidle', timeout: 90000 })
  await page.selectOption('select', '1')
  await page.fill('input[type=password]', 'admin')
  await Promise.all([
    page.waitForNavigation({ timeout: 10000 }),
    page.click('button[type=submit], input[type=submit]'),
  ])
  await page.waitForTimeout(800)

  const links = await page.evaluate(() =>
    [...document.querySelectorAll('a[href]')]
      .map((a) => a.getAttribute('href'))
      .filter(Boolean)
      .filter((h) => h.startsWith('/') && !h.includes('logout') && !h.includes('login')),
  )
  console.log('trudo links', [...new Set(links)].slice(0, 20))

  const candidates = [
    page.url(),
    ...[...new Set(links)]
      .filter((h) => !h.includes('#') && h.length > 1)
      .slice(0, 8)
      .map((h) => new URL(h, 'http://127.0.0.1:8000').href),
  ]

  const parts = []
  let i = 0
  for (const url of candidates) {
    try {
      await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 })
      await page.waitForTimeout(700)
      const h = await page.evaluate(() =>
        Math.max(document.documentElement.scrollHeight, document.body.scrollHeight),
      )
      if (h < 400) continue
      const out = path.join(tmp, `trudo-${i}.png`)
      await fullPage(page, out)
      parts.push(out)
      i += 1
      if (parts.length >= 4) break
    } catch (e) {
      console.log('skip', url, String(e).slice(0, 80))
    }
  }
  if (parts.length === 0) {
    const out = path.join(tmp, 'trudo-0.png')
    await fullPage(page, out)
    parts.push(out)
  }
  stitchPngs(parts, path.join(shots, 'trudo-scroll.png'))
  await page.close()
}

// --- LearnAI: home + catalog + tariffs ---
{
  const page = await context.newPage()
  const parts = []
  await page.goto('http://127.0.0.1:5175/', { waitUntil: 'networkidle', timeout: 90000 })
  await page.waitForTimeout(1000)
  let out = path.join(tmp, 'learnai-0.png')
  await fullPage(page, out)
  parts.push(out)

  for (const [i, label] of ['Каталог', 'Тарифы', 'Моё обучение'].entries()) {
    const btn = page.getByRole('button', { name: label })
    if (await btn.count()) {
      await btn.first().click()
      await page.waitForTimeout(1200)
      out = path.join(tmp, `learnai-${i + 1}.png`)
      await fullPage(page, out)
      parts.push(out)
    }
  }
  stitchPngs(parts, path.join(shots, 'learnai-scroll.png'))
  await page.close()
}

await browser.close()
console.log('done')
