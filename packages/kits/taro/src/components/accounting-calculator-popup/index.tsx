import type React from "react";
import type { View } from "@tarojs/components";
import { Popup, type PopupProps } from "@usmoment/ui-taro";
import "./style.css";

type TaroRenderable = React.ComponentProps<typeof View>["children"];

export type AccountingCalculatorPopupProps = Omit<
  PopupProps,
  "children" | "placement"
> & {
  children?: TaroRenderable;
  placement?: "bottom";
};

const defaultOverlay = {
  visible: true,
  closeOnClick: true,
};

export function AccountingCalculatorPopup(
  props: AccountingCalculatorPopupProps,
) {
  const {
    animated = true,
    children,
    contentClassName,
    overlay = defaultOverlay,
    placement = "bottom",
    portal = true,
    reserveSpace = true,
    safeAreaInsetBottom = true,
    ...popupProps
  } = props;

  return (
    <Popup
      {...popupProps}
      animated={animated}
      contentClassName={joinClassNames(
        "usm-accounting-calculator-popup__content",
        contentClassName,
      )}
      overlay={overlay}
      placement={placement}
      portal={portal}
      reserveSpace={reserveSpace}
      safeAreaInsetBottom={safeAreaInsetBottom}
    >
      {children}
    </Popup>
  );
}

function joinClassNames(
  ...classNames: Array<string | false | null | undefined>
): string {
  return classNames.filter(Boolean).join(" ");
}
