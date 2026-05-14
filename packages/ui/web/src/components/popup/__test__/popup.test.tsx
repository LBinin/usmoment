// @vitest-environment jsdom

import React, { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { Popup } from "..";
import { Popup as ExportedPopup } from "../../../index";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT =
  true;

describe("Popup", () => {
  let container: HTMLDivElement;
  let root: Root;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.append(container);
    root = createRoot(container);
  });

  afterEach(() => {
    act(() => {
      root.unmount();
    });
    container.remove();
    document.body
      .querySelectorAll(".usm-popup")
      .forEach((node) => node.parentElement?.removeChild(node));
    vi.useRealTimers();
  });

  it("exports Popup from the package root", () => {
    expect(ExportedPopup).toBe(Popup);
  });

  it("renders open content into a document portal by default", () => {
    vi.useFakeTimers();

    act(() => {
      root.render(
        <Popup open overlay placement="top" zIndex={3000}>
          Sheet content
        </Popup>,
      );
    });

    const popup = document.body.querySelector(".usm-popup") as HTMLElement;

    expect(container.querySelector(".usm-popup")).toBeNull();
    expect(popup.className).not.toContain("usm-popup--open");
    expect(popup.className).toContain("usm-popup--placement-top");
    expect(document.body.querySelector(".usm-popup__overlay")).not.toBeNull();
    expect(document.body.querySelector(".usm-popup__content")?.textContent).toBe(
      "Sheet content",
    );
    expect(popup.style.zIndex).toBe("3000");

    act(() => {
      vi.advanceTimersByTime(16);
    });

    expect(document.body.querySelector(".usm-popup")?.className).toContain(
      "usm-popup--open",
    );
  });

  it("renders in place when portal is disabled", () => {
    act(() => {
      root.render(
        <Popup open portal={false}>
          Inline content
        </Popup>,
      );
    });

    expect(container.querySelector(".usm-popup__content")?.textContent).toBe(
      "Inline content",
    );
  });

  it("supports class and style extension points", () => {
    act(() => {
      root.render(
        <Popup
          className="root-extra"
          contentClassName="content-extra"
          contentStyle={{ color: "red" }}
          open
          overlay={{
            className: "overlay-option",
            style: { background: "blue" },
          }}
          overlayClassName="overlay-extra"
          overlayStyle={{ opacity: 0.5 }}
          placeholderClassName="placeholder-extra"
          placeholderStyle={{ flexBasis: 12 }}
          reserveSpace={44}
          style={{ pointerEvents: "auto" }}
        >
          Extended content
        </Popup>,
      );
    });

    const popup = document.body.querySelector(".usm-popup") as HTMLElement;
    const overlay = document.body.querySelector(
      ".usm-popup__overlay",
    ) as HTMLElement;
    const content = document.body.querySelector(
      ".usm-popup__content",
    ) as HTMLElement;
    const placeholder = container.querySelector(
      ".usm-popup__placeholder",
    ) as HTMLElement;

    expect(popup.className).toContain("root-extra");
    expect(popup.style.pointerEvents).toBe("auto");
    expect(overlay.className).toContain("overlay-option");
    expect(overlay.className).toContain("overlay-extra");
    expect(overlay.style.background).toBe("blue");
    expect(overlay.style.opacity).toBe("0.5");
    expect(content.className).toContain("content-extra");
    expect(content.style.color).toBe("red");
    expect(placeholder.className).toContain("placeholder-extra");
    expect(placeholder.style.height).toBe("44px");
    expect(placeholder.style.flexBasis).toBe("12px");
  });

  it("removes reserved measured space after an opened popup closes", () => {
    vi.useFakeTimers();
    const getBoundingClientRect = vi
      .spyOn(HTMLElement.prototype, "getBoundingClientRect")
      .mockReturnValue({
        bottom: 96,
        height: 96,
        left: 0,
        right: 0,
        top: 0,
        width: 320,
        x: 0,
        y: 0,
        toJSON: () => ({}),
      });

    act(() => {
      root.render(
        <Popup open reserveSpace>
          Reserved content
        </Popup>,
      );
      vi.advanceTimersByTime(16);
    });

    expect(
      (container.querySelector(".usm-popup__placeholder") as HTMLElement).style
        .height,
    ).toBe("96px");

    act(() => {
      root.render(
        <Popup open={false} reserveSpace>
          Reserved content
        </Popup>,
      );
    });

    expect(container.querySelector(".usm-popup__placeholder")).not.toBeNull();

    act(() => {
      vi.advanceTimersByTime(240);
    });

    expect(container.querySelector(".usm-popup__placeholder")).toBeNull();

    getBoundingClientRect.mockRestore();
  });

  it("reports measured content height even without reserved space", () => {
    const onContentHeightChange = vi.fn();
    const getBoundingClientRect = vi
      .spyOn(HTMLElement.prototype, "getBoundingClientRect")
      .mockReturnValue({
        bottom: 88,
        height: 88,
        left: 0,
        right: 0,
        top: 0,
        width: 320,
        x: 0,
        y: 0,
        toJSON: () => ({}),
      });

    act(() => {
      root.render(
        <Popup open onContentHeightChange={onContentHeightChange}>
          Measured content
        </Popup>,
      );
    });

    expect(onContentHeightChange).toHaveBeenCalledWith(88);
    expect(container.querySelector(".usm-popup__placeholder")).toBeNull();

    getBoundingClientRect.mockRestore();
  });

  it("requests close when the overlay is clicked", () => {
    const onOpenChange = vi.fn();

    act(() => {
      root.render(<Popup open overlay onOpenChange={onOpenChange} />);
    });

    act(() => {
      (document.body.querySelector(".usm-popup__overlay") as HTMLElement).click();
    });

    expect(onOpenChange).toHaveBeenCalledWith(false, "overlay-click");
  });

  it("does not request close when overlay closeOnClick is disabled", () => {
    const onOpenChange = vi.fn();

    act(() => {
      root.render(
        <Popup
          open
          overlay={{ closeOnClick: false }}
          onOpenChange={onOpenChange}
        />,
      );
    });

    act(() => {
      (document.body.querySelector(".usm-popup__overlay") as HTMLElement).click();
    });

    expect(onOpenChange).not.toHaveBeenCalled();
  });

  it("calls the latest lifecycle callbacks across open and close animations", () => {
    vi.useFakeTimers();
    const initialOnAfterOpen = vi.fn();
    const latestOnAfterOpen = vi.fn();
    const initialOnAfterClose = vi.fn();
    const latestOnAfterClose = vi.fn();

    act(() => {
      root.render(
        <Popup
          open={false}
          onAfterClose={initialOnAfterClose}
          onAfterOpen={initialOnAfterOpen}
        />,
      );
    });

    act(() => {
      root.render(
        <Popup
          open
          onAfterClose={initialOnAfterClose}
          onAfterOpen={initialOnAfterOpen}
        />,
      );
    });

    act(() => {
      root.render(
        <Popup
          open
          onAfterClose={initialOnAfterClose}
          onAfterOpen={latestOnAfterOpen}
        />,
      );
    });

    act(() => {
      vi.advanceTimersByTime(16 + 240);
    });

    expect(initialOnAfterOpen).not.toHaveBeenCalled();
    expect(latestOnAfterOpen).toHaveBeenCalledTimes(1);

    act(() => {
      root.render(
        <Popup
          open={false}
          onAfterClose={initialOnAfterClose}
          onAfterOpen={latestOnAfterOpen}
        />,
      );
    });

    act(() => {
      root.render(
        <Popup
          open={false}
          onAfterClose={latestOnAfterClose}
          onAfterOpen={latestOnAfterOpen}
        />,
      );
    });

    expect(document.body.querySelector(".usm-popup")?.className).toContain(
      "usm-popup--closing",
    );

    act(() => {
      vi.advanceTimersByTime(240);
    });

    expect(document.body.querySelector(".usm-popup")).toBeNull();
    expect(initialOnAfterClose).not.toHaveBeenCalled();
    expect(latestOnAfterClose).toHaveBeenCalledTimes(1);
  });
});
