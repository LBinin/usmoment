import React, { useMemo, useState } from "react";
import { Image, Text, View } from "@tarojs/components";
import { DateIcon, ImageIcon, NoteIcon, TimeIcon } from "@usmoment/icon/taro";
import {
  AccountingCalculatorPayerAction,
  ImageUploadAction,
  NoteAction,
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

const accessoryIconSize = "35rpx";
const accessoryIconStyle: React.CSSProperties = {
  backgroundColor: "currentColor",
};

const mockPayers: AccountingCalculatorPayerOption[] = [
  { avatarSrc: payerAvatar1, id: "me", name: "我" },
  { avatarSrc: payerAvatar2, id: "chen", name: "车干" },
  { avatarSrc: payerAvatar3, id: "lin", name: "小林小林" },
  { avatarSrc: payerAvatar4, id: "yang", name: "小杨三将" },
  { avatarSrc: payerAvatar5, id: "zhou", name: "周周" },
  { avatarSrc: payerAvatar6, id: "momo", name: "默默" },
];

export function useAccountingCalculatorDemoActions(
  options: UseDemoActionsOptions,
) {
  const [selectedPayer, setSelectedPayer] = useState(() => mockPayers[0]);
  const [noteValue, setNoteValue] = useState("");
  const [selectedImageSrc, setSelectedImageSrc] = useState("");
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
      {
        id: "note",
        item: {
          icon: (
            <NoteIcon
              renderMode="mask"
              size={accessoryIconSize}
              style={accessoryIconStyle}
            />
          ),
          id: "note",
          label: "备注",
          onClick: () => onActionChange("已点击：备注"),
        },
        renderPanel: ({ close }) => (
          <View className="calculator-demo-panel calculator-demo-panel--note">
            <View className="calculator-demo-panel__action">
              <NoteAction
                onChange={setNoteValue}
                placeholder="点击输入备注 ✍️"
                value={noteValue}
              />
            </View>
            <View className="calculator-demo-panel__close" onClick={close} />
          </View>
        ),
      },
      {
        id: "image",
        item: {
          ...(selectedImageSrc
            ? {
                avatar: (
                  <Image
                    className="calculator-demo__top-accessory-avatar"
                    mode="aspectFill"
                    src={selectedImageSrc}
                  />
                ),
              }
            : {
                icon: (
                  <ImageIcon
                    renderMode="mask"
                    size={accessoryIconSize}
                    style={accessoryIconStyle}
                  />
                ),
              }),
          id: "image",
          label: "图片",
          onClick: () => onActionChange("已点击：图片"),
        },
        renderPanel: ({ close }) => (
          <View className="calculator-demo-panel calculator-demo-panel--image">
            <View className="calculator-demo-panel__action">
              <ImageUploadAction
                onChange={(imageSrc) => {
                  setSelectedImageSrc(imageSrc);
                  onActionChange("已选择图片");
                }}
                placeholder="点击添加图片"
                replaceLabel="点击替换图片"
                value={selectedImageSrc}
              />
            </View>
            <View className="calculator-demo-panel__close" onClick={close} />
          </View>
        ),
      },
      createPlaceholderAction(
        "date",
        "当前日期",
        <DateIcon
          renderMode="mask"
          size={accessoryIconSize}
          style={accessoryIconStyle}
        />,
        "当前日期",
        onActionChange,
      ),
      createPlaceholderAction(
        "time",
        "当前时间",
        <TimeIcon
          renderMode="mask"
          size={accessoryIconSize}
          style={accessoryIconStyle}
        />,
        "当前时间",
        onActionChange,
      ),
    ],
    [noteValue, onActionChange, selectedImageSrc, selectedPayer],
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
