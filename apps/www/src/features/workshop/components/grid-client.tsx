"use client";
import React from "react";
import { GenericContentGrid } from "./content-grid";
import { getLayoutConfig } from "../lib/layout-registry";
import { getPreviewComponent } from "@/features/workshop/lib/get-element-preview";
import type { ElementMetadata } from "@ui-lab-core/library/catalog";

interface ElementsGridClientProps {
  elements: ElementMetadata[];
  packageId?: string;
}

function buildPreviews(elements: ElementMetadata[], packageId?: string) {
  const result: Record<string, React.ReactNode> = {};
  for (const el of elements) {
    const C = getPreviewComponent(el.id, packageId);
    if (C) result[el.id] = <C />;
  }
  return result;
}

function buildLayoutConfigs(elements: ElementMetadata[]) {
  const result: Record<string, ReturnType<typeof getLayoutConfig>> = {};
  for (const el of elements) {
    result[el.id] = getLayoutConfig(el);
  }
  return result;
}

/**
 * Element listings are the same whether the package is free or Supporter-only:
 * the gate lives on each entry's detail route, so the grid only lists.
 */
export function ElementsGridClient({ elements, packageId }: ElementsGridClientProps) {
  const basePath = packageId ? `/workshop/elements/${packageId}` : "/workshop/elements";
  const previews = buildPreviews(elements, packageId);
  const layoutConfigs = buildLayoutConfigs(elements);

  return (
    <GenericContentGrid
      items={elements}
      basePath={basePath}
      layoutConfigs={layoutConfigs}
      previews={previews}
      previewKind="element"
      premiumFrame={false}
    />
  );
}
