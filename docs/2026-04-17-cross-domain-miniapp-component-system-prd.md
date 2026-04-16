# PRD: 跨业务高能力组件系统（Headless + UI + Kits）

- 版本：v0.2
- 日期：2026-04-17
- Owner：Toby
- 周期：MVP 2-4 周（自用优先）
- 主端：Taro

## 1. Executive Summary

- Problem Statement：现有小程序开源组件在复杂交互场景中普遍存在体验粗糙、能力抽象不足的问题；复杂能力通常以整块 UI 交付，难以跨项目、跨平台复用。
- Proposed Solution：建设三层体系 `Headless -> UI -> Kits`，先在 Taro 交付可自用 MVP，再扩展到微信原生与 Native；通过统一契约与门面包导出实现跨平台一致接入。
- Success Criteria：
1. 交互体验达到当前线上版本 >= 90%（对标清单打分）。
2. 核心包单测覆盖率 >= 80%。
3. npm 发布成功，真实项目接入耗时 < 30 分钟。
4. MVP 完成 1 条完整链路（计算键盘）+ 1 个额外 Headless 能力。
5. 输出可被 Agent 消费的组件元数据初版（manifest/schema）。

## 2. User Experience & Functionality

- User Personas：
1. 组件作者（你）：需要把业务中验证过的复杂交互沉淀为长期资产。
2. 项目使用者（你未来自己/外部开发者）：希望按需使用 Headless、UI 或 Kits。
3. Agent 使用者（长期）：希望通过结构化元数据自动完成选型与接入。

- User Stories：
1. As a 组件作者, I want 先实现 Headless 再叠加 UI/Kits, so that 能力可以跨平台复用并保持架构稳定。
2. As a 项目使用者, I want 在 30 分钟内完成接入, so that 能在业务中快速落地组件能力。
3. As a 体验导向开发者, I want 默认视觉与动效接近线上成熟版本, so that 无需大量二次打磨即可使用。
4. As a 平台扩展者, I want 同一能力在 Taro/WX/Native 具有一致领域契约, so that 扩展成本可控。

- Acceptance Criteria：
1. `Headless` 不包含平台渲染节点，仅包含逻辑、状态、事件、类型。
2. `UI` 层按平台独立实现：`ui-taro`、`ui-wx`、`ui-native`。
3. `Kits` 层按平台组合 Headless + UI，提供开箱默认流程。
4. 提供门面导入路径：`@usmoment/taro/*`、`@usmoment/wx/*`、`@usmoment/native/*`。
5. 发布前通过 lint/typecheck/test 与手动体验验收。

- Non-Goals：
1. 不做大而全基础组件库（如完整 Button/Input 套件）。
2. MVP 不同时实现 Taro 与微信原生全功能对齐。
3. MVP 不做可视化主题编辑器。
4. MVP 不承诺 UI/Kits 的 SSR 支持。

## 3. AI System Requirements

- Tool Requirements：
1. `component-manifest.json`：组件用途、输入输出、依赖、平台支持、示例。
2. `capability-schema.json`：Headless 能力契约、事件模型、可组合规则。
3. `recipes/`：任务到组件组合的模板（如“金额输入 + 备注 + 计算预览”）。
4. 文档站搜索与结构化 API 文档（React 官网）。

- Evaluation Strategy：
1. Agent 选型正确率：给定 20 条自然语言任务，正确选包率 >= 85%（Phase 3 目标）。
2. 代码生成可运行率：Agent 生成接入代码首次可运行率 >= 80%。
3. 误用率跟踪：统计错误导入层级（Headless/UI/Kits 选错）并持续下降。
4. 文档可检索性：关键组件文档在 3 次检索内可定位。

## 4. Technical Specifications

- Architecture Overview：
1. 三层模型：
- `Headless`：领域逻辑内核（可跨端复用）。
- `UI`：平台视图实现（Taro/WX/Native 分离）。
- `Kits`：场景编排（开箱即用）。
2. 发包策略：底层多包 + 门面包（Facade）。
- 底层实现包：
  - `@usmoment/headless-core`
  - `@usmoment/ui-taro` `@usmoment/ui-wx` `@usmoment/ui-native`
  - `@usmoment/kit-taro` `@usmoment/kit-wx` `@usmoment/kit-native`
  - `@usmoment/design-tokens`
- 门面包导入：
  - `@usmoment/taro/headless` `@usmoment/taro/ui` `@usmoment/taro/kit`
  - `@usmoment/wx/headless` `@usmoment/wx/ui` `@usmoment/wx/kit`
  - `@usmoment/native/headless` `@usmoment/native/ui` `@usmoment/native/kit`
3. MVP 能力范围：
- 完整链路：计算键盘（`expression-engine + calc-display + calc-keyboard + accounting-calc-kit`）。
- 额外 Headless：`selection-state-core`。
4. 何时创建 Headless（判定规则）：
- 跨平台复用逻辑明确：创建。
- 纯视觉组件/逻辑极薄：不创建，直接 UI。
- 仅组合多个能力：放 Kits。

- Integration Points：
1. Monorepo 目录模板：
```text
packages/
  headless/
    expression-engine/
    selection-state-core/
  ui/
    taro/
    wx/
    native/
  kits/
    taro/
    wx/
    native/
  facades/
    taro/
    wx/
    native/
  design-tokens/
apps/
  playground-taro/
  playground-web/      # React 能力测试场
docs/
  site-react/
```
2. 工程工具建议：`TypeScript`、`Vitest`、`Changesets`、CI 覆盖率门禁。
3. 官网技术选型：React（已确认），承载文档、示例、API 与 recipes。
4. Native 路径：Phase 3 做计算键盘 POC，验证输入体验与性能后再扩展。

- Security & Privacy：
1. 组件库默认不采集用户隐私数据。
2. 计算与状态处理在本地执行，不上传表达式内容。
3. 文档与示例中避免嵌入真实账单敏感信息。
4. 未来若引入遥测，需提供显式开关与匿名化策略。

## 5. Risks & Roadmap

- Phased Rollout：
1. MVP（Week 0-4）
- 完成 Taro 主链路与额外 Headless。
- 完成 npm 发布与真实项目接入验证（<30 分钟）。
- 输出首版文档与导入规范。
2. v1.1（Month 2-3）
- React 官网完善（分层接入、最佳实践、FAQ）。
- 新增第二条完整链路（建议全屏选择器）。
- 建立 breaking change 流程与迁移指南。
3. v2.0（Month 4+）
- Agent 友好元数据完善（manifest/schema/recipes）。
- Native 方向 POC（复用 Headless）。
- 逐步补齐 wx/native UI 与 kits。

- Technical Risks：
1. 风险：层间耦合回流（UI 侵入 Headless）。
- 缓解：分包边界 + 契约测试 + API 审查清单。
2. 风险：多平台扩展过早导致节奏失控。
- 缓解：坚持 Taro-first，wx/native 按阶段推进。
3. 风险：视觉质量不稳定。
- 缓解：设计 tokens + 体验对标清单 + playground 回归。
4. 风险：包数量增长导致认知负担。
- 缓解：门面包统一导入路径，文档给出决策树。

---

## 附录 A：导入规范示例

```ts
// Taro
import { ExpressionEngine } from '@usmoment/taro/headless'
import { CalcKeyboard } from '@usmoment/taro/ui'
import { AccountingCalcKit } from '@usmoment/taro/kit'

// 微信原生
import { ExpressionEngine } from '@usmoment/wx/headless'
import { CalcKeyboard } from '@usmoment/wx/ui'
import { AccountingCalcKit } from '@usmoment/wx/kit'

// Native
import { ExpressionEngine } from '@usmoment/native/headless'
import { CalcKeyboard } from '@usmoment/native/ui'
import { AccountingCalcKit } from '@usmoment/native/kit'
```

## 附录 B：命名建议（可直接采用）

1. scope 建议：`@toby-kit`（示例，可替换）。
2. 层级命名固定：`headless / ui / kit`。
3. 组件命名格式：`<domain>-<component>`，例如 `accounting-calc`、`selection-fullscreen`。
4. Headless 包尽量名词化（`expression-engine`），UI/Kits 保持场景可读性。
