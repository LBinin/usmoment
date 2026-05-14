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
};

export type AccountingCalculatorRenderTopAccessoryItem = (
  input: AccountingCalculatorTopAccessoryRenderInput,
) => React.ReactNode;

export function renderAccountingCalculatorTopAccessory(options: {
  items?: AccountingCalculatorTopAccessoryItem[];
  renderItem?: AccountingCalculatorRenderTopAccessoryItem;
}): React.ReactNode {
  if (!options.items?.length) return undefined;

  return (
    <div className="usm-accounting-calculator__top-accessory">
      <div className="usm-accounting-calculator__top-accessory-track">
        {options.items.map((item, index) => {
          const defaultNode = renderDefaultTopAccessoryItem(item);
          const content = options.renderItem
            ? options.renderItem({ item, defaultNode, index })
            : defaultNode;

          return <React.Fragment key={item.id}>{content}</React.Fragment>;
        })}
      </div>
    </div>
  );
}

function renderDefaultTopAccessoryItem(
  item: AccountingCalculatorTopAccessoryItem,
): React.ReactNode {
  const leading = item.avatar ?? item.icon;

  return (
    <button
      aria-disabled={item.disabled}
      className={clsx(
        "usm-accounting-calculator__top-accessory-item",
        item.disabled &&
          "usm-accounting-calculator__top-accessory-item--disabled",
      )}
      disabled={item.disabled}
      onClick={() => {
        if (!item.disabled) item.onClick?.(item);
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
