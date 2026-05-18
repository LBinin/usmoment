import Decimal from "decimal.js";
import type { EngineOptions, ExpressionEngine } from "./types";

export type { EngineOptions, ExpressionEngine } from "./types";

export function createExpressionEngine(
  options: EngineOptions = {},
): ExpressionEngine {
  let expr = "";

  return {
    backspace() {
      expr = expr.slice(0, -1);
    },
    input(token) {
      expr += token;
    },
    evaluate() {
      const value = evaluateTokens(tokenizeExpression(expr));

      if (typeof options.scale === "number") {
        return value.toFixed(options.scale);
      }

      return value.toString();
    },
    expression() {
      return expr;
    },
    clear() {
      expr = "";
    },
  };
}

type Operator = "+" | "-" | "*" | "/";

type ExpressionToken =
  | {
      type: "number";
      value: Decimal;
    }
  | {
      type: "operator";
      value: Operator;
    };

function tokenizeExpression(expression: string): ExpressionToken[] {
  const tokens: ExpressionToken[] = [];
  let numberBuffer = "";
  let hasDecimalPoint = false;
  let pendingOperator: Operator | null = null;

  for (const char of expression) {
    if (isDigit(char)) {
      numberBuffer += char;
      continue;
    }

    if (char === ".") {
      if (!hasDecimalPoint) {
        numberBuffer = numberBuffer === "" ? "0." : `${numberBuffer}.`;
        hasDecimalPoint = true;
      }
      continue;
    }

    const operator = normalizeOperator(char);

    if (operator) {
      if (numberBuffer !== "") {
        pushNumber(tokens, numberBuffer);
        numberBuffer = "";
        hasDecimalPoint = false;
      }

      const previousToken = tokens[tokens.length - 1];

      if (
        operator === "-" &&
        (tokens.length === 0 ||
          (previousToken?.type === "operator" &&
            (previousToken.value === "*" || previousToken.value === "/")))
      ) {
        numberBuffer = "-";
        continue;
      }

      if (previousToken?.type === "operator") {
        pendingOperator = operator;
        tokens[tokens.length - 1] = {
          type: "operator",
          value: pendingOperator,
        };
        continue;
      }

      pendingOperator = operator;
      tokens.push({ type: "operator", value: pendingOperator });
    }
  }

  if (numberBuffer !== "" && numberBuffer !== "-") {
    pushNumber(tokens, numberBuffer);
  }

  while (tokens[tokens.length - 1]?.type === "operator") {
    tokens.pop();
  }

  return tokens;
}

function evaluateTokens(tokens: ExpressionToken[]): Decimal {
  const additiveTokens = collapseMultiplicativeTokens(tokens);
  let result = new Decimal(0);
  let operator: Operator = "+";

  for (const token of additiveTokens) {
    if (token.type === "operator") {
      operator = token.value;
      continue;
    }

    result = operator === "+" ? result.plus(token.value) : result.minus(token.value);
  }

  return result;
}

function collapseMultiplicativeTokens(tokens: ExpressionToken[]): ExpressionToken[] {
  const collapsed: ExpressionToken[] = [];
  let index = 0;

  while (index < tokens.length) {
    const token = tokens[index];

    if (!token || token.type === "operator") {
      index += 1;
      continue;
    }

    let value = token.value;
    index += 1;

    while (true) {
      const operatorToken = tokens[index];
      const nextToken = tokens[index + 1];

      if (
        operatorToken?.type !== "operator" ||
        (operatorToken.value !== "*" && operatorToken.value !== "/") ||
        nextToken?.type !== "number"
      ) {
        break;
      }

      const operator = operatorToken.value;
      const nextValue = nextToken.value;

      value =
        operator === "*"
          ? value.times(nextValue)
          : nextValue.isZero()
            ? new Decimal(0)
            : value.div(nextValue);
      index += 2;
    }

    collapsed.push({ type: "number", value });

    if (
      tokens[index]?.type === "operator" &&
      (tokens[index].value === "+" || tokens[index].value === "-")
    ) {
      collapsed.push(tokens[index]);
      index += 1;
    }
  }

  return collapsed;
}

function pushNumber(tokens: ExpressionToken[], rawValue: string) {
  tokens.push({
    type: "number",
    value: new Decimal(normalizeNumber(rawValue)),
  });
}

function normalizeNumber(rawValue: string): string {
  if (rawValue === "" || rawValue === "." || rawValue === "-") return "0";
  if (rawValue === "-.") return "-0";

  return rawValue.endsWith(".") ? rawValue.slice(0, -1) || "0" : rawValue;
}

function isDigit(char: string): boolean {
  return char >= "0" && char <= "9";
}

function normalizeOperator(char: string): Operator | null {
  if (char === "+" || char === "-") return char;
  if (char === "*" || char === "×") return "*";
  if (char === "/" || char === "÷") return "/";

  return null;
}
