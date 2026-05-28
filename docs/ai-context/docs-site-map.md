# Docs Site Map

This file is a compact navigation map for agents working on the docs site.
Read it before opening large docs-site files.

## Purpose

- Reduce repeated code exploration.
- Point agents to the smallest file that owns the requested change.
- Keep docs-site routing, component browsing, and playground responsibilities clear.

## Global Rules

- Homepage is introduction-only. Do not add component demos to the homepage.
- Component browsing belongs under Kits, UI Components, and Headless pages.
- Update Chinese and English content together for user-facing docs.
- Keep Headless, UI, and Kits conceptually separate in documentation.
- Component styling and Kit override rules are captured in
  `docs/architecture/component-design-guidelines.md`.
- Keep render containers, docs data, routing helpers, playgrounds, API tables, and CSS concerns in separate focused files.
- Do not add docs data factories, API row builders, playground implementations, or long parsing utilities to `component-explorer/index.tsx`.
- Docs-site CSS must not define package runtime classes such as `.usm-*`; those styles belong in UI or Kit packages.
- Docs-site CSS must not contain runtime `data:image` or base64 assets. If component assets intentionally stay base64, isolate them in the owning package and reference them through named CSS variables.

## App Entry Points

- `docs/site-react/src/main.tsx`: React mount entry.
- `docs/site-react/src/DocsApp.tsx`: top-level tab routing and locale state.
- `docs/site-react/src/shared/header/index.tsx`: top navigation, brand logo, locale select.
- `docs/site-react/src/styles.css`: Tailwind v4 / shadcn stylesheet entry.
  Owns Tailwind imports, `tw-animate-css`, shadcn theme token mapping, and CSS
  owner-file imports. Put docs-site page/layout rules in `src/styles/*`
  instead of adding mixed rule sections here.
- `docs/site-react/src/styles/README.md`: stylesheet ownership map and asset/base64 policy.

## Routes

- `/`: homepage introduction.
- `/kits`: Kits tab, defaults to first kit.
- `/kits/accounting-display`: AccountingDisplay kit docs.
- `/kits/accounting-calculator`: AccountingCalculator kit docs.
- `/kits/accounting-calculator-popup`: AccountingCalculatorPopup Web + Taro kit docs.
- `/kits/accounting-category-selector`: AccountingCategorySelector Web + Taro kit docs.
- `/ui-components`: UI Components tab, grouped by category.
- `/ui-components/business-keyboard`: BusinessKeyboard UI docs.
- `/ui-components/calc-display`: CalcDisplay UI docs.
- `/ui-components/popup`: Popup Web + Taro UI docs.
- `/ui-components/fullscreen-option-list`: FullscreenOptionList Web + Taro UI docs.
- `/headless`: Headless tab, flat list.
- `/headless/business-keyboard-core`: business keyboard Headless docs.
- `/headless/expression-engine`: expression engine docs.
- `/headless/selection-state-core`: selection state docs.
- `/icons`: Icons page with install guidance, searchable icon grid, category filters, copy actions, API props, theme variables, and source/license guidance.
- `/ai-llms`: AI LLMs placeholder page.

Type/API anchors use hash fragments, for example:

- `/kits/accounting-display#section-playground`
- `/kits/accounting-calculator#section-playground`
- `/kits/accounting-calculator#section-api`
- `/kits/accounting-calculator#type-BusinessKeyboardConfig`
- `/kits/accounting-calculator-popup#section-api`
- `/kits/accounting-category-selector#section-playground`
- `/kits/accounting-category-selector#section-api`
- `/ui-components/popup#section-api`
- `/ui-components/fullscreen-option-list#section-api`

## Component Explorer Files

- `docs/site-react/src/shared/component-explorer/index.tsx`
  - Owns the component browser layout, selected component state, sidebar list, detail article, compact metadata strip, and right-side page TOC rendering.
  - Should stay as the container, not a dumping ground for docs data, API row builders, playground logic, routing helpers, or parsing utilities.

- `docs/site-react/src/shared/component-explorer/component-docs.tsx`
  - Thin barrel that re-exports docs data factories.

- `docs/site-react/src/shared/component-explorer/ui-component-docs.tsx`
  - Owns UI Components docs data and imports only UI playgrounds/API row helpers.

- `docs/site-react/src/shared/component-explorer/kit-component-docs.tsx`
  - Owns Kits docs data and imports only Kit playgrounds/API row helpers.

- `docs/site-react/src/shared/component-explorer/headless-component-docs.tsx`
  - Owns Headless docs data and imports only Headless playgrounds/API row helpers.

- `docs/site-react/src/shared/component-explorer/component-api-rows.ts`
  - Owns shared API row builders and type-section definitions.

- `docs/site-react/src/shared/component-explorer/component-metadata.ts`
  - Owns source/llms metadata helper used by component docs files.

- `docs/site-react/src/shared/component-explorer/grouping.ts`
  - Groups component docs for the left-side component list.

- `docs/site-react/src/shared/component-explorer/types.ts`
  - Shared docs data types: `ComponentDoc`, `ApiRow`, `TypeSection`.

- `docs/site-react/src/shared/component-explorer/routing.ts`
  - Component selection URL helpers.
  - Owns `/tab/component-id` path handling and legacy query fallback.

- `docs/site-react/src/shared/component-explorer/toc.ts`
  - Builds right-side "On this page" items.
  - Tracks active section against scroll position using CSS/header-aware anchor offsets.

- `docs/site-react/src/shared/component-explorer/anchors.ts`
  - Shared anchor id helpers, currently `typeAnchor`.

- `docs/site-react/src/shared/component-explorer/api-table.tsx`
  - API table rendering, required badges, inline type links.
  - Use this when changing Props/type table visuals or linking behavior.

- `docs/site-react/src/shared/component-explorer/code-block.tsx`
  - Static and editable code blocks.
  - Copy-to-clipboard behavior lives here.

- `docs/site-react/src/shared/component-explorer/playground-frame.tsx`
  - Shared Interactive Lab shell and small form controls.
  - Use this when changing the layout of preview stage, side controls, event output, and code panel.

- `docs/site-react/src/shared/component-explorer/playgrounds.tsx`
  - Thin barrel that re-exports playground implementations.

- `docs/site-react/src/shared/component-explorer/ui-playgrounds.tsx`
  - Owns UI playground implementations: BusinessKeyboard, CalcDisplay, and FullscreenOptionList.

- `docs/site-react/src/shared/component-explorer/kit-playgrounds.tsx`
  - Owns Kit playground implementations: AccountingDisplay, AccountingCalculator, and AccountingCategorySelector.

- `docs/site-react/src/shared/component-explorer/headless-playgrounds.tsx`
  - Owns Headless playground implementations: expression-engine, selection-state-core, and business-keyboard-core.

- `docs/site-react/src/shared/component-explorer/playground-code.ts`
  - Owns generated example-code strings used by live playgrounds.

- `docs/site-react/src/shared/component-explorer/playground-data.ts`
  - Owns shared demo/mock data used by playgrounds.

- `docs/site-react/src/shared/component-explorer/playground-utils.ts`
  - Owns code-editor parsing helpers, JSON formatting helpers, and playground value coercion.

- `docs/site-react/src/shared/component-explorer/playground-types.ts`
  - Owns small shared playground prop types.

## Page Files

- `docs/site-react/src/pages/home/index.tsx`: intro-only homepage.
- `docs/site-react/src/pages/kits/index.tsx`: Kits page wrapper.
- `docs/site-react/src/pages/ui-components/index.tsx`: UI page wrapper.
- `docs/site-react/src/pages/headless/index.tsx`: Headless page wrapper.
- `docs/site-react/src/pages/icons/index.tsx`: Icons docs page shell. Owns page-level filter/copy state and page composition.
- `docs/site-react/src/pages/icons/icon-data.ts`: Icon entries, category copy, and quickstart code snippets.
- `docs/site-react/src/pages/icons/table-data.ts`: Icon API props and theme-variable table rows.
- `docs/site-react/src/pages/icons/icon-catalog.tsx`: Search, category filter, and icon grid rendering.
- `docs/site-react/src/pages/icons/code-panel.tsx`: Icons quickstart code panel.
- `docs/site-react/src/pages/icons/info-table.tsx`: Icons local info table rendering.
- `docs/site-react/src/pages/ai-llms/index.tsx`: AI LLMs page wrapper.

## Styles Files

- `docs/site-react/src/styles/base.css`
  - Global custom properties, page base, body, root sizing.

- `docs/site-react/src/styles/header.css`
  - Sticky top header, logo, primary tabs, locale select.

- `docs/site-react/src/styles/landing.css`
  - Homepage introduction page only.

- `docs/site-react/src/styles/component-page.css`
  - Component docs page shell, intro, sidebars, detail card, right-side TOC.

- `docs/site-react/src/styles/code-block.css`
  - Static code blocks, editable code blocks, copy button, CodeMirror theme glue.

- `docs/site-react/src/styles/api-table.css`
  - Props/type API tables, inline code chips, required badges, type links.

- `docs/site-react/src/styles/playground.css`
  - Shared Interactive Lab shell, preview stage, side controls, output panel, show-code area.

- `docs/site-react/src/styles/headless-debugger.css`
  - Expression-engine and selection-state-core debugger UI.

- `docs/site-react/src/styles/icons-page.css`
  - `/icons` page layout, icon asset catalog grid, API tables, category filters, and code panels.

- `docs/site-react/src/styles/keyboard-demo.css`
  - Docs-only preview wrappers for keyboard demos. It must not target `.usm-*` runtime classes or include raw base64.

- `docs/site-react/src/styles/responsive.css`
  - Cross-page responsive overrides.

## Current Large Files To Watch

- `docs/site-react/src/shared/component-explorer/headless-playgrounds.tsx`
  - Largest remaining docs-site playground file because business-keyboard-core includes multiple JSON debug panels.
  - Next cleanup target: split headless playgrounds one-per-file if they grow further.

- `docs/site-react/src/shared/component-explorer/component-api-rows.ts`
  - Centralized API row/type-section definitions.
  - Next cleanup target: split by layer if API docs keep growing.

- `packages/kits/taro/src/components/accounting-calculator/keyboard-assets.css`
  - Isolated base64 accounting keyboard art owned by the AccountingCalculator Kit preset.
  - Exclude from routine AI reads unless the financial keyboard image assets are changing.

## Recommended Agent Workflow

1. Read this file and `context/usmoment-project-context.md`.
2. Identify the smallest owner file from the maps above.
3. Read only the owner file and directly related imports.
4. For CSS searches, avoid dumping long lines:
   - Prefer `rg --max-columns 160`.
   - Exclude isolated asset styles unless needed: `--glob '!*assets.css'`.
   - Prefer `git diff --stat` before full diffs.
5. Verify docs changes with:
   - `pnpm --filter @usmoment/docs-site typecheck`
   - `pnpm --filter @usmoment/docs-site build`
