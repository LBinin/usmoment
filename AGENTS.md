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

## Kit MUST Rules

- Kits compose Headless + UI into ready-to-use product flows.
- Kits may manage scenario state and callbacks.
- Kits should avoid multiplying exports when one open-box component with escape hatches is enough.

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

## Verification

- Run `pnpm check:architecture` after architecture-sensitive changes.
- Run focused tests first, then `pnpm test`, `pnpm typecheck`, `pnpm build`, and `pnpm lint` before claiming completion.

## Git Message Rules

- Use Conventional Commits for repository commits: `<type>(<scope>): <subject>`.
- `scope` is optional, but SHOULD be used when the change clearly belongs to one package, app, or documentation area.
- Keep the subject in imperative mood, lowercase after the type, and no trailing period.
- Use `pnpm changeset` for every publishable package change.
- See `CONTRIBUTING.md` for accepted types, common scopes, examples, and the local `.gitmessage` template.
