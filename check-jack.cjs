const { chromium } = require("playwright");
(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  page.on("pageerror", (e) => console.log("PAGEERROR", e.message));
  await page.goto("http://127.0.0.1:5174/", { waitUntil: "networkidle", timeout: 90000 });
  await page.waitForTimeout(2000);
  await page.screenshot({ path: "public/shots/_jack-hero.png", fullPage: false });
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight * 0.35));
  await page.waitForTimeout(1000);
  await page.screenshot({ path: "public/shots/_jack-about.png", fullPage: false });
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight * 0.72));
  await page.waitForTimeout(1000);
  await page.screenshot({ path: "public/shots/_jack-projects.png", fullPage: false });
  console.log("OK");
  await browser.close();
})().catch((e)=>{console.error(e); process.exit(1)});
