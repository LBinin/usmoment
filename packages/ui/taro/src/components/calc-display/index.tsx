import React from "react";
import { Text, View } from "@tarojs/components";
import "./style.css";

type CalcDisplayProps = {
  expression: string;
  result: string;
  note?: string;
};

export function CalcDisplay(props: CalcDisplayProps) {
  return (
    <View className="usm-calc-display">
      <Text className="usm-calc-display__expression">{props.expression}</Text>
      <Text className="usm-calc-display__result">{props.result}</Text>
      <Text className="usm-calc-display__note">{props.note ?? ""}</Text>
    </View>
  );
}
