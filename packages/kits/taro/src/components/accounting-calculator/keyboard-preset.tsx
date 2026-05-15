import React from "react";
import { BackspaceIcon } from "@usmoment/icon/taro";
import type { BusinessKeyboardProps } from "@usmoment/ui-taro";

export const accountingKeyboardPresetProps: Pick<
  BusinessKeyboardProps,
  | "columnGap"
  | "columnWidths"
  | "keyHeight"
  | "keys"
  | "layout"
  | "renderKey"
  | "rowGap"
> = {
  columnGap: "-4rpx",
  rowGap: "-4rpx",
  columnWidths: [1, 1, 1, 1.18],
  keyHeight: "114rpx",
  keys: [
    {
      id: "=",
      label: "=",
      action: "custom",
      payload: { shortcut: "equals" },
      variant: "operator",
    },
  ],
  layout: [
    ["7", "8", "9", "+"],
    ["4", "5", "6", "-"],
    ["1", "2", "3", "="],
    [".", "0", "backspace", "submit"],
  ],
  renderKey: ({ defaultNode, key }) =>
    key.id === "backspace" ? (
      <BackspaceIcon
        className="usm-accounting-calculator__backspace-icon"
        renderMode="mask"
      />
    ) : (
      defaultNode
    ),
};
