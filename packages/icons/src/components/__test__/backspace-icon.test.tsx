import React from "react";
import { describe, expect, it } from "vitest";
import { BackspaceIcon } from "../backspace-icon";
import { iconMetadata } from "../../metadata";

describe("BackspaceIcon", () => {
  it("renders the provided backspace svg geometry with accessible title support", () => {
    const element = renderElement(
      BackspaceIcon({
        className: "demo-icon",
        size: 25,
        style: { display: "block" },
        title: "Backspace",
      }),
    );

    expect(element.type).toBe("svg");
    expect(getElementProps(element)).toMatchObject({
      "aria-hidden": undefined,
      "aria-label": "Backspace",
      className: "usm-icon usm-icon-backspace demo-icon",
      height: 19,
      role: "img",
      style: { display: "block" },
      viewBox: "0 0 25 19",
      width: 25,
    });
    expect(findElementsByType(element, "title")).toHaveLength(1);
    expect(findElementsByType(element, "path")[0]?.props).toMatchObject({
      d: expect.stringContaining("M20.7613 1.5H8.65138"),
      fill: "var(--usm-icon-color, currentColor)",
      fillRule: "evenodd",
    });
    expect(findElementsByType(element, "linearGradient")).toHaveLength(0);
  });

  it("defaults to themeable em sizing", () => {
    const element = renderElement(BackspaceIcon({}));

    expect(getElementProps(element)).toMatchObject({
      height: "0.76em",
      width: "var(--usm-icon-size, 1em)",
    });
  });

  it("supports explicit color override without embedding gradients", () => {
    const element = renderElement(
      BackspaceIcon({ color: "var(--demo-icon-color)" }),
    );

    expect(findElementsByType(element, "path")[0]?.props.fill).toBe(
      "var(--demo-icon-color)",
    );
    expect(findElementsByType(element, "defs")).toHaveLength(0);
  });

  it("hides decorative usage from assistive technology when no title is provided", () => {
    const element = renderElement(BackspaceIcon({}));

    expect(getElementProps(element)["aria-hidden"]).toBe(true);
    expect(getElementProps(element).role).toBeUndefined();
    expect(findElementsByType(element, "title")).toHaveLength(0);
  });

  it("exposes metadata for docs search and category filtering", () => {
    expect(iconMetadata.backspace).toMatchObject({
      category: "action",
      componentName: "BackspaceIcon",
      name: "backspace",
      source: {
        provider: "custom",
      },
    });
  });
});

function findElementsByType(
  node: React.ReactNode,
  type: string,
): React.ReactElement[] {
  return findElements(node, (element) => element.type === type);
}

function renderElement(node: React.ReactNode): React.ReactElement {
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

function getElementProps(element: React.ReactElement): TestElementProps {
  return element.props as TestElementProps;
}
