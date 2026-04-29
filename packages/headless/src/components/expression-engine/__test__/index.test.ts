import { describe, expect, it } from "vitest";
import { createExpressionEngine } from "..";

describe("expression-engine", () => {
  it("computes addition and subtraction", () => {
    const engine = createExpressionEngine();
    engine.input("1");
    engine.input("+");
    engine.input("2");
    expect(engine.evaluate()).toBe("3");
  });

  it("keeps two decimal precision", () => {
    const engine = createExpressionEngine({ scale: 2 });
    engine.input("0.1");
    engine.input("+");
    engine.input("0.2");
    expect(engine.evaluate()).toBe("0.30");
  });
});
