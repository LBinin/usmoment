import type { AccountingCategory } from "@usmoment/kit-web";

export type OptionListPlaygroundData = {
  label: string;
  hint: string;
};

export const optionListPlaygroundOptions = [
  { key: "food", data: { label: "餐饮", hint: "日常三餐" } },
  { key: "transport", data: { label: "交通", hint: "通勤出行" } },
  { key: "shopping", data: { label: "购物", hint: "生活采购" } },
  { key: "salary", data: { label: "收入", hint: "工资奖金" } },
  { key: "travel", data: { label: "旅行", hint: "计划中" } },
  { key: "locked", disabled: true, data: { label: "归档", hint: "禁用项" } },
] satisfies Array<{
  key: string;
  disabled?: boolean;
  data: OptionListPlaygroundData;
}>;

export const accountingCategoryMockCategories: AccountingCategory[] = [
  { key: "Food", name: "餐饮", icon: "🍔", subtitle: "Food" },
  { key: "Drinks", name: "水饮", icon: "🥤", subtitle: "Drinks" },
  { key: "Fruit", name: "水果", icon: "🍎", subtitle: "Fruit" },
  { key: "Afternoon Tea", name: "下午茶", icon: "🧁", subtitle: "Afternoon Tea" },
  { key: "Shopping", name: "购物", icon: "🛒", subtitle: "Shopping" },
  { key: "Traffic", name: "交通", icon: "🚌", subtitle: "Traffic" },
  { key: "Hotel", name: "住宿", icon: "🏨", subtitle: "Hotel" },
  { key: "Ticket", name: "票务", icon: "🎟", subtitle: "Ticket" },
  { key: "Entertainment", name: "娱乐", icon: "🎮", subtitle: "Entertainment" },
  { key: "Snacks", name: "零食", icon: "🍬", subtitle: "Snacks" },
  { key: "Lottery", name: "彩票", icon: "🎫", subtitle: "Lottery" },
  { key: "Sports", name: "运动", icon: "🏃", subtitle: "Sports" },
  { key: "Vegetables", name: "买菜", icon: "🥬", subtitle: "Vegetables" },
  { key: "Goods", name: "日用", icon: "🫙", subtitle: "Goods" },
  { key: "Clothes", name: "服饰", icon: "👕", subtitle: "Clothes" },
  { key: "Express", name: "快递", icon: "📦", subtitle: "Express" },
  { key: "Water", name: "水电", icon: "💧", subtitle: "Water" },
  {
    key: "Alcohol and Tobacco",
    name: "烟酒",
    icon: "🍺",
    subtitle: "Alcohol and Tobacco",
  },
  { key: "Other", name: "其他", icon: "📝", subtitle: "Other" },
];
