# usmoment Project Context

Last updated: 2026-05-07  
Project path: `/path/to/usmoment`  
Current git branch: `codex/usmoment-mvp`

## 1. Product Background

`usmoment` started from a personal WeChat Mini Program for bookkeeping named `你我记账`. The original motivation was not to build a generic CRUD component library, but to extract high-quality, high-capability interaction patterns that were proven in a real product and make them reusable across future projects.

The founder's long-term product philosophy is important:

- Tools are not only about efficiency.
- Product experiences should help reduce distance between people.
- Future products should support warmer moments and stronger connection between friends, partners, and family.
- The component system should therefore support relationship-centered product experiences, not just bookkeeping.

This is why the project is explicitly **not** positioned as a bookkeeping-only library. Bookkeeping is only the first validation domain.

## 2. Original Problem Statement

The project exists because existing Mini Program component ecosystems have several gaps:

- Many components for complex flows look visually rough.
- Existing open source implementations often lack polished interaction details.
- Most libraries expose only final UI blocks, not reusable capability primitives.
- Reusing interaction logic across multiple projects is difficult.

The library is intended to solve those gaps by separating:

- capability logic
- official UI implementation
- higher-level ready-to-use kits

## 3. Core Product Direction

The system is built around a three-layer model:

- `Headless`: domain logic, state, capability contracts, no rendering nodes
- `UI`: official platform-specific visual components
- `Kits`: pre-composed, scenario-oriented components built from Headless + UI

The project is currently `Taro-first`, but the architecture is intended to expand later to:

- WeChat native Mini Program
- Native App
- AI/Agent-friendly integration

## 4. Naming and Brand Context

The final working brand/package name chosen in this conversation is `usmoment`.

Meaning:

- It represents "our moments"
- It should work as a long-term umbrella name for multiple products
- It should carry emotional continuity rather than only technical meaning

Current package namespace decisions:

- workspace root: `@usmoment/workspace`
- headless aggregate package: `@usmoment/headless`
- Taro UI package: `@usmoment/ui-taro`
- Taro Kit package: `@usmoment/kit-taro`
- Taro facade package: `@usmoment/taro`

Facade import goals:

- `@usmoment/taro/headless`
- `@usmoment/taro/ui`
- `@usmoment/taro/kit`

## 5. Confirmed Product Requirements

The following requirements have already been explicitly confirmed and should be treated as default project rules.

### 5.1 Layering Rules

- Headless contains only logic, state, events, and type contracts.
- UI contains visual and platform rendering logic.
- Kits compose Headless + UI into ready-to-use product flows.

### 5.2 Packaging Rules

- Headless is a **single aggregate package**, not one package per headless component.
- UI is also organized as a package with multiple components under `src/components`.
- Kits follow the same structure.
- Dependencies are installed and shared at workspace root.
- The project should not move toward one independent `node_modules` per package.

### 5.3 Directory Rules

All components should follow this shape:

```text
src/
  components/
    <component-name>/
      index.ts | index.tsx
      types.ts          # optional
      __test__/
        index.test.ts | index.test.tsx
```

Important clarification:

- The user explicitly rejected the previous interpretation where each headless component lived in its own package, such as `packages/headless/expression-engine`.
- The correct interpretation is `packages/headless/src/components/expression-engine`.

### 5.4 Documentation Site Rules

The docs site has an explicit information architecture requirement:

- The homepage is for introduction only.
- The homepage must not showcase any components.
- The top header should include these tabs:
  - `UI Components`
  - `Kits`
  - `Headless`
  - `Icons`
  - `AI LLMs`
- `UI Components` should be organized by category.
- `Kits` should list all kits flat for now.
- `Headless` should list all headless components flat for now.

These rules are now part of the spec and should not need to be restated later.

### 5.5 Cross-Platform Style Parity Rules

For the same component and visual skin, platform packages should keep runtime
CSS aligned by default. Web, Taro, and future platform implementations should
not independently add or remove visual declarations such as colors,
backgrounds, shadows, spacing, or z-index rules unless a platform limitation
makes the difference necessary.

When a platform compatibility fix is needed, prefer solving it in platform
rendering logic, build configuration, or a narrowly scoped documented override
instead of changing the visual skin. The visual result should stay as close as
possible to the canonical Web rendering.

If a platform needs different authored units or declarations to achieve visual
parity, such as Taro `rpx` values that mirror a Mini Program source design,
mark the owning CSS with `usm-platform-style-override` and keep the reason
local to that package.

## 6. Confirmed Success Criteria

The MVP success criteria established earlier are:

- Interaction quality reaches at least 90% of the original online experience.
- Core package test coverage reaches at least 80%.
- Packages can be published to npm.
- Real project integration should take under 30 minutes.
- MVP should include:
  - one complete vertical slice: business keyboard + accounting calculator kit
  - one extra headless capability: selection state core

## 7. Roadmap Summary

### Phase 0: Foundation

- Set up monorepo
- define package boundaries
- set up testing and release tooling
- create base docs and playground structure

### Phase 1: MVP

- implement `expression-engine`
- implement `selection-state-core`
- implement `business-keyboard-core`
- implement `business-keyboard`
- implement `calc-display`
- implement `accounting-calculator`
- add Taro facade exports
- add Web playground
- add initial docs shell

### Phase 2: External Usability

- improve docs site
- add better component browsing
- add best practices and integration guides
- stabilize APIs
- add second complete flow, likely fullscreen selector

### Phase 3: AI + Cross-Platform Expansion

- improve manifests and capability schemas
- define agent-facing recipes
- build AI-friendly integration workflow
- research Native App POC
- later expand to wx/native UI and kits

## 8. Current Repository State

This repository has already gone through several iterations.

### 8.1 What Exists

Current top-level areas:

- `packages/headless`
- `packages/ui/taro`
- `packages/kits/taro`
- `packages/facades/taro`
- `apps/playground-web`
- `apps/showcase-taro`
- `docs/site-react`
- `docs/component-manifest.json`
- `docs/capability-schema.json`
- PRD and implementation plan under `docs/`

### 8.2 Current Scripts

Current root scripts include:

- `pnpm dev:docs`
- `pnpm dev:web`
- `pnpm dev:taro`
- `pnpm dev:taro:facade`
- `pnpm dev:taro:all`
- `pnpm dev:showcase-taro`
- `pnpm build:showcase-taro`
- `pnpm build`
- `pnpm build:docs`
- `pnpm build:web`
- `pnpm lint`
- `pnpm typecheck`
- `pnpm test`
- `pnpm test:headless`
- `pnpm test:web`
- `pnpm check:architecture`
- `pnpm changeset:status`

### 8.3 Current Validation Status

Before this context file was last updated, the following checks had been run successfully after the latest keyboard and docs restructuring work:

- `pnpm lint`
- `pnpm typecheck`
- `pnpm test`
- `pnpm build`
- `pnpm check:architecture`

## 9. Current Architecture

### 9.1 Headless

Current intended structure:

```text
packages/headless/
  package.json
  tsconfig.json
  src/
    index.ts
    components/
      expression-engine/
        index.ts
        types.ts
        __test__/
          index.test.ts
      business-keyboard-core/
        index.ts
        types.ts
        __test__/
          index.test.ts
      selection-state-core/
        index.ts
        __test__/
          index.test.ts
```

Responsibilities:

- reusable state and logic only
- no rendering
- exported as aggregated package `@usmoment/headless`

### 9.2 UI

Current intended structure:

```text
packages/ui/taro/
  src/
    index.ts
    components/
      calc-display/
        index.tsx
      business-keyboard/
        index.tsx
        __test__/
          ui.test.tsx
```

Responsibilities:

- official Taro-side UI implementation
- visual behavior only

### 9.3 Kits

Current intended structure:

```text
packages/kits/taro/
  src/
    index.ts
    components/
      accounting-calculator/
        index.tsx
        __test__/
          accounting-calculator.test.tsx
```

Responsibilities:

- compose Headless + UI for ready-to-use scenarios

### 9.4 Facades

Current intended structure:

```text
packages/facades/taro/
  package.json
  src/
    headless.ts
    ui.ts
    kit.ts
  test/
    facade.test.ts
```

Responsibilities:

- provide stable import surfaces
- hide underlying package composition details
- support user-facing imports like:
  - `@usmoment/taro/headless`
  - `@usmoment/taro/ui`
  - `@usmoment/taro/kit`

### 9.5 Docs Site

Current docs site is a lightweight React/Vite app in:

- `docs/site-react`

Current behavior:

- tabbed docs shell
- home page is intro-only
- placeholder pages for:
  - UI Components
  - Kits
  - Headless
  - Icons
  - AI LLMs

## 10. Important Technical Decisions Already Made

### 10.1 Taro-first

The short-term implementation target is Taro.  
This was explicitly chosen early to keep MVP velocity high.

### 10.2 Shared Workspace Dependencies

Dependencies are meant to live at workspace root and be shared.  
This is an explicit user preference and should not be reversed casually.

### 10.3 Aggregate Headless Package

This is a late but important correction.  
The first implementation incorrectly interpreted headless as one-package-per-component.  
The corrected structure is:

- one `headless` package
- many headless components inside `src/components`

This correction should be considered canonical.

### 10.4 Homepage Should Not Showcase Components

Another late but important correction:

- the homepage should not render any component demo
- product/brand/system introduction belongs on the homepage
- component browsing starts from tab pages, not from home

## 11. Current Gaps and Improvement Areas

These are the most relevant improvements still pending.

### 11.1 Spec / Plan Drift

There has been iterative evolution during implementation:

- initial plan assumed separate headless component packages
- later user clarification changed that into an aggregate headless package
- docs were updated, but they should be checked again for any stale examples

The context migration should assume the **aggregate package structure is the source of truth**.

### 11.2 Docs Completeness

The docs site currently acts as a shell, not a full documentation product.

Still missing:

- install page
- architecture overview page
- component detail pages
- API tables
- categorized component listing with richer metadata
- examples and recipes

### 11.3 Package Export Stability

The facade pattern exists, but should be reviewed carefully as the system evolves.

Questions to keep in mind:

- should `@usmoment/taro` remain the only facade package for Taro?
- how should `wx` and `native` facades mirror this?
- when should subpath exports move from source references to built outputs?

### 11.4 Build / Tooling Hardening

The current setup is enough for MVP scaffolding, but still needs hardening:

- Vite aliases are being used to stabilize workspace resolution
- `@usmoment/taro` now builds to `dist` through `tsdown`
- Taro showcase app lives under `apps/showcase-taro` as a private workspace
  Mini Program component gallery. It is intended for real Taro runtime
  debugging and future Mini Program publishing, not npm publishing or package
  API ownership.
- `apps/showcase-taro` currently wires `BusinessKeyboard` and
  `AccountingCalculator` into a component-gallery home page and builds with
  `taro build --type weapp`.
- For local package editing, use `pnpm dev:taro:all` so `@usmoment/taro` rebuilds
  while the showcase Taro watcher observes the facade `dist` files through
  development-only webpack aliases.
- Showcase red lines: it must stay private/non-publishable, consume the public
  `@usmoment/taro` facade rather than package internals, avoid normal source
  aliases that bypass publishable output, and verify hot reload by observing both
  facade rebuild and showcase webpack rebuild.
- release and publishing flow has been exercised through `pnpm release:check`,
  `pnpm release:pack`, tarball smoke tests, and a Taro consumer `build:weapp`
- alpha release is approved, with known issues tracked in
  `docs/release/2026-05-08-alpha-release-notes.md`
- Taro webpack5 default prebundle works when consumers explicitly import
  `@usmoment/taro/style.css`; stable release still needs a final style import
  policy

### 11.5 UI / Design Quality

Current UI code is structural scaffolding, not the final design standard.

Still needed:

- stronger visual design language
- better motion
- real interaction polish
- component-specific docs
- design tokens system

### 11.6 AI Integration Is Only Seeded

The following files exist:

- `docs/component-manifest.json`
- `docs/capability-schema.json`

But they are only initial seeds.  
They are not yet sufficient for serious agent integration.

## 12. Current Open Questions

These questions were not fully resolved in the conversation and are still relevant:

- What should the final npm publishing strategy be for public release?
- Should `ui-taro`, `kit-taro`, `ui-web`, `kit-web`, and `kit-core` remain private
  implementation packages until advanced users need direct access?
- What should the final documentation IA be beyond the first tab shell?
- How should icons and AI LLM sections be structured when implementation begins?
- What compatibility policy should stable releases promise for Taro webpack5
  default prebundle?

## 13. Current Working Rules for Future Sessions

Until changed explicitly, future work should assume:

- `Headless` is a single aggregate package
- all components live under `src/components`
- tests live under each component's `__test__` folder
- workspace dependencies are shared at root
- homepage is intro-only
- docs tabs are required
- `UI Components` are grouped by category
- `Kits` and `Headless` are flat lists for now
- Taro is the primary active platform

## 14. Current Git / Branch Context

The active branch when this file was written is:

- `codex/usmoment-mvp`

The repository is **not clean**. There are uncommitted changes related to:

- aggregate headless package restructuring
- docs and plan updates
- docs-site additions
- path / tsconfig / workspace adjustments
- deletion of old per-component headless package directories

Any continuation session should inspect `git status` first before making more structural changes.

## 15. Recommended Next Steps

The most sensible next actions are:

1. Review the current uncommitted state and decide whether to commit the aggregate-headless restructuring first.
2. Re-run final validation in the active workspace before any new feature work.
3. Finish documentation structure for:
   - install
   - architecture
   - component list pages
   - component detail pages
4. Improve the actual component implementations from scaffold quality to product quality.
5. Only after the structure stabilizes, continue toward:
   - more components
   - publishing flow
   - AI integration
   - wx/native expansion

## 16. Additional Context Worth Preserving

These points are easy to lose across sessions but matter:

- The product philosophy is relational, not merely utilitarian.
- The first working code was allowed to be scaffolding-level to establish structure.
- The user is highly sensitive to naming, architecture shape, and future extensibility.
- The user expects spec updates to follow requirement changes, not lag behind them.
- Structural correctness is more important than shipping many components quickly.
- The project has already undergone at least one significant architecture correction; future sessions should expect more precision refinements and avoid defending stale structure.
