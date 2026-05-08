import { isZh, type Locale } from "../i18n";
import { row } from "./api-table";
import {
  AccountingCalculatorPlayground,
  BusinessKeyboardCorePlayground,
  BusinessKeyboardPlayground,
  CalcDisplayPlayground,
  ExpressionEnginePlayground,
  SelectionStateCorePlayground,
} from "./playgrounds";
import type { ApiRow, ComponentDoc, TypeSection } from "./types";

export function getUiComponentDocs(locale: Locale): ComponentDoc[] {
  const zh = isZh(locale);

  return [
    {
      id: "business-keyboard",
      name: "BusinessKeyboard",
      layer: "UI",
      category: zh ? "输入" : "Input",
      summary: zh
        ? "用于业务输入的 Taro 键盘组件。你可以直接使用内置布局，也可以替换按键、列宽、字体和交互回调。适合金额输入、数字录入和固定操作面板。"
        : "A Taro keyboard component for business input. Use the built-in layout or replace keys, column widths, fonts, and callbacks. It fits amount entry, numeric input, and fixed action panels.",
      importSnippet: `import { BusinessKeyboard } from "@usmoment/taro/ui"
import { createAccountingCalcKeyboardConfig } from "@usmoment/taro/headless"`,
      apiTitle: zh ? "Props" : "Props",
      apiRows: businessKeyboardPropsRows(locale),
      typeSections: businessKeyboardTypeSections(locale),
      playground: <BusinessKeyboardPlayground locale={locale} />,
    },
    {
      id: "calc-display",
      name: "CalcDisplay",
      layer: "UI",
      category: zh ? "展示" : "Display",
      summary: zh
        ? "用于显示计算输入和结果的小组件。它只负责展示表达式、结果和备注，不做计算，适合搭配 expression-engine 或自定义键盘流程。"
        : "A small display component for calculator input and results. It only renders expression, result, and notes, leaving calculation to expression-engine or custom flows.",
      importSnippet: `import { CalcDisplay } from "@usmoment/taro/ui"`,
      apiTitle: "Props",
      apiRows: calcDisplayPropsRows(locale),
      playground: <CalcDisplayPlayground locale={locale} />,
    },
  ];
}

export function getKitComponentDocs(locale: Locale): ComponentDoc[] {
  const zh = isZh(locale);

  return [
    {
      id: "accounting-calculator",
      name: "AccountingCalculator",
      layer: "Kit",
      category: zh ? "记账" : "Accounting",
      summary: zh
        ? "可直接接入的金额计算器。它内置计算逻辑、金融键盘和可选展示区，同时允许替换展示、键盘和回调，方便按业务流程继续扩展。"
        : "A ready-to-use amount calculator. It includes calculation logic, a financial keyboard, and an optional display, while still letting you replace display, keyboard, and callbacks for your own flow.",
      importSnippet: `import { AccountingCalculator } from "@usmoment/taro/kit"`,
      apiTitle: "Props",
      apiRows: accountingCalculatorPropsRows(locale),
      typeSections: businessKeyboardTypeSections(locale),
      playground: <AccountingCalculatorPlayground locale={locale} />,
    },
  ];
}

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

function businessKeyboardPropsRows(locale: Locale): ApiRow[] {
  const zh = isZh(locale);

  return [
    row("config", "BusinessKeyboardConfig", true, zh ? "Headless 提供的键盘配置，是 UI 渲染的事实源。" : "Keyboard definition from headless core; the source of truth for UI rendering."),
    row("keys", "BusinessKeyboardKey[]", false, zh ? "按 id 覆盖或追加 config 中的 key。" : "Custom keys that override or extend config keys by id."),
    row("layout", "BusinessKeyboardLayout", false, zh ? "使用 key id 组成的二维布局覆盖。" : "Custom two-dimensional layout using key ids."),
    row("columns", "number", false, zh ? "渲染行的列数；会影响 span clamp。" : "Column count for rendered rows; also affects span clamping."),
    row("keyHeight", "number | string", false, zh ? "按键高度。number 会转成 px，也可以传 CSS 长度字符串。" : "Key height. Numbers become px; strings are used as CSS lengths.", "60px"),
    row("gap", "number | string", false, zh ? "按键行列间距。number 会转成 px，也可以传 CSS 长度字符串。" : "Gap between rows and columns. Numbers become px; strings are used as CSS lengths."),
    row("rowGap", "number | string", false, zh ? "行间距；不传时跟随 gap。" : "Gap between rows; falls back to gap."),
    row("columnGap", "number | string", false, zh ? "列间距；不传时跟随 gap。" : "Gap between columns; falls back to gap."),
    row("columnWidths", "Array<number | string>", false, zh ? "每一列的视觉宽度。number 会转成 fr，适合右侧操作列更宽等布局。" : "Visual width for each column. Numbers become fr tracks, useful for a wider operator column."),
    row("keyFontFamily", "string", false, zh ? "按键文字字体族。适合金融键盘使用 Montserrat 等数字字体；更细粒度可继续用 keyStyle/keyClassName。" : "Font family for key labels. Useful for numeric business keyboards such as Montserrat; use keyStyle/keyClassName for per-key control."),
    row("vibrate", 'false | "light" | "medium" | "heavy"', false, zh ? "按键点击震动强度；不支持的运行环境会静默降级。" : "Haptic intensity for key press; unsupported runtimes silently degrade.", "false"),
    row("disabled", "boolean", false, zh ? "整体禁用键盘；所有 key 保持展示但不会触发事件。" : "Disables the whole keyboard; keys remain visible but do not fire events.", "false"),
    row("ariaLabel", "string", false, zh ? "键盘 group 的可访问性标签。" : "Accessible label for the keyboard group.", "Business keyboard"),
    row("className", "string", false, zh ? "整体容器 className。" : "Class name for the root container."),
    row("style", "React.CSSProperties", false, zh ? "整体容器 style。" : "Inline style for the root container."),
    row("keyClassName", "string | ((key) => string | undefined)", false, zh ? "按键 className，支持按 key 动态返回。" : "Key class name; may be a function of the resolved key."),
    row("keyStyle", "React.CSSProperties | ((key) => React.CSSProperties | undefined)", false, zh ? "按键 style，支持按 key 动态返回。" : "Key inline style; may be a function of the resolved key."),
    row("renderKey", "(input) => React.ReactNode", false, zh ? "自定义按键内容，默认按钮外壳仍由 BusinessKeyboard 控制。" : "Custom key content while BusinessKeyboard still owns the button shell."),
    row("onKeyPress", "(event: BusinessKeyboardEvent) => void", false, zh ? "用户点击按键时触发的语义事件。" : "Semantic key event fired when a key is pressed."),
  ];
}

function calcDisplayPropsRows(locale: Locale): ApiRow[] {
  const zh = isZh(locale);

  return [
    row("expression", "string", true, zh ? "展示的表达式文本。" : "Expression text to show."),
    row("result", "string", true, zh ? "展示的计算结果文本。" : "Computed result text to show."),
    row("note", "string", false, zh ? "可选辅助说明。" : "Optional supporting note."),
  ];
}

function accountingCalculatorPropsRows(locale: Locale): ApiRow[] {
  const zh = isZh(locale);

  return [
    row("display", '"default" | "none"', false, zh ? "是否渲染默认展示区。" : "Controls whether the default display is rendered.", "default"),
    row("keyboardConfig", "BusinessKeyboardConfig", false, zh ? "覆盖默认金额计算键盘配置。" : "Overrides the default accounting calculator keyboard."),
    row("scale", "number", false, zh ? "计算结果的小数位数。" : "Decimal precision for evaluated results.", "2"),
    row("submitLabel", "string", false, zh ? "默认键盘提交键文案。" : "Submit key label in the default keyboard.", "完成"),
    row("renderDisplay", "(state) => React.ReactNode", false, zh ? "自定义展示区，同时复用 Kit 状态逻辑。" : "Custom display rendering while keeping kit state logic."),
    row("renderKeyboard", "(props) => React.ReactNode", false, zh ? "自定义键盘渲染，同时复用 Kit 生成的 keyboard props。" : "Custom keyboard rendering using generated keyboard props."),
    row("onChange", "(state) => void", false, zh ? "表达式或结果变化后触发。" : "Called after keyboard actions change expression/result."),
    row("onSubmit", "(state) => void", false, zh ? "按提交键时触发。" : "Called when the submit key is pressed."),
  ];
}

function businessKeyboardCoreApiRows(locale: Locale): ApiRow[] {
  const zh = isZh(locale);

  return [
    row("createBusinessKeyboardConfig", "(config) => BusinessKeyboardConfig", true, zh ? "创建平台无关的结构化键盘配置。" : "Creates a structured config object without platform code."),
    row("createAccountingCalcKeyboardConfig", "(options?) => BusinessKeyboardConfig", true, zh ? "创建内置金额计算键盘配置。" : "Creates the built-in accounting calculator keyboard config."),
    row("resolveBusinessKeyboardConfig", "(input) => BusinessKeyboardResolvedConfig", true, zh ? "合并 config、自定义 keys、layout、columns，并输出 rows、flatKeys、warnings。" : "Merges config, custom keys, layout, columns, and returns rows, flatKeys, and warnings."),
    row("createBusinessKeyboardEvent", "(key) => BusinessKeyboardEvent", true, zh ? "从 resolved key 生成 UI/Kits 消费的语义事件。" : "Creates the event payload consumed by UI and Kits from a resolved key."),
  ];
}

function expressionEngineApiRows(locale: Locale): ApiRow[] {
  const zh = isZh(locale);

  return [
    row("createExpressionEngine", "(options?: { scale?: number }) => ExpressionEngine", true, zh ? "创建本地表达式引擎实例。" : "Creates a local expression engine instance."),
    row("input", "(token: string) => void", true, zh ? "追加 token。" : "Appends tokens to the expression."),
    row("backspace", "() => void", true, zh ? "删除最后一个 token。" : "Removes the last token."),
    row("evaluate", "() => string", true, zh ? "计算表达式并返回字符串结果。" : "Evaluates the expression and returns a string result."),
    row("expression", "() => string", true, zh ? "返回当前表达式。" : "Returns the current expression."),
    row("clear", "() => void", true, zh ? "清空表达式。" : "Clears the expression."),
  ];
}

function selectionStateCoreApiRows(locale: Locale): ApiRow[] {
  const zh = isZh(locale);

  return [
    row("createSelectionState", "({ mode: 'single' | 'multi' }) => SelectionState", true, zh ? "创建选择状态控制器。" : "Creates a selection state controller."),
    row("toggle", "(key: string) => void", true, zh ? "切换选择项；single 模式会替换旧值。" : "Toggles a value; single mode replaces the previous value."),
    row("values", "() => string[]", true, zh ? "返回已选择值。" : "Returns selected values."),
    row("clear", "() => void", true, zh ? "清空选择。" : "Clears selected values."),
  ];
}

function businessKeyboardTypeSections(locale: Locale): TypeSection[] {
  const zh = isZh(locale);

  return [
    {
      title: "BusinessKeyboardConfig",
      rows: [
        row("keys", "BusinessKeyboardKey[]", true, zh ? "键集合。resolve 时按 id 建立映射，自定义 keys 可覆盖同 id key。" : "Key collection. Resolve builds an id map, and custom keys can override keys by id."),
        row("layout", "BusinessKeyboardLayout", true, zh ? "二维布局，每个单元格是 key id。" : "Two-dimensional layout; each cell is a key id."),
        row("columns", "number", false, zh ? "列数。不传时从 layout 最大行长度推断。" : "Column count. Inferred from the longest layout row when omitted."),
        row("meta", "{ name?: string; label?: string; category?: string }", false, zh ? "配置元信息，仅用于文档、调试和识别，不参与渲染逻辑。" : "Metadata for docs, debugging, and identification. It does not drive rendering logic."),
      ],
    },
    {
      title: "BusinessKeyboardKey",
      rows: [
        row("id", "string", true, zh ? "稳定唯一 id。layout 通过它引用 key；自定义 key 通过同 id 覆盖。" : "Stable unique id. Layout references keys by id; custom keys override by the same id."),
        row("label", "string", true, zh ? "Headless 层的默认文案。UI 如需 ReactNode，用 renderKey 覆盖。" : "Default text label in Headless. Use renderKey in UI for ReactNode content."),
        row("action", "BusinessKeyboardAction", false, zh ? "语义动作。默认是 input。" : "Semantic action. Defaults to input.", "input"),
        row("value", "string", false, zh ? "输入类 key 的值，例如数字或操作符。" : "Value for input keys, such as a digit or operator."),
        row("variant", '"default" | "number" | "operator" | "primary" | "danger"', false, zh ? "语义视觉变体，UI 可据此渲染样式。" : "Semantic visual variant consumed by UI.", "default"),
        row("span", "number", false, zh ? "跨列数。resolve 时会 clamp 到 1 到 columns。" : "Column span. Resolve clamps it between 1 and columns.", "1"),
        row("disabled", "boolean", false, zh ? "禁用该 key。UI 应保留展示但不触发事件。" : "Disables the key. UI should render it but avoid firing events."),
        row("payload", "unknown", false, zh ? "自定义动作的附加数据。" : "Extra data for custom actions."),
      ],
    },
    {
      title: "BusinessKeyboardLayout",
      rows: [
        row("type", "string[][]", true, zh ? "二维 key id 数组，例如 [[\"7\", \"8\"], [\"0\", \"submit\"]]。" : "A two-dimensional key id array, for example [[\"7\", \"8\"], [\"0\", \"submit\"]]."),
      ],
    },
    {
      title: "BusinessKeyboardResolvedConfig",
      rows: [
        row("keys", "BusinessKeyboardResolvedKey[]", true, zh ? "归一化后的全部 key。" : "All normalized keys."),
        row("rows", "BusinessKeyboardResolvedKey[][]", true, zh ? "按 layout 排列后的渲染行。" : "Renderable rows arranged by layout."),
        row("flatKeys", "BusinessKeyboardResolvedKey[]", true, zh ? "按 layout 顺序展平后的 key。" : "Keys flattened in layout order."),
        row("columns", "number", true, zh ? "最终列数。" : "Final column count."),
        row("warnings", "BusinessKeyboardWarning[]", true, zh ? "结构化 warning 列表。" : "Structured warning list."),
        row("meta", "BusinessKeyboardConfig['meta']", false, zh ? "透传的配置元信息。" : "Forwarded config metadata."),
      ],
    },
    {
      title: "BusinessKeyboardEvent",
      rows: [
        row("key", "BusinessKeyboardResolvedKey", true, zh ? "触发事件的 resolved key。" : "Resolved key that triggered the event."),
        row("action", "BusinessKeyboardAction", true, zh ? "语义动作。" : "Semantic action."),
        row("value", "string", false, zh ? "输入值。" : "Input value."),
        row("payload", "unknown", false, zh ? "自定义数据。" : "Custom data."),
      ],
    },
    {
      title: "BusinessKeyboardWarning",
      rows: [
        row("code", '"unknown-key" | "invalid-span"', true, zh ? "稳定 warning code，使用者不需要解析 message。" : "Stable warning code; consumers should not parse message text."),
        row("keyId", "string", false, zh ? "相关 key id。" : "Related key id."),
        row("message", "string", true, zh ? "给人看的说明。" : "Human-readable message."),
        row("severity", '"warning"', true, zh ? "严重级别。" : "Severity level."),
      ],
    },
  ];
}
