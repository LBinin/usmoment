import React from "react";
import type { IconDefinition, IconNode, IconProps } from "./types.js";

type IconBaseProps = IconProps & {
  definition: IconDefinition;
};

const defaultColor = "var(--usm-icon-color, currentColor)";
const defaultSize = "var(--usm-icon-size, 1em)";

export function IconBase(props: IconBaseProps) {
  const { definition } = props;
  const width = props.width ?? props.size ?? defaultSize;
  const height =
    props.height ??
    (typeof props.size === "number"
      ? props.size * (definition.height / definition.width)
      : props.size ?? `${definition.height / definition.width}em`);

  return (
    <svg
      aria-hidden={props.title ? undefined : true}
      aria-label={props.title}
      className={joinClassNames(
        "usm-icon",
        `usm-icon-${definition.name}`,
        props.className,
      )}
      fill="none"
      height={height}
      role={props.title ? "img" : undefined}
      style={props.style}
      viewBox={definition.viewBox}
      width={width}
      xmlns="http://www.w3.org/2000/svg"
    >
      {props.title ? <title>{props.title}</title> : null}
      {definition.children.map((node, index) =>
        renderIconNode(node, `${definition.name}-${index}`, props.color),
      )}
    </svg>
  );
}

function renderIconNode(
  node: IconNode,
  key: string,
  color: string | undefined,
): React.ReactElement {
  const attrs = applyColorOverride(node.attrs, color);

  return React.createElement(
    node.tag,
    { ...attrs, key },
    node.children?.map((child, index) =>
      renderIconNode(child, `${key}-${index}`, color),
    ),
  );
}

function applyColorOverride(
  attrs: IconNode["attrs"],
  color: string | undefined,
): IconNode["attrs"] {
  if (!color || !attrs) return attrs;

  return {
    ...attrs,
    fill: attrs.fill === defaultColor ? color : attrs.fill,
    stroke: attrs.stroke === defaultColor ? color : attrs.stroke,
  };
}

function joinClassNames(
  ...classNames: Array<string | false | null | undefined>
): string {
  return classNames.filter(Boolean).join(" ");
}
