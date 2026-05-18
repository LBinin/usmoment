import React, { useEffect, useMemo, useRef, useState } from "react";
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
import { triggerAccountingCalculatorVibration } from "./vibration";
import "./keyboard-assets.css";
import "./style.css";

const ACCOUNTING_CALCULATOR_OPERATION_PANEL_EXIT_MS = 240;

export type { AccountingCalculatorState };
export type { BusinessKeyboardProps };
export {
  AccountingCalculatorPayerAction,
  DateAction,
  ImageUploadAction,
  NoteAction,
  TimeAction,
  type AccountingCalculatorPayerActionChangeInput,
  type AccountingCalculatorPayerActionProps,
  type AccountingCalculatorPayerOption,
  type DateActionChangeInput,
  type DateActionProps,
  type ImageUploadActionProps,
  type NoteActionProps,
  type TimeActionChangeInput,
  type TimeActionProps,
  createDateActionValue,
  createTimeActionValue,
  formatDateActionDisplayValue,
  formatTimeActionDisplayValue,
} from "./action";
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

export type AccountingCalculatorTopAccessoryActionPanelInput = {
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
  renderTopAccessoryActionPanel?: (
    input: AccountingCalculatorTopAccessoryActionPanelInput,
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
    renderTopAccessoryActionPanel,
    renderTopAccessoryItem,
    scale: scaleProp,
    submitLabel,
    topAccessory,
    topAccessoryItems,
    vibrate,
    ...keyboardOptions
  } = props;
  const scale = scaleProp ?? 2;
  const [uncontrolledExpression, setUncontrolledExpression] = useState(
    () => defaultExpression ?? "",
  );
  const [activeTopAccessoryItemId, setActiveTopAccessoryItemId] =
    useState<string>();
  const [renderedTopAccessoryItemId, setRenderedTopAccessoryItemId] =
    useState<string>();
  const [isTopAccessoryPanelClosing, setIsTopAccessoryPanelClosing] =
    useState(false);
  const closeTopAccessoryPanelTimerRef =
    useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
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
  const renderedTopAccessoryItem = useMemo(
    () =>
      topAccessoryItems?.find((item) => item.id === renderedTopAccessoryItemId),
    [renderedTopAccessoryItemId, topAccessoryItems],
  );
  useEffect(
    () => () => {
      if (closeTopAccessoryPanelTimerRef.current) {
        clearTimeout(closeTopAccessoryPanelTimerRef.current);
      }
    },
    [],
  );
  const openTopAccessoryPanel = (item: AccountingCalculatorTopAccessoryItem) => {
    if (closeTopAccessoryPanelTimerRef.current) {
      clearTimeout(closeTopAccessoryPanelTimerRef.current);
    }

    setRenderedTopAccessoryItemId(item.id);
    setActiveTopAccessoryItemId(item.id);
    setIsTopAccessoryPanelClosing(false);
  };
  const closeTopAccessoryPanel = () => {
    triggerAccountingCalculatorVibration(vibrate);
    setActiveTopAccessoryItemId(undefined);
    setIsTopAccessoryPanelClosing(true);

    if (closeTopAccessoryPanelTimerRef.current) {
      clearTimeout(closeTopAccessoryPanelTimerRef.current);
    }

    closeTopAccessoryPanelTimerRef.current = setTimeout(() => {
      setRenderedTopAccessoryItemId(undefined);
      setIsTopAccessoryPanelClosing(false);
    }, ACCOUNTING_CALCULATOR_OPERATION_PANEL_EXIT_MS);
  };
  const topAccessoryPanel =
    renderedTopAccessoryItem && renderTopAccessoryActionPanel
      ? renderTopAccessoryActionPanel({
          close: closeTopAccessoryPanel,
          item: renderedTopAccessoryItem,
        })
      : undefined;
  const hasRenderedTopAccessoryPanel =
    topAccessoryPanel !== undefined &&
    topAccessoryPanel !== null &&
    topAccessoryPanel !== false;
  const hasOpenTopAccessoryPanel =
    Boolean(activeTopAccessoryItem) &&
    hasRenderedTopAccessoryPanel &&
    !isTopAccessoryPanelClosing;
  const operationOverlay = hasRenderedTopAccessoryPanel ? (
    <View
      className={clsx(
        "usm-accounting-calculator__operation-panel",
        isTopAccessoryPanelClosing
          ? "usm-accounting-calculator__operation-panel--closing"
          : "usm-accounting-calculator__operation-panel--entering",
      )}
    >
      <React.Fragment key={renderedTopAccessoryItem?.id}>
        {topAccessoryPanel}
      </React.Fragment>
    </View>
  ) : (
    bodyOverlay
  );

  const keyboardProps: BusinessKeyboardProps = {
    ...(customKeyboardConfig ? {} : accountingKeyboardPresetProps),
    ...keyboardOptions,
    vibrate,
    bodyOverlay: operationOverlay,
    className: clsx(
      "usm-accounting-calculator__keyboard",
      hasOpenTopAccessoryPanel &&
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
        activeItemId: hasOpenTopAccessoryPanel
          ? activeTopAccessoryItemId
          : undefined,
        items: topAccessoryItems,
        onItemClose: closeTopAccessoryPanel,
        onItemOpen: renderTopAccessoryActionPanel
          ? openTopAccessoryPanel
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
