const { chromium } = require("playwright");
const path = require("path");
const { spawnSync } = require("child_process");
const fs = require("fs");
const outDir = path.join(__dirname, "public", "shots", "marquee");
const ffmpeg = process.env.FFMPEG;
(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1260, height: 810 },
    recordVideo: { dir: outDir, size: { width: 840, height: 540 } },
  });
  const page = await context.newPage();
  await page.goto("http://127.0.0.1:5180/", { waitUntil: "networkidle", timeout: 60000 });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(outDir, "stickman.png"), fullPage: false });
  // poke around for interaction
  await page.mouse.click(630, 450);
  await page.waitForTimeout(800);
  await page.keyboard.press("ArrowRight");
  await page.waitForTimeout(400);
  await page.keyboard.press("Space");
  await page.waitForTimeout(2500);
  await page.mouse.move(200, 300);
  await page.mouse.move(900, 400);
  await page.waitForTimeout(1500);
  await context.close();
  await browser.close();
  const files = fs.readdirSync(outDir).filter((f) => f.endsWith(".webm"));
  const newest = files.map((f) => ({ f, t: fs.statSync(path.join(outDir, f)).mtimeMs })).sort((a,b)=>b.t-a.t)[0];
  if (newest) {
    const src = path.join(outDir, newest.f);
    const dest = path.join(outDir, "stickman.webm");
    if (newest.f !== "stickman.webm") { try { fs.renameSync(src, dest); } catch { fs.copyFileSync(src, dest); } }
    spawnSync(ffmpeg, ["-y","-i",dest,"-an","-vf","scale=840:540:force_original_aspect_ratio=increase,crop=840:540","-c:v","libx264","-pix_fmt","yuv420p","-movflags","+faststart", path.join(outDir,"stickman.mp4")], { stdio: "inherit" });
  }
  console.log("STICKMAN_OK");
})().catch((e)=>{console.error(e);process.exit(1)});
