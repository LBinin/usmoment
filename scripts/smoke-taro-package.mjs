import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";

const workspaceRoot = resolve(import.meta.dirname, "..");
const packageDir = join(workspaceRoot, "packages/facades/taro");
const packedDir = mkdtempSync(join(tmpdir(), "usmoment-pack-"));
const consumerDir = mkdtempSync(join(tmpdir(), "usmoment-consumer-"));
const internalPackagePattern =
  /@usmoment\/(headless|kit-core|kit-taro|kit-web|ui-taro|ui-web)/;

function run(command, args, options = {}) {
  execFileSync(command, args, {
    cwd: options.cwd ?? workspaceRoot,
    stdio: "inherit",
    env: process.env,
  });
}

function readCommand(command, args, options = {}) {
  return execFileSync(command, args, {
    cwd: options.cwd ?? workspaceRoot,
    encoding: "utf8",
    env: process.env,
  });
}

function readAllFiles(dir) {
  const entries = readdirSync(dir, { withFileTypes: true });
  return entries.flatMap((entry) => {
    const path = join(dir, entry.name);
    return entry.isDirectory() ? readAllFiles(path) : [path];
  });
}

const distDir = join(packageDir, "dist");
if (!existsSync(distDir)) {
  throw new Error("Missing packages/facades/taro/dist. Run pnpm --filter @usmoment/taro build first.");
}

for (const file of readAllFiles(distDir)) {
  if (!/\.(js|d\.ts)$/.test(file)) continue;
  const contents = readFileSync(file, "utf8");
  if (internalPackagePattern.test(contents)) {
    throw new Error(`Published dist leaks an internal package reference: ${file}`);
  }
}

run("pnpm", ["--dir", packageDir, "pack", "--pack-destination", packedDir]);

const tarball = readdirSync(packedDir).find((name) => name.endsWith(".tgz"));
if (!tarball) {
  throw new Error(`No tarball was created in ${packedDir}`);
}

const tarballPath = join(packedDir, tarball);
const packedPackageJson = readCommand("tar", ["-xOf", tarballPath, "package/package.json"]);

if (internalPackagePattern.test(packedPackageJson) || packedPackageJson.includes("workspace:")) {
  throw new Error("Packed package.json leaks an internal workspace dependency.");
}

writeFileSync(
  join(consumerDir, "package.json"),
  JSON.stringify(
    {
      private: true,
      type: "module",
      scripts: {
        build: "vite build",
      },
      dependencies: {
        "@usmoment/taro": tarballPath,
        "@tarojs/components": "^4.2.0",
        "@tarojs/taro": "^4.2.0",
        react: "^19.1.0",
      },
      devDependencies: {
        vite: "^7.1.10",
        typescript: "^5.8.3",
      },
    },
    null,
    2,
  ),
);

writeFileSync(join(consumerDir, "index.html"), '<script type="module" src="/src/main.ts"></script>\n');
mkdirSync(join(consumerDir, "src"), { recursive: true });
writeFileSync(
  join(consumerDir, "src/main.ts"),
  [
    'import { AccountingCalculator, BusinessKeyboard, createExpressionEngine } from "@usmoment/taro";',
    'import { AccountingCalculator as KitCalculator } from "@usmoment/taro/kit";',
    'import { BusinessKeyboard as UiKeyboard } from "@usmoment/taro/ui";',
    'import { createSelectionState } from "@usmoment/taro/headless";',
    "",
    "if (typeof AccountingCalculator !== 'function') throw new Error('Missing AccountingCalculator');",
    "if (typeof BusinessKeyboard !== 'function') throw new Error('Missing BusinessKeyboard');",
    "if (typeof createExpressionEngine !== 'function') throw new Error('Missing createExpressionEngine');",
    "if (typeof KitCalculator !== 'function') throw new Error('Missing kit subpath');",
    "if (typeof UiKeyboard !== 'function') throw new Error('Missing ui subpath');",
    "if (typeof createSelectionState !== 'function') throw new Error('Missing headless subpath');",
  ].join("\n"),
);

run("pnpm", ["install", "--ignore-scripts"], { cwd: consumerDir });
run("pnpm", ["build"], { cwd: consumerDir });

console.log(`Smoke test passed with ${tarballPath}`);
console.log(`Temp consumer is available at ${consumerDir}`);
