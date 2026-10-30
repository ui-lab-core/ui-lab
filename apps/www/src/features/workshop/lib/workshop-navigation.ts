import "server-only";

import {
  getAllPackages,
  getAllPatternCategories,
  getAllSections,
  getAllStarters,
  getElementsInPackage,
  getPackageStructure,
  getPatternsByCategory,
  elementRegistry,
} from "@ui-lab-core/library/catalog";
import type { WorkshopNavigation, WorkshopNavKind } from "@/features/workshop/types/navigation";

/** The package's kind and category tree, reduced to ids, labels, and icon names. */
export function getWorkshopPackageKinds(packageId: string): WorkshopNavKind[] {
  return getPackageStructure(packageId).map((kind) => ({
    id: kind.id,
    name: kind.displayName,
    description: kind.description,
    icon: kind.icon,
    elements: kind.items,
    categories: kind.categories.map((category) => ({
      id: category.id,
      name: category.displayName,
      description: category.description,
      icon: category.icon,
      elements: category.items,
    })),
  }));
}

/**
 * Projects the catalog down to the sidebar's navigation index. Nothing here
 * carries source: the catalog stays on the server and only ids and names are
 * serialized into the RSC payload.
 */
export function getWorkshopNavigation(): WorkshopNavigation {
  return {
    packages: getAllPackages().map((pkg) => ({
      id: pkg.id,
      name: pkg.name,
      elements: getElementsInPackage(pkg.id)
        .map((id) => elementRegistry[id])
        .filter(Boolean)
        .map((element) => ({
          id: element.id,
          name: element.name,
          children: element.variants.map((variant) => ({
            id: variant.demoPath || variant.name,
            name: variant.name,
          })),
        })),
      kinds: getWorkshopPackageKinds(pkg.id),
    })),

    sections: getAllSections().map((section) => ({
      id: section.id,
      name: section.name,
      category: section.category,
      children: section.variants.map((variant) => ({
        id: variant.demoPath ?? variant.name,
        name: variant.name,
      })),
    })),

    starters: getAllStarters().map((starter) => ({ id: starter.id, name: starter.name })),

    patternCategories: getAllPatternCategories().map((category) => ({
      category,
      patterns: getPatternsByCategory(category).map((pattern) => ({
        id: pattern.id,
        name: pattern.name,
        children: (pattern.variations ?? []).map((variation) => ({
          id: variation.id,
          name: variation.name,
        })),
      })),
    })),
  };
}
