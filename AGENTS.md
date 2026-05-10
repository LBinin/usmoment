# usmoment Agent Rules

These rules are for AI agents and human maintainers working in this repository.

## Priority

- `MUST`: hard rule. Do not violate without explicit user approval.
- `SHOULD`: default rule. Follow unless there is a clear, documented reason.
- `MAY`: allowed pattern.

## Global MUST Rules

- Use the current project context as the source of truth before structural changes: `context/usmoment-project-context.md`.
- Keep `Headless`, `UI`, and `Kits` separated.
- Keep components under `src/components/<component>/`.
- Keep component tests under each component's `__test__/` directory.
- Keep `@usmoment/headless` as a single aggregate package.
- Do not return to one-package-per-headless-component structure.
- Use the workspace root dependency graph. Do not create per-package independent dependency trees.
- Preserve the docs homepage as introduction-only. Component browsing belongs under the tab pages.
- Docs site content MUST be updated in both Chinese and English when changing user-facing documentation, API tables, component descriptions, or playground labels.
- Avoid large mixed-responsibility files. During implementation, split data definitions, routing helpers, playground/demo logic, render containers, and styling concerns into focused files instead of accumulating them in one component file.

## Headless MUST Rules

- `packages/headless` must stay platform-agnostic.
- Do not import React, Taro, DOM APIs, UI packages, or Kit packages from Headless code.
- Headless contains logic, state, configuration, events, and type contracts only.
- Do not use `eval` or `Function` for expression evaluation.
- Money and decimal arithmetic must avoid native floating-point precision bugs.
- `expression-engine` current explicit scope: supports numbers, decimals, `+`, `-`, `*`, `/`, `×`, and `÷`; does not support parentheses, percent, functions, variables, or symbolic expressions.
- Invalid or incomplete expression input must not crash consumers.

## Headless SHOULD Rules

- Use TDD for Headless behavior changes.
- Prefer structured config objects over stringly typed presets.
- Prefer structured warning/error/event payloads with stable codes and messages.
- Keep cross-platform presets in Headless when they describe reusable capability configuration.
- Add tests for edge cases, malformed input, and custom configuration behavior.

## UI MUST Rules

- UI packages render platform-specific visuals and interactions.
- UI may consume Headless config/events, but Headless must never depend on UI.
- UI components should not own business flow orchestration.
- UI defaults MUST stay neutral and theme-aligned. Product-specific skins,
  strong scenario styling, and business copy belong in Kits. See
  `docs/architecture/component-design-guidelines.md`.
- Styled UI components MUST expose stable root/major-region classes and SHOULD
  expose CSS variables plus `*ClassName` / `*Style` props for meaningful
  extension points.
- Cross-platform UI component styles MUST stay aligned by default. For the same component and visual skin, Web, Taro, and future platform CSS should not add or remove visual declarations independently unless a platform limitation makes the difference necessary.
- Platform compatibility fixes SHOULD live in platform rendering logic, build config, or narrowly scoped documented overrides instead of changing the shared visual skin.
- When a platform-specific style difference is truly necessary, document the reason near the owning package and keep the visual result as close as possible to the canonical Web rendering. Use the `usm-platform-style-override` marker only for intentional platform visual parity exceptions such as Taro `rpx` skins.

## Kit MUST Rules

- Kits compose Headless + UI into ready-to-use product flows.
- Kits may manage scenario state and callbacks.
- Kits own scenario-specific skins and business content. When wrapping UI
  components, Kit-generated defaults MUST be overridable by explicit UI props
  according to `docs/architecture/component-design-guidelines.md`.
- Kits should avoid multiplying exports when one open-box component with escape hatches is enough.
- Cross-platform Kit styles MUST follow the same visual skin across platforms by default. Taro, Web, and future platform kits should not introduce extra skin colors, backgrounds, shadows, spacing, or z-index rules unless they are required for that platform and documented.

## Taro Showcase MUST Rules

- `apps/showcase-taro` is the official Mini Program component showcase. It is a private workspace app and MUST NOT be treated as a publishable npm package.
- Showcase code MUST consume the public `@usmoment/taro` facade entrypoints instead of importing package internals directly.
- Local showcase development MUST keep consumption close to the publishable facade. Do not alias showcase directly to package source files unless the user explicitly approves a temporary diagnostic.
- When editing `packages/*` and expecting the Mini Program to refresh, use the combined watch flow: `pnpm dev:taro:all`.
- `@usmoment/taro` development watch SHOULD avoid cleaning `dist` on every rebuild, because Taro's watcher can observe transient missing files such as `style.css`. One-off publish builds MUST still produce a clean `dist`.
- Keep Taro runtime compatibility fixes in showcase build config or platform rendering code. Do not change shared component skins just to work around showcase tooling.

## Docs Site MUST Rules

- Component browser container files should only own rendering composition and local UI state.
- Do not put component docs data, API row builders, playground implementations, routing helpers, or long parsing utilities inside component browser container files.
- Keep docs-site AI navigation context current when changing routes, major file ownership, or component explorer structure: `docs/ai-context/docs-site-map.md`.
- Keep docs-site CSS split by concern. Do not accumulate unrelated layout, docs, playground, component-demo, and asset styles in one stylesheet.
- Docs-site CSS must not define package runtime classes such as `.usm-*`. Component runtime styling belongs in Headless/UI/Kit packages according to layer ownership.
- Docs-site CSS must not contain runtime `data:image` or base64 assets. If component assets intentionally stay base64, isolate them in the owning UI or Kit package behind named CSS variables.
- Prefer named files under the owning package or app public assets when visual assets churn often, need independent browser caching, or make the isolated asset CSS too large to review comfortably.
- Routine AI searches and diffs should exclude dedicated package asset CSS files unless the task is specifically changing those visual assets.

## Third-Party Dependency Principles

- Dependencies in Headless MUST be platform-agnostic and DOM-free.
- Prefer small, focused, well-maintained libraries for precise needs.
- Avoid broad framework-like dependencies in Headless unless the benefit is explicit and documented.
- When adding a dependency, document why it exists and what alternatives were considered when the choice is non-obvious.

## Icon Package MUST Rules

- `@usmoment/icon` is a publishable package for curated SVG icon components.
- Icon component files MUST stay thin: bind a definition through `createIcon`
  and do not contain local SVG rendering helpers, class-name utilities, or
  duplicated size/color/accessibility logic.
- SVG asset data belongs under `packages/icons/src/definitions/` as structured
  data. Do not store SVG strings that must be parsed at runtime.
- Shared icon rendering behavior belongs under `packages/icons/src/shared/`.
- Do not hardcode visual colors in icon SVG data or components. Use
  `var(--usm-icon-color, currentColor)`, `currentColor`, package CSS variables,
  or explicit props.
- Do not add gradient or multi-color APIs globally until a real icon requires
  them and the API is documented in `docs/architecture/icon-library-guidelines.md`.
- Every packaged third-party icon MUST record source and license metadata and
  update `packages/icons/THIRD_PARTY_NOTICES.md`.

## Verification

- Run `pnpm check:architecture` after architecture-sensitive changes.
- Run focused tests first, then `pnpm test`, `pnpm typecheck`, `pnpm build`, and `pnpm lint` before claiming completion.

## Git Message Rules

- Use Conventional Commits for repository commits: `<type>(<scope>): <subject>`.
- `scope` is optional, but SHOULD be used when the change clearly belongs to one package, app, or documentation area.
- Keep the subject in imperative mood, lowercase after the type, and no trailing period.
- Use `pnpm changeset` for every publishable package change.
- See `CONTRIBUTING.md` for accepted types, common scopes, examples, and the local `.gitmessage` template.
