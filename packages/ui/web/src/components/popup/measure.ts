export function measureContentHeight(
  node: unknown,
  onHeight: (height: number) => void,
): void {
  const height = readElementHeight(node);

  if (height !== undefined) {
    onHeight(height);
  }
}

function readElementHeight(node: unknown): number | undefined {
  if (!node || typeof node !== "object") return undefined;

  const element = node as {
    getBoundingClientRect?: () => { height?: number };
    offsetHeight?: number;
  };
  const rectHeight = element.getBoundingClientRect?.().height;

  if (typeof rectHeight === "number" && Number.isFinite(rectHeight)) {
    return rectHeight;
  }

  if (
    typeof element.offsetHeight === "number" &&
    Number.isFinite(element.offsetHeight)
  ) {
    return element.offsetHeight;
  }

  return undefined;
}
