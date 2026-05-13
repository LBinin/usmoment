const standaloneSymbolTokens: Record<string, string> = {
  "+": "plus",
  "-": "minus",
  ".": "dot",
  "=": "equals",
  "×": "multiply",
  "*": "multiply",
  "÷": "divide",
  "/": "divide",
  "%": "percent",
};

export function toClassToken(value: string): string {
  const trimmed = value.trim().toLowerCase();

  if (standaloneSymbolTokens[trimmed]) {
    return standaloneSymbolTokens[trimmed];
  }

  const parts: string[] = [];
  let current = "";

  for (const char of Array.from(trimmed)) {
    if (/^[a-z0-9_-]$/.test(char)) {
      current += char;
      continue;
    }

    if (/^[\s/]+$/.test(char)) {
      if (current) {
        parts.push(current);
        current = "";
      }
      continue;
    }

    if (standaloneSymbolTokens[char]) {
      if (current) {
        parts.push(current);
        current = "";
      }
      parts.push(standaloneSymbolTokens[char]);
      continue;
    }

    if (current) {
      parts.push(current);
      current = "";
    }
    parts.push(`u${char.codePointAt(0)?.toString(16) ?? "unknown"}`);
  }

  if (current) parts.push(current);

  return parts.join("-").replace(/-+/g, "-").replace(/^-+|-+$/g, "") || "unknown";
}
