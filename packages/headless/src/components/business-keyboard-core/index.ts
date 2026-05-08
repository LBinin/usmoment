import type {
  AccountingCalcKeyboardConfigOptions,
  BusinessKeyboardConfig,
  BusinessKeyboardEvent,
  BusinessKeyboardKey,
  BusinessKeyboardResolvedConfig,
  BusinessKeyboardResolvedKey,
  BusinessKeyboardWarning,
  ResolveBusinessKeyboardConfigInput,
} from "./types";

export type {
  AccountingCalcKeyboardConfigOptions,
  BusinessKeyboardAction,
  BusinessKeyboardBuiltInAction,
  BusinessKeyboardConfig,
  BusinessKeyboardEvent,
  BusinessKeyboardKey,
  BusinessKeyboardKeyVariant,
  BusinessKeyboardLayout,
  BusinessKeyboardResolvedConfig,
  BusinessKeyboardResolvedKey,
  BusinessKeyboardWarning,
  BusinessKeyboardWarningCode,
  ResolveBusinessKeyboardConfigInput,
} from "./types";

const accountingCalcKeys: BusinessKeyboardKey[] = [
  ...["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"].map((digit) => ({
    id: digit,
    label: digit,
    action: "input" as const,
    value: digit,
    variant: "number" as const,
  })),
  {
    id: ".",
    label: ".",
    action: "input",
    value: ".",
    variant: "number",
  },
  {
    id: "+",
    label: "+",
    action: "input",
    value: "+",
    variant: "operator",
  },
  {
    id: "-",
    label: "-",
    action: "input",
    value: "-",
    variant: "operator",
  },
  {
    id: "backspace",
    label: "⌫",
    action: "backspace",
    variant: "default",
  },
  {
    id: "clear",
    label: "C",
    action: "clear",
    variant: "danger",
  },
  {
    id: "submit",
    label: "完成",
    action: "submit",
    variant: "primary",
  },
];

export function createBusinessKeyboardConfig(
  config: BusinessKeyboardConfig,
): BusinessKeyboardConfig {
  return {
    ...config,
    keys: [...config.keys],
    layout: config.layout.map((row) => [...row]),
  };
}

export function createAccountingCalcKeyboardConfig(
  options: AccountingCalcKeyboardConfigOptions = {},
): BusinessKeyboardConfig {
  return createBusinessKeyboardConfig({
    keys: accountingCalcKeys.map((key) =>
      key.id === "submit"
        ? { ...key, label: options.submitLabel ?? key.label }
        : key.id === "clear"
          ? { ...key, label: options.clearLabel ?? key.label }
          : { ...key },
    ),
    layout: [
      ["7", "8", "9", "backspace"],
      ["4", "5", "6", "+"],
      ["1", "2", "3", "-"],
      ["clear", "0", ".", "submit"],
    ],
    columns: 4,
    meta: {
      name: "accounting-calc",
      label: "Accounting Calculator",
      category: "accounting",
    },
  });
}

export function resolveBusinessKeyboardConfig(
  input: BusinessKeyboardConfig | ResolveBusinessKeyboardConfigInput,
): BusinessKeyboardResolvedConfig {
  const configInput = "config" in input ? input : { config: input };
  const keys = mergeKeys(configInput.config.keys, configInput.keys ?? []);
  const layout = configInput.layout ?? configInput.config.layout;
  const columns =
    configInput.columns ??
    configInput.config.columns ??
    Math.max(...layout.map((row) => row.length), 1);
  const warnings: BusinessKeyboardWarning[] = [];
  const keyMap = new Map(
    keys.map((key) => [key.id, normalizeKey(key, columns, warnings)]),
  );

  const rows = layout.map((row) =>
    row.flatMap((keyId) => {
      const key = keyMap.get(keyId);

      if (!key) {
        warnings.push({
          code: "unknown-key",
          keyId,
          message: `Keyboard layout references unknown key "${keyId}".`,
          severity: "warning",
        });
        return [];
      }

      return [key];
    }),
  );

  return {
    keys: [...keyMap.values()],
    rows,
    flatKeys: rows.flat(),
    columns,
    warnings,
    meta: configInput.config.meta,
  };
}

export function createBusinessKeyboardEvent(
  key: BusinessKeyboardResolvedKey,
): BusinessKeyboardEvent {
  return {
    key,
    action: key.action,
    value: key.value,
    payload: key.payload,
  };
}

function mergeKeys(
  baseKeys: BusinessKeyboardKey[],
  customKeys: BusinessKeyboardKey[],
): BusinessKeyboardKey[] {
  const keyMap = new Map<string, BusinessKeyboardKey>();

  for (const key of [...baseKeys, ...customKeys]) {
    keyMap.set(key.id, { ...key });
  }

  return [...keyMap.values()];
}

function normalizeKey(
  key: BusinessKeyboardKey,
  columns: number,
  warnings: BusinessKeyboardWarning[],
): BusinessKeyboardResolvedKey {
  const requestedSpan = key.span ?? 1;
  const span = clampSpan(requestedSpan, columns);

  if (requestedSpan !== span) {
    warnings.push({
      code: "invalid-span",
      keyId: key.id,
      message: `Keyboard key "${key.id}" has invalid span ${requestedSpan}. It was clamped to ${span}.`,
      severity: "warning",
    });
  }

  return {
    ...key,
    action: key.action ?? "input",
    span,
    variant: key.variant ?? "default",
  };
}

function clampSpan(span: number, columns: number): number {
  if (!Number.isFinite(span)) return 1;

  return Math.max(1, Math.min(Math.trunc(span), columns));
}
