export type CssLengthUnit = "px" | "rpx";

export function toCssLength(
  value: number | string,
  defaultUnit: CssLengthUnit,
): string {
  return typeof value === "number" ? `${value}${defaultUnit}` : value;
}

export function toNonNegativePx(value: number): string {
  return `${Math.max(0, value)}px`;
}
