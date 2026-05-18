import React from "react";
import { YenCircleIcon } from "@usmoment/icon";
import { hasAccountingExpressionOperator } from "@usmoment/kit-core";
import { CalcDisplay, type CalcDisplayProps } from "@usmoment/ui-web";
import clsx from "clsx";
import { createNameInput } from "./name-input";
import "./style.css";

export type AccountingDisplayProps = Omit<
  CalcDisplayProps,
  "expression" | "result"
> &
  Partial<Pick<CalcDisplayProps, "expression" | "result">> & {
  currencySymbol?: React.ReactNode;
  nameInputClassName?: string;
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
        size="20px"
      />
    ),
    result,
    shouldShowExpression: shouldShowExpression ?? hasAccountingExpressionOperator,
  });
}
