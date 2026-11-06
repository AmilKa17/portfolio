const { chromium } = require("playwright");
(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto("http://127.0.0.1:5174/", { waitUntil: "networkidle", timeout: 60000 });
  await page.waitForTimeout(1500);
  const box = await page.locator('img[alt="AmilKa cartoon avatar"]').boundingBox();
  console.log("BOX", box);
  if (box) {
    await page.mouse.move(box.x + box.width * 0.8, box.y + box.height * 0.3);
    await page.waitForTimeout(400);
  }
  await page.screenshot({ path: "public/shots/_avatar-check.png", fullPage: false });
  await browser.close();
  console.log("OK");
})().catch((e)=>{console.error(e);process.exit(1)});
