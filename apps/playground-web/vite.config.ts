import { defineConfig } from "vite";
import path from "node:path";

export default defineConfig({
  resolve: {
    alias: {
      "@usmoment/headless": path.resolve(
        __dirname,
        "../../packages/headless/src/index.ts",
      ),
      "@usmoment/kit-core": path.resolve(
        __dirname,
        "../../packages/kits/core/src/index.ts",
      ),
      "@usmoment/kit-web": path.resolve(
        __dirname,
        "../../packages/kits/web/src/index.ts",
      ),
      "@usmoment/taro/headless": path.resolve(
        __dirname,
        "../../packages/facades/taro/src/headless.ts",
      ),
      "@usmoment/taro/ui": path.resolve(
        __dirname,
        "../../packages/ui/web/src/index.ts",
      ),
      "@usmoment/taro/kit": path.resolve(
        __dirname,
        "../../packages/kits/web/src/index.ts",
      ),
      "@usmoment/ui-web": path.resolve(
        __dirname,
        "../../packages/ui/web/src/index.ts",
      ),
    },
  },
});
