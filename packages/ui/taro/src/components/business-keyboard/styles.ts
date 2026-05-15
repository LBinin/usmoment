import type { CSSProperties } from "react";
import type { BusinessKeyboardResolvedKey } from "@usmoment/headless";
import { toCssLength } from "../../shared/css-length";
import type { BusinessKeyboardProps } from "./index";

export function resolveRootStyle(
  props: Pick<
    BusinessKeyboardProps,
    "columnGap" | "gap" | "keyFontFamily" | "keyHeight" | "rowGap"
  >,
): CSSProperties {
  const style = {} as CSSProperties & Record<string, string>;

  if (props.gap !== undefined) {
    style["--usm-keyboard-gap"] = toCssLength(props.gap, "rpx");
    style["--usm-keyboard-row-gap"] = toCssLength(props.gap, "rpx");
    style["--usm-keyboard-column-gap"] = toCssLength(props.gap, "rpx");
  }

  if (props.rowGap !== undefined) {
    style["--usm-keyboard-row-gap"] = toCssLength(props.rowGap, "rpx");
  }

  if (props.columnGap !== undefined) {
    style["--usm-keyboard-column-gap"] = toCssLength(props.columnGap, "rpx");
  }

  if (props.keyHeight !== undefined) {
    style["--usm-keyboard-key-height"] = toCssLength(props.keyHeight, "rpx");
  }

  if (props.keyFontFamily?.trim()) {
    style["--usm-keyboard-key-font-family"] = props.keyFontFamily;
  }

  return style;
}

export function resolveRowStyle(
  rowIndex: number,
  props: Pick<BusinessKeyboardProps, "gap" | "rowGap">,
): CSSProperties {
  if (rowIndex === 0) return {};

  return {
    marginTop: toCssLength(props.rowGap ?? props.gap ?? 8, "rpx"),
  };
}

export function resolveKeyTrackStyle(
  key: BusinessKeyboardResolvedKey,
  keyIndex: number,
  props: Pick<
    BusinessKeyboardProps,
    "columnGap" | "columnWidths" | "gap" | "keyFontFamily" | "keyHeight"
  >,
): CSSProperties {
  const weight = resolveKeyTrackWeight(key, keyIndex, props.columnWidths);
  const style: CSSProperties = {
    flex: `${weight} ${weight} 0%`,
    height: toCssLength(props.keyHeight ?? 60, "rpx"),
    marginLeft:
      keyIndex === 0
        ? undefined
        : toCssLength(props.columnGap ?? props.gap ?? 8, "rpx"),
    width: 0,
  };

  if (props.keyFontFamily?.trim()) {
    style.fontFamily = props.keyFontFamily;
  }

  return style;
}

function resolveKeyTrackWeight(
  key: BusinessKeyboardResolvedKey,
  keyIndex: number,
  columnWidths: BusinessKeyboardProps["columnWidths"],
): number {
  const fallbackWeight = Math.max(1, key.span);

  if (!columnWidths?.length) return fallbackWeight;

  const value = columnWidths[keyIndex];

  return typeof value === "number" && Number.isFinite(value)
    ? value
    : fallbackWeight;
}
