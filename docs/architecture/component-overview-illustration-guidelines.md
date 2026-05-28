# Component Overview Illustration Guidelines

This guide defines the repeatable illustration style for docs-site overview
cards under `docs/site-react/public/assets/component-overview/`.

Use it whenever adding overview cards for UI Components, Kits, Headless, or
future component layers. The goal is not photorealism. The image should be a
small, warm, abstract cue that helps users identify the component role at a
glance while staying consistent with the usmoment docs visual system.

## Ownership

- Overview illustrations are docs-site assets, not package runtime assets.
- Store them as named SVG files under
  `docs/site-react/public/assets/component-overview/`.
- Reference them from the owning layer page, such as
  `docs/site-react/src/pages/ui-components/index.tsx` or
  `docs/site-react/src/pages/kits/index.tsx`.
- Do not inline overview art into CSS, React strings, `data:image`, or base64.
- Keep generated/edited assets reviewable in git.

## Canvas

Every overview SVG should use this document frame:

```svg
<svg xmlns="http://www.w3.org/2000/svg" width="480" height="270" viewBox="0 0 480 270" role="img" aria-labelledby="title desc">
```

Required:

- `width="480"` and `height="270"`
- `viewBox="0 0 480 270"`
- `role="img"`
- A `<title>` and `<desc>` with stable ids referenced by `aria-labelledby`
- A 16:9 composition that fits the card image slot without cropping important
  content
- File size should usually stay below 4 KB

## Palette

Use the warm docs-site palette:

- Background: `#fffaf0`
- Primary warm brush: `#ffc600`
- Focus/accent: `#ff6400`
- Main text or dark stroke: `#27221c`
- Soft border: `#eadbc0`
- Muted surface: `rgba(255,255,255,.72)` to `rgba(255,255,255,.9)`
- Secondary semantic mint: `#96c9bd` or `#9fc8ba`
- Muted structure: `#ede8dd`, `#e7dfd2`, or `rgba(39,34,28,.06)`

Do not introduce new dominant colors for a single card. If a component needs a
new semantic accent, add it to this guide first and use it sparingly.

## Signature Structure

Most illustrations should follow this stack:

1. Warm canvas: a full `#fffaf0` background rectangle.
2. Optional glow: a radial yellow glow near the upper-right area.
3. Brush stroke: a thick yellow swoosh near the lower third, usually behind the
   component shape.
4. Component abstraction: simplified surfaces, grids, panels, or controls.
5. One focused accent: orange outline, selected state, submit button, currency
   dot, or active element.

Recommended shared primitives:

```svg
<defs>
  <radialGradient id="glow" cx="75%" cy="6%" r="74%">
    <stop offset="0" stop-color="#ffc600" stop-opacity=".34"/>
    <stop offset="1" stop-color="#ffc600" stop-opacity="0"/>
  </radialGradient>
</defs>
<rect width="480" height="270" fill="#fffaf0"/>
<rect width="480" height="270" fill="url(#glow)"/>
<path d="M58 204c92 31 217 16 364-20" fill="none" stroke="#ffc600" stroke-width="18" stroke-linecap="round" opacity=".55"/>
```

The brush path may move slightly to fit a component, but keep the same gesture:
left-to-right, low in the frame, broad, soft, and not a hard underline.

## Shape Language

- Use rounded panels, chips, keys, and sheets.
- Use 2 px soft borders for neutral surfaces.
- Use 3-4 px orange strokes only for selected or active elements.
- Use thick rounded strokes for simple data lines or handle bars.
- Prefer abstract UI silhouettes over exact screenshots.
- Keep details sparse: 5-15 visual elements is usually enough.
- Preserve negative space around the main object.
- Avoid nested framed cards inside the art unless the represented component is
  itself a popup, sheet, or panel.

Common dimensions:

- Panel radius: `rx="13"` to `rx="22"`
- Small key radius: `rx="5"` to `rx="8"`
- Pill radius: half height, e.g. `rx="24"` for a 48 px chip
- Border width: `2`
- Active orange outline: `3` or `4`
- Brush stroke width: `18`

## Typography Inside SVGs

Avoid text unless it clarifies the component role, such as calculator numbers,
currency, or amount display.

If text is necessary:

- Use `font-family="Avenir Next, Segoe UI, sans-serif"` for UI labels.
- Use `Iowan Old Style, Georgia, serif` only for large numeric display moments
  that should echo the current `CalcDisplay` illustration.
- Keep text short and abstract. Do not include docs copy, API names, or long
  component names inside SVG art.
- Text should remain decorative/contextual; the card title carries the actual
  component label.

## Layer-Specific Direction

### UI Components

Show neutral primitives and interaction surfaces:

- Keyboard: grid of keys and one warm action key.
- Option list: repeated pills or options, one selected.
- Display: amount/expression panel.
- Popup: bottom sheet or floating panel.

### Kits

Show scenario composition with a recognizable shadow of the real Kit skin,
without turning it into a product screenshot. Compared with UI Components, Kits
may borrow a few source-style cues such as gray accounting panels, yellow
selected category tiles, dark calculator keyboard surfaces, or the component's
real emoji/icon motif.

- AccountingDisplay: amount panel, currency dot, expression hint, note footer.
- AccountingCalculator: gray accounting amount display plus the darker
  accounting keyboard skin and orange submit key.
- AccountingCalculatorPopup: popup/sheet shell with calculator cues.
- AccountingCategorySelector: square gray category tiles, yellow selected tile,
  glow, top-left labels, and a large icon drifting toward the lower-right.

Kit overview art may use small local gradients or filters when they mirror the
real Kit skin, such as the accounting display gradient, key text gradient, or
category selected glow. Keep those effects subtle and local; do not introduce a
new global illustration style.

### Headless

When Headless gets an overview, keep it more abstract than UI/Kits:

- Use state diagrams, token streams, small nodes, or selected-value clusters.
- Do not imply a specific rendered UI unless the Headless capability exists to
  support that UI family.
- Use the same background, glow, and brush so it belongs to the set.

## Generation Prompt Template

When asking an AI tool or another agent to create a new card illustration, start
from this prompt and fill in the bracketed fields:

```text
Create a small hand-authored SVG illustration for a usmoment docs component overview card.

Output only an SVG file, no raster image, no base64, no CSS imports.
Canvas: width 480, height 270, viewBox 0 0 480 270.
Style: warm abstract product UI, soft #fffaf0 background, optional yellow #ffc600 radial glow near top-right, thick low yellow brush stroke, soft white panels with #eadbc0 borders, one restrained #ff6400 accent, optional mint #96c9bd secondary lines.
Composition: simplified UI silhouette for [component name and role], not a screenshot. Keep it sparse, readable at 250px card width, and under roughly 4 KB.
Accessibility: include role img, title, desc, and aria-labelledby.
Avoid: gradients beyond the soft yellow glow, dark themes, stock illustration style, 3D, shadows, large labels, long text, product-specific data, base64, embedded CSS, or new dominant colors.
```

For Kit components with strong existing skins, add:

```text
Keep a recognizable shadow of the real Kit skin: [list 2-3 concrete source cues, such as gray accounting display, dark keyboard panel, yellow selected category tile, large category emoji]. The illustration should still be simplified and readable at card size.
```

## Review Checklist

Before committing a new overview illustration:

- The file is an SVG under `docs/site-react/public/assets/component-overview/`.
- It uses the 480 by 270 canvas and 16:9 viewBox.
- It includes `<title>` and `<desc>`.
- It stays around or below 4 KB unless there is a clear reason.
- It uses the approved warm palette.
- The brush/glow/surface rhythm matches existing overview cards.
- It remains readable at a 250 px card width.
- It does not duplicate the card title or docs copy inside the art.
- It contains no runtime package classes, no `data:image`, and no base64.
- The owning layer page references the asset with a meaningful `imageAlt`.
