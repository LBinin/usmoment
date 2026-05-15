import { Text, View } from "@tarojs/components";
import type { AccountingCalculatorTopAccessoryPanelInput } from "@usmoment/taro/kit";

const mockPanelRows: Record<string, string[]> = {
  payer: ["车干", "小林小林活泼机灵", "小杨三将"],
  note: ["晚餐备注", "AA 付款", "待确认"],
  image: ["餐票图片", "付款截图", "收据补充"],
  date: ["今天", "昨天", "2024-05-15"],
  category: ["餐饮", "交通", "娱乐"],
};

export function renderMockTopAccessoryPanel({
  close,
  item,
}: AccountingCalculatorTopAccessoryPanelInput) {
  const rows = mockPanelRows[item.id] ?? [item.label];

  return (
    <View className="calculator-demo-panel">
      <View className="calculator-demo-panel__content">
        {rows.map((row, index) => (
          <View
            className="calculator-demo-panel__row"
            key={`${item.id}-${row}`}
          >
            <Text className="calculator-demo-panel__avatar">
              {index === 0 ? "我" : "友"}
            </Text>
            <Text className="calculator-demo-panel__label">{row}</Text>
          </View>
        ))}
      </View>
      <View className="calculator-demo-panel__close" onClick={close}>
        <Text>^ 完成编辑 唤起键盘 ^</Text>
      </View>
    </View>
  );
}
