// @vitest-environment jsdom

import React, { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { Popup } from "..";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT =
  true;

vi.mock("@tarojs/components", () => ({
  RootPortal: ({ children }: { children?: React.ReactNode }) => (
    <div data-root-portal="true">{children}</div>
  ),
  View: "div",
}));

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
    vi.useRealTimers();
  });

  it("renders open content through RootPortal by default", () => {
    vi.useFakeTimers();

    act(() => {
      root.render(
        <Popup open overlay placement="top" zIndex={3000}>
          Sheet content
        </Popup>,
      );
    });

    const popup = container.querySelector(".usm-popup");

    expect(container.querySelector("[data-root-portal='true']")).not.toBeNull();
    expect(popup?.className).not.toContain("usm-popup--open");
    expect(popup?.className).toContain("usm-popup--placement-top");
    expect(container.querySelector(".usm-popup__overlay")).not.toBeNull();
    expect(container.querySelector(".usm-popup__content")?.textContent).toBe(
      "Sheet content",
    );
    expect((popup as HTMLElement).style.zIndex).toBe("3000");

    act(() => {
      vi.advanceTimersByTime(16);
    });

    expect(container.querySelector(".usm-popup")?.className).toContain(
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

    expect(container.querySelector("[data-root-portal='true']")).toBeNull();
    expect(container.querySelector(".usm-popup__content")?.textContent).toBe(
      "Inline content",
    );
  });

  it("reserves numeric placeholder space in px", () => {
    act(() => {
      root.render(
        <Popup open reserveSpace={72} placeholderClassName="space-extra" />,
      );
    });

    const placeholder = container.querySelector(
      ".usm-popup__placeholder",
    ) as HTMLElement;

    expect(placeholder.className).toContain("space-extra");
    expect(placeholder.style.height).toBe("72px");
  });

  it("removes reserved space when fully closed", () => {
    act(() => {
      root.render(<Popup animated={false} open={false} reserveSpace={72} />);
    });

    expect(container.querySelector(".usm-popup__placeholder")).toBeNull();
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
      (container.querySelector(".usm-popup__overlay") as HTMLElement).click();
    });

    expect(onOpenChange).toHaveBeenCalledWith(false, "overlay-click");
  });

  it("calls the latest onAfterOpen once after opening even when its identity changes", () => {
    vi.useFakeTimers();
    const initialOnAfterOpen = vi.fn();
    const latestOnAfterOpen = vi.fn();

    act(() => {
      root.render(
        <Popup open={false} onAfterOpen={initialOnAfterOpen}>
          Opening content
        </Popup>,
      );
    });

    act(() => {
      root.render(
        <Popup open onAfterOpen={initialOnAfterOpen}>
          Opening content
        </Popup>,
      );
    });

    act(() => {
      root.render(
        <Popup open onAfterOpen={latestOnAfterOpen}>
          Opening content
        </Popup>,
      );
    });

    act(() => {
      vi.advanceTimersByTime(16 + 240);
    });

    expect(initialOnAfterOpen).not.toHaveBeenCalled();
    expect(latestOnAfterOpen).toHaveBeenCalledTimes(1);
  });

  it("keeps closing content until the animation duration finishes", () => {
    vi.useFakeTimers();
    const onAfterClose = vi.fn();

    act(() => {
      root.render(
        <Popup open duration={120} onAfterClose={onAfterClose}>
          Closing content
        </Popup>,
      );
    });

    act(() => {
      root.render(
        <Popup open={false} duration={120} onAfterClose={onAfterClose}>
          Closing content
        </Popup>,
      );
    });

    expect(container.querySelector(".usm-popup")?.className).toContain(
      "usm-popup--closing",
    );
    expect(container.querySelector(".usm-popup__content")).not.toBeNull();

    act(() => {
      vi.advanceTimersByTime(120);
    });

    expect(container.querySelector(".usm-popup")).toBeNull();
    expect(onAfterClose).toHaveBeenCalledTimes(1);
  });

  it("unmounts and calls the latest onAfterClose once after closing even when its identity changes", () => {
    vi.useFakeTimers();
    const initialOnAfterClose = vi.fn();
    const latestOnAfterClose = vi.fn();

    act(() => {
      root.render(
        <Popup open duration={120} onAfterClose={initialOnAfterClose}>
          Closing content
        </Popup>,
      );
    });

    act(() => {
      vi.advanceTimersByTime(16 + 120);
    });

    act(() => {
      root.render(
        <Popup open={false} duration={120} onAfterClose={initialOnAfterClose}>
          Closing content
        </Popup>,
      );
    });

    act(() => {
      root.render(
        <Popup open={false} duration={120} onAfterClose={latestOnAfterClose}>
          Closing content
        </Popup>,
      );
    });

    expect(container.querySelector(".usm-popup")?.className).toContain(
      "usm-popup--closing",
    );

    act(() => {
      vi.advanceTimersByTime(120);
    });

    expect(container.querySelector(".usm-popup")).toBeNull();
    expect(initialOnAfterClose).not.toHaveBeenCalled();
    expect(latestOnAfterClose).toHaveBeenCalledTimes(1);
  });
});
