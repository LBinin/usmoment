import React from "react";
import type { IconDefinition, IconProps } from "./types.js";
import { createSvgDataUrl } from "./svg-data-url.js";

type TaroIconBaseProps = IconProps & {
  definition: IconDefinition;
};

const defaultSize = "var(--usm-icon-size, 1em)";

export function TaroIconBase(props: TaroIconBaseProps) {
  const { definition } = props;
  const width = props.width ?? props.size ?? defaultSize;
  const height =
    props.height ??
    (typeof props.size === "number"
      ? props.size * (definition.height / definition.width)
      : props.size ?? `${definition.height / definition.width}em`);
  const className = joinClassNames(
    "usm-icon",
    `usm-icon-${definition.name}`,
    props.renderMode === "mask" && "usm-icon--mask",
    props.className,
  );

  if (props.renderMode === "mask") {
    const maskSource = createSvgDataUrl(definition, "#000");
    const maskStyle = {
      display: "block",
      maskImage: `url("${maskSource}")`,
      maskPosition: "center",
      maskRepeat: "no-repeat",
      maskSize: "contain",
      WebkitMaskImage: `url("${maskSource}")`,
      WebkitMaskPosition: "center",
      WebkitMaskRepeat: "no-repeat",
      WebkitMaskSize: "contain",
      "-webkit-mask-image": `url("${maskSource}")`,
      "-webkit-mask-position": "center",
      "-webkit-mask-repeat": "no-repeat",
      "-webkit-mask-size": "contain",
      ...resolveExplicitSizeStyle(props, definition),
      ...props.style,
    } as React.CSSProperties;

    return React.createElement("view", {
      "aria-hidden": props.title ? undefined : true,
      "aria-label": props.title,
      className,
      role: props.title ? "img" : undefined,
      style: maskStyle,
    });
  }

  const source = createSvgDataUrl(definition, props.color ?? "#000");
  const style = {
    display: "block",
    height,
    verticalAlign: "-0.125em",
    width,
    ...props.style,
  } as React.CSSProperties;

  return React.createElement("image", {
    "aria-hidden": props.title ? undefined : true,
    "aria-label": props.title,
    className,
    mode: "aspectFit",
    role: props.title ? "img" : undefined,
    src: source,
    style,
  });
}

function resolveExplicitSizeStyle(
  props: IconProps,
  definition: IconDefinition,
): React.CSSProperties {
  if (props.width === undefined && props.height === undefined && props.size === undefined) {
    return {};
  }

  const width = props.width ?? props.size;
  const height =
    props.height ??
    (typeof props.size === "number"
      ? props.size * (definition.height / definition.width)
      : props.size);

  return {
    ...(height !== undefined ? { height } : {}),
    ...(width !== undefined ? { width } : {}),
  };
}

function joinClassNames(
  ...classNames: Array<string | false | null | undefined>
): string {
  return classNames.filter(Boolean).join(" ");
}
