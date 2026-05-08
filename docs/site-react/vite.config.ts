import { defineConfig } from "vite";
import path from "node:path";

export default defineConfig({
  build: {
    chunkSizeWarningLimit: 650,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (
            id.includes("/@codemirror/") ||
            id.includes("/@uiw/") ||
            id.includes("/codemirror/")
          ) {
            return "codemirror";
          }

          return undefined;
        },
      },
    },
  },
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
