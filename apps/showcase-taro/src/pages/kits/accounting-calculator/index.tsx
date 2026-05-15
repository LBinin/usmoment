import { useState } from "react";
import { ScrollView, Text, View } from "@tarojs/components";
import {
  AccountingCalculator,
  type AccountingCalculatorState,
} from "@usmoment/taro/kit";
import { DetailShell } from "../../../showcase/detail-shell";
import { createMockTopAccessoryItems } from "./top-accessory-data";
import { renderMockTopAccessoryPanel } from "./top-accessory-panel";
import "./index.css";

export default function AccountingCalculatorPage() {
  const [state, setState] = useState<AccountingCalculatorState>({
    expression: "",
    result: "0",
  });
  const [submitText, setSubmitText] = useState("等待提交");
  const [accessoryText, setAccessoryText] = useState("等待点击");

  function handleChange(nextState: AccountingCalculatorState) {
    setState(nextState);
  }

  function handleSubmit(nextState: AccountingCalculatorState) {
    setState(nextState);
    setSubmitText(`已提交：${nextState.result || "0"}`);
  }

  return (
    <ScrollView scrollY>
      <DetailShell
        aside={
          <>
            <View className="detail-stat">
              <Text className="detail-stat__label">表达式</Text>
              <Text className="detail-stat__value">
                {state.expression || "未输入"}
              </Text>
            </View>
            <View className="detail-stat">
              <Text className="detail-stat__label">结果</Text>
              <Text className="detail-stat__value">{state.result || "0"}</Text>
            </View>
          </>
        }
        eyebrow="Kits"
        summary="体验内置状态、表达式计算、金额展示和业务键盘组合后的完整输入流。"
        title="AccountingCalculator"
      >
        <View className="calculator-demo">
          <AccountingCalculator
            onChange={handleChange}
            onSubmit={handleSubmit}
            renderTopAccessoryPanel={renderMockTopAccessoryPanel}
            submitLabel="入账"
            topAccessoryItems={createMockTopAccessoryItems((label) => {
              setAccessoryText(`已点击：${label}`);
            })}
            vibrate="heavy"
          />
          <Text className="calculator-demo__event">{submitText}</Text>
          <Text className="calculator-demo__event">{accessoryText}</Text>
        </View>
      </DetailShell>
    </ScrollView>
  );
}
