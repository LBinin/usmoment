export type SelectionMode = "single" | "multi";

export function createSelectionState(input: { mode: SelectionMode }) {
  const selected = new Set<string>();

  return {
    toggle(key: string) {
      if (input.mode === "single") {
        selected.clear();
        selected.add(key);
        return;
      }

      if (selected.has(key)) {
        selected.delete(key);
        return;
      }

      selected.add(key);
    },
    values() {
      return [...selected];
    },
    clear() {
      selected.clear();
    },
  };
}
