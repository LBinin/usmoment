import { defineConfig } from "vite";
import fs from "node:fs";
import path from "node:path";

const workspacePackageJson = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, "../../package.json"), "utf8"),
) as { version: string };

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
  define: {
    __USMOMENT_VERSION__: JSON.stringify(workspacePackageJson.version),
  },
  resolve: {
    alias: {
      "@usmoment/headless": path.resolve(
        __dirname,
        "../../packages/headless/src/index.ts",
      ),
      "@usmoment/icon": path.resolve(
        __dirname,
        "../../packages/icons/src/index.ts",
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
