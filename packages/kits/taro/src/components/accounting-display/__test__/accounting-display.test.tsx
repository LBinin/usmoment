import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { AccountingDisplay, type AccountingDisplayProps } from "..";

vi.mock("@tarojs/components", () => ({
  Input: "input",
  Text: "span",
  View: "div",
}));

describe("AccountingDisplay", () => {
  it("renders the accounting amount panel with default currency and bill name footer", () => {
    const element = AccountingDisplay({
      expression: "12+8",
      nameValue: "Lunch",
      result: "20.00",
    });

    expect(getElementProps(element).className).toContain("usm-accounting-display");
    expect(renderToStaticMarkup(element)).toContain("usm-icon-yen-circle");
    expect(getText(element)).toContain("账单名称");
    expect(findElementsByType(element, "input")[0].props).toMatchObject({
      cursorSpacing: 24,
      placeholder: "给账单起个名字吧",
      value: "Lunch",
    });
  });

  it("allows overriding the name input keyboard cursor spacing", () => {
    const element = AccountingDisplay({
      expression: "8",
      nameInputCursorSpacing: 40,
      result: "8.00",
    });
    const input = findElementsByType(element, "input")[0];

    expect(input.props).toMatchObject({
      cursorSpacing: 40,
    });
  });

  it("lets explicit CalcDisplay props override kit defaults", () => {
    const element = AccountingDisplay({
      expression: "12+8",
      footer: <strong>Custom footer</strong>,
      prefix: "$",
      result: "20.00",
    });

    expect(getText(element)).toContain("$");
    expect(getText(element)).toContain("Custom footer");
    expect(getText(element)).not.toContain("账单名称");
  });

  it("merges root classes and forwards name changes", () => {
    const changes: string[] = [];
    const element = AccountingDisplay({
      className: "custom-display",
      expression: "8",
      onNameChange: (value) => changes.push(value),
      result: "8.00",
    });
    const input = findElementsByType(element, "input")[0];

    expect(getElementProps(element).className).toContain("usm-accounting-display");
    expect(getElementProps(element).className).toContain("custom-display");
    getInputProps(input).onInput?.({ detail: { value: "Dinner" } });
    expect(changes).toEqual(["Dinner"]);
  });

  it("leaves the name input uncontrolled when no name value is provided", () => {
    const element = AccountingDisplay({
      expression: "8",
      result: "8.00",
    });
    const input = findElementsByType(element, "input")[0];

    expect(input.props).not.toHaveProperty("value");
  });

  it("exposes the bill name input props instead of the legacy note props", () => {
    type HasNameValue = "nameValue" extends keyof AccountingDisplayProps
      ? true
      : false;
    type HasLegacyNoteValue = "noteValue" extends keyof AccountingDisplayProps
      ? true
      : false;

    const hasNameValue: HasNameValue = true;
    const hasLegacyNoteValue: HasLegacyNoteValue = false;

    expect(hasNameValue).toBe(true);
    expect(hasLegacyNoteValue).toBe(false);
  });

  it.each([
    "2+3",
    "2-3",
    "2*3",
    "2/3",
    "2×3",
    "2÷3",
    "2*-3",
    "6/-2",
    "5+",
  ])("shows expression for accounting operator input %s", (expression) => {
    const element = AccountingDisplay({ expression, result: "0.00" });

    expect(getElementProps(element).className).toContain(
      "usm-calc-display--expression-visible",
    );
  });

  it.each(["-1", "-0.5", "52", "0.25", "", "."])(
    "hides expression for committed or plain value %s",
    (expression) => {
      const element = AccountingDisplay({
        expression,
        result: expression || "0.00",
      });

      expect(getElementProps(element).className).toContain(
        "usm-calc-display--expression-hidden",
      );
    },
  );

  it("lets explicit expression visibility override accounting defaults", () => {
    const hiddenElement = AccountingDisplay({
      expression: "2+3",
      expressionVisible: false,
      result: "5.00",
    });
    const visibleElement = AccountingDisplay({
      expression: "-1",
      expressionVisible: true,
      result: "-1.00",
    });

    expect(getElementProps(hiddenElement).className).toContain(
      "usm-calc-display--expression-hidden",
    );
    expect(getElementProps(visibleElement).className).toContain(
      "usm-calc-display--expression-visible",
    );
  });
});

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
  children?: React.ReactNode;
  className?: string;
};

function getElementProps(element: React.ReactElement): TestElementProps {
  return element.props as TestElementProps;
}

type TestInputProps = {
  onInput?: (event: { detail: { value: string } }) => void;
};

function getInputProps(element: React.ReactElement): TestInputProps {
  return element.props as TestInputProps;
}
