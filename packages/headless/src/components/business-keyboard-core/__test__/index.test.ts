import { describe, expect, it } from "vitest";
import {
  createAccountingCalcKeyboardConfig,
  createBusinessKeyboardEvent,
  resolveBusinessKeyboardConfig,
} from "..";

describe("business-keyboard-core", () => {
  it("creates a structured accounting calculator keyboard config", () => {
    const config = createAccountingCalcKeyboardConfig({ submitLabel: "Done" });

    expect(config.meta?.name).toBe("accounting-calc");
    expect(config.layout).toEqual([
      ["7", "8", "9", "backspace"],
      ["4", "5", "6", "+"],
      ["1", "2", "3", "-"],
      ["clear", "0", ".", "submit"],
    ]);
    expect(config.keys.find((key) => key.id === "submit")).toMatchObject({
      action: "submit",
      label: "Done",
      variant: "primary",
    });
  });

  it("merges custom keys and layout before resolving rows", () => {
    const config = createAccountingCalcKeyboardConfig();
    const resolved = resolveBusinessKeyboardConfig({
      config,
      keys: [
        {
          id: "today",
          label: "Today",
          action: "custom",
          payload: { shortcut: "today" },
          variant: "primary",
        },
      ],
      layout: [
        ["1", "2", "3"],
        ["today", "0", "submit"],
      ],
      columns: 3,
    });

    expect(resolved.columns).toBe(3);
    expect(resolved.rows.map((row) => row.map((key) => key.id))).toEqual([
      ["1", "2", "3"],
      ["today", "0", "submit"],
    ]);
    expect(resolved.rows[1]?.[0]).toMatchObject({
      id: "today",
      action: "custom",
      payload: { shortcut: "today" },
    });
    expect(resolved.warnings).toEqual([]);
  });

  it("creates a stable event payload from a resolved key", () => {
    const resolved = resolveBusinessKeyboardConfig(
      createAccountingCalcKeyboardConfig(),
    );
    const key = resolved.rows[0]?.[3];

    expect(key?.id).toBe("backspace");
    expect(createBusinessKeyboardEvent(key!)).toMatchObject({
      action: "backspace",
      value: undefined,
      key,
    });
  });

  it("reports missing layout keys without throwing", () => {
    const resolved = resolveBusinessKeyboardConfig({
      config: createAccountingCalcKeyboardConfig(),
      layout: [["1", "missing-key"]],
    });

    expect(resolved.rows.map((row) => row.map((key) => key.id))).toEqual([
      ["1"],
    ]);
    expect(resolved.warnings).toEqual([
      {
        code: "unknown-key",
        keyId: "missing-key",
        message: 'Keyboard layout references unknown key "missing-key".',
        severity: "warning",
      },
    ]);
  });

  it("lets custom keys override built-in keys by id", () => {
    const resolved = resolveBusinessKeyboardConfig({
      config: createAccountingCalcKeyboardConfig(),
      keys: [
        {
          id: "submit",
          label: "Pay",
          action: "custom",
          payload: { intent: "pay-now" },
          variant: "primary",
        },
      ],
    });

    expect(resolved.rows[3]?.[3]).toMatchObject({
      id: "submit",
      label: "Pay",
      action: "custom",
      payload: { intent: "pay-now" },
    });
  });

  it("normalizes invalid spans and reports structured warnings", () => {
    const resolved = resolveBusinessKeyboardConfig({
      config: createAccountingCalcKeyboardConfig(),
      keys: [
        {
          id: "wide",
          label: "Wide",
          span: 9,
        },
      ],
      layout: [["wide", "1"]],
      columns: 4,
    });

    expect(resolved.rows[0]?.[0]).toMatchObject({
      id: "wide",
      span: 4,
    });
    expect(resolved.warnings).toEqual([
      {
        code: "invalid-span",
        keyId: "wide",
        message: 'Keyboard key "wide" has invalid span 9. It was clamped to 4.',
        severity: "warning",
      },
    ]);
  });

  it("exposes flatKeys in resolved layout order", () => {
    const resolved = resolveBusinessKeyboardConfig({
      config: createAccountingCalcKeyboardConfig(),
      layout: [
        ["1", "2"],
        ["3", "submit"],
      ],
    });

    expect(resolved.flatKeys.map((key) => key.id)).toEqual([
      "1",
      "2",
      "3",
      "submit",
    ]);
  });

  it("does not let external mutation change created configs", () => {
    const config = createAccountingCalcKeyboardConfig();
    const firstRow = config.layout[0];
    const firstKey = config.keys.find((key) => key.id === "submit");

    firstRow?.push("submit");
    if (firstKey) firstKey.label = "Mutated";

    const nextConfig = createAccountingCalcKeyboardConfig();

    expect(nextConfig.layout[0]).toEqual(["7", "8", "9", "backspace"]);
    expect(nextConfig.keys.find((key) => key.id === "submit")).toMatchObject({
      label: "完成",
    });
  });
});
