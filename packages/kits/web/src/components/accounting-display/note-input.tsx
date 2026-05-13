import React from "react";
import clsx from "clsx";

export function createNoteInput(options: {
  className?: string;
  label?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  style?: React.CSSProperties;
  value?: string;
}): React.ReactNode {
  const inputProps = {
    className: clsx(
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
