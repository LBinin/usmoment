# Site Visual Redesign Design

Date: 2026-05-24
Branch: `codex/site-visual-redesign`

## Goal

Refresh the `docs/site-react` visual system so the site feels like a mature
product documentation and design-system site, while preserving the current
homepage's large-type brand identity.

The redesign should improve clarity, hierarchy, density, and perceived quality
across:

- Homepage
- Kits, UI Components, and Headless component explorer pages
- Icons page
- AI LLMs placeholder page, by inheriting the same page shell when expanded

## Direction

Use the v5 visual direction as the implementation baseline:

- Keep the current homepage large-word treatment, hover behavior, outline text,
  warm grid field, and yellow/orange brand accents.
- Redesign component pages around a compact metadata strip, an improved
  Interactive Lab, and the existing API/import/type sections.
- Redesign the Icons page as a curated icon asset catalog with a denser desktop
  grid.
- Establish shared tokens, controls, and surfaces so page-level CSS stops
  repeating near-identical button, chip, card, table, and panel styles.

## Design Principles

1. Keep docs efficient before decorative.
   Component pages should prioritize scanning, testing, copying, and reading API
   information. Avoid landing-page style sections inside component docs.

2. Let the homepage carry the strongest brand memory.
   The existing `US Moment / COMPONENT / DESIGN` large-type style remains the
   signature visual. Other pages should echo the brand through smaller accents,
   not by repeating the whole hero language.

3. Use brand color as signal, not atmosphere.
   Yellow and orange should mark active states, links, focus, progress, and
   brand moments. Large warm surfaces should be reduced so the site feels less
   beige/orange overall.

4. Prefer precise structure over soft card piles.
   Use controlled borders, compact spacing, subtle surfaces, and clear section
   rhythm. Cards and panels should support content, not become the dominant
   aesthetic.

5. Keep the redesign local to the docs site.
   Runtime component package styles remain in UI/Kit/Icon packages. Docs site
   CSS must not define package runtime classes such as `.usm-*`.

## Page Designs

### Homepage

The homepage remains introduction-only.

Keep:

- Current oversized stacked title treatment.
- Existing `US` filled/outlined contrast and `Moment` orange emphasis.
- Existing `COMPONENT` solid text and `DESIGN` outline text.
- Current warm grid, orbit/spark motif, and brand CTA behavior.

Adjust only as needed for polish:

- Align header and CTA states with the new shared control system.
- Tighten responsive behavior and text fit.
- Keep motion respectful of `prefers-reduced-motion`.

### Component Explorer Pages

This applies to Kits, UI Components, and Headless pages.

The page shell keeps:

- Left component navigation grouped by category where applicable.
- Main content column.
- Right-side page table of contents.

The main content should be restructured around this rhythm:

1. Component header:
   - Eyebrow for layer.
   - Component name.
   - Short summary.
   - Small actions such as copy import or source link when useful.

2. Compact metadata strip:
   - A low-contrast horizontal strip under the header.
   - It should not look like a heavy table or primary module.
   - It should stay compact and avoid becoming a junk drawer.
   - Initial fields:
     - `Source`
     - `LLMs`
     - `Status`
     - `Package`
   - Links should be visible but quiet.
   - Future metadata can be added only when it is useful for integration.

3. Interactive Lab:
   - Replaces the current cramped three-column playground layout.
   - Primary layout:
     - Large preview area.
     - Right-side lightweight controls.
     - Bottom event/code region.
   - Controls, events, and code can use tabs or collapsible areas to avoid
     squeezing the preview.
   - The preview must remain the visual focus.

4. Existing documentation sections:
   - Import
   - API
   - Type sections
   - Notes
   - Future design tokens section if component docs data supports it

Do not add a generic `When to use` block for now.

### Icons Page

The Icons page should feel like a curated icon asset catalog, not a generic card
gallery.

Layout:

- Header with icon-library title, short explanation, and subtle count
  metadata.
- Left-side filter/search panel on desktop.
- Main icon catalog grid.
- API, theme variables, source/license sections should use the same surface and
  table system as component pages.

Grid density:

- Desktop: 6 icons per row where width allows.
- Medium screens: 4 icons per row.
- Small screens: 2 or 1 icons per row depending on available width.

Icon cards:

- Stable dimensions.
- Name truncation for long component names.
- Quiet hover/active states.
- Yellow/orange only for selection or copied feedback.

### AI LLMs Page

Keep the page lightweight for now.

When expanded later, it should use the same docs shell primitives:

- Page intro
- Compact surfaces
- Code/reference blocks
- Links to generated LLM usage files if they exist

## Shared Visual System

### Tokens

Add or refine docs-site tokens in `docs/site-react/src/styles/base.css`:

- Text: primary, secondary, tertiary, inverse.
- Surface: page, panel, panel-subtle, panel-raised.
- Border: default, subtle, strong.
- Accent: yellow, orange, accent-bg, accent-border, accent-text.
- Radius: small, medium, pill.
- Shadow: subtle and raised only.
- Motion: fast, normal, ease-out.
- Focus ring.

### Controls

Unify styling for:

- Header tabs.
- Sidebar component links.
- Buttons.
- Copy buttons.
- Category filters/chips.
- Playground/Lab segmented tabs.
- Inputs and selects.

Controls should share:

- Height scale.
- Border radius.
- Font size and weight.
- Hover, active, selected, disabled, and focus-visible states.

### Surfaces

Unify styling for:

- Component detail containers.
- Metadata strips.
- Lab shell.
- Preview panels.
- Code/event panels.
- API tables.
- Icon catalog cards.
- Right-side TOC.

Surfaces should avoid large soft shadows except where elevation is meaningful.

## Architecture And Ownership

Expected docs-site files:

- `docs/site-react/src/styles/base.css`
- `docs/site-react/src/styles/header.css`
- `docs/site-react/src/styles/landing.css`
- `docs/site-react/src/styles/component-page.css`
- `docs/site-react/src/styles/playground.css`
- `docs/site-react/src/styles/icons-page.css`
- `docs/site-react/src/styles/api-table.css`
- `docs/site-react/src/styles/code-block.css`
- `docs/site-react/src/styles/responsive.css`
- `docs/site-react/src/shared/component-explorer/index.tsx`
- `docs/site-react/src/shared/component-explorer/playground-frame.tsx`
- `docs/site-react/src/shared/component-explorer/component-docs.tsx`
- `docs/site-react/src/pages/icons/index.tsx`

If implementation adds reusable docs-site-only primitives, keep them inside
`docs/site-react/src/shared/` or `docs/site-react/src/shared/component-explorer/`
depending on scope.

Do not move runtime package styling into docs-site CSS.

## Content And Locale Requirements

User-facing docs content, labels, metadata labels, and playground labels must be
updated in both Chinese and English.

Initial metadata label mapping:

- `Source` / `源码`
- `LLMs` / `LLMs`
- `Status` / `状态`
- `Package` / `包`

## Verification Plan

During implementation:

1. Run focused typecheck/build for the docs site:
   - `pnpm --filter @usmoment/docs-site typecheck`
   - `pnpm --filter @usmoment/docs-site build`
2. Visually verify desktop and mobile layouts in browser.
3. Check the homepage still preserves the existing large-type identity.
4. Check component Lab layouts do not squeeze preview/control/event content.
5. Check Icons grid uses 6 columns on wide desktop and degrades cleanly.
6. Run broader checks as appropriate before claiming implementation complete:
   - `pnpm check:architecture`
   - `pnpm test`
   - `pnpm typecheck`
   - `pnpm build`
   - `pnpm lint`

## References

- Vercel Docs: lightweight page TOC, page actions, and continuous reading flow.
- Ant Design component docs: clear component navigation, examples/API rhythm, and
  tokenized control concepts.
