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
  { name: "components", label: "Components" },
  { name: "workshop", label: "Workshop" },
  { name: "tools", label: "Tools" },
] as const;

export interface HeaderTab {
  id: string;
  label: string;
  path: string;
}

export const headerTabs: HeaderTab[] = [
  { id: "documentation", label: "Documentation", path: "/docs" },
  { id: "components", label: "Components", path: "/components" },
  { id: "workshop", label: "Workshop", path: "/workshop/elements" },
];

export const getActiveHeaderTab = (pathname: string): string | undefined => {
  if (pathname.startsWith("/components")) return "components";
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
