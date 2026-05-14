import React from "react";
import { createPortal } from "react-dom";
import clsx from "clsx";
import { measureContentHeight } from "./measure";
import { resolveOverlayOptions } from "./overlay";
import { renderPlaceholder } from "./placeholder";
import "./style.css";

export type PopupRenderable = React.ReactNode;

export type PopupPlacement = "bottom" | "top" | "center";

export type PopupOpenChangeReason = "overlay-click";

export type PopupOverlayOptions = {
  visible?: boolean;
  closeOnClick?: boolean;
  className?: string;
  style?: React.CSSProperties;
};

export type PopupProps = {
  open: boolean;
  children?: PopupRenderable;
  placement?: PopupPlacement;
  portal?: boolean;
  reserveSpace?: boolean | number;
  safeAreaInsetBottom?: boolean;
  animated?: boolean;
  duration?: number;
  overlay?: boolean | PopupOverlayOptions;
  className?: string;
  style?: React.CSSProperties;
  contentClassName?: string;
  contentStyle?: React.CSSProperties;
  placeholderClassName?: string;
  placeholderStyle?: React.CSSProperties;
  overlayClassName?: string;
  overlayStyle?: React.CSSProperties;
  zIndex?: number;
  onOpenChange?: (open: boolean, reason: PopupOpenChangeReason) => void;
  onContentHeightChange?: (height: number) => void;
  onAfterOpen?: () => void;
  onAfterClose?: () => void;
};

export function Popup(props: PopupProps) {
  const animated = props.animated ?? true;
  const duration = props.duration ?? 240;
  const placement = props.placement ?? "bottom";
  const portal = props.portal ?? true;
  const [shouldRender, setShouldRender] = React.useState(props.open);
  const [isActive, setIsActive] = React.useState(false);
  const [isClosing, setIsClosing] = React.useState(false);
  const [measuredHeight, setMeasuredHeight] = React.useState(0);
  const contentRef = React.useRef<HTMLDivElement>(null);
  const previousOpenRef = React.useRef(false);
  const onAfterOpenRef = React.useRef(props.onAfterOpen);
  const onAfterCloseRef = React.useRef(props.onAfterClose);

  onAfterOpenRef.current = props.onAfterOpen;
  onAfterCloseRef.current = props.onAfterClose;

  React.useEffect(() => {
    if (props.open) {
      setShouldRender(true);
      setIsClosing(false);

      if (!previousOpenRef.current) {
        previousOpenRef.current = true;
        let afterOpenTimer: ReturnType<typeof setTimeout> | undefined;

        const activate = () => {
          setIsActive(true);

          if (animated) {
            afterOpenTimer = setTimeout(
              () => onAfterOpenRef.current?.(),
              duration,
            );
            return;
          }

          onAfterOpenRef.current?.();
        };

        if (animated) {
          const mountTimer = setTimeout(activate, 16);
          return () => {
            clearTimeout(mountTimer);
            if (afterOpenTimer) clearTimeout(afterOpenTimer);
          };
        }

        activate();
        return undefined;
      }

      setIsActive(true);
      return undefined;
    }

    if (!previousOpenRef.current) {
      return undefined;
    }

    previousOpenRef.current = false;

    if (!shouldRender) {
      return undefined;
    }

    if (!animated) {
      setShouldRender(false);
      setIsClosing(false);
      setIsActive(false);
      onAfterCloseRef.current?.();
      return undefined;
    }

    setIsActive(false);
    setIsClosing(true);
    const timer = setTimeout(() => {
      setShouldRender(false);
      setIsClosing(false);
      onAfterCloseRef.current?.();
    }, duration);

    return () => clearTimeout(timer);
  }, [animated, duration, props.open]);

  React.useLayoutEffect(() => {
    if (!shouldRender) return undefined;

    let cancelled = false;

    measureContentHeight(contentRef.current, (height) => {
      if (cancelled) return;

      setMeasuredHeight((current) => (current === height ? current : height));
      props.onContentHeightChange?.(height);
    });

    return () => {
      cancelled = true;
    };
  }, [props.onContentHeightChange, shouldRender, props.children]);

  const placeholder = shouldRender
    ? renderPlaceholder({
        measuredHeight,
        placeholderClassName: props.placeholderClassName,
        placeholderStyle: props.placeholderStyle,
        reserveSpace: props.reserveSpace,
      })
    : null;

  if (!shouldRender) return null;

  const overlayOptions = resolveOverlayOptions(props.overlay);
  const popup = (
    <div
      className={clsx(
        "usm-popup",
        isActive && !isClosing && "usm-popup--open",
        isClosing && "usm-popup--closing",
        `usm-popup--placement-${placement}`,
        !animated && "usm-popup--motionless",
        props.safeAreaInsetBottom && "usm-popup--safe-area-inset-bottom",
        props.className,
      )}
      style={{
        "--usm-popup-duration": `${duration}ms`,
        zIndex: props.zIndex,
        ...props.style,
      } as React.CSSProperties}
    >
      {overlayOptions.visible && (
        <div
          aria-hidden
          className={clsx(
            "usm-popup__overlay",
            overlayOptions.className,
            props.overlayClassName,
          )}
          onClick={() => {
            if (overlayOptions.closeOnClick) {
              props.onOpenChange?.(false, "overlay-click");
            }
          }}
          style={{
            ...overlayOptions.style,
            ...props.overlayStyle,
          }}
        />
      )}
      <div
        className={clsx("usm-popup__content", props.contentClassName)}
        ref={contentRef}
        style={props.contentStyle}
      >
        {props.children}
      </div>
    </div>
  );

  return (
    <>
      {placeholder}
      {portal && typeof document !== "undefined"
        ? createPortal(popup, document.body)
        : popup}
    </>
  );
}
