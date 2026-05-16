import React, { useMemo, useState } from "react";
import { Image, Text, View } from "@tarojs/components";
import { DateIcon, ImageIcon, NoteIcon, TimeIcon } from "@usmoment/icon/taro";
import {
  AccountingCalculatorPayerAction,
  type AccountingCalculatorPayerOption,
  type AccountingCalculatorTopAccessoryActionPanelInput,
  type AccountingCalculatorTopAccessoryItem,
} from "@usmoment/taro/kit";
import payerAvatar1 from "./assets/payer-1.png";
import payerAvatar2 from "./assets/payer-2.png";
import payerAvatar3 from "./assets/payer-3.png";
import payerAvatar4 from "./assets/payer-4.png";
import payerAvatar5 from "./assets/payer-5.png";
import payerAvatar6 from "./assets/payer-6.png";

type TaroRenderable = React.ComponentProps<typeof View>["children"];

type DemoAccountingCalculatorAction = {
  id: string;
  item: AccountingCalculatorTopAccessoryItem;
  renderPanel: (input: { close: () => void }) => TaroRenderable;
};

type UseDemoActionsOptions = {
  onActionChange: (message: string) => void;
};

const mockPayers: AccountingCalculatorPayerOption[] = [
  { avatarSrc: payerAvatar1, id: "me", name: "我" },
  { avatarSrc: payerAvatar2, id: "chen", name: "车干" },
  { avatarSrc: payerAvatar3, id: "lin", name: "小林小林" },
  { avatarSrc: payerAvatar4, id: "yang", name: "小杨三将" },
  { avatarSrc: payerAvatar5, id: "zhou", name: "周周" },
  { avatarSrc: payerAvatar6, id: "momo", name: "默默" },
];

const accessoryIconStyle: React.CSSProperties = {
  backgroundColor: "currentColor",
};

export function useAccountingCalculatorDemoActions(
  options: UseDemoActionsOptions,
) {
  const [selectedPayer, setSelectedPayer] = useState(() => mockPayers[0]);
  const { onActionChange } = options;
  const actions = useMemo<DemoAccountingCalculatorAction[]>(
    () => [
      {
        id: "payer",
        item: {
          id: "payer",
          label: "更改付款人",
          avatar: (
            <Image
              className="calculator-demo__top-accessory-avatar"
              mode="aspectFill"
              src={selectedPayer.avatarSrc}
            />
          ),
          onClick: () => onActionChange("已点击：更改付款人"),
        },
        renderPanel: ({ close }) => (
          <View className="calculator-demo-panel calculator-demo-panel--payer">
            <View className="calculator-demo-panel__action">
              <AccountingCalculatorPayerAction
                onChange={({ option }) => {
                  setSelectedPayer(option);
                  onActionChange(`当前付款人：${option.name}`);
                }}
                options={mockPayers}
                value={selectedPayer.id}
              />
            </View>
            <View className="calculator-demo-panel__close" onClick={close} />
          </View>
        ),
      },
      createPlaceholderAction(
        "note",
        "备注",
        <NoteIcon renderMode="mask" style={accessoryIconStyle} />,
        "备注",
        onActionChange,
      ),
      createPlaceholderAction(
        "image",
        "图片",
        <ImageIcon renderMode="mask" style={accessoryIconStyle} />,
        "图片",
        onActionChange,
      ),
      createPlaceholderAction(
        "date",
        "当前日期",
        <DateIcon renderMode="mask" style={accessoryIconStyle} />,
        "当前日期",
        onActionChange,
      ),
      createPlaceholderAction(
        "time",
        "当前时间",
        <TimeIcon renderMode="mask" style={accessoryIconStyle} />,
        "当前时间",
        onActionChange,
      ),
    ],
    [onActionChange, selectedPayer],
  );
  const actionById = useMemo(
    () => new Map(actions.map((action) => [action.id, action])),
    [actions],
  );

  return {
    items: actions.map((action) => action.item),
    renderPanel: ({
      close,
      item,
    }: AccountingCalculatorTopAccessoryActionPanelInput) =>
      actionById.get(item.id)?.renderPanel({ close }),
  };
}

function createPlaceholderAction(
  id: string,
  label: string,
  icon: TaroRenderable,
  actionLabel: string,
  onActionChange: (message: string) => void,
  value?: string,
): DemoAccountingCalculatorAction {
  return {
    id,
    item: {
      icon,
      id,
      label,
      onClick: () => onActionChange(`已点击：${label}`),
      value,
    },
    renderPanel: ({ close }) => (
      <View className="calculator-demo-panel">
        <View className="calculator-demo-panel__content">
          <View className="calculator-demo-panel__row">
            <Text className="calculator-demo-panel__label">
              {actionLabel}能力后续接入
            </Text>
          </View>
        </View>
        <View className="calculator-demo-panel__close" onClick={close} />
      </View>
    ),
  };
}
