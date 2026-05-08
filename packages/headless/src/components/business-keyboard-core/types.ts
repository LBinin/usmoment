export type BusinessKeyboardBuiltInAction =
  | "input"
  | "backspace"
  | "clear"
  | "submit"
  | "custom";

export type BusinessKeyboardAction =
  | BusinessKeyboardBuiltInAction
  | (string & {});

export type BusinessKeyboardKeyVariant =
  | "default"
  | "number"
  | "operator"
  | "primary"
  | "danger";

export type BusinessKeyboardKey = {
  id: string;
  label: string;
  action?: BusinessKeyboardAction;
  value?: string;
  variant?: BusinessKeyboardKeyVariant;
  span?: number;
  disabled?: boolean;
  payload?: unknown;
};

export type BusinessKeyboardResolvedKey = Required<
  Pick<BusinessKeyboardKey, "action" | "span" | "variant">
> &
  Omit<BusinessKeyboardKey, "action" | "span" | "variant">;

export type BusinessKeyboardLayout = string[][];

export type BusinessKeyboardConfig = {
  keys: BusinessKeyboardKey[];
  layout: BusinessKeyboardLayout;
  columns?: number;
  meta?: {
    name?: string;
    label?: string;
    category?: string;
  };
};

export type AccountingCalcKeyboardConfigOptions = {
  submitLabel?: string;
  clearLabel?: string;
};

export type ResolveBusinessKeyboardConfigInput = {
  config: BusinessKeyboardConfig;
  keys?: BusinessKeyboardKey[];
  layout?: BusinessKeyboardLayout;
  columns?: number;
};

export type BusinessKeyboardWarningCode = "unknown-key" | "invalid-span";

export type BusinessKeyboardWarning = {
  code: BusinessKeyboardWarningCode;
  keyId?: string;
  message: string;
  severity: "warning";
};

export type BusinessKeyboardResolvedConfig = {
  keys: BusinessKeyboardResolvedKey[];
  rows: BusinessKeyboardResolvedKey[][];
  flatKeys: BusinessKeyboardResolvedKey[];
  columns: number;
  warnings: BusinessKeyboardWarning[];
  meta?: BusinessKeyboardConfig["meta"];
};

export type BusinessKeyboardEvent = {
  key: BusinessKeyboardResolvedKey;
  action: BusinessKeyboardAction;
  value?: string;
  payload?: unknown;
};
