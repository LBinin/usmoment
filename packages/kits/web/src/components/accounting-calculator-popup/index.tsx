import type React from "react";
import { Popup, type PopupProps } from "@usmoment/ui-web";
import clsx from "clsx";
import "./style.css";

export type AccountingCalculatorPopupProps = Omit<
  PopupProps,
  "children" | "placement"
> & {
  children?: React.ReactNode;
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
      contentClassName={clsx(
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
