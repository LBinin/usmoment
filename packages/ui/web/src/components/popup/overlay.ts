import type { PopupOverlayOptions, PopupProps } from "./index";

export function resolveOverlayOptions(
  overlay: PopupProps["overlay"],
): Required<Pick<PopupOverlayOptions, "closeOnClick" | "visible">> &
  Pick<PopupOverlayOptions, "className" | "style"> {
  if (overlay === undefined || overlay === false) {
    return { closeOnClick: true, visible: false };
  }

  if (overlay === true) {
    return { closeOnClick: true, visible: true };
  }

  return {
    closeOnClick: overlay.closeOnClick ?? true,
    visible: overlay.visible ?? true,
    className: overlay.className,
    style: overlay.style,
  };
}
