# 2026-05-08 Alpha Release Notes

This note records the current alpha publishing decision for `@usmoment/taro`.
The package is considered ready for an alpha release, with the known Taro
prebundle issue documented below.

## Alpha Scope

- Public package: `@usmoment/taro`
- Public entry goal:
  - `import { AccountingCalculator, BusinessKeyboard } from "@usmoment/taro"`
  - `@usmoment/taro/headless`
  - `@usmoment/taro/ui`
  - `@usmoment/taro/kit`
- Internal private layers:
  - `@usmoment/headless`
  - `@usmoment/kit-core`
  - `@usmoment/ui-taro`
  - `@usmoment/kit-taro`
  - `@usmoment/ui-web`
  - `@usmoment/kit-web`

## Verified

The following checks passed before approving alpha publishing:

```bash
pnpm release:check
pnpm changeset:status
pnpm release:pack
```

The generated tarball was also installed into the Taro consumer project with a
forced reinstall because the tarball filename stays the same at version `0.0.0`:

```bash
cd /path/to/usmoment-taro-consumer
pnpm add /path/to/usmoment/dist-pack/usmoment-taro-0.0.0.tgz --force
pnpm build:weapp
```

Confirmed results:

- The tarball contains only `package/dist/*` and `package/package.json`.
- The packed `package.json` has no internal `dependencies` and no `workspace:*`
  references.
- The packed `package.json` exposes only these peer dependencies:
  - `@tarojs/components`
  - `@tarojs/taro`
  - `react`
- Built output does not leak runtime imports for internal workspace packages such
  as `@usmoment/kit-core`, `@usmoment/ui-web`, or `@usmoment/kit-web`.
- Docs and Web playground build successfully with the Web UI/Kit implementation.
- The Taro consumer project builds successfully with `prebundle.enable = false`.
- `pnpm changeset:status` reports only `@usmoment/taro` as the package to bump.

## Known Issues Before Stable Release

### Taro webpack5 prebundle and dependency CSS

The current package has passed Taro mini program build verification when the
consumer disables Taro prebundle:

```ts
compiler: {
  type: "webpack5",
  prebundle: {
    enable: false,
  },
}
```

Earlier verification found that Taro webpack5 default prebundle can produce a
runtime error in WeChat DevTools for dependency CSS from the published package:

```text
prebundle/vendors-node_modules_taro_weapp_prebundle_usmoment_taro_js.wxss.js is not defined
```

This is not considered an alpha blocker, but it must be resolved or documented
for consumers before a stable release.

Recommended follow-up verification:

```bash
cd /path/to/usmoment-taro-consumer
pnpm add /path/to/usmoment/dist-pack/usmoment-taro-0.0.0.tgz --force
pnpm build:weapp
pnpm dev:weapp
```

Then open the generated project in WeChat DevTools and verify whether the
`.wxss.js is not defined` runtime error still appears with default prebundle.

Possible stable-release paths:

- Fix package CSS output so it works with Taro webpack5 default prebundle.
- Or document that consumers should disable Taro prebundle when using the alpha
  package.

### Source region comments in bundled output

`tsdown` currently emits source region comments in the bundled JS and declaration
output, for example comments that reference internal source folders. These do
not create runtime dependencies and are not an alpha blocker, but they reveal a
small amount of internal source layout. Revisit this before a stable release if
the package output should be cleaner.

### React type peer warning in workspace

The workspace currently uses React 19 types, while Taro 4.2 reports a peer
expectation for React 18 types through its dependency graph. This has not blocked
the current build, typecheck, package smoke test, or Taro consumer build. Keep it
on the compatibility checklist for stable release hardening.

## Alpha Publishing Commands

Use Changesets prerelease mode for the alpha line:

```bash
pnpm release:alpha:enter
pnpm release:version
pnpm release:publish
```

After finishing alpha prereleases, exit prerelease mode before preparing beta,
rc, or stable releases:

```bash
pnpm release:pre:exit
```
