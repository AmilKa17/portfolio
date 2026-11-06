const { chromium } = require("playwright");
const path = require("path");
const { spawnSync } = require("child_process");
const fs = require("fs");

const outDir = path.join(__dirname, "public", "shots", "marquee");
const ffmpeg = process.env.FFMPEG;
fs.mkdirSync(outDir, { recursive: true });

const jobs = [
  { id: "beta", url: "https://amilka17.github.io/beta-site/", scroll: true },
  { id: "doris", url: "https://amilka17.github.io/doris-beta/", scroll: true },
  { id: "fizmat", url: "http://127.0.0.1:5173/", scroll: true, login: true },
  { id: "trudo", url: "http://127.0.0.1:8000/", scroll: false, trudoLogin: true },
];

(async () => {
  for (const job of jobs) {
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({
      viewport: { width: 1260, height: 810 },
      recordVideo: { dir: outDir, size: { width: 840, height: 540 } },
    });
    const page = await context.newPage();
    try {
      await page.goto(job.url, { waitUntil: "domcontentloaded", timeout: 60000 });
      await page.waitForTimeout(1200);

      if (job.login) {
        await page.evaluate(() => localStorage.clear());
        await page.goto("http://127.0.0.1:5173/login", { waitUntil: "networkidle" }).catch(() => {});
        await page.waitForTimeout(500);
        const select = page.locator("select").first();
        if (await select.count()) {
          const options = await select.locator("option").allTextContents();
          const idx = options.findIndex((t) => /Иванов/i.test(t));
          if (idx >= 0) await select.selectOption({ index: idx });
        }
        const pass = page.locator('input[type="password"]').first();
        if (await pass.count()) {
          await pass.fill("1234");
          await page.locator("button").filter({ hasText: /войти/i }).first().click();
          await page.waitForTimeout(2000);
        }
      }

      if (job.trudoLogin) {
        const fio = page.locator("select").first();
        if (await fio.count()) await fio.selectOption({ index: 1 });
        const pass = page.locator('input[type="password"]').first();
        if (await pass.count()) {
          await pass.fill("admin");
          await page.locator("button, input[type=submit]").filter({ hasText: /войти/i }).first().click();
          await page.waitForTimeout(1800);
        }
      }

      await page.screenshot({ path: path.join(outDir, `${job.id}.png`), fullPage: false });

      if (job.scroll) {
        for (let i = 0; i < 6; i++) {
          await page.mouse.wheel(0, 350);
          await page.waitForTimeout(350);
        }
        for (let i = 0; i < 4; i++) {
          await page.mouse.wheel(0, -300);
          await page.waitForTimeout(300);
        }
      } else {
        await page.waitForTimeout(2500);
        const a = page.locator("a").filter({ hasText: /аналитик|ввод/i }).first();
        if (await a.count()) {
          await a.click();
          await page.waitForTimeout(1500);
        }
      }
    } catch (e) {
      console.log("ERR", job.id, e.message);
    }
    await context.close();
    await browser.close();

    // rename latest webm in outDir that isn't already named
    const files = fs.readdirSync(outDir).filter((f) => f.endsWith(".webm"));
    const newest = files
      .map((f) => ({ f, t: fs.statSync(path.join(outDir, f)).mtimeMs }))
      .sort((a, b) => b.t - a.t)[0];
    if (newest) {
      const src = path.join(outDir, newest.f);
      const destWebm = path.join(outDir, `${job.id}.webm`);
      const destMp4 = path.join(outDir, `${job.id}.mp4`);
      if (newest.f !== `${job.id}.webm`) {
        try { fs.renameSync(src, destWebm); } catch { fs.copyFileSync(src, destWebm); }
      }
      spawnSync(ffmpeg, ["-y", "-i", destWebm, "-an", "-vf", "scale=840:540:force_original_aspect_ratio=increase,crop=840:540", "-c:v", "libx264", "-pix_fmt", "yuv420p", "-movflags", "+faststart", destMp4], { stdio: "inherit" });
      console.log("DONE", job.id);
    }
  }
  console.log("ALL_OK");
})().catch((e) => { console.error(e); process.exit(1); });
