"use client";

import { useCallback, useMemo, useState } from "react";
import { Expand } from "ui-lab-components";
import { useUrlSearchParams } from "@/shared/hooks/use-url-search-params";
import { cn } from "@/shared/lib/utils";
import { SidebarItemLink } from "@/features/navigation";
import {
  getAllSections,
  getAllStarters,
  getSectionsInCategory,
  getAllPackages,
  getElementsInPackage,
  elementRegistry,
  getAllPatternCategories,
  getPatternsByCategory,
  type ElementCategoryId,
  type SectionCategoryId,
} from "@ui-lab-core/library/catalog";

interface ElementsSidebarContentProps {
  activeNav: "packages" | "sections" | "starters" | "patterns";
  pathname: string;
  activeCategory?: ElementCategoryId | SectionCategoryId | null;
}

const NAV_LINK_BASE =
  "block px-3 py-1.5 text-foreground-400 text-sm font-medium rounded-sm cursor-pointer transition-colors duration-300 ease-out hover:duration-0";
const LINK_ACTIVE = "text-foreground-50 bg-background-800 font-medium";
const LINK_INACTIVE = "text-foreground-200 hover:text-foreground-200 hover:bg-background-800/50";

function getPathSegments(pathname: string) {
  return pathname.split("/").filter(Boolean);
}

function NavLink({
  href,
  isActive,
  children,
}: {
  href: string;
  isActive: boolean;
  children: React.ReactNode;
}) {
  return (
    <SidebarItemLink
      href={href}
      className={cn(NAV_LINK_BASE, isActive ? LINK_ACTIVE : LINK_INACTIVE)}
    >
      {children}
    </SidebarItemLink>
  );
}

function ExpandGroup({
  name,
  isExpanded,
  onToggle,
  children,
}: {
  name: string;
  isExpanded: boolean;
  onToggle: (expanded: boolean) => void;
  children: React.ReactNode;
}) {
  return (
    <Expand expanded={isExpanded} onExpandedChange={onToggle} className="rounded-sm">
      <Expand.Trigger className="text-sm font-medium text-foreground-200" title={name} />
      <Expand.Content className="pl-3">
        <div className="space-y-0.5 mt-1">{children}</div>
      </Expand.Content>
    </Expand>
  );
}

function EmptyState({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-full items-center justify-center px-6 text-center">
      <p className="text-sm text-foreground-400">{children}</p>
    </div>
  );
}

function ElementsListContent({ activeNav, pathname, activeCategory }: ElementsSidebarContentProps) {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const searchParams = useUrlSearchParams();
  const currentVariant = searchParams.get("variant");

  const toggleItem = useCallback(
    (id: string) => (expanded: boolean) => {
      setExpandedItems((prev) => {
        const next = new Set(prev);
        if (expanded) next.add(id);
        else next.delete(id);
        return next;
      });
    },
    [],
  );

  const currentItemId = useMemo(() => {
    const segments = getPathSegments(pathname);
    if (activeNav === "sections") {
      return segments[0] === "sections" ? (segments[1] ?? null) : null;
    }
    if (activeNav === "starters") {
      return segments[0] === "starters" ? (segments[1] ?? null) : null;
    }
    if (activeNav === "patterns") {
      return segments[0] === "patterns" ? (segments[1] ?? null) : null;
    }
    return segments[0] === "packages" ? (segments[1] ?? null) : null;
  }, [pathname, activeNav]);

  const currentPackageId = useMemo(() => {
    if (activeNav !== "packages") return null;
    const segments = getPathSegments(pathname);
    return segments[0] === "packages" ? (segments[1] ?? null) : null;
  }, [pathname, activeNav]);

  const currentElementId = useMemo(() => {
    if (activeNav !== "packages") return null;
    const segments = getPathSegments(pathname);
    return segments[0] === "packages" ? (segments[2] ?? null) : null;
  }, [pathname, activeNav]);

  const isOnPackageRoute = useMemo(() => {
    return activeNav === "packages" && currentPackageId !== null;
  }, [activeNav, currentPackageId]);

  const effectiveExpandedItems = useMemo(() => {
    const next = new Set(expandedItems);
    if (currentItemId) next.add(currentItemId);
    if (currentElementId) next.add(currentElementId);
    if (currentPackageId && activeNav === "packages") next.add(currentPackageId);
    return next;
  }, [expandedItems, currentItemId, currentElementId, currentPackageId, activeNav]);

  const sections = useMemo(() => getAllSections(), []);
  const starters = useMemo(() => getAllStarters(), []);

  const sortedSections = useMemo(() => {
    const filtered = activeCategory
      ? getSectionsInCategory(sections, activeCategory as SectionCategoryId)
      : sections;
    return [...filtered].sort((a, b) => a.name.localeCompare(b.name));
  }, [sections, activeCategory]);

  const sortedStarters = useMemo(
    () => [...starters].sort((a, b) => a.name.localeCompare(b.name)),
    [starters],
  );

  const packages = useMemo(() => getAllPackages(), []);
  const packageElements = useMemo(() => {
    if (!currentPackageId) return [];
    return getElementsInPackage(currentPackageId)
      .map((id) => elementRegistry[id])
      .filter(Boolean);
  }, [currentPackageId]);

  if (activeNav === "packages" && !isOnPackageRoute) {
    return (
      <div className="space-y-1 pt-2">
        {packages.map((pkg) => {
          const pkgElements = getElementsInPackage(pkg.id)
            .map((id) => elementRegistry[id])
            .filter(Boolean);
          const href = `/workshop/elements/${pkg.id}`;

          if (pkgElements.length === 0) {
            return (
              <NavLink key={pkg.id} href={href} isActive={currentPackageId === pkg.id}>
                {pkg.name}
              </NavLink>
            );
          }

          return (
            <div key={pkg.id}>
              <ExpandGroup
                name={pkg.name}
                isExpanded={effectiveExpandedItems.has(pkg.id)}
                onToggle={toggleItem(pkg.id)}
              >
                {pkgElements.map((element) => (
                  <NavLink
                    key={element.id}
                    href={`/workshop/elements/${pkg.id}/${element.id}`}
                    isActive={currentPackageId === pkg.id && currentElementId === element.id}
                  >
                    {element.name}
                  </NavLink>
                ))}
              </ExpandGroup>
            </div>
          );
        })}
      </div>
    );
  }

  if (activeNav === "packages" && isOnPackageRoute) {
    if (packageElements.length === 0) {
      return <EmptyState>No elements in this package yet.</EmptyState>;
    }

    return (
      <div className="space-y-1">
        {packageElements.map((element) => {
          const isActive = currentElementId === element.id;
          const href = `/workshop/elements/${currentPackageId}/${element.id}`;

          if (element.variants.length === 0) {
            return (
              <NavLink key={element.id} href={href} isActive={isActive}>
                {element.name}
              </NavLink>
            );
          }

          return (
            <ExpandGroup
              key={element.id}
              name={element.name}
              isExpanded={effectiveExpandedItems.has(element.id)}
              onToggle={toggleItem(element.id)}
            >
              {element.variants.map((variant) => {
                const variantId = variant.demoPath || variant.name;
                const isVariantActive = isActive && currentVariant === variantId;
                return (
                  <NavLink
                    key={`${element.id}-${variantId}`}
                    href={`${href}?variant=${variantId}`}
                    isActive={isVariantActive}
                  >
                    {variant.name}
                  </NavLink>
                );
              })}
            </ExpandGroup>
          );
        })}
      </div>
    );
  }

  if (activeNav === "starters") {
    if (sortedStarters.length === 0) {
      return <EmptyState>No starters available yet.</EmptyState>;
    }

    return (
      <div className="space-y-1">
        {sortedStarters.map((starter) => (
          <NavLink
            key={starter.id}
            href={`/workshop/starters/${starter.id}`}
            isActive={currentItemId === starter.id}
          >
            {starter.name}
          </NavLink>
        ))}
      </div>
    );
  }

  if (activeNav === "patterns") {
    const patternCategories = getAllPatternCategories();

    return (
      <div className="space-y-4 pt-2">
        {patternCategories.map((category) => {
          const patterns = getPatternsByCategory(category);
          return (
            <div key={category} className="not-first:mt-8">
              <p className="mb-1 font-medium text-foreground-200 capitalize">{category}</p>
              <div className="space-y-0.5">
                {patterns.map((pattern) => {
                  const href = `/workshop/patterns/${pattern.id}`;

                  if (!pattern.variations || pattern.variations.length === 0) {
                    return (
                      <NavLink key={pattern.id} href={href} isActive={currentItemId === pattern.id}>
                        {pattern.name}
                      </NavLink>
                    );
                  }

                  return (
                    <ExpandGroup
                      key={pattern.id}
                      name={pattern.name}
                      isExpanded={effectiveExpandedItems.has(pattern.id)}
                      onToggle={toggleItem(pattern.id)}
                    >
                      {(pattern.variations ?? []).map((variation) => (
                        <NavLink
                          key={`${pattern.id}-${variation.name}`}
                          href={href}
                          isActive={currentItemId === pattern.id}
                        >
                          {variation.name}
                        </NavLink>
                      ))}
                    </ExpandGroup>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  if (activeNav === "sections") {
    if (sortedSections.length === 0) {
      return <EmptyState>No sections in this category yet.</EmptyState>;
    }

    return (
      <div className="space-y-1">
        {sortedSections.map((section) => {
          const href = `/workshop/sections/${section.id}`;

          if (section.variants.length === 0) {
            return (
              <NavLink key={section.id} href={href} isActive={currentItemId === section.id}>
                {section.name}
              </NavLink>
            );
          }

          return (
            <ExpandGroup
              key={section.id}
              name={section.name}
              isExpanded={effectiveExpandedItems.has(section.id)}
              onToggle={toggleItem(section.id)}
            >
              {section.variants.map((variant) => (
                <NavLink
                  key={`${section.id}-${variant.demoPath ?? variant.name}`}
                  href={href}
                  isActive={currentItemId === section.id}
                >
                  {variant.name}
                </NavLink>
              ))}
            </ExpandGroup>
          );
        })}
      </div>
    );
  }

  return null;
}

export function ElementsList(props: ElementsSidebarContentProps) {
  return <ElementsListContent {...props} />;
}
