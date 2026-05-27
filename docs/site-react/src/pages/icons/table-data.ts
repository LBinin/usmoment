import { row } from "../../shared/component-explorer/api-table";

export const propRows = {
  en: [
    row(
      "size",
      "number | string",
      false,
      "Icon width. Non-square icons preserve their original ratio when a number is passed.",
      "1em",
    ),
    row(
      "color",
      "string",
      false,
      "Overrides the normal SVG/image color. In mask mode, use background or CSS classes for visible paint.",
      "currentColor",
    ),
    row(
      "width",
      "number | string",
      false,
      "Overrides the rendered SVG width.",
      "-",
    ),
    row(
      "height",
      "number | string",
      false,
      "Overrides the rendered SVG height.",
      "-",
    ),
    row(
      "renderMode",
      "\"svg\" | \"mask\"",
      false,
      "Renders the icon normally or as a CSS mask host for custom business paint such as gradients.",
      "\"svg\"",
    ),
    row("title", "string", false, "Adds an accessible title and switches the SVG to role=\"img\"."),
    row("className", "string", false, "Adds a class to the icon root."),
    row("style", "CSSProperties", false, "Adds inline styles to the icon root."),
  ],
  zh: [
    row(
      "size",
      "number | string",
      false,
      "图标宽度。传入数字时，非正方形图标会按原始比例计算高度。",
      "1em",
    ),
    row(
      "color",
      "string",
      false,
      "覆盖默认 SVG/image 图标颜色。mask 模式下请使用 background 或 CSS 类控制可见颜色。",
      "currentColor",
    ),
    row("width", "number | string", false, "覆盖 SVG 渲染宽度。", "-"),
    row("height", "number | string", false, "覆盖 SVG 渲染高度。", "-"),
    row(
      "renderMode",
      "\"svg\" | \"mask\"",
      false,
      "以默认图标节点或 CSS mask 承载节点渲染，便于业务用背景色或渐变为图标上色。",
      "\"svg\"",
    ),
    row("title", "string", false, "添加可访问标题，并让 SVG 以 role=\"img\" 暴露。"),
    row("className", "string", false, "添加到图标根节点的类名。"),
    row("style", "CSSProperties", false, "添加到图标根节点的内联样式。"),
  ],
};

export const variableRows = {
  en: [
    row("--usm-icon-size", "CSS variable", false, "Default icon size.", "1em"),
    row("--usm-icon-color", "CSS variable", false, "Default icon color behavior.", "currentColor"),
  ],
  zh: [
    row("--usm-icon-size", "CSS 变量", false, "默认图标尺寸。", "1em"),
    row("--usm-icon-color", "CSS 变量", false, "默认图标颜色策略。", "currentColor"),
  ],
};
