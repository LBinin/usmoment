export function normalizeOptionColumns(columns: number | undefined): number {
  if (columns === undefined || !Number.isFinite(columns)) return 4;

  return Math.max(1, Math.floor(columns));
}
