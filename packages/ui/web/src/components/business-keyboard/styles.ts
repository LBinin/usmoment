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
    style["--usm-keyboard-gap"] = toCssLength(props.gap, "px");
    style["--usm-keyboard-row-gap"] = toCssLength(props.gap, "px");
    style["--usm-keyboard-column-gap"] = toCssLength(props.gap, "px");
  }

  if (props.rowGap !== undefined) {
    style["--usm-keyboard-row-gap"] = toCssLength(props.rowGap, "px");
  }

  if (props.columnGap !== undefined) {
    style["--usm-keyboard-column-gap"] = toCssLength(props.columnGap, "px");
  }

  if (props.keyHeight !== undefined) {
    style["--usm-keyboard-key-height"] = toCssLength(props.keyHeight, "px");
  }

  if (props.keyFontFamily?.trim()) {
    style["--usm-keyboard-key-font-family"] = props.keyFontFamily;
  }

  return style;
}

export function resolveKeyTrackStyle(
  key: BusinessKeyboardResolvedKey,
  keyIndex: number,
  columnWidths: BusinessKeyboardProps["columnWidths"],
): CSSProperties {
  const weight = resolveKeyTrackWeight(key, keyIndex, columnWidths);

  return {
    flex: `${weight} ${weight} 0%`,
    width: 0,
  };
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
