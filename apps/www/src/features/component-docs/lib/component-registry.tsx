"use client";

import React from "react";
import { previews } from "@/gallery";
import {
  categoryMap as registryCategoryMap,
  componentRegistry as registryData,
  type ComponentMetadata as RegistryMetadata,
  getComponentsInOrder,
  getCategoriesInOrder as getRegistryCategoriesInOrder,
} from "ui-lab-registry";
import { type SiteComponentCategory, type SiteComponentCategoryDefinition } from "./coming-soon";

interface ComponentMetadata extends RegistryMetadata {
  preview: React.ReactNode;
  experimental?: boolean;
}

export const categoryMap = registryCategoryMap as Record<
  SiteComponentCategory,
  SiteComponentCategoryDefinition
>;

export const getCategoriesInOrder = (): SiteComponentCategory[] => getRegistryCategoriesInOrder();

const componentRegistry: ComponentMetadata[] = Object.entries(registryData).map(
  ([id, metadata]) => ({
    ...metadata,
    preview: previews[id] || <div />,
  }),
);

export const getComponentsInCategoryOrder = (
  category: SiteComponentCategory,
): ComponentMetadata[] => {
  const componentIds = getComponentsInOrder(category);
  return componentIds
    .map((id: string) => componentRegistry.find((c): c is ComponentMetadata => c.id === id))
    .filter((c): c is ComponentMetadata => c !== undefined);
};
