import { useState } from "react";
import { ScrollView, Text, View } from "@tarojs/components";
import {
  AccountingCategorySelector,
  type AccountingCategory,
  type AccountingCategorySelectorChangeEvent,
  type AccountingCategorySelectorClickEvent,
} from "@usmoment/taro/kit";
import { DetailShell } from "../../../showcase/detail-shell";
import "./index.css";

const categories: AccountingCategory[] = [
  { key: "Food", name: "餐饮", icon: "🍔", subtitle: "Food" },
  { key: "Drinks", name: "水饮", icon: "🥤", subtitle: "Drinks" },
  { key: "Fruit", name: "水果", icon: "🍎", subtitle: "Fruit" },
  { key: "Afternoon Tea", name: "下午茶", icon: "🧁", subtitle: "Afternoon Tea" },
  { key: "Shopping", name: "购物", icon: "🛒", subtitle: "Shopping" },
  { key: "Traffic", name: "交通", icon: "🚌", subtitle: "Traffic" },
  { key: "Hotel", name: "住宿", icon: "🏨", subtitle: "Hotel" },
  { key: "Ticket", name: "票务", icon: "🎟", subtitle: "Ticket" },
  { key: "Entertainment", name: "娱乐", icon: "🎮", subtitle: "Entertainment" },
  { key: "Snacks", name: "零食", icon: "🍬", subtitle: "Snacks" },
  { key: "Lottery", name: "彩票", icon: "🎫", subtitle: "Lottery" },
  { key: "Sports", name: "运动", icon: "🏃", subtitle: "Sports" },
  { key: "Vegetables", name: "买菜", icon: "🥬", subtitle: "Vegetables" },
  { key: "Goods", name: "日用", icon: "🫙", subtitle: "Goods" },
  { key: "Clothes", name: "服饰", icon: "👕", subtitle: "Clothes" },
  { key: "Express", name: "快递", icon: "📦", subtitle: "Express" },
  { key: "Water", name: "水电", icon: "💧", subtitle: "Water" },
  { key: "Alcohol and Tobacco", name: "烟酒", icon: "🍺", subtitle: "Alcohol and Tobacco" },
  { key: "Other", name: "其他", icon: "📝", subtitle: "Other" },
];

export default function AccountingCategorySelectorPage() {
  const [selectedKey, setSelectedKey] = useState("Food");
  const [selectedText, setSelectedText] = useState("餐饮");
  const [clickText, setClickText] = useState("等待点击");

  function handleChange(event: AccountingCategorySelectorChangeEvent) {
    setSelectedKey(event.key);
    setSelectedText(event.category.name);
  }

  function handleCategoryClick(event: AccountingCategorySelectorClickEvent) {
    setClickText(`${event.category.name}${event.selected ? "（已选）" : ""}`);
  }

  return (
    <ScrollView scrollY>
      <DetailShell
        aside={
          <>
            <View className="detail-stat">
              <Text className="detail-stat__label">当前分类</Text>
              <Text className="detail-stat__value">{selectedText}</Text>
            </View>
            <View className="detail-stat">
              <Text className="detail-stat__label">最近点击</Text>
              <Text className="detail-stat__value">{clickText}</Text>
            </View>
          </>
        }
        eyebrow="Kits"
        summary="传入业务侧 mock 分类数据，体验 Kit 默认黄色选中态和图标动画。页面滚动由外层业务容器控制。"
        title="AccountingCategorySelector"
      >
        <View className="category-selector-demo">
          <AccountingCategorySelector
            categories={categories}
            onCategoryClick={handleCategoryClick}
            onChange={handleChange}
            selectedKey={selectedKey}
          />
        </View>
      </DetailShell>
    </ScrollView>
  );
}
