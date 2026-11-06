const { chromium } = require("playwright");
const path = require("path");
const shots = path.join(process.cwd(), "public", "shots");

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  // FizMatHub
  await page.goto("http://127.0.0.1:5173/", { waitUntil: "networkidle", timeout: 60000 });
  await page.waitForTimeout(1500);
  await page.screenshot({ path: path.join(shots, "fizmathub.png"), fullPage: false });

  // try student cabinet if login exists
  const body = await page.content();
  if (/вход|логин|пароль|student|ученик/i.test(body)) {
    const user = page.locator('input[type="text"], input[name="login"], input[name="username"], input[placeholder*="лог" i]').first();
    const pass = page.locator('input[type="password"]').first();
    if (await user.count() && await pass.count()) {
      await user.fill("Иванов");
      await pass.fill("1234");
      const btn = page.locator('button[type="submit"], button:has-text("Войти")').first();
      if (await btn.count()) {
        await btn.click();
        await page.waitForTimeout(2000);
        await page.screenshot({ path: path.join(shots, "fizmathub.png"), fullPage: false });
      }
    }
  }

  // Trudozatraty
  await page.goto("http://127.0.0.1:8000/", { waitUntil: "networkidle", timeout: 60000 });
  await page.waitForTimeout(1000);
  const pass2 = page.locator('input[type="password"]').first();
  const user2 = page.locator('input[name="username"], input[type="text"]').first();
  if (await user2.count() && await pass2.count()) {
    await user2.fill("admin");
    await pass2.fill("admin");
    const btn2 = page.locator('button[type="submit"], input[type="submit"], button:has-text("Войти")').first();
    if (await btn2.count()) await btn2.click();
    await page.waitForTimeout(2000);
  }
  await page.screenshot({ path: path.join(shots, "trudozatraty.png"), fullPage: false });

  // also capture analytics page if linked
  const analytics = page.locator('a:has-text("Аналитика"), a:has-text("Отчет"), a:has-text("Журнал")').first();
  if (await analytics.count()) {
    await analytics.click();
    await page.waitForTimeout(1500);
    await page.screenshot({ path: path.join(shots, "trudozatraty.png"), fullPage: false });
  }

  await browser.close();
  console.log("SHOTS_OK");
})().catch((e) => { console.error(e); process.exit(1); });
