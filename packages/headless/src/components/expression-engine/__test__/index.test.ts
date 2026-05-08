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

  it("removes the last token", () => {
    const engine = createExpressionEngine();
    engine.input("12+3");
    engine.backspace();
    expect(engine.expression()).toBe("12+");
  });

  it("evaluates incomplete operator expressions without throwing", () => {
    const engine = createExpressionEngine();
    engine.input("1+");
    expect(engine.evaluate()).toBe("1");
  });

  it("ignores repeated decimal points inside a number", () => {
    const engine = createExpressionEngine({ scale: 2 });
    engine.input("8...3");
    expect(engine.evaluate()).toBe("8.30");
  });

  it("normalizes consecutive operators by keeping the latest operator", () => {
    const engine = createExpressionEngine();
    engine.input("1++2");
    expect(engine.evaluate()).toBe("3");

    engine.clear();
    engine.input("1+-2");
    expect(engine.evaluate()).toBe("-1");
  });

  it("computes multiplication and division with precedence", () => {
    const engine = createExpressionEngine({ scale: 2 });
    engine.input("2+3*4");
    expect(engine.evaluate()).toBe("14.00");

    engine.clear();
    engine.input("8/2+1");
    expect(engine.evaluate()).toBe("5.00");
  });

  it("supports visual multiplication and division operators", () => {
    const engine = createExpressionEngine({ scale: 2 });
    engine.input("2×3+8÷4");
    expect(engine.evaluate()).toBe("8.00");
  });

  it("supports signed numbers after multiplication and division", () => {
    const engine = createExpressionEngine({ scale: 2 });
    engine.input("2*-3");
    expect(engine.evaluate()).toBe("-6.00");

    engine.clear();
    engine.input("6/-2");
    expect(engine.evaluate()).toBe("-3.00");
  });

  it("evaluates incomplete multiplication and division expressions without throwing", () => {
    const engine = createExpressionEngine({ scale: 2 });
    engine.input("2*");
    expect(engine.evaluate()).toBe("2.00");

    engine.clear();
    engine.input("8/");
    expect(engine.evaluate()).toBe("8.00");
  });

  it("handles division by zero without throwing", () => {
    const engine = createExpressionEngine({ scale: 2 });
    engine.input("8/0");
    expect(engine.evaluate()).toBe("0.00");
  });

  it("supports leading negative and decimal numbers", () => {
    const engine = createExpressionEngine({ scale: 2 });
    engine.input("-.5+1.");
    expect(engine.evaluate()).toBe("0.50");
  });

  it("evaluates invalid-only input as zero without throwing", () => {
    const engine = createExpressionEngine({ scale: 2 });
    engine.input("...");
    expect(engine.evaluate()).toBe("0.00");

    engine.clear();
    engine.input("+");
    expect(engine.evaluate()).toBe("0.00");
  });
});
