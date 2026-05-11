export type ShowcaseLayer = "kit" | "ui";

export type ShowcaseComponent = {
  id: string;
  name: string;
  zhName: string;
  layer: ShowcaseLayer;
  route: string;
  summary: string;
  tags: string[];
};

export type ShowcaseGroup = {
  id: string;
  title: string;
  subtitle: string;
  items: ShowcaseComponent[];
};

export const showcaseGroups: ShowcaseGroup[] = [
  {
    id: "kits",
    title: "Kits",
    subtitle: "开箱即用的业务组件，组合 Headless 与 UI 能力。",
    items: [
      {
        id: "accounting-calculator",
        name: "AccountingCalculator",
        zhName: "记账计算器",
        layer: "kit",
        route: "/pages/kits/accounting-calculator/index",
        summary: "内置表达式状态、金额结果展示和业务键盘的完整记账输入流。",
        tags: ["金额输入", "表达式", "提交回调"],
      },
      {
        id: "accounting-calculator-popup",
        name: "AccountingCalculatorPopup",
        zhName: "弹出式记账计算器",
        layer: "kit",
        route: "/pages/kits/accounting-calculator-popup/index",
        summary: "通过底部弹层唤起记账计算器，并演示占位、安全区和遮罩关闭能力。",
        tags: ["弹出层", "占位", "遮罩"],
      },
    ],
  },
  {
    id: "ui",
    title: "UI Components",
    subtitle: "可组合的 Taro 视觉组件，负责真实小程序交互与呈现。",
    items: [
      {
        id: "business-keyboard",
        name: "BusinessKeyboard",
        zhName: "业务键盘",
        layer: "ui",
        route: "/pages/ui/business-keyboard/index",
        summary: "面向金额、数字和固定操作面板的可配置业务键盘。",
        tags: ["键盘布局", "按键事件", "禁用态"],
      },
    ],
  },
];

export function getShowcaseComponent(
  componentId: string,
): ShowcaseComponent | undefined {
  return showcaseGroups
    .flatMap((group) => group.items)
    .find((item) => item.id === componentId);
}
