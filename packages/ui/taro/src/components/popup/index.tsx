import React from "react";
import { RootPortal, View } from "@tarojs/components";
import "./style.css";

export type TaroRenderable = React.ComponentProps<typeof View>["children"];

export type PopupPlacement = "bottom" | "top" | "center";

export type PopupOpenChangeReason = "overlay-click" | "controlled";

export type PopupOverlayOptions = {
  visible?: boolean;
  closeOnClick?: boolean;
  className?: string;
  style?: React.CSSProperties;
};

export type PopupProps = {
  open: boolean;
  children?: TaroRenderable;
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
  const contentRef = React.useRef<unknown>(null);
  const contentIdRef = React.useRef(
    `usm-popup-content-${Math.random().toString(36).slice(2)}`,
  );
  const previousOpenRef = React.useRef(false);

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
            afterOpenTimer = setTimeout(() => props.onAfterOpen?.(), duration);
            return;
          }

          props.onAfterOpen?.();
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
      props.onAfterClose?.();
      return undefined;
    }

    setIsActive(false);
    setIsClosing(true);
    const timer = setTimeout(() => {
      setShouldRender(false);
      setIsClosing(false);
      props.onAfterClose?.();
    }, duration);

    return () => clearTimeout(timer);
  }, [
    animated,
    duration,
    props.open,
    props.onAfterClose,
    props.onAfterOpen,
    shouldRender,
  ]);

  React.useLayoutEffect(() => {
    if (!shouldRender) return undefined;

    let cancelled = false;
    measureContentHeight(contentRef.current, contentIdRef.current, (height) => {
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
    <View
      className={joinClassNames(
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
        <View
          aria-hidden
          className={joinClassNames(
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
      <View
        className={joinClassNames("usm-popup__content", props.contentClassName)}
        id={contentIdRef.current}
        ref={contentRef as React.Ref<HTMLDivElement>}
        style={props.contentStyle}
      >
        {props.children}
      </View>
    </View>
  );

  return (
    <>
      {placeholder}
      {portal ? <RootPortal>{popup}</RootPortal> : popup}
    </>
  );
}

function renderPlaceholder(input: {
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
      ? toPx(input.reserveSpace)
      : toPx(input.measuredHeight);

  return (
    <View
      aria-hidden
      className={joinClassNames(
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

function resolveOverlayOptions(
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

function measureContentHeight(
  node: unknown,
  id: string,
  onHeight: (height: number) => void,
): void {
  const refHeight = readElementHeight(node);

  if (refHeight !== undefined) {
    onHeight(refHeight);
    return;
  }

  measureSelectorHeight(id, onHeight);
}

function readElementHeight(node: unknown): number | undefined {
  if (!node || typeof node !== "object") return undefined;

  const element = node as {
    getBoundingClientRect?: () => { height?: number };
    offsetHeight?: number;
  };
  const rectHeight = element.getBoundingClientRect?.().height;

  if (typeof rectHeight === "number" && Number.isFinite(rectHeight)) {
    return rectHeight;
  }

  if (
    typeof element.offsetHeight === "number" &&
    Number.isFinite(element.offsetHeight)
  ) {
    return element.offsetHeight;
  }

  return undefined;
}

type SelectorQueryHost = {
  createSelectorQuery?: () => {
    exec?: (callback?: (result: Array<{ height?: number }>) => void) => void;
    select?: (selector: string) => {
      boundingClientRect?: () => unknown;
    };
  };
};

function measureSelectorHeight(
  id: string,
  onHeight: (height: number) => void,
): void {
  const host = globalThis as { Taro?: SelectorQueryHost; wx?: SelectorQueryHost };
  const query =
    host.Taro?.createSelectorQuery?.() ?? host.wx?.createSelectorQuery?.();
  const selection = query?.select?.(`#${id}`);

  if (!selection?.boundingClientRect || !query?.exec) return;

  selection.boundingClientRect();
  query.exec((result) => {
    const height = result?.[0]?.height;

    if (typeof height === "number" && Number.isFinite(height)) {
      onHeight(height);
    }
  });
}

function joinClassNames(
  ...classNames: Array<string | false | null | undefined>
): string {
  return classNames.filter(Boolean).join(" ");
}

function toPx(value: number): string {
  return `${Math.max(0, value)}px`;
}
