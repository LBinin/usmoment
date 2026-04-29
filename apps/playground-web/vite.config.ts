import { defineConfig } from "vite";
import path from "node:path";

export default defineConfig({
  resolve: {
    alias: {
      "@usmoment/headless": path.resolve(
        __dirname,
        "../../packages/headless/src/index.ts",
      ),
      "@usmoment/taro/headless": path.resolve(
        __dirname,
        "../../packages/facades/taro/src/headless.ts",
      ),
      "@usmoment/taro/ui": path.resolve(
        __dirname,
        "../../packages/facades/taro/src/ui.ts",
      ),
      "@usmoment/taro/kit": path.resolve(
        __dirname,
        "../../packages/facades/taro/src/kit.ts",
      ),
    },
  },
});
