// @vitest-environment jsdom

import React from "react";
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import {
  ImageUploadAction,
  type ImageUploadActionProps,
} from "../image-upload-action";

type ImageProps = {
  className?: string;
  mode?: string;
  src?: string;
};

const chooseImage = vi.hoisted(() => vi.fn());

vi.mock("@usmoment/icon/taro", () => ({
  PlusIcon: (props: { className?: string }) =>
    React.createElement("i", {
      className: props.className,
      "data-icon": "plus",
    }),
}));

vi.mock("@tarojs/components", () => ({
  Image: (props: ImageProps) => React.createElement("image", props),
  Text: "span",
  View: "div",
}));

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT =
  true;

describe("ImageUploadAction", () => {
  let container: HTMLDivElement;
  let root: Root;

  beforeEach(() => {
    chooseImage.mockReset();
    (globalThis as TestImageUploadHost).Taro = { chooseImage };
    container = document.createElement("div");
    document.body.append(container);
    root = createRoot(container);
  });

  afterEach(() => {
    act(() => {
      root.unmount();
    });
    delete (globalThis as TestImageUploadHost).Taro;
    delete (globalThis as TestImageUploadHost).wx;
    container.remove();
  });

  it("renders an upload affordance before an image is selected", () => {
    const markup = renderToStaticMarkup(
      <ImageUploadAction placeholder="点击添加图片" />,
    );

    expect(markup).toContain("usm-accounting-calculator-image-upload-action");
    expect(markup).toContain(
      "usm-accounting-calculator-image-upload-action__empty",
    );
    expect(markup).toContain("data-icon=\"plus\"");
    expect(markup).toContain("点击添加图片");
  });

  it("opens the native image chooser for one image and emits the temp path", async () => {
    const onChange = vi.fn<NonNullable<ImageUploadActionProps["onChange"]>>();
    chooseImage.mockResolvedValue({
      tempFilePaths: ["/tmp/receipt-a.jpg", "/tmp/receipt-b.jpg"],
    });

    act(() => {
      root.render(<ImageUploadAction onChange={onChange} />);
    });

    await act(async () => {
      (
        container.querySelector(
          ".usm-accounting-calculator-image-upload-action__surface",
        ) as HTMLDivElement
      ).click();
    });

    expect(chooseImage).toHaveBeenCalledWith({
      count: 1,
      sourceType: ["camera", "album"],
    });
    expect(onChange).toHaveBeenCalledWith("/tmp/receipt-a.jpg");
  });

  it("renders the selected image with cover-style aspectFill and can replace it", async () => {
    const onChange = vi.fn<NonNullable<ImageUploadActionProps["onChange"]>>();
    chooseImage.mockResolvedValue({
      tempFilePaths: ["/tmp/receipt-next.jpg"],
    });

    act(() => {
      root.render(
        <ImageUploadAction
          onChange={onChange}
          replaceLabel="点击替换图片"
          value="/tmp/receipt-current.jpg"
        />,
      );
    });

    const image = container.querySelector("image") as Element;

    expect(image.getAttribute("src")).toBe("/tmp/receipt-current.jpg");
    expect(image.getAttribute("mode")).toBe("aspectFill");
    expect(container.textContent).toContain("点击替换图片");

    await act(async () => {
      (
        container.querySelector(
          ".usm-accounting-calculator-image-upload-action__surface",
        ) as HTMLDivElement
      ).click();
    });

    expect(onChange).toHaveBeenCalledWith("/tmp/receipt-next.jpg");
  });

  it("does not open the chooser when disabled", async () => {
    act(() => {
      root.render(<ImageUploadAction disabled />);
    });

    await act(async () => {
      (
        container.querySelector(
          ".usm-accounting-calculator-image-upload-action__surface",
        ) as HTMLDivElement
      ).click();
    });

    expect(chooseImage).not.toHaveBeenCalled();
  });
});

type TestImageUploadHost = {
  Taro?: {
    chooseImage?: typeof chooseImage;
  };
  wx?: {
    chooseImage?: typeof chooseImage;
  };
};
