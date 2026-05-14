# @usmoment/taro

## 0.1.0-alpha.4

### Minor Changes

- 442f9b9: Add public Taro facade exports and docs for FullscreenOptionList and AccountingCategorySelector.

### Patch Changes

- 2e5a07a: Add initial and controlled expression props to AccountingCalculator and document the Web parity updates for accounting Kit components.
- 2583f75: Add Taro-compatible icon exports for Mini Program rendering.
- 6a3899f: Align Popup open-change reasons with implemented overlay-close behavior and document the UI Popup platform coverage update.
- dc68ece: Add the Taro Popup UI primitive and AccountingCalculatorPopup Kit shell for bottom-sheet calculator flows with overlay, safe-area padding, reserved space, animation, and height callbacks.

## 0.0.1-alpha.3

### Patch Changes

- 3108851: Fix AccountingCalculator equals commits for completed expressions, keep committed negative results from showing as active expressions in AccountingDisplay, and prevent empty CalcDisplay expressions from rendering a fallback second line.
- 51ae6e8: Upgrade CalcDisplay into a neutral, themeable slotted display and add AccountingDisplay as the accounting-specific Kit display with currency prefix, note input, and source-inspired amount transitions.

## 0.0.1-alpha.2

### Patch Changes

- 0d059eb: Allow AccountingCalculator to forward BusinessKeyboard props such as vibrate, disabled, ariaLabel, and keyHeight to its internal keyboard.
- adc78f9: Add stable BusinessKeyboard key class hooks for id, action, and variant styling across Taro mini programs and Web.
  Polish AccountingCalculator keyboard spacing, dimensions, and pressed-state styling across Taro and Web presets.

## 0.0.1-alpha.1

### Patch Changes

- Avoid injecting package CSS from bundled JavaScript so Taro webpack5 default prebundle can run without `.wxss.js` runtime references.
- Render keyboard keys with Taro `View` primitives and concrete mini program layout fallbacks so packaged consumers do not depend on generated `Button` templates for core key visibility.
- Match the accounting calculator submit indicator to the source mini program skin with a Taro `rpx` pseudo-element.

## 0.0.1-alpha.0

### Patch Changes

- 38040b7: Initialize the usmoment Taro platform package with bundled headless, UI, and kit capabilities behind a single user-facing entry.
