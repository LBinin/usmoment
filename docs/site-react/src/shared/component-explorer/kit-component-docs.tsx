import { isZh, type Locale } from "../i18n";
import {
  accountingCalculatorPopupPropsRows,
  accountingCalculatorPropsRows,
  accountingCategorySelectorPropsRows,
  accountingCategorySelectorTypeSections,
  accountingDisplayPropsRows,
  businessKeyboardTypeSections,
} from "./component-api-rows";
import { componentMetadata } from "./component-metadata";
import {
  AccountingCalculatorPlayground,
  AccountingCategorySelectorPlayground,
  AccountingDisplayPlayground,
} from "./playgrounds";
import type { ComponentDoc } from "./types";

export function getKitComponentDocs(locale: Locale): ComponentDoc[] {
  const zh = isZh(locale);

  return [
    {
      id: "accounting-display",
      name: "AccountingDisplay",
      menuLabel: "Display",
      layer: "Kit",
      category: zh ? "记账类" : "Accounting",
      summary: zh
        ? "记账金额显示面板。它基于 CalcDisplay，提供账单金额皮肤、默认货币前缀和账单名称输入，同时保留 CalcDisplay 的所有显示扩展能力。"
        : "An accounting amount display panel. It builds on CalcDisplay with the accounting amount skin, default currency prefix, and bill name input while keeping CalcDisplay extension props.",
      importSnippet: `import "@usmoment/taro/style.css"
import { AccountingDisplay } from "@usmoment/taro/kit"`,
      metadata: componentMetadata({
        packageName: "@usmoment/kit-web",
        sourcePath: "packages/kits/web/src/components/accounting-display",
      }),
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
      menuLabel: "Calculator",
      layer: "Kit",
      category: zh ? "记账类" : "Accounting",
      summary: zh
        ? "可直接接入的金额计算器。它内置计算逻辑、金融键盘和可选展示区，同时允许替换展示、键盘和回调，方便按业务流程继续扩展。"
        : "A ready-to-use amount calculator. It includes calculation logic, a financial keyboard, and an optional display, while still letting you replace display, keyboard, and callbacks for your own flow.",
      importSnippet: `import "@usmoment/taro/style.css"
import { AccountingCalculator } from "@usmoment/taro/kit"`,
      metadata: componentMetadata({
        packageName: "@usmoment/kit-web",
        sourcePath: "packages/kits/web/src/components/accounting-calculator",
      }),
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
      menuLabel: "CalculatorPopup",
      layer: "Kit",
      category: zh ? "记账类" : "Accounting",
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
      metadata: componentMetadata({
        packageName: "@usmoment/kit-web",
        sourcePath: "packages/kits/web/src/components/accounting-calculator-popup",
      }),
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
      menuLabel: "CategorySelector",
      layer: "Kit",
      category: zh ? "记账类" : "Accounting",
      summary: zh
        ? "Web + Taro Kit 层的账本分类选择器。它基于 FullscreenOptionList 组合 category 语义，默认复刻旧版账本分类的黄色选中态和 icon 动画，但真实分类数据仍由业务层传入。"
        : "A Web + Taro Kit accounting category selector. It builds category semantics on FullscreenOptionList and defaults to the legacy accounting yellow selected state plus icon animation, while real category data remains caller-supplied.",
      importSnippet: `import { AccountingCategorySelector } from "@usmoment/kit-web"

// Taro mini program
import "@usmoment/taro/style.css"
import { AccountingCategorySelector as TaroAccountingCategorySelector } from "@usmoment/taro/kit"`,
      metadata: componentMetadata({
        packageName: "@usmoment/kit-web",
        sourcePath: "packages/kits/web/src/components/accounting-category-selector",
      }),
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
