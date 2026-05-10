import type { IconDefinition, IconNode } from "./types.js";

export const defaultIconColor = "var(--usm-icon-color, currentColor)";

const maxCachedColorsPerIcon = 32;
const svgDataUrlCache = new WeakMap<IconDefinition, Map<string, string>>();

export function createSvgDataUrl(
  definition: IconDefinition,
  color: string,
): string {
  const colorCache = getColorCache(definition);
  const cached = colorCache.get(color);

  if (cached) return cached;

  const svg = [
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${escapeAttr(
      definition.viewBox,
    )}" width="${definition.width}" height="${definition.height}">`,
    ...definition.children.map((node) => serializeSvgNode(node, color)),
    "</svg>",
  ].join("");

  const dataUrl = `data:image/svg+xml;base64,${encodeBase64(svg)}`;
  setCachedDataUrl(colorCache, color, dataUrl);

  return dataUrl;
}

function getColorCache(definition: IconDefinition): Map<string, string> {
  const cached = svgDataUrlCache.get(definition);

  if (cached) return cached;

  const colorCache = new Map<string, string>();
  svgDataUrlCache.set(definition, colorCache);

  return colorCache;
}

function setCachedDataUrl(
  colorCache: Map<string, string>,
  color: string,
  dataUrl: string,
) {
  if (colorCache.size >= maxCachedColorsPerIcon) {
    const firstKey = colorCache.keys().next().value;

    if (firstKey !== undefined) {
      colorCache.delete(firstKey);
    }
  }

  colorCache.set(color, dataUrl);
}

function serializeSvgNode(node: IconNode, color: string): string {
  const attrs = applySerializedColor(node.attrs, color);
  const attrText = Object.entries(attrs)
    .filter((entry): entry is [string, string | number] => entry[1] !== undefined)
    .map(([name, value]) => `${toKebabCase(name)}="${escapeAttr(String(value))}"`)
    .join(" ");
  const children =
    node.children?.map((child) => serializeSvgNode(child, color)).join("") ??
    "";

  return children
    ? `<${node.tag}${attrText ? ` ${attrText}` : ""}>${children}</${node.tag}>`
    : `<${node.tag}${attrText ? ` ${attrText}` : ""}/>`;
}

function applySerializedColor(
  attrs: IconNode["attrs"],
  color: string,
): NonNullable<IconNode["attrs"]> {
  if (!attrs) return {};

  return {
    ...attrs,
    fill: attrs.fill === defaultIconColor ? color : attrs.fill,
    stroke: attrs.stroke === defaultIconColor ? color : attrs.stroke,
  };
}

function encodeBase64(value: string): string {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
  let result = "";
  let index = 0;

  while (index < value.length) {
    const first = value.charCodeAt(index++);
    const second = index < value.length ? value.charCodeAt(index++) : NaN;
    const third = index < value.length ? value.charCodeAt(index++) : NaN;

    result += chars[first >> 2];
    result += chars[((first & 3) << 4) | (Number.isNaN(second) ? 0 : second >> 4)];
    result += Number.isNaN(second)
      ? "="
      : chars[((second & 15) << 2) | (Number.isNaN(third) ? 0 : third >> 6)];
    result += Number.isNaN(third) ? "=" : chars[third & 63];
  }

  return result;
}

function escapeAttr(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function toKebabCase(value: string): string {
  return value.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);
}
