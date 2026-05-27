import { isZh, type Locale } from "../i18n";
import { componentMetadata } from "./component-metadata";
import {
  businessKeyboardPropsRows,
  businessKeyboardTypeSections,
  calcDisplayPropsRows,
  fullscreenOptionListPropsRows,
  fullscreenOptionListTypeSections,
  popupPropsRows,
  popupTypeSections,
} from "./component-api-rows";
import {
  BusinessKeyboardPlayground,
  CalcDisplayPlayground,
  FullscreenOptionListPlayground,
} from "./playgrounds";
import type { ComponentDoc } from "./types";

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
      metadata: componentMetadata({
        packageName: "@usmoment/ui-web",
        sourcePath: "packages/ui/web/src/components/business-keyboard",
      }),
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
      metadata: componentMetadata({
        packageName: "@usmoment/ui-web",
        sourcePath: "packages/ui/web/src/components/calc-display",
      }),
      usage: zh
        ? [
            "在 Taro 小程序项目中，请在页面入口或全局入口显式引入 @usmoment/taro/style.css。",
            "prefix、header 和 footer 由业务传入；账单名称输入等业务内容应放在 footer 或 Kit 层，而不是由 CalcDisplay 固定。",
            "默认样式使用主题化 CSS 变量，特殊业务皮肤应放到 Kit 层。",
          ]
        : [
            "In Taro mini program projects, explicitly import @usmoment/taro/style.css from a page or app entry.",
            "Pass business-specific prefix, header, and footer content yourself; bill name inputs and similar product content belong in footer or a Kit, not in CalcDisplay itself.",
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
      metadata: componentMetadata({
        packageName: "@usmoment/ui-web",
        sourcePath: "packages/ui/web/src/components/popup",
      }),
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
      metadata: componentMetadata({
        packageName: "@usmoment/ui-web",
        sourcePath: "packages/ui/web/src/components/fullscreen-option-list",
      }),
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
