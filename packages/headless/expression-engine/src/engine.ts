import type { EngineOptions, ExpressionEngine } from "./types";

export function createExpressionEngine(
  options: EngineOptions = {},
): ExpressionEngine {
  let expr = "";

  return {
    input(token) {
      expr += token;
    },
    evaluate() {
      const safe = expr.replace(/[^\d+\-.]/g, "");
      const value = Function(`return (${safe || "0"})`)() as number;

      if (typeof options.scale === "number") {
        return value.toFixed(options.scale);
      }

      return String(value);
    },
    expression() {
      return expr;
    },
    clear() {
      expr = "";
    },
  };
}
