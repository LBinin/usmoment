import React, { useMemo, useState } from "react";
import {
  createAccountingCalcKeyboardConfig,
  type BusinessKeyboardConfig,
} from "@usmoment/headless";
import { BackspaceIcon } from "@usmoment/icon";
import {
  applyAccountingCalculatorKeyboardEvent,
  createAccountingCalculatorState,
  type AccountingCalculatorState,
} from "@usmoment/kit-core";
import {
  BusinessKeyboard,
  type BusinessKeyboardProps,
} from "@usmoment/ui-web";
import {
  AccountingDisplay,
} from "../accounting-display";
import "./keyboard-assets.css";
import "./style.css";

export type { AccountingCalculatorState };
export type { BusinessKeyboardProps };

type AccountingCalculatorKeyboardProps = Omit<
  BusinessKeyboardProps,
  "config" | "onKeyPress"
>;

export type AccountingCalculatorDisplay =
  | false
  | "none"
  | React.ReactNode
  | ((expression: string, result: string) => React.ReactNode | false | "none");

export type AccountingCalculatorProps = AccountingCalculatorKeyboardProps & {
  display?: AccountingCalculatorDisplay;
  keyboardConfig?: BusinessKeyboardConfig;
  onChange?: (state: AccountingCalculatorState) => void;
  onSubmit?: (state: AccountingCalculatorState) => void;
  renderKeyboard?: (props: BusinessKeyboardProps) => React.ReactNode;
  scale?: number;
  submitLabel?: string;
};

export function AccountingCalculator(props: AccountingCalculatorProps) {
  const {
    className,
    display,
    keyboardConfig: customKeyboardConfig,
    onChange,
    onSubmit,
    renderKeyboard,
    scale: scaleProp,
    submitLabel,
    ...keyboardOptions
  } = props;
  const scale = scaleProp ?? 2;
  const [expression, setExpression] = useState("");
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

  const keyboardProps: BusinessKeyboardProps = {
    ...(customKeyboardConfig ? {} : accountingKeyboardPresetProps),
    ...keyboardOptions,
    className: joinClassNames(
      "usm-accounting-calculator__keyboard",
      className,
    ),
    config: keyboardConfig,
    onKeyPress: (event) => {
      const nextState = applyAccountingCalculatorKeyboardEvent(
        state.expression,
        scale,
        event,
      );

      setExpression(nextState.expression);
      onChange?.(nextState);

      if (event.action === "submit") {
        onSubmit?.(nextState);
      }
    },
  };
  const displayNode =
    display === false || display === "none"
      ? null
      : renderAccountingDisplay(display, state);

  return (
    <div className="usm-accounting-calculator">
      {displayNode}
      {renderKeyboard ? (
        renderKeyboard(keyboardProps)
      ) : (
        <BusinessKeyboard {...keyboardProps} />
      )}
    </div>
  );
}

function renderAccountingDisplay(
  display: AccountingCalculatorDisplay | undefined,
  state: AccountingCalculatorState,
): React.ReactNode {
  if (display === undefined) {
    return (
      <AccountingDisplay
        expression={state.expression}
        result={state.result}
      />
    );
  }

  if (display === null) return null;

  if (typeof display === "function") {
    const rendered = display(state.expression, state.result);

    return rendered === false || rendered === "none" ? null : rendered;
  }

  return display;
}

function joinClassNames(
  ...classNames: Array<string | false | null | undefined>
): string {
  return classNames.filter(Boolean).join(" ");
}

const accountingKeyboardPresetProps: Pick<
  BusinessKeyboardProps,
  | "columnGap"
  | "columnWidths"
  | "keyFontFamily"
  | "keyHeight"
  | "keys"
  | "layout"
  | "renderKey"
  | "rowGap"
> = {
  columnGap: "-2px",
  columnWidths: [1, 1, 1, 1.18],
  keyFontFamily: '"Montserrat", "Avenir Next", sans-serif',
  keyHeight: 65,
  keys: [
    {
      id: "=",
      label: "=",
      action: "custom",
      payload: { shortcut: "equals" },
      variant: "operator",
    },
  ],
  layout: [
    ["7", "8", "9", "+"],
    ["4", "5", "6", "-"],
    ["1", "2", "3", "="],
    [".", "0", "backspace", "submit"],
  ],
  renderKey: ({ defaultNode, key }) =>
    key.id === "backspace" ? (
      <BackspaceIcon
        className="usm-accounting-calculator__backspace-icon"
        renderMode="mask"
      />
    ) : (
      defaultNode
    ),
  rowGap: "-2px",
};
