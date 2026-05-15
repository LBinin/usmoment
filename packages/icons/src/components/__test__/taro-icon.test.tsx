import React from "react";
import { describe, expect, it } from "vitest";
import {
  BackspaceIcon,
  DateIcon,
  ImageIcon,
  NoteIcon,
  PlusIcon,
  TimeIcon,
  YenCircleIcon,
} from "../../taro";
import type { IconProps } from "../../shared/types";
import { getElementProps, renderElement } from "./test-utils";

type IconComponent = (props: IconProps) => React.ReactNode;

describe("@usmoment/icon Taro rendering", () => {
  it.each([
    {
      component: BackspaceIcon,
      componentName: "BackspaceIcon",
      name: "backspace",
      pathSnippet: "M20.7613 1.5H8.65138",
    },
    {
      component: DateIcon,
      componentName: "DateIcon",
      name: "date",
      pathSnippet: "M5.75 0C6.16421 0",
    },
    {
      component: ImageIcon,
      componentName: "ImageIcon",
      name: "image",
      pathSnippet: "M14 16H4C2.17294 16",
    },
    {
      component: NoteIcon,
      componentName: "NoteIcon",
      name: "note",
      pathSnippet: "M4 16H14C16.2091 16",
    },
    {
      component: PlusIcon,
      componentName: "PlusIcon",
      name: "plus",
      pathSnippet: "M40.5 3C40.5 1.34315",
    },
    {
      component: TimeIcon,
      componentName: "TimeIcon",
      name: "time",
      pathSnippet: "M9 18C13.9706 18",
    },
    {
      component: YenCircleIcon,
      componentName: "YenCircleIcon",
      name: "yen-circle",
      pathSnippet: "M12 2C6.477 2 2 6.477 2 12",
    },
  ])("renders $componentName as a Taro image source", (icon) => {
    const element = renderIcon(icon.component, {
      className: "demo-icon",
      color: "#636363",
      height: "38rpx",
      title: icon.componentName,
      width: "50rpx",
    });

    expect(element.type).toBe("image");
    expect(getElementProps(element)).toMatchObject({
      "aria-hidden": undefined,
      "aria-label": icon.componentName,
      className: `usm-icon usm-icon-${icon.name} demo-icon`,
      mode: "aspectFit",
      role: "img",
    });
    expect(getElementProps(element).style).toMatchObject({
      display: "block",
      height: "38rpx",
      width: "50rpx",
    });
    const src = String(getElementProps(element).src);
    const svg = decodeBase64Svg(src);

    expect(src).toContain("data:image/svg+xml;base64,");
    expect(svg).toContain(icon.pathSnippet);
    expect(svg).toContain('fill="#636363"');
    expect(svg).toContain("xmlns=\"http://www.w3.org/2000/svg\"");
  });

  it("keeps caller style overrides available for Taro class/style sizing", () => {
    const element = renderIcon(YenCircleIcon, {
      style: {
        backgroundColor: "#ff9f5c",
        height: "40rpx",
        width: "40rpx",
      },
    });

    expect(getElementProps(element).style).toMatchObject({
      height: "40rpx",
      width: "40rpx",
    });
  });

  it("renders BackspaceIcon as a Taro mask host when requested", () => {
    const element = renderIcon(BackspaceIcon, {
      className: "business-icon",
      renderMode: "mask",
      style: { height: "100%" },
    });

    expect(element.type).toBe("view");
    expect(getElementProps(element)).toMatchObject({
      "aria-hidden": true,
      className: "usm-icon usm-icon-backspace usm-icon--mask business-icon",
    });
    expect(getElementProps(element).style).toMatchObject({
      "-webkit-mask-image": expect.stringContaining("data:image/svg+xml;base64,"),
      "-webkit-mask-position": "center",
      "-webkit-mask-repeat": "no-repeat",
      "-webkit-mask-size": "contain",
      WebkitMaskImage: expect.stringContaining("data:image/svg+xml;base64,"),
      height: "100%",
      maskImage: expect.stringContaining("data:image/svg+xml;base64,"),
      maskPosition: "center",
      maskRepeat: "no-repeat",
      maskSize: "contain",
    });
  });
});

function renderIcon(component: IconComponent, props: IconProps) {
  return renderElement(component(props));
}

function decodeBase64Svg(source: string): string {
  const encoded = source.replace("data:image/svg+xml;base64,", "");

  return Buffer.from(encoded, "base64").toString("utf8");
}
