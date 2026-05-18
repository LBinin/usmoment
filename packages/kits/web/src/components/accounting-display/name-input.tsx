import React from "react";
import clsx from "clsx";

export function createNameInput(options: {
  className?: string;
  label?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  style?: React.CSSProperties;
  value?: string;
}): React.ReactNode {
  const inputProps = {
    className: clsx(
      "usm-accounting-display__name-input",
      options.className,
    ),
    onChange: options.onChange
      ? (event: React.ChangeEvent<HTMLInputElement>) =>
          options.onChange?.(event.currentTarget.value)
      : undefined,
    placeholder: options.placeholder ?? "给账单起个名字吧",
    style: options.style,
    ...(options.value !== undefined ? { value: options.value } : {}),
  };

  return (
    <label className="usm-accounting-display__name">
      <span className="usm-accounting-display__name-label">
        {options.label ?? "账单名称"}
      </span>
      <input {...inputProps} />
    </label>
  );
}
