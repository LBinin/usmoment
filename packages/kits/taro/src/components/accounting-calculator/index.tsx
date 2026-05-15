import React, { useMemo, useState } from "react";
import { View } from "@tarojs/components";
import {
  createAccountingCalcKeyboardConfig,
  type BusinessKeyboardConfig,
} from "@usmoment/headless";
import {
  applyAccountingCalculatorKeyboardEvent,
  createAccountingCalculatorState,
  type AccountingCalculatorState,
} from "@usmoment/kit-core";
import {
  BusinessKeyboard,
  type BusinessKeyboardProps,
} from "@usmoment/ui-taro";
import clsx from "clsx";
import { renderAccountingDisplay } from "./display";
import { accountingKeyboardPresetProps } from "./keyboard-preset";
import {
  renderAccountingCalculatorTopAccessory,
  type AccountingCalculatorRenderTopAccessoryItem,
  type AccountingCalculatorTopAccessoryItem,
} from "./top-accessory";
import "./keyboard-assets.css";
import "./style.css";

export type { AccountingCalculatorState };
export type { BusinessKeyboardProps };
export type {
  AccountingCalculatorRenderTopAccessoryItem,
  AccountingCalculatorTopAccessoryItem,
  AccountingCalculatorTopAccessoryRenderInput,
} from "./top-accessory";

export type TaroRenderable = React.ComponentProps<typeof View>["children"];

type AccountingCalculatorKeyboardProps = Omit<
  BusinessKeyboardProps,
  "config" | "onKeyPress"
>;

export type AccountingCalculatorDisplay =
  | false
  | "none"
  | TaroRenderable
  | ((expression: string, result: string) => TaroRenderable | false | "none");

export type AccountingCalculatorTopAccessoryPanelInput = {
  item: AccountingCalculatorTopAccessoryItem;
  close: () => void;
};

export type AccountingCalculatorProps = AccountingCalculatorKeyboardProps & {
  defaultExpression?: string;
  display?: AccountingCalculatorDisplay;
  expression?: string;
  keyboardConfig?: BusinessKeyboardConfig;
  onChange?: (state: AccountingCalculatorState) => void;
  onExpressionChange?: (
    expression: string,
    state: AccountingCalculatorState,
  ) => void;
  onSubmit?: (state: AccountingCalculatorState) => void;
  renderKeyboard?: (props: BusinessKeyboardProps) => TaroRenderable;
  renderTopAccessoryPanel?: (
    input: AccountingCalculatorTopAccessoryPanelInput,
  ) => TaroRenderable;
  renderTopAccessoryItem?: AccountingCalculatorRenderTopAccessoryItem;
  scale?: number;
  submitLabel?: string;
  topAccessoryItems?: AccountingCalculatorTopAccessoryItem[];
};

export function AccountingCalculator(props: AccountingCalculatorProps) {
  const {
    className,
    defaultExpression,
    display,
    expression: controlledExpression,
    keyboardConfig: customKeyboardConfig,
    onChange,
    onExpressionChange,
    onSubmit,
    bodyOverlay,
    renderKeyboard,
    renderTopAccessoryPanel,
    renderTopAccessoryItem,
    scale: scaleProp,
    submitLabel,
    topAccessory,
    topAccessoryItems,
    ...keyboardOptions
  } = props;
  const scale = scaleProp ?? 2;
  const [uncontrolledExpression, setUncontrolledExpression] = useState(
    () => defaultExpression ?? "",
  );
  const [activeTopAccessoryItemId, setActiveTopAccessoryItemId] =
    useState<string>();
  const isExpressionControlled = controlledExpression !== undefined;
  const expression = isExpressionControlled
    ? controlledExpression
    : uncontrolledExpression;
  const state = useMemo(
    () => createAccountingCalculatorState(expression, scale),
    [expression, scale],
  );
  const keyboardConfig = useMemo(
    () =>
      customKeyboardConfig ??
      createAccountingCalcKeyboardConfig({ submitLabel }),
    [customKeyboardConfig, submitLabel],
  );
  const activeTopAccessoryItem = useMemo(
    () =>
      topAccessoryItems?.find((item) => item.id === activeTopAccessoryItemId),
    [activeTopAccessoryItemId, topAccessoryItems],
  );
  const closeTopAccessoryPanel = () => {
    setActiveTopAccessoryItemId(undefined);
  };
  const topAccessoryPanel =
    activeTopAccessoryItem && renderTopAccessoryPanel
      ? renderTopAccessoryPanel({
          close: closeTopAccessoryPanel,
          item: activeTopAccessoryItem,
        })
      : undefined;
  const hasTopAccessoryPanel =
    topAccessoryPanel !== undefined &&
    topAccessoryPanel !== null &&
    topAccessoryPanel !== false;
  const operationOverlay = hasTopAccessoryPanel ? (
    <View className="usm-accounting-calculator__operation-panel">
      {topAccessoryPanel}
    </View>
  ) : (
    bodyOverlay
  );

  const keyboardProps: BusinessKeyboardProps = {
    ...(customKeyboardConfig ? {} : accountingKeyboardPresetProps),
    ...keyboardOptions,
    bodyOverlay: operationOverlay,
    className: clsx(
      "usm-accounting-calculator__keyboard",
      hasTopAccessoryPanel &&
        "usm-accounting-calculator__keyboard--operation-open",
      className,
    ),
    config: keyboardConfig,
    onKeyPress: (event) => {
      const nextState = applyAccountingCalculatorKeyboardEvent(
        state.expression,
        scale,
        event,
      );

      if (!isExpressionControlled) {
        setUncontrolledExpression(nextState.expression);
      }

      onExpressionChange?.(nextState.expression, nextState);
      onChange?.(nextState);

      if (event.action === "submit") {
        onSubmit?.(nextState);
      }
    },
    topAccessory:
      topAccessory ??
      renderAccountingCalculatorTopAccessory({
        activeItemId: hasTopAccessoryPanel
          ? activeTopAccessoryItemId
          : undefined,
        items: topAccessoryItems,
        onItemClose: closeTopAccessoryPanel,
        onItemOpen: renderTopAccessoryPanel
          ? (item) => {
              setActiveTopAccessoryItemId(item.id);
            }
          : undefined,
        renderItem: renderTopAccessoryItem,
      }),
  };
  const displayNode =
    display === false || display === "none"
      ? null
      : renderAccountingDisplay(display, state);

  return (
    <View className="usm-accounting-calculator">
      {displayNode}
      {renderKeyboard ? (
        renderKeyboard(keyboardProps)
      ) : (
        <BusinessKeyboard {...keyboardProps} />
      )}
    </View>
  );
}
