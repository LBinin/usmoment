import Taro from "@tarojs/taro";
import { ScrollView, Text, View } from "@tarojs/components";
import { showcaseGroups, type ShowcaseComponent } from "../../showcase/catalog";
import "./index.css";

export default function ShowcaseHome() {
  function openComponent(item: ShowcaseComponent) {
    void Taro.navigateTo({ url: item.route });
  }

  return (
    <ScrollView className="showcase" scrollY>
      <View className="showcase__hero">
        <Text className="showcase__eyebrow">usmoment showcase</Text>
        <Text className="showcase__title">组件库展厅</Text>
        <Text className="showcase__summary">
          在真实 Taro 小程序环境里查看组件的交互、状态和视觉结果。
        </Text>
      </View>

      {showcaseGroups.map((group) => (
        <View className="showcase__section" key={group.id}>
          <View className="showcase__section-heading">
            <Text className="showcase__section-title">{group.title}</Text>
            <Text className="showcase__section-copy">{group.subtitle}</Text>
          </View>

          <View className="component-grid">
            {group.items.map((item) => (
              <View
                className="component-tab"
                key={item.id}
                onClick={() => openComponent(item)}
              >
                <View className="component-tab__meta">
                  <Text className="component-tab__layer">
                    {item.layer === "kit" ? "Kit" : "UI"}
                  </Text>
                  <Text className="component-tab__name">{item.name}</Text>
                  <Text className="component-tab__zh">{item.zhName}</Text>
                </View>
                <Text className="component-tab__summary">{item.summary}</Text>
                <View className="component-tab__tags">
                  {item.tags.map((tag) => (
                    <Text className="component-tab__tag" key={tag}>
                      {tag}
                    </Text>
                  ))}
                </View>
              </View>
            ))}
          </View>
        </View>
      ))}
    </ScrollView>
  );
}
