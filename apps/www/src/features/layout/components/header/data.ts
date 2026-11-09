import { FaPalette, FaFill, FaIcons, FaWandMagicSparkles } from "@/shared/icons/fa6";
import type { ComponentType } from "react";

interface NavigationItem {
  name: string;
  label: string;
  icon?: ComponentType;
  isDropdown?: boolean;
}

export const navigationData: NavigationItem[] = [
  { name: "documentation", label: "Documentation", isDropdown: true },
  { name: "components", label: "Library" },
  { name: "workshop", label: "Workshop" },
  { name: "tools", label: "Tools" },
] as const;

export interface HeaderTab {
  id: string;
  label: string;
  path: string;
}

/** Client mirror of AUTH_ENABLED; inlined at build time. */
export const authEnabled = process.env.NEXT_PUBLIC_AUTH_ENABLED === "true";

export const headerTabs: HeaderTab[] = [
  { id: "documentation", label: "Documentation", path: "/docs" },
  { id: "components", label: "Library", path: "/library" },
  { id: "workshop", label: "Workshop", path: "/workshop/elements" },
  ...(authEnabled ? [{ id: "pricing", label: "Pricing", path: "/supporter" }] : []),
];

export const libraryItems = [
  { id: "components", label: "Components", path: "/library/components", icon: "blocks" },
  { id: "icons", label: "Icons", path: "/library/icons", icon: "sparkle" },
];

export const getActiveLibraryItem = (pathname: string): string | undefined =>
  libraryItems.find((item) => pathname.startsWith(item.path))?.id;

export const getActiveHeaderTab =(pathname: string): string | undefined => {
  if (pathname.startsWith("/supporter")) return "pricing";
  if (pathname.startsWith("/library")) return "components";
  if (pathname.startsWith("/workshop")) return "workshop";
  if (
    pathname.startsWith("/docs") ||
    pathname.startsWith("/design-system") ||
    pathname.startsWith("/changelog") ||
    pathname.startsWith("/config")
  ) {
    return "documentation";
  }
  return undefined;
};

export const documentationItems = [
  { id: "overview", label: "Overview" },
  { id: "installation", label: "Installation" },
  { id: "usage", label: "Usage" },
];

export const getDocumentationLink = (id: string) => (id === "overview" ? "/docs" : `/docs/${id}`);

export const toolsItems = [
  {
    title: "Color Palette Generator",
    description: "Generate beautiful color schemes.",
    href: "/tools/color-palette",
    icon: FaPalette,
  },
  {
    title: "Gradient Generator",
    description: "Create smooth CSS gradients easily.",
    href: "/tools/gradient",
    icon: FaFill,
  },
  {
    title: "Icon Finder",
    description: "Search and copy any icon instantly.",
    href: "/tools/icons",
    icon: FaIcons,
  },
  {
    title: "CSS Gradient Animator",
    description: "Animate gradients with pure CSS.",
    href: "/tools/css-animator",
    icon: FaWandMagicSparkles,
  },
];
