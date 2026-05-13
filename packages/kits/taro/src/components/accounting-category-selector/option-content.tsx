import React from "react";
import { Text, View } from "@tarojs/components";
import type { View as TaroView } from "@tarojs/components";
import clsx from "clsx";
import type { AccountingCategory } from "./index";

type TaroRenderable = React.ComponentProps<typeof TaroView>["children"];

export function CategoryOptionContent(props: {
  category: AccountingCategory;
  iconClassName?: string;
  nameClassName?: string;
  subtitleClassName?: string;
}) {
  const {
    category,
    iconClassName,
    nameClassName,
    subtitleClassName,
  } = props;

  return (
    <>
      <View className="usm-accounting-category-selector__title">
        <Text
          className={clsx(
            "usm-accounting-category-selector__name",
            nameClassName,
          )}
        >
          {category.name}
        </Text>
        {category.subtitle ? (
          <Text
            className={clsx(
              "usm-accounting-category-selector__subtitle",
              subtitleClassName,
            )}
          >
            {category.subtitle}
          </Text>
        ) : null}
      </View>
      {category.icon ? (
        <View
          className={clsx(
            "usm-accounting-category-selector__icon",
            iconClassName,
          )}
        >
          {category.icon as TaroRenderable}
        </View>
      ) : null}
    </>
  );
}
