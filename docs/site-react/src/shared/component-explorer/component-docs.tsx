import { isZh, type Locale } from "../i18n";
import { row } from "./api-table";
import {
  AccountingCalculatorPlayground,
  AccountingCategorySelectorPlayground,
  AccountingDisplayPlayground,
  BusinessKeyboardCorePlayground,
  BusinessKeyboardPlayground,
  CalcDisplayPlayground,
  ExpressionEnginePlayground,
  FullscreenOptionListPlayground,
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
        ? "用于业务输入的 Web + Taro 键盘组件。你可以直接使用内置布局，也可以替换按键、列宽、字体和交互回调。适合金额输入、数字录入和固定操作面板。"
        : "A Web + Taro keyboard component for business input. Use the built-in layout or replace keys, column widths, fonts, and callbacks. It fits amount entry, numeric input, and fixed action panels.",
      importSnippet: `import { BusinessKeyboard } from "@usmoment/ui-web"
import { createAccountingCalcKeyboardConfig } from "@usmoment/headless"

// Taro mini program
import "@usmoment/taro/style.css"
import { BusinessKeyboard as TaroBusinessKeyboard } from "@usmoment/taro/ui"
import { createAccountingCalcKeyboardConfig as createTaroAccountingCalcKeyboardConfig } from "@usmoment/taro/headless"`,
      usage: zh
        ? [
            "在 Taro 小程序项目中，请在页面入口或全局入口显式引入 @usmoment/taro/style.css。",
            "样式不再由组件 JS 自动注入，以兼容 Taro webpack5 默认 prebundle。",
            "按键会输出 usm-business-keyboard__key--id-*、--action-*、--variant-* class，用于跨端稳定定制样式；小程序端不要依赖 data-* 属性选择器。",
          ]
        : [
            "In Taro mini program projects, explicitly import @usmoment/taro/style.css from a page or app entry.",
            "Styles are not auto-injected from component JS so Taro webpack5 default prebundle can run safely.",
            "Keys emit usm-business-keyboard__key--id-*, --action-*, and --variant-* classes for stable cross-platform styling; avoid data-* attribute selectors in mini programs.",
          ],
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
        ? "用于显示计算输入和结果的中性 UI 基础件。它负责金额、表达式显隐和过渡动效，支持自定义前缀、顶部和底部区域，但不承载业务皮肤。"
        : "A neutral UI primitive for calculator input and results. It owns amount, expression visibility, and transitions, supports custom prefix/header/footer regions, and avoids product-specific skins.",
      importSnippet: `import { CalcDisplay } from "@usmoment/ui-web"

// Taro mini program
import "@usmoment/taro/style.css"
import { CalcDisplay as TaroCalcDisplay } from "@usmoment/taro/ui"`,
      usage: zh
        ? [
            "在 Taro 小程序项目中，请在页面入口或全局入口显式引入 @usmoment/taro/style.css。",
            "prefix、header 和 footer 由业务传入；账单备注输入等业务内容应放在 footer 或 Kit 层，而不是由 CalcDisplay 固定。",
            "默认样式使用主题化 CSS 变量，特殊业务皮肤应放到 Kit 层。",
          ]
        : [
            "In Taro mini program projects, explicitly import @usmoment/taro/style.css from a page or app entry.",
            "Pass business-specific prefix, header, and footer content yourself; note inputs and similar product content belong in footer or a Kit, not in CalcDisplay itself.",
            "The default skin uses theme CSS variables; product-specific skins belong in Kits.",
          ],
      apiTitle: "Props",
      apiRows: calcDisplayPropsRows(locale),
      playground: <CalcDisplayPlayground locale={locale} />,
    },
    {
      id: "popup",
      name: "Popup",
      layer: "UI",
      category: zh ? "展示" : "Display",
      summary: zh
        ? "通用 Web + Taro 弹出层基础件。它负责 portal、底部/顶部/居中弹出、遮罩、占位、安全区、动画和内容高度回调，不绑定键盘或记账业务。"
        : "A generic Web + Taro popup primitive. It owns portal rendering, bottom/top/center placement, overlay, reserved space, safe area padding, animation, and content-height callbacks without binding to keyboard or accounting flows.",
      importSnippet: `import { Popup } from "@usmoment/ui-web"

// Taro mini program
import "@usmoment/taro/style.css"
import { Popup as TaroPopup } from "@usmoment/taro/ui"`,
      usage: zh
        ? [
            "Popup 是受控组件；用 open 和 onOpenChange 与业务状态同步。",
            "Web 默认通过 React portal 渲染到 document.body；Taro 默认通过 RootPortal 渲染到顶层。",
            "reserveSpace 为 true 时使用实际内容高度占位，传 number 时按 px 直接占位。",
            "onContentHeightChange 返回 px 高度，包含 safeAreaInsetBottom 后的最终内容高度，不包含遮罩或占位节点。",
          ]
        : [
            "Popup is controlled; sync it with product state through open and onOpenChange.",
            "Web renders to document.body through a React portal by default; Taro renders to the top layer through RootPortal by default.",
            "reserveSpace=true reserves the measured content height, while a number reserves that px value directly.",
            "onContentHeightChange reports px height for the final content area including safeAreaInsetBottom, excluding overlay and placeholder nodes.",
          ],
      apiTitle: "Props",
      apiRows: popupPropsRows(locale),
      typeSections: popupTypeSections(locale),
    },
    {
      id: "fullscreen-option-list",
      name: "FullscreenOptionList",
      layer: "UI",
      category: zh ? "输入" : "Input",
      summary: zh
        ? "Web + Taro UI 层的中性全屏 option grid。它只渲染 flat option list 和受控单选状态，适合分类、标签或入口选择等业务继续组合。"
        : "A neutral full-screen option grid for the Web and Taro UI layers. It renders only a flat option list and controlled single selection so products can compose categories, tags, or entry pickers around it.",
      importSnippet: `import { FullscreenOptionList } from "@usmoment/ui-web"

// Taro mini program
import "@usmoment/taro/style.css"
import { FullscreenOptionList as TaroFullscreenOptionList } from "@usmoment/taro/ui"`,
      usage: zh
        ? [
            "UI 层统一称为 option；分类、账本等业务命名应放在 Kit 或调用方。",
            "它不提供滚动容器，不处理键盘顶起，也不会自动滚动到选中项；这些页面行为由业务层控制。",
            "使用 selectedKey + onChange 做受控单选；需要自定义内容时传 renderOption。",
            "Web 版 option 使用 button 语义并提供 aria-pressed；Taro 版使用 View，但事件和 class hooks 与 Web 保持一致。",
          ]
        : [
            "The UI layer uses option naming; business terms such as category or ledger belong in Kits or caller code.",
            "It does not provide a scroll container, keyboard lift handling, or auto-scroll to the selected item; those page behaviors stay product-owned.",
            "Use selectedKey + onChange for controlled single selection, and pass renderOption when custom content is needed.",
            "The Web version renders options as semantic buttons with aria-pressed; the Taro version uses View, while events and class hooks stay aligned.",
          ],
      apiTitle: "Props",
      apiRows: fullscreenOptionListPropsRows(locale),
      typeSections: fullscreenOptionListTypeSections(locale),
      playground: <FullscreenOptionListPlayground locale={locale} />,
    },
  ];
}

export function getKitComponentDocs(locale: Locale): ComponentDoc[] {
  const zh = isZh(locale);

  return [
    {
      id: "accounting-display",
      name: "AccountingDisplay",
      layer: "Kit",
      category: zh ? "记账" : "Accounting",
      summary: zh
        ? "记账金额显示面板。它基于 CalcDisplay，提供账单金额皮肤、默认货币前缀和备注输入，同时保留 CalcDisplay 的所有显示扩展能力。"
        : "An accounting amount display panel. It builds on CalcDisplay with the accounting amount skin, default currency prefix, and note input while keeping CalcDisplay extension props.",
      importSnippet: `import "@usmoment/taro/style.css"
import { AccountingDisplay } from "@usmoment/taro/kit"`,
      usage: zh
        ? [
            "用于只需要账单金额显示区、但不需要完整键盘计算器的场景。",
            "Kit props 会生成默认 prefix 和 footer；显式传入 prefix、footer、className、style 等 CalcDisplay props 时，以用户传入值优先。",
          ]
        : [
            "Use it when you need the accounting amount display without the full calculator keyboard.",
            "Kit props generate default prefix and footer content; explicit CalcDisplay props such as prefix, footer, className, and style take precedence.",
          ],
      apiTitle: "Props",
      apiRows: accountingDisplayPropsRows(locale),
      playground: <AccountingDisplayPlayground locale={locale} />,
      typeLinks: {
        CalcDisplayProps: "/ui-components/calc-display#section-api",
      },
    },
    {
      id: "accounting-calculator",
      name: "AccountingCalculator",
      layer: "Kit",
      category: zh ? "记账" : "Accounting",
      summary: zh
        ? "可直接接入的金额计算器。它内置计算逻辑、金融键盘和可选展示区，同时允许替换展示、键盘和回调，方便按业务流程继续扩展。"
        : "A ready-to-use amount calculator. It includes calculation logic, a financial keyboard, and an optional display, while still letting you replace display, keyboard, and callbacks for your own flow.",
      importSnippet: `import "@usmoment/taro/style.css"
import { AccountingCalculator } from "@usmoment/taro/kit"`,
      usage: zh
        ? [
            "在 Taro 小程序项目中，请在页面入口或全局入口显式引入 @usmoment/taro/style.css。",
            "这可以避免依赖包 CSS 被 Taro webpack5 prebundle 变成运行时 .wxss.js 引用。",
            "默认使用内部表达式状态；传 defaultExpression 可设置初始值，传 expression + onExpressionChange 可接入受控表单。",
            "当表达式完整时，点击等于号会把计算结果确认为新的输入值；表达式不完整时点击等于号不会改变当前输入。",
          ]
        : [
            "In Taro mini program projects, explicitly import @usmoment/taro/style.css from a page or app entry.",
            "This avoids dependency CSS being turned into runtime .wxss.js references by Taro webpack5 prebundle.",
            "It uses internal expression state by default; pass defaultExpression for an initial value, or expression + onExpressionChange for controlled forms.",
            "When the expression is complete, pressing equals commits the calculated result as the next input value. Incomplete expressions are left unchanged.",
          ],
      apiTitle: "Props",
      apiRows: accountingCalculatorPropsRows(locale),
      typeSections: businessKeyboardTypeSections(locale),
      playground: <AccountingCalculatorPlayground locale={locale} />,
      typeLinks: {
        BusinessKeyboardProps: "/ui-components/business-keyboard#section-api",
      },
    },
    {
      id: "accounting-calculator-popup",
      name: "AccountingCalculatorPopup",
      layer: "Kit",
      category: zh ? "记账" : "Accounting",
      summary: zh
        ? "Web + Taro 的记账计算器底部弹出层外壳。它预设占位、安全区、遮罩和记账键盘弹层皮肤，但 children 仍由业务传入，通常放置 AccountingCalculator。"
        : "A Web + Taro bottom popup shell for accounting calculator flows. It presets reserved space, safe area padding, overlay, and the accounting keyboard popup skin, while keeping children caller-owned, usually an AccountingCalculator.",
      importSnippet: `import {
  AccountingCalculator,
  AccountingCalculatorPopup
} from "@usmoment/kit-web"

// Taro mini program
import "@usmoment/taro/style.css"
import {
  AccountingCalculator as TaroAccountingCalculator,
  AccountingCalculatorPopup as TaroAccountingCalculatorPopup
} from "@usmoment/taro/kit"`,
      usage: zh
        ? [
            "AccountingCalculatorPopup 不接收 AccountingCalculatorProps；请把 AccountingCalculator 作为 children 传入。",
            "默认 reserveSpace、safeAreaInsetBottom 和遮罩都已开启，适合页面内唤起金额键盘并把内容顶上去。",
            "页面滚动到选中分类、保存账单和输入态关闭仍由业务层控制。",
          ]
        : [
            "AccountingCalculatorPopup does not accept AccountingCalculatorProps; pass AccountingCalculator as children.",
            "reserveSpace, safeAreaInsetBottom, and overlay are enabled by default so amount keyboards can push page content up.",
            "Scrolling to a selected category, saving a bill, and closing input state remain product-owned.",
          ],
      apiTitle: "Props",
      apiRows: accountingCalculatorPopupPropsRows(locale),
      typeLinks: {
        PopupProps: "/ui-components/popup#section-api",
      },
    },
    {
      id: "accounting-category-selector",
      name: "AccountingCategorySelector",
      layer: "Kit",
      category: zh ? "记账" : "Accounting",
      summary: zh
        ? "Web + Taro Kit 层的账本分类选择器。它基于 FullscreenOptionList 组合 category 语义，默认复刻旧版账本分类的黄色选中态和 icon 动画，但真实分类数据仍由业务层传入。"
        : "A Web + Taro Kit accounting category selector. It builds category semantics on FullscreenOptionList and defaults to the legacy accounting yellow selected state plus icon animation, while real category data remains caller-supplied.",
      importSnippet: `import { AccountingCategorySelector } from "@usmoment/kit-web"

// Taro mini program
import "@usmoment/taro/style.css"
import { AccountingCategorySelector as TaroAccountingCategorySelector } from "@usmoment/taro/kit"`,
      usage: zh
        ? [
            "Kit 层统一称为 category；不要把业务分类文案或真实分类数据内置进组件。",
            "categories 由业务层传入，组件只负责展示、选中态和事件转发。",
            "页面滚动、键盘顶起和自动定位选中分类仍由业务层控制。",
          ]
        : [
            "The Kit layer uses category naming; do not bake product copy or real category data into the component.",
            "categories are supplied by the product layer; the component only owns rendering, selected state, and event forwarding.",
            "Page scrolling, keyboard lift, and auto-positioning the selected category remain product-owned.",
          ],
      apiTitle: "Props",
      apiRows: accountingCategorySelectorPropsRows(locale),
      typeSections: accountingCategorySelectorTypeSections(locale),
      playground: <AccountingCategorySelectorPlayground locale={locale} />,
      typeLinks: {
        FullscreenOptionList: "/ui-components/fullscreen-option-list#section-api",
      },
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
    row("columnWidths", "number[]", false, zh ? "每一列的视觉权重，适合右侧操作列更宽等布局。" : "Visual weight for each column, useful for a wider operator column."),
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
    row("prefix", "React.ReactNode", false, zh ? "金额前缀，由业务传入货币符号、图标或自定义节点。" : "Amount prefix supplied by the product, such as a currency symbol, icon, or custom node."),
    row("header", "React.ReactNode", false, zh ? "显示器顶部扩展区域。" : "Optional top region inside the display."),
    row("footer", "React.ReactNode", false, zh ? "显示器底部扩展区域，适合放备注输入等业务内容。" : "Optional bottom region, useful for product content such as note input."),
    row("expressionVisible", "boolean", false, zh ? "控制非空表达式显隐；不传时默认隐藏，表达式为空时始终隐藏。" : "Controls non-empty expression visibility; hidden by default, and always hidden when expression is empty."),
    row("shouldShowExpression", "(expression: string) => boolean", false, zh ? "自定义表达式显隐判断；expressionVisible 优先级更高。UI 层不内置计算器 operator 规则。" : "Custom expression visibility rule; expressionVisible takes precedence. UI does not bake in calculator operator rules."),
    row("animated", "boolean", false, zh ? "是否启用金额缩放和表达式淡入过渡。" : "Controls result scale and expression fade transitions.", "true"),
    row("className", "string", false, zh ? "整体容器 className。" : "Class name for the root container."),
    row("style", "React.CSSProperties", false, zh ? "整体容器 style。" : "Inline style for the root container."),
    row("*ClassName / *Style", "string / React.CSSProperties", false, zh ? "主要层级扩展：body、content、prefix、result、expression、header、footer。" : "Main region extension props: body, content, prefix, result, expression, header, and footer."),
  ];
}

function popupPropsRows(locale: Locale): ApiRow[] {
  const zh = isZh(locale);

  return [
    row("open", "boolean", true, zh ? "是否显示弹出层。Popup 是受控组件。" : "Controls popup visibility. Popup is a controlled component."),
    row("children", "React.ReactNode", false, zh ? "弹出内容。" : "Popup content."),
    row("placement", '"bottom" | "top" | "center"', false, zh ? "弹出位置。" : "Popup placement.", "bottom"),
    row("portal", "boolean", false, zh ? "是否通过平台 portal 渲染到顶层。Web 使用 React portal，Taro 使用 RootPortal。" : "Renders through the platform portal when enabled. Web uses a React portal; Taro uses RootPortal.", "true"),
    row("reserveSpace", "boolean | number", false, zh ? "是否在原位置保留占位。true 使用实测内容高度，number 按 px 直接占位。" : "Reserves space at the original location. true uses measured content height; number reserves that px value.", "false"),
    row("safeAreaInsetBottom", "boolean", false, zh ? "底部弹出时给内容增加系统安全区 padding。" : "Adds system safe-area bottom padding for bottom popups.", "false"),
    row("animated", "boolean", false, zh ? "是否启用进入/离开动画。" : "Enables enter and leave animations.", "true"),
    row("duration", "number", false, zh ? "动画时长，单位 ms。" : "Animation duration in milliseconds.", "240"),
    row("overlay", "boolean | PopupOverlayOptions", false, zh ? "遮罩配置；false 或不传时不渲染遮罩。" : "Overlay configuration. false or omitted disables the overlay.", "false"),
    row("zIndex", "number", false, zh ? "弹出层 z-index。" : "Popup z-index."),
    row("onOpenChange", "(open, reason) => void", false, zh ? "请求显隐变化时触发，例如点击可关闭遮罩。" : "Called when the popup requests a visibility change, such as clicking a closable overlay."),
    row("onContentHeightChange", "(height: number) => void", false, zh ? "内容高度变化时触发，height 为 px，不包含遮罩和占位。" : "Called when content height is measured. height is px and excludes overlay and placeholder."),
    row("onAfterOpen", "() => void", false, zh ? "打开动画结束后触发；animated=false 时立即触发。" : "Called after the enter animation; fires immediately when animated=false."),
    row("onAfterClose", "() => void", false, zh ? "关闭动画结束并卸载内容后触发；animated=false 时立即触发。" : "Called after the leave animation and content unmount; fires immediately when animated=false."),
    row("*ClassName / *Style", "string / React.CSSProperties", false, zh ? "主要层级扩展：root、content、placeholder、overlay。" : "Main region extension props: root, content, placeholder, and overlay."),
  ];
}

function popupTypeSections(locale: Locale): TypeSection[] {
  const zh = isZh(locale);

  return [
    {
      title: "PopupOverlayOptions",
      rows: [
        row("visible", "boolean", false, zh ? "是否渲染遮罩。" : "Whether the overlay is rendered.", "true"),
        row("closeOnClick", "boolean", false, zh ? "点击遮罩时是否请求关闭。" : "Requests close when the overlay is clicked.", "true"),
        row("className", "string", false, zh ? "遮罩 className。" : "Overlay class name."),
        row("style", "React.CSSProperties", false, zh ? "遮罩内联样式。" : "Overlay inline style."),
      ],
    },
    {
      title: "PopupOpenChangeReason",
      rows: [
        row("type", '"overlay-click"', true, zh ? "显隐变化请求来源。当前只会在点击可关闭遮罩时主动请求关闭。" : "Visibility-change request reason. Currently emitted only when a closable overlay is clicked."),
      ],
    },
  ];
}

function fullscreenOptionListPropsRows(locale: Locale): ApiRow[] {
  const zh = isZh(locale);

  return [
    row("options", "FullscreenOptionListOption[]", true, zh ? "flat option 列表。UI 层只处理 option，不引入分类或账本语义。" : "Flat option list. The UI layer only handles options and avoids category or ledger semantics."),
    row("selectedKey", "string", false, zh ? "当前选中的 option key。组件是受控单选，不维护内部选中状态。" : "Currently selected option key. The component is controlled single-select and does not own internal selection state."),
    row("columns", "number", false, zh ? "网格列数。" : "Grid column count.", "4"),
    row("renderOption", "(input) => React.ReactNode", false, zh ? "自定义 option 内容；默认外层 option 按钮和状态 class 仍由组件控制。" : "Custom option content while the outer option button and state classes remain component-owned."),
    row("onChange", "(event) => void", false, zh ? "点击未禁用且未选中的 option 时触发，用于更新受控 selectedKey。" : "Called when an enabled, unselected option is clicked so callers can update controlled selectedKey."),
    row("onOptionClick", "(event) => void", false, zh ? "点击未禁用 option 时触发；即使点击当前选中项也会触发。" : "Called when an enabled option is clicked, including the currently selected option."),
    row("className", "string", false, zh ? "整体容器 className。" : "Class name for the root container."),
    row("style", "React.CSSProperties", false, zh ? "整体容器 style。" : "Inline style for the root container."),
    row("gridClassName", "string", false, zh ? "网格区域 className。" : "Class name for the grid region."),
    row("gridStyle", "React.CSSProperties", false, zh ? "网格区域内联样式。" : "Inline style for the grid region."),
    row("optionClassName", "string | ((input) => string | undefined)", false, zh ? "option 节点 className，支持按 option、选中态、禁用态和 index 动态返回。" : "Option node class name; may be resolved from option, selected state, disabled state, and index."),
    row("optionStyle", "React.CSSProperties | ((input) => React.CSSProperties | undefined)", false, zh ? "option 节点内联样式，支持动态返回。" : "Option node inline style; may be resolved dynamically."),
  ];
}

function fullscreenOptionListTypeSections(locale: Locale): TypeSection[] {
  const zh = isZh(locale);

  return [
    {
      title: "FullscreenOptionListOption",
      rows: [
        row("key", "string", true, zh ? "稳定唯一 key，用于受控选中和事件回传。" : "Stable unique key used for controlled selection and events."),
        row("disabled", "boolean", false, zh ? "禁用该 option；禁用项不触发 onChange 或 onOptionClick。" : "Disables the option; disabled options do not fire onChange or onOptionClick."),
        row("data", "unknown", false, zh ? "调用方附加数据，供 renderOption 或事件消费。" : "Caller-owned extra data for renderOption or event consumers."),
      ],
    },
    {
      title: "FullscreenOptionListOptionInput",
      rows: [
        row("option", "FullscreenOptionListOption", true, zh ? "当前渲染的 option。" : "The option being rendered."),
        row("selected", "boolean", true, zh ? "该 option 是否等于 selectedKey。" : "Whether this option matches selectedKey."),
        row("disabled", "boolean", true, zh ? "该 option 是否禁用。" : "Whether this option is disabled."),
        row("index", "number", true, zh ? "在 flat options 数组中的索引。" : "Index in the flat options array."),
      ],
    },
    {
      title: "FullscreenOptionListChangeEvent",
      rows: [
        row("key", "string", true, zh ? "被请求选中的 option key。" : "Option key requested for selection."),
        row("option", "FullscreenOptionListOption", true, zh ? "被点击的 option。" : "Clicked option."),
        row("nativeEvent", "unknown", false, zh ? "平台宿主传入的原始点击事件；Web 为 button click，Taro 为 View click。" : "Original click event from the platform host; button click on Web and View click on Taro."),
      ],
    },
    {
      title: "FullscreenOptionListOptionClickEvent",
      rows: [
        row("key", "string", true, zh ? "被点击的 option key。" : "Clicked option key."),
        row("option", "FullscreenOptionListOption", true, zh ? "被点击的 option。" : "Clicked option."),
        row("selected", "boolean", true, zh ? "点击前该 option 是否已选中。" : "Whether the option was already selected before the click."),
        row("nativeEvent", "unknown", false, zh ? "平台宿主传入的原始点击事件；Web 为 button click，Taro 为 View click。" : "Original click event from the platform host; button click on Web and View click on Taro."),
      ],
    },
  ];
}

function accountingDisplayPropsRows(locale: Locale): ApiRow[] {
  const zh = isZh(locale);

  return [
    row("expression", "string", false, zh ? "展示的表达式文本，透传给 CalcDisplay；不传时默认为空。" : "Expression text forwarded to CalcDisplay; defaults to empty."),
    row("result", "string", false, zh ? "展示的计算结果文本，透传给 CalcDisplay；不传时默认为 0。" : "Computed result text forwarded to CalcDisplay; defaults to 0.", "0"),
    row(
      "currencySymbol",
      "React.ReactNode",
      false,
      zh
        ? "覆盖默认货币前缀；不传时使用 <YenCircleIcon />，显式传入 prefix 时会被覆盖。"
        : "Overrides the default currency prefix. Defaults to <YenCircleIcon /> when omitted, and is overridden by explicit prefix.",
      "<YenCircleIcon />",
    ),
    row("noteValue", "string", false, zh ? "备注输入值。" : "Note input value."),
    row("onNoteChange", "(value: string) => void", false, zh ? "备注输入变化时触发。" : "Called when the note input changes."),
    row("noteLabel", "string", false, zh ? "备注输入标签。" : "Note input label.", "账单描述"),
    row("notePlaceholder", "string", false, zh ? "备注输入 placeholder。" : "Note input placeholder.", "点击输入账单备注"),
    row("noteInputCursorSpacing", "number", false, zh ? "Taro 备注输入聚焦时，光标与键盘之间的距离，单位 px。" : "Distance between the focused Taro note input cursor and keyboard, in px.", "24"),
    row("展示区扩展", "CalcDisplayProps", false, zh ? "支持 CalcDisplay 的展示区和样式扩展能力；点击类型可查看完整 Props。显式传入的 prefix、footer、className、style 等优先于 Kit 默认值。" : "Supports CalcDisplay display-region and styling extension props; click the type for the full Props list. Explicit prefix, footer, className, style, and related props take precedence over Kit defaults."),
  ];
}

function accountingCalculatorPopupPropsRows(locale: Locale): ApiRow[] {
  const zh = isZh(locale);

  return [
    row("open", "boolean", true, zh ? "是否显示弹出层。" : "Controls popup visibility."),
    row("children", "React.ReactNode", false, zh ? "弹出内容，通常传入 <AccountingCalculator />。" : "Popup content, usually an <AccountingCalculator />."),
    row("placement", '"bottom"', false, zh ? "固定为底部弹出。" : "Bottom placement only.", "bottom"),
    row("Popup 扩展", 'Omit<PopupProps, "children" | "placement">', false, zh ? "支持 Popup 的显隐、占位、安全区、遮罩、动画、高度回调和样式扩展能力。" : "Supports Popup visibility, reserved space, safe area, overlay, animation, height callback, and styling extension props."),
    row("reserveSpace", "boolean | number", false, zh ? "默认开启，用于把页面内容顶起；可传 false 关闭或传 px 数字固定占位。" : "Enabled by default to push page content up; pass false to disable or a px number to reserve fixed space.", "true"),
    row("safeAreaInsetBottom", "boolean", false, zh ? "默认开启，避免底部系统控制条覆盖键盘区域。" : "Enabled by default to avoid the system home indicator covering the keyboard area.", "true"),
    row("overlay", "boolean | PopupOverlayOptions", false, zh ? "默认显示可点击关闭的遮罩，可显式覆盖。" : "Defaults to a visible closable overlay and can be overridden.", "{ visible: true, closeOnClick: true }"),
  ];
}

function accountingCategorySelectorPropsRows(locale: Locale): ApiRow[] {
  const zh = isZh(locale);

  return [
    row("categories", "AccountingCategory[]", true, zh ? "业务层传入的账本分类列表；组件不内置真实分类数据。" : "Accounting categories supplied by the product layer; the component does not include real category data."),
    row("selectedKey", "string", false, zh ? "当前选中的 category key。Kit 保持受控单选。" : "Currently selected category key. The Kit remains controlled single-select."),
    row("columns", "number", false, zh ? "分类网格列数，透传给 FullscreenOptionList。" : "Category grid column count forwarded to FullscreenOptionList.", "4"),
    row("onChange", "(event) => void", false, zh ? "点击未禁用且未选中的 category 时触发。" : "Called when an enabled, unselected category is clicked."),
    row("onCategoryClick", "(event) => void", false, zh ? "点击未禁用 category 时触发；即使点击当前选中项也会触发。" : "Called when an enabled category is clicked, including the currently selected category."),
    row("className", "string", false, zh ? "整体容器 className。" : "Class name for the root container."),
    row("style", "React.CSSProperties", false, zh ? "整体容器 style。" : "Inline style for the root container."),
    row("categoryClassName", "string", false, zh ? "category 节点 className，会附加到默认 category 外壳。" : "Category node class name appended to the default category shell."),
    row("categoryStyle", "React.CSSProperties", false, zh ? "category 节点内联样式。" : "Category node inline style."),
    row("iconClassName", "string", false, zh ? "分类 icon 节点 className。" : "Class name for the category icon node."),
    row("nameClassName", "string", false, zh ? "分类名称节点 className。" : "Class name for the category name node."),
    row("subtitleClassName", "string", false, zh ? "分类副标题节点 className。" : "Class name for the category subtitle node."),
    row("底层列表", "FullscreenOptionList", false, zh ? "复用 FullscreenOptionList 的 flat list、columns 和 option grid 能力；滚动容器和键盘顶起仍由业务层处理。" : "Reuses FullscreenOptionList flat-list, columns, and option-grid behavior; scroll containers and keyboard lift remain product-owned."),
  ];
}

function accountingCategorySelectorTypeSections(locale: Locale): TypeSection[] {
  const zh = isZh(locale);

  return [
    {
      title: "AccountingCategory",
      rows: [
        row("key", "string", true, zh ? "稳定唯一 category key，用于受控选中和事件回传。" : "Stable unique category key used for controlled selection and events."),
        row("name", "string", true, zh ? "分类名称。真实文案由业务层传入。" : "Category name. Real product copy is supplied by the caller."),
        row("icon", "React.ReactNode", false, zh ? "分类 icon；默认皮肤会为选中 icon 应用动画。" : "Category icon; the default skin animates the selected icon."),
        row("subtitle", "string", false, zh ? "分类副标题，例如业务侧传入的辅助说明。" : "Category subtitle, such as caller-supplied supporting copy."),
        row("disabled", "boolean", false, zh ? "禁用该 category。" : "Disables the category."),
      ],
    },
    {
      title: "AccountingCategorySelectorChangeEvent",
      rows: [
        row("key", "string", true, zh ? "被请求选中的 category key。" : "Category key requested for selection."),
        row("category", "AccountingCategory", true, zh ? "被点击的 category。" : "Clicked category."),
        row("nativeEvent", "unknown", false, zh ? "Taro/View 传入的原始点击事件。" : "Original click event from Taro/View."),
      ],
    },
    {
      title: "AccountingCategorySelectorClickEvent",
      rows: [
        row("key", "string", true, zh ? "被点击的 category key。" : "Clicked category key."),
        row("category", "AccountingCategory", true, zh ? "被点击的 category。" : "Clicked category."),
        row("selected", "boolean", true, zh ? "点击前该 category 是否已选中。" : "Whether the category was already selected before the click."),
        row("nativeEvent", "unknown", false, zh ? "Taro/View 传入的原始点击事件。" : "Original click event from Taro/View."),
      ],
    },
  ];
}

function accountingCalculatorPropsRows(locale: Locale): ApiRow[] {
  const zh = isZh(locale);

  return [
    row("display", "React.ReactNode | ((expression, result) => React.ReactNode | false | \"none\") | false | \"none\"", false, zh ? "展示区；默认渲染 <AccountingDisplay />。传节点会原样展示；需要表达式/结果时传函数；传 false 或 \"none\" 可隐藏。" : "Display region; defaults to <AccountingDisplay />. Nodes render as-is; pass a function when expression/result are needed. Pass false/\"none\" to hide it.", "<AccountingDisplay />"),
    row("defaultExpression", "string", false, zh ? "非受控模式下的初始表达式。" : "Initial expression for uncontrolled usage."),
    row("expression", "string", false, zh ? "受控表达式。传入后组件以该值为准，不再自行持有表达式状态。" : "Controlled expression. When passed, the component renders from this value instead of owning expression state."),
    row("keyboardConfig", "BusinessKeyboardConfig", false, zh ? "覆盖默认金额计算键盘配置。" : "Overrides the default accounting calculator keyboard."),
    row("键盘扩展", "Omit<BusinessKeyboardProps, \"config\" | \"onKeyPress\">", false, zh ? "支持 BusinessKeyboard 的展示和交互扩展能力；点击类型可查看完整 Props。config 与 onKeyPress 由 Kit 接管。" : "Supports BusinessKeyboard display and interaction extension props; click the type for the full Props list. config and onKeyPress stay owned by the Kit."),
    row("scale", "number", false, zh ? "计算结果的小数位数。" : "Decimal precision for evaluated results.", "2"),
    row("submitLabel", "string", false, zh ? "默认键盘提交键文案。" : "Submit key label in the default keyboard.", "完成"),
    row("renderKeyboard", "(props) => React.ReactNode", false, zh ? "自定义键盘渲染，同时复用 Kit 生成的 keyboard props。" : "Custom keyboard rendering using generated keyboard props."),
    row("onExpressionChange", "(expression, state) => void", false, zh ? "键盘动作计算出下一表达式后触发；受控模式下用它回写 expression。" : "Called with the next expression after keyboard actions; use it to write back expression in controlled mode."),
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
