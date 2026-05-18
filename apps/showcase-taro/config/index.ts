import { createRequire } from "node:module";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "@tarojs/cli";

const require = createRequire(import.meta.url);
const configDir = dirname(fileURLToPath(import.meta.url));
const appRoot = resolve(configDir, "..");
const workspaceRoot = resolve(configDir, "../../..");
const taroFacadeDist = resolve(workspaceRoot, "packages/facades/taro/dist");
const iconDist = resolve(workspaceRoot, "packages/icons/dist");
const iconNodeModule = resolve(appRoot, "node_modules/@usmoment/icon");
const babel = require("@babel/core");
const babelPresetEnvPath = require.resolve("@babel/preset-env");

class MiniProgramEs5OutputPlugin {
  apply(compiler) {
    compiler.hooks.thisCompilation.tap(
      "MiniProgramEs5OutputPlugin",
      (compilation) => {
        compilation.hooks.processAssets.tap(
          {
            name: "MiniProgramEs5OutputPlugin",
            stage:
              compiler.webpack.Compilation.PROCESS_ASSETS_STAGE_OPTIMIZE,
          },
          (assets) => {
            for (const assetName of Object.keys(assets)) {
              if (!assetName.endsWith(".js")) continue;

              const source = assets[assetName].source().toString();
              const result = babel.transformSync(source, {
                babelrc: false,
                comments: false,
                compact: false,
                configFile: false,
                filename: assetName,
                presets: [
                  [
                    babelPresetEnvPath,
                    {
                      forceAllTransforms: true,
                      ignoreBrowserslistConfig: true,
                      modules: false,
                      targets: {
                        android: "5",
                        ios: "9",
                      },
                    },
                  ],
                ],
                sourceMaps: false,
              });

              if (result?.code) {
                compilation.updateAsset(
                  assetName,
                  new compiler.webpack.sources.RawSource(result.code),
                );
              }
            }
          },
        );
      },
    );
  }
}

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
  compile: {
    include: [taroFacadeDist, iconDist, iconNodeModule],
  },
  sourceRoot: "src",
  outputRoot: "dist",
  mini: {
    webpackChain(chain) {
      chain.resolve.symlinks(false);
      chain.resolve.modules.add(resolve(appRoot, "node_modules"));
      chain.output.set("environment", {
        arrowFunction: false,
        bigIntLiteral: false,
        const: false,
        destructuring: false,
        dynamicImport: false,
        forOf: false,
        module: false,
        optionalChaining: false,
        templateLiteral: false,
      });
      chain.optimization.concatenateModules(false);
      chain
        .plugin("mini-program-es5-output")
        .use(MiniProgramEs5OutputPlugin);
      chain.watchOptions({
        aggregateTimeout: 600,
      });
      chain.module.rule("script").use("babelLoader").tap((options = {}) => ({
        ...options,
        babelrc: false,
        configFile: resolve(appRoot, "babel.config.cjs"),
      }));
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
