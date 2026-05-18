import React from "react";
import { YenCircleIcon } from "@usmoment/icon/taro";
import { hasAccountingExpressionOperator } from "@usmoment/kit-core";
import { CalcDisplay, type CalcDisplayProps } from "@usmoment/ui-taro";
import clsx from "clsx";
import { createNameInput } from "./name-input";
import "./style.css";

export type AccountingDisplayProps = Omit<
  CalcDisplayProps,
  "expression" | "result"
> &
  Partial<Pick<CalcDisplayProps, "expression" | "result">> & {
  currencySymbol?: CalcDisplayProps["prefix"];
  nameInputClassName?: string;
  nameInputCursorSpacing?: number;
  nameInputStyle?: React.CSSProperties;
  nameLabel?: string;
  namePlaceholder?: string;
  nameValue?: string;
  onNameChange?: (value: string) => void;
};

export function AccountingDisplay(props: AccountingDisplayProps) {
  const {
    className,
    currencySymbol,
    expression = "",
    footer,
    nameInputClassName,
    nameInputCursorSpacing,
    nameInputStyle,
    nameLabel,
    namePlaceholder,
    nameValue,
    onNameChange,
    prefix,
    result = "0",
    shouldShowExpression,
    ...displayProps
  } = props;

  return CalcDisplay({
    ...displayProps,
    className: clsx("usm-accounting-display", className),
    expression,
    footer:
      footer ??
      createNameInput({
        className: nameInputClassName,
        cursorSpacing: nameInputCursorSpacing,
        label: nameLabel,
        onChange: onNameChange,
        placeholder: namePlaceholder,
        style: nameInputStyle,
        value: nameValue,
      }),
    prefix: prefix ?? currencySymbol ?? (
      <YenCircleIcon
        className="usm-accounting-display__currency-icon"
        color="var(--usmoment-orange, #ff6400)"
        size="40rpx"
      />
    ),
    result,
    shouldShowExpression: shouldShowExpression ?? hasAccountingExpressionOperator,
  });
}
