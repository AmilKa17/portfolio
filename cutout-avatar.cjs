const sharp = require("sharp");
const path = require("path");
const input = path.join("public", "avatar-cartoon-dark.jpg");
const output = path.join("public", "avatar-cutout.png");
(async () => {
  const img = sharp(input);
  const { data, info } = await img.ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i], g = data[i + 1], b = data[i + 2];
    // near-black background to transparent
    const dark = r < 28 && g < 28 && b < 28;
    if (dark) {
      data[i + 3] = 0;
    } else if (r < 45 && g < 45 && b < 45) {
      // soft edge
      const t = Math.max(r, g, b);
      data[i + 3] = Math.min(255, Math.round(((t - 18) / 27) * 255));
    }
  }
  await sharp(data, { raw: { width: info.width, height: info.height, channels: 4 } })
    .png()
    .toFile(output);
  console.log("CUTOUT_OK", info.width, info.height);
})().catch((e)=>{console.error(e); process.exit(1)});
