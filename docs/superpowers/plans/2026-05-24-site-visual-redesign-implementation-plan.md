# Site Visual Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement the approved docs-site visual redesign: preserve the existing homepage identity, add compact component metadata, improve the playground into an Interactive Lab, and redesign the Icons page as a denser asset catalog.

**Architecture:** Keep the redesign local to `docs/site-react`. Extend component docs data with a small metadata contract, render that metadata in the existing component explorer, reshape the shared playground shell without changing component package APIs, and update docs-site CSS tokens/surfaces/controls by concern.

**Tech Stack:** React 19, TypeScript, Vite, CSS modules by concern via imported global styles, existing `@usmoment/*` workspace packages.

---

## File Structure

- Modify `docs/site-react/src/shared/component-explorer/types.ts`
  - Add a focused metadata type for component source, LLMs, status, and package.
- Modify `docs/site-react/src/shared/component-explorer/component-docs.tsx`
  - Populate metadata for every current component doc in Chinese and English data generation.
- Modify `docs/site-react/src/shared/component-explorer/index.tsx`
  - Render the compact metadata strip between the component header and content blocks.
  - Keep this file as a container; do not move docs data or playground logic into it.
- Modify `docs/site-react/src/shared/component-explorer/playground-frame.tsx`
  - Reshape `PlaygroundFrame` into an Interactive Lab layout with preview focus, right-side controls, and bottom event/code area.
- Modify `docs/site-react/src/pages/icons/index.tsx`
  - Reorganize the page into an asset-catalog shell with a left filter/search panel and denser icon grid.
- Modify `docs/site-react/src/styles/base.css`
  - Refine docs-site tokens for text, surfaces, borders, focus, radius, shadows, and accents.
- Modify `docs/site-react/src/styles/header.css`
  - Align header controls to the new token/control system without changing navigation behavior.
- Modify `docs/site-react/src/styles/component-page.css`
  - Style component shell, sidebar, detail header, metadata strip, and TOC.
- Modify `docs/site-react/src/styles/playground.css`
  - Style the new Interactive Lab layout and responsive behavior.
- Modify `docs/site-react/src/styles/icons-page.css`
  - Style the asset-catalog layout, compact filter panel, 6-column desktop grid, and responsive grid.
- Modify `docs/site-react/src/styles/api-table.css`, `code-block.css`, and `responsive.css`
  - Align existing tables/code/responsive overrides with the new visual system.

## Task 1: Component Metadata Contract

**Files:**
- Modify: `docs/site-react/src/shared/component-explorer/types.ts`
- Modify: `docs/site-react/src/shared/component-explorer/component-docs.tsx`

- [ ] **Step 1: Add metadata types**

Update `types.ts` so `ComponentDoc` can carry compact docs metadata:

```ts
export type ComponentMetadata = {
  source?: {
    label: string;
    href: string;
  };
  llms?: {
    label: string;
    href: string;
  };
  status?: string;
  packageName?: string;
};

export type ComponentDoc = {
  id: string;
  name: string;
  layer: ComponentLayer;
  category?: string;
  summary: string;
  importSnippet: string;
  metadata?: ComponentMetadata;
  apiTitle: string;
  apiRows: ApiRow[];
  typeSections?: TypeSection[];
  typeLinks?: Record<string, string>;
  usage?: string[];
  playground?: ReactNode;
};
```

- [ ] **Step 2: Add metadata helper**

In `component-docs.tsx`, add a helper near the imports:

```tsx
function componentMetadata(input: {
  packageName: string;
  sourcePath: string;
  status?: string;
  llmsPath?: string;
}): ComponentDoc["metadata"] {
  return {
    llms: input.llmsPath
      ? {
          href: input.llmsPath,
          label: "llms.md",
        }
      : undefined,
    packageName: input.packageName,
    source: {
      href: input.sourcePath,
      label: input.sourcePath.split("/").slice(-2).join("/"),
    },
    status: input.status ?? "Stable",
  };
}
```

- [ ] **Step 3: Populate metadata for current docs**

Add `metadata` to each `ComponentDoc` object. Use package paths that already exist in the repo. Examples:

```tsx
metadata: componentMetadata({
  packageName: "@usmoment/ui-web",
  sourcePath: "packages/ui/web/src/components/calc-display",
}),
```

Use these mappings:

```ts
BusinessKeyboard -> @usmoment/ui-web -> packages/ui/web/src/components/business-keyboard
CalcDisplay -> @usmoment/ui-web -> packages/ui/web/src/components/calc-display
Popup -> @usmoment/ui-web -> packages/ui/web/src/components/popup
FullscreenOptionList -> @usmoment/ui-web -> packages/ui/web/src/components/fullscreen-option-list
AccountingDisplay -> @usmoment/kit-web -> packages/kits/web/src/components/accounting-display
AccountingCalculator -> @usmoment/kit-web -> packages/kits/web/src/components/accounting-calculator
AccountingCalculatorPopup -> @usmoment/kit-web -> packages/kits/web/src/components/accounting-calculator-popup
AccountingCategorySelector -> @usmoment/kit-web -> packages/kits/web/src/components/accounting-category-selector
business-keyboard-core -> @usmoment/headless -> packages/headless/src/components/business-keyboard-core
expression-engine -> @usmoment/headless -> packages/headless/src/components/expression-engine
selection-state-core -> @usmoment/headless -> packages/headless/src/components/selection-state-core
```

Do not invent LLMs paths until files exist. Leave `llmsPath` omitted for now.

- [ ] **Step 4: Verify metadata typing**

Run:

```bash
pnpm --filter @usmoment/docs-site typecheck
```

Expected: PASS with no TypeScript errors.

## Task 2: Compact Metadata Strip Renderer

**Files:**
- Modify: `docs/site-react/src/shared/component-explorer/index.tsx`
- Modify: `docs/site-react/src/styles/component-page.css`
- Modify: `docs/site-react/src/styles/responsive.css`

- [ ] **Step 1: Add metadata labels and renderer**

In `index.tsx`, add this helper above `ComponentExplorer`:

```tsx
function ComponentMetadataStrip(props: {
  doc: ComponentDoc;
  locale: Locale;
}) {
  const metadata = props.doc.metadata;

  if (!metadata) return null;

  const labels = isZh(props.locale)
    ? { llms: "LLMs", packageName: "包", source: "源码", status: "状态" }
    : { llms: "LLMs", packageName: "Package", source: "Source", status: "Status" };

  const items = [
    metadata.source
      ? {
          href: metadata.source.href,
          label: labels.source,
          value: metadata.source.label,
        }
      : null,
    metadata.llms
      ? {
          href: metadata.llms.href,
          label: labels.llms,
          value: metadata.llms.label,
        }
      : null,
    metadata.status
      ? {
          label: labels.status,
          value: metadata.status,
        }
      : null,
    metadata.packageName
      ? {
          label: labels.packageName,
          value: metadata.packageName,
        }
      : null,
  ].filter(Boolean) as Array<{ href?: string; label: string; value: string }>;

  if (items.length === 0) return null;

  return (
    <dl className="component-metadata" aria-label={isZh(props.locale) ? "组件信息" : "Component metadata"}>
      {items.map((item) => (
        <div className="component-metadata__item" key={`${item.label}-${item.value}`}>
          <dt>{item.label}</dt>
          <dd>
            {item.href ? (
              <a href={item.href}>{item.value}</a>
            ) : (
              <code>{item.value}</code>
            )}
          </dd>
        </div>
      ))}
    </dl>
  );
}
```

- [ ] **Step 2: Render the strip**

Place the strip after `component-summary` and before the playground block:

```tsx
<p className="component-summary">{selected.summary}</p>

<ComponentMetadataStrip doc={selected} locale={props.locale} />

{selected.playground ? (
```

- [ ] **Step 3: Style compact metadata**

Add to `component-page.css`:

```css
.component-metadata {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  margin: 20px 0 0;
  border-top: 1px solid var(--usmoment-border-soft);
  border-bottom: 1px solid var(--usmoment-border-soft);
  background: var(--usmoment-surface-subtle);
  color: var(--usmoment-text);
}

.component-metadata__item {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  min-height: 42px;
  border-right: 1px solid var(--usmoment-border-hairline);
  padding: 0 13px;
}

.component-metadata dt,
.component-metadata dd {
  margin: 0;
}

.component-metadata dt {
  color: var(--usmoment-text-tertiary);
  font-size: 12px;
  font-weight: 700;
}

.component-metadata dd {
  min-width: 0;
  color: var(--usmoment-text);
  font-size: 12px;
  font-weight: 800;
}

.component-metadata code,
.component-metadata a {
  color: inherit;
  font: inherit;
  text-decoration: none;
}

.component-metadata a {
  color: var(--usmoment-accent-text);
}

.component-metadata a:hover {
  text-decoration: underline;
  text-underline-offset: 3px;
}
```

- [ ] **Step 4: Add mobile fallback**

Add to `responsive.css` under the `max-width: 760px` block:

```css
.component-metadata {
  display: grid;
}

.component-metadata__item {
  justify-content: space-between;
  border-right: 0;
  border-bottom: 1px solid var(--usmoment-border-hairline);
}

.component-metadata__item:last-child {
  border-bottom: 0;
}
```

- [ ] **Step 5: Verify render**

Run:

```bash
pnpm --filter @usmoment/docs-site typecheck
```

Expected: PASS.

## Task 3: Interactive Lab Layout

**Files:**
- Modify: `docs/site-react/src/shared/component-explorer/playground-frame.tsx`
- Modify: `docs/site-react/src/styles/playground.css`
- Modify: `docs/site-react/src/styles/responsive.css`

- [ ] **Step 1: Update PlaygroundFrame labels**

In `playground-frame.tsx`, keep the public props unchanged. Change the returned shell structure so controls are a right-side panel and event/code content is below:

```tsx
return (
  <div className="playground-shell">
    <div className="playground-lab__header">
      <strong>{zh ? "交互实验室" : "Interactive Lab"}</strong>
      {props.code ? (
        <button
          className="show-code-button"
          onClick={() => setShowCode((value) => !value)}
          type="button"
        >
          <span aria-hidden>{showCode ? "⌃" : "⌄"}</span>
          {showCode ? (zh ? "收起代码" : "Hide Code") : zh ? "显示代码" : "Show Code"}
        </button>
      ) : null}
    </div>
    <div className={props.eventText ? "playground playground--with-output" : "playground"}>
      <div className="playground__stage">{props.children}</div>
      <div className="playground__controls">{props.controls}</div>
    </div>
    {props.eventText ? <pre className="event-log">{props.eventText}</pre> : null}
    {props.code && showCode ? (
      <div className="playground-code-panel">
        <EditableCodeBlock
          language="tsx"
          onChange={(nextValue) => {
            setCodeDraft(nextValue);
            props.onCodeChange?.(nextValue);
          }}
          value={codeDraft}
        />
      </div>
    ) : null}
  </div>
);
```

- [ ] **Step 2: Replace playground grid CSS**

Update `playground.css` so the preview gets most space:

```css
.playground-shell {
  overflow: hidden;
  border: 1px solid var(--usmoment-border-soft);
  border-radius: var(--usmoment-radius-md);
  background: var(--usmoment-panel-strong);
  box-shadow: var(--usmoment-shadow-subtle);
}

.playground-lab__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  min-height: 44px;
  border-bottom: 1px solid var(--usmoment-border-soft);
  padding: 0 14px;
}

.playground-lab__header strong {
  color: var(--usmoment-text);
  font-size: 13px;
}

.playground {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(210px, 260px);
  gap: 0;
  align-items: stretch;
  padding: 0;
}

.playground--with-output {
  grid-template-columns: minmax(0, 1fr) minmax(210px, 260px);
}

.playground__stage {
  min-width: 0;
  min-height: 250px;
  border: 0;
  border-radius: 0;
  padding: 22px;
  background: linear-gradient(180deg, var(--usmoment-panel-strong), var(--usmoment-surface-subtle));
}

.playground__controls {
  display: grid;
  align-content: start;
  gap: 12px;
  border-left: 1px solid var(--usmoment-border-hairline);
  border-right: 0;
  padding: 16px;
  background: var(--usmoment-surface-subtle);
}

.event-log {
  max-height: 180px;
  margin: 0;
  border-width: 1px 0 0;
  border-radius: 0;
  background: var(--usmoment-code-bg);
  color: var(--usmoment-code-text);
}
```

- [ ] **Step 3: Keep show-code button compact**

In `playground.css`, replace the full-width show-code button style with:

```css
.show-code-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  min-height: 30px;
  border: 1px solid var(--usmoment-border-soft);
  border-radius: var(--usmoment-radius-sm);
  padding: 0 10px;
  background: var(--usmoment-panel-strong);
  color: var(--usmoment-text);
  cursor: pointer;
  font-size: 12px;
  font-weight: 800;
}
```

- [ ] **Step 4: Add responsive fallback**

Add to `responsive.css` under the `max-width: 760px` block:

```css
.playground,
.playground--with-output {
  grid-template-columns: 1fr;
}

.playground__controls {
  border-left: 0;
  border-top: 1px solid var(--usmoment-border-hairline);
}
```

- [ ] **Step 5: Verify typecheck**

Run:

```bash
pnpm --filter @usmoment/docs-site typecheck
```

Expected: PASS.

## Task 4: Icons Asset Catalog

**Files:**
- Modify: `docs/site-react/src/pages/icons/index.tsx`
- Modify: `docs/site-react/src/styles/icons-page.css`
- Modify: `docs/site-react/src/styles/responsive.css`

- [ ] **Step 1: Restructure Icons page shell**

In `IconsPage`, keep existing state and filtering logic. Replace the browser section layout with an asset catalog wrapper:

```tsx
<section className="icons-doc-block icons-catalog" aria-labelledby="icons-browser-title">
  <div className="icons-catalog__sidebar">
    <div className="icons-search">
      <label htmlFor="icon-search">{zh ? "搜索" : "Search"}</label>
      <input
        id="icon-search"
        onChange={(event) => setQuery(event.target.value)}
        placeholder={zh ? "名称、组件、标签" : "Name, component, tag"}
        type="search"
        value={query}
      />
    </div>
    <div className="icons-category-bar" aria-label={zh ? "图标分类" : "Icon categories"}>
      <button className={category === "all" ? "is-active" : undefined} onClick={() => setCategory("all")} type="button">
        <span>{zh ? "全部" : "All"}</span>
        <small>{iconEntries.length}</small>
      </button>
      {availableCategories.map((categoryKey) => (
        <button className={category === categoryKey ? "is-active" : undefined} key={categoryKey} onClick={() => setCategory(categoryKey)} type="button">
          <span>{zh ? categoryCopy[categoryKey].zh : categoryCopy[categoryKey].en}</span>
          <small>{iconEntries.filter((icon) => icon.category === categoryKey).length}</small>
        </button>
      ))}
    </div>
  </div>
  <div className="icons-catalog__main">
    <div className="icons-block-heading">
      <p className="component-kicker">Browser</p>
      <h3 id="icons-browser-title">{zh ? "图标浏览" : "Icon Browser"}</h3>
    </div>
    <div className="icons-grid">...</div>
  </div>
</section>
```

Move the existing `icons-grid` map into the `icons-catalog__main` block.

- [ ] **Step 2: Add compact count metadata in hero**

Below the hero paragraph, add a compact stats row:

```tsx
<div className="icons-hero__stats" aria-label={zh ? "图标库统计" : "Icon library stats"}>
  <span><strong>{iconEntries.length}</strong>{zh ? "枚图标" : "Icons"}</span>
  <span><strong>{availableCategories.length}</strong>{zh ? "个分类" : "Categories"}</span>
  <span><strong>API</strong>{zh ? "稳定" : "Stable"}</span>
</div>
```

- [ ] **Step 3: Style 6-column catalog**

In `icons-page.css`, update catalog styles:

```css
.icons-catalog {
  display: grid;
  grid-template-columns: minmax(190px, 220px) minmax(0, 1fr);
  overflow: hidden;
  border: 1px solid var(--usmoment-border-soft);
  border-radius: var(--usmoment-radius-md);
  background: var(--usmoment-panel-strong);
}

.icons-catalog__sidebar {
  border-right: 1px solid var(--usmoment-border-soft);
  padding: 18px 14px;
  background: var(--usmoment-surface-subtle);
}

.icons-catalog__main {
  min-width: 0;
  padding: 20px;
}

.icons-grid {
  display: grid;
  grid-template-columns: repeat(6, minmax(0, 1fr));
  border-top: 1px solid var(--usmoment-border-soft);
  border-left: 1px solid var(--usmoment-border-soft);
  background: var(--usmoment-panel-strong);
}

.icon-card {
  border: 0;
  border-right: 1px solid var(--usmoment-border-soft);
  border-bottom: 1px solid var(--usmoment-border-soft);
  border-radius: 0;
  background: transparent;
}

.icon-card__button {
  min-height: 108px;
}

.icon-card__button > span:not(.icon-card__copied) {
  max-width: 100%;
  font-size: 12px;
}
```

- [ ] **Step 4: Add responsive grid**

In `icons-page.css` media queries:

```css
@media (max-width: 1120px) {
  .icons-grid {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
}

@media (max-width: 760px) {
  .icons-catalog {
    grid-template-columns: 1fr;
  }

  .icons-catalog__sidebar {
    border-right: 0;
    border-bottom: 1px solid var(--usmoment-border-soft);
  }

  .icons-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
```

- [ ] **Step 5: Verify Icons page typecheck**

Run:

```bash
pnpm --filter @usmoment/docs-site typecheck
```

Expected: PASS.

## Task 5: Shared Token And Surface Polish

**Files:**
- Modify: `docs/site-react/src/styles/base.css`
- Modify: `docs/site-react/src/styles/header.css`
- Modify: `docs/site-react/src/styles/api-table.css`
- Modify: `docs/site-react/src/styles/code-block.css`
- Modify: `docs/site-react/src/styles/component-page.css`
- Modify: `docs/site-react/src/styles/playground.css`
- Modify: `docs/site-react/src/styles/icons-page.css`

- [ ] **Step 1: Add refined tokens**

In `base.css`, extend `:root` with:

```css
--usmoment-text-tertiary: #8a8378;
--usmoment-surface-subtle: rgba(247, 245, 238, 0.72);
--usmoment-code-bg: #171f1d;
--usmoment-code-text: #dbece6;
--usmoment-radius-sm: 6px;
--usmoment-radius-md: 8px;
--usmoment-radius-pill: 999px;
--usmoment-shadow-subtle: 0 12px 30px rgba(25, 20, 12, 0.04);
--usmoment-focus: 0 0 0 3px rgba(255, 198, 0, 0.32);
```

- [ ] **Step 2: Preserve homepage identity**

Do not replace the current `.hero h2`, `.hero__word`, `.hero__word--brand`,
`.hero__word--component`, or `.hero__word--design` large-type rules.

Only update `.hero__start` to use `var(--usmoment-radius-md)` if needed.

- [ ] **Step 3: Align focus states**

Add consistent focus-visible rules:

```css
.tab:focus-visible,
.component-link:focus-visible,
.show-code-button:focus-visible,
.icons-category-bar button:focus-visible,
.icon-card__button:focus-visible,
.copy-code-button:focus-visible {
  outline: none;
  box-shadow: var(--usmoment-focus);
}
```

Place this rule in the smallest relevant stylesheet if a shared place becomes too broad.

- [ ] **Step 4: Reduce heavy warm surfaces**

Replace raw `#fff1c3` active backgrounds outside the homepage with `#fff8df` or tokenized `rgba(255, 198, 0, 0.14)` so the docs pages feel less saturated.

- [ ] **Step 5: Verify no docs CSS targets runtime classes**

Run:

```bash
rg -n "\\.usm-" docs/site-react/src/styles
```

Expected: no matches outside comments explaining the rule.

## Task 6: Verification And Browser QA

**Files:**
- No planned source edits unless QA finds a defect.

- [ ] **Step 1: Run docs checks**

Run:

```bash
pnpm --filter @usmoment/docs-site typecheck
pnpm --filter @usmoment/docs-site build
```

Expected: both PASS.

- [ ] **Step 2: Run architecture check**

Run:

```bash
pnpm check:architecture
```

Expected: PASS.

- [ ] **Step 3: Start docs dev server**

Run:

```bash
pnpm dev:docs
```

Expected: Vite serves the docs site on a local URL.

- [ ] **Step 4: Browser verify key pages**

Open the dev server in browser and check:

```text
/
/ui-components/calc-display
/kits/accounting-calculator
/headless/expression-engine
/icons
```

Expected:

- Homepage still has the current large-word identity.
- Component metadata strip is compact and does not dominate the page.
- Interactive Lab preview is not squeezed by controls or event output.
- Icons page uses 6 columns on wide desktop.
- Mobile layout stacks without overlap.

- [ ] **Step 5: Stop dev server**

Stop the Vite session with `Ctrl-C`.

- [ ] **Step 6: Commit implementation**

Run:

```bash
git status --short
git add docs/site-react/src docs/superpowers/plans/2026-05-24-site-visual-redesign-implementation-plan.md
git commit -m "feat(site): refresh docs visual system"
```

Expected: commit succeeds with only docs-site implementation files and this plan.
