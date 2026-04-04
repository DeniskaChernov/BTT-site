/** Общая логика активного пункта навбара (MenuBar / MenuBarKinetic / Header). */

export function pathMatches(pathname: string, href: string) {
  if (href === "/") return pathname === "/" || pathname === "";
  if (href === "/catalog") {
    return (
      pathname === "/catalog" ||
      pathname.startsWith("/catalog/") ||
      pathname.startsWith("/product/")
    );
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function itemIsActive(pathname: string, href: string, hash: string) {
  if (href.includes("#")) {
    const [pathPart, frag] = href.split("#");
    const base = pathPart === "" || pathPart === "/" ? "/" : pathPart;
    if (!pathMatches(pathname, base)) return false;
    return hash === `#${frag}`;
  }
  if (href === "/") {
    if (!pathMatches(pathname, "/")) return false;
    if (hash === "#hits") return false;
    return true;
  }
  return pathMatches(pathname, href);
}

export function resolveActiveNavLabel<T extends { href: string; label: string }>(
  items: T[],
  pathname: string,
  hash: string
): string | undefined {
  for (const item of items) {
    if (itemIsActive(pathname, item.href, hash)) return item.label;
  }
  return undefined;
}
