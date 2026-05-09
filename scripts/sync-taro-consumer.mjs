import { execFileSync } from "node:child_process";
import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readlinkSync,
  readdirSync,
  rmSync,
  utimesSync,
} from "node:fs";
import { join, resolve } from "node:path";

const workspaceRoot = resolve(import.meta.dirname, "..");
const facadeDir = join(workspaceRoot, "packages/facades/taro");
const packDir = join(workspaceRoot, "dist-pack");
const devPackDir = join(workspaceRoot, ".tmp/taro-consumer-pack");
const args = process.argv.slice(2);
const shouldBuildWeapp = !args.includes("--no-build");
const shouldCleanConsumer = !args.includes("--no-clean");
const shouldUseStablePackPath = args.includes("--stable-pack-path");
const consumerArg = args.find((arg) => !arg.startsWith("--"));
const consumerDir = resolve(consumerArg ?? "../usmoment-taro-consumer");

function run(command, args, options = {}) {
  execFileSync(command, args, {
    cwd: options.cwd ?? workspaceRoot,
    stdio: "inherit",
    env: process.env,
  });
}

function read(command, args, options = {}) {
  return execFileSync(command, args, {
    cwd: options.cwd ?? workspaceRoot,
    encoding: "utf8",
    env: process.env,
  }).trim();
}

function findLatestTarball() {
  if (!existsSync(packDir)) {
    throw new Error(`Missing pack directory: ${packDir}`);
  }

  const tarballs = readdirSync(packDir, { withFileTypes: true })
    .filter((entry) => entry.isFile() && /^usmoment-taro-.+\.tgz$/.test(entry.name))
    .map((entry) => entry.name)
    .sort();

  const tarball = tarballs.at(-1);
  if (!tarball) {
    throw new Error(`No @usmoment/taro tarball found in ${packDir}`);
  }

  return join(packDir, tarball);
}

function createDevTarball(tarballPath) {
  mkdirSync(devPackDir, { recursive: true });

  const timestamp = new Date()
    .toISOString()
    .replaceAll("-", "")
    .replaceAll(":", "")
    .replace(".", "-")
    .replace("Z", "");
  const nonce = Math.random().toString(36).slice(2, 8);
  const devTarballPath = join(
    devPackDir,
    `usmoment-taro-dev-${timestamp}-${nonce}.tgz`,
  );

  copyFileSync(tarballPath, devTarballPath);

  return devTarballPath;
}

function verifyInstalledDist() {
  const installedDir = join(consumerDir, "node_modules/@usmoment/taro");
  const files = ["index.js", "kit.js", "ui.js", "headless.js", "style.css"];
  const mismatches = files.filter((file) => {
    const sourceFile = join(facadeDir, "dist", file);
    const installedFile = join(installedDir, "dist", file);
    if (!existsSync(sourceFile) || !existsSync(installedFile)) return true;

    return (
      read("shasum", ["-a", "256", sourceFile]).split(" ")[0] !==
      read("shasum", ["-a", "256", installedFile]).split(" ")[0]
    );
  });

  if (mismatches.length) {
    throw new Error(
      `Installed @usmoment/taro dist does not match facade dist: ${mismatches.join(
        ", ",
      )}`,
    );
  }

  let linkedTarget = "<not a symlink>";
  try {
    linkedTarget = readlinkSync(installedDir);
  } catch {
    // pnpm usually symlinks node_modules entries, but some package managers may not.
  }

  console.log(`Verified installed @usmoment/taro dist hashes.`);
  console.log(`Consumer node_modules/@usmoment/taro -> ${linkedTarget}`);
}

if (!existsSync(consumerDir)) {
  throw new Error(`Missing Taro consumer directory: ${consumerDir}`);
}

run("pnpm", ["--dir", facadeDir, "build"]);
run("pnpm", ["--dir", facadeDir, "pack", "--pack-destination", packDir]);

const tarballPath = findLatestTarball();
const installedFrom = shouldUseStablePackPath
  ? tarballPath
  : createDevTarball(tarballPath);

run("pnpm", ["add", installedFrom, "--force"], { cwd: consumerDir });
verifyInstalledDist();

const appEntry = join(consumerDir, "src/app.ts");
if (existsSync(appEntry)) {
  const now = new Date();
  utimesSync(appEntry, now, now);
}

if (shouldBuildWeapp) {
  if (shouldCleanConsumer) {
    rmSync(join(consumerDir, "dist"), { force: true, recursive: true });
    rmSync(join(consumerDir, "node_modules/.cache"), {
      force: true,
      recursive: true,
    });
  }

  run("pnpm", ["build:weapp"], { cwd: consumerDir });
}

console.log(`Synced @usmoment/taro to ${consumerDir}`);
console.log(`Installed ${installedFrom}`);
