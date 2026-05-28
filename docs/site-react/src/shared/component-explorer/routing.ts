import type { ComponentDoc } from "./types";

export function readSelectedDocId(docs: ComponentDoc[], overviewId?: string) {
  const pathComponentId = window.location.pathname.split("/").filter(Boolean)[1];

  if (pathComponentId && docs.some((doc) => doc.id === pathComponentId)) {
    return pathComponentId;
  }

  if (overviewId && (!pathComponentId || pathComponentId === overviewId)) {
    return overviewId;
  }

  const componentId = new URLSearchParams(window.location.search).get(
    "component",
  );

  if (componentId && docs.some((doc) => doc.id === componentId)) {
    return componentId;
  }

  return overviewId ?? docs[0]?.id ?? "";
}

export function buildSelectedDocPath(
  routePath: string,
  docId: string,
  overviewId?: string,
) {
  const normalizedRoute = routePath.startsWith("/") ? routePath : `/${routePath}`;
  const baseRoute = normalizedRoute.replace(/\/$/, "");

  if (overviewId && docId === overviewId) {
    return baseRoute;
  }

  return `${baseRoute}/${docId}`;
}

export function replaceSelectedDocRoute(
  routePath: string,
  docId: string,
  overviewId?: string,
) {
  const nextPath = buildSelectedDocPath(routePath, docId, overviewId);

  if (
    window.location.pathname === nextPath &&
    window.location.search.length === 0
  ) {
    return;
  }

  window.history.replaceState(null, "", `${nextPath}${window.location.hash}`);
}

export function writeSelectedDocToUrl(
  routePath: string,
  docId: string,
  overviewId?: string,
) {
  window.history.pushState(
    null,
    "",
    buildSelectedDocPath(routePath, docId, overviewId),
  );
}
