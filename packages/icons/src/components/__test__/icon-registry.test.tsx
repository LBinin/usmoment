import { describe, expect, it } from "vitest";
import type React from "react";
import * as publicExports from "../../index";
import { iconMetadata } from "../../metadata";
import { BackspaceIcon, YenCircleIcon } from "../index";
import type { IconProps } from "../../shared/types";
import {
  findElementsByType,
  getElementProps,
  renderElement,
} from "./test-utils";

type IconComponent = (props: IconProps) => React.ReactNode;

const themeColor = "var(--demo-icon-color)";

const iconCases = [
  {
    category: "action",
    component: BackspaceIcon,
    componentName: "BackspaceIcon",
    defaultHeight: "0.76em",
    metadataKey: "backspace",
    name: "backspace",
    pathSnippet: "M20.7613 1.5H8.65138",
    sourceProvider: "custom",
    viewBox: "0 0 25 19",
    width: 25,
    height: 19,
  },
  {
    category: "commerce",
    component: YenCircleIcon,
    componentName: "YenCircleIcon",
    defaultHeight: "1em",
    metadataKey: "yenCircle",
    name: "yen-circle",
    pathSnippet: "M12 2C6.477 2 2 6.477 2 12",
    sourceProvider: "custom",
    viewBox: "0 0 24 24",
    width: 24,
    height: 24,
  },
] as const;

describe("@usmoment/icon registry", () => {
  it.each(iconCases)("exports $componentName from the public entry", (icon) => {
    expect(publicExports[icon.componentName]).toBe(icon.component);
  });

  it.each(iconCases)(
    "exposes metadata for $name search and category filtering",
    (icon) => {
      expect(iconMetadata[icon.metadataKey]).toMatchObject({
        category: icon.category,
        componentName: icon.componentName,
        name: icon.name,
        source: {
          provider: icon.sourceProvider,
        },
      });
    },
  );
});

describe("@usmoment/icon rendering", () => {
  it.each(iconCases)(
    "renders $componentName with the expected viewBox and aspect ratio",
    (icon) => {
      const element = renderIcon(icon.component, {
        className: "demo-icon",
        size: icon.width,
        style: { display: "block" },
        title: icon.componentName,
      });

      expect(getElementProps(element)).toMatchObject({
        "aria-hidden": undefined,
        "aria-label": icon.componentName,
        className: `usm-icon usm-icon-${icon.name} demo-icon`,
        height: icon.height,
        role: "img",
        style: { display: "block" },
        viewBox: icon.viewBox,
        width: icon.width,
      });
      expect(findElementsByType(element, "title")).toHaveLength(1);
      expect(findElementsByType(element, "path")[0]?.props).toMatchObject({
        d: expect.stringContaining(icon.pathSnippet),
        fill: "var(--usm-icon-color, currentColor)",
        fillRule: "evenodd",
      });
    },
  );

  it.each(iconCases)("defaults $componentName to themeable em sizing", (icon) => {
    const element = renderIcon(icon.component, {});

    expect(getElementProps(element)).toMatchObject({
      height: icon.defaultHeight,
      width: "var(--usm-icon-size, 1em)",
    });
  });

  it.each(iconCases)(
    "supports theme color override for $componentName without gradients or hardcoded black",
    (icon) => {
      const element = renderIcon(icon.component, { color: themeColor });
      const paths = findElementsByType(element, "path");

      expect(paths[0]?.props.fill).toBe(themeColor);
      expect(findElementsByType(element, "defs")).toHaveLength(0);
      expect(findElementsByType(element, "linearGradient")).toHaveLength(0);
      expect(findElementsByType(element, "radialGradient")).toHaveLength(0);

      for (const path of paths) {
        expect(path.props.fill ?? "").not.toMatch(
          /^#?0{3}(?:0{3})?$|^black$/i,
        );
        expect(path.props.stroke ?? "").not.toMatch(
          /^#?0{3}(?:0{3})?$|^black$/i,
        );
      }
    },
  );

  it("hides decorative icons from assistive technology when no title is provided", () => {
    for (const icon of iconCases) {
      const element = renderIcon(icon.component, {});

      expect(getElementProps(element)["aria-hidden"]).toBe(true);
      expect(getElementProps(element).role).toBeUndefined();
      expect(findElementsByType(element, "title")).toHaveLength(0);
    }
  });
});

function renderIcon(component: IconComponent, props: IconProps) {
  return renderElement(component(props));
}
