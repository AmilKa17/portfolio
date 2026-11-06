const { chromium } = require('playwright')
const { execFileSync } = require('child_process')
const path = require('path')
const fs = require('fs')

const shots = path.join(__dirname, 'public', 'shots')
const ffmpeg =
  process.env.FFMPEG ||
  'C:\\Users\\MECHREVO\\AppData\\Local\\Microsoft\\WinGet\\Packages\\Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe\\ffmpeg-9.0.2-full_build\\bin\\ffmpeg.exe'

async function forceReveal(page) {
  await page.evaluate(() => {
    document.querySelectorAll('.reveal').forEach((el) => {
      el.classList.add('visible')
      el.style.opacity = '1'
      el.style.transform = 'none'
    })
  })
}

async function captureBeta() {
  const browser = await chromium.launch({ headless: true })
  const page = await browser.newPage({ viewport: { width: 1400, height: 900 } })
  await page.goto('http://127.0.0.1:8765/', { waitUntil: 'networkidle', timeout: 60000 })
  await forceReveal(page)
  await page.waitForTimeout(800)

  // Hero
  await page.screenshot({ path: path.join(shots, 'beta-site.png'), fullPage: false })

  // Gallery (works section) - scroll to first gallery item
  const gallery = page.locator('.gallery-item').first()
  if (await gallery.count()) {
    await gallery.scrollIntoViewIfNeeded()
    await page.waitForTimeout(500)
    await page.evaluate(() => window.scrollBy(0, -120))
    await page.waitForTimeout(300)
  }
  await page.screenshot({ path: path.join(shots, 'beta-site-top.png'), fullPage: false })

  // Masters
  const masters = page.locator('.master-card').first()
  if (await masters.count()) {
    await masters.scrollIntoViewIfNeeded()
    await page.waitForTimeout(500)
    await page.evaluate(() => window.scrollBy(0, -140))
    await page.waitForTimeout(300)
  }
  await page.screenshot({ path: path.join(shots, 'beta-site-masters.png'), fullPage: false })

  // Full page for scroll preview
  await page.evaluate(() => window.scrollTo(0, 0))
  await page.waitForTimeout(400)
  await page.screenshot({ path: path.join(shots, 'beta-scroll.png'), fullPage: true })

  await browser.close()
  console.log('BETA_SHOTS_OK')
}

async function captureLearnAI() {
  const browser = await chromium.launch({ headless: true })
  const page = await browser.newPage({ viewport: { width: 1400, height: 900 } })
  await page.goto('http://127.0.0.1:5175/', { waitUntil: 'networkidle', timeout: 90000 })
  await page.waitForTimeout(1200)
  await page.screenshot({ path: path.join(shots, 'learnai.png'), fullPage: false })
  await page.evaluate(() => window.scrollTo(0, 500))
  await page.waitForTimeout(500)
  await page.screenshot({ path: path.join(shots, 'learnai-mid.png'), fullPage: false })
  await page.evaluate(() => window.scrollTo(0, 0))
  await page.waitForTimeout(300)
  await page.screenshot({ path: path.join(shots, 'learnai-scroll.png'), fullPage: true })
  await browser.close()
  console.log('LEARNAI_SHOTS_OK')
}

async function pingPong(rawWebm, outMp4) {
  const outDir = path.dirname(rawWebm)
  const fwd = path.join(outDir, 'fwd.mp4')
  const rev = path.join(outDir, 'rev.mp4')
  const list = path.join(outDir, 'list.txt')
  execFileSync(
    ffmpeg,
    [
      '-y',
      '-i',
      rawWebm,
      '-vf',
      'fps=24,scale=960:-2',
      '-c:v',
      'libx264',
      '-preset',
      'veryfast',
      '-crf',
      '22',
      '-pix_fmt',
      'yuv420p',
      '-an',
      fwd,
    ],
    { stdio: 'inherit' },
  )
  execFileSync(ffmpeg, ['-y', '-i', fwd, '-vf', 'reverse', '-an', rev], { stdio: 'inherit' })
  const fwdUnix = fwd.replace(/\\/g, '/')
  const revUnix = rev.replace(/\\/g, '/')
  fs.writeFileSync(list, `file '${fwdUnix}'\nfile '${revUnix}'\n`)
  execFileSync(ffmpeg, ['-y', '-f', 'concat', '-safe', '0', '-i', list, '-c', 'copy', outMp4], {
    stdio: 'inherit',
  })
}

async function recordLoop({ url, outBase, setup, actions }) {
  const outDir = path.join(shots, '_rec')
  fs.rmSync(outDir, { recursive: true, force: true })
  fs.mkdirSync(outDir, { recursive: true })
  const browser = await chromium.launch({ headless: true })
  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 },
    recordVideo: { dir: outDir, size: { width: 1280, height: 800 } },
  })
  const page = await context.newPage()
  await page.goto(url, { waitUntil: 'networkidle', timeout: 90000 })
  await page.waitForTimeout(500)
  if (setup) await setup(page)
  await page.waitForTimeout(300)
  if (actions) await actions(page)
  await page.waitForTimeout(400)
  await context.close()
  await browser.close()
  const vids = fs.readdirSync(outDir).filter((f) => f.endsWith('.webm'))
  if (!vids.length) throw new Error('no video ' + outBase)
  const raw = path.join(outDir, vids[0])
  const mp4 = path.join(shots, outBase + '.mp4')
  await pingPong(raw, mp4)
  fs.rmSync(outDir, { recursive: true, force: true })
  console.log('LOOP', outBase, fs.statSync(mp4).size)
}

async function smoothScroll(page, toY, steps = 18) {
  const start = await page.evaluate(() => window.scrollY)
  for (let i = 1; i <= steps; i++) {
    const y = start + ((toY - start) * i) / steps
    await page.evaluate((yy) => window.scrollTo(0, yy), y)
    await page.waitForTimeout(40)
  }
}

;(async () => {
  await captureBeta()
  await captureLearnAI()

  await recordLoop({
    url: 'http://127.0.0.1:5175/',
    outBase: 'learnai-live',
    actions: async (page) => {
      const chips = page.locator('button').filter({ hasText: /^\d+\s*мин$/i })
      const n = await chips.count()
      for (let i = 0; i < Math.min(n, 4); i++) {
        await chips.nth(i).click({ force: true }).catch(() => {})
        await page.waitForTimeout(350)
      }
      await smoothScroll(page, 700, 20)
      await page.waitForTimeout(400)
      await smoothScroll(page, 0, 18)
    },
  })

  await recordLoop({
    url: 'http://127.0.0.1:5173/login',
    outBase: 'fizmat-live',
    setup: async (page) => {
      await page.evaluate(() => localStorage.clear())
      await page.reload({ waitUntil: 'networkidle' })
      const select = page.locator('select').first()
      if (await select.count()) {
        const options = await select.locator('option').allTextContents()
        const idx = options.findIndex((t) => /Админ|Admin|учител/i.test(t))
        if (idx >= 0) await select.selectOption({ index: idx })
        else if (options.length > 1) await select.selectOption({ index: 1 })
      }
      await page.locator('input[type="password"]').fill('1234')
      await page.locator('button').filter({ hasText: /Войти|Login/i }).first().click()
      await page.waitForTimeout(1600)
    },
    actions: async (page) => {
      const clickNav = async (re) => {
        const a = page.locator('a').filter({ hasText: re }).first()
        if (await a.count()) {
          await a.click()
          await page.waitForTimeout(900)
        }
      }
      await clickNav(/Мероприяти/i)
      await page.mouse.wheel(0, 280)
      await page.waitForTimeout(500)
      await clickNav(/Достижен/i)
      await page.waitForTimeout(700)
      await clickNav(/Главн/i)
      await page.waitForTimeout(700)
    },
  })

  await recordLoop({
    url: 'http://127.0.0.1:8000/',
    outBase: 'trudo-live',
    setup: async (page) => {
      const fio = page.locator('select').first()
      if (await fio.count()) await fio.selectOption({ index: 1 })
      const pwd = page.locator('input[type="password"]')
      if (await pwd.count()) await pwd.fill('admin')
      const btn = page.locator('button, input[type=submit]').filter({ hasText: /Войти|Login/i }).first()
      if (await btn.count()) await btn.click()
      await page.waitForTimeout(1400)
    },
    actions: async (page) => {
      const go = async (re) => {
        const a = page.locator('a').filter({ hasText: re }).first()
        if (await a.count()) {
          await a.click()
          await page.waitForTimeout(900)
        }
      }
      await go(/Аналитик/i)
      const show = page.locator('button').filter({ hasText: /Показать|Обновить/i }).first()
      if (await show.count()) {
        await show.click()
        await page.waitForTimeout(900)
      }
      await page.mouse.wheel(0, 220)
      await page.waitForTimeout(400)
      await go(/Отчет|Отчёт|Список/i)
      await page.waitForTimeout(800)
      await go(/Ввод|Главн/i)
      await page.waitForTimeout(700)
    },
  })

  console.log('ALL_MEDIA_OK')
})().catch((e) => {
  console.error(e)
  process.exit(1)
})
