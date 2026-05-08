import path from "node:path";
import { defineConfig } from "vite";

export default defineConfig({
  resolve: {
    alias: {
      "@usmoment/headless": path.resolve(
        __dirname,
        "../../headless/src/index.ts",
      ),
      "@usmoment/kit-core": path.resolve(
        __dirname,
        "../core/src/index.ts",
      ),
      "@usmoment/ui-web": path.resolve(__dirname, "../../ui/web/src/index.ts"),
    },
  },
});
