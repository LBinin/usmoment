import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join, relative, resolve } from "node:path";
import { spawnSync } from "node:child_process";

const workspaceRoot = resolve(import.meta.dirname, "..");
const registry = process.env.NPM_CONFIG_REGISTRY || "https://registry.npmjs.org";
const requestedTag = process.env.RELEASE_NPM_TAG || process.env.NPM_TAG || "auto";
const isDryRun = process.argv.includes("--dry-run") || process.env.RELEASE_DRY_RUN === "1";

function readJson(path) {
  return JSON.parse(readFileSync(path, "utf8"));
}

function run(command, args, options = {}) {
  const result = spawnSync(command, args, {
    cwd: workspaceRoot,
    stdio: "inherit",
    shell: false,
    ...options,
  });

  if (result.status !== 0) {
    throw new Error(`Command failed: ${command} ${args.join(" ")}`);
  }
}

function readCommand(command, args) {
  return spawnSync(command, args, {
    cwd: workspaceRoot,
    encoding: "utf8",
    shell: false,
  });
}

function resolvePublishTag() {
  const preStatePath = join(workspaceRoot, ".changeset", "pre.json");
  const preState = existsSync(preStatePath) ? readJson(preStatePath) : null;
  const isPreMode = preState?.mode === "pre" && typeof preState.tag === "string" && preState.tag.length > 0;

  if (requestedTag !== "auto") {
    return {
      tag: requestedTag,
      passTagToChangesets: !isPreMode,
      isPreMode,
    };
  }

  if (isPreMode) {
    return {
      tag: preState.tag,
      passTagToChangesets: false,
      isPreMode,
    };
  }

  return {
    tag: "latest",
    passTagToChangesets: true,
    isPreMode,
  };
}

function collectPackageJsonFiles(dir) {
  if (!existsSync(dir)) {
    return [];
  }

  const entries = readdirSync(dir, { withFileTypes: true });
  const packageJsonFiles = [];

  for (const entry of entries) {
    if (entry.name === "node_modules" || entry.name === "dist" || entry.name.startsWith(".")) {
      continue;
    }

    const fullPath = join(dir, entry.name);
    if (entry.isFile() && entry.name === "package.json") {
      packageJsonFiles.push(fullPath);
      continue;
    }

    if (entry.isDirectory()) {
      packageJsonFiles.push(...collectPackageJsonFiles(fullPath));
    }
  }

  return packageJsonFiles;
}

function collectPublishablePackages() {
  const roots = ["packages", "apps", "docs/site-react"];
  return roots
    .flatMap((root) => collectPackageJsonFiles(join(workspaceRoot, root)))
    .map((packageJsonPath) => ({
      packageJsonPath,
      manifest: readJson(packageJsonPath),
    }))
    .filter(({ manifest }) => manifest.private !== true)
    .map(({ packageJsonPath, manifest }) => ({
      name: manifest.name,
      version: manifest.version,
      packageJsonPath,
    }))
    .filter((pkg) => pkg.name && pkg.version)
    .sort((a, b) => a.name.localeCompare(b.name));
}

function isVersionPublished(pkg) {
  const result = readCommand("npm", [
    "view",
    `${pkg.name}@${pkg.version}`,
    "version",
    "--json",
    `--registry=${registry}`,
  ]);

  if (result.status === 0) {
    const version = result.stdout.trim().replace(/^"|"$/g, "");
    return version === pkg.version;
  }

  const output = `${result.stdout}\n${result.stderr}`;
  if (output.includes("E404") || output.includes("404 Not Found")) {
    return false;
  }

  throw new Error(`Unable to check npm version for ${pkg.name}@${pkg.version}:\n${output.trim()}`);
}

function assertTagMatchesVersions(tag, packages) {
  const prereleasePackages = packages.filter((pkg) => pkg.version.includes("-"));
  if (tag === "latest" && prereleasePackages.length > 0) {
    const packageList = prereleasePackages.map((pkg) => `${pkg.name}@${pkg.version}`).join(", ");
    throw new Error(`Refusing to publish prerelease versions with npm tag "latest": ${packageList}`);
  }
}

const publishTag = resolvePublishTag();
const publishablePackages = collectPublishablePackages();

if (publishablePackages.length === 0) {
  console.log("No publishable packages found. Skipping npm publish.");
  process.exit(0);
}

assertTagMatchesVersions(publishTag.tag, publishablePackages);

console.log(`Resolved npm dist-tag: ${publishTag.tag}`);
if (publishTag.isPreMode && !publishTag.passTagToChangesets) {
  console.log("Changesets prerelease mode is active. The publish command will use the prerelease tag from .changeset/pre.json.");
}
console.log("Checking published package versions:");

const unpublishedPackages = [];
for (const pkg of publishablePackages) {
  const relativePath = relative(workspaceRoot, pkg.packageJsonPath);
  const published = isVersionPublished(pkg);
  const status = published ? "already published" : "unpublished";
  console.log(`- ${pkg.name}@${pkg.version} (${relativePath}): ${status}`);

  if (!published) {
    unpublishedPackages.push(pkg);
  }
}

if (unpublishedPackages.length === 0) {
  console.log("All publishable package versions already exist on npm. Skipping npm publish.");
  process.exit(0);
}

if (isDryRun) {
  const publishCommand = publishTag.passTagToChangesets
    ? `pnpm changeset publish --tag ${publishTag.tag}`
    : "pnpm changeset publish";
  console.log(`Dry run: would run release checks and publish with npm dist-tag "${publishTag.tag}".`);
  console.log(`Dry run: publish command would be "${publishCommand}".`);
  process.exit(0);
}

run("pnpm", ["release:check"]);
const publishArgs = publishTag.passTagToChangesets
  ? ["changeset", "publish", "--tag", publishTag.tag]
  : ["changeset", "publish"];
run("pnpm", publishArgs);
