import "server-only";

import {
  getAllPackages,
  getAllPatternCategories,
  getAllSections,
  getAllStarters,
  getElementsInPackage,
  getPatternsByCategory,
  elementRegistry,
} from "@ui-lab-core/library/catalog";
import type { WorkshopNavigation } from "@/features/workshop/types/navigation";

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
