import type { ReactNode } from "react";
import { Text, View } from "@tarojs/components";
import "./detail-shell.css";

export function DetailShell(props: {
  eyebrow: string;
  title: string;
  summary: string;
  children: ReactNode;
  aside?: ReactNode;
}) {
  return (
    <View className="detail-page">
      <View className="detail-hero">
        <Text className="detail-hero__eyebrow">{props.eyebrow}</Text>
        <Text className="detail-hero__title">{props.title}</Text>
        <Text className="detail-hero__summary">{props.summary}</Text>
      </View>
      {props.aside ? <View className="detail-aside">{props.aside}</View> : null}
      <View className="detail-stage">{props.children}</View>
    </View>
  );
}
