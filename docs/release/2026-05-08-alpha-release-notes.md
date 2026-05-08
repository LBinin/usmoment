# 2026-05-08 Alpha Release Notes

This note records the current alpha publishing decision for `@usmoment/taro`.
The package is considered ready for an alpha release. Taro webpack5 default
prebundle now works when consumers explicitly import the package stylesheet.

## Alpha Scope

- Public package: `@usmoment/taro`
- Public entry goal:
  - `import { AccountingCalculator, BusinessKeyboard } from "@usmoment/taro"`
  - `import "@usmoment/taro/style.css"`
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
forced reinstall because the local tarball filename may stay the same during
iteration:

```bash
cd /Users/toby/Documents/usmoment-taro-consumer
pnpm add /Users/toby/Documents/usmoment/dist-pack/usmoment-taro-0.0.1-alpha.0.tgz --force
pnpm build:weapp
pnpm dev:weapp
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
- The Taro consumer project builds successfully with default Taro webpack5
  prebundle when the page imports `@usmoment/taro/style.css`.
- The Taro consumer `dev:weapp` workflow and WeChat DevTools runtime no longer
  hit `.wxss.js is not defined` for `@usmoment/taro`.
- `pnpm changeset:status` reports only `@usmoment/taro` as the package to bump.

## Integration Requirement

Consumers should import the package stylesheet explicitly from their page or app
entry:

```ts
import "@usmoment/taro/style.css";
```

The package still exports `./style.css`, but component JavaScript no longer
auto-imports CSS. This keeps dependency CSS out of Taro's prebundle JavaScript
path and avoids runtime `.wxss.js` references.

## Known Issues Before Stable Release

### Taro webpack5 prebundle and dependency CSS

Earlier verification found that Taro webpack5 default prebundle could produce a
runtime error in WeChat DevTools when package JavaScript auto-imported CSS:

```text
prebundle/vendors-node_modules_taro_weapp_prebundle_usmoment_taro_js.wxss.js is not defined
```

Current mitigation:

- `tsdown` CSS injection is disabled for `@usmoment/taro`.
- `@usmoment/taro/style.css` remains a package export.
- Consumers must explicitly import `@usmoment/taro/style.css`.

This has been verified with default Taro webpack5 prebundle enabled:

- `pnpm build:weapp` passes.
- `pnpm dev:weapp` passes.
- WeChat DevTools runtime displays the page normally.
- No `prebundle/...usmoment...wxss.js` runtime reference is generated.

Stable release follow-up: decide whether explicit stylesheet import is the final
API, or whether a future platform-specific style entry should be introduced.

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
