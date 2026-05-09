import { describe, expect, it } from "vitest";
import {
  applyKeyboardEvent,
  formatKeyboardEvent,
  keyboardModes,
} from "../pages/index/showcase-data";
import {
  getShowcaseComponent,
  showcaseGroups,
} from "../showcase/catalog";

describe("showcase Taro app", () => {
  it("groups showcase components by Kits and UI layers", () => {
    expect(showcaseGroups.map((group) => group.title)).toEqual([
      "Kits",
      "UI Components",
    ]);
    expect(showcaseGroups[0].items.map((item) => item.id)).toEqual([
      "accounting-calculator",
    ]);
    expect(showcaseGroups[1].items.map((item) => item.id)).toEqual([
      "business-keyboard",
    ]);
  });

  it("resolves component detail routes for directory tabs", () => {
    expect(getShowcaseComponent("accounting-calculator")?.route).toBe(
      "/pages/kits/accounting-calculator/index",
    );
    expect(getShowcaseComponent("business-keyboard")?.route).toBe(
      "/pages/ui/business-keyboard/index",
    );
  });

  it("registers BusinessKeyboard modes for the component gallery", () => {
    expect(keyboardModes.map((mode) => mode.id)).toEqual([
      "standard",
      "compact",
      "disabled",
    ]);
    expect(keyboardModes.map((mode) => mode.label).join(" ")).toContain(
      "标准金额键盘",
    );
  });

  it("applies BusinessKeyboard events to the showcase display value", () => {
    expect(
      applyKeyboardEvent("12", {
        action: "input",
        key: {} as never,
        value: "7",
      }),
    ).toBe("127");
    expect(
      applyKeyboardEvent("12", {
        action: "backspace",
        key: {} as never,
      }),
    ).toBe("1");
    expect(
      applyKeyboardEvent("12", {
        action: "clear",
        key: {} as never,
      }),
    ).toBe("");
  });

  it("formats the latest keyboard event for the showcase panel", () => {
    expect(
      formatKeyboardEvent({
        action: "input",
        key: {} as never,
        value: "7",
      }),
    ).toBe("input: 7");
    expect(
      formatKeyboardEvent({
        action: "submit",
        key: {} as never,
      }),
    ).toBe("submit");
  });
});
