import React from "react";
import { describe, expect, it, vi } from "vitest";
import { FullscreenOptionList } from "..";
import { FullscreenOptionList as ExportedFullscreenOptionList } from "../../../index";

vi.mock("@tarojs/components", () => ({
  View: "div",
}));

type TestOption = {
  label: string;
};

const options = [
  { key: "food", data: { label: "Food" } },
  { key: "rent", data: { label: "Rent" } },
  { key: "plus/bonus", data: { label: "Bonus" } },
  { key: "locked", disabled: true, data: { label: "Locked" } },
] satisfies Array<{ key: string; disabled?: boolean; data?: TestOption }>;

describe("FullscreenOptionList", () => {
  it("renders a grid with the configured columns CSS variable", () => {
    const element = FullscreenOptionList({ options, columns: 3 });
    const grid = findElementsByClassName(
      element,
      "usm-fullscreen-option-list__grid",
    )[0];

    expect(getElementProps(element).className).toContain(
      "usm-fullscreen-option-list",
    );
    expect(getElementProps(element).style).toMatchObject({
      "--usm-fullscreen-option-list-columns": 3,
    });
    expect(getElementProps(grid).style).toMatchObject({
      gridTemplateColumns: "repeat(var(--usm-fullscreen-option-list-columns, 4), minmax(0, 1fr))",
    });
  });

  it("normalizes invalid column counts to a positive integer", () => {
    const zeroColumns = FullscreenOptionList({ options, columns: 0 });
    const fractionalColumns = FullscreenOptionList({ options, columns: 2.8 });

    expect(getElementProps(zeroColumns).style).toMatchObject({
      "--usm-fullscreen-option-list-columns": 1,
    });
    expect(getElementProps(fractionalColumns).style).toMatchObject({
      "--usm-fullscreen-option-list-columns": 2,
    });
  });

  it("applies grid class and style extension props to the grid region", () => {
    const element = FullscreenOptionList({
      options,
      gridClassName: "custom-grid",
      gridStyle: { rowGap: 12 },
    });
    const grid = findElementsByClassName(
      element,
      "usm-fullscreen-option-list__grid",
    )[0];

    expect(getElementProps(grid).className).toContain(
      "usm-fullscreen-option-list__grid",
    );
    expect(getElementProps(grid).className).toContain("custom-grid");
    expect(getElementProps(grid).style).toMatchObject({
      gridTemplateColumns: "repeat(var(--usm-fullscreen-option-list-columns, 4), minmax(0, 1fr))",
      rowGap: 12,
    });
  });

  it("passes selected, disabled, and index state to renderOption", () => {
    const renderOption = vi.fn(({ option, selected, disabled, index }) => (
      <span>
        {option.data?.label}:{String(selected)}:{String(disabled)}:{index}
      </span>
    ));

    const element = FullscreenOptionList({
      options,
      selectedKey: "rent",
      renderOption,
    });

    expect(renderOption).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        option: options[1],
        selected: true,
        disabled: false,
        index: 1,
      }),
    );
    expect(renderOption).toHaveBeenNthCalledWith(
      4,
      expect.objectContaining({
        option: options[3],
        selected: false,
        disabled: true,
        index: 3,
      }),
    );
    expect(getText(element)).toContain("Rent:true:false:1");
    expect(getText(element)).toContain("Locked:false:true:3");
  });

  it("dispatches option click and change when an enabled unselected option is clicked", () => {
    const onChange = vi.fn();
    const onOptionClick = vi.fn();
    const element = FullscreenOptionList({
      options,
      selectedKey: "food",
      onChange,
      onOptionClick,
    });
    const optionNodes = findElementsByClassName(
      element,
      "usm-fullscreen-option-list__option",
    );
    const nativeEvent = { type: "tap" };

    getElementProps(optionNodes[1]).onClick?.(nativeEvent);

    expect(onOptionClick).toHaveBeenCalledWith({
      key: "rent",
      option: options[1],
      selected: false,
      nativeEvent,
    });
    expect(onChange).toHaveBeenCalledWith({
      key: "rent",
      option: options[1],
      nativeEvent,
    });
  });

  it("dispatches only option click when the current option is clicked", () => {
    const onChange = vi.fn();
    const onOptionClick = vi.fn();
    const element = FullscreenOptionList({
      options,
      selectedKey: "rent",
      onChange,
      onOptionClick,
    });
    const optionNodes = findElementsByClassName(
      element,
      "usm-fullscreen-option-list__option",
    );
    const nativeEvent = { type: "tap" };

    getElementProps(optionNodes[1]).onClick?.(nativeEvent);

    expect(onOptionClick).toHaveBeenCalledWith({
      key: "rent",
      option: options[1],
      selected: true,
      nativeEvent,
    });
    expect(onChange).not.toHaveBeenCalled();
  });

  it("does not dispatch any event for disabled options", () => {
    const onChange = vi.fn();
    const onOptionClick = vi.fn();
    const element = FullscreenOptionList({
      options,
      onChange,
      onOptionClick,
    });
    const optionNodes = findElementsByClassName(
      element,
      "usm-fullscreen-option-list__option",
    );

    getElementProps(optionNodes[3]).onClick?.({ type: "tap" });

    expect(onOptionClick).not.toHaveBeenCalled();
    expect(onChange).not.toHaveBeenCalled();
    expect(getElementProps(optionNodes[3]).className).toContain(
      "usm-fullscreen-option-list__option--disabled",
    );
    expect(getElementProps(optionNodes[3])["aria-disabled"]).toBe(true);
  });

  it("resolves option class and style extension functions", () => {
    const element = FullscreenOptionList({
      options,
      selectedKey: "plus/bonus",
      optionClassName: ({ option, selected, disabled, index }) =>
        [
          `custom-${option.key}`,
          selected && "is-selected",
          disabled && "is-disabled",
          `index-${index}`,
        ]
          .filter(Boolean)
          .join(" "),
      optionStyle: ({ option, selected, disabled, index }) => ({
        opacity: disabled ? 0.3 : 1,
        order: index,
        color: selected ? "red" : option.key,
      }),
    });
    const optionNodes = findElementsByClassName(
      element,
      "usm-fullscreen-option-list__option",
    );

    expect(getElementProps(optionNodes[2]).className).toContain(
      "usm-fullscreen-option-list__option--selected",
    );
    expect(getElementProps(optionNodes[2]).className).toContain(
      "usm-fullscreen-option-list__option--key-plus-bonus",
    );
    expect(getElementProps(optionNodes[2]).className).toContain("is-selected");
    expect(getElementProps(optionNodes[2]).className).toContain("index-2");
    expect(getElementProps(optionNodes[2]).style).toMatchObject({
      color: "red",
      order: 2,
      opacity: 1,
    });
    expect(getElementProps(optionNodes[3]).style).toMatchObject({
      opacity: 0.3,
      order: 3,
    });
  });

  it("is exported from the package index", () => {
    expect(ExportedFullscreenOptionList).toBe(FullscreenOptionList);
  });
});

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
  "aria-disabled"?: boolean;
  children?: React.ReactNode;
  className?: string;
  onClick?: (event: unknown) => void;
  style?: React.CSSProperties & Record<string, unknown>;
};

function getElementProps(element: React.ReactElement): TestElementProps {
  return element.props as TestElementProps;
}
