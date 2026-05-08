import type { ComponentDoc } from "./types";

export function readSelectedDocId(docs: ComponentDoc[]) {
  const pathComponentId = window.location.pathname.split("/").filter(Boolean)[1];

  if (pathComponentId && docs.some((doc) => doc.id === pathComponentId)) {
    return pathComponentId;
  }

  const componentId = new URLSearchParams(window.location.search).get(
    "component",
  );

  if (componentId && docs.some((doc) => doc.id === componentId)) {
    return componentId;
  }

  return docs[0]?.id ?? "";
}

export function buildSelectedDocPath(routePath: string, docId: string) {
  const normalizedRoute = routePath.startsWith("/") ? routePath : `/${routePath}`;

  return `${normalizedRoute.replace(/\/$/, "")}/${docId}`;
}

export function replaceSelectedDocRoute(routePath: string, docId: string) {
  const nextPath = buildSelectedDocPath(routePath, docId);

  if (
    window.location.pathname === nextPath &&
    window.location.search.length === 0
  ) {
    return;
  }

  window.history.replaceState(null, "", `${nextPath}${window.location.hash}`);
}

export function writeSelectedDocToUrl(routePath: string, docId: string) {
  window.history.pushState(null, "", buildSelectedDocPath(routePath, docId));
}
