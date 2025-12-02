const fs = require("fs");
const path = require("path");
const Jimp = require("jimp");  // ← これで確実に動く

const CARD_DIR = path.join(process.cwd(), "cards");

async function detectElixirCost(img) {
  const size = 30;
  let darkCount = 0;

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const pixel = Jimp.intToRGBA(img.getPixelColor(x, y));
      const brightness = (pixel.r + pixel.g + pixel.b) / 3;
      if (brightness < 80) darkCount++;
    }
  }

  if (darkCount < 80) return 1;
  if (darkCount < 130) return 2;
  if (darkCount < 180) return 3;
  if (darkCount < 230) return 4;
  if (darkCount < 300) return 5;
  if (darkCount < 360) return 6;
  if (darkCount < 420) return 7;
  if (darkCount < 480) return 8;
  return 9;
}

async function main() {
  const files = fs.readdirSync(CARD_DIR);
  const result = {};

  for (const file of files) {
    if (!file.endsWith(".png")) continue;

    const id = file.replace(".png", "");
    const img = await Jimp.read(path.join(CARD_DIR, file));

    const elixir = await detectElixirCost(img);
    result[id] = elixir;

    console.log(`${id}: ${elixir}`);
  }

  fs.writeFileSync("elixirCost.json", JSON.stringify(result, null, 2));
  console.log("\nSaved → elixirCost.json");
}

main();
