# Icon Library Guidelines

Last updated: 2026-05-11

This document defines the first-phase direction for the `@usmoment/icon`
package and the docs-site `/icons` page. It focuses on third-party SVG icon
selection, source tracking, category rules, and documentation structure.

## Goals

- Build a small, curated icon package for `usmoment` components and product
  flows.
- Prefer selected SVG icons from well-known third-party icon sets instead of
  designing a full custom icon family at the beginning.
- Keep icon usage offline, auditable, and package-friendly.
- Make every packaged icon easy to find, preview, import, and attribute.
- Keep future custom business icons possible without changing the public model.

## Non-Goals

- Do not import a full external icon set into the repository.
- Do not treat `@usmoment/icon` as a brand-logo package.
- Do not rely on runtime iconfont scripts as the default integration path.
- Do not add a dedicated font package in this phase. Font curation belongs to a
  later docs-site assets or typography page.

## Package Direction

`@usmoment/icon` should be an independent publishable package.

Recommended first-phase shape:

```text
packages/icons/
  package.json
  src/
    shared/
      types.ts
      icon-base.tsx
      create-icon.tsx
      taro-icon-base.tsx
      create-taro-icon.tsx
    definitions/
      calendar.ts
      check.ts
    components/
      calendar-icon.tsx
      check-icon.tsx
    metadata.ts
    index.ts
    taro.ts
  THIRD_PARTY_NOTICES.md
```

The package should expose named icon components by default:

```tsx
import { CalendarIcon, CheckIcon } from "@usmoment/icon";

export function Example() {
  return <CalendarIcon size={20} color="currentColor" />;
}
```

Taro Mini Program consumers should use the Taro subpath because native Mini
Program rendering does not support the package's default SVG DOM output:

```tsx
import { CalendarIcon } from "@usmoment/icon/taro";

export function Example() {
  return <CalendarIcon size="40rpx" color="#636363" />;
}
```

The Taro subpath renders encoded SVG data through an `image` node instead of CSS
masking. Pass `color` explicitly in Taro usages because image resources cannot
inherit the surrounding `currentColor`.

A dynamic `<Icon name="calendar" />` API can be considered later, but the first
phase should prioritize named exports because they are easier to type, easier
to tree-shake, and clearer in docs examples.

## Source Policy

Third-party icon search tools such as Icônes, Iconify, and iconfont can be used
as discovery or import sources. Packaged icons must still record the concrete
origin and license of the icon set.

Preferred sources for the first phase:

- Lucide: good default for simple outline UI icons.
- Tabler Icons: broad coverage and consistent outline style.
- Heroicons: useful for common UI actions.
- Material Symbols or Material Icons: acceptable when the Apache-2.0 notice is
  tracked.

Use with caution:

- `iconfont.cn`: only after confirming the concrete project or author license.
- CC BY icon sets: only when attribution can be shown clearly.
- Brand logos: avoid by default because trademark rules may apply separately
  from SVG file licenses.

Avoid in `@usmoment/icon` unless explicitly approved:

- Unknown-license icons.
- Non-commercial-only icons.
- No-derivatives icons.
- GPL/LGPL icon sets.
- Large whole-set imports.

## Required Metadata

Each icon should have metadata that can be used by both the package and the
docs-site page.

```json
{
  "name": "calendar",
  "componentName": "CalendarIcon",
  "category": "date-time",
  "tags": ["calendar", "date", "schedule"],
  "source": {
    "provider": "iconify",
    "collection": "lucide",
    "icon": "calendar",
    "url": "https://icones.js.org/collection/lucide"
  },
  "license": {
    "title": "ISC",
    "spdx": "ISC",
    "url": "https://github.com/lucide-icons/lucide/blob/main/LICENSE"
  }
}
```

Metadata rules:

- `name` is the stable package and docs identifier.
- `componentName` must end with `Icon`.
- `category` must use one of the approved categories below.
- `source` must identify the original collection and icon name when available.
- `license` must be present for every third-party icon.
- `tags` should include common search terms in English. Chinese search aliases
  may be added later if the docs-site search needs them.

## Category Rules

Keep the category system small. New categories should be added only when an icon
does not fit any existing category after considering its actual product use.

Approved first-phase categories:

| Category | Use For | Examples |
| --- | --- | --- |
| `navigation` | Moving through UI or changing hierarchy. | arrow, chevron, menu, back |
| `action` | Direct user commands. | plus, minus, edit, delete, copy, save |
| `feedback` | Status, validation, loading, and system messages. | check, warning, info, error, loading |
| `data` | Lists, filters, charts, sorting, visibility, and structured content. | list, filter, sort, chart, eye |
| `commerce` | Money, bills, accounting, payment, and transaction flows. | wallet, calculator, receipt, bill |
| `moment` | Relationship-centered, memory, family, gifting, and warm product moments. | heart, gift, home, users |
| `device` | Platform, hardware, and environment icons. | phone, desktop, wechat |
| `date-time` | Calendar, schedule, duration, and time-related concepts. | calendar, clock, timer |

Classification rules:

- Classify by product meaning, not by SVG shape.
- Put a reused generic icon in the category of its most common use in
  `usmoment`.
- If an icon is equally useful in multiple areas, choose the more specific
  category and add the other meanings as `tags`.
- Keep `moment` for relationship and memory semantics. Do not put every soft or
  decorative icon there.
- Keep `commerce` for money and transaction semantics. Generic math operations
  such as plus or minus stay in `action`.
- Keep `device` only for platform or hardware concepts, not generic layout.
- Avoid creating `brand` in the first phase.

## Icon Component API

The first-phase icon components should share a small API:

```ts
type IconProps = {
  size?: number | string;
  width?: number | string;
  height?: number | string;
  color?: string;
  renderMode?: "svg" | "mask";
  title?: string;
  className?: string;
  style?: CSSProperties;
};
```

Default behavior:

- `size` defaults to `1em` or the package-level CSS variable.
- `color` defaults to `var(--usm-icon-color, currentColor)` in the default SVG
  entry. Taro image rendering falls back to black when no explicit color is
  passed. In `renderMode="mask"`, `color` does not control the visible paint;
  consumers should use `background`, `backgroundColor`, or CSS classes for the
  mask host.
- `renderMode` defaults to `"svg"`, which means the normal platform rendering
  path: inline SVG on Web and Mini Program-compatible image rendering in Taro.
- `renderMode="mask"` renders a mask host using the same icon definition. The
  icon package still owns the shape only; the consumer or Kit owns the paint,
  such as background color, gradient, size, and pressed-state styling.
- SVG source code must not hardcode visual colors such as hex, rgb, hsl,
  named colors, or embedded gradient stops. Use `currentColor`, package CSS
  variables, or explicit props instead.
- SVG icons should preserve accessible `title` support.
- Decorative icons should be hideable from assistive technology when no title
  is provided.
- Animation props such as `spin` and geometry props such as `rotate` should stay
  out of the first-phase API until a real icon or usage pattern needs them.

Gradient or multi-color icons should stay opt-in. If a future icon truly needs
a gradient, prefer one of these patterns instead of embedding fixed colors in
the SVG:

- CSS-variable slots for simple branded gradients, for example
  `--usm-icon-gradient-from` and `--usm-icon-gradient-to`.
- A typed `gradient` prop for per-render gradients, for example
  `{ from: string; to: string; direction?: "vertical" | "horizontal" }`.
- A `colors` slot map for multi-part icons, for example
  `{ primary?: string; secondary?: string }`.

Do not add gradient APIs to every icon until a real icon requires them. Single
color icons should remain the default. For business-specific gradients, prefer
`renderMode="mask"` plus consumer-owned CSS background styles before adding a
package-level gradient prop.

## Internal Structure

Icon component files should stay thin. Shared rendering behavior belongs in the
package-level shared layer, and SVG asset data belongs in definitions:

```txt
packages/icons/src/
  shared/
    types.ts
    icon-base.tsx
    create-icon.tsx
  definitions/
    backspace.ts
  components/
    backspace-icon.tsx
```

Responsibilities:

- `definitions/*` stores structured SVG asset data such as `viewBox`, original
  dimensions, and child nodes. Do not store SVG strings that must be parsed at
  runtime.
- `shared/icon-base.tsx` owns size, color, accessibility, class name, and SVG
  rendering behavior.
- `shared/create-icon.tsx` turns one definition into one React component.
- `shared/taro-icon-base.tsx` owns the Mini Program-compatible image rendering
  path. It must not render raw `svg` or `path` nodes because Taro's WeChat
  runtime templates do not expose those nodes by default. CSS mask rendering is
  allowed only as an explicit opt-in mode for consumer-owned paint, not as the
  primary rendering path.
- `shared/create-taro-icon.tsx` turns one definition into one Taro-compatible
  React component for the `@usmoment/icon/taro` entry.
- `components/*` binds a definition to `createIcon`; it should not contain
  component-local rendering helpers.
- `taro.ts` binds the same definitions to `createTaroIcon`.

This keeps handwritten icons and future generated icons on the same path.

## Theme Variables

The package may expose CSS variables for shared icon styling:

```css
:root {
  --usm-icon-size: 1em;
  --usm-icon-color: currentColor;
}
```

Component styles should keep these variables neutral and theme-aligned.
Product-specific icon colors or scenario skins belong in Kits or consuming
applications. Add variables such as stroke width or spin duration only when the
runtime package has matching behavior and tests.

## Docs-Site `/icons` Page

The `/icons` page should be more than a placeholder. It should help consumers
discover and use icons without reading package internals.

Required first-phase sections:

- Install command.
- Basic import and usage examples.
- Searchable icon grid.
- Category filters.
- Clickable icon cards that copy JSX usage directly.
- Icon cards should stay compact by default. Source, category, and license
  metadata can be added later in a detail view or expandable panel, but should
  not crowd the first icon browser grid.
- API table for shared icon props.
- Theme variable table.
- Source and license guidance.

Recommended copy formats:

```tsx
import { CalendarIcon } from "@usmoment/icon";
```

```tsx
<CalendarIcon />
```

```tsx
<CalendarIcon size={20} className="my-icon" />
```

Docs-site content must be maintained in both Chinese and English when the
public page is implemented or changed.

## Import Workflow

The preferred workflow is:

```text
Choose icon from Icônes/Iconify/iconfont
  -> confirm icon-set license
  -> normalize SVG
  -> generate icon component
  -> add metadata
  -> update third-party notices
  -> render in docs /icons
```

Manual SVG files provided by maintainers should go through the same metadata
and license checks before entering the package.

## Open Questions

- Choose the first default source set: Lucide or Tabler.
- Decide whether the first package should support both Web and Taro from day
  one, or start with Web-compatible SVG React components and add Taro support
  in a follow-up.
- Decide the first icon batch size. A practical starting range is 24 to 48
  icons across the approved categories.
