import React from "react";
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { CalcDisplay } from "..";

describe("CalcDisplay", () => {
  it("renders prefix, header, result, expression, and footer regions", () => {
    const element = CalcDisplay({
      expression: "12+3",
      footer: <input aria-label="Bill note" />,
      header: <strong>Header</strong>,
      prefix: "¥",
      result: "15",
    });

    expect(getText(element)).toContain("¥");
    expect(getText(element)).toContain("Header");
    expect(getText(element)).toContain("15");
    expect(getText(element)).toContain("12+3");
    expect(findElementsByClassName(element, "usm-calc-display__footer")).toHaveLength(1);
    expect(findElementsByType(element, "input")).toHaveLength(1);
  });

  it("keeps expression hidden by default", () => {
    const element = CalcDisplay({ expression: "12+3", result: "15" });
    const expression = findElementsByClassName(
      element,
      "usm-calc-display__expression",
    )[0];
    const result = findElementsByClassName(element, "usm-calc-display__result")[0];

    expect(getElementProps(element).className).toContain(
      "usm-calc-display--expression-hidden",
    );
    expect(getElementProps(expression)["aria-hidden"]).toBe(true);
    expect(getElementProps(result).style).toMatchObject({
      transform: "scale(var(--usm-calc-display-result-scale, 1.5))",
    });
  });

  it("shows expression when expression visibility is enabled", () => {
    const element = CalcDisplay({
      expression: "12+3",
      expressionVisible: true,
      result: "15",
    });
    const expression = findElementsByClassName(
      element,
      "usm-calc-display__expression",
    )[0];
    const result = findElementsByClassName(element, "usm-calc-display__result")[0];

    expect(getElementProps(element).className).toContain(
      "usm-calc-display--expression-visible",
    );
    expect(getElementProps(expression)["aria-hidden"]).toBe(false);
    expect(getElementProps(result).style).toMatchObject({
      transform: "scale(1)",
    });
  });

  it("keeps the expression row hidden when expression is empty", () => {
    const element = CalcDisplay({
      expression: "",
      expressionVisible: true,
      result: "20",
    });
    const expression = findElementsByClassName(
      element,
      "usm-calc-display__expression",
    )[0];

    expect(getElementProps(element).className).toContain(
      "usm-calc-display--expression-hidden",
    );
    expect(getElementProps(expression)["aria-hidden"]).toBe(true);
    expect(getElementProps(expression).children).toBe("");
  });

  it("allows callers to override expression visibility and disable motion", () => {
    const element = CalcDisplay({
      animated: false,
      expression: "123",
      expressionVisible: true,
      result: "123",
    });
    const expression = findElementsByClassName(
      element,
      "usm-calc-display__expression",
    )[0];

    expect(getElementProps(element).className).toContain(
      "usm-calc-display--motionless",
    );
    expect(getElementProps(expression)["aria-hidden"]).toBe(false);
  });

  it("supports class and style extension on key regions", () => {
    const element = CalcDisplay({
      bodyClassName: "body-extra",
      bodyStyle: { background: "white" },
      expression: "12",
      result: "12",
      resultClassName: "result-extra",
      resultStyle: { color: "orange" },
    });
    const body = findElementsByClassName(element, "usm-calc-display__body")[0];
    const result = findElementsByClassName(element, "usm-calc-display__result")[0];

    expect(getElementProps(body).className).toContain("body-extra");
    expect(getElementProps(body).style).toMatchObject({ background: "white" });
    expect(getElementProps(result).className).toContain("result-extra");
    expect(getElementProps(result).style).toMatchObject({ color: "orange" });
  });

  it("keeps slot containers free of presentational chrome", () => {
    const css = readFileSync(new URL("../style.css", import.meta.url), "utf8");

    for (const selector of [
      ".usm-calc-display__header",
      ".usm-calc-display__footer",
      ".usm-calc-display__prefix",
    ]) {
      expect(extractCssRule(css, selector)).not.toMatch(
        /\b(background|border|margin|padding)\s*:/,
      );
    }
  });

  it("does not expose legacy note in the UI props contract", () => {
    type HasNote = "note" extends keyof React.ComponentProps<typeof CalcDisplay>
      ? true
      : false;
    const hasNote: HasNote = false;

    expect(hasNote).toBe(false);
  });
});

function extractCssRule(css: string, selector: string): string {
  const escapedSelector = selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = css.match(new RegExp(`${escapedSelector}\\s*\\{([^}]*)\\}`));

  return match?.[1] ?? "";
}

function findElementsByClassName(
  node: React.ReactNode,
  className: string,
): React.ReactElement[] {
  return findElements(node, (element) =>
    String(getElementProps(element).className ?? "")
      .split(" ")
      .includes(className),
  );
}

function findElementsByType(
  node: React.ReactNode,
  type: string,
): React.ReactElement[] {
  return findElements(node, (element) => element.type === type);
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

function getText(node: React.ReactNode): string {
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (!React.isValidElement(node)) return "";

  return React.Children.toArray(getElementProps(node).children)
    .map(getText)
    .join("");
}

type TestElementProps = {
  "aria-hidden"?: boolean;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
};

function getElementProps(element: React.ReactElement): TestElementProps {
  return element.props as TestElementProps;
}
