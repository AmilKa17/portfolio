const { chromium } = require("playwright");
const path = require("path");
const fs = require("fs");

const outDir = path.join(__dirname, "public", "shots");
const tmpDir = path.join(outDir, "_tmp-trudo-live");
fs.mkdirSync(tmpDir, { recursive: true });

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 820 },
    recordVideo: { dir: tmpDir, size: { width: 960, height: 720 } },
  });
  const page = await context.newPage();

  await page.goto("http://127.0.0.1:8000/login/", { waitUntil: "domcontentloaded", timeout: 60000 });
  await page.waitForTimeout(600);
  const fio = page.locator("select").first();
  if (await fio.count()) await fio.selectOption({ index: 1 });
  const pass = page.locator('input[type="password"]').first();
  if (await pass.count()) await pass.fill("admin");
  await page.locator("button, input[type=submit]").filter({ hasText: /войти/i }).first().click();
  await page.waitForTimeout(1600);

  // Entry view: slow scroll
  for (let i = 0; i < 4; i++) {
    await page.mouse.wheel(0, 260);
    await page.waitForTimeout(320);
  }
  for (let i = 0; i < 3; i++) {
    await page.mouse.wheel(0, -220);
    await page.waitForTimeout(280);
  }

  // Analytics
  const analytics = page.locator("a").filter({ hasText: /аналитик/i }).first();
  if (await analytics.count()) {
    await analytics.click();
    await page.waitForTimeout(900);
    const show = page.locator("button, input[type=submit]").filter({ hasText: /показать/i }).first();
    if (await show.count()) {
      await show.click();
      await page.waitForTimeout(1200);
    }
    for (let i = 0; i < 5; i++) {
      await page.mouse.wheel(0, 300);
      await page.waitForTimeout(300);
    }
    for (let i = 0; i < 3; i++) {
      await page.mouse.wheel(0, -250);
      await page.waitForTimeout(260);
    }
  }

  // Admin
  const admin = page.locator("a").filter({ hasText: /администр/i }).first();
  if (await admin.count()) {
    await admin.click();
    await page.waitForTimeout(1100);
    for (let i = 0; i < 4; i++) {
      await page.mouse.wheel(0, 280);
      await page.waitForTimeout(300);
    }
  }

  // Back to entry
  const entry = page.locator("a").filter({ hasText: /ввод данных/i }).first();
  if (await entry.count()) {
    await entry.click();
    await page.waitForTimeout(1200);
  }

  await context.close();
  await browser.close();

  const files = fs.readdirSync(tmpDir).filter((f) => f.endsWith(".webm"));
  if (!files.length) throw new Error("No webm recorded");
  const newest = files
    .map((f) => ({ f, t: fs.statSync(path.join(tmpDir, f)).mtimeMs }))
    .sort((a, b) => b.t - a.t)[0].f;
  const dest = path.join(outDir, "trudo-live.webm");
  fs.copyFileSync(path.join(tmpDir, newest), dest);
  for (const f of files) fs.unlinkSync(path.join(tmpDir, f));
  fs.rmdirSync(tmpDir);
  console.log("OK", dest, fs.statSync(dest).size);
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
