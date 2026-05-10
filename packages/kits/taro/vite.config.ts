import path from "node:path";
import { defineConfig } from "vite";

export default defineConfig({
  resolve: {
    alias: {
      "@usmoment/headless": path.resolve(
        __dirname,
        "../../headless/src/index.ts",
      ),
      "@usmoment/icon/taro": path.resolve(__dirname, "../../icons/src/taro.ts"),
      "@usmoment/icon": path.resolve(__dirname, "../../icons/src/index.ts"),
      "@usmoment/kit-core": path.resolve(
        __dirname,
        "../core/src/index.ts",
      ),
      "@usmoment/ui-taro": path.resolve(__dirname, "../../ui/taro/src/index.ts"),
    },
  },
});
