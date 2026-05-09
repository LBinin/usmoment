import { useMemo, useState } from "react";
import { Text, View } from "@tarojs/components";
import {
  createAccountingCalcKeyboardConfig,
  type BusinessKeyboardEvent,
} from "@usmoment/taro/headless";
import { BusinessKeyboard } from "@usmoment/taro/ui";
import {
  applyKeyboardEvent,
  formatKeyboardEvent,
  keyboardModes,
  type KeyboardMode,
} from "../pages/index/showcase-data";
import "./business-keyboard-demo.css";

export function BusinessKeyboardDemo() {
  const [mode, setMode] = useState<KeyboardMode>("standard");
  const [draftValue, setDraftValue] = useState("128.00");
  const [lastEvent, setLastEvent] = useState("等待按键");
  const keyboardConfig = useMemo(
    () =>
      createAccountingCalcKeyboardConfig({
        submitLabel: mode === "compact" ? "OK" : "完成",
      }),
    [mode],
  );
  const selectedMode =
    keyboardModes.find((item) => item.id === mode) ?? keyboardModes[0];

  function handleKeyPress(event: BusinessKeyboardEvent) {
    const nextValue = applyKeyboardEvent(draftValue, event);

    setDraftValue(nextValue);
    setLastEvent(formatKeyboardEvent(event));
  }

  return (
    <View className="keyboard-demo">
      <View className="keyboard-demo__mode-list">
        {keyboardModes.map((item) => (
          <View
            className={
              item.id === mode
                ? "keyboard-demo-mode keyboard-demo-mode--active"
                : "keyboard-demo-mode"
            }
            key={item.id}
            onClick={() => setMode(item.id)}
          >
            <Text className="keyboard-demo-mode__label">{item.label}</Text>
            <Text className="keyboard-demo-mode__description">
              {item.description}
            </Text>
          </View>
        ))}
      </View>

      <View className="keyboard-demo__panel">
        <View className="keyboard-demo__display">
          <Text className="keyboard-demo__label">{selectedMode.label}</Text>
          <Text className="keyboard-demo__value">{draftValue || "0"}</Text>
          <Text className="keyboard-demo__event">{lastEvent}</Text>
        </View>

        <BusinessKeyboard
          ariaLabel="BusinessKeyboard 业务键盘示例"
          columnGap={mode === "compact" ? 6 : 8}
          config={keyboardConfig}
          disabled={mode === "disabled"}
          keyHeight={mode === "compact" ? 52 : 60}
          onKeyPress={handleKeyPress}
          rowGap={mode === "compact" ? 6 : 8}
          vibrate="light"
        />
      </View>
    </View>
  );
}
