# Kits Overview And Navigation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a Kits overview page using the UI Components overview pattern, classify current Kits as accounting Kits, shorten only the Kits menu labels, and remove the notes list left indent.

**Architecture:** Reuse the existing `ComponentExplorer` optional overview route instead of adding a Kits-only browser. Keep canonical component names unchanged in detail pages and API copy; add a menu-only display label for sidebar navigation. Keep overview card data in the Kits page wrapper and keep shared rendering in `shared/component-explorer`.

**Tech Stack:** React docs site, TypeScript, CSS modules-by-concern under `docs/site-react/src/styles`, static SVG assets under `docs/site-react/public/assets/component-overview`, Vite docs-site build.

---

## Lessons From UI Components Overview

Use these rules for Kits now and Headless later:

1. Overview is the tab landing page. `/ui-components`, `/kits`, and later `/headless` should open the overview when that layer has one. Detail pages keep `/layer/component-id`.
2. The overview page has no right TOC. It keeps only the shared layer intro and the grouped card grid.
3. Do not add a second explanatory overview header under the shared intro. The layer intro explains the layer; grouped cards do the browsing work.
4. Card width is capped for a future four-column row. Use the existing `component-overview-card` grid/card styles instead of making a new Kits-specific card system.
5. Cards contain image, canonical component name, and a one-line short description. No duplicated category meta and no inner "view component" action.
6. Abstract images should be tiny cacheable SVG files under `docs/site-react/public/assets/component-overview/`. Prefer SVG over generated PNG when the illustration is simple and smaller than a compressed bitmap.
   Follow `docs/architecture/component-overview-illustration-guidelines.md`
   when generating or editing these assets.
7. User-facing docs copy stays bilingual. If a field appears in Chinese, the English branch must also be updated.
8. Canonical API names stay stable. Navigation-only labels can be shortened, but detail titles, imports, API rows, and package exports must keep the real component names.
9. Route and explorer structure changes must update `docs/ai-context/docs-site-map.md`.
10. Verify visually in the in-app browser after each meaningful layout step, then run `git diff --check`, `pnpm --filter @usmoment/docs-site typecheck`, and build if route/assets/docs map changed.

## File Structure

- Modify `docs/site-react/src/shared/component-explorer/types.ts`
  - Add optional `menuLabel?: string` to `ComponentDoc`.
  - Keep `ComponentOverview` and `ComponentOverviewCard` as the shared overview contract.
- Modify `docs/site-react/src/shared/component-explorer/index.tsx`
  - Render `doc.menuLabel ?? doc.name` in the sidebar.
  - Keep detail heading as `selected.name`.
- Modify `docs/site-react/src/shared/component-explorer/component-overview.tsx`
  - Render `doc.menuLabel ?? doc.name` for compact card titles.
  - Generalize `overviewGroupTitle()` so UI groups keep `输入型组件` / `展示型组件`, while Kits groups can show `记账类 Kits` / `Accounting Kits`.
  - Keep card visuals and overview composition here; keep component docs data in the layer docs files.
  - Do not add layer-specific branching outside this file unless a future layer needs different overview behavior.
- Modify `docs/site-react/src/shared/component-explorer/kit-component-docs.tsx`
  - Set all current Kit docs to category `记账类` / `Accounting`.
  - Set menu-only labels:
    - `AccountingDisplay` -> `Display`
    - `AccountingCalculator` -> `Calculator`
    - `AccountingCalculatorPopup` -> `CalculatorPopup`
    - `AccountingCategorySelector` -> `CategorySelector`
- Modify `docs/site-react/src/pages/kits/index.tsx`
  - Add `overview={{ id: "overview", cards: [...] }}`.
  - Use short overview descriptions:
    - zh: `金额显示`, `金额计算器`, `计算器弹层`, `分类选择器`
    - en: `Amount display`, `Amount calculator`, `Calculator popup`, `Category selector`
  - Update the layer intro to describe Kits as scenario composition rather than this page.
- Add SVGs under `docs/site-react/public/assets/component-overview/`
  - `accounting-display.svg`
  - `accounting-calculator.svg`
  - `accounting-calculator-popup.svg`
  - `accounting-category-selector.svg`
- Consult `docs/architecture/component-overview-illustration-guidelines.md`
  before generating or editing overview illustrations.
- Modify `docs/site-react/src/styles/component-page.css`
  - Remove left indent from `.doc-notes`.
  - If needed, add a tiny marker style that does not create left padding.
- Modify `docs/ai-context/docs-site-map.md`
  - Change `/kits` to Kits overview.
  - Mention menu-only labels and the shared overview assets.

---

### Task 1: Add Menu-Only Labels

**Files:**
- Modify: `docs/site-react/src/shared/component-explorer/types.ts`
- Modify: `docs/site-react/src/shared/component-explorer/index.tsx`
- Modify: `docs/site-react/src/shared/component-explorer/kit-component-docs.tsx`

- [ ] **Step 1: Extend the docs type**

Add this optional field to `ComponentDoc`:

```ts
menuLabel?: string;
```

Expected location:

```ts
export type ComponentDoc = {
  id: string;
  name: string;
  menuLabel?: string;
  layer: string;
  category?: string;
  summary: string;
  importSnippet: string;
  metadata?: ComponentMetadata;
  usage?: string[];
  apiTitle: string;
  apiRows: ApiRow[];
  typeSections?: TypeSection[];
  playground?: React.ReactNode;
  typeLinks?: Record<string, string>;
};
```

- [ ] **Step 2: Use menu label in compact navigation**

In `ComponentExplorer`, change only the sidebar label:

```tsx
<span>{doc.menuLabel ?? doc.name}</span>
```

In `ComponentOverviewPanel`, use the same compact label for card titles:

```tsx
<strong>{doc.menuLabel ?? doc.name}</strong>
```

Do not change this detail header:

```tsx
<h3>{selected.name}</h3>
```

- [ ] **Step 3: Add Kits menu labels**

In `getKitComponentDocs`, add `menuLabel` to each Kit doc:

```ts
{
  id: "accounting-display",
  name: "AccountingDisplay",
  menuLabel: "Display",
  layer: "Kit",
  category: zh ? "记账类" : "Accounting",
  // ...
}
```

Use:

```ts
menuLabel: "Calculator"
menuLabel: "CalculatorPopup"
menuLabel: "CategorySelector"
```

- [ ] **Step 4: Verify menu behavior**

Run the docs site if it is not already running:

```bash
pnpm --filter @usmoment/docs-site dev
```

Open:

```text
http://localhost:5173/kits/accounting-display
```

Expected:
- Sidebar group heading is `记账类` in Chinese and `Accounting` in English.
- Sidebar items show `Display`, `Calculator`, `CalculatorPopup`, `CategorySelector`.
- Detail title still shows `AccountingDisplay`.

---

### Task 2: Add Kits Overview

**Files:**
- Modify: `docs/site-react/src/pages/kits/index.tsx`
- Add: `docs/site-react/public/assets/component-overview/accounting-display.svg`
- Add: `docs/site-react/public/assets/component-overview/accounting-calculator.svg`
- Add: `docs/site-react/public/assets/component-overview/accounting-calculator-popup.svg`
- Add: `docs/site-react/public/assets/component-overview/accounting-category-selector.svg`

- [ ] **Step 1: Pass overview data to ComponentExplorer**

Use this shape in `KitsPage`:

```tsx
overview={{
  id: "overview",
  cards: [
    {
      description: isZh(props.locale) ? "金额显示" : "Amount display",
      docId: "accounting-display",
      imageAlt: "AccountingDisplay",
      imageSrc: "/assets/component-overview/accounting-display.svg",
    },
    {
      description: isZh(props.locale) ? "金额计算器" : "Amount calculator",
      docId: "accounting-calculator",
      imageAlt: "AccountingCalculator",
      imageSrc: "/assets/component-overview/accounting-calculator.svg",
    },
    {
      description: isZh(props.locale) ? "计算器弹层" : "Calculator popup",
      docId: "accounting-calculator-popup",
      imageAlt: "AccountingCalculatorPopup",
      imageSrc: "/assets/component-overview/accounting-calculator-popup.svg",
    },
    {
      description: isZh(props.locale) ? "分类选择器" : "Category selector",
      docId: "accounting-category-selector",
      imageAlt: "AccountingCategorySelector",
      imageSrc: "/assets/component-overview/accounting-category-selector.svg",
    },
  ],
}}
```

- [ ] **Step 2: Tune Kits intro copy**

Use layer-level copy, not page-level instructions:

```tsx
description={
  isZh(props.locale)
    ? "Kits 是面向具体产品场景的组合层，负责业务语义、默认皮肤和流程入口，同时保留 Headless 与 UI 的替换空间。"
    : "Kits are scenario-ready composition layers. They own business semantics, default skins, and flow entry points while preserving room to replace Headless logic and UI surfaces."
}
```

Keep title:

```tsx
title={isZh(props.locale) ? "开放式产品流程" : "Open-box product flows"}
```

- [ ] **Step 3: Add tiny SVG assets**

Each SVG should be small, abstract, and reviewable. Keep files under roughly 4 KB each. Use warm `#ffc600` / `#ff6400` accents and no base64.
Use `docs/architecture/component-overview-illustration-guidelines.md` as the
style source of truth.

Suggested visual ideas:
- `accounting-display.svg`: amount display panel with currency dot, expression line, note footer.
- `accounting-calculator.svg`: display strip plus keyboard grid.
- `accounting-calculator-popup.svg`: bottom sheet with display and keyboard hint.
- `accounting-category-selector.svg`: category chips or rounded icon grid with one selected state.

- [ ] **Step 4: Verify overview route**

Open:

```text
http://localhost:5173/kits
```

Expected:
- `/kits` shows the overview, not `AccountingDisplay`.
- No right TOC appears on overview.
- Left sidebar has an Overview section and one grouped `记账类` section.
- Four Kit cards use the shared compact card style.
- Clicking each card navigates to its detail route.

---

### Task 3: Remove Notes Left Indent

**Files:**
- Modify: `docs/site-react/src/styles/component-page.css`

- [ ] **Step 1: Add a focused list rule**

Add near `.doc-block h4`:

```css
.doc-notes {
  display: grid;
  gap: 8px;
  margin: 0;
  padding: 0;
  color: var(--usm-docs-text-muted);
  line-height: 1.7;
  list-style: none;
}
```

- [ ] **Step 2: Preserve readable note separation**

If notes look too plain without bullets, use a subtle top-level marker without creating left padding:

```css
.doc-notes li {
  margin: 0;
}
```

Do not use `padding-left`.

- [ ] **Step 3: Verify detail page**

Open:

```text
http://localhost:5173/kits/accounting-display#section-notes
```

Expected:
- Notes align with the section heading and other content left edge.
- No default bullet indentation remains.

---

### Task 4: Generalize Overview Group Titles

**Files:**
- Modify: `docs/site-react/src/shared/component-explorer/component-overview.tsx`

- [ ] **Step 1: Replace hard-coded group title helper**

Use a mapping that supports current UI and Kits categories:

```ts
function overviewGroupTitle(title: string, locale: Locale) {
  const zh = isZh(locale);

  const labels: Record<string, string> = zh
    ? {
        输入: "输入型组件",
        展示: "展示型组件",
        记账类: "记账类 Kits",
      }
    : {
        Input: "Input surfaces",
        Display: "Display surfaces",
        Accounting: "Accounting Kits",
      };

  return labels[title] ?? title;
}
```

- [ ] **Step 2: Verify UI overview did not regress**

Open:

```text
http://localhost:5173/ui-components
```

Expected:
- UI group titles remain `输入型组件` and `展示型组件` in Chinese.
- UI overview still has no TOC.

---

### Task 5: Update Docs-Site Map

**Files:**
- Modify: `docs/ai-context/docs-site-map.md`

- [ ] **Step 1: Update route inventory**

Change `/kits` from defaulting to first kit to overview:

```md
- `/kits`: Kits overview, grouped card grid for scenario-ready Kit components.
```

- [ ] **Step 2: Update ownership notes**

Add that:
- `pages/kits/index.tsx` owns Kits overview card image mapping.
- `ComponentDoc.menuLabel` is only for compact navigation/overview labels and must not rename canonical component detail headings/imports.
- `public/assets/component-overview/` now contains UI and Kits overview SVGs.

---

### Task 6: Verification

**Files:**
- No new files unless a visual issue found during verification.

- [ ] **Step 1: Browser verification**

Check these routes:

```text
http://localhost:5173/kits
http://localhost:5173/kits/accounting-display
http://localhost:5173/ui-components
```

Expected:
- Kits overview works.
- Kits sidebar labels are shortened only in menu.
- Detail headings/imports/API names are unchanged.
- UI overview still works after shared helper changes.

- [ ] **Step 2: Static checks**

Run:

```bash
git diff --check
pnpm --filter @usmoment/docs-site typecheck
pnpm --filter @usmoment/docs-site build
pnpm check:architecture
```

Expected:
- All commands exit 0.
- Known Vite warnings about third-party `"use client"` directives are acceptable if the build exits 0.

---

## Self-Review

- Spec coverage: The plan covers Kits category/menu display, notes indentation, Kits overview, shared overview conventions, docs-site map, and verification.
- Scope guard: Component names, package exports, APIs, Headless/UI/Kit runtime packages, and docs homepage are intentionally out of scope.
- Reuse guard: The plan reuses `ComponentExplorer` overview routing and card styles from UI Components instead of creating a Kits-only implementation.
