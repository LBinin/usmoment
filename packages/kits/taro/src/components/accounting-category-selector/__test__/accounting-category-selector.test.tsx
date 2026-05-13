import React from "react";
import { readFileSync } from "node:fs";
import { renderToStaticMarkup } from "react-dom/server";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { AccountingCategorySelector } from "..";
import type {
  FullscreenOptionListOption,
  FullscreenOptionListProps,
} from "@usmoment/ui-taro";

type Category = {
  key: string;
  name: string;
  icon?: React.ReactNode;
  subtitle?: string;
  disabled?: boolean;
};

type CategoryOption = FullscreenOptionListOption<Category>;

type CategoryOptionListProps = FullscreenOptionListProps<Category>;

const optionListCalls: CategoryOptionListProps[] = [];

vi.mock("@tarojs/components", () => ({
  Text: "span",
  View: "div",
}));

vi.mock("@usmoment/ui-taro", () => ({
  FullscreenOptionList: (props: CategoryOptionListProps) => {
    optionListCalls.push(props);
    return React.createElement("div", null);
  },
}));

describe("AccountingCategorySelector", () => {
  beforeEach(() => {
    optionListCalls.length = 0;
  });

  it("renders FullscreenOptionList with default columns and mapped categories", () => {
    renderSelector({ selectedKey: "food" });

    expect(getLastOptionListProps()).toMatchObject({
      columns: 4,
      selectedKey: "food",
    });
    expect(getLastOptionListProps().options).toEqual([
      {
        key: "food",
        disabled: undefined,
        data: {
          key: "food",
          name: "餐饮",
          icon: "🍜",
          subtitle: "午餐",
        },
      },
      {
        key: "traffic",
        disabled: true,
        data: {
          key: "traffic",
          name: "交通",
          disabled: true,
        },
      },
    ]);
  });

  it("passes explicit columns and extension props through to the UI list", () => {
    const style = { paddingBottom: 12 };
    const categoryStyle = { minHeight: 88 };

    renderSelector({
      categoryClassName: "caller-category",
      categoryStyle,
      className: "caller-root",
      columns: 3,
      style,
    });

    expect(getLastOptionListProps()).toMatchObject({
      columns: 3,
      optionClassName: "usm-accounting-category-selector__category caller-category",
      optionStyle: categoryStyle,
      style,
    });
    expect(getLastOptionListProps().className).toContain(
      "usm-accounting-category-selector",
    );
    expect(getLastOptionListProps().className).toContain("caller-root");
  });

  it("renders category name, icon, and subtitle through renderOption", () => {
    renderSelector();

    const markup = renderOption({
      option: {
        key: "food",
        data: {
          key: "food",
          name: "餐饮",
          icon: <span className="custom-icon">饭</span>,
          subtitle: "午餐",
        },
      },
      selected: true,
      disabled: false,
      index: 0,
    });

    expect(markup).toContain("usm-accounting-category-selector__title");
    expect(markup).toContain("usm-accounting-category-selector__name");
    expect(markup).toContain("usm-accounting-category-selector__subtitle");
    expect(markup).toContain("usm-accounting-category-selector__icon");
    expect(markup).toContain("custom-icon");
    expect(markup).toContain("餐饮");
    expect(markup).toContain("午餐");
  });

  it("does not render the category key as fallback subtitle", () => {
    renderSelector();

    const markup = renderOption({
      option: {
        key: "food",
        data: { key: "food", name: "餐饮" },
      },
      selected: false,
      disabled: false,
      index: 0,
    });

    expect(markup).toContain("餐饮");
    expect(markup).not.toContain("food");
    expect(markup).not.toContain("usm-accounting-category-selector__subtitle");
  });

  it("maps UI onChange to kit category payload", () => {
    const changes: unknown[] = [];
    const nativeEvent = { type: "tap" };
    renderSelector({ onChange: (event) => changes.push(event) });

    getLastOptionListProps().onChange?.({
      key: "traffic",
      nativeEvent,
      option: {
        key: "traffic",
        disabled: true,
        data: { key: "traffic", name: "交通", disabled: true },
      },
    });

    expect(changes).toEqual([
      {
        key: "traffic",
        nativeEvent,
        category: { key: "traffic", name: "交通", disabled: true },
      },
    ]);
  });

  it("maps UI onOptionClick to kit category click payload", () => {
    const clicks: unknown[] = [];
    const nativeEvent = { type: "tap" };
    renderSelector({ onCategoryClick: (event) => clicks.push(event) });

    getLastOptionListProps().onOptionClick?.({
      key: "food",
      nativeEvent,
      option: {
        key: "food",
        data: { key: "food", name: "餐饮" },
      },
      selected: true,
    });

    expect(clicks).toEqual([
      {
        key: "food",
        nativeEvent,
        selected: true,
        category: { key: "food", name: "餐饮" },
      },
    ]);
  });

  it("keeps the selected accounting skin in the kit stylesheet", () => {
    const css = readFileSync(new URL("../style.css", import.meta.url), "utf8");

    expect(css).toContain("#EDEDED");
    expect(css).toContain("#FBBD0A");
    expect(css).toContain("0 0 20rpx 0 #FFC452");
    expect(css).toContain("top: 88rpx");
    expect(css).toContain("124rpx");
    expect(css).toContain(
      "translateX(40rpx) translateY(-20rpx) rotate(23deg)",
    );
    expect(css).toContain("aspect-ratio: 1 / 1");
  });
});

function renderSelector(
  props: Partial<React.ComponentProps<typeof AccountingCategorySelector>> = {},
) {
  renderToStaticMarkup(
    <AccountingCategorySelector
      categories={[
        {
          key: "food",
          name: "餐饮",
          icon: "🍜",
          subtitle: "午餐",
        },
        {
          key: "traffic",
          name: "交通",
          disabled: true,
        },
      ]}
      {...props}
    />,
  );
}

function renderOption(event: {
  option: CategoryOption;
  selected: boolean;
  disabled: boolean;
  index: number;
}): string {
  const render = getLastOptionListProps().renderOption;

  if (!render) {
    throw new Error("Expected AccountingCategorySelector to pass renderOption");
  }

  return renderToStaticMarkup(<>{render(event)}</>);
}

function getLastOptionListProps(): CategoryOptionListProps {
  const props = optionListCalls.at(-1);

  if (!props) {
    throw new Error("FullscreenOptionList was not rendered");
  }

  return props;
}
