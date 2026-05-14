import { Text } from "@tarojs/components";
import type { AccountingCalculatorTopAccessoryItem } from "@usmoment/taro/kit";

export function createMockTopAccessoryItems(
  onSelect: (label: string) => void,
): AccountingCalculatorTopAccessoryItem[] {
  return [
    {
      id: "payer",
      label: "更改付款人",
      avatar: <Text>我</Text>,
      onClick: () => onSelect("更改付款人"),
    },
    {
      id: "note",
      label: "备注",
      icon: <Text>备</Text>,
      onClick: () => onSelect("备注"),
    },
    {
      id: "image",
      label: "图片",
      icon: <Text>图</Text>,
      onClick: () => onSelect("图片"),
    },
    {
      id: "date",
      label: "日期",
      value: "2024-05-15",
      icon: <Text>日</Text>,
      onClick: () => onSelect("日期"),
    },
    {
      id: "category",
      label: "分类",
      value: "餐饮",
      icon: <Text>类</Text>,
      onClick: () => onSelect("分类"),
    },
  ];
}
