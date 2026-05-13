import { useState } from "react";
import { ScrollView, Text, View } from "@tarojs/components";
import {
  FullscreenOptionList,
  type FullscreenOptionListChangeEvent,
  type FullscreenOptionListOption,
  type FullscreenOptionListOptionClickEvent,
} from "@usmoment/taro/ui";
import { DetailShell } from "../../../showcase/detail-shell";
import "./index.css";

type DemoOptionData = {
  label: string;
  icon: string;
  note: string;
};

const options: Array<FullscreenOptionListOption<DemoOptionData>> = [
  {
    key: "food",
    data: { label: "餐饮", icon: "饭", note: "午餐与饮品" },
  },
  {
    key: "rent",
    data: { label: "房租", icon: "屋", note: "固定支出" },
  },
  {
    key: "travel",
    data: { label: "出行", icon: "行", note: "地铁打车" },
  },
  {
    key: "gift",
    data: { label: "礼物", icon: "礼", note: "人情往来" },
  },
  {
    key: "disabled",
    disabled: true,
    data: { label: "停用", icon: "停", note: "不可触发" },
  },
];

export default function FullscreenOptionListPage() {
  const [selectedKey, setSelectedKey] = useState("food");
  const [columns, setColumns] = useState<4 | 6>(4);
  const [changeText, setChangeText] = useState("change: food");
  const [clickText, setClickText] = useState("click: 等待点击");

  function handleChange(event: FullscreenOptionListChangeEvent<DemoOptionData>) {
    setSelectedKey(event.key);
    setChangeText(`change: ${event.option.data?.label ?? event.key}`);
  }

  function handleOptionClick(
    event: FullscreenOptionListOptionClickEvent<DemoOptionData>,
  ) {
    const label = event.option.data?.label ?? event.key;
    setClickText(`click: ${label}${event.selected ? "（已选）" : ""}`);
  }

  return (
    <ScrollView scrollY>
      <DetailShell
        aside={
          <>
            <View className="detail-stat">
              <Text className="detail-stat__label">当前选中</Text>
              <Text className="detail-stat__value">{selectedKey}</Text>
            </View>
            <View className="detail-stat">
              <Text className="detail-stat__label">列数</Text>
              <Text className="detail-stat__value">{columns}</Text>
            </View>
          </>
        }
        eyebrow="UI Components"
        summary="体验受控选中态、自定义选项内容，以及 onChange 与 onOptionClick 的触发差异。"
        title="FullscreenOptionList"
      >
        <View className="option-list-demo">
          <View className="option-list-demo__toolbar">
            {[4, 6].map((value) => (
              <View
                className={[
                  "option-list-demo__toggle",
                  columns === value && "option-list-demo__toggle--active",
                ]
                  .filter(Boolean)
                  .join(" ")}
                key={value}
                onClick={() => setColumns(value as 4 | 6)}
              >
                <Text>{value} 列</Text>
              </View>
            ))}
          </View>

          <FullscreenOptionList<DemoOptionData>
            columns={columns}
            onChange={handleChange}
            onOptionClick={handleOptionClick}
            options={options}
            renderOption={({ disabled, option, selected }) => (
              <View className="option-list-demo__option">
                <Text className="option-list-demo__icon">
                  {option.data?.icon}
                </Text>
                <Text className="option-list-demo__label">
                  {option.data?.label ?? option.key}
                </Text>
                <Text className="option-list-demo__note">
                  {disabled ? "禁用项" : option.data?.note}
                </Text>
                {selected ? (
                  <Text className="option-list-demo__badge">已选</Text>
                ) : null}
              </View>
            )}
            selectedKey={selectedKey}
          />

          <View className="option-list-demo__events">
            <Text className="option-list-demo__event">{changeText}</Text>
            <Text className="option-list-demo__event">{clickText}</Text>
          </View>
        </View>
      </DetailShell>
    </ScrollView>
  );
}
