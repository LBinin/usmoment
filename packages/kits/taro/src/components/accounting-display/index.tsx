import React from "react";
import { YenCircleIcon } from "@usmoment/icon/taro";
import { hasAccountingExpressionOperator } from "@usmoment/kit-core";
import { CalcDisplay, type CalcDisplayProps } from "@usmoment/ui-taro";
import clsx from "clsx";
import { createNoteInput } from "./note-input";
import "./style.css";

export type AccountingDisplayProps = Omit<
  CalcDisplayProps,
  "expression" | "result"
> &
  Partial<Pick<CalcDisplayProps, "expression" | "result">> & {
  currencySymbol?: CalcDisplayProps["prefix"];
  noteInputClassName?: string;
  noteInputStyle?: React.CSSProperties;
  noteLabel?: string;
  notePlaceholder?: string;
  noteValue?: string;
  onNoteChange?: (value: string) => void;
};

export function AccountingDisplay(props: AccountingDisplayProps) {
  const {
    className,
    currencySymbol,
    expression = "",
    footer,
    noteInputClassName,
    noteInputStyle,
    noteLabel,
    notePlaceholder,
    noteValue,
    onNoteChange,
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
      createNoteInput({
        className: noteInputClassName,
        label: noteLabel,
        onChange: onNoteChange,
        placeholder: notePlaceholder,
        style: noteInputStyle,
        value: noteValue,
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
