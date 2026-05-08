import { readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";

const distDir = resolve(import.meta.dirname, "../packages/facades/taro/dist");

function filesIn(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    return entry.isDirectory() ? filesIn(path) : [path];
  });
}

for (const file of filesIn(distDir)) {
  if (file.endsWith(".map")) {
    rmSync(file);
    continue;
  }

  if (!/\.(js|d\.ts)$/.test(file)) continue;

  const contents = readFileSync(file, "utf8");
  const cleaned = contents.replace(/\n?\/\/# sourceMappingURL=.*$/gm, "");

  if (cleaned !== contents) {
    writeFileSync(file, cleaned);
  }
}
