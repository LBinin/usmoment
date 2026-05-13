import React from "react";
import { BackspaceIcon } from "@usmoment/icon";
import type { BusinessKeyboardProps } from "@usmoment/ui-web";

export const accountingKeyboardPresetProps: Pick<
  BusinessKeyboardProps,
  | "columnGap"
  | "columnWidths"
  | "keyFontFamily"
  | "keyHeight"
  | "keys"
  | "layout"
  | "renderKey"
  | "rowGap"
> = {
  columnGap: "-2px",
  columnWidths: [1, 1, 1, 1.18],
  keyFontFamily: '"Montserrat", "Avenir Next", sans-serif',
  keyHeight: 65,
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
  rowGap: "-2px",
};
