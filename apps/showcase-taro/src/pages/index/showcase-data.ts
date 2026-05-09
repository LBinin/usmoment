import type { BusinessKeyboardEvent } from "@usmoment/taro/headless";

export type KeyboardMode = "standard" | "compact" | "disabled";

export const keyboardModes: Array<{
  id: KeyboardMode;
  label: string;
  description: string;
}> = [
  {
    id: "standard",
    label: "标准金额键盘",
    description: "四列布局，适合记账、金额录入和确认动作。",
  },
  {
    id: "compact",
    label: "紧凑录入",
    description: "更短按键和更小间距，用于空间受限的业务面板。",
  },
  {
    id: "disabled",
    label: "禁用态",
    description: "展示流程锁定、权限限制或提交中的不可用状态。",
  },
];

export function applyKeyboardEvent(
  currentValue: string,
  event: BusinessKeyboardEvent,
): string {
  if (event.action === "clear") return "";
  if (event.action === "backspace") return currentValue.slice(0, -1);
  if (event.action === "submit") return currentValue || "0";
  if (event.action !== "input" || event.value === undefined) return currentValue;

  if (currentValue === "0" && event.value !== ".") return event.value;

  return `${currentValue}${event.value}`;
}

export function formatKeyboardEvent(event: BusinessKeyboardEvent): string {
  if (event.action === "input") return `input: ${event.value ?? ""}`;

  return event.action;
}
