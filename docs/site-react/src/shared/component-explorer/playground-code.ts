export function businessKeyboardPlaygroundCode(options: {
  columnGap: string;
  gap: string;
  keyFontFamily: string;
  keyHeight: string;
  rightColumnWidth: string;
  rowGap: string;
  submitLabel: string;
  vibrate: false | "light" | "medium" | "heavy";
}) {
  const keyFontFamilyLine = options.keyFontFamily.trim()
    ? `\n  keyFontFamily={${JSON.stringify(options.keyFontFamily)}}`
    : "";

  return `const config = createAccountingCalcKeyboardConfig({
  submitLabel: "${options.submitLabel}",
})

<BusinessKeyboard
  config={config}
  columnGap={${JSON.stringify(options.columnGap)}}
  columnWidths={[1, 1, 1, ${Number(options.rightColumnWidth) || 1.2875}]}
  gap={${JSON.stringify(options.gap)}}
  keyHeight={${JSON.stringify(options.keyHeight)}}
  rowGap={${JSON.stringify(options.rowGap)}}
  vibrate={${options.vibrate ? `"${options.vibrate}"` : "false"}}${keyFontFamilyLine}
/>`;
}

export function accountingDisplayPlaygroundCode(options: {
  billName: string;
  currencySymbol: string;
  expression: string;
  result: string;
}) {
  const currencySymbolLine =
    options.currencySymbol === ""
      ? ""
      : `  currencySymbol=${JSON.stringify(options.currencySymbol)}\n`;

  return `<AccountingDisplay
${currencySymbolLine}  expression=${JSON.stringify(options.expression)}
  nameValue=${JSON.stringify(options.billName)}
  result=${JSON.stringify(options.result)}
  onNameChange={(value) => setBillName(value)}
/>`;
}

export function fullscreenOptionListPlaygroundCode(options: {
  columns: string;
  compact: boolean;
  selectedKey: string;
}) {
  const renderMode = options.compact ? "compact-option" : "option-card";

  return `<FullscreenOptionList
  options={options}
  selectedKey=${JSON.stringify(options.selectedKey)}
  columns={${Number(options.columns) || 3}}
  optionClassName={({ selected }) =>
    selected ? "option-list-demo-selected" : undefined
  }
  renderOption={({ option, selected }) =>
    ${JSON.stringify(renderMode)} === "compact-option" ? (
      <span className="compact-option">
        {option.data.label}{selected ? " · selected" : ""}
      </span>
    ) : (
      <span className="option-card">
        <span>{option.data.label}</span>
        <small>{option.data.hint}</small>
      </span>
    )
  }
  onChange={(event) => setSelectedKey(event.key)}
  onOptionClick={(event) => console.log(event)}
/>`;
}

export function accountingCategorySelectorPlaygroundCode(options: {
  columns: string;
  selectedKey: string;
}) {
  return `const categories = [
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
]

<AccountingCategorySelector
  categories={categories}
  selectedKey="${options.selectedKey}"
  columns={${Number(options.columns) || 4}}
  onChange={(event) => setSelectedKey(event.key)}
  onCategoryClick={(event) => console.log(event)}
/>`;
}
