import React from "react";
import clsx from "clsx";

export type AccountingCalculatorTopAccessoryItem = {
  id: string;
  label: string;
  value?: string;
  icon?: React.ReactNode;
  avatar?: React.ReactNode;
  disabled?: boolean;
  onClick?: (item: AccountingCalculatorTopAccessoryItem) => void;
};

export type AccountingCalculatorTopAccessoryRenderInput = {
  item: AccountingCalculatorTopAccessoryItem;
  defaultNode: React.ReactNode;
  index: number;
  isActive: boolean;
  close: () => void;
  open: () => void;
};

export type AccountingCalculatorRenderTopAccessoryItem = (
  input: AccountingCalculatorTopAccessoryRenderInput,
) => React.ReactNode;

export function renderAccountingCalculatorTopAccessory(options: {
  activeItemId?: string;
  onItemClose?: () => void;
  onItemOpen?: (item: AccountingCalculatorTopAccessoryItem) => void;
  items?: AccountingCalculatorTopAccessoryItem[];
  renderItem?: AccountingCalculatorRenderTopAccessoryItem;
}): React.ReactNode {
  if (!options.items?.length) return undefined;

  return (
    <div className="usm-accounting-calculator__top-accessory">
      <div className="usm-accounting-calculator__top-accessory-track">
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
      </div>
    </div>
  );
}

function renderDefaultTopAccessoryItem(options: {
  isActive: boolean;
  item: AccountingCalculatorTopAccessoryItem;
  open: () => void;
}): React.ReactNode {
  const { isActive, item, open } = options;
  const leading = item.avatar ?? item.icon;

  return (
    <button
      aria-disabled={item.disabled}
      className={clsx(
        "usm-accounting-calculator__top-accessory-item",
        isActive && "usm-accounting-calculator__top-accessory-item--active",
        item.disabled &&
          "usm-accounting-calculator__top-accessory-item--disabled",
      )}
      disabled={item.disabled}
      onClick={() => {
        if (!item.disabled) {
          open();
          item.onClick?.(item);
        }
      }}
      type="button"
    >
      {leading ? (
        <span
          className={clsx(
            "usm-accounting-calculator__top-accessory-leading",
            item.avatar
              ? "usm-accounting-calculator__top-accessory-leading--avatar"
              : "usm-accounting-calculator__top-accessory-leading--icon",
          )}
        >
          {leading}
        </span>
      ) : null}
      <span className="usm-accounting-calculator__top-accessory-label">
        {item.label}
      </span>
      {item.value ? (
        <span className="usm-accounting-calculator__top-accessory-value">
          {item.value}
        </span>
      ) : null}
    </button>
  );
}
