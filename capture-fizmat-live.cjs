const { chromium } = require("playwright");
const path = require("path");
const fs = require("fs");

const outDir = path.join(__dirname, "public", "shots");
const tmpDir = path.join(outDir, "_tmp-fizmat-live");
fs.mkdirSync(tmpDir, { recursive: true });

(async () => {
  const browser = await chromium.launch({ headless: true });

  // Login first WITHOUT recording, then open a recorded context on the app
  const boot = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const bootPage = await boot.newPage();
  await bootPage.goto("http://127.0.0.1:5173/login", { waitUntil: "networkidle", timeout: 60000 });
  await bootPage.evaluate(() => localStorage.clear());
  await bootPage.reload({ waitUntil: "networkidle" });
  await bootPage.waitForTimeout(300);
  const select = bootPage.locator("select").first();
  if (await select.count()) {
    const options = await select.locator("option").allTextContents();
    const idx = options.findIndex((t) => /Иванов/i.test(t));
    if (idx >= 0) await select.selectOption({ index: idx });
  }
  const pass = bootPage.locator('input[type="password"]').first();
  if (await pass.count()) await pass.fill("1234");
  await bootPage.locator("button").filter({ hasText: /войти/i }).first().click();
  await bootPage.waitForTimeout(1800);
  const storage = await boot.storageState();
  await boot.close();

  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 },
    storageState: storage,
    recordVideo: { dir: tmpDir, size: { width: 960, height: 540 } },
  });
  const page = await context.newPage();
  await page.goto("http://127.0.0.1:5173/", { waitUntil: "networkidle", timeout: 60000 });
  await page.waitForTimeout(800);

  for (let i = 0; i < 5; i++) {
    await page.mouse.wheel(0, 300);
    await page.waitForTimeout(280);
  }
  for (let i = 0; i < 3; i++) {
    await page.mouse.wheel(0, -260);
    await page.waitForTimeout(240);
  }

  const ach = page.locator("a").filter({ hasText: /достижен/i }).first();
  if (await ach.count()) {
    await ach.click();
    await page.waitForTimeout(1000);
    for (let i = 0; i < 3; i++) {
      await page.mouse.wheel(0, 240);
      await page.waitForTimeout(260);
    }
  }

  const events = page.locator("a").filter({ hasText: /мероприят/i }).first();
  if (await events.count()) {
    await events.click();
    await page.waitForTimeout(1000);
    for (let i = 0; i < 4; i++) {
      await page.mouse.wheel(0, 260);
      await page.waitForTimeout(260);
    }
  }

  const subjects = page.locator("a").filter({ hasText: /предмет/i }).first();
  if (await subjects.count()) {
    await subjects.click();
    await page.waitForTimeout(1100);
  }

  await context.close();
  await browser.close();

  const files = fs.readdirSync(tmpDir).filter((f) => f.endsWith(".webm"));
  if (!files.length) throw new Error("No webm recorded");
  const newest = files
    .map((f) => ({ f, t: fs.statSync(path.join(tmpDir, f)).mtimeMs }))
    .sort((a, b) => b.t - a.t)[0].f;
  const dest = path.join(outDir, "fizmat-live.webm");
  fs.copyFileSync(path.join(tmpDir, newest), dest);
  for (const f of files) fs.unlinkSync(path.join(tmpDir, f));
  fs.rmdirSync(tmpDir);
  console.log("OK", dest, fs.statSync(dest).size);
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
