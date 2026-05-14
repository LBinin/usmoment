import React from "react";
import clsx from "clsx";
import { toNonNegativePx } from "../../shared/css-length";

export function renderPlaceholder(input: {
  measuredHeight: number;
  placeholderClassName?: string;
  placeholderStyle?: React.CSSProperties;
  reserveSpace?: boolean | number;
}): React.ReactElement | null {
  if (input.reserveSpace === false || input.reserveSpace === undefined) {
    return null;
  }

  const height =
    typeof input.reserveSpace === "number"
      ? toNonNegativePx(input.reserveSpace)
      : toNonNegativePx(input.measuredHeight);

  return (
    <div
      aria-hidden
      className={clsx(
        "usm-popup__placeholder",
        input.placeholderClassName,
      )}
      style={{
        height,
        ...input.placeholderStyle,
      }}
    />
  );
}
