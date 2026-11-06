const { chromium } = require('playwright')
const { execFileSync } = require('child_process')
const path = require('path')
const fs = require('fs')

const shots = path.join(__dirname, 'public', 'shots')
const ffmpeg =
  process.env.FFMPEG ||
  'C:\\Users\\MECHREVO\\AppData\\Local\\Microsoft\\WinGet\\Packages\\Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe\\ffmpeg-9.0.2-full_build\\bin\\ffmpeg.exe'

function pingPong(rawWebm, outMp4) {
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
  fs.writeFileSync(
    list,
    `file '${fwd.replace(/\\/g, '/')}'\nfile '${rev.replace(/\\/g, '/')}'\n`,
  )
  execFileSync(ffmpeg, ['-y', '-f', 'concat', '-safe', '0', '-i', list, '-c', 'copy', outMp4], {
    stdio: 'inherit',
  })
}

async function recordAfterSetup({ url, outBase, setup, actions }) {
  // Login WITHOUT recording, then start a fresh recorded context on the app UI
  const browser = await chromium.launch({ headless: true })
  const warm = await browser.newContext({ viewport: { width: 1280, height: 800 } })
  const warmPage = await warm.newPage()
  await warmPage.goto(url, { waitUntil: 'networkidle', timeout: 90000 })
  const { storageState, startUrl } = await setup(warmPage)
  await warm.close()

  const outDir = path.join(shots, '_rec')
  fs.rmSync(outDir, { recursive: true, force: true })
  fs.mkdirSync(outDir, { recursive: true })

  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 },
    storageState,
    recordVideo: { dir: outDir, size: { width: 1280, height: 800 } },
  })
  const page = await context.newPage()
  await page.goto(startUrl, { waitUntil: 'networkidle', timeout: 90000 })
  await page.waitForTimeout(600)
  if (actions) await actions(page)
  await page.waitForTimeout(500)
  await context.close()
  await browser.close()

  const vids = fs.readdirSync(outDir).filter((f) => f.endsWith('.webm'))
  if (!vids.length) throw new Error('no video ' + outBase)
  const raw = path.join(outDir, vids[0])
  const mp4 = path.join(shots, outBase + '.mp4')
  pingPong(raw, mp4)
  fs.rmSync(outDir, { recursive: true, force: true })
  console.log('LOOP', outBase, fs.statSync(mp4).size)
}

;(async () => {
  await recordAfterSetup({
    url: 'http://127.0.0.1:5173/login',
    outBase: 'fizmat-live',
    setup: async (page) => {
      await page.evaluate(() => localStorage.clear())
      await page.reload({ waitUntil: 'networkidle' })
      const select = page.locator('select').first()
      const options = await select.locator('option').allTextContents()
      const idx = options.findIndex((t) => /учител/i.test(t))
      await select.selectOption({ index: idx >= 0 ? idx : 0 })
      await page.locator('input[type="password"]').fill('1234')
      await page.locator('button').filter({ hasText: /Войти/i }).first().click()
      await page.waitForURL(/\/admin|\/student|\/app/i, { timeout: 15000 }).catch(() => {})
      await page.waitForTimeout(1200)
      const storageState = await page.context().storageState()
      return { storageState, startUrl: page.url() }
    },
    actions: async (page) => {
      const clickNav = async (re) => {
        const a = page.locator('a,button').filter({ hasText: re }).first()
        if (await a.count()) {
          await a.click()
          await page.waitForTimeout(900)
        }
      }
      await clickNav(/Событи/i)
      await page.mouse.wheel(0, 260)
      await page.waitForTimeout(500)
      await clickNav(/Проверк/i)
      await page.waitForTimeout(800)
      await clickNav(/Ученик/i)
      await page.waitForTimeout(800)
      await clickNav(/Сводк/i)
      await page.waitForTimeout(700)
    },
  })

  await recordAfterSetup({
    url: 'http://127.0.0.1:8000/',
    outBase: 'trudo-live',
    setup: async (page) => {
      const fio = page.locator('select').first()
      if (await fio.count()) await fio.selectOption({ index: 1 })
      const pwd = page.locator('input[type="password"]')
      if (await pwd.count()) await pwd.fill('admin')
      const btn = page.locator('button, input[type=submit]').filter({ hasText: /Войти/i }).first()
      if (await btn.count()) await btn.click()
      await page.waitForTimeout(1500)
      const storageState = await page.context().storageState()
      return { storageState, startUrl: page.url() }
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
      const show = page.locator('button').filter({ hasText: /Показать/i }).first()
      if (await show.count()) {
        await show.click()
        await page.waitForTimeout(900)
      }
      await page.mouse.wheel(0, 220)
      await page.waitForTimeout(400)
      await go(/Администрир/i)
      await page.waitForTimeout(900)
      await go(/Ввод данных/i)
      await page.waitForTimeout(800)
    },
  })

  console.log('APP_LOOPS_OK')
})().catch((e) => {
  console.error(e)
  process.exit(1)
})
