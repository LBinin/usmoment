export function formatJson(value: unknown): string {
  return JSON.stringify(value, null, 2);
}

export function parseJson<T>(value: string, fallback: T): T {
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

export function parseJsonError(value: string): string | null {
  try {
    JSON.parse(value);

    return null;
  } catch (error) {
    return error instanceof Error ? error.message : "Invalid JSON";
  }
}

export function toPlaygroundSize(value: string): number | string | undefined {
  if (value.trim() === "") return undefined;

  const numeric = Number(value);

  return Number.isNaN(numeric) ? value : numeric;
}

export function readStringProp(source: string, prop: string): string | null {
  const propPattern = escapeRegExp(prop);
  const match = source.match(
    new RegExp(`${propPattern}\\s*=\\s*(?:\\{\\s*)?["'\`]([^"'\`]*)["'\`](?:\\s*\\})?`),
  );

  return match?.[1] ?? null;
}

export function hasJsxProp(source: string, prop: string): boolean {
  return new RegExp(`${escapeRegExp(prop)}\\s*=`).test(source);
}

export function readJsxPropValue(source: string, prop: string): string | null {
  const propPattern = escapeRegExp(prop);
  const match = source.match(
    new RegExp(
      `${propPattern}\\s*=\\s*\\{?\\s*(?:"([^"]*)"|'([^']*)'|\`([^\`]*)\`|(-?\\d+(?:\\.\\d+)?))\\s*\\}?`,
    ),
  );

  return match?.[1] ?? match?.[2] ?? match?.[3] ?? match?.[4] ?? null;
}

export function readNumberProp(source: string, prop: string): number | null {
  const propPattern = escapeRegExp(prop);
  const match = source.match(
    new RegExp(`${propPattern}\\s*=\\s*\\{?\\s*(-?\\d+(?:\\.\\d+)?)\\s*\\}?`),
  );

  return match ? Number(match[1]) : null;
}

export function readObjectStringProp(source: string, prop: string): string | null {
  const propPattern = escapeRegExp(prop);
  const match = source.match(
    new RegExp(`${propPattern}\\s*:\\s*["'\`]([^"'\`]*)["'\`]`),
  );

  return match?.[1] ?? null;
}

export function readObjectNumberProp(source: string, prop: string): number | null {
  const propPattern = escapeRegExp(prop);
  const match = source.match(
    new RegExp(`${propPattern}\\s*:\\s*(-?\\d+(?:\\.\\d+)?)`),
  );

  return match ? Number(match[1]) : null;
}

export function readVibrateProp(
  source: string,
): false | "light" | "medium" | "heavy" | null {
  const value = readJsxPropValue(source, "vibrate");

  if (value === null) return null;
  if (value === "false") return false;
  if (value === "light" || value === "medium" || value === "heavy") {
    return value;
  }

  return null;
}

export function readColumnWidthsLastValue(source: string): string | null {
  const match = source.match(/columnWidths\s*=\s*\{\s*\[([^\]]*)\]\s*\}/);

  if (!match) return null;

  const values = match[1].split(",").map((value) => value.trim());
  const lastValue = values.at(-1);

  return lastValue && Number.isFinite(Number(lastValue)) ? lastValue : null;
}

export function readTokenArray(source: string): string[] | null {
  const match = source.match(/for\s*\(\s*const token of\s*(\[[\s\S]*?\])\s*\)/);

  if (!match) return null;

  try {
    const value = JSON.parse(match[1]);

    return Array.isArray(value) && value.every((item) => typeof item === "string")
      ? value
      : null;
  } catch {
    return null;
  }
}

export function readToggleValues(source: string): string[] {
  const matches = source.matchAll(/state\.toggle\(\s*["'\`]([^"'\`]*)["'\`]\s*\)/g);

  return [...matches].map((match) => match[1]);
}

export function readObjectLiteralValue(source: string, prop: string): string | null {
  const propPattern = new RegExp(`${escapeRegExp(prop)}\\s*:`);
  const propMatch = propPattern.exec(source);

  if (!propMatch) return null;

  const valueStart = source.slice(propMatch.index + propMatch[0].length).search(/\S/);

  if (valueStart === -1) return null;

  const startIndex = propMatch.index + propMatch[0].length + valueStart;
  const opener = source[startIndex];
  const closer = opener === "[" ? "]" : opener === "{" ? "}" : null;

  if (!closer) return null;

  const endIndex = findBalancedEndIndex(source, startIndex, opener, closer);

  return endIndex === -1 ? null : source.slice(startIndex, endIndex + 1);
}

function findBalancedEndIndex(
  source: string,
  startIndex: number,
  opener: string,
  closer: string,
) {
  let depth = 0;
  let quote: string | null = null;
  let isEscaped = false;

  for (let index = startIndex; index < source.length; index += 1) {
    const char = source[index];

    if (quote) {
      if (isEscaped) {
        isEscaped = false;
      } else if (char === "\\") {
        isEscaped = true;
      } else if (char === quote) {
        quote = null;
      }

      continue;
    }

    if (char === '"' || char === "'" || char === "`") {
      quote = char;
      continue;
    }

    if (char === opener) {
      depth += 1;
      continue;
    }

    if (char === closer) {
      depth -= 1;

      if (depth === 0) return index;
    }
  }

  return -1;
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
