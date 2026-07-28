import { mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const source = join(root, "demo/pwa-icon.svg");
const outDir = join(root, "demo/public/icons");

mkdirSync(outDir, { recursive: true });

const sizes = [
  { name: "icon-192.png", size: 192 },
  { name: "icon-512.png", size: 512 },
  { name: "apple-touch-icon.png", size: 180 },
];

for (const { name, size } of sizes) {
  await sharp(source).resize(size, size).png().toFile(join(outDir, name));
}

await sharp(source).resize(32, 32).png().toFile(join(root, "demo/public/favicon.png"));

console.log("Generated PWA icons in demo/public/");
