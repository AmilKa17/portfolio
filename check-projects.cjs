const { chromium } = require("playwright");
const path = require("path");

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto("http://127.0.0.1:5174/", { waitUntil: "networkidle", timeout: 60000 });
  await page.waitForTimeout(800);

  await page.evaluate(() => {
    document.getElementById("projects")?.scrollIntoView({ behavior: "instant", block: "start" });
  });
  await page.waitForTimeout(900);

  // scroll to card 03 area
  await page.evaluate(() => window.scrollBy(0, 1600));
  await page.waitForTimeout(700);

  const shots = path.join(__dirname, "public", "shots");
  await page.screenshot({ path: path.join(shots, "_check-projects.png"), fullPage: false });

  const info = await page.evaluate(() => {
    const articles = [...document.querySelectorAll("#projects article")];
    return articles.map((a, i) => {
      const rect = a.getBoundingClientRect();
      const imgs = [...a.querySelectorAll("img")].map((img) => img.getAttribute("src"));
      const videos = [...a.querySelectorAll("video")].map((v) => ({
        src: v.getAttribute("src"),
        ready: v.readyState,
        paused: v.paused,
        w: v.videoWidth,
        h: v.videoHeight,
      }));
      const styles = getComputedStyle(a);
      return {
        i,
        width: Math.round(rect.width),
        left: Math.round(rect.left),
        maxWidth: styles.maxWidth,
        imgs,
        videos,
      };
    });
  });

  // force play videos in view
  await page.evaluate(() => {
    document.querySelectorAll("video").forEach((v) => {
      v.muted = true;
      void v.play().catch(() => {});
    });
  });
  await page.waitForTimeout(500);

  const after = await page.evaluate(() =>
    [...document.querySelectorAll("#projects video")].map((v) => ({
      src: v.currentSrc || v.getAttribute("src"),
      paused: v.paused,
      ready: v.readyState,
      w: v.videoWidth,
      h: v.videoHeight,
    })),
  );

  console.log(JSON.stringify({ viewport: 1440, cards: info, videos: after }, null, 2));
  await browser.close();
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
