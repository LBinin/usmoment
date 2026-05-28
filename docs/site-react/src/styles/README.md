# Docs Site Styles

This directory keeps docs-site CSS split by ownership so agents and maintainers can read the smallest file needed for a change.

## File Ownership

- `base.css`: global custom properties, document defaults, and root layout.
- `header.css`: sticky header, logo, primary tabs, and locale select.
- `landing.css`: introduction-only homepage.
- `component-page.css`: component docs layout, intro area, side navigation, detail card, and page table of contents.
- `code-block.css`: static code, editable code, copy affordance, and CodeMirror theme glue.
- `api-table.css`: props/type tables, inline code chips, required badges, and type links.
- `playground.css`: shared playground shell, controls, preview stage, output panel, and show-code region.
- `headless-debugger.css`: headless capability debugger interfaces.
- `keyboard-demo.css`: docs-only preview wrappers for keyboard demos.
- `responsive.css`: cross-page responsive overrides.

## Rules

- Keep `styles.css` focused on Tailwind v4 and shadcn setup: Tailwind imports,
  `tw-animate-css`, `shadcn/tailwind.css`, theme token mapping, root shadcn
  variables, and owner-file imports.
- Put new rules in the smallest owner file instead of adding another mixed global section.
- Do not target package runtime classes such as `.usm-*` from docs-site CSS.
- Do not put raw `data:image` or base64 strings in docs-site style files.
- If component assets intentionally stay base64, isolate them in the owning UI or Kit package and reference them from package styles through named CSS variables.
- Prefer named asset files when an asset changes often, needs independent browser caching, or makes an asset CSS file too large to review comfortably.

## Tailwind v4 / shadcn

- Tailwind v4 is wired through `@tailwindcss/vite` in `vite.config.ts`; do not
  add a legacy `tailwind.config.ts` unless a future Tailwind feature truly
  requires it.
- `components.json` intentionally leaves `tailwind.config` empty and points
  shadcn to `src/styles.css`.
- Radix-based shadcn components currently follow the shadcn v4 default
  `radix-ui` umbrella dependency. Prefer staying aligned with generated
  components unless there is a measured dependency-size reason to diverge.

## AI Context Hygiene

Routine searches should skip isolated package asset CSS unless the task is changing the embedded visual asset:

```sh
rg "pattern" docs/site-react/src packages --glob '!*assets.css' --max-columns 160
```
