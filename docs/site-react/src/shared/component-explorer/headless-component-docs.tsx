import { isZh, type Locale } from "../i18n";
import {
  businessKeyboardCoreApiRows,
  businessKeyboardTypeSections,
  expressionEngineApiRows,
  selectionStateCoreApiRows,
} from "./component-api-rows";
import { componentMetadata } from "./component-metadata";
import {
  BusinessKeyboardCorePlayground,
  ExpressionEnginePlayground,
  SelectionStateCorePlayground,
} from "./playgrounds";
import type { ComponentDoc } from "./types";

export function getHeadlessComponentDocs(locale: Locale): ComponentDoc[] {
  const zh = isZh(locale);

  return [
    {
      id: "business-keyboard-core",
      name: "business-keyboard-core",
      layer: "Headless",
      category: zh ? "键盘" : "Keyboard",
      summary: zh
        ? "平台无关的键盘规则层。它负责定义按键、解析布局、合并自定义配置并生成语义事件，适合把同一套键盘能力复用到不同 UI 实现。"
        : "A platform-free keyboard rules layer. It defines keys, resolves layouts, merges custom config, and creates semantic events so the same keyboard behavior can power different UI renderers.",
      importSnippet: `import {
  createAccountingCalcKeyboardConfig,
  resolveBusinessKeyboardConfig
} from "@usmoment/headless"`,
      metadata: componentMetadata({
        packageName: "@usmoment/headless",
        sourcePath: "packages/headless/src/components/business-keyboard-core",
      }),
      apiTitle: zh ? "API" : "API",
      apiRows: businessKeyboardCoreApiRows(locale),
      typeSections: businessKeyboardTypeSections(locale),
      playground: <BusinessKeyboardCorePlayground locale={locale} />,
    },
    {
      id: "expression-engine",
      name: "expression-engine",
      layer: "Headless",
      category: zh ? "计算" : "Calculator",
      summary: zh
        ? "用于金额输入的表达式状态和计算逻辑。当前支持数字、小数、加减乘除；不支持括号、百分号、函数或变量。异常输入会被稳定处理。"
        : "Expression state and evaluation logic for amount entry. It supports numbers, decimals, addition, subtraction, multiplication, and division, while excluding parentheses, percent, functions, and variables.",
      importSnippet: `import { createExpressionEngine } from "@usmoment/headless"`,
      metadata: componentMetadata({
        packageName: "@usmoment/headless",
        sourcePath: "packages/headless/src/components/expression-engine",
      }),
      apiTitle: zh ? "API" : "API",
      apiRows: expressionEngineApiRows(locale),
      playground: <ExpressionEnginePlayground locale={locale} />,
    },
    {
      id: "selection-state-core",
      name: "selection-state-core",
      layer: "Headless",
      category: zh ? "选择" : "Selection",
      summary: zh
        ? "单选和多选的状态控制器。它只处理选中值的增删和读取，不绑定 UI，后续可以作为分类选择、标签选择等组件的基础。"
        : "A state controller for single and multiple selection. It only handles selected values, without UI assumptions, making it a base for category pickers, tag pickers, and selector kits.",
      importSnippet: `import { createSelectionState } from "@usmoment/headless"`,
      metadata: componentMetadata({
        packageName: "@usmoment/headless",
        sourcePath: "packages/headless/src/components/selection-state-core",
      }),
      apiTitle: zh ? "API" : "API",
      apiRows: selectionStateCoreApiRows(locale),
      playground: <SelectionStateCorePlayground locale={locale} />,
      usage: zh
        ? [
            "当选择行为需要跨 UI 平台复用时使用它。",
            "当前 MVP 有意保持很小，后续 selector kits 可以在它之上叠加禁用项、分组和搜索。",
          ]
        : [
            "Use this when selection behavior should survive across different UI platforms.",
            "Current MVP keeps it intentionally small; richer selector kits can layer disabled options, groups, and search on top later.",
          ],
    },
  ];
}
