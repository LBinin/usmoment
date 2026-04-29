import path from "node:path";
import { defineConfig } from "vite";

export default defineConfig({
  resolve: {
    alias: {
      "@usmoment/headless": path.resolve(
        __dirname,
        "../../headless/src/index.ts",
      ),
      "@usmoment/ui-taro": path.resolve(__dirname, "../../ui/taro/src/index.ts"),
    },
  },
});
