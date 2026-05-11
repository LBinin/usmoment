import React from "react";
import { Input, Text, View } from "@tarojs/components";
import { YenCircleIcon } from "@usmoment/icon/taro";
import { hasAccountingExpressionOperator } from "@usmoment/kit-core";
import { CalcDisplay, type CalcDisplayProps } from "@usmoment/ui-taro";
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

function createNoteInput(options: {
  className?: string;
  label?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  style?: React.CSSProperties;
  value?: string;
}): CalcDisplayProps["footer"] {
  const inputProps = {
    className: joinClassNames(
      "usm-accounting-display__note-input",
      options.className,
    ),
    onInput: options.onChange
      ? (event: { detail: { value: string } }) =>
          options.onChange?.(event.detail.value)
      : undefined,
    placeholder: options.placeholder ?? "点击输入账单备注",
    placeholderStyle: "color: #AFAFAF",
    style: options.style,
    ...(options.value !== undefined ? { value: options.value } : {}),
  };

  return (
    <View className="usm-accounting-display__note">
      <Text className="usm-accounting-display__note-label">
        {options.label ?? "账单描述"}
      </Text>
      <Input {...inputProps} />
    </View>
  );
}

function joinClassNames(
  ...classNames: Array<string | false | null | undefined>
): string {
  return classNames.filter(Boolean).join(" ");
}
