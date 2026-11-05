"use client";

import { useCallback, useMemo, useState } from "react";
import { Expand } from "ui-lab-components";
import { useUrlSearchParams } from "@/shared/hooks/use-url-search-params";
import { cn } from "@/shared/lib/utils";
import { SidebarItemLink } from "@/features/navigation";
import { getStructureIcon } from "@ui-lab-core/library/gallery-previews";
import {
  EMPTY_WORKSHOP_NAVIGATION,
  type WorkshopNavGroup,
  type WorkshopNavigation,
  type WorkshopNavNode,
} from "@/features/workshop/types/navigation";

interface ElementsSidebarContentProps {
  activeNav: "packages" | "sections" | "starters" | "patterns";
  pathname: string;
  activeCategory?: string | null;
  /**
   * Ids and names only, projected on the server. The catalog itself carries
   * every entry's source and is never imported from a client module.
   */
  navigation?: WorkshopNavigation;
}

const NAV_LINK_BASE =
  "block px-3 py-1.5 text-foreground-300 text-sm font-medium rounded-sm cursor-pointer transition-colors";
const LINK_ACTIVE = "text-foreground-200 bg-background-800 font-medium";
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
      <Expand.Trigger className="text-sm font-medium text-foreground-300" title={name} />
      <Expand.Content className="pl-3">
        <div className="space-y-0.5 mt-1">{children}</div>
      </Expand.Content>
    </Expand>
  );
}

/** A kind label — the package's root level — with its icon. */
function KindLabel({ node }: { node: WorkshopNavNode }) {
  const Icon = getStructureIcon(node.icon);

  return (
    <p className="flex items-center gap-2 px-3 pt-2 pb-1 text-sm font-semibold text-foreground-200">
      {Icon && <Icon size={14} className="shrink-0 text-foreground-400" aria-hidden />}
      {node.name}
    </p>
  );
}

/** A purpose-category label inside a kind: plain text, no icon. */
function CategoryLabel({ name }: { name: string }) {
  return <p className="px-3 pt-3 pb-1 text-sm font-medium text-foreground-400">{name}</p>;
}

function EmptyState({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-full items-center justify-center px-6 text-center">
      <p className="text-sm text-foreground-400">{children}</p>
    </div>
  );
}

function ElementsListContent({
  activeNav,
  pathname,
  activeCategory,
  navigation = EMPTY_WORKSHOP_NAVIGATION,
}: ElementsSidebarContentProps) {
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

  const sortedSections = useMemo(() => {
    const filtered = activeCategory
      ? navigation.sections.filter((section) => section.category === activeCategory)
      : navigation.sections;
    return [...filtered].sort((a, b) => a.name.localeCompare(b.name));
  }, [navigation.sections, activeCategory]);

  const sortedStarters = useMemo(
    () => [...navigation.starters].sort((a, b) => a.name.localeCompare(b.name)),
    [navigation.starters],
  );

  const packages = navigation.packages;
  const packageElements = useMemo(() => {
    if (!currentPackageId) return [];
    return packages.find((pkg) => pkg.id === currentPackageId)?.elements ?? [];
  }, [packages, currentPackageId]);

  if (activeNav === "packages" && !isOnPackageRoute) {
    return (
      <div className="space-y-1 pt-2">
        {packages.map((pkg) => {
          const pkgElements = pkg.elements;
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

    const renderElement = (element: WorkshopNavGroup) => {
      const isActive = currentElementId === element.id;
      const href = `/workshop/elements/${currentPackageId}/${element.id}`;

      if (element.children.length === 0) {
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
          {element.children.map((variant) => {
            const isVariantActive = isActive && currentVariant === variant.id;
            return (
              <NavLink
                key={`${element.id}-${variant.id}`}
                href={`${href}?variant=${variant.id}`}
                isActive={isVariantActive}
              >
                {variant.name}
              </NavLink>
            );
          })}
        </ExpandGroup>
      );
    };

    const kinds = packages.find((pkg) => pkg.id === currentPackageId)?.kinds ?? [];
    const isStructured = kinds.length > 1 || kinds.some((kind) => kind.categories.length > 0);

    if (!isStructured) {
      return <div className="space-y-1">{packageElements.map(renderElement)}</div>;
    }

    const elementsById = new Map(packageElements.map((element) => [element.id, element]));
    const pick = (ids: string[]) =>
      ids
        .map((id) => elementsById.get(id))
        .filter((element): element is WorkshopNavGroup => Boolean(element));

    return (
      <div className="space-y-1">
        {kinds.map((kind) => (
          <div key={kind.id} className="space-y-1">
            <KindLabel node={kind} />
            {kind.elements.length === 0 && kind.categories.length === 0 && (
              <p className="px-3 pb-1 text-sm text-foreground-500">None yet</p>
            )}
            {pick(kind.elements).map(renderElement)}
            {kind.categories.map((category) => (
              <div key={category.id} className="space-y-1">
                <CategoryLabel name={category.name} />
                {pick(category.elements).map(renderElement)}
              </div>
            ))}
          </div>
        ))}
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
    return (
      <div className="space-y-4 pt-2">
        {navigation.patternCategories.map(({ category, patterns }) => {
          return (
            <div key={category} className="not-first:mt-8">
              <p className="mb-1 font-medium text-foreground-200 capitalize">{category}</p>
              <div className="space-y-0.5">
                {patterns.map((pattern) => {
                  const href = `/workshop/patterns/${pattern.id}`;

                  if (pattern.children.length === 0) {
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
                      {pattern.children.map((variation) => (
                        <NavLink
                          key={`${pattern.id}-${variation.id}`}
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

          if (section.children.length === 0) {
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
              {section.children.map((variant) => (
                <NavLink
                  key={`${section.id}-${variant.id}`}
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
