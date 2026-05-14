import React from "react";
import {
  FullscreenOptionList,
  type FullscreenOptionListOption,
} from "@usmoment/ui-web";
import clsx from "clsx";
import { CategoryOptionContent } from "./option-content";
import "./style.css";

export type AccountingCategory = {
  key: string;
  name: string;
  icon?: React.ReactNode;
  subtitle?: string;
  disabled?: boolean;
};

export type AccountingCategorySelectorChangeEvent = {
  key: string;
  category: AccountingCategory;
  nativeEvent?: unknown;
};

export type AccountingCategorySelectorClickEvent =
  AccountingCategorySelectorChangeEvent & {
    selected: boolean;
  };

export type AccountingCategorySelectorProps = {
  categories: AccountingCategory[];
  selectedKey?: string;
  columns?: number;
  className?: string;
  style?: React.CSSProperties;
  categoryClassName?: string;
  categoryStyle?: React.CSSProperties;
  iconClassName?: string;
  nameClassName?: string;
  subtitleClassName?: string;
  onChange?: (event: AccountingCategorySelectorChangeEvent) => void;
  onCategoryClick?: (event: AccountingCategorySelectorClickEvent) => void;
};

export function AccountingCategorySelector(
  props: AccountingCategorySelectorProps,
) {
  const {
    categories,
    categoryClassName,
    categoryStyle,
    className,
    columns = 4,
    iconClassName,
    nameClassName,
    onCategoryClick,
    onChange,
    selectedKey,
    style,
    subtitleClassName,
  } = props;
  const options: Array<FullscreenOptionListOption<AccountingCategory>> =
    categories.map((category) => ({
      key: category.key,
      disabled: category.disabled,
      data: category,
    }));

  return (
    <FullscreenOptionList<AccountingCategory>
      className={clsx("usm-accounting-category-selector", className)}
      columns={columns}
      onChange={(event) =>
        onChange?.({
          key: event.key,
          category: event.option.data!,
          nativeEvent: event.nativeEvent,
        })
      }
      onOptionClick={(event) =>
        onCategoryClick?.({
          key: event.key,
          category: event.option.data!,
          nativeEvent: event.nativeEvent,
          selected: event.selected,
        })
      }
      optionClassName={clsx(
        "usm-accounting-category-selector__category",
        categoryClassName,
      )}
      optionStyle={categoryStyle}
      options={options}
      renderOption={(event) => (
        <CategoryOptionContent
          category={event.option.data!}
          iconClassName={iconClassName}
          nameClassName={nameClassName}
          subtitleClassName={subtitleClassName}
        />
      )}
      selectedKey={selectedKey}
      style={style}
    />
  );
}
