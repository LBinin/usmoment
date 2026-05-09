import { createRequire } from "node:module";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "@tarojs/cli";

const require = createRequire(import.meta.url);
const configDir = dirname(fileURLToPath(import.meta.url));
const appRoot = resolve(configDir, "..");
const workspaceRoot = resolve(configDir, "../../..");
const taroFacadeDist = resolve(workspaceRoot, "packages/facades/taro/dist");

export default defineConfig({
  date: "2026-05-09",
  designWidth: 750,
  deviceRatio: {
    375: 2,
    640: 2.34 / 2,
    750: 1,
    828: 1.81 / 2,
  },
  framework: "react",
  projectName: "usmoment-showcase-taro",
  compiler: {
    type: "webpack5",
    prebundle: {
      enable: false,
    },
  },
  sourceRoot: "src",
  outputRoot: "dist",
  mini: {
    webpackChain(chain) {
      chain.resolve.symlinks(false);
      chain.resolve.modules.add(resolve(appRoot, "node_modules"));
      chain.watchOptions({
        aggregateTimeout: 600,
      });
      chain.resolve.alias
        .set("react$", require.resolve("react"))
        .set("react/jsx-runtime$", require.resolve("react/jsx-runtime"))
        .set("react/jsx-dev-runtime$", require.resolve("react/jsx-dev-runtime"))
        .set("@usmoment/taro$", resolve(taroFacadeDist, "index.js"))
        .set("@usmoment/taro/headless$", resolve(taroFacadeDist, "headless.js"))
        .set("@usmoment/taro/ui$", resolve(taroFacadeDist, "ui.js"))
        .set("@usmoment/taro/kit$", resolve(taroFacadeDist, "kit.js"))
        .set("@usmoment/taro/style.css$", resolve(taroFacadeDist, "style.css"));
    },
  },
});
