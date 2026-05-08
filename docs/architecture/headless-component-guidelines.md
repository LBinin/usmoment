# Headless Component Guidelines

## Purpose

Headless components are the platform-agnostic capability layer of usmoment.
They define reusable logic, state machines, configuration models, event
contracts, and type contracts without rendering nodes.

The goal is to let the same capability power Taro UI today and future WX,
Native, or AI-driven integrations later.

## Rule Levels

- `MUST`: required for every change.
- `SHOULD`: expected default; deviations need a clear reason.
- `MAY`: allowed when useful.

## What Belongs In Headless

Headless components MUST contain only platform-free concerns:

- state transitions
- input normalization
- validation and warnings
- configuration and preset objects
- event payload contracts
- pure helpers
- TypeScript types
- tests for behavior and edge cases

Headless components MUST NOT contain:

- React, JSX, hooks, or ReactNode
- Taro, WeChat Mini Program, Native, browser, or DOM APIs
- class names, styles, visual tokens, animations, or layout rendering
- imports from `@usmoment/ui-*` or `@usmoment/kit-*`
- product-flow orchestration that belongs in Kits

## Directory Layout

Every Headless component MUST live under:

```text
packages/headless/src/components/<component>/
  index.ts
  types.ts          # optional
  __test__/
    index.test.ts
```

Package-level exports MUST be aggregated from:

```text
packages/headless/src/index.ts
```

Do not create separate package folders for individual Headless components.

## API Design

Headless APIs SHOULD prefer structured objects over string-only APIs.

Good:

```ts
createAccountingCalcKeyboardConfig({ submitLabel: "Done" })
resolveBusinessKeyboardConfig({ config, keys, layout, columns })
```

Avoid as the primary API:

```ts
preset="accounting-calc"
```

String names MAY exist as metadata or convenience wrappers, but not as the
only capability contract.

## Warnings, Errors, And Events

Warnings and events SHOULD be structured and stable:

```ts
{
  code: "unknown-key",
  keyId: "memo",
  message: "Keyboard layout references unknown key \"memo\".",
  severity: "warning"
}
```

Event payloads SHOULD include:

- stable action
- source key or source state
- value when relevant
- payload when custom behavior needs extra context

Consumers should not need to parse human-readable messages to understand
behavior.

## Testing Requirements

Every Headless component MUST have colocated tests in `__test__/`.

Behavior changes MUST be test-first unless the user explicitly approves an
exception.

Tests SHOULD cover:

- normal behavior
- malformed input
- empty or incomplete input
- custom configuration
- warning/error output
- immutability or mutation isolation when configs are reused
- backward-compatible behavior when public APIs evolve

## Expression Engine Scope

The current `expression-engine` is a lightweight calculation engine for
business and accounting keyboards.

It MUST support:

- numbers
- decimals
- leading negative numbers
- `+`
- `-`
- `*`
- `/`
- `×`
- `÷`
- multiplication/division precedence
- incomplete input without throwing
- malformed decimal input without throwing

It MUST NOT currently support:

- parentheses
- percent
- functions
- variables
- symbolic expressions

Those features require an explicit product/API decision before implementation.

Expression evaluation MUST NOT use `eval` or `Function`.

Money and decimal arithmetic MUST avoid native floating-point precision bugs.
The current implementation uses `decimal.js` for decimal arithmetic.

## Business Keyboard Core Scope

`business-keyboard-core` owns cross-platform keyboard capability contracts.

It SHOULD include:

- key definitions
- layout definitions
- structured keyboard config
- built-in reusable configs
- custom key merge rules
- layout resolving
- structured warnings
- semantic key events

It MUST NOT include:

- rendered buttons
- class names
- UI density/shape decisions
- platform click/press handlers

## Selection State Core Scope

`selection-state-core` owns reusable single/multi selection behavior.

It is intended for future selector-style components such as category pickers,
tag filters, member selectors, and fullscreen selector kits.

It SHOULD stay small until richer selector requirements are proven.

## Third-Party Dependencies

Headless dependencies MUST be:

- platform-agnostic
- DOM-free
- usable in Node and Mini Program-oriented build pipelines
- small or clearly justified
- maintained enough for production use

Before adding a broad dependency, consider whether a small focused dependency
plus local logic would be safer.

Current accepted example:

- `decimal.js`: used to avoid JavaScript floating-point precision issues in
  expression evaluation.

## Architecture Check

Run:

```bash
pnpm check:architecture
```

This script checks selected hard rules such as forbidden Headless imports,
forbidden expression evaluation APIs, and required component test folders.
