import React from "react";

export function findElementsByType(
  node: React.ReactNode,
  type: string,
): React.ReactElement[] {
  return findElements(node, (element) => element.type === type);
}

export function renderElement(node: React.ReactNode): React.ReactElement {
  if (!React.isValidElement(node)) {
    throw new Error("Expected a valid React element.");
  }

  if (typeof node.type === "function") {
    return renderElement(node.type(getElementProps(node)));
  }

  return node;
}

function findElements(
  node: React.ReactNode,
  predicate: (element: React.ReactElement) => boolean,
): React.ReactElement[] {
  if (!React.isValidElement(node)) return [];

  const matches = predicate(node) ? [node] : [];
  const children = React.Children.toArray(
    getElementProps(node).children,
  ).flatMap((child) => findElements(child, predicate));

  return [...matches, ...children];
}

type TestElementProps = {
  "aria-hidden"?: boolean;
  "aria-label"?: string;
  children?: React.ReactNode;
  className?: string;
  height?: number | string;
  role?: string;
  style?: React.CSSProperties;
  viewBox?: string;
  width?: number | string;
};

export function getElementProps(
  element: React.ReactElement,
): TestElementProps {
  return element.props as TestElementProps;
}
