import { describe, expect, it } from "vitest";
import { createSelectionState } from "..";

describe("selection-state-core", () => {
  it("supports single mode", () => {
    const state = createSelectionState({ mode: "single" });
    state.toggle("food");
    state.toggle("rent");
    expect(state.values()).toEqual(["rent"]);
  });

  it("supports multi mode", () => {
    const state = createSelectionState({ mode: "multi" });
    state.toggle("food");
    state.toggle("rent");
    expect(state.values()).toEqual(["food", "rent"]);
  });

  it("toggles off an existing item in multi mode", () => {
    const state = createSelectionState({ mode: "multi" });
    state.toggle("food");
    state.toggle("food");
    expect(state.values()).toEqual([]);
  });

  it("clears all selected values", () => {
    const state = createSelectionState({ mode: "multi" });
    state.toggle("food");
    state.toggle("rent");
    state.clear();
    expect(state.values()).toEqual([]);
  });
});
