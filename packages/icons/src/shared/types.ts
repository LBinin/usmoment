import type React from "react";

export type IconProps = {
  className?: string;
  color?: string;
  height?: number | string;
  size?: number | string;
  style?: React.CSSProperties;
  title?: string;
  width?: number | string;
};

export type IconNodeName = keyof React.JSX.IntrinsicElements;

export type IconNode = {
  attrs?: Record<string, number | string | undefined>;
  children?: IconNode[];
  tag: IconNodeName;
};

export type IconDefinition = {
  children: IconNode[];
  componentName: string;
  height: number;
  name: string;
  viewBox: string;
  width: number;
};
