import path from "node:path";
import { defineConfig } from "vite";

export default defineConfig({
  resolve: {
    alias: {
      "@usmoment/icon/taro": path.resolve(__dirname, "../../icons/src/taro.ts"),
      "@usmoment/icon": path.resolve(__dirname, "../../icons/src/index.ts"),
    },
  },
});
