import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const root = process.cwd();
const headlessComponentsDir = join(
  root,
  "packages",
  "headless",
  "src",
  "components",
);
const docsSiteStylesDir = join(root, "docs", "site-react", "src", "styles");
const docsSiteStylesEntry = join(root, "docs", "site-react", "src", "styles.css");

const forbiddenHeadlessImports = [
  {
    pattern: /from\s+["']react["']|from\s+["']react\//,
    message: "Headless must not import React.",
  },
  {
    pattern: /from\s+["']@tarojs\//,
    message: "Headless must not import Taro APIs.",
  },
  {
    pattern: /from\s+["']@usmoment\/ui-|from\s+["']@usmoment\/taro\/ui["']/,
    message: "Headless must not import UI packages.",
  },
  {
    pattern: /from\s+["']@usmoment\/kit-|from\s+["']@usmoment\/taro\/kit["']/,
    message: "Headless must not import Kit packages.",
  },
];

const forbiddenExpressionApis = [
  {
    pattern: /\beval\s*\(/,
    message: "Headless must not use eval().",
  },
  {
    pattern: /\bFunction\s*\(/,
    message: "Headless must not use Function() for expression evaluation.",
  },
  {
    pattern: /new\s+Function\s*\(/,
    message: "Headless must not use new Function() for expression evaluation.",
  },
];

const failures = [];

for (const componentName of readdirSync(headlessComponentsDir)) {
  const componentDir = join(headlessComponentsDir, componentName);

  if (!statSync(componentDir).isDirectory()) continue;

  checkComponentShape(componentName, componentDir);

  for (const filePath of listFiles(componentDir)) {
    if (!filePath.endsWith(".ts") && !filePath.endsWith(".tsx")) continue;

    const source = readFileSync(filePath, "utf8");

    checkForbiddenImports(filePath, source);
    checkForbiddenExpressionApis(filePath, source);
  }
}

checkDocsSiteStyles();

if (failures.length > 0) {
  console.error("Architecture check failed:");
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

function checkDocsSiteStyles() {
  const cssFiles = [];

  if (existsSync(docsSiteStylesEntry)) {
    cssFiles.push(docsSiteStylesEntry);
  }

  if (existsSync(docsSiteStylesDir)) {
    cssFiles.push(
      ...listFiles(docsSiteStylesDir).filter((filePath) =>
        filePath.endsWith(".css"),
      ),
    );
  }

  for (const filePath of cssFiles) {
    const source = readFileSync(filePath, "utf8");

    if (/\.usm-/.test(source)) {
      failures.push(
        `${formatPath(filePath)}: Docs CSS must not define package runtime classes such as .usm-*. Move component styles to UI or Kit packages.`,
      );
    }

    if (/data:image/.test(source)) {
      failures.push(
        `${formatPath(filePath)}: Docs CSS must not contain runtime image assets. Move component assets to UI or Kit packages.`,
      );
    }
  }
}

console.log("Architecture check passed.");

function checkComponentShape(componentName, componentDir) {
  const indexFile = join(componentDir, "index.ts");
  const testDir = join(componentDir, "__test__");

  if (!existsSync(indexFile)) {
    failures.push(`${componentName}: missing index.ts`);
  }

  if (!existsSync(testDir) || !statSync(testDir).isDirectory()) {
    failures.push(`${componentName}: missing __test__ directory`);
    return;
  }

  const hasTestFile = readdirSync(testDir).some((fileName) =>
    fileName.endsWith(".test.ts"),
  );

  if (!hasTestFile) {
    failures.push(`${componentName}: __test__ must include a .test.ts file`);
  }
}

function checkForbiddenImports(filePath, source) {
  for (const rule of forbiddenHeadlessImports) {
    if (rule.pattern.test(source)) {
      failures.push(`${formatPath(filePath)}: ${rule.message}`);
    }
  }
}

function checkForbiddenExpressionApis(filePath, source) {
  for (const rule of forbiddenExpressionApis) {
    if (rule.pattern.test(source)) {
      failures.push(`${formatPath(filePath)}: ${rule.message}`);
    }
  }
}

function listFiles(dir) {
  const entries = readdirSync(dir);
  const files = [];

  for (const entry of entries) {
    const entryPath = join(dir, entry);
    const stats = statSync(entryPath);

    if (stats.isDirectory()) {
      files.push(...listFiles(entryPath));
      continue;
    }

    files.push(entryPath);
  }

  return files;
}

function formatPath(filePath) {
  return relative(root, filePath);
}
