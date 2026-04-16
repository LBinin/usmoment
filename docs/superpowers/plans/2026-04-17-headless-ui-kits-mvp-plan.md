# Headless UI Kits MVP Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 在 2-4 周内完成 `Headless + UI + Kits` 的 Taro-first MVP，并可发布 npm 且在真实项目 30 分钟内接入。

**Architecture:** 采用三层分离架构：`headless` 负责纯能力与状态契约，`ui-taro` 负责渲染与交互，`kit-taro` 负责开箱业务编排。通过 `facades/taro/*` 提供稳定导入路径，后续可平滑扩展到 `wx/native`。

**Tech Stack:** TypeScript, pnpm workspaces, Vitest, Changesets, Taro, React (docs/playground-web)

---

## File Structure Lock (MVP)

- Create: `pnpm-workspace.yaml`
- Create: `package.json`
- Create: `tsconfig.base.json`
- Create: `.gitignore`
- Create: `.changeset/README.md`
- Create: `packages/headless/expression-engine/package.json`
- Create: `packages/headless/expression-engine/src/index.ts`
- Create: `packages/headless/expression-engine/src/engine.ts`
- Create: `packages/headless/expression-engine/src/types.ts`
- Create: `packages/headless/expression-engine/test/engine.test.ts`
- Create: `packages/headless/selection-state-core/package.json`
- Create: `packages/headless/selection-state-core/src/index.ts`
- Create: `packages/headless/selection-state-core/src/selection.ts`
- Create: `packages/headless/selection-state-core/test/selection.test.ts`
- Create: `packages/ui/taro/package.json`
- Create: `packages/ui/taro/src/index.ts`
- Create: `packages/ui/taro/src/calc-keyboard.tsx`
- Create: `packages/ui/taro/src/calc-display.tsx`
- Create: `packages/kits/taro/package.json`
- Create: `packages/kits/taro/src/index.ts`
- Create: `packages/kits/taro/src/accounting-calc-kit.tsx`
- Create: `packages/facades/taro/headless/package.json`
- Create: `packages/facades/taro/headless/src/index.ts`
- Create: `packages/facades/taro/ui/package.json`
- Create: `packages/facades/taro/ui/src/index.ts`
- Create: `packages/facades/taro/kit/package.json`
- Create: `packages/facades/taro/kit/src/index.ts`
- Create: `apps/playground-taro/package.json`
- Create: `apps/playground-taro/src/app.tsx`
- Create: `apps/playground-web/package.json`
- Create: `apps/playground-web/src/main.tsx`
- Create: `apps/playground-web/src/App.tsx`
- Create: `docs/site-react/README.md`
- Create: `docs/component-manifest.json`
- Create: `docs/capability-schema.json`

---

### Task 1: Workspace & Tooling Bootstrap

**Files:**
- Create: `package.json`
- Create: `pnpm-workspace.yaml`
- Create: `tsconfig.base.json`
- Create: `.gitignore`
- Create: `.changeset/README.md`

- [ ] **Step 1: Write workspace root manifests**

```json
{
  "name": "@usmoment/workspace",
  "private": true,
  "version": "0.0.0",
  "packageManager": "pnpm@10.10.0",
  "scripts": {
    "build": "pnpm -r build",
    "test": "pnpm -r test",
    "typecheck": "pnpm -r typecheck",
    "lint": "pnpm -r lint"
  }
}
```

```yaml
packages:
  - "packages/*/*"
  - "packages/facades/*/*"
  - "apps/*"
```

- [ ] **Step 2: Add base TypeScript config**

```json
{
  "compilerOptions": {
    "target": "ES2021",
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "strict": true,
    "declaration": true,
    "declarationMap": true,
    "skipLibCheck": true,
    "jsx": "react-jsx",
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true
  }
}
```

- [ ] **Step 3: Add gitignore and changeset notice**

```gitignore
node_modules
pnpm-lock.yaml
dist
coverage
.turbo
.DS_Store
```

```md
# Changesets

Use `pnpm changeset` for every publishable package change.
```

- [ ] **Step 4: Run install and workspace sanity checks**

Run: `pnpm install`
Expected: install completed with no workspace parsing error.

Run: `pnpm -r --filter ./packages/*/* exec node -v`
Expected: each package path resolves (may show empty before package creation).

- [ ] **Step 5: Commit bootstrap**

```bash
git add package.json pnpm-workspace.yaml tsconfig.base.json .gitignore .changeset/README.md
git commit -m "chore: bootstrap workspace tooling"
```

### Task 2: Headless Expression Engine (TDD First)

**Files:**
- Create: `packages/headless/expression-engine/package.json`
- Create: `packages/headless/expression-engine/src/types.ts`
- Create: `packages/headless/expression-engine/src/engine.ts`
- Create: `packages/headless/expression-engine/src/index.ts`
- Test: `packages/headless/expression-engine/test/engine.test.ts`

- [ ] **Step 1: Write failing tests for expression rules**

```ts
import { describe, expect, it } from 'vitest'
import { createExpressionEngine } from '../src'

describe('expression-engine', () => {
  it('computes addition and subtraction', () => {
    const engine = createExpressionEngine()
    engine.input('1')
    engine.input('+')
    engine.input('2')
    expect(engine.evaluate()).toBe('3')
  })

  it('keeps two decimal precision', () => {
    const engine = createExpressionEngine({ scale: 2 })
    engine.input('0.1')
    engine.input('+')
    engine.input('0.2')
    expect(engine.evaluate()).toBe('0.30')
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm --filter @usmoment/headless-expression-engine test`
Expected: FAIL with module/function not found.

- [ ] **Step 3: Write minimal implementation and exports**

```ts
export type EngineOptions = { scale?: number }

export type ExpressionEngine = {
  input: (token: string) => void
  evaluate: () => string
  expression: () => string
  clear: () => void
}
```

```ts
import type { EngineOptions, ExpressionEngine } from './types'

export function createExpressionEngine(options: EngineOptions = {}): ExpressionEngine {
  const scale = options.scale ?? 2
  let expr = ''

  return {
    input(token) {
      expr += token
    },
    evaluate() {
      const safe = expr.replace(/[^\d+\-.]/g, '')
      const value = Function(`return (${safe || '0'})`)() as number
      return value.toFixed(scale)
    },
    expression() {
      return expr
    },
    clear() {
      expr = ''
    }
  }
}
```

```ts
export * from './types'
export * from './engine'
```

- [ ] **Step 4: Run tests and coverage**

Run: `pnpm --filter @usmoment/headless-expression-engine test -- --coverage`
Expected: PASS with coverage report generated.

- [ ] **Step 5: Commit headless engine**

```bash
git add packages/headless/expression-engine
git commit -m "feat(headless): add expression engine with tests"
```

### Task 3: Headless Selection State Core

**Files:**
- Create: `packages/headless/selection-state-core/package.json`
- Create: `packages/headless/selection-state-core/src/selection.ts`
- Create: `packages/headless/selection-state-core/src/index.ts`
- Test: `packages/headless/selection-state-core/test/selection.test.ts`

- [ ] **Step 1: Write failing tests for single/multi select**

```ts
import { describe, expect, it } from 'vitest'
import { createSelectionState } from '../src'

it('supports single mode', () => {
  const state = createSelectionState({ mode: 'single' })
  state.toggle('food')
  state.toggle('rent')
  expect(state.values()).toEqual(['rent'])
})

it('supports multi mode', () => {
  const state = createSelectionState({ mode: 'multi' })
  state.toggle('food')
  state.toggle('rent')
  expect(state.values()).toEqual(['food', 'rent'])
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm --filter @usmoment/headless-selection-state-core test`
Expected: FAIL due to missing implementation.

- [ ] **Step 3: Implement state core**

```ts
export type SelectionMode = 'single' | 'multi'

export function createSelectionState(input: { mode: SelectionMode }) {
  const selected = new Set<string>()
  return {
    toggle(key: string) {
      if (input.mode === 'single') {
        selected.clear()
        selected.add(key)
        return
      }
      if (selected.has(key)) selected.delete(key)
      else selected.add(key)
    },
    values() {
      return [...selected]
    },
    clear() {
      selected.clear()
    }
  }
}
```

```ts
export * from './selection'
```

- [ ] **Step 4: Run tests**

Run: `pnpm --filter @usmoment/headless-selection-state-core test`
Expected: PASS.

- [ ] **Step 5: Commit selection core**

```bash
git add packages/headless/selection-state-core
git commit -m "feat(headless): add selection state core"
```

### Task 4: UI Taro Components

**Files:**
- Create: `packages/ui/taro/package.json`
- Create: `packages/ui/taro/src/calc-keyboard.tsx`
- Create: `packages/ui/taro/src/calc-display.tsx`
- Create: `packages/ui/taro/src/index.ts`
- Test: `packages/ui/taro/test/ui.test.tsx`

- [ ] **Step 1: Add failing UI render tests**

```tsx
import { describe, expect, it } from 'vitest'
import { CalcKeyboard } from '../src'

describe('CalcKeyboard', () => {
  it('exports component', () => {
    expect(typeof CalcKeyboard).toBe('function')
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm --filter @usmoment/ui-taro test`
Expected: FAIL because files do not exist.

- [ ] **Step 3: Implement minimal UI components**

```tsx
import React from 'react'

export function CalcKeyboard(props: { onPress: (token: string) => void }) {
  const keys = ['1', '2', '3', '+', '-', '.', '0']
  return (
    <div>
      {keys.map((k) => (
        <button key={k} onClick={() => props.onPress(k)}>{k}</button>
      ))}
    </div>
  )
}
```

```tsx
import React from 'react'

export function CalcDisplay(props: { expression: string; result: string; note?: string }) {
  return (
    <div>
      <div>{props.expression}</div>
      <div>{props.result}</div>
      <div>{props.note ?? ''}</div>
    </div>
  )
}
```

```ts
export * from './calc-keyboard'
export * from './calc-display'
```

- [ ] **Step 4: Run tests and typecheck**

Run: `pnpm --filter @usmoment/ui-taro test`
Expected: PASS.

Run: `pnpm --filter @usmoment/ui-taro typecheck`
Expected: PASS.

- [ ] **Step 5: Commit UI taro package**

```bash
git add packages/ui/taro
git commit -m "feat(ui-taro): add calc keyboard and display"
```

### Task 5: Kit Taro Composition + Facade Exports

**Files:**
- Create: `packages/kits/taro/package.json`
- Create: `packages/kits/taro/src/accounting-calc-kit.tsx`
- Create: `packages/kits/taro/src/index.ts`
- Create: `packages/facades/taro/headless/package.json`
- Create: `packages/facades/taro/headless/src/index.ts`
- Create: `packages/facades/taro/ui/package.json`
- Create: `packages/facades/taro/ui/src/index.ts`
- Create: `packages/facades/taro/kit/package.json`
- Create: `packages/facades/taro/kit/src/index.ts`

- [ ] **Step 1: Write failing integration test for kit exports**

```ts
import { describe, expect, it } from 'vitest'
import { AccountingCalcKit } from '../src'

it('exports kit component', () => {
  expect(typeof AccountingCalcKit).toBe('function')
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm --filter @usmoment/kit-taro test`
Expected: FAIL due to missing component.

- [ ] **Step 3: Implement kit and facades**

```tsx
import React, { useMemo, useState } from 'react'
import { createExpressionEngine } from '@usmoment/headless-expression-engine'
import { CalcDisplay, CalcKeyboard } from '@usmoment/ui-taro'

export function AccountingCalcKit() {
  const engine = useMemo(() => createExpressionEngine({ scale: 2 }), [])
  const [expression, setExpression] = useState('')
  const [result, setResult] = useState('0.00')

  return (
    <div>
      <CalcDisplay expression={expression} result={result} />
      <CalcKeyboard
        onPress={(token) => {
          engine.input(token)
          setExpression(engine.expression())
          setResult(engine.evaluate())
        }}
      />
    </div>
  )
}
```

```ts
export * from '@usmoment/headless-expression-engine'
```

```ts
export * from '@usmoment/ui-taro'
```

```ts
export * from '@usmoment/kit-taro'
```

- [ ] **Step 4: Verify facade import paths**

Run: `pnpm -r build`
Expected: build completes and `@usmoment/taro/headless|ui|kit` resolve.

- [ ] **Step 5: Commit kit + facade packages**

```bash
git add packages/kits/taro packages/facades/taro
git commit -m "feat(facade): add taro headless ui kit entrypoints"
```

### Task 6: Playgrounds + Agent Metadata + Release Dry Run

**Files:**
- Create: `apps/playground-taro/package.json`
- Create: `apps/playground-taro/src/app.tsx`
- Create: `apps/playground-web/package.json`
- Create: `apps/playground-web/src/main.tsx`
- Create: `apps/playground-web/src/App.tsx`
- Create: `docs/component-manifest.json`
- Create: `docs/capability-schema.json`

- [ ] **Step 1: Add playground app wiring**

```tsx
import React from 'react'
import { AccountingCalcKit } from '@usmoment/taro/kit'

export default function App() {
  return <AccountingCalcKit />
}
```

```tsx
import React from 'react'
import { createRoot } from 'react-dom/client'
import { AccountingCalcKit } from '@usmoment/taro/kit'

function App() {
  return <AccountingCalcKit />
}

createRoot(document.getElementById('root')!).render(<App />)
```

- [ ] **Step 2: Add initial manifest/schema files**

```json
{
  "components": [
    {
      "name": "AccountingCalcKit",
      "layer": "kit",
      "platforms": ["taro"],
      "dependsOn": ["expression-engine", "calc-display", "calc-keyboard"]
    }
  ]
}
```

```json
{
  "capabilities": [
    {
      "name": "expression-engine",
      "inputs": ["token"],
      "outputs": ["expression", "result"],
      "events": ["onExpressionChange", "onResultChange"]
    }
  ]
}
```

- [ ] **Step 3: Run full verification**

Run: `pnpm lint && pnpm typecheck && pnpm test`
Expected: all pass.

Run: `pnpm changeset status`
Expected: command runs and reports no pending release or pending entries.

- [ ] **Step 4: Manual smoke test**

Run: `pnpm --filter playground-web dev`
Expected: page loads and keyboard interaction updates expression and result.

- [ ] **Step 5: Commit docs + playground + metadata**

```bash
git add apps docs
git commit -m "chore: add playgrounds and agent metadata seed"
```

---

## Sprint 1 (Day-by-Day, 5 Workdays)

- Day 1: 完成 Task 1（workspace）；提交 `chore: bootstrap workspace tooling`。
- Day 2: 完成 Task 2（expression-engine）；提交 `feat(headless): add expression engine with tests`。
- Day 3: 完成 Task 3（selection-state-core）；提交 `feat(headless): add selection state core`。
- Day 4: 完成 Task 4（ui-taro）；提交 `feat(ui-taro): add calc keyboard and display`。
- Day 5: 完成 Task 5 + Task 6（kit/facade/playground/metadata）；提交 2 次并执行全量验收。

---

## Package Naming Registry (MVP)

- `@usmoment/headless-expression-engine`
- `@usmoment/headless-selection-state-core`
- `@usmoment/ui-taro`
- `@usmoment/kit-taro`
- `@usmoment/taro/headless` (facade)
- `@usmoment/taro/ui` (facade)
- `@usmoment/taro/kit` (facade)

---

## Self-Review

1. Spec coverage:
- 已覆盖三层分离（Headless/UI/Kits）、Taro-first、门面导入、Web 测试场、Agent 元数据初版。
- 未覆盖 wx/native 具体实现（符合 PRD 阶段规划，后续阶段执行）。

2. Placeholder scan:
- 已避免 `TBD/TODO/implement later`；所有任务给出明确文件、命令、期望结果。

3. Type consistency:
- 统一使用 `createExpressionEngine`、`AccountingCalcKit`、`onPress` 命名；门面导出与包名保持一致。
