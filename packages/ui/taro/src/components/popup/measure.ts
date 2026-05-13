export function measureContentHeight(
  node: unknown,
  id: string,
  onHeight: (height: number) => void,
): void {
  const refHeight = readElementHeight(node);

  if (refHeight !== undefined) {
    onHeight(refHeight);
    return;
  }

  measureSelectorHeight(id, onHeight);
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

type SelectorQueryHost = {
  createSelectorQuery?: () => {
    exec?: (callback?: (result: Array<{ height?: number }>) => void) => void;
    select?: (selector: string) => {
      boundingClientRect?: () => unknown;
    };
  };
};

function measureSelectorHeight(
  id: string,
  onHeight: (height: number) => void,
): void {
  const host = globalThis as { Taro?: SelectorQueryHost; wx?: SelectorQueryHost };
  const query =
    host.Taro?.createSelectorQuery?.() ?? host.wx?.createSelectorQuery?.();
  const selection = query?.select?.(`#${id}`);

  if (!selection?.boundingClientRect || !query?.exec) return;

  selection.boundingClientRect();
  query.exec((result) => {
    const height = result?.[0]?.height;

    if (typeof height === "number" && Number.isFinite(height)) {
      onHeight(height);
    }
  });
}
