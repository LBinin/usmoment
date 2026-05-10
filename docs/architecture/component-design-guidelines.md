# Component Design Guidelines

This document captures cross-layer component design rules that are broader than
one package. Treat it as the default design guide for new UI and Kit work.

## Layer Boundaries

- `Headless` owns platform-agnostic state, events, configuration, and business
  rules. It must not own rendering or visual skin decisions.
- `UI` owns neutral, reusable visual primitives. UI components may provide
  structure, motion, semantic rendering, accessibility hooks, CSS variables,
  and stable class names, but should avoid product-specific skins.
- `Kits` own scenario-specific composition and product skins. If a component
  needs special backgrounds, strong visual identity, business copy, workflow
  state, or domain input such as accounting notes, place that behavior in a Kit.

## UI Styling Rules

- UI defaults should be neutral and theme-aligned, using the usmoment palette:
  yellow/orange accents with white, gray, and black supporting colors.
- UI components with visible styling should expose CSS variables for important
  tokens such as accent, background, surface, text, muted text, border, radius,
  spacing, and motion when those tokens affect the component skin.
- UI components should expose stable class names for the root and major internal
  regions. When practical, also expose matching `*ClassName` and `*Style` props
  for those regions.
- UI should not hard-code business-specific labels, special product skins, or
  scenario-specific decorative surfaces. Those belong in Kits.
- UI should not infer domain behavior from business syntax. For example, a
  display primitive should not decide that calculator operators mean an
  expression must be visible; Kits can provide those defaults.
- UI slot containers such as `header`, `footer`, and custom node regions should
  stay structural by default. Avoid assigning background, border, margin, or
  padding to slot wrappers unless that spacing is required for the primitive's
  intrinsic layout rather than a product skin.

## Kit Styling Rules

- Kits may provide special visual skins when the skin belongs to a concrete
  scenario, such as an accounting amount panel.
- Kit styling should be scoped to Kit-owned classes and may tune UI component
  CSS variables instead of rewriting UI internals.
- Cross-platform Kit styles should stay visually aligned by default. If Taro
  needs `rpx` or another platform-specific authored value to match Web, document
  it near the Kit CSS with `usm-platform-style-override`.

## Props And Override Priority

When a Kit wraps a UI component:

- Kit props generate the default UI props for the scenario.
- Explicit UI props supplied by the caller take precedence over Kit-generated
  defaults.
- `className` values are merged with the Kit class first and caller class last.
- `style` values are merged with Kit defaults first and caller style last.
- Slot props such as `prefix`, `header`, `footer`, `render*`, or custom node
  props override Kit defaults for the same region.
- Kit slots that accept caller nodes should render those nodes as-is. If a Kit
  needs to expose state to a caller-controlled region, prefer an explicit render
  function such as `(expression, result) => node` over cloning caller elements
  and injecting props implicitly.
- Keep the lower-level UI props available unless they conflict with the Kit's
  core workflow contract.

Example: `AccountingDisplay` may generate a default currency `prefix` and note
`footer`, but an explicit `prefix` or `footer` prop from the caller must replace
those defaults.
