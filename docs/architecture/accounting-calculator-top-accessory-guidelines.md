# AccountingCalculator Top Accessory Guidelines

This document captures component-specific rules for `AccountingCalculator`
top-accessory capsules. These rules are intentionally kept out of the general
component design guide because they describe a business Kit subflow rather than
cross-component architecture.

## Ownership

- `AccountingCalculator` owns the top-accessory shell: capsule activation,
  active item state, rendered-panel retention during close, close callbacks, and
  the outer operation-panel open/close animation.
- Each capsule action owns its own interaction details: native controls, local
  focus state, value-change wiring, content layout, and focused tests.
- Do not patch the shared keyboard body, operation-panel shell, or
  `BusinessKeyboard` internals to work around a single capsule's rendering or
  native-control issue. Reproduce and isolate the issue inside the capsule
  action first.

## Panel Motion

- Opening and closing the whole operation panel belongs to the
  `AccountingCalculator` shell.
- Switching between capsules while the operation panel is already open should
  animate only the actual operation content region owned by that panel.
- The bottom close/return affordance should stay outside capsule-switch content
  animations unless the design explicitly asks for it to move or fade too.

## Native Mini Program Controls

- Native controls such as `Textarea` and `PickerView` can behave differently on
  real devices than in WeChat Developer Tools.
- Focus, keyboard lift, auto-height, scroll, and first-frame layout must be
  verified on a real device before treating a behavior as fixed.
- Text-entry capsules should make the full visible editing surface focus the
  input, not only taps directly on the native input node.
- Reset local focus state on blur so the visible editing surface can focus the
  input again later.
- Avoid hard-coded heights or `onLineChange`-driven sizing in text-entry
  capsules unless measured layout is part of the product requirement. Prefer the
  existing flex/scroll panel structure and keep sizing local to the action.

## Close Semantics

- Native keyboard confirm and operation-panel close are separate actions.
- Confirming text input should not close the operation panel unless the caller
  explicitly wires that behavior.
- Capsule actions should receive and use the shell-provided close callback only
  for explicit close/return affordances.

## File And Test Shape

- New reusable capsule action components should live under
  `packages/kits/taro/src/components/accounting-calculator/action/`.
- Export new action components and types from that directory's `index.ts`.
- Add focused tests for the behavior the action owns, such as selection, focus,
  disabled state, value change, and close-separation.
