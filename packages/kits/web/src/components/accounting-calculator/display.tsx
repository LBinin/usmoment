import React from "react";
import { AccountingDisplay } from "../accounting-display";
import type {
  AccountingCalculatorDisplay,
  AccountingCalculatorState,
} from "./index";

export function renderAccountingDisplay(
  display: AccountingCalculatorDisplay | undefined,
  state: AccountingCalculatorState,
): React.ReactNode {
  if (display === undefined) {
    return (
      <AccountingDisplay
        expression={state.expression}
        result={state.result}
      />
    );
  }

  if (display === null) return null;

  if (typeof display === "function") {
    const rendered = display(state.expression, state.result);

    return rendered === false || rendered === "none" ? null : rendered;
  }

  return display;
}
