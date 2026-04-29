import React from "react";

type CalcDisplayProps = {
  expression: string;
  result: string;
  note?: string;
};

export function CalcDisplay(props: CalcDisplayProps) {
  return (
    <div>
      <div>{props.expression}</div>
      <div>{props.result}</div>
      <div>{props.note ?? ""}</div>
    </div>
  );
}
