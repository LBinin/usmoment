const DATE_ACTION_VALUE_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/;
const TIME_ACTION_VALUE_PATTERN = /^(\d{2}):(\d{2})$/;

export function createDateActionValue(date = new Date()): string {
  return [
    String(date.getFullYear()).padStart(4, "0"),
    padDateTimePart(date.getMonth() + 1),
    padDateTimePart(date.getDate()),
  ].join("-");
}

export function createTimeActionValue(date = new Date()): string {
  return [
    padDateTimePart(date.getHours()),
    padDateTimePart(date.getMinutes()),
  ].join(":");
}

export function formatDateActionDisplayValue(value: string): string {
  const normalizedValue = isDateActionValue(value)
    ? value
    : createDateActionValue();
  const [year, month, day] = normalizedValue.split("-");

  return `${year}年${month}月${day}日`;
}

export function formatTimeActionDisplayValue(value: string): string {
  return isTimeActionValue(value) ? value : createTimeActionValue();
}

export function resolveDateActionValue(
  value: string | undefined,
  fallbackValue: string,
): string {
  return value && isDateActionValue(value) ? value : fallbackValue;
}

export function resolveTimeActionValue(
  value: string | undefined,
  fallbackValue: string,
): string {
  return value && isTimeActionValue(value) ? value : fallbackValue;
}

function isDateActionValue(value: string): boolean {
  const match = DATE_ACTION_VALUE_PATTERN.exec(value);

  if (!match) return false;

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(year, month - 1, day);

  return (
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
  );
}

function isTimeActionValue(value: string): boolean {
  const match = TIME_ACTION_VALUE_PATTERN.exec(value);

  if (!match) return false;

  const hours = Number(match[1]);
  const minutes = Number(match[2]);

  return hours >= 0 && hours <= 23 && minutes >= 0 && minutes <= 59;
}

function padDateTimePart(value: number): string {
  return String(value).padStart(2, "0");
}
