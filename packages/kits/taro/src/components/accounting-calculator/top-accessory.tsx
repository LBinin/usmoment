import React from "react";
import { ScrollView, Text, View } from "@tarojs/components";
import clsx from "clsx";

type TaroRenderable = React.ComponentProps<typeof View>["children"];

export type AccountingCalculatorTopAccessoryItem = {
  id: string;
  label: string;
  value?: string;
  icon?: TaroRenderable;
  avatar?: TaroRenderable;
  disabled?: boolean;
  onClick?: (item: AccountingCalculatorTopAccessoryItem) => void;
};

export type AccountingCalculatorTopAccessoryRenderInput = {
  item: AccountingCalculatorTopAccessoryItem;
  defaultNode: TaroRenderable;
  index: number;
  isActive: boolean;
  close: () => void;
  open: () => void;
};

export type AccountingCalculatorRenderTopAccessoryItem = (
  input: AccountingCalculatorTopAccessoryRenderInput,
) => TaroRenderable;

export function renderAccountingCalculatorTopAccessory(options: {
  activeItemId?: string;
  onItemClose?: () => void;
  onItemOpen?: (item: AccountingCalculatorTopAccessoryItem) => void;
  items?: AccountingCalculatorTopAccessoryItem[];
  renderItem?: AccountingCalculatorRenderTopAccessoryItem;
}): TaroRenderable {
  if (!options.items?.length) return undefined;

  return (
    <ScrollView
      className="usm-accounting-calculator__top-accessory"
      enhanced
      scrollX
      scrollY={false}
      showScrollbar={false}
    >
      <View className="usm-accounting-calculator__top-accessory-track">
        {options.items.map((item, index) => {
          const isActive = item.id === options.activeItemId;
          const open = () => {
            if (!item.disabled) options.onItemOpen?.(item);
          };
          const close = () => {
            if (isActive) options.onItemClose?.();
          };
          const defaultNode = renderDefaultTopAccessoryItem({
            isActive,
            item,
            open,
          });
          const content = options.renderItem
            ? options.renderItem({
                close,
                defaultNode,
                index,
                isActive,
                item,
                open,
              })
            : defaultNode;

          return <React.Fragment key={item.id}>{content}</React.Fragment>;
        })}
      </View>
    </ScrollView>
  );
}

function renderDefaultTopAccessoryItem(options: {
  isActive: boolean;
  item: AccountingCalculatorTopAccessoryItem;
  open: () => void;
}): TaroRenderable {
  const { isActive, item, open } = options;
  const leading = item.avatar ?? item.icon;

  return (
    <View
      aria-disabled={item.disabled}
      className={clsx(
        "usm-accounting-calculator__top-accessory-item",
        isActive && "usm-accounting-calculator__top-accessory-item--active",
        item.disabled &&
          "usm-accounting-calculator__top-accessory-item--disabled",
      )}
      onClick={() => {
        if (!item.disabled) {
          open();
          item.onClick?.(item);
        }
      }}
      role="button"
    >
      {leading ? (
        <View
          className={clsx(
            "usm-accounting-calculator__top-accessory-leading",
            item.avatar
              ? "usm-accounting-calculator__top-accessory-leading--avatar"
              : "usm-accounting-calculator__top-accessory-leading--icon",
          )}
        >
          {leading}
        </View>
      ) : null}
      <Text className="usm-accounting-calculator__top-accessory-label">
        {item.label}
      </Text>
      {item.value ? (
        <Text className="usm-accounting-calculator__top-accessory-value">
          {item.value}
        </Text>
      ) : null}
    </View>
  );
}
