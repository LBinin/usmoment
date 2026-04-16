import React, { useMemo, useState } from "react";
import { createExpressionEngine } from "@usmoment/headless-expression-engine";
import { CalcDisplay, CalcKeyboard } from "@usmoment/ui-taro";

export function AccountingCalcKit() {
  const engine = useMemo(() => createExpressionEngine({ scale: 2 }), []);
  const [expression, setExpression] = useState("");
  const [result, setResult] = useState("0.00");

  return (
    <div>
      <CalcDisplay expression={expression} result={result} />
      <CalcKeyboard
        onPress={(token) => {
          engine.input(token);
          setExpression(engine.expression());
          setResult(engine.evaluate());
        }}
      />
    </div>
  );
}
