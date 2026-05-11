import { useState } from "react";
import { Button, ScrollView, Text, View } from "@tarojs/components";
import {
  AccountingCalculator,
  AccountingCalculatorPopup,
  type AccountingCalculatorState,
} from "@usmoment/taro/kit";
import { DetailShell } from "../../../showcase/detail-shell";
import "./index.css";

const initialState: AccountingCalculatorState = {
  expression: "",
  result: "0",
};

export default function AccountingCalculatorPopupPage() {
  const [open, setOpen] = useState(false);
  const [height, setHeight] = useState(0);
  const [state, setState] = useState<AccountingCalculatorState>(initialState);
  const [submitText, setSubmitText] = useState("等待弹出键盘");

  function handleSubmit(nextState: AccountingCalculatorState) {
    setState(nextState);
    setSubmitText(`已入账：${nextState.result || "0"}`);
    setOpen(false);
  }

  return (
    <ScrollView scrollY>
      <DetailShell
        aside={
          <>
            <View className="detail-stat">
              <Text className="detail-stat__label">弹层高度</Text>
              <Text className="detail-stat__value">
                {height ? `${Math.round(height)}px` : "待测量"}
              </Text>
            </View>
            <View className="detail-stat">
              <Text className="detail-stat__label">当前结果</Text>
              <Text className="detail-stat__value">{state.result || "0"}</Text>
            </View>
          </>
        }
        eyebrow="Kits"
        summary="体验在页面内容中唤起底部记账键盘，并通过占位避免键盘遮挡列表内容。"
        title="AccountingCalculatorPopup"
      >
        <View className="calculator-popup-demo">
          <View className="calculator-popup-demo__bill">
            <Text className="calculator-popup-demo__label">账单分类</Text>
            <Text className="calculator-popup-demo__category">彩票 Lottery</Text>
            <Text className="calculator-popup-demo__hint">
              点击下方按钮唤起底部金额键盘，遮罩点击可关闭。
            </Text>
          </View>
          <Button
            className="calculator-popup-demo__trigger"
            onClick={() => setOpen(true)}
          >
            唤起记账键盘
          </Button>
          <Text className="calculator-popup-demo__event">{submitText}</Text>

          <AccountingCalculatorPopup
            onContentHeightChange={setHeight}
            onOpenChange={setOpen}
            open={open}
          >
            <AccountingCalculator
              onChange={setState}
              onSubmit={handleSubmit}
              submitLabel="入账"
              vibrate="light"
            />
          </AccountingCalculatorPopup>
        </View>
      </DetailShell>
    </ScrollView>
  );
}
