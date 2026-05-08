import React from "react";
import "./style.css";

type CalcDisplayProps = {
  expression: string;
  result: string;
  note?: string;
};

export function CalcDisplay(props: CalcDisplayProps) {
  return (
    <div className="usm-calc-display">
      <div className="usm-calc-display__expression">{props.expression}</div>
      <div className="usm-calc-display__result">{props.result}</div>
      <div className="usm-calc-display__note">{props.note ?? ""}</div>
    </div>
  );
}
