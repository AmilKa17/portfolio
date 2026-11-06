const sharp = require("sharp");
(async () => {
  for (const [input, output] of [
    ["public/avatar-gen.jpg", "public/avatar-cutout2.png"],
    ["public/avatar-cutout.png", "public/avatar-cutout.png"],
  ]) {
    const img = sharp(input);
    const { data, info } = await img.ensureAlpha().raw().toBuffer({ resolveWithObject: true });
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i], g = data[i + 1], b = data[i + 2];
      const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b;
      // remove near-black and near-white studio backdrops
      if (luma < 32 || (r > 235 && g > 235 && b > 245)) {
        data[i + 3] = 0;
      } else if (luma < 48) {
        data[i + 3] = Math.round(((luma - 20) / 28) * 255);
      }
    }
    await sharp(data, { raw: { width: info.width, height: info.height, channels: 4 } }).png().toFile(output);
    console.log("ok", output, info.width, info.height);
  }
})().catch((e)=>{console.error(e);process.exit(1)});
