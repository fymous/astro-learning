import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const local = path.join(root, "src", "brand.local.ts");
const example = path.join(root, "src", "brand.local.example.ts");

if (!fs.existsSync(local)) {
  fs.copyFileSync(example, local);
  console.log("Created src/brand.local.ts from example (ShopEye defaults). Customize for deployment.");
}
