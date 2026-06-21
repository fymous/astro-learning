import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";

const root = path.resolve(import.meta.dirname, "..");
// Forbidden term encoded — do not spell the deployment brand in tracked source.
const pattern = new RegExp(String.fromCharCode(115, 108, 105, 110, 97, 105), "i");

/** Paths excluded from scan (local overrides + this checker). */
const EXCLUDED = new Set([
  path.normalize("src/brand.local.ts"),
  path.normalize("scripts/check-deploy-brand.mjs"),
  path.normalize(".cursor/rules/no-deploy-brand-in-git.mdc"),
]);

function listTrackedFiles() {
  try {
    const out = execSync("git ls-files", { cwd: root, encoding: "utf8" });
    return out
      .split("\n")
      .map((f) => f.trim())
      .filter(Boolean)
      .filter((f) => !EXCLUDED.has(path.normalize(f)));
  } catch {
    return walkDir(root).filter((f) => !f.includes("node_modules") && !f.includes(".git"));
  }
}

function walkDir(dir, acc = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === "node_modules" || entry.name === ".git" || entry.name === "dist") continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walkDir(full, acc);
    else acc.push(full);
  }
  return acc;
}

const files = listTrackedFiles();
const hits = [];

for (const file of files) {
  const rel = path.relative(root, file).replace(/\\/g, "/");
  if (EXCLUDED.has(path.normalize(rel))) continue;
  try {
    const text = fs.readFileSync(file, "utf8");
    if (pattern.test(text)) hits.push(rel);
  } catch {
    /* unreadable binary, etc. */
  }
}

if (hits.length > 0) {
  console.error("BLOCKED: deployment brand name found in tracked files (must not be committed):\n");
  hits.forEach((f) => console.error(`  - ${f}`));
  console.error("\nMove deployment branding to gitignored src/brand.local.ts only.");
  process.exit(1);
}

console.log("OK: deployment brand name not in tracked files.");
