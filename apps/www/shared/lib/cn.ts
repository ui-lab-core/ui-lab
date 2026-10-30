/** Joins the string class names, skipping falsy conditions. Dependency-free so `shared/` copies into any app. */
export function cn(...classes: unknown[]): string {
  return classes.filter((value): value is string => typeof value === "string" && value.length > 0).join(" ");
}
