import { defineConfig } from "tsdown";

const internalPackages = [
  "@usmoment/headless",
  "@usmoment/kit-core",
  "@usmoment/ui-taro",
  "@usmoment/kit-taro",
];

export default defineConfig({
  entry: {
    index: "./src/index.ts",
    headless: "./src/headless.ts",
    ui: "./src/ui.ts",
    kit: "./src/kit.ts",
  },
  format: "esm",
  platform: "neutral",
  target: "es2019",
  dts: true,
  sourcemap: false,
  clean: true,
  deps: {
    alwaysBundle: internalPackages,
    onlyBundle: ["decimal.js"],
    neverBundle: ["react", "react-dom", /^@tarojs\//],
  },
  css: {
    fileName: "style.css",
    inject: true,
    minify: false,
  },
});
