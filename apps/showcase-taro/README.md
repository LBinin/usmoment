# usmoment Taro Showcase

`apps/showcase-taro` is the official Taro Mini Program component gallery for
usmoment.

It is a private workspace app, not an npm package. It can be built and opened in
WeChat Developer Tools, but it does not participate in Changesets or package
publishing.

## Commands

From the workspace root:

```bash
pnpm dev:taro:all
pnpm dev:taro
pnpm dev:taro:facade
pnpm dev:showcase-taro
pnpm build:showcase-taro
```

Inside this app:

```bash
pnpm dev
pnpm build
pnpm test
pnpm typecheck
```

Use `pnpm dev:taro:all` when editing `packages/*` and expecting the Mini Program
to refresh. It runs the `@usmoment/taro` facade watcher and the showcase Taro
watcher together.

`pnpm dev:taro` and `pnpm dev:showcase-taro` both run only the showcase app's
`taro build --type weapp --watch`. `pnpm dev:taro:facade` runs only the
`@usmoment/taro` facade watcher.

Inside this app, `pnpm dev` runs `taro build --type weapp --watch`. `pnpm build`
runs a one-off `taro build --type weapp`.

Webpack5 prebundle is disabled for this app so WeChat Developer Tools loads the
generated Mini Program bundle directly instead of relying on Taro's Module
Federation remote cache files.

The app also aliases `react`, `react/jsx-runtime`, and `react/jsx-dev-runtime`
to its local React 18 install. This keeps Taro 4's React runtime on the version
it expects even when the workspace root uses React 19 for docs and web tooling.

For local development, the app aliases `@usmoment/taro` facade entrypoints to
`packages/facades/taro/dist`. This keeps showcase consumption aligned with the
publishable facade while allowing Taro's watcher to observe rebuilt workspace
files instead of treating them as cached `node_modules` dependencies.

## Boundaries

- Showcase pages should consume the public facade entrypoints such as
  `@usmoment/taro/headless` and `@usmoment/taro/ui`.
- Do not import from `packages/headless`, `packages/ui/taro`, or
  `packages/kits/taro` directly from showcase pages. The showcase should verify
  the facade that real users install.
- Do not alias `@usmoment/taro` directly to package source files for normal
  development. Source aliases make hot reload easier but stop validating the
  publishable facade boundary.
- Demo data, routing metadata, and example state should stay inside this app.
- The home page reads its grouped component directory from
  `src/showcase/catalog.ts`.
- Runtime component styles belong to the owning UI or Kit package, not to the
  showcase app.
- The app uses React 18 because the Taro 4 React runtime expects React 18.

## Watch Rules

- Use `pnpm dev:taro:all` for package development. Seeing
  `@usmoment/taro` rebuild is not enough; the showcase watcher must also rebuild
  after facade `dist` changes.
- `@usmoment/taro` uses `tsdown --watch --no-clean` in development so watched
  files such as `style.css` do not disappear briefly between rebuild steps.
- Keep one-off `@usmoment/taro` builds clean. The `build` script should continue
  to clean `dist` before producing releaseable output.
- If showcase stops hot updating, verify the full chain in this order: source
  change under `packages/*`, facade watcher rebuild, showcase webpack rebuild,
  then WeChat Developer Tools refresh.
- If dependency resolution fails after aliasing facade `dist`, make sure the
  showcase app's local `node_modules` remains in webpack's resolve modules. The
  facade `dist` can still import Taro peer dependencies that belong to the app.

## Red Lines

- Do not make `apps/showcase-taro` part of the npm package release surface.
- Do not use showcase-local CSS to override runtime `.usm-*` component skins.
- Do not fix Taro runtime issues by downgrading shared architecture boundaries
  between Headless, UI, Kits, and Facade.
- Do not report package hot reload as working unless both watchers have rebuilt
  in the same edit cycle.

## Current Pages

- `pages/index/index`: grouped component directory.
- `pages/kits/accounting-calculator/index`: AccountingCalculator Kit demo.
- `pages/kits/accounting-calculator-popup/index`: AccountingCalculatorPopup Kit demo.
- `pages/ui/business-keyboard/index`: BusinessKeyboard UI demo.
