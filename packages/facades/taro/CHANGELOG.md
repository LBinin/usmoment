# @usmoment/taro

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
