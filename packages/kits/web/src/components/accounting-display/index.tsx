import React from "react";
import { hasAccountingExpressionOperator } from "@usmoment/kit-core";
import { CalcDisplay, type CalcDisplayProps } from "@usmoment/ui-web";
import "./style.css";

export type AccountingDisplayProps = Omit<
  CalcDisplayProps,
  "expression" | "result"
> &
  Partial<Pick<CalcDisplayProps, "expression" | "result">> & {
  currencySymbol?: string;
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
    className: joinClassNames("usm-accounting-display", className),
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
    prefix: prefix ?? currencySymbol ?? "¥",
    result,
    shouldShowExpression: shouldShowExpression ?? hasAccountingExpressionOperator,
  });
}

function createNoteInput(options: {
  className?: string;
  label?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  style?: React.CSSProperties;
  value?: string;
}): React.ReactNode {
  const inputProps = {
    className: joinClassNames(
      "usm-accounting-display__note-input",
      options.className,
    ),
    onChange: options.onChange
      ? (event: React.ChangeEvent<HTMLInputElement>) =>
          options.onChange?.(event.currentTarget.value)
      : undefined,
    placeholder: options.placeholder ?? "点击输入账单备注",
    style: options.style,
    ...(options.value !== undefined ? { value: options.value } : {}),
  };

  return (
    <label className="usm-accounting-display__note">
      <span className="usm-accounting-display__note-label">
        {options.label ?? "账单描述"}
      </span>
      <input {...inputProps} />
    </label>
  );
}

function joinClassNames(
  ...classNames: Array<string | false | null | undefined>
): string {
  return classNames.filter(Boolean).join(" ");
}
